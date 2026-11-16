import * as angular from 'angular';
import dayjs from 'dayjs';
import { MmBUtilsSharedService } from '@src/components/services/Utils/ib-MmB-utils-shared-service';
@Service(
    'ib-disruption-main-module',
    ['DisruptionDashboardConstants', 'localStorageService', 'MmBAppConstants', 'EvaluatorConst', 'MmBUtilsSharedService'],
    []
)
export class DisruptionUtilService {
    constructor (
        private DisruptionDashboardConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBAppConstants: MmBAppConstants,
        private EvaluatorConst: EvaluatorConst,
        private MmBUtilsSharedService: MmBUtilsSharedService) {}

    /**
     * Search all the slices in a order according to the function (criteria) passed
     * The function must return the array with all the slices which fit the criteria passed
     * @param {Object} order THe order to search
     * @param {Function} criteria The criteria to select an slice
     * @return {Object} List of slices
     */
    searchSlices = (order, criteria) => {
        var sliceIndex, sliceFound = false, slices = [], result;
        for (sliceIndex = 0; sliceIndex < order.slices.length; sliceIndex++) {
            result = criteria(order.slices[sliceIndex]);
            if (result.isCriteriaOk) {
                sliceFound = true;
                if (result.filterSlice) {
                    slices.push(angular.copy(result.filterSlice));
                } else {
                    slices.push(order.slices[sliceIndex]);
                }

            }
        }
        return sliceFound ? slices : null;
    };

    /**
     * Return all the slice without filters
     * fake criterian to keep code structure
     * @param {Object} slice
     * @returns
     */
    criteriaNone = (slice) => {
        var copySlice = angular.copy(slice);
        return { 'isCriteriaOk': true, 'filterSlice': copySlice };
    };

    /**
     * Validates if the slice has an alternative change
     *  @param {Object} slice The container of the disruption
     *  @returns {Object} Returns boolean when its a valid case, when is not valid, returns null, and return filtered slice
     */
    criteriaAlternmativeChange = (slice) => {
        var segmentIndex, isAlternative, copySlice = angular.copy(slice);
        isAlternative = 0;
        for (segmentIndex = 0; segmentIndex < copySlice.segments.length; segmentIndex++) {
            if (copySlice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.PENDING && copySlice.segments[segmentIndex].relatedDisruptedSegmentId) {
                isAlternative++;
            } else if (copySlice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.UNABLE) {
                copySlice.segments.splice(segmentIndex, 1);
                segmentIndex--;
            }
        }
        if (isAlternative === 0) {
            copySlice.segments.splice(0, copySlice.segments.length);
        }
        return { 'isCriteriaOk': isAlternative, 'filterSlice': copySlice };
    };
    /**
     * Validates if the slice has a schedule change
     *  @param {Object} slice The container of the disruption
     *  @returns {Object} Returns boolean when its a valid case, when is not valid, returns null, and return filtered slice
     */
    criteriaScheduleChange = (slice) => {
        var segmentIndex, isAlternative, isShedule = false, copySlice = angular.copy(slice), sliceWithUnable;
        isAlternative = 0;
        sliceWithUnable = false;
        for (segmentIndex = 0; segmentIndex < copySlice.segments.length; segmentIndex++) {
            if (copySlice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.PENDING) {
                if (copySlice.segments[segmentIndex].relatedDisruptedSegmentId) {
                    isAlternative++;
                } else {
                    isShedule = true;
                }
            } else if (copySlice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.UNABLE) {
                copySlice.segments.splice(segmentIndex, 1);
                segmentIndex--;
                sliceWithUnable = true;
            }

        }
        if (isAlternative > 0 || sliceWithUnable) {
            copySlice.segments.splice(0, copySlice.segments.length);
            isShedule = false;
        }
        return { 'isCriteriaOk': isShedule, 'filterSlice': copySlice };
    };

    /**
     * Validates if the slice has a schedule change
     *  @param {Object} slice The container of the disruption
     *  @returns {Object} Returns boolean when its a valid case, when is not valid, returns null, and return filtered slice
     */
    criteriaFlightChange = (slice) => {
        var segmentIndex, isCancel, copySlice = angular.copy(slice);
        isCancel = false;
        for (segmentIndex = 0; segmentIndex < copySlice.segments.length; segmentIndex++) {
            if (copySlice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.UNABLE) {
                isCancel = true;
                copySlice.isCancel = true;
            } else if (copySlice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.PENDING && copySlice.segments[segmentIndex].relatedDisruptedSegmentId) {
                copySlice.segments.splice(segmentIndex, 1);
                segmentIndex--;
            }
        }
        return { 'isCriteriaOk': isCancel, 'filterSlice': copySlice };
    };

