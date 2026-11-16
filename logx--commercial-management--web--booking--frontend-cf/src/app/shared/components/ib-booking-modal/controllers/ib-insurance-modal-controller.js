(function () {


    angular
        .module('ib-booking-modal-module')
        .controller('InsuranceModalController', InsuranceModalController);

    InsuranceModalController.$inject = ['$uibModalInstance', 'object', '$rootScope', 'localStorageService', '$scope'];
    function InsuranceModalController ($uibModalInstance, object, $rootScope, localStorageService, $scope) {

        const vm = this;
        vm.close = close;
        vm.model = object;
        vm.selectInsuranceInexpensive = selectInsuranceInexpensive;
        vm.changeInsuranceCountry = changeInsuranceCountry;
        vm.completeForm = completeForm;

        $scope.$on('updateInfoModal', updateInfoModal);
        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            const selectedInsurance = localStorageService.get('selectedInsurance') || null;
            if (selectedInsurance) {
                vm.model.insurance = selectedInsurance;
            } else {
                vm.model.insurance = selectInsuranceInexpensive(vm.model);
            }
        }

        /**
         * Listening event emit ancillaries-controller if changeCountry and return the value before
         * conditions of insurance with diferrent country
         * @param {Object} selectedInsurance infoInsurance selected in combo for the user
         */
        function updateInfoModal (event) {
            if (vm.model.info.length > 1) {
                vm.model.insurance = selectInsuranceInexpensive(vm.model);
            } else {
                vm.model.insurance = vm.model.info[0];
            }
        }

        /**
         * Select more Inexpensive insurance for view ir user no selected Insurance
         * @param {Object} infoInsurance  selected in combo for the user
         */
        function selectInsuranceInexpensive (infoInsurance) {
            let insurance = {};
            insurance = infoInsurance.info[0];
            if (infoInsurance.info.length > 1) {
                angular.forEach(infoInsurance.info, (offer) => {
                    if (offer.originalTotalPrice <= insurance.originalTotalPrice) {
                        insurance = offer;
                    }
                });

            }
            return insurance;
        }





        /**
         * Emits event for call service of ancillaries for get
         * conditions of insurance with diferrent country
         * @param {Object} country Country selected in combo for get new price  of insurance
         */
        function changeInsuranceCountry (country) {
            vm.model.isModalLoading = true;
            $rootScope.$broadcast('changeInsuranceCountry', country);
        }

        /**
         * Check if form is valid, emit event to parent and close modal window
         */
        function completeForm () {
            vm.insuranceForm.$submitted = true;
            if (vm.insuranceForm.$valid) {
                if (vm.model.insuranceCountry.requiredFields.length > 0) {
                    angular.forEach(vm.model.passengers, (pas) => {
                        pas.isComplete = true;
                    });
                    localStorageService.set('passengersWithFieldIsurance', vm.model.passengers);
                }
                $rootScope.$broadcast('changeInsuranceInfo');
                $uibModalInstance.close('cancel');
            }
        }


        /**
         * Close modal and send event for discard changes on insurance
         */
        function close () {
            $rootScope.$broadcast('cancelChangesInsurance');
            $uibModalInstance.dismiss('cancel');
        }

    }
})();