(function () {
    'use strict';

    angular
        .module('ib-pmt-external-tab-module')
        .controller('PmtExternalTabController', PmtExternalTabController);

    PmtExternalTabController.$inject = ['PmtUtilsService'];
    function PmtExternalTabController(PmtUtilsService) {
        var vm = this;

        vm.detectStateByZipCode = detectStateByZipCode;
        vm.fillZipCodeByState = fillZipCodeByState;

        /**
         * Detect state of a country given a zip code and initializes the combo 
         * @param {number} zipCode Zip code filled by user
             */
        function detectStateByZipCode(zipCode) {
            var detectStateByZipCodeInfo;
            if (vm.paymentInfo.issuerCountry.code === 'ES') {
                detectStateByZipCodeInfo = PmtUtilsService.detectStateByZipCode(zipCode, vm.statesList)
                vm.paymentInfo.state = detectStateByZipCodeInfo.state;
                vm.containerForm.zip_code.$setValidity('zipCodeInvalid', detectStateByZipCodeInfo.checker);
            }
        }

        /**
         * Fill first number(s) of zipCode with slected state
         * @param {Obj} state State selected by user
             */
        function fillZipCodeByState(state) {
            var fillZipCodeByStateInfo;
            if (vm.paymentInfo.issuerCountry.code === 'ES') {
                fillZipCodeByStateInfo = PmtUtilsService.fillZipCodeByState(state, vm.paymentInfo.zipCode);
                if (fillZipCodeByStateInfo.changeZipCode) {
                    vm.paymentInfo.zipCode = fillZipCodeByStateInfo.newZipCode;
                }
                vm.containerForm.zip_code.$setValidity('zipCodeInvalid', fillZipCodeByStateInfo.checker);
            }
        }

    }
})();
