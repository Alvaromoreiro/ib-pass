(function () {
    'use strict';
    angular
        .module('ib-collapse-details-module')
        .controller('CollapseDetailsController', CollapseDetailsController);

    CollapseDetailsController.$inject = ['$timeout', '$scope'];

    function CollapseDetailsController($timeout, $scope) {
        var vm = this;
        vm.isCollapsed = false;
        vm.text = '';
        vm.closedText = '';
        vm.openedText = '';
        vm.toggle = toggle;
        vm.externalChangeText = externalChangeText;
        vm.externalToggle = externalToggle;
        vm.initCollapse = initCollapse;
        vm.closeContent = closeContent;
        vm.init = true;

        $scope.$on('updateCollapseText', externalChangeText);
        $scope.$on('initSeatCollapse', initSeatCollapse);


        function initSeatCollapse() {
            vm.init = true;
            vm.isCollapsed = true;
        }

        function initCollapse(closedText, openedText) {
            vm.closedText = closedText;
            vm.text = closedText;
            vm.openedText = openedText;
        }

        function externalChangeText(evt, text) {
            vm.text = !vm.isCollapsed ? text : vm.text;
            vm.closedText = text;
        }

        function externalToggle(event) {
            var $element = findBaggagesCollapseElement(event);
            if ($element != null) {
                $timeout(function () {
                    angular.element($element.querySelector('.fc-collapse__more-details'))[0].click()
                });
            }
        }

        function toggle() {
            vm.isCollapsed = !vm.isCollapsed;
            vm.text = vm.isCollapsed ? vm.openedText : vm.closedText;
            vm.init = false;
        };

        function findBaggagesCollapseElement(event) {
            var $element = event.target.parentNode;
            var parentFound = false;
            var element, compiled;
            while ($element && !parentFound) {
                $element.className = $element.className || '';
                parentFound = $element.className.indexOf('fc_ibe-baggages_item-wrapper') !== -1;
                if (!parentFound) {
                    $element = $element.parentNode;
                }
            }
            return parentFound ? $element : null;
        }


        function closeContent() {
            if (vm.init) {
                $scope.$emit('closeContent');
            }

        }

    }
})();