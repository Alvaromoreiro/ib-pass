enum flowApp {
  BBKI = "BBKI",
  MMB = "MMB",
  CKI = "CKI",
}

export const mock = {
    inputs: {
        generateResAviosSummaryModel: {
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
                                },
                                {
                                    amount: 50,
                                    currency: {
                                        code: 'TIER_POINTS'
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
                                    amount: 90,
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
        },
        generateReqAviosSummaryModel: {
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
        },
        flowApp: flowApp,
        passenger_getNameAndSurnamesByFlow: {
            id: 'ADULT_01',
            flight: {
                slices: [
                    {
                        id: 'MADBIO20221020221000',
                        fare: 179,
                        totalFare: 179,
                        monetaryAmount: [
                            {
                                amount: 895,
                                currency: {
                                    code: 'AVIOS'
                                }
                            },
                            {
                                amount: 25,
                                currency: {
                                    code: 'TIER_POINTS'
                                }
                            }
                        ]
                    }
                ],
                monetaryAmount: [
                    {
                        amount: 895,
                        currency: {
                            code: 'AVIOS'
                        }
                    },
                    {
                        amount: 25,
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
                            id: 'MADBIO20221020221000',
                            amounts: [
                                {
                                    fare: 13,
                                    quantity: 1
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB044220221020'
                                }
                            ],
                            monetaryAmount: [
                                {
                                    amount: 65,
                                    currency: {
                                        code: 'AVIOS'
                                    }
                                }
                            ]
                        }
                    ],
                    monetaryAmount: [
                        {
                            amount: 65,
                            currency: {
                                code: 'AVIOS'
                            }
                        }
                    ]
                }
            ]
        },
        passenger_getPassengerTotalAviosPoints: {
            id: 'ADULT_01',
            flight: {
                slices: [
                    {
                        id: 'MADXRY20221023072000',
                        fare: 106,
                        totalFare: 106,
                        monetaryAmount: [
                            {
                                amount: 530,
                                currency: {
                                    code: 'AVIOS'
                                }
                            },
                            {
                                amount: 25,
                                currency: {
                                    code: 'TIER_POINTS'
                                }
                            }
                        ]
                    }
                ],
                monetaryAmount: [
                    {
                        amount: 530,
                        currency: {
                            code: 'AVIOS'
                        }
                    },
                    {
                        amount: 25,
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
                            id: 'MADXRY20221023072000',
                            amounts: [
                                {
                                    fare: 13,
                                    quantity: 2
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB890220221023'
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
                            id: 'MADXRY20221023072000',
                            amounts: [
                                {
                                    fare: 18,
                                    quantity: 1
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB890220221023'
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
    },
    outputs: {
        generateReqAviosSummaryModel: {
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
        },
        getNameAndSurnamesByFlow: {
            id: 'ADULT_01',
            flight: {
                slices: [
                    {
                        id: 'MADBIO20221020221000',
                        fare: 179,
                        totalFare: 179,
                        monetaryAmount: [
                            {
                                amount: 895,
                                currency: {
                                    code: 'AVIOS'
                                }
                            },
                            {
                                amount: 25,
                                currency: {
                                    code: 'TIER_POINTS'
                                }
                            }
                        ]
                    }
                ],
                monetaryAmount: [
                    {
                        amount: 895,
                        currency: {
                            code: 'AVIOS'
                        }
                    },
                    {
                        amount: 25,
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
                            id: 'MADBIO20221020221000',
                            amounts: [
                                {
                                    fare: 13,
                                    quantity: 1
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB044220221020'
                                }
                            ],
                            monetaryAmount: [
                                {
                                    amount: 65,
                                    currency: {
                                        code: 'AVIOS'
                                    }
                                }
                            ]
                        }
                    ],
                    monetaryAmount: [
                        {
                            amount: 65,
                            currency: {
                                code: 'AVIOS'
                            }
                        }
                    ]
                }
            ],
            name: 'test',
            surnames: 'test'
        },
        getNameAndSurnamesByFlowBKI: {
            id: 'ADULT_01',
            flight: {
                slices: [
                    {
                        id: 'MADBIO20221020221000',
                        fare: 179,
                        totalFare: 179,
                        monetaryAmount: [
                            {
                                amount: 895,
                                currency: {
                                    code: 'AVIOS'
                                }
                            },
                            {
                                amount: 25,
                                currency: {
                                    code: 'TIER_POINTS'
                                }
                            }
                        ]
                    }
                ],
                monetaryAmount: [
                    {
                        amount: 895,
                        currency: {
                            code: 'AVIOS'
                        }
                    },
                    {
                        amount: 25,
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
                            id: 'MADBIO20221020221000',
                            amounts: [
                                {
                                    fare: 13,
                                    quantity: 1
                                }
                            ],
                            segments: [
                                {
                                    id: 'IB044220221020'
                                }
                            ],
                            monetaryAmount: [
                                {
                                    amount: 65,
                                    currency: {
                                        code: 'AVIOS'
                                    }
                                }
                            ]
                        }
                    ],
                    monetaryAmount: [
                        {
                            amount: 65,
                            currency: {
                                code: 'AVIOS'
                            }
                        }
                    ]
                }
            ],
            name: 'test',
            surnames: 'test '
        },
        getPassengerTotalAviosPoints: [750, 25],
        generateResAviosSummaryModel: {
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
                            pointsAmount: 50
                        },
                        {
                            title: 'ANCILLARIES_BAGGAGE_TITLE_23',
                            aviosAmount: 90,
                            pointsAmount: 50
                        }
                    ],
                    totalAviosPassenger: 1710,
                    totalPointsPassenger: 0,
                    flights: {
                        aviosAmount: 1490,
                        pointsAmount: 50
                    }
                }
            ],
            totalAvios: 1710,
            totalPoints: 50
        }
    },
    localStorage: {
        bookingInfoBKI: {
            passengers: [
                {
                    passengerType: 'ADULT',
                    personalInfo: {
                        name: 'test',
                        surname: 'test',
                        lastSurname: '',
                        infant: null
                    },
                    passengerId: 'ADULT_01',
                    seat: null,
                    resiberId: '1'
                }
            ],
            order: {
                orderId: 'Qm9va2luZ0BJQmJkODBlNTQwZmZiNDQ1MzY5ZDJmNTE3MjdhOTU5ZTNjT1A%3D',
                bookingReferences: [
                    {
                        provider: 'IB',
                        reference: 'HJSK2'
                    }
                ],
                orderItems: [
                    {
                        type: 'flight',
                        orderItemId: 'IBbd80e540ffb445369d2f51727a959e3cOP_01',
                        bookingReferences: [
                            {
                                provider: 'IB',
                                reference: 'HJSK2'
                            }
                        ],
                        price: {
                            fare: 179,
                            tax: 20.22,
                            total: 199.22,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        sliceIds: ['MADBIO20221020221000'],
                        passengerPrices: [
                            {
                                fareCalculation: 'MAD IB BIO179.00EUR179.00END',
                                passengerId: 'ADULT_01',
                                price: {
                                    fare: 179,
                                    tax: 20.22,
                                    total: 199.22,
                                    currency: 'EUR',
                                    ticketingFee: 0
                                },
                                segmentPrices: [
                                    {
                                        price: {
                                            fare: 179,
                                            currency: 'EUR'
                                        },
                                        fareCode: 'LDNOB4',
                                        segmentsIds: ['IB044220221020'],
                                        ticketDesignator: null,
                                        penalties: [
                                            {
                                                type: 'Refund',
                                                application: 'NoShow',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Refund',
                                                application: 'NoShow',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Refund',
                                                application: 'BeforeDeparture',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Change',
                                                application: 'NoShow',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Change',
                                                application: 'NoShow',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Change',
                                                application: 'NoShow',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Change',
                                                application: 'BeforeDeparture',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Change',
                                                application: 'NoShow',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            },
                                            {
                                                type: 'Change',
                                                application: 'BeforeDeparture',
                                                minPrice: null,
                                                maxPrice: null,
                                                nonrefundable: true,
                                                cancelFeeInd: false,
                                                changeFeeInd: false,
                                                isRefundable: false,
                                                isChangeable: false
                                            }
                                        ],
                                        penaltyFlags: null
                                    }
                                ],
                                taxes: [
                                    {
                                        code: 'QV',
                                        amount: 3.6,
                                        currency: 'EUR',
                                        description: 'Seguridad',
                                        subcode: null,
                                        country: null,
                                        carrier: null
                                    },
                                    {
                                        code: 'OG',
                                        amount: 0.69,
                                        currency: 'EUR',
                                        description: 'Tasa de seguridad',
                                        subcode: null,
                                        country: null,
                                        carrier: null
                                    },
                                    {
                                        code: 'JD',
                                        amount: 15.93,
                                        currency: 'EUR',
                                        description: 'Cargo por salida',
                                        subcode: null,
                                        country: null,
                                        carrier: null
                                    }
                                ],
                                passengerDiscount: null
                            }
                        ]
                    }
                ],
                price: {
                    fare: 179,
                    tax: 20.22,
                    total: 199.22,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                bookingOffice: 'MAD175',
                slices: [
                    {
                        id: 'MADBIO20221020221000',
                        departureDateTime: '2022-10-20 22:10',
                        arrivalDateTime: '2022-10-20 23:10',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 179,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 179,
                                currency: 'EUR',
                                passengerIds: ['ADULT_01'],
                                segmentPrices: [
                                    {
                                        price: {
                                            fare: 179,
                                            currency: 'EUR'
                                        },
                                        fareCode: 'LDNOB4',
                                        segmentsIds: ['IB044220221020'],
                                        ticketDesignator: null,
                                        penalties: [],
                                        penaltyFlags: null
                                    }
                                ]
                            }
                        ],
                        overnight: false,
                        segments: [
                            {
                                id: 'IB044220221020',
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
                                    code: 'BIO',
                                    name: 'AIRPORT',
                                    terminal: '',
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
                                departureDateTime: '2022-10-20 22:10',
                                cabin: {
                                    code: 'R',
                                    type: 'ECONOMY',
                                    description: 'Turista',
                                    fareFamily: 'TBAESEU',
                                    mainClass: 'L'
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
                                    marketingFlightNumber: '0442',
                                    operationalFlightNumber: '0442',
                                    operationalDisclosure: 'IB',
                                    aircraft: {
                                        code: '321',
                                        description: 'Airbus A321'
                                    }
                                },
                                duration: 60,
                                waitingTime: 0
                            }
                        ]
                    }
                ],
                voucherDisscount: null
            },
            fareFamilyConditions: [
                {
                    cabinType: 'E',
                    cabinDescription: 'Turista',
                    commercialCode: 'TBAESEU',
                    commercialName: 'Básica',
                    commercialNameES: 'Básica',
                    priority: 900,
                    conditions: [
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
                            }
                        },
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
                            }
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
                            }
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
                            }
                        },
                        {
                            code: 'ASIENTO',
                            name: 'Selección de asiento',
                            text: 'De pago',
                            units: null,
                            extendedInfo: {
                                title: 'Seleccionable con coste',
                                message:
                                  'De pago <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                                code: 'CA_Asiento_Pago',
                                conditionStatus: false,
                                observationCode: '3'
                            }
                        },
                        {
                            code: 'ASIENTODELANTERO',
                            name: 'Asiento delantero',
                            text: 'De pago',
                            units: null,
                            extendedInfo: {
                                title: 'Seleccionable con coste',
                                message: 'De pago',
                                code: 'CA_Asiento_Delantero_pago',
                                conditionStatus: false,
                                observationCode: null
                            }
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
                            }
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
                            }
                        },
                        {
                            code: 'CAMBIO',
                            name: 'Cambios',
                            text: 'Permitido con coste, no permitido en caso de no-show.',
                            units: 65,
                            extendedInfo: {
                                title: 'Cambio de vuelo con coste',
                                message:
                                  'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                conditionStatus: false,
                                observationCode: null
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
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
                            }
                        }
                    ],
                    observations: [
                        {
                            observationCode: 1,
                            observationText:
                              '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE" class="links">Consulte equipaje adicional<span class="oculto">[Abre en ventana nueva]</span></a>'
                        },
                        {
                            observationCode: 2,
                            observationText:
                              '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías <strong>one</strong>world. En el resto debes consultar con la compañía operadora'
                        },
                        {
                            observationCode: 3,
                            observationText:
                              '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE" class="links" title="Ver precios de la reserva de asiento">Más detalle sobre la reserva anticipada de asiento</a>'
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
                    ]
                }
            ],
            outwardSegments: [
                {
                    id: 'IB044220221020',
                    departure: {
                        date: '2022-10-20 22:10',
                        airport: {
                            code: 'MAD',
                            description: 'Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        },
                        terminal: '4'
                    },
                    arrival: {
                        date: '2022-10-20 23:10',
                        airport: {
                            code: 'BIO',
                            description: 'Bilbao',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        },
                        terminal: ''
                    },
                    cabinClass: {
                        code: 'R',
                        type: 'ECONOMY',
                        description: 'Turista',
                        fareFamily: 'TBAESEU',
                        mainClass: 'L'
                    },
                    passengers: [
                        {
                            passengerType: 'ADULT',
                            personalInfo: {
                                name: 'one',
                                surname: 'test',
                                lastSurname: ''
                            },
                            passengerId: 'ADULT_01',
                            seat: null
                        }
                    ],
                    waitingTime: 0
                }
            ],
            returnSegments: [],
            airShuttleSegments: []
        },
        bookingInfoCKI: {
            checkinId:
              'Q2hlY2tpbkBJTlRFUk5FVF9XRUJfSUJFUklBX2liZXJpYV93ZWJfUDEzMTk3NV8yMDIyMTAyMSAxMDoyMDoyOF8xMTdfSUJDT00wNDFuV0VCMDNfOTA5MF92Mw%3D%3D',
            resiberLocator: 'HJQ0R',
            gdsLocator: 'HJQ0R',
            checkinFlowMode: 'REGULAR',
            passengers: [
                {
                    id: 1,
                    name: 'test',
                    surname: 'test',
                    title: null,
                    gender: 'MALE',
                    type: 'ADULT',
                    frequentFlyer: null,
                    resident: false,
                    requiredInformation: ['CONTACT_DATA'],
                    optionalInformation: ['GENDER', 'EMERGENCY_DATA', 'FREQUENT_FLYER'],
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
                        date: '2022-10-22 07:40',
                        utcDate: '2022-10-22 05:40',
                        airport: {
                            code: 'MAD',
                            description: 'BARAJAS',
                            country: 'ES'
                        },
                        terminal: '4'
                    },
                    arrival: {
                        date: '2022-10-22 08:40',
                        utcDate: '2022-10-22 06:40',
                        airport: {
                            code: 'BIO',
                            description: 'AIRPORT',
                            country: 'ES'
                        },
                        terminal: null
                    },
                    boarding: {
                        date: '2022-10-22 07:10',
                        utcDate: '2022-10-22 05:10',
                        airport: {
                            code: 'MAD',
                            description: 'BARAJAS',
                            country: 'ES'
                        },
                        terminal: '4',
                        gate: '????'
                    },
                    passengers: [
                        {
                            id: 1,
                            seat: null,
                            altLocator: null,
                            noShow: false,
                            flyNow: false,
                            status: {
                                code: 'CHECKABLE',
                                message: null
                            },
                            mmbAvailable: false,
                            ticket: {
                                number: '0751404040976',
                                coupon: '1',
                                issueDate: null,
                                expiryDate: null,
                                status: null
                            },
                            infantTicket: null,
                            farebasis: 'ADNOB4',
                            items: [],
                            inhibitBoardingCard: null,
                            airCheckDocumentationRequired: false
                        }
                    ],
                    operatingFlightNumber: {
                        company: {
                            code: 'IB',
                            description: 'Iberia'
                        },
                        number: '0448'
                    },
                    marketingFlightNumber: null,
                    cabinClass: {
                        code: 'A',
                        type: 'ECONOMY',
                        description: 'Turista',
                        fareFamily: null,
                        mainClass: 'Y'
                    },
                    estimatedFlightTime: '01:00:00',
                    typeOfTransport: 'FLIGHT',
                    flown: false,
                    aircraft: {
                        model: '32A',
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
        },
        breakdownInfo: {
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
                    personalInfo: {
                        name: 'test',
                        surname: 'test',
                        birthDate: null
                    },
                    passengerId: 'ADULT_01',
                    ckiStatus: null,
                    optionalInformation: [],
                    residenceAccreditationStatus: null,
                    securityInformation: {
                        relatedContent: null
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
        },
        breakdownInfoMMB: {
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
        }
    },
    providers: {
        fakeCommonsAviosConstants: {
            ANCILLARIES_LITERALS: {
                PRIORITY_BOARDING: 'PRIORITY_BOARDING_TITLE',
                FLEXIBILITY_ON_DEMAND: 'ANCILLARIES_FLEXIBILITY_SUBTITLE_MODAL',
                SKI_SNOW: 'SPEQS_SKI_SNOW',
                GOLF_EQUIPMENT: 'SPEQS_GOLF_EQUIPMENT',
                BICYCLE: 'SPEQS_BICYCLE',
                SURFBOARD: 'SPEQS_SURFBOARD_TITLE',
                SCUBA_DIVING: 'SPEQS_SCUBA_TITLE',
                FISHING_EQUIPMENT: 'SPEQS_FISHING_TITLE',
                BAGGAGE_15: 'ANCILLARIES_BAGGAGE_TITLE_15',
                BAGGAGE_23: 'ANCILLARIES_BAGGAGE_TITLE_23',
                BAGGAGE_32: 'ANCILLARIES_BAGGAGE_TITLE_32',
                SEAT: 'SEAT_TEXT',
                VOUCHER_REFUND: 'ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE',
                FLIGHT_CHANGE: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
                FLEXIBILITY_PACK: 'ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY'
            }
        },
        fakeLocalStorageService: {
            get: (param: string): any => {},
            set: (param: string): any => {},
            remove: () => {},
            clear: () => {}
        },
        fakeRootScope: {}
    }
};
