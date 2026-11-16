(function () {
    'use strict';

    angular
        .module('ib-apis-destination-info-module')
        .controller('ApisDestinationInfoController', ApisDestinationInfoController);

    ApisDestinationInfoController.$inject = [];
    function ApisDestinationInfoController() {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
          checkIsInfant();
        };

        function checkIsInfant() {
          if (vm.isInfant) {
            vm.destinationData.address = vm.relatedAdultData.destinationAddress.address;
            vm.destinationData.zipCode = vm.relatedAdultData.destinationAddress.zipCode;
            vm.destinationData.city = vm.relatedAdultData.destinationAddress.city;
            vm.destinationData.state = vm.relatedAdultData.destinationAddress.state;
            vm.inTransit = vm.relatedAdultData.inTransit;
          }
        }
    }
})();
