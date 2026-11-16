(function () {
    'use strict';

    angular
        .module('ib-slick-carousel-module')
        .directive('ibCarousel', ibCarousel);

    ibCarousel.$inject = ['$timeout', '$window'];
    function ibCarousel($timeout, $window) {
        // Usage: <div ib-carousel></div>
        //
        // Creates: the events and animation of the slick carousel.
        //
        var directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        function link($scope, $element, $attrs) {
            var SLICK_LIST_ELEMENT = '#SLICK_CARROUSEL_LIST_' + $scope.slickCtrl.carouselIndex;
            var SLICK_PREV_BUTTON = '#SLICK_PREV_BUTTON_' + $scope.slickCtrl.carouselIndex;
            var SLICK_NEXT_BUTTON = '#SLICK_NEXT_BUTTON_' + $scope.slickCtrl.carouselIndex;
            var  SLICK_PREV_BUTTON_AUX =$scope.slickCtrl.carouselIndex.indexOf('_AWS') !== -1 ? '#SLICK_PREV_BUTTON_OD1' : '#SLICK_PREV_BUTTON_OD1_AWS';
            var SLICK_NEXT_BUTTON_AUX = $scope.slickCtrl.carouselIndex.indexOf('_AWS') !== -1 ? '#SLICK_NEXT_BUTTON_OD1' : '#SLICK_NEXT_BUTTON_OD1_AWS';

            var INITIAL_SLICK_ITEMS;
            
            $timeout(initCarousel);

            $scope.$on('$destroy', function () {
                angular.element($window).off('resize', setInitialListOffset);
            });

            $scope.$on('updateCalendarSlides', initCarousel);

            //////////////////////////////////////

            function initCarousel() {
                var carouselSlides = $scope.slickCtrl.carouselSlides;
                var slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();

                //binds the events to animate de list
                angular.element($window).on('resize', setInitialListOffset);

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

            function slickNextElement() {
                moveSlides(true, $scope.slickCtrl.options.slidesToScroll);
            }

            function slickPreviousElement() {
                moveSlides(false, $scope.slickCtrl.options.slidesToScroll);
            }

            /**
             * 
             * @param {*boolean} isNext Defines if the movement is backwards or forwards.
             * @param {*number} quantity Number of days that we are going to move
             */
            function moveSlides(isNext, quantity) {
                var slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                var offset = isNext ? 0 : slideItems.width() * quantity;
                var secondElementIndex = $scope.slickCtrl.carouselIndex.indexOf('_AWS') !== -1 ?  '#SLICK_CARROUSEL_LIST_OD1' : '#SLICK_CARROUSEL_LIST_OD1_AWS' ;
                var slideItems2 = angular.element(secondElementIndex).children();
                if (slideItems2){
                    slideItems2.css({ 'left': -(getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems2.width()) + offset) });
                }
                slideItems.css({ 'left': -(getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems.width()) + offset) });
                $timeout(function () {
                    animateCarousel(isNext, quantity);
                });
            }

            function animateCarousel(isNext, quantity) {
                var slickConfig = $scope.slickCtrl.options;
                var slideItems2;
                var slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                var secondElementIndex = $scope.slickCtrl.carouselIndex.indexOf('_AWS') !== -1 ?  '#SLICK_CARROUSEL_LIST_OD1' : '#SLICK_CARROUSEL_LIST_OD1_AWS' ;
                var slideItems2 = angular.element(secondElementIndex).children();
                var initialSlideWidth = slideItems.width();
                var slideWidth = (isNext ? -1 : 0) * initialSlideWidth;
                var SLIDE_BUTTON = isNext ? SLICK_NEXT_BUTTON : SLICK_PREV_BUTTON;
                var SLIDE_BUTTON_AUX = isNext ? SLICK_NEXT_BUTTON_AUX : SLICK_PREV_BUTTON_AUX;
                var carouselSlides = $scope.slickCtrl.carouselSlides;
                angular.element($element).find(SLIDE_BUTTON).prop('disabled', true);
                angular.element(SLIDE_BUTTON_AUX).prop('disabled', true);

               
                if(slideItems2){
                    slideItems2.animate({
                        'left': -getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems2.width()) + slideWidth * quantity
                    }, slickConfig.animationSpeed, slickConfig.animationType).promise().done();
                }
                slideItems.animate({
                    'left': -getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems.width()) + slideWidth * quantity
                }, slickConfig.animationSpeed, slickConfig.animationType).promise().done(animationEnds);

                function animationEnds() {
                    if (!slickConfig.nextButtonDisabled && ((SLIDE_BUTTON === SLICK_NEXT_BUTTON && !carouselSlides[carouselSlides.length - 1].lastItem)
                        || (SLIDE_BUTTON === SLICK_PREV_BUTTON && carouselSlides[carouselSlides.length - 1].lastItem))) {
                        angular.element($element).find(SLICK_NEXT_BUTTON).prop('disabled', false);
                        angular.element(SLIDE_BUTTON_AUX).prop('disabled', false);

                    }
                    if (!slickConfig.prevButtonDisabled && ((SLIDE_BUTTON === SLICK_PREV_BUTTON && !carouselSlides[0].firstItem)
                        || (SLIDE_BUTTON === SLICK_NEXT_BUTTON && carouselSlides[0].firstItem))) {
                        angular.element($element).find(SLICK_PREV_BUTTON).prop('disabled', false);
                        angular.element(SLIDE_BUTTON_AUX).prop('disabled', false);
                    }
                    $scope.$emit(isNext ? 'nextSlickAnimationEnds' : 'previousSlickAnimationEnds', quantity);
                    slideItems.css({ 'left': -getSlickInitialOffset(INITIAL_SLICK_ITEMS, initialSlideWidth) });
                    if(slideItems2)
                        slideItems2.css({ 'left': -getSlickInitialOffset(INITIAL_SLICK_ITEMS, initialSlideWidth) });
                }
            }

            function getSlickInitialOffset(totalSlickItems, slickItemWidth) {
                var slickConfig = $scope.slickCtrl.options;
                var initialOffset = 0, itemsToShow;
                if (slickConfig.centerMode) {
                    itemsToShow = getItemsToShow();
                    initialOffset = ((totalSlickItems - itemsToShow) / 2) * slickItemWidth;
                }
                return initialOffset;
            }

            function setInitialListOffset() {
                var slideItems = angular.element($element).find(SLICK_LIST_ELEMENT).children();
                slideItems.css({ 'left': -getSlickInitialOffset(INITIAL_SLICK_ITEMS, slideItems.width()) });
            }

            function getItemsToShow() {
                var slickConfig = $scope.slickCtrl.options;
                var innerWidth = $window.innerWidth;
                return innerWidth < 768 ? slickConfig.SLIDES_TO_SHOW.MOBILE :
                    innerWidth >= 768 && innerWidth < 1024 ? slickConfig.SLIDES_TO_SHOW.TABLET :
                        innerWidth >= 1024 && innerWidth < 1280 ? slickConfig.SLIDES_TO_SHOW.TABLET_XL : slickConfig.SLIDES_TO_SHOW.DESKTOP;
            }

            function slickSlideSelected(event, quantity, isNext) {
                $timeout(function () {
                    moveSlides(isNext, quantity);
                });
            }
        }
    }
})();