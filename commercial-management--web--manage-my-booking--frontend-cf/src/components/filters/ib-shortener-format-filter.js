(function () {
    'use strict';

    angular
        .module('ib-MmB-filters-module')
        .filter('ShortenerFormatFilter', ShortenerFormatFilter);

    function ShortenerFormatFilter() {

        return shortenerString;

        ////////////////

        function shortenerString(stringInput, maxlength, capitalized, toLowerCase) {
            var stringFormatted = capitalized ? capitalizeString(stringInput || '') : toLowerCase ? toLowerCaseString(stringInput || '') : (stringInput || '');
            var stringLength = maxlength || 3;
            return stringFormatted.length > stringLength ? stringFormatted.substring(0, stringLength) : stringFormatted;
        }


        function capitalizeString(inputString) {
            return inputString && inputString.length > 1
                ? inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase() : '';
        }

        function toLowerCaseString(inputString) {
            return inputString && inputString.length > 1
                ? inputString.toLowerCase() : '';
        }

    }
})();