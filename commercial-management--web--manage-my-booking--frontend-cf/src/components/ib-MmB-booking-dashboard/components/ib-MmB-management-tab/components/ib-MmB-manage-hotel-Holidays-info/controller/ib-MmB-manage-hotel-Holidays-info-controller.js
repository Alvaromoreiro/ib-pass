(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-hotel-holidays-info-module')
        .controller('MmBManageHotelHolidaysInfoController', MmBManageHotelHolidaysInfoController);

    MmBManageHotelHolidaysInfoController.$inject = ['$rootScope', '$filter', 'localStorageService'];
    function MmBManageHotelHolidaysInfoController($rootScope, $filter, localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        vm.popoverHolidays = [
            { 'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'), 'path': null },
            { 'text': $filter('translate')('MMB_VC_IB_VACIONES_YOUR_HOTEL'), 'path': null }
        ];

        function activate() {

        }
        
    }
})();