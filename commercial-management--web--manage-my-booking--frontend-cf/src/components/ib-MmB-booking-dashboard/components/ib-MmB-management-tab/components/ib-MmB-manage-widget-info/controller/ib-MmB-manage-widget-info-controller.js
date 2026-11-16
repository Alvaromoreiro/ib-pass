(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-widget-info-module')
        .controller('MmbManageWidgetInfoController', MmbManageWidgetInfoController);

    MmbManageWidgetInfoController.$inject = ['MmBModalService'];

    function MmbManageWidgetInfoController (MmBModalService) {
        const vm = this;
        vm.openModalConditions = openModalConditions;
        vm.formatDate = formatDate;
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
            MmBModalService.showWidgetModal('ib-show-widget-modal.html', {experience, infoBooking}).result.then(angular.noop, angular.noop);
        }
    }
})();
