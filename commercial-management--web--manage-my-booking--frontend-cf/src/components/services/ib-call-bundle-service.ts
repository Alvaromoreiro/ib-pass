
import * as angular from 'angular';
import {AncillariesMMBConstants} from '../ib-MmB-ancillaries-page/constants/ib-MmB-ancillaries-constants';
export class CallBundleService {

    constructor (
        private AncillariesConstants: AncillariesMMBConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getBundle = () => {
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.AncillariesConstants.DEFAULT_ENDPOINTS.bundleServiceURI;
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
        const endpoint = this.AncillariesConstants.DEFAULT_ENDPOINTS.putBundleURI;
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
CallBundleService.$inject = ['AncillariesConstants', 'localStorageService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', 'CommonsHttpServicesConstants'];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'CallBundleService',
        CallBundleService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'CallBundleService',
        CallBundleService
    );
}
