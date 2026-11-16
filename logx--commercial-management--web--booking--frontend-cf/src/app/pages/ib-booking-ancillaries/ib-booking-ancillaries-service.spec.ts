import { AncillariesService } from './ib-booking-ancillaries-service';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

describe('AncillariesService', () => {
    let service: AncillariesService;
    let localStorageService: StorageServiceMock;
    let commonsAncillariesService: any;
    let ancGetCachedInformationService: any;
    let ancillariesTransformer: any;
    let currencyService: any;
    let commonsModalService: any;
    let modalServiceAncillaries: any;

    const mockSummaryInfo = {
        currencies: [{ code: 'EUR' }],
        issuedItems: []
    };

    const mockTransformedInfo = { seatsQuanty: 0 };

    beforeEach(() => {
        localStorageService = new StorageServiceMock();

        commonsAncillariesService = {
            getAncillarieSummary: jasmine.createSpy('getAncillarieSummary').and.returnValue(Promise.resolve(mockSummaryInfo))
        };

        ancGetCachedInformationService = {
            getCachedInformation: jasmine.createSpy('getCachedInformation').and.returnValue(Promise.resolve({ order: {} }))
        };

        ancillariesTransformer = {
            passengerTransformData: jasmine.createSpy('passengerTransformData').and.returnValue({}),
            generateInfoCommon: jasmine.createSpy('generateInfoCommon').and.returnValue(mockTransformedInfo),
            countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.returnValue(0),
            transformAncillariesView: jasmine.createSpy('transformAncillariesView').and.returnValue({})
        };

        currencyService = {
            getCurrencyObject: jasmine.createSpy('getCurrencyObject').and.returnValue({ code: 'EUR' })
        };

        commonsModalService = { finishWaiting: jasmine.createSpy('finishWaiting') };

        modalServiceAncillaries = {
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            showGenericError: jasmine.createSpy('showGenericError').and.returnValue({ result: { finally: jasmine.createSpy() } })
        };

        service = new AncillariesService(
            null,
            ancGetCachedInformationService,
            ancillariesTransformer,
            localStorageService as any,
            commonsAncillariesService,
            currencyService,
            modalServiceAncillaries,
            null,
            null,
            commonsModalService,
            null, null, null, null, null, null, null, null, null
        );
    });

    describe('searchAncillariesInfo()', () => {
        beforeEach(() => {
            localStorageService.set('ancillariesInfo', { ancillaries: [] });
            localStorageService.set('bookingInfo', { order: {} });
            localStorageService.set('summaryInfo', mockSummaryInfo);
        });

        describe('when _isIncompatibilityReload is true and bookingInfo is cached', () => {
            it('should NOT call CommonsAncillariesService.getAncillarieSummary', async () => {
                await service.searchAncillariesInfo(true);

                expect(commonsAncillariesService.getAncillarieSummary).not.toHaveBeenCalled();
            });

            it('should read summaryInfo from localStorage', async () => {
                spyOn(localStorageService, 'get').and.callThrough();

                await service.searchAncillariesInfo(true);

                expect(localStorageService.get).toHaveBeenCalledWith('summaryInfo');
            });
        });

        describe('when _isIncompatibilityReload is false and bookingInfo is cached', () => {
            it('should call CommonsAncillariesService.getAncillarieSummary', async () => {
                await service.searchAncillariesInfo(false);

                expect(commonsAncillariesService.getAncillarieSummary).toHaveBeenCalled();
            });
        });

        describe('when _isIncompatibilityReload is not provided and bookingInfo is cached', () => {
            it('should call CommonsAncillariesService.getAncillarieSummary', async () => {
                await service.searchAncillariesInfo();

                expect(commonsAncillariesService.getAncillarieSummary).toHaveBeenCalled();
            });
        });

        describe('when _isIncompatibilityReload is true and bookingInfo is NOT cached', () => {
            beforeEach(() => {
                localStorageService.remove('bookingInfo');
            });

            it('should NOT call CommonsAncillariesService.getAncillarieSummary after getCachedInformation resolves', async () => {
                await service.searchAncillariesInfo(true);

                expect(ancGetCachedInformationService.getCachedInformation).toHaveBeenCalled();
                expect(commonsAncillariesService.getAncillarieSummary).not.toHaveBeenCalled();
            });
        });

        describe('when _isIncompatibilityReload is false and bookingInfo is NOT cached', () => {
            beforeEach(() => {
                localStorageService.remove('bookingInfo');
            });

            it('should call CommonsAncillariesService.getAncillarieSummary after getCachedInformation resolves', async () => {
                await service.searchAncillariesInfo(false);

                expect(ancGetCachedInformationService.getCachedInformation).toHaveBeenCalled();
                expect(commonsAncillariesService.getAncillarieSummary).toHaveBeenCalled();
            });
        });
    });
});
