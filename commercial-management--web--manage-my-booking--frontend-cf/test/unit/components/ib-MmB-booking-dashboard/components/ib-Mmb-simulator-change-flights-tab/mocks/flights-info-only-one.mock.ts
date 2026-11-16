export const fakeFlightsInfoOnlyOneFlights = {
    'noIberiaFlag': false,
    'flights': {
        'MADFCO20210315090500': {
            'departureCity': {
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
            'arrivalCity': {
                'code': 'FCO',
                'name': 'FIUMICINO',
                'terminal': '3',
                'city': {
                    'code': 'ROM',
                    'description': 'Roma',
                    'countryCode': 'IT',
                    'country': {
                        'code': 'IT',
                        'description': 'Italia'
                    }
                }
            },
            'departureCountry': 'ES',
            'arrivalCountry': 'IT',
            'segments': [
                {
                    'departureCity': {
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
                    'arrivalCity': {
                        'code': 'FCO',
                        'name': 'FIUMICINO',
                        'terminal': '3',
                        'city': {
                            'code': 'ROM',
                            'description': 'Roma',
                            'countryCode': 'IT',
                            'country': {
                                'code': 'IT',
                                'description': 'Italia'
                            }
                        }
                    },
                    'departureDateParsed': {
                        'dateTime': '09:05',
                        'weekDay': 'WEEKDAY_MONDAY',
                        'day': 15,
                        'monthNumber': 3,
                        'month': 'MONTH_MARCH',
                        'year': 2021,
                        'originalDate': '2021-03-15T09:05:00+01:00',
                        'formatedDate': '15/03/2021'
                    },
                    'arrivalDateParsed': {
                        'dateTime': '11:35',
                        'weekDay': 'WEEKDAY_MONDAY',
                        'day': 15,
                        'monthNumber': 3,
                        'month': 'MONTH_MARCH',
                        'year': 2021,
                        'originalDate': '2021-03-15T11:35:00+01:00',
                        'formatedDate': '15/03/2021'
                    },
                    'companyURL': '/aerolineas/logo_pos_IB.svg',
                    'overnight': false,
                    'departureDateTimeParsed': '09:05',
                    'arrivalDateTimeParsed': '11:35',
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
                        'code': 'FCO',
                        'name': 'FIUMICINO',
                        'terminal': '3',
                        'city': {
                            'code': 'ROM',
                            'description': 'Roma',
                            'countryCode': 'IT',
                            'country': {
                                'code': 'IT',
                                'description': 'Italia'
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
                        'marketingFlightNumber': '3230',
                        'operationalFlightNumber': '3230',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '320',
                            'description': 'Airbus A320'
                        }
                    },
                    'durationParsed': '02h 30min.',
                    'fareFamilyConditions': [
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'EQMANO',
                            'name': 'Equipaje de mano',
                            'title': '1 bulto en cabina  (56x40x25cm)',
                            'message': '1 bulto (56x40x25cm)',
                            'units': 1,
                            '$$hashKey': 'object:137'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'EQBODEGA',
                            'name': 'Equipaje en bodega',
                            'title': 'Sin equipaje en bodega',
                            'message': 'No incluido. ',
                            'units': null,
                            '$$hashKey': 'object:138'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'ASIENTO',
                            'name': 'Selección de asiento',
                            'title': 'Seleccionable con coste',
                            'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                            'units': null,
                            '$$hashKey': 'object:139'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'CAMBIO',
                            'name': 'Cambios',
                            'title': 'Cambio permitido con coste',
                            'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'units': 65,
                            '$$hashKey': 'object:140'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'REEMBOLSO',
                            'name': 'Reembolso (por sentido)',
                            'title': 'Reembolso no permitido',
                            'message': 'No permitido.',
                            'units': null,
                            '$$hashKey': 'object:141'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'TARJEMBANTIC',
                            'name': 'Tarjeta de embarque anticipada',
                            'title': 'No incluido',
                            'message': 'No incluido',
                            'units': null,
                            '$$hashKey': 'object:142'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'EMBARQUE',
                            'name': 'Prioridad de Embarque',
                            'title': '',
                            'message': 'No',
                            'units': null,
                            '$$hashKey': 'object:143'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'SALAVIP',
                            'name': 'Acceso a salas VIP',
                            'title': '',
                            'message': 'No',
                            'units': null,
                            '$$hashKey': 'object:144'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'CABINA',
                            'name': 'Cabina',
                            'title': '',
                            'message': 'Turista',
                            'units': null,
                            '$$hashKey': 'object:145'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'CHECKINDESK',
                            'name': 'Mostrador check-in exclusivo',
                            'title': '',
                            'message': 'No',
                            'units': null,
                            '$$hashKey': 'object:146'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'ASIENTOXL',
                            'name': 'Selección de asiento XL',
                            'title': 'Seleccionable con coste',
                            'message': 'De pago',
                            'units': null,
                            '$$hashKey': 'object:147'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'FASTTRACK',
                            'name': 'Fast Track',
                            'title': '',
                            'message': 'No',
                            'units': null,
                            '$$hashKey': 'object:148'
                        },
                        {
                            'cabin': 'Básica',
                            'cabinType': 'E',
                            'code': 'EQPPRIOR',
                            'name': 'Entrega prioritaria equipaje',
                            'title': '',
                            'message': 'No',
                            'units': null,
                            '$$hashKey': 'object:149'
                        }
                    ],
                    'segmentId': 'IB323020210315',
                    'sliceId': 'MADFCO20210315090500',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 9,
                        'fareFamily': 'TBAESEU',
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
                'dateTime': '09:05',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 15,
                'monthNumber': 3,
                'month': 'MONTH_MARCH',
                'year': 2021,
                'originalDate': '2021-03-15T09:05:00+01:00',
                'formatedDate': '15/03/2021'
            },
            'arrivalDateParsed': {
                'dateTime': '11:35',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 15,
                'monthNumber': 3,
                'month': 'MONTH_MARCH',
                'year': 2021,
                'originalDate': '2021-03-15T11:35:00+01:00',
                'formatedDate': '15/03/2021'
            },
            'durationParsed': '02h 30min.',
            'stopsNumber': 0,
            'daysToGo': 3,
            'checked': true,
            'parseNewDateSelected': null
        }
    },
    'allSegments': {
        'IB323020210315': {
            'departureCity': {
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
            'arrivalCity': {
                'code': 'FCO',
                'name': 'FIUMICINO',
                'terminal': '3',
                'city': {
                    'code': 'ROM',
                    'description': 'Roma',
                    'countryCode': 'IT',
                    'country': {
                        'code': 'IT',
                        'description': 'Italia'
                    }
                }
            },
            'departureDateParsed': {
                'dateTime': '09:05',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 15,
                'monthNumber': 3,
                'month': 'MONTH_MARCH',
                'year': 2021,
                'originalDate': '2021-03-15T09:05:00+01:00',
                'formatedDate': '15/03/2021'
            },
            'arrivalDateParsed': {
                'dateTime': '11:35',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 15,
                'monthNumber': 3,
                'month': 'MONTH_MARCH',
                'year': 2021,
                'originalDate': '2021-03-15T11:35:00+01:00',
                'formatedDate': '15/03/2021'
            },
            'companyURL': '/aerolineas/logo_pos_IB.svg',
            'overnight': false,
            'departureDateTimeParsed': '09:05',
            'arrivalDateTimeParsed': '11:35',
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
                'code': 'FCO',
                'name': 'FIUMICINO',
                'terminal': '3',
                'city': {
                    'code': 'ROM',
                    'description': 'Roma',
                    'countryCode': 'IT',
                    'country': {
                        'code': 'IT',
                        'description': 'Italia'
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
                'marketingFlightNumber': '3230',
                'operationalFlightNumber': '3230',
                'operationalDisclosure': 'IB',
                'aircraft': {
                    'code': '320',
                    'description': 'Airbus A320'
                }
            },
            'durationParsed': '02h 30min.',
            'fareFamilyConditions': [
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'title': '1 bulto en cabina  (56x40x25cm)',
                    'message': '1 bulto (56x40x25cm)',
                    'units': 1,
                    '$$hashKey': 'object:137'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EQBODEGA',
                    'name': 'Equipaje en bodega',
                    'title': 'Sin equipaje en bodega',
                    'message': 'No incluido. ',
                    'units': null,
                    '$$hashKey': 'object:138'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'ASIENTO',
                    'name': 'Selección de asiento',
                    'title': 'Seleccionable con coste',
                    'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                    'units': null,
                    '$$hashKey': 'object:139'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'CAMBIO',
                    'name': 'Cambios',
                    'title': 'Cambio permitido con coste',
                    'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    'units': 65,
                    '$$hashKey': 'object:140'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'REEMBOLSO',
                    'name': 'Reembolso (por sentido)',
                    'title': 'Reembolso no permitido',
                    'message': 'No permitido.',
                    'units': null,
                    '$$hashKey': 'object:141'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'TARJEMBANTIC',
                    'name': 'Tarjeta de embarque anticipada',
                    'title': 'No incluido',
                    'message': 'No incluido',
                    'units': null,
                    '$$hashKey': 'object:142'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EMBARQUE',
                    'name': 'Prioridad de Embarque',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:143'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'SALAVIP',
                    'name': 'Acceso a salas VIP',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:144'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'CABINA',
                    'name': 'Cabina',
                    'title': '',
                    'message': 'Turista',
                    'units': null,
                    '$$hashKey': 'object:145'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'CHECKINDESK',
                    'name': 'Mostrador check-in exclusivo',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:146'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'ASIENTOXL',
                    'name': 'Selección de asiento XL',
                    'title': 'Seleccionable con coste',
                    'message': 'De pago',
                    'units': null,
                    '$$hashKey': 'object:147'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'FASTTRACK',
                    'name': 'Fast Track',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:148'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EQPPRIOR',
                    'name': 'Entrega prioritaria equipaje',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:149'
                }
            ],
            'segmentId': 'IB323020210315',
            'sliceId': 'MADFCO20210315090500',
            'status': {
                'code': 'HK',
                'description': 'Confirmado'
            },
            'cabin': {
                'rbd': 'A',
                'description': '',
                'remainingSeats': 9,
                'fareFamily': 'TBAESEU',
                'code': 'R',
                'type': 'ECONOMY',
                'bookingClass': 'ECONOMY'
            },
            'flown': false,
            'warnings': {},
            'stop': null
        },
        'IB323120210322': {
            'departureCity': {
                'code': 'FCO',
                'name': 'FIUMICINO',
                'terminal': '3',
                'city': {
                    'code': 'ROM',
                    'description': 'Roma',
                    'countryCode': 'IT',
                    'country': {
                        'code': 'IT',
                        'description': 'Italia'
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
                'dateTime': '12:15',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 22,
                'monthNumber': 3,
                'month': 'MONTH_MARCH',
                'year': 2021,
                'originalDate': '2021-03-22T12:15:00+01:00',
                'formatedDate': '22/03/2021'
            },
            'arrivalDateParsed': {
                'dateTime': '14:55',
                'weekDay': 'WEEKDAY_MONDAY',
                'day': 22,
                'monthNumber': 3,
                'month': 'MONTH_MARCH',
                'year': 2021,
                'originalDate': '2021-03-22T14:55:00+01:00',
                'formatedDate': '22/03/2021'
            },
            'companyURL': '/aerolineas/logo_pos_IB.svg',
            'overnight': false,
            'departureDateTimeParsed': '12:15',
            'arrivalDateTimeParsed': '14:55',
            'departure': {
                'code': 'FCO',
                'name': 'FIUMICINO',
                'terminal': '3',
                'city': {
                    'code': 'ROM',
                    'description': 'Roma',
                    'countryCode': 'IT',
                    'country': {
                        'code': 'IT',
                        'description': 'Italia'
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
                'marketingFlightNumber': '3231',
                'operationalFlightNumber': '3231',
                'operationalDisclosure': 'IB',
                'aircraft': {
                    'code': '320',
                    'description': 'Airbus A320'
                }
            },
            'durationParsed': '02h 40min.',
            'fareFamilyConditions': [
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'title': '1 bulto en cabina  (56x40x25cm)',
                    'message': '1 bulto (56x40x25cm)',
                    'units': 1,
                    '$$hashKey': 'object:167'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EQBODEGA',
                    'name': 'Equipaje en bodega',
                    'title': 'Sin equipaje en bodega',
                    'message': 'No incluido. ',
                    'units': null,
                    '$$hashKey': 'object:168'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'ASIENTO',
                    'name': 'Selección de asiento',
                    'title': 'Seleccionable con coste',
                    'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                    'units': null,
                    '$$hashKey': 'object:169'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'CAMBIO',
                    'name': 'Cambios',
                    'title': 'Cambio permitido con coste',
                    'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    'units': 65,
                    '$$hashKey': 'object:170'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'REEMBOLSO',
                    'name': 'Reembolso (por sentido)',
                    'title': 'Reembolso no permitido',
                    'message': 'No permitido.',
                    'units': null,
                    '$$hashKey': 'object:171'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'TARJEMBANTIC',
                    'name': 'Tarjeta de embarque anticipada',
                    'title': 'No incluido',
                    'message': 'No incluido',
                    'units': null,
                    '$$hashKey': 'object:172'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EMBARQUE',
                    'name': 'Prioridad de Embarque',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:173'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'SALAVIP',
                    'name': 'Acceso a salas VIP',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:174'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'CABINA',
                    'name': 'Cabina',
                    'title': '',
                    'message': 'Turista',
                    'units': null,
                    '$$hashKey': 'object:175'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'CHECKINDESK',
                    'name': 'Mostrador check-in exclusivo',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:176'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'ASIENTOXL',
                    'name': 'Selección de asiento XL',
                    'title': 'Seleccionable con coste',
                    'message': 'De pago',
                    'units': null,
                    '$$hashKey': 'object:177'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'FASTTRACK',
                    'name': 'Fast Track',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:178'
                },
                {
                    'cabin': 'Básica',
                    'cabinType': 'E',
                    'code': 'EQPPRIOR',
                    'name': 'Entrega prioritaria equipaje',
                    'title': '',
                    'message': 'No',
                    'units': null,
                    '$$hashKey': 'object:179'
                }
            ],
            'segmentId': 'IB323120210322',
            'sliceId': 'FCOMAD20210322121500',
            'status': {
                'code': 'HK',
                'description': 'Confirmado'
            },
            'cabin': {
                'rbd': 'O',
                'description': '',
                'remainingSeats': 2,
                'fareFamily': 'TBAESEU',
                'code': 'R',
                'type': 'ECONOMY',
                'bookingClass': 'ECONOMY'
            },
            'flown': false,
            'warnings': {},
            'stop': null
        }
    }
};
