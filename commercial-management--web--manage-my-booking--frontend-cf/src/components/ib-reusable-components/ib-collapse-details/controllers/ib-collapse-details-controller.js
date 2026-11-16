(function () {
    'use strict';
    angular
        .module('ib-collapse-details-module')
        .controller('CollapseDetailsController', CollapseDetailsController);

    function CollapseDetailsController() {
        var vm = this;
        vm.isCollapsed = false;
        vm.text = '';
        vm.closedText = '';
        vm.openedText = '';

        vm.toggle = toggle;
        vm.externalChangeText = externalChangeText;
        vm.initCollapse = initCollapse;

        function initCollapse(closedText, openedText) {
            vm.closedText = closedText;
            vm.text = closedText;
            vm.openedText = openedText;
        }

        function externalChangeText(text) {
            vm.text = !vm.isCollapsed ? text : vm.text;
            vm.closedText = text;
        }

        function toggle() {
            vm.isCollapsed = !vm.isCollapsed;
            vm.text = vm.isCollapsed ? vm.openedText : vm.closedText;
        };

    }
})();