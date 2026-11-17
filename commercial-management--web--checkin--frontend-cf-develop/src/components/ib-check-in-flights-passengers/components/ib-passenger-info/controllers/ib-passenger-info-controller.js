(function () {
    'use strict';

    angular
        .module('ib-passenger-info-module')
        .controller('PassengerInfoController', PassengerInfoController);

    PassengerInfoController.$inject = ['$scope', 'CommonsUserUtilsService', 'CheckinAppConstants', '$filter', 'IbUtilsService', 'CheckinFlowService'];
    function PassengerInfoController ($scope, CommonsUserUtilsService, CheckinAppConstants, $filter, IbUtilsService, CheckinFlowService) {
        const vm = this;
        vm.previousCompanySelection = null;
        vm.openGenericModal = openGenericModal;
        vm.checkSelectedPassengers = checkSelectedPassengers;
        vm.clearCodeNumber = clearCodeNumber;
        vm.removeOfus = removeOfus;
        vm.managePermanentLogin = managePermanentLogin;
        vm.isUncheckable = isUncheckable;
        vm.isNotUncheckable = isNotUncheckable;
        vm.inputBlurFF = inputBlurFF;
        vm.handleModalSBY = handleModalSBY;
        vm.checkErrorsInput = checkErrorsInput;
        vm.showInhibitBC = false;
        vm.permanentUser = false;
        vm.isFrequentFlyer = false;
        vm.errorDuplicateFF = false;
        vm.isChecked = false;
        vm.items = [];
        vm.boxInhibitBC = {
            status: false,
            code: '',
            icon: '',
            title: '',
            message: ''
        };
        vm.keyApisEsta = 'APIS_CONFIRMATION_ALERT_BODY_2DE2';
        vm.showAlertSBY = {
            status: false,
            openModal: false
        };

        vm.$onInit = activate;

        $scope.$on('checkItemsEvent', checkItems);

        ////////////////

        function activate () {
            setShowInhibitBC();
            managePermanentLogin();
            prefillFrequentFlyer();
            isChecked();
            checkItems();
            checkApisEsta();
            checkSBY();
        }

        function setShowInhibitBC () {
            const { UMNR_REASON, RESI_REASON, AVIH_REASON, PETC_REASON, COUR_REASON } = CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES;
            const excludeReasons = [UMNR_REASON, RESI_REASON, AVIH_REASON, PETC_REASON, COUR_REASON];

            const hasValidStatus = angular.isObject(vm.passengerInfo.inhibitBoardingCard) && vm.passengerInfo.inhibitBoardingCard.status;
            const hasExcludeReasons = vm.passengerInfo.inhibitBoardingCard.reason.some((reason) => excludeReasons.includes(reason));

            vm.showInhibitBC = hasValidStatus && !hasExcludeReasons;
        }

        /**
         * Emits event for update selected passenger
         * @param {Int} index Index of passenger selected
         */
        function checkSelectedPassengers (index) {
            $scope.$emit('checkSelectedPassengersEvent', index);
        }

        /**
         * Emits event for open modal window
         * @param {Object} info Information to show in modal
         */
        function openGenericModal (info) {
            $scope.$emit('openModalNotAvailablePassengerEvent', info);
        }

        /**
          * @function
          * @name clearCodeNumber
          * @desc Clean the previous company code number if a company is selected
        */
        function clearCodeNumber (ofusCase = false) {
            const frequentFlyerInfo = vm.passengerInfo.frequentFlyer.info;

            if (ofusCase) {
                vm.ofuscatedNumber = null;
                frequentFlyerInfo.number = null;
                return;
            }

            const currentCompanyCode = frequentFlyerInfo.iataCompanyCode;
            const isChangingToIberia =
                currentCompanyCode === 'IB' &&
                vm.previousCompanySelection !== 'IB';

            if (isChangingToIberia) {
                frequentFlyerInfo.number = '';
            }

            vm.previousCompanySelection = currentCompanyCode;
        }

        function removeOfus () {
            vm.ofuscatedNumber = null;
            clearCodeNumber(true);
        }

        function managePermanentLogin () {
            const strOfuscator = str => str.replace(new RegExp(`^(.{1})(.{${str.length - 3}})(.{2})`, 'g'), `$1${'*'.repeat(str.length - 3)}$3`);
            const hasNumber = num => num && num !== '';
            vm.permanentUser = CommonsUserUtilsService.isSoftUser();

            if (vm.permanentUser) {
                const number = vm.passengerInfo.frequentFlyer.info.number;
                vm.ofuscatedNumber = hasNumber(number) ? strOfuscator(number) : number;
            }
        }

        /**
         * Return true if the passenger has FF
         */
        function prefillFrequentFlyer (errorDuplicate = false) {
            vm.errorDuplicateFF = errorDuplicate;
            vm.isFrequentFlyer = !vm.errorDuplicateFF && (vm.passengerStatus?.frequentFlyer?.info?.number?.length || false);
            vm.isChecked = !vm.errorDuplicateFF && vm.isChecked;
        }

        /**
         * Return true if the passenger is checked (has boarding card)
         */
        function isChecked () {
            vm.isChecked = vm.passengerInfo?.pasStatus?.isChecked || false;
        }

        function isUncheckable () {
            return !vm.passengerInfo?.airCheck?.documentationRequired || (vm.passengerStatus.status === 'UNCHECKABLE' && vm.passengerStatus.inhibitBoardingCard === CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON);
        }

        function isNotUncheckable () {
            return vm.passengerInfo?.airCheck?.documentationRequired && vm.passengerStatus.status !== 'UNCHECKABLE' && vm.passengerStatus.inhibitBoardingCard === CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON;
        }

        function checkItems () {
            Object.values(CheckinAppConstants.ITEMS_TYPES).forEach((item, index) => {
                if(CheckinAppConstants.INHIBIT_ALERTS[item]) {
                    vm.items.push({
                        id: index,
                        status: vm.passengerInfo?.items?.includes(item),
                        code: item,
                        icon: CheckinAppConstants.INHIBIT_ALERTS[item].IBCOAC.ICON,
                        title: CheckinAppConstants.INHIBIT_ALERTS[item].IBCOAC.TITLE,
                        message: CheckinAppConstants.INHIBIT_ALERTS[item].IBCOAC.MESSAGE
                    });
                }

            });
            const itemInhibit = CheckinFlowService.showPriorityAlertInhibit(vm.items);
            if(itemInhibit) Object.assign(vm.boxInhibitBC, itemInhibit);
        }

        function inputBlurFF (e, passIndex = null, selectedCompanyIb = false) {
            const checkTargetData = e?.target?.id?.includes(passIndex) && e.target.value.length > 0;
            vm.cardFocused = false;

            if (selectedCompanyIb && checkTargetData) {
                const data = {
                    index: passIndex,
                    id: vm.passengerInfo.id ?? null,
                    idTag: e.target.id
                };
                $scope.$emit('inputBlurFFEvent', data);
            }
        }

        function checkApisEsta () {
            const tagsInfo = {
                link: {
                    tag: 'a',
                    href: '',
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--inline'
                }
            };
            tagsInfo.link.href = $filter('NewLinksFilter')('APIS_URL_TRAVEL_DOCUMENTATION', IbUtilsService.getAppLang());
            vm.keyApisEsta = $filter('literalFormatter')($filter('translate')(vm.keyApisEsta), tagsInfo);
            const bodyText = $filter('translate')('APIS_CONFIRMATION_ALERT_BODY_1DE2');
            CheckinFlowService.updateApiEsta({ text: `${bodyText}\n${vm.keyApisEsta}` });
        }

        /**
         * Handle click link alert SBY, open modal info SBY.
         * @param {*} $event
         */
        function handleModalSBY ($event) {
            $event.preventDefault();
            vm.showAlertSBY.openModal = true;
        }

        function checkSBY () {
            const hasInhibitBoardingCard = angular.isObject(vm.passengerInfo.inhibitBoardingCard) && vm.passengerInfo.inhibitBoardingCard.status;

            if (hasInhibitBoardingCard) return;

            const hasSbyStatus = angular.isObject(vm.passengerInfo.pasStatus) && vm.passengerInfo.pasStatus?.hasSBY;

            if (hasSbyStatus) {
                vm.showAlertSBY.status = true;
            }
        }

        function checkErrorsInput (index) {
            const form = vm.pasForm;
            const cardNumberField = form?.[`card_number_passenger_${index}`];

            if (!cardNumberField) {
                return false;
            }

            const isDuplicateCompanyAndNumber = cardNumberField.$error?.duplicateCompanyAndNumber === true;

            return isDuplicateCompanyAndNumber || (form.$submitted && cardNumberField.$invalid);
        }

    }

})();
