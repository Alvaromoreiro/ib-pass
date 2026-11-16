(function () {
    'use strict';

    angular
        .module('ib-header-module')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$window', '$rootScope', 'NewMainHeaderConstants', 'CommonsModalService', 'DatalayerConstants', '$scope', '$timeout', 'localStorageService', '$location'];

    function HeaderController ($window, $rootScope, NewMainHeaderConstants, CommonsModalService, DatalayerConstants, $scope, $timeout, localStorageService, $location) {
        const vm = this;
        const backToMainEvent = $rootScope.$on('backToMain', backToMain);
        const backToMultiFlightSearchEvent = $rootScope.$on('backToMultiFlightSearchEvent', backToMultiFlight);
        vm.showAdvancedSearch = false;
        vm.flowApp = localStorageService.get('flowApp');
        vm.activeAdvancedSearch = activeAdvancedSearch;
        vm.closeCurrentSession = closeCurrentSession;
        vm.isShuttleFlow = isShuttleFlow;

        vm.backToMain = backToMain;
        vm.backToMultiFlight = backToMultiFlight;
        $scope.$on('showWaitingModal', showWaitingModal);
        $scope.$on('$destroy', backToMainEvent);
        vm.$onInit = activate;
        vm.isMMB = $rootScope.flowName === 'MMB' ?? false;
        vm.isCKI = $rootScope.flowName === 'CKI' ?? false;
        vm.showComponentChooseLanguageMobile = showComponentChooseLanguageMobile;

        angular.element($window).on('resize', () => {
            calculateModelTripsHeader();
        });

        function activate () {
            calculateModelTripsHeader();
        }

        /**
         * Close session
         */
        function closeCurrentSession () {
            if (vm.closeSession) {
                $rootScope.closeSession();
            }
        }

        function backToMain (goToHome) {
            const actualStepFlow = localStorageService.get('actualStepFlow');
            const flowApp = localStorageService.get('flowApp');
            const onHoldOptions = localStorageService.get('onHoldOptions') || null;
            const dataModal = { idModal: DatalayerConstants.DATALAYER_MODAL_ID.BACK_MAIN_HEADER_MODAL };
            const isFlowBKIOnHold = (flowApp === 'BBKI' && onHoldOptions) && (actualStepFlow === 'ibcmtv' || actualStepFlow === 'ibpurc');

            if (vm.model.showModalBackHome) {
                if (isFlowBKIOnHold) {
                    /* SHOW MODAL DE ONHOLD ANCILLARIES & PAYMENTS BKI */
                    dataModal.idModal = DatalayerConstants.DATALAYER_MODAL_ID.SHOW_ONHOLD_MODAL;
                    CommonsModalService.showOnholdModal(true, 'ib-modal-onhold-header.html', dataModal).result.then(() => {
                        eventBackToMainRoot(goToHome);
                    }, () => {});
                } else {
                    showModalBackToMain(dataModal, goToHome);
                }

            } else {
                eventBackToMainRoot(goToHome);
            }
        }

        function eventBackToMainRoot (goToHome) {
            if (vm.closeSession) {
                $rootScope.$broadcast('backToMainRoot', goToHome, vm.closeSession);
            } else {
                $rootScope.$broadcast('backToMainRoot', goToHome);
            }
        }

        function showModalBackToMain (dataModal, goToHome) {
            CommonsModalService.showBackMainModalComponent(dataModal, true).result.then(
                () => {
                    eventBackToMainRoot(goToHome);
                }, () => { }
            );
        }

        function backToMultiFlight (event, goToHome) {
            const dataModal = { idModal: DatalayerConstants.DATALAYER_MODAL_ID.BACK_MAIN_HEADER_MODAL };
            if (!goToHome) {
                showModalBackToMain(dataModal);
            } else {
                eventBackToMainRoot();
            }

        }

        function showWaitingModal () {
            CommonsModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        }

        /**
         * Change value of model depend of width of window.
         */
        function calculateModelTripsHeader () {
            const width = $window.innerWidth;
            if (width < 768) {
                vm.numberTrips = NewMainHeaderConstants.TRIPS_NUMBER.SMALL;
            } else if (width >= 768 && width < 1280) {
                vm.numberTrips = NewMainHeaderConstants.TRIPS_NUMBER.MEDIUM;
            } else if (width >= 1280) {
                vm.numberTrips = NewMainHeaderConstants.TRIPS_NUMBER.LARGE;
            }
            if (width < 768) {
                vm.profileIcon = true;
            } else {
                vm.profileIcon = false;
            }
        }

        function activeAdvancedSearch () {
            $timeout(() => {
                vm.showAdvancedSearch = true;
            });
            $rootScope.$broadcast('toggleAdvancedSearch', true);
        }
        function isShuttleFlow () {
            return $rootScope.isShuttleFlow;
        }

        function showComponentChooseLanguageMobile () {
            const quadrigamsInvalid = [];
            const actualQuadrigam = $location.path().replace('/', '');

            return vm.isCKI && !quadrigamsInvalid.includes(actualQuadrigam);
        }
    }
})();
