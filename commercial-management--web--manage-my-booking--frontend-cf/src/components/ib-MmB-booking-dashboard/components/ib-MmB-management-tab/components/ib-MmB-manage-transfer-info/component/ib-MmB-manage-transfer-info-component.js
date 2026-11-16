(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-transfer-info-module')
        .component('ibMmbManageTransferInfo', {
            controller: 'MmBManageTransferInfoController',
            controllerAs: 'manageTransferInfoCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-transfer-info-view.html';
            }]
        });
})();
