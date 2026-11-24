(function () {
    'use strict';

    angular.module('ib-reusable-module')
        .directive('ibCityValidator', ibCityValidator);

    /* istanbul ignore next */
    function ibCityValidator() {
        // Usage: <input ng-model="model" ib-city-validator></input>
        //
        // Creates: adds a city validator to the input
        //
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $element.bind('focus', function () {
                $modelCtrl.$parsers.push(validateCityInput);
                $modelCtrl.$formatters.push(validateCityInput);

                function validateCityInput(text) {
                    $modelCtrl.$setValidity('city', cityCheck(text));
                    return text;
                };
            });
        };

        function cityCheck(city) {
            var validCity = true, i, countNumber = 0, numberPattern = /^\d+$/;
            for (i = 0; i < city.length; i++) {
                if (numberPattern.test(city.substr(i, 1))) {
                    countNumber++;
                    if (countNumber > 8) {
                        validCity = false;
                    }
                }
            }
            return validCity;
        };
    }
})();