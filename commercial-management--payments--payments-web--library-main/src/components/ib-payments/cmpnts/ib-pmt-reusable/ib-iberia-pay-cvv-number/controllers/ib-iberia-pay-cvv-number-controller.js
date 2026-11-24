(function () {
    'use strict';
    angular
        .module('ib-iberia-pay-cvv-number-module')
        .controller('ibIberiaPayCvvNumberController', ibIberiaPayCvvNumberController);

    ibIberiaPayCvvNumberController.$inject = ['PmtModalService'];
    function ibIberiaPayCvvNumberController(PmtModalService) {
        var vm = this;
        vm.openModal = openModal;
        function openModal() {
            PmtModalService.showGenericModal(false, 'ib-modal-payment-cvv-what-is.html', {}).result.then(angular.noop, angular.noop);
        }
    };
})();