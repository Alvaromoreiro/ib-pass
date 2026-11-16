(function () {
    'use strict';

    angular
        .module('ib-collapse')
        .controller('ibCollapseController', ibCollapseController);

    ibCollapseController.$inject = ['$scope', '$timeout', '$window'];
    function ibCollapseController($scope, $timeout, $window) {
        var vm = this;
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
        vm.closeContent = closeContent;
        vm.init = true;

        function clickCollapse(e, prevent) {
            vm.isCollapsed = !vm.isCollapsed;
            if (prevent || angular.isUndefined(prevent)) {
                e.preventDefault();
            }
        }

        function clickDetails(e, prevent) {
            vm.showDetails = !vm.showDetails;
            if (prevent || angular.isUndefined(prevent)) {
                e.preventDefault();
            }
        }

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
            vm.init = false;
        }

        function closeContent() {
            if (vm.init) {
                $scope.$emit('closeContent');
            }

        }
    }
})();