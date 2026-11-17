describe('DesInvoincingTransformer', function () {
    var transformer;

    beforeEach(angular.mock.module('ib-checkin-flights-des-invoice-module', function ($provide) {
        $provide.value('CheckinAppConstants', {});
        $provide.value('localStorageService', {});
    }));

    beforeEach(angular.mock.inject(function (_DesInvoincingTransformer_) {
        transformer = _DesInvoincingTransformer_;
    }));

    it('returns the deinvoicing response unchanged', function () {
        var response = { data: [{ id: 10, passengers: [{ id: 20 }] }] };

        expect(transformer.transformSegmentsPassengersInfo(response)).toBe(response);
    });

    it('returns an empty response unchanged', function () {
        var response = [];

        expect(transformer.transformSegmentsPassengersInfo(response)).toBe(response);
    });
});