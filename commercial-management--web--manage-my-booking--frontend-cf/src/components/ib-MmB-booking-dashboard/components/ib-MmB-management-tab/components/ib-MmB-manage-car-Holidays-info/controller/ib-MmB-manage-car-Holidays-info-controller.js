(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-car-holidays-info-module')
        .controller('MmBManageCarHolidaysInfoController', MmBManageCarHolidaysInfoController);

    MmBManageCarHolidaysInfoController.$inject = ['$filter'];
    function MmBManageCarHolidaysInfoController($filter) {
        var vm = this;

        vm.popoverHolidays = [
            { 'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'), 'path': null },
            { 'text': $filter('translate')('MMB_VC_IB_VACIONES_YOUR_CAR'), 'path': null }
        ];        

    }
})();
