import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef
} from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { TranslateService } from '@ngx-translate/core';
import * as angular from 'angular';

export interface OtpSessionData {
    sessionCode: string;
    codeExpiresAt: number;
    codeCreatedAt: number;
    email: string;
}

const OTP_CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const KNOWN_OTP_ERROR_CODES = [
    'SECURITY_INVALID_CODE_ERROR',
    'SECURITY_EXPIRED_CODE_ERROR',
    'SECURITY_MAX_ATTEMPTS_ERROR'
] as const;

export type OtpErrorCode = typeof KNOWN_OTP_ERROR_CODES[number];

interface OtpKeyContext {
    key: string;
    index: number;
}

@Component({
    selector: 'ib-ui-otp-modal',
    templateUrl: './ib-ui-otp-modal.component.html',
    styleUrls: ['./ib-ui-otp-modal.component.scss'],
    })
export class IbUiOtpModalComponent implements OnInit, OnDestroy, OnChanges {

    @Input() otpData: OtpSessionData | null = null;
    @Input() errorCode: OtpErrorCode | null = null;

    @Output() codeSubmit = new EventEmitter<{ otpCode: string }>();
    @Output() resendRequest = new EventEmitter<void>();
    @Output() closeModal = new EventEmitter<void>();
    @Output() genericError = new EventEmitter<void>();

    public digits: string[] = Array(OTP_CODE_LENGTH).fill('');
    public isSubmitting = false;
    public isExpired = false;
    public isInputDisabled = false;
    public hasError = false;
    public canResend = false;
    public formattedTime = '05:00';
    public resendCooldownFormatted = '';
    public remainingSeconds = 0;

    private countdownInterval: ReturnType<typeof setInterval> | null = null;
    private resendCooldownInterval: ReturnType<typeof setInterval> | null = null;
    private resendCooldownSeconds = 0;

    constructor (
        private cdr: ChangeDetectorRef,
        private translate: TranslateService
    ) {}

    /**
     * Getter mutuamente excluyente para decidir qué span del timer renderizar.
     * Evita que se muestren dos timers simultáneamente cuando el estado interno
     * (isExpired) y el errorCode no están sincronizados.
     */
    public get showZeroTimer (): boolean {
        return this.isExpired
            || this.errorCode === 'SECURITY_EXPIRED_CODE_ERROR'
            || this.errorCode === 'SECURITY_MAX_ATTEMPTS_ERROR';
    }

    ngOnInit (): void {
        this.startCountdown();
        this.startResendCooldown();
        this.focusInput(0);
    }

    ngOnDestroy (): void {
        this.cancelCountdown();
        this.cancelResendCooldown();
    }

    ngOnChanges (changes: SimpleChanges): void {
        const errorChange = changes['errorCode'];
        if (errorChange?.currentValue) {
            const code = errorChange.currentValue as OtpErrorCode;
            if ((KNOWN_OTP_ERROR_CODES as readonly string[]).includes(code)) {
                this.handleErrorCodeChange(code);
            } else {
                this.handleGenericError();
            }
        }
        if (changes['otpData'] && !changes['otpData'].isFirstChange()) {
            this.handleOtpDataChange();
        }
    }

    private handleErrorCodeChange (code: OtpErrorCode): void {
        this.hasError = true;
        this.isSubmitting = false;

        switch (code) {
                case 'SECURITY_INVALID_CODE_ERROR':
                    this.clearDigits();
                    this.isInputDisabled = false;
                    this.focusInput(0);
                    break;
                case 'SECURITY_EXPIRED_CODE_ERROR':
                case 'SECURITY_MAX_ATTEMPTS_ERROR':
                    this.isInputDisabled = true;
                    this.canResend = true;
                    this.cancelCountdown();
                    this.remainingSeconds = 0;
                    this.updateFormattedTime();
                    break;
        }
        this.cdr.markForCheck();
    }

    private handleGenericError (): void {
        this.closeModal.emit();
        this.genericError.emit();
    }

