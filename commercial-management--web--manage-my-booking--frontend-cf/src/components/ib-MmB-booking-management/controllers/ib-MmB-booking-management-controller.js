import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
(function () {
    'use strict';

    angular
        .module('ib-MmB-booking-management-module')
        .controller('BookingManagementController', BookingManagementController);

    BookingManagementController.$inject = ['BookingManagementService', 'BookingManagementModel', 'MmBModalService', 'localStorageService', '$scope', '$location', 'MmBAppConstants', 'BookingManagementConstants', 'MmBDatalayerUtilsService', 'MmBUtilService', 'CommonsUtilService', 'LoadingSpinnerService'];
    function BookingManagementController (BookingManagementService, BookingManagementModel, MmBModalService, localStorageService, $scope, $location, MmBAppConstants, BookingManagementConstants, MmBDatalayerUtilsService, MmBUtilService, CommonsUtilService, LoadingSpinnerService) {
        const vm = this;
        const REMOVE_DAATALAYER_ATTRS = [
            MMBDatalayerConstants.DATALAYER_INFO.DEPARTURE_AIRPORT, MMBDatalayerConstants.DATALAYER_INFO.ARRIVAL_AIRPORT,
            MMBDatalayerConstants.DATALAYER_INFO.TOTAL_AVAILABILITY, MMBDatalayerConstants.DATALAYER_INFO.DEPARTURE_TIME
        ];
        vm.model = BookingManagementModel;


        $scope.$on('optionSelected', segmentOptionSelected);
        $scope.$on('showSegmentError', showSegmentError);
        $scope.$on('openFareConditionsModal', MmBUtilService.openFareFamilyConditionsModal);
        $scope.$on('modifyPassenger', modifyPassenger);
        $scope.$on('openSpecialPassengers', openSpecialPassengers);

        activate();

        ////////////////

        function activate () {
            LoadingSpinnerService.hide();
            const extendedDatalayerObject = {};
            let quadrigam = MmBAppConstants.QUADRIGAM.TRIP_DETAILS; 
            CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_AIR_SHUTTLE_RECOVERY');

            vm.model.initializeModel();
            extendedDatalayerObject[MMBDatalayerConstants.DATALAYER_INFO.IS_AIR_SHUTTLE] = MMBDatalayerConstants.DATALAYER_VALUES.YES;
            MmBDatalayerUtilsService.updateTripDetailsDatalayerObject(localStorageService.get('bookingInfo'));
            /* INIT DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.removeDatalayerObjects(REMOVE_DAATALAYER_ATTRS);
            /* FINISH DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.removeDigitalDataObjects(REMOVE_DAATALAYER_ATTRS);
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
            MmBModalService.showWaitingModal();

            BookingManagementService.getBookingInfo().then((bookingInfo) => {
                MmBModalService.finishWaiting();
                vm.model.bookingCode = bookingInfo.bookingCode;
                vm.model.segments = bookingInfo.segments;
                vm.model.passengers = bookingInfo.passengers;
                vm.model.optionalInformation = bookingInfo.optionalInformation;
                vm.model.hasSavedChangesSuccess = bookingInfo.hasSavedChangesSuccess;
                vm.model.showSpecialNeeds = bookingInfo.showSpecialNeeds;
                vm.model.haveSpecialPassenger = bookingInfo.haveSpecialPassenger;
                vm.model.showCopyOfTickets = bookingInfo.showCopyOfTickets;
            }, (error) => {
                MmBModalService.finishWaiting();
                MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            });


        }

        /**
         * Receives the info and try to go to next step dependin on segment info selected by the user
         * @param {Object} event the received event
         * @param {Object} eventInfo the event data
         */
        function segmentOptionSelected (event, eventInfo) {
            BookingManagementService.generateMinAndMaxSearchDate(vm.model.segments, eventInfo.segmentInfo);
            BookingManagementService.optionSelected(eventInfo, vm.model.passengers);
        }

        /**
         * Receives the info and shows a modal with the segment error information
         * @param {Object} event the received event
         * @param {Object} eventInfo the event data
         */
        function showSegmentError (event, eventInfo) {
            MmBModalService.showGenericError({
                errorCode: 'SEGMENT_ERROR_INFO',
                message: eventInfo.message,
                needsTranslate: eventInfo.needsTranslate,
                internalErrorCode: 'SEGMENT_ERROR_INFO',
                title: {
                    message: 'SEGMENT_ERROR_TITLE',
                    needsTranslate: true
                }
            }).result.then(angular.noop, angular.noop);
        }

        /**
         * Open the window to modify passengers
         * @param {*} event The received event
         * @param {Int} Index of selected passenger to open in pagepassenger info passenger
         * @param {Object} passenger Pasassenger object for check information
         *
         */
        function modifyPassenger (event, passenger, index) {
            if (index.passengerId === BookingManagementConstants.DATA_CONTACT.CONTACT) {
                localStorageService.set('selectedPassengerId', index);
                localStorageService.set('optionalInformation', vm.model.optionalInformation);
                $location.path(MmBAppConstants.PAGES_URL.PASSENGERS_INFO);
            } else {
                if ((passenger && passenger.optionalInformation.contactData) || passenger.optionalInformation.ffInfo) {
                    localStorageService.set('selectedPassengerId', index);
                    localStorageService.set('optionalInformation', vm.model.optionalInformation);
                    $location.path(MmBAppConstants.PAGES_URL.PASSENGERS_INFO);
                }
            }
        }

        /**
         * Open special passengers page
         */
        function openSpecialPassengers () {
            $location.path(MmBAppConstants.PAGES_URL.CHANGE_PASSENGERS_SPECIAL_NEEDS);
        }

    }
})();
