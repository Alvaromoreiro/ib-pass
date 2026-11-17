(function () {
    'use strict';

    angular
        .module('ib-your-flight-info-pa-module')
        .controller('YourFlightInfoPAController', YourFlightInfoPAController);

    YourFlightInfoPAController.$inject = ['$scope'];
    function YourFlightInfoPAController($scope) {
        var vm = this;
        vm.openFareConditionsModal = openFareConditionsModal;
        vm.$onInit = activate;

        ////////////////

        function activate() { }

        function openFareConditionsModal(fareFamily) {
            $scope.$emit('openFareConditionsModal', fareFamily);
        }

    }
})();