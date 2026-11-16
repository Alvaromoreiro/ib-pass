import * as angular from 'angular';
import { BookingPromiseProxy} from '@src/app/shared/http-services/proxy/ib-booking-promise-proxy.service';

export class LetMeKnowService {
    constructor (
        private BookingModalService,
        private $route: angular.route.IRouteService,
        private $location: angular.ILocationService,
        private HttpServicesConstants: HttpServicesConstantsType,
        private BookingPromiseProxy: BookingPromiseProxy

    ) {}
    /**
    * Gets complete customer information from its rest service.
    * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
    *  When the promise rejects, it returns an object with the error data to show in the view
    */
    sendAlert = (postData) => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.SALEFORCE_CONTACT_ID;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, postData).then(
                (data)=> {
                    resolve(data);
                },
                (error)=>{
                    switch (error.errorCode) {
                            // In case of soft KO:
                            case 408:
                            case 412:
                            case 502:
                            case 504:
                                this.BookingModalService.showGenericDynamicModal(true, 'ib-not-avaibility-modal-error-soft-view.html', {}, 'NotAvaibilityController').result.then(
                                    () =>{
                                        this.$route.reload();
                                    },
                                    () =>{
                                        this.$route.reload();
                                    });
                                break;
                                // Other error will be taken as hard KO.
                            default:
                                this.BookingModalService.showGenericDynamicModal(true, 'ib-not-avaibility-modal-error-hard-view.html', {}, 'NotAvaibilityController').result.then(
                                    ()=> {
                                        this.$location.path('/ibbkerror');
                                    },
                                    ()=> {
                                        this.$location.path('/ibbkerror');
                                    });
                    }
                });
        });
    };
}
LetMeKnowService.$inject = [
    'BookingModalService',
    '$route',
    '$location',
    'HttpServicesConstants',
    'BookingPromiseProxy'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'LetMeKnowService',
        LetMeKnowService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'LetMeKnowService',
        LetMeKnowService
    );
}
