(function () {
    'use strict';

    // Usage: <ib-tab-slices-fn origin-destination-model=" "></ib-tab-slices-fn>
    // 
    // Creates:
    // 

    angular
        .module('ib-tab-slices-fn-module')
        .component('ibTabSlicesFn', {
            controller: 'TabSlicesFnController',
            controllerAs: 'tabSlicesFnCtrl',
            bindings: {
                originDestinationModel: '<',
                originDestinationIndex: '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-tab-slices-fn.html';
            }]
        });
})();