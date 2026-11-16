(function () {
    'use strict';

    angular
        .module('ib-steps-module')
        .controller('StepsController', StepsController);

    StepsController.$inject = [ '$rootScope'];
    function StepsController($rootScope) {
        var vm = this;

        vm.$onInit = activate;
        vm.updateSteps = updateSteps;
        

        function activate() {
        }

        function updateSteps(position) {
            vm.model.position = position;
        }

    }
})();