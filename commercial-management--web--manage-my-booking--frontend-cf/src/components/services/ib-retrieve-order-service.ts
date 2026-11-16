import * as angular from 'angular';

export class RetrieveOrderService {
    constructor (
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private localStorageService:angular.local.storage.ILocalStorageService,
    ) {}

    retrieveOrder = (surname: any, locator: any) => {

        return new Promise((resolve, reject) => {
            const generateQueryString = () => {
                return locator + '/surname/' + surname;
            };
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.retrieveOrderURI + generateQueryString()).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };


    retrieveOrderPost = (surname: any, locator: any) => {

        return new Promise((resolve, reject) => {
            let request = {};
            const generateRequest = () => {
                return request = {
                    locator: locator,
                    surname: surname
                };
            };
            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.retrieveOrderPostURI, generateRequest()).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    let flowId = error?.data?.flowId || error?.flowId;
                    if(flowId) {
                        this.localStorageService.set('flowId', flowId);
                    }
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    retrieveOrderConsent = (flowId: any) => {

        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.retrieveOrderURIConsent + flowId + '/consent-passengers').then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    retrieveOrderByCheckinId = (checkinId: any) => {

        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.retrieveOrderByCheckIdURI + '/' + checkinId).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    retrieveOrderByDeepLink = (deepLinkParams: any) => {

        return new Promise((resolve, reject) => {
            const paramsQuery = '?code=' + deepLinkParams.code + '&source=' + deepLinkParams.source + '&returnURL=' + deepLinkParams.returnURL;
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.retrieveOrderByDeepLinkURI + '/' + paramsQuery).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    retrieveOrderByFlightId = (flightId: string) => {

        return new Promise((resolve, reject) => {
            let request = {};
            const generateRequest = () => {
                return request = {
                    locSurEncrypt: flightId
                };
            };
            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.retrieveOrderByFlightIdURI, generateRequest()).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    if(error?.data?.flowId) {
                        this.localStorageService.set('flowId', error.data.flowId);
                    }
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
RetrieveOrderService.$inject = ['MmBAppConstants', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy','localStorageService'];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'RetrieveOrderService',
        RetrieveOrderService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'RetrieveOrderService',
        RetrieveOrderService
    );
}
