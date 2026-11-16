import * as angular from 'angular';
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';

export class BookingGetCompaniesService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private HttpServicesConstants: HttpServicesConstantsType
    ) { }

    getCompanies = (): angular.IPromise<any> => {
        return new Promise( (resolve, reject) =>{

            const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.companiesServiceURI;
            const config: any = {
                headers: {
                    'Cache-Control': 'private, max-age=600'
                }
            };
            this.BookingPromiseProxy.get(endpoint, config).then(
                (companiesData)=> {
                    resolve(companiesData.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });

        });
    };
}

BookingGetCompaniesService.$inject = ['BookingPromiseProxy', 'CommonsNewHttpUtilsErrorService', 'HttpServicesConstants'];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'BookingGetCompaniesService',
        BookingGetCompaniesService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'BookingGetCompaniesService',
        BookingGetCompaniesService
    );
}
