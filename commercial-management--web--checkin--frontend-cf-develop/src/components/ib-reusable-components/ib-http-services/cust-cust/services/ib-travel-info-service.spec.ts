import * as angular from 'angular';
import 'angular-mocks';
import { TravelInfoService } from './ib-travel-info-service';

type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

interface TravelDocument {
    id: string;
    type?: string;
}

interface RetryCase {
    methodName: keyof Pick<TravelInfoService, 'putTravelDocument' | 'postTravelDocument' | 'getTravelInfo' | 'deleteTravelInfo'>;
    callbackIndex: number;
    expectedArguments: unknown[];
}

describe('TravelInfoService', () => {
    let service: TravelInfoService;
    let $q: ng.IQService;
    let $rootScope: ng.IRootScopeService;
    let $timeout: ng.ITimeoutService;

    let localStorageService: SpyMap<'get'>;
    let commonsGenericProxy: SpyMap<'putGeneric' | 'postGeneric' | 'getGeneric' | 'deleteGeneric'>;
    let commonsHttpUtilsErrorService: SpyMap<'controlError'>;
    let commonsCookiesService: SpyMap<'get'>;
    let filter: jasmine.Spy;
    let translate: jasmine.Spy;

    const flowId = 'FLOW-123';
    const salesforceToken = 'salesforce-token';
    const travelDocumentEndpoint = '/travel-documents';
    const travelInfoEndpoint = '/travel-info';

    const httpServicesConstants = {
        URI: {
            DEFAULT_ENDPOINTS: {
                travelDocumentServiceURI: travelDocumentEndpoint,
                travelInfoServiceURI: travelInfoEndpoint
            }
        }
    } as unknown as HttpServicesConstantsNamespace.HttpServicesConstants;

    const expectedConfig = {
        headers: {
            'x-salesforce-token': salesforceToken
        },
        withCredentials: true
    };

    beforeEach(angular.mock.module('ng'));

    beforeEach(angular.mock.inject((
        _$q_: ng.IQService,
        _$rootScope_: ng.IRootScopeService,
        _$timeout_: ng.ITimeoutService
    ) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        translate = jasmine.createSpy('translate').and.returnValue('Session expired');
        filter = jasmine.createSpy('$filter').and.returnValue(translate);

        localStorageService = {
            get: jasmine.createSpy('get').and.returnValue(flowId)
        };

        commonsGenericProxy = {
            putGeneric: jasmine.createSpy('putGeneric'),
            postGeneric: jasmine.createSpy('postGeneric'),
            getGeneric: jasmine.createSpy('getGeneric'),
            deleteGeneric: jasmine.createSpy('deleteGeneric')
        };

        commonsHttpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        commonsCookiesService = {
            get: jasmine.createSpy('get').and.returnValue(salesforceToken)
        };

        service = new TravelInfoService(
            $q,
            filter as unknown as angular.IFilterService,
            httpServicesConstants,
            localStorageService as unknown as angular.local.storage.ILocalStorageService,
            commonsGenericProxy,
            commonsHttpUtilsErrorService,
            $timeout,
            commonsCookiesService
        );
    }));

    function resolvePromises(): void {
        $rootScope.$digest();
    }

    function expectDocumentRequestResult(
        request: () => angular.IPromise<unknown>,
        proxyMethod: jasmine.Spy,
        expectedArguments: unknown[],
        response: unknown
    ): void {
        let result: unknown;
        proxyMethod.and.returnValue($q.when(response));

        request().then((data: unknown) => result = data);
        resolvePromises();

        expect(proxyMethod).toHaveBeenCalledWith(...expectedArguments);
        expect(result).toEqual(response);
    }

    function expectSessionExpired(requests: Array<() => angular.IPromise<unknown>>): void {
        const errors: unknown[] = [];

        requests.forEach((request) => {
            request().catch((error: unknown) => errors.push(error));
        });

        $timeout.flush();

        expect(filter).toHaveBeenCalledWith('translate');
        expect(translate).toHaveBeenCalledWith('SESSION_EXPIRED');

        expect(errors).toEqual([
            {
                errorCode: 'IB_00002',
                message: 'Session expired',
                internalErrorCode: 'IB_00002'
            },
            {
                errorCode: 'IB_00002',
                message: 'Session expired',
                internalErrorCode: 'IB_00002'
            },
            {
                errorCode: 'IB_00002',
                message: 'Session expired',
                internalErrorCode: 'IB_00002'
            }
        ]);
    }

    describe('travel document requests', () => {
        it('sends PUT and POST requests with their endpoint, credentials and Salesforce token', () => {
            const requests = [
                {
                    document: { id: 'passport/123', type: 'PASSPORT' },
                    request: (document: TravelDocument) => service.putTravelDocument(document),
                    proxyMethod: commonsGenericProxy.putGeneric,
                    endpoint: '/travel-documents/passport%2F123',
                    response: { status: 200, data: { updated: true } }
                },
                {
                    document: { id: 'passport-123', type: 'PASSPORT' },
                    request: (document: TravelDocument) => service.postTravelDocument(document),
                    proxyMethod: commonsGenericProxy.postGeneric,
                    endpoint: '/travel-documents',
                    response: { status: 201, data: { created: true } }
                }
            ];

            requests.forEach(({ document, request, proxyMethod, endpoint, response }) => {
                expectDocumentRequestResult(
                    () => request(document),
                    proxyMethod,
                    [endpoint, document, expectedConfig],
                    response
                );
            });

            expect(commonsCookiesService.get).toHaveBeenCalledTimes(2);
            expect(commonsCookiesService.get).toHaveBeenCalledWith('IBERIACOM_SSO_ACCESS_SALESFORCE');
        });
    });

    describe('getTravelInfo', () => {
        it('gets travel information using the configured credentials', () => {
            const responseData = {
                documents: [{ id: 'passport-123', type: 'PASSPORT' }]
            };
            let result: unknown;

            commonsGenericProxy.getGeneric.and.returnValue(
                $q.when({ data: responseData })
            );

            service.getTravelInfo()
                .then((data: unknown) => result = data);

            resolvePromises();

            expect(commonsGenericProxy.getGeneric).toHaveBeenCalledWith(
                '/travel-documents',
                null,
                null,
                expectedConfig
            );
            expect(result).toEqual(responseData);
        });
    });

    describe('deleteTravelInfo', () => {
        it('deletes travel information and returns response data', () => {
            const responseData = { deleted: true };
            let result: unknown;

            commonsGenericProxy.deleteGeneric.and.returnValue(
                $q.when({ data: responseData })
            );

            service.deleteTravelInfo()
                .then((data: unknown) => result = data);

            resolvePromises();

            expect(commonsGenericProxy.deleteGeneric).toHaveBeenCalledWith(
                '/travel-info'
            );
            expect(result).toEqual(responseData);
        });
    });

    describe('HTTP errors', () => {
        it('delegates all request failures to the common error handler', () => {
            const error = { status: 500 };
            const document = { id: 'passport-123' };

            commonsGenericProxy.putGeneric.and.returnValue($q.reject(error));
            commonsGenericProxy.postGeneric.and.returnValue($q.reject(error));
            commonsGenericProxy.getGeneric.and.returnValue($q.reject(error));
            commonsGenericProxy.deleteGeneric.and.returnValue($q.reject(error));

            service.putTravelDocument(document);
            service.postTravelDocument(document);
            service.getTravelInfo();
            service.deleteTravelInfo();
            resolvePromises();

            expect(commonsHttpUtilsErrorService.controlError).toHaveBeenCalledTimes(4);
            commonsHttpUtilsErrorService.controlError.calls.allArgs().forEach((args: unknown[]) => {
                expect(args[0]).toEqual(error);
                expect(args[1]).toBe(0);
                expect(args[2]).toEqual(jasmine.any(Function));
                expect(args[3]).toEqual(jasmine.any(Object));
            });
        });

        it('retries each request through its error callback', () => {
            const error = { status: 503 };
            const document = { id: 'passport-123' };

            commonsGenericProxy.putGeneric.and.returnValue($q.reject(error));
            commonsGenericProxy.postGeneric.and.returnValue($q.reject(error));
            commonsGenericProxy.getGeneric.and.returnValue($q.reject(error));
            commonsGenericProxy.deleteGeneric.and.returnValue($q.reject(error));

            service.putTravelDocument(document);
            service.postTravelDocument(document);
            service.getTravelInfo();
            service.deleteTravelInfo();
            resolvePromises();

            const retryCases: RetryCase[] = [
                {
                    methodName: 'putTravelDocument',
                    callbackIndex: 0,
                    expectedArguments: [document, jasmine.any(Object)]
                },
                {
                    methodName: 'postTravelDocument',
                    callbackIndex: 1,
                    expectedArguments: [document, jasmine.any(Object)]
                },
                {
                    methodName: 'getTravelInfo',
                    callbackIndex: 2,
                    expectedArguments: [jasmine.any(Object)]
                },
                {
                    methodName: 'deleteTravelInfo',
                    callbackIndex: 3,
                    expectedArguments: [jasmine.any(Object)]
                }
            ];

            retryCases.forEach((retryCase) => {
                const retryCallback = commonsHttpUtilsErrorService.controlError.calls.argsFor(retryCase.callbackIndex)[2] as () => void;
                const methodSpy = spyOn(service, retryCase.methodName).and.returnValue($q.when({}));

                service.counterAttemps = 0;
                retryCallback();

                expect(service.counterAttemps).toBe(1);
                expect(methodSpy.calls.mostRecent().args).toEqual(retryCase.expectedArguments);
            });
        });
    });

    describe('expired session', () => {
        it('rejects document operations when flowId is not available', () => {
            localStorageService.get.and.returnValue(null);

            expectSessionExpired([
                () => service.putTravelDocument({ id: 'passport-123' }),
                () => service.postTravelDocument({ id: 'passport-123' }),
                () => service.getTravelInfo()
            ]);

            expect(commonsGenericProxy.putGeneric).not.toHaveBeenCalled();
            expect(commonsGenericProxy.postGeneric).not.toHaveBeenCalled();
            expect(commonsGenericProxy.getGeneric).not.toHaveBeenCalled();
        });
    });
});
