describe('FlightsDatesController Test', function () {
    var scope, controller, timeout;
    var mocks, fakeBookingAvailabilityConstants;

    // jasmine.getJSONFixtures().clearCache();
    // jasmine.getJSONFixtures().fixturesPath = 'base/test/mocks';
    // fakeBookingAvailabilityConstants = getJSONFixture('./constants/BookingAvailabilityConstants-mock.json');

    fakeBookingAvailabilityConstants = {
        SLICK_STATUS:{
            LOWER_END_RIBBON_DISABLED: '',
            UPPER_END_RIBBON_DISABLED: '',
            LOWER_END_RIBBON_WARN: '',
            UPPER_END_RIBBON_WARN: ''
        }
    }

    mocks = function () {
        this.CurrencyService = {};
        this.$filter = jasmine.createSpy('$filter').and.callFake(function (filter) {
            var filterFunc = function () {
                return [];
            };
            switch (filter) {
                case 'translate':
                    filterFunc = function () {
                        return 'Translated Text';
                    };
                    break;
                default:
                    break;
            }

            return filterFunc;
        });
        this.BookingAvailabilityConstants = fakeBookingAvailabilityConstants;
    }

    const elementMock = [
        {
            dispatchEvent: () => { },
            addEventListener: () => {}
        }
        
    ]
    beforeEach(function () {
        var mock = new mocks();
        angular.mock.module('ib-booking-flights-dates-module', 'ib-commons-utils-module', function ($provide) {
            $provide.value('CurrencyService', mock.CurrencyService);
            $provide.value('$filter', mock.$filter);
            $provide.value('BookingAvailabilityConstants', mock.BookingAvailabilityConstants);
            $provide.value('$element', elementMock)
        });

        inject(function ($controller, $rootScope, $timeout) {
            scope = $rootScope.$new();
            timeout = $timeout;

            controller = $controller('FlightsDatesController', {
                '$scope': scope
            });

            scope.$digest();
        });

    });

    describe('When activate is called', function () {
        it(' with currentSlides filled', function (done) {
            inject(function () {
                controller.calendarData = {
                    currentSlides: [{}],
                    currentInitialSlide: 0,
                    slides: []
                };
                controller.$onInit();
            });

            expect(controller.currentSlides).toEqual([{}]);
            expect(controller.initialSlideIndex).toEqual(0);
            expect(controller.carouselOptions).toEqual({nextButtonHidden: false,prevButtonHidden: false,prevButtonDisabled: false,nextButtonDisabled: false});
            done();
        });

        it(' with currentSlides empty', function (done) {
            inject(function () {
                controller.calendarData = {
                    currentSlides: [],
                    currentInitialSlide: 0,
                    slides: [{
                        name: 'slide 1'
                    }, {
                        name: 'slide 2'
                    }]
                };
                controller.$onInit();
            });

            expect(controller.currentSlides).toEqual([{
                name: 'slide 1'
            }, {
                name: 'slide 2'
            }]);
            expect(controller.initialSlideIndex).toEqual(0);
            expect(controller.carouselOptions).toEqual({nextButtonHidden: false,prevButtonHidden: false,prevButtonDisabled: false,nextButtonDisabled: false});
            done();
        });
    });


    describe('When searchSlideAvailability  is called', function () {
        it(' and change to lesser position.', function (done) {
            var slide;
            controller.initialSlideIndex = 2;
            controller.currentSlides = [];
            controller.calendarData = {
                currentInitialSlide: 2,
                slides: [{
                    name: 'slide-new-1'
                }, {
                    name: 'slide-new-2'
                }, {
                    name: 'slide-new-3'
                }]
            };

            slide = {
                slidePosition: 0
            };
            spyOn(scope, '$broadcast');
            spyOn(scope, '$emit');

            controller.searchSlideAvailability(slide);

            // expect(scope.$broadcast).toHaveBeenCalledWith('slickSlideSelected', 2, false);
            // expect(scope.$emit).toHaveBeenCalledWith('slideSelected', slide, false);
            expect(controller.calendarData.selectedSlide).toBe(slide.slidePosition);
            // expect(controller.currentSlides).toEqual([{
            //     name: 'slide-new-1'
            // }, {
            //     name: 'slide-new-2'
            // }]);
            // expect(controller.initialSlideIndex).toBe(0);
            done();
        });

        it(' and change to greater position.', function (done) {
            var i, slide;
            controller.initialSlideIndex = 2;
            controller.currentSlides = [];
            controller.calendarData = {
                currentInitialSlide: 0,
                slides: []
            };
            for (i = 1; i <= 12; i++) {
                controller.calendarData.slides.push({
                    name: 'slide-new-' + i
                });
            }

            slide = {
                slidePosition: 2
            };
            spyOn(scope, '$broadcast');
            spyOn(scope, '$emit');

            controller.searchSlideAvailability(slide);

            expect(scope.$broadcast).toHaveBeenCalledWith('slickSlideSelected', 2, true);
            expect(scope.$emit).toHaveBeenCalledWith('slideSelected', slide, true);
            expect(controller.calendarData.selectedSlide).toBe(slide.slidePosition);
            // expect(controller.currentSlides).toEqual([{
            //     name: 'slide-new-10'
            // }, {
            //     name: 'slide-new-11'
            // }]);
            expect(controller.initialSlideIndex).toBe(4);
            done();
        });
    });

    describe('When changeNextSlide is emitted', function () {
        it(' with swipeEvent false', function (done) {
            var i;
            controller.initialSlideIndex = 0;
            controller.currentSlides = [];
            controller.calendarData = {
                slides: []
            };
            for (i = 1; i <= 10; i++) {
                controller.calendarData.slides.push({
                    name: 'slide-new-' + i
                });
            }

            spyOn(scope, '$emit').and.callThrough();

            scope.$emit('changeNextSlide', false);

            expect(scope.$emit).toHaveBeenCalledWith('nextSlideDate', true);
            // expect(controller.currentSlides).toEqual([{
            //     name: 'slide-new-8'
            // }]);
            expect(controller.initialSlideIndex).toBe(1);
            done();
        });

        it(' with swipeEvent true', function (done) {
            var i;
            controller.initialSlideIndex = 0;
            controller.currentSlides = [];
            controller.calendarData = {
                slides: []
            };
            for (i = 1; i <= 10; i++) {
                controller.calendarData.slides.push({
                    name: 'slide-new-' + i
                });
            }

            spyOn(scope, '$emit').and.callThrough();
            spyOn(scope, '$broadcast').and;

            scope.$emit('changeNextSlide', true);
            timeout.flush();

            expect(scope.$emit).toHaveBeenCalledWith('nextSlideDate', true);
            expect(scope.$broadcast).toHaveBeenCalledWith('slickNextElement');
            // expect(controller.currentSlides).toEqual([{
            //     name: 'slide-new-8'
            // }]);
            expect(controller.initialSlideIndex).toBe(1);
            done();
        });
    });

    describe('When changePreviousSlide is emitted', function () {

        it(' with swipeEvent false', function (done) {
            var i;
            controller.initialSlideIndex = 1;
            controller.currentSlides = [];
            controller.calendarData = {
                slides: []
            };
            for (i = 1; i <= 10; i++) {
                controller.calendarData.slides.push({
                    name: 'slide-new-' + i
                });
            }

            spyOn(scope, '$emit').and.callThrough();

            scope.$emit('changePreviousSlide', false);

            expect(scope.$emit).toHaveBeenCalledWith('nextSlideDate', false);
            expect(controller.currentSlides).toEqual([{
                name: 'slide-new-1'
            }]);
            expect(controller.initialSlideIndex).toBe(0);
            done();
        });

        it(' with swipeEvent true', function (done) {
            var i;
            controller.initialSlideIndex = 1;
            controller.currentSlides = [];
            controller.calendarData = {
                slides: []
            };
            for (i = 1; i <= 10; i++) {
                controller.calendarData.slides.push({
                    name: 'slide-new-' + i
                });
            }

            spyOn(scope, '$emit').and.callThrough();
            spyOn(scope, '$broadcast').and;

            scope.$emit('changePreviousSlide', true);
            timeout.flush();

            expect(scope.$emit).toHaveBeenCalledWith('nextSlideDate', false);
            expect(scope.$broadcast).toHaveBeenCalledWith('slickPreviousElement');
            expect(controller.currentSlides).toEqual([{
                name: 'slide-new-1'
            }]);
            expect(controller.initialSlideIndex).toBe(0);
            done();
        });
    });

    describe('When nextSlickAnimationEnds is emitted', function () {
        it(' and last slide is last item', function (done) {

            controller.currentSlides = [{
                name: 'slide-2',
                lastItem: true
            }, {
                name: 'slide-1',
                lastItem: true
            }];
            controller.carouselOptions = {
                nextButtonHidden: false,
                prevButtonHidden: false
            }

            scope.$emit('nextSlickAnimationEnds', 1);

            expect(controller.currentSlides).toEqual([{
                name: 'slide-1',
                lastItem: true
            }]);
            done();
        });

        it(' and last slide is not last item', function (done) {

            controller.currentSlides = [{
                name: 'slide-2',
                lastItem: false
            }, {
                name: 'slide-1',
                lastItem: false
            }];
            controller.carouselOptions = {
                prevButtonDisabled: true,
                nextButtonDisabled: true
            };

            scope.$emit('nextSlickAnimationEnds', 1);

            expect(controller.currentSlides).toEqual([{
                name: 'slide-1',
                lastItem: false
            }]);
            expect(controller.carouselOptions.prevButtonDisabled).toBe(false);
            expect(controller.carouselOptions.nextButtonDisabled).toBe(false);
            done();
        });
    });

    describe('When previousSlickAnimationEnds is emitted', function () {
        it(' and last slide is first item', function (done) {

            controller.currentSlides = [{
                name: 'slide-2',
                firstItem: true
            }, {
                name: 'slide-1',
                firstItem: true
            }];

            controller.carouselOptions = {
                nextButtonHidden: false,
                prevButtonHidden: false
            }

            scope.$emit('previousSlickAnimationEnds', 1);

            expect(controller.currentSlides).toEqual([{
                name: 'slide-2',
                firstItem: true
            }]);
            done();
        });

        it(' and last slide is not first item', function (done) {

            controller.currentSlides = [{
                name: 'slide-2',
                firstItem: false
            }, {
                name: 'slide-1',
                firstItem: false
            }];
            controller.carouselOptions = {
                prevButtonDisabled: true,
                nextButtonDisabled: true
            };

            scope.$emit('previousSlickAnimationEnds', 1);

            expect(controller.currentSlides).toEqual([{
                name: 'slide-2',
                firstItem: false
            }]);
            expect(controller.carouselOptions.prevButtonDisabled).toBe(false);
            expect(controller.carouselOptions.nextButtonDisabled).toBe(false);
            done();
        });
    });

    describe('When finishLoadingSlides is emitted', function () {
        it(' but dont generate evaluable change', function (done) {

            scope.$emit('finishLoadingSlides');

            done();
        });
    });

    describe('When disableButtonSlides is emitted', function () {
        it(' with true param', function (done) {

            controller.carouselOptions = {};

            scope.$emit('disableButtonSlides', true);

            expect(controller.carouselOptions.prevButtonDisabled).toBe(true);
            expect(controller.carouselOptions.nextButtonDisabled).toBe(true);
            done();
        });

        it(' with false param', function (done) {

            controller.carouselOptions = {};

            scope.$emit('disableButtonSlides', false);

            expect(controller.carouselOptions.prevButtonDisabled).toBe(false);
            expect(controller.carouselOptions.nextButtonDisabled).toBe(false);
            done();
        });
    });

});