(function () {
    'use strict';

    angular
        .module('ib-validators-module')
        .directive('ibModelUndefined', ibModelUndefined);

    ibModelUndefined.$inject = ['$timeout'];
    /* istanbul ignore next */
    function ibModelUndefined($timeout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'ngModel',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$parsers.push(checkUndefined);
            $modelCtrl.$formatters.push(checkUndefined);

            function checkUndefined(inputValue) {
                if (inputValue === '') {
                    $modelCtrl.$setViewValue(undefined);
                    $modelCtrl.$render();
                }
                $timeout(function () {
                    $modelCtrl.$setValidity('parse', true);
                });
                return inputValue === '' ? undefined : inputValue;
            }
        }
    }

})();