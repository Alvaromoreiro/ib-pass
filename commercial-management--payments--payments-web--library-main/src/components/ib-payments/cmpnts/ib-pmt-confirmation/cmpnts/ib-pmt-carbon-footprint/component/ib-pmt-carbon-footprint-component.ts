import angular from 'angular';

const componentOptions = {
    bindings: {
        model: '='
    },
    controllerAs: 'footprintCtrl',
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-pmt-carbon-footprint-view.html';
    }]
};

const componentInfo = {
    module: 'ib-pmt-carbon-footprint-module',
    selector: 'ibPmtCarbonFootprint',
    inject: [],
    required: []
};

export class ibPmtCarbonFootprint implements ng.IController{
    constructor () {
    }
}

try {
    const mod = angular.module(componentInfo.module);
    ibPmtCarbonFootprint.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibPmtCarbonFootprint })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    ibPmtCarbonFootprint.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibPmtCarbonFootprint })
    );
}