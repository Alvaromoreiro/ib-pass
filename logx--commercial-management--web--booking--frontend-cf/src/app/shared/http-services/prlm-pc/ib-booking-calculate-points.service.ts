import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { lastValueFrom, map, timeout } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { downgradeToAJSService } from 'ib-web-commons/utils';

@Injectable({
    providedIn: 'root'
})
export class IbBookingCalculatePointsService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) {}


    public getCalculateFlightsAvios = (req): Promise<any> => {
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.calculateOnHoldPointsURI;
        return lastValueFrom(this.BookingRxProxy.post(url, req)
            .pipe(
                timeout(3000),
                map((response: any) => response.data),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            ));
    };


    public getCalculateAviosAncillaries = (req): Promise<any> => {
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.calculateAncillariesPointsURI;
        return lastValueFrom(this.BookingRxProxy.post(url, req)
            .pipe(
                timeout(3000),
                map((response: any) => response.data),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            ));
    };

    public getCalculateAviosSummary = (req): Promise<any> => {
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.calculateSummaryPointsURI;
        return lastValueFrom(this.BookingRxProxy.post(url, req)
            .pipe(
                timeout(3000),
                map((response: any) => response.data),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            ));
    };

    public getCalculatePoints = (getCalculatePointsData): Promise<any> => {
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.calculatePoints;
        return lastValueFrom(this.BookingRxProxy.post(url, getCalculatePointsData)
            .pipe(
                map((response: any) => response.data),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            ));
    };
}


downgradeToAJSService('IbBookingCalculatePointsService', IbBookingCalculatePointsService, 'ib-booking-services-module');
