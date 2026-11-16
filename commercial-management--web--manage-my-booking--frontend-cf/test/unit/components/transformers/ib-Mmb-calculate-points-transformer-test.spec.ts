describe("CalculatePointsTransformer Test", () => {
    let CalculatePointsTransformer, localStorageService, $q, $rootScope, $scope;

    let fakeData = {
        calculationResults: [
            {
                products: {
                    flight: {
                        monetaryAmount: [
                            {
                                breakDownType: false,
                                currency: {
                                    currencyCode: "AVIOS",
                                },
                            },
                        ],
                    },
                },
            },
        ],
        totalMonetaryAmount: [
            {
                currency: {
                    code: "AVIOS",
                },
                amount: 10,
            },
            {
                currency: {
                    code: "TIER_POINTS",
                },
                amount: 10,
            },
        ],
    };

    let fakePassengersData = {
        passengers: [
            {
                id: 1,
                memberIdentifier: "member1",
                flight: {
                    monetaryAmount: [{ amount: 10 }, { amount: 20 }],
                },
            },
        ],
    };
    let fakePassengersData2 = {
        passengers: [
            {
                id: 1,
                flight: {
                    monetaryAmount: [],
                },
            },
        ],
    };

    let fakeFareData = {
        order: {
            price: {
                currency: "EUR"
            },
            specialDiscounts: [
                {
                    type: "PARTNER",
                    percentDiscount: 10,
                    totalDiscount: 20
                }
            ],
            voucherDiscount:{
                type: "VOUCHER",
                percentDiscount: 10,
                totalDiscount: 20,
                amount: 20
            },
            slices: [
                {
                    sliceId: "MADLIS20240408112500",
                    detailedPrices: [{
                        passengerIds: ['ADULT_01'],
                        segmentPrices: [{
                            price: {
                                fare: 30
                            }
                        }],
                        fare: 50
                    }],
                    segments: [
                        {
                            cabin: {
                                fareFamily: "YPA",
                                rbd: "M",
                                code: "R"
                            },
                            id: "IB311020240408",
                            flight: {
                                operationalCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                },
                                marketingCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                }
                            },
                            departureDateTime: "2024-04-08 11:25",
                            departure: {
                                code: "MAD",
                                name: "BARAJAS",
                                terminal: "4",
                                city: {
                                    code: "MAD",
                                    description: "Madrid",
                                    countryCode: "ES",
                                    country: {
                                        code: "ES",
                                        description: "España"
                                    }
                                }
                            },
                            arrival: {
                                code: "LIS",
                                name: "AIRPORT",
                                terminal: "1",
                                city: {
                                    code: "LIS",
                                    description: "Lisboa",
                                    countryCode: "PT",
                                    country: {
                                        code: "PT",
                                        description: "Portugal"
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    sliceId: "MADLIS20240408112501",
                    detailedPrices: [{
                        passengerIds: ['ADULT_01'],
                        segmentPrices: [{
                            price: {
                                fare: 30
                            }
                        }],
                        fare: 50
                    }],
                    segments: [
                        {
                            cabin: {
                                fareFamily: "YPA",
                                rbd: "M",
                                code: "R"
                            },
                            id: "IB311020240408",
                            flight: {
                                operationalCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                },
                                marketingCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                }
                            },
                            departureDateTime: "2024-04-08 11:25",
                            departure: {
                                code: "MAD",
                                name: "BARAJAS",
                                terminal: "4",
                                city: {
                                    code: "MAD",
                                    description: "Madrid",
                                    countryCode: "ES",
                                    country: {
                                        code: "ES",
                                        description: "España"
                                    }
                                }
                            },
                            arrival: {
                                code: "LIS",
                                name: "AIRPORT",
                                terminal: "1",
                                city: {
                                    code: "LIS",
                                    description: "Lisboa",
                                    countryCode: "PT",
                                    country: {
                                        code: "PT",
                                        description: "Portugal"
                                    }
                                }
                            }
                        }
                    ]
                }
            ],
            bookingCreationDates: [
                {
                    creationDate: "2024-03-25",
                    provider: "IB"
                }
            ],
            orderItems: [{
                passengerPrices: [{
                    taxes: [{
                        code: 'YQ',
                        amount: 50
                    }]
                }]
            }]
        },
        paymentItems: [
            {
                type: "LGF",
                percentDiscount: 10,
                total: 20
            }
        ],
        passengers: [
            {
                passengerId: "ADULT_01",
                frequentFlyerInfo: {
                    number: "ASD9230"
                }
            }
        ],
        tickets: [
            {
                ticketNumbers: ["0751419193947"],
                issueDateTime: "2024-03-25 12:57",
                issuanceDate: true
            }
        ],
        fareFamilyConditions: [
            {
                commercialNameES: 'YPA'
            }
        ]
    };

    let fakeAncillariesSlices = [{ id: "MADLIS20240408112500", segmentIds: ['IB311020240408']}];

    let fakeAncillaries = [
        {
            type: "baggage",
            subtype: "BAGGAGE_15",
            passengerId: "ADULT_01",
            sliceId: "MADLIS20240408112500",
            price: {
                fare: 20
            },
            amount: 1,
            segmentId: "IB311020240408"
        },
        {
            type: "priorityBoarding",
            passengerId: "ADULT_01",
            sliceId: "MADLIS20240408112500",
            price: {
                fare: 20
            },
            amount: 1,
            segmentId: "IB311020240408"
        },
        {
            type: "seat",
            subtype: "bike",
            passengerId: "ADULT_01",
            sliceId: "MADLIS20240408112500",
            price: {
                fare: 20
            },
            amount: 1,
            segmentId: "IB311020240408"
        },
        {
            type: "other",
            passengerId: "ADULT_01",
            sliceId: "MADLIS20240408112500",
            price: {
                fare: 20
            },
            amount: 1,
            segmentId: "IB311020240408"
        }
    ];

    let fakeGenCalAviosSummaryResponse = {
        currency: {
            code: "EUR"
        },
        flight: {
            discounts: [
                {
                    type: "PARTNER",
                    percentDiscount: 10,
                    totalDiscount: 20
                },
                {
                    type: "LGF",
                    percentDiscount: 10,
                    totalDiscount: 20
                },
                {
                    type: 'VOUCHER',
                    percentDiscount: 10,
                    totalDiscount: 20
                }
            ],
            yq: 0,
            slices: [
                {
                    id: "MADLIS20240408112500",
                    segments: [
                        {
                            commercialCode: "YPA",
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                },
                {
                    id: "MADLIS20240408112501",
                    segments: [
                        {
                            commercialCode: "YPA",
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                }
            ]
        },
        passengers: [
            {
                id: "ADULT_01",
                memberIdentifier: "ASD9230",
                bookingSummary: {
                    bookingDate: "2024-03-25",
                    tickets: [
                        {
                            ticketingCarrier: {
                                code: "075"
                            },
                            number: "1419193947",
                            issuanceDate: "2024-03-25"
                        }
                    ]
                },
                ancillaries: [],
                flight: {
                    slices: [
                        {
                            id: "MADLIS20240408112500",
                            fare: 0,
                            totalFare: 0
                        },
                        {
                            id: "MADLIS20240408112501",
                            fare: 0,
                            totalFare: 0
                        }
                    ]
                }
            }
        ]
    };

    let fakeGenCalAviosSummaryResponseNull = {
        currency: {
            code: "EUR"
        },
        flight: {
            discounts: [
                {
                    type: "PARTNER",
                    percentDiscount: 10,
                    totalDiscount: 20
                },
                {
                    type: "LGF",
                    percentDiscount: 10,
                    totalDiscount: 20
                },
                {
                    type: 'VOUCHER',
                    percentDiscount: 10,
                    totalDiscount: 20
                }
            ],
            yq: 0,
            slices: [
                {
                    id: "MADLIS20240408112500",
                    segments: [
                        {
                            commercialCode: "YPA",
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                },
                {
                    id: "MADLIS20240408112501",
                    segments: [
                        {
                            commercialCode: "YPA",
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                }
            ]
        },
        passengers: [
            {
                id: "ADULT_01",
                memberIdentifier: "ASD9230",
                bookingSummary:  null,
                ancillaries: [],
                flight: {
                    slices: [
                        {
                            id: "MADLIS20240408112500",
                            fare: 0,
                            totalFare: 0
                        },
                        {
                            id: "MADLIS20240408112501",
                            fare: 0,
                            totalFare: 0
                        }
                    ]
                }
            }
        ]
    };

    let fakeGenCalAviosSummaryResponseNullonHold = {
        currency: {
            code: "EUR"
        },
        flight: {
            discounts: [
                {
                    type: "PARTNER",
                    percentDiscount: 10,
                    totalDiscount: 20
                },
                {
                    type: "LGF",
                    percentDiscount: 10,
                    totalDiscount: 20
                },
                {
                    type: 'VOUCHER',
                    percentDiscount: 10,
                    totalDiscount: 20
                }
            ],
            yq: 50,
            slices: [
                {
                    id: "MADLIS20240408112500",
                    segments: [
                        {
                            commercialCode: "YPA",
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                },
                {
                    id: "MADLIS20240408112501",
                    segments: [
                        {
                            commercialCode: "YPA",
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                }
            ]
        },
        passengers: [
            {
                id: "ADULT_01",
                memberIdentifier: "ASD9230",
                bookingSummary:  null,
                ancillaries: [],
                flight: {
                    slices: [
                        {
                            id: "MADLIS20240408112500",
                            fare: 30,
                            totalFare: 50
                        },
                        {
                            id: "MADLIS20240408112501",
                            fare: 30,
                            totalFare: 50
                        }
                    ]
                }
            }
        ]
    };

    let fakeMmBAppConstants = {
        AVAILABLE_COMMERCIAL_CODES: ["YPA", "BPA", "YPACONF"],
        ANCILLARIES_TYPES: {
            BAGGAGE: "BAGGAGE",
            SEAT: "SEAT",
            INSURANCE: "INSURANCE",
            VEHICLE_RENTAL: "VEHICLE_RENTAL",
            UPGRADING: "UPGRADING",
            SPEQS: "SPECIAL_EQUIPMENT",
            SPECIAL_MEALS: "SPECIAL_MEALS",
            UPGRADING_BID: "UPGRADING_BID",
            UPGRADING_AVIOS: "UPGRADING_AVIOS",
            UPGRADING_AVIOS_BID: "UPGRADING_AVIOS_BID",
            FLEXIBILITY: "FLEXIBILITY_ON_DEMAND",
            PREORDER: "PREORDER",
            PRIORITY_BOARDING: "PRIORITY_BOARDING",
            INTEGRATED_BOB: "INTEGRATED_BOB",
            BOB: "BOB",
            CO2_FOOTPRINT: "CO2_FOOTPRINT"
        },
        AVAILABLE_AVIOS_DISCOUNTS: ["PARTNER", "LGF", "VOUCHER", "RES"]
    };

    let copyFareData = {
        order: {
            price: {
                currency: "EUR"
            },
            specialDiscounts: [
                {
                    type: "PARTNER",
                    percentDiscount: 10,
                    totalDiscount: 20
                }
            ],
            voucherDiscount:{
                type: "VOUCHER",
                percentDiscount: 10,
                totalDiscount: 20,
                amount: 20
            },
            slices: [
                {
                    sliceId: "MADLIS20240408112500",
                    detailedPrices: [{
                        passengerIds: ['ADULT_01'],
                        segmentPrices: [{
                            price: {
                                fare: 30
                            }
                        }],
                        fare: 50
                    }],
                    segments: [
                        {
                            cabin: {
                                fareFamily: "YPA",
                                rbd: "M",
                                code: "R"
                            },
                            id: "IB311020240408",
                            flight: {
                                operationalCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                },
                                marketingCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                }
                            },
                            departureDateTime: "2024-04-08 11:25",
                            departure: {
                                code: "MAD",
                                name: "BARAJAS",
                                terminal: "4",
                                city: {
                                    code: "MAD",
                                    description: "Madrid",
                                    countryCode: "ES",
                                    country: {
                                        code: "ES",
                                        description: "España"
                                    }
                                }
                            },
                            arrival: {
                                code: "LIS",
                                name: "AIRPORT",
                                terminal: "1",
                                city: {
                                    code: "LIS",
                                    description: "Lisboa",
                                    countryCode: "PT",
                                    country: {
                                        code: "PT",
                                        description: "Portugal"
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    sliceId: "MADLIS20240408112501",
                    detailedPrices: [{
                        passengerIds: ['ADULT_01'],
                        segmentPrices: [{
                            price: {
                                fare: 30
                            }
                        }],
                        fare: 50
                    }],
                    segments: [
                        {
                            cabin: {
                                fareFamily: "YPA",
                                rbd: "M",
                                code: "R"
                            },
                            id: "IB311020240408",
                            flight: {
                                operationalCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                },
                                marketingCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                }
                            },
                            departureDateTime: "2024-04-08 11:25",
                            departure: {
                                code: "MAD",
                                name: "BARAJAS",
                                terminal: "4",
                                city: {
                                    code: "MAD",
                                    description: "Madrid",
                                    countryCode: "ES",
                                    country: {
                                        code: "ES",
                                        description: "España"
                                    }
                                }
                            },
                            arrival: {
                                code: "LIS",
                                name: "AIRPORT",
                                terminal: "1",
                                city: {
                                    code: "LIS",
                                    description: "Lisboa",
                                    countryCode: "PT",
                                    country: {
                                        code: "PT",
                                        description: "Portugal"
                                    }
                                }
                            }
                        }
                    ]
                }
            ],
            bookingCreationDates: [
                {
                    creationDate: "2024-03-25",
                    provider: "IB"
                }
            ],
            orderItems: [{
                passengerPrices: [{
                    taxes: [{
                        code: 'YQ',
                        amount: 50
                    }]
                }]
            }]
        },
        paymentItems: [
            {
                type: "LGF",
                percentDiscount: 10,
                total: 20
            }
        ],
        passengers: [
            {
                passengerId: "ADULT_01",
                frequentFlyerInfo: {
                    number: "ASD9230"
                }
            }
        ],
        fareFamilyConditions: [
            {
                commercialNameES: 'YPA'
            }
        ]
    };

    let copyFareData2 = {
        order: {
            price: {
                currency: "EUR"
            },
            specialDiscounts: [
                {
                    type: "PARTNER",
                    totalDiscount: 20
                }
            ],
            voucherDiscount:{
                type: "VOUCHER",
                totalDiscount: 20,
                amount: 20
            },
            slices: [
                {
                    sliceId: "MADLIS20240408112500",
                    detailedPrices: [{
                        passengerIds: ['ADULT_01'],
                        segmentPrices: []
                    }],
                    segments: [
                        {
                            cabin: {
                                fareFamily: "",
                                rbd: "M",
                                code: "R"
                            },
                            id: "IB311020240408",
                            flight: {
                                operationalCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                },
                                marketingCarrier: {
                                    code: "IB",
                                    name: "Iberia"
                                }
                            },
                            departureDateTime: "2024-04-08 11:25",
                            departure: {
                                code: "MAD",
                                name: "BARAJAS",
                                terminal: "4",
                                city: {
                                    code: "MAD",
                                    description: "Madrid",
                                    countryCode: "ES",
                                    country: {
                                        code: "ES",
                                        description: "España"
                                    }
                                }
                            },
                            arrival: {
                                code: "LIS",
                                name: "AIRPORT",
                                terminal: "1",
                                city: {
                                    code: "LIS",
                                    description: "Lisboa",
                                    countryCode: "PT",
                                    country: {
                                        code: "PT",
                                        description: "Portugal"
                                    }
                                }
                            }
                        }
                    ]
                }
            ],
            bookingCreationDates: [
                {
                    creationDate: "2024-03-25",
                    provider: "IB"
                }
            ],
            orderItems: [{
                passengerPrices: [{
                    taxes: [{
                        code: 'YQ',
                        amount: 50
                    }]
                }]
            }]
        },
        paymentItems: [
            {
                type: "LGF",
                total: 20
            }
        ],
        passengers: [
            {
                passengerId: "ADULT_01",
                frequentFlyerInfo: {
                    number: "ASD9230"
                }
            }
        ],
        tickets: [
            {
                ticketNumbers: ["0751419193947"],
                issueDateTime: "2024-03-25 12:57"
            }
        ],
        fareFamilyConditions: [
            {
                commercialNameES: 'YPA'
            }
        ]
    };

    let fakeGenCalAviosSummaryResponse2 = {
        currency: {
            code: "EUR"
        },
        flight: {
            discounts: [
                {
                    type: "PARTNER",
                    percentDiscount: null,
                    totalDiscount: 20
                },
                {
                    type: "LGF",
                    percentDiscount: null,
                    totalDiscount: 20
                },
                {
                    type: "VOUCHER",
                    percentDiscount: null,
                    totalDiscount: 20
                }
            ],
            yq: 50,
            slices: [
                {
                    id: "MADLIS20240408112500",
                    segments: [
                        {
                            commercialCode: null,
                            id: "IB311020240408",
                            operatingCarrier: {
                                code: "IB"
                            },
                            marketingCarrier: {
                                code: "IB"
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "LIS",
                                departureDate: "2024-04-08"
                            },
                            bookingClass: {
                                code: "M"
                            },
                            bookingCabin: {
                                code: "R"
                            },
                            fareProduct: 'YPA'
                        }
                    ]
                }
            ]
        },
        passengers: [
            {
                id: "ADULT_01",
                memberIdentifier: "ASD9230",
                bookingSummary: {
                    bookingDate: "2024-03-25",
                    tickets: [
                        {
                            ticketingCarrier: {
                                code: "075"
                            },
                            number: "1419193947",
                            issuanceDate: null
                        }
                    ]
                },
                ancillaries: [],
                flight: {
                    slices: [
                        {
                            id: "MADLIS20240408112500",
                            fare: null,
                            totalFare: null
                        }
                    ]
                }
            }
        ]
    };

    beforeEach(() => {
        angular.mock.module( "ib-MmB-transformers-module","LocalStorageModule", ($provide) => {
                $provide.value("MmBAppConstants", fakeMmBAppConstants);
            }
        );
        inject((_$rootScope_,_CalculatePointsTransformer_,_localStorageService_,_$q_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $q = _$q_;
            CalculatePointsTransformer = _CalculatePointsTransformer_;
        });
        $rootScope.$digest();
    });

    describe("When init", () => {
        it("CalculatePointsTransformer should be defined", (done) => {
            expect(CalculatePointsTransformer).toBeDefined();
            done();
        });
    });

    describe("When genCalAviosSummary is called & is not onHold", () => {
        it("Should generate request flightaviosinfo", (done) => {
            let result = CalculatePointsTransformer.genCalAviosSummary(
                fakeFareData,
                fakeAncillariesSlices,
                fakeAncillaries
            );
            expect(result).toEqual(fakeGenCalAviosSummaryResponse);
            done();
        });
    });

    describe("When genCalAviosSummary is called & is onHold", () => {
        it("Should generate request flightaviosinfo", (done) => {
            let result = CalculatePointsTransformer.genCalAviosSummary(fakeFareData,fakeAncillariesSlices, fakeAncillaries, true);
            expect(result).toBeDefined();
            done();
        });
    });

    describe("When TransCalcPointsData is called", () => {
        it("Should generate total points", (done) => {
            let result = CalculatePointsTransformer.TransCalcPointsData(fakeData);
            expect(result).toEqual({ Avios: 10, Elite: 10 });
            done();
        });
        it("Should generate total points", (done) => {
            let result = CalculatePointsTransformer.TransCalcPointsData({totalMonetaryAmount: []});
            expect(result).toEqual({ Avios: 0, Elite: 0 });
            done();
        });
    });

    describe("When TransCalcPointsForPassenger is called", () => {
        it("Should generate info amount for passenger", (done) => {
            let result = CalculatePointsTransformer.TransCalcPointsForPassenger(fakePassengersData);
            expect(result).toEqual([{ id: 1, memberIdentifier: "member1", avios: 10, elite: 20 }]);
            done();
        });
        it("Should null cases", (done) => {
            let result = CalculatePointsTransformer.TransCalcPointsForPassenger(fakePassengersData2);
            expect(result).toEqual([{ id: 1, memberIdentifier: null, avios: 0, elite: 0 }]);
            done();
        });
    });

    describe("When genCalAviosSummary is called & parameters default", () => {
        it("Should parameters default", (done) => {
            let result = CalculatePointsTransformer.genCalAviosSummary([]);
            expect(result).toEqual(null);
            done();
        });
    });

    describe("When genCalAviosSummary is called & parameters default", () => {
        it("Should not onHold", (done) => {
            let result = CalculatePointsTransformer.genCalAviosSummary(copyFareData);
            expect(result).toEqual(fakeGenCalAviosSummaryResponseNull);
            done();
        });
        it("Should onHold", (done) => {
            let result = CalculatePointsTransformer.genCalAviosSummary(copyFareData, null, null, true);
            expect(result).toEqual(fakeGenCalAviosSummaryResponseNullonHold);
            done();
        });
    });
    describe("When genCalAviosSummary is called & parameters default", () => {
        it("Should null cases", (done) => {
            let result = CalculatePointsTransformer.genCalAviosSummary(copyFareData2, null, null, true);
            expect(result).toEqual(fakeGenCalAviosSummaryResponse2);
            done();
        });
    });
});
