import { MonetateConstants } from '../ib-monetate-constants';
import { MonetateService } from './ib-monetate-service';

describe('MonetateService', () => {
	let service: MonetateService;
	let windowMock: ng.IWindowService;
	let localStorageService: jasmine.SpyObj<ng.local.storage.ILocalStorageService>;

	beforeEach(() => {
		windowMock = {} as ng.IWindowService;
		localStorageService = jasmine.createSpyObj('localStorageService', ['get', 'set']);
		service = new MonetateService(windowMock, MonetateConstants, localStorageService);
	});

	describe('queue initialization', () => {
		it('should initialize and expose the Monetate queue', () => {
			service.initMonetate();

			expect(windowMock.monetateQ).toEqual([]);
			expect(service.monetateQ).toBe(windowMock.monetateQ);
			expect(service.checkMonetateQ()).toBeTrue();
		});

		it('should preserve an existing Monetate queue', () => {
			const existingQueue = [['existingEvent']];
			windowMock.monetateQ = existingQueue;

			service.initMonetate();

			expect(service.monetateQ as unknown[]).toBe(existingQueue);
		});

		it('should return the current queue', () => {
			service.initMonetate();

			expect(service.getMonetateGeneral()).toBe(windowMock.monetateQ);
		});
	});

	describe('Monetate events', () => {
		beforeEach(() => service.initMonetate());

		it('should add page type and general information to the queue', () => {
			const pageType = ['setPageType', 'CHECKIN'];
			const generalInfo = { currency: 'EUR' };

			service.addMonetatePageType(pageType);
			service.addMonetateGeneralInfo(generalInfo);
			service.addMonetateGeneralInfo(null);

			expect(windowMock.monetateQ).toEqual([pageType, generalInfo, {}]);
		});

		it('should send a track update', () => {
			service.sendUpdateToMonetate();

			expect(windowMock.monetateQ).toEqual([['trackData']]);
		});

		it('should send the stored page type and then track the update', () => {
			localStorageService.get.and.returnValue('CHECKIN');

			service.sendMonetatePageType();

			expect(localStorageService.get).toHaveBeenCalledWith('close');
			expect(windowMock.monetateQ).toEqual([['setPageType', 'CHECKIN'], ['trackData']]);
		});

		it('should add product details and default to an empty list', () => {
			const details = ['MAD', 'LHR'];

			service.addProductDetails(details);
			service.addProductDetails();

			expect(windowMock.monetateQ).toEqual([
				['addProductDetails', details],
				['addProductDetails', []]
			]);
		});
	});

	describe('ancillary products', () => {
		it('should deduplicate cart products, mark ancillaries and persist the collection', () => {
			service.initMonetate();
			const firstProduct = { productId: 'seat', unitPrice: '20' } as CommonsMonetateModels.CartProductDetails;
			const replacementProduct = { productId: 'seat', unitPrice: '25' } as CommonsMonetateModels.CartProductDetails;
			const freeProduct = { productId: 'bag', unitPrice: '0' } as CommonsMonetateModels.CartProductDetails;
			const products = [firstProduct, replacementProduct, freeProduct];

			service.trackAncillariesProductsAdded(products, MonetateConstants.TRACK_PLACE.CART);

			expect(service.totalProductCollection).toEqual([
				{ ...replacementProduct, isAncillary: true },
				{ ...freeProduct, isAncillary: false }
			]);
			expect(localStorageService.set).toHaveBeenCalledWith('addedCartProducts', service.totalProductCollection);
			expect(windowMock.monetateQ).toEqual([['addCartRows', products]]);
		});

		it('should append unique products from later cart updates', () => {
			service.trackAncillariesProductsAdded(
				[{ productId: 'seat', unitPrice: '20' } as CommonsMonetateModels.CartProductDetails],
				MonetateConstants.TRACK_PLACE.CART
			);

			service.trackAncillariesProductsAdded(
				[{ productId: 'bag', unitPrice: '10' } as CommonsMonetateModels.CartProductDetails],
				MonetateConstants.TRACK_PLACE.CART
			);

			expect(service.totalProductCollection.map((product: CommonsMonetateModels.CartProductDetails) => product.productId)).toEqual(['seat', 'bag']);
			expect(localStorageService.set).toHaveBeenCalledTimes(2);
		});

		it('should send purchase rows without changing the stored cart', () => {
			service.initMonetate();
			const products = [{ productId: 'seat' } as CommonsMonetateModels.PurchaseProduct];

			service.trackAncillariesProductsAdded(products, MonetateConstants.TRACK_PLACE.PURCHASE);

			expect(windowMock.monetateQ).toEqual([['addPurchaseRows', products]]);
			expect(service.totalProductCollection).toEqual([]);
			expect(localStorageService.set).not.toHaveBeenCalled();
		});
	});

	it('should not enqueue events before Monetate is initialized', () => {
		service.addMonetatePageType(['setPageType', 'CHECKIN']);
		service.addMonetateGeneralInfo({ currency: 'EUR' });
		service.sendUpdateToMonetate();
		service.sendMonetatePageType();
		service.trackAncillariesProductsAdded([], MonetateConstants.TRACK_PLACE.PURCHASE);
		service.addProductDetails();

		expect(service.checkMonetateQ()).toBeFalse();
		expect(windowMock.monetateQ).toBeUndefined();
		expect(localStorageService.get).not.toHaveBeenCalled();
	});
});
