import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const servicesURI: string = envCopy.services;
const cloudServices: string = envCopy.cloud;
const cloudServicesMyIberia: string = envCopy.cloudMyIberia;
const cloudServiceCustomerExperience: string = envCopy.cloudCustomerExperience;
const cloudDigitalWeb: string = envCopy.cloudDigitalWeb;
const authoritationURI: string = envCopy.auth;
const otpServicesURI: string = envCopy.otpServices;
const globalAuthorizationToken: string = envCopy.globalAuthorizationToken;
const ancillariesServices: string = envCopy.ancillariesServices;
const paymentsComponentURI: string = envCopy.paymentsComponent;


const MmBAppConstants = {
    production: envCopy.production,
    lang: 'es',
    market: 'ES',
    timeWait: 2000,
    numAttemps: 3,
    servicesURI: servicesURI,
    otpServicesURI,
    flowName: 'MMB',
    globalAuthorizationToken: globalAuthorizationToken,
    ancillariesServices: ancillariesServices,
    paymentsComponentURI: paymentsComponentURI,
    cloudServiceCustomerExperience: cloudServiceCustomerExperience,
    cloudDigitalWeb: cloudDigitalWeb,
    ...envCopy.properties, // import properties from environment file

    INT_HOSTNAME: 'int.iberia.com',
    PRE_HOSTNAME: 'pre.iberia.com',

    //rest service Calls
    DEFAULT_ENDPOINTS: {
        tokenActivitiesPREE: 'https://pre-api-activities.recoglobick.com/token?grant_type=client_credentials',
        tokenTransfersPREE: 'https://pre-api-transfers.recoglobick.com/token?grant_type=client_credentials',
        tokenActivitiesPRO: 'https://api-activities.recoglobick.com/token?grant_type=client_credentials',
        tokenTransfersPRO: 'https://api-transfers.recoglobick.com/token?grant_type=client_credentials',
        getBreakdownURI: servicesURI + '/ass-fass/rs/fass/v5/',
        ribbonCalendarServiceURI: servicesURI + '/sse-avm/rs/v2/calendar/ribbon',
        ribbonCalendarServiceMultiOpenJawURI: servicesURI + '/sse-avm/rs/v2/calendar/complex',
        ribbonCalendarOneSliceServiceURI: servicesURI + '/sse-avm/rs/v2/calendar/ribbon',
        ribbonCalendarRedemptionServiceURI: servicesURI + '/sse-rpa/rs/v1/calendar',
        AvailabilityflexibleServiceURI: servicesURI + '/sse-avm/rs/v2/disruption/availability-flexible',
        AvailabilityUnifiedURI: servicesURI + '/sse-avm/rs/v2/disruption/availability-unified',
        ribbonFlexibleServiceURI: servicesURI + '/sse-avm/rs/v2/disruption/ribbon-flexible',
        rebookURI: servicesURI + '/sse-orm/rs/v4/disruption/orderChange',
        voucherInfoURI: servicesURI + '/sse-orm/rs/v1/refund/voucher/',
        cashRefundURI: servicesURI + '/sse-orm/rs/v1/refund/cash',
        cashRefundInformationURI: servicesURI + '/sse-orm/rs/v1/refund/cash/calculate',
        disruptionPeriodsServiceURI: servicesURI + '/sse-avm/rs/v2/disruption/periods/',
        sisterCitiesServiceURI: servicesURI + '/rdu-loc/rs/loc/v2/location/sister-cities',
        digitalBoardingAvailabilityV3: servicesURI + '/trm-apim/rs/v3/digital-boarding',
        digitalBoardingAvailabilityV4: servicesURI + '/trm-apim/rs/v4/digital-boarding',
        reshopConditionsServiceURI: servicesURI + '/sse-orm/rs/v2/mmb/{flowId}/reshop-conditions',
        reshopConditionsServiceURIV2: servicesURI + '/sse-orm/rs/v6/mmb/{flowId}/reshop-conditions',
        calculatePoints: servicesURI + '/prlm-pc/rs/v1/calculatePoints',
        updateSeatChangeNotificationURI: servicesURI + '/sse-orm/rs/v2/mmb/{flowId}/update-notification/seat-change',
        voluntaryChangesLogURI: servicesURI + '/sse-orm/rs/v2/order/voluntaryChangesLog/{flowId}',
        voluntaryRefundLogURI: servicesURI + '/sse-orm/rs/v2/order/voluntaryRefundLog/{flowId}',
        vipLoungesURI: cloudServiceCustomerExperience + '/viplounges/exclusive/availability',
        digitalMenuURI: servicesURI + '/sse-favl/rs/v1/digital-menus',
        digitalMenuDownloadURI: servicesURI + '/sse-favl/rs/v1/digital-menus/download-menu',
        attendanceVoucherStatusURI: 'https://rx18lo0v35.execute-api.us-east-1.amazonaws.com/test/paxStatus',
        getPaymentContextURI: servicesURI + '/sse-orm/rs/v1/payment-context-id?flowId={{flowId}}',
        getPaymentContextAncillariesURI: cloudServices + '/v1/payment/payment-context/{{flowId}}',
        NEW_PAYMENT_AVAILABLE: `${servicesURI}/pmt-ppm/rs/ppm/v7/config/new-payment-available/market/{{marketId}}/realm/{{realm}}`,
        checkVoucherCodeServiceURI: `${servicesURI}/ass-fass/rs/fass/v5`,
        AVIOS_FLIGHTS: servicesURI + '/prlm-pc/rs/v1/points/flight-calculation',
        AVIOS_ANCILLARIES: servicesURI + '/prlm-pc/rs/v1/points/ancillaries-calculation',
        AVIOS_SUMMARY: servicesURI + '/prlm-pc/rs/v1/points/summary-calculation',
        phoneCodesURI: servicesURI + '/rdu-loc/rs/loc/v1/location/phone-codes',
        orderChangeURI: servicesURI + '/sse-orm/rs/v2/order/orderchange',
    },
    PARAMS:{
        checkVoucherCodeServiceParamsURI: '/{flowId}/voucher/validation/{voucherCode}',
        deleteVoucherCodeServiceParamsURI: '/{flowId}/voucher/remove/{voucherCode}',
        checkPostVoucherCodeParamsURI: '/{flowId}/voucher/{voucherId}/otp/{otpSessionId}'
    },
    diccionaryWidget: {
        LCG: 'A Coruña',
        ALC: 'Alicante',
        ATH: 'Athens',
        BCN: 'Barcelona',
        BIO: 'Bilbao',
        BLQ: 'Bologna',
        BRU: 'Brussels',
        BUD: 'Budapest',
        BOD: 'Bordeaux',
        CPH: 'Copenhagen',
        DUB: 'Dublin',
        DUS: 'Düsseldorf',
        FRA: 'Frankfurt',
        GVA: 'Geneva',
        LPA: 'Las Palmas de Gran Canaria',
        GRX: 'Granada',
        XRY: 'Jerez de la Frontera',
        ACE: 'Lanzarote',
        LIS: 'Lisbon',
        LGW: 'London',
        LHR: 'London',
        LYS: 'Lyon',
        MAD: 'Madrid',
        MRS: 'Marseille',
        MXP: 'Milan',
        SVO: 'Moscow',
        MJV: 'Murcia',
        AGP: 'Malaga',
        MUC: 'Munich',
        NTE: 'Nantes',
        NCE: 'Nice',
        NAP: 'Naples',
        OPO: 'Porto',
        PMI: 'Palma de Mallorca',
        CDG: 'Paris',
        ORY: 'Paris',
        PRG: 'Prague',
        FCO: 'Rome',
        LED: 'Saint Petersburg',
        EAS: 'San Sebastian',
        SDR: 'Santander',
        SCQ: 'Santiago de Compostela',
        SVQ: 'Seville',
        TFN: 'Tenerife',
        TFS: 'Tenerife',
        TLS: 'Toulouse',
        VLC: 'Valencia',
        VCE: 'Venice',
        VIE: 'Vienna',
        VGO: 'Vigo',
        ZRH: 'Zurich',
        BOS: 'Boston',
        ORD: 'Chicago',
        LAX: 'Los Angeles',
        MIA: 'Miami',
        MEX: 'Mexico City',
        JFK: 'New York',
        SJU: 'Rio Grande',
        GUA: 'Guatemala City',
        HAV: 'Havana',
        PUJ: 'Santiago de Chile',
        CMN: 'Punta Cana',
        SJO: 'San Jose',
        BOG: 'Bogota',
        EZE: 'Buenos Aires',
        LIM: 'Lima',
        MDE: 'Medellin',
        MVD: 'Montevideo',
        UIO: 'Quito',
        GIG: 'Rio de Janeiro',
        SDU: 'Rio de Janeiro',
        SCL: 'Casablanca',
        RAK: 'Marrakech',
        TLV: 'Tel Aviv',
        TNG: 'Tangier'
    },
    SALESFORCE_ENDPOINTS: {
        TRAVEL_PREFERENCES: servicesURI + '/cust-cust/rs/v1/travel_preferences',
        CONTACT_DETAILS_IBPLUS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        PERSONAL_DATA_IBPLUS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        TRAVEL_DOCUMENTS: cloudServicesMyIberia + '/v1/travel-documents',
    },
    tokenServiceURI: authoritationURI + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    endpointsServiceURI: servicesURI + '/framework-services/rs/commons/v1/endpoints/',
    commercialInfobyMarketServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/market/commercialsellingdata',
    countriesListServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/country',
    countriesListServiceApisURI: servicesURI + '/rdu-loc/rs/loc/v1/location/country/nationality',
    statesListServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/',
    companiesServiceURI: servicesURI + '/framework-services/rs/commons/v1/data/frequent-flyer/companies',
    emergencyServiceURI: servicesURI + '/sse-orm/rs/v2/order/',
    customerDataURI: servicesURI + '/cust-cust/rs/v1/customer/complete',
    retrieveOrderURI: servicesURI + '/sse-orm/rs/v2/order/import/locator/',
    retrieveOrderHandlerURI: servicesURI + '/digitalweb/cloud/order-handler/v1/orders',
    retrieveOrderPostURI: servicesURI + '/sse-orm/rs/v2/order/import',
    getBookingInformationNameURI: servicesURI + '/sse-orm/rs/v2/order/recover/group/',
    retrieveOrderURIConsent: servicesURI + '/sse-orm/rs/v2/mmb/',
    retrieveOrderByCheckIdURI: servicesURI + '/sse-orm/rs/v2/order/import-cached',
    retrieveOrderByDeepLinkURI: servicesURI + '/sse-orm/rs/v2/order/import-deeplink',
    retrieveOrderByFlightIdURI: servicesURI + '/sse-orm/rs/v2/order/import-encrypt',
    reshopAvailabilityURI: servicesURI + '/sse-avm/rs/v3/reshop-availability',
    shuttleAvailabilityURI: servicesURI + '/sse-avm/rs/v2/availability/shuttle',
    fareReshopURI: servicesURI + '/sse-avm/rs/v2/reshop-fare',
    fareUnifiedURI: servicesURI + '	/sse-avm/rs/v2/disruption/fare-unified',
    changeOrderSliceURI: servicesURI + '/sse-orm/rs/v2/order',
    bookingsListURI: servicesURI + '/sse-orm/rs/v2/order/bookings',
    changeOrderContactInfoURI: servicesURI + '/sse-orm/rs/v2/order',
    changeOrderPersonalInfoURI: servicesURI + '/sse-orm/rs/v1/order',
    changePassengerSpecialNeeds: servicesURI + '/sse-orm/rs/v2/order',
    changeOrderReceipt: servicesURI + '/sse-orm/rs/v2/order',
    itinerarySend: servicesURI + '/sse-orm/rs/v6/itinerary/send',
    closeSessionURI: servicesURI + '/pac-prm/rs/checkin/v2',
    cancelOnHoldOrderURI: servicesURI + '/sse-orm/rs/v2/mmb/',
    wcsPhonesURI: '/cs/Satellite?pagename=IB_SE_Services&service=getContact',
    apisPassengerInfoURI: servicesURI + '/trm-apim/rs/v3/info/',
    acceptChangesURI: servicesURI + '/sse-orm/rs/v2/mmb/',
    ancillariesURI: servicesURI + '/ass-fass/rs/fass/v5/',
    deleteAncillaryURI: servicesURI + '/ass-fass/rs/fass/v5/',
    keepAliveServiceURI: servicesURI + '/sse-orm/rs/v2/mmb/',
    keepAliveServiceENDURI: '/keep-alive/',
    ribbonCalendarServiceURI: servicesURI + '/sse-avm/rs/v2/calendar/ribbon',
    ribbonCalendarServiceMultiOpenJawURI: servicesURI + '/sse-avm/rs/v2/calendar/complex',
    ribbonCalendarOneSliceServiceURI: servicesURI + '/sse-avm/rs/v2/calendar/ribbon',
    ribbonCalendarRedemptionServiceURI: servicesURI + '/sse-rpa/rs/v1/calendar',
    AvailabilityflexibleServiceURI: servicesURI + '/sse-avm/rs/v2/disruption/availability-flexible',
    AvailabilityUnifiedURI: servicesURI + '/sse-avm/rs/v2/disruption/availability-unified',
    ribbonFlexibleServiceURI: servicesURI + '/sse-avm/rs/v2/disruption/ribbon-flexible',
    rebookURI: servicesURI + '/sse-orm/rs/v4/disruption/orderChange',
    voucherInfoURI: servicesURI + '/sse-orm/rs/v1/refund/voucher/',
    cashRefundURI: servicesURI + '/sse-orm/rs/v1/refund/cash',
    voluntaryRefundURI: servicesURI + '/sse-orm/rs/v1/shopping',
    voluntaryConfirmationRefundURI: servicesURI + '/sse-orm/rs/v2/order/cancel/{flowId}',
    voluntaryConfirmationPartialRefundURI: servicesURI + '/sse-orm/rs/v2/order/cancel/partial/{flowId}',
    cashRefundInformationURI: servicesURI + '/sse-orm/rs/v1/refund/cash/calculate',
    disruptionPeriodsServiceURI: servicesURI + '/sse-avm/rs/v2/disruption/periods/',
    sisterCitiesServiceURI: servicesURI + '/rdu-loc/rs/loc/v2/location/sister-cities',
    digitalBoardingAvailability: servicesURI + '/trm-apim/rs/v4/digital-boarding',
    reshopConditionsServiceURI: servicesURI + '/sse-orm/rs/v2/mmb/{flowId}/reshop-conditions',
    calculatePoints: servicesURI + '/prlm-pc/rs/v1/calculatePoints',
    updateSeatChangeNotificationURI: servicesURI + '/sse-orm/rs/v2/mmb/{flowId}/update-notification/seat-change',
    voluntaryChangesLogURI: servicesURI + '/sse-orm/rs/v2/order/voluntaryChangesLog/{flowId}',
    voluntaryRefundLogURI: servicesURI + '/sse-orm/rs/v2/order/voluntaryRefundLog/{flowId}',
    salesforceHealthFormURI: servicesURI + '/trm-apim/rs/v4/health-form',
    invoicesDetailsURI: servicesURI + '/ivm-ivs/rs/v1/invoice/details/filtered/{flowId}',
    invoicesDuplicateURI: servicesURI + '/ivm-ivs/rs/v1/invoice/duplicate/{flowId}',
    countryListURI: servicesURI + '/rdu-loc/rs/loc/v1/location/country',
    invoicesProvinceURI: servicesURI + '/rdu-loc/rs/loc/v3/onb/location/onb-states/{flowId}',
    invoicesIssueURI: servicesURI + '/ivm-ivs/rs/v1/invoice/issue/{flowId}',
    cancelIBVURI: cloudServices + '/v1/ibv',
    cancelIBVHolidaysURI: cloudServices + '/v1/holidays',
    resetMmbURI: servicesURI + '/sse-avm/rs/v2/reshop-fare/resetmmb/{flowId}',
    simulatorReshopAvailabilityURI: servicesURI + '/sse-avm/rs/v3/reshop-availability/simulator',
    simulatorFareReshopURI: servicesURI + '/sse-avm/rs/v2/reshop-fare/simulator',
    lotusOtpServiceURI: servicesURI + '/otp/validate',
    retrieveOrderCachedLotusURI: servicesURI + '/sse-orm/rs/v2/order/import-cached-lotus/{flowId}',

    //app Routes
    generalI18nRoute: '/iberia-web-content/literales/general/',
    checkinlI18nRoute: '/iberia-web-content/literales/checkin/',
    i18nRoute: '/iberia-web-content/literales/manage-my-booking/',
    iconsRoute: '/iberia-web-content/iconos',
    imagesRoute: '/iberia-web-content/imagenes',
    linksRoute: '/iberia-web-content/links/manage-my-booking',
    generalLinksRoute: '/iberia-web-content/links/general',
    localeLanguageRoute: '/iberia-web-content/locales/',

    creditCardJsonRoute: '/payment/creditcardlogo.json',
    airlinesLogoJsonRoute: '/aerolineas/aeroLineas.json',
    citiesJsonRoute: '/ciudades/cities.json',
    airlinesLogoBaseRoute: '/aerolineas/',
    citiesBaseRoute: '/ciudades/',
    templatesRoute: 'web-manage-my-booking/templates/',

    defaultBackgroundImageUrl: 'DEFAULT',
    defaultAirlineLogo: 'logo_pos_generico.svg',
    defaultCityImage: 'GENERICA_720x384.jpg',
    MMB_NULLIFY_FLIGHTS_TITLE: 'Anular vuelo',
    MMB_IB_VACIONES_TYPE_POSITIVE_SYMBOL: ' + ',
    availableLanguages: ['en', 'es', 'ls', 'zh', 'ca', 'de', 'fr', 'it', 'pt', 'ja', 'nl', 'ru'],
    defaultLang: 'es',
    defaultMarket: 'ES',
    APPLICATION_FLOW: {
        MMB: 'MMB',
        CHECKIN: 'CKI',
        BOOKING: 'BKI',
        BBOOKING: 'BBKI'
    },
    COOKIES: {
        PERSONALIZATION: 'IBERIACOM_PERSONALIZATION',
        LOGGED_TOKEN: 'IBERIACOM_SSO_ACCESS',
        LOGGED_TOKEN_EXPIRATION: 'IBERIACOM_SSO_ACCESS_TO',
        LOGGED_REFRESH_TOKEN: 'IBERIACOM_SSO_REFRESH',
        LOGGED_REFRESH_TOKEN_EXPIRATION: 'IBERIACOM_SSO_REFRESH_TO',
        CHECKIN_ID: 'IBERIACOM_GDR_PA_INFO',
        BOOKING_INFO: 'IBERIACOM_GDR_PA_ACCESS',
        DYNAMIC_PRICING: 'DP',
        AIR_SHUTTLE_ERROR: 'IBERIACOM_GDR_PA_ERROR',
        DEFAULT_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 365 * 10, //ten years
        DEFAULT_PATH: '/',
        OLD_COOKIE: 'JSESSIONID',
        MARKETING_PERMISSION_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 30,
        MARKETING_PERMISSION_TEST_EXPIRY_TIME: 1000 * 60 * 5, //5 minuts,
        NO_MARKETING_PERMISSION: 'IBERIACOM_UNACCEPTED_MARKETING_PERMISSION',
    },
    nameParameters: { lang: 'language', market: 'market', CODE_ERROR: 'codeError' },
    PHONE_TYPE: 'MOBILE',
    PASSENGER_TYPES: {
        adult: 'ADULT',
        child: 'CHILD',
        infant: 'INFANT'
    },
    SLICE_TYPES: {
        REGULAR: 'REGULAR',
        SHUTTLE: 'SHUTTLE'
    },
    SLICE_STATUS: {
        HOLD: 'ON_HOLD',
        ON_HOLD_CONFIRMABLE: 'ON_HOLD_CONFIRMABLE',
        FRAUD_ONHOLD: 'FRAUD_ONHOLD'
    },
    SEGMENT_TYPES: {
        OPEN: 'OPEN',
        CONFIRMED: 'CONFIRMED'
    },
    FARE_CODES: {
        EQMANO: 'EQMANO',
        EQBODEGA: 'EQBODEGA',
        REEMBOLSO: 'REEMBOLSO'
    },
    MmBPatterns: {
        NAME_SURNAME_PATTERN: /^(?!.*[0-9*¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        NAME_SURNAME_CLEANER: '[0-9*¡!?¿<>\\ºª|/·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
        EMAIL_PATTERN: '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}',
        PHONE_PATTERN: /^\d{6,}$/,
        PHONE_CLEANER_PLUS: '[^0-9]',
        PHONE_CLEANER: '[^0-9(+)]',
        CVV_PATTERN: /^\d+$/,
        CVV_CLEANER: '\\D+',
        CREDIT_CARD_NUMBER_PATTERN: /^\d+$/,
        CREDIT_CARD_NUMBER_CLEANER: '\\D+',
        CARD_NUMBER_PATTERN: /^\d+$/,
        CARD_NUMBER_CLEANER: '\\D+',
        DOCS_PATTERN: /^[a-zA-Z\d\-]+$/,
        DOCS_CLEANER: '[¡!?¿<>\\ºª|/·@#$%&,;=?¨*:çÇñÑ¿())´~\'`¬_+{}\\[\\]"\\^€$£]',
        PNR_PATTERN: /^[a-zA-Z\s\d\-]+$/,
        PNR_CLEANER: '[^a-zA-Z\\s\\d\\-]',
        NUMBER_IB_PLUS_PATTERN: /^\d{4,}$/,
        NUMBER_IB_PLUS_CLEANER: '\\D+',
        NUMBER_FF_PATTERN: /^\d+$/,
        NUMBER_FF_CLEANER: '\\D+',
        PHONE_MAX_LENGTH: 25,
        EMAIL_MAX_LENGTH: 60,
        MAX_LENGTH_NAME: 30,
        NUMBER_IB_PLUS_MAX_LENGTH: 8,
        NUMBER_CARD_NUMBER_MAX_LENGTH: 14,
        NUMBER_FF_MAX_LENGTH: 20,
        NUMBER_FF_MAX_LENGTH_AA: 12,
        NUMBER_FF_MAX_LENGTH_GENERAL: 12,
        NUMBER_FF_PATTERN_GENERAL: /[a-zA-Z0-9]{4,}/,
        NUMBER_FF_PATTERN_CLEANER: '[^a-zA-Z0-9]',
        MAX_LENGTH_IBERIA_CARD: 8,
        MIN_LENGTH_FF: 8,
        MAX_LENGTH_PIN: 6,
        AWS_WARNING_ERRORS: /AWS/,
        MAX_LENGTH_ZIP_CODE: 10,
        APIS_DOCUMENT_MAX_LENGTH: 20,
        APIS_DNI_PSTS_MAX_LENGTH: 15,
        ONLY_LETTERS: /[^a-zA-Z+]/g,
        AA_CARD_PATTERN: /[a-zA-Z0-9]{4,}/,
        AA_CARD_CLEANER: '[^a-zA-Z0-9]',
        DNI_DOCUMENT: /^([0-9]{8})[A-Za-z]$/m,
        CIF_DOCUMENT: /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,
        DNI_NIE_DOCUMENT: /^[XYZxyz]?\d{5,8}[A-Za-z]$/,
        CITY_MAX_LENGTH: 28,
        ADDRESS_MAX_LENGTH: 120,
        ONLY_NUMBERS: /^[0-9]+$/,
        REGION_COUNTRY_PATTERN: /^[A-Za-z -]*$/
    },
    PAGES_URL: {
        SEARCH: '/chktrp',
        SEARCHNEW: '/chktrpnew',
        TRIP_LIST: '/mytrpsnew',
        BOOKING_MANAGE: '/ibmtdt',
        CHANGE_FLIGHT: '/tcadvs',
        FLIGHT_CONFIRMATION: '/tcfrev',
        BOOKINGS_LIST: '/mytrps',
        PASSENGERS_INFO: '/moinfo',
        CHANGE_PASSENGERS_SPECIAL_NEEDS: '/mopmr',
        CONFIRM_ON_HOLD: '/ohmtdt',
        MMB_DASHBOARD: '/ibdash',
        MMB_INVOLUNTARY_CHANGE: '/ibinvchange',
        PAYMENTS: '/ohinfo',
        MMB_PAYMENTS_CONFIRM: '/confirmation-mmb',
        NEW_MMB_PAYMENTS_CONFIRM: '/new-confirmation-mmb',
        ON_HOLD_ANULATION: '/cnclit',
        MMB_CONFIRMATION_ORDER: '/confirmation',
        MMB_COMMUNICATION_LOST: '/ibbker',
        MMB_ANCILLARIES_CONFIRMATION: '/confanc',
        DISRUPTION_DASHBOARD: '/disrptn',
        DISRUPTION_REFUND: '/disrfn',
        REBOOK_ERROR: '/rbkerr',
        MMB_PAYMENT: '/ohinfonew'
    },
    PAGE_TYPE_CHANNEL: {
        MOBI: 'MOBI'
    },
    STEP_PARAM_VALUES: {
        CHANGE_FLIGHT: 'changeFlight'
    },
    GDR_PA_ERRORS: {
        ERR_1: 'GDR_PA_ERROR_1'
    },
    GDR_CODE_ERRORS: {
        UNEXPECTED_TECHNICAL_EXCEPTION: 'FRAM_B0006'
    },
    CHECKIN_NEXT_STEP: {
        SEATS_MAP: 'seatsMap',
        BOARDING_CARDS: 'boardingCards',
        FLY_NOW: 'flyNow',
        FLIGHT_PASSENGER: 'flightPas'
    },
    STATUS: {
        UNCHECKABLE: 'UNCHECKABLE',
        CHECKABLE: 'CHECKABLE',
        CHECKED: 'CHECKED',
        STANDBY: 'STANDBY',
        REISSUE: 'REISSUE',
        NOT_SELECTABLE: 'NOT_SELECTABLE'
    },
    APIS_STATUS: {
        APIS_DOCUMENT_INFO: 'APIS_DOCUMENT_INFO',
        APIS_STATUS_INFO: 'APIS_STATUS_INFO'
    },
    QUADRIGAM: {
        SEARCH: 'CHKTRP',
        LOGGED_SEARCH: 'MYTRPS',
        TRIP_DETAILS: 'IBMTDT',
        CHANGE_FLIGHT: 'TCADVS',
        CHANGE_FLIGHT_DISPO: 'TCFLPA',
        FLIGHT_CONFIRMATION: 'TCFREV',
        ORDER_TICKETS: 'IBENIT',
        ORDER_TICKETS_CONFIRMATION: 'IBCENIT',
        CHANGED_HOURS_INV: 'IBICHC',
        CANCEL_FLIGHT_INV: 'IBICFC',
        SPECIAL_NEEDS: 'MOPMR',
        SPECIAL_NEEDS_CONFIRMED: 'MOPMRCF',
        PASSENGER_INFO: 'MOINFO',
        ON_HOLD_CONF_ON_BUSINESS: 'CIPOHMTDT',
        ON_HOLD_CONF_RESIDENTS: 'OHSARA',
        ON_HOLD_CONF_PAYMENT: 'MOPURC',
        ON_HOLD_CONF_PAYMENT_ON_BUSINESS: 'CIPOHINFO',
        ON_HOLD_CONF_PAYMENT_WAIT: 'OHWAIT',
        ON_HOLD_CONF_PAYMENT_FRAUD: 'OHPCC',
        ON_HOLD_CONF_CONFIRMATION: 'MOPURC',
        ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS: 'CIPRTBKCF',
        ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
        ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS: 'CIPCNCLOH',
        ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS: 'CIPCNCLIT',
        PASSENGER_DATA: 'MODPAX',
        CUSTOMIZE_FLIGHTS: 'MOANCI',
        SESSION_EXPIRED: 'MMBEXP',
        CUSTOMIZE_FLIGHTS_DEEPLINK: 'MOSEATJBR',
        MODAL_SELECT_SEAT_JBA: 'SEATMPJBR',
        PASSENGER_FF_ADD: 'MOEMER',
        CONFIRM_EMERGENCY_CONTACT: 'MOCEME',
        MODAL_CORRECTION_NAME: 'CONOMB',
        MODAL_CORRECTION_NAME_CONFIRMATION: 'CONOOK',
        MODAL_CORRECTION_NAME_ERROR: 'CONKOU',
        MODAL_CORRECTION_NAME_ERROR_SERVICE: 'CONKOS',
        FRECUENT_F: 'MOFFLY',
        CONFIRM_FF: 'MOCFFL',
        CONFIRM_ADD_APIS: 'MOCAPI',
        SPECIAL_NEEDS_ADD: 'MOPMR',
        CONFIRM_SPECIAL_NEEDS_ADD: 'MOCPMR',
        MANAGE_RESERV: 'IBMMBR',
        ADD_APIS: 'MOAPIS',
        MODAL_INFO_SEATS: 'MODSEA',
        MODAL_INFO_BAGGAGE: 'MODBAG',
        MODAL_INFO_PETC: 'MOPETC',
        MOD_SPECIAL_MEAL: 'MODMEA',
        YOUR_FLIGHTS: 'IBMTFL',
        YOUR_DOCUMENTS: 'MODDOC',
        CHANGE_FLIGHTS_CALL_CENTER_MESSAGE: 'ATCFCNA',
        CHANGE_FLIGHTS_SARCH_ONE_WAY: 'ATCFOW',
        CHANGE_FLIGHTS_SEARCH_WITH_RETURN: 'ATCFRT',
        CHANGE_FLIGHTS_SEARCH_DATE_ERROR_MODAL: 'ATCERD',
        CHANGE_FLIGHTS_AVAILABILITY_ONE_WAY: 'ATCPOW',
        CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN: 'ATCPRT',
        CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN_ONE_CHOOSE: 'ATCPRT',
        CHANGE_FLIGHTS_AVAILABILITY_MESSAGE: 'ATCERR',
        CHANGE_FLIGHTS_AVAILABILITY_ERROR_MODAL: 'ATCERT',
        CHANGE_FLIGHTS_SUMMARY: 'ATCSUM',
        CHANGE_FLIGHTS_PAYMENT: 'ATCPURC',
        ANC_SPECIAL_MEALS_UPDATE: 'MEALCF',
        ANC_SPECIAL_MEALS_OPEN_MODAL: 'MOMEAL',
        COMPLETE_TRAVEL: 'IBMCYT',
        STOP_OVER: 'HMMTDT',
        FLEXIBILIZATION_SEARCH_ONE_WAY: 'CVFFOW',
        FLEXIBILIZATION_SEARCH_WITH_RETURN: 'CVFFRT',
        FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR: 'CVFERD',
        FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR: 'CVFERB',
        FLEXIBILIZATION_AVAILABILITY_ONE_WAY: 'CVFPOW',
        FLEXIBILIZATION_AVAILABILITY_RETURN: 'CVFPRT',
        FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE: 'CVFPSG',
        FLEXIBILIZATION_NOT_AVAILABILITY: 'CVFERR',
        FLEXIBILIZATION_REBOOK_SERVICE_ERROR: 'CVFERS',
        FLEXIBILIZATION_REBOOK_ERROR: 'CVFERF',
        FLEXIBILIZATION_CONFIRMATION: 'CVBKCF',
        FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY: 'CIFFOW',
        FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN: 'CIFFRT',
        FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR: 'CIFERD',
        FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR: 'CIFERB',
        FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY: 'CIFPOW',
        FLEXIBILIZATION_INVOLUNTARY_SUMMARY: 'CIFSUM',
        ALTERNATIVE_TOTAL_FLEXIBILIZATION_INVOLUNTARY_SUMMARY: 'CITSUM',
        ALTERNATIVE_PARCIAL_FLEXIBILIZATION_INVOLUNTARY_SUMMARY: 'CIPSUM',
        FLEXIBILIZATION_INVOLUNTARY_PAYMENT: 'CIFPURC',
        FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN: 'CIFPRT',
        FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE: 'CIFPSG',
        FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY: 'CIFERR',
        FLEXIBILIZATION_INVOLUNTARY_REBOOK_SERVICE_ERROR: 'CIFERS',
        FLEXIBILIZATION_INVOLUNTARY_CHANGE_SERVICE_ERROR: 'CIWARN',
        FLEXIBILIZATION_INVOLUNTARY_REBOOK_ERROR: 'CIFERF',
        FLEXIBILIZATION_INVOLUNTARY_CONFIRMATION: 'CIBKCF',
        FLEXIBILIZATION_INVOLUNTARY_COMMS_ERROR: 'CIBKER',

        FLEXIBILIZATION_REFUND_BEGGINING: 'RVFDBT',
        FLEXIBILIZATION_VOUCHER_REFUND_SUMMARY: 'RVFDBD',
        FLEXIBILIZATION_VOUCHER_REFUND_INFO: 'RVFSMB',
        FLEXIBILIZATION_VOUCHER_REFUND_CONDITIONS: 'RVFTYC',
        FLEXIBILIZATION_VOUCHER_REFUND_ACCEPTANCE_MODAL: 'RVFCEB',
        FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVFCFP',
        FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVFCFP',
        FLEXIBILIZATION_CASH_REFUND_SUMMARY: 'RCFDBD',
        FLEXIBILIZATION_CASH_REFUND_ACCEPTANCE_MODAL: 'RCFCEB',
        FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_PAGE: 'RCFCFP',

        DISRUPTION_VOUCHER_REFUND_BEGGINING: 'RVDDBT',
        DISRUPTION_VOUCHER_REFUND_SUMMARY: 'RVDDBD',
        DISRUPTION_VOUCHER_REFUND_INFO: 'RVDSMB',
        DISRUPTION_VOUCHER_REFUND_CONDITIONS: 'RVDTYC',
        DISRUPTION_VOUCHER_REFUND_ACCEPTANCE_MODAL: 'RVDCEB',
        DISRUPTION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVDCFP',
        DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVDCFP',

        DISRUPTION_CASH_REFUND_SUMMARY: 'RCDDBD',
        DISRUPTION_CASH_REFUND_CONFIRMATION_MODAL: 'RCDCEB',
        DISRUPTION_CASH_REFUND_CONFIRMATION_PAGE: 'RCDCFP',
        /* CHANGE WITHOUT ALTERNATIVE AND WITHOUT FLEXIBILIZATION, CAN'T ACCEPT ALL CHANGES*/
        DISRUPTION_CHANGE_WITH_NO_ALTERNATIVE: 'CINTRE',
        /* CHANGE WITH ALTERNATIVE AND WITH FLEXIBILIZATION WHEN HAVE ALL SLICE DISRUPTED */
        DISRUPTION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITORE',
        AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITOAV',
        SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITOAC',
        CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITOBK',
        CONFIRMATION_CHANGE_WITH_ALTERNATIVE_FLEXIB_TOTAL: 'ATCBKCF',
        /* CHANGE WITH ALTERNATIVE AND WITH FLEXIBILIZATION WHEN HAVE ONE SLICE DISRUPTED */
        DISRUPTION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPARE',
        AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPAAV',
        SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPAAC',
        CONFIRMATION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPABK',
        /* CHANGE WITH ALTERNATIVE AND WITH FLEXIBILIZATION WHEN HAVE ONE SLICE DISRUPTED BUT SELECT CHANGE ALL SLICE*/
        DISRUPTION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPARE',
        AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTAV',
        SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTAC',
        CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTBK',
        /* CHANGE WITH ALTERNATIVE AND  WITHOUT FLEXIBILIZATION, CAN ACCEPT ALL CHANGES*/
        DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL: 'CIPARE',
        MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL: 'CINTBK',
        /* CHANGE WITHOUT ALTERNATIVE AND WITHOUT FLEXIBILIZATION ONLY CAN ACCEPT ONE CHANGE*/
        DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL: 'CINPRE',
        MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL: 'CINPBK',
        /* CHANGE WITHOUT ALTERNATIVE AND WITHOUT FLEXIBILIZATION*/
        DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_WITHOUT_FLEXIBILIZATION: 'IBICFC',
        /* CHANGE TIME - TK */
        DISRUPTION_CHANGE_TIME_TK_COMMERCIAL: 'IBICHC',
        DISRUPTION_CHANGE_TIME_TK_OPERATIONAL: 'IBICHC',
        CUSTOMIZE_YOUR_TRAVEL: 'MOANCI',
        //ANCILLARIES
        ANCILLARIES: 'CKIANC',
        EARLY_ANCILLARIES: 'ECKIANC',
        MODAL_SELECT_SEAT: 'MOSEAT',
        MODAL_SELECT_BAGG: 'MOBAGG',
        MODAL_ADD_CONTACT: 'MOCONT',
        MODAL_INF_SPECIAL_MEAL: 'MOMEAL',
        MODAL_SELECT_MEALS: 'MOMEAL',
        MODAL_SELECT_PRIO: 'MOPRIO',
        MODAL_SELECT_INS: 'MODINS',
        MODAL_BOB: 'MODBOB',
        MODAL_SELECT_BOB: 'MODBOB',
        MODAL_SPEQS: 'MOLUGG',
        MODAL_SELECT_SPEQS: 'MOLUGG',
        MODAL_BIDS: 'MOUPG',
        MODAL_SELECT_UPGRADING: 'MOUPG',
        MODAL_SELECT_FLEX: 'MOFLEX',
        MODA_DIGITAL_MENU: 'MODDIM',
        // INVOICES
        INVOICE_LIST: 'FACGDR',
        INVOICE_SELECTION: 'FACLIS',
        INVOICE_SELECTION_MOBILE: 'FACLISF',
        INVOICE_SUMMARY: 'FACRES',
        INVOICE_CONFIRMATION: 'FACSOK',
        INVOICE_MODAL_REVIEW_REQUEST: 'FACSOL',
        INVOICE_MODAL_ISSUED: 'FACEMT',
        INVOICE_MODAL_RESEND: 'FACROK',
        INVOICE_ERROR_SUMMARY: 'FACSKO',
        INVOICE_ERROR_PARTIAL: 'FACPKO',
        INVOICE_ERROR_RESEND: 'FACRKO',
        VOL_REFUND_ERROR_LOAD_PAGE: 'REFVKO',
        VOL_REFUND_DASHBOARD: 'REFVDB',
        VOL_REFUND_SUMMARY: 'REFVRE',
        VOL_REFUND_MODAL_CONFIRMATION: 'REFVCO',
        VOL_REFUND_MODAL_ERROR_REFUND: 'REFVER',
        VOL_REFUND_PAGE_CONFIRMATION: 'REFVBK',
        VOL_REFUND_MODAL_EXIT_REFUND: 'REFVEX',
        NEW_PAYMENT_PAGE_ANC: 'MDPURC',
        NEW_PAYMENT_PAGE_MMBVC: 'PAYMMB',
        NEW_PAYMENT_CONFIRMATION_MMBVC: 'CONMMB',

        COMUNICATION_SEAT: 'STBKER',
        COMUNICATION_BAGGAGE: 'BGBKER',
        COMUNICATION_INSURANCE: 'INBKER ',
        COMUNICATION_ANCILLARIES: 'MOBKER',
        COMUNICATION_CARBON_FOOTPRINT: 'CFBKER',

        MMB_ANCILLARIES_DEEPLINK_CONFIRMATION: 'STBKCFJBR',
        MMB_ANCILLARIES_CONFIRMATION: 'MOBKCF',
        MMB_NEW_ANCILLARIES_CONFIRMATION: 'MDBKCF',
        //SIMULATOR CHANGE FLIGHT
        SIMULATOR_SEARCH_ONEWAY: 'STCFOW',
        SIMULATOR_SEARCH_ROUNDTRIP: 'STCFRT',
        SIMULATOR_SEARCH_ERROR: 'STCERD',
        SIMULATOR_AVAILABILITY_ONEWAY: 'STCPOW',
        SIMULATOR_AVAILABILITY_ROUNDTRIP: 'STCPRT',
        SIMULATOR_ERROR_RIBBON: 'STCERR',
        SIMULATOR_ERROR_FARE: 'STCERT',
        SIMULATOR_SUMMARY: 'STCSUM',
    },
    UN_UNTK_QUADRIGAMS: [
        'CIFFOW',
        'CIPARE',
        'ATCERD',
        'ATCPOW',
        'ATCPRT',
        'ATCERR',
        'ATCERT',
        'ATCSUM',
        'ATCPURC',
        'ATCBKER',
        'MMBEXP'
    ],
    URL_PARAMETERS: {
        LOCATOR: 'pnr',
        SURNAME: 'surname',
        MARKET: 'market',
        LANGUAGE: 'language',
        CHANNEL: 'channel',
        DEVICE: 'device',
        ERROR_CODE: 'codeError',
        AIR_SHUTTLE: 'airshuttle',
        PREORDER: 'preorder',
        IS_STOPOVER: 'Stopover',
        VOUCHER_FROM_EMAIL: 'voucherEmail',
        FLIGHT_CHANGE_FROM_EMAIL: 'fcEmail',
        DEEP_LINK_SOURCE: 'source',
        DEEP_LINK_CODE: 'code',
        DEEP_LINK_RETURN_URL: 'returnURL',
        QUADRIGAM: 'quadrigam',
        SEAT: 'seat',
        BAGGAGE: 'baggage',
        SPEQ: 'speq',
        PRIORITY: 'priority',
        INSURANCE: 'insurance',
        UPGRADING_BID: 'bid',
        FLOWBOB: 'flowBob',
        FLIGHT_ID: 'flightId',
        VIP_SERVICES: 'vipServices'
    },
    GOOGLE_ADS_URIS: {
        TYPE_0: '/5508/iberia.com/check-in/Check-in-online-728x90',
        TYPE_1: '/5508/iberia.com/check-in/Check-in-online-300x250',
        TYPE_2: '/5508/iberia.com/check-in/Check-in-online-300x600',
        TYPE_3: '/5508/iberia.com/check-in/Check-in-online-160x600'
    },
    BANNER_IDS: {
        TYPE_0: 'banner_adds_728_90',
        TYPE_1: 'banner_adds_300_250',
        TYPE_2: 'banner_adds_300_600',
        TYPE_3: 'banner_adds_160_600'
    },
    DISRUPTION_TIME: {
        COMERCIAL_TIME: 'COMMERCIAL_TIME',
        OPERATIONAL_TIME: 'OPERATIONAL_TIME',
        MAJOR_DISRUPTION_TIME: 'MAJOR_DISRUPTION'
    },
    DESTINATION_IMAGE_SIZE: {
        desktop: '_2000_834.jpg',
        tablet: '_1023_400.jpg',
        mobile: '_958_332.jpg'
    },
    WCS: {
        PHONE_TYPES: {
            SALES: 'RESERVAS',
            IBHOLIDAYS: 'ATTBAH'
        }
    },
    MODAL_PAYMENT_TAXES: 'ib-modal-payment-taxes.html',
    MODAL_SPECIAL_NEEDS: 'ib-modal-special-needs.html',
    GENERAL_ERRORS_SERVICE: {
        SERVICE_GENERAL_ERROR: 'REST_SERVICE_ERROR_GENERAL',
        LOGGED_ERROR_TITLE: 'GENERAL_ADVICE_TITLE',
        LOGGED_ERROR_BODY: 'GENERAL_LOGGED_ERROR_BODY'
    },
    PURCHASEKEY: 'PURCHASE_MESSAGE',
    ON_HOLD_MARKETS: ['IE', 'FI', 'SE', 'DK', 'GR', 'ZA', 'HU', 'CZ', 'PT', 'AT', 'SN', 'CH', 'BE', 'MA', 'NL', 'RU', 'IT', 'DE', 'IL', 'DZ', 'FR', 'ES', 'GB', 'US', 'SV', 'EC', 'DO', 'PR', 'CO', 'CL', 'BR', 'CR', 'GT', 'PA', 'MX', 'PE', 'UY', 'AR', 'CN', 'JP', 'CU', 'CA', 'QA'],
    MMB_MARKETS: ['FI', 'SV', 'EC', 'DO', 'PA', 'GT', 'CR', 'PE', 'UY', 'GR', 'FR', 'IT', 'DE', 'NL', 'AT', 'HU', 'IL', 'DK', 'PR', 'SE', 'CH', 'BE', 'IE', 'US', 'PT', 'RU', 'CZ', 'AR', 'BR', 'DZ', 'SN', 'MA', 'VE', 'GB', 'MX', 'CN', 'JP', 'ZA', 'CU', 'ES', 'CL', 'CO', 'CA', 'QA'],
    VOLUNTARY_CHANGES_MARKETS: ['FI', 'ES'],
    NEWMMB_TRIPLIST_MARKETS: ['FI', 'PT', 'CO', 'JP', 'EC'],
    DAYS_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    MONTH_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    DEFAULT_TO_YEARS: 100,
    DEFAULT_FROM_YEARS: 0,
    FORMAT_DATE: [
        {
            code: 'es',
            dateFormat: {
                fullDate: 'EEEE, D "de" MMMM "de" Y',
                longDate: 'D "de" MMMM "de" Y',
                medium: 'D MMM Y H:mm:ss',
                mediumDate: 'D MMM Y',
                mediumTime: 'H:mm:ss',
                short: 'D/M/YY H:mm',
                gaDate: 'DD/MM/YYYY',
                shortDate: 'D/M/YY',
                shortTime: 'H:mm'
            }
        }, {
            code: 'en',
            dateFormat: {
                fullDate: 'EEEE, MMMM D, Y',
                longDate: 'MMMM D, Y',
                medium: 'MMM D, Y h:mm:ss a',
                mediumDate: 'MMM D, Y',
                mediumTime: 'h:mm:ss a',
                short: 'M/D/YY h:mm a',
                shortDate: 'M/D/YY',
                shortTime: 'h:mm a'
            }
        }, {
            code: 'ls',
            dateFormat: {
                fullDate: 'EEEE, MMMM D, Y',
                longDate: 'MMMM D, Y',
                medium: 'MMM D, Y h:mm:ss a',
                mediumDate: 'MMM D, Y',
                mediumTime: 'h:mm:ss a',
                short: 'M/D/YY h:mm a',
                shortDate: 'M/D/YY',
                shortTime: 'h:mm a'
            }
        }, {
            code: 'zh',
            dateFormat: {
                fullDate: 'y\u5e74M\u6708d\u65e5EEEE',
                longDate: 'y\u5e74M\u6708d\u65e5',
                medium: 'y\u5e74M\u6708d\u65e5 ah:mm:ss',
                mediumDate: 'y\u5e74M\u6708d\u65e5',
                mediumTime: 'ah:mm:ss',
                short: 'Y/M/D ah:mm',
                shortDate: 'Y/M/D',
                shortTime: 'ah:mm'
            }
        }, {
            code: 'ca',
            dateFormat: {
                fullDate: 'EEEE, D MMMM "de" Y',
                longDate: 'D MMMM "de" Y',
                medium: 'D MMM Y H:mm:ss',
                mediumDate: 'D MMM Y',
                mediumTime: 'H:mm:ss',
                short: 'D/M/YY H:mm',
                shortDate: 'D/M/YY',
                shortTime: 'H:mm'
            }
        }, {
            code: 'de',
            dateFormat: {
                fullDate: 'EEEE, D. MMMM Y',
                longDate: 'D. MMMM Y',
                medium: 'DD.MM.Y HH:mm:ss',
                mediumDate: 'DD.MM.Y',
                mediumTime: 'HH:mm:ss',
                short: 'DD.MM.YY HH:mm',
                shortDate: 'DD.MM.YY',
                shortTime: 'HH:mm'
            }
        }, {
            code: 'fr',
            dateFormat: {
                fullDate: 'EEEE D MMMM Y',
                longDate: 'D MMMM Y',
                medium: 'D MMM Y HH:mm:ss',
                mediumDate: 'D MMM Y',
                mediumTime: 'HH:mm:ss',
                short: 'DD/MM/Y HH:mm',
                shortDate: 'D/MM/Y',
                shortTime: 'HH:mm'
            }
        }, {
            code: 'it',
            dateFormat: {
                fullDate: 'EEEE D MMMM Y',
                longDate: 'D MMMM Y',
                medium: 'DD MMM Y HH:mm:ss',
                mediumDate: 'DD MMM Y',
                mediumTime: 'HH:mm:ss',
                short: 'DD/MM/YY HH:mm',
                shortDate: 'DD/MM/YY',
                shortTime: 'HH:mm'
            }
        }, {
            code: 'pt',
            dateFormat: {
                fullDate: 'EEEE, D "de" MMMM "de" Y',
                longDate: 'D "de" MMMM "de" Y',
                medium: 'D "de" MMM "de" Y HH:mm:ss',
                mediumDate: 'D "de" MMM "de" Y',
                mediumTime: 'HH:mm:ss',
                short: 'DD/MM/YY HH:mm',
                shortDate: 'DD/MM/YY',
                shortTime: 'HH:mm'
            }
        }, {
            code: 'ja',
            dateFormat: {
                fullDate: 'y\u5e74M\u6708d\u65e5EEEE',
                longDate: 'y\u5e74M\u6708d\u65e5',
                medium: 'Y/MM/dd H:mm:ss',
                mediumDate: 'Y/MM/DD',
                mediumTime: 'H:mm:ss',
                short: 'Y/MM/DD H:mm',
                shortDate: 'Y/MM/DD',
                shortTime: 'H:mm'
            }
        }, {
            code: 'nl',
            dateFormat: {
                fullDate: 'EEEE D MMMM Y',
                longDate: 'D MMMM Y',
                medium: 'D MMM Y HH:mm:ss',
                mediumDate: 'D MMM Y',
                mediumTime: 'HH:mm:ss',
                short: 'DD-MM-YY HH:mm',
                shortDate: 'DD-MM-YY',
                shortTime: 'HH:mm'
            }
        }, {
            code: 'ru',
            dateFormat: {
                fullDate: 'EEEE, D MMMM Y "\u0433".',
                longDate: 'D MMMM Y "\u0433".',
                medium: 'D MMM Y "\u0433". H:mm:ss',
                mediumDate: 'D MMM Y "\u0433".',
                mediumTime: 'H:mm:ss',
                short: 'DD.MM.YY H:mm',
                shortDate: 'DD.MM.YY',
                shortTime: 'H:mm'
            }
        }
    ],
    ANCILLARIES_TYPES: {
        BAGGAGE: 'BAGGAGE',
        SEAT: 'SEAT',
        INSURANCE: 'INSURANCE',
        VEHICLE_RENTAL: 'VEHICLE_RENTAL',
        UPGRADING: 'UPGRADING',
        SPEQS: 'SPECIAL_EQUIPMENT',
        SPECIAL_MEALS: 'SPECIAL_MEALS',
        UPGRADING_BID: 'UPGRADING_BID',
        UPGRADING_AVIOS: 'UPGRADING_AVIOS',
        UPGRADING_AVIOS_BID: 'UPGRADING_AVIOS_BID',
        FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
        PREORDER: 'PREORDER',
        PRIORITY_BOARDING: 'PRIORITY_BOARDING',
        INTEGRATED_BOB: 'INTEGRATED_BOB',
        BOB: 'BOB',
        CO2_FOOTPRINT: 'CO2_FOOTPRINT',
        PETC: 'PET'
    },
    TITLES_APP: {
        BOOKING: 'BBKI',
        MANAGEMYBOOKING: 'MMB',
        MANAGEMYBOOKING_ONHOLD: 'MMBOH',
        MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
        MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
        MANAGEMYBOOKING_DISRUPTION: 'MMBDISR',
        MANAGEMYBOOKING_BIDS: 'MMBBID',
        ONHOLD: 'BBKIOH',
        CHECKIN: 'CKI',
        SHUTTLE: 'MMBPA',
        SHUTTLE_OPEN: 'PAOB',
        SHUTTLE_OPEN_ONB: 'PAOBONB',
        SHUTTLE_REDEMPTION: 'PARE',
        SHUTTLE_REDEMPTION_ONB: 'PAREONB',
        GIFTCARDS: 'GIFTCARDS'
    },
    SEAT_FEATURE: {
        EMERGENCY_EXIT: 'EMERGENCY_EXIT',
        EXTRA_SIZE: 'EXTRA_SIZE',
        WINDOW: 'WINDOW',
        WING: 'WING',
        SCREEN: 'ENTERTAINMENT_SCREEN',
        NON_RECLINING: 'NON_RECLINING',
        INFANT: 'PASSENGER_WITH_INFANT',
        MOBILITY: 'RESTRICTED_MOBILITY',
        WC: 'WC',
        GALLEY: 'GALLEY',
        PROMO: 'PROMO',
        UPFRONT: 'UPFRONT',
        AISLE: 'AISLE',
        NEIGHBOR_FREE: 'L'
    },
    PURCHASEMESSAGES: ['PURCHASE_WITHOUT_PAYMENT', 'PURCHASEOK_WITHOUT_TICKETS'],
    PAYMENT_STATUS: {
        PENDING_PAYMENT: 'PENDING_PAYMENT'
    },
    ONHOLD: {
        ORDERPRICEDEFAULT: 0
    },
    STEPS_CHANGE_VOLUNTARY: {
        SELECT_FLIGHT: 'SELECT_FLIGHT',
        SUMMARY: 'SUMMARY',
        PAYMENTS: 'PAYMENTS',
        CONFIRMATION: 'CONFIRMATION',
        COMUNICATION_LOST: 'COMUNICATION_LOST'
    },
    STEPS_SIMULATOR_CHANGE_VOLUNTARY: {
        SELECT_FLIGHT: 'SELECT_FLIGHT',
        SUMMARY: 'SUMMARY'
    },
    HttpServices: {
        timeWait: 2000,
        numAttemps: 3,
        WCS_URIS: {
            PHONES: '/cs/Satellite?pagename=IB_SE_Services&service=getContact',
            JSESSIONCLEAN: '/cs/Satellite?pagename=IB_SE/CacheControl0s/Integration/logOut'
        }
    },
    IBERIA_HOLIDAYS: {
        MMB_IB_VACIONES_TYPE_PACKAGE: 'flight+hotel',
        MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL: 'hotel',
        MMB_IB_VACIONES_TYPE_PACKAGE_VEHICLE: 'vehicle',
        MMB_IB_VACIONES_TYPE_PACKAGE_FLIGHT_ITINERARY: 'flightItinerary',
        MMB_IB_VACIONES_TYPE_PACKAGE_EXPERIENCE: 'experience',
        MMB_IB_VACIONES_TYPE_PACKAGE_TRANSFER: 'transfer',
        MMB_IB_VACIONES_TYPE_LINK_AVIS: '../../iberia-web-content/iconos/IB_Vacaciones/AVIS_RED@2x.svg',
        MMB_IB_VACIONES_TYPE_LINK_BUDGET: '../../iberia-web-content/iconos/IB_Vacaciones/Budget_logo.svg',
        MMB_IB_VACIONES_TYPE_COMPANY_CAR_AVIS: 'ZI',
        MMB_IB_VACIONES_TYPE_COMPANY_CAR_BUDGET: 'ZD',
        MMB_IB_VACIONES_TYPE_NEGATIVE: ' - ',
        MMB_IB_VACIONES_TYPE_SPACE: ' '
    },
    LIMIT_DATE: {
        FLEXIBILIZATION_CHANGES: '2021, 6, 30'
    },
    WARNING_MESSAGES: {
        OVERNIGHT_WARNING: 'SSE_AVM_20003',
        TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
        AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
        LONG_WAITING_WARNING: 'SSE_AVM_20004',
        MISSCONNECTION_FLEX_WARNING: 'SSE_ORM_20014',
        SAME_SURNAME_WARNING: 'SSE_ORM_9149',
        CORRECTION_NAME_NOT_PERMITED: 'SSE_ORM_900562',
        ONHOLD_PARTNER_MUST_LOGGED: 'SSE_MBM_1011',
    },
    ANCILLARIES_IMPORT_ORDER_TYPE: {
        BAGGAGE: 'baggage',
        SEAT: 'seat',
        SPEQS: 'specialEquipment',
        PRIORITY_BOARDING: 'priorityBoarding'
    },
    CALENDAR_POSITION: {
        RIGHT: 'bottom-right',
        LEFT: 'bottom-left'
    },
    PNR_EMITION_CHANNEL: {
        FLEX_FLIGHT_DIRECT: [
            'IBCOM',
            'CALL_CENTER',
            'NDC_DIRECT'
        ],
        FLEX_FLIGHT_INDIRECT: [
            'NDC_INDIRECT',
            'OTHER'
        ]
    },
    QUALIFIERS: 'IBDPHOLIDAYS',
    FLIGHTTYPE: 'multiCityFlight',
    PASSENGER_TYPE: {
        SENIOR: 'SENIOR',
        ADULT: 'ADULT',
        YOUTH: 'YOUTH',
        TEENAGER: 'YOUNG',
        YOUNG_ADULT: 'YOUNG_ADULT',
        CHILD: 'CHILD',
        INFANT: 'INFANT'
    },
    FLIGHTS_TYPES: {
        DIRECT: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
        INDIRECT: 'MMB_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT'
    },
    ACCOUNT_TYPES: {
        LOAN: 'LOAN',
        RECOGNITION: 'RECOGNITION',
        REWARD: 'REWARD',
        TOTAL_REWARD: 'TOTAL_REWARD'
    },
    EMAIL_NOTIFICATION: {
        VOUCHER: {
            title: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TITLE',
            subtitle: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TEXT',
            body: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TEXT_2',
            note: 'MMB_VOUCHER_REFUND_BREAKDOWN_EMAIL_CONFIRMATION'
        },
        CASH: {
            title: 'MMB_CASH_REFUND_MODAL_TITLE',
            subtitle: 'MMB_CASH_REFUND_MODAL_MESSAGE',
            note: 'MMB_CASH_REFUND_BREAKDOWN_EMAIL_CONFIRMATION'
        }
    },
    SPECIAL_NEEDS: {
        SVAN_STATUS: {
            HK: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
            KK: { code: 'KK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
            UC: { code: 'UC', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
            UN: { code: 'UN', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
            DEFAULT: { code: '', description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' } //Pendiente
        },
        CODE: {
            BLND: 'BLND',
            DEAF: 'DEAF',
            SVAN: 'SVAN',
            DPNA: 'DPNA',
            WHEEL_CHAIR: ['WCHR', 'WCHS', 'WCHC']
        },
        TEXT: {
            GUIDE_DOG: 'GUIDE DOG',
            NOT_GUIDE_DOG: 'NOT GUIDE DOG'
        }
    },
    RESIDENT: {
        STATUS: {
            VERIFIED: 'VERIFIED',
            NOT_VERIFIED: 'NOT_VERIFIED'
        },
        CITY: {
            RM: 'IBBKCF_RESIDENT_CITY_MELILLA_NAME',
            RC: 'IBBKCF_RESIDENT_CITY_CANARIAS_NAME',
            BP: 'IBBKCF_RESIDENT_CITY_BALEARES_NAME',
            BI: 'IBBKCF_RESIDENT_CITY_BALEARES_NAME',
            DC: 'interCanarias'
        }
    },
    OPEN_JBA_LINK: true,
    ORDER_STATUS_VALUES: {
        ISSUED: 'ISSUED',
        INVOLUNTARY_FLAG: 'ACCEPT_CHANGES_PENDING',
        CANCELATION_FLAG: 'UNCONFIRMED_CHANGES',
        CANCELATION_REACOM_FLAG: 'ACCEPT_CHANGES_PENDING',
        SCHEDULE_CHANGE: 'ACCEPT_CHANGES_PENDING_TK',
        CANCELATION_MIXED_CHANGE: 'UNCONFIRMED_CHANGES_MIXED',
        CANCELATION_REACOM_MIXED_CHANGE: 'ACCEPT_CHANGES_PENDING_MIXED',
        CANCELATION_CHANGES: 'CANCELATION_CHANGES',
        WAITLIST_CONFIRMED_CHANGES: 'WAITLIST_CONFIRMED_CHANGES',
        DISRUPTION_CHANGES_MIXED: 'DISRUPTION_CHANGES_MIXED'
    },
    ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
    COMMON_LABELS: {
        CHANNEL: {
            IBCOM: {
                VALUE: 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                PHONE: true
            },
            NDC_DIRECT: {
                VALUE: 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                PHONE: true
            },
            NDC_INDIRECT: {
                VALUE: 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                PHONE: false
            },
            CALL_CENTER: {
                VALUE: 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                PHONE: true
            },
            OTHER: {
                VALUE: 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                PHONE: false
            },
            DEFAULT: {
                VALUE: 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                PHONE: true
            }


        }
    },
    DOCUMENT_STATUS: [
        {
            ID: 'OK',
            CODES: ['DOCUMENTATION_OK', 'DOC_REVIEWED'],
            TITLE: 'MMB_DOCUMENTS_STATUS_OK_TITLE',
            DESCRIPTION: 'MMB_DOCUMENTS_STATUS_OK_DESCRIPTION',
            ICON: 'icon-validar',
            LINK: false
        },
        {
            ID: 'SEND',
            CODES: ['DOC_SENT'],
            TITLE: 'MMB_DOCUMENTS_STATUS_CONFIRMING_DOCUMENT_TITLE',
            DESCRIPTION: 'MMB_DOCUMENTS_STATUS_CONFIRMING_DOCUMENT_DESCRIPTION',
            ICON: 'icon-reloj',
            LINK: true
        },
        {
            ID: 'KO',
            CODES: ['DOCUMENTATION_KO'],
            TITLE: 'MMB_DOCUMENTS_STATUS_KO_TITLE',
            DESCRIPTION: 'MMB_DOCUMENTS_STATUS_UPLOAD_DOCUMENTS',
            ICON: 'icon-wrong',
            LINK: true
        },
        {
            ID: 'PENDIND',
            CODES: ['DOCUMENTATION_NOT_UPLOADED', 'PENDING'],
            TITLE: 'MMB_DOCUMENTS_STATUS_PENDING_TITLE',
            DESCRIPTION: 'MMB_DOCUMENTS_STATUS_UPLOAD_DOCUMENTS',
            ICON: 'icon-alertas_2',
            LINK: true
        },
        {
            ID: 'CANCELLED',
            CODES: ['REQUEST_CANCELLED', 'CLOSED_BY_AGENT'],
            TITLE: 'MMB_DOCUMENTS_STATUS_NOT_VERIFIED_TITLE',
            DESCRIPTION: 'MMB_DOCUMENTS_STATUS_NOT_VERIFIED_DESCRIPTION',
            ICON: 'icon-wrong',
            LINK: false
        }
    ],
    DOCUMENTS_SEGMENT_STATUS: {
        CODES: {
            ONLINE_DOCUMENTATION_ALLOWED: 'ONLINE_DOCUMENTATION_ALLOWED',
            ONLINE_DOCUMENTATION_NOT_ALLOWED: 'ONLINE_DOCUMENTATION_NOT_ALLOWED',
            NOT_AIRCHECK_SEGMENT: 'NOT_AIRCHECK_SEGMENT',
            UNKNOWN: 'UNKNOWN'
        },
        WARNINGS: [
            {
                CODE: 'ONLINE_DOCUMENTATION_ALLOWED',
                WARNING: null
            },
            {
                CODE: 'NOT_AIRCHECK_SEGMENT',
                WARNING: {
                    type: 'with-link',
                    icon: 'icon-informacion_2 ib-message-box__icon--big',
                    modifier: 'ib-message-box--center ib-message-box--boxed-with-icon ib-message-box--gray-50',
                    titleTxt: 'MMB_DOCUMENTS_ERROR_TITLE',
                    titleModifier: 'ib-message-box__title--xsmall ib-message-box__title--font-normal ib-message-box__title--bold',
                    text: ['MMB_DOCUMENTS_ERROR_DESCRIPTION'],
                    linkText: 'MMB_DOCUMENTS_ERROR_FIND_OUT',
                    urlLink: ''
                }
            },
            {
                CODE: 'ONLINE_DOCUMENTATION_NOT_ALLOWED',
                WARNING: {
                    type: 'with-link',
                    icon: 'icon-reserva72 u-color-primary ib-message-box__icon--big',
                    modifier: ' ib-message-box--center ib-message-box--boxed-with-icon',
                    titleTxt: 'MMB_ALERT_IMPORTANT',
                    titleModifier: 'ib-message-box__title--xsmall ib-message-box__title--font-normal ib-message-box__title--bold',
                    text: ['MMB_DOCUMENTS_IMPORTANT_WARNING_MESSAGE'],
                    linkText: 'MMB_DOCUMENTS_ERROR_FIND_OUT',
                    urlLink: ''
                }
            },
            {
                CODE: 'UNKNOWN',
                WARNING: {
                    type: 'with-link',
                    icon: 'icon-informacion_2 u-color-primary',
                    modifier: 'ib-message-box--center ib-message-box--boxed',
                    titleTxt: 'MMB_DOCUMENTS_STATUS_UNKNOWN_TITLE',
                    titleModifier: 'ib-message-box__title--xsmall ib-message-box__title--font-normal ib-message-box__title--bold',
                    text: ['MMB_DOCUMENTS_STATUS_UNKNOWN_TEXT'],
                    linkText: 'MMB_DOCUMENTS_STATUS_UNKNOWN_LINK',
                    urlLink: ''
                }
            }
        ]
    },
    FARE_FAMILY_ICON_PROPERTY_CODE: {
        EQMANO: 'icon-e_equipaje',
        EQMANO10: 'icon-e_equipaje',
        EQMANO14: 'icon-e_equipaje',
        EQBODEGA: 'icon-e_equipaje_facturado',
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
    AVAILABLE_COMMERCIAL_CODES: ['YPA', 'BPA', 'YPACONF'],
    AVAILABLE_AVIOS_DISCOUNTS: ['PARTNER', 'LGF', 'VOUCHER', 'RES'],
    VOUCHER_TYPES: {
        RESTAURANT: 'RESTAURANT',
        ACCOMODATION: 'ACCOMODATION'
    },
    VOUCHER_LINKS: {
        RESTAURANT: 'https://inci.iberia.com/QSP/client/general-info/interesting-points',
        ACCOMODATION: 'https://www2.melia.com/meliapro/es/landing/iberia/vouchers.html'
    },
    VOUCHER_ACTION_TYPES: {
        DOWNLOAD: 'DOWNLOAD',
        EMAIL: 'EMAIL'
    },
    VOUCHER_CONDITION_TYPES: {
        BOARDING: 'BOARDING',
    },

    //MIGRATION COMMONS TO APPS
    passengerTypes: {
        Default: 'DEFAULT',
        senior: 'SENIOR',
        adult: 'ADULT',
        young: 'YOUTH',
        child: 'CHILD',
        infant: 'INFANT',
        SPECIAL_NEEDS: 'specialNeed'
    },
    LARGE_FAMILY_TYPES: [
        { code: 'F1', name: 'GENERAL' },
        { code: 'F2', name: 'ESPECIAL' }
    ],

    LARGE_FAMILY_DISCOUNT_TYPE_MAP: {
        'SPECIAL': 'ESPECIAL',
        'GENERAL': 'GENERAL'
    },

    LOGIN_ONB: 'ONB',
    DISCOUNT_TYPE: {
        RESIDENT: 'RES',
        LARGE_FAMILY: 'LGF',
        DUMBO: 'DUMBO',
        PLUTO: 'PLUTO',
        PARTNER: 'PARTNER',
        DYNAMIC_PRICING: 'DYNAMIC_PRICING',
        CORPORATE: 'CORPORATE'
    },
    ANCILLARIES_LITERALS_INVOICES: {
        PRIORITY_BOARDING: 'PRIORITY_BOARDING_TITLE',
        FLEXIBILITY_ON_DEMAND: 'ANCILLARIES_FLEXIBILITY_SUBTITLE_MODAL',
        BAGGAGE_15: 'ANCILLARIES_BAGGAGE_TITLE_15',//?
        BAGGAGE_23: 'ANCILLARIES_BAGGAGE_TITLE_23',//?
        BAGGAGE_32: 'ANCILLARIES_BAGGAGE_TITLE_32',//?
        SEAT: 'SEAT_TEXT',//
        VOUCHER_REFUND: 'ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE',//no esta
        FLIGHT_CHANGE: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
        FLEXIBILITY_PACK: 'ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY',
        INSURANCE: 'ANCILLARIES_INSURANCE_TITLE',
        BOB: 'ANCILLARIES_BOB_MODAL_TITLE',
        CO2_FOOTPRINT: 'ANCILLARIES_CO2_FOOTPRINT_MODAL_TITLE',
        SKI_SNOW: 'SPEQS_SKI_SNOW',
        GOLF_EQUIPMENT: 'SPEQS_GOLF_EQUIPMENT',
        BICYCLE: 'SPEQS_BICYCLE',
        SURFBOARD: 'SPEQS_SURFBOARD_TITLE',
        SCUBA_DIVING: 'SPEQS_SCUBA_TITLE',
        FISHING_EQUIPMENT: 'SPEQS_FISHING_TITLE'
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
    BAGG_TYPE: {
        BAGGAGE_15: 'BAGGAGE_15',
        BAGGAGE_23: 'BAGGAGE_23',
        BAGGAGE_32: 'BAGGAGE_32',
    },
    INVOICE_DATA_TYPE: {
        PARTICULAR: 'PARTICULAR',
        COMPANY: 'COMPANY'
    },
    INVOICE_STATES: {
        ISSUED: 'ISSUED',
        REQUESTED: 'REQUESTED',
        NOT_AVAILABLE: 'NOT_AVAILABLE'
    },
    COUNTRIES_FOR_STATES_LITERAL: ['US', 'CA', 'AR', 'BR'],
    LONG_COINS_MARKETS: ['DZD', 'ARS', 'BRL', 'CLP', 'CNY', 'COP', 'CRC', 'GTQ', 'XAF', 'JPY', 'DIR', 'MXN', 'DOP', 'FCFA', 'RUB'],
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
    OH_FLIGHT_TYPES: {
        AVAILABILITY: 'availabilityFlight',
        METASEARCH: 'metasearchFlight',
        MULTITRIP: 'multiCityFlight',
        REDEMPTION: 'redemptionFlight',
        REDEMPTIONOB: 'redemptionOBFlight'

    },
    APP_TYPES: {
        BOOKING: 'BBKI',
        MANAGEMYBOOKING: 'MMB',
        MANAGEMYBOOKING_ONHOLD: 'MMBOH',
        MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
        MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
        MANAGEMYBOOKING_BIDS: 'MMBBID',
        MANAGEMYBOOKING_UNIFIED: 'MMBUNIF',
        ONHOLD: 'BBKIOH',
        CHECKIN: 'CKI',
        SHUTTLE_OPEN: 'PAOB',
        SHUTTLE_OPEN_ONB: 'PAOBONB',
        SHUTTLE_REDEMPTION: 'PARE',
        SHUTTLE_REDEMPTION_ONB: 'PAREONB',
        GIFTCARDS: 'GIFTCARDS',
        SUBSCRIPTIONMODELS: 'SUBSCRIPTIONMODELS',
    },
    PAYMENT_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        EXTERNAL_CREDITCARD: 'EXTERNAL_CREDITCARD',
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER',
        ONHOLD: 'ONHOLD',
        ONHOLD_CREDITCARD: 'ONHOLD_CREDITCARD',
        ONHOLD_IBERIA_PAY: 'ONHOLD_IBERIA_PAY',
        BUTTON: 'BUTTON',
        PAYPAL: 'PAYPAL',
        NEMURU: 'NEMURU',
        NEW_CARD: 'newCard',
        IBERIA_PAY: 'IBERIA_PAY',
        FULL_AVIOS: 'FULL_PAY_AVIOS',
        COUPONS: 'COUPONS',
        IBERIA_PAY_AFOP: 'IBERIA_PAY_AFOP',
        ONHOLD_IBERIA_PAY_AFOP: 'ONHOLD_IBERIA_PAY_AFOP'
    },
	TRIP_TYPES: {
        DEPARTURE: 'DEPARTURE',
        ARRIVAL: 'ARRIVAL',
        MULTITRIP: 'MULTITRIP'
	},
    ECOMMERCE: {
        FLIGHT: 'flight',
        DIRECT_PURCHASE: 'compra directa',
        MULTIPLE_JOURNEYS: 'multiples trayectos',
        METASEARCH: 'metabuscador',
        STOPOVER_HMAD: 'hola madrid'
    },
    SEARCH_FLIGHT_TYPE: {
        AVAILABILITY: 'availabilityFlight',
        METASEARCH: 'metasearchFlight',
        MULTITRIP: 'multiCityFlight',
        REDEMPTION: 'redemptionFlight',
        REDEMPTIONOB: 'redemptionOBFlight',
        PAOPEN: 'shuttleFlow'
    },
	STORAGE_KEYS: {
        PAYMENTS_VIEWTYPE: 'payment-view-type',
        PMT_REDIRECTION_CONTEXT: 'pmtRedirectContext',
        PMT_REDIRECTION_CONTEXT_STATUS_INIT: 'redirection-init',
        PMT_REDIRECTION_CONTEXT_STATUS_END: 'redirection-end'
    },
    ORDER_ITEMS_TYPES: {
        FLIGHT: 'flight',
        CREDIT_CARD_FEE: 'creditCardFee',
        CO2_FOOTPRINT: 'co2Footprint'
    },
    PHONESIBV : [
        {
         "market" : "AT",
         "phone" : "(+43) (0) 1 20 609 1608"
        },
        {
         "market" : "BE",
         "phone" : "(+32) (0) 27007392"
        },
        {
         "market" : "CL",
         "phone" : "(+56) 223937045"
        },
        {
         "market" : "CO",
         "phone" : "(+57) 12249855"
        },
        {
         "market" : "CR",
         "phone" : "506 2136 6748"
        },
        {
         "market" : "HR",
         "phone" : "0800 806 037"
        },
        {
         "market" : "CZ",
         "phone" : "(+420) (0) 239016792"
        },
        {
         "market" : "DK",
         "phone" : "(+45) 43314518"
        },
        {
         "market" : "DO",
         "phone" : "(+1) 8092116610"
        },
        {
         "market" : "SV",
         "phone" : "(+503) 4036 0001"
        },
        {
         "market" : "FR",
         "phone" : "(+33) (0) 157324975"
        },
        {
         "market" : "DE",
         "phone" : "(+49) (0) 69999915392"
        },
        {
         "market" : "GR",
         "phone" : "80044145936"
        },
        {
         "market" : "GT",
         "phone" : "(+34) 911776310"
        },
        {
         "market" : "IE",
         "phone" : "(+353) 019075476"
        },
        {
         "market" : "IL",
         "phone" : "(+1) 809303149"
        },
        {
         "market" : "IT",
         "phone" : "(+39) 0223331231"
        },
        {
         "market" : "MT",
         "phone" : "(+356) 080062620"
        },
        {
         "market" : "MX",
         "phone" : "(+52) 015547380421"
        },
        {
         "market" : "MA",
         "phone" : "(+34) 911776310"
        },
        {
         "market" : "NL",
         "phone" : "(+31) (0) 207006065"
        },
        {
         "market" : "NI",
         "phone" : "(+1) 2116609"
        },
        {
         "market" : "PA",
         "phone" : "0018005073296"
        },
        {
         "market" : "PT",
         "phone" : "808203646"
        },
        {
         "market" : "PR",
         "phone" : "(+1) 2116611"
        },
        {
         "market" : "RU",
         "phone" : "(+7) 4992718758"
        },
        {
         "market" : "ES",
         "phone" : "(+34) 911776310"
        },
        {
         "market" : "SE",
         "phone" : "(+46) 859366427"
        },
        {
         "market" : "CH",
         "phone" : "(+41) (0) 446545772"
        },
        {
         "market" : "TU",
         "phone" : "800448825935"
        },
        {
         "market" : "UK",
         "phone" : "(+44) 020 3788 0698"
        },
        {
         "market" : "US",
         "phone" : "(+1) 6692317130"
        },
        {
         "market" : "VE",
         "phone" : "08001003757"
        },
    ],
    VOLUNTARY_REFUNDS_NOT_REFUNDS_ITEMS_ROUTES: {
        CA: 'preguntes-frequents/canvis-cancellacions-reembossaments/',
        ES: 'preguntas-frecuentes/cambios-cancelaciones-reembolsos/',
        PT: 'duvidas-mais-habituais/alteracoes-cancelamentos-reembolsos/',
        EN: 'faqs/changes-cancellations-refunds/',
        FR: 'questions-frequentes/changements-annulations-remboursements/',
        IT: 'domande-frequenti/cambi-cancellazioni-rimborsi/',
        NL: 'veelgestelde-vragen/wijzigingen-annuleringen-terugbetalingen/',
        DE: 'die-haufigsten-fragen/anderungen-stornierungen-erstattungen/',
        RU: 'chasto-zadavaemye-voprosy/vnesenie-izmeneniy-otmena-vozvrat/'
    },
    VOLUNTARY_REFUNDS_TRACKING_ROUTES: {
        CA: '/seguiment-reemborsaments/#/REFUNDS',
        ES: '/seguimiento-reembolsos/#/REFUNDS',
        PT: '/acompanhar-reembolsos/#/REFUNDS',
        EN: '/refund-tracking/#/REFUNDS',
        FR: '/suivi-remboursements/#/REFUNDS',
        IT: '/monitoraggio-rimborsi/#/REFUNDS',
        NL: '/terugbetalingen-volgen/#/REFUNDS',
        DE: '/rueckverfolgung-rueckerstattungen/#/REFUNDS',
        RU: '/otslezhivaniye-vozvratov/#/REFUNDS',
        ZH: '/refund-tracking/#/REFUNDS',
        JA: '/refund-tracking/#/REFUNDS',
    },
    SIMULATOR_MANAGEMENT_FEES_ROUTES: {
        CA: 'despeses-de-gestio/',
        DE: 'serviceentgelt/',
        ES: 'gastos-de-gestion/',
        EN: 'service-fees/',
        FR: 'frais-demission/',
        IT: 'addebiti-per-emissione/',
        NL: 'nl/service-fees/',
        PT: 'gastos-de-emissao/',
        RU: 'administrativnij-sbor/',
        ZH: 'zh/service-fees/',
        JA: 'ja/service-fees/',
        DEFAULT: 'service-fees'
    },
    SECURITY_AND_TRAVEL_DOCUMENTS_MANDATORY: {
        DNI: ['DNI'],
        PSPT: ['PASSPORT']
    },
    SECURITY_AND_TRAVEL_DOCUMENTS_OPTIONALS: {
        VISA: ['VISA'],
        GREENCARD: ['GREENCARD'],
        REDRESSNUMBER: ['REDRESSNUMBER'],
        KNOWNTRAVELERNUMBER: ['KNOWNTRAVELERNUMBER']
    },
    DISRUPTION_SEATS: {
        CANCELLED_SEATS: 'CANCELLED_SEATS',
        PROVIDER_IB: 'IB'
    },
    FLIGHT_STATUS: {
        CA: '/estat-vols/',
        ES: '/estado-vuelos/',
        PT: '/status-voos/',
        EN: '/flight-status/',
        FR: '/statut-vols/',
        IT: '/stato-voli/',
        NL: '/vluchtstatus/',
        DE: '/status-fluge/',
        RU: '/status-reysov/',
        ZH: '/zh/flight-status/',
        JA: '/ja/flight-status/',
    },
    TOGGLE: {
        isActiveVoucherMmb: true,
        isActiveAviosMmb: false,
        isSoftUserHideEnabled: true,
        isActiveOrderHandler: false,
        isActiveDeinvoicing: envCopy.toggle?.deinvoicingActive !== undefined ? envCopy.toggle.deinvoicingActive : true,
        isActiveUmnr: envCopy.toggle?.umnrActive !== undefined ? envCopy.toggle.umnrActive : false,
    },
	OPERATIONAL_IBERIA_GROUP: ['YW','IB','I2','LV','I0','0I','EB','E9','LL','P6','3L'],
    TIMEOUT_OTP_LOTUS: 300000, // 10 minutes in milliseconds
    PETS_STATUS: {
        PENDING:'PENDING',
        PENDING_PAYMENT:'PENDING_PAYMENT'
    },
    UMNR_DATA: {
        SESSION_STORAGE_KEY: 'dataUmnrCompleted'
    }
};
angular.module('ib-MmB-app').constant('MmBAppConstants', MmBAppConstants);
export { MmBAppConstants };
