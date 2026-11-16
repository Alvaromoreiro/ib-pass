export enum PaymentViewType {
    NEW = 'new',
    OLD = 'old',
    OLDVC = 'oldvc',
    EMPTY = 'empty'
}

export enum PAYMENT_REALMS {
    MMB = 'MANAGE_MY_BOOKING'
}

export enum PAYMENT_SUB_REALMS {
    ANCILLARIES = 'ANCILLARIES',
    ON_HOLD = 'ON_HOLD',
    CHANGE_FLIGHT = 'CHANGE_FLIGHT',
    BIDS = 'BIDS',
    DEFAULT = 'DEFAULT'
}

export enum OnErrorEventStatus {
    FAILED_PAYMENT = 'FAILED_PAYMENT',
    UNAUTHORIZED = 'UNAUTHORIZED',
    UNKNOWN = 'UNKNOWN',
    EXCEED_ATTEMPS = 'EXCEED_ATTEMPS',
    DENIED_FRAUD = 'DENIED_FRAUD'
}
