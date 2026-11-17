(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .service('UpdateFlightsPassengerInfoService', UpdateFlightsPassengerInfoService);

    UpdateFlightsPassengerInfoService.$inject = ['$rootScope', '$location', '$q', 'CheckinAppConstants', '$window', '$cookies', 'PassengerAdditionalInfoService', 'ModalService', 'localStorageService', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', '$filter', 'FlightsPassengersUtils', 'CallAcceptService', 'IbCNewsletterService', 'IbSessionConfigService', 'FlightsPassengersTransformer'];

    function UpdateFlightsPassengerInfoService ($rootScope, $location, $q, CheckinAppConstants, $window, $cookies, PassengerAdditionalInfoService, ModalService, localStorageService, CkiDatalayerUtilsService, CkiDatalayerConstants, $filter, FlightsPassengersUtils, CallAcceptService, IbCNewsletterService, IbSessionConfigService, FlightsPassengersTransformer) {

        const self = this;
        self.updateFlightsPassengerInfo = updateFlightsPassengerInfo;
        self.updateApisInformation = updateApisInformation;


        ////////////////

        function updateFlightsPassengerInfo (passengersInfo, segmentsInfo, printBoardingCard, activeFields, selectedSegment, isEarly) {
            const isUserLogged = IbSessionConfigService.isUserLogged();
            ModalService.isWaiting();
            const selectedSegmentContext = getSelectedSegmentContext(selectedSegment, printBoardingCard);

            const generalPassengersInfo = FlightsPassengersUtils.getPassengersUpdateInformation(passengersInfo, activeFields, selectedSegment);
            const generalSegmentsInfo = FlightsPassengersUtils.getSegmentsUpdateInformation(segmentsInfo, selectedSegment);
            saveGeneralInfoToStorage(generalPassengersInfo, generalSegmentsInfo);

            setDigitalData(generalSegmentsInfo);

            const flowContext = { generalPassengersInfo, isUserLogged, ...selectedSegmentContext, isEarly };
            updateNewsLetterInfo(generalPassengersInfo.newsLetterInfo.info, generalPassengersInfo.passengersApisIds.length > 0, flowContext);
        }

        function getSelectedSegmentContext (selectedSegment, printBoardingCard) {
            if (!selectedSegment) {
                return { nextStep: undefined, printBoardingCard };
            }

            const nextStep = selectedSegment.whatToDo.selectedBlock.nextStep;
            localStorageService.set('selectedBlockPa', selectedSegment);

            return {
                nextStep,
                printBoardingCard: nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.BOARDING_CARDS || printBoardingCard
            };
        }

        /**
         * Update the newesletter of passenger
         * @param {Array} newsLetterInfo List of passenger for updateNewsletter
         */
        function updateNewsLetterInfo (newsLetterInfo, isFlowApis, flowContext) {
            const emailSaved = {};

            if(!isFlowApis && !flowContext.isUserLogged) {
                for (let newsLetterIndex = 0; newsLetterIndex < newsLetterInfo.length; newsLetterIndex++) {
                    const infoToSave = newsLetterInfo[newsLetterIndex];
                    if (!emailSaved.hasOwnProperty(infoToSave.email)) {
                        IbCNewsletterService.putNewsletter(infoToSave).catch(() => { });
                        emailSaved[infoToSave.email] = true;
                    }
                }
            }

            updateGeneralContactData(isFlowApis, flowContext);
        }

        function updateGeneralContactData (isFlowApis, flowContext) {
            const generalPassengersInfo = flowContext.generalPassengersInfo;
            if (generalPassengersInfo.additionalInfo.needsUpdate) {
                updateAdditionalInfo(generalPassengersInfo.additionalInfo, isFlowApis).then((data) => {
                    localStorageService.set('disruptionContactApis', generalPassengersInfo.additionalInfo.info);
                    updateEmergencyInfo(generalPassengersInfo.emergencyInfo, isFlowApis, flowContext);
                }, angular.noop);
            } else {
                updateEmergencyInfo(generalPassengersInfo.emergencyInfo, false, flowContext);
            }
        }

        /**
         * Send contact data of passenger to service
         * @param {Obj} additionalInfo Information of passenger for send to service
         * @param {boolean} isFlowApis is flow APIS
         */
        function updateAdditionalInfo (additionalInfo, isFlowApis = false) {
            const defer = $q.defer();
            const updateAdditionalInfoError = (error) => {
                const isCheckFFError = error?.errorCode === 409 && error?.internalErrorCode === 'CHECK_FREQUENT_FLYER';
                if (isCheckFFError) {
                    defer.reject();
                    ModalService.isNotWaiting();
                    $rootScope.$broadcast('validateFrequentFlyerEvent', error);
                } else if (additionalInfo.isMandatory) {
                    defer.reject();
                    serviceError(error);
                } else { defer.resolve(); }

            };
            const dataTransformer = getTransformUpdateAdditionalInfo(additionalInfo.info, isFlowApis);

            if (isFlowApis && dataTransformer.length === 0) {
                updateAdditionalInfoSuccess(defer);
                return defer.promise;
            }

            PassengerAdditionalInfoService.updateAdditionalInfo(dataTransformer).then((data) => updateAdditionalInfoSuccess(defer), updateAdditionalInfoError);
            return defer.promise;
        }

        /**
         * Send emergency information to service
         * @param {Obj} emergencyInfo Information of passengers for send to service
         */
        function updateEmergencyInfo (emergencyInfo, isFlowApis = false, flowContext) {
            const acceptCall = () => checkAcceptCall(flowContext);
            if (!isFlowApis && emergencyInfo.needsUpdate) {
                PassengerAdditionalInfoService.updateEmergencyInfo(emergencyInfo.info).then(acceptCall, (error) => {
                    if (emergencyInfo.isMandatory) {
                        serviceError(error);
                    } else {
                        acceptCall();
                    }
                });
            } else {
                acceptCall();
            }
        }

        function checkAcceptCall (flowContext) {
            if (isCallAcceptServiceRequired(flowContext.generalPassengersInfo, flowContext.nextStep)) {
                CallAcceptService.callAccept(flowContext.generalPassengersInfo.regularPassengersIds, flowContext.printBoardingCard, flowContext.nextStep, flowContext.isEarly);
            } else {
                continueToNextView(flowContext.generalPassengersInfo, flowContext.nextStep);
            }
        }

        function isCallAcceptServiceRequired (generalPassengersInfo, nextStep) {
            const excludedSteps = [
                CheckinAppConstants.SHUTTLE_NEXT_STEPS.FLY_NOW,
                CheckinAppConstants.SHUTTLE_NEXT_STEPS.FLIGHT_PASSENGER,
                CheckinAppConstants.SHUTTLE_NEXT_STEPS.GDR
            ];

            return generalPassengersInfo.passengersApisIds.length === 0 && !excludedSteps.includes(nextStep);
        }

        function continueToNextView (generalPassengersInfo, nextStep) {
            if (generalPassengersInfo.passengersApisIds.length > 0) {
                $location.path('/ibcoac2');
            } else if (nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.FLY_NOW) {
                $location.path('/ibfnpa');
            } else if (nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.FLIGHT_PASSENGER) {
                $location.path('/ibcoac');
            } else if (nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.GDR) {
                $cookies.putObject(CheckinAppConstants.COOKIES.GDR_PA_INFO, {
                    flowId: localStorageService.get('flowId'),
                    fromStep: '/ibcoac'
                }, { path: '/' });
                $window.location.href = $filter('LinksFilter')('MANAGE_MY_BOOKING_LINK', CheckinAppConstants.lang) + '#!/chktrp?pnr=' + localStorageService.get('PNR') + '&surname=' + localStorageService.get('checkinSurname')
                    + '&segmentId=' + localStorageService.get('selectedBlockPa').id + '&isAirShuttle=true' + '&step=' + CheckinAppConstants.STEPS.GDR_CHANGE_FLIGHT;
            }
        }

        /**
         * Open modal for show error to user
         * @param {Obj} error Error returned of service
         */
        function serviceError (error) {
            ModalService.isNotWaiting();
            ModalService.showGenericError(error, true).result.then($location.path('/ibcose'), $location.path('/ibcose'));
        }


        /**
         * @function
         * @name updateApisInformation
         * @desc make calls to update IBCOACII information and continue to next step, upgrading (ckiancupp) o ancillaries (ckianc)
         */
        function updateApisInformation (passengers) {
            let regularPassengers = localStorageService.get('passengersNOAPIS') || [];
            passengers = passengers || [];
            regularPassengers = regularPassengers.concat(passengers);
            localStorageService.set('passengersSelected', regularPassengers);
            CallAcceptService.callAccept(regularPassengers, false, null);
        }

        function saveGeneralInfoToStorage (generalPassengersInfo, generalSegmentsInfo) {
            localStorageService.set('passengersAPIS', generalPassengersInfo.passengersApisIds);
            localStorageService.set('passengersNOAPIS', generalPassengersInfo.regularPassengersIds);
            localStorageService.set('passengersSelected', generalPassengersInfo.passengersSelected);

            localStorageService.set('availableSegments', generalSegmentsInfo.selectedSegmentsIds);
            localStorageService.set('summaryTripForUpg', generalSegmentsInfo.summaryTrip);
        }

        function setDigitalData (generalSegmentsInfo) {
            /* INIT DELETE GA4 MIGRATION*/
            const datalayerObject = {};
            datalayerObject[CkiDatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = generalSegmentsInfo.summaryTrip;
            datalayerObject[CkiDatalayerConstants.DATALAYER_INFO.APIS_FULFILLED] = CkiDatalayerConstants.DATALAYER_VALUES.NO;
            CkiDatalayerUtilsService.addDataLayerInfo(datalayerObject);
            /* FIN DELETE GA4 MIGRATION*/
            const extendedDigitalDataInfo = {};
            extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.ORIGIN_DESTINATIONS] = generalSegmentsInfo.summaryTrip;
            extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.APIS_COMPLETED] = CkiDatalayerConstants.DATALAYER_VALUES.NO;
            CkiDatalayerUtilsService.addDigitalDataInfo(extendedDigitalDataInfo);
        }

        function updateAdditionalInfoSuccess (defer) {
            defer.resolve();
        }

        function getTransformUpdateAdditionalInfo (additionalInfoData, isFlowApis) {
            const bookingInfo = localStorageService.get('bookingInfo');
            const isFreeType = bookingInfo?.outwardSegments?.[0]?.passengers?.[0]?.freeType;
            const dataTransformer = FlightsPassengersTransformer.updateAdditionalInfo(additionalInfoData, isFreeType, isFlowApis);

            return dataTransformer;
        }

    }
})();
