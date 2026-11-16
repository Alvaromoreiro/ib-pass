(function () {
    'use strict';

    // Usage: <ib-MmB-refund-information></ib-MmB-refund-information>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-refund-information-module')
        .component('ibMmbRefundInformation', {
            controller: 'RefundInformationController',
            controllerAs: 'refundInformationCtrl',
            bindings: {
                summaryModel: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-refund-information-view.html';
            }]
        });

})();
