import dayjs from 'dayjs';
import saveAs from 'file-saver';

(function () {
    'use strict';

    angular
        .module('ib-boarding-cards-module')
        .controller('BoardingCardsController', BoardingCardsController);

    BoardingCardsController.$inject = ['$rootScope', '$scope', 'BoardingCardsService', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', 'CheckinAppConstants', 'BoardingsCardsModel', '$location', '$timeout', 'ModalService', 'BoardingCardsConstants', '$window', 'localStorageService', 'DigitalBoardingService', 'CkiDataLayerService', 'deviceDetector', 'DatalayerEcommerceUtilsService', 'CommonsBrowserStorageService', 'IbSessionConfigService', 'IbUtilsService', 'CheckinFlowService', 'BoardingCardsTransformer'];
    function BoardingCardsController ($rootScope, $scope, BoardingCardsService, CkiDatalayerUtilsService, CkiDatalayerConstants, CheckinAppConstants, BoardingsCardsModel, $location, $timeout, ModalService, BoardingCardsConstants, $window, localStorageService, DigitalBoardingService, CkiDataLayerService, deviceDetector, DatalayerEcommerceUtilsService, CommonsBrowserStorageService, IbSessionConfigService, IbUtilsService, CheckinFlowService, BoardingCardsTransformer) {

        const vm = this;

        $scope.$on('showInputsEvent', showInputs);
        $scope.$on('atLeastOneItemEvent', atLeastOneItemEvent);
        $rootScope.$on('biometricNotActivated', biometricNotActivated);

        vm.model = BoardingsCardsModel;
        vm.showInputs = showInputs;
        vm.askForBoardingCards = askForBoardingCards;
        vm.downloadAttachedFile = downloadAttachedFile;
        vm.biometricNotActivated = biometricNotActivated;
        vm.handleModalSBY = handleModalSBY;
        vm.showOkMessage = false;
        vm.showContinueButton = false;
        vm.showErrorAlert = false;
        vm.sending = false;
        vm.sendingOk = false;
        vm.sendingError = false;
        vm.device = {};
        vm.onlyPdf = false;
        vm.items = [];
        vm.showInhibitInfo = {
            showAlert: false,
            showBox: false,
            status: false,
            subtitleOK: '',
            subtitleKO: '',
            code: '',
            icon: ''
        };
        vm.showAlertSBY = {
            status: false,
            openModal: false,
            title: '',
            passengers: []
        };

        if (!CheckinFlowService.checkConfirmationPNR()) {
            activate();
        }

        ////////////////
        function activate () {
            initData();
            ModalService.isNotWaiting();

            // checked inhibition for aircheck
            const isInhibitAircheck = checkInhibitAircheck();

            if (!isInhibitAircheck) {
                BoardingCardsService.searchBoardingCardsInformation(true).then(searchBoardingCardsInformationSuccess, searchBoardingCardsInformationError);
            }

            $rootScope.timeSession.startTime = dayjs();
            vm.device = deviceDetector;
        }

        function initData () {
            $rootScope.$broadcast('changeStatusBasket', false);
            localStorageService.set('noShowMessageBockBack', true);
            CheckinFlowService.warnUserOnBackPressed();
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.BOARDING_CARDS, 1400);
            initInhibitBoardingCard();
            updateDatalayer();
        }

        function getSomePassengerAircheck (segment) {
            return segment.passengersStatus.some((passenger) => passenger.airCheckDocumentationRequired && passenger.inhibitBoardingCard?.reason?.includes(CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON));
        }

        function checkInhibitAircheck () {
            const segmentsSelected = localStorageService.get('segmentsSelected') || [];
            const isInhibitAircheck = segmentsSelected.some(getSomePassengerAircheck) || false;

            if (isInhibitAircheck) {
                const mockError = {
                    internalErrorCode: CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_AIRCHECK
                };
                const error = BoardingCardsTransformer.transformInfoInhibitCards(mockError);
                ModalService.isError(error, 'modal-boarding-card-inhibition.html', true);
            }

            return isInhibitAircheck;
        }

        function searchBoardingCardsInformationSuccess (data) {
            DigitalBoardingService.getDigitalBoardingAvailability().then(getDigitalBoardingSuccess, getDigitalBoardingError);
            vm.model.initializeModel();
            vm.model.boardingInfo = data;
            vm.onlyPdf = data.formatsList?.length === 1 || false;
            localStorageService.set('biometricStatusPassengers', data);
            setItemAlertAndBox();
            ModalService.isNotWaiting();
        }

        function searchBoardingCardsInformationError (error) {
            const otherCasesInhibition = [CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_OTHER_CASE, CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_SEE_AGENT];
            if (error?.inhibitBoardingCard?.status) {
                localStorageService.set('inhibitBoardingCard', error);
                if(error.internalErrorCode === CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_AIRCHECK) {
                    ModalService.isError(error, 'modal-boarding-card-inhibition.html', true);
                } else if(otherCasesInhibition.includes(error.internalErrorCode)) {
                    vm.model.inhibitBoardingCard = error.inhibitBoardingCard;
                    setItemAlertAndBox();
                }
            }
            ModalService.isNotWaiting();
        }

        function updateDatalayer () {
            $timeout(() => {
                const quadrigam = getQuadrigam();
                const PNR = localStorageService.get('PNR');
                /* INIT DELETE GA4 MIGRATION*/
                const extendedObject = {};
                CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, extendedObject, IbSessionConfigService.isUserLogged());
                CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FIN DELETE GA4 MIGRATION*/
                const extendedDigitalDataInfo = {};
                CkiDataLayerService.setProcessAndStep(quadrigam);
                CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
                CkiDatalayerUtilsService.updateDatalayerViewEvent();

                DatalayerEcommerceUtilsService.setAddPurchase(null, PNR);
                // Update monetate
                CkiDatalayerUtilsService.updateMonetate(quadrigam);
            });
        }

        function getQuadrigam () {
            const baseQuadrigam = 'BOARDING_CARDS';
            const pmtViewType =  CommonsBrowserStorageService.get('ib-check-in-app.forcePaymentType') ?? null;
            const quadrigam = pmtViewType === 'NEW' ? `${baseQuadrigam}_DECOUPLING` : baseQuadrigam;

            return CheckinAppConstants.QUADRIGAM[quadrigam];
        }

        /**
         *
         * @param {*} event
         * @param {*} value
         * @param {*} type
         */
        function showInputs (event, value, type) {
            if (type === BoardingCardsConstants.CHANNELS_NAMES.EMAIL) {
                vm.model.boardingInfo.showEmail = value;
            }
            if (type === BoardingCardsConstants.CHANNELS_NAMES.SMS) {
                vm.model.boardingInfo.showPhone = value;
            }
        }

        function sendOrDownloadCardsSuccess (selectedChannels) {
            if (selectedChannels) {
                if (angular.isObject(selectedChannels.inhibitBoardingCard) && selectedChannels.inhibitBoardingCard.status) {
                    localStorageService.set('inhibitBoardingCard', selectedChannels);
                }
                if (selectedChannels.download) {
                    downloadAttachedFile();
                }
                vm.sending = false;
                vm.sendingOk = true;
                $timeout(()=>{
                    vm.sendingOk = false;
                },3000).then(()=>{
                    vm.showErrorAlert = false;
                    vm.showOkMessage = true;
                    vm.showContinueButton = true;
                    // At this point we check if we continue to biometric flow or not. This depends on the value of 'biometricBoardingAssociation'
                    if (localStorageService.get('biometricBoardingAssociation')) {
                        BoardingCardsService.checkBiometricFlow(angular.copy(vm.model)).then((data) => { angular.noop; }, (error) => { angular.noop; });
                    }
                });
            }
        }

        function sendOrDownloadCardsError (error) {
            vm.sending = false;
            vm.sendingError = true;
            $timeout(()=>{
                vm.sendingError = false;
            },3000).then(()=>{
                vm.showErrorAlert = true;
                vm.showOkMessage = false;
            });

        }

        function validateAskForBoardingCards () {
            if (!vm.everyAVIH && vm.passInfoForm) {
                vm.passInfoForm.$submitted = true;
                vm.controlAsk = vm.passInfoForm.$valid;
            } else {
                vm.controlAsk = true;
            }
        }

        function shouldOpenGoogleWalletModal (isCarrierConnect) {
            return vm.model?.boardingInfo?.downloadFormatSelected?.[0]?.type === 'GOOGLE_WALLET' && isCarrierConnect;
        }

        function askForBoardingCards () {
            validateAskForBoardingCards();

            if (!vm.controlAsk) return;

            const bookingInfo = localStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);
            const isCarrierConnect = bookingInfo?.carrierConnectEnabled || false;

            if (shouldOpenGoogleWalletModal(isCarrierConnect)) {
                BoardingCardsService.openGoogleWalletModal(vm.model.boardingInfo.documents, sendBoardingCardsRequests);
                return;
            }

            sendBoardingCardsRequests();
        }

        function sendBoardingCardsRequests (modelOverride) {
            vm.sending = true;

            BoardingCardsService.askForBoardingCards(angular.copy(vm.model), modelOverride).then(sendOrDownloadCardsSuccess, sendOrDownloadCardsError);
        }
        /**
         * DigitalBoardingSuccess
         * @param {*} selectedChannels
         */
        function getDigitalBoardingSuccess (response) {
            const acceptInfoSegments = localStorageService.get('acceptInfoSegments');
            let digitalBoardingInfo;
            if (response?.digitalBoardings && acceptInfoSegments !== null) {
                for (let i = 0; i < acceptInfoSegments.acceptedSegments.length; i++) {
                    for (let j = 0; j < response.digitalBoardings.segments.length; j++) {
                        if (acceptInfoSegments.acceptedSegments[i].id.toString() === response.digitalBoardings.segments[j].segmentId) {
                            digitalBoardingInfo = response;
                        }
                    }
                }
                localStorageService.set('digitalBoardingInfo', digitalBoardingInfo);
            }
        }

        /**
         * DigitalBoardingError
         * @param {*} selectedChannels
         */
        function getDigitalBoardingError (response) {
            let digitalBoardingInfo;
            localStorageService.set('digitalBoardingInfo', digitalBoardingInfo);
        }

        /**
         *
         */
        function atLeastOneItemEvent () {
            ModalService.openGenericModal('md', 'ibecbp.vista-modal-boarding-card-one-format-checked', true, { idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.BOARDING_CARD_AT_LEAST_ONE_FORMAT_WARNING });
        }

        function biometricNotActivated () {
            localStorageService.set('nextStepAllowed', false);
            $location.path('/ibcocf-and-ibeccf');
        }

        function downloadAttachedFile () {
            let printLength;
            let docsLength;
            let data;
            let contentType;
            const printedInfo = localStorageService.get('printBoardingCards') || [];
            //loop over print elements finding the files to auto download
            for (let i = 0, printLength = printedInfo.length; i < printLength; i++) {
                printedInfo[i].documents = printedInfo[i].documents || [];
                //loop over documents of its printed types downloading each document using file-saver library for angular
                for (let j = 0, docsLength = printedInfo[i].documents.length; j < docsLength; j++) {
                    switch (printedInfo[i].format) {
                            case 'PDF': contentType = 'application/pdf';
                                break;
                            case 'QR': contentType = 'image/gif';
                                break;
                            case 'PASSBOOK': contentType = 'application/vnd.apple.pkpass';
                                break;
                            case 'GOOGLE_WALLET':
                                break;
                            default: contentType = 'application/pdf';
                                break;
                    }
                    if (isAppleDeviceDetector()) {
                        data = base64toBlob(printedInfo[i].documents[j].base64Bytes, contentType);
                        const url = URL.createObjectURL(data);
                        const openWindow = $window.open(url, '_blank');
                        vm.model.showAlternativeDownload = isClosedWindow(openWindow);
                    } else if (printedInfo[i].format === 'GOOGLE_WALLET') {
                        data = IbUtilsService.Base64Decode(printedInfo[i].documents[j].base64Bytes);
                        $window.open(BoardingCardsConstants.FORMATS.GOOGLE_WALLET.baseURL + data);
                    } else if(vm.device.raw.browser.safari) {
                        $timeout(() => {
                            data = base64toBlob(printedInfo[i].documents[j].base64Bytes, contentType);
                            saveAs(data, printedInfo[i].documents[j].fileName);
                        }, j * 100);
                    } else {
                        data = base64toBlob(printedInfo[i].documents[j].base64Bytes, contentType);
                        saveAs(data, printedInfo[i].documents[j].fileName);
                    }
                }
            }

            function isAppleDeviceDetector () {
                return vm.device.raw.device.iphone || vm.device.raw.device.ipad || vm.device.raw.device.ipod;
            }

            function isClosedWindow (openWindow) {
                return !openWindow || openWindow.closed || angular.isUndefined(openWindow.closed);
            }
        }

        function base64toBlob (base64Data, contentType) {
            let sliceIndex, begin, end, bytes, offset, i;
            const sliceSize = 1024;
            const byteCharacters = IbUtilsService.Base64Decode(base64Data);
            const bytesLength = byteCharacters.length;
            const slicesCount = Math.ceil(bytesLength / sliceSize);
            const byteArrays = new Array(slicesCount);
            contentType = contentType || '';

            for (sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                begin = sliceIndex * sliceSize;
                end = Math.min(begin + sliceSize, bytesLength);
                bytes = new Array(end - begin);
                for (offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }

        function initInhibitBoardingCard () {
            const segmentsSelected = localStorageService.get('segmentsSelected') || [];
            const passengerList = {
                AVIH: 0,
                PETC: 0,
                RESI: 0,
                UMNR: 0,
                COUR: 0,
                SEE_AGENT: 0
            };
            const existInhibition = {
                AVIH: false,
                PETC: false,
                RESI: false,
                UMNR: false,
                COUR: false,
                SEE_AGENT: false
            };

            let totalPassengerList = 0;
            let noItemPassengers = false;
            const getPassenger = (passenger) => {
                vm.items.forEach((item) => {
                    if (passenger.isSelected && passenger.items?.includes(item.code)) {
                        passengerList[item.code]++;
                        if (!existInhibition[item.code]) existInhibition[item.code] = true;
                    }
                });
                if (passenger.isSelected) totalPassengerList = totalPassengerList + 1;
                const isNoItemPass = !noItemPassengers && passenger.isSelected && passenger.items?.length === 0;
                if (isNoItemPass) noItemPassengers = true;
            };
            const getSegment = (segment) => {
                segment.passengersStatus?.forEach(getPassenger);
            };

            initModelItems();

            segmentsSelected.forEach(getSegment);

            const acceptInhibitSeeAgent = checkAcceptInhibitCarrierConnect();
            if (!existInhibition.SEE_AGENT) existInhibition.SEE_AGENT = acceptInhibitSeeAgent.inhibitSeeAgent;
            if (!passengerList.SEE_AGENT && acceptInhibitSeeAgent.countPassengersSeeAgent) passengerList.SEE_AGENT = acceptInhibitSeeAgent.countPassengersSeeAgent;

            const priorityItem = checkPriorityItems(noItemPassengers, existInhibition);
            updateItems(existInhibition, priorityItem);
        }

        function checkAcceptInhibitCarrierConnect () {
            const acceptInfoSegments = localStorageService.get('acceptInfoSegments') || {};
            const acceptedSegments = acceptInfoSegments.acceptedSegments || [];

            const passengerStats = calculatePassengerStatistics(acceptedSegments);

            return buildInhibitResponse(passengerStats);
        }

        function calculatePassengerStatistics (segments) {
            return segments.reduce((stats, segment) => {
                const passengers = Array.isArray(segment?.passengers) ? segment.passengers : [];

                passengers.forEach((passenger) => {
                    stats.countAllPassengers++;
                    if (passenger?.messageStatus === 'SEE_AGENT_FOR_BP') {
                        stats.countPassengersSeeAgent++;
                    }
                    checkStatusStandBy(passenger);
                });

                return stats;
            }, {
                countAllPassengers: 0,
                countPassengersSeeAgent: 0
            });
        }

        function buildInhibitResponse (stats) {
            const hasSeeAgentPassengers = stats.countPassengersSeeAgent > 0;

            return {
                inhibitSeeAgent: hasSeeAgentPassengers,
                isHomogeneous: hasSeeAgentPassengers && stats.countAllPassengers === stats.countPassengersSeeAgent,
                countAllPassengers: stats.countAllPassengers,
                countPassengersSeeAgent: stats.countPassengersSeeAgent
            };
        }


        function updateItems (existInhibition, priorityItem) {
            const setInfoItems = (item) => {
                if (existInhibition[item.code] && !priorityItem[item.code]) {
                    item.showAlert = item.code !== 'UMNR';
                    item.status = true;
                }
                if (priorityItem[item.code]) {
                    item.showBox = true;
                    item.status = true;
                }
            };
            vm.items.forEach(setInfoItems);
        }

        /**
         * Check to the priority order of prohibited items
         * @param {boolean} noItemPassengers
         * @param {object} existInhibition
         * @returns priorityItem
         */
        function checkPriorityItems (noItemPassengers, existInhibition) {
            const priorityItem = {
                AVIH: false,
                PETC: false,
                RESI: false,
                UMNR: false,
                COUR: false,
                SEE_AGENT: false
            };
            if (!noItemPassengers) {
                const keys = Object.keys(existInhibition).filter(key => existInhibition[key] === true);
                const highestPriority = CheckinFlowService.priorityInhibit(keys);
                if (highestPriority) priorityItem[highestPriority] = true;
            }
            return priorityItem;
        }

        /**
         * Init model items inhibit boarding cards
         */
        function initModelItems () {
            const getItem = (item) => {
                if (CheckinAppConstants.INHIBIT_ALERTS[item]) {
                    vm.items.push({
                        code: item,
                        showAlert: false,
                        showBox: false,
                        status: false,
                        title: CheckinAppConstants.INHIBIT_ALERTS[item].IBECBP.TITLE,
                        subtitleOK: CheckinAppConstants.INHIBIT_ALERTS[item].IBECBP.SUBTITLE_OK,
                        subtitleKO: CheckinAppConstants.INHIBIT_ALERTS[item].IBECBP.SUBTITLE_KO,
                        icon: CheckinAppConstants.INHIBIT_ALERTS[item].IBECBP.ICON
                    });
                }
            };
            Object.values(CheckinAppConstants.ITEMS_TYPES).forEach(getItem);
        }

        /**
         * Show alerts or boxes to the order of priority of prohibited items
         */
        function setItemAlertAndBox () {
            const itemInhibit = CheckinFlowService.showPriorityAlertInhibit(vm.items);
            if (itemInhibit) Object.assign(vm.showInhibitInfo, itemInhibit);

            vm.showInhibitInfo.showBox = vm.model?.inhibitBoardingCard?.isHomogeneous;

            if (vm.showInhibitInfo.showBox)
                vm.showContinueButton = true;
            else
                vm.showInhibitInfo.showAlert = vm.items.some((item) => item.showAlert === true);

            checkShowAlertSBY();
        }

        function checkShowAlertSBY () {
            const {showAlert, showBox} = vm.showInhibitInfo;
            if (!showAlert && !showBox) {
                vm.showAlertSBY.status = vm.showAlertSBY.passengers.length > 0;
                vm.showAlertSBY.title = getTitleSBY();
            }
        }

        /**
         * Check status standby per passenger. Show Alert if not exist inhibit/items
         * @param {object} passenger
         */
        function checkStatusStandBy (passenger) {
            if (passenger.status === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.STANDBY) {
                const bookingInfo = localStorageService.get('bookingInfo');
                const passengerInfo = bookingInfo.passengers.find((p) => p.id === passenger.id);

                vm.showAlertSBY.passengers.push({
                    id: passenger.id,
                    gender: passengerInfo?.gender || 'MALE',
                    fullName: `${passengerInfo?.name} ${passengerInfo?.surname}` || ''
                });
            }
        }

        function getTitleSBY () {
            let title = 'IBECBP_ALERT_SBY_TITLE_MONO_PAX';
            const passengersSelected = localStorageService.get('passengersSelected') || [];

            if (passengersSelected.length > 1) {
                title = vm.showAlertSBY.passengers.length > 1 ? 'IBECBP_ALERT_SBY_TITLE_MULTI_PAX_2' : 'IBECBP_ALERT_SBY_TITLE_MULTI_PAX_1';
            }

            return title;
        }

        /**
         * Handle click link alert SBY, open modal info SBY.
         * @param {*} $event
         */
        function handleModalSBY ($event) {
            $event.preventDefault();
            vm.showAlertSBY.openModal = true;
        }
    }
})();
