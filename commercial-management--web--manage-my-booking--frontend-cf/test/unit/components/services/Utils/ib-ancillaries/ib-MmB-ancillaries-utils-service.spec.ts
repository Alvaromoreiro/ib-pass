import angular from 'angular';
import { StorageServiceMock } from '@test/unit/utils/StorageServiceMock';
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('MmBAncillariesUtilsService Test', () => {
    let MmBAncillariesUtilsService, localStorageService;
    const fakeSessionStorage: StorageServiceMock = new StorageServiceMock();
    let fakeFareFamilyConditions = {
        'TFLESEU': {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TFLESEU',
            'commercialName': 'Flexible',
            'commercialNameES': 'Flexible',
            'priority': 500,
            'conditions': [
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': '1 bulto',
                    'extendedInfo': {
                        'title': '1 bulto en cabina',
                        'message': '<a href=\'http://prea.iberia.es/web/product.do?cntCat=Productos/EQUIMA&cntId=EQUIMA&popup=true&AAA=true&market=ES&language=es\'>1 bulto/ 56x45x25cm</a>',
                        'conditionStatus': true
                    }
                }
            ]
        }
    };
    let mockSegmentsOrder = {
        'segments': [
            {
                'type': 'CONFIRMED',
                'mmbAllowed': true,
                'ckiStatus': {
                    'code': 'CHECKABLE',
                    'message': null
                },
                'noShow': false,
                'flyNow': false,
                'flown': false,
                'departure': {
                    'code': 'ALC',
                    'name': 'AIRPORT',
                    'terminal': null,
                    'airportCode': 'AIRPRUEBA',
                    'city': {
                        'code': 'ALC',
                        'description': 'Alicante',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'Spain'
                        }
                    }
                },
                'arrival': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'airportCode': 'AIRPRUEBA',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'Spain'
                        }
                    }
                },
                'departureCity': {
                    'code': 'ALC',
                    'description': 'Alicante',
                    'countryCode': 'ES',
                    'timeZone': 'Europe/Madrid'
                },
                'arrivalCity': {
                    'code': 'MAD',
                    'description': 'Madrid',
                    'countryCode': 'ES',
                    'timeZone': 'Europe/Madrid'
                },
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'YW',
                        'name': 'Iberia Regional Air Nostrum'
                    },
                    'marketingFlightNumber': '8863',
                    'operationalFlightNumber': '8863',
                    'operationalDisclosure': 'YW',
                    'aircraft': {
                        'code': 'CRK',
                        'description': 'Canadair Regional Jet 1000'
                    }
                },
                'cabin': {
                    'rbd': 'I',
                    'description': '',
                    'remainingSeats': 7,
                    'fareFamily': 'BREESES',
                    'code': 'B',
                    'type': 'BUSINESS',
                    'bookingClass': 'BUSINESS'
                },
                'overnight': false,
                'id': 'IB886320211020',
                'duration': 75,
                'waitingTime': 0,
                'operatorLocator': null,
                'stop': null,
                'departureDateTime': '2021-10-20 17:40',
                'departureUtcDateTime': '2021-10-20T15:40:00.000',
                'arrivalDateTime': '2021-10-20 18:55',
                'arrivalUtcDateTime': '2021-10-20T16:55:00.000',
                'status': {
                    'code': 'HK',
                    'description': 'Holding confirmed'
                }
            }
        ]
    };
    let mockBreakDownInfo = {
        'currencies': [
            {
                'code': 'EUR',
                'description': 'Euro',
                'symbol': '€',
                'alignment': 'R',
                'groupingSeparator': ',',
                'decimalSeparator': '.',
                'decimals': 2,
                'recommendedDisplay': 'symbol'
            }
        ],
        'context': {
            'issueOffice': 'MAD175',
            'locator': 'LQ0Z4',
            'paymentMode': 'ONLINE',
            'passengers': [
                {
                    'id': 'ADULT_01',
                    'surname': 'TEST',
                    'name': 'TEST',
                    'ticketPrices': [
                        {
                            'currency': 'EUR',
                            'number': '',
                            'tax': 11.69,
                            'fare': 162,
                            'total': 173.69
                        }
                    ],
                    'birthDate': null,
                    'frequentFlyer': null,
                    'passengerType': 'ADULT',
                    'items': [

                    ],
                    'title': null,
                    'infant': null,
                    'resiberId': '1'
                }
            ],
            'checkinFlowMode': 'REGULAR',
            'slices': [
                {
                    'id': 'ALCMAD20211020174000',
                    'segmentIds': [
                        'IB886320211020'
                    ]
                }
            ],
            'issueCurrency': 'EUR',
            'issueCountry': 'ES',
            'segments': [
                {
                    'departureDate': '2021-10-20 17:40',
                    'arrivalDate': '2021-10-20 18:55',
                    'utcDepartureDate': '2021-10-20 15:40',
                    'utcArrivalDate': '2021-10-20 16:55',
                    'departureAirport': 'ALC',
                    'arrivalAirport': 'MAD',
                    'operatingFlight': {
                        'flightNumber': '8863',
                        'cabin': {
                            'cabinClass': {
                                'type': 'BUSINESS',
                                'rbd': 'I'
                            },
                            'carrier': 'YW'
                        }
                    },
                    'marketingFlight': {
                        'flightNumber': '8863',
                        'cabin': {
                            'cabinClass': {
                                'type': 'BUSINESS',
                                'rbd': 'I'
                            },
                            'carrier': 'IB'
                        }
                    },
                    'id': 'IB886320211020',
                    'time': 'BKI',
                    'passengerCoupons': [
                        {
                            'id': 'ADULT_01',
                            'coupon': null,
                            'farebasis': 'ID7OS4',
                            'numberTicket': null,
                            'ticketDesignator': '',
                            'issueDate': null,
                            'seat': null,
                            'infantCoupon': null,
                            'eligible': true,
                            'franchisePieces': [
                                {
                                    'subtype': 'BAGGAGE_23',
                                    'description': '23kg',
                                    'units': 2
                                }
                            ],
                            'extraPieces': [

                            ],
                            'status': {
                                'message': 'CHECKABLE',
                                'code': 'CHECKABLE'
                            }
                        }
                    ],
                    'edifact': false,
                    'pricesProvider': 'TARIFICATOR',
                    'flown': false
                }
            ],
            'flownSegments': false,
            'dynamicPricing': false,
            'bookingDate': '2021-03-09 23:45'
        },
        'freeItems': [],
        'pendingPaymentItems': [
            {
                'total': 14,
                'currency': 'EUR',
                'segments': [
                        {
                          'id': 'IB317020210406',
                           'passengers': [
                               {
                                   'id': 'ADULT_01',
                                    'seat': {
                                        'row': '1',
                                        'column': 'B',
                                        'features': ['EMERGENCY_EXIT', 'EXTRA_SIZE']
                                    },
                                    'amount': 14,
                                    'originalAmount': 0
                                },
                                {
                                    'id': 'ADULT_02',
                                     'seat': {
                                         'row': '1',
                                         'column': 'A',
                                         'features': ['EXTRA_SIZE']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                {
                                    'id': 'ADULT_03',
                                     'seat': {
                                         'row': '2',
                                         'column': 'B',
                                         'features': ['WINDOW']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_04',
                                     'seat': {
                                         'row': '3',
                                         'column': 'B',
                                         'features': ['PASSENGER_WITH_INFANT']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_05',
                                     'seat': {
                                         'row': '4',
                                         'column': 'B',
                                         'features': ['PROMO']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_06',
                                     'seat': {
                                         'row': '5',
                                         'column': 'B',
                                         'features': ['UPFRONT']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_07',
                                     'seat': {
                                         'row': '6',
                                         'column': 'B',
                                         'features': ['RESTRICTED_MOBILITY']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_08',
                                     'seat': {
                                         'row': '7',
                                         'column': 'B',
                                         'features': ['ENTERTAINMENT_SCREEN']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_09',
                                     'seat': {
                                         'row': '8',
                                         'column': 'B',
                                         'features': ['NON_RECLINING']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 },
                                 {
                                    'id': 'ADULT_10',
                                     'seat': {
                                         'row': '9',
                                         'column': 'B',
                                         'features': ['PROMO', 'PASSENGER_WITH_INFANT']
                                     },
                                     'amount': 14,
                                     'originalAmount': 0
                                 }
                            ]
                        }
                    ],
                    'type': 'SEAT'
            },
            {
                'slices': [
                    {
                        'id': 'MADBIO20210327073500',
                        'passengers': [
                        {
                            'id': 'ADULT_01',
                            'pieces': [
                                {
                                    'subtype': 'BAGGAGE_32',
                                    'paidRanges': [
                                        {
                                            'units': 1,
                                            'amount': 105,
                                            'currency': 'EUR',
                                            'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/71.46',
                                            'eTicket': '',
                                            'emd': '0755569510127',
                                            'coupons': [
                                                {
                                                    'number': 1,
                                                    'status': 'OPEN FOR USE'
                                                }
                                            ]
                                        }
                                    ],
                                    'description': '32kg'
                                },
                                {
                                    'subtype': 'BAGGAGE_32', 'paidRanges': [{ 'units': 1, 'amount': 20, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/13.61', 'eTicket': '', 'emd': '0755569510126', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }], 'description': '23kg' }] }] }], 'type': 'BAGGAGE', 'currency': 'EUR' },
            {
                'slices': [
                    {
                        'id': 'MADBIO20210327073500',
                        'passengers': [
                            {
                                'id': 'ADULT_01',
                                'pieces': [
                                    {
                                        'subtype': 'BICYCLE',
                                        'paidRanges': [{ 'units': 1, 'amount': 40, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/27.22', 'eTicket': '', 'emd': '0755569510130', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }],
                                        'description': 'Bicycles'
                                    },
                                    {
                                        'subtype': 'GOLF_EQUIPMENT',
                                        'paidRanges': [{ 'units': 1, 'amount': 35, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/23.82', 'eTicket': '', 'emd': '0755569510129', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }],
                                        'description': 'Golf equipment'
                                    },
                                    {
                                        'subtype': 'SKI_SNOW',
                                        'paidRanges': [{ 'units': 1, 'amount': 35, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/23.82', 'eTicket': '', 'emd': '0755569510128', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }],
                                        'description': 'Skis/Snowboard'
                                    }
                                ]
                            },
                            {
                                'id': 'ADULT_01',
                                'pieces': [
                                    {
                                        'subtype': 'BICYCLE',
                                        'paidRanges': [{ 'units': 1, 'amount': 40, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/27.22', 'eTicket': '', 'emd': '0755569510130', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }],
                                        'description': 'Bicycles'
                                    },
                                    {
                                        'subtype': 'GOLF_EQUIPMENT',
                                        'paidRanges': [{ 'units': 1, 'amount': 35, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/23.82', 'eTicket': '', 'emd': '0755569510129', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }],
                                        'description': 'Golf equipment'
                                    },
                                    {
                                        'subtype': 'SKI_SNOW',
                                        'paidRanges': [{ 'units': 1, 'amount': 35, 'currency': 'EUR', 'formOfPayment': 'CCVI,XXXXXXXXXXXX9999/0324/J0VWC2/+MS-GC,0105ZX00N4L/23.82', 'eTicket': '', 'emd': '0755569510128', 'coupons': [{ 'number': 1, 'status': 'OPEN FOR USE' }] }],
                                        'description': 'Skis/Snowboard'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'type': 'SPECIAL_EQUIPMENT',
                'currency': 'EUR'
            },
            { 'offer': 'offerMock', 'total': 100, 'type': 'INSURANCE', 'currency': 'EUR' },
            { 'upgrading': { 'offerSegmentsClass': [{ 'segmentId': '123', 'cabinClass': { 'description': 'mockDescp' } }] }, 'total': 150, 'type': 'UPGRADING', 'currency': 'EUR' }


        ],
        'pendingIssuanceItems': [

        ],
        'issuedItems': [

        ],
        'voucherDiscount': null
    };

    let formatDate = [
        {
            'code': 'es',
            'dateFormat': {
                'fullDate': 'EEEE, D "de" MMMM "de" Y',
                'longDate': 'D "de" MMMM "de" Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }
    ];

    let MockMmBAppConstants = {
        'iconsRoute': 'iconRoute',
        'airlinesLogoBaseRoute': 'airLogoRoute',
        'defaultAirlineLogo': 'defaulturl',
        'FORMAT_DATE': formatDate,
        'COOKIES': {
            'DYNAMIC_PRICING': true
        },
        'PASSENGER_TYPE': {
            'SENIOR': 'SENIOR',
            'ADULT': 'ADULT',
            'YOUTH': 'YOUTH',
            'TEENAGER': 'YOUNG',
            'YOUNG_ADULT': 'YOUNG_ADULT',
            'CHILD': 'CHILD',
            'INFANT': 'INFANT'
        },
        'ANCILLARIES_IMPORT_ORDER_TYPE': {
            'BAGGAGE' : 'BGA'
        },
        'ANCILLARIES_TYPES': {
            'BAGGAGE': 'BAGGAGE',
            'SEAT': 'SEAT',
            'INSURANCE': 'INSURANCE',
            'VEHICLE_RENTAL': 'VEHICLE_RENTAL',
            'UPGRADING': 'UPGRADING',
            'SPEQS': 'SPECIAL_EQUIPMENT',
            'SPECIAL_MEALS': 'SPECIAL_MEALS',
            'UPGRADING_BID': 'UPGRADING_BID'
        },
        'SEAT_FEATURE': {
            'EMERGENCY_EXIT': 'EMERGENCY_EXIT',
            'EXTRA_SIZE': 'EXTRA_SIZE',
            'EMERGENCY_WINDOW': 'WINDOW',
            'WING': 'WING',
            'SCREEN': 'ENTERTAINMENT_SCREEN',
            'NON_RECLINING': 'NON_RECLINING',
            'INFANT': 'PASSENGER_WITH_INFANT',
            'MOBILITY': 'RESTRICTED_MOBILITY',
            'WC': 'WC',
            'GALLEY': 'GALLEY',
            'PROMO': 'PROMO',
            'UPFRONT': 'UPFRONT',
            'AISLE': 'AISLE',
            'NEIGHBOR_FREE': 'L'
        },
        'ACCOUNT_TYPES': {
            'REWARD': 'R',
            'LOAN': 'L'
        },
        'DESTINATION_IMAGE_SIZE': {
            'desktop': '1024',
            'tablet': '768',
            'mobile': '320'
        },
        'ORDER_STATUS_VALUES': {
            'CANCELATION_FLAG': 'UNCONFIRMED_CHANGES',
            'CANCELATION_REACOM_FLAG': 'ACCEPT_CHANGES_PENDING'
        },
        'QUADRIGAM': {
            'SEARCH': 'CHKTRP',
            'LOGGED_SEARCH': 'MYTRPS',
        },
        'OH_FLIGHT_TYPES' : {
            'MULTITRIP': 'multiCityFlight'
        },
        'PAYMENT_TYPES': {
            CREDIT_CARD: 'CREDIT_CARD',
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER'
        },
        'UN_UNTK_QUADRIGAMS': ['test']
    };

    let fakeCurrencyService = {
        'formatPrice': jasmine.createSpy('formatPrice').and.returnValue('10€'),
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject').and.callFake(() => {
            return { 'code': 'EUR', 'numberDecimals': 2, 'aviosTransformed': '100' }
        }),
        'formatAvios': jasmine.createSpy('formatAvios'),
        'getCurrenciesAsMap': jasmine.createSpy('getCurrenciesAsMap').and.returnValue({description: 'EUR'}),
    };

    let fakeBookingInfo = {
        order: {
            status: 'ENABLED',
            slices:[{
                segments:[{
                    cabin:{
                        fareFamily:'Turista',
                        bookingClass: 'Standard'
                    },
                    flight:{
                        operationalDisclosure:'IB',
                        operationalFlightNumber:'0256',
                        marketingFlightNumber:'0256'
                    },
                    departure:{
                        city:{
                            code:'MAD'
                        }
                    },
                    arrival:{
                        city:{
                            code:'BCN'
                        }
                    }
                }],
                departureDateTime:'2024-03-06 14:55',
                arrivalDateTime: '2024-04-10 18:35'
            }],
            orderItems: [{
                type: 'SEAT',
                segmentId: 'id1234',
                passengerId: 'passengerId1234',
                column: '1',
                row: 'A'
            }]
        },
        checkinSegmentsInGroup: ['id1234']
    };

    let fakeSelectedSegments = ['id1234'];

    let fakeAncillariesConstants = {
        TYPE_ANCILLARIE:{
            SEAT: 'SEAT',
            BAGGAGE: 'BAGGAGE',
            SPEQS: 'SPEQS',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            INSURANCE: 'INSURANCE',
            UPGRADING_BID: 'UPGRADING_BID',
            GLOBICK: 'GLOBICK'
        },
        CURRENCIES_TYPE_LONG: ['test']
    };

    let fakePassengers = [{
        trips: [{
            pieces: [{
                quantySelected: 2,
                availablePriceRanges: [{
                    from: 100,
                    to: 150,
                    amount: 120
                }]
            }],
            totalPrice: 120
        }]
    }];

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', 'ib-MmB-filters-module', function ($provide) {
            $provide.value('AncillariesConstants', fakeAncillariesConstants);
            $provide.value('$filter', filterFake);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBAppConstants', MockMmBAppConstants);
        });
        inject((_MmBAncillariesUtilsService_, _localStorageService_) => {
            MmBAncillariesUtilsService = _MmBAncillariesUtilsService_;
            localStorageService = _localStorageService_;

            fakeSessionStorage.set('bookingInfo',fakeBookingInfo);
            localStorageService.set('bookingInfo',fakeBookingInfo);
            fakeSessionStorage.set('fareFamilyConditionsInfo',[fakeFareFamilyConditions]);
            fakeSessionStorage.set('userLogged',true);
        });
    });
    describe('When generateAncillariesHeaderInfo() is called', () => {
        it('And dont have pending items, should return model basket', (done) => {
            let breakDownInfoNotPendingItems = angular.copy(mockBreakDownInfo), response;
            breakDownInfoNotPendingItems.pendingPaymentItems = [];
            response = MmBAncillariesUtilsService.generateAncillariesHeaderInfo(breakDownInfoNotPendingItems, mockSegmentsOrder.segments);
            expect(response.baggages).toEqual([]);
            expect(response.speqs).toEqual([]);
            expect(response.seats).toEqual([]);
            expect(response.insurance).toBe(null);
            expect(response.upgrading).toEqual({ 'upgradingTrips': [], 'total': null, 'totalFormatted': null });
            expect(response.currency.code).toEqual('EUR');
            expect(response.currency.numberDecimals).toEqual(2);
            done();
        });
        it('And have pending item SEAT, should return model basket', (done) => {
            let response = MmBAncillariesUtilsService.generateAncillariesHeaderInfo(mockBreakDownInfo, mockSegmentsOrder.segments);
            expect(response.seats[0].segmentId).toEqual('IB317020210406');
            expect(response.seats[0].quanty).toEqual(10);
            expect(response.seats[0].totalFormatted).toEqual('10€');
            done();
        });
    });

    describe('When checkFailedPendingPayments() is called', () => {
        it('Should return the error SEAT item description', (done) => {
            let response, cancelData = {
                failedToDelete: [{ 'type': 'SEAT', 'segments': [{ 'error': { 'description': 'SEAT item error' } }] }]
            }
            response = MmBAncillariesUtilsService.checkFailedPendingPayments(cancelData);
            expect(response).toEqual('SEAT item error');
            done();
        });
        it('Should return the error BAGGAGE item description', (done) => {
            let response, cancelData = {
                failedToDelete: [{ 'type': 'SEAT', 'segments': [{ 'error': { 'description': 'BAGGAGE item error' } }], 'pasengers': [{ 'error': { 'description': 'BAGGAGE item error' } }] }]
            }
            response = MmBAncillariesUtilsService.checkFailedPendingPayments(cancelData);
            expect(response).toEqual('BAGGAGE item error');
            done();
        });
        it('Should return the error UPGRADING item description', (done) => {
            let response, cancelData = {
                failedToDelete: [{ 'type': 'UPGRADING', 'error': { 'description': 'UPGRADING item error' } }]
            }
            response = MmBAncillariesUtilsService.checkFailedPendingPayments(cancelData);
            expect(response).toEqual('UPGRADING item error');
            done();
        });
    });

    describe('and formatDate', () => {
        it(' have been called', (done) => {
            
            MmBAncillariesUtilsService.formatDate([{ startDate: 'fecha 10-10-2024' }]);
            // expect(MmBAncillariesUtilsService.formatDate).toHaveBeenCalled();
            done();
        });
    });

    describe('and setSegmentInfo', () => {
        it(' have been called', (done) => {
            spyOn(localStorageService, 'set');
            MmBAncillariesUtilsService.setSegmentInfo({});
            expect(localStorageService.set).toHaveBeenCalledWith('seatMapSegment', {});
            done();
        });
    });
 
    describe('and removeSeatInfoConfirmation', () => {
        it(' have been called', (done) => {
            spyOn(localStorageService, 'remove');
            MmBAncillariesUtilsService.removeSeatInfoConfirmation();
            expect(localStorageService.remove).toHaveBeenCalledWith('seatInfoConfirmation');
            done();
        });
    });
    describe('and getSeatInfoConfirmation', () => {
        it(' have been called', (done) => {
            spyOn(localStorageService, 'get');
            MmBAncillariesUtilsService.getSeatInfoConfirmation();
            expect(localStorageService.get).toHaveBeenCalledWith('seatInfoConfirmation');
            done();
        });
    });

    describe('and isUserLogged', () => {
        it(' have been called', (done) => {
            spyOn(localStorageService, 'get');
            MmBAncillariesUtilsService.isUserLogged();
            expect(localStorageService.get).toHaveBeenCalledWith('userLogged');
            done();
        });
    });

    describe('and isCurrencyLong', () => {
        it(' have been called', (done) => {
            expect(MmBAncillariesUtilsService.isCurrencyLong('test')).toEqual(true);
            done();
        });
    });

    describe('and validatedFlightAviosInfo', () => {
        it(' have been called', (done) => {
            spyOn(localStorageService, 'get');
            MmBAncillariesUtilsService.validatedFlightAviosInfo();
            expect(localStorageService.get).toHaveBeenCalledWith('flightAviosInfo');
            done();
        });
    });

    describe('and checkEarlyFlights', () => {
        it(' have been called', (done) => {
            expect(MmBAncillariesUtilsService.checkEarlyFlights(fakeBookingInfo, fakeSelectedSegments)).toEqual(true);
            done();
        });
    });

    describe('and updateSegmentSeatCachedInfo', () => {
        it(' have been called', (done) => {
            let fakeSegmentSeat = [{
                passengers: [{
                    seat: '1A',
                    column: '1',
                    row: 'A',
                    id: 'passengerId1234'
                }],
                id: 'id1234'
            }];
            spyOn(localStorageService, 'set');
            MmBAncillariesUtilsService.updateSegmentSeatCachedInfo(fakeSegmentSeat);
            expect(localStorageService.set).toHaveBeenCalledWith('bookingInfo', fakeBookingInfo);
            done();
        });
    });

    describe('and calculatePiecesSpeqsTrip', () => {
        it(' have been called', (done) => {
            expect(MmBAncillariesUtilsService.calculatePiecesSpeqsTrip(fakePassengers)).toEqual(undefined);
            done();
        });
    });

    describe('and calculatePiecesBaggageTrip', () => {
        it(' have been called', (done) => {
            expect(MmBAncillariesUtilsService.calculatePiecesBaggageTrip(fakePassengers)).toEqual(undefined);
            done();
        });
    });

    describe('and getTypeAndDescription', () => {
        it('should return NEIGHBOR_FREE when seat has EXTRA_SIZE and UPFRONT features', (done) => {
            const response = MmBAncillariesUtilsService.getTypeAndDescription([
                MockMmBAppConstants.SEAT_FEATURE.EXTRA_SIZE,
                MockMmBAppConstants.SEAT_FEATURE.UPFRONT
            ]);
    
            expect(response).toEqual({
                type: MockMmBAppConstants.SEAT_FEATURE.NEIGHBOR_FREE,
                description: filterFake('translate')('CKIANCSEATS_SEAT_NEIGHBOR')
            });
    
            done();
        });
    });

});
