const bookingInfoMock = require('./mocks/booking-info-mock.json');
const fareDataMock = require('./mocks/fare-data-mock.json');

describe('VCSummaryTransformer test', () =>  {
    let fakeBookingInfo, fakeFareData, fakeFareData1, fakeFareData2, localStorageService, summaryTransformer;

    let fakeMmBUtilService = {
        getCompanyURL: () => {
            return 'airLogoRouteURI';
        }
    }
    let fakeMmBAppConstants = {
        WARNING_MESSAGES: {
            OVERNIGHT_WARNING: 'SSE_AVM_20003',
            TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
            AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
            LONG_WAITING_WARNING: 'SSE_AVM_20004',
            MISSCONNECTION_FLEX_WARNING: 'SSE_ORM_20014'
        },
        FLIGHTS_TYPES: {
            'DIRECT': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
            'INDIRECT': 'MMB_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT'
        }
    }
    let fakeCurrencyService = {
        'formatPrice': jasmine.createSpy('formatPrice').and.callFake(angular.noop),
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject').and.callFake(angular.noop),
    };

    let $fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        let filterFunc:any = () =>  {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                };
                break;
            case 'DurationFormatFilter':
                filterFunc = () =>  {
                    return '0h 52min.';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });
    fakeBookingInfo = {
        'flowId': 'TWFuYWdlTXlCb29raW5nQElCN2YyNjk1OGMxN2QwNGYyNDk3Y2MxYTE0ZTI5NGViMDc%3D',
        'order': {
            'orderId': 'Qm9va2luZ0BJQjBiMmM4Y2QzNmYwZDRjM2I5NGU0YzA5ZTNkYjg2YWEwT1A%3D',
            'status': 'ISSUED',
            'bookingReferences': [
                {
                    'provider': '1A',
                    'reference': 'V6YAO5'
                },
                {
                    'provider': 'IB',
                    'reference': 'KVF9S'
                }
            ],
            'orderItems': [
                {
                    'type': 'flight',
                    'orderItemId': 'IB0b2c8cd36f0d4c3b94e4c09e3db86aa0OP_01',
                    'bookingReferences': [
                        {
                            'provider': '1A',
                            'reference': 'V6YAO5'
                        },
                        {
                            'provider': 'IB',
                            'reference': 'KVF9S'
                        }
                    ],
                    'price': {
                        'fare': 760,
                        'tax': 28.27,
                        'total': 788.27,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'sliceIds': [
                        'MADPMI20210313111500',
                        'PMIMAD20210320084500'
                    ],
                    'passengerPrices': [
                        {
                            'fareCalculation': 'MAD IB X/MAH IB PMI380.00IB X/MAH IB MAD380.00EUR760.00END',
                            'passengerId': 'ADULT_01',
                            'price': {
                                'fare': 760,
                                'tax': 28.27,
                                'total': 788.27,
                                'currency': 'EUR',
                                'ticketingFee': 0
                            },
                            'segmentPrices': [
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB896220210313'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                },
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB849120210313'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                },
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB849420210320'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                },
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB896320210320'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                }
                            ],
                            'taxes': [
                                {
                                    'code': 'JD',
                                    'amount': 21.05,
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida'
                                },
                                {
                                    'code': 'OG',
                                    'amount': 1.56,
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad'
                                },
                                {
                                    'code': 'QV',
                                    'amount': 5.66,
                                    'currency': 'EUR',
                                    'description': 'Seguridad'
                                }
                            ],
                            'orderItemPaymentInfos': []
                        }
                    ]
                },
                {
                    'type': 'baggage',
                    'orderItemId': 'IB0b2c8cd36f0d4c3b94e4c09e3db86aa0OP_02',
                    'price': {
                        'fare': 50,
                        'tax': 0,
                        'total': 50,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'passengerId': 'ADULT_01',
                    'sliceId': 'PMIMAD20210320084500',
                    'amount': 2,
                    'emd': '0755569140748',
                    'orderItemPaymentInfos': []
                },
                {
                    'type': 'baggage',
                    'orderItemId': 'IB0b2c8cd36f0d4c3b94e4c09e3db86aa0OP_03',
                    'price': {
                        'fare': 50,
                        'tax': 0,
                        'total': 50,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'passengerId': 'ADULT_01',
                    'sliceId': 'MADPMI20210313111500',
                    'amount': 2,
                    'emd': '0755569140747',
                    'orderItemPaymentInfos': []
                }
            ],
            'slices': [
                {
                    'sliceId': 'MADPMI20210313111500',
                    'type': 'REGULAR',
                    'departureDateTime': '2021-03-13 11:15',
                    'arrivalDateTime': '2021-03-13 16:10',
                    'duration': 295,
                    'stopsNumber': 1,
                    'price': {
                        'fare': 760,
                        'currency': 'EUR'
                    },
                    'detailedPrices': [
                        {
                            'fare': 760,
                            'currency': 'EUR',
                            'passengerIds': [
                                'ADULT_01'
                            ],
                            'segmentPrices': [
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB896220210313'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                },
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB849120210313'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                }
                            ]
                        }
                    ],
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
                                'code': 'MAD',
                                'name': 'BARAJAS',
                                'terminal': '4',
                                'city': {
                                    'code': 'MAD',
                                    'description': 'Madrid',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'arrival': {
                                'code': 'MAH',
                                'name': 'MENORCA',
                                'terminal': null,
                                'city': {
                                    'code': 'MAH',
                                    'description': 'Menorca',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'departureCity': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'timeZone': 'Europe/Madrid'
                            },
                            'arrivalCity': {
                                'code': 'MAH',
                                'description': 'Menorca',
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
                                    'name': 'Air Nostrum'
                                },
                                'marketingFlightNumber': '8962',
                                'operationalFlightNumber': '',
                                'operationalDisclosure': 'YW',
                                'aircraft': {
                                    'code': 'CRK',
                                    'description': 'Canadair Regional Jet 1000'
                                }
                            },
                            'cabin': {
                                'rbd': 'Y',
                                'description': 'Turista',
                                'remainingSeats': null,
                                'fareFamily': 'TFLESEU',
                                'code': 'R',
                                'type': 'ECONOMY',
                                'bookingClass': 'ECONOMY'
                            },
                            'overnight': false,
                            'id': 'IB896220210313',
                            'duration': 90,
                            'waitingTime': 0,
                            'operatorLocator': null,
                            'stop': null,
                            'departureDateTime': '2021-03-13 11:15',
                            'departureUtcDateTime': '2021-03-13T10: 15:00.000',
                            'arrivalDateTime': '2021-03-13 12:45',
                            'arrivalUtcDateTime': '2021-03-13T11: 45:00.000',
                            'status': {
                                'code': 'HK',
                                'description': 'Confirmado'
                            }
                        },
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
                                'code': 'MAH',
                                'name': 'MENORCA',
                                'terminal': null,
                                'city': {
                                    'code': 'MAH',
                                    'description': 'Menorca',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'arrival': {
                                'code': 'PMI',
                                'name': 'PALMA DE MALLORCA',
                                'terminal': null,
                                'city': {
                                    'code': 'PMI',
                                    'description': 'Palma de Mallorca',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'departureCity': {
                                'code': 'MAH',
                                'description': 'Menorca',
                                'countryCode': 'ES',
                                'timeZone': 'Europe/Madrid'
                            },
                            'arrivalCity': {
                                'code': 'PMI',
                                'description': 'Palma de Mallorca',
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
                                    'name': 'Air Nostrum'
                                },
                                'marketingFlightNumber': '8491',
                                'operationalFlightNumber': '',
                                'operationalDisclosure': 'YW',
                                'aircraft': {
                                    'code': 'CRK',
                                    'description': 'Canadair Regional Jet 1000'
                                }
                            },
                            'cabin': {
                                'rbd': 'Y',
                                'description': 'Turista',
                                'remainingSeats': null,
                                'fareFamily': 'TFLESEU',
                                'code': 'R',
                                'type': 'ECONOMY',
                                'bookingClass': 'ECONOMY'
                            },
                            'overnight': false,
                            'id': 'IB849120210313',
                            'duration': 40,
                            'waitingTime': 165,
                            'warnings': [
                                {
                                    'code': 'SSE_ORM_20004',
                                    'description': 'Espera 2 h 45 m en Menorca, MENORCA, (MAH)'
                                }
                            ],
                            'operatorLocator': null,
                            'stop': null,
                            'departureDateTime': '2021-03-13 15:30',
                            'departureUtcDateTime': '2021-03-13T14: 30:00.000',
                            'arrivalDateTime': '2021-03-13 16:10',
                            'arrivalUtcDateTime': '2021-03-13T15: 10:00.000',
                            'status': {
                                'code': 'HK',
                                'description': 'Confirmado'
                            }
                        }
                    ],
                    'overnight': false,
                    'passengerFlags': [
                        {
                            'passengerId': 'ADULT_01',
                            'flags': [
                                {
                                    'type': 'FLIGHT_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'FLIGHT_REFUND',
                                    'enabled': false
                                },
                                {
                                    'type': 'FREQUENT_FLYER_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'SPECIAL_NEEDS_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'CONTACT_DATA_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'EMERGENCY_CONTACT_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'PASSENGER_NAME_CORRECTION',
                                    'enabled': false
                                },
                                {
                                    'type': 'ANCILLARIES',
                                    'enabled': true
                                },
                                {
                                    'type': 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_MODIFICATION_FLEXIBLE',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_DISRUPTION_SEARCH',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_MODIFICATION_ON_DEMAND',
                                    'enabled': false
                                }
                            ]
                        }
                    ],
                    'warnings': [{},{}]
                },
                {
                    'sliceId': 'PMIMAD20210320084500',
                    'type': 'REGULAR',
                    'departureDateTime': '2021-03-20 08:45',
                    'arrivalDateTime': '2021-03-20 15:00',
                    'duration': 375,
                    'stopsNumber': 1,
                    'price': {
                        'fare': 760,
                        'currency': 'EUR'
                    },
                    'detailedPrices': [
                        {
                            'fare': 760,
                            'currency': 'EUR',
                            'passengerIds': [
                                'ADULT_01'
                            ],
                            'segmentPrices': [
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB849420210320'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                },
                                {
                                    'price': {
                                        'fare': 380,
                                        'currency': 'EUR'
                                    },
                                    'fareCode': 'YJ',
                                    'segmentsIds': [
                                        'IB896320210320'
                                    ],
                                    'ticketDesignator': null,
                                    'penalties': []
                                }
                            ]
                        }
                    ],
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
                                'code': 'PMI',
                                'name': 'PALMA DE MALLORCA',
                                'terminal': null,
                                'city': {
                                    'code': 'PMI',
                                    'description': 'Palma de Mallorca',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'arrival': {
                                'code': 'MAH',
                                'name': 'MENORCA',
                                'terminal': null,
                                'city': {
                                    'code': 'MAH',
                                    'description': 'Menorca',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'departureCity': {
                                'code': 'PMI',
                                'description': 'Palma de Mallorca',
                                'countryCode': 'ES',
                                'timeZone': 'Europe/Madrid'
                            },
                            'arrivalCity': {
                                'code': 'MAH',
                                'description': 'Menorca',
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
                                    'name': 'Air Nostrum'
                                },
                                'marketingFlightNumber': '8494',
                                'operationalFlightNumber': '',
                                'operationalDisclosure': 'YW',
                                'aircraft': {
                                    'code': 'CRK',
                                    'description': 'Canadair Regional Jet 1000'
                                }
                            },
                            'cabin': {
                                'rbd': 'Y',
                                'description': 'Turista',
                                'remainingSeats': null,
                                'fareFamily': 'TFLESEU',
                                'code': 'R',
                                'type': 'ECONOMY',
                                'bookingClass': 'ECONOMY'
                            },
                            'overnight': false,
                            'id': 'IB849420210320',
                            'duration': 45,
                            'waitingTime': 0,
                            'operatorLocator': null,
                            'stop': null,
                            'departureDateTime': '2021-03-20 08:45',
                            'departureUtcDateTime': '2021-03-20T07: 45:00.000',
                            'arrivalDateTime': '2021-03-20 09:30',
                            'arrivalUtcDateTime': '2021-03-20T08: 30:00.000',
                            'status': {
                                'code': 'HK',
                                'description': 'Confirmado'
                            }
                        },
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
                                'code': 'MAH',
                                'name': 'MENORCA',
                                'terminal': null,
                                'city': {
                                    'code': 'MAH',
                                    'description': 'Menorca',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'arrival': {
                                'code': 'MAD',
                                'name': 'BARAJAS',
                                'terminal': '4',
                                'city': {
                                    'code': 'MAD',
                                    'description': 'Madrid',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'departureCity': {
                                'code': 'MAH',
                                'description': 'Menorca',
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
                                    'name': 'Air Nostrum'
                                },
                                'marketingFlightNumber': '8963',
                                'operationalFlightNumber': '',
                                'operationalDisclosure': 'YW',
                                'aircraft': {
                                    'code': 'CRK',
                                    'description': 'Canadair Regional Jet 1000'
                                }
                            },
                            'cabin': {
                                'rbd': 'Y',
                                'description': 'Turista',
                                'remainingSeats': null,
                                'fareFamily': 'TFLESEU',
                                'code': 'R',
                                'type': 'ECONOMY',
                                'bookingClass': 'ECONOMY'
                            },
                            'overnight': false,
                            'id': 'IB896320210320',
                            'duration': 100,
                            'waitingTime': 230,
                            'warnings': [
                                {
                                    'code': 'SSE_ORM_20004',
                                    'description': 'Espera 3 h 50 m en Menorca, MENORCA, (MAH)'
                                }
                            ],
                            'operatorLocator': null,
                            'stop': null,
                            'departureDateTime': '2021-03-20 13:20',
                            'departureUtcDateTime': '2021-03-20T12:20:00.000',
                            'arrivalDateTime': '2021-03-20 15: 00',
                            'arrivalUtcDateTime': '2021-03-20T14:00:00.000',
                            'status': {
                                'code': 'HK',
                                'description': 'Confirmado'
                            }
                        }
                    ],
                    'overnight': false,
                    'passengerFlags': [
                        {
                            'passengerId': 'ADULT_01',
                            'flags': [
                                {
                                    'type': 'FLIGHT_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'FLIGHT_REFUND',
                                    'enabled': false
                                },
                                {
                                    'type': 'FREQUENT_FLYER_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'SPECIAL_NEEDS_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'CONTACT_DATA_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'EMERGENCY_CONTACT_MODIFICATION',
                                    'enabled': true
                                },
                                {
                                    'type': 'PASSENGER_NAME_CORRECTION',
                                    'enabled': false
                                },
                                {
                                    'type': 'ANCILLARIES',
                                    'enabled': true
                                },
                                {
                                    'type': 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_MODIFICATION_FLEXIBLE',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_DISRUPTION_SEARCH',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_MODIFICATION_ON_DEMAND',
                                    'enabled': false
                                }
                            ]
                        }
                    ],
                    'warnings': [{},{}]
                }
            ],
            'price': {
                'fare': 860,
                'tax': 28.27,
                'total': 888.27,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'primaryContactInfo': {
                'phone': '34987456321',
                'email': 'TEST@TEST.COM',
                'phoneType': 'MOBILE'
            },
            'optionalInformation': [],
            'cashAviosPossibilities': [],
            'specialDiscounts': [],
            'checkedBagAllowances': [
                {
                    'type': 'PIECE',
                    'segmentIds': [
                        'IB896220210313',
                        'IB849120210313',
                        'IB849420210320',
                        'IB896320210320'
                    ],
                    'totalQuantity': 1
                }
            ],
            'accrualQuote': {
                'redemptionPoints': 2000,
                'qualificationPoints': 300
            },
            'aviosRedeemed': null,
            'pointsRedeemed': null
        },
        'passengers': [
            {
                'passengerType': 'ADULT',
                'personalInfo': {
                    'name': 'TEST',
                    'surname': 'TEST',
                    'birthDate': null
                },
                'passengerId': 'ADULT_01',
                'contactInfo': {
                    'phone': '34987456321',
                    'email': 'TEST@TEST.COM',
                    'phoneType': 'MOBILE'
                },
                'ckiStatus': null,
                'optionalInformation': []
            }
        ],
        'tickets': [
            {
                'ticketNumbers': [
                    '0752392721174'
                ],
                'type': 'ET',
                'orderItemId': 'IB0b2c8cd36f0d4c3b94e4c09e3db86aa0OP_01',
                'passengerId': 'ADULT_01',
                'issueDateTime': '2020-11-23 00: 00',
                'fareCalculation': 'MAD IB X/MAH IB PMI380.00IB X/MAH IB MAD380.00EUR760.00END',
                'taxes': [
                    {
                        'code': 'JD',
                        'amount': 21.05,
                        'currency': 'EUR',
                        'description': ''
                    },
                    {
                        'code': 'OG',
                        'amount': 1.56,
                        'currency': 'EUR',
                        'description': ''
                    },
                    {
                        'code': 'QV',
                        'amount': 5.66,
                        'currency': 'EUR',
                        'description': ''
                    }
                ],
                'coupons': [
                    {
                        'arrival': 'MAH',
                        'departure': 'MAD',
                        'departureDate': '2021-03-13T11: 15: 00.000',
                        'status': 'OPEN FOR USE',
                        'fareBasis': 'YJ',
                        'carrier': 'IB',
                        'flightNumber': '8962',
                        'flightStatus': 'OK',
                        'operatingCarrier': null,
                        'bookingCode': 'Y',
                        'designator': '',
                        'couponNumber': '1',
                        'remark': null,
                        'baggageDetail': {
                            'freeAllowance': 1,
                            'quantityCode': 'N',
                            'unitQualifier': null
                        }
                    },
                    {
                        'arrival': 'PMI',
                        'departure': 'MAH',
                        'departureDate': '2021-03-13T15: 30: 00.000',
                        'status': 'OPEN FOR USE',
                        'fareBasis': 'YJ',
                        'carrier': 'IB',
                        'flightNumber': '8491',
                        'flightStatus': 'OK',
                        'operatingCarrier': null,
                        'bookingCode': 'Y',
                        'designator': '',
                        'couponNumber': '2',
                        'remark': null,
                        'baggageDetail': {
                            'freeAllowance': 1,
                            'quantityCode': 'N',
                            'unitQualifier': null
                        }
                    },
                    {
                        'arrival': 'MAH',
                        'departure': 'PMI',
                        'departureDate': '2021-03-20T08: 45: 00.000',
                        'status': 'OPEN FOR USE',
                        'fareBasis': 'YJ',
                        'carrier': 'IB',
                        'flightNumber': '8494',
                        'flightStatus': 'OK',
                        'operatingCarrier': null,
                        'bookingCode': 'Y',
                        'designator': '',
                        'couponNumber': '3',
                        'remark': null,
                        'baggageDetail': {
                            'freeAllowance': 1,
                            'quantityCode': 'N',
                            'unitQualifier': null
                        }
                    },
                    {
                        'arrival': 'MAD',
                        'departure': 'MAH',
                        'departureDate': '2021-03-20T13:20: 00.000',
                        'status': 'OPEN FOR USE',
                        'fareBasis': 'YJ',
                        'carrier': 'IB',
                        'flightNumber': '8963',
                        'flightStatus': 'OK',
                        'operatingCarrier': null,
                        'bookingCode': 'Y',
                        'designator': '',
                        'couponNumber': '4',
                        'remark': null,
                        'baggageDetail': {
                            'freeAllowance': 1,
                            'quantityCode': 'N',
                            'unitQualifier': null
                        }
                    }
                ],
                'iataCode': '78496445',
                'issueCity': 'MAD',
                'passengerType': 'ADULT',
                'paymentInfo': {
                    'type': 'CREDIT_CARD',
                    'amount': 788.27
                },
                'emdsList': [],
                'taxedPrice': {
                    'fare': 760,
                    'tax': 28.27,
                    'total': 788.27,
                    'currency': 'EUR',
                    'ticketingFee': 0
                }
            },
            {
                'ticketNumbers': [
                    '0755569140748'
                ],
                'type': 'EMD',
                'orderItemId': 'IB0b2c8cd36f0d4c3b94e4c09e3db86aa0OP_02',
                'passengerId': 'ADULT_01',
                'issueDateTime': null,
                'fareCalculation': null,
                'taxes': [],
                'coupons': [
                    {
                        'arrival': null,
                        'departure': null,
                        'departureDate': null,
                        'status': 'OPEN FOR USE',
                        'fareBasis': null,
                        'carrier': null,
                        'flightNumber': null,
                        'flightStatus': null,
                        'operatingCarrier': null,
                        'bookingCode': null,
                        'designator': null,
                        'couponNumber': null,
                        'remark': null,
                        'baggageDetail': null
                    },
                    {
                        'arrival': null,
                        'departure': null,
                        'departureDate': null,
                        'status': 'OPEN FOR USE',
                        'fareBasis': null,
                        'carrier': null,
                        'flightNumber': null,
                        'flightStatus': null,
                        'operatingCarrier': null,
                        'bookingCode': null,
                        'designator': null,
                        'couponNumber': null,
                        'remark': null,
                        'baggageDetail': null
                    }
                ],
                'iataCode': null,
                'issueCity': null,
                'passengerType': null,
                'paymentInfo': null,
                'emdsList': [],
                'taxedPrice': null
            },
            {
                'ticketNumbers': [
                    '0755569140747'
                ],
                'type': 'EMD',
                'orderItemId': 'IB0b2c8cd36f0d4c3b94e4c09e3db86aa0OP_03',
                'passengerId': 'ADULT_01',
                'issueDateTime': null,
                'fareCalculation': null,
                'taxes': [],
                'coupons': [
                    {
                        'arrival': null,
                        'departure': null,
                        'departureDate': null,
                        'status': 'OPEN FOR USE',
                        'fareBasis': null,
                        'carrier': null,
                        'flightNumber': null,
                        'flightStatus': null,
                        'operatingCarrier': null,
                        'bookingCode': null,
                        'designator': null,
                        'couponNumber': null,
                        'remark': null,
                        'baggageDetail': null
                    },
                    {
                        'arrival': null,
                        'departure': null,
                        'departureDate': null,
                        'status': 'OPEN FOR USE',
                        'fareBasis': null,
                        'carrier': null,
                        'flightNumber': null,
                        'flightStatus': null,
                        'operatingCarrier': null,
                        'bookingCode': null,
                        'designator': null,
                        'couponNumber': null,
                        'remark': null,
                        'baggageDetail': null
                    }
                ],
                'iataCode': null,
                'issueCity': null,
                'passengerType': null,
                'paymentInfo': null,
                'emdsList': [],
                'taxedPrice': null
            }
        ],
        'paymentItems': [
            {
                'type': 'IBERIA_PAY',
                'tokenizedCardNumber': '8100000000079999',
                'maskedCardNumber': null,
                'authorization': null,
                'subtotal': null,
                'totalFee': null,
                'total': null,
                'unityFee': null,
                'currency': null
            }
        ],
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '€',
                    'alignment': 'R',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        },
        'fareFamilyConditions': [
            {
                'cabinType': 'E',
                'cabinDescription': 'Turista',
                'commercialCode': 'TFLESEU',
                'commercialName': 'Flexible',
                'commercialNameES': 'Flexible',
                'priority': 0,
                'conditions': [
                    {
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'text': '1 bulto (56x40x25cm)',
                        'units': 1,
                        'extendedInfo': {
                            'title': '1 bulto en cabina  (56x40x25cm)',
                            'message': '1 bulto (56x40x25cm)',
                            'code': 'CA_EQP_MANO_10KG',
                            'conditionStatus': true
                        }
                    },
                    {
                        'code': 'EQBODEGA',
                        'name': 'Equipaje en bodega',
                        'text': '1 pieza',
                        'units': 1,
                        'extendedInfo': {
                            'title': '1 equipaje en bodega',
                            'message': 'Incluido: 1 pieza',
                            'code': 'CA_1_PIEZAS',
                            'conditionStatus': true
                        }
                    },
                    {
                        'code': 'ASIENTO',
                        'name': 'Selección de asiento',
                        'text': 'Incluido',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Con selección de asiento',
                            'message': 'Incluido',
                            'code': 'CA_Asiento_Gratuito',
                            'conditionStatus': true
                        }
                    },
                    {
                        'code': 'CAMBIO',
                        'name': 'Cambios',
                        'text': 'Permitidos en cualquier momento',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Cambio permitido',
                            'message': 'Permitidos en cualquier momento',
                            'code': 'CA_CAMBIO SIEMPRE',
                            'conditionStatus': true
                        }
                    },
                    {
                        'code': 'REEMBOLSO',
                        'name': 'Reembolso (por sentido)',
                        'text': 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        'units': 60,
                        'extendedInfo': {
                            'title': 'Reembolso permitido con coste 60€. No Show no permitido',
                            'message': 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                            'code': 'CA_REEMBOLSO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus': false
                        }
                    }
                ],
                'conditionsPriority': [
                    'EQMANO',
                    'EQBODEGA',
                    'ASIENTO',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        'channel': 'IBCOM',
        'onHoldInformation': null,
        'relatedContent': [{value:''}],
        'qualifiers': [],
        'reportingWeb': {
            'device': 'DAAC',
            'idColective': '',
            'officeIata': 'MADIB08AB',
            'iata': 'I',
            'product': '1'
        },
        'flexibilizationCapabilitiesInformation': null,
        'genericDisruptionCapabilitiesInformation': null,
        'upgInformation': {
            'url': 'http://pree.iberia.es/web/retrievePNR.do?apellido=TEST&localizador=V6YAO5&goStraightTo=upgrading&market=ES&language=es',
            'flightsInformation': [
                {
                    'flightOrder': 1,
                    'bidToBusiness': {
                        'biddable': false,
                        'businessBenefit': 0,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    },
                    'bidToTouristPremium': {
                        'biddable': false,
                        'businessBenefit': -1,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    }
                },
                {
                    'flightOrder': 2,
                    'bidToBusiness': {
                        'biddable': false,
                        'businessBenefit': 0,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    },
                    'bidToTouristPremium': {
                        'biddable': false,
                        'businessBenefit': -1,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    }
                },
                {
                    'flightOrder': 3,
                    'bidToBusiness': {
                        'biddable': false,
                        'businessBenefit': 0,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    },
                    'bidToTouristPremium': {
                        'biddable': false,
                        'businessBenefit': -1,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    }
                },
                {
                    'flightOrder': 4,
                    'bidToBusiness': {
                        'biddable': false,
                        'businessBenefit': 0,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    },
                    'bidToTouristPremium': {
                        'biddable': false,
                        'businessBenefit': -1,
                        'minimumBid': -1,
                        'maximumBid': -1,
                        'userCurrentBid': -1,
                        'biddingCurrency': null,
                        'userBidBlocked': false,
                        'userBidClosed': false,
                        'userBidResolved': false,
                        'userBidGranted': false
                    }
                }
            ],
            'bidable': false
        },
        'orderFlags': [
            {
                'type': 'PRINT_ITINERARY',
                'enabled': true
            },
            {
                'type': 'ON_BUSINESS_MODIFICATION',
                'enabled': true
            },
            {
                'type': 'VOUCHER_REFUND',
                'enabled': false
            },
            {
                'type': 'CASH_TOTAL_REFUND',
                'enabled': false
            },
            {
                'type': 'CASH_PARTIAL_REFUND',
                'enabled': false
            },
            {
                'type': 'ALLOWED_REFUND_CASH',
                'enabled': false
            },
            {
                'type': 'ALLOWED_REFUND_VOUCHER',
                'enabled': false
            },
            {
                'type': 'VOUCHER_REFUND_ON_DEMAND',
                'enabled': false
            },
            {
                'type': 'VOUCHER_REFUND_RESTRICTION',
                'enabled': false
            },
            {
                'type': 'ALLOWED_SISTER_CITIES',
                'enabled': false
            },
            {
                'type': 'ALLOWED_VOUCHER_COMPENSATION',
                'enabled': true
            }
        ],
        'isAirShuttle': false,
        'isOnHold': false
    };
    fakeFareData = {
        'responseId':'TWFuYWdlTXlCb29raW5nQElCN2YyNjk1OGMxN2QwNGYyNDk3Y2MxYTE0ZTI5NGViMDc%3D',
        'offers':[
            {
                'offerId':'IBfddde7228470494ca62479662bd89523OP',
                'compensationInfo':{
                    'totalCompensation':545.71,
                    'totalCost':-445.71,
                    'currency':'EUR',
                    'fareChangesCompensation':[
                        {
                            total: 100,
                            quantity: 100,
                            passengerType: 'ADULT'
                        }
                    ],
                    'fareChangesCost': [{
                        total: 100,
                        quantity: 100,
                        passengerType: 'ADULT'
                    },
                    {
                        total: 100,
                        quantity: 100,
                        passengerType: 'CHILD'
                    },
                    {
                        total: 100,
                        quantity: 100,
                        passengerType: 'INFANT'
                    },
                    {
                        total: 100,
                        quantity: 100,
                        passengerType: 'ADULT'
                    }],
                    'fareChanges':[
                        {
                            'totalCost':-445.71,
                            'compensation':-445.71,
                            'reIssue':-445.71,
                            'penalty':0,
                            'passengerIds':[
                                'ADULT_01'
                            ]
                        }
                    ],
                    'emds':[
                        {
                            'type':'BAGGAGE',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        },
                        {
                            'type':'SEAT',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        }
                    ]
                },
                'price':{
                    'fare':-445.71,
                    'tax':0,
                    'total':-445.71,
                    'currency':'EUR',
                    'ticketingFee':0
                },
                'slices':[
                    {
                        'sliceId':'MADPMI20201127072000',
                        'departureDateTime':'2020-11-27 07:20',
                        'arrivalDateTime':'2020-11-27 08:40',
                        'duration':80,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':74,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'NZNNM3',
                                        'segmentsIds':[
                                            'IB391820201127'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'21 NOEND/CHG RST/REF NOPER'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3918',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32Q',
                                        'description':'Airbus A321neo'
                                    }
                                },
                                'cabin':{
                                    'rbd':'N',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':5,
                                    'fareFamily':'TCLESES',
                                    'fareBasis':'NZNNM3',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391820201127',
                                'duration':80,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-27 07:20',
                                'arrivalDateTime':'2020-11-27 08:40',
                                'warnings': [{}]
                            }
                        ],
                        'overnight':false
                    },
                    {
                        'sliceId':'PMIMAD20201130133000',
                        'departureDateTime':'2020-11-30 13:30',
                        'arrivalDateTime':'2020-11-30 14:55',
                        'duration':85,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':241,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'KDNNS2',
                                        'segmentsIds':[
                                            'IB391920201130'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'CHGS AND REF PERMITTED'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3919',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32A',
                                        'description':'Airbus Industrie A320 (Sharklets)'
                                    }
                                },
                                'cabin':{
                                    'rbd':'K',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':9,
                                    'fareFamily':'TFLESEU',
                                    'fareBasis':'KDNNS2',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391920201130',
                                'duration':85,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-30 13:30',
                                'arrivalDateTime':'2020-11-30 14:55'
                            }
                        ],
                        'overnight':false
                    }
                ],
                'offerExpiration':'2020-11-25T12:01:07.155+01:00',
                'paymentTimeLimit':'2020-11-25T22:59:59.000+00:00',
                'cashAviosPossibilities':[
                    {
                        'totalDiscount':10,
                        'currency':'EUR',
                        'aviosRequired':1850,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':10,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':94.5,
                        'currency':'EUR',
                        'aviosRequired':17500,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':94.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':157.5,
                        'currency':'EUR',
                        'aviosRequired':29165,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':157.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':252,
                        'currency':'EUR',
                        'aviosRequired':46665,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':252,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':299.25,
                        'currency':'EUR',
                        'aviosRequired':55415,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':299.25,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    }
                ],
                'carryOnBaggageAllowances':[
                    {
                        'totalQuantity':1,
                        'segmentIds':[
                            'IB391820201127',
                            'IB391920201130'
                        ],
                        'pieceAllowances':null
                    }
                ],
                'checkedBagAllowances':[
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391920201130'
                        ]
                    },
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391820201127'
                        ]
                    }
                ],
                'availableServices':[

                ],
                'selectedServices':[

                ],
                'reshopOfferInformation':{
                    'originalPrice':{
                        'fare':760,
                        'tax':28.27,
                        'total':788.27,
                        'currency':'EUR',
                        'ticketingFee':0
                    },
                    'penalty':0,
                    'reshopTicketingInformationWebResponse':[
                        {
                            'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                            'taxes':[
                                {
                                    'code':'QV',
                                    'amount':5.93,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.18,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':20.45,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'originalTaxes':[
                                {
                                    'code':'QV',
                                    'amount':5.66,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.56,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':21.05,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'penalty':0,
                            'price':{
                                'fare':315,
                                'tax':27.56,
                                'total':342.56,
                                'currency':'EUR',
                                'ticketingFee':0
                            },
                            'reissuePrice':-445.71,
                            'farebasis':'NZNNM3',
                            'passengersIds':[
                                'ADULT_01'
                            ]
                        }
                    ]
                },
                'offerItems':[
                    {
                        'offerItemId':'IBfddde7228470494ca62479662bd89523OP_01',
                        'passengerIds':[
                            'ADULT_01'
                        ],
                        'price':{
                            'fare':-445,
                            'tax':-0.71,
                            'total':-445.71,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'detailedTaxes':[
                            {
                                'code':'QV',
                                'amount':0.27,
                                'currency':'EUR',
                                'description':'QV',
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':-0.38,
                                'currency':'EUR',
                                'description':'OG',
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':-0.6,
                                'currency':'EUR',
                                'description':'JD',
                                'subcode':'003'
                            }
                        ],
                        'reshopDetailedTaxes':[
                            {
                                'code':'QV',
                                'amount':5.93,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':1.18,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':20.45,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            }
                        ],
                        'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                        'fareComponents':[
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          FIRST CHANGE FREE FOR TICKETING ON/BEFORE 31DEC20\n          AND TRAVEL ON/BEFORE 30JUN 21\n          IF CHANGE IS DONE 15DAYS BEFORE DEPARTURE OF\n          FIRST SCHEDULE FLIGHT.\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391820201127'
                                ],
                                'details':[
                                    {
                                        'type':'Change',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Change',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[
                                    {
                                        'segmentReferences':[
                                            'IB391820201127'
                                        ],
                                        'productName':'',
                                        'subProductName':'',
                                        'fareCode':'',
                                        'fareBasisCode':'NZNNM3',
                                        'accountCode':'',
                                        'tourBoxcode':null,
                                        'fareBoxText':null,
                                        'accountCodeAmadeus':''
                                    }
                                ]
                            },
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n  CHANGES\n    CHANGES PERMITTED FOR NO-SHOW.\n    BEFORE DEPARTURE\n      CHANGES PERMITTED.\n    AFTER DEPARTURE\n      CHANGES PERMITTED.\n         NOTE -\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          NO SHOW IS WHEN A PASSENGER HAS NOT ADVISED THE\n          AIRLINE THAT THEY WILL NO ABLE TO MAKE THE FLIGHT\n          THEY ARE BOOKED ON.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          REISSUE MUST BE MADE AT THE SAME TIME AS CHANGE\n          OF RESERVATION BUT NO LATER TAN SCHEDULED\n          DEPARTURE TIME OF FLIGHT BEING CHANGED.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AFTER SCHEDULED\n          FLIGHT NO SHOW IS PERMITTED\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391920201130'
                                ],
                                'details':[
                                    {
                                        'type':'Cancel',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Cancel',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[

                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        'passengers':[
            {
                'passengerId':'ADULT_01',
                'passengerType':'ADULT',
                'firstName':null,
                'surname':null,
                'frequentFlyerInfo':null
            }
        ],
        'contextMetadata':{
            'language':'es',
            'country':'ES',
            'currencies':[
                {
                    'code':'EUR',
                    'description':'Euro',
                    'symbol':'€',
                    'alignment':'R',
                    'groupingSeparator':'.',
                    'decimalSeparator':',',
                    'decimals':2,
                    'recommendedDisplay':'symbol'
                }
            ]
        },
        'fareFamilyConditions':[
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TCLESES',
                'commercialName':'Óptima',
                'commercialNameES':'Óptima',
                'priority':700,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Gratuita desde 24 horas antes del vuelo. ',
                        'units':24,
                        'extendedInfo':{
                            'title':'Gratuita desde 24 horas antes del vuelo. ',
                            'message':'Gratuita desde 24 horas antes del vuelo. ',
                            'code':'CA_Asiento_Gratis_24_horas',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units':45,
                        'extendedInfo':{
                            'title':'Cambio permitido con coste 45€. No Show no permite cambio',
                            'message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'No permitido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Reembolso no permitido',
                            'message':'No permitido.',
                            'code':'CA_REEMBOLSO NO PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            },
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TFLESEU',
                'commercialName':'Flexible',
                'commercialNameES':'Flexible',
                'priority':500,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Incluido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Con selección de asiento',
                            'message':'Incluido',
                            'code':'CA_Asiento_Gratuito',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento',
                        'units':null,
                        'extendedInfo':{
                            'title':'Cambio permitido',
                            'message':'Permitidos en cualquier momento',
                            'code':'CA_CAMBIO SIEMPRE',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        'units':60,
                        'extendedInfo':{
                            'title':'Reembolso permitido con coste 60€. No Show no permitido',
                            'message':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                            'code':'CA_REEMBOLSO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        'advices':[

        ],
        'services':[

        ],
        'warnings':null,
        'accountCodes':null,
        'compensationInfo':{
            'totalCompensation':545.71,
            'totalCost':-445.71,
            'currency':'EUR',
            'fareChanges':[
                {
                    'totalCost':-445.71,
                    'compensation':-445.71,
                    'reIssue':-445.71,
                    'penalty':0,
                    'passengerIds':[
                        'ADULT_01'
                    ]
                }
            ],
            'emds':[
                {
                    'type':'BAGGAGE',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                },
                {
                    'type':'SEAT',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                }
            ]
        },
        'relatedContent': [{value:''}]
    };

    fakeFareData1 = {
        'responseId':'TWFuYWdlTXlCb29raW5nQElCN2YyNjk1OGMxN2QwNGYyNDk3Y2MxYTE0ZTI5NGViMDc%3D',
        'offers':[
            {
                'offerId':'IBfddde7228470494ca62479662bd89523OP',
                'compensationInfo':{
                    'totalCompensation':545.71,
                    'totalCost':-445.71,
                    'currency':'EUR',
                    'fareChangesCost': [{
                        total: 100,
                        quantity: 1,
                        passengerType: 'ADULT',
                        unitPrice: 2
                    },{
                        total: 100,
                        quantity: 1,
                        passengerType: 'CHILD',
                        unitPrice: 2
                    },{
                        total: 100,
                        quantity: 1,
                        passengerType: 'INFANT',
                        unitPrice: 2
                    },{
                        total: 100,
                        quantity: 1,
                        passengerType: 'default',
                        unitPrice: 2
                    }],
                    fareChangesCompensation: [],
                    'fareChanges':[
                        {
                            'totalCost':-445.71,
                            'compensation':-445.71,
                            'reIssue':-445.71,
                            'penalty':0,
                            'passengerIds':[
                                'ADULT_01'
                            ]
                        }
                    ],
                    'emds':[
                        {
                            'type':'BAGGAGE',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        },
                        {
                            'type':'SEAT',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        }
                    ]
                },
                'price':{
                    'fare':-445.71,
                    'tax':0,
                    'total':-445.71,
                    'currency':'EUR',
                    'ticketingFee':0
                },
                'slices':[
                    {
                        'sliceId':'MADPMI20201127072000',
                        'departureDateTime':'2020-11-27 07:20',
                        'arrivalDateTime':'2020-11-27 08:40',
                        'duration':80,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':74,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'NZNNM3',
                                        'segmentsIds':[
                                            'IB391820201127'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'21 NOEND/CHG RST/REF NOPER'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3918',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32Q',
                                        'description':'Airbus A321neo'
                                    }
                                },
                                'cabin':{
                                    'rbd':'N',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':5,
                                    'fareFamily':'TCLESES',
                                    'fareBasis':'NZNNM3',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391820201127',
                                'duration':80,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-27 07:20',
                                'arrivalDateTime':'2020-11-27 08:40'
                            }
                        ],
                        'overnight':false
                    }
                ],
                'offerExpiration':'2020-11-25T12:01:07.155+01:00',
                'paymentTimeLimit':'2020-11-25T22:59:59.000+00:00',
                'cashAviosPossibilities':[
                    {
                        'totalDiscount':10,
                        'currency':'EUR',
                        'aviosRequired':1850,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':10,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':94.5,
                        'currency':'EUR',
                        'aviosRequired':17500,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':94.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':157.5,
                        'currency':'EUR',
                        'aviosRequired':29165,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':157.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':252,
                        'currency':'EUR',
                        'aviosRequired':46665,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':252,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':299.25,
                        'currency':'EUR',
                        'aviosRequired':55415,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':299.25,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    }
                ],
                'carryOnBaggageAllowances':[
                    {
                        'totalQuantity':1,
                        'segmentIds':[
                            'IB391820201127',
                            'IB391920201130'
                        ],
                        'pieceAllowances':null
                    }
                ],
                'checkedBagAllowances':[
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391920201130'
                        ]
                    },
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391820201127'
                        ]
                    }
                ],
                'availableServices':[

                ],
                'selectedServices':[

                ],
                'reshopOfferInformation':{
                    'originalPrice':{
                        'fare':760,
                        'tax':28.27,
                        'total':788.27,
                        'currency':'EUR',
                        'ticketingFee':0
                    },
                    'penalty':0,
                    'reshopTicketingInformationWebResponse':[
                        {
                            'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                            'taxes':[
                                {
                                    'code':'QV',
                                    'amount':5.93,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.18,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':20.45,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'originalTaxes':[
                                {
                                    'code':'QV',
                                    'amount':5.66,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.56,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':21.05,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'penalty':0,
                            'price':{
                                'fare':315,
                                'tax':27.56,
                                'total':342.56,
                                'currency':'EUR',
                                'ticketingFee':0
                            },
                            'reissuePrice':-445.71,
                            'farebasis':'NZNNM3',
                            'passengersIds':[
                                'ADULT_01'
                            ]
                        }
                    ]
                },
                'offerItems':[
                    {
                        'offerItemId':'IBfddde7228470494ca62479662bd89523OP_01',
                        'passengerIds':[
                            'ADULT_01'
                        ],
                        'price':{
                            'fare':-445,
                            'tax':-0.71,
                            'total':-445.71,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'detailedTaxes':[
                            {
                                'code':'QV',
                                'amount':0.27,
                                'currency':'EUR',
                                'description':'QV',
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':-0.38,
                                'currency':'EUR',
                                'description':'OG',
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':-0.6,
                                'currency':'EUR',
                                'description':'JD',
                                'subcode':'003'
                            }
                        ],
                        'reshopDetailedTaxes':[
                            {
                                'code':'QV',
                                'amount':5.93,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':1.18,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':20.45,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            }
                        ],
                        'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                        'fareComponents':[
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          FIRST CHANGE FREE FOR TICKETING ON/BEFORE 31DEC20\n          AND TRAVEL ON/BEFORE 30JUN 21\n          IF CHANGE IS DONE 15DAYS BEFORE DEPARTURE OF\n          FIRST SCHEDULE FLIGHT.\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391820201127'
                                ],
                                'details':[
                                    {
                                        'type':'Change',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Change',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[
                                    {
                                        'segmentReferences':[
                                            'IB391820201127'
                                        ],
                                        'productName':'',
                                        'subProductName':'',
                                        'fareCode':'',
                                        'fareBasisCode':'NZNNM3',
                                        'accountCode':'',
                                        'tourBoxcode':null,
                                        'fareBoxText':null,
                                        'accountCodeAmadeus':''
                                    }
                                ]
                            },
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n  CHANGES\n    CHANGES PERMITTED FOR NO-SHOW.\n    BEFORE DEPARTURE\n      CHANGES PERMITTED.\n    AFTER DEPARTURE\n      CHANGES PERMITTED.\n         NOTE -\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          NO SHOW IS WHEN A PASSENGER HAS NOT ADVISED THE\n          AIRLINE THAT THEY WILL NO ABLE TO MAKE THE FLIGHT\n          THEY ARE BOOKED ON.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          REISSUE MUST BE MADE AT THE SAME TIME AS CHANGE\n          OF RESERVATION BUT NO LATER TAN SCHEDULED\n          DEPARTURE TIME OF FLIGHT BEING CHANGED.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AFTER SCHEDULED\n          FLIGHT NO SHOW IS PERMITTED\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391920201130'
                                ],
                                'details':[
                                    {
                                        'type':'Cancel',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Cancel',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[

                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        'passengers':[
            {
                'passengerId':'ADULT_01',
                'passengerType':'ADULT',
                'firstName':null,
                'surname':null,
                'frequentFlyerInfo':null
            }
        ],
        'contextMetadata':{
            'language':'es',
            'country':'ES',
            'currencies':[
                {
                    'code':'EUR',
                    'description':'Euro',
                    'symbol':'€',
                    'alignment':'R',
                    'groupingSeparator':'.',
                    'decimalSeparator':',',
                    'decimals':2,
                    'recommendedDisplay':'symbol'
                }
            ]
        },
        'fareFamilyConditions':[
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TCLESES',
                'commercialName':'Óptima',
                'commercialNameES':'Óptima',
                'priority':700,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Gratuita desde 24 horas antes del vuelo. ',
                        'units':24,
                        'extendedInfo':{
                            'title':'Gratuita desde 24 horas antes del vuelo. ',
                            'message':'Gratuita desde 24 horas antes del vuelo. ',
                            'code':'CA_Asiento_Gratis_24_horas',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units':45,
                        'extendedInfo':{
                            'title':'Cambio permitido con coste 45€. No Show no permite cambio',
                            'message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'No permitido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Reembolso no permitido',
                            'message':'No permitido.',
                            'code':'CA_REEMBOLSO NO PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            },
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TFLESEU',
                'commercialName':'Flexible',
                'commercialNameES':'Flexible',
                'priority':500,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Incluido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Con selección de asiento',
                            'message':'Incluido',
                            'code':'CA_Asiento_Gratuito',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento',
                        'units':null,
                        'extendedInfo':{
                            'title':'Cambio permitido',
                            'message':'Permitidos en cualquier momento',
                            'code':'CA_CAMBIO SIEMPRE',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        'units':60,
                        'extendedInfo':{
                            'title':'Reembolso permitido con coste 60€. No Show no permitido',
                            'message':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                            'code':'CA_REEMBOLSO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        'advices':[

        ],
        'services':[

        ],
        'warnings':null,
        'accountCodes':null,
        'compensationInfo':{
            'totalCompensation':545.71,
            'totalCost':-445.71,
            'currency':'EUR',
            'fareChanges':[
                {
                    'totalCost':-445.71,
                    'compensation':-445.71,
                    'reIssue':-445.71,
                    'penalty':0,
                    'passengerIds':[
                        'ADULT_01'
                    ]
                }
            ],
            'emds':[
                {
                    'type':'BAGGAGE',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                },
                {
                    'type':'SEAT',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                }
            ]
        }
    };
    fakeFareData2 = {
        'responseId':'TWFuYWdlTXlCb29raW5nQElCN2YyNjk1OGMxN2QwNGYyNDk3Y2MxYTE0ZTI5NGViMDc%3D',
        'offers':[
            {
                'offerId':'IBfddde7228470494ca62479662bd89523OP',
                'compensationInfo':{
                    'totalCompensation':545.71,
                    'totalCost':-445.71,
                    'currency':'EUR',
                    'fareChangesCompensation':[],
                    'fareChangesCost': [],
                    'fareChanges':[
                        {
                            'totalCost':-445.71,
                            'compensation':-445.71,
                            'reIssue':-445.71,
                            'penalty':0,
                            'passengerIds':[
                                'ADULT_01'
                            ]
                        }
                    ],
                    'emds':[
                        {
                            'type':'BAGGAGE',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        },
                        {
                            'type':'SEAT',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        }
                    ]
                },
                'price':{
                    'fare':-445.71,
                    'tax':0,
                    'total':-445.71,
                    'currency':'EUR',
                    'ticketingFee':0
                },
                'slices':[
                    {
                        'sliceId':'MADPMI20201127072000',
                        'departureDateTime':'2020-11-27 07:20',
                        'arrivalDateTime':'2020-11-27 08:40',
                        'duration':80,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':74,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'NZNNM3',
                                        'segmentsIds':[
                                            'IB391820201127'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'21 NOEND/CHG RST/REF NOPER'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3918',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32Q',
                                        'description':'Airbus A321neo'
                                    }
                                },
                                'cabin':{
                                    'rbd':'N',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':5,
                                    'fareFamily':'TCLESES',
                                    'fareBasis':'NZNNM3',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391820201127',
                                'duration':80,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-27 07:20',
                                'arrivalDateTime':'2020-11-27 08:40'
                            }
                        ],
                        'overnight':false
                    },
                    {
                        'sliceId':'MADPMI20201127072000',
                        'departureDateTime':'2020-11-27 07:20',
                        'arrivalDateTime':'2020-11-27 08:40',
                        'duration':80,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':74,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'NZNNM3',
                                        'segmentsIds':[
                                            'IB391820201127'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'21 NOEND/CHG RST/REF NOPER'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3918',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32Q',
                                        'description':'Airbus A321neo'
                                    }
                                },
                                'cabin':{
                                    'rbd':'N',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':5,
                                    'fareFamily':'TCLESES',
                                    'fareBasis':'NZNNM3',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391820201127',
                                'duration':80,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-27 07:20',
                                'arrivalDateTime':'2020-11-27 08:40'
                            }
                        ],
                        'overnight':false
                    }
                ],
                'offerExpiration':'2020-11-25T12:01:07.155+01:00',
                'paymentTimeLimit':'2020-11-25T22:59:59.000+00:00',
                'cashAviosPossibilities':[
                    {
                        'totalDiscount':10,
                        'currency':'EUR',
                        'aviosRequired':1850,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':10,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':94.5,
                        'currency':'EUR',
                        'aviosRequired':17500,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':94.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':157.5,
                        'currency':'EUR',
                        'aviosRequired':29165,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':157.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':252,
                        'currency':'EUR',
                        'aviosRequired':46665,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':252,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':299.25,
                        'currency':'EUR',
                        'aviosRequired':55415,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':299.25,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    }
                ],
                'carryOnBaggageAllowances':[
                    {
                        'totalQuantity':1,
                        'segmentIds':[
                            'IB391820201127',
                            'IB391920201130'
                        ],
                        'pieceAllowances':null
                    }
                ],
                'checkedBagAllowances':[
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391920201130'
                        ]
                    },
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391820201127'
                        ]
                    }
                ],
                'availableServices':[

                ],
                'selectedServices':[

                ],
                'reshopOfferInformation':{
                    'originalPrice':{
                        'fare':760,
                        'tax':28.27,
                        'total':788.27,
                        'currency':'EUR',
                        'ticketingFee':0
                    },
                    'penalty':0,
                    'reshopTicketingInformationWebResponse':[
                        {
                            'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                            'taxes':[
                                {
                                    'code':'QV',
                                    'amount':5.93,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.18,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':20.45,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'originalTaxes':[
                                {
                                    'code':'QV',
                                    'amount':5.66,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.56,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':21.05,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'penalty':0,
                            'price':{
                                'fare':315,
                                'tax':27.56,
                                'total':342.56,
                                'currency':'EUR',
                                'ticketingFee':0
                            },
                            'reissuePrice':-445.71,
                            'farebasis':'NZNNM3',
                            'passengersIds':[
                                'ADULT_01'
                            ]
                        }
                    ]
                },
                'offerItems':[
                    {
                        'offerItemId':'IBfddde7228470494ca62479662bd89523OP_01',
                        'passengerIds':[
                            'ADULT_01'
                        ],
                        'price':{
                            'fare':-445,
                            'tax':-0.71,
                            'total':-445.71,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'detailedTaxes':[
                            {
                                'code':'QV',
                                'amount':0.27,
                                'currency':'EUR',
                                'description':'QV',
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':-0.38,
                                'currency':'EUR',
                                'description':'OG',
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':-0.6,
                                'currency':'EUR',
                                'description':'JD',
                                'subcode':'003'
                            }
                        ],
                        'reshopDetailedTaxes':[
                            {
                                'code':'QV',
                                'amount':5.93,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':1.18,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':20.45,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            }
                        ],
                        'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                        'fareComponents':[
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          FIRST CHANGE FREE FOR TICKETING ON/BEFORE 31DEC20\n          AND TRAVEL ON/BEFORE 30JUN 21\n          IF CHANGE IS DONE 15DAYS BEFORE DEPARTURE OF\n          FIRST SCHEDULE FLIGHT.\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391820201127'
                                ],
                                'details':[
                                    {
                                        'type':'Change',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Change',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[
                                    {
                                        'segmentReferences':[
                                            'IB391820201127'
                                        ],
                                        'productName':'',
                                        'subProductName':'',
                                        'fareCode':'',
                                        'fareBasisCode':'NZNNM3',
                                        'accountCode':'',
                                        'tourBoxcode':null,
                                        'fareBoxText':null,
                                        'accountCodeAmadeus':''
                                    }
                                ]
                            },
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n  CHANGES\n    CHANGES PERMITTED FOR NO-SHOW.\n    BEFORE DEPARTURE\n      CHANGES PERMITTED.\n    AFTER DEPARTURE\n      CHANGES PERMITTED.\n         NOTE -\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          NO SHOW IS WHEN A PASSENGER HAS NOT ADVISED THE\n          AIRLINE THAT THEY WILL NO ABLE TO MAKE THE FLIGHT\n          THEY ARE BOOKED ON.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          REISSUE MUST BE MADE AT THE SAME TIME AS CHANGE\n          OF RESERVATION BUT NO LATER TAN SCHEDULED\n          DEPARTURE TIME OF FLIGHT BEING CHANGED.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AFTER SCHEDULED\n          FLIGHT NO SHOW IS PERMITTED\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391920201130'
                                ],
                                'details':[
                                    {
                                        'type':'Cancel',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Cancel',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[

                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        'passengers':[
            {
                'passengerId':'ADULT_01',
                'passengerType':'ADULT',
                'firstName':null,
                'surname':null,
                'frequentFlyerInfo':null
            }
        ],
        'contextMetadata':{
            'language':'es',
            'country':'ES',
            'currencies':[
                {
                    'code':'EUR',
                    'description':'Euro',
                    'symbol':'€',
                    'alignment':'R',
                    'groupingSeparator':'.',
                    'decimalSeparator':',',
                    'decimals':2,
                    'recommendedDisplay':'symbol'
                }
            ]
        },
        'fareFamilyConditions':[
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TCLESES',
                'commercialName':'Óptima',
                'commercialNameES':'Óptima',
                'priority':700,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Gratuita desde 24 horas antes del vuelo. ',
                        'units':24,
                        'extendedInfo':{
                            'title':'Gratuita desde 24 horas antes del vuelo. ',
                            'message':'Gratuita desde 24 horas antes del vuelo. ',
                            'code':'CA_Asiento_Gratis_24_horas',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units':45,
                        'extendedInfo':{
                            'title':'Cambio permitido con coste 45€. No Show no permite cambio',
                            'message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'No permitido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Reembolso no permitido',
                            'message':'No permitido.',
                            'code':'CA_REEMBOLSO NO PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            },
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TFLESEU',
                'commercialName':'Flexible',
                'commercialNameES':'Flexible',
                'priority':500,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Incluido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Con selección de asiento',
                            'message':'Incluido',
                            'code':'CA_Asiento_Gratuito',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento',
                        'units':null,
                        'extendedInfo':{
                            'title':'Cambio permitido',
                            'message':'Permitidos en cualquier momento',
                            'code':'CA_CAMBIO SIEMPRE',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        'units':60,
                        'extendedInfo':{
                            'title':'Reembolso permitido con coste 60€. No Show no permitido',
                            'message':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                            'code':'CA_REEMBOLSO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        'advices':[

        ],
        'services':[

        ],
        'warnings':null,
        'accountCodes':null,
        'compensationInfo':{
            'totalCompensation':545.71,
            'totalCost':-445.71,
            'currency':'EUR',
            'fareChanges':[
                {
                    'totalCost':-445.71,
                    'compensation':-445.71,
                    'reIssue':-445.71,
                    'penalty':0,
                    'passengerIds':[
                        'ADULT_01'
                    ]
                }
            ],
            'emds':[
                {
                    'type':'BAGGAGE',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                },
                {
                    'type':'SEAT',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                }
            ]
        }
    };
    let fakeoriginalBookingInfo = {
        'order': {
            slices:[{
                segments:[{
                    departureCity: {
                        code: 'code',
                        description: 'des'
                    },
                    arrivalCity: {
                        code: 'code',
                        description: 'des'
                    }
                }],
                sliceId: 'id'

            }]
        }
    };

    beforeEach(() =>  {
        angular.mock.module('ib-MmB-vc-summary-module', 'ib-MmB-services-module', 'ib-MmB-filters-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$filter', $fakeFilter);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
        });
        inject((_IbVcSummaryTransformer_, _localStorageService_) => {
            summaryTransformer = _IbVcSummaryTransformer_;
            localStorageService = _localStorageService_;
            // Clear localStorage before each test
            if (typeof localStorageService.clear === 'function') {
                localStorageService.clear();
            } else if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.clear();
            }
        });
    });

    describe('Generated Summary Model', () => {
        it('when fareData is empty', () => {
            localStorageService.set('isUnifiedFlow', false);
            let fareData = null;
            let summaryModelExpected = {
                fligthsModel: null,
                breakdownModel: null,
                totalPriceModel: null,
                fareComparisonModel: null 
            }
            let summaryModel = summaryTransformer.generateSummaryModel(fareData, 'twice', null, {conditions: [{code: 'test', message: 'testMessage'}]});
            expect(summaryModel).toEqual(summaryModelExpected);
        });


        it('when 1 slices without fareFamilyConditions', (done) => {
            let copyfakeFareData1 = {...fakeFareData1};
            let copyfakeoriginalBookingInfo = {...fakeoriginalBookingInfo};
            let summaryModelExpected = {'fligthsModel':{'outboundFlight':{'flightData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-25 11:25','departureTime':'11:25','arrivalTime':'12:40','arrivalDateTime':'2020-11-25 12:40','departureDate':'2020-11-25','arrivalDate':'2020-11-25','flightScales':'MMB_YOUR_FLIGHTS_DIRECT_TEXT','flightScalesNumber':0,'flightDuration':'0h 52min.','departureCity':'Madrid','arrivalCity':'Málaga','departureAPort':'MAD','arrivalAPort':'AGP','type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND'},'fareFamilyConditions':{'cabin':'Óptima','conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true,'observationCode':null}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true,'observationCode':null}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','code':'CA_Asiento_Gratis_24_horas','conditionStatus':true,'observationCode':null}},{'code':'CAMBIO','name':'Cambios','text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','units':45,'extendedInfo':{'title':'Cambio permitido con coste 45€. No Show no permite cambio','message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO','conditionStatus':false,'observationCode':null}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false,'observationCode':null}}]},'flightNodes':[{'nodeData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-25 11:25','arrivalDateTime':'2020-11-25 12:40','departureTime':'11:25','arrivalTime':'12:40','departureCity':'Madrid','arrivalCity':'Málaga','departureAPort':'MAD','arrivalAPort':'AGP','flightNumber':'Air Nostrum 8946','flightPlane':'Canadair Regional Jet 1000','flightOperator':'Air Nostrum','flightDuration':'0h 52min.','waitingTime':'0h 52min.'},'activationFlags':{},'labels':{'LABEL_OPERATED_BY':'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY'}}]},'returnFlight':{'flightData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 13:15','departureTime':'13:15','arrivalTime':'14:35','arrivalDateTime':'2020-11-27 14:35','departureDate':'2020-11-27','arrivalDate':'2020-11-27','flightScales':'MMB_YOUR_FLIGHTS_DIRECT_TEXT','flightScalesNumber':0,'flightDuration':'0h 52min.','departureCity':'Málaga','arrivalCity':'Madrid','departureAPort':'AGP','arrivalAPort':'MAD','type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN'},'fareFamilyConditions':{'cabin':'Business Flexible','conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true,'observationCode':null}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'2 piezas','units':2,'extendedInfo':{'title':'2 equipajes en bodega ','message':'2 piezas máx 23kg/pieza y 158 cm.  ','code':'CA_2_PIEZAS','conditionStatus':true,'observationCode':null}},{'code':'ASIENTO','name':'Selección de asiento','text':'Incluido','units':null,'extendedInfo':{'title':'Con selección de asiento','message':'Incluido','code':'CA_Asiento_Gratuito','conditionStatus':true,'observationCode':null}},{'code':'CAMBIO','name':'Cambios','text':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€','units':50,'extendedInfo':{'title':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€','message':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ','code':'CA_CAMBIOS PERMITIDOS_NO_SHOW_50€','conditionStatus':true,'observationCode':null}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€','units':75,'extendedInfo':{'title':'Reembolso permitido','message':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€','code':'CA_REEMBOLSO SIEMPRE_NO_SHOW_75€','conditionStatus':true,'observationCode':null}}]},'flightNodes':[{'nodeData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 13:15','arrivalDateTime':'2020-11-27 14:35','departureTime':'13:15','arrivalTime':'14:35','departureCity':'Málaga','arrivalCity':'Madrid','departureAPort':'AGP','arrivalAPort':'MAD','flightNumber':'Air Nostrum 8947','flightPlane':'Canadair Regional Jet 1000','flightOperator':'Air Nostrum','flightDuration':'0h 52min.','waitingTime':'0h 52min.'},'activationFlags':{},'labels':{'LABEL_OPERATED_BY':'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY'}}]}},'breakdownModel':{'refund':null,'toPay':null,'emds':null},'totalPriceModel':{}}
            summaryTransformer.generateSummaryModel(copyfakeFareData1, 'twice', copyfakeoriginalBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
            // expect(summaryModel).toEqual(summaryModelExpected);
            done();
        });

        it('when 1 slices without fareFamilyConditions with other modeFLight', (done) => {
            let copyfakeFareData1 = {...fakeFareData1};
            let copyfakeoriginalBookingInfo = {...fakeoriginalBookingInfo};
            let summaryModelExpected = {'fligthsModel':{'outboundFlight':{'flightData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-25 11:25','departureTime':'11:25','arrivalTime':'12:40','arrivalDateTime':'2020-11-25 12:40','departureDate':'2020-11-25','arrivalDate':'2020-11-25','flightScales':'MMB_YOUR_FLIGHTS_DIRECT_TEXT','flightScalesNumber':0,'flightDuration':'0h 52min.','departureCity':'Madrid','arrivalCity':'Málaga','departureAPort':'MAD','arrivalAPort':'AGP','type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND'},'fareFamilyConditions':{'cabin':'Óptima','conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true,'observationCode':null}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true,'observationCode':null}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','code':'CA_Asiento_Gratis_24_horas','conditionStatus':true,'observationCode':null}},{'code':'CAMBIO','name':'Cambios','text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','units':45,'extendedInfo':{'title':'Cambio permitido con coste 45€. No Show no permite cambio','message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO','conditionStatus':false,'observationCode':null}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false,'observationCode':null}}]},'flightNodes':[{'nodeData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-25 11:25','arrivalDateTime':'2020-11-25 12:40','departureTime':'11:25','arrivalTime':'12:40','departureCity':'Madrid','arrivalCity':'Málaga','departureAPort':'MAD','arrivalAPort':'AGP','flightNumber':'Air Nostrum 8946','flightPlane':'Canadair Regional Jet 1000','flightOperator':'Air Nostrum','flightDuration':'0h 52min.','waitingTime':'0h 52min.'},'activationFlags':{},'labels':{'LABEL_OPERATED_BY':'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY'}}]},'returnFlight':{'flightData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 13:15','departureTime':'13:15','arrivalTime':'14:35','arrivalDateTime':'2020-11-27 14:35','departureDate':'2020-11-27','arrivalDate':'2020-11-27','flightScales':'MMB_YOUR_FLIGHTS_DIRECT_TEXT','flightScalesNumber':0,'flightDuration':'0h 52min.','departureCity':'Málaga','arrivalCity':'Madrid','departureAPort':'AGP','arrivalAPort':'MAD','type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN'},'fareFamilyConditions':{'cabin':'Business Flexible','conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true,'observationCode':null}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'2 piezas','units':2,'extendedInfo':{'title':'2 equipajes en bodega ','message':'2 piezas máx 23kg/pieza y 158 cm.  ','code':'CA_2_PIEZAS','conditionStatus':true,'observationCode':null}},{'code':'ASIENTO','name':'Selección de asiento','text':'Incluido','units':null,'extendedInfo':{'title':'Con selección de asiento','message':'Incluido','code':'CA_Asiento_Gratuito','conditionStatus':true,'observationCode':null}},{'code':'CAMBIO','name':'Cambios','text':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€','units':50,'extendedInfo':{'title':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€','message':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ','code':'CA_CAMBIOS PERMITIDOS_NO_SHOW_50€','conditionStatus':true,'observationCode':null}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€','units':75,'extendedInfo':{'title':'Reembolso permitido','message':'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€','code':'CA_REEMBOLSO SIEMPRE_NO_SHOW_75€','conditionStatus':true,'observationCode':null}}]},'flightNodes':[{'nodeData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 13:15','arrivalDateTime':'2020-11-27 14:35','departureTime':'13:15','arrivalTime':'14:35','departureCity':'Málaga','arrivalCity':'Madrid','departureAPort':'AGP','arrivalAPort':'MAD','flightNumber':'Air Nostrum 8947','flightPlane':'Canadair Regional Jet 1000','flightOperator':'Air Nostrum','flightDuration':'0h 52min.','waitingTime':'0h 52min.'},'activationFlags':{},'labels':{'LABEL_OPERATED_BY':'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY'}}]}},'breakdownModel':{'refund':null,'toPay':null,'emds':null},'totalPriceModel':{}}
            summaryTransformer.generateSummaryModel(copyfakeFareData1, 'other', copyfakeoriginalBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
            // expect(summaryModel).toEqual(summaryModelExpected);
            done();
        });

        it('when 2 slices without fareFamilyConditions', () => {
            let copyfakeFareData2 = {...fakeFareData2};
            let copyfakeoriginalBookingInfo = {...fakeoriginalBookingInfo};
            let summaryModelExpected = {'fligthsModel':{'outboundFlight':{'flightData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 07:20','departureTime':'07:20','arrivalTime':'08:40','arrivalDateTime':'2020-11-27 08:40','departureDate':'2020-11-27','arrivalDate':'2020-11-27','flightScales':'MMB_YOUR_FLIGHTS_DIRECT_TEXT','flightScalesNumber':0,'flightDuration':'0h 52min.','departureCity':'Madrid','arrivalCity':'Palma de Mallorca','departureAPort':'MAD','arrivalAPort':'PMI','type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND'},'fareFamilyConditions':{'cabin':'Óptima','conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true,'observationCode':null}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true,'observationCode':null}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','code':'CA_Asiento_Gratis_24_horas','conditionStatus':true,'observationCode':null}},{'code':'CAMBIO','name':'Cambios','text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','units':45,'extendedInfo':{'title':'Cambio permitido con coste 45€. No Show no permite cambio','message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO','conditionStatus':false,'observationCode':null}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false,'observationCode':null}}]},'flightNodes':[{'nodeData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 07:20','arrivalDateTime':'2020-11-27 08:40','departureTime':'07:20','arrivalTime':'08:40','departureCity':'Madrid','arrivalCity':'Palma de Mallorca','departureAPort':'MAD','arrivalAPort':'PMI','flightNumber':'IB 3918','flightPlane':'Airbus A321neo','flightOperator':'Iberia Express','flightDuration':'0h 52min.','waitingTime':'0h 52min.'},'activationFlags':{},'labels':{'LABEL_OPERATED_BY':'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY'}}]},'returnFlight':{'flightData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 07:20','departureTime':'07:20','arrivalTime':'08:40','arrivalDateTime':'2020-11-27 08:40','departureDate':'2020-11-27','arrivalDate':'2020-11-27','flightScales':'MMB_YOUR_FLIGHTS_DIRECT_TEXT','flightScalesNumber':0,'flightDuration':'0h 52min.','departureCity':'Madrid','arrivalCity':'Palma de Mallorca','departureAPort':'MAD','arrivalAPort':'PMI','type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN'},'fareFamilyConditions':{'cabin':'Óptima','conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true,'observationCode':null}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true,'observationCode':null}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','conditionStatus':true,'observationCode':null, 'code': 'CA_Asiento_Gratis_24_horas'}},{'code':'CAMBIO','name':'Cambios','text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','units':45,'extendedInfo':{'title':'Cambio permitido con coste 45€. No Show no permite cambio','message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio','code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO','conditionStatus':false,'observationCode':null}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false,'observationCode':null}}]},'flightNodes':[{'nodeData':{'icon':'airLogoRouteURI','departureDateTime':'2020-11-27 07:20','arrivalDateTime':'2020-11-27 08:40','departureTime':'07:20','arrivalTime':'08:40','departureCity':'Madrid','arrivalCity':'Palma de Mallorca','departureAPort':'MAD','arrivalAPort':'PMI','flightNumber':'IB 3918','flightPlane':'Airbus A321neo','flightOperator':'Iberia Express','flightDuration':'0h 52min.','waitingTime':'0h 52min.'},'activationFlags':{},'labels':{'LABEL_OPERATED_BY':'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY'}}]}},'breakdownModel':{'refund':{ total: 545.71, totalFormatted: undefined, passengersTypes: [  ], showRefundTableForPassenger: false },'toPay':null,'emds':{ types: { baggage: { title: 'MMB_VC_SUMMARY_EMD_BAGGAGE_TITLE', show: false, globalItem: false, flights: [  ] }, seat: { title: 'MMB_VC_SUMMARY_EMD_SEAT_TITLE', show: false, globalItem: false, flights: [  ] }, flexibility_on_demand: { title: 'ANCILLARIES_FLEXIBILITY_TITLE', show: false, globalItem: true, flights: [ { sliceId: 'id', departureCity: 'des', departureCode: 'code', arrivalCity: 'des', arrivalCode: 'code', tickets: [  ] } ] }, special_equipment: { title: 'MMB_VC_SUMMARY_EMD_SPECIAL_EQUIPMENT_TITLE', show: false, globalItem: false, flights: [ { sliceId: 'id', departureCity: 'des', departureCode: 'code', arrivalCity: 'des', arrivalCode: 'code', tickets: [  ] } ] }, priority_boarding: { title: 'PRIORITY_BOARDING_TITLE', show: false, globalItem: false, flights: [ { sliceId: 'id', departureCity: 'des', departureCode: 'code', arrivalCity: 'des', arrivalCode: 'code', tickets: [  ] } ] } }, totalEmds:'','totalPriceModel':{}} }}
            summaryTransformer.generateSummaryModel(copyfakeFareData2, 'twice', copyfakeoriginalBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});

            // expect(summaryModel).toEqual(summaryModelExpected);
        });


        it('when voucher to refund', () => {
            let fareData = {
                contextMetadata:{
                    currencies: [
                        {
                            alignment: 'R',
                            code: 'EUR',
                            decimalSeparator: ',',
                            decimals: 2,
                            description: 'Euro',
                            groupingSeparator: '.',
                            recommendedDisplay: 'symbol',
                            symbol: '€'
                        }
                    ]
                },
                compensationInfo: {
                    totalCompensation: 336.42,
                    totalCost: -236.42,
                    currency: 'EUR',
                    fareChanges: [{
                        compensation: 236.42,
                        passengerIds: ['ADULT_01'],
                        penalty: 0,
                        reIssue: -236.42,
                        totalCost: -236.42
                    }]
                },
                offers: [{
                    slices: [{}]
                }]

            };
            let summaryModelExpected = {
                'fligthsModel':{'outboundFlight':
                    {'flightData':{'type':'newFlight','infoMessage':'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND'}, 'fareFamilyConditions':{},'flightNodes':[]},'returnFlight':null},
                'breakdownModel':{'refund':null,'toPay':null,'emds':null},
                'totalPriceModel':{}};
            summaryTransformer.generateSummaryModel(fareData, 'twice', null, {conditions: [{code: 'test', message: 'testMessage'}]});
        });

        it('when emd to refund', () => {

            let fareData = {
                contextMetadata:{
                    currencies: [
                        {
                            alignment: 'R',
                            code: 'EUR',
                            decimalSeparator: ',',
                            decimals: 2,
                            description: 'Euro',
                            groupingSeparator: '.',
                            recommendedDisplay: 'symbol',
                            symbol: '€'
                        }
                    ]
                },
                compensationInfo: {
                    totalCompensation: 336.42,
                    totalCost: -236.42,
                    currency: 'EUR',
                    fareChanges: [{
                        compensation: 236.42,
                        passengerIds: ['ADULT_01'],
                        penalty: 0,
                        reIssue: -236.42,
                        totalCost: -236.42
                    }],
                    fareChangesCost: [],
                    emds: [
                        {
                            type: 'BAGGAGE',
                            tickets: [{emdNumber: '0755569140748', total: 50}, {emdNumber: '0755569140747', total: 50}, {emdNumber: '0755569140747', total: 50}, {emdNumber: '0755569140747', total: 50}]
                        }
                    ]
                },
                offers: [{
                    slices: [{}]
                }]

            };
            let copyfakeBookingInfo = {...fakeBookingInfo};
            let breakdownModelExpected = {'refund':null,'toPay':null,'emds':null};
            let breakdownModel = summaryTransformer.generateBreakdownModel(fareData, copyfakeBookingInfo);
            expect(breakdownModel).toEqual(breakdownModelExpected);
        });
    });

    describe('Breakdown Model generated correctly ', () => {
        it('when the change is to pay without ancillaries', () => {
            let fareData = {...fakeFareData};
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [];
            fareData.offers[0].compensationInfo.totalCost = 5;
            fareData.offers[0].compensationInfo.totalCompensation = 0;
            fareData.offers[0].slices[0].segments[0].warnings = [{code: 'SSE_AVM_20001', description: 'test'}]
            summaryTransformer.generateSummaryModel(fareData, 'twice', copyfakeBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
            // expect(summaryModel.breakdownModel.refund).toEqual(null);
            // expect(summaryModel.breakdownModel.toPay.total).toEqual(fareData.offers[0].compensationInfo.totalCost);
            // expect(summaryModel.breakdownModel.emds).toEqual(null);
        });

        it('when the change is to refund without ancillaries', () => {
            let fareData = {...fakeFareData};
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [];
            fareData.offers[0].compensationInfo.totalCompensation = 100;
            summaryTransformer.generateSummaryModel(fareData, 'twice', copyfakeBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
            // expect(summaryModel.breakdownModel.toPay).toEqual(null);
            // expect(summaryModel.breakdownModel.refund.total).toEqual(fareData.offers[0].compensationInfo.totalCompensation);
            // expect(summaryModel.breakdownModel.emds).toEqual(null);
        });

        it('when the change is zero without ancillaries', () => {
            let fareData = angular.copy(fakeFareData);
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [];
            fareData.offers[0].compensationInfo.totalCost = 0;
            fareData.offers[0].compensationInfo.totalCompensation = 0;
            fareData.offers[0].slices[0].segments[0].warnings = [{code: 'SSE_AVM_20002', description: 'test'}]
            summaryTransformer.generateSummaryModel(fareData, 'twice', copyfakeBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
        });

        it('when the change is to refund with ancillaries', () => {
            let fareData = {...fakeFareData};
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [
                {
                    'type':'BAGGAGE',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ],
                    'items': [{
                        sliceId: 'MADPMI20210313111500',
                        unitPrice: 2,
                        quantity: 10,
                        total: 20,


                    }]
                },
            ];
            fareData.offers[0].slices[0].segments[0].warnings = [{code: 'SSE_AVM_20003', description: 'test'}];
            summaryTransformer.generateSummaryModel(fareData, 'twice', copyfakeBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
            // expect(summaryModel.breakdownModel.toPay).toEqual(null);
            // expect(summaryModel.breakdownModel.refund.total).toEqual(fareData.offers[0].compensationInfo.totalCompensation);
        });

        it('when the change is to refund with ancillaries FLEXIBILITY_ON_DEMAND', () => {
            let fareData = angular.copy(fakeFareData);
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [
                {
                    'type':'FLEXIBILITY_ON_DEMAND',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ],
                    'items': [{
                        sliceId: 'MADPMI20210313111500',
                        unitPrice: 2,
                        quantity: 10,
                        total: 20,
                    }]
                },
            ];
            summaryTransformer.generateSummaryModel(fareData, 'twice', copyfakeBookingInfo, {conditions: [{code: 'test', message: 'testMessage'}]});
            // expect(summaryModel.breakdownModel.toPay).toEqual(null);
            // expect(summaryModel.breakdownModel.refund.total).toEqual(fareData.offers[0].compensationInfo.totalCompensation);
        });
    });

    describe('Breakdown Model generated correctly ', () => {
        beforeEach(()=> {
            localStorageService.set('isUnifiedFlow', true);
        });
        it('isUnifiedFlow and sliceID is equal', () => {
            let fareData = {...fakeFareData};
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [];
            fareData.offers[0].compensationInfo.totalCost = 5;
            fareData.offers[0].compensationInfo.totalCompensation = 0;
            localStorageService.set('unifiedOptionalData', {enabled: false, sliceId: 'MADPMI20210313111500'});
            localStorageService.set('unifiedOfferType', 'INVOLUNTARY_CHANGE');
            fareData.relatedContent = [{value:''}],
            fareData.offers[0].slices[0].segments[0].warnings = [{code: 'SSE_AVM_20004', description: 'test'}];
            summaryTransformer.generateSummaryModel(fareData, 'twice', copyfakeBookingInfo, {conditions: [{code: 'totalPriceText', message: 'testMessage'}]});
        });
        it('isUnifiedFlow and sliceID isn´t equal', () => {
            let fareData = angular.copy(fakeFareData);
            let copyfakeBookingInfo = {...fakeBookingInfo};
            fareData.offers[0].compensationInfo.emds = [];
            fareData.offers[0].compensationInfo.totalCompensation = 100;
            localStorageService.set('unifiedOptionalData', {enabled: false, sliceId: 'other'});
            summaryTransformer.generateSummaryModel(fareData, 'other', copyfakeBookingInfo, {conditions: [{code: 'termsAndConditions', message: 'test'}]});

        });

        afterEach(()=> {
            localStorageService.set('isUnifiedFlow', false);
            localStorageService.set('unifiedOptionalData', false);
        });
    });

    describe('getRelatedContentValue method is called', () => {
        it('isUnifiedFlow and sliceID is equal', (done) => {
            let returnVal = 'testValue';
            let test = summaryTransformer.getRelatedContentValue([{key:'test', value: 'testValue'},{key:'other', value: 'otherValue'}], 'test');

            expect(test).toEqual(returnVal);

            done();
        });
    });

    describe('Fare Comparison Model', () => {
    let fakeBookingInfoIBCOM;
    let fakeFareDataWithFamilies;

    beforeEach(() => {
        fakeBookingInfoIBCOM = { ...bookingInfoMock };
        fakeFareDataWithFamilies = { ...fareDataMock };
    });

    describe('canShowFareComparison', () => {
        it('should return true when channel is IBCOM and fareFamilyConditions exist', () => {
            expect(summaryTransformer.canShowFareComparison(fakeBookingInfoIBCOM)).toBe(true);
        });

        it('should return false when channel is not IBCOM', () => {
            const bookingInfo = { ...fakeBookingInfoIBCOM, channel: 'OTHER' };
            expect(summaryTransformer.canShowFareComparison(bookingInfo)).toBe(false);
        });

        it('should return false when originalBookingInfo is null', () => {
            expect(summaryTransformer.canShowFareComparison(null)).toBe(false);
        });

        it('should return false when fareFamilyConditions is empty', () => {
            const bookingInfo = { ...fakeBookingInfoIBCOM, fareFamilyConditions: [] };
            expect(summaryTransformer.canShowFareComparison(bookingInfo)).toBe(false);
        });

        it('should return false when fareFamilyConditions is missing', () => {
            const bookingInfo = { ...fakeBookingInfoIBCOM, fareFamilyConditions: null };
            expect(summaryTransformer.canShowFareComparison(bookingInfo)).toBe(false);
        });
    });

    describe('generateFareComparisonModel', () => {
        it('should return null when fareData has no slices', () => {
            const fareData = { ...fakeFareDataWithFamilies, offers: [{ slices: [] }] };
            const result = summaryTransformer.generateFareComparisonModel(fareData, fakeBookingInfoIBCOM);
            expect(result).toBeNull();
        });

        it('should return null when fareData offers are empty', () => {
            const fareData = { ...fakeFareDataWithFamilies, offers: [] };
            const result = summaryTransformer.generateFareComparisonModel(fareData, fakeBookingInfoIBCOM);
            expect(result).toBeNull();
        });

        it('should return a model with slices when data is valid', () => {
            const result = summaryTransformer.generateFareComparisonModel(fakeFareDataWithFamilies, fakeBookingInfoIBCOM);
            expect(result).not.toBeNull();
            expect(result.slices).toBeDefined();
            expect(result.slices.length).toBe(1);
        });

        it('should include sliceId for each slice', () => {
            const result = summaryTransformer.generateFareComparisonModel(fakeFareDataWithFamilies, fakeBookingInfoIBCOM);
            result.slices.forEach(slice => {
                expect(slice.sliceId).toBeDefined();
            });
        });
    });

    describe('buildComparisonSlice', () => {
        it('should resolve previousFareFamily from originalBookingInfo by index', () => {
            const result = summaryTransformer.generateFareComparisonModel(fakeFareDataWithFamilies, fakeBookingInfoIBCOM);
            expect(result.slices[0].previousFareFamily).not.toBeNull();
            expect(result.slices[0].previousFareFamily.commercialCode).toBe('TFLESEU');
        });

        it('should resolve newFareFamily from fareData fareFamilyConditions', () => {
            const result = summaryTransformer.generateFareComparisonModel(fakeFareDataWithFamilies, fakeBookingInfoIBCOM);
            expect(result.slices[0].newFareFamily).not.toBeNull();
            expect(result.slices[0].newFareFamily.commercialCode).toBe('TCLESES');
        });

        it('should set previousFareFamily to null when fareFamily code not found in originalBookingInfo', () => {
            const bookingInfo = {
                ...fakeBookingInfoIBCOM,
                fareFamilyConditions: [{ commercialCode: 'UNKNOWN', commercialName: 'Unknown', conditions: [], conditionsPriority: [] }]
            };
            const slice = fakeFareDataWithFamilies.offers[0].slices[0];
            const result = summaryTransformer.buildComparisonSlice(slice, 0, fakeFareDataWithFamilies, bookingInfo);
            expect(result.previousFareFamily).toBeNull();
        });

        it('should set newFareFamily to null when fareFamily code not found in fareData', () => {
            const fareData = {
                ...fakeFareDataWithFamilies,
                fareFamilyConditions: [{ commercialCode: 'UNKNOWN', commercialName: 'Unknown', conditions: [], conditionsPriority: [] }]
            };
            const slice = fareData.offers[0].slices[0];
            const result = summaryTransformer.buildComparisonSlice(slice, 0, fareData, fakeBookingInfoIBCOM);
            expect(result.newFareFamily).toBeNull();
        });

        it('should return null newFareFamily when slice has no fareFamily', () => {
            const slice = { sliceId: 'TEST', segments: [{ cabin: { fareFamily: null } }] };
            const result = summaryTransformer.buildComparisonSlice(slice, 0, fakeFareDataWithFamilies, fakeBookingInfoIBCOM);
            expect(result.newFareFamily).toBeNull();
        });
    });

    describe('fareComparisonModel in summaryModel', () => {
        it('should be null when channel is not IBCOM', () => {
            const bookingInfo = { ...fakeBookingInfoIBCOM, channel: 'OTHER' };
            const summaryModel = summaryTransformer.generateSummaryModel(fakeFareDataWithFamilies, 'outbound', bookingInfo, { conditions: [] });
            expect(summaryModel.fareComparisonModel).toBeNull();
        });

        it('should be populated when channel is IBCOM and conditions exist', () => {
            const summaryModel = summaryTransformer.generateSummaryModel(fakeFareDataWithFamilies, 'outbound', fakeBookingInfoIBCOM, { conditions: [] });
            expect(summaryModel.fareComparisonModel).not.toBeNull();
            expect(summaryModel.fareComparisonModel.slices).toBeDefined();
        });

        it('should be null when fareData is null', () => {
            const summaryModel = summaryTransformer.generateSummaryModel(null, 'outbound', fakeBookingInfoIBCOM, { conditions: [] });
            expect(summaryModel.fareComparisonModel).toBeNull();
        });
    });

    describe('getFareFamilyCodeFromSlice', () => {
        it('should return null when last segment has no fareFamily', () => {
            const fareData = {
                ...fakeFareDataWithFamilies,
                offers: [{ slices: [{ sliceId: 'TEST', segments: [{ cabin: { fareFamily: null } }] }] }]
            };
            const result = summaryTransformer.generateFareComparisonModel(fareData, fakeBookingInfoIBCOM);
            expect(result).toBeNull();
        });
    });

    describe('getFareFamilyByCode', () => {
        it('should return null when code is null', () => {
            const result = summaryTransformer.getFareFamilyByCode(fakeBookingInfoIBCOM.fareFamilyConditions, null);
            expect(result).toBeNull();
        });
    });

    describe('haveConditionsDifferences', () => {
        it('should return false when conditions arrays are null', () => {
            expect(summaryTransformer.haveConditionsDifferences(null, null)).toBe(false);
            expect(summaryTransformer.haveConditionsDifferences([], null)).toBe(false);
        });

        it('should return true when arrays have different length', () => {
            const prev = [{ code: 'EQMANO', extendedInfo: { code: 'CA_EQP' }, units: null }];
            const next = [];
            expect(summaryTransformer.haveConditionsDifferences(prev, next)).toBe(true);
        });

        it('should return true when a condition code exists in previous but not in new', () => {
            const prev = [{ code: 'EQMANO', extendedInfo: { code: 'CA_EQP' }, units: null }];
            const next = [{ code: 'CAMBIO', extendedInfo: { code: 'CA_CAMBIO' }, units: null }];
            expect(summaryTransformer.haveConditionsDifferences(prev, next)).toBe(true);
        });

        it('should return true when commercialName is the same but conditions differ', () => {
            const prev = [{ code: 'CAMBIO', extendedInfo: { code: 'CA_CAMBIO_55' }, units: 55 }];
            const next = [{ code: 'REEMBOLSO', extendedInfo: { code: 'CA_REEMBOLSO' }, units: null }];
            expect(summaryTransformer.haveConditionsDifferences(prev, next)).toBe(true);
        });
    });
});
});
