describe('CalendarMatrixController test', function () {

    var controllerDependencies, controller, rootScope;

    controllerDependencies = {
        '$rootScope': {},
        '$scope': {}
    };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-calendar-module');

        inject(function ($rootScope, $controller) {
            rootScope = $rootScope;
            controllerDependencies.$scope = $rootScope.$new();
            controllerDependencies.$rootScope = $rootScope;
            controller = $controller('CalendarMatrixController', controllerDependencies);

        });
    });

    describe('When the user clicks on a day of matrix', function () {

        it('and the controller emits the event', function () {
            spyOn(controllerDependencies.$rootScope, '$emit');
            controller.searchCalendarDayAvailability(5);
            expect(controllerDependencies.$rootScope.$emit).toHaveBeenCalledWith('calendarDaySelected', 5);
        });

    });

});