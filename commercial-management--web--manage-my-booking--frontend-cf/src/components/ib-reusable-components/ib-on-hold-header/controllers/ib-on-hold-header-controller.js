(function () {
    'use strict';

    angular
        .module('ib-on-hold-header-module')
        .controller('IbOnHoldHeaderController', IbOnHoldHeaderController);

    IbOnHoldHeaderController.$inject = ['$scope', 'MmBModalService', '$rootScope', '$location', 'localStorageService'];
    function IbOnHoldHeaderController($scope, MmBModalService, $rootScope, $location, localStorageService) {
        var vm = this;
        vm.openModal = openModal;
        vm.backToMain = backToMain;
        $scope.$on('showWaitingModal', showWaitingModal);
        vm.$onInit = activate;

        function activate() {
            vm.bookingInfo = vm.bookingInfo || localStorageService.get('generalInfo');
        }

        function showWaitingModal() {
            MmBModalService.showWaitingModal('ib-modal-loading-transparent', 'ib-modals ib-modals--transparent', true);
        }

        function openModal(tmpl, clss, event, customerData) {
            MmBModalService.showLoginModal(tmpl, customerData, true, clss);
            event.preventDefault();
        }


        /**
         *Show a modal window to the user and ask him if he wants to
          go back to the initial main page.
         */
        function backToMain() {
            $location.path('/chktrp');
        }
    }
})();