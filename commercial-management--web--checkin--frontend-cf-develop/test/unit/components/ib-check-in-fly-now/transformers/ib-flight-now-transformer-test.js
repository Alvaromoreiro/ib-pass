describe('FlightNowTransformer', function () {
    var transformer;
    var selectedBlock;

    beforeEach(function () {
        selectedBlock = {
            whatToDo: { mmbAvailable: true },
            detailedType: 'CONFIRMED',
            departure: { originalDate: '2026-10-06 10:00' },
            arrival: { originalDate: '2026-10-06 12:00' }
        };
        angular.mock.module('ib-flight-now-module', function ($provide) {
            $provide.value('$filter', function () {
                return function (value) { return 'formatted:' + value; };
            });
            $provide.value('CheckinAppConstants', { market: 'ES' });
            $provide.value('IbUtilsService', {
                getAirlineLogos: jasmine.createSpy('getAirlineLogos').and.returnValue({
                    companyURL: 'airline.svg', companyDisabledURL: 'airline-disabled.svg'
                })
            });
            $provide.value('localStorageService', {
                get: jasmine.createSpy('get').and.callFake(function (key) {
                    return key === 'selectedBlockPa' ? selectedBlock : undefined;
                })
            });
        });
        inject(function (FlightNowTransformer) {
            transformer = FlightNowTransformer;
        });
    });

    it('transforms slices into tabs grouped by departure date and marks unavailable seats', function () {
        var segment = function (sliceId, departureDateTime, arrivalDateTime, remainingSeats) {
            return {
                sliceId: sliceId,
                departureDateTime: departureDateTime,
                arrivalDateTime: arrivalDateTime,
                segments: [{
                    departure: { name: 'Madrid' },
                    arrival: { name: 'London' },
                    flight: { operationalCarrier: { name: 'Airline', code: 'IB' } }
                }],
                remainingSeats: remainingSeats
            };
        };
        var flightData = {
            originDestinations: [{
                originDestinationId: 'od-1',
                origin: 'MAD',
                originCity: { description: 'Madrid' },
                destination: 'LHR',
                destinationCity: { description: 'London' },
                slices: [
                    segment('slice-1', '2026-10-06 10:00', '2026-10-06 12:00'),
                    segment('slice-2', '2026-10-07 11:00', '2026-10-07 13:00')
                ]
            }],
            offers: [{
                originDestinations: [{
                    originDestinationId: 'od-1',
                    applicableSlices: [
                        { sliceId: 'slice-1', remainingSeats: 0, segments: [{ bookingClass: 'Y' }] },
                        { sliceId: 'slice-2', remainingSeats: 4, segments: [{ bookingClass: 'J' }] }
                    ]
                }]
            }]
        };

        var result = transformer.transformFlightNowInfo(flightData);

        expect(result.departureCity).toBe('Madrid');
        expect(result.showFuturesFlight).toBe(true);
        expect(result.originDestinations.length).toBe(2);
        expect(result.originDestinations[0].slices[0].disabled).toBe(true);
        expect(result.originDestinations[0].slices[0].operatedByUrl).toBe('airline-disabled.svg');
        expect(result.originDestinations[0].slices[0].myflight).toBe(true);
        expect(result.originDestinations[1].slices[0].cabinClass).toBe('J');
        expect(result.originDestinations[1].slices[0].operatedByUrl).toBe('airline.svg');
    });

    it('creates a fly now request using airport and cabin fallbacks', function () {
        var request = transformer.createFlyNowRequest({
            departure: { airport: { code: 'MAD' } },
            arrival: { airport: { code: 'LHR' } },
            cabinClass: {}
        }, 'checkin-1');

        expect(request).toEqual({
            flowId: 'checkin-1',
            slices: [{ origin: 'MAD', destination: 'LHR' }],
            marketCode: 'ES',
            preferredCabin: 'ECONOMY',
            allowUnavailableFlights: true
        });
    });
});