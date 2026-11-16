import * as angular from 'angular';

import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';
export class IbCallDirectFareService {
    constructor (
        private HttpServicesConstants: HttpServicesConstantsType,
        private BookingPromiseProxy: BookingPromiseProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getDirectFare = (data): angular.IPromise< CommonsServiceTypes.CommonsProxyResponse | CommonsErrorsModel.ErrorDataGeneral> => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.FARE_DIRECT_SERVICE_URI;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, data).then(
                (response: CommonsServiceTypes.CommonsProxyResponse):void => {
                    resolve(response);
                },
                (error: CommonsErrorsModel.ErrorDataGeneral) :void =>{
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

}
IbCallDirectFareService.$inject = ['HttpServicesConstants', 'BookingPromiseProxy', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-flash-offer-service-module');
    mod.service(
        'IbCallDirectFareService',
        IbCallDirectFareService
    );
} catch (error) {
    const mod = angular.module('ib-flash-offer-service-module', []);
    mod.service(
        'IbCallDirectFareService',
        IbCallDirectFareService
    );
}
