import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCheckinSeatSummaryService } from '@src/app/pages/ib-checkin-seat-summary/services/ib-checkin-seat-summary.service';
import { IbBoardingCardsModalService } from './ib-boarding-cards-modal.service';
import { IbCModalService, IbModalRef } from 'ib-web-commons/ib-modal';
import { IbBoardingCardsModalComponent } from '../ib-boarding-cards-modal.component';
import { mockBoardingCardsModelMap, mockDocumentsSegments } from '../mocks/ib-boarding-cards-modal.mocks';

interface ISessionStorageMock {
    get: jasmine.Spy
}

describe('IbBoardingCardsModalService', () => {
    let service: IbBoardingCardsModalService;
    let mockSessionStorage: ISessionStorageMock;
    let mockIbCModalService: jasmine.SpyObj<IbCModalService>;

    beforeEach(() => {
        mockSessionStorage = {
            get: jasmine.createSpy('mockSessionStorage.get')
        }
        mockIbCModalService = jasmine.createSpyObj('IbCModalService', ['showGenericComponentModal']);

        TestBed.configureTestingModule({
            providers: [
                IbCheckinSeatSummaryService,
                { provide: CommonsSessionStorageService, useValue: mockSessionStorage },
                { provide: IbCModalService, useValue: mockIbCModalService }
            ]
        });

        service = TestBed.inject(IbBoardingCardsModalService);

        mockSessionStorage.get.and.stub();
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('showGoogleWalletModal', () => {
        it('should open the modal', () => {
            const modalConfig = {
                modalBlocked: true,
                windowClass: 'ib-modals ib-modals__gw'
            };
            const modalRefMock = {
                componentInstance: {} as IbBoardingCardsModalComponent,
                result: Promise.resolve(true)
            } as unknown as IbModalRef<IbBoardingCardsModalComponent>;

            mockIbCModalService.showGenericComponentModal.and.returnValue(modalRefMock);

            service.showGoogleWalletModal({} as CkiBoardingCardModal.BoardingCardsModalModel);

            expect(mockIbCModalService.showGenericComponentModal).toHaveBeenCalledWith(IbBoardingCardsModalComponent, modalConfig);
        });

        it('should set the model from params', () => {
            const mockModel = { segments: mockDocumentsSegments };
            const modalRefMock = {
                componentInstance: {} as IbBoardingCardsModalComponent,
                result: Promise.resolve(true)
            } as unknown as IbModalRef<IbBoardingCardsModalComponent>;

            mockIbCModalService.showGenericComponentModal.and.returnValue(modalRefMock);

            const result = service.showGoogleWalletModal(mockModel);

            expect(result).toBeDefined();
            expect(modalRefMock.componentInstance.model.segments).toBeDefined();
        });
    });

    describe('closeGoogleWalletModal', () => {
        beforeEach(() => {
            const modalRefMock = {
                componentInstance: {} as IbBoardingCardsModalComponent,
                result: Promise.resolve(true),
                close: jasmine.createSpy('close'),
                dismiss: jasmine.createSpy('dismiss')
            } as unknown as IbModalRef<IbBoardingCardsModalComponent>;

            service['modalRef'] = modalRefMock;
        });

        const cases: ('dismiss' | 'close')[] = ['dismiss', 'close'];
        cases.forEach((state) => {
            it(`should close the modal with the correct state [${state}]`, () => {
                service.closeGoogleWalletModal(state);

                expect(service['modalRef'][state]).toHaveBeenCalled();
            });
        });

        it('should send the result if exists', () => {
            const mockResult = { passengerId: '1', segmentId: '1'};

            service.closeGoogleWalletModal('close', mockResult);

            expect(service['modalRef']['close']).toHaveBeenCalledWith(mockResult);
        });
    });

    describe('mapSegmentsInformation', () => {
        let mockSegments: CkiBoardingCardModal.ModalSegmentInfo[];

        beforeEach(() => {
            mockSegments = structuredClone(mockDocumentsSegments);
        });

        it('should return the correct map', () => {
            const result = service.mapSegmentsInformation(mockSegments);

            expect(result).toEqual(mockBoardingCardsModelMap);
        });

        it('should set passenger default value if gender is undefined', () => {
            mockSessionStorage.get.withArgs('bookingInfo').and.returnValue({ passengers: [{ id: 1, gender: undefined }] });
            const result = service.mapSegmentsInformation(mockSegments);

            expect(result[0].passengers[0].gender).toBe('MALE');
        });

        it('should set passenger with correct gender if is defined', () => {
            mockSessionStorage.get.withArgs('bookingInfo').and.returnValue({ passengers: [{ id: 1, gender: 'FEMALE' }] });
            const result = service.mapSegmentsInformation(mockSegments);

            expect(result[0].passengers[0].gender).toBe('FEMALE');
        });
    });
});