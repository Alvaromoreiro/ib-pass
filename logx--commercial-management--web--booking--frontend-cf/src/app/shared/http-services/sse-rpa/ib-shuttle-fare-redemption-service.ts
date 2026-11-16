import * as angular from 'angular';
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';
export class ShuttleFareRedentionService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private BookingAppConstants: BookingAppConstants,
        private HttpServicesConstants:HttpServicesConstantsType,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) { }


    /**
     * Gets the fare for an Air Shuttle Redention. If there was and error in the http call,
     * this method treats these http error code and returns the object to show an error in the view.
     * @param {Object} requestData - parameters that are passed to the service request
     * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
     *  When the promise rejects, it returns an object with the error data to show in the view
     */
    getShuttleFare = (getShuttleFareData): angular.IPromise<any> => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.fareShuttleRedemptionServiceURI;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, getShuttleFareData).then(
                (getShuttleFare: any) => {
                    if (getShuttleFare.data.responseId) this.localStorageService.set('responseId', getShuttleFare.data.responseId);
                    if (this.localStorageService.get('userLogged') === this.BookingAppConstants.LOGIN_ONB) {
                        this.localStorageService.set('oBPoints', getShuttleFare.data.offers[0].accrualQuote);
                    }
                    resolve(getShuttleFare);
                },
                (error) =>{
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
ShuttleFareRedentionService.$inject = ['BookingPromiseProxy', 'CommonsNewHttpUtilsErrorService', 'BookingAppConstants', 'HttpServicesConstants', 'localStorageService'];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'ShuttleFareRedentionService',
        ShuttleFareRedentionService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'ShuttleFareRedentionService',
        ShuttleFareRedentionService
    );
}
