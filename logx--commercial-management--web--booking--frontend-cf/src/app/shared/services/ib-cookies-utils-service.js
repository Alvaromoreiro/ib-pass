(function () {


    angular
        .module('ib-booking-services-module')
        .factory('CookiesUtilService', CookiesUtilService);

    CookiesUtilService.$inject = ['$cookies'];
    function CookiesUtilService ($cookies) {
        const service = {
            updateCookie: updateCookie,
            getCookieParams: getCookieParams
        };

        return service;


        /**
         * Update selected cookie with entry params
         */
        function updateCookie (cookie, content, expiryTime, path) {
            const expiration = new Date();
            if (content) {
                expiration.setTime(expiration.getTime() + expiryTime);
                $cookies.put(cookie, content, { expires: expiration, path: path });
            }
        }

        /**
         * Gets entry params from selected cookie
         * @returns {Object.<Promise>} - returns an string with value params.
         */
        function getCookieParams (cookie, params, deleteMode) {
            let valueParams = null, cookieIndex;
            let cookieParams = $cookies.get(cookie);
            cookieParams = angular.isDefined(cookieParams) ? cookieParams.split('|') : null;
            if (cookieParams) {
                for (cookieIndex = 0; cookieIndex < cookieParams.length; cookieIndex++) {
                    valueParams = valueParams || '';
                    if (params.indexOf(cookieIndex) !== -1) {
                        if (deleteMode) {
                            valueParams = valueParams !== '' ? valueParams + '|' + '' : '';
                        } else {
                            valueParams = valueParams !== '' ? valueParams + '|' + cookieParams[cookieIndex] : cookieParams[cookieIndex];
                        }
                    } else if(deleteMode) {
                        valueParams = valueParams !== '' ? valueParams + '|' + cookieParams[cookieIndex] : cookieParams[cookieIndex];
                    }
                }

            }
            valueParams = valueParams ? valueParams + '|' : null;
            return valueParams;
        }


    }
})();