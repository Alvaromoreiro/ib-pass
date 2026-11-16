(function () {
    'use strict';

    angular
        .module('ib-banner-module')
        .controller('IbBookingBannerController', IbBookingBannerController);

    IbBookingBannerController.$inject = ['$scope','$rootScope', '$window', 'ComponentsUtils', 'localStorageService'];
    function IbBookingBannerController($scope, $rootScope, $window, ComponentsUtils, localStorageService) {
        var vm = this;
        var calculateAddOnTypeEvent;
        vm.initAddOn = initAddOn;
        vm.calculateAddOnType = calculateAddOnType;
        calculateAddOnTypeEvent = $rootScope.$on('calculateAddOnTypeEvent', calculateAddOnType);

        vm.$onInit = activate;
        $scope.$on('$destroy', calculateAddOnTypeEvent);
        ////////////////

        function activate() {
            calculateAddOnType();
        }

        /**
     * @function 
     * @name initAddOn
     * @desc init Add Ons 
     */
        function initAddOn() {
            ComponentsUtils.initAddOn();
        };

        function calculateAddOnType() {
            var width = $window.innerWidth;
            if (width >= 768 && width < 1024) {
                vm.addOnType = 0;
            } else if (width < 768) {
                vm.addOnType = 1;
            } else if (width >= 1024 && width < 1280) {
                vm.addOnType = 3;
            } else if (width >= 1280) {
                vm.addOnType = 2;
            }
            localStorageService.set('addOnType', vm.addOnType);
        }

    }
})();