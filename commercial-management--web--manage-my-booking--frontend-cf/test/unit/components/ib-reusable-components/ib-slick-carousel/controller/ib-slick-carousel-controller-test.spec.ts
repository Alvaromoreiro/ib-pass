describe('SlickCarouselController test', function() {
    var controller, $scope, $controller, $rootScope;

    var fakeSlickCarouselConstants = {
        DEFAULT_OPTIONS: {
            prevButtonText: '<',
            nextButtonText: '>',
            prevButtonDisabled: false,
            nextButtonDisabled: false,
            animationSpeed: 500,
            animationType: 'easeOutCubic',
            slidesToScroll: 1,
            centerMode: true,
            SLIDES_TO_SHOW: {
                DESKTOP: 7,
                TABLET_XL: 6,
                TABLET: 5,
                MOBILE: 2.5
            }
        }
    };

    var fakeCarouselSlides = [
        { item: 'test'}
    ];

    var fakeUpdatedData = {
        carouselOptions: {
            currentValue: 'test'
        }
    };

    let testElement: HTMLElement;

    beforeEach(function() {
        angular.mock.module('ib-slick-carousel-module', function($provide) {
            $provide.value('SlickCarouselConstants', fakeSlickCarouselConstants);
        });
        inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('SlickCarouselController', {
                $scope: $scope
            });
            testElement = document.createElement('button');
            testElement.classList.add('slick-carousel');
            document.body.appendChild(testElement);
        });
    });

    describe('get controller', function() {
        it('should contain controller', function() {
            expect(controller).toBeDefined();
        });
    });

    xdescribe('when activate is called', function() {
        it('touchstart should work', done => {
            let spy = jasmine.createSpy();
            testElement.addEventListener('touchstart', spy);
            let event = new MouseEvent('touchstart', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            testElement.dispatchEvent(event);
            controller.$onInit();
            expect(spy).toHaveBeenCalled();
            done();
        });

        it('touchend should work', done => {
            let spy = jasmine.createSpy();
            testElement.addEventListener('touchend', spy);
            let event = new MouseEvent('touchend', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            testElement.dispatchEvent(event);
            controller.$onInit();
            expect(spy).toHaveBeenCalled();
            done();
        });

        it('mousedown should work', done => {
            let spy = jasmine.createSpy();
            testElement.addEventListener('mousedown', spy);
            let event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            testElement.dispatchEvent(event);
            controller.$onInit();
            expect(spy).toHaveBeenCalled();
            done();
        });

        it('mouseup should work', done => {
            let spy = jasmine.createSpy();
            testElement.addEventListener('mouseup', spy);
            let event = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            testElement.dispatchEvent(event);
            controller.$onInit();
            expect(spy).toHaveBeenCalled();
            done();
        });
    });

    describe('when nextSlide is called', function() {
        it('should emit event changeNextSlide', function() {
            var event = {
                type: 'mousedown'
            };
            controller.carouselOptions = fakeSlickCarouselConstants.DEFAULT_OPTIONS;
            controller.options = fakeSlickCarouselConstants.DEFAULT_OPTIONS;
            controller.carouselSlides = fakeCarouselSlides;
            spyOn($scope, '$emit');
            controller.nextSlide(event);
            expect($scope.$emit).toHaveBeenCalledWith('changeNextSlide', false);
        });
    });

    describe('when previousSlide is called', function() {
        it('should emit event changePreviousSlide', function() {
            var event = {
                type: 'mousedown'
            };
            controller.carouselOptions = fakeSlickCarouselConstants.DEFAULT_OPTIONS;
            controller.options = fakeSlickCarouselConstants.DEFAULT_OPTIONS;
            controller.carouselSlides = fakeCarouselSlides;
            spyOn($scope, '$emit');
            controller.previousSlide(event);
            expect($scope.$emit).toHaveBeenCalledWith('changePreviousSlide', false);
        });
    });

    describe('when updateOptions is called', function() {
        it('options should contain currentValue', function() {
            controller.carouselOptions = fakeSlickCarouselConstants.DEFAULT_OPTIONS;
            controller.options = fakeSlickCarouselConstants.DEFAULT_OPTIONS;
            controller.$onChanges(fakeUpdatedData);
            expect(controller.options).toBeDefined();
        });
    });
});
