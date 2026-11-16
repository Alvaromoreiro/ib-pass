describe('ibMmbCalendarRibbons test', () =>  {

    let $componentController, $rootScope, $scope, controller, localStorageService, $timeout;

    let fakeVoluntaryChangesConstants = {
        'SLICK_STATUS': {
            'LOADING': 'LOADING',
            'NOT_AVAILABLE': 'NOT_AVAILABLE',
            'AVAILABLE': 'AVAILABLE',
            'DISABLED': 'DISABLED'
        },
        'CARROUSEL_FLIGHT_SELECTED': {
            'OUTBOUND_FLIGHT': 0,
            'RETURN_FLIGHT': 1
        },
        'daysAfter': 3,
        'daysBefore': 3,
        'WEEKDAYS': {
            1: 'WEEKDAY_MONDAY',
            2: 'WEEKDAY_TUESDAY',
            3: 'WEEKDAY_WEDNESDAY',
            4: 'WEEKDAY_THURSDAY',
            5: 'WEEKDAY_FRYDAY',
            6: 'WEEKDAY_SATURDAY',
            0: 'WEEKDAY_SUNDAY'
        },
        'MONTHS': {
            0: 'MONTH_JANUARY',
            1: 'MONTH_FEBRUARY',
            2: 'MONTH_MARCH',
            3: 'MONTH_APRIL',
            4: 'MONTH_MAY',
            5: 'MONTH_JUNE',
            6: 'MONTH_JULY',
            7: 'MONTH_AUGUST',
            8: 'MONTH_SEPTEMBER',
            9: 'MONTH_OCTOBER',
            10: 'MONTH_NOVEMBER',
            11: 'MONTH_DECEMBER'
        }
    };

    let fakeVoluntaryChangesTransformer = {
        'getDataAvailabilityTransformed' : jasmine.createSpy('getDataAvailabilityTransformed').and.callFake(() =>  {
            return 'test';
        }),
        'generateRibbonData' : jasmine.createSpy('generateRibbonData').and.callFake(() =>  {
            return fakeRibbonData;
        }),
    };

    let fakeCalendarData = require('@test/mocks/storage/calendar-data-mock.json');

    let fakeCurrentSlide = [
        {
            'serviceDate': '2019-08-19',
            'slidePosition': 27,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 19,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-19T00:00:00+02:00',
                'formatedDate': '19/08/2019'
            },
            'state': 'AVAILABLE'
        },
        {
            'serviceDate': '2019-08-20',
            'slidePosition': 28,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_TUESDAY',
                'day': 20,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-20T00:00:00+02:00',
                'formatedDate': '20/08/2019'
            },
            'state': 'AVAILABLE'
        },
        {
            'serviceDate': '2019-08-21',
            'slidePosition': 29,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_WEDNESDAY',
                'day': 21,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-21T00:00:00+02:00',
                'formatedDate': '21/08/2019'
            },
            'state': 'AVAILABLE'
        },
        {
            'serviceDate': '2019-08-22',
            'slidePosition': 30,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_THURSDAY',
                'day': 22,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-22T00:00:00+02:00',
                'formatedDate': '22/08/2019'
            },
            'state': 'AVAILABLE'
        },
        {
            'serviceDate': '2019-08-23',
            'slidePosition': 31,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_FRYDAY',
                'day': 23,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-23T00:00:00+02:00',
                'formatedDate': '23/08/2019'
            },
            'state': 'AVAILABLE'
        },
        {
            'serviceDate': '2019-08-24',
            'slidePosition': 32,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_SATURDAY',
                'day': 24,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-24T00:00:00+02:00',
                'formatedDate': '24/08/2019'
            },
            'state': 'AVAILABLE'
        },
        {
            'serviceDate': '2019-08-25',
            'slidePosition': 33,
            'date': {
                'dateTime': '',
                'weekDay': 'WEEKDAY_SUNDAY',
                'day': 25,
                'monthNumber': 8,
                'month': 'MONTH_AUGUST',
                'year': 2019,
                'originalDate': '2019-08-25T00:00:00+02:00',
                'formatedDate': '25/08/2019'
            },
            'state': 'AVAILABLE'
        }
    ];

    let fakeVolChangeData = require('@test/mocks/storage/vol-change-data-mock.json');

    let fakeRibbonData = require('@test/mocks/storage/ribbon-data-mock.json');

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/'
    };

    beforeEach(() =>  {
        angular.mock.module('ib-Mmb-calendar-ribbons-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('VoluntaryChangesConstants', fakeVoluntaryChangesConstants);
            $provide.value('VoluntaryChangesTransformer', fakeVoluntaryChangesTransformer);
        });

        inject((_$rootScope_, _$componentController_, _$timeout_, _localStorageService_) => {
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            localStorageService = _localStorageService_;

            controller = $componentController('ibMmbCalendarRibbons', {
                $scope: $scope,
                $timeout: $timeout,
                localStorageService: _localStorageService_
            });

            controller.carouselOptions = {
                prevButtonDisabled: '',
                nextButtonDisabled: ''
            };
        });

        $rootScope.$digest();
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-Mmb-calendar-ribbons-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-Mmb-calendar-ribbons></ib-Mmb-calendar-ribbons>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('when $onInit() is called', () =>  {
        it('set correct variables to indicate currentSlides and initialSlideIndex', () =>  {
            controller.calendarData = fakeCalendarData;
            controller.$onInit();
            $rootScope.$digest();
            // expect(angular.toJson(controller.currentSlides)).toEqual(angular.toJson(fakeCurrentSlide));
            // expect(angular.toJson(controller.initialSlideIndex)).toEqual('29');
        });

        it('set currentSlides if currentSlides array length is 0', () =>  {
            controller.calendarData = fakeCalendarData;
            controller.calendarData.currentSlides = [];
            controller.$onInit();
            $rootScope.$digest();
            // expect(angular.toJson(controller.currentSlides)).toEqual(angular.toJson(fakeCurrentSlide));
            // expect(angular.toJson(controller.initialSlideIndex)).toEqual('29');
        });

        it('If not exist calendar data should do nothing only activated is called', () =>  {
            controller.calendarData = null;
            controller.$onInit();
        });
    });

    describe('when searchSlideAvailability() is called', () =>  {
        const sameCase = (initialSlideIndex, slidesNumber, done) => {
            let fakeCalendar = angular.copy(fakeCalendarData);
            let fakeSlide = angular.copy(fakeCurrentSlide);
            spyOn($rootScope,'$broadcast');
            spyOn(controller,'addPreviousCalendarSlides');
            spyOn(controller,'addNextCalendarSlides');
            controller.initialSlideIndex = initialSlideIndex;
            controller.calendarData = fakeCalendar;
            controller.currentSlides = fakeSlide;
            localStorageService.set('volChangeData', fakeVolChangeData);
            controller.searchSlideAvailability(fakeCalendar.slides[slidesNumber]);
            $rootScope.$digest();
            expect($rootScope.$broadcast).toHaveBeenCalledWith( 'cleanSortedSelection' );
            const offsetSlides = fakeCalendar.currentInitialSlide - fakeCalendar.slides[slidesNumber].slidePosition;
            const isNext = offsetSlides < 0;
            if (isNext) {
                expect(controller.addNextCalendarSlides).toHaveBeenCalled();
            } else {
                expect(controller.addPreviousCalendarSlides).toHaveBeenCalled();
            }
            done();
        };
        it('Should set data of model correctly and is previous', (done) =>  {
            sameCase(20, 12, done);
        });

        it('Should set data of model correctly and is next', (done) =>  {
            sameCase(27, 32, done);
        });
    });

    describe('when setSlide () is called', () =>  {
        const sameCase = (setSlidePosition, done) => {
            let fakeCalendar = angular.copy(fakeCalendarData);
            let fakeSlide = angular.copy(fakeCurrentSlide);
            spyOn(controller,'addPreviousCalendarSlides');
            spyOn(controller,'addNextCalendarSlides');
            controller.animationRunning = false;
            controller.id = 0;
            controller.loadingData = false;
            controller.initialSlideIndex = 20;
            controller.calendarData = fakeCalendar;
            controller.currentSlides = fakeSlide;
            $rootScope.$broadcast('setSlide', {slide: {slidePosition: setSlidePosition}, index: 0});
            $rootScope.$digest();
            const offsetSlides = fakeCalendar.currentInitialSlide - setSlidePosition;
            const isNext = offsetSlides < 0;
            if (isNext) {
                expect(controller.addNextCalendarSlides).toHaveBeenCalled();
            } else {
                expect(controller.addPreviousCalendarSlides).toHaveBeenCalled();
            }
            done();
        };
        it('Should set slide with slidePosition 0', (done) =>  {
            sameCase(0, done);
        });

        it('Should set slide with slidePosition 31', (done) =>  {
            sameCase(32, done);
        });
    });

    describe('when nextSlide() is called', () =>  {
        it('Should set data of model correctly when event call this', () =>  {
            let fakeCalendar = angular.copy(fakeCalendarData);
            let fakeSlide = angular.copy(fakeCurrentSlide);
            spyOn($scope,'$emit');
            spyOn($scope,'$broadcast');
            controller.initialSlideIndex = 27;
            controller.calendarData = fakeCalendar;
            controller.currentSlides = fakeSlide;
            localStorageService.set('volChangeData', fakeVolChangeData);
            $rootScope.$broadcast('changeNextSlide', fakeCalendar.slides[7]);
            $timeout.flush();
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith('nextSlideDate', true );
            expect($scope.$broadcast).toHaveBeenCalledWith( 'slickNextElement' );
        });

        it('When not exist data event should set data of model correctly when event call this', () =>  {
            let fakeCalendar = angular.copy(fakeCalendarData);
            let fakeSlide = angular.copy(fakeCurrentSlide);
            spyOn($scope,'$emit');
            controller.initialSlideIndex = 27;
            controller.calendarData = fakeCalendar;
            controller.currentSlides = fakeSlide;
            localStorageService.set('volChangeData', fakeVolChangeData);
            $rootScope.$broadcast('changeNextSlide');
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith('nextSlideDate', true );
        });

    });

    describe('when previousSlide() is called', () =>  {
        it('Should set data of model correctly when event call this', () =>  {
            let fakeCalendar = angular.copy(fakeCalendarData);
            let fakeSlide = angular.copy(fakeCurrentSlide);
            spyOn($scope,'$emit');
            spyOn($scope,'$broadcast');
            controller.animationRunning = false;
            controller.initialSlideIndex = 27;
            controller.calendarData = fakeCalendar;
            controller.currentSlides = fakeSlide;
            localStorageService.set('volChangeData', fakeVolChangeData);
            $rootScope.$broadcast('changePreviousSlide', fakeCalendar.slides[7]);
            $timeout.flush();
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith('nextSlideDate', false );
            expect($scope.$broadcast).toHaveBeenCalledWith( 'slickPreviousElement' );
        });

        it('When not exist data event should set data of model correctly when event call this', () =>  {
            let fakeCalendar = angular.copy(fakeCalendarData);
            let fakeSlide = angular.copy(fakeCurrentSlide);
            spyOn($scope,'$emit');
            controller.animationRunning = false;
            controller.initialSlideIndex = 27;
            controller.calendarData = fakeCalendar;
            controller.currentSlides = fakeSlide;
            localStorageService.set('volChangeData', fakeVolChangeData);
            $rootScope.$broadcast('changePreviousSlide');
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith('nextSlideDate', false);
        });

    });

    describe('when nextSlickAnimationEnds() is called', () =>  {
        it('Should remove next calendar Slides', () =>  {
            controller.currentSlides = ['a', 'b', 'c'];
            controller.calendarData = {};
            controller.SLIDES_TO_SHOW = 2;
            $rootScope.$broadcast('nextSlickAnimationEnds',1);
            $rootScope.$digest();
            expect(controller.calendarData.currentSlides).toEqual(['b', 'c' ]);
        });

        it('when value of event is lower to 0 not should remove next calendar Slides', () =>  {
            controller.currentSlides = ['a', 'b', 'c'];
            controller.calendarData = {};
            $rootScope.$broadcast('nextSlickAnimationEnds', -1);
            $rootScope.$digest();
            expect(controller.calendarData.currentSlides).toEqual(['a', 'b', 'c']);
        });

    });

    describe('when previousSlickAnimationEnds() is called', () =>  {
        it('Should remove previous calendar Slides', () =>  {
            controller.currentSlides = ['a', 'b', 'c'];
            controller.calendarData = {};
            controller.SLIDES_TO_SHOW = 2;
            $rootScope.$broadcast('previousSlickAnimationEnds',1);
            $rootScope.$digest();
            expect(controller.calendarData.currentSlides).toEqual([ 'a', 'b' ]);
            expect(controller.animationRunning).toEqual(false);
        });

        it('when value of event is lower to 0 not should previous next calendar Slides', () =>  {
            controller.currentSlides = ['a', 'b', 'c'];
            controller.calendarData = {};
            $rootScope.$broadcast('previousSlickAnimationEnds', -1);
            $rootScope.$digest();
            expect(controller.calendarData.currentSlides).toEqual(['a', 'b', 'c']);
            expect(controller.animationRunning).toEqual(false);
        });

    });

    describe('when finishLoadingSlides() is called', () =>  {
        it('Should set options of carrousel correctly', () =>  {
            $rootScope.$broadcast('finishLoadingSlides');
            expect(controller.carouselOptions.prevButtonDisabled).toEqual(false);
            expect(controller.carouselOptions.nextButtonDisabled).toEqual(false);
        });
    });

    describe('when disableButtonSlides() is called', () =>  {

        it('Should set options of carrousel correctly', () =>  {
            $rootScope.$broadcast('disableButtonSlides');
            expect(controller.carouselOptions.prevButtonDisabled).toEqual(true);
            expect(controller.carouselOptions.nextButtonDisabled).toEqual(true);
        });
    });

    describe('when resetCalendarData() is called', () =>  {
        it('Should call activate function', (done) =>  {
            spyOn(controller,'$onInit');
            let fakeCalendar = angular.copy(fakeCalendarData);
            controller.calendarData = fakeCalendar;
            controller.index = 1;
            $rootScope.$broadcast('changeCurrentSelectedIndex', 1);
            expect(controller.$onInit).toHaveBeenCalled();
            done()
        });

        it('If index model is distinct of de index parameter not should call activate function', (done) =>  {
            spyOn(controller,'$onInit');
            controller.index = 1;
            $rootScope.$broadcast('changeCurrentSelectedIndex', 0);
            expect(controller.$onInit).not.toHaveBeenCalled();
            done();
        });
    });
});
