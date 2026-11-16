(function () {
    'use strict';

    angular
        .module('ib-passenger-management-module')
        .controller('PassengerManagementController', PassengerManagementController);

    PassengerManagementController.$inject = ['$scope', 'localStorageService', '$timeout'];
    function PassengerManagementController($scope, localStorageService, $timeout) {
        var vm = this;
        vm.dataContact = null;
        vm.savedSuccess = null;
        vm.$onInit = activate;
        vm.modifyPassengerInfo = modifyPassengerInfo;

        ///////
        function activate() {
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
                        'onScrollStart': angular.noop
                    },
                    'advanced': {
                        'autoExpandHorizontalScroll': true
                    }
                };
            });

            vm.savedSuccess = localStorageService.get('savedPasSuccess');
            localStorageService.remove('savedPasSuccess');
            vm.dataContact = {
                'passengerId': 'CONTACT',
                'status': localStorageService.get('savedDataContactSuccess')
            };
        }

        /**
         * Emits an 'modifyPassenger' event to go to passenger modification page
         * @param {Object} passenger Passenger object selected
         * @param{Object} index The index of passenger selected
         */
        function modifyPassengerInfo(passenger, index) {
            $scope.$emit('modifyPassenger', passenger, index);
        }
    }
})();
