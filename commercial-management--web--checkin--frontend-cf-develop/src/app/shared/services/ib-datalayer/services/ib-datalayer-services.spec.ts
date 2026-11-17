import * as angular from 'angular';

import { CkiDataLayerService } from './ib-cki-datalayer-service';
import { CkiDigitalDataService } from './ib-cki-digital-data-service';

type DataLayerWindow = Window & {
    dataLayer?: unknown[];
    datalayer_general?: Record<string, unknown>;
    datalayer_ecommerce?: Record<string, unknown>;
    digital_data?: Record<string, unknown>;
};

describe('CKI data layer services', () => {
    let dataLayerService: CkiDataLayerService;
    let digitalDataService: CkiDigitalDataService;
    let storage: Record<string, unknown>;
    let localStorageService: { get: jasmine.Spy; set: jasmine.Spy };
    let browserWindow: DataLayerWindow;
    const constants = {
        EVENTS_ECOMMERCE: {
            BEGIN_CHECKOUT: 'begin_checkout',
            ADD_SHIPPING_INFO: 'add_shipping_info'
        },
        DATALAYER_FLOW_CKI: {
            PROCESS: 'checkin',
            PROCESS_DUPLICATE: 'duplicate',
            PROCESS_DESINVOICING: 'deinvoicing',
            IBCOSE: 'landing'
        },
        DIGITAL_DATA_STEP: { IBCOSE: 'search' },
        DATALAYER_INFO: { PROCESS: 'process', STEP: 'step', QUADRIGAM: 'quadrigam' },
        DIGITAL_DATA_INFO: { PROCESS: 'Process', STEP: 'Step', QUADRIGAM: 'Quadrigam' }
    };
    beforeEach(() => {
        storage = {};
        localStorageService = {
            get: jasmine.createSpy('get').and.callFake((key: string) => storage[key] ?? null),
            set: jasmine.createSpy('set').and.callFake((key: string, value: unknown) => {
                storage[key] = value;
            })
        };
        browserWindow = window as DataLayerWindow;
        browserWindow.dataLayer = [];
        browserWindow.datalayer_general = {};
        browserWindow.datalayer_ecommerce = {};
        browserWindow.digital_data = {};

        angular.mock.module('ib-datalayer-cki-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('CkiDatalayerConstants', constants);
            $provide.value('CheckinAppConstants', {
                QUADRIGAM: { UN_RECOVERY: 'UN_RECOVERY', UN_SEARCH: 'UN_SEARCH', UN_CONFIRM: 'UN_CONFIRM' }
            });
            $provide.value('localStorageService', localStorageService);
        });

        angular.mock.inject((
            _CkiDataLayerService_: CkiDataLayerService,
            _CkiDigitalDataService_: CkiDigitalDataService
        ) => {
            dataLayerService = _CkiDataLayerService_;
            digitalDataService = _CkiDigitalDataService_;
        });
    });

    it('initializes, extends, resets, and removes general/ecommerce data', () => {
        dataLayerService.initDatalayer({ language: 'es' }, { items: [] });

        expect(dataLayerService.isDatalayerInit()).toBe(true);
        expect(dataLayerService.getDatalayerGeneral()).toEqual({ language: 'es' });
        expect(dataLayerService.getEcommerceDatalayer()).toEqual({ items: [] });

        dataLayerService.addDataLayerGeneralInfo({ process: 'checkin', removable: 'yes' });
        dataLayerService.addDataLayerEcommerceInfo({ currency: 'EUR' });
        expect(localStorageService.set).toHaveBeenCalledWith(
            'confirmationDatalayerInfo',
            jasmine.objectContaining({ removable: 'yes' })
        );
        expect(dataLayerService.getEcommerceDatalayer()).toEqual({ items: [], currency: 'EUR' });

        dataLayerService.removeDatalayerGeneralInfo(['removable', 7]);
        expect(dataLayerService.getDatalayerGeneral()).not.toEqual(jasmine.objectContaining({ removable: 'yes' }));
        dataLayerService.resetDatalayer({ reset: true });
        expect(dataLayerService.getDatalayerGeneral()).toEqual({ reset: true });
        dataLayerService.removeAllDatalayerInfo();
        expect(dataLayerService.getDatalayerGeneral()).toEqual({});
        expect(dataLayerService.getEcommerceDatalayer()).toEqual({});
    });

    it('sets check-in process metadata and emits the corresponding ecommerce events', () => {
        dataLayerService.initDatalayer({}, {});
        digitalDataService.initDigitalData({});
        storage.isFlowDuplicated = true;

        dataLayerService.setProcessAndStep('IBCOSE');

        expect(dataLayerService.getDatalayerGeneral()).toEqual(jasmine.objectContaining({
            proceso: 'checkin duplicados',
            paso: 'landing',
            quadrigam: 'IBCOSE'
        }));
        expect(digitalDataService.getDigitalData()).toEqual(jasmine.objectContaining({
            Process: 'checkin duplicados',
            Step: 'landing',
            Quadrigam: 'IBCOSE'
        }));

        dataLayerService.digitalDataEcommerceEventAPIS();
        expect(browserWindow.dataLayer).toEqual([
            { ecommerce: { items: [] } },
            { event: 'begin_checkout' },
            { ecommerce: { items: [] } },
            { event: 'add_shipping_info' }
        ]);
        expect(digitalDataService.getDigitalDataEcommerce()).toBeNull();
    });

    it('initializes digital data from storage and accumulates matching cart quantities', () => {
        digitalDataService.initDigitalData({ language: 'es' });
        digitalDataService.setAddInfoAddToCart({
            items: [{ item_id: 'seat-1', price: 20, quantity: 1 }]
        } as DigitalDataEcommerceModel.ViewItemList);
        digitalDataService.setAddInfoAddToCart({
            items: [{ item_id: 'seat-1', price: 20, quantity: 2 }]
        } as DigitalDataEcommerceModel.ViewItemList);

        expect(digitalDataService.getDigitalData()).toEqual({ language: 'es' });
        expect(storage.addToCart).toEqual({
            ecommerce: { items: [{ item_id: 'seat-1', price: 20, quantity: 3 }] }
        });
    });

    it('decrements and removes cart quantities, and emits data layer events', () => {
        digitalDataService.initDigitalData({});
        digitalDataService.setAddInfoAddToCart({
            items: [{ item_id: 'bag-1', price: 30, quantity: 3 }]
        } as DigitalDataEcommerceModel.ViewItemList);
        digitalDataService.setRemoveInfoAddToCart({
            items: [{ item_id: 'bag-1', price: 30, quantity: 1 }]
        } as DigitalDataEcommerceModel.ViewItemList);
        expect((storage.addToCart as { ecommerce: { items: Array<{ quantity: number }> } }).ecommerce.items[0].quantity).toBe(2);

        digitalDataService.setRemoveInfoAddToCart({
            items: [{ item_id: 'bag-1', price: 30, quantity: 2 }]
        } as DigitalDataEcommerceModel.ViewItemList);
        expect((storage.addToCart as { ecommerce: { items: unknown[] } }).ecommerce.items).toEqual([]);

        const eventData = { eventData: true };
        digitalDataService.emitEvent('select_item', eventData);
        digitalDataService.emitViewEvent();
        expect(browserWindow.dataLayer).toContain(eventData);
        expect(browserWindow.dataLayer).toContain(jasmine.objectContaining({ event: 'select_item' }));
        expect(browserWindow.dataLayer).toContain(jasmine.objectContaining({ event: 'view' }));
    });
});
