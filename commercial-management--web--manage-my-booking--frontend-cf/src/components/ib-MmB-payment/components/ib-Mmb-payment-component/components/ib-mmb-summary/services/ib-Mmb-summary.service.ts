import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    Baggages,
    HeaderModel,
    HeaderModelLocalstorage,
    Insurance,
    InsuranceAllianzFusionInfo,
	GlobickTransfers,
	GlobickActivities,
    PriorityBoarding,
    Seats,
    SegmentsBaggage,
    SegmentsSeats,
    SegmentsSpeq,
    Speqs,
    TripsEntity
} from '@src/app/core/models/header-model/header.model';
import { SummaryProps } from 'commercial-management--digital--web-components-design--library';
import {
    Ancillarie,
    AncillarieSegment,
    GeneralItem,
    GenericSummaryItem
} from 'commercial-management--digital--web-components-design--library/dist/components/layout/summary/Summary.model';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PriceSubscriptionModel, DiscountsEntries, CurrencyDisplayFormat, CurrencyConversion } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model';
import { IbMmbPaymentFormService } from '../../../services/ib-Mmb-payment-form.service';
@Injectable({ providedIn: 'root' })
export class IbMmbSummaryService {
    constructor(
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        private TranslateService: TranslateService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbMmbPaymentFormService: IbMmbPaymentFormService
    ) { }

    public currency = this.CommonsSessionStorageService.get('currency');

    private setDiscountFromComponent = (discount: DiscountsEntries): GenericSummaryItem => {
        const price = this.CurrencyService.formatPrice(
            <CommonsCurrencyModel.CurrencyResponse>this.currency,
            discount.total,
            true,
            false
        );
        return <GenericSummaryItem>{
            type: 'DISCOUNTS',
            total: `-${price}`,
            items: [
                {
                    price: `-${price}`,
                    description: discount.rewardCode === 'AVIOS'
                        ? `${this.TranslateService.instant('MMB_AVIOS_PAYMENT_FEE_TEXT')}`
                        : `${this.TranslateService.instant('GENERAL_DISCOUNT')} ${discount.id}`
                }
            ]
        };
    };

