(function () {
    'use strict';

    angular
        .module('ib-apis-basic-info-module')
        .controller('ApisBasicInfoController', ApisBasicInfoController);

    ApisBasicInfoController.$inject = [];
    function ApisBasicInfoController() {
        var vm = this;

        vm.$onInit = activate;

        function activate() {
            vm.isInfant = (vm.relatedAdultData) ? true : false;
            if(vm.isInfant && vm.relatedAdultData?.infData) {
                vm.pasBasicData = vm.relatedAdultData.infData;
            }
            vm.requiredFields = vm.requiredFields || [];
        };

    }
})();
