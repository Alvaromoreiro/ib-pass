import {FareIconMapConstants} from '../../../../../../../core/constants/ib-booking-fare-icons-map';
(function () {

    angular
        .module('ib-booking-fare-details-simple-module')
        .controller('BookingFareDetailsController', BookingFareDetailsController);
    BookingFareDetailsController.$inject = ['$scope', '$rootScope', '$timeout', 'CommonsSessionStorageService', '$filter','BookingAppConstants','BookingModalService', 'NewMainHeaderFacade', '$element'];
    function BookingFareDetailsController ($scope, $rootScope, $timeout, CommonsSessionStorageService, $filter, BookingAppConstants,BookingModalService, NewMainHeaderFacade, $element) {

        const vm = this;
        vm.translation = CommonsSessionStorageService.get('confirmationDigitalInfo').Language;
        vm.isFareSelected = isFareSelected;
        vm.openModalConditions = openModalConditions;
        vm.resizeFareDetailsBox = resizeFareDetailsBox;
        vm.getFareIcon = getFareIcon;
        vm.getMarketOBPoints = CommonsSessionStorageService.get('getMarketOBPoints') || null;
        vm.oBDiscountType = CommonsSessionStorageService.get('oBDiscountType');
        vm.oBUserLogged = CommonsSessionStorageService.get('userLogged') === 'ONB';
        vm.getFareSubCodeClass = getFareSubCodeClass;
        vm.getDiscount = getDiscount;
        vm.openDetailFareModal = openDetailFareModal;
        vm.removeAccents = removeAccents;
        $scope.$on('openModalConditionsEvent', openModalConditionsEvent);
        $scope.$on('isFareSelectedEvent', isFareSelectedEvent);

        vm.singularTranslationCondition = false;
        vm.pluralTranslationCondition = false;
        vm.isEuro = false;
        vm.isHelloMadridDiscount = false;

        vm.btnActiveText = $filter('translate')('AVAILABILITY_FARE_DETAILS_BUTTON_SELECTED');

        vm.$onInit = activate;

        vm.isLogged = $rootScope.isLogged;

        function activate() {
            vm.isEuro = "EUR" in vm.currencies;
            checkIfHelloMadridOffer();
            getRemainingSeatsTranslations();
            getRemainingSeatsTranslationsPlural();
        }

        function removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").toLowerCase();
        }

        function getRemainingSeatsTranslations () {
            if (vm.translation === BookingAppConstants.dateLanguages.EN || vm.translation === BookingAppConstants.dateLanguages.PT || vm.translation === BookingAppConstants.dateLanguages.NL) {
                vm.singularTranslationCondition = true;
            }
        }

        function getRemainingSeatsTranslationsPlural () {
            if (vm.translation === BookingAppConstants.dateLanguages.EN || vm.translation === BookingAppConstants.dateLanguages.DE) {
                vm.pluralTranslationCondition = true;
            }
        }

        function checkIfHelloMadridOffer () {
            vm.fareInfo.offers.forEach((offer) => {
                if(offer?.specialDiscountsApplied){
                    offer.specialDiscountsApplied.forEach((discount) => {
                        if(discount.corporateCodes == BookingAppConstants.HELLO_MADRID.corporateCode) {
                            vm.isHelloMadridDiscount = true;
                        }
                    })
                }
            })
        };

        function isFareSelectedEvent (event,fareInfo, index) {
            const $id = 'radioFare-' + fareInfo.commercialNameES.replace(/ /g,'-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '-' + fareInfo.cabinType + '-' + index;
            document.getElementById($id).click();
        }

        function isFareSelected () {
            if ($rootScope.ancOffers) {
                NewMainHeaderFacade.updateBasketFlexibilization('');
                CommonsSessionStorageService.remove('selectedFlex');
                $rootScope.$broadcast('emptyFlex');
                angular.element('.ib-radio-boxed--simple input').trigger('click');
                $scope.$emit('selectedFareFamilyAncOffers', vm.fareInfo);
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

        function openDetailFareModal () {
            BookingModalService.showBKIGenericModal(true,'ib-modal-single-fare-conditions.html',vm.fareInfo,'ib-modals--right fade').result.then(angular.noop, angular.noop);
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

        function openModalConditionsEvent (event) {
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

        function getDiscount (price, discount) {
            return parseInt(100 - (price.replace(/\D/g,'') * 100) / discount.replace(/\D/g,''));
        }

        function getFareSubCodeClass (code) {
            let codeClass = '';
            if(code) {
                if(code.includes('CA_1 PERM')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_CAMBIO CON PENALTY')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_CAMBIO DOBLE')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_CAMBIO ESTUDIANTE EMBAJADA')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_CAMBIO GRATUITO ERASMUS')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_CAMBIO JOVEN')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_CAMBIO PERMITIDO_LEVEL_NO_SHOW_NO')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_CAMBIO SIEMPRE')) {
                    codeClass = 'ib-list-icon-fare__item--tick-active' ;
                }else if(code.includes('CA_CAMBIOS NO PERMITIDOS O CON PENALTY')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_CAMBIOS NO PERMITIDOS')) {
                    codeClass = 'ib-list-icon-fare__item--cancel' ;
                }else if(code.includes('CA_CAMBIOS PERMITIDOS_NO_SHOW')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_CAMBIOS PERMITIDOS')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_REEMBOLSO CON PENALTY')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_REEMBOLSO ESTUDIANTE EMBAJADA')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_REEMBOLSO NO PERMITIDO O CON PENALTY')) {
                    codeClass = 'ib-list-icon-fare__item--with-penalty' ;
                }else if(code.includes('CA_REEMBOLSO NO PERMITIDO')) {
                    codeClass = 'ib-list-icon-fare__item--cancel' ;
                }else if(code.includes('CA_REEMBOLSO SIEMPRE_NO_SHOW')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_REEMBOLSO SIEMPRE')) {
                    codeClass = 'ib-list-icon-fare__item--tick-active' ;
                }else if(code.includes('CA_REEMBOLSO_PERMITIDO_LEVEL_NO_SHOW_NO')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }else if(code.includes('CA_REEMBOLSOS_PERMITIDOS_BD_NO_SHOW_NO_PERMITIDO')) {
                    codeClass = 'ib-list-icon-fare__item--tick';
                }
            }
            return codeClass;
        }

        /* Return class of fare
            * @param {String} type Type of fare
            * @return Class of fare for show icon in view
        */
        function getFareIcon (type) {
            return FareIconMapConstants[type] || '';
        }
    }
})();
