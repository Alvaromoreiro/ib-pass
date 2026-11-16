
describe('test for module ib-disruption-main-module - factories', function () {
    let object1 = {
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
                    {
                        provider: '1A',
                        reference: 'SLVOAU'
                    }
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
                    {
                        fareCalculation: 'MAD IB IBZ223.00IB PMI85.00EUR308.00END',
                        passengerId: 'ADULT_01'
                    }
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
                    {
                        fare: 223,
                        currency: 'EUR'
                    }
                ],
                segments: [
                    {
                        type: 'CONFIRMED',
                        mmbAllowed: true,
                        noShow: false,
                        flyNow: false,
                        flown: false,
                        overnight: false,
                        id: 'IB380820200718',
                        duration: 75,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2020-07-18 11:45',
                        departureUtcDateTime: '2020-07-18T09:45:00.000',
                        arrivalDateTime: '2020-07-18 13:00',
                        arrivalUtcDateTime: '2020-07-18T11:00:00.000'
                    }
                ],
                overnight: false,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01'
                    }
                ],

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
                    {
                        fare: 85,
                        currency: 'EUR'
                    }
                ],
                segments: [
                    {
                        type: 'CONFIRMED',
                        mmbAllowed: true,
                        noShow: false,
                        flyNow: false,
                        flown: false,
                        overnight: false,
                        id: 'IB851920200718',
                        duration: 45,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2020-07-18 14:30',
                        departureUtcDateTime: '2020-07-18T12:30:00.000',
                        arrivalDateTime: '2020-07-18 15:15',
                        arrivalUtcDateTime: '2020-07-18T13:15:00.000'
                    }
                ],
                overnight: false,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01'
                    }
                ],
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
        pointsRedeemed: null,
        phonesList: {
            RESERVAS: {
                prefix: '(+34)',
                telephone: '913894357',
                text: '',
                prefixAlt: '',
                telephoneAlt: '',
                textAlt: '',
                timeText: ''
            }
        }
    };
    let object12 = {
        formatedDate: '18/07/2020'
    }

    let object13 = {
        _isAMomentObject: true,
        _i: '2020-07-18 11:45',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                11,
                45
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T09:45:00.000Z',
        _isValid: true
    }
    let object24 = {
        formatedDate: '18/07/2020'
    }
    let object25 = {
        _isAMomentObject: true,
        _i: '2020-07-18 13:00',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                13,
                0
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T11:00:00.000Z',
        _isValid: true
    }
    let object36 = {
        formatedDate: '18/07/2020'
    }
    let object37 = {
        _isAMomentObject: true,
        _i: '2020-07-18 13:00',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                13,
                0
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T11:00:00.000Z',
        _isValid: true
    }
    let object48 = {
        formatedDate: '18/07/2020'
    }
    let object49 = {
        _isAMomentObject: true,
        _i: '2020-07-18 11:45',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                11,
                45
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T09:45:00.000Z',
        _isValid: true
    }
    let object60 = {
        formatedDate: '18/07/2020'
    }
    let object61 = {
        _isAMomentObject: true,
        _i: '2020-07-18 11:45',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                11,
                45
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T09:45:00.000Z',
        _isValid: true
    }
    let object72 = {
        formatedDate: '18/07/2020'
    }
    let object73 = {
        _isAMomentObject: true,
        _i: '2020-07-18 13:00',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                13,
                0
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T11:00:00.000Z',
        _isValid: true
    }
    let object84 = {
        formatedDate: '18/07/2020'
    }
    let object85 = {
        _isAMomentObject: true,
        _i: '2020-07-18 13:00',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                13,
                0
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T11:00:00.000Z',
        _isValid: true
    }
    let object96 = {
        formatedDate: '18/07/2020'
    }
    let object97 = {
        _isAMomentObject: true,
        _i: '2020-07-18 11:45',
        _f: 'YYYY-MM-DD HH:mm',
        _isUTC: false,
        _pf: {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -1,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: true,
            parsedDateParts: [
                2020,
                6,
                18,
                11,
                45
            ]
        },
        _locale: {
            _calendar: {
                sameDay: jasmine.any(Function),
                nextDay: jasmine.any(Function),
                nextWeek: jasmine.any(Function),
                lastDay: jasmine.any(Function),
                lastWeek: jasmine.any(Function),
                sameElse: 'L'
            },
            _longDateFormat: {
                LTS: 'H:mm:ss',
                LT: 'H:mm',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
            },
            _invalidDate: 'Invalid date',
            _ordinal: '%dº',
            _ordinalParse: {},
            _relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            _months: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthsShort: jasmine.any(Function),
            _week: {
                dow: 1,
                doy: 4
            },
            _weekdays: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ],
            _weekdaysMin: [
                'do',
                'lu',
                'ma',
                'mi',
                'ju',
                'vi',
                'sá'
            ],
            _weekdaysShort: [
                'dom.',
                'lun.',
                'mar.',
                'mié.',
                'jue.',
                'vie.',
                'sáb.'
            ],
            _meridiemParse: {},
            _monthsParseExact: true,
            _weekdaysParseExact: true,
            _abbr: 'es',
            _config: {
                invalidDate: 'Invalid date',
                ordinal: '%dº',
                months: [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'
                ],
                monthsShort: jasmine.any(Function),
                weekdays: [
                    'domingo',
                    'lunes',
                    'martes',
                    'miércoles',
                    'jueves',
                    'viernes',
                    'sábado'
                ],
                weekdaysMin: [
                    'do',
                    'lu',
                    'ma',
                    'mi',
                    'ju',
                    'vi',
                    'sá'
                ],
                weekdaysShort: [
                    'dom.',
                    'lun.',
                    'mar.',
                    'mié.',
                    'jue.',
                    'vie.',
                    'sáb.'
                ],
                monthsParseExact: true,
                weekdaysParseExact: true,
                abbr: 'es'
            },
            _ordinalParseLenient: {}
        },
        _d: '2020-07-18T09:45:00.000Z',
        _isValid: true
    }
    let    localStorageService,localStorageGetSpy,$injector;
    let DisruptionModel: any = {};
    let fakeMmBUtilService = {
        'getCompanyURL': {},
        'removeDuplicates': {},
        'getFormatedDate': {},
        'getElementsByProperty': {}
    };
    let $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        let filterFunc: any = function () {
            return [];
        };
        filterFunc = function () {
            return '';
        };

        return filterFunc;
    })
    let fakegetListForScenario = {
        'auxModelObj': {
            'code': jasmine.createSpy(),
            'list': jasmine.createSpy(),

        },
        'indexSlice': jasmine.createSpy(),
        'resultList': jasmine.createSpy(),
        'index': jasmine.createSpy(),

    };
    let fakelocalStorageService = {
        'get': jasmine.createSpy(),
    };
    let faketranslate = {
        'onReady': jasmine.createSpy()
    };
    let $q;
    let DisruptionDashboardConstants={
        OPERATIONAL_GROUP_IBERIA: ['IB', 'I2', 'YW', 'LV', 'I0', '0I'],
        SEGMENT_WARNINGS: {
            'SAME_FLIGHT_SAME_TIME': 'SSE_ORM_9429',
            'DIFF_FLIGHT_OR_TIME': 'SSE_ORM_9430',
            'SAME_FLIGHT_SAME_TIME_UNTK': 'SSE_ORM_9433'
        },
        DISRUPTION_TYPES: {
            'TYPE_SCHEDULE': 'SCHEDULE_CHANGE',
            'TYPE_SCHEDULE_TIME': 'SCHEDULE_TIME_CHANGE',
            'TYPE_CHANGE': 'FLIGHT_CHANGE',
            'TYPE_CANCEL': 'CANCELATION_CHANGE_NO_REACOM',
            'TYPE_CANCEL_REACOM': 'CANCELATION_CHANGE',
            'TYPE_SCHEDULE_MIXED': 'SCHEDULE_TIME_AND_CANCELATION',
            'TYPE_CANCEL_MIXED': 'CANCELATION_CHANGE_MIXTED',
            'TYPE_CANCEL_MISSCONECTION': 'MISSCONECTION',
            'TYPE_CANCEL_GENERAL': 'GENERAL_CANCELATION_CHANGE_NO_REACOM',
            'TYPE_CANCEL_REACOM_GENERAL': 'GENERAL_CANCELATION_CHANGE_REACOM',
            'TYPE_SCHEDULE_GENERAL': 'GENERAL_SCHEDULE_CHANGE',
            'TYPE_CANCEL_MIXED_GENERAL': 'GENERAL_CANCELATION_CHANGE_MIXTED',
            'TYPE_SCHEDULE_MIXED_GENERAL': 'GENERAL_SCHEDULE_TIME_AND_CANCELATION',
            'TYPE_SCHEDULE_TIME_GENERAL': 'GENERAL_SCHEDULE_TIME_CHANGE',
            'TYPE_GENERIC': 'GENERIC',
            'CANCELATION_CHANGE_NO_REACOM_MISSCONECTION': 'CANCELATION_CHANGE_NO_REACOM_MISSCONECTION',
            'CANCELATION_CHANGE_MISSCONECTION': 'CANCELATION_CHANGE_MISSCONECTION',
            'SCHEDULE_TIME_CHANGE_MISSCONECTION': 'SCHEDULE_TIME_CHANGE_MISSCONECTION',
            'CANCELATION_CHANGE_MIXTED_MISSCONECTION': 'CANCELATION_CHANGE_MIXTED_MISSCONECTION',
            'SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION': 'SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION',
            'GENERIC_MISSCONECTION': 'GENERIC_MISSCONECTION',
            'SCHEDULE_CHANGE_MISSCONECTION': 'SCHEDULE_CHANGE_MISSCONECTION',
            'DOWNGRADE_SAME_FLIGHT': 'GENERAL_SCHEDULE_TIME_CHANGE_DOWNGRADE',
            'DOWNGRADE_DIFF_FLIGHT': 'GENERAL_CANCELATION_CHANGE_REACOM_DOWNGRADE'
        },
        FLIGHT_LIST_MODEL: [
            { 'name': 'reacomList' },
            { 'name': 'canceledList' },
            { 'name': 'confirmedList' },
            { 'name': 'sheduleList' },
            { 'name': 'downgradeList'}
        ],
        CONFIGURATION_TYPE: {
            'SCHEDULE_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE'
            },
            'SCHEDULE_CHANGE_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'SCHEDULE_TIME_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE',
                    'SUBTITLE': 'MMB_DISRUPTION_ALTERNATIVE_HEADER_SUB_TITLE',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'SCHEDULE_TIME_CHANGE_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_MIXTED': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'CANCELATION_CHANGE_MIXTED_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_NO_REACOM': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_OFFER_CHANGES'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_NO_REACOM_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_REACOM_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'SCHEDULE_TIME_AND_CANCELATION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    }
                ],
            },
            'SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_REACOM_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'MISSCONECTION_BLACK': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                //CREAR UN NUEVO TIPO DE MISSCONNECTION IGUAL PERO CON 'type': 'TYPE_MISSCONECTION', TENIENDO EL TYPE_MISSCONECTION EL COLOR DE TARJETA GRIS (CSS)
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'GENERAL_CANCELATION_CHANGE_NO_REACOM': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_NO_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_OFFER_CHANGES'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'GENERAL_CANCELATION_CHANGE_REACOM': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    }
                ],
            },
            'GENERAL_CANCELATION_CHANGE_REACOM_DOWNGRADE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'DOWN' }],
                        'invalidSegmentStatus': [{'code': 'TK'}]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }],
                        'invalidSegmentStatus': [{'code': 'UN'}]
                    }
                ],
            },
            'GENERAL_SCHEDULE_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_SCHEDULE_CHANGE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE'
            },
            'GENERAL_CANCELATION_CHANGE_MIXTED': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_NO_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERAL_SCHEDULE_TIME_AND_CANCELATION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    }
                ],
            },
            'GENERAL_SCHEDULE_TIME_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERAL_SCHEDULE_TIME_CHANGE_DOWNGRADE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE_DOWNGRADE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_DOWNGRADE',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'DOWN' } ],
                        'invalidSegmentStatus': [{'code': 'UN'}]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERIC': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_GENERIC',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'HK'}, { 'code': 'TK'}, { 'code': 'RR'}, {'code': 'KK' },
                        { 'code': 'HL' }, { 'code': 'TL' }, { 'code': 'KL' }, { 'code': 'HN' }, { 'code': 'SA' },
                        { 'code': 'HX' }, { 'code': 'NO' }, { 'code': 'UN' }, { 'code': 'UC' }, { 'code': 'TKT' }]
                    }
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERIC_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_GENERIC_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'HK' }, { 'code': 'TK' }, { 'code': 'RR' }, { 'code': 'KK' },
                        { 'code': 'HL' }, { 'code': 'TL' }, { 'code': 'KL' }, { 'code': 'HN' }, { 'code': 'SA' },
                        { 'code': 'HX' }, { 'code': 'NO' }, { 'code': 'UN' }, { 'code': 'UC' }, { 'code': 'TKT' }]
            }
                ],
            }
        },
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy()
    };

    let fakeDisruptionUtilService = {
        searchSlices: jasmine.createSpy(),
        evaluateRule: jasmine.createSpy(),
    };

    let downgradeCodesMock='SSE_ORM_9429';
    let bookingInfoMock=' ';
    let missconnectionWarningMessageMock=' ';

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'ib-disruption-main-module', 'LocalStorageModule', function ($provide) {
            $provide.value('$filter', $filterFake);
            $provide.value('$translate', faketranslate);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('localStorageService', fakelocalStorageService);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            $provide.value('getListForScenario', fakegetListForScenario);

            faketranslate.onReady = jasmine.createSpy('onReady').and.callFake(function () {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });

        });
        inject((_$q_, _$injector_, _DisruptionDashboardConstants_) => {
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            $q = _$q_;
            DisruptionDashboardConstants = _DisruptionDashboardConstants_,
            localStorageService = $injector.get('localStorageService');
            localStorageGetSpy = spyOn(localStorageService, 'get');
            localStorageGetSpy.withArgs('downgradeCodes').and.returnValue(downgradeCodesMock);
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(bookingInfoMock);
            localStorageGetSpy.withArgs('missconnectionWarningMessage').and.returnValue(missconnectionWarningMessageMock);
        });
    });

    describe('test for DisruptionDashboardTransformer', function () {

        let DisruptionDashboardTransformer;
        let MmBUtilService;
        let DisruptionUtilService;
        let $injector;
        let getListForScenario;

        beforeEach(function () {
            inject(function (_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key];
                    return clone
                }, {});

                DisruptionUtilService = $injector.get('DisruptionUtilService');
                MmBUtilService = $injector.get('MmBUtilService');
                getListForScenario = $injector.get('getListForScenario');
                DisruptionDashboardTransformer = $injector.get('DisruptionDashboardTransformer');
            });
        });

        it('DisruptionDashboardTransformer should be defined', function () {

            expect(DisruptionDashboardTransformer).toBeDefined();
        });

        it('test for DisruptionDashboardTransformer.transformPhoneCallCenter', function () {


            DisruptionDashboardTransformer.transformPhoneCallCenter(object1, DisruptionModel);

            expect(DisruptionModel.contactPhone).toBe('(+34) 913894357');
        });
        it('test for DisruptionDashboardTransformer.transformFlightsPending', function(){
           let slice, returnValue;
            slice = {
                segments: [
                    {
                        id: 'SEGMENTID_001',
                        flight:{
                            marketingFlightNumber: '1542',
                            marketingCarrier:{
                                companyUrl: 'Ib'
                            },
                            operationalCarrier:{
                                name: 'Iberia',
                            },
                            aircraft : {
                                description:'Boing775',
                                companyUrl: 'Ib'
                            }

                        },
                        departureCity : {
                            countryCode : 'ESP'
                        },
                        arrivalCity:{
                            countryCode : 'ESP'
                        },
                        departureDateTime:'1',
                        arrivalDateTime:'2',
                        departure:{
                            code: 'MAD',
                            city:{
                                description : 'Madrid'
                            }
                        },
                        arrival:{
                            code: 'AGP',
                            city:{
                                description : 'Malaga'
                            }
                        },
                        duration: 125,
                        waitingTime: 130,
                        status: {
                            code: 'UN'
                        },
                        warnings: [
                            {
                                code: 'SSE_ORM_20013',
                                description : 'Cambio de terminal'
                            }
                        ]
                    }
                ]
            }
            returnValue = DisruptionDashboardTransformer.transformFlightsPending(slice);
            expect(returnValue.activationFlags.previousDate).toEqual(false);
            expect(returnValue.activationFlags.moreDetailsArea).toEqual(false);
            expect(returnValue.activationFlags.nodeDetails).toEqual(false);
            expect(returnValue.activationFlags.fareDetails).toEqual(false);

        });
        it('test for DisruptionDashboardTransformer.transformOrderData', function () {

            let object8 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '14:30',
                            arrivalTime: '15:15',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            flightDuration: '45min.',
                            departureCity: 'Ibiza',
                            arrivalCity: 'Palma de Mallorca',
                            departureAPort: 'IBZ',
                            arrivalAPort: 'PMI'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: '',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--summary',
                            classFlightNormalAreaDate: 'ib-ticket-block__date',
                            classFlightXsAreaContainer: ''
                        }
                    }
                ],
                textEnabled: true,
                acceptEnabled: false,
                title: 'MMB_DISRUPTION_LABEL_REMEMBER',
                desc: 'MMB_DISRUPTION_LABEL_ACCEPT_WARNING',
                numberEnabled: false
            }
            let object15 = {}
            let object16 = {
                title: 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID'
            }
            let object17 = {
                title: 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID',
                subTitle: 'MMB_DISRUPTION_OFFER_NEW_DATES',
                numberEnabled: false
            }
            let object18 = {
                title: 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID',
                subTitle: 'MMB_DISRUPTION_OFFER_NEW_DATES',
                titleDesc: 'MMB_DISRUPTION_SHOW_OFFER_CHANGES'
            }
            let object19 = {
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
                            {
                                provider: '1A',
                                reference: 'SLVOAU'
                            }
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
                            {
                                fareCalculation: 'MAD IB IBZ223.00IB PMI85.00EUR308.00END',
                                passengerId: 'ADULT_01'
                            }
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
                            {
                                fare: 223,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB380820200718',
                                duration: 75,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-07-18 11:45',
                                departureUtcDateTime: '2020-07-18T09:45:00.000',
                                arrivalDateTime: '2020-07-18 13:00',
                                arrivalUtcDateTime: '2020-07-18T11:00:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            }
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
                            {
                                fare: 85,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB851920200718',
                                duration: 45,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-07-18 14:30',
                                departureUtcDateTime: '2020-07-18T12:30:00.000',
                                arrivalDateTime: '2020-07-18 15:15',
                                arrivalUtcDateTime: '2020-07-18T13:15:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            }
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
                pointsRedeemed: null,
                phonesList: null
            }
            let object20 = {
                'passen': '',
                'order': {
                    'price': 3
                }
            }
            let spy3 = spyOn(MmBUtilService, 'getElementsByProperty');
            spy3.and.returnValue('');
            DisruptionModel.headerCard = object1;
            DisruptionModel.bottomCard = object8;
            DisruptionModel.middleCard = {};
            DisruptionModel.common = object15;
            DisruptionModel.common = object16;
            DisruptionModel.common = object17;
            DisruptionModel.common = object18;

            DisruptionDashboardTransformer.transformOrderData(object20, object19, DisruptionModel, 'CANCELATION_CHANGE_NO_REACOM');

            expect(DisruptionModel.common.title).toBe('MMB_DISRUPTION_FLIGHT_CANCELATION_COVID');

        });
        it('test for DisruptionDashboardTransformer.transformDateSelectorData', function () {

            let spyUtilSearchSlice = spyOn(DisruptionUtilService, 'searchSlices');
            let spy1 = spyOn(MmBUtilService, 'getFormatedDate');

           let array89 = [
                {
                    sliceId: 'MADBIO20200618074000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-18 07:40',
                    arrivalDateTime: '2020-06-18 08:40',
                    duration: 60,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            arrival: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            departureCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0448',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044820200618',
                            duration: 60,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-18 07:40',
                            departureUtcDateTime: '2020-06-18T05:40:00.000',
                            arrivalDateTime: '2020-06-18 08:40',
                            arrivalUtcDateTime: '2020-06-18T06:40:00.000',
                            status: {
                                code: 'UN',
                                description: 'Servicio no ofrecido'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                },
                {
                    sliceId: 'BIOMAD20200619175000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-19 17:50',
                    arrivalDateTime: '2020-06-19 19:00',
                    duration: 70,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            arrival: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            departureCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0449',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044920200619',
                            duration: 70,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-19 17:50',
                            departureUtcDateTime: '2020-06-19T15:50:00.000',
                            arrivalDateTime: '2020-06-19 19:00',
                            arrivalUtcDateTime: '2020-06-19T17:00:00.000',
                            status: {
                                code: 'HK',
                                description: 'Confirmado'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                }
            ]
           let object128 = {
                list: [
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ],
                        isCancel: true
                    },
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ],
                        isCancel: true
                    },
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ],
                        isCancel: true
                    },
                ],
                code: 'UN'
            }
           let array112 = [
                {
                    sliceId: 'MADBIO20200618074000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-18 07:40',
                    arrivalDateTime: '2020-06-18 08:40',
                    duration: 60,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            arrival: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            departureCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0448',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044820200618',
                            duration: 60,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-18 07:40',
                            departureUtcDateTime: '2020-06-18T05:40:00.000',
                            arrivalDateTime: '2020-06-18 08:40',
                            arrivalUtcDateTime: '2020-06-18T06:40:00.000',
                            status: {
                                code: 'UN',
                                description: 'Servicio no ofrecido'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                },
                {
                    sliceId: 'BIOMAD20200619175000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-19 17:50',
                    arrivalDateTime: '2020-06-19 19:00',
                    duration: 70,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            arrival: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            departureCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0449',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044920200619',
                            duration: 70,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-19 17:50',
                            departureUtcDateTime: '2020-06-19T15:50:00.000',
                            arrivalDateTime: '2020-06-19 19:00',
                            arrivalUtcDateTime: '2020-06-19T17:00:00.000',
                            status: {
                                code: 'HK',
                                description: 'Confirmado'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                }
            ]
           let  GenericDisruption:true;
            spy1.withArgs(object1, null).and.returnValue(object12);
            spy1.withArgs(object13, null).and.returnValue(object24);
            spy1.withArgs(object25, null).and.returnValue(object36);
            spy1.withArgs(object37, null).and.returnValue(object48);
            spy1.withArgs(object49, null).and.returnValue(object60);
            spy1.withArgs(object61, null).and.returnValue(object72);
            spy1.withArgs(object73, null).and.returnValue(object84);
            spy1.withArgs(object85, null).and.returnValue(object96);
            spyUtilSearchSlice.and.returnValue([
                {
                    segments : [
                        {
                            flight : {
                                operationalCarrier:{
                                    code : 'IB'
                                }
                            }
                        }
                    ]
                }
            ]);

            DisruptionModel.selectorFlights = object97;
            DisruptionModel.flagSelectorDate =  true;

            DisruptionDashboardTransformer.transformDateSelectorData(array89, object128, array112,array89, DisruptionModel,GenericDisruption);

            expect(DisruptionModel.selectorFlights.flights.MADBIO20200618074000.type).toBe('REGULAR');
            expect(DisruptionModel.selectorFlights.optional).toBe('BIOMAD20200619175000');
        });
        it('test for DisruptionDashboardTransformer.transformDateSelectorData with not Iberia operational carrier', function () {

            let spyUtilSearchSlice = spyOn(DisruptionUtilService, 'searchSlices');
            let spy1 = spyOn(MmBUtilService, 'getFormatedDate');

           let array89 = [
                {
                    sliceId: 'MADBIO20200618074000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-18 07:40',
                    arrivalDateTime: '2020-06-18 08:40',
                    duration: 60,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            arrival: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            departureCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0448',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044820200618',
                            duration: 60,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-18 07:40',
                            departureUtcDateTime: '2020-06-18T05:40:00.000',
                            arrivalDateTime: '2020-06-18 08:40',
                            arrivalUtcDateTime: '2020-06-18T06:40:00.000',
                            status: {
                                code: 'UN',
                                description: 'Servicio no ofrecido'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                },
                {
                    sliceId: 'BIOMAD20200619175000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-19 17:50',
                    arrivalDateTime: '2020-06-19 19:00',
                    duration: 70,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            arrival: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            departureCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0449',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044920200619',
                            duration: 70,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-19 17:50',
                            departureUtcDateTime: '2020-06-19T15:50:00.000',
                            arrivalDateTime: '2020-06-19 19:00',
                            arrivalUtcDateTime: '2020-06-19T17:00:00.000',
                            status: {
                                code: 'HK',
                                description: 'Confirmado'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                }
            ]
           let object128 = {
                list: [
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ],
                        isCancel: true
                    },
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ],
                        isCancel: true
                    },
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
                                currency: 'EUR'
                            }
                        ],
                        segments: [
                            {
                                type: 'CONFIRMED',
                                mmbAllowed: true,
                                noShow: false,
                                flyNow: false,
                                flown: false,
                                overnight: false,
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ],
                        isCancel: true
                    },
                ],
                code: 'UN'
            }
           let array112 = [
                {
                    sliceId: 'MADBIO20200618074000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-18 07:40',
                    arrivalDateTime: '2020-06-18 08:40',
                    duration: 60,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            arrival: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            departureCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0448',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044820200618',
                            duration: 60,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-18 07:40',
                            departureUtcDateTime: '2020-06-18T05:40:00.000',
                            arrivalDateTime: '2020-06-18 08:40',
                            arrivalUtcDateTime: '2020-06-18T06:40:00.000',
                            status: {
                                code: 'UN',
                                description: 'Servicio no ofrecido'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                },
                {
                    sliceId: 'BIOMAD20200619175000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-19 17:50',
                    arrivalDateTime: '2020-06-19 19:00',
                    duration: 70,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 115,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        },
                        {
                            fare: 77.05,
                            currency: 'EUR',
                            passengerIds: [
                                'CHILD_01'
                            ],
                            segmentPrices: [
                                null
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'BIO',
                                name: 'Bilbao',
                                terminal: null
                            },
                            arrival: {
                                code: 'MAD',
                                name: 'Madrid',
                                terminal: '4'
                            },
                            departureCity: {
                                code: 'BIO',
                                description: 'Bilbao',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            flight: {
                                marketingFlightNumber: '0449',
                                operationalFlightNumber: '',
                                operationalDisclosure: 'IB'
                            },
                            cabin: {
                                rbd: 'V',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: 'BASBIO',
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB044920200619',
                            duration: 70,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2020-06-19 17:50',
                            departureUtcDateTime: '2020-06-19T15:50:00.000',
                            arrivalDateTime: '2020-06-19 19:00',
                            arrivalUtcDateTime: '2020-06-19T17:00:00.000',
                            status: {
                                code: 'HK',
                                description: 'Confirmado'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        },
                        {
                            passengerId: 'CHILD_01',
                            flags: [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                }
            ]
           let  GenericDisruption:true;
            spy1.withArgs(object1, null).and.returnValue(object12);
            spy1.withArgs(object13, null).and.returnValue(object24);
            spy1.withArgs(object25, null).and.returnValue(object36);
            spy1.withArgs(object37, null).and.returnValue(object48);
            spy1.withArgs(object49, null).and.returnValue(object60);
            spy1.withArgs(object61, null).and.returnValue(object72);
            spy1.withArgs(object73, null).and.returnValue(object84);
            spy1.withArgs(object85, null).and.returnValue(object96);
            spyUtilSearchSlice.and.returnValue([
                {
                    segments : [
                        {
                            flight : {
                                operationalCarrier:{
                                    code : 'RR'
                                }
                            }
                        }
                    ]
                }
            ]);

            DisruptionModel.selectorFlights = object97;
            DisruptionModel.flagSelectorDate =  true;

            DisruptionDashboardTransformer.transformDateSelectorData(array89, object128, array112,array89, DisruptionModel,GenericDisruption);

            expect(DisruptionModel.selectorFlights.flights.MADBIO20200618074000.type).toBe('REGULAR');
            expect(DisruptionModel.selectorFlights.optional).toBe('BIOMAD20200619175000');
        });
        it('test for DisruptionDashboardTransformer.transformDisruptionData', async function () {
            let transformDisruptionData = {
                code: '',
                list: {},
            };
            let spy1 = spyOn(MmBUtilService, 'getCompanyURL');


            let spy2 = spyOn(MmBUtilService, 'getFormatedDate');

            let object108 = {
                formatedDate: '18/07/2020'
            }
            let object109 = {
                _isAMomentObject: true,
                _i: '2020-07-18 11:45',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        11,
                        45
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T09:45:00.000Z',
                _isValid: true
            }
            let object120 = {
                formatedDate: '18/07/2020'
            }
            let object121 = {
                _isAMomentObject: true,
                _i: '2020-07-18 13:00',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        13,
                        0
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T11:00:00.000Z',
                _isValid: true
            }
            let object132 = {
                formatedDate: '18/07/2020'
            }
            let object133 = {
                _isAMomentObject: true,
                _i: '2020-07-18 13:00',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        13,
                        0
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T11:00:00.000Z',
                _isValid: true
            }
            let object144 = {
                formatedDate: '18/07/2020'
            }
            let object145 = {
                _isAMomentObject: true,
                _i: '2020-07-18 14:30',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        14,
                        30
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T12:30:00.000Z',
                _isValid: true
            }
            let object156 = {
                formatedDate: '18/07/2020'
            }
            let object157 = {
                _isAMomentObject: true,
                _i: '2020-07-18 14:30',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        14,
                        30
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T12:30:00.000Z',
                _isValid: true
            }
            let object168 = {
                formatedDate: '18/07/2020'
            }
            let object169 = {
                _isAMomentObject: true,
                _i: '2020-07-18 15:15',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        15,
                        15
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T13:15:00.000Z',
                _isValid: true
            }
            let object180 = {
                formatedDate: '18/07/2020'
            }
            let object181 = {
                _isAMomentObject: true,
                _i: '2020-07-18 15:15',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        15,
                        15
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T13:15:00.000Z',
                _isValid: true
            }
            let object192 = {
                formatedDate: '18/07/2020'
            }
            let object193 = {
                _isAMomentObject: true,
                _i: '2020-07-18 14:30',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        14,
                        30
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T12:30:00.000Z',
                _isValid: true
            }
            let object204 = {
                formatedDate: '18/07/2020'
            }
            let object205 = {
                _isAMomentObject: true,
                _i: '2020-07-18 14:30',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        14,
                        30
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T12:30:00.000Z',
                _isValid: true
            }
            let object216 = {
                formatedDate: '18/07/2020'
            }
            let object217 = {
                _isAMomentObject: true,
                _i: '2020-07-18 15:15',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        15,
                        15
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T13:15:00.000Z',
                _isValid: true
            }
            let object228 = {
                formatedDate: '18/07/2020'
            }
            let object229 = {
                _isAMomentObject: true,
                _i: '2020-07-18 15:15',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        15,
                        15
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T13:15:00.000Z',
                _isValid: true
            }
            let object240 = {
                formatedDate: '18/07/2020'
            }
            let object241 = {
                _isAMomentObject: true,
                _i: '2020-07-18 14:30',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        14,
                        30
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T12:30:00.000Z',
                _isValid: true
            }
            let object252 = {
                formatedDate: '18/07/2020'
            }
            let object253 = {
                _isAMomentObject: true,
                _i: '2020-07-18 14:30',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        14,
                        30
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T12:30:00.000Z',
                _isValid: true
            }
            let object264 = {
                formatedDate: '18/07/2020'
            }
            let object265 = {
                _isAMomentObject: true,
                _i: '2020-07-18 15:15',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        15,
                        15
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T13:15:00.000Z',
                _isValid: true
            }
            let object276 = {
                formatedDate: '18/07/2020'
            }
            let object277 = {
                _isAMomentObject: true,
                _i: '2020-07-18 15:15',
                _f: 'YYYY-MM-DD HH:mm',
                _isUTC: false,
                _pf: {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -1,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: true,
                    parsedDateParts: [
                        2020,
                        6,
                        18,
                        15,
                        15
                    ]
                },
                _locale: {
                    _calendar: {
                        sameDay: jasmine.any(Function),
                        nextDay: jasmine.any(Function),
                        nextWeek: jasmine.any(Function),
                        lastDay: jasmine.any(Function),
                        lastWeek: jasmine.any(Function),
                        sameElse: 'L'
                    },
                    _longDateFormat: {
                        LTS: 'H:mm:ss',
                        LT: 'H:mm',
                        L: 'DD/MM/YYYY',
                        LL: 'D [de] MMMM [de] YYYY',
                        LLL: 'D [de] MMMM [de] YYYY H:mm',
                        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
                    },
                    _invalidDate: 'Invalid date',
                    _ordinal: '%dº',
                    _ordinalParse: {},
                    _relativeTime: {
                        future: 'en %s',
                        past: 'hace %s',
                        s: 'unos segundos',
                        m: 'un minuto',
                        mm: '%d minutos',
                        h: 'una hora',
                        hh: '%d horas',
                        d: 'un día',
                        dd: '%d días',
                        M: 'un mes',
                        MM: '%d meses',
                        y: 'un año',
                        yy: '%d años'
                    },
                    _months: [
                        'enero',
                        'febrero',
                        'marzo',
                        'abril',
                        'mayo',
                        'junio',
                        'julio',
                        'agosto',
                        'septiembre',
                        'octubre',
                        'noviembre',
                        'diciembre'
                    ],
                    monthsShort: jasmine.any(Function),
                    _week: {
                        dow: 1,
                        doy: 4
                    },
                    _weekdays: [
                        'domingo',
                        'lunes',
                        'martes',
                        'miércoles',
                        'jueves',
                        'viernes',
                        'sábado'
                    ],
                    _weekdaysMin: [
                        'do',
                        'lu',
                        'ma',
                        'mi',
                        'ju',
                        'vi',
                        'sá'
                    ],
                    _weekdaysShort: [
                        'dom.',
                        'lun.',
                        'mar.',
                        'mié.',
                        'jue.',
                        'vie.',
                        'sáb.'
                    ],
                    _meridiemParse: {},
                    _monthsParseExact: true,
                    _weekdaysParseExact: true,
                    _abbr: 'es',
                    _config: {
                        invalidDate: 'Invalid date',
                        ordinal: '%dº',
                        months: [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ],
                        monthsShort: jasmine.any(Function),
                        weekdays: [
                            'domingo',
                            'lunes',
                            'martes',
                            'miércoles',
                            'jueves',
                            'viernes',
                            'sábado'
                        ],
                        weekdaysMin: [
                            'do',
                            'lu',
                            'ma',
                            'mi',
                            'ju',
                            'vi',
                            'sá'
                        ],
                        weekdaysShort: [
                            'dom.',
                            'lun.',
                            'mar.',
                            'mié.',
                            'jue.',
                            'vie.',
                            'sáb.'
                        ],
                        monthsParseExact: true,
                        weekdaysParseExact: true,
                        abbr: 'es'
                    },
                    _ordinalParseLenient: {}
                },
                _d: '2020-07-18T13:15:00.000Z',
                _isValid: true
            }
            let object288 = {
                formatedDate: '18/07/2020'
            }
            let object289 = {}
            let object290 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '11:45',
                            arrivalTime: '13:00',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            departureCity: 'Madrid',
                            arrivalCity: 'Ibiza',
                            departureAPort: 'MAD',
                            arrivalAPort: 'IBZ'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--prev',
                            classFlightNormalAreaDate: 'ib-ticket-block__date--old ib-ticket-block__date--white',
                            classFlightXsAreaContainer: 'ib-ticket-block__date--old  ib-ticket-block__date--grey'
                        }
                    }
                ]
            }
            let object297 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '11:45',
                            arrivalTime: '13:00',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            departureCity: 'Madrid',
                            arrivalCity: 'Ibiza',
                            departureAPort: 'MAD',
                            arrivalAPort: 'IBZ'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--prev',
                            classFlightNormalAreaDate: 'ib-ticket-block__date--old ib-ticket-block__date--white',
                            classFlightXsAreaContainer: 'ib-ticket-block__date--old  ib-ticket-block__date--grey'
                        }
                    }
                ],
                textEnabled: false
            }
            let object304 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '11:45',
                            arrivalTime: '13:00',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            departureCity: 'Madrid',
                            arrivalCity: 'Ibiza',
                            departureAPort: 'MAD',
                            arrivalAPort: 'IBZ'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--prev',
                            classFlightNormalAreaDate: 'ib-ticket-block__date--old ib-ticket-block__date--white',
                            classFlightXsAreaContainer: 'ib-ticket-block__date--old  ib-ticket-block__date--grey'
                        }
                    }
                ],
                textEnabled: false,
                acceptEnabled: false
            }
            let object311 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '11:45',
                            arrivalTime: '13:00',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            departureCity: 'Madrid',
                            arrivalCity: 'Ibiza',
                            departureAPort: 'MAD',
                            arrivalAPort: 'IBZ'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--prev',
                            classFlightNormalAreaDate: 'ib-ticket-block__date--old ib-ticket-block__date--white',
                            classFlightXsAreaContainer: 'ib-ticket-block__date--old  ib-ticket-block__date--grey'
                        }
                    }
                ],
                textEnabled: false,
                acceptEnabled: false,
                title: ''
            }
            let object318 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '11:45',
                            arrivalTime: '13:00',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            departureCity: 'Madrid',
                            arrivalCity: 'Ibiza',
                            departureAPort: 'MAD',
                            arrivalAPort: 'IBZ'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--prev',
                            classFlightNormalAreaDate: 'ib-ticket-block__date--old ib-ticket-block__date--white',
                            classFlightXsAreaContainer: 'ib-ticket-block__date--old  ib-ticket-block__date--grey'
                        }
                    }
                ],
                textEnabled: false,
                acceptEnabled: false,
                title: '',
                desc: ''
            }
            let object325 = {}
            let object326 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '14:30',
                            arrivalTime: '15:15',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            flightDuration: '45min.',
                            departureCity: 'Ibiza',
                            arrivalCity: 'Palma de Mallorca',
                            departureAPort: 'IBZ',
                            arrivalAPort: 'PMI'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: '',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--summary',
                            classFlightNormalAreaDate: 'ib-ticket-block__date',
                            classFlightXsAreaContainer: ''
                        }
                    }
                ]
            }
            let object333 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '14:30',
                            arrivalTime: '15:15',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            flightDuration: '45min.',
                            departureCity: 'Ibiza',
                            arrivalCity: 'Palma de Mallorca',
                            departureAPort: 'IBZ',
                            arrivalAPort: 'PMI'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: '',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--summary',
                            classFlightNormalAreaDate: 'ib-ticket-block__date',
                            classFlightXsAreaContainer: ''
                        }
                    }
                ],
                textEnabled: true
            }
            let object340 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '14:30',
                            arrivalTime: '15:15',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            flightDuration: '45min.',
                            departureCity: 'Ibiza',
                            arrivalCity: 'Palma de Mallorca',
                            departureAPort: 'IBZ',
                            arrivalAPort: 'PMI'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: '',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--summary',
                            classFlightNormalAreaDate: 'ib-ticket-block__date',
                            classFlightXsAreaContainer: ''
                        }
                    }
                ],
                textEnabled: true,
                acceptEnabled: false
            }
            let object347 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '14:30',
                            arrivalTime: '15:15',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            flightDuration: '45min.',
                            departureCity: 'Ibiza',
                            arrivalCity: 'Palma de Mallorca',
                            departureAPort: 'IBZ',
                            arrivalAPort: 'PMI'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: '',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--summary',
                            classFlightNormalAreaDate: 'ib-ticket-block__date',
                            classFlightXsAreaContainer: ''
                        }
                    }
                ],
                textEnabled: true,
                acceptEnabled: false,
                title: 'MMB_DISRUPTION_LABEL_REMEMBER'
            }
            let object354 = {
                list: [
                    {
                        flightNodes: [
                            {}
                        ],
                        flightData: {
                            icon: '/aerolineas/logo_pos_IB.svg',
                            departureTime: '14:30',
                            arrivalTime: '15:15',
                            departureDate: '18/07/2020',
                            arrivalDate: '18/07/2020',
                            flightScales: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                            flightScalesNumber: 0,
                            flightDuration: '45min.',
                            departureCity: 'Ibiza',
                            arrivalCity: 'Palma de Mallorca',
                            departureAPort: 'IBZ',
                            arrivalAPort: 'PMI'
                        },
                        activationFlags: {
                            previousDate: false,
                            currentDate: true,
                            moreDetailsArea: true,
                            nodeDetails: true,
                            fareDetails: true,
                            warningIcon: true
                        },
                        fareData: [],
                        labels: {
                            FLIGHT_INFO_MESSAGE: '',
                            FLIGHT_DETAIL_COLLAPSE: 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                            FLIGHT_DETAILS: 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                        },
                        cssClass: {
                            classFlightNormalAreaContainer: 'ib-ticket-block__flight-info--summary',
                            classFlightNormalAreaDate: 'ib-ticket-block__date',
                            classFlightXsAreaContainer: ''
                        }
                    }
                ],
                textEnabled: true,
                acceptEnabled: false,
                title: 'MMB_DISRUPTION_LABEL_REMEMBER',
                desc: 'MMB_DISRUPTION_LABEL_ACCEPT_WARNING'
            }
            let object361 = {
                reacomList: {
                    list: [
                        {
                            flight: {},
                            segments: [{
                                cabin:{
                                    bookingClass:''
                                },
                                flight: {
                                    aircraft: { description: 'DESC' },
                                    marketingCarrier: {
                                        code: 'IB'
                                    },
                                    operationalCarrier: {
                                        code: 'IB'
                                    }
                                },
                                departureDateTime: '2020-07-18 11:45',
                                arrivalDateTime: '2020-07-18 13:00',
                                departure: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },
                                arrival: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },arrivalCity:{

                                },
                                status:{
                                    code:'UN'
                                }
                            }],
                            originalDisruptionSliceInformation: {
                                departureDateTime: '2020-07-18 11:45',
                                arrivalDateTime: '2020-07-18 13:00'
                            },
                            departureDateTime: '2020-07-18 11:45',
                            arrivalDateTime: '2020-07-18 13:00',
                            indexTotal:0,
                            numSlicesTotal:1
                        },
                        {
                            flight: {},
                            segments: [{
                                flight: {
                                    aircraft: { description: 'DESC' },
                                    marketingCarrier: {
                                        code: 'I2'
                                    },
                                    operationalCarrier: {
                                        code: 'I2'
                                    }
                                },
                                originalDisruptionSliceInformation: {
                                    departureDateTime: '2020-07-18 11:45',
                                    arrivalDateTime: '2020-07-18 13:00'
                                },
                                departureDateTime: '2020-07-18 11:45',
                                arrivalDateTime: '2020-07-18 13:00',
                                departure: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },
                                arrival: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },
                                arrivalCity:{

                                },
                                status:{
                                    code:''
                                }
                            }],
                            departureDateTime: '2020-07-18 11:45',
                            arrivalDateTime: '2020-07-18 13:00',
                            indexTotal:0,
                            numSlicesTotal:1
                        }
                    ],
                    code: 'UN'
                },
                canceledList: {
                    list: [
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
                            segments: [{
                                flight: {
                                    aircraft: { description: 'DESC' },
                                    marketingCarrier: {
                                        code: 'IB'
                                    },
                                    operationalCarrier: {
                                        code: 'IB'
                                    }
                                },
                                departureDateTime: '2020-07-18 11:45',
                                arrivalDateTime: '2020-07-18 13:00',
                                departure: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },
                                arrival: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },arrivalCity:{

                                },
                                status:{
                                    code:''
                                }
                            }],
                            overnight: false,
                            passengerFlags: [
                                null
                            ],
                            isCancel: true
                        }
                    ],
                    code: 'UN'
                },
                confirmedList: {
                    list: [
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
                            segments: [{
                                flight: {
                                    aircraft: { description: 'DESC' },
                                    marketingCarrier: {
                                        code: 'IB'
                                    },
                                    operationalCarrier: {
                                        code: 'IB'
                                    }
                                },
                                departureDateTime: '2020-07-18 11:45',
                                arrivalDateTime: '2020-07-18 13:00',
                                departure: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },
                                arrival: {
                                    code: 'CODE',
                                    city: { description: 'DESC' }
                                },arrivalCity:{

                                },
                                status:{
                                    code:''
                                }
                            }],
                            overnight: false,
                            passengerFlags: [
                                null
                            ]
                        }
                    ],
                    code: 'HK'
                },
                sheduleList: {
                    list: [
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
                            segments: [{
                                status:{
                                    code:''
                                }
                            }
                            ],
                            overnight: false,
                            passengerFlags: [
                                null
                            ]
                        }
                    ],
                    code: 'TK'
                },
                downgradeList: {
                    list: [
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
                                status:{
                                    code:''
                                }
                               }

                            ],
                            overnight: false,
                            passengerFlags: [
                                null
                            ]
                        }
                    ],
                    code: 'TK'
                },

            }
            let array303 = []
            spy1.withArgs('IB').and.returnValue('/aerolineas/logo_pos_IB.svg');
            spy1.withArgs('I2').and.returnValue('/aerolineas/logo_pos_I2.svg');
            spy2.withArgs(object1, null).and.returnValue(object12);
            spy2.withArgs(object13, null).and.returnValue(object24);
            spy2.withArgs(object25, null).and.returnValue(object36);
            spy2.withArgs(object37, null).and.returnValue(object48);
            spy2.withArgs(object49, null).and.returnValue(object60);
            spy2.withArgs(object61, null).and.returnValue(object72);
            spy2.withArgs(object73, null).and.returnValue(object84);
            spy2.withArgs(object85, null).and.returnValue(object96);
            spy2.withArgs(object97, null).and.returnValue(object108);
            spy2.withArgs(object109, null).and.returnValue(object120);
            spy2.withArgs(object121, null).and.returnValue(object132);
            spy2.withArgs(object133, null).and.returnValue(object144);
            spy1.withArgs('YW').and.returnValue('/aerolineas/logo_pos_YW.svg');
            spy2.withArgs(object145, null).and.returnValue(object156);
            spy2.withArgs(object157, null).and.returnValue(object168);
            spy2.withArgs(object169, null).and.returnValue(object180);
            spy2.withArgs(object181, null).and.returnValue(object192);
            spy2.withArgs(object193, null).and.returnValue(object204);
            spy2.withArgs(object205, null).and.returnValue(object216);
            spy2.withArgs(object217, null).and.returnValue(object228);
            spy2.withArgs(object229, null).and.returnValue(object240);
            spy2.withArgs(object241, null).and.returnValue(object252);
            spy2.withArgs(object253, null).and.returnValue(object264);
            spy2.withArgs(object265, null).and.returnValue(object276);
            spy2.withArgs(object277, null).and.returnValue(object288);
            DisruptionModel.headerCard = object289;
            DisruptionModel.headerCard = object290;
            DisruptionModel.headerCard = object297;
            DisruptionModel.headerCard = object304;
            DisruptionModel.headerCard = object311;
            DisruptionModel.headerCard = object318;
            DisruptionModel.middleCard = object325;
            DisruptionModel.middleCard = object326;
            DisruptionModel.middleCard = object333;
            DisruptionModel.middleCard = object340;
            DisruptionModel.middleCard = object347;
            DisruptionModel.middleCard = object354;
            DisruptionModel.bottomCard = object325;
            DisruptionModel.bottomCard = object326;
            DisruptionModel.bottomCard = object333;
            DisruptionModel.bottomCard = object340;
            DisruptionModel.bottomCard = object347;
            DisruptionModel.bottomCard = object354;


           await  DisruptionDashboardTransformer.transformDisruptionData(object361, 'CANCELATION_CHANGE_NO_REACOM', DisruptionModel, array303)
            expect(DisruptionModel.bottomCard.title).toBe('MMB_DISRUPTION_LABEL_REMEMBER');
            expect(DisruptionModel.bottomCard.desc).toBe('MMB_DISRUPTION_LABEL_ACCEPT_WARNING');
        });
        it('when transformCustomChangeByFlows call should set common title to MMB_DISRUPTION_FLIGHT_HAS_CHANGE_MULTIPLE when type is TYPE_SCHEDULE_TIME and there are multiple header cards', function() {
            // Define la entrada de ejemplo para la función
            var originalBooking = {};
            var disruptionModel = {
              headerCard: {
                list: [{}, {}]
              },
              common: {
                title:''
              }
            };
            var type = DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_TIME;

            // Ejecuta la función con la entrada de ejemplo
            DisruptionDashboardTransformer.transformCustomChangeByFlows(originalBooking, disruptionModel, type);

            // Define el resultado esperado
            var expectedResult = 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE_MULTIPLE';

            // Compara el resultado esperado con el resultado real
            expect(disruptionModel.common.title).toEqual(expectedResult);
          });
    });
});
