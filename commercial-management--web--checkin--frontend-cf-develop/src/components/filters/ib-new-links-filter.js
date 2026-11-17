(function () {
    'use strict';

    angular
        .module('ib-filter-module')
        .filter('NewLinksFilter', NewLinksFilter);

    NewLinksFilter.$inject = ['CheckinAppConstants', '$window', 'localStorageService'];
    function NewLinksFilter(CheckinAppConstants, $window, localStorageService) {
        getLink.$stateful = true;//make a filter to be called in every angular digest cicle
        return getLink;

        ////////////////
        function getLink(id) {
            var linksList = localStorageService.get('linksList') || {};
            var generalLinksList = localStorageService.get('generalLinksList') || {};
            var link = linksList[id] ? linksList[id] : generalLinksList[id] ? generalLinksList[id] : { 'uri': '/' + id };
            return (link.needsOrigin ? $window.location.origin : '') + (link.needsMarket ? ('/' + CheckinAppConstants.market.toLowerCase()) : '') + link.uri;
        }
    }
})();
