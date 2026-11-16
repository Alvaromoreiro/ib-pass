import * as angular from 'angular';
import { RouterPathsConstants } from './ib-booking-router-paths-constants';


const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const servicesURI: string = envCopy.services;
const authoritationURI: string = envCopy.auth;
const servicesCloudUri: string = envCopy.cloud;
const servicesCloudMyIbUri: string = envCopy.cloudMyIberia;
const otpServicesURI: string = envCopy.otpServices;
const globalAuthorizationToken: string = envCopy.globalAuthorizationToken;
const paymentsComponentURI: string = envCopy.paymentsComponent;
//@ts-ignore
const _ = window._;

const searchFlightType =  {
    AVAILABILITY: 'availabilityFlight',
    METASEARCH: 'metasearchFlight',
    MULTITRIP: 'multiCityFlight',
    REDEMPTION: 'redemptionFlight',
    REDEMPTIONOB: 'redemptionOBFlight',
    PAOPEN: 'shuttleFlow',
    ONHOLD_CONF: 'onHoldConfirmation'
};


const BookingAppConstants = {
    production: envCopy.production,
    lang: 'es',
    market: 'ES',
    timeWait: 2000,
    numAttemps: 3,
    ANCILLARIES_WAIT_TIMEOUT: 15000,
    SKIP_ANCILLARIES_SERVICE: true,
    servicesURI,
    otpServicesURI,
    globalAuthorizationToken: globalAuthorizationToken,
    paymentsComponentURI,
    defaultContentionPage: 'https://www.iberia.com/errorpages/default.html',
    defaultOnBusinessLoginPage: 'https://www.iberia.com/integration/obsso/login/',
    //rest service Calls
    tokenServiceURI: authoritationURI + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    tokenOBServiceURI: authoritationURI + '/auth/realms/on_business/protocol/openid-connect/token',
    endpointsServiceURI: servicesURI + '/endpoints/',
    commercialInfobyMarketServiceURI: 'location/market/commercialsellingdata',
    availabilityServiceURI: 'availability',
    fareServiceURI: 'fare',
    fareShuttleServiceURI: 'fare/shuttle',
    createOrderServiceURI: 'order',
    getBookingInformationURI: 'booking/',
    issueOrderServiceURI: 'issue',
    countriesListServiceURI: 'location/country',
    statesListServiceURI: 'location/',
    gdprServiceURI: 'location/',
    destinationCitiesListServiceURI: 'location/cities/destination',
    prefixesServiceURI: 'location/phone-codes',
    companiesServiceURI: 'data/frequent-flyer/companies',
    securityInfoServiceURI: 'info/',
    priceMatrixServiceURI: 'calendar',
    priceMatrixServiceMultiOpenJawURI: 'calendar/complex',
    priceMatrixOneSliceServiceURI: 'calendar/ribbon',
    redemptionCalendarGridURI: 'calendar/grid',
    checkVoucherCodeServiceURI: 'order',
    cancelOrderServiceURI: 'order',
    ignoreOrderServiceURI: 'order/ignore',
    customerDataURI: 'customer/complete',
    onHoldOrderServiceURI: 'on-hold',
    customerCreditCardDataURI: 'customer/credit_card',
    destinationAreasBAHCitiesURI: 'location/cities/',
    newsletterServiceURI: 'newsletter',
    keepAliveAvmServiceURI: 'keepAlive/',
    keepAliveOrmServiceURI: 'keepAlive/',
    metaSearchServiceURI: 'fare/extended-direct',
    onBusinessMembershipURI: 'membership',
    onBusinessEmployeesURI: 'employees',
    onBusinessPaymentsCardsURI: 'payment_card',
    onBusinessPointsURI: 'calculateReward',
    verifyEmailConsentURI: 'abandoned-shoppingCart/verifyMail',
    insertEmailConsentURI: 'abandoned-shoppingCart/insertMail',
    DEFAULT_ENDPOINTS: {
        availabilityServiceURI: servicesURI + '/sse-avm/rs/v2/availability',
        availabilityItineraryOutboundServiceURI: servicesURI + '/sse-avm/rs/v2/availability/itinerary',
        availabilityItineraryReturnServiceURI: servicesURI + '/sse-avm/rs/v2/availability/itinerary/{{responseId}}/{{offerId}}/{{sliceId}}',
        availabilityRedemptionServiceURI: servicesURI + '/sse-rpa/rs/v1/availability',
        fareServiceURI: servicesURI + '/sse-avm/rs/v2/fare',
        fareShuttleServiceURI: servicesURI + '/sse-avm/rs/v2/fare/shuttle',
        fareRedemptionServiceURI: servicesURI + '/sse-rpa/rs/v1/fare',
        fareShuttleRedemptionServiceURI: servicesURI + '/sse-rpa/rs/v1/fare/shuttle',
        FARE_DIRECT_SERVICE_URI: servicesURI + '/sse-avm/rs/v2/fare/flashoffer-direct',
        BookingCalendarGridServiceURI: servicesURI + '/sse-rpa/rs/v1/calendar/grid',
        createOrderServiceURI: servicesURI + '/sse-orm/rs/v2/order',
        issueOrderServiceURI: servicesURI + '/sse-orm/rs/v2/issue',
        commercialInfobyMarketServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/market/commercialsellingdata',
        countriesListServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/country',
        statesListServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/',
        gdprServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/',
        destinationCitiesListServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/cities/destination',
        prefixesServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/phone-codes',
        companiesServiceURI: servicesURI + '/framework-services/rs/commons/v1/data/frequent-flyer/companies',
        securityInfoServiceURI: servicesURI + '/trm-apim/rs/v3/info/',
        priceMatrixServiceURI: servicesURI + '/sse-avm/rs/v2/calendar',
        priceMatrixServiceMultiOpenJawURI: servicesURI + '/sse-avm/rs/v2/calendar/complex',
        priceMatrixOneSliceServiceURI: servicesURI + '/sse-avm/rs/v2/calendar/ribbon',
        priceMatrixRedemptionServiceURI: servicesURI + '/sse-rpa/rs/v1/calendar',
        paymentMethodsServiceURI: servicesURI + '/pmt-ppm/rs/ppm/v3/',
        checkVoucherCodeServiceURI: servicesURI + '/sse-orm/rs/v2/order',
        cancelOrderServiceURI: servicesURI + '/sse-orm/rs/v2/order',
        ignoreOrderServiceURI: servicesURI + '/sse-orm/rs/v2/order/ignore',
        customerDataURI: servicesURI + '/cust-cust/rs/v1/customer/complete',
        onHoldOrderServiceURI: servicesURI + '/sse-orm/rs/v1/on-hold',
        customerCreditCardDataURI: servicesURI + '/cust-cust/rs/v1/customer/credit_card',
        destinationAreasBAHCitiesURI: servicesURI + '/rdu-loc/rs/loc/v1/location/cities/',
        destinationAreasBAHCitiesCloudURI: servicesCloudUri + '/v1/ibv/location/cities/',
        keepAliveAvmServiceURI: servicesURI + '/sse-avm/rs/v2/keepAlive/',
        keepAliveOrmServiceURI: servicesURI + '/sse-orm/rs/v3/keepAlive/',
        paymentMethodsAdditionalFieldsServiceURI: servicesURI + '/pmt-ppm/rs/ppm/v4/',
        metaSearchServiceURI: servicesURI + '/sse-avm/rs/v2/fare/extended-direct',
        paymentMethodsAdditionalFieldsBRServiceURI: servicesURI + '/pmt-ppm/rs/ppm/v5/',
        availabilityMultiTripServiceURI: servicesURI + '/sse-avm/rs/v2/availability/complex',
        fareMultiTripServiceURI: servicesURI + '/sse-avm/rs/v2/fare/complex',
        onBusinessMembershipURI: servicesURI + '/cmlm-mbm/rs/v1/membership',
        onBusinessEmployeesURI: servicesURI + '/cmlm-mbm/rs/v1/employees',
        onBusinessPaymentsCardsURI: servicesURI + '/cmlm-mbm/rs/v1/payment_card',
        onBusinessPointsURI: servicesURI + '/cmlm-lpm/rs/v1/calculateReward',
        ancillariesURI: servicesURI + '/ass-fass/rs/fass/v5/',
        recoverUserName: servicesURI + '/agl/v2/programmes/{{programme-identifier}}/security-profile/profile-reminder',
        calculatePoints: servicesURI + '/prlm-pc/rs/v1/calculatePoints',
        retrieveAssociates: servicesURI + '/prlm-asm/rs/v1/members/{{member-identifier}}/associates',
        RETRIEVE_IB_PLUS_ASSOCIATES: servicesURI + '/prlm-asm/rs/v1/members/{{memberIdentifier}}/associates',
        RETRIEVE_IB_PLUS_ASSOCIATE: servicesURI + '/agl/v1/members/{{memberIdentifier}}/programmes/{{programme-identifier}}/associates/{{associate-identifier}}',
        UPDATE_IB_PLUS_ASSOCIATE: servicesURI + '/prlm-asm/rs/v1/members/{{memberIdentifier}}/associates/{{associate-identifier}}',
        partners: servicesURI + '/prlm-mbm/rs/v1/partners',
        changeOnHoldOrder: servicesURI + '/sse-orm/rs/v2/on-hold/{{flowId}}/modify-on-hold',
        verifyEmailConsentURI: servicesURI + '/sse-orm/rs/v5/abandoned-shoppingCart/verifyMail',
        insertEmailConsentURI: servicesURI + '/sse-orm/rs/v5/abandoned-shoppingCart/insertMail',
        SALEFORCE_CONTACT_ID: servicesURI + '/cmlm-lpm/rs/v1/availability/alert',
        SHORT_REGISTER: servicesURI + '/pzmm-mbm/rs/v1/members',
        ENROL_MEMBER_V2: servicesURI + '/prlm-mbm/rs/v2/members',
        switchSellURI: servicesCloudUri + '/v1/iberia-vacaciones/availability'
    },
    SALESFORCE_ENDPOINTS: {
        TRAVEL_PREFERENCES: servicesURI + '/cust-cust/rs/v1/travel_preferences',
        CONTACT_DETAILS_IBPLUS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        PERSONAL_DATA_IBPLUS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        DISCOUNTS_DATA_IBPLUS: servicesURI + '/cust-cust/rs/v1/discounts',
        MARKETING_PERMISSIONS: servicesURI + '/cust-cust/rs/v3/customer/marketing-permission',
        TRAVEL_DOCUMENTS: servicesCloudMyIbUri + '/v1/travel-documents'
    },
    //app Routes
    i18nRoute: '/iberia-web-content/literales/booking/',
    generalI18nRoute: '/iberia-web-content/literales/general/',
    ckiI18nRoute: '/iberia-web-content/literales/checkin/',
    iconsRoute: '/iberia-web-content/iconos',
    imagesRoute: '/iberia-web-content/imagenes',
    linksRoute: '/iberia-web-content/links/booking',
    localeRoute: '/iberia-web-content/locales',
    generalLinksRoute: '/iberia-web-content/links/general',
    creditCardJsonRoute: '/payment/creditcardlogo.json',
    airlinesLogoJsonRoute: '/aerolineas/aeroLineas.json',
    airlinesLogoBaseRoute: '/aerolineas/',
    creditCardLogoBaseRoute: '/payment/',
    backgroundImagesJsonRoute: '/background/backgrounds.json',
    backgroundImagesBaseRoute: '/background/',
    templatesRoute: 'web-booking/templates/',
    defaultAirlineLogo: 'logo_pos_generico.svg',
    defaultAirlineMinLogo: 'logo_pos_min_generico.svg',
    defaultCreditCardLogo: 'ico-tarjeta.png',
    defaultBackgroundImageWidth: 'generico/disponibilidad_default_',
    defaultBackgroundImage: 'generico/disponibilidad_default_2000.jpg',
    dataLoadingPlanePath: '/cargando/loadingPlaneData.json',
    loadingCardsPath: '/cargando/cardPayData.json',
    availableMarkets: [
        'at',
        'be',
        'ch',
        'cn',
        'cu',
        'cz',
        'de',
        'dk',
        'do',
        'dz',
        'ec',
        'fi',
        'fr',
        'gb',
        'gr',
        'gt',
        'hu',
        'ie',
        'jp',
        'il',
        'ma',
        'mx',
        'nl',
        'pa',
        'pr',
        'pt',
        'ru',
        'se',
        'sn',
        'sv',
        'us',
        'za',
        'it',
        'uy',
        'cr',
        'cl',
        've',
        'co',
        'es',
        'pe',
        'br',
        'ar',
        'ca',
        'qa'
    ],
    availableLanguages: ['ca', 'de', 'en', 'es', 'fr', 'it', 'ja', 'nl', 'pt', 'ru', 'zh'],
    availableOnbMarkets: ['ES', 'FI', 'GR', 'IE', 'AT', 'BE', 'NL', 'PT', 'IT', 'DE', 'FR', 'CU'],
    UNAVAILABLE_MARKETS_REDIRECTION: {
        DEFAULT: { marketRedirect: 'ES' },
        ONB_REDIRECTION: [
            'AR', 'BR', 'CL', 'CO', 'CR', 'CU', 'EC', 'GB', 'GT', 'MX', 'PA', 'PE', 'PR', 'SV', 'US', 'UY', 'VE'
        ],
        GI: { marketRedirect: 'GB' }, // Gibraltar
        AU: { marketRedirect: 'US' }, // Australia
        NZ: { marketRedirect: 'US' } // New Zealand
    },
    defaultLang: 'es',
    defaultMarket: 'ES',
    flowName: 'BKI',
    COOKIES: {
        PERSONALIZATION: 'IBERIACOM_PERSONALIZATION',
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
        DYNAMIC_PRICING: 'DP'
    },
    defaultCommercialInfo: {
        roundingPolicy: 'HALF_ROUND_DOWN',
        minSearchTime: 0,
        maxSearchTime: 330,
        currency: { groupingSeparator: '.' }
    },
    //Text constants
    passengerTypes: {
        Default: 'DEFAULT',
        senior: 'SENIOR',
        adult: 'ADULT',
        young: 'YOUTH',
        teenager: 'TEENAGER',
        child: 'CHILD',
        infant: 'INFANT',
        SPECIAL_NEEDS: 'specialNeed',
        young_adult: 'YOUNG_ADULT'
    },
    passengerTypesWithPlurals: {
        senior: ['SENIOR', 'SOME_SENIOR'],
        adult: ['ADULT', 'SOME_ADULT'],
        young: ['YOUTH', 'SOME_YOUTH'],
        teenager: ['YOUNG', 'SOME_YOUNG'],
        child: ['CHILD', 'SOME_CHILD'],
        infant: ['INFANT', 'SOME_INFANT']
    },
    GENERAL_STATUS: {
        AVAILABLE: 'AVAILABLE',
        NOT_AVAILABLE: 'NOT_AVAILABLE'
    },
    HELLO_MADRID: {
        corporateCode: '985023',
        imageSuffix: 'hello_madrid'
    },
    SLICE_CORPORATE_ICON_MAP: {
        '985023': { 'imageSuffix': 'hello_madrid' }, // HMAD Corporate code
        default: { 'imageSuffix': 'campaign' }
    },
    bookingPatterns: {
        NAME_SURNAME_PATTERN: /^[a-zA-Z \-.'àÀáÁâÂãÃäÄåÅæÆçÇèÈéÉêÊëËìÌíÍîÎïÏðÐñÑòÒóÓôÔöÖøØùÙúÚûÛüÜýÝþÞÿŸßčČćĆšŠžŽđĐŁłÕõŻżŚśŔŕĚěŘřŃńŇňŹź]+$/,
        NAME_SURNAME_CLEANER: '[0-9*¡!?¿<>\\ºª|/·@#$%&,:`;=?¿())_+{}\\[\\]\\^€£¨"¬~]',
        EMAIL_PATTERN: '[A-Za-z0-9\\-\\_\\+]+(?:[\\.\\-\\_\\+]?[A-Za-z0-9]+[\\-\\_\\+]?)+@[A-Za-z0-9]+(?:(?:[\\.\\-\\_][A-Za-z0-9]+)+)?\\.[a-zA-Z]+',
        EMAIL_CLEANER: '\\s+',
        PHONE_PATTERN: /^\d{6,}$/,
        PHONE_CLEANER: '\\D+',
        CVV_PATTERN: /^\d+$/,
        CVV_CLEANER: '\\D+',
        CREDIT_CARD_NUMBER_PATTERN: /^\d+$/,
        CREDIT_CARD_NUMBER_CLEANER: '\\D+',
        CARD_NUMBER_PATTERN: /^\d+$/,
        CARD_NUMBER_CLEANER: '\\D+',
        DOCS_PATTERN: /^(?!.*[¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        DOCS_CLEANER: '[*¡!?¿<>\\ºª|/·@#$%&.,:`´;=?¿()_+{}\\[\\]^€£¨"¬~]',
        REDRESS_NUMBER_PATTERN: /^[a-zA-Z0-9()-\s]+$/,
        REDRESS_NUMBER_CLEANER: '[^a-zA-Z0-9()-\\s]',
        ERROR_RESIDENT_PATTERN: /residentDiscountInfo.residentCertificateNumber/,
        ERROR_LARGE_FAMILY_DISCOUNT_PATTERN: /largeFamilyDiscountInfo.largeFamilyCertificateNumber/,
        ERROR_CONGRESSMAN_PATTERN: /idInfo/,
        ERROR_FIRST_SURNAME: /firstSurname/,
        ERROR_FREQ_FLYER: /ffInfo.number/,
        AWS_WARNING_ERRORS: /AWS/,
        CONGRESSNAB_PATTERN: '[0-9]{1,12}',
        ADDITIONAL_FIELD_PATTERN: /^(?!.*[¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        ADDITIONAL_FIELD_CLEANER: '[¡!?¿<>\\ºª|/·@#$%&,;=?¿()_+{}\\[\\]"^€$]',
        STREET_PATTERN: /(?!.*[0-9{8,}*$¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        STREET_CLEANER: '[0-9{8,}*$¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\\[\\]"^€£]',
        CITY_PATTERN: /(?!.*[0-9*¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        CITY_CLEANER: '[0-9*¡!?¿<>\\ºª|/·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
        RUC_DOCUMENT: /^([0-9]){11}$/,
        RUC_CLEANER: '\\D+',
        CDI_DOCUMENT: /^([0-9]){0,11}$/,
        ONBUSINESS_NUMBER_PATTERN: '\\d',
        AA_CARD_PATTERN: /[a-zA-Z0-9]/,
        AA_CARD_CLEANER: '[^a-zA-Z0-9]',
        DNI_DOCUMENT: /^([0-9]{8})[A-Za-z]$/,
        DATE_PATTERN: '^(?:(?:0[1-9]|1\\d|2\\d)/(?:0[1-9]|1[0-2])|(?:(?:30)/(?!02)(?:0[1-9]|1[0-2]))|31/(?:(?:0[13578]|1[02])))/(?:19|20|21)\\d{2}$',
        NI_PATTERN: /^([\w])([-\s\w]){1,20}/,
        NI_CLEANER: '[*¡!?¿<>\\ºª|/·@#$%&.,:`´;=?¿())_+{}\\[\\]^€$£¨"¬~]',
        PASSWORD_PATTERN: /^(?!.*[\s%&¡¿¨«»\\€ºªÇ¬´“])(.){8,20}$/,
        PASSWORD_PATTERN_MAYUS: /([A-Z]+)/,
        PASSWORD_PATTERN_MINS: /([a-z]+)/,
        PASSWORD_PATTERN_NUM: /([0-9]+)/,
        PASSWORD_PATTERN_SPECIAL: /([-!?'(){}\[\]_,.:;=\/\\*+<>|^#@~`$]+)/
    },
    FIELD_LENGTH: {
        MAX_LENGTH_REDRESSNUMBER: 15,
        MAX_LENGTH_NAME: 35,
        MAX_LENGTH_SURNAME: 50,
        MAX_LENGTH_FIRST_SURNAME: 25,
        MAX_LENGTH_LAST_SURNAME: 25,
        MAX_LENGTH_IBERIA_CARD: 18,
        MAX_LENGTH_OTHER_FREQUENTFLYER_CARD: 18,
        MAX_LENGTH_DNI: 9,
        MAX_LENGTH_MANDATORY_DOC: 20,
        MAX_LENGTH_ZIP_CODE: 10,
        MAX_LENGTH_PIN: 20,
        MIN_LENGTH_PIN: 6,
        MAX_LENGTH_ADDITIONAL_FIELD: 30,
        MAX_LENGTH_MANDATORY_DOC_RUC: 11,
        MAX_LENGTH_EMAIL: 60,
        MAX_LENGTH_LARGE_FAMILY_DOC: 25
    },
    //errors code name
    bookingErrorsService: {
        serviceGeneralError: 'REST_SERVICE_ERROR_GENERAL',
        LOGGED_ERROR_TITLE: 'GENERAL_ADVICE_TITLE',
        LOGGED_ERROR_BODY: 'GENERAL_LOGGED_ERROR_BODY',
        JSON_MAPPING_EXCEPTION: 'JSON_MAPPING_EXCEPTION',
        UNEXPECTED_TECHNICAL_EXCEPTION: 'UNEXPECTED_TECHNICAL_EXCEPTION',
        FARE_NOT_FOUND: 'fare not found'
    },
    bookingErrorLiterals: {
        JSON_MAPPING_EXCEPTION: 'REST_SERVICE_ERROR_UNEXPECTED',
        UNEXPECTED_TECHNICAL_EXCEPTION: 'REST_SERVICE_ERROR_UNEXPECTED',
        FARE_NOT_FOUND: 'REST_SERVICE_ERROR_OFFER'
    },
    QUADRIGAMS: {
        CONFIRMATION: 'IBBKCF',
        PAYMENTS: 'IBPURC',
        AVAILABILITY: 'IBOWFS',
        REDEMPTION_AVAILABILITY: 'IPEVFA',
        ONB_REDEMPTION_PASSENGERS: 'CIPIPAIRP',
        REDEMPTION_PASSENGERS: 'IPAIRP',
        ONB_REDEMPTION_AVAILABILITY: 'CIPIPOWFS',
        ONB_REDEMPTION_NOT_AVAILABILITY: 'OBERRA',
        NOT_AVAILABILITY: 'CALDIT',
        PASSENGERS_INFO: 'IBAIRP',
        ON_HOLD: 'ONHOLD',
        ANCILLARIES: 'IBCMTV',
        ALP: 'IBPBAH',
        ON_HOLD_CONF: 'OHMTDT',
        ON_HOLD_CONF_LOGIN: 'OHLOIN',
        ON_HOLD_CONFIRMATION: 'OHBKCF',
        CONFIRMATION_COMMUNICATION_LOST: 'IBBKER',
        PAYMENTS_PCC: 'IBPCC',
        PAYMENTS_REJECTED: 'IBREJC',
        PAYMENTS_DENIED: 'IBCCDN',
        PAYMENTS_CANCELLED: 'IBCNCL',
        BK_ERROR: 'IBBKERROR',
        REDIRECTION_MARKET: 'IBREDNM',
        MULTI_AVAILABILITY: 'MTVAIL',
        MULTI_NOT_AVAILABILITY: 'MTCALD',
        MULTI_PASSENGERS_INFO: 'MTAIRP',
        MULTI_ANCILLARIES: 'MTCMTV',
        MULTI_PAYMENTS: 'MTPURC',
        MULTI_BK_ERROR: 'MTUNKN',
        MULTI_PAYMENTS_PCC: 'MTPCC',
        MULTI_CONFIRMATION_COMMUNICATION_LOST: 'MTBKER',
        MULTI_PAYMENTS_DENIED: 'MTCCDN',
        MULTI_PAYMENTS_REJECTED: 'MTREJC',
        MULTI_CONFIRMATION: 'MTBKCF',
        MULTI_ORIGIN: 'IBMUSE',
        HMAD_AVAILABILITY: 'HMVAIL',
        HMAD_NOT_AVAILABILITY: 'HMCALD',
        HMAD_PASSENGERS_INFO: 'HMAIRP',
        HMAD_ANCILLARIES: 'HMCMTV',
        HMAD_PAYMENTS: 'HMPURC',
        HMAD_BK_ERROR: 'HMUNKN',
        HMAD_PAYMENTS_PCC: 'HMPCC',
        HMAD_CONFIRMATION_COMMUNICATION_LOST: 'HMBKER',
        HMAD_PAYMENTS_DENIED: 'HMCCDN',
        HMAD_PAYMENTS_REJECTED: 'HMREJC',
        HMAD_CONFIRMATION: 'HMBKCF',
        ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION: 'CNCLIT',
        ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
        PA_SHUTTLE_FARE: 'PAFARE',
        PA_SHUTTLE_REDENTION_FARE: 'RPAFARE',
        PA_SHUTTLE_ONB_FARE: 'CIPPAFARE',
        PA_SHUTTLE_ONB_REDENTION_FARE: 'CIPRPAFARE',
        PA_PASSENGERS: 'PAAIRP',
        PA_PASSENGERS_REDENTION: 'RPAAIRP',
        PA_PASSENGERS_ONB: 'CIPPAAIRP',
        PA_PASSENGERS_ONB_REDENTION: 'CIPRPAAIRP',
        BKI_PAYMENT: 'IBPURC',
        BKI_CONFIRMATION: 'IBBKCF',
        BKIOH_PAYMENT: 'ONHOLD',
        BKIOH_PAYMENTS_NEW: 'ONHDES',
        BKIOH_CONFIRMATION: 'OHBKCF',
        BKIOH_CONFIRMATION_NEW: 'OHBKCD',
        BKI_CONFIRMATION_NEW: 'BKCONF',
        BKI_CONFIRMATION_COH_NEW: 'RTBKCD',
        BKI_PAYMENTS_NEW: 'PAYINF',
        BKI_PAYMENTS_COH_NEW: 'OHINFD',
        RECAP: 'IBSUMM',
        BKI_ERROR_PET_NOT_AVAILABLE: 'ERRPET',
        BK_ERROR_AVAILABILITY: 'DIS404',
        BK_ERROR_AKAMAI: 'IBAISE'
    },
    dateMarkets: {
        ES: 'ES',
        US: 'US',
        GQ: 'GQ'
    },
    dateLanguages: {
        EN: 'en',
        DE: 'de',
        PT: 'pt',
        NL: 'nl',
        FR: 'fr'
    },
    PAGES_URL: {
        SEARCH_ENGINE: '/',
        GQ: 'GQ'
    },
    PAYMENT_ORDER_ITEMS_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER'
    },
    PAYMENT_CREDIT_CAR_TYPES: {
        NEW_CARD: 'newCard',
        VOUCHER: 'VOUCHER'
    },
    BOOKING_PARAMS_NAMES: {
        MARKET: ['PointOfSaleCountry', 'market', 'bookingMarket'],
        LANGUAGE: ['UserLanguage', 'language'],
        ORIGIN: ['Origin', 'BEGIN_CITY_0'],
        DESTINATION: ['Destination', 'END_CITY_0'],
        SENIOR: ['YCD'],
        ADULT: ['Adult', 'ADT'],
        CHILD: ['Child', 'CHD', 'Infant'],
        INFANT: ['InfantLap', 'INF'],
        YOUNG: ['YTH'],
        TEENAGER: ['BNN'],
        FLEXIBLE_DATES: ['fechasFlex', 'flexible'],
        DEPARTURE_DATE: ['DepartureDate', 'BEGIN_DAY_0', 'BEGIN_MONTH_0'],
        INBOUND_DATE: ['DepartureDateFake', 'END_DAY_0', 'END_MONTH_0'],
        CODE_ERROR: ['codeError'],
        SEARCH_ORIGIN: ['origenBusqueda', 'quadrigam'],
        WEB_MODE: ['modeWeb'],
        TRIP_TYPE: ['TripType', 'TRIP_TYPE'],
        RESIDENT: ['residentCode', 'residente'],
        LARGE_FAMILY_TYPE: ['familianumerosa', 'familiaNumerosaTipo'],
        IB_GROUP: ['IB_GROUP'],
        PREFERED_CLASS: ['clasePrefer', 'FARE_TYPE'],
        AVIOS_PAY: ['pagoAvios'],
        POINTS_PAY: ['pagoPuntos'],
        CHANNEL: ['channel'],
        DEVICE: ['device'],
        REFERRALID: ['ReferralId'],
        DISPLAYEDPRICE: ['DisplayedPrice'],
        FLIGHTNUMBER: ['FlightNumber'],
        BOOKINGCODE: ['BookingCode'],
        CARRIER: ['Carrier'],
        CABIN: ['Cabin'],
        SLICE: ['Slice'],
        PRICECURRENCY: ['DisplayedPriceCurrency'],
        USERCURRENCY: ['UserCurrency'],
        NUMTRIPS: ['numTrayectos'],
        BACKTOURL: ['backtourl'],
        BEGIN_CITY: ['BEGIN_CITY_01'],
        END_CITY: ['END_CITY_01'],
        BEGIN_DAY: ['BEGIN_DAY_01'],
        BEGIN_MONTH: ['BEGIN_MONTH_01'],
        BEGIN_YEAR: ['BEGIN_YEAR_01'],
        END_DAY: ['END_DAY_01'],
        END_MONTH: ['END_MONTH_01'],
        END_YEAR: ['END_YEAR_01'],
        FARE_TYPE: ['FARE_TYPE'],
        FARE_TYPE_END: ['FARE_TYPE_END'],
        CODE_TRACKING: ['codeTracking'],
        TRAVEL_AGENT: ['travelAgent'],
        FARE_CODE: ['FareCode'],
        CHECK_AVIOS: ['CHECK_AVIOS'],
        CHECK_POINTS: ['check_point'],
        MARKET_FROM: ['fromMarket'],
        LANGUAGE_FROM: ['fromLanguage'],
        FLASH_OFFER: ['flashOffer'],
        METASEARCH_CABIN: ['Cabin1'],
        STOPOVER_LEG: ['StopoverLeg'],
        PNR: ['pnr'],
        SURNAME: ['surname'],
        PETS_FLIGHT: ['isPetFlight']
    },
    BOOKING_PARAMS_VALUES: {
        META_ONE_WAY: 'OneWay',
        META_ROUND_TRIP: 'RoundTrip'
    },
    CONDITION_TYPES: {
        HAND_BAGGAGE: 'EQMANO',
        CHECKED_BAGGAGE: 'EQBODEGA',
        SEAT: 'ASIENTO',
        CHANGE: 'CAMBIO',
        REFUND: 'REEMBOLSO',
        FOOD: 'COMIDA',
        REEMBOLSO: 'REEMBOLSO'
    },
    ANCILLARIES_TYPES: {
        BAGGAGE: 'BAGGAGE',
        SEAT: 'SEAT',
        INSURANCE: 'INSURANCE',
        VEHICLE_RENTAL: 'VEHICLE_RENTAL',
        UPGRADING: 'UPGRADING',
        SPEQ: 'SPECIAL_EQUIPMENT',
        BOB: 'BOB',
        INTEGRATED_BOB: 'INTEGRATED_BOB',
        SPECIAL_MEALS: 'SPECIAL_MEALS',
        UPGRADING_BID: 'UPGRADING_BID',
        FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
        PREORDER: 'PREORDER',
        PRIORITY_BOARDING: 'PRIORITY_BOARDING',
        THIRD_PARTY_COMPANIES: 'THIRD_PARTY_COMPANIES',
        CO2_FOOTPRINT: 'CO2_FOOTPRINT',
        ALLIANZ_FUSION: 'ALLIANZ_FUSION',
        TRANSFERS: 'TRANSFERS',
        GLOBICK: 'GLOBICK',
        WINE_CLUB: 'WINE_CLUB',
        PET: 'PET',
        ASSIST_CARD: 'ASSIST_CARD'
    },
    RESIDENT_CITIES: {
        RM: 'MELILLA',
        RC: 'CANARIAS',
        BP: 'BALEARES',
        BI: 'BALEARES',
        DC: 'CANARIAS',
        RE: 'CEUTA'
    },
    FAMILIES_TYPES: {
        F2: 'SPECIAL',
        F1: 'GENERAL',
        RE: 'CEUTA'
    },
    CABIN_TYPES: {
        ECONOMY: 'ECONOMY',
        PREMIUM_TOURIST: 'PREMIUMTOURIST',
        BUSINESS: 'BUSINESS',
        PREMIUMECONOMY: 'PREMIUMECONOMY'
    },
    WCS: {
        PHONE_TYPES: {
            SALES: 'RESERVAS'
        },
        PREMIUMECONOMY: 'PREMIUMECONOMY'
    },
    FLOW_APP: {
        PAOB: 'PAOB',
        PARE: 'PARE',
        PAOBONB: 'PAOBONB',
        PAREONB: 'PAREONB'
    },
    FLOW_STEPS_INFO: {
        ibairp: { allowedSteps: [RouterPathsConstants.ibairp, RouterPathsConstants.availability, RouterPathsConstants.ibpbah, RouterPathsConstants.ibshuttle, RouterPathsConstants.flightsRecap] },
        ibpurc: { allowedSteps: [RouterPathsConstants.ibpurc, RouterPathsConstants.ibairp, RouterPathsConstants.ibcmtv, RouterPathsConstants.availability] }
    },
    TIME: {
        hours: [
            { id: 0, name: '00' },
            { id: 1, name: '01' },
            { id: 2, name: '02' },
            { id: 3, name: '03' },
            { id: 4, name: '04' },
            { id: 5, name: '05' },
            { id: 6, name: '06' },
            { id: 7, name: '07' },
            { id: 8, name: '08' },
            { id: 9, name: '09' },
            { id: 10, name: '10' },
            { id: 11, name: '11' },
            { id: 12, name: '12' },
            { id: 13, name: '13' },
            { id: 14, name: '14' },
            { id: 15, name: '15' },
            { id: 16, name: '16' },
            { id: 17, name: '17' },
            { id: 18, name: '18' },
            { id: 19, name: '19' },
            { id: 20, name: '20' },
            { id: 21, name: '21' },
            { id: 22, name: '22' },
            { id: 23, name: '23' }
        ],
        minutes: [
            { id: 0, name: '00' },
            { id: 1, name: '05' },
            { id: 2, name: '10' },
            { id: 3, name: '15' },
            { id: 4, name: '20' },
            { id: 5, name: '25' },
            { id: 6, name: '30' },
            { id: 7, name: '35' },
            { id: 8, name: '40' },
            { id: 9, name: '45' },
            { id: 10, name: '50' },
            { id: 11, name: '55' }
        ]
    },
    OPTIONS_PASSENGERS_METASEARCH: {
        options: [
            { type: 'ADULT', option: [1, 2, 3, 4, 5, 6, 7, 8, 9], value: null }, /* value: 'ADULTS(+12 AÑOS)' */
            { type: 'CHILD', option: [0, 1, 2, 3, 4, 5, 6, 7, 8], value: null }, /* value: 'KIDS (2-11 AÑOS)' */
            { type: 'INFANT', option: [0, 1, 2, 3, 4, 5, 6, 7, 8], value: null } /*  value: 'BABYS (-2AÑOS)' */
        ]
    },
    SERVICE_WAITING_TIMES: {
        ISSUE_INFO_WAITING_TIME_INTERVAL: 3000,
        ISSUE_INFO_K0_WAITING_TIME: 30000,
        ISSUE_INFO_OK_WAITING_TIME: 120000,
        ANCILLARIES_WAITING_TIME_INTERVAL: 25000
    },
    PAYMENTS: {
        MERCHANT_ID: 'IBERIA',
        ORG_ID: 'k8vif92e'
    },
    searchFlightType: {
        redemption: 'redemptionFlight',
        redemptionOB: 'redemptionOBFlight'
    },
    LOGIN_ONB: 'ONB',
    HMAD_QUALIFIER_CODE: 'HM',
    CITY_AIRPORTS_METASEARCH: {
        cities: [
            {
                code: 'BKK',
                description: 'Bangkok',
                timezone: 'Asia/Bangkok',
                country: {
                    code: 'TH',
                    description: 'Tailandia'
                },
                airports: [
                    {
                        code: 'BKK'
                    },
                    {
                        code: 'DMK'
                    }
                ]
            },
            {
                code: 'BER',
                description: 'Berlín',
                timezone: 'Europe/Berlin',
                country: {
                    code: 'DE',
                    description: 'Alemania'
                },
                airports: [
                    {
                        code: 'TXL'
                    },
                    {
                        code: 'SXF'
                    }
                ]
            },
            {
                code: 'BRU',
                description: 'Bruselas',
                timezone: 'Europe/Brussels',
                country: {
                    code: 'BE',
                    description: 'Bélgica'
                },
                airports: [
                    {
                        code: 'BRU'
                    },
                    {
                        code: 'CRL'
                    }
                ]
            },
            {
                code: 'BUE',
                description: 'Buenos Aires',
                timezone: 'America/Buenos_Aires',
                country: {
                    code: 'AR',
                    description: 'Argentina'
                },
                airports: [
                    {
                        code: 'EZE'
                    },
                    {
                        code: 'AEP'
                    }
                ]
            },
            {
                code: 'CHI',
                description: 'Chicago',
                timezone: 'US/Central',
                country: {
                    code: 'US',
                    description: 'USA'
                },
                airports: [
                    {
                        code: 'ORD'
                    },
                    {
                        code: 'MDW'
                    }
                ]
            },
            {
                code: 'STO',
                description: 'Estocolmo',
                timezone: 'Europe/Stockholm',
                country: {
                    code: 'SE',
                    description: 'Suecia'
                },
                airports: [
                    {
                        code: 'ARN'
                    },
                    {
                        code: 'BMA'
                    }
                ]
            },
            {
                code: 'FRA',
                description: 'Frankfurt',
                timezone: 'Europe/Berlin',
                country: {
                    code: 'DE',
                    description: 'Alemania'
                },
                airports: [
                    {
                        code: 'FRA'
                    },
                    {
                        code: 'HHN'
                    }
                ]
            },
            {
                code: 'HOU',
                description: 'Houston',
                timezone: 'US/Central',
                country: {
                    code: 'US',

                    description: 'USA'
                },
                airports: [
                    {
                        code: 'IAH'
                    },
                    {
                        code: 'HOU'
                    }
                ]
            },
            {
                code: 'LON',
                description: 'Londres',
                timezone: 'Europe/London',
                country: {
                    code: 'GB',
                    description: 'Reino Unido'
                },
                airports: [
                    {
                        code: 'LHR'
                    },
                    {
                        code: 'LGW'
                    },
                    {
                        code: 'LCY'
                    }
                ]
            },
            {
                code: 'MEL',
                description: 'Melbourne',
                timezone: null,
                country: {
                    code: 'AU',
                    description: 'Australia'
                },
                airports: [
                    {
                        code: 'MEL'
                    },
                    {
                        code: 'AVV'
                    }, {
                        code: 'MEB'
                    }
                ]
            },
            {
                code: 'MIL',
                description: 'Milán',
                timezone: 'Europe/Rome',
                country: {
                    code: 'IT',
                    description: 'Italia'
                },
                airports: [
                    {
                        code: 'MXP'
                    },
                    {
                        code: 'LIN'
                    }
                ]
            },
            {
                code: 'MOW',
                description: 'Moscú',
                timezone: 'Europe/Moscow',
                country: {
                    code: 'RU',
                    description: 'Rusia'
                },
                airports: [
                    {
                        code: 'DME'
                    },
                    {
                        code: 'VKO'
                    },
                    {
                        code: 'SVO'
                    }
                ]
            },
            {
                code: 'NYC',
                description: 'Nueva York',
                timezone: 'US/Eastern',
                country: {
                    code: 'US',
                    description: 'USA'
                },
                airports: [
                    {
                        code: 'JFK'
                    },
                    {
                        code: 'EWR'
                    },
                    {
                        code: 'LGA'
                    }
                ]
            },
            {
                code: 'PAR',
                description: 'París',
                timezone: 'Europe/Paris',
                country: {
                    code: 'FR',
                    description: 'Francia'
                },
                airports: [
                    {
                        code: 'CDG'
                    },
                    {
                        code: 'ORY'
                    }
                ]
            },
            {
                code: 'REK',
                description: 'Reikiavik',
                timezone: 'Europe/Copenhagen',
                country: {
                    code: 'IS',
                    description: 'Islandia'
                },
                airports: [
                    {
                        code: 'KEF'
                    },
                    {
                        code: 'RKV'
                    }
                ]
            },
            {
                code: 'TCI',
                description: 'Tenerife',
                timezone: 'Atlantic/Canary',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'TFN'
                    },
                    {
                        code: 'TFS'
                    }
                ]
            },
            {
                code: 'WAS',
                description: 'Washington DC',
                timezone: 'US/Eastern',
                country: {
                    code: 'US',
                    description: 'USA'
                },
                airports: [
                    {
                        code: 'IAD'
                    },
                    {
                        code: 'DCA'
                    },
                    {
                        code: 'BWI'
                    }
                ]
            },
            {
                code: 'ROM',
                description: 'Roma',
                timezone: 'Europe/Rome',
                country: {
                    code: 'IT',
                    description: 'Italia'
                },
                airports: [
                    {
                        code: 'FCO'
                    }
                ]
            },
            {
                code: 'DKR',
                description: 'Dakar',
                timezone: 'Africa/Dakar',
                country: {
                    code: 'SN',
                    description: 'Senegal'
                },
                airports: [
                    {
                        code: 'DSS'
                    }
                ]
            },
            {
                code: 'RIO',
                description: 'Río de Janeiro',
                timezone: 'America/Sao_Paulo',
                country: {
                    code: 'BR',
                    description: 'Brasil'
                },
                airports: [
                    {
                        code: 'GIG'
                    }
                ]
            },
            {
                code: 'SAO',
                description: 'Sao Paulo',
                timezone: 'America/Sao_Paulo',
                country: {
                    code: 'BR',
                    description: 'Brasil'
                },
                airports: [
                    {
                        code: 'GRU'
                    }
                ]
            },
            {
                code: 'RGS',
                description: 'Burgos',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'XJU'
                    }
                ]
            },
            {
                code: 'BUH',
                description: 'Bucarest',
                timezone: 'Europe/Bucharest',
                country: {
                    code: 'RO',
                    description: 'Rumania'
                },
                airports: [
                    {
                        code: 'OTP'
                    }
                ]
            },
            {
                code: 'EAP',
                description: 'Basilea',
                timezone: 'Europe/Zurich',
                country: {
                    code: 'CH',
                    description: 'Suiza'
                },
                airports: [
                    {
                        code: 'BSL'
                    }
                ]
            },
            {
                code: 'BHZ',
                description: 'Belo Horizonte',
                timezone: 'America/Belo Horizonte',
                country: {
                    code: 'BR',
                    description: 'Brasil'
                },
                airports: [
                    {
                        code: 'CNF'
                    }
                ]
            },
            {
                code: 'SHA',
                description: 'Shanghái',
                timezone: 'Asia/Shanghai',
                country: {
                    code: 'CN',
                    description: 'China'
                },
                airports: [
                    {
                        code: 'PVG'
                    }
                ]
            },
            {
                code: 'DTT',
                description: 'Detroit',
                timezone: 'US/Eastern',
                country: {
                    code: 'US',
                    description: 'USA'
                },
                airports: [
                    {
                        code: 'DTW'
                    }
                ]
            },
            {
                code: 'OSA',
                description: 'Osaka',
                timezone: 'Asia/Tokyo',
                country: {
                    code: 'JP',
                    description: 'Japón'
                },
                airports: [
                    {
                        code: 'ITM'
                    }
                ]
            },
            {
                code: 'TYO',
                description: 'Tokio',
                timezone: 'Asia/Tokyo',
                country: {
                    code: 'JP',
                    description: 'Japón'
                },
                airports: [
                    {
                        code: 'NRT'
                    }
                ]
            },
            {
                code: 'YMQ',
                description: 'Montreal',
                timezone: 'America/Montreal',
                country: {
                    code: 'CA',
                    description: 'Canadá'
                },
                airports: [
                    {
                        code: 'YUL'
                    }
                ]
            },
            {
                code: 'YTO',
                description: 'Toronto',
                timezone: 'America/Montreal',
                country: {
                    code: 'CA',
                    description: 'Canadá'
                },
                airports: [
                    {
                        code: 'YYZ'
                    }
                ]
            },
            {
                code: 'JKT',
                description: 'Yakarta',
                timezone: 'Asia/Yakarta',
                country: {
                    code: 'ID',
                    description: 'Indonesia'
                },
                airports: [
                    {
                        code: 'CGK'
                    }
                ]
            },
            {
                code: 'ZAZ',
                description: 'Zaragoza',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'XZZ'
                    },
                    {
                        code: 'RZG'
                    }
                ]
            },
            {
                code: 'SVQ',
                description: 'Sevilla',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'XQA'
                    },
                    {
                        code: 'EVI'
                    }
                ]
            },
            {
                code: 'AGP',
                description: 'Málaga',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'YJM'
                    }
                ]
            },
            {
                code: 'ODB',
                description: 'Córdoba',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'XOJ'
                    },
                    {
                        code: 'CBA'
                    }
                ]
            },
            {
                code: 'VLL',
                description: 'Valladolid',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'XIV'
                    },
                    {
                        code: 'XJN'
                    }
                ]
            },
            {
                code: 'VLC',
                description: 'Valencia',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'YJV'
                    }
                ]
            },
            {
                code: 'ALC',
                description: 'Alicante',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'YJE'
                    },
                    {
                        code: 'ACQ'
                    }
                ]
            },
            {
                code: 'LEN',
                description: 'León',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'EEU'
                    },
                    {
                        code: 'LZB'
                    }
                ]
            },
            {
                code: 'SLM',
                description: 'Salamanca',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'SEJ'
                    },
                    {
                        code: 'SAJ'
                    }
                ]
            },
            {
                code: 'PNA',
                description: 'Pamplona',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'EEP'
                    }
                ]
            },
            {
                code: 'ABC',
                description: 'Albacete',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'EEM'
                    },
                    {
                        code: 'XJJ'
                    }
                ]
            },
            {
                code: 'GRX',
                description: 'Granada',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'YJG'
                    },
                    {
                        code: 'GBX'
                    }
                ]
            },
            {
                code: 'MJV',
                description: 'Murcia',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: 'España'
                },
                airports: [
                    {
                        code: 'XUT'
                    },
                    {
                        code: 'EMU'
                    }
                ]
            }
        ]
    },
    CODE_LANGUAGE_PAYPAL: {
        CODES: [{
            language: 'es',
            paypalLanguage: 'es_ES'
        }, {
            language: 'ca',
            paypalLanguage: 'es_ES'
        }, {
            language: 'de',
            paypalLanguage: 'de_DE'
        }, {
            language: 'en',
            paypalLanguage: 'en_US'
        }, {
            language: 'fr',
            paypalLanguage: 'fr_FR'
        }, {
            language: 'it',
            paypalLanguage: 'it_IT'
        }, {
            language: 'zh',
            paypalLanguage: 'zh_CN'
        }, {
            language: 'ja',
            paypalLanguage: 'ja_JP'
        }, {
            language: 'nl',
            paypalLanguage: 'nl_NL'
        }, {
            language: 'pt',
            paypalLanguage: 'pt_PT'
        }, {
            language: 'ru',
            paypalLanguage: 'ru_RU'
        }]
    },
    LATAM_MARKETS_HMAD: {
        CODES: ['AR', 'BR', 'CO', 'CL', 'CR', 'CU', 'EC', 'SV', 'GT', 'MX', 'PA', 'PE', 'UY']
    },
    REDEMPTION_AVAILABILITY_PROVIDERS: {
        MULTINUCLEO: 'MN',
        AMADEUS: 'AWS',
        COMPOSITE: 'COMPOSITE'
    },
    REDEMPTION_AVIOS_REDIRECTED_MARKETS: {
        AR: { marketRedirect: 'US' },
        AT: { marketRedirect: 'ES' },
        BR: { marketRedirect: 'US' },
        CL: { marketRedirect: 'US' },
        CN: { marketRedirect: 'US' },
        CO: { marketRedirect: 'US' },
        CR: { marketRedirect: 'US' },
        CU: { marketRedirect: 'ES' },
        CZ: { marketRedirect: 'ES' },
        DK: { marketRedirect: 'ES' },
        DO: { marketRedirect: 'US' },
        DZ: { marketRedirect: 'FR' },
        EC: { marketRedirect: 'US' },
        FI: { marketRedirect: 'ES' },
        GR: { marketRedirect: 'ES' },
        GT: { marketRedirect: 'US' },
        HU: { marketRedirect: 'ES' },
        IL: { marketRedirect: 'US' },
        IE: { marketRedirect: 'ES' },
        JP: { marketRedirect: 'US', localesRedirect: { ja: 'en' } },
        MA: { marketRedirect: 'FR' },
        MX: { marketRedirect: 'US' },
        PA: { marketRedirect: 'US' },
        PE: { marketRedirect: 'US' },
        PR: { marketRedirect: 'US' },
        RU: { marketRedirect: 'ES', localesRedirect: { ru: 'en' } },
        SE: { marketRedirect: 'ES' },
        SN: { marketRedirect: 'FR' },
        SV: { marketRedirect: 'US' },
        UY: { marketRedirect: 'US' },
        CA: { marketRedirect: 'US', localesRedirect: { fr: 'en' } },
        QA: { marketRedirect: 'US'}
    },
    REDEMPTION_POINTS_REDIRECTED_LANG: {
        'AR': 'es',
        'BR': 'es',
        'CL': 'es',
        'CO': 'es',
        'CR': 'es',
        'CU': 'es',
        'DE': 'en',
        'EC': 'es',
        'GB': 'en',
        'GT': 'es',
        'IT': 'en',
        'MX': 'es',
        'PA': 'es',
        'PE': 'es',
        'PR': 'es',
        'SV': 'es',
        'US': 'en',
        'UY': 'es',
        'VE': 'es'
    },
    REFERRAL_URL_PARAM: 'referralURL',
    MODAL_PAYMENT_LUGGAGE_INFO: 'ib-modal-payment-luggage-info.html',
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
    DISCOUNT_TYPES: {
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER',
        AVIOS_REDEMPTION: 'AVIOS_REDEMPTION',
        POINTS_REDEMPTION: 'POINTS_REDEMPTION',
        RESIDENT: 'RES',
        LARGE_FAMILY: 'LGF',
        DUMBO: 'DUMBO',
        PLUTO: 'PLUTO',
        PARTNER: 'PARTNER',
        DYNAMIC_PRICING: 'DYNAMIC_PRICING',
        CORPORATE: 'CORPORATE',
        REWARDS: 'REWARDS'
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
    OB_ROLES_WITH_PERMISSION: ['I_COMP_AUT', 'I_COMP_ADM'],
    FLEXIBILITY_COMMERCIAL_CODE: {
        ECONOMY: 'Básica',
        ECONOMYPLUS: 'Básica +',
        OPTIMAL: 'Óptima',
        BUSINESSPROMO: 'Business Promocional',
        ECONOMYPREMPROMO: 'Turista Premium Promocional',
        ECONOMYLEVEL: 'Básica LEVEL',
        CONFORT: 'Confort',
        TURPREMOPTFLEX: 'Turista Premium Óptima Flex',
        TURPREMOP: 'Turista Premium Óptima',
        TURBASLEVEL: 'Básica LEVEL',
        BUSINESOP: 'Business Óptima',
        BUSINESCONF: 'Business Confort',
        BUSINESFLEX: 'Business Flexible',
        FLEX: 'Flexible',
        TURPREMFLEX: 'Turista Premium Flexible'

    },
    COMMERCIAL_DATE_FORMATS: {
        LONG: 'long',
        MEDIUM: 'medium',
        SHORT: 'short'
    },
    DATA_TO_GENERATE_URL_METAS: {
        REFERRAL_ID: 'shoppingCartRecovery',
        CLEAN_URL_PARAM_METASEARCH: [
            'ReferralId',
            'utm_source',
            'utm_medium',
            'gclid',
            'gclsrc',
            'cod_crm',
            'utm_campaign',
            'utm_content',
            'kayakclickid',
            'skyscanner_redirectid',
            'residentCode',
            'familianumerosa'
        ],
        KEEP_URL_PARAMS: ['market', 'language', 'bookingMarket'],
        PRICE_URL_PARAMS: {
            PRICE: 'DisplayedPrice',
            CURRENCY: 'DisplayedPriceCurrency'
        },
        FLIGHT_URL_PARAMS: {
            TYPE: 'TripType',
            FLASH_TYPE: 'TRIP_TYPE',
            FLASH_TYPE_RT: 'ROUND-TRIP',
            FLASH_TYPE_OW: 'ONE-WAY',
            SLICE: 'Slice',
            CABIN: 'Cabin',
            CARRIER: 'Carrier',
            FARE_CODE: 'FareCode',
            BOOKING_CODE: 'BookingCode',
            DEPARTURE_DATE: 'DepartureDate',
            ORIGIN: 'Origin',
            FLASH_ORIGIN: 'BEGIN_CITY_01',
            DESTINATION: 'Destination',
            FLASH_DESTINATION: 'END_CITY_01',
            FLIGHT_NUMBER: 'FlightNumber',
            REFERRAL_CODE: 'ReferralId',
            FLASH_OFFER_TYPE: 'FLASH_OFFER_TYPE',
            FLASH_TYPE_ACTIVE: 'ACTIVE',
            FLASH_OFFER_ID: 'FLASH_OFFER_ID'
        },
        DISCOUNTS_URL_PARAMS: {
            RESIDENT: 'RESIDENT',
            LARGE_FAMILY: 'LARGE_FAMILY_TYPE'
        },
        FLASH_PATHNAME: '/flash-offers/',
        FLASHD_QUADRIGAM: '#!/FLASHD'
    },
    ONB_REDEMPTION_SEARCH__PATHNAME: '/buscador-vuelos-con-puntos/',
    FLIGHT_SEARCH_FLOWS: {
        STOPOVER: 'STOPOVER',
        PA_OPEN: 'PAOPEN',
        OPENJAW: 'OPENJAW'
    },
    FLIGHT_SEARCH_TYPE: {
        OUTBOUND: 'outbound',
        RETURN: 'return',
        MULTICITY: 'multicity'
    },
    FARE_CABIN_TYPE: {
        TURIST: 'E',
        BUSINESS_CLASS: 'B',
        TURIST_PREMIUM: 'N',
        TURIST_PREMIUM_T: 'T'
    },
    FARE_COMERCIAL_NAME_ES: {
        BASICA: 'basica',
        BASICA_LEVEL: 'basica-level',
        OPTIMA: 'optima',
        CONFORT: 'confort',
        CONFORT_BALEARES: 'confort-baleares',
        CONFORT_CANARIAS: 'confort-canarias',
        CONFORT_PUENTE_AEREO: 'puente-aereo-confort',
        CORPORATE: 'corporate',
        FLEXIBLE: 'flexible',
        FLEXIBLE_BALEARES: 'flexible-baleares',
        FLEXIBLE_CANARIAS: 'flexible-canarias',
        FLEXIBLE_PUENTE_AEREO: 'puente-aereo-flexible',
        OPTIMA_FLEXIBLE: 'optima-flex',
        TURISTA_PREMIUM_CORPORATE: 'turista-premium-corporate',
        TURISTA_PREMIUM_PROMOCIONAL: 'turista-premium-promocional',
        TURISTA_PREMIUM_OPTIMA: 'turista-premium-optima',
        TURISTA_PREMIUM_OPTIMA_FLEX: 'turista-premium-optima-flex',
        TURISTA_PREMIUM_FLEXIBLE: 'turista-premium-flexible',
        TURISTA_PREMIUM_PROMOCIONAL_FLEX: 'turista-premium-promocional-flex',
        TURISTA_PUENTE_AEREO: 'turista-puente-aereo',
        BUSINESS_PROMOCIONAL: 'business-promocional',
        TURISTA_PREMIUM_OPTIMA_FLEXIBLE: 'turista-premium-flexible',
        BUSINESS_OPTIMA: 'business-optima',
        BUSINESS_CONFORT: 'business-confort',
        BUSINESS_CONFORT_BALEARES: 'business-confort-baleares',
        BUSINESS_CONFORT_CANARIAS: 'business-confort-canarias',
        BUSINESS_CORPORATE: 'business-corporate',
        BUSINESS_FLEXIBLE: 'business-flexible',
        BUSINESS_FLEXIBLE_BALEARES: 'business-flexible-baleares',
        BUSINESS_FLEXIBLE_CANARIAS: 'business-flexible-canarias',
        BUSINESS_PROMOCIONAL_FLEX: 'business-promocional-flex',
        BUSINESS_PUENTE_AEREO: 'business-puente-aereo'

    },
    UPSELLING: {
        FARE: {
            OPTIMA_LEVEL: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951060.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_OPTIMAL_1',
                    subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_OPTIMAL_1'
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/meals.png',
                    description: 'UPSELLING_FARE_INCLUDED_FOOD',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/3336200.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_OPTIMAL_2',
                    subdescription: ''
                }
            ],
            OPTIMA: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951060.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_OPTIMAL_1',
                    subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_OPTIMAL_1'
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/3336200.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_OPTIMAL_2',
                    subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_OPTIMAL_2'
                }
            ],
            CONFORT: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951062.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_CONFORT_1',
                    subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_CONFORT_1'
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
                    subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_CONFORT_2'
                }
            ],
            LH_CONFORT: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951065.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_LH_CONFORT_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
                    subdescription: 'UPSELLING_FARE_EXTRA_SUBDESCRIPTION_CONFORT_2'
                }

            ],
            BU_CONFORT: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951061.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951065.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_2',
                    subdescription: ''
                },
                {
                    icon1: '/iberia-web-content/iconos/upselling/1951064.png',
                    icon2: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                    subdescription: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_4'
                }
            ],
            BU_CONFORT_LATAM: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951065.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_2',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951064.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_3',
                    subdescription: ''
                }
            ],
            BU_FLEX: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951064.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_2',
                    subdescription: ''
                }
            ],
            ECONOMY_OPTIMA_FLEX_ES: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951061.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                    subdescription: ''
                },
                {
                    icon1: '/iberia-web-content/iconos/upselling/1951064.png',
                    icon2: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                    subdescription: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_4'
                }
            ],
            ECONOMY_OPTIMA_FLEX: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951064.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_LATAM_3',
                    subdescription: ''
                }
            ],
            PREMIUM_ECONOMY_FLEXIBLE: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951061.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951064.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_CONFORT_3',
                    subdescription: ''
                }
            ],
            ECONOMY_FLEXIBLE: [
                {
                    icon: '/iberia-web-content/iconos/upselling/1951064.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_1',
                    subdescription: ''
                },
                {
                    icon: '/iberia-web-content/iconos/upselling/1951063.png',
                    description: 'UPSELLING_FARE_EXTRA_DESCRIPTION_BU_FLEX_2',
                    subdescription: ''
                }
            ]
        },
        AVAILABLE_FARES: ['optima', 'confort', 'optima-flexible', 'flexible', 'turista-premium-optima', 'turista-premium-optima-flex', 'turista-premium-flexible', 'business-confort', 'business-flexible']
    },
    LINK_TARGETS: {
        BLANK: '_blank',
        SELF: '_self'
    },
    AVAILABLE_REFACTOR: true,
    PARTNERS_INFO: {
        USER_PREFERENCES_KEY: 'ib-booking-partnerPreferences',
        USER_PREFERENCES_MAXSTORAGE: 20
    },
    ECOMMERCE: {
        FLIGHT: 'flight',
        DIRECT_PURCHASE: 'compra directa',
        MULTIPLE_JOURNEYS: 'multiples trayectos',
        METASEARCH: 'metabuscador',
        STOPOVER_HMAD: 'hola madrid'
    },
    CAMPAING_TYPE: 'IBERIA_',
    DYNAMIC_PRICING_DESCRIPTIONS: {
        SPECIAL_DISCOUNT: 'Descuento especial'
    },
    DYNAMIC_PRICING_WARN_FARE_ENABLE: false,
    AVAILABLE_AVIOS_DISCOUNTS: ['PARTNER', 'LGF', 'VOUCHER', 'RES'],
    AVAILABLE_COMMERCIAL_CODES: ['YPA', 'BPA', 'YPACONF'],
    DATE_FORMAT: {
        YEARS_FIRST: ['YEAR', 'MONTH', 'DAY'],
        MONTH_FIRST: ['MONTH', 'DAY', 'YEAR'],
        DEFAULT: ['DAY', 'MONTH', 'YEAR']
    },
    DATALAYER_PROCESS: {
        BOOKING: 'booking',
        REDEMPTION: 'redencion',
        METASEARCH: 'metabuscadores',
        MULTI_TRIP: 'multiples trayectos',
        SHUTTLE: 'puente aereo',
        SHUTTLE_REDEPMTION: 'puente aereo redencion',
        BOOKING_OB: 'booking OB obtencion',
        BOOKING_OB_REDEMPTION: 'booking OB redencion',
        FLASH_OFFERS: 'flashOffers',
        HMAD_STOP_OVER: 'hola madrid',
        ON_HOLD: 'reserva onhold'
    },
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
    TOTALPRICE_STEPS_MAP: {
        'availability': {
            id: 'totalprice-availability-continue-flow',
            text: 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY'
        },
        'flightsRecap': {
            id: 'totalprice-recap-continue-flow',
            text: 'TOTAL_PRICE_CONTINUE_FLOW_RECAP'
        },
        'ibairp': {
            id: 'totalprice-passengers-continue-flow',
            text: 'TOTAL_PRICE_CONTINUE_FLOW_PASSENGERS'
        },
        'ibcmtv': {
            id: 'totalprice-ancillaries-continue-flow',
            text: 'TOTAL_PRICE_CONTINUE_FLOW_ANCILLARIES'
        },
        'ibpurc': {
            id: 'totalprice-payments-pay-flow',
            text: 'TOTAL_PRICE_CONTINUE_FLOW_PAYMENTS_PAY'
        },
        'ibshuttle': {
            id: 'totalprice-shuttle-availability-continue-flow',
            text: 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY'
        },
        'default': {
            id: 'totalprice-continue-flow',
            text: 'AVAILABILITY_BUTTON'
        }
    },
    DATALAYER_MODAL_ID: {
        BACK_MAIN_HEADER_MODAL: 'BACK_MAIN_HEADER_MODAL',
        SHOW_ONHOLD_MODAL: 'SHOW_ONHOLD_MODAL'
    },
    HEADER_MOBILE_STEP_DESCRIPTIONS: {
        SELECT_FLIGHT_OW: 'HEADER_MOBILE_STEP_DESCRIPTION_AVAILABILITY_OW',
        SELECT_FLIGHT_OUTBOUND: 'HEADER_MOBILE_STEP_DESCRIPTION_AVAILABILITY_SELECT_OUTBOUND',
        SELECT_FLIGHT_INBOUND: 'HEADER_MOBILE_STEP_DESCRIPTION_AVAILABILITY_SELECT_INBOUND',
        SELECT_FARE: 'HEADER_MOBILE_STEP_DESCRIPTION_AVAILABILITY_SELECT_FARE',
        RECAP: 'HEADER_MOBILE_STEP_DESCRIPTION_RECAP',
        PASSENGERS: 'HEADER_MOBILE_STEP_DESCRIPTION_PASSENGERS',
        ANCILLARIES: 'HEADER_MOBILE_STEP_DESCRIPTION_ANCILLARIES',
        PAYMENTS: 'HEADER_MOBILE_STEP_DESCRIPTION_PAYMENTS'
    },
    PASSENGER_FORM_RESIDENCE: {

        '410917': {
            description: 'Andalucía',
            pattern: '(AAAA)999-9999-99999999-9'
        },

        '502973': {
            description: 'Aragón',
            pattern: '99-9999-99'
        },

        '330447': {
            description: 'Asturias',
            pattern: '33-9999-9999'
        },

        '390759': {
            description: 'Cantabria',
            pattern: '39-999-99'
        },

        '451685': {
            description: 'Castilla-La Mancha',
            pattern: '99-99-99999'
        },

        '471868': {
            description: 'Castilla-León',
            pattern: '99-9999-99'
        },

        '080193': {
            description: 'Cataluña',
            pattern: '99-999999-9999'
        },

        '510013': {
            description: 'Ceuta',
            pattern: '9999 (hasta 15 dígitos)'
        },

        '060830': {
            description: 'Extremadura',
            pattern: '99-9999-99'
        },

        '150780': {
            description: 'Galicia',
            pattern: '9999-999999-99'
        },

        '070407': {
            description: 'Islas Baleares',
            firstPattern: 'Mallorca: 07-999999-9999',
            secondPattern: 'Menorca: 07-02-9999-99',
            thirdPattern: 'Ibiza: 07-03-9999-99',
            fourthPattern: 'Formentera: 07-04-9999-99'
        },

        '380380': {
            description: 'Islas Canarias',
            pattern: 'FAM-9999-AA-99999'
        },

        '260892': {
            description: 'La Rioja',
            pattern: '99999'
        },

        '280796': {
            description: 'Madrid',
            pattern: '28-999999-99999'
        },

        '520018': {
            description: 'Melilla',
            pattern: '52-999-9999'
        },

        '300308': {
            description: 'Murcia',
            pattern: '30-9999999-9999'
        },

        '312016': {
            description: 'Navarra',
            pattern: '31-999999-9999'
        },

        '010590': {
            description: 'País Vasco',
            pattern: '99-9999-99999'
        },

        '462508': {
            description: 'Valencia',
            pattern: '99-99999-9999'
        }
    },
    OPERATIONAL_CARRIER_CODES: ['IB', 'I2', 'YW', 'I0', '0I', 'LV', 'LL', 'YU'],
    TRAVEL_DOCUMENTS_MAP: {
        DN: ['DNI'],
        NI: ['DNI', 'RESIDENT_CARD'],
        PP: ['PASSPORT'],
        TR: ['RESIDENT_CARD']
    },
    // KEEP ALIVE VALUES IN MINUTES
    KEEP_ALIVE_TIMES: {
        SESSION: 15,
        COUNTDDOWN: 2
    },
    WARNING_MESSAGES: {
        OVERNIGHT_WARNING: 'SSE_AVM_20003',
        TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
        AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
        LONG_WAITING_WARNING: 'SSE_AVM_20004',
        MISSCONNECTION_FLEX_WARNING: 'SSE_ORM_20014',
        SAME_SURNAME_WARNING: 'SSE_ORM_9149',
        CORRECTION_NAME_NOT_PERMITED: 'SSE_ORM_900562',
        ONHOLD_PARTNER_MUST_LOGGED: 'SSE_MBM_1011'
    },
    OH_FLIGHT_TYPES: {
        AVAILABILITY: 'availabilityFlight',
        METASEARCH: 'metasearchFlight',
        MULTITRIP: 'multiCityFlight',
        REDEMPTION: 'redemptionFlight',
        REDEMPTIONOB: 'redemptionOBFlight'
    },
    HEADER_SHOW_lOGIN : [
        RouterPathsConstants.availability,
        RouterPathsConstants.ibshuttle,
        RouterPathsConstants.ibairp,
        RouterPathsConstants.ohmtdt
    ],
    FARE_FAMILY_ICON_PROPERTY_CODE: {
        EQMANO: 'icon-e_equipaje',
        EQBODEGA: 'icon-e_equipaje_facturado',
        EQMANO10: 'icon-e_equipaje',
        EQMANO14: 'icon-e_equipaje',
        EQPERSONAL: 'icon-equipaje-de-mano-mochila',
        ASIENTO: 'icon-asiento-normal',
        ASIENTO24H: 'icon-asiento-normal',
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
        CODENOCAMBIO: 'CA_CAMBIOS PERMITIDOS_NO_SHOW_NO PERMITIDO',
        AEROPUERTO: 'icon-canary-plus',
        AVIOSPLUS: 'icon-avios',
        PUNTUALIDAD: 'icon-utilizacion_avios',
        FASTLANE: 'icon-fast_track'
    },
    PHONES_LIST: {
        NORMAL: 'RESERVAS',
        HOLIDAYS: 'ATTBAH'
    },
    ON_HOLD_STATUS: {
        HOLD: 'ON_HOLD',
        ON_HOLD_CONFIRMABLE: 'ON_HOLD_CONFIRMABLE',
        FRAUD_ONHOLD: 'FRAUD_ONHOLD'
    },
    ONHOLD: {
        ORDERPRICEDEFAULT: 0,
        DESTINATION_IMAGE_SIZE: {
            desktop: '_2000_834.jpg',
            tablet: '_1023_400.jpg',
            mobile: '_958_332.jpg'
        }
    },
    AMOUNT_TYPES: {
        AVIOS: 'AVIOS',
        ELITE: 'TIER_POINTS'
    },
    HEADER_SIMPLE_PAGES: [
        RouterPathsConstants.ibbkerror,
        RouterPathsConstants.confirmation,
        RouterPathsConstants.ibAviosAlert,
        RouterPathsConstants.OBERRA,
        RouterPathsConstants.ibbker
    ],
    SEARCH_FLIGHT_TYPE: searchFlightType
};
try {
    const mod = angular.module('ib-booking-app-constants-module');

    mod.constant(
        'BookingAppConstants', BookingAppConstants
    );
} catch (error) {
    const mod = angular.module('ib-booking-app-constants-module', []);
    mod.constant(
        'BookingAppConstants', BookingAppConstants
    );
}
export { BookingAppConstants };
