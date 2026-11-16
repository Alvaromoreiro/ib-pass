(function () {
    'use strict';
    angular
        .module('ib-collapse-details-module')
        .directive('ibCollapseDetails', ibCollapseDetails);

    ibCollapseDetails.$inject = ['$document'];

    function ibCollapseDetails($document) {
        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $element, $attrs) {
            if ($scope.$eval($attrs.outSideClick)) {
                $document.bind('click', function (event) {
                    if (angular.element($element).find(event.target).length > 0) return;
                    $scope.collapseCtrl.isCollapsed = false;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        }
    }
})();
