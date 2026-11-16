describe("IbFlexAvailabilityController test", () => {
    let $scope, $rootScope, localStorageService, $controller, controller, mockError, $timeout, $q;

    let fake$scope = {
        $emit: jasmine.createSpy(),
    };

    let fakeDatalayerUtilsService = {
        updateDatalayerInfo: jasmine.createSpy(),
    };

    let fakeMmBUtilsSharedService = {
        updateQuadrigam: jasmine.createSpy(),
    };

    let fakeMmBAppConstants = {
        QUADRIGAM: {
            FLEXIBILIZATION_AVAILABILITY_ONE_WAY: "CVFPOW",
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY: "CIFPOW",
            FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE: "CVFPSG",
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN: "CIFPRT",
            FLEXIBILIZATION_AVAILABILITY_RETURN: "CVFPRT",
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE: "CIFPSG",
            FLEXIBILIZATION_INVOLUNTARY_REBOOK_SERVICE_ERROR: "CIFERS",
            FLEXIBILIZATION_REBOOK_SERVICE_ERROR: "CVFERS",
            FLEXIBILIZATION_REBOOK_ERROR: "CVFERF",
            FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR: "CIFERB",
            FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY: "CIFERR",
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR: "CIFERD",
            FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR: "CVFERB",
            FLEXIBILIZATION_NOT_AVAILABILITY: "CVFERR",
            FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR: "CVFERD",
        },
        PAGES_URL: {
            REBOOK_ERROR: "/rbkerr",
        },
        PNR_EMITION_CHANNEL: {
            FLEX_FLIGHT_DIRECT: ["IBCOM", "CALL_CENTER", "NDC_DIRECT"],
            FLEX_FLIGHT_INDIRECT: ["NDC_INDIRECT", "OTHER"],
        },
    };

    let fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy("setTitlePage").and.callFake(() => {
            return "TITULO";
        }),
    };

    let fakeDisruptionUtilService = {
        quadrigamByTypeFlow: jasmine.createSpy().and.returnValue(fakeMmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_ONE_WAY),
    };

    let fakeIbFlexAvailabilityService = {
        availabilityInit: jasmine.createSpy(),
        callAvailabilityNewDate: jasmine.createSpy(),
        callRibbonMoreDates: jasmine.createSpy(),
    };

    let fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy(),
        showGenericError: jasmine.createSpy(),
        closeAllCurrentModals: jasmine.createSpy(),
        showGenericModal: jasmine.createSpy(),
    };

    let fakeIbFlexibilizationService = {
        rebook: jasmine.createSpy(),
    };

    let fakeBookingInfoWithOneSlice = {
        order: {
            status: "ENABLED",
            slices: [
                {
                    segments: [
                        {
                            cabin: {
                                fareFamily: "Turista",
                                bookingClass: "Standard",
                            },
                            flight: {
                                operationalDisclosure: "IB",
                                operationalFlightNumber: "0256",
                                marketingFlightNumber: "0256",
                            },
                            departure: {
                                city: {
                                    code: "MAD",
                                },
                            },
                            arrival: {
                                city: {
                                    code: "BCN",
                                },
                            },
                        },
                    ],
                    departureDateTime: "2024-03-06 14:55",
                    arrivalDateTime: "2024-04-10 18:35",
                },
            ],
        },
    };

    let fakeBookingInfoWithTwoSlices = {
        order: {
            status: "ENABLED",
            slices: [
                {
                    segments: [
                        {
                            cabin: {
                                fareFamily: "Turista",
                                bookingClass: "Standard",
                            },
                            flight: {
                                operationalDisclosure: "IB",
                                operationalFlightNumber: "0256",
                                marketingFlightNumber: "0256",
                            },
                            departure: {
                                city: {
                                    code: "MAD",
                                },
                            },
                            arrival: {
                                city: {
                                    code: "BCN",
                                },
                            },
                        },
                    ],
                    departureDateTime: "2024-03-06 14:55",
                    arrivalDateTime: "2024-04-10 18:35",
                },
                {
                    segments: [
                        {
                            cabin: {
                                fareFamily: "Turista",
                                bookingClass: "Standard",
                            },
                            flight: {
                                operationalDisclosure: "IB",
                                operationalFlightNumber: "0257",
                                marketingFlightNumber: "0257",
                            },
                            departure: {
                                city: {
                                    code: "BCN",
                                },
                            },
                            arrival: {
                                city: {
                                    code: "MAD",
                                },
                            },
                        },
                    ],
                    departureDateTime: "2024-03-06 14:55",
                    arrivalDateTime: "2024-04-10 18:35",
                },
            ],
        },
    };

    let fakeAvailabilityFlexData = {
        parsedRelatedContent: {
            FLIGHTS_NOT_OPERATED_BY_GROUP_IBERIA:"FLIGHTS_NOT_OPERATED_BY_GROUP_IBERIA",
        },
    };

    let mockError1003 = {
        internalErrorCode: "SSE_MMB_1003",
        data: {
            errors: [{ reason: "com.ib.framework.error.PAC_UTILS_E0005" }],
        },
        message: "error",
    };

    let mockError1 = {
        internalErrorCode: "SSE_MMB_1004",
        data: {
            errors: [{ reason: "com.ib.framework.error.PAC_UTILS_E0005" }],
        },
        message: "error",
    };

    let mockError2 = {
        errorCode: 400,
        internalErrorCode: "SSE_MMB_1000",
        data: {
            errors: [{ reason: "com.ib.framework.error.PAC_UTILS_E0005" }],
        },
        message: "error",
    };

    let mockError3 = {
        internalErrorCode: "SSE_MMB_1007",
        data: {
            errors: [{ reason: "com.ib.framework.error.PAC_UTILS_E0005" }],
        },
        message: "error",
    };

    let mockError4 = {
        internalErrorCode: "SSE_MMB_1010",
        data: {
            errors: [{ reason: "com.ib.framework.error.PAC_UTILS_E0005" }],
        },
        message: "error",
    };

    let fakePhoneList = {
        RESERVAS: {
            prefix: "(+34) ",
            telephone: "900 111 500",
            text: "Reservas y Venta:",
            prefixAlt: "(+34) ",
            telephoneAlt: "915 23 65 68",
            textAlt: "",
            timeText: "24h de Lunes a Domingo.",
        },
    };

    let $filterFake = jasmine.createSpy("$filter").and.callFake((filter) => {
        let filterFunc: any = () => {
            return [];
        };
        filterFunc = () => {
            return "";
        };
        return filterFunc;
    });

    let faketranslate = {
        onReady: jasmine.createSpy(),
    };

    beforeEach(() => {
        angular.mock.module("ib-flexibilization-availability-module", "LocalStorageModule", ($provide) => {
            $provide.value("$scope", fake$scope);
            $provide.value("MmBDatalayerUtilsService", fakeDatalayerUtilsService);
            $provide.value("MmBAppConstants", fakeMmBAppConstants);
            $provide.value("CommonsUtilService", fakeCommonsUtilService);
            $provide.value("DisruptionUtilService", fakeDisruptionUtilService);
            $provide.value("IbFlexAvailabilityService", fakeIbFlexAvailabilityService);
            $provide.value("MmBModalService", fakeMmBModalService);
            $provide.value("IbFlexibilizationService", fakeIbFlexibilizationService);
            $provide.value("$filter", $filterFake);
            $provide.value("$translate", faketranslate);
            $provide.value("MmBUtilsSharedService", fakeMmBUtilsSharedService);
        });

        inject((_$controller_, _$rootScope_, _localStorageService_, _$timeout_, _$q_) => {
            $timeout = _$timeout_;
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $q = _$q_;
            controller = $controller("IbFlexAvailabilityController", {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: localStorageService,
            });
            $rootScope.$digest();
        });
    });

    describe("when activate() is called, bookingInfo have one slice & disruptionFlow is false", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithOneSlice);
            localStorageService.set('typeDisruptionFlow', null)
            $rootScope.isDisruptionFlow = false;
        }));

        it("should call setTitlePage with correct quadrigam", (done) => {
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeCommonsUtilService.setTitlePage).toHaveBeenCalledWith("MMB_TITLE_FLEXIBILIZATION_AVAILABILITY_ONE_WAY");
            done();
        });
    });

    describe("when activate() is called, bookingInfo have one slice & disruptionFlow is true", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithOneSlice);
            localStorageService.set('typeDisruptionFlow', null);
            $rootScope.isDisruptionFlow = true;
        }));

        it("should call setTitlePage with correct quadrigam", (done) => {
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe("when activate() is called, bookingInfo have one slice & typeFlowDisruption is true", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithOneSlice);
            localStorageService.set('typeDisruptionFlow', true);
            $rootScope.isDisruptionFlow = false;
        }));

        it("should call setTitlePage with correct quadrigam", (done) => {
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe("when activate() is called, bookingInfo have two slices & disruptionFlow is false & availabilities length is 2", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set('typeDisruptionFlow', null);
            $rootScope.isDisruptionFlow = false;
            controller.availabilityData = {
                availabilityDataResponse: {
                    availabilities: [{ name: "test1" }, { name: "test2" }],
                },
            };
        }));

        it("should set correct quadrigam", (done) => {
            controller.$onInit();
            $rootScope.$digest();
            expect(controller.quadrigam).toBe(fakeMmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_RETURN);
            done();
        });
    });

    describe("when activate() is called, bookingInfo have two slices & disruptionFlow is true & availabilities length is 2", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set('typeDisruptionFlow', null);
            $rootScope.isDisruptionFlow = true;
            controller.availabilityData = {
                availabilityDataResponse: {
                    availabilities: [{ name: "test1" }, { name: "test2" }],
                },
            };
        }));

        it("should set correct quadrigam involuntary availability", (done) => {
            controller.$onInit();
            $rootScope.$digest();
            expect(controller.quadrigam).toBe(fakeMmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN);
            done();
        });
    });

    describe("when activate() is called, bookingInfo have two slices & disruptionFlow is false & availabilities length is 2 and typeDisruptionFlow true", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set('typeDisruptionFlow', true)
            $rootScope.isDisruptionFlow = false;
            controller.availabilityData = {
                availabilityDataResponse: {
                    availabilities: [{ name: "test1" }, { name: "test2" }],
                },
            };
        }));

        it("should set correct quadrigam typeDisruptionFlow true", (done) => {
            controller.$onInit();
            $rootScope.$digest();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe("when activate() is called, bookingInfo have two slices & disruptionFlow is false & availabilities length is 0", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set('typeDisruptionFlow', null)
            $rootScope.isDisruptionFlow = false;
            controller.availabilityData = {
                availabilityDataResponse: {
                    availabilities: [],
                },
            };
            localStorageService.set("availabilityFlexData", fakeAvailabilityFlexData);
        }));

        it("should call setTitlePage with correct quadrigam", (done) => {
            controller.$onInit();
            $rootScope.$digest(); $rootScope.$digest();
            expect(fakeCommonsUtilService.setTitlePage).toHaveBeenCalledWith("MMB_TITLE_FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE");
            done();
        });
    });
    describe("when activate() is called, bookingInfo have two slices & typeDisruptionFlow is true & availabilities length is 0", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set('typeDisruptionFlow', true)
            $rootScope.isDisruptionFlow = false;
            controller.availabilityData = {
                availabilityDataResponse: {
                    availabilities: [],
                },
            };
            localStorageService.set("availabilityFlexData", fakeAvailabilityFlexData);
        }));

        it("should call setTitlePage with correct quadrigam with typedisruptionFLow true", (done) => {
            controller.$onInit();
            $rootScope.$digest(); $rootScope.$digest();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe("when activate() is called, bookingInfo have two slices & disruptionFlow is true & availabilities length is 0", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set('typeDisruptionFlow', null)
            $rootScope.isDisruptionFlow = true;
            controller.availabilityData = {
                availabilityDataResponse: {
                    availabilities: [],
                },
            };
            localStorageService.set("availabilityFlexData", fakeAvailabilityFlexData);
        }));

        it("should call setTitlePage with correct quadrigam disruptionFlow true", (done) => {
            controller.$onInit();
            $rootScope.$digest(); $rootScope.$digest();
            expect(controller.quadrigam).toBe(fakeMmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE);
            done();
        });
    });

    describe("when submitConfirm() is called & rebook resolves the promise & confirmationData has no partialError", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            $rootScope.isDisruptionFlow = false;
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });
        }));

        it("should emit event nextStep", (done) => {
            spyOn($scope, "$emit");
            controller.submitConfirm();
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith("nextStep", {});
            done();
        });
    });

    describe("when submitConfirm() is called & rebook resolves the promise & confirmationData has partialError", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve({ hasPartialError: true });
                return deferred.promise;
            });
            fakeMmBModalService.showGenericModal = jasmine.createSpy("showGenericModal").and.callFake(() => {
                // Simulate modal acceptance
                return {
                    result: {
                        then: (onAccept) => {
                            onAccept();
                        },
                    },
                };
            });
        }));

        it("should emit event nextStep", (done) => {
            spyOn($scope, "$emit");
            controller.submitConfirm();
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith("nextStep", {
                hasPartialError: true,
            });
            done();
        });
    });

    describe("when submitConfirm() is called & rebook resolves the promise & confirmationData has partialError and reject showGenericModal", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve({ hasPartialError: true });
                return deferred.promise;
            });
            fakeMmBModalService.showGenericModal = jasmine.createSpy("showGenericModal").and.callFake(() => {
                // Simulate modal error
                return {
                    'result': $q.reject()
                };
            });
        }));

        it("should emit event nextStep", (done) => {
            spyOn($scope, "$emit");
            controller.submitConfirm();
            $rootScope.$digest();
            expect($scope.$emit).toHaveBeenCalledWith("nextStep", {hasPartialError: true});
            done();
        });
    });

    describe("when submitConfirm() is called & rebook reject the promise & internalErrorCode is SSE_MMB_1003", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set("phonesList", fakePhoneList);
            localStorageService.set("pnrChannel", "IBCOM");
            $rootScope.isDisruptionFlow = true;
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError1003);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                // Simulate modal error
                return {
                    result: {
                        then: function (onError) {
                            onError();
                        },
                    },
                };
            });
        }));

        it("should call MmBModalService showGenericError", (done) => {
            controller.submitConfirm();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

    describe("when submitConfirm() is called & rebook reject the promise & internalErrorCode is SSE_MMB_1004", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set("phonesList", null);
            localStorageService.set("pnrChannel", "IBCOM");
            $rootScope.isDisruptionFlow = true;
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError1);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                // Simulate modal error
                return {
                    result: {
                        then: function (onError) {
                            onError();
                        },
                    },
                };
            });
        }));

        it("should call MmBModalService showGenericError", (done) => {
            controller.submitConfirm();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

    describe("when submitConfirm() is called & rebook reject the promise & internalErrorCode is SSE_MMB_1000", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo",fakeBookingInfoWithTwoSlices);
            localStorageService.set("phonesList", fakePhoneList);
            localStorageService.set("pnrChannel", "IBCOM");
            $rootScope.isDisruptionFlow = false;
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError2);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                return {
                    result: $q.when({}),
                };
            });
        }));

        it("should call MmBModalService showGenericError", (done) => {
            controller.submitConfirm();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

    describe("when submitConfirm() is called & rebook reject the promise & internalErrorCode is SSE_MMB_1007", () => {
        beforeEach(inject(() => {
            localStorageService.set("bookingInfo",fakeBookingInfoWithTwoSlices);
            localStorageService.set("phonesList", fakePhoneList);
            localStorageService.set("pnrChannel", "IBCOM");
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError3);
                return deferred.promise;
            });
        }));

        it("should call MmBModalService closeAllCurrentModals", (done) => {
            controller.submitConfirm();
            $rootScope.$digest();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });

    describe("when submitConfirm() is called & rebook reject the promise & internalErrorCode is SSE_MMB_1010 & channel is IBCOM", () => {
        beforeEach(inject(function (localStorageService, $q) {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set("phonesList", fakePhoneList);
            localStorageService.set("pnrChannel", "IBCOM");
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError4);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                return {
                    result: $q.when({}),
                };
            });
        }));

        it("should call MmBModalService showGenericError", (done) => {
            controller.submitConfirm();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

    describe("when submitConfirm() is called & rebook reject the promise & internalErrorCode is SSE_MMB_1010 & channel is NDC_INDIRECT", () => {
        beforeEach(inject(function (localStorageService, $q) {
            localStorageService.set("bookingInfo", fakeBookingInfoWithTwoSlices);
            localStorageService.set("phonesList", fakePhoneList);
            localStorageService.set("pnrChannel", "NDC_INDIRECT");
            controller.model = {
                flowId: "ASDKLLKFDSF",
                selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
            };
            fakeIbFlexibilizationService.rebook = jasmine.createSpy("rebook").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError4);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                return {
                    result: $q.when({}),
                };
            });
        }));

        it("should call MmBModalService closeAllCurrentModals", (done) => {
            controller.submitConfirm();
            $rootScope.$digest();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        });
    });

    describe("when optionSelected() is called", () => {
        beforeEach(inject(() => {
            controller.model = {
                tripsLength: 1,
                selectedSlices: [true, true],
                totalShow: false,
                listSlicesShow: 0,
            };
            controller.modal = {
                listSlicesShow: 0,
            };
        }));

        it("totalShow should be true & listSlicesShow should be 1", (done) => {
            controller.optionSelected();
            $timeout.flush();
            expect(controller.model.totalShow).toBe(true);
            expect(controller.model.listSlicesShow).toBe(1);
            done()
        });
    });

    describe("when ribbonCall() is called & callRibbonMoreDates resolves the promise", () => {
        beforeEach(inject(($q) => {
            controller.model = {
                selectedDate: ["12-12-1989"],
            };
            fakeIbFlexAvailabilityService.callRibbonMoreDates = jasmine.createSpy("callRibbonMoreDates").and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve("test");
                return deferred.promise;
            });
        }));

        it("should emit broadcast event ribbonFlexDataUpdate", (done) => {
            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("nextDatesSearch", true, "24-12-1989", 0);
            $rootScope.$digest();
            expect($scope.$broadcast).toHaveBeenCalledWith("ribbonFlexDataUpdate","test",true);
            done();
        });
    });

    describe("when ribbonCall() is called & callRibbonMoreDates reject the promise", () => {
        beforeEach(inject(($q) => {
            controller.model = {
                selectedDate: ["12-12-1989"],
            };
            fakeIbFlexAvailabilityService.callRibbonMoreDates = jasmine.createSpy("callRibbonMoreDates").and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
        }));

        it("should emit broadcast event ribbonFlexDataUpdate", (done) => {
            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("nextDatesSearch", true, "24-12-1989", 0);
            $rootScope.$digest();
            expect($scope.$broadcast).toHaveBeenCalledWith("ribbonFlexDataUpdate", null, true);
            done();
        });
    });

    describe("when availabilityCall() is called & callAvailabilityNewDate resolve the promise", () => {
        beforeEach(inject(() => {
            controller.model = {
                showAvailability: false
            };
        }));
        it("should availabilityCall and callAvailabilityNewDate resolve", (done) => {
            inject(($q) => {
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeIbFlexAvailabilityService.availabilityInit = jasmine.createSpy("availabilityInit").and.callFake(() => {
                    return {
                        flowId: "ASDKLLKFDSF",
                        selectedSlices: ["ASDSAD12313", "DFDSFDSF233"],
                        showAvailability: false,
                        updatedDateList: '10/10/2023',
                        ribbonFlexData: '10/10/2023'
                    };
                });
            });
            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('should availabilityCall and reject callAvailabilityNewDate and 400', (done) => {
            inject(($q) => {
                let mockError = {
                    errorCode: 400,
                    internalErrorCode: 'SSE_AVM_18002',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                    return {
                        result: $q.when({}),
                    };
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    },
                    showAvailability: false
                };
            });

            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('should availabilityCall and reject callAvailabilityNewDate and 400 and SSE_AVM_18007', (done) => {
            inject(($q) => {
                let mockError = {
                    errorCode: 400,
                    internalErrorCode: 'SSE_AVM_18007',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                    return {
                        result: $q.when({}),
                    };
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    },
                    showAvailability: false
                };
            });

            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('should availabilityCall and reject callAvailabilityNewDate and 404', (done) => {
            inject(($q) => {
                let mockError = {
                    errorCode: 404,
                    internalErrorCode: 'SSE_AVM_12001',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    }
                };
            });

            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('should availabilityCall and reject callAvailabilityNewDate and other error', (done) => {
            inject(($q) => {
                let mockError = {
                    errorCode: 412,
                    internalErrorCode: 'other',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                    return {
                        result: $q.when({}),
                    };
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    }
                };
            });

            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
        it('should availabilityCall and reject callAvailabilityNewDate and 400 and SSE_AVM_18002 disruption FLOW', (done) => {
            inject(($q) => {
                let mockError = {
                    errorCode: 400,
                    internalErrorCode: 'SSE_AVM_18002',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                    return {
                        result: $q.when({}),
                    };
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    },
                    showAvailability: false
                };
            });
            $rootScope.isDisruptionFlow = true;
            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('should availabilityCall and reject callAvailabilityNewDate and 404 disruption FLOW', (done) => {
            inject(() => {
                let mockError = {
                    errorCode: 404,
                    internalErrorCode: 'SSE_AVM_12001',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    }
                };
            });
            $rootScope.isDisruptionFlow = true;
            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('should availabilityCall and reject callAvailabilityNewDate and other error disruption FLOW', (done) => {
            inject(($q) => {
                let mockError = {
                    errorCode: 412,
                    internalErrorCode: 'other',
                    title: {
                        message: 'tal'
                    },
                    needsTranslate: true,
                    message: 'test'
                }
                fakeIbFlexAvailabilityService.callAvailabilityNewDate = jasmine.createSpy("callAvailabilityNewDate").and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBModalService.showGenericError = jasmine.createSpy("showGenericError").and.callFake(() => {
                    return {
                        result: $q.when({}),
                    };
                });
                controller.model = {
                    showErrorPage: {
                        isError: false,
                        errorData: {}
                    }
                };
            });
            $rootScope.isDisruptionFlow = true;
            spyOn($scope, "$broadcast");
            $rootScope.$broadcast("newDateSalected", true);
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });
});