    getAncillaries = (headerModel: HeaderModel): Ancillarie[] => {
        const ancillaries: Ancillarie[] = [];
        if (headerModel?.shoppingBasket?.baggages?.hasBaggage) ancillaries.push(this.getBaggageAncillarie(headerModel.shoppingBasket.baggages));
        // if(headerModel?.shoppingBasket?.bundle?.hasBundle)
        // if(headerModel?.shoppingBasket?.carbonFootprint?.hasCarbonFootprint)
        // if(headerModel?.shoppingBasket?.flexibilization?.hasFlexibilization)
        if(headerModel?.shoppingBasket?.globickActivities?.hasActivitiesGlobick) ancillaries.push(this.getGlobickActivities(headerModel.shoppingBasket.globickActivities));
        if(headerModel?.shoppingBasket?.globickTransfers?.hasTransfersGlobick) ancillaries.push(this.getGlobickTransfers(headerModel.shoppingBasket.globickTransfers));
        if(headerModel?.shoppingBasket?.insuranceAllianzFusionInfo?.hasInsuranceAllianzFusion) ancillaries.push(this.getInsuranceAncillarie(headerModel.shoppingBasket.insuranceAllianzFusionInfo));
        if(headerModel?.shoppingBasket?.insurance?.hasInsurance) ancillaries.push(this.getInsuranceAncillarie(headerModel.shoppingBasket.insurance));
        if(headerModel?.shoppingBasket?.priorityBoarding?.hasPriorityBoarding) ancillaries.push(this.getPriorityBoardingAncillarie(headerModel.shoppingBasket.priorityBoarding));
        if(headerModel?.shoppingBasket?.seats?.hasSeats) ancillaries.push(this.getSeatAncillarie(headerModel.shoppingBasket.seats));
        if(headerModel?.shoppingBasket?.speqs?.hasSpeqs) ancillaries.push(this.getSpeqsAncillarie(headerModel.shoppingBasket.speqs));
        // if(headerModel?.shoppingBasket?.upgrading?.hasUpgrading)
        return ancillaries;
    };
    private getBaggageAncillarie = (baggages: Baggages): Ancillarie => {
        return {
            code: 'BAGGAGE',
            segments: this.getBaggageSegments(baggages),
            total: baggages.total.totalFormatted
        };
    };
    private getBaggageSegments = (baggages: Baggages): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        baggages?.segments.forEach((segment, index) => {
            const ancillarieSegment: AncillarieSegment = {
                id: 'seg' + index,
                title: segment.origin.description + ' - ' + segment.destination.description,
                items: this.getBaggageItems(segment)
            };
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };
    private getBaggageItems = (segment: SegmentsBaggage): GeneralItem[] => {
        const items: GeneralItem[] = [];
        segment?.baggages.forEach(baggage => {
            const item: GeneralItem = {
                amount: baggage.quanty,
                code: baggage.type,
                price: baggage.totalFormatted,
                description: (baggage.quanty > 1 ? this.TranslateService.instant('BAGGAGE_PLURAL_TEXT') : this.TranslateService.instant('BAGGAGE_SINGULAR_TEXT')) + ' ' + baggage.description
            };
            items.push(item);
        });
        return items;
    };
    private getSeatAncillarie = (seats: Seats): Ancillarie => {
        return {
            code: 'SEAT',
            segments: this.getSeatSegments(seats),
            total: seats.total.totalFormatted
        };
    };
    private getSeatSegments = (seats: Seats): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        seats?.segments.forEach((segment, index) => {
            const ancillarieSegment: AncillarieSegment = {
                id: 'seg' + index,
                title: segment.origin.description + ' - ' + segment.destination.description,
                items: this.getSeatItems(segment)
            };
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };
    private getSeatItems = (segment: SegmentsSeats): GeneralItem[] => {
        const items: GeneralItem[] = [];
        segment?.seats.forEach(seat => {
            const item: GeneralItem = {
                amount: seat.quanty,
                code: seat.type,
                price: seat.totalFormatted,
                description: (seat.quanty > 1 ? this.TranslateService.instant('SEATS_MIN_TEXT') : this.TranslateService.instant('SEAT_MIN_TEXT')) + ' ' + seat.description
            };
            items.push(item);
        });
        return items;
    };
    private getPriorityBoardingAncillarie = (priorityBoarding: PriorityBoarding): Ancillarie => {
        return {
            code: 'PRIORITY_BOARDING',
            segments: this.getPriorityBoardingSegments(priorityBoarding),
            total: priorityBoarding.info.priceFormatted
        };
    };
    private getPriorityBoardingSegments = (priorityBoarding: PriorityBoarding): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        priorityBoarding?.info?.trips.forEach((trip, index) => {
            const ancillarieSegment: AncillarieSegment = {
                id: 'seg' + index,
                title: trip.departure.description + ' - ' + trip.arrival.description,
                items: this.getPiorityBoardingItems(trip)
            };
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };
    private getPiorityBoardingItems = (trip: TripsEntity): GeneralItem[] => {
        const items: GeneralItem[] = [];
        const item: GeneralItem = {
            amount: trip.quantity,
            code: trip.id,
            price: trip.priceFormatted,
            description: this.TranslateService.instant('PRIORITY_BOARDING_TITLE')
        };
        items.push(item);
        return items;
    };
    private getSpeqsAncillarie = (speqs: Speqs): Ancillarie => {
        return {
            code: 'SPECIAL_EQUIPMENT',
            segments: this.getSpeqsSegments(speqs),
            total: speqs.total.totalFormatted
        };
    };
    private getSpeqsSegments = (speqs: Speqs): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        speqs?.segments.forEach((segment, index) => {
            const ancillarieSegment: AncillarieSegment = {
                id: 'seg' + index,
                title: segment.origin.description + ' - ' + segment.destination.description,
                items: this.getSpeqsItems(segment)
            };
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };
    private getSpeqsItems = (segment: SegmentsSpeq): GeneralItem[] => {
        const items: GeneralItem[] = [];
        segment?.speqs.forEach(speq => {
            const item: GeneralItem = {
                amount: speq.quanty,
                code: speq.type,
                price: speq.totalFormatted,
                description: speq.description
            };
            items.push(item);
        });
        return items;
    };
    private getInsuranceAncillarie = (insurance: Insurance|InsuranceAllianzFusionInfo): Ancillarie => {
        return {
            code: 'INSURANCE',
            type: insurance.info.type ?? insurance.info.description,
            total: insurance.total.totalFormatted
        };
    };

	
	private getGlobickTransfers = (transfers: GlobickTransfers): Ancillarie => {
        return {
            code: 'TRANSFERS',
            type: transfers.info.transferCar,
            total: transfers.total.totalFormatted
        };
    };
	private getGlobickActivities = (transfers: GlobickActivities): Ancillarie => {
        return {
            code: 'ACTIVITIES',
            type: transfers.info.transferCar,
            total: transfers.total.totalFormatted
        };
    };
    
    public getSummaryInfo = (): Pick<SummaryProps, 'ancillaries' | 'totalPrice' | 'totalDcc'> => {
        const { headerModel } = this.CommonsSessionStorageService.get<HeaderModelLocalstorage>('headerModel');
        return {
            ancillaries: this.getAncillaries(headerModel),
            totalPrice: headerModel?.shoppingBasket?.total?.formatted,
        };
    };


    public updateSummaryInfo(summaryProps: SummaryProps, data: PriceSubscriptionModel): SummaryProps {
        const { headerModel } = this.CommonsSessionStorageService.get<HeaderModelLocalstorage>('headerModel');
        const ancillaries = this.getAncillaries(headerModel);
        const discount: GenericSummaryItem = data.discounts.length === 0 ? undefined : this.setDiscountFromComponent(data.discounts[0]);
        const dccPriceToShow = this.processDccPrice(data);


        let updatedProps: SummaryProps = {
            ...summaryProps,
            otherItems: undefined,
            ancillaries: ancillaries,
            totalPrice: this.CurrencyService.formatPrice(<CommonsCurrencyModel.CurrencyResponse>this.currency, data.total, true, false),
            totalDcc: dccPriceToShow,
        };
        if (discount) {
            updatedProps = {
                ...updatedProps,
                otherItems: [discount]
            };
        }
        return updatedProps;
    }

    private processDccPrice(data: PriceSubscriptionModel): string | undefined {
        const { currencyConversion, currency } = data;

        const hasCurrencyConversion =
            currencyConversion &&
            typeof currencyConversion.total === 'number' &&
            currencyConversion.currency;

        if (!hasCurrencyConversion) {
            return undefined;
        }

        const dccPrice = this.setSummaryDCCInfo(currencyConversion, currency.format);


        return dccPrice;
    }

    public setSummaryDCCInfo = (currencyConversion: CurrencyConversion, currencyDisplayFormat: CurrencyDisplayFormat): string | undefined => {
        if (!currencyConversion) {
            return;
        }
        const currencyFormat = structuredClone(currencyDisplayFormat);
        currencyFormat.symbol.value = currencyConversion.currency ?? '';

        return this.IbMmbPaymentFormService.formatPrice(currencyConversion.total, currencyFormat);
    };

}
