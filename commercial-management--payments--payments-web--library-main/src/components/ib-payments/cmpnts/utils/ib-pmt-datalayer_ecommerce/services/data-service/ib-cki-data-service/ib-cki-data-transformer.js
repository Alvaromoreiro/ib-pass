(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('CkiDataTransformer', CkiDataTransformer);

    CkiDataTransformer.$inject = ['DatalayerEcommerceConstants', 'localStorageService', 'DatalayerEcommerceDataUtils'];
    function CkiDataTransformer (DatalayerEcommerceConstants, localStorageService, DatalayerEcommerceDataUtils) {

        return {
            generateCkiData: generateCkiData
        };

        ////////////////

        /**
         * We adapt the recovered data to the needs of the confirmation datalayer in the CKI flow
         * @param {Object} issuedInfoData store the data of the issue
         * @param {Object} confirmationInfo store the confirmation data
         * @param {Object} bookingInfo store the booking data
         * @returns {Object} Returns the processed data for the confirmation datalayer in the CKI flow
         */
        function generateCkiData (issuedInfoData, confirmationInfo, bookingInfo) {
            const datalayerInfo = {}, pmtModelInfo = localStorageService.get('pmtModelInfo'), generalPNR = localStorageService.get('PNR');
            let dIndex, generalInfo, productsObject;

            if (localStorageService.get('confirmationDatalayerCallBack')) {
                generalInfo = localStorageService.get('confirmationDatalayerCallBack');
                localStorageService.remove('confirmationDatalayerCallBack');
            } else {
                generalInfo = {};
            }

            if (issuedInfoData?.order?.orderItems && issuedInfoData?.order?.slices && issuedInfoData?.passengers) {
                productsObject = DatalayerEcommerceDataUtils.getOrderItemsData(issuedInfoData.order.orderItems, issuedInfoData.order.slices, DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD, issuedInfoData.passengers);
            }

            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] = productsObject?.generalInfo && productsObject.generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] ? DatalayerEcommerceConstants.DATALAYER_VALUES.YES : DatalayerEcommerceConstants.DATALAYER_VALUES.NO;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.ORDER_ID] = issuedInfoData?.order?.orderId ? issuedInfoData.order.orderId : '';
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.LARGE_FAMILY] = DatalayerEcommerceConstants.DATALAYER_VALUES.NO;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RESIDENT] = DatalayerEcommerceConstants.DATALAYER_VALUES.NO;

            if (bookingInfo?.order?.specialDiscounts) {
                for (dIndex = 0; dIndex < bookingInfo.order.specialDiscounts.length; dIndex++) {
                    if (bookingInfo.order.specialDiscounts[dIndex].type === DatalayerEcommerceConstants.DATALAYER_VALUES.SPECIAL_DISCOUNTS.RESIDENT) {
                        generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RESIDENT] = bookingInfo.order.specialDiscounts[dIndex].discountCode;
                    }
                    if (bookingInfo.order.specialDiscounts[dIndex].type === DatalayerEcommerceConstants.DATALAYER_VALUES.SPECIAL_DISCOUNTS.LARGE_FAMILY) {
                        if (bookingInfo.order.specialDiscounts[dIndex].discountType === DatalayerEcommerceConstants.DATALAYER_VALUES.SPECIAL_DISCOUNTS.SPECIAL) {
                            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.LARGE_FAMILY] = DatalayerEcommerceConstants.DATALAYER_VALUES.SPECIAL_DISCOUNTS.LARGE_FAMILY_SPECIAL;
                        } else {
                            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.LARGE_FAMILY] = DatalayerEcommerceConstants.DATALAYER_VALUES.SPECIAL_DISCOUNTS.LARGE_FAMILY_NORMAL;
                        }
                    }
                }
            }

            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = (Array.isArray(issuedInfoData?.currencies) && issuedInfoData.currencies.length > 0 && issuedInfoData.currencies[0].code) ? issuedInfoData.currencies[0].code : '';
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = {};
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_ID] = generalPNR ? generalPNR : '';
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = pmtModelInfo?.issueCountry ? pmtModelInfo.issueCountry : '';
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = issuedInfoData?.total ? issuedInfoData.total : 0;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = issuedInfoData?.order?.price?.tax ? issuedInfoData.order.price.tax : 0;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = issuedInfoData?.order?.price?.fare ? issuedInfoData.order.price.fare : 0;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = productsObject?.products ? productsObject.products : '';
            datalayerInfo['generalInfo'] = generalInfo;

            return datalayerInfo;
        }
    }
})();