(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .factory('CheckBookingStatusService', CheckBookingStatusService);

    CheckBookingStatusService.$inject = ['CheckinAppConstants'];
    function CheckBookingStatusService(CheckinAppConstants) {
        var service = {
            checkBookingStatus: checkBookingStatus
        };

        return service;

        ////////////////
        /**
         * Check if there is a passenger allowed for check-in in the booking or there is an air shuttle segment
         * @param {Object} bookingInfo the booking information retrieved by the service
         * @returns {Boolean} true if there is a passenger allowed for check-in or there is an air shuttle segment in the booking
         */
        function checkBookingStatus(bookingInfo) {
            var i = 0, allowedPassengerFound = false;
            bookingInfo.passengers = bookingInfo.passengers || [];
            while (!allowedPassengerFound && i < bookingInfo.passengers.length) {
                allowedPassengerFound = bookingInfo.passengers[i].status.code === CheckinAppConstants.GENERAL_PASSENGERS_STATUS.ALLOWED;
                i++;
            }
            return allowedPassengerFound || (bookingInfo.airShuttleSegments || []).length > 0;
        }
    }
})();