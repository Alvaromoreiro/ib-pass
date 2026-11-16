import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-flexibilization-availability-module')
        .controller('IbFlexAvailabilityController', IbFlexAvailabilityController);

    IbFlexAvailabilityController.$inject = ['$scope', '$rootScope', 'MmBAppConstants', 'IbFlexAvailabilityService', 'MmBModalService', '$timeout', 'IbFlexibilizationService', 'MmBDatalayerUtilsService', 'localStorageService', '$filter', '$location', 'CommonsUtilService', 'DisruptionUtilService', 'MmBUtilsSharedService'];
    function IbFlexAvailabilityController($scope, $rootScope, MmBAppConstants, IbFlexAvailabilityService, MmBModalService, $timeout, IbFlexibilizationService, MmBDatalayerUtilsService, localStorageService, $filter, $location, CommonsUtilService, DisruptionUtilService, MmBUtilsSharedService) {
        var vm = this;
        vm.$onInit = activate;
        vm.submitConfirm = submitConfirm;
        vm.optionSelected = optionSelected;
        vm.showWarningPanel = false;

        $scope.$on('optionSelected', optionSelected);
        $scope.$on('confirmChange', submitConfirm);
        $scope.$on('newDateSalected', availabilityCall);
        $scope.$on('nextDatesSearch', ribbonCall);

        function activate() {
            var bookingInfo = localStorageService.get('bookingInfo'), typeFlowDisruption = localStorageService.get('typeDisruptionFlow') || null;
            if (bookingInfo && bookingInfo.order && bookingInfo.order.slices.length === 1) {
                vm.quadrigam = typeFlowDisruption ? DisruptionUtilService.quadrigamByTypeFlow(typeFlowDisruption, false) : $rootScope.isDisruptionFlow ? MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY : MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_ONE_WAY;
                if (vm.quadrigam === MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_ONE_WAY) {
                    CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_AVAILABILITY_ONE_WAY');
                }
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[vm.quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[vm.quadrigam], vm.quadrigam);
            } else if (bookingInfo && bookingInfo.order && bookingInfo.order.slices.length === 2) {
                if (bookingInfo.order.slices.length === vm.availabilityData.availabilityDataResponse.availabilities.length) {
                    localStorageService.set('optionalFlight', true);
                    vm.quadrigam = typeFlowDisruption ? DisruptionUtilService.quadrigamByTypeFlow(typeFlowDisruption, true) : $rootScope.isDisruptionFlow ? MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN : MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_RETURN;
                } else {
                    vm.quadrigam = typeFlowDisruption ? DisruptionUtilService.quadrigamByTypeFlow(typeFlowDisruption, false) : $rootScope.isDisruptionFlow ? MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE : MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE;
                    if (vm.quadrigam === MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE) CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE');
                }
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[vm.quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[vm.quadrigam], vm.quadrigam);
            }
            MmBModalService.showWaitingModal();
            vm.model = {};
            vm.model = IbFlexAvailabilityService.availabilityInit(vm.availabilityData, vm.newSisterCitiesModel);
            //CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_FLEXIBILIZATION_SELECT_NEW_FLIGHTS');
            $timeout(function () {
                MmBModalService.finishWaiting();
            });
            checkWarningNotIberiaOperated();
        };

        function submitConfirm() {
            var errorObject = {};
            var currentBookingInfo = localStorageService.get('bookingInfo');
            var quadrigam;
            MmBModalService.showWaitingModal();
            IbFlexibilizationService.rebook(vm.model.flowId, vm.model.selectedSlices, currentBookingInfo.order.slices).then(function (confirmationData) {
                MmBModalService.finishWaiting();
                if (confirmationData.hasPartialError) {
                    //PARTIAL ERRORS
                    errorObject.title = {
                        'needsTranslate': true,
                        'message': 'MMB_FLEXIBILIZATION_CONFIRMATION_PARTIAL_MODAL_TITLE'
                    };
                    errorObject.needsTranslate = true;
                    errorObject.message = 'MMB_FLEXIBILIZATION_CONFIRMATION_PARTIAL_MODAL_DESCRIPTION';

                    MmBModalService.showGenericModal(false, 'generic-error-modal-title-large.html', errorObject).result.then(function () {
                        $scope.$emit('nextStep', confirmationData);
                        localStorageService.remove('bookingInfo');
                    }, function () {
                        $scope.$emit('nextStep', confirmationData);
                        localStorageService.remove('bookingInfo');
                    });
                } else {
                    localStorageService.set('orderChangeRelatedKey', confirmationData.relatedContent);
                    $scope.$emit('nextStep', confirmationData);
                    localStorageService.remove('bookingInfo');
                }
            }, function (error) {
                var callCenterNumber, phonesList = localStorageService.get('phonesList');
                var channel = localStorageService.get('pnrChannel');

                if (phonesList && phonesList.RESERVAS) {
                    callCenterNumber = phonesList.RESERVAS.prefix + ' ' + phonesList.RESERVAS.telephone;
                };
                if ($rootScope.isDisruptionFlow) {
                    quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_REBOOK_SERVICE_ERROR;
                } else {
                    if (error?.errorCode === 400) {
                        quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_REBOOK_SERVICE_ERROR;
                    } else {
                        quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_REBOOK_ERROR;
                    }

                }
                MmBUtilsSharedService.updateQuadrigam(quadrigam, MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]);
                MmBModalService.finishWaiting();
                error.title = {
                    'needsTranslate': true,
                    'message': error.internalErrorCode === 'SSE_MMB_1004' || error.internalErrorCode === 'SSE_MMB_1003' ? 'MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE_DATE' : 'MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE'
                };
                if (error.internalErrorCode === 'SSE_MMB_1004' || error.internalErrorCode === 'SSE_MMB_1003') {
                    error.message = error.message.replace(new RegExp('{{(.+?)}}'), callCenterNumber ? callCenterNumber : '');
                }

                switch (error.internalErrorCode) {
                    case 'SSE_MMB_1000':
                        error.title = {
                            'needsTranslate': true,
                            'message': 'MMB_DISRUPTION_REBOOK_ERROR_TITLE_1007'
                        };
                        error.needsTranslate = true;
                        error.message = $filter('translate')('MMB_DISRUPTION_REBOOK_ERROR_MESSAGE_1007') + ' ' + callCenterNumber + '.';
                        error.messageBold = $filter('translate')('MMB_DISRUPTION_REBOOK_ERROR_SUB_TITLE_1007');
                        MmBModalService.showGenericError(error, true, 'rebook-error-modal.html').result.then(closeModal($scope.$emit('childRebookUpdate')), closeModal($scope.$emit('childRebookUpdate')));
                        break;
                    case 'SSE_MMB_1007':
                        error.contactPhone = callCenterNumber;
                        $location.path(MmBAppConstants.PAGES_URL.REBOOK_ERROR);
                        MmBModalService.closeAllCurrentModals();
                        //MmBModalService.showFullModal(false, 'ib-modal-flexibilization-block.html', error).result.then(angular.noop, angular.noop);
                        break;
                    case 'SSE_MMB_1010':
                        if (MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT.includes(channel)) {
                            error.message = $filter('translate')('MMB_DISRUPTION_CALLCENTER_CONTACT_MSG_V2', {phoneNumber: callCenterNumber});
                            error.title =  $filter('translate')(error.title.message);
                            MmBModalService.showGenericError(error).result.then(goToMainPage, goToMainPage);
                        } else if (MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_INDIRECT.includes(channel)){
                            error.message = $filter('translate')('MMB_DISRUPTION_AGENCY_CONTACT_MSG');
                            error.title =  $filter('translate')(error.title.message);
                            MmBModalService.showGenericError(error).result.then(MmBModalService.closeAllCurrentModals, MmBModalService.closeAllCurrentModals);
                        }
                        break;
                    default:
                        error.title =  $filter('translate')(error.title.message);
                        MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                        break;
                }
            });

            function goToMainPage() {
                $location.path('/chktrp');
                MmBModalService.closeAllCurrentModals();
            }

            function closeModal(actionBeforeClose){
                if(actionBeforeClose && actionBeforeClose instanceof Function){
                    actionBeforeClose;
                }
                $scope.$emit('closeEntireModal');
            }
        }

        function optionSelected(event) {
            var i, totalSelected = 0;
            $timeout(function () {
                for (i = 0; i < vm.model.tripsLength; i++) {
                    if (vm.model.selectedSlices[i]) {
                        totalSelected++;
                    }
                }
                if (totalSelected === vm.model.tripsLength) {
                    vm.model.totalShow = true;
                }
                if (vm.model.selectedSlices[vm.model.listSlicesShow + 1]) {
                    vm.modal.listSlicesShow++;
                }
                vm.model.listSlicesShow++;
            });
        };

        /**
         * This function is launched when user select other day in ribbon. And call a new availability.
         * @event {nextDatesSearch}
         *
         *  */
        function availabilityCall(event) {
            $timeout(function () {
                MmBModalService.showWaitingModal();
                vm.model.showAvailability = false;
                IbFlexAvailabilityService.callAvailabilityNewDate(vm.model.flowId, vm.model.selectedDate, vm.newSisterCitiesModel).then(availabilityCallSuccess, availabilityCallError);
            });
            function availabilityCallSuccess(data) {
                var auxUpdatedDateList = vm.model.updatedDateList;
                vm.model = IbFlexAvailabilityService.availabilityInit(data, vm.newSisterCitiesModel);
                vm.model.updatedDateList = auxUpdatedDateList;
                $scope.$broadcast('availabilityChanged', vm.model.ribbonFlexData);
                $timeout(function () {
                    MmBModalService.finishWaiting();
                });
            }
            function availabilityCallError(error) {
                var isModalError = false;
                MmBModalService.finishWaiting();
                vm.model.showAvailability = true;

                if ($rootScope.isDisruptionFlow) {
                    if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                        MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.CIFERB, MMBDatalayerConstants.DIGITAL_DATA_STEP.CIFERB);
                    } else if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                        MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.CIFERR, MMBDatalayerConstants.DIGITAL_DATA_STEP.CIFERR);
                    } else {
                        MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.CIFERD,MMBDatalayerConstants.DIGITAL_DATA_STEP.CIFERD);
                    };
                } else {
                    if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                        CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR');
                        MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.CVFERB,MMBDatalayerConstants.DIGITAL_DATA_STEP.CVFERB, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR);
                    } else if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                        MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.CVFERR,MMBDatalayerConstants.DIGITAL_DATA_STEP.CVFERR, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_NOT_AVAILABILITY);
                    } else {
                        MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.CVFERD,MMBDatalayerConstants.DIGITAL_DATA_STEP.CVFERD, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR);
                    };
                }
                error.title = {
                    'needsTranslate': true,
                    'message': 'MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE'
                };
                error.needsTranslate = true;
                if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                    error.title.message = 'MMB_VC_AVAILABILITY_REDEMPTION_NO_RESULTS_TITLE';
                    error.message = 'MMB_VC_AVAILABILITY_REDEMPTION_NO_RESULTS_BODY';
                    vm.model.showErrorPage.isError = true;
                } else if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                    error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_ERROR_DATE';
                    isModalError = true;
                } else if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18007') {
                    error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_ERROR_ONE_SLICE';
                    isModalError = true;
                } else {
                    error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH';
                    isModalError = true;
                }
                if (vm.model.showErrorPage.isError && !isModalError) {
                    vm.model.showErrorPage['errorData'] = error;
                    $scope.$broadcast('availabilityChanged', error.errorCode);
                } else {
                    MmBModalService.showGenericError(error).result.then(modalErrorClose, modalErrorClose);
                }
                function modalErrorClose() {
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[vm.quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[vm.quadrigam], vm.quadrigam);
                    $scope.$broadcast('availabilityChanged', false);
                }
            }
        };

        /**
         * This function is launched when user select the next days in ribbon. This functions call to ribbon service
         * and return all data about new days availables.
         * @event {nextDatesSearch}
         *
         *  */
        function ribbonCall(event, isNext, dateTosearch, index) {
            var newSelectedDate = angular.copy(vm.model.selectedDate);
            newSelectedDate[index] = dateTosearch;
            IbFlexAvailabilityService.callRibbonMoreDates(vm.model.flowId, newSelectedDate, vm.newSisterCitiesModel).then(function (responseData) {
                $scope.$broadcast('ribbonFlexDataUpdate', responseData, isNext);
            }, function (error) {
                $scope.$broadcast('ribbonFlexDataUpdate', null, isNext);
            });
        };

        function checkWarningNotIberiaOperated(){
            var availabilityData;
            availabilityData = localStorageService.get('availabilityFlexData');
            if(availabilityData && availabilityData.parsedRelatedContent && availabilityData.parsedRelatedContent['FLIGHTS_NOT_OPERATED_BY_GROUP_IBERIA']){
                vm.showWarningPanel = true;
                vm.warningMessage = availabilityData.parsedRelatedContent['FLIGHTS_NOT_OPERATED_BY_GROUP_IBERIA'];
            }
        }

    }
})();
