(function () {
    'use strict';

    angular
        .module('ib-flexibilization-calendar-module')
        .directive('ibCalendarCarousel', ibCalendarCarousel);
    
    ibCalendarCarousel.$inject = ['$timeout', '$window'];
    /* istanbul ignore next */
    function ibCalendarCarousel($timeout, $window) {
        // Usage: <div ib-calendar-carousel></div>
        //
        // Creates: the events and animation of the calendar carousel.
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var vm = this;
            vm.isSwipe = false;
            vm.isClicked = false;
            vm.trackTreshold = 10;
            element.on('touchstart', function (event) {
                var touch = event.touches[0];
                vm.carouselElement = element[0];
                vm.originalLeft = getComputedStyle(vm.carouselElement).left;
                vm.itemList = angular.element(element).children();
                vm.gestureTreshold = vm.itemList[0].clientWidth / 2;
                vm.startX = touch.screenX;
                vm.startY = touch.screenY;
                vm.isSwipe = false;
            });
            element.on('touchmove', function (event) {
                var touch = event.touches[0];
                vm.dx = touch.screenX - vm.startX;
                if (vm.isSwipe) {
                    vm.carouselElement.style.left = (parseInt(vm.originalLeft, 10) + vm.dx) + 'px';
                    event.preventDefault();
                } else {
                    vm.dy = touch.screenY - vm.startY;
                    if (Math.abs(vm.dx) > vm.trackTreshold) {
                        vm.isSwipe = (1 - Math.floor(Math.abs(2 * vm.dy / vm.dx))) === 1 ? true : false;
                    }
                }
            });
            element.on('touchend', function (event) {
                if (!vm.isSwipe) return;
                event.preventDefault();
                if (vm.dx < -vm.gestureTreshold) {
                    scope.ibFlexCalendarCtrl.changeDay(true);
                } else if (vm.dx > vm.gestureTreshold) {
                    scope.ibFlexCalendarCtrl.changeDay(false);
                }
                vm.carouselElement.removeAttribute('style');
            });
            element.on('mousedown', function (event) {
                vm.carouselElement = element[0];
                vm.originalLeft = getComputedStyle(vm.carouselElement).left;
                vm.itemList = angular.element(element).children();
                vm.gestureTreshold = vm.itemList[0].clientWidth / 2;
                vm.startX = event.screenX;
                vm.startY = event.screenY;
                vm.isSwipe = false;
                vm.isClicked = true;
            });
            element.on('mousemove', function (event) {
                if (!vm.isClicked) return;
                vm.dx = event.screenX - vm.startX;
                if (vm.isSwipe) {
                    vm.carouselElement.style.left = (parseInt(vm.originalLeft, 10) + vm.dx) + 'px';
                    event.preventDefault();
                } else {
                    vm.dy = event.screenY - vm.startY;
                    if (Math.abs(vm.dx) > vm.trackTreshold) {
                        vm.isSwipe = (1 - Math.floor(Math.abs(2 * vm.dy / vm.dx))) === 1 ? true : false;
                    }
                }
            });
            /* element.on('mouseup', function (event) {
                
            }); */
            element.on('click', function (event) {
                vm.isClicked = false;
                if (!vm.isSwipe) return;
                event.preventDefault();
                if (vm.dx < -vm.gestureTreshold) {
                    scope.ibFlexCalendarCtrl.changeDay(true);
                } else if (vm.dx > vm.gestureTreshold) {
                    scope.ibFlexCalendarCtrl.changeDay(false);
                }
                vm.carouselElement.removeAttribute('style');
            });
        }
    }
})();