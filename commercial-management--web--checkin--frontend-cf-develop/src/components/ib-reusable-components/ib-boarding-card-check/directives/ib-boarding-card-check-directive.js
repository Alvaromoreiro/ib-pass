(function () {
    'use strict';

    angular
        .module('ib-boarding-card-check-module')
        .directive('ibBoardingCardCheck', ibBoardingCardCheck);

    ibBoardingCardCheck.$inject = ['ComponentUtils', '$timeout', '$window'];
    function ibBoardingCardCheck(ComponentUtils, $timeout, $window) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'A',
            link: link

        };
        return directive;

        function link($scope, $elem, $attrs) {
            $timeout(calculateDuplicatedHeight);
            angular.element($window).on('resize', calculateDuplicatedHeight);

            $scope.$on('$destroy', function () {
                angular.element($window).off('resize', calculateDuplicatedHeight);
            });

            function calculateDuplicatedHeight() {
                ComponentUtils.resizeHeightListElements('.ibe-boarding-card__custom-check');
                $timeout(function(){
                    ComponentUtils.resizeHeightListElements('.paragraph__regular');
                });
            }
        }
    }
})();