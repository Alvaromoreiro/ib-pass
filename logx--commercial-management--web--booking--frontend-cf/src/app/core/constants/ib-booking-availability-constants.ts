import angular from 'angular';
import { BookingAppConstants } from './ib-booking-constants';

export const BookingAvailabilityConstants = {
    SLICK_STATUS: {
        LOADING: 'LOADING',
        NOT_AVAILABLE: 'NOT_AVAILABLE',
        AVAILABLE: 'AVAILABLE',
        DISABLED: 'DISABLED',
        UPPER_END_RIBBON_WARN: 'UPPER_END_RIBBON_WARN',
        LOWER_END_RIBBON_WARN: 'LOWER_END_RIBBON_WARN',
        UPPER_END_RIBBON_DISABLED: 'UPPER_END_RIBBON_DISABLED',
        LOWER_END_RIBBON_DISABLED: 'LOWER_END_RIBBON_DISABLED'
    },
    CARROUSEL_FLIGHT_SELECTED: {
        OUTBOUND_FLIGHT: 0,
        RETURN_FLIGHT: 1
    },
    DAYS_AFTER: 3,
    DAYS_BEFORE: 3,
    ONE_DAY_MILISECONDS: 1000 * 60 * 60 * 24,
    SPECIAL_NEEDS_REQUEST: 'DISA',
    ON_BUSINESS: 'ON_BUSINESS',
    CORPORATE: 'CORPORATE',
    ODM:'ODM',
    RELATED_CONTENT: {
        TOTAL_PRICE: 'TOTAL_PRICE',
        OBSERVATIONS: 'OBSERVATIONS',
        FARE_CONDITIONS: 'FARE_CONDITIONS',
        CONFIRM_ONHOLD_CONDITIONS: 'CONFIRM_ONHOLD_CONDITIONS'
    },
    FAREFAMILY_CONDITIONS: [
        'CABINA',
        'EQMANO',
        'EQBODEGA',
        'ASIENTO',
        'ASIENTOXL',
        'CAMBIO',
        'REEMBOLSO',
        'CHECKINDESK',
        'SALAVIP',
        'FASTTRACK',
        'EMBARQUE',
        'EQPPRIOR',
        'AVIO',
        'COMIDA',
        'WIFI'
    ],
    SLICE_OFFERS_BY_FAREFAMILIES_SELECTED_CABINS:{
        bestPriceDiscountShown: '',
        bestCabinsPrice: false,
        bestPriceShown: '',
        cabinDescription: '',
        cabinAvailable: false,
        isCabinCompatible: false,
        fareFamilies: [],
        bestPrice: 0,
        bestPriceDiscount: 0
    },
    PASSENGER_ID:{
        ADT: 'ADT',
        CHD: 'CHD',
        INF: 'INF',
        BNN: 'BNN',
        YTH: 'YTH'
    },
    LASTMINUTE_FLIGHT_MODAL_MINS: 120,

    FARE_FAMILY_ICON_PROPERTY_CODE: {
        'EQMANO': 'icon-e_equipaje',
        'EQMANO10': 'icon-e_equipaje',
        'EQMANO14': 'icon-e_equipaje',
        'EQPERSONAL': 'icon-equipaje-de-mano-mochila',
        'EQBODEGA': 'icon-e_equipaje_facturado',
        'ASIENTO': 'icon-asiento-normal',
        'ASIENTO24H': 'icon-asiento-normal',
        'ASIENTOXL': 'icon-asiento-plus',
        'ASIENTODELANTERO': 'icon-asiento-delantero',
        'ASIENTOPREFERENTE': 'icon-asiento-plus',
        'CAMBIO': 'icon-cambios_y_reembolsos',
        'REEMBOLSO': 'icon-reembolsos',
        'CHECKINDESK': 'icon-check_in',
        'SALAVIP': 'icon-sala_vip',
        'FASTTRACK': 'icon-fast_track',
        'EMBARQUE': 'icon-priority-boarding',
        'EQPPRIOR': 'icon-e_facturacion_prioritaria',
        'COMIDA': 'icon-c_comidas_nuevas',
        'WIFI': 'icon-wifi',
        'CABINA': 'icon-navegador_avion',
        'AVIO': 'icon-avios',
        'TARJEMBANTIC': 'icon-tarjeta_de_embarque',
        'CODECAMBIO': 'CAMBIO',
        'CODENOCAMBIO': 'CA_CAMBIOS PERMITIDOS_NO_SHOW_NO PERMITIDO',
        'AEROPUERTO': 'icon-canary-plus',
        'AVIOSPLUS': 'icon-avios',
        'PUNTUALIDAD': 'icon-utilizacion_avios',
        'FASTLANE': 'icon-fast_track'

    },
    AVAILABILITY_FARE_CONSTANTS : {
        'R': BookingAppConstants.CABIN_TYPES.ECONOMY,
        'N': BookingAppConstants.CABIN_TYPES.PREMIUM_TOURIST,
        'B': BookingAppConstants.CABIN_TYPES.BUSINESS,
        'DEFAULT': BookingAppConstants.CABIN_TYPES.ECONOMY
    }
};
try {
    angular.module('ib-booking-availability-module').constant('BookingAvailabilityConstants', BookingAvailabilityConstants);
}catch (exception) {
    angular.module('ib-booking-availability-module', [
        'ib-booking-fare-details-module',
        'ib-booking-fare-details-simple-module',
        'ib-booking-availability-trip-module',
        'ib-booking-metasearch-passengers-module',
        'ib-booking-recalculate-price-module',
        'ib-booking-fare-rates-avios-module',
        'ib-booking-promotions-module',
        'ib-booking-redemption-coupons-module',
        'ib-booking-local-discount-selector-module',
        'ib-booking-upselling-fare-module',
        'ib-booking-ancillaries-offers-module'
    ]).constant('BookingAvailabilityConstants', BookingAvailabilityConstants);
}

