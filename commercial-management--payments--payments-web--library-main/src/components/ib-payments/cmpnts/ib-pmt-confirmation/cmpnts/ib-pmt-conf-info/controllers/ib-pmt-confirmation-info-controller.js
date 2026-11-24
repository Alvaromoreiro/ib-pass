(function () {
    'use strict';

    angular
        .module('ib-pmt-confirmation-info-module')
        .controller('PmtConfirmationInfoController', PmtConfirmationInfoController);
    PmtConfirmationInfoController.$inject = ['localStorageService'];

    function PmtConfirmationInfoController(localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            vm.flowApp = localStorageService.get('flowApp');
            vm.isShuttleFlow = localStorageService.get('isShuttleFlow');
        }

    };
})();