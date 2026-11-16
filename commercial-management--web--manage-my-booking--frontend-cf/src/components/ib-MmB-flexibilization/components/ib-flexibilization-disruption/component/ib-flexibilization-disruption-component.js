(function () {
    'use strict';

    // Usage: <ib-flexibilization-disruption model="myCtrl.myModel"></ib-flexibilization-disruption>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-disruption-module')
        .component('ibFlexibilizationDisruption', {
            controller: 'IbFlexibilizationDisruptionController',
            controllerAs: 'ibFlexibilizationDisruptionCtrl',
            bindings: {
                model: '=',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-disruption-view.html';
            }]
        });
})();