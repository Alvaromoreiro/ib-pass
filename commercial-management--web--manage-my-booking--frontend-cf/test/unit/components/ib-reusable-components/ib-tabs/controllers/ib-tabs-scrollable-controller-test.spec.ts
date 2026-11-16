describe('tabsScrollableController test', function() {
    var controller, $scope, $controller;

    beforeEach(function() {
        angular.mock.module('ib-tabs', function() { });

        inject(function(_$controller_) {
            $controller = _$controller_;
            controller = $controller('tabsScrollableController', {
                $scope: $scope
            });
            controller.updateScrollbar = jasmine.createSpy();
        });
    });

    describe('get controller', function() {
        it('should contain controller', function() {
            expect(controller).toBeDefined();
        });
    });

    describe('when viewTab is called', function() {
        it('should initialize properties', function() {
            var event = {
                currentTarget: 'click',
                preventDefault: () => { }
            };
            controller.viewTab(1, event);
            expect(controller.active).toBe(1);
        });
    });
});
