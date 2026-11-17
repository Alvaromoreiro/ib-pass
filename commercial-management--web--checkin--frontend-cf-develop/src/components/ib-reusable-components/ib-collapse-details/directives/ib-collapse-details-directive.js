(function () {
    'use strict';
    angular
        .module('ib-collapse-details-module')
        .directive('ibCollapseDetails', ibCollapseDetails);

    ibCollapseDetails.$inject = ['$document']
    /* istanbul ignore next */
    function ibCollapseDetails($document) {
        return {
            restrict: 'A',
            link: link
        }

        function link($scope, $element, $attrs) {
            var $fc = angular.element($element).find('.fc-collapse__more-details');
            $fc.click(function (e) {
                var $collapse;
                e.preventDefault();
                $collapse = angular.element($element).find('.ibe-collapse__more-details__container');
                $collapse.slideToggle('slow');
            });
            if ($scope.$eval($attrs.outSideClick)) {
                $document.bind('click', function (event) {
                    if (angular.element($element).find(event.target).length > 0) return;
                    $scope.collapseCtrl.isCollapsed = false;
                    $scope.$apply();
                });
            }
        }
    }
})();
