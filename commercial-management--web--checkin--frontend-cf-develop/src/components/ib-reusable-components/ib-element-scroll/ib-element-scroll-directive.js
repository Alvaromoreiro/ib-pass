(function () {
    'use strict';

    angular
        .module('ib-element-scroll-module')
        .directive('ibElementScroll', ibElementScroll);

    function ibElementScroll() {
        return {
            restrict: 'A',
            link: link
        }
        function link($scope, $elem, $attrs) {
            if ($attrs) {
                $elem.bind('click', function () {
                    angular.element('html, body').animate({ scrollTop: angular.element('#' + $attrs.ibElementScroll).offset().top - 5 });
                });
            } else {
                angular.element('html, body').animate({ scrollTop: angular.element($elem).offset().top - 20 });
            }

        }
    }
})();