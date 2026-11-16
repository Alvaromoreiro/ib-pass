export enum PaymentViewType {
    NEW = 'NEW',
    OLD = 'OLD',
    EMPTY = 'EMPTY'
}
export type PaymentViewTypeValues = `${PaymentViewType}`;


export enum PaymentRealmsEnum {
    BOOKING = 'BOOKING',
    REDEMPTION = 'REDEMPTION'
}
export type PaymentRealmsEnumValues = `${PaymentRealmsEnum}`;

export enum PaymentSubRealmsEnum {
    SHUTTLE = 'SHUTTLE',
    ON_BUSINESS = 'ON_BUSINESS',
    MULTIPLE_TRIPS = 'MULTIPLE_TRIPS',
    STOP_OVER = 'STOP_OVER',
    METASEARCH = 'METASEARCH',
    ON_HOLD = 'ON_HOLD',
    DEFAULT = 'DEFAULT',
    FLASH_OFFERS = 'FLASH_OFFERS',
    ON_HOLD_CONFIRMATION = 'ON_HOLD_CONFIRMATION'
}
export type PaymentSubRealmsEnumValues = `${PaymentSubRealmsEnum}`;
