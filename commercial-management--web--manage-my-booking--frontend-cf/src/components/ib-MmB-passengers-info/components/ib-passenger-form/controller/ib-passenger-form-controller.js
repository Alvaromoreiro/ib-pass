(function () {
    'use strict';

    angular
        .module('ib-passenger-form-module')
        .controller('PassengerFormController', PassengerFormController);

    PassengerFormController.$inject = ['$scope'];

    function PassengerFormController($scope) {
        var vm = this;
        var previousCompanySelection;
        var originalInfo;
        vm.nextFromTabPassenger = nextFromTabPassenger;
        vm.backFromTabPassenger = backFromTabPassenger;
        vm.clearCodeNumber = clearCodeNumber;
        vm.needsConfirm = needsConfirm;
        vm.nextFromTabInfant = nextFromTabInfant;
        vm.goSpecialNeedsPage = goSpecialNeedsPage;
        vm.$onInit = activate;

        ////////////////

        function activate() {
            vm.passengerModel.viewed = true;
            originalInfo = angular.copy(vm.passengerModel.frequentFlyerInfo);
        }

        /**
         * Emits an 'passengerFormContactBack' event in the form of passengers
         */
        function backFromTabPassenger() {
            $scope.$emit('passengerFormContactBack');
        }

        /**
         * Emits an 'passengerFormContactNext' event with information of form of passenger
         */
        function nextFromTabPassenger(currentForm) {
            currentForm.$submitted = true;
            if (currentForm.$valid) {
                currentForm.$submitted = false;
                $scope.$emit('passengerFormContactNext', vm.passengerModel, needsConfirm());
            }
        }

        /**
         * Change tab if passenger is a INFANT
         */
        function nextFromTabInfant() {
            $scope.$emit('infantFormContactNext', vm.passengerModel, needsConfirm());
        }


        /**
        * @function
        * @name clearCodeNumber
        * @desc Clean the previous company code number if a company is selected
         */
        function clearCodeNumber() {
            vm.passengerModel.frequentFlyerInfo.number = previousCompanySelection && previousCompanySelection !== 'IB' && vm.passengerModel.frequentFlyerInfo.company === 'IB'
                ? '' : vm.passengerModel.frequentFlyerInfo.number;
            previousCompanySelection = vm.passengerModel.frequentFlyerInfo.company !== 'CKI_COMBO_BLANK' ? vm.passengerModel.frequentFlyerInfo.company : previousCompanySelection;
        }

        /**
         *  Emits event to go to special passenger page
         * @param {Int} index Index of passenger for show in special passengers
         */
        function goSpecialNeedsPage(passengerId) {
            $scope.$emit('openSpecialPassengers', passengerId);
        }

        /**
         * Checks if there was any change in the form and returns true if so
         */
        function needsConfirm() {
            return !angular.equals(originalInfo, vm.passengerModel.frequentFlyerInfo);
        }
    }
})();