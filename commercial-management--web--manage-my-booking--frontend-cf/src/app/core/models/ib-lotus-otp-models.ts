export interface OtpInputChangeEvent {
    value: string;
}
export interface OtpModalModel {
    pnr: string;
    surname: string;
    flowId: string;
    email?: string;
    sessionId?: string;
    sessionExpiration?: string;
    sessionRequested?: string;
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
    'CLOSED' = 'CLOSED'
}
export type OtpFormStatesEnumValues = `${OtpFormStatesEnum}`;


export interface OtpFormState {
    state: OtpFormStatesEnumValues;
    errorData?: any;
    data?: any;
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

export interface OtpModalOutput extends OtpFormState {}