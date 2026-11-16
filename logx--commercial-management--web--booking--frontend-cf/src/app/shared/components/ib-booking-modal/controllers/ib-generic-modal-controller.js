(function () {


    angular
        .module('ib-booking-modal-module')
        .controller('BKIGenericModalController', BKIGenericModalController);

    BKIGenericModalController.$inject = ['$rootScope', '$uibModalInstance', 'object', 'DatalayerUtilsService', 'BookingRedirectionService', '$filter', '$window', 'CurrencyService', 'BookingAvailabilityConstants', 'CommonsSessionStorageService'];
    function BKIGenericModalController ($rootScope, $uibModalInstance, object, DatalayerUtilsService, BookingRedirectionService, $filter, $window, CurrencyService, BookingAvailabilityConstants, CommonsSessionStorageService) {
        const vm = this;
        vm.model = object;
        vm.price = 0;
        vm.fare = '';
        vm.showUpgradingFare = true;
        vm.fareBannerText = '';
        activate();
        vm.close = closeModal;
        vm.return = recoverMainPage;
        vm.enableWarning = enablePassengerWarning;
        vm.accept = acceptModal;
        vm.acceptBuyAvios = acceptBuyAvios;
        vm.getFareFamilyIcon = getFareFamilyIcon;
        vm.openModalConditionsEvent = openModalConditionsEvent;
        vm.clickNextFare = clickNextFare;
        vm.getFareSubCodeClassModal = getFareSubCodeClassModal;

        ////////////////

        function activate () {
            const idModal = vm.model && vm.model.idModal ? vm.model.idModal : vm.model;
            if (vm.model && !vm.model.indexFare) {
                vm.model.indexFare = 0;
            }
            DatalayerUtilsService.sendDatalayerModalEvent(idModal);
            $uibModalInstance.result.then(DatalayerUtilsService.removeDatalayerModalAttrs, DatalayerUtilsService.removeDatalayerModalAttrs);
            upgradingFares();
            bannersTextChange();
        }

        function getFareSubCodeClassModal (code) {
            let codeClass = '';
            if(code.includes('CA_1 PERM')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_CAMBIO CON PENALTY')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_CAMBIO DOBLE')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_CAMBIO ESTUDIANTE EMBAJADA')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_CAMBIO GRATUITO ERASMUS')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_CAMBIO JOVEN')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_CAMBIO PERMITIDO_LEVEL_NO_SHOW_NO')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_CAMBIO SIEMPRE')) {
                codeClass = 'ib-list-fares__icon--tick-active icon-circle-check' ;
            }else if(code.includes('CA_CAMBIOS NO PERMITIDOS O CON PENALTY')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_CAMBIOS NO PERMITIDOS')) {
                codeClass = 'ib-list-fares__icon--cancel icon-wrong' ;
            }else if(code.includes('CA_CAMBIOS PERMITIDOS_NO_SHOW')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_CAMBIOS PERMITIDOS')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_REEMBOLSO CON PENALTY')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_REEMBOLSO ESTUDIANTE EMBAJADA')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_REEMBOLSO NO PERMITIDO O CON PENALTY')) {
                codeClass = 'ib-list-fares__icon--with-penalty icon-reembolsos-old' ;
            }else if(code.includes('CA_REEMBOLSO NO PERMITIDO')) {
                codeClass = 'ib-list-fares__icon--cancel icon-wrong' ;
            }else if(code.includes('CA_REEMBOLSO SIEMPRE_NO_SHOW')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_REEMBOLSO SIEMPRE')) {
                codeClass = 'ib-list-fares__icon--tick-active icon-circle-check' ;
            }else if(code.includes('CA_REEMBOLSO_PERMITIDO_LEVEL_NO_SHOW_NO')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }else if(code.includes('CA_REEMBOLSOS_PERMITIDOS_BD_NO_SHOW_NO_PERMITIDO')) {
                codeClass = 'ib-list-fares__icon--tick icon-circle-check';
            }
            return codeClass;
        }

        function buildLitAndHtml () {
            const tagsInfo = {
                bold: {
                    tag: 'span',
                    class: 'ib-fare-notice__txt ib-fare-notice__txt--bold'
                }
            };
            const LITERALS = {
                TEXT_1: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_1',
                TEXT_2: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_2',
                TEXT_3: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_3',
                TEXT_4: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_4',
                TEXT_5: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_5',
                TEXT_6: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_6',
                TEXT_7: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_7',
                TEXT_8: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_8',
                TEXT_9: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_9',
                TEXT_10: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_10',
                TEXT_11: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_11',
                TEXT_12: 'AVAILABILITY_FARE_DETAILS_MODAL_BANNER_12'
            };
            let result = [];

            angular.forEach(LITERALS, (val, key) => {
                result.push($filter('literalFormatter')($filter('translate')(val), tagsInfo));
            });
            return result;
        }

        function bannersTextChange () {
            const message = buildLitAndHtml();
            switch (vm.model.commercialNameES) {
                    case 'Básica': vm.fareBannerText = message[0];break;
                    case 'Óptima': vm.fareBannerText = message[1];break;
                    case 'Confort': vm.fareBannerText = message[2];break;
                    case 'Óptima Flex': vm.fareBannerText = message[3];break;
                    case 'Turista Premium Óptima': vm.fareBannerText = message[4];break;
                    case 'Turista Premium Óptima Flex': vm.fareBannerText = message[5];break;
                    case 'Turista Premium Promocional': vm.fareBannerText = message[6];break;
                    case 'Turista Premium Promocional Flex': vm.fareBannerText = message[7];break;
                    case 'Business Óptima': vm.fareBannerText = message[8];break;
                    case 'Business Confort': vm.fareBannerText = message[9];break;
                    case 'Business Promocional': vm.fareBannerText = message[10];break;
                    case 'Business Promocional Flex': vm.fareBannerText = message[11];break;
            }
        }

        function upgradingFares () {
            let $index = 0;
            if ($rootScope.newFare) {
                if (CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo').length === 1) {
                    CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[0].info.cabins[vm.model.cabinType].fareFamilies.forEach( (fare, index, array) =>{
                        if (fare.commercialName === vm.model.commercialName && index < array.length - 1) {
                            $index = index + 1;
                            vm.showUpgradingFare = true;
                            vm.fare = CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[0].info.cabins[vm.model.cabinType].fareFamilies[$index].commercialName;
                            vm.price = getPriceNextfare(CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[0].info.cabins[vm.model.cabinType].fareFamilies[$index].farePriceToCalculate);
                        }if (fare.commercialName === vm.model.commercialName && index === array.length - 1) {
                            vm.fare = '';
                            vm.price = 0;
                            vm.showUpgradingFare = false;
                        }
                    });
                }else if (CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo').length === 2) {
                    CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[1].info.cabins[vm.model.cabinType].fareFamilies.forEach( (fare, index, array) =>{
                        if (fare.commercialName === vm.model.commercialName && index < array.length - 1) {
                            $index = index + 1;
                            vm.showUpgradingFare = true;
                            vm.fare = CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[1].info.cabins[vm.model.cabinType].fareFamilies[$index].commercialName;
                            vm.price = getPriceNextfare(CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[1].info.cabins[vm.model.cabinType].fareFamilies[$index].farePriceToCalculate);
                        }if (fare.commercialName === vm.model.commercialName && index === array.length - 1) {
                            vm.fare = '';
                            vm.price = 0;
                            vm.showUpgradingFare = false;
                        }
                    });
                }
            }
        }

        function getPriceNextfare (price) {
            return CurrencyService.formatPrice(CurrencyService.getCurrencyObject(CommonsSessionStorageService.get('ib-booking-app.commercialData').currency), price, true, true);
        }

        function clickNextFare () {
            let $index = 0;
            if (CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo').length === 1) {
                CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[0].info.cabins[vm.model.cabinType].fareFamilies.forEach( (fare, index) =>{
                    if (fare.commercialName === vm.model.commercialName) {
                        $index = index + 1;
                    }
                });
                $rootScope.$broadcast('isFareSelectedEvent', CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[0].info.cabins[vm.model.cabinType].fareFamilies[$index], 0);
            }else if (CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo').length === 2) {
                CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[1].info.cabins[vm.model.cabinType].fareFamilies.forEach( (fare, index) =>{
                    if (fare.commercialName === vm.model.commercialName) {
                        $index = index + 1;
                    }
                });
                $rootScope.$broadcast('isFareSelectedEvent', CommonsSessionStorageService.get('ib-booking-app.selectedTripInfo')[1].info.cabins[vm.model.cabinType].fareFamilies[$index], 1);
            }
        }

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal () {
            $uibModalInstance.dismiss();
        }

        /**
         * returns to main page
         */
        function recoverMainPage () {
            BookingRedirectionService.externalRedirect($window.location.origin);
        }

        function enablePassengerWarning () {
            $rootScope.$broadcast('passengerWarning');
            $uibModalInstance.dismiss();
        }

        /**
         * Closes the modal calling close method of its instance
         */
        function acceptModal (type) {
            $uibModalInstance.close(type);
        }

        /**
         * Closes the modal calling close method of its instance and redirect to link BUY-AVIOS
         */
        function acceptBuyAvios () {
            const newUrl = $filter('LinksFilter')('BUY_AVIOS');
            closeModal();
            BookingRedirectionService.externalRedirect(newUrl);
        }
        /**
         * Return class of fare
         * @param {String} type Type of fare
         * @return Class of fare for show icon in view
         */
        function getFareFamilyIcon (code) {
            return BookingAvailabilityConstants.FARE_FAMILY_ICON_PROPERTY_CODE[code];
        }

        function openModalConditionsEvent (event) {
            $rootScope.$broadcast('openModalConditionsEvent', event);
        }
    }
})();