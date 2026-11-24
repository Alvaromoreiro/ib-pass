(function () {
    'use strict';

    angular
        .module('ib-pmt-reservation-car-module')
        .controller('IbReservationCarController', IbReservationCarController);

    IbReservationCarController.$inject = ['$window', 'pmtRedirectionService'];
    function IbReservationCarController($window, pmtRedirectionService) {
        var vm = this;

        vm.redirect = redirect;
        vm.moreOffers = moreOffers;
        ////////////////

        function activate() {
        };

        /**
         * Redirect to external page
         * @param {String} uri 
         */
        function redirect(uri) {
            $window.open(uri, '_blank');
        }
        /**
         * Redirect to external page
         * @param {String} uri 
         */
        function moreOffers(uri) {
            pmtRedirectionService.newNavigation(uri, '_blank');
        }

    };
})();