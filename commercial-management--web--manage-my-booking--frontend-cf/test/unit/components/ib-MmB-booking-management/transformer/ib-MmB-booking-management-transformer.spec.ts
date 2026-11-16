describe('BookingManagementTransformer test', () => {
    var bookingManagementTransformer, localStorageService;

    var pnr = 'testPNR';

    var getBookingInfo = {
        order: {
            slices: [
                {
                    type: 'SHUTTLE',
                    segments:[
                        { type: 'CONFIRMED', id: 1, ckiStatus: { 'code': 'CHECKABLE', 'message': null }, flyNow: 'test', flight: { operationalCarrier: { code: 'testCode', name: 'testName', }, marketingFlightNumber: 'test' } },
                        { type: 'CONFIRMED', id: 2, ckiStatus: { 'code': 'CHECKED', 'message': null }, mmbAllowed: 'test', flight: 'vuelo' },
                        { type: 'CONFIRMED', id: 2, ckiStatus: { 'code': 'STANDBY', 'message': null }, mmbAllowed: 'test', flight: 'vuelo' },
                        { type: 'CONFIRMED', id: 2, ckiStatus: { 'code': 'REISSUE', 'message': null }, mmbAllowed: 'test', flight: 'vuelo' },
                        { type: 'CONFIRMED', id: 2, ckiStatus: { 'code': 'UNCHECKABLE', 'message': null }, mmbAllowed: false, flight: 'vuelo' }
                    ]
                }
            ],
            orderItems: [
                { type: 'seat', segmentId: 1 },
                { type: 'specialNeed', segmentId: 1, passengerId: '3', serviceCode: "DPNA" },
                { type: 'specialNeed', segmentId: 1, passengerId: '3', serviceCode: "BLND" },
                { type: 'specialNeed', segmentId: 1, passengerId: '3', serviceCode: "DPNA" }
            ],
            optionalInformation: ['CONTACT_DATA','CONTACT_DATA','test']
        },
        passengers: [
            { 'passengerType': 'ADULT', 'personalInfo': { 'name': 'TERCER', 'surname': 'HIJO', 'birthDate': null }, 'passengerId': '3', 'ckiStatus': 'UNCHECKABLE', 'optionalInformation': ['CONTACT_DATA', 'EMERGENCY', 'FF', 'PMRS'] },
            {}
        ],
    };

    var getBookingInfoWithC02 = {
        order: {
            slices: [{
                'segments': [{
                    'type': 'CONFIRMED',
                    'departureCity': {
                        'code': 'BCN',
                        'name': 'Barcelona',
                        'terminal': null
                    },
                    'arrivalCity': {
                        'code': 'MAD',
                        'name': 'Madrid',
                        'terminal': null
                    },
                    'flight': {
                        'marketingCarrier': {
                            'code': 'IB',
                            'name': 'IBERIA AEROLINEAS'
                        },
                        'operationalCarrier': {
                            'code': 'IB',
                            'name': 'IBERIA AEROLINEAS'
                        },
                        'marketingFlightNumber': '2733',
                        'operationalFlightNumber': '2733',
                        'operationalDisclosure': 'IB',
                        'aircraft': null
                    },
                    'cabin': {
                        'rbd': 'Y',
                        'bookingClass': 'ECONOMY',
                        'description': 'Turista',
                        'remainingSeats': 0,
                        'fareFamily': 'TFLESEU'
                    }
                }]
            }],
        }, passengers: [{ 'passengerType': 'ADULT', 'personalInfo': { 'name': 'TERCER', 'surname': 'HIJO', 'birthDate': null }, 'passengerId': '3', 'ckiStatus': 'UNCHECKABLE', 'optionalInformation': ['CONTACT_DATA'] }, {}]
    };

    var fakeDataSegments = [
        {
            'id': '2',
            'transformedDepartureDate': {
                'dateTime': '17:30',
                'weekDay': 'WEEKDAY_FRYDAY',
                'day': 16,
                'monthNumber': 6,
                'month': 'MONTH_JUNE',
                'year': 2017,
                'originalDate': new Date('2017-06-16T15:30:00.000Z')
            },
            'transformedArrivalDate': {
                'dateTime': '18:45',
                'weekDay': 'WEEKDAY_FRYDAY',
                'day': 16,
                'monthNumber': 6,
                'month': 'MONTH_JUNE',
                'year': 2017,
                'originalDate': new Date('2017-06-16T16:45:00.000Z')
            }
        }, {
            'id': '3',
            'transformedDepartureDate': {
                'dateTime': '17:30',
                'weekDay': 'WEEKDAY_FRYDAY',
                'day': 17,
                'monthNumber': 6,
                'month': 'MONTH_JUNE',
                'year': 2017,
                'originalDate': new Date('2017-06-16T15:30:00.000Z')
            },
            'transformedArrivalDate': {
                'dateTime': '18:45',
                'weekDay': 'WEEKDAY_FRYDAY',
                'day': 17,
                'monthNumber': 6,
                'month': 'MONTH_JUNE',
                'year': 2017,
                'originalDate': new Date('2017-06-16T16:45:00.000Z')
            }
        },

    ];

    var fakeSelectedSegment = {
        'id': '2',
        'transformedDepartureDate': {
            'dateTime': '17:30',
            'weekDay': 'WEEKDAY_FRYDAY',
            'day': 16,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': new Date('2017-06-16T15:30:00.000Z')
        },
        'transformedArrivalDate': {
            'dateTime': '18:45',
            'weekDay': 'WEEKDAY_FRYDAY',
            'day': 16,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': new Date('2017-06-16T16:45:00.000Z')
        }
    };

    var fakeFirstSegment = {
        'id': '1',
        'transformedDepartureDate': {
            'dateTime': '17:30',
            'weekDay': 'WEEKDAY_FRYDAY',
            'day': 16,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': new Date('2017-06-15T15:30:00.000Z')
        },
        'transformedArrivalDate': {
            'dateTime': '18:45',
            'weekDay': 'WEEKDAY_FRYDAY',
            'day': 16,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': new Date('2017-06-15T16:45:00.000Z')
        }
    };

    var fakePassenger = {
        'passengerType': 'ADULT',
        'personalInfo': {
            'name': 'TERCER',
            'surname': 'HIJO',
            'birthDate': null
        },
        'passengerId': '3',
        'ckiStatus': 'UNCHECKABLE',
        'optionalInformation': {
            'contactData': true,
            'emergency': true,
            'ffInfo': true,
            'specialNeed': true
        }
    };

    var fakeMmBUtilService = {
        'getBasicSegmentInformation': jasmine.createSpy('getBasicSegmentInformation').and.callFake(() => {
            return {};
        }),
        'setFareFamilyConditions': jasmine.createSpy('setFareFamilyConditions').and.callFake(() => { }),
        'setSpecialNeedsPassengers': jasmine.createSpy('setSpecialNeedsPassengers').and.callFake(() => { })
    };

    let fakeBookingManagementConstants = {
        SPECIAL_NEEDS_STATUS: {

        },
        OPTIONAL_INFORMATION: {
            CONTACT_DATA: 'CONTACT_DATA'
        },
        ORDER_ITEMS: {
            SEAT: 'test'
        },
        SEGMENT_OPTION_STEP: {
            FLY_NOW_CKI: 'test',
            FLY_NOW_MMB: 'test',
            FLIGHT_PASSENGER_CKI: 'test',
            BOARDING: 'test',
            SEAT: 'test'
        },
        SEGMENT_OPTION: {
            CHECKIN: 'test',
            BOARDING: 'test',
            SEAT: 'test',
            MODIFY: 'test'
        }
    }

    let fakeMmBAppConstants = {
        'SLICE_TYPES': { 'REGULAR': 'REGULAR', 'SHUTTLE': 'SHUTTLE' },
        'SEGMENT_TYPES': { 'OPEN': 'OPEN', 'CONFIRMED': 'CONFIRMED' },
        'STATUS': {
            'UNCHECKABLE': 'UNCHECKABLE',
            'CHECKABLE': 'CHECKABLE',
            'CHECKED': 'CHECKED',
            'STANDBY': 'STANDBY',
            'REISSUE': 'REISSUE',
            'NOT_SELECTABLE': 'NOT_SELECTABLE'
        }
    }

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-booking-management-module', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('BookingManagementConstants', fakeBookingManagementConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject((_BookingManagementTransformer_, _localStorageService_) => {
            bookingManagementTransformer = _BookingManagementTransformer_;
            localStorageService = _localStorageService_;
        });
        localStorageService.set('PNR', pnr);
    });

    describe('When transformBookingManagementView()  is called with getBookingInfo, companiesLogos', () => {
        it('should return transformedInfo and hasSavedChangesSuccess is true', (done) => {
            localStorageService.set('savedChangeSuccess', true);
            localStorageService.set('bookingInfo', getBookingInfo);
            var returnedValue = bookingManagementTransformer.transformBookingManagementView(getBookingInfo);
            expect(returnedValue.bookingCode).toEqual(pnr);
            expect(returnedValue.passengers[0]).toEqual(fakePassenger);
            localStorageService.clearAll();
            done();
        });
    });

    it('When generateFareFamilyConditionsRequest() is called with bookingInfo and have fareFamilies', (done) => {
        var returnedValue;
        returnedValue = bookingManagementTransformer.generateFareFamilyConditionsRequest(getBookingInfoWithC02);
        expect(returnedValue[0]).toEqual('TFLESEU');
        done();
    });

    describe('When generateMinAndMaxSearchDate() is called', () => {
        it('with segments and selected segment is first and second have departureDate, should data have maxSearchDate', (done) => {
            var searchDate;
            bookingManagementTransformer.generateMinAndMaxSearchDate(fakeDataSegments, fakeSelectedSegment);
            searchDate = localStorageService.get('searchDate');
            expect(searchDate.minSearchDate).toBe(null);
            expect(searchDate.maxSearchDate).toEqual(new Date('2017-06-16T15:30:00.000Z').getTime());
            localStorageService.clearAll();
            done();
        });

        it('with segments and selected segment is in the middle and first and second have departuresDate and arrivalDate, should data have all values', (done) => {
            var searchDate, fakeCopySegments;
            fakeCopySegments = angular.copy(fakeDataSegments);
            fakeCopySegments.unshift(fakeFirstSegment);
            bookingManagementTransformer.generateMinAndMaxSearchDate(fakeCopySegments, fakeSelectedSegment);
            searchDate = localStorageService.get('searchDate');
            expect(searchDate.minSearchDate).toEqual(new Date('2017-06-15T16:45:00.000Z').getTime());
            expect(searchDate.maxSearchDate).toEqual(new Date('2017-06-16T15:30:00.000Z').getTime());
            localStorageService.clearAll();
            done();
        });

        it('with segments and selected segment is first and second don´t have departureDate , should data have all values in null', (done) => {
            var searchDate, fakeCopySegments;
            fakeCopySegments = angular.copy(fakeDataSegments);
            fakeCopySegments[1].transformedArrivalDate = null;
            fakeCopySegments[1].transformedDepartureDate = null;

            bookingManagementTransformer.generateMinAndMaxSearchDate(fakeCopySegments, fakeSelectedSegment);
            searchDate = localStorageService.get('searchDate');
            expect(searchDate.minSearchDate).toBe(null);
            expect(searchDate.maxSearchDate).toBe(null);
            localStorageService.clearAll();
            done();
        });
    });
});
