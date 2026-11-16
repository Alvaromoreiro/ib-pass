describe('BookingCalendarTransformer', function () {
    var fakeCurrencyService, localStorageService, BookingCalendarTransformer, returnedValue, mockCalendarGridResponse, mockCommercialData;

    mockCalendarGridResponse = {
        'contextMetadata': {
            'language': 'es',
            'country': 'ES'
        },
        'outbound': {
            'slice': {
                'destination': 'ROM',
                'origin': 'MAD'
            },
            'availabilityCalendar': [
                {
                    'date': '2019-10-29',
                    'avios': null
                },
                {
                    'date': '2019-10-30',
                    'avios': null
                },
                {
                    'date': '2019-10-31',
                    'avios': null
                },
                {
                    'date': '2019-11-01',
                    'avios': null
                },
                {
                    'date': '2019-11-02',
                    'avios': null
                },
                {
                    'date': '2019-11-03',
                    'avios': null
                },
                {
                    'date': '2019-11-04',
                    'avios': null
                },
                {
                    'date': '2019-11-05',
                    'avios': null
                },
                {
                    'date': '2019-11-06',
                    'avios': 7500
                },
                {
                    'date': '2019-11-07',
                    'avios': 7500
                },
                {
                    'date': '2019-11-08',
                    'avios': 7500
                },
                {
                    'date': '2019-11-09',
                    'avios': 7500
                },
                {
                    'date': '2019-11-10',
                    'avios': 7500
                },
                {
                    'date': '2019-11-11',
                    'avios': 7500
                },
                {
                    'date': '2019-11-12',
                    'avios': 7500
                },
                {
                    'date': '2019-11-13',
                    'avios': 7500
                },
                {
                    'date': '2019-11-14',
                    'avios': 7500
                },
                {
                    'date': '2019-11-15',
                    'avios': 7500
                },
                {
                    'date': '2019-11-16',
                    'avios': 7500
                },
                {
                    'date': '2019-11-17',
                    'avios': 7500
                },
                {
                    'date': '2019-11-18',
                    'avios': 7500
                },
                {
                    'date': '2019-11-19',
                    'avios': 7500
                },
                {
                    'date': '2019-11-20',
                    'avios': 7500
                },
                {
                    'date': '2019-11-21',
                    'avios': 7500
                },
                {
                    'date': '2019-11-22',
                    'avios': 7500
                },
                {
                    'date': '2019-11-23',
                    'avios': 7500
                },
                {
                    'date': '2019-11-24',
                    'avios': 7500
                },
                {
                    'date': '2019-11-25',
                    'avios': 7500
                },
                {
                    'date': '2019-11-26',
                    'avios': 7500
                },
                {
                    'date': '2019-11-27',
                    'avios': 7500
                },
                {
                    'date': '2019-11-28',
                    'avios': 7500
                },
                {
                    'date': '2019-11-29',
                    'avios': 7500
                },
                {
                    'date': '2019-11-30',
                    'avios': 7500
                },
                {
                    'date': '2019-12-01',
                    'avios': 7500
                },
                {
                    'date': '2019-12-02',
                    'avios': 7500
                },
                {
                    'date': '2019-12-03',
                    'avios': 7500
                },
                {
                    'date': '2019-12-04',
                    'avios': 7500
                },
                {
                    'date': '2019-12-05',
                    'avios': null
                },
                {
                    'date': '2019-12-06',
                    'avios': 12500
                },
                {
                    'date': '2019-12-07',
                    'avios': 7500
                },
                {
                    'date': '2019-12-08',
                    'avios': 8250
                },
                {
                    'date': '2019-12-09',
                    'avios': 7500
                },
                {
                    'date': '2019-12-10',
                    'avios': 7500
                },
                {
                    'date': '2019-12-11',
                    'avios': 7500
                },
                {
                    'date': '2019-12-12',
                    'avios': 7500
                },
                {
                    'date': '2019-12-13',
                    'avios': 7500
                },
                {
                    'date': '2019-12-14',
                    'avios': 8250
                },
                {
                    'date': '2019-12-15',
                    'avios': 8250
                },
                {
                    'date': '2019-12-16',
                    'avios': 8250
                },
                {
                    'date': '2019-12-17',
                    'avios': 8250
                },
                {
                    'date': '2019-12-18',
                    'avios': 8250
                },
                {
                    'date': '2019-12-19',
                    'avios': 8250
                },
                {
                    'date': '2019-12-20',
                    'avios': 8250
                },
                {
                    'date': '2019-12-21',
                    'avios': 8250
                },
                {
                    'date': '2019-12-22',
                    'avios': 8250
                },
                {
                    'date': '2019-12-23',
                    'avios': 8250
                },
                {
                    'date': '2019-12-24',
                    'avios': 8250
                },
                {
                    'date': '2019-12-25',
                    'avios': 7500
                },
                {
                    'date': '2019-12-26',
                    'avios': 7500
                },
                {
                    'date': '2019-12-27',
                    'avios': 12500
                },
                {
                    'date': '2019-12-28',
                    'avios': 8250
                },
                {
                    'date': '2019-12-29',
                    'avios': 8250
                },
                {
                    'date': '2019-12-30',
                    'avios': 8250
                },
                {
                    'date': '2019-12-31',
                    'avios': 8250
                },
                {
                    'date': '2020-01-01',
                    'avios': 7500
                },
                {
                    'date': '2020-01-02',
                    'avios': 7500
                },
                {
                    'date': '2020-01-03',
                    'avios': 7500
                },
                {
                    'date': '2020-01-04',
                    'avios': 7500
                },
                {
                    'date': '2020-01-05',
                    'avios': 7500
                },
                {
                    'date': '2020-01-06',
                    'avios': 7500
                },
                {
                    'date': '2020-01-07',
                    'avios': 7500
                },
                {
                    'date': '2020-01-08',
                    'avios': 7500
                },
                {
                    'date': '2020-01-09',
                    'avios': 7500
                },
                {
                    'date': '2020-01-10',
                    'avios': 7500
                },
                {
                    'date': '2020-01-11',
                    'avios': 7500
                },
                {
                    'date': '2020-01-12',
                    'avios': 7500
                },
                {
                    'date': '2020-01-13',
                    'avios': 7500
                },
                {
                    'date': '2020-01-14',
                    'avios': 7500
                },
                {
                    'date': '2020-01-15',
                    'avios': 7500
                },
                {
                    'date': '2020-01-16',
                    'avios': 7500
                },
                {
                    'date': '2020-01-17',
                    'avios': 7500
                },
                {
                    'date': '2020-01-18',
                    'avios': 7500
                },
                {
                    'date': '2020-01-19',
                    'avios': 7500
                },
                {
                    'date': '2020-01-20',
                    'avios': 7500
                },
                {
                    'date': '2020-01-21',
                    'avios': 7500
                },
                {
                    'date': '2020-01-22',
                    'avios': 7500
                },
                {
                    'date': '2020-01-23',
                    'avios': 7500
                },
                {
                    'date': '2020-01-24',
                    'avios': 7500
                },
                {
                    'date': '2020-01-25',
                    'avios': 7500
                },
                {
                    'date': '2020-01-26',
                    'avios': 7500
                },
                {
                    'date': '2020-01-27',
                    'avios': 7500
                },
                {
                    'date': '2020-01-28',
                    'avios': 7500
                },
                {
                    'date': '2020-01-29',
                    'avios': 7500
                },
                {
                    'date': '2020-01-30',
                    'avios': 7500
                },
                {
                    'date': '2020-01-31',
                    'avios': 7500
                },
                {
                    'date': '2020-02-01',
                    'avios': 7500
                },
                {
                    'date': '2020-02-02',
                    'avios': 7500
                },
                {
                    'date': '2020-02-03',
                    'avios': 7500
                },
                {
                    'date': '2020-02-04',
                    'avios': 7500
                },
                {
                    'date': '2020-02-05',
                    'avios': 7500
                },
                {
                    'date': '2020-02-06',
                    'avios': 7500
                },
                {
                    'date': '2020-02-07',
                    'avios': 7500
                },
                {
                    'date': '2020-02-08',
                    'avios': 7500
                },
                {
                    'date': '2020-02-09',
                    'avios': 7500
                },
                {
                    'date': '2020-02-10',
                    'avios': 7500
                },
                {
                    'date': '2020-02-11',
                    'avios': 7500
                },
                {
                    'date': '2020-02-12',
                    'avios': 7500
                },
                {
                    'date': '2020-02-13',
                    'avios': 7500
                },
                {
                    'date': '2020-02-14',
                    'avios': 7500
                },
                {
                    'date': '2020-02-15',
                    'avios': 7500
                },
                {
                    'date': '2020-02-16',
                    'avios': 7500
                },
                {
                    'date': '2020-02-17',
                    'avios': 7500
                },
                {
                    'date': '2020-02-18',
                    'avios': 7500
                },
                {
                    'date': '2020-02-19',
                    'avios': 7500
                },
                {
                    'date': '2020-02-20',
                    'avios': 7500
                },
                {
                    'date': '2020-02-21',
                    'avios': 7500
                },
                {
                    'date': '2020-02-22',
                    'avios': 7500
                },
                {
                    'date': '2020-02-23',
                    'avios': 7500
                },
                {
                    'date': '2020-02-24',
                    'avios': 7500
                },
                {
                    'date': '2020-02-25',
                    'avios': 7500
                },
                {
                    'date': '2020-02-26',
                    'avios': 7500
                },
                {
                    'date': '2020-02-27',
                    'avios': 7500
                },
                {
                    'date': '2020-02-28',
                    'avios': 7500
                },
                {
                    'date': '2020-02-29',
                    'avios': 7500
                },
                {
                    'date': '2020-03-01',
                    'avios': 7500
                },
                {
                    'date': '2020-03-02',
                    'avios': 7500
                },
                {
                    'date': '2020-03-03',
                    'avios': 7500
                },
                {
                    'date': '2020-03-04',
                    'avios': 7500
                },
                {
                    'date': '2020-03-05',
                    'avios': 7500
                },
                {
                    'date': '2020-03-06',
                    'avios': 7500
                },
                {
                    'date': '2020-03-07',
                    'avios': 7500
                },
                {
                    'date': '2020-03-08',
                    'avios': 7500
                },
                {
                    'date': '2020-03-09',
                    'avios': 7500
                },
                {
                    'date': '2020-03-10',
                    'avios': 7500
                },
                {
                    'date': '2020-03-11',
                    'avios': 7500
                },
                {
                    'date': '2020-03-12',
                    'avios': 7500
                },
                {
                    'date': '2020-03-13',
                    'avios': 7500
                },
                {
                    'date': '2020-03-14',
                    'avios': 7500
                },
                {
                    'date': '2020-03-15',
                    'avios': 7500
                },
                {
                    'date': '2020-03-16',
                    'avios': 7500
                },
                {
                    'date': '2020-03-17',
                    'avios': 7500
                },
                {
                    'date': '2020-03-18',
                    'avios': 7500
                },
                {
                    'date': '2020-03-19',
                    'avios': 7500
                },
                {
                    'date': '2020-03-20',
                    'avios': 7500
                },
                {
                    'date': '2020-03-21',
                    'avios': 7500
                },
                {
                    'date': '2020-03-22',
                    'avios': 7500
                },
                {
                    'date': '2020-03-23',
                    'avios': 7500
                },
                {
                    'date': '2020-03-24',
                    'avios': 7500
                },
                {
                    'date': '2020-03-25',
                    'avios': 7500
                },
                {
                    'date': '2020-03-26',
                    'avios': 7500
                },
                {
                    'date': '2020-03-27',
                    'avios': 7500
                },
                {
                    'date': '2020-03-28',
                    'avios': 7500
                },
                {
                    'date': '2020-03-29',
                    'avios': 7500
                },
                {
                    'date': '2020-03-30',
                    'avios': 7500
                },
                {
                    'date': '2020-03-31',
                    'avios': 7500
                }
            ]
        },
        'inbound': null
    }
    mockCommercialData = {
        'currency': {
            'code': 'EUR',
            'description': 'Euro',
            'symbol': '€',
            'alignment': 'R',
            'groupingSeparator': '.',
            'decimalSeparator': ',',
            'decimals': 2,
            'recommendedDisplay': 'symbol'
        },
        'languages': [
            {
                'dateFormat': {
                    'long': '\'d\' / \'MMMM\' / \'yyyy\'',
                    'medium': 'dd/MM/yyyy',
                    'short': 'dd/MM/yy'
                },
                'code': 'ca',
                'description': 'Català'
            },
            {
                'dateFormat': {
                    'long': 'MMMM d, yyyy',
                    'medium': 'MMM d, yyyy',
                    'short': 'M/d/yy'
                },
                'code': 'en',
                'description': 'English'
            },
            {
                'dateFormat': {
                    'long': '\'\'d\' de \'MMMM\' de \'yyyy\'\'',
                    'medium': 'dd-MMM-yyyy',
                    'short': 'd/MM/yy'
                },
                'code': 'es',
                'description': 'Español'
            }
        ],
        'market': {
            'code': 'ES',
            'description': 'España'
        },
        'sessionTimeLifeInMinutes': 15,
        'maxSearchTime': 330,
        'minSearchTime': 0,
        'passengerTypes': [
            {
                'passengerType': 'ADULT',
                'description': 'Adulto'
            },
            {
                'passengerType': 'INFANT',
                'description': 'Bebé'
            },
            {
                'passengerType': 'YOUTH',
                'description': 'Joven'
            },
            {
                'passengerType': 'CHILD',
                'description': 'Niño'
            },
            {
                'passengerType': 'SENIOR',
                'description': 'Tercera edad'
            }
        ],
        'discounts': [
            {
                'code': 'GENERAL',
                'description': 'General',
                'countries': [
                    'ES'
                ],
                'cities': [

                ],
                'relatedField': 'GENERAL',
                'type': 'LGF'
            },
            {
                'code': 'SPECIAL',
                'description': 'Especial',
                'countries': [
                    'ES'
                ],
                'cities': [

                ],
                'relatedField': 'SPECIAL',
                'type': 'LGF'
            },
            {
                'code': 'CEUTA',
                'description': 'Soy residente en Ceuta',
                'countries': [
                    'ES'
                ],
                'cities': [
                    {
                        'code': 'AGP',
                        'description': 'Málaga',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 1,
                        'latitude': 36.666666,
                        'longitude': -4.5
                    },
                    {
                        'code': 'SVQ',
                        'description': 'Sevilla',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 1,
                        'latitude': 37.433333,
                        'longitude': -5.9
                    },
                    {
                        'code': 'XRY',
                        'description': 'Jerez de la Frontera',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 1,
                        'latitude': 36.75,
                        'longitude': -6.066666
                    }
                ],
                'relatedField': 'ceutaResident',
                'type': 'RES'
            },
            {
                'code': 'BALEARES',
                'description': 'Soy residente en las Islas Baleares',
                'countries': [
                    'ES'
                ],
                'cities': [
                    {
                        'code': 'IBZ',
                        'description': 'Ibiza',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 5,
                        'latitude': 38.866666,
                        'longitude': 1.366666
                    },
                    {
                        'code': 'MAH',
                        'description': 'Menorca',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 5,
                        'latitude': 39.866666,
                        'longitude': 4.216666
                    },
                    {
                        'code': 'PMI',
                        'description': 'Palma de Mallorca',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 6,
                        'latitude': 39.55,
                        'longitude': 2.733333
                    }
                ],
                'relatedField': 'balearicIslandsResident',
                'type': 'RES'
            },
            {
                'code': 'CANARIAS',
                'description': 'Soy residente en las Islas Canarias',
                'countries': [
                    'ES'
                ],
                'cities': [
                    {
                        'code': 'ACE',
                        'description': 'Lanzarote',
                        'countryCode': 'ES',
                        'timezone': 'Atlantic/Canary',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 10,
                        'latitude': 28.95,
                        'longitude': -13.6
                    },
                    {
                        'code': 'FUE',
                        'description': 'Fuerteventura',
                        'countryCode': 'ES',
                        'timezone': 'Atlantic/Canary',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 10,
                        'latitude': 28.45,
                        'longitude': -13.866666
                    },
                    {
                        'code': 'GMZ',
                        'description': 'San Sebastián de la Gomera',
                        'countryCode': 'ES',
                        'timezone': 'Atlantic/Canary',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 12,
                        'latitude': 28.0937998,
                        'longitude': -17.1098582
                    },
                    {
                        'code': 'LPA',
                        'description': 'Gran Canaria Las Palmas',
                        'countryCode': 'ES',
                        'timezone': 'Atlantic/Canary',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 12,
                        'latitude': 27.933333,
                        'longitude': -15.383333
                    },
                    {
                        'code': 'SPC',
                        'description': 'Santa Cruz de La Palma',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 10,
                        'latitude': 28.683333,
                        'longitude': -17.75
                    },
                    {
                        'code': 'TCI',
                        'description': 'Tenerife',
                        'countryCode': 'ES',
                        'timezone': 'Atlantic/Canary',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 11,
                        'latitude': 28.316666,
                        'longitude': -16.566666
                    },
                    {
                        'code': 'VDE',
                        'description': 'Valverde',
                        'countryCode': 'ES',
                        'timezone': 'Atlantic/Canary',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 12,
                        'latitude': 27.793241,
                        'longitude': -17.9413323
                    }
                ],
                'relatedField': 'canaryIslandsResident',
                'type': 'RES'
            },
            {
                'code': 'MELILLA',
                'description': 'Soy residente en Melilla',
                'countries': [
                    'ES'
                ],
                'cities': [
                    {
                        'code': 'MLN',
                        'description': 'Melilla',
                        'countryCode': 'ES',
                        'timezone': 'Europe/Madrid',
                        'gaCode': 6,
                        'arCode': 1,
                        'saCode': 2,
                        'latitude': 35.283333,
                        'longitude': -2.95
                    }
                ],
                'relatedField': 'melillaResident',
                'type': 'RES'
            }
        ],
        'defaultValues': {
            'defaultPaxType': 'ADULT',
            'defaultPaxTypeNumbers': [
                {
                    'passengerType': 'ADULT',
                    'number': 1
                },
                {
                    'passengerType': 'CHILD',
                    'number': 0
                },
                {
                    'passengerType': 'INFANT',
                    'number': 0
                },
                {
                    'passengerType': 'SENIOR',
                    'number': 0
                },
                {
                    'passengerType': 'YOUTH',
                    'number': 0
                }
            ],
            'maxPaxNumber': 9,
            'defaultPhonePrefix': {
                'code': '34',
                'description': 'España / +34',
                'countryCode': 'ES'
            }
        },
        'roundingPolicy': 'HALF_ROUND_DOWN',
        'availabilityPriceShowPolicy': 'ADULT_PRICE_WITH_TAXES_AND_EMISSION',
        'mainCities': {
            'normal': {
                'code': 'MAD',
                'description': 'Madrid',
                'timezone': 'Europe/Madrid',
                'country': {
                    'code': 'ES',
                    'description': 'España'
                }
            },
            'redemption': {
                'code': 'MAD',
                'description': 'Madrid',
                'timezone': 'Europe/Madrid',
                'country': {
                    'code': 'ES',
                    'description': 'España'
                }
            }
        }
    };

    fakeCurrencyService = { 'formatAvios': jasmine.createSpy() }

    beforeEach(function () {

        angular.mock.module('ib-booking-calendar-module', 'LocalStorageModule', 'ib-commons-utils-module', function ($provide) {
            $provide.value('CurrencyService', fakeCurrencyService);
        });

        inject(function (_BookingCalendarTransformer_, _localStorageService_) {
            localStorageService = _localStorageService_;
            localStorageService.set('availabilityRequestData', { 'slices': [{ 'origin': 'MAD', 'destination': 'ROM', 'date': '2018-12-26' }, { 'origin': 'ROM', 'destination': 'MAD', 'date': '2018-12-29' }], 'passengers': [{ 'passengerType': 'ADULT', 'count': 1 }], 'marketCode': 'ES', 'preferredCabin': 'ECONOMY' });
            localStorageService.set('commercialData', mockCommercialData);

            BookingCalendarTransformer = _BookingCalendarTransformer_;
            fakeCurrencyService.formatAvios = jasmine.createSpy('formatAvios').and.callFake(function () {
                return '12.000';
            });
        });
    });

    describe('When the user clicks on the monthly view button, and the controller needs to initialize the model', function () {
        it('and the service returns all the data to the transformer', function (done) {
            returnedValue = BookingCalendarTransformer.getRedemptionCalendarModel(mockCalendarGridResponse, 0);
            expect(returnedValue.slice).toEqual({'destination': 'ROM','origin': 'MAD'});
            expect(returnedValue.sliderModel.length).toEqual(6);
            expect(returnedValue.dates.length).toEqual(6);

            done();
        });
    })


});
