import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderDataType, ShoppingBasketBaggages, ShoppingBasketFlexibilization, ShoppingBasketGlobickTransfers, ShoppingBasketInsuranceAllianzFusion, ShoppingBasketPriority, ShoppingBasketSeats, ShoppingBasketSpeqs } from '@src/app/core/models/ib-booking-availability/header-model';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IbBookingCurrencyUtilsService } from '../../services/ib-utils/ib-booking-currency-utils.service';

import { AncillaryInfo, AncillaryRow, DiscountItem, DiscountsModel, PaxItem, PreparedDiscount, PriceDetailAncillaries, TotalsType, TotalSubType } from './price-detail-modal-models';
import { IbBookingHeaderFacadeService } from '../ib-booking-header/services/ib-booking-header-facade.service';

@Component({
    selector: 'ib-booking-price-detail-modal',
    templateUrl: './ib-booking-price-detail-modal.component.html',
    styleUrls: ['./ib-booking-price-detail-modal.component.scss']
})
export class IbBookingPriceDetailModalComponent implements OnInit, OnDestroy {
    @Input() priceDetails: AvailabilityTransformerModel.OfferItem[];
    
    public paxTypeItems: PaxItem[];

    public ancillaries: PriceDetailAncillaries = null;
    public discounts: PreparedDiscount | null = null;
    public otherCharges: PreparedDiscount | null = null;

    public totals: TotalsType = null;
    public totalPrice: string = null;
    
    private headerSubscription?: Subscription;

    constructor (
        private activeModal: NgbActiveModal,
        private translateService: TranslateService,
        private sessionStorage: CommonsSessionStorageService,
        private currencyService: IbBookingCurrencyUtilsService,
        private headerFacade: IbBookingHeaderFacadeService
    ) {}

    ngOnInit (): void {
        this.initializeComponent();
    }

    ngOnDestroy (): void {
        this.headerSubscription?.unsubscribe();
    }

    public close (): void {
        this.activeModal.close();
    }

    private initializeComponent = (): void => {
        if (this.priceDetails) {
            this.processInitialPriceDetails();
        }
        this.initializeHeaderSubscription();
    };

    private processInitialPriceDetails = (): void => {
        let formattedPricingInfo = [];

        this.priceDetails.forEach(pax => {
            let paxType = pax.passengerIds[0].split('_')[0];
            let item: PaxItem = {
                paxType: paxType,
                titles: [this.translateService.instant(paxType), this.translateService.instant(`SOME_${paxType}`)],
                taxes: this.mapDetailedTaxes(pax.detailedTaxes),
                price: this.mapPriceObject(pax.price, pax.passengerIds.length),
                qty: pax.passengerIds.length
            };
            formattedPricingInfo.push(item);
        });

        this.paxTypeItems = formattedPricingInfo;

        this.totals = {
            taxes: this.calculateTotal('Tax'),
            fares: this.calculateTotal('Fare')
        };
    };

    private formatPrice = (amount: number | undefined | null) =>
        this.currencyService.getPriceFormatted(Number(amount || 0), true);

    private mapDetailedTaxes = (detailedTaxes: any[] = []) =>
        detailedTaxes.map(t => ({
            ...t,
            totalFormatted: this.formatPrice(t.amount)
        }));

    private mapPriceObject = (price: any, qty: number) => ({
        ...price,
        allPassengersTotal: price?.total * qty,
        allPassengersTax: price?.tax * qty,
        allPassengersFare: price?.fare * qty,
        formattedPrices: this.mapFormattedItems(price),
        formattedTotals: this.mapFormattedTotals(price, qty)
    });

    private mapFormattedItems = (price) => {
        return {
            fareFormatted: this.formatPrice(price?.fare),
            taxFormatted: this.formatPrice(price?.tax),
            totalFormatted: this.formatPrice(price?.total)
        };
    };

    private mapFormattedTotals = (price, qty) => {
        return {
            allPassengersTaxFormatted: this.formatPrice(price?.tax * qty),
            allPassengersFareFormatted: this.formatPrice(price?.fare * qty),
            allPassengersTotalFormatted: this.formatPrice(price?.total * qty)
        };
    };

    private calculateTotal = (type: 'Tax' | 'Fare'): TotalSubType => {
        let sum = this.paxTypeItems.reduce((sum, item) => sum + item.price[`allPassengers${type}`], 0);
        return {
            total: sum,
            totalFormatted: this.formatPrice(sum)
        };
    };

    private initializeHeaderSubscription = (): void => {
        const headerModel = this.sessionStorage.get<HeaderDataType>('headerModel');
        
        if (headerModel?.headerModel?.shoppingBasket) {
            this.updateModalData(headerModel);
        }

        this.headerSubscription = this.headerFacade
            .getObservableHeader()
            .subscribe(this.handleHeaderUpdate.bind(this));
    };

