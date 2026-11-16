(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-insurance-info-module')
        .controller('MmbManageInsuranceInfoController', MmbManageInsuranceInfoController);

    MmbManageInsuranceInfoController.$inject = [];

    function MmbManageInsuranceInfoController() {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            if (vm.model && vm.model.length > 0) {
                vm.insurance = vm.model;
            }
        }
    }
})();
