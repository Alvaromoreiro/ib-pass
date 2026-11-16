describe('AlertHideController test', function () {

    var $controller, $rootScope, $timeout, $scope, controller;

    beforeEach(function () {
        angular.mock.module('ib-alert-hide-module', function() {});
        inject(function (_$controller_, _$rootScope_,_$timeout_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $scope = $rootScope.$new();

            controller = _$controller_('AlertHideController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('when the hideMessage() function is called', function () {
        it('should exchange variables showAlert to false' , function() {
            expect(controller.showAlert).toEqual(true)
            $timeout.flush(4000);
            expect(controller.showAlert).toEqual(false);
        });
    });
});
