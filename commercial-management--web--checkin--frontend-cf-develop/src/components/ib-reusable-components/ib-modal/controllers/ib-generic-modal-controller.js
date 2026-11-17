import { CheckinAppConstants } from "@src/components/routing/ib-check-in-constants";

(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('CKIGenericModalController', CKIGenericModalController);

    CKIGenericModalController.$inject = ['$uibModalInstance', 'ModalService', '$anchorScroll', '$location', '$route', 'object', 'CkiDatalayerUtilsService', 'localStorageService', '$rootScope', '$cookies'];
    function CKIGenericModalController ($uibModalInstance, ModalService, $anchorScroll, $location, $route, object, CkiDatalayerUtilsService, localStorageService, $rootScope, $cookies) {

        const vm = this;

        vm.accept = accept;
        vm.errorMessage = errorMessage;
        vm.errorsCode = errorsCode;
        vm.changeToTrue = changeToTrue;
        vm.close = close;
        vm.acceptBoardingCards = acceptBoardingCards;
        vm.gotoAnchor = gotoAnchor;
        vm.acceptPendingAqqError = acceptPendingAqqError;
        vm.apisUncheckableError = apisUncheckableError;
        vm.closePendingPayments = closePendingPayments;
        vm.acceptSeatsMapErrror = acceptSeatsMapErrror;
        vm.cancelChangeSeats = cancelChangeSeats;
        vm.errorPassenger = errorPassenger;
        vm.continueCheckinBiometric = continueCheckinBiometric;
        vm.eventEmit = eventEmit;
        vm.returnBiometricModal = returnBiometricModal;
        vm.buildDataShowInfoInhibitBoardingCard = buildDataShowInfoInhibitBoardingCard;
        vm.model = object;
        vm.needsTranslate = true;
        vm.title = {
            message: 'MOD_INFO_TITLE',
            needsTranslate: true,
            subtitle: {
                status: false,
                message: '',
                needsTranslate: false
            }
        };
        vm.btns = {
            accept: {
                show: true,
                text: 'MODAL_ACCEPT'
            },
            cancel: {
                show: false,
                text: 'CKIANC_MODINFO_CANCELAR'
            }
        };
        vm.isMixInhibition = false;
        vm.doNotShowAgainBiometricModal = false;
        vm.doNotShowAgainBiometricModalChange = doNotShowAgainBiometricModalChange;

        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            CkiDatalayerUtilsService.sendDatalayerModalEvent(vm.model);
            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerModalAttrs, CkiDatalayerUtilsService.removeDatalayerModalAttrs);

            vm.title.needsTranslate = (vm.model?.title?.needsTranslate);
            vm.title.message = (vm.model?.title?.message) ? vm.model.title.message : 'MOD_INFO_TITLE';
            if (angular.isDefined(vm.model?.btns))
                vm.btns = vm.model.btns;
            vm.btns.cancel.show = (vm.model?.showButtonCancel);
            if (vm.model?.needsTranslate) {
                vm.needsTranslate = vm.model.needsTranslate;
            } else if (vm.model?.message?.needsTranslate) {
                vm.needsTranslate = vm.model.message.needsTranslate;
            }

            buildDataShowInfoInhibitBoardingCard(vm.model);
        }

        function accept () {
            if (vm.isMixInhibition) {
                localStorageService.set('inhibitBoardingCard', vm.model);
                acceptBoardingCards();
            } else {
                $uibModalInstance.close();
            }
        }

        function errorMessage () {
            return ModalService.getErrorMessage();
        }

        function errorPassenger () {
            return ModalService.getErrorPassenger();
        }

        function errorsCode () {
            return ModalService.getErrorCode();
        }

        function acceptBoardingCards () {
            localStorageService.set('nextStepAllowed', false);
            $location.path('/ibcocf-and-ibeccf');
            ModalService.isNotWaiting();
            close();
        }

        function continueCheckinBiometric (finalize) {
            if (vm.model?.continueCheckinBiometric && finalize) {
                localStorageService.set('nextStepAllowed', false);
                localStorageService.set('noShowMessageBockBack', true);
                localStorageService.set('biometricFormInit', true);
                $location.path('/ckbio');
            } else {
                localStorageService.set('biometricUserNotInterested', true);
                if(!localStorageService.get('biometricSomeComplete')) {
                    ModalService.showGenericModal({}, true, 'ib-modal-biometric-not-activated');
                }
            }
            close();
        }

        function returnBiometricModal () {
            const initFormBiometricManual = localStorageService.get('biometricFormInit');

            if (initFormBiometricManual !== null && !initFormBiometricManual && !getDoNotShowAgainBiometricModalCookieValue()) {
                ModalService.showGenericModal({ continueCheckinBiometric: true }, true, 'ib-modal-biometric-boarding-available');
            }

            close();
        }

        function doNotShowAgainBiometricModalChange () {
            if (vm.doNotShowAgainBiometricModal) {
                const expiration = new Date();
                expiration.setTime(expiration.getTime() + CheckinAppConstants.COOKIES.DEFAULT_EXPIRY_TIME);
                $cookies.put(CheckinAppConstants.COOKIES.BIOMETRIC_BOARDING_DO_NOT_SHOW, 'true', {
                    expires: expiration
                });
            } else {
                $cookies.remove(CheckinAppConstants.COOKIES.BIOMETRIC_BOARDING_DO_NOT_SHOW);
            }
        }

        function getDoNotShowAgainBiometricModalCookieValue () {
            return $cookies.get(CheckinAppConstants.COOKIES.BIOMETRIC_BOARDING_DO_NOT_SHOW);
        }

        function acceptSeatsMapErrror () {
            $location.path('/ckianc');
            close();
        }

        function cancelChangeSeats (change) {
            if (change) {
                $uibModalInstance.close();
            } else {
                $uibModalInstance.dismiss();
            }
        }

        function closePendingPayments () {
            $uibModalInstance.close(null);
        }

        function acceptPendingAqqError () {
            $route.reload();
            close();
        }
        function apisUncheckableError () {
            $location.path('/ibcoac');
            close();
        }

        function close () {
            if (vm.errorsCode() === 'IB_00002') {
                $location.path('/ibcose');
            }
            if (vm.model.confirmation) {
                $location.path('/ibcocf-and-ibeccf');
            }
            if (vm.model.biometricDocumentError)
                $rootScope.$emit('documentError');

            ModalService.setErrorCode('');
            $uibModalInstance.dismiss('cancel');
        }

        function changeToTrue () {
            $uibModalInstance.close('cancel');
        }

        function gotoAnchor (x) {
            const newHash = x;
            if ($location.hash() !== newHash) {
                $location.hash(x);
            } else {
                $anchorScroll();
            }
        }

        function eventEmit (nameEvent) {
            $rootScope.$broadcast(nameEvent);
            close();
        }

        function buildDataShowInfoInhibitBoardingCard (model) {
            if ((model?.airCheck?.status && model?.inhibitBoardingCard?.status) ||
                (!model?.airCheck?.status && model?.inhibitBoardingCard?.status)) {
                vm.btns.accept.show = true;
                vm.btns.accept.text = model.modal.btn.accept;

                vm.btns.cancel.show = true;
                vm.btns.cancel.text = model.modal.btn.cancel;
                vm.isMixInhibition = true;

                vm.needsTranslate = true;
                vm.title.message = model.modal.title.message;
                vm.title.needsTranslate = true;

                if (model?.modal?.title?.subtitle?.status) {
                    vm.title.subtitle = model.modal.title.subtitle;
                    vm.btns.cancel.show = false;
                    vm.btns.accept.text = 'BUTTON_CONTINUE_TEXT';
                }

                model.message = model.modal.message;
                model.needsTranslate = model.modal.needsTranslate;
            }
        }
    }
})();
