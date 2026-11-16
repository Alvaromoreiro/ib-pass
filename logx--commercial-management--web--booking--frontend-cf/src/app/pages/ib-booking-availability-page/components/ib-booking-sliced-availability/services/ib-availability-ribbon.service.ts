import { Inject, Injectable } from '@angular/core';
import { AJSBookingAvailabilityTransformer } from '@shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { CallPriceMatrixService } from '@shared/http-services/sse-avm/ib-call-booking-price-matrix-service.service';
import type { BookingHttpErrorModel, BookingHttpResponse, CommercialDataMarket } from '@core/models/generic-models/generic-models';
import { catchError, map, Observable } from 'rxjs';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

@Injectable()
export class IbAvailabilityRibbonService {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CallPriceMatrixService: CallPriceMatrixService,
        @Inject(AJSBookingAvailabilityTransformer) private AJSBookingAvailabilityTransformer: any
    ) {}
    public getRibbonAvailability (requestData : AvailabilityTransformerModel.ItineraryRequestData) {
        return this.getCalendarFlightsDates(requestData).pipe(map(resp => resp.data), catchError(() => new Observable<AvailabilityTransformerModel.CalendarInfo | BookingHttpErrorModel>(sub => { sub.next(null); sub.complete(); })));
    }

    private shouldCallPriceMatrix (originDestination: any, isFlexibleDates: any, isAfterSearch: boolean): boolean {
        return isFlexibleDates && originDestination?.length <= 2 && !isAfterSearch;
    }

    public getCalendarFlightsDates (availabilityRequestData: AvailabilityTransformerModel.ItineraryRequestData): Observable<BookingHttpResponse<AvailabilityTransformerModel.CalendarInfo | BookingHttpErrorModel>> {
        const originDestination = availabilityRequestData.slices;
        const isFlexibleDates = this.CommonsSessionStorageService.get('isFlexibleDates');
        this.CommonsSessionStorageService.remove('calditMode');
        const isAfterSearch: boolean = this.isSearchAfterMaxSearchTime(availabilityRequestData);
        if (this.shouldCallPriceMatrix.call(this, originDestination, isFlexibleDates, isAfterSearch)) {
            return this.CallPriceMatrixService.getPriceMatrixRx(this.AJSBookingAvailabilityTransformer.generateInitialCalendarRequest(), true);
        } else {
            return new Observable((subscriber) => { subscriber.next(null); subscriber.complete(); });
        }
    }

    private  isSearchAfterMaxSearchTime (availabilityRequestData: AvailabilityTransformerModel.ItineraryRequestData) {
        const commercialInfo: CommercialDataMarket = this.CommonsSessionStorageService.get('commercialData');
        let isAfterMax = false;
        if (commercialInfo?.maxSearchTime && availabilityRequestData?.slices?.length > 0) {
            const date = new Date(availabilityRequestData.slices[availabilityRequestData.slices.length - 1].date);
            const maxDate = new Date((new Date()).getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000));
            isAfterMax = date.getTime() > maxDate.getTime();
        }
        return isAfterMax;
    }
}