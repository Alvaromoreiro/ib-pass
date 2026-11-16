(function () {


    angular
        .module('ib-slick-carousel-module')
        .directive('ibCarousel', ibCarousel);

    ibCarousel.$inject = ['$timeout', '$window'];
    function ibCarousel ($timeout, $window) {
        // Usage: <div ib-carousel></div>
        //
        // Creates: the events and animation of the slick carousel.
        //
        const directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        function link ($scope, $element, $attrs) {
            const SLICK_LIST_ELEMENT = '#SLICK_CARROUSEL_LIST_' + $scope.slickCtrl.carouselIndex;
            const SLICK_PREV_BUTTON = '#SLICK_PREV_BUTTON_' + $scope.slickCtrl.carouselIndex;
            const SLICK_NEXT_BUTTON = '#SLICK_NEXT_BUTTON_' + $scope.slickCtrl.carouselIndex;

            let INITIAL_SLICK_ITEMS;

            $timeout(initCarousel);

            $scope.$on('$destroy', () => {
                angular.element($window).off('resize', resizeFunction);
            });

            $scope.$on('updateCalendarSlides', initCarousel);

            //////////////////////////////////////

            function initCarousel () {
                const carouselSlides = $scope.slickCtrl.carouselSlides;
                const slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();

                //binds the events to animate de list
                angular.element($window).on('resize', resizeFunction);

                $scope.$on('slickNextElement', slickNextElement);
                angular.element($element).find(SLICK_NEXT_BUTTON).bind('click', slickNextElement);

                $scope.$on('slickPreviousElement', slickPreviousElement);
                angular.element($element).find(SLICK_PREV_BUTTON).bind('click', slickPreviousElement);

                $scope.$on('slickSlideSelected', slickSlideSelected);

                INITIAL_SLICK_ITEMS = slideItems.length;
                if (carouselSlides[0].firstItem) {
                    angular.element($element).find(SLICK_PREV_BUTTON).prop('disabled', true);
                }
                if (carouselSlides[carouselSlides.length - 1].lastItem) {
                    angular.element($element).find(SLICK_NEXT_BUTTON).prop('disabled', true);

                }
                setInitialListOffset();
            }

            function slickNextElement () {
                if (!$scope.slickCtrl.options.nextButtonDisabled || 768 > $window.innerWidth) {
                    $scope.slickCtrl.options.nextButtonDisabled = true;
                    moveSlides(true, $scope.slickCtrl.options.slidesToScroll);
                }

            }

            function slickPreviousElement () {
                if (!$scope.slickCtrl.options.prevButtonDisabled || 768 > $window.innerWidth) {
                    $scope.slickCtrl.options.prevButtonDisabled = true;
                    moveSlides(false, $scope.slickCtrl.options.slidesToScroll);
                }
            }

            /**
             *
             * @param {*boolean} isNext Defines if the movement is backwards or forwards.
             * @param {*number} quantity Number of days that we are going to move
             */
            function moveSlides (isNext, quantity) {
                const slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                const offset = isNext ? 0 : slideItems.width() * quantity;
                slideItems.css({ left: -(getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems.width()) + offset) });
                $timeout(() => {
                    animateCarousel(isNext, quantity);
                });
            }

            function animateCarousel (isNext, quantity) {
                const slickConfig = $scope.slickCtrl.options;
                const slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                const initialSlideWidth = slideItems.width();
                const slideWidth = (isNext ? -1 : 0) * initialSlideWidth;
                const SLIDE_BUTTON = isNext ? SLICK_NEXT_BUTTON : SLICK_PREV_BUTTON;
                const carouselSlides = $scope.slickCtrl.carouselSlides;
                angular.element($element).find(SLIDE_BUTTON).prop('disabled', true);
                slideItems.animate({
                    left: -getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems.width()) + slideWidth * quantity
                }, slickConfig.animationSpeed, slickConfig.animationType).promise().done(animationEnds);

                function animationEnds () {
                    if (!slickConfig.nextButtonDisabled && ((SLIDE_BUTTON === SLICK_NEXT_BUTTON && !carouselSlides[carouselSlides.length - 1].lastItem)
                        || (SLIDE_BUTTON === SLICK_PREV_BUTTON && carouselSlides[carouselSlides.length - 1].lastItem))) {
                        angular.element($element).find(SLICK_NEXT_BUTTON).prop('disabled', false);
                    }
                    if (!slickConfig.prevButtonDisabled && ((SLIDE_BUTTON === SLICK_PREV_BUTTON && !carouselSlides[0].firstItem)
                        || (SLIDE_BUTTON === SLICK_NEXT_BUTTON && carouselSlides[0].firstItem))) {
                        angular.element($element).find(SLICK_PREV_BUTTON).prop('disabled', false);
                    }
                    $scope.$emit(isNext ? 'nextSlickAnimationEnds' : 'previousSlickAnimationEnds', quantity);
                    slideItems.css({ left: -getSlickInitialOffset(INITIAL_SLICK_ITEMS, initialSlideWidth) });
                }
            }

            function getSlickInitialOffset (totalSlickItems, slickItemWidth) {
                const slickConfig = $scope.slickCtrl.options;
                let initialOffset = 0, itemsToShow;
                if (slickConfig.centerMode) {
                    itemsToShow = getItemsToShow();
                    initialOffset = ((totalSlickItems - itemsToShow) / 2) * slickItemWidth;
                }
                return initialOffset;
            }
            function resizeFunction () {
                $timeout(()=>{
                    const slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                    INITIAL_SLICK_ITEMS = slideItems.length;
                    setInitialListOffset();
                });
            }

            function setInitialListOffset () {
                const slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                slideItems.css({ left: -getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems.width()) });

            }

            function getItemsToShow () {
                const slickConfig = $scope.slickCtrl.options;
                const innerWidth = $window.innerWidth;
                return innerWidth < 768 ? slickConfig.SLIDES_TO_SHOW.MOBILE :
                    innerWidth >= 768 && innerWidth < 1024 ? slickConfig.SLIDES_TO_SHOW.TABLET :
                        innerWidth >= 1024 && innerWidth < 1280 ? slickConfig.SLIDES_TO_SHOW.TABLET_XL : slickConfig.SLIDES_TO_SHOW.DESKTOP;
            }

            function slickSlideSelected (event, quantity, isNext) {
                $timeout(() => {
                    moveSlides(isNext, quantity);
                });
            }
        }
    }
})();