(function () {
    'use strict';

    angular.module('ib-validators-module')
        .directive('ibLuhnOrMailValidator', ibLuhnOrMailValidator);

    /* istanbul ignore next */
    function ibLuhnOrMailValidator() {
        // Usage: <input ng-model="model" ib-luhn-or-mail-validator></input>
        //
        // Creates: adds a luhn validator if number or email validator if not to the input
        //
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$parsers.push(validateLuhnNumberOrMail);
            $modelCtrl.$formatters.push(validateLuhnNumberOrMail);

            function validateLuhnNumberOrMail(user) {
                if (luhnCheck(user)) {
                    $modelCtrl.$setValidity('userInvalid', true);
                } else if (emailcheck(user)) {
                    $modelCtrl.$setValidity('userInvalid', true);
                } else {
                    $modelCtrl.$setValidity('userInvalid', false);
                }
                return user;
            };
        };

        function luhnCheck(number) {
            var arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
                len = number ? number.length : 0,
                bit = 1,
                sum = 0,
                isNumber = new RegExp(/^\d+$/),
                val, result;
            if (isNumber.test(number)) {
                while (len) {
                    val = parseInt(number.charAt(--len), 10);
                    sum += (bit ^= 1) ? arr[val] : val;
                }
                result = sum && (sum % 10 === 0);
            } else {
                result = false;
            }
            return result;
        };
        function emailcheck(email) {
            var emailValidator, result;
            emailValidator = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
            result = emailValidator.test(email);
            return result;
        }
    }
})();