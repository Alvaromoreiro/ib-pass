(function () {
    'use strict';

    angular
        .module('ib-MmB-your-transfer-tab-module')
        .controller('MmBYourTransferTabController', MmBYourTransferTabController);

    MmBYourTransferTabController.$inject = ['localStorageService'];
    function MmBYourTransferTabController(localStorageService) {
        const vm = this;

        vm.$onInit = activate;

       

        function activate () {
            const bookingInfo = localStorageService.get('bookingInfo'), arrivalCity = bookingInfo.order.slices[0].segments[bookingInfo.order.slices[0].segments.length - 1].arrivalCity;
            vm.city = arrivalCity.description;
        }
    }
})();
