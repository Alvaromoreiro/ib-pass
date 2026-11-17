import * as angular from 'angular';
describe('UserLoggedBookingService', function () {
    let service;
    let rootScope;
    let q;
    let proxy;
    let errorService;
    let localStorageService;

    beforeEach(function () {
        proxy = {
            getGeneric: jasmine.createSpy('getGeneric')
        };
        errorService = {
            controlError: jasmine.createSpy('controlError')
        };
        localStorageService = {
            set: jasmine.createSpy('set')
        };

        angular.mock.module('ib-http-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', proxy);
            $provide.value('CommonsHttpUtilsErrorService', errorService);
            $provide.constant('HttpServicesConstants', {
                URI: { DEFAULT_ENDPOINTS: { getLoggedBookingURI: '/booking-information' } }
            });
            $provide.value('localStorageService', localStorageService);
        });
    });

    beforeEach(inject(function (UserLoggedBookingService, $rootScope, $q) {
        service = UserLoggedBookingService;
        rootScope = $rootScope;
        q = $q;
    }));

    it('should return and persist the booking information from the proxy', function () {
        let bookingInformation = [{ locator: 'ABC123' }];
        let result;
        proxy.getGeneric.and.returnValue(q.when({ data: bookingInformation }));

        service.getUserLoggedBookingInformation().then(function (response) {
            result = response;
        });
        rootScope.$digest();

        expect(proxy.getGeneric).toHaveBeenCalledOnceWith('/booking-information');
        expect(localStorageService.set).toHaveBeenCalledOnceWith('userLoggedBookingInfo', bookingInformation);
        expect(result).toBe(bookingInformation);
    });

    it('should delegate proxy errors to the common HTTP error handler', function () {
        let requestError = { errorCode: 500, data: { message: 'Request failed' } };
        proxy.getGeneric.and.returnValue(q.reject(requestError));

        service.getUserLoggedBookingInformation();
        rootScope.$digest();

        expect(errorService.controlError).toHaveBeenCalledTimes(1);
        expect(errorService.controlError.calls.argsFor(0)[0]).toBe(requestError);
        expect(errorService.controlError.calls.argsFor(0)[1]).toBe(0);
        expect(errorService.controlError.calls.argsFor(0)[2]).toEqual(jasmine.any(Function));
        expect(errorService.controlError.calls.argsFor(0)[3]).toEqual(jasmine.any(Object));
        expect(localStorageService.set).not.toHaveBeenCalled();
    });
});