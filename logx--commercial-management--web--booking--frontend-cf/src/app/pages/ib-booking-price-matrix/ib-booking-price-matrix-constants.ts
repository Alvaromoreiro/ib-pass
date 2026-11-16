import angular from 'angular';

export const BookingPriceMatrixConstants = {
    daysAfterRibbon : 7,
    daysBeforeRibbon : 7,
    daysAfterCalendar : 3,
    daysBeforeCalendar : 3
};

angular.module('ib-booking-price-matrix-module').constant('BookingPriceMatrixConstants', BookingPriceMatrixConstants);



