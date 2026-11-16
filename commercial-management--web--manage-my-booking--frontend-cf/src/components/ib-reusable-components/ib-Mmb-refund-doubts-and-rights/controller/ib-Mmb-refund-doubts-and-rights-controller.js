(function () {
    'use strict';

    angular
        .module('ib-MmB-refund-doubts-and-rights-module')
        .controller('RefundDoubtsAndRightsController', RefundDoubtsAndRightsController);

    RefundDoubtsAndRightsController.$inject = ['localStorageService'];
    function RefundDoubtsAndRightsController( localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            vm.phonesList = localStorageService.get('phonesList');
            if (vm.phonesList && vm.phonesList.RESERVAS) {
                vm.phoneNumber = vm.phonesList.RESERVAS.telephone;
                vm.prefix = vm.phonesList.RESERVAS.prefix;
            }
        }
    }
})();