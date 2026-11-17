import { PmtUpgBidsCreditCardsService } from './ib-pmt-credit-cards-service';
import * as angular from 'angular';

describe('PmtUpgBidsCreditCardsService', () => {
    let service: PmtUpgBidsCreditCardsService;
    let localStorageService: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let proxy: jasmine.SpyObj<CommonsGenericProxy>;
    let errorService: jasmine.SpyObj<CommonsNewHttpUtilsErrorService>;

    beforeEach(() => {
        localStorageService = jasmine.createSpyObj<angular.local.storage.ILocalStorageService>('localStorageService', ['get']);
        localStorageService.get.and.returnValue(null);
        proxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric']);
        errorService = jasmine.createSpyObj<CommonsNewHttpUtilsErrorService>('CommonsNewHttpUtilsErrorService', ['controlError']);
        errorService.controlError.and.callFake((error, reject) => reject(error));
        service = new PmtUpgBidsCreditCardsService(
            proxy,
            { ROUTES: { icons: '/icons', creditCardsJson: '/credit-cards.json' } } as unknown as CheckinAncillariesConstants,
            localStorageService,
            errorService
        );
    });

    it('returns cached credit card images without requesting the endpoint', async () => {
        const cachedCards = [{ code: 'VI', image: 'visa.png' }];
        localStorageService.get.and.returnValue(cachedCards);

        const result = await service.getCreditCardsImgs();

        expect(result).toBe(cachedCards);
        expect(proxy.getGeneric).not.toHaveBeenCalled();
    });

    it('loads credit card images when the cache is empty', async () => {
        const cards = [{ code: 'VI', image: 'visa.png' }];
        proxy.getGeneric.and.returnValue(Promise.resolve(cards));

        const result = await service.getCreditCardsImgs();

        expect(proxy.getGeneric).toHaveBeenCalledWith('/icons/credit-cards.json');
        expect(result).toBe(cards);
    });

    it('delegates endpoint errors and rejects with the original error', async () => {
        const error = { status: 500 };
        proxy.getGeneric.and.returnValue(Promise.reject(error));

        await expectAsync(service.getCreditCardsImgs()).toBeRejectedWith(error);

        expect(errorService.controlError).toHaveBeenCalledWith(error, jasmine.any(Function));
    });
});
