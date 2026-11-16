import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@shared/http-services/proxy/ib-booking-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingErrorHandlerService } from '@shared/http-services/error';
@Injectable({providedIn: 'root'})
export class ShuttleFareService {

    constructor (
        private BookingRxProxy: BookingRxProxy,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public getShuttleFare = (getShuttleFareData): angular.IPromise<any> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.fareShuttleServiceURI;
        return lastValueFrom(this.BookingRxProxy.post(endpoint, getShuttleFareData).pipe(
            map((getShuttleFare: any) => {
                if (getShuttleFare.data.responseId) this.CommonsSessionStorageService.set('responseId', getShuttleFare.data.responseId);
                if (this.CommonsSessionStorageService.get('userLogged') === BookingAppConstants.LOGIN_ONB) {
                    this.CommonsSessionStorageService.set('oBPoints', getShuttleFare.data.offers[0].accrualQuote);
                }
                return getShuttleFare;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()
        )
        );
    };
}
downgradeToAJSService('ShuttleFareService', ShuttleFareService, 'ib-booking-services-module');
