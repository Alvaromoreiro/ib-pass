export interface OtpInputChangeEvent {
    value: string;
}
export interface OtpModalModel {
    voucherCode:string;
    flowId: string;
    sessionId?: string;
    sessionExpiration?: string;
    sessionRequested?: string;
    email: string;
}

export enum OtpFormStatesEnum {
    'PRISTINE' = 'PRISTINE',
    'LOADING' = 'LOADING', 
    'TIMEOUT' = 'TIMEOUT',
    'ALLOWED_RESEND_TIME' ='ALLOWED_RESEND_TIME',
    'INVALID_CODE' = 'INVALID_CODE',
    'INVALID_SESSION'= 'INVALID_SESSION',
    'ERROR'='ERROR',
    'SUCCESS' = 'SUCCESS',
    'INCOMPLETE'= 'INCOMPLETE',
    'CLOSED' = 'CLOSED',
    'RESEND_CODE' = 'RESEND_CODE'
}
export type OtpFormStatesEnumValues = `${OtpFormStatesEnum}`;


export interface OtpFormState {
    state: OtpFormStatesEnumValues;
}

export interface OtpResponse {
    metadata?: OtpResponseMetadata;
    data:     OtpResponseData|null;
}
export interface OtpResponseData {
    otp_code: string
}

export interface OtpResponseMetadata {
    'request-id'?: string;
    domain:       string;
    subdomain:    string;
    service:      string;
    errors:       OtpError[];
}

export interface OtpRequest {
    data: {
        otpCode:    string;
    }
}

export interface OtpError {
    code: string,
    message: string,
    description?: string
}

export interface OtpModalOutput {
    state: OtpFormStatesEnumValues,
    sessionId: string
}