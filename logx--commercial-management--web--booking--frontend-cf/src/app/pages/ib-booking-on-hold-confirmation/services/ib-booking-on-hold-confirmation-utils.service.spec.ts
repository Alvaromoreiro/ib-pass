import { bookingInfoMultiMock, bookingInfoOWMock, digitalDataMock, digitalDataMultiMock, digitalDataOWMock, generalInfoMock, generalInfoMultiMock, generalInfoOWMock, mockAddToCartMulti, mockAddToCartOW, mockAddToCartRT, modelMock, onHoldInfoMock } from '@test/mocks/unit/app/pages/ib-booking-on-hold-confirmation/services/on-hold-booking-info-mock';
import { TestBed } from '@angular/core/testing';
import { IbOnHoldConfirmationUtilsService } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation-utils.service';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { IbIntlDateFormatPipe } from 'ib-web-commons/pipes';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

let fakeDatalayerUtilsService, fakeDatalayerBKIService, fakeDigitalDataService, fakeIbIntlDateFormatPipe;
class DatalayerUtilsServiceMock{
    getCodeFromCashAviosUsed = jasmine.createSpy('getCodeFromCashAviosUsed').and.returnValue('no');
}
class DatalayerBKIServiceMock{
    getBrand = jasmine.createSpy('getBrand').and.returnValue('iberia');
}
class DigitalDataServiceMock{
    setAddInfoAddToCart = jasmine.createSpy('setAddInfoAddToCart');
    addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo');
    removeDigitalDataInfo = jasmine.createSpy('removeDigitalDataInfo');
}
class IbIntlDateFormatPipeMock{
    transform = jasmine.createSpy('transform').and.returnValue('10/10/2070');
}

