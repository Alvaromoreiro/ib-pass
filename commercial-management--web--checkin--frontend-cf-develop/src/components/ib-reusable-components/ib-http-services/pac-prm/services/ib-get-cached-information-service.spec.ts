/// <reference types="jasmine" />
import 'angular';
import 'angular-mocks';
import * as angular from 'angular';
import { GetCKICachedInformationService } from './ib-get-cached-information-service';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

interface Base64TestApi {
    encode(value: string): string;
}

describe('GetCKICachedInformationService', () => {
    let service: GetCKICachedInformationService;
    let $q: ng.IQService;
    let $rootScope: ng.IRootScopeService;
    let $timeout: ng.ITimeoutService;

    let commonsGenericProxy: jasmine.SpyObj<CommonsGenericProxy>;
    let commonsHttpUtilsErrorService: jasmine.SpyObj<CommonsHttpUtilsErrorService>;
    let sessionConfigService: jasmine.SpyObj<IbSessionConfigService>;
    let base64: jasmine.SpyObj<Base64TestApi>;
    let filter: jasmine.Spy;
    let translate: jasmine.Spy;

    const checkinId = 'checkin-123';
    const cachedInformationURI = '/pac-prm/rs/checkin/v3/booking/checkinId/';
    const successfulResponse = { data: { id: 'response-id', status: 'OK' } };

    interface PromiseState {
        value?: unknown;
        error?: unknown;
    }

    const observePromise = (promise: angular.IPromise<unknown>): PromiseState => {
        const state: PromiseState = {};

        promise.then(
            (value) => {
                state.value = value;
            },
            (error) => {
                state.error = error;
            }
        );

        return state;
    };

    const flushPromises = (): void => {
        $rootScope.$digest();
    };

    const expectSessionExpired = (request: () => angular.IPromise<unknown>): void => {
        const result = observePromise(request());

        $timeout.flush();
        flushPromises();

        expect(commonsGenericProxy.getGeneric).not.toHaveBeenCalled();
        expect(translate).toHaveBeenCalledWith('SESSION_EXPIRED');
        expect(result.error).toEqual({
            errorCode: 'IB_00002',
            message: 'Session expired',
            internalErrorCode: 'IB_00002'
        });
    };

    beforeEach(angular.mock.inject([
        '$q',
        '$rootScope',
        '$timeout',
        (
            _$q_: ng.IQService,
            _$rootScope_: ng.IRootScopeService,
            _$timeout_: ng.ITimeoutService
        ) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
        }
    ]));

    beforeEach(() => {
        translate = jasmine.createSpy('translate').and.returnValue('Session expired');

        filter = jasmine.createSpy('$filter').and.callFake((filterName: string) => {
            return filterName === 'translate' ? translate : angular.noop;
        });

        commonsGenericProxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric']);

        commonsHttpUtilsErrorService = jasmine.createSpyObj<CommonsHttpUtilsErrorService>('CommonsHttpUtilsErrorService', ['controlError']);

        sessionConfigService = jasmine.createSpyObj<IbSessionConfigService>('IbSessionConfigService', ['getFlowId']);
        sessionConfigService.getFlowId.and.returnValue(checkinId);

        base64 = jasmine.createSpyObj<Base64TestApi>('base64', ['encode']);
        base64.encode.and.callFake((value: string) => `encoded-${value}`);

        service = new GetCKICachedInformationService(
            $q,
            {
                URI: {
                    DEFAULT_ENDPOINTS: {
                        cachedInformationURI
                    }
                }
            } as unknown as HttpServicesConstantsNamespace.HttpServicesConstants,
            commonsGenericProxy,
            commonsHttpUtilsErrorService,
            $timeout,
            filter as unknown as angular.IFilterService,
            base64,
            sessionConfigService
        );
    });

    it('should initialize the retry counter with zero attempts', () => {
        expect(service.counterAttemps).toBe(0);
    });

    it('should request cached information and resolve the response data', () => {
        commonsGenericProxy.getGeneric.and.returnValue($q.when(successfulResponse));

        const result = observePromise(service.getCachedInformation());

        flushPromises();

        expect(commonsGenericProxy.getGeneric).toHaveBeenCalledWith(
            `${cachedInformationURI}${checkinId}/cached`,
            null,
            null,
            undefined
        );
        expect(result.value).toEqual(successfulResponse.data);
    });

    it('should request cached Lotus information with encoded authentication headers', () => {
        const code = 'lotus-code';
        const sessionToken = 'session-token';

        commonsGenericProxy.getGeneric.and.returnValue($q.when(successfulResponse));

        const result = observePromise(service.getCachedLotus(code, sessionToken));

        flushPromises();

        expect(base64.encode).toHaveBeenCalledWith(code);
        expect(base64.encode).toHaveBeenCalledWith(sessionToken);
        expect(commonsGenericProxy.getGeneric).toHaveBeenCalledWith(
            `${cachedInformationURI}${checkinId}/cached-lotus`,
            null,
            null,
            {
                headers: {
                    'session-token': `encoded-${sessionToken}`,
                    code: `encoded-${code}`
                },
                withCredentials: true
            }
        );
        expect(result.value).toEqual(successfulResponse.data);
    });

    it('should reject requests when the session is invalid or Lotus credentials are missing', () => {
        sessionConfigService.getFlowId.and.returnValue(null);

        expectSessionExpired(() => service.getCachedInformation());

        sessionConfigService.getFlowId.and.returnValue(checkinId);

        expectSessionExpired(() => service.getCachedLotus('', 'session-token'));
        expectSessionExpired(() => service.getCachedLotus('lotus-code', ''));
    });

    it('should delegate request errors and retry using the same deferred promise', () => {
        const requestError = { status: 500, message: 'Service unavailable' };

        commonsGenericProxy.getGeneric.and.callFake(() => {
            return commonsGenericProxy.getGeneric.calls.count() === 1
                ? $q.reject(requestError)
                : $q.when(successfulResponse);
        });

        const result = observePromise(service.getCachedInformation());

        flushPromises();

        expect(commonsHttpUtilsErrorService.controlError).toHaveBeenCalled();

        const [, attempts, retryAction] =
            commonsHttpUtilsErrorService.controlError.calls.mostRecent().args;

        expect(attempts).toBe(0);

        retryAction();

        flushPromises();

        expect(service.counterAttemps).toBe(1);
        expect(commonsGenericProxy.getGeneric).toHaveBeenCalledTimes(2);
        expect(result.value).toEqual(successfulResponse.data);
    });
});
