(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('MmBDataTransformer', MmBDataTransformer);

    MmBDataTransformer.$inject = ['DatalayerEcommerceConstants', 'localStorageService', 'DatalayerEcommerceDataUtils', 'PmtDatalayerConstants', 'PmtConstants'];
    function MmBDataTransformer(DatalayerEcommerceConstants, localStorageService, DatalayerEcommerceDataUtils, PmtDatalayerConstants, PmtConstants) {

        return {
            generateMmBOnHoldData: generateMmBOnHoldData,
            generateMmBAncillariesData: generateMmBAncillariesData,
            generateMmBVoluntaryChangeData: generateMmBVoluntaryChangeData
        };

        ////////////////

        /**
         * We adapt the recovered data to the needs of the confirmation datalayer in the MmB onHold flow
         * @param {Object} issuedInfoData store the data of the issue
         * @param {Object} confirmationInfo store the confirmation data
         * @param {Object} bookingInfo store the booking data
         * @returns {Object} Returns the processed data for the confirmation datalayer in the MmB onHold flow
         */
        function generateMmBOnHoldData(issuedInfoData, confirmationInfo, bookingInfo) {
            var datalayerInfo = {}, dIndex, generalInfo, productsObject, onHoldDeposit;

            if (localStorageService.get('confirmationDatalayerCallBack')) {
                generalInfo = localStorageService.get('confirmationDatalayerCallBack');
                localStorageService.remove('confirmationDatalayerCallBack')
            } else {
                generalInfo = {};
            }

            onHoldDeposit = bookingInfo.onHoldInformation.paidDeposit ? bookingInfo.onHoldInformation.paidDeposit.fare : 0;

            productsObject = DatalayerEcommerceDataUtils.getOrderItemsData(issuedInfoData.order.orderItems, issuedInfoData.order.slices, DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD_CONFIRMATION, issuedInfoData.passengers);

            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] = productsObject.generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] ? DatalayerEcommerceConstants.DATALAYER_VALUES.YES : DatalayerEcommerceConstants.DATALAYER_VALUES.NO;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.ORDER_ID] = issuedInfoData.order.orderId;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.LARGE_FAMILY] = DatalayerEcommerceConstants.DATALAYER_VALUES.NO;
            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RESIDENT] = DatalayerEcommerceConstants.DATALAYER_VALUES.NO;

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

            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = issuedInfoData.contextMetadata.currencies[0].code;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = {};
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_ID] = !!confirmationInfo.pnr ? confirmationInfo.pnr : confirmationInfo.confirmationInfo?.pnr;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = issuedInfoData.contextMetadata.country;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = parseFloat((issuedInfoData.order.price.total - onHoldDeposit).toFixed(2));
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = parseFloat((issuedInfoData.order.price.tax).toFixed(2));
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = parseFloat((issuedInfoData.order.price.fare - onHoldDeposit).toFixed(2));
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = productsObject.products;
            datalayerInfo['generalInfo'] = generalInfo;

            return datalayerInfo;
        };

        /**
         * We adapt the recovered data to the needs of the confirmation datalayer in the MmB Voluntary Change flow
         * @param {Object} issuedInfoData store the data of the issue
         * @param {Object} confirmationInfo store the confirmation data
         * @param {Object} bookingInfo store the booking data
         * @returns {Object} Returns the processed data for the confirmation datalayer in the MmB Voluntary Change flow
         */
        function generateMmBVoluntaryChangeData (issuedInfoData, confirmationInfo, bookingInfo) {
            let datalayerInfo = {}, generalInfo = datalayer_general || {};

            let currency = '';
            if (issuedInfoData && issuedInfoData.currency && typeof issuedInfoData.currency === 'object') {
                currency = issuedInfoData.currency.code;
            } else if (issuedInfoData && issuedInfoData.contextMetadata?.currencies &&  Array.isArray(issuedInfoData.contextMetadata.currencies) ) {
                currency = issuedInfoData.contextMetadata.currencies[0].code;
            }
            datalayerInfo['generalInfo'] = generalInfo;

            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = currency;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = {};
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_ID] = confirmationInfo.confirmationInfo?.pnr;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = bookingInfo.contextMetadata?.country;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = confirmationInfo.confirmationInfo?.price?.totalPrice;
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = '';
            datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = 0.00;

            return datalayerInfo;
        }

        /**
         *
         * We adapt the recovered data to the needs of the confirmation datalayer in the MmB ancillaries flow
         * @param {Object} issuedInfoData store the data of the issue
         * @param {Object} confirmationInfo store the confirmation data
         * @param {Object} bookingInfo store the booking data
         * @returns {Object} Returns the processed data for the confirmation datalayer in the MmB ancillaries flow
         */
        function generateMmBAncillariesData(issuedInfoData, bookingInfo) {
            var datalayerInfo = {}, generalInfo = datalayer_general || {}, baggagesAuxContainer = [], flightsInfo = localStorageService.get('flightsInfo'), bookingInfo = localStorageService.get('bookingInfo'), products = [];
            let currency = '';
            if (issuedInfoData && issuedInfoData.currency && typeof issuedInfoData.currency === 'object') {
                currency = issuedInfoData.currency.code;
            }else if (issuedInfoData && issuedInfoData.currencies &&  Array.isArray(issuedInfoData.currencies) ) {
                currency = issuedInfoData.currencies[0].code;
            }
            datalayerInfo['generalInfo'] = generalInfo;

            if (issuedInfoData) {
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = currency;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = {};
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_ID] = localStorageService.get('PNR');
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = bookingInfo.contextMetadata.country;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = issuedInfoData.total;
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = '';
                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = 0.00;

                datalayerInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = getInfoProducts(issuedInfoData);
            };

            return datalayerInfo;


            function getInfoProducts(issuedInfoData) {
                var i;

                for (i = 0; i < issuedInfoData.issuedItems.length; i++) {

                    switch (issuedInfoData.issuedItems[i].type) {
                        case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                            generateInsuranceObjects(issuedInfoData.issuedItems[i]);
                            break;

                        case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:
                            generateBaggageObjects(issuedInfoData.issuedItems[i]);
                            break;

                        case PmtConstants.ANCILLARIES_TYPES.SEAT:
                            generateSeatsObjects(issuedInfoData.issuedItems[i]);
                            break;
                    }

                };

                if (baggagesAuxContainer && baggagesAuxContainer.length >= 1) {
                    for (i = 0; i < baggagesAuxContainer.length; i++) {
                        baggagesAuxContainer[i][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = baggagesAuxContainer[i][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] / baggagesAuxContainer[i][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY];
                        products.push(baggagesAuxContainer[i]);
                    }
                }

                return products;
            };

            function generateInsuranceObjects(insuranceIssued) {
                var insuranceObject = {};

                insuranceObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = insuranceIssued.type;
                insuranceObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.MMBANC;
                if(flightsInfo){
                    insuranceObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = getInsuranceId();
                }

                insuranceObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = getInsuranceQuantityAndPrice(insuranceIssued, insuranceObject);

                products.push(insuranceObject);
            }

            function generateSeatsObjects(seatsIssued) {
                var seatObject, segmentSeatsPrice, i, f;

                for (i = 0; i < seatsIssued.segments.length; i++) {
                    seatObject = {};

                    seatObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = seatsIssued.type.toLowerCase();
                    seatObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.MMBANC;
                    if(flightsInfo){
                        seatObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = getSeatIdBySegmentID(seatsIssued.segments[i].id);
                    }

                    seatObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = seatsIssued.segments[i].passengers.length;

                    segmentSeatsPrice = 0;
                    for (f = 0; f < seatsIssued.segments[i].passengers.length; f++) {
                        segmentSeatsPrice = segmentSeatsPrice + seatsIssued.segments[i].passengers[f].amount;
                    }

                    seatObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = segmentSeatsPrice / seatObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY];

                    products.push(seatObject);
                }
            }

            function generateBaggageObjects(baggageIssued) {
                var baggageObject, i, isOnArray = false, alreadyPushed = true;
                baggageObject = {};

                baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = baggageIssued.type.toLowerCase();
                baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.MMBANC;
                baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = getBaggagePrice(baggageIssued);
                baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = baggageIssued.slices && (baggageIssued.slices[0].id !== undefined || baggageIssued.slices[0].id !== null) ? baggageIssued.slices[0].id.substring(0,3) + '-' + baggageIssued.slices[0].id.substring(3,6) : '';
                baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = getBaggageQuantity(baggageIssued);

                if (baggagesAuxContainer && baggagesAuxContainer.length >= 1) {
                    for (i = 0; i < baggagesAuxContainer.length; i++) {
                        if (baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] === baggagesAuxContainer[i][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID]) {
                            isOnArray = true;
                            alreadyPushed = true;
                            baggagesAuxContainer[i][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] += baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY];
                            baggagesAuxContainer[i][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] += baggageObject[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE];
                        } else {
                            isOnArray = false;
                            alreadyPushed = false;
                        }
                    }
                } else {
                    baggagesAuxContainer.push(baggageObject);
                    alreadyPushed = true;
                }

                if (!isOnArray && !alreadyPushed) {
                    baggagesAuxContainer.push(baggageObject);
                }
            }

            function getBaggagePrice(baggageIssued) {
                let price = 0;
                baggageIssued.slices.forEach((slice) => {
                    slice.passengers.forEach((passenger) => {
                        passenger.pieces.forEach((piece) => {
                            piece.paidRanges.forEach((paidRange) => {
                                price += paidRange.amount;
                            });
                        });
                    });
                });
                return price;
            }

            function getBaggageQuantity(baggageIssued) {
                let quantity = 0;
                baggageIssued.slices.forEach((slice) => {
                    slice.passengers.forEach((passenger) => {
                        passenger.pieces.forEach((piece) => {
                            piece.paidRanges.forEach((paidRange) => {
                                quantity += paidRange.units;
                            });
                        });
                    });
                });
                return quantity;
            }

            function getSeatIdBySegmentID(productSegmentId) {
                var productSegmentCode, i;
                for (i = 0; i < flightsInfo.length; i++) {
                    if (productSegmentId === flightsInfo[i].segmentId) {
                        productSegmentCode = flightsInfo[i].departure.code + '-' + flightsInfo[i].arrival.code;
                    }
                }
                return productSegmentCode;
            }

            function getBaggageID(baggageSlices) {
                var baggageID = null, i, j, flightsInfoAuxContainer = [];

                if(flightsInfo){
                    for (j = 0; j < flightsInfo.length; j++) {
                        flightsInfoAuxContainer[j] = {};
                        flightsInfoAuxContainer[j]['departureCode'] = flightsInfo[j].departure.code;
                        flightsInfoAuxContainer[j]['arrivalCode'] = flightsInfo[j].arrival.code;
                        flightsInfoAuxContainer[j]['segmentId'] = flightsInfo[j].segmentId;
                    }
                }
                for (i = 0; i < baggageSlices.length; i++) {
                    for (j = 0; j < flightsInfoAuxContainer.length; j++) {
                        if (baggageSlices[i].id === flightsInfoAuxContainer[j].sliceId) {
                            if (baggageID === null) {
                                baggageID = flightsInfoAuxContainer[j].departureCode + '-' + flightsInfoAuxContainer[j].arrivalCode;
                            } else {
                                baggageID = baggageID + '-' + flightsInfoAuxContainer[j].arrivalCode;
                            }
                        }
                    }
                }

                return baggageID;
            }

            function getInsuranceId() {
                var insuranceID, i;

                for (i = 0; i < flightsInfo.length; i++) {
                    if (i === 0) {
                        insuranceID = flightsInfo[i].departure.code + '-' + flightsInfo[i].arrival.code;
                    } else {
                        insuranceID = insuranceID + '|' + flightsInfo[i].departure.code + '-' + flightsInfo[i].arrival.code;
                    }
                }

                return insuranceID;
            }

            function getInsuranceQuantityAndPrice(issuedInsurance, objectContainer) {
                var insuranceQuantity = 0, i;

                for (i = 0; i < bookingInfo.passengers.length; i++) {
                    if (bookingInfo.passengers[i].passengerType !== DatalayerEcommerceConstants.PASSENGERS_TYPES.INFANT) {
                        insuranceQuantity++;
                    }
                }

                objectContainer[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = issuedInsurance.subtotal / insuranceQuantity;

                return insuranceQuantity;
            }
        };
    }
})();
