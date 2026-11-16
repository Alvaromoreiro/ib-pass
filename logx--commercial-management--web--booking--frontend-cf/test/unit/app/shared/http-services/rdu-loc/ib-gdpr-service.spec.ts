import { TestBed } from "@angular/core/testing";
import { GdprService } from "@src/app/shared/http-services/rdu-loc/ib-gdpr-service";
import { BookingPromiseProxy } from '@src/app/shared/http-services/proxy/ib-booking-promise-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';

const fakeGdprData = {
    data: {
        gdprAccepted: true,
        lastUpdate: '2024-01-01',
        version: '1.0'
    }
};

const fakeConditionsData = {
    data: {
        conditions: 'Privacy policy content...',
        version: '2.0'
    }
};

const fakeHttpError = {
    status: 500,
    message: 'Internal Server Error'
};

type GdprResponseType = typeof fakeGdprData | typeof fakeConditionsData;

class BookingPromiseProxyMock {
    public static response: GdprResponseType = fakeGdprData;
    public static shouldThrowError = false;
    public static throwedError = fakeHttpError;
    
    public get = jasmine.createSpy('get').and.callFake(() => {
        if (BookingPromiseProxyMock.shouldThrowError) {
            return Promise.reject(BookingPromiseProxyMock.throwedError);
        }
        return Promise.resolve(BookingPromiseProxyMock.response);
    });

    public static reset(): void {
        this.shouldThrowError = false;
        this.response = fakeGdprData;
    }
}


describe('GdprService', () => {
    let service: GdprService;
    let fakeBookingPromiseProxy: BookingPromiseProxyMock;

    const buildGdprEndpoint = (isUserPlusAndHard: boolean): string => {
        const suffix = isUserPlusAndHard ? 'IBPRIVACIBP' : 'IBPRIVAC';
        return HttpServicesConstants.DEFAULT_ENDPOINTS.gdprServiceURI + suffix + '/gdpr';
    };

    const buildCouponEndpoint = (coupon: string): string => {
        return HttpServicesConstants.DEFAULT_ENDPOINTS.gdprServiceURI + coupon + '/gdpr';
    };

    const cacheHeaders = {
        headers: {
            'Cache-Control': 'private, max-age=600'
        }
    };

    const testSuccessfulCall = async (
        serviceCall: () => Promise<any>, 
        expectedEndpoint: string, 
        expectedConfig?: any, 
        expectedData: any = fakeGdprData.data
    ): Promise<void> => {
        const data = await serviceCall();
        
        if (expectedConfig) {
            expect(fakeBookingPromiseProxy.get).toHaveBeenCalledWith(expectedEndpoint, expectedConfig);
        } else {
            expect(fakeBookingPromiseProxy.get).toHaveBeenCalledWith(expectedEndpoint);
        }
        expect(data).toEqual(expectedData);
    };

    const testErrorHandling = async (serviceCall: () => Promise<any>): Promise<void> => {
        BookingPromiseProxyMock.shouldThrowError = true;
        
        try {
            await serviceCall();
            expect(true).toBe(false); 
        } catch (error: any) {
            expect(error).toEqual(fakeHttpError);
        }
    };

    const resetMocks = (): void => {
        BookingPromiseProxyMock.reset();
        fakeBookingPromiseProxy.get.calls.reset();
    };

    beforeEach(() => {
        fakeBookingPromiseProxy = new BookingPromiseProxyMock();
        
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: BookingPromiseProxy, useValue: fakeBookingPromiseProxy },
            ]
        });
        
        service = TestBed.inject(GdprService);
        resetMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getGdprInfo', () => {
        it('should call correct endpoint for user plus and hard (true)', async () => {
            const isUserPlusAndHard = true;
            const expectedEndpoint = buildGdprEndpoint(isUserPlusAndHard);
            
            await testSuccessfulCall(
                () => service.getGdprInfo(isUserPlusAndHard), 
                expectedEndpoint, 
                cacheHeaders
            );
        });

        it('should call correct endpoint for regular user (false)', async () => {
            const isUserPlusAndHard = false;
            const expectedEndpoint = buildGdprEndpoint(isUserPlusAndHard);
            
            await testSuccessfulCall(
                () => service.getGdprInfo(isUserPlusAndHard), 
                expectedEndpoint, 
                cacheHeaders
            );
        });

        it('should handle http errors properly', async () => {
            await testErrorHandling(() => service.getGdprInfo(true));
        });
    });

    describe('getConditionsCoupon', () => {
        const testCoupon = 'TEST_COUPON';

        beforeEach(() => {
            BookingPromiseProxyMock.response = fakeConditionsData;
        });

        const testCases = [
            {
                name: 'should call correct endpoint with coupon parameter',
                coupon: testCoupon,
                promise: undefined
            },
            {
                name: 'should work with empty coupon string',
                coupon: '',
                promise: undefined
            },
            {
                name: 'should accept optional promise parameter without affecting functionality',
                coupon: testCoupon,
                promise: Promise.resolve()
            }
        ];

        testCases.forEach(({ name, coupon, promise }) => {
            it(name, async () => {
                const expectedEndpoint = buildCouponEndpoint(coupon);
                
                await testSuccessfulCall(
                    () =>service.getConditionsCoupon(coupon, promise), 
                    expectedEndpoint, 
                    undefined, 
                    fakeConditionsData.data
                );
            });
        });

        it('should handle http errors properly', async () => {
            await testErrorHandling(() => service.getConditionsCoupon(testCoupon));
        });
    });
});
