(function () {
    'use strict';

    angular
        .module('ib-validation-module')
        .directive('uiSelectRequired', uiSelectRequired);
    
    uiSelectRequired.$inject = ['$parse']
    /* istanbul ignore next */
    function uiSelectRequired($parse) {
        // Usage: <div data-ui-select-required/>
        //
        // Creates: made ui-select required if you wants
        //
        var directive = {
            require: 'ngModel',
            link: link
        };

        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$validators.uiSelectRequired = function (modelValue, viewValue) {
                return !$parse($attrs.uiSelectRequired || '')($scope);
            };
        }
    }
})();