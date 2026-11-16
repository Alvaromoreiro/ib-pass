(function () {
    'use strict';

    // Usage: <ib-flexibilization-total model="myCtrl.myModel"></ib-flexibilization-total>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-total-module')
        .component('ibFlexibilizationTotal', {
            controller: 'IbFlexibilizationTotalController',
            controllerAs: 'ibFlexibilizationTotalCtrl',
            bindings: {
                model: '=',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-total-view.html';
            }]
        });
})();