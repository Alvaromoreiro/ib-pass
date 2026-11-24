(function () {
    'use strict';
    angular
        .module('ib-pmt-summary-cv-ancillaries-module')
        .controller('PmtSummaryCvAncillariesController', PmtSummaryCvAncillariesController);

    PmtSummaryCvAncillariesController.$inject = ['$scope']
    function PmtSummaryCvAncillariesController($scope) {
        var vm = this;

        active();

        function active() {
        };
    };
})();