describe('iberiaFlightsCabinsDetail Test', function () {

    var $compile, scope, timeout, $window;


    beforeEach(function () {
        $window = {
            navigator: {},
            dispatchEvent: function () {}

        }
        angular.mock.module('ib-booking-fare-details-module', function ($provide) {
            $provide.value('$window',$window);
            
        });
        // module('ib-booking-fare-details-simple-module', function () {
        // });

        inject(function (_$compile_, $rootScope, $timeout) {
            $compile = _$compile_;
            timeout = $timeout;
            scope = $rootScope.$new();
        });
    });

    describe('When directive is used', function () {

        var html = '<div iberia-flights-cabins-detail data-box-select-radio="check-mobile"></div>';

        describe(', appVersion is Trident/', function () {

            beforeEach(function () {
                $window.navigator = $.extend({}, navigator, {
                    appVersion: 'VTrident/'
                });
            });

            xit(' and click event is triggered', function (done) {
                var element = angular.element(html);
                var myWindow = angular.element($window);
                spyOn(angular, 'element').and.callFake(function (selector) {
                    if (angular.isString(selector)) {
                        return element;
                    }

                    return myWindow;
                });
                spyOn(myWindow, 'trigger');
                $compile(element)(scope);

                scope.$digest();
                timeout.flush();

                element.click();

                //expect(myWindow.trigger).toHaveBeenCalledWith('resize');
                done();
            });

            xit(' and touchstart event is triggered', function (done) {
                var element = angular.element(html);
                var myWindow = angular.element($window);
                spyOn(angular, 'element').and.callFake(function (selector) {
                    if (angular.isString(selector)) {
                        return element;
                    }

                    return myWindow;
                });
                spyOn(myWindow, 'trigger');
                $compile(element)(scope);

                scope.$digest();
                timeout.flush();

                element.trigger('touchstart');

                //expect(myWindow.trigger).toHaveBeenCalledWith('resize');
                done();
            });

        });

        describe(', userAgent is MSIE', function () {

            beforeEach(function () {
                $window.navigator = $.extend({}, navigator, {
                    userAgent: 'MSIE'
                });
            });

            xit(' and click event is triggered', function (done) {
                var element = angular.element(html);
                var myWindow = angular.element($window);
                spyOn(angular, 'element').and.callFake(function (selector) {
                    if (angular.isString(selector)) {
                        return element;
                    }

                    return myWindow;
                });
                spyOn(myWindow, 'trigger');
                $compile(element)(scope);

                scope.$digest();
                timeout.flush();

                element.click();

                //expect(myWindow.trigger).toHaveBeenCalledWith('resize');
                done();
            });

            xit(' and touchstart event is triggered', function (done) {
                var element = angular.element(html);
                var myWindow = angular.element($window);
                spyOn(angular, 'element').and.callFake(function (selector) {
                    if (angular.isString(selector)) {
                        return element;
                    }

                    return myWindow;
                });
                spyOn(myWindow, 'trigger');
                $compile(element)(scope);

                scope.$digest();
                timeout.flush();

                element.trigger('touchstart');

                //expect(myWindow.trigger).toHaveBeenCalledWith('resize');
                done();
            });

        });

        describe(', userAgent is not MSIE and appVersion is not Trident/', function () {

            beforeEach(function () {
                $window.navigator = $.extend({}, navigator, {
                    userAgent: 'AnotherNav',
                    appVersion: 'AnotherVersion'
                });
            });

            it(' and click event is triggered', function (done) {
                var element = angular.element(html);
                spyOn(angular, 'element').and.returnValue(element);
                spyOn($window, 'dispatchEvent');
                $compile(element)(scope);

                scope.$digest();
                timeout.flush();

                element.click();

                expect($window.dispatchEvent).toHaveBeenCalled();
                done();
            });

            it(' and touchstart event is triggered', function (done) {
                var element = angular.element(html);
                spyOn(angular, 'element').and.returnValue(element);
                spyOn($window, 'dispatchEvent');
                $compile(element)(scope);

                scope.$digest();
                timeout.flush();

                element.trigger('touchstart');

                expect($window.dispatchEvent).toHaveBeenCalled();
                done();
            });

        });
    });
});