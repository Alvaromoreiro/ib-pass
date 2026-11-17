import * as angular from 'angular';
import {CkiCommonsGetLoginInfoService} from '@src/app/shared/services/ib-check-in-get-login-info';

class IbLoadingRedirection implements ng.IController {

    constructor (
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CkiCommonsGetLoginInfoService: CkiCommonsGetLoginInfoService,
        private $location: ng.ILocationService,
        private NewMainHeaderFacade: any,
        private CommonsModalService: CommonsModalService,
        private CheckinAppConstants: CheckinAppConstants
    ) {}

    activate = (): any => {
        this.localStorageService.remove('customerData');
        this.CkiCommonsGetLoginInfoService.checkCustomerStatus(true)
            .catch(() => {})
            .finally(() => {
                const headerModel = this.localStorageService.get('headerModel');
                this.localStorageService.remove('headerModel');
                this.initHeader(headerModel);
                this.redirectToFlow();
            });
    };


    private initHeader = (headerModel) => {
        if (headerModel) {
            this.NewMainHeaderFacade.initHeader(
                {
                    originDestination: this.localStorageService.get('headerInfo'),
                    redemption: '',
                    flightType: this.CheckinAppConstants.FLIGHTTYPE,
                    currency: headerModel?.headerModel?.currency,
                    shoppingBasket: headerModel?.headerModel?.shoppingBasket,
                    showBasket: true,
                    showModalBackHome: headerModel?.headerModel?.showModalBackHome ?? true
                },
                { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
                {
                    onLogin: this.onLogin,
                    onError: this.onError,
                    afterLogin: () => {},
                    userLogged: this.localStorageService.get('userLogged'),
                    loggedData: this.localStorageService.get('customerData') || this.localStorageService.get('membershipData') || undefined
                }
            );
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

    private onLogin = () => {
        this.CommonsModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
    };

    private onError = (error) => {
        this.CommonsModalService.finishWaiting();
        this.CommonsModalService.showGenericDynamicModal( true, 'generic-login-modal-error.html', error, 'GenericErrorModalController', error?.stateUserLogged ? 'ib-modals--backdrop-off' : null);
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
    'CkiCommonsGetLoginInfoService',
    '$location',
    'NewMainHeaderFacade',
    'CommonsModalService',
    'CheckinAppConstants'
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
