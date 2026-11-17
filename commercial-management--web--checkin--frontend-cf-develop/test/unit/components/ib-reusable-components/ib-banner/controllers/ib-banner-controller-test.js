describe('IbBookingBannerController', function () {

    var $controller, $rootScope, $scope, $localStorageService, controller, window;

    var fakeWindows = { innerWidth: 0 };

    var fakeComponentUtils =  {
        'initAddOn' : jasmine.createSpy('initAddOn').and.callFake(function () {
            return true;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-banner-module', 'LocalStorageModule', function ($provide) {
            $provide.value('ComponentUtils', fakeComponentUtils);
            $provide.value('$window', fakeWindows);
        });
        inject(function (_$controller_, _$rootScope_, _localStorageService_, $window) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $localStorageService = _localStorageService_;
            window = $window;
            controller = $controller('IbBookingBannerController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $localStorageService: $localStorageService
            });
        });
    });

    describe('when activate() is called', function() {
        it('call calculateAddOnType()', function() {
            controller.$onInit();
            expect(controller.addOnType).toBe(1);
        });
    });

    describe('when initAddOn() is called', function() {
        it('call initAddOn from ComponentUtils', function() {
            controller.initAddOn();
            expect(fakeComponentUtils.initAddOn).toHaveBeenCalled();
        });
    });

    describe('when calculateAddOnType() is called', function() {
        it('width between 768 and 1024', function() {
            window.innerWidth = 1000;
            controller.calculateAddOnType();
            expect(controller.addOnType).toBe(0);
        });
        it('width less than 768', function() {
            window.innerWidth = 500;
            controller.calculateAddOnType();
            expect(controller.addOnType).toBe(1);
        });
        it('width between 1024 and 1280', function() {
            window.innerWidth = 1200;
            controller.calculateAddOnType();
            expect(controller.addOnType).toBe(3);
        });
        it('width +1280', function() {
            window.innerWidth = 1500;
            controller.calculateAddOnType();
            expect(controller.addOnType).toBe(2);
        });
    });
});