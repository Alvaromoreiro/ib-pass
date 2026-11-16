(function () {


    angular
        .module('ib-shuttle-fare-detail-module')
        .controller('IbShuttleFareDetailController', IbShuttleFareDetailController);

    IbShuttleFareDetailController.$inject = ['$scope', '$rootScope', 'localStorageService', 'BookingModalService', 'BookingAvailabilityTransformer', '$window', '$filter'];
    function IbShuttleFareDetailController ($scope, $rootScope, localStorageService, BookingModalService, BookingAvailabilityTransformer, $window, $filter) {

        let vm = this, cabins, fareDescription, fareCabin;
        vm.$onInit = activate;
        vm.openModalFare = openModalFare;
        vm.openModalFareDetails = openModalFareDetails;

        function activate () {
        }

        function openModalFare (event, index) {
            if (event) {
                event.preventDefault();
            }
            BookingModalService.openFareWindowModal(false, 'ib-compare-fares-modal.html', { fareFamilyConditions: BookingAvailabilityTransformer.getDetailedFaresInfo(vm.model.fareFamilyConditions) }, '');
        }
        function openModalFareDetails (event, index) {
            if (event) {
                event.preventDefault();
            }
            for(cabins = 0; cabins < vm.model.fareFamilyConditions.length; cabins++) {
                fareDescription = vm.model.fareFamilyConditions[cabins].cabinDescription;
                fareCabin = fareDescription.trimEnd().replace(' Class','');
                if(vm.model.slices.length > index && fareCabin === vm.model.slices[index].cabin) {
                    BookingModalService.showGenericModal(false, 'ib-modal-fare-details.html', { fareFamilyConditions: vm.model.fareFamilyConditions[cabins] }, '');
                }
            }
        }
    }
})();
