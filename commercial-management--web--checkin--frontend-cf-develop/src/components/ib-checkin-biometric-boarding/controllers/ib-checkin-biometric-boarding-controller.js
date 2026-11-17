(function () {

    'use strict';

    angular.module('ib-checkin-biometric-boarding-module')
        .controller('CheckinBiometricBoardingController', CheckinBiometricBoardingController);

    CheckinBiometricBoardingController.$inject = ['CheckinBiometricBoardingService', 'BiometricErrorFilter', 'BiometricBoardModel', 'localStorageService', '$scope', '$location', '$rootScope', 'CheckinAppConstants', 'ModalService', 'BoardingCardsService', '$timeout', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', 'CkiDataLayerService', 'IbSessionConfigService', 'IbAncillariesPaymentUtilsService'];

    function CheckinBiometricBoardingController (CheckinBiometricBoardingService, BiometricErrorFilter, BiometricBoardModel, localStorageService, $scope, $location, $rootScope, CheckinAppConstants, ModalService, BoardingCardsService, $timeout, CkiDatalayerUtilsService, CkiDatalayerConstants, CkiDataLayerService, IbSessionConfigService, IbAncillariesPaymentUtilsService) {
        const vm = this;
        vm.data = BiometricBoardModel;
        vm.data.initializeModel();
        vm.checkBiometricBoarding = checkBiometricBoarding;
        vm.biometricBoardingAssociation = false;
        vm.bookingInfo = localStorageService.get('bookingInfo');
        vm.goToConfirmation = goToConfirmation;
        vm.goToCheckConfirmation = goToCheckConfirmation;
        vm.biometricNotActivated = false;
        $rootScope.showMainHeader = true;
        $rootScope.showHeaders = true;
        $scope.$on('biometricBoardingFormComplete', checkBiometricBoarding);
        $scope.$on('goToConfirmationEvent', goToConfirmation);
        $scope.$on('biometricBoardingRefreshPage', biometricBoardingRefreshPage);
        $rootScope.$on('documentError', documentError);

        activate();

        function activate () {
            let headerInfo;
            vm.stepsModel = [];
            CheckinBiometricBoardingService.initBiometricBoardingPage().then(initializePage, showInitializeError);

            function initializePage (data) {
                vm.model = data;
                localStorageService.set('biometricBoardingForm', { countriesList: data.countriesList, documentsByCountry: data.documentsByCountry });
                CheckinBiometricBoardingService.searchFlightsAndPassengers().then((data) => {
                    vm.data.segmentsPassengersInfo = data.flightsPassengersInfo;
                    headerInfo = IbAncillariesPaymentUtilsService.getInfoHeader(data.flightsPassengersInfo.segments, data.flightsPassengersInfo.passengers);
                    localStorageService.set('headerInfo', headerInfo);
                    vm.passengersModel = passengerDataInfo(vm.data.segmentsPassengersInfo.passengers);

                    $timeout(() => {
                        const quadrigam = CheckinAppConstants.QUADRIGAM.BIOMETRIC;

                        /* INIT DELETE GA4 MIGRATION*/
                        const extendedDatalayerInfo = {};
                        CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, extendedDatalayerInfo, IbSessionConfigService.isUserLogged());
                        CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                        /* FIN DELETE GA4 MIGRATION*/
                        const extendedDigitalDataInfo = {};
                        CkiDataLayerService.setProcessAndStep(quadrigam);
                        CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
                        CkiDatalayerUtilsService.updateDatalayerViewEvent();

                        $rootScope.$broadcast('updateDatalayer');
                        $rootScope.$broadcast('sendUpdateToMonetate');
                    });
                });
            }

            function showInitializeError (error) {
                BiometricErrorFilter.errorHandlerManagement(error);
                goToConfirmation();
            }
        }

        function passengerDataInfo (passengers) {
            const listPassengers = [];

            if (passengers.length > 1) localStorageService.set('biometricInitProfileCheck', true);

            BoardingCardsService.searchBoardingCardsInformation(true).then((data) => {
                localStorageService.set('biometricStatusPassengers', data);
                for (let i = 0; i < passengers.length; i++) {
                    const passenger = passengers[i];
                    const passengerDataBiometricPerSegment = getBiometricDataPassengerForId(passenger.id, data);
                    const email = (passenger.contactData && passenger.contactData.email && passenger.contactData.email !== null && passenger.contactData.email.length > 0) ? passenger.contactData.email : '';
                    const type = (passenger.type && CheckinAppConstants.PASSENGERS_TYPES[passenger.type]) ? CheckinAppConstants.PASSENGERS_TYPES[passenger.type] : CheckinAppConstants.PASSENGERS_TYPES[0];
                    const status = getBiometricStatus(passengerDataBiometricPerSegment);
                    const icon = getIconPassenger(type, passenger, CheckinAppConstants.BIOMETRIC.ICONS);
                    const iconModal = getIconPassenger(type, passenger, CheckinAppConstants.BIOMETRIC.ICONS_MODALS);
                    const biometricDocument = getBioCard(passengerDataBiometricPerSegment);

                    listPassengers.push({
                        gender: passenger.gender,
                        id: passenger.id,
                        icon: icon,
                        iconModal: iconModal,
                        infant: (passenger.infant && passenger.infant !== null) ? passenger.infant : '',
                        email: (passengerDataBiometricPerSegment !== null && passengerDataBiometricPerSegment.email && passengerDataBiometricPerSegment.email.length > 0) ? passengerDataBiometricPerSegment.email : email,
                        name: passenger.name,
                        surname: passenger.surname,
                        fullname: passenger.name + ' ' + passenger.surname,
                        type: type,
                        status: status,
                        biometricDocument: biometricDocument
                    });
                }
            });
            return listPassengers;

            function getBioCard (passengerData) {
                let bioCardsPassenger, bioCards;
                try {
                    const auxBioCards = localStorageService.get('confirmationInfo').boardingCards;
                    bioCards = auxBioCards.map(boardingCard => boardingCard.passengers);
                    bioCardsPassenger = bioCards.map(card => card.filter(passenger => passenger.id === passengerData[0].id)).flat();
                } catch (error) {
                    bioCards = {};
                }
                return bioCardsPassenger;
            }
        }

        function getIconPassenger (type, passenger, icons) {
            const defaultIcon = icons.MALE;
            let icon = (type === CheckinAppConstants.PASSENGERS_TYPES.ADULT && passenger.gender && passenger.gender !== null && passenger.gender.length > 0) ? icons[passenger.gender] : defaultIcon;

            if (type !== CheckinAppConstants.PASSENGERS_TYPES.ADULT) {
                icon = icons[type];
            }
            return icon;
        }

        function getBiometricDataPassengerForId (idPassenger, dataBiometric) {
            let returnedPassenger = [];
            if (dataBiometric !== null && dataBiometric.passengersStatusBySegment && dataBiometric.passengersStatusBySegment !== null && dataBiometric.passengersStatusBySegment.length > 0) {
                const passengersStatusBySegment = dataBiometric.passengersStatusBySegment;

                passengersStatusBySegment.forEach((passenger) => {
                    if (parseInt(passenger.id) === idPassenger && [CheckinAppConstants.BIOMETRIC.STATUS.AUTOMATIC_FF_AVAILABLE, CheckinAppConstants.BIOMETRIC.STATUS.AVAILABLE].indexOf(passenger.status) !== -1) {
                        returnedPassenger.push(passenger);
                    } else if (parseInt(passenger.id) === idPassenger) {
                        returnedPassenger.push(passenger);
                    }
                });
            }
            return returnedPassenger;
        }

        function getBiometricStatus (passengerDataBiometricPerSegment) {
            let status = [CheckinAppConstants.BIOMETRIC.STATUS.NOT_AVAILABLE];
            const notInfantDataBiometricPerSegment = passengerDataBiometricPerSegment.filter(pass => pass.type !== CheckinAppConstants.PASSENGERS_TYPES.INFANT);

            status = notInfantDataBiometricPerSegment.map(passBioData => 
                {
                    if (passBioData !== null && passBioData.type === CheckinAppConstants.PASSENGERS_TYPES.ADULT && passBioData.status && passBioData.status !== null) {
                        if (passBioData.status !== CheckinAppConstants.BIOMETRIC.STATUS.AUTOMATIC_FF_AVAILABLE) {
                            return passBioData.status;
                        } else {
                            return CheckinAppConstants.BIOMETRIC.STATUS.AVAILABLE;
                        }
                    } else if(passBioData?.type === CheckinAppConstants.PASSENGERS_TYPES.CHILD) {
                        return passBioData.status;
                    }
                }
            )
            return status;
        }

        function checkBiometricBoarding () {
            CheckinBiometricBoardingService.checkBiometricBoardingInfo(vm.data.biometricData).then(checkBiometricSuccess, checkBiometrictError);

            function checkBiometricSuccess (response) {
                //Continue
                vm.biometricBoardingAssociation = true;
                localStorageService.set('biometricBoardingAssociation', vm.biometricBoardingAssociation);
                localStorageService.set('biometricBoardingAssociationSuccess', true);
            }

            function checkBiometrictError (error) {
                const handler = BiometricErrorFilter.errorHandlerManagement(error);
            }
        }

        function goToConfirmation () {
            $location.path('/ibcocf-and-ibeccf');
        }

        function biometricBoardingRefreshPage () {
            CheckinBiometricBoardingService.getBoardingDocuments().then(() => activate(), angular.noop);
        }

        function goToCheckConfirmation () {
            const completePassenger = (passenger) => passenger.statusToShow === CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE;
            const passengers = localStorageService.get('biometricStatusPassengers');
            let countPass = 0, countComplete = 0;

            if (angular.isDefined(passengers) && angular.isObject(passengers) && angular.isArray(passengers.passengersList)) {
                countPass = passengers.passengersList.length;
                for (let i = 0; i < passengers.passengersList.length; i++) {
                    const pass = passengers.passengersList[i];
                    if (angular.isDefined(pass.biometricBoardingStatus) && angular.isString(pass.biometricBoardingStatus) && pass.biometricBoardingStatus === CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE) {
                        countComplete++;
                    }
                }
            }

            if (countPass !== 0 && countPass === countComplete) {
                vm.biometricBoardingAssociation = true;
                localStorageService.set('showBiometric', false);
                localStorageService.set('nextStepAllowed', false);
                localStorageService.set('showBiometricSummaryModule', 'summary');
                goToConfirmation();
            } else if (vm.passengersModel.some(completePassenger)) {
                localStorageService.set('nextStepAllowed', false);
                localStorageService.set('showBiometricSummaryModule', 'summary');
                goToConfirmation();
            } else {
                //AQUÍ SE MUESTRA LA MODAL DE "No has activado el reconocimiento facial"
                vm.biometricBoardingAssociation = false;
                localStorageService.set('showBiometric', true);
                localStorageService.set('showBiometricSummaryModule', 'app');
                ModalService.showGenericModal({}, false, 'ib-modal-biometric-not-activated');
            }

            localStorageService.set('biometricBoardingAssociation', vm.biometricBoardingAssociation);
        }

        function documentError () {
            vm.bioPassInfoForm.$valid = false;
            vm.bioPassInfoForm.document_number.$error.new_document = true;
            vm.bioPassInfoForm.document_number.$invalid = true;
        }
    }
})();
