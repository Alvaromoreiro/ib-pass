(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('CkiDataService', CkiDataService);

    CkiDataService.$inject = ['localStorageService', 'CkiDataTransformer'];

    function CkiDataService (localStorageService, CkiDataTransformer) {

        return {
            getCkiData: getCkiData
        };

        ////////////////

        /**
         * Get the data for the confirmation datalayer in the CKI flow
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the data for the confirmation datalayer in the CKI flow
         */
        function getCkiData (issuedInfo) {
            const issuedInfoData = issuedInfo?.data ? issuedInfo.data : issuedInfo;
            const confirmationInfo = localStorageService.get('confirmationInfo');
            const bookingInfo = localStorageService.get('bookingInfo');
            const datalayerCkiInfo = CkiDataTransformer.generateCkiData(issuedInfoData, confirmationInfo, bookingInfo);

            return datalayerCkiInfo;
        }
    }
})();