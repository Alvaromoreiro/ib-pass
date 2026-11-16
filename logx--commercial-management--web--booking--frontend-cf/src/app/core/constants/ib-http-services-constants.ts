import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const servicesHost: string = envCopy.servicesHost;
const servicesURI: string = envCopy.services;
const authoritationURI: string = envCopy.auth;
const servicesCloudUri: string = envCopy.cloud;
const globalAuthorizationToken: string = envCopy.globalAuthorizationToken;
export const HttpServicesConstants = {
    TIME_WAIT: 2000,
    TIME_DELAY: 100,
    NUM_ATTEMPS: 3,
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
        NEW_PAYMENT_AVAILABLE: `${servicesURI}/pmt-ppm/rs/ppm/v7/config/new-payment-available/market/{{marketId}}/realm/{{realm}}`,
        PAYMENT_LOGOS: `${servicesURI}/pmt-ppm/rs/ppm/v7/payment-methods-info`,
        CHECK_VOUCHER_CODE_SERVICE: `${servicesURI}/sse-orm/rs/v2/order`,
        OTP_VALIDATE: '/otp/validate',
        GET_PMT_CONTEXT: `${servicesURI}/sse-orm/rs/v1/payment-context-id?flowId={flowId}`,
        GET_PMT_ISSUE: `${servicesURI}/sse-orm/rs/v1/payment-issue-info?flowId={flowId}&contextId={contextId}&status={status}&error={error}`,
        ORM_MODIFY_PARTNER: `${servicesURI}/sse-orm/rs/v1/order/{flowId}/discount/partner/{partnerId}`,
        cancelOnHoldOrderURI: servicesURI + '/sse-orm/rs/v2/mmb/',
        calculateOnHoldPointsURI: servicesURI + '/prlm-pc/rs/v1/points/flight-calculation',
        calculateAncillariesPointsURI: servicesURI + '/prlm-pc/rs/v1/points/ancillaries-calculation',
        calculateSummaryPointsURI: servicesURI + '/prlm-pc/rs/v1/points/summary-calculation',
        retrieveOrderURI: servicesURI + '/sse-orm/rs/v2/order/import',
        PAY_SUCCESS_ORM: servicesURI + '/sse-orm/rs/v1/payment-success',
        BKM_ITINERARY_OUTBOUND_SERVICE_URI: servicesHost + '/api/digitalweb/cloud/booking-manager/v1/offers/availability/itinerary',
        BKM_ITINERARY_RETURN_SERVICE_URI: servicesHost + '/api/digitalweb/cloud/booking-manager/v1/offers/availability/itinerary/{{responseId}}/{{offerId}}/{{sliceId}}'  
    },

    PARAMS:{
        checkVoucherCodeServiceParamsURI: '/{flowId}/voucher/{voucherCode}',
        checkPostVoucherCodeParamsURI: '/{orderId}/voucher/{voucherId}/otp/{otpSessionId}'
    },

    SALESFORCE_ENDPOINTS: {
        TRAVEL_PREFERENCES: servicesURI + '/cust-cust/rs/v1/travel_preferences',
        CONTACT_DETAILS_IBPLUS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        PERSONAL_DATA_IBPLUS: servicesURI + '/prlm-mbm/rs/v2/members/contact_details',
        DISCOUNTS_DATA_IBPLUS: servicesURI + '/cust-cust/rs/v1/discounts',
        MARKETING_PERMISSIONS: servicesURI + '/cust-cust/rs/v3/customer/marketing-permission'
    },
    WCS_URIS: {
        PHONES: '/cs/Satellite?pagename=IB_SE_Services&service=getContact'
    },
    DEFAULT_COMMERCIAL_MARKET: 'ES'
} as const;
export const HttpServicesErrorsConstants = {
    RETRIEVE_INVITATION: [
        {
            CODE: 'PRLM_IVM_9001',
            MESSAGE: 'BUSINESS_ERROR'
        },
        {
            CODE: 'PRLM_IVM_9002',
            MESSAGE: 'BAD_REQUEST_ERROR'
        },
        {
            CODE: 'PRLM_IVM_9003',
            MESSAGE: 'REQUEST_UNAUTHORIZED_ERROR'
        },
        {
            CODE: 'PRLM_IVM_9004',
            MESSAGE: 'ACCESS_FORBIDDEN_ERROR'
        },
        {
            CODE: 'PRLM_IVM_9005',
            MESSAGE: 'METHOD_NOT_SUPPORTED_ERROR'
        },
        {
            CODE: 'PRLM_IVM_9006',
            MESSAGE: 'CUSTOMER_MEMBER_ALREADY_INVITED'
        },
        {
            CODE: 'PRLM_IVM_9011',
            MESSAGE: 'ACCOUNT_INVALID_STATUS'
        },
        {
            CODE: 'PRLM_IVM_9012',
            MESSAGE: 'HH_CUS_IS_NOT_OWNER_OF_HH'
        },
        {
            CODE: 'PRLM_IVM_9013',
            MESSAGE: 'CUSTOMER_INVALID_STATUS'
        },
        {
            CODE: 'PRLM_IVM_9014',
            MESSAGE: 'CUS_INVITEE_LAST_NAME_VALIDATION_FAILED'
        },
        {
            CODE: 'PRLM_IVM_9015',
            MESSAGE: 'HH_CUS_ALREADY_IN_HOUSEHOLD'
        },
        {
            CODE: 'PRLM_IVM_9016',
            MESSAGE: 'HH_CUS_IS_NOT_ACTIVE'
        },
        {
            CODE: 'PRLM_IVM_9017',
            MESSAGE: 'HH_MIN_OWNER_AGE'
        },
        {
            CODE: 'PRLM_IVM_9018',
            MESSAGE: 'ACCOUNT_MAX_SIZE_EXCEEDED'
        },
        {
            CODE: 'PRLM_IVM_9019',
            MESSAGE: 'MAX_NUMBER_OF_HOUSEHOLD_MEMBERS_EXCEEDED'
        },
        {
            CODE: 'PRLM_IVM_9020',
            MESSAGE: 'MAX_NUMBER_OF_LINKED_CUSTOMERS_EXCEEDED'
        },
        {
            CODE: 'PRLM_IVM_1001',
            MESSAGE: 'UNEXPECTED_CLIENT_EXCEPTION'
        },
        {
            CODE: 'PRLM_IVM_1002',
            MESSAGE: 'UNEXPECTED_WEB_APPLICATION_EXCEPTION'
        },
        {
            CODE: 'PRLM_IVM_1003',
            MESSAGE: 'SERVER_ERROR_WHILE_CALLING_SERVICE'
        },
        {
            CODE: 'PRLM_IVM_1004',
            MESSAGE: 'UNEXPECTED_TECHNICAL_EXCEPTION'
        },
        {
            CODE: 'PRLM_IVM_1005',
            MESSAGE: 'SYSTEM_UNAVAILABLE_ERROR'
        },
        {
            CODE: 'USER_ALREADY_REGISTERED',
            MESSAGE: 'USER_IS_IBPLUS'
        }
    ],
    PRLM_MBM_9001: {
        code: 'BUSINESS_VALIDATION_ERROR',
        childError: [
            'INVALID_INVITATION_ID',
            'INVITATION_NOT_FOUND ',
            'INVALID_DATE',
            'NEW_LENGTH_NEW_PASSWORD_FIELD',
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
    CLAIM_AVIOS: {
        GENERAL_ERRORS: [
            'UNSCORED_AVIOS_ERROR_MANDATORY_DATA_MISSING',
            'UNSCORED_AVIOS_ERROR_DATA_INVALID',
            'UNSCORED_AVIOS_ERROR_INVALID_MEMBER_STATUS',
            'UNSCORED_AVIOS_ERROR_ENROLMENT_DATE_UNKNOWN',
            'UNSCORED_AVIOS_ERROR_MEMBER_DATA_VALIDATION_FAILED',
            'UNSCORED_AVIOS_ERROR_PAI_HUB_HTTP_CONNECTION_PROBLEM'
        ],
        DATA_INVALID: [
            'PNR_NUMBER_IS_INVALID',
            'FLIGHT_NO_IS_INVALID',
            'INVALID_TICKET',
            'INVALID_TICKET_PREFIX',
            'MISSING_CLAIM_DATA_OWN_FLIGHT',
            'MISSING_CLAIM_DATA_OTHERAIRLINE_FLIGHT',
            'MEMBER_DATA_VALIDATION_FAILED'
        ],
        LIMIT_EXCEEDED: [
            'CLAIM_LIMIT_EXCEEDED',
            'CLAIM_INVALID_ATTEMPT_EXCEEDED'
        ]
    }
};
try {
    const mod = angular.module('ib-http-services-module');

    mod.constant(
        'HttpServicesConstants', HttpServicesConstants
    );
    mod.constant(
        'HttpServicesErrorsConstants', HttpServicesErrorsConstants
    );
} catch (error) {
    const mod = angular.module('ib-http-services-module', ['ib-interceptors-module']);
    mod.constant(
        'HttpServicesConstants', HttpServicesConstants
    );
    mod.constant(
        'HttpServicesErrorsConstants', HttpServicesErrorsConstants
    );
}
