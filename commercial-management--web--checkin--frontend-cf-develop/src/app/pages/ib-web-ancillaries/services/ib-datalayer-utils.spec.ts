import * as angular from 'angular';
import { DatalayerConstantsType } from 'ib-web-commons/dist/app/core/ib-datalayer/ib-datalayer-constants';
import { DigitalDataService as DigitalDataServiceType } from 'ib-web-commons/dist/app/core/ib-datalayer/services/ib-digital-data-service';
import { CkiDatalayerUtilsService as CkiDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbInsuranceAllianzDatalayerUtilsService as InsuranceDatalayerUtilsServiceType } from 'ib-web-ancillaries/dist/app/shared/ib-insurance-allianz-datalayer-utils.service';
import { DatalayerUtils } from './ib-datalayer-utils';

const createDatalayerConstants = () => ({
    EVENTS_ECOMMERCE: {
        SELECT_ITEM: 'select_item',
        ADD_TO_CART: 'add_to_cart',
        REMOVE_FROM_CART: 'remove_from_cart',
        VIEW_ITEM_LIST: 'view_item_list'
    },
    DATALAYER_EVENT_TYPES: { VIEW: 'view' },
    DATALAYER_ANCILLARIES: { ANCILLARIES: 'ancillaries' },
    DATALAYER_VALUES: { PURCHASE_CATEGORY: { DIRECT: 'Direct Purchase' } }
});

const createAncillariesConstants = () => ({
    DATALAYER_INFO: { PRIORITY_BOARDING: 'priority boarding', BUNDLE: 'bundle', BAGGAGE: 'baggage', BICYCLE: 'bicycle' },
    DATALAYER_ANC_EVENTS: {
        MOSEAT: 'seat', ON_OPEN: 'open:', ON_CLOSE: 'close:', CLICK: 'click',
        ON_ACTION_OPEN: 'action-open', ON_ACTION_CLOSE: 'action-close'
    },
    DATALAYER_EVENT_TYPES: { VIEW: 'view' },
    DATALAYER_ANCILLARIES: { ANCILLARIES: 'ancillaries' },
    QUADRIGAM: { ANCILLARIES: 'ancillaries-page' },
    APPLICATION_FLOW: { MMB: 'MMB', CHECKIN: 'CKI' },
    ANCILLARIES_NAME: { BAGGAGES: 'baggages', SEAT: 'seat', INSURANCE: 'insurance', SPECIAL_BAGGAGES: 'special baggages', FLEXIBILIZATION: 'flexibilization' },
    ANCILLARIES_TYPES: { PRIORITY_BOARDING: 'PRIORITY_BOARDING' },
    TYPE_ANCILLARIE: { BAGGAGE: 'BAGGAGE', SEAT: 'SEAT', INSURANCE: 'INSURANCE', INSURANCE_ALLIANZ: 'INSURANCE_ALLIANZ', SPEQS: 'SPEQS', FLEXIBILITY: 'FLEXIBILITY' },
    SPEQS_SUBTYPE: { SKI_SNOW: 'SKI_SNOW', BICYCLE: 'BICYCLE', GOLF_EQUIPMENT: 'GOLF_EQUIPMENT', FISHING_EQUIPMENT: 'FISHING_EQUIPMENT', SCUBA_DIVING: 'SCUBA_DIVING', SURFBOARD: 'SURFBOARD', SPORTING_FIREARMS: 'SPORTING_FIREARMS' }
});

const createServiceDependencies = () => ({
    commonsUtilService: {
        getIdItem: jasmine.createSpy('getIdItem').and.returnValue('item-1'),
        getSliceById: jasmine.createSpy('getSliceById'),
        checkIsAddToCart: jasmine.createSpy('checkIsAddToCart')
    },
    digitalDataService: {
        addDigitalDataEcommerceEvent: jasmine.createSpy('addDigitalDataEcommerceEvent'),
        setAddInfoAddToCart: jasmine.createSpy('setAddInfoAddToCart'),
        setRemoveInfoAddToCart: jasmine.createSpy('setRemoveInfoAddToCart')
    },
    ckiDatalayerUtilsService: {
        getItemCategory2: jasmine.createSpy('getItemCategory2').and.returnValue('MAD-LHR'),
        getItemCategory3: jasmine.createSpy('getItemCategory3').and.returnValue('category-3'),
        updateDatalayerAndDontSend: jasmine.createSpy('updateDatalayerAndDontSend'),
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam'),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam'),
        setProcessAndStep: jasmine.createSpy('setProcessAndStep'),
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo'),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent')
    },
    insuranceDatalayerUtilsService: {
        setInsuranceEcommerceViewItem: jasmine.createSpy('setInsuranceEcommerceViewItem').and.returnValue({ item_name: 'insurance' })
    }
});

