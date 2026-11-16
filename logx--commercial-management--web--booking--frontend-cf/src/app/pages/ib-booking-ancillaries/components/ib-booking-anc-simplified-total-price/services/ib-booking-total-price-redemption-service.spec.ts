import { TestBed } from '@angular/core/testing';
import { BookingTotalPriceRedemptionService, RedemptionTotalPriceModel } from '@pages/ib-booking-ancillaries/components/ib-booking-anc-simplified-total-price/services/ib-booking-total-price-redemption.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { FareRedemptionDataModel } from '@core/models/generic-models/fare-models';

describe('BookingTotalPriceRedemptionService', () => {
    let service: BookingTotalPriceRedemptionService;
    let sessionStorageMock: StorageServiceMock;

    beforeEach(() => {
        sessionStorageMock = new StorageServiceMock();

        TestBed.configureTestingModule({
            providers: [
                BookingTotalPriceRedemptionService,
                { provide: CommonsSessionStorageService, useValue: sessionStorageMock }
            ]
        });

        service = TestBed.inject(BookingTotalPriceRedemptionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getRedemptionTotalPriceModel', () => {
        const TOTAL_CASH = '123.45';

        it('should return totalCash and empty totalAvios when there is no fare redemption data in session storage', () => {
            spyOn(sessionStorageMock, 'get').and.returnValue(null);

            const result: RedemptionTotalPriceModel =
        service.getRedemptionTotalPriceModel(TOTAL_CASH);

            expect(sessionStorageMock.get).toHaveBeenCalledWith(
                BkiStorageConstants.SELECTED_FARE_REDEMPTION_DATA
            );
            expect(result).toEqual({
                totalCash: TOTAL_CASH,
                totalAvios: ''
            });
        });

        it('should return totalCash and totalAvios from fare redemption data when available in session storage', () => {
            const fareRedemptionData: Partial<FareRedemptionDataModel> = {
                price: {
                    totalAvios: '98765' as any
                } as any
            };

            spyOn(sessionStorageMock, 'get').and.returnValue(fareRedemptionData as FareRedemptionDataModel);

            const result: RedemptionTotalPriceModel =
        service.getRedemptionTotalPriceModel(TOTAL_CASH);

            expect(sessionStorageMock.get).toHaveBeenCalledWith(
                BkiStorageConstants.SELECTED_FARE_REDEMPTION_DATA
            );
            expect(result).toEqual({
                totalCash: TOTAL_CASH,
                totalAvios: '98765'
            });
        });
    });
});
