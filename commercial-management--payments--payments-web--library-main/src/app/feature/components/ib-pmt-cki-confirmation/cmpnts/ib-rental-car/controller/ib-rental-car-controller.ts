import * as angular from 'angular';

const componentOptions = {
    bindings: {},
    controllerAs: 'ibRentalCarController',
    templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
        return CheckinRouterConstants.templatesRoute + 'ib-rental-car-view.html';
    }]
};
const controllerInfo = {
    module: 'ib-rental-car-module',
    selector: 'ibRentalCarController',
    inject: ['$window', '$rootScope'],
    required: []
};
export class ibRentalCarController implements ng.IController {

    constructor (
        private $window: ng.IWindowService,
        private $rootScope: CommonsRootScope
    ) {}
    $onInit (): void {}
    redirect = (uri) => {
        this.$window.open(uri, '_blank');
    };
}
try {
    const mod = angular.module(controllerInfo.module);
    ibRentalCarController.$inject = controllerInfo.inject;
    mod.component(
        controllerInfo.selector,
        angular.extend(componentOptions, { controller: ibRentalCarController })
    );
} catch (error) {
    const mod = angular.module(controllerInfo.module, controllerInfo.required);
    ibRentalCarController.$inject = controllerInfo.inject;
    mod.component(
        controllerInfo.selector,
        angular.extend(componentOptions, { controller: ibRentalCarController })
    );
}