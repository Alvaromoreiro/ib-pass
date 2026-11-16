import { Injectable } from '@angular/core';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@shared/http-services/error';
import { FareDataModel } from '@src/app/core/models/generic-models/fare-models';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingHttpErrorModel } from '@src/app/core/models/generic-models/generic-models';
import { lastValueFrom } from 'rxjs';
@Injectable ({providedIn:'root'})
export class CallBookingFare {
    constructor (
        private proxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService, 
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    private getFareDataEndpoint = () => {
        return this.CommonsSessionStorageService.get('multiCitySearch') ? HttpServicesConstants.DEFAULT_ENDPOINTS.fareMultiTripServiceURI : HttpServicesConstants.DEFAULT_ENDPOINTS.fareServiceURI;
    };
    public postFareRx = (requestData: any)  => {
        const endpoint = this.getFareDataEndpoint();
        return this.proxy.post<FareDataModel | BookingHttpErrorModel>(endpoint, requestData)
            .pipe(this.IbBookingErrorHandlerService.handleErrorOperator());
    };
    public postFarePromised = (requestData: any) => {
        return lastValueFrom(this.postFareRx(requestData));
    };

}