(function () {
    'use strict';

    angular
        .module('ib-pmt-required-fields-module')
        .controller('IbPmtRequiredFieldsController', IbPmtRequiredFieldsController);

    IbPmtRequiredFieldsController.$inject = ['$rootScope', '$scope', 'PmtUtilsService', 'localStorageService', 'PmtConstants', 'PmtModalService', '$window', '$filter', '$sce'];
    function IbPmtRequiredFieldsController ($rootScope, $scope, PmtUtilsService, localStorageService, PmtConstants, PmtModalService, $window, $filter, $sce) {
        const vm = this;
        let cardChangedEvent;

        vm.binCountries = ['BR', 'MX', 'CO'];
        vm.detectStateByZipCode = detectStateByZipCode;
        vm.fillZipCodeByState = fillZipCodeByState;
        vm.fillQuotas = fillQuotas;
        vm.showInfoQuota = showInfoQuota;
        vm.showModalInfoQuota = showModalInfoQuota;
        vm.callInfoQuotaForDeferedMonth = callInfoQuotaForDeferedMonth;
        vm.showModalQuotaLink = showModalQuotaLink;
        vm.checkBin = checkBin;
        vm.checkMinPrice = checkMinPrice;
        vm.checkShowQuotasCombo = checkShowQuotasCombo;
        vm.selectedCard = undefined;
        vm.disabledQuotasRun = false;

        $scope.$on('cardChanged', showQuotasAvailability);
        $scope.$on('disabledQutasOption', (...arg) => {
            const [_, status] = arg;
            disableQuotas(...arg);
            vm.disabledQuotasRun = status;
        });
        $scope.$on('unCheckQuotas', unCheckQuotas);
        $scope.$on('selectDefaultDeferedMonth', selectDefaultDeferedMonth);
        activate();
        vm.checkShowQuotasCombo();

        function activate () {
            if (vm.disabledQuotasRun) {
                return;
            }
            vm.flowApp = localStorageService.get('flowApp');
            vm.disableDefered = true;
            vm.issueCountry = localStorageService.get('pmtModelInfo').issueCountry;
            if (localStorageService.get('infoRequiredFieldsPayments')) {
                vm.requiredFields = localStorageService.get('infoRequiredFieldsPayments');
            }
        }

        function checkShowQuotasCombo () {
            if (vm.disabledQuotasRun) {
                return;
            }
            if (($rootScope.appMarket === 'BR' || $rootScope.appMarket === 'AR')
                && ((localStorageService.get('selectedAviosDisccount') || localStorageService.get('appliedDisscounts')) || vm.flowApp === PmtConstants.APP_TYPES.CHECKIN)) {
                vm.showQuotasCombo = false;
            } else {
                vm.showQuotasCombo = vm.checkBin() && vm.checkMinPrice();
            }
        }

        /**
         * Detect state of a country given a zip code and initializes the combo
         * @param {number} zipCode Zip code filled by user
             */
        function detectStateByZipCode (zipCode) {
            let detectStateByZipCodeInfo;
            if (vm.paymentInfo.issuerCountry.code === 'ES') {
                detectStateByZipCodeInfo = PmtUtilsService.detectStateByZipCode(zipCode, vm.statesList);
                vm.paymentInfo.state = detectStateByZipCodeInfo.state;
                vm.containerForm.zip_code.$setValidity('zipCodeInvalid', detectStateByZipCodeInfo.checker);
            }
        }

        /**
         * Fill first number(s) of zipCode with slected state
         * @param {Obj} state State selected by user
        */
        function fillZipCodeByState (state) {
            let fillZipCodeByStateInfo;
            if (vm.paymentInfo.issuerCountry.code === 'ES') {
                fillZipCodeByStateInfo = PmtUtilsService.fillZipCodeByState(state, vm.paymentInfo.zipCode);
                if (fillZipCodeByStateInfo.changeZipCode) {
                    vm.paymentInfo.zipCode = fillZipCodeByStateInfo.newZipCode;
                }
                vm.containerForm.zip_code.$setValidity('zipCodeInvalid', fillZipCodeByStateInfo.checker);
            }
        }

        /**
         * Fill quotas to pay only with 1 quota
         * @param {Obj} issueBankId Issue Bank Id selected by the user
        */
        function fillQuotas (issueBankId) {
            vm.showQuotasCombo = !issueBankId !== '0';
            localStorageService.set('infoRequiredFieldsPayments', vm.requiredFields);
        }
        /**
         * shows the option of installments or bank :
         * If the quotas are not available with the selected credit card, assign the value 1.
         * If the bank option is not available with the selected credit card, it eliminates the bank value
         * @param {*} event
         * @param {*} selectedCard Object with all credit card information
         */
        function showQuotasAvailability (event, selectedCard) {
            vm.selectedCard = selectedCard;
            if (vm.requiredFields.QUOTA) {
                if (vm.showQuotasCombo && vm.requiredFields.QUOTA.requiredConditions.cardTypeIds) {
                    vm.showQuotasCombo = vm.requiredFields.QUOTA.requiredConditions.cardTypeIds.indexOf(selectedCard.cardTypeId) !== -1;
                }
                if (vm.requiredFields.QUOTA.value && !vm.showQuotasCombo) {
                    vm.requiredFields.QUOTA.value = '1';
                }
            }
            if (vm.requiredFields.ISSUE_BANK) {
                if (vm.showQuotasCombo && vm.requiredFields.ISSUE_BANK.requiredCardTypeIds) {
                    vm.showQuotasCombo = vm.requiredFields.ISSUE_BANK.requiredCardTypeIds.indexOf(selectedCard.cardTypeId) !== -1;
                    if ((vm.requiredFields.ISSUE_BANK.issueBankId && !vm.showQuotasCombo) || (vm.requiredFields.ISSUE_BANK.issueBankId && vm.requiredFields.ISSUE_BANK.issueBankId.id === '0' && vm.showQuotasCombo)) {
                        delete vm.requiredFields.ISSUE_BANK.issueBankId;
                    }
                }
            }
            vm.checkShowQuotasCombo();
        }
        /**
         * send event to paymentcontroller to get all information about quota selected,
         * only if showButtonQuotas is available
         * @param {String} quotaSelected value quota selected
        */
        function showInfoQuota (quotaSelected) {
            if (vm.requiredFields.QUOTA.showButtonQuotas && !vm.requiredFields.QUOTA.showInstallmentsDetailIberiaPay) {
                $scope.$emit('getSummaryInfoQuota', quotaSelected);
            } else if (vm.requiredFields.QUOTA.showInstallmentsDetailIberiaPay) {
                $scope.$emit('getIberiaPayQuotaInfo', quotaSelected);
            }
        }
        function callInfoQuotaForDeferedMonth (deferedMonthSelected) {
            $scope.$emit('getSummaryInfoQuotaDeferedMonth', deferedMonthSelected, vm.requiredFields.QUOTA.value);
        }
        /**
         * Send event to paymentController and show modal with summary info selected quota
         */
        function showModalInfoQuota () {
            $scope.$emit('openModalInfoQuota');
        }

        /**
         * disabled or enabled quotas when user selected voucher or cash and avios in BR market.
         * @param {Event} selectedDiscount
         * @param {Boolean}status define if a disscount is selected. If status = true --> showQuotasCombo = false.
         */
        function disableQuotas (event, status) {
            vm.showQuotasCombo = !status;
        }
        /**
         * Open modal to show info for quota
         */
        function showModalQuotaLink () {
            const model = {
                    subtitle: vm.requiredFields.QUOTA.quotaExtraInfo && vm.requiredFields.QUOTA.quotaExtraInfo.modals && vm.requiredFields.QUOTA.quotaExtraInfo.modals[0] && vm.requiredFields.QUOTA.quotaExtraInfo.modals[0].title ? $sce.trustAsHtml(vm.requiredFields.QUOTA.quotaExtraInfo.modals[0].title) : '',
                    extraInfo: vm.requiredFields.QUOTA.quotaExtraInfo && vm.requiredFields.QUOTA.quotaExtraInfo.modals && vm.requiredFields.QUOTA.quotaExtraInfo.modals[0] && vm.requiredFields.QUOTA.quotaExtraInfo.modals[0].elements && vm.requiredFields.QUOTA.quotaExtraInfo.modals[0].elements[0] && vm.requiredFields.QUOTA.quotaExtraInfo.modals[0].elements[0].description ? $sce.trustAsHtml(vm.requiredFields.QUOTA.quotaExtraInfo.modals[0].elements[0].description): '',
                    idModal: '',
                    title: 'quota'
                }, link = $filter('LinksFilter')('QUOTAS');
            if (model.extraInfo !== '') {
                PmtModalService.showGenericModal(false, 'ib-modal-extra-info.html', model).result.then(angular.noop, angular.noop);
            } else {
                $window.open(link, '_blank');
            }

        }

        function unCheckQuotas (event) {
            const issueCountry = localStorageService.get('binCardCountry');
            vm.checkSelectQuotas = false;
            if (vm.requiredFields.QUOTA) {
                delete vm.requiredFields.QUOTA.value;
                delete vm.requiredFields.QUOTA.graceMonthOptions;
            }
            if (vm.summaryInfoQuota) {
                delete vm.summaryInfoQuota;
            }
            vm.checkShowQuotasCombo();
        }

        function checkBin () {
            const issueCountry = localStorageService.get('binCardCountry');
            vm.checkSelectQuotas = false;
            return vm.binCountries.includes($rootScope.appMarket) ? issueCountry === $rootScope.appMarket : true;
        }

        function checkMinPrice () {
            const paymentsInfo = localStorageService.get('paymentsInfo');
            return !($rootScope.appMarket === 'MX' && paymentsInfo?.price.totalPrice < 5000);
        }

        function selectDefaultDeferedMonth () {
            vm.requiredFields.QUOTA.graceMonthOptions.value = vm.requiredFields.QUOTA.graceMonthDefault;
            vm.disableDefered = !(vm.requiredFields.QUOTA.graceMonthOptions.items.length > 1);
            $scope.$emit('getSummaryInfoQuotaDeferedMonth', vm.requiredFields.QUOTA.graceMonthDefault, vm.requiredFields.QUOTA.value);
        }
    }
})();