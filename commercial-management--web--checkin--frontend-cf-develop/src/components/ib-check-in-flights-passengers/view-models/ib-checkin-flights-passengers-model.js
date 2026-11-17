(function () {
    'use strict';
    angular
        .module('ib-checkin-flights-passengers-module')
        .service('FlightsPassengersModel', FlightsPassengersModel);

    function FlightsPassengersModel() {
        var self = this;
        self.conditions;
        self.segmentsPassengersInfo;
        self.pasForm;
        self.errorFF;
        self.initializeModel = initializeModel

        ////////////////

        function initializeModel() {
            self.conditions = false;
            self.segmentsPassengersInfo = [];
            self.pasForm = null;
            self.errorFF = {status: false, passengers: []};
        }

    }
})();
