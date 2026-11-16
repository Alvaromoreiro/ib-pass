(function () {


    angular
        .module('ib-price-matrix-calendar')
        .controller('PriceMatrixCalendarController', PriceMatrixCalendarController);

    PriceMatrixCalendarController.$inject = ['$scope', 'CurrencyService', 'BookingPriceMatrixTransformer'];
    function PriceMatrixCalendarController ($scope, CurrencyService, BookingPriceMatrixTransformer) {

        const vm = this;

        vm.selectItem = selectItem;
        vm.formatPrice = formatPrice;
        vm.formatString = formatString;
        vm.calculateLength = calculateLength;


        //////////////

        function selectItem (columnIndex, inboundDate, cellPrice) {
            const outboundDate = vm.priceMatrixData.calendarGrid.columns[columnIndex].inboundDate;
            $scope.$emit('cellSelected', {
                price: cellPrice,
                inboundDate: BookingPriceMatrixTransformer.getDateFormatted(inboundDate.day, inboundDate.monthNumber, inboundDate.year),
                outboundDate: BookingPriceMatrixTransformer.getDateFormatted(outboundDate.day, outboundDate.monthNumber, outboundDate.year)
            });
        }

        function calculateLength (price) {
            return price.toString().indexOf('.', 0);
        }

        function formatPrice (price) {
            const lengthOfPrice = price.toString().indexOf('.', 0);
            return (lengthOfPrice > 5) ? CurrencyService.formatPriceWithoutSimbol(vm.priceMatrixData.currency, price, false, true) : CurrencyService.formatPrice(vm.priceMatrixData.currency, price, false, true);
        }

        function formatString (stringInput, newStringLength) {
            const stringFormatted = stringInput || '';
            const stringLength = newStringLength || 0;
            return stringFormatted.length > stringLength ? stringFormatted.substring(0, newStringLength) : stringFormatted;
        }
    }
})();
