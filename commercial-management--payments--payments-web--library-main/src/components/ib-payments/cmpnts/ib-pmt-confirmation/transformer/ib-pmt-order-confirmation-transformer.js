import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-pmt-order-confirmation-module')
        .factory('PmtOrderConfirmationTransformer', PmtOrderConfirmationTransformer);

    PmtOrderConfirmationTransformer.$inject = ['$rootScope', '$filter', 'PmtUtilsService', 'CurrencyService', 'localStorageService', 'PmtBreakDownUtilsService', '$sce', 'PmtConstants', '$window', 'CommonsSessionStorageService'];
    function PmtOrderConfirmationTransformer ($rootScope, $filter, PmtUtilsService, CurrencyService, localStorageService, PmtBreakDownUtilsService, $sce, PmtConstants, $window, CommonsSessionStorageService) {
        const PMT_UNPAID_ITEM_LIST = 'pmtUnpaidItemList';
        return {
            transformInfoConfirmation: transformInfoConfirmation,
            createFlightBookingMonetate: createFlightBookingMonetate
        };

        ////////////////
        function transformInfoConfirmation (issueOrderData, fareFamilyConditionData) {
            const auxCurrency = issueOrderData.order && issueOrderData.order.price && issueOrderData.order.price.currency ? issueOrderData.order.price.currency : localStorageService.get('commercialInfo').currency.code;
            const currency = CurrencyService.getCurrenciesAsMap(issueOrderData.contextMetadata.currencies)[auxCurrency];
            const confirmationOrderInfo = {
                confirmationInfo: getConfirmationInfo(issueOrderData, fareFamilyConditionData, currency)
            };

            return confirmationOrderInfo;
        }

        function getConfirmationInfo (orderInfo, fareFamilyConditionData, currency) {
            const isShuttleFlow = localStorageService.get('isShuttleFlow'), refundAncillaries = localStorageService.get('summaryCVBounds');
            let usserLogged = localStorageService.get('userLogged'), customerCardSaved = localStorageService.get('customerCardSaved'), foundedAvios = false, i = 0, j = 0, onholdTotalPrice = 0, fareData = localStorageService.get('fareData'), k, fareOffer = [],
                totalPrice = null, flowApp = localStorageService.get('flowApp'), bookingUrlParams = localStorageService.get('bookingUrlParams'), transformedConfirmationInfo, pItemIndex = 0, bookingInfo = localStorageService.get('bookingInfo');
            const selectPrice = flowApp === PmtConstants.APP_TYPES.ONHOLD ? getSelectPrice(orderInfo) : flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ? getSelectPriceUpgradingBids() : orderInfo.order.price.total;
            if (orderInfo.paymentItems) {
                while (flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED && pItemIndex < orderInfo.paymentItems.length) {
                    onholdTotalPrice = orderInfo.paymentItems[pItemIndex].total ? onholdTotalPrice + orderInfo.paymentItems[pItemIndex].total : onholdTotalPrice;
                    pItemIndex++;
                }
            }
            function isBkiNewPayments ( flowApp ) {
                const paymentViewType = localStorageService.get( 'paymentViewType' );
                const newPaymentViewType = paymentViewType === 'NEW' || false;
                if (newPaymentViewType && [PmtConstants.APP_TYPES.BOOKING,PmtConstants.APP_TYPES.ONHOLD].includes(flowApp)) {
                    const header = localStorageService.get('headerModel');
                    localStorageService.set('summaryAncillaries', header.headerModel.shoppingBasket);
                }
            }
            if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                k = 0;
                for (i = 0; i < fareData.offers[0].offerItems.length; i++) {
                    for (j = 0; j < fareData.offers[0].offerItems[i].passengerIds.length; j++) {
                        fareOffer[k] = {};
                        fareOffer[k].detailedTaxes = fareData.offers[0].offerItems[i].detailedTaxes;
                        fareOffer[k].fareCalculation = fareData.offers[0].offerItems[i].fareCalculation;
                        fareOffer[k].fareComponents = fareData.offers[0].offerItems[i].fareComponents;
                        fareOffer[k].offerItemId = fareData.offers[0].offerItems[i].offerItemId;
                        fareOffer[k].price = fareData.offers[0].offerItems[i].price;
                        fareOffer[k].price.fare = fareData.offers[0].reshopOfferInformation?.reshopTicketingInformationWebResponse[i].reissuePrice || 0;
                        fareOffer[k].price.tax = fareData.offers[0].price.tax;
                        fareOffer[k].price.penalty = fareData.offers[0].reshopOfferInformation?.reshopTicketingInformationWebResponse[i].penalty || 0;
                        fareOffer[k].passengerId = fareData.offers[0].offerItems[i].passengerIds[j];
                        k++;
                    }
                }
                for (i = 0; i < orderInfo.order.orderItems.length; i++) {
                    if (fareData.offers[i]) {
                        orderInfo.order.orderItems[i].price = fareData.offers[0].price;
                        if (orderInfo.order.orderItems[i].passengerPrices) {
                            for (j = 0; j < orderInfo.order.orderItems[i].passengerPrices.length; j++) {
                                k = 0;
                                while (k < fareOffer.length) {
                                    if (orderInfo.order.orderItems[i].passengerPrices[j].passengerId === fareOffer[k].passengerId) {
                                        orderInfo.order.orderItems[i].passengerPrices[j].price = fareOffer[k].price;
                                        k = fareOffer.length;
                                    } else {
                                        k++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            isBkiNewPayments(flowApp);
            transformedConfirmationInfo = {
                pnr: localStorageService.get('PNR') ? localStorageService.get('PNR').toUpperCase() : orderInfo.order.bookingReferences[0].reference,
                contactEmail: orderInfo.order.primaryContactInfo.email,
                isOnHold: localStorageService.get('isOnHoldOrder') || (orderInfo.selectedOnHoldOption && orderInfo.selectedOnHoldOption.onHoldOptionId),
                endOrderTime: orderInfo.selectedOnHoldOption ? {...$filter('DateFormatFilter')(orderInfo.selectedOnHoldOption.timeLimits), hoursLeft: orderInfo.selectedOnHoldOption.hours } : null,
                referenceCity: orderInfo.selectedOnHoldOption ? orderInfo.selectedOnHoldOption.referenceCity.description : '',
                onHoldPayment: (orderInfo.selectedOnHoldOption && orderInfo.selectedOnHoldOption.price) ? onholdTotalPrice : null,
                slices: getSlicesInfo(orderInfo, fareFamilyConditionData),
                insurance: getInsurance(orderInfo.order.orderItems),
                carbonFootprint: getCarbonFootprint(orderInfo.order.orderItems, currency),
                relatedContent: getPurchaseMessage(orderInfo.relatedContent),
                warningMessages: getValidWarnings(getWarningsWithUnpaidItems(orderInfo.warnings)),
                summaryInfo: getSummaryInfo(orderInfo, currency, localStorageService.get('commercialInfo'), onholdTotalPrice),
                showSuccesfulCardAlert: usserLogged && customerCardSaved,
                residentInfo: { isActive: false, errors: { haveSomeError: false, allHaveError: false }, city: '', passengers: [] },
                familyInfo: { isActive: false },
                bondsInfo: getModelBondsInfo(orderInfo.order.voucherCompensation, currency)
            };

            totalPrice = calculateTotalPrice(selectPrice, orderInfo.paymentItems, transformedConfirmationInfo.isOnHold, transformedConfirmationInfo.onHoldPayment, flowApp, fareData);
            transformedConfirmationInfo.price = {
                totalPrice: totalPrice,
                formattedTotalPrice: CurrencyService.formatPrice(currency, PmtUtilsService.getConfirmationTotalPrice(totalPrice, orderInfo.paymentItems ? orderInfo.paymentItems : orderInfo.order.orderItems, orderInfo), true),
                textTotalPrice: getTextTotalPrice(flowApp, totalPrice),
                showTotalPrice: getShowTotalPrice(flowApp, totalPrice, refundAncillaries)
            };
            if ($rootScope.isRedemptionFlow) {
                i = 0;
                while (!foundedAvios && i < orderInfo.paymentItems.length) {
                    if (orderInfo.paymentItems[i].type === PmtConstants.DISCOUNT_TYPES.AVIOS_REDEMPTION) {
                        angular.extend(transformedConfirmationInfo.price, { totalPriceAvios: orderInfo.paymentItems[i].aviosRedeemed, formattedTotalPriceAvios: CurrencyService.formatAvios(currency.groupingSeparator, orderInfo.paymentItems[i].aviosRedeemed) });
                        foundedAvios = true;
                    } else if (orderInfo.paymentItems[i].type === PmtConstants.DISCOUNT_TYPES.POINTS_REDEMPTION) {
                        angular.extend(transformedConfirmationInfo.price, { totalPriceOBPoints: orderInfo.paymentItems[i].pointsRedeemed, formattedTotalPriceOBPoints: CurrencyService.formatAvios(currency.groupingSeparator, orderInfo.paymentItems[i].pointsRedeemed) });
                        foundedAvios = true;
                    } else {
                        i++;
                    }
                }
            }
            if ((flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) && refundAncillaries) {
                if (refundAncillaries && refundAncillaries.emds) {
                    transformedConfirmationInfo.summaryInfo.ancillariesRefund = {
                        ancillaries: getModelSummaryAncillarieCV(refundAncillaries),
                        totalRefund: refundAncillaries.refund.totalFormatted
                    };
                }
            }

            if (flowApp === PmtConstants.APP_TYPES.BOOKING) {
                const wineClubInfo = getWineClubInfo();
                if (wineClubInfo) {
                    angular.extend(transformedConfirmationInfo, { wineClub: wineClubInfo });
                }
            }

            if (flowApp === PmtConstants.APP_TYPES.BOOKING || flowApp === PmtConstants.APP_TYPES.ONHOLD || isShuttleFlow) {
                angular.extend(transformedConfirmationInfo, { rentCarInfo: transformRentCarInfo(), bookingHotelsInfo: getBookingHotelsInfo(orderInfo), bobInfo: getBobInfo(), co2Info: getCO2Info(), globickTransfers: getGlobickTransfersInfo(), globickActivities: getGlobickActivitiesInfo() });
            }
            if (bookingUrlParams && bookingUrlParams.largeFamilyType) {
                transformedConfirmationInfo.familyInfo.isActive = getStatusFamily();
            }
            if (bookingUrlParams && bookingUrlParams.resident) {
                transformedConfirmationInfo.residentInfo.isActive = true;
                transformedConfirmationInfo.residentInfo.passengers = getStatusResidentOfPassengers(orderInfo, null);
            } else if (bookingInfo && bookingInfo.order && bookingInfo.order.specialDiscounts) {
                angular.forEach(bookingInfo.order.specialDiscounts, (specialDiscount) => {
                    if (specialDiscount.type === 'RES') {
                        transformedConfirmationInfo.residentInfo.isActive = true;
                        transformedConfirmationInfo.residentInfo.passengers = getStatusResidentOfPassengers(orderInfo, specialDiscount);
                    }
                });
            }
            return transformedConfirmationInfo;

            function getSlicesInfo (issueOrderData, fareFamilyConditionData) {
                let slicesIndex, returnedSlices = [];
                for (slicesIndex = 0; slicesIndex < issueOrderData.order.slices.length; slicesIndex++) {
                    returnedSlices.push({
                        idTrip: issueOrderData.order.slices[slicesIndex].sliceId,
                        baggage: getBaggages(issueOrderData.order.orderItems, issueOrderData.order.slices[slicesIndex].sliceId, issueOrderData.order.slices[slicesIndex].segments[0].cabin.fareFamily, issueOrderData.passengers, fareFamilyConditionData),
                        segments: getSegmentsInfo(issueOrderData.order.slices[slicesIndex].segments, issueOrderData.order.orderItems),
                        bidCabinTypeDescription: getBidCabinTypeDescription(issueOrderData.order.slices[slicesIndex].segments, localStorageService.get('summaryBidTransformed') ? localStorageService.get('summaryBidTransformed').pendingPaymentItems.length > 0 ? localStorageService.get('summaryBidTransformed').pendingPaymentItems : localStorageService.get('summaryBidTransformed').issuedItems.length > 0 ? localStorageService.get('summaryBidTransformed').issuedItems : null : null)
                    });
                }

                return returnedSlices;

                function getBaggages (orderItems, sliceId, fareFamily, passengersInfo, fareFamilyConditionData) {
                    let numerOfPassengers = getNumberOfPassengers(passengersInfo), handBaggageData = getFareFamilyConditionByName(fareFamilyConditionData, 'EQMANO', fareFamily), franchiseBaggageData = getFareFamilyConditionByName(fareFamilyConditionData, 'EQBODEGA', fareFamily), baggagesIndex;
                    const baggages = { handBaggage: ((handBaggageData && handBaggageData.units ? handBaggageData.units : 0) * numerOfPassengers.total), franchiseBaggage: (franchiseBaggageData && franchiseBaggageData.units ? franchiseBaggageData.units : 0) * numerOfPassengers.total };
                    let adviceMessages;
                    for (baggagesIndex = 0; baggagesIndex < orderItems.length; baggagesIndex++) {
                        if (orderItems[baggagesIndex].type === 'baggage') {
                            if (orderItems[baggagesIndex].sliceId === sliceId) {
                                baggages.franchiseBaggage += orderItems[baggagesIndex].amount;
                            }
                            if (orderItems[baggagesIndex].emd === 'PENDING') {
                                adviceMessages = true;
                            }
                        }
                    }
                    return baggages;
                }

                function getNumberOfPassengers (passengersInfo) {
                    const returnedNumberOfPassengers = {
                        total: passengersInfo.length,
                        totalWithoutInfants: getPassengerNumberWithoutInfant(passengersInfo)
                    };
                    return returnedNumberOfPassengers;

                    function getPassengerNumberWithoutInfant (passengersInfo) {
                        let passengersIndex, passengersNumber = 0;
                        for (passengersIndex = 0; passengersIndex < passengersInfo.length; passengersIndex++) {
                            if (passengersInfo[passengersIndex].passengerType === 'ADULT' || passengersInfo[passengersIndex].passengerType === 'CHILD') {
                                passengersNumber++;
                            }
                        }
                        return passengersNumber;
                    }
                }

                function getSegmentsInfo (segments, orderItems) {
                    let segmentsIndex, returnedSegmentsInfo = [], segmentsInfo = {}, flowApp = localStorageService.get('flowApp');
                    for (segmentsIndex = 0; segmentsIndex < segments.length; segmentsIndex++) {
                        segmentsInfo = {
                            idSegment: segments[segmentsIndex].id,
                            departure: segments[segmentsIndex].departure,
                            departureDate: $filter('DateFormatFilter')(segments[segmentsIndex].departureDateTime),
                            arrival: segments[segmentsIndex].arrival,
                            arrivalDate: $filter('DateFormatFilter')(segments[segmentsIndex].arrivalDateTime),
                            flightNumber: segments[segmentsIndex].flight.marketingFlightNumber !== null && segments[segmentsIndex].flight.marketingFlightNumber !== '' ? segments[segmentsIndex].flight.marketingFlightNumber : segments[segmentsIndex].flight.operationalFlightNumber,
                            operationalDisclosure: segments[segmentsIndex].flight.operationalDisclosure,
                            companyCode: segments[segmentsIndex].flight.operationalCarrier.code,
                            operatedBy: segments[segmentsIndex].flight.operationalCarrier.name,
                            cabin: segments[segmentsIndex].cabin.cabinDescription,
                            companyUrl: PmtUtilsService.getCompanyURL(segments[segmentsIndex].flight.operationalDisclosure),
                            seats: getSeats(segments[segmentsIndex].id, orderItems),
                            marketingCarrier: segments[segmentsIndex].flight.marketingCarrier
                        };
                        if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                            angular.extend(segmentsInfo, { passengers: localStorageService.get('sessionUpgradeInfo').ancillariesTrips[0].passengers });
                        }
                        returnedSegmentsInfo.push(segmentsInfo);
                    }
                    return returnedSegmentsInfo;
                }
                function getBidCabinTypeDescription (segments, summaryBidTransformed) {
                    let cabinDescription, segmentsIndex, summaryIndex, bidsIndex;
                    if (summaryBidTransformed) {
                        for (summaryIndex = 0; summaryIndex < summaryBidTransformed.length; summaryIndex++) {
                            if (summaryBidTransformed[summaryIndex] && summaryBidTransformed[summaryIndex].type === 'UPGRADING_BID') {
                                segmentsIndex = 0;
                                while (segmentsIndex < segments.length && !cabinDescription) {
                                    for (bidsIndex = 0; bidsIndex < summaryBidTransformed[summaryIndex].segments.length; bidsIndex++) {
                                        if (segments[segmentsIndex].id === summaryBidTransformed[summaryIndex].segments[bidsIndex].id) {
                                            summaryBidTransformed[summaryIndex].segments[bidsIndex].cabins = $filter('orderBy')(summaryBidTransformed[summaryIndex].segments[bidsIndex].cabins, 'totalCurrentBid', true);
                                            cabinDescription = summaryBidTransformed[summaryIndex].segments[bidsIndex].cabins[0].type;
                                        }
                                    }
                                    segmentsIndex++;
                                }
                            }
                        }
                    }
                    return cabinDescription;
                }

                /**
               * returns far family condition info
               * @return object with fare family condition
               */
                function getFareFamilyConditionByName (fareFamilyConditionsInfo, selectedCondition, selectedFareFamily) {
                    let fareFamilyCondition = null, fareFamilyConditions, fareFamiliesIndex = 0, conditionIndex = 0, foundedFareFamily = false, foundedCondition = false;
                    if (selectedFareFamily) {
                        while (!foundedFareFamily && fareFamiliesIndex < fareFamilyConditionsInfo.length) {
                            if (fareFamilyConditionsInfo[fareFamiliesIndex].commercialCode === selectedFareFamily) {
                                foundedFareFamily = true;
                                fareFamilyConditions = fareFamilyConditionsInfo[fareFamiliesIndex];
                            }
                            fareFamiliesIndex++;
                        }
                    } else {
                        fareFamilyConditions = fareFamilyConditionsInfo ? fareFamilyConditionsInfo[0] : null;
                    }
                    if (fareFamilyConditions && fareFamilyConditions.conditions) {
                        while (!foundedCondition && conditionIndex < fareFamilyConditions.conditions.length) {
                            if (fareFamilyConditions.conditions[conditionIndex].code === selectedCondition) {
                                foundedCondition = true;
                                fareFamilyCondition = fareFamilyConditions.conditions[conditionIndex];
                            }
                            conditionIndex++;
                        }
                    }
                    return fareFamilyCondition;
                }


                function getSeats (idSegment, orderItems) {
                    let seats = '', seatsIndex, adviceMessages;
                    for (seatsIndex = 0; seatsIndex < orderItems.length; seatsIndex++) {
                        if (orderItems[seatsIndex].type === 'seat') {
                            if (orderItems[seatsIndex].segmentId === idSegment) {
                                seats += (seats.length > 0 ? ', ' : '')
                                    + orderItems[seatsIndex].row
                                    + orderItems[seatsIndex].column;
                                if (orderItems[seatsIndex].emd === 'PENDING') {
                                    adviceMessages = true;
                                }
                            }
                        }
                    }
                    return seats;
                }
            }

            function getInsurance (orderItems) {
                let orderItemsIndex, insuranceNumber;
                for (orderItemsIndex = 0; orderItemsIndex < orderItems.length; orderItemsIndex++) {
                    if (orderItems[orderItemsIndex].type === 'insurance' && orderItems[orderItemsIndex].contractNumber) {
                        insuranceNumber = orderItems[orderItemsIndex].contractNumber;
                    }
                }
                return insuranceNumber;
            }

            function getCarbonFootprint (orderItems, currency) {
                let orderItemsIndex, carbonFootprint = {total: null, kilosCo2Equivalent: null, totalFormatted: null, kilosCo2EquivalentFormatted: null};
                for (orderItemsIndex = 0; orderItemsIndex < orderItems.length; orderItemsIndex++) {
                    if ((orderItems[orderItemsIndex].type.toUpperCase() === PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT ||
                         orderItems[orderItemsIndex].type === PmtConstants.ORDER_ITEMS_TYPES.CO2_FOOTPRINT) && orderItems[orderItemsIndex].price && orderItems[orderItemsIndex].orderId) {
                        carbonFootprint.total = orderItems[orderItemsIndex].price.total;
                        carbonFootprint.kilosCo2Equivalent = orderItems[orderItemsIndex].kilosCo2Equivalent;
                        carbonFootprint.totalFormatted = CurrencyService.formatPrice(currency, carbonFootprint.total, true);
                        carbonFootprint.kilosCo2EquivalentFormatted = carbonFootprint.kilosCo2Equivalent.toString().replace('.', ',');
                    }
                }
                return carbonFootprint;
            }

            function getWarningsWithUnpaidItems (warnings) {
                const unpaidItems = getStoredUnpaidItems();
                if (!unpaidItems.length) return warnings;

                const unpaidItemWarnings = unpaidItems.map(getWarningFromUnpaidItem);

                return (warnings || []).concat(unpaidItemWarnings);
            }

            function getStoredUnpaidItems () {
                const unpaidItems = CommonsSessionStorageService.get(PMT_UNPAID_ITEM_LIST);
                if (!unpaidItems) return [];
                return Array.isArray(unpaidItems) ? unpaidItems : [unpaidItems];
            }

            function getWarningFromUnpaidItem (unpaidItem) {
                const type = unpaidItem && unpaidItem.type ? unpaidItem.type : 'UNPAID_ITEM';

                return {
                    code: type,
                    description: $filter('translate')(getUnpaidItemWarningKey(type))
                };
            }

            function getUnpaidItemWarningKey (type) {
                const warningKeys = {
                    INSURANCE: 'PMT_CONFIRMATION_UNPAID_INSURANCE_WARNING',
                    GLOBICK: 'PMT_CONFIRMATION_UNPAID_GLOBICK_WARNING',
                    ASSIST_CARD: 'PMT_CONFIRMATION_UNPAID_ASSISTCARD_WARNING'
                };

                return warningKeys[type] || 'PMT_CONFIRMATION_UNPAID_GENERIC_WARNING';
            }

            function getValidWarnings (warnings) {
                let warningIndex, validWarnings = [];
                if (warnings) {
                    for (warningIndex = 0; warningIndex < warnings.length; warningIndex++) {
                        if (!PmtConstants.PATTERNS.AWS_WARNING_ERRORS.test(warnings[warningIndex].code) && !PmtConstants.PATTERNS.RESIBER_WARNING_ERRORS.test(warnings[warningIndex].code)) {
                            validWarnings.push(warnings[warningIndex]);
                        }
                    }
                }
                return validWarnings;
            }

            function getPurchaseMessage (relatedContent) {
                let i, transformRelatedContent = {};
                if (relatedContent) {
                    for (i = 0; i < relatedContent.length; i++) {
                        if (PmtConstants.PURCHASEMESSAGES.indexOf(relatedContent[i].key) !== -1) {
                            transformRelatedContent[PmtConstants.PURCHASEKEY] = { value: $sce.trustAsHtml(relatedContent[i].value), type: relatedContent[i].key };
                        }
                    }
                }
                return transformRelatedContent;
            }

            function getSummaryInfo (orderInfo, currency, commercialInfo, onholdTotalPrice) {
                const summaryInfo = {
                    trips: PmtBreakDownUtilsService.getTripsBreakdownInfo(orderInfo.order.slices, orderInfo.fareFamilyConditions ? orderInfo.fareFamilyConditions : $rootScope.isRedemptionFlow ? localStorageService.get('fareData').fareFamilyConditions : localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ? localStorageService.get('fareFamilyConditionsConditions') ? localStorageService.get('fareFamilyConditionsConditions') : [] : localStorageService.get('fareFamilyConditionsInfo')),
                    passengers: PmtBreakDownUtilsService.getPaymentsPassengersBreakdownInfo(orderInfo, currency, commercialInfo),
                    orderFees: PmtBreakDownUtilsService.getOrderFees(orderInfo, currency),

                    appliedDiscounts: PmtBreakDownUtilsService.getDisccounts(orderInfo, currency),
                    paymentType: localStorageService.get('paymentType') ? localStorageService.get('paymentType') : orderInfo && orderInfo.paymentMethod ? orderInfo.paymentMethod.type : null,
                    onHoldPayment: (orderInfo.selectedOnHoldOption && orderInfo.selectedOnHoldOption.price) ? CurrencyService.formatPrice(currency, onholdTotalPrice, true) : null,
                    isOnHold: localStorageService.get('isOnHoldOrder') || (orderInfo.selectedOnHoldOption && orderInfo.selectedOnHoldOption.onHoldOptionId),
                    ancillaries: PmtBreakDownUtilsService.getAncillariesBreakdownInfo(updateConfirmedAncillaries(angular.copy(localStorageService.get('summaryAncillaries')), orderInfo), currency)
                };
                if (localStorageService.get('bookingInfo') && localStorageService.get('bookingInfo').onHoldInformation) {
                    summaryInfo.paidDeposit = {
                        price: localStorageService.get('bookingInfo').onHoldInformation.paidDeposit.fare,
                        priceFormat: CurrencyService.formatPrice(currency, localStorageService.get('bookingInfo').onHoldInformation.paidDeposit.fare, true)

                    };
                    summaryInfo.paidDeposit.priceFormat = summaryInfo.paidDeposit.price === 0 ? summaryInfo.paidDeposit.priceFormat : '-' + summaryInfo.paidDeposit.priceFormat;
                }
                if (summaryInfo.onHoldPayment) {
                    summaryInfo.onHoldPayment = orderInfo.selectedOnHoldOption && orderInfo.selectedOnHoldOption.price.total === 0 ? summaryInfo.onHoldPayment : '-' + summaryInfo.onHoldPayment;
                }
                if (localStorageService.get('bookingInfo') && localStorageService.get('bookingInfo').order && localStorageService.get('bookingInfo').order.voucherDisscount && !localStorageService.get('errorIssueService') && localStorageService.get('bookingInfo').order.voucherDisscount.type!==PmtConstants.DISCOUNT_TYPES.PARTNER) {
                    summaryInfo.voucherDisscount = localStorageService.get('bookingInfo').order.voucherDisscount;
                    summaryInfo.voucherDisscount.priceFormat = CurrencyService.formatPrice(currency, localStorageService.get('bookingInfo').order.voucherDisscount.amount, true);
                }
                return summaryInfo;
            }

            function getSelectPriceUpgradingBids () {
                let selectedPrice = 0;
                const items = orderInfo.order.orderItems.filter(items => items.type === PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID);

                items[0].bidSegments.forEach(segment => {
                    if (segment?.cabins?.length > 0) {
                        selectedPrice += (Math.max.apply(Math, segment.cabins.map((cabin) => { return cabin.amountBid && cabin.free === 0 ? cabin.amountBid : 0; }))) * (localStorageService.get('UPG_BIDS_AVIOS') ? 1 : segment.passengers);
                    }
                });
                items[0].bidSegments.forEach(segment => {
                    if (segment.cabinsFinished && segment.cabinsFinished.length > 0) {
                        segment.cabinsFinished.forEach(cabinFinished => {
                            if (cabinFinished.status === 'BLOCKED') {
                                segment?.cabins?.forEach(cabin => {
                                    if (cabin && cabinFinished.amountPax > cabin.amountBid) {
                                        selectedPrice += cabinFinished.amountPax;
                                    }
                                });
                            }
                        });
                    }
                });
                orderInfo.order.price.fare = '';
                orderInfo.order.price.tax = '';
                orderInfo.order.price.total = selectedPrice;

                return selectedPrice;
            }
            /**
            * Return information of car rental returned for service.
            * @return {Array} List of offers for show in confirmation view
            */
            function transformRentCarInfo () {
                let currency;
                const rentCarInfo = { cars: [], pickUpCity: null, currencyCode: null, currencySymbol: null }, ancillariesInfo = localStorageService.get('ancillariesInfo') || null;
                if (ancillariesInfo && ancillariesInfo.ancillaries) {
                    if (ancillariesInfo.currencies && ancillariesInfo.currencies.length > 0) {
                        rentCarInfo.currencySymbol = ancillariesInfo.currencies[0].symbol;
                    }
                    angular.forEach(ancillariesInfo.ancillaries, (ancillarie) => {
                        if (ancillarie.type === PmtConstants.ANCILLARIES_TYPES.VEHICLE_RENTAL && ancillarie.status.code === PmtConstants.GENERAL_STATUS.AVAILABLE) {
                            if (!rentCarInfo.pickUpCity) {
                                rentCarInfo.pickUpCity = ancillarie.pickUp.location.description;
                            }
                            const currencyObj = ancillariesInfo.currencies.find(c => c.code === ancillarie.currency);

                            if (currencyObj) {
                                rentCarInfo.currencyCode = currencyObj.code;
                                rentCarInfo.currencySymbol = currencyObj.symbol;
                            }
                            angular.forEach(ancillarie.providers, (provider) => {
                                angular.forEach(provider.availability, (offer) => {
                                    rentCarInfo.cars.push({ provider: provider.provider, description: offer.model.description, redirectUrl: offer.model.reservationUrl, pictureURI: offer.model.pictureURI, priceDay: CurrencyService.formatPrice(currencyObj, offer.taxedRate.rate.daily, true, false), priceValue: offer.taxedRate.rate.daily });
                                });
                            });
                        }
                    });
                }
                return rentCarInfo;
            }
            /**
            * Return information of booking hotels.
            * @return {Obj} information about order to load external booking iframe
            */
            function getBookingHotelsInfo (confirmationData) {
                let checkInDate = dayjs(new Date()).format('YYYY-MM-DD'), checkOutDate = dayjs(new Date()).format('YYYY-MM-DD');
                if (confirmationData.order.slices[0].segments[confirmationData.order.slices[0].segments.length - 1].arrivalDateTime) {
                    checkInDate = confirmationData.order.slices[0].segments[confirmationData.order.slices[0].segments.length - 1].arrivalDateTime.split(' ')[0];
                }
                if (confirmationData.order.slices[confirmationData.order.slices.length - 1].segments[0].departureDateTime) {
                    checkOutDate = confirmationData.order.slices[confirmationData.order.slices.length - 1].segments[0].departureDateTime.split(' ')[0];
                }

                return {
                    checkInDate: checkInDate,
                    checkOutDate: dayjs(checkOutDate).diff(dayjs(checkInDate), 'days') > 30 ? dayjs(dayjs(checkInDate).add(7, 'days')).format('YYYY-MM-DD') : checkOutDate,
                    destinationCode: confirmationData.order.slices[0].segments[confirmationData.order.slices[0].segments.length - 1].arrival.code
                };
            }
            function getBobInfo () {
                let i = 0, ancillariesInfo = localStorageService.get('ancillariesInfo') || null, bobInfo = {};
                if (ancillariesInfo && ancillariesInfo.ancillaries) {
                    while (i < ancillariesInfo.ancillaries.length && !bobInfo.urlbob) {
                        if (ancillariesInfo.ancillaries[i].type === PmtConstants.ANCILLARIES_TYPES.BOB) {
                            bobInfo.urlbob = ancillariesInfo.ancillaries[i].externalUrl;
                        }
                        i++;
                    }
                }
                return bobInfo;
            }

            function getCO2Info () {
                const ancillary = localStorageService.get('ancillariesCO2') || null;
                const co2Info = {};
                if (ancillary && ancillary.status === PmtConstants.GENERAL_STATUS.AVAILABLE) {
                    co2Info.kilosCo2e = ancillary.kilosCo2Equivalent;
                    co2Info.kilosCo2eFormatted = ancillary.kilosCo2Equivalent ? ancillary.kilosCo2Equivalent.toString().replace('.', ',') : '';
                    co2Info.price = CurrencyService.formatPrice(currency, ancillary.price, true);
                    co2Info.hasCarbonFootprint = true;
                }
                return co2Info;
            }

            function getGlobickTransfersInfo () {
                const headerModel = CommonsSessionStorageService.get('headerModel');
                const globickData = headerModel.headerModel.shoppingBasket.globickTransfers;
                return globickData;
            }

            function getGlobickActivitiesInfo () {
                const headerModel = CommonsSessionStorageService.get('headerModel');
                const globickData = headerModel.headerModel.shoppingBasket.globickActivities;
                return globickData;
            }

            function getWineClubInfo () {
                const ancillariesInfo = localStorageService.get('ancillariesInfo');
                if (ancillariesInfo && ancillariesInfo.ancillaries) {
                    const ancillary = ancillariesInfo.ancillaries.find((ancillary) => {
                        return ancillary.type === PmtConstants.ANCILLARIES_TYPES.WINE_CLUB && ancillary.status.code === PmtConstants.GENERAL_STATUS.AVAILABLE;
                    });
                    if (ancillary) {
                        return { externalUrl: ancillary.externalUrl };
                    }
                }
                return undefined;
            }

            /**
            * update array of ancillaries with the confirmed ancillaries
            * @param {*} savedAncillaries
            * @param {*} confirmedAncillaries
            */
            function updateConfirmedAncillaries (savedAncillaries, confirmedAncillaries) {
                angular.forEach(savedAncillaries, (ancillaryInfo, type) => {
                    switch (type.toUpperCase()) {
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.SEATS:
                                updateConfirmed(type, PmtConstants.ANCILLARIES_TYPES.SEAT);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.BAGGAGES:
                                updateConfirmed(type, PmtConstants.ANCILLARIES_TYPES.BAGGAGE);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.INSURANCE:
                                updateConfirmedInsurance(type);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.SPEQS:
                                updateConfirmed(type, PmtConstants.ANCILLARIES_TYPES.SPEQS);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.FLEXIBILITY:
                                updateConfirmedFlexibility(type);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.UPGRADING_BID:
                                updateConfirmedUpgradingBids(type);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.PRIORITY:
                                updateConfirmedPriorityBoarding(type);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.CO2_FOOTPRINT:
                                updateConfirmedCarbonFootprint(type);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.BUNDLES:
                                updatedConfirmedBundle(type);
                                break;
                            case PmtConstants.ANCILLARIES_TYPES_CONFIRMATION.GLOBICK:
                                updateConfirmed(type, PmtConstants.ANCILLARIES_TYPES.GLOBICK);
                                break;
                    }
                });
                if (confirmedAncillaries && savedAncillaries) {
                    angular.forEach(confirmedAncillaries.warnings, (warning) => {
                        savedAncillaries.message = warning.description;
                    });
                }
                return savedAncillaries;

                function updateConfirmed (type, value) {
                    angular.forEach(confirmedAncillaries.order.orderItems, (ancillarie) => {
                        if (ancillarie.type.toUpperCase() === value) {
                            savedAncillaries[type].updated = true;
                        }
                    });
                }

                function updatedConfirmedBundle (type) {
                    if (savedAncillaries[type].length > 0) {
                        savedAncillaries[type].forEach(bundle => {
                            bundle.updated = true;

                        });
                    }
                }

                function updateConfirmedInsurance (type) {
                    angular.forEach(confirmedAncillaries.paymentItems, (ancillarie) => {
                        if (savedAncillaries[type] && ancillarie.productCode === savedAncillaries[type].offer && (ancillarie.contractNumber !== null && ancillarie.contractNumber !== undefined)) {
                            savedAncillaries[type].total = ancillarie.price.fare;
                            savedAncillaries[type].totalFormatted = CurrencyService.formatPrice(currency, ancillarie.price.fare, true);
                            savedAncillaries[type].updated = true;
                        }
                    });
                }

                function updateConfirmedCarbonFootprint (type) {
                    angular.forEach(confirmedAncillaries.order.orderItems, (ancillarie) => {
                        if (ancillarie.type === PmtConstants.ORDER_ITEMS_TYPES.CO2_FOOTPRINT && ancillarie.orderId) {
                            savedAncillaries[type].updated = true;
                        }
                    });
                }
                function updateConfirmedFlexibility (type) {
                    angular.forEach(confirmedAncillaries.order.orderItems, (ancillarie) => {
                        if (ancillarie.type.toUpperCase() === PmtConstants.ANCILLARIES_TYPES.FLEXIBILITY || ancillarie.type === 'flexibilityOnDemand') {
                            savedAncillaries[type].updated = true;
                        }
                    });
                }

                function updateConfirmedUpgradingBids (type) {
                    if (savedAncillaries[type] !== null) {
                        savedAncillaries[type].updated = true;
                    }
                }

                function updateConfirmedPriorityBoarding (type) {
                    if (savedAncillaries[type] !== null) {
                        savedAncillaries[type].updated = true;
                    }
                }
            }
            /**
             * Return array of passengers with message returned of services
             * @param {*} passengers
             */
            function getStatusResidentOfPassengers (confirmationData, residentDiscount) {
                let i, passenger, counterErrors = 0, arrayPassengers = [];

                angular.forEach(confirmationData.passengers, (pas) => {
                    passenger = {
                        name: pas.externalPersonalInfo ? pas.externalPersonalInfo.name : pas.personalInfo.firstName,
                        surname: pas.externalPersonalInfo ? pas.externalPersonalInfo.firstSurname + ' ' + pas.externalPersonalInfo.lastSurname : pas.personalInfo.firstSurname + ' ' + (pas.personalInfo.lastSurname ? pas.personalInfo.lastSurname : ''),
                        isVerified: true
                    };
                    if (!pas.residenceAccreditationStatus || (pas.residenceAccreditationStatus === PmtConstants.RESIDENT.STATUS.NOT_VERIFIED)) {
                        passenger.isVerified = false;
                        transformedConfirmationInfo.residentInfo.errors.haveSomeError = true;
                        counterErrors++;
                    }
                    arrayPassengers.push(passenger);
                });
                if (counterErrors === arrayPassengers.length) {
                    transformedConfirmationInfo.residentInfo.errors.allHaveError = true;
                }
                transformedConfirmationInfo.residentInfo.city = residentDiscount ? PmtConstants.RESIDENT.CITY[(residentDiscount.discountCode)] : PmtConstants.RESIDENT.CITY[(localStorageService.get('bookingUrlParams').resident)] || '';
                transformedConfirmationInfo.residentInfo.city = $filter('translate')(transformedConfirmationInfo.residentInfo.city);

                return arrayPassengers;
            }
            /**
             * Check if have parameter of familiy en params of url
             * @return BOOL
             */
            function getStatusFamily () {
                return !!(localStorageService.get('bookingUrlParams').largeFamilyType && localStorageService.get('bookingUrlParams').largeFamilyType !== '');
            }

            /**
            * This function select the correct price according to info of bookingInfo when flow is leave OnHold. If have disscount assign the price with disccount.
            * The disccount could lost if the issueServiceError have data.
            * @param {Object} orderInfo response issue service
            * @returns {number} Price selected
            *  */
            function getSelectPrice (orderInfo) {
                return orderInfo?.order?.voucherDiscount?.totalBookingAmountWithDiscountApplied ?? orderInfo?.order?.price?.total;
            }


            /**
             * Return total price
             * * @param {*} totalPrice
             * @param {*} paymentItems
             * @return {*} calculatedTotalPrice
             */
            function calculateTotalPrice (totalPrice, paymentItems, isOnHold, onHoldPayment, flowApp, fareData) {
                let calculatedTotalPrice, bookingInfo = localStorageService.get('bookingInfo'), i, donation = localStorageService.get('donation');
                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                    calculatedTotalPrice = fareData ? fareData.offers[0].price.total : '';
                } else if (bookingInfo && bookingInfo.onHoldInformation && bookingInfo.onHoldInformation.paidDeposit.fare) {
                    calculatedTotalPrice = totalPrice - bookingInfo.onHoldInformation.paidDeposit.fare;
                } else {
                    calculatedTotalPrice = isOnHold ? (totalPrice - onHoldPayment) : totalPrice;
                }
                if (donation && paymentItems && paymentItems.length > 0) {
                    for (i = 0; i < paymentItems.length; i++) {
                        if (paymentItems[i].type === 'DONATION' && !paymentItems[i].donationId) {
                            calculatedTotalPrice = calculatedTotalPrice - donation.option.option;
                        }
                    }
                }
                return calculatedTotalPrice;
            }

            /**
             * This functions return a string with the literal to show in the total price component.
             * When user realize voluntary change flow is possible that user need pay or refund money in bound.
             * @param {String} flowApp indicate actual flow.
             * @param {number} totalPrice indicate the total price payed.
             * @returns {String} literal to show in total summary.
             */

            function getTextTotalPrice (flowApp, totalPrice) {
                let textToShow = $filter('translate')('SUMMARY_TOTAL');
                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                    if (totalPrice >= 0) {
                        textToShow = $filter('translate')('PMT_CONFIRMATION_TOTAL_PAY_POSITIVE');
                    } else {
                        textToShow = $filter('translate')('PMT_CONFIRMATION_TOTAL_REFUND_BOND');
                    }
                } else if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                    textToShow = $filter('translate')('PAYMENTS_MAX_TO_PAY');
                }
                return textToShow;
            }

            /**
             * This functions return a boolean with false if flowapp is voluntary change and there are emds to refund. True in other case.
             * @param {String} flowApp indicate actual flow.
             * @param {number} totalPrice indicate the total price payed.
             * @returns {String} literal to show in total summary.
             */
            function getShowTotalPrice (flowApp, totalPrice, refundAncillaries) {
                let show = true;
                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                    if (totalPrice < 0 && refundAncillaries && refundAncillaries.emds) {
                        show = false;
                    }
                }
                return show;
            }

            /**
             * This functions generate the model neccesary to show bonds-summary-info component. This component is showed when user have
             * bonds for change flight.
             * @param {Object} voucherCompensation information returned by orderChange service about bounds.
             *  * @param {Object} currency currency data.
             * @returns {Object} modelBonds
             *  */
            function getModelBondsInfo (voucherCompensation, currency) {
                let i, modelBonds = { vouchersInfo: [], showExtraInfo: !!voucherCompensation, total: {} };
                if (voucherCompensation && voucherCompensation.vouchers.length > 0) {
                    for (i = 0; i < voucherCompensation.vouchers.length; i++) {
                        modelBonds.vouchersInfo.push({
                            code: voucherCompensation.vouchers[i].name,
                            completeName: getCompleteName(i,voucherCompensation),
                            priceBond: voucherCompensation.vouchers[i].total,
                            formatPriceBond: CurrencyService.formatPrice(currency, voucherCompensation.vouchers[i].total, true)
                        });
                    }
                    modelBonds.total = {
                        totalPrice: voucherCompensation.total,
                        formatTotalPrice: CurrencyService.formatPrice(currency, voucherCompensation.total, true)
                    };

                }
                return modelBonds;

                function getCompleteName (index, voucherCompensation) {
                    let completeName = '';
                    if(voucherCompensation.vouchers[index].externalPersonalInfo) {
                        completeName= voucherCompensation.vouchers[index].externalPersonalInfo.name + ' ' + voucherCompensation.vouchers[index].externalPersonalInfo.firstSurname + ' ' + voucherCompensation.vouchers[index].externalPersonalInfo.lastSurname;
                    }else{
                        completeName = voucherCompensation.vouchers[index].passenger.firstName + ' ' + voucherCompensation.vouchers[index].passenger.firstSurname + ' ' + (voucherCompensation.vouchers[index].passenger.lastSurname ? voucherCompensation.vouchers[index].passenger.lastSurname : '');
                    }
                    return completeName;
                }
            }
        }

        /**
         * Create array/object to call addFlightBooking Monetate API method
         *
         * @param {*} data booking Url parameters data
         * @param {*} passengers data about passengers and total passengers
         * @param {*} confirmation data about selected slices and booking
         * @param {*} fareFamilies list of fareFamilyConditions available
         * @returns {Array} List of needed data to call Monetate method
         */
        function createFlightBookingMonetate (data, passengers, confirmation, fareFamilies) {
            const flightBooking = ['addFlightBooking'];
            const cabinTypes = [];
            let i, x, flightsCount = 0;
            const infoObject = {
                depDate: [dateFormatted(data.originDestinations[0].date)],
                destination: [data.originDestinations[0].destination],
                origin: [data.originDestinations[0].origin],
                travelers: [passengers.passengers]
            };

            for (i = 0; i < confirmation.slices.length; i++) {
                for (x = 0; x < confirmation.slices[i].segments.length; x++) {
                    flightsCount++;
                }
            }

            fareFamilies.forEach((fare) => {
                if (cabinTypes.indexOf(fare.cabinDescription) === -1) {
                    cabinTypes.push(fare.cabinDescription);
                }
            });
            // Optional
            data.adult || data.young ? infoObject.adults = [((data.adult ? data.adult : 0) + (data.young ? data.young : 0))] : null;
            data.infant ? infoObject.infants = [data.infant] : null;
            data.child ? infoObject.minors = [data.child] : null;
            data.senior ? infoObject.seniors = [data.senior] : null;
            data.originDestinations[1] ? infoObject.retDate = [dateFormatted(data.originDestinations[1].date)] : null;
            cabinTypes.length > 0 ? infoObject.serviceClass = cabinTypes : null;


            flightBooking.push(infoObject);
            flightBooking.push(confirmation.pnr);
            flightBooking.push(localStorageService.get('confirmationDatalayerInfo') ? localStorageService.get('confirmationDatalayerInfo').Identifier : localStorageService.get('flightIdentifier') ? localStorageService.get('flightIdentifier') : $window.datalayer_general.Identifier);
            flightBooking.push(flightsCount);
            flightBooking.push(confirmation.price.totalPrice);
            // Optional
            localStorageService.get('avSelectedOffer') && localStorageService.get('avSelectedOffer').price && localStorageService.get('avSelectedOffer').price.currency ? flightBooking.push(localStorageService.get('avSelectedOffer').price.currency) : null;

            function dateFormatted (date) {
                return date.replace(/-/g, '');
            }

            return flightBooking;
        }

        /**
        * This funcions gnerate the ancillaries summary to show in breakDownSummary when user do voluntary change flow.
        * @param {Object} modelRefunBoundCV All data model to summary view.
        * @returns {Array} ancillaries with all data to show in the view.
        *  */
        function getModelSummaryAncillarieCV (modelRefunBoundCV) {
            let ancillaries = [], ancillarieInfo, currency = CurrencyService.getCurrencyObject(localStorageService.get('fareData').contextMetadata.currencies[0]);
            angular.forEach(modelRefunBoundCV.emds.types, (type, key) => {
                if (type.show && key !== 'flexibility_on_demand') {
                    ancillarieInfo = getAncillarieInfo(key, type.flights, currency);
                    ancillaries.push({
                        type: key,
                        title: getTitleAncillarie(key).title,
                        amount: ancillarieInfo.amount,
                        trips: ancillarieInfo.trips,
                        globalItem: false
                    });
                }
                if (type.show && key === 'flexibility_on_demand') {
                    ancillarieInfo = getAncillarieInfo(key, type.flights, currency);
                    ancillaries.push({
                        type: key,
                        title: getTitleAncillarie(key).title,
                        flexibilityItemText: getTitleAncillarie(key).flexibilityItemText,
                        amount: ancillarieInfo.amount,
                        trips: ancillarieInfo.trips,
                        globalItem: true,
                        quantity: type.quantity,
                        unitPriceFormatted: type.unitPriceFormatted,
                        totalPriceFormatted: type.totalPriceFormatted,
                        unitPrice: type.unitPrice,
                        totalPrice: type.totalPrice
                    });
                }

            });
            return ancillaries;
            /**
             * This functions return literal to show in the view, depends of ancillarie type.
             * @param {String} type ancillary type.
             * @returns {Object} with all literal information.
             *  */
            function getTitleAncillarie (type) {
                const titleInfo = {};
                switch (type) {
                        case 'baggage':
                            titleInfo.title = $filter('translate')('PMT_SUMMARY_VOUCHER_REFUND_BAGGAGE_TITLE');
                            titleInfo.titleTotalPrice = $filter('translate')('PMT_SUMMARY_VOUCHER_REFUND_BAGGAGE_TOTAL_TITLE');
                            break;
                        case 'seat':
                            titleInfo.title = $filter('translate')('PMT_SUMMARY_VOUCHER_REFUND_SEAT_TITLE');
                            titleInfo.titleTotalPrice = $filter('translate')('PMT_SUMMARY_VOUCHER_REFUND_SEAT_TOTAL_TITLE');
                            break;
                        case 'flexibility_on_demand':
                            titleInfo.title = $filter('translate')('ANCILLARIES_FLEXIBILITY_TITLE');
                            titleInfo.titleTotalPrice = $filter('translate')('ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT');
                            titleInfo.flexibilityItemText = $filter('translate')('ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE');
                            break;
                        case 'special_equipment':
                            titleInfo.title = $filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT');
                            titleInfo.titleTotalPrice = $filter('translate')('ANCILLARIES_SPEQS_AMOUNT');
                            break;
                        default:
                            titleInfo.title = '';
                            titleInfo.titleTotalPrice = '';
                            break;
                }
                return titleInfo;
            }
            /**
             * Return at objet with all information to show in summary total of each ancillaries.
             * @param {String} key type of ancillarie.
             * @param {Array} flights All data about flight info to generate model of summary.
             * @param {Object} currency All data about the currencie.
             *  */
            function getAncillarieInfo (key, flights, currency) {
                let i, x, totalPrice = 0, amount = {}, items = [], trips = getTripInfo(flights);
                for (i = 0; i < flights.length; i++) {
                    for (x = 0; x < flights[i].tickets.length; x++) {
                        totalPrice += flights[i].tickets[x].totalPrice;
                        trips[i].items.push({
                            quantity: flights[i].tickets[x].quantity,
                            name: 'Ancillarie Name',
                            unitPrice: CurrencyService.formatPrice(currency, (flights[i].tickets[x].unitPrice * -1), true),
                            priceFormatted: flights[i].tickets[x].totalPriceFormatted
                        });
                    }
                }
                amount.totalPrice = totalPrice;
                amount.totalPriceFormatted = CurrencyService.formatPrice(currency, totalPrice, true);
                amount.titleTotalPrice = getTitleAncillarie(key).titleTotalPrice;

                return { amount: amount, trips: trips };
            }
            /**
             *This functions return the trip model to show in the summary view.
             *@param {Array} flights All flight data.
             @returns {Array} with all object neccesary to show information.
             *  */
            function getTripInfo (flights) {
                let i, trips = [];
                for (i = 0; i < flights.length; i++) {
                    trips.push({
                        departure: {
                            city: flights[i].departureCity,
                            code: flights[i].departureCode
                        },
                        arrival: {
                            city: flights[i].arrivalCity,
                            code: flights[i].arrivalCode
                        },
                        items: []
                    });
                }
                return trips;
            }
        }

    }
})();
