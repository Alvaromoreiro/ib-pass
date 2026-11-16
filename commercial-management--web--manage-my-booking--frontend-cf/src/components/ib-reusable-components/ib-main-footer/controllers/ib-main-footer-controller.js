(function () {
    'use strict';

    angular
        .module('ib-mmb-main-footer-module')
        .controller('mainFooterController', mainFooterController);

    mainFooterController.$inject = ['localStorageService', '$rootScope', 'CommonsGetWcsPhonesService', 'MmBAppConstants'];
    function mainFooterController(localStorageService, $rootScope, CommonsGetWcsPhonesService, MmBAppConstants) {
        var vm = this;
        // vm.phoneNumber = '';
        // vm.prefix = '';
        vm.updateInfoFooter = updateInfoFooter;
        activate();

        $rootScope.$on('updateInfoFooter', updateInfoFooter);

        function activate() {
            CommonsGetWcsPhonesService.getPhoneByCode(MmBAppConstants.WCS.PHONE_TYPES.SALES);
            vm.phonesList = localStorageService.get('phonesList');
            vm.qualifierBoolean = localStorageService.get('qualifierBoolean');
            vm.currentYear = new Date().getFullYear();
            // if (vm.phonesList && vm.phonesList.RESERVAS) {
            //     // vm.phoneNumber = vm.phonesList.RESERVAS.telephone;
            //     // vm.prefix = vm.phonesList.RESERVAS.prefix;
            // }
        }

        function updateInfoFooter() {
            vm.phonesList = localStorageService.get('phonesList');
            vm.phonesListIBHolidays = localStorageService.get('phonesListIBV');
            vm.qualifierBoolean = localStorageService.get('qualifierBoolean');
            // if (vm.phonesList && vm.phonesList.RESERVAS) {
            // //     vm.phoneNumber = vm.phonesList.RESERVAS.telephone;
            // //     vm.prefix = vm.phonesList.RESERVAS.prefix;
            // }
        }
    }
})();
