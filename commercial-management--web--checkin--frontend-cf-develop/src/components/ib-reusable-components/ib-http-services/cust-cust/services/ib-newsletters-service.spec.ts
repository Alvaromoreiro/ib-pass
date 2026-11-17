import * as angular from 'angular';
import 'angular-mocks';
import { NewslettersService } from './ib-newsletters-service';

type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

describe('NewslettersService', () => {
    let service: NewslettersService;
    let $q: ng.IQService;
    let $rootScope: ng.IRootScopeService;

    let commonsGenericProxy: SpyMap<'putGeneric'>;
    let commonsHttpUtilsErrorService: SpyMap<'controlError'>;

    const endpoint = '/newsletters';
    const httpServicesConstants = {
        URI: {
            DEFAULT_ENDPOINTS: {
                putNewslettersURI: endpoint
            }
        }
    } as unknown as HttpServicesConstantsNamespace.HttpServicesConstants;

    beforeEach(angular.mock.module('ng'));

    beforeEach(angular.mock.inject((
        _$q_: ng.IQService,
        _$rootScope_: ng.IRootScopeService
    ) => {
        $q = _$q_;
        $rootScope = _$rootScope_;

        commonsGenericProxy = {
            putGeneric: jasmine.createSpy('putGeneric')
        };

        commonsHttpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        service = new NewslettersService(
            $q,
            httpServicesConstants,
            commonsGenericProxy as unknown as CommonsGenericProxy,
            commonsHttpUtilsErrorService as unknown as CommonsHttpUtilsErrorService
        );
    }));

    function resolvePromises(): void {
        $rootScope.$digest();
    }

    function triggerPutError(newslettersInfo: unknown, error: unknown): void {
        commonsGenericProxy.putGeneric.and.returnValue($q.reject(error));

        service.putNewsletters(newslettersInfo);

        resolvePromises();
    }

    it('sends newsletter information to the configured endpoint', () => {
        const newslettersInfo = {
            email: 'user@example.com',
            subscribed: true
        };
        const response = {
            status: 200,
            data: {
                updated: true
            }
        };
        let result: unknown;

        commonsGenericProxy.putGeneric.and.returnValue($q.when(response));

        service.putNewsletters(newslettersInfo)
            .then((data: unknown) => result = data);

        resolvePromises();

        expect(commonsGenericProxy.putGeneric).toHaveBeenCalledWith(
            endpoint,
            newslettersInfo
        );
        expect(result).toEqual(response);
    });

    it('delegates a request error to CommonsHttpUtilsErrorService', () => {
        const newslettersInfo = {
            email: 'user@example.com',
            subscribed: false
        };
        const error = {
            status: 500,
            message: 'Internal server error'
        };

        triggerPutError(newslettersInfo, error);

        expect(commonsHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
            error,
            0,
            jasmine.any(Function),
            jasmine.any(Object)
        );
    });

    it('rejects with the original error when the error handler rejects the request', () => {
        const newslettersInfo = {
            email: 'user@example.com',
            subscribed: false
        };
        const error = { status: 401 };
        let result: unknown;

        commonsGenericProxy.putGeneric.and.returnValue($q.reject(error));
        commonsHttpUtilsErrorService.controlError.and.callFake((response: unknown, attempts: number, callback: () => void, deferred: ng.IDeferred<unknown>) => {
            deferred.reject(response);
        });

        service.putNewsletters(newslettersInfo).catch((response: unknown) => result = response);
        resolvePromises();

        expect(result).toBe(error);
    });

    it('retries the request through the callback provided to the error handler', () => {
        const newslettersInfo = {
            email: 'user@example.com',
            subscribed: true
        };
        const error = {
            status: 503,
            message: 'Service unavailable'
        };

        triggerPutError(newslettersInfo, error);

        const retryCallback =
            commonsHttpUtilsErrorService.controlError.calls.mostRecent().args[2];

        const putNewslettersSpy = spyOn(service, 'putNewsletters')
            .and.returnValue($q.when({}));

        retryCallback();

        expect(service.counterAttemps).toBe(1);
        expect(putNewslettersSpy).toHaveBeenCalledWith(
            newslettersInfo,
            jasmine.any(Object)
        );
    });
});
