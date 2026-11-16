import { TestBed } from '@angular/core/testing';
import { IbMmbPaymentComponentService } from '@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-payment.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';
import { MmbHttpUtilsService } from '@src/components/services/Utils/ib-Mmb-http-utils.service';
import { AJSCommonsGenericProxyService } from './../../../../../../../src/components/services/http/commons-proxy-bridge.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';

describe('IbMmbPaymentComponentService', () => {
    let sessionStorageMock: StorageServiceMock;
    let service: IbMmbPaymentComponentService;
    let refreshTokenSpy: jasmine.Spy;
    let getGenericSpy: jasmine.Spy; 
    let postGenericSpy: jasmine.Spy;

    beforeEach(() => {
        sessionStorageMock = new StorageServiceMock();
        sessionStorageMock.clear();
        const flowId = 'FLOW_ID_123';
        sessionStorageMock.set('flowId', flowId);

        refreshTokenSpy = jasmine.createSpy('refreshToken').and.returnValue(Promise.resolve());
        getGenericSpy = jasmine.createSpy('getGeneric');
        postGenericSpy = jasmine.createSpy('postGeneric');

        TestBed.configureTestingModule({
            providers: [
                IbMmbPaymentComponentService,
                { provide: AJSRootScope, useValue: {} },
                { provide: CommonsSessionStorageService, useValue: sessionStorageMock },
                { provide: MmbHttpUtilsService, useValue: { refreshToken: refreshTokenSpy } },
                { provide: AJSCommonsGenericProxyService, useValue: { getGeneric: getGenericSpy, postGeneric: postGenericSpy } }
            ]
        });
        service = TestBed.inject(IbMmbPaymentComponentService);
    });

    it('should use GET for the VC flowApp and return the contextId', async () => {
        const expectedContext = 'ctx-vc-111';
        getGenericSpy.and.returnValue(Promise.resolve({ data: { contextId: expectedContext } }));
        const result = await service.getPaymentContextId(MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE);
        expect(refreshTokenSpy).toHaveBeenCalled();
        expect(getGenericSpy).toHaveBeenCalledTimes(1);
        expect(postGenericSpy).not.toHaveBeenCalled();
        const calledEndpoint = getGenericSpy.calls.mostRecent().args[0];
        expect(calledEndpoint).toContain(MmBAppConstants.DEFAULT_ENDPOINTS.getPaymentContextURI.split('?')[0]);
        expect(result).toBe(expectedContext);
    });

    it('should use POST for the Ancillaries flowApp and return the contextId', async () => {
        const expectedContext = 'ctx-anc-222';
        postGenericSpy.and.returnValue(Promise.resolve({ data: { contextId: expectedContext } }));
        const result = await service.getPaymentContextId(MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES);
        expect(refreshTokenSpy).toHaveBeenCalled();
        expect(postGenericSpy).toHaveBeenCalledTimes(1);
        expect(getGenericSpy).not.toHaveBeenCalled();
        const [endpoint, body] = postGenericSpy.calls.mostRecent().args;
        expect(endpoint).toContain(MmBAppConstants.DEFAULT_ENDPOINTS.getPaymentContextAncillariesURI.split('/v1')[0]);
        expect(body?.redirection).toBeTruthy();
        expect(result).toBe(expectedContext);
    });

    it('should propagate error when GET fails', async () => {
        spyOn(console, 'error');
        getGenericSpy.and.returnValue(Promise.reject(new Error('network')));
        await expectAsync(
            service.getPaymentContextId(MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE)
        ).toBeRejectedWithError();
        expect(getGenericSpy).toHaveBeenCalled();
    });

    it('should propagate error when POST fails', async () => {
        spyOn(console, 'error');
        postGenericSpy.and.returnValue(Promise.reject(new Error('500')));
        await expectAsync(
            service.getPaymentContextId(MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES)
        ).toBeRejectedWithError();
        expect(postGenericSpy).toHaveBeenCalled();
    });
});
