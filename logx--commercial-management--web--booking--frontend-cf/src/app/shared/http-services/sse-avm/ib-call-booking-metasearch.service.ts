import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@shared/http-services/proxy/ib-booking-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { IbBookingErrorHandlerService } from '@shared/http-services/error';
import { lastValueFrom, map } from 'rxjs';


@Injectable({providedIn: 'root'})
export class CallBookingMetaSearchService {

    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }
    /*
     * Gets the metasearch data and returns it. If there was and error in the http call, this method treats these http error code and returns
     * the object to show an error in the view.
     * @param {Object} getBookingMetaSearchData - parameters that are passed to the service request
     * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
     *  When the promise rejects, it returns an object with the error data to show in the view
     */
    getBookingMetaSearch = (getBookingMetaSearchData): angular.IPromise<any> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.metaSearchServiceURI;
        return lastValueFrom(this.BookingRxProxy.post(endpoint, getBookingMetaSearchData)
            .pipe(map((response: any) => {
                this.CommonsSessionStorageService.set('fareFamilyConditionsInfo', response.data.fareFamilyConditions);
                return response;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
    };
}
downgradeToAJSService('CallBookingMetaSearchService', CallBookingMetaSearchService, 'ib-booking-services-module');
