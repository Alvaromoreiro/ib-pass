describe('MmBExperienceController test', function () {

    var $controller, $rootScope, $scope, controller;

    beforeEach(function () {
        angular.mock.module('ib-MmB-experience-card-module', function() {});
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = _$controller_('MmBExperienceController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('when the MmBExperienceController function is called', function () {
        it('should de defined' , function() {
            expect(controller).toBeDefined();
        });
    });
});