interface ILocalStorageMock {
    get: jasmine.Spy<(key: string) => unknown>;
}

type ServiceDependencies = ReturnType<typeof createServiceDependencies>;

describe('DatalayerUtils', () => {
    let service: DatalayerUtils;
    let storage: Record<string, unknown>;
    let localStorageService: ILocalStorageMock;
    let datalayerConstants: ReturnType<typeof createDatalayerConstants>;
    let ancillariesConstants: ReturnType<typeof createAncillariesConstants>;
    let commonsUtilService: ServiceDependencies['commonsUtilService'];

    let digitalDataService: ServiceDependencies['digitalDataService'];
    let ckiDatalayerUtilsService: ServiceDependencies['ckiDatalayerUtilsService'];
    let insuranceDatalayerUtilsService: ServiceDependencies['insuranceDatalayerUtilsService'];
    let rootScope: { $broadcast: jasmine.Spy };
    let windowService: { digital_data?: Record<string, unknown> };
    let timeoutTasks: Array<() => void>;

    const expectEcommerceEvent = (event: string, expectedItem: Record<string, unknown>): void => {
        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith(jasmine.objectContaining({
            items: [jasmine.objectContaining(expectedItem)]
        }), event);
    };

    const expectCartComparison = (updateCart: () => void, expectedItem: Record<string, unknown>): void => {
        updateCart();
        expectEcommerceEvent('add_to_cart', expectedItem);
        expect(digitalDataService.setAddInfoAddToCart).toHaveBeenCalledWith({ items: [expectedItem] });

        digitalDataService.addDigitalDataEcommerceEvent.calls.reset();
        digitalDataService.setAddInfoAddToCart.calls.reset();
        const removedItem = { ...expectedItem, quantity: 1 };
        storage['addToCart'] = { ecommerce: { items: [{ ...expectedItem, quantity: 2 }] } };
        updateCart();

        expectEcommerceEvent('remove_from_cart', removedItem);
        expect(digitalDataService.setRemoveInfoAddToCart).toHaveBeenCalledWith({ items: [removedItem] });
    };

    const createExpectedEcommerceItem = (itemName: string, price: number, variant: string, quantity: number) => ({
        item_name: itemName,
        item_id: 'item-1',
        price,
        item_brand: '',
        item_category: 'direct purchase',
        item_category2: 'MAD-LHR',
        item_category3: 'category-3',
        item_variant: variant,
        quantity
    });

    const createBicyclePiece = () => ({
        subtype: 'BICYCLE',
        quantySelected: 1,
        availablePriceRanges: [{ from: 1, to: 1, amount: 40 }]
    });

    beforeEach(() => {
        storage = {};
        timeoutTasks = [];
        const dependencies = createServiceDependencies();
        localStorageService = {
            get: jasmine.createSpy('get') as jasmine.Spy<(key: string) => unknown>
        };
        localStorageService.get.and.callFake((key: string) => storage[key]);
        datalayerConstants = createDatalayerConstants();
        ancillariesConstants = createAncillariesConstants();
        commonsUtilService = dependencies.commonsUtilService;
        digitalDataService = dependencies.digitalDataService;
        ckiDatalayerUtilsService = dependencies.ckiDatalayerUtilsService;
        insuranceDatalayerUtilsService = dependencies.insuranceDatalayerUtilsService;
        rootScope = { $broadcast: jasmine.createSpy('$broadcast') };
        windowService = {};
        const timeout: jasmine.Spy<(callback: () => void) => void> = jasmine.createSpy('$timeout').and.callFake((callback: () => void) => {
            timeoutTasks.push(callback);
        });

        service = new DatalayerUtils(
            localStorageService as unknown as angular.local.storage.ILocalStorageService,
            datalayerConstants as unknown as DatalayerConstantsType,
            commonsUtilService as unknown as CommonsUtilService,
            digitalDataService as unknown as DigitalDataServiceType,
            ancillariesConstants as unknown as CheckinAncillariesConstants,
            ckiDatalayerUtilsService as unknown as CkiDatalayerUtilsServiceType,
            insuranceDatalayerUtilsService as unknown as InsuranceDatalayerUtilsServiceType,
            rootScope as unknown as CommonsRootScope,
            windowService as unknown as ng.IWindowService,
            timeout as unknown as ng.ITimeoutService
        );
    });

    it('does not emit an ecommerce event when no ancillary data exists', () => {
        service.getAncillariesDigitalDataEcommerce('baggages', 'view_item_list');

        expect(digitalDataService.addDigitalDataEcommerceEvent).not.toHaveBeenCalled();
    });

    it('maps priority boarding segments to ecommerce items', () => {
        storage['ancillariesInfo'] = {
            ancillaries: [{
                type: 'PRIORITY_BOARDING',
                segments: [{ id: 'slice-1', passengers: [{ amount: 5 }] }]
            }]
        };

        service.getAncillariesDigitalDataEcommerce('priority boarding', 'view_item_list');

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({
            items: [{
                item_name: 'priority boarding', item_id: 'item-1', price: 5, item_brand: '',
                item_category: 'direct purchase', item_category2: 'MAD-LHR',
                item_category3: 'category-3', item_variant: ''
            }]
        }, 'view_item_list');
        expect(commonsUtilService.getSliceById).toHaveBeenCalledWith('slice-1');
    });

    it('maps special baggage pieces and passenger quantity', () => {
        storage['ancillariesInfo'] = {
            ancillaries: [{
                type: 'SPEQS',
                slices: [{
                    id: 'slice-1',
                    passengers: [{ pieces: [{
                        subtype: 'BICYCLE',
                        quantySelected: 1,
                        availablePriceRanges: [{ from: 1, to: 1, amount: 40 }]
                    }] }, { pieces: [] }]
                }]
            }]
        };

        service.getAncillariesDigitalDataEcommerce('special baggages', 'view_item_list');

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({
            items: [{
                item_name: 'special baggage', item_id: 'item-1', price: 40, item_brand: '',
                item_category: 'direct purchase', item_category2: 'MAD-LHR',
                item_category3: 'category-3', item_variant: 'bicycle', quantity: 2
            }]
        }, 'view_item_list');
    });

    it('maps selected baggage to a select-item event using the matching price range', () => {
        service.setBaggagesSelectItem(
            { id: 'segment-1', departure: { code: 'MAD' }, arrival: { code: 'LHR' } },
            {
                description: '15 Kg',
                quantySelected: '2',
                availablePriceRanges: [
                    { from: 1, to: 1, amount: 20 },
                    { from: 2, to: 3, amount: 15 }
                ]
            }
        );

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({
            items: [{
                item_name: 'baggage', item_id: 'item-1', price: 15, item_brand: '',
                item_category: 'direct purchase', item_category2: 'MAD-LHR', item_category3: 'category-3',
                item_variant: '15kilos', quantity: 2
            }]
        }, 'select_item');
    });

    it('adds and removes baggage quantities by comparing the current model with the cart', () => {
        const model = {
            passengers: [{
                trips: [{
                    id: 'segment-1',
                    departure: { code: 'MAD' },
                    arrival: { code: 'LHR' },
                    pieces: [{
                        quantySelected: 1,
                        description: '15 Kg',
                        availablePriceRanges: [{ from: 1, to: 2, amount: 20 }]
                    }]
                }]
            }]
        };
        const expectedItem = {
            item_name: 'baggage', item_id: 'item-1', price: 20, item_brand: '',
            item_category: 'direct purchase', item_category2: 'MAD-LHR',
            item_category3: 'category-3', item_variant: '15kilos', quantity: 1
        };

        expectCartComparison(() => service.setBaggagesEventCart(model), expectedItem);
    });

    it('emits a seat select event only once for each selected seat until reset', () => {
        const model = { seatMapInfo: { segmentInfo: { id: 'segment-1', departure: { code: 'MAD' }, arrival: { code: 'LHR' } } } };
        const seat = { id: 'seat-12A', price: 25, originalType: 'WINDOW' };

        service.setSeatSelectItem(model, seat);
        service.setSeatSelectItem(model, seat);
        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledTimes(1);

        service.setRemoveSeatSelectedId();
        service.setSeatSelectItem(model, seat);
        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledTimes(2);
    });

    it('sets insurance add-to-cart metadata when the insurance is new', () => {
        commonsUtilService.checkIsAddToCart.and.returnValue(false);

        service.setInsuranceEcommerce({ id: 'CANCEL', provider: 'INSURER', originalPrice: 12 }, 'add_to_cart');

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith(jasmine.objectContaining({
            items: [jasmine.objectContaining({ item_name: 'insurance', item_brand: 'insurer', price: 12, item_variant: 'cancel' })]
        }), 'add_to_cart');
        expect(digitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
        expect(digitalDataService.setRemoveInfoAddToCart).not.toHaveBeenCalled();
    });

    it('sets remove metadata when the insurance event is not a new add-to-cart', () => {
        commonsUtilService.checkIsAddToCart.and.returnValue(true);

        service.setInsuranceEcommerce({ id: 'CANCEL', originalPrice: 12 }, 'add_to_cart');

        expect(digitalDataService.setRemoveInfoAddToCart).toHaveBeenCalled();
        expect(digitalDataService.setAddInfoAddToCart).not.toHaveBeenCalled();
    });

    it('emits bundle items as a view-item-list event', () => {
        storage['ancillariesInfo'] = { ancillaries: [], bundles: [{ id: 'bundle-1', priceItemsDiscount: 30 }] };

        service.getAncillariesDigitalDataEcommerce('bundle', 'view_item_list');

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({
            items: [{
                item_name: 'bundle', item_id: 'item-1', price: 30, item_brand: '',
                item_category: 'direct purchase', item_category2: 'all', item_category3: 'all', item_variant: 'bundle-1'
            }]
        }, 'view_item_list');
    });

    it('emits select and add-to-cart events for a selected bundle', () => {
        service.setSelectItemAndAddToCartBundle({ id: 'bundle-2', priceItemsDiscount: 25, items: [] });

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith(jasmine.objectContaining({
            items: [jasmine.objectContaining({ item_name: 'bundle', item_variant: 'bundle-2', price: 25 })]
        }), 'select_item');
        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith(jasmine.objectContaining({
            items: [jasmine.objectContaining({ item_name: 'bundle', item_variant: 'bundle-2', price: 25 })]
        }), 'add_to_cart');
        expect(digitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
    });

    it('emits a remove-from-cart event for a selected baggage piece', () => {
        service.setBaggagesRemoveFromCart(
            { id: 'segment-1', departure: { code: 'MAD' }, arrival: { code: 'LHR' } },
            {
                description: '20 Kg',
                quantySelected: 1,
                availablePriceRanges: [{ from: 1, to: 1, amount: 35 }]
            }
        );

        expectEcommerceEvent('remove_from_cart', {
            item_name: 'baggage', price: 35, item_category2: 'MAD-LHR', item_variant: '20kilos', quantity: 1
        });
    });

    it('emits select and add-to-cart events for a flexibilization offer', () => {
        const offer = {
            total: 45,
            description: 'Change Plus',
            subtype: 'FLEXIBILITY',
            discount: 0,
            percentage: 0,
            status: { code: 'AVAILABLE' }
        };

        service.setFlexibilizationSelectItem(offer);
        service.setFlexibilizationAddToCart(offer);

        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith(jasmine.objectContaining({
            items: [jasmine.objectContaining({
                item_name: 'flexibilization', price: 45, item_variant: 'change plus', quantity: 1
            })]
        }), 'select_item');
        expect(digitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith(jasmine.objectContaining({
            items: [jasmine.objectContaining({
                item_name: 'flexibilization', price: 45, item_variant: 'change plus', quantity: 1
            })]
        }), 'add_to_cart');
        expect(digitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
    });

    it('adds and removes seat quantities by comparing the seat summary with the cart', () => {
        const model = {
            seatMapInfo: { segmentInfo: { id: 'segment-1', departure: { code: 'MAD' } } },
            seatInfo: {
                segments: [{
                    departure: { code: 'MAD' },
                    arrival: { code: 'LHR' },
                    passengers: [{ seatPrice: 25, currentSeat: { originalType: 'WINDOW' } }]
                }]
            }
        };
        const expectedItem = {
            item_name: 'seat', item_id: 'item-1', price: 25, item_brand: '',
            item_category: 'direct purchase', item_category2: 'MAD-LHR',
            item_category3: 'category-3', item_variant: 'window', quantity: 1
        };

        expectCartComparison(() => service.setSeatAddToCart(model), expectedItem);
    });

    it('maps a special-equipment selection to its select-item event', () => {
        service.setSpeqsSelectItem(
            { id: 'segment-1', departure: { code: 'MAD' }, arrival: { code: 'LHR' } },
            {
                subtype: 'BICYCLE',
                quantySelected: 1,
                availablePriceRanges: [{ from: 1, to: 1, amount: 40 }]
            }
        );

        expectEcommerceEvent('select_item', {
            item_name: 'special baggage', price: 40, item_category2: 'MAD-LHR',
            item_variant: 'bicycle', quantity: 1
        });
    });

    it('emits priority-boarding select and add-to-cart events for checked segments', () => {
        service.setPriorityBoardingSelectItem({ id: 'segment-1', amount: 30, numPassengers: 0 });

        expectEcommerceEvent('select_item', {
            item_name: 'priority boarding', price: 30, item_category2: 'MAD-LHR', quantity: 1
        });

        digitalDataService.addDigitalDataEcommerceEvent.calls.reset();
        service.setPriorityBoardingAddToCart(
            [{ id: 'segment-1', passengerIds: ['passenger-1', 'passenger-2'] }],
            [{ trips: [{ id: 'segment-1', checkedTrip: true, amount: 30 }] }]
        );

        expectEcommerceEvent('add_to_cart', {
            item_name: 'priority boarding', price: 30, item_category2: 'MAD-LHR', quantity: 2
        });
        expect(digitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
    });

    it('adds and removes special-equipment quantities against the existing cart', () => {
        const model = {
            passengers: [{
                trips: [{
                    id: 'segment-1',
                    departure: { code: 'MAD' },
                    arrival: { code: 'LHR' },
                    pieces: [{
                        subtype: 'BICYCLE', quantySelected: 1,
                        availablePriceRanges: [{ from: 1, to: 1, amount: 40 }]
                    }]
                }]
            }]
        };

        service.setSpeqsEventCart(model);
        expectEcommerceEvent('add_to_cart', { item_name: 'special baggage', price: 40, quantity: 1 });

        digitalDataService.addDigitalDataEcommerceEvent.calls.reset();
        storage['addToCart'] = { ecommerce: { items: [{
            item_name: 'special baggage', item_id: 'item-1', price: 40, item_brand: '',
            item_category: 'direct purchase', item_category2: 'MAD-LHR', item_category3: 'category-3',
            item_variant: 'bicycle', quantity: 2
        }] } };
        service.setSpeqsEventCart(model);

        expectEcommerceEvent('remove_from_cart', { item_name: 'special baggage', price: 40, quantity: 1 });
        expect(digitalDataService.setRemoveInfoAddToCart).toHaveBeenCalled();
    });

    it('updates data-layer state and broadcasts ancillary modal events', () => {
        storage['userLogged'] = true;
        windowService.digital_data = { page: 'before' };
        spyOn(service, 'getAncillariesDigitalDataEcommerce');

        service.updateDataLayerAndDigitalData('MOSEAT');
        windowService.digital_data = { page: 'after' };
        timeoutTasks[0]();

        expect(ckiDatalayerUtilsService.updateDatalayerAndDontSend).toHaveBeenCalledWith('open:seat', 'click', 'action-open');
        expect(ckiDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalledWith('MOSEAT', null, true);
        expect(ckiDatalayerUtilsService.sendDatalayerEvent).toHaveBeenCalledWith('view');
        expect(ckiDatalayerUtilsService.setProcessAndStep).toHaveBeenCalledWith('ancillaries', null, 'MOSEAT');
        expect(ckiDatalayerUtilsService.updateDatalayerViewEvent).toHaveBeenCalledTimes(1);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateDatalayer');
        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateDigitalData');
        expect(rootScope.$broadcast).toHaveBeenCalledWith('sendUpdateToMonetate');
        expect(service.getAncillariesDigitalDataEcommerce).toHaveBeenCalledWith('seat', 'view_item_list');
    });

    it('records an accepted modal close against the ancillaries page', () => {
        spyOn(service, 'getAncillariesDigitalDataEcommerce');
        service.updateDataLayerAndDigitalData('MOSEAT', true, true);

        expect(ckiDatalayerUtilsService.updateDatalayerAndDontSend).toHaveBeenCalledWith('close:seat', 'click', 'action-close');
        expect(ckiDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalledWith('ancillaries-page', null, undefined);
        expect(ckiDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith({ Step: 'ancillaries' });
        expect(service.getAncillariesDigitalDataEcommerce).not.toHaveBeenCalled();
    });

    it('fires the deferred view event after the maximum polling interval', () => {
        windowService.digital_data = { page: 'stable' };
        service.updateDataLayerAndDigitalData('MOSEAT');

        for (let tryNumber = 0; tryNumber <= 40; tryNumber++) {
            const task = timeoutTasks.shift();
            if (task) task();
        }

        expect(ckiDatalayerUtilsService.updateDatalayerViewEvent).toHaveBeenCalledTimes(1);
    });

    it('cancels the previous deferred view-event polling cycle', () => {
        windowService.digital_data = { page: 'before' };
        service.updateDataLayerAndDigitalData('MOSEAT');
        service.updateDataLayerAndDigitalData('MOSEAT');
        windowService.digital_data = { page: 'after' };

        timeoutTasks.shift()?.();
        timeoutTasks.shift()?.();

        expect(ckiDatalayerUtilsService.updateDatalayerViewEvent).toHaveBeenCalledTimes(1);
    });
});