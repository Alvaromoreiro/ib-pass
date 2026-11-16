(function () {

    'use strict';
    angular.module('ib-disruption-refund-module')
        .controller('DisruptionRefundController', DisruptionRefundController);

    DisruptionRefundController.$inject = ['$rootScope', '$location', 'MmBAppConstants', 'CommonsUtilService'];

    function DisruptionRefundController($rootScope, $location, MmBAppConstants, CommonsUtilService) {
        var vm = this;
        vm.model = {};
        vm.goBack = goBack;
        activate();


        function activate() {
            CommonsUtilService.setTitlePage("MMB_TITLE_DISRUPTION_CASH_REFUND_CONFIRMATION");
        }


        function goBack() {
            $location.path(MmBAppConstants.PAGES_URL.DISRUPTION_DASHBOARD);
            $rootScope.$broadcast('closeEntireModal');
        }
    }
})();
