(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('PmtBreakDownUtilsService', PmtBreakDownUtilsService);

    PmtBreakDownUtilsService.$inject = ['$rootScope', '$filter', '$timeout', 'PmtConstants', 'CurrencyService', 'localStorageService', 'CommonsSessionStorageService', 'IbPmtBreakdownUtilsPetsService'];
    function PmtBreakDownUtilsService ($rootScope, $filter, $timeout, PmtConstants, CurrencyService, localStorageService, CommonsSessionStorageService, IbPmtBreakdownUtilsPetsService) {
        return {
            getTripsBreakdownInfo: getTripsBreakdownInfo,
            getPaymentsPassengersBreakdownInfo: getPaymentsPassengersBreakdownInfo,
            getOrderFees: getOrderFees,
            getDisccounts: getDisccounts,
            getAncillariesBreakdownInfo: getAncillariesBreakdownInfo,
            transformBreakdownInfo: transformBreakdownInfo,
            transformBreakdownUpgradingBid: transformBreakdownUpgradingBid
        };

        ////////////////

        /**
        * Make an Object with trips info data to show in Passengers, Payments & confirmation summary
        * @param {Array} serviceData,currency -data and transformed currency from service
        * @returns {Object} - Return an Object with trip info data to show in Passengers,Payments & confirmation summary
        */
        function getTripsBreakdownInfo (serviceData, fareFamilyConditionsData) {
            let i, j;
            const summaryInfoTrips = [];
            if (serviceData) {
                for (i = 0; i < serviceData.length; i++) {
                    summaryInfoTrips[i] = {
                        idTrip: serviceData[i].sliceId,
                        stopsNumber: serviceData[i].stopsNumber,
                        fare: createFareDetails(serviceData[i].segments, fareFamilyConditionsData),
                        segments: []
                    };
                    for (j = 0; j < serviceData[i].segments.length; j++) {
                        summaryInfoTrips[i].segments[j] = {
                            idSegment: serviceData[i].segments[j].id,
                            departure: serviceData[i].segments[j].departure,
                            departureDate: $filter('DateFormatFilter')(serviceData[i].segments[j].departureDateTime),
                            //'departureDate': $filter('DateFormatFilter')(serviceData[i].departureDateTime),
                            arrival: serviceData[i].segments[j].arrival,
                            arrivalDate: createArrivalDateTime(i, j, serviceData),
                            //'arrivalDate': $filter('DateFormatFilter')(serviceData[i].arrivalDateTime),
                            flightNumber: serviceData[i].segments[j].flight.marketingFlightNumber !== null ? serviceData[i].segments[j].flight.marketingFlightNumber : serviceData[i].segments[j].flight.operationalFlightNumber,
                            operatedBy: serviceData[i].segments[j].flight.operationalCarrier.name,
                            aircraftType: serviceData[i].segments[j].flight.aircraft ? serviceData[i].segments[j].flight.aircraft.description : '',
                            duration: $filter('DurationFormatFilter')(serviceData[i].segments[j].duration),
                            waitingTime: serviceData[i].segments[j].waitingTime,
                            waitingParsedTime: $filter('DurationFormatFilter')(serviceData[i].segments[j].waitingTime),
                            cabin: serviceData[i].segments[j].cabin.cabinDescription ? serviceData[i].segments[j].cabin.cabinDescription : serviceData[i].segments[j].cabin.description,
                            operationalDisclosure: serviceData[i].segments[j].flight.operationalDisclosure,
                            marketingCarrier: serviceData[i].segments[j].flight.marketingCarrier
                        };
                    }
                }
            }
            return summaryInfoTrips;

            function createArrivalDateTime (sliceId, segmentId, serviceData) {
                const data = localStorageService.get('createOrderData');
                if (localStorageService.get('flowApp') === 'BBKI' && data && data.order && data.order.slices && data.order.slices[sliceId] && data.order.slices[sliceId].segments)
                    return $filter('DateFormatFilter')(localStorageService.get('createOrderData').order.slices[sliceId].segments[segmentId].arrivalDateTime);
                else
                    return $filter('DateFormatFilter')(serviceData[sliceId].arrivalDateTime);
            }

            function createFareDetails (segments, fareFamilyConditionsData) {
                let j = 0;
                const fareFamilyConditions = fareFamilyConditionsData, fares = [];
                for (j = 0; j < segments.length; j++) {
                    fares.push(matchFare(segments[j].cabin.fareFamily, fareFamilyConditions));
                }
                return fares;

                function createCompleteFareDetails (fareConditions, change) {
                    return {
                        name: fareConditions.name,
                        message: change ? fareConditions.text : (fareConditions.extendedInfo && fareConditions.extendedInfo.message) ? fareConditions.extendedInfo.message : fareConditions.text,
                        text: fareConditions.text ? fareConditions.text : ''
                    };
                }

                function matchFare (fareFamilyType, fareFamilyConditionsData) {
                    let fIndex = 0, fFound = false, indexConditions;
                    const fareInfo = { fareDetails: {} };
                    const fareFamilyConditions = fareFamilyConditionsData;
                    while (!fFound && fIndex < fareFamilyConditions.length) {
                        if (fareFamilyConditions[fIndex].commercialCode === fareFamilyType) {
                            fFound = true;
                            fareInfo.name = fareFamilyConditions[fIndex].commercialName;
                            fareInfo.cabin = fareFamilyConditions[fIndex].cabinDescription;
                            for (indexConditions = 0; indexConditions < fareFamilyConditions[fIndex].conditions.length; indexConditions++) {
                                switch (fareFamilyConditions[fIndex].conditions[indexConditions].code) {
                                        case PmtConstants.CONDITION_TYPES.CHANGE:
                                            fareInfo.fareDetails[fareFamilyConditions[fIndex].conditions[indexConditions].code] = createCompleteFareDetails(fareFamilyConditions[fIndex].conditions[indexConditions], true);
                                            break;
                                        case PmtConstants.CONDITION_TYPES.REFUND:
                                            fareInfo.fareDetails[fareFamilyConditions[fIndex].conditions[indexConditions].code] = createCompleteFareDetails(fareFamilyConditions[fIndex].conditions[indexConditions], true);
                                            break;
                                        default: fareInfo.fareDetails[fareFamilyConditions[fIndex].conditions[indexConditions].code] = createCompleteFareDetails(fareFamilyConditions[fIndex].conditions[indexConditions], false);
                                }
                            }
                        }
                        fIndex++;
                    }
                    return fareInfo;
                }
            }
        }

        /**
        * Make an Object with passengers info data to show in Passengers, Payments & confirmation summary
        * @param {Array} serviceData,currency -data and transformed currency from service
        * @returns {Object} - Return an Object with passengers info data to show in Passengers,Payments & confirmation summary
        */
        function getPaymentsPassengersBreakdownInfo (serviceData, currency, passengersSpecialNeeds, commercialData) {
            let pasInfo, pasType, pasIndex, samePas, orderItemsIndex, passengerPricesIndex, generalDataIndex, passengersIndex, totalPassenger = 0;
            const returnedPassengersInfo = { personalData: [], generalData: {} };
            if (serviceData.order.discountsApplied && serviceData.order.discountsApplied.originalOrderItems && serviceData.order.discountsApplied.originalOrderItems.length > 0) {
                for (orderItemsIndex = 0; orderItemsIndex < serviceData.order.discountsApplied.originalOrderItems.length; orderItemsIndex++) {
                    if (serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].type === PmtConstants.ORDER_ITEMS_TYPES.FLIGHT) {
                        for (passengerPricesIndex = 0; passengerPricesIndex < serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices.length; passengerPricesIndex++) {
                            pasInfo = {
                                number: 1,
                                fareCash: serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare : 0,
                                totalTax: serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.tax : 0,
                                currency: currency,
                                breakdownTaxes: getFormatedTaxes(serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].taxes, currency, commercialData)
                            };
                            if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                                pasInfo.penalty = serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty : 0;
                                pasInfo.diferencePrice = serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare + serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty : 0;
                                pasInfo.itemDiferencePrice = pasInfo.diferencePrice;
                            }
                            if ($rootScope.isRedemptionFlow && serviceData.order) angular.extend(pasInfo, { fareAvios: parseInt(serviceData.order.redemptionOption ? serviceData.order.redemptionOption.totalPoints.fare : localStorageService.get('paymentsInfo').price.totalPriceAvios) / parseInt(serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices.length) });
                            if ($rootScope.isRedemptionFlow && serviceData.order) angular.extend(pasInfo, { fareOBPoints: parseInt(serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].totalPoints ? serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].totalPoints : localStorageService.get('paymentsInfo').price.totalPriceOBPoints) / parseInt(serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices.length) });
                            pasType = serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].passengerId.split('_')[0];
                            samePas = false;
                            if (returnedPassengersInfo.generalData[pasType]) {
                                for (generalDataIndex = 0; generalDataIndex < returnedPassengersInfo.generalData[pasType].length; generalDataIndex++) {
                                    if (serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price && returnedPassengersInfo.generalData[pasType][generalDataIndex].fareCash === serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare) {
                                        samePas = true;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].number++;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].totalTax += serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.tax;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].penalty += serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].itemDiferencePrice = serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare + serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].diferencePrice += serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare + serviceData.order.discountsApplied.originalOrderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty;
                                    }
                                }
                                if (!samePas) {
                                    returnedPassengersInfo.generalData[pasType].push(pasInfo);
                                }
                            } else {
                                returnedPassengersInfo.generalData[pasType] = [pasInfo];
                            }

                            angular.forEach(returnedPassengersInfo.generalData, (value) => {
                                for (pasIndex = 0; pasIndex < value.length; pasIndex++) {
                                    if ($rootScope.isRedemptionFlow) angular.extend(value[pasIndex], { parsedFareAvios: CurrencyService.formatAvios(currency, value[pasIndex].fareAvios, true) });
                                    if ($rootScope.isPointsOBFlow) angular.extend(value[pasIndex], { parsedFareOBPoints: CurrencyService.formatAvios(currency, value[pasIndex].fareOBPoints, true) });
                                    value[pasIndex].parsedFareCash = CurrencyService.formatPrice(currency, value[pasIndex].fareCash, true);
                                    value[pasIndex].parsedTotalTax = CurrencyService.formatPrice(currency, value[pasIndex].totalTax, true);
                                    if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                                        value[pasIndex].parsedPenalty = CurrencyService.formatPrice(currency, value[pasIndex].penalty, true);
                                        value[pasIndex].parsedItemDiferencePrice = CurrencyService.formatPrice(currency, value[pasIndex].itemDiferencePrice, true);
                                        value[pasIndex].parsedDiferencePrice = CurrencyService.formatPrice(currency, value[pasIndex].diferencePrice, true);
                                    }
                                }
                            });

                        }
                    }
                }
            } else {
                for (orderItemsIndex = 0; orderItemsIndex < serviceData.order.orderItems.length; orderItemsIndex++) {
                    if (serviceData.order.orderItems[orderItemsIndex].type === PmtConstants.ORDER_ITEMS_TYPES.FLIGHT) {
                        for (passengerPricesIndex = 0; passengerPricesIndex < serviceData.order.orderItems[orderItemsIndex].passengerPrices.length; passengerPricesIndex++) {
                            pasInfo = {
                                number: 1,
                                fareCash: serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare : 0,
                                totalTax: serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.tax : 0,
                                currency: currency,
                                breakdownTaxes: getFormatedTaxes(serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].taxes, currency, commercialData)
                            };
                            if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                                pasInfo.penalty = serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty : 0;
                                pasInfo.diferencePrice = serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price ? serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare + serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty : 0;
                                pasInfo.itemDiferencePrice = pasInfo.diferencePrice;
                            }
                            if ($rootScope.isRedemptionFlow) {
                                const breakdownPassengers = localStorageService.get('breakdownPassengers');
                                const isInfant = serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].passengerId.split('_')[0] === 'INFANT';
                                const pricePerPax = breakdownPassengers.selectedRedeption.pricePerPax ?? breakdownPassengers.selectedRedeption.discountedPrice.pricePerPax;
                                const fareOptions = {
                                    adultOrChild: pricePerPax.find(item => item.paxType === 'ADULT'),
                                    infant: pricePerPax.find(item => item.paxType === 'INFANT')
                                };
                                const fareAvios = isInfant ? fareOptions.infant : fareOptions.adultOrChild;
                                pasInfo.fareCash = fareAvios.cash.fare;
                                if(serviceData.order) {
                                    angular.extend(pasInfo, { fareAvios: parseInt(serviceData.order.redemptionOption ? serviceData.order.redemptionOption.totalPoints.fare : fareAvios.points.fare ) });
                                }
                            }
                            if ($rootScope.isRedemptionFlow && serviceData.order) angular.extend(pasInfo, { fareOBPoints: parseInt(serviceData.order.orderItems[orderItemsIndex].totalPoints ? serviceData.order.orderItems[orderItemsIndex].totalPoints : localStorageService.get('paymentsInfo').price.totalPriceOBPoints) / parseInt(serviceData.order.orderItems[orderItemsIndex].passengerPrices.length) });
                            pasType = serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].passengerId.split('_')[0];
                            samePas = false;
                            if (returnedPassengersInfo.generalData[pasType]) {
                                for (generalDataIndex = 0; generalDataIndex < returnedPassengersInfo.generalData[pasType].length; generalDataIndex++) {
                                    if (serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price && returnedPassengersInfo.generalData[pasType][generalDataIndex].fareCash === serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare) {
                                        samePas = true;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].number++;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].totalTax += serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.tax;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].penalty += serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].itemDiferencePrice = serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare + serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty;
                                        returnedPassengersInfo.generalData[pasType][generalDataIndex].diferencePrice += serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.fare + serviceData.order.orderItems[orderItemsIndex].passengerPrices[passengerPricesIndex].price.penalty;
                                    }
                                }
                                if (!samePas) {
                                    returnedPassengersInfo.generalData[pasType].push(pasInfo);
                                }
                            } else {
                                returnedPassengersInfo.generalData[pasType] = [pasInfo];
                            }

                            angular.forEach(returnedPassengersInfo.generalData, (value) => {
                                for (pasIndex = 0; pasIndex < value.length; pasIndex++) {
                                    if ($rootScope.isRedemptionFlow) angular.extend(value[pasIndex], { parsedFareAvios: CurrencyService.formatAvios(currency, value[pasIndex].fareAvios, true) });
                                    if ($rootScope.isPointsOBFlow) angular.extend(value[pasIndex], { parsedFareOBPoints: CurrencyService.formatAvios(currency, value[pasIndex].fareOBPoints, true) });
                                    value[pasIndex].parsedFareCash = CurrencyService.formatPrice(currency, value[pasIndex].fareCash, true);
                                    value[pasIndex].parsedTotalTax = CurrencyService.formatPrice(currency, value[pasIndex].totalTax, true);
                                    if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                                        value[pasIndex].parsedPenalty = CurrencyService.formatPrice(currency, value[pasIndex].penalty, true);
                                        value[pasIndex].parsedItemDiferencePrice = CurrencyService.formatPrice(currency, value[pasIndex].itemDiferencePrice, true);
                                        value[pasIndex].parsedDiferencePrice = CurrencyService.formatPrice(currency, value[pasIndex].diferencePrice, true);
                                    }
                                }
                            });

                        }
                    }
                }
            }
            if (serviceData.passengers) {
                for (passengersIndex = 0; passengersIndex < serviceData.passengers.length; passengersIndex++) {
                    returnedPassengersInfo.personalData.push({
                        name: getPersonalData(serviceData.passengers[passengersIndex]).name,
                        surname: getPersonalData(serviceData.passengers[passengersIndex]).surname,
                        specialNeeds: getSpecialNeeds(serviceData.passengers[passengersIndex].passengerId, passengersSpecialNeeds)
                    });
                }
            }
            angular.forEach(returnedPassengersInfo.generalData, (value) => {
                for (pasIndex = 0; pasIndex < value.length; pasIndex++) {
                    totalPassenger += (value[pasIndex].fareCash * value[pasIndex].number) + value[pasIndex].totalTax;
                    if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                        totalPassenger += value[pasIndex].penalty;
                    }
                }
            });
            returnedPassengersInfo.totalPassengersFormatted = CurrencyService.formatPrice(currency, totalPassenger, true);
            return returnedPassengersInfo;

            function getSpecialNeeds (pasId, passengersSpecialNeeds) {
                let pasIndex, specialNeeds = [];
                if (passengersSpecialNeeds && passengersSpecialNeeds.length > 0) {
                    for (pasIndex = 0; pasIndex < passengersSpecialNeeds.length; pasIndex++) {
                        if (passengersSpecialNeeds[pasIndex].id === pasId) {
                            specialNeeds = passengersSpecialNeeds[pasIndex].specialNeeds;
                        }
                    }
                }
                return specialNeeds;
            }
            function getPersonalData (passengerData) {
                const infoSelected = {};
                const name = passengerData.externalPersonalInfo ? passengerData.externalPersonalInfo.name : passengerData.personalInfo.firstName ? passengerData.personalInfo.firstName : passengerData.personalInfo.name;
                const surname = passengerData.externalPersonalInfo ? passengerData.externalPersonalInfo.firstSurname : passengerData.personalInfo.firstSurname ? passengerData.personalInfo.firstSurname : passengerData.personalInfo.surname ? passengerData.personalInfo.surname : '';
                const lastSurname = passengerData.externalPersonalInfo ? passengerData.externalPersonalInfo.lastSurname : passengerData.personalInfo.lastSurname ? passengerData.personalInfo.lastSurname : '';
                infoSelected.name = name + ' ' + surname + ' ' + lastSurname;
                infoSelected.surname = surname;
                return infoSelected;
            }
        }


        function getOrderFees (serviceData, currency) {
            let orderItemsIndex, i;
            const orderFees = [];
            for (orderItemsIndex = 0; orderItemsIndex < serviceData.order.orderItems.length; orderItemsIndex++) {

                switch(serviceData.order.orderItems[orderItemsIndex].type) {
                        case PmtConstants.ORDER_ITEMS_TYPES.FLIGHT:
                            if (serviceData.order.orderItems[orderItemsIndex].price && serviceData.order.orderItems[orderItemsIndex].price.ticketingFee && serviceData.order.orderItems[orderItemsIndex].price.ticketingFee !== 0) {
                                orderFees.push({
                                    code: 'ticketingFee',
                                    description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                                    fee: CurrencyService.formatPrice(currency, serviceData.order.orderItems[orderItemsIndex].price.ticketingFee, true),
                                    totalFee: serviceData.order.orderItems[orderItemsIndex].price.ticketingFee
                                });
                            }
                            break;

                        case PmtConstants.ORDER_ITEMS_TYPES.CREDIT_CARD_FEE:
                            orderFees.push({
                                code: PmtConstants.ORDER_ITEMS_TYPES.CREDIT_CARD_FEE,
                                description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                                fee: CurrencyService.formatPrice(currency, serviceData.order.orderItems[orderItemsIndex].price.tax, true),
                                totalFee: serviceData.order.orderItems[orderItemsIndex].price.tax
                            });

                            break;

                }

            }
            if (localStorageService.get('donation') && serviceData.paymentItems && serviceData.paymentItems.length > 0) {
                for (i = 0; i < serviceData.paymentItems.length; i++) {
                    if (serviceData.paymentItems[i].type === 'DONATION' && serviceData.paymentItems[i].donationId) {
                        orderFees.push({
                            code: 'donation',
                            description: localStorageService.get('donation').partner,
                            fee: CurrencyService.formatPrice(currency, localStorageService.get('donation').option.option, true),
                            totalFee: localStorageService.get('donation').option.option
                        });
                    }
                }
            }

            orderFees.total = 0;
            angular.forEach(orderFees, (orderFee) => {
                orderFees.total += orderFee.totalFee;
            });
            orderFees.totalFormatted = CurrencyService.formatPrice(currency, orderFees.total, true).trim();
            return orderFees;
        }

        function getFormatedTaxes (taxes, currency, commercialData) {
            const formatedTaxes = [];
            let taxesIndex;
            for (taxesIndex = 0; taxesIndex < taxes.length; taxesIndex++) {
                formatedTaxes[taxesIndex] = angular.copy(taxes[taxesIndex]);
                formatedTaxes[taxesIndex].amount = CurrencyService.formatPrice(currency, formatedTaxes[taxesIndex].amount, true, commercialData);
            }
            return formatedTaxes;
        }

        /**
         * Return all discounts applied in a order
         * @param {*} issueOrderData
         */
        function getDisccounts (issueOrderData, currency) {
            let paymentTypesIndex;
            const totalOrder = {}, paymentTypes = issueOrderData.paymentItems ? issueOrderData.paymentItems : issueOrderData.order.orderItems;
            for (paymentTypesIndex = 0; paymentTypesIndex < paymentTypes.length; paymentTypesIndex++) {
                if (paymentTypes[paymentTypesIndex].type === PmtConstants.PAYMENT_ORDER_ITEMS_TYPES.AVIOS) {
                    totalOrder.types = {};
                    totalOrder.status = true;
                    totalOrder.types[paymentTypes[paymentTypesIndex].type] = {
                        type: paymentTypes[paymentTypesIndex].type,
                        formatedAvios: CurrencyService.formatAvios(currency, paymentTypes[paymentTypesIndex].aviosRedeemed, true),
                        discount: CurrencyService.formatPrice(currency, paymentTypes[paymentTypesIndex].total ? paymentTypes[paymentTypesIndex].total : paymentTypes[paymentTypesIndex].price.total, true)
                    };
                } else if (paymentTypes[paymentTypesIndex].type === PmtConstants.PAYMENT_ORDER_ITEMS_TYPES.VOUCHER) {
                    totalOrder.discount = [];
                    totalOrder.discount.push({
                        id: getCodeVoucher(issueOrderData.paymentMethod), type: paymentTypes[paymentTypesIndex].type, discount: CurrencyService.formatPrice(currency, paymentTypes[paymentTypesIndex].total ? paymentTypes[paymentTypesIndex].total : paymentTypes[paymentTypesIndex].price.total, true)
                    });
                }
            }
            return totalOrder;

            function getCodeVoucher (paymentMethod) {
                let code;
                if (paymentMethod && paymentMethod.associatedDiscount && paymentMethod.associatedDiscount.type === PmtConstants.PAYMENT_ORDER_ITEMS_TYPES.VOUCHER) {
                    code = paymentMethod.associatedDiscount.voucherId;
                }
                return code;
            }
        }

        /**
         * Generate object with all information about ancillaries to summary info
         * @param {Object} summaryInfo information about summaryInfo
         * @param {Object} currency object currency
         */
        function getAncillariesBreakdownInfo (summaryInfo, currency) {
            const transformedAncillaries = {
                baggages: {
                    segments: [],
                    totalFormatted: null
                },
                speqs: {
                    segments: [],
                    totalFormatted: null
                },
                seats: {
                    segments: [],
                    totalFormatted: null
                },
                carbonFootprint: null,
                insurance: null,
                flexibility: null,
                upgrading: null,
                upgradingBids: null,
                bundles: [],
                currency: currency,
                total: 0,
                totalFormatted: '',
                discount: null,
                globickTransfers: null,
                globickActivities: null,
                insuranceAllianzFusion: null,
                message: summaryInfo?.message || ''
            };
            if (summaryInfo) {
                angular.forEach(summaryInfo.ancillairesInfo ? summaryInfo.ancillairesInfo : summaryInfo, (ancillariesInfo, ancillaryType) => {
                    switch (ancillaryType) {
                            case 'seats': getSeatsSumary(); break;
                            case 'baggages': getBaggageSummary(); break;
                            case 'insurance': getInsuranceSummary(); break;
                            case 'speqs': getSpeqsSummary(); break;
                            case 'flexibility': getFlexibilitySummary(); break;
                            case 'upgradingBids': getUpgradingBidsSummary(); break;
                            case 'priority': getPriorityBoardingSummary(); break;
                            case 'carbonFootprint': getCarbonFootprint(); break;
                            case 'bundles': getBundles(); break;
                            case 'globickTransfers': getGlobickTransfers(); break;
                            case 'globickActivities': getGlobickActivities(); break;
                            case 'insuranceAllianzFusion': getInsuranceAllianzFusion(); break;
                            case 'petc': getPetcSummary(); break;
                    }

                    function getInsuranceAllianzFusion () {
                        if (ancillariesInfo && ancillariesInfo.hasInsuranceAllianzFusion && transformedAncillaries.message.length === 0) {
                            transformedAncillaries.insuranceAllianzFusion = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.total.total;
                        }
                    }

                    function getGlobickTransfers () {
                        if (ancillariesInfo && ancillariesInfo.hasTransfersGlobick ) {
                            transformedAncillaries.globickTransfers = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.total.total;
                        }
                    }

                    function getGlobickActivities () {
                        if (ancillariesInfo && ancillariesInfo.hasActivitiesGlobick) {
                            transformedAncillaries.globickActivities = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.total.total;
                        }
                    }

                    function getBundles () {
                        if (ancillariesInfo && ancillariesInfo.length > 0) {
                            transformedAncillaries.bundles = ancillariesInfo.concat(transformedAncillaries.bundles);
                        }
                    }

                    function getSeatsSumary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.seats = ancillariesInfo;
                            angular.forEach(transformedAncillaries.seats.segments, (segment) => {
                                transformedAncillaries.total += segment.total;
                            });
                        }

                    }

                    function getBaggageSummary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.baggages = ancillariesInfo;
                            angular.forEach(transformedAncillaries.baggages.segments, (segment) => {
                                transformedAncillaries.total += segment.total;
                            });
                        }
                    }

                    function getSpeqsSummary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.speqs = ancillariesInfo;
                            angular.forEach(transformedAncillaries.speqs.segments, (segment) => {
                                transformedAncillaries.total += segment.total;
                            });
                        }
                    }

                    function getInsuranceSummary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.insurance = ancillariesInfo;
                            transformedAncillaries.insurance.showInsurance = !!ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo && ancillariesInfo.total ? ancillariesInfo.total : 0;
                        }
                    }
                    function getFlexibilitySummary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.flexibility = ancillariesInfo;
                            transformedAncillaries.flexibility.showFlexibility = !!ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo && ancillariesInfo.total ? ancillariesInfo.total : 0;
                        }
                    }

                    function getUpgradingBidsSummary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.upgradingBids = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.total;
                        }
                    }

                    function getCarbonFootprint () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.carbonFootprint = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.price;
                        }
                    }

                    function getPriorityBoardingSummary () {
                        if (ancillariesInfo && ancillariesInfo.updated) {
                            transformedAncillaries.priority = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.total;
                        }
                    }
                    function getPetcSummary () {
                        if (ancillariesInfo && ancillariesInfo.hasPetc) {
                            transformedAncillaries.petc = ancillariesInfo;
                            transformedAncillaries.total += ancillariesInfo.total.total;
                        }
                    }
                });
            }
            transformedAncillaries.totalFormatted = CurrencyService.formatPrice(currency, transformedAncillaries.total, true);
            return transformedAncillaries;
        }


        /**
         * Generate breakdowninfo model
         * @param {Array} breakDownInfo Information breakdown returned by service
         */
        function transformBreakdownInfo (breakDownInfo) {
            let i, j, trip, isFound = false, segmentsInfo,currencyData = null;
            const aviosInfoDiscount = localStorageService.get('selectedAviosDisccount');
            const basket = { baggages: { segments: [], totalFormatted: null }, speqs: { segments: [], totalFormatted: null }, priority: { segments: [], totalFormatted: null }, seats: { segments: [], totalFormatted: null }, insurance: null, carbonFootprint: { total: null, kilosCo2Equivalent: null, totalFormatted: null, kilosCo2EquivalentFormatted: null, hasCarbonFootprint: false}, upgrading: null, upgradingBids: null, currency: null, total: null, totalFormatted: null, discount: null, globickTransfers: null, globickActivities: null, insuranceAllianzFusion: null, petc: { segments: [], totalFormatted: null } };

            switch (localStorageService.get('flowApp')) {
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                    case PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS:
                        segmentsInfo = localStorageService.get('segmentsInfo'); break;
                    case PmtConstants.APP_TYPES.CHECKIN: segmentsInfo = getSegmentsInfo(); break;
                    case PmtConstants.APP_TYPES.BOOKING: segmentsInfo = getSegmentsInfo(); break;
            }

            if (breakDownInfo.pendingPaymentItems.length > 0 || breakDownInfo.freeItems.length > 0) {
                currencyData = breakDownInfo.pendingPaymentItems.length > 0 ? breakDownInfo.pendingPaymentItems[0].currency : breakDownInfo.freeItems[0].currency;
                basket.currency = CurrencyService.getCurrencyObject(getCurrencyAncillarie(breakDownInfo.currencies, currencyData));
            }

            function getBundleItemDescription (type, subtype) {
                let description = '';
                switch (type) {
                        case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:
                            switch (subtype) {
                                    case PmtConstants.BAGGAGE_SUBTYPE.BAGGAGE_15:
                                        description = $filter('translate')('BAGGAGE_SINGULAR_TEXT') + ' ' + PmtConstants.BAGGAGE_SUBTYPE_DESCRIPTION.BAGGAGE_15; break;
                                    case PmtConstants.BAGGAGE_SUBTYPE.BAGGAGE_23:
                                        description = $filter('translate')('BAGGAGE_SINGULAR_TEXT') + ' ' + PmtConstants.BAGGAGE_SUBTYPE_DESCRIPTION.BAGGAGE_23; break;
                                    case PmtConstants.BAGGAGE_SUBTYPE.BAGGAGE_32:
                                        description = $filter('translate')('BAGGAGE_SINGULAR_TEXT') + ' ' + PmtConstants.BAGGAGE_SUBTYPE_DESCRIPTION.BAGGAGE_32; break;
                            }
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.SPEQSMMB:
                            switch (subtype) {
                                    case PmtConstants.SPEQ_TYPE.SKI_SNOW: description = $filter('translate')('SPEQS_SKI_SNOW'); break;
                                    case PmtConstants.SPEQ_TYPE.GOLF_EQUIPMENT: description = $filter('translate')('SPEQS_GOLF_EQUIPMENT'); break;
                                    case PmtConstants.SPEQ_TYPE.FISHING_EQUIPMENT: description = $filter('translate')('SPEQS_FISHING_TITLE'); break;
                                    case PmtConstants.SPEQ_TYPE.SCUBA_DIVING: description = $filter('translate')('SPEQS_SCUBA_TITLE'); break;
                                    case PmtConstants.SPEQ_TYPE.SURFBOARD: description = $filter('translate')('SPEQS_SURFBOARD_TITLE'); break;
                                    case PmtConstants.SPEQ_TYPE.BICYCLE: description = $filter('translate')('SPEQS_BICYCLE'); break;
                                    case PmtConstants.SPEQ_TYPE.SPORTING_FIREARMS: description = 'armas deportivas'; break;
                                    default: description = $filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT'); break;

                            }
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.FLEXIBILITY:
                            switch (subtype) {
                                    case PmtConstants.FLEX_SUBTYPES.FLIGHT_CHANGE: description = $filter('translate')('ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE'); break;
                                    case PmtConstants.FLEX_SUBTYPES.VOUCHER_REFUND: description = $filter('translate')('ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE'); break;
                                    case PmtConstants.FLEX_SUBTYPES.FLEXIBILITY_PACK: description = $filter('translate')('ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY'); break;
                            }
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING: description = $filter('translate')('PRIORITY_BOARDING_TITLE'); break;
                        default: return '';
                }

                description = description.substring(0, 1).toUpperCase() + description.substring(1, description.length);
                return description;

            }

            if(breakDownInfo.bundles.length > 0) {
                let totalItems = 0;
                const pendingBundle = breakDownInfo.bundles.find(pendingBundle => pendingBundle.status !== 'ISSUED');
                if(pendingBundle) {
                    breakDownInfo.bundles[0].items.forEach(item => {
                        const ancillary = breakDownInfo.pendingPaymentItems.find(pendingItem => pendingItem.type === item.type);
                        if(ancillary.type === PmtConstants.ANCILLARIES_TYPES.BAGGAGE || ancillary.type === PmtConstants.ANCILLARIES_TYPES.SPEQSMMB) {
                            ancillary.slices.forEach(slice => {
                                slice.passengers.forEach(passenger => {
                                    passenger.pieces.forEach(piece => {
                                        if (piece.subtype === item.subtype) {
                                            piece.bundleQuantity = item.quantity / (ancillary.slices.length * breakDownInfo.context.passengers.length);
                                            item.description = getBundleItemDescription(item.type, item.subtype);
                                            piece.total = piece.total - (item.priceItemDiscount * piece.bundleQuantity);
                                        }
                                    });
                                });
                            });
                        } else {
                            ancillary.isBundle = true;
                            item.description = getBundleItemDescription(item.type, item.subtype);
                        }
                        totalItems += item.priceItemAllDiscount;
                    });
                    breakDownInfo.bundles[0].totalItems = CurrencyService.formatPrice(basket.currency, totalItems, true);
                    breakDownInfo.bundles[0].totalPassengers = breakDownInfo.context.passengers.length;
                    basket.bundles = breakDownInfo.bundles;
                }
            }

            for (i = 0; i < breakDownInfo.pendingPaymentItems.length; i++) {
                switch (breakDownInfo.pendingPaymentItems[i].type) {
                        case PmtConstants.ANCILLARIES_TYPES.SEAT:
                            basket.seats.segments = generateSeatInfo();
                            basket.seats.totalFormatted = getTotalFormatted(basket.seats.segments);
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                            basket.insurance = generateInsuranceInfo();
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.UPGRADING:
                            basket.upgrading = generateUpgradingInfo();
                            getOriginAndDestination(basket.upgrading.upgradingTrips, segmentsInfo);
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID:
                            basket.upgradingBids = generateUpgradingBidsInfo();
                            if (basket.upgradingBids) {
                                for (j = 0; j < breakDownInfo.pendingPaymentItems[i].segments.length; j++) {
                                    if (breakDownInfo.pendingPaymentItems[i].segments[j].cabins) {
                                        breakDownInfo.pendingPaymentItems[i].segments[j].cabins.sort((a, b) => {
                                            if (a.amountPax > b.amountPax) {
                                                return -1;
                                            }
                                            if (a.amountPax < b.amountPax) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                        basket.total += breakDownInfo.pendingPaymentItems[i].segments[j].cabins[0].amountPax * (breakDownInfo.context.passengers.length);
                                    }
                                }
                            }
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:
                            basket.baggages.segments = generateBaggagesInfo();
                            basket.baggages.totalFormatted = getTotalFormatted(basket.baggages.segments);
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.SPEQSMMB:
                            basket.speqs.segments = generateSpeqsInfo();
                            basket.speqs.totalFormatted = getTotalFormatted(basket.speqs.segments);
                            getOriginAndDestination(basket.speqs.segments, segmentsInfo);
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.FLEXIBILITY:
                            if(!breakDownInfo.pendingPaymentItems[i].isBundle) {
                                basket.flexibility = generateFlexibilityInfo(breakDownInfo.pendingPaymentItems[i]);
                                basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            }
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING:
                            if(!breakDownInfo.pendingPaymentItems[i].isBundle) {
                                basket.priority.segments = generatePriorityInfo(breakDownInfo.pendingPaymentItems[i]);
                                basket.total += breakDownInfo.pendingPaymentItems[i].total;
                                basket.priority.totalFormatted = CurrencyService.formatPrice(basket.currency, breakDownInfo.pendingPaymentItems[i].total, true);
                            }
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT:
                            basket.carbonFootprint.total = breakDownInfo.pendingPaymentItems[i].total;
                            basket.carbonFootprint.kilosCo2Equivalent = breakDownInfo.pendingPaymentItems[i].kilosCo2Equivalent;
                            basket.carbonFootprint.totalFormatted = CurrencyService.formatPrice(basket.currency, basket.carbonFootprint.total, true);
                            basket.carbonFootprint.kilosCo2EquivalentFormatted = basket.carbonFootprint.kilosCo2Equivalent.toString().replace('.', ',');
                            basket.carbonFootprint.hasCarbonFootprint = true;
                            basket.total += breakDownInfo.pendingPaymentItems[i].price;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.GLOBICK:
                            basket.globickTransfers = generateGlobickTransfersInfo();
                            basket.globickActivities = generateGlobickActivitiesInfo();
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.INSURANCE_ALLIANZ:
                            basket.insuranceAllianzFusion = generateInsuranceAllianzFusionInfo();
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                        case PmtConstants.ANCILLARIES_TYPES.PET:
                            basket.petc.segments = IbPmtBreakdownUtilsPetsService.generatePetcInfo(
                                buildPetcContext(i)
                            );
                            basket.total += breakDownInfo.pendingPaymentItems[i].total;
                            break;
                }
            }

            if(breakDownInfo.pendingPaymentItems.length === 0 && breakDownInfo.freeItems.length > 0) {
                for (i = 0; i < breakDownInfo.freeItems.length; i++) {
                    switch (breakDownInfo.freeItems[i].type) {
                            case PmtConstants.ANCILLARIES_TYPES.SEAT:
                                basket.seats.segments = generateFreeSeatInfo(i);
                                basket.seats.totalFormatted = getTotalFormatted(basket.seats.segments);
                                basket.total += breakDownInfo.freeItems[i].total;
                                break;
                            case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                                break;
                            case PmtConstants.ANCILLARIES_TYPES.UPGRADING:
                                break;
                            case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:
                                break;
                            case PmtConstants.ANCILLARIES_TYPES.SPEQS:
                                break;
                            case PmtConstants.ANCILLARIES_TYPES.FLEXIBILITY:
                                break;
                    }
                }
            }

            breakDownInfo.voucherDiscount ? basket.discount = { id: breakDownInfo.voucherDiscount.voucherId, amount: CurrencyService.formatPrice(basket.currency, breakDownInfo.voucherDiscount.amount, true) } : basket.discount = null;
            breakDownInfo.voucherDiscount ? basket.totalFormatted = CurrencyService.formatPrice(basket.currency, basket.total - breakDownInfo.voucherDiscount.amount, true) : basket.totalFormatted = CurrencyService.formatPrice(basket.currency, basket.total, true);
            if (aviosInfoDiscount !== null && aviosInfoDiscount.aviosRequired && aviosInfoDiscount.aviosRequired > 0) {
                if (breakDownInfo.voucherDiscount !== null) {
                    if (basket.total - breakDownInfo.voucherDiscount.amount - aviosInfoDiscount.totalDiscount.fare < 0) {
                        basket.totalFormatted = CurrencyService.formatPrice(basket.currency, basket.total - breakDownInfo.voucherDiscount.amount, true);
                    } else {
                        basket.totalFormatted = CurrencyService.formatPrice(basket.currency, basket.total - breakDownInfo.voucherDiscount.amount - aviosInfoDiscount.totalDiscount.fare, true);
                    }
                } else if (aviosInfoDiscount && aviosInfoDiscount.fullAvios === true) {
                    basket.totalFormatted = CurrencyService.formatPrice(basket.currency, 0, true);
                } else {
                    basket.totalFormatted = CurrencyService.formatPrice(basket.currency, basket.total - aviosInfoDiscount.totalDiscount.fare, true);
                }
            }

            return basket;

            function buildPetcContext (i) {
                return {
                    basket,
                    pendingSlices: breakDownInfo.pendingPaymentItems[i].slices,
                    segmentsInfo: segmentsInfo,
                    getOriginAndDestinationSegment,
                    getTotalFormatted
                };
            }

            function generateSeatInfo () {
                let segment;
                const listSegments = [];
                angular.forEach(breakDownInfo.pendingPaymentItems[i].segments, (segmentSeat) => {
                    segment = { segmentId: null, seats: [], origin: null, destination: null, total: 0, totalFormatted: 0 };
                    segment.segmentId = segmentSeat.id;
                    angular.forEach(segmentSeat.passengers, (pasSegment) => {
                        addNewSeat(segment, pasSegment);
                    });
                    calculateTotalSeat(segment);
                    angular.forEach(segmentsInfo, (segmentsInfoSlice) => {
                        if (segmentsInfoSlice.id === segment.segmentId) {
                            segment.origin = segmentsInfoSlice.origin;
                            segment.destination = segmentsInfoSlice.destination;
                        }
                    });
                    listSegments.push(segment);
                });
                if(breakDownInfo.freeItems[i]) {
                    angular.forEach(breakDownInfo.freeItems[i].segments, (segmentSeat) => {
                        segment = { segmentId: null, seats: [], origin: null, destination: null, total: 0, totalFormatted: 0 };
                        segment.segmentId = segmentSeat.id;
                        angular.forEach(segmentSeat.passengers, (pasSegment) => {
                            addNewSeat(segment, pasSegment);
                        });
                        calculateTotalSeat(segment);
                        angular.forEach(segmentsInfo, (segmentsInfoSlice) => {
                            if (segmentsInfoSlice.id === segment.segmentId) {
                                segment.origin = segmentsInfoSlice.origin;
                                segment.destination = segmentsInfoSlice.destination;
                            }
                        });
                        const segmentToAddSeat = listSegments.find(element => element.segmentId === segment.segmentId);
                        if(!segmentToAddSeat) {
                            listSegments.push(segment);
                        } else {
                            segmentToAddSeat.seats = segmentToAddSeat.seats.concat(segment.seats);
                        }
                    });
                }

                segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.total, true);
                return listSegments;
            }
            function generateFreeSeatInfo (i) {
                let segment, seatType, found = false;
                const listSegments = [];
                angular.forEach(breakDownInfo.freeItems[i].segments, (segmentSeat) => {
                    angular.forEach(basket.seats.segments, (basketSegment) => {
                        if (basketSegment.segmentId === segmentSeat.id) {
                            angular.forEach(segmentSeat.passengers, (pasSegment) => {
                                addNewSeat(basketSegment, pasSegment);
                            });
                            found = true;
                        }
                    });
                    if (!found) {
                        segment = { segmentId: null, seats: [], origin: null, destination: null, total: 0, totalFormatted: 0 };
                        segment.segmentId = segmentSeat.id;
                        angular.forEach(segmentSeat.passengers, (pasSegment) => {
                            addNewSeat(segment, pasSegment);
                        });
                        calculateTotalSeat(segment);
                        angular.forEach(segmentsInfo, (segmentsInfoSlice) => {
                            if (segmentsInfoSlice.id === segment.segmentId) {
                                segment.origin = segmentsInfoSlice.origin;
                                segment.destination = segmentsInfoSlice.destination;
                            }
                        });
                        basket.seats.segments.push(segment);
                    }
                });
                angular.forEach(basket.seats.segments, (segment) => {
                    segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.total, true);
                });
                return basket.seats.segments;
            }

            function addNewSeat (segment, seatPas) {
                let i = 0, isFound = false, seatType, seatTypeFound = false;
                const seatTypeFunction = getSeatType(seatPas.seat.features);

                while (i < segment.seats.length && !isFound) {
                    if (segment.seats[i].description === seatTypeFunction.description && !segment.seats[i].passengers.find(element => element.id === seatPas.id)) {
                        segment.seats[i].passengers.push({ id: seatPas.id.toString(), amount: seatPas.amount });
                        segment.seats[i].amount += seatPas.amount;
                        segment.seats[i].totalFormatted = CurrencyService.formatPrice(basket.currency, segment.seats[i].amount, true);
                        segment.seats[i].quanty++;
                        isFound = true;
                    }
                    i++;
                }
                if (!isFound) {
                    seatType = { type: seatTypeFunction.type, description: seatTypeFunction.description, quanty: 1, passengers: [], amount: 0, totalFormatted: null };
                    seatType.amount += seatPas.amount;
                    seatType.totalFormatted = CurrencyService.formatPrice(basket.currency, seatPas.amount, true);
                    seatType.passengers.push({ id: seatPas.id.toString(), amount: seatPas.amount });

                    angular.forEach(segment.seats, (seat) => {
                        angular.forEach(seat.passengers, (passenger) => {
                            angular.forEach(seatType.passengers, (seatTYpePassenger) => {
                                seatTypeFound = seatTYpePassenger.id === passenger.id;
                            });
                        });
                    });
                    if(!seatTypeFound) {
                        segment.seats.push(seatType);
                    }
                }

            }
            function calculateTotalSeat (segment) {
                segment.total = 0;
                segment.totalFormatted = null;
                angular.forEach(segment.seats, (seat) => {
                    angular.forEach(seat.passengers, (pas) => {
                        segment.total += pas.amount;
                    });
                });
                segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.total, true);
            }
            function generateInsuranceInfo () {
                const insurance = localStorageService.get('selectedInsurance');
                return {
                    offer: breakDownInfo.pendingPaymentItems[i].offer,
                    total: breakDownInfo.pendingPaymentItems[i].total,
                    totalFormatted: CurrencyService.formatPrice(basket.currency, breakDownInfo.pendingPaymentItems[i].total, true),
                    passengers: 1,
                    type: insurance.name
                };
            }
            function generateGlobickTransfersInfo () {
                let globickData = {};
                const headerModel = CommonsSessionStorageService.get('headerModel');
                if (headerModel.headerModel.shoppingBasket.globickTransfers.hasTransfersGlobick) {
                    globickData = headerModel.headerModel.shoppingBasket.globickTransfers;
                }
                return globickData;
            }
            function generateGlobickActivitiesInfo () {
                let globickData = {};
                const headerModel = CommonsSessionStorageService.get('headerModel');
                if (headerModel.headerModel.shoppingBasket.globickActivities !== undefined) {
                    if (headerModel.headerModel.shoppingBasket.globickActivities.hasActivitiesGlobick) {
                        globickData = headerModel.headerModel.shoppingBasket.globickActivities;
                    }
                }
                return globickData;
            }
            function generateInsuranceAllianzFusionInfo () {
                let insuranceData = {};
                const headerModel = CommonsSessionStorageService.get('headerModel');
                if (headerModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion) {
                    insuranceData = headerModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo;
                }
                return insuranceData;
            }
            function generateFlexibilityInfo (flexibility) {
                const flexData = {
                    info: null,
                    totalFormatted: CurrencyService.formatPrice(basket.currency, flexibility.total, true),
                    total: flexibility.total,
                    title: 'ANCILLARIES_FLEXIBILITY_TITLE',
                    amount: {
                        title: 'ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT'
                    }
                };
                const currency = localStorageService.get('currency'), concepts = [];

                if (flexibility) {
                    flexData.currency = currency;
                    flexData.items = [
                        {
                            concepts: [
                                {
                                    quantity: 1,
                                    description: flexibility.percentage >= 100 ? $filter('translate')('ANCILLARIES_VOUCHER_REFUND_MODAL_TITLE') : flexibility.description,
                                    price: flexibility.total,
                                    priceFormatted: CurrencyService.formatPrice(basket.currency, flexibility.total, true)
                                }
                            ]
                        }
                    ];
                    if (flexibility.subtype === 'FLEXIBILITY_PACK') {
                        flexData.items[0].concepts[0].description = $filter('translate')('ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY');
                    }
                    flexData.hasFlexibilization = true;
                }

                return flexData;
            }
            function generateUpgradingInfo () {
                const upgrading = { upgradingTrips: [], total: null, totalFormatted: null };
                angular.forEach(breakDownInfo.pendingPaymentItems[i].upgrading.offerSegmentsClass, (segment) => {
                    trip = { segmentId: segment.segmentId, cabin: segment.cabinClass.description, origin: null, destination: null };
                    upgrading.upgradingTrips.push(trip);
                });
                upgrading.total = breakDownInfo.pendingPaymentItems[i].total;
                upgrading.totalFormatted = CurrencyService.formatPrice(basket.currency, upgrading.total, true);

                return upgrading;
            }
            function generateUpgradingBidsInfo () {
                if (localStorageService.get('sessionUpgradeInfo')) {
                    return { segments: localStorageService.get('flightsInfo'), bidSegments: localStorageService.get('sessionUpgradeInfo').ancillariesTrips };
                }
            }
            function generateBaggagesInfo () {
                let segment, baggageType;
                const baggages = [];

                angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (segmentBaggage) => {
                    segment = { sliceId: null, baggages: [], origin: null, destination: null, total: 0, totalFormatted: 0 };
                    segment.sliceId = segmentBaggage.id;
                    angular.forEach(segmentBaggage.passengers, (pasSegment) => {
                        if (segment.baggages.length > 0) {
                            addNewTypeBaggage(pasSegment);
                        } else {
                            angular.forEach(pasSegment.pieces, (piece) => {
                                addBaggage(piece, pasSegment);
                            });
                        }
                    });
                    if (segment.baggages.length > 0 ) {
                        baggages.push(segment);
                    }
                });
                getOriginAndDestinationSegment(baggages, segmentsInfo);

                return baggages;

                function addNewTypeBaggage (passenger) {
                    let baggageTypeArray = 0;
                    angular.forEach(passenger.pieces, (piece) => {
                        let isFound = false;
                        angular.forEach(segment.baggages, (baggage) => {
                            if (piece.subtype === baggage.type.subtype && (!piece.bundleQuantity || piece.bundleQuantity < piece.quantity)) {
                                isFound = true;
                                baggage.passengers.push(passenger.id);
                                baggage.quanty += !piece.bundleQuantity ? piece.quantity : piece.quantity - piece.bundleQuantity;
                                baggage.total += passenger.pieces[baggageTypeArray].total;
                                baggage.totalFormatted = CurrencyService.formatPrice(basket.currency, baggage.total, true);
                                segment.total += passenger.pieces[baggageTypeArray].total;
                                segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.total, true);
                            }
                        });
                        if (!isFound) {
                            addBaggage(piece, passenger);
                        }
                        baggageTypeArray++;
                    });
                    segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.total, true);
                }

                function addBaggage (piece, pasSegment) {
                    if((!piece.bundleQuantity || piece.bundleQuantity < piece.quantity) && piece.total !== 0) {
                        let totalWithoutBundle = 0;
                        if(piece.bundleQuantity) {
                            for (let i = 1; i <= piece.quantity; i++) {
                                if(i > piece.bundleQuantity) {
                                    for(let j = 0; j < piece.priceRanges.length; j++) {
                                        if(piece.priceRanges[j].from <= i && piece.priceRanges[j].to >= i) {
                                            totalWithoutBundle += piece.priceRanges[j].amount;
                                        }
                                    }
                                }
                            }
                        }
                        baggageType = {
                            passengers: [],
                            type: {
                                subtype: piece.subtype, description: piece.description
                            },
                            quanty: !piece.bundleQuantity ? piece.quantity : piece.quantity - piece.bundleQuantity,
                            total: !piece.bundleQuantity ? piece.total : totalWithoutBundle,
                            totalFormatted: 0
                        };
                        baggageType.passengers.push(pasSegment.id);
                        baggageType.totalFormatted = CurrencyService.formatPrice(basket.currency, baggageType.total, true);
                        segment.total += baggageType.total;
                        segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.total, true);
                        segment.baggages.push(baggageType);
                    }
                }
            }

            function generateSpeqsInfo () {
                const listSegments = [];
                angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice) => {
                    isFound = false;
                    const tripSpeq = { sliceId: slice.id, speqs: [], total: 0, totalFormatted: '' };

                    angular.forEach(slice.passengers, (passenger) => {
                        angular.forEach(passenger.pieces, (piece) => {
                            isFound = false;
                            if (tripSpeq.speqs.length > 0) {
                                for (j = 0; j < tripSpeq.speqs.length; j++) {
                                    if (tripSpeq.speqs[j].type === piece.subtype && !piece.bundleQuantity) {
                                        tripSpeq.speqs[j].quanty += piece.quantity;
                                        tripSpeq.speqs[j].total += piece.total;
                                        tripSpeq.speqs[j].totalFormatted = CurrencyService.formatPrice(basket.currency, tripSpeq.speqs[j].total, true);
                                        tripSpeq.speqs[j].passengers.push(passenger.id);
                                        tripSpeq.total += piece.total;
                                        isFound = true;
                                    } else if (tripSpeq.speqs[j].type === piece.subtype && piece.bundleQuantity !== piece.quantity && piece.quantity > 0) {
                                        let totalWithoutBundle = 0;
                                        for (let i = 1; i <= piece.quantity; i++) {
                                            if(i > piece.bundleQuantity) {
                                                for(let j = 0; j < piece.priceRanges.length; j++) {
                                                    if(piece.priceRanges[j].from <= i && piece.priceRanges[j].to >= i) {
                                                        totalWithoutBundle += piece.priceRanges[j].amount;
                                                    }
                                                }
                                            }
                                        }
                                        tripSpeq.speqs[j].quanty += piece.quantity - piece.bundleQuantity;
                                        tripSpeq.speqs[j].total += totalWithoutBundle;
                                        tripSpeq.speqs[j].totalFormatted = CurrencyService.formatPrice(basket.currency, tripSpeq.speqs[j].total, true);
                                        tripSpeq.speqs[j].passengers.push(passenger.id);
                                        tripSpeq.total += piece.total;
                                        isFound = true;
                                    }
                                }
                            }
                            if (!isFound && !piece.bundleQuantity && piece.total !== 0) {
                                tripSpeq.speqs.push({ type: piece.subtype, quanty: piece.quantity, description: speqTitle(piece.subtype), total: piece.total, totalFormatted: CurrencyService.formatPrice(basket.currency, piece.total, true), passengers: [passenger.id] });
                                tripSpeq.total += piece.total;
                            } else if (!isFound && piece.bundleQuantity !== piece.quantity && piece.quantity > 0 && piece.total !== 0) {
                                let totalWithoutBundle = 0;
                                for (let i = 0; i <= piece.quantity; i++) {
                                    if((i + 1) > piece.bundleQuantity) {
                                        for(let j = 0; j < piece.priceRanges.length; j++) {
                                            if(piece.priceRanges[j].from <= (i + 1) && piece.priceRanges[j].to >= (i + 1)) {
                                                totalWithoutBundle += piece.priceRanges[j].amount;
                                            }
                                        }
                                    }
                                }
                                tripSpeq.speqs.push({ type: piece.subtype, quanty: piece.quantity - piece.bundleQuantity, description:  speqTitle(piece.subtype), total: totalWithoutBundle, totalFormatted: CurrencyService.formatPrice(basket.currency, totalWithoutBundle, true), passengers: [passenger.id] });
                                tripSpeq.total += piece.total;
                            }
                        });
                    });
                    if (tripSpeq.speqs.length > 0 ) {
                        tripSpeq.totalFormatted = CurrencyService.formatPrice(basket.currency, tripSpeq.total, true);
                        listSegments.push(tripSpeq);
                    }
                });

                getOriginAndDestinationSegment(listSegments, segmentsInfo);

                return listSegments;
            }

            function speqTitle (speqInfoSubtype) {
                let speqDescription = '';
                switch (speqInfoSubtype) {
                        case 'BICYCLE':
                            speqDescription = $filter('translate')('SPEQS_BICYCLE');
                            break;
                        case 'SURFBOARD':
                            speqDescription = $filter('translate')('SPEQS_SURFBOARD_TITLE');
                            break;
                        case 'SKI_SNOW':
                            speqDescription = $filter('translate')('SPEQS_SKI_SNOW');
                            break;
                        case 'GOLF_EQUIPMENT':
                            speqDescription = $filter('translate')('SPEQS_GOLF_EQUIPMENT');
                            break;
                        case 'FISHING_EQUIPMENT':
                            speqDescription = $filter('translate')('SPEQS_FISHING_TITLE');
                            break;
                        case 'SCUBA_DIVING':
                            speqDescription = $filter('translate')('SPEQS_SCUBA_TITLE');
                            break;
                }
                return speqDescription;
            }

            function getSeatType (features) {
                let typeSeat = '', seatTypeDescription = '';
                if (features.indexOf(PmtConstants.SeatFeatures.emergencyExit) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.emergencyExit;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.emergencyExit) === -1 && features.indexOf(PmtConstants.SeatFeatures.extraSize) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.extraSize;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.emergencyWindow) !== -1 && features.indexOf(PmtConstants.SeatFeatures.extraSize) === -1) {
                    typeSeat = PmtConstants.SeatFeatures.emergencyWindow;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.infant) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.infant;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.promo) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.promo;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.promo) !== -1 && features.indexOf(PmtConstants.SeatFeatures.infant) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.infant;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.upfront) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.upfront;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.mobility) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.mobility;
                }
                if (features.indexOf(PmtConstants.SeatFeatures.upfront) !== -1 && features.indexOf(PmtConstants.SeatFeatures.extraSize) !== -1) {
                    typeSeat = PmtConstants.SeatFeatures.neighborFree;
                }
                typeSeat !== '' ? seatTypeDescription = getDescriptionFeatureType(typeSeat) : seatTypeDescription = '';

                return { type: typeSeat, description: seatTypeDescription };

                function getDescriptionFeatureType (type) {
                    switch (type) {
                            case PmtConstants.SeatFeatures.emergencyExit: return $filter('translate')('CKIANCSEATS_SEAT_EMERGENCY_XL');
                            case PmtConstants.SeatFeatures.extraSize: return $filter('translate')('SEATS_EXTRA_SIZE_SEAT');
                            case PmtConstants.SeatFeatures.promo: return $filter('translate')('SEATS_SEAT_PROMO');
                            case PmtConstants.SeatFeatures.infant: return $filter('translate')('CKIANCSEATS_SEAT_INFANT');
                            case PmtConstants.SeatFeatures.mobility: return $filter('translate')('CKIANCSEATS_SEAT_HANDICAP');
                            case PmtConstants.SeatFeatures.upfront: return $filter('translate')('CKIANCSEATS_SEAT_UPFRONT');
                            case PmtConstants.SeatFeatures.neighborFree: return $filter('translate')('CKIANCSEATS_SEAT_NEIGHBOR');
                            default: return '';
                    }
                }
            }
            function getOriginAndDestinationSegment (trips, segmentsInfo) {
                const ancillariesSlices = localStorageService.get('ancillariesSlices');

                angular.forEach(trips, (trip) => {
                    angular.forEach(ancillariesSlices, (slice) => {
                        if (trip.sliceId === slice.id) {
                            if (slice.segmentIds.length >= 1) {
                                trip.origin = getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                trip.destination = getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                            } else {
                                angular.extend(trip, getInfoSegment(slice.segmentIds[0], segmentsInfo));
                            }
                        }
                    });
                });
            }
            function getOriginAndDestination (trips, segmentsInfo) {
                let i, j, isFound;
                for (i = 0; i < trips.length; i++) {
                    j = 0; isFound = false;
                    if (segmentsInfo.length > 1) {

                    }
                    while (!isFound && j < segmentsInfo.length) {
                        if (trips[i].segmentId === segmentsInfo[j].id) {
                            trips[i].origin = segmentsInfo[j].origin;
                            trips[i].destination = segmentsInfo[j].destination;
                            isFound = true;
                        }
                        j++;
                    }
                }
            }
            function getCurrencyAncillarie (summaryCurrencies, currencyData) {
                let i = 0, isFound = false, currency;

                while (!isFound || i < summaryCurrencies.length) {
                    if (summaryCurrencies[i].code === currencyData) {
                        currency = summaryCurrencies[i];
                        isFound = true;
                    }
                    i++;
                }
                return currency;

            }
            function getTotalFormatted (segments) {
                let total = 0;
                angular.forEach(segments, (segment) => {
                    total += segment.total;
                });
                return CurrencyService.formatPrice(basket.currency, total, true);
            }
            function generatePriorityInfo (slices) {
                let i, segment = {}, segmentAux;
                const listSegments = [];
                angular.forEach(slices.segments, (slice) => {
                    segment = { sliceId: '', quanty: 0, amount: 0 };
                    segment.sliceId = slice.id;
                    for (i = 0; i < slice.passengers.length; i++) {
                        segment.quanty++;
                        segment.amount += slice.passengers[i].amount;
                    }
                    segment.totalFormatted = CurrencyService.formatPrice(basket.currency, segment.amount, true);
                    listSegments.push(segment);
                });
                for (i = 0; i < listSegments.length; i++) {
                    segmentAux = searchSegment(listSegments[i].sliceId, segmentsInfo);
                    listSegments[i].origin = segmentAux.origin;
                    listSegments[i].destination = segmentAux.destination;
                }
                function searchSegment (segmentsId, segments) {
                    let i;
                    for (i = 0; i < segments.length; i++) {
                        if (segments[i].id === segmentsId) {
                            return segments[i];
                        }
                    }
                }
                return listSegments;
            }
        }

        /**
         * Generate breakdowninfo model
         * @param {Array} summaryResponse Information breakdown returned by service
         */
        function transformBreakdownUpgradingBid (summaryResponse) {
            summaryResponse.pendingPaymentItems = summaryResponse.pendingPaymentItems.filter(item => item.type === PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID);
            localStorageService.set('summaryBidTransformed', summaryResponse);
            return transformBreakdownInfo(summaryResponse);
        }

        /**
        * Return segments of booking
        * @return {Array} List of segments on booking with basic information
        */
        function getSegmentsInfo () {
            let segment, i;
            const bookingInfo = localStorageService.get('bookingInfo'), segments = localStorageService.get('flightsInfo') || [];

            for (i = 0; i < bookingInfo.outwardSegments.length; i++) {
                segment = {
                    id: bookingInfo.outwardSegments[i].id.toString(),
                    origin: {
                        description: bookingInfo.outwardSegments[i].departure.airport.description,
                        code: bookingInfo.outwardSegments[i].departure.airport.code
                    },
                    destination: {
                        description: bookingInfo.outwardSegments[i].arrival.airport.description,
                        code: bookingInfo.outwardSegments[i].arrival.airport.code
                    }
                };
                segments.push(segment);
            }

            for (i = 0; i < bookingInfo.returnSegments.length; i++) {
                segment = {
                    id: bookingInfo.returnSegments[i].id.toString(),
                    origin: {
                        description: bookingInfo.returnSegments[i].departure.airport.description,
                        code: bookingInfo.returnSegments[i].departure.airport.code
                    },
                    destination: {
                        description: bookingInfo.returnSegments[i].arrival.airport.description,
                        code: bookingInfo.returnSegments[i].arrival.airport.code
                    }
                };
                segments.push(segment);

            }

            for (i = 0; i < bookingInfo.airShuttleSegments.length; i++) {
                segment = {
                    id: bookingInfo.airShuttleSegments[i].id.toString(),
                    origin: {
                        description: bookingInfo.airShuttleSegments[i].departure.airport.description,
                        code: bookingInfo.airShuttleSegments[i].departure.airport.code
                    },
                    destination: {
                        description: bookingInfo.airShuttleSegments[i].arrival.airport.description,
                        code: bookingInfo.airShuttleSegments[i].arrival.airport.code
                    }
                };
                segments.push(segment);

            }


            return segments;
        }

        function getInfoSegment (segmentId, segmentsInfo) {
            let i;
            const info = { departure: null, arrival: null };
            for (i = 0; i < segmentsInfo.length; i++) {
                if (segmentsInfo[i].id.toString() === segmentId) {
                    info.arrival = segmentsInfo[i].destination;
                    info.departure = segmentsInfo[i].origin;
                }
            }

            return info;
        }
    }
})();
