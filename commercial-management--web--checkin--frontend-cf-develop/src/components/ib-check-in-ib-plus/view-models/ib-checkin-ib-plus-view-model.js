(function () {
    'use strict';
    angular
        .module('ib-checkin-ib-plus')
        .service('CheckinIbPlusModel', CheckinIbPlusModel);

    function CheckinIbPlusModel() {
        this.userBookings = [];
        this.finishProcess = false;
        this.isError = false;

        this.initializeModel = initializeModel;

        function initializeModel() {
            this.userBookings = [];
            this.finishProcess = false;
            this.isError = false;
        }
    }
})();