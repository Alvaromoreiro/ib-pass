(function () {
    'use strict';

    angular
        .module('ib-checkin-ib-plus')
        .factory('GetCitiesImagesService', GetCitiesImagesService);

    GetCitiesImagesService.$inject = ['GetCitiesImagesProxy', 'CheckinAppConstants', '$q', 'localStorageService'];
    function GetCitiesImagesService(GetCitiesImagesProxy, CheckinAppConstants, $q, localStorageService) {

        return {
            getCitiesImages: getCitiesImages
        };

        ////////////////

        //Singleton cities images data, if it is in localstorage return it, else call rest service and storage locally
        function getCitiesImages() {
            var deferred = $q.defer();
            var cities = localStorageService.get('citiesImagesList');

            if (cities === null) {
                GetCitiesImagesProxy.getCitiesimages(CheckinAppConstants.imgCitiesJsonRoute)
                    .then(getCitiesImagesSuccess, getCitiesImagesError)['catch'](getCitiesImagesError);
            } else {
                deferred.resolve(cities);
            }

            return deferred.promise;

            function getCitiesImagesSuccess(data) {
                localStorageService.set('citiesImagesList', data);
                deferred.resolve(data);
            }

            function getCitiesImagesError(error) {
                deferred.resolve([]);
            }
        }
    }
})();