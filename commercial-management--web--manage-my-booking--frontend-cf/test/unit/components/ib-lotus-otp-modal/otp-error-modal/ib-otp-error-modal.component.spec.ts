import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IbCOtpErrorModalComponent } from '@src/app/shared/components/ib-lotus-otp-modal/otp-error-modal/ib-otp-error-modal.component';

describe('IbCOtpErrorModalComponent', () => {
  let component: IbCOtpErrorModalComponent;
  let fixture: ComponentFixture<IbCOtpErrorModalComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    activeModal = jasmine.createSpyObj<NgbActiveModal>('NgbActiveModal', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [IbCOtpErrorModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModal }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(IbCOtpErrorModalComponent, {
        set: { template: '' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(IbCOtpErrorModalComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize model without calling onModalOpen when callback is not defined', () => {
      component.ngOnInit();

      expect(component.model).toEqual({
        body: 'VOUCHER_CONTROLED_ERROR'
      });
    });

    it('should not fail even if model had onModalOpen defined before ngOnInit', () => {
      const onModalOpenSpy = jasmine.createSpy('onModalOpen');

      component.model = {
        onModalOpen: onModalOpenSpy
      };

      expect(() => component.ngOnInit()).not.toThrow();
      expect(onModalOpenSpy).not.toHaveBeenCalled();
      expect(component.model.body).toBe('VOUCHER_CONTROLED_ERROR');
    });
  });

  describe('close', () => {
    it('should dismiss modal without calling onClose when callback is not defined', () => {
      component.model = {};

      component.close();

      expect(activeModal.dismiss).toHaveBeenCalledWith('CLOSE');
    });

    it('should call onClose and dismiss modal when callback is defined', () => {
      const onCloseSpy = jasmine.createSpy('onClose');

      component.model = {
        onClose: onCloseSpy
      };

      component.close();

      expect(onCloseSpy).toHaveBeenCalled();
      expect(activeModal.dismiss).toHaveBeenCalledWith('CLOSE');
    });
  });
});
