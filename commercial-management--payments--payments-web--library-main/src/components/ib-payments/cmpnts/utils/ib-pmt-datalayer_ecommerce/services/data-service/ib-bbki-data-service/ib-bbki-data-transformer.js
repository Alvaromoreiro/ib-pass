(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('BbkiDataTransformer', BbkiDataTransformer);

    BbkiDataTransformer.$inject = ['DatalayerEcommerceConstants', 'localStorageService', 'DatalayerEcommerceDataUtils', 'PmtConstants', 'DatalayerUtilsService'];
    function BbkiDataTransformer(DatalayerEcommerceConstants, localStorageService, DatalayerEcommerceDataUtils, PmtConstants, DatalayerUtilsService) {

        return {
            generateBbkiData: generateBbkiData,
            generateBbkiRedemptionData: generateBbkiRedemptionData
        };

        ////////////////

        /**
         * We adapt the recovered data to the needs of the confirmation datalayer at the Bki Redemption flow
         * @param {Object} issuedInfoData store the data of the issue
         * @returns {Object} Returns the processed data for the confirmation datalayer at the Bki Redemption flow
         */
        function generateBbkiData(issuedInfoData, flowApp) {
            var datalayerInfo = {}, productsObject, pnr, category;
            /* INIT DELETE GA4 MIGRATION*/
            var generalInfo;
            /* FINISH DELETE GA4 MIGRATION*/

            category = flowApp === PmtConstants.APP_TYPES.ONHOLD ? DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD : DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT
            /* INIT DELETE GA4 MIGRATION*/
            if (localStorageService.get('confirmationDatalayerCallBack')) {
                generalInfo = localStorageService.get('confirmationDatalayerCallBack');
                localStorageService.remove('confirmationDatalayerCallBack')
            } else {
                generalInfo = {};
            }
            /* FINISH DELETE GA4 MIGRATION*/

            productsObject = DatalayerEcommerceDataUtils.getOrderItemsData(issuedInfoData.order.orderItems, issuedInfoData.order.slices, category, issuedInfoData.passengers);

            pnr = DatalayerEcommerceDataUtils.getPNR(issuedInfoData.order.bookingReferences);
            /* INIT DELETE GA4 MIGRATION*/
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] = productsObject.generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] ? DatalayerEcommerceConstants.DATALAYER_VALUES.YES : DatalayerEcommerceConstants.DATALAYER_VALUES.NO;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.ORDER_ID] = issuedInfoData.order.orderId;
            /* FINISH DELETE GA4 MIGRATION*/
            DatalayerUtilsService.generateBbkiDataPayments(productsObject, issuedInfoData);
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = productsObject.products;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = issuedInfoData.contextMetadata.currencies[0].code;

            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = {};
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_ID] = pnr;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = issuedInfoData.contextMetadata.country;
            if (flowApp === PmtConstants.APP_TYPES.ONHOLD) {
                productsObject.products[0].price = issuedInfoData.selectedOnHoldOption.price.total;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = productsObject.products[0].price * productsObject.products[0].quantity;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = productsObject.products[0].price * productsObject.products[0].quantity;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = '';
            } else {

                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = issuedInfoData.order.price.total;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = issuedInfoData.order.price.fare;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = issuedInfoData.order.price.tax;
            }

            datalayerInfo['generalInfo'] = generalInfo;

            return datalayerInfo;
        }

        /**
         * We adapt the recovered data to the needs of the confirmation datalayer at the Bki Redemption flow
         * @param {Object} issuedInfoData store the data of the issue
         * @returns {Object} Returns the processed data for the confirmation datalayer at the Bki Redemption flow
         */
        function generateBbkiRedemptionData(issuedInfoData) {
            var datalayerInfo = {}, productsObject, pnr;
            /* INIT DELETE GA4 MIGRATION*/
            var generalInfo;

            if (localStorageService.get('confirmationDatalayerCallBack')) {
                generalInfo = localStorageService.get('confirmationDatalayerCallBack');
                localStorageService.remove('confirmationDatalayerCallBack')
            } else {
                generalInfo = {};
            }
            /* INIT DELETE GA4 MIGRATION*/

            productsObject = DatalayerEcommerceDataUtils.getOrderItemsData(issuedInfoData.order.orderItems, issuedInfoData.order.slices, DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.REDEMPTION, issuedInfoData.passengers);
            pnr = DatalayerEcommerceDataUtils.getPNR(issuedInfoData.order.bookingReferences);

            /* INIT DELETE GA4 MIGRATION*/
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] = productsObject.generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] ? DatalayerEcommerceConstants.DATALAYER_VALUES.YES : DatalayerEcommerceConstants.DATALAYER_VALUES.NO;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.ORDER_ID] = issuedInfoData.order.orderId;
            /* FINISH DELETE GA4 MIGRATION*/
            DatalayerUtilsService.generateBbkiRedemptionDataPayments(productsObject, issuedInfoData);

            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = issuedInfoData.contextMetadata.currencies[0].code;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = {};
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_ID] = pnr;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = issuedInfoData.contextMetadata.country;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = issuedInfoData.order.price.total;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = issuedInfoData.order.price.tax;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = 0;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = productsObject.products;
            datalayerInfo['generalInfo'] = generalInfo;

            return datalayerInfo;
        }
    }
})();