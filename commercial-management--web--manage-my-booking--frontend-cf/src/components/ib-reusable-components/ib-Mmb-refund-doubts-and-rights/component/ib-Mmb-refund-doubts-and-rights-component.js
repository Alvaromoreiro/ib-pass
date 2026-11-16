(function () {
    'use strict';

    // Usage: <ib-MmB-refund-doubts-and-rights></ib-MmB-refund-doubts-and-rights>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-refund-doubts-and-rights-module')
        .component('ibMmbRefundDoubtsAndRights', {
            controller: 'RefundDoubtsAndRightsController',
            controllerAs: 'refundDoubtsAndRightsCtrl',
            bindings: {
                model: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-refund-doubts-and-rights-view.html';
            }]
        });

})();