    /**
     * Validates if the slice has a confirmed status
     *  @param {Object} slice The slice confirmed
     *  @returns {Object} Returns boolean when its a valid case, when is not valid, returns null, and return filtered slice
     */
    criteriaFlightConfirmed = (slice) => {
        var segmentIndex, segmentSize, isConfirmed;
        segmentSize = slice.segments.length;
        segmentIndex = 0;
        isConfirmed = true;
        while (segmentIndex < segmentSize) {
            if (slice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.UNABLE ||
                slice.segments[segmentIndex].status.code === this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.PENDING) {
                isConfirmed = false;
            }
            segmentIndex += 1;
        }
        return { 'isCriteriaOk': isConfirmed ? !this.anySegmentFlown(slice) : isConfirmed, 'filterSlice': slice };
    };

    criteriaSegmentOperatedNotIberia = (slice) => {
        var segmentIndex, segmentSize, notIberia;
        segmentSize = slice.segments.length;
        segmentIndex = 0;
        notIberia = false;
        while (segmentIndex < segmentSize) {
            if (this.DisruptionDashboardConstants.OPERATIONAL_GROUP_IBERIA.indexOf((slice.segments[segmentIndex].flight.operationalCarrier.code)) === -1 ) {
                notIberia = true;
            }
            segmentIndex += 1;
        }
        return { 'isCriteriaOk': notIberia, 'filterSlice': slice };
    };

    criteriaCabinDowngrade = (slice) => {
        const downgradeCodes: any = this.localStorageService.get('downgradeCodes');

        const downgradeSegment = slice.segments.find(segment => {
            const warning = segment.warnings?.find( warning => warning.code === this.DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME || warning.code === this.DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME);
            if(warning) {
                downgradeCodes.push(warning.code);
                this.localStorageService.set('downgradeCodes', downgradeCodes);
            }
            return warning;
        }
        );
        return { isCriteriaOk: !!downgradeSegment, filterSlice: slice };
    };

    /**
     * Checks if the slice has any segment already flown
     * @param {Object} slice Slice
     */
    private anySegmentFlown = (slice) => {
        var sIndex, flown;
        sIndex = 0;
        flown = false;
        while (sIndex < slice.segments.length && !flown) {
            flown = slice.segments[sIndex].flown;
            sIndex++;
        }
        return flown;
    };

    /**
     * Validates if the slice has the search enabled
     * @param {*} slice Slice to evaluated
     */
    criteriaFlightSearchEnabled = (slice) => {
        return {
            'isCriteriaOk': (this.getPassengerFlag(slice, 0, this.DisruptionDashboardConstants.FLOW_FLAGS.DISRUPTION_SEARCH) || this.getPassengerFlag(slice, 0, this.DisruptionDashboardConstants.FLOW_FLAGS.GENERIC_DISRUPTION_SEARCH)) ? !this.anySegmentFlown(slice) : false
        };
    };

    /**
     * Gets the value of the flag passed
     *
     * @param {Object} slice The slice to check
     * @param {number} passengerId  Index of the passenger to check
     * @param {String} flag Code of the flag
     */
    private getPassengerFlag = (slice, passengerId, flag) => {
        return this.getFlagValue(slice.passengerFlags[passengerId].flags, 'type', 'enabled', flag);
    };

    /**
     * Checks if the order has activated any of the refund flags
     * @param {Object} orderFlags The object to search for the flag
     * @returns {Boolean} If the slice contains or not any refund flag
     */
    isFlightRefundEnabled = (orderFlags) => {
        var result, typeIndex;
        typeIndex = 0;
        result = false;
        while (typeIndex < this.DisruptionDashboardConstants.REFUND_FLAGS.length && !result) {
            result = this.getFlagValue(orderFlags, 'type', 'enabled', this.DisruptionDashboardConstants.REFUND_FLAGS[typeIndex].flag);
            typeIndex++;
        }
        return result;
    };

