import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const servicesURI: string = envCopy.services;
const SERVICE_CLOUD: string = envCopy.cloud;
//@ts-ignore
const _  = window._;
const CommonsConstants = {
    lang: 'es',
    market: 'ES',
    timeWait: 2000,
    numAttemps: 3,
    passengerTypes: {
        Default: 'DEFAULT',
        senior: 'SENIOR',
        adult: 'ADULT',
        young: 'YOUTH',
        child: 'CHILD',
        infant: 'INFANT',
        SPECIAL_NEEDS: 'specialNeed'
    },
    commonsPatterns: {
        DATE_PATTERN_ES:
                '^(?:(?:0[1-9]|1\\d|2[0-8])/(?:0[1-9]|1[0-2])|(?:(?:29|30|31)/(?:0[13578]|1[02]))|(?:29|30)/(?:(?:0[469]|11)))/(?:19|20|21)\\d{2}$|^(?:29[/]02[/](?:19|20|21)(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))$',
        DATE_PATTERN_EN:
                '^(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1\\d|2[0-8])|(?:0[13578]|1[02])/(?:(?:29|30|31))|(?:(?:0[469]|11))/(?:29|30))/(?:19|20|21)\\d{2}$|^(?:02[/]29[/](?:19|20|21)(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))$',
        PRE_PROCESSOR_HREF: /href='#'/g,
        PRE_PROCESSOR_TARGET: /target='_blank'/g,
        PRE_PROCESSOR_A: /<a\b/g,
        PRE_PROCESSOR_SERVICES_HREF: /^#/,
        ERROR_PATTERN_WITH_PROPERTIES: /^property:.*\|.?error:.+$/,
        ERROR_PATTERN_HTTP_UTILS_ERROR: /^property:.+\|error:.+$/,
        CURRENCY_GET_NEW_CURRENCY: /\u00A4/g,
        MAC_DEVICE: /(iPhone)|(iPad)|(iPod)/i,
        INTEGER: /\d/,
        BAR: /\//,
        BLANKSPACE: /Backspace/,
        DELETE: /Delete/,
        ARROW_LEFT: /ArrowLeft/,
        ARROW_RIGHT: /ArrowRight/,
        LETTERS: /[A-zÀ-ÿ]/,
        ALPHANUMERIC_PATTERN: /^[a-zA-Z0-9\s]+$/,
        ALPHANUMERIC_CLEANER: '[*¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£]',
        ALPHANUMERIC_STRICT_CLEANER: '[^a-zA-Z0-9\\s]',
        NAME_SURNAME_PATTERN: /^([a-zA-Z'\- ÀàáâÂãÃäÄåÅæÆçÇèÈéÉêÊëËìÌíÍîÎïÏðÐñÑòÒóÓôÔõÕöÖøØùÙúÚûÛüÜýÝþÞÿß])*$/,
        NAME_SURNAME_CLEANER: '[0-9*¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£Á]',
        EMAIL_PATTERN: '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}',
        PHONE_PATTERN: /^\d{6,}$/,
        PHONE_CLEANER: '\\D+',
        DOCS_PATTERN: /^(?!.*[¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        PRICE_INTEGER: /^([0-9])*$/
    },
    FIELD_LENGTH: {
        MAX_LENGTH_REDRESSNUMBER: 15,
        MAX_LENGTH_NAME: 20,
        MAX_LENGTH_SURNAME: 26,
        MAX_LENGTH_EMAIL: 60,
        MIN_LENGTH_EMAIL: 9,
        MAX_LENGTH_FIRST_SURNAME: 39,
        MAX_LENGTH_LAST_SURNAME: 19,
        MAX_LENGTH_SURNAMES: 60,
        MAX_LENGTH_IBERIA_CARD: 8,
        MAX_LENGTH_OTHER_FREQUENTFLYER_CARD: 20,
        MAX_LENGTH_DNI: 9,
        MAX_LENGTH_MANDATORY_DOC: 20,
        MAX_LENGTH_ZIP_CODE: 10,
        MAX_LENGTH_ZIP_CODE_SPANISH: 5,
        MAX_LENGTH_PIN: 6,
        MAX_LENGTH_PASSWORD: 20,
        MIN_LENGTH_PASSWORD: 8,
        MIN_LENGTH_PHONE: 9,
        MAX_LENGTH_PHONE: 15,
        MAX_LENGTH_STREET: 40,
        MAX_LENGTH_APARTMENT: 5,
        MAX_LENGTH_ADDITIONAL_INFO: 16,
        MAX_LENGTH_CITY: 30
    },
    BOOKINGERRORSSERVICE: {
        SERVICEGENERALERROR: 'REST_SERVICE_ERROR_GENERAL',
        LOGGED_ERROR_TITLE: 'GENERAL_ADVICE_TITLE',
        LOGGED_ERROR_BODY: 'GENERAL_LOGGED_ERROR_BODY',
        LOGGED_ERROR_BODY_ZERO: 'ERROR_LOGGED_MODAL_IB_ZERO',
        JSON_MAPPING_EXCEPTION: 'JSON_MAPPING_EXCEPTION',
        UNEXPECTED_TECHNICAL_EXCEPTION: 'UNEXPECTED_TECHNICAL_EXCEPTION',
        FARE_NOT_FOUND: 'fare not found',
        LOGIN_ERROR_606: 'ERROR_SSO_606',
        LOGIN_ERROR_GENERIC_INVALID: 'IB_GENERIC_INVALID_MAIL_OR_PASSWORD',
        LOGIN_MAIL_ERROR: 'LOGIN_MAIL_ERROR',
        ERROR_USER_REDEMPTION_ENABLE: 'ERROR_USER_REDEMPTION_ENABLE',
        PAC_UTILS_E0001: 'com.ib.framework.error.PAC_UTILS_E0001'
    },
    LOGIN_ONB: 'ONB',
    ignoreOrderServiceURI: 'order/ignore',
    DEFAULT_ENDPOINTS: {
        ignoreOrderServiceURI: servicesURI + '/sse-orm/rs/v2/order/ignore',
        keepAliveServiceURI: servicesURI + '/sse-orm/rs/v2/mmb/{flowId}/keep-alive/',
        closeSessionURI: servicesURI + '/pac-prm/rs/checkin/v2',
        statesList: servicesURI + '/rdu-loc/rs/loc/v1/location/{country}/states',
        keepAliveGiftCardServiceURI: servicesURI + '/orm-ors/rs/v1/giftcard/keepAlive/{flowId}',
        keepAliveGiftCardsServiceURICloud: SERVICE_CLOUD + '/v1/voucher/{flowId}/keepAlive',
        keepAliveSubscriptionModelsServiceURI: SERVICE_CLOUD + '/v1/voucher/{flowId}/keepAlive',
        keepAliveOrmServiceURI: servicesURI + '/sse-orm/rs/v3/keepAlive/'
    },
    CABIN_TYPES: [
        {
            code: 'R',
            description: 'HEADER_ADVANCED_SEARCH_CABINS_ECONOMY',
            cabinClass: 'ECONOMY'
        },
        {
            code: 'N',
            description: 'HEADER_ADVANCED_SEARCH_CABINS_PREMIUM',
            cabinClass: 'PREMIUMTOURIST'
        },
        {
            code: 'B',
            description: 'HEADER_ADVANCED_SEARCH_CABINS_BUSINESS',
            cabinClass: 'BUSINESS'
        }
    ],
    DISCOUNT_SEARCH_RESIDENT: {
        type: 'HEADER_ADVANCED_SEARCH_RESIDENT',
        name: 'resident',
        subname: 'largeFamilyType',
        items: [
            {
                description: 'HEADER_ADVANCED_SEARCH_NO_RESIDENT',
                value: ''
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                value: 'RC'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                value: 'DC'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                value: 'BP'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                value: 'BI'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_MELILLA',
                value: 'RM'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CEUTA',
                value: 'RE'
            }
        ]
    },
    DISCOUNT_SEARCH_FAMILY: {
        type: 'HEADER_ADVANCED_SEARCH_FAMILIA_NUM',
        name: 'family',
        items: [
            {
                description: 'HEADER_ADVANCED_SEARCH_NO_FAMILY',
                value: ''
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_FAMILY_GENERAL',
                value: 'F1'
            },
            {
                description: 'HEADER_ADVANCED_SEARCH_FAMILY_SPECIAL',
                value: 'F2'
            }
        ]
    },
    COOKIES: {
        PERSONALIZATION: 'IBERIACOM_PERSONALIZATION',
        WCS_USER_TYPE: 'IBERIACOM_SSO_TYPE',
        GDR_PA_INFO: 'IBERIACOM_GDR_PA_INFO',
        DEFAULT_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 365 * 10, //ten years
        DEFAULT_PATH: '/',
        DEFAULT_DOMAIN: 'www.iberia.com',
        IBERIACOM_LAST_SEARCH: {
            NAME: 'IBERIACOM_LAST_SEARCH',
            PARAMS: {
                ORIGIN: 0,
                DATES: [2, 3, 4, 5, 6, 7]
            }
        },
        DYNAMIC_PRICING: 'DP',
        IBERIACOM_SSO_INFO: 'IBERIACOM_SSO_INFO'
    },
    ACCOUNT_TYPES: {
        LOAN: 'LOAN',
        RECOGNITION: 'RECOGNITION',
        REWARD: 'REWARD',
        TOTAL_REWARD: 'TOTAL_REWARD'
    },
    COMMONS_LOGIN_INVALID_GRANT_VALUE: {
        BP: 'invalid_grant_BP',
        BT: 'invalid_grant_BT',
        EXPIRE_PASSWORD: 'invalid_grant_expired_password',
        INVALID_GRANT: 'invalid_grant',
        INVALID_GRANT_EMAIL: 'invalid_grant_mail'
    },
    CODE412: 412,
    REDIRECTION: {
        IBREDNM: '/ibrednm'
    },
    LOCAL_STORAGE_KEYS: {
        NEW_MARKET_INFO: 'newMarketInfo'
    },
    INTERNAL_ERROR_CODE: {
        BOOKING_MARKET_CHANGE: 'SSE_AVM_BOOKING_MARKET_CHANGE',
        CKI_FLIGHT_INFO_PASSENGER_NOT_FOUND: 'CUST_BIO_0001',
        CKI_FLIGHT_INFO_EXPIRED_DOC: 'CUST_BIO_0003',
        CKI_RESERVATION_HAS_NO_FEATURE_FLIGHTS: 'PAC_PRM_9021',
        CKI_NOT_RETRIEVE_RESERVATION: 'PAC_PRM_9024',
        CKI_NEWSLETTER_10000: 'NWL_10000',
        CKI_NEWSLETTER_10001: 'NWL_10001',
        CKI_PAYMENT_METHODS: 'PMT_PPM_9009',
        MEMBERS_SERVICE_ERROR: 'PRLM_MBM_1007'
    },
    AENA_BIOMETRICS_ERROR_CODE:{
        EXPIRED_DOCUMENT: 'BIO_AENA_0004',
        DOCUMENT_NOT_MATCH: 'BIO_AENA_0008'
    },
    PAYMENT_STATUS_CODE: {
        STATUS_PAYMENT_ISSUE_OK: 'STATUS_PAYMENT_ISSUE_OK',
        STATUS_PAYMENT_ISSUE_KO: 'STATUS_PAYMENT_ISSUE_KO'
    },
    UICOMPONENT: {
        UI_FLIGHT_CARD: {
            NEW_FLIGHT: 'newFlight'
        }
    },
    FARE_ICON: {
        CABINA: {
            CASE: 'CABINA',
            TYPE: 'icon-navegador_avion'
        },
        EQMANO: {
            CASE: 'EQMANO',
            TYPE: 'icon-e_equipaje'
        },
        EQBODEGA: {
            CASE: 'EQBODEGA',
            TYPE: 'icon-e_equipaje_facturado'
        },
        ASIENTO: {
            CASE: 'ASIENTO',
            TYPE: 'icon-asiento'
        },
        ASIENTO24H: {
            CASE: 'ASIENTO24H',
            TYPE: 'icon-asiento'
        },
        ASIENTOXL: {
            CASE: 'ASIENTOXL',
            TYPE: 'icon-asiento-plus'
        },
        CAMBIO: {
            CASE: 'CAMBIO',
            TYPE: 'icon-cambios_y_reembolsos'
        },
        REEMBOLSO: {
            CASE: 'REEMBOLSO',
            TYPE: 'icon-reembolsos'
        },
        CHECKINDESK: {
            CASE: 'CHECKINDESK',
            TYPE: 'icon-check_in'
        },
        SALAVIP: {
            CASE: 'SALAVIP',
            TYPE: 'icon-sala_vip'
        },
        FASTTRACK: {
            CASE: 'FASTTRACK',
            TYPE: 'icon-fast_track'
        },
        TARJEMBANTIC: {
            CASE: 'TARJEMBANTIC',
            TYPE: 'icon-tarjeta_de_embarque'
        },
        EQPPRIOR: {
            CASE: 'EQPPRIOR',
            TYPE: 'icon-e_facturacion_prioritaria'
        },
        COMIDA: {
            CASE: 'COMIDA',
            TYPE: 'icon-c_comidas_nuevas'
        },
        EMBARQUE: {
            CASE: 'EMBARQUE',
            TYPE: 'icon-priority-boarding'
        },
        AEROPUERTO: {
            CASE: 'AEROPUERTO',
            TYPE: 'icon-canary-plus'
        },
        AVIOSPLUS: {
            CASE: 'AVIOSPLUS',
            TYPE: 'icon-avios'
        },
        PUNTUALIDAD: {
            CASE: 'PUNTUALIDAD',
            TYPE: 'icon-utilizacion_avios'
        },
        FASTLANE: {
            CASE: 'FASTLANE',
            TYPE: 'icon-fast_track'
        }
    },
    APP: {
        CKI: {
            NAME: 'CKI',
            WAITING_TIME_SESSION: 8,
            WAITING_TIME: 2,
            QUADRIGAM: {
                IBCOSE: '/ibcose',
                IBCOSE2: '/ibcose2',
                IBCOCF_IBECCF: '/ibcocf-and-ibeccf',
                IBCKIPURC: '/ibpurc'
            }
        },
        GIFTCARD: {
            NAME: 'GIFTCARDS',
            WAITING_TIME_SESSION: 12.5,
            WAITING_TIME: 2,
            QUADRIGAM: {
                CONFIGURATION: '/configuration'
            }
        },
        SUBSCRIPTIONMODELS: {
            NAME: 'SUBSCRIPTIONMODELS',
            WAITING_TIME_SESSION: 12.5,
            WAITING_TIME: 2,
            QUADRIGAM: {
                CONFIGURATION: '/configuration'
            }
        }
    },
    TELECOM_ADDRESSES: {
        TYPE: {
            PERSONAL: 'PERSONAL'
        },
        DEVICE_TYPE: {
            PHONE: 'PHONE',
            MOBILE: 'MOBILE'
        }
    },
    DAYS_ARRAY: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31'
    ],
    MONTH_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    DEFAULT_TO_YEARS: 100,
    PMT_DEFAULT_TO_YEARS: 11,
    DEFAULT_FROM_YEARS: 0,
    DEFAULT_OPTIONS: {
        haveBirthdate: false
    },
    TYPE_DOCUMENT: [
        {
            name: 'PASSPORT',
            id: '05'
        },
        {
            name: 'UPPERCASE_DNI',
            id: '02'
        }
    ],
    GENDER_ARRAY: [
        {
            name: 'GENDER_MALE',
            id: 'Male'
        },
        {
            name: 'GENDER_FEMALE',
            id: 'Female'
        }
    ],
    RESIDENT_AREAS: [
        { code: '2', residenceType: 'RC', description: 'Canarias' },
        { code: '3', residenceType: 'BP', description: 'Baleares' },
        { code: '4', residenceType: 'RM', description: 'Melilla' },
        { code: '5', residenceType: 'RE', description: 'Ceuta' }
    ],
    LARGE_FAMILY_TYPES: [
        { code: 'F1', name: 'GENERAL' },
        { code: 'F2', name: 'ESPECIAL' }
    ],
    SELECT_AN_OPTION_WITH_CODE_DESCRIPTION: {
        code: 'SELECT_AN_OPTION',
        description: 'SELECT_AN_OPTION'
    },
    SELECT_AN_OPTION_WITH_CODE_NAME: {
        code: 'SELECT_AN_OPTION',
        name: 'SELECT_AN_OPTION'
    },
    SELECT_AN_OPTION_WITH_ID_VALUE: {
        id: 'SELECT_AN_OPTION',
        value: 'SELECT_AN_OPTION'
    },
    APP_TYPES: {
        BOOKING: 'BBKI',
        MANAGEMYBOOKING: 'MMB',
        MANAGEMYBOOKING_ONHOLD: 'MMBOH',
        MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
        MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
        MANAGEMYBOOKING_BIDS: 'MMBBID',
        ONHOLD: 'BBKIOH',
        CHECKIN: 'CKI',
        SHUTTLE_OPEN: 'PAOB',
        SHUTTLE_OPEN_ONB: 'PAOBONB',
        SHUTTLE_REDEMPTION: 'PARE',
        SHUTTLE_REDEMPTION_ONB: 'PAREONB',
        GIFTCARDS: 'GIFTCARDS',
        SUBSCRIPTIONMODELS: 'SUBSCRIPTIONMODELS'
    },
    REALM_TYPES: {
        BBKI: {
            realm: 'Booking'
        },
        MMB: {
            realm: 'ManageMyBooking'
        },
        MMBOH: {
            realm: 'ManageMyBooking',
            subrealm: 'ONHOLD_CONFIRMATION'
        },
        MMBANC: {
            realm: 'ManageMyBooking',
            subrealm: 'ANCILLARIES_PURCHASE'
        },
        MMBVC: {
            realm: 'FLIGHT_CHANGE',
            subrealm: 'FLIGHT_CHANGE'
        },
        MMBBID: {
            realm: 'ManageMyBooking',
            subrealm: 'UPGRADING_BID'
        },
        MMBUNIF: {
            realm: 'ManageMyBooking',
            subrealm: 'UPGRADING_BID'
        },
        BBKIOH: {
            realm: 'Booking'
        },
        CKI: {
            realm: 'Checkin'
        },
        PAOB: {
            realm: 'Booking',
            subrealm: 'SHUTTLE'
        },
        PAOBONB: {
            realm: 'Booking',
            subrealm: 'SHUTTLE'
        },
        PARE: {
            realm: 'REDEMPTION',
            subrealm: 'SHUTTLE'
        },
        PAREONB: {
            realm: 'REDEMPTION',
            subrealm: 'SHUTTLE'
        },
        GIFTCARDS: {
            realm: 'GIFTCARD'
        },
        SUBSCRIPTIONMODELS: {
            realm: 'SUBSCRIPTIONMODELS'
        }
    },
    STEP_FLOW: {
        PAYMENT: 'ibpurc',
        ANCILLARIES: 'ibcmtv'
    },
    LIGHTBOX: {
        INNERWIDTH: 768
    },
    ROLE_CARD_PAT: 'ROLE_IBCARD_',
    ROLE_IBERIA: 'ROLE_MEMBER_ZERO',
    ROLE_IBERIA_PLUS: 'ROLE_IBERIA_PLUS',
    AVAILABLE_PROGRAMME_ID: ['IBP', 'BAEC', 'EIC', 'VYC', 'ATRP'],
    nameParameters: {
        lang: ['language'],
        market: ['market']
    },
    availableLanguages: ['en', 'es', 'ls', 'zh', 'ca', 'de', 'fr', 'it', 'pt', 'ja', 'nl', 'ru'],
    defaultLang: 'es',
    defaultMarket: 'ES',
    DEFAULT_SEPARATOR: '.',
    LARGE: 'large',
    PASSENGER_TYPES: {
        DEFAULT: 'DEFAULT',
        SENIOR: 'SENIOR',
        ADULT: 'ADULT',
        YOUTH: 'YOUTH',
        YOUNG: 'YOUNG',
        CHILD: 'CHILD',
        INFANT: 'INFANT',
        SPECIAL_NEEDS: 'SPECIAL_NEEDS'
    },
    DISCOUNT_TYPE: {
        RESIDENT: 'RES',
        LARGE_FAMILY: 'LGF',
        DUMBO: 'DUMBO',
        PLUTO: 'PLUTO',
        PARTNER: 'PARTNER',
        DYNAMIC_PRICING: 'DYNAMIC_PRICING',
        CORPORATE: 'CORPORATE'
    },
    RESIDENT_CODE: {
        CANARIAS: 'RC',
        BALEARES: 'BP',
        MELILLA: 'RM',
        CEUTA: 'BC'
    },
    RESIDENT_DISCOUNT_TYPE: {
        CANARIAS: 'CANARIAS',
        BALEARES: 'BALEARES',
        MELILLA: 'MELILLA',
        CEUTA: 'CEUTA'
    },
    LARGE_FAMILY_CODE: {
        GENERAL: 'F1',
        SPECIAL: 'F2'
    },
    LARGE_FAMILY_TYPE: {
        GENERAL: 'GENERAL',
        SPECIAL: 'SPECIAL'
    },
    TRIPS_OPTION_SELECTED: {
        ONE: 1,
        TWO: 2,
        ZERO: 0
    },
    BKI_URL: {
        FLASH: 'FLASH',
        BKI: 'BKI'
    },
    BKI_URL_PATH_NAME: {
        FLASH: 'flights/'
    },
    BKI_URL_MODEL_EMPTY: {
        modeWeb: null,
        searchOrigin: '',
        tripType: 0,
        senior: null,
        adult: 1,
        young: null,
        teenager: null,
        child: null,
        infant: null,
        resident: null,
        largeFamilyType: null,
        flexDates: false,
        preferredCabin: '',
        payWithAvios: null,
        payWithPoints: null,
        ibGroup: null,
        referralId: null,
        displayedPrice: null,
        slices: [],
        userCurrency: null,
        priceCurrency: null,
        numTrips: null,
        originDestinations: [],
        bookingCode1: null,
        backToUrl: null,
        codeTracking: null,
        travelAgent: null,
        fromMarket: null,
        fromLanguage: null
    },
    BKI_NEW_REQUEST_MODEL_EMPTY: {
        slices: [],
        passengers: [],
        preferredCabin: '',
        marketCode: ''
    },
    APP_GENERAL_ROUTE: '/iberia-web-content/links/general',
    APP_ROUTES: {
        MMB: '/iberia-web-content/links/manage-my-booking',
        CKI: '/iberia-web-content/links/checkin',
        IBP: '/iberia-web-content/links/iberia-plus',
        BKI: '/iberia-web-content/links/booking',
        BCA: '/iberia-web-content/links/baggage-calculator',
        ACA: '/iberia-web-content/links/avios-calculator',
        SM: '/iberia-web-content/links/flash-offer'
    },
    LONG_COINS_MARKETS: ['DZD', 'ARS', 'BRL', 'CLP', 'CNY', 'COP', 'CRC', 'GTQ', 'XAF', 'JPY', 'DIR', 'MXN', 'DOP', 'FCFA', 'RUB'],
    PHONES_LIST: {
        NORMAL: 'RESERVAS',
        HOLIDAYS: 'ATTBAH'
    },
    BANNERS_IMAGES: {
        FLASH_DEFAULT_BANNER_URL:'/wcs/imagenes/destinos/flashoffers/herobanner_flashoffer_detalle_ZZZ.jpg',
        FLASH_DEFAULT_CAROUSEL_URL:'/wcs/imagenes/destinos/flashoffers/herobanner_flashoffer_principal_ZZZ.jpg'
    },
    CARDS_IMAGES: {
        FLASH_DEFAULT_CARD_URL: '/wcs/imagenes/destinos/calculadoraAvios/DEFAULT3_958_332.jpg'
    },
    BOOKING_PARAMS_NAMES: {
        MARKET: ['MARKET'],
        ORIGIN: ['Origin', 'BEGIN_CITY_0'],
        DESTINATION: ['Destination', 'END_CITY_0'],
        SENIOR: ['YCD'],
        ADULT: ['Adult', 'ADT'],
        CHILD: ['Child', 'CHD', 'Infant'],
        INFANT: ['InfantLap', 'INF'],
        YOUNG: ['YTH'],
        TEENAGER: ['BNN'],
        RESIDENT: ['RESIDENT'],
        LARGE_FAMILY_TYPE: ['LARGE_FAMILY_TYPE'],
        FLASH_OFFER_ID: ['FLASH_OFFER_ID'],
        FLASH_OFFER_TYPE: ['FLASH_OFFER_TYPE'],
        IS_FLASH_OFFER: ['flashOffer'],
        BEGIN_CITY: ['BEGIN_CITY_01'],
        END_CITY: ['END_CITY_01'],
        TRIP_TYPE: ['TRIP_TYPE'],
        REFERRAL_ID: ['REFERRAL_ID'],
        FARE_TYPE: ['FARE_TYPE'],
        PETS: ['isPetFlight']
    },
    ORIGIN_COMPONENT: {
        IB_UI_BANNER: 'ib_ui_banner',
        IB_UI_BOX_CARD: 'ib_ui_box_card'
    },
    QUADRIGAM:{
        MODAL_SELECT_SEAT: 'MOSEAT',
        MODAL_SELECT_BAGG: 'MOBAGG',
        MODAL_ADD_CONTACT: 'MOCONT',
        MODAL_INF_SPECIAL_MEAL: 'MOMEAL',
        MODAL_SELECT_PRIO: 'MOPRIO',
        MODAL_SELECT_INS: 'MODINS',
        MODAL_SPEQS: 'MOLUGG',
        MODAL_BIDS: 'MOUPG',
        MODAL_BOB: 'MODBOB',
        MODAL_SELECT_BAGGAGE_EXTRA: 'MODBAG',
        MODAL_SELECT_SPEQS: 'MOLUGG',
        MODAL_SELECT_FLEX: 'MOFLEX',
        MODAL_SELECT_BOB: 'MODBOB',
        MODAL_SELECT_UPGRADING: 'MOUPG',
        MODAL_SELECT_MEALS: 'MOMEAL',
        MOD_SPECIAL_MEAL: 'MODMEA'
    },
    TYPE_SEARCH: {
        PREMIUM_CABIN: 'cabinasPremium',
        LOW_COST: 'tarifaMasEconomica',
        FLEXIBLE: 'tarifaFlexible',
        TURIST: 'turista'
    },
    TYPE_SEARCH_DIGITAL_DATA: {
        PREMIUM_CABIN: 'Cabinas premium',
        LOW_COST: 'Tarifa mas economica',
        FLEXIBLE: 'Tarifas flexibles',
        TURIST: 'Turista'
    },
    PROCESS: {
        BOOKING: 'booking',
        REDEMPTION: 'redencion',
        METASEARCH: 'metabuscadores',
        MULTI_TRIP: 'multiples trayectos',
        SHUTTLE: 'puente aereo',
        SHUTTLE_REDEPMTION: 'puente aereo redencion',
        BOOKING_OB: 'booking OB obtencion',
        BOOKING_OB_REDEMPTION: 'booking OB redencion',
        FLASH_OFFERS: 'flashOffers',
        HMAD_STOP_OVER:'hola madrid',
        ON_HOLD: 'reserva onhold',
        BOOKING_SLICED: 'booking slice by slice',
        PETS: 'booking pet'
    },
    FARE_FAMILY_ICON_PROPERTY_CODE: {
        EQMANO: 'icon-e_equipaje',
        EQBODEGA: 'icon-e_equipaje_facturado',
        ASIENTO: 'icon-asiento-normal',
        ASIENTOXL: 'icon-asiento-plus',
        ASIENTODELANTERO: 'icon-asiento-delantero',
        ASIENTOPREFERENTE: 'icon-asiento-plus',
        CAMBIO: 'icon-cambios_y_reembolsos',
        REEMBOLSO: 'icon-reembolsos',
        CHECKINDESK: 'icon-check_in',
        SALAVIP: 'icon-sala_vip',
        FASTTRACK: 'icon-fast_track',
        EMBARQUE: 'icon-priority-boarding',
        EQPPRIOR: 'icon-e_facturacion_prioritaria',
        COMIDA: 'icon-c_comidas_nuevas',
        WIFI: 'icon-wifi',
        CABINA: 'icon-navegador_avion',
        AVIO: 'icon-avios',
        TARJEMBANTIC: 'icon-tarjeta_de_embarque',
        CODECAMBIO: 'CAMBIO',
        CODENOCAMBIO: 'CA_CAMBIOS PERMITIDOS_NO_SHOW_NO PERMITIDO'
    },
    MODEL_BACK_MAIN: {
        header: {
            title: 'HEADER_CONFIRMATION_BACK_MODAL_TITLE',
            subtitle: '',
            btn:  {
                text: 'HEADER_CONFIRMATION_BACK_MODAL_CLOSE_ACCESS',
                title: 'HEADER_CONFIRMATION_BACK_MODAL_CLOSE_ACCESS'
            }
        },
        body: {
            text: 'HEADER_CONFIRMATION_BACK_MODAL_DESCRIPTION'
        },
        btn: {
            text: 'HEADER_CONFIRMATION_BACK_MODAL_ACCEPT',
            title: 'HEADER_CONFIRMATION_BACK_MODAL_ACCEPT'
        },
        link: {
            text: 'HEADER_CONFIRMATION_BACK_MODAL_LINK',
            title: 'HEADER_CONFIRMATION_BACK_MODAL_LINK_TITLE'
        }
    },
    MODEL_BACK_MAIN_FLOWS: {
        BBKI: {
            body: 'MODAL_BACK_HOME_BODY',
            button: 'MODAL_BACK_HOME_BUTTON',
            link: 'MODAL_BACK_HOME_LINK',
            title: 'MODAL_BACK_HOME_TITLE'
        },
        CKI: {
            body: 'MODAL_CKI_BACK_HOME_BODY',
            button: 'MODAL_CKI_BACK_HOME_BUTTON',
            link: 'MODAL_CKI_BACK_HOME_LINK',
            title: 'MODAL_CKI_BACK_HOME_TITLE'
        },
        MMB: {
            body: 'MODAL_MMB_BACK_HOME_BODY',
            button: 'MODAL_MMB_BACK_HOME_BUTTON',
            link: 'MODAL_MMB_BACK_HOME_LINK',
            title: 'MODAL_MMB_BACK_HOME_TITLE'
        }
    },
    ENV_DOMAIN: {
        PRO_AWS: 'prod.iberia.com',
        PRE_AWS: 'pre.iberia.com',
        INT_AWS: 'int.iberia.com',
        PREE: 'pree.iberia.es',
        PREF: 'pref.iberia.es',
        PREB: 'preb.iberia.es',
        PREC: 'prec.iberia.es',
        PREW: 'prew.iberia.es',
        PRED: 'pred.iberia.es',
        PRO: 'www.iberia.com'
    },
    WCS_CUSTOMERDATA_STORAGES : {
        IBPLUS: 'retrieveMemberDetailV2',
        IBZERO: 'retrieveMemberDetailZero'
    },
    SPEQS_SUBTYPE: {
        SKI_SNOW: 'SKI_SNOW',
        GOLF_EQUIPMENT: 'GOLF_EQUIPMENT',
        BICYCLE: 'BICYCLE'
    }
};
angular.module('ib-commons-constants-module', []);
angular.module('ib-commons-constants-module')
    .constant('CommonsConstants', CommonsConstants)
    .constant('lodash-es', _);
export type CommonsConstantsType = typeof CommonsConstants;
export { CommonsConstants };