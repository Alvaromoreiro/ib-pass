(function () {
    'use strict';

    angular
        .module('ib-tabs')
        .directive('tabResize', tabResize);

    tabResize.$inject = ['$timeout', '$window'];

    function tabResize($timeout, $window) {
        return {
            restrict: 'AE',
            link: link,
            controller: 'tabResponsiveController'
        };

        function link(scope, elem) {
            angular.element(elem).change(function () {
                angular.element($window).triggerHandler('resize');
            });
        }
    }
})();