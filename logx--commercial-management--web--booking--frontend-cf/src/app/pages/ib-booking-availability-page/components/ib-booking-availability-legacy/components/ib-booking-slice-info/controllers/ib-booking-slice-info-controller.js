(function () {


    angular
        .module('ib-booking-slice-info-module')
        .controller('BookingSliceInfoController', BookingSliceInfoController);


    BookingSliceInfoController.$inject = ['$scope', '$timeout', 'BookingComponentUtils', '$rootScope', 'BookingAppConstants', '$window', 'localStorageService', 'BookingUtilService', 'IbCheckPartnersDiscountsService', 'DatalayerBKIService', '$element', 'IbSliceDetailsComponentService'];
    function BookingSliceInfoController($scope, $timeout, BookingComponentUtils, $rootScope, BookingAppConstants, $window, localStorageService, BookingUtilService, IbCheckPartnersDiscountsService, DatalayerBKIService, $element, IbSliceDetailsComponentService) {
        const vm = this;
        vm.sendSelectedSlice = sendSelectedSlice;
        vm.openDetailsInfo = openDetailsInfo;
        vm.openModalConditions = openModalConditions;
        vm.toogleDetailsModal = toogleDetailsModal;
        vm.LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
        vm.newFare = $rootScope.newFare;
        vm.isReturn = 0;
        vm.hasMobileCollapsableCabinsActive = false;
        vm.openSliceInfoModal = false;

        vm.$onInit = activate;
        $scope.$on('$destroy', destroy);

        ////////////////

        function activate () {
            const fType = localStorageService.get('searchFlightType');
            vm.selectedCabin = '';
            if (localStorageService.get('userLogged')) {
                const partnerInfo =  IbCheckPartnersDiscountsService.getSelectedPartner();
                vm.isPartnerUser = (partnerInfo !== null);
                vm.partnerIdentifier = (partnerInfo !== null) ? partnerInfo.partnerIdentifier : '';
                vm.productDescription = (partnerInfo !== null) ? partnerInfo.productDescription : '';
            }

            if(vm.sliceInfoModel.cabins) {
                rateHighlighted(vm.sliceInfoModel.cabins);
            }
            vm.isReturn = localStorageService.get('headerModel').headerModel.trips[0].tripType;
            vm.hasMobileCollapsableCabinsActive = (fType === BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY) && (!vm.selectedSliceMode ?? false);
        }

        function destroy (){
            IbSliceDetailsComponentService.destroy()
        }

        function rateHighlighted (cabins) {
            vm.rateHighlighted = 'optima';
            angular.forEach(cabins, (cabin, index) => {
                if(index === 'E') {
                    angular.forEach(cabin.fareFamilies, (fare) => {
                        if(fare.commercialNameES === 'Corporate' && fare.cabinType === 'E') {
                            vm.rateHighlighted = 'corporate';
                        } else if(fare.commercialNameES === 'Confort' && fare.cabinType === 'E') {
                            vm.rateHighlighted = 'confort';
                        } else if(fare.commercialNameES === 'Confort Canarias' && fare.cabinType === 'E') {
                            vm.rateHighlighted = 'confort-canarias';
                        } else if(fare.commercialNameES === 'Confort Baleares' && fare.cabinType === 'E') {
                            vm.rateHighlighted = 'confort-baleares';
                        } else if(fare.commercialNameES === 'Puente Aéreo Confort' && fare.cabinType === 'E') {
                            vm.rateHighlighted = BookingAppConstants.FARE_COMERCIAL_NAME_ES.CONFORT_PUENTE_AEREO;
                        }
                    });
                }
            });
        }

        function sendSelectedSlice (element, cabin) {
            const article = angular.element(element.offsetParent);
            const heightHeadingFlight = angular.element('.ib-table-flight-cabins')?.find('[data-flight-heading]')[0]?.offsetTop || 0;
            let articleOffset = article[0].offsetTop;
            const transformOffset = heightHeadingFlight;
            vm.sliceInfoModel.showedCabin = cabin;
            const selectedSlice = {
                selectedSliceIndex: vm.selectedSliceIndex,
                selectedSlicesLength: vm.selectedSlicesLength,
                cabin: cabin,
                originDestinationId: vm.originDestinationId,
                origin: vm.origin,
                destination: vm.destination,
                info: vm.sliceInfoModel,
                articleOffset: articleOffset,
                transformOffset: transformOffset,
                heightHeadingFlight: heightHeadingFlight
            };
            if (!vm.showFaresSelected) {
                vm.sliceInfoModel.selectedCabin = cabin;
                if (vm.selectedSliceIndex > 3) {
                    const offsetLength = vm.currentOriginDestinationIndex < vm.selectedSlicesLength - 1 ? vm.selectedSlicesLength - 1 : vm.currentOriginDestinationIndex;
                    selectedSlice.articleOffset = (offsetLength + 1) * 530;
                }
                $rootScope.selectedSlice = selectedSlice;
                $rootScope.animationIndex = angular.copy(vm.currentOriginDestinationIndex);
                if (!$rootScope.isRedemptionFlow) {
                    ($element[0]).dispatchEvent(new CustomEvent('selectedSliceEvent', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            selectedSlice,
                            checkSlides: true,
                        }

                    }));
                } else {
                    $scope.$emit('selectedRedemptionSliceEvent', selectedSlice, true);
                }

            }
            DatalayerBKIService.getDigitalDataEcommerce([selectedSlice], 'view_item_list');
            $timeout(() => {
                BookingComponentUtils.equalHeight(angular.element('.ib-table-flight-cabins'), true);
                angular.element($window).triggerHandler('resize');
            });
        }

        function openDetailsInfo () {
            $scope.$emit('showDetailsInfo', true);
        }

        function openModalConditions (event) {
            event.preventDefault();
            $scope.$emit('openFareModal', vm.sliceInfoModel.selectedFareFamily);
            ($element[0]).dispatchEvent(new CustomEvent('openFareModal',
                {
                    bubbles: true,
                    composed: true,
                    detail: {
                        fareInfo: vm.fareInfo
                }
            }));
        }

        function toogleDetailsModal (event){
            event?.preventDefault();
            IbSliceDetailsComponentService.show(vm.sliceInfoModel)
        }
    }
})();
