(function () {
    'use strict';

    angular
        .module('ib-flight-ticket-module')
        .controller('FlightTicketController', FlightTicketController);

    FlightTicketController.$inject = [];
    function FlightTicketController() {
        var vm = this;

        vm.$onInit = activate;

        ////////////////

        function activate() {
        };

    };
})();