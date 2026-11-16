(function () {
    'use strict';

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
