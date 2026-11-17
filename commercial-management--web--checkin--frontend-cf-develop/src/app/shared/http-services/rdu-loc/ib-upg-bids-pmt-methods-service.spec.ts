import { PmtMethodsUpgradingBidsService } from './ib-upg-bids-pmt-methods-service';

describe('PmtMethodsUpgradingBidsService', () => {
    let service: PmtMethodsUpgradingBidsService;
    let proxy: jasmine.SpyObj<CommonsGenericProxy>;
    let errorService: jasmine.SpyObj<CommonsNewHttpUtilsErrorService>;

    beforeEach(() => {
        proxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric']);
        errorService = jasmine.createSpyObj<CommonsNewHttpUtilsErrorService>('CommonsNewHttpUtilsErrorService', ['controlError']);
        errorService.controlError.and.callFake((error, reject) => reject(error));
        service = new PmtMethodsUpgradingBidsService(
            {} as unknown as ng.IQService,
            proxy,
            { DEFAULT_ENDPOINTS: { paymentMethodsServiceURI: '/payment-methods' } } as unknown as CheckinAncillariesConstants,
            errorService
        );
    });

    it('requests payment methods using country, total and currency', async () => {
        const response = { methods: [{ id: 'card' }] };
        proxy.getGeneric.and.returnValue(Promise.resolve(response));

        const result = await service.getPaymentMethodsUpgradingBids('ES', '120.50', 'EUR');

        expect(proxy.getGeneric).toHaveBeenCalledWith(
            '/payment-methods?country=ES&total=120.50&currency=EUR'
        );
        expect(result).toBe(response);
    });

    it('delegates payment method errors and rejects with the original error', async () => {
        const error = { status: 503 };
        proxy.getGeneric.and.returnValue(Promise.reject(error));

        await expectAsync(service.getPaymentMethodsUpgradingBids('ES', '120.50', 'EUR'))
            .toBeRejectedWith(error);

        expect(errorService.controlError).toHaveBeenCalledWith(error, jasmine.any(Function));
    });
});