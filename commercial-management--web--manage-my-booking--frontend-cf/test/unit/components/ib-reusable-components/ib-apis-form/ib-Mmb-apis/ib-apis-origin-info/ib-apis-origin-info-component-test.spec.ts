describe('ApisOriginInfo test', function () {
    var controller, $controller, $scope, $rootScope;

    beforeEach(function () {
        angular.mock.module('ib-apis-origin-info-module', function () {});
        inject(function (_$rootScope_, _$componentController_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$componentController_;
            controller = $controller('ibApisOriginInfo', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('must be defined', function () {
            controller.activate();
            expect(controller).toBeDefined();
        });
    });
});
