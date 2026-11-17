import dayjs from 'dayjs';

(function () {
    'use strict';
    /**
     * @Controller
     * @name FlightsPassengerController
     * @desc Controller for IBCOAC view
     */
    angular
        .module('ib-fly-now-confirmation-module')
        .controller('FlyNowConfirmationPAController', FlyNowConfirmationPAController);

    FlyNowConfirmationPAController.$inject = ['$rootScope', '$scope', '$timeout', '$location', 'ModalService', 'FlyNowConfirmationPAService', 'FlyNowCoPAModel', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', 'IbSessionConfigService', 'CheckinAppConstants', 'localStorageService', 'MonetateUtilsService', 'MonetateConstants', 'CkiDataLayerService'];
    function FlyNowConfirmationPAController ($rootScope, $scope, $timeout, $location, ModalService, FlyNowConfirmationPAService, FlyNowCoPAModel, CkiDatalayerUtilsService, CkiDatalayerConstants, IbSessionConfigService, CheckinAppConstants, localStorageService, MonetateUtilsService, MonetateConstants, CkiDataLayerService) {
        const vm = this;
        vm.model = FlyNowCoPAModel;
        vm.backAvailability = backAvailability;
        vm.changeFlightOrder = changeFlightOrder;

        $scope.$on('openFareConditionsModal', openFareConditionsModal);

        activate();


        ///////////////////////

        function activate () {
            vm.model.initializeModel();
            vm.model.infoHeader = $rootScope.headerModel;
            FlyNowConfirmationPAService.getFlyNowConfirmationInfo().then((flyNowConfirmationInfo) => {
                ModalService.isNotWaiting();
                vm.model.segmentInfo = flyNowConfirmationInfo.segmentInfo;
                vm.model.oldSegmentInfo = flyNowConfirmationInfo.oldSegmentInfo;
                vm.model.newSegmentInfo = flyNowConfirmationInfo.newSegmentInfo;

                $timeout(() => {
                    const departureTime = flyNowConfirmationInfo.newSegmentInfo.departureHour;
                    const bookingClass = flyNowConfirmationInfo.newSegmentInfo.cabinClass &&
                        flyNowConfirmationInfo.newSegmentInfo.cabinClass.type ? flyNowConfirmationInfo.newSegmentInfo.cabinClass.type.charAt(0) : '';
                    /* INIT DELETE GA4 MIGRATION*/
                    const extendedDatalayerInfo = {};
                    extendedDatalayerInfo[CkiDatalayerConstants.DATALAYER_INFO.DEPARTURE_TIME] = departureTime;
                    extendedDatalayerInfo[CkiDatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = bookingClass;
                    CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(CheckinAppConstants.QUADRIGAM.FLIGHT_CONFIRMATION, extendedDatalayerInfo, IbSessionConfigService.isUserLogged());
                    CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                    /* FIN DELETE GA4 MIGRATION*/
                    const quadrigam = CheckinAppConstants.QUADRIGAM.FLIGHT_CONFIRMATION;
                    const extendedDigitalDataInfo = {};
                    extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.BOOKING_CLASS] = bookingClass;
                    CkiDataLayerService.setProcessAndStep(quadrigam);
                    CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(CheckinAppConstants.QUADRIGAM.FLIGHT_CONFIRMATION, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
                    CkiDatalayerUtilsService.updateDatalayerViewEvent();

                    MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, CheckinAppConstants.QUADRIGAM.FLIGHT_CONFIRMATION);
                    $rootScope.$broadcast('updateDatalayer');
                    $rootScope.$broadcast('sendUpdateToMonetate');
                    $rootScope.timeSession.startTime = dayjs();
                });
            }, (error) => {
                ModalService.isNotWaiting();
                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);
                ModalService.isError(error);
            });
        }


        /**
          * go to change fly now showing first a confirmation modal
          */
        function backAvailability () {
            ModalService.openGenericModal(true, 'ib-fly-now-confirmation-back-modal', true, { idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.BACK_MODAL }).result.then(() => {
                $location.path('/ibcoac');
            }, angular.noop);
        }

        /**
         * Changes the selected flight by the user in the pnr. If everything goes well, redirects to IBCOAC
         */
        function changeFlightOrder () {
            FlyNowConfirmationPAService.confirmChangeFlight();
        }

        function openFareConditionsModal (event, fareFamily) {
            const modelFareFamily = localStorageService.get('fareFamilyConditions')[fareFamily] || {};
            angular.extend(modelFareFamily, { idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.FARE_CONDITIONS });
            ModalService.openGenericModal('md', 'ibfncopa-modal-rate-conditions', true, modelFareFamily);
        }
    }
})();
