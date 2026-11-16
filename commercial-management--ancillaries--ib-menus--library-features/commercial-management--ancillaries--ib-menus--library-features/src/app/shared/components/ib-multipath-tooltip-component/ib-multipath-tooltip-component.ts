import angular from 'angular';
const componentOptions = {
    bindings: {
        model: '<',
        numberTrips: '<'
    },
    controller: 'ibMultipathTooltipController',
    controllerAs: 'multiTooltipComponentCtrl',
    templateUrl: [
        '$rootScope', ($rootScope: CommonsRootScope):string => {
            return `${$rootScope.routes.templates}ib-multipath-tooltip-component.html`;
        }]
};
const componentInfo = {
    module: 'ib-multipath-tooltip-component-module',
    selector: 'ibMultipathTooltipComponent',
    inject:[],
    required: []
};
export class ibMultipathTooltipComponentController implements ng.IController {

    constructor (
    ) { }

    $onInit = () => {};
}
try {
    const mod = angular.module(componentInfo.module);
    ibMultipathTooltipComponentController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibMultipathTooltipComponentController })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    ibMultipathTooltipComponentController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibMultipathTooltipComponentController })
    );
}