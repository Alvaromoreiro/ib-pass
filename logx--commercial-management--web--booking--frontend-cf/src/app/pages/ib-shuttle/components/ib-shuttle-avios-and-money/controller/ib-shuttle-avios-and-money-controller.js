(function () {


    angular
        .module('ib-shuttle-avios-and-money-module')
        .controller('IbShuttleAviosAndMoneyController', IbShuttleAviosAndMoneyController);

    IbShuttleAviosAndMoneyController.$inject = ['$scope', '$rootScope', 'localStorageService', 'CurrencyService', 'BookingModalService', '$location', 'BookingAppConstants', '$window'];
    function IbShuttleAviosAndMoneyController ($scope, $rootScope, localStorageService, CurrencyService, BookingModalService, $location, BookingAppConstants, $window) {
        const vm = this;
        vm.$onInit = activate;
        vm.getCurrency = getCurrency;
        vm.selectOffer = selectOffer;
        vm.indexActive;
        vm.openModalLinks = showGenericModal;
        vm.withoutAviosMoney = true;
        vm.goToShuttleOpen = goToShuttleOpen;

        function activate () {
            vm.indexActive = 0;
            if(vm.model && vm.model.fareRate && vm.model.fareRate.length > 0) {
                angular.forEach(vm.model.fareRate, (offer)=> {
                    if(offer.selected) {
                        $rootScope.$broadcast('selectOffer', offer);
                    }
                });
            }
        }

        function getCurrency (price) {
            return CurrencyService.formatPrice(CurrencyService.getCurrencyObject(localStorageService.get('fareData').contextMetadata.currencies[0]), price, true);
        }

        /**
         * Adds to model the values of the avios&money option selected by the user
         * @param {object} aviosMoneySelected option selected in the avios&money module
         * @param {number} index of offer selected
         */
        function selectOffer (offer) {
            if (offer) {
                vm.offerSelected = true;
            }
            $rootScope.$broadcast('selectOffer', offer);
        }

        /**
         * Open the modal with info to buy avios
         */
        function showGenericModal () {
            BookingModalService.showGenericModal(true, 'ib-modal-avios-buy-v2.html', { idModal: 'ib-modal-avios-buy-v2.html' }).result.then(angular.noop, angular.noop);
        }

        function goToShuttleOpen () {
            $location.search(BookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_AVIOS, 0);
            $rootScope.$broadcast('changeToObtention');
        }
    }
})();