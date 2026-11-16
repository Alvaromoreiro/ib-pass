import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-involuntary-change-module')
        .controller('MmBInvoluntaryChangeController', MmBInvoluntaryChangeController);

    MmBInvoluntaryChangeController.$inject = ['$scope', 'BookingDashboardService', 'BookingDashboardModel', 'MmBModalService', 'localStorageService', '$window', '$rootScope', '$translate', '$location', 'MmbInvoluntaryChangeService', 'BookingSearchService', 'MmBAppConstants', 'MmBUtilsSharedService'];

    function MmBInvoluntaryChangeController($scope, BookingDashboardService, BookingDashboardModel, MmBModalService, localStorageService, $window, $rootScope, $translate, $location, MmbInvoluntaryChangeService, BookingSearchService, MmBAppConstants, MmBUtilsSharedService) {
        var vm = this;

        vm.model = BookingDashboardModel;
        vm.flightsAffected = [];
        vm.contactPhone = '';
        vm.isCancel = false;
        vm.isChange = true;
        vm.showAcceptChange = false;
        vm.message = '';
        vm.isPackageProduct = false;
        $rootScope.isPackageProductRoot = false;
        vm.openFareWindowModal = openFareWindowModal;
        $scope.$on('openFareModal', openFareWindowModal);
        activate();
        function activate() {
            vm.model.initializeModel();
            vm.originalOrder = {};
            vm.phonesList = localStorageService.get('phonesList');
            vm.phonesListIBV = localStorageService.get('phonesListIBV');
            vm.phoneNumber = vm.phonesListIBV.ATTBAH.prefix + ' ' + vm.phonesListIBV.ATTBAH.telephone;
            if (vm.phonesList && vm.phonesList.RESERVAS) {
                getWcsSalesPhoneSuccess(vm.phonesList.RESERVAS);
            }
            $translate.onReady().then(function () {
                BookingDashboardService.initializeDashboard().then(function (modelIntialized) {
                    var quadrigam = '';
                    angular.extend(vm.model, modelIntialized.model);
                    vm.originalOrder = localStorageService.get('bookingInfo');

                    if (hasChangesPending(vm.originalOrder.order.status)) {
                        vm.showAcceptChange = true;
                    }

                    if (hasChangesPending(vm.originalOrder.order.status)) {
                        quadrigam = MmBAppConstants.QUADRIGAM.CHANGED_HOURS_INV;
                        vm.isChange = true;
                        vm.isCancel = false;
                        MmBUtilsSharedService.updateQuadrigam(quadrigam, MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]);
                    } else if (vm.originalOrder.order.status === 'CANCELATION_CHANGES' || vm.originalOrder.order.status === 'WAITLIST_CONFIRMED_CHANGES' || vm.originalOrder.order.status === 'UNCONFIRMED_CHANGES') {
                        quadrigam = MmBAppConstants.QUADRIGAM.CANCEL_FLIGHT_INV;
                        vm.isChange = false;
                        vm.isCancel = true;
                        MmBUtilsSharedService.updateQuadrigam(quadrigam, MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]);
                    }

                    if (vm.originalOrder.warnings && vm.originalOrder.warnings.length > 0) {
                        vm.message = vm.originalOrder.warnings[0].description;
                    }

                    if (!MmbInvoluntaryChangeService.hasInvoluntaryChange(vm.originalOrder.order.status)) {
                        $location.path(MmBAppConstants.PAGES_URL.MMB_DASHBOARD);
                    }
                    if(vm.model.managementModel && vm.model.managementModel.orderItems &&
                        angular.isDefined(vm.model.managementModel.orderItems.packagedProduct)){
                        vm.isPackageProduct = true;
                        $rootScope.isPackageProductRoot = true;
                    }
                    MmBModalService.finishWaiting();
                }, function (error) {
                    MmBModalService.finishWaiting();
                    MmBModalService.showGenericError(error).result.then(()=>{
                        $window.location.href = $window.location.origin;
                    }, ()=>{
                        $window.location.href = $window.location.origin;
                    });
                });
            });
        }

        /**
         * Checks if the order has any status stablished as
         * accept_change_pending
         */
        function hasChangesPending(status) {
            return status === 'ACCEPT_CHANGES_PENDING' || status === 'ACCEPT_CHANGES_PENDING_DISRUPTION';
        }

        vm.submitChangesAccepted = function submitChangesAccepted() {
            MmBModalService.showWaitingModal();
            MmbInvoluntaryChangeService.submitChangesAccepted(vm.originalOrder.flowId).then(function (bookingData) {
                var bookingDataComplete = BookingSearchService.checkOrderInfo(bookingData);
                BookingSearchService.retrieveOrderComplete(bookingDataComplete, null);
            }, function (error) {
                error = {
                    message: error.message,
                    title: { 'message': 'ERROR_CODE_TITLE_500', 'needsTranslate': error.needsTranslate },
                    needsTranslate: error.needsTranslate
                };
                MmBModalService.finishWaiting();
                MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            });
        };

        function getWcsSalesPhoneSuccess(phoneData) {
            vm.contactPhone = phoneData.prefix + ' ' + phoneData.telephone;
        }

        /**
         * Open a modal window for show all conditions of rate selected
         * @param {Object} event Event
         * @param {Object} conditions All conditions of rate selected
         */
        function openFareWindowModal(event, selectedFareInfo) {
            angular.extend(selectedFareInfo, {
                'idModal': 'ib-compare-fares-modal'
            });
            MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', {
                'selectedFareInfo': selectedFareInfo
            }, 'ib-modals ib-modals--lg').result.then(angular.noop, angular.noop);
        }

    }
})();