describe('IbOnHoldConfirmationUtilsService', () => {
    let service: IbOnHoldConfirmationUtilsService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    fakeDatalayerUtilsService = new DatalayerUtilsServiceMock();
    fakeDatalayerBKIService = new DatalayerBKIServiceMock();
    fakeDigitalDataService = new DigitalDataServiceMock();
    fakeIbIntlDateFormatPipe = new IbIntlDateFormatPipeMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[
                IbOnHoldConfirmationUtilsService,
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: AJSDatalayerBKIService, useValue: fakeDatalayerBKIService },
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService },
                { provide: DigitalDataService, useValue: fakeDigitalDataService },
                { provide: IbIntlDateFormatPipe, useValue: fakeIbIntlDateFormatPipe }
            ]
        });
        service = TestBed.inject(IbOnHoldConfirmationUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('When createAddToCartforPurchaseEvent is called', () => {
        beforeEach(()=>{
            fakeDigitalDataService.setAddInfoAddToCart.calls.reset();
        });
        it('should create round trip addToCart object in dataLayer', ()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', onHoldInfoMock);
            service.createAddToCartforPurchaseEvent(generalInfoMock);
            expect(fakeDigitalDataService.setAddInfoAddToCart).toHaveBeenCalledWith(mockAddToCartRT);
        });
        it('should create one way addToCart object in dataLayer', ()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', bookingInfoOWMock);
            service.createAddToCartforPurchaseEvent(generalInfoOWMock as any);
            expect(fakeDigitalDataService.setAddInfoAddToCart).toHaveBeenCalledWith(mockAddToCartOW);
        });
        it('should create multitrip addToCart object in dataLayer', ()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', bookingInfoMultiMock);
            service.createAddToCartforPurchaseEvent(generalInfoMultiMock as any);
            expect(fakeDigitalDataService.setAddInfoAddToCart).toHaveBeenCalledWith(mockAddToCartMulti);
        });
    });
    describe('When generateOnHoldConfirmationDigitalData is called', () => {
        beforeEach(()=>{
            fakeCommonsSessionStorageService.set('fareFamilyConditionsInfo', [{commercialCode:'BUSOPTMH', commercialNameES:'Business Optima'}, {commercialCode:'YR2PA', commercialNameES:'Turista Flexible'}]);
            fakeCommonsSessionStorageService.set('CalculatedPoints', {Avios:'10'});
            fakeCommonsSessionStorageService.remove('confirmationDigitalInfo');
            fakeCommonsSessionStorageService.remove('paymentsInfo');
            fakeCommonsSessionStorageService.remove('specialMealsCopy');
            fakeDigitalDataService.addDigitalDataInfo.calls.reset();
        });
        it('should generate digital_data object', ()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', onHoldInfoMock);
            service.generateOnHoldConfirmationDigitalData(modelMock as any);
            expect(fakeDigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith(digitalDataMock);
        });
        it('should generate one way digital_data object', ()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', bookingInfoOWMock);
            service.generateOnHoldConfirmationDigitalData({...modelMock, generalInfo:generalInfoOWMock} as any);
            digitalDataOWMock.AdvancePurchase = (Math.round((new Date('2070-06-15 11:25').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString();
            expect(fakeDigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith(digitalDataOWMock);
        });
        it('should generate multicity flight digital_data object', ()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', bookingInfoMultiMock);
            service.generateOnHoldConfirmationDigitalData({...modelMock, generalInfo:generalInfoMultiMock} as any);
            expect(fakeDigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith(digitalDataMultiMock);
        });
        it('should generate AviosEarned digital_data object as null ', ()=>{
            fakeCommonsSessionStorageService.remove('CalculatedPoints');
            fakeCommonsSessionStorageService.set('confirmationDigitalInfo', {Slice1Flights:'IB0404-IB0403', Slice1Operator:'IB-IB'});
            fakeCommonsSessionStorageService.set('bookingInfo', onHoldInfoMock);
            service.generateOnHoldConfirmationDigitalData(modelMock as any);
            expect(fakeCommonsSessionStorageService.get<any>('confirmationDigitalInfo').AviosEarned).toEqual(null);
        });
        it('should generate VoucherUsed digital_data object as yes ', ()=>{
            fakeCommonsSessionStorageService.set('confirmationDigitalInfo', {Slice1Flights:'IB0404-IB0403', Slice1Operator:'IB-IB'});
            fakeCommonsSessionStorageService.set('paymentsInfo', {appliedDiscounts:{types:{VOUCHER:{price:10}}}});
            fakeCommonsSessionStorageService.set('bookingInfo', onHoldInfoMock);
            service.generateOnHoldConfirmationDigitalData(modelMock as any);
            expect(fakeCommonsSessionStorageService.get<any>('confirmationDigitalInfo').VoucherUsed).toEqual('si');
        });
        it('should generate SpecialMeal digital_data object as true ', ()=>{
            fakeCommonsSessionStorageService.set('specialMealsCopy', [{object:'object'}]);
            fakeCommonsSessionStorageService.set('bookingInfo', onHoldInfoMock);
            service.generateOnHoldConfirmationDigitalData(modelMock as any);
            expect(fakeCommonsSessionStorageService.get<any>('confirmationDigitalInfo').SpecialMeal).toBeTrue();
        });
    });
    describe('When isMultiCityTrip is called', () => {
        it('should return false for a single slice', () => {
            const slicesMock = [{ segments: [{ departure: { city: { code: 'MAD' } }, arrival: { city: { code: 'BCN' } } }] }];
            const result = service.isMultiCityTrip(slicesMock as any);
            expect(result).toBeFalse();
        });

        it('should return true for three or more slices', () => {
            const slicesMock = [
                { segments: [{ departure: { city: { code: 'MAD' } }, arrival: { city: { code: 'BCN' } } }] },
                { segments: [{ departure: { city: { code: 'BCN' } }, arrival: { city: { code: 'LHR' } } }] },
                { segments: [{ departure: { city: { code: 'LHR' } }, arrival: { city: { code: 'MAD' } } }] }
            ];
            const result = service.isMultiCityTrip(slicesMock as any);
            expect(result).toBeTrue();
        });

        it('should return true for two slices with different departure cities', () => {
            const slicesMock = [
                { segments: [{ departure: { city: { code: 'MAD' } }, arrival: { city: { code: 'BCN' } } }] },
                { segments: [{ departure: { city: { code: 'BCN' } }, arrival: { city: { code: 'LHR' } } }] }
            ];
            const result = service.isMultiCityTrip(slicesMock as any);
            expect(result).toBeTrue();
        });

        it('should return false for two slices with the same departure city', () => {
            const slicesMock = [
                { segments: [{ departure: { city: { code: 'MAD' } }, arrival: { city: { code: 'BCN' } } }] },
                { segments: [{ departure: { city: { code: 'MAD' } }, arrival: { city: { code: 'LHR' } } }] }
            ];
            const result = service.isMultiCityTrip(slicesMock as any);
            expect(result).toBeTrue();
        });
    });
});
