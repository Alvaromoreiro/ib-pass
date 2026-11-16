import angular from 'angular';

const componentOptions = {
    controller: 'FlightComponentController',
    controllerAs: 'flightCtrl',
    bindings: {
        trip: '<',
        isShuttleFlow: '<?'
    },
    templateUrl: ['$rootScope', '$attrs', function ($rootScope: CommonsRootScope, $attrs) {

        return $rootScope.routes.templates +  ($attrs.template ||'ib-flight-view.html');

    }]
};
const componentInfo = {
    module: 'ib-flight-module',
    selector: 'ibFlightComponent',
    inject:['$rootScope'],
    required: []
};
export class FlightComponentController implements ng.IController {
    trip: RedBarModel.originDestinationResponse;
    isAirShuttle: boolean;
    constructor (private $rootScope: any) { }
    $onInit = () => { };
}
try {
    const mod = angular.module(componentInfo.module);
    FlightComponentController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: FlightComponentController })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    FlightComponentController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: FlightComponentController })
    );
}