(function () {
    'use strict';

    // Usage: <ib-flight-ticket ></ib-flight-ticket>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-flight-ticket-module')
        .component('ibFlightTicket', {
            controller: 'FlightTicketController',
            controllerAs: 'ticketCtrl',
            bindings: {
                'segmentInfo': '<',
                'index': '<',
                'selectedShuttle': '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants ) {
                return CheckinRouterConstants.templatesRoute + 'ib-flight-ticket-view.html';
            }]
        });

})();