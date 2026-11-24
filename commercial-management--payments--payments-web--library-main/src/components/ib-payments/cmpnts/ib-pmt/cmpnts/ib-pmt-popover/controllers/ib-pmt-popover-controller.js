(function () {
    'use strict';
    
    let popoverModule;
    try {
        popoverModule = angular.module('ib-pmt-popover-module');
    } catch (err) {
        popoverModule = angular.module('ib-pmt-popover-module', ['pascalprecht.translate']);
    }

    popoverModule.controller('IbPmtPopoverController', IbPmtPopoverController);

    IbPmtPopoverController.$inject = ['$scope', '$timeout'];
    function IbPmtPopoverController ($scope, $timeout) {
        const vm = this;
        vm.isOpen = false;
        vm.close = close;

        vm.close = function () {
            $timeout(() => { vm.isOpen = false; });
        };

        $scope.$on('outside-popover', () => { if (vm.isOpen) vm.close(); });
        $scope.$on('outside-popover-enter', () => { if (!vm.isOpen) $timeout(() => { vm.isOpen = true; }); });
    }
})();