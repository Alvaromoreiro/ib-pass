describe('ibMmbDatepickerController test', function() {

    var controller, $scope, $controller, $rootScope;

    beforeEach(function() {
        angular.mock.module('ib-datepicker', function() { });

        inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $rootScope.appLang = 'ES';
            controller = $controller('ibMmbDatepickerController', {
                $rootScope: $rootScope
            });
        });
    });

    describe('get controller', function() {
        it('should contain controller', function() {
            expect(controller).toBeDefined();
        });
    });
});
