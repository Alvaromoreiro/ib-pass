(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('BbkiDataService', BbkiDataService);

    BbkiDataService.$inject = ['localStorageService', 'BbkiDataTransformer'];

    function BbkiDataService(localStorageService, BbkiDataTransformer) {

        return {
            getBbkiData: getBbkiData,
            getBbkiRedemptionData: getBbkiRedemptionData
        };

        ////////////////

        /**
         * Get the data for the confirmation datalayer at the Bki regular flow
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the data for the confirmation datalayer in the MmB onHold flow
         */
        function getBbkiData(issuedInfo, flowApp) {
            var datalayerBbkiInfo, issuedInfoData;

            issuedInfoData = issuedInfo.data;

            datalayerBbkiInfo = BbkiDataTransformer.generateBbkiData(issuedInfoData, flowApp);

            return datalayerBbkiInfo;
        }

        /**
         * Get the data for the confirmation datalayer at the Bki Redemption flow
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the data for the confirmation datalayer at the Bki Redemption flow
         */
        function getBbkiRedemptionData(issuedInfo) {
            var datalayerBbkiInfo, issuedInfoData;

            issuedInfoData = issuedInfo.data;

            datalayerBbkiInfo = BbkiDataTransformer.generateBbkiRedemptionData(issuedInfoData);

            return datalayerBbkiInfo;
        }
    }
})();