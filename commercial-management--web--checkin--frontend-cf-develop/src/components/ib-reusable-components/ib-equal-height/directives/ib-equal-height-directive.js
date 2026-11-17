(function () {
    'use strict';

    angular
        .module('ib-equal-height-module')
        .directive('equalHeight', equalHeight);

    equalHeight.$inject = ['$timeout','$window', 'ComponentUtils'];
    function equalHeight($timeout, $window, ComponentUtils) {
        return {
            restrict: 'AE',
            link: link
        }
        function link(scope, elem, attrs) {
            var eWindow = angular.element($window);
            var element = elem[0];
            if (attrs.equalHeightReload) {
                $timeout(function () {
                    ComponentUtils.equalHeight(element, true);
                });
            } else {
                $timeout(function () {
                    ComponentUtils.equalHeight(element);
                });
            }

            eWindow.bind('resize', function () {
                if (attrs.equalHeightReload) {
                    ComponentUtils.equalHeight(element, true);
                } else {
                    ComponentUtils.equalHeight(element);
                }
            });
        }

    }
})();