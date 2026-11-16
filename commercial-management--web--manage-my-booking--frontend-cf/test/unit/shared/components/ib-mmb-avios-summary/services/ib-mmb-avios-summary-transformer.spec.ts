import { TestBed } from "@angular/core/testing";
import { IbMmbAviosSummaryTransformer } from "@src/app/shared/components/ib-MmB-avios-summary/services/ib-MmB-avios-summary-transformer";
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";

let flowApp = {
    MMB: 'MMB',
    MMBVC: 'MMBVC',
    MMBOH: 'MMBOH',
    CKI: 'CKI'
};

let generateResAviosSummaryModelRequest = {
    currency: {
        code: 'EUR'
    },
    flight: {
        yq: 0,
        slices: [
            {
                id: 'MADBIO20221021155500',
                segments: [
                    {
                        id: 'IB043820221021',
                        operatingCarrier: {
                            code: 'IB'
                        },
                        marketingCarrier: {
                            code: 'IB'
                        },
                        schedule: {
                            departureAirportCode: 'MAD',
                            arrivalAirportCode: 'BIO',
                            departureDate: '2022-10-21'
                        },
                        bookingClass: {
                            code: 'B'
                        },
                        bookingCabin: {
                            code: 'E'
                        }
                    }
                ]
            }
        ]
    },
    passengers: [
        {
            id: 'ADULT_01',
            flight: {
                slices: [
                    {
                        id: 'MADBIO20221021155500',
                        fare: 298,
                        totalFare: 298,
                        monetaryAmount: [
                            {
                                amount: 1490,
                                currency: {
                                    code: 'AVIOS'
                                }
                            },
                            {
                                amount: 50,
                                currency: {
                                    code: 'TIER_POINTS'
                                }
                            }
                        ]
                    }
                ],
                monetaryAmount: [
                    {
                        amount: 1490,
                        currency: {
                            code: 'AVIOS'
                        }
                    },
                    {
                        amount: 50,
                        currency: {
                            code: 'TIER_POINTS'
                        }
                    }
                ]
            },
            ancillaries: [
                {
                    type: 'BAGGAGE',
                    subType: 'BAGGAGE_15',
                    slices: [
                        {
                            id: 'MADBIO20221021155500',
                            amounts: [
                                {
                                    fare: 13,
                                    quantity: 2
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB043820221021'
                                }
                            ],
                            monetaryAmount: [
                                {
                                    amount: 130,
                                    currency: {
                                        code: 'AVIOS'
                                    }
                                }
                            ]
                        }
                    ],
                    monetaryAmount: [
                        {
                            amount: 130,
                            currency: {
                                code: 'AVIOS'
                            }
                        }
                    ]
                },
                {
                    type: 'BAGGAGE',
                    subType: 'BAGGAGE_23',
                    slices: [
                        {
                            id: 'MADBIO20221021155500',
                            amounts: [
                                {
                                    fare: 18,
                                    quantity: 1
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB043820221021'
                                }
                            ],
                            monetaryAmount: [
                                {
                                    amount: 90,
                                    currency: {
                                        code: 'AVIOS'
                                    }
                                }
                            ]
                        }
                    ],
                    monetaryAmount: [
                        {
                            amount: 90,
                            currency: {
                                code: 'AVIOS'
                            }
                        }
                    ]
                }
            ],
            name: 'test',
            surnames: 'test'
        }
    ],
    totalMonetaryAmount: [
        {
            amount: 1710,
            currency: {
                code: 'AVIOS'
            }
        },
        {
            amount: 50,
            currency: {
                code: 'TIER_POINTS'
            }
        }
    ]
};


let generateResAviosSummaryModelResponse = {
    passengers: [
        {
            name: 'test',
            surnames: 'test',
            id: 'ADULT_01',
            memberIdentifier: undefined,
            items: [
                {
                    title: 'ANCILLARIES_BAGGAGE_TITLE_15',
                    aviosAmount: 130,
                    pointsAmount: undefined
                },
                {
                    title: 'ANCILLARIES_BAGGAGE_TITLE_23',
                    aviosAmount: 90,
                    pointsAmount: undefined
                }
            ],
            totalAviosPassenger: 1710,
            totalPointsPassenger: 50,
            flights: {
                aviosAmount: 1490,
                pointsAmount: 50
            }
        }
    ],
    totalAvios: 1710,
    totalPoints: 50
};

