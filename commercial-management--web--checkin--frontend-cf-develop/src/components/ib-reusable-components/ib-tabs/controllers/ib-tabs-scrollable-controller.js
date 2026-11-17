(function () {
    'use strict';

    angular
        .module('ib-tabs')
        .controller('tabsScrollableController', tabsScrollableController);

    tabsScrollableController.$inject = ['$scope'];
    function tabsScrollableController ($scope) {
        const vm = this;
        vm.active;
        vm.configScroll;
        vm.viewTab = viewTab;

        $scope.$on('changeTabEvent', changeTab);

        activate();

        ////////////////////////

        function activate () {
            vm.active = 0;
            vm.configScroll = {
                scrollButtons: {
                    scrollAmount: 'auto', // scroll amount when button pressed
                    enable: true // enable scrolling buttons by default
                },
                scrollInertia: 400, // adjust however you want
                axis: 'x',
                theme: 'minimal-dark',
                autoHideScrollbar: true,
                callbacks: { onScrollStart: angular.noop },
                advanced: { autoExpandHorizontalScroll: true }
            };
        }

        /**
         * Change to the selected tab updating the scroll
         * @param {Integer} index the current index tab
         * @param {String} tabId the tab html id to make the scroll
         */
        function viewTab (index, tabId) {
            vm.active = index;
            vm.updateScrollbar('scrollTo', tabId);
        }

        /**
         * Change to the selected tab updating the scroll, received from an angular event
         * @param {Object} event the angular event.
         * @param {Integer} index the current index tab
         * @param {String} tabId the tab html id to make the scroll
         */
        function changeTab (event, index, tabId) {
            viewTab(index, tabId);
        }
    }
})();
