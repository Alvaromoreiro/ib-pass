import angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);

const BookingRouterConstants = {
    templatesRoute: 'web-booking/templates/',
    availabilityViewRoute: 'ib-booking-availability-view.html',
    priceMatrixCtrlViewRoute: 'ib-booking-price-matrix-view.html',
    bookingPassengersInfoCtrlViewRoute: 'ib-booking-passenger-info-view.html',
    bookingPaymentsRoute: 'ib-pmt-view.html',
    bookingConfirmationRoute: 'ib-pmt-order-confirmation-view.html',
    bookingCommunicationLostRoute: 'ib-pmt-communication-lost-view.html',
    bookingRedirectionMarketRoute: 'ib-booking-redirection-market-view.html',
    bookingAlpRoute: 'ib-booking-alp-view.html',
    bookingBkErrorRoute: 'ib-booking-bk-error-view.html',
    bookingAncillariesRoute: 'ib-booking-ancillaries-view.html',
    bookingSeatsMapRoute: 'ib-booking-seats-map-view.html',
    viewCkiancRoute: 'ib-booking-ancillaries-view.html',
    shuttleCtrlViewRoute: 'ib-shuttle-view.html',
    modalTest: 'modal-test.html',
    modalAvios: 'ib-not-avaibility-view.html'

};
angular.module('ib-booking-routing-module', []).constant('BookingRouterConstants', BookingRouterConstants);
export type BookingRouterConstants = typeof BookingRouterConstants;

