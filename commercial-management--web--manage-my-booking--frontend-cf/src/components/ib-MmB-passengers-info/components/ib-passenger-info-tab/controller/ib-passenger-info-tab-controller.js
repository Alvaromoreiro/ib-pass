(function () {
    'use strict';

    angular
        .module('ib-passenger-info-tab-module')
        .controller('PassengerInfoTabController', PassengerInfoTabController);

    PassengerInfoTabController.$inject = ['$scope', '$timeout'];

    function PassengerInfoTabController($scope, $timeout) {
        var vm = this;
        vm.updateIndexTab = updateIndexTab;
        vm.$onInit = activate;

        ////////////////
        function activate() {
            vm.originalData = angular.copy(vm.passengersTabModel);
            $timeout(function () {
                vm.configScroll = {
                    'scrollButtons': {
                        'scrollAmount': 'auto', // scroll amount when button pressed
                        'enable': true // enable scrolling buttons by default
                    },
                    'scrollInertia': 400, // adjust however you want
                    'axis': 'x',
                    'theme': 'minimal-dark',
                    'autoHideScrollbar': true,
                    'callbacks': {
                        'onScrollStart': function () { }
                    },
                    'advanced': {
                        'autoExpandHorizontalScroll': true
                    }
                };
            });

            $timeout(function () {
                vm.updateScrollbar('scrollTo', '#scrollBar-' + vm.indexTab);
            },5);
        }

        /**
         * Emits event for change tab selected
         * @param {Int} indexTab Index of tab selected
         */
        function updateIndexTab(event, indexTab) {
            $scope.$emit('updateIndexTab', { 'index': indexTab });
            vm.updateScrollbar('scrollTo', '#scrollBar-' + indexTab);
            event.preventDefault();
        }
    }

})();