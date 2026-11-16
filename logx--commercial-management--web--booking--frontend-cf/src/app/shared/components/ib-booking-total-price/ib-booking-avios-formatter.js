(function () {
    'use strict';

    angular
        .module('ib-booking-app')
        .filter('aviosFormatter', AviosFormatter);

    AviosFormatter.$inject = ['$filter', 'localStorageService'];
    function AviosFormatter ($filter, localStorageService) {
        return getAviosFormatted;

        ////////////////
        /**
         * Added format to avios values
         * @param {*} id
         * @returns
         */
        function getAviosFormatted (aviosAmount) {
            const commercialInfo = localStorageService.get('commercialData') || {};
            aviosAmount = parseInt(aviosAmount) || 0;
            return $filter('currency')(aviosAmount, '', 0, '', { GROUP_SEP: commercialInfo.currency && commercialInfo.currency.groupingSeparator ? commercialInfo.currency.groupingSeparator : '.' });
        }
    }
})();
