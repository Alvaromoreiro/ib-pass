import type { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import * as angular from 'angular';

class IbLoadingRedirection implements ng.IController {

    constructor (
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGetLoginInfoService: CommonsGetLoginInfoService,
        private $location: ng.ILocationService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private CommonsModalService: CommonsModalService,
        private BookingUtilService: any,
        private BookingAppConstants: BookingAppConstants
    ) {}

    activate = (): any => {
        const isRedemptionFlow = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY)  === 'true';
        this.$rootScope.isRedemptionFlow = isRedemptionFlow;
        this.localStorageService.remove('customerData');
        this.CommonsGetLoginInfoService.checkCustomerStatus(true)
            .catch(() => {})
            .finally(() => {
                if(this.localStorageService.get('flowApp')!=='MMBOH') {
                    const headerModel = this.localStorageService.get('headerModel');
                    this.localStorageService.remove('headerModel');
                    this.initHeader(isRedemptionFlow, headerModel);
                }
                this.redirectToFlow();
            });
    };

    private initHeader = (isRedemption: boolean, headerModel: Record<string, any>) => {
        if (headerModel) {
            this.NewMainHeaderFacade.initHeader(
                {
                    originDestination: this.localStorageService.get('originDestination'),
                    redemption: headerModel?.headerModel?.redemption ?? isRedemption,
                    flightType: this.localStorageService.get('searchFlightType'),
                    currency: headerModel?.headerModel?.currency || (<any>this.localStorageService.get('commercialData'))?.currency,
                    passengers: headerModel?.headerModel?.passengers,
                    shoppingBasket: headerModel?.headerModel?.shoppingBasket,
                    steps: headerModel?.headerModel?.steps,
                    trips: headerModel?.headerModel?.trips,
                    advancedSearch: headerModel?.headerModel?.advancedSearch ?? false,
                    showModalBackHome: headerModel?.headerModel?.showModalBackHome ?? true,
                    showAdvancedSearch: headerModel?.headerModel?.showAdvancedSearch ??false
                },
                {
                    hasSteps: true,
                    steps: headerModel?.stepsModel?.stepsModel ??
                        (isRedemption ?
                            'REDEMPTION_STEPS' :
                            'DEFAULT_STEPS'),
                    position: this.localStorageService.get('actualStepFlow')
                },
                {
                    onLogin: this.onLogin,
                    onError: this.onError,
                    afterLogin: () => {},
                    userLogged: this.localStorageService.get('userLogged'),
                    loggedData: this.localStorageService.get('customerData') || this.localStorageService.get('membershipData') || undefined
                });
        }
    };

    private redirectToFlow = () => {
        const flowQuadrigam: string = this.localStorageService.get('actualStepFlow');
        if (flowQuadrigam) {
            this.$location.path('/' + flowQuadrigam);
        } else {
            this.$location.path('/');
        }
    };

    private onLogin = () => {};

    private onError = (error) => {
        this.CommonsModalService.finishWaiting();
    };

    $onInit = this.activate();

}

const selector = 'ibLoadingRedirection';
const options = {
    bindings: {},
    controller: IbLoadingRedirection,
    controllerAs: 'IbLoadingRedirectionCtrl',
    templateUrl: [
        '$rootScope',
        ($rootScope: CommonsRootScope) => {
            return `${$rootScope.routes.templates}ib-loading-redirection-view.html`;
        }
    ]
};

const inject = [
    '$rootScope',
    'localStorageService',
    'CommonsGetLoginInfoService',
    '$location',
    'NewMainHeaderFacade',
    'CommonsModalService',
    'BookingUtilService',
    'BookingAppConstants'
];
try {
    const mod = angular.module('ib-loading-redirection-module');
    options.controller.$inject = inject;
    mod.component(selector, options);
} catch (error) {
    const mod = angular.module('ib-loading-redirection-module', []);
    options.controller.$inject = inject;
    mod.component(selector, options);
}
