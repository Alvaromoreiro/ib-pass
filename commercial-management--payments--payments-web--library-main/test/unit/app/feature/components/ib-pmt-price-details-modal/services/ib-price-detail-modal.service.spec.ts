import { IbCModalService } from 'ib-web-commons/ib-modal';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';
import { IbPriceDetailModalComponent } from 'src/app/feature/components/ib-pmt-price-details-modal/ib-price-detail-modal.component';
import { IbPriceDetailModalService } from 'src/app/feature/components/ib-pmt-price-details-modal/services/ib-price-detail-modal.service';

describe('IbPriceDetailModalService', () => {
    let service: IbPriceDetailModalService;
    let storage: StorageServiceMock;
    let modalComponentInstance: { priceDetails?: unknown[] };
    let showGenericComponentModal: jasmine.Spy;

    beforeEach(() => {
        storage = new StorageServiceMock();
        modalComponentInstance = {};
        const modalRef = {
            componentInstance: modalComponentInstance,
            result: Promise.resolve()
        };
        showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue(modalRef);

        service = new IbPriceDetailModalService(
            { showGenericComponentModal } as unknown as IbCModalService,
            storage as unknown as CommonsSessionStorageService
        );
    });

    it('should prepare price details from the original offer items when discounts are applied', () => {
        const originalOfferItems = [{ offerItemId: 'original' }];
        storage.set('fareData', {
            offers: [{
                discountsApplied: { originalOfferItems },
                offerItems: [{ offerItemId: 'discounted' }]
            }]
        });

        expect(service.preparePriceDetails()).toEqual(originalOfferItems);
    });

    it('should prepare price details from offer items when there are no original offer items', () => {
        const offerItems = [{ offerItemId: 'offer-item' }];
        storage.set('fareData', { offers: [{ offerItems }] });

        expect(service.preparePriceDetails()).toEqual(offerItems);
    });

    it('should transform imported order items into price details when fare data is unavailable', () => {
        const price = { total: 150 };
        const taxes = [{ amount: 50 }];
        storage.set('importOrder', {
            order: {
                orderItems: [{
                    passengerPrices: [{
                        passengerId: 'ADULT_1',
                        price,
                        taxes
                    }]
                }]
            }
        });

        const result = service.preparePriceDetails();
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(jasmine.objectContaining({
            price,
            passengerIds: ['ADULT_1'],
            detailedTaxes: taxes
        }));
    });

    it('should open the modal with the prepared price details', () => {
        const priceDetails = [{ offerItemId: 'offer-item' }];
        storage.set('fareData', { offers: [{ offerItems: priceDetails }] });

        service.openPriceDetailModal();

        expect(showGenericComponentModal).toHaveBeenCalledWith(
            IbPriceDetailModalComponent,
            jasmine.objectContaining({ windowClass: jasmine.any(String) })
        );
        expect(modalComponentInstance.priceDetails).toEqual(priceDetails);
    });

    describe('shouldShowCTA', () => {
        [
            { flowApp: 'BBKI', expected: true },
            { flowApp: 'MMBOH', expected: true },
            { flowApp: 'BBKIOH', expected: true },
            { flowApp: 'PAOB', expected: false },
            { flowApp: 'MMBBID', expected: false }
        ].forEach(({ flowApp, expected }) => {
            it(`should return ${expected} for flowApp ${flowApp}`, () => {
                expect(service.shouldShowCTA(flowApp)).toBe(expected);
            });
        });
    });
});
