(function () {
    'use strict';

    angular
        .module('ib-MmB-bookings-list-module')
        .factory('BookingsListProxy', BookingsListProxy);

    BookingsListProxy.$inject = ['$q', '$http'];
    function BookingsListProxy($q, $http) {

        return {
            getBookingsList: getBookingsList
        };

        ////////////////
        /**
         * Calls the http GET method for logged bookings list rest service.
         * @param {string} url - the http url of logged bookings list rest service
         * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getBookingsList(url) {
            return $http.get(url).then(getBookingsListComplete)['catch'](getBookingsListFailed);

            function getBookingsListComplete(response) {
                return response.data;
            }

            function getBookingsListFailed(response) {
                return $q.reject({ data: response.data, errorCode: response.status });
            }
        }
    }
})();