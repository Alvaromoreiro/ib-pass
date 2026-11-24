(function () {
    'use strict';

    angular
        .module('ib-pmt-generic-credit-card-fields-module')
        .controller('IbPmtGenericCreditCardFieldsController', IbPmtGenericCreditCardFieldsController);

    IbPmtGenericCreditCardFieldsController.$inject = ['$scope', 'localStorageService', 'PmtUtilsService', 'PmtConstants', '$window', 'NewMainHeaderFacade', 'PmtModalService', '$route', 'CommonsUserUtilsService'];
    function IbPmtGenericCreditCardFieldsController($scope, localStorageService, PmtUtilsService, PmtConstants, $window, NewMainHeaderFacade, PmtModalService, $route, CommonsUserUtilsService) {
        var vm = this;
        var cardPattern, namePattern = PmtConstants.PATTERNS.NAME_SURNAME_PATTERN;

        vm.changeIssuerCountry = changeIssuerCountry;
        vm.typeCreditCardSelected = typeCreditCardSelected;
        vm.checkCardNumber = checkCardNumber;
        vm.checkNameOrSurname = checkNameOrSurname;
        vm.detectStateByZipCode = detectStateByZipCode;
        vm.fillZipCodeByState = fillZipCodeByState;
        vm.IBDCExist = IBDCExist;
        vm.$onInit = activate;
		vm.editionMode = true;

        $scope.$on('iberiaPayError', iberiaPayError);
        $scope.$on('iberiaPayCreditCardError', iberiaPayCreditCardError);
        $scope.$on('iberiaPayCVVError', iberiaPayCVVError);
        $scope.$on('dateSelected', dateChanged);

        function activate() {
            vm.showQuotasCombo = false;
            vm.isSoftUser = CommonsUserUtilsService.isSoftUser();
            if (vm.issuerCountry && vm.issuerCountry.code === 'ES') {
                vm.zipCodeValidators = {
                    maxLength: PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.MAX_LENGTH,
                    minLength: PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.MIN_LENGTH,
                    cleaner: PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.CLEANER,
                    pattern: PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.PATTERN,
                }
            } else {
                vm.zipCodeValidators = {
                    maxLength: PmtConstants.PATTERNS.MAX_LENGTH_ZIP_CODE,
                    minLength: PmtConstants.PATTERNS.MIN_LENGTH_ZIP_CODE,
                    cleaner: PmtConstants.PATTERNS.DOCS_CLEANER,
                    pattern: PmtConstants.PATTERNS.DOCS_PATTERN,
                }
            }
            vm.nameValidators = {
                maxLength: PmtConstants.PATTERNS.MAX_LENGTH_NAME,
                minLength: PmtConstants.PATTERNS.MIN_LENGTH_NAME,
                cleaner: PmtConstants.PATTERNS.NAME_SURNAME_CLEANER,
                pattern: PmtConstants.PATTERNS.NAME_SURNAME_PATTERN,
            }
        }

        function IBDCExist() {
            return $window.IBDC ? true : false;
        }

        function checkCardNumber() {
            var check = !cardPattern || cardPattern.test(vm.selectedData.cardNumber ? vm.selectedData.cardNumber.replace(/\s+/g, '') : '');
            if (vm.containerForm.credit_card_num) {
                vm.containerForm.credit_card_num.$setValidity('cardInvalid', check);
            }
        };

        function checkNameOrSurname(value) {
            var check, nameOrSurname, contactData;
            if (value === 'name') {
                nameOrSurname = vm.contactData.ownerName;
                contactData = vm.containerForm.name;
            } else if (value === 'surnames') {
                nameOrSurname = vm.contactData.surnames;
                contactData = vm.containerForm.surnames;
            }
            check = namePattern.test(nameOrSurname ? nameOrSurname.replace(/[\`\´]/g, '\'') : '');
            if (contactData) {
                contactData.$setValidity(value === 'name' ? 'nameInvalid' : 'surnameInvalid', check);
            }
        }

        /**
         * Check number depending of type of card and emits event and clean data input of older card
         * @param {Obj} selectedCard Selected card in combo
         * @param {BOOL} checkNumber If need check number of card
        */
        function typeCreditCardSelected(selectCard, checkNumber) {
            var selectedCard = selectCard.selectedData.selectedCard;
            cleanDataOfCard(selectCard.selectedData.selectedCard);
            checkPattern(selectedCard, checkNumber, false);
            NewMainHeaderFacade.updateBasketOthers('CARD', selectCard.selectedData.selectedCard);
            $scope.$broadcast('unCheckQuotas');
            $scope.$emit('changeSelectedCreditCard', selectCard.selectedData.selectedCard);
        }


        /**
         * Check if country selected is same of selected card and if is diferent call to service for
         * load states
         */

        function creditCardChanged() {
            var countryCard = vm.selectedData.selectedLoggedCard.profileAddressInfo.country;
            var country = vm.selectedData.issuerCountry;
            vm.selectedData.selectedLoggedCard.newCvv = null;
            if (countryCard && countryCard.code !== country.code) {
                $scope.$emit('changeIssuerCountryLogged', countryCard);
            }
            if (!countryCard) {
                vm.statesList = [];
                vm.selectedData.selectedLoggedCard.profileAddressInfo.state = null;
            }
        }

        /**
         * Clean data of card if is diferent of selected
         * @param {Object} card Card selected by user
         */
        function cleanDataOfCard(card) {
            var olderCard = localStorageService.get('typeCardSelected') || null;
            if (olderCard && card.cardTypeId !== olderCard.cardTypeId) {
                vm.selectedData.cardNumber = null;
                vm.selectedData.newCvv = null;
                vm.selectedData.month = null;
                vm.selectedData.year = null;
            }
            localStorageService.set('typeCardSelected', card);
        }

        function changeIssuerCountry(issuerCountry) {
            $scope.$emit('changeIssuerCountryEvent', issuerCountry, vm.selectedData.selectedCard, vm.creditCardFormModel);
        };

        /**
         *
         * @param {Object} selectedCard Card selectef of user
         * @param {BOOL} checkNumber Indicates if is necessary update de pattern of card
         * @param {BOOL} logged State of user in flow
         */
        function checkPattern(selectedCard, checkNumber, logged) {
            if (selectedCard && selectedCard.cardTypeId !== 'newCard') {
                cardPattern = new RegExp(selectedCard.pattern);
                $scope.$emit('creditCardChanged', selectedCard, vm.creditCardFormModel);
                vm.creditCardFormModel.newCvv = null;
                if (logged) {
                    creditCardChanged();
                }
                if (checkNumber) {
                    checkCardNumber();
                }
            }
        }

        /**
         * Detect state of a country given a zip code and initializes the combo
         * @param {number} zipCode Zip code filled by user
             */
        function detectStateByZipCode(zipCode) {
            var detectStateByZipCodeInfo, validate = false;
            if (vm.issuerCountry.code === 'ES' && !isNaN(zipCode)) {
                detectStateByZipCodeInfo = PmtUtilsService.detectStateByZipCode(zipCode, vm.statesList)
                vm.selectedData.state = detectStateByZipCodeInfo.state;
                validate = (detectStateByZipCodeInfo.checker && (zipCode.length === PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.LENGTH));
                vm.containerForm.zip_code.$setValidity('zipCodeInvalid', validate);
            }
        }

        /**
         * Fill first number(s) of zipCode with slected state
         * @param {Obj} state State selected by user
             */
        function fillZipCodeByState(state) {
            var fillZipCodeByStateInfo, validate = false;
            if (vm.issuerCountry.code === 'ES') {
                fillZipCodeByStateInfo = PmtUtilsService.fillZipCodeByState(state, vm.selectedData.zipCode);
                if (fillZipCodeByStateInfo.changeZipCode || fillZipCodeByStateInfo.newZipCode) {
                    vm.selectedData.zipCode = fillZipCodeByStateInfo.newZipCode;
                }
                validate = (fillZipCodeByStateInfo.checker && (fillZipCodeByStateInfo.newZipCode.length === PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.LENGTH));
                vm.containerForm.zip_code.$setValidity('zipCodeInvalid', validate ? true : false);
            }
        };

        /**
         * Assigned error message to field CVV or CREDITCARD_NUMBER according to error code when user click in button pay.
         * If error code is 12 , the error is in field CVV.
         * If error code is 13 , the error is in field CVV and CREDIT CARD NUMBER.
         * If error code is diferent to 12 or 13 , the error is in field CREDIT CARD NUMBER.
         * @param {Event} iberiaPayError Event to launch function , if iFrame IberiaPay detected any error in the fields CVV or
         * CREDITCARD_NUMBER emit event with error code.
         * @param {Number} errorCode number that do reference to error emit by iFrame IberiaPay.
         * @function IBDC.addError(creditCard,Cvv) is a function that avoid add "number-error" or "cvv-error" in IFRAMES IberiaPay
         * @function IBDC.removeError(creditCard,Cvv) is a function that avoid remove "number-error" or "cvv-error" in IFRAMES IberiaPay
         */
        function iberiaPayError(event, errorCode) {
            var modalInfo = {
                'title': 'MODAL_ERROR_TITLE',
                'subtitle': 'ERROR_PAYMENT_MODAL_SUBTITLE',
                'message': 'IBERIA_PAY_SERVICE_ERROR_UNEXPECTED',
                'showbuttons': {
                    'accept': {
                        'status': true,
                        'text': 'IBERIA_PAY_SERVICE_ERROR_UNEXPECTED_ACCEPT',
                        'accessibleText': 'IBERIA_PAY_SERVICE_ERROR_UNEXPECTED_ACCEPT'
                    }
                }
            }
            vm.errorCardNumberIbPay = 0;
            if (errorCode >= 400) {
                PmtModalService.showGenericError(modalInfo, true, PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(function () {
                    PmtModalService.closeAllCurrentModals();
                    $route.reload();
                }, function () {
                    PmtModalService.closeAllCurrentModals();
                    $route.reload();
                });
            } else if (errorCode === 12) {
                vm.errorCvvIbPay = errorCode;
            } else if (errorCode === 13) {
                vm.errorCardNumberIbPay = errorCode;
                vm.errorCvvIbPay = errorCode;
                IBDC.addError(true, true);
            } else if (errorCode === 0) {
                vm.containerForm.fieldCCIbPayInvalid = false;
                vm.containerForm.fieldCVVIbPayInvalid = false;
                IBDC.removeError(true, false);
            } else {
                vm.errorCardNumberIbPay = errorCode;
                vm.containerForm.fieldCCIbPayInvalid = true;
                vm.containerForm.fieldCVVIbPayInvalid = true;
                IBDC.addError(true, false);
            }

        };

        /**
         * Show message error if the credit card selected in combo not  correspond  with credit card number insert in IFRAME.
         * @param {Event} iberiaPayCreditCardError Event to launch the function and show message error
         * @param {Boolean} isError Parameter that indicate if exist error
         * @function IBDC.addError(creditCard,Cvv) is a function that avoid add "number-error" or "cvv-error" in IFRAMES IberiaPay
         * @function IBDC.removeError(creditCard,Cvv) is a function that avoid remove "number-error" or "cvv-error" in IFRAMES IberiaPay
         */
        function iberiaPayCreditCardError(event, isError) {
            if (isError) {
                vm.errorCardNumberIbPay = 99;
                vm.containerForm.fieldCCIbPayInvalid = true;
                IBDC.addError(true, false);
            } else {
                vm.errorCardNumberIbPay = 0;
                vm.containerForm.fieldCCIbPayInvalid = false;
                vm.containerForm.fieldCVVIbPayInvalid = false;
                IBDC.removeError(true, false);
            };
        };

        /**
         * Show Message error if the CVV field IberiaPay is not valid.
         * @param {Event} iberiaPayCVVError Event to launch the function and show message error in field CVV of iberiaPay
         * @param {Boolean} isErrorCvv Parameter that indicate if exist error.
         * IBDC.removeError(creditCard,CVV) is a function that avoid remove "number-error" or "cvv-error" in IFRAMES IberiaPay
         *  */
        function iberiaPayCVVError(event, isErrorCvv) {
            if (isErrorCvv) {
                vm.errorCvvIbPay = 88;
                vm.containerForm.fieldCVVIbPayInvalid = true;
                if (!vm.containerForm.$submitted) IBDC.removeError(false, true);
            } else {
                vm.errorCvvIbPay = 0;
                vm.containerForm.fieldCVVIbPayInvalid = false;
                IBDC.removeError(false, true);
            }
        };
        function dateChanged(event, newDate) {
            $scope.$broadcast('unCheckQuotas');
        }

    }
})();
