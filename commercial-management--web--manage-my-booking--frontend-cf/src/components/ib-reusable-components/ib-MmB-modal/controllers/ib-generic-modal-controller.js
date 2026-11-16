import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBGenericModalController', MmBGenericModalController);

    MmBGenericModalController.$inject = ['$uibModalInstance', 'object', 'MmBDatalayerUtilsService', '$rootScope', 'MmBAppConstants', 'MmBModalService', 'MmBUtilService', '$sce', '$window', 'localStorageService', '$timeout', '$scope', 'BookingSearchService', 'RedirectionService', 'CommonsUtilService', 'CancelIBVOrderService', '$document', '$compile', 'ResetMmbService', 'CommonsSessionStorageService', '$filter', 'MmBUtilsSharedService'];
    function MmBGenericModalController($uibModalInstance, object, MmBDatalayerUtilsService, $rootScope, MmBAppConstants, MmBModalService, MmBUtilService, $sce, $window, localStorageService, $timeout, $scope, BookingSearchService, RedirectionService, CommonsUtilService, CancelIBVOrderService, $document, $compile, ResetMmbService, CommonsSessionStorageService, $filter, MmBUtilsSharedService) {
        var vm = this;
        vm.model = object;
        vm.$onInit = activate;
        vm.close = closeModal;
        vm.cancel = cancelModal;
        vm.accept = acceptModal;
        vm.acceptModalData = acceptModalData;
        vm.closeGoHome = closeGoHome;
        vm.acceptForm = acceptForm;
        vm.checked = checked;
        vm.areEmailsEquals = areEmailsEquals;
        vm.updatePassengerData = updatePassengerData;
        vm.goToCustomize = goToCustomize;
        vm.goToCustomizeSpecialMeals = goToCustomizeSpecialMeals;
        vm.goToCustomizeSpeqs = goToCustomizeSpeqs;
        vm.goToCustomizeSeats = goToCustomizeSeats;
        vm.goToCustomizeBaggage = goToCustomizeBaggage;
        vm.hasEquals = null;
        vm.confirm = confirm;
        vm.tempFrequentFlyerInfo = null;
        vm.redirect = redirect;
        vm.transformAsHTML = transformAsHTML;
        vm.deletePendingAncillaries = deletePendingAncillaries;
        vm.emitGoToPaymentPage = emitGoToPaymentPage;
        vm.closeMessageWithTimeoutApis = closeMessageWithTimeoutApis;
        vm.redirectModal = redirectModal;
        vm.retrieveReservation = retrieveReservation;
        vm.redirectThisPage = redirectThisPage;
        vm.cancelIBV = cancelIBV;
        vm.changePhones = changePhones;

        vm.nextStep = nextStep;
        vm.backStep = backStep;
        vm.secundaryText = 'test';

        $scope.$on('anonymousSubmit', BookingSearchService.searchFlightsPassengersEvent);
        vm.closeMessageWithTimeoutEvent = $rootScope.$on('closeMessageWithTimeoutApis', closeMessageWithTimeoutApis);
        $scope.$on('$destroy', vm.closeMessageWithTimeoutEvent);
        //$rootScope.$on('$destroy', closeMessageWithTimeoutApis);


        /**
         * Initialize modal controller
         */
        function activate() {
            MmBDatalayerUtilsService.sendDatalayerModalEvent(vm.model);
            if (vm.model) {
                vm.model.indexFormApis = 0;
                if (vm.model.arrFrequentFlyerInfo) {
                    vm.model.submitted = false;
                }
            }

            $uibModalInstance.result.then(MmBDatalayerUtilsService.removeDatalayerModalAttrs, MmBDatalayerUtilsService.removeDatalayerModalAttrs);
            changePhones();

            const tagsInfo = {
                bold: {
                    tag: 'span',
                    class:'ib-text ib-text--bold ib-text--inline'
                }
            };

            vm.secundaryText = $filter('literalFormatter')($filter('translate')('MMB_SVC_MODAL_SECUNDARY_TEXT'), tagsInfo);

        };

        /**
         * Cancel IBV
         */
        function cancelIBV() {
            CancelIBVOrderService.cancelIBVOrder().then(cancelOrderSuccess, showModalError);

            function cancelOrderSuccess (data) {
                $uibModalInstance.close();
                angular.element($document).find('body').append($compile(MmBUtilsSharedService.generateRedirectionFormCancel(data.data))($scope));
                $timeout(function () {
                    angular.element(angular.element($document).find('#submit_hidden_form')).trigger('click');
                });
            }

            function showModalError (error) {
                MmBModalService.finishWaiting();
                MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            }
        }

        /**
         * Change Phones By Market
         */
        function changePhones() {
            const market = CommonsSessionStorageService.get("confirmationDatalayerInfo").mercado;
            let phone = "(+44) 020 3788 0698";
            const phones = MmBAppConstants.PHONESIBV;
            $timeout(function () {
                let text = angular.element(".ib-modals .ib-text:contains('+44 (0) 2037880698')");
                for (let i=0; i<phones.length; i++) {
                    if (phones[i].market === market){
                        phone = phones[i].phone;
                    }
                }
                angular.element(text).text(angular.element(text).text().replace("+44 (0) 2037880698", phone));
            });

        }

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal() {
            if (angular.isDefined(vm.model.showError) && angular.isDefined(vm.model.submitted)) {
                vm.model.showError = false;
                vm.model.submitted = false;
                vm.model.showOk = false;
            }
            $uibModalInstance.dismiss();
        }

        function redirect(url) {
            if (url) {
                $uibModalInstance.close();
                $window.open(url, '_blank');
            }
        }

        function redirectThisPage(url) {
            if (url) {
                if ($rootScope.timeSession.openedModal) $scope.$broadcast('closeTransferModal');
                $uibModalInstance.close();
                RedirectionService.externalRedirect(url);
            }
        }

        /**
         * Closes the modal dismissing its instance
         */
        function cancelModal(type) {
            $uibModalInstance.dismiss(type);
        }

        /**
         * Closes the modal calling close method of its instance
         */
        function acceptModal() {
            $uibModalInstance.close();
        }

        /**
         * Closes the modal calling close method of its instance with data
         */
        function acceptModalData(data) {
            $uibModalInstance.close(data);
        }

        function retrieveReservation() {
            const bookingInfo = localStorageService.get('bookingInfo');
            const surname = bookingInfo ? bookingInfo.passengers[0].personalInfo.surname : '';
            const pnr = bookingInfo ? bookingInfo.order.bookingReferences[0].reference : '';
            const isAirShuttle = false;
            const updateInvoiceInfo = true;
            $scope.$emit('anonymousSubmit', { 'pnr': pnr.replace(/-| /g, ''), 'surname': surname, 'isAirShuttle': isAirShuttle, 'updateInvoiceInfo': updateInvoiceInfo });
            localStorageService.set('retrieveReservation', true);
            $uibModalInstance.close();
        }

        function confirm() {
            if (angular.isDefined(vm.model.data) && angular.isDefined(vm.model.data.name) && angular.isDefined(vm.model.data.phone) && vm.model.data.name.length > 0 && vm.model.data.phone.length > 0) {
                vm.model.generalError = false;
                $rootScope.$emit('confirmEmergencyContact', vm.model.data);
                $uibModalInstance.close();
            } else {
                vm.model.generalError = true;
            }
        }

        /**
         * Validate the form and then close the modal
         */
        function acceptForm(currentForm) {
            currentForm.$submitted = true;
            if (currentForm.$valid) {
                currentForm.$submitted = false;
                $uibModalInstance.close();
            }
        }

        /**
         * Emit an event with the index of passenger
         */
        function checked(index) {
            $rootScope.$emit('checkSpecialNeedsEvent', index);
        }
        /**
         * Validates the email and repeated email are equals
         */
        function areEmailsEquals() {
            var contactEmail = vm.model.data.email || '';
            var repeatedEmail = vm.model.data.emailRepeat || '';
            vm.hasEquals = contactEmail.toLowerCase() === repeatedEmail.toLowerCase();
            if (angular.isDefined(vm.modalContactForm)) {
                vm.modalContactForm.emailRepeat.$setValidity('emailsNotEqual', vm.hasEquals);
            };
        };
        /**
         * Validates the form and then emits an event or scroll to the element with errors
         * @param {*} currentForm form that has been completed
         * @param {*} index Identificator of the passenger in passengersModel
         * @param {*} type type of data that has been provided
         */
        function updatePassengerData(currentForm, index, type) {
            currentForm.$submitted = true;
            vm.model.submitted = true;
            vm.model.showError = false;
            vm.model.shouldLoad = true;

            if (currentForm.$valid) {
                if (type === 'frequentFlyer') {
                    if (vm.tempFrequentFlyerInfo.company === 'IB') {
                        if (vm.tempFrequentFlyerInfo.number.length === MmBAppConstants.MmBPatterns.MAX_LENGTH_IBERIA_CARD) {
                            vm.model.frequentFlyerInfo = addNameCompany(vm.tempFrequentFlyerInfo);
                            sendUpdatePassengerDataEvent();
                        } else {
                            vm.model.showError = true;
                        }
                    } else {
                        if (vm.tempFrequentFlyerInfo.number.length <= 20) {
                            vm.model.frequentFlyerInfo = addNameCompany(vm.tempFrequentFlyerInfo);
                            sendUpdatePassengerDataEvent();
                        } else {
                            vm.model.showError = true;
                        }
                    }
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCFFL,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCFFL, MmBAppConstants.QUADRIGAM.CONFIRM_FF);
                } else if (type === 'APIS') {
                    MmBModalService.showWaitingModal();
                    CommonsUtilService.setTitlePage('MMB_TITLE_ADVANCE_PASSENGER_INFO');
                    sendUpdatePassengerDataEvent();
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCAPI,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCAPI, MmBAppConstants.QUADRIGAM.CONFIRM_ADD_APIS);
                } else if (type === 'emergencyContact') {
                    sendUpdatePassengerDataEvent();
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCEME,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCEME, MmBAppConstants.QUADRIGAM.CONFIRM_EMERGENCY_CONTACT);
                } else {
                    sendUpdatePassengerDataEvent();
                    $uibModalInstance.close();
                }
            } else {
                $rootScope.$broadcast('scrollToError');
                if (type !== 'APIS') vm.model.showError = true;
                vm.model.shouldLoad = false;

            }

            function sendUpdatePassengerDataEvent() {
                const existInfant = (angular.isDefined(vm.model.passengerApisInfo) && angular.isDefined(vm.model.passengerApisInfo.existInfant)) ? vm.model.passengerApisInfo.existInfant : false;
                $rootScope.$emit('updatePassengerDataEvent', index, type, existInfant);
                // CommonsUtilService.setTitlePage('MMB_TITLE_CONFIRM_SPECIAL_NEEDS_ADD');
                // MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCPMR, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCPMR, MmBAppConstants.QUADRIGAM.CONFIRM_SPECIAL_NEEDS_ADD);
            }
        }

        function addNameCompany(data) {
            var x;
            var dataLocal;
            var frequentFlyer;

            frequentFlyer = data ? data : {};
            dataLocal = localStorageService.get('frequentFlyersCompanies');
            if (Object.keys(frequentFlyer).length > 0) {
                for (x = 0; x < dataLocal?.length; x++) {
                    if (dataLocal[x].iataCompanyCode === frequentFlyer.company) {
                        frequentFlyer.airlineName = dataLocal[x].airlineName;
                    }
                }
            }
            return frequentFlyer;
        }

        function goToCustomizeSpecialMeals(selectedSegmentInfo) {
            $rootScope.$broadcast('specialMealsNavigation', selectedSegmentInfo);
            $uibModalInstance.close();
        }

        function goToCustomizeSpeqs(selectedSegmentInfo) {
            $rootScope.$broadcast('speqsNavigation', selectedSegmentInfo);
            $uibModalInstance.close();
        }

        function goToCustomizeSeats(selectedSegmentInfo) {
            //Aquí va la llamada al servicio de aviso a server de no mostrar más el aviso (por definir).
            $rootScope.$broadcast('ancillariesSeatsNavigation', selectedSegmentInfo);
            $uibModalInstance.close();
        }

        function goToCustomizeBaggage(selectedSliceInfo) {
            $rootScope.$broadcast('ancillariesBaggageNavigation', selectedSliceInfo);
            $uibModalInstance.close();
        }

        function goToCustomize() {
            $rootScope.$broadcast('goToCustomize');
            $uibModalInstance.close();
        }

        function transformAsHTML(data) {
            return $sce.trustAsHtml(data);

        }

        function nextStep(currentForm, index) {
            if (currentForm.$valid) {
                vm.model.indexFormApis = index;
                currentForm.$submitted = false;
                vm.model.showError = false;
            } else {
                currentForm.$submitted = true;
                vm.model.shouldLoad = false;
                $rootScope.$broadcast('scrollToError');
            }
        }

        function backStep(currentForm, index) {
            vm.model.indexFormApis = index;
            currentForm.$submitted = false;
            vm.model.showError = false;
            $rootScope.$broadcast('nextStep');
        }

        /**
         * Emits an 'deleteAllAncillaries' event to go to empty basket
         */
        function deletePendingAncillaries() {
            $uibModalInstance.close();
            $rootScope.$broadcast('deleteAllPendingAncillaries');
        }

        /**
         * Emits an 'goToPaymentPage' event to redirect to closeMessageWithTimeoutApis page
         */
        function emitGoToPaymentPage() {
            $uibModalInstance.close();
            $rootScope.$broadcast('goToPayment');
        }

        /**
         *
         * @param {boolean} closeModal
         * Closes the transition modal
         */
        function closeMessageWithTimeoutApis(evt, apisShowOk){
            if (apisShowOk) {
                vm.model.shouldLoad = false;
                vm.model.showOk = true;
            } else {
                vm.model.shouldLoad = false;
                vm.model.showError = true;
            }
            $timeout(()=> {
                vm.model.shouldLoad = false;
                vm.model.submitted = false;
                vm.model.showError=false;
                vm.model.showOk=false;
                if (apisShowOk) {
                    vm.model.showErrorForm = true;
                    $uibModalInstance.close();
                }
            },3000);
        }

        /**
         * Go to dashboard home
         */
        function closeGoHome(){
            let cvFlowInitialized = localStorageService.get('cvFlowInitialized');
            if (cvFlowInitialized) {
                doResetMmb();
            }
            localStorageService.remove('cvFlowInitialized');
            localStorageService.remove('addToCart');
            $uibModalInstance.close('goHome');
        }

        function doResetMmb() {
            ResetMmbService.deleteVolatileOffers().then(angular.noop, angular.noop);
        }

        /**
         * Show redirection modal for redirect user to third party web
         * @param {Object} event Object event
         * @param flight
         * @param thirdPartyCompanies
         */
        function redirectModal(event, flight, thirdPartyCompanies) {
            event.preventDefault();
            MmBModalService.showGenericModal(false, 'ib-modal-redirect-modal.html', { jbaLink: thirdPartyCompanies.deeplinks[0].externalUrl, company: flight.operationalCarrier.name }, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
            /* INIT DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateDatalayerWithQuadrigam(MmBAppConstants.QUADRIGAM.MODAL_SELECT_SEAT_JBA, null, MmBUtilService.isUserLogged());
            /* FINISH DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateDigitalDataWithQuadrigam(MmBAppConstants.QUADRIGAM.MODAL_SELECT_SEAT_JBA, null, MmBUtilService.isUserLogged());
        }

    }

})();
