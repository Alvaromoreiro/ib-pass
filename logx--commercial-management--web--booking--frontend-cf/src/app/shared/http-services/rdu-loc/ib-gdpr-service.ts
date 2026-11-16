import * as angular from 'angular';
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
@Injectable({providedIn: 'root'})
export class GdprService {

    constructor (
        private BookingPromiseProxy: BookingPromiseProxy
    ) { }
        

    /**
     * Gets the whole companies list from the service and returns it. If there was and error in the http call,
     * this method treats these http error code and returns the object to show an error in the view.
     * @param {boolean} isUserPlusAndHard - The service should only call the -IBP endpoint if the user is not soft logged and the user is any other than IbZ
     * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
     *  When the promise rejects, it returns an object with the error data to show in the view
     */
    getGdprInfo = (isUserPlusAndHard: boolean): Promise<any> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.gdprServiceURI + (isUserPlusAndHard ? 'IBPRIVACIBP' : 'IBPRIVAC') + '/gdpr';
        return new Promise((resolve, reject) => {
            const config: any = {
                headers: {
                    'Cache-Control': 'private, max-age=600'
                }
            };
            this.BookingPromiseProxy.get(endpoint, config).then(
                (companiesData)=> {
                    resolve(companiesData.data);
                },
                (error) =>  reject(error)
            );
        });
    };


    getConditionsCoupon = (coupon: string, promise?: Promise<any>): Promise<any> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.gdprServiceURI + coupon + '/gdpr';
        return new Promise((resolve, reject) => {
            this.BookingPromiseProxy.get(endpoint).then(
                (companiesData)=> {
                    resolve(companiesData.data);
                },
                (error) =>  reject(error)
            );
        });
    };
}
downgradeToAJSService('GdprService', GdprService, 'ib-booking-services-module', []);

