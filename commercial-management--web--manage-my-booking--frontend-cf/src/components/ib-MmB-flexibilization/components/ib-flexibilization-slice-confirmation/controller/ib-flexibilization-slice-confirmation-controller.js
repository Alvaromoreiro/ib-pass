(function () {
    'use strict';

    angular
        .module('ib-flexibilization-slice-confirmation-module')
        .controller('IbFlexibilizationSliceConfirmationController', IbFlexibilizationSliceConfirmationController);

    IbFlexibilizationSliceConfirmationController.$inject = ['$scope'];
    function IbFlexibilizationSliceConfirmationController($scope) {
        var vm = this;
        vm.$onInit = activate;
        vm.confirm = confirm;
        function activate() {
            vm.submit = false;
            vm.checkTermsConditions = false;
            vm.submitClicked = false;
        }
        function confirm() {
            vm.submit = true;
            if (vm.checkTermsConditions) {
                vm.submitClicked = true;
                $scope.$emit('confirmChange');
            }
        }
    }
})();