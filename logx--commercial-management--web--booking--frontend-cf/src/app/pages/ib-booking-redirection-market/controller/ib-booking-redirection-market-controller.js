import {DatalayerConstants} from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
(function () {


    angular
        .module('ib-booking-redirection-market-module')
        .controller('BookingRedirectionMarketController', BookingRedirectionMarketController)
        .component('ibBookingRedirectionMarket', {
            controller: 'BookingRedirectionMarketController',
            controllerAs: 'redMarktCtrl',
            bindings: {},
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-redirection-market-view.html';
            }]
        });

    BookingRedirectionMarketController.$inject = ['BookingRedirectionMarketModel', '$window', '$rootScope', '$timeout', 'DatalayerUtilsService', 'BookingUtilService', 'BookingAppConstants', 'localStorageService', 'BookingRedirectionService', 'BookingModalService', 'MonetateUtilsService', 'MonetateConstants', 'CommonsLanguageAndMarketService','$filter', 'DigitalDataUtilsService'];
    function BookingRedirectionMarketController (BookingRedirectionMarketModel, $window, $rootScope, $timeout, DatalayerUtilsService, BookingUtilService, BookingAppConstants, localStorageService, BookingRedirectionService, BookingModalService, MonetateUtilsService, MonetateConstants, CommonsLanguageAndMarketService, $filter, DigitalDataUtilsService) {
        const vm = this;
        vm.model = BookingRedirectionMarketModel;
        vm.reloadNewMarket = reloadNewMarket;
        vm.returnHomePage = returnHomePage;
        activate();

        ////////////////

        function activate () {

            const confirmationDigitalInfo = localStorageService.get('confirmationDigitalInfo') || {};
            vm.model.initializeModel();
            vm.newMarketInfo = localStorageService.get('newMarketInfo') || {};
            DigitalDataUtilsService.updateDigitalDataWithQuadrigam(BookingAppConstants.QUADRIGAMS.REDIRECTION_MARKET, confirmationDigitalInfo);
            DatalayerUtilsService.updateDatalayerViewEvent();
            MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, BookingAppConstants.QUADRIGAMS.REDIRECTION_MARKET);
            $timeout(() => {
                $rootScope.$broadcast('sendUpdateToMonetate');
            });
            BookingModalService.finishWaiting();
        }

        function reloadNewMarket () {
            let localObject;
            let urlParams = location.search, newUrl;
            urlParams = urlParams.replace(/(PointOfSaleCountry=)[^\&]+/, '$1' + vm.newMarketInfo.newBookingMarket);
            urlParams = urlParams.replace(/(market=)[^\&]+/, '$1' + vm.newMarketInfo.newBookingMarket);
            urlParams = urlParams.replace(/(bookingMarket=)[^\&]+/, '$1' + vm.newMarketInfo.newBookingMarket);
            if (BookingAppConstants.availableMarkets.indexOf(vm.newMarketInfo.newBookingMarket.toLowerCase()) !== -1) {
                newUrl = $window.location.origin + $window.location.pathname + urlParams;
            } else {
                localObject = CommonsLanguageAndMarketService.init();
                BookingAppConstants.lang = localObject.language;
                BookingAppConstants.market = localObject.market;
                newUrl = $filter('LinksFilter')('IB_SEARCH_ENGINE') + urlParams;
            }
            BookingRedirectionService.externalRedirect(newUrl);
        }

        function returnHomePage () {
            BookingRedirectionService.externalRedirect($window.location.origin);
        }

    }
})();
