(function () {
    'use strict';

    angular
        .module('ib-MmB-summary-tab-module')
        .controller('SummaryTabController', SummaryTabController);

    SummaryTabController.$inject = ['BookingDashboardConstants', '$timeout', '$rootScope'];
    function SummaryTabController (BookingDashboardConstants, $timeout, $rootScope) {
        const vm = this;

        activate();

        function activate () {
            vm.checkInLinkData = {
                colSize: BookingDashboardConstants.BOX_COL_SIZES.FULL,
                boxSize: BookingDashboardConstants.BOX_LINK_SIZES.FULL,
                icon: BookingDashboardConstants.BOX_LINK_ICONS.CHECK_IN,
                linkId: BookingDashboardConstants.BOX_LINKS_TYPES.CHECK_IN,
                text: {
                    title: 'MODULES_LINK_GO_TO_CHECK_IN_TEXT',
                    subtitle: 'MODULES_LINK_OPEN_TO_TEXT',
                    accessibilityText: 'MODULES_LINK_GO_TO_CHECK_IN_ACCESIBLE_TEXT'
                }
            };
            $rootScope.$broadcast('updateMonetateInfo');
        }
    }
})();