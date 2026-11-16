(function () {
    'use strict';

    angular
        .module('ib-anonymous-search-module')
        .service('AnonymousSearchModel', AnonymousSearchModel);

    function AnonymousSearchModel() {
        
        this.surname = '';
        this.pnr = '';
        this.isAirShuttle = false;
    }
})();