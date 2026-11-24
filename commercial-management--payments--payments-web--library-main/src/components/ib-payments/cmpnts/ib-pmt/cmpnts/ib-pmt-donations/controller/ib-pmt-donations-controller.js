(function () {
    'use strict';
    angular
        .module('ib-pmt-donation-module')
        .controller('IbPmtDonationController', IbPmtDonationController);
    IbPmtDonationController.$inject = ['$scope', 'PmtUtilsService', 'localStorageService', 'DatalayerEcommerceUtilsService'];
    function IbPmtDonationController ($scope, PmtUtilsService, localStorageService, DatalayerEcommerceUtilsService) {
        const vm = this;
        vm.checkDonation = checkDonation;
        vm.updateFormCheck = updateFormCheck;
        vm.viewItemListAdded = false;

        vm.$onInit = function () {
            $scope.$on('syncDonationSelection', updateModel);
            updateModel();
        };

        vm.$onChanges = function (changes) {
            if (changes.donationInfo) {
                updateModel();
            }
        };

        function checkDonation (option, donationInfo, newsletter, donationOptionIndex, isSelectItem) {
            if(!isSelectItem) { vm.doDonation = !vm.doDonation; }
            donationInfo = PmtUtilsService.disabledOptionDonation(donationInfo);
            vm.donationOptionIndex = donationOptionIndex;
            option.selected = true;
            updateFormCheck(donationOptionIndex);
            if(vm.doDonation && !vm.viewItemListAdded) {
                DatalayerEcommerceUtilsService.setDonationsViewItemList(donationInfo);
                vm.viewItemListAdded = true;
            } else if(vm.doDonation && vm.viewItemListAdded && isSelectItem) {
                DatalayerEcommerceUtilsService.setDonationsSelectItem(donationInfo, option);
            }
            $scope.$emit('checkDonation', vm.doDonation, option, donationInfo, newsletter, vm.donation && vm.donation.form ? vm.donation.form : null);
        }

        function updateFormCheck (donationOptionIndex) {
            vm.donation = localStorageService.get('donation') ? localStorageService.get('donation') : {};
            vm.donation.form = vm.donation.form || {};
            vm.donation.form.acceptDonation = vm.acceptDonation;
            vm.donation.form.acceptDonationData = vm.acceptDonationData;
            vm.donation.form.option = vm.donation.form.option ? vm.donation.form.option : [];
            if (vm.donation.form.option.length > 0) {
                for (let i = 0; i < vm.donation.form.option.length; i++) {
                    vm.donation.form.option[i] = i === donationOptionIndex;
                }
            } else if (vm.donationInfo?.options?.length) {
                vm.donation.form.option = vm.donationInfo.options.map((_, index) => index === donationOptionIndex);
            }

            localStorageService.set('donation', vm.donation);
        }

        function syncDonationFormSelection () {
            if (!vm.donationInfo?.options?.length) {
                return;
            }

            let selectedIndex = 0;
            const storedAmount = vm.donation.option?.option;

            if (storedAmount != null) {
                const matchingIndex = vm.donationInfo.options.findIndex(
                    (donationOption) => donationOption.option === storedAmount
                );
                if (matchingIndex >= 0) {
                    selectedIndex = matchingIndex;
                }
            } else if (vm.donation.form?.option?.length) {
                const storedIndex = vm.donation.form.option.findIndex((isSelected) => isSelected);
                if (storedIndex >= 0) {
                    selectedIndex = storedIndex;
                }
            }

            vm.donationOptionIndex = selectedIndex;
            vm.donation.form.option = vm.donationInfo.options.map((_, index) => index === selectedIndex);
            vm.donationInfo.options.forEach((donationOption, index) => {
                donationOption.selected = index === selectedIndex;
            });
        }

        function updateModel () {
            vm.donation = localStorageService.get('donation') ? localStorageService.get('donation') : {};
            vm.doDonation = Boolean(vm.donation.option);
            vm.acceptDonation = vm.donation.form ? vm.donation.form.acceptDonation : null;
            vm.acceptDonationData = vm.donation.form ? vm.donation.form.acceptDonationData : null;
            vm.donation.form = vm.donation.form ? vm.donation.form : {};

            if (vm.donation.option) {
                syncDonationFormSelection();
                localStorageService.set('donation', vm.donation);
                return;
            }

            if (!vm.donation.form.option && vm.donationInfo?.options?.length) {
                vm.donation.form.option = vm.donationInfo.options.map((_, index) => index === 0);
            }
        }
    }
})();
