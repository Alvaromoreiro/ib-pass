(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('DangerousObjectsModalController', DangerousObjectsModalController);

    DangerousObjectsModalController.$inject = ['$rootScope', '$uibModalInstance', 'CkiDatalayerUtilsService', 'object', 'CheckinAppConstants', 'IbUtilsService', 'CkiDataLayerService'];
    function DangerousObjectsModalController ($rootScope, $uibModalInstance, CkiDatalayerUtilsService, object, CheckinAppConstants, IbUtilsService, CkiDataLayerService) {
        const vm = this;

        vm.model = object;

        vm.$onInit = activate;

        function activate () {
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.DANGEROUS_OBJECTS_MODAL);
            CkiDataLayerService.setProcessAndStep(CheckinAppConstants.QUADRIGAM.DANGEROUS_OBJECTS_MODAL);
            CkiDatalayerUtilsService.updateDatalayerInfo(CheckinAppConstants.QUADRIGAM.DANGEROUS_OBJECTS_MODAL);
            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerModalAttrs, CkiDatalayerUtilsService.removeDatalayerModalAttrs);
            vm.model.dangerConditions = false;
            if (vm.model.prefix !== null && vm.model.telephone !== null) {
                vm.model.phoneNumber = vm.model.prefix + ' ' + vm.model.telephone;
            } else {
                vm.model.phoneNumber = null;
            }
        }

        vm.acceptAndContinue = function () {
            if (vm.dangerousObjects) {
                vm.dangerousObjects.$submitted = true;
                if (vm.dangerousObjects.$valid) {
                    $uibModalInstance.close();
                    angular.noop();
                } else {
                    const parentScroll = angular.element('[name="' + vm.dangerousObjects.$name + '"]').offset().top;
                    const errorScroll = angular.element('[name="' + vm.dangerousObjects.$name + '"] input.ng-invalid:visible:first + label').offset().top;
                    angular.element('.modal.ib-modals.ib-modals--desktop').animate({ scrollTop: -parentScroll + errorScroll }, 'slow');
                }
            } else {
                $uibModalInstance.close();
            }
        };

        vm.close = function () {
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.FLIGHTS_PASSENGERS);
            CkiDatalayerUtilsService.updateDatalayerInfo(CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS);
            $uibModalInstance.dismiss();
        };

    }
})();
