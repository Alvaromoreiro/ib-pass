(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmbRefundContinueModalController', MmbRefundContinueModalController);

    MmbRefundContinueModalController.$inject = ['$rootScope', '$uibModalInstance', 'object'];

    function MmbRefundContinueModalController($rootScope, $uibModalInstance, object) {
        var vm = this;
        vm.model = object;
        vm.closeModal = closeModal;
        vm.sendContinueFlowEvent = sendContinueFlowEvent;

        /**
         * Initialize modal controller
         */
        function activate() {
        };

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal() {
            $uibModalInstance.dismiss();
        }

        /**
         * Sends event to continue the flow
         */
        function sendContinueFlowEvent() {
            $rootScope.$broadcast('proceedToVoucherNextStep');
            closeModal();
        }
    }
})();
