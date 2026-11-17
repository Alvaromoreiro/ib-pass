(function () {
    'use strict';

    angular
        .module('ib-banner-module')
        .controller('IbBookingBannerController', IbBookingBannerController);

    IbBookingBannerController.$inject = ['$rootScope', '$window', 'ComponentUtils', 'localStorageService'];
    function IbBookingBannerController($rootScope, $window, ComponentUtils, localStorageService) {
        var vm = this;
        var calculateAddOnTypeEvent;
        vm.initAddOn = initAddOn;
        vm.calculateAddOnType = calculateAddOnType;
        calculateAddOnTypeEvent = $rootScope.$on('calculateAddOnTypeEvent', calculateAddOnType);

        vm.$onInit = activate;
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
            ComponentUtils.initAddOn();
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