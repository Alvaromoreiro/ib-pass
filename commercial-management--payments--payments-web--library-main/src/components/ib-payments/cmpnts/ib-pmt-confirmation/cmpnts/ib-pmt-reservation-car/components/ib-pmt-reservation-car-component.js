(function () {
    'use strict';

    // Usage: <ib-reservation-car model=""></ib-reservation-car model>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-reservation-car-module')
        .component('ibReservationCar', {
            controller: 'IbReservationCarController',
            controllerAs: 'resCarCtrl',
            bindings: {
                model: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-reservation-car-view.html';
            }]
        });

})();