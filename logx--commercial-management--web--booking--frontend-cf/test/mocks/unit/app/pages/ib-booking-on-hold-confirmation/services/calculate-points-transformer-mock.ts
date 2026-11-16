import { Ancillaries, AncillariesSlices, PaymentItem, PointsCalculationRequest } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-calculate-points-transformer-model';
import { OHImportResponse, VoucherDiscount } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { DiscountItem } from '@src/app/shared/components/ib-booking-price-detail-modal/price-detail-modal-models';

export const mockData: PointsCalculationRequest = {
    currency: {
        code: 'EUR'
    },
    flight: {
        yq: 50,
        discounts: [
            {
                type: 'Promo',
                percentDiscount: 10,
                totalDiscount: 20,
                description: '',
                discountFormatted: ''
            }
        ],
        slices: [
            {
                id: 'slice_01',
                segments: [
                    {
                        id: 'segment_01',
                        operatingCarrier: {
                            code: 'AA'
                        },
                        marketingCarrier: {
                            code: 'BA'
                        },
                        ticketingCarrier: {
                            code: 'MMB'
                        },
                        schedule: {
                            departureAirportCode: 'JFK',
                            arrivalAirportCode: 'LAX',
                            departureDate: '2023-10-15'
                        },
                        bookingClass: {
                            code: 'Y'
                        },
                        bookingCabin: {
                            code: 'Economy'
                        },
                        commercialCode: null,
                        fareProduct: 'BASIC'
                    }
                ]
            }
        ]
    },
    passengers: [
        {
            id: 'ADULT_01',
            memberIdentifier: 'MEM123456',
            scheme: {
                schemeIdentifier: {
                    identifier: 'SCHEME_001'
                },
                recognitionLevel: {
                    recognitionLevelIdentifier: {
                        identifier: 'LEVEL_1'
                    }
                }
            },
            bookingSummary: {
                bookingDate: '2023-10-01',
                ticketIssuanceDate: '2023-10-10'
            },
            flight: {
                slices: [
                    {
                        id: 'slice_01',
                        fare: 300,
                        totalFare: 280
                    }
                ],
                monetaryAmount: [
                    {
                        amount: 10,
                        breakdownType: 'REWARD',
                        currency: { code: 'AVIOS' }
                    },
                    {
                        amount: 20,
                        breakdownType: 'REWARD',
                        currency: { code: 'TIER_POINTS' }
                    }
                ]
            }
        }
    ],
    totalMonetaryAmount: [
        {
            amount: 10,
            breakdownType: 'REWARD',
            currency: { code: 'AVIOS' }
        },
        {
            amount: 10,
            breakdownType: 'REWARD',
            currency: { code: 'TIER_POINTS' }
        }
    ]
};

export const fakePassengersData: PointsCalculationRequest = {
    currency: { code: 'EUR' },
    flight: {
        slices: [],
        discounts: [],
        yq: 0
    },
    passengers: [
        {
            id: '1',
            memberIdentifier: 'member1',
            flight: {
                slices: [],
                monetaryAmount: [{ amount: 10, currency: { code: 'AVIOS' } }, { amount: 20, currency: { code: 'TIER_POINTS' } }]
            }
        }
    ]
};

export const fakeAncillariesSlices: AncillariesSlices[] = [
    {
        id: 'IB311020240408',
        segmentIds: ['segment1']
    }
];

export const fakeAncillaries: Ancillaries[] = [
    {
        type: 'SEAT',
        segmentId: 'IB391720221121',
        subtype: 'standard',
        amount: 1,
        price: {
            fare: 8
        },
        sliceId: 'IB311020240408',
        passengerId: 'ADULT_01'
    }
];

export const fakePaymentItems : PaymentItem[]= [
    {
        type: 'LGF',
        percentDiscount: 10,
        total: 20,
        totalDiscount: 20,
        description: 'LGF payment discount',
        discountFormatted: '20 €'
    }
] ;

export const fakeSpecialDiscounts: DiscountItem[] = [
    {
        type: 'VOUCHER',
        percentDiscount: 20,
        totalDiscount: 20,
        description: 'Special voucher discount',
        discountFormatted: '20 €'
    }
];

