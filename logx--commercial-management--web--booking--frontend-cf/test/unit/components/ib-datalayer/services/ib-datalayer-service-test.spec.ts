import { DataLayerService } from '../../../../../src/app/shared/services/ib-datalayer/services/ib-datalayer.service';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { TestBed } from '@angular/core/testing';
describe('Test DataLayerService', () => {

    //Define variables
    let service: DataLayerService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let rootScope;
    let fakeWindow = {
        datalayer_general: {},
        datalayer_ecommerce: {},
        location: {
            hash: '#!/hash',
        },
        DigitalChange: (type, datalayer, ecommerce) => {}
    };

    beforeEach(() => {
        fakeCommonsSessionStorageService.clear();
        fakeCommonsSessionStorageService.set('actualStepFlow', 'hash')
        location.hash = '#!/hash';
        TestBed.configureTestingModule({
            providers: [
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
            ]
        });
        service = TestBed.inject(DataLayerService);

    });
    describe('Call initDatalayer', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.remove('confirmationDatalayerInfo');
            fakeWindow.datalayer_general = {}
            fakeWindow.location.hash = '#!/hash';
            fakeCommonsSessionStorageService.set('actualStepFlow', 'hash');
        });
        it('and there is no data stored', () => {
            const datalayerTest = {test:'test'}
            service.initDatalayer(datalayerTest);
            expect(fakeWindow.datalayer_general).toEqual(datalayerTest);
        });
        it('and after a reload with data stored', () => {
            fakeCommonsSessionStorageService.set('confirmationDatalayerInfo', { testB: 'test'});
            const datalayerTest = { test: 'test' }
            fakeWindow.datalayer_general = null;
            const result = Object.assign(JSON.parse(JSON.stringify(datalayerTest)), fakeCommonsSessionStorageService.get('confirmationDatalayerInfo'));
            service.initDatalayer(datalayerTest);
            expect(fakeWindow.datalayer_general).toEqual(result);
        });
    });
    describe('Call isDatalayerInit', () => {
        beforeEach(() => {
            service.datalayer_general = {market: 'ES'};
            service.datalayer_ecommerce = {};
        });
        it('and return true if datalayers are initialized', () => {
            let returnData = service.isDatalayerInit();
            expect(returnData).toBeTruthy();
        });
    });
    describe('Call addDataLayerGeneralInfo', () => {
        beforeEach(() => {
            service.datalayer_general = {market: 'ES'};
            service.datalayer_ecommerce = {};
        });
        it('and set new datalayer_general attribute', () => {
            service.addDataLayerGeneralInfo({language:'es'});
            expect(fakeCommonsSessionStorageService.get('confirmationDatalayerInfo')).toEqual({market: 'ES', language: 'es'});
        });
    });
    describe('Call addDataLayerEcommerceInfo', () => {
        beforeEach(() => {
            service.datalayer_general = {market: 'ES'};
            service.datalayer_ecommerce = {};
        });
        it('and set new datalayer_general attribute', () => {
            service.addDataLayerEcommerceInfo({items:{}});
            expect(service.datalayer_ecommerce).toEqual({items:{}});
        });
    });
    describe('Call removeAllDatalayerInfo', () => {
        beforeEach(() => {
            service.datalayer_general = {market: 'ES'};
            service.datalayer_ecommerce = {items: {}};
        });
        it('and it will remove every datalayer info', () => {
            service.removeAllDatalayerInfo();
            expect(service.datalayer_general).toEqual({});
            expect(service.datalayer_ecommerce).toEqual({});
        });
    });
    describe('Call getDatalayerGeneral', () => {
        beforeEach(() => {
            service.datalayer_general = {market: 'ES'};
        });
        it('and it will return datalayer_general info', () => {
            let returnData = service.getDatalayerGeneral();
            expect(returnData).toEqual({market: 'ES'});
        });
    });
    describe('Call getEcommerceDatalayer', () => {
        beforeEach(() => {
            service.datalayer_ecommerce = {items: {}};
        });
        it('and it will return datalayer_ecommerce info', () => {
            let returnData = service.getEcommerceDatalayer();
            expect(returnData).toEqual({items: {}});
        });
    });
    describe('Call callUpdateTagManager', () => {
        beforeEach(() => {
            service.datalayer_ecommerce = {items: {}};
        });
        it('and it will return datalayer_ecommerce info', () => {
            service.callUpdateTagManager('view');
            expect(fakeCommonsSessionStorageService.get('sendDatalayerEcommerce')).toBeFalsy();
        });
    });
    describe('Call removeDatalayerGeneralInfo', () => {
        beforeEach(() => {
            service.datalayer_general = {market: 'ES', language: 'es', process: 'booking'};
        });
        it('and it will return datalayer_ecommerce info', () => {
            service.removeDatalayerGeneralInfo(['market']);
            expect(service.datalayer_general).toEqual({language: 'es', process: 'booking'});
        });
    });

});
