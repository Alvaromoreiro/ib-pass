import { lastValueFrom } from 'rxjs';

(function () {
    'use strict';
    /**
    * @Factory
    * @name PmtAncillariesProxy
    * @desc Manages the logic of the service get or update ancillaries information
    */
    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtAncillariesProxy', PmtAncillariesProxy);

    PmtAncillariesProxy.$inject = ['PmtRxProxy'];
    function PmtAncillariesProxy (PmtRxProxy) {


        return {
            getAncillaries: getAncillaries,
            getInsurance: getInsurance,
            getConfirmationAncillaries: getConfirmationAncillaries,
            updateAncillaries: updateAncillaries,
            updatePaymentsInfo: updatePaymentsInfo,
            getVoucherValidation: getVoucherValidation,
            deleteVoucher: deleteVoucher,
            deleteAssistCard: deleteAssistCard
        };

        /**
        * Get all ancillaries of serivice (Baggages, Seats and Insurance)
        * @param {String} uri URI of service
        * @param {String} checkinId Checkin-id of flow
         */
        function getAncillaries (uri, checkinId) {
            return lastValueFrom(PmtRxProxy.get(uri + checkinId + '/ancillaries'))
                .then(response => response.data)
                .catch(handleError);
        }

        /**
         * Update ancillaries
         * @param {String} uri URI of service
         * @param {String} checkinId Checkin-id of flow
         * @param {Object} data Data of ancillaries for update in service
         */
        function updateAncillaries (uri, checkinId, data) {
            return lastValueFrom(PmtRxProxy.put(uri + checkinId + '/ancillaries', data))
                .then(response => response.data)
                .catch(handleError);
        }

        /**
         * Return insurance ancillaries for country
         * @param {String} uri URI of service
         * @param {String} checkinId Checkin-id of flow
         * @param {String} country Country selected for get ancillaries
         */
        function getInsurance (uri, checkinId, country) {
            return lastValueFrom(PmtRxProxy.get(uri + checkinId + '/ancillaries' + '?ancillaryType=INSURANCE&residenceCountry=' + country))
                .then(response => response.data)
                .catch(handleError);
        }

        /**
         * Return vehicle rental ancillaries for country
         * @param {String} uri URI of service
         * @param {String} checkinId Checkin-id of flow
         * @param {String} country Country selected for get ancillaries
         */
        function getConfirmationAncillaries (uri, checkinId) {
            return lastValueFrom(PmtRxProxy.get(uri + checkinId + '/ancillaries' + '?ancillaryType=BOB&ancillaryType=VEHICLE_RENTAL&ancillaryType=CO2_FOOTPRINT'))
                .then(response => response.data)
                .catch(handleError);
        }

        function updatePaymentsInfo (uri, checkinId, data, isRecall) {
            const request = isRecall === '3ds2Adyen' || isRecall === 'iberiaPayAfop'
                ? PmtRxProxy.put(uri + checkinId + '/ancillaries/pay-and-issue/payment-details', data)
                : PmtRxProxy.post(uri + checkinId + '/ancillaries/pay-and-issue', data);

            return lastValueFrom(request).then(response => response.data).catch(handleError);
        }

        /**
         *
         * @param {*} uri
         * @param {*} flowId
         * @param {*} voucherId
         */
        function getVoucherValidation (uri, flowId, voucherId, data) {
            return lastValueFrom(PmtRxProxy.post(uri + flowId + '/voucher/validation/' + voucherId, data))
                .then(response => response.data)
                .catch(handleError);
        }

        /**
         *
         * @param {*} uri
         * @param {*} flowId
         * @param {*} voucherId
         */
        function deleteVoucher (uri, flowId, voucherId) {
            return lastValueFrom(PmtRxProxy.delete(uri + flowId + '/voucher/remove/' + voucherId))
                .then(response => response.data)
                .catch(handleError);
        }

        function deleteAssistCard (uri) {
            const deleteRequest = [{ type: 'ASSIST_CARD' }];
            return lastValueFrom(PmtRxProxy.put(uri, deleteRequest))
                .then(response => response.data)
                .catch(handleError);
        }

        function handleError (response) {
            return Promise.reject({
                data: response?.error,
                errorCode: response?.status
            });
        }

    }
})();
