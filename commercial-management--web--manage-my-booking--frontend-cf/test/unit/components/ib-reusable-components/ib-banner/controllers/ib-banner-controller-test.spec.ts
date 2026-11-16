describe('IbBookingBannerController test', function() {

    var controller, $scope, $rootScope, localStorage, $window, $controller;

    var fakeComponentsUtils = {
        'initAddOn': jasmine.createSpy('initAddOn').and.callFake(angular.noop)
    };

    var fakeWindow = {
        'innerWidth': 0
    };

    beforeEach(function() {
        angular.mock.module('ib-reusable-components-module', 'LocalStorageModule', function($provide) {
            $provide.value('ComponentsUtils', fakeComponentsUtils);
            $provide.value('$window', fakeWindow);
        });

        inject(function(_$controller_, _$rootScope_, _localStorageService_, _$window_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            $window = _$window_;
            controller = $controller('IbBookingBannerController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });

    });

    describe('When activate is called -> calculateAddOnType function is called', function() {
        it('width >= 768 && width < 1024', function(done) {
            $window.innerWidth = 1000;
            controller.$onInit();
            expect(controller.addOnType).toBe(0);
            done();
        });

        it('width < 768', function(done) {
            $window.innerWidth = 500;
            controller.$onInit();
            expect(controller.addOnType).toBe(1);
            done();
        });

        it('width >= 1024 && width < 1280', function(done) {
            $window.innerWidth = 1200;
            controller.$onInit();
            expect(controller.addOnType).toBe(3);
            done();
        });

        it('width >= 1280', function(done) {
            $window.innerWidth = 1500;
            controller.$onInit();
            expect(controller.addOnType).toBe(2);
            done();
        });
    });

    describe('When initAddOn is called', function() {
        it('initAddOn from componentUtils is called', function(done) {
            controller.initAddOn();
            done();
        });
    });
});
