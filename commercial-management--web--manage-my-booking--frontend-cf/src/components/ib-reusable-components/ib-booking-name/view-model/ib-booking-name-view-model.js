(function () {
    'use strict';

    angular
        .module('ib-booking-name')
        .service('BookingNameModel', BookingNameModel);

    function BookingNameModel() {
        this.name = '';
    }
})();