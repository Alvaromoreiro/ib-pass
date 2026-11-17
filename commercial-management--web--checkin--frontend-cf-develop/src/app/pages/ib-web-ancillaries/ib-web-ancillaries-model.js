(function () {
    "use strict";

    angular.module("ib-checkin-ancillaries-module").service("AncillariesModel", AncillariesModel);

    AncillariesModel.$inject = [];
    function AncillariesModel() {
        this.ancillariesTrips = [];
        this.seatsAvailable;
        this.insuranceForm;
        this.baggageAvailable;
        this.selectedInsurance;
        this.baggagesQuanty;
        this.seatsQuanty;
        this.currency;
        this.infoHeader;
        this.isAllowed;
        this.isShowedModal;
        this.totalPayment;
        this.baggageAvailablePrice;
        this.showInsuranceBox;
        this.bobAvailable;
        this.bobInfo;
        this.speqsQuanty;

        this.initializeModel = function () {
            this.ancillariesTrips = [];
            this.totalPayment = 0;
            this.baggagesQuanty = null;
            this.seatsQuanty = null;
            this.seatsAvailable = true;
            this.baggageAvailable = true;
            this.currency = null;
            this.selectedInsurance = false;
            this.isAllowed = false;
            this.isShowedModal = false;
            this.baggageAvailablePrice = 0;
            this.showInsuranceBox = false;
            this.bobAvailable = false;
            this.bobInfo = {};
            this.speqsQuanty = 0;
        };
    }
})();
