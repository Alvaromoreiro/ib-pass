import { TestBed } from "@angular/core/testing";
import { MmBDataLayerService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-service";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";

describe('MmBDataLayerService test ', () => {
    let localStorageService: any = new StorageServiceMock();
    let transformer;

    let $window: any = {
        location: {
            href: 'href',
            origin: 'orig',
            pathname: '/path',
            search: '?search',
            reload: jasmine.createSpy('reload').and.callFake(() => { })
        },
        DigitalChange: jasmine.createSpy()
    };

    let fakeMmBDigitalDataService: any = {
        isDigitalDataInit: jasmine.createSpy(),
        initDigitalData: jasmine.createSpy(),
        addDigitalDataInfo: jasmine.createSpy(),
        removeDigitalDataInfo: jasmine.createSpy(),
        emitEvent: jasmine.createSpy(),
        emitViewEvent: jasmine.createSpy(),
        addDigitalDataEcommerceEvent: jasmine.createSpy(),
    };

    let fakeDatalayerUtilsService = {
        'getItemCategory3': jasmine.createSpy()
    };

    let fakeCommonsSessionStorageService = {
        get: jasmine.createSpy(),
    };

    let fakeMmBAppConstants = {
        ECOMMERCE: {
            FLIGHT: 'flight',
            DIRECT_PURCHASE: 'compra directa',
            MULTIPLE_JOURNEYS: 'multiples trayectos',
            METASEARCH: 'metabuscador',
            STOPOVER_HMAD: 'hola madrid'
        },
        SEARCH_FLIGHT_TYPE: {
            METASEARCH: 'metasearchFlight',
        },
    };

    let fakeFlightSelectedInfo = {
        cabins: [{
            fareFamilies: [{
                price: 50,
                originalData: {
                    cabinDescription : 'test',
                    commercialCode : 'TE',
                    commercialNameES: 'test'
                }
            }],
            info: {
                selectedFareFamily: {
                    cabinDescription: 'test',
                    commercialCode: 'TE'
                },
                cabinFullName: 'test'
            },
            priceNumber: 50
        }],
        info: {
            type: 'OTHER'
        },
        segments: [{
            opered: 'test'
        }]
    }

    beforeEach(async ()=>{
        TestBed.configureTestingModule({
            declarations: [MmBDataLayerService],
        });
        transformer = new MmBDataLayerService(
            $window,
            localStorageService,
            fakeMmBDigitalDataService,
            fakeDatalayerUtilsService,
            fakeCommonsSessionStorageService,
            fakeMmBAppConstants
        );
        localStorageService.set('cvDatalayer', {numeroPax: '2'})
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and initDatalayer', () => {
        it(' have been called', (done) => {
            const obj = {test: 'test'};
            transformer.initDatalayer(obj, obj);
            expect(transformer.datalayer_general).toEqual(obj);
            expect(transformer.datalayer_ecommerce).toEqual(obj);
            done();
        });
    });

    describe('and isDatalayerInit', () => {
        it(' have been called', (done) => {
            transformer.datalayer_general = {};
            transformer.datalayer_ecommerce = {};
            const result = transformer.isDatalayerInit();
            expect(result).toBeTrue();
            done();
        });
    });

    describe('and addDataLayerGeneralInfo', () => {
        it(' have been called', (done) => {
            const obj = {test: 'test'}
            transformer.datalayer_general = {};
            transformer.addDataLayerGeneralInfo(obj);
            expect(transformer.datalayer_general).toEqual(obj);
            done();
        });
    });

    describe('and addDataLayerEcommerceInfo', () => {
        it(' have been called', (done) => {
            const obj = {test: 'test'}
            transformer.datalayer_ecommerce = {};
            transformer.addDataLayerEcommerceInfo(obj);
            expect(transformer.datalayer_ecommerce).toEqual(obj);
            done();
        });
    });

    describe('and removeDatalayerGeneralInfo', () => {
        it(' have been called', (done) => {
            transformer.datalayer_general = {test: 'test'};
            transformer.removeDatalayerGeneralInfo(['test']);
            expect(transformer.datalayer_general).toEqual({});
            done();
        });
    });

    describe('and removeAllDatalayerInfo', () => {
        it(' have been called', (done) => {
            transformer.removeAllDatalayerInfo();
            expect(transformer.datalayer_general).toEqual({});
            expect(transformer.datalayer_ecommerce).toEqual({});
            done();
        });
    });

    describe('and callUpdateTagManager', () => {
        it(' have been called and datalayer_ecommerce empty', (done) => {
            transformer.datalayer_ecommerce = {};
            transformer.callUpdateTagManager();
            done();
        });

        it(' have been called and datalayer_ecommerce not empty', (done) => {
            transformer.datalayer_ecommerce = {test:'test'};
            transformer.callUpdateTagManager();
            done();
        });
    });

    describe('and getDatalayerGeneral', () => {
        it(' have been called', (done) => {
            transformer.datalayer_general = {};
            const result = transformer.getDatalayerGeneral();
            expect(result).toEqual({});
            done();
        });
    });

    describe('and getEcommerceDatalayer', () => {
        it(' have been called', (done) => {
            transformer.datalayer_ecommerce = {};
            const result = transformer.getEcommerceDatalayer();
            expect(result).toEqual({});
            done();
        });
    });

    describe('and getDigitalDataEcommerce and direct purchase', () => {
        it('and type SHUTTLE ', (done) => {
            localStorageService.set('searchFlightType', '');
            localStorageService.set('isHMAD', false);
            localStorageService.set('multiCitySearch', false);
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo}
            copyfakeFlightSelectedInfo.info.type = 'SHUTTLE';
            transformer.datalayer_ecommerce = {};
            transformer.getDigitalDataEcommerce(copyfakeFlightSelectedInfo, 0, '');

            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type SHUTTLE and isMetasearch ', (done) => {
            localStorageService.set('searchFlightType', 'metasearchFlight');
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo}
            copyfakeFlightSelectedInfo.info.type = 'SHUTTLE';
            transformer.datalayer_ecommerce = {};
            transformer.getDigitalDataEcommerce(copyfakeFlightSelectedInfo, 0, '');

            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type SHUTTLE and isMultipleTrip and event other ', (done) => {
            localStorageService.set('isHMAD', false);
            localStorageService.set('searchFlightType', '');
            localStorageService.set('multiCitySearch', true);
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo}
            copyfakeFlightSelectedInfo.info.type = 'SHUTTLE';
            transformer.datalayer_ecommerce = {};
            transformer.getDigitalDataEcommerce(copyfakeFlightSelectedInfo, 0, 'other');

            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type SHUTTLE with payWithAvios and isHMAD ', (done) => {
            localStorageService.set('bookingUrlParams', {payWithAvios: true});
            localStorageService.set('searchFlightType', '');
            localStorageService.set('isHMAD', true);
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo}
            copyfakeFlightSelectedInfo.info.type = 'SHUTTLE';
            transformer.datalayer_ecommerce = {};
            transformer.getDigitalDataEcommerce(copyfakeFlightSelectedInfo, 0, 'ADD_TO_CART');
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });

        it('and type is NOT SHUTTLE and event VIEW_ITEM_LIST', (done) => {
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo};
            copyfakeFlightSelectedInfo.info.type = 'OTHER';
            transformer.datalayer_ecommerce = {};
            transformer.getDigitalDataEcommerce(copyfakeFlightSelectedInfo, 0, 'VIEW_ITEM_LIST');
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type is NOT SHUTTLE and event other', (done) => {
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo};
            copyfakeFlightSelectedInfo.info.type = 'OTHER';
            transformer.datalayer_ecommerce = {};
            transformer.getDigitalDataEcommerce(copyfakeFlightSelectedInfo, 0, 'OTHER');
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('and createSelectItemEvent', () => {
        it(' have been called', (done) => {
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo};
            transformer.datalayer_ecommerce = {};
            transformer.createSelectItemEvent(copyfakeFlightSelectedInfo, 0, 0);
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('and createAddToCartItemEvent', () => {
        it('and originDestinationMulticity', (done) => {
            localStorageService.set('originDestinationMulticity', [{originCity: {code: 'MAD'}, destinationCity: {code: 'BIO'}}, {originCity: {code: 'BIO'}, destinationCity: {code: 'MAD'}}]);
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo};
            transformer.datalayer_ecommerce = {};
            transformer.createAddToCartItemEvent(copyfakeFlightSelectedInfo, 0, 0);
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and availabilityRequestData', (done) => {
            localStorageService.set('originDestinationMulticity', false);
            localStorageService.set('availabilityRequestData', {slices: [{origin: 'Madrid', destination: 'Bilbao'}, {origin: 'Bilbao', destination: 'Madrid'}]});
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo};
            transformer.datalayer_ecommerce = {};
            transformer.createAddToCartItemEvent(copyfakeFlightSelectedInfo, 0, 0);
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });

        it('and flightsInfo', (done) => {
            localStorageService.set('originDestinationMulticity', false);
            localStorageService.set('availabilityRequestData', false);
            localStorageService.set('flightsInfo', [{departure: {city: {code: 'MAD'}}, arrival: {city: {code: 'BIO'}}}, {departure: {city: {code: 'BIO'}}, arrival: {city: {code: 'MAD'}}}]);
            spyOn(fakeMmBDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeFlightSelectedInfo = {...fakeFlightSelectedInfo};
            transformer.datalayer_ecommerce = {};
            transformer.createAddToCartItemEvent(copyfakeFlightSelectedInfo, 0, 0);
            expect(fakeMmBDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });

        it('and getBrand', (done) => {
            let result = transformer.getBrand([{flight: {operationalCarrier: {name: 'test'}}},{flight: {operationalCarrier: {name: 'testdos'}}}]);
            expect(result).toEqual('test-testdos');
            done();
        });

    });

});
