(function () {


    angular
        .module('ib-price-matrix-calendar-outbound')
        .controller('PriceMatrixCalendarOutboundController', PriceMatrixCalendarOutboundController);

    PriceMatrixCalendarOutboundController.$inject = ['$scope', 'CurrencyService', 'BookingPriceMatrixTransformer'];
    function PriceMatrixCalendarOutboundController ($scope, CurrencyService, BookingPriceMatrixTransformer) {

        const vm = this;

        vm.selectItem = selectItem;
        vm.formatPrice = formatPrice;
        vm.formatString = formatString;
        vm.calculateLength = calculateLength;


        //////////////

        function selectItem (columnIndex, outBoundDate, cellPrice) {
            $scope.$emit('cellSelected', {
                price: cellPrice,
                outboundDate: BookingPriceMatrixTransformer.getDateFormatted(outBoundDate.day, outBoundDate.monthNumber, outBoundDate.year)
            });
        }


        function calculateLength (price) {
            return price.toString().indexOf('.', 0);
        }

        function formatPrice (price) {
            return CurrencyService.formatPrice(vm.priceMatrixData.currency, price, false, true);
        }

        function formatString (stringInput, newStringLength) {
            const stringFormatted = stringInput || '';
            const stringLength = newStringLength || 0;
            return stringFormatted.length > stringLength ? stringFormatted.substring(0, newStringLength) : stringFormatted;
        }
    }
})();
