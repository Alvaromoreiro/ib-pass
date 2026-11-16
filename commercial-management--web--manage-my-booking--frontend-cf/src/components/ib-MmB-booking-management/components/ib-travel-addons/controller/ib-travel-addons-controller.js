(function () {
    'use strict';

    angular
        .module('ib-travel-addons-module')
        .controller('TravelAddonsController', TravelAddonsController);

    TravelAddonsController.$inject = ['$scope'];
    function TravelAddonsController($scope) {
        var vm = this;
        vm.$onInit = activate;

        ////////////////

        function activate() { }
    }
})();