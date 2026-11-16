import * as angular from 'angular';

export class CallAncillariesPageService {

    constructor (
        private MmBAppConstants: MmBAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getAncillaries = (): angular.IPromise<any> => {
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.MmBAppConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const uri = endpoint + checkinId + '/ancillaries';
        //const endpoint = this.MmBAppConstants.DEFAULT_ENDPOINTS.ancillariesCloudURI;
        //const uri = endpoint + checkinId;
        const maxEditableTimeout :number = this.localStorageService.get('ancillariesServiceTimeoutValue')|| null;
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(uri, null, maxEditableTimeout).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    getInsurance = (country: string) => {
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.MmBAppConstants.ancillariesURI;
        const uri = endpoint + checkinId + '/ancillaries' + '?ancillaryType=INSURANCE&residenceCountry=' + country;
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
}
CallAncillariesPageService.$inject = ['MmBAppConstants', 'localStorageService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy'];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'CallAncillariesPageService',
        CallAncillariesPageService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'CallAncillariesPageService',
        CallAncillariesPageService
    );
}
