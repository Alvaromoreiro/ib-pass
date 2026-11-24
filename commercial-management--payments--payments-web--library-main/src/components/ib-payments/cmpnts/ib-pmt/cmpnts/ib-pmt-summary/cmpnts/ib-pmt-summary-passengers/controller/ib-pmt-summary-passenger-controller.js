(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-passenger-module')
        .controller('PmtSummaryPassengerController', PmtSummaryPassengerController);

    PmtSummaryPassengerController.$inject = ['$scope', 'localStorageService'];
    function PmtSummaryPassengerController($scope, localStorageService) {
        var vm = this;
        vm.openTaxesModal = openTaxesModal;

        activate();

        function activate() {
            vm.flowApp = localStorageService.get('flowApp') || null;
            vm.unifiedOfferType = localStorageService.get('unifiedOfferType');
        }

        function openTaxesModal(breakdownTaxes) {
            $scope.$emit('openSummaryModalTaxesEvent', 'ib-modal-payment-taxes.html', breakdownTaxes);
        }
    }
})();