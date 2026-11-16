(function () {
    'use strict';

    angular
        .module('ib-MmB-bookings-list-module')
        .factory('BookingsListTransformer', BookingsListTransformer);

    BookingsListTransformer.$inject = ['MmBAppConstants', '$filter', '$window'];
    function BookingsListTransformer(MmBAppConstants, $filter, $window) {

        return {
            transformBookingsListInfo: transformBookingsListInfo
        };

        ////////////////
        /**
         * Transform the Rest service object into a well formed model for the view
         * @param {Array<Object>} bookingListInfo the list of available bookings in the current user session
         * @param {Array<Object>} citiesImgs the list of img route depending on city code
         * @returns {Object} a well formed model for the view
         */
        function transformBookingsListInfo(bookingListInfo, citiesImgs) {
            var transformedInfo = {
                'bookingList': [],
                'homeURL': $window.location.origin
            };
        if(bookingListInfo) {
            for (let i = 0; i < bookingListInfo.length; i++) {
                transformedInfo.bookingList.push({
                    'locator': bookingListInfo[i].locator,
                    'surname': bookingListInfo[i].surname,
                    'cityURL': getCityImage(bookingListInfo[i].arrival.city.code, citiesImgs),
                    'departureDate': bookingListInfo[i].departureDate ? new Date(bookingListInfo[i].departureDate.split(' ')[0]) : null,
                    'filterDate': bookingListInfo[i].departureDate ? $filter('DateFormatFilter')(bookingListInfo[i].departureDate) : '',
                    'departure': {
                        'code': bookingListInfo[i].departure.city.code,
                        'description': bookingListInfo[i].departure.city.description
                    },
                    'arrival': {
                        'code': bookingListInfo[i].arrival.city.code,
                        'description': bookingListInfo[i].arrival.city.description
                    }
                });
            }
        }
            return transformedInfo;

            function getCityImage(cityCode, citiesImagesList) {
                var found = false, j = 0, citiImage = MmBAppConstants.citiesBaseRoute + MmBAppConstants.defaultCityImage;
                while (!found && j < citiesImagesList.length) {
                    if (cityCode === citiesImagesList[j].cityCode) {
                        found = true;
                        citiImage = MmBAppConstants.citiesBaseRoute + citiesImagesList[j].url;
                    }
                    j++;
                }
                return citiImage;
            }
        }
    }
})();