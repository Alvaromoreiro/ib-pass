import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map } from 'rxjs';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BookingRxProxy } from '../http-services/proxy/ib-booking-rx-proxy.service';
@Injectable({providedIn: 'root'})
export class IbBookingAirlinesLogoService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    public getAirlinesLogos  = async (): Promise<any> => {
        const airlinesLogos = this.CommonsSessionStorageService.get<any[]>('airlinesLogoList');
        if (airlinesLogos !== null) {
            return airlinesLogos;
        } else {
            const endpoint = `${BookingAppConstants.iconsRoute}${BookingAppConstants.airlinesLogoJsonRoute}`;
            return lastValueFrom(this.BookingRxProxy.get(endpoint).pipe(
                map(response => {
                    this.CommonsSessionStorageService.set('airlinesLogoList', response.data);
                    return response.data;
                }),
                catchError(() => {
                    this.CommonsSessionStorageService.set('airlinesLogoList', []);
                    throw {
                        errorCode: '',
                        message: 'REST_SERVICE_ERROR_GENERAL',
                        needsTranslate: true,
                        internalErrorCode: ''
                    };
                })
            ));
        }
    };

}
downgradeToAJSService('IbBookingAirlinesLogoService', IbBookingAirlinesLogoService, 'ib-booking-services-module');
