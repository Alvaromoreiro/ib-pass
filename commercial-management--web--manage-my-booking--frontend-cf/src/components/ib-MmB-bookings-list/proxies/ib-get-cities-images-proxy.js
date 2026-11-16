(function () {
    'use strict';

    angular
        .module('ib-MmB-bookings-list-module')
        .factory('GetCitiesImagesProxy', GetCitiesImagesProxy);

    GetCitiesImagesProxy.$inject = ['$http', '$q'];
    function GetCitiesImagesProxy($http, $q) {
        var service = {
            getCitiesimages: getCitiesimages
        };

        return service;

        ////////////////
        /**
         * Get the json file with the cities images information.
         * @param {string} url - the http url cities json
         * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getCitiesimages(url) {
            return $http.get(url).then(getCitiesimagesComplete)['catch'](getCitiesimagesFailed);

            function getCitiesimagesComplete(response) {
                return response.data;
            }

            function getCitiesimagesFailed(response) {
                return $q.reject({ data: response.data, errorCode: response.status });
            }
        }
    }
})();