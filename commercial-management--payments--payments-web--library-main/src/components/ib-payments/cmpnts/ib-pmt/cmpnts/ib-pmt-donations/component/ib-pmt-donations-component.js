(function () {
    'use strict';

    // Usage: <ib-pmt-donation></ib-pmt-donation>
    // 
    // Creates: A HTML struture with the info of the donation

    /* istanbul ignore next */
    angular.module('ib-pmt-donation-module')
        .component('ibPmtDonation', {
            controller: 'IbPmtDonationController',
            controllerAs: 'pmtDonationCtrl',
            bindings: {
                donationInfo: '<',
                containerForm: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-donations-view.html';
            }]
        });
})();