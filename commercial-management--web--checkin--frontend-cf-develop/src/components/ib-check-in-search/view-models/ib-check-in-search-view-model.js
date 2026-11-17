(function () {
    'use strict';
    /**
     * Angular service to store the component model
     */
    angular
        .module('ib-check-in-search')
        .service('CheckInSearchModel', CheckInSearchModel);

    function CheckInSearchModel() {
        this.loginParameters;
        this.containsAd = false;
    }
})();