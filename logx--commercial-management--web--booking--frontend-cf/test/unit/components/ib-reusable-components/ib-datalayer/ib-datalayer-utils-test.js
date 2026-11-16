import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
describe('DatalayerUtilsService Test', () => {
    let DatalayerUtilsService, testWindow;

    const fakeDataLayerService = {
        initDatalayer: jasmine.createSpy('initDatalayer').and.callFake(angular.noop),
        addDataLayerGeneralInfo: jasmine.createSpy('addDataLayerGeneralInfo').and.callFake(angular.noop),
        callUpdateTagManager: jasmine.createSpy('callUpdateTagManager').and.callFake(angular.noop),
        removeDatalayerGeneralInfo: jasmine.createSpy('removeDatalayerGeneralInfo').and.callFake(angular.noop),
        isDatalayerInit: jasmine.createSpy('isDatalayerInit'),
        getDatalayerGeneral: angular.noop,
        getEcommerceDatalayer: angular.noop
    };

    const mockBookingAppConstants = {
        FLOW_APP: {
            PAOB: 'PAOB',
            PARE: 'PARE'
        }
    };

    const fake2Slices = [
        {
            sliceId: '1MADBCN',
            departureDateTime: null,
            arrivalDateTime: null,
            duration: null,
            stopsNumber: 0,
            price: {
                fare: 165,
                tax: 21.46,
                total: 186.46,
                currency: 'EUR',
                ticketingFee: 0
            },
            detailedPrices: [
                {
                    fare: 165,
                    tax: 21.46,
                    total: 186.46,
                    currency: 'EUR',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    segmentPrices: null,
                    ticketingFee: 0
                }
            ],
            segments: [
                {
                    departure: {
                        code: 'MAD',
                        name: 'Madrid Adolfo Suarez-Barajas',
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
                    arrival: {
                        code: 'BCN',
                        name: 'Barcelona',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: 'OPEN',
                        operationalFlightNumber: 'OPEN',
                        operationalDisclosure: 'IB',
                        aircraft: null
                    },
                    cabin: {
                        rbd: 'Y',
                        bookingCode: null,
                        bookingClass: 'TOURIST',
                        remainingSeats: 0,
                        fareFamily: 'YPA',
                        fareBasis: 'YDRT',
                        seatDisplays: null,
                        extendedFareCode: '',
                        cabinDescription: 'Turista'
                    },
                    overnight: false,
                    id: 'GOIIDvWVnCe9Mjns',
                    duration: null,
                    waitingTime: 0,
                    providerId: '',
                    ticketDesignator: '',
                    accrualQuote: null,
                    delayInformation: null,
                    stop: null,
                    departureDateTime: null,
                    arrivalDateTime: null
                }
            ],
            overnight: false
        },
        {
            sliceId: '2BCNMAD',
            departureDateTime: null,
            arrivalDateTime: null,
            duration: null,
            stopsNumber: 0,
            price: {
                fare: 255,
                tax: 20.33,
                total: 275.33,
                currency: 'EUR',
                ticketingFee: 0
            },
            detailedPrices: [
                {
                    fare: 255,
                    tax: 20.33,
                    total: 275.33,
                    currency: 'EUR',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    segmentPrices: null,
                    ticketingFee: 0
                }
            ],
            segments: [
                {
                    departure: {
                        code: 'BCN',
                        name: 'Barcelona',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    arrival: {
                        code: 'MAD',
                        name: 'Madrid Adolfo Suarez-Barajas',
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
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: 'OPEN',
                        operationalFlightNumber: 'OPEN',
                        operationalDisclosure: 'IB',
                        aircraft: null
                    },
                    cabin: {
                        rbd: 'J',
                        bookingCode: null,
                        bookingClass: 'BUSINESS',
                        remainingSeats: 0,
                        fareFamily: 'BPA',
                        fareBasis: 'JDRT',
                        seatDisplays: null,
                        extendedFareCode: '',
                        cabinDescription: 'Business'
                    },
                    overnight: false,
                    id: 'GspV-ypAJpvSoxdM',
                    duration: null,
                    waitingTime: 0,
                    providerId: '',
                    ticketDesignator: '',
                    accrualQuote: null,
                    delayInformation: null,
                    stop: null,
                    departureDateTime: null,
                    arrivalDateTime: null
                }
            ],
            overnight: false
        }
    ];

    const fake1Slice = [
        {
            sliceId: '2BCNMAD',
            departureDateTime: null,
            arrivalDateTime: null,
            duration: null,
            stopsNumber: 0,
            price: {
                fare: 255,
                tax: 20.33,
                total: 275.33,
                currency: 'EUR',
                ticketingFee: 0
            },
            detailedPrices: [
                {
                    fare: 255,
                    tax: 20.33,
                    total: 275.33,
                    currency: 'EUR',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    segmentPrices: null,
                    ticketingFee: 0
                }
            ],
            segments: [
                {
                    departure: {
                        code: 'BCN',
                        name: 'Barcelona',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    arrival: {
                        code: 'MAD',
                        name: 'Madrid Adolfo Suarez-Barajas',
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
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: 'OPEN',
                        operationalFlightNumber: 'OPEN',
                        operationalDisclosure: 'IB',
                        aircraft: null
                    },
                    cabin: {
                        rbd: 'J',
                        bookingCode: null,
                        bookingClass: 'BUSINESS',
                        remainingSeats: 0,
                        fareFamily: 'BPA',
                        fareBasis: 'JDRT',
                        seatDisplays: null,
                        extendedFareCode: '',
                        cabinDescription: 'Business'
                    },
                    overnight: false,
                    id: 'GspV-ypAJpvSoxdM',
                    duration: null,
                    waitingTime: 0,
                    providerId: '',
                    ticketDesignator: '',
                    accrualQuote: null,
                    delayInformation: null,
                    stop: null,
                    departureDateTime: null,
                    arrivalDateTime: null
                }
            ],
            overnight: false
        }
    ];

    const fakeFareData = {
        responseId: 'Qm9va2luZ0BHVy0xNTcwNDM3MzIyMDU3LVBhSUJy',
        offers: [
            {
                offerId: 'IB44007ff2baf0470c99b31481105ae210OP',
                price: {
                    fare: 420,
                    tax: 41.79,
                    total: 461.79,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                slices: [
                    {
                        sliceId: '1MADBCN',
                        departureDateTime: null,
                        arrivalDateTime: null,
                        duration: null,
                        stopsNumber: 0,
                        price: {
                            fare: 165,
                            tax: 21.46,
                            total: 186.46,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        detailedPrices: [
                            {
                                fare: 165,
                                tax: 21.46,
                                total: 186.46,
                                currency: 'EUR',
                                passengerIds: [
                                    'ADULT_01'
                                ],
                                segmentPrices: null,
                                ticketingFee: 0
                            }
                        ],
                        segments: [
                            {
                                departure: {
                                    code: 'MAD',
                                    name: 'Madrid Adolfo Suarez-Barajas',
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
                                arrival: {
                                    code: 'BCN',
                                    name: 'Barcelona',
                                    terminal: '1',
                                    city: {
                                        code: 'BCN',
                                        description: 'Barcelona',
                                        countryCode: 'ES',
                                        country: {
                                            code: 'ES',
                                            description: 'España'
                                        }
                                    }
                                },
                                flight: {
                                    marketingCarrier: {
                                        code: 'IB',
                                        name: 'Iberia'
                                    },
                                    operationalCarrier: {
                                        code: 'IB',
                                        name: 'Iberia'
                                    },
                                    marketingFlightNumber: 'OPEN',
                                    operationalFlightNumber: 'OPEN',
                                    operationalDisclosure: 'IB',
                                    aircraft: null
                                },
                                cabin: {
                                    rbd: 'Y',
                                    bookingCode: null,
                                    bookingClass: 'TOURIST',
                                    remainingSeats: 0,
                                    fareFamily: 'YPA',
                                    fareBasis: 'YDRT',
                                    seatDisplays: null,
                                    extendedFareCode: '',
                                    cabinDescription: 'Turista'
                                },
                                overnight: false,
                                id: 'GOIIDvWVnCe9Mjns',
                                duration: null,
                                waitingTime: 0,
                                providerId: '',
                                ticketDesignator: '',
                                accrualQuote: null,
                                delayInformation: null,
                                stop: null,
                                departureDateTime: null,
                                arrivalDateTime: null
                            }
                        ],
                        overnight: false
                    },
                    {
                        sliceId: '2BCNMAD',
                        departureDateTime: null,
                        arrivalDateTime: null,
                        duration: null,
                        stopsNumber: 0,
                        price: {
                            fare: 255,
                            tax: 20.33,
                            total: 275.33,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        detailedPrices: [
                            {
                                fare: 255,
                                tax: 20.33,
                                total: 275.33,
                                currency: 'EUR',
                                passengerIds: [
                                    'ADULT_01'
                                ],
                                segmentPrices: null,
                                ticketingFee: 0
                            }
                        ],
                        segments: [
                            {
                                departure: {
                                    code: 'BCN',
                                    name: 'Barcelona',
                                    terminal: '1',
                                    city: {
                                        code: 'BCN',
                                        description: 'Barcelona',
                                        countryCode: 'ES',
                                        country: {
                                            code: 'ES',
                                            description: 'España'
                                        }
                                    }
                                },
                                arrival: {
                                    code: 'MAD',
                                    name: 'Madrid Adolfo Suarez-Barajas',
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
                                flight: {
                                    marketingCarrier: {
                                        code: 'IB',
                                        name: 'Iberia'
                                    },
                                    operationalCarrier: {
                                        code: 'IB',
                                        name: 'Iberia'
                                    },
                                    marketingFlightNumber: 'OPEN',
                                    operationalFlightNumber: 'OPEN',
                                    operationalDisclosure: 'IB',
                                    aircraft: null
                                },
                                cabin: {
                                    rbd: 'J',
                                    bookingCode: null,
                                    bookingClass: 'BUSINESS',
                                    remainingSeats: 0,
                                    fareFamily: 'BPA',
                                    fareBasis: 'JDRT',
                                    seatDisplays: null,
                                    extendedFareCode: '',
                                    cabinDescription: 'Business'
                                },
                                overnight: false,
                                id: 'GspV-ypAJpvSoxdM',
                                duration: null,
                                waitingTime: 0,
                                providerId: '',
                                ticketDesignator: '',
                                accrualQuote: null,
                                delayInformation: null,
                                stop: null,
                                departureDateTime: null,
                                arrivalDateTime: null
                            }
                        ],
                        overnight: false
                    }
                ],
                offerExpiration: '2019-10-07T11:05:23.711+02:00',
                onHoldOptions: [],
                cashAviosPossibilities: [],
                carryOnBaggageAllowances: [
                    {
                        totalQuantity: 1,
                        segmentIds: [
                            'GOIIDvWVnCe9Mjns',
                            'GspV-ypAJpvSoxdM'
                        ]
                    }
                ],
                checkedBagAllowances: [
                    {
                        totalQuantity: 1,
                        pieceAllowances: [
                            {
                                totalQuantity: 1,
                                commercialName: 'UP TO 23 KG AND 158 LCM',
                                descriptions: [],
                                type: 'PIECE'
                            }
                        ],
                        segmentIds: [
                            'GOIIDvWVnCe9Mjns'
                        ]
                    },
                    {
                        totalQuantity: 2,
                        pieceAllowances: [
                            {
                                totalQuantity: 2,
                                commercialName: 'UP TO 23 KG AND 158 LCM',
                                descriptions: [],
                                type: 'PIECE'
                            }
                        ],
                        segmentIds: [
                            'GspV-ypAJpvSoxdM'
                        ]
                    }
                ],
                availableServices: [],
                selectedServices: [],
                specialDiscountsApplied: [],
                accrualQuote: {
                    redemptionPoints: null,
                    qualificationPoints: null
                },
                offerItems: [
                    {
                        offerItemId: 'IB44007ff2baf0470c99b31481105ae210OP_01',
                        passengerIds: [
                            'ADULT_01'
                        ],
                        price: {
                            fare: 420,
                            tax: 41.79,
                            total: 461.79,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        detailedTaxes: [
                            {
                                code: 'QV',
                                amount: 7.7,
                                currency: 'EUR',
                                description: 'Seguridad'
                            },
                            {
                                code: 'OG',
                                amount: 1.34,
                                currency: 'EUR',
                                description: 'Tasa de seguridad'
                            },
                            {
                                code: 'JD',
                                amount: 32.75,
                                currency: 'EUR',
                                description: 'Cargo por salida'
                            }
                        ],
                        fareCalculation: null,
                        fareComponents: []
                    }
                ],
                type: 'SHUTTLE'
            }
        ],
        passengers: [
            {
                passengerId: 'ADULT_01',
                passengerType: 'ADULT',
                firstName: null,
                surname: null,
                frequentFlyerInfo: null
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
                    alignment: 'R',
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2,
                    recommendedDisplay: 'symbol'
                }
            ]
        },
        fareFamilyConditions: [
            {
                cabinType: 'E',
                cabinDescription: 'Turista',
                commercialCode: 'YPA',
                commercialName: 'Turista Puente Aéreo',
                commercialNameES: 'Turista Puente Aéreo',
                priority: 500,
                conditions: [
                    {
                        code: 'EQMANO',
                        name: 'Equipaje de mano',
                        text: '1 bulto',
                        units: 1,
                        extendedInfo: {
                            title: '1 bulto en cabina',
                            message: '1 bulto/ 56x45x25cm',
                            code: 'CA_EQP_MANO_10KG',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'EQBODEGA',
                        name: 'Equipaje en bodega',
                        text: '1 pieza.',
                        units: 1,
                        extendedInfo: {
                            title: '1 equipaje en bodega',
                            message: 'Incluido: 1 pieza',
                            code: 'CA_1_PIEZAS',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'ASIENTO',
                        name: 'Selección de asiento',
                        text: 'Incluido',
                        units: null,
                        extendedInfo: {
                            title: 'Con selección de asiento',
                            message: 'Incluido',
                            code: 'CA_Asiento_Gratuito',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'CAMBIO',
                        name: 'Cambios',
                        text: 'Permitidos en cualquier momento',
                        units: null,
                        extendedInfo: {
                            title: 'Cambio permitido',
                            message: 'Permitidos en cualquier momento',
                            code: 'CA_CAMBIO SIEMPRE',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'REEMBOLSO',
                        name: 'Reembolso (por sentido)',
                        text: 'Permitido en cualquier momento',
                        units: null,
                        extendedInfo: {
                            title: 'Reembolso permitido',
                            message: 'Reembolso permitido en cualquier momento.',
                            code: 'CA_REEMBOLSO SIEMPRE',
                            conditionStatus: true,
                            observationCode: null
                        }
                    }
                ],
                observations: [],
                conditionsPriority: [
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            },
            {
                cabinType: 'B',
                cabinDescription: 'Business Class',
                commercialCode: 'BPA',
                commercialName: 'Business Puente Aéreo',
                commercialNameES: 'Business Puente Aéreo',
                priority: 200,
                conditions: [
                    {
                        code: 'EQMANO',
                        name: 'Equipaje de mano',
                        text: '1 bulto',
                        units: 1,
                        extendedInfo: {
                            title: '1 bulto en cabina',
                            message: '1 bulto/ 56x45x25cm',
                            code: 'CA_EQP_MANO_10KG',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'EQBODEGA',
                        name: 'Equipaje en bodega',
                        text: '2 piezas',
                        units: 2,
                        extendedInfo: {
                            title: '2 equipajes en bodega ',
                            message: '2 piezas máx 23kg/pieza y 158 cm.  ',
                            code: 'CA_2_PIEZAS',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'ASIENTO',
                        name: 'Selección de asiento',
                        text: 'Incluido',
                        units: null,
                        extendedInfo: {
                            title: 'Con selección de asiento',
                            message: 'Incluido',
                            code: 'CA_Asiento_Gratuito',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'CAMBIO',
                        name: 'Cambios',
                        text: 'Permitidos en cualquier momento',
                        units: null,
                        extendedInfo: {
                            title: 'Cambio permitido',
                            message: 'Permitidos en cualquier momento',
                            code: 'CA_CAMBIO SIEMPRE',
                            conditionStatus: true,
                            observationCode: null
                        }
                    },
                    {
                        code: 'REEMBOLSO',
                        name: 'Reembolso (por sentido)',
                        text: 'Permitido en cualquier momento',
                        units: null,
                        extendedInfo: {
                            title: 'Reembolso permitido',
                            message: 'Reembolso permitido en cualquier momento.',
                            code: 'CA_REEMBOLSO SIEMPRE',
                            conditionStatus: true,
                            observationCode: null
                        }
                    }
                ],
                observations: [],
                conditionsPriority: [
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        advices: [],
        services: [],
        relatedContent: [
            {
                key: 'TOTAL_PRICE',
                value: 'Precio total, incluye tarifa aérea, <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tasas_gubernamentales&market=ES&language=es\'>tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tarjetas_empresa&market=ES&language=es\'>tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos.'
            }
        ]
    };
    const fakeCommonsUtilService = {
        getUserTypeByToken:jasmine.createSpy('')
    };
    const fakeCommonsUserUtilsService = {
        getUserRole:jasmine.createSpy(''),
        isIbPlus:jasmine.createSpy('')
    };
    const fakeCookies = {

    };
    const fakeSessionStorage = new StorageServiceMock();
    let localStorageService;

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-datalayer-module', ($provide) => {
            $provide.value('DataLayerService', fakeDataLayerService);
            $provide.value('BookingAppConstants', mockBookingAppConstants);
            $provide.value('BookingUtilService', {});
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('$cookies', fakeCookies);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
        });
        inject((_DatalayerUtilsService_, _localStorageService_) => {
            DatalayerUtilsService = _DatalayerUtilsService_;
            DatalayerUtilsService.initializeDatalayer('es', 'ES', 'testDevice');
            localStorageService = _localStorageService_;
        });
    });

    xit('When initializeDatalayer is called, DataLayerService.initDatalayer must be called with the initial datalayer info', (done) => {
        const initialDatalayer = {
            idioma: 'es',
            mercado: 'ES',
            versionWeb: 'angularjs',
            modeWeb: 'testDevice'
        };
        DatalayerUtilsService.initializeDatalayer('es', 'ES', 'testDevice');
        expect(fakeDataLayerService.initDatalayer).toHaveBeenCalledWith(initialDatalayer);
        done();
    });

    xdescribe('When updateDatalayerWithQuadrigam is called', () => {
        it('and is anonymous user, DataLayerService.addDataLayerGeneralInfo must be called with the quadrigam info, extended info and no user logged state', (done) => {
            const quadrigam2 = 'testQuadrigam';
            const datalayerInfo2 = { quadrigam: quadrigam2, codigoSeguimiento: 'es/ES/' + quadrigam2, EstadoUsuario: 'no_logado', test: 'testAttr' };
            DatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam2, { test: 'testAttr' }, false);
            expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled();
            done();
        });
        xit('and is logged user, DataLayerService.addDataLayerGeneralInfo must be called with the quadrigam info, extended info and user logged state', (done) => {
            const quadrigam = 'testQuadrigam';
            const datalayerInfo = { quadrigam: quadrigam, codigoSeguimiento: 'es/ES/' + quadrigam, EstadoUsuario: 'logado', test: 'testAttr' };
            DatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, { test: 'testAttr' }, true);
            expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(datalayerInfo);
            done();
        });
    });
    xit('When sendDatalayerEvent is called, DataLayerService.callUpdateTagManager must be called with the input type', (done) => {
        let type = 'type', timeout, rootScope;
        inject(($timeout, $rootScope) => {
            timeout = $timeout;
            rootScope = $rootScope;
            spyOn(rootScope, '$broadcast');
        });
        DatalayerUtilsService.sendDatalayerEvent(type);
        timeout.flush();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateDatalayer');
        expect(fakeDataLayerService.callUpdateTagManager).toHaveBeenCalledWith(type);
        done();
    });

    xdescribe('When updateLoggedDatalayer is called', () => {
        it('and customer data is provided and it has user level segment, DataLayerService.addDataLayerGeneralInfo must be called with the user info', (done) => {
            const customerData = { category: 'ORO', ibPlusNumber: 'test' };
            const datalayerInfo = { NivelUsuario: 'ORO', userID: 'test', segmento: 1, userAvios: '' };
            DatalayerUtilsService.updateLoggedDatalayer(customerData);
            expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(datalayerInfo);
            done();
        });
        it('and no customer data category is provided, DataLayerService.addDataLayerGeneralInfo must be called with the user info with empty category', (done) => {
            const customerData = { ibPlusNumber: 'test' };
            const datalayerInfo = { NivelUsuario: '', userID: 'test', segmento: 0, userAvios: '' };
            DatalayerUtilsService.updateLoggedDatalayer(customerData);
            expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(datalayerInfo);
            done();
        });
    });

    // xit('When generateDatalayerDOM is called, a string with the whole datalayer info must be returned', function (done) {
    //     var expectedString = '<script type="text/javascript">datalayer_general[\'test\']=\'test\';datalayer_general[\'test1\']=\'test1\';</script > '
    //     fakeDataLayerService.getDatalayerGeneral = jasmine.createSpy('getDatalayerGeneral').and.callFake(function () {
    //         return { 'test': 'test', 'test1': 'test1' };
    //     });
    //     expect(DatalayerUtilsService.generateDatalayerDOM()).toEqual(expectedString);
    //     done();
    // });

    it('When removeDatalayerObjects is called, a string with the whole datalayer info must be returned', (done) => {
        const datalayerInfoAttrs = ['NivelUsuario', 'userID', 'segmento'];
        DatalayerUtilsService.removeDatalayerObjects(datalayerInfoAttrs);
        expect(fakeDataLayerService.removeDatalayerGeneralInfo).toHaveBeenCalledWith(datalayerInfoAttrs);
        done();
    });
    xit('When removeDatalayerErrorAttrs is called, DataLayerService.removeDatalayerGeneralInfo must be called with the attributes to be removed', (done) => {
        const datalayerInfoAttrs = ['errorSeverityCode', 'tipoError'];
        DatalayerUtilsService.removeDatalayerErrorAttrs();
        expect(fakeDataLayerService.removeDatalayerGeneralInfo).toHaveBeenCalledWith(datalayerInfoAttrs);
        done();
    });

    it('When sendDatalayerModalEvent is called, DataLayerService.addDataLayerGeneralInfo must be called with the modal info and datalayer event must be thrown', (done) => {
        const modalObject = { idModal: 'modalId' };
        const expectedDatalayerInfo = { modal: 'modalId' };
        DatalayerUtilsService.sendDatalayerModalEvent(modalObject);
        expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(expectedDatalayerInfo);
        done();
    });

    it('When removeDatalayerModalAttrs is called, DataLayerService.removeDatalayerGeneralInfo must be called with the attributes to be removed', (done) => {
        const datalayerInfoAttrs = ['modal'];
        DatalayerUtilsService.removeDatalayerModalAttrs();
        expect(fakeDataLayerService.removeDatalayerGeneralInfo).toHaveBeenCalledWith(datalayerInfoAttrs);
        done();
    });

    it('When addDataLayerInfo is called, DataLayerService.addDataLayerGeneralInfo must be called with the input info', (done) => {
        const expectedDatalayerInfo = { test: 'test' };
        DatalayerUtilsService.addDataLayerInfo(expectedDatalayerInfo);
        expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(expectedDatalayerInfo);
        done();
    });

    it('When updateDatalayerInitType is called, DataLayerService.addDataLayerGeneralInfo must be called with the init type info', (done) => {
        const initType = 'test';
        const expectedDatalayerInfo = { detalleInicio: 'test' };
        DatalayerUtilsService.updateDatalayerInitType(initType);
        expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(expectedDatalayerInfo);
        done();
    });

    describe('When updateDatalayerForAncillaries is called', () => {
        xit('and every ancillaries has quantity, DataLayerService.addDataLayerGeneralInfo must be called with the YES ancillaries info', (done) => {
            const expectedDatalayerInfo = { ancillariesComprados: 'Asientos:SI–5-Maletas:SI–3-Seguros:SI–10' };
            DatalayerUtilsService.updateDatalayerForAncillaries(3, 5, 10);
            expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(expectedDatalayerInfo);
            done();
        });
        xit('and no ancillaries has quantity, DataLayerService.addDataLayerGeneralInfo must be called with the NO ancillaries info', (done) => {
            const expectedDatalayerInfo = { quadrigam: 'testQuadrigam', codigoSeguimiento: 'es/ES/testQuadrigam', EstadoUsuario: 'no_logado', test: 'testAttr', quadrigam: 'testQuadrigam', codigoSeguimiento: 'es/ES/testQuadrigam', EstadoUsuario: 'logado', test: 'testAttr', NivelUsuario: 'ORO', userID: 'test', userAvios: '', segmento: 1, NivelUsuario: '', userID: 'test', userAvios: '', segmento: 0, errorSeverityCode: 'errorCodeTest-internalErrorCodeTest', tipoError: 'messageTest', modal: 'modalId', test: 'test', detalleInicio: 'test', ancillariesAction: 5, ancillariesAsientos: 'NO', ancillariesMaletas: 'SI– <10>', ancillariesSeguros: 'NO', ancillariesAction: 0 };
            DatalayerUtilsService.updateDatalayerForAncillaries(0, 0, 0);
            expect(fakeDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalledWith(expectedDatalayerInfo);
            done();
        });
    });

    xdescribe('When generateDatalayerPassengers is called and flowApp is PAOB', () => {
        it('and customer data is provided and it has user level segment, DataLayerService.addDataLayerGeneralInfo must be called with the user info', (done) => {
            const priceInfo = { fare: 420, tax: 41.79, total: 461.79, currency: 'EUR', ticketingFee: 0 };
            const currency = 'EUR';
            localStorageService.set('fareData', fakeFareData);
            localStorageService.set('flowApp', mockBookingAppConstants.FLOW_APP.PAOB);
            DatalayerUtilsService.generateDatalayerPassengers(fake2Slices, priceInfo, currency);
            expect(DatalayerUtilsService.generateDatalayerPassengers(fake2Slices, priceInfo, currency).fecha).toEqual('open-open');
            expect(DatalayerUtilsService.generateDatalayerPassengers(fake2Slices, priceInfo, currency).horarioVuelo).toEqual('IDA:open-VUELTA:open');
            expect(DatalayerUtilsService.generateDatalayerPassengers(fake1Slice, priceInfo, currency).fecha).toEqual('open');
            expect(DatalayerUtilsService.generateDatalayerPassengers(fake1Slice, priceInfo, currency).horarioVuelo).toEqual('IDA:open');
            done();
        });
    });

});
