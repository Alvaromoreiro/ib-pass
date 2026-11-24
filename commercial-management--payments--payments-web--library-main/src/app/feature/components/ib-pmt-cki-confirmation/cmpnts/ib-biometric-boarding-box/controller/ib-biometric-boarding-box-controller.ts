import * as angular from 'angular';

const componentOptions = {
    bindings: {
        modifier: '@?',
        text: '@',
        textStrong: '@?',
        icon: '@',
        iconModifier: '@?',
        buttonText: '@?',
        buttonNavegation: '@?'
    },
    controllerAs: 'ibBioBoardingBoxCtrl',
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-biometric-boarding-box-view.html';
    }]
};
const controllerInfo = {
    module: 'ib-biometric-boarding-box-module',
    selector: 'ibBiometricBoardingBox',
    inject: ['$rootScope', '$window', 'localStorageService', 'pmtRedirectionService'],
    required: []
};
export class ibBiometricBoardingBoxController implements ng.IController {

    private strongText;
    private textStrong;
    private hasButton;
    private buttonText;
    private linkList;
    private buttonNavegation;
    constructor (
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private pmtRedirectionService: any
    ) {}
    $onInit (): void {
        this.strongText = !!this.textStrong;
        this.hasButton = !!this.buttonText;
        this.linkList = this.localStorageService.get('linksList');
    }
    /**
     * The function sets an url of the match for the specified buttonNavegation parameter on the component integration whith the linksList of the localStorage and uses the redirection service to navigate
     */
    goToBioBioardingInfoUrl = () =>{
        const navegationURL = this.$window.location.origin  + this.linkList[this.buttonNavegation].uri;

        this.pmtRedirectionService.newNavigation(navegationURL);
    };
}
try {
    const mod = angular.module(controllerInfo.module);
    ibBiometricBoardingBoxController.$inject = controllerInfo.inject;
    mod.component(
        controllerInfo.selector,
        angular.extend(componentOptions, { controller: ibBiometricBoardingBoxController })
    );
} catch (error) {
    const mod = angular.module(controllerInfo.module, controllerInfo.required);
    ibBiometricBoardingBoxController.$inject = controllerInfo.inject;
    mod.component(
        controllerInfo.selector,
        angular.extend(componentOptions, { controller: ibBiometricBoardingBoxController })
    );
}