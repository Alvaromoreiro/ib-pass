import { Skeleton } from "commercial-management--digital--web-components-design--library";
(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-invoice-info-module')
        .controller('MmbManageInvoiceInfoController', MmbManageInvoiceInfoController);

    MmbManageInvoiceInfoController.$inject = ['$filter', '$scope', 'MmBModalService', 'MmBDatalayerUtilsService', 'localStorageService', 'CurrencyService', 'MmBAppConstants'];

    function MmbManageInvoiceInfoController($filter, $scope, MmBModalService, MmBDatalayerUtilsService, localStorageService, CurrencyService, MmBAppConstants) {
        var vm = this;
        var result, noTax, totalTax, index, baggage, passBaggages, hold;
        vm.extraHold = null;
        vm.totalHold = null;
        vm.taxNumber = null;
        vm.showPetc = false;
        vm.hold = null;
        vm.requestBill = [{
            'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'),
            'path': $filter('LinksFilter')('IBCOAC_MMB_REQUEST_BILL_LINK')
        }];

        vm.$onInit = activate;
        vm.cleanTax = cleanTax;
        vm.seatNotFree = false;

        vm.skeletonComponent = Skeleton;
        vm.skeletonProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-invoice__header--title',
        };
        vm.skeletonTitle = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-invoice__title-breakdown',
        };

        vm.skeletonBreakdown = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-invoice__breakdown',
        };


        function activate() {
            noTax = vm.cleanTax(vm.model?.fare);
            totalTax = vm.cleanTax(vm.model?.total);
            if (vm.model?.total && !angular.isString(vm.model.total)) {
                vm.model.total = CurrencyService.formatPrice(localStorageService.get('bookingInfo').contextMetadata.currencies, vm.model.total, true);
            }
            if(vm.model?.isLongCurrency ){
                vm.model.isLongCurrency = MmBAppConstants.LONG_COINS_MARKETS.indexOf(vm.model?.currency) !== -1; 
            }
            calcTotalTax();
            checkseatNotFree();
            checkPetc();
        }

        function checkPetc() {
            if (vm.model.petc) {
                vm.showPetc = vm.model.petc.some(pet =>
                    pet.emd !== MmBAppConstants.PETS_STATUS.PENDING_PAYMENT
                );
            }
        }

        function checkseatNotFree() {
            angular.forEach(vm.model?.seatsPricesByType, function (seats, key) {
                angular.forEach(seats, function (seat, key) {
                    if (seat.baseTotal > 0) {
                        vm.seatNotFree = true;
                    }
                });
            });
        }

        function calcTotalTax() {
            for (index = 0; index < vm.baggages?.baggageInfo?.length; index++) {
                baggage = vm.baggages.baggageInfo[index];
                passBaggages = baggage.segments[0].sliceBaggage.passBaggages[0];
                hold = passBaggages.hold ? passBaggages.hold.units : 0;
                vm.extraHold = (passBaggages.extraHold ? passBaggages.extraHold : hold);
                vm.totalHold = (passBaggages.totalHold ? passBaggages.totalHold : hold);
                vm.hold = passBaggages.hold ? passBaggages.hold.units : 0;
            }

            if (vm.model?.finalPrices?.tax) {
                vm.taxNumber = vm.model.finalPrices.tax;
            } else {
                vm.taxNumber = angular.isDefined(vm.model?.tax) ? vm.model.tax : '';
            }
        }

        function cleanTax(val) {
            if (val && val.length > 0) {
                result = val.replace('€', '').replace(/\s/g, '');
                return result;
            }
            return result;
        }
    }
})();
