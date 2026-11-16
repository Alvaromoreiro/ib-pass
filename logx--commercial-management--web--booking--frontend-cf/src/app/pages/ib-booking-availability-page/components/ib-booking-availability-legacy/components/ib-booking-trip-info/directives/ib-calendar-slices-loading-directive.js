(function () {


    angular
        .module('ib-booking-trip-info-module')
        .directive('ibCalendarSlidesLoading', ibCalendarSlidesLoading);

    ibCalendarSlidesLoading.$inject = ['$timeout', '$window', 'BookingComponentUtils'];
    function ibCalendarSlidesLoading ($timeout, $window, BookingComponentUtils) {
        // Usage: <div ib-calendar-slides-loading></div>
        //
        // Creates:
        //
        const directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link ($scope, $element, $attrs) {
            const anguElement = angular.element($element);
            const cabins = BookingComponentUtils.get_parents(anguElement, (el) => {
                return angular.element(el).hasClass('ib-fc-calendar-slides-loading');
            });
            const filtersCabins = angular.element(cabins).find('.ib-table-flight-filters--cabins');

            $timeout(applyDimensions);
            angular.element($window).on('resize', applyDimensions);

            $scope.$on('$destroy', () => {
                angular.element($window).off('resize', applyDimensions);
            });

            function applyDimensions () {
                const top = filtersCabins[0].offsetTop;
                anguElement.css({ top: top + 'px', height: 'calc(100% - ' + top + 'px)' });
            }
        }
    }

})();