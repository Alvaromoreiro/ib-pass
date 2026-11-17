(function () {
    'use strict';

    angular
        .module('ib-contact-data-module')
        .controller('ContactDataController', ContactDataController);

    ContactDataController.$inject = ['$scope', 'IbSessionConfigService'];

    function ContactDataController ($scope, IbSessionConfigService) {
        const vm = this;
        vm.useDataForAll = useDataForAll;
        vm.isUserLogged = false;
        activate();

        ////////////////

        function activate () {
            vm.isUserLogged = IbSessionConfigService.isUserLogged();
            if (vm.showData && vm.showData.showUseForAll.state) {
                $scope.$emit('updateShowDataOfPassengers', vm.showData.showUseForAll.passengerId);
                vm.showData.showUseForAll.state = false;
            }
        }

        /**
         * Emits event to parent for check manage info
         * @param {String} passengerId ID of passenger selected
         * @param {String} type Type of option selected (Data contact or emergency info )
         */
        function useDataForAll (passengerId, type) {
            $scope.$emit('useDataForAll', passengerId, type);
        }

    }
})();