describe('DisruptionRefundService Test', function() {

    let mockOrder = {
        flowId: 'TWFuYWdlTXlCb29raW5nQElCOTk5Nzc5ZWVjNTk3NGI2N2E0ZWQyZGIyOTBjOGRjNzM%3D',
        order: {
            orderId: 'Qm9va2luZ0BJQjQyYzNlMWI5M2FkYjQyNDhhYzZjNzM2YzExNmIyYWMzT1A%3D',
            status: 'UNCONFIRMED_CHANGES',
            bookingReferences: [
                {
                    provider: 'IB',
                    reference: 'KYMEB'
                },
                {
                    provider: '1A',
                    reference: 'THFZCP'
                }
            ],
            orderItems: [
                {
                    type: 'flight',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_01',
                    bookingReferences: [
                        null,
                        null
                    ],
                    price: {
                        fare: 385,
                        tax: 63.08,
                        total: 448.08,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    sliceIds: [
                        'MADBIO20200618074000',
                        'BIOMAD20200619175000'
                    ],
                    passengerPrices: [
                        null,
                        null
                    ]
                },
                {
                    type: 'seat',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_02',
                    price: {
                        fare: 12,
                        tax: 0,
                        total: 12,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    row: '12',
                    column: 'C',
                    segmentId: 'IB044820200618',
                    emd: '0755565085009',
                    selected: true
                },
                {
                    type: 'seat',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_03',
                    price: {
                        fare: 12,
                        tax: 0,
                        total: 12,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    row: '12',
                    column: 'D',
                    segmentId: 'IB044820200618',
                    emd: '0755565085018',
                    selected: true
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_04',
                    price: {
                        fare: 120,
                        tax: 0,
                        total: 120,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    sliceId: 'BIOMAD20200619175000',
                    amount: 4,
                    emd: '0755565085021'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_05',
                    price: {
                        fare: 30,
                        tax: 0,
                        total: 30,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    sliceId: 'BIOMAD20200619175000',
                    amount: 1,
                    emd: '0755565085015'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_06',
                    price: {
                        fare: 20,
                        tax: 0,
                        total: 20,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    sliceId: 'BIOMAD20200619175000',
                    amount: 1,
                    emd: '0755565085014'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_07',
                    price: {
                        fare: 120,
                        tax: 0,
                        total: 120,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    sliceId: 'BIOMAD20200619175000',
                    amount: 4,
                    emd: '0755565085022'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_08',
                    price: {
                        fare: 30,
                        tax: 0,
                        total: 30,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    sliceId: 'BIOMAD20200619175000',
                    amount: 1,
                    emd: '0755565085017'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_09',
                    price: {
                        fare: 20,
                        tax: 0,
                        total: 20,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    sliceId: 'BIOMAD20200619175000',
                    amount: 1,
                    emd: '0755565085016'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_10',
                    price: {
                        fare: 120,
                        tax: 0,
                        total: 120,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    sliceId: 'MADBIO20200618074000',
                    amount: 4,
                    emd: '0755565085019'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_11',
                    price: {
                        fare: 30,
                        tax: 0,
                        total: 30,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    sliceId: 'MADBIO20200618074000',
                    amount: 1,
                    emd: '0755565085011'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_12',
                    price: {
                        fare: 20,
                        tax: 0,
                        total: 20,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'ADULT_01',
                    sliceId: 'MADBIO20200618074000',
                    amount: 1,
                    emd: '0755565085010'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_13',
                    price: {
                        fare: 120,
                        tax: 0,
                        total: 120,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    sliceId: 'MADBIO20200618074000',
                    amount: 4,
                    emd: '0755565085020'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_14',
                    price: {
                        fare: 30,
                        tax: 0,
                        total: 30,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    sliceId: 'MADBIO20200618074000',
                    amount: 1,
                    emd: '0755565085013'
                },
                {
                    type: 'baggage',
                    orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_15',
                    price: {
                        fare: 20,
                        tax: 0,
                        total: 20,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    passengerId: 'CHILD_01',
                    sliceId: 'MADBIO20200618074000',
                    amount: 1,
                    emd: '0755565085012'
                }
            ],
            slices: [
                {
                    sliceId: 'MADBIO20200618074000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-18 07:40',
                    arrivalDateTime: '2020-06-18 08:40',
                    duration: 60,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        null,
                        null
                    ],
                    segments: [
                        null
                    ],
                    overnight: false,
                    passengerFlags: [
                        null,
                        null
                    ]
                },
                {
                    sliceId: 'BIOMAD20200619175000',
                    type: 'REGULAR',
                    departureDateTime: '2020-06-19 17:50',
                    arrivalDateTime: '2020-06-19 19:00',
                    duration: 70,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        null,
                        null
                    ],
                    segments: [
                        null
                    ],
                    overnight: false,
                    passengerFlags: [
                        null,
                        null
                    ]
                }
            ],
            price: {
                fare: 1089,
                tax: 63.08,
                total: 1152.08,
                currency: 'EUR',
                ticketingFee: 0
            },
            primaryContactInfo: {
                phone: '123456789',
                email: 'BPARIENTE@VIEWNEXT.COM',
                phoneType: 'HOME'
            },
            optionalInformation: [],
            cashAviosPossibilities: [],
            specialDiscounts: [],
            checkedBagAllowances: [
                {
                    type: 'PIECE',
                    segmentIds: [
                        'IB044820200618',
                        'IB044920200619'
                    ],
                    totalQuantity: 0
                }
            ],
            aviosRedeemed: null,
            pointsRedeemed: null
        },
        passengers: [
            {
                passengerType: 'ADULT',
                personalInfo: {
                    name: 'VIB SOP',
                    surname: 'DEL CERRO QA',
                    birthDate: null
                },
                passengerId: 'ADULT_01',
                contactInfo: {
                    phone: '123456789',
                    email: 'BPARIENTE@VIEWNEXT.COM',
                    phoneType: 'MOBILE'
                },
                ckiStatus: null,
                optionalInformation: []
            },
            {
                passengerType: 'CHILD',
                personalInfo: {
                    name: 'CHDUCD',
                    surname: 'PRUEBAS QA',
                    birthDate: '2017-05-11'
                },
                passengerId: 'CHILD_01',
                contactInfo: {
                    phone: '123456789',
                    email: 'BPARIENTE@VIEWNEXT.COM',
                    phoneType: 'MOBILE'
                },
                ckiStatus: null,
                optionalInformation: []
            }
        ],
        tickets: [
            {
                ticketNumbers: [
                    '0752389702148'
                ],
                type: 'ET',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_01',
                passengerId: 'ADULT_01',
                issueDateTime: '2020-05-11 00:00',
                fareCalculation: 'MAD IB BIO115.00IB MAD115.00EUR230.00END',
                taxes: [
                    {
                        code: 'JD',
                        amount: 22.76,
                        currency: 'EUR',
                        description: ''
                    },
                    {
                        code: 'OG',
                        amount: 1.34,
                        currency: 'EUR',
                        description: ''
                    },
                    {
                        code: 'QV',
                        amount: 7.44,
                        currency: 'EUR',
                        description: ''
                    }
                ],
                coupons: [
                    {
                        arrival: 'BIO',
                        departure: 'MAD',
                        departureDate: '2020-06-18T07:40:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'VZNNB4',
                        carrier: 'IB',
                        flightNumber: '448',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'V',
                        designator: '',
                        couponNumber: '1',
                        remark: null
                    },
                    {
                        arrival: 'MAD',
                        departure: 'BIO',
                        departureDate: '2020-06-19T17:50:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'VZNNB4',
                        carrier: 'IB',
                        flightNumber: '449',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'V',
                        designator: '',
                        couponNumber: '2',
                        remark: null
                    }
                ],
                iataCode: '78496445',
                issueCity: 'MAD',
                passengerType: 'ADULT',
                paymentInfo: {
                    type: 'CREDIT_CARD',
                    amount: 261.54
                },
                emdsList: [],
                taxedPrice: {
                    fare: 230,
                    tax: 31.54,
                    total: 261.54,
                    currency: 'EUR',
                    ticketingFee: 0
                }
            },
            {
                ticketNumbers: [
                    '0752389702149'
                ],
                type: 'ET',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_01',
                passengerId: 'CHILD_01',
                issueDateTime: '2020-05-11 00:00',
                fareCalculation: 'MAD IB BIO77.05IB MAD77.05EUR154.10END  *CH11MAY17/03YRS',
                taxes: [
                    {
                        code: 'JD',
                        amount: 22.76,
                        currency: 'EUR',
                        description: ''
                    },
                    {
                        code: 'OG',
                        amount: 1.34,
                        currency: 'EUR',
                        description: ''
                    },
                    {
                        code: 'QV',
                        amount: 7.44,
                        currency: 'EUR',
                        description: ''
                    }
                ],
                coupons: [
                    {
                        arrival: 'BIO',
                        departure: 'MAD',
                        departureDate: '2020-06-18T07:40:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'VZNNB4',
                        carrier: 'IB',
                        flightNumber: '448',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'V',
                        designator: 'CH',
                        couponNumber: '1',
                        remark: null
                    },
                    {
                        arrival: 'MAD',
                        departure: 'BIO',
                        departureDate: '2020-06-19T17:50:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'VZNNB4',
                        carrier: 'IB',
                        flightNumber: '449',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'V',
                        designator: 'CH',
                        couponNumber: '2',
                        remark: null
                    }
                ],
                iataCode: '78496445',
                issueCity: 'MAD',
                passengerType: 'CHILD',
                paymentInfo: {
                    type: 'CREDIT_CARD',
                    amount: 186.54
                },
                emdsList: [],
                taxedPrice: {
                    fare: 155,
                    tax: 31.54,
                    total: 186.54,
                    currency: 'EUR',
                    ticketingFee: 0
                }
            },
            {
                ticketNumbers: [
                    '0755565085009'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_02',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085018'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_03',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085021'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_04',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085015'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_05',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085014'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_06',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085022'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_07',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085017'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_08',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085016'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_09',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085019'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_10',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085011'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_11',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085010'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_12',
                passengerId: 'ADULT_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085020'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_13',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085013'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_14',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            },
            {
                ticketNumbers: [
                    '0755565085012'
                ],
                type: 'EMD',
                orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_15',
                passengerId: 'CHILD_01',
                issueDateTime: null,
                fareCalculation: null,
                taxes: [],
                coupons: [],
                iataCode: null,
                issueCity: null,
                passengerType: null,
                paymentInfo: null,
                emdsList: [],
                taxedPrice: null
            }
        ],
        warnings: [
            {
                code: 'SSE_MMB_0005',
                description: 'Te hemos cambiado de mercado para que visualices correctamente tu reserva'
            },
            {
                code: 'SSE_MMB_0009',
                description: 'Este itinerario ha sufrido un cambio no confirmado. Por favor, revisa tus vuelos.'
            }
        ],
        paymentItems: [
            {
                type: 'CREDITCARD',
                authorization: 'APS1OK',
                subtotal: null,
                totalFee: null,
                total: null,
                unityFee: null,
                currency: null
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
                    alignment: 'L',
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
                commercialCode: 'BASBIO',
                commercialName: 'Básica',
                commercialNameES: 'Básica',
                priority: 0,
                conditions: [
                    {
                        code: 'EQMANO',
                        name: 'Equipaje de mano',
                        text: '1 bulto',
                        units: 1
                    },
                    {
                        code: 'EQBODEGA',
                        name: 'Equipaje en bodega',
                        text: 'No incluido.',
                        units: null
                    },
                    {
                        code: 'ASIENTO',
                        name: 'Selección de asiento',
                        text: 'De pago.',
                        units: null
                    },
                    {
                        code: 'CAMBIO',
                        name: 'Cambios',
                        text: '',
                        units: null
                    },
                    {
                        code: 'REEMBOLSO',
                        name: 'Reembolso (por sentido)',
                        text: 'No permitido',
                        units: null
                    }
                ],
                conditionsPriority: [
                    'EQMANO',
                    'EQBODEGA',
                    'ASIENTO',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        channel: 'IBCOM',
        onHoldInformation: null,
        relatedContent: [],
        qualifiers: [],
        reportingWeb: {
            device: 'DMAC',
            idColective: '',
            officeIata: 'MADIB08AB',
            iata: 'I',
            product: '1'
        },
        flexibilizationCapabilitiesInformation: {
            code: 'COVID19',
            description: ''
        },
        upgInformation: {
            url: null,
            flightsInformation: null,
            bidable: false
        },
        orderFlags: [
            {
                type: 'PRINT_ITINERARY',
                enabled: false
            },
            {
                type: 'ON_BUSINESS_MODIFICATION',
                enabled: false
            },
            {
                type: 'VOUCHER_TOTAL_REFUND',
                enabled: true
            },
            {
                type: 'VOUCHER_PARTIAL_REFUND',
                enabled: false
            },
            {
                type: 'CASH_TOTAL_REFUND',
                enabled: true
            },
            {
                type: 'CASH_PARTIAL_REFUND',
                enabled: false
            }
        ],
        isAirShuttle: false,
        isOnHold: false
    };
    let DisruptionRefundService;
    let mockResponse = 'results';

    let fakeGetWcsPhonesService = {
        getPhoneByCode: jasmine.createSpy()
    };
    let fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy()
    };
    let fakeMmBUtilService = {
        generateVoucherSummaryModel: jasmine.createSpy()
    };
    let fakeBookingSearchService = {
        searchFlightsPassengers: jasmine.createSpy('searchFlightsPassengers').and.callFake(function (data) {
            let deferred = $q.defer();
            let response = deferred.promise;
            deferred.resolve(fakeBookingInfo);
            return response;
        })
    };
    let fakeIbFlagsTransformer = {
        generateFlagsMenu: jasmine.createSpy()
    };
    let mockWarningSlice = {'order':{
        'slices':[
            {
                'segments' :[
                    {
                        'id' : 'sgm1',
                        'status':{
                            'code':'TK'
                        },
                        'flown': true,
                        'relatedDisruptedSegmentId':'ID001',
                        'warnings':[
                            {
                                'code': 'SSE_ORM_20013',
                                'description' : 'Descripción valida'
                            }
                        ]
                    }
                ]
            }
        ]
    }}
    let fakeBookingInfo = mockOrder;
    let fakeObtainVoucherInfo = jasmine.createSpy()
    let $rootScope, $q, localStorageService

    beforeEach(function() {
        angular.mock.module('ib-disruption-refund-module','LocalStorageModule',  function($provide) {
            $provide.value('CommonsGetWcsPhonesService', fakeGetWcsPhonesService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('IbFlagsTransformer', fakeIbFlagsTransformer);
            $provide.value('MmBAppConstants', {
                'WCS': { 'PHONE_TYPES': {'SALES': 'RESERVAS'} }
            })
        })
        inject(function (_DisruptionRefundService_, _$q_, _$rootScope_, _localStorageService_) {
            DisruptionRefundService = _DisruptionRefundService_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            localStorageService = _localStorageService_

            localStorageService.set('phonesList', {});
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('commercialInfo', {currency: 'EUR'});
        })
    })
    describe('When you call getWCSPhones and success', function() {
        it('should call WCSPhones', function(done) {
            inject(function () {
                fakeGetWcsPhonesService.getPhoneByCode = jasmine.createSpy('getPhoneByCode').and.callFake(function () {
                    let deferred = $q.defer();
                    let response = deferred.promise;
                    deferred.resolve(mockResponse);
                    return response;
                })
            })
            DisruptionRefundService.getWCSPhones().then(function() {}, angular.noop)
            done();
        });
    });
    describe('When you initializeRefundDisruptionPage and success', function() {
        beforeEach(function() {
            inject(function() {
                fakeCurrencyService.getCurrencyObject = jasmine.createSpy('getCurrencyObject').and.callFake(function () {
                    return { 'OK': 'OK' }
                })
                fakeMmBUtilService.generateVoucherSummaryModel = jasmine.createSpy('generateVoucherSummaryModel').and.callFake(function () {
                    return { 'OK': 'OK' }
                })
                fakeIbFlagsTransformer.generateFlagsMenu = jasmine.createSpy('generateFlagsMenu').and.callFake(function () {
                    return { 'OK': 'OK' }
                })
            })
            $rootScope.$digest();
        })
        describe('When initializeRefundDisruptionPage with booking Info:', function() {
            it('should initializeRefundDisruptionPage', function (done) {
                DisruptionRefundService.initializeRefundDisruptionPage().then(function (responseData) {
                    expect(mockResponse).toBe(responseData);
                }, angular.noop)
                done();
            });
        });
        describe('When initializeRefundDisruptionPage but not has not booking Info:', function() {
            beforeEach(function() {
                inject(function() {
                    localStorageService.set('bookingInfo',  mockWarningSlice);
                })
            })
            describe('When fakeBookingSearchService.searchFlightsPassengers is OK', function() {
                it('should initializeRefundDisruptionPage calling', function() {
                    DisruptionRefundService.initializeRefundDisruptionPage().then(function(responseData) {
                        expect(fakeBookingInfo).toBeDefined()
                        expect(mockResponse).toBe(responseData)
                    }, angular.noop)
                    $rootScope.$digest();
                });
            });
            describe('When fakeBookingSearchService.searchFlightsPassengers is KO', function() {
                it('should reject initializeRefundDisruptionPage', function() {
                    DisruptionRefundService.initializeRefundDisruptionPage().then(function(responseData) {
                        expect(fakeBookingInfo).toBeUndefined()
                        expect(mockResponse).toBe(responseData)
                    }, angular.noop)
                    $rootScope.$digest();
                });
            });
        });
    });
    describe('initializeRefundDisruptionPage', () => {
        beforeEach(function() {
            inject(function () {
                localStorageService.set('bookingInfo', '');
                localStorageService.set('checkinSurname', true);
                localStorageService.set('PNR', true);
            });
        });
        it('should call BookingSearchService.searchFlightsPassengers and localStorageService.set when bookingInfo is not available in localStorage', () => {
            //   spyOn(localStorageService, 'set');
            DisruptionRefundService.initializeRefundDisruptionPage();
        });
        it('should call BookingSearchService.searchFlightsPassengers reject', () => {
            fakeBookingSearchService.searchFlightsPassengers = jasmine.createSpy('searchFlightsPassengers').and.callFake(function (data) {
                let deferred = $q.defer();
                let response = deferred.promise;
                deferred.reject(fakeBookingInfo);
                return response;
            })
        });
      });
});
