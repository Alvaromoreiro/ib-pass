(function () {
    'use strict';

    angular
        .module('ib-MmB-passengers-info-module')
        .service('PassengersInfoModel', PassengersInfoModel);

    function PassengersInfoModel() {
        var self = this;
        self.passengersInfo = null;
        self.indexTab = null;
        self.companies = null;
        self.optionalInformation = null;
        self.initializeModel = initializeModel;

        ////////////////

        function initializeModel() {
            self.passengersInfo = null;
            self.optionalInformation = null;
            self.indexTab = null;
            self.companies = null;
        }

    }
})();
