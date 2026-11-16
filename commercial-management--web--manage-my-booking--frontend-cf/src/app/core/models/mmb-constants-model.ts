export interface MmBAppConstantsType {
    production: boolean;
    lang: string;
    market: boolean;
    TOGGLE: activeToogle;
    COOKIES: COOKIES;
    iconsRoute: string;
    airlinesLogoBaseRoute: string;
    DESTINATION_IMAGE_SIZE: DESTINATION_IMAGE_SIZE;
    defaultAirlineLogo: string;
    ANCILLARIES_IMPORT_ORDER_TYPE:  ANCILLARIES_IMPORT_ORDER_TYPE
};

type activeToogle = {
    isActiveVoucherMmb: boolean;
    isActiveAviosMmb: boolean;
    isSoftUserHideEnabled: boolean;
    isActiveOrderHandler: boolean;
    isActiveDeinvoicing: boolean;
    isActiveUmnr: boolean;
}

type COOKIES = {
    PERSONALIZATION: string,
    LOGGED_TOKEN: string,
    LOGGED_TOKEN_EXPIRATION: string,
    LOGGED_REFRESH_TOKEN: string,
    LOGGED_REFRESH_TOKEN_EXPIRATION: string,
    CHECKIN_ID: string,
    BOOKING_INFO: string,
    DYNAMIC_PRICING: string,
    AIR_SHUTTLE_ERROR: string,
    DEFAULT_EXPIRY_TIME: number,
    DEFAULT_PATH: string,
    OLD_COOKIE: string,
    MARKETING_PERMISSION_EXPIRY_TIME: number,
    MARKETING_PERMISSION_TEST_EXPIRY_TIME: number,
    NO_MARKETING_PERMISSION: string,
}

type DESTINATION_IMAGE_SIZE = {
    desktop: string;
    tablet: string;
    mobile: string;
}

type ANCILLARIES_IMPORT_ORDER_TYPE = {
    BAGGAGE: string;
    SEAT: string;
    SPEQS: string;
    PRIORITY_BOARDING: string;
}