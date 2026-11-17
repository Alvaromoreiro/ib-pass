(function () {
    'use strict';

    angular
        .module('ib-checkin-biometric-boarding-success-module')
        .controller('bioBoardingSuccessController', bioBoardingSuccessController);

    bioBoardingSuccessController.$inject = ['$scope'];
    function bioBoardingSuccessController($scope) {
        var vm = this;
        vm.goToConfirmation = goToConfirmation;

        ////////////////

        function goToConfirmation(){
            $scope.$emit('goToConfirmationEvent');
        }
    }
})();