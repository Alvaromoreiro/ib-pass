(function () {
    'use strict';
    /**
      * @Controller 
      * @name IbecoseAccordionController
      * @desc Controller for the accordion instantiated in IBCOSE view
      */
    angular
        .module('ib-check-in-search')
        .controller('IbecoseAccordionController', IbcoseAccordionController);

    function IbcoseAccordionController() {
        var vm = this;

        vm.accordionState = 'ACC_EXPAND_ALL';
        vm.toggleAllItems = toggleAllItems;

        /**
          * @function 
          * @name toggleAllItems
          * @desc Changes label of 'view more' or 'view less' in order to open or close both accordion items 
          */
        function toggleAllItems() {
            if (vm.accordionState === 'ACC_EXPAND_ALL') {
                angular.forEach(vm.items, function (value, key) {
                    vm.items[key] = true;
                });
                vm.accordionState = 'ACC_HIDE_ALL';
            }else {
                angular.forEach(vm.items, function (value, key) {
                    vm.items[key] = false;
                });
                vm.accordionState = 'ACC_EXPAND_ALL';
            }
        }
    }
})();