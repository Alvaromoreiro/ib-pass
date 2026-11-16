(function () {


    // Usage: <ib-slick-carousel></ib-slick-carousel>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-slick-carousel-module')
        .component('ibSlickCarousel', {
            controller: 'SlickCarouselController',
            controllerAs: 'slickCtrl',
            bindings: {
                options: '=',
                carouselSlides : '<',
                carouselIndex : '<'
            },
            transclude: true,
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-slick-carousel-view.html';
            }]
        });

})();