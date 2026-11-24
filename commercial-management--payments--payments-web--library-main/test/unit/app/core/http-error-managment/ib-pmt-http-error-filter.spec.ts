import angular from 'angular';

describe('PmtHttpErrorFilter - payment init data errors', () => {
    let filter: any;
    let fakeManagement: any;
    let localStorageStore: Record<string, unknown>;

    const fakePmtConstants = {
        ENDPOINTS: {
            DEFAULT: {
                countriesListURI: '/rdu-loc/rs/loc/v1/location/country',
                statesListServiceURI: '/rdu-loc/rs/loc/v1/location/',
                paymentMethodsServiceURI: '/pmt-ppm/rs/ppm/v7/',
                paymentMethodsAdditionalFieldsServiceURI: '/pmt-ppm/rs/ppm/v7/'
            }
        },
        APP_TYPES: {},
        GENERAL_ERRORS: {
            SERVICE_GENERAL_ERROR: 'SERVICE_GENERAL_ERROR'
        }
    };

    const essentialUrls = {
        country: '/service/rdu-loc/rs/loc/v1/location/country',
        states: '/service/rdu-loc/rs/loc/v1/location/ES/states',
        paymentMethods: '/service/pmt-ppm/rs/ppm/v7/order-1/payment-methods',
        additionalFields: '/service/pmt-ppm/rs/ppm/v7/order-1/payment/p1/additional-fields/IBERIA_PAY'
    };

    const buildErrorObject = (url: string) => ({
        response: {
            errorCode: 449,
            data: { errors: [{ reason: 'init data error', code: 'TEST_CODE' }] }
        },
        actualAttemps: 0,
        paymentMethodCallback: jasmine.createSpy('paymentMethodCallback'),
        url
    });

    beforeEach(() => {
        localStorageStore = {};
        fakeManagement = {
            blockPaymentInitDataError: jasmine.createSpy('blockPaymentInitDataError'),
            blockAndReturnError: jasmine.createSpy('blockAndReturnError'),
            rejectedCreditCardError: jasmine.createSpy('rejectedCreditCardError'),
            timeOutError: jasmine.createSpy('timeOutError'),
            unauthorizedError: jasmine.createSpy('unauthorizedError'),
            noPaymentGoConfirmation: jasmine.createSpy('noPaymentGoConfirmation')
        };

        angular.mock.module('ib-pmt-services-http-module', ($provide: angular.auto.IProvideService) => {
            $provide.value('PmtHttpErrorManagement', fakeManagement);
            $provide.value('localStorageService', {
                get: jasmine.createSpy('get').and.callFake((key: string) => localStorageStore[key] ?? null),
                set: jasmine.createSpy('set').and.callFake((key: string, value: unknown) => {
                    localStorageStore[key] = value;
                }),
                remove: jasmine.createSpy('remove').and.callFake((key: string) => {
                    delete localStorageStore[key];
                })
            });
            $provide.value('$filter', jasmine.createSpy('$filter').and.returnValue((key: string) => key));
            $provide.value('PmtConstants', fakePmtConstants);
        });

        inject((_PmtHttpErrorFilter_: any) => {
            filter = _PmtHttpErrorFilter_;
        });
    });

    describe('handlePaymentInitDataError', () => {
        Object.entries(essentialUrls).forEach(([serviceName, url]) => {
            it(`should block init when ${serviceName} fails during init`, () => {
                const result = filter.handlePaymentInitDataError(449, buildErrorObject(url));

                expect(result).toBe(true);
                expect(fakeManagement.blockPaymentInitDataError).toHaveBeenCalled();
            });
        });

        it('should delegate to errorHandlerFactory when errorIssueService exists', () => {
            localStorageStore.errorIssueService = { data: {} };
            const errorObject = buildErrorObject(essentialUrls.country);
            spyOn(filter, 'errorHandlerFactory').and.returnValue(true);

            filter.handlePaymentInitDataError(449, errorObject);

            expect(filter.errorHandlerFactory).toHaveBeenCalledWith(449, errorObject);
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });

        it('should delegate to errorHandlerFactory when modelPaymentData exists', () => {
            localStorageStore.modelPaymentData = { paymentInfo: {} };
            spyOn(filter, 'errorHandlerFactory').and.returnValue(true);

            filter.handlePaymentInitDataError(449, buildErrorObject(essentialUrls.additionalFields));

            expect(filter.errorHandlerFactory).toHaveBeenCalled();
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });

        it('should delegate 401 to errorHandlerFactory', () => {
            spyOn(filter, 'errorHandlerFactory').and.returnValue(false);

            filter.handlePaymentInitDataError(401, buildErrorObject(essentialUrls.country));

            expect(filter.errorHandlerFactory).toHaveBeenCalled();
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });

        it('should delegate 408 to errorHandlerFactory', () => {
            spyOn(filter, 'errorHandlerFactory').and.returnValue(false);

            filter.handlePaymentInitDataError(408, buildErrorObject(essentialUrls.states));

            expect(filter.errorHandlerFactory).toHaveBeenCalled();
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });

        it('should delegate unrelated urls to errorHandlerFactory', () => {
            spyOn(filter, 'errorHandlerFactory').and.returnValue(true);

            filter.handlePaymentInitDataError(449, buildErrorObject('/other/service/issue'));

            expect(filter.errorHandlerFactory).toHaveBeenCalled();
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });

        it('should delegate typed payment-methods init errors to errorHandlerFactory', () => {
            const errorObject = {
                response: {
                    errorCode: 412,
                    data: { errors: [{ reason: 'No extras to pay', code: 'PMT_PPM_9009' }] }
                },
                actualAttemps: 0,
                paymentMethodCallback: jasmine.createSpy('paymentMethodCallback'),
                url: essentialUrls.paymentMethods
            };
            spyOn(filter, 'errorHandlerFactory').and.returnValue(true);

            const result = filter.handlePaymentInitDataError(412, errorObject);

            expect(result).toBe(true);
            expect(filter.errorHandlerFactory).toHaveBeenCalledWith(412, errorObject);
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });
    });

    describe('errorHandlerFactory', () => {
        it('should route essential init urls to blockPaymentInitDataError during init', () => {
            filter.errorHandlerFactory(449, buildErrorObject(essentialUrls.paymentMethods));

            expect(fakeManagement.blockPaymentInitDataError).toHaveBeenCalled();
        });

        it('should route typed payment-methods init errors to their specific handler', () => {
            const errorObject = {
                response: {
                    errorCode: 412,
                    data: { errors: [{ reason: 'No extras to pay', code: 'PMT_PPM_9009' }] }
                },
                actualAttemps: 0,
                paymentMethodCallback: jasmine.createSpy('paymentMethodCallback'),
                url: essentialUrls.paymentMethods
            };

            filter.errorHandlerFactory(412, errorObject);

            expect(fakeManagement.noPaymentGoConfirmation).toHaveBeenCalled();
            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
        });

        it('should still route typed payment-methods errors through init reload on non-payment-methods urls', () => {
            const errorObject = {
                response: {
                    errorCode: 412,
                    data: { errors: [{ reason: 'No extras to pay', code: 'PMT_PPM_9009' }] }
                },
                actualAttemps: 0,
                paymentMethodCallback: jasmine.createSpy('paymentMethodCallback'),
                url: essentialUrls.country
            };

            filter.errorHandlerFactory(412, errorObject);

            expect(fakeManagement.blockPaymentInitDataError).toHaveBeenCalled();
            expect(fakeManagement.noPaymentGoConfirmation).not.toHaveBeenCalled();
        });

        it('should not route POST additional-fields to init reload modal', () => {
            const errorObject = {
                ...buildErrorObject(essentialUrls.additionalFields),
                requestMethod: 'POST'
            };

            filter.errorHandlerFactory(449, errorObject);

            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
            expect(fakeManagement.blockAndReturnError).toHaveBeenCalled();
        });

        it('should still route GET additional-fields to init reload modal during init', () => {
            const errorObject = {
                ...buildErrorObject(essentialUrls.additionalFields),
                requestMethod: 'GET'
            };

            filter.errorHandlerFactory(449, errorObject);

            expect(fakeManagement.blockPaymentInitDataError).toHaveBeenCalled();
            expect(fakeManagement.blockAndReturnError).not.toHaveBeenCalled();
        });

        it('should not route essential init urls after modelPaymentData is set', () => {
            localStorageStore.modelPaymentData = { paymentInfo: {} };

            filter.errorHandlerFactory(449, buildErrorObject(essentialUrls.additionalFields));

            expect(fakeManagement.blockPaymentInitDataError).not.toHaveBeenCalled();
            expect(fakeManagement.blockAndReturnError).toHaveBeenCalled();
        });
    });

    describe('isEssentialInitDataRequest', () => {
        it('should return true for essential init urls', () => {
            expect(filter.isEssentialInitDataRequest(essentialUrls.country)).toBe(true);
            expect(filter.isEssentialInitDataRequest(essentialUrls.states)).toBe(true);
            expect(filter.isEssentialInitDataRequest(essentialUrls.paymentMethods)).toBe(true);
            expect(filter.isEssentialInitDataRequest(essentialUrls.additionalFields)).toBe(true);
        });

        it('should return false for unrelated urls', () => {
            expect(filter.isEssentialInitDataRequest('/pmt-ppm/rs/ppm/v7/order-1/issue')).toBe(false);
        });
    });
});
