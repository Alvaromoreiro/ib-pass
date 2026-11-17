import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const services: string = envCopy.services;
const cloudServices: string = envCopy.cloud;
const auth: string = envCopy.auth;

const bobCloudURI = cloudServices + '/v1/bob';

const CheckinAncillariesConstants = {
    //Configuration parameters
    TIME_WAIT: 2000,
    TIME_DATALAYER_WAIT: 3000,
    NUM_ATTEMPS: 3,
    ANCILLARIES_WAIT_TIMEOUT: 10000,

    cachedInformationURI: 'booking/checkinId/',
    anonymousTokenURI: auth + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    userLoginURI: auth + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    prefixesServiceURI: 'location/phone-codes',
    DEFAULT_ENDPOINTS: {
        ancillariesURI: services + '/ass-fass/rs/fass/v5/',

        ancillariesCloudURI: cloudServices + '/v1/management/',

        deleteAncillaryURI: services + '/ass-fass/rs/fass/v5/',
        cachedInformationURI: services + '/pac-prm/rs/checkin/v3/booking/checkinId/',
        bobValidateAddressURI: `${bobCloudURI}/address/{flowId}`,
        bobPickupSlotsURI: `${bobCloudURI}/pickup-slots/{flowId}`,
        bobCreateURI: `${bobCloudURI}/order/new/{flowId}`,
        paymentsURI: services + '/pmt-ppm/rs/ppm/v3/',
        payAndIssueURI: services + '/ass-fass/rs/fass/v5/',
        seatsMapURI: services + '/sea-cism/rs/cism/v4/',
        prefixesServiceURI: services + '/rdu-loc/rs/loc/v1/location/phone-codes',
        externalAncillariesURI: services + '/ass-fass/rs/fass/v5/',
        getBreakdownURI: services + '/ass-fass/rs/fass/v5/',
        paymentMethodsServiceURI: services + '/rdu-loc/rs/loc/v2/location/paymentMethods',
        bundleServiceURI: cloudServices + '/v1/bundles/availability/',
        putBundleURI: cloudServices + '/v1/bundles/management/',
        reactWidgetCallbackURI: services + '/ass-fass/rs/fass/v6/{flow-id}/globick/confirm',
        tokenActivitiesPREE: 'https://pre-api-activities.recoglobick.com/token?grant_type=client_credentials',
        tokenTransfersPREE: 'https://pre-api-transfers.recoglobick.com/token?grant_type=client_credentials',
        tokenActivitiesPRO: 'https://api-activities.recoglobick.com/token?grant_type=client_credentials',
        tokenTransfersPRO: 'https://api-transfers.recoglobick.com/token?grant_type=client_credentials',
        defaultContentionPage: 'https://www.iberia.com/errorpages/default.html',
        OTP_VALIDATE: '/otp/validate'
    },
    PAGES_ROUTES: {
        PAYMENTS: '/ibpurc',
        BOARDING_CARDS: '/ibecbp',
        ANCILLARIES_PAGE: '/ckianc',
        ANCILLARIES_BKI_PAGE: '/ibcmtv',
        SEARCH_BOOKING: '/ibcose',
        SEARCH_LOGGED_BOOKING: '/ibcose2',
        CONFIRMATION_PAGE: '/ibcocf-and-ibeccf',
        FLIGHTS_AND_PASSENGERS: '/ibcoac',
        AVAILABILITY: '/availability',
        PASSENGER_INFO: '/ibairp'
    },
    APPLICATION_FLOW: {
        MMB: 'MMB',
        CHECKIN: 'CKI',
        BOOKING: 'BKI',
        BBOOKING: 'BBKI'
    },
    FLOW_TYPE: {
        METASEARCH: 'metasearchFlight',
        MULTICITY: 'multiCityFlight'
    },
    ROUTES: {
        icons: '/../iberia-web-content/iconos',
        images: '../iberia-web-content/imagenes',
        templates: 'web-checkin/templates/',
        creditCardsJson: '/payment/creditcardlogo.json',
        defaultCreditCardLogo: 'ico-tarjeta.png',
        creditCardLogoBaseRoute: '/payment/',
        imagesUpgBids: '/iberia-web-content/imagenes'
    },
    TypeofTransport: '../iberia-web-content/iconos/vuelos_pasajeros/',
    SeatTypes: {
        seat: 'SEAT',
        gap: 'GAP'
    },
    LegendType: {
        COMFORT_SEAT: 'COMFORT_SEAT',
        NORMAL: 'NORMAL',
        EMERGENCY: 'EMERGENCY',
        PROMO: 'PROMO',
        UPFRONT: 'UPFRONT'
    },
    DynamicLegendType: ['COMFORT_SEAT', 'NORMAL', 'EMERGENCY', 'PROMO', 'UPFRONT'],
    IdClassLegend: {
        NORMAL: 1,
        EMERGENCY: 2,
        COMFORT_SEAT: 9,
        PROMO: 10,
        UPFRONT: 11
    },
    IdLegendOrder: {
        NORMAL: 4,
        EMERGENCY: 3,
        COMFORT_SEAT: 1,
        PROMO: 5,
        UPFRONT: 2
    },
    SeatModalTypes: {
        info: 'INFORMATION',
        disclaimer: 'DISCLAIMER'
    },
    SeatFeatures: {
        emergencyExit: 'EMERGENCY_EXIT',
        extraSize: 'EXTRA_SIZE',
        emergencyWindow: 'WINDOW',
        wing: 'WING',
        screen: 'ENTERTAINMENT_SCREEN',
        nonReclining: 'NON_RECLINING',
        infant: 'PASSENGER_WITH_INFANT',
        mobility: 'RESTRICTED_MOBILITY',
        WC: 'WC',
        galley: 'GALLEY',
        promo: 'PROMO',
        upfront: 'UPFRONT',
        aisle: 'AISLE'
    },
    TYPE_PASSENGER: {
        INFANT: 'INFANT'
    },
    FLIGHT_PASSENGERS_STATUS_LIST: {
        CHECKED: ['CHECKED', 'STANDBY', 'REISSUE'],
        AVAILABLE: ['CHECKABLE', 'PENDING_AQQ', 'PENDING_EVUS'],
        NOT_AVAILABLE: ['UNCHECKABLE'],
        SHUTTLE: ['OPEN', 'CONFIRMED']
    },
    STATUS: {
        AVAILABLE: 'AVAILABLE',
        NOT_AVAILABLE: 'NOT_AVAILABLE'
    },
    SEAT_OCCUPATIONS: {
        free: 'FREE',
        selection: 'SELECTION',
        blocked: 'BLOCKED',
        occupied: 'OCCUPIED',
        occupiedOtherUser: 'OCCUPIED_OTHER_USER',
        comfort: 'COMFORT_SEAT'
    },
    DATALAYER_MODAL_ID: {
        INSURANCE_NOT_AVAILABLE: 'INSURANCE_NOT_AVAILABLE'
    },
    GENERAL_STATUS: {
        AVAILABLE: 'AVAILABLE'
    },
    TYPE_ANCILLARIE: {
        BAGGAGE: 'BAGGAGE',
        INSURANCE: 'INSURANCE',
        INSURANCE_ALLIANZ: 'ALLIANZ_FUSION',
        SEAT: 'SEAT',
        VEHICLE_RENTAL: 'VEHICLE_RENTAL',
        INTEGRATED_BOB: 'INTEGRATED_BOB',
        SPEQS: 'SPECIAL_EQUIPMENT',
        UPGRADING: 'UPGRADING',
        SPECIAL_MEALS: 'SPECIAL_MEALS',
        UPGRADING_BID: 'UPGRADING_BID',
        UPGRADING_AVIOS: 'UPGRADING_AVIOS',
        FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
        PREORDER: 'PREORDER',
        PRIORITY_BOARDING: 'PRIORITY_BOARDING',
        THIRD_PARTY_COMPANIES: 'THIRD_PARTY_COMPANIES',
        CO2_FOOTPRINT: 'CO2_FOOTPRINT',
        UPGRADING_WAITING_LIST: 'UPGRADING_WAITING_LIST',
        GLOBICK: 'GLOBICK'
    },
    ANCILLARIES_BAGGAGES_SUBTYPES_DESCRIPTION: {
        BAGGAGE_15: '15Kg',
        BAGGAGE_23: '23Kg',
        BAGGAGE_32: '32Kg'
    },
    QUADRIGAM: {
        ANCILLARIES_BKI: 'IBCMTV',
        ANCILLARIES_BKI_MULTI: 'MTCMTV',
        ANCILLARIES_BKI_HMAD: 'HMCMTV',
        ANCILLARIES_MMB: 'MOANCI',
        ANCILLARIES: 'CKIANC',
        EARLY_ANCILLARIES: 'ECKIANC',
        MODAL_SELECT_SEAT: 'MODSEA',
        MODAL_SELECT_INSURANCE: 'MODINS',
        MODAL_SELECT_SPECIAL_MEALS: 'MODMEALS',
        MODAL_SELECT_BAGGAGE_EXTRA: 'MODBAG',
        MODAL_SELECT_SEAT_DEEPLINK: 'SEATMPJBR',
        MODAL_SELECT_BAGG: 'MOBAGG',
        MODAL_SELECT_PRIO: 'MOPRIO',
        MODAL_SELECT_SPEQ: 'MOLUGG'
    },
    PAYMENT_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        VOUCHER: 'VOUCHER'
    },
    MAX_BAGGAGES: {
        MAX_BAGGAGES_BKI: 1
    },
    MAX_SPEQS: {
        MAX_SPEQS: 3
    },
    SPEQ_TYPE: {
        SKI_SNOW: 'SKI_SNOW',
        GOLF_EQUIPMENT: 'GOLF_EQUIPMENT',
        FISHING_EQUIPMENT: 'FISHING_EQUIPMENT',
        SCUBA_DIVING: 'SCUBA_DIVING',
        SURFBOARD: 'SURFBOARD',
        BICYCLE: 'BICYCLE',
        SPORTING_FIREARMS: 'SPORTING_FIREARMS'
    },
    DIRECTION: {
        LEFT: 'left',
        RIGHT: 'right'
    },
    PASSENGERFIELDS: {
        DOCUMENT_ID: 'DOCUMENT_ID',
        POLICY_HOLDER: 'POLICY_HOLDER',
        BIRTH_DATE: 'BIRTH_DATE'
    },
    CURRENCIES_TYPE_LONG: ['ARS', 'CLP', 'COP', 'CRC', 'USD', 'CZK', 'DOP', 'GBP', 'GTQ', 'HUF', 'JPY', 'MAD', 'MXN', 'RUB', 'XOF', 'ZAR'],
    SPECIAL_MEALS_NOT_AVAILABLE_REASONS: {
        LESS_THAN_ONE_DAYS: 'com.ib.captwo.ass.fass.error.ASS_FASS_9020',
        DURATION: 'com.ib.captwo.ass.fass.error.ASS_FASS_9021',
        OPERATION_CARRIER_NOT_ALLOWED: 'com.ib.captwo.ass.fass.error.ASS_FASS_9022'
    },
    TYPES: {
        MEAL: 'meal'
    },
    UPGRADE_TYPES: [
        {
            type: 'PREMIUMTOURIST',
            onLand: ['UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2'],
            onBoard: [
                'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1',
                'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2',
                'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_3'
            ]
        },
        {
            type: 'PREMIUM_ECONOMY',
            onLand: ['UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2'],
            onBoard: [
                'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1',
                'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2',
                'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_3'
            ]
        },
        {
            type: 'BUSINESS_PLUS',
            onLand: ['UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_3'],
            onBoard: ['UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_2', 'UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_3']
        },
        {
            type: 'BUSINESS_CLUB',
            onLand: ['UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_3'],
            onBoard: ['UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_2', 'UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_3']
        },
        {
            type: 'BUSINESS',
            onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
            onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
        },
        {
            type: 'BUSINESS_CLASS',
            onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
            onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
        },
        {
            type: 'BUSINESS_AIR_NOSTRUM',
            onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
            onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
        },
        {
            type: 'BUSINESS_IBERIA_EXPRESS',
            onLand: ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
            onBoard: ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
        }
    ],
    PATTERNS: {
        NAME_SURNAME_PATTERN: /^(?!.*[0-9*`??!??<>\\\\??|/\?@#$%&,;=??())_+{}\[\]"\^?$?])/,
        NAME_SURNAME_CLEANER: '[0-9*`??!??<>\\\\??|/\\?@#$%&,;=??())_+{}\\[\\]"\\^?$?]',
        PHONE_PATTERN: /^\d{6,}$/,
        PHONE_CLEANER: '\\D+',
        CVV_PATTERN: /^\d{3}$/,
        CVV_PATTERN_AX: /^\d{4}$/,
        CVV_CLEANER: '\\D+',
        DOCS_PATTERN: /^(?!.*[?!??<>\\\\??|/\?@#$%&,;=??())_+{}\[\]"\^?$?])/,
        DOCS_CLEANER: '[?!??<>\\\\??|/\\?@#$%&,;=??())_+{}\\[\\]"\\^?$?]',
        ADDITIONAL_FIELD_PATTERN: /^(?!.*[?!??<>\\\\??|/\?@#$%&,;=??())_+{}\[\]"\^?$?])/,
        ADDITIONAL_FIELD_CLEANER: '[?!??<>\\\\??|/\\?@#$%&,;=??())_+{}\\[\\]"\\^?$?]',
        MAX_LENGTH_NAME: 30,
        MIN_LENGTH_NAME: 2,
        MAX_LENGTH_SURNAME: 30,
        MIN_LENGTH_SURNAME: 2,
        MAX_LENGTH_MANDATORY_DOC: 20,
        MAX_LENGTH_ZIP_CODE: 10,
        MIN_LENGTH_ZIP_CODE: 2,
        MAX_LENGTH_STREET: 40,
        MIN_LENGTH_STREET: 1,
        MAX_LENGTH_CITY: 24,
        MIN_LENGTH_CITY: 1,
        MAX_LENGTH_ADDITIONAL_FIELD: 30,
        STREET_PATTERN: /(?!.*[0-9{8,}*$?!??<>\\\\??|/\?@#$%&,;=??())_+{}\[\]"\^?$?])/,
        STREET_CLEANER: '[0-9{8,}*$?!??<>\\\\??|/\\?@#$%&,;=??())_+{}\\[\\]"\\^?$?]',
        CITY_PATTERN: /(?!.*[0-9*?!??<>\\\\??|/\?@#$%&,;=??())_+{}\[\]"\^?$?])/,
        CITY_CLEANER: '[0-9*?!??<>\\\\??|/\\?@#$%&,;=??())_+{}\\[\\]"\\^?$?]',
        RUC_DOCUMENT: /^([0-9]){11}$/,
        RUC_CLEANER: '\\D+',
        AWS_WARNING_ERRORS: /AWS/,
        EMAIL_PATTERN: /^[A-Za-z0-9]+(?:[\.\-\_]?[A-Za-z0-9])+\@[a-zA-Z0-9][a-zA-Z0-9\-\_]{0,64}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{1,5})+$/,
        PRICE_INTEGER: /^([0-9])*$/
    },
    BOB_FREE_TYPES: ['INFINITAPRIME', 'INFINITA', 'PLATINO', 'SINGULAR'],
    FFLEVELBOB: {
        INFINITAPRIME: 1,
        INFINITA: 1,
        PLATINO: 1,
        SINGULAR: 1
    },
    FLEX_CONFIGURATION: {
        NAME: 'requestFlex',
        CARDCOLS: 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6',
        CARDTYPE: 'ib-box-card--type-3',
        CARDIMG: {
            src: 'ancillaries_nuevas/flexibilidad.svg',
            text: 'ANCILLARIES_FLEXIBILITY_CARDIMG_TEXT'
        },
        CARDTITLE: 'ANCILLARIES_FLEXIBILITY_CARDTITLE',
        CARDPRICE: '10,80',
        CARDTEXT: 'ANCILLARIES_FLEXIBILITY_CARDTEXT',
        CARDSUBTEXT: 'ANCILLARIES_FLEXIBILITY_CARDSUBTEXT',
        CARDSUBTEXTSELECT: 'ANCILLARIES_FLEXIBILITY_CARDSUBTEXT_SELECT',
        CARDBUTTON: {
            text: 'BUTTON_ADD_TEXT',
            altText: 'MODAL_BUTTON_MODIFY_TEXT'
        },
        MODAL: {
            template: 'ib-onrequest-flexibilization.html',
            classes: 'ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade'
        }
    },
    PREORDER_CONFIGURATION: {
        NAME: 'requestPreorder',
        CARDCOLS: 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6',
        CARDTYPE: 'ib-box-card--type-3',
        CARDIMG: {
            src: 'ancillaries_nuevas/deliverfly.svg',
            text: ''
        },
        CARDTITLE: 'ANCILLARIES_PREORDER_CARDTITLE_2',
        CARDPRICE: '5,75',
        CARDTEXT: 'ANCILLARIES_PREORDER_CARDTEXT',
        CARDSUBTEXT: 'ANCILLARIES_PREORDER_CARDTEXT_2',
        CARDSUBTEXTSELECT: '',
        CARDBUTTON: {
            text: 'BUTTON_ADD_TEXT',
            altText: 'BUTTON_ADD_TEXT'
        },
        MODAL: {
            template: '',
            classes: 'ib-modals ib-modals--full-mobile ib-modals--right fade'
        }
    },
    PRESELECTION: {
        NAME: 'NAME',
        CARDCOLS: 'COLS', //'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6',
        CARDTYPE: 'TYPE', //'ib-box-card--type-3',
        CARDIMG: {
            // change for new svg in iberia-web-content
            src: 'ancilliaries/IMG.svg',
            text: ''
        },
        // title
        CARDTITLE: 'TITLE',
        CARDPRICE: 'PRICE',
        CARDTEXT: 'TEXT',
        CARDSUBTEXT: 'SUBTEXT',
        CARDSUBTEXTSELECT: 'SUBTEXTSELECT',
        CARDBUTTON: {
            text: 'BUTTON TEXT',
            altText: 'BUTTON ALT TEXT'
        },
        MODAL: {
            template: 'TEMPLATE',
            classes: 'CLASES'
        }
    },
    PRIORITY_BOARDING: {
        NAME: 'priorityBoarding',
        CARDCOLS: 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6',
        CARDTYPE: 'ib-box-card--type-3',
        CARDIMG: {
            src: 'ancillaries_nuevas/prioridad-de-embarque.svg',
            text: 'PRIORITY_BOARDING_TITLE'
        },
        CARDTITLE: 'PRIORITY_BOARDING_TITLE',
        CARDPRICE: '10,80',
        CARDTEXT: 'ANCILLARIES_PRIORITY_BOARDING_CARDTEXT',
        CARDSUBTEXT: 'ANCILLARIES_PRIORITY_BOARDING_CARDSUBTEXT',
        CARDSUBTEXTSELECT: 'ANCILLARIES_PRIORITY_BOARDING_CARDSUBTEXT_SELECT',
        CARDBUTTON: {
            text: 'BUTTON_ADD_TEXT',
            altText: 'MODAL_BUTTON_MODIFY_TEXT'
        },
        MODAL: {
            template: 'ib-modal-priority-boarding.html',
            classes: 'ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade'
        }
    },
    DATALAYER_INFO: {
        SPEQ_OPEN: 'elegir equipaje especial',
        SPECIAL_MEALS_OPEN: 'elegir comidas especiales',
        FLEXIBILIZATION_OPEN: 'elegir flexilidad a la carta',
        PREORDER_OPEN: 'elegir deliverfly',
        PREORDER_DISPLAY: 'impresiones',
        PREORDER_ACCESS: 'acceder',
        PREORDER_CODE: 'codigoSeguimiento',
        MODULE_PREORDER: 'preorder',
        CLICK: 'clic',
        ANADIR: 'anadir',
        SPEQ_CONFIRM: 'confirmar equipaje especial',
        SPECIAL_MEALS_CONFIRM: 'confirmar comidas especiales',
        FLEXIBILIZATION_CONFIRM: 'confirmar flexibilidad a la carta',
        CONFIRM: 'confirmar',
        OK: 'ok',
        SEGUROS: 'seguros',
        INSURANCE_CONDITIONS: 'Consulta condiciones legales',
        MODULE_BOB_STEP: 'modulo bob:paso',
        CANCEL: 'cancelar',
        ERROR: 'error',
        LAST_FIELD_COMPLETE: 'ultimo campo completado:',
        FINALIZE: 'finalizar:',
        FREE: 'gratuito',
        PAYMENT: 'de pago',
        MODULE_BOB: 'modulo bob',
        ANCILLARIES_CKI_PAGE: 'es/Es/CKIANC',
        IMPRESSION: 'impresiones:',
        PRIORITY_BOARDING_OPEN: 'elegir priority boarding',
        CLICKS_BANNER: 'clicks banner',
        FOLLOW_ERROR: 'error',
        BAGGAGE_ADD_BOB: 'maleta anadida',
        ADDRESS_ADD_BOB: 'direccion anadida',
        SLOT_ADD_BOB: 'slot horario anadido',
        INFO_ADD_BOB: 'informacion contacto anadida',
        STEP_ONE: 'Paso 1',
        STEP_TWO: 'Paso 2',
        CONTINUE: 'continuar',
        INTERACCION: 'interaccion',
        STEP: 'Paso ',
        ANCILLARIES: {
            CO2_FOOTPRINT: {
                LABEL: 'carbonFootprint',
                MODULE_CLICK: 'modulo co2: click',
                MODAL_TOGGLE_CLICK: 'modal co2: toggle',
                MODAL_ACCEPT_ADD: 'modal co2: añadir al carrito',
                MODAL_ACCEPT_REMOVE: 'modal co2: quitar del carrito'
            }
        },
        BUNDLE: 'bundle',
        BAGGAGE: 'baggage',
        SPECIAL_EQUIPMENT: 'special baggage',
        FLEXIBILITY_ON_DEMAND: 'flexibilization',
        PRIORITY_BOARDING: 'priority boarding',
        BICYCLE: 'bike',
        GOLF_EQUIPMENT: 'golf',
        SKI_SNOW: 'ski',
        FISHING_EQUIPMENT: 'fishing',
        SCUBA_DIVING: 'scuba',
        SURFBOARD: 'surf',
        SPORTING_FIREARMS: 'firearms',
        FLIGHT_CHANGE: 'change',
        VOUCHER_REFUND: 'refund',
        FLEXIBILITY_PACK: 'flexibility'

    },
    FLAGS_KEYS: {
        XL_BANNER: 'SHOW_XL_SEAT_BANNER',
        RESIDENT_BAGGAGE: 'SHOW_RESIDENT_BAGGAGE_DISCOUNT_BANNER'
    },
    DISCOUNT_TYPES: {
        PARTNER: 'PARTNER'
    },
    SPEQS_SUBTYPE: {
        SKI_SNOW: 'SKI_SNOW',
        GOLF_EQUIPMENT: 'GOLF_EQUIPMENT',
        BICYCLE: 'BICYCLE',
        FISHING_EQUIPMENT: 'FISHING_EQUIPMENT',
        SCUBA_DIVING: 'SCUBA_DIVING',
        SURFBOARD: 'SURFBOARD',
        SPORTING_FIREARMS: 'SPORTING_FIREARMS'
    },
    BAGGAGE_SUBTYPES: [
        'BAGGAGE_23',
        'BAGGAGE_15',
        'BAGGAGE_32'
    ],
    ANCILLARIES_NAME: {
        BAGGAGES: 'baggages',
        SEAT: 'seat',
        INSURANCE: 'insurance',
        FLEXIBILIZATION: 'flexibilization',
        SPECIAL_BAGGAGES: 'special baggages'

    },
    ANCILLARIES_TYPES: {
        SEATS: 'SEATS',
        BAGGAGE: 'BAGGAGE',
        SPEQS: 'SPEQS',
        PRIORITY_BOARDING: 'PRIORITY_BOARDING'
    },
    ANCILLARIES_SUBTYPES: {
        BAGGAGE_15: 'BAGGAGE_15',
        BAGGAGE_23: 'BAGGAGE_23',
        BAGGAGE_32: 'BAGGAGE_32',
        BICYCLE: 'BICYCLE',
        GOLF_EQUIPMENT: 'GOLF_EQUIPMENT',
        SKI_SNOW: 'SKI_SNOW',
        FLIGHT_CHANGE: 'FLIGHT_CHANGE',
        VOUCHER_REFUND: 'VOUCHER_REFUND',
        FLEXIBILITY_PACK: 'FLEXIBILITY_PACK'
    },
    ANCILLARIES_SUBCODES: {
        SEATS: ['0B5', 'XST'],
        BAGGAGES: ['0LM', '0GO', '0FM', '0AA', '0CC', '0IJ', '0H1', 'HIJ', '0PZ', '08H'],
        SPEQS: ['0EC', '0D6', '0D4', '0I9', '0EE', '0DD', '0D8', '0DG', '0IA', '0ED'],
        PRIORITY_BOARDING: ['0G6']
    },
    ANCILLARIES_LITERALS: {
        PRIORITY_BOARDING: 'PRIORITY_BOARDING_TITLE',
        FLEXIBILITY_ON_DEMAND: 'ANCILLARIES_FLEXIBILITY_SUBTITLE_MODAL',
        SKI_SNOW: 'SPEQS_SKI_SNOW',
        GOLF_EQUIPMENT: 'SPEQS_GOLF_EQUIPMENT',
        BICYCLE: 'SPEQS_BICYCLE',
        BAGGAGE_15: 'ANCILLARIES_BAGGAGE_TITLE_15',
        BAGGAGE_23: 'ANCILLARIES_BAGGAGE_TITLE_23',
        BAGGAGE_32: 'ANCILLARIES_BAGGAGE_TITLE_32',
        SEAT: 'SEAT_TEXT',
        VOUCHER_REFUND: 'ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE',
        FLIGHT_CHANGE: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
        FLEXIBILITY_PACK: 'ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY'
    },
    FLEX_SUBTYPES: {
        FLIGHT_CHANGE: 'FLIGHT_CHANGE',
        VOUCHER_REFUND: 'VOUCHER_REFUND',
        FLEXIBILITY_PACK: 'FLEXIBILITY_PACK'
    },
    ECOMMERCE: {
        METASEARCH: 'metabuscador',
        STOPOVER_HMAD: 'hola madrid',
        MULTIPLE_JOURNEYS: 'multiples trayectos'
    },
    DATALAYER_ANC_EVENTS: {
        CLICK: 'click',
        ON_OPEN: 'elegir ',
        ON_CLOSE: 'confirmar ',
        ON_ACTION_OPEN: 'anadir',
        ON_ACTION_CLOSE: 'confirmar',
        MOBAGG: 'equipaje',
        SUPUJA: 'puja',
        MOSEAT: 'asientos',
        MOFLEX: 'flexibilidad a la carta',
        MOPRIO: 'prioridad de embarque',
        MOLUGG: 'equipaje especial',
        MOMEAL: 'comida',
        MOUPG: 'upgrade',
        MOANCI: 'ancillaries',
        MODSEA: 'modal asientos',
        MOPURC: 'asientos / inicio / pago',
        MOBKCF: 'confirmacion',
        MODBOB: 'recogida equipaje',
        IBMCYT: 'hoteles coches',
        MODINS: 'modal seguro',
        MODDIM: 'digital menu',
        MODGCA: 'modal propuesta gastronómica',
        MOSEATJBR: 'asientos',
        MOTRAS: 'traslados'
    }
};
angular.module('ib-checkin-ancillaries-module').constant('CheckinAncillariesConstants', CheckinAncillariesConstants);

export type CheckinAncillariesConstants = typeof CheckinAncillariesConstants;
export { CheckinAncillariesConstants };
