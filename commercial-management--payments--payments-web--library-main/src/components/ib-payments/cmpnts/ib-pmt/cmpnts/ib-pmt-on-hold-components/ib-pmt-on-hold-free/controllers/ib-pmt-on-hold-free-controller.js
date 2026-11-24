(function () {
    'use strict';

    angular
        .module('ib-pmt-on-hold-free-module')
        .controller('IbPmtOnHoldFreeController', IbPmtOnHoldFreeController);

    IbPmtOnHoldFreeController.$inject = [];
    function IbPmtOnHoldFreeController() {
        var vm = this;

        vm.$onInit = activate;

        ////////////////

        function activate() {
            
        };

    };
})();