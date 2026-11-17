(function () {
    'use strict';

    angular
        .module('ib-validation-module')
        .directive('ibDisableRemoveValidation', ibDisableRemoveValidation);

    function ibDisableRemoveValidation() {
        // Usage: <input ib-disable-remove-validation disabled>
        //
        // Creates: remove all validations if the input field is disabled
        //
        return {
            require: 'ngModel',
            restrict: 'A',
            link: link
        };

        function link($scope, $element, $attrs, $modelCtrl) {
            var disabled = false;

            $attrs.$observe('disabled', function (value) {
                disabled = value;
                if (disabled) {
                    makeModelValid($modelCtrl);
                } else {
                    $modelCtrl.$validate();
                }
            });

            $scope.$watch(function () {
                return $modelCtrl.$invalid;
            }, function () {
                if (disabled) {
                    makeModelValid($modelCtrl);
                }
            });

            function makeModelValid(model) {
                angular.forEach(model.$validators, function (validatorValue, validatorKey) {
                    model.$setValidity(validatorKey, true);
                });
            }
        }
    }
})();