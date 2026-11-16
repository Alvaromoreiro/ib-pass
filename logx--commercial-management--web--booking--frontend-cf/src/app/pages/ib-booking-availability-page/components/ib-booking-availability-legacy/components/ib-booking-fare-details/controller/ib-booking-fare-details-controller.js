import {FareIconMapConstants} from '../../../../../../../core/constants/ib-booking-fare-icons-map';
(function () {

    angular
        .module('ib-booking-fare-details-module')
        .controller('BookingFareDetailsController', BookingFareDetailsController);
    BookingFareDetailsController.$inject = ['$scope', '$rootScope', '$timeout', 'CommonsSessionStorageService', '$filter','BookingAppConstants','NewMainHeaderFacade', '$element'];
    function BookingFareDetailsController ($scope, $rootScope, $timeout, CommonsSessionStorageService, $filter, BookingAppConstants,NewMainHeaderFacade, $element) {

        const vm = this;
        const translation = CommonsSessionStorageService.get('confirmationDigitalInfo').Language;
        vm.isFareSelected = isFareSelected;
        vm.openModalConditions = openModalConditions;
        vm.resizeFareDetailsBox = resizeFareDetailsBox;
        vm.getFareIcon = getFareIcon;
        vm.removeAccents = removeAccents;
        vm.getMarketOBPoints = CommonsSessionStorageService.get('getMarketOBPoints') || null;
        vm.oBDiscountType = CommonsSessionStorageService.get('oBDiscountType');
        vm.oBUserLogged = CommonsSessionStorageService.get('userLogged') === 'ONB';
        vm.singularTranslationCondition = false;
        vm.pluralTranslationCondition = false;
        vm.isEuro = true;

        vm.isLogged = $rootScope.isLogged;

        vm.$onInit = activate;

        function activate () {
            getRemainingSeatsTranslations();
            getRemainingSeatsTranslationsPlural();
            vm.isEuro = 'EUR' in vm.currencies;
        }

        function removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").toLowerCase();
        }

        function getRemainingSeatsTranslations () {
            const validLanguages = [
                BookingAppConstants.dateLanguages.DE,
                BookingAppConstants.dateLanguages.EN,
                BookingAppConstants.dateLanguages.PT,
                BookingAppConstants.dateLanguages.NL,
                BookingAppConstants.dateLanguages.FR
            ];
            if (validLanguages.includes(translation)) {
                vm.singularTranslationCondition = true;
            }
        }

        function getRemainingSeatsTranslationsPlural () {
            if (translation === BookingAppConstants.dateLanguages.EN) {
                vm.pluralTranslationCondition = true;
            }
        }

        function isFareSelected () {
            if ($rootScope.ancOffers) {
                NewMainHeaderFacade.updateBasketFlexibilization('');
                CommonsSessionStorageService.remove('selectedFlex');
                $scope.$emit('selectedFareFamilyAncOffers', vm.fareInfo);
                $rootScope.$broadcast('emptyFlex');
                angular.element('.ib-radio-boxed--simple input').trigger('click');
                $rootScope.$broadcast('calculateFlexPrices');
            }
            if (vm.redemption) {
                $scope.$emit('selectedRedemptionFareFamily', vm.fareInfo, vm.selectedSliceIndex, angular.isDefined(vm.selectedSegmentIndex) ? vm.selectedSegmentIndex : 0);
            } else {
                $scope.$emit('selectedFareFamily', vm.fareInfo, vm.selectedSliceIndex);
                ($element[0]).dispatchEvent(new CustomEvent('selectedFareFamily',
                    {
                        bubbles: true,
                        composed: true,
                        detail: {
                            fareInfo: vm.fareInfo,
                            selectedSliceIndex: vm.selectedSliceIndex
                        }
                    }));
            }
            $timeout(() => {
                $scope.$emit('selectedFareFamilyFlexibility');
            });

        }

        function openModalConditions (event) {
            event.preventDefault();
            $scope.$emit('openFareModal', vm.fareInfo);
            ($element[0]).dispatchEvent(new CustomEvent('openFareModal',
                {
                    bubbles: true,
                    composed: true,
                    detail: {
                        fareInfo: vm.fareInfo
                }
            }));
        }

        function resizeFareDetailsBox (element) {
            $timeout(() => {
                angular.element(element).removeAttr('style');
            }, 300);
        }

        /**
         * Return class of fare
         * @param {String} type Type of fare
         * @return Class of fare for show icon in view
         */
        function getFareIcon (type) {
            return FareIconMapConstants[type] || '';
        }
    }
})();
