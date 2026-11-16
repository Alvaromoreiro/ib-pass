import { TestBed } from '@angular/core/testing';
import { IbBookingHeaderSeekerModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-seeker/services/ib-booking-header-seeker-model.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { LocalDiscountConfigModel, SeekerAdvancedSearchModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';

class MockCommonsSessionStorageService {
    get = jasmine.createSpy('get').and.returnValue({
        resident: '1',
        largeFamilyType: '2',
    });
}

// @ts-ignore
interface TestService extends IbBookingHeaderSeekerModelService {
    updateDiscountsData: (model: SeekerAdvancedSearchModel, residentConfig: LocalDiscountConfigModel, largeFamily: LocalDiscountConfigModel) => SeekerAdvancedSearchModel;
}

describe('IbBookingHeaderSeekerModelService', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingHeaderSeekerModelService,
                { provide: CommonsSessionStorageService, useClass: MockCommonsSessionStorageService },
            ],
        });

        service = TestBed.inject(IbBookingHeaderSeekerModelService) as any;
    });

    it('should initialize the model with default values', () => {
        const model = service.initializeModel();
        expect(model.showDatepicker).toBeFalse();
        expect(model.tripOptions.length).toBe(3);
        expect(model.passengersSelected).toEqual([]);
        expect(model.selectedOutbondDate).toBeInstanceOf(Date);
        expect(model.selectedReturnDate).toBeInstanceOf(Date);
    });

    it('should update discounts data correctly', () => {
        const mockResidentConfig = {
            items: [{ value: '1', description: 'Resident Discount' }],
        } as LocalDiscountConfigModel;

        const mockFamilyConfig = {
            items: [{ value: '2', description: 'Family Discount' }],
        } as LocalDiscountConfigModel;

        const model = service.initializeModel(mockResidentConfig, mockFamilyConfig);
       

        expect(model.discountResident).toEqual(mockResidentConfig.items[0]);
        expect(model.discountFamily).toEqual(mockFamilyConfig.items[0]);
    });

    it('should handle missing URL parameters gracefully in updateDiscountsData', () => {
        const mockResidentConfig = {
            items: [{ value: '1', description: 'Resident Discount' }],
        } as LocalDiscountConfigModel;

        const mockFamilyConfig = {
            items: [{ value: '2', description: 'Family Discount' }],
        } as LocalDiscountConfigModel;

        (service as any).CommonsSessionStorageService.get.and.returnValue(null);

        const model = service.initializeModel();
        const updatedModel = service.updateDiscountsData(model, mockResidentConfig, mockFamilyConfig);

        expect(updatedModel.discountResident).toEqual(mockResidentConfig.items[0]);
        expect(updatedModel.discountFamily).toEqual(mockFamilyConfig.items[0]);
    });
});
