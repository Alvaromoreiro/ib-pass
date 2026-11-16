(function () {
    'use strict';

    angular
        .module('ib-slide-toggle-module')
        .directive('ibSlideToggle', ibSlideToggle);
    /* istanbul ignore next */
    function ibSlideToggle() {
        return {
            restrict: 'A',
            link: link
        };
        function link($scope, $element, $attr) {
            $element.bind('click', function () {
                angular.element($attr.slideToggle).stop().slideToggle(parseInt($attr.slideToggleDuration, 10) || 200);
            });
        }
    }
})();