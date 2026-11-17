import { IbCOtpErrorModalComponent } from './ib-otp-error-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('IbCOtpErrorModalComponent', () => {
    let component: IbCOtpErrorModalComponent;
    let activeModal: jasmine.SpyObj<NgbActiveModal>;

    beforeEach(() => {
        activeModal = jasmine.createSpyObj<NgbActiveModal>('NgbActiveModal', ['dismiss']);
        component = new IbCOtpErrorModalComponent(activeModal);
    });

    it('sets the controlled voucher error body', () => {
        const onModalOpen = jasmine.createSpy('onModalOpen');
        component.model = { onModalOpen };

        component.ngOnInit();

        expect(component.model.body).toBe('VOUCHER_CONTROLED_ERROR');
        expect(onModalOpen).not.toHaveBeenCalled();
    });

    it('invokes the close callback and dismisses the modal', () => {
        const onClose = jasmine.createSpy('onClose');
        component.model = { onClose };

        component.close();

        expect(onClose).toHaveBeenCalled();
        expect(activeModal.dismiss).toHaveBeenCalledWith('CLOSE');
    });

    it('supports absent optional callbacks', () => {
        component.model = {};

        expect(() => component.ngOnInit()).not.toThrow();
        expect(() => component.close()).not.toThrow();
        expect(activeModal.dismiss).toHaveBeenCalledWith('CLOSE');
    });
});