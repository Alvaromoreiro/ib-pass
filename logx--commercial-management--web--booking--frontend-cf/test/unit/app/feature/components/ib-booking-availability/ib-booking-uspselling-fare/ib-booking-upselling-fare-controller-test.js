import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants";
import { IbBookingUpsellingUtilsServiceMock } from "../../ib-booking-sliced-upselling-fare/mocks/ib-booking-sliced-upselling-fare-class.mocks";
import { fakeAsync, flush, flushMicrotasks } from "@angular/core/testing";

describe('BookingUpsellingFareController Test', function () {
    var scope, controller, timeout, localStorageService, rootScope, fakeDocument;

    var fakeCurrencyService = {
        'getCurrenciesAsMap': jasmine.createSpy(),
        'formatPrice': jasmine.createSpy().and.callFake(function () {
            return '172,32 €'
        }),
        'getCurrencyObject': jasmine.createSpy().and.callFake(function () {
            return { alignment: 'R', code: 'EUR', decimalSeparator: ',', decimals: 2, description: 'Euro', groupingSeparator: '.',
                recommendedDisplay: 'symbol', symbol: '€' }
        }),
        'getPriceByRoundingPolicy': jasmine.createSpy().and.callFake(function () {
            return 17;
        })
    };
    var mockCommercialData = {
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
                    'long': 'd\' / \'MMMM\' / \'yyyy',
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
                    'long': 'd\' de \'MMMM\' de \'yyyy',
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
        'marketFlags': {
            'allowedNameCorrection': true,
            'allowedAncillaries': true,
            'allowedFlightChange': true,
            'allowedRefund': true,
            'allowedCashAndAviosWithVoucher': true
        },
        'sessionTimeLifeInMinutes': 15,
        'maxSearchTime': 361,
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
                'cities': [],
                'relatedField': 'GENERAL',
                'type': 'LGF'
            },
            {
                'code': 'SPECIAL',
                'description': 'Especial',
                'countries': [
                    'ES'
                ],
                'cities': [],
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
    var mockSelectedTripData = [{
        info:{
            selectedFareFamily:{priority:2, commercialNameES: 'optima'},
            cabins:[{
                fareFamilies:[{priority:1, commercialNameES: 'optima'}]
            }],
            allOperatedBy: ['IBERIA','LEVEL','AIR NOSTRUM', 'IBERIA EXPRESS'],
            showedCabin:0
        },
        originCountry:'ES',
        destinationCountry:'ES',
    }];


    var fakeConstanst= {
        FARE_CABIN_TYPE:{
            TURIST: 'E',
            BUSINESS_CLASS: 'B',
            TURIST_PREMIUM:'N',
            TURIST_PREMIUM_T:'T',
        },
        FARE_COMERCIAL_NAME_ES:{
            BASICA: 'basica',
            BASICA_LEVEL: 'basica-level',
            OPTIMA: 'optima',
            CONFORT: 'confort',
            FLEXIBLE: 'flexible',
            OPTIMA_FLEXIBLE: 'optima-flex',
            TURISTA_PREMIUM_PROMOCIONAL: 'turista-premium-promocional',
            TURISTA_PREMIUM_OPTIMA: 'turista-premium-optima',
            TURISTA_PREMIUM_OPTIMA_FLEX: 'turista-premium-optima-flex',
            TURISTA_PREMIUM_FLEXIBLE: 'turista-premium-flexible',
            TURISTA_PREMIUM_PROMOCIONAL_FLEX: 'turista-premium-promocional-flex',
            BUSINESS_PROMOCIONAL: 'business-promocional',
            //BUSINESS_FLEXIBLE: 'business-flexible',
            TURISTA_PREMIUM_OPTIMA_FLEXIBLE: 'turista-premium-flexible',
            BUSINESS_OPTIMA: 'business-optima',
            BUSINESS_CONFORT: 'business-confort',
            BUSINESS_FLEXIBLE: 'business-flexible',
            BUSINESS_PROMOCIONAL_FLEX: 'business-promocional-flex'
        },
        UPSELLING: {
            FARE: {
                OPTIMA: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951060.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_OPTIMAL_1',
                        subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_OPTIMAL_1'
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/3336200.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_OPTIMAL_2',
                        subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_OPTIMAL_2'
                    }
                ],
                CONFORT: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951062.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_CONFORT_1',
                        subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_CONFORT_1'
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
                        subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_CONFORT_2'
                    }
                ],
                BU_CONFORT: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951061.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951065.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_2',
                        subdescription: ''
                    },
                    {
                        icon1: '/iberia-web-content/iconos/upselling/1951064.png',
                        icon2: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                        subdescription: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_4'
                    }
                ],
                BU_CONFORT_LATAM: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951065.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_1',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_2',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951064.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_3',
                        subdescription: ''
                    }
                ],
                BU_FLEX: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951064.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_1',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_2',
                        subdescription: ''
                    }
                ],
                ECONOMY_OPTIMA_FLEX_ES: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951061.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                        subdescription: ''
                    },
                    {
                        icon1: '/iberia-web-content/iconos/upselling/1951064.png',
                        icon2: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                        subdescription: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_4'
                    }
                ],
                ECONOMY_OPTIMA_FLEX: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951064.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_3',
                        subdescription: ''
                    }
                ],
                PREMIUM_ECONOMY_FLEXIBLE: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951061.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951064.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                        subdescription: ''
                    }
                ],
                ECONOMY_FLEXIBLE: [
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951064.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_1',
                        subdescription: ''
                    },
                    {
                        icon: '/iberia-web-content/iconos/upselling/1951063.png',
                        description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_2',
                        subdescription: ''
                    }
                ]
            },
            AVAILABLE_FARES: ['optima', 'confort', 'optima-flexible', 'flexible', 'turista-premium-optima', 'turista-premium-optima-flex', 'turista-premium-flexible', 'business-confort', 'business-flexible']
        }
    };
    let fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            case'EliminateAccentFilter':
                filterFunc = (variable) =>{
                    return variable;
                }
            default:
                break;
        }

        return filterFunc;
    });
    let fakeIbBookingUpsellingUtilsService;
    beforeEach(function () {
        fakeIbBookingUpsellingUtilsService = new IbBookingUpsellingUtilsServiceMock();
        angular.mock.module('ib-booking-upselling-fare-module', 'LocalStorageModule', 'ib-commons-filters-module', function ($provide) {
            $provide.value('BookingAppConstants', fakeConstanst);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('$filter', fakeFilter);
            $provide.value('IbBookingUpsellingUtilsService', fakeIbBookingUpsellingUtilsService);
        });

        inject(function ($controller, $rootScope, $timeout, _localStorageService_, $document) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
            timeout = $timeout;
            fakeDocument = $document;
            localStorageService = _localStorageService_;
            // translateFilter = $filter('translate', {});

            controller = $controller('BookingUpsellingFareController', {
                '$scope': scope,
                '$rootScope': rootScope,
                '$document': fakeDocument,
            });

            scope.$digest();
        });

    });

    describe('When activate is called', function() {
        beforeEach(()=>{
            controller.selectedInfo = mockSelectedTripData;
            localStorageService.set('commercialData', mockCommercialData);
            localStorageService.set('destinationAreasCitiesList',[{cities:[{country:{code:'ES'}}]}]);
            rootScope.routes = {
                    images: '/iberia-web-content/imagenes'
                }
            }
        )
        it('and have data in localstorage and it is optima fare', fakeAsync(() => {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'optima';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA,
                mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3: null,
                imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        }));

        it('and have data in localstorage and it is basica fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'basica';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA,
                mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3: null,
                imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        }));
        it('and have data in localstorage and it is confort fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'confort';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA,
                mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3: null,
                imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        }));
        it('and have data in localstorage and it is optima-flex fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'optima-flex';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA,
                mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3: null,
                imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        }));
        it('and have data in localstorage and it is basica-level fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'basica-level';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA,
                mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3: null,
                imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        }));
        it('and have data in localstorage and it is turista-premium-optima fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'turista-premium-optima';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.ECONOMY_OPTIMA_FLEX_ES,
                mark1 : 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2 : 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3 : null,
                imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/premium_economy_optima_flex.png'
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/premium_economy_optima_flex.png')
        }));
        it('and have data in localstorage and it is turista-premium-optima-flex fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'turista-premium-optima-flex';
            controller.selectedInfo[0].originCountry = 'ES';
            controller.selectedInfo[0].destinationCountry = 'ES';
            controller.selectedInfo = mockSelectedTripData;
            localStorageService.set('destinationAreasCitiesList',[{cities:[{country:{code:'ES'}}]}]);
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.ECONOMY_FLEXIBLE,
                mark1 : 'UPSELLING_FARE_MARK_CHOOSE',
                mark2 : 'UPSELLING_FARE_MARK_CHOOSE_2',
                mark3 : null,
                imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/premium_economy_flexible.png'
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/premium_economy_flexible.png')
        }));
        it('and have data in localstorage and it is business-optima fare', fakeAsync(function() {
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'business-optima';
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/business_confort.png')
        }));
        it('and have data in localstorage, it is business-optima fare and originZone and destinationZone is EU', fakeAsync(function() {
            localStorageService.set('destinationAreasCitiesList',[{cities:[{country:{code:'ES'}}]},{cities:[{country:{code:'EU'}}]}]);
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'business-optima';
            controller.selectedInfo[0].originCountry = 'EU';
            controller.selectedInfo[0].destinationCountry = 'EU';
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/business_confort.png')
            expect(controller.fareExtrasToShow).toEqual([
                {
                    icon: '/iberia-web-content/iconos/upselling/1951061.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951065.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_2',
                    subdescription: ''
                },
                {
                    icon1: '/iberia-web-content/iconos/upselling/1951064.png',
                    icon2: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                    subdescription: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_4'
                }
            ])
        }));
        it('and have data in localstorage, it is business-optima fare and originZone is LATAM', fakeAsync (function() {
            localStorageService.set('destinationAreasCitiesList',[{cities:[{country:{code:'ES'}}]},{cities:[{country:{code:'EU'}}]},{cities:[{country:{code:'LATAM'}}]}]);
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'business-optima';
            controller.selectedInfo[0].originCountry = 'LATAM';
            controller.selectedInfo[0].destinationCountry = 'EU';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.BU_CONFORT,
                mark1: 'UPSELLING_FARE_MARK_CHOOSE_3',
                mark2: 'UPSELLING_FARE_MARK_CHOOSE_2',
                mark3: null,
                imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/business_confort.png'
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/business_confort.png')
            // expect(controller.fareExtrasToShow).toEqual(fakeConstanst.UPSELLING.FARE.BU_CONFORT_LATAM)
        }));
        it('and have data in localstorage, it is business-optima fare and originZone is ES and destinationZone is ES', fakeAsync(function() {
            localStorageService.set('destinationAreasCitiesList',[{cities:[{country:{code:'ES'}}]},{cities:[{country:{code:'EU'}}]}]);
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'business-optima';
            controller.selectedInfo[0].originCountry = 'ES';
            controller.selectedInfo[0].destinationCountry = 'ES';
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/business_confort.png')
            // expect(controller.fareExtrasToShow).toEqual(fakeConstanst.UPSELLING.FARE.BU_CONFORT)
        }));
        it('and have data in localstorage, it is business-optima fare and originZone is EU and destinationZone is LATAM', fakeAsync (function () {
            localStorageService.set('destinationAreasCitiesList', [{ cities: [{ country: { code: 'ES' } }] }, { cities: [{ country: { code: 'EU' } }] }, { cities: [{ country: { code: 'LATAM' } }] }]);
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'business-optima';
            controller.selectedInfo[0].originCountry = 'EU';
            controller.selectedInfo[0].destinationCountry = 'LATAM';
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.BU_CONFORT,
                mark1: 'UPSELLING_FARE_MARK_CHOOSE_3',
                mark2: 'UPSELLING_FARE_MARK_CHOOSE_2',
                mark3: null,
                imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/business_confort.png'
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/business_confort.png')
            // expect(controller.fareExtrasToShow).toEqual(fakeConstanst.UPSELLING.FARE.BU_CONFORT_LATAM);
        }));
        it('and have data in localstorage and it is business-confort fare', fakeAsync (function() {
            controller.selectedInfo[0].originCountry = 'ES';
            controller.selectedInfo[0].destinationCountry = 'ES';
            mockSelectedTripData[0].info.selectedFareFamily.commercialNameES = 'business-confort',
            controller.selectedInfo = mockSelectedTripData;
            localStorageService.set('destinationAreasCitiesList', [{ cities: [{ country: { code: 'ES' } }] }]);
            let model = {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.BU_FLEX,
                mark1: 'UPSELLING_FARE_MARK_CHOOSE',
                mark2: 'UPSELLING_FARE_MARK_CHOOSE_2',
                mark3: null,
                imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/business_flexible.png'
            };
            fakeIbBookingUpsellingUtilsService.getInfoToShow = jasmine.createSpy('getInfoToShow').and.callFake(() => model);
            controller.$onInit();
            flushMicrotasks();
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/business_flexible.png')
        }));
    });
    xdescribe('When changeUpsellingFare is called', function() {
        beforeEach(()=>{

        })
        it('', function() {
            spyOn(scope,"$emit");
            scope.$emit('changeUpsellingFare',mockSelectedTripData)
            expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        });
    });
    xdescribe('When changeUpsellingFare is called', function() {
        beforeEach(()=>{
            controller.nextUpsellFareCollection = [{}];
            controller.selectedInfo = [{info:{selectedFareFamily:'basica'}}];
            rootScope.ancOffers = {}
        })
        it('', function() {
            // const referenceElement = jasmine.createSpyObj('referenceElement', ['offset']);
            // referenceElement.offset.and.returnValue({ top: 100 });
            spyOn(fakeDocument,"find")
            fakeDocument.find.and.returnValue({offset :()=>{
                { top: 100 }
            }});
            const stickyElement = jasmine.createSpyObj('stickyElement', ['innerHeight']);
            stickyElement.innerHeight.and.returnValue(20);
            controller.selectUpsellFare();
            timeout.flush();
            expect(angular.element('html, body')).toHaveBeenCalled();
            // expect(controller.imgToshow).toEqual('/iberia-web-content/imagenes/banners/upselling/economy_flexible.png')
        });
    });
});



