(function () {
    'use strict';

    angular
        .module('ib-MmB-voucher-refund-module')
        .controller('VoucherRefundController', VoucherRefundController);

    VoucherRefundController.$inject = ['MmBModalService', 'localStorageService', '$scope', '$filter', 'IbFlagsTransformer'];
    function VoucherRefundController(MmBModalService, localStorageService, $scope, $filter, IbFlagsTransformer) {
        var vm = this;
        vm.openFullScreenModal = openFullScreenModal;
        vm.getVoucherValidity = getVoucherValidity;
        vm.getFlightDateLimit = getFlightDateLimit;
        vm.$onInit = activate;

        function activate() {
            vm.phonesList = localStorageService.get('phonesList');
            vm.textRefundByVoucherNotAvailable = $filter('translate')('MMB_REFUNDS_VOUCHER_CASH_TEXT');
            vm.textRefundByVoucherNotAvailable = vm.textRefundByVoucherNotAvailable.replace(/\*/g, vm.phonesList.RESERVAS.prefix + ' ' + vm.phonesList.RESERVAS.telephone);
            vm.openVoucherRefundModal = localStorageService.get('openVoucherRefundModal');
            vm.voucherValidity = localStorageService.get('voucherList');

            if(vm.voucherValidity){
                vm.validityText = getVoucherValidity();
                vm.flightDateLimit = getFlightDateLimit();
                vm.validityAvailable = vm.voucherValidity && !(angular.isUndefined(vm.voucherValidity) || vm.voucherValidity.length < 1 || angular.isUndefined(vm.voucherValidity[0].validityDate));
                vm.flightDateAvailable = vm.voucherValidity && !(angular.isUndefined(vm.voucherValidity) || vm.voucherValidity.length < 1 || angular.isUndefined(vm.voucherValidity[0].flightDateLimit));
            }
            if (vm.phonesList && vm.phonesList.RESERVAS) {
                vm.phoneListOjbject = {
                    'phoneNumber': vm.phonesList.RESERVAS.telephone,
                    'phonePrefix': vm.phonesList.RESERVAS.prefix
                };
            }

            vm.dataModel = {
                'passengerSummaryModel': vm.summaryModel,
                'phoneList': vm.phoneListOjbject,
                'email': vm.contactData ? vm.contactData.lowerCaseEmail: '',
                'voucherPriceInfo': vm.voucherPriceInfo,
                'isDisruption': vm.isDisruption
            };
            let localBookingInfo = localStorageService.get('bookingInfo');
            vm.flags = IbFlagsTransformer.generateFlagsMenu(localBookingInfo);
            vm.internalFlags = getInternalFlags();
            // vm.flags = localStorageService.get('orderFlags');
            if (vm.openVoucherRefundModal) {
                openFullScreenModal();
            }
        }

        function getInternalFlags(){
            return {
                showVoucherRefundOnline: vm.flags.voucherRefund,
                showVoucherRefundCC: !vm.flags.voucherRefund,
                showDateLimit: vm.validityText && !vm.flags.refundVoucherSection80,
                showRefundInfo1: vm.flightDateAvailable && vm.flightDateLimit && !vm.flags.refundVoucherSection80,
                showRefundInfo2: (!vm.flightDateAvailable || !vm.flightDateLimit) && !vm.flags.refundVoucherSection80,
                showRefundInfo3: vm.flags.refundVoucherSection80,
            };
        }

        function openFullScreenModal() {
            localStorageService.set('voucherEmailNotificationFlow', true);
            localStorageService.set('cashEmailNotificationFlow', false);
            if (vm.isDisruption) {
                $scope.$emit('nextStep');
            } else {
                MmBModalService.showFullModal(false, 'ib-Mmb-voucher-refund-modal-view.html', vm.dataModel).result.then(angular.noop, angular.noop);
            }
        }

        function getVoucherValidity() {
            var validityDate, formattedValidityDate;
            if (vm.voucherValidity[0].validityDate) {
                validityDate = $filter('DateFormatFilter')(vm.voucherValidity[0].validityDate);
                formattedValidityDate = validityDate.formatedDate;
            }
            return formattedValidityDate;
        }
        function getFlightDateLimit() {
            var flightDateLimit, formattedFlightDateLimit;
            if (vm.voucherValidity[0].flightDateLimit) {
                flightDateLimit = $filter('DateFormatFilter')(vm.voucherValidity[0].flightDateLimit);
                formattedFlightDateLimit = flightDateLimit.formatedDate;
            }
            return formattedFlightDateLimit;
        }
    }
})();
