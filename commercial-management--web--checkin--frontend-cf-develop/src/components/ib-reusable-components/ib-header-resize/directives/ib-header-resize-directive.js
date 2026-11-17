(function () {
    'use strict';

    angular
        .module('ib-equal-height-module')
        .directive('headerResize', headerResize);

    headerResize.$inject = ['$window'];
    function headerResize($window) {
        return {
            restrict: 'A',
            link: link
        }
        function link(scope, elem, attrs) {
            var eWindow = angular.element($window);
            eWindow.bind('resize', function () {
                scope.$emit('headerResize', eWindow);
            });
        }
    }
})();