(function () {
    'use strict';
    angular
        .module('ib-boarding-cards-module')
        .service('BoardingsCardsModel', BoardingsCardsModel);

    function BoardingsCardsModel() {
        var self = this;
        self.boardingInfo;
        self.initializeModel = initializeModel;
        self.infoHeader
        ////////////////

        function initializeModel() {
            self.boardingInfo;
        }

    }
})();