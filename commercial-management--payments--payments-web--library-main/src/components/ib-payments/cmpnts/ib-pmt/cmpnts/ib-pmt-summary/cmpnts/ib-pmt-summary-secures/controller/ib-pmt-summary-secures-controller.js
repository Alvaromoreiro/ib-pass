(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-secures-module')
        .controller('PmtSummarySecuresController', PmtSummarySecuresController);

    PmtSummarySecuresController.$inject = ['$scope']
    function PmtSummarySecuresController($scope) {
        var vm = this;
    };
})();