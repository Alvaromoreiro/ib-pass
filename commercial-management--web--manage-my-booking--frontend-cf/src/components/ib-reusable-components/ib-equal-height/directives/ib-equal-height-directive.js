(function () {
    'use strict';

    angular
        .module('ib-equal-height-module')
        .directive('equalHeight', equalHeight);

    equalHeight.$inject = ['$window', 'ComponentsUtils'];
    /* istanbul ignore next */
    function equalHeight($window, ComponentsUtils) {
        return {
            restrict: 'AE',
            link: link
        };
        function link($scope, $elem) {
            ComponentsUtils.equalHeight(angular.element($elem));
            // Event Resize
            angular.element($window).bind('resize', function () {
                ComponentsUtils.equalHeight(angular.element($elem));
            });

        }

    }
})();