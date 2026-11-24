(function () {
    'use strict';
    angular
        .module('ib-check-in-confirmation-module')
        .service('CheckinConfirmationModel', checkinConfirmationModel);

    checkinConfirmationModel.$inject = [];
    function checkinConfirmationModel () {
        this.confirmInfo = [];
        this.rightPanelInfo;
        this.insuranceInfo;
        this.download;
        this.showAlternativeDownload;
        this.lang;
        this.isOpen;
        this.carbonFootprint;

        this.initializeModel = function () {
            this.confirmInfo = [];
            this.rightPanelInfo = [];
            this.insuranceInfo = null;
            this.download = {};
            this.showAlternativeDownload = false;
            this.lang;
            this.isOpen = false;
            this.carbonFootprint = { hasCarbonFootprint: false }
        };

    }
})();