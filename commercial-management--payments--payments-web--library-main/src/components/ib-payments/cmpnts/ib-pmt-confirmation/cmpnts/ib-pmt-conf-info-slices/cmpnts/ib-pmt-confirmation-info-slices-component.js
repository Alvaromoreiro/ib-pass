(function () {
    'use strict';

    // Usage: <ib-pmt-confirmation-info-slices confirmation-info-slices-model = "{}"></ib-pmt-confirmation-info-slices>
    // 
    // Creates:  show in the view the necesary info from the originDestination array. Print an slice for each segment in the array, with the necesary info
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-confirmation-info-slices-module')
        .component('ibPmtConfirmationInfoSlices', {
            controller: 'PmtConfirmationInfoSlicesController',
            controllerAs: 'cInfoSlicesCtrl',
            bindings: {
                confirmationInfoSlicesModel: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-confirmation-info-slices-view.html';
            }]
        });

})();