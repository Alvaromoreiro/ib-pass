import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
describe('BookingPassengerInfoTransformer Test', function () {

    var rootScope, BookingPassengerInfoTransformer, localStorageService, dateFormatFilter, translateFilter;

    var fakesce = { 'trustAsHtml': jasmine.createSpy('trustAsHtml').and.returnValue() };

    var fakeCookies= {};
    let fakeSessionStorage = new StorageServiceMock();

    var fakeCurrencyService = {
        'getCurrenciesAsMap': jasmine.createSpy().and.callFake(function () {
            return ['currency']
        }),
        'formatPrice': jasmine.createSpy().and.callFake(function () {
            return '172,32 €'
        }),
        'getCurrencyObject': jasmine.createSpy().and.callFake(function () {
            return { alignment: 'R', code: 'EUR', decimalSeparator: ',', decimals: 2, description: 'Euro', groupingSeparator: '.', recommendedDisplay: 'symbol', symbol: '€' }
        }),
        'formatAvios': jasmine.createSpy().and.callFake(function () {
            return '80,000 Avios'
        }),
        'getPriceByRoundingPolicy': jasmine.createSpy().and.callFake(function () {
            var fecha = new Date(2019, 11, 24);
            return fecha;
        })
    };

    var fakeBookingUtilService = {
        'getRelatedContent': jasmine.createSpy().and.callFake(function () {
            return 'data';
        }),
        'generateCalendarRequestData': jasmine.createSpy().and.callFake(function () {
            var data = { 'slices': 'info' }
            return data;
        }),
        'getCompanyURL': jasmine.createSpy().and.callFake(function () {
            return '/aerolineas/logo_pos_BA.svg'
        }),
        'generateAvailabilityRequestData': jasmine.createSpy().and.callFake(function () {
            return 'availabilityRequestData'
        }),
        'getFormatedDate': jasmine.createSpy(),
        'getStatusResident': jasmine.createSpy().and.callFake(function () {
            return true;
        }),
        'getTypeOfPassenger': jasmine.createSpy().and.callFake(function () {
            return 'ADULT';
        }),
        'getTripsBreakdownInfo': jasmine.createSpy().and.callFake(function () {
            return 'test cumpleee'
        }),
        'getPassengersBreakdownInfo': jasmine.createSpy().and.callFake(function () {
            return 'test cumpleee'
        }),
        'getURLFirstParameterByName': jasmine.createSpy().and.callFake(function () {
            return '';
        })
    };

    var fakeDatalayerUtilsService = {
        'generateDatalayerPassengers': jasmine.createSpy().and.callFake(function () {
            return 'datalayerPassenger done'
        })
    };

    var fakeCommonsUtilsService = {
        'translateTextAndAddVariablesArray': jasmine.createSpy().and.callFake(function () {
            return 'datalayerPassenger done'
        }),
        'translateTextAndAddVariable': jasmine.createSpy().and.callFake(function () {
            return 'datalayerPassenger done'
        })
    };

    var fakeContentPreprocessorService = {
        'parseTextWithLinks': jasmine.createSpy().and.callFake(function () {
            return 'test cumpleeeeeeee'
        })
    };

    var fakeBookingAppConstants = {
        LOGIN_ONB: 'ONB',
        passengerTypes: {
            'Default': 'DEFAULT',
            'senior': 'SENIOR',
            'adult': 'ADULT',
            'young': 'YOUTH',
            'child': 'CHILD',
            'infant': 'INFANT',
            'SPECIAL_NEEDS': 'specialNeed'
        },
        bookingPatterns: {
            CARD_NUMBER_CLEANER: '\\D+',
            DNI_DOCUMENT: /^([0-9]{8})[A-Za-z]$/,
        },
        SEARCH_FLIGHT_TYPE: {
            METASEARCH: 'metasearchFlight'
        },
        DATA_TO_GENERATE_URL_METAS:{
            REFERRAL_ID: 'shoppingCartRecovery',
            FLASHD_QUADRIGAM: '#!/FLASHD',
            FLIGHT_URL_PARAMS: {
                FLASH_OFFER_TYPE: 'FLASH_OFFER_TYPE',
                FLASH_TYPE_ACTIVE: 'ACTIVE',
                FLASH_OFFER_ID: 'FLASH_OFFER_ID',
                FLASH_DESTINATION: 'END_CITY_01',
                FLASH_ORIGIN: 'BEGIN_CITY_01',
            },
            KEEP_URL_PARAMS: ['market', 'language', 'bookingMarket'],
            CLEAN_URL_PARAM_METASEARCH: [
                'ReferralId',
                'utm_source',
                'utm_medium',
                'gclid',
                'gclsrc',
                'cod_crm',
                'utm_campaign',
                'utm_content',
                'kayakclickid',
                'skyscanner_redirectid',
                'residentCode',
                'familianumerosa'
            ],
            PRICE_URL_PARAMS: {
                PRICE: 'DisplayedPrice',
                CURRENCY: 'DisplayedPriceCurrency'
            },
        },
        BOOKING_PARAMS_NAMES: {
            RESIDENT: 'RESIDENT'
        },
        DISCOUNTS_URL_PARAMS: {
            RESIDENT: 'RESIDENT',
            LARGE_FAMILY: 'LARGE_FAMILY_TYPE'
        },
        PASSENGER_FORM_RESIDENCE: {
            '070407': {
                description: 'Islas Baleares',
                firstPattern: 'Mallorca: 07-999999-9999',
                secondPattern: 'Resto: 07-99-9999-99'
            },
            '462508': {
                description: 'Valencia',
                pattern: '99-99999-9999'
            }
        }
    };

    var fakeBookingPassengerInfoConstants = {
        PASSENGER_LABEL: 'GENERAL_LABEL_PASSENGER',
        PASSENGER_GENDERS: 'FEMALE',
        WHEEL_CHAIR_CODES: {
            DEFAULT: '00'
        }
    };

    var mockOnHoldOptions = [{
        "onHoldOptionId": "IBe5c17d490e80416993559db795829085OP_01",
        "hours": 72,
        "securityMargin": 6,
        "timeLimits": "2021-10-31T15:16:03.476+00:00",
        "referenceTimeLimit": "2021-10-31T16:16:03.476",
        "referenceCity": {
            "code": "MAD",
            "description": "Madrid",
            "countryCode": "ES"
        },
        "price": {
            "fare": 5.00,
            "tax": 0,
            "total": 5.0,
            "currency": "EUR",
            "ticketingFee": 0
        }
    }]

    var mockFareData = {
        'responseId': 'Qm9va2luZ0BHVy0xNTc1OTY3OTU4MzczLVVoSFgw',
        'offers': [
            {
                'offerId': 'IB3064756178df4ecb92beea1a17c3da58OP',
                'price': {
                    'fare': 307,
                    'tax': 39.75,
                    'total': 346.75,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'slices': [
                    {
                        'sliceId': 'LHRMAD20191219091500',
                        'departureDateTime': '2019-12-19 09:15',
                        'arrivalDateTime': '2019-12-19 12:40',
                        'duration': 145,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 306.61,
                            'currency': 'EUR'
                        },
                        'detailedPrices': [
                            {
                                'fare': 306.61,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01'
                                ],
                                'segmentPrices': [
                                    {
                                        'price': {
                                            'fare': 306.61,
                                            'currency': 'EUR'
                                        },
                                        'originCurrencyPrice': {
                                            'fare': 258,
                                            'currency': 'GBP'
                                        },
                                        'fareCode': 'HZNNAOB6',
                                        'segmentsIds': [
                                            'IB316320191219'
                                        ],
                                        'ticketDesignator': null,
                                        'endorsement': '52 CHGS PERM REF RESTRICTE'
                                    }
                                ],
                                'commission': null
                            }
                        ],
                        'segments': [
                            {
                                'departure': {
                                    'code': 'LHR',
                                    'name': 'London Heathrow',
                                    'terminal': '5',
                                    'city': {
                                        'code': 'LON',
                                        'description': 'Londres',
                                        'countryCode': 'GB',
                                        'country': {
                                            'code': 'GB',
                                            'description': 'Reino Unido'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'MAD',
                                    'name': 'Madrid Adolfo Suarez-Barajas',
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
                                    'marketingFlightNumber': '3163',
                                    'operationalFlightNumber': '3163',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': {
                                        'code': '32A',
                                        'description': 'Airbus Industrie A320 (Sharklets)'
                                    }
                                },
                                'cabin': {
                                    'rbd': 'H',
                                    'bookingCode': null,
                                    'bookingClass': 'ECONOMY',
                                    'remainingSeats': 9,
                                    'fareFamily': 'TBEUKES',
                                    'fareBasis': 'HZNNAOB6',
                                    'seatDisplays': null,
                                    'extendedFareCode': null,
                                    'cabinDescription': 'Turista'
                                },
                                'overnight': false,
                                'id': 'IB316320191219',
                                'duration': 145,
                                'waitingTime': 0,
                                'providerId': null,
                                'ticketDesignator': '',
                                'accrualQuote': {
                                    'redemptionPoints': 786,
                                    'qualificationPoints': 75,
                                    'redemptionOffers': [

                                    ],
                                    'qualificationOffers': [

                                    ]
                                },
                                'delayInformation': null,
                                'stop': null,
                                'departureDateTime': '2019-12-19 09:15',
                                'arrivalDateTime': '2019-12-19 12:40'
                            }
                        ],
                        'overnight': false
                    }
                ],
                'offerExpiration': '2019-12-10T10:42:49.373+01:00',
                'paymentTimeLimit': '2019-12-11T22:59:59.000+00:00',
                'onHoldOptions': [
                    {
                        'onHoldOptionId': 'IB3064756178df4ecb92beea1a17c3da58OP_01',
                        'hours': 72,
                        'securityMargin': 6,
                        'timeLimits': '2019-12-13T08:52:49.730+00:00',
                        'referenceTimeLimit': '2019-12-13T09:52:49.730',
                        'referenceCity': {
                            'code': 'MAD',
                            'description': 'Madrid',
                            'countryCode': 'ES'
                        },
                        'price': {
                            'fare': 5,
                            'tax': 0,
                            'total': 5,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        }
                    }
                ],
                'cashAviosPossibilities': [
                    {
                        'totalDiscount': 10,
                        'currency': 'EUR',
                        'aviosRequired': 1850,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 10,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 103.91,
                        'currency': 'EUR',
                        'aviosRequired': 19245,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 103.91,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 173.18,
                        'currency': 'EUR',
                        'aviosRequired': 32070,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 173.18,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 277.09,
                        'currency': 'EUR',
                        'aviosRequired': 51315,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 277.09,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 346.36,
                        'currency': 'EUR',
                        'aviosRequired': 64140,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 346.36,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    }
                ],
                'carryOnBaggageAllowances': [
                    {
                        'totalQuantity': 1,
                        'segmentIds': [
                            'IB316320191219'
                        ]
                    }
                ],
                'checkedBagAllowances': [
                    {
                        'totalQuantity': 0,
                        'pieceAllowances': [

                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ]
                    }
                ],
                'availableServices': [
                    {
                        'type': 'specialNeed',
                        'serviceId': 'SSR_SN_BLND_233d417c-4f8c-4b53-8b09-c2fe68045ca8_1',
                        'serviceCode': 'BLND',
                        'price': {
                            'fare': 0,
                            'currency': 'EUR'
                        },
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'sliceIds': [
                            'LHRMAD20191219091500'
                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ],
                        'owner': 'IB',
                        'code': 'BLND',
                        'name': 'Pasajero ciego',
                        'descriptions': [
                            'Solicite servicio de animales si viaja con uno'
                        ],
                        'text': null,
                        'passengersRelation': null
                    },
                    {
                        'type': 'specialNeed',
                        'serviceId': 'SSR_SN_DEAF_233d417c-4f8c-4b53-8b09-c2fe68045ca8_2',
                        'serviceCode': 'DEAF',
                        'price': {
                            'fare': 0,
                            'currency': 'EUR'
                        },
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'sliceIds': [
                            'LHRMAD20191219091500'
                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ],
                        'owner': 'IB',
                        'code': 'DEAF',
                        'name': 'Pasajero sordo',
                        'descriptions': [
                            'Solicite servicio de animales si viaja con uno'
                        ],
                        'text': null,
                        'passengersRelation': null
                    },
                    {
                        'type': 'specialNeed',
                        'serviceId': 'SSR_SN_SVAN_233d417c-4f8c-4b53-8b09-c2fe68045ca8_3',
                        'serviceCode': 'SVAN',
                        'price': {
                            'fare': 0,
                            'currency': 'EUR'
                        },
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'sliceIds': [
                            'LHRMAD20191219091500'
                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ],
                        'owner': 'IB',
                        'code': 'SVAN',
                        'name': 'Animal de asistencia',
                        'descriptions': [
                            'Servicio Animal que viaja en la cabina con pasajeros ciegos, sordos, discapacitados o instructores certificados. Especificar la raza y el peso del animal'
                        ],
                        'text': null,
                        'passengersRelation': null
                    },
                    {
                        'type': 'specialNeed',
                        'serviceId': 'SSR_SN_WCHC_233d417c-4f8c-4b53-8b09-c2fe68045ca8_4',
                        'serviceCode': 'WCHC',
                        'price': {
                            'fare': 0,
                            'currency': 'EUR'
                        },
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'sliceIds': [
                            'LHRMAD20191219091500'
                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ],
                        'owner': 'IB',
                        'code': 'WCHC',
                        'name': 'Silla de ruedas hasta la cabina',
                        'descriptions': [
                            'El pasajero no puede caminar y necesita el servicio de asistencia hasta / desde el asiento del avión.'
                        ],
                        'text': null,
                        'passengersRelation': null
                    },
                    {
                        'type': 'specialNeed',
                        'serviceId': 'SSR_SN_WCHR_233d417c-4f8c-4b53-8b09-c2fe68045ca8_5',
                        'serviceCode': 'WCHR',
                        'price': {
                            'fare': 0,
                            'currency': 'EUR'
                        },
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'sliceIds': [
                            'LHRMAD20191219091500'
                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ],
                        'owner': 'IB',
                        'code': 'WCHR',
                        'name': 'Silla de ruedas para rampas',
                        'descriptions': [
                            'El pasajero necesita la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puede acceder al avión por escaleras y desplazarse dentro del mismo sin necesidad de asistencia. '
                        ],
                        'text': null,
                        'passengersRelation': null
                    },
                    {
                        'type': 'specialNeed',
                        'serviceId': 'SSR_SN_WCHS_233d417c-4f8c-4b53-8b09-c2fe68045ca8_6',
                        'serviceCode': 'WCHS',
                        'price': {
                            'fare': 0,
                            'currency': 'EUR'
                        },
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'sliceIds': [
                            'LHRMAD20191219091500'
                        ],
                        'segmentIds': [
                            'IB316320191219'
                        ],
                        'owner': 'IB',
                        'code': 'WCHS',
                        'name': 'Silla de ruedas para escalones',
                        'descriptions': [
                            'El pasajero necesita la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puede subir ni bajar escaleras, pero puede desplazarse hasta su asiento sin necesidad de asistencia.'
                        ],
                        'text': null,
                        'passengersRelation': null
                    }
                ],
                'selectedServices': [

                ],
                'specialDiscountsApplied': [

                ],
                'accrualQuote': {
                    'redemptionPoints': 786,
                    'qualificationPoints': 75
                },
                'offerItems': [
                    {
                        'offerItemId': 'IB3064756178df4ecb92beea1a17c3da58OP_01',
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'price': {
                            'fare': 307,
                            'tax': 39.75,
                            'total': 346.75,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedTaxes': [
                            {
                                'code': 'GB',
                                'amount': 15.45,
                                'currency': 'EUR',
                                'description': 'Impuesto sobre los pasajeros aéreos (APD)'
                            },
                            {
                                'code': 'UB',
                                'amount': 24.3,
                                'currency': 'EUR',
                                'description': 'Cargo por servicio al pasajero'
                            }
                        ],
                        'fareCalculation': 'LON IB MAD332.50NUC332.50END ROE0.775934',
                        'fareComponents': [
                            {
                                'remarks': '  ORIGINATING UNITED KINGDOM -\n    CANCELLATIONS\n      ANY TIME\n        TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/NO-SHOW.\n         NOTE -\n          FARE COMPONENT IS NON-REFUNDABLE\n          ---------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND\n          PASSENGERS\n          FAMILY MEMBERS UP TO 1ST DEGREE RELATIONS OR FOR\n          PASSENGER/S HOSPITAL ADMISSION\n          ----------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1- THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2- THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED.\n          3- WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ----------------------------------\n          REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ----------------------------------\n          REFUND PERMITTED WITHIN TICKET VALIDITY.\n          ----------------------------------\n          ANY NON-REFUNDABLE AMOUNT FROM A PREVIOUS TICKET\n          REMAINS NON-REFUNDABLE FOLLOWING A CHANGE.\n          ----------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          ----------------------------------\n          FOR NON REFUNDABLE FARES THE YQ/YR CARRIER\n          IMPOSED SURCHARGE WILL NOT BE REFUNDED\n    CHANGES\n      ANY TIME\n        CHARGE GBP 60.00 FOR REISSUE.\n        CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          /CHARGE APPLIES PER TRANSACTION - PER PERSON TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          NO-SHOWS FOR A FLIGHT ARE CONSIDERED A\n          CANCELLATION AFTER DEPARTURE AND CHANGES ARE NOT\n          PERMITTED.\n          -----------------------------\n          ----REPRICING CONDITIONS ----\n          A. BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          NEW TICKET MAY BE EQUAL OR HIGHER THAN PREVIOUS\n          AND MUST COMPLY WITH ALL PROVISIONS OF THE NEW\n          FARE BEING APPLIED.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED. ANY APPLICABLE\n          CHANGE FEE STILL APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.\n          -----------------------------------------------\n          NO-SHOW FOR A FLIGHT ARE CONSIDERED A\n          CANCELLATION AFTER DEPARTURE AND CHANGES ARE NOT\n          PERMITTED.\n          -----------------------------------------------\n          TICKET IS NOT TRANSFEREABLE TO ANOTHER PERSON',
                                'segmentIds': [
                                    'IB316320191219'
                                ],
                                'details': [
                                    {
                                        'type': 'Change',
                                        'application': 'BEFORE-DEPARTURE',
                                        'minPrice': {
                                            'amount': 60,
                                            'currency': 'GBP'
                                        },
                                        'maxPrice': {
                                            'amount': 60,
                                            'currency': 'GBP'
                                        }
                                    },
                                    {
                                        'type': 'Change',
                                        'application': 'AFTER-DEPARTURE',
                                        'minPrice': {
                                            'amount': 60,
                                            'currency': 'GBP'
                                        },
                                        'maxPrice': {
                                            'amount': 60,
                                            'currency': 'GBP'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse': [

                                ]
                            }
                        ]
                    }
                ],
                'type': 'REGULAR'
            }
        ],
        'passengers': [
            {
                'passengerId': 'ADULT_01',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'CHILD_01',
                'passengerType': 'CHILD',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'INFANT_01',
                'passengerType': 'INFANT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            }
        ],
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '€',
                    'alignment': 'R',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        },
        'fareFamilyConditions': [
            {
                'cabinType': 'E',
                'cabinDescription': 'Turista',
                'commercialCode': 'TBEUKES',
                'commercialName': 'Básica',
                'commercialNameES': 'Básica',
                'priority': 900,
                'conditions': [
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
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'EQBODEGA',
                        'name': 'Equipaje en bodega',
                        'text': 'No incluido.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Sin equipaje en bodega',
                            'message': 'No incluido. ',
                            'code': 'CA_1_PIEZAS_PAGO',
                            'conditionStatus': false,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'ASIENTO',
                        'name': 'Selección de asiento',
                        'text': 'De pago.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Seleccionable con coste',
                            'message': 'De pago. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                            'code': 'CA_Asiento_Pago',
                            'conditionStatus': false,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'CAMBIO',
                        'name': 'Cambios',
                        'text': 'Permitidos antes de la salida del vuelo con una penalización de 60GBP. No presentarse al vuelo (no show) no permitidos.',
                        'units': 60,
                        'extendedInfo': {
                            'title': 'Cambio permitido con coste',
                            'message': 'Permitidos antes de la salida del vuelo con una penalización de 60GBP. No presentarse al vuelo (no show) no permitidos.',
                            'code': 'CA_CAMBIO CON PENALTY_60GBP_BD_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus': false,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'REEMBOLSO',
                        'name': 'Reembolso (por sentido)',
                        'text': 'No permitido',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Reembolso no permitido',
                            'message': 'No permitido.',
                            'code': 'CA_REEMBOLSO NO PERMITIDO',
                            'conditionStatus': false,
                            'observationCode': null
                        }
                    }
                ],
                'observations': [

                ],
                'conditionsPriority': [
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        'advices': [
            {
                "id": "advice-01",
                "message": "Los vuelos con código entre IB5000 y IB5999 están operados por Vueling.Dentro de las condiciones de transporte de Vueling puedes encontrar los artículos relacionados con el equipaje facturado en bodega, equipaje de mano, menores sin acompañar, transporte de animales permitidos y no permitidos, viajeros con necesidades especiales, etc...",
                "acknowledgement": {
                    "message": "He leido y acepto los <a target=\"_blank\" href=\"http://www.vueling.com/es/atencion-al-cliente/condiciones-de-transporte/?popup=true&width=500&height=800&attrs=scrollbars&market=ES&language=es\">términos y condiciones de transporte de Vueling</a>",
                    "required": true
                }
            },
            {
                'id': 'advice-02',
                'message': 'Estás reservando un vuelo con origen, destino o tránsito en EEUU o Reino Unido.En cumplimiento de la legislación vigente, deben recabarse y cederse a estos países ciertos datos de carácter personal. Para más información consulta la <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/CONDIC&cntId=proteccion_datos&market=ES&language=es\'>política de protección de datos y seguridad de la información</a>',
                'acknowledgement': null
            }
        ],
        'services': [
            {
                'type': 'specialNeed',
                'serviceId': 'SSR_SN_BLND_233d417c-4f8c-4b53-8b09-c2fe68045ca8_1',
                'serviceCode': 'BLND',
                'price': {
                    'fare': 0,
                    'currency': 'EUR'
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'sliceIds': [
                    'LHRMAD20191219091500'
                ],
                'segmentIds': [
                    'IB316320191219'
                ],
                'owner': 'IB',
                'code': 'BLND',
                'name': 'Pasajero ciego',
                'descriptions': [
                    'Solicite servicio de animales si viaja con uno'
                ],
                'text': null,
                'passengersRelation': null
            },
            {
                'type': 'specialNeed',
                'serviceId': 'SSR_SN_DEAF_233d417c-4f8c-4b53-8b09-c2fe68045ca8_2',
                'serviceCode': 'DEAF',
                'price': {
                    'fare': 0,
                    'currency': 'EUR'
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'sliceIds': [
                    'LHRMAD20191219091500'
                ],
                'segmentIds': [
                    'IB316320191219'
                ],
                'owner': 'IB',
                'code': 'DEAF',
                'name': 'Pasajero sordo',
                'descriptions': [
                    'Solicite servicio de animales si viaja con uno'
                ],
                'text': null,
                'passengersRelation': null
            },
            {
                'type': 'specialNeed',
                'serviceId': 'SSR_SN_SVAN_233d417c-4f8c-4b53-8b09-c2fe68045ca8_3',
                'serviceCode': 'SVAN',
                'price': {
                    'fare': 0,
                    'currency': 'EUR'
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'sliceIds': [
                    'LHRMAD20191219091500'
                ],
                'segmentIds': [
                    'IB316320191219'
                ],
                'owner': 'IB',
                'code': 'SVAN',
                'name': 'Animal de asistencia',
                'descriptions': [
                    'Servicio Animal que viaja en la cabina con pasajeros ciegos, sordos, discapacitados o instructores certificados. Especificar la raza y el peso del animal'
                ],
                'text': null,
                'passengersRelation': null
            },
            {
                'type': 'specialNeed',
                'serviceId': 'SSR_SN_WCHC_233d417c-4f8c-4b53-8b09-c2fe68045ca8_4',
                'serviceCode': 'WCHC',
                'price': {
                    'fare': 0,
                    'currency': 'EUR'
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'sliceIds': [
                    'LHRMAD20191219091500'
                ],
                'segmentIds': [
                    'IB316320191219'
                ],
                'owner': 'IB',
                'code': 'WCHC',
                'name': 'Silla de ruedas hasta la cabina',
                'descriptions': [
                    'El pasajero no puede caminar y necesita el servicio de asistencia hasta / desde el asiento del avión.'
                ],
                'text': null,
                'passengersRelation': null
            },
            {
                'type': 'specialNeed',
                'serviceId': 'SSR_SN_WCHR_233d417c-4f8c-4b53-8b09-c2fe68045ca8_5',
                'serviceCode': 'WCHR',
                'price': {
                    'fare': 0,
                    'currency': 'EUR'
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'sliceIds': [
                    'LHRMAD20191219091500'
                ],
                'segmentIds': [
                    'IB316320191219'
                ],
                'owner': 'IB',
                'code': 'WCHR',
                'name': 'Silla de ruedas para rampas',
                'descriptions': [
                    'El pasajero necesita la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puede acceder al avión por escaleras y desplazarse dentro del mismo sin necesidad de asistencia. '
                ],
                'text': null,
                'passengersRelation': null
            },
            {
                'type': 'specialNeed',
                'serviceId': 'SSR_SN_WCHS_233d417c-4f8c-4b53-8b09-c2fe68045ca8_6',
                'serviceCode': 'WCHS',
                'price': {
                    'fare': 0,
                    'currency': 'EUR'
                },
                'passengerIds': [
                    'ADULT_01'
                ],
                'sliceIds': [
                    'LHRMAD20191219091500'
                ],
                'segmentIds': [
                    'IB316320191219'
                ],
                'owner': 'IB',
                'code': 'WCHS',
                'name': 'Silla de ruedas para escalones',
                'descriptions': [
                    'El pasajero necesita la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puede subir ni bajar escaleras, pero puede desplazarse hasta su asiento sin necesidad de asistencia.'
                ],
                'text': null,
                'passengersRelation': null
            }
        ],
        'relatedContent': [
            {
                'key': 'SPECIAL_NEED_CONTACT_INFO',
                'value': 'Para pasajeros privados de cualquier movilidad y no autosuficientes, se ruega solicite el servicio y más información en el 901 111 500'
            }
        ]
    };

    var mockCustomerData = {
        'generalInfo': {
            'name': 'PRUEBASJULIO',
            'surname': 'PRUEBASJULIO ',
            'ibPlusNumber': '50984517',
            'category': 'ORO',
            'avios': 5918200,
            'pinStatus': '0',
            'lockStatus': 'AC',
            'loginAttempts': 0,
            'hasElectronicId': false,
            'secretQuestionCode': null,
            'program': 'IBPLUS',
            'aviosTransformed': '5.918.200'
        },
        'personalInfo': {
            'ibPlusNumber': '50984517',
            'name': 'PRUEBASJULIO',
            'surname1': 'PRUEBASJULIO',
            'surname2': '',
            'documentType': '05',
            'documentId': '121231231231',
            'nationality': 'ES',
            'gender': '1',
            'genderWebCode': '2',
            'birthDate': '1975-01-27',
            'maritalStatus': '',
            'contactPhone': '342342346',
            'contactPrefix': null,
            'contactEmail': 'leda.mclemente@iberia.es',
            'language': '2', 'languageWebCode': 'de',
            'communicationLanguage': '1',
            'communicationLanguageWebCode': 'en',
            'communicationPreference': '1',
            'residence': {
                'address': 'PEZ',
                'number': '5',
                'addressExtra': '',
                'numberExtra': '',
                'postalCode': '28901',
                'town': 'MADRID',
                'region': '',
                'country': 'ES',
                'phone': '91234456',
                'fax': '', 'state': '28'
            },
            'alarms': [
                {
                    'number': 2,
                    'params': ['15/02/2016']
                },
                {
                    'number': 5,
                    'params': ['TARJETA DE PRUEBAS', '23/07/2010']
                },
                {
                    'number': 8,
                    'params': ['15/02']
                }
            ],
            'socialNetworks': [],
            'status': {
                'lastModifiedDate': '2020-01-28',
                'creationDate': '2010-07-21',
                'deleted': false
            },
            'childrensBirthday': ['2018-02-02', '2009-01-26'],
            'childrenNumber': 2
        },
        'company': {
            'ibPlusNumber': '50984517',
            'profession': '',
            'professionWebCode': null,
            'position': '',
            'positionWebCode': null,
            'economicActivity': '',
            'companyId': '',
            'companyName': '',
            'location': {
                'address': '',
                'number': '',
                'addressExtra': '',
                'numberExtra': '',
                'postalCode': '',
                'town': '',
                'region': '',
                'country': '',
                'phone': '',
                'fax': '',
                'state': ''
            },
            'status': {
                'lastModifiedDate': '2020-01-28'
            }
        },
        'loyaltyCard': {
            'ibPlusNumber': '50984517',
            'category': 'ORO',
            'oneWorldCategory': 'EMERALD',
            'plasticType': 'STANDARD',
            'name': 'PRUEBASJULIO PRUEBASJULIO',
            'issuer': '001',
            'creationDate': '2010-07-21',
            'expirationDate': '2020-04-30',
            'lastUseDate': '2019-08-20',
            'ageGroup': '03',
            'ageIndicator': 'ADU',
            'isCompanion': true,
            'isSingular': true,
            'importance': 80,
            'status': {
                'lastModifiedDate': '2019-08-21'
            }
        },
        'points': {
            'ibPlusNumber': '50984517',
            'totals': {
                'balance': 5918200,
                'expiring': 0,
                'expirationDate': null,
                'expirationPolicy': 'T',
                'numberOfFlights': 0,
                'fromCredits': 6000000,
                'fromDebits': 81800,
                'totalElite': 0,
                'historicElite': 0,
                'historicNumberOfFlights': 0,
                'ibHistoricNumberOfFlights': 0
            },
            'levelUpgrade': {
                'nextCategory': '4',
                'levelKeeping': 2250,
                'levelUpgrade': 6250,
                'numberOfFlightsForKeeping': 50,
                'ibNumberOfFlightsForKeeping': 1,
                'numberOfFlightsForUpgrading': 0,
                'ibNumberOfFlightsForUpgrading': 0,
                'platino1Keeping': 0,
                'platino2Keeping': 0,
                'platino10Keeping': 0,
                'numberOfPlatino10Years': 0,
                'levelDate': '2019-04-12',
                'nextLevelDate': '2020-03-31',
                'eliteCountingBeginDate': '2019-04-01',
                'eliteCountingEndDate': '2020-03-31',
                'elite1CountingEndDate': null,
                'platinoYear': 0,
                'elitePlatinoGoal': 0
            },
            'clientAccount': {
                'balances': [
                    {
                        'year': 2019,
                        'balance': 2918200, 'expirationDate': '9999-12-31'
                    },
                    {
                        'year': 2020,
                        'balance': 3000000,
                        'expirationDate': '9999-12-31'
                    }
                ]
            }
        },
        'beneficiaries': {
            'ibPlusNumber': '50984517',
            'beneficiaries': [
                {
                    'name': 'TEST',
                    'surname1': 'TEST',
                    'surname2': '',
                    'birthDate': '2000-04-03',
                    'relationship': '4',
                    'relationshipDescription': 'Hermanos',
                    'document': {
                        'type': '05',
                        'typeDescription': 'Pasaporte',
                        'number': '1234567P'
                    },
                    'frequentFlyer': {
                        'airline': 'AA',
                        'number': '1111155500c'
                    },
                    'title': 2,
                    'beneficiaryNumber': 1,
                    'relationshipWebCode': '3'
                }
            ]
        },
        'largeFamilyInfo': {
            'category': 'F2',
        },
        'completeProfile': true,
        'residentInfo': null


    };

    var mockGdpr = {
        'text': 'El responsable del tratamiento de tus datos es Iberia L.A.E. S.A. Operadora, Sociedad Unipersonal (en adelante, “Iberia”) con domicilio social en calle Martínez Villergas 49, 28027 Madrid.'
    };

    var mockPrefixes = [
        {
            code: '34',
            description: 'España / +34'
        },
        {
            code: '93',
            description: 'Afganistán / +93'
        },
        {
            code: '599',
            description: 'Antillas Holandesas / +599'
        }
    ];

    var mockSecurityInfo = {
        'requiredFieldsOptions': [{
            field:'COMMUNITY_CODE',
            values:[{
                code: '070407',
                description: 'Islas Baleares'
            }]
        }],
        'passengersSecurityInformation': [
            {
                'id': 'ADULT_01',
                'requiredFields': [
                    'SURNAME',
                    'NAME',

                ],
                'name': null,
                'surname': null,
                'title': null,
                'gender': null,
                'birthDate': null,
                'inTransit': false,
                'destinationAddress': null,
                'homeAddress': null,
                'emergencyContact': null,
                'nationality': null,
                'cityOfBirth': null,
                'countryOfResidence': null,
                'mandatoryDocuments': [
                    {
                        'documents': [
                            {
                                'type': {
                                    'code': 'DN',
                                    'description': 'DNI'
                                },
                                'requiredFields': {
                                    'hola': 'Holaa',
                                    'adios': 'Adiooos'
                                }
                            },
                        ]
                    },
                ],
                'optionalDocuments': [
                    {
                        "type": {
                            "code": "NIT",
                            "description": "NIT"
                        },
                        "requiredFields": [
                            "NUM_DOC"
                        ],
                        "requiredFieldsOptions": null,
                        "ocr": null
                    },
                    {
                        "type": {
                            "code": "CUI",
                            "description": "CUI"
                        },
                        "requiredFields": [
                            "NUM_DOC"
                        ],
                        "requiredFieldsOptions": null,
                        "ocr": null
                    },
                    {
                        "type": {
                            "code": "PP",
                            "description": "Pasaporte"
                        },
                        "requiredFields": [
                            "NUM_DOC"
                        ],
                        "requiredFieldsOptions": null,
                        "ocr": null
                    }
                ],
                'documents': [],
                'infantPassengerSecurityInformation': null
            }
        ]
    };


    var fakeCommonsConstants = {}

    var fakeCommonsModalService = {};

    var fakeCommonsCookiesService = {};

    var fakeDatalayerConstants = {
        DATALAYER_PASSENGER_TYPES: {
            'ADULT': 'ADT',
            'CHILD': 'CHD',
            'INFANT': 'INF',
            'SENIOR': 'YCD',
            'YOUTH': 'YTH',
            'YOUNG_ADULT': 'BNN'
        },
        DATALAYER_INFO: {
            'IB_PLUS_HOLDER': 'titularIberiaPlus',
        },
        DATALAYER_VALUES: {
            'YES': 'SI',
            'NO': 'NO',
        }
    };

    var fakeMemberShipData = {
        'clid': 'OB20411363',
        'parentClpNumber': null,
        'companyInfo': {
            'companyName': 'QA test 2',
            'companyIdType': 'NIF',
            'companyId': '21212121A',
            'industrySector': '38',
            'marketSegment': null,
            'address': {
                'addressLine1': 'jaen 65',
                'addressLine2': null,
                'addressLine3': null,
                'country': 'ES',
                'state': 'J',
                'zipCode': '23700',
                'city': 'linares'
            },
            'contactInfo': {
                'email': 'niit.jmirigaray@iberia.es',
                'secondaryEmail': null,
                'internationalDiallingCode': '+34',
                'phoneNumber': '21212121'
            }
        },
        'infoDetailMember': {
            'memberStatus': 'A',
            'blackListedInformation': false,
            'corporateDealInformation': false,
            'incompleteData': false,
            'underAudit': false,
            'companyIdValidatedFlag': false,
            'additionalDocumentApproved': true,
            'additionalDocumentationNeeded': false,
            'manualValidationCompleted': true,
            'duplicateAccount': false,
            'travelAgent': false
        },
        'tierStatus': {
            'status': 'On1',
            'expirationDate': null
        },
        'memberBalance': 3822423,
        'programBaseCurrency': 'EUR',
        'termsAndConditionAcceptanceDate': '2015-04-28T10:06:56.000',
        'affiliatedSchemaOperator': 'IB',
        'enrollmentInfo': {
            'source': null,
            'channel': 'F',
            'date': '2014-03-10T00:00:00.000',
            'salesmanCode': null,
            'refferedByClpNumber': null
        },
        'estimatedTotalAnnualAirSpend': {
            'amount': 0,
            'currency': null
        },
        'numberOfTravelers': '0',
        'mainTravelDestinations': null,
        'travelPolicy': 'NP',
        'bookingBehaviour': '000',
        'amountOfTravel': '1',
        'iberiaCard': {
            'cardFlag': false,
            'cardStartDate': null,
            'cardEndDate': null
        },
        'userInfo': {
            'login': 'PLIKI2',
            'firstName': 'lucas',
            'lastName': 'urimeyer',
            'secondLastName': 'mastropiero',
            'role': {
                'code': 'I_COMP_AUT',
                'description': 'Autorizador'
            },
            'email': 'niit.jmirigaray@iberia.es',
            'phones': [
                {
                    'type': 'HOME',
                    'internationDiallingCode': '+34',
                    'number': '21212121',
                    'extentionNumber': null
                }
            ],
            'status': 'A',
            'preferredLanguage': 'SPA',
            'jobTitle': 'amo',
            'title': 'MR',
            'joinDate': '2015-03-10T00:00:00.000',
            'travelAgentSpecificData': null,
            'permissionToDiscount': true,
            'thirdPartyPrivilege': true,
            'redemptionPermission': true,
            'userSpecific': {
                'marketingPermission': {
                    'schemeOperator': true,
                    'thirdParty': false,
                    'channel': {
                        'sms': true,
                        'phone': true,
                        'email': true,
                        'postal': true
                    }
                },
                'otherLoyalty': null,
                'socialNetwork': null,
                'identificationDocumentType': null,
                'identificationDocumentId': null,
                'businessUnitId': 0
            }
        },
        'pointsTransformed': 3822423,
        'employees': [
            {
                'login': '***',
                'firstName': '***',
                'lastName': '***',
                'secondLastName': null,
                'role': {
                    'code': 'A_TRUST_AG',
                    'description': 'Agente de Viajes'
                },
                'email': '***',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+91',
                        'number': '***',
                        'extentionNumber': null
                    }
                ],
                'status': 'C',
                'preferredLanguage': 'ENG',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': {
                    'travelAgencyName': 'testAgency',
                    'agencyIataNumber': null
                },
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': null,
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': '87687302',
                'firstName': 'prueba',
                'lastName': 'TestDos',
                'secondLastName': null,
                'role': {
                    'code': 'I_PART',
                    'description': 'Empleado'
                },
                'email': 'laura.rodriguez.garcia@everis.com',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+34',
                        'number': '66666666',
                        'extentionNumber': null
                    }
                ],
                'status': 'A',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': null,
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': {
                        'schemeOperator': false,
                        'thirdParty': false,
                        'channel': {
                            'sms': false,
                            'phone': false,
                            'email': false,
                            'postal': false
                        }
                    },
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': '99528963',
                'firstName': 'prueba',
                'lastName': 'test',
                'secondLastName': null,
                'role': {
                    'code': 'A_TRUST_AG',
                    'description': 'Agente de Viajes'
                },
                'email': 'everis.lrodrigue@iberia.es',
                'phones': [
                    {
                        'type': 'MOBILE',
                        'internationDiallingCode': '+34',
                        'number': '666666666',
                        'extentionNumber': null
                    },
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+34',
                        'number': '666666666',
                        'extentionNumber': null
                    }
                ],
                'status': 'A',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': {
                    'travelAgencyName': 'El corte ingles',
                    'agencyIataNumber': null
                },
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': null,
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': '***',
                'firstName': '***',
                'lastName': '***',
                'secondLastName': null,
                'role': {
                    'code': 'I_COMP_ADM',
                    'description': 'Administrador'
                },
                'email': '***',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+213',
                        'number': '***',
                        'extentionNumber': null
                    }
                ],
                'status': 'C',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': null,
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': {
                        'schemeOperator': false,
                        'thirdParty': false,
                        'channel': null
                    },
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': '24851178',
                'firstName': 'Prueba',
                'lastName': 'Prueba',
                'secondLastName': null,
                'role': {
                    'code': 'I_PART',
                    'description': 'Empleado'
                },
                'email': 'mfperez@iberia.es',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+34',
                        'number': '321654987',
                        'extentionNumber': null
                    }
                ],
                'status': 'A',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': null,
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': {
                        'schemeOperator': false,
                        'thirdParty': false,
                        'channel': {
                            'sms': false,
                            'phone': false,
                            'email': false,
                            'postal': false
                        }
                    },
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': 'PLIKI2',
                'firstName': 'lucas',
                'lastName': 'urimeyer',
                'secondLastName': 'mastropiero',
                'role': {
                    'code': 'I_COMP_AUT',
                    'description': 'Autorizador'
                },
                'email': 'niit.jmirigaray@iberia.es',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+34',
                        'number': '21212121',
                        'extentionNumber': null
                    }
                ],
                'status': 'A',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': null,
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': {
                        'schemeOperator': true,
                        'thirdParty': false,
                        'channel': {
                            'sms': true,
                            'phone': true,
                            'email': true,
                            'postal': true
                        }
                    },
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': 'PLIKI222',
                'firstName': 'Juan',
                'lastName': 'XXIII',
                'secondLastName': null,
                'role': {
                    'code': 'I_PART',
                    'description': 'Empleado'
                },
                'email': 'jose.irigaray@niit-tech.com',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+34',
                        'number': '64646545',
                        'extentionNumber': null
                    }
                ],
                'status': 'A',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': null,
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': {
                        'schemeOperator': true,
                        'thirdParty': true,
                        'channel': {
                            'sms': false,
                            'phone': false,
                            'email': false,
                            'postal': false
                        }
                    },
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            },
            {
                'login': 'PLIKI22',
                'firstName': 'Juan',
                'lastName': 'Pablo II',
                'secondLastName': null,
                'role': {
                    'code': 'I_COMP_ADM',
                    'description': 'Administrador'
                },
                'email': 'jmirigaray@yahoo.es',
                'phones': [
                    {
                        'type': 'HOME',
                        'internationDiallingCode': '+34',
                        'number': '3213213132',
                        'extentionNumber': null
                    }
                ],
                'status': 'A',
                'preferredLanguage': 'SPA',
                'jobTitle': null,
                'title': null,
                'joinDate': null,
                'travelAgentSpecificData': null,
                'permissionToDiscount': false,
                'thirdPartyPrivilege': false,
                'redemptionPermission': false,
                'userSpecific': {
                    'marketingPermission': {
                        'schemeOperator': true,
                        'thirdParty': false,
                        'channel': {
                            'sms': true,
                            'phone': true,
                            'email': true,
                            'postal': true
                        }
                    },
                    'otherLoyalty': null,
                    'socialNetwork': null,
                    'identificationDocumentType': null,
                    'identificationDocumentId': null,
                    'businessUnitId': 0
                }
            }
        ]
    };

    var fakeBookingUrlParams = {
        'modeWeb': null,
        'searchOrigin': 'IBHMPA',
        'tripType': '1',
        'senior': null,
        'adult': 1,
        'young': null,
        'teenager': null,
        'child': null,
        'infant': null,
        'resident': true,
        'largeFamilyType': 'F2',
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
                'destination': 'OVD',
                'date': '2020-02-12'
            }
        ],
        'bookingCode1': null,
        'backToUrl': null,
        'codeTracking': null,
        'travelAgent': null
    };

    var mockSelectedSlice = [
        {
            'selectedSliceIndex': 0,
            'selectedSlicesLength': 0,
            'cabin': 'E',
            'originDestinationId': 'ODI_0',
            'origin': 'MAD',
            'destination': 'OVD',
            'info': {
                'sliceId': '4',
                'arrivalDateTime': '2020-02-12 08:45',
                'departureDateTime': '2020-02-12 07:35',
                'segments': [
                    {
                        'segmentId': 'IB047820200212',
                        'departureDateTime': '2020-02-12 07:35',
                        'arrivalDateTime': '2020-02-12 08:45',
                        'departure': {
                            'code': 'MAD',
                            'name': 'Madrid',
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
                            'code': 'OVD',
                            'name': 'Asturias',
                            'terminal': '',
                            'city': {
                                'code': 'OVD',
                                'description': 'Asturias-Oviedo',
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
                            'marketingFlightNumber': '0478',
                            'operationalFlightNumber': '0478',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '32A',
                                'description': 'Airbus A320'
                            }
                        },
                        'overnight': false,
                        'waitingTime': 0,
                        'duration': 70,
                        'delayInformation': null,
                        'stop': null,
                        'durationParsed': '1h 10min.',
                        'waitingTimeParsed': '',
                        'departureDateTimeParsed': '07:35',
                        'departureDateParsed': {
                            'dateTime': '07:35',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'hour': 1,
                            'minutes': 0,
                            'day': 12,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'formatedDate': '2020-02-12 07:35'
                        },
                        'arrivalDateTimeParsed': '08:45',
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
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
                        }
                    }
                ],
                'duration': 70,
                'cashAvios': true,
                'overnight': false,
                'stopsNumber': 0,
                'bestPrice': false,
                'cabins': {
                    'E': {
                        'bestPrice': 66.46,
                        'bestPriceDiscount': null,
                        'bestPriceDiscountShown': null,
                        'bestPriceShown': '66€',
                        'cabinDescription': 'Turista',
                        'cabinAvailable': true,
                        'isCabinCompatible': true,
                        'fareFamilies': [
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'TBAESES',
                                'commercialName': 'Básica',
                                'commercialNameES': 'Básica',
                                'priority': 900,
                                'conditions': [
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
                                            'observationCode': '2'
                                        },
                                        'key': 0,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': 'No incluido.',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Sin equipaje en bodega',
                                            'message': 'No incluido. ',
                                            'code': 'CA_1_PIEZAS_PAGO',
                                            'conditionStatus': false,
                                            'observationCode': '1'
                                        },
                                        'key': 1,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'text': 'De pago.',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Seleccionable con coste',
                                            'message': 'De pago. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                            'code': 'CA_Asiento_Pago',
                                            'conditionStatus': false,
                                            'observationCode': '3'
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                        'units': 65,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                            'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'No permitido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Reembolso no permitido',
                                            'message': 'No permitido.',
                                            'code': 'CA_REEMBOLSO NO PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 5,
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
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'De pago',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Seleccionable con coste',
                                            'message': 'De pago',
                                            'code': 'CA_Asiento_XL_Pago',
                                            'conditionStatus': false,
                                            'observationCode': '3'
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
                                        'key': 13,
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
                                        'key': 14,
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
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'No',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'No',
                                            'code': 'CA_Embarque_NO_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
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
                                        'key': 17,
                                        'previewStatus': false
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
                                    },
                                    {
                                        'observationCode': 3,
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
                                'isCompatibleFare': true,
                                'farePrice': 132.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 66.46,
                                'farePriceShown': '66€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_01',
                                                'price': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_02',
                                                'price': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 90,
                                                    'tax': 42.92,
                                                    'total': 132.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'TBAESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'Q',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'QZNOB5',
                                                                'extendedFareCode': 'QZNOB5',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_2',
                                        'privateFare': true,
                                        'offerType': '',
                                        'price': {
                                            'fare': 90,
                                            'tax': 42.92,
                                            'total': 132.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            },
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'TCLESES',
                                'commercialName': 'Óptima',
                                'commercialNameES': 'Óptima',
                                'priority': 700,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'text': 'Gratuita desde 24 horas antes del vuelo. ',
                                        'units': 24,
                                        'extendedInfo': {
                                            'title': 'Gratuita desde 24 horas antes del vuelo. ',
                                            'message': 'Gratuita desde 24 horas antes del vuelo. ',
                                            'code': 'CA_Asiento_Gratis_24_horas',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                        'units': 45,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste 45€. No Show no permite cambio',
                                            'message': 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                            'code': 'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'No permitido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Reembolso no permitido',
                                            'message': 'No permitido.',
                                            'code': 'CA_REEMBOLSO NO PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 5,
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
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'De pago',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Seleccionable con coste',
                                            'message': 'De pago',
                                            'code': 'CA_Asiento_XL_Pago',
                                            'conditionStatus': false,
                                            'observationCode': '3'
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
                                        'key': 13,
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
                                        'key': 14,
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
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'No',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'No',
                                            'code': 'CA_Embarque_NO_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
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
                                        'key': 17,
                                        'previewStatus': false
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
                                    },
                                    {
                                        'observationCode': 3,
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
                                'isCompatibleFare': true,
                                'farePrice': 164.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 82.46,
                                'farePriceShown': '82€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IB1f08ef39262d484d883dff100f7a60d9OP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IB1f08ef39262d484d883dff100f7a60d9OP_01',
                                                'price': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IB1f08ef39262d484d883dff100f7a60d9OP_02',
                                                'price': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 122,
                                                    'tax': 42.92,
                                                    'total': 164.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'TCLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'Q',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'QZNOM5',
                                                                'extendedFareCode': 'QZNOM5',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_3',
                                        'privateFare': true,
                                        'offerType': '',
                                        'price': {
                                            'fare': 122,
                                            'tax': 42.92,
                                            'total': 164.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            },
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'TFLESEU',
                                'commercialName': 'Flexible',
                                'commercialNameES': 'Flexible',
                                'priority': 500,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
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
                                            'code': 'CA_Asiento_Gratuito',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido',
                                            'message': 'Permitidos en cualquier momento',
                                            'code': 'CA_CAMBIO SIEMPRE',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitido en cualquier momento',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido',
                                            'message': 'Reembolso permitido en cualquier momento.',
                                            'code': 'CA_REEMBOLSO SIEMPRE',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 5,
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
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'Incluido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Con selección de asiento',
                                            'message': 'Incluido',
                                            'code': 'CA_Asiento_XL_Incluido',
                                            'conditionStatus': true,
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
                                        'key': 13,
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
                                        'key': 14,
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
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'No',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'No',
                                            'code': 'CA_Embarque_NO_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
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
                                        'key': 17,
                                        'previewStatus': false
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
                                'isCompatibleFare': true,
                                'farePrice': 493.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 291.46,
                                'farePriceShown': '291€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IB0ed805526d654b88a321dc012bf1f849OP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IB0ed805526d654b88a321dc012bf1f849OP_01',
                                                'price': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IB0ed805526d654b88a321dc012bf1f849OP_02',
                                                'price': {
                                                    'fare': 181,
                                                    'tax': 21.46,
                                                    'total': 202.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 451,
                                                    'tax': 42.92,
                                                    'total': 493.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 225.5,
                                                    'tax': 21.46,
                                                    'total': 246.96,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '1',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048020200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
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
                                                                'segmentId': 'IB047620200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
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
                                                                'segmentId': 'IB048820200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_11',
                                        'privateFare': true,
                                        'offerType': '',
                                        'price': {
                                            'fare': 451,
                                            'tax': 42.92,
                                            'total': 493.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            }
                        ],
                        'bestCabinsPrice': false
                    },
                    'B': {
                        'bestPrice': 221.46,
                        'bestPriceDiscount': null,
                        'bestPriceDiscountShown': null,
                        'bestPriceShown': '221€',
                        'cabinDescription': 'Business Class',
                        'cabinAvailable': true,
                        'isCabinCompatible': true,
                        'fareFamilies': [
                            {
                                'cabinType': 'B',
                                'cabinDescription': 'Business Class',
                                'commercialCode': 'BREESES',
                                'commercialName': 'Business Promocional',
                                'commercialNameES': 'Business Promocional',
                                'priority': 200,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
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
                                            'code': 'CA_Asiento_Gratuito',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                        'units': 60,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                            'code': 'CA_CAMBIO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                                        'units': 90,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido con coste 90€. No Show no permitido',
                                            'message': 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                                            'code': 'CA_REEMBOLSO CON PENALTY_90EUR_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 5,
                                        'previewStatus': true
                                    },
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
                                        },
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'Incluido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Con selección de asiento',
                                            'message': 'Incluido',
                                            'code': 'CA_Asiento_XL_Incluido',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 10,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Chek-in_desk_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 13,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Acceso a salas VIP permitido',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 14,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Fast Track SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'Sí, grupo 1',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'CA_Embarque_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Entrega_prioritaria_equipaje_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 17,
                                        'previewStatus': false
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
                                'isCompatibleFare': true,
                                'farePrice': 376.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 221.46,
                                'farePriceShown': '221€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IB3bc97882a17146a18491fdc95cfc754fOP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IB3bc97882a17146a18491fdc95cfc754fOP_01',
                                                'price': {
                                                    'fare': 200,
                                                    'tax': 21.46,
                                                    'total': 221.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IB3bc97882a17146a18491fdc95cfc754fOP_02',
                                                'price': {
                                                    'fare': 134,
                                                    'tax': 21.46,
                                                    'total': 155.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 334,
                                                    'tax': 42.92,
                                                    'total': 376.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 200,
                                                    'tax': 21.46,
                                                    'total': 221.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 167,
                                                    'tax': 21.46,
                                                    'total': 188.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '0',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048220200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
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
                                                                'segmentId': 'IB047620200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '3',
                                                        'remainingSeats': 8,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048820200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 8,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_8',
                                        'privateFare': false,
                                        'offerType': '',
                                        'price': {
                                            'fare': 334,
                                            'tax': 42.92,
                                            'total': 376.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            },
                            {
                                'cabinType': 'B',
                                'cabinDescription': 'Business Class',
                                'commercialCode': 'BFLESES',
                                'commercialName': 'Business Flexible',
                                'commercialNameES': 'Business Flexible',
                                'priority': 200,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
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
                                            'code': 'CA_Asiento_Gratuito',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                        'units': 50,
                                        'extendedInfo': {
                                            'title': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                            'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                                            'code': 'CA_CAMBIOS PERMITIDOS_NO_SHOW_50€',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                        'units': 75,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido',
                                            'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                            'code': 'CA_REEMBOLSO SIEMPRE_NO_SHOW_75€',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 5,
                                        'previewStatus': true
                                    },
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
                                        },
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'Incluido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Con selección de asiento',
                                            'message': 'Incluido',
                                            'code': 'CA_Asiento_XL_Incluido',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 10,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Chek-in_desk_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 13,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Acceso a salas VIP permitido',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 14,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Fast Track SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'Sí, grupo 1',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'CA_Embarque_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Entrega_prioritaria_equipaje_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 17,
                                        'previewStatus': false
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
                                'isCompatibleFare': true,
                                'farePrice': 493.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 291.46,
                                'farePriceShown': '291€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IBca7a5c110ca2454588a42704279b1353OP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IBca7a5c110ca2454588a42704279b1353OP_01',
                                                'price': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IBca7a5c110ca2454588a42704279b1353OP_02',
                                                'price': {
                                                    'fare': 181,
                                                    'tax': 21.46,
                                                    'total': 202.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 451,
                                                    'tax': 42.92,
                                                    'total': 493.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 225.5,
                                                    'tax': 21.46,
                                                    'total': 246.96,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '0',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048220200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '1',
                                                        'remainingSeats': 2,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048020200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 2,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
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
                                                                'segmentId': 'IB047620200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
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
                                                                'segmentId': 'IB048820200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_10',
                                        'privateFare': false,
                                        'offerType': '',
                                        'price': {
                                            'fare': 451,
                                            'tax': 42.92,
                                            'total': 493.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            }
                        ],
                        'bestCabinsPrice': false
                    }
                },
                'cabinsLength': 2,
                'showFares': true,
                'slicePrice': 66.46,
                'sliceCurrency': 'EUR',
                'durationParsed': '1h 10min.',
                'departureDateTimeParsed': '07:35',
                'departureDateParsed': {
                    'dateTime': '07:35',
                    'weekDay': 'WEEKDAY_WEDNESDAY',
                    'hour': 1,
                    'minutes': 0,
                    'day': 12,
                    'monthNumber': 2,
                    'month': 'MONTH_FEBRUARY',
                    'year': 2020,
                    'formatedDate': '2020-02-12 07:35'
                },
                'arrivalDateTimeParsed': '08:45',
                'daysOfTravel': 0,
                'allOperatedBy': [
                    'Iberia'
                ],
                'technicalStop': 0,
                'sliceURL': '/aerolineas/logo_pos_IB.svg',
                'maxSlicePrice': 221.46,
                'showedCabin': 'E',
                'selectedCabin': 'E',
                'selectedFareFamily': {
                    'cabinType': 'E',
                    'cabinDescription': 'Turista',
                    'commercialCode': 'TBAESES',
                    'commercialName': 'Básica',
                    'commercialNameES': 'Básica',
                    'priority': 900,
                    'conditions': [
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
                                'observationCode': '2'
                            },
                            'key': 0,
                            'previewStatus': true
                        },
                        {
                            'code': 'EQBODEGA',
                            'name': 'Equipaje en bodega',
                            'text': 'No incluido.',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Sin equipaje en bodega',
                                'message': 'No incluido. ',
                                'code': 'CA_1_PIEZAS_PAGO',
                                'conditionStatus': false,
                                'observationCode': '1'
                            },
                            'key': 1,
                            'previewStatus': true
                        },
                        {
                            'code': 'ASIENTO',
                            'name': 'Selección de asiento',
                            'text': 'De pago.',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Seleccionable con coste',
                                'message': 'De pago. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                'code': 'CA_Asiento_Pago',
                                'conditionStatus': false,
                                'observationCode': '3'
                            },
                            'key': 3,
                            'previewStatus': true
                        },
                        {
                            'code': 'CAMBIO',
                            'name': 'Cambios',
                            'text': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'units': 65,
                            'extendedInfo': {
                                'title': 'Cambio permitido con coste',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                'conditionStatus': false,
                                'observationCode': null
                            },
                            'key': 4,
                            'previewStatus': true
                        },
                        {
                            'code': 'REEMBOLSO',
                            'name': 'Reembolso (por sentido)',
                            'text': 'No permitido',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Reembolso no permitido',
                                'message': 'No permitido.',
                                'code': 'CA_REEMBOLSO NO PERMITIDO',
                                'conditionStatus': false,
                                'observationCode': null
                            },
                            'key': 5,
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
                            'key': 6,
                            'previewStatus': false
                        },
                        {
                            'code': 'ASIENTOXL',
                            'name': 'Selección de asiento XL(emergencia)',
                            'text': 'De pago',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Seleccionable con coste',
                                'message': 'De pago',
                                'code': 'CA_Asiento_XL_Pago',
                                'conditionStatus': false,
                                'observationCode': '3'
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
                            'key': 13,
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
                            'key': 14,
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
                            'key': 15,
                            'previewStatus': false
                        },
                        {
                            'code': 'EMBARQUE',
                            'name': 'Embarque  prioritario',
                            'text': 'No',
                            'units': null,
                            'extendedInfo': {
                                'title': '',
                                'message': 'No',
                                'code': 'CA_Embarque_NO_Prioritario',
                                'conditionStatus': false,
                                'observationCode': null
                            },
                            'key': 16,
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
                            'key': 17,
                            'previewStatus': false
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
                        },
                        {
                            'observationCode': 3,
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
                    'isCompatibleFare': true,
                    'farePrice': 132.92,
                    'fareDiscountPriceToCalculate': null,
                    'farePriceToCalculate': 66.46,
                    'farePriceShown': '66€',
                    'fareDiscountPriceShown': null,
                    'fareCurrency': 'EUR',
                    'remainingSeats': 9,
                    'offers': [
                        {
                            'offerId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP',
                            'offerItems': [
                                {
                                    'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_01',
                                    'price': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'passengerIds': [
                                        'ADULT_01'
                                    ],
                                    'privateFareInformation': null
                                },
                                {
                                    'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_02',
                                    'price': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'passengerIds': [
                                        'CHILD_01'
                                    ],
                                    'privateFareInformation': null
                                }
                            ],
                            'originDestinations': [
                                {
                                    'priceDiscountApplied': false,
                                    'totalPrice': {
                                        'fare': 90,
                                        'tax': 42.92,
                                        'total': 132.92,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'adultPrice': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'perPassengerPrice': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'originDestinationId': 'ODI_0',
                                    'applicableSlices': [
                                        {
                                            'sliceId': '4',
                                            'remainingSeats': 9,
                                            'segments': [
                                                {
                                                    'segmentId': 'IB047820200212',
                                                    'fareFamily': 'TBAESES',
                                                    'bookingCode': null,
                                                    'bookingClass': 'ECONOMY',
                                                    'rbd': 'Q',
                                                    'remainingSeats': 9,
                                                    'fareBasis': 'QZNOB5',
                                                    'extendedFareCode': 'QZNOB5',
                                                    'seatDisplays': null,
                                                    'cabinDescription': ''
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            'timeLimits': '2020-02-04T12:54:25.619',
                            'specialDiscountsApplied': [

                            ],
                            'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_2',
                            'privateFare': true,
                            'offerType': '',
                            'price': {
                                'fare': 90,
                                'tax': 42.92,
                                'total': 132.92,
                                'currency': 'EUR',
                                'ticketingFee': 0
                            }
                        }
                    ],
                    'oBdiscount': false
                }
            },
            'articleOffset': 204,
            'transformOffset': 0,
            'heightHeadingFlight': 0,
            'available': true,
            'originCountry': 'ES',
            'destinationCountry': 'ES'
        }
    ];

    var mockConfirmationDatalayerInfo = {
        'SearchCity': 'OVD',
        'SearchOrigin': 'MAD',
        'SearchDest': 'OVD',
        'SearchCountry': 'ES',
        'antelacionCompra': '7',
        'fecha': '12/02/2020-',
        'trayectoBuscado': 'MAD,OVD',
        'trayectoPais': 'ES-ES',
        'familianumerosa': 'NO',
        'residentCode': 'NO',
        'origenBusqueda': 'es/ES/IBHMPA',
        'numeroPax': '2',
        'estanciaDestino': '0',
        'tipoVuelo': 'OW',
        'resultadosIda': '5',
        'numeroAdultos': '1',
        'numeroNinios': '1',
        'precioPax': '66.46 : 66.46',
        'tarifaBarata': 'NO',
        'cabinas': 'IDA:ECONOMY',
        'escalas': 'IDA:0',
        'horarioVuelo': 'IDA:07:35',
        'trayectoAeropuerto': 'MAD-OVD',
        'operadoraVuelo': 'IB',
        'Identifier': 'IB0478',
        'nombreTarifas': 'IDA:TBAESES',
        'titularIberiaPlus': 'NO',
        'claseReserva': 'E',
        'moneda': 'EUR',
        'precioTotal': 132.92,
        'precioTotalSinTasas': 90
    };

    var mockPassengerFormData = {
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
                    'SURNAME': {
                    },
                    'NAME': {
                    },
                    'GENDER': 'MALE'
                },
                'serviceErrors': [
                ],
                'optionalDocs': {
                },
                'specialNeeds': {
                    'isEnable': true,
                    'specialVisionValue': true,
                    'specialHearingValue': true,
                    'specialWheelchairValue': 'WCHR',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión',
                            '$$hashKey': 'object:3103'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.',
                            '$$hashKey': 'object:3104'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.',
                            '$$hashKey': 'object:3105'
                        }
                    ],
                    'specialVision': true,
                    'specialHearing': true,
                    'specialWheelchair': true,
                    'specialIntellDisability': true,
                    'specialGuideDog': true,
                },
                'isSelected': false,
                'canBeInCharge': true,
                'mandatoryDocs': [
                ],
                'data': {
                    'name': 'FRANCISCO JAVIER',
                    'surname': 'CARTAN',
                    'lastSurname': '',
                    'freqFlyerSelected': true,
                    'freqFlyerInfo': {
                        'company': 'IBE',
                        'number': 1238987
                    },
                    'mandatoryDoc': {
                        'code': 5,
                        'number': 3
                    },
                    'optionalDoc' : {
                        'code': 'NIT',
                        'description':'NIT' ,
                        'number': 4343433,
                        'showFields': {'NUM_DOC' : {}}
                    },
                    'redressnumber': 48,
                    'residentDiscountInfo': true,
                    'largeFamilyDiscountInfo': {
                        'communityCode': {
                            'code': 'test'
                        }
                    },
                    'birthDate': [
                        '02', '03', 1993
                    ],
                    'gender': 'MALE',
                    'OBNumberSelected': true,
                    'OBNumberInfo': {
                        'businessCodeType': {
                            'code': '01'
                        },
                        'number': '012357'
                    }
                },
                'previousSelected': {
                    'name': 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK',
                    'type': 'DEFAULT'
                }
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
                'id': 'CHILD_01',
                'type': 'INFANT',
                'name': {
                    'name': 'GENERAL_LABEL_PASSENGER',
                    'pasNumber': 2,
                    'needsTranslate': true
                },
                'requiredFields': {
                    'SURNAME': {

                    },
                    'BIRTH_DATE': {

                    },
                    'NAME': {

                    }
                },
                'serviceErrors': [

                ],
                'optionalDocs': {
                    "NIT": {
                        "code": "NIT",
                        "description": "NIT",
                        "showFields": {
                            "NUM_DOC": {}
                        }
                    },
                    "CUI": {
                        "code": "CUI",
                        "description": "CUI",
                        "showFields": {
                            "NUM_DOC": {}
                        }
                    },
                    "PP": {
                        "code": "PP",
                        "description": "Pasaporte",
                        "showFields": {
                            "NUM_DOC": {}
                        }
                    }
                },
                'specialNeeds': {
                    'specialVision': true,
                    'specialHearing': true,
                    'specialWheelchair': true,
                    'specialIntellDisability': true,
                    'specialGuideDog': true,
                    'specialWheelchairValue': 'WCHR',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión',
                            '$$hashKey': 'object:3239'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.',
                            '$$hashKey': 'object:3240'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.',
                            '$$hashKey': 'object:3241'
                        }
                    ],
                },
                'isSelected': false,
                'canBeInCharge': false,
                'mandatoryDocs': [

                ],
                'data': {
                    'name': 'MARIA',
                    'surname': 'CARTAN',
                    'birthDate': {
                        '0': '02',
                        '1': '03',
                        '2': 2014
                    }
                },
                'passengerIndex': 1
            }
        ],
        'isLogged': false,
        'isResident': true,
        'iTravel': false,
        'passengerInfoLogged': {
        },
        'contactData': {
            'isValidForm': false,
            'contactPrefix': {
                'code': '34',
                'description': 'España / +34'
            },
            'isNewsLetters': false,
            'contactEmail': 'test@test.com',
            'repeatedEmail': 'test@test.com',
            'contactPhone': '00000000000'
        },
        'frequentlyPassengers': {
        },
        'largeFamilyDiscountInfo': {
            'largeFamilyCertificateNumber': '123456789',
            'communityCode': 'AND'
        },
        'totalPrice': '45,46€',
        'aviosInfo': {
            'redemptionAvios': 125,
            'cashDiscountWithAvios': '45,46€'
        },
        'onHold': {
            'holdTimes': '72',
            'maxFreeTime': 0,
            'moreTimePrice': 5,
            'minPrice': '5,00€'
        },
        'summaryInfo': {
            'trips': [
                {
                    'idTrip': 'MADOVD20200212073500',
                    'stopsNumber': 0,
                    'fare': {
                        'fareDetails': {
                            'EQBODEGA': {
                                'name': 'Equipaje en bodega',
                                'message': 'Sin equipaje en bodega'
                            },
                            'REEMBOLSO': {
                                'name': 'Reembolso (por sentido)',
                                'message': 'Reembolso no permitido'
                            },
                            'SALAVIP': {
                                'name': 'Acceso a salas VIP',
                                'message': 'No'
                            },
                            'FASTTRACK': {
                                'name': 'Fast Track',
                                'message': 'No'
                            },
                            'CAMBIO': {
                                'name': 'Cambios',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio'
                            },
                            'CHECKINDESK': {
                                'name': 'Mostrador check-in exclusivo',
                                'message': 'No'
                            },
                            'EQPPRIOR': {
                                'name': 'Entrega prioritaria equipaje',
                                'message': 'No'
                            },
                            'EMBARQUE': {
                                'name': 'Embarque prioritario',
                                'message': 'No'
                            },
                            'CABINA': {
                                'name': 'Cabina',
                                'message': 'Turista'
                            },
                            'EQMANO': {
                                'name': 'Equipaje de mano',
                                'message': '1 bulto en cabina'
                            },
                            'ASIENTO': {
                                'name': 'Selección de asiento',
                                'message': 'Seleccionable con coste'
                            },
                            'ASIENTOXL': {
                                'name': 'Selección de asiento XL(emergencia)',
                                'message': 'Seleccionable con coste'
                            }
                        },
                        'name': 'Básica',
                        'cabin': 'Turista'
                    },
                    'segments': [
                        {
                            'idSegment': 'IB047820200212',
                            'departure': {
                                'code': 'MAD',
                                'name': 'Madrid',
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
                                'dateTime': '07:35',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 2,
                                'month': 'MONTH_FEBRUARY',
                                'year': 2020,
                                'formatedDate': '2020-02-12 07:35'
                            },
                            'arrival': {
                                'code': 'OVD',
                                'name': 'Asturias',
                                'terminal': '',
                                'city': {
                                    'code': 'OVD',
                                    'description': 'Asturias-Oviedo',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'arrivalDate': {
                                'dateTime': '08:45',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 2,
                                'month': 'MONTH_FEBRUARY',
                                'year': 2020,
                                'formatedDate': '2020-02-12 08:45'
                            },
                            'flightNumber': '0478',
                            'operatedBy': 'Iberia',
                            'aircraftType': 'Airbus A320',
                            'duration': '1h 10min.',
                            'waitingTime': 0,
                            'waitingParsedTime': '',
                            'cabin': 'Turista',
                            'operationalDisclosure': 'IB',
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            '$$hashKey': 'object:3064'
                        }
                    ],
                    '$$hashKey': 'object:2562'
                }
            ],
            'passengers': {
                'generalData': {
                    'ADULT': [
                        {
                            'number': 1,
                            'totalTax': 21.46,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD',
                                    'amount': '16,94€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida'
                                },
                                {
                                    'code': 'OG',
                                    'amount': '0,67€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad'
                                },
                                {
                                    'code': 'QV',
                                    'amount': '3,85€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad'
                                }
                            ],
                            'fare': 24,
                            'parsedFare': '24€',
                            'parsedTotalTax': '21,46€',
                            '$$hashKey': 'object:2567'
                        }
                    ]
                }
            },
            'otherFees': [
            ]
        },
        'relatedContent': {
            'SPECIAL_NEED_CONTACT_INFO': {
            },
            'TOTAL_PRICE': {
            },
            'OBSERVATIONS': {
            },
            'FARE_CONDITIONS': {
            }
        },
        'gdprInfo': {
            'text': {
            },
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
                                },
                                {
                                    'title': '¿Qué entendemos por datos personales?',
                                    'description': 'Se entiende por datos personales aquellos datos que te identifican o podrían emplearse para ello, como por ejemplo tu nombre, datos de contacto y tu historial de viajes y compras. También pueden incluir información sobre cómo utilizas nuestro sitio web y las aplicaciones para el móvil.'
                                },
                                {
                                    'title': '¿Cuándo es aplicable esta política?',
                                    'description': 'Esta Política es aplicable a los datos personales que recabamos, usamos y tratamos en el marco de tu relación con nosotros como cliente, potencial cliente o miembro de nuestro Programas de Fidelización IBERIA PLUS u ON BUSINESS, incluyendo cuando viajas con nosotros o utilizas otros de nuestros servicios (como por ejemplo, nuestra web de subastas o nuestro servicio de tarjetas regalo), cuando navegas en nuestra web, cuando contactas con nuestros agentes de servicio o centros de atención telefónica y cuando reservas nuestros servicios a través de terceros (como agencias de viajes y otras compañías aéreas).Cuando hacemos referencia a que otros son responsables del tratamiento en el apartado Responsable del Tratamiento de Datos Personales o ¿Con quién compartimos tus datos personales?, deberás consultar sus políticas de privacidad para obtener más información.Si decides contratar servicios adicionales con nosotros, como hacer una compra a bordo, usar nuestro sistema de entretenimiento a bordo o participar en un concurso celebrado por Iberia con terceros colaboradores, podrían resultar aplicables, además de lo previsto en la presente política, otros términos y condiciones adicionales.'
                                },
                                {
                                    'title': '¿Cómo puedes proteger tus datos personales?',
                                    'description': 'Nos tomamos muchas molestias para proteger los datos personales que nos proporcionas. A continuación te indicamos algunas de las medidas que puedes tomar para mantener tus datos a salvo.No compartas tu código de reserva o localizadorCuando realizas una reserva, se te proporciona un código de reserva (también conocido como PNR o Registro de Pasajero). Esta referencia aparecerá en el correo electrónico de confirmación o en el billete de cada uno de los pasajeros de tu reserva.Mantén siempre la confidencialidad del código de reserva. Si compartes tu código de reserva con terceros, estos podrán acceder a los datos de tu reserva a través de nuestro sistema.Si viajas con otras personas y no quieres que tengan acceso a los datos de tu reserva, es posible que sea preferible que cada persona haga su reserva por separado.No compartas los datos de inicio de sesión para el acceso al área privada del Programa Iberia Plus, Iberia Joven u On BusinessPara garantizar la seguridad de tu acceso al área privada de nuestro sitio web y aplicaciones para móvil, no compartas con nadie las claves de acceso a tu área personal de Iberia Plus, Iberia Joven u On Business (programa específico para empresas que co-esponsorizamos con British Airways Plc). Cuando termines de utilizar el sitio web, los servicios online o las aplicaciones para móvil, debes cerrar la sesión si alguien más puede tener acceso a tu ordenador o dispositivo. Esto es especialmente relevante si utilizas un ordenador o dispositivo de acceso público.Actúa con precaución y protégete frente a fraudes en Internet y “Phishing”Existe una práctica de fraude a través de internet conocida como “Phishing”, que consiste en la obtención ilegal de datos personales mediante engaño. Se envían correos electrónicos no solicitados a personas incluidas en listados obtenidos ilegalmente por terceras partes, y se pide a sus destinatarios que introduzcan o confirmen datos bancarios o contraseñas en una web clonada o falsa.'
                                },
                                {
                                    'title': '¿Cuándo recabamos tus datos personales?',
                                    'description': 'Recabamos datos personales sobre tu persona cada vez que utilizas nuestros servicios (ya sean suministrados por nosotros o por otras compañías o agentes que actúen en nuestro nombre), incluyendo cuando viajas con nosotros, cuando utilizas nuestro sitio web o cuando interactúas con nosotros por medios electrónicos o a través de nuestros centros de atención al cliente.Algunos ejemplos de cuándo y cómo recogemos la información son:Cuando reservas o buscas un vuelo u otros productos o Servicios en nuestra web o en nuestra aplicación móvilCuando reservas un vuelo o cualquier otro producto a través de otros canales de venta como, por ejemplo, una agencia de viajes.Cuando te das de alta en nuestros programas de fidelización Iberia Plus, Iberia Joven u On Business, o en nuestro servicio de subastas, o cuando decides adquirir una de nuestras tarjetas regalo.Cuando te pones en contacto con nuestros contact centers y demás agentes de servicio.Cuando completas una encuesta de satisfacción y nos facilitas tus quejas, halagos, recomendaciones y sugerencias.Cuando participas en nuestros concursos o te registras en alguna de nuestras promociones, así como cuando decides relacionarte con nosotros a través de tu perfil en redes sociales como, por ejemplo, Facebook o Twitter.Cuando viajas con nosotros y cuando usas las salas VIP en los Aeropuertos en los que operamos.Cuando utilizas nuestros Sistemas de entretenimiento a bordo o nuestros servicios de comunicaciones.Cuando haces clic en alguno de nuestros emails o navegas a través de nuestro website. También puede que recibamos información sobre cómo nos has encontrado en Internet o sobre los sitios que hayas visitado previamente.Para obtener más información, consulta el apartado “¿Qué tipos de datos personales recabamos y conservamos?” a continuación.Además, podemos recibir datos personales sobre tu persona de terceros, tales como:Empresas que hayamos contratado para prestarte un servicio.Empresas implicadas en tus planes de viaje, incluyendo compañías aéreas involucradas en tu viaje anterior o posterior, operadores aeroportuarios y autoridades de aduanas e inmigración.Empresas que participen en nuestros programas de fidelización y demás programas de clientes (por ejemplo empresas de vehículos de alquiler y hoteles).Empresas que nos proporcionan datos bajo políticas de privacidad que prevén información a compartir con Iberia.'
                                },
                                {
                                    'title': '¿Qué tipos de datos personales recabamos y conservamos?',
                                    'description': 'Cuando utilices nuestros servicios tendrás que proporcionarnos tus datos personales o los de la persona o personas que vayan a viajar.Recabamos las siguientes categorías de datos personales: Datos que proporciones a Iberia para completar y gestionar una reserva que hayas hecho con nosotros o un servicio que nos hayas solicitado. Ejemplos: Nombre, dirección, correo electrónico, fecha de nacimiento, género, número de pasaporte o documento de identidad, datos e información de pago.Si compras billetes para un tercero, podremos recabar sus datos de facturación para contactar directamente con el pasajero en lo que se refiere al vuelo.Sabremos si ha reservado su vuelo en iberia.com o si ha utilizado otro canal de venta, como una agencia de viajes o nuestro centro de atención al cliente.Datos recabados durante tu viaje con nosotros. Ejemplos: Puede que recabemos cierta información como por ejemplo tu interacción con el personal y la tripulación de cabina antes y durante el vuelo. Podremos obtener geolocalización de tus dispositivos móviles, si nos lo has permitido. Obtendremos información sobre tu uso de nuestros servicios durante el viaje como, por ejemplo, el uso de nuestros sistemas de entretenimiento a bordo o de nuestras salas VIP.Datos sobre tu programa de viaje. Ejemplos: Datos relativos a tu reserva, itinerario de viaje, datos sobre cualquier asistencia adicional que solicites y demás información relacionada con tu viaje, como por ejemplo preferencias de comida o necesidades dietéticas especiales. Datos sobre los servicios que te hayamos prestado en el pasado. Ejemplos: Datos sobre viajes anteriores, como por ejemplo los viajes realizados y todas las cuestiones relacionadas con los mismos, incluyendo accesos a clase superior (“upgrades”), necesidades en cuanto a equipaje, problemas en aeropuertos, incidencias de equipaje y tus comentarios como cliente. Datos sobre tu registro online y otras interacciones. Ejemplos: Conservaremos tus datos para garantizar una correcta interacción contigo, sea porque te has registrado con nosotros a través de nuestro programas de fidelización Iberia Plus u On Business, por ejemplo, sea porque te has identificado como miembro de otro programa de fidelización. Conservaremos tus datos en el caso de que hayas participado en algún concurso o acción promocional, o hayas interactuado con nosotros a través de redes sociales como Facebook o Twitter.Datos sobre el uso que hagas de nuestros sitio web, aplicaciones para móvil y centros de atención al cliente. Ejemplos: Para ayudarnos a personalizar tus datos y mejorar nuestro sitio web, usamos cookies y tecnologías similares para recabar información sobre tus búsquedas y los contenidos que has visitado en nuestra web, como por ejemplo la web de la que procedes, o banners y enlaces que aparecen en los sitios web de nuestros socios comerciales. Utilizaremos los datos sobre uso de la web almacenados en la cookie para comprenderte como cliente. Esta información podría incluir, si la has introducido en nuestra web, datos sobre cualquier reserva o nombre de un pasajero, en caso de uso de sus datos de registro asociados a su cuenta de Iberia Plus. A partir de tus datos de uso podremos saber que has visitado iberia.com y buscado un vuelo, pero que no has formalizado su reserva. Podríamos usar esta información para contactar contigo y ofrecerte más información sobre la reserva o destino por la que te has interesado. '
                                },
                                {
                                    'title': '¿Cuándo y por qué recabamos “datos personales sensibles”?',
                                    'description': 'Ciertas categorías de datos personales, como los relativos al origen racial, etnia, religión, salud, orientación sexual o datos biométricos, constituyen categorías especiales de datos personales que requieren una protección adicional de acuerdo con la normativa de protección de datos de la Unión Europea y son referidos como “datos personales sensibles”. En Iberia tratamos de limitar las circunstancias en las que recabamos y tratamos datos de esta naturaleza. Los siguientes son ejemplos de supuestos en los que podríamos recabar y tratar datos personales sensibles:Cuando hayas solicitado a Iberia y/o a un operador aeroportuario asistencia médica específica, como por ejemplo una silla de ruedas u oxígeno.Cuando hayas solicitado autorización para volar con nosotros con una determinada afección médica o en estado de gestación de más de 28 semanas.Cuando hayas optado por proporcionarnos dicha información por cualquier otro motivo o nos haya sido proporcionada por un tercero como, por ejemplo, la agencia de viajes a través de la cual realizaste tu reserva.Asimismo, es posible que hayas solicitado un servicio especial (como un menú) que no constituya en sí mismo un dato sensible pero que pueda implicar o sugerir información sobre tu religión, tu salud u otros datos.'
                                },
                                {
                                    'title': '¿Para qué utilizamos tus datos personales y bajo qué fundamentos?',
                                    'description': 'Las principales finalidades para las que tratamos tus datos personales son las expuestas a continuación:Basándonos en nuestra relación contractual contigo, para tramitar todas las cuestiones relacionadas con tu viaje y prestarte los servicios solicitados. Ejemplos: Necesitaremos usar tu nombre, dirección, correo electrónico, datos de contacto, fecha de nacimiento, género, número de pasaporte o documento de identidad, tus datos e información de pago para poder tramitar tus reservas, tramitar los servicios relacionados con tu viaje, cobrar por nuestros servicios, proporcionar información a las autoridades competentes (tales como autoridades fiscales, de aduanas e inmigración) y para que Iberia sepa quién tiene reserva en un vuelo.Basándonos en nuestra relación contractual contigo, para gestionar el proceso de embarque y facilitar vuelos de conexión en el aeropuerto. Ejemplos: Si no te presentas en la puerta de embarque para embarcar en tu vuelo, es posible que tengamos que comprobar si has pasado el control de seguridad del aeropuerto o si estabas en un vuelo de conexión, para saber cómo ponernos en contacto contigo para informarte del embarque del vuelo. En algunos aeropuertos en los que podemos operar se utiliza el sistema de reconocimiento facial (el uso de esta tecnología, a menos que sea requerido por ley, es voluntario). Basándonos en nuestra relación contractual contigo, para enviarte actualizaciones de estado y comunicaciones de servicio u operativas sobre el servicio contratado, con independencia del canal (venta directa o a través de agencias/otras compañías aéreas, venta online o presencial, ...) a través del cual hayas contratado nuestros servicios. Ejemplos: Es posible que te enviemos una comunicación informándote de que el check-in está abierto o que tu vuelo ha sufrido un retraso o una cancelación, o en general de los cambios que afecten a los servicios contratados con Iberia o con aquellas aerolíneas con las que Iberia disponga de algún tipo de acuerdo de transporte. También podremos utilizar los datos de contacto que nos hayas facilitado para notificarte otro tipo de comunicaciones operativas. Si, por ejemplo, has presentado tu tarjeta de embarque para acceder a alguna de nuestras salas VIP, podremos ofrecerte información y avisos sobre tu vuelo, como cambios en la puerta o en la hora de embarque del vuelo. Basándonos en el cumplimiento de nuestras obligaciones legales, para gestionar los trámites de inmigración y/o entrada o salida del territorio de un Estado, velar por tu seguridad y cumplir con otra serie de requisitos legales aplicables a Iberia como compañía aérea. Ejemplos: Como compañía aérea, Iberia está obligada a mantener un registro con información de los pasajeros que se encuentren a bordo de sus aeronaves. Las leyes de determinados países como en EE. UU. o en la Unión Europea exigen a las compañías aéreas que proporcionen cierta información sobre sus pasajeros a las autoridades aduaneras y de inmigración. Por último, la lucha contra el fraude y los grandes delitos (tráfico ilegal de personas, sustancias o mercancías, terrorismo, ...) exigen que las compañías aéreas respondan a los requerimientos de información cursados por los cuerpos de seguridad competentes de los Estados en los que aquéllas operan.Basándonos en nuestro interés legítimo empresarial y de negocio, para prestarte servicios que se ajusten a tus necesidades y ofrecerte un trato más personalizado. Ejemplos: Podemos personalizar tu experiencia cuando viajes con nosotros. Por ejemplo, un miembro de nuestra tripulación puede darte nuevamente la bienvenida a bordo de un vuelo de Iberia. Basándonos en nuestro interés legítimo empresarial y de negocio, para realizar labores analíticas y estudios de mercado. Ejemplos: Analizaremos la forma en la que los clientes usan nuestros canales de venta, productos y servicios, para saber cómo mejorar el servicio que ofrecemos. Basándonos en nuestro interés legítimo empresarial y de negocio, para realizar actividades de marketing directo y mantenerte informado sobre los productos y servicios de Iberia que a nuestro juicio mejor se ajusten a tus necesidades o preferencias. Ejemplos: Podremos enviarte información sobre nuestros productos y servicios por correo electrónico, mensajes push de nuestra app, o mensaje de texto.Podremos adaptar el contenido de nuestras webs, aplicaciones, correos electrónicos y demás comunicaciones, para garantizar que sean del mayor interés posible para ti, incluyendo destinos anteriores con ofertas y/o servicios relativos a dichos destinos o a otros similares. Comprender tus preferencias de vuelo y tus necesidades cuando viajes con nosotros y ofrecerte información sobre ofertas, tales como selección de cierta tipología de asiento, facturación de equipaje adicional o accesos a clase superior (“upgrades”).Si eres miembro del programa IBERIA PLUS, y basándonos en el consentimiento que previamente nos hayas otorgado, para realizar actividades de marketing directo por medios electrónicos y mantenerte informado sobre los productos y servicios de Iberia que a nuestro juicio mejor se ajustan a tus necesidades o preferencias, así como para enviarte comunicaciones comerciales electrónicas personalizadas sobre productos y servicios de otras compañías del Grupo IAG y de las compañías partners del programa Iberia Plus. Basándonos en el consentimiento que previamente nos hayas otorgado, podremos grabar las comunicaciones e instrucciones telemáticas producidas durante la utilización por tu parte de cualquier servicio de atención al cliente u oficina de ventas de Iberia, Iberia Express o Iberia Regional/Air Nostrum y, por tanto, trataremos tus datos personales, incluida tu voz cuando te dirijas a nosotros a través de dichos canales, para dejar constancia de las transacciones efectuadas a los efectos legales que procedan. Basándonos en el consentimiento que previamente nos hayas otorgado a través de tu manifiesta intención de contratarlos, para comunicar tus datos a otras sociedades del Grupo IAG al que Iberia pertenece o a terceras empresas que colaboren con el Grupo (como son, por ejemplo, las terceras empresas cuyos productos o servicios se ofrezcan y/o puedan contratarse a través de nuestra página web, así como los partners de nuestro programa Iberia Plus), en los casos en que lleves a cabo la contratación de alguno de estos productos o servicios. En estos casos, la cesión afectará exclusivamente a un número limitado de datos identificativos que nos hayas proporcionado y que sean necesarios para la contratación de los productos y servicios en cuestión. Puedes acceder al listado completo de los partners de IBERIA PLUS a través de la siguiente dirección url: https://www.iberia.com/es/iberiaplus/partners/ofertas/ Basándonos en nuestra relación contractual contigo, para enviarte información actualizada y comunicaciones operativas. Ejemplos: Incluso aunque hayas optado por dejar de recibir información comercial, podremos seguir enviándote comunicaciones operativas sobre los servicios que ya hayas reservado o contratado, como tu itinerario de viaje. Estas comunicaciones te ayudarán a obtener el detalle de los servicios contratados y podrán incluir opciones y complementos a los servicios que vayas a utilizar (por ejemplo, elección anticipada de asiento, equipaje adicional y reserva anticipada de menús).Basándonos en nuestro interés legítimo empresarial y de negocio, para mejorar nuestra web, productos y servicios. Ejemplos: Podremos hacer un seguimiento de cómo tu y otros clientes utilizan nuestra web, para que podamos identificar formas de mejorar tu experiencia de navegación.También podemos invitarte a participar en encuestas para conocer tu grado de satisfacción con el servicio y las prestaciones recibidas al viajar con Iberia y utilizar nuestros servicios.Si eres miembro del programa Iberia Plus, también podremos enviarte encuestas relativas a tu satisfacción con el programa, con ofertas y promociones y/o con servicios y productos ofertados por nuestros partners. En este caso, este tratamiento se basará en el consentimiento que previamente nos hayas otorgado. Basándonos en nuestra relación contractual contigo, para poder gestionar las transacciones, operaciones, contratación de productos y servicios que tengan lugar por cualquier medio, o cualquier tipo de consulta, queja, reclamación o sugerencia que pudieras realizarnos. Basándonos en el cumplimiento de nuestras obligaciones legales, según los casos, también podemos utilizar tus datos con otros fines de gestión y administración. Ejemplos: Es posible que usemos y conservemos tus datos personales, incluyendo tu historial de compras, para fines administrativos, lo que podrá incluir, por ejemplo, tareas de contabilidad y facturación, auditoría, verificación de tarjetas de crédito o de otras tarjetas de pago, control de fraude (incluyendo el uso de agencias de informes de crédito, el cotejo a estos efectos con información de entidades financieras y con otras empresas que operen con medios de pago electrónicos, y comprobaciones de validación de tarjetas de pago) prueba, mantenimiento y desarrollo de sistemas.Basándonos en el ejercicio de una obligación legal para gestionar correctamente situaciones de emergencia, catástrofes o en general de fuerza mayor es posible que necesitemos comunicar tus datos a distintos tipos de personas, empresas u organismos cuya colaboración sea imprescindible para Iberia en estos casos. '
                                },
                                {
                                    'title': '¿Cuándo te enviaremos comunicaciones comerciales?',
                                    'description': 'Cuando recabemos datos directamente de ti, es posible que te preguntemos si deseas o no recibir nuestras comunicaciones comerciales o formar parte del Programa IBERIA PLUS. En este sentido, debes tener en cuenta que dichas comunicaciones comerciales podrán ser de nuestros productos y servicios que puedan resultar de tu interés y, en ocasiones, podrán ser comunicaciones comerciales que promocionan los productos y servicios de otros miembros de nuestro grupo o de un tercero (por ejemplo, en el caso de IBERIA PLUS, los de nuestros partners del programa de fidelización en cuyos establecimientos puedan obtenerse o redimirse la moneda del programa, Avios).Cuando nuestra intención en este sentido no tenga base en el consentimiento que nos hayas otorgado previamente, sino en nuestro interés legítimo empresarial y de negocio, te informaremos previamente de forma clara y te daremos la opción de oponerte a la recepción de este tipo de comunicaciones.'
                                },
                                {
                                    'title': '¿Cómo puedes cambiar el tipo de comunicaciones comerciales a recibir y la forma de recibirlos? ',
                                    'description': 'Si decides que ya no quieres seguir recibiendo comunicaciones comerciales, puedes cambiar de idea en cualquier momento. A continuación describimos los canales habilitados para dejar de recibir comunicaciones comerciales:Si eres MIEMBRO DE IBERIA PLUS, puedes cambiar tus preferencias de privacidad en cualquier momento modificando las preferencias de comunicación disponibles en tu perfil online en www.iberia.com, accediendo a tu área privada de Iberia Plus en la sección “Mi Perfil/Preferencias”; o a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Si eres MIEMBRO DE ON BUSINESS, puedes cambiar tus preferencias de privacidad en cualquier momento modificando las preferencias de comunicación disponibles en tu perfil online en https://onbusiness.iberia.com; o a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Si NO ERES MIEMBRO DE IBERIA PLUS NI DE ON BUSINESS, también puedes oponerte al envío de este tipo de comunicaciones comerciales a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Además de lo anterior, todas las comunicaciones comerciales que te enviemos por correo electrónico tendrán una opción para \'darse de baja\' o \'cambiar mis preferencias de contacto\' que te permitirá modular las comunicaciones electrónicas comerciales que recibas de Iberia o dejar de recibirlas por completo.Respetaremos tu decisión en cuanto a qué comunicaciones deseas recibir y los medios a través de los cuales los recibirás en la medida que podamos brindarte la opción de personalizar tus preferencias de envío.También podrás dejar de recibir mensajes de texto SMS/MMS contestando a los mismos con la palabra “STOP”.Tratamos de tramitar las peticiones de dejar de recibir comunicaciones comerciales lo antes posible en un plazo máximo de 30 días desde que las recibamos.Además, debes tener en cuenta que, si nos comunicas que ya no deseas recibir comunicaciones comerciales, seguirás recibiendo comunicaciones operativas relacionadas con los productos y servicios que ya hayas contratado como, por ejemplo, para confirmar tu reserva o enviarte actualizaciones y cambios sobre el estado de la misma. Por otra parte, si eres miembro de IBERIA PLUS o de ON BUSINESS, te seguiremos manteniendo informado sobre cuestiones que afecten a tu pertenencia al Programa y enviándote información relevante a estos efectos como, por ejemplo, incorporación de nuevos partners al Programa.'
                                },
                                {
                                    'title': '¿Durante cuánto tiempo conservamos los datos personales?',
                                    'description': 'Conservaremos tus datos personales durante el tiempo que sea necesario para la finalidad con la que estén siendo objeto de tratamiento, no solicites que los suprimamos y no deban eliminarse por ser aún necesarios para Iberia.Por ejemplo, cuando hagas una reserva con nosotros, conservaremos la información relacionada con la misma a efectos de poder tramitar los servicios específicos de viaje que hayas solicitado y, posteriormente, durante el tiempo que nos permita gestionar o responder a cualquier reclamación o consulta relacionada con la reserva. También podremos conservar dicha información para seguir mejorando tu experiencia con Iberia y garantizar que recibas cualquier beneficio de nuestros programas de fidelización.Revisaremos activa y periódicamente los datos que obren en nuestro poder y bien los eliminaremos de forma segura, cuando ya no exista necesidad legal, comercial o relacionada con el cliente para conservarla, bien los anonimizaremos para seguir tratándolos con finalidades administrativas, estadísticas o de elaboración de segmentaciones y perfilados genéricos que nos ayuden a conocer mejor nuestra tipología de clientes y sus preferencias o necesidades en general.En los casos en que nos revoques tu consentimiento previamente otorgado para algún tipo de tratamiento o ejercites tu derecho de supresión de tus datos personales, te rogamos que tengas en cuenta que estamos obligados a conservar dicha información bloqueada, a disposición de los Juzgados, Tribunales y Autoridades competentes, durante los plazos de prescripción establecidos legalmente para atender a las posibles responsabilidades de Iberia nacidas del tratamiento de tus datos.'
                                },
                                {
                                    'title': '¿Con quién compartimos tus datos personales?',
                                    'description': 'Es posible que compartamos tus datos personales con las compañías de nuestro Grupo de Empresas o “Grupo IAG”, lo que incluye a International Consolidated Airlines Group S.A. (IAG), British Airways, Iberia Express, Vueling, Aer Lingus, OpenSkies, British Airways Holidays, Avios Group Ltd, BA CityFlyer, IAG Connect e IAG GBS. Para más información sobre nuestro grupo, visita la web de nuestra matriz IAG en www.iairgroup.com .Podemos compartir información con dichas compañías para que nos puedan ayudar a la hora de prestarte servicios y conocerte mejor. Por ejemplo, si has volado con alguna de las otras compañías del grupo IAG o perteneces a alguno de los programas de fidelización de dichas compañías, podremos usar dicha información para conocer mejor el tipo de servicios de viaje en los que sea probable que estés interesado.Únicamente recibirás correos electrónicos comerciales de otras compañías de nuestro grupo cuando hayas prestado tu consentimiento a dichas compañías.También es posible que revelemos tus datos personales a los siguientes terceros, para los fines descritos a continuación:Autoridades aduaneras y de inmigración de cualquier país comprendido en tu itinerario o sobre cuyo espacio aéreo pueda operar tu vuelo. Iberia y las demás compañías aéreas están obligadas por las leyes de la UE, EE.UU. y otros países, a proporcionar a las autoridades de control fronterizo y a las autoridades aduaneras, acceso a la información sobre reservas y viaje, cuando el vuelo tenga destino u origen en dichos países, incluyendo escalas, y cuando los sobrevueles para llegar a tu destino. Ejemplo: si tu vuelo implica volar sobre EE. UU., dicha información será suministrada a las autoridades competentes de EE. UU.Compañías aéreas y otros proveedores de servicios que sean necesarios para la prestación de los servicios que hayas solicitado cuando, por ejemplo, parte de tu itinerario de viaje incluya un vuelo operado por una compañía aérea distinta o incluya determinados servicios relacionados con tu vuelo que hayas decidido contratar. Dichas compañías aéreas y proveedores de servicios serán identificados en el momento en que hagas una reserva y se te informará de la comunicación de datos que es necesario realizar con carácter previo o simultáneo a la realización de dicha comunicación. La voluntad mostrada por tu parte de contratar tales servicios con terceros tendrá la consideración de consentimiento expreso por tu parte para llevar a cabo dicha comunicación de datos. Iberia sigue unos criterios estrictos de selección de proveedores de servicios con el fin de dar cumplimiento a tus obligaciones en materia de protección de datos y se compromete a suscribir con ellos el correspondiente contrato de tratamiento de datos mediante el que les impondrá, entre otras, las siguientes obligaciones: aplicar medidas técnicas y organizativas apropiadas; tratar los datos personales para las finalidades pactadas y atendiendo únicamente a las instrucciones documentadas de Iberia; y suprimir o devolver los datos a Iberia una vez finalice la prestación de los servicios.Ejemplos: Si tu destino conlleva hacer un transbordo desde un vuelo de Iberia a otro operado por otra compañía aérea diferente, perteneciente o no al Grupo IAG. Si reservas un billete a través de nuestro portal de internet para realizar un viaje con un servicio de transporte con reserva previa, proporcionaremos tu nombre y dirección de correo electrónico a la compañía de transporte para que pueda emitir tu billete y hacer tu reserva Si contratas con Bag On Board (“BOB”) el servicio de recogida a domicilio, transporte y facturación de equipaje disponible para ciertos vuelos de Iberia, deberemos facilitar a dicha compañía los datos necesarios para que dicha entidad pueda gestionar la relación contractual que le hayas solicitado. Nuestras compañías aéreas asociadas y franquiciadas (como por ejemplo Air Nostrum Líneas Aéreas del Mediterráneo, S.A., o \'Air Nostrum\'), por ejemplo, para facilitar tus vuelos de conexión o para gestionar beneficios derivados de la colaboración entre programas de fidelización. Asimismo, agencias de viajes y otros terceros a través de los cuales reserves viajes. Si eres miembro de los Programas ON BUSINESS o de IBERIA PLUS o de algún otro programa de fidelización asociado como, por ejemplo, los pertenecientes a otras compañías aéreas de la ALIANZA ONEWORLD, compartiremos información con nuestros socios para que podamos gestionar los beneficios conjuntos del programa de fidelización a los que tengas derecho. Puedes saber más acerca de los miembros de OneWorld a través de la web oficial https://es.oneworld.com/ Compañías de tarjetas de crédito y débito, agencias de informes de crédito y proveedores de servicios de control de fraude, para procesar pagos y (cuando sea necesario) realizar controles de fraude. En respuesta a peticiones legales y válidas de gobiernos y fuerzas del orden, tales como autoridades aduaneras y de inmigración o de lucha contra el fraude y los grandes delitos. Debes tener en cuenta que, por motivos de control y salvaguarda de la seguridad pública, Iberia estará facultada a comunicar tus datos como pasajero a las Autoridades Gubernamentales de Control de la Seguridad Interna del país de origen, tránsito o destino en cualquier momento antes de tu llegada, con dicha finalidad. Estados Unidos exige también está información para los aviones que sobrevuelan su espacio aéreo. Esta información podrá ser facilitada también a otros Estados que, en virtud de lo dispuesto en las leyes o tratados aplicables, exijan la misma para el sobrevuelo de su espacio aéreo.Proveedores de servicios externos que contratemos para prestar servicios, como por ejemplo, para llevar a cabo iniciativas de marketing o realizar encuestas a clientes en nuestro nombre. Terceros, tales como despachos de abogados y tribunales, para exigir el cumplimiento o la aplicación de un contrato contigo. Terceros, tales como la policía y autoridades reguladoras, para proteger nuestros derechos, propiedades, o la seguridad de nuestros clientes, empleados y activos.Cuando sea necesario para cumplir una obligación legal en cualquier jurisdicción, incluyendo cuando dicha obligación traiga causa de una acción u omisión de Iberia (por ejemplo, nuestra decisión de operar en un determinado país o una decisión relacionada con la misma) No comercializamos tus datos personales a terceros y solo permitimos que terceros ajenos te envíen comunicaciones comerciales si has prestado tu consentimiento para ello.'
                                },
                                {
                                    'title': '¿A qué países se enviarán tus datos personales?',
                                    'description': 'Tus datos personales podrán ser enviados a terceros que estén situados fuera del país en el que te encuentres y fuera del Espacio Económico Europeo.La naturaleza de nuestro negocio conlleva que con frecuencia sea necesario enviar tus datos personales fuera del Espacio Económico Europeo para gestionar los servicios relacionados con tu viaje, sea para cumplir con nuestra relación contractual contigo según lo convenido, sea para cumplir con las obligaciones legales a las que Iberia está sujeta como compañía aérea, todo ello en los términos que se han explicado anteriormente en el apartado “¿Para qué utilizamos tus datos personales y bajo qué fundamentos?”.Esto ocurre porque nuestro negocio y los terceros identificados en el apartado “¿Con quién compartimos sus datos personales?” realizan operaciones en países de todo el mundo. Por ejemplo, cuando vueles fuera del Espacio Económico Europeo, tus datos personales serán transferidos a autoridades de control fronterizo e inmigración situadas fuera de dichos territorios.Asimismo, podremos transferir tus datos personales a terceros que estén situados fuera del país en el que te encuentres, para que nos presten servicios relacionados con los productos y servicios que has solicitado.Ejemplo: necesitaremos facilitar acceso a nuestros sistemas de reserva y facturación al personal de nuestros agentes de handling que nos presten servicios fuera de España.'
                                },
                                {
                                    'title': 'Aviso legal para vuelos operados por OpenSkies',
                                    'description': 'De acuerdo con el Artículo L232-6 del Código de Seguridad Interna de Francia, te informamos que las compañías aéreas podrían transmitir datos sobre reservas/facturación y embarque recabados de sus pasajeros (PNR/API) a los servicios públicos y autoridades competentes de Francia para los fines y bajo las condiciones establecidas en el Decreto Nº 2014-1095 de fecha 26/09/2014.'
                                },
                                {
                                    'title': '¿Cuáles son tus derechos cuando nos facilitas tus datos?',
                                    'description': 'Puedes ejercitar, si lo deseas, los derechos de acceso, rectificación y supresión de datos, así como solicitar que se limite el tratamiento de tus datos personales, oponerte al mismo, solicitar la portabilidad de tus datos, así como no ser objeto de decisiones individuales automatizadas a través de los siguientes medios:Si eres MIEMBRO DE IBERIA PLUS, puedes ejercer la mayoría de estos derechos a través de tu perfil online en www.iberia.com, accediendo a tu área privada de Iberia Plus en la sección \'Mi Perfil/Preferencias\'.Asimismo, si eres MIEMBRO DE ON BUSINESS, puedes igualmente ejercer la mayoría de estos derechos a través de tu perfil online en https://onbusiness.iberia.com, accediendo a tu área privada de empresa.Para ejercer el resto de tus derechos, o si NO ERES MIEMBRO DE IBERIA PLUS o de ON BUSINESS, puedes ejercer cada uno de los derechos antes mencionados a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Para poder atender tu solicitud deberás facilitarnos, en todo caso, la información y documentación que se requieren en el mencionado formulario como obligatorias:Tu nombre completo del solicitanteDocumento de identidadDatos de contacto (al menos, correo electrónico)Datos objeto de tu solitud.Cualquier dato que nos ayude a localizar los datos que sean objeto de tu solicitud, como por ejemplo localizador o números de vuelos y fechas.Una fotocopia de tu documento de identidad o pasaporte, para que podamos verificar tu identidad.Si presentas la solicitud en nombre de otra persona, será necesario que aportes una autorización firmada por dicha persona junto con su documento de identidad correspondiente. '
                                },
                                {
                                    'title': '¿Ante qué Autoridad de Protección de Datos puedes ejercitar tus reclamaciones?',
                                    'description': 'En cualquier caso podrás presentar una reclamación ante la Agencia Española de Protección de Datos, especialmente cuando no hayas obtenido satisfacción en el ejercicio de tus derechos, a través de la web www.agpd.es.'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        'warningMessages': {
            'status': false,
            'messages': {
            }
        }
    };

    var mockPassengers = {
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
            'code': 'OVD',
            'description': 'Asturias-Oviedo',
            'timezone': 'Europe/Madrid',
            'country': {
                'code': 'ES',
                'description': 'España'
            }
        },
        'dates': {
            'outboundFlight': '2020-02-12',
            'formatedOutboundFlight': '2020-02-12T00:00:00.000Z'
        },
        'passengers': 2,
        'numberPassengrsWithoutInfant': 2
    };

    var mockPassengerInfo = {
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
                    'SURNAME': {
                    },
                    'NAME': {
                    }
                },
                'serviceErrors': [
                ],
                'optionalDocs': {
                },
                'specialNeeds': {
                    'specialVision': true,
                    'specialHearing': true,
                    'specialWheelchair': true,
                    'specialIntellDisability': true,
                    'specialGuideDog': true,
                    'specialWheelchairValue': 'WCHR',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión',
                            '$$hashKey': 'object:3257'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.',
                            '$$hashKey': 'object:3258'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.',
                            '$$hashKey': 'object:3259'
                        }
                    ],

                },
                'isSelected': true,
                'canBeInCharge': true,
                'mandatoryDocs': [
                ],
                'data': {
                    'name': 'FRANCISCO JAVIER',
                    'surname': 'CARTAN',
                    'lastSurname': '',
                    'freqFlyerSelected': false,
                    'freqFlyerInfo': {
                    }
                },
                'previousSelected': {
                    'name': 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK',
                    'type': 'DEFAULT'
                },
                '$$hashKey': 'object:3370'
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
                'id': 'CHILD_01',
                'type': 'CHILD',
                'name': {
                    'name': 'GENERAL_LABEL_PASSENGER',
                    'pasNumber': 2,
                    'needsTranslate': true
                },
                'requiredFields': {
                    'SURNAME': {
                    },
                    'BIRTH_DATE': {
                    },
                    'NAME': {
                    }
                },
                'serviceErrors': [
                ],
                'optionalDocs': {
                },
                'specialNeeds': {
                   'specialVision': true,
                    'specialHearing': true,
                    'specialWheelchair': true,
                    'specialIntellDisability': true,
                    'specialGuideDog': true,
                    'specialWheelchairValue': 'WCHR',
                    'specialWheelchairInfo': [
                        {
                            'code': 'WCHC',
                            'name': 'Silla de ruedas hasta la cabina',
                            'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión',
                            '$$hashKey': 'object:3263'
                        },
                        {
                            'code': 'WCHR',
                            'name': 'Silla de ruedas para rampas',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.',
                            '$$hashKey': 'object:3264'
                        },
                        {
                            'code': 'WCHS',
                            'name': 'Silla de ruedas para escalones',
                            'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.',
                            '$$hashKey': 'object:3265'
                        }
                    ],

                },
                'isSelected': false,
                'canBeInCharge': false,
                'mandatoryDocs': [
                ],
                'data': {
                    'name': 'ALBERTO',
                    'surname': 'CARTAN RODRIGUEZ',
                    'birthDate': {
                        '0': '03',
                        '1': '04',
                        '2': 2012
                    }
                }
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
                    'SURNAME': {
                    },
                    'BIRTH_DATE': {
                    },
                    'NAME': {
                    }
                },
                'serviceErrors': [
                ],
                'optionalDocs': {
                },
                'specialNeeds': {
                   'specialVision': true,
                    'specialHearing': true,
                    'specialWheelchair': true,
                    'specialIntellDisability': true,
                    'specialGuideDog': true,
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
                    ]
                },
                'isSelected': false,
                'canBeInCharge': false,
                'mandatoryDocs': [
                ],
                'data': {
                    'name': 'MARIA',
                    'surname': 'CARTAN RODRIGUEZ',
                    'birthDate': {
                        '0': '04',
                        '1': '04',
                        '2': 2018
                    },
                    'newPersonInCharge': {
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
                            'SURNAME': {
                            },
                            'NAME': {
                            }
                        },
                        'serviceErrors': [
                        ],
                        'optionalDocs': {
                        },
                        'specialNeeds': {

                            'specialVision': true,
                            'specialHearing': true,
                            'specialWheelchair': true,
                            'specialIntellDisability': true,
                            'specialGuideDog': true,
                            'specialWheelchairValue': 'WCHR',
                            'specialWheelchairInfo': [
                                {
                                    'code': 'WCHC',
                                    'name': 'Silla de ruedas hasta la cabina',
                                    'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión',
                                    '$$hashKey': 'object:3257'
                                },
                                {
                                    'code': 'WCHR',
                                    'name': 'Silla de ruedas para rampas',
                                    'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.',
                                    '$$hashKey': 'object:3258'
                                },
                                {
                                    'code': 'WCHS',
                                    'name': 'Silla de ruedas para escalones',
                                    'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.',
                                    '$$hashKey': 'object:3259'
                                }
                            ],

                        },
                        'isSelected': true,
                        'canBeInCharge': true,
                        'mandatoryDocs': [
                        ],
                        'data': {
                            'name': 'FRANCISCO JAVIER',
                            'surname': 'CARTAN',
                            'lastSurname': '',
                            'freqFlyerSelected': false,
                            'freqFlyerInfo': {
                            }
                        },
                        'previousSelected': {
                            'name': 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK',
                            'type': 'DEFAULT'
                        },
                        '$$hashKey': 'object:3370'
                    },
                    'personInCharge': {
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
                            'SURNAME': {
                            },
                            'NAME': {
                            }
                        },
                        'serviceErrors': [
                        ],
                        'optionalDocs': {
                        },
                        'specialNeeds': {
                            'specialVisionValue': true,
                            'specialHearingValue': true,
                            'specialVision': true,
                            'specialHearing': true,
                            'specialWheelchair': true,
                            'specialIntellDisability': true,
                            'specialGuideDog': true,
                            'specialWheelchairValue': 'WCHR',
                            'specialWheelchairInfo': [
                                {
                                    'code': 'WCHC',
                                    'name': 'Silla de ruedas hasta la cabina',
                                    'description': 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión',
                                    '$$hashKey': 'object:3257'
                                },
                                {
                                    'code': 'WCHR',
                                    'name': 'Silla de ruedas para rampas',
                                    'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.',
                                    '$$hashKey': 'object:3258'
                                },
                                {
                                    'code': 'WCHS',
                                    'name': 'Silla de ruedas para escalones',
                                    'description': 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.',
                                    '$$hashKey': 'object:3259'
                                }
                            ],

                        },
                        'isSelected': true,
                        'canBeInCharge': true,
                        'mandatoryDocs': [
                        ],
                        'data': {
                            'name': 'FRANCISCO JAVIER',
                            'surname': 'CARTAN',
                            'lastSurname': '',
                            'freqFlyerSelected': false,
                            'freqFlyerInfo': {
                            }
                        },
                        'previousSelected': {
                            'name': 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK',
                            'type': 'DEFAULT'
                        },
                        '$$hashKey': 'object:3370'
                    }
                }
            }
        ],
        'isLogged': false,
        'isResident': false,
        'iTravel': false,
        'passengerInfoLogged': {
        },
        'contactData': {
            'isValidForm': false,
            'contactPrefix': {
                'code': '34',
                'description': 'España / +34'
            },
            'isNewsLetters': false,
            'contactEmail': 'test@test.com',
            'repeatedEmail': 'test@test.com',
            'contactPhone': '00000000000'
        },
        'frequentlyPassengers': {
        },
        'largeFamilyDiscountInfo': {
            'largeFamilyCertificateNumber': '',
            'communityCode': ''
        },
        'totalPrice': '115,38€',
        'aviosInfo': {
            'redemptionAvios': 125,
            'cashDiscountWithAvios': '90,92€'
        },
        'onHold': {
            'holdTimes': '72',
            'maxFreeTime': 0,
            'moreTimePrice': 5,
            'minPrice': '5,00€'
        },
        'summaryInfo': {
            'trips': [
                {
                    'idTrip': 'MADOVD20200212073500',
                    'stopsNumber': 0,
                    'fare': {
                        'fareDetails': {
                            'EQBODEGA': {
                                'name': 'Equipaje en bodega',
                                'message': 'Sin equipaje en bodega'
                            },
                            'REEMBOLSO': {
                                'name': 'Reembolso (por sentido)',
                                'message': 'Reembolso no permitido'
                            },
                            'SALAVIP': {
                                'name': 'Acceso a salas VIP',
                                'message': 'No'
                            },
                            'FASTTRACK': {
                                'name': 'Fast Track',
                                'message': 'No'
                            },
                            'CAMBIO': {
                                'name': 'Cambios',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio'
                            },
                            'CHECKINDESK': {
                                'name': 'Mostrador check-in exclusivo',
                                'message': 'No'
                            },
                            'EQPPRIOR': {
                                'name': 'Entrega prioritaria equipaje',
                                'message': 'No'
                            },
                            'EMBARQUE': {
                                'name': 'Embarque prioritario',
                                'message': 'No'
                            },
                            'CABINA': {
                                'name': 'Cabina',
                                'message': 'Turista'
                            },
                            'EQMANO': {
                                'name': 'Equipaje de mano',
                                'message': '1 bulto en cabina'
                            },
                            'ASIENTO': {
                                'name': 'Selección de asiento',
                                'message': 'Seleccionable con coste'
                            },
                            'ASIENTOXL': {
                                'name': 'Selección de asiento XL(emergencia)',
                                'message': 'Seleccionable con coste'
                            }
                        },
                        'name': 'Básica',
                        'cabin': 'Turista'
                    },
                    'segments': [
                        {
                            'idSegment': 'IB047820200212',
                            'departure': {
                                'code': 'MAD',
                                'name': 'Madrid',
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
                                'dateTime': '07:35',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 2,
                                'month': 'MONTH_FEBRUARY',
                                'year': 2020,
                                'formatedDate': '2020-02-12 07:35'
                            },
                            'arrival': {
                                'code': 'OVD',
                                'name': 'Asturias',
                                'terminal': '',
                                'city': {
                                    'code': 'OVD',
                                    'description': 'Asturias-Oviedo',
                                    'countryCode': 'ES',
                                    'country': {
                                        'code': 'ES',
                                        'description': 'España'
                                    }
                                }
                            },
                            'arrivalDate': {
                                'dateTime': '08:45',
                                'weekDay': 'WEEKDAY_WEDNESDAY',
                                'hour': 1,
                                'minutes': 0,
                                'day': 12,
                                'monthNumber': 2,
                                'month': 'MONTH_FEBRUARY',
                                'year': 2020,
                                'formatedDate': '2020-02-12 08:45'
                            },
                            'flightNumber': '0478',
                            'operatedBy': 'Iberia',
                            'aircraftType': 'Airbus A320',
                            'duration': '1h 10min.',
                            'waitingTime': 0,
                            'waitingParsedTime': '',
                            'cabin': 'Turista',
                            'operationalDisclosure': 'IB',
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            '$$hashKey': 'object:3192'
                        }
                    ],
                    '$$hashKey': 'object:2682'
                }
            ],
            'passengers': {
                'generalData': {
                    'ADULT': [
                        {
                            'number': 1,
                            'totalTax': 21.46,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD',
                                    'amount': '16,94€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida'
                                },
                                {
                                    'code': 'OG',
                                    'amount': '0,67€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad'
                                },
                                {
                                    'code': 'QV',
                                    'amount': '3,85€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad'
                                }
                            ],
                            'fare': 24,
                            'parsedFare': '24€',
                            'parsedTotalTax': '21,46€',
                            '$$hashKey': 'object:2689'
                        }
                    ],
                    'CHILD': [
                        {
                            'number': 1,
                            'totalTax': 21.46,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD',
                                    'amount': '16,94€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida'
                                },
                                {
                                    'code': 'OG',
                                    'amount': '0,67€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad'
                                },
                                {
                                    'code': 'QV',
                                    'amount': '3,85€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad'
                                }
                            ],
                            'fare': 24,
                            'parsedFare': '24€',
                            'parsedTotalTax': '21,46€',
                            '$$hashKey': 'object:2691'
                        }
                    ],
                    'INFANT': [
                        {
                            'number': 1,
                            'totalTax': 21.46,
                            'currency': '€',
                            'breakdownTaxes': [
                                {
                                    'code': 'JD',
                                    'amount': '16,94€',
                                    'currency': 'EUR',
                                    'description': 'Cargo por salida'
                                },
                                {
                                    'code': 'OG',
                                    'amount': '0,67€',
                                    'currency': 'EUR',
                                    'description': 'Tasa de seguridad'
                                },
                                {
                                    'code': 'QV',
                                    'amount': '3,85€',
                                    'currency': 'EUR',
                                    'description': 'Seguridad'
                                }
                            ],
                            'fare': 3,
                            'parsedFare': '3€',
                            'parsedTotalTax': '21,46€',
                            '$$hashKey': 'object:2693'
                        }
                    ]
                }
            },
            'otherFees': [
            ]
        },
        'relatedContent': {
            'SPECIAL_NEED_CONTACT_INFO': {
            },
            'TOTAL_PRICE': {
            },
            'OBSERVATIONS': {
            },
            'FARE_CONDITIONS': {
            }
        },
        'gdprInfo': {
            'text': {
            },
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
                                },
                                {
                                    'title': '¿Qué entendemos por datos personales?',
                                    'description': 'Se entiende por datos personales aquellos datos que te identifican o podrían emplearse para ello, como por ejemplo tu nombre, datos de contacto y tu historial de viajes y compras. También pueden incluir información sobre cómo utilizas nuestro sitio web y las aplicaciones para el móvil.'
                                },
                                {
                                    'title': '¿Cuándo es aplicable esta política?',
                                    'description': 'Esta Política es aplicable a los datos personales que recabamos, usamos y tratamos en el marco de tu relación con nosotros como cliente, potencial cliente o miembro de nuestro Programas de Fidelización IBERIA PLUS u ON BUSINESS, incluyendo cuando viajas con nosotros o utilizas otros de nuestros servicios (como por ejemplo, nuestra web de subastas o nuestro servicio de tarjetas regalo), cuando navegas en nuestra web, cuando contactas con nuestros agentes de servicio o centros de atención telefónica y cuando reservas nuestros servicios a través de terceros (como agencias de viajes y otras compañías aéreas).Cuando hacemos referencia a que otros son responsables del tratamiento en el apartado Responsable del Tratamiento de Datos Personales o ¿Con quién compartimos tus datos personales?, deberás consultar sus políticas de privacidad para obtener más información.Si decides contratar servicios adicionales con nosotros, como hacer una compra a bordo, usar nuestro sistema de entretenimiento a bordo o participar en un concurso celebrado por Iberia con terceros colaboradores, podrían resultar aplicables, además de lo previsto en la presente política, otros términos y condiciones adicionales.'
                                },
                                {
                                    'title': '¿Cómo puedes proteger tus datos personales?',
                                    'description': 'Nos tomamos muchas molestias para proteger los datos personales que nos proporcionas. A continuación te indicamos algunas de las medidas que puedes tomar para mantener tus datos a salvo.No compartas tu código de reserva o localizadorCuando realizas una reserva, se te proporciona un código de reserva (también conocido como PNR o Registro de Pasajero). Esta referencia aparecerá en el correo electrónico de confirmación o en el billete de cada uno de los pasajeros de tu reserva.Mantén siempre la confidencialidad del código de reserva. Si compartes tu código de reserva con terceros, estos podrán acceder a los datos de tu reserva a través de nuestro sistema.Si viajas con otras personas y no quieres que tengan acceso a los datos de tu reserva, es posible que sea preferible que cada persona haga su reserva por separado.No compartas los datos de inicio de sesión para el acceso al área privada del Programa Iberia Plus, Iberia Joven u On BusinessPara garantizar la seguridad de tu acceso al área privada de nuestro sitio web y aplicaciones para móvil, no compartas con nadie las claves de acceso a tu área personal de Iberia Plus, Iberia Joven u On Business (programa específico para empresas que co-esponsorizamos con British Airways Plc). Cuando termines de utilizar el sitio web, los servicios online o las aplicaciones para móvil, debes cerrar la sesión si alguien más puede tener acceso a tu ordenador o dispositivo. Esto es especialmente relevante si utilizas un ordenador o dispositivo de acceso público.Actúa con precaución y protégete frente a fraudes en Internet y “Phishing”Existe una práctica de fraude a través de internet conocida como “Phishing”, que consiste en la obtención ilegal de datos personales mediante engaño. Se envían correos electrónicos no solicitados a personas incluidas en listados obtenidos ilegalmente por terceras partes, y se pide a sus destinatarios que introduzcan o confirmen datos bancarios o contraseñas en una web clonada o falsa.'
                                },
                                {
                                    'title': '¿Cuándo recabamos tus datos personales?',
                                    'description': 'Recabamos datos personales sobre tu persona cada vez que utilizas nuestros servicios (ya sean suministrados por nosotros o por otras compañías o agentes que actúen en nuestro nombre), incluyendo cuando viajas con nosotros, cuando utilizas nuestro sitio web o cuando interactúas con nosotros por medios electrónicos o a través de nuestros centros de atención al cliente.Algunos ejemplos de cuándo y cómo recogemos la información son:Cuando reservas o buscas un vuelo u otros productos o Servicios en nuestra web o en nuestra aplicación móvilCuando reservas un vuelo o cualquier otro producto a través de otros canales de venta como, por ejemplo, una agencia de viajes.Cuando te das de alta en nuestros programas de fidelización Iberia Plus, Iberia Joven u On Business, o en nuestro servicio de subastas, o cuando decides adquirir una de nuestras tarjetas regalo.Cuando te pones en contacto con nuestros contact centers y demás agentes de servicio.Cuando completas una encuesta de satisfacción y nos facilitas tus quejas, halagos, recomendaciones y sugerencias.Cuando participas en nuestros concursos o te registras en alguna de nuestras promociones, así como cuando decides relacionarte con nosotros a través de tu perfil en redes sociales como, por ejemplo, Facebook o Twitter.Cuando viajas con nosotros y cuando usas las salas VIP en los Aeropuertos en los que operamos.Cuando utilizas nuestros Sistemas de entretenimiento a bordo o nuestros servicios de comunicaciones.Cuando haces clic en alguno de nuestros emails o navegas a través de nuestro website. También puede que recibamos información sobre cómo nos has encontrado en Internet o sobre los sitios que hayas visitado previamente.Para obtener más información, consulta el apartado “¿Qué tipos de datos personales recabamos y conservamos?” a continuación.Además, podemos recibir datos personales sobre tu persona de terceros, tales como:Empresas que hayamos contratado para prestarte un servicio.Empresas implicadas en tus planes de viaje, incluyendo compañías aéreas involucradas en tu viaje anterior o posterior, operadores aeroportuarios y autoridades de aduanas e inmigración.Empresas que participen en nuestros programas de fidelización y demás programas de clientes (por ejemplo empresas de vehículos de alquiler y hoteles).Empresas que nos proporcionan datos bajo políticas de privacidad que prevén información a compartir con Iberia.'
                                },
                                {
                                    'title': '¿Qué tipos de datos personales recabamos y conservamos?',
                                    'description': 'Cuando utilices nuestros servicios tendrás que proporcionarnos tus datos personales o los de la persona o personas que vayan a viajar.Recabamos las siguientes categorías de datos personales: Datos que proporciones a Iberia para completar y gestionar una reserva que hayas hecho con nosotros o un servicio que nos hayas solicitado. Ejemplos: Nombre, dirección, correo electrónico, fecha de nacimiento, género, número de pasaporte o documento de identidad, datos e información de pago.Si compras billetes para un tercero, podremos recabar sus datos de facturación para contactar directamente con el pasajero en lo que se refiere al vuelo.Sabremos si ha reservado su vuelo en iberia.com o si ha utilizado otro canal de venta, como una agencia de viajes o nuestro centro de atención al cliente.Datos recabados durante tu viaje con nosotros. Ejemplos: Puede que recabemos cierta información como por ejemplo tu interacción con el personal y la tripulación de cabina antes y durante el vuelo. Podremos obtener geolocalización de tus dispositivos móviles, si nos lo has permitido. Obtendremos información sobre tu uso de nuestros servicios durante el viaje como, por ejemplo, el uso de nuestros sistemas de entretenimiento a bordo o de nuestras salas VIP.Datos sobre tu programa de viaje. Ejemplos: Datos relativos a tu reserva, itinerario de viaje, datos sobre cualquier asistencia adicional que solicites y demás información relacionada con tu viaje, como por ejemplo preferencias de comida o necesidades dietéticas especiales. Datos sobre los servicios que te hayamos prestado en el pasado. Ejemplos: Datos sobre viajes anteriores, como por ejemplo los viajes realizados y todas las cuestiones relacionadas con los mismos, incluyendo accesos a clase superior (“upgrades”), necesidades en cuanto a equipaje, problemas en aeropuertos, incidencias de equipaje y tus comentarios como cliente. Datos sobre tu registro online y otras interacciones. Ejemplos: Conservaremos tus datos para garantizar una correcta interacción contigo, sea porque te has registrado con nosotros a través de nuestro programas de fidelización Iberia Plus u On Business, por ejemplo, sea porque te has identificado como miembro de otro programa de fidelización. Conservaremos tus datos en el caso de que hayas participado en algún concurso o acción promocional, o hayas interactuado con nosotros a través de redes sociales como Facebook o Twitter.Datos sobre el uso que hagas de nuestros sitio web, aplicaciones para móvil y centros de atención al cliente. Ejemplos: Para ayudarnos a personalizar tus datos y mejorar nuestro sitio web, usamos cookies y tecnologías similares para recabar información sobre tus búsquedas y los contenidos que has visitado en nuestra web, como por ejemplo la web de la que procedes, o banners y enlaces que aparecen en los sitios web de nuestros socios comerciales. Utilizaremos los datos sobre uso de la web almacenados en la cookie para comprenderte como cliente. Esta información podría incluir, si la has introducido en nuestra web, datos sobre cualquier reserva o nombre de un pasajero, en caso de uso de sus datos de registro asociados a su cuenta de Iberia Plus. A partir de tus datos de uso podremos saber que has visitado iberia.com y buscado un vuelo, pero que no has formalizado su reserva. Podríamos usar esta información para contactar contigo y ofrecerte más información sobre la reserva o destino por la que te has interesado. '
                                },
                                {
                                    'title': '¿Cuándo y por qué recabamos “datos personales sensibles”?',
                                    'description': 'Ciertas categorías de datos personales, como los relativos al origen racial, etnia, religión, salud, orientación sexual o datos biométricos, constituyen categorías especiales de datos personales que requieren una protección adicional de acuerdo con la normativa de protección de datos de la Unión Europea y son referidos como “datos personales sensibles”. En Iberia tratamos de limitar las circunstancias en las que recabamos y tratamos datos de esta naturaleza. Los siguientes son ejemplos de supuestos en los que podríamos recabar y tratar datos personales sensibles:Cuando hayas solicitado a Iberia y/o a un operador aeroportuario asistencia médica específica, como por ejemplo una silla de ruedas u oxígeno.Cuando hayas solicitado autorización para volar con nosotros con una determinada afección médica o en estado de gestación de más de 28 semanas.Cuando hayas optado por proporcionarnos dicha información por cualquier otro motivo o nos haya sido proporcionada por un tercero como, por ejemplo, la agencia de viajes a través de la cual realizaste tu reserva.Asimismo, es posible que hayas solicitado un servicio especial (como un menú) que no constituya en sí mismo un dato sensible pero que pueda implicar o sugerir información sobre tu religión, tu salud u otros datos.'
                                },
                                {
                                    'title': '¿Para qué utilizamos tus datos personales y bajo qué fundamentos?',
                                    'description': 'Las principales finalidades para las que tratamos tus datos personales son las expuestas a continuación:Basándonos en nuestra relación contractual contigo, para tramitar todas las cuestiones relacionadas con tu viaje y prestarte los servicios solicitados. Ejemplos: Necesitaremos usar tu nombre, dirección, correo electrónico, datos de contacto, fecha de nacimiento, género, número de pasaporte o documento de identidad, tus datos e información de pago para poder tramitar tus reservas, tramitar los servicios relacionados con tu viaje, cobrar por nuestros servicios, proporcionar información a las autoridades competentes (tales como autoridades fiscales, de aduanas e inmigración) y para que Iberia sepa quién tiene reserva en un vuelo.Basándonos en nuestra relación contractual contigo, para gestionar el proceso de embarque y facilitar vuelos de conexión en el aeropuerto. Ejemplos: Si no te presentas en la puerta de embarque para embarcar en tu vuelo, es posible que tengamos que comprobar si has pasado el control de seguridad del aeropuerto o si estabas en un vuelo de conexión, para saber cómo ponernos en contacto contigo para informarte del embarque del vuelo. En algunos aeropuertos en los que podemos operar se utiliza el sistema de reconocimiento facial (el uso de esta tecnología, a menos que sea requerido por ley, es voluntario). Basándonos en nuestra relación contractual contigo, para enviarte actualizaciones de estado y comunicaciones de servicio u operativas sobre el servicio contratado, con independencia del canal (venta directa o a través de agencias/otras compañías aéreas, venta online o presencial, ...) a través del cual hayas contratado nuestros servicios. Ejemplos: Es posible que te enviemos una comunicación informándote de que el check-in está abierto o que tu vuelo ha sufrido un retraso o una cancelación, o en general de los cambios que afecten a los servicios contratados con Iberia o con aquellas aerolíneas con las que Iberia disponga de algún tipo de acuerdo de transporte. También podremos utilizar los datos de contacto que nos hayas facilitado para notificarte otro tipo de comunicaciones operativas. Si, por ejemplo, has presentado tu tarjeta de embarque para acceder a alguna de nuestras salas VIP, podremos ofrecerte información y avisos sobre tu vuelo, como cambios en la puerta o en la hora de embarque del vuelo. Basándonos en el cumplimiento de nuestras obligaciones legales, para gestionar los trámites de inmigración y/o entrada o salida del territorio de un Estado, velar por tu seguridad y cumplir con otra serie de requisitos legales aplicables a Iberia como compañía aérea. Ejemplos: Como compañía aérea, Iberia está obligada a mantener un registro con información de los pasajeros que se encuentren a bordo de sus aeronaves. Las leyes de determinados países como en EE. UU. o en la Unión Europea exigen a las compañías aéreas que proporcionen cierta información sobre sus pasajeros a las autoridades aduaneras y de inmigración. Por último, la lucha contra el fraude y los grandes delitos (tráfico ilegal de personas, sustancias o mercancías, terrorismo, ...) exigen que las compañías aéreas respondan a los requerimientos de información cursados por los cuerpos de seguridad competentes de los Estados en los que aquéllas operan.Basándonos en nuestro interés legítimo empresarial y de negocio, para prestarte servicios que se ajusten a tus necesidades y ofrecerte un trato más personalizado. Ejemplos: Podemos personalizar tu experiencia cuando viajes con nosotros. Por ejemplo, un miembro de nuestra tripulación puede darte nuevamente la bienvenida a bordo de un vuelo de Iberia. Basándonos en nuestro interés legítimo empresarial y de negocio, para realizar labores analíticas y estudios de mercado. Ejemplos: Analizaremos la forma en la que los clientes usan nuestros canales de venta, productos y servicios, para saber cómo mejorar el servicio que ofrecemos. Basándonos en nuestro interés legítimo empresarial y de negocio, para realizar actividades de marketing directo y mantenerte informado sobre los productos y servicios de Iberia que a nuestro juicio mejor se ajusten a tus necesidades o preferencias. Ejemplos: Podremos enviarte información sobre nuestros productos y servicios por correo electrónico, mensajes push de nuestra app, o mensaje de texto.Podremos adaptar el contenido de nuestras webs, aplicaciones, correos electrónicos y demás comunicaciones, para garantizar que sean del mayor interés posible para ti, incluyendo destinos anteriores con ofertas y/o servicios relativos a dichos destinos o a otros similares. Comprender tus preferencias de vuelo y tus necesidades cuando viajes con nosotros y ofrecerte información sobre ofertas, tales como selección de cierta tipología de asiento, facturación de equipaje adicional o accesos a clase superior (“upgrades”).Si eres miembro del programa IBERIA PLUS, y basándonos en el consentimiento que previamente nos hayas otorgado, para realizar actividades de marketing directo por medios electrónicos y mantenerte informado sobre los productos y servicios de Iberia que a nuestro juicio mejor se ajustan a tus necesidades o preferencias, así como para enviarte comunicaciones comerciales electrónicas personalizadas sobre productos y servicios de otras compañías del Grupo IAG y de las compañías partners del programa Iberia Plus. Basándonos en el consentimiento que previamente nos hayas otorgado, podremos grabar las comunicaciones e instrucciones telemáticas producidas durante la utilización por tu parte de cualquier servicio de atención al cliente u oficina de ventas de Iberia, Iberia Express o Iberia Regional/Air Nostrum y, por tanto, trataremos tus datos personales, incluida tu voz cuando te dirijas a nosotros a través de dichos canales, para dejar constancia de las transacciones efectuadas a los efectos legales que procedan. Basándonos en el consentimiento que previamente nos hayas otorgado a través de tu manifiesta intención de contratarlos, para comunicar tus datos a otras sociedades del Grupo IAG al que Iberia pertenece o a terceras empresas que colaboren con el Grupo (como son, por ejemplo, las terceras empresas cuyos productos o servicios se ofrezcan y/o puedan contratarse a través de nuestra página web, así como los partners de nuestro programa Iberia Plus), en los casos en que lleves a cabo la contratación de alguno de estos productos o servicios. En estos casos, la cesión afectará exclusivamente a un número limitado de datos identificativos que nos hayas proporcionado y que sean necesarios para la contratación de los productos y servicios en cuestión. Puedes acceder al listado completo de los partners de IBERIA PLUS a través de la siguiente dirección url: https://www.iberia.com/es/iberiaplus/partners/ofertas/ Basándonos en nuestra relación contractual contigo, para enviarte información actualizada y comunicaciones operativas. Ejemplos: Incluso aunque hayas optado por dejar de recibir información comercial, podremos seguir enviándote comunicaciones operativas sobre los servicios que ya hayas reservado o contratado, como tu itinerario de viaje. Estas comunicaciones te ayudarán a obtener el detalle de los servicios contratados y podrán incluir opciones y complementos a los servicios que vayas a utilizar (por ejemplo, elección anticipada de asiento, equipaje adicional y reserva anticipada de menús).Basándonos en nuestro interés legítimo empresarial y de negocio, para mejorar nuestra web, productos y servicios. Ejemplos: Podremos hacer un seguimiento de cómo tu y otros clientes utilizan nuestra web, para que podamos identificar formas de mejorar tu experiencia de navegación.También podemos invitarte a participar en encuestas para conocer tu grado de satisfacción con el servicio y las prestaciones recibidas al viajar con Iberia y utilizar nuestros servicios.Si eres miembro del programa Iberia Plus, también podremos enviarte encuestas relativas a tu satisfacción con el programa, con ofertas y promociones y/o con servicios y productos ofertados por nuestros partners. En este caso, este tratamiento se basará en el consentimiento que previamente nos hayas otorgado. Basándonos en nuestra relación contractual contigo, para poder gestionar las transacciones, operaciones, contratación de productos y servicios que tengan lugar por cualquier medio, o cualquier tipo de consulta, queja, reclamación o sugerencia que pudieras realizarnos. Basándonos en el cumplimiento de nuestras obligaciones legales, según los casos, también podemos utilizar tus datos con otros fines de gestión y administración. Ejemplos: Es posible que usemos y conservemos tus datos personales, incluyendo tu historial de compras, para fines administrativos, lo que podrá incluir, por ejemplo, tareas de contabilidad y facturación, auditoría, verificación de tarjetas de crédito o de otras tarjetas de pago, control de fraude (incluyendo el uso de agencias de informes de crédito, el cotejo a estos efectos con información de entidades financieras y con otras empresas que operen con medios de pago electrónicos, y comprobaciones de validación de tarjetas de pago) prueba, mantenimiento y desarrollo de sistemas.Basándonos en el ejercicio de una obligación legal para gestionar correctamente situaciones de emergencia, catástrofes o en general de fuerza mayor es posible que necesitemos comunicar tus datos a distintos tipos de personas, empresas u organismos cuya colaboración sea imprescindible para Iberia en estos casos. '
                                },
                                {
                                    'title': '¿Cuándo te enviaremos comunicaciones comerciales?',
                                    'description': 'Cuando recabemos datos directamente de ti, es posible que te preguntemos si deseas o no recibir nuestras comunicaciones comerciales o formar parte del Programa IBERIA PLUS. En este sentido, debes tener en cuenta que dichas comunicaciones comerciales podrán ser de nuestros productos y servicios que puedan resultar de tu interés y, en ocasiones, podrán ser comunicaciones comerciales que promocionan los productos y servicios de otros miembros de nuestro grupo o de un tercero (por ejemplo, en el caso de IBERIA PLUS, los de nuestros partners del programa de fidelización en cuyos establecimientos puedan obtenerse o redimirse la moneda del programa, Avios).Cuando nuestra intención en este sentido no tenga base en el consentimiento que nos hayas otorgado previamente, sino en nuestro interés legítimo empresarial y de negocio, te informaremos previamente de forma clara y te daremos la opción de oponerte a la recepción de este tipo de comunicaciones.'
                                },
                                {
                                    'title': '¿Cómo puedes cambiar el tipo de comunicaciones comerciales a recibir y la forma de recibirlos? ',
                                    'description': 'Si decides que ya no quieres seguir recibiendo comunicaciones comerciales, puedes cambiar de idea en cualquier momento. A continuación describimos los canales habilitados para dejar de recibir comunicaciones comerciales:Si eres MIEMBRO DE IBERIA PLUS, puedes cambiar tus preferencias de privacidad en cualquier momento modificando las preferencias de comunicación disponibles en tu perfil online en www.iberia.com, accediendo a tu área privada de Iberia Plus en la sección “Mi Perfil/Preferencias”; o a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Si eres MIEMBRO DE ON BUSINESS, puedes cambiar tus preferencias de privacidad en cualquier momento modificando las preferencias de comunicación disponibles en tu perfil online en https://onbusiness.iberia.com; o a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Si NO ERES MIEMBRO DE IBERIA PLUS NI DE ON BUSINESS, también puedes oponerte al envío de este tipo de comunicaciones comerciales a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Además de lo anterior, todas las comunicaciones comerciales que te enviemos por correo electrónico tendrán una opción para \'darse de baja\' o \'cambiar mis preferencias de contacto\' que te permitirá modular las comunicaciones electrónicas comerciales que recibas de Iberia o dejar de recibirlas por completo.Respetaremos tu decisión en cuanto a qué comunicaciones deseas recibir y los medios a través de los cuales los recibirás en la medida que podamos brindarte la opción de personalizar tus preferencias de envío.También podrás dejar de recibir mensajes de texto SMS/MMS contestando a los mismos con la palabra “STOP”.Tratamos de tramitar las peticiones de dejar de recibir comunicaciones comerciales lo antes posible en un plazo máximo de 30 días desde que las recibamos.Además, debes tener en cuenta que, si nos comunicas que ya no deseas recibir comunicaciones comerciales, seguirás recibiendo comunicaciones operativas relacionadas con los productos y servicios que ya hayas contratado como, por ejemplo, para confirmar tu reserva o enviarte actualizaciones y cambios sobre el estado de la misma. Por otra parte, si eres miembro de IBERIA PLUS o de ON BUSINESS, te seguiremos manteniendo informado sobre cuestiones que afecten a tu pertenencia al Programa y enviándote información relevante a estos efectos como, por ejemplo, incorporación de nuevos partners al Programa.'
                                },
                                {
                                    'title': '¿Durante cuánto tiempo conservamos los datos personales?',
                                    'description': 'Conservaremos tus datos personales durante el tiempo que sea necesario para la finalidad con la que estén siendo objeto de tratamiento, no solicites que los suprimamos y no deban eliminarse por ser aún necesarios para Iberia.Por ejemplo, cuando hagas una reserva con nosotros, conservaremos la información relacionada con la misma a efectos de poder tramitar los servicios específicos de viaje que hayas solicitado y, posteriormente, durante el tiempo que nos permita gestionar o responder a cualquier reclamación o consulta relacionada con la reserva. También podremos conservar dicha información para seguir mejorando tu experiencia con Iberia y garantizar que recibas cualquier beneficio de nuestros programas de fidelización.Revisaremos activa y periódicamente los datos que obren en nuestro poder y bien los eliminaremos de forma segura, cuando ya no exista necesidad legal, comercial o relacionada con el cliente para conservarla, bien los anonimizaremos para seguir tratándolos con finalidades administrativas, estadísticas o de elaboración de segmentaciones y perfilados genéricos que nos ayuden a conocer mejor nuestra tipología de clientes y sus preferencias o necesidades en general.En los casos en que nos revoques tu consentimiento previamente otorgado para algún tipo de tratamiento o ejercites tu derecho de supresión de tus datos personales, te rogamos que tengas en cuenta que estamos obligados a conservar dicha información bloqueada, a disposición de los Juzgados, Tribunales y Autoridades competentes, durante los plazos de prescripción establecidos legalmente para atender a las posibles responsabilidades de Iberia nacidas del tratamiento de tus datos.'
                                },
                                {
                                    'title': '¿Con quién compartimos tus datos personales?',
                                    'description': 'Es posible que compartamos tus datos personales con las compañías de nuestro Grupo de Empresas o “Grupo IAG”, lo que incluye a International Consolidated Airlines Group S.A. (IAG), British Airways, Iberia Express, Vueling, Aer Lingus, OpenSkies, British Airways Holidays, Avios Group Ltd, BA CityFlyer, IAG Connect e IAG GBS. Para más información sobre nuestro grupo, visita la web de nuestra matriz IAG en www.iairgroup.com .Podemos compartir información con dichas compañías para que nos puedan ayudar a la hora de prestarte servicios y conocerte mejor. Por ejemplo, si has volado con alguna de las otras compañías del grupo IAG o perteneces a alguno de los programas de fidelización de dichas compañías, podremos usar dicha información para conocer mejor el tipo de servicios de viaje en los que sea probable que estés interesado.Únicamente recibirás correos electrónicos comerciales de otras compañías de nuestro grupo cuando hayas prestado tu consentimiento a dichas compañías.También es posible que revelemos tus datos personales a los siguientes terceros, para los fines descritos a continuación:Autoridades aduaneras y de inmigración de cualquier país comprendido en tu itinerario o sobre cuyo espacio aéreo pueda operar tu vuelo. Iberia y las demás compañías aéreas están obligadas por las leyes de la UE, EE.UU. y otros países, a proporcionar a las autoridades de control fronterizo y a las autoridades aduaneras, acceso a la información sobre reservas y viaje, cuando el vuelo tenga destino u origen en dichos países, incluyendo escalas, y cuando los sobrevueles para llegar a tu destino. Ejemplo: si tu vuelo implica volar sobre EE. UU., dicha información será suministrada a las autoridades competentes de EE. UU.Compañías aéreas y otros proveedores de servicios que sean necesarios para la prestación de los servicios que hayas solicitado cuando, por ejemplo, parte de tu itinerario de viaje incluya un vuelo operado por una compañía aérea distinta o incluya determinados servicios relacionados con tu vuelo que hayas decidido contratar. Dichas compañías aéreas y proveedores de servicios serán identificados en el momento en que hagas una reserva y se te informará de la comunicación de datos que es necesario realizar con carácter previo o simultáneo a la realización de dicha comunicación. La voluntad mostrada por tu parte de contratar tales servicios con terceros tendrá la consideración de consentimiento expreso por tu parte para llevar a cabo dicha comunicación de datos. Iberia sigue unos criterios estrictos de selección de proveedores de servicios con el fin de dar cumplimiento a tus obligaciones en materia de protección de datos y se compromete a suscribir con ellos el correspondiente contrato de tratamiento de datos mediante el que les impondrá, entre otras, las siguientes obligaciones: aplicar medidas técnicas y organizativas apropiadas; tratar los datos personales para las finalidades pactadas y atendiendo únicamente a las instrucciones documentadas de Iberia; y suprimir o devolver los datos a Iberia una vez finalice la prestación de los servicios.Ejemplos: Si tu destino conlleva hacer un transbordo desde un vuelo de Iberia a otro operado por otra compañía aérea diferente, perteneciente o no al Grupo IAG. Si reservas un billete a través de nuestro portal de internet para realizar un viaje con un servicio de transporte con reserva previa, proporcionaremos tu nombre y dirección de correo electrónico a la compañía de transporte para que pueda emitir tu billete y hacer tu reserva Si contratas con Bag On Board (“BOB”) el servicio de recogida a domicilio, transporte y facturación de equipaje disponible para ciertos vuelos de Iberia, deberemos facilitar a dicha compañía los datos necesarios para que dicha entidad pueda gestionar la relación contractual que le hayas solicitado. Nuestras compañías aéreas asociadas y franquiciadas (como por ejemplo Air Nostrum Líneas Aéreas del Mediterráneo, S.A., o \'Air Nostrum\'), por ejemplo, para facilitar tus vuelos de conexión o para gestionar beneficios derivados de la colaboración entre programas de fidelización. Asimismo, agencias de viajes y otros terceros a través de los cuales reserves viajes. Si eres miembro de los Programas ON BUSINESS o de IBERIA PLUS o de algún otro programa de fidelización asociado como, por ejemplo, los pertenecientes a otras compañías aéreas de la ALIANZA ONEWORLD, compartiremos información con nuestros socios para que podamos gestionar los beneficios conjuntos del programa de fidelización a los que tengas derecho. Puedes saber más acerca de los miembros de OneWorld a través de la web oficial https://es.oneworld.com/ Compañías de tarjetas de crédito y débito, agencias de informes de crédito y proveedores de servicios de control de fraude, para procesar pagos y (cuando sea necesario) realizar controles de fraude. En respuesta a peticiones legales y válidas de gobiernos y fuerzas del orden, tales como autoridades aduaneras y de inmigración o de lucha contra el fraude y los grandes delitos. Debes tener en cuenta que, por motivos de control y salvaguarda de la seguridad pública, Iberia estará facultada a comunicar tus datos como pasajero a las Autoridades Gubernamentales de Control de la Seguridad Interna del país de origen, tránsito o destino en cualquier momento antes de tu llegada, con dicha finalidad. Estados Unidos exige también está información para los aviones que sobrevuelan su espacio aéreo. Esta información podrá ser facilitada también a otros Estados que, en virtud de lo dispuesto en las leyes o tratados aplicables, exijan la misma para el sobrevuelo de su espacio aéreo.Proveedores de servicios externos que contratemos para prestar servicios, como por ejemplo, para llevar a cabo iniciativas de marketing o realizar encuestas a clientes en nuestro nombre. Terceros, tales como despachos de abogados y tribunales, para exigir el cumplimiento o la aplicación de un contrato contigo. Terceros, tales como la policía y autoridades reguladoras, para proteger nuestros derechos, propiedades, o la seguridad de nuestros clientes, empleados y activos.Cuando sea necesario para cumplir una obligación legal en cualquier jurisdicción, incluyendo cuando dicha obligación traiga causa de una acción u omisión de Iberia (por ejemplo, nuestra decisión de operar en un determinado país o una decisión relacionada con la misma) No comercializamos tus datos personales a terceros y solo permitimos que terceros ajenos te envíen comunicaciones comerciales si has prestado tu consentimiento para ello.'
                                },
                                {
                                    'title': '¿A qué países se enviarán tus datos personales?',
                                    'description': 'Tus datos personales podrán ser enviados a terceros que estén situados fuera del país en el que te encuentres y fuera del Espacio Económico Europeo.La naturaleza de nuestro negocio conlleva que con frecuencia sea necesario enviar tus datos personales fuera del Espacio Económico Europeo para gestionar los servicios relacionados con tu viaje, sea para cumplir con nuestra relación contractual contigo según lo convenido, sea para cumplir con las obligaciones legales a las que Iberia está sujeta como compañía aérea, todo ello en los términos que se han explicado anteriormente en el apartado “¿Para qué utilizamos tus datos personales y bajo qué fundamentos?”.Esto ocurre porque nuestro negocio y los terceros identificados en el apartado “¿Con quién compartimos sus datos personales?” realizan operaciones en países de todo el mundo. Por ejemplo, cuando vueles fuera del Espacio Económico Europeo, tus datos personales serán transferidos a autoridades de control fronterizo e inmigración situadas fuera de dichos territorios.Asimismo, podremos transferir tus datos personales a terceros que estén situados fuera del país en el que te encuentres, para que nos presten servicios relacionados con los productos y servicios que has solicitado.Ejemplo: necesitaremos facilitar acceso a nuestros sistemas de reserva y facturación al personal de nuestros agentes de handling que nos presten servicios fuera de España.'
                                },
                                {
                                    'title': 'Aviso legal para vuelos operados por OpenSkies',
                                    'description': 'De acuerdo con el Artículo L232-6 del Código de Seguridad Interna de Francia, te informamos que las compañías aéreas podrían transmitir datos sobre reservas/facturación y embarque recabados de sus pasajeros (PNR/API) a los servicios públicos y autoridades competentes de Francia para los fines y bajo las condiciones establecidas en el Decreto Nº 2014-1095 de fecha 26/09/2014.'
                                },
                                {
                                    'title': '¿Cuáles son tus derechos cuando nos facilitas tus datos?',
                                    'description': 'Puedes ejercitar, si lo deseas, los derechos de acceso, rectificación y supresión de datos, así como solicitar que se limite el tratamiento de tus datos personales, oponerte al mismo, solicitar la portabilidad de tus datos, así como no ser objeto de decisiones individuales automatizadas a través de los siguientes medios:Si eres MIEMBRO DE IBERIA PLUS, puedes ejercer la mayoría de estos derechos a través de tu perfil online en www.iberia.com, accediendo a tu área privada de Iberia Plus en la sección \'Mi Perfil/Preferencias\'.Asimismo, si eres MIEMBRO DE ON BUSINESS, puedes igualmente ejercer la mayoría de estos derechos a través de tu perfil online en https://onbusiness.iberia.com, accediendo a tu área privada de empresa.Para ejercer el resto de tus derechos, o si NO ERES MIEMBRO DE IBERIA PLUS o de ON BUSINESS, puedes ejercer cada uno de los derechos antes mencionados a través del formulario online de gestión de derechos individuales de nuestra página web accesible a través de la ruta https://www.iberia.com/es/gestion-de-datos-personales/.Para poder atender tu solicitud deberás facilitarnos, en todo caso, la información y documentación que se requieren en el mencionado formulario como obligatorias:Tu nombre completo del solicitanteDocumento de identidadDatos de contacto (al menos, correo electrónico)Datos objeto de tu solitud.Cualquier dato que nos ayude a localizar los datos que sean objeto de tu solicitud, como por ejemplo localizador o números de vuelos y fechas.Una fotocopia de tu documento de identidad o pasaporte, para que podamos verificar tu identidad.Si presentas la solicitud en nombre de otra persona, será necesario que aportes una autorización firmada por dicha persona junto con su documento de identidad correspondiente. '
                                },
                                {
                                    'title': '¿Ante qué Autoridad de Protección de Datos puedes ejercitar tus reclamaciones?',
                                    'description': 'En cualquier caso podrás presentar una reclamación ante la Agencia Española de Protección de Datos, especialmente cuando no hayas obtenido satisfacción en el ejercicio de tus derechos, a través de la web www.agpd.es.'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        'warningMessages': {
            'status': false,
            'messages': {
            }
        }
    };

    var mockCurrency = {
        'price': {
            'currency': 'EUR'
        }
    };

    var mockFareFamily = [
        {
            'selectedSliceIndex': 0,
            'selectedSlicesLength': 0,
            'cabin': 'E',
            'originDestinationId': 'ODI_0',
            'origin': 'MAD',
            'destination': 'OVD',
            'info': {
                'sliceId': '4',
                'arrivalDateTime': '2020-02-12 08:45',
                'departureDateTime': '2020-02-12 07:35',
                'segments': [
                    {
                        'segmentId': 'IB047820200212',
                        'departureDateTime': '2020-02-12 07:35',
                        'arrivalDateTime': '2020-02-12 08:45',
                        'departure': {
                            'code': 'MAD',
                            'name': 'Madrid',
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
                            'code': 'OVD',
                            'name': 'Asturias',
                            'terminal': '',
                            'city': {
                                'code': 'OVD',
                                'description': 'Asturias-Oviedo',
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
                            'marketingFlightNumber': '0478',
                            'operationalFlightNumber': '0478',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '32A',
                                'description': 'Airbus A320'
                            }
                        },
                        'overnight': false,
                        'waitingTime': 0,
                        'duration': 70,
                        'delayInformation': null,
                        'stop': null,
                        'durationParsed': '1h 10min.',
                        'waitingTimeParsed': '',
                        'departureDateTimeParsed': '07:35',
                        'departureDateParsed': {
                            'dateTime': '07:35',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'hour': 1,
                            'minutes': 0,
                            'day': 12,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'formatedDate': '2020-02-12 07:35'
                        },
                        'arrivalDateTimeParsed': '08:45',
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
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
                        }
                    }
                ],
                'duration': 70,
                'cashAvios': true,
                'overnight': false,
                'stopsNumber': 0,
                'bestPrice': false,
                'cabins': {
                    'E': {
                        'bestPrice': 66.46,
                        'bestPriceDiscount': null,
                        'bestPriceDiscountShown': null,
                        'bestPriceShown': '66€',
                        'cabinDescription': 'Turista',
                        'cabinAvailable': true,
                        'isCabinCompatible': true,
                        'fareFamilies': [
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'TBAESES',
                                'commercialName': 'Básica',
                                'commercialNameES': 'Básica',
                                'priority': 900,
                                'conditions': [
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
                                            'observationCode': '2'
                                        },
                                        'key': 0,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'text': 'No incluido.',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Sin equipaje en bodega',
                                            'message': 'No incluido. ',
                                            'code': 'CA_1_PIEZAS_PAGO',
                                            'conditionStatus': false,
                                            'observationCode': '1'
                                        },
                                        'key': 1,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'text': 'De pago.',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Seleccionable con coste',
                                            'message': 'De pago. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                            'code': 'CA_Asiento_Pago',
                                            'conditionStatus': false,
                                            'observationCode': '3'
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                        'units': 65,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                            'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'No permitido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Reembolso no permitido',
                                            'message': 'No permitido.',
                                            'code': 'CA_REEMBOLSO NO PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 5,
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
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'De pago',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Seleccionable con coste',
                                            'message': 'De pago',
                                            'code': 'CA_Asiento_XL_Pago',
                                            'conditionStatus': false,
                                            'observationCode': '3'
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
                                        'key': 13,
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
                                        'key': 14,
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
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'No',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'No',
                                            'code': 'CA_Embarque_NO_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
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
                                        'key': 17,
                                        'previewStatus': false
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
                                    },
                                    {
                                        'observationCode': 3,
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
                                'isCompatibleFare': true,
                                'farePrice': 132.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 66.46,
                                'farePriceShown': '66€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_01',
                                                'price': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_02',
                                                'price': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 90,
                                                    'tax': 42.92,
                                                    'total': 132.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 45,
                                                    'tax': 21.46,
                                                    'total': 66.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'TBAESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'Q',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'QZNOB5',
                                                                'extendedFareCode': 'QZNOB5',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_2',
                                        'privateFare': true,
                                        'offerType': '',
                                        'price': {
                                            'fare': 90,
                                            'tax': 42.92,
                                            'total': 132.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            },
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'TCLESES',
                                'commercialName': 'Óptima',
                                'commercialNameES': 'Óptima',
                                'priority': 700,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'text': 'Gratuita desde 24 horas antes del vuelo. ',
                                        'units': 24,
                                        'extendedInfo': {
                                            'title': 'Gratuita desde 24 horas antes del vuelo. ',
                                            'message': 'Gratuita desde 24 horas antes del vuelo. ',
                                            'code': 'CA_Asiento_Gratis_24_horas',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                        'units': 45,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste 45€. No Show no permite cambio',
                                            'message': 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                            'code': 'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'No permitido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Reembolso no permitido',
                                            'message': 'No permitido.',
                                            'code': 'CA_REEMBOLSO NO PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 5,
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
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'De pago',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Seleccionable con coste',
                                            'message': 'De pago',
                                            'code': 'CA_Asiento_XL_Pago',
                                            'conditionStatus': false,
                                            'observationCode': '3'
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
                                        'key': 13,
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
                                        'key': 14,
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
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'No',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'No',
                                            'code': 'CA_Embarque_NO_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
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
                                        'key': 17,
                                        'previewStatus': false
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
                                    },
                                    {
                                        'observationCode': 3,
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
                                'isCompatibleFare': true,
                                'farePrice': 164.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 82.46,
                                'farePriceShown': '82€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IB1f08ef39262d484d883dff100f7a60d9OP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IB1f08ef39262d484d883dff100f7a60d9OP_01',
                                                'price': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IB1f08ef39262d484d883dff100f7a60d9OP_02',
                                                'price': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 122,
                                                    'tax': 42.92,
                                                    'total': 164.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 61,
                                                    'tax': 21.46,
                                                    'total': 82.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'TCLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'Q',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'QZNOM5',
                                                                'extendedFareCode': 'QZNOM5',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_3',
                                        'privateFare': true,
                                        'offerType': '',
                                        'price': {
                                            'fare': 122,
                                            'tax': 42.92,
                                            'total': 164.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            },
                            {
                                'cabinType': 'E',
                                'cabinDescription': 'Turista',
                                'commercialCode': 'TFLESEU',
                                'commercialName': 'Flexible',
                                'commercialNameES': 'Flexible',
                                'priority': 500,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
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
                                            'code': 'CA_Asiento_Gratuito',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido',
                                            'message': 'Permitidos en cualquier momento',
                                            'code': 'CA_CAMBIO SIEMPRE',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitido en cualquier momento',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido',
                                            'message': 'Reembolso permitido en cualquier momento.',
                                            'code': 'CA_REEMBOLSO SIEMPRE',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 5,
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
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'Incluido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Con selección de asiento',
                                            'message': 'Incluido',
                                            'code': 'CA_Asiento_XL_Incluido',
                                            'conditionStatus': true,
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
                                        'key': 13,
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
                                        'key': 14,
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
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'No',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'No',
                                            'code': 'CA_Embarque_NO_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
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
                                        'key': 17,
                                        'previewStatus': false
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
                                'isCompatibleFare': true,
                                'farePrice': 493.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 291.46,
                                'farePriceShown': '291€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IB0ed805526d654b88a321dc012bf1f849OP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IB0ed805526d654b88a321dc012bf1f849OP_01',
                                                'price': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IB0ed805526d654b88a321dc012bf1f849OP_02',
                                                'price': {
                                                    'fare': 181,
                                                    'tax': 21.46,
                                                    'total': 202.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 451,
                                                    'tax': 42.92,
                                                    'total': 493.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 225.5,
                                                    'tax': 21.46,
                                                    'total': 246.96,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '1',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048020200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
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
                                                                'segmentId': 'IB047620200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
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
                                                                'segmentId': 'IB048820200212',
                                                                'fareFamily': 'TFLESEU',
                                                                'bookingCode': null,
                                                                'bookingClass': 'ECONOMY',
                                                                'rbd': 'K',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'KZNOS4',
                                                                'extendedFareCode': 'KZNOS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_11',
                                        'privateFare': true,
                                        'offerType': '',
                                        'price': {
                                            'fare': 451,
                                            'tax': 42.92,
                                            'total': 493.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            }
                        ],
                        'bestCabinsPrice': false
                    },
                    'B': {
                        'bestPrice': 221.46,
                        'bestPriceDiscount': null,
                        'bestPriceDiscountShown': null,
                        'bestPriceShown': '221€',
                        'cabinDescription': 'Business Class',
                        'cabinAvailable': true,
                        'isCabinCompatible': true,
                        'fareFamilies': [
                            {
                                'cabinType': 'B',
                                'cabinDescription': 'Business Class',
                                'commercialCode': 'BREESES',
                                'commercialName': 'Business Promocional',
                                'commercialNameES': 'Business Promocional',
                                'priority': 200,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
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
                                            'code': 'CA_Asiento_Gratuito',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                        'units': 60,
                                        'extendedInfo': {
                                            'title': 'Cambio permitido con coste',
                                            'message': 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                            'code': 'CA_CAMBIO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                                        'units': 90,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido con coste 90€. No Show no permitido',
                                            'message': 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                                            'code': 'CA_REEMBOLSO CON PENALTY_90EUR_NO_SHOW_NO_PERMITIDO',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 5,
                                        'previewStatus': true
                                    },
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
                                        },
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'Incluido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Con selección de asiento',
                                            'message': 'Incluido',
                                            'code': 'CA_Asiento_XL_Incluido',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 10,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Chek-in_desk_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 13,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Acceso a salas VIP permitido',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 14,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Fast Track SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'Sí, grupo 1',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'CA_Embarque_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Entrega_prioritaria_equipaje_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 17,
                                        'previewStatus': false
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
                                'isCompatibleFare': true,
                                'farePrice': 376.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 221.46,
                                'farePriceShown': '221€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IB3bc97882a17146a18491fdc95cfc754fOP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IB3bc97882a17146a18491fdc95cfc754fOP_01',
                                                'price': {
                                                    'fare': 200,
                                                    'tax': 21.46,
                                                    'total': 221.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IB3bc97882a17146a18491fdc95cfc754fOP_02',
                                                'price': {
                                                    'fare': 134,
                                                    'tax': 21.46,
                                                    'total': 155.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 334,
                                                    'tax': 42.92,
                                                    'total': 376.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 200,
                                                    'tax': 21.46,
                                                    'total': 221.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 167,
                                                    'tax': 21.46,
                                                    'total': 188.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '0',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048220200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
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
                                                                'segmentId': 'IB047620200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '3',
                                                        'remainingSeats': 8,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048820200212',
                                                                'fareFamily': 'BREESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'I',
                                                                'remainingSeats': 8,
                                                                'fareBasis': 'ID7OS4',
                                                                'extendedFareCode': 'ID7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_8',
                                        'privateFare': false,
                                        'offerType': '',
                                        'price': {
                                            'fare': 334,
                                            'tax': 42.92,
                                            'total': 376.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            },
                            {
                                'cabinType': 'B',
                                'cabinDescription': 'Business Class',
                                'commercialCode': 'BFLESES',
                                'commercialName': 'Business Flexible',
                                'commercialNameES': 'Business Flexible',
                                'priority': 200,
                                'conditions': [
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
                                        },
                                        'key': 0,
                                        'previewStatus': true
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
                                        },
                                        'key': 1,
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
                                            'code': 'CA_Asiento_Gratuito',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 3,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'text': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                        'units': 50,
                                        'extendedInfo': {
                                            'title': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                            'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                                            'code': 'CA_CAMBIOS PERMITIDOS_NO_SHOW_50€',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 4,
                                        'previewStatus': true
                                    },
                                    {
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'text': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                        'units': 75,
                                        'extendedInfo': {
                                            'title': 'Reembolso permitido',
                                            'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                            'code': 'CA_REEMBOLSO SIEMPRE_NO_SHOW_75€',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 5,
                                        'previewStatus': true
                                    },
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
                                        },
                                        'key': 6,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL(emergencia)',
                                        'text': 'Incluido',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': 'Con selección de asiento',
                                            'message': 'Incluido',
                                            'code': 'CA_Asiento_XL_Incluido',
                                            'conditionStatus': true,
                                            'observationCode': null
                                        },
                                        'key': 10,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Chek-in_desk_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 13,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Acceso a salas VIP permitido',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 14,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'text': 'Sí',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'Fast Track SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 15,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EMBARQUE',
                                        'name': 'Embarque  prioritario',
                                        'text': 'Sí, grupo 1',
                                        'units': 1,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Sí',
                                            'code': 'CA_Embarque_Prioritario',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 16,
                                        'previewStatus': false
                                    },
                                    {
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'text': 'Si',
                                        'units': null,
                                        'extendedInfo': {
                                            'title': '',
                                            'message': 'Si',
                                            'code': 'Entrega_prioritaria_equipaje_ SI',
                                            'conditionStatus': false,
                                            'observationCode': null
                                        },
                                        'key': 17,
                                        'previewStatus': false
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
                                'isCompatibleFare': true,
                                'farePrice': 493.92,
                                'fareDiscountPriceToCalculate': null,
                                'farePriceToCalculate': 291.46,
                                'farePriceShown': '291€',
                                'fareDiscountPriceShown': null,
                                'fareCurrency': 'EUR',
                                'remainingSeats': 9,
                                'offers': [
                                    {
                                        'offerId': 'IBca7a5c110ca2454588a42704279b1353OP',
                                        'offerItems': [
                                            {
                                                'offerItemId': 'IBca7a5c110ca2454588a42704279b1353OP_01',
                                                'price': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'ADULT_01'
                                                ],
                                                'privateFareInformation': null
                                            },
                                            {
                                                'offerItemId': 'IBca7a5c110ca2454588a42704279b1353OP_02',
                                                'price': {
                                                    'fare': 181,
                                                    'tax': 21.46,
                                                    'total': 202.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'passengerIds': [
                                                    'CHILD_01'
                                                ],
                                                'privateFareInformation': null
                                            }
                                        ],
                                        'originDestinations': [
                                            {
                                                'priceDiscountApplied': false,
                                                'totalPrice': {
                                                    'fare': 451,
                                                    'tax': 42.92,
                                                    'total': 493.92,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'adultPrice': {
                                                    'fare': 270,
                                                    'tax': 21.46,
                                                    'total': 291.46,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'perPassengerPrice': {
                                                    'fare': 225.5,
                                                    'tax': 21.46,
                                                    'total': 246.96,
                                                    'currency': 'EUR',
                                                    'ticketingFee': 0
                                                },
                                                'originDestinationId': 'ODI_0',
                                                'applicableSlices': [
                                                    {
                                                        'sliceId': '4',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB047820200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '0',
                                                        'remainingSeats': 9,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048220200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'sliceId': '1',
                                                        'remainingSeats': 2,
                                                        'segments': [
                                                            {
                                                                'segmentId': 'IB048020200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 2,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
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
                                                                'segmentId': 'IB047620200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
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
                                                                'segmentId': 'IB048820200212',
                                                                'fareFamily': 'BFLESES',
                                                                'bookingCode': null,
                                                                'bookingClass': 'BUSINESS',
                                                                'rbd': 'D',
                                                                'remainingSeats': 9,
                                                                'fareBasis': 'DD7OS4',
                                                                'extendedFareCode': 'DD7OS4',
                                                                'seatDisplays': null,
                                                                'cabinDescription': ''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'timeLimits': '2020-02-04T12:54:25.619',
                                        'specialDiscountsApplied': [

                                        ],
                                        'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_10',
                                        'privateFare': false,
                                        'offerType': '',
                                        'price': {
                                            'fare': 451,
                                            'tax': 42.92,
                                            'total': 493.92,
                                            'currency': 'EUR',
                                            'ticketingFee': 0
                                        }
                                    }
                                ],
                                'oBdiscount': false
                            }
                        ],
                        'bestCabinsPrice': false
                    }
                },
                'cabinsLength': 2,
                'showFares': true,
                'slicePrice': 66.46,
                'sliceCurrency': 'EUR',
                'durationParsed': '1h 10min.',
                'departureDateTimeParsed': '07:35',
                'departureDateParsed': {
                    'dateTime': '07:35',
                    'weekDay': 'WEEKDAY_WEDNESDAY',
                    'hour': 1,
                    'minutes': 0,
                    'day': 12,
                    'monthNumber': 2,
                    'month': 'MONTH_FEBRUARY',
                    'year': 2020,
                    'formatedDate': '2020-02-12 07:35'
                },
                'arrivalDateTimeParsed': '08:45',
                'daysOfTravel': 0,
                'allOperatedBy': [
                    'Iberia'
                ],
                'technicalStop': 0,
                'sliceURL': '/aerolineas/logo_pos_IB.svg',
                'maxSlicePrice': 221.46,
                'showedCabin': 'E',
                'selectedCabin': 'E',
                'selectedFareFamily': {
                    'cabinType': 'E',
                    'cabinDescription': 'Turista',
                    'commercialCode': 'TBAESES',
                    'commercialName': 'Básica',
                    'commercialNameES': 'Básica',
                    'priority': 900,
                    'conditions': [
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
                                'observationCode': '2'
                            },
                            'key': 0,
                            'previewStatus': true
                        },
                        {
                            'code': 'EQBODEGA',
                            'name': 'Equipaje en bodega',
                            'text': 'No incluido.',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Sin equipaje en bodega',
                                'message': 'No incluido. ',
                                'code': 'CA_1_PIEZAS_PAGO',
                                'conditionStatus': false,
                                'observationCode': '1'
                            },
                            'key': 1,
                            'previewStatus': true
                        },
                        {
                            'code': 'ASIENTO',
                            'name': 'Selección de asiento',
                            'text': 'De pago.',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Seleccionable con coste',
                                'message': 'De pago. <a target=\'_blank\' href=\'http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\'>Política de reserva anticipada de asientos</a>',
                                'code': 'CA_Asiento_Pago',
                                'conditionStatus': false,
                                'observationCode': '3'
                            },
                            'key': 3,
                            'previewStatus': true
                        },
                        {
                            'code': 'CAMBIO',
                            'name': 'Cambios',
                            'text': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'units': 65,
                            'extendedInfo': {
                                'title': 'Cambio permitido con coste',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                'code': 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                'conditionStatus': false,
                                'observationCode': null
                            },
                            'key': 4,
                            'previewStatus': true
                        },
                        {
                            'code': 'REEMBOLSO',
                            'name': 'Reembolso (por sentido)',
                            'text': 'No permitido',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Reembolso no permitido',
                                'message': 'No permitido.',
                                'code': 'CA_REEMBOLSO NO PERMITIDO',
                                'conditionStatus': false,
                                'observationCode': null
                            },
                            'key': 5,
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
                            'key': 6,
                            'previewStatus': false
                        },
                        {
                            'code': 'ASIENTOXL',
                            'name': 'Selección de asiento XL(emergencia)',
                            'text': 'De pago',
                            'units': null,
                            'extendedInfo': {
                                'title': 'Seleccionable con coste',
                                'message': 'De pago',
                                'code': 'CA_Asiento_XL_Pago',
                                'conditionStatus': false,
                                'observationCode': '3'
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
                            'key': 13,
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
                            'key': 14,
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
                            'key': 15,
                            'previewStatus': false
                        },
                        {
                            'code': 'EMBARQUE',
                            'name': 'Embarque  prioritario',
                            'text': 'No',
                            'units': null,
                            'extendedInfo': {
                                'title': '',
                                'message': 'No',
                                'code': 'CA_Embarque_NO_Prioritario',
                                'conditionStatus': false,
                                'observationCode': null
                            },
                            'key': 16,
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
                            'key': 17,
                            'previewStatus': false
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
                        },
                        {
                            'observationCode': 3,
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
                    'isCompatibleFare': true,
                    'farePrice': 132.92,
                    'fareDiscountPriceToCalculate': null,
                    'farePriceToCalculate': 66.46,
                    'farePriceShown': '66€',
                    'fareDiscountPriceShown': null,
                    'fareCurrency': 'EUR',
                    'remainingSeats': 9,
                    'offers': [
                        {
                            'offerId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP',
                            'offerItems': [
                                {
                                    'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_01',
                                    'price': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'passengerIds': [
                                        'ADULT_01'
                                    ],
                                    'privateFareInformation': null
                                },
                                {
                                    'offerItemId': 'IBb8355e0940d44a23b0388e4c1e4f656eOP_02',
                                    'price': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'passengerIds': [
                                        'CHILD_01'
                                    ],
                                    'privateFareInformation': null
                                }
                            ],
                            'originDestinations': [
                                {
                                    'priceDiscountApplied': false,
                                    'totalPrice': {
                                        'fare': 90,
                                        'tax': 42.92,
                                        'total': 132.92,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'adultPrice': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'perPassengerPrice': {
                                        'fare': 45,
                                        'tax': 21.46,
                                        'total': 66.46,
                                        'currency': 'EUR',
                                        'ticketingFee': 0
                                    },
                                    'originDestinationId': 'ODI_0',
                                    'applicableSlices': [
                                        {
                                            'sliceId': '4',
                                            'remainingSeats': 9,
                                            'segments': [
                                                {
                                                    'segmentId': 'IB047820200212',
                                                    'fareFamily': 'TBAESES',
                                                    'bookingCode': null,
                                                    'bookingClass': 'ECONOMY',
                                                    'rbd': 'Q',
                                                    'remainingSeats': 9,
                                                    'fareBasis': 'QZNOB5',
                                                    'extendedFareCode': 'QZNOB5',
                                                    'seatDisplays': null,
                                                    'cabinDescription': ''
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            'timeLimits': '2020-02-04T12:54:25.619',
                            'specialDiscountsApplied': [

                            ],
                            'providerOfferId': 'OFE_c628f47c-0c64-4ead-b5e9-2bada211818a_2',
                            'privateFare': true,
                            'offerType': '',
                            'price': {
                                'fare': 90,
                                'tax': 42.92,
                                'total': 132.92,
                                'currency': 'EUR',
                                'ticketingFee': 0
                            }
                        }
                    ],
                    'oBdiscount': false
                }
            },
            'articleOffset': 204,
            'transformOffset': 0,
            'heightHeadingFlight': 0,
            'available': true,
            'originCountry': 'ES',
            'destinationCountry': 'ES'
        }
    ];
    let mockAssociates = {
        data:{
            associates: [
                {
                    person: {
                        dateOfBirth: '22/11/1998',
                        personName: {
                            familyName: 'test',
                            secondFamilyName: 'test',
                            title: 'test'
                        }
                    },
                    memberIdentifier: '445425',
                    relation: '',
                    programmeIdentifier: ''
                }
            ]
        }
    }
    let fakeCommonsUserUtilsService = {
        isSoftUser: jasmine.createSpy(),
        isIbPlus: jasmine.createSpy()
    };
    let fakeCommonsUtilService = {
        translateTextAndAddVariablesArray: jasmine.createSpy(),
        translateTextAndAddVariable: jasmine.createSpy()
    };
    let fakeDatalayerBKIService = {
        generateDigitalDataPassengers: jasmine.createSpy()
    };
    let fakeIbCTokenUtilsService = {
        getFrequentFlyerFromToken: jasmine.createSpy()
    };
    const fakeIbBookingPassengerInfoUtilsService = {
        addTravelDocs: jasmine.createSpy('addTravelDocs')
    }
    let fakeWindow = {
        location: {
            origin: 'www.iberia.com',
            pathname:'/availability',
            search: '?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=SDR&END_CITY_01=MAD&BEGIN_DAY_01=21&BEGIN_MONTH_01=202301&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESSDRMAD28122200002101232140'
        },
        innerWidth: 0
    };
    let fakeDiscountsInfoStorage = require('../../../../mocks/Responses/PassengersLoggedUserDiscountsInfoData-mock.json');

    const mockTravelDocuments = {
        documents: [
            {
                document_type: 'DN',
                document_number: '50555986T'
            }
        ]
    }

    beforeEach(function () {
        fakeSessionStorage = new StorageServiceMock();
        angular.mock.module('ib-booking-passenger-info-module', 'LocalStorageModule', 'ib-commons-utils-module', 'ib-booking-filters-module', 'pascalprecht.translate', function ($provide) {
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('ContentPreprocessorService', fakeContentPreprocessorService);
            $provide.value('BookingPassengerInfoConstants', fakeBookingPassengerInfoConstants);
            $provide.value('$sce', fakesce);
            $provide.value('CommonsUtilsService', fakeCommonsUtilsService);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('CommonsCookiesService', fakeCommonsCookiesService);
            $provide.value('$cookies', fakeCookies);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DatalayerBKIService', fakeDatalayerBKIService);
            $provide.value('IbCTokenUtilsService', fakeIbCTokenUtilsService);
            $provide.value('$window', fakeWindow);
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('IbBookingPassengerInfoUtilsService', fakeIbBookingPassengerInfoUtilsService);
        });
        inject(function (_BookingPassengerInfoTransformer_, $rootScope, _localStorageService_, $filter) {
            BookingPassengerInfoTransformer = _BookingPassengerInfoTransformer_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            dateFormatFilter = $filter('DateFormatFilter', {});
            translateFilter = $filter('translate', {});
            const retrieveMembers = require('../../../../../cypress/fixtures/retrieve-member-detail-v2.json');
            fakeSessionStorage.set('memeberDetails', [{ data: retrieveMembers }]);
            if (typeof Array.prototype.find !== 'function') {
                Array.prototype.find = function(iterator) {
                    var list = Object(this);
                    var length = list.length >>> 0;
                    var thisArg = arguments[1];
                    var value;

                    for (var i = 0; i < length; i++) {
                        value = list[i];
                        if (iterator.call(thisArg, value, i, list)) {
                            return value;
                        }
                    }
                    return undefined;
                };
            }
        });
    });

    describe('When transformSecurityInfoPassengerData is called', function () {

        beforeEach(inject(function () {
            localStorageService.set('fareData', mockFareData);
            localStorageService.set('customerData', mockCustomerData);
            localStorageService.set('membershipData', fakeMemberShipData);
            localStorageService.set('bookingUrlParams', fakeBookingUrlParams);
            localStorageService.set('loggedUserDiscountsInfo', fakeDiscountsInfoStorage);
        }));

        // Usuario loggeado
        it('transform return correctly security info passenger data when user is logged', function (done) {
            localStorageService.set('userLogged', true);
            var returnData = BookingPassengerInfoTransformer.transformSecurityInfoPassengerData(mockSecurityInfo, mockPrefixes, mockGdpr, mockFareData,{},{}, fakeDiscountsInfoStorage, mockTravelDocuments);
            expect(returnData.transformedSecurityInfoPassengerData.isResident).toEqual(true);
            done();
        });
        it('transform return correctly security info passenger data when user is logged and large family code is not Balearic Islands', ()=> {
            const mockDiscount = {
                familyDiscount: {
                    familyType: "F2",
                    documentNumber: "11111111111",
                    communityCode: {
                        value: "462508",
                        description: "Valencia"
                    }
                }
            }
            const mockRequiredFields = [{
                field:'COMMUNITY_CODE',
                values:[{
                    code: '462508',
                    description: 'Valencia'
                }]
            }]
            localStorageService.set('userLogged', true);
            var returnData = BookingPassengerInfoTransformer.transformSecurityInfoPassengerData({...mockSecurityInfo, requiredFieldsOptions:mockRequiredFields}, mockPrefixes, mockGdpr, mockFareData,{},{}, mockDiscount);
            expect(returnData.transformedSecurityInfoPassengerData.isResident).toEqual(true);
        });
        // Usuario ONB
        it('transform return correctly security info passenger data when user is ONB', function (done) {
            localStorageService.set('userLogged', 'ONB');
            var returnData = BookingPassengerInfoTransformer.transformSecurityInfoPassengerData(mockSecurityInfo, mockPrefixes, mockGdpr, mockFareData,{},{});
            expect(returnData.transformedSecurityInfoPassengerData.frequentlyPassengers).toBeDefined();
            done();
        });
    });

    describe('When transformUpdatePassengerInfoData is called', function () {

        beforeEach(inject(function () {
            localStorageService.set('fareData', mockFareData);
            localStorageService.set('confirmationDatalayerInfo', mockConfirmationDatalayerInfo);
        }));
        it('transform return correctly info passenger data when form is submitted', function (done) {
            var returnData = BookingPassengerInfoTransformer.transformUpdatePassengerInfoData(mockPassengerFormData, null);
            expect(returnData.shoppingResponseId).toBe('Qm9va2luZ0BHVy0xNTc1OTY3OTU4MzczLVVoSFgw');
            expect(returnData).toBeDefined();
            done();
        });

    });

    describe('When arePassengersBirthDatesValid is called', function () {

        beforeEach(inject(function () {
            localStorageService.set('fareData', mockFareData);
        }));
        it('checks if the infant and child passengers birth dates are correct', function (done) {
            var returnData = BookingPassengerInfoTransformer.arePassengersBirthDatesValid(mockPassengerInfo);
            expect(returnData).toBeTruthy();
            done();
        });
    });

    describe('When getOnHoldOptionsInfo is called', function () {

        it('return onHoldInfo', function (done) {
            var onHoldOptions = {}, i;
            var onHoldShowInfo = false;
            var textsToReplace = [];
            var variablesToAdd = [];
            var returnData = BookingPassengerInfoTransformer.getOnHoldOptionsInfo(mockOnHoldOptions,mockCurrency);
            expect(returnData).toBeTruthy();
            done();
        });
    });



    describe('When cleanErrorResidents is called', function () {

        it('Clean list resident errors on passengers', function (done) {
            BookingPassengerInfoTransformer.cleanErrorResidents(mockPassengerInfo.passengerInfo)
            expect(mockPassengerInfo.passengerInfo[0].options.resident.haveError).toEqual(false);
            done();
        });
    });

    describe('When createFlightReviewMonetate is called', function () {

        it('Create array/object to call addFlightReview Monetate API method', function (done) {
            var returnData = BookingPassengerInfoTransformer.createFlightReviewMonetate(fakeBookingUrlParams, mockPassengers, mockSelectedSlice, mockCurrency, mockFareFamily);
            expect(returnData[0]).toEqual('addFlightReview');
            expect(returnData[1].destination).toEqual(['OVD']);
            done();
        });
    });
    describe('When getAssociatesTransformed is called', function () {
        it('', function (done) {
            var returnData = BookingPassengerInfoTransformer.getAssociatesTransformed(mockAssociates);
            expect(returnData.beneficiaries[0]).toEqual({name:"CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK", isSelected:false, needsTranslate:true, type: "DEFAULT"});
            expect(returnData.beneficiaries[1].beneficiaryNumber).toEqual(1);
            expect(returnData.beneficiaries[1].birthDate).toEqual('22/11/1998');
            expect(returnData.beneficiaries[1].frequentFlyer).toEqual('445425');
            expect(returnData.beneficiaries[1].index).toEqual(0);
            expect(returnData.beneficiaries[1].isSelected).toEqual(false);
            expect(returnData.beneficiaries[1].name).toEqual(undefined);
            expect(returnData.beneficiaries[1].program).toEqual(null);
            expect(returnData.beneficiaries[1].relationship).toEqual('');
            expect(returnData.beneficiaries[1].relationshipDescription).toEqual(1);
            expect(returnData.beneficiaries[1].relationshipWebCode).toEqual(2);
            expect(returnData.beneficiaries[1].surname1).toEqual('test');
            expect(returnData.beneficiaries[1].surname2).toEqual('test');
            expect(returnData.beneficiaries[1].title).toEqual('test');
            expect(returnData.beneficiaries[1].type).toEqual('ADULT');
            done();
        });
    });
    describe('When TransCalcPointsData is called', function () {
        it('', function () {
            const data ={
                totalMonetaryAmount: [
                    {
                        currency:{
                            code: 'AVIOS'
                        },
                        amount: 2
                    },
                    {
                        currency:{
                            code: 'TIER_POINTS'
                        },
                        amount: 2
                    }
                ]
            }
            var returnData = BookingPassengerInfoTransformer.TransCalcPointsData(data);
            expect(returnData.Avios).toEqual(2);
            expect(returnData.Elite).toEqual(2);
        });
    });
    describe('When transformProfileRemindError is called', function () {
        it('', function () {
            const error ={
              errorCode:'test_001',
              data: {
                childError: [
                    {
                        code:'test_002'
                    }
                ]
              }
            }
            var returnData = BookingPassengerInfoTransformer.transformProfileRemindError(error);
            expect(returnData.code).toEqual('test_001');
            expect(returnData.reason).toEqual('test_002');
        });
    });
    describe('When transformPassengerInfoToSaveInLocalStorage is called', function () {
        it('', function () {
            const passengerInfoModel ={
                contactData: 'data',
                isResident: false,
                passengerInfo: 'info'
            }
            var returnData = BookingPassengerInfoTransformer.transformPassengerInfoToSaveInLocalStorage(passengerInfoModel);
            expect(returnData.contactData).toEqual('data');
            expect(returnData.isResident).toEqual(false);
            expect(returnData.passengers).toEqual('info');
        });
    });
    describe('When generateMetaUrl is called', function () {
        beforeEach(inject(function () {
            localStorageService.set('fareData', mockFareData);
        }));
        it(', it is flash offer flow and it is not metasearch', function () {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                return true
            })
            localStorageService.set('searchFlightType', 'availabilityFlight');
            var returnData = BookingPassengerInfoTransformer.generateMetaUrl();
            expect(returnData).toEqual({recoveryLink:'www.iberia.com/es/esundefined?MARKET=ES&FLASH_OFFER_TYPE=ACTIVE&undefined=undefined&BEGIN_CITY_01=LHR&END_CITY_01=MAD&FLASH_OFFER_ID=true&ADT=1&CHD=1&INF=1&&REFERRAL_ID=shoppingCartRecovery#!/FLASHD'});
        });
        it(', it is flash offer flow and it is metasearch', function () {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                return true
            })
            localStorageService.set('searchFlightType', 'metasearchFlight');
            var returnData = BookingPassengerInfoTransformer.generateMetaUrl();
            expect(returnData).toEqual({recoveryLink:'www.iberia.com?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=SDR&END_CITY_01=MAD&BEGIN_DAY_01=21&BEGIN_MONTH_01=202301&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESSDRMAD28122200002101232140&&REFERRAL_ID=shoppingCartRecovery#!/FLASHD'});
        });
        it(', it is not flash offer flow it is not metasearch', function () {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                return false
            })
            localStorageService.set('searchFlightType', 'availabilityFlight');
            var returnData = BookingPassengerInfoTransformer.generateMetaUrl();
            expect(returnData).toEqual({recoveryLink:'www.iberia.com/availability?market=ES&language=es&bookingMarket=ES&ADT=1&CHD=1&INF=1&YTH=0&YCD=0&BNN=undefined&&DisplayedPrice=346.75&DisplayedPriceCurrency=EUR&undefined=OneWay&NaN=1&NaN=ECONOMY&NaN=HZNNAOB6&NaN=H&NaN=IB&NaN=2019-12-19&NaN=LHR&NaN=MAD&NaN=3163&ReferralId=shoppingCartRecovery'});
        });
    });
    describe('When generateTravPrefReq is called', function () {
        it('', function () {
            localStorageService.set('travelPreferences',{blind:'',deaf:'',svan:'',wheelChair:''})
            const data ={
                specialVision: true,
                specialHearing: true,
                specialGuideDog: true,
                specialWheelchair: false,
                specialIntellDisability: true,
            }
            var returnData = BookingPassengerInfoTransformer.generateTravPrefReq(data);
            expect(returnData.blind).toBeTrue();
            expect(returnData.deaf).toBeTrue();
            expect(returnData.svan).toBeTrue();
            expect(returnData.dpna).toBeTrue();
            expect(returnData.wheelChair).toEqual('00');
        });
    });

});

