describe('IbPopoverController test', function () {
    var controller;
    var controllerDependencies = {
        '$scope': {},
    };

    beforeEach(function () {
        angular.mock.module('ib-booking-popover-module', 'LocalStorageModule');
        inject(function ($controller, $rootScope) {
            controllerDependencies.$scope = $rootScope.$new();
            controller = $controller('IbPopoverController', controllerDependencies);
            controllerDependencies.$scope.$apply();
        });
    });

    describe('when IbPopoverController is called', function () {
        it('should set isOpen to false', function (done) {
            controller.close();
            expect(controller.isOpen).toEqual(false);
            done();
        });
    });

});