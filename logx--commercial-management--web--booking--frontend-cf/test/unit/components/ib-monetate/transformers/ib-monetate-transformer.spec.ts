import angular from 'angular';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
describe('MonetateTransformer Test', function () {

    var MonetateTransformer;

    var fakeCommonsModalService = {};

    const fakeCommonsConstants = {
        passengerTypes:{
            child: 'CHILD',
            infant: 'INFANT'
        },
        DISCOUNT_SEARCH_RESIDENT:{
            name: 'resident',
            subname: 'largeFamilyType',
            items: [
                {
                    description: 'HEADER_ADVANCED_SEARCH_NO_RESIDENT',
                    value: ''
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                    value: 'RC'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                    value: 'DC'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                    value: 'BP'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                    value: 'BI'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_MELILLA',
                    value: 'RM'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CEUTA',
                    value: 'RE'
                }
            ]
        },
        DISCOUNT_SEARCH_FAMILY: {
            type: 'HEADER_ADVANCED_SEARCH_FAMILIA_NUM',
            name: 'family',
            items: [
                {
                    description: 'HEADER_ADVANCED_SEARCH_NO_FAMILY',
                    value: ''
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_FAMILY_GENERAL',
                    value: 'F1'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_FAMILY_SPECIAL',
                    value: 'F2'
                }
            ]
        },
        APP_TYPES: {
            ONHOLD: 'BBKIOH'
        }
    };
    const fakeMonetateConstants = {
        CATALOG_PRODUCTS_ID:{
            ANCILLARIES:{
                BAGGAGE:{
                    EQUIPAJE_EXTRA: 'MALETAS-EQUIPAJEEXTRA',
                    EQUIPAJE_EXTRA_15: 'MALETAS-EQUIPAJEEXTRA-15',
                    EQUIPAJE_EXTRA_23: 'MALETAS-EQUIPAJEEXTRA-23',
                    EQUIPAJE_EXTRA_32: 'MALETAS-EQUIPAJEEXTRA-32',
                    EQUIPAJE_ESPECIAL: 'MALETAS-EQUIPAJEESPECIAL',
                    EQUIPAJE_ESPECIAL_BIKE: 'MALETAS-EQUIPAJEESPECIAL-BIKE',
                    EQUIPAJE_ESPECIAL_SKIS: 'MALETAS-EQUIPAJEESPECIAL-SKIS',
                    EQUIPAJE_ESPECIAL_GOLF: 'MALETAS-EQUIPAJEESPECIAL-GOLF'
                },
                FLEXIBILIZATION: {
                    CAMBIO: 'FLEXIBILIDAD-CAMBIO',
                    REEMBOLSO: 'FLEXIBILIDAD-REEMBOLSO',
                    PACK: 'FLEXIBILIDAD-PACK'
                },
                PRIORIDAD: 'PRIORIDAD',
                SEAT: {
                    DELANTERO: 'ASIENTO-DELANTERO',
                    SALIDA_EMERGENCIA: 'ASIENTO-SALIDAEMERG',
                    XL: 'ASIENTO-XL',
                    NORMAL: 'ASIENTO-NORMAL',
                    BEBE: 'ASIENTO-CONBEBE',
                    MOVILIDAD_REDUCIDA: 'ASIENTO-MOVREDUCIDA',
                    PROMO: 'ASIENTO-PROMO'
                },
                INSURANCE: {
                    SEGURO_ANULACION: 'SEGURO-ANULACION',
                    SEGURO_ASISTENCIA: 'SEGURO-ASISTENCIA'
                }
            },
            FLIGHT_PASSENGERS: {
                MENOR: 'V-MENOR',
                BEBE: 'V-INFANT',
                RESIDENTE_BALEARES: 'V-RES-BALE',
                RESIDENTE_CANARIAS: 'V-RES-CANA',
                FAM_NUMEROSA_GENERAL: 'V-FAMNUM-GRAL',
                FAM_NUMEROSA_ESPECIAL: 'V-FAMNUM-ESP'
            },
            CABIN_TYPE: {
                TURISTA: 'V-CABINA-TURISTA',
                PREMIUM: 'V-CABINA-PREMIUM',
                BUSINESS: 'V-CABINA-BUSINESS'
            },
            FLIGHT_FARE: {
                GENERICAS: {
                    MAS_ECONOMICA: 'V-TARIF-ECONOMICA',
                    FLEXIBLES: 'V-TARIF-FLEXIBLES',
                    CABINAS_PREMIUM: 'V-TARIF-CABINASPREMIUM'
                },
                TURISTA: {
                    BASICA: 'V-TARIF-TURIST-BASICA',
                    BASICA_PLUS: 'V-TARIF-TURIST-BASICAPLUS',
                    OPTIMA: 'V-TARIF-TURIST-OPTIMA',
                    OPTIMA_FLEX: 'V-TARIF-TURIST-OPTIMAFLEX',
                    CONFORT: 'V-TARIF-TURIST-CONFORT',
                    FLEXIBLE: 'V-TARIF-TURIST-FLEXIBLE'

                },
                PREMIUM: {
                    FLEX: 'V-TARIF-PREMIUM-FLEX',
                    OPTIMA_FLEX: 'V-TARIF-PREMIUM-OPTIMAFLEX',
                    PROMO: 'V-TARIF-PREMIUM-PROM',
                    OPTIMA: 'V-TARIF-PREMIUM-OPTIMA',
                    PROM_FLEX: 'V-TARIF-PREMIUM-PROMFLEX'

                },
                BUSINESS: {
                    FLEX: 'V-TARIF-BUSINESS-FLEX',
                    OPTIMA_FLEX: 'V-TARIF-BUSINESS-OPTIMAFLEX',
                    PROMO: 'V-TARIF-BUSINESS-PROM',
                    PROM_FLEX: 'V-TARIF-BUSINESS-PROMFLEX',
                    OPTIMA: 'V-TARIF-BUSINESS-OPTIMA'
                }
            },
            FLIGHT_DESTINATION: {
                ESPANA: 'VD-ESPANA',
                EUROPA: 'VD-EUROPA',
                LATAM: 'VD-LATAM',
                AMERICANORTE: 'VD-AMERICANORTE',
                ASIA: 'VD-ASIA',
                AFRICA: 'VD-AFRICA'
            },
            TRIP_TYPE: {
                VACACIONES_FIN_DE_SEMANA: 'V-VAC-FINDESEMANA',
                VACACIONES_INVIERNO: 'V-VAC-INVIERNO',
                VACACIONES_VERANO: 'V-VAC-VERANO',
                VACACIONES_NEGOCIO: 'V-NEGOCIOS'
            }
        },
        DEFAULT_VALUES: {
            ZERO: '0',
            ONE: '1'
        },
        CONTINENTS_AND_COUNTRIES: {
            AMERICA: 'América',
            US: 'US',
            CANADA: 'CA',
            LATAM: 'LATAM'
        },
        CABIN_DESCRIPTION:{
            ECONOMY: 'Economy',
            PREMIUM_ECONOMY: 'Premium Economy',
            BUSINESS: 'Business'
        }
    };

    let localStorageService: StorageServiceMock = new StorageServiceMock();

    let mockShoppingBasketNull = {
        'baggages': {
            'segments': [],
            'totalFormatted': null
        },
        'speqs': {
            'segments': [],
            'totalFormatted': null
        },
        'priority': {
            'segments': [],
            'totalFormatted': null
        },
        'seats': {
            'segments': [],
            'totalFormatted': null
        },
        'insurance': null,
        'upgrading': null,
        'upgradingBids': null,
        'currency': null,
        'total': null,
        'totalFormatted': '',
        'discount': null
    };
    let mockShoppingBasketAncillaries = {
        'baggages': {
            'segments': [
                {
                    'sliceId': 'MADBIO20230308072500',
                    'baggages': [
                        {
                            'passengers': [
                                'ADULT_01'
                            ],
                            'type': {
                                'subtype': 'BAGGAGE_15',
                                'description': '15Kg'
                            },
                            'quanty': 1,
                            'total': 13,
                            'totalFormatted': '13,00€',
                            '$$hashKey': 'object:2653'
                        }
                    ],
                    'origin': {
                        'description': 'Madrid',
                        'code': 'MAD'
                    },
                    'destination': {
                        'description': 'Bilbao',
                        'code': 'BIO'
                    },
                    'total': 13,
                    'totalFormatted': '13,00€',
                    '$$hashKey': 'object:2651'
                }
            ],
            'totalFormatted': '13,00€'
        },
        'speqs': {
            'segments': [
                {
                    'sliceId': 'MADBIO20230308072500',
                    'speqs': [
                        {
                            'type': 'BICYCLE',
                            'quanty': 1,
                            'description': 'Bicicletas',
                            'total': 40,
                            'totalFormatted': '40,00€',
                            'passengers': [
                                'ADULT_01'
                            ],
                            '$$hashKey': 'object:2658'
                        }
                    ],
                    'total': 40,
                    'totalFormatted': '40,00€',
                    'origin': {
                        'description': 'Madrid',
                        'code': 'MAD'
                    },
                    'destination': {
                        'description': 'Bilbao',
                        'code': 'BIO'
                    },
                    '$$hashKey': 'object:2656'
                }
            ],
            'totalFormatted': '40,00€'
        },
        'priority': {
            'segments': [
                {
                    'sliceId': 'IB044820230308',
                    'quanty': 1,
                    'amount': 6,
                    'totalFormatted': '6,00€',
                    'origin': {
                        'description': 'Madrid',
                        'code': 'MAD'
                    },
                    'destination': {
                        'description': 'Bilbao',
                        'code': 'BIO'
                    },
                    '$$hashKey': 'object:2660'
                }
            ],
            'totalFormatted': '6,00€'
        },
        'seats': {
            'segments': [
                {
                    'segmentId': 'IB044820230308',
                    'seats': [
                        {
                            'type': 'EXTRA_SIZE',
                            'description': 'Espacio extra',
                            'quanty': 1,
                            'passengers': [
                                {
                                    'id': 'ADULT_01',
                                    'amount': 13.2
                                }
                            ],
                            'amount': 13.2,
                            'totalFormatted': '13,20€',
                            '$$hashKey': 'object:2649'
                        }
                    ],
                    'origin': {
                        'description': 'Madrid',
                        'code': 'MAD'
                    },
                    'destination': {
                        'description': 'Bilbao',
                        'code': 'BIO'
                    },
                    'total': 13.2,
                    'totalFormatted': '13,20€',
                    '$$hashKey': 'object:2647'
                }
            ],
            'totalFormatted': '13,20€'
        },
        'insurance': {
            'offer': 'IBAESTPR025',
            'total': 9.33,
            'totalFormatted': '9,33€',
            'passengers': 1,
            'type': 'Seguro de Anulación'
        },
        'upgrading': null,
        'upgradingBids': null,
        'currency': {
            'suffixSymbol': true,
            'decimalSeparator': ',',
            'numberDecimals': 2,
            'groupingSeparator': '.',
            'currencySymbol': '€',
            'description': 'Euro'
        },
        'total': 89.53,
        'totalFormatted': '89,53€',
        'discount': null,
        'flexibility': {
            'info': null,
            'totalFormatted': '8,00€',
            'total': 8,
            'title': 'ANCILLARIES_FLEXIBILITY_TITLE',
            'amount': {
                'title': 'ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT'
            },
            'currency': {
                'suffixSymbol': true,
                'decimalSeparator': ',',
                'numberDecimals': 2,
                'groupingSeparator': '.',
                'currencySymbol': '€',
                'description': 'Euro'
            },
            'items': [
                {
                    'concepts': [
                        {
                            'quantity': 1,
                            'description': 'Primer cambio de vuelo gratuito',
                            'price': 8,
                            'priceFormatted': '8,00€',
                            '$$hashKey': 'object:2665'
                        }
                    ],
                    '$$hashKey': 'object:2663'
                }
            ],
            'hasFlexibilization': true
        }
    };
    let mockFlightPassengersInfo = {
        'modeWeb': null,
        'searchOrigin': 'IBHMPA',
        'tripType': '1',
        'senior': null,
        'adult': 1,
        'young': null,
        'teenager': null,
        'child': 1,
        'infant': 1,
        'resident': 'BP',
        'largeFamilyType': 'F1',
        'flexDates': 'true',
        'preferredCabin': 'R',
        'payWithAvios': null,
        'payWithPoints': null,
        'ibGroup': null,
        'referralId': null,
        'displayedPrice': null,
        'slices': [],
        'userCurrency': null,
        'priceCurrency': null,
        'numTrips': null,
        'originDestinations': [
            {
                'origin': 'MAD',
                'destination': 'PMI',
                'date': '2023-03-08'
            }
        ],
        'bookingCode1': null,
        'backToUrl': null,
        'codeTracking': null,
        'travelAgent': null,
        'fromMarket': null,
        'fromLanguage': null
    };
    let mockSelectedTripInfo = [
        {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TBAESEU',
            'commercialName': 'Básica',
            'commercialNameES': 'Básica',
            'priority': 900,
            'conditions': [
                {
                    'code': 'CABINA',
                    'name': 'Cabina',
                    'text': 'Turista.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Cabina Turista',
                        'message': 'Turista.',
                        'code': 'CA_Cabina_Turista',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': 'Incluida 1 pieza hasta 10 kg (56x40x25cm).',
                    'units': 1,
                    'extendedInfo': {
                        'title': 'Equipaje de mano: 1 pieza',
                        'message': 'Incluido 1 accesorio personal y 1 pieza hasta 10 kg (56x40x25cm), en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo. ',
                        'code': 'CA_EQP_MANO_10KG',
                        'conditionStatus': true,
                        'observationCode': '2'
                    }
                },
                {
                    'code': 'EQBODEGA',
                    'name': 'Equipaje en bodega',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Equipaje facturable no incluido',
                        'message': 'Con coste.',
                        'code': 'CA_1_PIEZAS_PAGO',
                        'conditionStatus': false,
                        'observationCode': '1'
                    }
                },
                {
                    'code': 'COMIDA',
                    'name': 'Comida',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Comida no incluida ',
                        'message': 'Con coste.',
                        'code': 'Comida_no_incluida',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'ASIENTO',
                    'name': 'Selección de asiento',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Selección de asiento con coste',
                        'message': 'Con coste. ',
                        'code': 'CA_Asiento_Pago',
                        'conditionStatus': false,
                        'observationCode': '3'
                    }
                },
                {
                    'code': 'ASIENTODELANTERO',
                    'name': 'Asiento delantero',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Asiento delantero con coste',
                        'message': 'Con coste.',
                        'code': 'CA_Asiento_Delantero_pago',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'ASIENTOXL',
                    'name': 'Selección de asiento XL',
                    'text': 'Con coste, salvo excepciones.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Asiento XL con coste',
                        'message': 'Con coste en vuelos operados por Iberia, Iberia Express e Iberia Regional Air Nostrum. Y sin coste en vuelos operados por British Airways.',
                        'code': 'CA_Asiento_XL_Pago',
                        'conditionStatus': false,
                        'observationCode': '3'
                    }
                },
                {
                    'code': 'EMBARQUE',
                    'name': 'Prioridad de Embarque',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Embarque prioritario no incluido',
                        'message': 'No incluido.',
                        'code': 'CA_Embarque_NO_Prioritario',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'CAMBIO',
                    'name': 'Cambios',
                    'text': 'Permitido con coste, no permitido en caso de no-show.',
                    'units': 65,
                    'extendedInfo': {
                        'title': 'Cambio de vuelo con coste',
                        'message': 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                        'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'REEMBOLSO',
                    'name': 'Reembolso (por sentido)',
                    'text': 'No permitido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'No permitido',
                        'message': 'No permitido.',
                        'code': 'CA_REEMBOLSO NO PERMITIDO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'TARJEMBANTIC',
                    'name': 'Tarjeta de embarque anticipada',
                    'text': 'No incluida.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Tarjeta de embarque anticipada no incluida',
                        'message': 'No incluida. ',
                        'code': 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'CHECKINDESK',
                    'name': 'Mostrador check-in exclusivo',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Mostrador Check-in exclusivo no incluido',
                        'message': 'No incluido.',
                        'code': 'Chek-in_desk_ NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'SALAVIP',
                    'name': 'Acceso a salas VIP',
                    'text': 'Acceso no incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Acceso a Sala Vip no incluido',
                        'message': 'Acceso no incluido.',
                        'code': 'Acceso a salas VIP No permitido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'FASTTRACK',
                    'name': 'Fast Track',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Fast Track no incluido',
                        'message': 'No incluido.',
                        'code': 'Fast Track NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'EQPPRIOR',
                    'name': 'Entrega prioritaria equipaje',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'No incluye entrega rápida de equipaje',
                        'message': 'Con coste.',
                        'code': 'Entrega_prioritaria_equipaje_ NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'AVIO',
                    'name': 'AVIOS',
                    'text': 'Incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Obtén Avios con tu compra',
                        'message': 'Incluido.  ',
                        'code': 'AVIOS incluido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'WIFI',
                    'name': 'WiFi',
                    'text': 'Disponible con coste, según el tipo de avión.',
                    'units': null,
                    'extendedInfo': {
                        'title': '',
                        'message': '',
                        'code': null,
                        'conditionStatus': false,
                        'observationCode': null
                    }
                }
            ],
            'observations': [
                {
                    'observationCode': 1,
                    'observationText': '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE" class="links">Consulte equipaje adicional<span class="oculto">[Abre en ventana nueva]</span></a>'
                },
                {
                    'observationCode': 2,
                    'observationText': '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías <strong>one</strong>world. En el resto debes consultar con la compañía operadora'
                },
                {
                    'observationCode': 3,
                    'observationText': '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE" class="links" title="Ver precios de la reserva de asiento">Más detalle sobre la reserva anticipada de asiento</a>'
                }
            ],
            'conditionsPriority': [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'ASIENTODELANTERO',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO',
                'CHECKINDESK',
                'FASTTRACK'
            ]
        }
    ];

    let mockFareFamilyInfo = [
        {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TBAESEU',
            'commercialName': 'Básica',
            'commercialNameES': 'Básica',
            'priority': 900,
            'conditions': [
                {
                    'code': 'CABINA',
                    'name': 'Cabina',
                    'text': 'Turista.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Cabina Turista',
                        'message': 'Turista.',
                        'code': 'CA_Cabina_Turista',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': 'Incluida 1 pieza hasta 10 kg (56x40x25cm).',
                    'units': 1,
                    'extendedInfo': {
                        'title': 'Equipaje de mano: 1 pieza',
                        'message': 'Incluido 1 accesorio personal y 1 pieza hasta 10 kg (56x40x25cm), en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo. ',
                        'code': 'CA_EQP_MANO_10KG',
                        'conditionStatus': true,
                        'observationCode': '2'
                    }
                },
                {
                    'code': 'EQBODEGA',
                    'name': 'Equipaje en bodega',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Equipaje facturable no incluido',
                        'message': 'Con coste.',
                        'code': 'CA_1_PIEZAS_PAGO',
                        'conditionStatus': false,
                        'observationCode': '1'
                    }
                },
                {
                    'code': 'COMIDA',
                    'name': 'Comida',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Comida no incluida ',
                        'message': 'Con coste.',
                        'code': 'Comida_no_incluida',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'ASIENTO',
                    'name': 'Selección de asiento',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Selección de asiento con coste',
                        'message': 'Con coste. ',
                        'code': 'CA_Asiento_Pago',
                        'conditionStatus': false,
                        'observationCode': '3'
                    }
                },
                {
                    'code': 'ASIENTODELANTERO',
                    'name': 'Asiento delantero',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Asiento delantero con coste',
                        'message': 'Con coste.',
                        'code': 'CA_Asiento_Delantero_pago',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'ASIENTOXL',
                    'name': 'Selección de asiento XL',
                    'text': 'Con coste, salvo excepciones.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Asiento XL con coste',
                        'message': 'Con coste en vuelos operados por Iberia, Iberia Express e Iberia Regional Air Nostrum. Y sin coste en vuelos operados por British Airways.',
                        'code': 'CA_Asiento_XL_Pago',
                        'conditionStatus': false,
                        'observationCode': '3'
                    }
                },
                {
                    'code': 'EMBARQUE',
                    'name': 'Prioridad de Embarque',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Embarque prioritario no incluido',
                        'message': 'No incluido.',
                        'code': 'CA_Embarque_NO_Prioritario',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'CAMBIO',
                    'name': 'Cambios',
                    'text': 'Permitido con coste, no permitido en caso de no-show.',
                    'units': 65,
                    'extendedInfo': {
                        'title': 'Cambio de vuelo con coste',
                        'message': 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                        'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'REEMBOLSO',
                    'name': 'Reembolso (por sentido)',
                    'text': 'No permitido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'No permitido',
                        'message': 'No permitido.',
                        'code': 'CA_REEMBOLSO NO PERMITIDO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'TARJEMBANTIC',
                    'name': 'Tarjeta de embarque anticipada',
                    'text': 'No incluida.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Tarjeta de embarque anticipada no incluida',
                        'message': 'No incluida. ',
                        'code': 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'CHECKINDESK',
                    'name': 'Mostrador check-in exclusivo',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Mostrador Check-in exclusivo no incluido',
                        'message': 'No incluido.',
                        'code': 'Chek-in_desk_ NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'SALAVIP',
                    'name': 'Acceso a salas VIP',
                    'text': 'Acceso no incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Acceso a Sala Vip no incluido',
                        'message': 'Acceso no incluido.',
                        'code': 'Acceso a salas VIP No permitido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'FASTTRACK',
                    'name': 'Fast Track',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Fast Track no incluido',
                        'message': 'No incluido.',
                        'code': 'Fast Track NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'EQPPRIOR',
                    'name': 'Entrega prioritaria equipaje',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'No incluye entrega rápida de equipaje',
                        'message': 'Con coste.',
                        'code': 'Entrega_prioritaria_equipaje_ NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'AVIO',
                    'name': 'AVIOS',
                    'text': 'Incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Obtén Avios con tu compra',
                        'message': 'Incluido.  ',
                        'code': 'AVIOS incluido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'WIFI',
                    'name': 'WiFi',
                    'text': 'Disponible con coste, según el tipo de avión.',
                    'units': null,
                    'extendedInfo': {
                        'title': '',
                        'message': '',
                        'code': null,
                        'conditionStatus': false,
                        'observationCode': null
                    }
                }
            ],
            'observations': [
                {
                    'observationCode': 1,
                    'observationText': '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE" class="links">Consulte equipaje adicional<span class="oculto">[Abre en ventana nueva]</span></a>'
                },
                {
                    'observationCode': 2,
                    'observationText': '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías <strong>one</strong>world. En el resto debes consultar con la compañía operadora'
                },
                {
                    'observationCode': 3,
                    'observationText': '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE" class="links" title="Ver precios de la reserva de asiento">Más detalle sobre la reserva anticipada de asiento</a>'
                }
            ],
            'conditionsPriority': [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'ASIENTODELANTERO',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO',
                'CHECKINDESK',
                'FASTTRACK'
            ]
        }
    ];
    let mockConfirmationInfo = require('../../../../mocks/Responses/mockConfirmationInfo.json');
    let mockDestinationAreas = require('../../../../mocks/Responses/mockDestinationAreasList.json');
    let mockFareData = {
        contextMetadata:{
            currencies: [
                {
                    code: 'EUR'
                }
            ]
        },
        offers: [
            {
                onHoldOptions:[{}]
            }
        ]
    };
    let mockAddedCartProducts = [
        {
            'productId': 'IB044820230216',
            'quantity': '1',
            'unitPrice': '0',
            'currency': 'EUR',
            'isAncillary': false
        },
        {
            'productId': 'V-CABINA-TURISTA',
            'quantity': '1',
            'unitPrice': '0',
            'isAncillary': false
        },
        {
            'productId': 'V-TARIF-ECONOMICA',
            'quantity': '1',
            'unitPrice': '0',
            'isAncillary': false
        },
        {
            'productId': 'V-TARIF-TURIST-BASICA',
            'quantity': '1',
            'unitPrice': '0',
            'isAncillary': false
        },
        {
            'productId': 'VD-ESPANA',
            'quantity': '1',
            'unitPrice': '0',
            'isAncillary': false
        },
        {
            'productId': 'MALETAS-EQUIPAJEEXTRA-15',
            'unitPrice': '13',
            'quantity': '1',
            'currency': 'EUR',
            'isAncillary': true
        },
        {
            'productId': 'MALETAS-EQUIPAJEESPECIAL-BIKE',
            'unitPrice': '40',
            'quantity': '1',
            'currency': 'EUR',
            'isAncillary': true
        },
        {
            'productId': 'PRIORIDAD',
            'quantity': '0',
            'unitPrice': 'NaN',
            'currency': 'EUR',
            'isAncillary': true
        }
    ];
    let mockDestinationCountryCollection = [
        {
            'origin': 'MAD',
            'destination': 'PMI',
            'date': '2023-03-08'
        }
    ];
    let mockOriginDestinationInfo = [
        {
            'origin': 'MAD',
            'destination': 'BIO',
            'date': '2023-02-16'
        },
        {
            'origin': 'BIO',
            'destination': 'MAD',
            'date': '2023-02-17'
        }
    ];
    let mockOriginDestinationWinter = [
        {
            'origin': 'MAD',
            'destination': 'BIO',
            'date': '2023-01-16'
        },
        {
            'origin': 'BIO',
            'destination': 'MAD',
            'date': '2023-01-25'
        }
    ];
    let mockOriginDestinationSummer = [
        {
            'origin': 'MAD',
            'destination': 'BIO',
            'date': '2023-06-16'
        },
        {
            'origin': 'BIO',
            'destination': 'MAD',
            'date': '2023-06-25'
        }
    ];
    let mockOriginDestinationWeekend = [
        {
            'origin': 'MAD',
            'destination': 'BIO',
            'date': '2023-03-06'
        },
        {
            'origin': 'BIO',
            'destination': 'MAD',
            'date': '2023-03-12'
        }
    ];
    let mockData = {
        'modeWeb': null,
        'searchOrigin': 'IBHMPA',
        'tripType': '1',
        'senior': null,
        'adult': 1,
        'young': null,
        'teenager': null,
        'child': null,
        'infant': null,
        'resident': null,
        'largeFamilyType': null,
        'flexDates': 'true',
        'preferredCabin': 'R',
        'payWithAvios': null,
        'payWithPoints': null,
        'ibGroup': null,
        'referralId': null,
        'displayedPrice': null,
        'slices': [],
        'userCurrency': null,
        'priceCurrency': null,
        'numTrips': null,
        'originDestinations': [
            {
                'origin': 'MAD',
                'destination': 'BIO',
                'date': '2023-02-16'
            }
        ],
        'bookingCode1': null,
        'backToUrl': null,
        'codeTracking': null,
        'travelAgent': null,
        'fromMarket': null,
        'fromLanguage': null
    };
    let mockPassengers = {
        'originCity': {
            'code': 'MAD',
            'description': 'Madrid',
            'timezone': 'Europe/Madrid',
            'country': {
                'code': 'ES',
                'description': 'España'
            }
        },
        'destinationCity': {
            'code': 'BIO',
            'description': 'Bilbao',
            'timezone': 'Europe/Madrid',
            'country': {
                'code': 'ES',
                'description': 'España'
            }
        },
        'dates': {
            'outboundFlight': '2023-02-16',
            'formatedOutboundFlight': '2023-02-16T00:00:00.000Z'
        },
        'passengers': 1,
        'numAdults': 1,
        'numSeniors': 0,
        'numYoung': 0,
        'numTeenager': 0,
        'numInfant': 0,
        'numChilds': 0,
        'numberPassengrsWithoutInfant': 1
    };
    let mockSelectedSlices = [
        [
            {
                'segmentId': 'IB044820230216',
                'departureDateTime': '2023-02-16 07:25',
                'arrivalDateTime': '2023-02-16 08:30',
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
                    'code': 'BIO',
                    'name': 'AIRPORT',
                    'terminal': '',
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
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': '0448',
                    'operationalFlightNumber': '0448',
                    'operationalDisclosure': 'IB',
                    'aircraft': {
                        'code': '321',
                        'description': 'Airbus A321'
                    }
                },
                'overnight': false,
                'waitingTime': 0,
                'duration': 65,
                'delayInformation': null,
                'stop': null,
                'durationParsed': '1h 5min.',
                'isMoreThan2h': false,
                'waitingTimeParsed': '',
                'departureDateTimeParsed': '07:25',
                'departureDateParsed': {
                    'dateTime': '07:25',
                    'weekDay': 'WEEKDAY_THURSDAY',
                    'hour': 1,
                    'minutes': 0,
                    'day': 16,
                    'monthNumber': 2,
                    'month': 'MONTH_FEBRUARY',
                    'year': 2023,
                    'formatedDate': '2023-02-16 07:25'
                },
                'arrivalDateTimeParsed': '08:30',
                'companyURL': '/aerolineas/logo_pos_IB.svg',
                'warnings': [],
                'terminalChange': {
                    'isImportant': false,
                    'code': '',
                    'message': '',
                    'show': false
                },
                'airportChange': {
                    'isImportant': false,
                    'code': '',
                    'message': '',
                    'show': false
                },
                'scaleWaitingTime': {
                    'isImportant': false,
                    'code': '',
                    'message': '',
                    'show': false
                },
                'nightFlight': {
                    'code': '',
                    'message': '',
                    'isOverNight': false
                },
                '$$hashKey': 'object:182'
            }
        ]
    ];
    let mockCurrency = {
        'offerId': 'IB2fc8e478d6ff4d14859106fa05537383OP',
        'offerItems': [
            {
                'offerItemId': 'IB2fc8e478d6ff4d14859106fa05537383OP_01',
                'price': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'privateFareInformation': null,
                'reshopDifferential': null,
                'surcharges': null
            }
        ],
        'originDestinations': [
            {
                'priceDiscountApplied': true,
                'totalPrice': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'totalPriceDiscountData': {
                    'totalDiscount': 0.88,
                    'percentDiscount': 2,
                    'totalOriginal': 64.22
                },
                'adultPrice': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'adultPriceDiscountData': {
                    'totalDiscount': 0.88,
                    'percentDiscount': 2,
                    'totalOriginal': 64.22
                },
                'perPassengerPrice': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'originDestinationId': 'ODI_0',
                'applicableSlices': [
                    {
                        'sliceId': '0',
                        'remainingSeats': 9,
                        'segments': [
                            {
                                'segmentId': 'IB044820230216',
                                'fareFamily': 'TBAESEU',
                                'bookingCode': null,
                                'bookingClass': 'ECONOMY',
                                'rbd': 'Q',
                                'remainingSeats': 9,
                                'fareBasis': 'QZNOB4',
                                'extendedFareCode': 'QZNOB4',
                                'brandCode': null,
                                'checkedBaggageAllowanceKeys': [],
                                'carryOnBaggageAllowanceKeys': [],
                                'ticketDesignator': null,
                                'seatDisplays': null,
                                'cabinDescription': ''
                            }
                        ]
                    }
                ]
            }
        ],
        'timeLimits': '2022-12-19T08:48:17.712',
        'paymentTimeLimit': null,
        'specialDiscountsApplied': [
            {
                'type': 'DYNAMIC_PRICING',
                'description': 'Promoción especial',
                'percentDiscount': 2,
                'totalDiscount': 0.88,
                'dynamicDiscountRuleId': 'DynamicDiscount',
                'accountCode': 'Q002'
            }
        ],
        'providerOfferId': 'OFE_d1850d21-a151-450f-b41c-fcb647115b45_8',
        'privateFare': true,
        'offerType': '',
        'priceSpecialDiscount': {
            'totalDiscount': 0.88,
            'total': 63.34
        },
        'flightModificationOnDemand': false,
        'discountsApplied': {
            'originalPrice': {
                'fare': 44,
                'tax': 20.22,
                'total': 64.22,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'discounts': [
                {
                    'type': 'DYNAMIC_PRICING',
                    'description': 'Promoción especial',
                    'percentDiscount': 2,
                    'totalDiscount': 0.88,
                    'dynamicDiscountRuleId': 'DynamicDiscount',
                    'accountCode': 'Q002'
                }
            ],
            'originalOfferItems': [
                {
                    'offerItemId': 'IB2fc8e478d6ff4d14859106fa05537383OP_01',
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'price': {
                        'fare': 44,
                        'tax': 20.22,
                        'total': 64.22,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'detailedTaxes': [],
                    'reshopDetailedTaxes': [],
                    'fareComponents': [],
                    'surcharges': null
                }
            ],
            'totalDiscount': 0.88
        },
        'excludePenalties': false,
        'price': {
            'fare': 43.12,
            'tax': 20.22,
            'total': 63.34,
            'currency': 'EUR',
            'ticketingFee': 0
        }
    };
    let mockFareFamily = [
        {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TBAESEU',
            'commercialName': 'Básica',
            'commercialNameES': 'Básica',
            'priority': 900,
            'conditions': [
                {
                    'code': 'CABINA',
                    'name': 'Cabina',
                    'text': 'Turista.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Cabina Turista',
                        'message': 'Turista.',
                        'code': 'CA_Cabina_Turista',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': 'Incluida 1 pieza hasta 10 kg (56x40x25cm).',
                    'units': 1,
                    'extendedInfo': {
                        'title': 'Equipaje de mano: 1 pieza',
                        'message': 'Incluido 1 accesorio personal y 1 pieza hasta 10 kg (56x40x25cm), en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo. ',
                        'code': 'CA_EQP_MANO_10KG',
                        'conditionStatus': true,
                        'observationCode': '2'
                    }
                },
                {
                    'code': 'EQBODEGA',
                    'name': 'Equipaje en bodega',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Equipaje facturable no incluido',
                        'message': 'Con coste.',
                        'code': 'CA_1_PIEZAS_PAGO',
                        'conditionStatus': false,
                        'observationCode': '1'
                    }
                },
                {
                    'code': 'COMIDA',
                    'name': 'Comida',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Comida no incluida ',
                        'message': 'Con coste.',
                        'code': 'Comida_no_incluida',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'ASIENTO',
                    'name': 'Selección de asiento',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Selección de asiento con coste',
                        'message': 'Con coste. ',
                        'code': 'CA_Asiento_Pago',
                        'conditionStatus': false,
                        'observationCode': '3'
                    }
                },
                {
                    'code': 'ASIENTODELANTERO',
                    'name': 'Asiento delantero',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Asiento delantero con coste',
                        'message': 'Con coste.',
                        'code': 'CA_Asiento_Delantero_pago',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'ASIENTOXL',
                    'name': 'Selección de asiento XL',
                    'text': 'Con coste, salvo excepciones.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Asiento XL con coste',
                        'message': 'Con coste en vuelos operados por Iberia, Iberia Express e Iberia Regional Air Nostrum. Y sin coste en vuelos operados por British Airways.',
                        'code': 'CA_Asiento_XL_Pago',
                        'conditionStatus': false,
                        'observationCode': '3'
                    }
                },
                {
                    'code': 'EMBARQUE',
                    'name': 'Prioridad de Embarque',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Embarque prioritario no incluido',
                        'message': 'No incluido.',
                        'code': 'CA_Embarque_NO_Prioritario',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'CAMBIO',
                    'name': 'Cambios',
                    'text': 'Permitido con coste, no permitido en caso de no-show.',
                    'units': 65,
                    'extendedInfo': {
                        'title': 'Cambio de vuelo con coste',
                        'message': 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                        'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'REEMBOLSO',
                    'name': 'Reembolso (por sentido)',
                    'text': 'No permitido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'No permitido',
                        'message': 'No permitido.',
                        'code': 'CA_REEMBOLSO NO PERMITIDO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'TARJEMBANTIC',
                    'name': 'Tarjeta de embarque anticipada',
                    'text': 'No incluida.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Tarjeta de embarque anticipada no incluida',
                        'message': 'No incluida. ',
                        'code': 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'CHECKINDESK',
                    'name': 'Mostrador check-in exclusivo',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Mostrador Check-in exclusivo no incluido',
                        'message': 'No incluido.',
                        'code': 'Chek-in_desk_ NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'SALAVIP',
                    'name': 'Acceso a salas VIP',
                    'text': 'Acceso no incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Acceso a Sala Vip no incluido',
                        'message': 'Acceso no incluido.',
                        'code': 'Acceso a salas VIP No permitido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'FASTTRACK',
                    'name': 'Fast Track',
                    'text': 'No incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Fast Track no incluido',
                        'message': 'No incluido.',
                        'code': 'Fast Track NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'EQPPRIOR',
                    'name': 'Entrega prioritaria equipaje',
                    'text': 'Con coste.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'No incluye entrega rápida de equipaje',
                        'message': 'Con coste.',
                        'code': 'Entrega_prioritaria_equipaje_ NO',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'AVIO',
                    'name': 'AVIOS',
                    'text': 'Incluido.',
                    'units': null,
                    'extendedInfo': {
                        'title': 'Obtén Avios con tu compra',
                        'message': 'Incluido.  ',
                        'code': 'AVIOS incluido',
                        'conditionStatus': false,
                        'observationCode': null
                    }
                },
                {
                    'code': 'WIFI',
                    'name': 'WiFi',
                    'text': 'Disponible con coste, según el tipo de avión.',
                    'units': null,
                    'extendedInfo': {
                        'title': '',
                        'message': '',
                        'code': null,
                        'conditionStatus': false,
                        'observationCode': null
                    }
                }
            ],
            'observations': [
                {
                    'observationCode': 1,
                    'observationText': '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE" class="links">Consulte equipaje adicional<span class="oculto">[Abre en ventana nueva]</span></a>'
                },
                {
                    'observationCode': 2,
                    'observationText': '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías <strong>one</strong>world. En el resto debes consultar con la compañía operadora'
                },
                {
                    'observationCode': 3,
                    'observationText': '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE" class="links" title="Ver precios de la reserva de asiento">Más detalle sobre la reserva anticipada de asiento</a>'
                }
            ],
            'conditionsPriority': [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'ASIENTODELANTERO',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO',
                'CHECKINDESK',
                'FASTTRACK'
            ]
        }
    ];
    let mockAvailability = require('../../../../mocks/Responses/mockAvailability.json');
    let mockAvSelectedOffer = {
        price: {
            currency: 'EUR'
        }
    };
    let mockOfferData = {
        originDestinations: [
            {
                'priceDiscountApplied': true,
                'totalPrice': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'totalPriceDiscountData': {
                    'totalDiscount': 0.88,
                    'percentDiscount': 2,
                    'totalOriginal': 64.22
                },
                'adultPrice': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'adultPriceDiscountData': {
                    'totalDiscount': 0.88,
                    'percentDiscount': 2,
                    'totalOriginal': 64.22
                },
                'perPassengerPrice': {
                    'fare': 43.12,
                    'tax': 20.22,
                    'total': 63.34,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'originDestinationId': 'ODI_0',
                'applicableSlices': [
                    {
                        'sliceId': '0',
                        'remainingSeats': 9,
                        'segments': [
                            {
                                'segmentId': 'IB044820230216',
                                'fareFamily': 'TBAESEU',
                                'bookingCode': null,
                                'bookingClass': 'ECONOMY',
                                'rbd': 'Q',
                                'remainingSeats': 9,
                                'fareBasis': 'QZNOB4',
                                'extendedFareCode': 'QZNOB4',
                                'brandCode': null,
                                'checkedBaggageAllowanceKeys': [],
                                'carryOnBaggageAllowanceKeys': [],
                                'ticketDesignator': null,
                                'seatDisplays': null,
                                'cabinDescription': ''
                            }
                        ]
                    }
                ]
            }
        ]
    };

    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function (label) {
            return label;
        };
        switch (filter) {
                case 'translate':
                    filterFunc = function (label) {
                        return label;
                    };
                    break;
                case 'EliminateAccentFilter':
                    filterFunc = (label:string):string => {
                        label = label.replace(/[áàäâÁÀÄÂ]/g, 'a');
                        label = label.replace(/[éèëêÉÈËÊ]/g, 'e');
                        label = label.replace(/[íìïîÍÌÏÎ]/g, 'i');
                        label = label.replace(/[óòöôÓÒÖÔ]/g, 'o');
                        label = label.replace(/[úùüûÚÙÜÛ]/g, 'u');
                        label = label.replace(/[ñÑ]/g, 'n');
                        label = label.replace(/(\s)/g, '-');
                        return label.toLowerCase();
                    };

                    break;
                default:
                    break;
        }

        return filterFunc;
    });

    beforeEach(function () {
        angular.mock.module('ib-monetate-bki-module', 'LocalStorageModule', function ($provide) {
            $provide.value('localStorageService', localStorageService);
            $provide.value('$filter', $fakeFilter);
            $provide.value('MonetateConstants', fakeMonetateConstants);
        });
        inject(function (_MonetateTransformer_) {
            MonetateTransformer = _MonetateTransformer_;
        });
    });
    afterEach(()=>{

        localStorage.clear();
        sessionStorage.clear();

    });
    describe('when transformAncillariesInMonetateProductModel() is called,', function () {
        it('When there is no ancillaries', function () {
            var returnData = MonetateTransformer.transformAncillariesInMonetateProductModel(mockShoppingBasketNull);
            expect(returnData[0]).toEqual({ productId: 'PRIORIDAD', quantity: '0', unitPrice: 'NaN', currency: 'EUR', isAncillary: true });
            expect(returnData[1]).toEqual(undefined);
            expect(returnData[2]).toEqual(undefined);
            expect(returnData[3]).toEqual(undefined);
            expect(returnData[4]).toEqual(undefined);
            expect(returnData[4]).toEqual(undefined);
        });
        it('When there is ancillaries', function () {
            var returnData = MonetateTransformer.transformAncillariesInMonetateProductModel(mockShoppingBasketAncillaries);
            expect(returnData[0]).toEqual({ productId: 'MALETAS-EQUIPAJEEXTRA-15', quantity: '1', unitPrice: '13', currency: 'EUR', isAncillary: true });
            expect(returnData[1]).toEqual({ productId: 'ASIENTO-XL', unitPrice: '13.2', quantity: '1', currency: 'EUR', isAncillary: true });
            expect(returnData[2]).toEqual({ productId: 'SEGURO-ANULACION', unitPrice: '9.33', quantity: '1', currency: 'EUR', isAncillary: true });
            expect(returnData[3]).toEqual({ productId: 'MALETAS-EQUIPAJEESPECIAL-BIKE', unitPrice: '40', quantity: '1', currency: 'EUR', isAncillary: true });
            expect(returnData[4]).toEqual({ productId: 'PRIORIDAD', quantity: '1', unitPrice: '6', currency: 'EUR', isAncillary: true });
        });
    });
    describe('when transformPassengersInMonetateProductModel() is called,', function () {
        it('there is no child, infant, resident or largeFamily', function () {
            var returnData = MonetateTransformer.transformPassengersInMonetateProductModel(mockFlightPassengersInfo);
            expect(returnData[0]).toEqual({ productId: 'V-MENOR', quantity: '1', unitPrice: '0' });
            expect(returnData[1]).toEqual({ productId: 'V-INFANT', quantity: '1', unitPrice: '0' });
            expect(returnData[2]).toEqual({ productId: 'V-RES-BALE', quantity: '1', unitPrice: '0' });
            expect(returnData[3]).toEqual({ productId: 'V-FAMNUM-GRAL', quantity: '1', unitPrice: '0' });
        });
    });
    describe('when transformCabinInMonetateProductModel() is called,', function () {
        it('', function () {
            var returnData = MonetateTransformer.transformCabinInMonetateProductModel(mockSelectedTripInfo);
            expect(returnData[0]).toEqual({ productId: 'V-CABINA-TURISTA', quantity: '1', unitPrice: '0', isAncillary: false });
            expect(returnData[1]).toEqual({ productId: undefined, quantity: '1', unitPrice: '0', isAncillary: false });
        });
    });
    describe('when transformFareDataInProductModel() is called,', function () {
        it('', function () {
            var returnData = MonetateTransformer.transformFareDataInProductModel(mockFareFamilyInfo);
            expect(returnData[0]).toEqual({ productId: 'V-TARIF-TURIST-BASICA', quantity: '1', unitPrice: '0', isAncillary: false });
        });
    });
    describe('when transformDestinationAreasCitiesListInProductModel() is called,', function () {
        it('', function () {
            var returnData = MonetateTransformer.transformDestinationAreasCitiesListInProductModel(mockDestinationAreas, mockDestinationCountryCollection);
            expect(returnData[0]).toEqual({ productId: 'VD-ESPANA', quantity: '1', unitPrice: '0', isAncillary: false });
        });
    });
    describe('when transformPurchasedInfoInProductModel() is called,', function () {
        beforeEach(()=>{
            localStorageService.set('fareData', mockFareData);
            localStorageService.set('addedCartProducts', mockAddedCartProducts);
        });
        it('', function () {

            var returnData = MonetateTransformer.transformPurchasedInfoInProductModel(mockConfirmationInfo);
            expect(returnData[0]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'IB044820230216', currency: 'EUR' });
            expect(returnData[1]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'V-CABINA-TURISTA', currency: 'EUR' });
            expect(returnData[2]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'V-TARIF-ECONOMICA', currency: 'EUR' });
            expect(returnData[3]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'V-TARIF-TURIST-BASICA', currency: 'EUR' });
            expect(returnData[4]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'VD-ESPANA', currency: 'EUR' });
            expect(returnData[5]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'MALETAS-EQUIPAJEEXTRA-15', currency: 'EUR' });
            expect(returnData[6]).toEqual({ purchaseId: 'L79XQ', quantity: '1', unitPrice: '0', productId: 'MALETAS-EQUIPAJEESPECIAL-BIKE', currency: 'EUR' });
            expect(returnData[7]).toEqual({ purchaseId: 'L79XQ', quantity: '0', unitPrice: '0', productId: 'PRIORIDAD', currency: 'EUR' });
        });
    });
    describe('when transformOriginDestinationInfoIntoTripType() is called', function () {
        it('and it is winter ', function () {
            var returnData = MonetateTransformer.transformOriginDestinationInfoIntoTripType(mockOriginDestinationWinter);
            expect(returnData[0]).toEqual({ productId: 'V-VAC-INVIERNO', quantity: '1', unitPrice: '0', isAncillary: false });
        });
        it('and it is summer ', function () {
            var returnData = MonetateTransformer.transformOriginDestinationInfoIntoTripType(mockOriginDestinationSummer);
            expect(returnData[0]).toEqual({ productId: 'V-VAC-VERANO', quantity: '1', unitPrice: '0', isAncillary: false });
        });
        xit('and it is weekend ', function () {
            var returnData = MonetateTransformer.transformOriginDestinationInfoIntoTripType(mockOriginDestinationWeekend);
            expect(returnData[0]).toEqual({ productId: 'V-NEGOCIOS', quantity: '1', unitPrice: '0', isAncillary: false });
        });
        it('and it is default date ', function () {
            var returnData = MonetateTransformer.transformOriginDestinationInfoIntoTripType(mockOriginDestinationInfo);
            expect(returnData[0]).toEqual({ productId: 'V-NEGOCIOS', quantity: '1', unitPrice: '0', isAncillary: false });
        });
    });
    describe('when createFlightReviewMonetate() is called,', function () {
        beforeEach(()=>{
            localStorageService.set('fareData', mockFareData);
        });
        it('', function () {
            var returnData = MonetateTransformer.createFlightReviewMonetate(mockData, mockPassengers, mockSelectedSlices, mockCurrency, mockFareFamily);
            expect(returnData[0]).toEqual('addFlightReview');
            expect(returnData[1]).toEqual({ adults: [1], depDate: ['20230216'], destination: ['BIO'], origin: ['MAD'], serviceClass: ['Economy'], travelers: [1] });
            expect(returnData[2]).toEqual('MADBIO');
            expect(returnData[3]).toEqual(1);
            expect(returnData[4]).toEqual(63.34);
            expect(returnData[5]).toEqual('EUR');
        });
    });
    describe('when createFlightSearchMonetate() is called,', function () {
        it('', function () {
            var returnData = MonetateTransformer.createFlightSearchMonetate(mockData, mockPassengers, mockAvailability);
            expect(returnData[0]).toEqual('addFlightSearch');
            expect(returnData[1]).toEqual({ adults: [1], depDate: ['20230216'], destination: ['BIO'], origin: ['MAD'], serviceClass: ['Economy', 'Business'], travelers: [1] });
        });
    });
    describe('when createFlightBookingMonetate() is called,', function () {
        beforeEach(()=>{
            localStorageService.set('avSelectedOffer', mockAvSelectedOffer);
            localStorageService.set('flightIdentifier', 'MADBIO');
            localStorageService.set('fareData', mockFareData);
        });
        it('', function () {
            var returnData = MonetateTransformer.createFlightBookingMonetate(mockData, mockPassengers, mockConfirmationInfo, mockFareFamilyInfo);
            expect(returnData[0]).toEqual('addFlightBooking');
            expect(returnData[1]).toEqual({ adults: [1], depDate: ['20230216'], destination: ['BIO'], origin: ['MAD'], serviceClass: ['Economy'], travelers: [1] });
            expect(returnData[2]).toEqual('L79XQ');
            expect(returnData[3]).toEqual('MADBIO');
            expect(returnData[4]).toEqual(1);
            expect(returnData[5]).toEqual(117.22);
            expect(returnData[6]).toEqual('EUR');
        });
    });
    describe('when transformSelectedOfferInProductModel() is called,', function () {
        it('', function () {
            var returnData = MonetateTransformer.transformSelectedOfferInProductModel(mockSelectedSlices, mockOfferData);
            expect(returnData).toEqual([{ productId: 'IB044820230216', quantity: '1', unitPrice: '0', currency: 'EUR' }]);
        });
    });
});