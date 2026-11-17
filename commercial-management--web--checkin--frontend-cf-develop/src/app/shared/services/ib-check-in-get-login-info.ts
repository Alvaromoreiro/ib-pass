import { CommonsGetLoginInfoService } from 'ib-web-commons';
import * as angular from 'angular';

export class CkiCommonsGetLoginInfoService extends CommonsGetLoginInfoService {

    constructor (
        protected localStorageService: ng.local.storage.ILocalStorageService,
        protected CommonsCheckLoginWCSService: any,
        protected IbCAuthTokenService: any,
        protected CommonsLoginUtilsService: any,
        protected IbCCustomerDataService: any,
        protected $rootScope: CommonsRootScope,
        protected $q: ng.IQService,
        protected CommonsLoginConstants: any,
        protected CommonsConstants: any,
        protected IbCOnBusinessMembershipService: any,
        protected IbCOnBusinessEmployeesService: any,
        protected RedirectionService: any,
        protected $filter: ng.IFilterFunction,
        protected CommonsUtilService: any,
        protected CommonsCookiesService: any,
        protected CommonsModalService: CommonsModalService,
        protected $window: ng.IWindowService,
        protected $location: angular.ILocationService,
        protected CommonsUserUtilsService: any,
        protected userStoreService: any
    ) {
        super(localStorageService, CommonsCheckLoginWCSService, IbCAuthTokenService, CommonsLoginUtilsService, IbCCustomerDataService, $rootScope, $q, CommonsLoginConstants, CommonsConstants, IbCOnBusinessMembershipService, IbCOnBusinessEmployeesService, RedirectionService, $filter, CommonsUtilService, CommonsCookiesService, CommonsModalService, $window, $location, CommonsUserUtilsService, userStoreService);
    }

    override showChangeStatusModal = () => {
        let actualStepFlow = this.$location.path();
        if (actualStepFlow === '/ibcose2' || actualStepFlow === '/ibcose'){
            this.IbCCustomerDataService.getCustomerData().then(
                () => {
                    this.localStorageService.set('reloadCustomerComplete', false);
                    this.changePageToPermanent();
                }
            );
        } else {
            this.CommonsModalService.showComponentModal('ibChangeStatusUserModalComponent', true)
                .result.then(this.changePageToPermanent, this.changePageToPermanent);
        }
    };


}
CkiCommonsGetLoginInfoService.$inject = [
    'localStorageService',
    'CommonsCheckLoginWCSService',
    'IbCAuthTokenService',
    'CommonsLoginUtilsService',
    'IbCCustomerDataService',
    '$rootScope',
    '$q',
    'CommonsLoginConstants',
    'CommonsConstants',
    'IbCOnBusinessMembershipService',
    'IbCOnBusinessEmployeesService',
    'RedirectionService',
    '$filter',
    'CommonsUtilService',
    'CommonsCookiesService',
    'CommonsModalService',
    '$window',
    '$location',
    'CommonsUserUtilsService',
    'IbCUserStoreRepositoryService'
];
angular
    .module('ib-shared-services-module')
    .service('CkiCommonsGetLoginInfoService', CkiCommonsGetLoginInfoService);
