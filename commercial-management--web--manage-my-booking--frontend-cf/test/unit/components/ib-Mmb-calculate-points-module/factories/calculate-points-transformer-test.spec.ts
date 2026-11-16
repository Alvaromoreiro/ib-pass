describe("CalculatePointsTransformer Test", function () {
    var CalculatePointsTransformer, localStorageService, $q, $rootScope, $scope;

    var fakeData = {
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

    var fakePassengersData = {
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

    var fakeFareData = {
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
            voucherDiscount: [
                {
                    type: "VOUCHER",
                    percentDiscount: 10,
                    totalDiscount: 20
                }
            ],
            slices: [
                {
                    sliceId: "MADLIS20240408112500",
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
            ]
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
                issueDateTime: "2024-03-25 12:57"
            }
        ],
        fareFamilyConditions: [
            {
                commercialNameES: 'YPA'
            }
        ]
    };

    var fakeAncillariesSlices = [{ id: "IB311020240408" }];

    var fakeAncillaries = [
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
        }
    ];

    var fakeGenCalAviosSummaryResponse = {
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
                            fare: 0,
                            totalFare: 0
                        }
                    ]
                }
            }
        ]
    };

    var fakeMmBAppConstants = {
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

    beforeEach(function () {
        angular.mock.module(
            "ib-MmB-transformers-module",
            "LocalStorageModule",
            function ($provide) {
                $provide.value("MmBAppConstants", fakeMmBAppConstants);
            }
        );
        inject(function (
            _$rootScope_,
            _CalculatePointsTransformer_,
            _localStorageService_,
            _$q_
        ) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $q = _$q_;
            CalculatePointsTransformer = _CalculatePointsTransformer_;
        });
        $rootScope.$digest();
    });

    describe("When init", function () {
        it("CalculatePointsTransformer should be defined", function () {
            expect(CalculatePointsTransformer).toBeDefined();
        });
    });

    describe("When genCalAviosSummary is called & is not onHold", function () {
        it("Should generate request flightaviosinfo", function () {
            let result = CalculatePointsTransformer.genCalAviosSummary(
                fakeFareData,
                fakeAncillariesSlices,
                fakeAncillaries,
                false
            );
            expect(result).toEqual(fakeGenCalAviosSummaryResponse);
        });
    });

    xdescribe("When genCalAviosSummary is called & is onHold", function () {
        it("Should generate request flightaviosinfo", function () {
            let result = CalculatePointsTransformer.genCalAviosSummary(
                fakeFareData,
                fakeAncillariesSlices,
                fakeAncillaries,
                true
            );

        });
    });

    describe("When TransCalcPointsData is called", function () {
        it("Should generate total points", function () {
            let result =
                CalculatePointsTransformer.TransCalcPointsData(fakeData);
            expect(result).toEqual({ Avios: 10, Elite: 10 });
        });
    });

    describe("When TransCalcPointsForPassenger is called", function () {
        it("Should generate info amount for passenger", function () {
            let result =
                CalculatePointsTransformer.TransCalcPointsForPassenger(
                    fakePassengersData
                );
            expect(result).toEqual([
                { id: 1, memberIdentifier: "member1", avios: 10, elite: 20 }
            ]);
        });
    });
});
