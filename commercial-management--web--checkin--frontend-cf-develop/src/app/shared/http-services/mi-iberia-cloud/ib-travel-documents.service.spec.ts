import { TestBed } from '@angular/core/testing';
import { CheckinSalesforceRxProxy } from '@shared/http-services/proxy/ib-checkin-salesforce-rx-proxy.service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { Observable, of, throwError } from 'rxjs';
import { IbTravelDocumentsService } from './ib-travel-documents.service';
import { TravelDocumentRequest } from '@src/app/core/models/travel-documents/travel-documents-model';
import { ChekinHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import { BaseServiceConfigJson } from 'ib-web-commons/proxies';

describe('IbTravelDocumentsService', () => {
    let service: IbTravelDocumentsService;
    let proxyMock: jasmine.SpyObj<CheckinSalesforceRxProxy>;
    let errorHandlerMock: jasmine.SpyObj<IbCHttpErrorHandlerService>;
    const locale = 'en-US';
    const endpoint = CheckinAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
    const data: TravelDocumentRequest = {
        documentType: 'PASSPORT',
        documentNumber: '00055500011',
        expiryDate: '2030-07-20',
        country: 'FR',
        name: 'Brutus',
        surnames: 'Fortex',
        gender: 'WOMAN',
        birthdate: '1982-07-21',
        nationality: 'ES',
        ocrUsed: false
    };

    function expectHeadersConfig(config: BaseServiceConfigJson, expectedLocale: string) {
        expect(config.headers['Accept-Language']).toBe(expectedLocale);
        expect(config.withCredentials).toBe(false);
    }

    async function expectRejectsWith(method: () => Promise<unknown>, expectedError: Error) {
        try {
            await method();
            fail('Should have thrown');
        } catch (e) {
            expect(e).toBe(expectedError);
        }
    }

    function mockProxyReturn(method: 'get' | 'post' | 'put', value: Observable<ChekinHttpResponse<unknown>>) {
        proxyMock[method].and.returnValue(value);
    }

    function expectProxyCall(method: 'get' | 'post' | 'put', expectedEndpoint: string, expectedArgs: unknown[]) {
        const configMatcher = jasmine.objectContaining({
            headers: jasmine.objectContaining({ 'Accept-Language': locale })
        });

        // For get: expect(proxyMock.get).toHaveBeenCalledWith(endpoint, configMatcher)
        // For post/put: include data argument before config matcher
        if (method === 'get') {
            expect(proxyMock.get).toHaveBeenCalledWith(expectedEndpoint, configMatcher);
        } else if (method === 'post') {
            const [data] = expectedArgs;
            expect(proxyMock.post).toHaveBeenCalledWith(expectedEndpoint, data, configMatcher);
        } else if (method === 'put') {
            const data = expectedArgs.length === 2 ? expectedArgs[1] : expectedArgs[0];
            expect(proxyMock.put).toHaveBeenCalledWith(expectedEndpoint, data, configMatcher);
        }
    }

    beforeEach(() => {
        proxyMock = jasmine.createSpyObj('CheckinSalesforceRxProxy', ['get', 'post', 'put']);
        errorHandlerMock = jasmine.createSpyObj('IbCHttpErrorHandlerService', ['handleErrorOperator']);
        errorHandlerMock.handleErrorOperator.and.returnValue(<T>(source: Observable<T>) => source);

        TestBed.configureTestingModule({
            providers: [
                IbTravelDocumentsService,
                { provide: CheckinSalesforceRxProxy, useValue: proxyMock },
                { provide: IbCHttpErrorHandlerService, useValue: errorHandlerMock }
            ]
        });

        service = TestBed.inject(IbTravelDocumentsService);
    });

    describe('getHeadersConfig', () => {
        it('should return headers with default locale', () => {
            const config = (service as unknown as { getHeadersConfig: (locale?: string) => BaseServiceConfigJson }).getHeadersConfig();
            expectHeadersConfig(config, 'es-ES');
        });

        it('should return headers with provided locale', () => {
            const config = (service as unknown as { getHeadersConfig: (locale?: string) => BaseServiceConfigJson }).getHeadersConfig(locale);
            expectHeadersConfig(config, locale);
        });
    });

    describe('getTravelDocuments', () => {
        const mockResponse = { code: 200, data: { documents: [] } };

        it('should call proxy.get with correct endpoint and config and return response', async () => {
            mockProxyReturn('get', of(mockResponse));
            const result = await service.getTravelDocuments(locale);

            expectProxyCall('get', endpoint, []);
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors from proxy.get', async () => {
            const error = new Error('network');
            mockProxyReturn('get', throwError(() => error));

            await expectRejectsWith(() => service.getTravelDocuments(locale), error);
        });
    });

    describe('postTravelDocuments', () => {
        const mockData: TravelDocumentRequest = data;
        const mockResponse = { code: 201, data: { id: 'doc1' } };

        it('should call proxy.post with correct endpoint, data and config and return response', async () => {
            mockProxyReturn('post', of(mockResponse));
            const result = await service.postTravelDocuments(mockData, locale);

            expectProxyCall('post', endpoint, [mockData]);
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors from proxy.post', async () => {
            const error = new Error('fail');
            mockProxyReturn('post', throwError(() => error));

            await expectRejectsWith(() => service.postTravelDocuments(mockData, locale), error);
        });
    });

    describe('putTravelDocuments', () => {
        const mockData: TravelDocumentRequest = data;

        it('should call proxy.put with correct endpoint, data and config and resolve', async () => {
            mockProxyReturn('put', of(undefined));
            await service.putTravelDocuments('docId', mockData, locale);

            expectProxyCall('put', `${endpoint}/docId`, [mockData]);
        });

        it('should encode documentId in endpoint', async () => {
            mockProxyReturn('put', of(undefined));
            await service.putTravelDocuments('id/with/slash', data, locale);

            expect(proxyMock.put).toHaveBeenCalledWith(
                `${endpoint}/${encodeURIComponent('id/with/slash')}`,
                data,
                jasmine.any(Object)
            );
        });

        it('should handle errors from proxy.put', async () => {
            const error = new Error('fail');
            mockProxyReturn('put', throwError(() => error));

            await expectRejectsWith(() => service.putTravelDocuments('docId', mockData, locale), error);
        });
    });
});
