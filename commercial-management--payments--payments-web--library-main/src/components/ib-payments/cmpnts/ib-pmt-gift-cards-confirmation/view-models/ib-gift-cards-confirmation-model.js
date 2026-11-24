(function () {
    'use strict';
    angular
        .module('ib-pmt-gift-cards-confirmation-module')
        .service('GiftCardsConfirmationModel', giftCardsConfirmationModel);

    function giftCardsConfirmationModel() {
        this.paymentData = {};
        this.giftCard = {};
    }
})();