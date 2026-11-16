(function () {


    angular
        .module('ib-booking-change-on-hold-now-module')
        .controller('IbBookingChangeOnHoldNowController', IbBookingChangeOnHoldNowController);

    IbBookingChangeOnHoldNowController.$inject = ['$rootScope','$scope','localStorageService', '$filter' , 'BookingUtilService','CommonsUtilService'];
    function IbBookingChangeOnHoldNowController ($rootScope, $scope, localStorageService, $filter, BookingUtilService, CommonsUtilService) {
        const vm = this;
        vm.$onInit = activate;
        vm.onHoldInfo;
        vm.showAncMessage = true;
        ////////////////

        function activate () {
            vm.onHoldInfo = CommonsUtilService.fiterTextOptionOnhold();
        }

    }
})();
