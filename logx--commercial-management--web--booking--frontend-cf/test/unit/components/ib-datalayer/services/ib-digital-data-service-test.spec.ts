import { DigitalDataService } from '../../../../../src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
describe('Test DigitalDataService', () => {

    //Define variables
    let service: DigitalDataService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let fakeWindow = {
        digital_data: {},
        dataLayer: [],
         location: {
            hash: '#!/hash',
        },
        DigitalChange: (type, datalayer, ecommerce) => {}
    };

     beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
            ]
        });
        service = TestBed.inject(DigitalDataService);
        fakeCommonsSessionStorageService.clear();
        fakeWindow.location.hash = '#!/hash';
        fakeCommonsSessionStorageService.set('actualStepFlow', 'hash');
    });
    describe('Call initDigitalData', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.remove('confirmationDigitalInfo');
            fakeWindow.digital_data = {}
            fakeWindow.location.hash = '#!/hash';
            fakeCommonsSessionStorageService.set('actualStepFlow', 'hash');
        });
        it('and there is no data stored', () => {
            const datalayerTest = {test:'test'}
            service.initDigitalData(datalayerTest);
            expect(fakeWindow.digital_data).toEqual(datalayerTest);
        });
        it('and after a reload with data stored', () => {
            fakeCommonsSessionStorageService.set('confirmationDigitalInfo', { testB: 'test'});
            const datalayerTest = { test: 'test' }
            fakeWindow.digital_data = null;
            const result = Object.assign(JSON.parse(JSON.stringify(datalayerTest)), fakeCommonsSessionStorageService.get('confirmationDigitalInfo'));
            service.initDigitalData(datalayerTest);
            expect(fakeWindow.digital_data).toEqual(result);
        });
    });
    describe('Call isDigitalDataInit', () => {
        beforeEach(() => {
            service["digital_data"] = {};
        });
        it('and test if digital_data is an object', () => {
            let returnData = service.isDigitalDataInit();
            expect(service["digital_data"]).toBeDefined();
            expect(returnData).toBeTruthy();
        });
    });
    describe('Call addDigitalDataInfo', () => {
        beforeEach(() => {
            service["digital_data"] = {};
            fakeWindow.digital_data = service["digital_data"]
        });
        it('and add an object of params in digital_data', () => {
            service.addDigitalDataInfo({Language: 'es'});
            expect(fakeCommonsSessionStorageService.get('confirmationDigitalInfo')).toEqual({Language: 'es'});
        });
        it('and add an object of params in digital_data with different data reference', () => {
            service["digital_data"] = ({Market: 'es'})
            service.addDigitalDataInfo({Language: 'es'});
            expect(fakeCommonsSessionStorageService.get('confirmationDigitalInfo')).toEqual({Market: 'es', Language: 'es'});
        });
    });
    describe('Call addDigitalDataEcommerceInfo', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('confirmationDigitalInfo',{ecommerce:{}})
            spyOn(service, 'addDigitalDataInfo')
        });
        it('and add an ecommerce object of params in digital_data', () => {
            service.addDigitalDataEcommerceInfo({items:{amount:0}});
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({ecommerce:{items: {amount:0}}});
        });
    });
    describe('Call addDigitalDataEcommerceEvent', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('confirmationDigitalInfo',{ecommerce:{}})
            fakeWindow.dataLayer = []
        });
        it('and add an ecommerce object of params in digital_data', () => {
            service.addDigitalDataEcommerceEvent({},'view');
            expect(fakeWindow.dataLayer).toEqual([{ ecommerce:{}},{event:'view'}]);
        });
    });
    describe('Call setAddInfoAddToCart', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('addToCart',{ecommerce:{items:[{quantity:1,item_name:'test', item_id:'tfds', price:5, item_brand:'IB'}]}})
        });
        it('and add addToCart info to dataLayer', () => {
            service.setAddInfoAddToCart({items:[{quantity:1,item_name:'test', item_id:'tfds', price:5, item_brand:'IB',item_category:'test', item_category2:'test', item_category3:'test', item_variant:'testVariant'}]});
            expect(fakeCommonsSessionStorageService.get('addToCart')).toEqual({ecommerce: { items: [{ quantity: 1, item_name: 'test', item_id: 'tfds', price: 5, item_brand: 'IB' },{ quantity: 1, item_name: 'test', item_id: 'tfds', price: 5, item_brand: 'IB', item_category: 'test', item_category2: 'test', item_category3: 'test', item_variant: 'testVariant' }]}});
        });
    });
    describe('Call setRemoveInfoAddToCart', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('addToCart',{ecommerce:{items:[{quantity:1,item_name:'test', item_id:'tfds', price:5, item_brand:'IB'}]}})
        });
        it('and remove addToCart info in dataLayer', () => {
            service.setRemoveInfoAddToCart({items:[{quantity:1,item_name:'test', item_id:'tfds', price:5, item_brand:'IB',item_category:'test', item_category2:'test', item_category3:'test', item_variant:'testVariant'}]});
            expect(fakeCommonsSessionStorageService.get('addToCart')).toEqual({ecommerce:{items:[{ quantity: 1, item_name: 'test', item_id: 'tfds', price: 5, item_brand: 'IB' }]}});
        });
    });
    describe('Call removeDigitalDataInfo', () => {
        beforeEach(() => {
            service["digital_data"] = {Language: 'es', paramError:'paramError', Market:'ES'}
        });
        it('and remove digital_data info in digital_data', () => {
            service.removeDigitalDataInfo(['paramError','Language']);
            expect(service["digital_data"]).toEqual({Market:'ES'});
        });
    });
    describe('Call removeAllDigitalDataInfo', () => {
        beforeEach(() => {
            service["digital_data"] = [{Language: 'es'}, {paramError:'error'}, {Market:'ES'}]
        });
        it('and remove the whole digital_data info', () => {
            service.removeAllDigitalDataInfo();
            expect(service["digital_data"]).toEqual({});
        });
    });
    describe('Call getDigitalData', () => {
        beforeEach(() => {
            service["digital_data"] = {Language: 'es',Market:'ES'}
        });
        it('and get digital_data object', () => {
            service.getDigitalData();
            expect(service["digital_data"]).toEqual({Language: 'es',Market:'ES'});
        });
    });
    describe('Call getDigitalDataEcommerce', () => {
        beforeEach(() => {
            service["digital_data"] = {ecommerce:{items:{quantity:0}}}
        });
        it('and get digital_data ecommerce object', () => {
            let returnValue = service.getDigitalDataEcommerce();
            expect(returnValue).toEqual({items:{quantity:0}});
        });
    });
    describe('Call emitEvent', () => {
        beforeEach(() => {
            fakeWindow.dataLayer = []
        });
        it('and it will emit a personalized event to dataLayer object', () => {
            service.emitEvent('interaction', {});
            expect(fakeWindow.dataLayer).toEqual([{},{event:'interaction'}]);
        });
    });
    describe('Call emitViewEvent', () => {
        beforeEach(() => {
            fakeWindow.dataLayer = [];
            service["digital_data"] = {};
        });
        it('and it will emit a view event to dataLayer object', () => {
            service.emitViewEvent();
            expect(fakeWindow.dataLayer).toEqual([{},{event:'view'}]);
        });
    });
    describe('Call emitInteractionEvent', () => {
        beforeEach(() => {
            fakeWindow.dataLayer = [];
            service["digital_data"] = {};
        });
        it('and it will emit a interaction event to dataLayer object', () => {
            let returnValue = service.emitInteractionEvent();
            expect(fakeWindow.dataLayer).toEqual([{},{event:'interaction'}]);
        });
    });

});
