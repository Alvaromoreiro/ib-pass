(function () {
    'use strict';

    angular
        .module('ib-order-summary-ancillaries-module')
        .controller('OrderSummaryAncillariesController', OrderSummaryAncillariesController);

    OrderSummaryAncillariesController.$inject = [];
    function OrderSummaryAncillariesController() {
        var vm = this;
        vm.$onInit = activate;



        ////////////////

        function activate() { }
    }
})();