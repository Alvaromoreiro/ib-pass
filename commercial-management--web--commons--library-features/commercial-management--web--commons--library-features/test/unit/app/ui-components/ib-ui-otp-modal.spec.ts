import { IbUiOtpModalComponent } from 'ib-web-commons/ui-components';
import { fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleChange } from '@angular/core';

describe('IbUiOtpModalComponent', () => {
    let component: IbUiOtpModalComponent;
    let fixture: ReturnType<typeof TestBed.createComponent<IbUiOtpModalComponent>>;

    const mockOtpData = {
        sessionCode: 'TEST_SESSION',
        codeExpiresAt: Date.now() + (5 * 60 * 1000),
        codeCreatedAt: Date.now(),
        email: 'test*****@iberia.com'
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [IbUiOtpModalComponent],
            imports: [TranslateModule.forRoot()]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IbUiOtpModalComponent);
        component = fixture.componentInstance;
        component.otpData = mockOtpData;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should initialize digits array with 6 empty strings', () => {
        expect(component.digits.length).toEqual(6);
        expect(component.digits.every(d => d === '')).toBeTrue();
    });

    it('should start countdown on init', () => {
        expect(component.remainingSeconds).toBeGreaterThan(0);
        expect(component.formattedTime).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should disable resend button initially (cooldown)', () => {
        expect(component.canResend).toBeFalse();
    });

    describe('onKeyDown', () => {
        it('should accept numeric input', () => {
            const event = new KeyboardEvent('keydown', { key: '5' });
            spyOn(event, 'preventDefault');
            component.onKeyDown(event, 0);
            expect(component.digits[0]).toEqual('5');
        });

        it('should reject non-numeric input', () => {
            const event = new KeyboardEvent('keydown', { key: 'a' });
            spyOn(event, 'preventDefault');
            component.onKeyDown(event, 0);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.digits[0]).toEqual('');
        });

        it('should clear digit on Backspace', () => {
            component.digits[0] = '5';
            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            spyOn(event, 'preventDefault');
            component.onKeyDown(event, 0);
            expect(component.digits[0]).toEqual('');
        });

        it('should allow keyboard shortcuts (Ctrl+V)', () => {
            const event = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true });
            spyOn(event, 'preventDefault');
            component.onKeyDown(event, 0);
            expect(event.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe('onPaste', () => {
        it('should fill digits from pasted numeric text', () => {
            const event = { preventDefault: jasmine.createSpy(), clipboardData: { getData: () => '123456' } } as unknown as ClipboardEvent;
            component.onPaste(event);
            expect(component.digits.join('')).toEqual('123456');
        });

        it('should ignore non-numeric characters in pasted text', () => {
            const event = { preventDefault: jasmine.createSpy(), clipboardData: { getData: () => '12ab56' } } as unknown as ClipboardEvent;
            component.onPaste(event);
            expect(component.digits[0]).toEqual('1');
            expect(component.digits[1]).toEqual('2');
            expect(component.digits[2]).toEqual('5');
            expect(component.digits[3]).toEqual('6');
        });
    });

    describe('submitCode', () => {
        it('should emit codeSubmit and disable inputs when code is complete', () => {
            spyOn(component.codeSubmit, 'emit');
            component.digits = ['1', '2', '3', '4', '5', '6'];
            component['submitCode']();
            expect(component.codeSubmit.emit).toHaveBeenCalledWith({ otpCode: '123456' });
            expect(component.isInputDisabled).toBeTrue();
            expect(component.isSubmitting).toBeTrue();
        });

        it('should not emit if code is incomplete', () => {
            spyOn(component.codeSubmit, 'emit');
            component.digits = ['1', '2', '3', '', '', ''];
            component['submitCode']();
            expect(component.codeSubmit.emit).not.toHaveBeenCalled();
        });
    });

    describe('error handling via ngOnChanges', () => {
        it('should clear digits and re-enable inputs on SECURITY_INVALID_CODE_ERROR', () => {
            component.digits = ['1', '2', '3', '4', '5', '6'];
            component.errorCode = 'SECURITY_INVALID_CODE_ERROR';
            component.ngOnChanges({
                errorCode: new SimpleChange(null, 'SECURITY_INVALID_CODE_ERROR', false)
            });
            expect(component.hasError).toBeTrue();
            expect(component.isInputDisabled).toBeFalse();
            expect(component.digits.every(d => d === '')).toBeTrue();
        });

        it('should disable inputs on SECURITY_EXPIRED_CODE_ERROR', () => {
            component.errorCode = 'SECURITY_EXPIRED_CODE_ERROR';
            component.ngOnChanges({
                errorCode: new SimpleChange(null, 'SECURITY_EXPIRED_CODE_ERROR', false)
            });
            expect(component.isInputDisabled).toBeTrue();
            expect(component.canResend).toBeTrue();
        });

        it('should disable inputs on SECURITY_MAX_ATTEMPTS_ERROR', () => {
            component.errorCode = 'SECURITY_MAX_ATTEMPTS_ERROR';
            component.ngOnChanges({
                errorCode: new SimpleChange(null, 'SECURITY_MAX_ATTEMPTS_ERROR', false)
            });
            expect(component.isInputDisabled).toBeTrue();
            expect(component.canResend).toBeTrue();
        });

        it('should emit genericError on unknown error code', () => {
            spyOn(component.closeModal, 'emit');
            spyOn(component.genericError, 'emit');
            component.errorCode = 'UNKNOWN_ERROR' as any;
            component.ngOnChanges({
                errorCode: new SimpleChange(null, 'UNKNOWN_ERROR', false)
            });
            expect(component.closeModal.emit).toHaveBeenCalled();
            expect(component.genericError.emit).toHaveBeenCalled();
        });
    });

    describe('otpData change (resend)', () => {
        it('should reset state when otpData changes', () => {
            component.hasError = true;
            component.isExpired = true;
            component.isInputDisabled = true;

            const newOtpData = { ...mockOtpData, sessionCode: 'NEW_SESSION' };
            component.otpData = newOtpData;
            component.ngOnChanges({
                otpData: new SimpleChange(mockOtpData, newOtpData, false)
            });

            expect(component.hasError).toBeFalse();
            expect(component.isExpired).toBeFalse();
            expect(component.isInputDisabled).toBeFalse();
            expect(component.digits.every(d => d === '')).toBeTrue();
        });
    });

    describe('timer expiration', () => {

        it('should expire and enable resend when timer reaches 0', () => {
            component.isExpired = false;
            component.isInputDisabled = false;
            component.canResend = false;

            component['onTimerExpired']();

            expect(component.isExpired).toBeTrue();
            expect(component.isInputDisabled).toBeTrue();
            expect(component.canResend).toBeTrue();
        });
    });

    describe('requestResend', () => {
        it('should emit resendRequest and restart cooldown when canResend is true', () => {
            spyOn(component.resendRequest, 'emit');
            component.canResend = true;
            component.requestResend();
            expect(component.resendRequest.emit).toHaveBeenCalled();
            expect(component.canResend).toBeFalse();
            expect(component.resendCooldownFormatted).toEqual('60s');
        });
        it('should not emit when canResend is false', () => {
            spyOn(component.resendRequest, 'emit');
            component.canResend = false;
            component.requestResend();
            expect(component.resendRequest.emit).not.toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should emit closeModal', () => {
            spyOn(component.closeModal, 'emit');
            component.close();
            expect(component.closeModal.emit).toHaveBeenCalled();
        });
    });
});