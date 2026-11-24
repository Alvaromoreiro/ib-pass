(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('MmBDataService', MmBDataService);

    MmBDataService.$inject = ['localStorageService', 'MmBDataTransformer'];

    function MmBDataService(localStorageService, MmBDataTransformer) {

        return {
            getMmBOnHoldData: getMmBOnHoldData,
            getMmBAncillariesData: getMmBAncillariesData,
            getMmBVoluntaryChangeData: getMmBVoluntaryChangeData
        };

        ////////////////

        /**
         * Get the data for the confirmation datalayer in the MmB onHold flow
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the data for the confirmation datalayer in the MmB onHold flow
         */
        function getMmBOnHoldData(issuedInfo) {
            var datalayerMmBOnHoldInfo, issuedInfoData, confirmationInfo, bookingInfo;

            issuedInfoData = issuedInfo.data;
            confirmationInfo = localStorageService.get('confirmationInfo');
            bookingInfo = localStorageService.get('bookingInfo');

            datalayerMmBOnHoldInfo = MmBDataTransformer.generateMmBOnHoldData(issuedInfoData, confirmationInfo, bookingInfo);

            return datalayerMmBOnHoldInfo;
        };

        /**
         * Get the data for the confirmation datalayer in the MmB ancillaries flow
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the data for the confirmation datalayer in the MmB ancillaries flow
         */
        function getMmBAncillariesData(issuedInfo) {
            var datalayerMmBAncillaries, issuedInfoData, bookingInfo;

            issuedInfoData = issuedInfo;
            bookingInfo = localStorageService.get('bookingInfo');
            datalayerMmBAncillaries = MmBDataTransformer.generateMmBAncillariesData(issuedInfoData, bookingInfo);

            return datalayerMmBAncillaries;
        }

        /**
         * Get the data for the confirmation datalayer in the MmB VoluntaryChange flow
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the data for the confirmation datalayer in the MmB VoluntaryChange flow
         */
        function getMmBVoluntaryChangeData (issuedInfo) {
            const confirmationInfo = localStorageService.get('confirmationInfo');
            const issuedInfoData = issuedInfo.data;
            const bookingInfo = localStorageService.get('bookingInfo');
            const datalayerMmBVoluntaryChange = MmBDataTransformer.generateMmBVoluntaryChangeData(issuedInfoData, confirmationInfo, bookingInfo);
            return datalayerMmBVoluntaryChange;
        }
    }
})();
