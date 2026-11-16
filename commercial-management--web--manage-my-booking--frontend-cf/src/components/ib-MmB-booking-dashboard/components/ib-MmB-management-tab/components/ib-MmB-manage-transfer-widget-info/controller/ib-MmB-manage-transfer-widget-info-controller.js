(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-transfer-widget-info-module')
        .controller('MmbManageTransferWidgetInfoController', MmbManageTransferWidgetInfoController);

    MmbManageTransferWidgetInfoController.$inject = ['MmBModalService'];

    function MmbManageTransferWidgetInfoController (MmBModalService) {
        const vm = this;
        vm.openModalConditions = openModalConditions;
        vm.$onInit = activate;

        function activate () {
            formatDate();
        }

        function formatDate () {
            vm.order.forEach(element => {
                if(element.startDate) {
                    element.startDate = element.startDate.split('T')[0].replaceAll('-','/');
                    element.name = element.orderName ? element.orderName : element.name;
                }
            });
        }

        function openModalConditions (event, experience) {
            const infoBooking = vm.infoBooking;
            MmBModalService.showTransferWidgetModal('ib-show-transfer-widget-modal.html', {experience, infoBooking}).result.then(angular.noop, angular.noop);
        }
    }
})();