let fakeBreakdownInfoMMB = {
    context: {
        flowId: 'TWFuYWdlTXlCb29raW5nQElCN2U5ZjAzNzEzM2VkNDNlMzgzZTYxMTMwMmYzYzE2ZDA%3D',
        order: {
            orderId: 'Qm9va2luZ0BJQmVjNzBjZDY3MTY2MTQ3MjZhM2E2ZTIwZmJlYzRjNGI2',
            status: 'ISSUED',
            clientLocator: 'JTRCTF',
            bookingReferences: [
                {
                    provider: '1A',
                    reference: 'JTRCTF'
                },
                {
                    provider: 'IB',
                    reference: 'ML9XE'
                }
            ],
            orderItems: [
                {
                    type: 'flight',
                    orderItemId: 'IBec70cd6716614726a3a6e20fbec4c4b6_01',
                    bookingReferences: [
                        {
                            provider: '1A',
                            reference: 'JTRCTF'
                        },
                        {
                            provider: 'IB',
                            reference: 'ML9XE'
                        }
                    ],
                    price: {
                        fare: 849,
                        tax: 48.86,
                        total: 897.86,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    sliceIds: ['MADFCO20230120084000', 'FCOMAD20230130063000'],
                    passengerPrices: [
                        {
                            fareCalculation: 'MAD IB ROM422.10IB MAD422.10NUC844.20END ROE1.005682',
                            passengerId: 'ADULT_01',
                            price: {
                                fare: 849,
                                tax: 48.86,
                                total: 897.86,
                                currency: 'EUR',
                                ticketingFee: 0
                            },
                            segmentPrices: [
                                {
                                    price: null,
                                    fareCode: 'YDNNANY4',
                                    segmentsIds: ['IB323020230120'],
                                    ticketDesignator: '',
                                    penalties: [],
                                    penaltyFlags: null
                                },
                                {
                                    price: null,
                                    fareCode: 'YDNNANY4',
                                    segmentsIds: ['IB323920230130'],
                                    ticketDesignator: '',
                                    penalties: [],
                                    penaltyFlags: null
                                }
                            ],
                            taxes: [
                                {
                                    code: 'JD',
                                    amount: 14.48,
                                    currency: 'EUR',
                                    description: 'Cargo por salida',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'OG',
                                    amount: 0.63,
                                    currency: 'EUR',
                                    description: 'Tasa de seguridad',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'QV',
                                    amount: 3.27,
                                    currency: 'EUR',
                                    description: 'Seguridad',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'EX',
                                    amount: 2.32,
                                    currency: 'EUR',
                                    description: 'Cargo por seguridad del equipaje',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'HB',
                                    amount: 7.5,
                                    currency: 'EUR',
                                    description: 'Tasa municipal',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'IT',
                                    amount: 15.99,
                                    currency: 'EUR',
                                    description: 'Tasa de embarque',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'MJ',
                                    amount: 1.47,
                                    currency: 'EUR',
                                    description: 'Cargo por servicio al pasajero',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                },
                                {
                                    code: 'VT',
                                    amount: 3.2,
                                    currency: 'EUR',
                                    description: 'Cargo por seguridad',
                                    subcode: null,
                                    country: null,
                                    carrier: null
                                }
                            ],
                            orderItemPaymentInfos: []
                        }
                    ]
                }
            ],
            slices: [
                {
                    sliceId: 'MADFCO20230120084000',
                    type: 'REGULAR',
                    departureDateTime: '2023-01-20 08:40',
                    arrivalDateTime: '2023-01-20 11:10',
                    duration: 150,
                    stopsNumber: 0,
                    detailedPrices: [
                        {
                            fare: 424.5,
                            currency: 'EUR',
                            passengerIds: ['ADULT_01'],
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 424.5,
                                        currency: 'EUR'
                                    },
                                    fareCode: '',
                                    segmentsIds: ['IB323020230120'],
                                    ticketDesignator: null,
                                    penalties: [],
                                    penaltyFlags: null
                                }
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'MAD',
                                name: 'BARAJAS',
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
                                code: 'FCO',
                                name: 'FIUMICINO',
                                terminal: '1',
                                city: {
                                    code: 'ROM',
                                    description: 'Roma',
                                    countryCode: 'IT',
                                    country: {
                                        code: 'IT',
                                        description: 'Italia'
                                    }
                                }
                            },
                            departureCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
                            },
                            arrivalCity: {
                                code: 'ROM',
                                description: 'Roma',
                                countryCode: 'IT',
                                timeZone: 'Europe/Rome'
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
                                marketingFlightNumber: '3230',
                                operationalFlightNumber: '3230',
                                operationalDisclosure: 'IB',
                                aircraft: {
                                    code: '321',
                                    description: 'Airbus A321'
                                }
                            },
                            cabin: {
                                rbd: 'I',
                                description: 'Business',
                                remainingSeats: null,
                                fareFamily: null,
                                code: 'B',
                                type: 'BUSINESS',
                                bookingClass: 'BUSINESS'
                            },
                            overnight: false,
                            id: 'IB323020230120',
                            duration: 150,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2023-01-20 08:40',
                            departureUtcDateTime: '2023-01-20T07:40:00.000',
                            arrivalDateTime: '2023-01-20 11:10',
                            arrivalUtcDateTime: '2023-01-20T10:10:00.000',
                            status: {
                                code: 'HK',
                                description: 'Confirmado'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                {
                                    type: 'FLIGHT_REFUND',
                                    enabled: false
                                },
                                {
                                    type: 'FREQUENT_FLYER_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'SPECIAL_NEEDS_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'CONTACT_DATA_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'EMERGENCY_CONTACT_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'PASSENGER_NAME_CORRECTION',
                                    enabled: true
                                },
                                {
                                    type: 'ANCILLARIES',
                                    enabled: true
                                },
                                {
                                    type: 'FLIGHT_MODIFICATION',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_MODIFICATION_FLEXIBLE',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_DISRUPTION_SEARCH',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_MODIFICATION_ON_DEMAND',
                                    enabled: false
                                }
                            ]
                        }
                    ]
                },
                {
                    sliceId: 'FCOMAD20230130063000',
                    type: 'REGULAR',
                    departureDateTime: '2023-01-30 06:30',
                    arrivalDateTime: '2023-01-30 09:05',
                    duration: 155,
                    stopsNumber: 0,
                    detailedPrices: [
                        {
                            fare: 424.5,
                            currency: 'EUR',
                            passengerIds: ['ADULT_01'],
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 424.5,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'YDNNANY4',
                                    segmentsIds: ['IB323920230130'],
                                    ticketDesignator: null,
                                    penalties: [],
                                    penaltyFlags: null
                                }
                            ]
                        }
                    ],
                    segments: [
                        {
                            type: 'CONFIRMED',
                            mmbAllowed: true,
                            ckiStatus: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            noShow: false,
                            flyNow: false,
                            flown: false,
                            departure: {
                                code: 'FCO',
                                name: 'FIUMICINO',
                                terminal: '1',
                                city: {
                                    code: 'ROM',
                                    description: 'Roma',
                                    countryCode: 'IT',
                                    country: {
                                        code: 'IT',
                                        description: 'Italia'
                                    }
                                }
                            },
                            arrival: {
                                code: 'MAD',
                                name: 'BARAJAS',
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
                            departureCity: {
                                code: 'ROM',
                                description: 'Roma',
                                countryCode: 'IT',
                                timeZone: 'Europe/Rome'
                            },
                            arrivalCity: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                timeZone: 'Europe/Madrid'
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
                                marketingFlightNumber: '3239',
                                operationalFlightNumber: '3239',
                                operationalDisclosure: 'IB',
                                aircraft: {
                                    code: '321',
                                    description: 'Airbus A321'
                                }
                            },
                            cabin: {
                                rbd: 'Y',
                                description: 'Turista',
                                remainingSeats: null,
                                fareFamily: null,
                                code: 'R',
                                type: 'ECONOMY',
                                bookingClass: 'ECONOMY'
                            },
                            overnight: false,
                            id: 'IB323920230130',
                            duration: 155,
                            waitingTime: 0,
                            operatorLocator: null,
                            stop: null,
                            departureDateTime: '2023-01-30 06:30',
                            departureUtcDateTime: '2023-01-30T05:30:00.000',
                            arrivalDateTime: '2023-01-30 09:05',
                            arrivalUtcDateTime: '2023-01-30T08:05:00.000',
                            status: {
                                code: 'HK',
                                description: 'Confirmado'
                            }
                        }
                    ],
                    overnight: false,
                    passengerFlags: [
                        {
                            passengerId: 'ADULT_01',
                            flags: [
                                {
                                    type: 'FLIGHT_REFUND',
                                    enabled: false
                                },
                                {
                                    type: 'FREQUENT_FLYER_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'SPECIAL_NEEDS_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'CONTACT_DATA_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'EMERGENCY_CONTACT_MODIFICATION',
                                    enabled: true
                                },
                                {
                                    type: 'PASSENGER_NAME_CORRECTION',
                                    enabled: true
                                },
                                {
                                    type: 'ANCILLARIES',
                                    enabled: true
                                },
                                {
                                    type: 'FLIGHT_MODIFICATION',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_MODIFICATION_FLEXIBLE',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_DISRUPTION_SEARCH',
                                    enabled: false
                                },
                                {
                                    type: 'FLIGHT_MODIFICATION_ON_DEMAND',
                                    enabled: false
                                }
                            ]
                        }
                    ]
                }
            ],
            price: {
                fare: 849,
                tax: 48.86,
                total: 897.86,
                currency: 'EUR',
                ticketingFee: 0
            },
            primaryContactInfo: {
                phone: '664366070',
                email: 'PATGOMCONT@GMAIL.COM',
                phoneType: 'MOBILE',
                confirmationMailOption: null,
                refundEmail: 'PATGOMCONT@GMAIL.COM'
            },
            optionalInformation: [],
            cashAviosPossibilities: [],
            specialDiscounts: [],
            checkedBagAllowances: [
                {
                    type: 'PIECE',
                    segmentIds: ['IB323020230120', 'IB323920230130'],
                    totalQuantity: 1
                }
            ],
            accrualQuote: null,
            bookingCreationDates: [
                {
                    creationDate: '2022-10-19',
                    provider: '1A'
                }
            ],
            sender: null,
            officeIata: '7849644',
            availableForCheckin: true,
            earlyCheckinDone: false,
            aviosRedeemed: null,
            pointsRedeemed: null
        },
        passengers: [
            {
                passengerType: 'ADULT',
                name: 'test',
                surname: 'test',
                birthDate: null,
                id: 'ADULT_01',
                ckiStatus: null,
                optionalInformation: [],
                residenceAccreditationStatus: null,
                securityInformation: {
                    relatedContent: null
                }
            },
            {
                infant: {
                    passengerType: 'INFANT',
                    name: 'test2',
                    surname: 'test2',
                    birthDate: null,
                    id: 'INFANT_01',
                    ckiStatus: null,
                    optionalInformation: [],
                    residenceAccreditationStatus: null,
                    securityInformation: {
                        relatedContent: null
                    }
                }
            }
        ],
        tickets: [
            {
                ticketNumbers: ['0752000569979'],
                type: 'ET',
                orderItemId: 'IBec70cd6716614726a3a6e20fbec4c4b6_01',
                passengerId: 'ADULT_01',
                issueDateTime: '2022-10-19 00:00',
                fareCalculation: 'MAD IB ROM422.10IB MAD422.10NUC844.20END ROE1.005682',
                taxes: [
                    {
                        code: 'JD',
                        amount: 14.48,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'OG',
                        amount: 0.63,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'QV',
                        amount: 3.27,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'EX',
                        amount: 2.32,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'HB',
                        amount: 7.5,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'IT',
                        amount: 15.99,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'MJ',
                        amount: 1.47,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    },
                    {
                        code: 'VT',
                        amount: 3.2,
                        currency: 'EUR',
                        description: '',
                        subcode: null,
                        country: null,
                        carrier: null
                    }
                ],
                coupons: [
                    {
                        arrival: 'FCO',
                        departure: 'MAD',
                        departureDate: '2023-01-20T08:40:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'YDNNANY4',
                        carrier: 'IB',
                        flightNumber: '3230',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'Y',
                        designator: '',
                        couponNumber: '1',
                        remark: null,
                        baggageDetail: {
                            freeAllowance: 1,
                            quantityCode: 'N',
                            unitQualifier: null
                        },
                        disruptedRefundable: false
                    },
                    {
                        arrival: 'MAD',
                        departure: 'FCO',
                        departureDate: '2023-01-30T06:30:00.000',
                        status: 'OPEN FOR USE',
                        fareBasis: 'YDNNANY4',
                        carrier: 'IB',
                        flightNumber: '3239',
                        flightStatus: 'OK',
                        operatingCarrier: null,
                        bookingCode: 'Y',
                        designator: '',
                        couponNumber: '2',
                        remark: null,
                        baggageDetail: {
                            freeAllowance: 1,
                            quantityCode: 'N',
                            unitQualifier: null
                        },
                        disruptedRefundable: false
                    }
                ],
                iataCode: '78299992',
                issueCity: 'MAD',
                passengerType: 'ADULT',
                paymentInfo: {
                    type: 'CASH',
                    amount: 897.86
                },
                emdsList: [],
                creditCardFeePrice: null,
                conjunctionTickets: null,
                reissueHistory: [],
                taxedPrice: {
                    fare: 849,
                    tax: 48.86,
                    total: 897.86,
                    currency: 'EUR',
                    ticketingFee: 0
                }
            }
        ],
        paymentItems: [
            {
                type: 'CASH'
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
        fareFamilyConditions: [],
        channel: 'CALL_CENTER',
        onHoldInformation: null,
        relatedContent: [],
        qualifiers: [],
        reportingWeb: null,
        flexibilizationCapabilitiesInformation: null,
        genericDisruptionCapabilitiesInformation: null,
        upgInformation: {
            url: 'http://pree.iberia.es/es/gestion-de-reservas/?&language=es&market=es&channel=CALL_CENTER&pnr=JTRCTF&surname=TEST#!/ibdash',
            flightsInformation: [
                {
                    flightOrder: 1,
                    bidToBusiness: {
                        biddable: false,
                        businessBenefit: 0,
                        minimumBid: -1,
                        maximumBid: -1,
                        userCurrentBid: -1,
                        biddingCurrency: null,
                        userBidBlocked: false,
                        userBidClosed: false,
                        userBidResolved: false,
                        userBidGranted: false
                    },
                    bidToTouristPremium: {
                        biddable: false,
                        businessBenefit: -1,
                        minimumBid: -1,
                        maximumBid: -1,
                        userCurrentBid: -1,
                        biddingCurrency: null,
                        userBidBlocked: false,
                        userBidClosed: false,
                        userBidResolved: false,
                        userBidGranted: false
                    }
                },
                {
                    flightOrder: 2,
                    bidToBusiness: {
                        biddable: false,
                        businessBenefit: 0,
                        minimumBid: -1,
                        maximumBid: -1,
                        userCurrentBid: -1,
                        biddingCurrency: null,
                        userBidBlocked: false,
                        userBidClosed: false,
                        userBidResolved: false,
                        userBidGranted: false
                    },
                    bidToTouristPremium: {
                        biddable: false,
                        businessBenefit: -1,
                        minimumBid: -1,
                        maximumBid: -1,
                        userCurrentBid: -1,
                        biddingCurrency: null,
                        userBidBlocked: false,
                        userBidClosed: false,
                        userBidResolved: false,
                        userBidGranted: false
                    }
                }
            ],
            bidable: false
        },
        orderFlags: [
            {
                type: 'PRINT_ITINERARY',
                enabled: true
            },
            {
                type: 'ON_BUSINESS_MODIFICATION',
                enabled: true
            },
            {
                type: 'VOUCHER_REFUND',
                enabled: false
            },
            {
                type: 'CASH_REFUND',
                enabled: false
            },
            {
                type: 'ALLOWED_REFUND_CASH',
                enabled: false
            },
            {
                type: 'ALLOWED_REFUND_VOUCHER',
                enabled: false
            },
            {
                type: 'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE',
                enabled: false
            },
            {
                type: 'ALLOWED_ACCEPT_CHANGES',
                enabled: false
            },
            {
                type: 'VOUCHER_REFUND_ON_DEMAND',
                enabled: false
            },
            {
                type: 'VOUCHER_REFUND_RESTRICTION',
                enabled: false
            },
            {
                type: 'ALLOWED_VOUCHER_COMPENSATION',
                enabled: true
            }
        ],
        isAirShuttle: false,
        isOnHold: false
    }
};

