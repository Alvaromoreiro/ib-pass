(function () {
    'use strict';

    angular.module('ib-validators-module')
        .directive('ibMmbDniValidator', ibMmbDniValidator);

    /* istanbul ignore next */
    function ibMmbDniValidator() {
        // Usage: <input ng-model="model" ib-mmb-dni-validator></input>
        //
        // Creates: adds an spanish dni validator to the input
        //
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$parsers.push(validateDniNumber);
            $modelCtrl.$formatters.push(validateDniNumber);

            function validateDniNumber(number) {
                $modelCtrl.$setValidity('dni', dniCheck(number));
                return number;
            };
        };

        function dniCheck(dni) {
            var number, letter, isValid = false;
            var letters = 'TRWAGMYFPDXBNJZSQVHLCKET';
            var dniRegularExp = /^\d{8}[a-zA-Z]$/;
            if (dni && dniRegularExp.test(dni)) {
                number = dni.substr(0, dni.length - 1) % 23;
                letter = dni.substr(dni.length - 1, 1);
                isValid = letter.toUpperCase() === letters.substring(number, number + 1);
            }
            return isValid;
        };
    }
})();
