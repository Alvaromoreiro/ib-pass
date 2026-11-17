import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    Baggages,
    CheckInsurance,
    GlobickTransfers,
    HeaderModel,
    HeaderModelLocalstorage,
    Insurance,
    PriorityBoarding,
    Seats,
    SegmentsBaggage,
    SegmentsSeats,
    SegmentsSpeq,
    SegmentsUpg,
    Speqs,
    TripsEntity,
    Upgrading
} from '@src/app/core/models/header-model/header.model';
import { DiscountsEntries, PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import {
    Ancillarie,
    AncillarieSegment,
    GeneralItem,
    GenericSummaryItem,
    GeneralItem2,
    SummaryProps
} from 'commercial-management--digital--web-components-design--library';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';

@Injectable({ providedIn: 'root' })
export class IbCheckinSummaryService {
    private currency: CommonsCurrencyModel.CurrencyResponse;

    constructor (
        @Inject(AJSCurrencyService) private currencyService: CurrencyService,
        private translateService: TranslateService,
        private sessionStorageService: CommonsSessionStorageService
    ) {
        this.currency = this.sessionStorageService.get('currency');
    }

    private setDiscountFromComponent (discount: DiscountsEntries): { total: string; type: string; items: { price: string; description: string }[] } {
        const price = this.currencyService.formatPrice(this.currency, discount.total, true, false);
        return {
            type: 'DISCOUNTS',
            total: `-${price}`,
            items: [{ price: `-${price}`, description: `${this.translateService.instant('GENERAL_DISCOUNT')} ${discount.id}` }]
        };
    }

    private getBaggageAncillarie (baggages: Baggages): Ancillarie {
        return {
            code: 'BAGGAGE',
            segments: this.getBaggageSegments(baggages),
            total: baggages.total.totalFormatted
        };
    }

    private getBaggageSegments (baggages: Baggages): AncillarieSegment[] {
        return baggages.segments.map((segment, index) => ({
            id: `seg${index}`,
            title: `${segment.origin.description} - ${segment.destination.description}`,
            items: this.getBaggageItems(segment)
        }));
    }

    private getBaggageItems (segment: SegmentsBaggage): GeneralItem[] {
        return segment.baggages.map(baggage => ({
            amount: baggage.quanty,
            code: baggage.type,
            price: baggage.totalFormatted,
            description: `${this.translateService.instant(baggage.quanty > 1 ? 'BAGGAGE_PLURAL_TEXT' : 'BAGGAGE_SINGULAR_TEXT')} ${baggage.description}`
        }));
    }

    private getSeatAncillarie (seats: Seats): Ancillarie {
        return {
            code: 'SEAT',
            segments: this.getSeatSegments(seats),
            total: seats.total.totalFormatted
        };
    }

    private getSeatSegments (seats: Seats): AncillarieSegment[] {
        return seats.segments.map((segment, index) => ({
            id: `seg${index}`,
            title: `${segment.origin.description} - ${segment.destination.description}`,
            items: this.getSeatItems(segment)
        }));
    }

    private getSeatItems (segment: SegmentsSeats): GeneralItem[] {
        return segment.seats.map(seat => ({
            amount: seat.quanty,
            code: seat.type,
            price: seat.totalFormatted,
            description: `${this.translateService.instant(seat.quanty > 1 ? 'SEATS_MIN_TEXT' : 'SEAT_MIN_TEXT')} ${seat.description}`
        }));
    }

    private getPriorityBoardingAncillarie (priorityBoarding: PriorityBoarding): Ancillarie {
        return {
            code: 'PRIORITY_BOARDING',
            segments: this.getPriorityBoardingSegments(priorityBoarding),
            total: priorityBoarding.info.priceFormatted
        };
    }

    private getPriorityBoardingSegments (priorityBoarding: PriorityBoarding): AncillarieSegment[] {
        return priorityBoarding.info.trips.map((trip, index) => ({
            id: `seg${index}`,
            title: `${trip.departure.description} - ${trip.arrival.description}`,
            items: this.getPriorityBoardingItems(trip)
        }));
    }

    private getPriorityBoardingItems (trip: TripsEntity): GeneralItem[] {
        return [{
            amount: trip.quantity,
            code: trip.id,
            price: trip.priceFormatted,
            description: this.translateService.instant('PRIORITY_BOARDING_TITLE')
        }];
    }

    private getSpeqsAncillarie (speqs: Speqs): Ancillarie {
        return {
            code: 'SPECIAL_EQUIPMENT',
            segments: this.getSpeqsSegments(speqs),
            total: speqs.total.totalFormatted
        };
    }

    private getSpeqsSegments (speqs: Speqs): AncillarieSegment[] {
        return speqs.segments.map((segment, index) => ({
            id: `seg${index}`,
            title: `${segment.origin.description} - ${segment.destination.description}`,
            items: this.getSpeqsItems(segment)
        }));
    }

    private getSpeqsItems (segment: SegmentsSpeq): GeneralItem[] {
        return segment.speqs.map(speq => ({
            amount: speq.quanty,
            code: speq.type,
            price: speq.totalFormatted,
            description: speq.description
        }));
    }

    private getInsuranceAncillarie (insurance: Insurance): Ancillarie {
        return {
            code: 'INSURANCE',
            type: insurance.info.type,
            total: insurance.total.totalFormatted
        };
    }

    public getAncillaries (headerModel: HeaderModel): Ancillarie[] {
        const { baggages, priorityBoarding, seats, speqs, insurance, insuranceAllianzFusionInfo, globickTransfers, upgrading } = headerModel?.shoppingBasket;
        const ancillaries: Ancillarie[] = [];

        if (baggages?.hasBaggage) ancillaries.push(this.getBaggageAncillarie(baggages));
        if (priorityBoarding?.hasPriorityBoarding) ancillaries.push(this.getPriorityBoardingAncillarie(priorityBoarding));
        if (seats?.hasSeats) ancillaries.push(this.getSeatAncillarie(seats));
        if (speqs?.hasSpeqs) ancillaries.push(this.getSpeqsAncillarie(speqs));
        if (upgrading?.hasUpgrading) ancillaries.push(this.getUpgradingAncillarie(upgrading));
        
        const insurances = this.checkInsurances({
            insurance: insurance,
            insuranceAllianzFusionInfo: insuranceAllianzFusionInfo
        });

        const transfers = this.checkGlobickTransfers(globickTransfers);

        return [...ancillaries, ...insurances, ...transfers];
    }

    private getUpgradingSegments (segments: SegmentsUpg[]): AncillarieSegment[] {
        return segments?.map(({ segment, origin, destination, cabinClass }) => ({
            id: segment.toString(),
            title: `${origin?.description} - ${destination?.description}` || '',
            items: [{
                code: '',
                description: cabinClass?.description || ''
            }]
        }));
    }

    private getUpgradingAncillarie ({ totalFormatted, segments = [] }: Upgrading): Ancillarie {
        return {
            code: 'UPGRADING',
            total: totalFormatted || '',
            segments: this.getUpgradingSegments(segments)
        };
    }

    private checkGlobickTransfers ({ hasTransfersGlobick, total, info }: GlobickTransfers): Ancillarie[] {
        const ancillaries: Ancillarie[] = [];
        if (hasTransfersGlobick) {
            const items: GeneralItem2[] = [{
                total: info?.totalFormatted,
                type: info.transferCar,
                subType: info.date
            }];

            if (info?.dateReturn && info?.totalFormattedReturn) {
                items.push({
                    total: info.totalFormattedReturn,
                    type: info.transferCar,
                    subType: info.dateReturn
                });
            }

            ancillaries.push({
                code: 'TRANSFERS',
                total: total.totalFormatted,
                items: items
            });
        }
        return ancillaries;
    }

    private checkInsurances ({ insurance, insuranceAllianzFusionInfo }: CheckInsurance): Ancillarie[] {
        const ancillaries: Ancillarie[] = [];

        if (insurance?.hasInsurance) {
            ancillaries.push(this.getInsuranceAncillarie(insurance));
        }

        if (insuranceAllianzFusionInfo?.hasInsuranceAllianzFusion) {
            ancillaries.push({
                code: 'INSURANCE',
                type: insuranceAllianzFusionInfo.info?.description,
                total: insuranceAllianzFusionInfo.total.totalFormatted
            });
        }
        return ancillaries;
    }

    public getSummaryInfo (): Pick<SummaryProps, 'ancillaries' | 'totalPrice'> {
        const { headerModel } = this.sessionStorageService.get<HeaderModelLocalstorage>('headerModel');
        return {
            ancillaries: this.getAncillaries(headerModel),
            totalPrice: headerModel?.shoppingBasket?.total?.formatted
        };
    }

    public updateSummaryInfo (summaryProps: SummaryProps, data: PriceSubscriptionModel): SummaryProps {
        const { headerModel } = this.sessionStorageService.get<HeaderModelLocalstorage>('headerModel');
        const ancillaries = this.getAncillaries(headerModel);
        const discount = data.discounts.length === 0 ? undefined : this.setDiscountFromComponent(data.discounts[0]);
        let updatedProps: SummaryProps = {
            ...summaryProps,
            otherItems: undefined,
            ancillaries,
            totalPrice: this.currencyService.formatPrice(this.currency, data.total, true, false)
        };
        if (discount) {
            updatedProps = {
                ...updatedProps,
                otherItems: [discount as GenericSummaryItem]
            };
        }
        return updatedProps;
    }
}
