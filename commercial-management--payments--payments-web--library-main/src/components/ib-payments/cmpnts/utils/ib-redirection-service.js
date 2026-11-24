(function () {
    'use strict';

    angular.module('ib-pmt-utils-module')
        .factory('pmtRedirectionService', pmtRedirectionService);

    pmtRedirectionService.$inject = ['$window'];
    function pmtRedirectionService($window) {

        return {
            externalRedirect: externalRedirect,
            newNavigation: newNavigation
        };

        ////////////////
        function externalRedirect(path) {
            $window.location.href = path;
        }
        function newNavigation(url, type) {
            $window.open(url, type);
        }
    }
})();