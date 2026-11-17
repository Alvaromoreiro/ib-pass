interface BookingInformationProxyTestApi {
    getBookingInformationByLocatorAndSurname(url: string, surname: string): ng.IPromise<unknown>;
    getBookingInformationByDeepLink(url: string, code: string): ng.IPromise<unknown>;
}

type BookingInformationMethod = keyof BookingInformationProxyTestApi;

describe('BookingInformationProxy', () => {
    const ACCEPT_HEADER = 'application/json, text/plain, */*';
    const SUCCESS_RESPONSE = {
        locator: 'ABC123',
        passengerName: 'John Doe'
    };

    let bookingInformationProxy: BookingInformationProxyTestApi;
    let $httpBackend: ng.IHttpBackendService;

    interface RequestScenario {
        description: string;
        method: BookingInformationMethod;
        url: string;
        value: string;
        headerName: string;
        headerValue: string;
        headerTestDescription: string;
        errorUrl: string;
        errorValue: string;
        errorData: Record<string, unknown>;
        errorCode: number;
    }

    beforeEach(angular.mock.module('ib-http-services-module'));

    beforeEach(angular.mock.inject((
        _$httpBackend_: ng.IHttpBackendService,
        _BookingInformationProxy_: BookingInformationProxyTestApi
    ) => {
        $httpBackend = _$httpBackend_;
        bookingInformationProxy = _BookingInformationProxy_;
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    function getHeaders(scenario: RequestScenario): { [key: string]: string } {
        const headers: { [key: string]: string } = {
            'Accept': ACCEPT_HEADER
        };

        headers[scenario.headerName] = scenario.headerValue;

        return headers;
    }

    function request(
        scenario: RequestScenario,
        url: string,
        value: string
    ): ng.IPromise<unknown> {
        return bookingInformationProxy[scenario.method](url, value);
    }

    function defineRequestTests(scenario: RequestScenario): void {
        describe(scenario.description, () => {
            it(scenario.headerTestDescription, () => {
                $httpBackend
                    .expectGET(scenario.url, getHeaders(scenario))
                    .respond(200, SUCCESS_RESPONSE);

                request(scenario, scenario.url, scenario.value);

                $httpBackend.flush();
            });

            it('should resolve the promise with data and status code when the request succeeds', () => {
                let result: unknown;

                $httpBackend
                    .expectGET(scenario.url)
                    .respond(200, SUCCESS_RESPONSE);

                request(scenario, scenario.url, scenario.value)
                    .then((response: unknown) => {
                        result = response;
                    });

                $httpBackend.flush();

                expect(result).toEqual({
                    data: SUCCESS_RESPONSE,
                    code: 200
                });
            });

            it('should reject the promise with data and error code when the request fails', () => {
                let errorResult: unknown;

                $httpBackend
                    .expectGET(scenario.errorUrl)
                    .respond(scenario.errorCode, scenario.errorData);

                request(scenario, scenario.errorUrl, scenario.errorValue)
                    .then(angular.noop, (error: unknown) => {
                        errorResult = error;
                    });

                $httpBackend.flush();

                expect(errorResult).toEqual({
                    data: scenario.errorData,
                    errorCode: scenario.errorCode
                });
            });
        });
    }

    const scenarios: RequestScenario[] = [
        {
            description: 'getBookingInformationByLocatorAndSurname',
            method: 'getBookingInformationByLocatorAndSurname',
            url: '/api/booking/locator/ABC123',
            value: 'Doe',
            headerName: 'Request-Surname',
            headerValue: 'Doe',
            headerTestDescription: 'should call the booking endpoint with the surname header',
            errorUrl: '/api/booking/locator/INVALID',
            errorValue: 'Doe',
            errorData: {
                message: 'Booking was not found'
            },
            errorCode: 404
        },
        {
            description: 'getBookingInformationByDeepLink',
            method: 'getBookingInformationByDeepLink',
            url: '/api/booking/deep-link',
            value: 'booking%252FABC123%252FJohn%2520Doe',
            headerName: 'Request-Deeplink',
            headerValue: 'booking/ABC123/John Doe',
            headerTestDescription: 'should decode the deep link and send it in the request header',
            errorUrl: '/api/booking/deep-link',
            errorValue: 'booking%252FINVALID',
            errorData: {
                message: 'Invalid deep link'
            },
            errorCode: 400
        }
    ];

    scenarios.forEach(defineRequestTests);
});
