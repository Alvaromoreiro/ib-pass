(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-upgrading-bids-module')
        .controller('PmtSummaryUpgradingBidsController', PmtSummaryUpgradingBidsController);

    PmtSummaryUpgradingBidsController.$inject = ['$scope', 'localStorageService'];
    function PmtSummaryUpgradingBidsController($scope, localStorageService) {
        var vm = this;

        activate();
        
        function activate(){
            vm.flowApp = localStorageService.get('flowApp');
            vm.isShuttleFlow = localStorageService.get('isShuttleFlow');
            vm.numberFreeUpgrade = localStorageService.get('numberFreeUpgrade');
        }
        
    };
})();