export const mock = {
    dep: {
        $rootScope: {
            $on: () => {},
            $emit: () => {},
            $broadcast: () => {}
        },
        ModalServiceAncillaries: {
            openAviosAccumulatedModal: () => {}
        },
        CurrencyService: {
            formatPrice: (_, price) => price + "€"
        }
    },
    req: {
        flightAviosInfo: {
            currency: {
                code: 'EUR'
            },
            passengers: [
                {
                    id: 'ADULT_01',
                    memberIdentifier: null,
                    flight: {
                        slices: [
                            {
                                id: 'MADBIO20221111194500',
                                fare: 204,
                                totalFare: 204
                            }
                        ]
                    }
                }
            ],
            flight: {
                discounts: [],
                yq: 0,
                slices: [
                    {
                        id: 'MADBIO20221111194500',
                        segments: [
                            {
                                id: 'IB044020221111',
                                commercialCode: null,
                                operatingCarrier: {
                                    code: 'IB'
                                },
                                marketingCarrier: {
                                    code: 'IB'
                                },
                                schedule: {
                                    departureAirportCode: 'MAD',
                                    arrivalAirportCode: 'BIO',
                                    departureDate: '2022-11-11'
                                },
                                bookingClass: {
                                    code: 'M'
                                },
                                bookingCabin: {
                                    code: 'E'
                                }
                            }
                        ]
                    }
                ]
            }
        },
        flightAviosInfo2: {
            currency: {
                code: 'EUR'
            },
            flight: {
                discounts: [],
                yq: 0,
                slices: [
                    {
                        id: 'MADBIO20221111194500',
                        segments: [
                            {
                                id: 'IB044020221111',
                                commercialCode: null,
                                operatingCarrier: {
                                    code: 'IB'
                                },
                                marketingCarrier: {
                                    code: 'IB'
                                },
                                schedule: {
                                    departureAirportCode: 'MAD',
                                    arrivalAirportCode: 'BIO',
                                    departureDate: '2022-11-11'
                                },
                                bookingClass: {
                                    code: 'M'
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
                                id: 'MADBIO20221111194500',
                                fare: 204,
                                totalFare: 204
                            }
                        ]
                    },
                    ancillaries: [
                        {
                            type: 'BAGGAGE',
                            subType: 'BAGGAGE_15',
                            slices: [
                                {
                                    id: 'MADBIO20221111194500',
                                    amounts: [
                                        {
                                            fare: 13,
                                            quantity: 1
                                        }
                                    ],
                                    segments: [
                                        {
                                            id: 'IB044020221111'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        flightAviosInfo3: {
            currency: {
                code: 'EUR'
            },
            flight: {
                discounts: [],
                yq: 0,
                slices: [
                    {
                        id: 'MADBIO20221111194500',
                        segments: [
                            {
                                id: 'IB044020221111',
                                commercialCode: null,
                                operatingCarrier: {
                                    code: 'IB'
                                },
                                marketingCarrier: {
                                    code: 'IB'
                                },
                                schedule: {
                                    departureAirportCode: 'MAD',
                                    arrivalAirportCode: 'BIO',
                                    departureDate: '2022-11-11'
                                },
                                bookingClass: {
                                    code: 'M'
                                },
                                bookingCabin: {
                                    code: 'E'
                                }
                            }
                        ]
                    }
                ]
            }
        },
        carbonFootprint: {
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
            ],
            slices: [
                {
                    id: '2_2', 
                    segmentIds: ['2'] 
                }
            ],
            ancillaries: [
                {
                    type: 'CO2_FOOTPRINT',
                    status: {
                        code: 'AVAILABLE',
                        reason: null
                    },
                    price: 0.99,
                    kilosCo2Equivalent: 41.3
                }
            ]
        },
        ancillariesPassengers: [
            {
                id: 'ADULT_01',
                ancillaries: [
                    {
                        type: 'BAGGAGE',
                        subType: 'BAGGAGE_15',
                        slices: [
                            {
                                id: 'MADBIO20221111194500',
                                amounts: [
                                    {
                                        fare: 13,
                                        quantity: 1
                                    }
                                ],
                                segments: [
                                    {
                                        id: 'IB044020221111'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        cachedData: {
            checkinId: 'Q2hlY2tpbkBJTlRFUk5FVF9XRUJfSUJFUklBX2liZXJpYV93ZWJfUDEzMTk2M18yMDIzMDUwMyAxNDoxMDoxMV81NDI5X0lCQ09NMDQxbldFQjAzXzkwOTBfdjQ=',
            resiberLocator: "LTW2K",
            gdsLocator: 'LTW2K',
            checkinFlowMode: 'REGULAR',
            passengers: [
                {
                    id: 1,
                    name: 'MIGUEL',
                    surname: 'TEST',
                    title: null,
                    gender: 'MALE',
                    type: 'ADULT',
                    frequentFlyer: null,
                    resident: false,
                    requiredInformation: [],
                    optionalInformation: [
                        "CONTACT_DATA",
                        "EMERGENCY_DATA",
                        "FREQUENT_FLYER"
                    ],
                    status: {
                        code: 'ALLOWED',
                        reason: null
                    },
                    infant: null,
                    pendingPayment: false
                }
            ],
            checkinSegmentsInGroup: [],
            outwardSegments: [
                {
                    id: 2,
                    departure: {
                        date: '2023-05-03 15:55',
                        utcDate: '2023-05-03 14:55',
                        airport: {
                            code: 'MAD',
                            description: 'BARAJAS',
                            country: 'ES'
                        }
                    },
                    arrival: {
                        date: '2023-05-03 17:00',
                        utcDate: '2023-05-03 16:00',
                        airport: {
                            code: 'BIO',
                            description: 'AIRPORT',
                            country: 'ES'
                        },
                        terminal: null
                    },
                    boarding: {
                        date: '2023-05-03 15:25',
                        utcDate: '2023-05-03 14:25',
                        airport: {
                            code: 'MAD',
                            description: 'BARAJAS',
                            country: 'ES',
                            terminal: 4,
                            gate: '????'
                        }
                    },
                    passengers: [
                        {
                            id: 1,
                            seat: {
                                row: '24',
                                column: 'A'
                            },
                            altLocator: null,
                            noShow: false,
                            flyNow: false,
                            status: {
                                code: 'CHECKED',
                                message: null
                            },
                            mmbAvailable: false,
                            ticket: {
                                number: '0751415062305',
                                coupon: '1',
                                issueDate: null,
                                expiryDate: null,
                                status: null
                            },
                            infantTicket: null,
                            farebasis: 'BDNOB4',
                            items: [],
                            inhibitBoardingCard: null,
                            airCheckDocumentationRequired: false
                        }
                    ],
                    operatingFlightNumber: {
                        company: {
                            code: 'IB',
                            description: 'IBERIA AEROLINEAS'
                        },
                        number: '0438'
                    },
                    marketingFlightNumber: null,
                    cabinClass: {
                        code: 'B',
                        type: 'ECONOMY',
                        description: 'Turista'
                    },
                    estimatedFlightTime: '01:05:00',
                    typeOfTransport: 'FLIGHT',
                    flown: false,
                    aircraft: {
                        model: '321',
                        cabins: ['BUSINESS', 'ECONOMY']
                    },
                    airCheckURL: null,
                    airCheck: false
                }
            ],
            returnSegments: [],
            airShuttleSegments: [],
            deepLinkInformation: null,
            carrierConnectEnabled: false,
            relatedContent: []
        }
    },
    resp: {
        passengersArray: [
            {
                id: 'ADULT_01',
                memberIdentifier: null,
                flight: {
                    slices: [
                        {
                            id: 'MADBIO20221111194500',
                            fare: 204,
                            totalFare: 204
                        }
                    ]
                },
                ancillaries: [
                    {
                        type: 'BAGGAGE',
                        subType: 'BAGGAGE_15',
                        slices: [
                            {
                                id: 'MADBIO20221111194500',
                                amounts: [
                                    {
                                        fare: 13,
                                        quantity: 1
                                    }
                                ],
                                segments: [
                                    {
                                        id: 'IB044020221111'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        passengersArray2: {}
    }
};
