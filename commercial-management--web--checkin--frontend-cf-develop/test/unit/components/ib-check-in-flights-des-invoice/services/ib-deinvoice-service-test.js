describe('DeinvoicingService', function () {
    var service;
    var $rootScope;
    var $q;
    var deletePassengerService;
    var transformer;

    beforeEach(angular.mock.module('ib-checkin-flights-des-invoice-module', function ($provide) {
        deletePassengerService = {
            deletePassenger: jasmine.createSpy('deletePassenger')
        };
        transformer = {
            transformSegmentsPassengersInfo: jasmine.createSpy('transformSegmentsPassengersInfo')
        };
        $provide.value('DeletePassengerService', deletePassengerService);
        $provide.value('DesInvoincingTransformer', transformer);
    }));

    beforeEach(angular.mock.inject(function (_DeinvoicingService_, _$rootScope_, _$q_) {
        service = _DeinvoicingService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    it('deletes passengers and resolves with transformed response data', function () {
        var request = { firstSegmentId: 10, passengers: [20] };
        var response = { data: [{ id: 10, passengers: [20] }] };
        var transformedResponse = { segments: [10] };
        var result;
        deletePassengerService.deletePassenger.and.returnValue($q.when(response));
        transformer.transformSegmentsPassengersInfo.and.returnValue(transformedResponse);

        service.deinvoicingFlights(request, 'flow-1').then(function (data) {
            result = data;
        });
        $rootScope.$apply();

        expect(deletePassengerService.deletePassenger).toHaveBeenCalledWith(request, 'flow-1');
        expect(transformer.transformSegmentsPassengersInfo).toHaveBeenCalledWith(response);
        expect(result).toBe(transformedResponse);
    });

    it('rejects when passenger deletion fails', function () {
        var request = { firstSegmentId: 10, passengers: [20] };
        var error = { status: 500 };
        var rejection;
        deletePassengerService.deletePassenger.and.returnValue($q.reject(error));

        service.deinvoicingFlights(request, 'flow-1').then(null, function (reason) {
            rejection = reason;
        });
        $rootScope.$apply();

        expect(rejection).toBe(error);
        expect(transformer.transformSegmentsPassengersInfo).not.toHaveBeenCalled();
    });
});