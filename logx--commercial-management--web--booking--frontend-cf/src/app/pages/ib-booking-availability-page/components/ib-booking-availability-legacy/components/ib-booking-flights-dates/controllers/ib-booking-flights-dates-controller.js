import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
(function () {


    angular
        .module('ib-booking-flights-dates-module')
        .controller('FlightsDatesController', FlightsDatesController);

    FlightsDatesController.$inject = ['$scope', '$timeout', '$rootScope', 'BookingAvailabilityConstants', '$window', '$element'];

    function FlightsDatesController ($scope, $timeout, $rootScope, BookingAvailabilityConstants, $window, $element) {
        const vm = this;
        let SLIDES_TO_SHOW = slidestoShowByResolution();
        const SLIDES_TO_SCROLL = 1;

        let animationRunning;
        let loadingData;
        vm.currentSlides;
        vm.carouselOptions;

        $scope.$on('changeNextSlide', nextSlide);
        $scope.$on('changePreviousSlide', previousSlide);
        $scope.$on('nextSlickAnimationEnds', nextSlickAnimationEnds);
        $scope.$on('previousSlickAnimationEnds', previousSlickAnimationEnds);
        $scope.$on('finishLoadingSlides', finishLoadingSlides);
        $scope.$on('disableButtonSlides', disableButtonSlides);
        angular.element($window).on('resize', recalculateSlides);
        $scope.$on('$destroy', () => {
            angular.element($window).off('resize', recalculateSlides);
        });

        vm.$onInit = activate;
        vm.searchSlideAvailability = searchSlideAvailability;
        vm.maxDateFormated;
        vm.minDateFormated;
        vm.openSeacher = openSeacher;
        vm.warningVisible = false;
        vm.isNewFare;

        /////////////

        function activate () {
            vm.isNewFare = $rootScope.newFare;
            animationRunning = false;
            loadingData = false;
            vm.currentSlides = vm.calendarData.currentSlides;
            vm.initialSlideIndex = Math.max(0, vm.calendarData.currentInitialSlide - Math.floor(SLIDES_TO_SHOW / 2));

            if (vm.calendarData && vm.calendarData.maxDate) {
                vm.maxDateFormated = dayjs(vm.calendarData.maxDate).format('DD/MM');
            }
            if (vm.calendarData && vm.calendarData.minDate) {
                vm.minDateFormated = dayjs(vm.calendarData.minDateFormated).format('DD/MM');
            }
            const shownSlidesLength = Math.min(vm.initialSlideIndex + SLIDES_TO_SHOW, vm.calendarData.slides.length);
            if (!vm.currentSlides.length) {
                for (let i = vm.initialSlideIndex; i < shownSlidesLength; i++) {
                    vm.currentSlides.push(vm.calendarData.slides[i]);
                }
            }
            vm.carouselOptions = {};
            controlVisibilitySlickButton();
            disableButtonSlides(null,false);
        }
        function slidestoShowByResolution () {
            let slides = 7;
            if (window.innerWidth <= 600) {
                slides = 3;
            }
            return slides;
        }
        function recalculateSlides () {
            SLIDES_TO_SHOW = slidestoShowByResolution();
            vm.initialSlideIndex = Math.max(0, vm.calendarData.currentInitialSlide - Math.floor(SLIDES_TO_SHOW / 2));
            const shownSlidesLength = Math.min(vm.initialSlideIndex + SLIDES_TO_SHOW, vm.calendarData.slides.length);
            vm.calendarData.currentSlides.splice(0,vm.calendarData.currentSlides.length);
            if (!vm.currentSlides.length) {
                for (let i = vm.initialSlideIndex; i < shownSlidesLength; i++) {
                    vm.currentSlides.push(vm.calendarData.slides[i]);
                }
            }
        }

        /**
         * Emits a 'slideSelected' event with the selected slide Information and the origin destination index
         * @param {Object} slide the selected Slide information
         */
        function searchSlideAvailability (slide) {
            let offsetSlides = vm.calendarData.currentInitialSlide - slide.slidePosition;
            const isNext = offsetSlides < 0;
            if (!animationRunning && !loadingData) {
                animationRunning = true;
                loadingData = true;
                if (isNext) {
                    offsetSlides = Math.min(Math.abs(offsetSlides), (vm.calendarData.slides.length - (slide.slidePosition+1)));
                    addNextCalendarSlides(Math.abs(offsetSlides));
                } else {
                    offsetSlides = Math.min(Math.abs(offsetSlides), slide.slidePosition);
                    addPreviousCalendarSlides(Math.abs(offsetSlides));
                }
                vm.calendarData.selectedSlide = slide.slidePosition;
                $scope.$broadcast('slickSlideSelected', Math.abs(offsetSlides), isNext);
                $scope.$emit('slideSelected', slide, isNext);
                ($element[0]).dispatchEvent(new CustomEvent('slideSelected', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            slide,
                            isNext
                        }
                 }));

            }
        }

        /**
         * Call function to add the next 'SLIDES_TO_SCROLL' slides and emit event to call service and obtain the information of this day.
         * If it is swipe event, broadcast event to bind a click to the 'SLICK_NEXT_BUTTON'
         * @param {Object} event Event fired when swiped left or when carousel next button is clicked
         * @param {Boolean} swipeEvent Checks if the event type is 'mouseup'/'touchend' or not
         */
        function nextSlide (event, swipeEvent) {
            if (!animationRunning ) {
                addNextCalendarSlides(SLIDES_TO_SCROLL);
                $scope.$emit('nextSlideDate', true);
                ($element[0]).dispatchEvent(new CustomEvent('nextSlideDate', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            isNext: true
                        }
                 }));
                if (swipeEvent) {
                    $timeout(() => {
                        $scope.$broadcast('slickNextElement');
                    });
                }
                animationRunning = true;
            }
        }

        /**
         * Call function to add the previous 'SLIDES_TO_SCROLL' slides and emit event to call service and obtain the information of this day.
         * If it is swipe event, broadcast event to bind a click to the 'SLICK_PREV_BUTTON'
         * @param {Object} event Event fired when swiped right or when carousel previous button is clicked
         * @param {Boolean} swipeEvent Checks if the event type is 'mouseup'/'touchend' or not
         */
        function previousSlide (event, swipeEvent) {
            if (!animationRunning) {
                addPreviousCalendarSlides(SLIDES_TO_SCROLL);
                $scope.$emit('nextSlideDate', false);
                ($element[0]).dispatchEvent(new CustomEvent('nextSlideDate', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            isNext: false
                        }
                 }));
                if (swipeEvent) {
                    $timeout(() => {
                        $scope.$broadcast('slickPreviousElement');
                    });
                }
                animationRunning = true;
            }
        }

        /**
         * Call function to remove excess next slides and finish loading
         * @param {Object} event Event fired when the carousel animation ends
         * @param {*} eventData Number of days that have been moved
         */
        function nextSlickAnimationEnds (event, eventData) {
            removeNextCalendarSlides(eventData);
            animationRunning = false;
            controlVisibilitySlickButton();
            if(!vm.currentSlides[vm.currentSlides.length-1].lastItem)
                disableButtonSlides(null,false);
            $scope.$apply();
        }

        /**
         * Call function to remove excess previous slides and finish loading
         * @param {Object} event Event fired when the carousel animation ends
         * @param {*} eventData Number of days that have been moved
         */
        function previousSlickAnimationEnds (event, eventData) {
            removePreviousCalendarSlides(eventData);
            animationRunning = false;
            controlVisibilitySlickButton();
            if(!vm.currentSlides[0].firstItem)
                disableButtonSlides(null,false);
            $scope.$apply();
        }

        /**
         * Adds to the end of currentSlides array the quantity of slides received
         * @param {Number} quantity Number of new slides to add
         */
        function addNextCalendarSlides (quantity) {
            let i = 0;
            quantity = quantity < 0 ? 0 : quantity;
            for (i = 0; i < quantity; i++) {
                const index = vm.initialSlideIndex + SLIDES_TO_SHOW;
                if ( index <  vm.calendarData.slides.length) {
                    vm.currentSlides.push(vm.calendarData.slides[index]);
                    vm.initialSlideIndex++;
                } else {
                    break;
                }
            }

        }

        /**
         * Adds to the start of currentSlides array the quantity of slides received
         * @param {Number} quantity Number of new slides to add
         */
        function addPreviousCalendarSlides (quantity) {
            let i = 0;
            quantity = quantity < 0 ? 0 : quantity;
            for (i = 0; i < quantity; i++) {
                vm.currentSlides.unshift(vm.calendarData.slides[vm.initialSlideIndex - 1]);
                vm.initialSlideIndex--;
            }

        }

        /**
         * Removes from the start of currentSlides array the quantity of slides received
         * @param {Number} quantity Number of current slides to delete
         */
        function removeNextCalendarSlides (quantity) {
            let i = 0;
            quantity = quantity < 0 ? 0 : quantity;
            for (i = 0; i < quantity; i++) {
                vm.currentSlides.shift();
            }
        }

        /**
         * Removes from the end of currentSlides array the quantity of slides received
         * @param {Number} quantity Number of current slides to delete
         */
        function removePreviousCalendarSlides (quantity) {
            let i = 0;
            quantity = quantity < 0 ? 0 : quantity;
            for (i = 0; i < quantity; i++) {
                vm.currentSlides.pop();
            }
        }

        /**
         * Sets loading to false and enables previous/next buttons
         */
        function finishLoadingSlides () {
            loadingData = false;
            // vm.carouselOptions.prevButtonDisabled = false;
            //vm.carouselOptions.nextButtonDisabled = false;e

        }

        /**
         * Disables carousel buttons while we are getting new slides information
         * @param {Object} event Event fired when Calendar Ribbon service is called and we dont have the response yet
         * @param {Boolean} disabled
         */
        function disableButtonSlides (event, disabled) {
            vm.carouselOptions.prevButtonDisabled = disabled;
            vm.carouselOptions.nextButtonDisabled = disabled;
        }
        function controlVisibilitySlickButton () {
            vm.carouselOptions.nextButtonHidden = false;
            vm.carouselOptions.prevButtonHidden = false;
            const isAboveLastResolution = window.innerWidth < 1280;
            const lowerLimit = (isAboveLastResolution)? BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_DISABLED : BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_WARN;
            const upperLimit = (isAboveLastResolution)? BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_DISABLED : BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_WARN;
            for (const element of vm.currentSlides) {
                if ( element.state === lowerLimit) {
                    vm.carouselOptions.prevButtonHidden =  true;
                }
                if ( element.state === upperLimit) {
                    vm.carouselOptions.nextButtonHidden = true;
                }
            }
            vm.warningVisible = vm.carouselOptions.prevButtonHidden || vm.carouselOptions.nextButtonHidden;
        }
        function openSeacher (calendarType) {
            $rootScope.$broadcast('openAdvancedSearchAndOpenCalendar',calendarType);
        }
    }
})();
