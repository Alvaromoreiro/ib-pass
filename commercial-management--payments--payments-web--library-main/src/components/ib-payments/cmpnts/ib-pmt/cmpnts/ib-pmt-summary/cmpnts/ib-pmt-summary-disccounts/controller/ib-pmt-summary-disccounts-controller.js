(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-disccounts-module')
        .controller('PmtSummaryDisccountsController', PmtSummaryDisccountsController);

    PmtSummaryDisccountsController.$inject = ['$scope','localStorageService','CurrencyService', 'PmtUtilsService'];
    function PmtSummaryDisccountsController($scope, localStorageService, CurrencyService, PmtUtilsService) {
        var vm = this;
        vm.numeroAvios = localStorageService.get('numeroAvios');
        

    }
})();