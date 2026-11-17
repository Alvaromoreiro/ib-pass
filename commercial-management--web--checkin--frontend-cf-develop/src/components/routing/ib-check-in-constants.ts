/* eslint-disable no-console */

import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const GLOBAL_AUTH_TOKEN = envCopy.globalAuthorizationToken;
const AUTH_URI = envCopy.auth;
const SERVICE_URI = envCopy.services;
const CLOUD_URI = envCopy.cloud;
const CLOUD_MY_IBERIA_URI: string = envCopy.cloudMyIberia;
const otpServicesURI: string = envCopy.otpServices;
const paymentsComponentURI: string = envCopy.paymentsComponent;

export enum TravelAgencyQueryParameter {
    CKI_AAVV = 'ckiParaAAVV',
    UNDOCKI = 'undoCKI'
}

const URL_PARAMS = {
    PNR: 'pnr',
    SURNAME: 'surname',
    MARKET: 'market',
    LANGUAGE: 'language',
    CHANNEL: 'channel',
    DEVICE: 'device',
    ERROR_CODE: 'codeError',
    CODE: 'code',
    PAYMENT_STATUS: 'paymentStatus',
    COMPONENT_TYPE: 'componentType',
    TRAVEL_AGENT: 'travelAgent',
    CKI_AAVV: TravelAgencyQueryParameter.CKI_AAVV,
    UNDOCKI: TravelAgencyQueryParameter.UNDOCKI
};

