describe('LimitYearsDatepickerController test', function() {
    var controller, $scope, $controller;

    beforeEach(function() {
        angular.mock.module('ib-limit-years-datepicker-module', function() { });

        inject(function(_$controller_) {
            $controller = _$controller_;
            controller = $controller('LimitYearsDatepickerController', {
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
