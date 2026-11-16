import { TestBed } from '@angular/core/testing';
import { SecurityOtpService } from 'ib-web-commons/security';
import { IbUiOtpModalComponent } from 'ib-web-commons/ui-components';
import { IbUiOtpModalErrorComponent } from 'ib-web-commons/ui-components';
import { TranslateModule } from '@ngx-translate/core';

describe('SecurityOtpService', () => {
    let service: SecurityOtpService;

    const mockPayload = {
        session_code: 'TEST_SESSION',
        code_expires_at: Date.now() + (5 * 60 * 1000),
        code_created_at: Date.now(),
        email: 'test*****@iberia.com'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                IbUiOtpModalComponent,
                IbUiOtpModalErrorComponent
            ],
            imports: [TranslateModule.forRoot()],
            providers: [
                SecurityOtpService
            ]
        });

        service = TestBed.inject(SecurityOtpService);
    });

    afterEach(() => {
        service.destroy();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('initialize', () => {
        it('should register message listener', () => {
            spyOn(window, 'addEventListener');
            service.initialize();
            expect(window.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
        });

        it('should ignore duplicate initialize calls', () => {
            spyOn(window, 'addEventListener').and.callThrough();
            service.initialize();
            service.initialize();
            expect(window.addEventListener).toHaveBeenCalledTimes(1);
        });
    });

    describe('destroy', () => {
        it('should remove message listener', () => {
            service.initialize();
            spyOn(window, 'removeEventListener');
            service.destroy();
            expect(window.removeEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
        });

        it('should allow re-initialization after destroy', () => {
            service.initialize();
            service.destroy();
            spyOn(window, 'addEventListener');
            service.initialize();
            expect(window.addEventListener).toHaveBeenCalled();
        });
    });

    describe('OTP_REQUIRED', () => {
        it('should create modal', () => {
            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
            expect(service['modalComponentRef']).not.toBeNull();
        });

        it('should reuse existing modal on second OTP_REQUIRED (resend)', () => {
            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
            const firstRef = service['modalComponentRef'];

            const newPayload = { ...mockPayload, session_code: 'NEW_SESSION' };
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: newPayload });

            expect(service['modalComponentRef']).toBe(firstRef);
        });
    });

    describe('OTP_VALIDATION_ERROR', () => {
        beforeEach(() => {
            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
        });

        it('should handle SECURITY_INVALID_CODE_ERROR keeping modal open', () => {
            service['handleOtpEvent']({ type: 'OTP_VALIDATION_ERROR', payload: { error_code: 'SECURITY_INVALID_CODE_ERROR' } });
            expect(service['modalComponentRef']).not.toBeNull();
            expect(service['modalComponentRef']?.instance.errorCode).toEqual('SECURITY_INVALID_CODE_ERROR');
        });

        it('should handle SECURITY_EXPIRED_CODE_ERROR keeping modal open', () => {
            service['handleOtpEvent']({ type: 'OTP_VALIDATION_ERROR', payload: { error_code: 'SECURITY_EXPIRED_CODE_ERROR' } });
            expect(service['modalComponentRef']).not.toBeNull();
            expect(service['modalComponentRef']?.instance.errorCode).toEqual('SECURITY_EXPIRED_CODE_ERROR');
        });

        it('should handle SECURITY_MAX_ATTEMPTS_ERROR keeping modal open', () => {
            service['handleOtpEvent']({ type: 'OTP_VALIDATION_ERROR', payload: { error_code: 'SECURITY_MAX_ATTEMPTS_ERROR' } });
            expect(service['modalComponentRef']).not.toBeNull();
            expect(service['modalComponentRef']?.instance.errorCode).toEqual('SECURITY_MAX_ATTEMPTS_ERROR');
        });

        it('should destroy modal and show generic error modal on unknown error code', () => {
            service['handleOtpEvent']({ type: 'OTP_VALIDATION_ERROR', payload: { error_code: 'UNKNOWN_ERROR' } });
            expect(service['modalComponentRef']).toBeNull();
            expect(service['errorModalComponentRef']).not.toBeNull();
        });

        it('should not act on empty error code', () => {
            service['handleOtpEvent']({ type: 'OTP_VALIDATION_ERROR', payload: {} });
            expect(service['modalComponentRef']).not.toBeNull();
            expect(service['errorModalComponentRef']).toBeNull();
        });
    });

    describe('OTP_SUCCESS', () => {
        it('should destroy modal', () => {
            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
            expect(service['modalComponentRef']).not.toBeNull();

            service['handleOtpEvent']({ type: 'OTP_SUCCESS' });
            expect(service['modalComponentRef']).toBeNull();
        });
    });

    describe('postMessage to iframe', () => {
        let mockIframe: HTMLIFrameElement;
        let postMessageSpy: jasmine.Spy;

        beforeEach(() => {
            mockIframe = document.createElement('iframe');
            mockIframe.id = 'iframeReusableLoginId';
            document.body.appendChild(mockIframe);
            postMessageSpy = spyOn(mockIframe.contentWindow!, 'postMessage');

            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
        });

        afterEach(() => {
            mockIframe.remove();
        });

        it('should send OTP_SUBMITTED when codeSubmit is emitted', () => {
            service['modalComponentRef']?.instance.codeSubmit.emit({ otpCode: '123456' });

            expect(postMessageSpy).toHaveBeenCalledWith(
                { type: 'OTP_SUBMITTED', payload: { otp_code: '123456' } },
                window.location.origin
            );
        });

        it('should send OTP_RESEND when resendRequest is emitted', () => {
            service['modalComponentRef']?.instance.resendRequest.emit();

            expect(postMessageSpy).toHaveBeenCalledWith(
                { type: 'OTP_RESEND' },
                window.location.origin
            );
        });
    });

    describe('close modal', () => {
        it('should destroy modal when closeModal is emitted', () => {
            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
            expect(service['modalComponentRef']).not.toBeNull();

            service['modalComponentRef']?.instance.closeModal.emit();
            expect(service['modalComponentRef']).toBeNull();
        });
    });

    describe('OTP_GENERAL_ERROR', () => {
        beforeEach(() => {
            service.initialize();
            service['handleOtpEvent']({ type: 'OTP_REQUIRED', payload: mockPayload });
        });

        it('should destroy OTP modal and create error modal', () => {
            service['handleOtpEvent']({ type: 'OTP_GENERAL_ERROR' });

            expect(service['modalComponentRef']).toBeNull();
            expect(service['errorModalComponentRef']).not.toBeNull();
        });

        it('should create error modal even if OTP modal was not open', () => {
            service['handleOtpEvent']({ type: 'OTP_SUCCESS' }); // cierra el OTP modal
            service['handleOtpEvent']({ type: 'OTP_GENERAL_ERROR' });

            expect(service['modalComponentRef']).toBeNull();
            expect(service['errorModalComponentRef']).not.toBeNull();
        });

        it('should destroy error modal when closeModal is emitted', () => {
            service['handleOtpEvent']({ type: 'OTP_GENERAL_ERROR' });
            expect(service['errorModalComponentRef']).not.toBeNull();

            service['errorModalComponentRef']?.instance.closeModal.emit();
            expect(service['errorModalComponentRef']).toBeNull();
        });

        it('should destroy error modal on service destroy', () => {
            service['handleOtpEvent']({ type: 'OTP_GENERAL_ERROR' });
            expect(service['errorModalComponentRef']).not.toBeNull();

            service.destroy();
            expect(service['errorModalComponentRef']).toBeNull();
        });
    });
});