(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBDeleteBasketModalController', MmBDeleteBasketModalController);

    MmBDeleteBasketModalController.$inject = ['$uibModalInstance', 'localStorageService',
        'CommonsAncillariesService','BookingDashboardService', 'BookingDashboardModel','MmBAncillariesUtilsService',
        'NewMainHeaderFacade', 'MmBModalService', '$scope', '$rootScope'];
    function MmBDeleteBasketModalController($uibModalInstance, localStorageService, CommonsAncillariesService, BookingDashboardService, BookingDashboardModel,
        MmBAncillariesUtilsService, NewMainHeaderFacade, MmBModalService, $scope, $rootScope) {
        const vm = this;
        vm.continue = false;
        vm.showLoading = false;
        vm.error = false;
        vm.accept = accept;
        vm.deleteAncillaries = deleteAncillaries;
        vm.$onInit = activate;
        vm.model = BookingDashboardModel;
        $rootScope.$on('endLoadingPlaneEvent', accept);
        $rootScope.$on('anonymousSubmit', accept);
        ////////////////

        /**
         * Initialize modal controller
         */
        function activate() {
            vm.deleteAncillaries();
        }
        function deleteAncillaries() {
            vm.showLoading = true;
            CommonsAncillariesService.deleteAllAncillaries().then((cancelData) => {
                vm.showLoading = false;
                vm.continue = true;
                BookingDashboardService.deleteAllSeats();
                BookingDashboardService.deleteAllInsurance(vm.model);
                BookingDashboardService.deleteAllBaggages(vm.model);
                BookingDashboardService.deleteAllSpeqs(vm.model);
                BookingDashboardService.deleteAllPriorityBoarding(vm.model);

                localStorageService.remove('headerModel');
                localStorageService.remove('addToCart');
                if (cancelData && cancelData.failedToDelete.length > 0) {
                    pendinPaymentFailed = MmBAncillariesUtilsService.checkFailedPendingPayments(cancelData);
                } else {
                    initFacadeHeader();
                }

                BookingDashboardService.updateAncillarieSummary().then(refreshSuccess, refreshError);

                function refreshSuccess() {
                    $rootScope.$broadcast('updateBasket');
                }

                function refreshError(error) {
                    Promise.reject(error);
                }
            }, () => {
                vm.showLoading = false;
                vm.error = true;
            });
        }

        function initFacadeHeader() {
            NewMainHeaderFacade.initHeader(
                {
                    originDestination: null,
                    redemption: '',
                    flightType: null,
                    currency: localStorageService.get('currency'),
                    showBasket: true,
                    showModalBackHome: true
                },
                { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
                {
                    onLogin: function () {
                        MmBModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                    },
                    onError: function (error) {
                        MmBModalService.finishWaiting();
                    },
                    afterLogin: activate,
                    userLogged: localStorageService.get('userLogged'),
                    loggedData: localStorageService.get('customerData') || localStorageService.get('membershipData') || undefined
                }
            );
        }
        function accept() {
            if ($uibModalInstance) {
                vm.error === true ? localStorageService.set('isEmptyBasket', false) : localStorageService.set('isEmptyBasket', true);
                $uibModalInstance.close();
            }
        }
        function refreshAncillaries() {
            BookingDashboardService.updateAncillarieSummary().then(refreshSuccess, refreshError);

            function refreshSuccess() {
                $rootScope.$broadcast('updateBasket');
            }

            function refreshError(error) {
                Promise.reject(error);
            }
        }

    }
})();
