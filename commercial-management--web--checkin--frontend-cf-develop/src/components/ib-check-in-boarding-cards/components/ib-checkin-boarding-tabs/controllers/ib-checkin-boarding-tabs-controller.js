(function () {
    'use strict';

    angular
        .module('ib-checkin-boarding-tabs-module')
        .controller('IbCheckInBoardingTabsController', IbCheckInBoardingTabsController);

    IbCheckInBoardingTabsController.$inject = ['ModalService'];
    function IbCheckInBoardingTabsController(ModalService) {
        var vm = this;

        vm.$onInit = activate;

        ////////////////

        function activate() {
        };

    };
})();