describe('MmBHotelController test', function() {
    var controller, $scope, $controller;

    beforeEach(function() {
        angular.mock.module('ib-reusable-components-module', function() { });

        inject(function(_$controller_) {
            $controller = _$controller_;
            controller = $controller('MmBHotelController', {
                $scope: $scope
            });
        });
    });

    describe('get controller', function() {
        it('should contain controller', function() {
            expect(controller).toBeDefined();
        });
    });
});
