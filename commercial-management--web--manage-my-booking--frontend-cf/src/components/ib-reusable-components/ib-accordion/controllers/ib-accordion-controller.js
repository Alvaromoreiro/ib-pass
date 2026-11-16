(function () {
    'use strict';

    angular
        .module('ib-accordion')
        .controller('ibAccordionController', ibAccordionController);

    ibAccordionController.$inject = [];
    function ibAccordionController() {
        var vm = this;

        vm.open = [false, false, false, false];
        vm.stateAll = false;

        vm.openCloseAll = function (e){
            var i;
            vm.stateAll = !vm.stateAll;

            for (i = 0; i < vm.open.length; i++) {
                vm.open[i] = vm.stateAll;
            };

            e.preventDefault();
        };
    }
})();