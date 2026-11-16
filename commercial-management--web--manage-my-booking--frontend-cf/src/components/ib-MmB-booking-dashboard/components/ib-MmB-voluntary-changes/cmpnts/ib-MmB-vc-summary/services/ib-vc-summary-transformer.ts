import angular from "angular";

@Service(
    'ib-MmB-vc-summary-module',
    ['$filter', 'MmBUtilService', 'MmBAppConstants', 'CurrencyService', '$sce', 'localStorageService', '$rootScope'],
    [])
export class IbVcSummaryTransformer {

    constructor(
        private $filter,
        private MmBUtilService,
        private MmBAppConstants,
        private CurrencyService,
        private $sce,
        private localStorageService,
        private $rootScope
    ) {}

    generateSummaryModel = (fareData, modeFlight, originalBookingInfo, conditionsData) => {
        var summaryModel = {
            fligthsModel: null,
            breakdownModel: null,
            totalPriceModel: null,
            fareComparisonModel: null
        };
        var unifiedOpt = null;
        unifiedOpt = this.localStorageService.get('unifiedOptionalData');
        if (this.checkFareData(fareData)) {
            summaryModel.fligthsModel = this.generateFlightsModel(fareData.offers[0].slices, fareData.fareFamilyConditions, modeFlight);
            summaryModel.breakdownModel = this.generateBreakdownModel(fareData, originalBookingInfo);
            summaryModel.totalPriceModel = this.generateTotalPriceModel(conditionsData, fareData);
            summaryModel.fareComparisonModel = this.canShowFareComparison(originalBookingInfo)
                ? this.generateFareComparisonModel(fareData, originalBookingInfo)
                : null;
        }
        if (this.localStorageService.get('isUnifiedFlow') && unifiedOpt) {
            if(!unifiedOpt.enabled) {
                //Optional es ida
                if(originalBookingInfo.order.slices[0].sliceId === unifiedOpt.sliceId) {
                    summaryModel.fligthsModel.returnFlight = this.transformSlice(fareData.offers[0].slices[0], fareData.fareFamilyConditions);
                    summaryModel.fligthsModel.outboundFlight = this.transformSlice(originalBookingInfo.order.slices[0], fareData.fareFamilyConditions);
                    summaryModel.fligthsModel.returnFlight.flightData.type = 'newFlight';
                    summaryModel.fligthsModel.returnFlight.flightData.infoMessage = 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN';
                    summaryModel.fligthsModel.outboundFlight.flightData.type = 'oldFlight';
                    summaryModel.fligthsModel.outboundFlight.flightData.infoMessage = 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND';
                }else {
                    //Optional es vuelta
                    summaryModel.fligthsModel.outboundFlight = this.transformSlice(fareData.offers[0].slices[0], fareData.fareFamilyConditions);
                    summaryModel.fligthsModel.returnFlight = this.transformSlice(originalBookingInfo.order.slices[1], fareData.fareFamilyConditions);
                    summaryModel.fligthsModel.outboundFlight.flightData.type = 'newFlight';
                    summaryModel.fligthsModel.outboundFlight.flightData.infoMessage = 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND';
                    summaryModel.fligthsModel.returnFlight.flightData.type = 'oldFlight';
                    summaryModel.fligthsModel.returnFlight.flightData.infoMessage = 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN';
                }
            }
        }
        return summaryModel;
    }

    checkFareData = (fareData) => {
        return fareData?.offers?.[0]?.slices?.length > 0;
    };

