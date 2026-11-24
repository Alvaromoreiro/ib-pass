(function () {
    'use strict';

    angular
        .module('ib-pmt-injectable-module')
        .controller('PmtInjectableController', PmtInjectableController);

    PmtInjectableController.$inject = ['$rootScope', '$scope', 'localStorageService'];
    function PmtInjectableController($rootScope, $scope, localStorageService) {
        var vm = this;
        vm.model = {};
        $scope.$on('changeStep', changeStep);
        activate();

        ////////////////

        function activate() {
            vm.model.actualStep = 'ibpurc';
            localStorageService.set('steps', { 'actualStep': vm.model.actualStep, 'nexStep': vm.model.nextStep });
        }
        function changeStep(event, actualStep, nextStep) {
            vm.model.previousStep = vm.model.actualStep === actualStep ? vm.model.actualStep : actualStep;
            vm.model.actualStep = nextStep;
            localStorageService.set('steps', { 'actualStep': actualStep, 'nexStep': nextStep });
        }
    }
})();