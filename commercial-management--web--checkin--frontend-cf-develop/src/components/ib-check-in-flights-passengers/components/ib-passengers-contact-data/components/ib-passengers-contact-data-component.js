(function () {
    'use strict';

    // Usage: <ib-passenger-contact-data passengers=""></ib-passenger-contact-data>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-passengers-contact-data-module')
        .component('ibPassengersContactData', {
            controller: 'PassengersContactDataController',
            controllerAs: 'pasContactCtrl',
            bindings: {
                'passengers': '<',
                'emergency': '<',
                'prefixes': '<',
                'pasForm': '=',
                'activeFields': '<',
                'gdprInfo': '='

            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-passengers-contact-data-view.html';
            }]
        });

})();