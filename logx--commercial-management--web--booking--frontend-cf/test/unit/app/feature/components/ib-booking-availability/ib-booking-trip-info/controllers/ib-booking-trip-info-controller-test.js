describe('BookingTripInfoController test', function () {

    var controller, orderByFilter, localStorageService, response;
    var bindings = {
        'currencies':{'EUR': {}},
        'currencie':'EUR',
        tripInfoModel: [1, 2, 3, 5, 6, 8, 4]
    };
    var controllerDependencies = {
        '$scope': {}
    };
    var fakeBookingModalService = {
        showFilterModal: jasmine.createSpy('showFilterModal').and.callFake(function () {
            return { 'result': { 'then': function () { } } };
        }),
    };
    var fakeCurrencyService = { 'getCurrenciesAsMap': jasmine.createSpy(), 'formatPrice': jasmine.createSpy(), 'getCurrencyObject': jasmine.createSpy(), 'getPriceByRoundingPolicy': jasmine.createSpy() };
    var fakeDatalayerUtilsService = {
        'addDataLayerInfo': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
    };
    var fakeValue = {
        'sliceId': '1',
        'arrivalDateTime': '2020-02-12 20:50',
        'departureDateTime': '2020-02-12 17:40',
        'cashAvios': 1000,
        'stopsNumber1': {
            'enable': true
        },
        'segments': [
            {
                'segmentId': 'IB395120200212',
                'departureDateTime': '2020-02-12 17:40',
                'arrivalDateTime': '2020-02-12 18:45',
                'departure': {
                    'airport': {
                        'code': 'SVQ',
                        'description': 'Sevilla'
                    },
                    'city': {
                        'code': 'SVQ',
                        'description': 'Sevilla',
                        'geolocation': {
                            'latitude': 37.433333,
                            'longitude': -5.9
                        }
                    },
                    'country': {
                        'code': 'ES',
                        'description': 'España'
                    }
                },
                'arrival': {
                    'airport': {
                        'code': 'MAD',
                        'description': 'Madrid'
                    },
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'geolocation': {
                            'latitude': 40.466666,
                            'longitude': -3.566666
                        }
                    },
                    'country': {
                        'code': 'ES',
                        'description': 'España'
                    },
                    'terminal': '4'
                },
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'I2',
                        'name': 'Iberia Express'
                    },
                    'marketingFlightNumber': '3951',
                    'operationalFlightNumber': null,
                    'operationalDisclosure': 'I2',
                    'aircraft': {
                        'code': '32A',
                        'description': 'Airbus A320'
                    }
                },
                'overnight': false,
                'waitingTime': 0,
                'duration': 65,
                'offers': [
                    {
                        'offerId': 'IB395120200212U',
                        'bookingClass': 'BUSINESS',
                        'bookingCode': 'B',
                        'fareFamily': 'U',
                        'rbd': 'U',
                        'remainingSeats': 2,
                        'fareBasis': 'UDFF',
                        'totalPrice': null,
                        'adultPrice': null
                    },
                    {
                        'offerId': 'IB395120200212G',
                        'bookingClass': 'TOURIST',
                        'bookingCode': 'E',
                        'fareFamily': 'T',
                        'rbd': 'G',
                        'remainingSeats': 9,
                        'fareBasis': 'GDFF',
                        'totalPrice': null,
                        'adultPrice': null
                    },
                    {
                        'offerId': 'IB395120200212X',
                        'bookingClass': 'ECONOMY',
                        'bookingCode': 'E',
                        'fareFamily': 'X',
                        'rbd': 'X',
                        'remainingSeats': 2,
                        'fareBasis': 'XDFF',
                        'totalPrice': null,
                        'adultPrice': null
                    }
                ],
                'showFares': false,
                'durationParsed': '1h 5min.',
                'waitingTimeParsed': '',
                'departureDateTimeParsed': '17:40',
                'departureDateParsed': {
                    'dateTime': '17:40',
                    'weekDay': 'WEEKDAY_WEDNESDAY',
                    'hour': 1,
                    'minutes': 0,
                    'day': 12,
                    'monthNumber': 2,
                    'month': 'MONTH_FEBRUARY',
                    'year': 2020,
                    'formatedDate': '2020-02-12 17:40'
                },
                'arrivalDateTimeParsed': '18:45',
                'companyURL': '/aerolineas/logo_pos_I2.svg',
                'cabins': {
                    'E': {
                        'fareFamilies': [
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'T',
                                'commercialName': 'Turista',
                                'commercialNameES': 'Turista',
                                'priority': 30,
                                'conditions': [
                                    {
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'text': 'Turista',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Turista',
                                            'code': 'CA_Cabina_Turista',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'text': '1 bulto',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 bulto en cabina',
                                            'message': '1 bulto/ 56x45x25cm',
                                            'code': 'CA_EQP_MANO_10KG',
                                            'conditionStatus': true,
                                            'observationCode': '1'
                                        }
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': '1 pieza.',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 equipaje en bodega',
                                            'message': 'Incluido: 1 pieza',
                                            'code': 'CA_1_PIEZAS',
                                            'conditionStatus': true,
                                            'observationCode': '2'
                                        }
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos antes de la salida del vuelo. Solo permitido en vuelos IB, YW, I2 y BA.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido',
                                            'message': 'Permitidos antes de la salida del vuelo. Solo permitido en vuelos IB, YW, I2 y BA.',
                                            'code': 'CA_RBD_2020_TURISTA_EXTRA_CAMBIO',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX.Solo permitidos en vuelos IB, YW, I2 y BA.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido',
                                            'message': 'Permitidos hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX.Sólo permitidos en vuelos IB, YW,I2 y BA. ',
                                            'code': 'CA_RBD_2020_TURISTA_EXTRA_REEMBOLSO',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        }
                                    }
                                ],
                                'observations': [
                                    {
                                        'observationCode': 1,
                                        'observationText': {

                                        }
                                    },
                                    {
                                        'observationCode': 2,
                                        'observationText': {

                                        }
                                    }
                                ],
                                'conditionsPriority': [
                                    'EQMANO',
                                    'EQBODEGA',
                                    'COMIDA',
                                    'ASIENTO',
                                    'CAMBIO',
                                    'REEMBOLSO'
                                ],
                                'offers': [
                                    {
                                        'offerId': 'IB395120200212G',
                                        'bookingClass': 'TOURIST',
                                        'bookingCode': 'E',
                                        'fareFamily': 'T',
                                        'rbd': 'G',
                                        'remainingSeats': 9,
                                        'fareBasis': 'GDFF',
                                        'totalPrice': null,
                                        'adultPrice': null
                                    }
                                ],
                                'remainingSeats': 9
                            },
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'X',
                                'commercialName': 'Azul',
                                'commercialNameES': 'Azul',
                                'priority': 20,
                                'conditions': [
                                    {
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'text': 'Turista',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Turista',
                                            'code': 'CA_Cabina_Turista',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'text': '1 bulto',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 bulto en cabina',
                                            'message': '1 bulto/ 56x45x25cm',
                                            'code': 'CA_EQP_MANO_10KG',
                                            'conditionStatus': true,
                                            'observationCode': '1'
                                        }
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': '1 pieza.',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 equipaje en bodega',
                                            'message': 'Incluido: 1 pieza',
                                            'code': 'CA_1_PIEZAS',
                                            'conditionStatus': true,
                                            'observationCode': '2'
                                        }
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos antes de la salida del vuelo con un cargo de 25€.Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                            'code': 'CA_RBD_2020_AZUL_CAMBIO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido con coste',
                                            'message': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                            'code': 'CA_RBD_2020_AZUL_REEMBOLSO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    }
                                ],
                                'observations': [
                                    {
                                        'observationCode': 1,
                                        'observationText': {

                                        }
                                    },
                                    {
                                        'observationCode': 2,
                                        'observationText': {

                                        }
                                    }
                                ],
                                'conditionsPriority': [
                                    'EQMANO',
                                    'EQBODEGA',
                                    'COMIDA',
                                    'ASIENTO',
                                    'CAMBIO',
                                    'REEMBOLSO'
                                ],
                                'offers': [
                                    {
                                        'offerId': 'IB395120200212X',
                                        'bookingClass': 'ECONOMY',
                                        'bookingCode': 'E',
                                        'fareFamily': 'X',
                                        'rbd': 'X',
                                        'remainingSeats': 2,
                                        'fareBasis': 'XDFF',
                                        'totalPrice': null,
                                        'adultPrice': null
                                    }
                                ],
                                'remainingSeats': 2
                            }
                        ],
                        'cabinType': 'E',
                        'cabinDescription': 'Turista',
                        'cabinAvailable': true,
                        'bestPrice': {

                        },
                        'isCabinCompatible': true
                    },
                    'B': {
                        'fareFamilies': [
                            {
                                'cabinType': 'B',
                                'cabinDescription': 'Business Class',
                                'commercialCode': 'U',
                                'commercialName': 'Business',
                                'commercialNameES': 'Business',
                                'priority': 50,
                                'conditions': [
                                    {
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'text': 'Business',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Business',
                                            'code': 'CA_Cabina_Busines',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'text': '2 bultos',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': '2 bultos en cabina',
                                            'message': '2 bultos / 55x40x20cm. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/EQUIMA&cntId=EQUIMA&market=IL&language=es\'>Política equipaje de mano</a>',
                                            'code': 'CA_EQP_MANO_BUSINESS',
                                            'conditionStatus': true,
                                            'observationCode': '1'
                                        }
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': '2 piezas',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': '2 equipajes en bodega ',
                                            'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                            'code': 'CA_2_PIEZAS',
                                            'conditionStatus': true,
                                            'observationCode': '2'
                                        }
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                            'code': 'CA_RBD_2020_BUSINESS_CAMBIO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido con coste ',
                                            'message': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                            'code': 'CA_RBD_2020_BUSINESS_REEMBOLSO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    }
                                ],
                                'observations': [
                                    {
                                        'observationCode': 1,
                                        'observationText': {

                                        }
                                    },
                                    {
                                        'observationCode': 2,
                                        'observationText': {

                                        }
                                    }
                                ],
                                'conditionsPriority': [
                                    'EQMANO',
                                    'EQBODEGA',
                                    'COMIDA',
                                    'ASIENTO',
                                    'CAMBIO',
                                    'REEMBOLSO'
                                ],
                                'offers': [
                                    {
                                        'offerId': 'IB395120200212U',
                                        'bookingClass': 'BUSINESS',
                                        'bookingCode': 'B',
                                        'fareFamily': 'U',
                                        'rbd': 'U',
                                        'remainingSeats': 2,
                                        'fareBasis': 'UDFF',
                                        'totalPrice': null,
                                        'adultPrice': null
                                    }
                                ],
                                'remainingSeats': 2
                            }
                        ],
                        'cabinType': 'B',
                        'cabinDescription': 'Business Class',
                        'cabinAvailable': true,
                        'bestPrice': {

                        },
                        'isCabinCompatible': true
                    }
                },
                'cabinsLength': 2,
                'warnings': [

                ],
                'terminalChange': {
                    'show': false
                },
                'airportChange': {
                    'show': false
                },
                'scaleWaitingTime': {
                    'show': false
                },
                'nightFlight': {
                    'isOverNight': false
                },
                '$$hashKey': 'object:81'
            },
            {
                'segmentId': 'IB044020200212',
                'departureDateTime': '2020-02-12 19:45',
                'arrivalDateTime': '2020-02-12 20:50',
                'departure': {
                    'airport': {
                        'code': 'MAD',
                        'description': 'Madrid'
                    },
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'geolocation': {
                            'latitude': 40.466666,
                            'longitude': -3.566666
                        },
                        '$$hashKey': 'object:79'
                    },
                    'country': {
                        'code': 'ES',
                        'description': 'España'
                    },
                    'terminal': '4'
                },
                'arrival': {
                    'airport': {
                        'code': 'BIO',
                        'description': 'Bilbao'
                    },
                    'city': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'geolocation': {
                            'latitude': 43.3,
                            'longitude': -2.916666
                        }
                    },
                    'country': {
                        'code': 'ES',
                        'description': 'España'
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
                    'marketingFlightNumber': '440',
                    'operationalFlightNumber': null,
                    'operationalDisclosure': 'IB',
                    'aircraft': {
                        'code': '32A',
                        'description': 'Airbus A320'
                    }
                },
                'overnight': false,
                'waitingTime': 0,
                'duration': 65,
                'offers': [
                    {
                        'offerId': 'IB044020200212U',
                        'bookingClass': 'BUSINESS',
                        'bookingCode': 'B',
                        'fareFamily': 'U',
                        'rbd': 'U',
                        'remainingSeats': 2,
                        'fareBasis': 'UDFF',
                        'totalPrice': null,
                        'adultPrice': null
                    },
                    {
                        'offerId': 'IB044020200212G',
                        'bookingClass': 'TOURIST',
                        'bookingCode': 'E',
                        'fareFamily': 'T',
                        'rbd': 'G',
                        'remainingSeats': 9,
                        'fareBasis': 'GDFF',
                        'totalPrice': null,
                        'adultPrice': null
                    },
                    {
                        'offerId': 'IB044020200212X',
                        'bookingClass': 'ECONOMY',
                        'bookingCode': 'E',
                        'fareFamily': 'X',
                        'rbd': 'X',
                        'remainingSeats': 4,
                        'fareBasis': 'XDFF',
                        'totalPrice': null,
                        'adultPrice': null
                    }
                ],
                'showFares': false,
                'durationParsed': '1h 5min.',
                'waitingTimeParsed': '',
                'departureDateTimeParsed': '19:45',
                'departureDateParsed': {
                    'dateTime': '19:45',
                    'weekDay': 'WEEKDAY_WEDNESDAY',
                    'hour': 1,
                    'minutes': 0,
                    'day': 12,
                    'monthNumber': 2,
                    'month': 'MONTH_FEBRUARY',
                    'year': 2020,
                    'formatedDate': '2020-02-12 19:45'
                },
                'arrivalDateTimeParsed': '20:50',
                'companyURL': '/aerolineas/logo_pos_IB.svg',
                'cabins': {
                    'E': {
                        'fareFamilies': [
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'T',
                                'commercialName': 'Turista',
                                'commercialNameES': 'Turista',
                                'priority': 30,
                                'conditions': [
                                    {
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'text': 'Turista',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Turista',
                                            'code': 'CA_Cabina_Turista',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'text': '1 bulto',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 bulto en cabina',
                                            'message': '1 bulto/ 56x45x25cm',
                                            'code': 'CA_EQP_MANO_10KG',
                                            'conditionStatus': true,
                                            'observationCode': '1'
                                        }
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': '1 pieza.',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 equipaje en bodega',
                                            'message': 'Incluido: 1 pieza',
                                            'code': 'CA_1_PIEZAS',
                                            'conditionStatus': true,
                                            'observationCode': '2'
                                        }
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos antes de la salida del vuelo. Solo permitido en vuelos IB, YW, I2 y BA.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido',
                                            'message': 'Permitidos antes de la salida del vuelo. Solo permitido en vuelos IB, YW, I2 y BA.',
                                            'code': 'CA_RBD_2020_TURISTA_EXTRA_CAMBIO',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX.Solo permitidos en vuelos IB, YW, I2 y BA.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido',
                                            'message': 'Permitidos hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX.Sólo permitidos en vuelos IB, YW,I2 y BA. ',
                                            'code': 'CA_RBD_2020_TURISTA_EXTRA_REEMBOLSO',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        }
                                    }
                                ],
                                'observations': [
                                    {
                                        'observationCode': 1,
                                        'observationText': {

                                        }
                                    },
                                    {
                                        'observationCode': 2,
                                        'observationText': {

                                        }
                                    }
                                ],
                                'conditionsPriority': [
                                    'EQMANO',
                                    'EQBODEGA',
                                    'COMIDA',
                                    'ASIENTO',
                                    'CAMBIO',
                                    'REEMBOLSO'
                                ],
                                'offers': [
                                    {
                                        'offerId': 'IB044020200212G',
                                        'bookingClass': 'TOURIST',
                                        'bookingCode': 'E',
                                        'fareFamily': 'T',
                                        'rbd': 'G',
                                        'remainingSeats': 9,
                                        'fareBasis': 'GDFF',
                                        'totalPrice': null,
                                        'adultPrice': null
                                    }
                                ],
                                'remainingSeats': 9
                            },
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'X',
                                'commercialName': 'Azul',
                                'commercialNameES': 'Azul',
                                'priority': 20,
                                'conditions': [
                                    {
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'text': 'Turista',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Turista',
                                            'code': 'CA_Cabina_Turista',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'text': '1 bulto',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 bulto en cabina',
                                            'message': '1 bulto/ 56x45x25cm',
                                            'code': 'CA_EQP_MANO_10KG',
                                            'conditionStatus': true,
                                            'observationCode': '1'
                                        }
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': '1 pieza.',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '1 equipaje en bodega',
                                            'message': 'Incluido: 1 pieza',
                                            'code': 'CA_1_PIEZAS',
                                            'conditionStatus': true,
                                            'observationCode': '2'
                                        }
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos antes de la salida del vuelo con un cargo de 25€.Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                            'code': 'CA_RBD_2020_AZUL_CAMBIO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido con coste',
                                            'message': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                            'code': 'CA_RBD_2020_AZUL_REEMBOLSO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    }
                                ],
                                'observations': [
                                    {
                                        'observationCode': 1,
                                        'observationText': {

                                        }
                                    },
                                    {
                                        'observationCode': 2,
                                        'observationText': {

                                        }
                                    }
                                ],
                                'conditionsPriority': [
                                    'EQMANO',
                                    'EQBODEGA',
                                    'COMIDA',
                                    'ASIENTO',
                                    'CAMBIO',
                                    'REEMBOLSO'
                                ],
                                'offers': [
                                    {
                                        'offerId': 'IB044020200212X',
                                        'bookingClass': 'ECONOMY',
                                        'bookingCode': 'E',
                                        'fareFamily': 'X',
                                        'rbd': 'X',
                                        'remainingSeats': 4,
                                        'fareBasis': 'XDFF',
                                        'totalPrice': null,
                                        'adultPrice': null
                                    }
                                ],
                                'remainingSeats': 4
                            }
                        ],
                        'cabinType': 'E',
                        'cabinDescription': 'Turista',
                        'cabinAvailable': true,
                        'bestPrice': {

                        },
                        'isCabinCompatible': true
                    },
                    'B': {
                        'fareFamilies': [
                            {
                                'cabinType': 'B',
                                'cabinDescription': 'Business Class',
                                'commercialCode': 'U',
                                'commercialName': 'Business',
                                'commercialNameES': 'Business',
                                'priority': 50,
                                'conditions': [
                                    {
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'text': 'Business',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Business',
                                            'code': 'CA_Cabina_Busines',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'text': '2 bultos',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': '2 bultos en cabina',
                                            'message': '2 bultos / 55x40x20cm. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/EQUIMA&cntId=EQUIMA&market=IL&language=es\'>Política equipaje de mano</a>',
                                            'code': 'CA_EQP_MANO_BUSINESS',
                                            'conditionStatus': true,
                                            'observationCode': '1'
                                        }
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': '2 piezas',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': '2 equipajes en bodega ',
                                            'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                            'code': 'CA_2_PIEZAS',
                                            'conditionStatus': true,
                                            'observationCode': '2'
                                        }
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                            'code': 'CA_RBD_2020_BUSINESS_CAMBIO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                        'units': 2,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido con coste ',
                                            'message': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                            'code': 'CA_RBD_2020_BUSINESS_REEMBOLSO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        }
                                    }
                                ],
                                'observations': [
                                    {
                                        'observationCode': 1,
                                        'observationText': {

                                        }
                                    },
                                    {
                                        'observationCode': 2,
                                        'observationText': {

                                        }
                                    }
                                ],
                                'conditionsPriority': [
                                    'EQMANO',
                                    'EQBODEGA',
                                    'COMIDA',
                                    'ASIENTO',
                                    'CAMBIO',
                                    'REEMBOLSO'
                                ],
                                'offers': [
                                    {
                                        'offerId': 'IB044020200212U',
                                        'bookingClass': 'BUSINESS',
                                        'bookingCode': 'B',
                                        'fareFamily': 'U',
                                        'rbd': 'U',
                                        'remainingSeats': 2,
                                        'fareBasis': 'UDFF',
                                        'totalPrice': null,
                                        'adultPrice': null
                                    }
                                ],
                                'remainingSeats': 2
                            }
                        ],
                        'cabinType': 'B',
                        'cabinDescription': 'Business Class',
                        'cabinAvailable': true,
                        'bestPrice': {

                        },
                        'isCabinCompatible': true
                    }
                },
                'cabinsLength': 2,
                'warnings': [

                ],
                'terminalChange': {
                    'show': false
                },
                'airportChange': {
                    'show': false
                },
                'scaleWaitingTime': {
                    'isImportant': false,
                    'show': true,
                    'isLong': false
                },
                'nightFlight': {
                    'isOverNight': false
                },
                '$$hashKey': 'object:82'
            }
        ],
        'duration': 190,
        'overnight': false,
        'provider': 'AWS',
        'stopsNumber': 1,
        'bestPrice': false,
        'showFares': false,
        'durationParsed': '3h 10min.',
        'departureDateTimeParsed': '17:40',
        'departureDateParsed': {
            'dateTime': '17:40',
            'weekDay': 'WEEKDAY_WEDNESDAY',
            'hour': 1,
            'minutes': 0,
            'day': 12,
            'monthNumber': 2,
            'month': 'MONTH_FEBRUARY',
            'year': 2020,
            'formatedDate': '2020-02-12 17:40'
        },
        'arrivalDateTimeParsed': '20:50',
        'daysOfTravel': 0,
        'allOperatedBy': [
            'Iberia Express',
            'Iberia'
        ],
        'originCity': {
            'code': 'SVQ',
            'description': 'Sevilla',
            'geolocation': null,
            'countryCode': 'ES'
        },
        'destinationCity': {
            'code': 'BIO',
            'description': 'Bilbao',
            'geolocation': null,
            'countryCode': 'ES'
        },
        'stopOverCities': [
            {
                'code': 'MAD',
                'description': 'Madrid',
                'geolocation': {
                    'latitude': 40.466666,
                    'longitude': -3.566666
                },
                '$$hashKey': 'object:79'
            }
        ],
        'sliceURL': '/aerolineas/logo_pos_I2.svg',
        'sliceSelectedSegments': 0,
        'cabins': {
            'E': {
                'fareFamilies': [
                    {
                        'cabinType': 'E',
                        'cabinDescription': 'Turista',
                        'commercialCode': 'T',
                        'commercialName': 'Turista',
                        'commercialNameES': 'Turista',
                        'priority': 30,
                        'conditions': [
                            {
                                'code': 'CABINA',
                                'name': 'Cabina',
                                'text': 'Turista',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'Turista',
                                    'code': 'CA_Cabina_Turista',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            },
                            {
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'text': '1 bulto',
                                'units': 1,
                                'extendedInfo': {
                                    'title': '1 bulto en cabina',
                                    'message': '1 bulto/ 56x45x25cm',
                                    'code': 'CA_EQP_MANO_10KG',
                                    'conditionStatus': true,
                                    'observationCode': '1'
                                }
                            },
                            {
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'text': '1 pieza.',
                                'units': 1,
                                'extendedInfo': {
                                    'title': '1 equipaje en bodega',
                                    'message': 'Incluido: 1 pieza',
                                    'code': 'CA_1_PIEZAS',
                                    'conditionStatus': true,
                                    'observationCode': '2'
                                }
                            },
                            {
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'text': 'Permitidos antes de la salida del vuelo. Solo permitido en vuelos IB, YW, I2 y BA.',
                                'units': 2,
                                'extendedInfo': {
                                    'title': 'Cambio permitido',
                                    'message': 'Permitidos antes de la salida del vuelo. Solo permitido en vuelos IB, YW, I2 y BA.',
                                    'code': 'CA_RBD_2020_TURISTA_EXTRA_CAMBIO',
                                    'conditionStatus': true,
                                    'observationCode': null
                                }
                            },
                            {
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'text': 'Permitidos hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX.Solo permitidos en vuelos IB, YW, I2 y BA.',
                                'units': 2,
                                'extendedInfo': {
                                    'title': 'Reembolso permitido',
                                    'message': 'Permitidos hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX.Sólo permitidos en vuelos IB, YW,I2 y BA. ',
                                    'code': 'CA_RBD_2020_TURISTA_EXTRA_REEMBOLSO',
                                    'conditionStatus': true,
                                    'observationCode': null
                                }
                            }
                        ],
                        'observations': [
                            {
                                'observationCode': 1,
                                'observationText': {

                                }
                            },
                            {
                                'observationCode': 2,
                                'observationText': {

                                }
                            }
                        ],
                        'conditionsPriority': [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        'offers': [
                            {
                                'offerId': 'IB395120200212G',
                                'bookingClass': 'TOURIST',
                                'bookingCode': 'E',
                                'fareFamily': 'T',
                                'rbd': 'G',
                                'remainingSeats': 9,
                                'fareBasis': 'GDFF',
                                'totalPrice': null,
                                'adultPrice': null
                            }
                        ],
                        'remainingSeats': 9
                    },
                    {
                        'cabinType': 'E',
                        'cabinDescription': 'Turista',
                        'commercialCode': 'X',
                        'commercialName': 'Azul',
                        'commercialNameES': 'Azul',
                        'priority': 20,
                        'conditions': [
                            {
                                'code': 'CABINA',
                                'name': 'Cabina',
                                'text': 'Turista',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'Turista',
                                    'code': 'CA_Cabina_Turista',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            },
                            {
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'text': '1 bulto',
                                'units': 1,
                                'extendedInfo': {
                                    'title': '1 bulto en cabina',
                                    'message': '1 bulto/ 56x45x25cm',
                                    'code': 'CA_EQP_MANO_10KG',
                                    'conditionStatus': true,
                                    'observationCode': '1'
                                }
                            },
                            {
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'text': '1 pieza.',
                                'units': 1,
                                'extendedInfo': {
                                    'title': '1 equipaje en bodega',
                                    'message': 'Incluido: 1 pieza',
                                    'code': 'CA_1_PIEZAS',
                                    'conditionStatus': true,
                                    'observationCode': '2'
                                }
                            },
                            {
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'text': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                'units': 2,
                                'extendedInfo': {
                                    'title': 'Cambio permitido con coste',
                                    'message': 'Permitidos antes de la salida del vuelo con un cargo de 25€.Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                    'code': 'CA_RBD_2020_AZUL_CAMBIO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            },
                            {
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'text': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                'units': 2,
                                'extendedInfo': {
                                    'title': 'Reembolso permitido con coste',
                                    'message': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                    'code': 'CA_RBD_2020_AZUL_REEMBOLSO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            }
                        ],
                        'observations': [
                            {
                                'observationCode': 1,
                                'observationText': {

                                }
                            },
                            {
                                'observationCode': 2,
                                'observationText': {

                                }
                            }
                        ],
                        'conditionsPriority': [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        'offers': [
                            {
                                'offerId': 'IB395120200212X',
                                'bookingClass': 'ECONOMY',
                                'bookingCode': 'E',
                                'fareFamily': 'X',
                                'rbd': 'X',
                                'remainingSeats': 2,
                                'fareBasis': 'XDFF',
                                'totalPrice': null,
                                'adultPrice': null
                            }
                        ],
                        'remainingSeats': 2
                    }
                ],
                'cabinType': 'E',
                'cabinDescription': 'Turista',
                'cabinAvailable': true,
                'bestPrice': {

                },
                'isCabinCompatible': true
            },
            'B': {
                'fareFamilies': [
                    {
                        'cabinType': 'B',
                        'cabinDescription': 'Business Class',
                        'commercialCode': 'U',
                        'commercialName': 'Business',
                        'commercialNameES': 'Business',
                        'priority': 50,
                        'conditions': [
                            {
                                'code': 'CABINA',
                                'name': 'Cabina',
                                'text': 'Business',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'Business',
                                    'code': 'CA_Cabina_Busines',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            },
                            {
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'text': '2 bultos',
                                'units': 2,
                                'extendedInfo': {
                                    'title': '2 bultos en cabina',
                                    'message': '2 bultos / 55x40x20cm. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/EQUIMA&cntId=EQUIMA&market=IL&language=es\'>Política equipaje de mano</a>',
                                    'code': 'CA_EQP_MANO_BUSINESS',
                                    'conditionStatus': true,
                                    'observationCode': '1'
                                }
                            },
                            {
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'text': '2 piezas',
                                'units': 2,
                                'extendedInfo': {
                                    'title': '2 equipajes en bodega ',
                                    'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                    'code': 'CA_2_PIEZAS',
                                    'conditionStatus': true,
                                    'observationCode': '2'
                                }
                            },
                            {
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'text': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                'units': 2,
                                'extendedInfo': {
                                    'title': 'Cambio permitido con coste',
                                    'message': 'Permitidos antes de la salida del vuelo con un cargo de 25€. Sólo permitido en vuelos IB, YW, I2 y BA (excepto vuelos 5xxx)',
                                    'code': 'CA_RBD_2020_BUSINESS_CAMBIO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            },
                            {
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'text': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                'units': 2,
                                'extendedInfo': {
                                    'title': 'Reembolso permitido con coste ',
                                    'message': 'Permitidos con un cargo de 25€ hasta 24h. antes de la salida del primer vuelo del billete, si éste no incluye ningún vuelo IB5XXX. Reembolsos sólo permitidos en vuelos con código IB, YW, I2 y BA, excepto si es un tramo con código IB y otro tramo con código de otro partner del programa.',
                                    'code': 'CA_RBD_2020_BUSINESS_REEMBOLSO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                }
                            }
                        ],
                        'observations': [
                            {
                                'observationCode': 1,
                                'observationText': {

                                }
                            },
                            {
                                'observationCode': 2,
                                'observationText': {

                                }
                            }
                        ],
                        'conditionsPriority': [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        'offers': [
                            {
                                'offerId': 'IB395120200212U',
                                'bookingClass': 'BUSINESS',
                                'bookingCode': 'B',
                                'fareFamily': 'U',
                                'rbd': 'U',
                                'remainingSeats': 2,
                                'fareBasis': 'UDFF',
                                'totalPrice': null,
                                'adultPrice': null
                            }
                        ],
                        'remainingSeats': 2
                    }
                ],
                'cabinType': 'B',
                'cabinDescription': 'Business Class',
                'cabinAvailable': true,
                'bestPrice': {

                },
                'isCabinCompatible': true
            }
        },
        '$$hashKey': 'object:47'
    };

    beforeEach(function () {
        angular.mock.module('ib-datalayer-module', 'LocalStorageModule', 'ib-booking-trip-info-module', 'ib-commons-utils-module', function ($provide) {
            $provide.value('BookingAppConstants', {
                REDEMPTION_AVAILABILITY_PROVIDERS: {
                    'MULTINUCLEO': 'MN',
                    'AMADEUS': 'AWS',
                    'COMPOSITE': 'COMPOSITE'
                }
            });
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
        });
        inject(function ($componentController, $rootScope, _localStorageService_) {
            controllerDependencies.$scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            controller = $componentController('ibBookingTripInfo', controllerDependencies, bindings);
            controllerDependencies.$scope.$apply();
        });
    });

    describe('when activate is called', function () {
        describe('and does not exist selected filters', function () {
            it('should set new value to tripInfoModel.slices', function (done) {
                inject(function ($filter) {
                    var tripInfoModelSlices = controller.tripInfoModel.slices;
                    var choosedFilterTest = controller.choosedFilter;
                    var filterReverseTest = controller.filterReverse;
                    localStorageService.set('bookingUrlParams', { tripType: 2 });
                    orderByFilter = $filter('orderBy', { value1: tripInfoModelSlices, value2: choosedFilterTest, value3: filterReverseTest });
                });
                controller.$onInit();
                expect(controller.tripInfoModel.slices).toEqual(orderByFilter())
                expect(parseInt(localStorageService.get('bookingUrlParams').tripType)).toEqual(2);
                done();
            });
        });
        describe('and exist selected filters', function () {
            it('should set new value to tripInfoModel.slices', function (done) {
                inject(function ($filter) {
                    var tripInfoModelSlices = controller.tripInfoModel.slices;
                    var choosedFilterTest = controller.choosedFilter;
                    var filterReverseTest = controller.filterReverse;
                    localStorageService.set('bookingUrlParams', { tripType: 2 });
                    orderByFilter = $filter('orderBy', { value1: tripInfoModelSlices, value2: choosedFilterTest, value3: filterReverseTest });
                    controller.tripInfoModel.provider = 'COMPOSITE';
                    controller.tripInfoModel.selectedFilters = true;
                });
                controller.$onInit();
                expect(controller.tripInfoModel.slices).toEqual(orderByFilter())
                expect(parseInt(localStorageService.get('bookingUrlParams').tripType)).toEqual(2);
                done();
            });
        });
    });

    describe('when activateFilter is called', function () {
        beforeEach(inject(function ($filter) {
            var tripInfoModelSlices = controller.tripInfoModel.slices;
            var choosedFilterTest = controller.choosedFilter;
            var filterReverseTest = controller.filterReverse;
            orderByFilter = $filter('orderBy', { value1: tripInfoModelSlices, value2: choosedFilterTest, value3: filterReverseTest });
        }));
        it('should set new values to filterReverse (when choosedFilter !== filterName), choosed filter, tripInfoModel', function (done) {
            var filtername = 'test';
            controller.activateFilter(filtername);
            expect(controller.filterReverse).toEqual(false);
            expect(controller.choosedFilter).toEqual(filtername);
            expect(controller.tripInfoModel.slices).toEqual(orderByFilter())
            done();
        });
        it('should set new values to filterReverse (when choosedFilter === filterName), choosed filter, tripInfoModel', function (done) {
            var filtername = 'departureDateTime';
            controller.activateFilter(filtername);
            expect(controller.filterReverse).toEqual(false);
            expect(controller.choosedFilter).toEqual(filtername);
            done();
        });
    });

    describe('When activateRedemptionFilter is called', function () {
        it('should set new values into filterReverse and choosedFilter', function (done) {
            var filtername = 'departureDateTime', provider = 'COMPOSITE';
            controller.activateRedemptionFilter(filtername, provider);
            expect(controller.filterReverse[provider]).toEqual(false);
            expect(controller.choosedFilter[provider]).toEqual(filtername);
            done();
        });
    });

    describe('When openModal is called', function () {
        describe('and have provider', function () {
            it('should apply', function (done) {
                var event= {preventDefault : jasmine.createSpy()}
                controller.tripInfoModel = {'initialFilterOptions':{'COMPOSITE':{}}, 'filterOptions': [] };
                controller.tripInfoModel.filterOptions['COMPOSITE'] = {};
                controller.openModal('templateModal', 'classModal', event, 'COMPOSITE');
                done();
            });
        });
        describe('and does not exist provider', function () {
            it('should apply', function (done) {
                var event= {preventDefault : jasmine.createSpy()}
                controller.tripInfoModel = {'initialFilterOptions':{'COMPOSITE':{}}, 'filterOptions': [] };
                controller.tripInfoModel.filterOptions['COMPOSITE'] = {};
                controller.openModal('templateModal', 'classModal', event);
                done();
            });
        });
    });

    describe('When availabilityFilter  is called', function () {
        describe('and selectedFilters does not exist', function () {
            it('should not filter by values', function (done) {
                controller.tripInfoModel.selectedFilters = undefined;
                response = controller.availabilityFilter('');
                done();
            });
        });
        describe('and selectedFilters exist', function () {
            it('should filter by values', function (done) {
                controller.tripInfoModel.selectedFilters = {
                    'stopsNumber1': {
                        'enable': true
                    },
                    'stopsNumber2': {
                        'enable': true
                    },
                    'stopsNumber3': {
                        'enable': true
                    },
                    'avios': {
                        'enable': true,
                        'value': 1000
                    },
                    'cabinType': {
                        'description': 'Cabina Turista',
                        'value': 'E',
                        'enable': true
                    },
                    'departureHours': {
                        'description': {
                            'min': '09:00',
                            'max': '21:30'
                        },
                        'value': [
                            540,
                            1290
                        ],
                        'enable': false
                    },
                    'arrivalHours': {
                        'description': {
                            'min': '07:30',
                            'max': '23:30'
                        },
                        'value': [
                            450,
                            1410
                        ],
                        'enable': false
                    }
                };
                controller.availabilityFilter(fakeValue);
                done();
            });
        });
    });

    describe('When availabilityFilterMn  is called', function () {
        describe('and selectedFilters does not exist', function () {
            it('should not filter by values', function (done) {
                controller.tripInfoModel = {
                    selectedFilters: {
                        MN: undefined
                    }
                };
                var response;
                response = controller.availabilityFilterMn('');
                expect(response).toBe(true);
                done();
            });
        });
        describe('and selectedFilters exist', function () {
            it('should filter by values', function (done) {
                controller.tripInfoModel.selectedFilters = {
                    'MN':
                    {
                        'stopsNumber2': {
                            'enable': false
                        },
                        'cabinType': {
                            'description': 'Cabina Turista',
                            'value': 'E',
                            'enable': true
                        },
                        'departureHours': {
                            'description': {
                                'min': '09:00',
                                'max': '21:30'
                            },
                            'value': [
                                540,
                                1290
                            ],
                            'enable': false
                        },
                        'arrivalHours': {
                            'description': {
                                'min': '07:30',
                                'max': '23:30'
                            },
                            'value': [
                                450,
                                1410
                            ],
                            'enable': false
                        }
                    }

                };
                controller.availabilityFilterMn(fakeValue);
                done();
            });
        });
    });

    describe('When availabilityFilterAws  is called', function () {
        describe('and selectedFilters does not exist', function () {
            it('should not filter by values', function (done) {
                controller.tripInfoModel = {
                    selectedFilters: {
                        MN: undefined
                    }
                }
                controller.availabilityFilterAws('');
                done();
            });
        });
        describe('and selectedFilters exist', function () {
            it('should filter by values', function (done) {
                controller.tripInfoModel.selectedFilters = {
                    'AWS':
                    {
                        'stopsNumber2': {
                            'enable': false
                        },
                        'cabinType': {
                            'description': 'Cabina Turista',
                            'value': 'E',
                            'enable': true
                        },
                        'departureHours': {
                            'description': {
                                'min': '09:00',
                                'max': '21:30'
                            },
                            'value': [
                                540,
                                1290
                            ],
                            'enable': false
                        },
                        'arrivalHours': {
                            'description': {
                                'min': '07:30',
                                'max': '23:30'
                            },
                            'value': [
                                450,
                                1410
                            ],
                            'enable': false
                        }
                    }

                };
                controller.availabilityFilterAws(fakeValue);
                done();
            });
        });
    });

    describe('When showPopoverStopOver is called', function () {
        describe('and exist stopOverCities and stopsNumber', function () {
            describe('and stopsNumber > 1', function () {
                it('should return cities', function (done) {
                    var stopOverCities = [{ 'description': 'MAD' }, { 'description': 'BCN' }];
                    controller.showPopoverStopover(stopOverCities, 2);
                    done();
                });
            });
            describe('and stopsNumber < 1', function () {
                it('should return cities', function (done) {
                    var stopOverCities = [{ 'description': 'MAD' }];
                    controller.showPopoverStopover(stopOverCities, 1);
                    done();
                });
            });
        });
        describe('and does not exist stopOverCities and stopsNumber', function () {
            it('should return cities', function (done) {
                controller.showPopoverStopover('', '');
                done();
            });
        });
    });

});
