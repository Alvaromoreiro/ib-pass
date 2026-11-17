type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

interface GetBookingNameServiceInstance {
    counterAttemps: number;
    getBooking(name: string, surname: string, checkinId: string): angular.IPromise<unknown>;
}

describe('GetBookingNameService', () => {
    let getBookingNameService: GetBookingNameServiceInstance;
    let $q: ng.IQService;
    let $rootScope: ng.IRootScopeService;

    let bookingNameProxyMock: SpyMap<'getBooking'>;
    let commonsHttpUtilsErrorServiceMock: SpyMap<'controlError'>;
    let base64Mock: SpyMap<'encode'>;
    let httpServicesConstantsMock: { URI: { DEFAULT_ENDPOINTS: { getBookingInformationNameURI: string } } };

    beforeEach(() => {
        bookingNameProxyMock = {
            getBooking: jasmine.createSpy('getBooking')
        };

        commonsHttpUtilsErrorServiceMock = {
            controlError: jasmine.createSpy('controlError')
        };

        base64Mock = {
            encode: jasmine.createSpy('encode').and.callFake((value: string) => {
                return `encoded-${value}`;
            })
        };

        httpServicesConstantsMock = {
            URI: {
                DEFAULT_ENDPOINTS: {
                    getBookingInformationNameURI: '/api/booking/name/'
                }
            }
        };

        angular.mock.module('ib-http-services-module', (
            $provide: ng.auto.IProvideService
        ) => {
            $provide.value('BookingNameProxy', bookingNameProxyMock);
            $provide.value('CommonsHttpUtilsErrorService', commonsHttpUtilsErrorServiceMock);
            $provide.constant('HttpServicesConstants', httpServicesConstantsMock);
            $provide.value('base64', base64Mock);
        });
    });

    beforeEach(angular.mock.inject((
        _$q_: ng.IQService,
        _$rootScope_: ng.IRootScopeService,
        _GetBookingNameService_: GetBookingNameServiceInstance
    ) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        getBookingNameService = _GetBookingNameService_;
    }));

    describe('getBooking', () => {
        it('should initialize the attempts counter with zero', () => {
            expect(getBookingNameService.counterAttemps).toBe(0);
        });

        it('should encode name and surname before calling the proxy', () => {
            const name = 'John';
            const surname = 'Doe';
            const checkinId = 'CHECKIN-123';

            bookingNameProxyMock.getBooking.and.returnValue($q.when({
                data: {}
            }));

            getBookingNameService.getBooking(name, surname, checkinId);

            $rootScope.$digest();

            expect(base64Mock.encode).toHaveBeenCalledWith(name);
            expect(base64Mock.encode).toHaveBeenCalledWith(surname);

            expect(bookingNameProxyMock.getBooking).toHaveBeenCalledWith(
                '/api/booking/name/CHECKIN-123',
                'encoded-John',
                'encoded-Doe'
            );
        });

        it('should resolve the promise with the proxy response data', () => {
            const proxyData = {
                bookingId: 'ABC123',
                passengerName: 'John Doe'
            };

            let result: unknown;

            bookingNameProxyMock.getBooking.and.returnValue($q.when({
                data: proxyData,
                code: 200
            }));

            getBookingNameService
                .getBooking('John', 'Doe', 'CHECKIN-123')
                .then((response: unknown) => {
                    result = response;
                });

            $rootScope.$digest();

            expect(result).toEqual(proxyData);
        });

        it('should call the error service when the proxy request fails', () => {
            const proxyError = {
                data: {
                    message: 'Booking was not found'
                },
                errorCode: 404
            };

            bookingNameProxyMock.getBooking.and.returnValue($q.reject(proxyError));

            getBookingNameService.getBooking('John', 'Doe', 'CHECKIN-123');

            $rootScope.$digest();

            expect(commonsHttpUtilsErrorServiceMock.controlError).toHaveBeenCalledWith(
                proxyError,
                0,
                jasmine.any(Function),
                jasmine.any(Object)
            );
        });

        it('should retry the request and increment the attempts counter when the error service invokes the callback', () => {
            const proxyError = {
                data: {
                    message: 'Temporary service error'
                },
                errorCode: 500
            };

            const proxyData = {
                bookingId: 'ABC123'
            };

            bookingNameProxyMock.getBooking.and.returnValues(
                $q.reject(proxyError),
                $q.when({
                    data: proxyData,
                    code: 200
                })
            );

            commonsHttpUtilsErrorServiceMock.controlError.and.callFake((
                error: unknown,
                attempts: number,
                retryCallback: () => void
            ) => {
                retryCallback();
            });

            let result: unknown;

            getBookingNameService
                .getBooking('John', 'Doe', 'CHECKIN-123')
                .then((response: unknown) => {
                    result = response;
                });

            $rootScope.$digest();

            expect(commonsHttpUtilsErrorServiceMock.controlError).toHaveBeenCalledWith(
                proxyError,
                0,
                jasmine.any(Function),
                jasmine.any(Object)
            );

            expect(bookingNameProxyMock.getBooking).toHaveBeenCalledTimes(2);
            expect(getBookingNameService.counterAttemps).toBe(1);
            expect(result).toEqual(proxyData);
        });
    });
});
