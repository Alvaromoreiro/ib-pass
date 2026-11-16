
export const PAYMENT_SESSION_KEYS = {
    FARE_DATA: 'fareData',
    BOOKING_INFO: 'bookingInfo',
    VOUCHER_INFO: 'voucherInfo'
} as const;

export const DEFAULT_CONTEXT_METADATA = {
    LANGUAGE: 'es',   
    COUNTRY: 'ES',
    CURRENCY: 'EUR'
} as const;

export const DEFAULT_PHONE_TYPE = 'MOBILE' as const;
