angular
    .module('ib-booking-filters-module')
    .filter('LinksFilter', LinksFilter);

LinksFilter.$inject = ['BookingAppConstants', '$window', 'localStorageService'];
function LinksFilter (BookingAppConstants, $window, localStorageService) {
    getLink.$stateful = true;//make a filter to be called in every angular digest cicle
    return getLink;

    ////////////////
    function getLink (id) {
        const linksList = localStorageService.get('linksList') || {};
        const generalLinksList = localStorageService.get('generalLinksList') || {};
        const link = linksList[id] ? linksList[id] : generalLinksList[id] ? generalLinksList[id] : { uri: '/' + id };
        return (link.needsOrigin ? $window.location.origin : '') + (link.needsMarket ? ('/' + BookingAppConstants.market.toLowerCase()) : '') + link.uri;
    }
}