    /**
     * Validates based on flags if the refund area
     * have to be hidden
     * @param {Object} orderFlags The object to search for the flags
     */
    evaluateRule = (orderFlags, conditionObject) => {
        const resolveValue = (orderFlags, rule) => {
            var result;
            switch (rule.type) {
                    case 'flag':
                        result = this.getFlagValue(orderFlags, 'type', 'enabled', rule.value);
                        break;
                    case 'rule':
                        result = this.evaluateRule(orderFlags, this.EvaluatorConst.REFUND_FLAG_EVALUATOR[rule.value]);
                        break;
            }
            return result;
        };

        var index, operatorSaved, currentValue, accumValue, resultValue, applyNot;
        accumValue = null;
        currentValue = null;
        operatorSaved = null;
        index = 0;
        while (index < conditionObject.RULES.length) {
            applyNot = false;
            if (conditionObject.RULES[index].type === 'oper') {
                if (conditionObject.RULES[index].value === 'NOT') {
                    applyNot = true;
                    index++;
                } else {
                    operatorSaved = conditionObject.RULES[index].value;
                }
            }
            if (conditionObject.RULES[index].type !== 'oper' || applyNot) {
                currentValue = resolveValue(orderFlags, conditionObject.RULES[index]);
                if (applyNot) {
                    currentValue = !currentValue;
                }
                if (operatorSaved !== null) {
                    resultValue = this.EvaluatorConst.LOGICAL_OPERATOR[operatorSaved](accumValue, currentValue);
                    accumValue = resultValue;
                    operatorSaved = null;
                } else {
                    accumValue = currentValue;
                }
                currentValue = null;
            }
            index++;
        }
        return accumValue;
    };


    /**
     *
     * @param {Object} containerObj The flags container
     * @param {String} attribName Name of the atribute which holds the flag name
     * @param {String} attribValue Name of the property which holds the flag value
     * @param {String} flagName Value of the flag to evaluate
     */
    private getFlagValue = (containerObj, attribName, attribValue, flagName) => {
        var flagIndex, found, value;
        flagIndex = 0;
        found = false;
        value = false;
        if (containerObj) {
            while (flagIndex < containerObj.length && !found) {
                if (containerObj[flagIndex][attribName] === flagName) {
                    found = true;
                    value = containerObj[flagIndex][attribValue];
                }
                flagIndex++;
            }
        }
        return value;
    };

