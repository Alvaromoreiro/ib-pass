(function () {
    'use strict';

    angular
        .module('ib-health-form-module')
        .controller('IbHealthFormController', IbHealthFormController);

    IbHealthFormController.$inject = ['localStorageService', 'HealthFormService', '$rootScope'];
    function IbHealthFormController (localStorageService, HealthFormService, $rootScope) {
        var vm = this;
        vm.model = {};
        vm.$onInit = activate;
        vm.bookingInfo = localStorageService.get('bookingInfo');
        vm.changeState = changeState;
        vm.toggleCollapse = toggleCollapse;
        vm.isCollapsed = true;
        vm.titleBox = {
            icon: 'icon-quality-certificates ib-ui-titles-icon-health-form',
            subtitle: 'MMB_HEALTH_FORM_TEXT',
            modifier: 'ib-ui-titles--type-1 ib-ui-titles--title-bold-hard ib-health-form__icon-title ib-ui-titles-health-form'
        };

        function activate () {
            if(window.debugFlag)
            vm.state = false;
            populatePassengerTable();
            vm.language = $rootScope.appLang;
        }

        function changeState () {
            vm.state = !vm.state;
        }

        function populatePassengerTable () {
            const getPassengerData = () => HealthFormService.getHealthFormURL(vm.bookingInfo.flowId);
            const transformPassengers = (urls) => {
                vm.bookingInfo.passengers.forEach(passenger => {
                    let found = urls.data.passengers.find(element => element.passengerId === passenger.passengerId);
                    passenger.url=found.healthFormUrl;
                });
                placeParentsFirst();
            };
            getPassengerData().then(transformPassengers);
        }

        function placeParentsFirst () {
            vm.bookingInfo.passengers.sort((a, b) => {
                if(a.passengerType === 'ADULT' && b.passengerType !== 'ADULT') return -1;
                if(a.passengerType !== 'ADULT' && b.passengerType === 'ADULT') return 1;
                return 0;
            });
        }

        function toggleCollapse () {
            this.isCollapsed = !this.isCollapsed;
        }
    }
})();
