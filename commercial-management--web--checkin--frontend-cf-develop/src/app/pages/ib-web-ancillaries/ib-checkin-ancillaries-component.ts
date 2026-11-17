import * as angular from 'angular';

const componentOptions = {
    bindings: {},
    controllerAs: 'ancillariesCtrl',
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-checkin-ancillaries-view.html';
    }]
};
const componentInfo = {
    module: 'ib-checkin-ancillaries-module',
    selector: 'ibAncillariesWeb',
    inject: [],
    required: []
};
export class ibAncillariesWeb implements ng.IController {
}

try {
    const mod = angular.module(componentInfo.module);
    ibAncillariesWeb.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibAncillariesWeb })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    ibAncillariesWeb.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibAncillariesWeb })
    );
}
