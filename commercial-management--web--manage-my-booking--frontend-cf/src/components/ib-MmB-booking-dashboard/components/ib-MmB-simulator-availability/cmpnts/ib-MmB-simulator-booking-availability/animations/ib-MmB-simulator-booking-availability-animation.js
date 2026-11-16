(function () {
    'use strict';

    angular
        .module('ib-MmB-simulator-booking-availability-module')
        .animation('.show-animation', SimulatorAvailabilityAnimation);


    SimulatorAvailabilityAnimation.$inject = ['$window', '$timeout', '$rootScope', 'ComponentsUtils'];
    function SimulatorAvailabilityAnimation($window, $timeout, $rootScope, ComponentsUtils) {
        return {
            enter: startSliceAnimation
        };

        function startSliceAnimation(element, done) {
            var eventsStart = 'animationstart webkitAnimationStart MSAnimationStart transitionend webkitTransitionStart';
            var eventsEnd = 'animationend webkitAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd';
            var animationSpeed, hideCssElement = { 'display': 'block', 'overflow': 'hidden', 'visibility': 'hidden' };
            var elementIndex = $rootScope.animationIndex;
            if (angular.isDefined($rootScope.selectedSlice)) {

                if ($window.innerWidth < 768) {
                    element.find('#selectedSliceMobile-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').css({ 'visibility': 'hidden' });
                } else {
                    element.find('#selectedSlice-' + $rootScope.selectedSlice.cabin + '-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').css({ 'visibility': 'hidden' });
                }
                element.find('.ib-heading-flight').css({ 'visibility': 'hidden' });
                element.find('#selectedSliceBackGround-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').css({ 'background-color': 'transparent' });
                animationSpeed = (500 + (50 * Math.min($rootScope.selectedSlice.selectedSliceIndex, 3)));
                $rootScope.$broadcast('animationStarts', elementIndex);
                angular.element('#originDestination-' + elementIndex).css(hideCssElement);
                angular.element('#footer').css(hideCssElement);
                angular.element('html, body').scrollTop(angular.element('#selectedSlice-' + elementIndex).offset().top);
                element.css({
                    position: 'relative',
                    bottom: '-' + (Math.max(0, $rootScope.selectedSlice.articleOffset - $rootScope.selectedSlice.heightHeadingFlight)) + 'px',
                    transform: 'translateY(-' + (Math.max(0, $rootScope.selectedSlice.articleOffset - $rootScope.selectedSlice.transformOffset)) + 'px)',
                    transition: 'transform ' + animationSpeed + 'ms' + ' ease-in'
                });
                done();
                element.on(eventsEnd, function () {
                    element.removeAttr('style');
                    angular.element('#originDestination-' + elementIndex).removeAttr('style');
                    element.find('#selectedSliceBackGround-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').removeAttr('style');
                    $rootScope.$apply(function () {
                        element.find('#selectedSlice-' + $rootScope.selectedSlice.cabin + '-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').removeAttr('style');
                        element.find('#selectedSliceMobile-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected').removeAttr('style');
                        $rootScope.$broadcast('animationEnds', elementIndex);
                    });
                    $timeout(function () {
                        ComponentsUtils.equalHeight(element, true);
                        angular.element('#footer').removeAttr('style');
                        element.find('#selectedSlice-' + $rootScope.selectedSlice.cabin + '-' + (elementIndex + 1) + '-' + $rootScope.selectedSlice.selectedSlicesLength + '-selected');
                    });
                });
            };
        }
    };
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = SimulatorAvailabilityAnimation;
    }
})();