let fakeBookingInfo = {
    "passengers":[
        {
            "passengerType":"ADULT",
            "personalInfo":{
                "name":"test",
                "surname":"test",
                "birthDate":null
            },
            "passengerId":"ADULT_01",
            "relatedPassengerId":"",
            "ckiStatus":null,
            "optionalInformation":[

            ],
            "residenceAccreditationStatus":null,
            "resiberPassengerId":"1"
    }]
};

let fakeGenerateReqAviosSummaryModelRequest = {
    currency: {
        code: 'EUR'
    },
    flight: {
        discounts: [],
        yq: 0,
        commercialCode: null,
        slices: [
            {
                id: 'MADBIO20221021155500',
                segments: [
                    {
                        id: 'IB043820221021',
                        operatingCarrier: {
                            code: 'IB'
                        },
                        marketingCarrier: {
                            code: 'IB'
                        },
                        schedule: {
                            departureAirportCode: 'MAD',
                            arrivalAirportCode: 'BIO',
                            departureDate: '2022-10-21'
                        },
                        bookingClass: {
                            code: 'B'
                        },
                        bookingCabin: {
                            code: 'E'
                        }
                    }
                ]
            }
        ]
    },
    passengers: [
        {
            id: 'ADULT_01',
            memberIdentifier: null,
            flight: {
                slices: [
                    {
                        id: 'MADBIO20221021155500',
                        fare: 304,
                        totalFare: 304
                    }
                ]
            }
        }
    ]
};

