(function () {
    'use strict';
    angular
        .module('ib-check-in-upgrade-module')
        .service('UpgradeModel', UpgradeModel);

    function UpgradeModel() {
        var self = this;
        self.totalPrice;
        self.totalPriceFormatted;
        self.totalPriceCombined;
        self.showTotal;
        self.showPriceCombinated;
        self.showOffersPopUp;
        self.initializeModel = initializeModel;
        ////////////////

        function initializeModel() {
            self.totalPrice = null;
            self.showPriceCombinated = false;
            self.totalPriceFormatted = null;
            self.totalPriceCombined = null;
            self.showTotal = false;
            self.showOffersPopUp = true;
        }
    }
})();