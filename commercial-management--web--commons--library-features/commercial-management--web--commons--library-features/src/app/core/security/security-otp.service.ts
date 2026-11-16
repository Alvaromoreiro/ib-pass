import {
    Injectable,
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    NgZone
} from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';

import { IbUiOtpModalComponent, IbUiOtpModalErrorComponent } from 'ib-web-commons/ui-components';

import {
    OtpRequiredPayload,
    OtpSessionData,
    OtpErrorCode,
    KNOWN_OTP_ERROR_CODES
} from './models/security-otp.models';

@Injectable({ providedIn: 'root' })
export class SecurityOtpService {

    private initialized = false;
    private messageListener: ((event: MessageEvent) => void) | null = null;
    private modalComponentRef: ComponentRef<IbUiOtpModalComponent> | null = null;
    private errorModalComponentRef: ComponentRef<IbUiOtpModalErrorComponent> | null = null;

    constructor (
        private appRef: ApplicationRef,
        private envInjector: EnvironmentInjector,
        private ngZone: NgZone
    ) {}

    private isValidOtpEvent (data: any): data is Record<string, unknown> & { type: string } {
        return typeof data === 'object' && data !== null && 'type' in data;
    }

    /**
     * Inicializa la escucha de eventos OTP via postMessage.
     *
     * LLAMAR SOLO UNA VEZ desde la app principal (BKI/MMB/CKI).
     * No llamar desde ibmenus para evitar duplicación de listeners.
     */
    public initialize (): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.messageListener = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (!this.isValidOtpEvent(event.data)) return;

            this.ngZone.run(() => {
                this.handleOtpEvent(event.data);
            });
        };

        window.addEventListener('message', this.messageListener);
    }

    /**
     * Limpia listeners y destruye componentes dinámicos.
     * Llamar en el $destroy del scope o ngOnDestroy.
     */
    public destroy (): void {
        if (this.messageListener) {
            window.removeEventListener('message', this.messageListener);
            this.messageListener = null;
        }
        this.destroyModal();
        this.destroyErrorModal();
        this.initialized = false;
    }

    private handleOtpEvent (data: { type: string; payload?: any }): void {
        switch (data.type) {
                case 'OTP_REQUIRED':
                    this.handleOtpRequired(data.payload);
                    break;

                case 'OTP_VALIDATION_ERROR':
                    this.handleOtpValidationError(data.payload?.error_code);
                    break;

                case 'OTP_SUCCESS':
                    this.handleOtpSuccess();
                    break;

                case 'OTP_GENERAL_ERROR':
                    this.handleOtpGeneralError();
                    break;
        }
    }

    private handleOtpRequired (payload: OtpRequiredPayload): void {
        const otpData = this.mapPayloadToOtpData(payload);

        if (this.modalComponentRef) {
            const prevOtpData = this.modalComponentRef.instance.otpData;
            this.modalComponentRef.instance.otpData = otpData;
            this.modalComponentRef.instance.errorCode = null;

            this.modalComponentRef.instance.ngOnChanges({
                otpData: {
                    previousValue: prevOtpData,
                    currentValue: otpData,
                    firstChange: false,
                    isFirstChange: () => false
                }
            });
            this.modalComponentRef.changeDetectorRef.detectChanges();
        } else {
            this.createModal(otpData);
        }
    }

    private handleOtpValidationError (errorCode: string | undefined): void {
        if (!errorCode) return;

        if (this.isKnownOtpError(errorCode)) {
            if (this.modalComponentRef) {
                const prevErrorCode = this.modalComponentRef.instance.errorCode;
                this.modalComponentRef.instance.errorCode = errorCode;

                this.modalComponentRef.instance.ngOnChanges({
                    errorCode: {
                        previousValue: prevErrorCode,
                        currentValue: errorCode,
                        firstChange: false,
                        isFirstChange: () => false
                    }
                });
                this.modalComponentRef.changeDetectorRef.detectChanges();
            }
        } else {
            this.handleOtpGeneralError();
        }
    }

    private handleOtpSuccess (): void {
        this.destroyModal();
    }

    private handleOtpGeneralError (): void {
        this.destroyModal();
        this.createErrorModal();
    }

    /**
     * Envía OTP_SUBMITTED al iframe vía postMessage.
     * Se usa window.postMessage porque en el contexto de doble iframe
     * no tenemos referencia directa al contentWindow del iframe correcto.
     * La pantalla gris WCS escucha en su propio window.
     *
     * Nota: Si en el futuro se necesita dirigir al iframe específico,
     * se puede pasar la referencia en initialize() o buscar por ID.
     */
    private sendOtpSubmitted (otpCode: string): void {
        const iframe = document.getElementById('iframeReusableLoginId') as HTMLIFrameElement;

        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'OTP_SUBMITTED',
                payload: { otp_code: otpCode }
            }, window.location.origin);
        }
    }

    private sendOtpResend (): void {
        const iframe = document.getElementById('iframeReusableLoginId') as HTMLIFrameElement;

        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'OTP_RESEND'
            }, window.location.origin);
        }
    }

    private createModal (otpData: OtpSessionData): void {
        this.modalComponentRef = createComponent(IbUiOtpModalComponent, {
            environmentInjector: this.envInjector
        });

        this.modalComponentRef.instance.otpData = otpData;
        this.modalComponentRef.instance.errorCode = null;

        this.modalComponentRef.instance.codeSubmit.subscribe(
            (event: { otpCode: string }) => {
                this.sendOtpSubmitted(event.otpCode);
            }
        );

        this.modalComponentRef.instance.resendRequest.subscribe(() => {
            this.sendOtpResend();
        });

        this.modalComponentRef.instance.closeModal.subscribe(() => {
            this.destroyModal();
        });

        this.appRef.attachView(this.modalComponentRef.hostView);

        const domElement = this.modalComponentRef.location.nativeElement;
        document.body.appendChild(domElement);
    }

    private destroyModal (): void {
        if (this.modalComponentRef) {
            this.appRef.detachView(this.modalComponentRef.hostView);
            this.modalComponentRef.destroy();
            this.modalComponentRef = null;
        }
    }


    private createErrorModal (): void {
        this.errorModalComponentRef = createComponent(IbUiOtpModalErrorComponent, {
            environmentInjector: this.envInjector
        });

        this.errorModalComponentRef.instance.closeModal.subscribe(() => {
            this.destroyErrorModal();
        });

        this.appRef.attachView(this.errorModalComponentRef.hostView);

        const domElement = this.errorModalComponentRef.location.nativeElement;
        document.body.appendChild(domElement);
    }

    private destroyErrorModal (): void {
        if (this.errorModalComponentRef) {
            this.appRef.detachView(this.errorModalComponentRef.hostView);
            this.errorModalComponentRef.destroy();
            this.errorModalComponentRef = null;
        }
    }

    private isKnownOtpError (code: string): code is OtpErrorCode {
        return (KNOWN_OTP_ERROR_CODES as readonly string[]).includes(code);
    }

    private mapPayloadToOtpData (payload: OtpRequiredPayload): OtpSessionData {
        return {
            sessionCode: payload.session_code,
            codeExpiresAt: payload.code_expires_at,
            codeCreatedAt: payload.code_created_at,
            email: payload.email
        };
    }
}

try {
    angular
        .module('ib-security-otp-module')
        .factory('SecurityOtpService', downgradeInjectable(SecurityOtpService));
} catch {
    angular
        .module('ib-security-otp-module', [])
        .factory('SecurityOtpService', downgradeInjectable(SecurityOtpService));
}