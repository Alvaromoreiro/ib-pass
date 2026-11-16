(function () {
    'use strict';

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-what-passenger-pays-info-module')
        .component('ibMmbManageWhatPassengerPaysInfo', {
            controller: 'MmBManageWhatPassengerPaysInfoController',
            controllerAs: 'manageWhatPassengerPaysInfoCtrl',
            bindings: {
                model: '=',
                ibvInfo: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-what-passenger-pays-info-view.html';
            }]
        });
})();
