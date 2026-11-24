import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);


const serviceURI = envCopy.services || '';
const service_cloud = envCopy.cloud || '';
const authoritationURI = envCopy.auth || '';
const globalAuthorizationToken = envCopy.globalAuthorizationToken;
const pmtPpmPath = '/pay/ra/pmt-ppm/rs/ppm/v7/';
const PAYMENTS_METHODS_PROVIDERS = {
    APPLE_PAY: 'APPLE_PAY',
    BANCONTACT: 'BANCONTACT',
    BANK_TRANSFER: 'BANK_TRANSFER',
    BIZUM: 'BIZUM',
    CODI: 'CODI',
    CREDIT_CARD: 'CREDITCARD',
    FULL_AVIOS: 'FULL_PAY_AVIOS',
    GOOGLE_PAY: 'GOOGLE_PAY',
    IDEAL: 'IDEAL',
    KLARNA: 'KLARNA',
    MBWAY: 'MBWAY',
    MERCADO_PAGO: 'MERCADO_PAGO',
    NEMURU: 'NEMURU',
    PAYPAL: 'PAYPAL',
    PIX: 'PIX',
    PSE: 'PSE',
    SOFORT: 'SOFORT',
    VOUCHER: 'VOUCHER'
};
const PAYMENTS_METHODS_CODE = {
    APPLE_PAY: 'AP',
    BANCONTACT: 'BC',
    BANK_TRANSFER: 'BT',
    BIZUM: 'BZ',
    CODI: 'CD',
    CREDIT_CARD: 'CC',
    FULL_AVIOS: 'AV',
    GOOGLE_PAY: 'GP',
    IDEAL: 'ID',
    MBWAY: 'MW',
    MERCADO_PAGO: 'MP',
    NEMURU: 'NM',
    PAYPAL: 'PL',
    PIX: 'PX',
    PSE: 'PS',
    SOFORT: 'SF',
    VOUCHER: 'BF',
    KLARNA: 'KL'
};
const PAYMENTS_METHODS_CODE_BY_PROVIDER = Object.keys(PAYMENTS_METHODS_PROVIDERS).reduce((map, key) => {
    map[PAYMENTS_METHODS_PROVIDERS[key]] = PAYMENTS_METHODS_CODE[key];
    return map;
}, {} as Record<string, string>);
const PmtConstants = {
    timeWait: 2000,
    numAttemps: 3,
    globalAuthorizationToken: globalAuthorizationToken,
    tokenServiceURI:
            authoritationURI +
            '/auth/realms/commercial_platform/protocol/openid-connect/token',
    LOGIN_ONB: 'ONB',
    REFERRAL_URL_PARAM: 'referralURL',
    ENDPOINTS: {
        tokenActivitiesPRO: 'https://api-activities.recoglobick.com/token?grant_type=client_credentials',
        tokenTransfersPRO: 'https://api-transfers.recoglobick.com/token?grant_type=client_credentials',
        tokenActivitiesPREE: 'https://pre-api-activities.recoglobick.com/token?grant_type=client_credentials',
        tokenTransfersPREE: 'https://pre-api-transfers.recoglobick.com/token?grant_type=client_credentials',
        reactWidgetCallbackURI: serviceURI + '/ass-fass/rs/fass/v6/{flow-id}/globick/confirm',
        customerCreditCardDataURI: 'customer/credit_card?onlyComplete=true',
        customerDataURI: 'customer/complete',
        //Banner Url
        shouldShowBannerURI: service_cloud + '/v1/should-show-banner/{flowId}',

        issueOrderServiceURI: 'issue',
        issueOrderOnHoldServiceURI: 'on-hold/issue',
        checkVoucherCodeServiceURI: 'order',
        co2InfoURI: 'co2/getFootPrint',
        co2CalculateURI: 'climate/co2Mark/calculate',
        cachedInformationURI: 'booking/checkinId/',
        changeFlightOrderServiceURI: 'order/orderchange',
        changeFlightOrderUnifiedServiceURI: 'disruption/orderchange-unified',
        getAncillariesSummaryURI: serviceURI + '/ass-fass/rs/fass/v5/',
        onBusinessCreditCardDataURI: 'payment_card',
        DEFAULT: {
            customerCreditCardDataURI:
                    '/cust-cust/rs/v2/customer/credit_card?onlyComplete=true',
            customerDataURI: '/cust-cust/rs/v1/customer/complete',
            paymentMethodsServiceURI: pmtPpmPath,
            paymentMethodsAdditionalFieldsServiceURI: pmtPpmPath,
            issueOrderServiceURI: '/sse-orm/rs/v2/issue',
            issueOrderOnHoldServiceURI: '/sse-orm/rs/v2/on-hold/issue',
            paymentDonationsServiceURI: pmtPpmPath,
            checkVoucherCodeServiceURI: '/sse-orm/rs/v2/order',
            checkVoucherCodeServiceParamsURI: '/{flowId}/voucher/{voucherCode}',
            checkPostVoucherCodeParamsURI: '/{orderId}/voucher/{voucherId}/otp/{otpSessionId}',
            summaryInfoQuotaURI: pmtPpmPath + 'installments-detail',
            iberiaPayQuotaOptionsURI: pmtPpmPath + 'iberiapay/installments-detail',
            payAndIssueURI: '/ass-fass/rs/fass/v6/',
            payAndIssuev4URI: '/ass-fass/rs/fass/v4/',
            statesListServiceURI: '/rdu-loc/rs/loc/v1/location/',
            countriesListURI: '/rdu-loc/rs/loc/v1/location/country',
            co2InfoURI:
                    '/framework-services/rs/commons/v1/co2/getFootPrint',
            co2CalculateURI:
                    '/framework-services/rs/commons/v1/climate/co2Mark/calculate',
            onHoldOrderServiceURI: '/sse-orm/rs/v1/on-hold',
            getAncillariesSummaryURI: serviceURI + '/ass-fass/rs/fass/v5/',
            cachedInformationURI:
                    serviceURI + '/pac-prm/rs/checkin/v2/booking/checkinId/',
            ancillariesURI: serviceURI + '/ass-fass/rs/fass/v4/',
            ancillariesNewURI: serviceURI + '/ass-fass/rs/fass/v5/',
            upgradingBidURI: '/ass-fass/rs/fass/v6',
            changeFlightOrderServiceURI: '/sse-orm/rs/v2/order/orderchange',
            changeFlightOrderUnifiedServiceURI: '/sse-orm/rs/v4/disruption/orderchange-unified',
            onBusinessMembershipURI:
                    serviceURI + '/cmlm-mbm/rs/v1/membership',
            onBusinessEmployeesURI:
                    serviceURI + '/cmlm-mbm/rs/v1/employees',
            onBusinessPaymentsCardsURI:
                    serviceURI + '/cmlm-mbm/rs/v1/payment_card',
            onBusinessPointsURI:
                    serviceURI + '/cmlm-lpm/rs/v1/calculateReward',
            issueOrderServiceUriV3: '/sse-orm/rs/v3/issue',
            issueGiftCardsV1: '/orm-ors/rs/v1/giftcard',
            issueSubscriptionModelsV1: '/orm-ors/rs/v1/subscription',
            onBusinessCreditCardDataURI: '/cmlm-mbm/rs/v2/payment_card',
            getGiftCardSummaryURI: //miguel
                    serviceURI + '/orm-ors/rs/v1/giftcard/{flow-id}/summary',
            getGiftCardSummaryURICloud:
                    service_cloud + '/v1/voucher/{flowId}/summary',
            getSubscriptionModelsSummaryURI:
                    service_cloud + '/v1/voucher/{flowId}/summary',
            customerCardsFeesServiceURI: serviceURI + pmtPpmPath + 'creditcards/fee',
            fullAviosURI: pmtPpmPath,
            quotaExtraInfoServiceURI: '/rdu-loc/rs/loc/v1/location/FLOWPAGEPAGCUO/gcwcs/?retrieveHTML=yes',
            taxInfoServiceURI: '/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes',
            checkPertnerDiscount: '/sse-orm/rs/v1/order',
            MARKETING_PERMISSIONS: serviceURI + '/cust-cust/rs/v3/customer/marketing-permission',
            otpValidate: '/otp/validate',
            deleteAssistCard: service_cloud + '/v1/management/delete/{flowId}'
        }
    },
    allowCitiesWinget: ['A Coruña', 'Alicante', 'Athens', 'Barcelona', 'Bilbao', 'Bologna', 'Brussels', 'Budapest', 'Bordeaux',
        'Copenhagen', 'Dublin', 'Düsseldorf', 'Frankfurt', 'Geneva', 'Las Palmas de Gran Canaria', 'Granada', 'Jerez de la Frontera',
        'Lanzarote', 'Lisbon', 'London', 'London', 'Lyon', 'Madrid', 'Marseille', 'Milan', 'Moscow', 'Murcia', 'Malaga', 'Munich', 'Nantes',
        'Nice', 'Naples', 'Porto', 'Palma de Mallorca', 'Paris', 'Prague', 'Rome', 'Saint Petersburg', 'San Sebastian',
        'Santander', 'Santiago de Compostela', 'Seville', 'Tenerife', 'Tenerife', 'Toulouse', 'Valencia', 'Venice', 'Vienna',
        'Vigo', 'Zurich', 'Boston', 'Chicago', 'Los Angeles', 'Miami', 'Mexico City', 'New York', 'San Juan de Puerto Rico', 'Guatemala City',
        'Havana', 'Punta Cana', 'San Jose', 'Bogota', 'Buenos Aires', 'Lima', 'Medellin', 'Montevideo', 'Quito', 'Rio de Janeiro',
        'Rio de Janeiro', 'Santiago de Chile', 'Casablanca', 'Marrakech', 'Tel Aviv', 'Tangier', 'Dallas', 'Guayaquil', 'Panama', 'San Salvador',
        'Sao Paulo', 'San Francisco', 'Washington DC', 'Amsterdam', 'Berlín', 'Bergen', 'Bari', 'Corfú', 'Catania', 'Dubrovnik', 'Dakar', 'Edimburgo',
        'Faro', 'Florencia', 'Funchal', 'Fuerteventura', 'Hamburgo', 'Creta', 'Ibiza', 'Mikonos', 'Santorini', 'Almería', 'Menorca', 'Manchester',
        'Olbia', 'Oslo', 'Asturias-Oviedo', 'Azores Ponta Delgada', 'Pamplona', 'Santa Cruz de la Palma', 'Split', 'Split', 'Turín', 'Zagreb', 'Estocolmo'
    ],

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
        SJU: 'San Juan de Puerto Rico',
        GUA: 'Guatemala City',
        HAV: 'Havana',
        PUJ: 'Punta Cana',
        SJO: 'San Jose',
        BOG: 'Bogota',
        EZE: 'Buenos Aires',
        LIM: 'Lima',
        MDE: 'Medellin',
        MVD: 'Montevideo',
        UIO: 'Quito',
        GIG: 'Rio de Janeiro',
        SDU: 'Rio de Janeiro',
        SCL: 'Santiago de Chile',
        CMN: 'Casablanca',
        RAK: 'Marrakech',
        TLV: 'Tel Aviv',
        TNG: 'Tangier',
        DFW: 'Dallas',
        GYE: 'Guayaquil',
        PTY: 'Panama',
        SAL: 'San Salvador',
        GRU: 'Sao Paulo',
        SFO: 'San Francisco',
        DCA: 'Washington DC',
        BWI: 'Washington DC',
        IAD: 'Washington DC',
        AMS: 'Amsterdam',
        BER: 'Berlín',
        BGO: 'Bergen',
        BRI: 'Bari',
        CFU: 'Corfú',
        CTA: 'Catania',
        DBV: 'Dubrovnik',
        DSS: 'Dakar',
        EDI: 'Edimburgo',
        FAO: 'Faro',
        FLR: 'Florencia',
        FNC: 'Funchal',
        FUE: 'Fuerteventura',
        HAM: 'Hamburgo',
        HER: 'Creta',
        IBZ: 'Ibiza',
        JMK: 'Mikonos',
        JTR: 'Santorini',
        LEI: 'Almería',
        MAH: 'Menorca',
        MAN: 'Manchester',
        OLB: 'Olbia',
        OSL: 'Oslo',
        OVD: 'Asturias-Oviedo',
        PDL: 'Azores Ponta Delgada',
        PNA: 'Pamplona',
        SPC: 'Santa Cruz de la Palma',
        SPU: 'Split',
        ARN: 'Estocolmo',
        TRN: 'Turín',
        ZAG: 'Zagreb'
    },
    onBusinessMembershipURI: 'membership',
    onBusinessEmployeesURI: 'employees',
    onBusinessPaymentsCardsURI: 'payment_card',
    onBusinessPointsURI: 'calculateReward',
    closeSessionURI: serviceURI + '/pac-prm/rs/checkin/v2',
    DEFAULT_TO_YEARS: 11,
    ROUTES: {
        icons: '/iberia-web-content/iconos',
        images: '/iberia-web-content/imagenes',
        templates: 'ib-web-payments/templates/',
        creditCardsJson: '/payment/creditcardlogo.json',
        creditCardLogoBaseRoute: '/payment/',
        defaultCreditCardLogo: 'ico-tarjeta.png',
        airlinesJsonRoute:
                '/iberia-web-content/iconos/aerolineas/aeroLineas.json',
        aerolinesLogoUrl: '/iberia-web-content/iconos/aerolineas/',
        TypeofTransport: '/iberia-web-content/iconos/vuelos_pasajeros/'
    },
    ADYEN_CLIENT_KEY: {
        test: 'test_ALUFFR4C2FHBTPUTZVH6K6FS2Q6V44DO',
        production: 'live_VYTJ3PMDXRFDVJFUQRJFLTFZMIIT2FEC'
    },
    AFOP_PAYPAL_CLIENT_ID: {
        test: 'AX8bRTZEevEaiy_5_5Ch86ojjYepKTT2VAqeUShxkWi9x1zq9VCDsdE72bflQp9H4srfQX1fO03tFkYt',
        production: 'AcnTbzF1WjkEJzJGc48CrWdVjfZWYl9mCj3BnU2fr6RQ5vSEvwXSmNk6ogFLSv8l6SUc1xeD6otWHmBN'
    },
    AFOP_MERCADO_PAGO_ID: {
        test: {
            AR: 'APP_USR-8ea52f8d-457f-44d1-b8f0-a6eed8262391',
            BR: 'APP_USR-6b96eebd-af8f-4504-8338-ecbb18e7ff16',
            CO: 'APP_USR-3f037248-70aa-47d0-a8f7-2a92796abce0',
            PE: 'APP_USR-0b705e8a-5c37-49a3-9eb2-7c623bd1d3e7',
            MX: 'APP_USR-399bf044-4b6c-4fbf-9d21-7fecc013e441',
            CL: 'APP_USR-5dec15e6-d35b-4e35-ab92-d9de9fee7368'
        },
        production: {
            AR: 'APP_USR-ecaa469a-69d1-4c45-920e-70c1ee5f0875',
            BR: 'APP_USR-e34bdab3-8809-42c1-85bd-ea9e7b3fcb72',
            CO: 'APP_USR-82a6944b-e5ba-4bb0-a5ba-d4b95d106fed',
            MX: 'APP_USR-e31e67a4-02a8-4c91-bfc8-ce14350d04d1',
            CL: 'APP_USR-3aa1e8ac-5ce7-4d8b-9136-3825a34067e5'
        }
    },
    CLIENT_ID: {
        SANDBOX:
                'AZVykXCSWSVRFKaSUJ92RB1q7sBn4j4YB4P10zYIA4Bcj3M-nXUf6h0i0PuOEN5mRHL20P7Lb7SP8X0G',
        PRODUCTION:
                'AcnTbzF1WjkEJzJGc48CrWdVjfZWYl9mCj3BnU2fr6RQ5vSEvwXSmNk6ogFLSv8l6SUc1xeD6otWHmBN'
    },
    MERCHANT_ID: 'IBERIA',
    ORG_ID: 'k8vif92e',
    QUADRIGAMS: {
        PAYMENTS_PCC: 'IBPCC',
        BKI_PCC: 'BKPPCC',
        PAYMENTS_REJECTED: 'IBREJC',
        BKI_PAYMENTS_REJECTED: 'BKREJC',
        PAYMENTS_DENIED: 'IBCCDN',
        BKI_PAYMENTS_DENIED: 'BKCCDN',
        PAYMENTS_CANCELLED: 'IBCNCL',
        FLIGHT_CONFIRMATION: 'TCFREV',
        SEARCH: 'CHKTRP',
        LOGGED_SEARCH: 'MYTRPS',
        TRIP_DETAILS: 'IBMTDT',
        CHANGE_FLIGHT: 'TCADVS',
        CHANGE_FLIGHT_DISPO: 'TCFLPA',
        ORDER_TICKETS: 'IBENIT',
        SPECIAL_NEEDS: 'MOPMR',
        SPECIAL_NEEDS_CONFIRMED: 'MOPMRCF',
        PASSENGER_INFO: 'MOINFO',
        ON_HOLD_CONF: 'OHMTDT',
        ON_HOLD_CONF_ON_BUSINESS: 'CIPOHMTDT',
        ON_HOLD_CONF_RESIDENTS: 'OHSARA',
        ON_HOLD_CONF_LOGIN: 'OHLOIN',
        ON_HOLD_CONF_PAYMENT: 'OHINFO',
        ON_HOLD_CONF_PAYMENT_ON_BUSINESS: 'CIPOHINFO',
        ON_HOLD_CONF_PAYMENT_WAIT: 'OHWAIT',
        ON_HOLD_CONF_PAYMENT_FRAUD: 'OHPCC',
        ON_HOLD_CONF_CONFIRMATION: 'RTBKCF',
        ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS: 'CIPRTBKCF',
        ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
        ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS: 'CIPCNCLOH',
        ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION: 'CNCLIT',
        ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS: 'CIPCNCLIT',
        BKI_REDENTION_PAYMENT: 'IPPURC',
        BKI_REDENTION_CONFIRMATION: 'IPBKCF',
        BKI_ONB_REDENTION_PAYMENT: 'CIPIPPURC',
        BKI_ONB_REDENTION_CONFIRMATION: 'CIPIPBKCF',
        BKI_PAYMENT: 'IBPURC',
        BKI_CONFIRMATION: 'IBBKCF',
        MMB_ANCILLARIES_PAYMENT: 'MOPURC',
        MMB_ANCILLARIES_SEATS_PAYMENT: 'STPURC',
        MMB_ANCILLARIES_BAGGAGES_PAYMENT: 'MOPBAG',
        MMB_ANCILLARIES_UPG_PAYMENT: 'SUPURC',
        MMB_ANCILLARIES_MEALS_PAYMENT: 'MEALPURC',
        MMB_ANCILLARIES_CONFIRMATION: 'MOBKCF',
        MMB_ANCILLARIES_SEATS_CONFIRMATION: 'STBKCF',
        MMB_ANCILLARIES_BAGGAGES_CONFIRMATION: 'MOCBAG',
        MMB_ANCILLARIES_UPG_CONFIRMATION: 'SUCONF',
        MMB_ANCILLARIES_MEALS_CONFIRMATION: 'MEALCF',
        MMB_ANCILLARIES_DEEPLINK_PAYMENT: 'STPURCJBR',
        MMB_ANCILLARIES_DEEPLINK_CONFIRMATION: 'STBKCFJBR',
        MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_TOTAL_CONFIRMATION: 'CITOBK',
        MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_TOTAL_PAYMENT: 'CITPURC',
        MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL_CONFIRMATION: 'CIPTBK',
        MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL_PAYMENT: 'CIPPURC',
        MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL_CONFIRMATION: 'CIPABK',
        MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL_PAYMENT: 'CIPAPUR',
        MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL_CONFIRMATION: 'CINTBK',
        MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL_PAYMENT: 'CINTPUR',
        MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL_CONFIRMATION: 'CINPBK',
        MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL_PAYMENT: 'CINPPUR',
        MMB_ANCILLARIES_FLEXIBILIZATION_INVOLUNTARY_CONFIRMATION: 'CIBKCF',
        MMB_ANCILLARIES_FLEXIBILIZATION_INVOLUNTARY_PAYMENT: 'CIBPURC',
        BKIOH_PAYMENT: 'ONHOLD',
        BKIOH_CONFIRMATION: 'OHBKCF',
        CKI_CONFIRMATION: 'IBCKICF',
        CKI_CONFIRMATION_DECOUPLING: 'IBCKICD',
        CKI_CONFIRMATION_EARLY: 'IBECCF',
        CKI_CONFIRMATION_EARLY_DECOUPLING: 'IBECCD',
        CKI_PAYMENT: 'IBCKIPURC',
        HMAD_PAYMENTS: 'HMPURC',
        HMAD_BK_ERROR: 'HMUNKN',
        HMAD_PAYMENTS_PCC: 'HMPCC',
        HMAD_CONFIRMATION_COMMUNICATION_LOST: 'HMBKER',
        HMAD_PAYMENTS_DENIED: 'HMCCDN',
        HMAD_PAYMENTS_REJECTED: 'HMREJC',
        HMAD_CONFIRMATION: 'HMBKCF',
        MULTI_PAYMENTS: 'MTPURC',
        MULTI_BK_ERROR: 'MTUNKN',
        MULTI_PAYMENTS_PCC: 'MTPCC',
        MULTI_CONFIRMATION_COMMUNICATION_LOST: 'MTBKER',
        MULTI_PAYMENTS_DENIED: 'MTCCDN',
        MULTI_PAYMENTS_REJECTED: 'MTREJC',
        MULTI_CONFIRMATION: 'MTBKCF',
        PA_PAOB_PAYMENTS: 'PAPURC',
        PA_PAOB_PAYMENTS_CONFIRMATION: 'PABKCF',
        PA_PAOB_PAYMENTS_ERROR: 'PAPCC',
        PA_PARE_PAYMENTS_ERROR: 'RPAPCC',
        PA_PARE_PAYMENTS_CONFIRMATION: 'RPABKCF',
        PA_PARE_PAYMENTS: 'RPAPURC',
        PA_PAREONB_PAYMENTS: 'CIPRPAPURC',
        PA_PAREONB_PAYMENTS_CONFIRMATION: 'CIPPABKCF',
        PA_PAREONB_PAYMENTS_ERROR: 'CIPRPAPCC',
        PA_PAOBONB_PAYMENTS: 'CIPPAPURC',
        PA_PAOBONB_PAYMENTS_CONFIRMATION: 'CIPPABKCF',
        PA_PAOBONB_PAYMENTS_ERROR: 'CIPPAPCC',
        MMB_VOLUNTARY_CHANGE_PAYMENT: 'ATCPURC',
        MMB_VOLUNTARY_CHANGE_CONFIRMATION: 'ATCBKCF',
        MMB_VOLUNTARY_CHANGE_COMMUNICATION_LOST: 'ATCBKER',
        COMUNICATION_SEAT: 'STBKER',
        COMUNICATION_BAGGAGE: 'BGBKER',
        COMUNICATION_INSURANCE: 'INBKER ',
        COMUNICATION_ANCILLARIES: 'MOBKER',
        COMUNICATION_CARBON_FOOTPRINT: 'CFBKER',
        CREDITCARD_DENIED: 'MOCCDN',
        CREDITCARD_REJECT: 'MOREJC',
        BKI_COMMUNICATION_LOST: 'IBBKER',
        BOOKING_COMMUNICATION_LOST:'BKBKER',
        MMBOH_COMMUNICATION_LOST: 'IBBKER',
        GIFTCARDS_PAYMENT: 'REPURC',
        GIFTCARDS_CONFIRMATION: 'REBKCF',
        SUBSCRIPTIONMODELS_PAYMENT: 'PLPURC',
        MMB_YOUR_DOCUMENTS: 'MODDOC',
        SUBSCRIPTION_MODELS_CONFIRMATION: 'PLBKCF'
    },
    SUBSCRIPTION_MODELS_STEP: {
        CONFIRMATION: 'confirmacion'
    },
    QUADRIGAM_BY_DISRUPTION_FLOW: {
        'ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION': 'ALT_TOTAL_WITH_FLEX',
        'ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION': 'ALT_PARC_WITH_FLEX',
        'ALTERANTIVE_TOTAL_WITHOUT_FLEXIBILIZATION': 'ALT_TOTAL_WITHOUT_FLEX',
        'ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION': 'ALT_PARC_WITHOUT_FLEX'
    },
    PROCESS_DISRUPTION: {
        'CANCELLATION': 'involuntario sin alternativa',
        'CANCELLATION_ALTERNATIVE': 'involuntario con alternativa'
    },
    PROCESS_BY_QUADRIGAM: {
        ATCBKER: 'cambios voluntarios'
    },
    STEP_BY_QUADRIGAM: {
        BKCCDN: 'forma de pago denegada',
        BKREJC: 'forma de pago rechazada',
        BKBKER: 'comunicacion cortada',
        BKPPCC: 'presentar forma de pago',
        ATCBKER: 'comunicacion cortada'
    },
    MMB_DISRUPTION_PAYMENT_QUADRIGAM_UN_UNTK: ['ATCBKCF', 'ATCBKER'],
    SERVICE_WAITING_TIMES: {
        ISSUE_INFO_WAITING_TIME_INTERVAL: 3000,
        ISSUE_INFO_K0_WAITING_TIME: 30000,
        ISSUE_INFO_OK_WAITING_TIME: 60000
    },
    GENERAL_ERRORS: {
        SERVICE_GENERAL_ERROR: 'REST_SERVICE_ERROR_GENERAL',
        LOGGED_ERROR_TITLE: 'GENERAL_ADVICE_TITLE',
        LOGGED_ERROR_BODY: 'GENERAL_LOGGED_ERROR_BODY'
    },
    COOKIES: {
        PERSONALIZATION: 'IBERIACOM_PERSONALIZATION',
        GDR_PA_INFO: 'IBERIACOM_GDR_PA_INFO',
        NO_MARKETING_PERMISSION: 'IBERIACOM_UNACCEPTED_MARKETING_PERMISSION',
        MARKETING_PERMISSION_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 30,
        MARKETING_PERMISSION_TEST_EXPIRY_TIME: 1000 * 60 * 5, //5 minuts
        DEFAULT_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 365 * 10, //ten years
        DEFAULT_PATH: '/',
        IBERIACOM_LAST_SEARCH: {
            NAME: 'IBERIACOM_LAST_SEARCH',
            PARAMS: {
                ORIGIN: 0,
                DATES: [2, 3, 4, 5, 6, 7]
            }
        }
    },
    PATTERNS: {
        NAME_SURNAME_PATTERN:/^[a-zA-Z \-.'àÀáÁâÂãÃäÄåÅæÆçÇèÈéÉêÊëËìÌíÍîÎïÏðÐñÑòÒóÓôÔöÖøØùÙúÚûÛüÜýÝþÞÿŸßčČćĆšŠžŽđĐŁłÕõŻżŚśŔŕĚěŘřŃńŇňŹź]+$/,
        NAME_SURNAME_CLEANER:'[0-9*¡!?¿<>\\ºª|/·@#$%&,:`;=?¿())_+{}\\[\\]\\^€£¨"¬~]',
        PHONE_PATTERN: /^\d{6,}$/,
        PHONE_CLEANER: '\\D+',
        CVV_PATTERN: /^\d{3}$/,
        CVV_PATTERN_AX: /^\d{4}$/,
        CVV_CLEANER: '\\D+',
        DOCS_PATTERN:
                /^(?!.*[¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_+{}\[\]"\^€$£])/,
        DOCS_CLEANER: '[¡!?¿<>\\\\ºª|/\\·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
        ADDITIONAL_FIELD_PATTERN:
                /^(?!.*[�!?�<>\\\\��|/\�@#$%&,;=?�())_+{}\[\]"\^�$�])/,
        ADDITIONAL_FIELD_CLEANER:
                '[�!?�<>\\\\��|/\\�@#$%&,;=?�())_+{}\\[\\]"\\^�$�]',
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
        STREET_PATTERN:
                /(?!.*[0-9{8,}*$¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_+{}\[\]"\^€$£])/,
        STREET_CLEANER:
                '[0-9{8,}*$¡!?¿<>\\\\ºª|/\\·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
        CITY_PATTERN:
                /(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_+{}\[\]"\^€$£])/,
        CITY_CLEANER:
                '[0-9*¡!?¿<>\\\\ºª|/\\·@#$%&,;=?¿())_+{}\\[\\]"\\^€$£]',
        RUC_DOCUMENT: /^([0-9]){11}$/,
        RUC_CLEANER: '\\D+',
        OTHER_DOCUMENT: /^([0-9]){11}$/,
        MAX_LENGTH_OTHER_DOC: 11,
        AWS_WARNING_ERRORS: /AWS/,
        RESIBER_WARNING_ERRORS: /SSE_RESIBER/,
        EMAIL_PATTERN:
                /^[A-Za-z0-9]+(?:[\.\-\_]?[A-Za-z0-9])+\@[a-zA-Z0-9][a-zA-Z0-9\-\_]{0,64}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{1,5})+$/,
        ZIP_CODE_MARKET: {
            ES: {
                PATTERN: /^\d{2,5}$/,
                LENGTH: 5,
                CLEANER: '\\D+',
                MIN_LENGTH: 2,
                MAX_LENGTH: 5
            }
        },
        PROMOTIONAL_CODE: /(^[^#]|^[^?])|([^\\]|[^\/])|([\s\S]*)/,
        PROMOTIONAL_CODE_CLEANER:
                '(^[#]|^[?])|([\\\\]|[%]|[\\/])|([^\\s\\S])'
    },
    MODALS: {
        GENERIC_ERROR_MODAL_PAYMENT: 'ib-modal-payment-generic-error',
        VOUCHER_ERROR_MODAL_PAYMENT: 'pmt-voucher-error-modal',
        PAYMENT_TAXES: 'ib-modal-payment-taxes.html',
        PAYMENT_LUGGAGE_INFO: 'ib-modal-payment-luggage-info.html',
        PAYMENT_DISCOUNT_ADVICES: 'ib-modal-payments-discounts-advice.html'
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
        MERCADO_PAGO: 'MERCADO_PAGO',
        NEW_CARD: 'newCard',
        IBERIA_PAY: 'IBERIA_PAY',
        FULL_AVIOS: 'FULL_PAY_AVIOS',
        COUPONS: 'COUPONS',
        IBERIA_PAY_AFOP: 'IBERIA_PAY_AFOP',
        ONHOLD_IBERIA_PAY_AFOP: 'ONHOLD_IBERIA_PAY_AFOP'
    },
    DEVELOPED_AFOP:[
        'BIZUM',
        'IDEAL',
        'MERCADO_PAGO',
        'NEMURU',
        'PAYPAL',
        'SOFORT'
    ],
    DISCOUNT_TYPES: {
        AVIOS: 'AVIOS',
        PARTNER: 'PARTNER',
        VOUCHER: 'VOUCHER',
        GIFT_CARD:'GIFTCARD',
        AVIOS_REDEMPTION: 'AVIOS_REDEMPTION',
        AVIOS_DISCOUNT: 'AviosDiscount',
        POINTS_REDEMPTION: 'POINTS_REDEMPTION'
    },
    DISSCOUNT_PAYMENT_ITEMS: ['AVIOS', 'VOUCHER'],
    ALLOWED_EXTERNAL_CREDITCARDS: ['UP', 'JC'],
    PAYMENT_ERRORS: {
        INTERNAL_ERROR_DATA_CODE_PCC: 'PMT_PPM_8014',
        INTERNAL_ERROR_DATA_CODE_3DS: 'REDIRECT_POST',
        INTERNAL_ERROR_DATA_CODE_3DS_IBERIA_PAY: 'REDIRECT_URL',
        INTERNAL_ERROR_DATA_CODE_3DS_IBERIA_PAY_INSURANCE:'REDIRECT_URL_AUTH_ONLY',
        INTERNAL_ERROR_DATA_CODE_EXTERNAL_FORMS: 'REDIRECT_JS_FORM',
        INTERNAL_ERROR_DATA_CODE_3DS2_REDIRECT: 'REDIRECT_COMPONENT',
        INTERNAL_ERROR_DATA_CODE_RESIDENT_NOT_AVAILABLE: 'SSE_ORM_900617',
        INTERNAL_ERROR_DATA_CODE_RESIDENT_NOT_AVAILABLE_GO_ON_HOLD: 'SSE_ORM_900606',
        INTERNAL_ERROR_DATA_CODE_REDIRECT_AFOP: 'REDIRECT_AFOP'
    },
    PAYMENTS_PROVIDER: {
        IDEAL: 'DOCOMO_IDEAL',
        JCB: 'JC'
    },
    IDEAL_BANK_LIST: {
        TEST: [{ bankName: 'Test Issuer', issuer: '1121' },
            { bankName: 'Test Issuer 2', issuer: '1151' },
            { bankName: 'Test Issuer 3', issuer: '1152' },
            { bankName: 'Test Issuer 4', issuer: '1153' },
            { bankName: 'Test Issuer 5', issuer: '1154' },
            { bankName: 'Test Issuer 6', issuer: '1155' },
            { bankName: 'Test Issuer 7', issuer: '1156' },
            { bankName: 'Test Issuer 8', issuer: '1157' },
            { bankName: 'Test Issuer 9', issuer: '1158' },
            { bankName: 'Test Issuer 10', issuer: '1159' },
            { bankName: 'Test Issuer Refused', issuer: '1160' },
            { bankName: 'Test Issuer Pending', issuer: '1161' },
            { bankName: 'Test Issuer Cancelled', issuer: '1162' }],
        PRODUCTION: [{ bankName: 'ABN AMRO', issuer: '0031' },
            { bankName: 'ASN Bank', issuer: '0761' },
            { bankName: 'bunq', issuer: '0802' },
            { bankName: 'ING Bank', issuer: '0721' },
            { bankName: 'Knab', issuer: '0801' },
            { bankName: 'Rabobank', issuer: '0021' },
            { bankName: 'Regiobank', issuer: '0771' },
            { bankName: 'Revolut', issuer: '0805' },
            { bankName: 'SNS Bank', issuer: '0751' },
            { bankName: 'Triodos Bank', issuer: '0511' },
            { bankName: 'Van Lanschot Bankiers', issuer: '0161' }]
    },
    BLOCKING_ERRORS_CANCEL: {
        409: ['PMT_PPM_9010'],
        412: ['PMT_PPM_9010', 'PMT_PPM_8015', 'SSE_ORM_900552'],
        428: ['SSE_ORM_900605'],
        500: ['PMT_PPM_8001']
    },
    BLOCKING_ERRORS_HOME: {
        410: ['SSE_ORM_9999'],
        412: ['SSE_ORM_900555']
    },
    BLOCKING_TYPES: {
        CANCEL: 'CANCEL',
        HOME: 'HOME'
    },
    PAYMENT_METHODS_KEYS: {
        UP: 12,
        DOCOMO_ALIPAY: 11,
        DOCOMO_WECHAT: 10,
        JC: 9,
        CREDITCARD: 8,
        IBERIA_PAY: 7,
        PAYPAL: 6,
        IDEAL:5,
        SOFORT:4,
        BIZUM: 3,
        DOCOMO_SOFORT: 2,
        DOCOMO_IDEAL: 1
    },
    loadingCardsPath: '/cargando/cardPayData.json',
    imagesRoute: '/iberia-web-content/imagenes',
    PAGES_URL: {
        SEARCH: '/chktrp',
        PAYMENTS: '/ohinfo',
        CONFIRMATION_PAGE: '/confirmation',
        BOOKING_MANAGE: '/ibmtdt',
        CKI_BOARDING_CARD_PAGE: '/ibecbp',
        CKI_CONFIRMATION_PAGE: '/ibcocf-and-ibeccf',
        MMB_CONFIRMATION_PAGE: '/confirmation-mmb',
        GIFTCARDS_CONFIRMATION_PAGE: '/giftcards-confirmation',
        SUBSCRIPTION_MODELS_CONFIRMATION_PAGE: '/PLBKCF'

    },
    COMPONENT_PAGE: {
        PAYMENTS_PAGE: 'ibpurc',
        CONFIRMATION_PAGE: 'confirmation',
        SUBSCRIPTION_MODELS_CONFIRMATION_PAGE: 'PLBKCF',
        CKI_BOARDING_CARD_PAGE: 'ibecbp',
        CKI_CONFIRMATION_PAGE: 'ibcocf-and-ibeccf',
        MMB_CONFIRMATION_PAGE: 'confirmation-mmb',
        COMMUNICATION_LOST: 'ibbker'
    },
    STATUS: {
        UNCHECKABLE: 'UNCHECKABLE',
        CHECKABLE: 'CHECKABLE',
        CHECKED: 'CHECKED',
        STANDBY: 'STANDBY',
        REISSUE: 'REISSUE',
        NOT_SELECTABLE: 'NOT_SELECTABLE'
    },
    MMB_DISRUPTION_ORDER_STATUS: {
        UN: 'UNCONFIRMED_CHANGES',
        UNTK: 'ACCEPT_CHANGES_PENDING'
    },
    PURCHASEMESSAGES: [
        'PURCHASE_WITHOUT_PAYMENT',
        'PURCHASEOK_WITHOUT_TICKETS'
    ],
    PURCHASEKEY: 'PURCHASE_MESSAGE',
    airlinesLogoBaseRoute: '/aerolineas/',
    defaultAirlineLogo: 'logo_pos_generico.svg',
    URL_PARAMS_NAMES: {
        PAYMENT_STATUS: ['paymentStatus'],
        PAYMENT_TYPE_CALLBACK: ['componentType'],
        PAYMENT_3DS2_CALLBACK_PARES: ['PaRes'],
        PAYMENT_3DS2_CALLBACK_MD: ['MD'],
        SENIOR: ['YCD'],
        ADULT: ['Adult', 'ADT'],
        CHILD: ['Child', 'CHD', 'Infant'],
        INFANT: ['InfantLap', 'INF'],
        YOUNG: ['YTH'],
        TEENAGER: ['BNN']
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
        SUBSCRIPTIONMODELS: 'SUBSCRIPTIONMODELS'
    },
    TITLES_APP: {
        BOOKING: 'BBKI',
        BOOKING_ONHOLD: 'BBKIOH',
        MANAGEMYBOOKING: 'MMB',
        MANAGEMYBOOKING_ONHOLD: 'MMBOH',
        MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
        MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
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
    CONDITION_TYPES: {
        HAND_BAGGAGE: 'EQMANO',
        CHECKED_BAGGAGE: 'EQBODEGA',
        SEAT: 'ASIENTO',
        CHANGE: 'CAMBIO',
        REFUND: 'REEMBOLSO',
        FOOD: 'COMIDA'
    },
    ORDER_ITEMS_TYPES: {
        FLIGHT: 'flight',
        CREDIT_CARD_FEE: 'creditCardFee',
        CO2_FOOTPRINT: 'co2Footprint',
        DONATION: 'donation'
    },
    PAYMENT_ORDER_ITEMS_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER'
    },
    CREDIT_CARDS_PROVIDER: {
        CREDIT_CARD: 'RESIBER',
        IBERIA_PAY: 'IBERIAPAY'
    },
    ISSUED_TYPES: {
        INSURANCE: 'INSURANCE'
    },
    WARNING_CODES: {
        UNPAID_ALLIANZ_INSURANCE: 'UNPAID_ALLIANZ_INSURANCE'
    },
    ANCILLARIES_TYPES: {
        BAGGAGE: 'BAGGAGE',
        SEAT: 'SEAT',
        INSURANCE: 'INSURANCE',
        VEHICLE_RENTAL: 'VEHICLE_RENTAL',
        UPGRADING: 'UPGRADING',
        UPGRADING_BID: 'UPGRADING_BID',
        BOB: 'BOB',
        SPEQS: 'SPECIALEQUIPMENT',
        SPEQSMMB: 'SPECIAL_EQUIPMENT',
        FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
        PRIORITY_BOARDING: 'PRIORITY_BOARDING',
        CO2_FOOTPRINT: 'CO2_FOOTPRINT',
        WINE_CLUB: 'WINE_CLUB',
        BUNDLES: 'BUNDLES',
        GLOBICK: 'GLOBICK',
        INSURANCE_ALLIANZ: 'ALLIANZ_FUSION',
        PET:'PET'
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
    FLEX_SUBTYPES: {
        FLIGHT_CHANGE: 'FLIGHT_CHANGE',
        VOUCHER_REFUND: 'VOUCHER_REFUND',
        FLEXIBILITY_PACK: 'FLEXIBILITY_PACK'
    },
    BAGGAGE_SUBTYPE: {
        BAGGAGE_15: 'BAGGAGE_15',
        BAGGAGE_23: 'BAGGAGE_23',
        BAGGAGE_32: 'BAGGAGE_32'
    },
    BAGGAGE_SUBTYPE_DESCRIPTION: {
        BAGGAGE_15: '15Kg',
        BAGGAGE_23: '23Kg',
        BAGGAGE_32: '32Kg'
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
        aisle: 'AISLE',
        neighborFree: 'L'
    },
    GENERAL_STATUS: {
        AVAILABLE: 'AVAILABLE',
        NOT_AVAILABLE: 'NOT_AVAILABLE'
    },
    WEB_CENTER_REDIRECT: {
        REDIRECTION_START: '/cs/Satellite?pagename=redirect',
        BLANK: '_blank',
        MARKET_QUERY: '&market=',
        LANGUAGE_QUERY: '&locale=',
        QUADRIGAM_QUERY: '&quadrigam=',
        SEARCH_MORE_INFO: 'AUTCHK',
        PASSENGER_RIGHTS: 'DERPAS ',
        BAGGAGE_RESTRIC: 'EQUPRE',
        TERMS_CONDITIONS_GIFT_CARDS:
                '/cs/Satellite?pagename=IB_SE_Services&service=getContentPage&quadrigam=FLOWGIFTCARDTERMS'
    },
    COMPANIES: {
        IB: 'IB',
        I2: 'I2',
        YW: 'YW'
    },
    COMPANIES_OTHERS: {
        QR: 'QR', // QATAR Airways
        BA: 'BA' // British Airways
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
            RE: 'IBBKCF_RESIDENT_CITY_CEUTA_NAME',
            BI: 'IBBKCF_RESIDENT_CITY_BALEARES_NAME',
            DC: 'interCanarias'
        }
    },
    lang: 'es',
    CODE_LANGUAGE_PAYPAL: {
        CODES: [
            {
                language: 'es',
                paypalLanguage: 'es_ES'
            },
            {
                language: 'ca',
                paypalLanguage: 'es_ES'
            },
            {
                language: 'de',
                paypalLanguage: 'de_DE'
            },
            {
                language: 'en',
                paypalLanguage: 'en_US'
            },
            {
                language: 'fr',
                paypalLanguage: 'fr_FR'
            },
            {
                language: 'it',
                paypalLanguage: 'it_IT'
            },
            {
                language: 'zh',
                paypalLanguage: 'zh_CN'
            },
            {
                language: 'ja',
                paypalLanguage: 'ja_JP'
            },
            {
                language: 'nl',
                paypalLanguage: 'nl_NL'
            },
            {
                language: 'pt',
                paypalLanguage: 'pt_PT'
            },
            {
                language: 'ru',
                paypalLanguage: 'ru_RU'
            }
        ]
    },
    CODE_LANGUAGE_NEMURU: {
        CODES: [
            {
                language: 'es',
                nemuruLanguage: 'es-ES'
            },
            {
                language: 'ca',
                nemuruLanguage: 'ca-CA'
            },
            {
                language: 'en',
                nemuruLanguage: 'en-US'
            },
            {
                language: 'fr',
                nemuruLanguage: 'fr-FR'
            }
        ]
    },
    PAYMENTS: {
        MERCHANT_ID: 'IBERIA',
        ORG_ID: 'k8vif92e'
    },
    MONETATE_INFO: {
        SETPAGETYPE: 'setPageType',
        TRACKDATA: 'trackData'
    },
    SUBREALM_VALUES: {
        MMB_ONHOLD: 'ONHOLD_CONFIRMATION',
        MMB_FLIGHTCHANGE: 'FLIGHT_CHANGE',
        MMB_ANCILLARIESPURCHASE: 'ANCILLARIES_PURCHASE'
    },
    FLOW: {
        ANCILLARIES: 'ANCILLARIES'
    },
    ANCILLARIES_TYPES_CONFIRMATION: {
        BAGGAGES: 'BAGGAGES',
        SEATS: 'SEATS',
        INSURANCE: 'INSURANCE',
        VEHICLE_RENTAL: 'VEHICLE_RENTAL',
        UPGRADING: 'UPGRADING',
        UPGRADING_BID: 'UPGRADINGBIDS',
        BOB: 'BOB',
        SPEQS: 'SPEQS',
        FLEXIBILITY: 'FLEXIBILITY',
        PRIORITY: 'PRIORITY',
        CO2_FOOTPRINT: 'CARBONFOOTPRINT',
        BUNDLES: 'BUNDLES',
        GLOBICK: 'GLOBICK'
    },
    FLEXIBILITY_STATUS: {
        PENDING_PAYMENT: 'PENDING_PAYMENT',
        PENDING: 'PENDING'
    },
    INTERNAL_ERRORS_CODES_TO_412: [
        'PMT_PPM_8014',
        'PMT_PPM_8031',
        'PMT_PPM_8032'
    ],
    SELECTED_REDEMPTION: {
        DISCOUNTED_PRICE: 'discountedPrice',
        BASE_PRICE: 'basePrice'
    },
    BIOMETRIC: {
        STATUS: {
            NOT_AVAILABLE: 'NOT_AVAILABLE',
            AVAILABLE: 'AVAILABLE',
            COMPLETE: 'COMPLETE',
            AUTOMATIC_FF_AVAILABLE: 'AUTOMATIC_FF_AVAILABLE'
        }
    },
    CABIN_CLASS: {
        TYPE: {
            ECONOMY: 'ECONOMY',
            BUSINESS: 'BUSINESS',
            BUSINESS_PLUS: 'BUSINESS_PLUS',
            BUSINESS_CLUB: 'BUSINESS_CLUB',
            BUSINESS_CLASS: 'BUSINESS_CLASS',
            PREMIUMTOURIST: 'PREMIUMTOURIST'
        },
        LABEL: {
            CABINA_TURISTICA: 'CABINA_TURISTICA',
            CABINA_BUSINESS: 'CABINA_BUSINESS',
            CABINA_PREMIUM_TURIST: 'CABINA_PREMIUM_TURIST'
        }
    },
    INHIBIT_BOARDING_CARD_TYPES: {
        SEE_AGENT_REASON: 'SEE_AGENT_REASON',
        AIRCHECK_REASON: 'AIRCHECK_REASON',
        INHIBIT_REASON: 'INHIBIT_REASON',
        UMNR_REASON: 'UMNR_REASON',
        RESI_REASON: 'RESI_REASON',
        AVIH_REASON: 'AVIH_REASON',
        PETC_REASON: 'PETC_REASON',
        COUR_REASON: 'COUR_REASON'
    },
    INHIBIT_BOARDING_CARD_PRIORITIES: {
        SEE_AGENT: 7,    // no item
        AIRCHECK: 6,    // no item
        INHIBIT: 5,     // no item
        UMNR: 4,        // item
        RESI: 3,        // item
        AVIH: 2,        // item
        PETC: 1,        // item
        COUR: 0         // item
    },
    SCRIPTS_URL:{
        DEV:'https://cdn.nemuru.com/assets/stg/nemuru.stg.js',
        PRO:'https://cdn.nemuru.com/assets/prod/nemuru.prod.js'
    },
    MERCADO_PAGO_SCRIPTS_URL:{
        DEV:'https://sdk.mercadopago.com/js/v2',
        PRO:'https://sdk.mercadopago.com/js/v2' // TODO: review if PROD and DEV have different CDNs
    },
    INVOICE_WARNINGS:{
        WARNING_MEMBERSHIP_PROBLEM: 'AUTOMATIC_INVOICES_WARNING_MEMBERSHIP_PROBLEM',
        WARNING_MEMBERSHIP_NOT_OBTAINED: 'AUTOMATIC_INVOICES_WARNING_MEMBERSHIP_NOT_OBTAINED',
        WARNING_MEMBERSHIP_INFORMATION_INCOMPLETE: 'AUTOMATIC_INVOICES_WARNING_MEMBERSHIP_INFORMATION_INCOMPLETE',
        WARNING_ORDER_INFORMATION_INCOMPLETE: 'AUTOMATIC_INVOICES_WARNING_ORDER_INFORMATION_INCOMPLETE',
        WARNING_INVOICE_NOT_ISSUED: 'AUTOMATIC_INVOICES_WARNING_INVOICE_NOT_ISSUED',
        INVOICES_FAIL: 'AUTOMATIC_INVOICES_INVOICES_FAIL',
        NO_TICKET_NUMBER: 'AUTOMATIC_INVOICES_NO_TICKET_NUMBER',
        INVOICES_PARTIAL_FAIL: 'AUTOMATIC_INVOICES_INVOICES_PARTIAL_FAIL',
        NO_MARKET_FOUND: 'AUTOMATIC_INVOICES_WARNING_NO_MARKET_FOUND'
    },
    PAYMENTS_METHODS_PROVIDERS,
    PAYMENTS_METHODS_CODE,
    PAYMENTS_METHODS_CODE_BY_PROVIDER,
    PAYMENTS_DCC:{
        MASTERCARD: 'CA',
        VISA: 'VI',
        DCC_ENABLED: 'DCC_ENABLED',
        DCC_DISABLED: undefined
    },
    INHIBIT_ALERT: {
        SEE_AGENT: {
            status: false,
            isHomogeneous: false,
            code: 'SEE_AGENT',
            TEXT: '',
            LITERAL: 'SEE_AGENT_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
            TITLE: 'SEE_AGENT_BANNER_TITLE',
            icon: 'icon-resident-discount',
            LITERAL_HOMOGENEOUS: 'SEE_AGENT_BANNER_SUBTITLE_HOMOGENEOUS',
            LITERAL_NO_HOMOGENEOUS: 'SEE_AGENT_BANNER_SUBTITLE_NOT_HOMOGENEOUS'
        },
        Aircheck: {
            status: false,
            code: 'AIRCHECK',
            TEXT_1: '',
            TEXT_2: 'MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_2',
            TEXT_3: 'MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_3'
        },
        AVIH: {
            status: false,
            isHomogeneous: false,
            code: 'AVIH',
            TEXT: '',
            LITERAL: 'AVIH_CONFIRMATION_BANNER_SUBTITLE',
            TITLE: 'AVIH_CONFIRMATION_BANNER_TITLE',
            icon: 'icon-huella'
        },
        PETC: {
            status: false,
            isHomogeneous: false,
            code: 'PETC',
            TEXT: '',
            LITERAL: 'PETC_CONFIRMATION_BANNER_SUBTITLE',
            TITLE: 'PETC_CONFIRMATION_BANNER_TITLE',
            icon: 'icon-huella'
        },
        RESI: {
            status: false,
            isHomogeneous: false,
            code: 'RESI',
            TEXT: '',
            LITERAL: 'RESI_CONFIRMATION_BANNER_SUBTITLE',
            TITLE: 'RESI_CONFIRMATION_BANNER_TITLE',
            icon: 'icon-resident-discount'
        },
        UMNR: {
            status: false,
            isHomogeneous: false,
            code: 'UMNR',
            TEXT: '',
            LITERAL: 'UMNR_CONFIRMATION_BANNER_SUBTITLE',
            TITLE: 'UMNR_CONFIRMATION_BANNER_TITLE',
            icon: 'icon-iberia_ninos'
        },
        COUR: {
            status: false,
            isHomogeneous: false,
            code: 'COUR',
            TEXT: '',
            LITERAL: 'COUR_CONFIRMATION_BANNER_MESSAGE',
            TITLE: 'COUR_BANNER_TITLE',
            icon: 'icon-etiqueta-en-maleta'
        }
    },
    SEATBOOST_BANNER_URL: {
        DESKTOP: 'https://seatboost.com/es/#how-it-works',
        MOBILE: 'https://seatboost.com/get-seatboost/?finalUrl=https%3A%2F%2Fseatboost.page.link%3Flink%3Dhttps%253A%252F%252Fwww.bidwinengine.com%252Funiversal-link%253Flinktype%253Dtap%2526token%253Dtoken%2526lang%253Des_ES%2526linktype%253Dtap%2526token%253Dtoken%2526lang%253Des_ES%2526mid%253D8a88800e8f93c2d7018fc000fc15569e%26ibi%3Dcom.seatboost.SeatBoost%26isi%3D1004780817%26apn%3Dcom.seatboost.ma_v2%26efr%3D1'
    },
    ON_HOLD_FREE:{
        HOURS: 24,
        PRICE: 0
    },
    CARD_SELECTED_MODELS: {
        GIFT: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-1.png',
            iconClass: 'ib-gift-card__icon--gift',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-regalo.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_GIFT',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        CHRISTMAS: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-1.png',
            iconClass: 'ib-gift-card__icon--christmas',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-navidad.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_CHRISTMAS',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        HEART: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-rojo.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-2.png',
            iconClass: 'ib-gift-card__icon--heart',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-corazon.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_HEART',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        BABY: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-3.png',
            iconClass: 'ib-gift-card__icon--baby',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-bebe.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_BABY',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        GRADUATION: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-4.png',
            iconClass: 'ib-gift-card__icon--graduation',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-graduacion.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_GRADUATION',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        BIRTHDAY: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-5.png',
            iconClass: 'ib-gift-card__icon--birthday',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-cumpleanos.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_BIRTHDAY',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        MOTHER: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-7.png',
            iconClass: 'ib-gift-card__icon--mother',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-madre.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_MOTHER',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        FATHER: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-8.png',
            iconClass: 'ib-gift-card__icon--father',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-padre.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_FATHER',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        HALLOWEEN: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-10.png',
            iconClass: 'ib-gift-card__icon--father',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-pumpkin.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_HALLOWEEN',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        SUMMER: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-blanco.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-verano.png',
            iconClass: 'ib-gift-card__icon--verano',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-verano.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_SUMMER',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        },
        PRIDE: {
            logo: '/iberia-web-content/imagenes/gift-cards/logo-iberia-rojo.png',
            backGroundImage: '/iberia-web-content/imagenes/gift-cards/tarjeta-11.png',
            iconClass: 'ib-gift-card__icon--corazon-pride',
            icon: '/iberia-web-content/imagenes/gift-cards/icon-corazon-pride.png',
            translates: {
                altLogo: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altFigure: 'GIFT_CARD_CONFIGURATION_ALT_CARD_PICTURE',
                altTheme: 'GIFT_CARD_CONFIGURATION_SUMMER',
                title: 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT',
                expiration: 'GIFT_CARD_CONFIGURATION_EXPIRATION',
                code: 'GIFT_CARD_CONFIGURATION_CODE'
            }
        }
    },
    PAYMENT_VIEW_TYPE: {
        NEW: 'NEW',
        OLD: 'OLD',
        CHECK: 'CHECK'
    }

};
angular.module('ib-pmt-module').constant('PmtConstants', PmtConstants);
export { PmtConstants };
