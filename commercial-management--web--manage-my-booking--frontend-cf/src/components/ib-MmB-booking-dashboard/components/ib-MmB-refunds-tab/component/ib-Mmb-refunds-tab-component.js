(function () {
    'use strict';

    // Usage: <ib-MmB-refunds-tab></ib-MmB-refunds-tab>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-refunds-tab-module')
        .component('ibMmbRefundsTab', {
            controller: 'RefundsTabController',
            controllerAs: 'refundsTabCtrl',
            bindings: {
                flags: '<',
                model: '<',
                summaryModel: '<',
                voucherPriceInfo: '<',
                cashPriceInfo: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-refunds-tab-view.html';
            }]
        });

})();