    /**
     * Define the PNR type to process
     * @param {String} orderStatus
     */
    getDisruptionType = (orderStatus, flexibilizationCapabilitiesInfo, hasTickets, disruptionTime) => {
        var type, hasMissconnection = false;
        hasMissconnection = this.checkOrderWarningList(this.DisruptionDashboardConstants.FLIGHTS_WARNINGS.CONECTION_LOST);
        const downgradeCodes: any = this.localStorageService.get('downgradeCodes');
        switch (orderStatus) {
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_FLAG:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.CANCELATION_CHANGE_NO_REACOM_MISSCONECTION : (!flexibilizationCapabilitiesInfo ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_GENERAL : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_FLAG:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.CANCELATION_CHANGE_MISSCONECTION : (!flexibilizationCapabilitiesInfo ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_REACOM_GENERAL : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_REACOM);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.SCHEDULE_CHANGE:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.SCHEDULE_TIME_CHANGE_MISSCONECTION : (!flexibilizationCapabilitiesInfo ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_TIME_GENERAL : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_TIME);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_MIXED_CHANGE:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.CANCELATION_CHANGE_MIXTED_MISSCONECTION : (!flexibilizationCapabilitiesInfo ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_MIXED_GENERAL : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_MIXED);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_MIXED_CHANGE:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION : (!flexibilizationCapabilitiesInfo ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_MIXED_GENERAL : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_MIXED);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_CHANGES:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.GENERIC_MISSCONECTION : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_GENERIC;
                    this.localStorageService.set('specialOrderStatus', true);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.WAITLIST_CONFIRMED_CHANGES:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.GENERIC_MISSCONECTION : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_GENERIC;
                    this.localStorageService.set('specialOrderStatus', true);
                    break;
                case this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.DISRUPTION_CHANGES_MIXED:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.GENERIC_MISSCONECTION : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_GENERIC;
                    this.localStorageService.set('specialOrderStatus', true);
                    break;
                default:
                    type = hasMissconnection ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.SCHEDULE_CHANGE_MISSCONECTION : (!flexibilizationCapabilitiesInfo ? this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_GENERAL : this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE);
                    break;
        }

        if ((orderStatus === this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_FLAG || orderStatus === this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_MIXED_CHANGE)) {
            if (downgradeCodes.includes(this.DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME)) {
                type = this.DisruptionDashboardConstants.DISRUPTION_TYPES.DOWNGRADE_DIFF_FLIGHT;
            } else if ((!downgradeCodes.includes(this.DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME) && downgradeCodes.includes(this.DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME))) {
                type = this.DisruptionDashboardConstants.DISRUPTION_TYPES.DOWNGRADE_SAME_FLIGHT;
            }
        }
        /*else {
            type = this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_GENERIC;
        }*/
        return type;
    };

    /* Handler to check if the PNR is FLXX then set correct quadrigam */
    private checkFLXX = (quadrigam: string): string => {
        const bookingInfo = this.localStorageService.get('bookingInfo') as {
            order: { status: string };
            genericDisruptionCapabilitiesInformation: { disruptionTime: string };
        };

        const status = bookingInfo.order?.status;
        const disruptionTime = bookingInfo.genericDisruptionCapabilitiesInformation?.disruptionTime;

        const isUnconfirmedChange = status === 'UNCONFIRMED_CHANGES';
        const isOperationalDisruption = disruptionTime === 'OPERATIONAL_TIME';

        if (isUnconfirmedChange && isOperationalDisruption) {
            return this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_NO_ALTERNATIVE;
        }

        return quadrigam;
    }
    
    /**
     * Checks whether the given departure date is within the next 2 days from today.
     * Returns true if the date is imminent (less than 2 days away), false otherwise.
     * @param {string | Date} initDate - The departure date to evaluate.
     * @returns {boolean} True if the departure date is less than 2 days from now.
     */
    checkDates (initDate) {
        const diff = dayjs(initDate).diff(dayjs(), 'day');
        return diff < 2;
    }

    /**
         * This function initialize quadrigam info and update the information in the
         * datalayer_general and MONETATE quadrigam.
         *  */
    initializeQuadrigam (model, orderStatus, orderSlices) {
        var quadrigamValue = null;
        var process = null;

        model.selectorFlights = model.selectorFlights ? model.selectorFlights : model;
        if (model.selectorFlights.quadrigam) {
            quadrigamValue = model.selectorFlights.quadrigam;
        } else {
            model.selectorFlights.quadrigam = {};
            quadrigamValue = this.getQuadrigam(model, orderStatus, orderSlices).DISRUPTION_PAGE;
            if (quadrigamValue === null) {
                quadrigamValue = this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN;
            }
            quadrigamValue = this.checkFLXX(quadrigamValue);
            model.selectorFlights.quadrigam = quadrigamValue;
        }

        process = this.MmBUtilsSharedService.getProcessByStatus(quadrigamValue, orderStatus);

        this.MmBUtilsSharedService.updateQuadrigam(quadrigamValue, process);
    }

    initializeSlicesList (order) {
        var result, sliceIndex;
        result = {};
        result.reacomList = {};
        result.canceledList = {};
        result.confirmedList = {};
        result.sheduleList = {};
        result.searchList = {};
        result.downgradeList = {};
        result.searchList.list = [];

        for (sliceIndex = 0; sliceIndex < order.slices.length; sliceIndex++) {
            order.slices[sliceIndex].numSlicesTotal = order.slices.length;
            order.slices[sliceIndex].indexTotal = sliceIndex;
        }

        result.isScheduleChange = order.status === this.DisruptionDashboardConstants.ORDER_STATUS_VALUES.SCHEDULE_CHANGE;
        result.reacomList.list = this.searchSlices(order, this.criteriaAlternmativeChange);
        result.reacomList.code = this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.PENDING;
        result.sheduleList.list = this.searchSlices(order, this.criteriaScheduleChange);
        result.sheduleList.code = this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.SHEDULE;
        result.canceledList.list = this.searchSlices(order, this.criteriaFlightChange);
        result.canceledList.code = this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.UNABLE;
        result.confirmedList.list = this.searchSlices(order, this.criteriaFlightConfirmed);
        result.confirmedList.code = this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.CONFIRMED;
        result.searchList.list = result.canceledList.list ? result.searchList.list.concat(result.canceledList.list) : result.searchList.list;
        result.searchList.list = chackFlownSegments(result.sheduleList.list);
        result.downgradeList.list = this.searchSlices(order, this.criteriaCabinDowngrade);
        result.downgradeList.code = this.DisruptionDashboardConstants.SEGMENT_STATUS_VALUES.DOWNGRADE;
        return result;

        function chackFlownSegments (scheduleList) {
            let sliceIndex, segmentIndex, availableSlice,
                availableSlicesList = {
                    list: []
                }, resp = result.searchList.list;

            if (scheduleList) {
                for (sliceIndex = 0; sliceIndex < scheduleList.length; sliceIndex++) {
                    availableSlice = true;
                    for (segmentIndex = 0; segmentIndex < scheduleList[sliceIndex].segments.length; segmentIndex++) {
                        if (scheduleList[sliceIndex].segments[segmentIndex].flown) {
                            availableSlice = false;
                        }
                    }
                    if (availableSlice) {
                        availableSlicesList.list.push(scheduleList[sliceIndex]);
                    }
                }
                if (availableSlicesList.list.length >= 1) {
                    resp = result.searchList.list.concat(availableSlicesList.list);
                }
            } else {
                resp = result.searchList.list = result.searchList.list;
            }

            return resp;
        }
    }

    /**
     * This functions return a objet with all information about quadrigam.
     * According to flow disruption, assign a type and set a varible of localStorage to distinc in diferrent views.
     * @param {Object} model is the model that disruption page used.
     * @param {String} orderStatus is the type the order.
     * @param {Object} orderSlices is a object with all information with slices type
     * @returns {Object} quadrigamObj is information about quadrigam.
     *  */
    getQuadrigam = (model, orderStatus, orderSlices) => {
        let quadrigamObj = {
            'DISRUPTION_PAGE': null,
            'TYPE_DISRUPTION_FLOW': null
        };
        /* Added quadrigam to flights cancelled without alternative change and with flexibilization available */
        if (model.flagSelectorDate && model.selectorFlights) {
            if (model.selectorFlights.flightsNumber === 1) {
                quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY;
            } else if (model.selectorFlights.flightsNumber > 1) {
                quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN;
                if (model.selectorFlights.optional !== null) {
                    quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL;
                }
            }
        }
        const disruptionTime = model.isGenericDisruption?.disruptionTime;

        if (this.getDisruptionType(orderStatus, false, false, disruptionTime) === this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_REACOM 
            || this.getDisruptionType(orderStatus, false, false, disruptionTime) === this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_REACOM_GENERAL) {
            quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_WITHOUT_FLEXIBILIZATION;
            const checkUNTK = orderSlices.canceledList.list !== null && orderSlices.reacomList.list !== null;

            /* flights with total alternative */
            if (checkUNTK && orderSlices.confirmedList.list === null) {
                /* With flexibilization */
                if (model.selectorFlights.flights && model.selectorFlights.optional === null) {
                    quadrigamObj.DISRUPTION_PAGE = orderSlices.reacomList.list.length === model.selectorFlights.slices.length ?
                        this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL :
                        this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL;
               
                    quadrigamObj.TYPE_DISRUPTION_FLOW = this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION;
                }
                /* Without flexibilization */
                if (!model.selectorFlights.flights) {
                    quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL;
                    quadrigamObj.TYPE_DISRUPTION_FLOW = this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERANTIVE_TOTAL_WITHOUT_FLEXIBILIZATION;
                }
            }

            /* Flights with parcial alternative */
            if (checkUNTK && orderSlices.confirmedList.list !== null) {
                /* With flexibilization */
                if (model.selectorFlights.flights && model.selectorFlights.optional !== null) {
                    quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL;
                    quadrigamObj.TYPE_DISRUPTION_FLOW = this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION;
                }
                /* Without flexibilization */
                if (!model.selectorFlights.flights) {
                    quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL;
                    quadrigamObj.TYPE_DISRUPTION_FLOW = this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION;
                }
            }
            this.localStorageService.set('typeDisruptionFlow', quadrigamObj.TYPE_DISRUPTION_FLOW);
        } else if (this.getDisruptionType(orderStatus, false, false, disruptionTime) === this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_TIME || this.getDisruptionType(orderStatus, false, false, disruptionTime) === this.DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_TIME_GENERAL) {
            if(disruptionTime==='COMMERCIAL_TIME') {
                quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_TIME_TK_COMMERCIAL;
            }
            else if(disruptionTime==='OPERATIONAL_TIME') {
                quadrigamObj.DISRUPTION_PAGE = this.MmBAppConstants.QUADRIGAM.DISRUPTION_CHANGE_TIME_TK_OPERATIONAL;
            }
        }
        return quadrigamObj;
    };

    private checkOrderWarningList = (warning) => {
        var bookingInfo: any = this.localStorageService.get('bookingInfo'), slices = bookingInfo.order.slices,
            missconnectionWarningFound = false, warningIndex, sliceIndex, segmentIndex, hasMissconnection = false, warningList = [],
            warningObject = {
                'segmentID': '',
                'warningMsg': ''
            };

        for (sliceIndex = 0; sliceIndex < slices.length; sliceIndex++) {
            for (segmentIndex = 0; segmentIndex < slices[sliceIndex].segments.length; segmentIndex++) {
                if (slices[sliceIndex].segments[segmentIndex].warnings) {
                    for (warningIndex = 0; warningIndex < slices[sliceIndex].segments[segmentIndex].warnings.length; warningIndex++) {
                        if (slices[sliceIndex].segments[segmentIndex].warnings[warningIndex].code === warning) {
                            hasMissconnection = true;
                            missconnectionWarningFound = true;
                            warningObject.segmentID = slices[sliceIndex].segments[segmentIndex].id;
                            warningObject.warningMsg = slices[sliceIndex].segments[segmentIndex].warnings[warningIndex].description;
                            warningList.push(angular.copy(warningObject));
                        }
                    }
                }
            }
        }

        if (hasMissconnection) {
            this.localStorageService.set('missconnectionWarningMessage', warningList);
        }

        return hasMissconnection;
    };

    orderItemContained = (orderItTrans, typeList) => {
        var i = 0, found = false;
        while(i<typeList.length && !found){
            if(orderItTrans[typeList[i]]){
                found = true;
            }
            i++;
        }
        return found;
    };

    getDateRange = (capabilities) => {
        let value = this.DisruptionDashboardConstants.DEFAULT_MAX_MODIFICATION_DAYS;
        if(capabilities && capabilities.calendarDateRange) {
            value = parseInt(capabilities.calendarDateRange);
        }
        return value;
    };

    /* This function is executed when typeFlowDisruption variable exist in sessionStorage.
        * This quadrigams are return by flows differents to Cancelations flights with flexibilization.
        *Flows are: Cancelation with Alterantiva and sub-flows.
        * **/
    quadrigamByTypeFlow = (typeFlowDisruption, optional) => {
        let quadrigam:string = '';
        if (typeFlowDisruption) {
            switch (typeFlowDisruption) {
                /* With flexibilization */
                case this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION:
                    quadrigam = this.MmBAppConstants.QUADRIGAM.CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL;
                    break;
                case this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION:
                    if (optional) {
                        quadrigam = this.MmBAppConstants.QUADRIGAM.CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL;
                    } else {
                        quadrigam = this.MmBAppConstants.QUADRIGAM.CONFIRMATION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL;
                    }
                    break;
                /* END With flexibilization */
                /* Without flexibilization */
                case this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERANTIVE_TOTAL_WITHOUT_FLEXIBILIZATION:
                    quadrigam = this.MmBAppConstants.QUADRIGAM.MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL;
                    break;
                case this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION:
                    quadrigam = this.MmBAppConstants.QUADRIGAM.MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL;
                    break;
                default: quadrigam = '';
            }
        }
        return quadrigam;
    };

    /**
     * Checks whether the given flights are delayed.
     * @param {object[]} slices - The flight slices to evaluate.
     * @returns {object[]} An array of delayed flight slices.
     */
    checkDelayedFlights = (slices) => {
        let delayedFlights = [];
        if (!slices) {
            return delayedFlights;
        }

        // Filter slices that have DELAY in disruptionTypes
        delayedFlights = slices.filter(slice => 
            slice?.disruptionTypes?.includes('DELAY')
        );

        return delayedFlights;
    }

    /**
     * Checks whether the given warnings contain a specific code.
     * @param {object[]} warnings - The warnings to evaluate.
     * @returns {boolean} True if there is a warning with code "SSE_ORM_9442", otherwise false.
     */
    checkWarning (warnings) {
        if (warnings) {
            const case5 = warnings.find(e => e.code === "SSE_ORM_9442");
            if (case5) {
                return true;
            }
        };
        return false;
    };
}