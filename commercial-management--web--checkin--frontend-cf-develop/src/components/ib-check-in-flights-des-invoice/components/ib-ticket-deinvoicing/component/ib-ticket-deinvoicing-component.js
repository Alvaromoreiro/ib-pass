(function () {
    'use strict';

    // Usage: <ib-ticket-deinvoicing></ib-ticket-deinvoicing-fn>
    // 
    // Creates:
    // 

    angular
        .module('ib-ticket-deinvoicing-module')
        .component('ibTicketDeinvoicing', {
            controller: 'TicketDeinvoicingController',
            controllerAs: 'TicketDeinvoicingCtrl',
            bindings: {
                'segmentInfo': '<',
                'index': '<',
                'checkboxDisabled': '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-ticket-deinvoicing.html';
            }]
        });
})();