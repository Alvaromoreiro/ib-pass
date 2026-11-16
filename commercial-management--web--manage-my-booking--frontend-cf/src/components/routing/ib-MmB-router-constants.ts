import * as angular from 'angular';

export const MmBRouterConstants = {
    templatesRoute: 'web-manage-my-booking/templates/',
    searchViewRoute: 'ib-MmB-search-view.html',
    managementViewRoute: 'ib-MmB-booking-management-view.html',
    changeFlightViewRoute: 'ib-Mmb-change-flight-view.html',
    flightConfirmationViewRoute: 'ib-MmB-flight-confirmation-view.html',
    bookingsListViewRoute: 'ib-MmB-bookings-list-view.html',
    passengersInfoView: 'ib-MmB-passengers-info-view.html',
    orderCopyTicketsViewRoute: 'ib-order-tickets-copy.html',
    paymentsViewRoute: 'ib-pmt-view.html',
    paymentsConfirmMmbRoute: 'ib-pmt-mmb-confirmation-view.html',
    bookingDashboardViewRoute: 'ib-MmB-booking-dashboard-view.html',
    mmbInvoluntaryChangeViewRoute: 'ib-MmB-involuntary-change-view.html',
    ancillariesConfirmationView: 'ib-MmB-ancillaries-confirmation-view.html',
    confirmationMmbOrderViewRoute: 'ib-pmt-order-confirmation-view.html',
    mmbCommunicationLostViewRoute: 'ib-pmt-communication-lost-view.html',
    disruptionDashboardRoute: 'ib-disruption-main-view.html',
    disruptionRefundRoute: 'ib-disruption-refund-view.html',
    rebookErrorViewRoute: 'ib-Mmb-rebook-error-view.html',
    mmbDeepLinkFlow: 'ib-MmB-booking-deep-link-view.html',
    mmbPaymentTemplate: '<ib-mmb-payment-page></ib-mmb-payment-page>',
    mmbConfirmationTemplate: '<ib-mmb-confirmation-page></ib-mmb-confirmation-page>',
    mmbSearchNewTemplate: '<ib-mmb-search-new></ib-mmb-search-new>',
    mmbTripListTemplate: '<ib-mmb-trip-list></ib-mmb-trip-list>',
    ancillariesRoute: 'ib-MmB-ancillaries-page.html',
    PAGES_URL: {
        'SEARCH': '/chktrp',
        'SEARCHNEW': '/chktrpnew',
        'TRIP_LIST': '/mytrpsnew',
        'BOOKING_MANAGE': '/ibmtdt',
        'CHANGE_FLIGHT': '/tcadvs',
        'FLIGHT_CONFIRMATION': '/tcfrev',
        'BOOKINGS_LIST': '/mytrps',
        'PASSENGERS_INFO': '/moinfo',
        'PAYMENTS': '/ohinfo',
        'MMB_PAYMENTS_CONFIRM': '/confirmation-mmb',
        'NEW_MMB_PAYMENTS_CONFIRM': '/new-confirmation-mmb',
        'MMB_CONFIRMATION_ORDER': '/confirmation',
        'MMB_COMMUNICATION_LOST': '/ibbker',
        'MMB_DASHBOARD': '/ibdash',
        'MMB_ANCILLARIES_CONFIRMATION': '/confanc',
        'MMB_INVOLUNTARY_CHANGE': '/ibinvchange',
        'DISRUPTION_DASHBOARD': '/disrptn',
        'DISRUPTION_REFUND':'/disrfn',
        'REBOOK_ERROR': '/rbkerr',
        'MMB_PAYMENT': '/ohinfonew',
        'ANCILLARIES': '/ibcmtv'
    }
};
try {
    const mod = angular.module('ib-MmB-routing-module');

    mod.constant(
        'MmBRouterConstants', MmBRouterConstants
    );
} catch (error) {
    const mod = angular.module('ib-MmB-routing-module', []);
    mod.constant(
        'MmBRouterConstants', MmBRouterConstants
    );
}
