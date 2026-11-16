(function () {
    'use strict';

    angular
        .module('ib-flexibilization-code-confirmation-module')
        .controller('IbFlexibilizationCodeConfirmationController', IbFlexibilizationCodeConfirmationController);

    IbFlexibilizationCodeConfirmationController.$inject = ['$scope', '$rootScope', 'localStorageService'];
    function IbFlexibilizationCodeConfirmationController($scope, $rootScope, localStorageService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {

        }    
    }
})();