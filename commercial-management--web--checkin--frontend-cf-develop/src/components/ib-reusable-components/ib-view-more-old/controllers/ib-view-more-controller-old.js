(function () {
    'use strict';
    angular
        .module('ib-view-more-old-module')
        .controller('ViewMoreOldController', ViewMoreOldController);

    function ViewMoreOldController() {
        var vm = this;
        vm.text = 'IBCOSE_LEER_MAS';
        vm.a = false;
        vm.changeText = function (val) {
            if (val) {
                vm.text = 'IBCOSE_LEER_MAS';
                vm.a = !val;
            } else {
                vm.text = 'IBCOSE_LEER_MENOS';
                vm.a = !val;
            }
        }
    }
})();