describe('DigitalBoardingService Test', () => {
    let DigitalBoardingService, $q, rootScope;
    let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
    let mockResponse = {
        'code': 200,
        'data': {},
        'hasData': false
    };
    let fakeBookingData = {
        flowId: 'TWFuYWdlTXlCb29raW5nQElCOWM3MmM3ZDZiYzZkNGYzN2EwMTA5MzRmYjRjZDFhODU%3D',
        code: 200,
        order: {
            orderId: 'Qm9va2luZ0BJQmUyODI3MWI4ZGE2ZDRjMGZhN2IwNGY0YWM1NmU0NzA2T1A%3D',
            status: 'UNCONFIRMED_CHANGES',
            bookingReferences: [
                {
                    provider: '1A',
                    reference: 'SLVOAU'
                }
            ],
            orderItems: [
                {
                    type: 'flight',
                    orderItemId: 'IBe28271b8da6d4c0fa7b04f4ac56e4706OP_01',
                    bookingReferences: [
                        null
                    ],
                    price: {
                        fare: 308,
                        tax: 21.47,
                        total: 329.47,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    sliceIds: [
                        'MADIBZ20200718114500',
                        'IBZPMI20200718143000'
                    ],
                    passengerPrices: [
                        null
                    ]
                }
            ],
            slices: [
                {
                    sliceId: 'MADIBZ20200718114500',
                    type: 'REGULAR',
                    departureDateTime: '2020-07-18 11:45',
                    arrivalDateTime: '2020-07-18 13:00',
                    duration: 75,
                    stopsNumber: 0,
                    price: {
                        fare: 223,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        null
                    ],
                    segments: [
                        {
                            id: 'test'
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        null
                    ]
                },
                {
                    sliceId: 'IBZPMI20200718143000',
                    type: 'REGULAR',
                    departureDateTime: '2020-07-18 14:30',
                    arrivalDateTime: '2020-07-18 15:15',
                    duration: 45,
                    stopsNumber: 0,
                    price: {
                        fare: 85,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        null
                    ],
                    segments: [
                        {
                            id: 'test'
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        null
                    ]
                }
            ],
            price: {
                fare: 308,
                tax: 21.47,
                total: 329.47,
                currency: 'EUR',
                ticketingFee: 0
            },
            primaryContactInfo: {
                phone: '34236558877',
                email: 'ACCEPT@ACCEPT.COM',
                phoneType: 'MOBILE'
            },
            optionalInformation: [],
            cashAviosPossibilities: [],
            specialDiscounts: [],
            checkedBagAllowances: [
                {
                    type: 'PIECE',
                    segmentIds: [
                        'IB380820200718',
                        'IB851920200718'
                    ],
                    totalQuantity: 1
                }
            ],
            aviosRedeemed: null,
            pointsRedeemed: null
        },
        passengers: [
            {
                passengerType: 'ADULT',
                personalInfo: {
                    name: 'PRUEBA',
                    surname: 'PRUEBA',
                    birthDate: null
                },
                passengerId: 'ADULT_01',
                contactInfo: {
                    phone: '34236558877',
                    email: 'ACCEPT@ACCEPT.COM',
                    phoneType: 'MOBILE'
                },
                ckiStatus: null,
                optionalInformation: []
            }
        ],
        tickets: [
            {
                ticketNumbers: [
                    '0752389700558'
                ],
                type: 'ET',
                orderItemId: 'IBe28271b8da6d4c0fa7b04f4ac56e4706OP_01',
                passengerId: 'ADULT_01',
                issueDateTime: '2020-05-06 00:00',
                fareCalculation: 'MAD IB IBZ223.00IB PMI85.00EUR308.00END',
                taxes: [
                    {
                        code: 'JD',
                        amount: 16.79,
                        currency: 'EUR',
                        description: ''
                    },
                    {
                        code: 'OG',
                        amount: 0.83,
                        currency: 'EUR',
                        description: ''
                    },
                    {
                        code: 'QV',
                        amount: 3.85,
                        currency: 'EUR',
                        description: ''
                    }
                ],
                coupons: [
                    {
                        arrival: 'IBZ',
                        departure: 'MAD',
                        departureDate: '2020-07-18T11:45:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'KDNOS2',
                        carrier: 'IB',
                        flightNumber: '3808',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'K',
                        designator: '',
                        couponNumber: '1',
                        remark: null
                    },
                    {
                        arrival: 'PMI',
                        departure: 'IBZ',
                        departureDate: '2020-07-18T14:30:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'HB',
                        carrier: 'IB',
                        flightNumber: '8519',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'H',
                        designator: '',
                        couponNumber: '2',
                        remark: null
                    }
                ],
                iataCode: '78496445',
                issueCity: 'MAD',
                passengerType: 'ADULT',
                paymentInfo: {
                    type: 'MS_TT',
                    amount: 329.47
                },
                emdsList: [],
                taxedPrice: {
                    fare: 308,
                    tax: 21.47,
                    total: 329.47,
                    currency: 'EUR',
                    ticketingFee: 0
                }
            }
        ],
        warnings: [
            {
                code: 'SSE_MMB_0005',
                description: 'Te hemos cambiado de mercado para que visualices correctamente tu reserva'
            },
            {
                code: 'SSE_MMB_0009',
                description: 'Este itinerario ha sufrido un cambio no confirmado. Por favor, revisa tus vuelos.'
            }
        ],
        paymentItems: [
            {
                type: 'IBERIA_PAY',
                tokenizedCardNumber: '8100000000114444',
                maskedCardNumber: null,
                authorization: null,
                subtotal: null,
                totalFee: null,
                total: null,
                unityFee: null,
                currency: null
            }
        ],
        contextMetadata: {
            language: 'es',
            country: 'ES',
            currencies: [
                {
                    code: 'EUR',
                    description: 'Euro',
                    symbol: '€',
                    alignment: 'L',
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2,
                    recommendedDisplay: 'symbol'
                }
            ]
        },
        fareFamilyConditions: [],
        channel: 'IBCOM',
        onHoldInformation: null,
        relatedContent: [],
        qualifiers: [],
        reportingWeb: {
            device: 'DAAC',
            idColective: '',
            officeIata: 'MADIB08AB',
            iata: 'I',
            product: '1'
        },
        flexibilizationCapabilitiesInformation: {
            code: 'COVID19',
            description: ''
        },
        upgInformation: {
            url: null,
            flightsInformation: null,
            bidable: false
        },
        orderFlags: [
            {
                type: 'PRINT_ITINERARY',
                enabled: false
            },
            {
                type: 'ON_BUSINESS_MODIFICATION',
                enabled: false
            },
            {
                type: 'VOUCHER_TOTAL_REFUND',
                enabled: false
            },
            {
                type: 'VOUCHER_PARTIAL_REFUND',
                enabled: false
            },
            {
                type: 'CASH_TOTAL_REFUND',
                enabled: false
            },
            {
                type: 'CASH_PARTIAL_REFUND',
                enabled: false
            }
        ],
        isAirShuttle: false,
        isOnHold: false
    }
    let fakeMbmAppConstants = {
        'digitalBoardingAvailability' : '/trm-apim/rs/v3/digital-boarding',
        DEFAULT_ENDPOINTS: {
            digitalBoardingAvailabilityV4: 'test'
        }
    }

    let fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    }
    let fakeCommonsGenericProxy = {
        'postGeneric': jasmine.createSpy()
    };
    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMbmAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });

        inject(($rootScope, _DigitalBoardingService_, _$timeout_, _$q_) => {
            DigitalBoardingService = _DigitalBoardingService_;
            $q = _$q_;
            rootScope = $rootScope;
        });
    });
    describe('when getDigitalBoardingAvailability() is called and resolve promise', () => {
        it('should return data', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                })
            })
            DigitalBoardingService.getDigitalBoardingAvailability(fakeBookingData).then((responseData) => {
                expect(responseData).toEqual({
                    'code': 200,
                    'data': {},
                    'hasData': true
                });
            }, angular.noop);

            rootScope.$digest();
            done();
        });
    });
    describe('when getDigitalBoardingAvailability() is called and reject promise', () => {
        it('and fail promise, 408 error', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            DigitalBoardingService.getDigitalBoardingAvailability(fakeBookingData).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
            done();
        });
        it('and fail promise, 401 error', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };

            DigitalBoardingService.getDigitalBoardingAvailability(fakeBookingData).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(401);
            });
            rootScope.$digest();
            done();
        });
        it('and fail promise, 500 error', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            DigitalBoardingService.getDigitalBoardingAvailability(fakeBookingData).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(500);
            });
            rootScope.$digest();
            done();
        });
        it('and fail promise, 402 error', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            mockError = { 'errorCode': 402, 'data': { 'errors': [{ 'reason': 'error' }] } };
            DigitalBoardingService.getDigitalBoardingAvailability(fakeBookingData).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(402);
            });
            rootScope.$digest();
            done();
        });
    });
});
