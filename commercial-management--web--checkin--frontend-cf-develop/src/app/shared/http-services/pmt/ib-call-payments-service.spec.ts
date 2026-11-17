import { AncillariesCallPaymentsService } from './ib-call-payments-service';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
import * as angular from 'angular';

describe('AncillariesCallPaymentsService', () => {
    let service: AncillariesCallPaymentsService;
    let proxy: jasmine.SpyObj<CommonsGenericProxy>;
    let errorService: jasmine.SpyObj<CommonsNewHttpUtilsErrorService>;
    let sessionConfigService: jasmine.SpyObj<IbSessionConfigService>;
    let localStorageService: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;

    beforeEach(() => {
        proxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric']);
        errorService = jasmine.createSpyObj<CommonsNewHttpUtilsErrorService>('CommonsNewHttpUtilsErrorService', ['controlError']);
        errorService.controlError.and.callFake((error, reject) => reject(error));
        sessionConfigService = jasmine.createSpyObj<IbSessionConfigService>('IbSessionConfigService', ['getEndpoint']);
        localStorageService = jasmine.createSpyObj<angular.local.storage.ILocalStorageService>('localStorageService', ['get']);
        localStorageService.get.and.returnValue('flow-123');
        service = new AncillariesCallPaymentsService(
            { DEFAULT_ENDPOINTS: { paymentsURI: '/default-payments/' } } as unknown as CheckinAncillariesConstants,
            localStorageService,
            sessionConfigService,
            errorService,
            proxy
        );
    });

    it('uses the session payment endpoint and returns payment methods', async () => {
        const responseData = { paymentMethods: [{ id: 'card' }] };
        sessionConfigService.getEndpoint.and.returnValue('/configured-payments/');
        proxy.getGeneric.and.returnValue(Promise.resolve({ data: responseData }));

        const result = await service.getPayments();

        expect(proxy.getGeneric).toHaveBeenCalledWith('/configured-payments/flow-123/payment-methods');
        expect(result).toBe(responseData);
    });

    it('falls back to the default payment endpoint', async () => {
        const responseData = { paymentMethods: [] };
        sessionConfigService.getEndpoint.and.returnValue(null);
        proxy.getGeneric.and.returnValue(Promise.resolve({ data: responseData }));

        const result = await service.getPayments();

        expect(proxy.getGeneric).toHaveBeenCalledWith('/default-payments/flow-123/payment-methods');
        expect(result).toBe(responseData);
    });

    it('delegates payment request errors and rejects with the original error', async () => {
        const error = { status: 500 };
        sessionConfigService.getEndpoint.and.returnValue(null);
        proxy.getGeneric.and.returnValue(Promise.reject(error));

        await expectAsync(service.getPayments()).toBeRejectedWith(error);

        expect(errorService.controlError).toHaveBeenCalledWith(error, jasmine.any(Function));
    });
});