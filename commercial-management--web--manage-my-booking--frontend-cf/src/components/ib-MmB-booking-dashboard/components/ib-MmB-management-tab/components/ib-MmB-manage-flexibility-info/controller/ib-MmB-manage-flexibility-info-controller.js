(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-flexibility-info-module')
        .controller('MmbManageFlexibilityInfoController', MmbManageFlexibilityInfoController);

    MmbManageFlexibilityInfoController.$inject = ['MmBModalService', 'localStorageService', '$filter', '$window', '$rootScope'];

    function MmbManageFlexibilityInfoController(MmBModalService, localStorageService, $filter, $window, $rootScope) {
        var vm = this;
        vm.total;
        vm.$onInit = activate;
        vm.openCallCenterModalFlex = openCallCenterModalFlex;
        vm.openRefundFlowFromInfo = openRefundFlowFromInfo;
        vm.openChangeFlightsFlowFromInfo = openChangeFlightsFlowFromInfo;
        vm.openPackFlex = openPackFlex;


        function activate() {
            var bookingInfo = localStorageService.get('bookingInfo'), segmentsInfo = localStorageService.get('segmentsInfo');
            vm.activeLink = false;
            vm.trips = bookingInfo;
            completeSegmentsInfo(segmentsInfo);
            checkFlags();
            if (vm.ancillariesInfo && vm.ancillariesInfo.ancillariesAvailable && vm.ancillariesInfo.isAncillariesInTime && vm.ancillariesInfo.isAncillariesInTime.isIntime) {
                angular.forEach(vm.ancillariesInfo.ancillariesAvailable, function (ancillaryType) {
                    if (ancillaryType === 'VOUCHER_REFUND' && !vm.ancillariesInfo.isPnrGroup) {
                        vm.activeLink = false;
                    }
                });
            }
        }

        function openCallCenterModalFlex(modalName) {
            var modalBody = {
                title: '',
                message: 'MMB_ANCILLARIES_FLEXIBILITY_MODAL_MESSAGE',
                needsTranslate: true
            };
            if (vm.clickToCallCenter) {
                if (modalName === 'FLIGHT_CHANGE') {
                    modalBody.title = 'MMB_ANCILLARIES_FLEXIBILITY_CHANGE_FLIGHT_MODAL_TITLE';
                    MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(function () {
                    }, angular.noop);
                } else if (modalName === 'VOUCHER_REFUND') {
                    modalBody.title = 'MMB_ANCILLARIES_FLEXIBILITY_REFUND_MODAL_TITLE';
                    MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(function () {
                    }, angular.noop);
                } else if (modalName === 'refunds') {
                    modalBody.title = 'MMB_ANCILLARIES_FLEXIBILITY_REFUND_MODAL_TITLE';
                    modalBody.message = 'MMB_ANCILLARIES_FLEXIBILITY_REFUND_MODAL_MESSAGE';
                    MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(function () {
                    }, angular.noop);
                } else if (modalName === 'refundsCallCenter') {
                    modalBody.title = 'MMB_ANCILLARIES_FLEXIBILITY_REFUND_MODAL_TITLE';
                    modalBody.message = 'MMB_ANCILLARIES_FLEXIBILITY_MODAL_MESSAGE';
                    MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(function () {
                    }, angular.noop);
                }
            }
        }

        function openRefundFlowFromInfo() {
            vm.tabs.activeTab = vm.tabs.tabs.refunds;
            $rootScope.$emit('changeTabEvent', vm.tabs.tabs.refunds);
            scrollToTop();
        }

        function openChangeFlightsFlowFromInfo() {
            vm.tabs.activeTab = vm.tabs.tabs.changeFlights;
            $rootScope.$emit('changeTabEvent', vm.tabs.tabs.changeFlights);
            scrollToTop();
        }

        function openPackFlex(modalBody, percentage, showModalRefound48hs) {
            var i;
            modalBody.title = 'Pack flexibilidad';
            if (percentage >= 100) {
                modalBody.message = $filter('translate')('ANCILLARIES_FLEXIBILITY_SELECT_FLIGTH_OR_REFOUND');
                modalBody.optionRefound = $filter('translate')('ANCILLARIES_FLEXIBILITY_SELECT_FLIGTH_OR_REFOUND');
            } else {
                modalBody.message = $filter('translate')('ANCILLARIES_FLEXIBILITY_SELECT_FLIGTH_OR_PARTIAL_REFOUND');
            }
            for (i = 0; i < vm.orderFlags.length; i++) {
                if (vm.orderFlags[i].type === 'VOUCHER_REFUND_ON_DEMAND' && vm.orderFlags[i].enabled === false) {
                    modalBody.modalCallCenter = true;
                    vm.clickToCallCenter = true;
                }
            }
            modalBody.textRefound = percentage;
            modalBody.flexSelected = 'FLIGHT';
            MmBModalService.showGenericModal(false, 'ib-modal-new-onrequest-flexibilization-pack-mmb.html', modalBody).result.then(function (data) {
                if (data === 'FLIGHT') {
                    openChangeFlightsFlowFromInfo();
                } else if (data === 'REFOUND') {
                    if (showModalRefound48hs) {
                        $rootScope.$broadcast('closeEntireModal');
                        openCallCenterModalFlex('refunds');
                    } else if (modalBody.modalCallCenter) {
                        $rootScope.$broadcast('closeEntireModal');
                        openCallCenterModalFlex('refundsCallCenter');
                    } else {
                        openRefundFlowFromInfo();
                    }
                }

            }, angular.noop);
        }

        function checkFlags() {
            var i, j;
            for (i = 0; i < vm.trips.orderFlags.length; i++) {
                if (vm.trips.orderFlags[i].type === 'VOUCHER_REFUND_ON_DEMAND' && vm.trips.orderFlags[i].enabled) {
                    vm.clickToCallCenter = true;
                }
            }
            for (j = 0; j < vm.flags[0].flags.length; j++) {
                if (vm.flags[0].flags[j].type === 'FLIGHT_MODIFICATION_ON_DEMAND' && vm.flags[0].flags[j].enabled) {
                    vm.clickToopenChangeFlightsFlowFromInfo = true;
                }
            }
        }

        function completeSegmentsInfo(segmentsInfo) {
            var i, j;
            for (i = 0; i < segmentsInfo.length; i++) {
                for (j = 0; j < vm.model[0].segments.length; j++) {
                    if (segmentsInfo[i].id === vm.model[0].segments[j].segmentId) {
                        vm.model[0].segments[j].destination = segmentsInfo[i].destination;
                        vm.model[0].segments[j].origin = segmentsInfo[i].origin;
                    }
                }
            }
        }

        function scrollToTop() {
            $window.scrollTo(0, 0);
        }
    }
})();
