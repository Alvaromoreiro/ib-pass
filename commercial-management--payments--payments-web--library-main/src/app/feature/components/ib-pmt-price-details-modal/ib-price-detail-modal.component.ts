import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AJSCurrencyService, CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { AncillaryInfo, AncillaryRow, DiscountItem, DiscountsModel, PaxItem, PreparedDiscount, PriceDetailAncillaries, TotalsType, TotalSubType } from './price-detail-modal-models';
import { AJSNewMainHeaderFacadeToken } from '../../../../components/ib-payments/cmpnts/ib-pmt/service/ib-header-facade-bridge.service';
import { HeaderDataType } from 'src/app/core/models/ib-booking-header-model';
import angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';

@Component({
    selector: 'ib-price-detail-modal',
    templateUrl: './ib-price-detail-modal.component.html',
    styleUrls: ['./ib-price-detail-modal.component.scss']
})
export class IbPriceDetailModalComponent implements OnInit, OnDestroy {
    @Input() priceDetails: any;
    
    public paxTypeItems: PaxItem[];

    private currency;

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
        @Inject(AJSNewMainHeaderFacadeToken) private headerFacade,
        @Inject(AJSCurrencyService) private currencyService: CurrencyService
    ) {}

    ngOnInit (): void {
        this.currency = this.currencyService.getCurrencyObject(this.sessionStorage.get<any>('commercialData').currency);
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

    private formatPrice = (amount: number | undefined | null) => {
        return this.currencyService.formatPrice(this.currency, Number(amount || 0), true, false); 
    };
    
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

    private prepareOthers = (headerModel: HeaderDataType): PreparedDiscount | null => {
        const others = headerModel.headerModel.shoppingBasket.othersModel;
        if (!others || !others.hasElements) {
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
    private prepareTotalPrice = (headerModel: HeaderDataType): string => {
        const totalFromPriceDetails = this.formatPrice(this.priceDetails[0]?.price?.total);
        const totalFromBasket = headerModel?.headerModel?.shoppingBasket?.total?.formatted;
        
        const isMetaFirstStep = this.isMetasearchFirstStep(headerModel);

        return isMetaFirstStep ? totalFromPriceDetails : (totalFromBasket ?? totalFromPriceDetails);
    };

    private isMetasearchFirstStep = (headerModel): boolean => {
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

    private mapDiscountItem = (discount: DiscountItem) => {
        return {
            description: discount.description,
            total: discount.totalDiscount,
            totalFormatted: discount.discountFormatted
        };
    };


    private prepareAncillaries (headerModel: HeaderDataType): AncillaryInfo {
        const { baggages, speqs, flexibilization, globickTransfers, insurance, insuranceAllianzFusionInfo, priorityBoarding, seats } = headerModel.headerModel.shoppingBasket;
    
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

    
    private hasFlexibilization = (flexibilization: any): boolean => {
        return !!(flexibilization?.hasFlexibilization && flexibilization.info?.amount?.price);
    };
    
    private hasAllianzInsurance = (insurance: any): boolean => {
        return !!(insurance?.hasInsuranceAllianzFusion && insurance?.info);
    };
    
    private hasSeats = (seats: any): boolean => {
        return !!(seats?.hasSeats && seats?.segments?.length > 0);
    };
    
    private hasPriorityBoarding = (priorityBoarding: any): boolean => {
        return !!(priorityBoarding?.hasPriorityBoarding && priorityBoarding?.info);
    };
    
    private hasTransfers = (transfers: any): boolean => {
        return !!(transfers.hasTransfersGlobick && transfers.info);
    };

    private processBaggageAncillary = (baggages: any, rows: AncillaryRow[]): number => {
        const baggageInfo = this.calculateItemsInfo(baggages?.segments, 'baggages');
        if (baggageInfo.quantity > 0 || baggageInfo.total > 0) {
            rows.push(this.createAncillaryRow('ANCILLARIES_BAGGAGE_TITLE', baggageInfo));
            return baggageInfo.total;
        }
        return 0;
    };

    private processSpeqAncillary = (speqs: any, rows: AncillaryRow[]): number => {
        const speqInfo = this.calculateItemsInfo(speqs?.segments, 'speqs');
        if (speqInfo.quantity > 0 || speqInfo.total > 0) {
            rows.push(this.createAncillaryRow('ANCILLARIES_SPEQS_TITLE_TEXT', speqInfo));
            return speqInfo.total;
        }
        return 0;
    };

    private processFlexibilizationAncillary = (flexibilization: any, rows: AncillaryRow[]): number => {
        if (this.hasFlexibilization(flexibilization)) {
            const flexPrice = Number(flexibilization.info.amount.price) || 0;
            rows.push(this.createFlexibilityRow(flexibilization));
            return flexPrice;
        }
        return 0;
    };

    private processInsuranceAncillary = (insuranceAllianzFusionInfo: any, rows: AncillaryRow[]): number => {
        if (this.hasAllianzInsurance(insuranceAllianzFusionInfo)) {
            const price = Number(insuranceAllianzFusionInfo?.total?.total) || 0;
            rows.push(this.createInsuranceRow(insuranceAllianzFusionInfo));
            return price;
        }
        return 0;
    };

    private processTransfersAncillary = (globickTransfers: any, rows: AncillaryRow[]): number => {
        if (this.hasTransfers(globickTransfers)) {
            const price = Number(globickTransfers.total.total) || 0;
            rows.push(this.createTransfersRow(globickTransfers));
            return price;
        }
        return 0;
    };

    private processSeats = (seats: any, rows: AncillaryRow[]): number => {
        if (this.hasSeats(seats)) {
            const price = Number(seats.total.total) || 0;
            rows.push(this.createSeatsRow(seats));
            return price;
        }
        return 0;
    };

    private processPriorityBoarding = (priorityBoarding: any, rows: AncillaryRow[]): number => {
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

    private createFlexibilityRow = (flexibilization: any): AncillaryRow => {
        return {
            category: this.translateService.instant('ANCILLARIES_FLEXIBILITY_TITLE'),
            quantity: 1,
            total: this.formatPrice(
                Number(flexibilization.info.amount.price) || 0)
        };
    };

    private createTransfersRow = (transfers: any) => {
        return {
            category: this.translateService.instant('GLOBICK_TRANSFERS_BANNER_TITLE'),
            quantity: 1,
            total: transfers.total.totalFormatted
        };
    };

    private createInsuranceRow = (insurance: any) => {
        return {
            category: this.translateService.instant('ANCILLARIES_INSURANCE_ALLIANZ_FUSION_MODAL_TITLE'),
            quantity: 1,
            total: insurance.total.totalFormatted
        };
    };

    private createSeatsRow = (seats: any) => {
        let qty = seats.segments.reduce((sum, item) => sum + item.quanty, 0);
        return {
            category: this.translateService.instant('SEATS_TEXT'),
            quantity: qty,
            total: seats.total.totalFormatted
        };
    };

    private createPriorityBoardingRow  = (priorityBoarding: any) => {
        let qty = priorityBoarding.info.trips.reduce((sum, item) => sum + item.quantity, 0);
        return {
            category: this.translateService.instant('PRIORITY_BOARDING_TITLE'),
            quantity: qty,
            total: priorityBoarding.info.priceFormatted
        };
    };
}


try{
    angular.module('ib-booking-price-detail-modal-module').directive('ibBookingPriceDetailModal', downgradeComponent({
        component:IbPriceDetailModalComponent,
        inputs:[
            'priceDetails']
    }));
}catch{
    angular.module('ib-booking-price-detail-modal-module', []).directive('ibBookingPriceDetailModal', downgradeComponent({
        component:IbPriceDetailModalComponent,
        inputs:[
            'priceDetails'
        ]
    }));
}   
