describe('FlightsPassengersTransformer test', function () {

    const mockAuxPas = {
        id: 1,
        type: "ADULT",
        pasStatus: {
            available: true,
            isChecked: true,
            reason: null,
            isApiEsta: false,
            hasSBY: true,
        },
        requiresApis: false,
        fieldStatus: {
            contactData: {
                available: true,
                show: true,
                mandatory: false,
            },
            emergencyData: {
                available: true,
                show: true,
                mandatory: false,
            },
            gender: {
                show: false,
                mandatory: false,
            },
            frequentFlyer: {
                show: true,
                mandatory: false,
                isOpenPA: false,
            },
        },
        requiredInformation: [],
        isSelected: false,
        name: "FEDERICO",
        surname: "GARCIAGARCIA",
        gender: "MALE",
        infant: null,
        contactData: {
            denyNewsLetter: false,
            phone: {
                countryCode: "34",
                number: "123456789",
            },
            emergency: {
                phone: {
                    countryCode: "34",
                },
            },
            email: "TEST@TEST.COM",
            available: true,
        },
        initialData: {
            contact: {
                gender: "MALE",
                phone: {
                    countryCode: "34",
                    number: "123456789",
                },
                email: "TEST@TEST.COM",
                frequentFlyer: {
                    info: {
                        number: "",
                        iataCompanyCode: "",
                    },
                    enabled: true,
                },
            },
            emergency: {
                phone: {
                    countryCode: "34",
                },
            },
        },
        inhibitBoardingCard: {
            status: false,
            reason: [],
            url: "",
        },
        frequentFlyer: {
            info: {
                number: "",
                iataCompanyCode: "",
            },
            enabled: true,
        },
        language: "es",
    };

    var FlightsPassengersTransformer;

    var fakeIbUtilsService = {
        getAirlineLogos: jasmine.createSpy('getAirlineLogos').and.callFake(function () {
            return { companyDisabledURL: 'companyDisabledURL', companyURL: 'companyURL' };
        }),
        getDeviceType: jasmine.createSpy(),
        getAppMarket: jasmine.createSpy('getAppMarket').and.returnValue('es'),
        getPrefixFromMarket: jasmine.createSpy('getPrefixFromMarket').and.returnValue({ code: 'es' })
    };
    var fakePassengerBookingService = {
        updateLanguageAdditionalInfo: jasmine.createSpy('updateLanguageAdditionalInfo')
    };

    var fakeFlightsPassengersUtils = {
        getGeneralSegmentInfo: jasmine.createSpy('getGeneralSegmentInfo'),
        getDetailedSegmentInfo: jasmine.createSpy('getDetailedSegmentInfo').and.callFake(function () {
            return {
                'id': 3,
                'departure': {
                    'cityDescription': '',
                    'cityCode': '',
                    'airportDescription': 'BARAJAS',
                    'airportCode': 'MAD',
                    'terminal': '4S',
                    'originalDate': '2021-07-28 16:30',
                    'date': {
                        'weekDay': 'WEEKDAY_WEDNESDAY',
                        'monthDay': 28,
                        'monthNumber': 7,
                        'month': 'MONTH_JULY',
                        'year': 2021
                    },
                    'hour': '16:30'
                },
                'arrival': {
                    'cityDescription': '',
                    'cityCode': '',
                    'airportDescription': 'ELDORADO',
                    'airportCode': 'BOG',
                    'terminal': '1',
                    'originalDate': '2021-07-28 19:31',
                    'date': {
                        'weekDay': 'WEEKDAY_WEDNESDAY',
                        'monthDay': 28,
                        'monthNumber': 7,
                        'month': 'MONTH_JULY',
                        'year': 2021
                    },
                    'hour': '19:31'
                },
                'cabinClass': {
                    'code': 'B',
                    'type': 'ECONOMY',
                    'description': 'Turista',
                    'fareFamily': null,
                    'mainClass': 'Y'
                },
                'type': 'FLIGHT',
                'flown': false,
                'airlineName': 'Iberia',
                'airlineLogo': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                'flightCode': 'IB',
                'flightNumber': 'IB6585',
                'operatedBy': 'Iberia'
            };
        }),
        getPassengerInfo: jasmine.createSpy('getPassengerInfo').and.returnValue(mockAuxPas)
    };
    var fakeCheckinAppConstants = {
        FLIGHT_TYPES: {
            'REGULAR': 'REGULAR',
            'SHUTTLE': 'SHUTTLE'
        },
        FLIGHT_PASSENGERS_STATUS: {
            'CHECKED': 'CHECKED',
            'STANDBY': 'STANDBY',
            'AVAILABLE': 'AVAILABLE',
            'NOT_AVAILABLE': 'NOT_AVAILABLE',
            'SELECTABLE': 'SELECTABLE',
            'NOT_ALLOWED': 'NOT_ALLOWED'
        },
        FLIGHT_PASSENGERS_STATUS_LIST: {
            'CHECKED': ['CHECKED', 'STANDBY', 'REISSUE'],
            'AVAILABLE': ['CHECKABLE', 'PENDING_AQQ', 'PENDING_EVUS'],
            'NOT_AVAILABLE': ['UNCHECKABLE'],
            'SHUTTLE': ['OPEN', 'CONFIRMED']
        },
        PASSENGERS_TYPES: {
            'ADULT': 'ADULT',
            'CHILD': 'CHILD',
            'INFANT': 'INFANT'
        },
        GENERAL_STATUS: {
            'AVAILABLE': 'AVAILABLE',
            'NOT_AVAILABLE': 'NOT_AVAILABLE',
            'CHECKED': 'CHECKED'
        },
        INHIBIT_BOARDING_CARD_TYPES: {
            'SEE_AGENT_REASON': 'SEE_AGENT_REASON',
            'AIRCHECK_REASON': 'AIRCHECK_REASON',
            'BOKO_AIRCHECK_REASON': 'BOKO_AIRCHECK_REASON',
            'INHIBIT_REASON': 'INHIBIT_REASON',
            'UMNR_REASON': 'UMNR_REASON',
            'RESI_REASON': 'RESI_REASON',
            'AVIH_REASON': 'AVIH_REASON',
            'PETC_REASON': 'PETC_REASON',
            'COUR_REASON': 'COUR_REASON'
        }
    };
    var fakeFlightsPassengersConstants = {
        'DEFAULT_COMPANY_CODE': 'CKI_COMBO_BLANK',
        'WHAT_TO_DO_OPTIONS': {
            'DUPLICATED': [
                {
                    'id': 'print',
                    'title': 'IBCOAC_WHAT_TO_DO_BOARDING_CARDS_TITLE',
                    'icon': 'icon-imprimir',
                    'type:': 'REGULAR',
                    'isSelected': false
                },
                {
                    'id': 'manageCki',
                    'title': 'IBCOAC_PASS_DUPLICADO',
                    'icon': 'icon-e_equipaje',
                    'type:': 'REGULAR',
                    'isSelected': false
                }
            ],
            'FLYNOW_CONFIRMATION': [
                {
                    'id': 'print',
                    'title': 'IBCOAC_WHAT_TO_DO_BOARDING_CARDS_TITLE',
                    'icon': 'icon-imprimir',
                    'type:': 'REGULAR',
                    'isSelected': false
                },
                {
                    'id': 'MODIFY_SEGMENT',
                    'title': 'IBCOAC_PA_WHAT_TO_DO_MODIFY',
                    'icon': 'icon-cambios_y_reembolsos',
                    'nextStep': 'flyNow',
                    'isSelected': false
                }
            ]
        }
    };
    var fakeContentPreprocessorService = {
        processContent: jasmine.createSpy()
    };
    var fakeIbSessionConfigService = {
        cleanDataSoftUser: jasmine.createSpy('cleanDataSoftUser'),
        isUserLogged: jasmine.createSpy('getEndpoint').and.callFake(function () {
            return 'endpoint'
        })
    };

    const fakeLocalStorageService = {
        get: jasmine.createSpy('get'),
        set: jasmine.createSpy('set'),
        remove: jasmine.createSpy('remove')
    }

    // mock
    var mockFlightsPassengersData = {
        'checkinId': 'Q2hlY2tpbkBJTlRFUk5FVF9XRUJfSUJFUklBX2liZXJpYV93ZWJfUDEzMTk2N18yOC8wNy8yMDIxIDEyOjA2OjI1XzQ3MzdfSUJDT00wNDFuV0VCMDNfOTA5MF92Mw%3D%3D',
        'resiberLocator': 'KMMJB',
        'gdsLocator': 'KMMJB',
        'checkinFlowMode': 'REGULAR',
        'passengers': [
            {
                'id': 1,
                'name': 'CHILD',
                'surname': 'UNO',
                'title': null,
                'gender': null,
                'type': 'CHILD',
                'frequentFlyer': null,
                'resident': false,
                'requiredInformation': [
                    'API',
                    'CONTACT_DATA'
                ],
                'optionalInformation': [
                    'EMERGENCY_DATA',
                    'FREQUENT_FLYER'
                ],
                'status': {
                    'code': 'ALLOWED',
                    'reason': null
                },
                'infant': null,
                'pendingPayment': false
            },
            {
                'id': 2,
                'name': 'PASAJERO',
                'surname': 'UNO',
                'title': null,
                'gender': 'MALE',
                'type': 'ADULT',
                'frequentFlyer': null,
                'resident': false,
                'requiredInformation': [
                    'API'
                ],
                'optionalInformation': [
                    'GENDER',
                    'CONTACT_DATA',
                    'EMERGENCY_DATA',
                    'FREQUENT_FLYER'
                ],
                'status': {
                    'code': 'ALLOWED',
                    'reason': null
                },
                'infant': {
                    'name': 'INFANT',
                    'surname': 'UNO'
                },
                'pendingPayment': false
            }
        ],
        'checkinSegmentsInGroup': [
            4
        ],
        'outwardSegments': [
            {
                'id': 3,
                'departure': {
                    'date': '2021-07-28 16:30',
                    'utcDate': '2021-07-28 14:30',
                    'airport': {
                        'code': 'MAD',
                        'description': 'BARAJAS',
                        'country': 'ES'
                    },
                    'terminal': '4S'
                },
                'arrival': {
                    'date': '2021-07-28 19:31',
                    'utcDate': '2021-07-29 00:31',
                    'airport': {
                        'code': 'BOG',
                        'description': 'ELDORADO',
                        'country': 'CO'
                    },
                    'terminal': '1'
                },
                'boarding': {
                    'date': '2021-07-28 15:50',
                    'utcDate': '2021-07-28 13:50',
                    'airport': {
                        'code': 'MAD',
                        'description': 'BARAJAS',
                        'country': 'ES'
                    },
                    'terminal': '4S',
                    'gate': '????'
                },
                'passengers': [
                    {
                        'id': 1,
                        'seat': {
                            'row': '33',
                            'column': 'E'
                        },
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'STANDBY',
                            'message': null
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752395619972',
                            'coupon': '1',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': null,
                        'farebasis': 'BDH0NNM0/C',
                        'inhibitBoardingCard': [],
                        'items': [],
                        'airCheckDocumentationRequired': false
                    },
                    {
                        'id': 2,
                        'seat': {
                            'row': '33',
                            'column': 'H'
                        },
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'CHECKABLE',
                            'message': null
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752395619971',
                            'coupon': '1',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': {
                            'number': '0752395619973',
                            'coupon': '1',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'farebasis': 'BDH0NNM0',
                        'items': [],
                        'airCheckDocumentationRequired': false
                    }
                ],
                'operatingFlightNumber': {
                    'company': {
                        'code': 'IB',
                        'description': 'Iberia'
                    },
                    'number': '6585'
                },
                'marketingFlightNumber': null,
                'cabinClass': {
                    'code': 'B',
                    'type': 'ECONOMY',
                    'description': 'Turista',
                    'fareFamily': null,
                    'mainClass': 'Y'
                },
                'estimatedFlightTime': '10:01:00',
                'typeOfTransport': 'FLIGHT',
                'flown': false,
                'aircraft': {
                    'model': '359',
                    'cabins': [
                        'BUSINESS',
                        'PREMIUMTOURIST',
                        'ECONOMY'
                    ]
                },
                'airCheckURL': '',
                'airCheck': true
            }
        ],
        'returnSegments': [
            {
                'id': 4,
                'departure': {
                    'date': '2021-08-05 21:15',
                    'utcDate': '2021-08-06 02:15',
                    'airport': {
                        'code': 'BOG',
                        'description': 'ELDORADO',
                        'country': 'CO'
                    },
                    'terminal': '1'
                },
                'arrival': {
                    'date': '2021-08-06 14:10',
                    'utcDate': '2021-08-06 12:10',
                    'airport': {
                        'code': 'MAD',
                        'description': 'BARAJAS',
                        'country': 'ES'
                    },
                    'terminal': '4S'
                },
                'boarding': null,
                'passengers': [
                    {
                        'id': 1,
                        'seat': null,
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'UNCHECKABLE',
                            'message': 'Todavía no se encuentra el vuelo abierto a check-in. Recuerda que los vuelos se abren a check-in con 24 horas de antelación. Si estás dentro de las 24 horas previas a la salida del vuelo puede ser que el vuelo se encuentre momentáneamente cerrado para realizar algún ajuste operativo. Por favor intenta acceder más tarde. Disculpa las molestias'
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752395619972',
                            'coupon': '2',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': null,
                        'farebasis': 'NVL0NQB6/C',
                        'items': [],
                        'airCheckDocumentationRequired': false
                    },
                    {
                        'id': 2,
                        'seat': null,
                        'altLocator': null,
                        'noShow': false,
                        'flyNow': false,
                        'status': {
                            'code': 'UNCHECKABLE',
                            'message': 'Todavía no se encuentra el vuelo abierto a check-in. Recuerda que los vuelos se abren a check-in con 24 horas de antelación. Si estás dentro de las 24 horas previas a la salida del vuelo puede ser que el vuelo se encuentre momentáneamente cerrado para realizar algún ajuste operativo. Por favor intenta acceder más tarde. Disculpa las molestias'
                        },
                        'mmbAvailable': false,
                        'ticket': {
                            'number': '0752395619971',
                            'coupon': '2',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'infantTicket': {
                            'number': '0752395619973',
                            'coupon': '2',
                            'issueDate': null,
                            'expiryDate': null,
                            'status': null
                        },
                        'farebasis': 'NVL0NQB6',
                        'items': [],
                        'airCheckDocumentationRequired': false
                    }
                ],
                'operatingFlightNumber': {
                    'company': {
                        'code': 'IB',
                        'description': 'Iberia'
                    },
                    'number': '6586'
                },
                'marketingFlightNumber': null,
                'cabinClass': {
                    'code': 'N',
                    'type': 'ECONOMY',
                    'description': 'Turista',
                    'fareFamily': null,
                    'mainClass': 'Y'
                },
                'estimatedFlightTime': '09:55:00',
                'typeOfTransport': 'FLIGHT',
                'flown': false,
                'aircraft': {
                    'model': '359',
                    'cabins': [
                        'BUSINESS',
                        'PREMIUMTOURIST',
                        'ECONOMY'
                    ]
                },
                'airCheckURL': null,
                'airCheck': false
            }
        ],
        'airShuttleSegments': [],
        'deepLinkInformation': null,
        'carrierConnectEnabled': false,
        'relatedContent': [
            {
                'key': 'IMMIGRATION_REQ_INFO',
                'value': 'AVISO IMPORTANTE: Su reserva incluye desplazamiento a Colombia.  Quienes quieran acceder al país han de cumplimentar un <a href="https://www.migracioncolombia.gov.co/controlpreventivocontraelcoronavirus" target="_blank">formulario online de información y contacto</a> previo a la entrada en el país'
            },
            {
                'key': 'IMMIGRATION_REQ_INFO',
                'value': 'AVISO IMPORTANTE: Si viajas a España desde el extranjero (incluyendo área Schengen), deberás rellenar un “Formulario de Control Sanitario”, en las 48h anteriores al vuelo, a través de la página <a href="www.spth.gob.es" target="_blank">www.spth.gob.es</a>, o bien descargándote la app en el móvil desde la misma página. Necesitarás conocer el asiento asignado para completarlo, así que te recomendamos que realices el check-in online antes. Una vez completado el proceso, obtendrás un código QR que podrás descargar en el móvil o imprimir, necesario para poder acceder a la recogida de equipaje y salir del terminal en tu destino.'
            }
        ]
    };

    var mockPrefixesList = [
        {
            'code': '34',
            'description': 'España / +34'
        },
        {
            'code': '716',
            'description': 'Zimbabue / +716'
        }
    ];

    var mockCompaniesList = [
        {
            'iataCompanyCode': 'IB',
            'airlineName': 'Iberia'
        },
        {
            'iataCompanyCode': 'AT',
            'airlineName': 'Royal Air Maroc'
        }
    ];

    var mockAdditionalInfo = [
        {
            'id': 1,
            'disruptionContact': {
                'language': 'es',
                'email': 'JESUS.SANCHA@PANEL.ES',
                'phone': {
                    'countryCode': {
                        'code': '34',
                        'description': 'España / +34'
                    },
                    'number': '6666666666'
                }
            }
        },
        {
            'id': 2,
            'disruptionContact': {
                'language': 'es',
                'email': 'JESUS.SANCHA@PANEL.ES',
                'phone': {
                    'countryCode': {
                        'code': '34',
                        'description': 'España / +34'
                    },
                    'number': '6666666666'
                }
            }
        }
    ];

    var mockEmergencyInfo = [
        {
            'emergencyContact': null,
            'passengerId': 1
        },
        {
            'emergencyContact': {
                phone: {
                    number: '123456789',
                    countryCode: null
                }
            },
            'passengerId': 2
        }
    ];

    var mockGdprData = {
        'text': 'El responsable del tratamiento de tus datos es Iberia L.A.E. S.A. Operadora, Sociedad Unipersonal (en adelante, “Iberia”) con domicilio social en calle Martínez Villergas 49, 28027 Madrid.Tus datos se tratarán para (i) la gestión de los servicios contratados, en base a la ejecución del contrato; (ii) el envío del Boletín de noticias, ofertas y promociones de productos y servicios de Iberia, relacionados con los productos ya contratados, en base al interés legítimo.Los destinatarios de tus datos son entidades del Grupo IAG al que IBERIA pertenece.El usuario podrá revocar en cualquier momento su consentimiento, así como ejercitar los derechos de oposición, acceso, portabilidad, rectificación, limitación y supresión de datos.Puedes conocer el detalle de la información que aquí se expone a través de la <a target="_blank" href="#" title="Política de privacidad" data-contenttype="CustomLink_C" data-contentid="1476373673799" data-contentorigin="1476373673799">política de privacidad</a>.',
        'modals': [
            {
                'code': '1476373673799',
                'title': 'Política de protección de datos personales para clientes y pasajeros',
                'subTitle': '',
                'elements': [
                    {
                        'type': 'accordion',
                        'description': 'Nuestro Compromiso con la PrivacidadIberia se compromete a respetar tu privacidad y a proteger tus datos personales.Seremos totalmente transparentes acerca de los datos que recabemos y el uso que hagamos de ellos.Utilizaremos los datos que nos proporciones para los fines descritos en nuestra Política de Privacidad, entre los que se encuentra prestarte los servicios que has solicitado y mejorar tu experiencia con Iberia.Asimismo, utilizaremos los datos para intentar conocerte mejor y así poder enviarte ofertas relevantes.Si nos comunicas que no quiere recibir comunicaciones comerciales, dejaremos de enviártelas. Por supuesto, seguiremos enviándote información importante relacionada con un producto o servicio que hayas adquirido para mantenerte informado acerca de tu reserva e itinerario de viaje.Te remitiremos información cuando resulte relevante para el producto o servicio que hayas adquirido, a fin de mantenerte informado sobre tu reserva e itinerario de viaje.Adoptaremos las medidas necesarias para proteger y mantener a salvo tu información.Respetaremos los derechos de protección de datos y trataremos de cederte el control sobre tu propia información.La Política de Privacidad que le detallamos a continuación podrá ayudarle a comprender mejor cómo utilizamos sus datos personales. En ella explicamos con más detalle los tipos de datos personales que recabamos, cómo los recabamos, con qué fines podemos utilizarlos y con quién podemos compartirlos.A lo largo de la Política de Privacidad encontrará una serie de ejemplos específicos de por qué y cómo usamos sus datos personales. Si tiene cualquier duda, por favor póngase en contacto con nosotros escribiendo a nuestra Oficina de Protección de Datos por correo electrónico a OficinaDPO@iberia.es .Sin perjuicio de los derechos que le correspondan bajo las leyes que resulten de aplicación, la Política de Privacidad y la información anterior no tienen carácter contractual ni forman parte de su contrato con nosotros.',
                        'title': '',
                        'subTitle': '',
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
    };

    var mockSummaryInfo = undefined;

    const mockGeneralInfo = {
        'segmentStatus': 'AVAILABLE',
        'segmentStatusReason': '',
        'passengersStatus': [
            {
                'id': 1,
                'status': 'STANDBY',
                'isSelected': true,
                'name': 'CHILD',
                'surname': 'UNO',
                'flyNow': false,
                'airCheckDocumentationRequired': false,
                'items': [],
                'inhibitBoardingCard': {
                    'reason': []
                }
            },
            {
                'id': 2,
                'status': 'CHECKABLE',
                'isSelected': true,
                'name': 'PASAJERO',
                'surname': 'UNO',
                'flyNow': false,
                'airCheckDocumentationRequired': false,
                'items': [],
                'inhibitBoardingCard': {
                    'reason': []
                }
            }
        ]
    };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-checkin-flights-passengers-module', function ($provide) {
            $provide.value('FlightsPassengersUtils', fakeFlightsPassengersUtils);
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('FlightsPassengersConstants', fakeFlightsPassengersConstants);
            $provide.value('ContentPreprocessorService', fakeContentPreprocessorService);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('IbPassengerBookingUtilsService', fakePassengerBookingService);
        });
        inject(function (_FlightsPassengersTransformer_, _localStorageService_) {
            FlightsPassengersTransformer = _FlightsPassengersTransformer_;
        });
    });

    beforeEach(() => {
        fakeFlightsPassengersUtils.getGeneralSegmentInfo.and.returnValue(mockGeneralInfo);
    });

    describe('FlightsPassengersTransformer function', function () {
        it('should delegate additional info language updates to IbPassengerBookingUtilsService', function () {
            const additionalInfo = [{
                id: 1,
                disruptionContact: { language: 'en' },
                frequentFlyer: null
            }];

            const result = FlightsPassengersTransformer.updateAdditionalInfo(additionalInfo, false, false);

            expect(fakePassengerBookingService.updateLanguageAdditionalInfo).toHaveBeenCalledWith(additionalInfo);
            expect(result).toEqual(additionalInfo);
        });

        it('correctly FlightsPassengers transform', function (done) {
            var returnFlightsPassengersTransformer = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, mockEmergencyInfo, mockGdprData, mockSummaryInfo);

            expect(returnFlightsPassengersTransformer.flightsPassengersInfo).toBeDefined();
            expect(returnFlightsPassengersTransformer.flightsPassengersInfo.checkinAvailable).toBe(true);
            expect(fakeLocalStorageService.set).toHaveBeenCalledWith('isFlowDuplicated', false);

            done();
        });

        describe('getPrefixes', () => {
            it('should return an object with defaultPrefix', (done) => {
                FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, mockEmergencyInfo, mockGdprData, mockSummaryInfo);

                expect(fakeIbUtilsService.getPrefixFromMarket).toHaveBeenCalled();

                done();
            });
        });

        describe('transformPhoneCountryCode', () => {
            it('should be null if the function don\'t had emergencyInfo', (done) => {
                const result = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, null, mockGdprData, mockSummaryInfo);

                expect(fakeLocalStorageService.get).toHaveBeenCalledWith('phoneCodeList');
                expect(fakeIbUtilsService.getAppMarket).toHaveBeenCalled();
                expect(result.flightsPassengersInfo.emergency).toBeNull();

                done();
            });

            it('should return the emergencyInfo data with mutation', (done) => {
                const expectedResult = structuredClone(mockEmergencyInfo);
                expectedResult[1].emergencyContact.phone.countryCode = {};

                const result = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, mockEmergencyInfo, mockGdprData, mockSummaryInfo);

                expect(fakeLocalStorageService.get).toHaveBeenCalledWith('phoneCodeList');
                expect(fakeIbUtilsService.getAppMarket).toHaveBeenCalled();
                expect(result.flightsPassengersInfo.emergency).toEqual(expectedResult);

                done();
            });
        });

        describe('getCompanies', () => {
            it('should add default companie', (done) => {
                const result = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, mockEmergencyInfo, mockGdprData, mockSummaryInfo);

                expect(result.flightsPassengersInfo.companies.length).toBe(mockCompaniesList.length + 1);

                done();
            });
        });

        describe('getSegmentsInfo', () => {
            it('should return the correct number of segments', (done) => {
                const segmentsCount = mockFlightsPassengersData.outwardSegments.length + mockFlightsPassengersData.returnSegments.length;

                const result = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, mockEmergencyInfo, mockGdprData, mockSummaryInfo);

                expect(fakeLocalStorageService.remove).toHaveBeenCalledWith('flightConfirmationNeedsCheckin');
                expect(result.flightsPassengersInfo.segments.length).toBe(segmentsCount);

                done();
            });
        });

        describe('getPassengersWithSBY', () => {
            it('should set SBY status to the correct passenger if any segment had this status', () => {
                const result = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, mockEmergencyInfo, mockGdprData, mockSummaryInfo);

                expect(result.flightsPassengersInfo.passengers[0].pasStatus.hasSBY).toBe(true);
            });
        });

        it('should set checkin not available if the segment is not available', () => {
            const mockGeneralInfoClone = structuredClone(mockGeneralInfo);
            mockGeneralInfoClone.segmentStatus = 'NOT_AVAILABLE';
            fakeFlightsPassengersUtils.getGeneralSegmentInfo.and.returnValue(mockGeneralInfoClone);

            const result = FlightsPassengersTransformer.transformSegmentsPassengersInfo(mockFlightsPassengersData, mockPrefixesList, mockCompaniesList, mockAdditionalInfo, null, mockGdprData, mockSummaryInfo);

            expect(result.flightsPassengersInfo.checkinAvailable).toBe(false);
        });
    });

});