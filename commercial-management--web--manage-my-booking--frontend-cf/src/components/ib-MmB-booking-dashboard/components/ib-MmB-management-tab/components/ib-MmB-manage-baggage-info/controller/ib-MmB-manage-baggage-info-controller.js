import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { Skeleton } from "commercial-management--digital--web-components-design--library";
(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-baggage-info-module')
        .controller('MmbManageBaggageInfoController', MmbManageBaggageInfoController);

    MmbManageBaggageInfoController.$inject = ['$rootScope', 'MmBModalService', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'localStorageService', 'CommonsUtilService'];

    function MmbManageBaggageInfoController($rootScope, MmBModalService, MmBDatalayerUtilsService, MmBAppConstants, localStorageService, CommonsUtilService) {
        var vm = this;
        vm.activeLink = null;
        vm.total = null;
        vm.openModalConditions = openModalConditions;
        vm.getSlicesAncillaries = getSlicesAncillaries;
        vm.checkBundleItems = checkBundleItems;
        vm.isActiveLink = isActiveLink;
        vm.slicesAncillaries = null;
        vm.$onInit = activate;

        vm.skeletonComponent = Skeleton;
        vm.skeletonProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__baggage'
        };
        vm.skeletonIconProps = {
            className:'mmb-skeleton-dashboard mmb-skeleton-dashboard__skeleton-icon'
        };

        vm.skeletonBaggageProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__baggage-height'
        };


        vm.isSkeletonMode = false;

        function activate() {
            
            vm.isSkeletonMode = vm.model && vm.model.isSkeletonView;
            
            
            if (vm.isSkeletonMode) {
                return;
            }

            vm.activeLink = false;
            vm.getSlicesAncillaries();
            if (vm.ancillariesInfo && vm.ancillariesInfo.ancillariesAvailable && vm.ancillariesInfo.isAncillariesInTime && vm.ancillariesInfo.isAncillariesInTime.isIntime) {
                angular.forEach(vm.ancillariesInfo.ancillariesAvailable, function (ancillaryType) {
                    if (ancillaryType === 'BAGGAGE' && !vm.ancillariesInfo.isPnrGroup) {
                        vm.activeLink = true;
                    }
                });
            }
            vm.checkBundleItems();
        }

        function isActiveLink(segment) {
            const sliceId = segment.segments[0].sliceId;
            let available;
            if (vm.slicesAncillaries) {
                vm.slicesAncillaries.forEach(slice => {
                    if (slice.id === sliceId) {
                        available = slice.status.code;
                    }
                });
            };

            return available === 'AVAILABLE' ? true : false;

        }

        function openModalConditions(event, sliceBaggage) {
            vm.activeLink = isActiveLink(sliceBaggage);
            MmBModalService.showGenericModal(false, 'ib-show-baggages-modal.html', {
                'selectedSliceInfo': sliceBaggage,
                'activeLink': vm.activeLink
            }, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
            CommonsUtilService.setTitlePage('MMB_BAGGAGE_MODAL_TITLE');
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MODBAG, MMBDatalayerConstants.DIGITAL_DATA_STEP.MODBAG, MmBAppConstants.QUADRIGAM.MODAL_INFO_BAGGAGE);
        }

        function getSlicesAncillaries() {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            if (ancillariesInfo !== null && ancillariesInfo.ancillaries) {
                ancillariesInfo.ancillaries.forEach(info => {
                    if (info.type === 'BAGGAGE') {
                        vm.slicesAncillaries = info.slices;
                    }
                });
            }
        }

        function checkBundleItems() {
            if (localStorageService.get('bundleBaggsPerFlight')) {
                let bundleBaggsPerFlight = localStorageService.get('bundleBaggsPerFlight');
                if (!bundleBaggsPerFlight.deleted) {
                    for (let i = 0; i < vm.model.baggageInfo.length; i++) {
                        for (let j = 0; j < vm.model.baggageInfo[i].segments.length; j++) {
                            let sliceBaggage = vm.model.baggageInfo[i].segments[j].sliceBaggage;
                            sliceBaggage.hold.totalUnits -= bundleBaggsPerFlight.quantity;
                            sliceBaggage.hold.totalglobal -= bundleBaggsPerFlight.quantity;
                            for (let k = 0; k < sliceBaggage.passBaggages.length; k++) {
                                let bundleBaggsPerFlightAndPass = bundleBaggsPerFlight.quantity / sliceBaggage.passBaggages.length;
                                for (let l = 0; l < sliceBaggage.passBaggages[k].baggageData.length; l++) {
                                    if (sliceBaggage.passBaggages[k].baggageData[l].subtype === bundleBaggsPerFlight.subtype) {
                                        sliceBaggage.passBaggages[k].baggageData[l].purchasedPieces -= bundleBaggsPerFlightAndPass;
                                        if (sliceBaggage.passBaggages[k].baggageData[l].purchasedPieces <= 0) {
                                            sliceBaggage.passBaggages[k].baggageData.splice(l, 1);
                                        }
                                    }
                                }
                                checkPassengerBaggageData(sliceBaggage.passBaggages[k]);
                            }
                            checkHoldBaggageData(sliceBaggage);
                        }
                    }
                }
                bundleBaggsPerFlight.deleted = true;
                localStorageService.set('bundleBaggsPerFlight', bundleBaggsPerFlight);
            }
        }

        function checkPassengerBaggageData(passBaggage) {
            if(passBaggage.baggageData.length === 0) {
                delete passBaggage.baggageData;
            }
        }

        function checkHoldBaggageData(sliceBaggage) {
            if(sliceBaggage.hold.totalUnits === 0) {
                delete sliceBaggage.hold;
            }
        }
    }
})();
