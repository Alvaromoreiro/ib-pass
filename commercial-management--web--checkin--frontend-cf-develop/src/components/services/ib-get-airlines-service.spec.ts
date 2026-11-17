import * as angular from 'angular';

type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

interface GetAirlinesServiceInstance {
    getAirlines(): angular.IPromise<unknown>;
}

describe('GetAirlinesService', () => {
    let service: GetAirlinesServiceInstance;
    let localStorageService: angular.local.storage.ILocalStorageService;
    let genericProxy: SpyMap<'getGeneric'>;
    let httpUtilsErrorService: SpyMap<'controlError'>;
    let q: ng.IQService;
    let rootScope: ng.IRootScopeService;
    const expectedAirlines = [{ code: 'IB', name: 'Iberia' }];

    beforeEach(() => {
        genericProxy = {
            getGeneric: jasmine.createSpy('getGeneric')
        };
        httpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        angular.mock.module('LocalStorageModule', 'ib-checkin-services-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('CheckinAppConstants', { airlinesJsonRoute: 'airlines.json' });
            $provide.constant('CommonsHttpUtilsErrorService', httpUtilsErrorService);
            $provide.value('CommonsGenericProxy', genericProxy);
        });

        angular.mock.inject((_$rootScope_: ng.IRootScopeService, _$q_: ng.IQService, _GetAirlinesService_: GetAirlinesServiceInstance, _localStorageService_: angular.local.storage.ILocalStorageService) => {
            rootScope = _$rootScope_;
            q = _$q_;
            service = _GetAirlinesService_;
            localStorageService = _localStorageService_;
        });
    });

    it('stores and returns the airline data when the request resolves', () => {
        genericProxy.getGeneric.and.returnValue(q.when({ data: expectedAirlines }));
        let result: unknown;

        service.getAirlines().then((airlines: unknown) => {
            result = airlines;
        });
        rootScope.$digest();

        expect(result).toEqual(expectedAirlines);
        expect(localStorageService.get('airlinesList')).toEqual(expectedAirlines);
        expect(genericProxy.getGeneric).toHaveBeenCalledWith('airlines.json');
    });

    xit('delegates request errors to the HTTP error service', () => {
        const error = { errorCode: 401 };
        let result: unknown;
        genericProxy.getGeneric.and.returnValue(q.reject(error));
        httpUtilsErrorService.controlError.and.callFake((response: unknown, attempts: number, callback: () => void, deferred: ng.IDeferred<unknown>) => {
            deferred.reject(response);
        });

        service.getAirlines().catch((response: unknown) => {
            result = response;
        });
        rootScope.$digest();

        expect(result).toBe(error);
        expect(httpUtilsErrorService.controlError).toHaveBeenCalledWith(
            error,
            0,
            jasmine.any(Function),
            jasmine.any(Object)
        );
    });
});