import { TestBed } from "@angular/core/testing";
import { IbMmbAviosSummaryService } from "@src/app/shared/components/ib-MmB-avios-summary/services/ib-MmB-avios-summary-service";
import { IbMmbAviosSummaryTransformer } from "@src/app/shared/components/ib-MmB-avios-summary/services/ib-MmB-avios-summary-transformer";
import { ibMmbCalculatePointsService } from "@src/components/services/ib-calculate-points-service";
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";
import {
    CommonsSessionStorageService,
    AJSRootScope,
} from "ib-web-commons/utils";

let fakeIbMmbCalculatePointsService = {
    getCalculateAviosAncillaries: jasmine.createSpy(),
    getCalculateAviosSummary: jasmine.createSpy()
};

let fakeIbMmbAviosSummaryTransformer = {
    generateReqAviosSummaryModel: jasmine.createSpy(),
    generateResAviosSummaryModel: jasmine.createSpy().and.callFake(() => {
        return { totalAvios: 10, totalPoints: 20 };
    })
};

let fakeRootScope = {
    $digest: () => {},
    $broadcast: () => {}
};

let fakeResquest = {
    currency: {
        code: "EUR"
    },
    flight: {
        discounts: [],
        yq: 0,
        slices: [
            {
                id: "MADFCO20240909084500",
                segments: [
                    {
                        commercialCode: null,
                        id: "IB323020240909",
                        operatingCarrier: {
                            code: "IB"
                        },
                        marketingCarrier: {
                            code: "IB"
                        },
                        schedule: {
                            departureAirportCode: "MAD",
                            arrivalAirportCode: "FCO",
                            departureDate: "2024-09-09"
                        },
                        bookingClass: {
                            code: "B"
                        },
                        bookingCabin: {
                            code: "R"
                        }
                    }
                ]
            }
        ]
    },
    passengers: [
        {
            id: "ADULT_01",
            bookingSummary: {
                bookingDate: "2024-05-27",
                tickets: [
                    {
                        ticketingCarrier: {
                            code: "075"
                        },
                        number: "1426474390",
                        issuanceDate: null
                    },
                    {
                        ticketingCarrier: {
                            code: "075"
                        },
                        number: "4403218274",
                        issuanceDate: null
                    }
                ]
            },
            ancillaries: [
                {
                    type: "BAGGAGE",
                    subType: "BAGGAGE_23",
                    slices: [
                        {
                            id: "MADFCO20240909084500",
                            amounts: [
                                {
                                    fare: 33,
                                    quantity: 1
                                }
                            ],
                            segments: [
                                {
                                    id: "IB323020240909"
                                }
                            ]
                        }
                    ]
                }
            ],
            flight: {
                slices: [
                    {
                        id: "MADFCO20240909084500",
                        fare: 0,
                        totalFare: 0
                    }
                ]
            }
        }
    ]
};

let timeoutError = "TIMEOUT_ERROR";

describe("Test IbMmbAviosSummaryService", () => {
    let service: IbMmbAviosSummaryService;
    let localStorageService: StorageServiceMock = new StorageServiceMock();

    beforeEach(async () => {
        localStorageService.clear();
        await TestBed.configureTestingModule({
            imports: [],
            providers: [
                IbMmbAviosSummaryService,
                {
                    provide: ibMmbCalculatePointsService,
                    useValue: fakeIbMmbCalculatePointsService,
                },
                {
                    provide: IbMmbAviosSummaryTransformer,
                    useValue: fakeIbMmbAviosSummaryTransformer,
                },
                {
                    provide: CommonsSessionStorageService,
                    useValue: localStorageService,
                },
                { provide: AJSRootScope, useValue: fakeRootScope },
            ],
        });
        service = TestBed.inject(IbMmbAviosSummaryService);
    });

    describe("When getCalculateAviosSummary is called, flowApp is MMBANC & service resolve the promise", () => {
        beforeEach(() => {
            localStorageService.set('flowApp', 'MMBANC');
        });
        it("Should return correct response", (done) => {
            inject(() => {
                fakeIbMmbCalculatePointsService.getCalculateAviosAncillaries = jasmine.createSpy('getCalculateAviosAncillaries').and.callFake(() => {
                    return Promise.resolve({ totalAvios: 10, totalPoints: 20});
                });
            });
            service.flowApp = 'MMBANC';
            service.getCalculateAviosSummary(fakeResquest).then((responseData) => {
                expect(responseData).toEqual({ totalAvios: 10, totalPoints: 20});
                done();
            }).catch(() => {
                done.fail();
            });
        });
    });

    describe("When getCalculateAviosSummary is called, flowApp is MMBANC & service reject the promise", () => {
        beforeEach(() => {
            localStorageService.set('flowApp', 'MMBANC');
        });
        it("Should return correct response", (done) => {
            inject(() => {
                fakeIbMmbCalculatePointsService.getCalculateAviosAncillaries = jasmine.createSpy('getCalculateAviosAncillaries').and.callFake(() => {
                    return Promise.reject(timeoutError);
                });
            });
            service.flowApp = 'MMBANC';
            service.getCalculateAviosSummary(fakeResquest).then(() => {
                done.fail();
            }).catch((error) => {
                expect(error).toEqual('TIMEOUT_ERROR');
                done();
            });
        });
    });

    describe("When getCalculateAviosSummary is called, flowApp is not MMBANC, not MMB & service resolve the promise", () => {
        it("Should return correct response", (done) => {
            inject(() => {
                fakeIbMmbCalculatePointsService.getCalculateAviosSummary = jasmine.createSpy('getCalculateAviosSummary').and.callFake(() => {
                    return Promise.resolve({ totalAvios: 10, totalPoints: 20});
                });
            });
            service.getCalculateAviosSummary(fakeResquest).then((responseData) => {
                expect(responseData).toEqual({ totalAvios: 10, totalPoints: 20});
                done();
            }).catch(() => {
                done.fail();
            });
        });
    });

    describe("When getCalculateAviosSummary is called, flowApp is not MMBANC, not MMB & service reject the promise", () => {
        it("Should return specific error", (done) => {
            inject(() => {
                fakeIbMmbCalculatePointsService.getCalculateAviosSummary = jasmine.createSpy('getCalculateAviosSummary').and.callFake(() => {
                    return Promise.reject(timeoutError);
                });
            });
            service.getCalculateAviosSummary(fakeResquest).then(() => {
                done.fail();
            }).catch((error) => {
                expect(error).toEqual('TIMEOUT_ERROR');
                done();
            });
        });
    });
});
