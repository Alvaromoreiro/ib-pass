(function () {
    'use strict';

    angular
        .module('ib-newMain-header-module')
        .directive('stepsScroll', stepsScroll);

    stepsScroll.$inject = ['$timeout', '$window'];
    function stepsScroll ($timeout, $window) {
        // Usage:
        //
        // Creates:
        //
        const directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link (scope, element, attrs) {
            const centerScroll = function (newVal, oldVal) {
                let position, activeWidth, listWidth, newPosition;
                if((angular.element('.ib-main-steps__txt--active').length > 0) && (newVal !== oldVal)) {
                    $timeout(() => {
                        listWidth = angular.element(element).width();
                        position = angular.element('.ib-main-steps__txt--active').parent()[0].offsetLeft;
                        activeWidth = angular.element('.ib-main-steps__txt--active').parent().width();
                        newPosition =  (position - (listWidth / 2) + (activeWidth / 2));
                        angular.element(element).scrollLeft(newPosition);
                    });
                }
            };

            scope.$watch(attrs.stepsScroll, centerScroll);
            angular.element($window).on('resize', centerScroll);
        }
    }
})();