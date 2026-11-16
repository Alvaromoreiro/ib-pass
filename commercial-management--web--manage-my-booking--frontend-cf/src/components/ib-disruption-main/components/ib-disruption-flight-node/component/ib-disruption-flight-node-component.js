(function () {
    'use strict';

    // Usage: <ib-disruption-flight-node></ib-disruption-flight-node>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-disruption-flight-node-module')
        .component('ibDisruptionFlightNodeComponent', {
            controller: 'DisruptionFlightNodeController',
            controllerAs: 'nodeCtrl',
            bindings: {
                data: '=',
                channelFlag : '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-disruption-flight-node-view.html';
            }]
        });
})();
