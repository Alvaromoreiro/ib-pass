(function () {


    angular
        .module('ib-accordion')
        .controller('IbAccordionController', IbAccordionController);

    IbAccordionController.$inject = [];
    function IbAccordionController () {
        let i, vm = this;

        vm.open = [];
        vm.stateAll = false;
        vm.openCloseAll = openCloseAll;

        function openCloseAll (e) {
            let i;
            vm.stateAll = !vm.stateAll;
            for (i = 0; i < vm.open.length; i++) {
                vm.open[i] = vm.stateAll;
            }
            e.preventDefault();
        }
    }
})();
