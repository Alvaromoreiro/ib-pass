import dayjs from 'dayjs';
import * as angular from 'angular';
import { CustomerData } from '@src/app/core/models/storage/customer-data-model';
import { FlightHaulLabels } from '@src/app/core/enums/booking-info.enum';

(function () {
    'use strict';

    angular
        .module('ib-checkin-flights-passengers-module')
        .controller('FlightsPassengersController', FlightsPassengersController);

    FlightsPassengersController.$inject = ['$rootScope', '$scope', 'FlightsPassengersModel', 'ModalService', 'FlightsPassengersService', '$timeout', 'CheckinAppConstants', 'CkiDatalayerConstants', 'UpdateFlightsPassengerInfoService', 'CkiDatalayerUtilsService', 'CommonsSessionStorageService', 'CommonsAncillariesService', '$window', 'MonetateUtilsService', 'MonetateConstants', 'RedirectionService', 'AncillariesTransformer', 'NewMainHeaderFacade', '$filter', 'CommonsModalService', 'IBCContactDataService', 'FlightsPassengersTransformer', 'CommonsUserUtilsService', 'IBCContactDetailsZeroService', 'CkiDataLayerService', 'IbSeatEarlyCheckinService', 'IbSessionConfigService', 'IbAncillariesPaymentUtilsService', 'IbPassengerBookingUtilsService', 'IbUtilsService', 'CheckinFlowService'];
    function FlightsPassengersController ($rootScope, $scope, FlightsPassengersModel, ModalService, FlightsPassengersService, $timeout, CheckinAppConstants, CkiDatalayerConstants, UpdateFlightsPassengerInfoService, CkiDatalayerUtilsService, CommonsSessionStorageService, CommonsAncillariesService, $window, MonetateUtilsService, MonetateConstants, RedirectionService, AncillariesTransformer, NewMainHeaderFacade, $filter, CommonsModalService, IBCContactDataService, FlightsPassengersTransformer, CommonsUserUtilsService, IBCContactDetailsZeroService, CkiDataLayerService, IbSeatEarlyCheckinService, IbSessionConfigService, IbAncillariesPaymentUtilsService, IbPassengerBookingUtilsService, IbUtilsService, CheckinFlowService) {


        // @ts-ignore
        const vm = this;
        vm.model = FlightsPassengersModel;
        vm.openModal = openModal;
        vm.openForbiddenObjectsModal = openForbiddenObjectsModal;
        vm.callUpdateFlightsPassengersServices = callUpdateFlightsPassengersServices;
        vm.goBack = goBack;
        vm.passengerRightsRedirection = passengerRightsRedirection;
        vm.getPassengerStatus = getPassengerStatus;
        vm.isDisableButton = isDisableButton;
        vm.continueFlowDuplicate = continueFlowDuplicate;
        vm.getButtonLiteral = getButtonLiteral;

        vm.isCarrierConnect = false;
        vm.model.isCarrierCheckboxChecked = false;
        vm.keyDangerousObjectsCarrier = 'CHECK_DANGEROUS_OBJECTS_CARRIER';
        vm.showContinueButton = true;
        vm.isFlowDuplicated = false;
        vm.isPaFlow = false;
        vm.showBtnsDuplicated = false;
        vm.isBpSubscriptionMode = false;

        $scope.$on('checkSelectedSegmentsEvent', checkSelectedSegments);
        $scope.$on('selectShuttleSegmentEvent', updateShuttleOptions);
        $scope.$on('checkSelectedPassengersEvent', checkSelectedPassengers);
        $scope.$on('openModalNotAvailablePassengerEvent', openModalNotAvailablePassenger);
        $scope.$on('useContactDataForAllEvent', useContactDataForAll);
        $scope.$on('openSegmentInfoEvent', openSegmentInfo);
        $scope.$on('selectedShuttleOption', selectedShuttleOption);
        $scope.$on('validateFrequentFlyerEvent', validateFrequentFlyer);
        $scope.$on('inputBlurFFEvent', inputBlurFF);

        if (!CheckinFlowService.checkConfirmationPNR()) {
            activate();
        }


        ////////////////
        /**
         * Activate of controller
         */
        function activate () {
            const headerModel = createHeaderModel();

            configureInitialPageState();
            initializeAncillariesOrder();
            initializeView();

            loadFlightsAndPassengers(headerModel);
        }

        function createHeaderModel () {
            return {
                trips: null,
                basket: null,
                serviceAncillarie: CommonsAncillariesService,
                serviceModal: ModalService,
                loggedInfo: null,
                pendingPaymentItems: []
            };
        }

        function configureInitialPageState () {
            $rootScope.showMainHeader = false;
            $rootScope.showHeaders = true;

            CommonsSessionStorageService.set(
                'actualStepFlow',
                CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS.toLowerCase()
            );
            CommonsSessionStorageService.set('nextStepAllowedHome', false);

            IbUtilsService.setTitlePage(
                CheckinAppConstants.TITLE_PAGE.FLIGHTS_PASSENGERS,
                1400
            );
        }

        function initializeAncillariesOrder () {
            const ancillariesOrder = [
                CheckinAppConstants.ANCILLARIES_TYPES.BAGGAGE,
                CheckinAppConstants.ANCILLARIES_TYPES.SEAT,
                CheckinAppConstants.ANCILLARIES_TYPES.UPGRADING_BID,
                CheckinAppConstants.ANCILLARIES_TYPES.UPGRADING,
                CheckinAppConstants.ANCILLARIES_TYPES.FLEXIBILITY,
                CheckinAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING,
                CheckinAppConstants.ANCILLARIES_TYPES.SPEQ,
                CheckinAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS,
                CheckinAppConstants.ANCILLARIES_TYPES.PREORDER,
                CheckinAppConstants.ANCILLARIES_TYPES.BOB,
                CheckinAppConstants.ANCILLARIES_TYPES.INTEGRATED_BOB,
                CheckinAppConstants.ANCILLARIES_TYPES.VEHICLE_RENTAL,
                CheckinAppConstants.ANCILLARIES_TYPES.INSURANCE
            ];

            CommonsSessionStorageService.set('orderAncillariesModules', ancillariesOrder);
        }

        function initializeView () {
            CommonsModalService.showWaitingModal('modal-mensaje-wait');
            vm.model.initializeModel();
        }

        function loadFlightsAndPassengers (headerModel) {
            FlightsPassengersService.searchFlightsAndPassengers()
                .then((data) => processFlightsAndPassengersData(data, headerModel))
                .catch(() => closeWaitingModal());
        }

        function processFlightsAndPassengersData (data, headerModel) {
            const flightsPassengersInfo = data.flightsPassengersInfo;

            addPrimaryContactInfoToBookingInfo(data);
            configureModel(flightsPassengersInfo);

            const headerInfo = saveHeaderInformation(flightsPassengersInfo);

            configureBasket(data.summaryInfo, headerModel);
            showWaitingModalForConfirmedShuttle(flightsPassengersInfo);
            configureQuadrigam(flightsPassengersInfo);

            scheduleDatalayerInitialization(
                flightsPassengersInfo,
                headerInfo,
                headerModel
            );

            checkDangerousObjectsCarrier();
            vm.isCarrierConnect = getCarrierConnect();
            vm.isBpSubscriptionMode = IbUtilsService.getBpSubscriptionMode();

            closeWaitingModal();
        }

        function configureModel (flightsPassengersInfo) {
            vm.model.conditions = false;

            applyPrefillContactData(flightsPassengersInfo);

            vm.model.segmentsPassengersInfo = flightsPassengersInfo;
            checkPassengersItems();
        }

        function applyPrefillContactData (flightsPassengersInfo) {
            const prefillContactData = CommonsSessionStorageService.get('prefillContacData');
            const activeFields = flightsPassengersInfo.activeFields;

            if (!prefillContactData || !activeFields) {
                return;
            }

            const useForAllCheck = activeFields.additionalInfoUseForAllCheck;

            if (useForAllCheck) {
                useForAllCheck.show = true;
                useForAllCheck.status = true;
            }

            CommonsSessionStorageService.remove('prefillContacData');
        }

        function saveHeaderInformation (flightsPassengersInfo) {
            const headerInfo = IbAncillariesPaymentUtilsService.getInfoHeader(
                flightsPassengersInfo.segments,
                flightsPassengersInfo.passengers
            );

            CommonsSessionStorageService.set('headerInfo', headerInfo);

            return headerInfo;
        }

        function configureBasket (summaryInfo, headerModel) {
            const segmentsInfo = IbPassengerBookingUtilsService.getSegmentsInfo();

            if (!summaryInfo) {
                return;
            }

            headerModel.basket = AncillariesTransformer.generateAncillariesHeaderInfo(
                summaryInfo, segmentsInfo
            );

            CommonsSessionStorageService.set('breakDownInfo', summaryInfo);
        }

        function showWaitingModalForConfirmedShuttle (flightsPassengersInfo) {
            if (!flightsPassengersInfo.onlyShuttleSegments) {
                return;
            }

            const hasConfirmedFlight = flightsPassengersInfo.segments.some(function (segment) {
                return segment.detailedType === CheckinAppConstants.SHUTTLE_SEGMENTS_TYPES.CONFIRMED;
            });

            if (hasConfirmedFlight) {
                CommonsModalService.showWaitingModal('modal-mensaje-wait');
            }
        }

        function configureQuadrigam (flightsPassengersInfo) {
            const quadrigam = flightsPassengersInfo.dataLayer.isAirShuttle
                ? CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS_PA
                : CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS;

            angular.extend(flightsPassengersInfo.dataLayer, {
                quadrigam: quadrigam
            });
        }

        function scheduleDatalayerInitialization (
            flightsPassengersInfo,
            headerInfo,
            headerModel
        ) {
            $timeout(function () {
                const dataLayer = flightsPassengersInfo.dataLayer;
                const quadrigam = getFinalQuadrigam(
                    dataLayer.quadrigam
                );
                vm.isFlowDuplicated = isFlowDuplicated(flightsPassengersInfo.segments);
                vm.isPaFlow = CommonsSessionStorageService.get('isPaFlow') || vm.model.segmentsPassengersInfo.onlyShuttleSegments;        
                vm.showBtnsDuplicated = vm.isFlowDuplicated && !vm.isPaFlow && !vm.isBpSubscriptionMode;

                checkTitlePagePA(quadrigam);

                updateDigitalData({
                    quadrigam: quadrigam,
                    bookingClass: dataLayer.datalayerBookingType,
                    isAirShuttle: getAirShuttleValue(dataLayer.isAirShuttle),
                    flightHaul: flightsPassengersInfo.flightHaul
                });

                initHeader({
                    headerInfo: headerInfo,
                    headerModel: headerModel
                });

                ModalService.isNotWaiting();
                $rootScope.timeSession.startTime = dayjs();

                vm.showContinueButton = shouldShowContinueButton(flightsPassengersInfo.onlyShuttleSegments);
            });
        }

        function getFinalQuadrigam (currentQuadrigam) {
            const isFlightsPassengersQuadrigam = currentQuadrigam === CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS;

            if (!isFlightsPassengersQuadrigam) {
                return currentQuadrigam;
            }

            if (vm.isFlowDuplicated) {
                return CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS_DUPLICATED;
            }

            return CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS;
        }

        function getAirShuttleValue (isAirShuttle) {
            if (isAirShuttle) {
                return CkiDatalayerConstants.DATALAYER_VALUES.YES;
            }

            return CkiDatalayerConstants.DATALAYER_VALUES.NO;
        }

        function shouldShowContinueButton (onlyShuttleSegments) {
            return !vm.isFlowDuplicated || onlyShuttleSegments || vm.isBpSubscriptionMode;
        }

        function closeWaitingModal () {
            ModalService.isNotWaiting();
        }

        function isFlowDuplicated (segments = []) {
            const existChecked = segments.some((segment) => {
                return segment.segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.CHECKED;
            });

            if (existChecked) {
                CommonsSessionStorageService.set('isFlowDuplicated', true);
            }

            return existChecked;
        }

        function passengerRightsRedirection () {
            RedirectionService.newNavigation($window.location.origin + CheckinAppConstants.WEB_CENTER_REDIRECT.REDIRECTION_START + CheckinAppConstants.WEB_CENTER_REDIRECT.MARKET_QUERY + $rootScope.appMarket + CheckinAppConstants.WEB_CENTER_REDIRECT.LANGUAGE_QUERY + $rootScope.appLang + CheckinAppConstants.WEB_CENTER_REDIRECT.QUADRIGAM_QUERY + CheckinAppConstants.WEB_CENTER_REDIRECT.PASSENGER_RIGHTS, CheckinAppConstants.WEB_CENTER_REDIRECT.BLANK);
        }
        function addPrimaryContactInfoToBookingInfo (data: any) {
            const bookingData = CommonsSessionStorageService.get('bookingInfo') as CkiBookingInfo.BookingInfo | null;
            if (!bookingData) return;


            const primaryContactInfo = data?.flightsPassengersInfo?.passengers?.[0]?.contactData;
            if (!primaryContactInfo) return;


            const primaryContact: CkiBookingInfo.PrimaryContact = {
                email: primaryContactInfo.email ?? '',
                phone: primaryContactInfo.phone?.number ?? '',
                phonePrefix: primaryContactInfo.phone?.countryCode ?? ''
            };


            const updatedBookingData: CkiBookingInfo.BookingInfo = {
                ...bookingData,
                primaryContact
            };

            CommonsSessionStorageService.set('bookingInfo', updatedBookingData);
        }


        function checkSelectedSegments (event, selectedIndex) {
            let segmentIndex, selectedSegmentsCount = 0;
            const segments = vm.model.segmentsPassengersInfo.segments;
            const segmentSelected = segments[selectedIndex];
            const statusSelected = segmentSelected.isSelected;
            const existCheckinSegmentsInGroup = Array.isArray(vm.model.segmentsPassengersInfo?.checkinSegmentsInGroup?.segments) && vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments.length > 0;
            if (segmentSelected && selectedIndex === 0 && selectedSegmentsCount === 0) {
                segmentSelected.isSelected = true;
                if(existCheckinSegmentsInGroup && vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments.includes(segmentSelected.id)) {
                    checkSegmentsInGroup(selectedIndex, statusSelected);
                } else {
                    ModalService.showGenericModal({ message: 'IBCOAC_ERROR_FIRSTFLIGHT_BODY', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.NO_PREVIOUS_SEGMENT_WARNING });
                }
            } else {
                for (segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
                    if (segments[segmentIndex].isSelected) {
                        selectedSegmentsCount++;
                    }
                    if (selectedIndex !== 0 && segmentIndex > selectedIndex && !statusSelected) {
                        segments[segmentIndex].isSelected = statusSelected;
                    } else if (selectedIndex !== 0 && segmentIndex < selectedIndex && statusSelected) {
                        if (segments[segmentIndex].segmentStatus !== CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.NOT_AVAILABLE) {
                            segments[segmentIndex].isSelected = statusSelected;
                        }
                    }
                }
                checkSegmentsInGroup(selectedIndex, statusSelected);
            }

            if (segmentSelected && selectedIndex !== 0 && selectedSegmentsCount === 0) {
                segmentSelected.isSelected = true;
                ModalService.showGenericModal({ message: 'IBCOAC_ERROR_FIRSTFLIGHT_BODY', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.NO_PREVIOUS_SEGMENT_WARNING });
            }

            checkPassengersItems();
        }

        function checkSegmentsInGroup (selectedIndex, statusSelected) {
            let segmentIndex, segmentInGroupIndex, showSegmentsInGroupAdvice = false;
            if (vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments.indexOf(vm.model.segmentsPassengersInfo.segments[selectedIndex].id) !== -1) {
                for (segmentInGroupIndex = 0; segmentInGroupIndex < vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments.length; segmentInGroupIndex++) {
                    for (segmentIndex = 0; segmentIndex < vm.model.segmentsPassengersInfo.segments.length; segmentIndex++) {
                        if (vm.model.segmentsPassengersInfo.segments[segmentIndex].id === vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments[segmentInGroupIndex]) {
                            vm.model.segmentsPassengersInfo.segments[segmentIndex].isSelected =
                                !(vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments.indexOf(vm.model.segmentsPassengersInfo.segments[0].id) === -1
                                    && (vm.model.segmentsPassengersInfo.segments[0].segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.AVAILABLE || vm.model.segmentsPassengersInfo.segments[0].segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.CHECKED))
                                || statusSelected;
                            showSegmentsInGroupAdvice = true;
                        }
                    }
                }
            }
            if (vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.segments.length > 1 && showSegmentsInGroupAdvice && !statusSelected) {
                ModalService.showGenericModal({ message: 'IBCOAC_ERROR_CHECKINGROUP_MESSAGE', needsTranslate: true, info: vm.model.segmentsPassengersInfo.checkinSegmentsInGroup.info, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.NO_PREVIOUS_SEGMENT_WARNING });
            }
        }

        function checkSelectedPassengers (event, index) {
            let segmentIndex, pasStatusIndex, pasIndex, selectedPas = 0, someAdult = false, showContactData = 0, showData = false, firstAvailableIndex = null, availableContactDataPassengers = 0, availableEmergencyDataPassengers = 0;
            for (pasIndex = 0; pasIndex < vm.model.segmentsPassengersInfo.passengers.length; pasIndex++) {
                if (vm.model.segmentsPassengersInfo.passengers[pasIndex].isSelected) {
                    firstAvailableIndex = firstAvailableIndex !== null ? firstAvailableIndex : pasIndex;
                    selectedPas++;
                    if (vm.model.segmentsPassengersInfo.passengers[pasIndex].type === CheckinAppConstants.PASSENGERS_TYPES.ADULT) {
                        someAdult = true;
                    }
                    updateDataStatus(vm.model.segmentsPassengersInfo.passengers[pasIndex]);
                }

                for (segmentIndex = 0; segmentIndex < vm.model.segmentsPassengersInfo.segments.length; segmentIndex++) {
                    for (pasStatusIndex = 0; pasStatusIndex < vm.model.segmentsPassengersInfo.segments[segmentIndex].passengersStatus.length; pasStatusIndex++) {
                        if (vm.model.segmentsPassengersInfo.segments[segmentIndex].passengersStatus[pasStatusIndex].id === vm.model.segmentsPassengersInfo.passengers[pasIndex].id) {
                            vm.model.segmentsPassengersInfo.segments[segmentIndex].passengersStatus[pasStatusIndex].isSelected = vm.model.segmentsPassengersInfo.passengers[pasIndex].isSelected;
                        }
                    }
                }
            }
            if (selectedPas === 0) {
                ModalService.showGenericModal({ message: 'IBCOAC_ERROR_PASSENGER_BODY', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.AT_LEAST_ONE_PASSENGER_WARNING });
                vm.model.segmentsPassengersInfo.passengers[index].isSelected = true;
                for (segmentIndex = 0; segmentIndex < vm.model.segmentsPassengersInfo.segments.length; segmentIndex++) {
                    if (vm.model.segmentsPassengersInfo.segments[segmentIndex].isSelected)
                        vm.model.segmentsPassengersInfo.segments[segmentIndex].passengersStatus[index].isSelected = true;
                }
                updateDataStatus(vm.model.segmentsPassengersInfo.passengers[index]);
                selectedPas++;
            } else if (selectedPas > 9) {
                ModalService.showGenericModal({ message: 'IBCOAC_ERROR_MAXIMUM_PASSENGER_BODY', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.EXCEDED_TOTAL_PASSENGER_WARNING });
                vm.model.segmentsPassengersInfo.passengers[index].isSelected = false;
            } else if (!someAdult) {
                ModalService.showGenericModal({ message: 'IBCOAC_MODAL_PASSENGERS_AT_LEAST_ONE_ADULT_MESSAGE', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.AT_LEAST_ONE_PASSENGER_WARNING });
                vm.model.segmentsPassengersInfo.passengers[index].isSelected = true;
                updateDataStatus(vm.model.segmentsPassengersInfo.passengers[index]);
                firstAvailableIndex = index;
                selectedPas++;
            }
            firstAvailableIndex = firstAvailableIndex !== null ? firstAvailableIndex : index;
            if ((vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.status || vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.status)
                && vm.model.segmentsPassengersInfo.passengers[index].id === vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.showId) {
                showData = true;
                showDataFirstAvailablePassenger(firstAvailableIndex);
            }
            vm.model.segmentsPassengersInfo.activeFields.showContactData = (selectedPas > 0 && showContactData > 0) || showData;

            vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.showId = vm.model.segmentsPassengersInfo.passengers[firstAvailableIndex].id;
            vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.show = selectedPas > 1 && availableContactDataPassengers > 1;
            vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.status =
                vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.status && selectedPas > 1 && availableContactDataPassengers > 1;
            vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.showId = vm.model.segmentsPassengersInfo.passengers[firstAvailableIndex].id;
            vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.show = selectedPas > 1 && availableEmergencyDataPassengers > 1;
            vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.status =
                vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.status && selectedPas > 1 && availableEmergencyDataPassengers > 1;

            if ((vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.status || vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.status)
                && vm.model.segmentsPassengersInfo.passengers[index].id === vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.showId) {
                vm.model.segmentsPassengersInfo.passengers[index].fieldStatus.contactData.show = true;
            }
            updateUseContactDataForAll(index);

            function updateDataStatus (passenger) {
                if (passenger.isSelected) {
                    if (passenger.fieldStatus.contactData.show || passenger.fieldStatus.emergencyData.show) {
                        showContactData++;
                    }
                    if (passenger.fieldStatus.contactData.available) {
                        availableContactDataPassengers++;
                    }
                    if (passenger.fieldStatus.emergencyData.available) {
                        availableEmergencyDataPassengers++;
                    }
                }
            }

            function showDataFirstAvailablePassenger (firstAvailableIndex) {
                let pIndex = firstAvailableIndex, pfound = false, auxPas;
                while (!pfound && pIndex < vm.model.segmentsPassengersInfo.passengers.length) {
                    auxPas = vm.model.segmentsPassengersInfo.passengers[pIndex];
                    if (auxPas.isSelected && (auxPas.fieldStatus.contactData.available || auxPas.fieldStatus.emergencyData.available)) {
                        auxPas.fieldStatus.contactData.show = auxPas.fieldStatus.contactData.available;
                        auxPas.fieldStatus.emergencyData.show = auxPas.fieldStatus.emergencyData.available;
                        pfound = true;
                    }
                    pIndex++;
                }
                return pfound;
            }
        }

        function useContactDataForAll (event, status, pasId, type, updateEmergency) {
            let pasIndex, showedEmergencyInfo, firstAvailablePas = null;
            for (pasIndex = 0; pasIndex < vm.model.segmentsPassengersInfo.passengers.length; pasIndex++) {
                if (vm.model.segmentsPassengersInfo.passengers[pasIndex].pasStatus.available) {
                    if (type === 'additionalData' && vm.model.segmentsPassengersInfo.passengers[pasIndex].id !== vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.showId
                        && vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.contactData.available) {
                        vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.contactData.show = !status;
                    } else if (type === 'emergencyData' && vm.model.segmentsPassengersInfo.passengers[pasIndex].id !== vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.showId
                        && vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.emergencyData.available) {
                        vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.emergencyData.show = !status;
                    }
                    if (vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.emergencyData.show) {
                        showedEmergencyInfo = pasIndex;
                    }
                    if (vm.model.segmentsPassengersInfo.passengers[pasIndex].isSelected && firstAvailablePas === null && (vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.contactData.available || vm.model.segmentsPassengersInfo.passengers[pasIndex].fieldStatus.emergencyData.available)) {
                        firstAvailablePas = pasIndex;
                    }
                }
            }
            if (updateEmergency && firstAvailablePas && showedEmergencyInfo && vm.model.segmentsPassengersInfo.passengers[firstAvailablePas].fieldStatus.emergencyData.available && firstAvailablePas !== showedEmergencyInfo) {
                vm.model.segmentsPassengersInfo.passengers[firstAvailablePas].fieldStatus.emergencyData.show = true;
            }
        }

        function updateUseContactDataForAll (index) {
            useContactDataForAll('event', vm.model.segmentsPassengersInfo.activeFields.additionalInfoUseForAllCheck.status, vm.model.segmentsPassengersInfo.passengers[index].id, 'additionalData', true);
            useContactDataForAll('event', vm.model.segmentsPassengersInfo.activeFields.emergencyDataUseForAllCheck.status, vm.model.segmentsPassengersInfo.passengers[index].id, 'emergencyData', true);
        }

        function updateShuttleOptions (event, selectedSegment) {
            const isFlowShuttle: boolean = selectedSegment?.generalType === CheckinAppConstants.FLIGHT_TYPES.SHUTTLE;
            const isFlyNow: boolean = selectedSegment?.passengersStatus.find((passenger) => passenger.flyNow === true);
            const selectedSegmentIndex: number = vm.model.segmentsPassengersInfo.segments.findIndex((segment) => segment.id === selectedSegment.id);
            vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex = selectedSegmentIndex;
            vm.model.segmentsPassengersInfo.checkinAvailable = (isFlowShuttle && isFlyNow);
        }

        function openModal (template) {
            ModalService.showGenericModal({ idModal: template }, false, template).result.then(angular.noop, angular.noop);
        }

        function openForbiddenObjectsModal (template) {
            ModalService.showGenericModal({ idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.ACCEPT_FORBIDDEN_ITEMS }, false, template).result.then(() => {
                vm.model.conditions = true;
            }, angular.noop);
        }

        function checkValidForm (pasForm) {
            pasForm.$setSubmitted();
            vm.model.pasform = pasForm;

            return validatePassengerCardNumbers(vm.model.pasform);
        }

        function callUpdateFlightsPassengersServices (pasForm) {
            let optionsIndex, printSelected = false, manageCkiSelected = false, i = 0, earlySegments, dataNextFlow = {};
            const isValidForm = checkValidForm(pasForm);

            if (isValidForm) {
                earlySegments = IbSeatEarlyCheckinService.checkEarlySegments(vm.model.segmentsPassengersInfo.passengers, vm.model.segmentsPassengersInfo.segments);
                setSegmentsSelected();
                FlightsPassengersService.getWCSPhones();
                showDisclaimerSvanModal();
            }

            /**
             * Show disclaimer passenger ITEMS modal
             */
            function showDisclaimerSvanModal () {
                const modelModal = {
                    title: {
                        message: $filter('translate')('MODAL_DISCLAIMER_SVAN_TITLE'),
                        needsTranslate: true
                    },
                    needsTranslate: false,
                    message: '', //buildLitAndHtml(),
                    showButtonCancel: true
                };
                const statusPass = {
                    isSelected: false,
                    isChecked: false,
                    isAvailable: false,
                    existSvan: false
                };

                const buildLitAndHtml = () => {
                    const tagsInfo = {
                        ul: {
                            tag: 'ul',
                            class: 'ib-list ib-list--square ib-list--gray u-ml-xmedium u-mb-xmedium u-ml-none-xs'
                        },
                        li: {
                            tag: 'li',
                            class: 'ib-list__item u-pl-none'
                        },
                        bold: {
                            tag: 'span',
                            class: 'ib-text ib-text--inline ib-text--bold'
                        },
                        p1: {
                            tag: 'p',
                            class: 'ib-text ib-text--block'
                        },
                        p2: {
                            tag: 'p',
                            class: 'ib-text ib-text--block u-mb-xmedium'
                        },
                        span: {
                            tag: 'span',
                            class: 'ib-text'
                        }
                    };
                    const LITERALS = {
                        TEXT_1: 'MODAL_DISCLAIMER_SVAN_TEXT_1',
                        TEXT_2: 'MODAL_DISCLAIMER_SVAN_TEXT_2',
                        TEXT_3_UL: [
                            'MODAL_DISCLAIMER_SVAN_TEXT_3_UL_LI_1',
                            'MODAL_DISCLAIMER_SVAN_TEXT_3_UL_LI_2'
                        ],
                        TEXT_4: 'MODAL_DISCLAIMER_SVAN_TEXT_4',
                        TEXT_5: 'MODAL_DISCLAIMER_SVAN_TEXT_5',
                        TEXT_6_UL: [
                            'MODAL_DISCLAIMER_SVAN_TEXT_6_UL_LI_1',
                            'MODAL_DISCLAIMER_SVAN_TEXT_6_UL_LI_2',
                            'MODAL_DISCLAIMER_SVAN_TEXT_6_UL_LI_3',
                            'MODAL_DISCLAIMER_SVAN_TEXT_6_UL_LI_4'
                        ],
                        TEXT_7: 'MODAL_DISCLAIMER_SVAN_TEXT_7'
                    };
                    let result = '';

                    for (const key in LITERALS) {
                        if (Object.prototype.hasOwnProperty.call(LITERALS, key)) {
                            const element = LITERALS[key];
                            if (key.indexOf('_UL') !== -1 && Array.isArray(element)) {
                                result += '<ul class="' + tagsInfo.ul.class + '">';
                                for (let i = 0; i < element.length; i++) {
                                    const li = element[i];
                                    result += $filter('literalFormatter')($filter('translate')(li), tagsInfo);
                                }
                                result += '</ul>';
                            } else {
                                result += $filter('literalFormatter')($filter('translate')(element), tagsInfo);
                            }
                        }
                    }

                    return result;
                };
                const segmentsSelected = CommonsSessionStorageService.get('segmentsSelected');
                const itemList: string[] = Object.values(CheckinAppConstants.ITEMS_TYPES);
                const items: any[] = [];
                let showModalDisclaimer = false;

                itemList.forEach((item: string) => {
                    items.push({
                        code: item,
                        passengerSelected: false,
                        hasPassenger: false,
                        showModal: false
                    });
                });

                for (let i = 0; i < vm.model.segmentsPassengersInfo.passengers.length; i++) {
                    const passenger = vm.model.segmentsPassengersInfo.passengers[i] || {};

                    //Check if it is marked passenger to check-in and exist item SVAN
                    statusPass.isAvailable = (passenger?.pasStatus?.available);
                    statusPass.isSelected = passenger.isSelected;

                    if (Array.isArray(segmentsSelected)) {
                        for (let j = 0; j < segmentsSelected.length; j++) {
                            const segmentSelected = segmentsSelected[j];
                            for (let k = 0; k < segmentSelected.passengersStatus.length; k++) {
                                const pass = segmentSelected.passengersStatus[k];
                                items.forEach(item => {
                                    if(!item.hasPassenger){
                                        item.hasPassenger = pass.items?.includes(CheckinAppConstants.ITEMS_TYPES[item.code]);
                                    }
                                });
                                if (passenger.isSelected) {
                                    items.forEach(item => {
                                        if(!item.passengerSelected){
                                            item.passengerSelected = passenger.items?.includes(CheckinAppConstants.ITEMS_TYPES[item.code]);
                                        }
                                    });
                                }
                                if (pass.id === passenger.id && pass.isSelected) {
                                    if (pass.status === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.CHECKED && !statusPass.isChecked) {
                                        statusPass.isChecked = true;
                                    }

                                    if (!statusPass.isChecked) {
                                        statusPass.existSvan = (!statusPass.existSvan && Array.isArray(pass.items) && pass.items.includes(CheckinAppConstants.ITEMS_TYPES.SVAN));
                                    }
                                }
                            }
                        }
                    }

                    if (!showModalDisclaimer && !statusPass.isChecked && statusPass.isAvailable && statusPass.existSvan && statusPass.isSelected) {
                        showModalDisclaimer = true;
                    }
                }

                if (showModalDisclaimer) {
                    modelModal.message = buildLitAndHtml();
                    ModalService.showGenericModal(modelModal, false, 'cki-generic-info-modal').result.then(showDangerousObjectsModal, angular.noop);
                } else {
                    showDangerousObjectsModal();
                }
            }
            /**
             * This function displays the modal when the selected passenger is checkable and so is the flight. If there is a group
             * only if one of the selected group is checkable (not already checked), the modal displays for that user who has not seen it before.
             */
            function showDangerousObjectsModal () {
                let j, showDOModal = false, showModal = false, showModalPA = false, showDOModalPA = false, openModalDangerous = false;
                if (!vm.model.segmentsPassengersInfo.whatToDo.active) {
                    if (vm.model.segmentsPassengersInfo.onlyShuttleSegments) {
                        if (vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex].segmentStatus !== CheckinAppConstants.GENERAL_STATUS.CHECKED) {
                            showModalPA = true;
                            for (j = 0; j < vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex].passengersStatus.length; j++) {
                                if (vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex].passengersStatus[j].isSelected && (vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex].passengersStatus[j].status !== CheckinAppConstants.GENERAL_STATUS.CHECKED)) {
                                    showDOModalPA = true;
                                }
                            }
                            openModalDangerous = (showModalPA && showDOModalPA);
                        }
                    } else {
                        for (i = 0; i < vm.model.segmentsPassengersInfo.segments.length; i++) {
                            if (vm.model.segmentsPassengersInfo.segments[i].isSelected && vm.model.segmentsPassengersInfo.segments[i].segmentStatus !== CheckinAppConstants.GENERAL_STATUS.CHECKED) {
                                showModal = true;
                                for (j = 0; j < vm.model.segmentsPassengersInfo.segments[i].passengersStatus.length; j++) {
                                    if (vm.model.segmentsPassengersInfo.segments[i].passengersStatus[j].isSelected && (vm.model.segmentsPassengersInfo.segments[i].passengersStatus[j].status !== CheckinAppConstants.GENERAL_STATUS.CHECKED)) {
                                        showDOModal = true;
                                    }
                                }
                            }
                        }
                        openModalDangerous = (showModal && showDOModal);
                    }
                }

                let userLogged;
                if (CommonsUserUtilsService.isIbZero()) {
                    userLogged = false;
                } else {
                    userLogged = CommonsSessionStorageService.get('userLogged');
                }
                const isUserInBook = checkUserInBook(vm.model.segmentsPassengersInfo.passengers);
                const usrData: CustomerData = CommonsSessionStorageService.get('customerData');
                const userLoggedIndex = checkUserLoggedIndex(vm.model.segmentsPassengersInfo.passengers);
                let contactDataEqual;
                if (userLogged && vm.model.segmentsPassengersInfo.activeFields.showContactData && isUserInBook) {
                    let serviceToCall: () => angular.IPromise<any>;
                    if (CommonsUserUtilsService.isIbPlus()) {
                        serviceToCall = IBCContactDataService.getContactData;
                    } else {
                        serviceToCall = IBCContactDetailsZeroService.getContactDetailsData;
                    }
                    serviceToCall().then((data) => {
                        CommonsSessionStorageService.set('contactDetails', data.data);
                    });

                    const newEmail = vm.model.segmentsPassengersInfo.passengers[userLoggedIndex].contactData.email;
                    const newPhone = vm.model.segmentsPassengersInfo.passengers[userLoggedIndex].contactData.phone.number;
                    const newPrefix = '+' + vm.model.segmentsPassengersInfo.passengers[userLoggedIndex].contactData.phone.countryCode;
                    const currentEmailAddress = usrData.personalInfo.contactEmail;
                    const currentPhoneNumber = usrData.personalInfo.telecomAddresses.number;
                    const currentPrefixNumber = usrData.personalInfo.telecomAddresses.countryDiallingCode;

                    contactDataEqual = (currentEmailAddress === newEmail) && (currentPhoneNumber === newPhone) && (currentPrefixNumber === newPrefix);
                } else {
                    contactDataEqual = true;
                }

                if (openModalDangerous && !vm.isCarrierConnect) {
                    ModalService.openDangerousObjectsModal(dataNextFlow).result.then(() => { continueFlow(); }, angular.noop);
                } else (
                    continueFlow()
                );
            }


            function checkUserLoggedIndex (passengers) {
                const frequentFlyer = CommonsSessionStorageService.get('FFUser');
                let result = null;
                for (let i = 0; i < passengers.length; i++) {
                    if ((passengers[i].frequentFlyer && passengers[i].frequentFlyer.info && passengers[i].frequentFlyer.info.number !== undefined && passengers[i].frequentFlyer.info.number !== null) && frequentFlyer !== null && frequentFlyer !== undefined && passengers[i].frequentFlyer.info.number.replace(/^0+/, '') === frequentFlyer.replace(/^0+/, '')) {
                        result = i;
                    }
                }
                return result;
            }

            function haveToSaveData (contactDataEqual, userLogged, showContactData) {
                const isSoftUser = CommonsUserUtilsService.isSoftUser();
                return contactDataEqual && userLogged && showContactData && !isSoftUser;
            }

            function checkContactDetails (model, usrData, userLoggedIndex, openModalDangerous) {
                CommonsModalService.showWaitingModal('modal-mensaje-wait');
                const email = model.passengers[userLoggedIndex].contactData.email;
                const prefix = model.passengers[userLoggedIndex].contactData.phone.countryCode;
                const number = model.passengers[userLoggedIndex].contactData.phone.number;
                const contactDetails = CommonsSessionStorageService.get('contactDetails');
                const newContactData = {
                    email: email,
                    phone: {
                        prefix: prefix,
                        number: number
                    }
                };

                if (CommonsUserUtilsService.isIbPlus()) {
                    IBCContactDataService.updateContactData(FlightsPassengersTransformer.generateUpdataContactDetails(newContactData, contactDetails)).then(() => {
                        CommonsModalService.finishWaiting();
                        CommonsModalService.showGenericModal(true, 'generic-info-modal.html', CheckinAppConstants.SAVE_CORRECT_LITERALS, null).result.then(() => {
                            const newUserData = {
                                ...usrData
                            };
                            newUserData.personalInfo.contactEmail = email;
                            newUserData.personalInfo.telecomAddresses.number = number;
                            CommonsSessionStorageService.set('customerData', newUserData);
                            if (openModalDangerous) {
                                ModalService.openDangerousObjectsModal(dataNextFlow).result.then(() => { continueFlow(); }, angular.noop);
                            } else (
                                continueFlow()
                            );
                        });
                    }, () => {
                        CommonsModalService.finishWaiting();
                        CommonsModalService.showGenericModal(true, 'generic-info-modal.html', CheckinAppConstants.SAVE_ERROR_LITERALS, null).result.then(() => { }, () => { });
                    });
                } else {
                    CommonsModalService.finishWaiting();
                    CommonsModalService.showGenericModal(true, 'generic-info-modal.html', CheckinAppConstants.SAVE_ERROR_LITERALS, null).result.then(() => { continueFlow(); }, () => { continueFlow(); });
                }
            }

            function continueFlow () {
                if (vm.model.pasform.$valid) {
                    if (vm.model.segmentsPassengersInfo.whatToDo && vm.model.segmentsPassengersInfo.whatToDo.active && vm.model.segmentsPassengersInfo.whatToDo.options) {
                        for (optionsIndex = 0; optionsIndex < vm.model.segmentsPassengersInfo.whatToDo.options.length; optionsIndex++) {
                            if (vm.model.segmentsPassengersInfo.whatToDo.options[optionsIndex].id === 'print' && vm.model.segmentsPassengersInfo.whatToDo.options[optionsIndex].isSelected) {
                                printSelected = true;
                            } else if (vm.model.segmentsPassengersInfo.whatToDo.options[optionsIndex].id === 'manageCki' && vm.model.segmentsPassengersInfo.whatToDo.options[optionsIndex].isSelected) {
                                manageCkiSelected = true;
                            }
                        }
                        printSelected = printSelected && !manageCkiSelected;
                    }

                    if (vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex !== null && vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex]) {
                        UpdateFlightsPassengerInfoService.updateFlightsPassengerInfo(vm.model.segmentsPassengersInfo.passengers, vm.model.segmentsPassengersInfo.segments, printSelected, vm.model.segmentsPassengersInfo.activeFields, vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex], earlySegments);
                    } else {
                        UpdateFlightsPassengerInfoService.updateFlightsPassengerInfo(vm.model.segmentsPassengersInfo.passengers, vm.model.segmentsPassengersInfo.segments, printSelected, vm.model.segmentsPassengersInfo.activeFields, null, earlySegments);
                    }
                }
            }
        }

        
        function checkUserInBook (passengers) {
            const frequentFlyer = CommonsSessionStorageService.get('FFUser');

            if (!frequentFlyer || !Array.isArray(passengers)) {
                return false;
            }

            const normalizedFrequentFlyer = String(frequentFlyer).replace(/^0+/, '');

            return passengers.some((passenger) => {
                const passengerNumber = passenger?.frequentFlyer?.info?.number;

                return passengerNumber != null &&
                    String(passengerNumber).replace(/^0+/, '') === normalizedFrequentFlyer;
            });
        }

        /**
         * Comes back to the first flow page
         */
        function goBack (pasForm) {
            pasForm.$setSubmitted();
            $window.location.href = $window.location.origin + $window.location.pathname;
        }

        function openModalNotAvailablePassenger (event, info) {
            ModalService.showGenericModal({ message: info.reason, needsTranslate: false, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.NO_PREVIOUS_SEGMENT_WARNING });
        }

        function openSegmentInfo (event, info) {
            const infoApiEsta = CheckinFlowService.checkApisEsta();

            if (infoApiEsta.showTextEsta) {
                ModalService.showGenericModal({ message: infoApiEsta.text, needsTranslate: false, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.UNAVAILABLE_INFO_SEGMENT, title: { needsTranslate: true } }, null, 'cki-generic-info-modal');
            } else {
                ModalService.showGenericModal({ message: info, needsTranslate: false, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.UNAVAILABLE_INFO_SEGMENT });
            }

        }

        function selectedShuttleOption (event, option, status) {
            if (status) {
                vm.model.segmentsPassengersInfo.segments[vm.model.segmentsPassengersInfo.selectedShuttleSegmentIndex].whatToDo.selectedBlock = option;
            }
        }

        function checkPassengersItems () {
            vm.model.segmentsPassengersInfo.passengers.forEach(passenger => {
                passenger.items = [];
            });
            vm.model.segmentsPassengersInfo.segments.forEach(segment => {
                segment.passengersStatus.forEach(passenger => {
                    if (passenger.items.length > 0) {
                        const itemsList = new Set();
                        passenger.items.forEach(item => {
                            if (!itemsList.has(item)){
                                const passIndex = vm.model.segmentsPassengersInfo.passengers.findIndex(pass => passenger.id === pass.id);
                                if (passIndex !== -1) {
                                    vm.model.segmentsPassengersInfo.passengers[passIndex].items.push(item);
                                    itemsList.add(item);
                                }
                            }
                        });
                    }
                });
            });
            $scope.$broadcast('checkItemsEvent');
        }

        function getPassengerStatus (passenger) {
            const searchByID = (pass) => { return passenger.id === pass.id;};
            const passengerStatus = vm.model?.segmentsPassengersInfo?.passengers?.find(searchByID);
            return passengerStatus;
        }

        function inputBlurFF (event, data) {
            if (vm.model.errorFF.status && data.idTag && vm.model.pasform[data.idTag]?.$error?.check) {
                const dataForm = vm.model.pasform[data.idTag];
                const errorPass = vm.model.errorFF.passengers.find(passenger => {return passenger.id === data.id ? data.id : null;});
                const isEqualNumError = (errorPass?.number === vm.model?.segmentsPassengersInfo?.passengers[data.index]?.frequentFlyer?.info?.number);
                dataForm.$error.check.status = isEqualNumError;
                dataForm.$submitted = isEqualNumError;
                dataForm.$invalid = isEqualNumError;
                dataForm.$valid = !isEqualNumError;
            }
        }

        function validateFrequentFlyer (event, error) {
            const scrollToError = (id) => {
                $timeout(() => {
                    angular.element('html, body').animate({ scrollTop: angular.element(`#${id}`).offset().top - 70 });
                });
            };
            let idScroll = null;
            vm.model.pasform.$valid = !error?.status;

            if(Array.isArray(error?.ids)) {
                error.ids.forEach(id => {
                    id = id > 0 ? --id : id;
                    const cardNumPass = `card_number_passenger_${id.toString()}`;
                    if(!idScroll) idScroll = cardNumPass;
                    vm.model.pasform[cardNumPass].$invalid = true;
                    vm.model.pasform[cardNumPass].$error.check = {
                        status: true,
                        message: error.message
                    };
                    vm.model.errorFF.status = true;
                    vm.model.errorFF.passengers.push({
                        id: vm.model.segmentsPassengersInfo.passengers[id]?.id,
                        number: vm.model.segmentsPassengersInfo.passengers[id]?.frequentFlyer?.info?.number ?? null
                    });
                });
            }
            scrollToError(idScroll);
        }

        function validatePassengerCardNumbers (form) {
            const hasInvalidCardNumber = Object.keys(form)
                .filter(key => key.startsWith('card_number_passenger_'))
                .some(key => form[key].$invalid);

            if (hasInvalidCardNumber && form.$valid) {
                form.$valid = false;
            }

            return form.$valid;
        }
        function getCarrierConnect () {
            const bookingInfo = CommonsSessionStorageService.get('bookingInfo');
            return bookingInfo?.carrierConnectEnabled || false;
        }

        function isDisableButton () {
            if (shouldDisableForCarrierConnect()) {
                return true;
            }

            return shouldDisableForSelectedShuttle();
        }

        function shouldDisableForCarrierConnect () {
            return vm.isCarrierConnect && !vm.model.isCarrierCheckboxChecked;
        }

        function shouldDisableForSelectedShuttle () {
            const segmentsPassengersInfo = vm.model.segmentsPassengersInfo;

            if (!hasSelectedShuttleSegment(segmentsPassengersInfo)) {
                return false;
            }

            const selectedSegment = getSelectedShuttleSegment(segmentsPassengersInfo);
            const isDisable = hasNoWhatToDoBlockSelected(selectedSegment) && isNotOpenSegment(selectedSegment);

            return isDisable;
        }

        function hasSelectedShuttleSegment (segmentsPassengersInfo) {
            return segmentsPassengersInfo.selectedShuttleSegmentIndex !== null;
        }

        function getSelectedShuttleSegment (segmentsPassengersInfo) {
            return segmentsPassengersInfo.segments[
                segmentsPassengersInfo.selectedShuttleSegmentIndex
            ];
        }

        function hasNoWhatToDoBlockSelected (segment) {
            return !segment?.whatToDo?.selectedBlock?.id;
        }

        function isNotOpenSegment (segment) {
            return segment?.detailedType !== 'OPEN';
        }


        function checkDangerousObjectsCarrier () {
            const bookingInfo = CommonsSessionStorageService.get('bookingInfo');

            const operatingFlightCode = getOperatingFlightCode(bookingInfo);
            formatDangerousGoodsInformation(operatingFlightCode);
        }

        function getOperatingFlightCode (bookingInfo) {
            const outwardSegments = bookingInfo?.outwardSegments || [];
            const returnSegments = bookingInfo?.returnSegments || [];

            const companyCode = findOperatingFlight(outwardSegments) || findOperatingFlight(returnSegments) || '';
            return companyCode;
        }

        function findOperatingFlight (segments) {
            for (const segment of segments) {
                const code = segment?.operatingFlightNumber?.company?.code;
                if (CheckinAppConstants?.AIRLINE_CODES.includes(code)) {
                    return code;
                }
            }
            return null;
        }

        function formatDangerousGoodsInformation (code = '') {
            const link = `https://link.oneworld.com/redirect/dangerous-goods/${code}`;
            const tagsInfo = {
                link: {
                    tag: 'a',
                    href: link,
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--inline'
                }
            };

            vm.keyDangerousObjectsCarrier = $filter('literalFormatter')(
                $filter('translate')(vm.keyDangerousObjectsCarrier),
                tagsInfo
            );
        }

        function updateDigitalData ({quadrigam, bookingClass, isAirShuttle, flightHaul}) {
            /* INIT DELETE GA4 MIGRATION*/
            const extendedObject = {};
            extendedObject[CkiDatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = bookingClass;
            extendedObject[CkiDatalayerConstants.DATALAYER_INFO.IS_AIR_SHUTTLE] = isAirShuttle;
            extendedObject[CkiDatalayerConstants.DATALAYER_INFO.FLIGHT_HAUL] = getFlightHaul(flightHaul);
            CkiDatalayerUtilsService.updateAircraft(IbPassengerBookingUtilsService.setAircraftDatalayer());
            CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, extendedObject, IbSessionConfigService.isUserLogged());
            CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FIN DELETE GA4 MIGRATION*/

            const extendedDigitalDataInfo = {};
            extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.BOOKING_CLASS] = bookingClass;
            extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.FLIGHT_HAUL] = getFlightHaul(flightHaul);
            CkiDataLayerService.setProcessAndStep(quadrigam);
            CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
            CkiDatalayerUtilsService.updateDatalayerViewEvent();
        
            MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, quadrigam);
            $rootScope.$broadcast('updateDatalayer');
            $rootScope.$broadcast('sendUpdateToMonetate');
        }

        function checkTitlePagePA (quadrigam: string) {
            if (quadrigam === CheckinAppConstants.QUADRIGAM.FLIGHTS_PASSENGERS_PA) {
                IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.FLIGHTS_PASSENGERS_PA, 1400);
            }
        }

        function initHeader ({headerInfo, headerModel}) {
            NewMainHeaderFacade.initHeader(
                {
                    originDestination: headerInfo,
                    redemption: '',
                    flightType: CheckinAppConstants.FLIGHTTYPE,
                    currency: '',
                    showModalBackHome: true
                },
                { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
                {
                    onLogin: function () {
                        CommonsModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                    }, 
                    onError: function (error) {
                        CommonsModalService.finishWaiting();
                    }, 
                    afterLogin: activate,
                    userLogged: CommonsSessionStorageService.get('userLogged'),
                    loggedData: CommonsSessionStorageService.get('customerData') || CommonsSessionStorageService.get('membershipData') || undefined
                }
            ); 
            
            updateHeader(headerModel);
        }

        function updateHeader (headerModel) {
            $timeout(() => {
                if (headerModel.basket) {
                    NewMainHeaderFacade.updatePendingPaymentItems(headerModel.basket);
                }
                $rootScope.$broadcast('updateDatalayer');
                $rootScope.$broadcast('sendUpdateToMonetate');
            });
        }

        function getFlightHaul (flightHaul: CkiBookingInfo.FlightHaulCode = 'SH') {
            return FlightHaulLabels[flightHaul];
        }

        function setSegmentsSelected () {
            const segmentsSelected = [];

            angular.forEach(vm.model.segmentsPassengersInfo.segments, (segment) => {
                if (segment.isSelected) segmentsSelected.push(segment);
            });
            CommonsSessionStorageService.set('segmentsSelected', segmentsSelected);
        }

        function continueFlowDuplicate (printSelected, pasForm) {
            pasForm.$setSubmitted();
            const isValidForm = pasForm.$submitted && pasForm.$valid;
            if (!isValidForm) return;

            setSegmentsSelected();
            const earlySegments = CommonsSessionStorageService.get('isEarly');

            UpdateFlightsPassengerInfoService.updateFlightsPassengerInfo(vm.model.segmentsPassengersInfo.passengers, vm.model.segmentsPassengersInfo.segments, printSelected, vm.model.segmentsPassengersInfo.activeFields, null, earlySegments);
        }

        function getButtonLiteral () {
            if (vm.isBpSubscriptionMode && !vm.isFlowDuplicated) {
                return 'IBFNPA_TITLE';
            }

            if (vm.isBpSubscriptionMode && vm.isFlowDuplicated) {
                return 'IBCOAC_ADD_EXTRAS_BUTTON';
            }

            if (vm.model.segmentsPassengersInfo.whatToDo.active) {
                return 'IBCOAC_DUPLI_CONTINUAR';
            }

            return 'IBCOACII_CONTINUAR';
        }
    }
})();


