describe('BookingAvailabilityModel Test', function () {
    var model;

    beforeEach(function () {

        angular.mock.module('ib-booking-availability-module', function ($provide) {
        });

        inject(function (_BookingAvailabilityModel_) {
            model = _BookingAvailabilityModel_;
        });

    });

    describe('When initializeModel is called', function () {
        it(' set default data', function (done) {

            model.initializeModel();

            expect(model.availabilityData).toEqual({});
            expect(model.selectedSlices).toEqual([])
            expect(model.currentOriginDestinationIndex ).toBe(0);
            expect(model.isLogged).toBeUndefined();
            done();
        });
    });

});