xdescribe('SliderCalendarController test', function () {

    var controllerDependencies, controller;

    controllerDependencies = {
        '$scope': {}
    };

    beforeEach(function () {
        angular.mock.module('ib-booking-calendar-module');

        inject(function ($rootScope, $controller) {
            controllerDependencies.$scope = $rootScope.$new();
            controller = $controller('SliderCalendarController', controllerDependencies);

        });
    });

    describe('When the user clicks on a month of the list', function () {

        it('and the controller emits the event', function () {
            spyOn(controllerDependencies.$scope, '$emit');
            controller.changeMonth(5);
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('calendarChangeMonth', 5);
        });

    });

});