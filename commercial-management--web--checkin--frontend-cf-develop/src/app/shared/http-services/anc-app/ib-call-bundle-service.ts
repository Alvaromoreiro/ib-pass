
import * as angular from 'angular';

export class CallBundleService {

    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getBundle = () => {
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.CheckinAncillariesConstants.DEFAULT_ENDPOINTS.bundleServiceURI;
        const uri = endpoint + checkinId;
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(uri).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    putBundle = (requestData) => {
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.CheckinAncillariesConstants.DEFAULT_ENDPOINTS.putBundleURI;
        const uri = endpoint + checkinId;
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.putGeneric(uri, requestData).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
CallBundleService.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', 'CommonsHttpServicesConstants'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service(
        'CallBundleService',
        CallBundleService
    );
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service(
        'CallBundleService',
        CallBundleService
    );
}
