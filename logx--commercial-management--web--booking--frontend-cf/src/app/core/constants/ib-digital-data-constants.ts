export enum DigitalDataConstants {
    AVIOS_COINS = 'Avios',
    BOOKING_CLASS = 'BookingClass',
    CASH_AVIOS_USED = 'CashAviosUsed',
    ClientID = 'ClientID',
    CODE = 'TrackingCode',
    CODE_TRACKING = 'UserCUG',
    CURRENCY = 'Currency',
    DEEPLINK = 'Deeplink',
    EVENT_ACTION = 'eventAction',
    EVENT_CATEGORY = 'eventCategory',
    EVENT_LABEL = 'eventLabel',
    EVENT_NAME = 'eventName',
    EVENT_NAME_INTERACTION = 'interaccion',
    HASH_EMAIL = 'HashEID',
    INSURANCE_TYPE = 'InsuranceType',
    LANGUAGE = 'Language',
    MARKET = 'Market',
    ORDER_ID = 'OrderId',
    ORIGIN_DESTINATIONS = 'AirportSeg',
    PASSENGER_EMAIL = 'HashEBKI',
    PAYMENT_METHOD = 'PaymentMethod',
    PROCESS = 'Process',
    PRODUCT = 'Product',
    QUADRIGAM = 'Quadrigam',
    QUANTITY = 'Quantity',
    REFERENCE = 'Reference',
    ROL_CIP = 'RolCIP',
    STEP = 'Step',
    TOTAL_PRICE = 'TotalPrice',
    TOTAL_PRICE_AVIOS = 'AviosUsed',
    TOTAL_PRICE_WITHOUT_TAXES = 'TotalPriceWithoutTaxes',
    UPG_TYPE = 'UpgType',
    USER_AVIOS = 'UserAvios',
    USER_ID = 'UserID',
    USER_LEVEL = 'UserLevel',
    USER_SEGMENT = 'UserSegment',
    USER_STATE = 'UserStatus',
    VOUCHER_AMOUNT = 'VoucherAmount',
    VOUCHER_CODE = 'VoucherCode',
    VOUCHER_SHOWN = 'VoucherShown',
    VOUCHER_USED = 'VoucherUsed',
    WEB_MODE = 'ModeWeb',
    WEB_VERSION = 'VersionWeb',
    PREVIOUS_PAGE = 'PreviousPage',
    NVIEW = 'NView'
}

export enum DigitalDataValues {
    YES = 'SI',
    NO = 'NO',
    YES_LOWERCASE = 'si',
    NO_LOWERCASE = 'no',
    WEB_VERSION = 'angularjs'
}

export enum DigitalDataProcess {
    BOOKING = 'booking',
    BOOKING_OB = 'booking OB obtencion',
    BOOKING_OB_REDEMPTION = 'booking OB redencion',
    BOOKING_SLICED = 'booking slice by slice',
    FLASH_OFFERS = 'flashOffers',
    HMAD_STOP_OVER = 'hola madrid',
    METASEARCH = 'metabuscadores',
    MULTI_TRIP = 'multiples trayectos',
    ON_HOLD = 'reserva onhold',
    REDEMPTION = 'redencion',
    SHUTTLE = 'puente aereo',
    SHUTTLE_REDEPMTION = 'puente aereo redencion',
    ONHOLD_CONFIRMATION = 'confirmacion onhold',
    PETS = 'booking pet'
}

export enum DigitalDataSteps {
    ALP = 'coche_hotel',
    ANCILLARIES = 'ancillaries',
    CONFIRMATION = 'confirmacion',
    DISPO = 'disponibilidad',
    DISPO_CALENDAR = 'calendarioDisponibilidad',
    FARE = 'disponibilidad',
    ONHOLD_CONF_RECOVERY = 'recuperacion',
    ONHOLD_CONF_CANCEL = 'cancelacion',
    ONHOLD_CONF_PAYMENT = 'pago',
    ONHOLD_CONF_CONFIRMATION = 'confirmacion',
    ONHOLD_CONFIRMATION = 'confirmacion onhold',
    ONHOLD_PAYMENT = 'pago onhold',
    PASSENGERS = 'pasajeros',
    PAYMENTS = 'pago',
    RECAP = 'resumen'
}

export enum DigitalDataEcommerceEvents {
    ADD_PMT_INFO = 'add_payment_info'
}

export enum DigitalDataEvents {
    EVENT_ACTION = 'eventAction',
    EVENT_CATEGORY = 'eventCategory',
    EVENT_LABEL = 'eventLabel',
    EVENT_NAME = 'eventName',
    EVENT_NAME_INTERACTION = 'interaccion',
    EVENT_CATEGORY_BREADCRUMBS = 'breadcrumbs',
    EVENT_ACTION_CLIC = 'clic',
    EVENT_ACTION_BACK = 'retroceder',
    EVENT_ACTION_STAY = 'permanecer'
}

export const DigitalDataStepsPaths = {
    availability: DigitalDataSteps.DISPO,
    ibpbah: DigitalDataSteps.ALP,
    ibairp: DigitalDataSteps.PASSENGERS,
    ibcmtv: DigitalDataSteps.ANCILLARIES,
    ibpurc: DigitalDataSteps.PAYMENTS,
    confirmation: DigitalDataSteps.CONFIRMATION,
    ibshuttle: DigitalDataProcess.SHUTTLE,
    flightsRecap: DigitalDataSteps.RECAP,
    ohmtdt: DigitalDataSteps.ONHOLD_CONFIRMATION
};
