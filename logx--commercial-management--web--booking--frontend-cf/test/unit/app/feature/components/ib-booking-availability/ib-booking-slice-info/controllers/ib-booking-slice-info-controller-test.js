class IbSliceDetailsComponentServiceMock {
    show = jasmine.createSpy('show');
    destroy = jasmine.createSpy('destroy');
}
describe('BookingSliceInfoController test', function () {

    let scope, controller, localStorageService;
    const customerDataFake = { 'generalInfo': { 'name': 'IBERIA', 'surname': 'TEST UNO TEST DOS', 'ibPlusNumber': '35981927', 'category': 'CLASICA', 'avios': 120905, 'pinStatus': '0', 'lockStatus': 'AC', 'loginAttempts': 0, 'hasElectronicId': false, 'secretQuestionCode': '1', 'program': 'IBPLUS', 'aviosTransformed': '120.905 ' }, 'personalInfo': { 'ibPlusNumber': '35981927', 'name': 'IBERIA', 'surname1': 'TEST UNO', 'surname2': 'TEST DOS', 'documentType': '04', 'documentId': '66298903T', 'nationality': 'ES', 'gender': '1', 'genderWebCode': '2', 'birthDate': '1976-04-01', 'maritalStatus': '1', 'contactPhone': '619666666', 'contactPrefix': '34', 'contactEmail': 'iacisclo@autentia.es', 'language': '4', 'languageWebCode': 'es', 'communicationLanguage': '4', 'communicationLanguageWebCode': 'es', 'communicationPreference': '1', 'residence': { 'address': 'C/ALBARRACIN', 'number': '25', 'addressExtra': '', 'numberExtra': 'C-107', 'postalCode': '28037', 'town': 'MADRID', 'region': '', 'country': 'ES', 'phone': '912148103', 'fax': '', 'state': '28' }, 'alarms': [{ 'number': 5, 'params': ['TARJETA DE PRUEBAS', '07/11/2006'] }, { 'number': 11, 'params': ['DUMBO', '62', 'ESANTANDERPREMIUM'] }], 'socialNetworks': [], 'status': { 'lastModifiedDate': '2020-10-20', 'creationDate': '2006-10-05', 'deleted': false }, 'childrensBirthday': [], 'childrenNumber': 0 }, 'company': { 'ibPlusNumber': '35981927', 'profession': '126', 'professionWebCode': '26', 'position': '42', 'positionWebCode': '42', 'economicActivity': '37', 'companyId': '1231231', 'companyName': 'ATOS ORIGIN', 'location': { 'address': 'C/ALBARRACIN', 'number': '25', 'addressExtra': '', 'numberExtra': 'A-110', 'postalCode': '28037', 'town': 'MADRID', 'region': '', 'country': 'ES', 'phone': '1111111111', 'fax': '', 'state': '28' }, 'status': { 'lastModifiedDate': '2020-10-20' } }, 'loyaltyCard': { 'ibPlusNumber': '35981927', 'category': 'CLASICA', 'oneWorldCategory': '', 'plasticType': 'STANDARD', 'name': 'TEST UNO TEST DOS IBERIA', 'issuer': '001', 'creationDate': '2006-10-05', 'expirationDate': '9999-12-31', 'lastUseDate': '2010-03-03', 'ageGroup': '03', 'ageIndicator': 'ADU', 'isCompanion': false, 'isSingular': false, 'importance': 40, 'status': { 'lastModifiedDate': '2020-03-27' } }, 'points': { 'ibPlusNumber': '35981927', 'totals': { 'balance': 120905, 'expiring': 120905, 'expirationDate': '2013-03-31', 'expirationPolicy': 'T', 'numberOfFlights': 0, 'fromCredits': 400000, 'fromDebits': 279095, 'totalElite': 0, 'historicElite': 0, 'historicNumberOfFlights': 0, 'ibHistoricNumberOfFlights': 0 }, 'levelUpgrade': { 'nextCategory': '5', 'levelKeeping': 0, 'levelUpgrade': 1100, 'numberOfFlightsForKeeping': 0, 'ibNumberOfFlightsForKeeping': 0, 'numberOfFlightsForUpgrading': 25, 'ibNumberOfFlightsForUpgrading': 1, 'platino1Keeping': 0, 'platino2Keeping': 0, 'platino10Keeping': 0, 'numberOfPlatino10Years': 0, 'levelDate': '2019-04-12', 'nextLevelDate': '2020-03-31', 'eliteCountingBeginDate': '2019-04-01', 'eliteCountingEndDate': '2020-03-31', 'elite1CountingEndDate': null, 'platinoYear': 0, 'elitePlatinoGoal': 0 }, 'clientAccount': { 'balances': [{ 'year': 2010, 'balance': 0, 'expirationDate': '9999-12-31' }, { 'year': 2020, 'balance': 120905, 'expirationDate': '9999-12-31' }] } }, 'beneficiaries': { 'ibPlusNumber': '35981927', 'beneficiaries': [{ 'name': 'UNO', 'surname1': 'CUALQUIERA', 'surname2': 'A', 'birthDate': '1985-01-01', 'relationship': '1', 'relationshipDescription': 'Conyuge', 'document': { 'type': '04', 'typeDescription': 'DNI español (incl.letra)', 'number': '112312312' }, 'frequentFlyer': { 'airline': '-1', 'number': null }, 'title': 0, 'beneficiaryNumber': 1, 'relationshipWebCode': '0' }] }, 'largeFamilyInfo': { 'category': null, 'docNumber': null, 'zipCode': null }, 'residentInfo': { 'area': -1, 'municipalityCode': null, 'certificateNumber': null }, 'completeProfile': true };
    const fakeSliceInfoModel = {
        sliceId: '2',
        arrivalDateTime: '2022-11-28 08:30',
        departureDateTime: '2022-11-28 07:25',
        segments: [
            {
                segmentId: 'IB044820221128',
                departureDateTime: '2022-11-28 07:25',
                arrivalDateTime: '2022-11-28 08:30',
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
                flight: {
                    marketingCarrier: {
                        code: 'IB',
                        name: 'Iberia'
                    },
                    operationalCarrier: {
                        code: 'IB',
                        name: 'Iberia'
                    },
                    marketingFlightNumber: '448',
                    operationalFlightNumber: null,
                    operationalDisclosure: 'IB',
                    aircraft: {
                        code: '321',
                        description: 'Airbus A321'
                    }
                },
                overnight: false,
                waitingTime: 0,
                duration: 65,
                delayInformation: null,
                stop: null,
                durationParsed: '1h 5min.',
                isMoreThan2h: false,
                waitingTimeParsed: '',
                departureDateTimeParsed: '07:25',
                departureDateParsed: {
                    dateTime: '07:25',
                    weekDay: 'WEEKDAY_MONDAY',
                    hour: 1,
                    minutes: 0,
                    day: 28,
                    monthNumber: 11,
                    month: 'MONTH_NOVEMBER',
                    year: 2022,
                    formatedDate: '2022-11-28 07:25'
                },
                arrivalDateTimeParsed: '08:30',
                companyURL: '/aerolineas/logo_pos_IB.svg',
                warnings: [],
                terminalChange: {
                    isImportant: false,
                    code: '',
                    message: '',
                    show: false
                },
                airportChange: {
                    isImportant: false,
                    code: '',
                    message: '',
                    show: false
                },
                scaleWaitingTime: {
                    isImportant: false,
                    code: '',
                    message: '',
                    show: false
                },
                nightFlight: {
                    code: '',
                    message: '',
                    isOverNight: false
                }
            }
        ],
        duration: 65,
        cashAvios: true,
        flightOfTheHouse: true,
        overnight: false,
        stopsNumber: 0,
        bestPrice: true,
        cabins: {
            E: {
                bestPrice: 48.8,
                bestPriceDiscount: 54.22,
                bestPriceDiscountShown: '54€',
                bestPriceShown: '49€',
                cabinDescription: 'Turista',
                cabinAvailable: true,
                isCabinCompatible: true,
                fareFamilies: [
                    {
                        cabinType: 'E',
                        cabinDescription: 'Turista',
                        commercialCode: 'TBAESEU',
                        commercialName: 'Básica',
                        commercialNameES: 'Básica',
                        priority: 900,
                        conditions: [
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '2'
                                },
                                key: 0,
                                previewStatus: true
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'Sin equipaje en bodega',
                                    message: 'No incluido',
                                    code: 'CA_1_PIEZAS_PAGO',
                                    conditionStatus: false,
                                    observationCode: '1'
                                },
                                key: 1,
                                previewStatus: true
                            },
                            {
                                code: 'COMIDA',
                                name: 'Comida',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'Comida_no_incluida',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 2,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                    code: 'CA_Asiento_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 3,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 4,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTODELANTERO',
                                name: 'Asiento Delantero',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_Delantero_pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 5,
                                previewStatus: true
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 6,
                                previewStatus: true
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 7,
                                previewStatus: true
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 65,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste.',
                                    message: 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 8,
                                previewStatus: true
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido',
                                units: null,
                                extendedInfo: {
                                    title: 'Reembolsos no permitidos',
                                    message: 'No permitido',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 9,
                                previewStatus: true
                            },
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 10,
                                previewStatus: false
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 21,
                                previewStatus: false
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 22,
                                previewStatus: false
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 23,
                                previewStatus: false
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 24,
                                previewStatus: false
                            },
                            {
                                code: 'AVIO',
                                name: 'AVIOS',
                                text: 'Si',
                                units: null,
                                extendedInfo: {
                                    title: 'Avios incluido',
                                    message: 'Si',
                                    code: 'AVIOS incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 25,
                                previewStatus: false
                            },
                            {
                                code: 'WIFI',
                                name: 'WiFi',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: '',
                                    code: 'WiFi pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 26,
                                previewStatus: false
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText: {}
                            },
                            {
                                observationCode: 2,
                                observationText: {}
                            },
                            {
                                observationCode: 3,
                                observationText: {}
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        isCompatibleFare: true,
                        farePrice: 146.39,
                        fareDiscountPriceToCalculate: 54.22,
                        farePriceToCalculate: 48.8,
                        farePriceShown: '49€',
                        fareDiscountPriceShown: '54€',
                        fareCurrency: 'EUR',
                        remainingSeats: 9,
                        offers: [
                            {
                                offerId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP',
                                offerItems: [
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    },
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'CHILD_01'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    }
                                ],
                                originDestinations: [
                                    {
                                        priceDiscountApplied: true,
                                        totalPrice: {
                                            fare: 91.8,
                                            tax: 54.59,
                                            total: 146.39,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        totalPriceDiscountData: {
                                            totalDiscount: 16.27,
                                            percentDiscount: 10,
                                            totalOriginal: 162.66
                                        },
                                        adultPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        adultPriceDiscountData: {
                                            totalDiscount: 5.42,
                                            percentDiscount: 10,
                                            totalOriginal: 54.22
                                        },
                                        perPassengerPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        originDestinationId: 'OD1',
                                        applicableSlices: [
                                            {
                                                sliceId: '1',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043220221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '2',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044820221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '3',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB042620221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '5',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043420221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '6',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044020221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                timeLimits: '2022-10-19T13:36:25.417',
                                paymentTimeLimit: null,
                                specialDiscountsApplied: [
                                    {
                                        type: 'PARTNER',
                                        percentDiscount: 10,
                                        totalDiscount: 16.27,
                                        description: 'Descuento Exclusivo Iberia Cards',
                                        discountType: 'GENERAL',
                                        partner: {
                                            partnerId: 'IBC',
                                            productId: '20'
                                        },
                                        userMustFly: false
                                    }
                                ],
                                providerOfferId: 'TuJ7wlRx9zFMvGCcFERnR5004',
                                privateFare: false,
                                offerType: '',
                                flightModificationOnDemand: false,
                                discountsApplied: {
                                    originalPrice: {
                                        fare: 102,
                                        tax: 60.66,
                                        total: 162.66,
                                        currency: 'EUR',
                                        ticketingFee: 0
                                    },
                                    discounts: [
                                        {
                                            type: 'PARTNER',
                                            percentDiscount: 10,
                                            totalDiscount: 16.27,
                                            description: 'Descuento Exclusivo Iberia Cards',
                                            discountType: 'GENERAL',
                                            partner: {
                                                partnerId: 'IBC',
                                                productId: '20'
                                            },
                                            userMustFly: false
                                        }
                                    ],
                                    originalOfferItems: [
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                            passengerIds: [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        },
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                            passengerIds: [
                                                'CHILD_01'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        }
                                    ],
                                    totalDiscount: 16.27
                                },
                                excludePenalties: false,
                                price: {
                                    fare: 91.8,
                                    tax: 54.59,
                                    total: 146.39,
                                    currency: 'EUR',
                                    ticketingFee: 0
                                }
                            }
                        ],
                        oBdiscount: false
                    },
                    {
                        cabinType: 'E',
                        cabinDescription: 'Turista',
                        commercialCode: 'TCLESES',
                        commercialName: 'Óptima',
                        commercialNameES: 'Óptima',
                        priority: 700,
                        conditions: [
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '1'
                                },
                                key: 0,
                                previewStatus: true
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: '1 pieza',
                                units: 1,
                                extendedInfo: {
                                    title: '1 equipaje en bodega',
                                    message: 'Incluido: 1 pieza',
                                    code: 'CA_1_PIEZAS',
                                    conditionStatus: true,
                                    observationCode: '2'
                                },
                                key: 1,
                                previewStatus: true
                            },
                            {
                                code: 'COMIDA',
                                name: 'Comida',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'Comida_no_incluida',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 2,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'Gratuita desde 24 horas antes del vuelo',
                                units: 24,
                                extendedInfo: {
                                    title: 'Gratuita desde 24 horas antes del vuelo',
                                    message: 'Gratuita desde 24 horas antes del vuelo',
                                    code: 'CA_Asiento_Gratis_24_horas',
                                    conditionStatus: true,
                                    observationCode: null
                                },
                                key: 3,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 4,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTODELANTERO',
                                name: 'Asiento Delantero',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_Delantero_pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 5,
                                previewStatus: true
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 6,
                                previewStatus: true
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 7,
                                previewStatus: true
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 45,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste, salvo excepciones.',
                                    message: 'Permitido con penalización de 45 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 8,
                                previewStatus: true
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido',
                                units: null,
                                extendedInfo: {
                                    title: 'Reembolsos no permitidos',
                                    message: 'No permitido',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 9,
                                previewStatus: true
                            },
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 10,
                                previewStatus: false
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 21,
                                previewStatus: false
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 22,
                                previewStatus: false
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 23,
                                previewStatus: false
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 24,
                                previewStatus: false
                            },
                            {
                                code: 'AVIO',
                                name: 'AVIOS',
                                text: 'Si',
                                units: null,
                                extendedInfo: {
                                    title: 'Avios incluido',
                                    message: 'Si',
                                    code: 'AVIOS incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 25,
                                previewStatus: false
                            },
                            {
                                code: 'WIFI',
                                name: 'WiFi',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: '',
                                    code: 'WiFi pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 26,
                                previewStatus: false
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText: {}
                            },
                            {
                                observationCode: 2,
                                observationText: {}
                            },
                            {
                                observationCode: 3,
                                observationText: {}
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        isCompatibleFare: true,
                        farePrice: 194.99,
                        fareDiscountPriceToCalculate: 72.22,
                        farePriceToCalculate: 65,
                        farePriceShown: '65€',
                        fareDiscountPriceShown: '72€',
                        fareCurrency: 'EUR',
                        remainingSeats: 9,
                        offers: [
                            {
                                'offerId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP',
                                'offerItems': [
                                    {
                                        'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_01',
                                        'price': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'passengerIds': [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        'privateFareInformation': null,
                                        'reshopDifferential': null,
                                        'surcharges': null
                                    },
                                    {
                                        'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_02',
                                        'price': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'passengerIds': [
                                            'CHILD_01'
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
                                            'fare': 140.4,
                                            'tax': 54.59,
                                            'total': 194.99,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'totalPriceDiscountData': {
                                            'totalDiscount': 21.67,
                                            'percentDiscount': 10,
                                            'totalOriginal': 216.66
                                        },
                                        'adultPrice': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'adultPriceDiscountData': {
                                            'totalDiscount': 7.22,
                                            'percentDiscount': 10,
                                            'totalOriginal': 72.22
                                        },
                                        'perPassengerPrice': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'originDestinationId': 'OD1',
                                        'applicableSlices': [
                                            {
                                                'sliceId': '1',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB043220221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '2',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB044820221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '3',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB042620221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '5',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB043420221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '6',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB044020221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
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
                                'timeLimits': '2022-10-19T13:36:25.417',
                                'paymentTimeLimit': null,
                                'specialDiscountsApplied': [
                                    {
                                        'type': 'PARTNER',
                                        'percentDiscount': 10,
                                        'totalDiscount': 21.67,
                                        'description': 'Descuento Exclusivo Iberia Cards',
                                        'discountType': 'GENERAL',
                                        'partner': {
                                            'partnerId': 'IBC',
                                            'productId': '20'
                                        },
                                        'userMustFly': false
                                    }
                                ],
                                'providerOfferId': 'NsjTmRzTMVGNfOOfSjMJfU004',
                                'privateFare': false,
                                'offerType': '',
                                'flightModificationOnDemand': false,
                                'discountsApplied': {
                                    'originalPrice': {
                                        'fare': 156,
                                        'tax': 60.66,
                                        'total': 216.66,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'discounts': [
                                        {
                                            'type': 'PARTNER',
                                            'percentDiscount': 10,
                                            'totalDiscount': 21.67,
                                            'description': 'Descuento Exclusivo Iberia Cards',
                                            'discountType': 'GENERAL',
                                            'partner': {
                                                'partnerId': 'IBC',
                                                'productId': '20'
                                            },
                                            'userMustFly': false
                                        }
                                    ],
                                    'originalOfferItems': [
                                        {
                                            'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_01',
                                            'passengerIds': [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            'price': {
                                                'fare': 52,
                                                'tax': 20.22,
                                                'total': 72.22,
                                                'currency': 'EUR',
                                                'ticketingFee': 0
                                            },
                                            'detailedTaxes': [],
                                            'reshopDetailedTaxes': [],
                                            'fareComponents': [],
                                            'surcharges': null
                                        },
                                        {
                                            'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_02',
                                            'passengerIds': [
                                                'CHILD_01'
                                            ],
                                            'price': {
                                                'fare': 52,
                                                'tax': 20.22,
                                                'total': 72.22,
                                                'currency': 'EUR',
                                                'ticketingFee': 0
                                            },
                                            'detailedTaxes': [],
                                            'reshopDetailedTaxes': [],
                                            'fareComponents': [],
                                            'surcharges': null
                                        }
                                    ],
                                    'totalDiscount': 21.67
                                },
                                'excludePenalties': false,
                                'price': {
                                    'fare': 140.4,
                                    'tax': 54.59,
                                    'total': 194.99,
                                    'currency': 'EUR',
                                    'ticketingFee': 0
                                }
                            }
                        ],
                        oBdiscount: false
                    },
                    {
                        cabinType: 'E',
                        cabinDescription: 'Turista',
                        commercialCode: 'YPACONF',
                        commercialName: 'Puente Aéreo Confort',
                        commercialNameES: 'Puente Aéreo Confort',
                        priority: 700,
                        conditions: [
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '1'
                                },
                                key: 0,
                                previewStatus: true
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: '1 pieza',
                                units: 1,
                                extendedInfo: {
                                    title: '1 equipaje en bodega',
                                    message: 'Incluido: 1 pieza',
                                    code: 'CA_1_PIEZAS',
                                    conditionStatus: true,
                                    observationCode: '2'
                                },
                                key: 1,
                                previewStatus: true
                            },
                            {
                                code: 'COMIDA',
                                name: 'Comida',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'Comida_no_incluida',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 2,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'Gratuita desde 24 horas antes del vuelo',
                                units: 24,
                                extendedInfo: {
                                    title: 'Gratuita desde 24 horas antes del vuelo',
                                    message: 'Gratuita desde 24 horas antes del vuelo',
                                    code: 'CA_Asiento_Gratis_24_horas',
                                    conditionStatus: true,
                                    observationCode: null
                                },
                                key: 3,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 4,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTODELANTERO',
                                name: 'Asiento Delantero',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_Delantero_pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 5,
                                previewStatus: true
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 6,
                                previewStatus: true
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 7,
                                previewStatus: true
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 45,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste, salvo excepciones.',
                                    message: 'Permitido con penalización de 45 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 8,
                                previewStatus: true
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido',
                                units: null,
                                extendedInfo: {
                                    title: 'Reembolsos no permitidos',
                                    message: 'No permitido',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 9,
                                previewStatus: true
                            },
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 10,
                                previewStatus: false
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 21,
                                previewStatus: false
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 22,
                                previewStatus: false
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 23,
                                previewStatus: false
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 24,
                                previewStatus: false
                            },
                            {
                                code: 'AVIO',
                                name: 'AVIOS',
                                text: 'Si',
                                units: null,
                                extendedInfo: {
                                    title: 'Avios incluido',
                                    message: 'Si',
                                    code: 'AVIOS incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 25,
                                previewStatus: false
                            },
                            {
                                code: 'WIFI',
                                name: 'WiFi',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: '',
                                    code: 'WiFi pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 26,
                                previewStatus: false
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText: {}
                            },
                            {
                                observationCode: 2,
                                observationText: {}
                            },
                            {
                                observationCode: 3,
                                observationText: {}
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        isCompatibleFare: true,
                        farePrice: 194.99,
                        fareDiscountPriceToCalculate: 72.22,
                        farePriceToCalculate: 65,
                        farePriceShown: '65€',
                        fareDiscountPriceShown: '72€',
                        fareCurrency: 'EUR',
                        remainingSeats: 9,
                        offers: [
                            {
                                'offerId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP',
                                'offerItems': [
                                    {
                                        'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_01',
                                        'price': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'passengerIds': [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        'privateFareInformation': null,
                                        'reshopDifferential': null,
                                        'surcharges': null
                                    },
                                    {
                                        'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_02',
                                        'price': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'passengerIds': [
                                            'CHILD_01'
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
                                            'fare': 140.4,
                                            'tax': 54.59,
                                            'total': 194.99,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'totalPriceDiscountData': {
                                            'totalDiscount': 21.67,
                                            'percentDiscount': 10,
                                            'totalOriginal': 216.66
                                        },
                                        'adultPrice': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'adultPriceDiscountData': {
                                            'totalDiscount': 7.22,
                                            'percentDiscount': 10,
                                            'totalOriginal': 72.22
                                        },
                                        'perPassengerPrice': {
                                            'fare': 46.8,
                                            'tax': 18.2,
                                            'total': 65,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'originDestinationId': 'OD1',
                                        'applicableSlices': [
                                            {
                                                'sliceId': '1',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB043220221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '2',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB044820221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '3',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB042620221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '5',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB043420221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '6',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB044020221128',
                                                        'fareFamily': 'TCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOM4',
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
                                'timeLimits': '2022-10-19T13:36:25.417',
                                'paymentTimeLimit': null,
                                'specialDiscountsApplied': [
                                    {
                                        'type': 'PARTNER',
                                        'percentDiscount': 10,
                                        'totalDiscount': 21.67,
                                        'description': 'Descuento Exclusivo Iberia Cards',
                                        'discountType': 'GENERAL',
                                        'partner': {
                                            'partnerId': 'IBC',
                                            'productId': '20'
                                        },
                                        'userMustFly': false
                                    }
                                ],
                                'providerOfferId': 'NsjTmRzTMVGNfOOfSjMJfU004',
                                'privateFare': false,
                                'offerType': '',
                                'flightModificationOnDemand': false,
                                'discountsApplied': {
                                    'originalPrice': {
                                        'fare': 156,
                                        'tax': 60.66,
                                        'total': 216.66,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'discounts': [
                                        {
                                            'type': 'PARTNER',
                                            'percentDiscount': 10,
                                            'totalDiscount': 21.67,
                                            'description': 'Descuento Exclusivo Iberia Cards',
                                            'discountType': 'GENERAL',
                                            'partner': {
                                                'partnerId': 'IBC',
                                                'productId': '20'
                                            },
                                            'userMustFly': false
                                        }
                                    ],
                                    'originalOfferItems': [
                                        {
                                            'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_01',
                                            'passengerIds': [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            'price': {
                                                'fare': 52,
                                                'tax': 20.22,
                                                'total': 72.22,
                                                'currency': 'EUR',
                                                'ticketingFee': 0
                                            },
                                            'detailedTaxes': [],
                                            'reshopDetailedTaxes': [],
                                            'fareComponents': [],
                                            'surcharges': null
                                        },
                                        {
                                            'offerItemId': 'IBf5c3d0eaba6249d9b2a4cdcdb4352228OP_02',
                                            'passengerIds': [
                                                'CHILD_01'
                                            ],
                                            'price': {
                                                'fare': 52,
                                                'tax': 20.22,
                                                'total': 72.22,
                                                'currency': 'EUR',
                                                'ticketingFee': 0
                                            },
                                            'detailedTaxes': [],
                                            'reshopDetailedTaxes': [],
                                            'fareComponents': [],
                                            'surcharges': null
                                        }
                                    ],
                                    'totalDiscount': 21.67
                                },
                                'excludePenalties': false,
                                'price': {
                                    'fare': 140.4,
                                    'tax': 54.59,
                                    'total': 194.99,
                                    'currency': 'EUR',
                                    'ticketingFee': 0
                                }
                            }
                        ],
                        oBdiscount: false
                    },
                    {
                        'cabinType': 'E',
                        'cabinDescription': 'Turista',
                        'commercialCode': 'COTCLESES',
                        'commercialName': 'Confort',
                        'commercialNameES': 'Confort',
                        'priority': 600,
                        'conditions': [
                            {
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'text': '1 bulto (56x40x25cm)',
                                'units': 1,
                                'extendedInfo': {
                                    'title': '1 bulto en cabina  (56x40x25cm)',
                                    'message': '1 bulto (56x40x25cm).',
                                    'code': 'CA_EQP_MANO_10KG',
                                    'conditionStatus': true,
                                    'observationCode': '1'
                                },
                                'key': 0,
                                'previewStatus': true
                            },
                            {
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'text': '1 pieza',
                                'units': 1,
                                'extendedInfo': {
                                    'title': '1 equipaje en bodega',
                                    'message': 'Incluido: 1 pieza',
                                    'code': 'CA_1_PIEZAS',
                                    'conditionStatus': true,
                                    'observationCode': '2'
                                },
                                'key': 1,
                                'previewStatus': true
                            },
                            {
                                'code': 'COMIDA',
                                'name': 'Comida',
                                'text': 'No incluido',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'No incluido',
                                    'message': 'No incluido',
                                    'code': 'Comida_no_incluida',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 2,
                                'previewStatus': true
                            },
                            {
                                'code': 'ASIENTO',
                                'name': 'Selección de asiento',
                                'text': 'Incluido',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'Con selección de asiento',
                                    'message': 'Incluido',
                                    'code': 'CA_Asiento_Gratuito_No_Destacado',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 3,
                                'previewStatus': true
                            },
                            {
                                'code': 'ASIENTOXL',
                                'name': 'Selección de asiento XL',
                                'text': 'Incluido',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'Con selección de asiento',
                                    'message': 'Incluido',
                                    'code': 'CA_Asiento_XL_Incluido',
                                    'conditionStatus': true,
                                    'observationCode': null
                                },
                                'key': 4,
                                'previewStatus': true
                            },
                            {
                                'code': 'ASIENTODELANTERO',
                                'name': 'Asiento Delantero',
                                'text': 'Incluido',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'Con selección de asiento',
                                    'message': 'Incluido',
                                    'code': 'CA_Asiento_Delantero_incluido_OFF',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 5,
                                'previewStatus': true
                            },
                            {
                                'code': 'EMBARQUE',
                                'name': 'Prioridad de Embarque',
                                'text': 'Sí, grupo 2',
                                'units': 2,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'Sí, grupo 2',
                                    'code': 'CA_Embarque_Prioritario_grupo_2',
                                    'conditionStatus': true,
                                    'observationCode': null
                                },
                                'key': 6,
                                'previewStatus': true
                            },
                            {
                                'code': 'TARJEMBANTIC',
                                'name': 'Tarjeta de embarque anticipada',
                                'text': 'Incluido',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'Con tarjeta de embarque anticipada',
                                    'message': 'Incluido',
                                    'code': 'CA_Tarjeta_embarque_anticipada_incluido',
                                    'conditionStatus': true,
                                    'observationCode': null
                                },
                                'key': 7,
                                'previewStatus': true
                            },
                            {
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'text': 'Primer cambio gratis hasta 15 días antes de la salida.',
                                'units': 15,
                                'extendedInfo': {
                                    'title': 'Primer cambio de vuelo gratis.',
                                    'message': 'Primer cambio permitido sin penalización hasta 15 días antes de la salida. Siguientes cambios permitidos en cualquier momento, con penalización de 45 EUR. Cambios no permitidos en caso de no presentarse al vuelo (no-show).',
                                    'code': 'CA_1 PERM 15D SIG CON PENALTY_45€_NO_SHOW_NO_PERMITID',
                                    'conditionStatus': true,
                                    'observationCode': null
                                },
                                'key': 8,
                                'previewStatus': true
                            },
                            {
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'text': 'No permitido',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'Reembolsos no permitidos',
                                    'message': 'No permitido',
                                    'code': 'CA_REEMBOLSO NO PERMITIDO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 9,
                                'previewStatus': true
                            },
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
                                },
                                'key': 10,
                                'previewStatus': false
                            },
                            {
                                'code': 'CHECKINDESK',
                                'name': 'Mostrador check-in exclusivo',
                                'text': 'No',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'No',
                                    'code': 'Chek-in_desk_ NO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 21,
                                'previewStatus': false
                            },
                            {
                                'code': 'SALAVIP',
                                'name': 'Acceso a salas VIP',
                                'text': 'No',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'No',
                                    'code': 'Acceso a salas VIP No permitido',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 22,
                                'previewStatus': false
                            },
                            {
                                'code': 'FASTTRACK',
                                'name': 'Fast Track',
                                'text': 'No',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'No',
                                    'code': 'Fast Track NO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 23,
                                'previewStatus': false
                            },
                            {
                                'code': 'EQPPRIOR',
                                'name': 'Entrega prioritaria equipaje',
                                'text': 'No',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': 'No',
                                    'code': 'Entrega_prioritaria_equipaje_ NO',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 24,
                                'previewStatus': false
                            },
                            {
                                'code': 'AVIO',
                                'name': 'AVIOS',
                                'text': 'Si',
                                'units': null,
                                'extendedInfo': {
                                    'title': 'Avios incluido',
                                    'message': 'Si',
                                    'code': 'AVIOS incluido',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 25,
                                'previewStatus': false
                            },
                            {
                                'code': 'WIFI',
                                'name': 'WiFi',
                                'text': 'De pago',
                                'units': null,
                                'extendedInfo': {
                                    'title': '',
                                    'message': '',
                                    'code': 'WiFi pago',
                                    'conditionStatus': false,
                                    'observationCode': null
                                },
                                'key': 26,
                                'previewStatus': false
                            }
                        ],
                        'observations': [
                            {
                                'observationCode': 1,
                                'observationText': {}
                            },
                            {
                                'observationCode': 2,
                                'observationText': {}
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
                            'REEMBOLSO'
                        ],
                        'isCompatibleFare': true,
                        'farePrice': 254.39,
                        'fareDiscountPriceToCalculate': 94.22,
                        'farePriceToCalculate': 84.8,
                        'farePriceShown': '85€',
                        'fareDiscountPriceShown': '94€',
                        'fareCurrency': 'EUR',
                        'remainingSeats': 9,
                        'offers': [
                            {
                                'offerId': 'IB0b3137b9da7042fe8c6bed5795748637OP',
                                'offerItems': [
                                    {
                                        'offerItemId': 'IB0b3137b9da7042fe8c6bed5795748637OP_01',
                                        'price': {
                                            'fare': 66.6,
                                            'tax': 18.2,
                                            'total': 84.8,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'passengerIds': [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        'privateFareInformation': null,
                                        'reshopDifferential': null,
                                        'surcharges': null
                                    },
                                    {
                                        'offerItemId': 'IB0b3137b9da7042fe8c6bed5795748637OP_02',
                                        'price': {
                                            'fare': 66.6,
                                            'tax': 18.2,
                                            'total': 84.8,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'passengerIds': [
                                            'CHILD_01'
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
                                            'fare': 199.8,
                                            'tax': 54.59,
                                            'total': 254.39,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'totalPriceDiscountData': {
                                            'totalDiscount': 28.27,
                                            'percentDiscount': 10,
                                            'totalOriginal': 282.66
                                        },
                                        'adultPrice': {
                                            'fare': 66.6,
                                            'tax': 18.2,
                                            'total': 84.8,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'adultPriceDiscountData': {
                                            'totalDiscount': 9.42,
                                            'percentDiscount': 10,
                                            'totalOriginal': 94.22
                                        },
                                        'perPassengerPrice': {
                                            'fare': 66.6,
                                            'tax': 18.2,
                                            'total': 84.8,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        },
                                        'originDestinationId': 'OD1',
                                        'applicableSlices': [
                                            {
                                                'sliceId': '1',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB043220221128',
                                                        'fareFamily': 'COTCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOU4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '2',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB044820221128',
                                                        'fareFamily': 'COTCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOU4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '3',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB042620221128',
                                                        'fareFamily': 'COTCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOU4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '5',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB043420221128',
                                                        'fareFamily': 'COTCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOU4',
                                                        'brandCode': null,
                                                        'checkedBaggageAllowanceKeys': [],
                                                        'carryOnBaggageAllowanceKeys': [],
                                                        'ticketDesignator': null,
                                                        'seatDisplays': null,
                                                        'cabinDescription': ''
                                                    }
                                                ]
                                            },
                                            {
                                                'sliceId': '6',
                                                'remainingSeats': 9,
                                                'segments': [
                                                    {
                                                        'segmentId': 'IB044020221128',
                                                        'fareFamily': 'COTCLESES',
                                                        'bookingCode': null,
                                                        'bookingClass': 'ECONOMY',
                                                        'rbd': 'A',
                                                        'remainingSeats': 9,
                                                        'fareBasis': '',
                                                        'extendedFareCode': 'ADNOU4',
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
                                'timeLimits': '2022-10-19T13:36:25.417',
                                'paymentTimeLimit': null,
                                'specialDiscountsApplied': [
                                    {
                                        'type': 'PARTNER',
                                        'percentDiscount': 10,
                                        'totalDiscount': 28.27,
                                        'description': 'Descuento Exclusivo Iberia Cards',
                                        'discountType': 'GENERAL',
                                        'partner': {
                                            'partnerId': 'IBC',
                                            'productId': '20'
                                        },
                                        'userMustFly': false
                                    }
                                ],
                                'providerOfferId': 'OEZ3tIlM4GJNksS7ZwD9eS004',
                                'privateFare': false,
                                'offerType': '',
                                'flightModificationOnDemand': false,
                                'discountsApplied': {
                                    'originalPrice': {
                                        'fare': 222,
                                        'tax': 60.66,
                                        'total': 282.66,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'discounts': [
                                        {
                                            'type': 'PARTNER',
                                            'percentDiscount': 10,
                                            'totalDiscount': 28.27,
                                            'description': 'Descuento Exclusivo Iberia Cards',
                                            'discountType': 'GENERAL',
                                            'partner': {
                                                'partnerId': 'IBC',
                                                'productId': '20'
                                            },
                                            'userMustFly': false
                                        }
                                    ],
                                    'originalOfferItems': [
                                        {
                                            'offerItemId': 'IB0b3137b9da7042fe8c6bed5795748637OP_01',
                                            'passengerIds': [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            'price': {
                                                'fare': 74,
                                                'tax': 20.22,
                                                'total': 94.22,
                                                'currency': 'EUR',
                                                'ticketingFee': 0
                                            },
                                            'detailedTaxes': [],
                                            'reshopDetailedTaxes': [],
                                            'fareComponents': [],
                                            'surcharges': null
                                        },
                                        {
                                            'offerItemId': 'IB0b3137b9da7042fe8c6bed5795748637OP_02',
                                            'passengerIds': [
                                                'CHILD_01'
                                            ],
                                            'price': {
                                                'fare': 74,
                                                'tax': 20.22,
                                                'total': 94.22,
                                                'currency': 'EUR',
                                                'ticketingFee': 0
                                            },
                                            'detailedTaxes': [],
                                            'reshopDetailedTaxes': [],
                                            'fareComponents': [],
                                            'surcharges': null
                                        }
                                    ],
                                    'totalDiscount': 28.27
                                },
                                'excludePenalties': false,
                                'price': {
                                    'fare': 199.8,
                                    'tax': 54.59,
                                    'total': 254.39,
                                    'currency': 'EUR',
                                    'ticketingFee': 0
                                }
                            }
                        ],
                        'oBdiscount': false
                    }
                ],
                bestCabinsPrice: true
            },
            B: {
                bestPrice: 161.3,
                bestPriceDiscount: 179.22,
                bestPriceDiscountShown: '179€',
                bestPriceShown: '161€',
                cabinDescription: 'Business Class',
                cabinAvailable: true,
                isCabinCompatible: true,
                fareFamilies: [
                    {
                        cabinType: 'B',
                        cabinDescription: 'Business Class',
                        commercialCode: 'BUSOPTMH',
                        commercialName: 'Business Óptima',
                        commercialNameES: 'Business Óptima',
                        priority: 200,
                        conditions: [
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '2'
                                },
                                key: 0,
                                previewStatus: true
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'Sin equipaje en bodega',
                                    message: 'No incluido',
                                    code: 'CA_1_PIEZAS_PAGO',
                                    conditionStatus: false,
                                    observationCode: '1'
                                },
                                key: 1,
                                previewStatus: true
                            },
                            {
                                code: 'COMIDA',
                                name: 'Comida',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'Comida_no_incluida',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 2,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                    code: 'CA_Asiento_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 3,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 4,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTODELANTERO',
                                name: 'Asiento Delantero',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_Delantero_pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 5,
                                previewStatus: true
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 6,
                                previewStatus: true
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 7,
                                previewStatus: true
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 65,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste.',
                                    message: 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 8,
                                previewStatus: true
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido',
                                units: null,
                                extendedInfo: {
                                    title: 'Reembolsos no permitidos',
                                    message: 'No permitido',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 9,
                                previewStatus: true
                            },
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 10,
                                previewStatus: false
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 21,
                                previewStatus: false
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 22,
                                previewStatus: false
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 23,
                                previewStatus: false
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 24,
                                previewStatus: false
                            },
                            {
                                code: 'AVIO',
                                name: 'AVIOS',
                                text: 'Si',
                                units: null,
                                extendedInfo: {
                                    title: 'Avios incluido',
                                    message: 'Si',
                                    code: 'AVIOS incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 25,
                                previewStatus: false
                            },
                            {
                                code: 'WIFI',
                                name: 'WiFi',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: '',
                                    code: 'WiFi pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 26,
                                previewStatus: false
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText: {}
                            },
                            {
                                observationCode: 2,
                                observationText: {}
                            },
                            {
                                observationCode: 3,
                                observationText: {}
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        isCompatibleFare: true,
                        farePrice: 437.09,
                        fareDiscountPriceToCalculate: 179.22,
                        farePriceToCalculate: 161.3,
                        farePriceShown: '161€',
                        fareDiscountPriceShown: '179€',
                        fareCurrency: 'EUR',
                        remainingSeats: 7,
                        offers: [
                            {
                                offerId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP',
                                offerItems: [
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    },
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'CHILD_01'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    }
                                ],
                                originDestinations: [
                                    {
                                        priceDiscountApplied: true,
                                        totalPrice: {
                                            fare: 91.8,
                                            tax: 54.59,
                                            total: 146.39,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        totalPriceDiscountData: {
                                            totalDiscount: 16.27,
                                            percentDiscount: 10,
                                            totalOriginal: 162.66
                                        },
                                        adultPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        adultPriceDiscountData: {
                                            totalDiscount: 5.42,
                                            percentDiscount: 10,
                                            totalOriginal: 54.22
                                        },
                                        perPassengerPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        originDestinationId: 'OD1',
                                        applicableSlices: [
                                            {
                                                sliceId: '1',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043220221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '2',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044820221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '3',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB042620221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '5',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043420221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '6',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044020221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                timeLimits: '2022-10-19T13:36:25.417',
                                paymentTimeLimit: null,
                                specialDiscountsApplied: [
                                    {
                                        type: 'PARTNER',
                                        percentDiscount: 10,
                                        totalDiscount: 16.27,
                                        description: 'Descuento Exclusivo Iberia Cards',
                                        discountType: 'GENERAL',
                                        partner: {
                                            partnerId: 'IBC',
                                            productId: '20'
                                        },
                                        userMustFly: false
                                    }
                                ],
                                providerOfferId: 'TuJ7wlRx9zFMvGCcFERnR5004',
                                privateFare: false,
                                offerType: '',
                                flightModificationOnDemand: false,
                                discountsApplied: {
                                    originalPrice: {
                                        fare: 102,
                                        tax: 60.66,
                                        total: 162.66,
                                        currency: 'EUR',
                                        ticketingFee: 0
                                    },
                                    discounts: [
                                        {
                                            type: 'PARTNER',
                                            percentDiscount: 10,
                                            totalDiscount: 16.27,
                                            description: 'Descuento Exclusivo Iberia Cards',
                                            discountType: 'GENERAL',
                                            partner: {
                                                partnerId: 'IBC',
                                                productId: '20'
                                            },
                                            userMustFly: false
                                        }
                                    ],
                                    originalOfferItems: [
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                            passengerIds: [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        },
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                            passengerIds: [
                                                'CHILD_01'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        }
                                    ],
                                    totalDiscount: 16.27
                                },
                                excludePenalties: false,
                                price: {
                                    fare: 91.8,
                                    tax: 54.59,
                                    total: 146.39,
                                    currency: 'EUR',
                                    ticketingFee: 0
                                }
                            }
                        ],
                        oBdiscount: false
                    },
                    {
                        cabinType: 'B',
                        cabinDescription: 'Business Class',
                        commercialCode: 'BUSCOMMH',
                        commercialName: 'Business Confort',
                        commercialNameES: 'Business Confort',
                        priority: 150,
                        conditions: [
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '2'
                                },
                                key: 0,
                                previewStatus: true
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'Sin equipaje en bodega',
                                    message: 'No incluido',
                                    code: 'CA_1_PIEZAS_PAGO',
                                    conditionStatus: false,
                                    observationCode: '1'
                                },
                                key: 1,
                                previewStatus: true
                            },
                            {
                                code: 'COMIDA',
                                name: 'Comida',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'Comida_no_incluida',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 2,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                    code: 'CA_Asiento_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 3,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 4,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTODELANTERO',
                                name: 'Asiento Delantero',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_Delantero_pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 5,
                                previewStatus: true
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 6,
                                previewStatus: true
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 7,
                                previewStatus: true
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 65,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste.',
                                    message: 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 8,
                                previewStatus: true
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido',
                                units: null,
                                extendedInfo: {
                                    title: 'Reembolsos no permitidos',
                                    message: 'No permitido',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 9,
                                previewStatus: true
                            },
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 10,
                                previewStatus: false
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 21,
                                previewStatus: false
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 22,
                                previewStatus: false
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 23,
                                previewStatus: false
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 24,
                                previewStatus: false
                            },
                            {
                                code: 'AVIO',
                                name: 'AVIOS',
                                text: 'Si',
                                units: null,
                                extendedInfo: {
                                    title: 'Avios incluido',
                                    message: 'Si',
                                    code: 'AVIOS incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 25,
                                previewStatus: false
                            },
                            {
                                code: 'WIFI',
                                name: 'WiFi',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: '',
                                    code: 'WiFi pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 26,
                                previewStatus: false
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText: {}
                            },
                            {
                                observationCode: 2,
                                observationText: {}
                            },
                            {
                                observationCode: 3,
                                observationText: {}
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        isCompatibleFare: true,
                        farePrice: 556.79,
                        fareDiscountPriceToCalculate: 229.22,
                        farePriceToCalculate: 206.3,
                        farePriceShown: '206€',
                        fareDiscountPriceShown: '229€',
                        fareCurrency: 'EUR',
                        remainingSeats: 7,
                        offers: [
                            {
                                offerId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP',
                                offerItems: [
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    },
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'CHILD_01'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    }
                                ],
                                originDestinations: [
                                    {
                                        priceDiscountApplied: true,
                                        totalPrice: {
                                            fare: 91.8,
                                            tax: 54.59,
                                            total: 146.39,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        totalPriceDiscountData: {
                                            totalDiscount: 16.27,
                                            percentDiscount: 10,
                                            totalOriginal: 162.66
                                        },
                                        adultPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        adultPriceDiscountData: {
                                            totalDiscount: 5.42,
                                            percentDiscount: 10,
                                            totalOriginal: 54.22
                                        },
                                        perPassengerPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        originDestinationId: 'OD1',
                                        applicableSlices: [
                                            {
                                                sliceId: '1',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043220221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '2',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044820221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '3',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB042620221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '5',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043420221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '6',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044020221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                timeLimits: '2022-10-19T13:36:25.417',
                                paymentTimeLimit: null,
                                specialDiscountsApplied: [
                                    {
                                        type: 'PARTNER',
                                        percentDiscount: 10,
                                        totalDiscount: 16.27,
                                        description: 'Descuento Exclusivo Iberia Cards',
                                        discountType: 'GENERAL',
                                        partner: {
                                            partnerId: 'IBC',
                                            productId: '20'
                                        },
                                        userMustFly: false
                                    }
                                ],
                                providerOfferId: 'TuJ7wlRx9zFMvGCcFERnR5004',
                                privateFare: false,
                                offerType: '',
                                flightModificationOnDemand: false,
                                discountsApplied: {
                                    originalPrice: {
                                        fare: 102,
                                        tax: 60.66,
                                        total: 162.66,
                                        currency: 'EUR',
                                        ticketingFee: 0
                                    },
                                    discounts: [
                                        {
                                            type: 'PARTNER',
                                            percentDiscount: 10,
                                            totalDiscount: 16.27,
                                            description: 'Descuento Exclusivo Iberia Cards',
                                            discountType: 'GENERAL',
                                            partner: {
                                                partnerId: 'IBC',
                                                productId: '20'
                                            },
                                            userMustFly: false
                                        }
                                    ],
                                    originalOfferItems: [
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                            passengerIds: [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        },
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                            passengerIds: [
                                                'CHILD_01'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        }
                                    ],
                                    totalDiscount: 16.27
                                },
                                excludePenalties: false,
                                price: {
                                    fare: 91.8,
                                    tax: 54.59,
                                    total: 146.39,
                                    currency: 'EUR',
                                    ticketingFee: 0
                                }
                            }
                        ],
                        oBdiscount: false
                    },
                    {
                        cabinType: 'B',
                        cabinDescription: 'Business Class',
                        commercialCode: 'BFLROES',
                        commercialName: 'Business Flexible',
                        commercialNameES: 'Business Flexible',
                        priority: 100,
                        conditions: [
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '2'
                                },
                                key: 0,
                                previewStatus: true
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'Sin equipaje en bodega',
                                    message: 'No incluido',
                                    code: 'CA_1_PIEZAS_PAGO',
                                    conditionStatus: false,
                                    observationCode: '1'
                                },
                                key: 1,
                                previewStatus: true
                            },
                            {
                                code: 'COMIDA',
                                name: 'Comida',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'Comida_no_incluida',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 2,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                    code: 'CA_Asiento_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 3,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                },
                                key: 4,
                                previewStatus: true
                            },
                            {
                                code: 'ASIENTODELANTERO',
                                name: 'Asiento Delantero',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_Delantero_pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 5,
                                previewStatus: true
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 6,
                                previewStatus: true
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 7,
                                previewStatus: true
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 65,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste.',
                                    message: 'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 8,
                                previewStatus: true
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido',
                                units: null,
                                extendedInfo: {
                                    title: 'Reembolsos no permitidos',
                                    message: 'No permitido',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 9,
                                previewStatus: true
                            },
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 10,
                                previewStatus: false
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 21,
                                previewStatus: false
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 22,
                                previewStatus: false
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 23,
                                previewStatus: false
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 24,
                                previewStatus: false
                            },
                            {
                                code: 'AVIO',
                                name: 'AVIOS',
                                text: 'Si',
                                units: null,
                                extendedInfo: {
                                    title: 'Avios incluido',
                                    message: 'Si',
                                    code: 'AVIOS incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 25,
                                previewStatus: false
                            },
                            {
                                code: 'WIFI',
                                name: 'WiFi',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: '',
                                    code: 'WiFi pago',
                                    conditionStatus: false,
                                    observationCode: null
                                },
                                key: 26,
                                previewStatus: false
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText: {}
                            },
                            {
                                observationCode: 2,
                                observationText: {}
                            },
                            {
                                observationCode: 3,
                                observationText: {}
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ],
                        isCompatibleFare: true,
                        farePrice: 737.69,
                        fareDiscountPriceToCalculate: 304.22,
                        farePriceToCalculate: 273.8,
                        farePriceShown: '274€',
                        fareDiscountPriceShown: '304€',
                        fareCurrency: 'EUR',
                        remainingSeats: 7,
                        offers: [
                            {
                                offerId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP',
                                offerItems: [
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'ADULT_01',
                                            'ADULT_02'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    },
                                    {
                                        offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                        price: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        passengerIds: [
                                            'CHILD_01'
                                        ],
                                        privateFareInformation: null,
                                        reshopDifferential: null,
                                        surcharges: null
                                    }
                                ],
                                originDestinations: [
                                    {
                                        priceDiscountApplied: true,
                                        totalPrice: {
                                            fare: 91.8,
                                            tax: 54.59,
                                            total: 146.39,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        totalPriceDiscountData: {
                                            totalDiscount: 16.27,
                                            percentDiscount: 10,
                                            totalOriginal: 162.66
                                        },
                                        adultPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        adultPriceDiscountData: {
                                            totalDiscount: 5.42,
                                            percentDiscount: 10,
                                            totalOriginal: 54.22
                                        },
                                        perPassengerPrice: {
                                            fare: 30.6,
                                            tax: 18.2,
                                            total: 48.8,
                                            currency: 'EUR',
                                            ticketingFee: 0
                                        },
                                        originDestinationId: 'OD1',
                                        applicableSlices: [
                                            {
                                                sliceId: '1',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043220221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '2',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044820221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '3',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB042620221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '5',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB043420221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            },
                                            {
                                                sliceId: '6',
                                                remainingSeats: 9,
                                                segments: [
                                                    {
                                                        segmentId: 'IB044020221128',
                                                        fareFamily: 'TBAESEU',
                                                        bookingCode: null,
                                                        bookingClass: 'ECONOMY',
                                                        rbd: 'A',
                                                        remainingSeats: 9,
                                                        fareBasis: '',
                                                        extendedFareCode: 'ADNOB4',
                                                        brandCode: null,
                                                        checkedBaggageAllowanceKeys: [],
                                                        carryOnBaggageAllowanceKeys: [],
                                                        ticketDesignator: null,
                                                        seatDisplays: null,
                                                        cabinDescription: ''
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                timeLimits: '2022-10-19T13:36:25.417',
                                paymentTimeLimit: null,
                                specialDiscountsApplied: [
                                    {
                                        type: 'PARTNER',
                                        percentDiscount: 10,
                                        totalDiscount: 16.27,
                                        description: 'Descuento Exclusivo Iberia Cards',
                                        discountType: 'GENERAL',
                                        partner: {
                                            partnerId: 'IBC',
                                            productId: '20'
                                        },
                                        userMustFly: false
                                    }
                                ],
                                providerOfferId: 'TuJ7wlRx9zFMvGCcFERnR5004',
                                privateFare: false,
                                offerType: '',
                                flightModificationOnDemand: false,
                                discountsApplied: {
                                    originalPrice: {
                                        fare: 102,
                                        tax: 60.66,
                                        total: 162.66,
                                        currency: 'EUR',
                                        ticketingFee: 0
                                    },
                                    discounts: [
                                        {
                                            type: 'PARTNER',
                                            percentDiscount: 10,
                                            totalDiscount: 16.27,
                                            description: 'Descuento Exclusivo Iberia Cards',
                                            discountType: 'GENERAL',
                                            partner: {
                                                partnerId: 'IBC',
                                                productId: '20'
                                            },
                                            userMustFly: false
                                        }
                                    ],
                                    originalOfferItems: [
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_01',
                                            passengerIds: [
                                                'ADULT_01',
                                                'ADULT_02'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        },
                                        {
                                            offerItemId: 'IB433d8e06e72445a2835fd99dfe1f9d82OP_02',
                                            passengerIds: [
                                                'CHILD_01'
                                            ],
                                            price: {
                                                fare: 34,
                                                tax: 20.22,
                                                total: 54.22,
                                                currency: 'EUR',
                                                ticketingFee: 0
                                            },
                                            detailedTaxes: [],
                                            reshopDetailedTaxes: [],
                                            fareComponents: [],
                                            surcharges: null
                                        }
                                    ],
                                    totalDiscount: 16.27
                                },
                                excludePenalties: false,
                                price: {
                                    fare: 91.8,
                                    tax: 54.59,
                                    total: 146.39,
                                    currency: 'EUR',
                                    ticketingFee: 0
                                }
                            }
                        ],
                        oBdiscount: false
                    }
                ],
                bestCabinsPrice: false
            }
        },
        cabinsLength: 2,
        showFares: false,
        slicePrice: 48.8,
        sliceCurrency: 'EUR',
        durationParsed: '1h 5min.',
        departureDateTimeParsed: '07:25',
        departureDateParsed: {
            dateTime: '07:25',
            weekDay: 'WEEKDAY_MONDAY',
            hour: 1,
            minutes: 0,
            day: 28,
            monthNumber: 11,
            month: 'MONTH_NOVEMBER',
            year: 2022,
            formatedDate: '2022-11-28 07:25'
        },
        arrivalDateTimeParsed: '08:30',
        daysOfTravel: 0,
        allOperatedBy: [
            'Iberia'
        ],
        technicalStop: 0,
        sliceURL: '/aerolineas/logo_pos_IB.svg',
        maxSlicePrice: 161.3
    };
    const controllerDependencies = {
        '$scope': {},
        '$timeout': {},
        'BookingComponentUtils': {}
    };
    const ctrlBinds = {
        'sliceInfoModel': fakeSliceInfoModel,
        'selectedSliceIndex': 1,
        'showFaresSelected': false,
        'origin': {},
        'destination': {},
        'originDestinationId': 1,
        'currencies': {},
        'currentOriginDestinationIndex': 2,
        'animationRun': {}
    };
    const fakeBookingComponentUtils = { 'equalHeight': jasmine.createSpy() };
    const fakeBookingUtilService = { 'checkDumboUser': jasmine.createSpy('checkDumboUser').and.callFake(function () { return true; }) };
    const fakePartner = {
        isSelected: true,
        partnerIdentifier: 'IBC',
        percentDiscount: 10,
        productDescription: 'Descuento Exclusivo Iberia Cards',
        userMustFly: false,
        userTier: ''
    };
    const fakeCorporateDiscount = {
        type: "CORPORATE",
        discountType: "ODM",
        description: "Descuento Alemania",
        percentDiscount: 2.14,
        totalDiscount: 10,
        corporateCodes: "470891"
    }
    const fakeIbCheckPartnersDiscountsService = {
        'getSelectedPartner': jasmine.createSpy().and.callFake(() => {
            return fakePartner;
        })
    };
    const fakeDatalayerBKIService = {
        'getDigitalDataEcommerce': jasmine.createSpy()
    };
    const fakeSpecialDiscount = {
        description: 'Descuento Exclusivo Iberia Cards',
        discountType: 'GENERAL',
        partner: { partnerId: 'IBC', productId: '20' },
        percentDiscount: 10,
        totalDiscount: 16.27,
        type: 'PARTNER',
        userMustFly: false
    };
    const fakeSpecialDiscountImage = 'campaign';
    const fakeHeaderModel = {
        headerModel: {
            trips: [
                {
                    tripType: '1'
                }
            ]
        }
    };
    const elementMock = [
        {
            dispatchEvent: () => { },
            addEventListener: () => {},
            removeEventListener: () => {},
        }

    ]
    let BookingAppConstants = require('../../../../../../../mocks/constants/BookingAppConstants-mock.json')
    let fakeIbSliceDetailsComponentService = new IbSliceDetailsComponentServiceMock ();
    beforeEach(function () {
        BookingAppConstants = require('../../../../../../../mocks/constants/BookingAppConstants-mock.json')
        angular.mock.module('ib-booking-slice-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingComponentUtils', fakeBookingComponentUtils);
            $provide.value('BookingAppConstants', BookingAppConstants);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('IbCheckPartnersDiscountsService', fakeIbCheckPartnersDiscountsService);
            $provide.value('DatalayerBKIService', fakeDatalayerBKIService);
            $provide.value('$element', elementMock);
            $provide.value('IbSliceDetailsComponentService', fakeIbSliceDetailsComponentService);
        });
        inject(function ($componentController, $rootScope, $timeout, BookingComponentUtils, _localStorageService_) {
            localStorageService = _localStorageService_;
            localStorageService.set('customerData', customerDataFake)
            localStorageService.set('headerModel', fakeHeaderModel);
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$timeout = $timeout;
            controllerDependencies.BookingComponentUtils = BookingComponentUtils;
            controller = $componentController('ibBookingSliceInfo', controllerDependencies, ctrlBinds);
            controllerDependencies.$scope.$apply();
            controller.$onInit();
        });
    });

    describe('When activate() is called,', function () {
        it('and should asign data to model', function (done) {
            expect(controller.selectedCabin).toEqual('');
            controller.sliceSelectedDiscount = fakeSpecialDiscount;
            expect(controller.sliceSelectedDiscount).toEqual(fakeSpecialDiscount);
            controller.sliceSelectedDiscountImage = fakeSpecialDiscountImage;
            expect(controller.sliceSelectedDiscountImage).toEqual(fakeSpecialDiscountImage);
            expect(controller.isReturn).toEqual('1');
            done();
        });
    });

    describe('When sendSelectedSlice() is called,', function () {
        it('should asign select filter to controller', function (done) {
            spyOn(angular, 'element').and.returnValue({ 0: { 'offsetTop': 'test' }, 'data': jasmine.createSpy().and.returnValue(), 'triggerHandler': jasmine.createSpy().and.returnValue([{ 'data': 'data' }]), 'find': jasmine.createSpy().and.returnValue([{ 'offsetTop': 'test' }]) });
            controller.sendSelectedSlice('element', 'cabin');
            expect(controller.sliceInfoModel.showedCabin).toEqual('cabin');
            scope.$apply();
            done();
        });
    });
    describe('When toogleDetailsModal() is called,',  () =>{
        it('should asign select filter to controller',  () =>{
            controller.toogleDetailsModal();
            expect(fakeIbSliceDetailsComponentService.show).toHaveBeenCalled();
        });
    });

});
