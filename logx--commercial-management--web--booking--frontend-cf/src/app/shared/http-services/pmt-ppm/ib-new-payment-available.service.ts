import { Inject, Injectable } from '@angular/core';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../error';
import { Observable, lastValueFrom, map } from 'rxjs';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NewPaymentAvailableResponse } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { PaymentRealmsEnum, PaymentRealmsEnumValues, PaymentSubRealmsEnum } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSBookingUtilsService } from '../../services/ib-utils/ib-booking-utils-service-bridge.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';

@Injectable({providedIn: 'root'})
export class BookingNewPaymentAvailableService {
    constructor (
        private proxy : BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSRootScope) private $rootScope,
        @Inject(AJSBookingUtilsService) private BookingUtilService

    ){}
    /**
     * @description Function to calculate the realm of the current flow
     * @returns A string that will be used as realm into the request
     */
    private getRequestRealm = (): PaymentRealmsEnumValues => {
        if (this.$rootScope.isRedemptionFlow) {
            return PaymentRealmsEnum.REDEMPTION;
        }
        return PaymentRealmsEnum.BOOKING;
    };
    

    private getSpecialRequestQueryParam = () : string => {
        const isHMAD = this.CommonsSessionStorageService.get('isHMAD');
        const flashOffer = this.BookingUtilService.getURLFirstParameterByName('flashOffer');
        const flashOfferId = this.BookingUtilService.getURLFirstParameterByName('flashOfferId');
        const isFlashOffer = flashOffer && flashOfferId;
        const isOnHoldConf = this.CommonsSessionStorageService.get(BkiStorageConstants.FLOW_APP) === 'MMBOH';
        const querybase = '?subRealm=';
        if (isHMAD){
            return querybase + PaymentSubRealmsEnum.STOP_OVER;
        }
        if(this.$rootScope.isPointsOBFlow) {
            return querybase + PaymentSubRealmsEnum.ON_BUSINESS;
        }
        if(this.CommonsSessionStorageService.get('isOnHoldOrder')) {
            return querybase + PaymentSubRealmsEnum.ON_HOLD;
        }
        if ( isFlashOffer) {
            return querybase + PaymentSubRealmsEnum.FLASH_OFFERS;
        }
        if(isOnHoldConf){
            return querybase + PaymentSubRealmsEnum.ON_HOLD_CONFIRMATION;
        }
        return '';
    };
    /**
     * @description Function to calculate the query parameters to be sent into the request. 
     *  This query param has just one parameter which is subrealm to which the current flow belongs.
     * @returns A string that will be used as query parameters of the request
     */

    private getRequestQueryParam = (): string => {
        const searchFlightType = this.CommonsSessionStorageService.get('searchFlightType');
        const querybase = '?subRealm=';
        let result = '';
        const specialCase = this.getSpecialRequestQueryParam();
        if(specialCase.length > 0) {
            return specialCase;
        }
        switch(searchFlightType) {
                case BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP:
                    result =  querybase + PaymentSubRealmsEnum.MULTIPLE_TRIPS;
                    break;
                case BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN:
                    result = querybase + PaymentSubRealmsEnum.SHUTTLE;
                    break;
                case BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH:
                    result = querybase + PaymentSubRealmsEnum.METASEARCH;
                    break;
                default:
                    result = querybase + PaymentSubRealmsEnum.DEFAULT;
        }
        return result;
    };
    /**
     * @description Function to make the call to the service that retrieves if its available the new payments view. 
     * It returns the response as an observable
     * @returns Observable<NewPaymentAvailableResponse>
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3898409197/GET+NewPaymentAvailable+V1
     */
    public callRx = () : Observable<NewPaymentAvailableResponse> => {
        const realm =  this.getRequestRealm();
        const queryParams = this.getRequestQueryParam();
        let endpoint =  `${HttpServicesConstants.DEFAULT_ENDPOINTS.NEW_PAYMENT_AVAILABLE}${queryParams}`
            .replace('{{marketId}}', this.$rootScope.appMarket.toUpperCase())
            .replace('{{realm}}', realm);
        return this.proxy.get<NewPaymentAvailableResponse>(endpoint, {responseType: 'json'})
            .pipe(map((resp)=> resp?.data), this.IbBookingErrorHandlerService.handleErrorOperator());
    };
    /**
     * @description Function to make the call to the service that retrieves if its available the new payments view.
     * It returns the response as promise
     * @returns Promise<NewPaymentAvailableResponse>
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3898409197/GET+NewPaymentAvailable+V1
     */
    public callPromised = () :Promise<NewPaymentAvailableResponse> =>  {
        return lastValueFrom(this.callRx());
    };






}