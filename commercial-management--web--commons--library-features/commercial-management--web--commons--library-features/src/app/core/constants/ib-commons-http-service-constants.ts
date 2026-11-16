import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);

const servicesURI: string = envCopy.services;
const authoritationURI: string = envCopy.auth;
const globalAuthorizationToken: string = envCopy.globalAuthorizationToken;
const servicesCloudUri: string = envCopy.cloud;
const CommonsHttpServicesConstants = {
    production: envCopy.production,
    timeWait: 2000,
    numAttemps: 3,
    LOGIN_ONB: 'ONB' as const,
    defaultOnBusinessLoginPage: 'https://www.iberia.com/integration/obsso/login/',
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
    WCS_URIS: {
        PHONES: '/cs/Satellite?pagename=IB_SE_Services&service=getContact',
        JSESSIONCLEAN: '/cs/Satellite?pagename=IB_SE/CacheControl0s/Integration/logOut'
    },
    SALESFORCE_ENVIRONMENTS: {
        PRO_AWS: 'https://iberia--dcexitrehe.sandbox.my.site.com/IbIdentity',
        PRE_AWS:'https://iberia--dcexitpre.sandbox.my.site.com/IbIdentity',
        INT_AWS: 'https://iberia--dcexitint.sandbox.my.site.com/IbIdentity',
        PREE: 'https://iberia--identity.sandbox.my.site.com/IbIdentity',
        PREF: 'https://iberia--identity.sandbox.my.site.com/IbIdentity',
        PREB: 'https://login.preb.iberia.es',
        PRED: 'https://login.preb.iberia.es',
        PRO: 'https://login.iberia.com'
    },
    SALESFORCE_TOKEN: {
        introspectURI: servicesURI + '/lgm-ul/rs/v1/token/salesforce-introspect',
        tokenURI: servicesURI + '/lgm-ul/rs/v1/token/salesforce-token',
        iframeURI: '/services/oauth2/authorize/',
        logoutURI: '/services/oauth2/revoke',
        accessToTokenSFServiceURI_PRE: 'https://identity-digitalboarding.cs81.force.com/IbIdentity/services/oauth2/introspect',
        accessTokenSFServiceURI_PRE: 'https://identity-digitalboarding.cs81.force.com/IbIdentity/services/oauth2/token',
        iframeUri_PRE: 'https://identity-digitalboarding.cs81.force.com/IbIdentity/services/oauth2/authorize/',
        client_id_PRE: '3MVG9od6vNol.eBgzVEY_.5aeJNcS1i8OPZHGHP_dWKR4VkXzAfy6lxHlsLMRKrrTuq6LGHxfCFxdCdwSsPJg',
        client_id_INT_AWS: '3MVG93ftGtO2exG9g39orlwRlDlnQLZIhzaUHKgt2IrZZUEb1ZiEhNYI9eYukaeLxc.XpBnsbWDJ9GwkniEFj',
        client_id_PRE_AWS: '3MVG93ftGtO2exG9g39orlwRlDqoyfvULcxsruG2G1fmY2ISBpf8YfWC98EEt2aPuRoHAM_RVEDXnz_ZAQCo9',
        client_id_PRO_AWS: '3MVG9tklOJf0sawXpSvDFKSL9sZiBvcDo0ZlLM64vltIqHLG0aKaINB1ILwQv.m6v48.3M1F8uDXYLTiNs80c',
        accessToTokenSFServiceURI_PRE_B: 'https://full-digitalboarding.cs110.force.com/IbIdentity/services/oauth2/introspect',
        accessTokenSFServiceURI_PRE_B: 'https://full-digitalboarding.cs110.force.com/IbIdentity/services/oauth2/token',
        iframeUri_PRE_B: 'https://full-digitalboarding.cs110.force.com/IbIdentity/services/oauth2/authorize/',
        client_id_PRE_B: '3MVG91LYYD8O4krRFZk502yUZjlSyofImTLngpg.ot6o4AysVzkuOz1FyZzTpKPZeXCZONGwH6eRbkrpKNs2D',
        accessToTokenSFServiceURI_PRO: 'https://login.iberia.com/services/oauth2/introspect',
        accessTokenSFServiceURI_PRO: 'https://login.iberia.com/services/oauth2/token',
        iframeUri_PRO: 'https://login.iberia.com/services/oauth2/authorize/',
        client_id_PRO: '3MVG98_Psg5cppyYNQC4m0lz1SyxsnyZ.TvQ4SHpYjeUKvc2_8ZBmjwS8nspd7op4N1dks_oUbY4hLCAejD8L'
    },
    ancillariesURI: '/ass-fass/rs/fass/v5/',
    ancillariesURICloud: servicesCloudUri + '/v1/management/',
    deleteAncillaryURI: '/ass-fass/rs/fass/v5/',
    getAncillariesSummaryURI: '/ass-fass/rs/fass/v5/',
    destinationAreasCitiesListServiceURI: 'location/areas/destination',
    cabinTypesListServiceURI: 'data/cabin/types',
    tokenServiceURI: authoritationURI + '/auth/realms/commercial_platform/protocol/openid-connect/token',
    revokeTokenServiceURI: authoritationURI + '/auth/realms/commercial_platform/protocol/openid-connect/logout',
    tokenOBServiceURI: authoritationURI + '/auth/realms/on_business/protocol/openid-connect/token',
    endpointsServiceURI: servicesURI + '/endpoints/',
    REFERRAL_URL_PARAM: 'referralURL',
    specialPassengerOriginDestinationURI: 'location/origin-destination/passenger',
    vouchersCondition: 'vouchers/condition',
    DEFAULT_ENDPOINTS: {
        deleteBundleURI: servicesCloudUri + '/v1/bundles/management/',
        defaultGlobickURI: servicesCloudUri + '/v1/glb/',
        ancillariesURI: servicesURI + '/ass-fass/rs/fass/v5/',
        ancillariesURICloud: servicesCloudUri + '/v1/management/',
        getAncillariesSummaryURI: servicesURI + '/ass-fass/rs/fass/v5/',
        ORIGIN: servicesURI + '/rdu-loc/rs/loc/v1/location/cities/origin',
        DESTINATION: servicesURI + '/rdu-loc/rs/loc/v1/location/cities/destination',
        AREAS: servicesURI + '/rdu-loc/rs/loc/v1/location/areas',
        COMMERCIAL_SELLING: servicesURI + '/rdu-loc/rs/loc/v1/location/market/commercialsellingdata',
        destinationAreasCitiesListServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/areas/destination',
        cabinTypesListServiceURI: servicesURI + '/framework-services/rs/commons/v1/data/cabin/types',
        ibPlusLevelsServiceURI: servicesURI + '/framework-services/rs/commons/v1/data/iberiaPlusCard/levels',
        deleteAncillaryURI: servicesURI + '/ass-fass/rs/fass/v5/',
        programmerMembers: servicesURI + '/agl/v4/programmes/IBP/members/{{id}}',
        retrieveMembers: servicesURI + '/prlm-mbm/rs/v2/members/{{id}}',
        updateMembers: servicesURI + '/prlm-mbm/rs/v1/members/{{id}}',
        deleteIbPlusMembers: servicesURI + '/prlm-mbm/rs/v2/members',
        deleteIbZeroMembers: servicesURI + '/pzmm-mbm/rs/v1/members',
        programmerAccounts: servicesURI + '/agl/v1/members/{{id}}/programmes/IBP/schemes/accounts',
        programmerRecognitionLevels: servicesURI + '/agl/v2/members/{{id}}/programmes/IBP/schemes/recognition-levels',
        customerDataURI: servicesURI + '/cust-cust/rs/v1/customer/complete',
        newsletterServiceURI: servicesURI + '/cust-cust/rs/v2/newsletter',
        externalAncillariesURI: servicesCloudUri + '/v1/ibv/availability/',
        externalAncillariesURICloudURI: servicesCloudUri + '/v1/management/{flowId}',
        paymentMethodsServiceURI: servicesURI + '/pmt-ppm/rs/ppm/v7/',
        specialPassengerOriginDestinationURI: servicesURI + '/rdu-loc/rs/loc/v2/location/origin-destination/passenger',
        countryListURI: servicesURI + '/rdu-loc/rs/loc/v1/location/country',
        countryListAPIsURI: servicesURI + '/rdu-loc/rs/loc/v1/location/country/nationality',
        phoneCodesURI: servicesURI + '/rdu-loc/rs/loc/v1/location/phone-codes',
        municipalitiesListURI: servicesURI + '/rdu-loc/rs/loc/v1/location',
        communitiesListURI: servicesURI + '/rdu-loc/rs/loc/v1/location/{{country}}/communities',
        commercialSellingDataURI: servicesURI + '/rdu-loc/rs/loc/v1/location/market/commercialsellingdata',
        statesListURI: servicesURI + '/rdu-loc/rs/loc/v1/location/{{country}}/states',
        DICTIONARY_TYPES: servicesURI + '/agl/v1/programmes/{{programme-identifier}}/dictionaries/{{dictionaryType}}',
        onBusinessMembershipURI: servicesURI + '/cmlm-mbm/rs/v1/membership',
        onBusinessEmployeesURI: servicesURI + '/cmlm-mbm/rs/v1/employees',
        RETRIEVE_IB_PLUS_ASSOCIATES: servicesURI + '/prlm-asm/rs/v1/members/{{memberIdentifier}}/associates',
        RETRIEVE_IB_PLUS_ASSOCIATE:
                servicesURI + '/agl/v1/members/{{memberIdentifier}}/programmes/{{programme-identifier}}/associates/{{associate-identifier}}',
        ADD_IB_PLUS_ASSOCIATE: servicesURI + '/prlm-asm/rs/v1/members/{{memberIdentifier}}/associates',
        UPDATE_IB_PLUS_ASSOCIATE: servicesURI + '/prlm-asm/rs/v1/members/{{memberIdentifier}}/associates/{{associate-identifier}}',
        DELETE_IB_PLUS_ASSOCIATES:
                servicesURI + '/agl/v1/members/{{memberIdentifier}}/programmes/{{programme-identifier}}/associates/{{associate-identifier}}',
        gdprServiceURI: servicesURI + '/rdu-loc/rs/loc/v1/location/',
        CHECK_BONUS: servicesURI + '/orm-ors/rs/v1/vouchers/condition',
        SAVE_IBERIAPAY_CARD: servicesURI + '/pmt-ppm/rs/ppm/v7/iberiapay/customer/profilecard',
        CREDITCARD_EXISTS: servicesURI + '/cust-cust/rs/v3/customer/credit_card/exists',
        SHORT_REGISTER: servicesURI + '/pzmm-mbm/rs/v1/members',
        AVIOS_SUMMARY: servicesURI + '/prlm-pc/rs/v1/points/summary-calculation',
        AVIOS_ANCILLARIES: servicesURI + '/prlm-pc/rs/v1/points/ancillaries-calculation',
        AVIOS_FLIGHTS: servicesURI + '/prlm-pc/rs/v1/points/flight-calculation',
        NEW_PAYMENT_AVAILABLE: servicesURI + `/pmt-ppm/rs/ppm/v7/config/new-payment-available/market/{marketId}/realm/{realm}`
    },
    SALESFORCE_ENDPOINTS: {
        IB_CONTACT_DETAILS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        IB_ALTERNATIVE_CONTACT: servicesURI + '/cust-cust/rs/v1/alternative_contact',
        TRAVEL_PREFERENCES: servicesURI + '/cust-cust/rs/v1/travel_preferences',
        TRAVEL_DOCUMENTS: servicesURI + '/cust-cust/rs/v1/travel_document',
        DISCOUNTS: servicesURI + '/cust-cust/rs/v1/discounts',
        PERSONAL_DATA_SERVER: servicesURI + '/pzmm-mbm/rs/v1/members/personal_data',
        PERSONAL_DATA_IB_PLUS: servicesURI + '/prlm-mbm/rs/v2/members/personal_data',
        IB_ZERO_CONTACT_DETAILS: servicesURI + '/pzmm-mbm/rs/v1/members/contact_details',
        RETRIEVE_IB_ZERO_ASSOCIATES: servicesURI + '/pzmm-mbm/rs/v1/members/associates',
        RETRIEVE_IB_ZERO_ASSOCIATE: servicesURI + '/pzmm-mbm/rs/v1/members/associates/{{associate-identifier}}',
        DELETE_IB_ZERO_ASSOCIATES: servicesURI + '/pzmm-mbm/rs/v1/members/associates/{{associate-identifier}}',
        ADD_IB_ZERO_ASSOCIATE: servicesURI + '/pzmm-mbm/rs/v1/members/associates',
        UPDATE_IB_ZERO_ASSOCIATE: servicesURI + '/pzmm-mbm/rs/v1/members/associates/{{associate-identifier}}',
        GET_AVATAR: servicesURI + '/cust-cust/rs/v1/avatar',
        GET_CREDIT_CARD: servicesURI + '/cust-cust/rs/v3/customer/credit_card',
        UPDATE_OR_DELETE_CREDIT_CARD: servicesURI + '/cust-cust/rs/v3/customer/credit_card/'
    },
    globalAuthorizationToken: globalAuthorizationToken,
    userType: {
        ffNumber: 'ffnumber',
        email: 'email'
    },
    modelError: {
        errorCode: '',
        data: {
            errors: [
                {
                    reason: '',
                    needsTranslate: true
                }
            ]
        }
    },
    PRLM_MBM_9001: {
        code: 'BUSINESS_VALIDATION_ERROR',
        childError: [
            'INVALID_INVITATION_ID',
            'INVITATION_NOT_FOUND ',
            'INVALID_DATE',
            'INVALID_PASSWORD_PATTERN',
            'CUSTOMER_AGE_INVALID',
            'EMAIL_ADDRESS_MISSING',
            'INVITATION_TOKEN_INVALID',
            'INVITATION_TOKEN_NOT_VALID_FOR CUSTOMER',
            'ADDRESS_OR_EMAIL_REQURIED',
            'ADDRESS_PREFERENCE_MISSING',
            'API_DATA_PROVIDED_FLAG_MISSING',
            'CUSTOMER_LOGIN_MISSING',
            'INVALID_DOCUMENT',
            'NAME AND ADDRESS VALIDATION BLOCKED',
            'ADDRESS_PREFERENCE_MISMATCH',
            'UNABLE_TO_PROCESS',
            'UNABLE_TO_PROCESS_REQUEST_CANCELLED',
            'UNABLE_TO_PROCESS_REQUEST_REJECTED',
            'INVALID_CUSTOMER_STATUS',
            'RESTRICTED_LAST_NAME',
            'DUPLICATE_ATTRIBUTE_CODE',
            'ADDRESS_VALIDATION_DISABLED',
            'PHONE_VALIDATION_DISABLED',
            'PROFANE_CHECKS_DISABLED',
            'CUSTOMER_NOT_FOUND',
            'INVALID_ACCOUNT_STATUS',
            'POSTAL_ADDRESS_VALIDATION_DISABLED',
            'TELECOM_ADDRESS_VALIDATION_DISABLED',
            'PROFANE_VALIDATION_DISABLED',
            'ADDRESS_OR_EMAIL_REQUIRED',
            'INVALID_POSTAL_ADDRESS',
            'INVALID_TELECOM_ADDRESS',
            'DOCUMENT_DETAILS_INCOMPLETE',
            'DATA_INVALID'
        ]
    },
    GPDR_URIS: {
        WINECLUB: 'BOWINEPRIVAC',
        BOB: 'DIGTRABOB'
    },
    PREB: 'preb.iberia.es'
};
try {
    angular.module('ib-commons-http-service-module').constant('CommonsHttpServicesConstants', CommonsHttpServicesConstants);
} catch {
    angular.module('ib-commons-http-service-module', []);
    angular.module('ib-commons-http-service-module').constant('CommonsHttpServicesConstants', CommonsHttpServicesConstants);
}
export type CommonsHttpServicesConstantsType = typeof CommonsHttpServicesConstants;
export { CommonsHttpServicesConstants };