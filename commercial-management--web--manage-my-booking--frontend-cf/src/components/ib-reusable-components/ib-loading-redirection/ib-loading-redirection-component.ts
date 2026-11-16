import * as angular from 'angular';

class IbLoadingRedirection implements ng.IController {

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGetLoginInfoService: CommonsGetLoginInfoService,
        private $location: ng.ILocationService,
        private NewMainHeaderFacade: any,
        private CommonsModalService: CommonsModalService,
        private $window: ng.IWindowService,
    ) {}

    activate = (): any => {
        this.localStorageService.remove('customerData');
        this.CommonsGetLoginInfoService.checkCustomerStatus(true)
            .catch(() => {})
            .finally(() => {
                const headerModel = this.localStorageService.get('headerModel');
                this.localStorageService.remove('headerModel');
                this.initHeader(headerModel);
                this.redirectToFlow();
            });
    };

    private initHeader = (headerModel) => {
        if(headerModel) {
            this.NewMainHeaderFacade.initHeader(
                {
                    originDestination: null,
                    redemption: '',
                    flightType: null,
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
        const flowUrl: string = this.localStorageService.get('recoverUserFlow');
        if (flowUrl) {
            this.$window.location.href = flowUrl;
        } else {
            this.$location.path('/');
        }
    };

    private onLogin = () => {
        this.CommonsModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
    };

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
    'localStorageService',
    'CommonsGetLoginInfoService',
    '$location',
    'NewMainHeaderFacade',
    'CommonsModalService',
    '$window',
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
