@Component( 'ib-main-header-module', 'ibMainHeader',  {
    controller: 'MainHeaderController',
    controllerAs: 'mainHeaderCtrl',
    bindings: {
        onCloseSession: '&',
        model: '<',
        loginInfo: '=',
        flightType: '='
    },
    templateUrl: ['$rootScope', function ($rootScope: CommonsRootScope) {
        return $rootScope.routes.templates + 'ib-main-header.html';
    }]
}, ['localStorageService', '$window', '$location', '$rootScope'], ['ib-user-tooltip-module'])
class ibMainHeader implements ng.IController {
    public model: any;
    public show: boolean;
    public loginInfo: any;
    public flightType: any;
    public logoUri: string;
    public onCloseSession: ()=>void;
    public showUserTooltip: boolean = false;
    public showIconSeparators: boolean = false;
    public isCKI: boolean = false;


    constructor (private localStorageService: angular.local.storage.ILocalStorageService,
        private $window: ng.IWindowService, private $location: ng.ILocationService, private $rootScope: CommonsRootScope) { }

    $onInit () {
        this.logoUri = this.calculateLogoURL();
        this.checkModel();
        this.onCloseSession();
        this.isCKI = this.$rootScope.flowName === 'CKI';
        this.showUserTooltip = this.model?.flightType !== 'multiCityFlight' && this.loginInfo && this.loginInfo.isLogged;
        this.showIconSeparators = this.showUserTooltip && this.isCKI;
    }
    private calculateLogoURL = (): string  =>{
        let result: string = this.$window.location.origin;
        const bkiURLparams: any = this.localStorageService.get('bookingUrlParams');
        if (angular.isObject(bkiURLparams)) {
            if(angular.isString(bkiURLparams.fromMarket) && bkiURLparams.fromMarket.length > 0) {
                result +=`/${bkiURLparams.fromMarket.toLowerCase()}/`;
                if (angular.isString(bkiURLparams.fromLanguage) && bkiURLparams.fromLanguage.length > 0) {
                    result += `${bkiURLparams.fromLanguage.toLowerCase()}/`;
                }
            }
        }
        return result;
    };


    private checkModel = () => {
        !this.model ? this.show = false : this.show = true;
    };

    showComponentChooseLanguageMobile () {
        const quadrigamsInvalid = [];
        const actualQuadrigam = this.$location.path().replace('/', '');

        return this.isCKI && !quadrigamsInvalid.includes(actualQuadrigam);
    }
}