import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbLotusOtpFormComponent } from '@src/app/shared/components/ib-lotus-otp-modal/components/ib-lotus-otp-form/ib-lotus-otp-form.component';
import { IbMmbRetrieveOrderService } from '@src/components/services/ib-MmB-retrieve-order.service';
import { OtpFormStatesEnum } from '@src/app/core/models/ib-lotus-otp-models';

describe('IbLotusOtpFormComponent', () => {
  let fixture: ComponentFixture<IbLotusOtpFormComponent>;
  let component: IbLotusOtpFormComponent;

  const fakeService = {
    retrieveOrderCachedLotusPromised: jasmine.createSpy('retrieveOrderCachedLotusPromised')
  };

  const mockInputs = {
    reset: jasmine.createSpy('reset'),
    setEnabled: jasmine.createSpy('setEnabled')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbLotusOtpFormComponent],
      providers: [{ provide: IbMmbRetrieveOrderService, useValue: fakeService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(IbLotusOtpFormComponent);
    component = fixture.componentInstance;
    component.flowId = 'TWFuYWdlTXlCb29raW5nQElCNzNlYTlkNGZmZDExNDAxZWJkMDUyOWU1YTc5NmNmYzU';
    component.otpSessionId = 'SESSION-1';
    fixture.detectChanges();
    component.inputs = mockInputs as any;
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should reset inputs, restart timer and emit pristin', () => {
      const now = new Date();
      component.otpTimeStart = new Date(now.getTime()).toISOString();
      component.otpTimeLimit = new Date(now.getTime() + 60_000).toISOString();

      mockInputs.reset.calls.reset();
      const emitSpy = spyOn(component.otpFormState, 'emit');

      component.ngOnChanges();

      expect(mockInputs.reset).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.PRISTINE });
    });
  });

  describe('onOtpChange', () => {
    it('if code has less than 6 digits should emit INCOMPLETE', () => {
      const emitSpy = spyOn(component.otpFormState, 'emit');

      component.onOtpChange({ value: '12' } as any);

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.INCOMPLETE });
    });

    it('if code has 6 digits should call onOtpComplete', () => {
      const completeSpy = spyOn<any>(component, 'onOtpComplete');

      component.onOtpChange({ value: '123456' } as any);

      expect(completeSpy).toHaveBeenCalledWith('123456');
    });
  });

  describe('onOtpComplete (success and error)', () => {
    it('success: first LOADING and then SUCCESS with data', fakeAsync(() => {
      const emitSpy = spyOn(component.otpFormState, 'emit');
      const okResponse = { ok: true };
      fakeService.retrieveOrderCachedLotusPromised.and.returnValue(Promise.resolve(okResponse));
      component.onOtpChange({ value: '123456' } as any);
      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.LOADING });
      flushMicrotasks();

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.SUCCESS, data: okResponse });
    }));

    it('invalid code error (403 + SSE_ORM_6970)shoudld emit INVALID_CODE and reset without event', fakeAsync(() => {
      const emitSpy = spyOn(component.otpFormState, 'emit');
      const invalidError = { errorCode: 403, internalErrorCode: 'SSE_ORM_6970' };

      mockInputs.reset.calls.reset();
      mockInputs.setEnabled.calls.reset();

      fakeService.retrieveOrderCachedLotusPromised.and.returnValue(Promise.reject(invalidError));

      component.onOtpChange({ value: '123456' } as any);

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.LOADING });

      flushMicrotasks();

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.INVALID_CODE, errorData: invalidError });
      expect(mockInputs.reset).toHaveBeenCalledWith(false);
      expect(mockInputs.setEnabled).toHaveBeenCalledWith(true);
    }));

    it('generic error: emit ERROR and clear timer', fakeAsync(() => {
      const emitSpy = spyOn(component.otpFormState, 'emit');
      const clearSpy = spyOn<any>(component, 'clearTimerInterval').and.callThrough();
      const genericError = { errorCode: 500 };

      fakeService.retrieveOrderCachedLotusPromised.and.returnValue(Promise.reject(genericError));

      component.onOtpChange({ value: '123456' } as any);

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.LOADING });

      flushMicrotasks();

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.ERROR, errorData: genericError });
      expect(clearSpy).toHaveBeenCalled();
    }));
  });

  describe('reactiveStatesUpdater (state effects)', () => {
    it('enable input in PRISTINE / ALLOWED_RESEND_TIME / INCOMPLETE / INVALID_CODE', () => {
      mockInputs.setEnabled.calls.reset();

      component.currentOTPState$.next({ state: OtpFormStatesEnum.PRISTINE });
      component.currentOTPState$.next({ state: OtpFormStatesEnum.ALLOWED_RESEND_TIME });
      component.currentOTPState$.next({ state: OtpFormStatesEnum.INCOMPLETE });
      component.currentOTPState$.next({ state: OtpFormStatesEnum.INVALID_CODE });

      expect(mockInputs.setEnabled).toHaveBeenCalledWith(true);
    });

    it('disable input in LOADING', () => {
      mockInputs.setEnabled.calls.reset();

      component.currentOTPState$.next({ state: OtpFormStatesEnum.LOADING });

      expect(mockInputs.setEnabled).toHaveBeenCalledWith(false);
    });

    it('clear timer in TIMEOUT / SUCCESS / ERROR / INVALID_SESSION', () => {
      const clearSpy = spyOn<any>(component, 'clearTimerInterval');

      [OtpFormStatesEnum.TIMEOUT, OtpFormStatesEnum.SUCCESS, OtpFormStatesEnum.ERROR, OtpFormStatesEnum.INVALID_SESSION]
        .forEach(state => {
          component.currentOTPState$.next({ state });
          expect(clearSpy).toHaveBeenCalled();
          clearSpy.calls.reset();
        });
    });

    it('do reset(false) when state is INVALID_CODE', () => {
      mockInputs.reset.calls.reset();

      component.currentOTPState$.next({ state: OtpFormStatesEnum.INVALID_CODE });

      expect(mockInputs.reset).toHaveBeenCalledWith(false);
    });
  });

  describe('timer', () => {
    it('emit ALLOWED_RESEND_TIME when 1 minute or more passed', () => {
      const emitSpy = spyOn(component.otpFormState, 'emit');

      const now = new Date();
      component.otpTimeStart = new Date(now.getTime()).toISOString();
      component.otpTimeLimit = new Date(now.getTime() + 120_000).toISOString();

      (component as any).initTimer();
      (component as any).timerStart = new Date(Date.now() - 61000);
      (component as any).calculateTimeLimit();

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.ALLOWED_RESEND_TIME });
    });

    it('when time limit passed → emit TIMEOUT and stop interval', fakeAsync(() => {
      const emitSpy = spyOn(component.otpFormState, 'emit');

      const now = new Date();
      component.otpTimeStart = new Date(now.getTime()).toISOString();
      component.otpTimeLimit = new Date(now.getTime() - 1000).toISOString();

      (component as any).initTimer();

      tick(300);

      expect(emitSpy).toHaveBeenCalledWith({ state: OtpFormStatesEnum.TIMEOUT });
      expect((component as any).timerInterval).toBe(-1);
      expect(component.endTimeLimit).toBe('00:00');
    }));
  });

  describe('ngOnDestroy', () => {
    it('clear interval and unsubscribe', () => {
      const clearSpy = spyOn<any>(component, 'clearTimerInterval').and.callThrough();
      const unsubSpy = spyOn((component as any).statusSub, 'unsubscribe').and.callThrough();

      component.ngOnDestroy();

      expect(clearSpy).toHaveBeenCalled();
      expect(unsubSpy).toHaveBeenCalled();
    });
  });
});