(function () {


    angular.module('ib-slick-carousel-module').constant('SlickCarouselConstants', {
        DEFAULT_OPTIONS: {
            prevButtonText: '<',
            nextButtonText: '>',
            prevButtonDisabled: false,
            nextButtonDisabled: false,
            prevButtonHidden: false,
            nextButtonHided: false,
            animationSpeed: 500,
            animationType: 'easeOutCubic',
            slidesToScroll: 1,
            centerMode: true,
            SLIDES_TO_SHOW: {
                DESKTOP: 7,
                TABLET_XL: 6,
                TABLET: 5,
                MOBILE: 3
            }
        }
    });
})();