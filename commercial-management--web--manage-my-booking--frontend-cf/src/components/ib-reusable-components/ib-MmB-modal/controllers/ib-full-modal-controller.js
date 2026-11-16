(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBFullModalController', MmBFullModalController);

    MmBFullModalController.$inject = ['$uibModalInstance', 'object', 'MmBModalService', '$scope', 'BookingDashboardConstants', '$timeout', '$location', '$window', 'BookingSearchService', 'localStorageService', '$rootScope', 'VoucherInformationService', 'VoucherRefundConfirmationTransformer', 'CashRefundService', 'CashRefundConfirmationTransformer', 'MmBUtilService', 'MmBAppConstants'];
    function MmBFullModalController($uibModalInstance, object, MmBModalService, $scope, BookingDashboardConstants, $timeout, $location, $window, BookingSearchService, localStorageService, $rootScope, VoucherInformationService, VoucherRefundConfirmationTransformer, CashRefundService, CashRefundConfirmationTransformer, MmBUtilService, MmBAppConstants) {

        //Attributes
        var vm = this;
        var index, proceedToNextStep, closeEntireModal, proceedCashNextStep;
        vm.model = object;
        vm.currentStep = null;
        vm.totalSteps = null;
        vm.modelStep = null;

        //Methods
        vm.$onInit = activate;
        vm.close = closeModal;
        vm.showModalClose = showModalClose;
        vm.showModalCloseAndReload = showModalCloseAndReload;
        vm.showModalCloseAndGoToIberia = showModalCloseAndGoToIberia;
        vm.showModalCloseAndGoToInitMMB = showModalCloseAndGoToInitMMB;
        vm.showModalCloseAndGoToLoginMMB = showModalCloseAndGoToLoginMMB;
        vm.getStepModel = getStepModel;
        vm.showModalCloseRefunds = showModalCloseRefunds;

        //Events

        $scope.$on('nextStep', nextStep);
        $scope.$on('prevStep', prevStep);
        $scope.$on('$destroy', destroyStyleHome);
        $scope.$on('activateCashFlow', activateCashFlow);

        proceedToNextStep = $rootScope.$on('proceedToVoucherNextStep', proceedToVoucherNextStep);
        closeEntireModal = $rootScope.$on('closeEntireModal', closeModal);
        proceedCashNextStep = $rootScope.$on('proceedToCashNextStep', proceedToCashNextStep);

        $scope.$on('$destroy', proceedToNextStep);
        $scope.$on('$destroy', closeEntireModal);
        $scope.$on('$destroy', proceedCashNextStep);

        /**
         * Initialize modal controller
         */
        function activate() {
            vm.currentStep = 1;
            if(vm.model.isCashFlow) {
                vm.isCashFlow = true;
            } else {
                vm.isCashFlow = false;
            }
            if (vm.model && vm.model.totalSteps) {
                vm.totalSteps = vm.model.totalSteps;
                vm.modelStep = [];
                for (index = 0; index < vm.totalSteps; index++) {
                    vm.modelStep.push({});
                }
            } else {
                vm.totalSteps = 2;
                vm.modelStep = [{}, {}];
            }
            vm.modelStep[0] = vm.model;
            vm.flags = localStorageService.get('orderFlags');
            //Add scroll to modal
            $timeout(function () {
                angular.element('.modal-dialog').css('overflow-y', 'scroll');
            });
        };

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal() {
            if (vm.model.isDisruption) {
                if (vm.currentStep === 1 || vm.currentStep === 2) {
                    vm.isCashFlow = false;
                    if (vm.currentStep === 2) {
                        localStorageService.remove('voucherFromEmail');
                        localStorageService.remove('openVoucherRefundModal');
                    }
                    vm.currentStep === 1 ? $uibModalInstance.dismiss('cancel') : prevStep();
                } else {
                    $location.path($window.location.origin);
                    MmBModalService.closeAllCurrentModals();
                }
            } else {
                if (vm.currentStep === 1) {
                    $uibModalInstance.dismiss('cancel');
                } else {
                    $location.path($window.location.origin);
                    MmBModalService.closeAllCurrentModals();
                }
            }
        }


        /**
         * Change current step to next if is possible (is not the last)
         * @param event
         * @param data is the model for the next step component
         */
        function nextStep(event, data) {
            if (vm.currentStep < vm.totalSteps) {
                $window.scrollTo(0, 0);
                vm.currentStep = vm.currentStep + 1;
                vm.modelStep[vm.currentStep - 1] = data;
            }
        }

        /**
         * Change current step to prev if is possible (is not the first)
         * @param event
         * @param data is the model for the pref step component
         */
        function prevStep(event, data) {
            if (vm.currentStep > 1) {
                $window.scrollTo(0, 0);
                vm.currentStep = vm.currentStep - 1;
                vm.modelStep[vm.currentStep - 1] = data;
            }
        }

        /** Remove overflow: hidden in body when close the full modal */
        function destroyStyleHome(e) {
            angular.element('body').css('overflow-y', 'auto');
        }

        /**
         * Get the model object for the current step
         * @param step number
         */
        function getStepModel(step) {
            return vm.modelStep[step - 1];
        }

        /**
         * Open close modal validation and reload import-order.
         * @param {String} template Name of template.
         */
        function showModalClose(tpl) {
            var template;
            tpl ? template = tpl : template = 'generic-close-change-flight.html';
            MmBModalService.showGenericModal(false, template, vm.model).result.then(function (data) {
                if (data === 'goHome') {
                    $rootScope.blockedKeepAliveModal = false;
                    MmBModalService.closeAllCurrentModals();
                    $scope.$emit('changeTabEvent', BookingDashboardConstants.TABS.management);
                }
            }, angular.noop);
        }

        /**
         * Open close modal validation and reload import-order.
         * @param {boolean} isModalLink Variable to notice if the click is from the link or from the logo
         */
        function showModalCloseRefunds(isModalLink) {
            var template = 'generic-close-voucher-process.html';
            vm.model.isModalLink = isModalLink;

            if (vm.model.isDisruption) {
                if (vm.currentStep === 1 || vm.currentStep === 2) {
                    MmBModalService.showGenericModal(false, template, vm.model).result.then(function () {
                        $rootScope.blockedKeepAliveModal = false;
                        MmBModalService.closeAllCurrentModals();
                        if (!vm.model.isDisruption) $scope.$emit('changeTabEvent', BookingDashboardConstants.TABS.refunds);
                    }, angular.noop);
                } else {
                    $location.path($window.location.origin);
                    MmBModalService.closeAllCurrentModals();
                }
            } else {
                if (vm.currentStep === 1) {
                    MmBModalService.showGenericModal(false, template, vm.model).result.then(function () {
                        $rootScope.blockedKeepAliveModal = false;
                        MmBModalService.closeAllCurrentModals();
                        if (!vm.model.isDisruption) $scope.$emit('changeTabEvent', BookingDashboardConstants.TABS.refunds);
                    }, angular.noop);
                } else {
                    $location.path($window.location.origin);
                    MmBModalService.closeAllCurrentModals();
                }
            }
        }

        /**
         * Open close modal validation and reload import-order.
         * @param {String} template Name of template.
         */
        function showModalCloseAndReload(openModal) {
            var template = 'generic-close-change-flight.html';
            if (openModal) {
                MmBModalService.showGenericModal(false, template, vm.model).result.then(function (data) {
                    if (data === 'goHome') {
                        $rootScope.blockedKeepAliveModal = false;
                        MmBModalService.closeAllCurrentModals();
                        $scope.$emit('reloadImportOrder');
                    }
                }, angular.noop);
            } else {
                MmBModalService.closeAllCurrentModals();
                $scope.$emit('reloadImportOrder');
            }
        }

        /**
         * Open close modal validation and reload import-order.
         * @param {String} template Name of template.
         */
        function showModalCloseAndGoToIberia(tpl) {
            var template;
            tpl ? template = tpl : template = 'generic-close-change-flight.html';
            vm.model.isModalLink = false;
            if (vm.model.isDisruption) {
                if (vm.currentStep === 1 || vm.currentStep === 2) {
                    MmBModalService.showGenericModal(false, template, vm.model).result.then(function (data) {
                        if (data === 'goHome') {
                            $rootScope.blockedKeepAliveModal = false;
                            localStorageService.remove('voucherFromEmail');
                            localStorageService.remove('openVoucherRefundModal');
                            $window.location = MmBUtilService.removeAllParams();
                            $location.path($window.location.origin);
                            MmBModalService.closeAllCurrentModals();
                        }
                    }, angular.noop);
                } else {
                    MmBModalService.closeAllCurrentModals();
                    $window.location = MmBUtilService.removeAllParams();
                    $location.path($window.location.origin);
                }
            } else {
                if (vm.currentStep === 1) {
                    MmBModalService.showGenericModal(false, template, vm.model).result.then(function (data) {
                        if (data === 'goHome') {
                            $rootScope.blockedKeepAliveModal = false;
                            localStorageService.remove('voucherFromEmail');
                            localStorageService.remove('openVoucherRefundModal');
                            $window.location = MmBUtilService.removeAllParams();
                            $location.path($window.location.origin);
                            MmBModalService.closeAllCurrentModals();
                        }
                    }, angular.noop);
                } else {
                    MmBModalService.closeAllCurrentModals();
                    $window.location = MmBUtilService.removeAllParams();
                    $location.path($window.location.origin);
                }
            }
        }

        /**
         * Open close modal validation and reload import-order.
         * @param {String} template Name of template.
         */
        function showModalCloseAndGoToLoginMMB() {
            var template = 'generic-close-change-flight.html';
            MmBModalService.showGenericModal(false, template, vm.model).result.then(function (data) {
                if (data === 'goHome') {
                    $rootScope.blockedKeepAliveModal = false;
                    MmBModalService.closeAllCurrentModals();
                    $location.path(MmBAppConstants.PAGES_URL.SEARCH);
                }
            }, angular.noop);
        }

        /**
         * Open close modal validation and launch init process of login.
         * @param {String} template Name of template.
         */
        function showModalCloseAndGoToInitMMB(openModal) {
            var template = 'generic-close-change-flight.html';
            var pnr = localStorageService.get('PNR');
            var surname = localStorageService.get('checkinSurname');
            var dataBooking = {
                'surname': surname,
                'pnr': pnr,
                'isAirShuttle': false
            };
            if (openModal) {
                MmBModalService.showGenericModal(false, template, vm.model).result.then(function (data) {
                    if (data === 'goHome') {
                        $rootScope.blockedKeepAliveModal = false;
                        MmBModalService.closeAllCurrentModals();
                        BookingSearchService.searchFlightsPassengersEvent(null, dataBooking);
                    }
                }, angular.noop);
            } else {
                $rootScope.blockedKeepAliveModal = false;
                MmBModalService.closeAllCurrentModals();
                BookingSearchService.searchFlightsPassengersEvent(null, dataBooking);
            }
        }
        function proceedToVoucherNextStep(evt, data) {
            var flowId = localStorageService.get('flowId');
            const voucherRequest = VoucherRefundConfirmationTransformer.generateConfirmationRefundRequest(data);
            vm.voucherData = {};
            MmBModalService.showWaitingModal(data);
            VoucherInformationService.getVoucherConfirmationInfo(flowId, voucherRequest).then(goToVoucherConfirmation, showErrorModal);

            function goToVoucherConfirmation(response) {
                vm.voucherData = VoucherRefundConfirmationTransformer.generateVoucherData(response, response.price, response.price.fare, response.price.currency);
                localStorageService.remove('bookingInfo');
                MmBModalService.finishWaiting();
                nextStep();
            }
        }

        function proceedToCashNextStep(event) {
            var flowId = localStorageService.get('flowId');
            const cashRequest = CashRefundConfirmationTransformer.generateCashConfirmationRequest(flowId);
            MmBModalService.showWaitingModal();
            CashRefundService.getCashRefundConfirmation(flowId, cashRequest).then(goToCashConfirmation, showErrorModal);

            function goToCashConfirmation(response) {
                vm.cashData = CashRefundConfirmationTransformer.generateCashConfirmationData(response);

                MmBModalService.finishWaiting();
                nextStep();
            }
        }

        function showErrorModal(error) {
            if (error.errorCode === 409 && error.internalErrorCode === 'SSE_ORM_9404') {
                error.title = 'MMB_VOUCHER_APPLICATION_IN_PROGRESS_ERROR_TITLE';
            }
            MmBModalService.finishWaiting();
            MmBModalService.showGenericError(error, true, 'ib-modal-error-voucher.html').result.then(angular.noop, angular.noop);
        }

        function activateCashFlow(event) {
            vm.isCashFlow = true;
        }
    }
})();
