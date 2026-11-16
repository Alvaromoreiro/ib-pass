import { StorageServiceMock } from '@test/unit/utils/StorageServiceMock';
import angular from 'angular';

describe('MmBUtilsSharedService Test', () => {
    let rootScope, MmBUtilsSharedService, localStorageService, window, $sce, cookies, filter, CommonsSessionStorageService;
    let returnedInfo;
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
    let mockPassengerOrder = [
        {
            'type': 'ADULT',
            'passengerType': 'ADULT',
            'personalInfo': {
                'name': 'TEST',
                'surname': 'TEST',
                'birthDate': null
            },
            'passengerId': 'ADULT_01',
            'contactInfo': {
                'phone': '3465433455',
                'email': 'as@as.com',
                'phoneType': 'MOBILE',
                'confirmationMailOption': null
            },
            'additionalFFInfo': [

            ],
            'additionalRequiredInfo': {

            },
            'aviosAccumulated': null,
            'ticketNumbers': [
                '0752393608766'
            ],
            'specialNeeds': null,
            'optionalInformation': [

            ],
            'flags': {
                'FLIGHT_MODIFICATION': true,
                'FLIGHT_REFUND': true,
                'FREQUENT_FLYER_MODIFICATION': true,
                'SPECIAL_NEEDS_MODIFICATION': true,
                'CONTACT_DATA_MODIFICATION': true,
                'EMERGENCY_CONTACT_MODIFICATION': true,
                'PASSENGER_NAME_CORRECTION': true,
                'ANCILLARIES': true,
                'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE': false,
                'FLIGHT_MODIFICATION_FLEXIBLE': false,
                'FLIGHT_DISRUPTION_SEARCH': false,
                'FLIGHT_MODIFICATION_ON_DEMAND': false
            }
        },
        {
            'type': 'SENIOR',
            'infant': 'null',
        },
        {
            'type': 'CHILD',
        },
        {
            'type': 'INFANT',
        },{
            'type': 'YOUTH',
        }
    ];
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
    let mockSliceModelSummaryModel = [
        {
            'sliceId': 'BIOMAD20210625092500',
            'type': 'REGULAR',
            'departureDateTime': '2021-06-25 09:25',
            'arrivalDateTime': '2021-06-25 10:35',
            'duration': 70,
            'stopsNumber': 0,
            'detailedPrices': [
                {
                    'fare': 0,
                    'currency': null,
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'segmentPrices': []
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
                        'code': 'BIO',
                        'name': 'AIRPORT',
                        'terminal': null,
                        'city': {
                            'code': 'BIO',
                            'description': 'Bilbao',
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
                        'code': 'BIO',
                        'description': 'Bilbao',
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
                            'code': 'IB',
                            'name': 'Iberia'
                        },
                        'marketingFlightNumber': '0423',
                        'operationalFlightNumber': '0423',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '32A',
                            'description': 'Airbus A320'
                        }
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 0,
                        'fareFamily': 'TBAESES',
                        'code': 'R',
                        'type': 'ECONOMY',
                        'bookingClass': 'ECONOMY'
                    },
                    'overnight': false,
                    'id': 'IB042320210625',
                    'duration': 70,
                    'waitingTime': 0,
                    'operatorLocator': null,
                    'stop': null,
                    'departureDateTime': '2021-06-25 09:25',
                    'departureUtcDateTime': '2021-06-25T07:25:00.000',
                    'arrivalDateTime': '2021-06-25 10:35',
                    'arrivalUtcDateTime': '2021-06-25T08:35:00.000',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ],
            'overnight': false,
            'ancillaries' :[
                {
                    'type' : 'BGA',
                    'unitaryPrice' : 1,
                    'price' : 33,
                    'amount': '',
                    'priceTotalFormatted' : ''
                }
            ]
        },
        {
            'sliceId': 'BIOMAD20210625092501',
            'type': 'REGULAR',
            'departureDateTime': '2021-06-25 09:25',
            'arrivalDateTime': '2021-06-25 10:35',
            'duration': 70,
            'stopsNumber': 0,
            'detailedPrices': [
                {
                    'fare': 0,
                    'currency': null,
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'segmentPrices': []
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
                        'code': 'BIO',
                        'name': 'AIRPORT',
                        'terminal': null,
                        'city': {
                            'code': 'BIO',
                            'description': 'Bilbao',
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
                        'code': 'BIO',
                        'description': 'Bilbao',
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
                            'code': 'IB',
                            'name': 'Iberia'
                        },
                        'marketingFlightNumber': '0423',
                        'operationalFlightNumber': '0423',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '32A',
                            'description': 'Airbus A320'
                        }
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 0,
                        'fareFamily': 'TBAESES',
                        'code': 'R',
                        'type': 'ECONOMY',
                        'bookingClass': 'ECONOMY'
                    },
                    'overnight': false,
                    'id': 'IB042320210625',
                    'duration': 70,
                    'waitingTime': 0,
                    'operatorLocator': null,
                    'stop': null,
                    'departureDateTime': '2021-06-25 09:25',
                    'departureUtcDateTime': '2021-06-25T07:25:00.000',
                    'arrivalDateTime': '2021-06-25 10:35',
                    'arrivalUtcDateTime': '2021-06-25T08:35:00.000',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ],
            'overnight': false,
            'ancillaries' :[
                {
                    'type' : 'BGA',
                    'unitaryPrice' : 1,
                    'price' : 33,
                    'amount': '',
                    'priceTotalFormatted' : ''
                }
            ]
        }
    ];
    let mockRawModel = {
        'cities': [
            {
                'code': 'BIO',
                'description': 'Bilbao',
                'sisterCities': [
                    {
                        'code': 'EAS',
                        'description': 'San Sebastian',
                        'timezone': 'Europe/Madrid',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        },
                        'latitude': 43.35,
                        'longitude': -1.8
                    },
                    {
                        'code': 'OVD',
                        'description': 'Asturias-Oviedo',
                        'timezone': 'Europe/Madrid',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        },
                        'latitude': 43.566666,
                        'longitude': -6.033333
                    },
                    {
                        'code': 'PNA',
                        'description': 'Pamplona',
                        'timezone': 'Europe/Madrid',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        },
                        'latitude': 42.766666,
                        'longitude': -1.641666
                    },
                    {
                        'code': 'SDR',
                        'description': 'Santander',
                        'timezone': 'Europe/Madrid',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        },
                        'latitude': 43.433333,
                        'longitude': -3.816666
                    }
                ]
            },
            {
                'code': 'MAD',
                'description': 'Madrid',
                'sisterCities': []
            }
        ]
    };
    let mockFlightListModelDisrupted = {
            'BIOMAD20210625092500': {
                index: 0,
                newDateSelected: new Date('12/10/2023'),
                'departureCity': {
                    'code': 'BIO',
                    'name': 'AIRPORT',
                    'terminal': null,
                    'city': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrivalCity': {
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
                'departureCountry': 'ES',
                'arrivalCountry': 'ES',
                'segments': [
                    {
                        'departureCity': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
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
                        'departureDateParsed': {
                            'dateTime': '09:25',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 25,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-25T09:25:00+02:00',
                            'formatedDate': '25/06/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '10:35',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 25,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-25T10:35:00+02:00',
                            'formatedDate': '25/06/2021'
                        },
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
                        'overnight': false,
                        'departureDateTimeParsed': '09:25',
                        'arrivalDateTimeParsed': '10:35',
                        'departure': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
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
                        'flight': {
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'operationalCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'marketingFlightNumber': '0423',
                            'operationalFlightNumber': '0423',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '32A',
                                'description': 'Airbus A320'
                            }
                        },
                        'durationParsed': '01h 10min.',
                        'segmentId': 'IB042320210625',
                        'sliceId': 'BIOMAD20210625092500',
                        'status': {
                            'code': 'HK',
                            'description': 'Confirmado'
                        },
                        'cabin': {
                            'rbd': 'A',
                            'description': '',
                            'remainingSeats': 0,
                            'fareFamily': 'TBAESES',
                            'code': 'R',
                            'type': 'ECONOMY',
                            'bookingClass': 'ECONOMY'
                        },
                        'flown': false,
                        'warnings': {},
                        'stop': null
                    }
                ],
                'departureDateParsed': {
                    'dateTime': '09:25',
                    'weekDay': 'WEEKDAY_FRYDAY',
                    'day': 25,
                    'monthNumber': 6,
                    'month': 'MONTH_JUNE',
                    'year': 2021,
                    'originalDate': '2021-06-25T09:25:00+02:00',
                    'formatedDate': '25/06/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '10:35',
                    'weekDay': 'WEEKDAY_FRYDAY',
                    'day': 25,
                    'monthNumber': 6,
                    'month': 'MONTH_JUNE',
                    'year': 2021,
                    'originalDate': '2021-06-25T10:35:00+02:00',
                    'formatedDate': '25/06/2021'
                },
                'durationParsed': '01h 10min.',
                'stopsNumber': 0,
                'daysToGo': 21,
                'disrupted': true,
                'parseNewDateSelected': {
                    'day': '1',
                    'month': '1',
                    'year': '2021'
                }
            },
            'BIOMAD20210625092501': {
                index: 1,
                newDateSelected: new Date('12/10/2023'),
                'departureCity': {
                    'code': 'BIO',
                    'name': 'AIRPORT',
                    'terminal': null,
                    'city': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrivalCity': {
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
                'departureCountry': 'ES',
                'arrivalCountry': 'ES',
                'segments': [
                    {
                        'departureCity': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
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
                        'departureDateParsed': {
                            'dateTime': '09:25',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 25,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-25T09:25:00+02:00',
                            'formatedDate': '25/06/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '10:35',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 25,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-25T10:35:00+02:00',
                            'formatedDate': '25/06/2021'
                        },
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
                        'overnight': false,
                        'departureDateTimeParsed': '09:25',
                        'arrivalDateTimeParsed': '10:35',
                        'departure': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
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
                        'flight': {
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'operationalCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'marketingFlightNumber': '0423',
                            'operationalFlightNumber': '0423',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '32A',
                                'description': 'Airbus A320'
                            }
                        },
                        'durationParsed': '01h 10min.',
                        'segmentId': 'IB042320210625',
                        'sliceId': 'BIOMAD20210625092500',
                        'status': {
                            'code': 'HK',
                            'description': 'Confirmado'
                        },
                        'cabin': {
                            'rbd': 'A',
                            'description': '',
                            'remainingSeats': 0,
                            'fareFamily': 'TBAESES',
                            'code': 'R',
                            'type': 'ECONOMY',
                            'bookingClass': 'ECONOMY'
                        },
                        'flown': false,
                        'warnings': {},
                        'stop': null
                    }
                ],
                'departureDateParsed': {
                    'dateTime': '09:25',
                    'weekDay': 'WEEKDAY_FRYDAY',
                    'day': 25,
                    'monthNumber': 6,
                    'month': 'MONTH_JUNE',
                    'year': 2021,
                    'originalDate': '2021-06-25T09:25:00+02:00',
                    'formatedDate': '25/06/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '10:35',
                    'weekDay': 'WEEKDAY_FRYDAY',
                    'day': 25,
                    'monthNumber': 6,
                    'month': 'MONTH_JUNE',
                    'year': 2021,
                    'originalDate': '2021-06-25T10:35:00+02:00',
                    'formatedDate': '25/06/2021'
                },
                'durationParsed': '01h 10min.',
                'stopsNumber': 0,
                'daysToGo': 21,
                'originalOD': {
                    'departure' :{
                        'city' : {
                            'code' : 'BIO'
                        }
                    },
                    'arrival' :{
                        'city' : {
                            'code' : 'BIO'
                        }
                    }
                },
                'parseNewDateSelected': {
                    'day': '1',
                    'month': '1',
                    'year': '2021'
                }
            }
    };

    let mockSisterCitiesModel = {
        disruptedSlices: {sliceId: 'BIOMAD20210625092500'},
        'BIOMAD20210625092500': {
            origin: {
                originSisterCities: [
                    {
                        'isSelected': true,
                        'code' : 'MAD'
                    },
                    {
                        'isSelected': false,
                        'code' : 'BIO'
                    },
                    {
                        'isSelected': true,
                        'code' : 'AGP'
                    }
                ]
            },
            destination: {
                destinationSisterCities: [
                    {
                        'isSelected': true,
                        'code' : 'MAD'
                    },
                    {
                        'isSelected': false,
                        'code' : 'BIO'
                    },
                    {
                        'isSelected': true,
                        'code' : 'AGP'
                    }
                ]
            },
            originSisterCitiesNum: null,
            destinationSisterCitiesNum: null,
        },
        referenceSliceId: 'BIOMAD20210625092500'
    };

    let mockModel = require('@test/mocks/storage/utils-shared-model-mock.json');
    

    let mockModel2 =  require('@test/mocks/storage/utils-shared-model-2-mock.json');

    let mockModelMultiFLights = require('@test/mocks/storage/utils-shared-model-multi-flights-mock.json');

    let fakeMmBTokenService = {
        refreshUserLoggedToken: jasmine.createSpy(),
        getAnonymousToken: jasmine.createSpy()
    };

    let fakeMmBModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: { then: angular.noop } };
        })
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

    let fakeDatalayerConstants = {
        DATALAYER_MODAL_ID: { 'FARE_CONDITIONS': 'FARE_CONDITIONS' },
        DATALAYER_VALUES: {
            'MULTIPLE_TRIP':'MULTIPLE_TRIP',
            'RETURN_TRIP':'RETURN_TRIP',
            'ONE_WAY_TRIP': 'ONE_WAY_TRIP'
        },
        DIGITAL_DATA_PROCESS: {
            test: 'test'
        },
        DIGITAL_DATA_STEP: {
            test: 'test'
        },
        QUADRIGAMS: {
            'MMB_SESSION_EXPIRED': 'MMBEXP'
        },
        MMB_UN_UNTK_PROCESSES: {
            UN: 'UN',
            UNTK: 'UNTK'
        }
    };
    let fakeDateFormatFilter = function (inputDate) {
        return inputDate;
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'addDataLayerInfo': jasmine.createSpy('addDataLayerInfo').and.callFake(angular.noop),
        'updateDatalayerForFlexFlights': jasmine.createSpy(),
        'updateDigitalDataForFlexFlights': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'updateSlicesDatalayerForFlexFlights': jasmine.createSpy(),
    };

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
            'AISLE': 'AISLE'
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

    let fakeTranslate = {
        'use': jasmine.createSpy()
    };
    cookies = {
        'get': jasmine.createSpy('get').and.callFake(() => {
            return true;
        })
    };

    let fakeCurrencyService = {
        'formatPrice': jasmine.createSpy('formatPrice').and.returnValue('10€'),
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject').and.callFake(() => {
            return { 'code': 'EUR', 'numberDecimals': 2, 'aviosTransformed': '100' }
        }),
        'formatAvios': jasmine.createSpy('formatAvios'),
        'getCurrenciesAsMap': jasmine.createSpy('getCurrenciesAsMap').and.returnValue({description: 'EUR'}),
    };

    let fakeCommonsUtilService = {
        getAppMarket: jasmine.createSpy('getAppMarket').and.callFake(() => {
            return 'test';
        }),
        getPrefixFromMarket: jasmine.createSpy('getPrefixFromMarket').and.callFake(() => {
            return 'test';
        })
    };

    let fakeDatalayerUniqueKeysService = {
        clear: jasmine.createSpy()
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
            }]
        }
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', 'ib-MmB-filters-module', 'ngCookies', function ($provide) {
            $provide.value('IbCAuthTokenService', fakeMmBTokenService);
            $provide.value('MmBAppConstants', MockMmBAppConstants);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('DateFormatFilter', fakeDateFormatFilter);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('$translate', fakeTranslate);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DatalayerUniqueKeysService', fakeDatalayerUniqueKeysService);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
        });
        inject(($window, $rootScope, _MmBUtilsSharedService_, _localStorageService_, _$sce_, _$cookies_, _$filter_, _CommonsSessionStorageService_) => {
            MmBUtilsSharedService = _MmBUtilsSharedService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            CommonsSessionStorageService = _CommonsSessionStorageService_;
            window = $window;
            $sce = _$sce_;
            cookies = _$cookies_;
            filter = _$filter_;

            fakeSessionStorage.set('bookingInfo',fakeBookingInfo)
            fakeSessionStorage.set('fareFamilyConditionsInfo',[fakeFareFamilyConditions])
            fakeSessionStorage.set('userLogged',true)
        });
        rootScope.appLang = 'es';
        rootScope.appMarket = 'ES';
    });

    describe('When getDateFormatted() is called', () => {
        it('It return formatted date', (done) => {
            returnedInfo = MmBUtilsSharedService.getDateFormatted(10, 1, 2017);
            expect(returnedInfo).toEqual('2017-01-10');
            done();
        });
    });

    describe('when the service return a DateFormmated ', () => {
        it('day and a month should be between 0-9', (done) => {
            let day, month, year, returnDate;
            day = 2;
            month = 3;
            year = 2017;
            returnDate = MmBUtilsSharedService.getDateFormatted(day, month, year);
            expect(returnDate).toBe('2017-03-02');
            done();
            rootScope.$digest();
        });
        it('day and a month shouldn`t be between 0-9', (done) => {
            let day, month, year, returnDate;
            day = 12;
            month = 17;
            year = 2017;
            returnDate = MmBUtilsSharedService.getDateFormatted(day, month, year);
            expect(returnDate).toBe('2017-17-12');
            done();
            rootScope.$digest();
        });
    });

    describe('Whn getInfoHeader() is called', () => {
        it('Should return model data to header', (done) => {
            let responsemodelHeader;
            fakeSessionStorage.set('segmentsInfo', []);
            responsemodelHeader = MmBUtilsSharedService.getInfoHeader(mockSegmentsOrder.segments, mockPassengerOrder);
            expect(responsemodelHeader[0].passengers).toEqual(5);
            expect(responsemodelHeader[0].destinationCity.code).toEqual('AIRPRUEBA');
            expect(responsemodelHeader[0].originCity.code).toEqual('AIRPRUEBA');
            done();
        });
    });

    describe('When generateSegmentsInfo() is called', () => {
        it('Should return the segments data', (done) => {
            let response, fligthsInfo = [{
                'segmentId': 'ID01',
                'departureCity': { 'city': { 'description': 'DESC', 'code': 'CODE' } },
                'arrivalCity': { 'city': { 'description': 'DESC', 'code': 'CODE' } }
            }]
            response = MmBUtilsSharedService.generateSegmentsInfo(fligthsInfo);
            expect(response[0].id).toEqual('ID01');
            expect(response[0].destination.code).toEqual('CODE');
            expect(response[0].origin.description).toEqual('DESC');
            done();
        });
    });   
    
    describe('When removeDuplicates() is called', () => {
        it('Should return the cities not duplicates', (done) => {
            let response, cityList = [{ 'code': 'CO'}];
            response = MmBUtilsSharedService.removeDuplicates(cityList);
            expect(response).toEqual([{ 'code': 'CO' }])
            done();
        });
    });
    describe('When transformSisterCitiesModel() is called', () => {
        xit('Should return the sister citiesData', () => {
            let response;
            response = MmBUtilsSharedService.newTransformSisterCitiesModel(mockRawModel, true, mockSliceModelSummaryModel, mockFlightListModelDisrupted);
            expect(response['BIOMAD20210625092500'].destinationHasSisterCities).toBe(false);
            expect(response['BIOMAD20210625092500'].originHasSisterCities).toBe(true);
            expect(response['BIOMAD20210625092500'].destinationSisterCitiesNum).toEqual(null);
            expect(response['BIOMAD20210625092500'].originSisterCitiesNum).toEqual('+4');
        });
    });


    describe('When transformSisterCitiesModel() is called with multiple flights and not Flex', () => {
        it('Should return the sister citiesData model', (done) => {
            let response;
            response = MmBUtilsSharedService.newTransformSisterCitiesModel(mockRawModel, false, mockSliceModelSummaryModel, mockFlightListModelDisrupted);
            expect(response['BIOMAD20210625092500'].destinationHasSisterCities).toBe(false);
            expect(response['BIOMAD20210625092500'].originHasSisterCities).toBe(true);
            expect(response['BIOMAD20210625092500'].destinationSisterCitiesNum).toEqual(null);
            expect(response['BIOMAD20210625092500'].originSisterCitiesNum).toEqual('+4');
            done();
        });
    });
    describe('When updateSisterCitiesModel() is called', () => {
        it('Should return the count for the city Selected', (done) => {
            MmBUtilsSharedService.updateSisterCitiesModel(mockSisterCitiesModel);
            expect(mockSisterCitiesModel['BIOMAD20210625092500'].originSisterCitiesNum).toEqual('+2');
            done();
        });
    });
    describe('When generateRequestFlexibilization() is called', () => {
        it('with flowId and simple request', (done) => {
            let result = MmBUtilsSharedService.generateRequestFlexibilization(mockFlightListModelDisrupted, '123', mockSisterCitiesModel);
            expect(result.flowId).toBe('123');
            done();
        });
        it('without flowId and simple request', (done) => {
            fakeSessionStorage.set('flowId', 'test');
            let result = MmBUtilsSharedService.generateRequestFlexibilization(mockFlightListModelDisrupted, null, mockSisterCitiesModel);
            expect(result.flowId).toBe('test');
            done();
        });
    });
    describe('When getFlagValue() is called', () => {
        it('Should return the value', (done) => {
            let mockContainerObj = [{ 'PRUEBA': 'PRUEBA', 'FLAG': 'FLAG' }];
            MmBUtilsSharedService.getFlagValue(mockContainerObj, 'FLAG', 'PRUEBA', 'FLAG');
            done();
        });
    });
    describe('When getMiddleDashDate() is called', () => {
        it('Should return date with slash separator', (done) => {
            let response, mockDate = { 'year': 1997, 'monthNumber': 7, 'monthDay': 24 }
            response = MmBUtilsSharedService.getMiddleDashDate(mockDate);
            expect(response).toEqual('1997-07-24');
            done();
        });
    });
    xdescribe('When goToHome() is called', () => { //DISSCONECT EN ESTE TEST
        it('Should change the href in window variable', (done) => {
            // let href = 'http://127.0.0.1:8280/';
            MmBUtilsSharedService.goToHome();
            //expect(href).toEqual('http://127.0.0.1:8280/');
            done();
        });
    });
    describe('When generateFlexAndDisruptedFlightsDatalayerInfo() is called', () => {
        it('Should return the data to datalayer false', (done) => {
            fakeSessionStorage.set('multiCitySearch', null);
            MmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo(false, mockModel);
            expect(fakeDatalayerUtilsService.updateDigitalDataForFlexFlights).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateSlicesDatalayerForFlexFlights).toHaveBeenCalled();
            done();
        });
        it('Should return the data to datalayer true', (done) => {
            fakeSessionStorage.set('multiCitySearch', null);
            MmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo(true, mockModel);
            expect(fakeDatalayerUtilsService.updateDigitalDataForFlexFlights).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateSlicesDatalayerForFlexFlights).toHaveBeenCalled();
            done();
        });
        it('With disrupted data Should return the data to datalayer', (done) => {
            fakeSessionStorage.set('multiCitySearch', null);

            MmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo(true, mockModelMultiFLights);
            expect(fakeDatalayerUtilsService.updateDigitalDataForFlexFlights).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateSlicesDatalayerForFlexFlights).toHaveBeenCalled();
            done();
        });

        it('Should return the data to datalayer in 2 flights', (done) => {
            fakeSessionStorage.set('multiCitySearch', null);
            MmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo(false, mockModel2);
            expect(fakeDatalayerUtilsService.updateDigitalDataForFlexFlights).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateSlicesDatalayerForFlexFlights).toHaveBeenCalled();
            done();
        });
    });

    describe('When getUniqueElementByProperty() is called', () => {
        it('Should return only one value', (done) => {
            let response, array1 = [{ 'A': 'TEST1' }, { 'B': 'TEST1' }, { 'C': 'TEST1' }, { 'D': 'TEST1' }]
            response = MmBUtilsSharedService.getUniqueElementByProperty(array1, 'C');
            expect(response).toEqual([{ A: 'TEST1' }, { C: 'TEST1' }]);
            done();
        });
    });

    xdescribe('When goToHome() is called', () => {
        it('Should return value', (done) => {
            MmBUtilsSharedService.goToHome();
            expect(CommonsSessionStorageService.clearAll).toHaveBeenCalled();
            done();
        });
    });

    describe('When generateRedirectionFormCancel() is called', () => {
        it('Should return value', (done) => {
            MmBUtilsSharedService.generateRedirectionFormCancel({params: [{paramName: 'attr', paramValue: 'test'}]});
            // expect(CommonsSessionStorageService.clearAll).toHaveBeenCalled();
            done();
        });
    });

    describe('When getDisruptionType () is called', () => {
        it('Should return value', (done) => {
            let response = MmBUtilsSharedService.getDisruptionType({});
            expect(response).toEqual({disruptionType: 'NONE', disruptionId : null});
            done();
        });
        it('Should return value', (done) => {
            let response = MmBUtilsSharedService.getDisruptionType({flexibilizationCapabilitiesInformation: {id: 1}, genericDisruptionCapabilitiesInformation: false});
            expect(response).toEqual({disruptionType: 'SPECIFIC', disruptionId : 1});
            done();
        });
        it('Should return value', (done) => {
            let response = MmBUtilsSharedService.getDisruptionType({flexibilizationCapabilitiesInformation: false, genericDisruptionCapabilitiesInformation: {id: 2}});
            expect(response).toEqual({disruptionType: 'GENERIC', disruptionId : 2});
            done();
        });
    });

    describe('When getPrefixFromMarket() is called', () => {
        it('Should return value', (done) => {
            let response = MmBUtilsSharedService.getPrefixFromMarket ();
            expect(response).toEqual('test');
            done();
        });
    });

    describe('When updateQuadrigam() is called', () => {
        it('Should return value', (done) => {
            MmBUtilsSharedService.updateQuadrigam('test');
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe('When getDifferenceInDays() is called', () => {
        it('Should return value', () => {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            let response = MmBUtilsSharedService.getDifferenceInDays(tomorrow, new Date());
            expect(response).toEqual(1);
        });
    });

    describe('When generateRedirectionFormCancel() is called', () => {
        it('Should return value', () => {
            let result = MmBUtilsSharedService.generateRedirectionFormCancel({url:'testaction', params: [{name:'testname', value: 'test'}]});
            let expected = '<form action="testaction" method="post"><input type="hidden" name="testname" value="test" /><input type="submit" id="submit_hidden_form" class="u-hide" /></form>';
            expect(result).toEqual(expected);
        });
    });

    describe('When getProcessByStatus() is called', () => {
        it('Should CANCELATION_FLAG', () => {
            let result = MmBUtilsSharedService.getProcessByStatus('test',MockMmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_FLAG);
            let expected = 'involuntario sin alternativa';
            expect(result).toEqual(expected);
        });
        it('Should CANCELATION_FLAG', () => {
            let result = MmBUtilsSharedService.getProcessByStatus('test',MockMmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_FLAG);
            let expected = 'involuntario con alternativa';
            expect(result).toEqual(expected);
        });
    });
     
});
