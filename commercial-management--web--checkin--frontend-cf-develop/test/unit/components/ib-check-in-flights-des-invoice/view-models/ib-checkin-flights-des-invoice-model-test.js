describe('FlightsDesInvoiceModel', function () {
    var model;

    beforeEach(angular.mock.module('ib-checkin-flights-des-invoice-module'));

    beforeEach(angular.mock.inject(function (_FlightsDesInvoiceModel_) {
        model = _FlightsDesInvoiceModel_;
    }));

    it('initializes conditions as false and passenger information as empty', function () {
        model.conditions = true;
        model.segmentsPassengersInfo = [{ id: 10 }];

        model.initializeModel();

        expect(model.conditions).toBe(false);
        expect(model.segmentsPassengersInfo).toEqual([]);
    });
});