    private handleOtpDataChange (): void {
        this.clearDigits();
        this.hasError = false;
        this.isExpired = false;
        this.isInputDisabled = false;
        this.isSubmitting = false;
        this.cancelCountdown();
        this.startCountdown();
        this.startResendCooldown();
        this.focusInput(0);
        this.cdr.markForCheck();
    }


    private startCountdown (): void {
        if (!this.otpData) return;

        const totalDuration = this.otpData.codeExpiresAt - this.otpData.codeCreatedAt;

        this.remainingSeconds = Math.floor(totalDuration / 1000);

        this.updateFormattedTime();

        this.countdownInterval = setInterval(() => {
            this.remainingSeconds--;
            this.updateFormattedTime();
            if (this.remainingSeconds <= 0) {
                this.onTimerExpired();
            }
            this.cdr.markForCheck();
        }, 1000);
    }

    private updateFormattedTime (): void {
        const m = Math.max(0, Math.floor(this.remainingSeconds / 60));
        const s = Math.max(0, this.remainingSeconds % 60);
        this.formattedTime =
            String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    private onTimerExpired (): void {
        this.isExpired = true;
        this.isInputDisabled = true;
        this.canResend = true;
        this.cancelCountdown();
        this.cancelResendCooldown();
    }

    private cancelCountdown (): void {
        if (this.countdownInterval !== null) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    private startResendCooldown (): void {
        this.canResend = false;
        this.resendCooldownSeconds = RESEND_COOLDOWN_SECONDS;
        this.updateResendCooldownFormatted();
        this.cancelResendCooldown();

        this.resendCooldownInterval = setInterval(() => {
            this.resendCooldownSeconds--;
            this.updateResendCooldownFormatted();
            if (this.resendCooldownSeconds <= 0) {
                this.canResend = true;
                this.cancelResendCooldown();
            }
            this.cdr.markForCheck();
        }, 1000);
    }

    private updateResendCooldownFormatted (): void {
        this.resendCooldownFormatted = String(Math.max(0, this.resendCooldownSeconds)) + 's';
    }

    private cancelResendCooldown (): void {
        if (this.resendCooldownInterval !== null) {
            clearInterval(this.resendCooldownInterval);
            this.resendCooldownInterval = null;
        }
    }


    public onKeyDown (event: KeyboardEvent, index: number): void {
        if (event.ctrlKey || event.metaKey) return;

        const ctx: OtpKeyContext = { key: event.key, index };

        if (this.isIgnoredKey(ctx)) return;

        event.preventDefault();

        if (this.isBlockedKey(ctx)) return;

        if (this.shouldRedirectToFirstEmpty(ctx)) {
            this.focusInput(0);
            return;
        }

        this.applyKey(ctx);
        this.cdr.markForCheck();
    }

    private isIgnoredKey (ctx: OtpKeyContext): boolean {
        return ctx.key.length > 1
            && ctx.key !== 'Backspace'
            && ctx.key !== 'ArrowLeft'
            && ctx.key !== 'ArrowRight';
    }

    private isBlockedKey (ctx: OtpKeyContext): boolean {
        return ctx.key.length === 1 && !/^[0-9]$/.test(ctx.key);
    }

    private shouldRedirectToFirstEmpty (ctx: OtpKeyContext): boolean {
        return ctx.index > 0 && this.digits[0] === '' && ctx.key.length === 1;
    }

    private applyKey (ctx: OtpKeyContext): void {
        if (/^[0-9]$/.test(ctx.key)) {
            this.writeDigit(ctx);
            return;
        }
        if (ctx.key === 'Backspace') {
            this.eraseDigit(ctx);
            return;
        }
        if (ctx.key === 'ArrowLeft' && ctx.index > 0) {
            this.focusInput(ctx.index - 1);
            return;
        }
        if (ctx.key === 'ArrowRight' && ctx.index < OTP_CODE_LENGTH - 1) {
            this.focusInput(ctx.index + 1);
        }
    }

    private writeDigit (ctx: OtpKeyContext): void {
        this.digits[ctx.index] = ctx.key;
        if (ctx.index < OTP_CODE_LENGTH - 1) {
            this.focusInput(ctx.index + 1);
        }
        if (this.isCodeComplete()) {
            this.submitCode();
        }
    }

    private eraseDigit (ctx: OtpKeyContext): void {
        if (this.digits[ctx.index] !== '') {
            this.digits[ctx.index] = '';
            return;
        }
        if (ctx.index > 0) {
            this.digits[ctx.index - 1] = '';
            this.focusInput(ctx.index - 1);
        }
    }

    public onPaste (event: ClipboardEvent): void {
        event.preventDefault();
        const pastedText = event.clipboardData?.getData('text') ?? '';
        const numericOnly = pastedText.replace(/[^0-9]/g, '');

        if (!numericOnly.length) return;

        for (let i = 0; i < OTP_CODE_LENGTH; i++) {
            this.digits[i] = i < numericOnly.length ? numericOnly[i] : '';
        }

        if (numericOnly.length >= OTP_CODE_LENGTH) {
            this.submitCode();
        } else {
            this.focusInput(Math.min(numericOnly.length, OTP_CODE_LENGTH - 1));
        }
        this.cdr.markForCheck();
    }

    public onFocus (event: FocusEvent, index: number): void {
        if (index > 0 && this.digits[0] === '') {
            event.preventDefault();
            return;
        }
        (event.target as HTMLInputElement).select();
    }

    /**
     * Devuelve el aria-label/alt para cada input del OTP: "Dígito X de 6".
     * Usa la key 'OTP_MODAL_DIGIT_ACCESSIBLE' con interpolación i18n.
     */
    public getDigitAriaLabel (index: number): string {
        return this.translate.instant('OTP_MODAL_DIGIT_ACCESSIBLE', {
            current: index + 1,
            total: OTP_CODE_LENGTH
        });
    }

    private submitCode (): void {
        if (!this.canSubmit()) return;
        this.isSubmitting = true;
        this.isInputDisabled = true;
        this.hasError = false;
        this.codeSubmit.emit({ otpCode: this.digits.join('') });
        this.cdr.markForCheck();
    }

    private canSubmit (): boolean {
        return this.isCodeComplete() && !this.isSubmitting && !this.isInputDisabled;
    }

    public requestResend (): void {
        if (!this.canResend) return;
        this.hasError = false;
        this.resendRequest.emit();
        this.startResendCooldown();
        this.cdr.markForCheck();
    }

    public close (): void {
        this.closeModal.emit();
    }

    private isCodeComplete (): boolean {
        return this.digits.every((d) => /^[0-9]$/.test(d));
    }

    private clearDigits (): void {
        this.digits = Array(OTP_CODE_LENGTH).fill('');
    }

    private focusInput (index: number): void {
        setTimeout(() => {
            const inputs = document.querySelectorAll<HTMLInputElement>(
                'ib-ui-otp-modal .ib-otp-modal__digit-input'
            );
            inputs[index]?.focus();
        }, 50);
    }
}

try {
    angular.module('ib-ui-otp-modal-module').directive(
        'ibUiOtpModal',
        downgradeComponent({
            component: IbUiOtpModalComponent,
            inputs: ['otpData', 'errorCode'],
            outputs: ['codeSubmit', 'resendRequest', 'closeModal', 'genericError']
        }) as angular.IDirectiveFactory
    );
} catch {
    angular.module('ib-ui-otp-modal-module', []).directive(
        'ibUiOtpModal',
        downgradeComponent({
            component: IbUiOtpModalComponent,
            inputs: ['otpData', 'errorCode'],
            outputs: ['codeSubmit', 'resendRequest', 'closeModal', 'genericError']
        }) as angular.IDirectiveFactory
    );
}