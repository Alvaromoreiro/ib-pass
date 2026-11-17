(function () {
    'use strict';

    angular
        .module('ib-passengers-contact-data-module')
        .controller('PassengersContactDataController', PassengersContactDataController);

    PassengersContactDataController.$inject = ['$scope', 'FlightsPassengersUtils', 'CheckinAppConstants', 'localStorageService', 'IbSessionConfigService'];
    function PassengersContactDataController ($scope, FlightsPassengersUtils, CheckinAppConstants, localStorageService, IbSessionConfigService) {
        const vm = this;

        vm.isUserLogged = false;
        vm.ckeckApisUsTracing = {};
        vm.openGenericModal = openGenericModal;
        vm.useContactDataForAll = useContactDataForAll;
        vm.checkUsTracingAPIS = checkUsTracingAPIS;
        vm.changePrefix = changePrefix;

        vm.$onInit = activate;

        ////////////////

        function activate () {
            vm.isUserLogged = IbSessionConfigService.isUserLogged();
            vm.checkUsTracingAPIS();
        }

        function openGenericModal (info) {
            $scope.$emit('openModalNotAvailablePassengerEvent', info);
        }

        function useContactDataForAll (status, id, type) {
            $scope.$emit('useContactDataForAllEvent', status, id, type);
        }
        /**
         * Check if exist apis and required emergency data
         */
        function checkUsTracingAPIS () {
            let isRequiredEmergencyData = false;
            const localStorageUsTracing = localStorageService.get('usTracing');
            const usTracing = (localStorageUsTracing !== null && localStorageUsTracing);
            vm.ckeckApisUsTracing = FlightsPassengersUtils.initModelApisUsTracing();

            if (usTracing !== null && usTracing) {
                isRequiredEmergencyData = true;
            }

            for (let i = 0; i < vm.passengers.length; i++) {
                const passenger = vm.passengers[i];
                if (passenger.requiredInformation.indexOf(CheckinAppConstants.PASSENGER_DATA_OPTIONS.EMERGENCY_DATA) !== -1 && passenger.requiredInformation.indexOf(CheckinAppConstants.PASSENGER_DATA_OPTIONS.PRIVACY_STATEMENT) !== -1) {
                    isRequiredEmergencyData = true;
                } else if (usTracing && angular.isObject(passenger.fieldStatus) && angular.isObject(passenger.fieldStatus.emergencyData && passenger.requiredInformation.indexOf(CheckinAppConstants.PASSENGER_DATA_OPTIONS.EMERGENCY_DATA) !== -1 && passenger.requiredInformation.indexOf(CheckinAppConstants.PASSENGER_DATA_OPTIONS.PRIVACY_STATEMENT) !== -1)) {
                    isRequiredEmergencyData = true;
                    passenger.fieldStatus.emergencyData.mandatory = isRequiredEmergencyData;
                }
            }

            vm.ckeckApisUsTracing = FlightsPassengersUtils.checkExistAPIsUsTracing(vm.ckeckApisUsTracing, isRequiredEmergencyData);
        }

        function changePrefix ($event, idPass, isEmergency) {
            vm.passengers.forEach((pass) => {
                if(idPass === pass.id) {
                    if(isEmergency) {
                        pass.contactData.emergency.phone.countryCode = $event;
                    } else {
                        pass.contactData.phone.countryCode = $event;
                    }
                }
            });
        }
    }
})();