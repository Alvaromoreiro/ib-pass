/**
 * Contrato postMessage del spike (snake_case).
 * Estos son los payloads que viajan por postMessage entre iframe y padre.
 */
export interface OtpRequiredPayload {
    session_code: string;
    code_expires_at: number;
    code_created_at: number;
    email: string;
}

export interface OtpSubmittedPayload {
    otp_code: string;
}

export interface OtpValidationErrorPayload {
    error_code: OtpErrorCode | string;
}

/**
 * Tipos de eventos OTP del contrato postMessage (spike).
 */
export type OtpEventType =
    | 'OTP_REQUIRED'
    | 'OTP_SUBMITTED'
    | 'OTP_VALIDATION_ERROR'
    | 'OTP_RESEND'
    | 'OTP_SUCCESS';

/**
 * Eventos que el servicio escucha (iframe → padre).
 */
export interface OtpRequiredEvent {
    type: 'OTP_REQUIRED';
    payload: OtpRequiredPayload;
}

export interface OtpValidationErrorEvent {
    type: 'OTP_VALIDATION_ERROR';
    payload: OtpValidationErrorPayload;
}

export interface OtpSuccessEvent {
    type: 'OTP_SUCCESS';
}

/**
 * Eventos que el servicio envía (padre → iframe).
 */
export interface OtpSubmittedEvent {
    type: 'OTP_SUBMITTED';
    payload: OtpSubmittedPayload;
}

export interface OtpResendEvent {
    type: 'OTP_RESEND';
}

/**
 * Union de todos los eventos OTP entrantes (iframe → padre).
 */
export type IncomingOtpEvent = OtpRequiredEvent | OtpValidationErrorEvent | OtpSuccessEvent;

/**
 * Códigos de error OTP conocidos que se gestionan dentro de la modal.
 */
export const KNOWN_OTP_ERROR_CODES = [
    'SECURITY_INVALID_CODE_ERROR',
    'SECURITY_EXPIRED_CODE_ERROR',
    'SECURITY_MAX_ATTEMPTS_ERROR'
] as const;

export type OtpErrorCode = typeof KNOWN_OTP_ERROR_CODES[number];

/**
 * Interfaz interna del componente Angular (camelCase).
 * Se mapea desde/hacia el contrato postMessage (snake_case).
 */
export interface OtpSessionData {
    sessionCode: string;
    codeExpiresAt: number;
    codeCreatedAt: number;
    email: string;
}