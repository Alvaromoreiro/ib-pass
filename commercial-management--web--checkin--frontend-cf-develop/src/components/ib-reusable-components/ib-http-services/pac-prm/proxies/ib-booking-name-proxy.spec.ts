interface BookingNameProxyTestApi {
    getBooking(url: string, name: string, surname: string): ng.IPromise<unknown>;
}

describe('BookingNameProxy', () => {
    let bookingNameProxy: BookingNameProxyTestApi;
    let $httpBackend: ng.IHttpBackendService;
    let $rootScope: ng.IRootScopeService;

    beforeEach(angular.mock.module('ib-http-services-module'));

    beforeEach(angular.mock.inject((
        _$httpBackend_: ng.IHttpBackendService,
        _$rootScope_: ng.IRootScopeService,
        _BookingNameProxy_: BookingNameProxyTestApi
    ) => {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        bookingNameProxy = _BookingNameProxy_;
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getBooking', () => {
        it('should call the booking endpoint with the name and surname headers', () => {
            const url = '/api/booking';
            const name = 'John';
            const surname = 'Doe';

            $httpBackend
                .expectGET(url, {
                    'Request-Name': name,
                    'Request-Surname': surname,
                    'Accept': 'application/json, text/plain, */*'
                })
                .respond(200, { bookingId: 'ABC123' });

            bookingNameProxy.getBooking(url, name, surname);

            $httpBackend.flush();
        });

        it('should resolve the promise with data and status code when the request succeeds', () => {
            const url = '/api/booking';
            const responseData = {
                bookingId: 'ABC123',
                passengerName: 'John Doe'
            };

            let result: unknown;

            $httpBackend
                .expectGET(url)
                .respond(200, responseData);

            bookingNameProxy
                .getBooking(url, 'John', 'Doe')
                .then((response: unknown) => {
                    result = response;
                });

            $httpBackend.flush();

            expect(result).toEqual({
                data: responseData,
                code: 200
            });
        });

        it('should reject the promise with data and error code when the request fails', () => {
            const url = '/api/booking';
            const errorData = {
                message: 'Booking was not found'
            };

            let errorResult: unknown;

            $httpBackend
                .expectGET(url)
                .respond(404, errorData);

            bookingNameProxy
                .getBooking(url, 'John', 'Doe')
                .then(angular.noop, (error: unknown) => {
                    errorResult = error;
                });

            $httpBackend.flush();

            expect(errorResult).toEqual({
                data: errorData,
                errorCode: 404
            });
        });

        it('should reject the promise when the server returns an internal error', () => {
            const url = '/api/booking';
            const errorData = {
                message: 'Internal server error'
            };

            let errorResult: unknown;

            $httpBackend
                .expectGET(url)
                .respond(500, errorData);

            bookingNameProxy
                .getBooking(url, 'Jane', 'Smith')
                .catch((error: unknown) => {
                    errorResult = error;
                });

            $httpBackend.flush();

            expect(errorResult).toEqual({
                data: errorData,
                errorCode: 500
            });
        });
    });
});
