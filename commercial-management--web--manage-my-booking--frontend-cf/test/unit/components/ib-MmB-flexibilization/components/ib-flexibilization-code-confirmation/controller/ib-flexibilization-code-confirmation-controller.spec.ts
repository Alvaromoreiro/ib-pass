describe('IbFlexibilizationCodeConfirmationController test', function () {
    let $controller, $rootScope, $scope, controller;
    beforeEach(function () {
        angular.mock.module('ib-flexibilization-code-confirmation-module', 'LocalStorageModule');
        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;
            controller = $controller('IbFlexibilizationCodeConfirmationController', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
            controller.$onInit();
        });
    });

    describe('when activate is called', function () {
        it('Its called correctly', function (done) {
            expect(controller.$onInit).toBeDefined();
            done();
        })
    })

});
