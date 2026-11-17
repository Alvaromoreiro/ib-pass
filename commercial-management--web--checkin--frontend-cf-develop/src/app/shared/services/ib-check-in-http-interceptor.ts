import { IbHttpInterceptor } from 'ib-web-commons';
import { CommonsHttpServicesConstantsType, CommonsConstantsType, CommonsLoginConstantsType } from 'ib-web-commons/constants';
import * as angular from 'angular';

export class CkiIbHttpInterceptor extends IbHttpInterceptor {

    constructor (
        protected $rootScope: CommonsRootScope,
        protected $window: ng.IWindowService,
        protected localStorageService: ng.local.storage.ILocalStorageService,
        protected deviceDetector: any,
        protected IbCommonsNewHttpUtilService: any,
        protected $injector: any,
        protected $filter: angular.IFilterService,
        protected $location: angular.ILocationService,
        protected CommonsConstants: CommonsConstantsType,
        protected CommonsCookiesService: any,
        protected CommonsLoginConstants: CommonsLoginConstantsType,
        protected CommonsUserUtilsService: any,
        protected $cookies: angular.cookies.ICookiesService,
        protected CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        protected IbCUserStoreRepositoryService: any,
        protected RedirectionService: any
    ) {
        super($rootScope, $window, localStorageService, deviceDetector, IbCommonsNewHttpUtilService, $injector, $filter, $location, CommonsConstants, CommonsCookiesService, CommonsLoginConstants, CommonsUserUtilsService, $cookies, CommonsHttpServicesConstants, IbCUserStoreRepositoryService, RedirectionService);

        const originalResponseError = this.responseError;

        this.responseError = (response: any): Promise<unknown> => {
            const excludeErrorsCodes = ['PAC_PRM_6969', 'PAC_PRM_6970'];

            if (response?.data?.errors?.find(error => excludeErrorsCodes.includes(error?.code))) return Promise.reject(response);

            return originalResponseError(response);
        };
    }

    override showPermanentModal = () => {
        let actualStepFlow = this.$location.path();
        if (actualStepFlow === '/ibcose2' || actualStepFlow === '/ibcose'){
            this.checkCustomerStatus();
            this.changePageToPermanent();
        } else {
            this.$injector.get('CommonsModalService').showComponentModal('ibChangeStatusUserModalComponent', true)
                .result.then(this.changePageToPermanent, this.changePageToPermanent);
        }
    };


}
CkiIbHttpInterceptor.$inject = [
    '$rootScope',
    '$window',
    'localStorageService',
    'deviceDetector',
    'IbCommonsNewHttpUtilService',
    '$injector',
    '$filter',
    '$location',
    'CommonsConstants',
    'CommonsCookiesService',
    'CommonsLoginConstants',
    'CommonsUserUtilsService',
    '$cookies',
    'CommonsHttpServicesConstants',
    'IbCUserStoreRepositoryService',
    'RedirectionService'
];
angular
    .module('ib-shared-services-module')
    .service('CkiIbHttpInterceptor', CkiIbHttpInterceptor);
