(function () {
    'use strict';

    angular
        .module('ib-checkin-main-footer-module')
        .controller('IbCheckinMainFooterController', IbCheckinMainFooterController);

    function IbCheckinMainFooterController() {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.year = new Date().getFullYear();
        }
    }
})();