import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-bookings-list-module')
        .controller('BookingsListController', BookingsListController);

    BookingsListController.$inject = ['$rootScope', '$scope', 'BookingsListService', 'BookingsListModel', 'MmBModalService', 'BookingSearchService', 'MmBDatalayerUtilsService', 'localStorageService', 'MmBAppConstants', 'MmBUtilService', '$location', '$cookies', 'CommonsUserUtilsService', 'CommonsUtilService', 'LoadingSpinnerService'];
    function BookingsListController($rootScope, $scope, BookingsListService, BookingsListModel, MmBModalService, BookingSearchService, MmBDatalayerUtilsService, localStorageService, MmBAppConstants, MmBUtilService, $location, $cookies, CommonsUserUtilsService, CommonsUtilService, LoadingSpinnerService) {
        var vm = this;
        vm.model = BookingsListModel;

        $scope.$on('anonymousSubmit', BookingSearchService.searchFlightsPassengersEvent);
        $scope.$on('searchBookingItem', searchBookingItem);
        $scope.$on('openGenericModal', openGenericModal);
        activate();

        ////////////////

        function activate() {
            var customerData = localStorageService.get('customerData') || {};
            var errorCode = MmBUtilService.getParameterByName(MmBAppConstants.URL_PARAMETERS.ERROR_CODE);

            $rootScope.showMainHeader = true;
            vm.model.initializeModel();

            if (errorCode && MmBUtilService.getOldManageAppErrorMessage(errorCode)) {
                showModalError({
                    'message': MmBUtilService.getOldManageAppErrorMessage(errorCode), 'internalErrorCode': errorCode,
                    'errorCode': errorCode, 'needsTranslate': true
                });
            }

            if($cookies.get('userLogged') && !CommonsUserUtilsService.isSoftUser()) {
                BookingsListService.getBookingsList().then(function (transformedInfo) {
                    LoadingSpinnerService.hide();
                    vm.model.bookingList = transformedInfo.bookingList;
                    vm.model.homeURL = transformedInfo.homeURL;
                }, showModalError);
            } else {
                $location.path('/chktrp');
            }
            CommonsUtilService.setTitlePage('MMB_TITLE_LOGGED_SEARCH');
            /* INIT DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateLoggedDatalayer(customerData.generalInfo);
            /* FINISH DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateLoggedDigitalData(customerData.generalInfo);
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.LOGGED_SEARCH, MMBDatalayerConstants.DIGITAL_DATA_STEP.LOGGED_SEARCH, MmBAppConstants.QUADRIGAM.LOGGED_SEARCH);
        }

        /**
         * Opens the generic modal sent by the event
         * @param {Object} event the received event
         * @param {Object} data the event data
         */
        function openGenericModal(event, data) {
            MmBModalService.showGenericModal(data.isBlocked, data.template, { 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.WHERE_IS_PNR }).result.then(angular.noop, angular.noop);
        }

        /**
         * Makes the search of the selected booking of the list.
         * @param {Object} event the received event
         * @param {Object} data the event data
         */
        function searchBookingItem(event, data) {
            BookingSearchService.searchFlightsPassengersEvent(event, {
                'pnr': data.locator,
                'surname': data.surname
            });
        }

        /**
         * Opens a modal with the error received
         * @param {Object} error a weel formed object to show in the modal
         */
        function showModalError(error) {
            LoadingSpinnerService.hide();
            MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        }


    }
})();
