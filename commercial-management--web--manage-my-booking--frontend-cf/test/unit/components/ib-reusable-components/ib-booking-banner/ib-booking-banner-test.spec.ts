describe('IbBookingBannerController test', function () {
    var controller, $scope, $rootScope, localStorage;

    beforeEach(function () {
        angular.mock.module('ib-banner-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingDashboardConstants', {});
            $provide.value('MmBModalService', {});
            $provide.value('ComponentsUtils', {});
            $provide.value('MmBModalServiceProvider', {});
        });
        inject(function (_$rootScope_, $controller, _localStorageService_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            controller = $controller('IbBookingBannerController', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('its create correctly', function () {
            expect(controller.$onInit).toBeDefined();
        });
    });
});
