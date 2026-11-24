import { isUndefined } from 'angular';

(function () {
    'use strict';

    angular
        .module('ib-datalayer-ecommerce-module')
        .factory('DatalayerEcommerceUtilsService', DatalayerEcommerceUtilsService);

    DatalayerEcommerceUtilsService.$inject = ['DataLayerEcommerceService', 'DatalayerEcommerceConstants', 'localStorageService', 'DatalayerEcommerceDataService', '$window', 'PmtConstants', 'PmtUtilsService', 'DigitalDataService', 'CommonsUtilService', 'DatalayerConstants'];
    function DatalayerEcommerceUtilsService (DataLayerEcommerceService, DatalayerEcommerceConstants, localStorageService, DatalayerEcommerceDataService, $window, PmtConstants, PmtUtilsService, DigitalDataService, CommonsUtilService, DatalayerConstants) {

        return {
            updateDatalayerInfoPayments: updateDatalayerInfoPayments,
            addDataLayerEcommerceInfo: addDataLayerEcommerceInfo,
            updateDatalayerWithAncillaries: updateDatalayerWithAncillaries,
            updateDatalayerCkiInfoPayments: updateDatalayerCkiInfoPayments,
            updateDatalayerVoluntaryChanges: updateDatalayerVoluntaryChanges,
            setDonationsViewItemList: setDonationsViewItemList,
            setDonationsSelectItem: setDonationsSelectItem,
            setDonationsAddToCart: setDonationsAddToCart,
            setAddPaymentInfo: setAddPaymentInfo,
            setAddPurchase: setAddPurchase,
            setCreditCardFeeEcommerce: setCreditCardFeeEcommerce,
            updateAddToCartInfoOnHold: updateAddToCartInfoOnHold
        };

        ////////////////

        /**
         * Updates datalayer for confirmation view
         * @param {Obj} issuedInfo all the information from issued items after payment
         * @returns {Obj} Returns an object with the update of the general and ecommerce datalayer (confirmationDatalayerInfo)
         */
        function updateDatalayerInfoPayments (issuedInfo) {
            let confirmationDatalayerInfo;
            const flowApp = localStorageService.get('flowApp');
            const datalayerInfo = DatalayerEcommerceDataService.getDatalayerData(flowApp, issuedInfo);
            if (datalayerInfo) {
                confirmationDatalayerInfo = {
                    generalInfo: datalayerInfo.generalInfo,
                    ecommerce: {}
                };

                confirmationDatalayerInfo.ecommerce[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = datalayerInfo.currency;
                confirmationDatalayerInfo.ecommerce[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = datalayerInfo.transaction;
                confirmationDatalayerInfo.ecommerce[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = datalayerInfo.products;
            }
            return confirmationDatalayerInfo;
        }

        function updateDatalayerWithAncillaries (ancillTotalPrice) {
            const datalayer_general = $window.datalayer_general = $window.datalayer_general || {}, datalayerUpdate = {}, flowApp = localStorageService.get('flowApp');
            if (datalayer_general[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE] && datalayer_general[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE_WITHOUT_TAX]) {
                if (flowApp === PmtConstants.APP_TYPES.BOOKING || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD || flowApp === PmtConstants.APP_TYPES.ONHOLD) {
                    datalayerUpdate[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE] = (parseFloat(datalayer_general[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE]) + parseFloat(ancillTotalPrice)).toFixed(2);
                    datalayerUpdate[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE_WITHOUT_TAX] = (parseFloat(datalayer_general[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE_WITHOUT_TAX]) + parseFloat(ancillTotalPrice)).toFixed(2);
                } else {
                    datalayerUpdate[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE] = parseFloat(ancillTotalPrice).toFixed(2);
                    datalayerUpdate[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE_WITHOUT_TAX] = parseFloat(ancillTotalPrice).toFixed(2);
                }
            } else if (flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                datalayerUpdate[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE] = parseFloat(ancillTotalPrice).toFixed(2);
            }
            return datalayerUpdate;
        }

        function updateDatalayerVoluntaryChanges (data) {

            const dataLayerModelVC = localStorageService.get('cvDatalayer');
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.BOOKING_CLASS] = getBookingClass(data);
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.STOPOVER_FLIGHT] = getNumberStopOver(data);
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.FLIGHT_TIME] = getDateTimeSegments(data);
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.FARE_NAMES] = getFareName();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.SEGMENT_OPERATORS] = getmarketingCarrier(data);
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.PRICE_PASSANGER] = getTotalPricePassengers(data);
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.TOTAL_PRICE] = data.paymentInfo.price.totalPrice;
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.TOTAL_PRICE_WITHOUT_TAX] = getPaymentsWithoutTaxes();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.CHEAP_FARE] = getBestFare();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.IDENTIFIER] = getIdentifiers();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.CABINES] = getCabinClass();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.COIN] = getCoinInUse();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.IBERIAPLUS_HOLDER] = dataLayerModelVC.EstadoUsuario === 'no_logado' ? 'No' : 'Sí';
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.ORIGIN_DESTINATIONS] = getOriginDestinationAirport();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.SEARCHED_PATH] = getOriginDestinationSearched();
            dataLayerModelVC[DatalayerEcommerceConstants.DATALAYER_VOLUNTARYCHANGES.COUNTRY_PATH] = getOriginDestinationCountry();

            localStorageService.set('cvDatalayer', dataLayerModelVC);

            function getOriginDestinationAirport () {
                const data = localStorageService.get('vcAvailability');
                return data.originDestinations[0].origin + '-' + data.originDestinations[0].destination;
            }

            function getOriginDestinationSearched () {
                const data = localStorageService.get('vcAvailability');
                return data.originDestinations[0].originCity.code + ',' + data.originDestinations[0].destinationCity.code;
            }

            function getOriginDestinationCountry () {
                const data = localStorageService.get('vcAvailability');
                let result = '';
                data.originDestinations.forEach((element, index) => {
                    result = result + element.originCity.countryCode + ',' + element.destinationCity.countryCode;
                    if (data.originDestinations.length > 1 && index < data.originDestinations.length) {
                        result += ',';
                    }
                });
                return result;
            }

            function getCoinInUse () {
                const vcAvailabilityData = localStorageService.get('vcAvailability');
                if (vcAvailabilityData && vcAvailabilityData.contextMetadata && vcAvailabilityData.contextMetadata.currencies[0]) {
                    return vcAvailabilityData.contextMetadata.currencies[0].code;
                }
                return '';
            }

            function getIdentifiers () {
                const data = localStorageService.get('fareData');
                let result = '';
                data.offers.forEach((offer) => {
                    offer.slices.forEach((slice, index) => {
                        slice.segments.forEach((segment, index2) => {
                            if (segment.id) {
                                // remove date
                                result += segment.id.substring(0, segment.id.length - 8);
                            }
                            if (angular.isDefined(offer.slices[index]) && angular.isDefined(offer.slices[index].segments[index2 + 1])) {
                                result += '-';
                            }
                        });
                    });


                });

                return result;

            }

            function getCabinClass () {
                const data = localStorageService.get('fareData');
                const modeFlight = localStorageService.get('modeFlight');
                let result = '';
                data.offers.forEach((offer, index) => {
                    if (modeFlight === 'outbound') {
                        result += 'IDA:' + offer.slices[0].segments[0].cabin.bookingClass;
                    } else if (modeFlight === 'return') {
                        if (angular.isDefined(offer.slices[1])) {
                            result += 'VUELTA:' + offer.slices[1].segments[0].cabin.bookingClass;
                        }
                    } else if (modeFlight === 'twice') {
                        result += 'IDA:' + offer.slices[0].segments[0].cabin.bookingClass + (angular.isDefined(offer.slices[1]) ? '-VUELTA:' + offer.slices[1].segments[0].cabin.bookingClass : '');
                    }
                });

                return result;
            }

            function getPaymentsWithoutTaxes () {
                const data = localStorageService.get('fareData');
                const offerId = localStorageService.get('orderItemsId');
                let priceWithoutTaxes = 0;
                if (data && data.offers && data.offers.length > 0) {
                    data.offers.forEach((offer) => {
                        if (offerId === offer.offerId) {
                            priceWithoutTaxes = offer.price.total - offer.price.fare - offer.price.tax;
                        }
                    });
                }
                return priceWithoutTaxes;
            }

            function getFareName () {
                let result = '';
                const data = localStorageService.get('fareData');
                const offerId = localStorageService.get('orderItemsId');
                const modeFlight = localStorageService.get('modeFlight');

                if (data && data.offers && data.offers.length > 0) {
                    data.offers.forEach((offer) => {
                        if (offerId[0] === offer.offerId) {
                            if (modeFlight === 'outbound') {
                                result = 'IDA:' + offer.slices[0].segments[0].cabin.fareFamily;
                            } else if (modeFlight === 'twice') {
                                result = 'IDA:' + offer.slices[0].segments[0].cabin.fareFamily + '-VUELTA:' + offer.slices[1].segments[0].cabin.fareFamily;
                            } else if (modeFlight === 'return') {
                                result = 'VUELTA:' + offer.slices[1].segments[0].cabin.fareFamily;
                            }
                        }
                    });
                }
                return result;
            }

            function getBestFare () {
                let bestFare = localStorageService.get('bestFare');
                const modeFlight = localStorageService.get('modeFlight');
                if (bestFare) {
                    if (modeFlight === 'outbound') {
                        bestFare.outbound ? bestFare = 'SI' : bestFare = 'NO';
                    } else if (modeFlight === 'return') {
                        bestFare.return ? bestFare = 'SI' : bestFare = 'NO';
                    } else if (modeFlight === 'twice') {
                        bestFare.outbound && bestFare.return ? bestFare = 'SI' : bestFare = 'NO';
                    }
                } else {
                    bestFare = 'NO';
                }
                return bestFare;
            }

            function getBookingClass (data) {
                let result = '';
                if (data.summaryInfo.trips[0].segments[0].cabin === 'Business') {
                    result = 'B';
                } else if (data.summaryInfo.trips[0].segments[0].cabin === 'Premium') {
                    result = 'P';
                } else {
                    result = 'E';
                }
                return result;
            }

            function getNumberStopOver (data) {
                let result = '';
                const modeFlight = localStorageService.get('modeFlight');
                if (modeFlight === 'outbound') {
                    result = 'IDA:' + data.summaryInfo.trips[0].segments.length;
                } else if (modeFlight === 'return') {
                    result = 'VUELTA:' + data.summaryInfo.trips[1].segments.length;
                } else if (modeFlight === 'twice') {
                    result = 'IDA:' + data.summaryInfo.trips[0].segments.length + (angular.isDefined(data.summaryInfo.trips[1]) ? '-VUELTA:' + data.summaryInfo.trips[1].segments.length : '');
                }
                return result;
            }

            function getDateTimeSegments (data) {
                let result = '';
                data.summaryInfo.trips.forEach((trip) => {
                    trip.segments.forEach((segment) => {
                        if (segment && segment.arrivalDate && segment.departureDate) {
                            result = 'IDA:' + segment.arrivalDate.dateTime + '-VUELTA:' + segment.departureDate.dateTime;
                        }
                    });
                });
                return result;
            }

            function getmarketingCarrier (data) {
                let result = '';
                data.summaryInfo.trips.forEach((trip, index) => {
                    trip.segments.forEach((segment, index2) => {
                        result += trip.segments[index2].marketingCarrier.code;
                        if (angular.isDefined(data.summaryInfo.trips[index + 1]) && angular.isDefined(data.summaryInfo.trips[index + 1].segments)) {
                            result += ':';
                        }

                    });
                });


                return result;
            }

            function getTotalPricePassengers (data) {
                let result = '';
                const adult = data.summaryInfo.passengers.generalData.ADULT;
                const child = data.summaryInfo.passengers.generalData.CHILD;
                const senior = data.summaryInfo.passengers.generalData.SENIOR;
                const youth = data.summaryInfo.passengers.generalData.YOUTH;
                const infant = data.summaryInfo.passengers.generalData.INFANT;
                let i = 0;


                if (adult) {
                    for (i = 0; i < adult[0].number; i++) {
                        result += adult[0].totalTax + ':';
                    }
                }
                if (child) {
                    for (i = 0; i < child[0].number; i++) {
                        result += child[0].totalTax + ':';
                    }
                }
                if (senior) {
                    for (i = 0; i < senior[0].number; i++) {
                        result += senior[0].totalTax + ':';
                    }
                }
                if (youth) {
                    for (i = 0; i < youth[0].number; i++) {
                        result += youth[0].totalTax + ':';
                    }
                }
                if (infant) {
                    for (i = 0; i < infant[0].number; i++) {
                        result += infant[0].totalTax + ':';
                    }
                }

                result = result.substr(0, result.length - 1);

                return result;
            }

            return dataLayerModelVC;
        }
        /**
         * Call the addDataLayerEcommerceInfo service to upload the information received in the current datalayer_ecommerce
         * @param {Object} datalayerInfo the information to extend current datalayer ecommerce info
         */
        function addDataLayerEcommerceInfo (datalayerInfo) {
            DataLayerEcommerceService.addDataLayerEcommerceInfo(datalayerInfo);
        }

        /**
        * Updates datalayer for payments and confirmation view
        * @param {Obj} paymentData the payments data
        * @returns {Obj} returns object with payments datalayer_ecommerce info
        */
        function updateDatalayerCkiInfoPayments (paymentData) {
            const confirmationEcommerceInfo = {};
            let fullIssuedPaiment = localStorageService.get('fullIssuedPaiment') || {}, issueOrderData = {};
            if (angular.isDefined(fullIssuedPaiment.data)) {
                fullIssuedPaiment = fullIssuedPaiment.data;
            }
            issueOrderData = {
                price: {
                    total: fullIssuedPaiment.total,
                    tax: 0,
                    shipping: 0
                },
                affiliation: paymentData.generalData.issuerCountry.code,
                orderItems: PmtUtilsService.getElementsByProperty(fullIssuedPaiment.issuedItems, 'type', true),
                bookingInfo: localStorageService.get('bookingInfo')
            };

            confirmationEcommerceInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.CURRENCY] = fullIssuedPaiment.currencies && fullIssuedPaiment.currencies.length > 0 ? fullIssuedPaiment.currencies[0].code : '';
            confirmationEcommerceInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION] = getTransaction();
            confirmationEcommerceInfo[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS] = getProducts();

            function getTransaction () {
                const setTransaction = {};
                setTransaction[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = issueOrderData.bookingInfo.gdsLocator;
                setTransaction[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_AFFIL] = issueOrderData.affiliation;
                setTransaction[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.REVENUE] = issueOrderData.price.total;
                setTransaction[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TRANSACTION_TAX] = issueOrderData.price.tax;
                setTransaction[DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.SHIPPING] = issueOrderData.price.shipping;

                return setTransaction;
            }
            function getProducts () {
                const products = [];
                let j, i, outAndReturn, sIndex, segmentsCode, actualSegmCode, elemPrice, elmAbstract, passengerUnits;
                let upgradSegments = [];
                const baggageObject = [], seatObject = [], upgradeObject = [], insuranceObject = [];
                const flightFullInfo = getFlightInfo(issueOrderData.bookingInfo);
                const flightInfo = flightFullInfo.segmentsInfo;
                const fligtSegments = flightFullInfo.allSegmentsNumber;

                if (issueOrderData.orderItems.BAGGAGE) {
                    for (j = 0; j < issueOrderData.orderItems.BAGGAGE.length; j++) {

                        angular.forEach(issueOrderData.orderItems.BAGGAGE[j].slices, (slice, index) => {
                            actualSegmCode = getSegmentsCode(index);
                            angular.forEach(slice.passengers, (passenger) => {
                                angular.forEach(passenger.pieces, (piece) => {
                                    elemPrice = piece.paidRanges[0].amount / piece.paidRanges[0].units;
                                    elmAbstract = 'baggage_' + actualSegmCode + '_' + passenger.id + '_' + piece.subtype + '_' + elemPrice;
                                    if (!baggageObject[elmAbstract]) {
                                        baggageObject[elmAbstract] = {};
                                        baggageObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = issueOrderData.orderItems.BAGGAGE[j].type;
                                        baggageObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = actualSegmCode;
                                        baggageObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.CHECK_IN;
                                        baggageObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = piece.paidRanges[0].units;
                                        baggageObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = elemPrice;

                                    } else {
                                        baggageObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] += piece.paidRanges[0].units;
                                    }
                                });
                            });
                        });
                    }
                    addProducts(baggageObject);

                }
                if (issueOrderData.orderItems.SEAT) {

                    for (j = 0; j < issueOrderData.orderItems.SEAT.length; j++) {
                        angular.forEach(issueOrderData.orderItems.SEAT[j].segments, (segment, index) => {
                            actualSegmCode = getSegmentsCode(index);
                            angular.forEach(segment.passengers, (passenger) => {
                                elemPrice = passenger.amount;
                                elmAbstract = 'seat_' + actualSegmCode + '_' + passenger.id + '_' + elemPrice;

                                if (!seatObject[elmAbstract]) {
                                    seatObject[elmAbstract] = {};
                                    seatObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = issueOrderData.orderItems.SEAT[0].type;
                                    seatObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = actualSegmCode;
                                    seatObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.CHECK_IN;
                                    seatObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = 1;
                                    seatObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = elemPrice;
                                } else {
                                    seatObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] += 1;
                                }
                            });
                        });
                    }
                    addProducts(seatObject);

                }
                if (issueOrderData.orderItems.INSURANCE) {

                    outAndReturn = fligtSegments.outwardSegments && fligtSegments.returnSegments ? '|' : '';
                    actualSegmCode = (fligtSegments.outwardSegments ? getSegmentsCode(fligtSegments.outwardSegments.length - 1) : '') + outAndReturn + (fligtSegments.returnSegments ? getSegmentsCode(fligtSegments.returnSegments.length - 1) : '');
                    elmAbstract = 'insurance_' + actualSegmCode;
                    passengerUnits = getPassengers();

                    insuranceObject[elmAbstract] = {};
                    insuranceObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = issueOrderData.orderItems.INSURANCE[0].type;
                    insuranceObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = actualSegmCode;
                    insuranceObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.CHECK_IN;
                    insuranceObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = passengerUnits;
                    insuranceObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = issueOrderData.orderItems.INSURANCE[0].subtotal / passengerUnits;

                    addProducts(insuranceObject);
                }
                if (issueOrderData.orderItems.UPGRADING) {
                    passengerUnits = getPassengers();
                    for (j = 0; j < issueOrderData.orderItems.UPGRADING.length; j++) {
                        upgradSegments = [];
                        for (sIndex = 0; sIndex < issueOrderData.orderItems.UPGRADING[j].offerSegmentsClass.length; sIndex++) {
                            upgradSegments.push(sIndex);
                        }
                        actualSegmCode = getSegmentsCode(upgradSegments);
                        elmAbstract = 'upgrad_' + actualSegmCode;
                        if (!upgradeObject[elmAbstract]) {
                            upgradeObject[elmAbstract] = {};
                            upgradeObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_NAME] = issueOrderData.orderItems.UPGRADING[j].type;
                            upgradeObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_ID] = actualSegmCode;
                            upgradeObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_CATEGORY] = DatalayerEcommerceConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.CHECK_IN;
                            upgradeObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_QUANTITY] = passengerUnits;
                            upgradeObject[elmAbstract][DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.PRODUCTS_PRICE] = issueOrderData.orderItems.UPGRADING[j].total;
                        }
                    }

                    addProducts(upgradeObject);
                }

                /**
                 *
                 * @param {Obj} bookingInfo the booking data
                 */
                function getFlightInfo (bookingInfo) {
                    let j;
                    const segmentsInfo = [], allSegmentsNumber = [];
                    const actualBookingInfo = angular.copy(bookingInfo);
                    const segments = actualBookingInfo.outwardSegments.length > 0 || actualBookingInfo.returnSegments.length > 0 ? actualBookingInfo.outwardSegments.concat(actualBookingInfo.returnSegments) : actualBookingInfo.airShuttleSegments;

                    if (actualBookingInfo.outwardSegments.length > 0) {
                        allSegmentsNumber.outwardSegments = [];
                        for (j = 0; j < actualBookingInfo.outwardSegments.length; j++) {
                            allSegmentsNumber.outwardSegments.push(actualBookingInfo.outwardSegments[j].id);
                        }
                    }
                    if (actualBookingInfo.returnSegments.length > 0) {
                        allSegmentsNumber.returnSegments = [];
                        for (j = 0; j < actualBookingInfo.returnSegments.length; j++) {
                            allSegmentsNumber.returnSegments.push(actualBookingInfo.returnSegments[j].id);
                        }
                    }
                    for (j = 0; j < segments.length; j++) {
                        segmentsInfo.push({
                            id: segments[j].id,
                            arivalCode: segments[j].arrival.airport.code,
                            departureCode: segments[j].departure.airport.code
                        });
                    }
                    return { segmentsInfo: segmentsInfo, allSegmentsNumber: allSegmentsNumber };
                }

                function getSegmentsCode (index) {
                    let segmentsCode = '';

                    if (flightInfo?.length > 0) {
                        segmentsCode += (flightInfo[index]?.departureCode) ? flightInfo[index]?.departureCode + '-': '';
                        segmentsCode += (flightInfo[index]?.arivalCode) ? flightInfo[index]?.arivalCode : '';
                    }
                    return segmentsCode;
                }

                function getPassengers () {
                    let passengersAmount = 0, i;
                    for (i = 0; i < issueOrderData.bookingInfo.passengers.length; i++) {
                        if (issueOrderData.bookingInfo.passengers[i].type !== DatalayerEcommerceConstants.DATALAYER_PASSENGER_TYPES.INFANT) {
                            passengersAmount++;
                        }
                    }
                    return passengersAmount;
                }

                function addProducts (productType) {
                    let el;
                    for (el in productType) {
                        products.push(productType[el]);
                    }
                }
                return products;
            }

            addDataLayerEcommerceInfo(confirmationEcommerceInfo);
        }
        function getItemCategory  () {
            const isHMAD = localStorageService.get('isHMAD');
            const isMultipleTrip = localStorageService.get('multiCitySearch');
            const isMetasearch = localStorageService.get('searchFlightType') === 'metasearchFlight';
            if(isMetasearch) return DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.METASEARCH;
            if(isHMAD) return DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.STOPOVER_HMAD;
            if(isMultipleTrip) return DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.MULTIPLE_JOURNEYS;
            return DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT;
        }

        function setDonationsViewItemList (donationInfo) {
            const digital_data_ecommerce = { items: [] };
            const id = CommonsUtilService.getIdItem('all');
            donationInfo?.quantity.forEach(quantity => {
                const item = getItemEcommerce('donation', id, quantity, donationInfo?.partner.toLowerCase(), getItemCategory(), 'all', 'all', donationInfo?.partner.toLowerCase(), 1);
                digital_data_ecommerce.items.push(item);
            });
            if (digital_data_ecommerce.items.length > 0) {
                DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, 'view_item_list');
            }
        }



        function setDonationsSelectItem (donationInfo, option) {
            const digital_data_ecommerce = { items: [] };
            const id = CommonsUtilService.getIdItem('all');
            const item = getItemEcommerce('donation', id, option.option, donationInfo?.partner.toLowerCase(), getItemCategory(), 'all', 'all', donationInfo?.partner.toLowerCase(), 1);
            digital_data_ecommerce.items.push(item);
            if (digital_data_ecommerce.items.length > 0) {
                DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, 'select_item');
            }
        }

        function setDonationsAddToCart (orderFees) {
            const digital_data_ecommerce = { items: [] };
            const id = CommonsUtilService.getIdItem('all');
            orderFees.forEach(orderFee => {
                if(orderFee.code === 'donation') {
                    const item = getItemEcommerce('donation', id, orderFee.totalFee, orderFee.description.toLowerCase(), getItemCategory(), 'all', 'all', orderFee.description.toLowerCase(), 1);
                    digital_data_ecommerce.items.push(item);
                }
            });
            if (digital_data_ecommerce.items.length > 0) {
                DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, 'add_to_cart');
                DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
            }
        }

        function setAddPaymentInfo () {
            const addToCart = localStorageService.get('addToCart');
            if (addToCart) DigitalDataService.addDigitalDataEcommerceEvent(addToCart.ecommerce, 'add_payment_info');
        }

        function setAddPurchase (PNR) {
            const addToCart = localStorageService.get('addToCart');
            const issueOrderInfo = localStorageService.get('issueOrderInfo');
            const flowApp = localStorageService.get('flowApp');
            const typeCard = localStorageService.get('typeCardIberiaPay');
            const creditCardFee = localStorageService.get('creditCardFee');
            const currency = localStorageService.get('currency');
            const datalayerInfo = DatalayerEcommerceDataService.getDatalayerData(flowApp, issueOrderInfo);
            const transactionId = !!datalayerInfo?.transaction?.id ? datalayerInfo?.transaction?.id : PNR;
            const hasRequiredData = addToCart && !isUndefined(datalayerInfo) && !!transactionId;
            if ( hasRequiredData ) {
                addToCart.ecommerce.transaction_id = transactionId;
                addToCart.ecommerce.affiliation = datalayerInfo.transaction.affiliation;
                addToCart.ecommerce.value = datalayerInfo.transaction.revenue;
                addToCart.ecommerce.tax = datalayerInfo.transaction.tax;
                addToCart.ecommerce.shipping = datalayerInfo.transaction.shipping;
                addToCart.ecommerce.currency = datalayerInfo.currency ? datalayerInfo.currency : currency.code;
                typeCard && creditCardFee?.totalFee ? addToCart.ecommerce.items.push(setCreditCardFeeEcommerce(creditCardFee?.totalFee, addToCart, typeCard)) : '';
                DigitalDataService.addDigitalDataEcommerceEvent(addToCart.ecommerce, 'purchase');
            }
        }

        function setCreditCardFeeEcommerce (totalFee, addToCart, typeCard) {
            const id = CommonsUtilService.getIdItem();
            const itemBrandValor = addToCart?.ecommerce?.items[0]?.item_brand.toLowerCase();
            const flowApp = localStorageService.get('flowApp');
            let price = totalFee || 0;
            let category = getItemCategory();
            if (flowApp === PmtConstants.APP_TYPES.ONHOLD) {
                category = DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD;
            }
            const item = getItemEcommerce('credit card fee', id, price, itemBrandValor, category.toLowerCase(), 'all', 'all', typeCard.toLowerCase(), 1);
            return item;
        }

        function getItemEcommerce (name, id, price, brand, category, category2, category3, variant, quantity) {
            const item = {
                item_name: name,
                item_id: id,
                price: price,
                item_brand: brand,
                item_category: category.toLowerCase(),
                item_category2: category2,
                item_category3: category3,
                item_variant: variant,
                quantity: quantity ? quantity : 1
            };

            return item;
        }

        function updateAddToCartInfoOnHold () {
            const cart  = localStorageService.get('addToCart');
            if (cart?.ecommerce?.items?.length > 0) {
                cart.ecommerce.items.forEach((item) => {
                    item.item_category = DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD.toLowerCase();
                });
                localStorageService.set('addToCart', cart);
            }
        }
    }

})();
