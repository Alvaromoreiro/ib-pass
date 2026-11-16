describe('ibRangesliderController test', function () {
    var $scope, controller, $controller, $rootScope;

    beforeEach(function () {
        angular.mock.module('ib-rangeslider', function () { });
        inject(function(_$controller_, _$rootScope_, _$filter_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('ibRangesliderController', { $scope: $scope });
        });
    });

    describe('ibRangesliderController', function () {
        it('its should set correct value properties', function () {
            expect(controller).toBeDefined();
            expect(controller.filter_price.options.translate(10)).toBe('10€');
            expect(controller.filter_hours.options.translate(5)).toBe('05:00');
            expect(controller.filter_hours.options.translate(10)).toBe('10:00');
        });
    });
});
