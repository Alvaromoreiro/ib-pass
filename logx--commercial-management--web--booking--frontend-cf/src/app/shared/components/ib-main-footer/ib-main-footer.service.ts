import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingRxProxy } from '../../http-services/proxy/ib-booking-rx-proxy.service';

export type FooterIconsRequest = {
    market: string;
    applicationId: number;
};

@Injectable({
    providedIn: 'root'
})
export class MainFooterService {

    constructor (private bookingRxProxy: BookingRxProxy) {}

    public getIcons (request: FooterIconsRequest) {
        const endpoint:string = HttpServicesConstants.DEFAULT_ENDPOINTS.PAYMENT_LOGOS;
        return this.bookingRxProxy.post<any>(endpoint, request).pipe(
            map((res) => res.data)
        );
    }

}
