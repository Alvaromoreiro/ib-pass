import angular from 'angular';
(function () {
  'use strict';

  angular
    .module('ib-MmB-modal-module')
    .controller(
      'ibModalAssistanceVoucherEmailController',
      ibModalAssistanceVoucherEmailController
    );

  ibModalAssistanceVoucherEmailController.$inject = [
    '$uibModalInstance',
    'object',
    '$timeout',
  ];

  function ibModalAssistanceVoucherEmailController(
    $uibModalInstance,
    object,
    $timeout
  ) {
    var vm = this;
    vm.$onInit = activate;
    vm.close = close;
    vm.sendAssitanceVoucher = sendAssitanceVoucher;
    vm.object = object;
    vm.voucherEmailForm = null;
    vm.model = {
      submitted: false,
      showError: false,
      showOk: false,
      data: {
        email: null,
      },
    };

    function activate() {}

    function sendAssitanceVoucher() {
      vm.voucherEmailForm.$submitted = true;
      if (vm.voucherEmailForm.$valid) {
        vm.model.submitted = true;
        //LLAMAR AL SERVICIO, PROBANDO EL LOADING Y EL OK
        $timeout(() => {
          vm.model.showOk = true;
          $timeout(() => {
            close();
          }, 2000);
        }, 5000);
      }
    }

    function close() {
      if (
        angular.isDefined(vm.model.showError) &&
        angular.isDefined(vm.model.submitted)
      ) {
        vm.model.showError = false;
        vm.model.submitted = false;
      }
      $uibModalInstance.close();
    }
  }
})();
