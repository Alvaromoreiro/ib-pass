(function () {


    angular
        .module('ib-slick-carousel-module')
        .controller('SlickCarouselController', SlickCarouselController);

    SlickCarouselController.$inject = ['$scope', 'SlickCarouselConstants'];
    function SlickCarouselController ($scope, SlickCarouselConstants) {
        const vm = this;
        const SWIPE_EVENT_TYPES = ['mouseup', 'touchend'];
        let touchMouseStartX = 0;
        let touchMouseEndX = 0;
        const gestureZone = document.querySelector('.slick-carousel');

        vm.$onInit = activate;
        vm.$onChanges = updateOptions;
        vm.nextSlide = nextSlide;
        vm.previousSlide = previousSlide;

        ////////////////

        function activate () {
            vm.carouselOptions = vm.options;
            vm.options = SlickCarouselConstants.DEFAULT_OPTIONS;
            angular.extend(vm.options, vm.carouselOptions);

            gestureZone.addEventListener('touchstart', (event) => {
                touchMouseStartX = event.changedTouches[0].screenX;
            }, false);

            gestureZone.addEventListener('touchend', (event) => {
                touchMouseEndX = event.changedTouches[0].screenX;
                handleGesture(event);
            }, false);

            gestureZone.addEventListener('mousedown', (event) => {
                touchMouseStartX = event.clientX;
            }, false);
            gestureZone.addEventListener('mouseup', (event) => {
                touchMouseEndX = event.clientX;
                handleGesture(event);
            }, false);
        }

        function nextSlide (event) {
            if (!vm.options.nextButtonDisabled && !vm.carouselSlides[vm.carouselSlides.length - 1].lastItem) {
                $scope.$emit('changeNextSlide', SWIPE_EVENT_TYPES.indexOf(event.type) !== -1);
            }
        }

        function previousSlide (event) {
            if (!vm.options.prevButtonDisabled && !vm.carouselSlides[0].firstItem) {
                $scope.$emit('changePreviousSlide', SWIPE_EVENT_TYPES.indexOf(event.type) !== -1);
            }
        }

        function updateOptions (updatedData) {
            if (vm.options && updatedData.carouselOptions) {
                angular.extend(vm.options, updatedData.carouselOptions.currentValue);
            }
        }

        function handleGesture (e) {
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
