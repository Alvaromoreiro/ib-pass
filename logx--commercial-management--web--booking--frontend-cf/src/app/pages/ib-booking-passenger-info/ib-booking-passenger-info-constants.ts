import angular from 'angular';

export const IB_BOOKING_PASSENGER_INFO_CONSTANTS = {
    PASSENGER_LABEL: 'GENERAL_LABEL_PASSENGER',
    CONTACT_TAB_ACTIVE: 'contactTab',
    FORM_COMPLETED_EVENT: 'formCompleted',
    BIRTH_DATE_ERROR_CODE: 'IB_BIRTH_DATE',
    INTERNAL_ERROR_SERVER_CODE: 500,
    UNEXPECTED_TECHNICAL_EXCEPTION: 'FRAM_B0006',
    EXPIRED_ORDER_HTTP_ERROR_CODE: 410,
    CONFLICT_IN_ORDER_HTTP_ERROR_CODE: 409,
    EXPIRED_ORDER_INTERNAL_ERROR_CODE:'SSE_ORM_9122',
    CONFLICT_IN_ORDER_INTERNAL_ERROR_CODE:['SSE_ORM_9002', 'SSE_ORM_9007', 'SSE_ORM_9017', 'SSE_ORM_900702', 'SSE_ORM_9339'],
    SHOW_GENDER_TYPES: ['TITLE', 'GENDER'],
    PASSENGER_GENDERS: {
        MALE: 'MALE',
        FEMALE: 'FEMALE'
    },
    frequentFlyerCompanies: {
        iataCompanyCode: {
            IBERIA: 'IB'
        },
        airlineName: {
            IBERIA: 'Iberia'
        }
    },
    businessCodeType: [
        {
            name: 'On Business',
            code: 'OB'
        },
        {
            name: 'Business',
            code: 'C'
        }
    ],
    PASSENGER_TITLES: {
        MR: 'MR',
        MRS: 'MRS',
        MSS: 'MSS'
    },
    PHONE_TYPES: {
        HOME: 'HOME',
        BUSINESS: 'BUSINESS',
        MOBILE: 'MOBILE'
    },
    passengerTypes: {
        Default: 'DEFAULT',
        adult: 'ADULT',
        child: 'CHILD',
        infant: 'INFANT'
    },
    passengerGender: {
        MALE: 'MALE',
        FEMALE: 'FEMALE'

    },
    WARNING_MESSAGE_TITLE: 'IBAIRP_WARNING_MESSAGE_TITLE',
    ON_BUSINESS: 'ON_BUSINESS',
    CORPORATE: 'CORPORATE',
    RECOVER_USERNAME_ERRORS_DICT: {
        MANDATORY_DATA_MISSING: 'IBAIRP_RECOVER_GEN_ERROR',
        DATA_INVALID: 'IBAIRP_RECOVER_GEN_ERROR',
        CUSTOMER_NOT_FOUND: 'IBAIRP_PASSENGER_FORM_RECOVER_FORGOTTEN_USERNAME_MODAL_KO_M2_SUBTITLE',
        MULTIPLE_MEMBERS_FOUND: 'MULTIPLE_MEMBERS_FOUND',
        SECURITY_PROFILE_NOT_FOUND: 'IBAIRP_RECOVER_GEN_ERROR',
        PROFILE_REMINDER_EVENT_NOT_TRIGGERED: 'IBAIRP_RECOVER_GEN_ERROR',
        DEFAULT_ERROR: 'IBAIRP_RECOVER_CON_ERROR'
    },
    WHEEL_CHAIR_CODES: {
        '01': 'WCHC',
        '02': 'WCHR',
        '03': 'WCHS',
        WCHC: '01',
        WCHR: '02',
        WCHS: '03',
        '': '00',
        DEFAULT: '00'
    },
    SAVE_MODAL_LITERALS: {
        title: 'SAVE_CHANGES',
        body: 'SURE_CHANGES',
        accept: 'SAVE_CHANGE',
        cancel: 'DONT_SAVE'
    },
    SAVE_MODAL_LITERALS_IBZERO: {
        title: 'SAVE_CHANGES',
        body: 'SURE_CHANGES_IBZERO',
        accept: 'SAVE_CHANGE',
        cancel: 'DONT_SAVE'
    },
    SAVE_ACCEPT_LITERALS: {
        title: 'SAVE_CHANGES',
        message: 'SAVED_CORRECTLY'
    },
    SAVE_ERROR_LITERALS_IBP: {
        title: 'CANT_SAVE_CHANGES_IBPLUS',
        message: 'EDIT_ON_PRIVATE_AREA'
    },
    SAVE_ERROR_LITERALS_ZERO: {
        title: 'CANT_SAVE_CHANGES_IBZERO',
        message: 'EDIT_ON_PRIVATE_AREA'
    },
    MODAL_TITLE_ERROR: 'INCORRECT_DATA',
    NATIONALITY_ID_DOC: 'Nationality ID',
    DOCUMENT_MAP: {
        NATIONALITY_ID: 'DN',
        NIE: 'TR',
        NI_DOCUMENT: 'NI',
        PASSPORT: 'PP'
    },
    NIE_FORMAT: /^[XYZxyz][0-9]{7,8}[A-Za-z]$/
} as const;
    
angular.module('ib-booking-passenger-info-module', []).constant('BookingPassengerInfoConstants', IB_BOOKING_PASSENGER_INFO_CONSTANTS);

