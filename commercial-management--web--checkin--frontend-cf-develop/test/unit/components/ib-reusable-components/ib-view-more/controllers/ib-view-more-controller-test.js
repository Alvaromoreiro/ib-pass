describe('ViewMoreController', function () {

    var $controller, $rootScope, $scope, controller;

    beforeEach(function () {
        angular.mock.module('ib-view-more-module', function () {});
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            
            controller = $controller('ViewMoreController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('when changeText() is called', function () {
        it('assign values to active and text variables when true' , function() {
            controller.changeText(true);
            expect(controller.active).toBe(false);
            expect(controller.text).toBe('IBCOSE_LEER_MAS');
        });
        
        it('assign values to active and text variables when false' , function() {
            controller.changeText(false);
            expect(controller.active).toBe(true);
            expect(controller.text).toBe('IBCOSE_LEER_MENOS');
        });
    });
});