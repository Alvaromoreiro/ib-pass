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
        },
        AncillariesTemporalUtilsService: {
            isCurrencyLong: () => {return false;},
            checkEarlySegments: () => {},
            getUpgradingInfo: () => {},
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
        cachedData1: {
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
        },
        ancillariesInfo: {
            "currencies": [
                {
                    "code": "EUR",
                    "description": "Euro",
                    "symbol": "€",
                    "alignment": "R",
                    "groupingSeparator": ".",
                    "decimalSeparator": ",",
                    "decimals": 2,
                    "recommendedDisplay": "symbol"
                }
            ],
            "slices": [
                {
                    "id": "MADBIO20250916072500",
                    "segmentIds": [
                        "IB042920250916"
                    ]
                }
            ],
            "ancillaries": [{
            'type': 'PET',
            'status': {
                'code': 'AVAILABLE',
                'reason': null
            },  
            'currency': 'EUR',
            'slices': [
                {
                    'id': 'MADBIO202103170900',
                    'maxSliceUnits': 2,
                    'passengers': [
                        {
                            'id': 'ADULT_01',
                            'maxPassengerUnits': 1,
                            'pets': [
                                {
                                    'type': 'DOG',
                                    'amount': 50
                                },
                                {
                                    'type': 'CAT',
                                    'amount': 40
                                }
                            ]
                        }
                    ]
                }
            ]
        }]
        },
        cachedData2: {
            "passengers": [
                {
                    "passengerType": "ADULT",
                    "personalInfo": {
                        "name": "Carlos",
                        "surname": "longa",
                        "lastSurname": "",
                        "surnameSuffix": "",
                        "infant": null
                    },
                    "passengerId": "ADULT_01",
                    "seat": null,
                    "resiberId": "1"
                }
            ],
            "order": {
                "orderId": "Qm9va2luZ0BJQjY2M2E0NjZiYTkwNjQ3NmE5Mjg1ODI0NzI4ZTUyZGJhT1A=",
                "bookingReferences": [
                    {
                        "provider": "IB",
                        "reference": "PZP9T"
                    }
                ],
                "orderItems": [
                    {
                        "type": "flight",
                        "orderItemId": "IB663a466ba906476a9285824728e52dbaOP_01",
                        "bookingReferences": [
                            {
                                "provider": "IB",
                                "reference": "PZP9T"
                            }
                        ],
                        "price": {
                            "fare": 36,
                            "tax": 20.37,
                            "total": 56.37,
                            "currency": "EUR",
                            "ticketingFee": 0
                        },
                        "sliceIds": [
                            "MADBIO20250916072500"
                        ],
                        "passengerPrices": [
                            {
                                "fareCalculation": "MAD IB BIO35.10EUR35.10END",
                                "passengerId": "ADULT_01",
                                "price": {
                                    "fare": 36,
                                    "tax": 20.37,
                                    "total": 56.37,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "segmentPrices": [
                                    {
                                        "price": {
                                            "fare": 36,
                                            "currency": "EUR"
                                        },
                                        "fareCode": "ODNOB4JJ",
                                        "segmentsIds": [
                                            "IB042920250916"
                                        ],
                                        "ticketDesignator": null,
                                        "penalties": [
                                            {
                                                "type": "Cancel",
                                                "application": "NO-SHOW",
                                                "minPrice": null,
                                                "maxPrice": null,
                                                "nonrefundable": false,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": true,
                                                "isChangeable": false
                                            },
                                            {
                                                "type": "Cancel",
                                                "application": "BEFORE-DEPARTURE",
                                                "minPrice": null,
                                                "maxPrice": null,
                                                "nonrefundable": false,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": true,
                                                "isChangeable": false
                                            },
                                            {
                                                "type": "Cancel",
                                                "application": "AFTER-DEPARTURE",
                                                "minPrice": null,
                                                "maxPrice": null,
                                                "nonrefundable": false,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": true,
                                                "isChangeable": false
                                            },
                                            {
                                                "type": "Change",
                                                "application": "NO-SHOW",
                                                "minPrice": null,
                                                "maxPrice": null,
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
                                            },
                                            {
                                                "type": "Change",
                                                "application": "BEFORE-DEPARTURE",
                                                "minPrice": {
                                                    "amount": 65,
                                                    "currency": "EUR"
                                                },
                                                "maxPrice": {
                                                    "amount": 65,
                                                    "currency": "EUR"
                                                },
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
                                            },
                                            {
                                                "type": "Change",
                                                "application": "AFTER-DEPARTURE",
                                                "minPrice": {
                                                    "amount": 65,
                                                    "currency": "EUR"
                                                },
                                                "maxPrice": {
                                                    "amount": 65,
                                                    "currency": "EUR"
                                                },
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
                                            }
                                        ],
                                        "penaltyFlags": null
                                    }
                                ],
                                "taxes": [
                                    {
                                        "code": "JD",
                                        "amount": 15.59,
                                        "currency": "EUR",
                                        "description": "Cargo por salida",
                                        "subcode": "003",
                                        "country": "ES",
                                        "carrier": null
                                    },
                                    {
                                        "code": "QV",
                                        "amount": 4.09,
                                        "currency": "EUR",
                                        "description": "Seguridad",
                                        "subcode": "003",
                                        "country": "ES",
                                        "carrier": null
                                    },
                                    {
                                        "code": "OG",
                                        "amount": 0.69,
                                        "currency": "EUR",
                                        "description": "Tasa de seguridad",
                                        "subcode": "001",
                                        "country": "ES",
                                        "carrier": null
                                    }
                                ],
                                "passengerDiscount": null
                            }
                        ]
                    }
                ],
                "price": {
                    "fare": 36,
                    "tax": 20.37,
                    "total": 56.37,
                    "currency": "EUR",
                    "ticketingFee": 0
                },
                "bookingOffice": "MAD175",
                "slices": [
                    {
                        "id": "MADBIO20250916072500",
                        "departureDateTime": "2025-09-16 07:25",
                        "arrivalDateTime": "2025-09-16 08:30",
                        "duration": 65,
                        "stopsNumber": 0,
                        "price": {
                            "fare": 36,
                            "currency": "EUR"
                        },
                        "detailedPrices": [
                            {
                                "fare": 36,
                                "currency": "EUR",
                                "passengerIds": [
                                    "ADULT_01"
                                ],
                                "segmentPrices": [
                                    {
                                        "price": {
                                            "fare": 36,
                                            "currency": "EUR"
                                        },
                                        "fareCode": "ODNOB4JJ",
                                        "segmentsIds": [
                                            "IB042920250916"
                                        ],
                                        "ticketDesignator": null,
                                        "penalties": [],
                                        "penaltyFlags": null
                                    }
                                ]
                            }
                        ],
                        "overnight": false,
                        "segments": [
                            {
                                "id": "IB042920250916",
                                "departure": {
                                    "code": "MAD",
                                    "name": "Madrid Adolfo Suarez-Barajas",
                                    "terminal": "4",
                                    "city": {
                                        "code": "MAD",
                                        "description": "Madrid",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "España"
                                        }
                                    }
                                },
                                "arrival": {
                                    "code": "BIO",
                                    "name": "Bilbao",
                                    "terminal": null,
                                    "city": {
                                        "code": "BIO",
                                        "description": "Bilbao",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "España"
                                        }
                                    }
                                },
                                "departureDateTime": "2025-09-16 07:25",
                                "cabin": {
                                    "code": "R",
                                    "type": "ECONOMY",
                                    "description": "Turista",
                                    "fareFamily": "TBAESEU",
                                    "mainClass": "O"
                                },
                                "flight": {
                                    "marketingCarrier": {
                                        "code": "IB",
                                        "name": "Iberia"
                                    },
                                    "operationalCarrier": {
                                        "code": "IB",
                                        "name": "Iberia"
                                    },
                                    "marketingFlightNumber": "0429",
                                    "operationalFlightNumber": "0429",
                                    "operationalDisclosure": "IB",
                                    "aircraft": {
                                        "code": "321",
                                        "description": "Airbus A321"
                                    }
                                },
                                "duration": 65,
                                "waitingTime": 0
                            }
                        ]
                    }
                ],
                "voucherDiscount": null,
                "discountsApplied": {
                    "originalPrice": {
                        "fare": 46.15,
                        "tax": 20.37,
                        "total": 66.52,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "discounts": [
                        {
                            "type": "DYNAMIC_PRICING",
                            "description": "Promoción especial",
                            "percentDiscount": 22,
                            "totalDiscount": 10.15,
                            "dynamicDiscountRuleId": "DynamicDiscount",
                            "accountCode": "190454"
                        }
                    ],
                    "originalOrderItems": [
                        {
                            "type": "flight",
                            "orderItemId": "IB663a466ba906476a9285824728e52dbaOP_01",
                            "bookingReferences": [
                                {
                                    "provider": "IB",
                                    "reference": "PZP9T"
                                }
                            ],
                            "price": {
                                "fare": 46.15,
                                "tax": 20.37,
                                "total": 66.52,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "sliceIds": [
                                "MADBIO20250916072500"
                            ],
                            "passengerPrices": [
                                {
                                    "fareCalculation": "MAD IB BIO35.10EUR35.10END",
                                    "passengerId": "ADULT_01",
                                    "price": {
                                        "fare": 46.15,
                                        "tax": 20.37,
                                        "total": 66.52,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "segmentPrices": [
                                        {
                                            "price": {
                                                "fare": 36,
                                                "currency": "EUR"
                                            },
                                            "fareCode": "ODNOB4JJ",
                                            "segmentsIds": [
                                                "IB042920250916"
                                            ],
                                            "ticketDesignator": null,
                                            "penalties": [
                                                {
                                                    "type": "Cancel",
                                                    "application": "NO-SHOW",
                                                    "minPrice": null,
                                                    "maxPrice": null,
                                                    "nonrefundable": false,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": true,
                                                    "isChangeable": false
                                                },
                                                {
                                                    "type": "Cancel",
                                                    "application": "BEFORE-DEPARTURE",
                                                    "minPrice": null,
                                                    "maxPrice": null,
                                                    "nonrefundable": false,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": true,
                                                    "isChangeable": false
                                                },
                                                {
                                                    "type": "Cancel",
                                                    "application": "AFTER-DEPARTURE",
                                                    "minPrice": null,
                                                    "maxPrice": null,
                                                    "nonrefundable": false,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": true,
                                                    "isChangeable": false
                                                },
                                                {
                                                    "type": "Change",
                                                    "application": "NO-SHOW",
                                                    "minPrice": null,
                                                    "maxPrice": null,
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
                                                },
                                                {
                                                    "type": "Change",
                                                    "application": "BEFORE-DEPARTURE",
                                                    "minPrice": {
                                                        "amount": 65,
                                                        "currency": "EUR"
                                                    },
                                                    "maxPrice": {
                                                        "amount": 65,
                                                        "currency": "EUR"
                                                    },
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
                                                },
                                                {
                                                    "type": "Change",
                                                    "application": "AFTER-DEPARTURE",
                                                    "minPrice": {
                                                        "amount": 65,
                                                        "currency": "EUR"
                                                    },
                                                    "maxPrice": {
                                                        "amount": 65,
                                                        "currency": "EUR"
                                                    },
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
                                                }
                                            ],
                                            "penaltyFlags": null
                                        }
                                    ],
                                    "taxes": [
                                        {
                                            "code": "JD",
                                            "amount": 15.59,
                                            "currency": "EUR",
                                            "description": "Cargo por salida",
                                            "subcode": "003",
                                            "country": "ES",
                                            "carrier": null
                                        },
                                        {
                                            "code": "QV",
                                            "amount": 4.09,
                                            "currency": "EUR",
                                            "description": "Seguridad",
                                            "subcode": "003",
                                            "country": "ES",
                                            "carrier": null
                                        },
                                        {
                                            "code": "OG",
                                            "amount": 0.69,
                                            "currency": "EUR",
                                            "description": "Tasa de seguridad",
                                            "subcode": "001",
                                            "country": "ES",
                                            "carrier": null
                                        }
                                    ],
                                    "orderItemPaymentInfos": []
                                }
                            ],
                            "sliceBaggage": [
                                {
                                    "sliceId": "MADBIO20250916072500",
                                    "passengersBaggage": [
                                        {
                                            "passengersId": [
                                                "ADULT_01"
                                            ],
                                            "handBaggageAllowances": [
                                                {
                                                    "baggageConcept": "PIECE",
                                                    "totalQuantity": 2
                                                }
                                            ],
                                            "baggageInHoldAllowances": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "totalDiscount": 10.15
                }
            },
            "fareFamilyConditions": [
                {
                    "cabinType": "E",
                    "cabinDescription": "Turista",
                    "commercialCode": "TBAESEU",
                    "commercialName": "Básica",
                    "commercialNameES": "Básica",
                    "priority": 900,
                    "conditions": [
                        {
                            "code": "CABINA",
                            "name": "Cabina",
                            "text": "Turista.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Cabina Turista",
                                "message": "Turista.",
                                "code": "CA_Cabina_Turista",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Turista"
                            }
                        },
                        {
                            "code": "EQMANO",
                            "name": "Equipaje de mano",
                            "text": "Incluida 1 pieza hasta 10 kg (56x40x25cm).",
                            "units": 1,
                            "extendedInfo": {
                                "title": "Equipaje de mano: 1 pieza",
                                "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                "code": "CA_EQP_MANO_10KG",
                                "conditionStatus": true,
                                "observationCode": null,
                                "mobileMessage": "1 bulto (56x40x25cm)"
                            }
                        },
                        {
                            "code": "EQBODEGA",
                            "name": "Equipaje en bodega",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Equipaje facturable no incluido",
                                "message": "Con coste.",
                                "code": "CA_1_PIEZAS_PAGO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No incluido"
                            }
                        },
                        {
                            "code": "COMIDA",
                            "name": "Comida",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Comida no incluida",
                                "message": "Con coste.",
                                "code": "Comida_no_incluida",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No incluido"
                            }
                        },
                        {
                            "code": "ASIENTO",
                            "name": "Selección de asiento",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Selección de asiento con coste",
                                "message": "Con coste.",
                                "code": "CA_Asiento_Pago",
                                "conditionStatus": false,
                                "observationCode": "1",
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "ASIENTODELANTERO",
                            "name": "Asiento delantero",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento delantero con coste",
                                "message": "Con coste.",
                                "code": "CA_Asiento_Delantero_pago",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "ASIENTOPREFERENTE",
                            "name": "Asiento preferente",
                            "text": "No aplica.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento preferente no aplica",
                                "message": "No aplica.",
                                "code": "CA_Asiento_Preferente_NO_aplica",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No aplica"
                            }
                        },
                        {
                            "code": "ASIENTOXL",
                            "name": "Asiento espacio extra",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento espacio extra con coste",
                                "message": "Con coste.",
                                "code": "CA_Asiento_XL_Pago",
                                "conditionStatus": false,
                                "observationCode": "2",
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "EMBARQUE",
                            "name": "Prioridad de Embarque",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Embarque prioritario no incluido",
                                "message": "No incluido.",
                                "code": "CA_Embarque_NO_Prioritario",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "CAMBIO",
                            "name": "Cambios",
                            "text": "Permitido con coste, no permitido en caso de no-show.",
                            "units": 65,
                            "extendedInfo": {
                                "title": "Cambio de vuelo con coste",
                                "message": "Cambios permitidos con penalización de 65 € (excepto si has adquirido el primer cambio gratuito al comprar tu billete). No permitido en caso de no presentarse al vuelo (no-show)",
                                "code": "CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Permitido con coste, no permitido en caso de no-show."
                            }
                        },
                        {
                            "code": "REEMBOLSO",
                            "name": "Reembolso (por sentido)",
                            "text": "No permitido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "No permitido",
                                "message": "No permitido.",
                                "code": "CA_REEMBOLSO NO PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No permitido"
                            }
                        },
                        {
                            "code": "CHECKINDESK",
                            "name": "Mostrador check-in exclusivo",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Mostrador Check-in exclusivo no incluido",
                                "message": "No incluido.",
                                "code": "Chek-in_desk_ NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "SALAVIP",
                            "name": "Acceso a salas VIP",
                            "text": "Acceso no incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Acceso a Sala Vip no incluido",
                                "message": "Acceso no incluido.",
                                "code": "Acceso a salas VIP No permitido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "FASTTRACK",
                            "name": "Fast Track",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Fast Track no incluido",
                                "message": "No incluido.",
                                "code": "Fast Track NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "EQPPRIOR",
                            "name": "Entrega prioritaria equipaje",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "No incluye entrega rápida de equipaje",
                                "message": "Con coste.",
                                "code": "Entrega_prioritaria_equipaje_ NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "AVIO",
                            "name": "AVIOS",
                            "text": "Incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Obtén Avios con tu compra",
                                "message": "Incluido.",
                                "code": "AVIOS incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Si"
                            }
                        },
                        {
                            "code": "WIFI",
                            "name": "WiFi",
                            "text": "Disponible con coste, según el tipo de avión.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Wifi con coste",
                                "message": "Disponible con coste, según el tipo de avión.",
                                "code": "Wifi pago",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "FASTLANE",
                            "name": "Fast Lane",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Fast Lane no incluido",
                                "message": "No incluido.",
                                "code": "Fast Lane NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No incluido."
                            }
                        }
                    ],
                    "observations": [
                        {
                            "observationCode": 1,
                            "observationText": "<a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE\" class=\"links\" title=\"Ver precios de la reserva de asiento\">Más detalle sobre la reserva anticipada de asiento</a>"
                        },
                        {
                            "observationCode": 2,
                            "observationText": "<a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE\" class=\"links\" title=\"Ver precios de la reserva de asiento\">Más detalle sobre la reserva anticipada de asiento</a>"
                        }
                    ],
                    "conditionsPriority": [
                        "EQMANO",
                        "EQBODEGA",
                        "COMIDA",
                        "ASIENTO",
                        "ASIENTO24H",
                        "ASIENTOXL",
                        "ASIENTODELANTERO",
                        "ASIENTOPREFERENTE",
                        "EMBARQUE",
                        "TARJEMBANTIC",
                        "CAMBIO",
                        "REEMBOLSO",
                        "CHECKINDESK",
                        "FASTTRACK",
                        "FASTLANE",
                        "AEROPUERTO",
                        "AVIOSPLUS",
                        "PUNTUALIDAD"
                    ]
                }
            ],
            "outwardSegments": [
                {
                    "id": "IB042920250916",
                    "departure": {
                        "date": "2025-09-16 07:25",
                        "airport": {
                            "code": "MAD",
                            "description": "Madrid",
                            "country": {
                                "code": "ES",
                                "description": "España"
                            }
                        },
                        "terminal": "4"
                    },
                    "arrival": {
                        "date": "2025-09-16 08:30",
                        "airport": {
                            "code": "BIO",
                            "description": "Bilbao",
                            "country": {
                                "code": "ES",
                                "description": "España"
                            }
                        },
                        "terminal": null
                    },
                    "cabinClass": {
                        "code": "R",
                        "type": "ECONOMY",
                        "description": "Turista",
                        "fareFamily": "TBAESEU",
                        "mainClass": "O"
                    },
                    "passengers": [
                        {
                            "passengerType": "ADULT",
                            "personalInfo": {
                                "name": "Carlos",
                                "surname": "longa",
                                "lastSurname": "",
                                "surnameSuffix": ""
                            },
                            "passengerId": "ADULT_01",
                            "seat": null
                        }
                    ],
                    "waitingTime": 0
                }
            ],
            "returnSegments": [],
            "airShuttleSegments": []
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
        passengersArray2: {},
        petAncillary: {
            type: 'PET',
            modal: 'PET',
            textModels: {
                title: 'PETC_IN_CABIN',
                subtitle: 'CKIANC_INSURANCE_FROM',
                bulletPoints: ['PET_CONFORT_TRAVEL', 'PETC_LIMITED_SPACES'],
                imgPath: '/pets/pets-icon.svg'
            },
            priceFrom: 40,
            currency: 'EUR',
            modifyButton: false
        },
        petAncillaryPendingPayment: {
            type: 'PET',
            modal: 'PET',
            textModels: {
                title: 'PETC_IN_CABIN',
                subtitle: 'CKIANC_INSURANCE_FROM',
                bulletPoints: ['PET_CONFORT_TRAVEL', 'PETC_LIMITED_SPACES'],
                imgPath: '/pets/pets-icon.svg'
            },
            priceFrom: 40,
            currency: 'EUR',
            modifyButton: true
        }
    },
};