let fakeGenerateReqAviosSummaryModelResponse = {
    currency: {
        code: 'EUR'
    },
    flight: {
        discounts: [],
        yq: 0,
        commercialCode: null,
        slices: [
            {
                id: 'MADBIO20221021155500',
                segments: [
                    {
                        id: 'IB043820221021',
                        operatingCarrier: {
                            code: 'IB'
                        },
                        marketingCarrier: {
                            code: 'IB'
                        },
                        schedule: {
                            departureAirportCode: 'MAD',
                            arrivalAirportCode: 'BIO',
                            departureDate: '2022-10-21'
                        },
                        bookingClass: {
                            code: 'B'
                        },
                        bookingCabin: {
                            code: 'E'
                        }
                    }
                ]
            }
        ]
    },
    passengers: [
        {
            id: 'ADULT_01',
            memberIdentifier: null,
            flight: {
                slices: [
                    {
                        id: 'MADBIO20221021155500',
                        fare: 304,
                        totalFare: 304
                    }
                ]
            },
            ancillaries: []
        }
    ]
};

let fakePassengersInfo = [
    {
        "infant": {
        "passengerType":"INFANT",
        "personalInfo":{
            "name":"test",
            "surname":"test",
            "birthDate":null
        },
        "id":"INFANT_01",
        "relatedPassengerId":"",
        "ckiStatus":null,
        "optionalInformation":[],
        "residenceAccreditationStatus":null,
        "resiberPassengerId":"1"
    }
}];

