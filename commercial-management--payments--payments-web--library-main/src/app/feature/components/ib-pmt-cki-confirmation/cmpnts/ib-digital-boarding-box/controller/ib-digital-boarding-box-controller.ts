import * as angular from 'angular';

const componentOptions = {
    bindings: {
        tittle: '@',
        icon: '@',
        isDigitalBoarding: '<'
    },
    controllerAs: 'ibDigitalBoardingBox',
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-digital-boarding-box-view.html';
    }]
};
const controllerInfo = {
    module: 'ib-digital-boarding-box-module',
    selector: 'ibDigitalBoardingBox',
    inject: ['$rootScope', 'localStorageService', 'pmtRedirectionService'],
    required: []
};
export class ibDigitalBoardingBoxController implements ng.IController {

    private infoDigitalBoarding;

    constructor (
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private pmtRedirectionService: any
    ) {}
    $onInit (): void {
        this.infoDigitalBoarding = this.localStorageService.get('digitalBoardingInfo') || null;
    }
    /**
     * The function sets an url of the match for the specified buttonNavegation parameter on the component integration whith the linksList of the localStorage and uses the redirection service to navigate
     */
    redirectToDigitalBoarding = () => {
        this.pmtRedirectionService.newNavigation(this.infoDigitalBoarding.digitalBoardings.segments[0].url);
    };
}
try {
    const mod = angular.module(controllerInfo.module);
    ibDigitalBoardingBoxController.$inject = controllerInfo.inject;
    mod.component(
        controllerInfo.selector,
        angular.extend(componentOptions, { controller: ibDigitalBoardingBoxController })
    );
} catch (error) {
    const mod = angular.module(controllerInfo.module, controllerInfo.required);
    ibDigitalBoardingBoxController.$inject = controllerInfo.inject;
    mod.component(
        controllerInfo.selector,
        angular.extend(componentOptions, { controller: ibDigitalBoardingBoxController })
    );
}