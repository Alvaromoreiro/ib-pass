(function () {
    'use strict';
    //Service used to managed logic into flights and passengers view, initialize its data
    angular
        .module('ib-fly-now-confirmation-module')
        .factory('FlyNowConfirmationPAService', FlyNowConfirmationPAService);

    FlyNowConfirmationPAService.$inject = ['$rootScope', '$location', '$q', 'localStorageService', 'ModalService', 'FlyNowConfirmationPATransformer', 'ChangeOrderSliceService', 'PassengerAdditionalInfoService', 'GetCKICachedInformationService', 'AcceptObjectsPolicyService', 'CheckAncillariesService', 'IbUtilsService', 'IbPassengerBookingUtilsService', 'CommonsAncillariesService', 'IbAncillariesPaymentUtilsService'];
    function FlyNowConfirmationPAService ($rootScope, $location, $q, localStorageService, ModalService, FlyNowConfirmationPATransformer, ChangeOrderSliceService, PassengerAdditionalInfoService, GetCKICachedInformationService, AcceptObjectsPolicyService, CheckAncillariesService, IbUtilsService, IbPassengerBookingUtilsService, CommonsAncillariesService, IbAncillariesPaymentUtilsService) {

        return {
            getFlyNowConfirmationInfo: getFlyNowConfirmationInfo,
            confirmChangeFlight: confirmChangeFlight
        };

        ////////////////

        //initilize view  data and transform it
        function getFlyNowConfirmationInfo () {
            const defer = $q.defer();
            const transformedView = FlyNowConfirmationPATransformer.transformFlyNowConfirmationInfo(localStorageService.get('selectedBlockPa'), localStorageService.get('newSelectedSegment'));
            defer.resolve(transformedView);

            return defer.promise;
        }

        /**
         * changes the flight in the booking returning the service ChangeOrderSliceService promise
         */
        function confirmChangeFlight () {
            let i, dataToSend, segmentsID, filterAdditionalInfo, tripsInfo;
            ModalService.isWaiting();
            ChangeOrderSliceService.changeOrderSlice(localStorageService.get('flowId'), localStorageService.get('selectedBlockPa').id,
                FlyNowConfirmationPATransformer.createRequestChangeOrder()).then(() => {
                callNextServices();
                function callNextServices () {
                    GetCKICachedInformationService.getCachedInformation().then((data) => {
                        localStorageService.set('bookingInfo', data);
                        filterAdditionalInfo = IbPassengerBookingUtilsService.filterAdditionalInfo(data, localStorageService.get('additionalInfoPa'));
                        localStorageService.set('additionalInfoPa', filterAdditionalInfo.additionalInfo);
                        const newSegmentInfo = IbPassengerBookingUtilsService.updateSelectedSegments();
                        if (!filterAdditionalInfo.needsUpdate && filterAdditionalInfo.additionalInfo.length > 0) {
                            PassengerAdditionalInfoService.updateAdditionalInfo(IbPassengerBookingUtilsService.updateLanguageAdditionalInfo(filterAdditionalInfo.additionalInfo)).then(() => {
                                updateHeaderTrips(data);
                                acceptNewSegments(newSegmentInfo);
                            }, (error) => {
                                showError(error, true);
                            });
                        } else if (filterAdditionalInfo.needsUpdate) {
                            localStorageService.set('flightConfirmationNeedsCheckin', newSegmentInfo.newSegmentsId);
                            acceptNewSegments(newSegmentInfo);
                            //goToFlightsAndPassengers();
                        } else {
                            updateHeaderTrips(data);
                            acceptNewSegments(newSegmentInfo);
                        }
                    }, showError);
                }
            }, showError);

            function acceptNewSegments (updateSelectedSegments) {
                const pnr = localStorageService.get('PNR');
                if (updateSelectedSegments.isAllowed) {
                    dataToSend = { dangerousItemsInfoAccepted: true, segments: [] };
                    segmentsID = updateSelectedSegments.newSegmentsId;
                    segmentsID = segmentsID || [];
                    //set the segment information of each selected segment in IBCOAC
                    for (i = 0; i < segmentsID.length; i++) {
                        dataToSend.segments[i] = { id: segmentsID[i], passengers: localStorageService.get('passengersSelected') };
                    }
                    AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(dataToSend).then((acceptResponse) => {
                        localStorageService.set('acceptInfoSegments', acceptResponse.data);

                        const uncheckableSegments = IbPassengerBookingUtilsService.updateCachedInfo(acceptResponse.data.acceptedSegments);
                        if (uncheckableSegments.length === 0) {
                            if(localStorageService.get('bookingInfo')?.ancillariesDisabled) $location.path('/ibecbp');
                            else {
                                CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr)
                                    .then(getAncillarieSummarySuccess, showErrorAncillaries);
                            }
                        } else {
                            goToFlightsAndPassengers();
                        }
                    }, (error) => {
                        showError(error, true);
                    });
                } else {
                    goToFlightsAndPassengers();
                }
            }

            function goToFlightsAndPassengers () {
                localStorageService.set('nextStepAllowed', false);
                $location.path('/ibcoac');
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
                ModalService.showGenericModal(modalObject, true).result.then(IbUtilsService.goIbCose, IbUtilsService.goIbCose);
            }


            function updateHeaderTrips (data) {
                tripsInfo = IbAncillariesPaymentUtilsService.generateHeaderTripsInfo();
                $rootScope.$broadcast('updateTripList', tripsInfo);
            }


            function showError (error, callback) {
                ModalService.isNotWaiting();
                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);
                ModalService.isError(error).result.then(onClick, onClick);

                function onClick () {
                    if (callback) {
                        goToFlightsAndPassengers();
                    }
                }
            }

            function showErrorAncillaries (error, callback) {
                const pendingPayments = localStorageService.get('pendingPayments');
                ModalService.isNotWaiting();
                if (pendingPayments) {
                    ModalService.setErrorMessage(error.message);
                    ModalService.setErrorCode(error.internalErrorCode);
                    ModalService.isError(error).result.then(onClick, onClick);
                } else {
                    $location.path('/ibecbp');
                }

                function onClick () {
                    if (callback) {
                        goToFlightsAndPassengers();
                    }
                }
            }

            function getAncillarieSummarySuccess (ancillariesSummary) {
                IbAncillariesPaymentUtilsService.setAncillariesCurrency(ancillariesSummary.currencies, ancillariesSummary.context.issueCurrency);
                CheckAncillariesService.checkAncillaries().then((data) => {
                    if (data.ancillaries) {
                        localStorageService.set('nextStepAllowed', false);
                        localStorageService.set('seatMapSegment', {
                            segmentId: Number(localStorageService.get('availableSegments')[0]),
                            pasId: localStorageService.get('passengersSelected')[0]
                        });
                        localStorageService.set('isPaFlow', true);
                        $location.path('/ckianc');
                    } else {
                        goToFlightsAndPassengers();
                    }
                }, showErrorAncillaries);
            }


        }
    }
})();
