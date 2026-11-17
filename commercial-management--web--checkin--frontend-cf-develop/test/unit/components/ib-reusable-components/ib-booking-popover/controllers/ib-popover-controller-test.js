describe('IbPopoverController', function () {
    var controller;
    var scope;
    var originalDayjs;

    beforeEach(angular.mock.module('ib-booking-popover-module'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('IbPopoverController', { $scope: scope });
    }));

    beforeEach(function () {
        originalDayjs = globalThis.dayjs;
        globalThis.dayjs = function () {
            return { format: function () { return '06/10/2026'; } };
        };
    });

    afterEach(function () {
        if (originalDayjs === undefined) {
            delete globalThis.dayjs;
        } else {
            globalThis.dayjs = originalDayjs;
        }
    });

    it('stores outbound and return flight data and closes the popover', function () {
        controller.showData({ id: 'outbound' }, { id: 'return' }, 2);

        expect(controller.outboundFlight).toEqual({ id: 'outbound' });
        expect(controller.returnFlight).toEqual({ id: 'return' });
        expect(controller.passengers).toBe(2);

        controller.isOpen = true;
        controller.close();
        expect(controller.isOpen).toBe(false);
    });

    it('formats multicity dates and emits the requested availability position', function () {
        var cities = [{
            passsengers: 3,
            dates: { outboundFlight: '2026-10-06' },
            originCity: { code: 'MAD' },
            destinationCity: { code: 'LHR' }
        }];
        spyOn(scope, '$emit');

        controller.showMulticities(cities);
        controller.showModalToAvailability(2);

        expect(controller.passengers).toBe(3);
        expect(controller.multicityData).toEqual([{ date: '06/10/2026', origin: 'MAD', destination: 'LHR' }]);
        expect(scope.$emit).toHaveBeenCalledWith('showModalAvailability', 2);
    });
});