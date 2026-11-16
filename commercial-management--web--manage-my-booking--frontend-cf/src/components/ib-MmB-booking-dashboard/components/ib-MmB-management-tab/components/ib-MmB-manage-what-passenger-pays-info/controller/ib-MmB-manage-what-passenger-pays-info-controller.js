(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-what-passenger-pays-info-module')
        .controller('MmBManageWhatPassengerPaysInfoController', MmBManageWhatPassengerPaysInfoController);

    MmBManageWhatPassengerPaysInfoController.$inject = ['$rootScope', '$filter', '$translate', 'localStorageService'];
    function MmBManageWhatPassengerPaysInfoController($rootScope, $filter, $translate, localStorageService) {
        var vm = this;
        var indexPassenger = {}, passangerArray = [];
        vm.$onInit = activate;
        vm.changePassengerPay = changePassengerPay;
        vm.popoverHolidays = [
            { 'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'), 'path': null },
            { 'text': $filter('translate')('MMB_VC_IB_VACIONES_YOUR_CAR'), 'path': null }
        ];
        vm.passangerArray = null;
        vm.isPayerSelected = true;
        $rootScope.$on('IBVPayerNotSelected', setMandatoryPassenger);

        function activate() {
            var passengerNotTraveling = {
                flightPNRReferenceRPH: 99,
                consumerType: 'ADULT',
                name: {
                    firstName: $filter('translate')('MMB_VC_IB_VACIONES_PERSON_WHO_DOES_NOT_TRAVEL').toUpperCase(),
                    lastName: '',
                    title: 'Mr'
                }
            };
            if (vm.ibvInfo) {
                for (indexPassenger = 0; indexPassenger < vm.ibvInfo[0].consumers.length; indexPassenger++) {
                    if (vm.ibvInfo[0].consumers[indexPassenger].consumerType === 'ADULT') {
                        passangerArray.push(vm.ibvInfo[0].consumers[indexPassenger]);
                    }
                }
                passangerArray.push(passengerNotTraveling);
            }
            vm.passangerArray = passangerArray;
            localStorageService.remove('paymentpassengerIdIBV');
        }

        function changePassengerPay(passengerInfo) {
            var passengerId;
            if (passengerInfo.flightPNRReferenceRPH !== 99) {
                passengerId = passengerInfo.flightPNRReferenceRPH;
            } else {
                passengerId = 99;
            }
            vm.isPayerSelected = true;
            localStorageService.set('paymentpassengerIdIBV', passengerId);
        }

        function setMandatoryPassenger() {
            vm.isPayerSelected = false;
        }
    }
})();
