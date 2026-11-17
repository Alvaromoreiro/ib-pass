(function () {
    'use strict';

    angular
        .module('currencyFilter')
        .filter('currency', currency);

    currency.$inject = ['$filter', '$locale'];
    function currency($filter, $locale) {

        return formatCurrency;

        ////////////////

        function formatCurrency(amount, currencySymbol, fractionSize, suffixSymbol, customFormat) {
            var numberFilter = $filter('number');
            var formats = $locale.NUMBER_FORMATS;
            var pattern = formats.PATTERNS[1];
            var returnedCurrency;
            formats.DEFAULT_PRECISION = angular.isUndefined(formats.DEFAULT_PRECISION) ? 2 : formats.DEFAULT_PRECISION;
            returnedCurrency = getNewCurrency(amount, currencySymbol, fractionSize, suffixSymbol, customFormat);

            return returnedCurrency;


            function getNewCurrency(amount, currencySymbol, fractionSize, suffixSymbol, customFormat) {
                var isNegative, parts, groupSep, decimalSep, number, formattedNumber, i;
                if (!angular.isNumber(amount)) {
                    amount = 0;
                }
                if (angular.isObject(currencySymbol)) {
                    customFormat = currencySymbol;
                }
                if (angular.isUndefined(currencySymbol) || angular.isObject(currencySymbol)) {
                    currencySymbol = formats.CURRENCY_SYM;
                }
                isNegative = amount < 0;
                parts = [];

                if (isBoolean(fractionSize) || angular.isString(fractionSize)) {
                    suffixSymbol = fractionSize;
                    fractionSize = formats.DEFAULT_PRECISION;
                }

                fractionSize = angular.isUndefined(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;

                amount = Math.abs(amount);

                groupSep = customFormat && angular.isString(customFormat.GROUP_SEP) ? customFormat.GROUP_SEP : formats.GROUP_SEP;
                decimalSep = customFormat && angular.isString(customFormat.DECIMAL_SEP) ? customFormat.DECIMAL_SEP : formats.DECIMAL_SEP;
                number = numberFilter(amount, fractionSize);

                formattedNumber = [];
                for (i = 0; i < number.length; i++) {
                    if (number[i] === formats.GROUP_SEP)
                        formattedNumber.push(groupSep);
                    else if (number[i] === formats.DECIMAL_SEP)
                        formattedNumber.push(decimalSep);
                    else
                        formattedNumber.push(number[i]);
                }
                formattedNumber = formattedNumber.join('');

                parts.push(isNegative ? pattern.negPre : pattern.posPre);

                if (angular.isString(suffixSymbol)) {
                    parts.push(currencySymbol);
                    parts.push(formattedNumber);
                    parts.push(suffixSymbol);
                } else {
                    parts.push(!suffixSymbol ? currencySymbol : formattedNumber);
                    parts.push(suffixSymbol ? currencySymbol : formattedNumber);
                }

                parts.push(isNegative ? pattern.negSuf : pattern.posSuf);

                return parts.join('').replace(/\u00A4/g, '');
            };;


            function isBoolean(obj) {
                return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
            };
        }

    }
})();