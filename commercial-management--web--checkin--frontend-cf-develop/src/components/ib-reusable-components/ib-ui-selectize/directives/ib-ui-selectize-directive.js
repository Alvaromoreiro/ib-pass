(function () {
    'use strict';

    angular
        .module('ib-ui-selectize-module')
        .directive('ibUiSelectize', ibUiSelectize);

    ibUiSelectize.$inject = ['ComponentUtils'];
    function ibUiSelectize(ComponentUtils) {
        return {
            restrict: 'A',
            link: link
        }
        function link(scope, element) {
            var $element = angular.element(element);
            var $ui_select_search = element.querySelectorAll('.ui-select-search');

            $ui_select_search.on('focus focusout', function (e) {
                var $parent = ComponentUtils.get_parents($element, function (el) {
                    return angular.element(el).hasClass('ibe-form__date');
                });
                if (e.type === 'focus') {
                    angular.element($parent).addClass('ibe-form__date--focus');
                } else {
                    angular.element($parent).removeClass('ibe-form__date--focus');
                }
            });
        }
    }
})();