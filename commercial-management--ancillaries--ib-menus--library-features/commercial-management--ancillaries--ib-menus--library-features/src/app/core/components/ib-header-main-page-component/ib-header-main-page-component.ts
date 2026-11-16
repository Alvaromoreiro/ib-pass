@Component(
    'ib-header-main-page-component-module',
    'ibHeaderMainPage',
    {
        controllerAs: 'ibHeaderMainCtrl',
        templateUrl: [
            '$rootScope',
            ($rootScope: CommonsRootScope): string => {
                return `${$rootScope.routes.templates}ib-header-main-page-component.html`;
            }
        ]
    },
    ['ibHeaderMainPageServiceModel', 'localStorageService', '$window', '$rootScope', 'CommonsModalService', '$scope', 'CommonsUserUtilsService', 'ibHeaderMainPageConstants'],
    []
)
class ibHeaderMainPageController implements ng.IController {
    private model: ibHeaderMainPage.MainInfo;
    private updateLoginModelEvent;
    private isIbZero: boolean;
    private isSoftUser: boolean;
    private isFlowCki: boolean;
    public isLogged: boolean = false;

    constructor (
        private ibHeaderMainPageServiceModel: ibHeaderMainPageServiceModel,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $window: ng.IWindowService,
        private $rootScope: CommonsRootScope,
        private CommonsModalService: CommonsModalService,
        private $scope: angular.IScope,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private ibHeaderMainPageConstants: ibHeaderMainPageNameSpace.ibHeaderMainPageConstants
    ) {}

    updateLoginModel = () => {
        this.isIbZero = this.CommonsUserUtilsService.isIbZero();
        this.model = this.ibHeaderMainPageServiceModel.initializeMainPageHeader();
        this.model.login = {
            onLogin: this.onLogin,
            onError: this.onError
        };
        this.showUserInfo();
    };

    changeLanguage = () => {
        let controlledURLPath: string = '';
        const urlParams: any = this.localStorageService.get('urlParams');
        const exclude = ['language'];

        if (this.isFlowCki) exclude.push('market');
        for (const key in urlParams) {
            if (urlParams[key] !== null && !exclude.includes(key)) {
                switch (key) {
                        case 'travelAgencies':
                            controlledURLPath += '&ckiParaAAVV=' + urlParams[key];
                            break;
                        case 'reInvoicing':
                            controlledURLPath += '&undoCKI=' + urlParams[key];
                            break;
                        default:
                            controlledURLPath += '&' + key + '=' + urlParams[key];
                            break;
                }
            }
        }
        const paramLanguage: string = '?language=' + this.model.selectedLanguage.code;
        if (this.isFlowCki) {
            const paramMarket: string = '&market=' + this.model.selectedMarket.code.toLowerCase();
            this.model.marketLabel = this.model.selectedMarket.description;
            this.$window.location.href =
                this.$window.location.origin + this.$window.location.pathname + paramLanguage + paramMarket + controlledURLPath + this.$window.location.hash;
        } else {
            this.$window.location.href = this.$window.location.origin + this.$window.location.pathname + paramLanguage + controlledURLPath;
        }
    };

    changeLanguageForMarketSelector = () => {
        const selectedMarketCode = this.model.selectedMarket.code.toLowerCase();
        this.model.languages = this.ibHeaderMainPageConstants.languagesWcs[selectedMarketCode];
        this.model.selectedLanguage = this.model.languages[0];
        this.model.marketLabel = this.model.selectedMarket.description;
    };

    private handleUserLoggedState = (): void => {
        if (this.isSoftUser) {
            this.model.logged = false;
            this.model.customerData = null;
            this.$rootScope.$emit('loginContinueEvent');
            return;
        }

        const customerData: CustomerDataCommons = this.localStorageService.get('customerData');
        if (!customerData) {
            this.$rootScope.$emit('loginContinueEvent');
            return;
        }

        this.model.logged = true;
        this.model.customerData = {
            name: `${customerData.personalInfo.name || customerData.personalInfo.contactEmail} ${customerData.personalInfo.surname1}`.trim(),
            avios: !this.isIbZero ? customerData.generalInfo.aviosTransformed : null
        };
        this.$rootScope.$emit('loginContinueEvent');
    };

    afterLogin = () => {
        this.isIbZero = this.CommonsUserUtilsService.isIbZero();
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.showUserInfo();
        this.handleUserLoggedState();
    };

    onLogin = () => {
        this.CommonsModalService.showWaitingModal('generic-wait-modal', 'ib-modals ib-modals--loading', true, null);
    };

    onError = (error: object) => {
        this.CommonsModalService.finishWaiting();
    };

    $onInit = () => {
        this.isIbZero = this.CommonsUserUtilsService.isIbZero();
        this.updateLoginModelEvent = this.$rootScope.$on('updateLoginModelEvent', this.updateLoginModel);
        this.$scope.$on('$destroy', this.updateLoginModelEvent);
        this.updateLoginModel();
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.isFlowCki = this.$rootScope?.flowName === 'CKI';
        this.showUserInfo();
    };

    showUserInfo = () => {
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.isLogged = this.model.logged && !this.isSoftUser;
    };
}