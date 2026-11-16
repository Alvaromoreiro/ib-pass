import dayjs from 'dayjs';
import { BookingRxProxy } from '@shared/http-services/proxy/ib-booking-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { IbBookingErrorHandlerService } from '@shared/http-services/error/ib-booking-error-handler.service';
import { Inject, Injectable } from '@angular/core';
import { RibbonRequest } from '@src/app/core/models/ib-booking-availability/ribbon-models';
import { Observable, lastValueFrom, map } from 'rxjs';
import { CommonsSessionStorageService, AJSRootScope, downgradeToAJSService } from 'ib-web-commons/utils';
import { BookingHttpErrorModel, BookingHttpResponse } from '@src/app/core/models/generic-models/generic-models';
@Injectable({providedIn: 'root'})
export class CallPriceMatrixService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    public getPriceMatrixRx (requestData : RibbonRequest, forceRibbon: boolean): Observable<BookingHttpResponse<AvailabilityTransformerModel.CalendarInfo|BookingHttpErrorModel>>{
        let endpoint = '';
        const multiCitySearch = this.CommonsSessionStorageService.get('multiCitySearch');
        const openJaw = this.CommonsSessionStorageService.get('openJaw');
        if (this.$rootScope.isRedemptionFlow) {
            endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.priceMatrixRedemptionServiceURI;
        } else {
            if (requestData.slices.length === 1 || forceRibbon) {
                endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.priceMatrixOneSliceServiceURI;
            } else if (requestData.slices.length === 2 && !multiCitySearch) {
                endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.priceMatrixServiceURI;
            } else if (openJaw) {
                endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.priceMatrixServiceMultiOpenJawURI;
            }
        }
        return this.BookingRxProxy.post <AvailabilityTransformerModel.CalendarInfo> (endpoint, requestData)
            .pipe(this.IbBookingErrorHandlerService.handleErrorOperator(), map((resp) => { return resp;}));

    }
    public getPriceMatrixPromised (requestData: RibbonRequest, forceRibbon: boolean): Promise<BookingHttpResponse<AvailabilityTransformerModel.CalendarInfo|BookingHttpErrorModel>> {
        return lastValueFrom(this.getPriceMatrixRx(requestData, forceRibbon));
    }
}

downgradeToAJSService('CallPriceMatrixService', CallPriceMatrixService, 'ib-booking-services-module');
