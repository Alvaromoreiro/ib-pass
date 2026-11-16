import { TestBed } from '@angular/core/testing';
import { IbBookingBkErrorAnalyticsService, ErrorAnalyticsData } from '@src/app/pages/ib-booking-bk-error/services/ib-booking-bk-error-analytic.service';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { DigitalDataPropertiesUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-properties-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { RootStore } from '@src/app/core/store/ib-booking-root.store';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { IbBookingFlowDetectionService, ProcessConst } from '@src/app/core/services/ib-booking-flow-detection.service';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { MonetateConstants } from '@src/app/shared/services/ib-monetate/ib-monetate-constants';

class DigitalDataUtilsServiceMock {
    updateDigitalDataWithQuadrigam = jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(() => {});
    setProcessAndStep = jasmine.createSpy('setProcessAndStep').and.callFake(() => {});

    getProcess = jasmine.createSpy('getProcess').and.returnValue('test-process');
}

class DigitalDataServiceMock {
    addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo').and.callFake(() => {});
    emitViewEvent = jasmine.createSpy('emitViewEvent').and.callFake(() => {});
}

class AJSDatalayerBKIServiceMock {
    generateDigitalDataShuttleError = jasmine.createSpy('generateDigitalDataShuttleError').and.returnValue({ shuttle: 'error_data' });
    setPayloadForGenerateDigitalData = jasmine.createSpy('setPayloadForGenerateDigitalData').and.returnValue({ payload: 'data' });
    generateDigitalDataAvailability = jasmine.createSpy('generateDigitalDataAvailability').and.returnValue({ availability: 'data' });
}

class DigitalDataPropertiesUtilsServiceMock {
    setProcess = jasmine.createSpy('setProcess').and.returnValue('test-process');
}

class AJSMonetateUtilsServiceMock {
    updateMonetateWithQuadrigam = jasmine.createSpy('updateMonetateWithQuadrigam').and.callFake(() => {});
}

class RootStoreMock {
    private store = new Map<string, any>();
    private rootScopeMock = { $broadcast: jasmine.createSpy('$broadcast') };
    
    get = jasmine.createSpy('get').and.callFake((key: string) => {
        return this.store.get(key) ?? null;
    });
    
    set = jasmine.createSpy('set').and.callFake((key: string, value: any) => {
        this.store.set(key, value);
    });
    
    obtainFlow = jasmine.createSpy('obtainFlow').and.returnValue({
        flow: 'test-flow',
        isRedemption: false
    });

    getOriginalRootScope = jasmine.createSpy('getOriginalRootScope').and.callFake(() => {
        return this.rootScopeMock;
    });
}

class BookingErrorPageStoreMock {
    getErrorByType = jasmine.createSpy('getErrorByType').and.returnValue(null);
}

class IbBookingFlowDetectionServiceMock {
    detectFlow = jasmine.createSpy('detectFlow').and.returnValue({
        flow: ProcessConst.BOOKING,
        isRedemption: false
    });
}


describe('IbBookingBkErrorAnalyticsService test', () => {
    let service: IbBookingBkErrorAnalyticsService;
    let digitalDataUtilsService: any;
    let digitalDataService: any;
    let datalayerBKIService: any;
    let digitalDataPropertiesUtilsService: any;
    let localStorageService: any;
    let rootStore: any;
    let bookingErrorPageStore: any;
    let flowDetectionService: any;
    let monetateUtilsService: any;

    // Test data constants
    const TEST_ORIGIN_DESTINATION = { destinationCity: 'MAD', originCity: 'BCN' };
    const TEST_PROCESS = 'test-process';
    const ERROR_STEP = 'error';
    
    // Helper methods
    const createErrorData = (overrides: Partial<ErrorAnalyticsData> = {}): ErrorAnalyticsData => ({
        availabilityError: null,
        confirmationDigitalInfo: {},
        originDestination: null,
        flowDetection: { flow: ProcessConst.BOOKING, isRedemption: false },
        ...overrides
    });

    const expectCommonAnalyticsCalls = () => {
        expect(digitalDataPropertiesUtilsService.setProcess).toHaveBeenCalled();
        expect(digitalDataService.emitViewEvent).toHaveBeenCalled();
    };

    const expectQuadrigamCalls = (quadrigam: string) => {
        expect(digitalDataUtilsService.updateDigitalDataWithQuadrigam).toHaveBeenCalledWith(
            quadrigam,
            {}
        );
        expect(digitalDataUtilsService.setProcessAndStep).toHaveBeenCalledWith(
            TEST_PROCESS,
            ERROR_STEP,
            quadrigam
        );
        expectCommonAnalyticsCalls();
    };

    const expectShuttleErrorDataCalls = () => {
        expect(datalayerBKIService.generateDigitalDataShuttleError).toHaveBeenCalled();
        expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledWith({ shuttle: 'error_data' });
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingBkErrorAnalyticsService,
                { provide: DigitalDataUtilsService, useClass: DigitalDataUtilsServiceMock },
                { provide: DigitalDataService, useClass: DigitalDataServiceMock },
                { provide: AJSDatalayerBKIService, useClass: AJSDatalayerBKIServiceMock },
                { provide: AJSMonetateUtilsService, useClass: AJSMonetateUtilsServiceMock },
                { provide: DigitalDataPropertiesUtilsService, useClass: DigitalDataPropertiesUtilsServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: RootStore, useClass: RootStoreMock },
                { provide: BookingErrorPageStore, useClass: BookingErrorPageStoreMock },
                { provide: IbBookingFlowDetectionService, useClass: IbBookingFlowDetectionServiceMock }
            ]
        });

        service = TestBed.inject(IbBookingBkErrorAnalyticsService) as any;
        digitalDataUtilsService = (service as any).digitalDataUtilsService;
        digitalDataService = (service as any).DigitalDataService;
        datalayerBKIService = (service as any).datalayerBKIService;
        digitalDataPropertiesUtilsService = (service as any).digitalDataPropertiesUtilsService;
        localStorageService = (service as any).localStorageService;
        rootStore = (service as any).rootStore;
        bookingErrorPageStore = (service as any).BookingErrorPageStore;
        flowDetectionService = (service as any).flowDetectionService;
        monetateUtilsService = (service as any).monetateUtilsService;
    });



    describe('sendAnalytics', () => {
        const quadrigamTestCases = [
            {
                description: 'standard booking error',
                flow: ProcessConst.BOOKING,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.BK_ERROR
            },
            {
                description: 'multi trip flow',
                flow: ProcessConst.MULTI_TRIP,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.MULTI_BK_ERROR
            },
            {
                description: 'HMAD stopover flow',
                flow: ProcessConst.HMAD_STOP_OVER,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.HMAD_BK_ERROR
            }
        ];

        quadrigamTestCases.forEach(({ description, flow, expectedQuadrigam }) => {
            it(`should use correct quadrigam for ${description}`, () => {
                const errorData = createErrorData({
                    flowDetection: { flow, isRedemption: false },
                    confirmationDigitalInfo: {}
                });

                service.sendAnalytics(errorData);

                expectQuadrigamCalls(expectedQuadrigam);
            });
        });

        it('should use BK_ERROR_AVAILABILITY quadrigam when specific error conditions are met', () => {
            bookingErrorPageStore.getErrorByType.and.callFake((type: ErrorType) => {
                if (type === ErrorType.RIBBON) {
                    return { errorCode: 404 };
                }
                return null;
            });

            service.sendAnalytics(createErrorData());

            expectQuadrigamCalls(BookingAppConstants.QUADRIGAMS.BK_ERROR_AVAILABILITY);
        });

        const akamaiTestCases = [
            {
                description: 'SECURITY_AKAMAI error exists in store',
                mockFn: (type: ErrorType) => {
                    if (type === ErrorType.SECURITY_AKAMAI) {
                        return { internalErrorCode: 'SECURITY_AKAMAI', errorCode: 403, requestURL: 'https://example.com' };
                    }
                    return null;
                }
            },
            {
                description: 'RIBBON 404 and SECURITY_AKAMAI both present (SECURITY_AKAMAI takes priority)',
                mockFn: (type: ErrorType) => {
                    if (type === ErrorType.RIBBON) { return { errorCode: 404 }; }
                    if (type === ErrorType.SECURITY_AKAMAI) {
                        return { internalErrorCode: 'SECURITY_AKAMAI', errorCode: 403, requestURL: 'https://example.com' };
                    }
                    return null;
                }
            }
        ];

        akamaiTestCases.forEach(({ description, mockFn }) => {
            it(`should use BK_ERROR_AKAMAI quadrigam when ${description}`, () => {
                bookingErrorPageStore.getErrorByType.and.callFake(mockFn);

                service.sendAnalytics(createErrorData());

                expectQuadrigamCalls(BookingAppConstants.QUADRIGAMS.BK_ERROR_AKAMAI);
            });
        });

        it('should not use BK_ERROR_AKAMAI quadrigam when SECURITY_AKAMAI error is null', () => {
            bookingErrorPageStore.getErrorByType.and.returnValue(null);

            service.sendAnalytics(createErrorData());

            expect(digitalDataUtilsService.updateDigitalDataWithQuadrigam).not.toHaveBeenCalledWith(
                BookingAppConstants.QUADRIGAMS.BK_ERROR_AKAMAI,
                jasmine.anything()
            );
        });

        // Data-driven tests for shuttle flows
        const shuttleTestCases = [
            {
                description: 'shuttle flow',
                flow: ProcessConst.SHUTTLE,
                isRedemption: false,
                shouldSetOriginDestination: true
            },
            {
                description: 'shuttle redemption flow',
                flow: ProcessConst.SHUTTLE_REDEMPTION,
                isRedemption: true,
                shouldSetOriginDestination: false
            }
        ];

        shuttleTestCases.forEach(({ description, flow, isRedemption, shouldSetOriginDestination }) => {
            it(`should generate shuttle error data when ${description}`, () => {
                const errorData = createErrorData({
                    flowDetection: { flow, isRedemption },
                    originDestination: TEST_ORIGIN_DESTINATION,
                    confirmationDigitalInfo: {}
                });

                if (shouldSetOriginDestination) {
                    localStorageService.set('originDestination', TEST_ORIGIN_DESTINATION);
                }

                service.sendAnalytics(errorData);

                expectShuttleErrorDataCalls();
            });
        });

        it('should generate availability data when not shuttle flow and has origin destination', () => {
            const errorData = createErrorData({
                flowDetection: { flow: ProcessConst.BOOKING, isRedemption: false },
                originDestination: TEST_ORIGIN_DESTINATION,
                confirmationDigitalInfo: {}
            });

            service.sendAnalytics(errorData);

            expect(datalayerBKIService.setPayloadForGenerateDigitalData).toHaveBeenCalled();
            expect(datalayerBKIService.generateDigitalDataAvailability).toHaveBeenCalledWith({
                originDestinations: { payload: 'data' }
            });
            expect(digitalDataService.addDigitalDataInfo).toHaveBeenCalledWith({ availability: 'data' });
        });

        // Data-driven tests for digital data exclusions
        const exclusionTestCases = [
            {
                description: 'AdvancePurchase',
                confirmationDigitalInfo: { AdvancePurchase: true }
            },
            {
                description: 'SearchCity',
                confirmationDigitalInfo: { SearchCity: true }
            }
        ];

        exclusionTestCases.forEach(({ description, confirmationDigitalInfo }) => {
            it(`should not generate digital data when confirmationDigitalInfo has ${description}`, () => {
                localStorageService.set('confirmationDigitalInfo', confirmationDigitalInfo);
                
                const errorData = createErrorData({ confirmationDigitalInfo });

                service.sendAnalytics(errorData);

                expect(digitalDataService.addDigitalDataInfo).not.toHaveBeenCalled();
            });
        });
    });

    describe('sendAnalyticsFromStorage', () => {
        const storageTestCases = [
            {
                description: 'with default data from flow detection service',
                storageData: {},
                expectedErrorData: {
                    availabilityError: null,
                    confirmationDigitalInfo: {},
                    originDestination: null,
                    flowDetection: { flow: ProcessConst.BOOKING, isRedemption: false }
                }
            },
            {
                description: 'with storage data when available',
                storageData: {
                    availabilityErrror: { error: 'test' },
                    confirmationDigitalInfo: { test: 'info' },
                    originDestination: { origin: 'BCN', destination: 'MAD' }
                },
                flowDetection: { flow: ProcessConst.MULTI_TRIP, isRedemption: true },
                expectedErrorData: {
                    availabilityError: { error: 'test' },
                    confirmationDigitalInfo: { test: 'info' },
                    originDestination: { origin: 'BCN', destination: 'MAD' },
                    flowDetection: { flow: ProcessConst.MULTI_TRIP, isRedemption: true }
                }
            }
        ];

        storageTestCases.forEach(({ description, storageData, flowDetection, expectedErrorData }) => {
            it(`should call sendAnalytics ${description}`, () => {
                const testFlowDetection = flowDetection || { flow: ProcessConst.BOOKING, isRedemption: false };
                
                // Set up storage data
                Object.entries(storageData).forEach(([key, value]) => {
                    localStorageService.set(key, value);
                });
                
                flowDetectionService.detectFlow.and.returnValue(testFlowDetection);
                spyOn(service, 'sendAnalytics');
                spyOn(service, 'sendMonetateAnalytics');

                service.sendAnalyticsFromStorage();

                expect(flowDetectionService.detectFlow).toHaveBeenCalled();
                expect(service.sendAnalytics).toHaveBeenCalledWith(expectedErrorData);
                expect(service.sendMonetateAnalytics).toHaveBeenCalled();
            });
        });
    });

    describe('sendMonetateAnalytics', () => {
        const monetateQuadrigamTestCases = [
            {
                description: 'standard booking flow (no multiCitySearch, no isHMAD)',
                multiCitySearch: null,
                isHMAD: null,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.BK_ERROR
            },
            {
                description: 'multi-city search without stopover',
                multiCitySearch: true,
                isHMAD: null,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.MULTI_BK_ERROR
            },
            {
                description: 'multi-city search with HMAD stopover',
                multiCitySearch: true,
                isHMAD: true,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.HMAD_BK_ERROR
            },
            {
                description: 'isHMAD set but no multiCitySearch (falls back to BK_ERROR)',
                multiCitySearch: null,
                isHMAD: true,
                expectedQuadrigam: BookingAppConstants.QUADRIGAMS.BK_ERROR
            }
        ];

        monetateQuadrigamTestCases.forEach(({ description, multiCitySearch, isHMAD, expectedQuadrigam }) => {
            it(`should call updateMonetateWithQuadrigam with ${expectedQuadrigam} when ${description}`, () => {
                localStorageService.set('multiCitySearch', multiCitySearch);
                localStorageService.set('isHMAD', isHMAD);

                service.sendMonetateAnalytics();

                expect(monetateUtilsService.updateMonetateWithQuadrigam).toHaveBeenCalledWith(
                    MonetateConstants.MONETATE_INFO.SETPAGETYPE,
                    expectedQuadrigam
                );
            });
        });

        it('should broadcast sendUpdateToMonetate via rootStore', () => {
            service.sendMonetateAnalytics();

            expect(rootStore.getOriginalRootScope).toHaveBeenCalled();
            expect(rootStore.getOriginalRootScope().$broadcast).toHaveBeenCalledWith('sendUpdateToMonetate');
        });
    });
});
