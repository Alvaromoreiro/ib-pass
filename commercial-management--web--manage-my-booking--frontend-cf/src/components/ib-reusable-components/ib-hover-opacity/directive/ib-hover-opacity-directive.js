(function () {
    'use strict';

    angular
        .module('ib-hover-opacity-module')
        .directive('ibHoverOpacity', ibHoverOpacity);

    ibHoverOpacity.$inject = ['$timeout'];
    /* istanbul ignore next */
    function ibHoverOpacity($timeout) {
        return {
            restrict: 'A',
            link: link
        };
        function link($scope, $element) {
            var node = angular.element($element);
            node.bind('mouseover', function () {
                node.siblings().css({ 'opacity': 0.4, 'transition': 'opacity .5s' });
                node.css('opacity', 1);
            });
            node.bind('mouseleave', function () {
                node.siblings().css({ 'opacity': 1 });
                node.css('opacity', 1);
            });
        }
    }
})();
