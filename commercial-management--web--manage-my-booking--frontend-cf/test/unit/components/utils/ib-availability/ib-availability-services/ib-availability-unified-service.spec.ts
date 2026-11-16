class FlightMock {
    static getTimeParsed = jasmine.createSpy();
    setSliceType = jasmine.createSpy();
}

class AvailabilityDataClassMock {
    getTimeParsed = jasmine.createSpy();
    dateOptions = jasmine.createSpy().and.returnValue({
        maxDate: '10-10-2028',
        minDate: '10-10-2025'
    });
    parseNewDate = jasmine.createSpy();
    flight = FlightMock;
}

class SegmentAVModel {
    static getParsedDate = jasmine.createSpy();
    setParsedFamilyCondition = jasmine.createSpy();
}

class ImportOrderDataClassMock {
    SegmentAVModel = SegmentAVModel;
}


describe('AvailabilityUnifiedService Test', () => {
    let mockResponse = { data: 'test' };
    let mockError = { error: { code: 410 } };

    var AvailabilityUnifiedService, rootScope, q, $injector, fakeDisruptionUtilService, localStorageService, fakeAvailabilityDataClass, fakeImportOrderDataClass;

    var fakeMmBUtilService = {
        getCompanyURL: jasmine.createSpy(),
    };

    let fakeMmBUtilsSharedService = {
        generateRequestFlexibilization: jasmine.createSpy(),
    };

    let fakeCallAvailabilityUnifiedService = {
        getAvailabilityUnified: jasmine.createSpy().and.callFake(() => {
            return Promise.resolve({ offers: [{ offerType: '' }] });
        })
    };

    let fakeMmBModalService = {
        'showVoluntaryChangeModal': jasmine.createSpy().and.returnValue({
            result: {}
        })
    };

    let fakeCallRibbonflexibleService = {

    };
    let fakeVoluntaryChangesTransformer = {
        searchFlights: jasmine.createSpy(),
        generateFlightsModelRibbon: jasmine.createSpy().and.returnValue([{ arrIndex: 0, calendarData: { maxDate: new Date('10-10-2028'), minDate: new Date('10-10-2025'), slides: [{ serviceDate: new Date('2025-10-10') }], currentSlides: [{ serviceDate: new Date('2025-10-10') }] } }])
    };

    let fakeIbFlexFlexibilizationTransformer = {
        getModelFlighVC: jasmine.createSpy()
    };

    const fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc: any = () => {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return 'test';
                };
                break;
            case 'DurationFormatFilter':
                filterFunc = function (label) {
                    return 'test DurationFormatFilter';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    fakeDisruptionUtilService = {
        getDateRange: jasmine.createSpy(),
        searchSlices: jasmine.createSpy().and.returnValue([{
            sliceId: '0',
            segments: [{
                relatedDisruptedSegmentId: 1,
                status: {
                    code: 'UN'
                },
                arrival: 'Bilbao',
                arrivalCity: {
                    countryCode: 'Bilbao',
                },
                arrivalDateTime: '10/10/2025 22:00',
                departureDateTime: '10/10/2025 20:00',
                departure: 'Madrid',
                departureCity: {
                    countryCode: 'Madrid'
                },
                flight: {
                    operationalCarrier: { code: 'IB' }
                },
                duration: 120,
                flown: false,
                overnight: true,
                id: '1234',
                stop: false,
                waitingTime: 0
            }],
            departureDateTime: "10/10/2024",
            duration: 30
        }]),
        criteriaFlightSearchEnabled: jasmine.createSpy(),
        checkDates: jasmine.createSpy()
    };

    let fakeBookingInfo = {
        genericDisruptionCapabilitiesInformation: '20/10/2025',
        order: {
            slices: [{
                sliceId: '1234'
            },
            {
                sliceId: '5678'
            }]
        }
    };

    beforeEach(() => {
        fakeAvailabilityDataClass = new AvailabilityDataClassMock();
        fakeImportOrderDataClass = new ImportOrderDataClassMock();

        angular.mock.module('ib-availability-service', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CallAvailabilityUnifiedService', fakeCallAvailabilityUnifiedService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('CallRibbonflexibleService', fakeCallRibbonflexibleService);
            $provide.value('VoluntaryChangesTransformer', fakeVoluntaryChangesTransformer);
            $provide.value('$filter', fakeFilter);
            $provide.value('IbFlexFlexibilizationTransformer', fakeIbFlexFlexibilizationTransformer);
            $provide.value('AvailabilityDataClass', fakeAvailabilityDataClass);
            $provide.value('ImportOrderDataClass', fakeImportOrderDataClass);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
        inject(($rootScope, _AvailabilityUnifiedService_, $q, _localStorageService_) => {
            AvailabilityUnifiedService = _AvailabilityUnifiedService_;
            rootScope = $rootScope;
            q = $q;
            localStorageService = _localStorageService_;

            localStorageService.set('bookingInfo', fakeBookingInfo)
        });
    });

    describe('when availability() is called and resolve', () => {
        it('and resolve promise, should return data', (done) => {
            AvailabilityUnifiedService.availability({ offers: [{ offerType: '' }] }).then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);

            done();
        });

    });

    describe('when availability() is called and reject', () => {
        beforeEach(() => {
            fakeCallAvailabilityUnifiedService.getAvailabilityUnified = jasmine.createSpy().and.callFake(() => {
                return Promise.reject({ error: { code: 410 } });
            })
        })
        it('and reject promise, should return error', (done) => {
            AvailabilityUnifiedService.availability({ offers: [{ offerType: '' }] }).then(angular.noop, (error) => {
                expect(error).toEqual(mockError);
            });
            done();
        });
        afterEach(()=> {
            fakeCallAvailabilityUnifiedService.getAvailabilityUnified = jasmine.createSpy().and.callFake(() => {
                return Promise.resolve({ offers: [{ offerType: '' }] });
            })
        })
    });

    describe('when generateRequest() is called and resolve', () => {
        it('should return data', (done) => {
            AvailabilityUnifiedService.generateRequest([{ newDateSelected: '12/10/2025' }], 'test', 'test', '20/10/2025');
            expect(fakeMmBUtilsSharedService.generateRequestFlexibilization).toHaveBeenCalled();
            done();
        });
    });

    describe('when generateModalObject() is called and resolve', () => {
        it('should return data with 2 slice', (done) => {
            localStorageService.set('unifiedOptionalData', { enabled: false, sliceId: '1234' });
            AvailabilityUnifiedService.generateRequest([{ newDateSelected: '12/10/2025', dateOptions: { minDate: new Date('09-09-2025'), maxDate: new Date('09-09-2028') } }], 'test', 'test', '20/10/2025');
            AvailabilityUnifiedService.generateModalObject({ originDestinations: [{ 'test': 'test1', originDestinationId: 'test1234' }, { 'test': 'test2', originDestinationId: 'test5678' }] });
            expect(fakeDisruptionUtilService.getDateRange).toHaveBeenCalled();
            done();
        });
        it('should return data with 1 slice', (done) => {
            localStorageService.set('unifiedOptionalData', { enabled: false, sliceId: '5678' });
            AvailabilityUnifiedService.generateRequest([{ newDateSelected: '12/10/2025', dateOptions: { minDate: new Date('09-09-2025'), maxDate: new Date('09-09-2028') } }], 'test', 'test', '20/10/2025');
            AvailabilityUnifiedService.generateModalObject({ originDestinations: [{ 'test': 'test1', originDestinationId: 'test1234' }] });
            expect(fakeDisruptionUtilService.getDateRange).toHaveBeenCalled();
            done();
        });
        it('should return data with 2 generateRquest and 1 slice without unifiedOptionalData', (done) => {
            localStorageService.remove('unifiedOptionalData');
            AvailabilityUnifiedService.generateRequest([{ newDateSelected: '12/10/2025', dateOptions: { minDate: new Date('11-11-2025'), maxDate: new Date('11-11-2028') }, departureDateParsed: {originalDate: '10-10-2025'} }, { newDateSelected: '12/10/2025', dateOptions: { minDate: new Date('11-11-2025'), maxDate: new Date('11-11-2028') }, departureDateParsed: {originalDate:'10-10-2025'} }], 'test', 'test', '20/10/2025');
            AvailabilityUnifiedService.generateModalObject({ originDestinations: [{ 'test': 'test1', originDestinationId: 'test1234' }] });
            expect(fakeDisruptionUtilService.getDateRange).toHaveBeenCalled();
            done();
        });
        it('should return data with 2 generateRquest and 1 slice without unifiedOptionalData and date is <', (done) => {
            localStorageService.remove('unifiedOptionalData');
            AvailabilityUnifiedService.generateRequest([{ newDateSelected: '12/10/2025', dateOptions: { minDate: new Date('11-11-2025'), maxDate: new Date('11-11-2028') }, departureDateParsed: '10-10-2025' }, { newDateSelected: '12/10/2025', dateOptions: { minDate: new Date('11-11-2025'), maxDate: new Date('11-11-2028') }, departureDateParsed: {originalDate:'09-09-2024'} }], 'test', 'test', '20/10/2025');
            AvailabilityUnifiedService.generateModalObject({ originDestinations: [{ 'test': 'test1', originDestinationId: 'test1234' }] });
            expect(fakeDisruptionUtilService.getDateRange).toHaveBeenCalled();
            done();
        });
        it('should return data with 1 slice without newDateSelected', (done) => {
            localStorageService.set('unifiedOptionalData', { enabled: false, sliceId: '0' });
            AvailabilityUnifiedService.generateRequest([{parseNewDateSelected:{year: '2025', month: '05', day: '07'}, dateOptions: { minDate: new Date('09-09-2025'), maxDate: new Date('09-09-2028') } }], 'test', 'test');
            AvailabilityUnifiedService.generateModalObject({ originDestinations: [{ 'test': 'test1', originDestinationId: 'test1234' }] });
            expect(fakeDisruptionUtilService.getDateRange).toHaveBeenCalled();
            done();
        });
    });

    describe('when callModalService() is called and resolve', () => {
        it('should return data', () => {
            AvailabilityUnifiedService.callModalService({});
            expect(fakeMmBModalService.showVoluntaryChangeModal).toHaveBeenCalled();
        });
    });

});
