(function () {


    angular
        .module('ib-booking-availability-module')
        .animation('.show-animation', AvailabilityAnimation);


    AvailabilityAnimation.$inject = ['$window', '$timeout', '$rootScope', 'BookingComponentUtils'];
    function AvailabilityAnimation ($window, $timeout, $rootScope, BookingComponentUtils) {
        return {
            enter: startSliceAnimation
        };

        function startSliceAnimation (element, done) {
            const eventsStart = 'animationstart webkitAnimationStart MSAnimationStart transitionend webkitTransitionStart';
            const eventsEnd = 'animationend webkitAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd';
            const hideCssElement = { display: 'block', overflow: 'hidden', visibility: 'hidden' };
            const elementIndex = $rootScope.animationIndex;
            if (angular.isDefined($rootScope.selectedSlice)) {

                if ($window.innerWidth < 768) {
                    element.find('#selectedSliceMobile-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').css({ visibility: 'hidden' });
                } else {
                    element.find('#selectedSlice-' + $rootScope.selectedSlice.cabin + '-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').css({ visibility: 'hidden' });
                }
                element.find('.ib-heading-flight').css({ visibility: 'hidden' });
                element.find('#selectedSliceBackGround-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').css({ 'background-color': 'transparent' });
                const animationSpeed = (500 + (20 * Math.min($rootScope.selectedSlice.selectedSliceIndex, 3)));
                $rootScope.$broadcast('animationStarts', elementIndex);
                angular.element('#originDestination-' + elementIndex).css(hideCssElement);
                angular.element('#footer').css(hideCssElement);
                angular.element('html, body').scrollTop(angular.element('#selectedSlice-' + elementIndex).offset().top);
                element.css({
                    position: 'relative',
                    bottom: '-' + (Math.max(0, $rootScope.selectedSlice.articleOffset - $rootScope.selectedSlice.heightHeadingFlight)) + 'px',
                    transform: 'translate3d(0,-' + (Math.max(0, $rootScope.selectedSlice.articleOffset - $rootScope.selectedSlice.transformOffset)) + 'px,0)',
                    transition: 'transform ' + animationSpeed + 'ms' + ' ease-in'
                });
                done();
                element.on(eventsEnd, () => {
                    element.removeAttr('style');
                    angular.element('#originDestination-' + elementIndex).removeAttr('style');
                    element.find('#selectedSliceBackGround-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').removeAttr('style');
                    $rootScope.$apply(() => {
                        element.find('#selectedSlice-' + $rootScope.selectedSlice.cabin + '-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').removeAttr('style');
                        element.find('#selectedSliceMobile-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').removeAttr('style');
                        $rootScope.$broadcast('animationEnds', elementIndex);
                    });
                    $timeout(() => {
                        BookingComponentUtils.equalHeight(element, true);
                        angular.element('#footer').removeAttr('style');
                        element.find('#selectedSlice-' + $rootScope.selectedSlice.cabin + '-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected');
                    });
                });
            }
        }
    }
})();

