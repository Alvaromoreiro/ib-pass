(function () {
    'use strict';

    angular.module('ib-flight-now-module')
        .service('FlightNowModel', FlightNowModel);

    function FlightNowModel() {

        var self = this;
        self.flightInfo;
        self.selectedTab;
        self.initializeModel = initializeModel;

        function initializeModel() {
            self.flightInfo = {};
            self.selectedTab = 0;
        }
    }
})();