(function () {
    'use strict';

    angular
        .module('ib-checkin-flights-passengers-module')
        .factory('FlightsPassengersService', FlightsPassengersService);

    FlightsPassengersService.$inject = ['$q', 'localStorageService', 'FlightsPassengersTransformer', 'ModalService', 'GetPhoneCodesService' ,'GetFrequentFlyersService', 'FlightsPassengersUtils', 'PassengerAdditionalInfoService', 'GetAirlinesService', 'CkiDatalayerConstants', 'CheckinAppConstants', '$location', 'IBCGdprService', 'CheckAncillariesService', '$filter', 'CommonsAncillariesService', 'CommonsGetWcsPhonesService', 'IBCContactDataService', 'IBCAlternativeContactDataService','GetCKICachedInformationService','UpdateMemberService', 'IBCContactDetailsZeroService', 'CommonsUserUtilsService', 'IbSessionConfigService', 'IbAncillariesPaymentUtilsService'];
    function FlightsPassengersService ($q, localStorageService, FlightsPassengersTransformer, ModalService, GetPhoneCodesService, GetFrequentFlyersService, FlightsPassengersUtils, PassengerAdditionalInfoService, GetAirlinesService, CkiDatalayerConstants, CheckinAppConstants, $location, IBCGdprService, CheckAncillariesService, $filter, CommonsAncillariesService, CommonsGetWcsPhonesService, IBCContactDataService, IBCAlternativeContactDataService,GetCKICachedInformationService,UpdateMemberService, IBCContactDetailsZeroService, CommonsUserUtilsService, IbSessionConfigService, IbAncillariesPaymentUtilsService) {

        let segmentsPassengersInfo, prefixes, companiesInfo, availablePassengersIds, additionalInfo, emergencyInfo, gdprInfo, ancillariesSummaryInfo;

        return {
            searchFlightsAndPassengers: searchFlightsAndPassengers,
            checkAvailabilitySeatsPassengers: checkAvailabilitySeatsPassengers,
            getWCSPhones: getWCSPhones,
            updateContactDetails: updateContactDetails,
            updateAlternativeContact: updateAlternativeContact,
            updateMember: updateMember,
            getContactData: getContactData,
            getAlternativeContactData: getAlternativeContactData

        };


        ////////////////,

        /**
         *
         */
        function searchFlightsAndPassengers () {
            const deferred = $q.defer();

            getSegmentsPassengerInfo().then((data) => {
                segmentsPassengersInfo = data;

                GetPhoneCodesService.getPhoneCodesList().then(getPrefixesSuccess, () => {
                    getPrefixesSuccess(null);
                });



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
                    const arePendingPayments = IbAncillariesPaymentUtilsService.checkPendingPayments(segmentsPassengersInfo);
                    const params = localStorageService.get('urlParams'), pnr = localStorageService.get('PNR');
                    emergencyInfo = emergencyData;
                    localStorageService.set('pendingPayments', arePendingPayments);

                    if (arePendingPayments && !(params.travelAgencies && params.reInvoicing)) {
                        ModalService.isNotWaiting();
                        ModalService.showGenericModal({ idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS }, true, 'ib-pending-payments-modal')
                            .result.then(() => {
                                cancelPendingPayments();
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
                    const pnr = localStorageService.get('PNR');
                    ModalService.isWaiting();
                    CommonsAncillariesService.deleteAllAncillaries().then((cancelData) => {
                        handleCancelPendingPaymentsSuccess(cancelData, deferred, getFormatedInfo);
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
            });

            return deferred.promise;
        }


        /**
         * Check if all passengers have seats
         * @return {BOOL} TRUE| FALSE
         */
        function checkAvailabilitySeatsPassengers () {
            let deferred = $q.defer(), seatsAvailable = true, i, j, ancillaries, passengersSelected;
            if(localStorageService.get('bookingInfo')?.ancillariesDisabled) $location.path('/ibecbp');
            ModalService.isWaiting();
            CheckAncillariesService.checkAncillaries().then(getAncillariesSuccess, getAncillariesError);
            function getAncillariesSuccess (response) {
                if (response.ancillaries) {
                    ancillaries = localStorageService.get('ancillariesInfo').ancillaries;
                    passengersSelected = localStorageService.get('passengersSelected');
                    for (i = 0; i < ancillaries.length; i++) {
                        if (ancillaries[i].type === CheckinAppConstants.ANCILLARIES_TYPES.SEAT) {
                            if (ancillaries[i].status.code === CheckinAppConstants.GENERAL_STATUS.AVAILABLE) {
                                for (j = 0; j < ancillaries[i].segments.length; j++) {
                                    if (ancillaries[i].segments[j].passengers.length !== passengersSelected.length) {
                                        seatsAvailable = false;
                                    }
                                }
                            } else {
                                seatsAvailable = false;
                            }
                        }
                    }
                } else {
                    seatsAvailable = false;
                }
                deferred.resolve(seatsAvailable);
            }
            function getAncillariesError (error) {
                ModalService.isNotWaiting();
                error.message = $filter('translate')('GENERIC_BLOCKING_MODAL_ERROR');
                ModalService.showGenericError(error).result.then(() => {
                    $location.path('\ibcose');
                });


            }
            return deferred.promise;
        }


        /**
         * Get pronesList from WCS and sets to locaStorage
         */
        function getWCSPhones () {
            let deferred = $q.defer();

            CommonsGetWcsPhonesService.getPhoneByCode(CheckinAppConstants.WCS.PHONE_TYPES.SALES).then((response) => {
                deferred.resolve(response);
                deferred = null;
            }, () => {
                deferred.resolve({});
            });

            return deferred.promise;

        }

        function getContactData () {
            self.defer = self.defer || $q.defer();
            let serviceToCall;
            if (CommonsUserUtilsService.isIbPlus()) {
                serviceToCall = IBCContactDataService.getContactData;
            } else {
                serviceToCall = IBCContactDetailsZeroService.getContactDetailsData;
            }

            serviceToCall().then(getContactDetailsSuccess, getContactDetailsFailed);
            return self.defer.promise;
            function getContactDetailsSuccess (res) {
                self.defer.resolve(res);
                self.defer = null;
            }
            function getContactDetailsFailed (err) {
                self.defer.reject(err);
                self.defer = null;
            }
        }

        function getAlternativeContactData () {
            self.defer = self.defer || $q.defer();

            IBCAlternativeContactDataService.getAlternativeContactData().then(getContactDetailsSuccess, getContactDetailsFailed);
            return self.defer.promise;
            function getContactDetailsSuccess (res) {
                self.defer.resolve(res);
                self.defer = null;
            }
            function getContactDetailsFailed (err) {
                self.defer.reject(err);
                self.defer = null;
            }
        }

        function updateContactDetails (reqContactData) {
            self.defer = self.defer || $q.defer();

            const reqContact = FlightsPassengersTransformer.generateUpdataContactDetails(reqContactData);
            let serviceToCall;
            if (CommonsUserUtilsService.isIbPlus()) {
                serviceToCall = IBCContactDataService.updateContactData;
            } else {
                serviceToCall = IBCContactDetailsZeroService.updateContactDetailsData;
            }
            serviceToCall(reqContact).then(updateContactDetailsSuccess, updateContactDetailsFailed);
            return self.defer.promise;
            function updateContactDetailsSuccess (res) {
                self.defer.resolve(res);
                self.defer = null;
            }
            function updateContactDetailsFailed (err) {
                self.defer.reject(err);
                self.defer = null;
            }
        }

        function updateMember (reqContactData) {
            self.defer = self.defer || $q.defer();

            const reqContact = FlightsPassengersTransformer.generateUpdataContactDetails(reqContactData);
            UpdateMemberService.updateMember(reqContact).then(updateContactDetailsSuccess, updateContactDetailsFailed);
            return self.defer.promise;
            function updateContactDetailsSuccess (res) {
                self.defer.resolve(res);
                self.defer = null;
            }
            function updateContactDetailsFailed (err) {
                self.defer.reject(err);
                self.defer = null;
            }
        }


        function updateAlternativeContact (reqContactData) {
            self.defer = self.defer || $q.defer();

            const reqContact = FlightsPassengersTransformer.updateEmergencyAlternativeDetails(reqContactData);
            IBCAlternativeContactDataService.updateAlternativeContactData(reqContact).then(updateAlternativeContactSuccess, updateAlternativeContactFailed);
            return self.defer.promise;
            function updateAlternativeContactSuccess (res) {
                self.defer.resolve(res);
                self.defer = null;
            }
            function updateAlternativeContactFailed (err) {
                self.defer.reject(err);
                self.defer = null;
            }
        }

        function handleCancelPendingPaymentsSuccess (cancelData, deferred, getFormatedInfo) {
            const pendingPaymentFailed = IbAncillariesPaymentUtilsService.checkFailedPendingPayments(cancelData);

            if (pendingPaymentFailed !== null) {
                ModalService.isNotWaiting();
                ModalService.showGenericModal({ info: pendingPaymentFailed, message: 'IBCOAC_SOME_PENDING_PAYMENTS_CANCEL_ERROR', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PAYMENTS_FAILED }, false, 'generic-info-modal');
            }

            localStorageService.set('pendingPayments', pendingPaymentFailed !== null);

            refreshBookingInfo().then((data) => {
                segmentsPassengersInfo = data;
                ModalService.isNotWaiting();
                deferred.resolve(getFormatedInfo());
            }, (error) => {
                deferred.reject(error);
            });
        }

        function refreshBookingInfo () {
            const deferred = $q.defer();

            GetCKICachedInformationService.getCachedInformation().then((cachedInfo) => {
                localStorageService.set('bookingInfo', cachedInfo);
                deferred.resolve(cachedInfo);
            }, (error) => {
                ModalService.isNotWaiting();
                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);
                ModalService.isError(error);
                deferred.reject(error);

            });

            return deferred.promise;
        }

        function getSegmentsPassengerInfo () {
            const segmentsPassengersInfo = localStorageService.get('bookingInfo');

            if (segmentsPassengersInfo) {
                return $q.when(segmentsPassengersInfo);
            }

            return refreshBookingInfo().then(data => {
                return data;
            }, angular.noop);
        }
    }
})();