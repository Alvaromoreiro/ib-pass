(function () {
    'use strict';

    // Usage: <ib-total-price-summary total-price="120€"></ib-total-price-summary>
    // 
    // Creates: A HTML struture with the total price info. 
    // The binding 'totalPrice' is a value binding with the formatted total price 
    // to show directly in the view

    /* istanbul ignore next */
    angular.module('ib-MmB-rebook-error-module')
        .component('ibMmbRebookError', {
            controller: 'MmbRebookErrorController',
            controllerAs: 'mmbRebookErroryCtrl',
            bindings: {
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-MmB-rebook-error-view.html';
            }]
        });
})();