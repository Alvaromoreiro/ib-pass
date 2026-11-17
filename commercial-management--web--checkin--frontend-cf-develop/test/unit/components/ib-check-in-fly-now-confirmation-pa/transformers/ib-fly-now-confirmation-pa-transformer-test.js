describe('FlyNowConfirmationPATransformer', function () {
    var transformer;
    var storage;
    var paymentService;

    beforeEach(function () {
        storage = {};
        paymentService = { setFareFamilyConditions: jasmine.createSpy('setFareFamilyConditions') };
        angular.mock.module('ib-fly-now-confirmation-module', function ($provide) {
            $provide.value('$filter', function () { return angular.identity; });
            $provide.value('IbAncillariesPaymentUtilsService', paymentService);
            $provide.value('localStorageService', {
                get: jasmine.createSpy('get').and.callFake(function (key) { return storage[key]; })
            });
        });
        inject(function (FlyNowConfirmationPATransformer) {
            transformer = FlyNowConfirmationPATransformer;
        });
    });

    it('transforms an open flight without old segment details', function () {
        storage.flightNowData = { fareFamilyConditions: ['condition-1'] };
        var oldSegment = {
            departure: { date: null },
            arrival: { date: null },
            type: 'AIR',
            detailedType: 'OPEN',
            airlineLogo: 'old.svg'
        };
        var newSegment = {
            date: { weekDay: 'Tuesday' },
            departureDateTime: '2026-10-06 10:30',
            departureTimeParsed: '10:30',
            arrivalTimeParsed: '12:00',
            cabinClass: 'Y',
            operatedByUrl: 'new.svg',
            operatedBy: 'Airline'
        };

        var result = transformer.transformFlyNowConfirmationInfo(oldSegment, newSegment);

        expect(result.segmentInfo.type).toBe('OPEN');
        expect(result.newSegmentInfo.date).toBe('06/10/2026');
        expect(result.oldSegmentInfo).toBeUndefined();
        expect(paymentService.setFareFamilyConditions).toHaveBeenCalledWith(['condition-1']);
    });

    it('includes old segment data and builds the change order request', function () {
        storage.passengersSelected = ['passenger-1'];
        storage.newSelectedSegment = { sliceId: 'slice-1', originDestinationId: 'od-1' };
        storage.flightNowData = {
            responseId: 'response-1',
            fareFamilyConditions: [],
            offers: [{
                originDestinations: [{
                    originDestinationId: 'od-1',
                    applicableSlices: [{ sliceId: 'slice-1' }]
                }],
                offerItems: [{ offerItemId: 'item-1' }, { offerItemId: 'item-2' }]
            }]
        };
        var oldSegment = {
            departure: { date: { weekDay: 'Monday', monthDay: '05', monthNumber: '10', year: '2026' }, hour: '09:00' },
            arrival: { date: { weekDay: 'Monday' }, hour: '11:00' },
            type: 'AIR',
            detailedType: 'CONFIRMED',
            cabinClass: 'Y',
            airlineLogo: 'old.svg',
            airlineName: 'Old Airline'
        };
        var newSegment = {
            date: { weekDay: 'Tuesday' },
            departureDateTime: '2026-10-06 10:30',
            departureTimeParsed: '10:30',
            arrivalTimeParsed: '12:00',
            cabinClass: 'J',
            operatedByUrl: 'new.svg',
            operatedBy: 'New Airline'
        };

        var transformed = transformer.transformFlyNowConfirmationInfo(oldSegment, newSegment);
        var request = transformer.createRequestChangeOrder();

        expect(transformed.oldSegmentInfo.date).toBe('05/10/2026');
        expect(transformed.newSegmentInfo.cabinClass).toBe('Y');
        expect(request).toEqual({
            passengerIds: ['passenger-1'],
            originDestinations: [{ selectedSliceId: 'slice-1', originDestinationId: 'od-1' }],
            shoppingResponseId: 'response-1',
            offerItemIds: ['item-1', 'item-2']
        });
    });
});