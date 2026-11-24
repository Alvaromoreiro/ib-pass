(function () {
    'use strict';

    // Usage: <ib-pmt-confirmation-info confirmation-info-model = "{}"></ib-pmt-confirmation-info>
    // 
    // Creates:  show in the view the necesary info from the originDestination array. Print an slice for each segment in the array, with the necesary info
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-confirmation-info-module')
        .component('ibPmtConfirmationInfo', {
            controller: 'PmtConfirmationInfoController',
            controllerAs: 'cInfoCtrl',
            bindings: {
                confirmationInfoModel: '<',
                confirmationInfoTitle: '<',
                confirmationInfoIndex: '<',
                isShuttleOpen: '<?',
                cabinUpgradingBids: '<?'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-confirmation-info-view.html';
            }]
        });

})();