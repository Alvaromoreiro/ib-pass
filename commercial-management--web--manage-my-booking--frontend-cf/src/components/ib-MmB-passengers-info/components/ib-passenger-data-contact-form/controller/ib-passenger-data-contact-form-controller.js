(function () {
    'use strict';

    angular
        .module('ib-passenger-data-contact-form-module')
        .controller('PassengerDataContactFormController', PassengerDataContactFormController);

    PassengerDataContactFormController.$inject = ['$scope'];

    function PassengerDataContactFormController($scope) {
        var vm = this;
        vm.nextFormDataContact = nextFormDataContact;
        vm.backFormDataContact = backFormDataContact;
        vm.needsConfirm = needsConfirm;
        vm.copyDataForAll = copyDataForAll;
        vm.$onInit = activate;

        ////////////////

        function activate() {
        }


        /**
         * Emits an 'dataContactFormNext' event indicating if 
         * @param {Object} currentForm Form of view
         */
        function nextFormDataContact(currentForm) {
            currentForm.$submitted = true;
            if (currentForm.$valid) {
                if (vm.passengersModel.length === 1 && !angular.equals(vm.originalDataModel.primaryContactInfo, vm.contactFormModel)) {
                    vm.passengersModel[0].contactInfo = angular.copy(vm.contactFormModel);
                } else if (vm.useForAll) {
                    usePassengerDataForAll();
                }

                $scope.$emit('updateContactInfo', vm.passengersModel, vm.contactFormModel, needsConfirm());
                currentForm.$submitted = false;
            }
        }


        /**
         * Emits an 'backFromDataContacto' event without more information
         * @param {Object} currentForm  Form of view
         */
        function backFormDataContact(currentForm) {
            $scope.$emit('dataContactFormBack');
        }

        /**
         * Checks if there was any change in the form and returns true if so
         */
        function needsConfirm() {
            return !isDataOriginal(vm.originalDataModel.primaryContactInfo, vm.contactFormModel) || !isPassengerDataOriginal();

            function isPassengerDataOriginal() {
                var i = 0, areEquals = true, j, found;
                while (areEquals && i < vm.originalDataModel.passengersContactInfo.length) {
                    j = 0, found = false;
                    while (!found && j < vm.passengersModel.length) {
                        if (vm.originalDataModel.passengersContactInfo[i].passengerId === vm.passengersModel[j].passengerId) {
                            found = true;
                            areEquals = isDataOriginal(vm.originalDataModel.passengersContactInfo[i].contactInfo, vm.passengersModel[j].contactInfo);
                        }
                        j++;
                    }
                    i++;
                }
                return areEquals;
            }

            function isDataOriginal(originalData, compareData) {
                var originalModel = originalData || {};
                compareData = compareData || {};
                return angular.equals(originalModel, compareData);
            }
        }


        /**
         * Copy information of passenger for data contact
         */
        function copyDataForAll() {
            if (vm.useForAll) {
                vm.contactFormModel = angular.copy(vm.passengersModel[0].contactInfo);
            }
        }

        /**
         * Copy the first passenger contact data into the rest passengers contact data and common data
         *  if passenger have optionalInformation.contactData
         */
        function usePassengerDataForAll() {
            var i;
            vm.contactFormModel = vm.passengersModel[0].contactInfo;
            for (i = 1; i < vm.passengersModel.length; i++) {
                if (vm.passengersModel[i].optionalInformation.contactData) {
                    vm.passengersModel[i].contactInfo = angular.copy(vm.passengersModel[0].contactInfo);
                }
            }
        }
    }
})();