import * as angular from 'angular';

import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';
export class OnBusinessPointsService {

    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $rootScope
    ) {}

    getOnBusinessPoints = (requestData) => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.onBusinessPointsURI;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, requestData).then(
                (data) => {
                    this.$rootScope.oBPointsData = data.data;
                    this.localStorageService.set('oBPointsData', data.data);
                    resolve(data.data);
                },
                (error)=> {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
OnBusinessPointsService.$inject = [
    'BookingPromiseProxy', 'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService', 'localStorageService',
    '$rootScope'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'OnBusinessPointsService',
        OnBusinessPointsService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'OnBusinessPointsService',
        OnBusinessPointsService
    );
}
