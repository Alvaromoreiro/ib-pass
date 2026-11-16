(function () {


    angular
        .module('ib-booking-upselling-fare-module')
        .controller(
            'BookingUpsellingFareController',
            BookingUpsellingFareController
        );

    BookingUpsellingFareController.$inject = ['$scope', '$rootScope', 'localStorageService', 'CurrencyService', '$filter', 'BookingAppConstants', '$document', '$timeout', 'IbBookingUpsellingUtilsService'];
    function BookingUpsellingFareController ($scope, $rootScope, localStorageService, CurrencyService, $filter,BookingAppConstants, $document, $timeout, IbBookingUpsellingUtilsService) {
        const vm = this;
        vm.fareExtrasToShow = [];
        vm.nextUpsellFare;
        vm.nextUpsellFareCollection = [];
        vm.diffPrice = 0;
        vm.selectedUpsellingFare = '';
        vm.selectedSlices;

        vm.selectUpsellFare = selectUpsellFare;
        vm.goToFareContainer = goToFareContainer;
        vm.$onInit = activate;

        $rootScope.$on('changeUpsellingFare', changeUpsellingFare);
        ////////////////

        function activate () {
            vm.fareExtrasToShow = BookingAppConstants.UPSELLING.FARE.OPTIMA;
            offerUpsellingFareTrips();
        }

        async function offerUpsellingFareTrips (data) {
            let selectedTripInfo = vm.selectedInfo;
            let setBannerFlag = false;
            let availableFareFlag = true;
            let showUpsellCondition = false;
            const selectedSlicesArray =[];
            const nextUpsellFareArray =[];
            if(data) {
                selectedTripInfo = [...data];
            }
            if (selectedTripInfo && selectedTripInfo.length >= 1) {
                selectedTripInfo.forEach((trip, index) =>{
                    if (trip.info.selectedFareFamily !== null) {
                        showUpsellCondition = getInfoToShow(trip);
                        const availableFares = trip.info.cabins[trip.info.showedCabin].fareFamilies;
                        const nextUpsellFare = availableFares.find(fare => fare.priority < trip.info.selectedFareFamily.priority);
                        if (showUpsellCondition && nextUpsellFare && IbBookingUpsellingUtilsService.checkUpsellingAvailableFares(nextUpsellFare.commercialNameES)) {
                            if (IbBookingUpsellingUtilsService.isForbiddenUpsell(trip.info.selectedFareFamily.commercialNameES, nextUpsellFare.commercialNameES)) {
                                setBannerFlag = false;
                            } else {
                                nextUpsellFare.index = availableFares.findIndex(fare => fare === nextUpsellFare);
                                nextUpsellFare.sliceIndex = 0;
                                trip.indexArray = index;
                                nextUpsellFareArray.push(nextUpsellFare);
                                selectedSlicesArray.push(trip);
                                setBannerFlag=true;
                                availableFareFlag=true;
                            }
                        } else {
                            availableFareFlag=false;
                        }
                    }
                });
                if(setBannerFlag && availableFareFlag) {
                    setDataBannerUpselling(nextUpsellFareArray, selectedSlicesArray);
                    await getInfoToShow(vm.nextSelectedSlices[0]);
                }else{
                    $scope.$emit('showUpselling', false);
                }
            }else{
                $scope.$emit('showUpselling', false);
            }
        }

        async function getInfoToShow (trip) {
            let showUpsell = true;
            if (IbBookingUpsellingUtilsService.isAnyValidOperator(trip.info.allOperatedByCodes)) {
                const model = await IbBookingUpsellingUtilsService.getInfoToShow(trip);
                if (model != null) {
                    showUpsell = true;
                    Object.assign(vm, model);
                } else {
                    showUpsell = false;
                }
            } else {
                showUpsell = false;
            }
            return showUpsell;
        }

        function setDataBannerUpselling (nextUpsellFareArray, selectedSlices) {
            const comercialData = localStorageService.get('commercialData');
            let currency='€';
            if(comercialData && comercialData.currency) {
                currency = comercialData.currency;
            }
            let price = 0;
            let amountFares = 0;
            nextUpsellFareArray.forEach( (upsell, index)=>{
                if(nextUpsellFareArray.length === 1 || index === 0 || (upsell.priority > vm.nextUpsellFare.priority)) {
                    vm.nextUpsellFareCollection = [upsell];
                    vm.nextSelectedSlices = [selectedSlices[index]];
                    amountFares = selectedSlices[index].info.selectedFareFamily.farePriceToCalculate;
                    price = upsell.farePriceToCalculate;
                    vm.nextUpsellFare = upsell;
                }else if( upsell.priority === vm.nextUpsellFare.priority) {
                    vm.nextUpsellFareCollection.push(upsell);
                    vm.nextSelectedSlices.push(selectedSlices[index]);
                    amountFares += selectedSlices[index].info.selectedFareFamily.farePriceToCalculate;
                    price += upsell.farePriceToCalculate;
                    vm.nextUpsellFare = upsell;
                }
            });
            vm.diffPrice = calculateDiffPrice(price, amountFares, currency, false);
            $scope.$emit('showUpselling', true);
        }

        function changeUpsellingFare (event, data) {
            offerUpsellingFareTrips(data);
            $scope.$emit('selectedFareFamilyFlexibility');
        }

        function selectUpsellFare () {
            if (vm.nextUpsellFareCollection.length > 0) {
                $rootScope.$emit('fareUpsellingSelected', vm.nextUpsellFareCollection, vm.nextSelectedSlices);
            }
            if ($rootScope.ancOffers) {
                $scope.$emit('selectedFareFamilyAncOffers',vm.selectedInfo[0].info.selectedFareFamily);
            }
            goToFareContainer();
        }

        function goToFareContainer () {
            const referenceElement = angular.element($document).find('.ib-table-flight-cabins').first();
            $timeout(() => {
                angular.element('html, body').animate({ scrollTop: referenceElement.offset().top - (angular.element('[ib-sticky]').innerHeight() + 20) });
            });
        }

        function calculateDiffPrice (price1, price2, currency, format) {
            let diffPrice = 0;
            diffPrice = CurrencyService.getPriceByRoundingPolicy(price1 - price2);
            if (format) diffPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency.symbol), diffPrice, true);
            diffPrice = currency.alignment === 'R' ? diffPrice + currency.symbol : currency.symbol + diffPrice;
            diffPrice = diffPrice.replace(/\s/g, '');

            return diffPrice;
        }
    }
})();
