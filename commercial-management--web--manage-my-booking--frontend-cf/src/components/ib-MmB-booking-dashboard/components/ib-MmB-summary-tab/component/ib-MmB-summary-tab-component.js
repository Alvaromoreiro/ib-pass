(function () {
    'use strict';

    // Usage: <ib-MmB-summary-tab></ib-MmB-summary-tab>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-summary-tab-module')
        .component('ibMmbSummaryTab', {
            controller: 'SummaryTabController',
            controllerAs: 'summaryTabCtrl',
            bindings: {
                model: '<',
                ancillariesInfo: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-summary-tab-view.html';
            }]
        });

})();