import * as angular from 'angular';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

interface BookingInformationServiceTestApi {
    getBookingInformationByLocatorAndSurname(surname: string, locator: string, flownSegments: string): ng.IPromise<unknown>;
    getBookingInformationByDeepLink(code: string): ng.IPromise<unknown>;
}

interface BookingInformationProxyTestApi {
    getBookingInformationByLocatorAndSurname: jasmine.Spy<(endpoint: string, surname: string) => ng.IPromise<unknown>>;
    getBookingInformationByDeepLink: jasmine.Spy<(endpoint: string, code: string) => ng.IPromise<unknown>>;
}

interface HttpUtilsErrorServiceTestApi {
    controlError: jasmine.Spy<(error: unknown, attempts: number, callback: Function, deferred: ng.IDeferred<unknown>) => unknown>;
}

describe('GetBookingInformationService', () => {
    let service: BookingInformationServiceTestApi;
    let q: ng.IQService;
    let rootScope: ng.IRootScopeService;
    let localStorageService: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let bookingInformationProxy: BookingInformationProxyTestApi;
    let httpUtilsErrorService: HttpUtilsErrorServiceTestApi;
    let sessionConfigService: jasmine.SpyObj<IbSessionConfigService>;

    beforeEach(() => {
        localStorageService = jasmine.createSpyObj<angular.local.storage.ILocalStorageService>('localStorageService', ['get', 'set']);
        localStorageService.get.and.callFake(<T>(key: string): T => (key === 'buildNumber' ? 'build-1' : null) as T);
        bookingInformationProxy = {
            getBookingInformationByLocatorAndSurname: jasmine.createSpy<(endpoint: string, surname: string) => ng.IPromise<unknown>>('getBookingInformationByLocatorAndSurname'),
            getBookingInformationByDeepLink: jasmine.createSpy<(endpoint: string, code: string) => ng.IPromise<unknown>>('getBookingInformationByDeepLink')
        };
        httpUtilsErrorService = {
            controlError: jasmine.createSpy<(error: unknown, attempts: number, callback: Function, deferred: ng.IDeferred<unknown>) => unknown>('controlError').and.callFake((error, attempts, callback, deferred) => {
                deferred.reject(error);
            })
        };
        sessionConfigService = jasmine.createSpyObj<IbSessionConfigService>('IbSessionConfigService', ['setPNR']);

        angular.mock.module('ib-http-services-module', ($provide: ng.auto.IProvideService) => {
            $provide.constant('HttpServicesConstants', {
                URI: {
                    DEFAULT_ENDPOINTS: {
                        getBookingInformationURI: '/booking/',
                        getBookingInformationDeepLinkURI: '/deep-link/'
                    }
                }
            });
            $provide.value('localStorageService', localStorageService);
            $provide.value('BookingInformationProxy', bookingInformationProxy);
            $provide.value('CommonsHttpUtilsErrorService', httpUtilsErrorService);
            $provide.value('IbSessionConfigService', sessionConfigService);
        });

        angular.mock.inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService, _GetBookingInformationService_: BookingInformationServiceTestApi) => {
            q = _$q_;
            rootScope = _$rootScope_;
            service = _GetBookingInformationService_;
        });
    });

    it('stores and returns booking information found by locator and surname', () => {
        const bookingInfo = { checkinId: 'flow-1' };
        let result: unknown;
        bookingInformationProxy.getBookingInformationByLocatorAndSurname.and.returnValue(q.when({ data: bookingInfo }));

        service.getBookingInformationByLocatorAndSurname('Smith', 'PNR', 'Y').then((response: unknown) => {
            result = response;
        });
        rootScope.$digest();

        expect(bookingInformationProxy.getBookingInformationByLocatorAndSurname).toHaveBeenCalledWith(
            '/booking/PNRbuild-1&flownSegments=Y',
            'Smith'
        );
        expect(localStorageService.set).toHaveBeenCalledWith('bookingInfo', bookingInfo);
        expect(localStorageService.set).toHaveBeenCalledWith('flowId', 'flow-1');
        expect(sessionConfigService.setPNR).toHaveBeenCalledWith('PNR');
        expect(result).toEqual(bookingInfo);
    });

    it('stores and returns booking information found by deep link', () => {
        const bookingInfo = { checkinId: 'flow-2', gdsLocator: 'GDS456' };
        let result: unknown;
        bookingInformationProxy.getBookingInformationByDeepLink.and.returnValue(q.when({ data: bookingInfo }));

        service.getBookingInformationByDeepLink('encrypted-code').then((response: unknown) => {
            result = response;
        });
        rootScope.$digest();

        expect(bookingInformationProxy.getBookingInformationByDeepLink).toHaveBeenCalledWith('/deep-link/build-1', 'encrypted-code');
        expect(localStorageService.set).toHaveBeenCalledWith('bookingInfo', bookingInfo);
        expect(localStorageService.set).toHaveBeenCalledWith('flowId', 'flow-2');
        expect(sessionConfigService.setPNR).toHaveBeenCalledWith('GDS456');
        expect(result).toEqual(bookingInfo);
    });

    it('delegates deep link request errors to the HTTP error service', () => {
        const error = { errorCode: 401 };
        let result: unknown;
        bookingInformationProxy.getBookingInformationByDeepLink.and.returnValue(q.reject(error));

        service.getBookingInformationByDeepLink('encrypted-code').catch((response: unknown) => {
            result = response;
        });
        rootScope.$digest();

        expect(httpUtilsErrorService.controlError).toHaveBeenCalledWith(
            error,
            0,
            jasmine.any(Function),
            jasmine.any(Object)
        );
        expect(result).toBe(error);
    });
});