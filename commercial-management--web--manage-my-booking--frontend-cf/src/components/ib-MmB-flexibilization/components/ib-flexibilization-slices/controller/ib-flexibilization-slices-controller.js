(function () {
    'use strict';

    angular
        .module('ib-flexibilization-slices-module')
        .controller('IbFlexSlicesController', IbFlexSlicesController);

    IbFlexSlicesController.$inject = ['$scope', '$rootScope'];
    function IbFlexSlicesController($scope, $rootScope) {
        var vm = this;
        vm.$onInit = activate;
        vm.optionSelected = optionSelected;
        function activate() {
        }
        function optionSelected() {
            $scope.$emit('optionSelected');
        }
    }
})();