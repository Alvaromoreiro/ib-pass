(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .service('CallAcceptService', CallAcceptService);

    CallAcceptService.$inject = ['FlightsPassengersUtils', 'IbUtilsService', 'IbPassengerBookingUtilsService', 'localStorageService', 'AcceptObjectsPolicyService', 'ModalService', '$location', 'GetCKICachedInformationService', 'CheckAncillariesService', 'CheckPaymentsService', '$route', 'CheckinAppConstants', 'CkiDatalayerConstants', 'FlightsPassengersService', 'CommonsAncillariesService', 'CommonsSessionStorageService', 'IbCheckinSeatSummaryService', 'CallAncillariesService', 'UpgradingAncillaryToUpgradeInfoMapperService', 'IbAncillariesPaymentUtilsService', 'IbBoardingCardsPrintTransformer'];
    function CallAcceptService (FlightsPassengersUtils, IbUtilsService, IbPassengerBookingUtilsService, localStorageService, AcceptObjectsPolicyService, ModalService, $location, GetCKICachedInformationService, CheckAncillariesService, CheckPaymentsService, $route, CheckinAppConstants, CkiDatalayerConstants, FlightsPassengersService, CommonsAncillariesService, CommonsSessionStorageService, IbCheckinSeatSummaryService, CallAncillariesService, UpgradingAncillaryToUpgradeInfoMapperService, IbAncillariesPaymentUtilsService, IbBoardingCardsPrintTransformer) {

        const self = this;
        self.callAccept = callAccept;
        self.nextViewAfterAccept = nextViewAfterAccept;

        /**
         * @function
        * @name callAccept
        * @desc calls accepted forbidden objects policy and continue to the next step
        */
        function callAccept (passengers, printBoardingCard, nextStep, isEarly) {
            const requestAcceptInfo = FlightsPassengersUtils.getAcceptUpdateInformation(localStorageService.get('availableSegments'), passengers);
            let modalObject;

            AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(requestAcceptInfo).then(acceptPolicySuccess, acceptPolicyError);

            function acceptPolicySuccess (acceptInfo) {
                const uncheckableSegments = IbPassengerBookingUtilsService.updateCachedInfo(acceptInfo.data.acceptedSegments);
                let acceptedSegments = acceptInfo?.data?.acceptedSegments || [];
                const seatsAssigned = checkAcceptSeats();

                ModalService.isNotWaiting();
                if (uncheckableSegments.length > 0) {
                    acceptedSegments = FlightsPassengersUtils.updateSelectedSegments(localStorageService.get('availableSegments'), uncheckableSegments);
                    localStorageService.set('availableSegments', acceptedSegments);
                    ModalService.showGenericError({ message: 'NOT_ACCEPTED_SEGMENT_ERROR', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.NOT_ACCEPTED_SEGMENT_ERROR }, true, 'apis.error-modal.html').result.then(acceptSegmentsError, acceptSegmentsError);
                } else {
                    if (isEarly) {
                        FlightsPassengersService.checkAvailabilitySeatsPassengers().then((response) => {
                            if (response || seatsAssigned) {
                                ModalService.isNotWaiting();
                                checkAcceptResponse();
                            } else {
                                seatNotAvailableError();
                            }
                        }, () => {
                            IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                            ModalService.showGenericError().result.then(IbUtilsService.goIbCose, IbUtilsService.goIbCose);
                        });

                    } else {
                        checkAcceptResponse();
                    }
                }

                function checkAcceptSeats () {
                    let seatsAssigned = true;
                    acceptedSegments.forEach(segment => {
                        segment.passengers.forEach(passenger => {
                            if (passenger.seat === null)
                                seatsAssigned = false;
                        });
                    });
                    return seatsAssigned;
                }

                function acceptSegmentsError () {
                    if (acceptedSegments.length > 0) {
                        checkAcceptResponse();
                    } else {
                        IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                        IbUtilsService.goIbCose();
                    }
                }

                function checkAcceptResponse () {
                    ModalService.isWaiting();
                    if ((acceptInfo.code === 201 || acceptInfo.code === 200) && acceptInfo.data.locator != null) {
                        GetCKICachedInformationService.getCachedInformation().then((cachedData) => {
                            localStorageService.set('bookingInfo', cachedData);
                            localStorageService.set('passengersSelected', FlightsPassengersUtils.updateSelectedPassengers(localStorageService.get('passengersSelected'), cachedData.passengers));
                            ModalService.isNotWaiting();
                            ModalService.openSplitModal('md', 'modal-split', false, acceptInfo.data.locator).result.then(startCheckinFromSplit, startCheckinFromSplit);
                        }, (error) => {
                            IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                            ModalService.showGenericError(error, false);
                        });
                    } else {
                        nextViewAfterAccept(printBoardingCard, nextStep, acceptInfo);
                    }

                    function startCheckinFromSplit (response) {
                        IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                        $location.path('/ibcose').search({ surname: localStorageService.get('checkinSurname'), pnr: response.data.locator });
                    }
                }
            }
        }


        function nextViewAfterAccept (printBoardingCard, nextStep, response) {
            localStorageService.set('acceptInfoSegments', response.data);

            const confirmationInfo = IbBoardingCardsPrintTransformer.getPrintedInformation();
            localStorageService.set('confirmationInfo', confirmationInfo);

            if(localStorageService.get('bookingInfo')?.ancillariesDisabled) {
                IbCheckinSeatSummaryService.checkRedirectionPage('ibecbp');
            } else if(response.code===202) {
                ModalService.showGenericModal({ message: '{{\'ALERT_NO_SHOW_FEES\'|translate}}'}, true, 'generic-info-modal').result.then(() => {
                    checkAncillaries(printBoardingCard, nextStep, response.data);
                }, () => {
                    checkAncillaries(printBoardingCard, nextStep, response.data);
                });
            } else{
                checkAncillaries(printBoardingCard, nextStep, response.data);
            }
        }


        /**
         * Call ancillaries service
         * @param {BOOL} printBoardingCard
         * @param {String} nextStep Next step in flow
         * @param {Object} responseData
         */
        function checkAncillaries (printBoardingCard, nextStep, responseData) {
            const isEarly = localStorageService.get('isEarly');
            localStorageService.set('acceptInfoSegments', responseData);
            localStorageService.remove('upgradeInfo');

            if (printBoardingCard) {
                handleBoardingCardCase(printBoardingCard);
            } else {
                CallAncillariesService.getUpgradingAncillarie().then(getUpgradingAncillarieSuccess, continueWithoutUpgrading);
            }

            function getUpgradingAncillarieSuccess (upgradingAncillarieResponse) {
                const upgradeInfo = UpgradingAncillaryToUpgradeInfoMapperService.map(upgradingAncillarieResponse);

                if (upgradeInfo) {
                    localStorageService.set('upgradeInfo', upgradeInfo);
                    IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    $location.path('/ckiancupp');
                } else {
                    continueWithoutUpgrading();
                }
            }

            function continueWithoutUpgrading () {
                const pnr = localStorageService.get('PNR');
                CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(CommonsAncillariesServiceSucces, CommonsAncillariesServiceError);
            }

            function CommonsAncillariesServiceSucces (ancillariesSummary) {
                IbAncillariesPaymentUtilsService.setAncillariesCurrency(ancillariesSummary.currencies, ancillariesSummary.context.issueCurrency);
                IbAncillariesPaymentUtilsService.setAncillariesBob(ancillariesSummary.freeItems);
                CheckAncillariesService.checkAncillaries().then(() => continueFlow(ancillariesSummary), serviceError);
            }

            function CommonsAncillariesServiceError (response) {
                const acceptInfo = localStorageService.get('acceptInfoSegments');
                let uncheckableSegments = false;
                angular.forEach(acceptInfo.acceptedSegments, (segments) => {
                    angular.forEach(segments.passengers, (pax) => {
                        if(pax.status === 'CHECKED' && pax.seat === null && pax.purchaseSeatRequired) {
                            uncheckableSegments = true;
                        }
                    });
                });

                if(uncheckableSegments) {
                    IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    ModalService.showGenericError({ message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true }, true).result.then(() => {
                        IbUtilsService.goIbCose();
                    }, () => {
                        IbUtilsService.goIbCose();
                    });
                } else {
                    serviceError();
                }
            }

            function continueFlow (ancillariesSummary) {
                if (nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP) {
                    localStorageService.set('seatMapSegment', { segmentId: Number(localStorageService.get('availableSegments')[0]), pasId: localStorageService.get('passengersSelected')[0] });
                    CommonsSessionStorageService.set('isPaFlow', !checkStandby(ancillariesSummary));
                    IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    $location.path('/ckianc');

                } else {
                    ModalService.isNotWaiting();
                    IbCheckinSeatSummaryService.checkRedirectionPage('ckianc');
                }
            }
        }
        function seatNotAvailableError () {
            ModalService.isNotWaiting();
            const modalObject = {
                title: {
                    message: 'CKIANCPURC_MODAL_TARJ_TITLE',
                    needsTranslate: true
                },
                needsTranslate: true,
                message: 'MODAL_UNAVAILABLE_SEATMAP',
                idModal: 'MOD_INFO_TITLE'
            };
            IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
            ModalService.showGenericModal(modalObject, true).result.then(IbUtilsService.goIbCose, IbUtilsService.goIbCose);
        }
        function checkStandby (ancillariesSummary) {
            const segments = ancillariesSummary?.context?.segments ?? [];
            const [firstSegment] = segments;
            const coupons = firstSegment?.passengerCoupons ?? [];
            const [firstCoupon] = coupons;
            const isSby = firstCoupon?.status?.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.STANDBY;
            return isSby;
        }

        function acceptPolicyError (error) {
            ModalService.finishWaiting();
            ModalService.showGenericError(error, false).result.then(updateCachedData, updateCachedData);

            function updateCachedData () {
                if (error.internalErrorCode !== 'IB_00002') {
                    GetCKICachedInformationService.getCachedInformation().then((data) => {
                        localStorageService.set('bookingInfo', data);
                        goToIbcoac();
                    }, (error) => {
                        goToIbcoac();
                    });
                }
            }
        }

        function goToIbcoac () {
            IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
            if ($location.path() === '/ibcoac') {
                $route.reload();
            } else {
                $location.path('/ibcoac');
            }
        }

        /**
         * Handle print boarding card cases
         * @param {boolean=} printBoardingCard
         */
        function handleBoardingCardCase (printBoardingCard) {
            const pendingPayments = localStorageService.get('pendingPayments'), pnr = localStorageService.get('PNR');

            if (pendingPayments) {
                IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                CheckPaymentsService.checkPayments();
            } else {
                CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(
                    (ancillariesSummary) => {
                        localStorageService.set('summaryInfo', ancillariesSummary);
                        IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                        $location.path('/ibecbp');
                    },
                    () => serviceError(printBoardingCard)
                    /*
                        * Code commented out due to the recurring HTTP 500 response from the ancillaries-summary service.
                        * JIRA Task: DIB-9322
                        *
                        * () => {
                        *     ModalService.showGenericError({ message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true }, true).result.then(() => {
                        *         IbUtilsService.goIbCose();
                        *     }, () => {
                        *         IbUtilsService.goIbCose();
                        *     });
                        * }
                        */
                );
            }
        }

        /**
         * Redirect user to payments or boarding-document depending if have
         * pending payments
         * @param {boolean=} printBoardingCard
         */
        function serviceError (printBoardingCard) {
            const pendingPayments = localStorageService.get('pendingPayments');

            ModalService.isNotWaiting();
            if (pendingPayments) {
                IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                $location.path('/ibpurc');
                return;
            }

            if (printBoardingCard) {
                IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                $location.path('/ibecbp');
                return;
            }

            IbCheckinSeatSummaryService.checkRedirectionPage('ibecbp');
        }
    }
})();
