import * as angular from 'angular';

import { BookingPromiseProxy } from '../http-services/proxy/ib-booking-promise-proxy.service';
export class BookingBackgroundImagesService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private BookingAppConstants: BookingAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    getBackgroundImages = () => {
        const backgroundImages = this.localStorageService.get('backgroundImagesList');
        return new Promise((resolve, reject) => {
            if (backgroundImages === null) {
                let endpoint = `${this.BookingAppConstants.imagesRoute}${this.BookingAppConstants.backgroundImagesJsonRoute}`;
                this.BookingPromiseProxy.get(endpoint)
                    .then(
                        (response)=> {
                            const responseJson = ((typeof response.data === 'object') && Array.isArray(response.data))? response.data:[];
                            this.localStorageService.set('backgroundImagesList', responseJson);
                            resolve(responseJson);
                           
                        },
                        ()=>{
                            this.localStorageService.set('backgroundImagesList', []);
                            reject({
                                errorCode: '',
                                message: 'REST_SERVICE_ERROR_GENERAL',
                                needsTranslate: true,
                                internalErrorCode: ''
                            });
                        }).catch(
                        () => {
                            this.localStorageService.set('backgroundImagesList', []);
                            reject({
                                errorCode: '',
                                message: 'REST_SERVICE_ERROR_GENERAL',
                                needsTranslate: true,
                                internalErrorCode: ''
                            });
                        }
                    );
            } else {
                resolve(backgroundImages);
            }
        });

    };
}
BookingBackgroundImagesService.$inject = [
    'BookingPromiseProxy', 'BookingAppConstants',
    'localStorageService'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'BookingBackgroundImagesService',
        BookingBackgroundImagesService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'BookingBackgroundImagesService',
        BookingBackgroundImagesService
    );
}
