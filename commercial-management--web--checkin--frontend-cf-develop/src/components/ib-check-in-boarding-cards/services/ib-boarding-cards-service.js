import angular from "angular";
import dayjs from "dayjs"

(function () {
    'use strict';

    angular
        .module('ib-boarding-cards-module')
        .factory('BoardingCardsService', BoardingCardsService);

    BoardingCardsService.$inject = ['$q', 'localStorageService', 'BoardingCardsTransformer', 'ModalService', 'CallBoardingCardsService',
        'GetPhoneCodesService', '$window', 'IbUtilsService', 'GetBiometricDataService', 'GetFlightInfoPassenger',
        'GetBiometricCardPassengerAssociationService', 'BiometricTransformer', 'CheckinAppConstants', '$location', '$cookies', '$rootScope', 'IbBoardingCardsModalService'];
    function BoardingCardsService ($q, localStorageService, BoardingCardsTransformer, ModalService, CallBoardingCardsService,
        GetPhoneCodesService, $window, IbUtilsService, GetBiometricDataService, GetFlightInfoPassenger,
        GetBiometricCardPassengerAssociationService, BiometricTransformer, CheckinAppConstants, $location, $cookies, $rootScope, IbBoardingCardsModalService) {
        const self = this;
        let boardingCardInfo;

        self.searchBoardingCardsInformation = searchBoardingCardsInformation;
        self.askForBoardingCards = askForBoardingCards;
        self.checkBiometricFlow = checkBiometricFlow;
        self.openGoogleWalletModal = openGoogleWalletModal;

        return self;

        ////////////////

        function searchBoardingCardsInformation (waitingModal) {
            const deferred = $q.defer();
            waitingModal && ModalService.isWaiting();
            CallBoardingCardsService.getBoardingCards().then(getBoardingCardsSuccess, getBoardingCardsError);

            return deferred.promise;

            function getBoardingCardsSuccess (data) {
                boardingCardInfo = data;
                GetPhoneCodesService.getPhoneCodesList().then(getPrefixesSuccess, () => {
                    getPrefixesSuccess(null);
                });
            }

            function getBoardingCardsError (error) {
                const errorsInhibit = [CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_AIRCHECK, CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_OTHER_CASE, CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_SEE_AGENT];
                const errorCode = [409, 400];
                let model = null;

                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);

                // case inhibit boarding card
                if ( errorCode.includes(error?.errorCode) && errorsInhibit.includes(error?.internalErrorCode)) {
                    model = BoardingCardsTransformer.transformInfoInhibitCards(error);
                    Object.assign(error, model);
                    localStorageService.set('inhibitionBC', true);
                    localStorageService.set('nextStepAllowed', false);
                } else {
                    ModalService.isError(error, null, null).result.then(startFlow, startFlow);
                }

                deferred.reject(error);
            }

            function startFlow () {
                const errorCarrierConnect = localStorageService.get('errorCarrierConnect');
                if (errorCarrierConnect !== null && !errorCarrierConnect) {
                    $window.location.href =
                        $window.location.origin +
                        $window.location.pathname +
                        IbUtilsService.removeParameterURL($window.location.search);
                }
            }

            function getPrefixesSuccess (prefixesInfo) {
                const transformedBoardingCardsInfo = BoardingCardsTransformer.transformBoardingCardsView(boardingCardInfo, localStorageService.get('passengersContactData'), prefixesInfo);
                localStorageService.set('noShowMessageBockBack', false);
                localStorageService.set('nextStepAllowed', true);
                deferred.resolve(transformedBoardingCardsInfo);
            }
        }

        function askForBoardingCards (boardingCardsModel, overrideModel) {
            const deferred = $q.defer();
            const updateBoardingInfo = BoardingCardsTransformer.createAskForBoardingCardsRequest(boardingCardsModel.boardingInfo, overrideModel);
            CallBoardingCardsService.updateBoardingCards(updateBoardingInfo).then(askForBoardingCardsSuccess, askForBoardingCardsError);

            return deferred.promise;

            function askForBoardingCardsSuccess (printedBoardingCardsData) {
                let model = {};
                const printBoardingCards = BoardingCardsTransformer.transformPrintedBoardingCards(printedBoardingCardsData, localStorageService.get('printBoardingCards') || []);
                const selectedChannels = BoardingCardsTransformer.getSelectedChannels(updateBoardingInfo[0].sharings);
                model = BoardingCardsTransformer.transformInfoInhibitCards();

                if($rootScope.timeSession) {
                    $rootScope.timeSession.startTime = dayjs()
                }
                Object.assign(selectedChannels, model);
                deferred.resolve(selectedChannels);
            }

            function askForBoardingCardsError (error) {
                if($rootScope.timeSession) {
                    $rootScope.timeSession.startTime = dayjs()
                }
                deferred.reject(error);
            }
        }

        function checkBiometricFlow (boardingCardsModel) {
            const deferred = $q.defer();
            let aggregatedModel;
            ModalService.isWaiting();
            // Paso intermedio para obtener el barcode content (se guarda en el LS desde el transformer)
            askForBoardingCards(boardingCardsModel).then(askForBoardingCardsSuccess, showErrorService);
            return deferred.promise;

            function askForBoardingCardsSuccess (data) {
                const passengersList = boardingCardsModel?.boardingInfo?.passengersList;
                const passengerStatusBySegment = boardingCardsModel?.boardingInfo?.passengersStatusBySegment;
                const existPassengersList = angular.isObject(passengersList) && passengersList.length > 0;
                const existAutomaticFFAvailable = existPassengersList ? checkPassengerStatusAutomaticFFAvailable(passengersList) : false;
                const existStatusBiometric = existPassengersList ? checkPassengerStatusBiometric(passengerStatusBySegment) : false;
                const existStatusBiometricAllComplete = existPassengersList ? checkPassengerStatusBiometricAllComplete(passengersList) : false;
                const showBiometricSummaryModule = checkPassengerStatusBiometricSomeComplete(passengersList)? 'summary' : 'app';
                const showCompleteModal = checkPassengerStatusBiometricCompleteAndNotAvailable(boardingCardsModel.boardingInfo.passengersList);
                const biometricUserNotInterested = localStorageService.get('biometricUserNotInterested');

                if (existPassengersList) {
                    if (existAutomaticFFAvailable) { // Automatic biometric
                        const requestData = BiometricTransformer.transformDataForGetBiometricalData();
                        aggregatedModel = requestData;
                        GetBiometricDataService.getBiometricalData(requestData).then(getBiometricalDataSuccess, showErrorService);
                    } else if (existStatusBiometric) {
                        ModalService.isNotWaiting();
                        if (!getDoNotShowAgainBiometricModalCookieValue() && !biometricUserNotInterested) {
                            // call modal next biometric
                            localStorageService.set('showBiometricSummaryModule', showBiometricSummaryModule);
                            ModalService.showGenericModal({ continueCheckinBiometric: true }, true, 'ib-modal-biometric-boarding-available');
                        }
                        //Show complete modal for monopax or multipax whose status is COMPLETE or NOT_AVAILABLE
                    } else if (existStatusBiometricAllComplete || showCompleteModal) {
                            ModalService.isNotWaiting();
                            localStorageService.set('showBiometricSummaryModule', showBiometricSummaryModule);
                        ModalService.showGenericModal({ biometricBoardingSelected: true }, true, 'ib-modal-biometric-boarding-automatic');
                        //Previously, this modal was only shown for monopax that had COMLPLETE status.
                        // if (boardingCardsModel.boardingInfo.passengersList.length === 1) {
                        //     ModalService.showGenericModal({ biometricBoardingSelected: true }, true, 'ib-modal-biometric-boarding-automatic');
                        // } else {
                        //     $location.path('/ckbio');
                        // }
                        // call modal biometric complete all passengers
                    }
                } else {
                    ModalService.isNotWaiting();
                }

                function getBiometricalDataSuccess (response) {
                    if (response.code === 200) {
                        response = response.data;
                        response = BiometricTransformer.transformBiometricDataResponse(response);
                        angular.extend(aggregatedModel, response);
                        const request = BiometricTransformer.transformFlightInfoPassengerRequest(response, null);
                        GetFlightInfoPassenger.getFlightInfoPassenger(request).then(flightInfoSuccess, showErrorService);
                    } else {
                        showErrorService();
                    }
                }
            }

            function flightInfoSuccess (response) {
                angular.extend(aggregatedModel, response);
                const request = BiometricTransformer.transformAssociateBoardingCardRequest(aggregatedModel);
                angular.extend(aggregatedModel, request);
                GetBiometricCardPassengerAssociationService.getBiometricCardPassengerData(request).then(biometricAssociationPassengerSuccess, showErrorService);
            }

            function biometricAssociationPassengerSuccess () {
                const passengers = localStorageService.get('bookingInfo').passengers;
                ModalService.isNotWaiting();
                if (passengers.length > 1) {
                    if (!getDoNotShowAgainBiometricModalCookieValue()) {
                        ModalService.showGenericModal({ continueCheckinBiometric: true }, true, 'ib-modal-biometric-boarding-available');
                    }
                } else {
                    ModalService.showGenericModal({ biometricBoardingSelected: true }, true, 'ib-modal-biometric-boarding-automatic');
                }
                localStorageService.set('noShowMessageBockBack', false);
                localStorageService.set('nextStepAllowed', true);
                localStorageService.set('biometricModel', aggregatedModel);
                localStorageService.set('biometricBoardingAssociationSuccess', true);
            }

            function showErrorService (error) {
                localStorageService.set('biometricModel', aggregatedModel);
                deferred.reject(error);
                ModalService.isNotWaiting();
                if (!getDoNotShowAgainBiometricModalCookieValue()) {
                    ModalService.showGenericModal({ continueCheckinBiometric: true }, true, 'ib-modal-biometric-boarding-available');
                }
            }
            function checkPassengerStatusAutomaticFFAvailable (passengers) {
                return passengers.some((pas) => pas.biometricBoardingStatus === CheckinAppConstants.BIOMETRIC.STATUS.AUTOMATIC_FF_AVAILABLE);
            }

            function checkPassengerStatusBiometric (passengerStatusBySegment) {
                let result = false;
                for (let i = 0; i < passengerStatusBySegment.length; i++) {
                    const passengerStatus = passengerStatusBySegment[i];
                    if (passengerStatus.status !== CheckinAppConstants.BIOMETRIC.STATUS.AUTOMATIC_FF_AVAILABLE &&
                        passengerStatus.status !== CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE &&
                        passengerStatus.status !== CheckinAppConstants.BIOMETRIC.STATUS.NOT_AVAILABLE) {
                        result = true;
                    }
                }
                return result;
            }

            function checkPassengerStatusBiometricAllComplete (passengers) {
                let countComplete = 0;
                for (let i = 0; i < passengers.length; i++) {
                    const passenger = passengers[i];
                    if (passenger.biometricBoardingStatus === CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE) {
                        countComplete++;
                    }
                }
                return passengers.length === countComplete;
            }

            function checkPassengerStatusBiometricSomeComplete (passengers) {
                return passengers.some(passenger => passenger.biometricBoardingStatus === CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE);
            }

            function checkPassengerStatusBiometricCompleteAndNotAvailable (passengers) {
                return passengers.every(passenger => [CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE, CheckinAppConstants.BIOMETRIC.STATUS.NOT_AVAILABLE].includes(passenger.biometricBoardingStatus));
            }


            function getDoNotShowAgainBiometricModalCookieValue () {
                return $cookies.get(CheckinAppConstants.COOKIES.BIOMETRIC_BOARDING_DO_NOT_SHOW);
            }
        }

        function openGoogleWalletModal (documents, callback) {
            IbBoardingCardsModalService.showGoogleWalletModal({
                segments: documents?.[0]?.segments ?? []
            }).then((result) => {
                callback(result);
            }, angular.noop);
        }
    }
})();
