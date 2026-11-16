import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbLotusOtpModalComponent } from '@src/app/shared/components/ib-lotus-otp-modal/ib-lotus-otp-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LiteralFormatterPipe } from '@shared/pipes/literalFormatter.pipe';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { IbMmbRetrieveOrderService } from '@src/components/services/ib-MmB-retrieve-order.service';
import { IbMmbRetrieveOrderOtpProtectedService } from '@src/components/services/ib-MmB-retrieve-order-otp-protected.service';
import { LoadingSpinnerService } from '@src/app/shared/components/loading-spinner/loading-spinner.service';
import { OtpFormStatesEnum } from '@src/app/core/models/ib-lotus-otp-models';

describe('IbLotusOtpModalComponent', () => {

  let fixture: ComponentFixture<IbLotusOtpModalComponent>;
  let component: IbLotusOtpModalComponent;

  const fakeActiveModal = {
    close: jasmine.createSpy('close'),
    dismiss: jasmine.createSpy('dismiss')
  };

  const fakeTranslate = {
    instant: jasmine.createSpy('instant').and.callFake((k) => k)
  };

  const fakeFormatter = {
    transform: jasmine.createSpy('transform').and.callFake((v) => v)
  };

  const fakeLinkPipe = {
    transform: jasmine.createSpy('transform').and.returnValue('http://iberia.es')
  };

  const fakeOrderService = {
    retrieveOrderPostPromised: jasmine.createSpy('retrieveOrderPostPromised')
  };

  const fakeOtpProtected = {
    generateOtpModel: jasmine.createSpy('generateOtpModel').and.returnValue({
      surname: 'new',
      pnr: 'newPNR',
      email: 'email@new.com'
    })
  };

  const fakeSpinner = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };

  
beforeEach(async () => {

  await TestBed.configureTestingModule({
    declarations: [IbLotusOtpModalComponent],
    providers: [
      { provide: NgbActiveModal, useValue: fakeActiveModal },
      { provide: TranslateService, useValue: fakeTranslate },
      { provide: IbMmbRetrieveOrderService, useValue: fakeOrderService },
      { provide: LoadingSpinnerService, useValue: fakeSpinner },
      { provide: IbMmbRetrieveOrderOtpProtectedService, useValue: fakeOtpProtected }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  })
  .overrideComponent(IbLotusOtpModalComponent, {
    set: {
      template: '<div></div>',
      providers: [
        { provide: LiteralFormatterPipe, useValue: fakeFormatter },
        { provide: IbCLinkPipe, useValue: fakeLinkPipe }
      ]
    }
  })
  .compileComponents();

  fixture = TestBed.createComponent(IbLotusOtpModalComponent);
  component = fixture.componentInstance;

  component.model = {
    email: 'test@test.com',
    surname: 'test',
    pnr: '8QMML8'
  } as any;

  fixture.detectChanges();
});


  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads texts and links', () => {
      expect(fakeSpinner.hide).toHaveBeenCalled();
      expect(component.textsModel.EXPLANATION).toContain('OTP_MODAL_LOTUS_EXPLANATION_TEXT');
      expect(component.ccLinkTag.link.href).toBe('http://iberia.es');
    });
  });

  describe('close()', () => {
    it('calls activeModal.close and spinner.show', () => {
      component.close({ state: 'TEST' } as any);
      expect(fakeActiveModal.close).toHaveBeenCalledWith({ state: 'TEST' });
      expect(fakeSpinner.show).toHaveBeenCalled();
    });
  });

  describe('dismiss()', () => {
    it('calls activeModal.dismiss and spinner.show', () => {
      component.dismiss({ state: 'X' } as any);
      expect(fakeActiveModal.dismiss).toHaveBeenCalledWith({ state: 'X' });
      expect(fakeSpinner.show).toHaveBeenCalled();
    });
  });

  describe('onOtpStatesUpdate()', () => {

    it('PRISTINE disables sendNewDisabled', () => {
      component.sendNewDisabled = false;
      component.onOtpStatesUpdate({ state: OtpFormStatesEnum.PRISTINE });
      expect(component.sendNewDisabled).toBeTrue();
    });

    it('ALLOWED_RESEND_TIME enables sendNewDisabled', () => {
      component.sendNewDisabled = true;
      component.onOtpStatesUpdate({ state: OtpFormStatesEnum.ALLOWED_RESEND_TIME });
      expect(component.sendNewDisabled).toBeFalse();
    });

    it('SUCCESS calls close()', () => {
      const spy = spyOn(component, 'close');
      component.onOtpStatesUpdate({ state: OtpFormStatesEnum.SUCCESS });
      expect(spy).toHaveBeenCalled();
    });

    it('ERROR calls dismiss()', () => {
      const spy = spyOn(component, 'dismiss');
      component.onOtpStatesUpdate({ state: OtpFormStatesEnum.ERROR });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('resendCode()', () => {

    it('when resolve → calls dismiss()', fakeAsync(() => {
      fakeOrderService.retrieveOrderPostPromised.and.returnValue(Promise.resolve(true));
      const spyDismiss = spyOn(component, 'dismiss');

      component.resendCode();
      flushMicrotasks();

      expect(spyDismiss).toHaveBeenCalled();
    }));

    it('when SSE_ORM_6969 error → updates model', fakeAsync(() => {
      const error = {
        errorCode: 403,
        internalErrorCode: 'SSE_ORM_6969'
      };

      fakeOrderService.retrieveOrderPostPromised.and.returnValue(Promise.reject(error));

      component.resendCode();
      flushMicrotasks();

      expect(fakeOtpProtected.generateOtpModel).toHaveBeenCalledWith('8QMML8', 'test', error);
      expect(component.model.surname).toBe('new');
      expect(component.model.pnr).toBe('newPNR');
      expect(component.model.email).toBeDefined();
    }));

    it('when generic error, it shouldcalls dismiss({ state: ERROR })', fakeAsync(() => {
      const error = { errorCode: 500 };
      fakeOrderService.retrieveOrderPostPromised.and.returnValue(Promise.reject(error));

      const spyDismiss = spyOn(component, 'dismiss');

      component.resendCode();
      flushMicrotasks();

      expect(spyDismiss).toHaveBeenCalledWith({
        state: OtpFormStatesEnum.ERROR,
        errorData: error
      });
    }));

  });

});