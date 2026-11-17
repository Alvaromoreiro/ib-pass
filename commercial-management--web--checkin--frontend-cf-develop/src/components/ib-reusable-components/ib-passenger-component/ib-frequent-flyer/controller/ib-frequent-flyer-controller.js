(function () {
    'use strict';

    angular
        .module('ib-frequent-flyer-module')
        .controller('FrequentFlyerController', FrequentFlyerController);

    function FrequentFlyerController() {
        var vm = this;
        var previousCompanySelection = null;

        vm.clearCodeNumber = clearCodeNumber;
        vm.$onInit = activate;

        ////////////////

        function activate() { }

        /**
          * @function
          * @name clearCodeNumber
          * @desc Clean the previous company code number if a company is selected
        */
        function clearCodeNumber() {
            vm.frequentFlyerModel.info.number = (previousCompanySelection && previousCompanySelection !== 'IB' && vm.frequentFlyerModel.info.iataCompanyCode === 'IB')
                || (!previousCompanySelection && vm.frequentFlyerModel.info.iataCompanyCode === 'IB') ? '' : vm.frequentFlyerModel.info.number;

            previousCompanySelection = vm.frequentFlyerModel.info.iataCompanyCode;
        }
    }
})();