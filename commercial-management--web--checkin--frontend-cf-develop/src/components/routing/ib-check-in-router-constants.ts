const checkinRouterConstants = {
    templatesRoute: 'web-checkin/templates/',
    viewIbcoseRoute: 'ib-check-in-search.html',
    viewIbcoacRoute: 'ib-checkin-flights-passengers-view.html',
    viewIbcose2Route: 'ib-checkin-ib-plus.html',
    viewIbcoac2Route: 'ib-checkin-apis.html',
    viewCkiancRoute: 'ib-checkin-ancillaries-view.html',
    viewCkianpurc: 'ib-pmt-view.html',
    viewIbecbp: 'ib-boarding-cards.html',
    viewCkiancupp: 'ib-check-in-upgrade-view.html',
    viewIbfnpaRoute: 'ib-flight-now.html',
    viewIbfncopaRoute: 'ib-fly-now-confirmation-pa.html',
    viewIbdesRoute:'ib-checkin-flights-des-invoice-view.html',
    viewIbbioboaRoute: 'ib-checkin-biometric-boarding-view.html',
    viewConfirmationRoute: 'ib-check-in-confirmation.html',
    QUADRIGAM: {
        SEARCH: '/ibcose',
        LOGGED_SEARCH: '/ibcose2',
        FLIGHTS_PASSENGERS: '/ibcoac',
        APIS_PASSENGERS: '/ibcoac2',
        FLY_NOW: '/ibfnpa',
        FLIGHT_CONFIRMATION: '/ibfncopa',
        UPGRADE: '/ckiancupp',
        ANCILLARIES: '/ckianc',
        PAYMENTS: '/ibpurc',
        BOARDING_CARDS: '/ibecbp',
        CKI_CONFIRMATION: '/ibcocf-and-ibeccf',
        UN_SEARCH: '/uncose',
        UN_RECOVERY: '/uncoac',
        BIOMETRIC: '/ckbio',
        SEAT_SUMMARY: '/ckiacpt',
        LOADING: '/loading'
    }
};
angular.module('ib-check-in-app').constant('CheckinRouterConstants', checkinRouterConstants);

type CheckinRouterConstants = typeof checkinRouterConstants;
