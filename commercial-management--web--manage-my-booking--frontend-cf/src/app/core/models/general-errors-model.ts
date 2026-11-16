export enum MmbServiceErrorMessages {    
    SERVICEGENERALERROR = 'REST_SERVICE_ERROR_GENERAL',
    LOGGED_ERROR_TITLE = 'GENERAL_ADVICE_TITLE',
    LOGGED_ERROR_BODY = 'GENERAL_LOGGED_ERROR_BODY',
    LOGGED_ERROR_BODY_ZERO = 'ERROR_LOGGED_MODAL_IB_ZERO',
    JSON_MAPPING_EXCEPTION = 'JSON_MAPPING_EXCEPTION',
    UNEXPECTED_TECHNICAL_EXCEPTION = 'UNEXPECTED_TECHNICAL_EXCEPTION',
    FARE_NOT_FOUND = 'fare not found',
    LOGIN_ERROR_606 = 'ERROR_SSO_606',
    LOGIN_ERROR_GENERIC_INVALID = 'IB_GENERIC_INVALID_MAIL_OR_PASSWORD',
    LOGIN_MAIL_ERROR = 'LOGIN_MAIL_ERROR',
    ERROR_USER_REDEMPTION_ENABLE = 'ERROR_USER_REDEMPTION_ENABLE',
    PAC_UTILS_E0001 = 'com.ib.framework.error.PAC_UTILS_E0001'
}

export const MmbServiceErrorPatterns = {
    ERROR_PATTERN_WITH_PROPERTIES: /^property:.*\|.?error:.+$/
};

export type MmbCommonsErrorDataGeneral = {
    errorCode?: number;
    data?: MmbCommonsErrorDataGeneralData;
    requestURL?: string;
    config?: any;
};
export type MmbCommonsErrorDataGeneralData = {
    errors?: MmbCommonsErrorDataGeneralDataErrors[];
    error?: MmbCommonsErrorDataGeneralDataErrors;
    paymentOptions?: string;
    newMmBMarket?: string;
    newBookingMarket?: string;
    checkinId?: string;
    id?: number;
    flowId?: string;
    otp?: {}
};
export type MmbCommonsErrorDataGeneralDataErrors = {
    reason: string;
    code: string;
    errorDescription?: string;
    errorCode?: string;
    flowId?: string;
    error?: MmbCommonsErrorDataGeneralDataErrors
};
export type MmbCommonsErrorsResponseGeneral = {
    message?: string;
    needsTranslate: boolean;
    paymentStatus?: boolean;
    internalErrorCode?: string;
    paymentOptions?: string;
    errorCode: number;
    data?: MmbCommonsErrorDataGeneralData;
    status?: number;
    messageList?: CommonsErrorMessageList[];
    requestURL?: string;
    config?: any;
    ids?: any[];
    flowId?: string;
    otp?: { email?: string; sessionToken?: string}
};

export type CommonsErrorMessageList = {
    message: string;
    internalErrorCode: string;
};