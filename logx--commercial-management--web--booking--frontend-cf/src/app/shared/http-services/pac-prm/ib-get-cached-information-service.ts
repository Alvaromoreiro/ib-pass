import * as angular from 'angular';
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';
export class AncGetCachedInformationService {

    constructor (
        private BookingAncillariesConstant: BookingAncillariesConstant,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private AncillariesTemporalUtilsService: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private BookingPromiseProxy: BookingPromiseProxy
    ) {}

    getCachedInformation = () => {
        const checkinId = this.localStorageService.get('flowId');
        let endpoint = this.AncillariesTemporalUtilsService.getEndpoint('pac-prm-rs');
        endpoint = endpoint ? endpoint + this.BookingAncillariesConstant.cachedInformationURI : this.BookingAncillariesConstant.DEFAULT_ENDPOINTS.cachedInformationURI;
        const uri = endpoint + checkinId + '/cached';
        return new Promise((resolve, reject) => {
            if (checkinId !== null)  {
                this.BookingPromiseProxy.get(endpoint).then(
                    (data)=> {
                        resolve(data.data);
                    },
                    (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
            }
        });
    };
}
AncGetCachedInformationService.$inject = ['BookingAncillariesConstant', 'localStorageService', 'AncillariesTemporalUtilsService', 'CommonsNewHttpUtilsErrorService', 'BookingPromiseProxy'];
try {
    const mod = angular.module('ib-booking-ancillaries-module');
    mod.service(
        'AncGetCachedInformationService',
        AncGetCachedInformationService
    );
} catch (error) {
    const mod = angular.module('ib-booking-ancillaries-module', []);
    mod.service(
        'AncGetCachedInformationService',
        AncGetCachedInformationService
    );
}
