(function () {
    'use strict';

    angular
        .module('ib-datalayer-data-service-module')
        .factory('DatalayerEcommerceDataUtils', DatalayerEcommerceDataUtils);

    DatalayerEcommerceDataUtils.$inject = ['DatalayerEcommerceConstants', 'localStorageService'];
    function DatalayerEcommerceDataUtils(DatalayerEcommerceConstants, localStorageService) {

        return {
            getOrderItemsData: getOrderItemsData,
            getPNR: getPNR
        };

        ////////////////

        /**
         * Retrieve the object of ordered items 
         * @param {Object} orderItems the list of purchased order items
         * @param {Object} slices the list of all flight slices
         * @param {String} category payment category (direct, onhold...)
         * @returns {Array<Object>} Returns an array with ordered items as products and special needs within generalInfo
         */
        function getOrderItemsData(orderItems, slices, category, passengers) {
            var products = [], el, prodCount = [], iIndex, allIsosCode, isoIndex, i, orderItemId = '', orderItemPrice, orderItemKey, orderItemAmount, generalInfo = {}, flightInfo, passUnits = getPaxNumber(passengers);

            generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] = false;

            for (iIndex = 0; iIndex < orderItems.length; iIndex++) {

                if (orderItems[iIndex].type === DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TYPE_SNEEDS) {
                    if (orderItems[iIndex].serviceCode === DatalayerEcommerceConstants.SPECIAL_NEEDS_CODE.SVAN) {
                        generalInfo[DatalayerEcommerceConstants.DATALAYER_VALUES.RED_MOBILITY_PAX] = true;
                    }
                } else {

                    allIsosCode = '';

                    if (orderItems[iIndex].sliceIds) {
                        for (isoIndex = 0; isoIndex < orderItems[iIndex].sliceIds.length; isoIndex++) {
                            if (isoIndex > 0) {
                                allIsosCode += '|';
                            }
                            allIsosCode += getSliceIsoCodes(slices, orderItems[iIndex].sliceIds[isoIndex]);
                        }
                    } else if (orderItems[iIndex].segmentId) {
                        allIsosCode += getSegmentIsoCodes(slices, orderItems[iIndex].segmentId);
                    } else {
                        if (orderItems[iIndex].type === DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.DONATION_ITEM_TYPE) {
                            allIsosCode += getWholeFlightIsoCode(slices);
                        } else {
                            allIsosCode += getSliceIsoCodes(slices, orderItems[iIndex].sliceId);
                        }
                    }

                    orderItemId = allIsosCode;
                    orderItemPrice = orderItems[iIndex].type === DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TYPE_FLIGHT ? orderItems[iIndex].price.total / passUnits : orderItems[iIndex].price.total;
                    orderItemAmount = orderItems[iIndex].type === DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TYPE_FLIGHT ? passUnits : orderItems[iIndex].amount || 1;
                    orderItemKey = orderItems[iIndex].type + '_' + orderItemId + '_' + orderItemPrice;

                    if (!orderItems[iIndex].status || orderItems[iIndex].status === DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.ITEM_VALID) {
                        if (prodCount[orderItemKey]) {
                            prodCount[orderItemKey].quantity += orderItemAmount;
                        } else {
                            prodCount[orderItemKey] = {};
                            prodCount[orderItemKey][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = orderItems[iIndex].type;
                            prodCount[orderItemKey][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = orderItemId;
                            prodCount[orderItemKey][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = category;
                            prodCount[orderItemKey][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = orderItemAmount;
                            prodCount[orderItemKey][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = parseFloat(orderItemPrice.toFixed(2));
                        }
                    }
                }
            }
            for (el in prodCount) {
                products.push(prodCount[el]);
            }

            return { 'products': products, 'generalInfo': generalInfo };
        }


        /**
         * Get the non-infant passengers number
         * @param {Array<Object>} passengers the passengers array list
         * @returns {Number} Returns the number of non-infant passengers
         */
        function getPaxNumber(passengers) {
            var p, passUnits = 0;

            for (p = 0; p < passengers.length; p++) {
                if (passengers[p].passengerType !== DatalayerEcommerceConstants.PASSENGERS_TYPES.INFANT) {
                    passUnits += 1;
                }
            }
            return passUnits;
        }

        /**
         * Get de PNR string
         * @param {*} bookingReferences The list of providers with their references
         * @returns {String} Returns the pnr string
         */
        function getPNR(bookingReferences) {
            var p, pnrData;
            if (bookingReferences.length > 1) {
                for (p = 0; p < bookingReferences.length; p++) {
                    if (bookingReferences[p].provider === 'IB') {
                        pnrData = bookingReferences[p].reference;
                    }
                }
            } else {
                pnrData = bookingReferences[0].reference;
            }

            return pnrData;
        }
        /**
         * Retrieve the iata codes of the given ordered item
         * @param {Object} slices the list of all flight slices
         * @param {String} elemId the slice ID of the given ordered item
         * @returns {String} Returns the concatenated iata codes of the given ordered item
         */

        function getSliceIsoCodes(slices, elemId) {
            var sliceFounded = false, sliceIndex = 0, segmentIndex, elementInfo = '';
            while (!sliceFounded && sliceIndex < slices.length) {
                if (slices[sliceIndex].sliceId === elemId) {
                    for (segmentIndex = 0; segmentIndex < slices[sliceIndex].segments.length; segmentIndex++) {
                        if (elementInfo.length === 0) {
                            elementInfo += slices[sliceIndex].segments[segmentIndex].departure.code + '-' + slices[sliceIndex].segments[segmentIndex].arrival.code;
                        } else {
                            elementInfo += '-' + slices[sliceIndex].segments[segmentIndex].arrival.code;
                        }
                    }
                    sliceFounded = true;
                }
                sliceIndex++;
            }
            return elementInfo;
        }

        function getSegmentIsoCodes(slices, segmentId) {
            var sliceIndex = 0, segmentFounded = false, segmentIndex, elementInfo = '';
            while (!segmentFounded && sliceIndex < slices.length) {
                segmentIndex = 0;
                while (!segmentFounded && segmentIndex < slices[sliceIndex].segments.length) {
                    if (slices[sliceIndex].segments[segmentIndex].id === segmentId) {
                        segmentFounded = true;
                        if (elementInfo.length === 0) {
                            elementInfo += slices[sliceIndex].segments[segmentIndex].departure.code + '-' + slices[sliceIndex].segments[segmentIndex].arrival.code;
                        } else {
                            elementInfo += '-' + slices[sliceIndex].segments[segmentIndex].arrival.code;
                        }
                    }
                    segmentIndex++;
                }
                sliceIndex++;
            }
            return elementInfo;
        }

        function getWholeFlightIsoCode(slices) {
            var i, j, flightIsoCode = '', lastSliceIndex;

            for (i = 0; i < slices.length; i++) {
                if (i >= 1) {
                    flightIsoCode += '|';
                }
                for (j = 0; j < slices[i].segments.length; j++) {
                    if (j > 0) {
                        flightIsoCode += '-' + slices[i].segments[j].arrival.code;
                    } else {
                        flightIsoCode += slices[i].segments[j].departure.code + '-' + slices[i].segments[j].arrival.code;
                    }
                }
            }

            return flightIsoCode;
        }
    }
})();