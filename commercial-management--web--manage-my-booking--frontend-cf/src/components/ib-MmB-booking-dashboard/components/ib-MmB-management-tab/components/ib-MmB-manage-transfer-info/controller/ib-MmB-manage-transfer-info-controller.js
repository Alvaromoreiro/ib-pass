(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-transfer-info-module')
        .controller('MmBManageTransferInfoController', MmBManageTransferInfoController);

        MmBManageTransferInfoController.$inject = ['localStorageService'];
    function MmBManageTransferInfoController(localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            const bookingInfo = localStorageService.get('bookingInfo'), arrivalCity = bookingInfo.order.slices[0].segments[bookingInfo.order.slices[0].segments.length - 1].arrivalCity;
            vm.city = arrivalCity.description;
        }
    }
})();
