(function () {
    'use strict';

     // Usage: <ib-MmB-your-transfer-tab></ib-MmB-your-transfer-tab>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular
        .module('ib-MmB-your-transfer-tab-module')
        .component('ibMmbYourTransferTab', {
            controller: 'MmBYourTransferTabController',
            controllerAs: 'transferTabCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-your-transfer-tab-view.html';
            }]
        });
})();
