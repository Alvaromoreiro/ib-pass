(function () {
    'use strict';

    angular
        .module('ib-checkin-ib-plus')
        .factory('UserLoggedBookingTransformer', UserLoggedBookingTransformer);

    UserLoggedBookingTransformer.$inject = ['CheckinAppConstants', '$filter'];
    function UserLoggedBookingTransformer(CheckinAppConstants, $filter) {

        var service = {
            transformUserBookingInfo: transformUserBookingInfo
        };

        return service;

        ////////////////
        function transformUserBookingInfo(serviceUserBookingData, citiesImagesList) {
            var userBookingList = serviceUserBookingData || [];
            var found;
            var i, j, imgCitiesLength;
            for (i = 0; i < userBookingList.length; i++) {
                found = false, j = 0, imgCitiesLength = citiesImagesList ? citiesImagesList.length : 0;
                while (!found && j < imgCitiesLength) {
                    if (userBookingList[i].arrival.city.code === citiesImagesList[j].cityCode) {
                        found = true;
                        userBookingList[i]['cityImageUrl'] = CheckinAppConstants.imgCities + '/' + citiesImagesList[j].url;
                    }
                    j++
                }
                if (!found) {
                    userBookingList[i]['cityImageUrl'] = CheckinAppConstants.imgCities + '/GENERICA_720x384.jpg';
                }
                userBookingList[i].departureDate = $filter('DateFormatFilter')(userBookingList[i].departureDate);
            }
            return userBookingList;
        }
    }
})();