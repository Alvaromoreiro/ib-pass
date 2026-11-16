import { PassengersFormData } from '@src/app/core/models/ib-booking-pasenger-form/ib-booking-passenger-form.model';

export const emptyAdultData: PassengersFormData = {
    'securityInfo': {
        'passengerInfo': [
            {
                'options': {
                    'haveBirthdate': false,
                    'haveName': false,
                    'haveSurname': false,
                    'haveLastName': false,
                    'haveIbPlus': false,
                    'haveGender': false
                },
                'isValidForm': false,
                'id': 'ADULT_01',
                'type': 'ADULT',
                'name': {
                    'name': 'GENERAL_LABEL_PASSENGER',
                    'pasNumber': 1,
                    'needsTranslate': true
                },
                'requiredFields': {
                    'SURNAME': {},
                    'NAME': {}
                },
                'serviceErrors': [],
                'optionalDocs': {},
                'specialNeeds': {
                    'availableTypes': [
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS',
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS'
                    ],
                    'specialVision': false,
                    'specialHearing': false,
                    'specialGuideDog': false,
                    'specialIntellDisability': false,
                    'specialWheelchair': false,
                    'specialWheelchairValue': '',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
                        }
                    ],
                    'isEnable': false
                },
                'isSelected': false,
                'canBeInCharge': true,
                'mandatoryDocs': [],
                'data': {
                    optionalDoc: null,
                    'name': '',
                    'surname': '',
                    'lastSurname': '',
                    'mandatoryDoc': null,
                    'residentDiscountInfo': null,
                    'largeFamilyDiscountInfo': null,
                    'gender': 'MALE',
                    'freqFlyerInfo': null,
                    'freqFlyerSelected': false,
                    'OBNumberSelected': false,
                    'OBNumberInfo': null,
                    'personInCharge': null,
                    'birthDate': [
                        '',
                        '',
                        ''
                    ]
                },
                'previousSelected': {
                    'name': 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK',
                    'type': 'DEFAULT'
                },
                frequentlyPassengers: []
            },
            {
                'options': {
                    'haveBirthdate': false,
                    'haveName': false,
                    'haveSurname': false,
                    'haveLastName': false,
                    'haveIbPlus': false,
                    'haveGender': false,
                    'resident': {
                        'haveError': false,
                        'errorMessage': ''
                    }
                },
                'isValidForm': false,
                'id': 'ADULT_02',
                'type': 'ADULT',
                'name': {
                    'name': 'GENERAL_LABEL_PASSENGER',
                    'pasNumber': 2,
                    'needsTranslate': true
                },
                'requiredFields': {
                    'SURNAME': {},
                    'NAME': {}
                },
                'serviceErrors': [],
                'optionalDocs': {},
                'specialNeeds': {
                    'availableTypes': [
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS',
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS'
                    ],
                    'specialVision': false,
                    'specialHearing': false,
                    'specialGuideDog': false,
                    'specialIntellDisability': false,
                    'specialWheelchair': false,
                    'specialWheelchairValue': '',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
                        }
                    ]
                },
                'isSelected': false,
                'canBeInCharge': true,
                'mandatoryDocs': [],
                'data': {
                    optionalDoc: null,
                    'name': '',
                    'surname': '',
                    'lastSurname': '',
                    'mandatoryDoc': null,
                    'residentDiscountInfo': null,
                    'largeFamilyDiscountInfo': null,
                    'gender': 'MALE',
                    'freqFlyerInfo': null,
                    'freqFlyerSelected': false,
                    'OBNumberSelected': false,
                    'OBNumberInfo': null,
                    'personInCharge': null,
                    'birthDate': [
                        '',
                        '',
                        ''
                    ]
                },
                frequentlyPassengers: []
            },
            {
                'options': {
                    'haveBirthdate': false,
                    'haveName': false,
                    'haveSurname': false,
                    'haveLastName': false,
                    'haveIbPlus': false,
                    'haveGender': false,
                    'resident': {
                        'haveError': false,
                        'errorMessage': ''
                    }
                },
                'isValidForm': false,
                'id': 'INFANT_01',
                'type': 'INFANT',
                'name': {
                    'name': 'GENERAL_LABEL_PASSENGER',
                    'pasNumber': 3,
                    'needsTranslate': true
                },
                'requiredFields': {
                    'SURNAME': {},
                    'BIRTH_DATE': {},
                    'NAME': {}
                },
                'serviceErrors': [],
                'optionalDocs': {},
                'specialNeeds': {
                    'availableTypes': [
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS',
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS'
                    ],
                    'specialVision': false,
                    'specialHearing': false,
                    'specialGuideDog': false,
                    'specialIntellDisability': false,
                    'specialWheelchair': false,
                    'specialWheelchairValue': '',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
                        }
                    ]
                },
                'isSelected': false,
                'canBeInCharge': false,
                'mandatoryDocs': [],
                'data': {
                    'optionalDoc': null,
                    'name': '',
                    'surname': '',
                    'lastSurname': '',
                    'mandatoryDoc': null,
                    'residentDiscountInfo': null,
                    'largeFamilyDiscountInfo': null,
                    'gender': 'MALE',
                    'freqFlyerInfo': null,
                    'freqFlyerSelected': false,
                    'OBNumberSelected': false,
                    'OBNumberInfo': null,
                    'personInCharge': null,
                    'birthDate': [
                        '',
                        '',
                        ''
                    ]
                },
                frequentlyPassengers: []
            }
        ],
        'isLogged': false,
        'isResident': false,
        'iTravel': false,
        'passengerInfoLogged': undefined,
        'contactData': {
            'isValidForm': false,
            'contactPhone': '',
            'contactEmail': '',
            'contactPrefix': {
                'code': '+34',
                'description': 'España / +34',
                'countryCode': 'ES'
            },
            'isNewsLetters': false,
            'denyNewsLetters': false
        },
        'frequentlyPassengers': [],
        'largeFamilyDiscountInfo': {
            'largeFamilyCertificateNumber': '',
            'communityCode': {
                'code': '',
                'description': ''
            }
        },
        'totalPrice': '295,63€',
        'totalPriceWithOutDiscount': '295,63€',
        'totalPriceWithDiscount': '295,63€',
        'aviosInfo': {
            'redemptionAvios': 980,
            'cashDiscountWithAvios': '250,42€'
        },
        'onHold': {
            'holdTimes': '72',
            'maxFreeTime': 0,
            'moreTimePrice': 5,
            'minPrice': '5,00€',
            'freePrice': 0,
            'freeOption': false,
            'payOption': true,
            'holdTimesFree': '',
            'holdTimesPay': 72,
            'onHoldOptionText': 'Haz tu reserva ahora y confírmala en 72h por 5,00€. Esta cantidad se descontará del precio final.'
        },
        'onHoldIfIsLogged': null,
        'discounts': [],
        'summaryInfo': {
            'trips': [
                {
                    'idTrip': 'MADPMI20251009102000',
                    'stopsNumber': 0,
                    'fare': {
                        'name': 'Básica',
                        'cabin': 'Turista',
                        'fareDetails': {
                            'CABINA': {
                                'name': 'Cabina',
                                'message': 'Cabina Turista'
                            },
                            'EQMANO': {
                                'name': 'Equipaje de mano',
                                'message': 'Equipaje de mano: 1 pieza'
                            },
                            'EQBODEGA': {
                                'name': 'Equipaje en bodega',
                                'message': 'Equipaje facturable no incluido'
                            },
                            'COMIDA': {
                                'name': 'Comida',
                                'message': 'Comida no incluida'
                            },
                            'ASIENTO': {
                                'name': 'Selección de asiento',
                                'message': 'Selección de asiento con coste'
                            },
                            'ASIENTODELANTERO': {
                                'name': 'Asiento delantero',
                                'message': 'Asiento delantero con coste'
                            },
                            'ASIENTOPREFERENTE': {
                                'name': 'Asiento preferente',
                                'message': 'Asiento preferente no aplica'
                            },
                            'ASIENTOXL': {
                                'name': 'Asiento espacio extra',
                                'message': 'Asiento espacio extra con coste'
                            },
                            'EMBARQUE': {
                                'name': 'Prioridad de Embarque',
                                'message': 'Embarque prioritario no incluido'
                            },
                            'CAMBIO': {
                                'name': 'Cambios',
                                'message': 'Permitido con coste, no permitido en caso de no-show.'
                            },
                            'REEMBOLSO': {
                                'name': 'Reembolso (por sentido)',
                                'message': 'No permitido.'
                            },
                            'CHECKINDESK': {
                                'name': 'Mostrador check-in exclusivo',
                                'message': 'Mostrador Check-in exclusivo no incluido'
                            },
                            'SALAVIP': {
                                'name': 'Acceso a salas VIP',
                                'message': 'Acceso a Sala Vip no incluido'
                            },
                            'FASTTRACK': {
                                'name': 'Fast Track',
                                'message': 'Fast Track no incluido'
                            },
                            'EQPPRIOR': {
                                'name': 'Entrega prioritaria equipaje',
                                'message': 'No incluye entrega rápida de equipaje'
                            },
                            'AVIO': {
                                'name': 'AVIOS',
                                'message': 'Obtén Avios con tu compra'
                            },
                            'WIFI': {
                                'name': 'WiFi',
                                'message': 'Wifi con coste'
                            },
                            'AEROPUERTO': {
                                'name': 'Adelantamos tu vuelo',
                                'message': 'Adelanto de vuelo'
                            },
                            'FASTLANE': {
                                'name': 'Fast Lane',
                                'message': 'Fast Lane no incluido'
                            }
                        }
                    },
                    'segments': [
                        {
                            'idSegment': 'IB165920251009',
                            'departure': {
                                'code': 'MAD',
                                'name': 'ADOLFO SUAREZ BARAJAS',
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
                            'departureDate': {
                                'dateTime': '10:20',
                                'weekDay': 'WEEKDAY_THURSDAY',
                                'hour': 2,
                                'minutes': 0,
                                'day': 9,
                                'monthNumber': 10,
                                'month': 'MONTH_OCTOBER',
                                'year': 2025,
                                'formatedDate': '2025-10-09 10:20'
                            },
                            'arrival': {
                                'code': 'PMI',
                                'name': 'PALMA DE MALLORCA',
                                'terminal': '',
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
                            'arrivalDate': {
                                'dateTime': '11:45',
                                'weekDay': 'WEEKDAY_THURSDAY',
                                'hour': 2,
                                'minutes': 0,
                                'day': 9,
                                'monthNumber': 10,
                                'month': 'MONTH_OCTOBER',
                                'year': 2025,
                                'formatedDate': '2025-10-09 11:45'
                            },
                            'flightNumber': '1659',
                            'operatedBy': 'Iberiaexpress',
                            'aircraftType': 'Airbus A321neo',
                            'duration': '1h 25min.',
                            'waitingTime': 0,
                            'waitingParsedTime': '',
                            'cabin': 'Turista',
                            'operationalDisclosure': 'I2',
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'displayMarketingFlightNumber': '1659',
                            '$$hashKey': 'object:1166'
                        }
                    ],
                    '$$hashKey': 'object:1148'
                },
                {
                    'idTrip': 'PMIMAD20251112091500',
                    'stopsNumber': 0,
                    'fare': {
                        'name': 'Básica',
                        'cabin': 'Turista',
                        'fareDetails': {
                            'CABINA': {
                                'name': 'Cabina',
                                'message': 'Cabina Turista'
                            },
                            'EQMANO': {
                                'name': 'Equipaje de mano',
                                'message': 'Equipaje de mano: 1 pieza'
                            },
                            'EQBODEGA': {
                                'name': 'Equipaje en bodega',
                                'message': 'Equipaje facturable no incluido'
                            },
                            'COMIDA': {
                                'name': 'Comida',
                                'message': 'Comida no incluida'
                            },
                            'ASIENTO': {
                                'name': 'Selección de asiento',
                                'message': 'Selección de asiento con coste'
                            },
                            'ASIENTODELANTERO': {
                                'name': 'Asiento delantero',
                                'message': 'Asiento delantero con coste'
                            },
                            'ASIENTOPREFERENTE': {
                                'name': 'Asiento preferente',
                                'message': 'Asiento preferente no aplica'
                            },
                            'ASIENTOXL': {
                                'name': 'Asiento espacio extra',
                                'message': 'Asiento espacio extra con coste'
                            },
                            'EMBARQUE': {
                                'name': 'Prioridad de Embarque',
                                'message': 'Embarque prioritario no incluido'
                            },
                            'CAMBIO': {
                                'name': 'Cambios',
                                'message': 'Permitido con coste, no permitido en caso de no-show.'
                            },
                            'REEMBOLSO': {
                                'name': 'Reembolso (por sentido)',
                                'message': 'No permitido.'
                            },
                            'CHECKINDESK': {
                                'name': 'Mostrador check-in exclusivo',
                                'message': 'Mostrador Check-in exclusivo no incluido'
                            },
                            'SALAVIP': {
                                'name': 'Acceso a salas VIP',
                                'message': 'Acceso a Sala Vip no incluido'
                            },
                            'FASTTRACK': {
                                'name': 'Fast Track',
                                'message': 'Fast Track no incluido'
                            },
                            'EQPPRIOR': {
                                'name': 'Entrega prioritaria equipaje',
                                'message': 'No incluye entrega rápida de equipaje'
                            },
                            'AVIO': {
                                'name': 'AVIOS',
                                'message': 'Obtén Avios con tu compra'
                            },
                            'WIFI': {
                                'name': 'WiFi',
                                'message': 'Wifi con coste'
                            },
                            'AEROPUERTO': {
                                'name': 'Adelantamos tu vuelo',
                                'message': 'Adelanto de vuelo'
                            },
                            'FASTLANE': {
                                'name': 'Fast Lane',
                                'message': 'Fast Lane no incluido'
                            }
                        }
                    },
                    'segments': [
                        {
                            'idSegment': 'IB165220251112',
                            'departure': {
                                'code': 'PMI',
                                'name': 'PALMA DE MALLORCA',
                                'terminal': '',
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
                            'departureDate': {
                                'dateTime': '09:15',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 11,
                                'month': 'MONTH_NOVEMBER',
                                'year': 2025,
                                'formatedDate': '2025-11-12 09:15'
                            },
                            'arrival': {
                                'code': 'MAD',
                                'name': 'ADOLFO SUAREZ BARAJAS',
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
                            'arrivalDate': {
                                'dateTime': '10:40',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 11,
                                'month': 'MONTH_NOVEMBER',
                                'year': 2025,
                                'formatedDate': '2025-11-12 10:40'
                            },
                            'flightNumber': '1652',
                            'operatedBy': 'Iberiaexpress',
                            'aircraftType': 'Airbus A321neo',
                            'duration': '1h 25min.',
                            'waitingTime': 0,
                            'waitingParsedTime': '',
                            'cabin': 'Turista',
                            'operationalDisclosure': 'I2',
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'displayMarketingFlightNumber': '1652',
                            '$$hashKey': 'object:1170'
                        }
                    ],
                    '$$hashKey': 'object:1149'
                }
            ],
            'passengers': {
                'generalData': {
                    'ADULT': [
                        {
                            'number': 2,
                            'totalTax': 54.42,
                            'totalTaxWithDiscount': 27.21,
                            'totalTaxWithoutDiscount': 27.21,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD|JD',
                                    'amount': '19,46€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'QV|QV',
                                    'amount': '6,53€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'OG|OG',
                                    'amount': '1,22€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad',
                                    'subcode': '001',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                }
                            ],
                            'fare': 98,
                            'fareWithoutDiscount': 98,
                            'fareWithDiscount': 98,
                            'parsedFare': '98€',
                            'parsedFareWithDiscount': '98€',
                            'parsedFareWithoutDiscount': '98€',
                            'parsedTotalTax': '54,42€',
                            'parsedTotalTaxWithDiscount': '27,21€',
                            'parsedTotalTaxWithoutDiscount': '27,21€',
                            '$$hashKey': 'object:1156'
                        }
                    ],
                    'INFANT': [
                        {
                            'number': 1,
                            'totalTax': 27.21,
                            'totalTaxWithDiscount': 27.21,
                            'totalTaxWithoutDiscount': 27.21,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD|JD',
                                    'amount': '19,46€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'QV|QV',
                                    'amount': '6,53€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'OG|OG',
                                    'amount': '1,22€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad',
                                    'subcode': '001',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                }
                            ],
                            'fare': 18,
                            'fareWithoutDiscount': 18,
                            'fareWithDiscount': 18,
                            'parsedFare': '18€',
                            'parsedFareWithDiscount': '18€',
                            'parsedFareWithoutDiscount': '18€',
                            'parsedTotalTax': '27,21€',
                            'parsedTotalTaxWithDiscount': '27,21€',
                            'parsedTotalTaxWithoutDiscount': '27,21€',
                            '$$hashKey': 'object:1158'
                        }
                    ]
                }
            },
            'otherFees': []
        },
        'relatedContent': {
            'SPECIAL_NEED_CONTACT_INFO': {},
            'TOTAL_PRICE': {},
            'OBSERVATIONS': {},
            'FARE_CONDITIONS': {}
        },
        'gdprInfo': {
            'text': [
                {
                    'type': 'text',
                    'value': 'El responsable del tratamiento de tus datos es Iberia L.A.E. S.A. Operadora, Sociedad Unipersonal (en adelante, “Iberia”) con domicilio social en calle Martínez Villergas 49, 28027 Madrid.Tus datos se tratarán para (i) la gestión de los servicios contratados, en base a la ejecución del contrato; (ii) el envío del Boletín de noticias, ofertas y promociones de productos y servicios de Iberia, relacionados con los productos ya contratados, en base al interés legítimo.Los destinatarios de tus datos son entidades del Grupo IAG al que IBERIA pertenece.El usuario podrá revocar en cualquier momento su consentimiento, así como ejercitar los derechos de oposición, acceso, portabilidad, rectificación, limitación y supresión de datos.Puedes conocer el detalle de la información que aquí se expone a través de la '
                },
                {
                    'type': 'link',
                    'value': 'política de privacidad',
                    'attrs': {
                        'target': '_blank',
                        'href': '#',
                        'title': 'Política de privacidad',
                        'data-contenttype': 'CustomLink_C',
                        'data-contentid': '1476373673799',
                        'data-contentorigin': '1476373673799'
                    }
                },
                {
                    'type': 'text',
                    'value': '.'
                }
            ],
            'modals': [
                {
                    'code': '1476373673799',
                    'title': 'Política de protección de datos personales para clientes y pasajeros',
                    'subtitle': '',
                    'elements': [
                        {
                            'type': 'Accordion_C',
                            'title': '',
                            'subTitle': '',
                            'description': 'Nuestro Compromiso con la PrivacidadIberia se compromete a respetar tu privacidad y a proteger tus datos personales.Seremos totalmente transparentes acerca de los datos que recabemos y el uso que hagamos de ellos.Utilizaremos los datos que nos proporciones para los fines descritos en nuestra Política de Privacidad, entre los que se encuentra prestarte los servicios que has solicitado y mejorar tu experiencia con Iberia.Asimismo, utilizaremos los datos para intentar conocerte mejor y así poder enviarte ofertas relevantes.Si nos comunicas que no quiere recibir comunicaciones comerciales, dejaremos de enviártelas. Por supuesto, seguiremos enviándote información importante relacionada con un producto o servicio que hayas adquirido para mantenerte informado acerca de tu reserva e itinerario de viaje.Te remitiremos información cuando resulte relevante para el producto o servicio que hayas adquirido, a fin de mantenerte informado sobre tu reserva e itinerario de viaje.Adoptaremos las medidas necesarias para proteger y mantener a salvo tu información.Respetaremos los derechos de protección de datos y trataremos de cederte el control sobre tu propia información.La Política de Privacidad que le detallamos a continuación podrá ayudarle a comprender mejor cómo utilizamos sus datos personales. En ella explicamos con más detalle los tipos de datos personales que recabamos, cómo los recabamos, con qué fines podemos utilizarlos y con quién podemos compartirlos.A lo largo de la Política de Privacidad encontrará una serie de ejemplos específicos de por qué y cómo usamos sus datos personales. Si tiene cualquier duda, por favor póngase en contacto con nosotros escribiendo a nuestra Oficina de Protección de Datos por correo electrónico a OficinaDPO@iberia.es .Sin perjuicio de los derechos que le correspondan bajo las leyes que resulten de aplicación, la Política de Privacidad y la información anterior no tienen carácter contractual ni forman parte de su contrato con nosotros.',
                            'items': [
                                {
                                    'title': 'Responsable del Tratamiento de Datos Personales',
                                    'description': 'Todos los datos personales tratados por Iberia en relación con la presente Política de Privacidad son responsabilidad de Iberia Líneas Aéreas de España S.A. Operadora, Sociedad Unipersonal, CIF A85850394 (en adelante, “IBERIA”), la cual tiene consideración de “responsable del tratamiento” bajo la normativa aplicable en materia de protección de datos. Nuestra dirección de contacto a estos efectos es “Oficina de Protección de Datos de Iberia Líneas Aéreas de España S.A. Operadora, Sociedad Unipersonal”, en Calle Martínez Villergas, 49, 28027 de Madrid, España o a través de la dirección de correo electrónico antes mencionada.Si has realizado una reserva con nosotros pero uno o varios de los vuelos están operados por otras compañías aéreas, cada una de esas compañías aéreas será asimismo, de forma independiente, responsable del tratamiento bajo la normativa aplicable en materia de protección de datos.Cualquier tercero prestador de servicios accesibles a través de nuestra web, como puede ser un hotel o una empresa de alquiler de vehículos, también será responsable del tratamiento individualmente. Podrás acceder a los servicios que ofrecen estas terceras empresas a través de nuestra página web, que directamente te redireccionará a sus correspondientes webs, donde encontrarás las políticas de protección de datos de dichos proveedores.IBERIA es una entidad perteneciente al Grupo IAG cuya sociedad de cabecera es la entidad de nacionalidad española International Consolidated Airlines Group, S.A.. Más abajo encontrarás información adicional sobre las sociedades que conforman el Grupo IAG.Si eres miembro del Programa de fidelización IBERIA PLUS, la entidad Avios Group Limited (“AGL”) igualmente perteneciente al Grupo IAG también será, de forma conjunta con IBERIA, responsable del tratamiento de tus datos personales en relación con los tratamientos realizados para la gestión de dicho programa de fidelización. La dirección de Avios Group (AGL) Limited es Astral Towers, Betts Way, Crawley RH10 9XX, Reino Unido. Su página web es www.aviosgroup.com y su Oficina de Protección de Datos puede contactarse por correo ordinario dirigido a “Data Protection Officer” en la dirección antes indicada, y por correo electrónico dirigido a data.protection@avios.com .'
                                },
                                {
                                    'title': '¿Qué entendemos por datos personales?',
                                    'description': 'Se entiende por datos personales aquellos datos que te identifican o podrían emplearse para ello, como por ejemplo tu nombre, datos de contacto y tu historial de viajes y compras. También pueden incluir información sobre cómo utilizas nuestro sitio web y las aplicaciones para el móvil.'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        'warningMessages': {
            'status': false,
            'simpleAdvises': null,
            'checkAdvises': null
        }
    },
    'prefixesList': [
        {
            'code': '93',
            'description': 'Afganistán / +93',
            'countryCode': 'AF'
        },
        {
            'code': '355',
            'description': 'Albania / +355',
            'countryCode': 'AL'
        }
    ],
    'companiesList': [
        {
            'iataCompanyCode': 'IB',
            'airlineName': 'Iberia'
        }
    ],
    'businessCodeType': [
        {
            'name': 'On Business',
            'code': 'OB'
        },
        {
            'name': 'Business',
            'code': 'C'
        }
    ],
    'countriesList': [
        {
            'code': 'ES',
            'description': 'España',
            'isoCode': 'ESP'
        },
        {
            'code': 'AF',
            'description': 'Afganistán',
            'isoCode': 'AFG'
        }
    ],
    'frequentlyPassengers': [],
    phonePrefixFallback: false
};

export const fullAdultData :PassengersFormData = {
    'phonePrefixFallback':false,
    'securityInfo': {
        'passengerInfo': [
            {
                'frequentlyPassengers': [],
                'options': {
                    'haveBirthdate': false,
                    'haveName': false,
                    'haveSurname': false,
                    'haveLastName': false,
                    'haveIbPlus': false,
                    'haveGender': false,
                    'resident': {
                        'haveError': false,
                        'errorMessage': ''
                    }
                },
                'isValidForm': false,
                'id': 'ADULT_02',
                'type': 'ADULT',
                'name': {
                    'name': 'GENERAL_LABEL_PASSENGER',
                    'pasNumber': 2,
                    'needsTranslate': true
                },
                'requiredFields': {
                    'SURNAME': {},
                    'COMMUNITY_CODE': {
                        'values': [
                            {
                                'code': '410917',
                                'description': 'Andalucía'
                            }
                        ]
                    },
                    'MUNICIPALITY_CODE': {
                        'values': [
                            {
                                'code': '070012',
                                'description': 'Alaró'
                            },
                            {
                                'code': '070162',
                                'description': 'Consell'
                            },
                            {
                                'code': '070178',
                                'description': 'Costitx'
                            },
                            {
                                'code': '070184',
                                'description': 'Deyá'
                            },
                            {
                                'code': '070197',
                                'description': 'Escorca'
                            }
                        ]
                    },
                    'LARGE_FAMILY_NUMBER': {},
                    'NAME': {}
                },
                'serviceErrors': [],
                'optionalDocs': {
                    'CUI': {
                        'code': 'CUI',
                        'description': 'CUI',
                        'showFields': {
                            'NUM_DOC': {}
                        },
                        'number': '1234567'
                    },
                    'NIT': {
                        'code': 'NIT',
                        'description': 'NIT',
                        'showFields': {
                            'NUM_DOC': {}
                        },
                        'number': ''
                    },
                    'PP': {
                        'code': 'PP',
                        'description': 'Pasaporte',
                        'showFields': {
                            'NUM_DOC': {}
                        },
                        'number': ''
                    }
                },
                'specialNeeds': {
                    'availableTypes': [
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS',
                        'BLND',
                        'DEAF',
                        'DPNA',
                        'SVAN',
                        'WCHC',
                        'WCHR',
                        'WCHS'
                    ],
                    'specialVision': false,
                    'specialHearing': true,
                    'specialGuideDog': false,
                    'specialIntellDisability': true,
                    'specialWheelchair': true,
                    'specialWheelchairValue': 'WCHR',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
                        }
                    ],
                    'isEnable': true
                },
                'isSelected': false,
                'canBeInCharge': true,
                'mandatoryDocs': [
                    {
                        'code': 'DN',
                        'description': 'DNI',
                        'showFields': {
                            'NUM_DOC': {}
                        },
                        'number': '13153535L'
                    },
                    {
                        'code': 'MR',
                        'description': 'Menor de edad sin DNI',
                        'showFields': {
                            'BIRTH_DATE': {}
                        },
                        'number': ''
                    },
                    {
                        'code': 'TR',
                        'description': 'Tarjeta Residente / NIE',
                        'showFields': {
                            'NUM_DOC': {}
                        },
                        'number': ''
                    }
                ],
                'data': {
                    'name': 'test',
                    'surname': 'test',
                    'lastSurname': '',
                    'mandatoryDoc': {
                        'code': 'DN',
                        'description': 'DNI',
                        'number': '13153535L',
                        'showFields': {
                            'NUM_DOC': {}
                        }
                    },
                    'optionalDoc': {
                        'code': 'PP',
                        'description': 'Pasaporte',
                        'number': '123456',
                        'showFields': {
                            'NUM_DOC': {}
                        }
                    },
                    'residentDiscountInfo': {
                        'municipalityCode': '070197'
                    },
                    'largeFamilyDiscountInfo': {
                        'communityCode': {
                            'code': '410917',
                            'description': 'Andalucía'
                        },
                        'largeFamilyCertificateNumber': '(AAAA)999-9999-99999999-9',
                        'communityCodePattern': '(AAAA)999-9999-99999999-9'
                    },
                    'gender': 'MALE',
                    'freqFlyerInfo': {
                        'company': {
                            'iataCompanyCode': 'IB',
                            'airlineName': 'Iberia'
                        },
                        'number': '88888888888888888888'
                    },
                    'freqFlyerSelected': true,
                    'OBNumberSelected': false,
                    'OBNumberInfo': null,
                    'personInCharge': null,
                    'birthDate': [
                        '',
                        '',
                        ''
                    ]
                }
            }
        ],
        'isLogged': false,
        'isResident': true,
        'iTravel': true,
        'passengerInfoLogged': {
            name:'test',
            surname1: 'test',
            surname2: '',
            ibPlusNumber: '00559234',
            selectedDoc:null
        },
        'contactData': {
            'isValidForm': false,
            'contactPhone': '',
            'contactEmail': '',
            'contactPrefix': {
                'code': '+34',
                'description': 'España / +34',
                'countryCode': 'ES'
            },
            'isNewsLetters': false,
            'denyNewsLetters': false
        },
        'frequentlyPassengers': [],
        'largeFamilyDiscountInfo': {
            'largeFamilyCertificateNumber': '',
            'communityCode': {
                code: '410917',
                description: 'Andalucía'
            }
        },
        'totalPrice': '122,41€',
        'totalPriceWithOutDiscount': '285,50€',
        'totalPriceWithDiscount': '122,41€',
        'aviosInfo': {
            'redemptionAvios': 698,
            'cashDiscountWithAvios': '0€'
        },
        'onHold': {
            'holdTimes': '72',
            'maxFreeTime': 0,
            'moreTimePrice': 5,
            'minPrice': '5,00€',
            'freePrice': 0,
            'freeOption': false,
            'payOption': true,
            'holdTimesFree': '',
            'holdTimesPay': 72,
            'onHoldOptionText': 'Haz tu reserva ahora y confírmala en 72h por 5,00€. Esta cantidad se descontará del precio final.'
        },
        'onHoldIfIsLogged': null,
        'discounts': [],
        'summaryInfo': {
            'trips': [
                {
                    'idTrip': 'MADPMI20251009120500',
                    'stopsNumber': 0,
                    'fare': {
                        'name': 'Básica',
                        'cabin': 'Turista',
                        'fareDetails': {
                            'CABINA': {
                                'name': 'Cabina',
                                'message': 'Cabina Turista'
                            },
                            'EQMANO': {
                                'name': 'Equipaje de mano',
                                'message': 'Equipaje de mano: 1 pieza'
                            }
                        }
                    },
                    'segments': [
                        {
                            'idSegment': 'IB166320251009',
                            'departure': {
                                'code': 'MAD',
                                'name': 'ADOLFO SUAREZ BARAJAS',
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
                            'departureDate': {
                                'dateTime': '12:05',
                                'weekDay': 'WEEKDAY_THURSDAY',
                                'hour': 2,
                                'minutes': 0,
                                'day': 9,
                                'monthNumber': 10,
                                'month': 'MONTH_OCTOBER',
                                'year': 2025,
                                'formatedDate': '2025-10-09 12:05'
                            },
                            'arrival': {
                                'code': 'PMI',
                                'name': 'PALMA DE MALLORCA',
                                'terminal': '',
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
                            'arrivalDate': {
                                'dateTime': '13:30',
                                'weekDay': 'WEEKDAY_THURSDAY',
                                'hour': 2,
                                'minutes': 0,
                                'day': 9,
                                'monthNumber': 10,
                                'month': 'MONTH_OCTOBER',
                                'year': 2025,
                                'formatedDate': '2025-10-09 13:30'
                            },
                            'flightNumber': '1663',
                            'operatedBy': 'Iberiaexpress',
                            'aircraftType': 'Airbus A321neo',
                            'duration': '1h 25min.',
                            'waitingTime': 0,
                            'waitingParsedTime': '',
                            'cabin': 'Turista',
                            'operationalDisclosure': 'I2',
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'displayMarketingFlightNumber': '1663',
                            '$$hashKey': 'object:1056'
                        }
                    ],
                    '$$hashKey': 'object:1034'
                },
                {
                    'idTrip': 'PMIMAD20251112091500',
                    'stopsNumber': 0,
                    'fare': {
                        'name': 'Básica',
                        'cabin': 'Turista',
                        'fareDetails': {
                            'CABINA': {
                                'name': 'Cabina',
                                'message': 'Cabina Turista'
                            },
                            'EQMANO': {
                                'name': 'Equipaje de mano',
                                'message': 'Equipaje de mano: 1 pieza'
                            }
                        }
                    },
                    'segments': [
                        {
                            'idSegment': 'IB165220251112',
                            'departure': {
                                'code': 'PMI',
                                'name': 'PALMA DE MALLORCA',
                                'terminal': '',
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
                            'departureDate': {
                                'dateTime': '09:15',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 11,
                                'month': 'MONTH_NOVEMBER',
                                'year': 2025,
                                'formatedDate': '2025-11-12 09:15'
                            },
                            'arrival': {
                                'code': 'MAD',
                                'name': 'ADOLFO SUAREZ BARAJAS',
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
                            'arrivalDate': {
                                'dateTime': '10:40',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 11,
                                'month': 'MONTH_NOVEMBER',
                                'year': 2025,
                                'formatedDate': '2025-11-12 10:40'
                            },
                            'flightNumber': '1652',
                            'operatedBy': 'Iberiaexpress',
                            'aircraftType': 'Airbus A321neo',
                            'duration': '1h 25min.',
                            'waitingTime': 0,
                            'waitingParsedTime': '',
                            'cabin': 'Turista',
                            'operationalDisclosure': 'I2',
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'displayMarketingFlightNumber': '1652',
                            '$$hashKey': 'object:1060'
                        }
                    ],
                    '$$hashKey': 'object:1035'
                }
            ],
            'passengers': {
                'generalData': {
                    'ADULT': [
                        {
                            'number': 1,
                            'totalTax': 27.21,
                            'totalTaxWithDiscount': 27.21,
                            'totalTaxWithoutDiscount': 27.21,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD|JD',
                                    'amount': '19,46€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'QV|QV',
                                    'amount': '6,53€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'OG|OG',
                                    'amount': '1,22€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad',
                                    'subcode': '001',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                }
                            ],
                            'fare': 93.49,
                            'fareWithoutDiscount': 93.49,
                            'fareWithDiscount': 18.7,
                            'parsedFare': '93€',
                            'parsedFareWithDiscount': '19€',
                            'parsedFareWithoutDiscount': '93€',
                            'parsedTotalTax': '27,21€',
                            'parsedTotalTaxWithDiscount': '27,21€',
                            'parsedTotalTaxWithoutDiscount': '27,21€',
                            '$$hashKey': 'object:1042'
                        },
                        {
                            'number': 1,
                            'totalTax': 27.21,
                            'totalTaxWithDiscount': 27.21,
                            'totalTaxWithoutDiscount': 27.21,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD|JD',
                                    'amount': '19,46€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'QV|QV',
                                    'amount': '6,53€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'OG|OG',
                                    'amount': '1,22€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad',
                                    'subcode': '001',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                }
                            ],
                            'fare': 93.49,
                            'fareWithoutDiscount': 93.49,
                            'fareWithDiscount': 18.7,
                            'parsedFare': '93€',
                            'parsedFareWithDiscount': '19€',
                            'parsedFareWithoutDiscount': '93€',
                            'parsedTotalTax': '27,21€',
                            'parsedTotalTaxWithDiscount': '27,21€',
                            'parsedTotalTaxWithoutDiscount': '27,21€',
                            '$$hashKey': 'object:1043'
                        }
                    ],
                    'INFANT': [
                        {
                            'number': 1,
                            'totalTax': 27.21,
                            'totalTaxWithDiscount': 27.21,
                            'totalTaxWithoutDiscount': 27.21,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD|JD',
                                    'amount': '19,46€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'QV|QV',
                                    'amount': '6,53€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad',
                                    'subcode': '003',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                },
                                {
                                    'code': 'OG|OG',
                                    'amount': '1,22€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad',
                                    'subcode': '001',
                                    'country': 'ES',
                                    'carrier': null,
                                    'origin': 'PMI'
                                }
                            ],
                            'fare': 16.89,
                            'fareWithoutDiscount': 16.89,
                            'fareWithDiscount': 3.38,
                            'parsedFare': '17€',
                            'parsedFareWithDiscount': '3€',
                            'parsedFareWithoutDiscount': '17€',
                            'parsedTotalTax': '27,21€',
                            'parsedTotalTaxWithDiscount': '27,21€',
                            'parsedTotalTaxWithoutDiscount': '27,21€',
                            '$$hashKey': 'object:1046'
                        }
                    ]
                }
            },
            'otherFees': []
        },
        'relatedContent': {
            'SPECIAL_NEED_CONTACT_INFO': {},
            'TOTAL_PRICE': {},
            'OBSERVATIONS': {},
            'FARE_CONDITIONS': {}
        },
        'gdprInfo': {
            'text': [
                {
                    'type': 'text',
                    'value': 'El responsable del tratamiento de tus datos es Iberia L.A.E. S.A. Operadora, Sociedad Unipersonal (en adelante, “Iberia”) con domicilio social en calle Martínez Villergas 49, 28027 Madrid.Tus datos se tratarán para (i) la gestión de los servicios contratados, en base a la ejecución del contrato; (ii) el envío del Boletín de noticias, ofertas y promociones de productos y servicios de Iberia, relacionados con los productos ya contratados, en base al interés legítimo.Los destinatarios de tus datos son entidades del Grupo IAG al que IBERIA pertenece.El usuario podrá revocar en cualquier momento su consentimiento, así como ejercitar los derechos de oposición, acceso, portabilidad, rectificación, limitación y supresión de datos.Puedes conocer el detalle de la información que aquí se expone a través de la '
                },
                {
                    'type': 'link',
                    'value': 'política de privacidad',
                    'attrs': {
                        'target': '_blank',
                        'href': '#',
                        'title': 'Política de privacidad',
                        'data-contenttype': 'CustomLink_C',
                        'data-contentid': '1476373673799',
                        'data-contentorigin': '1476373673799'
                    }
                },
                {
                    'type': 'text',
                    'value': '.'
                }
            ],
            'modals': [
                {
                    'code': '1476373673799',
                    'title': 'Política de protección de datos personales para clientes y pasajeros',
                    'subtitle': '',
                    'elements': [
                        {
                            'type': 'Accordion_C',
                            'title': '',
                            'subTitle': '',
                            'description': 'Nuestro Compromiso con la PrivacidadIberia se compromete a respetar tu privacidad y a proteger tus datos personales.Seremos totalmente transparentes acerca de los datos que recabemos y el uso que hagamos de ellos.Utilizaremos los datos que nos proporciones para los fines descritos en nuestra Política de Privacidad, entre los que se encuentra prestarte los servicios que has solicitado y mejorar tu experiencia con Iberia.Asimismo, utilizaremos los datos para intentar conocerte mejor y así poder enviarte ofertas relevantes.Si nos comunicas que no quiere recibir comunicaciones comerciales, dejaremos de enviártelas. Por supuesto, seguiremos enviándote información importante relacionada con un producto o servicio que hayas adquirido para mantenerte informado acerca de tu reserva e itinerario de viaje.Te remitiremos información cuando resulte relevante para el producto o servicio que hayas adquirido, a fin de mantenerte informado sobre tu reserva e itinerario de viaje.Adoptaremos las medidas necesarias para proteger y mantener a salvo tu información.Respetaremos los derechos de protección de datos y trataremos de cederte el control sobre tu propia información.La Política de Privacidad que le detallamos a continuación podrá ayudarle a comprender mejor cómo utilizamos sus datos personales. En ella explicamos con más detalle los tipos de datos personales que recabamos, cómo los recabamos, con qué fines podemos utilizarlos y con quién podemos compartirlos.A lo largo de la Política de Privacidad encontrará una serie de ejemplos específicos de por qué y cómo usamos sus datos personales. Si tiene cualquier duda, por favor póngase en contacto con nosotros escribiendo a nuestra Oficina de Protección de Datos por correo electrónico a OficinaDPO@iberia.es .Sin perjuicio de los derechos que le correspondan bajo las leyes que resulten de aplicación, la Política de Privacidad y la información anterior no tienen carácter contractual ni forman parte de su contrato con nosotros.',
                            'items': [
                                {
                                    'title': 'Responsable del Tratamiento de Datos Personales',
                                    'description': 'Todos los datos personales tratados por Iberia en relación con la presente Política de Privacidad son responsabilidad de Iberia Líneas Aéreas de España S.A. Operadora, Sociedad Unipersonal, CIF A85850394 (en adelante, “IBERIA”), la cual tiene consideración de “responsable del tratamiento” bajo la normativa aplicable en materia de protección de datos. Nuestra dirección de contacto a estos efectos es “Oficina de Protección de Datos de Iberia Líneas Aéreas de España S.A. Operadora, Sociedad Unipersonal”, en Calle Martínez Villergas, 49, 28027 de Madrid, España o a través de la dirección de correo electrónico antes mencionada.Si has realizado una reserva con nosotros pero uno o varios de los vuelos están operados por otras compañías aéreas, cada una de esas compañías aéreas será asimismo, de forma independiente, responsable del tratamiento bajo la normativa aplicable en materia de protección de datos.Cualquier tercero prestador de servicios accesibles a través de nuestra web, como puede ser un hotel o una empresa de alquiler de vehículos, también será responsable del tratamiento individualmente. Podrás acceder a los servicios que ofrecen estas terceras empresas a través de nuestra página web, que directamente te redireccionará a sus correspondientes webs, donde encontrarás las políticas de protección de datos de dichos proveedores.IBERIA es una entidad perteneciente al Grupo IAG cuya sociedad de cabecera es la entidad de nacionalidad española International Consolidated Airlines Group, S.A.. Más abajo encontrarás información adicional sobre las sociedades que conforman el Grupo IAG.Si eres miembro del Programa de fidelización IBERIA PLUS, la entidad Avios Group Limited (“AGL”) igualmente perteneciente al Grupo IAG también será, de forma conjunta con IBERIA, responsable del tratamiento de tus datos personales en relación con los tratamientos realizados para la gestión de dicho programa de fidelización. La dirección de Avios Group (AGL) Limited es Astral Towers, Betts Way, Crawley RH10 9XX, Reino Unido. Su página web es www.aviosgroup.com y su Oficina de Protección de Datos puede contactarse por correo ordinario dirigido a “Data Protection Officer” en la dirección antes indicada, y por correo electrónico dirigido a data.protection@avios.com .'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        'originalDiscounts': [],
        'warningMessages': {
            'status': true,
            'simpleAdvises': [
                {
                    'id': 'advice-01',
                    'title': 'IBAIRP_WARNING_MESSAGE_TITLE',
                    'checkBox': null,
                    'checkBoxText': null,
                    'checkBoxConditions': false,
                    'showCheckBoxError': false,
                    'text': ''
                },
                {
                    'id': 'advice-02',
                    'title': 'IBAIRP_WARNING_MESSAGE_TITLE',
                    'text': '',
                    'checkBox': null,
                    'checkBoxText': null,
                    'checkBoxConditions': false,
                    'showCheckBoxError': false
                }
            ],
            'checkAdvises': null
        }
    },
    'prefixesList': [
        {
            'code': '93',
            'description': 'Afganistán / +93',
            'countryCode': 'AF'
        }
    ],
    'companiesList': [
        {
            'iataCompanyCode': 'IB',
            'airlineName': 'Iberia'
        }
    ],
    'businessCodeType': [
        {
            'name': 'On Business',
            'code': 'OB'
        },
        {
            'name': 'Business',
            'code': 'C'
        }
    ],
    'countriesList': [
        {
            'code': 'ES',
            'description': 'España',
            'isoCode': 'ESP'
        },
        {
            'code': 'AF',
            'description': 'Afganistán',
            'isoCode': 'AFG'
        }
    ],
    'frequentlyPassengers': []
};

export const fullChildData = {
    ...fullAdultData,
    securityInfo:{
        ...fullAdultData.securityInfo,
        passengerInfo:[{
            ...fullAdultData.securityInfo.passengerInfo[0],
            requiredFields:{
                ...fullAdultData.securityInfo.passengerInfo[0].requiredFields,
                BIRTH_DATE:{}
            },
            id: 'CHILD_01',
            type: 'CHILD'

        }],
        passengerInfoLogged:{
            ...fullAdultData.securityInfo.passengerInfoLogged,
            birthDate:'2025-12-26'
        }
    }
};
export const fullInfantData :PassengersFormData= {
    ...fullAdultData,
    securityInfo:{
        ...fullAdultData.securityInfo,
        passengerInfo:[
            {
                ...fullAdultData.securityInfo.passengerInfo[0],
                requiredFields: {
                    ...fullAdultData.securityInfo.passengerInfo[0].requiredFields,
                    BIRTH_DATE: {}
                },
                id: 'INFANT_01',
                type: 'INFANT',
                data: {
                    ...fullAdultData.securityInfo.passengerInfo[0].data,
                    largeFamilyType: 'GENERAL',
                    OBNumberSelected: true,
                    OBNumberInfo: {
                        businessCodeType: {
                            code: '056652',
                            name: 'On Business'
                        },
                        number: '65522'
                    }
                },
                residentDiscountInfo: {
                    municipalityCode: '070197'
                },
                largeFamilyDiscountInfo: {
                    communityCode: {
                        code: '410917',
                        description: 'Andalucía'
                    },
                    largeFamilyCertificateNumber: '',
                    communityCodePattern: ''
                },
                canBeInCharge: false,
                frequentlyPassengers: []
            },
            fullAdultData.securityInfo.passengerInfo[0]
        ],
        passengerInfoLogged:{
            ...fullAdultData.securityInfo.passengerInfoLogged,
            birthDate:'2027-11-28',
            selectedDoc: {
                code: 'DN',
                description: 'DNI',
                showFields: {
                    NUM_DOC: {}
                },
                number: '13153535L'
            }
        }
    }
};
