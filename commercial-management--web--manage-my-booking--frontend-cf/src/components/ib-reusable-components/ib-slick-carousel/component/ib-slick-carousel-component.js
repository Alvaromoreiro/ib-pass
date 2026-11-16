(function () {
    'use strict';

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
                carouselOptions: '<',
                carouselSlides : '<',
                carouselIndex : '<',
                provider: '<'
            },
            transclude: true,
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-slick-carousel-view.html';
            }]
        });

})();