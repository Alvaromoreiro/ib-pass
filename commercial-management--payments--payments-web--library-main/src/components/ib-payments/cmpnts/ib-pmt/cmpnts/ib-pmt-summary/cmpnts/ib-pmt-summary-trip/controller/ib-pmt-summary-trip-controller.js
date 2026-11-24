(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-trip-module')
        .controller('PmtSummaryTripController', PmtSummaryTripController);

    PmtSummaryTripController.$inject = ['$scope', 'localStorageService'];
    function PmtSummaryTripController($scope, localStorageService) {
        var vm = this;
        vm.flowApp = localStorageService.get('flowApp');
        vm.isShuttleFlow = localStorageService.get('isShuttleFlow');
    };
})();