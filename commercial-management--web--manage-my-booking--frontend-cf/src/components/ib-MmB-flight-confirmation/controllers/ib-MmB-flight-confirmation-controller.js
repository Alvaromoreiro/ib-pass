import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-flight-confirmation-module')
        .controller('FlightConfirmationController', FlightConfirmationController);

    FlightConfirmationController.$inject = ['FlightConfirmationModel', 'FlightConfirmationService', 'MmBAppConstants', '$location', 'MmBModalService', 'localStorageService', '$scope', 'FlightConfirmationTransformer', 'MmBUtilService', 'MmBUtilsSharedService'];
    function FlightConfirmationController(FlightConfirmationModel, FlightConfirmationService, MmBAppConstants, $location, MmBModalService, localStorageService, $scope, FlightConfirmationTransformer, MmBUtilService, MmBUtilsSharedService) {
        var vm = this;
        vm.model = FlightConfirmationModel;

        vm.backAvailability = backAvailability;
        vm.changeFlightOrder = changeFlightOrder;
        $scope.$on('openFareConditionsModal', MmBUtilService.openFareFamilyConditionsModal);

        activate();

        ////////////////

        function activate() {
            vm.model.initializeModel();
            FlightConfirmationService.getConfirmationInfo().then(function (confirmationInfo) {
                var extendedDatalayerInfo = {};
                var quadrigam = MmBAppConstants.QUADRIGAM.FLIGHT_CONFIRMATION;
                MmBModalService.finishWaiting();
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.DEPARTURE_TIME] = confirmationInfo.newSegmentInfo.departureDate.dateTime;
                MmBUtilsSharedService.updateQuadrigam(quadrigam);
                vm.model.selectedSegmentDetails = confirmationInfo.selectedSegmentDetails;
                vm.model.oldSegmentInfo = confirmationInfo.oldSegmentInfo;
                vm.model.newSegmentInfo = confirmationInfo.newSegmentInfo;
            }, function (error) {
                MmBModalService.finishWaiting();
                MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            });
        }

        /**
         * go to change flight page showing first a confirmation modal
         */
        function backAvailability() {
            MmBModalService.showGenericModal(true, 'ib-flight-confirmation-back-modal.html', { 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.BACK_MAIN_HEADER_MODAL }).result.then(function () {
                $location.path(MmBAppConstants.PAGES_URL.BOOKING_MANAGE);
            }, angular.noop);
        }

        /**
         * Changes the selected flight by the user in the pnr. If everything goes well, redirects to IBCOAC
         */
        function changeFlightOrder() {
            if (FlightConfirmationTransformer.posibleDeleteSegments()) {
                MmBModalService.showGenericModal(true, 'ib-flight-confirmation-posible-delete-segments-modal.html', { 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.POSIBLE_DELETE_SEGMENT }).result.then(function () {
                    callChangeFlightOrder();
                }, function () {
                    $location.path(MmBAppConstants.PAGES_URL.SEARCH).search('pnr', localStorageService.get('PNR')).search('surname', localStorageService.get('checkinSurname'));
                });
            } else {
                callChangeFlightOrder();
            }
            function callChangeFlightOrder() {
                MmBModalService.showWaitingModal();
                FlightConfirmationService.confirmChangeFlight().then(function (data) {
                    MmBModalService.finishWaiting();
                    if (FlightConfirmationTransformer.areDeletedSegments(data)) {
                        MmBModalService.showGenericModal(true, 'ib-flight-confirmation-deleted-segments-modal.html',
                            { 'message': 'FLIGHT_CONFIRMATION_DELETED_SEGMENTS_BACK_MODAL_DESCRIPTION_OK', 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.POSIBLE_DELETE_SEGMENT }).result.then(function () {
                            saveChanges(true);
                        }, angular.noop);
                    } else {
                        saveChanges(true);
                    }
                }, function (error) {
                    MmBModalService.finishWaiting();
                    if (error.errorCode === 409) {
                        MmBModalService.showGenericModal(true, 'ib-flight-confirmation-deleted-segments-modal.html',
                            { 'message': 'FLIGHT_CONFIRMATION_DELETED_SEGMENTS_BACK_MODAL_DESCRIPTION_ERROR', 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.POSIBLE_DELETE_SEGMENT }).result.then(function () {
                            saveChanges(false);
                        }, angular.noop);
                    } else {
                        MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                    }
                });
                function saveChanges(status) {
                    localStorageService.set('savedChangeSuccess', status);
                    $location.path(MmBAppConstants.PAGES_URL.SEARCH).search('pnr', localStorageService.get('PNR')).search('surname', localStorageService.get('checkinSurname'));
                }
            }
        }
    }
})();
