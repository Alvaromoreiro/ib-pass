(function () {
    'use strict';

    angular
        .module('ib-flexibilization-disruption-module')
        .controller('IbFlexibilizationDisruptionController', IbFlexibilizationDisruptionController);

    IbFlexibilizationDisruptionController.$inject = [];
    function IbFlexibilizationDisruptionController() {
        var vm = this;
        vm.$onInit = activate;

        function activate() {

        }    
    }
})();