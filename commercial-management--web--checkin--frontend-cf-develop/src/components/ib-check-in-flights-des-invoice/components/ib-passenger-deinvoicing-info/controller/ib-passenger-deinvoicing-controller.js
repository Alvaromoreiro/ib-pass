(function () {
    'use strict';

    angular
        .module('ib-passenger-deinvoicing-info-module')
        .controller('PassengerDeinvoicingInfoController', PassengerDeinvoicingInfoController);

    PassengerDeinvoicingInfoController.$inject = ['$scope', 'ModalService', 'CkiDatalayerConstants'];
    function PassengerDeinvoicingInfoController($scope, ModalService, CkiDatalayerConstants) {
        var vm = this;

        vm.$onInit = activate;
        vm.checkSelectedPassengers = checkSelectedPassengers;
        vm.openGenericModal = openGenericModal;

        function activate() {
        };

        /**
        * Emits event for update selected passenger
        * @param {Int} index Index of passenger selected
        */
        function checkSelectedPassengers(passengerInfo, mainEvent) {
            $scope.$emit('checkSelectedPassengersEvent', passengerInfo, mainEvent);
        }

        function openGenericModal(info) {
            ModalService.showGenericModal({ 'message': info.reason, 'needsTranslate': false, 'idModal': CkiDatalayerConstants.DATALAYER_MODAL_ID.NO_PREVIOUS_SEGMENT_WARNING });
        }
    };
})();