    generateFlightsModel = (slices, fareFamilyConditions, modeFlight) => {
        var modelFlights: any = {};
        if (slices && slices.length === 1) {
            modelFlights.outboundFlight = this.transformSlice(slices[0], fareFamilyConditions);
            if (modeFlight === 'twice' || modeFlight === 'outbound') {
                modelFlights.outboundFlight.flightData.type = 'newFlight';
                modelFlights.outboundFlight.flightData.infoMessage = 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND';
            } else {
                modelFlights.outboundFlight.flightData.type = 'oldFlight';
                modelFlights.outboundFlight.flightData.infoMessage = 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND';
            }
            modelFlights.returnFlight = null;
        } else if (slices.length === 2) {
            modelFlights.outboundFlight = this.transformSlice(slices[0], fareFamilyConditions);
            modelFlights.returnFlight = this.transformSlice(slices[1], fareFamilyConditions);
            if (modeFlight === 'twice' || modeFlight === 'outbound') {
                modelFlights.outboundFlight.flightData.type = 'newFlight';
                modelFlights.outboundFlight.flightData.infoMessage = 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND';
            } else {
                modelFlights.outboundFlight.flightData.type = 'oldFlight';
                modelFlights.outboundFlight.flightData.infoMessage = 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND';
            }
            if (modeFlight === 'twice' || modeFlight === 'return') {
                modelFlights.returnFlight.flightData.type = 'newFlight';
                modelFlights.returnFlight.flightData.infoMessage = 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN';
            } else {
                modelFlights.returnFlight.flightData.type = 'oldFlight';
                modelFlights.returnFlight.flightData.infoMessage = 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN';
            }
        }
        return modelFlights;
    }

