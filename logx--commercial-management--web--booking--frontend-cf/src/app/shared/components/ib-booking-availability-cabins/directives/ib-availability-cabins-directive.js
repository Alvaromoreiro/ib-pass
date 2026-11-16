(function () {


    angular
        .module('ib-booking-segment-info-module')
        .directive('ellipsisTitleInfo', ellipsisTitleInfo);

    ellipsisTitleInfo.$inject = ['$timeout', '$window'];

    function ellipsisTitleInfo ($timeout, $window) {
        return {
            restrict: 'AE',
            link: link,
            controller: 'BookingSegmentInfoController'
        };
        function link (scope, elem, attrs) {
            function isEllipsisActive () {
                if (angular.element(elem)[0].offsetWidth >= angular.element(elem)[0].scrollWidth) {
                    elem.children('.ib-popover-tooltip').addClass('u-hide');
                } else {
                    elem.children('.ib-popover-tooltip').removeClass('u-hide');
                }
            }
            angular.element($window).bind('resize', () => {
                isEllipsisActive();
            });
            $timeout(() => {
                elem.children('.ib-popover-tooltip').addClass('u-hide');
                isEllipsisActive();
            });
        }
    }
})();