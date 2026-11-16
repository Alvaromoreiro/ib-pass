(function () {
    'use strict';

    angular
        .module('ib-MmB-booking-management-module')
        .service('BookingManagementModel', BookingManagementModel);

    function BookingManagementModel() {
        var self = this;

        self.segments = [];
        self.passengers = null;
        self.optionalInformation = null;
        self.bookingCode = null;
        self.hasSavedChangesSuccess = false;
        self.showSpecialNeeds = null;
        self.haveSpecialPassenger = null;
        self.showCopyOfTickets = null;
        self.initializeModel = initializeModel;


        ///////////////////

        function initializeModel() {
            delete self.bookingCode;
            delete self.passengers;
            delete self.optionalInformation;
            self.segments = [];
            self.haveSpecialPassenger = false;
            self.hasSavedChangesSuccess = false;
            self.showSpecialNeeds = true;
            self.seatOptions = {};
        }
    }
})();
