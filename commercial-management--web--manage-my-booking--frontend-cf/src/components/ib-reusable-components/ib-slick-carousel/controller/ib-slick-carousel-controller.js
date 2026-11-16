(function () {
    'use strict';

    angular
        .module('ib-slick-carousel-module')
        .controller('SlickCarouselController', SlickCarouselController);

    SlickCarouselController.$inject = ['$scope', 'SlickCarouselConstants'];
    function SlickCarouselController($scope, SlickCarouselConstants) {
        var vm = this;
        var SWIPE_EVENT_TYPES = ['mouseup', 'touchend'];
        let touchMouseStartX = 0;
        let touchMouseEndX = 0;
        const gestureZone = angular.element('.slick-carousel')[0];

        vm.$onInit = activate;
        vm.$onChanges = updateOptions;
        vm.nextSlide = nextSlide;
        vm.previousSlide = previousSlide;



        ////////////////

        function activate() {
            vm.options = SlickCarouselConstants.DEFAULT_OPTIONS;
            angular.extend(vm.options, vm.carouselOptions);

            gestureZone.addEventListener('touchstart', function(event) {
                touchMouseStartX = event.changedTouches[0].screenX;
            }, false);

            gestureZone.addEventListener('touchend', function(event) {
                touchMouseEndX = event.changedTouches[0].screenX;
                handleGesture(event);
            }, false);

            gestureZone.addEventListener('mousedown', function(event) {
                touchMouseStartX = event.clientX;
            }, false);
            gestureZone.addEventListener('mouseup', function(event) {
                touchMouseEndX = event.clientX;
                handleGesture(event);
            }, false);
        }

        function nextSlide(event) {
            if (!(vm.carouselOptions.nextButtonDisabled || vm.options.nextButtonDisabled) && !vm.carouselSlides[vm.carouselSlides.length - 1].lastItem) {
                $scope.$emit('changeNextSlide', SWIPE_EVENT_TYPES.indexOf(event.type) !== -1);
            }
        }

        function previousSlide(event) {
            if (!(vm.carouselOptions.prevButtonDisabled || vm.options.prevButtonDisabled) && !vm.carouselSlides[0].firstItem) {
                $scope.$emit('changePreviousSlide', SWIPE_EVENT_TYPES.indexOf(event.type) !== -1);
            }
        }

        function updateOptions(updatedData) {
            if (vm.options && updatedData.carouselOptions) {
                angular.extend(vm.options, updatedData.carouselOptions.currentValue);
            }
        }

        function handleGesture(e) {
            if (touchMouseEndX < touchMouseStartX) {
                // Swiped left
                nextSlide(e);
            }

            if (touchMouseEndX > touchMouseStartX) {
                // Swiped right
                previousSlide(e);
            }
        }
    }
})();
