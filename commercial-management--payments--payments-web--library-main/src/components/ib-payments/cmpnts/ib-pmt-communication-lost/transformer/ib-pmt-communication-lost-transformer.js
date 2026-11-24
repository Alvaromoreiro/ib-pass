(function () {
    'use strict';

    angular
        .module('ib-pmt-communication-lost-module')
        .factory('ibPmtCommunicationLostTransformer', ibPmtCommunicationLostTransformer);

    ibPmtCommunicationLostTransformer.$inject = ['PmtUtilsService', 'localStorageService', 'PmtConstants'];
    function ibPmtCommunicationLostTransformer (PmtUtilsService, localStorageService, PmtConstants) {

        return {
            generateCommunicationLostInfo: generateCommunicationLostInfo
        };

        ////////////////
        /**
         * generates the communication lost info calling to transformer
         */
        function generateCommunicationLostInfo (confirmationInfo, creditCardTypes) {
            const communicationLostModel = {
                communicationLostInfo: PmtUtilsService.getCommunicationsLostInfo(confirmationInfo, creditCardTypes),
                relatedContent: PmtUtilsService.getRelatedContent(confirmationInfo && confirmationInfo.relatedContent ? confirmationInfo.relatedContent : null),
                quadrigam: generateQuadrigam()
            };

            return communicationLostModel;

        }

        /**
         * This functions return quadrigam code according flowApp to update communicationLost page
         * @returns {String} quadrigam value
         *  */
        function generateQuadrigam () {
            let quadrigam, flowApp = localStorageService.get('flowApp');
            switch (flowApp) {
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED:
                        quadrigam = PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_COMMUNICATION_LOST;
                        break;
                    case PmtConstants.APP_TYPES.BOOKING:
                        quadrigam = PmtConstants.QUADRIGAMS.BOOKING_COMMUNICATION_LOST;
                        break;
                    default:
                        quadrigam = null;
                        break;
            }
            return quadrigam;
        }

    }
})();