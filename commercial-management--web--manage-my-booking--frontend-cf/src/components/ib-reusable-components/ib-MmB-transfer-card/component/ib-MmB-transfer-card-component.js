(function () {
    'use strict';

     // Usage: <ib-MmB-transfer-card></ib-MmB-transfer-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-MmB-transfer-card-module')
        .component('ibMmbTransfer', {
            controller: 'MmBTransferController',
            controllerAs: 'transferCardCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-transfer-card-view.html';
            }]
        });
})();
