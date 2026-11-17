(function () {
    'use strict';

    angular
        .module('ib-checkin-ib-plus')
        .factory('GetCitiesImagesProxy', GetCitiesImagesProxy);

    GetCitiesImagesProxy.$inject = ['$http','$q'];
    function GetCitiesImagesProxy($http,$q) {
        var service = {
            getCitiesimages: getCitiesimages
        };

        return service;

        ////////////////
        function getCitiesimages(url) {
            return $http.get(url)
                .then(getCitiesimagesComplete)
                ['catch'](getCitiesimagesFailed);

            function getCitiesimagesComplete(response) {
                return response.data;
            }

            function getCitiesimagesFailed(response) {
                return $q.reject({ data: response.data, errorCode: response.status });
            }
        }
    }
})();