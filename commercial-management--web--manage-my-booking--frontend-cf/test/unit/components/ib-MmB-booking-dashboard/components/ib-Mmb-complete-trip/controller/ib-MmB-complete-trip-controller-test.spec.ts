describe("CompleteTripController test", function () {
    var controller, $scope, $window, localStorageService, localStorageGetSpy;

    var fakeBookingDashboardConstants = {};
    var fakeBookingDashboardTransformer = {
        transformPartnersInfo: jasmine
            .createSpy("transformPartnersInfo")
            .and.callFake(function () {
                return "test";
            }),
    };

    var fakemodel = {
        bookingGeneralInfo: {
            returnInfo: {
                day: 1,
                monthNumber: 3,
                year: 2020,
            },
            departureInfo: {
                day: 1,
                monthNumber: 1,
                year: 2019,
            },
        },
        managementModel: {
            flights: [
                {
                    arrival: { city: { code: "test" } },
                },
            ],
        },
        passengersModel: {
            passengers: [
                {
                    passengerType: "test",
                },
                {
                    passengerType: "ADULT",
                },
                {
                    passengerType: "CHILD",
                },
                {
                    passengerType: "INFANT",
                },
            ],
        },
    };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine
            .createSpy("updateDatalayerWithQuadrigam")
            .and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy(),
    };

    var fakeMmBAppConstants = {
        QUADRIGAM: {
            STOP_OVER: "STOP_OVER",
            COMPLETE_TRAVEL: "COMPLETE_TRAVEL",
        },
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            VIEW: "VIEW",
        },
        DIGITAL_DATA_PROCESS: {
            ATCFCNA: "ads",
        },
        DIGITAL_DATA_STEP: {
            ATCFCNA: "asd",
        },
    };

    var fakeMmBUtilService = {
        isUserLogged: jasmine
            .createSpy("isUserLogged")
            .and.callFake(function () {
                return true;
            }),
        orderItemContained: jasmine
            .createSpy("orderItemContained")
            .and.callFake(function () {
                return true;
            }),
    };

    var fakeWindow = {
        open: function () {},
    };

    var fakeCommonsUtilService = {
        setTitlePage: jasmine
            .createSpy("setTitlePage")
            .and.callFake(function () {
                return "TITULO";
            }),
    };

    const fakeCompleteTripConstants = {
        PARTNERS: [
            {
                order: "0",
                name: "melia",
            },
            {
                order: "1",
                name: "booking",
            },
            {
                order: "2",
                name: "voucher_iberia",
            },
            {
                order: "3",
                name: "transporte_publico",
            },
            {
                order: "4",
                name: "alsa_vtc",
            },
            {
                order: "5",
                name: "avis",
            },
            {
                order: "6",
                name: "thyssen_bornemisza",
            },
            {
                order: "7",
                name: "alsa_prado",
            },
            {
                order: "8",
                name: "alsa_experiencias",
            },
            {
                order: "9",
                name: "corte_ingles",
            },
            {
                order: "10",
                name: "holafly",
            },
            {
                order: "11",
                name: "mad_madrid",
            },
            {
                order: "12",
                name: "galeria_canalejas",
            },
            {
                order: "13",
                name: "aprende_a_cocinar_una_paella",
            },
            {
                order: "14",
                name: "showcooking_ruben_arnanz",
            },
            {
                order: "15",
                name: "museo_real_madrid_y_zegna_boutique",
            },
        ],
    };

    var fakeAncillariesInfo = {
        ancillaries: [
            {
                type: 'THIRD_PARTY_COMPANIES',
                status: {
                    code: 'AVAILABLE'
                }
            },
            {
                type: 'ESIM',
                status: {
                    code: 'AVAILABLE'
                }
            }
        ],
        insuranceInfo: {},
        insuranceCountry: {}
    };

    var fakeBookingInfo = {
        contextMetadata: {
            language: "es",
            country: "ES",
            currencies: [
                {
                    code: "EUR",
                    description: "Euro",
                    symbol: "€",
                    alignment: "L",
                    groupingSeparator: ".",
                    decimalSeparator: ",",
                    decimals: 2,
                    recommendedDisplay: "symbol",
                },
            ],
        },
    };

    var fakeFlightAviosInfo = {
        currency: {
            code: "EUR",
        },
        flight: {
            discounts: [],
            yq: 0,
            slices: [
                {
                    id: "MADORY20230505181000",
                    segments: [
                        {
                            commercialCode: null,
                            id: "IB344020230505",
                            operatingCarrier: {
                                code: "IB",
                            },
                            marketingCarrier: {
                                code: "IB",
                            },
                            schedule: {
                                departureAirportCode: "MAD",
                                arrivalAirportCode: "ORY",
                                departureDate: "2023-05-05",
                            },
                            bookingClass: {
                                code: "R",
                            },
                            bookingCabin: {
                                code: "B",
                            },
                        },
                    ],
                },
            ],
        },
    };

    var fakeAncillariesSlices = [
        {
            id: "MADBCN20230812070000",
            segmentIds: ["IB300220230812"],
        },
        {
            id: "BCNMAD20230915070000",
            segmentIds: ["IB300320230915"],
        },
    ];

    var fakeAncillariesSlicesThreeSlices = [
        {
            id: "MADBCN20230812070000",
            segmentIds: ["IB300220230812"],
        },
        {
            id: "BCNMAD20230915070000",
            segmentIds: ["IB300320230915"],
        },
        {
            id: "BCNBIO20230915070000",
            segmentIds: ["IB300320230975"],
        }
    ];

    const fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc: any = () => {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return 'test';
                };
                break;
            case 'DurationFormatFilter':
                filterFunc = function (label) {
                    return 'test DurationFormatFilter';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    beforeEach(function () {
        
        angular.mock.module(
            "ib-MmB-complete-trip-module",
            "LocalStorageModule",
            function ($provide) {
                $provide.value("MmBUtilService", fakeMmBUtilService);
                $provide.value(
                    "BookingDashboardConstants",
                    fakeBookingDashboardConstants
                );
                $provide.value(
                    "BookingDashboardTransformer",
                    fakeBookingDashboardTransformer
                );
                $provide.value(
                    "MmBDatalayerUtilsService",
                    fakeDatalayerUtilsService
                );
                $provide.value("MmBAppConstants", fakeMmBAppConstants);
                $provide.value("MMBDatalayerConstants", fakeDatalayerConstants);
                $provide.value("MmBUtilService", fakeMmBUtilService);
                $provide.value("$window", fakeWindow);
                $provide.value("CommonsUtilService", fakeCommonsUtilService);
                $provide.value(
                    "CompleteTripConstants",
                    fakeCompleteTripConstants
                );
                $provide.value('$filter', fakeFilter);
            }
        );
        inject(function (_$rootScope_, _$controller_, _localStorageService_) {
            $scope = _$rootScope_.$new();
            $window = fakeWindow;
            controller = _$controller_("CompleteTripController", {
                $scope: $scope,
            });
            localStorageService = _localStorageService_;
            localStorageGetSpy = spyOn(localStorageService, "get");
            localStorageGetSpy
                .withArgs("bookingInfo")
                .and.returnValue(fakeBookingInfo);
            localStorageGetSpy
                .withArgs("ancillariesInfo")
                .and.returnValue(fakeAncillariesInfo);
            localStorageGetSpy
                .withArgs("flightAviosInfo")
                .and.returnValue(fakeFlightAviosInfo);
            localStorageGetSpy
                .withArgs("ancillariesSlices")
                .and.returnValue(fakeAncillariesSlices);
            localStorageGetSpy
                .withArgs("avisAvailable")
                .and.returnValue(null);

        });
    });

    describe("when activate is called", function () {
        it("Should set info partners on model", function (done) {
            controller.$onInit();
            expect(controller.partnersInfo[0]).toEqual({
                order: "0",
                name: "melia",
                title: "MMB_PARTNER_TITLE_MELIA",
                category: "MMB_PARTNER_CATEGORY_MELIA",
                action: "MMB_PARTNER_ACTION_MELIA",
                text: "MMB_PARTNER_TEXT_MELIA",
                link: "MMB_PARTNER_LINK_MELIA",
            });
            done();
        });

        it("Should set isStopOver is true", function (done) {
            controller.isStopOver = true;
            controller.$onInit();
            expect(controller.isStopOver).toBe(true);
            done();
        });

        xit("Should set isActivities true if satisfies conditions", function (done) {
            controller.$onInit();
            expect(controller.isActivities).toBe(true);
            done();
        });
    });

    describe("when activate is called", function () {
        beforeEach(function () {
        localStorageGetSpy
            .withArgs("bookingInfo")
            .and.returnValue(fakeBookingInfo);
        localStorageGetSpy
            .withArgs("ancillariesInfo")
            .and.returnValue(fakeAncillariesInfo);
        localStorageGetSpy
            .withArgs("flightAviosInfo")
            .and.returnValue(null);
        localStorageGetSpy
            .withArgs("ancillariesSlices")
            .and.returnValue(fakeAncillariesSlicesThreeSlices);
        });

        it("Should set isActivities false because not satisfies conditions", function (done) {
            controller.$onInit();
            expect(controller.isActivities).toBe(false);
            done();
        });
    });

    describe("when openLink is called", function () {
        xit("Should open new page there is return info and checkin time difference >= 30", function (done) {
            controller.model = angular.copy(fakemodel);
            spyOn($window, "open");
            controller.openLink("hotel");
            expect($window.open).toHaveBeenCalledWith(
                "https://www.booking.com/searchresults.html?aid=380264&label=pagemanagebooking-link-380264-click;checkin_monthday=1&checkin_year_month=2019-1&checkout_monthday=08&checkout_year_month=2019-01&%20&iata=test&iata_orr=1&no_rooms=1&group_adults=1&group_children=2",
                "_blank"
            );
            done();
        });

        it("Should open new page there is return info and checkin time difference <= 30", function (done) {
            controller.model = angular.copy(fakemodel);
            controller.model.bookingGeneralInfo.returnInfo = {
                day: 2,
                monthNumber: 1,
                year: 2019,
            };
            spyOn($window, "open");
            controller.openLink("hotel");
            expect($window.open).toHaveBeenCalledWith(
                "https://www.booking.com/searchresults.html?aid=380264&label=pagemanagebooking-link-380264-click;checkin_monthday=1&checkin_year_month=2019-1&checkout_monthday=2&checkout_year_month=2019-1&%20&iata=test&iata_orr=1&no_rooms=1&group_adults=1&group_children=2",
                "_blank"
            );
            done();
        });

        it("Should open new page there is no return info and checkin time difference <= 30", function (done) {
            controller.model = angular.copy(fakemodel);
            controller.model.bookingGeneralInfo.returnInfo = null;
            spyOn($window, "open");
            controller.openLink("hotel");
            expect($window.open).toHaveBeenCalledWith(
                "https://www.booking.com/searchresults.html?aid=380264&label=pagemanagebooking-link-380264-click;checkin_monthday=1&checkin_year_month=2019-1&%20&iata=test&iata_orr=1&no_rooms=1&group_adults=1&group_children=2",
                "_blank"
            );
            done();
        });

        it("Should open new page when data is equal to car", function (done) {
            controller.model = angular.copy(fakemodel);
            controller.model.bookingGeneralInfo.returnInfo = null;
            spyOn($window, "open");
            controller.openLink("car");
            expect($window.open).toHaveBeenCalledWith(
                "https://www.rentacar-iberia.com/?CID=pcaeses-20180625-paginadeinicio-001",
                "_blank"
            );
            done();
        });

        it("Should do nothing when data is dintint of hotel or car", function (done) {
            controller.model = angular.copy(fakemodel);
            controller.model.bookingGeneralInfo.returnInfo = null;
            spyOn($window, "open");
            controller.openLink("");
            expect($window.open).not.toHaveBeenCalled();
            done();
        });
    });

    describe("isAvailableVehicleRental", function () {
        it("should return false if ancillariesInfo is null", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue(null);
            controller.$onInit();
            expect(controller.showVehicleRental).toBe(false);
        });

        it("should return false if there is no ancillary of type VEHICLE_RENTAL", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "THIRD_PARTY_COMPANIES", status: { code: "AVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.showVehicleRental).toBe(false);
        });

        it("should return false if there is VEHICLE_RENTAL but status.code is not AVAILABLE", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "VEHICLE_RENTAL", status: { code: "UNAVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.showVehicleRental).toBe(false);
        });

        it("should return true if there is VEHICLE_RENTAL and status.code is AVAILABLE", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "VEHICLE_RENTAL", status: { code: "AVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.showVehicleRental).toBe(true);
        });
    });
    describe("isAvailableEsim", function () {
        it("should return true if there is ESIM and status.code is AVAILABLE", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "ESIM", status: { code: "AVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.isEsim).toBe(true);
        })
        it("should return false if there is ESIM and status.code is NOT_AVAILABLE", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "ESIM", status: { code: "NOT_AVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.isEsim).toBe(false);
        })
        it("should return false if there is NOT ESIM", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "VEHICLE_RENTAL", status: { code: "AVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.isEsim).toBe(false);
        })
    });

    describe('isAvisAvailable', () => {
        it("should return false if there is there are not ancillaries ", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue(undefined);
            controller.$onInit();
            expect(controller.isAvis).toBe(false);
        })
        it("should return true if there is AVIS_BUDGET and status.code is AVAILABLE", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "AVIS_BUDGET", status: { code: "AVAILABLE" } }
                ]
            });
            controller.$onInit();
            expect(controller.isAvis).toBe(true);
        })
        it("should return true if there is AVIS_BUDGET and status.code is NOT_AVAILABLE but reason is AVIS_AVL_ERR_0001", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "AVIS_BUDGET", status: { code: "NOT_AVAILABLE", reason: "AVIS_AVL_ERR_0001" } }
                ]
            });
            controller.$onInit();
            expect(controller.isAvis).toBe(true);
        })
        it("should call getAvisModalConfiguration with false if isAvisReserved", function () {
            localStorageGetSpy.withArgs("ancillariesInfo").and.returnValue({
                ancillaries: [
                    { type: "AVIS_BUDGET", status: { code: "NOT_AVAILABLE", reason: "AVIS_AVL_ERR_0001" } }
                ]
            });
            controller.$onInit();
            expect(controller.isAvis).toBe(true);
            expect(controller.avisModalConfiguration.modifyButton).toBe(true)
        })
    })
});