    private handleHeaderUpdate = (newHeaderModel: HeaderDataType): void => {
        if (newHeaderModel?.headerModel?.shoppingBasket) {
            this.updateModalData(newHeaderModel);
        }
    };

    private updateModalData = (headerModel: HeaderDataType): void => {
        this.ancillaries = this.prepareAncillaries(headerModel);
        this.discounts = this.prepareDiscounts(headerModel);
        this.otherCharges = this.prepareOthers(headerModel);
        this.totalPrice = this.prepareTotalPrice(headerModel);
        
    };

    private prepareTotalPrice = (headerModel: HeaderDataType): string => {
        const totalFromPriceDetails = this.formatPrice(this.priceDetails[0]?.price?.total);
        const totalFromBasket = headerModel?.headerModel?.shoppingBasket?.total?.formatted;
        const isMetaFirstStep = this.isMetasearchFirstStep(headerModel);

        return isMetaFirstStep ? totalFromPriceDetails : (totalFromBasket ?? totalFromPriceDetails);
    };

    private isMetasearchFirstStep = (headerModel: HeaderDataType): boolean => {
        return (
            headerModel?.headerModel?.flightType === 'metasearchFlight' &&
            headerModel?.stepsModel?.currentStep?.index === 1
        );
    };


    private prepareDiscounts = (headerModel: HeaderDataType): PreparedDiscount | null => {
        const discounts = headerModel.headerModel.shoppingBasket.discountsModel as unknown as DiscountsModel;
        if (!discounts?.hasDiscounts) {
            return null;
        }

        return {
            items: Object.values(discounts.discounts).map(this.mapDiscountItem),
            total: discounts.total,
            totalFormatted: discounts.totalFormated
        };
    };

    private prepareOthers = (headerModel: HeaderDataType): PreparedDiscount | null => {
        const others = headerModel.headerModel.shoppingBasket.othersModel;
        if (!others.hasElements) {
            return null;
        }

        return {
            items: Object.values(others.others).map(other => {
                return {
                    description: other.description,
                    total: other.total,
                    totalFormatted: other.totalFormatted
                };
            }),
            total: others.total.total,
            totalFormatted: others.total.totalFormatted
        };
    };

    
    private mapDiscountItem = (discount: DiscountItem) => {
        return {
            description: discount.description || discount.type,
            total: discount.totalDiscount,
            totalFormatted: discount.discountFormatted
        };
    };

    private prepareAncillaries (headerModel: HeaderDataType): AncillaryInfo {
        const { baggages, speqs, flexibilization, globickTransfers, insuranceAllianzFusionInfo, priorityBoarding, seats } = headerModel.headerModel.shoppingBasket;
    
        const rows: AncillaryRow[] = [];
        let totalPrice = 0;

        const ancillaryProcessors = [
            () => this.processBaggageAncillary(baggages, rows),
            () => this.processSpeqAncillary(speqs, rows),
            () => this.processFlexibilizationAncillary(flexibilization, rows),
            () => this.processInsuranceAncillary(insuranceAllianzFusionInfo, rows),
            () => this.processTransfersAncillary(globickTransfers, rows),
            () => this.processSeats(seats, rows),
            () => this.processPriorityBoarding(priorityBoarding, rows)
        ];

        totalPrice = ancillaryProcessors.reduce((total, processor) => total + processor(), 0);
        
        return {
            rows,
            totalPrice,
            totalFormatted: this.formatPrice(totalPrice)
        };
    }

    private calculateItemsInfo = (segments: any[], itemType: string) => {
        const items = segments?.flatMap(s => s?.[itemType] ?? []) ?? [];
        return items.reduce(
            (acc, it) => ({
                quantity: acc.quantity + (it?.quanty ?? 0),
                total: acc.total + (it?.total ?? 0)
            }),
            { quantity: 0, total: 0 }
        );
    };

    private hasFlexibilization = (flexibilization: ShoppingBasketFlexibilization): boolean => {
        return !!(flexibilization?.hasFlexibilization && flexibilization.info?.amount?.price);
    };
    
    private hasAllianzInsurance = (insurance: ShoppingBasketInsuranceAllianzFusion): boolean => {
        return !!(insurance?.hasInsuranceAllianzFusion && insurance?.info);
    };
    
    private hasSeats = (seats: ShoppingBasketSeats): boolean => {
        return !!(seats?.hasSeats && seats?.segments?.length > 0);
    };
    
    private hasPriorityBoarding = (priorityBoarding: ShoppingBasketPriority): boolean => {
        return !!(priorityBoarding?.hasPriorityBoarding && priorityBoarding?.info);
    };
    
    private hasTransfers = (transfers: ShoppingBasketGlobickTransfers): boolean => {
        return !!(transfers.hasTransfersGlobick && transfers.info);
    };

