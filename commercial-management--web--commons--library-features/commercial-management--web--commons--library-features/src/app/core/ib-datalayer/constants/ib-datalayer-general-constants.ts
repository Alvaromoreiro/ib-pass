import * as angular from "angular";

const DatalayerGeneralConstants =  {
    LANGUAGE: 'Language',
    MARKET: 'Market',
    USER_STATE: 'UserStatus',
    USER_LEVEL: 'UserLevel',
    USER_ID: 'UserID',
    ClientID: 'ClientID',
    USER_SEGMENT: 'UserSegment',
    CODE_TRACKING: 'UserCUG',
    AVIOS_COINS: 'Avios',
    USER_AVIOS: 'UserAvios',
    TOTAL_PRICE_AVIOS: 'AviosUsed',
    HASH_EMAIL: 'HashEID',
    PASSENGER_EMAIL: 'HashEBKI',
    DEEPLINK: 'Deeplink',
    PROCESS: 'Process',
    STEP: 'Step',
    QUADRIGAM: 'Quadrigam',
    CODE: 'TrackingCode',
    CURRENCY: 'Currency',
    WEB_VERSION: 'VersionWeb',
    WEB_MODE: 'ModeWeb',
    REFERENCE: 'Reference',
    VOUCHER_AMOUNT: 'VoucherAmount',
    PRODUCT: 'Product',
    ORDER_ID: 'OrderId',
    PAYMENT_METHOD: 'PaymentMethod',
    VOUCHER_CODE: 'VoucherCode',
    ORIGIN_DESTINATIONS: 'AirportSeg',
    UPG_TYPE: 'UpgType',
    BOOKING_CLASS: 'BookingClass',
    EVENT_CATEGORY: 'eventCategory',
    EVENT_ACTION: 'eventAction',
    EVENT_LABEL: 'eventLabel',
    EVENT_NAME: 'eventName',
    EVENT_NAME_INTERACTION: 'interaccion',
    CASH_AVIOS_USED: 'CashAviosUsed',
    VOUCHER_USED: 'VoucherUsed',
    VOUCHER_SHOWN: 'VoucherShown',
    INSURANCE_TYPE: 'InsuranceType',
    QUANTITY: 'Quantity',
    ROL_CIP: 'RolCIP'
};

angular
  .module("ib-datalayer-module")
  .constant("DatalayerGeneralConstants", DatalayerGeneralConstants);
export type DatalayerGeneralConstantsType = typeof DatalayerGeneralConstants;
export { DatalayerGeneralConstants };
