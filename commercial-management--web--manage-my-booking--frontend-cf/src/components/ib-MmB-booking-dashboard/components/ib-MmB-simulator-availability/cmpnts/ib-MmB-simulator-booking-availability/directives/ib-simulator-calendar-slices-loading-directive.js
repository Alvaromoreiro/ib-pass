(function () {
    'use strict';

    angular
        .module('ib-MmB-simulator-booking-availability-module')
        .directive('ibSimulatorCalendarSlidesLoading', ibSimulatorCalendarSlidesLoading);

        ibSimulatorCalendarSlidesLoading.$inject = ['$timeout', '$window', 'ComponentsUtils'];
    function ibSimulatorCalendarSlidesLoading($timeout, $window, ComponentsUtils) {
        // Usage: <div ib-calendar-slides-loading></div>
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link($scope, $element, $attrs) {
            var anguElement = angular.element($element);
            var cabins = ComponentsUtils.get_parents(anguElement, function (el) {
                return angular.element(el).hasClass('ib-fc-calendar-slides-loading');
            });
            var filtersCabins = angular.element(cabins).find('.ib-table-flight-filters--cabins');

            if (filtersCabins.length === 0){
                filtersCabins = angular.element(cabins).find('.u-position-relative');
            }

            $timeout(applyDimensions);
            angular.element($window).on('resize', applyDimensions);

            $scope.$on('$destroy', function () {
                angular.element($window).off('resize', applyDimensions);
            });

            function applyDimensions() {
                var top = filtersCabins[0].offsetTop;
                anguElement.css({ 'top': top + 'px', 'height': 'calc(100% - ' + top + 'px)' });
            };
        }
    }

})();
