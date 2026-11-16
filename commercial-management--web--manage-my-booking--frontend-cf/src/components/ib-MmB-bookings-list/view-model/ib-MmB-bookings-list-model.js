(function () {
    'use strict';

    angular
        .module('ib-MmB-bookings-list-module')
        .service('BookingsListModel', BookingsListModel);

    function BookingsListModel() {
        var self = this;
        self.bookingList = null;
        self.homeURL = null;
        self.initializeModel = initializeModel;

        ////////////////

        function initializeModel() {
            self.bookingList = null;
            self.homeURL = null;
        }
    }
})();
