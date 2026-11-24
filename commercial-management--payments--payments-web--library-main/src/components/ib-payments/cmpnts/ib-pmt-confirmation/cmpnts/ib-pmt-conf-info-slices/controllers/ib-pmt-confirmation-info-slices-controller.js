(function () {
    'use strict';

    angular
        .module('ib-pmt-confirmation-info-slices-module')
        .controller('PmtConfirmationInfoSlicesController', PmtConfirmationInfoSlicesController);
    PmtConfirmationInfoSlicesController.$inject = ['localStorageService'];
    function PmtConfirmationInfoSlicesController(localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            vm.flowApp = localStorageService.get('flowApp');
            vm.isShuttleFlow = localStorageService.get('isShuttleFlow');
        }

    };
})();