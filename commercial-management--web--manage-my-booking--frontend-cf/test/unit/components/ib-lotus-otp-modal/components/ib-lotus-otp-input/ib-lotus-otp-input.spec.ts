import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { IbLotusOtpInputComponent } from '@src/app/shared/components/ib-lotus-otp-modal/components/ib-lotus-otp-input/ib-lotus-otp-input.component';

describe('IbLotusOtpInputComponent', () => {

  let fixture: ComponentFixture<IbLotusOtpInputComponent>;
  let component: IbLotusOtpInputComponent;

  let mockHtmlInput: any;
  let mockElementRef: any;

  beforeEach(async () => {

    mockHtmlInput = {
      focus: jasmine.createSpy('focus'),
      select: jasmine.createSpy('select')
    };

    mockElementRef = {
      nativeElement: {
        querySelector: jasmine.createSpy('querySelector').and.returnValue(mockHtmlInput)
      }
    };

    await TestBed.configureTestingModule({
      declarations: [IbLotusOtpInputComponent],
      providers: [
        { provide: ElementRef, useValue: mockElementRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(IbLotusOtpInputComponent, {
        set: { template: '<div></div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(IbLotusOtpInputComponent);
    component = fixture.componentInstance;

    component.inputLength = 6;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('creates 6 FormControls', () => {
      expect(component.otpInputs.controls.length).toBe(6);
    });
  });

  describe('otpChanged emit', () => {
    it('joins values', fakeAsync(() => {
      const emitSpy = spyOn(component.otpChanged, 'emit');

      component.otpInputs.controls[0].setValue('1');
      component.otpInputs.controls[1].setValue('2');
      component.otpInputs.controls[2].setValue('3');

      tick(80);

      expect(emitSpy).toHaveBeenCalledWith({ value: '123' });
    }));
  });

  describe('onPaste', () => {
    it('pastes numbers', () => {
      const event: any = {
        preventDefault: jasmine.createSpy('preventDefault'),
        clipboardData: { getData: () => '789' }
      };

      component.onPaste(event, 0);

      expect(component.otpInputs.controls[0].value).toBe('7');
      expect(component.otpInputs.controls[1].value).toBe('8');
      expect(component.otpInputs.controls[2].value).toBe('9');
    });

    it('ignores number text', () => {
      const event: any = {
        preventDefault: jasmine.createSpy('preventDefault'),
        clipboardData: { getData: () => 'abc' }
      };

      component.onPaste(event, 0);

      expect(component.otpInputs.controls[0].value).toBe('');
    });
  });

  const triggerBackspace = (value: string, index: number) => {
    const fakeInput = {
      value,
      nextElementSibling: { select: jasmine.createSpy('select') },
      previousElementSibling: { select: jasmine.createSpy('select') }
    };
    const event: any = { key: 'Backspace', target: fakeInput };
    component.onKeyUp(event, index);
  };

  describe('onKeyUp', () => {

    it('Backspace with empty value deletes previous', () => {
      component.otpInputs.controls[0].setValue('1');
      component.otpInputs.controls[1].setValue('2');

      triggerBackspace('', 1);

      expect(component.otpInputs.controls[0].value).toBeNull();
    });

    it('Backspace with value clears current', () => {
      component.otpInputs.controls[2].setValue('X');

      triggerBackspace('X', 2);

      expect(component.otpInputs.controls[2].value).toBeNull();
    });

    it('arrowRight calls changeFocus', () => {
      const spy = spyOn<any>(component, 'changeFocus').and.callThrough();
      const fakeInput = {
        value: '',
        nextElementSibling: { select: jasmine.createSpy('select') },
        previousElementSibling: { select: jasmine.createSpy('select') }
      };
      const event: any = { key: 'ArrowRight', target: fakeInput };
      component.onKeyUp(event, 1);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onKeyDown', () => {
    it('should return true when ctrlKey is pressed', () => {
      const event = {
        key: 'a',
        ctrlKey: true
      } as KeyboardEvent;

      const result = component.onKeyDown(event);

      expect(result).toBeTrue();
    });

    it('should return false for invalid keys', () => {
      const event = {
        key: 'a',
        ctrlKey: false
      } as KeyboardEvent;

      const result = component.onKeyDown(event);

      expect(result).toBeFalse();
    });

    it('should return true for valid numeric keys', () => {
      const event = {
        key: '5',
        ctrlKey: false
      } as KeyboardEvent;

      const result = component.onKeyDown(event);

      expect(result).toBeTrue();
    });
  });

  describe('setEnabled', () => {
    it('enable', () => {
      const spy = spyOn(component.otpInputs, 'enable' as any);
      component.setEnabled(true);
      expect(spy).toHaveBeenCalled();
    });

    it('disable', () => {
      const spy = spyOn(component.otpInputs, 'disable' as any);
      component.setEnabled(false);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('does reset without crashing', () => {
      const resetSpy = spyOn(component.otpInputs, 'reset');

      expect(() => component.reset(true)).not.toThrow();

      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('unsubscribes subs', () => {
      const fakeSub = { unsubscribe: jasmine.createSpy('unsubscribe') };
      component.subscriptions.push(fakeSub as any);

      component.ngOnDestroy();

      expect(fakeSub.unsubscribe).toHaveBeenCalled();
    });
  });
});
