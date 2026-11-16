describe('ibCarousel Test', function () {
    var el, elm, template, scope, $timeout, $window;

    template = '<div class="slick-carousel" ib-carousel>' +
        '<button id="SLICK_PREV_BUTTON_{{::slickCtrl.carouselIndex}}" class="ib-date-carousel__button-prev" disabled="false" type="button" aria-label="Previous" tabindex="0" role="button"</button>'
        '<div id="SLICK_CARROUSEL_LIST_{{::slickCtrl.carouselIndex}}" class="slick-carousel-list" ng-transclude></div>' +
        '<button id="SLICK_NEXT_BUTTON_{{::slickCtrl.carouselIndex}}" class="ib-date-carousel__button-next" disabled="false" type="button" aria-label="Next" tabindex="0" role="button"</button>'
    '</div>';

    beforeEach(function () {
        angular.mock.module('ib-slick-carousel-module')
    });

    beforeEach(inject(function ($rootScope, $compile, _$timeout_, _$window_) {
        $timeout = _$timeout_;
        $window = _$window_;
        scope = $rootScope.$new();
        elm = angular.element(template);
        scope.slickCtrl = {
            carouselIndex : ['_AWS'],
            carouselSlides: [ { firstItem: 'firstItem' }, { lastItem: 'lastItem' }],
            options: {
                centerMode: true,
                SLIDES_TO_SHOW: {
                    MOBILE: 5,
                    TABLET: 10,
                    TABLET_XL: 15,
                    DESKTOP: 20
                },
                slidesToScroll: 10
            }
        };
        el = $compile(elm)(scope);
        scope.$apply();
    }));

    describe('When ibCarousel is submitted', function () {
        it('Check the directive', function (done) {
            scope.$broadcast('updateCalendarSlides');
            scope.$broadcast('slickNextElement');
            scope.$broadcast('slickPreviousElement');
            scope.$broadcast('slickSlideSelected');
            $timeout.flush();
            scope.$digest();
            expect(el[0].firstElementChild.disabled).toEqual(true);
            expect(el[0].lastElementChild.disabled).toEqual(true);
            done();
        });
    });
});
