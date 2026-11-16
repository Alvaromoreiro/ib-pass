describe('ibChangeFlightAvailability test', () => {
    var scope, controller, timeout, rootScope;

    var controllerDependencies = {
        '$scope': {},
        '$timeout': {},
        'ChangeFlightConstants': {}
    };

    var ctrlBinds = {
        'availabilityModel': true
    };

    var fakeChangeFlightConstants = {
        FILTERS: {
            'AVAILABILITY_FILTER_ALL_TIMEZONES': { 'id': 'AVAILABILITY_FILTER_ALL_TIMEZONES', 'title': 'AVAILABILITY_FILTER_ALL_TIMEZONES_TITLE' },
            'AVAILABILITY_FILTER_MORNING_TIMEZONE': { 'id': 'AVAILABILITY_FILTER_MORNING_TIMEZONE', 'title': 'AVAILABILITY_FILTER_MORNING_TIMEZONE_TITLE' },
            'AVAILABILITY_FILTER_AFTERNOON_TIMEZONE': { 'id': 'AVAILABILITY_FILTER_AFTERNOON_TIMEZONE', 'title': 'AVAILABILITY_FILTER_AFTERNOON_TIMEZONE_TITLE' }
        }
    };


    beforeEach(() => {
        angular.mock.module('ib-change-flight-availability-module');
        inject(function ($componentController, $rootScope, $timeout) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
            timeout = $timeout;
            controllerDependencies.$scope = scope;
            controllerDependencies.$timeout = $timeout
            controllerDependencies.ChangeFlightConstants = fakeChangeFlightConstants;
            controller = $componentController('ibChangeFlightAvailability', controllerDependencies, ctrlBinds);
            // controllerDependencies.$scope.$apply();
            controller.$onInit();
        });
    });

    it('When activate() is called, should asign data to model', (done) => {
        expect(controller.filters[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES.id)
        expect(controller.showOnlyAvailable).toBe(true);
        done();
    });


    it('When selectFilter() is called, should asign select filter to controller', (done) => {
        controller.selectFilter('filter');
        expect(controller.selectedFilter).toEqual('filter');
        done();
    });

    it('When selectGrouping() is called, should asign select filter to controller', (done) => {
        controller.selectGrouping('group');
        expect(controller.descendingOrder).toBe(false);
        expect(controller.selectedGrouping).toEqual('group');
        done();
    });


    it('When selectSlice() is called, should emit event', (done) => {
        var slice = { 'id': '1' };
        scope.$on('sliceSelected', function (event, eventData) {
            expect(eventData).toEqual(slice);
            done();
        })
        controller.selectSlice(slice);

    });


    it('When availabilityFilter() is called, should return data', (done) => {
        var returnedInfo, hours = { 'outbound': '12:30', 'remainingSeats': 0 };
        controller.showOnlyAvailable = false;
        returnedInfo = controller.availabilityFilter(hours);
        expect(returnedInfo).toBe(true)
        done();
    });


    it('When reloadAvailability() is called, should call activate', (done) => {
        controller.reloadAvailability();
        timeout.flush();
        done();
    });


});
