describe('ViewMoreController test', () =>  {
    var $scope, controller, $controller, $rootScope;

    beforeEach(() =>  {
        angular.mock.module('ib-view-more-module', () =>  { });
        inject((_$controller_, _$rootScope_, _$filter_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('ViewMoreController', { $scope: $scope });
        });
    });

    describe('changeText function', () =>  {
        it('its should set properties correctly', () =>  {
            controller.changeText(true);
            expect(controller.active).toBe(false);
            expect(controller.text).toBe('READ_MORE');
        });
        it('its should with READ_LESS', () =>  {
            controller.changeText(false);
            expect(controller.active).toBe(true);
            expect(controller.text).toBe('READ_LESS');
        });
    });
});
