(function () {
    'use strict';

    angular.module('ib-validators-module')
        .directive('ibLuhnValidator', ibLuhnValidator);
    
    /* istanbul ignore next */
    function ibLuhnValidator() {
        // Usage: <input ng-model="model" ib-luhn-validator></input>
        //
        // Creates: adds a luhn validator to the input
        //
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$parsers.push(validateLuhnNumber);
            $modelCtrl.$formatters.push(validateLuhnNumber);

            function validateLuhnNumber(number) {
                $modelCtrl.$setValidity('luhn', luhnCheck(number));
                return number;
            };
        };

        function luhnCheck(number) {
            var arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
                len = number ? number.length : 0,
                bit = 1,
                sum = 0,
                val;
            while (len) {
                val = parseInt(number.charAt(--len), 10);
                sum += (bit ^= 1) ? arr[val] : val;
            }
            return sum && (sum % 10 === 0);
        };
    }
})();