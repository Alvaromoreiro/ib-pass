(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('DatalayerEcommerceDataService', DatalayerEcommerceDataService);

    DatalayerEcommerceDataService.$inject = ['PmtConstants', 'MmBDataService', 'BbkiDataService', 'CkiDataService', '$rootScope'];
    function DatalayerEcommerceDataService (PmtConstants, MmBDataService, BbkiDataService, CkiDataService, $rootScope) {

        return {
            getDatalayerData: getDatalayerData
        };

        ////////////////

        /**
         * Get the data for the confirmation datalayer
         * @param {String} flowApp identifier of the incoming flow to payments
         * @param {Object} issuedInfo the payment issued info
         * @returns {Object} Returns the object with the transformed data required for the confirmation datalayer
         */
        function getDatalayerData (flowApp, issuedInfo) {
            let datalayerInfo;

            switch (flowApp) {
                    case PmtConstants.APP_TYPES.CHECKIN:
                        datalayerInfo = CkiDataService.getCkiData(issuedInfo);
                        break;
                    case PmtConstants.APP_TYPES.BOOKING:
                    case PmtConstants.APP_TYPES.SHUTTLE_OPEN:
                    case PmtConstants.APP_TYPES.SHUTTLE_OPEN_ONB:
                    case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION:
                    case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB:
                    case PmtConstants.APP_TYPES.ONHOLD:
                        if ($rootScope.isRedemptionFlow) {
                            datalayerInfo = BbkiDataService.getBbkiRedemptionData(issuedInfo);
                        } else {
                            datalayerInfo = BbkiDataService.getBbkiData(issuedInfo, flowApp);
                        }
                        break;
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                        datalayerInfo = MmBDataService.getMmBOnHoldData(issuedInfo);
                        break;
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                        datalayerInfo = MmBDataService.getMmBAncillariesData(issuedInfo);
                        break;
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                        datalayerInfo = MmBDataService.getMmBVoluntaryChangeData(issuedInfo);
                    default:
                        break;
            }

            return datalayerInfo;
        }
    }
})();