    private processBaggageAncillary = (baggages: ShoppingBasketBaggages, rows: AncillaryRow[]): number => {
        const baggageInfo = this.calculateItemsInfo(baggages?.segments, 'baggages');
        if (baggageInfo.quantity > 0 || baggageInfo.total > 0) {
            rows.push(this.createAncillaryRow('ANCILLARIES_BAGGAGE_TITLE', baggageInfo));
            return baggageInfo.total;
        }
        return 0;
    };

    private processSpeqAncillary = (speqs: ShoppingBasketSpeqs, rows: AncillaryRow[]): number => {
        const speqInfo = this.calculateItemsInfo(speqs?.segments, 'speqs');
        if (speqInfo.quantity > 0 || speqInfo.total > 0) {
            rows.push(this.createAncillaryRow('ANCILLARIES_SPEQS_TITLE_TEXT', speqInfo));
            return speqInfo.total;
        }
        return 0;
    };

    private processFlexibilizationAncillary = (flexibilization: ShoppingBasketFlexibilization, rows: AncillaryRow[]): number => {
        if (this.hasFlexibilization(flexibilization)) {
            const flexPrice = Number(flexibilization.info.amount.price) || 0;
            rows.push(this.createFlexibilityRow(flexibilization));
            return flexPrice;
        }
        return 0;
    };

    private processInsuranceAncillary = (insuranceAllianzFusionInfo: ShoppingBasketInsuranceAllianzFusion, rows: AncillaryRow[]): number => {
        if (this.hasAllianzInsurance(insuranceAllianzFusionInfo)) {
            const price = Number(insuranceAllianzFusionInfo?.total?.total) || 0;
            rows.push(this.createInsuranceRow(insuranceAllianzFusionInfo));
            return price;
        }
        return 0;
    };

    private processTransfersAncillary = (globickTransfers: ShoppingBasketGlobickTransfers, rows: AncillaryRow[]): number => {
        if (this.hasTransfers(globickTransfers)) {
            const price = Number(globickTransfers.total.total) || 0;
            rows.push(this.createTransfersRow(globickTransfers));
            return price;
        }
        return 0;
    };

    private processSeats = (seats: ShoppingBasketSeats, rows: AncillaryRow[]): number => {
        if (this.hasSeats(seats)) {
            const price = Number(seats.total.total) || 0;
            rows.push(this.createSeatsRow(seats));
            return price;
        }
        return 0;
    };

    private processPriorityBoarding = (priorityBoarding: ShoppingBasketPriority, rows: AncillaryRow[]): number => {
        if (this.hasPriorityBoarding(priorityBoarding)) {
            const price = Number(priorityBoarding.info.amount) || 0;
            rows.push(this.createPriorityBoardingRow(priorityBoarding));
            return price;
        }
        return 0;
    };

    private createAncillaryRow = (category: string, info: { quantity: number; total: number }): AncillaryRow => {
        return {
            category: this.translateService.instant(category),
            quantity: info.quantity,
            total: this.formatPrice(info.total)
        };
    };

    private createFlexibilityRow = (flexibilization: ShoppingBasketFlexibilization): AncillaryRow => {
        return {
            category: this.translateService.instant('ANCILLARIES_FLEXIBILITY_TITLE'),
            quantity: 1,
            total: this.formatPrice(
                Number(flexibilization.info.amount.price) || 0)
        };
    };

    private createTransfersRow = (transfers: ShoppingBasketGlobickTransfers) => {
        return {
            category: this.translateService.instant('GLOBICK_TRANSFERS_BANNER_TITLE'),
            quantity: 1,
            total: transfers.total.totalFormatted
        };
    };

    private createInsuranceRow = (insurance: ShoppingBasketInsuranceAllianzFusion) => {
        return {
            category: this.translateService.instant('ANCILLARIES_INSURANCE_ALLIANZ_FUSION_MODAL_TITLE'),
            quantity: 1,
            total: insurance.total.totalFormatted
        };
    };

    private createSeatsRow = (seats: ShoppingBasketSeats) => {
        let qty = seats.segments.reduce((sum, item) => sum + item.quanty, 0);
        return {
            category: this.translateService.instant('SEATS_TEXT'),
            quantity: qty,
            total: seats.total.totalFormatted
        };
    };

    private createPriorityBoardingRow  = (priorityBoarding: ShoppingBasketPriority) => {
        let qty = priorityBoarding.info.trips.reduce((sum, item) => sum + item.quantity, 0);
        return {
            category: this.translateService.instant('PRIORITY_BOARDING_TITLE'),
            quantity: qty,
            total: priorityBoarding.info.priceFormatted
        };
    };
}

downgradeToAJSComponent(
    'ibBookingPriceDetailModal',
    { component: IbBookingPriceDetailModalComponent },
    'ib-booking-price-detail-modal-module'
);