describe('IbMmbAviosSummaryTransformer', () => {
    let transformer: IbMmbAviosSummaryTransformer;
    let fakeCommonsSessionStorageService: any = new StorageServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbMmbAviosSummaryTransformer],
            providers: []
        });
        transformer = new IbMmbAviosSummaryTransformer(fakeCommonsSessionStorageService);
    });

    it('Should create the component when init', () => {
        expect(transformer).toBeTruthy();
    });

    describe('When generateResAviosSummaryModel is called & flowApp is MMB', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('breakdownInfo', fakeBreakdownInfoMMB);
        });
        it('Should generateResAviosSummaryModel', () => {
            expect(transformer.generateResAviosSummaryModel(generateResAviosSummaryModelRequest, flowApp.MMB)).toEqual(generateResAviosSummaryModelResponse);
        });
    });

    describe('When generateResAviosSummaryModel is called & flowApp is MMBVC', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('breakdownInfo', fakeBreakdownInfoMMB);
        });
        it('Should generateResAviosSummaryModel', () => {
            expect(transformer.generateResAviosSummaryModel(generateResAviosSummaryModelRequest, flowApp.MMBVC)).toEqual(generateResAviosSummaryModelResponse);
        });
    });

    describe('When generateResAviosSummaryModel is called & flowApp is MMBOH', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
        });
        it('Should generateResAviosSummaryModel', () => {
            expect(transformer.generateResAviosSummaryModel(generateResAviosSummaryModelRequest, flowApp.MMBOH)).toEqual(generateResAviosSummaryModelResponse);
        });
    });

    describe('When generateResAviosSummaryModel is called & flowApp is CKI', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
        });
        it('Should generateResAviosSummaryModel', () => {
            expect(transformer.generateResAviosSummaryModel(generateResAviosSummaryModelRequest, flowApp.CKI)).toEqual(generateResAviosSummaryModelResponse);
        });
    });

    describe('When generateReqAviosSummaryModel is called', () => {
        it('Should return correct data', () => {
            expect(transformer.generateReqAviosSummaryModel(fakeGenerateReqAviosSummaryModelRequest)).toEqual(fakeGenerateReqAviosSummaryModelResponse);
        });
    });

    describe('When searchInfoInfant is called', () => {
        it('Should return infant data if passengers have a infant', () => {
            expect(transformer['searchInfoInfant'](fakePassengersInfo, 'INFANT_01')).toEqual(fakePassengersInfo[0].infant);
        });
    });
});
