import { Inject, Injectable } from '@angular/core';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { AJSRootScope, CommonsRootScope, CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

@Injectable({providedIn: 'root'})

export class GetWcsPhonesService {
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    public getPhoneByCode = ( code: string ): Promise<any> => {
        const url = `${HttpServicesConstants.WCS_URIS.PHONES}&code=${code}&market=${BookingAppConstants.market}&locale=${BookingAppConstants.lang}`;
        return lastValueFrom( this.BookingRxProxy.get( url )
            .pipe( map( ( response: any ) => {
                if (code === BookingAppConstants.PHONES_LIST.HOLIDAYS) {
                    const phonesListIBV: object = this.CommonsSessionStorageService.get('phonesListIBV') || {};
                    phonesListIBV[code] = response.data.content;
                    this.$rootScope.phonesListIBV = phonesListIBV;
                    this.CommonsSessionStorageService.set('phonesListIBV', phonesListIBV);
                } else {
                    const phonesList: object = this.CommonsSessionStorageService.get('phonesList') || {};
                    phonesList[code] = response.data.content;
                    this.$rootScope.phonesList = phonesList;
                    this.CommonsSessionStorageService.set('phonesList', phonesList);
                }
                return response.data.content;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };
}

downgradeToAJSService('GetWcsPhonesService', GetWcsPhonesService, 'ib-booking-services-module', []);