    generateTotalPriceModel = (conditionsData, fareData) => {
        const isUnified = this.localStorageService.get('isUnifiedFlow');
        const terms = this.getConditionMessageValue(conditionsData, 'termsAndConditions'), totalPrice = this.getConditionMessageValue(conditionsData, 'totalPriceText');
        const totalPriceModel: any = {
            relatedContent: {
                termsAndConditions: terms ? this.$sce.trustAsHtml(terms) : 'TERMS_AND_CONDITIONS',
                totalPriceText: totalPrice ? this.$sce.trustAsHtml(totalPrice) : 'TOTAL_PRICE_TEXT'
            },
            warning: {
                type: 'default',
                icon: 'icon-informacion_2 u-color-primary',
                modifier: 'ib-message-box--center ib-message-box--boxed u-bg-gray-50 u-mb-medium',
                titleTxt: 'MMB_VOLUNTARY_CHANGE_REFUND_WARNING_TITTLE',
                titleModifier: 'ib-message-box__title--small u-color-primary',
                text: [
                    'MMB_VOLUNTARY_CHANGE_REFUND_WARNING_TEXT'
                ]
            },
            labelButton: this.$filter('translate')('MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_BUTTON_TEXT')
        };
        if(isUnified) {
            totalPriceModel.relatedContent.termsAndConditions = terms ? this.$sce.trustAsHtml(terms) : this.$sce.trustAsHtml(fareData.relatedContent[0].value);
        }
        if(this.localStorageService.get('unifiedOfferType') === 'INVOLUNTARY_CHANGE' && isUnified) {
            totalPriceModel.relatedContent.totalPriceText = '';
        }

        if (fareData.offers.length > 0 && fareData.offers[0].compensationInfo && fareData.offers[0].compensationInfo.totalCost && fareData.offers[0].compensationInfo.totalCost >= 0) {
            totalPriceModel.price = fareData.offers[0].compensationInfo.totalCost;
            totalPriceModel.label = this.$filter('translate')('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
        } else if (fareData.offers[0].compensationInfo && fareData.offers[0].compensationInfo.totalCost) {
            totalPriceModel.price = fareData.offers[0].compensationInfo.totalCompensation;
            totalPriceModel.label = this.$filter('translate')('MMB_VC_LABEL_TOTAL_PRICE_REPAY_WITH_VOUCHER');
        } else {
            totalPriceModel.price = 0;
            totalPriceModel.label = this.$filter('translate')('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
            if(isUnified){
                totalPriceModel.warning.text = ['MMB_UNIFIED_FREE_CHANGE_REFUND_WARNING_TEXT'];
            }
        }
        totalPriceModel.priceFormatted = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]), totalPriceModel.price, true);
        return totalPriceModel;
    }

    private getConditionMessageValue = (conditionsData, code) => {
        var returnValue, i;
        if(conditionsData && conditionsData.conditions && conditionsData.conditions.length > 0) {
            for(i = 0;i<conditionsData.conditions.length;i++) {
                if(conditionsData.conditions[i].code === code) {
                    returnValue = conditionsData.conditions[i].message;
                }
            }
        }
        return returnValue;
    }

    private getRelatedContentValue = (relatedCnt, key) => {
        var returnVal;
        for (let i = 0; i < relatedCnt.length; i++) {
            if(relatedCnt[i].key === key) {
                returnVal = relatedCnt[i].value;
            }
        }
        return returnVal;
    }

    /**
     * Transform the slice given into a flightCardModel
     * @param {Object} slice The slice to transform
     * @returns {Object} Complete flight card model object
     */
    transformSlice = (slice, fareFamilyConditions) => {
        let flightCardModelReady: any = {}, firstSegment, lastSegment, indexSegments;
        if (slice && slice.segments && slice.segments.length > 0) {
            firstSegment = 0;
            lastSegment = slice.segments.length - 1;

            flightCardModelReady.flightData = {};
            flightCardModelReady.flightData.icon = this.getFlightIcon(slice.segments[firstSegment].flight.marketingCarrier);
            flightCardModelReady.flightData.departureDateTime = slice.departureDateTime;
            flightCardModelReady.flightData.departureTime = this.getTime(slice.departureDateTime);
            flightCardModelReady.flightData.arrivalTime = this.getTime(slice.arrivalDateTime);
            flightCardModelReady.flightData.arrivalDateTime = slice.arrivalDateTime;
            flightCardModelReady.flightData.departureDate = this.getDate(slice.departureDateTime);
            flightCardModelReady.flightData.arrivalDate = this.getDate(slice.arrivalDateTime);
            flightCardModelReady.flightData.flightScales = this.getFlightScales(slice);
            flightCardModelReady.flightData.flightScalesNumber = slice.stopsNumber;
            flightCardModelReady.flightData.flightDuration = this.getDuration(slice.duration);
            flightCardModelReady.flightData.departureCity = this.getParsedCity(slice.segments[firstSegment].departure).name;
            flightCardModelReady.flightData.arrivalCity = this.getParsedCity(slice.segments[lastSegment].arrival).name;
            flightCardModelReady.flightData.departureAPort = this.getParsedCity(slice.segments[firstSegment].departure).code;
            flightCardModelReady.flightData.arrivalAPort = this.getParsedCity(slice.segments[lastSegment].arrival).code;

            //Fare Family Conditions
            if (fareFamilyConditions && slice.segments[lastSegment].cabin && slice.segments[lastSegment].cabin.fareFamily) {
                flightCardModelReady.fareFamilyConditions = this.transformFareConditions(slice.segments[lastSegment].cabin.fareFamily, fareFamilyConditions);
            }

            //NODES
            flightCardModelReady.flightNodes = [];
            for (indexSegments = 0; indexSegments < slice.segments.length; indexSegments++) {
                flightCardModelReady.flightNodes.push(this.transformSegments(slice.segments[indexSegments]));
            }
        } else {
            flightCardModelReady.flightData = {};
            flightCardModelReady.fareFamilyConditions = {};
            flightCardModelReady.flightNodes = [];
        }

        return flightCardModelReady;
    }

    /**
     * Transform the slice given into a flightCardModel, including the segments
     * hanging on the slice
     * @param {Object} slice The slice to transform
     * @returns {Object} Complete flight card model with all the segments parsed too
     */
    transformSegments = (segment) => {
        var index, modelData, warningModel, waningIndex;
        warningModel = {};
        modelData = {};
        modelData.nodeData = {};
        modelData.nodeData.icon = this.getFlightIcon(segment.flight.operationalCarrier);
        modelData.nodeData.departureDateTime = segment.departureDateTime;
        modelData.nodeData.arrivalDateTime = segment.arrivalDateTime;
        modelData.nodeData.departureTime = this.getTime(segment.departureDateTime);
        modelData.nodeData.arrivalTime = this.getTime(segment.arrivalDateTime);
        modelData.nodeData.departureCity = this.getParsedCity(segment.departure).name;
        modelData.nodeData.arrivalCity = this.getParsedCity(segment.arrival).name;
        modelData.nodeData.departureAPort = this.getParsedCity(segment.departure).code;
        modelData.nodeData.arrivalAPort = this.getParsedCity(segment.arrival).code;
        modelData.nodeData.flightNumber = this.getFlightNumber(segment);
        modelData.nodeData.flightPlane = this.getFlightPlane(segment);
        modelData.nodeData.flightOperator = this.getFlightOperator(segment);
        modelData.nodeData.flightDuration = this.getDuration(segment.duration);
        modelData.nodeData.waitingTime = this.getDuration(segment.waitingTime);
        modelData.activationFlags = {};
        this.getWarnings(segment, modelData.activationFlags);
        if (modelData.activationFlags.warningMissConection) {
            for (waningIndex = 0; waningIndex < warningModel.length; waningIndex++) {
                // BAD CODE, no have slice
                // if (warningModel[waningIndex].segmentID === slice.segments[index].id) {
                //     modelData.nodeData.missconnectionWarningMsg = warningModel[waningIndex].warningMsg;
                // }
            }
        }
        modelData.labels = {};
        modelData.labels.LABEL_OPERATED_BY = 'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY';
        return modelData;
    }

    /**
     * Transforms the FareFamily
     * @param {Object} fareFamily The fare family to transform
     * @param {Array} model The model
     */
    transformFareConditions = (fareFamilySlice, fareFamilyConditions) => {
        var index, condIndex, fareFamiliyConditionModel;
        fareFamiliyConditionModel = {};

        for (index = 0; index < fareFamilyConditions.length; index++) {
            if (fareFamilyConditions[index] && fareFamilyConditions[index].commercialCode === fareFamilySlice) {
                fareFamiliyConditionModel.cabin = fareFamilyConditions[index].commercialName;
                fareFamiliyConditionModel.conditions = [];
                for (condIndex = 0; condIndex < fareFamilyConditions[index].conditions.length; condIndex++) {
                    fareFamiliyConditionModel.conditions.push(fareFamilyConditions[index].conditions[condIndex]);
                }
            }
        }
        return fareFamiliyConditionModel;
    }

    /**
     * Checks if the flight has scales and returns the literal to use
     * @param {Object} sliceAffected The slice with the disruption
     * @returns {String} The literal that applies
     */
    getFlightScales = (sliceAffected) => {
        var flightType;
        if (sliceAffected.stopsNumber > 0) {
            flightType = this.MmBAppConstants.FLIGHTS_TYPES.INDIRECT;
        }
        if (sliceAffected.stopsNumber === 0) {
            flightType = this.MmBAppConstants.FLIGHTS_TYPES.DIRECT;
        }
        return flightType;
    }

    /**
     * It gets the Url Icon of the carrier given
     * @param {Object} carrier The carrier
     */
    getFlightIcon = (carrier) => {
        return this.MmBUtilService.getCompanyURL(carrier.code);
    }

    /**
     * Obtains the operational carrier
     * @param {Object} segment The segmente sorce
     * @returns {String} Carrier transformed
     */
    getFlightOperator = (segment) => {
        return this.transformCarrier(segment.flight.operationalCarrier);
    }

    /**
     * Transform the carrier given
     * @param {Object} carrier The carrier
     * @returns {String} Carrier transformed
     */
    transformCarrier = (carrier) => {
        return carrier.name;
    }

    /**
     * Obtains the flight plane
     * @param {Object} segment The segment
     * @returns the planes flight
     */
    getFlightPlane = (segment) => {
        return segment.flight.aircraft ? segment.flight.aircraft.description : '';
    }

    /**
     * Obtains the flight number of a segment
     * @param {Object} segment The segment with the flight number
     * @returns The flight number parsed
     */
    getFlightNumber = (segment) => {
        var parsedFlightNumber = '';
        parsedFlightNumber = segment.flight.marketingCarrier.code + ' ' + segment.flight.marketingFlightNumber;
        return parsedFlightNumber;
    }

    /**
     * Parses the city into a model compatible object
     * @param {Object} city The city
     * @returns The parsed
     */
    getParsedCity = (city) => {
        var parsedCity: any = {};
        parsedCity.code = city.code;
        parsedCity.name = city.city.description;
        return parsedCity;
    }

    /**
     * Parses the duration given
     * @param {Integer} duration The duration to parse
     */
    getDuration = (duration) => {
        return this.$filter('DurationFormatFilter')(duration);
    }

    /**
     * Returns the departure parsed date
     * @param {Object} segment The segment with departure date
     * @returns {String} The parsed date
     */
    getDate = (dateTime) => {
        if (dateTime.indexOf(' ') > -1) {
            return dateTime.split(' ')[0];
        }
        return dateTime;
    }

    /**
     * Returns the time parsed
     * @param {Object} segment The segment with departure date
     * @returns {String} The parsed date
     */
    getTime = (dateTime) => {
        if (dateTime.indexOf(' ') > -1) {
            return dateTime.split(' ')[1];
        }
        return '';
    }

    /**
     * Gets all the warnings associated to the segment
     * @param {segment} segment The segment to check
     */
    getWarnings = (segment, model) => {
        var index;
        if (segment.warnings) {
            for (index = 0; index < segment.warnings.length; index++) {
                this.generateWarning(model, segment.warnings[index]);
            }
        }
    }

    /**
     * Generates a simple basic warning
     * @param {Object} model
     * @param {Object} warning simple object with the parsed text
     */
    generateWarning = (model, warning) => {
        if (warning.code === this.MmBAppConstants.WARNING_MESSAGES.AIRPORT_CHANGE_WARNING) {
            model.warningAirport = true;
            model.warningAirportMsg = warning.description;
        }
        if (warning.code === this.MmBAppConstants.WARNING_MESSAGES.TERMINAL_CHANGE_WARNING) {
            model.warningTerminal = true;
            model.warningTerminalMsg = warning.description;
        }
        if (warning.code === this.MmBAppConstants.WARNING_MESSAGES.LONG_WAITING_WARNING) {
            model.warningFlightStop = true;
        }
        if (warning.code === this.MmBAppConstants.WARNING_MESSAGES.OVERNIGHT_WARNING) {
            model.warningOvernight = true;
        }
    }

    generateBreakdownModel = (fareData, originalBookingInfo) => {
        var breakdownModel = {
            refund: null,
            toPay: null,
            emds: null
        };
        var currencyObject = this.CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]);
        if (fareData && fareData.offers.length > 0 && fareData.offers[0].compensationInfo) {
            if (fareData.offers[0].compensationInfo.totalCost >= 0) {
                breakdownModel.toPay = {};
                breakdownModel.toPay.total = fareData.offers[0].compensationInfo.totalCost;
                breakdownModel.toPay.totalFormatted = this.CurrencyService.formatPrice(currencyObject, breakdownModel.toPay.total, true);
                breakdownModel.toPay.passengersTypes = [];
                if (fareData.offers[0].compensationInfo.fareChangesCost.length > 0) {
                    breakdownModel.toPay.passengersTypes = this.generatedPassengerTypeInfo(fareData.offers[0].compensationInfo.fareChangesCost, false, currencyObject, true);
                }
            }
            if (fareData.offers[0].compensationInfo.totalCompensation > 0) {
                breakdownModel.refund = {};
                breakdownModel.refund.total = fareData.offers[0].compensationInfo.totalCompensation;
                breakdownModel.refund.totalFormatted = this.CurrencyService.formatPrice(currencyObject, breakdownModel.refund.total, true);
                breakdownModel.refund.passengersTypes = [];
                if (fareData.offers[0].compensationInfo.fareChangesCompensation.length > 0) {
                    breakdownModel.refund.passengersTypes = this.generatedPassengerTypeInfo(fareData.offers[0].compensationInfo.fareChangesCompensation, true, currencyObject, false);
                }
                breakdownModel.refund.showRefundTableForPassenger = breakdownModel.refund.passengersTypes && Object.keys(breakdownModel.refund.passengersTypes).length > 0;
            }

            if (fareData.offers[0].compensationInfo.emds && fareData.offers[0].compensationInfo.emds.length > 0) {
                breakdownModel.emds = {};
                breakdownModel.emds.types = {};
                breakdownModel.emds.totalEmds = 0;
                breakdownModel.emds.types.baggage = {
                    title: this.$filter('translate')('MMB_VC_SUMMARY_EMD_BAGGAGE_TITLE'),
                    show: false,
                    globalItem: false,
                    flights: []
                };
                breakdownModel.emds.types.seat = {
                    title: this.$filter('translate')('MMB_VC_SUMMARY_EMD_SEAT_TITLE'),
                    show: false,
                    globalItem: false,
                    flights: []
                };
                breakdownModel.emds.types.flexibility_on_demand = {
                    title: this.$filter('translate')('ANCILLARIES_FLEXIBILITY_TITLE'),
                    show: false,
                    globalItem: true,
                    flights: []
                };
                breakdownModel.emds.types.special_equipment = {
                    title: this.$filter('translate')('MMB_VC_SUMMARY_EMD_SPECIAL_EQUIPMENT_TITLE'),
                    show: false,
                    globalItem: false,
                    flights: []
                };
                breakdownModel.emds.types.priority_boarding = {
                    title: this.$filter('translate')('PRIORITY_BOARDING_TITLE'),
                    show: false,
                    globalItem: false,
                    flights: []
                };
                angular.forEach(originalBookingInfo.order.slices, (slice) => {
                    breakdownModel.emds.types.baggage.flights.push(this.getSliceInformation(slice));
                    breakdownModel.emds.types.seat.flights.push(this.getSliceInformation(slice));
                    breakdownModel.emds.types.flexibility_on_demand.flights.push(this.getSliceInformation(slice));
                    breakdownModel.emds.types.special_equipment.flights.push(this.getSliceInformation(slice));
                    breakdownModel.emds.types.priority_boarding.flights.push(this.getSliceInformation(slice));
                });
                angular.forEach(fareData.offers[0].compensationInfo.emds, (emdInfo) => {
                    this.generatedEmdModel(fareData, emdInfo, breakdownModel.emds);
                });
                breakdownModel.emds.totalEmds = fareData.offers[0].compensationInfo.totalCompensation;
                breakdownModel.emds.totalEmdsFormatted = this.CurrencyService.formatPrice(currencyObject, fareData.offers[0].compensationInfo.totalCompensation, true);
            }
        }
        this.localStorageService.set('summaryCVBounds', breakdownModel);
        return breakdownModel;
    }

    generatedPassengerTypeInfo = (passengerData, isCompensation, currencyObject, toPay) => {
        var passengersModel = {}, passengerTypeModel;
        angular.forEach(passengerData, (pasengerInfo) => {
            if (pasengerInfo.total >= 0 && toPay) {
                passengerTypeModel = {};
                passengerTypeModel.number = pasengerInfo.quantity;
                passengerTypeModel.type = pasengerInfo.passengerType;
                if (passengerTypeModel.number > 1) {
                    passengerTypeModel.typeLabel = this.$filter('translate')('SOME_' + passengerTypeModel.type);
                } else {
                    passengerTypeModel.typeLabel = this.$filter('translate')(passengerTypeModel.type);
                }
                switch (passengerTypeModel.type) {
                    case 'ADULT':
                        passengerTypeModel.icon = 'icon-persona';
                        break;
                    case 'CHILD':
                        passengerTypeModel.icon = 'icon-iberia_ninos';
                        break;
                    case 'INFANT':
                        passengerTypeModel.icon = 'icon-bebe';
                        break;
                    default:
                        passengerTypeModel.icon = 'icon-persona';
                        break;
                }
                passengerTypeModel.differenceWithNewFlight = pasengerInfo.unitPrice;
                passengerTypeModel.differenceWithNewFlightFormatted = this.CurrencyService.formatPrice(currencyObject, pasengerInfo.unitPrice, true);
                passengerTypeModel.totalForPassengerType = pasengerInfo.total;
                passengerTypeModel.totalForPassengerTypeFormatted = this.CurrencyService.formatPrice(currencyObject, isCompensation ? (pasengerInfo.total * -1) : pasengerInfo.total, true);
                passengersModel[pasengerInfo.passengerType] = passengerTypeModel;
            }
        });
        return passengersModel;
    }

    generatedEmdModel = (fareData, emdInfo, emdsModel) => {
    var emdModel, totalEmds = 0;
    const typeKey = emdInfo.type?.toLowerCase();
    const emdType = emdsModel.types[typeKey];
    const currency = this.CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]);

    if (emdType && emdType.flights) {
        angular.forEach(emdInfo.items, (item) => {
            emdModel = {};
            emdModel.unitPrice = item.unitPrice;
            emdModel.quantity = item.quantity;
            emdModel.unitPriceFormatted = this.CurrencyService.formatPrice(currency, emdModel.unitPrice, true);
            emdModel.totalPrice = item.total * -1;
            emdModel.totalPriceFormatted = this.CurrencyService.formatPrice(currency, emdModel.totalPrice, true);

            if (emdInfo.type !== 'FLEXIBILITY_ON_DEMAND') {
                angular.forEach(emdType.flights, (flight) => {
                    if (flight.sliceId === item.sliceId) {
                        emdType.show = true;
                        flight.tickets.push(emdModel);
                    }
                });
            } else {
                angular.extend(emdType, emdModel);
                emdType.show = true;
            }
        });

        emdsModel.totalEmds += totalEmds;
        emdsModel.totalEmdsFormatted = this.CurrencyService.formatPrice(currency, emdsModel.totalEmds, true);

        angular.forEach(emdType.flights, (flight) => {
            if (!flight.tickets || !flight.tickets[0]) {
                emdType.flights.splice(emdType.flights.indexOf(flight), 1);
            }
        });
    }
    }

    getSliceInformation = (slice) => {
        var departure = slice.segments[0].departureCity;
        var arrival = slice.segments[slice.segments.length - 1].arrivalCity;
        var sliceId = slice.sliceId;
        return {
            'sliceId': sliceId,
            'departureCity': departure.description,
            'departureCode': departure.code,
            'arrivalCity': arrival.description,
            'arrivalCode': arrival.code,
            'tickets': []
        };
    }

    canShowFareComparison = (originalBookingInfo): boolean => {
        if (!originalBookingInfo || originalBookingInfo.channel !== 'IBCOM') {
            return false;
        }
        if (!originalBookingInfo.fareFamilyConditions || 
            originalBookingInfo.fareFamilyConditions.length === 0) {
            return false;
        }
        if (this.$rootScope.isDisruptionFlow) {
            return false;
        }

        return true;
    }

    generateFareComparisonModel = (fareData, originalBookingInfo) => {
        const slices = fareData?.offers?.[0]?.slices;
        if (!slices?.length) return null;

        const comparisonSlices = slices
        .map((slice, index) => this.buildComparisonSlice(slice, index, fareData, originalBookingInfo))
        .filter(slice => this.sliceHasFareChanges(slice.previousFareFamily, slice.newFareFamily));

        if (!comparisonSlices.length) return null;
        return { slices: comparisonSlices };
    }

    buildComparisonSlice = (slice, index, fareData, originalBookingInfo) => {
        const newFareFamilyCode = this.getFareFamilyCodeFromSlice(slice);
        const newFareFamily = this.getFareFamilyByCode(fareData.fareFamilyConditions, newFareFamilyCode);
        const originalSlice = originalBookingInfo.order.slices[index];
        const previousFareFamilyCode = this.getFareFamilyCodeFromSlice(originalSlice);
        const previousFareFamily = this.getFareFamilyByCode(originalBookingInfo.fareFamilyConditions, previousFareFamilyCode);

        return {
            sliceId: slice.sliceId,
            origin: slice.origin,
            destination: slice.destination,
            previousFareFamily,
            newFareFamily
        };
    }

    getFareFamilyCodeFromSlice = (slice): string | null => {
        const lastSegment = slice?.segments?.[slice.segments.length - 1];
        return lastSegment?.cabin?.fareFamily || null;
    }

    getFareFamilyByCode = (fareFamilyConditions, code) => {
        if (!fareFamilyConditions || !code) return null;
        return fareFamilyConditions.find(fareFamilyCondition => fareFamilyCondition.commercialCode === code) || null;
    }

    haveConditionsDifferences = (previousConditions, newConditions): boolean => {
        if (!previousConditions || !newConditions) return false;
        if (previousConditions.length !== newConditions.length) return true;

        return previousConditions.some(prevCondition => {
            const newCondition = newConditions.find(condition => condition.code === prevCondition.code);
            if (!newCondition) return true;
            return prevCondition.code !== newCondition.code;
        });
    }

    sliceHasFareChanges = (previousFareFamily, newFareFamily): boolean => {
        if (!previousFareFamily || !newFareFamily) return false;
        return previousFareFamily.commercialName !== newFareFamily.commercialName;
    }
}