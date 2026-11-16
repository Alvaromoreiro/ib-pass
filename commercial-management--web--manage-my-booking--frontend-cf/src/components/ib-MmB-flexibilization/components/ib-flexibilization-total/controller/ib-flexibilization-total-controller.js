(function () {
    'use strict';

    angular
        .module('ib-flexibilization-total-module')
        .controller('IbFlexibilizationTotalController', IbFlexibilizationTotalController);

    IbFlexibilizationTotalController.$inject = [];
    function IbFlexibilizationTotalController() {
        var vm = this;
        vm.$onInit = activate;

        function activate() {

        }    
    }
})();