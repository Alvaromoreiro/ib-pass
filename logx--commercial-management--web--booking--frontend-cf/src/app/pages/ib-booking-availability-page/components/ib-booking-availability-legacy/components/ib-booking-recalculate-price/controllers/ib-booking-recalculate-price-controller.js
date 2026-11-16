(function () {



    angular
        .module('ib-booking-recalculate-price-module')
        .controller('BookingRecalculatePriceController', BookingRecalculatePriceController);

    BookingRecalculatePriceController.$inject = ['$scope', 'localStorageService'];

    function BookingRecalculatePriceController ($scope, localStorageService) {
        const vm = this;
        vm.recalculatePrice = recalculatePrice;


        function recalculatePrice() {
            const availabilityData = localStorageService.get('availabilityRequestData') || null;
            if (availabilityData !== null && availabilityData.hasOwnProperty('displayedPrice') && availabilityData.displayedPrice.price > 0) {
                delete availabilityData.displayedPrice;
                localStorageService.set('availabilityRequestData', availabilityData);
            }
            $scope.$emit('recalculatePrice');
        }

    }

})();