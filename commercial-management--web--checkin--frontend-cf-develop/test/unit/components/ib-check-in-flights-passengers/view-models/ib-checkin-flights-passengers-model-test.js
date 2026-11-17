describe('FlightsPassengersModel', function () {
    var model;

    beforeEach(angular.mock.module('ib-checkin-flights-passengers-module'));

    beforeEach(inject(function (FlightsPassengersModel) {
        model = FlightsPassengersModel;
    }));

    it('initializes passenger state with empty defaults', function () {
        model.conditions = true;
        model.segmentsPassengersInfo = [{ id: 'segment-1' }];
        model.pasForm = {};
        model.errorFF = { status: true, passengers: ['passenger-1'] };

        model.initializeModel();

        expect(model.conditions).toBe(false);
        expect(model.segmentsPassengersInfo).toEqual([]);
        expect(model.pasForm).toBeNull();
        expect(model.errorFF).toEqual({ status: false, passengers: [] });
    });
});