const CheckinAppConstants = {
    //configuration parameters
    lang: 'es',
    market: 'ES',
    timeWait: 2000,
    numAttemps: 3,
    globalAuthorizationToken: GLOBAL_AUTH_TOKEN,
    flowName: 'CKI',
    servicesURI: SERVICE_URI,
    otpServicesURI,
    paymentsComponentURI,

    //rest service Calls
    anonymousTokenURI: AUTH_URI + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    userLoginURI: AUTH_URI + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    endpointsServiceURI: SERVICE_URI + '/endpoints/',

    DEFAULT_ENDPOINTS: {
        paymentMethodsServiceURI: SERVICE_URI + '/pmt-ppm/rs/ppm/v2/',
        newPaymentAvailableURI: `${SERVICE_URI}/pmt-ppm/rs/ppm/v7/config/new-payment-available/market/{{marketId}}/realm/{{realm}}`,
        getPaymentContextURI: `${CLOUD_URI}/v1/payment/payment-context/{{flowId}}`,
        checkVoucherCodeServiceURI: `${SERVICE_URI}/ass-fass/rs/fass/v5`,
        renacen3dFeaturesCssPREE: 'https://iberia.3dseatmapvr.com/SeatMapVR3D/Upgrade/pre/SeatMapVR3D.min.css',
        renacen3dFeaturesJsPREE: 'https://iberia.3dseatmapvr.com/SeatMapVR3D/Upgrade/pre/SeatMapVR3D.min.js',
        renacen3dFeaturesCssPRO: 'https://iberia.3dseatmapvr.com/SeatMapVR3D/Upgrade/pro/SeatMapVR3D.min.css',
        renacen3dFeaturesJsPRO: 'https://iberia.3dseatmapvr.com/SeatMapVR3D/Upgrade/pro/SeatMapVR3D.min.js'
    },
    SALESFORCE_ENDPOINTS: {
        TRAVEL_DOCUMENTS: `${CLOUD_MY_IBERIA_URI}/v1/travel-documents`
    },

    PARAMS: {
        checkVoucherCodeServiceParamsURI: '/{flowId}/voucher/validation/{voucherCode}',
        deleteVoucherCodeServiceParamsURI: '/{flowId}/voucher/remove/{voucherCode}',
        checkPostVoucherCodeParamsURI: '/{flowId}/voucher/validation/{voucherCode}/otp/{otpSessionId}'
    },

    //Labels
    generalI18nRoute: '/iberia-web-content/literales/general/',
    i18nRoute: '/iberia-web-content/literales/checkin/',

    //app Routes
    iconsRoute: '/iberia-web-content/iconos',
    localeRoute: '/iberia-web-content/locales',
    imagesRoute: '/iberia-web-content/imagenes',
    linksRoute: '/iberia-web-content/links/checkin',
    generalLinksRoute: '/iberia-web-content/links/general',
    aerolinesLogoUrl: '/iberia-web-content/iconos/aerolineas/',
    creditCardJsonRoute: '/iberia-web-content/iconos/payment/creditcardlogo.json',
    airlinesJsonRoute: '/iberia-web-content/iconos/aerolineas/aeroLineas.json',
    imgCitiesJsonRoute: '/iberia-web-content/imagenes/ciudades/cities.json',
    creditCard: '/iberia-web-content/iconos/payment/',
    TypeofTransport: '/iberia-web-content/iconos/vuelos_pasajeros/',
    iconsFlags: '/iberia-web-content/iconos/circle_flags',
    imgCities: '/iberia-web-content/imagenes/ciudades',
    creditCardLogoBaseRoute: '/payment/',
    loadingCardsPath: '/cargando/cardPayData.json',
    defaultCreditCardLogo: 'ico-tarjeta.png',
    templatesRoute: 'web-checkin/templates/',
    //Login Url
    ckiLoginUrl: '/web/newCKILogin.do',
    METAS: {
        ca: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Reserva el seient, obtén la targeta d\'embarcament en línia i podràs anar directament a la porta d\'embarcament.',
            'META-KEYWORDS': 'check-in, checkin, facturació, facturar maletes, escollir seient, embarcament, targeta d\'embarcament.',
            'META-TITLE': 'Facturació en línia Iberia: Emet la targeta d\'embarcament en línia i estalvia temps a l\'aeroport. - Iberia'
        },
        de: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Reservieren Sie Ihren Sitzplatz und erstellen Sie Ihre Bordkarte online, dann können Sie direkt zum Abfluggate gehen.',
            'META-KEYWORDS': 'check-in, check in, einchecken, Gepäck aufgeben, Sitzplatz wählen, Einsteigen, Bordkarte.',
            'META-TITLE': 'Online-Check-in Iberia: Stellen Sie Ihre Bordkarte online aus und sparen Sie am Flughafen Zeit. - Iberia'
        },
        en: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Book your seat, get your boarding pass online and you can go straight to the gate.',
            'META-KEYWORDS': 'check-in, checkin, checking in, check in baggage, choose seat, boarding, boarding pass.',
            'META-TITLE': 'Iberia online check-in: Issue your boarding pass online and save time at the airport. - Iberia'
        },
        es: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Reserva tu asiento, obtén tu tarjeta de embarque online y podrás ir directamente a la puerta de embarque.',
            'META-KEYWORDS': 'check-in, checkin, facturación, facturar maletas, elegir asiento, embarque, tarjeta de embarque.',
            'META-TITLE': 'Check-in online Iberia: Emite tu tarjeta de embarque online y ahorra tiempo en el aeropuerto. - Iberia'
        },
        fr: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Réservez votre siège, obtenez votre carte d\'embarquement en ligne et rendez-vous directement à la porte d\'embarquement.',
            'META-KEYWORDS': 'enregistrement en ligne, enregistrement, enregistrer des bagages, choisir un siège, embarquement, carte d\'embarquement.',
            'META-TITLE': 'Enregistrement en ligne Iberia : Obtenez votre carte d\'embarquement en ligne et gagnez du temps à l\'aéroport. - Iberia'
        },
        it: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Prenota il tuo posto e ottieni la carta d’imbarco online, così il giorno del volo potrai recarti direttamente alla porta d\'imbarco.',
            'META-KEYWORDS': 'check-in, checkin, registrazione, registrare bagagli, scegliere posto, imbarco, carta d\'imbarco.',
            'META-TITLE': 'Check-in online Iberia: Ottieni la carta d\'imbarco online e risparmia tempo in aeroporto. - Iberia'
        },
        ja: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': '座席を予約し、搭乗券をオンラインで取得すれば、ゲートに直行することができます。',
            'META-KEYWORDS': 'チェックイン, チェック イン, チェック・イン, 預入れ荷物, 座席の選択, 搭乗, 搭乗券',
            'META-TITLE': 'Iberia オンライン チェックイン:  搭乗券をオンラインで発酵すると、空港での時間が短縮できます。- Iberia'
        },
        nl: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Reserveer je stoel, haal je instapkaart online op en je kunt direct naar de gate gaan.',
            'META-KEYWORDS': 'check-in, checkin, inchecken, koffers inchecken, stoel kiezen, instappen, instapkaart.',
            'META-TITLE': 'Check-in online Iberia: Genereer je instapkaart online en bespaar tijd op de luchthaven. - Iberia'
        },
        pt: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Reserve seu assento, obtenha seu cartão de embarque online e você poderá ir diretamente para a sala de embarque.',
            'META-KEYWORDS': 'check-in, checkin, despachar, despachar bagagem, escolher assento, embarque, cartão de embarque.',
            'META-TITLE': 'Check-in online Iberia: Emita seu cartão de embarque online e economize tempo no aeroporto. - Iberia'
        },
        ru: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': 'Забронируйте место, получите посадочный талон онлайн, после чего направляйтесь сразу к выходу на посадку.',
            'META-KEYWORDS': 'регистрация, автоматическая регистрация, регистрация багажа, выбрать место, посадка, посадочный талон.',
            'META-TITLE': 'Онлайн-регистрация Iberia: Получите посадочный талон онлайн и сэкономьте время в аэропорту. — Iberia'
        },
        zh: {
            'META-AUTHOR': 'Iberia',
            'META-DESCRIPTION': '网上预订座位、获取登机牌并直接前往登机口。',
            'META-KEYWORDS': '值机, 托运, 托运行李, 选择座位, 登机, 登机牌.',
            'META-TITLE': 'Iberia 网上值机：在线发放登机牌以节省在机场的等候时间。- Iberia'
        }
    },
    languages: {
        de: [
            { code: 'es', description: 'Español' },
            { code: 'de', description: 'Deutsch' }
        ],
        dz: [
            { code: 'es', description: 'Español' },
            { code: 'fr', description: 'Français' }
        ],
        ar: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        at: [
            { code: 'es', description: 'Español' },
            { code: 'de', description: 'Deutsch' }
        ],
        br: [
            { code: 'es', description: 'Español' },
            { code: 'pt', description: 'Português' }
        ],
        be: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' },
            { code: 'fr', description: 'Français' }
        ],
        cl: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        cn: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' },
            { code: 'zh', description: '中国' }
        ],
        co: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        cr: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        cu: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        dk: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        ec: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        sv: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        es: [
            { code: 'es', description: 'Español' },
            { code: 'ca', description: 'Catalá' },
            { code: 'en', description: 'English' }
        ],
        fi: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        fr: [
            { code: 'es', description: 'Español' },
            { code: 'fr', description: 'Français' }
        ],
        gr: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        gt: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        gq: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        nl: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' },
            { code: 'nl', description: 'Nederlands' }
        ],
        hu: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        ie: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        il: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        it: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' },
            { code: 'it', description: 'Italiano' }
        ],
        jp: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' },
            { code: 'ja', description: '日本の' }
        ],
        ma: [
            { code: 'es', description: 'Español' },
            { code: 'fr', description: 'Français' }
        ],
        mx: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        pa: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        pe: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        pt: [
            { code: 'es', description: 'Español' },
            { code: 'pt', description: 'Português' }
        ],
        pr: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        gb: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        cz: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        do: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        ru: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' },
            { code: 'ru', description: 'Pусский' }
        ],
        sn: [
            { code: 'es', description: 'Español' },
            { code: 'fr', description: 'Français' }
        ],
        za: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        se: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        ch: [
            { code: 'es', description: 'Español' },
            { code: 'de', description: 'Deutsch' },
            { code: 'fr', description: 'Français' }
        ],
        tr: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        us: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        uy: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ],
        ve: [
            { code: 'es', description: 'Español' },
            { code: 'en', description: 'English' }
        ]
    },
    markets: [
        { code: 'AO', description: 'Angola' },
        { code: 'AR', description: 'Argentina' },
        { code: 'BE', description: 'Belgique' },
        { code: 'BR', description: 'Brasil' },
        { code: 'CL', description: 'Chile' },
        { code: 'CN', description: 'China' },
        { code: 'CO', description: 'Colombia' },
        { code: 'CR', description: 'Costa Rica' },
        { code: 'HR', description: 'Croazia' },
        { code: 'CU', description: 'Cuba' },
        { code: 'CZ', description: 'Czech Republic' },
        { code: 'DK', description: 'Denmark' },
        { code: 'DE', description: 'Deutschland' },
        { code: 'EC', description: 'Ecuador' },
        { code: 'SV', description: 'El Salvador' },
        { code: 'GQ', description: 'Equatorial Guinea' },
        { code: 'ES', description: 'España' },
        { code: 'FR', description: 'France' },
        { code: 'GH', description: 'Ghana' },
        { code: 'GR', description: 'Greece' },
        { code: 'GT', description: 'Guatemala' },
        { code: 'NL', description: 'Holland' },
        { code: 'HN', description: 'Honduras' },
        { code: 'IE', description: 'Ireland' },
        { code: 'IL', description: 'Israel' },
        { code: 'IT', description: 'Italia' },
        { code: 'JP', description: 'Japón' },
        { code: 'MT', description: 'Malta' },
        { code: 'MA', description: 'Maroc' },
        { code: 'MR', description: 'Mauritanie' },
        { code: 'MX', description: 'México' },
        { code: 'NI', description: 'Nicaragua' },
        { code: 'NG', description: 'Nigeria' },
        { code: 'PA', description: 'Panamá' },
        { code: 'PE', description: 'Perú' },
        { code: 'PT', description: 'Portugal' },
        { code: 'PR', description: 'Puerto Rico' },
        { code: 'DO', description: 'República Dominicana' },
        { code: 'CH', description: 'Schweiz' },
        { code: 'ZA', description: 'South Africa' },
        { code: 'SE', description: 'Sweden' },
        { code: 'SN', description: 'Sénégal' },
        { code: 'TR', description: 'Turkey' },
        { code: 'US', description: 'USA' },
        { code: 'GB', description: 'United Kingdom' },
        { code: 'UY', description: 'Uruguay' },
        { code: 'VE', description: 'Venezuela' },
        { code: 'AT', description: 'Österreich' },
        { code: 'RU', description: 'Россия' }
    ],
    CHECKIN_PATTERNS: {
        GROUP_RESERVATION_NAME_PATTERN: /^[A-Za-záéíóúÁÉÍÓÚñÑüÜâêîôûÂÊÎÔÛäëïöüÄËÏÖÜçÇşŞğĞàèìòùÀÈÌÒÙ ]+$/,
        NAME_SURNAME_PATTERN: /^(?!.*[0-9*¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        NAME_SURNAME_CLEANER: '[0-9*¡!?¿<>\\ºª|/·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
        EMAIL_PATTERN_OLD: '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}',
        EMAIL_PATTERN: /^[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
        PHONE_PATTERN_ES: /^\d{9,}$/,
        PHONE_PATTERN: /^\d{6,}$/,
        PHONE_CLEANER: '\\D+',
        CVV_PATTERN: /^\d+$/,
        CVV_CLEANER: '\\D+',
        CREDIT_CARD_NUMBER_PATTERN: /^\d+$/,
        CREDIT_CARD_NUMBER_CLEANER: '\\D+',
        CARD_NUMBER_PATTERN: /^\d+$/,
        CARD_NUMBER_CLEANER: '\\D+',
        DOCS_PATTERN: /^(?!.*[¡!?¿<>\\ºª|/·@#$%&,;=()_+{}\[\]"^€£])/,
        DOCS_CLEANER: '[¡!?¿<>\\ºª|/·@#$%&,;=?¿())_+{}\\[\\]"\\^€£]',
        PNR_PATTERN: /(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/,
        PNR_CLEANER: '[^a-zA-Z\\d\\-]',
        NUMBER_IB_PLUS_PATTERN: /^\d+$/,
        NUMBER_IB_PLUS_CLEANER: '\\D+',
        DEEPLINK_PARAMS_DATA_SPLITTER: '_',
        GET_PARAMS_AND: '[?&]*[^&#]*',
        QUERY_START: '?',
        QUERY_GLOBAL_MOD: 'g',
        QUERY_SEPARATOR: '&',
        GET_PARAMS_EQUAL: '[?&]*[^=]*',
        GET_LANG: /language=([^&]+)/,
        GET_MARKET: /market=([^&]+)/,
        REMOVE_SURNAME: /[\?&]surname=[^&]+/,
        REMOVE_PNR: /[\?&]pnr=[^&]+/
    },
    CHECKIN_FIELDS_LENGTH: {
        PHONE_NUMBER_MAX_LENGTH: 16,
        EMAIL_MAX_LENGTH: 60,
        NUMBER_IB_PLUS_MAX_LENGTH: 14,
        NUMBER_FF_MAX_LENGTH: 20,
        NAME_SURNAME: 30,
        MAX_LENGTH_ZIP_CODE: 30,
        MIN_LENGTH_NAME: 2,
        MAX_LENGTH_NAME: 30,
        MIN_LENGTH_ZIP_CODE_PAYMENT: 2,
        MAX_LENGTH_ZIP_CODE_PAYMENT: 10,
        MAX_LENGTH_SURNAME: 30,
        APIS_DOCUMENT_MAX_LENGTH: 20,
        APIS_DNI_PSTS_MAX_LENGTH: 15,
        ADDRESS_MAX_LENGTH: 120
    },
    PASSENGERS_TYPES: {
        ADULT: 'ADULT',
        CHILD: 'CHILD',
        INFANT: 'INFANT'
    },
    PAYMENT_ORDER_ITEMS_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER'
    },
    availableLanguages: ['en', 'es', 'ls', 'zh', 'ca', 'de', 'fr', 'it', 'pt', 'ja', 'nl', 'ru'],
    defaultLang: 'es',
    defaultForeignLang: 'en',
    defaultMarket: 'ES',
    COOKIES: {
        PERSONALIZATION: 'IBERIACOM_PERSONALIZATION',
        GDR_PA_INFO: 'IBERIACOM_GDR_PA_INFO',
        DEFAULT_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 365 * 10, //ten years
        DEFAULT_PATH: '/',
        DYNAMIC_PRICING: 'DP',
        BIOMETRIC_BOARDING_DO_NOT_SHOW: 'IBERIACOM_BIOMETRIC_BOARDING_DO_NOT_SHOW'
    },
    URL_PARAMS,
    nameParameters: { lang: URL_PARAMS.LANGUAGE, market: URL_PARAMS.MARKET },
    DEEPLINK_PARAMS: {
        langMark: 'locale',
        urlCode: URL_PARAMS.CODE
    },
    CHECKIN_FLOW_MODE: {
        NONE: 'NONE',
        REGULAR: 'REGULAR',
        SHUTTLE: 'SHUTTLE'
    },
    TYPE_OF_TRANSPORTS_ICONS: {
        FLIGHT: 'ticket-icon-airplane.png',
        TRAIN: 'ticket-icon-train.png',
        BUS: 'ticket-icon-bus.png'
    },
    STEPS: {
        GDR_CHANGE_FLIGHT: 'changeFlight'
    },
    QUADRIGAM: {
        SEARCH: 'IBCOSE',
        LOGGED_SEARCH: 'IBCOSEII',
        FLIGHTS_PASSENGERS: 'IBCOAC',
        FLIGHTS_PASSENGERS_PA: 'IBCOACPA',
        FLIGHTS_PASSENGERS_DUPLICATED: 'IBCOED',
        APIS_PASSENGERS: 'IBCOACII',
        FLY_NOW: 'IBFNPA',
        FLIGHT_CONFIRMATION: 'IBFNCOPA',
        UPGRADE: 'CKIANCUPP',
        ANCILLARIES: 'CKIANC',
        EARLY_ANCILLARIES: 'ECKIANC',
        PAYMENTS: 'CKIANPURC',
        BOARDING_CARDS: 'IBCOBP',
        BOARDING_CARDS_DECOUPLING: 'IBCOBPD',
        CKI_CONFIRMATION: 'IBCOCF',
        PAYMENTS_PCC: 'IBPCC',
        PAYMENTS_REJECTED: 'IBREJC',
        PAYMENTS_DENIED: 'IBCCDN',
        PAYMENTS_CANCELLED: 'IBCNCL',
        UN_SEARCH: 'UNCOSE',
        UN_RECOVERY: 'UNCOAC',
        UN_CONFIRM: 'UNCONF',
        DANGEROUS_OBJECTS_MODAL: 'CKDANG',
        MMB_YOUR_DOCUMENTS: 'MODDOC',
        MMB: 'chktrp',
        BIOMETRIC: 'CKIBIO'
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
    FLIGHT_TYPES: {
        REGULAR: 'REGULAR',
        SHUTTLE: 'SHUTTLE'
    },
    FLIGHT_PASSENGERS_STATUS_LIST: {
        CHECKED: ['CHECKED', 'STANDBY', 'REISSUE'],
        AVAILABLE: ['CHECKABLE', 'PENDING_AQQ', 'PENDING_EVUS'],
        NOT_AVAILABLE: ['UNCHECKABLE'],
        SHUTTLE: ['OPEN', 'CONFIRMED']
    },
    FLIGHT_PASSENGERS_STATUS: {
        CHECKED: 'CHECKED',
        STANDBY: 'STANDBY',
        AVAILABLE: 'AVAILABLE',
        NOT_AVAILABLE: 'NOT_AVAILABLE',
        SELECTABLE: 'SELECTABLE',
        NOT_ALLOWED: 'NOT_ALLOWED'
    },
    GENERAL_PASSENGERS_STATUS: {
        ALLOWED: 'ALLOWED',
        NOT_ALLOWED: 'NOT_ALLOWED',
        ESTA_CONSTRAINTS: 'ESTA_CONSTRAINTS',
        AQQ_ESTA_CONSTRAINTS: 'AQQ_ESTA_CONSTRAINTS',
        EES_CONSTRAINTS: 'EES_CONSTRAINTS',
        ETIAS_CONSTRAINTS: 'ETIAS_CONSTRAINTS'
    },
    PASSENGER_DATA_OPTIONS: {
        GENDER: 'GENDER',
        API: 'API',
        CONTACT_DATA: 'CONTACT_DATA',
        EMERGENCY: 'EMERGENCY',
        EMERGENCY_DATA: 'EMERGENCY_DATA',
        PRIVACY_STATEMENT: 'PRIVACY_STATEMENT',
        FREQUENT_FLYER: 'FREQUENT_FLYER',
        FF: 'FF',
        TIMATIC: 'TIMATIC'
    },
    SHUTTLE_SEGMENTS_TYPES: {
        OPEN: 'OPEN',
        CONFIRMED: 'CONFIRMED'
    },
    SHUTTLE_WHAT_TO_DO_BLOCKS: {
        SEAT: 'SEAT',
        CHECK_IN: 'CHECK_IN',
        BOARDING_CARD: 'BOARDING_CARD',
        MODIFY_SEGMENT: 'MODIFY_SEGMENT'
    },
    SHUTTLE_NEXT_STEPS: {
        SEATS_MAP: 'seatsMap',
        BOARDING_CARDS: 'boardingCards',
        FLY_NOW: 'flyNow',
        FLIGHT_PASSENGER: 'flightPas',
        GDR: 'gdr'
    },
    HASH_PAGES: {
        FLIGHTS_PASSENGERS: '#/ibcoac',
        IB_PLUS: '#/ibcose2',
        APIS: '#/ibcoac2',
        ANCILLARIES: '#/ckianc',
        PAYMENTS: '#/ibpurc',
        BOARDING: '#/ibecbp',
        CHECKIN_CONFIRMATION: '#/ibcocf-and-ibeccf',
        FLIGHT_PASSENGER_PA: '#/ibcoacpa',
        FLIGTH_NOW: '#/ibfnpa',
        FLY_NOW_CONFIRMATION: '#/ibfncopa',
        CHECKIN: '#/ibcose',
        UNDOCHECKIN: '#/uncose'
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
    SeatTypes: {
        seat: 'SEAT',
        gap: 'GAP'
    },
    COMPANIES: {
        IB: 'IB',
        I2: 'I2',
        YW: 'YW'
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
        PREORDER: 'PREORDER',
        PRIORITY_BOARDING: 'PRIORITY_BOARDING',
        FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
        SPECIAL_MEALS: 'SPECIAL_MEALS',
        UPGRADING_BID: 'UPGRADING_BID'
    },
    GENERAL_STATUS: {
        AVAILABLE: 'AVAILABLE',
        NOT_AVAILABLE: 'NOT_AVAILABLE',
        CHECKED: 'CHECKED'
    },
    UNDOCHECKIN: {
        CKI_AAVV: URL_PARAMS.CKI_AAVV,
        UNDOCKI: URL_PARAMS.UNDOCKI,
        TRAVEL_AGENT: URL_PARAMS.TRAVEL_AGENT
    },
    USER_PARAMS: {
        SURNAME: URL_PARAMS.SURNAME,
        PNR: URL_PARAMS.PNR
    },
    WEB_CENTER_REDIRECT: {
        REDIRECTION_START: '/cs/Satellite?pagename=redirect',
        BLANK: '_blank',
        MARKET_QUERY: '&market=',
        LANGUAGE_QUERY: '&locale=',
        QUADRIGAM_QUERY: '&quadrigam=',
        SEARCH_MORE_INFO: 'AUTCHK',
        PASSENGER_RIGHTS: 'DERPAS ',
        BAGGAGE_RESTRIC: 'EQUPRE'
    },
    CABIN_CLASS_NAME: {
        ECONOMY: 'ECONOMY',
        BUSINESS: 'BUSINESS',
        BUSINESS_PLUS: 'BUSINESS_PLUS',
        BUSINESS_CLUB: 'BUSINESS_CLUB',
        BUSINESS_CLASS: 'BUSINESS_CLASS',
        PREMIUMTOURIST: 'PREMIUMTOURIST',
        CABINA_TURISTICA: 'CABINA_TURISTICA'
    },
    HttpServices: {
        timeWait: 2000,
        numAttemps: 3,
        WCS_URIS: {
            PHONES: '/cs/Satellite?pagename=IB_SE_Services&service=getContact',
            JSESSIONCLEAN: '/cs/Satellite?pagename=IB_SE/CacheControl0s/Integration/logOut'
        }
    },
    WCS: {
        PHONE_TYPES: {
            SALES: 'RESERVAS',
            IBHOLIDAYS: 'ATTBAH'
        }
    },
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
    BIOMETRIC: {
        STATUS: {
            NOT_AVAILABLE: 'NOT_AVAILABLE',
            AVAILABLE: 'AVAILABLE',
            COMPLETE: 'COMPLETE',
            IN_PROGRESS: 'IN_PROGRESS',
            FAILED: 'FAILED',
            NOT_ACTIVE: 'NOT_ACTIVE',
            AUTOMATIC_FF_AVAILABLE: 'AUTOMATIC_FF_AVAILABLE'
        },
        ICONS: {
            MALE: 'ib-box-selects-biometric__header--adult',
            FEMALE: 'ib-box-selects-biometric__header--adult',
            CHILD: 'ib-box-selects-biometric__header--kids',
            INFANT: 'ib-box-selects-biometric__header--baby'
        },
        ICONS_MODALS: {
            MALE: 'icon-hombre',
            FEMALE: 'icon-mujer',
            CHILD: 'icon-iberia_ninos',
            INFANT: 'icon-bebe'
        }
    },
    DOCUMENT_TYPES: {
        DNI: 'DNI',
        PASSPORT: 'PASSPORT'
    },
    INHIBIT_BOARDING_CARD_TYPES: {
        SEE_AGENT_REASON: 'SEE_AGENT_REASON',
        AIRCHECK_REASON: 'AIRCHECK_REASON',
        BOKO_AIRCHECK_REASON: 'BOKO_AIRCHECK_REASON',
        INHIBIT_REASON: 'INHIBIT_REASON',
        UMNR_REASON: 'UMNR_REASON',
        RESI_REASON: 'RESI_REASON',
        AVIH_REASON: 'AVIH_REASON',
        PETC_REASON: 'PETC_REASON',
        COUR_REASON: 'COUR_REASON'
    },
    INHIBIT_BOARDING_CARD_PRIORITIES: {
        SEE_AGENT: 7,
        AIRCHECK: 6,
        INHIBIT: 5,
        UMNR: 4,
        RESI: 3,
        AVIH: 2,
        PETC: 1,
        COUR: 0
    },
    ITEMS_TYPES: {
        SVAN: 'SVAN',
        RESI: 'RESI',
        UMNR: 'UMNR',
        AVIH: 'AVIH',
        PETC: 'PETC',
        COUR: 'COUR',
        SEE_AGENT: 'SEE_AGENT'
    },
    INHIBIT_ALERTS: {
        SEE_AGENT: {
            IBCOAC: {
                TITLE: 'SEE_AGENT_BANNER_TITLE',
                MESSAGE: 'SEE_AGENT_PASSENGER_MESSAGE',
                ICON: 'icon-resident-discount'
            },
            IBECBP: {
                TITLE: 'SEE_AGENT_BANNER_TITLE',
                SUBTITLE_OK: 'SEE_AGENT_BANNER_SUBTITLE_NOT_HOMOGENEOUS', // Only ES
                SUBTITLE_KO: 'SEE_AGENT_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-resident-discount'
            }
        },
        RESI: {
            IBCOAC: {
                TITLE: 'RESI_CONFIRMATION_BANNER_TITLE',
                MESSAGE: 'RESI_PASSENGER_MESSAGE',
                ICON: 'icon-resident-discount'
            },
            IBECBP: {
                TITLE: 'RESI_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'RESI_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'RESI_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-resident-discount'
            }
        },
        AVIH: {
            IBCOAC: {
                TITLE: 'AVIH_PASSENGER_MESSAGE_TITLE',
                MESSAGE: 'AVIH_PASSENGER_MESSAGE',
                ICON: 'icon-huella'
            },
            IBECBP: {
                TITLE: 'AVIH_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'AVIH_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'AVIH_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-huella'
            }
        },
        PETC: {
            IBCOAC: {
                TITLE: 'PETC_CONFIRMATION_BANNER_TITLE',
                MESSAGE: 'PETC_PASSENGER_MESSAGE',
                ICON: 'icon-huella'
            },
            IBECBP: {
                TITLE: 'PETC_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'PETC_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'PETC_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-huella'
            }
        },
        UMNR: {
            IBCOAC: {
                TITLE: 'UMNR_CONFIRMATION_BANNER_TITLE',
                MESSAGE: 'UMNR_PASSENGER_MESSAGE',
                ICON: 'icon-iberia_ninos'
            },
            IBECBP: {
                TITLE: 'UMNR_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'UMNR_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'UMNR_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-iberia_ninos'
            }
        },
        COUR: {
            IBCOAC: {
                TITLE: 'COUR_PASSENGER_TITLE',
                MESSAGE: 'COUR_PASSENGER_MESSAGE',
                ICON: 'icon-etiqueta-en-maleta'
            },
            IBECBP: {
                TITLE: 'COUR_BANNER_TITLE',
                SUBTITLE_OK: 'COUR_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'COUR_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-etiqueta-en-maleta'
            }
        }
    },
    ERROR_CODE: {
        CARRIER_CONNECT: {
            PRINT_9019: 'PAC_BPM_9019',
            PRINT_9017: 'PAC_BPM_9017',
            NOT_AVAILABLE: 'NOT_AVAILABLE',
            CHECKED: 'CHECKED'
        },
        BOARDING_DOCUMENT: {
            INHIBIT_AIRCHECK: 'PAC_BPM_9017',
            INHIBIT_OTHER_CASE: 'PAC_BPM_9022', //AVIH
            INHIBIT_SEE_AGENT: 'PAC_BPM_9025'
        }
    },
    SAVE_MODAL_CHANGES: {
        title: 'SAVE_CHANGES',
        body: 'SURE_CHANGES',
        extraBody: 'SURE_CHANGES_EXTRA_2',
        accept: 'SAVE_CHANGE',
        cancel: 'DONT_SAVE'
    },
    SAVE_CORRECT_LITERALS: {
        title: 'HEADER_ADVANCED_SEARCH_INFORMATION_TEXT',
        message: 'SAVED_CORRECTLY',
        needsTranslate: true
    },
    SAVE_ERROR_LITERALS: {
        title: 'HEADER_ADVANCED_SEARCH_INFORMATION_TEXT',
        message: 'CANT_SAVE_CHANGES',
        needsTranslate: true
    },
    AVIH_LITERALS: {
        title: 'HEADER_ADVANCED_SEARCH_INFORMATION_TEXT',
        message: 'SAVED_CORRECTLY',
        needsTranslate: true
    },
    TITLE_PAGE: {
        SEARCH: 'CKI_TITLE_PAGE_IBCOSE',
        LOGGED_SEARCH: 'CKI_TITLE_PAGE_IBCOSEII',
        FLIGHTS_PASSENGERS: 'CKI_TITLE_PAGE_IBCOAC',
        FLIGHTS_PASSENGERS_PA: 'CKI_TITLE_PAGE_IBCOACPA',
        APIS_PASSENGERS: 'CKI_TITLE_PAGE_IBCOACII',
        FLY_NOW: 'CKI_TITLE_PAGE_IBFNPA',
        FLIGHT_CONFIRMATION: 'CKI_TITLE_PAGE_IBFNCOPA',
        UPGRADE: 'CKI_TITLE_PAGE_CKIANCUPP',
        ANCILLARIES: 'CKI_TITLE_PAGE_CKIANC',
        BOARDING_CARDS: 'CKI_TITLE_PAGE_IBCOBP',
        UN_SEARCH: 'CKI_TITLE_PAGE_UNCOSE',
        UN_RECOVERY: 'CKI_TITLE_PAGE_UNCOAC',
        DANGEROUS_OBJECTS_MODAL: 'CKI_TITLE_PAGE_CKDANG'
    },
    PMT_VIEW: {
        NEW: 'NEW' as 'NEW',
        OLD: 'OLD' as 'OLD',
        EMPTY: 'EMPTY' as 'EMPTY'
    },
    STORAGE_KEYS: {
        PMT_VIEW_TYPE: 'pmtViewType',
        PMT_REDIRECTION_CONTEXT: 'pmtRedirectContext',
        PMT_REDIRECTION_CONTEXT_STATUS_INIT: 'redirection-init',
        PMT_REDIRECTION_CONTEXT_STATUS_END: 'redirection-end',
        PASSENGERS_APIS: 'passengersAPIS',
        APIS_INFO: 'apisInfo',
        BOOKING_INFO: 'bookingInfo',
        PASSENGERS_NOAPIS: 'passengersNOAPIS',
        PASSENGERS_APIS_DOCS: 'passengersApisDocs',
        USER_LOGGED: 'userLogged',
        FF_USER: 'FFUser',
        ACCEPT_INFO: 'acceptInfoSegments',
        ANCILLARIES_INFO: 'ancillariesInfo',
        IS_EARLY: 'isEarly',
        SEGMENTS_SELECTED: 'segmentsSelected',
        PNR: 'PNR',
        CONFIRMATION_INFO: 'confirmationInfo'
    },
    CKI_REALM: 'CHECKIN',
    SUBREALM: {
        ANCILLARIES_PURCHASE: 'ANCILLARIES_PURCHASE'
    },
    DEFAULT_COMMERCIAL_INFO: {
        CURRENCY: { GROUPING_SEPARATOR: '.' }
    },
    AIRLINE_CODES: ['AS', 'AA', 'BA', 'CX', 'AY', 'IB', 'JL', 'MH', 'QF', 'QR', 'AT', 'RJ', 'UL'],
    TOGGLE: {
        ocrEnable: true,
        isSoftUserHideEnabled: true
    },
    LOGIN_ONB:'ONB'
};

try {
    const mod = angular.module('ib-check-in-app-constants-module');

    mod.constant('CheckinAppConstants', CheckinAppConstants);
} catch (error) {
    const mod = angular.module('ib-check-in-app-constants-module', []);
    mod.constant('CheckinAppConstants', CheckinAppConstants);
}

export type CheckinAppConstants = typeof CheckinAppConstants;
export { CheckinAppConstants };
