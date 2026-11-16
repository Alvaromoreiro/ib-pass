(function () {
    'use strict';

    // Usage:
    // <ib-order-summary-ancillaries></ib-order-summary-ancillaries>
    // Creates:
    //
    /* istanbul ignore next */
    angular
        .module('ib-order-summary-ancillaries-module')
        .component('ibOrderSummaryAncillaries', {
            controller: 'OrderSummaryAncillariesController',
            controllerAs: 'summaryAncCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-order-summary-ancillaries-view.html';
            }]
        });
})();
