(function () {
    'use strict';

    // Usage: <ib-contact-data> </ib-contact-data>
    // 
    // Creates: a form with the disruption and emergency contact for the current passenger
    // 

    angular
        .module('ib-contact-data-module')
        .component('ibContactData', {
            controller: 'ContactDataController',
            controllerAs: 'contactCtrl',
            bindings: {
                pasContactData: '=',
                fieldsStatus: '<',
                passengerBasicInfo: '<',
                showData: '<',
                containerForm: '=',
                prefixes: '<',
                index: '@',
                passengerId: '<',
                gdprInfo: '='
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-contact-data-view.html';
            }]
        });
})();