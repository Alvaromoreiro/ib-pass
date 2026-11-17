(function () {
    'use strict';

    angular
        .module('ib-ticket-deinvoicing-module')
        .controller('TicketDeinvoicingController', TicketDeinvoicingController);

    TicketDeinvoicingController.$inject = ['$scope'];
    function TicketDeinvoicingController($scope) {
        var vm = this;

        vm.checkSelectedSegments = checkSelectedSegments;
        vm.$onInit = activate;

        ////////////////

        function activate() {
        };

        function checkSelectedSegments($event, id) {
            $scope.$emit('checkSelectedSegmentsEvent', $event, id);
        }
    };
})();
