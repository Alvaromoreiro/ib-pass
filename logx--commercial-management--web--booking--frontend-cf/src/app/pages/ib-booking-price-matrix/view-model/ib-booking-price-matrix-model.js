(function () {


    angular
        .module('ib-booking-price-matrix-module')
        .service('PriceMatrixModel', PriceMatrixModel);

    function PriceMatrixModel () {

        const self = this;
        self.initializeModel = initializeModel;

        self.priceMatrixData = null;
        self.selectedCell;
        ////////////////////////////

        /**
         * Initialize the price matrix model service with the default attributes values
         */
        function initializeModel () {
            self.priceMatrixData = null;
            self.selectedCell = null;
        }

    }
})();