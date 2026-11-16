(function () {
    'use strict';

    angular
        .module('ib-validators-module')
        .directive('ibValidatorCleaner', ibValidatorCleaner);

    /* istanbul ignore next */
    function ibValidatorCleaner() {
        // Usage: <div data-ib-validator-cleaner='--Regex--'/>
        //
        // Creates: validates input removing the cleaner regex pattern
        //
        var directive = {
            require: 'ngModel',
            link: link
        };

        return directive;

        function link(scope, element, attrs, modelCtrl) {
            var transformedInput;
            modelCtrl.$parsers.push(function (inputValue) {
                if (attrs['ibValidatorCleaner']) {
                    transformedInput = inputValue.replace(new RegExp(attrs['ibValidatorCleaner'], 'gi'), '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                }
                return inputValue;
            });
        }
    }
})();
