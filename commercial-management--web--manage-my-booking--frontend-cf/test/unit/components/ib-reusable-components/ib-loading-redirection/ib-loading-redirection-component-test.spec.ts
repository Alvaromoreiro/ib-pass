describe('ibLoadingRedirection test', function () {
    var controller, $controller, $scope, $rootScope, localStorageService, $window, $location;

    var fakeCommonsGetLoginInfoService = {
        checkCustomerStatus: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    var fakeCommonsModalService = {
        showWaitingModal: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy()
    };

    var fakeNewMainHeaderFacade = {
        initHeader: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-loading-redirection-module',  'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGetLoginInfoService', fakeCommonsGetLoginInfoService);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            var $window = {location: { reload: jasmine.createSpy('reload') }};
            $provide.value('$window', $window);
        });
        inject(function (_$rootScope_, _$componentController_, _localStorageService_, _$window_, _$location_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$componentController_;
            localStorageService = _localStorageService_;
            $window = _$window_;
            $location = _$location_;
            controller = $controller('ibLoadingRedirection', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('must be defined', function () {
            localStorageService.set('recoverUserFlow', 'test');
            controller.activate();
            expect(controller).toBeDefined();
        });
    });

    describe('onLogin called', function () {
        it('must call showWaitingModal', function () {
            controller.onLogin();
            expect(fakeCommonsModalService.showWaitingModal).toHaveBeenCalled();
        });
    });

    describe('onError called', function () {
        it('must call finishWaiting', function () {
            controller.onError();
            expect(fakeCommonsModalService.finishWaiting).toHaveBeenCalled();
        });
    });
});
