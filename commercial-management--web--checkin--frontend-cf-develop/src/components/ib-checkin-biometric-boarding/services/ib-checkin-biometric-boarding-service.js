(function () {

    'use strict';

    angular.module('ib-checkin-biometric-boarding-module')
        .service('CheckinBiometricBoardingService', CheckinBiometricBoardingService);

    CheckinBiometricBoardingService.$inject = ['BiometricTransformer', 'FlightsPassengersTransformer', 'PassengerAdditionalInfoService', 'FlightsPassengersUtils', 'GetFrequentFlyersService', 'IbUtilsService', 'GetAirlinesService', 'GetPhoneCodesService', 'localStorageService', 'ModalService', '$q', 'GetBiometricAllowedDataService', 'BiometricErrorFilter', 'GetBiometricCardPassengerAssociationService', 'IBCGdprService', '$rootScope', '$location', 'CkiDatalayerConstants', 'CommonsAncillariesService', 'GetCKICachedInformationService', 'CallBoardingCardsService', '$window', 'IbSessionConfigService', 'IbAncillariesPaymentUtilsService'];

    function CheckinBiometricBoardingService (BiometricTransformer, FlightsPassengersTransformer, PassengerAdditionalInfoService, FlightsPassengersUtils, GetFrequentFlyersService, IbUtilsService, GetAirlinesService, GetPhoneCodesService, localStorageService, ModalService, $q, GetBiometricAllowedDataService, BiometricErrorFilter, GetBiometricCardPassengerAssociationService, IBCGdprService, $rootScope, $location, CkiDatalayerConstants, CommonsAncillariesService, GetCKICachedInformationService, CallBoardingCardsService, $window, IbSessionConfigService, IbAncillariesPaymentUtilsService) {

        var self = this;

        var segmentsPassengersInfo, prefixes, companiesInfo, availablePassengersIds, additionalInfo, emergencyInfo, gdprInfo, ancillariesSummaryInfo;

        self.deferred;
        self.initBiometricBoardingPage = initBiometricBoardingPage;
        self.checkBiometricBoardingInfo = checkBiometricBoardingInfo;
        self.searchFlightsAndPassengers = searchFlightsAndPassengers;
        self.getBoardingDocuments = getBoardingDocuments;

        return self;

        /**
         *
         */
        function searchFlightsAndPassengers () {

            var deferred = $q.defer();
            segmentsPassengersInfo = localStorageService.get('bookingInfo');

            GetPhoneCodesService.getPhoneCodesList().then(getPrefixesSuccess, () => {
                getPrefixesSuccess(null);
            });


            return deferred.promise;

            function getPrefixesSuccess (prefixesInfo) {
                prefixes = prefixesInfo;
                GetAirlinesService.getAirlines().then(getGdprInfoSuccess, () => {
                    getGdprInfoSuccess();
                });
            }

            function getGdprInfoSuccess () {
                const isLogged = IbSessionConfigService.isUserLogged();
                IBCGdprService.getGdprInfo(isLogged ? 'IBPRIVACIBP' : 'IBPRIVAC').then(getAirlinesSuccess, () => {
                    getAirlinesSuccess(null);
                });
            }


            function getAirlinesSuccess (gdprData) {
                gdprInfo = gdprData;
                GetFrequentFlyersService.getFrequentFlyers().then(getCompaniesSuccess, () => {
                    getCompaniesSuccess([]);
                });
            }

            function getCompaniesSuccess (companiesData) {
                companiesInfo = companiesData;
                availablePassengersIds = FlightsPassengersUtils.getPassengerAdditionalInfo(segmentsPassengersInfo);
                if (availablePassengersIds.length > 0) {
                    PassengerAdditionalInfoService.getAdditionalInfo(availablePassengersIds).then(getAdditionalInfoSuccess, (error) => {
                        if (error.errorCode === 410 && error.internalErrorCode === 'IB_00002') {
                            ModalService.isNotWaiting();
                            ModalService.showGenericError(error, true).result.then($location.path('/ibcose'), angular.noop);
                        } else {
                            getAdditionalInfoSuccess([]);
                        }
                    });
                } else {
                    getAdditionalInfoSuccess([]);
                }

            }

            function getAdditionalInfoSuccess (additionalInfoData) {
                additionalInfo = additionalInfoData;
                localStorageService.set('disruptionContactApis', additionalInfoData);
                availablePassengersIds = FlightsPassengersUtils.getPassengerEmergencyInfo(segmentsPassengersInfo);
                if (availablePassengersIds.length > 0) {
                    PassengerAdditionalInfoService.getEmergencyInfo(availablePassengersIds).then(getEmergencyInfoSuccess, (error) => {
                        if (error.errorCode === 410 && error.internalErrorCode === 'IB_00002') {
                            ModalService.isNotWaiting();
                            ModalService.showGenericError(error, true).result.then($location.path('/ibcose'), angular.noop);
                        } else {
                            getEmergencyInfoSuccess([]);
                        }
                    });
                } else {
                    getEmergencyInfoSuccess([]);
                }

            }

            function getEmergencyInfoSuccess (emergencyData) {
                const pnr = localStorageService.get('PNR');
                var arePendingPayments = IbAncillariesPaymentUtilsService.checkPendingPayments(segmentsPassengersInfo);
                var params = localStorageService.get('urlParams');
                emergencyInfo = emergencyData;
                localStorageService.set('pendingPayments', arePendingPayments);

                if (arePendingPayments && !(params.travelAgencies && params.reInvoicing)) {
                    ModalService.isNotWaiting();
                    ModalService.showGenericModal({ idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS }, true, 'ib-pending-payments-modal')
                        .result.then(() => {
                            cancelPendingPayments(getAncillariesSummaryInfoSuccess);
                        }, () => {
                            ModalService.isWaiting();
                            CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(getAncillariesSummaryInfoSuccess, () => {
                                getAncillariesSummaryInfoSuccess(null);
                            });
                        });
                } else {
                    deferred.resolve((getFormatedInfo()));
                }
            }


            function cancelPendingPayments () {
                var pendinPaymentFailed;
                const pnr = localStorageService.get('PNR');
                ModalService.isWaiting();
                CommonsAncillariesService.deleteAllAncillaries().then((cancelData) => {
                    pendinPaymentFailed = IbAncillariesPaymentUtilsService.checkFailedPendingPayments(cancelData);
                    if (pendinPaymentFailed != null) {
                        ModalService.isNotWaiting();
                        ModalService.showGenericModal({ info: pendinPaymentFailed, message: 'IBCOAC_SOME_PENDING_PAYMENTS_CANCEL_ERROR', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PAYMENTS_FAILED }, false, 'generic-info-modal');
                    }
                    localStorageService.set('pendingPayments', pendinPaymentFailed != null);
                    refreshBookingInfo();
                }, () => {
                    ModalService.isNotWaiting();
                    ModalService.showGenericModal({ message: 'IBCOAC_PENDING_PAYMENTS_CANCEL_ERROR', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PAYMENTS_FAILED }, false, 'generic-error-modal').result.then(() => {
                        localStorageService.set('pendingPayments', true);
                        CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(getAncillariesSummaryInfoSuccess, () => {
                            getAncillariesSummaryInfoSuccess(null);
                        });
                    }, angular.noop);

                });
            }


            function getAncillariesSummaryInfoSuccess (breakData) {
                ModalService.isNotWaiting();
                ancillariesSummaryInfo = breakData;
                deferred.resolve(getFormatedInfo());
            }


            function getFormatedInfo () {
                return FlightsPassengersTransformer.transformSegmentsPassengersInfo(segmentsPassengersInfo, prefixes, companiesInfo, additionalInfo, emergencyInfo, gdprInfo, ancillariesSummaryInfo);
            }

            function refreshBookingInfo () {
                GetCKICachedInformationService.getCachedInformation().then((cachedInfo) => {
                    localStorageService.set('bookingInfo', cachedInfo);
                    deferred.resolve(FlightsPassengersTransformer.transformSegmentsPassengersInfo(cachedInfo, prefixes, companiesInfo, additionalInfo, emergencyInfo, gdprInfo));
                }, (error) => {
                    ModalService.isNotWaiting();
                    ModalService.setErrorMessage(error.message);
                    ModalService.setErrorCode(error.internalErrorCode);
                    ModalService.isError(error);
                    deferred.reject(error);

                });
            }
        }

        function initBiometricBoardingPage () {
            self.deferred = $q.defer();
            ModalService.isWaiting();

            GetBiometricAllowedDataService.getBiometricalAllowedDocuments().then(initialServiceCall, serviceError);

            return self.deferred.promise;

            function initialServiceCall (responseData) {
                IBCGdprService.getGdprInfo('DIGTRABIO').then(gdprSuccess, () => { gdprSuccess(null) });

                function gdprSuccess (gdrpData) {
                    ModalService.isNotWaiting();
                    self.deferred.resolve(BiometricTransformer.transformInitServiceResponse(responseData, gdrpData));
                    self.deferred = null;
                }

            }

            function serviceError (error) {
                ModalService.isNotWaiting();
            }

        }

        function checkBiometricBoardingInfo (model) {
            var deferred = $q.defer(), request = BiometricTransformer.transformBiometricBoardingInfoRequest(model);
            var biometricProfileCheck = localStorageService.get('biometricProfileCheck') || null;
            self.deferred = deferred;

            if (biometricProfileCheck === undefined || biometricProfileCheck === null || !biometricProfileCheck)
                ModalService.isWaitingGeneric('ib-biometric-boarding-form-loading.html');

            GetBiometricCardPassengerAssociationService.associateBoardingCardsOrchestrator(request).then(associateBoardingCardsOrchestratorSuccess, errorService);
            
            return deferred.promise;

            function associateBoardingCardsOrchestratorSuccess (data) {
              associateBoardingCardSuccess(data);
            }

            function associateBoardingCardSuccess (response) {
              var biometricProfileCheck = localStorageService.get('biometricProfileCheck') || null;
              angular.extend(model, response);

              if (biometricProfileCheck !== null && biometricProfileCheck) {
                  $rootScope.$broadcast('biometricProfileCheckAssociate', model);
              } else {
                  ModalService.isNotWaiting();
              }
              deferred.resolve(response);
              deferred = null;
          }

            function errorService (error) {
                var deferred = $q.defer();
                var biometricProfileCheck = localStorageService.get('biometricProfileCheck') || null;
                var biometricProfileInitCheck = localStorageService.get('biometricProfileInitCheck') || null;
                if (error && error.errorCode && error.errorCode == 204) {
                    $rootScope.$broadcast('biometricProfileCheckError', {internalErrorCode:'ERROR_204',errorCode: 412});
                    deferred = null;
                } else {
                    if(biometricProfileCheck !== null && biometricProfileCheck) {
                        $rootScope.$broadcast('biometricProfileCheckError', error);
                        ModalService.finishWaiting();
                    } else if(biometricProfileInitCheck !== null && biometricProfileInitCheck) {
                        $rootScope.$broadcast('biometricProfileInitCheck', 'biometricProfileInitCheck');
                        //self.deferred = deferred;
                        ModalService.finishWaiting();
                        //self.deferred.reject(error);
                        //self.deferred = null;
                    }  else {
                        BiometricErrorFilter.errorHandlerManagement(error);
                        ModalService.isNotWaiting();
                    }
                }
            }

        }

        function getBoardingDocuments () {
            var deferred = $q.defer();
            ModalService.isWaiting();
            CallBoardingCardsService.getBoardingCards().then(getBoardingCardsSuccess, getBoardingCardsError);

            return deferred.promise;

            function getBoardingCardsSuccess (data) {
                ModalService.isNotWaiting();
                deferred.resolve(data);
            }

            function getBoardingCardsError (error) {
                deferred.reject(error);
                ModalService.isNotWaiting();
                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);
                ModalService.isError(error, null, true).result.then(startFlow, startFlow);
            }

            function startFlow () {
                $window.location.href =
                $window.location.origin +
                $window.location.pathname +
                IbUtilsService.removeParameterURL($window.location.search);
            }
        }
    }

})();
