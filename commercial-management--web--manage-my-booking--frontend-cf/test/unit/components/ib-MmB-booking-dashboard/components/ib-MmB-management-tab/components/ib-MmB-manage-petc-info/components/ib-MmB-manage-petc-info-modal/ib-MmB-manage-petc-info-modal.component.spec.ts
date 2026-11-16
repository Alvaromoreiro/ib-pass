import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IbMmbManagePetcInfoModalComponent } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/components/ib-MmB-manage-petc-info-modal/ib-MmB-manage-petc-info-modal.component";
import { PetcFlightInfo } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/models/petc-info.model";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeMock } from 'test/unit/utils/pipe-mock.pipe';
import { TranslateService } from '@ngx-translate/core';

describe('IbMmbManagePetcInfoModalComponent', () => {
    let component: IbMmbManagePetcInfoModalComponent;
    let fixture: ComponentFixture<IbMmbManagePetcInfoModalComponent>;
    let activeModal: NgbActiveModal;

    const createFlight = (overrides: Partial<PetcFlightInfo> = {}): PetcFlightInfo => ({
        sliceId: 'SLICE-001',
        departure: { code: 'MAD', name: 'Madrid' },
        arrival: { code: 'BCN', name: 'Barcelona' },
        pets: [],
        ...overrides
    } as PetcFlightInfo);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbMmbManagePetcInfoModalComponent, TranslatePipeMock],
            providers: [NgbActiveModal, TranslateService]
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmbManagePetcInfoModalComponent);
        component = fixture.componentInstance;
        activeModal = TestBed.inject(NgbActiveModal);
        spyOn(activeModal, 'close');
    });

    describe('petc info modal creation ', () => {
        it('should create the petc info modal component', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('ngOnInit', () => {
        it('should initialize the component', () => {
            spyOn(component, 'ngOnInit').and.callThrough();
            component.ngOnInit();
            expect(component.ngOnInit).toHaveBeenCalled();
        });
    });

    describe('closeModal', () => {
        it('should close the modal', () => {
            component.closeModal();
            expect(activeModal.close).toHaveBeenCalled();
        });
    });

    describe('accept', () => {
        it('should accept and close the modal', () => {
            component.accept();
            expect(activeModal.close).toHaveBeenCalled();
        });
    });

    describe('trackByOrderItemId', () => {
        it('should return the orderItemId of the pet', () => {
            const pet = { orderItemId: '12345' } as any;
            expect(component.trackByOrderItemId(0, pet)).toBe('12345');
        });
    });

    describe('trackBySliceId', () => {
        it('should return the sliceId of the flight', () => {
            expect(component.trackBySliceId(0, createFlight())).toBe('SLICE-001');
        });
    });

    describe('isShowPendingPayment', () => {
        it('should return true when any pet in the flight has pending payment', () => {
            const flight = createFlight({
                pets: [
                    { orderItemId: '001', emd: 'PENDING_PAYMENT', isPendingPayment: true, passengerName: 'Ana', passengerId: 'PAX-001', animalType: 'Perro', subtype: 'DOG' },
                    { orderItemId: '002', emd: 'PAID', isPendingPayment: false, passengerName: 'Luis', passengerId: 'PAX-002', animalType: 'Gato', subtype: 'CAT' }
                ] as any
            });
            expect(component.isShowPendingPayment(flight)).toBeTrue();
        });

        it('should return false when no pet in the flight has pending payment', () => {
            const flight = createFlight({
                sliceId: 'SLICE-002',
                pets: [
                    { orderItemId: '003', emd: 'PAID', isPendingPayment: false, passengerName: 'Ana', passengerId: 'PAX-001', animalType: 'Perro', subtype: 'DOG' }
                ] as any
            });
            expect(component.isShowPendingPayment(flight)).toBeFalse();
        });

        it('should return false when the flight has no pets', () => {
            expect(component.isShowPendingPayment(createFlight({ sliceId: 'SLICE-003' }))).toBeFalse();
        });
    });
});
