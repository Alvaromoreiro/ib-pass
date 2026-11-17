(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('CheckinGenericErrorModalController', CheckinGenericErrorModalController);

    CheckinGenericErrorModalController.$inject = ['$uibModalInstance', 'ModalService', '$anchorScroll', '$location', '$route', 'ErrorModel', 'CkiDatalayerUtilsService', '$filter', 'localStorageService', 'GetCKICachedInformationService', 'CheckinAppConstants'];
    function CheckinGenericErrorModalController ($uibModalInstance, ModalService, $anchorScroll, $location, $route, ErrorModel, CkiDatalayerUtilsService, $filter, localStorageService, GetCKICachedInformationService, CheckinAppConstants) {

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
        vm.model = ErrorModel;
        vm.titleModal = titleModal;
        vm.errorCarrierConnect = errorCarrierConnect;
        vm.print = print;
        vm.checkInhibitBoardingCard = checkInhibitBoardingCard;
        vm.isInhibitAircheck = false;
        vm.isInhibitReason = false;
        vm.isInhibitITEM = false;

        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            /* INIT DELETE GA4 MIGRATION*/
            CkiDatalayerUtilsService.sendDatalayerErrorEvent(vm.model);
            /* FIN DELETE GA4 MIGRATION*/
            CkiDatalayerUtilsService.sendDigitalDataErrorEvent(vm.model);
            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerErrorAttrs, CkiDatalayerUtilsService.removeDatalayerErrorAttrs);
            vm.checkInhibitBoardingCard(vm.model?.inhibitBoardingCard);
        }

        function print () {
            document.getElementsByClassName('modal-content')[0].classList.add('ib-modal-print');
            window.print();
            document.getElementsByClassName('modal-content')[0].classList.remove('ib-modal-print');
        }

        function titleModal () {
            let literal = 'MOD_ERROR_TIT';
            let isNeedTranslate = true;
            if (vm.model.title) {
                if (vm.model.title.needsTranslate) {
                    literal = vm.model.title.message;
                } else {
                    literal = vm.model.title;
                    isNeedTranslate = false;
                }
            } else if (vm.model.errorCode === 409 && vm.model.internalErrorCode === CheckinAppConstants.ERROR_CODE.CARRIER_CONNECT.PRINT_9019) {
                literal = 'SORRY_ERROR';
            }

            return isNeedTranslate ? $filter('translate')(literal) : literal;
        }

        function accept () {
            if (vm.errorsCode() === 'IB_00002') {
                $location.path('/ibcose');
            }
            $uibModalInstance.close();
        }

        function errorMessage () {
            const errorLiteral = ModalService.getErrorMessage();
            return $filter('translate')(errorLiteral);
        }

        function errorPassenger () {
            return ModalService.getErrorPassenger();
        }

        function errorsCode () {
            return ModalService.getErrorCode();
        }

        function acceptBoardingCards () {
            $location.path('/ibcocf-and-ibeccf');
            close();
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

        function errorCarrierConnect () {
            ModalService.isWaiting();
            localStorageService.set('errorCarrierConnect', true);
            ModalService.setErrorCode('');
            $uibModalInstance.dismiss('cancel');

            GetCKICachedInformationService.getCachedInformation().then((data) => {
                localStorageService.set('bookingInfo', data);
                goToIbcoac();
            }, (error) => {
                goToIbcoac();
            });
            function goToIbcoac () {
                if ($location.path() === '/ibcoac') {
                    $route.reload();
                } else {
                    $location.path('/ibcoac');
                }
            }

        }

        function close () {
            if (vm.errorsCode() === 'IB_00002') {
                $location.path('/ibcose');
            } else if (shouldUseCarrierConnect()) {
                vm.errorCarrierConnect();
                return;
            }

            dismissErrorModal();
        }

        function shouldUseCarrierConnect () {
            return Boolean(vm.model?.airCheck?.status) || isCarrierConnectPrintError();
        }

        function isCarrierConnectPrintError () {
            const printErrorCodes = CheckinAppConstants.ERROR_CODE.CARRIER_CONNECT;

            return vm.model?.errorCode === 409 && [
                printErrorCodes.PRINT_9019,
                printErrorCodes.PRINT_9017
            ].indexOf(vm.errorsCode()) !== -1;
        }

        function dismissErrorModal () {
            ModalService.setErrorCode('');
            $uibModalInstance.dismiss('cancel');
        }

        function changeToTrue () {
            $uibModalInstance.close('cancel');
        }

        function gotoAnchor (newHash) {
            if ($location.hash() !== newHash) {
                $location.hash(newHash);
            } else {
                $anchorScroll();
            }
        }

        /**
         * Show info inhibit boarding card
         */
        function checkInhibitBoardingCard (inhibitBoardingCard) {
            if (inhibitBoardingCard?.status && Array.isArray(inhibitBoardingCard?.reason)) {
                vm.isInhibitAircheck = inhibitBoardingCard.isAircheckReason;
                vm.isInhibitReason = inhibitBoardingCard.isInhibitReason;
                //vm.isInhibitITEM = (inhibitBoardingCard.priority && CheckinAppConstants.INHIBIT_BOARDING_CARD_PRIORITIES.includes(inhibitBoardingCard.priority));
            }
        }
    }
})();
