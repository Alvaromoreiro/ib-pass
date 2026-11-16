(function () {
    'use strict';

    angular
        .module('ib-MmB-flight-confirmation-module')
        .service('FlightConfirmationModel', FlightConfirmationModel);

    function FlightConfirmationModel() {
        var self = this;
        self.selectedSegmentDetails = null;
        self.oldSegmentInfo = null;
        self.newSegmentInfo = null;
        self.initializeModel = initializeModel;

        ////////////////

        function initializeModel() {
            self.selectedSegmentDetails = null;
            self.oldSegmentInfo = null;
            self.newSegmentInfo = null;
        }
    }
})();