export const fakeVoucherItems: VoucherDiscount = {
    amount: 12,
    formattedAmount: '12 €',
    priceWithDiscount: 0,
    type: 'PARTNER',
    totalDiscount: 12,
    percentDiscount: null,
    totalBookingAmountWithDiscountApplied: 0,
    voucherId: 123,
    description: 'Partner voucher discount',
    discountFormatted: '12 €'
};

export const onHoldInfoMock = {
    flowId: 'TWFuYWdlTXlCb29raW5nQElCMDgyMDExY2U1ZmI2NGQ3ODkzZDJiYzk0MDA2MmRiMjU=',
    order: {
        orderId: 'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A=',
        status: 'ON_HOLD_CONFIRMABLE',
        clientLocator: 'J6GV6',
        bookingReferences: [
            {
                provider: 'IB',
                reference: 'J6GV6'
            }
        ],
        orderItems: [
            {
                type: 'flight',
                orderItemId: 'IBa1b0446a34424c22bd79e6070e96fea9OP_01',
                bookingReferences: [
                    {
                        provider: 'IB',
                        reference: 'J6GV6'
                    }
                ],
                price: {
                    fare: 212,
                    tax: 39.73,
                    total: 251.73,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                sliceIds: [
                    'MADBCN20250615112500',
                    'BCNMAD20250629091500'
                ],
                passengerPrices: [
                    {
                        fareCalculation: 'MAD IB BCN165.00IB MAD47.00EUR212.00END',
                        passengerId: 'ADULT_01',
                        price: {
                            fare: 212,
                            tax: 39.73,
                            total: 251.73,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        segmentPrices: [
                            {
                                price: {
                                    fare: 165,
                                    currency: 'EUR'
                                },
                                fareCode: 'RDNNM4',
                                segmentsIds: [
                                    'IB041120250615'
                                ],
                                ticketDesignator: null,
                                penalties: [],
                                penaltyFlags: null
                            },
                            {
                                price: {
                                    fare: 47,
                                    currency: 'EUR'
                                },
                                fareCode: 'SDNNB4',
                                segmentsIds: [
                                    'IB040420250629'
                                ],
                                ticketDesignator: null,
                                penalties: [],
                                penaltyFlags: null
                            }
                        ],
                        taxes: [
                            {
                                code: 'OG|OG',
                                amount: 1.38,
                                currency: 'EUR',
                                description: 'Security Tax',
                                subcode: '001',
                                country: 'ES',
                                carrier: null
                            },
                            {
                                code: 'QV|QV',
                                amount: 8.18,
                                currency: 'EUR',
                                description: 'Security',
                                subcode: '003',
                                country: 'ES',
                                carrier: null
                            },
                            {
                                code: 'JD|JD',
                                amount: 30.17,
                                currency: 'EUR',
                                description: 'Departure Charge',
                                subcode: '003',
                                country: 'ES',
                                carrier: null
                            },

                            {
                                code: 'YQ',
                                amount: 400,
                                currency: 'EUR',
                                description: 'Carrier charges',
                                subcode: 'I',
                                country: 'ES',
                                carrier: null
                            }
                        ],
                        orderItemPaymentInfos: []
                    }
                ]
            },
            {
                type: 'specialNeed',
                orderItemId: 'IBa1b0446a34424c22bd79e6070e96fea9OP_02',
                price: {
                    fare: 0,
                    tax: 0,
                    total: 0,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                serviceCode: 'BLND',
                passengerId: 'ADULT_01',
                sliceId: 'MADBCN20250615112500',
                segmentId: 'IB041120250615',
                name: 'Blind Passenger',
                text: 'BLND',
                description: 'Request Service Animal if travelling with one',
                status: {
                    code: 'HK',
                    description: 'Confirmed'
                },
                onHoldTimeLimit: null
            },
            {
                type: 'specialNeed',
                orderItemId: 'IBa1b0446a34424c22bd79e6070e96fea9OP_03',
                price: {
                    fare: 0,
                    tax: 0,
                    total: 0,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                serviceCode: 'WCHC',
                passengerId: 'ADULT_01',
                sliceId: 'MADBCN20250615112500',
                segmentId: 'IB041120250615',
                name: 'Wheelchair for cabin',
                text: 'WCHC',
                description: 'I can walk and I need assistance to / from my seat on the aircraft',
                status: {
                    code: 'HK',
                    description: 'Confirmed'
                },
                onHoldTimeLimit: null
            }
        ],
        slices: [
            {
                sliceId: 'MADBCN20250615112500',
                type: 'REGULAR',
                departureDateTime: '2025-06-15 11:25',
                arrivalDateTime: '2025-06-15 12:40',
                duration: 75,
                stopsNumber: 0,
                detailedPrices: [
                    {
                        fare: 165,
                        currency: 'EUR',
                        passengerIds: [
                            'ADULT_01'
                        ],
                        segmentPrices: [
                            {
                                price: {
                                    fare: 165,
                                    currency: 'EUR'
                                },
                                fareCode: 'RDNNM4',
                                segmentsIds: [
                                    'IB041120250615'
                                ],
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
                            name: 'ADOLFO SUAREZ BARAJAS',
                            terminal: '4',
                            city: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                }
                            }
                        },
                        arrival: {
                            code: 'BCN',
                            name: 'BARCELONA',
                            terminal: '1',
                            city: {
                                code: 'BCN',
                                description: 'Barcelona',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
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
                            code: 'BCN',
                            description: 'Barcelona',
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
                            marketingFlightNumber: '0411',
                            operationalFlightNumber: '0411',
                            operationalDisclosure: 'IB',
                            aircraft: {
                                code: '32A',
                                description: 'Airbus A320'
                            }
                        },
                        cabin: {
                            rbd: 'R',
                            description: 'Business',
                            remainingSeats: 0,
                            fareFamily: 'BUSOPTMH',
                            code: 'B',
                            type: 'BUSINESS',
                            brandCode: '',
                            bookingClass: 'BUSINESS'
                        },
                        overnight: false,
                        id: 'IB041120250615',
                        duration: 75,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2025-06-15 11:25',
                        departureUtcDateTime: '2025-06-15T09:25:00.000',
                        arrivalDateTime: '2025-06-15 12:40',
                        arrivalUtcDateTime: '2025-06-15T10:40:00.000',
                        status: {
                            code: 'HK',
                            description: 'Confirmed'
                        }
                    }
                ],
                overnight: false,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01',
                        flags: [
                            {
                                'type': 'FLIGHT_REFUND',
                                enabled: false
                            },
                            {
                                'type': 'FREQUENT_FLYER_MODIFICATION',
                                enabled: true
                            }
                        ]
                    }
                ],
                originDestinationKey: null
            },
            {
                sliceId: 'BCNMAD20250629091500',
                type: 'REGULAR',
                departureDateTime: '2025-06-29 09:15',
                arrivalDateTime: '2025-06-29 10:40',
                duration: 85,
                stopsNumber: 0,
                detailedPrices: [
                    {
                        fare: 47,
                        currency: 'EUR',
                        passengerIds: [
                            'ADULT_01'
                        ],
                        segmentPrices: [
                            {
                                price: {
                                    fare: 47,
                                    currency: 'EUR'
                                },
                                fareCode: 'SDNNB4',
                                segmentsIds: [
                                    'IB040420250629'
                                ],
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
                            code: 'BCN',
                            name: 'BARCELONA',
                            terminal: '1',
                            city: {
                                code: 'BCN',
                                description: 'Barcelona',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                }
                            }
                        },
                        arrival: {
                            code: 'MAD',
                            name: 'ADOLFO SUAREZ BARAJAS',
                            terminal: '4',
                            city: {
                                code: 'MAD',
                                description: 'Madrid',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                }
                            }
                        },
                        departureCity: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid'
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
                            marketingFlightNumber: '0404',
                            operationalFlightNumber: '0404',
                            operationalDisclosure: 'IB',
                            aircraft: {
                                code: '320',
                                description: 'Airbus A320'
                            }
                        },
                        cabin: {
                            rbd: 'S',
                            description: 'Economy',
                            remainingSeats: 0,
                            fareFamily: 'YR2PA',
                            code: 'R',
                            type: 'ECONOMY',
                            brandCode: '',
                            bookingClass: 'ECONOMY'
                        },
                        overnight: false,
                        id: 'IB040420250629',
                        duration: 85,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2025-06-29 09:15',
                        departureUtcDateTime: '2025-06-29T07:15:00.000',
                        arrivalDateTime: '2025-06-29 10:40',
                        arrivalUtcDateTime: '2025-06-29T08:40:00.000',
                        status: {
                            code: 'HK',
                            description: 'Confirmed'
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
                            }
                        ]
                    }
                ],
                originDestinationKey: null
            }
        ],
        price: {
            fare: 212,
            tax: 39.73,
            total: 251.73,
            currency: 'EUR',
            ticketingFee: 0
        },
        primaryContactInfo: {
            phone: '345555555555555555',
            phoneDetails: {
                number: '5555555555555555',
                countryCode: '34'
            },
            email: 'TEST@GMAIL.COM',
            phoneType: 'MOBILE',
            confirmationMailOption: null,
            refundEmail: 'TEST@GMAIL.COM',
            language: null
        },
        optionalInformation: [],
        cashAviosPossibilities: [
            {
                totalDiscount: 10,
                currency: 'EUR',
                aviosRequired: 1852,
                offerAvailable: false,
                perPassengerDiscounts: [
                    {
                        discount: 10,
                        passengerType: 'ADT',
                        numberOfPassengers: 1
                    }
                ]
            },
            {
                totalDiscount: 74.02,
                currency: 'EUR',
                aviosRequired: 13707,
                offerAvailable: false,
                perPassengerDiscounts: [
                    {
                        discount: 74.02,
                        passengerType: 'ADT',
                        numberOfPassengers: 1
                    }
                ]
            }
        ],
        specialDiscounts: fakeSpecialDiscounts,
        checkedBagAllowances: [
            {
                type: 'PIECE',
                segmentIds: [
                    'IB041120250615',
                    'IB040420250629'
                ],
                totalQuantity: 0
            }
        ],
        accrualQuote: null,
        bookingCreationDates: [
            {
                creationDate: '2025-03-28',
                provider: 'IB'
            }
        ],
        sender: null,
        officeIata: '7849644',
        availableForCheckin: false,
        earlyCheckinDone: false,
        changeSegmentsByAmadeus: false,
        orderType: 'PURE_IB',
        flightRatio: 'Corto Radio',
        referralId: null,
        closedUserGroup: null,
        aviosRedeemed: null,
        pointsRedeemed: null,
        indirectCheckedBagAllowances: [
            {
                baggageAllowanceId: null,
                totalQuantity: 0,
                pieceAllowances: [
                    {
                        totalQuantity: 0,
                        commercialName: null,
                        descriptions: null,
                        type: 'PIECE',
                        subcode: null
                    }
                ],
                segmentIds: [
                    'IB041120250615',
                    'IB040420250629'
                ]
            }
        ],
        voluntaryRefundProcessedDirectlyByCallCenter: false,
        voucherDiscount: fakeVoucherItems
    },
    passengers: [
        {
            passengerType: 'ADULT',
            personalInfo: {
                name: 'TEST',
                surname: 'TEST',
                birthDate: null
            },
            passengerId: 'ADULT_01',
            contactInfo: {
                phone: '345555555555555555',
                phoneDetails: {
                    number: '5555555555555555',
                    countryCode: '34'
                },
                email: 'test@gmail.com',
                phoneType: 'MOBILE',
                confirmationMailOption: null,
                refundEmail: null,
                language: 'en'
            },
            relatedPassengerId: '',
            ckiStatus: null,
            optionalInformation: [],
            residenceAccreditationStatus: null,
            resiberPassengerId: '1',
            securityInformation: {
                relatedContent: null
            },
            externalPersonalInfo: {
                name: 'TEST',
                firstSurname: 'TEST',
                lastSurname: ''
            }
        }
    ],
    warnings: [
        {
            code: 'REFUND_NOT_ALLOWED',
            description: 'IsNoShowCompleteReserveRule'
        },
        {
            code: 'PARTIAL_REFUND_NOT_ALLOWED',
            description: 'HasAnyCouponsUsedByReservePartialRule'
        },
        {
            code: 'SSE_MMB_0001',
            description: 'error de prueba'
        }
    ],
    contextMetadata: {
        language: 'en',
        country: 'ES',
        currencies: [
            {
                code: 'EUR',
                description: 'Euro',
                symbol: '€',
                alignment: 'R',
                groupingSeparator: ',',
                decimalSeparator: '.',
                decimals: 2,
                recommendedDisplay: 'symbol'
            }
        ]
    },
    fareFamilyConditions: [
        {
            cabinType: 'B',
            cabinDescription: 'Economy',
            commercialCode: 'YR2PA',
            commercialName: 'Basic',
            commercialNameES: 'Básica',
            priority: 0,
            conditions:  [
                {
                    code: 'EQMANO',
                    name: 'Hand baggage',
                    text: '1 item max. 10 kg (56x40x25cm) included',
                    unit: 1,
                    extendedInfo: {
                        title: 'Hand luggage: 1 item',
                        message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Baggage in hold',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Checked baggage not included',
                        message: 'With a fee',
                        code: 'CA_1_PIEZAS_PAGO',
                        conditionStatus: false
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Priority baggage delivery',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Fast bag drop not included',
                        message: 'With a fee',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false
                    }
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'E',
            cabinDescription: 'Economy',
            commercialCode: 'YR2PA',
            commercialName: 'Basic',
            commercialNameES: 'Básica',
            priority: 0,
            conditions: [
                {
                    code: 'EQMANO',
                    name: 'Hand baggage',
                    text: '1 item max. 10 kg (56x40x25cm) included',
                    unit: 1,
                    extendedInfo: {
                        title: 'Hand luggage: 1 item',
                        message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Baggage in hold',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Checked baggage not included',
                        message: 'With a fee',
                        code: 'CA_1_PIEZAS_PAGO',
                        conditionStatus: false
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Priority baggage delivery',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Fast bag drop not included',
                        message: 'With a fee',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false
                    }
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'CAMBIO',
                'REEMBOLSO'
            ]
        }
    ],
    channel: 'IBCOM',
    onHoldInformation: {
        timeLimits: '2025-03-31T09:06:19.605+00:00',
        referenceTimeLimit: '2025-03-31T11:06:19.605',
        referenceCity: {
            code: 'MAD',
            description: 'Madrid',
            countryCode: 'ES'
        },
        paidDeposit: {
            fare: 5,
            currency: 'EUR'
        },
        remainingTime: 4316
    },
    relatedContent: [
        {
            key: 'CONFIRM_ONHOLD_CONDITIONS',
            value: 'Total price, includes air fare, <a href=\'http://pree.iberia.es/#MARKETURL/taxes-and-government-fees/\' target=\'_blank\'>taxes</a> (except those charged at certain airports at the time of check-in), handling fees, operator charges and selected options. Click <a href=\'http://pree.iberia.es/#MARKETURL/service-fees/\' target=\'_blank\'>here</a> to check for any management fees for changes and refunds'
        }
    ],
    qualifiers: [],
    reportingWeb: {
        device: 'DMRC',
        idColective: '',
        officeIata: 'MADIB08AB',
        iata: 'I',
        product: '1'
    },
    flexibilizationCapabilitiesInformation: null,
    genericDisruptionCapabilitiesInformation: null,
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
            type: 'ALLOWED_INVOICE_MANAGEMENT',
            enabled: false
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
            type: 'ALLOWED_VOLUNTARY_REFUND_CASH',
            enabled: false
        },
        {
            type: 'ALLOWED_VOLUNTARY_PARTIAL_REFUND_CASH',
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
    ]
};
