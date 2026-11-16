import * as angular from 'angular';
import  { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import {BookingPromiseSalesforceProxy} from '../proxy/ib-booking-promise-salesforce-proxy.service';
export class TravelPreferencesService {
    constructor (
        private BookingPromiseSalesforceProxy: BookingPromiseSalesforceProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getTravelPreferences = (): angular.IPromise<any> => {
        const endpoint = HttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_PREFERENCES;
        return new Promise((resolve, reject) => {
            this.BookingPromiseSalesforceProxy.get(endpoint).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    updateTravelPreferences = (TravelPreferences): angular.IPromise<any> => {
        const endpoint = HttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_PREFERENCES;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseSalesforceProxy.put(endpoint, TravelPreferences).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}

TravelPreferencesService.$inject = ['BookingPromiseSalesforceProxy', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'TravelPreferencesService',
        TravelPreferencesService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'TravelPreferencesService',
        TravelPreferencesService
    );
}
