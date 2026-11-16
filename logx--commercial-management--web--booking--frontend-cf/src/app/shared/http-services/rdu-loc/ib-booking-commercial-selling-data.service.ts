import { Inject, Injectable } from '@angular/core';
import { BookingRxProxy } from '@shared/http-services/proxy/ib-booking-rx-proxy.service';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { IbBookingErrorHandlerService } from '@shared/http-services/error';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';
import { HttpServicesConstants } from '@core/constants/ib-http-services-constants';
import { BookingCommercialSellingDataUtilsService } from '../../services/ib-booking-availability/ib-booking-commercial-selling-data-utils.service';

@Injectable({providedIn: 'root'})

export class BookingCommercialSellingDataService {
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingCommercialSellingDataUtilsService: BookingCommercialSellingDataUtilsService
    ) {}

    public getCommercialInfo = ( ): Promise<any> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.commercialInfobyMarketServiceURI;
        const config: any = {
            headers: {
                'Cache-Control': 'private, max-age=600'
            }
        };
        return lastValueFrom( this.BookingRxProxy.get( endpoint, config )
            .pipe( map( ( response: any ) => {
                let commercialDataStoraged: any = {};
                const customerData: any = this.CommonsSessionStorageService.get('isLogged') === BookingAppConstants.LOGIN_ONB ? this.CommonsSessionStorageService.get('membershipData') : this.CommonsSessionStorageService.get('customerData');
                this.CommonsSessionStorageService.set('commercialData', this.BookingCommercialSellingDataUtilsService.getCommercialsellingDataByMarket(response.data));
                if (customerData) {
                    commercialDataStoraged = this.CommonsSessionStorageService.get('commercialData');
                    customerData.generalInfo.aviosTransformed = commercialDataStoraged?.currency?.groupingSeparator ? this.CurrencyService.formatAvios(commercialDataStoraged.currency.groupingSeparator, customerData.generalInfo.avios) : customerData.generalInfo.avios;
                    this.setCustomerDataValues(customerData);
                }
                return response.data;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };

    private setCustomerDataValues = (customerData) =>{
        if (this.CommonsSessionStorageService.get('isLogged') === BookingAppConstants.LOGIN_ONB) {
            this.$rootScope.membershipData = customerData;
            this.CommonsSessionStorageService.set('membershipData', customerData);
        } else {
            this.$rootScope.customerData = customerData;
            this.CommonsSessionStorageService.set('customerData', customerData);
            if (customerData !== null) {
                this.$rootScope.$emit('customerDataModalWaiting', customerData);
            }
        }
    };
}

downgradeToAJSService('BookingCommercialSellingDataService', BookingCommercialSellingDataService, 'ib-booking-services-module');
