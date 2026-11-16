import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import * as angular from 'angular';
import {BookingPromiseSalesforceProxy} from '../proxy/ib-booking-promise-salesforce-proxy.service';


export class ibPlusContactDataService {
    constructor (
        private BookingPromiseSalesforceProxy: BookingPromiseSalesforceProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getContactData = (): angular.IPromise<any> => {
        const endpoint = HttpServicesConstants.SALESFORCE_ENDPOINTS.CONTACT_DETAILS_IBPLUS;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseSalesforceProxy.get(endpoint).then(
                (contactData) =>{
                    resolve(contactData);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    updateContactData = (updateContactData): angular.IPromise<any> => {
        const endpoint = HttpServicesConstants.SALESFORCE_ENDPOINTS.CONTACT_DETAILS_IBPLUS;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseSalesforceProxy.put(endpoint, updateContactData).then(
                (contactData) =>{
                    resolve(contactData);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
ibPlusContactDataService.$inject = ['BookingPromiseSalesforceProxy', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'ibPlusContactDataService',
        ibPlusContactDataService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'ibPlusContactDataService',
        ibPlusContactDataService
    );
}
