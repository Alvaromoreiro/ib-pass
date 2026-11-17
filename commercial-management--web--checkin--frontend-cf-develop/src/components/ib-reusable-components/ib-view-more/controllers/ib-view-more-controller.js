(function () {
    'use strict';
    angular
        .module('ib-view-more-module')
        .controller('ViewMoreController', ViewMoreController);

    function ViewMoreController() {
        var vm = this;
        vm.text = 'IBCOSE_LEER_MAS';
        vm.active = false;
        vm.changeText = changeText;

        function changeText(currentState) {
            vm.active = !currentState;
            vm.text = currentState && 'IBCOSE_LEER_MAS' || 'IBCOSE_LEER_MENOS';
        }
    }
})();