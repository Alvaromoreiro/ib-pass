(function () {

    angular
        .module('ib-booking-collapse-module')
        .directive('ibCollapseDetails', ibCollapseDetails);

    ibCollapseDetails.$inject = ['$document'];
    /* istanbul ignore next */
    function ibCollapseDetails ($document) {
        return {
            restrict: 'A',
            link: link
        };

        function link ($scope, $element, $attrs) {
            if ($scope.$eval($attrs.outSideClick)) {
                $document.bind('click', (event) => {
                    if (angular.element($element).find(event.target).length > 0) return;
                    $scope.collapseCtrl.isCollapsed = false;
                    $scope.$apply();
                });
            }
        }
    }
})();
