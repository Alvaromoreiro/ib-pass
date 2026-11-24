(function () {
    'use strict';
    angular
        .module('ib-pmt-subscription-models-confirmation-module')
        .service('SubscriptionModelsConfirmationModel', SubscriptionModelsConfirmationModel);

    function SubscriptionModelsConfirmationModel() {
        this.paymentData = {};
        this.subscriptionModels = {};
    }
})();