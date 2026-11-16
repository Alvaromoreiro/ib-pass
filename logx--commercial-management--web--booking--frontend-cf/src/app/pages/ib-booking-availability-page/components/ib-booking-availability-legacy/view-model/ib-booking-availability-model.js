(function () {


    angular
        .module('ib-booking-availability-module')
        .service('BookingAvailabilityModel', BookingAvailabilityModel);

    function BookingAvailabilityModel () {

        const self = this;
        self.initializeModel = initializeModel;
        self.availabilityData = {};
        self.selectedSlices = [];
        self.currentOriginDestinationIndex = 0;
        ////////////////////////////

        /**
         * Initialize the availability model service with the default attributes values
         */
        function initializeModel () {
            self.availabilityData = {};
            self.selectedSlices = [];
            self.currentOriginDestinationIndex = 0;
            self.isLogged;
        }

    }
})();