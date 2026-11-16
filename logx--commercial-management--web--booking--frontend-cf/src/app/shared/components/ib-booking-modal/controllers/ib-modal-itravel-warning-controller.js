(function () {


    angular
        .module('ib-booking-modal-module')
        .controller('ITravelWarningModalController', ITravelWarningModalController);

    ITravelWarningModalController.$inject = ['$rootScope', '$uibModalInstance', 'object', 'DatalayerUtilsService', '$filter', '$scope'];
    function ITravelWarningModalController ($rootScope, $uibModalInstance, object, DatalayerUtilsService, $filter, $scope) {
        const vm = this;
        vm.model = object;

        activate();
        vm.close = closeModal;
        vm.accept = acceptModal;
        vm.checkItravelAgain = checkItravelAgain;

        ////////////////

        function activate () {
            const idModal = vm.model && vm.model.idModal ? vm.model.idModal : vm.model;
            DatalayerUtilsService.sendDatalayerModalEvent(idModal);
            $uibModalInstance.result.then(DatalayerUtilsService.removeDatalayerModalAttrs, DatalayerUtilsService.removeDatalayerModalAttrs);
        }
        /**
         * Closes the modal dismissing its instance
         */
        function closeModal () {
            $uibModalInstance.dismiss();
        }

        /**
         * Closes the modal calling close method of its instance
         */
        function acceptModal () {
            $uibModalInstance.close();
        }

        /**
         * Emits the event that notify the controller about the "I Travel" checkbox status. In this case we set it to true
         */
        function checkItravelAgain () {
            $scope.$emit('checkITravelAgain');
            closeModal();
        }
    }
})();
