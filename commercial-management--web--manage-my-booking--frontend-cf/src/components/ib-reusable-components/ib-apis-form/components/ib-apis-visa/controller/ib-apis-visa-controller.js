(function () {
    'use strict';

    angular
        .module('ib-apis-visa-module')
        .controller('ApisVisaController', ApisVisaController);

    ApisVisaController.$inject = ['BookingDashboardConstants', '$scope'];
    function ApisVisaController(BookingDashboardConstants, $scope) {
        var vm = this;

        vm.$onInit = activate;
        vm.isDocCountryDisabled = isDocCountryDisabled;
        vm.checkRequiredFields = checkRequiredFields;
        vm.callVisaExpiryDateCtrl = callVisaExpiryDateCtrl;

        function activate() {
            checkRequiredFields();
        }

        function callVisaExpiryDateCtrl() {
          if (vm.pasVisaData && vm.pasVisaData.number) {
            $scope.$emit('nextStep');
          }
          else if (vm.pasVisaData && vm.pasVisaData.issuerCountry ) {
            $scope.$emit('nextStep');
          }
          else if (vm.pasVisaData && vm.pasVisaData.number === "") {
            $scope.$emit('nextStep');
          }
        }

        function isDocCountryDisabled() {
            return vm.pasVisaData.selectedDoc && (vm.pasVisaData.selectedDoc.type.code === BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.GREENCARD
                || vm.pasVisaData.selectedDoc.type.code === BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.REDRESSNUMBER
                || vm.pasVisaData.selectedDoc.type.code === BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.KNOWNTRAVELERNUMBER);
        };

        function checkRequiredFields() {
            if (angular.isDefined(vm.pasVisaData) && angular.isDefined(vm.pasVisaData.requiredFields) && vm.pasVisaData.requiredFields.length > 0) {
                vm.pasVisaData.requiredFields.indexOf('NUM_DOC')!== -1 ? vm.documentNumber = true : vm.documentNumber = false;
                vm.pasVisaData.requiredFields.indexOf('CNTRY_DOC')!== -1 ? vm.issueCountry = true : vm.issueCountry = false;
                vm.pasVisaData.requiredFields.indexOf('EXPIRY_DOC')!== -1 ? vm.expiryDate = true : vm.expiryDate = false;
            }
        }
    }
})();
