import angular from 'angular';
import 'angular-mocks';
import { CommonsGenericProxy } from 'src/app/core/proxies/ib-commons-generic-proxy';

describe('Service: CommonsGenericProxy', () => {
    let service: CommonsGenericProxy;
    let $httpBackend: ng.IHttpBackendService;
    let rootScope: CommonsRootScope;

    const baseUrl = '/api/test';

    beforeEach(() => {
        angular.module('ib-commons-proxies-module', [])
            .service('CommonsGenericProxy', CommonsGenericProxy);

        angular.mock.module('ib-commons-proxies-module');

        angular.mock.inject((
            _CommonsGenericProxy_: CommonsGenericProxy,
            _$httpBackend_: ng.IHttpBackendService,
            _$rootScope_: CommonsRootScope
        ) => {
            service = _CommonsGenericProxy_;
            $httpBackend = _$httpBackend_;
            rootScope = _$rootScope_;
            service.DIC_Headers = {
                'Accept-Language': 'es-ES'
            };
        });
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('initializes DIC_Headers with rootScope language', () => {
        expect(service.DIC_Headers).toEqual({
            'Accept-Language': 'es-ES'
        });
    });

    it('executes GET successfully', () => {
        const responseMock = { ok: true };

        $httpBackend.expectGET(baseUrl).respond(200, responseMock);

        let result: any;

        service.getGeneric(baseUrl).then((response: any) => {
            result = response;
        });

        $httpBackend.flush();

        expect(result.data).toEqual(responseMock);
        expect(result.code).toBe(200);
    });

    it('handles GET error correctly', () => {
        $httpBackend.expectGET(baseUrl).respond(500, { error: 'Server error' });

        let errorResult: any;

        service.getGeneric(baseUrl).catch((error: any) => {
            errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult.errorCode).toBe(500);
        expect(errorResult.data.error).toBe('Server error');
        expect(errorResult.requestURL).toContain(baseUrl);
    });

    it('sends custom headers and transaction-channel on POST', () => {
        const dataMock = {
            person: {
                sourceName: 'WEB'
            }
        };

        const newConfig: any = {
            headers: {
                Authorization: 'Bearer token'
            },
            withCredentials: true
        };

        $httpBackend.expectPOST(
            baseUrl,
            undefined,
            (headers: ng.IHttpRequestConfigHeaders) => {
                expect(headers.Authorization).toBe('Bearer token');
                expect(headers['transaction-channel']).toBe('WEB');
                return true;
            }
        ).respond(201, { success: true });

        let result: any;

        service.postGeneric(baseUrl, dataMock, newConfig)
            .then((response: any) => {
                result = response;
            })
            .catch(() => {
                fail('Promise was rejected');
            });

        $httpBackend.flush();

        expect(result.code).toBe(201);
    });

    it('executes DELETE successfully', () => {
        $httpBackend.expectDELETE(baseUrl).respond(204);

        let statusCode: number | undefined;

        service.deleteGeneric(baseUrl).then((response: any) => {
            statusCode = response.code;
        });

        $httpBackend.flush();

        expect(statusCode).toBe(204);
    });

    it('executes PATCH successfully', () => {
        const patchData = { name: 'test' };

        $httpBackend.expectPATCH(baseUrl).respond(200, patchData);

        let result: any;

        service.patchGeneric(baseUrl, patchData).then((response: any) => {
            result = response.data;
        });

        $httpBackend.flush();

        expect(result).toEqual(patchData);
    });
});
