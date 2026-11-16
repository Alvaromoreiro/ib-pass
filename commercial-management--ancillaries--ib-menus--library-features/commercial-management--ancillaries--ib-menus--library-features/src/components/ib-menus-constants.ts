import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);


const serviceURI = envCopy.services || '';
const service_cloud = envCopy.cloud || '';
const authoritationURI = envCopy.auth || '';
const globalAuthorizationToken = envCopy.globalAuthorizationToken;

const MenusConstants = {
    CONDITION_TYPES: {
        HAND_BAGGAGE: 'EQMANO',
        CHECKED_BAGGAGE: 'EQBODEGA',
        SEAT: 'ASIENTO',
        CHANGE: 'CAMBIO',
        REFUND: 'REEMBOLSO',
        FOOD: 'COMIDA'
    },
    ORDER_ITEMS_TYPES: {
        FLIGHT: 'flight'
    },
    PAYMENT_ORDER_ITEMS_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER'
    },
    ANCILLARIES_PAGES_HASH: {
        BOOKING: '/ibcmtv',
        CHECKIN: '/ckianc',
        MMB: '/ibdash'
    },
    ANCILLARIES_TYPE: {
        BAGGAGE: 'BAGGAGES'
    },
    ENDPOINTS: {
        footerIconsURI: serviceURI + '/pmt-ppm/rs/ppm/v7/payment-methods-info'
    },
    REALM: {
        BBKI: 'Booking',
        BBKIOH: 'Booking',
        PAOB: 'Booking',
        PAOBONB: 'Booking',
        PARE: 'REDEMPTION',
        PAREONB: 'REDEMPTION',
        SUBSCRIPTIONMODELS: 'SUBSCRIPTION',
        GIFTCARDS: 'GIFTCARD',
        MMB: 'ManageMyBooking',
        MMBOH: 'ManageMyBooking',
        MMBANC: 'ManageMyBooking',
        MMBVC: 'ManageMyBooking',
        MMBBID: 'ManageMyBooking',
        MMBUNIF: 'ManageMyBooking',
        CKI: 'Checkin'

    },
    SUBREALM: {
        MMBOH: 'ONHOLD_CONFIRMATION',
        MMBANC: 'ANCILLARIES_PURCHASE',
        MMBVC: 'FLIGHT_CHANGE',
        MMBBID: 'UPGRADING_BID',
        MMBUNIF: 'DISRUPTION_UNIFIED',
        PAOB: 'SHUTTLE',
        PAOBONB: 'SHUTTLE',
        PARE: 'SHUTTLE',
        PAREONB: 'SHUTTLE'

    },
    PAYMENT_QUADRIGAMS: {
        ibpurc: 'ibpurc',
        mtpurc: 'mtpurc',
        hmpurc: 'hmpurc',
        papurc: 'papurc',
        rpapurc: 'rpapurc',
        cipippurc: 'cipippurc',
        ciprpapurc: 'ciprpapurc',
        cippapurc: 'cippapurc',
        ippurc: 'ippurc',
        onhold: 'onhold',
        atcpurc: 'atcpurc',
        mopurc: 'mopurc',
        supurc: 'supurc',
        ohinf: 'ohinf',
        ibckipurc: 'ibckipurc',
        repurc: 'repurc',
        plpurc: 'plpurc'
    },
    AVAILABLE_METHODS_PRIORITY: {
        'AX': 1,
        'DC': 2,
        'JCB': 3,
        'PAYPAL': 4,
        'VI': 5,
        'CA': 6,
        'GOOGLE-PAY': 7,
        'APPLE-PAY': 8,
        'SOFORT': 9,
        'IDEAL': 10,
        'EL': 11,
        'TP': 12,
        'BIZUM': 13,
        'UP': 14,
        'MERCADO_PAGO': 15
    },
    AVAILABLE_SECURES_PRIORITY: {
        'AX': 2,
        'CA': 1,
        'VI': 3
    }
    
};
try {
    angular.module('ib-web-menus-constants-module').constant('MenusConstants', MenusConstants);
} catch {
    angular.module('ib-web-menus-constants-module', []);
    angular.module('ib-web-menus-constants-module').constant('MenusConstants', MenusConstants);
}
export { MenusConstants };

