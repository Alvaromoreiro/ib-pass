(function () {


    angular
        .module('ib-booking-collapse-module')
        .controller('IbBookingCollapseController', IbBookingCollapseController);

    function IbBookingCollapseController () {
        const vm = this;
        vm.isCollapsed = false;
        vm.showDetails = false;
        vm.text = '';
        vm.closedText = '';
        vm.openedText = '';
        vm.clickCollapse = clickCollapse;
        vm.clickDetails = clickDetails;
        vm.toggle = toggle;
        vm.externalChangeText = externalChangeText;
        vm.initCollapse = initCollapse;
        vm.init = true;

        function clickCollapse (e, prevent) {
            vm.isCollapsed = !vm.isCollapsed;
            if (prevent || angular.isUndefined(prevent)) {
                e.preventDefault();
            }
        }

        function clickDetails (e, prevent) {
            vm.showDetails = !vm.showDetails;
            if (prevent || angular.isUndefined(prevent)) {
                e.preventDefault();
            }
        }

        function initCollapse (closedText, openedText) {
            vm.closedText = closedText;
            vm.text = closedText;
            vm.openedText = openedText;
        }

        function externalChangeText (text) {
            vm.text = !vm.isCollapsed ? text : vm.text;
            vm.closedText = text;
        }

        function toggle () {
            vm.isCollapsed = !vm.isCollapsed;
            vm.text = vm.isCollapsed ? vm.openedText : vm.closedText;
            vm.init = false;
        }
    }
})();