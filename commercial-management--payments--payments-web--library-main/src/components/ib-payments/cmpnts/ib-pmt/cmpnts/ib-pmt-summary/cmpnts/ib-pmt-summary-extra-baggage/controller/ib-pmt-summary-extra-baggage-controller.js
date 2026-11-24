(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-extra-baggage-module')
        .controller('PmtSummaryExtraBaggageController', PmtSummaryExtraBaggageController);

    PmtSummaryExtraBaggageController.$inject = ['$scope']
    function PmtSummaryExtraBaggageController($scope) {
        var vm = this;
    };
})();