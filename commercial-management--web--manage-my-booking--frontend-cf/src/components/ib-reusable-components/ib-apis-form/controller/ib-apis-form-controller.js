(function () {
    'use strict';

    angular
        .module('ib-apis-form-module')
        .controller('ApisFormController', ApisFormController);

    ApisFormController.$inject = [];
    function ApisFormController() {

        var vm = this;
        vm.$onInit = activate;

        function activate() {
            vm.isRequiredHomeAddress = isRequiredHomeAddress();
        }

        function isRequiredHomeAddress() {
            let requiredFields = [];
            if(Array.isArray(vm.passengersData?.requiredFields)) {
                requiredFields = vm.passengersData.requiredFields;
            } else if(Array.isArray(vm.adultPassengersData?.requiredFields)) {
                requiredFields = vm.adultPassengersData.requiredFields;
            }
            return requiredFields.includes('HOME_ADDRESS');
        }
    }

})();
