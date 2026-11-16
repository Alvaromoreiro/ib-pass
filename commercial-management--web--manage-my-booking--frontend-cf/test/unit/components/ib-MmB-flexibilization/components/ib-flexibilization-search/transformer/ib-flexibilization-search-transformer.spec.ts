describe('IbFlexFlexibilizationTransformer test', () =>  {

    var localStorageService, IbFlexFlexibilizationTransformer;

    var mock1 = {
        MADBIO20200416115000: {
            departureCity: {
                code: 'MAD',
                name: 'Madrid',
                terminal: '4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrivalCity: {
                code: 'BIO',
                name: 'Bilbao',
                terminal: null,
                city: {
                    code: 'BIO',
                    description: 'Bilbao',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            segments: [
                {
                    departureDateParsed: {
                        dateTime: '11:50',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 16,
                        monthNumber: 4,
                        month: 'MONTH_APRIL',
                        year: 2020,
                        originalDate: '2020-04-16T11:50:00+02:00',
                        formatedDate: '16/04/2020'
                    },
                    arrivalDateParsed: {
                        dateTime: '12:55',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 16,
                        monthNumber: 4,
                        month: 'MONTH_APRIL',
                        year: 2020,
                        originalDate: '2020-04-16T12:55:00+02:00',
                        formatedDate: '16/04/2020'
                    },
                    companyURL: '/aerolineas/logo_pos_IB.svg',
                    overnight: false,
                    departureDateTimeParsed: '11:50',
                    arrivalDateTimeParsed: '12:55',
                    flight: {
                        marketingFlightNumber: '0426',
                        operationalFlightNumber: '',
                        operationalDisclosure: 'IB'
                    },
                    durationParsed: '01h 5min.',
                    fareFamilyConditions: [
                        null,
                        null,
                        null,
                        null,
                        null
                    ],
                    segmentId: 'IB042620200416',
                    sliceId: 'MADBIO20200416115000',
                    status: {
                        code: 'HK',
                        description: 'Confirmado'
                    },
                    cabin: {
                        rbd: 'A',
                        description: 'Turista',
                        remainingSeats: null,
                        fareFamily: 'TBAESES',
                        code: 'R',
                        type: 'ECONOMY',
                        bookingClass: 'ECONOMY'
                    },
                    flown: false,
                    warnings: {},
                    stop: null
                }
            ],
            departureDateParsed: {
                dateTime: '11:50',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 16,
                monthNumber: 4,
                month: 'MONTH_APRIL',
                year: 2020,
                originalDate: '2020-04-16T11:50:00+02:00',
                formatedDate: '16/04/2020'
            },
            arrivalDateParsed: {
                dateTime: '12:55',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 16,
                monthNumber: 4,
                month: 'MONTH_APRIL',
                year: 2020,
                originalDate: '2020-04-16T12:55:00+02:00',
                formatedDate: '16/04/2020'
            },
            durationParsed: '01h 5min.',
            stopsNumber: 0,
            daysToGo: -18,
            checked: false,
            newDateSelected: null,
            dateOptions: {
                showWeeks: false,
                maxMode: 'day',
                minDate: {
                    _isAMomentObject: true,
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _locale: {
                        _invalidDate: 'Invalid date',
                        _ordinal: '%dº',
                        _monthsParseExact: true,
                        _weekdaysParseExact: true,
                        _abbr: 'es'
                    },
                    _d: '2020-05-05T05:38:41.104Z',
                    _isValid: true
                },
                maxDate: {
                    _isAMomentObject: true,
                    _i: '2021-04-29T22:00:00.000Z',
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _locale: {
                        _invalidDate: 'Invalid date',
                        _ordinal: '%dº',
                        _monthsParseExact: true,
                        _weekdaysParseExact: true,
                        _abbr: 'es'
                    },
                    _d: '2021-04-29T22:00:00.000Z',
                    _isValid: true
                }
            }
        },
        BIOMAD20200514175000: {
            departureCity: {
                code: 'BIO',
                name: 'Bilbao',
                terminal: null,
                city: {
                    code: 'BIO',
                    description: 'Bilbao',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrivalCity: {
                code: 'MAD',
                name: 'Madrid',
                terminal: '4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            segments: [
                {
                    departureDateParsed: {
                        dateTime: '17:50',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 14,
                        monthNumber: 5,
                        month: 'MONTH_MAY',
                        year: 2020,
                        originalDate: '2020-05-14T17:50:00+02:00',
                        formatedDate: '14/05/2020'
                    },
                    arrivalDateParsed: {
                        dateTime: '19:00',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 14,
                        monthNumber: 5,
                        month: 'MONTH_MAY',
                        year: 2020,
                        originalDate: '2020-05-14T19:00:00+02:00',
                        formatedDate: '14/05/2020'
                    },
                    companyURL: '/aerolineas/logo_pos_IB.svg',
                    overnight: false,
                    departureDateTimeParsed: '17:50',
                    arrivalDateTimeParsed: '19:00',
                    flight: {
                        marketingFlightNumber: '0449',
                        operationalFlightNumber: '',
                        operationalDisclosure: 'IB'
                    },
                    durationParsed: '01h 10min.',
                    fareFamilyConditions: [],
                    segmentId: 'IB044920200514',
                    sliceId: 'BIOMAD20200514175000',
                    status: {
                        code: 'HK',
                        description: 'Confirmado'
                    },
                    cabin: {
                        rbd: 'A',
                        description: 'Turista',
                        remainingSeats: null,
                        fareFamily: null,
                        code: 'R',
                        type: 'ECONOMY',
                        bookingClass: 'ECONOMY'
                    },
                    flown: false,
                    warnings: {},
                    stop: null
                }
            ],
            departureDateParsed: {
                dateTime: '17:50',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 14,
                monthNumber: 5,
                month: 'MONTH_MAY',
                year: 2020,
                originalDate: '2020-05-14T17:50:00+02:00',
                formatedDate: '14/05/2020'
            },
            arrivalDateParsed: {
                dateTime: '19:00',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 14,
                monthNumber: 5,
                month: 'MONTH_MAY',
                year: 2020,
                originalDate: '2020-05-14T19:00:00+02:00',
                formatedDate: '14/05/2020'
            },
            durationParsed: '01h 10min.',
            stopsNumber: 0,
            daysToGo: 9,
            checked: true,
            newDateSelected: '2020-05-14T22:00:00.000Z',
            dateOptions: {
                showWeeks: false,
                maxMode: 'day',
                minDate: {
                    _isAMomentObject: true,
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _locale: {
                        _invalidDate: 'Invalid date',
                        _ordinal: '%dº',
                        _monthsParseExact: true,
                        _weekdaysParseExact: true,
                        _abbr: 'es'
                    },
                    _d: '2020-05-05T05:38:41.104Z',
                    _isValid: true
                },
                maxDate: {
                    _isAMomentObject: true,
                    _i: '2021-04-29T22:00:00.000Z',
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _d: '2021-04-29T22:00:00.000Z',
                    _isValid: true
                },
                initDate: '2020-05-14T15:50:00.000Z'
            },
            parseNewDateSelected: {
                day: 15,
                month: 5,
                year: 2020,
                weekDay: 5
            }
        }
    };
    var mock2 = {
        MADBIO20200416115000: {
            departureCity: {
                code: 'MAD',
                name: 'Madrid',
                terminal: '4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrivalCity: {
                code: 'BIO',
                name: 'Bilbao',
                terminal: null,
                city: {
                    code: 'BIO',
                    description: 'Bilbao',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            segments: [
                {
                    departureDateParsed: {
                        dateTime: '11:50',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 16,
                        monthNumber: 4,
                        month: 'MONTH_APRIL',
                        year: 2020,
                        originalDate: '2020-04-16T11:50:00+02:00',
                        formatedDate: '16/04/2020'
                    },
                    arrivalDateParsed: {
                        dateTime: '12:55',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 16,
                        monthNumber: 4,
                        month: 'MONTH_APRIL',
                        year: 2020,
                        originalDate: '2020-04-16T12:55:00+02:00',
                        formatedDate: '16/04/2020'
                    },
                    companyURL: '/aerolineas/logo_pos_IB.svg',
                    overnight: false,
                    departureDateTimeParsed: '11:50',
                    arrivalDateTimeParsed: '12:55',
                    flight: {
                        marketingFlightNumber: '0426',
                        operationalFlightNumber: '',
                        operationalDisclosure: 'IB'
                    },
                    durationParsed: '01h 5min.',
                    fareFamilyConditions: [
                        null,
                        null,
                        null,
                        null,
                        null
                    ],
                    segmentId: 'IB042620200416',
                    sliceId: 'MADBIO20200416115000',
                    status: {
                        code: 'HK',
                        description: 'Confirmado'
                    },
                    cabin: {
                        rbd: 'A',
                        description: 'Turista',
                        remainingSeats: null,
                        fareFamily: 'TBAESES',
                        code: 'R',
                        type: 'ECONOMY',
                        bookingClass: 'ECONOMY'
                    },
                    flown: false,
                    warnings: {},
                    stop: null
                }
            ],
            departureDateParsed: {
                dateTime: '11:50',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 16,
                monthNumber: 4,
                month: 'MONTH_APRIL',
                year: 2020,
                originalDate: '2020-04-16T11:50:00+02:00',
                formatedDate: '16/04/2020'
            },
            arrivalDateParsed: {
                dateTime: '12:55',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 16,
                monthNumber: 4,
                month: 'MONTH_APRIL',
                year: 2020,
                originalDate: '2020-04-16T12:55:00+02:00',
                formatedDate: '16/04/2020'
            },
            durationParsed: '01h 5min.',
            stopsNumber: 0,
            daysToGo: -18,
            checked: true,
            newDateSelected: null,
            dateOptions: {
                showWeeks: false,
                maxMode: 'day',
                minDate: {
                    _isAMomentObject: true,
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _locale: {
                        _invalidDate: 'Invalid date',
                        _ordinal: '%dº',
                        _monthsParseExact: true,
                        _weekdaysParseExact: true,
                        _abbr: 'es'
                    },
                    _d: '2020-05-05T05:38:41.104Z',
                    _isValid: true
                },
                maxDate: {
                    _isAMomentObject: true,
                    _i: '2021-04-29T22:00:00.000Z',
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _locale: {
                        _invalidDate: 'Invalid date',
                        _ordinal: '%dº',
                        _monthsParseExact: true,
                        _weekdaysParseExact: true,
                        _abbr: 'es'
                    },
                    _d: '2021-04-29T22:00:00.000Z',
                    _isValid: true
                }
            }
        },
        BIOMAD20200514175000: {
            departureCity: {
                code: 'BIO',
                name: 'Bilbao',
                terminal: null,
                city: {
                    code: 'BIO',
                    description: 'Bilbao',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrivalCity: {
                code: 'MAD',
                name: 'Madrid',
                terminal: '4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            segments: [
                {
                    departureDateParsed: {
                        dateTime: '17:50',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 14,
                        monthNumber: 5,
                        month: 'MONTH_MAY',
                        year: 2020,
                        originalDate: '2020-05-14T17:50:00+02:00',
                        formatedDate: '14/05/2020'
                    },
                    arrivalDateParsed: {
                        dateTime: '19:00',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 14,
                        monthNumber: 5,
                        month: 'MONTH_MAY',
                        year: 2020,
                        originalDate: '2020-05-14T19:00:00+02:00',
                        formatedDate: '14/05/2020'
                    },
                    companyURL: '/aerolineas/logo_pos_IB.svg',
                    overnight: false,
                    departureDateTimeParsed: '17:50',
                    arrivalDateTimeParsed: '19:00',
                    flight: {
                        marketingFlightNumber: '0449',
                        operationalFlightNumber: '',
                        operationalDisclosure: 'IB'
                    },
                    durationParsed: '01h 10min.',
                    fareFamilyConditions: [],
                    segmentId: 'IB044920200514',
                    sliceId: 'BIOMAD20200514175000',
                    status: {
                        code: 'HK',
                        description: 'Confirmado'
                    },
                    cabin: {
                        rbd: 'A',
                        description: 'Turista',
                        remainingSeats: null,
                        fareFamily: null,
                        code: 'R',
                        type: 'ECONOMY',
                        bookingClass: 'ECONOMY'
                    },
                    flown: false,
                    warnings: {},
                    stop: null
                }
            ],
            departureDateParsed: {
                dateTime: '17:50',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 14,
                monthNumber: 5,
                month: 'MONTH_MAY',
                year: 2020,
                originalDate: '2020-05-14T17:50:00+02:00',
                formatedDate: '14/05/2020'
            },
            arrivalDateParsed: {
                dateTime: '19:00',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 14,
                monthNumber: 5,
                month: 'MONTH_MAY',
                year: 2020,
                originalDate: '2020-05-14T19:00:00+02:00',
                formatedDate: '14/05/2020'
            },
            durationParsed: '01h 10min.',
            stopsNumber: 0,
            daysToGo: 9,
            checked: true,
            newDateSelected: '2020-05-14T22:00:00.000Z',
            dateOptions: {
                showWeeks: false,
                maxMode: 'day',
                minDate: {
                    _isAMomentObject: true,
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _locale: {
                        _invalidDate: 'Invalid date',
                        _ordinal: '%dº',
                        _monthsParseExact: true,
                        _weekdaysParseExact: true,
                        _abbr: 'es'
                    },
                    _d: '2020-05-05T05:38:41.104Z',
                    _isValid: true
                },
                maxDate: {
                    _isAMomentObject: true,
                    _i: '2021-04-29T22:00:00.000Z',
                    _isUTC: false,
                    _pf: {
                        empty: false,
                        overflow: -2,
                        charsLeftOver: 0,
                        nullInput: false,
                        invalidMonth: null,
                        invalidFormat: false,
                        userInvalidated: false,
                        iso: false,
                        meridiem: null
                    },
                    _d: '2021-04-29T22:00:00.000Z',
                    _isValid: true
                },
                initDate: '2020-05-14T15:50:00.000Z'
            },
            parseNewDateSelected: {
                day: 15,
                month: 5,
                year: 2020,
                weekDay: 5
            }
        }
    };

    var fakeMmBUtilService = {
        'getDateFormatted': jasmine.createSpy('getFormatedDate').and.callFake(() =>  {
            return { 'formatedDate': '2020-05-15', 'dateFormatByLanguage': {} };
        })
    };

    beforeEach(() =>  {
        angular.mock.module('ib-flexibilization-search-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject((_IbFlexFlexibilizationTransformer_, _localStorageService_) => {
            IbFlexFlexibilizationTransformer = _IbFlexFlexibilizationTransformer_;
            localStorageService = _localStorageService_;
        });
        localStorageService.set('flowId', 'TWFuYWdlTXlCb29raW5nQElCNjU3MjBjZjQ3ZWM4NDJlZDhlN2E1YmRkZmRkMzZhOGM%3D');
    });

    describe('When IbFlexFlexibilizationTransformer is called', () =>  {
        it('IbFlexFlexibilizationTransformer should be defined', (done) =>  {
            expect(IbFlexFlexibilizationTransformer).toBeDefined();
            done();
        });
    });

    describe('When generateRequestFlexibilization function is called', () =>  {
        it('Should return a request', (done) =>  {

            var response = IbFlexFlexibilizationTransformer.generateRequestFlexibilization(mock1);

            expect(response.flowId).toEqual('TWFuYWdlTXlCb29raW5nQElCNjU3MjBjZjQ3ZWM4NDJlZDhlN2E1YmRkZmRkMzZhOGM%3D');
            expect(response.slices[0].sliceId).toEqual('BIOMAD20200514175000');
            expect(response.slices[0].date.formatedDate).toEqual('2020-05-15');
            done();
        });
    });

    describe('When getModelFlighVC function is called', () =>  {
        it('Should return a request equal to "return"', (done) =>  {
            var data = {
                flights:mock1
            };
            var slicesId= [
                'MADBIO20200416115000',
                'BIOMAD20200514175000'
            ];
            var response = IbFlexFlexibilizationTransformer.getModelFlighVC(data,slicesId,2);
            expect(response).toEqual('return');
            done();
        });
        it('Should return a request equal to "twice"', (done) =>  {
            var data = {
                flights:mock2
            };
            var slicesId= [
                'MADBIO20200416115000',
                'BIOMAD20200514175000'
            ];
            var response = IbFlexFlexibilizationTransformer.getModelFlighVC(data,slicesId,2);
            expect(response).toEqual('twice');
            done();
        });
    });

    describe('When getBuildModelVC function is called', () =>  {
        it('Should return a array', (done) =>  {

            var result = [
                {
                    originDestinationId:'OD1',
                    origin: 'MAD',
                    destination: 'BIO',
                    originCity: {
                        description: 'Madrid',
                    },
                    destinationCity: {
                        description: 'Bilbao',
                    }
                },
                {
                    originDestinationId:'OD2',
                    origin: 'BIO',
                    destination: 'MAD',
                    originCity: {
                        description: 'Bilbao',
                    },
                    destinationCity: {
                        description: 'Madrid',
                    }
                },
            ];
            var response = IbFlexFlexibilizationTransformer.getBuildModelVC(mock1);
            expect(response).toEqual(result);
            done();
        });

    });

});
