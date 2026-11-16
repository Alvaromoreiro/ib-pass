(function () {
    'use strict';

    angular
        .module('ib-logged-booking-item-module')
        .controller('LoggedBookingItemController', LoggedBookingItemController);

    LoggedBookingItemController.$inject = ['$scope'];
    function LoggedBookingItemController($scope) {
        var vm = this;

        vm.$onInit = activate;
        vm.manageBooking = manageBooking;

        ////////////////

        function activate() { }

        /**
         * Emits a 'searchBookingItem' with the current selected item model
         */
        function manageBooking() {
            $scope.$emit('searchBookingItem', vm.bookingItemModel);
        };
    }
})();