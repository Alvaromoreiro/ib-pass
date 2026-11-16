import angular  from 'angular';
const componentOptions = {
    controller: 'PassengersController',
    controllerAs: 'passengersCtrl',
    bindings: {
        isMultiflight: '<',
        passengerNumber: '<'
    },
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-passengers-component.html';
    }]
};
const componentInfo = {
    module: 'ib-passengers-module',
    selector: 'ibPassengers',
    inject:['$window', '$rootScope'],
    required: []
};
export class PassengersController implements ng.IController {
    public isMultiflight: boolean;
    public passengerNumber: number;
    constructor (
    ) { }

    $onInit = () => { };
}

try {
    const mod = angular.module(componentInfo.module);
    PassengersController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: PassengersController })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    PassengersController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: PassengersController })
    );
}

