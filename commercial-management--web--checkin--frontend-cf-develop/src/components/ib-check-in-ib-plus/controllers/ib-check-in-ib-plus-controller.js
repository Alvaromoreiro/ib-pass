(function () {
    'use strict';

    angular
        .module('ib-checkin-ib-plus')
        .controller('CheckInIbPlusController', CheckInIbPlusController);

    CheckInIbPlusController.$inject = ['$rootScope', 'ModalService', 'CheckInIbPlusService', 'CheckinIbPlusModel', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', 'SearchFlightsPassengersService', '$location', '$timeout', 'localStorageService', 'CheckinAppConstants', '$scope', 'MonetateUtilsService', 'MonetateConstants', 'CkiCommonsGetLoginInfoService', 'CommonsUserUtilsService', 'CkiDataLayerService', 'IbSessionConfigService', 'IbUtilsService'];
    function CheckInIbPlusController ($rootScope, ModalService, CheckInIbPlusService, CheckinIbPlusModel, CkiDatalayerUtilsService, CkiDatalayerConstants, SearchFlightsPassengersService, $location, $timeout, localStorageService, CheckinAppConstants, $scope, MonetateUtilsService, MonetateConstants, CkiCommonsGetLoginInfoService, CommonsUserUtilsService, CkiDataLayerService, IbSessionConfigService, IbUtilsService) {

        const vm = this;
        vm.model = CheckinIbPlusModel;
        vm.searchBooking = searchBooking;
        vm.goInitialPage = goInitialPage;

        $scope.$on('anonymousSubmit', (event, data) => {
            searchBooking(data.surname, data.pnr);
        });

        $scope.$on('openGenericModal',
            (event, size, tpl, anim) => {
                openGenericModal(size, tpl, anim);
            });

        activate();

        ////////////////

        function activate () {
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.LOGGED_SEARCH, 2100);
            ModalService.isWaiting();
            CkiDatalayerUtilsService.resetDatalayer();
            CkiCommonsGetLoginInfoService.checkCustomerStatus().then(
                (data) => {
                    if (data && !CommonsUserUtilsService.isSoftUser()) {
                        CheckinIbPlusModel.initializeModel();
                        $rootScope.showMainHeader = true;
                        $rootScope.$broadcast('initializeGreyBar');
                        $timeout(() => {
                            const customerData = localStorageService.get('customerData') || {};
                            /* INIT DELETE GA4 MIGRATION*/
                            CkiDatalayerUtilsService.updateLoggedDatalayer(customerData.generalInfo);
                            CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                            /* FIN DELETE GA4 MIGRATION*/
                            CkiDatalayerUtilsService.updateDatalayerInfo(CheckinAppConstants.QUADRIGAM.LOGGED_SEARCH);
                            CkiDatalayerUtilsService.updateLoggedDigitalData(customerData.generalInfo);
                            CkiDatalayerUtilsService.updateDatalayerInitType(CkiDatalayerConstants.DATALAYER_VALUES.INIT_IB_PLUS);
                            CkiDataLayerService.setProcessAndStep(CheckinAppConstants.QUADRIGAM.LOGGED_SEARCH);
                            CkiDatalayerUtilsService.updateDatalayerViewEvent();

                            MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, CheckinAppConstants.QUADRIGAM.LOGGED_SEARCH);
                            $rootScope.$broadcast('updateDatalayer');
                            $rootScope.$broadcast('sendUpdateToMonetate');
                        });
                        if (CommonsUserUtilsService.isIbZero()) {
                            $timeout(() => {
                                vm.model.finishProcess = true;
                                ModalService.closeAllCurrentModals();
                            });
                        } else {
                            CheckInIbPlusService.searchUserLoggedBookings().then(
                                (data) => {
                                    IbSessionConfigService.initStorage();
                                    vm.model.userBookings = data.data || [];
                                    vm.model.finishProcess = true;
                                    vm.model.isError = data.isError || false;
                                    ModalService.finishWaiting();
                                }
                            );
                        }
                    } else {
                        ModalService.finishWaiting();
                        goInitialPage();
                    }
                },
                () => {
                    ModalService.finishWaiting();
                    goInitialPage();
                });
        }

        function searchBooking (surname, locator) {
            const cleanedLocator = IbUtilsService.cleanSpaces(locator);
            localStorageService.set('confirmationPNR', false);
            IbSessionConfigService.setPNR(cleanedLocator);
            localStorageService.set('checkinSurname', IbUtilsService.cleanSpaces(surname));
            SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname(IbUtilsService.cleanSpaces(surname), cleanedLocator, false);
        }

        /**
         * Load initial page
         */
        function goInitialPage () {
            $location.path('/ibcose');
        }

        /**
         * @function
         * @name openGenericModal
         * @desc opens a modal in the current view
         */

        function openGenericModal (size, tpl, anim) {
            ModalService.openGenericModal(size, tpl, anim, { idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.CHECKIN_ONLINE_MORE_INFO }).result.then(angular.noop, angular.noop);
        }
    }
})();
