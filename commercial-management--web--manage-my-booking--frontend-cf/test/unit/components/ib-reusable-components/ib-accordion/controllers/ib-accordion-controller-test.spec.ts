describe('ibAccordionController test', function () {

    var $controller, $rootScope, $scope, controller;
    var fakeEvent = {
        preventDefault : function() { }
    }
    var expectStateFalse = [false, false, false, false];
    var expectStateAllFalse = false;
    var expectStateTrue = [true, true, true, true];
    var expectStateAllTrue = true;

    beforeEach(function () {
        angular.mock.module('ib-accordion', function() {});
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = _$controller_('ibAccordionController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('when the openCloseAll function is called', function () {
        it('should exchange to true variables open and stateAll' , function() {
            expect(controller.open).toEqual(expectStateFalse);
            expect(controller.stateAll).toEqual(expectStateAllFalse);
            controller.openCloseAll(fakeEvent);
            expect(controller.open).toEqual(expectStateTrue);
            expect(controller.stateAll).toEqual(expectStateAllTrue);
        });
    });
});
