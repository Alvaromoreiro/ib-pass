(function () {
    'use strict';

    // Usage: <ib-MmB-disruption-refund></ib-MmB-disruption-refund>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-disruption-refund-module')
        .component('ibDisruptionRefundComponent', {
            controller: 'DisruptionRefundController',
            controllerAs: 'refundCtrl',
            bindings: {
                data: '=',
                model: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-disruption-refund-view.html';
            }]
        });
})();
