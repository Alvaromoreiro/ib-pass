import { DccService } from "../../../../ib-pmt-dcc/ib-pmt-dcc.service";

(function () {
    'use strict';

    angular
        .module('ib-pmt-credit-card-tab-module')
        .controller('IbPmtCreditCardTabController', IbPmtCreditCardTabController);

    IbPmtCreditCardTabController.$inject = ['$scope', 'localStorageService', '$window', 'NewMainHeaderFacade', 'DccService'];
    function IbPmtCreditCardTabController ($scope, localStorageService, $window, NewMainHeaderFacade, DccService) {
        const vm = this;
        let cardPattern;

        vm.creditCardSelectedLogged = creditCardSelectedLogged;
        vm.checkCardNumber = checkCardNumber;
        vm.changeIssuerCountry = changeIssuerCountry;
        vm.IBDCExist = IBDCExist;
        vm.selectNewCard = selectNewCard;
        vm.selectLoggedListCard = selectLoggedListCard;
        vm.initRadioButton = initRadioButton;
        vm.selectedSavedOrNewCard = true;
        vm.editionMode = true;

        $scope.$on('iberiaPayError', iberiaPayError);
        function initRadioButton () {
            if (vm.containerForm && vm.containerForm.SavedCreditCard) {
                vm.containerForm.SavedCreditCard.$setValidity('isSelectedAnyCard', false);
            }
            return true;
        }

        function IBDCExist () {
            return !!$window.IBDC;
        }

        function checkCardNumber () {
            const check = !cardPattern || cardPattern.test(vm.paymentInfo.cardNumber ? vm.paymentInfo.cardNumber.replace(/\s+/g, '') : '');
            vm.containerForm.credit_card_num.$setValidity('cardInvalid', check);
        }

        /**
         * Check if country selected is same of selected card and if is diferent call to service for
         * load states
         * @param {object} selectedCard
         */

        function creditCardChanged (selectedCard) {
            const countryCard = vm.selectedLoggedCard.profileAddressInfo.country;
            if (countryCard && countryCard.code !== vm.issuerCountry.code) {
                changeIssuerCountry(countryCard, selectedCard, vm.creditCardFormModel);
            } else {
                $scope.$emit('changeUserSelectedCreditCard', selectedCard);
            }
        }


        /**
         *  Check number depending of type of card and emits event
         * @param {Object} selectCard Object with information of card
         * @param {BOOL} checkNumber If need check number of card
         * @param {BOOL} logged Value is user is logged
         */

        function creditCardSelectedLogged (customerCard, checkNumber) {
            const selectedLoggedCard = localStorageService.get('selectedLoggedCard') || null, donation = localStorageService.get('donation');
            vm.errorCvvIbPay = 0;
            if (customerCard.cardTypeId !== 'newCard') {
                localStorageService.set('selectedLoggedCard', angular.copy(customerCard));
            } else if (selectedLoggedCard) {
                localStorageService.remove('selectedLoggedCard');
            }
            vm.containerForm.SavedCreditCard.$setValidity('isSelectedAnyCard', true);
            NewMainHeaderFacade.updateBasketOthers('CARD');
            NewMainHeaderFacade.updateBasketOthers('DONATION');
            if (donation) {
                NewMainHeaderFacade.updateBasketOthers('DONATION', {
                    code: 'donation',
                    description: donation.donationInfo.partner,
                    total: donation.option.option,
                    totalFormatted: donation.option.formatedPrice
                });
            }
            checkPattern(customerCard, checkNumber, true);
            $scope.$broadcast('unCheckQuotas');
        }


        /**
         *
         * @param {Object} selectedCard Card selectef of user
         * @param {BOOL} checkNumber Indicates if is necessary update de pattern of card
         * @param {BOOL} logged State of user in flow
         */
        function checkPattern (selectedCard, checkNumber, logged) {
            if (selectedCard && selectedCard.cardTypeId !== 'newCard') {
                if (selectedCard && selectedCard.pattern) {
                    cardPattern = new RegExp(selectedCard.pattern);
                }
                if (logged) {
                    $scope.$emit('changeUserSelectedCreditCard', selectedCard);
                }
                vm.creditCardFormModel.newCvv = null;
                if (checkNumber) {
                    checkCardNumber();
                }
            } else {
                $scope.$emit('changeUserSelectedCreditCard', selectedCard);
            }
        }

        function changeIssuerCountry (issuerCountry, selectedCard, creditCardFormModel) {
            $scope.$emit('changeIssuerCountryEvent', issuerCountry, selectedCard, creditCardFormModel);
        }

        function selectNewCard () {
            vm.selectedLoggedCard = vm.customerCreditCards[vm.creditCardFormModel.type][vm.customerCreditCards[vm.creditCardFormModel.type].length - 1];
            creditCardSelectedLogged(vm.customerCreditCards[vm.creditCardFormModel.type][vm.customerCreditCards[vm.creditCardFormModel.type].length - 1], false);
        }
        function selectLoggedListCard () {
            delete vm.selectedLoggedCard;
            vm.containerForm.SavedCreditCard.$setValidity('isSelectedAnyCard', false);
            DccService.setDccData();
        }
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
        function iberiaPayError (event, errorCode) {
            vm.errorCardNumberIbPay = 0;
            if (errorCode === 12) {
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

        }
    }
})();
