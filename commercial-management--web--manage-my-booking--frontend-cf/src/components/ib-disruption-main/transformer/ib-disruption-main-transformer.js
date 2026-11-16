(function () {
    'use strict';
    angular.module('ib-disruption-main-module')
        .factory('DisruptionDashboardTransformer', DisruptionDashboardTransformer);

    DisruptionDashboardTransformer.$inject = ['$filter', '$translate', 'DisruptionDashboardConstants', 'MmBUtilService', 'localStorageService', 'DisruptionUtilService', 'EvaluatorConst'];
    function DisruptionDashboardTransformer($filter, $translate, DisruptionDashboardConstants, MmBUtilService, localStorageService, DisruptionUtilService, EvaluatorConst) {
        return {
            transformOrderData: transformOrderData,
            transformPhoneCallCenter: transformPhoneCallCenter,
            transformFlightsPending: transformFlightsPending,
            transformDisruptionData: transformDisruptionData,
            transformDateSelectorData: transformDateSelectorData,
            transformCustomChangeByFlows: transformCustomChangeByFlows
        };

        function transformDisruptionData(orderSlices, disruptionType, disruptionModel, fareFamilyConditions) {
            var sliceIndex, listAux, infoObj;
            sliceIndex = 0;
            while (sliceIndex < DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].ORDERED_SLICES.length) {
                infoObj = DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].ORDERED_SLICES[sliceIndex];
                listAux = getListForScenario(orderSlices, infoObj);
                //For this slice's list, when is not undefined, we assign the order defined on the array, and initialize literals and css classes
                if (listAux.length > 0 && !disruptionModel[infoObj.model_name].list) {
                    //Return list of model with a slice type
                    disruptionModel[infoObj.model_name].list = buildFlights(listAux, infoObj.type, fareFamilyConditions, infoObj.invalidSegmentStatus || []);
                } else if (listAux.length > 0 && disruptionModel[infoObj.model_name].list && disruptionModel[infoObj.model_name].list.length >= 1) {
                    disruptionModel[infoObj.model_name].list = disruptionModel[infoObj.model_name].list.concat(buildFlights(listAux, infoObj.type, fareFamilyConditions));
                    disruptionModel[infoObj.model_name].list.sort(compareSlice);
                }
                setCommonValues(infoObj.model_name, DisruptionDashboardConstants.SLICE_INFO[infoObj.type].COMMON_CARD_VALUES, disruptionModel);
                listAux = undefined;
                sliceIndex++;
            }

            function compareSlice(sliceA, sliceB) {
                var dateA = sliceA.flightData.departureDateTime;
                var dateB = sliceB.flightData.departureDateTime;

                if (dateA > dateB) return 1;
                if (dateB > dateA) return -1;
                return 0;
            }

            function setCommonValues(modelName, commonCardValues, disruptionModel) {
                const bookingInfo = localStorageService.get('bookingInfo');
                $translate.onReady().then(() => {
                    disruptionModel[modelName].textEnabled = disruptionModel[modelName].textEnabled || commonCardValues.FLAG.CARD_TITLE_ENABLED;
                    disruptionModel[modelName].acceptEnabled = disruptionModel[modelName].acceptEnabled || commonCardValues.FLAG.ACCEPT_BUTTON_ENABLED;
                    disruptionModel[modelName].numberEnabled = disruptionModel[modelName].numberEnabled || commonCardValues.FLAG.NUMBER_ENABLED;
                    disruptionModel[modelName].title = disruptionModel[modelName].title ? $filter('translate')(disruptionModel[modelName].title) : $filter('translate')(commonCardValues.LITERAL.CARD_TITLE);
                    disruptionModel[modelName].desc = disruptionModel[modelName].desc ? $filter('translate')(disruptionModel[modelName].desc) : $filter('translate')(commonCardValues.LITERAL.CARD_DESCRIPTION);
                    //Add logic to see if ALLOWED_ACCEPT_CHANGES flag affects the acceptEnabled attribute
                    if(disruptionModel[modelName].acceptEnabled) {
                        const evaluation = DisruptionUtilService.evaluateRule(bookingInfo.orderFlags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ALLOWED_ACCEPT_CHANGES);
                        disruptionModel[modelName].acceptEnabled = evaluation;
                    }
                });
            }

            function buildFlights(sliceList, sliceType, fareFamiliy, invalidSegments) {
                var sliceIndex, modelList, model;
                modelList = [];
                for (sliceIndex = 0; sliceIndex < sliceList.length; sliceIndex++) {
                    model = buildFlightModel(sliceList[sliceIndex], DisruptionDashboardConstants.SLICE_INFO[sliceType], invalidSegments);
                    transformFareDetails(fareFamiliy, model, sliceList[sliceIndex].segments);
                    modelList.push(model);
                }
                return modelList;
            }

            /**
             * Return a complete model of the slice given
             * based on the configuration defined for the slice
             * @param {Object} slice
             * @param {Object} sliceType
             */
            function buildFlightModel(slice, sliceType, invalidSegments) {
                var model;
                model = {};
                const downgradeCodes = localStorageService.get('downgradeCodes');
                setIconsURL(slice.segments);

                if (downgradeCodes.length > 0) {
                    getOriginalAndNewCabins(slice, model);
                }

                angular.extend(model, transformSliceWithSegments(slice, invalidSegments));

                model.activationFlags = {};
                model.activationFlags.previousDate = sliceType.FLAG.PREV_DATE;
                model.activationFlags.currentDate = sliceType.FLAG.CURR_DATE;
                model.activationFlags.moreDetailsArea = sliceType.FLAG.SLICE_DETAIL_AREA;
                model.activationFlags.nodeDetails = sliceType.FLAG.NODE_DETAIL;
                model.activationFlags.fareDetails = sliceType.FLAG.FARE_DETAIL;
                model.activationFlags.warningIcon = sliceType.FLAG.WARNING_ICON;
                model.activationFlags.missconnectionWarning = sliceType.FLAG.WARNING_MISSCONNECTION;

                model.labels = {};
                if (slice.indexTotal === 0 && slice.numSlicesTotal <= 2) {
                    model.labels.FLIGHT_INFO_MESSAGE = sliceType.LABEL.FLIGHT_INFO_MESSAGE_OUTBOUND;
                } else if (slice.indexTotal === 1 && slice.numSlicesTotal === 2) {
                    model.labels.FLIGHT_INFO_MESSAGE = sliceType.LABEL.FLIGHT_INFO_MESSAGE_RETURN;
                } else {
                    model.labels.FLIGHT_INFO_MESSAGE = sliceType.LABEL.FLIGHT_INFO_MESSAGE;
                }
                if (model.downgradeCode === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME && !downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME)) {
                    model.labels.FLIGHT_INFO_MESSAGE = '';
                }

                model.labels.FLIGHT_DETAIL_COLLAPSE = sliceType.LABEL.FLIGHT_DETAIL_COLLAPSE;
                model.labels.FLIGHT_DETAILS = sliceType.LABEL.FLIGHT_DETAILS;

                model.cssClass = {};
                model.cssClass.classFlightNormalAreaContainer = sliceType.CSS_CLASS.FLIGHT_NORMAL_AREA_DATES_CONTAINER;
                model.cssClass.classFlightCabinContainer = sliceType.CSS_CLASS.FLIGHT_NORMAL_AREA_CABIN_CONTAINER;
                model.cssClass.classFlightNormalAreaDate = sliceType.CSS_CLASS.FLIGHT_NORMAL_AREA_DATES_DATE;
                model.cssClass.classFlightXsAreaContainer = sliceType.CSS_CLASS.FLIGHT_XS_AREA_DATES_DATE;
                return model;
            }

            /**
             * Returns the list of slices that depending on the scenario given
             * @param {*} orderSlices
             * @param {*} modelType
             */
            function getListForScenario(orderSlices, modelType) {
                var index, resultList, indexSlice, auxModelObj;
                index = 0;
                resultList = [];
                while (index < modelType.validStatus.length) {
                    indexSlice = 0;
                    while (indexSlice < DisruptionDashboardConstants.FLIGHT_LIST_MODEL.length) {
                        auxModelObj = orderSlices[DisruptionDashboardConstants.FLIGHT_LIST_MODEL[indexSlice].name];
                        if (auxModelObj.code === modelType.validStatus[index].code && auxModelObj.list !== null) {
                            resultList = resultList.concat(auxModelObj.list);
                        }
                        indexSlice++;
                    }
                    index++;
                }
                return resultList;
            }
        };

        /**
         * This function generate the model used in component ib-disruption-flight-change-date. That allows change the date to flight or flights
         * disrupted.
         * @param {Array} slicesList list of slices of order.
         * @param {Object} slicesCanceled is a object with information about the flight disrupted.
         * @param {Array} orderSlices list of slices of order.
         * @param {Object} disruptionModel is the all data of disruption page.
         * @returns {void} assign directly to model page disruption the model "selectorFlights".
         *  */
        function transformDateSelectorData(slicesList, slicesCanceled, confirmedList, orderSlices, disruptionModel, GenericDisruption) {
            var model, index, sliceAuxIndex;
            if (slicesList) {
                disruptionModel.flagSelectorDate = true;
                model = disruptionModel.selectorFlights;
                model.flights = {};
                model.flightsNumber = slicesList.length;
                model.optional = null;
                model.changeConditions = getChangeConditions(orderSlices, GenericDisruption ? true : false);
                if (slicesCanceled && slicesCanceled.list && slicesList.length < slicesCanceled.list.length) {
                    //Departure mode
                    if (containsSlice(slicesList, slicesCanceled.list[0])) {
                        model.auxMinDate = new Date();
                        model.auxInitDate = angular.copy(model.auxMinDate);
                        model.auxMaxDate = new Date(parseDate(slicesCanceled.list[slicesCanceled.list.length - 1].departureDateTime).originalDate);
                    }
                    //Arrival Mode
                    if (containsSlice(slicesList, slicesCanceled.list[1])) {
                        model.auxMinDate = new Date(parseDate(slicesCanceled.list[0].departureDateTime).originalDate);
                        model.auxInitDate = angular.copy(model.auxMinDate);
                        model.auxMaxDate = disruptionModel.maxDateAllowed;
                    }
                }
                for (index = 0; index < slicesList.length; index++) {
                    if (!containsSlice(slicesCanceled.list, slicesList[index])) {
                        model.optional = slicesList[index].sliceId;
                    }
                    sliceAuxIndex = orderSlices.indexOf(slicesList[index]);
                    buildSelectorDates(slicesList[index],
                        containsSlice(slicesCanceled.list, slicesList[index]), model.flights, angular.isUndefined(sliceAuxIndex) ? sliceIndex : sliceAuxIndex);
                    model.slices = slicesList;
                }
            }

            function containsSlice(list, slice) {
                var index, found;
                index = 0;
                found = false;
                while (list && index < list.length && !found) {
                    found = list[index].sliceId === slice.sliceId;
                    index++;
                }
                return found;
            }

            function buildSelectorDates(slice, cancel, model, index) {
                var firstSegment, lastSegment;
                firstSegment = slice.segments[0];
                lastSegment = slice.segments[slice.segments.length - 1];
                model[slice.sliceId] = {};
                model[slice.sliceId].disrupted = cancel;
                if (!cancel) {
                    model[slice.sliceId].optionalEnabled = false;

                }
                model[slice.sliceId].originalOD = slice.originalDisruptionSliceInformation;
                model[slice.sliceId].departureCity = firstSegment.departure;
                model[slice.sliceId].departureDateParsed = parseDate(slice.departureDateTime);
                model[slice.sliceId].arrivalCity = lastSegment.arrival;
                model[slice.sliceId].arrivalDateParsed = parseDate(slice.arrivalDateTime);
                model[slice.sliceId].type = slice.type;
                model[slice.sliceId].duration = slice.duration;
                model[slice.sliceId].stopsNumber = slice.stopsNumber;
                model[slice.sliceId].price = slice.price;
                model[slice.sliceId].detailedPrice = slice.detailedPrice,
                    model[slice.sliceId].overnight = slice.overnight;
                model[slice.sliceId].departureCountry = firstSegment.departureCity.countryCode;
                model[slice.sliceId].arrivalCountry = firstSegment.arrivalCity.countryCode;
                model[slice.sliceId].index = index;
                return model;
            }
        }

        /**
         * Calculate change flight conditions to show, based on operational carrier on flight
         *
         */
        function getChangeConditions (slicesList, isGenericDisruption) {
            const condition = {}, container = {};
            let iberiaOper = true;
            condition.keepConditions = [];
            condition.notKeepConditions = [];
            container.slices = slicesList;
            angular.forEach(DisruptionUtilService.searchSlices(container, DisruptionUtilService.criteriaNone), (slice) => {
                angular.forEach(slice.segments, (segment) =>{
                    if (DisruptionDashboardConstants.OPERATIONAL_GROUP_IBERIA.indexOf(segment.flight.operationalCarrier.code) === -1) {
                        iberiaOper = false;
                    }
                });
            });
            if(iberiaOper && isGenericDisruption) {
                condition.keepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.keepConditions;
                condition.notKeepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.notKeepConditions;
            } else if(iberiaOper) {
                condition.keepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.keepConditionsSpecific;
                condition.notKeepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.notKeepConditionsSpecific;
            }else{
                condition.keepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.NOT_IBERIA_OPER.keepConditions;
                condition.notKeepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.NOT_IBERIA_OPER.notKeepConditions;
            }
            return condition;
        }
        /**
         * Transform the slice given into a flightCardModel
         * @param {Object} slice The slice to transform
         * @returns {Object} Complete flight card model object
         */
        function transformSlice(slice, hasMissconnection) {
            var flightCardModelReady, firstSegment, lastSegment, originalDuration, originalStops;
            originalDuration = slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.duration : null;
            originalStops = slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.stopsNumber : null;
            flightCardModelReady = {};
            firstSegment = 0;
            lastSegment = slice.segments.length - 1;

            flightCardModelReady.flightData = {};
            flightCardModelReady.flightData.icon = getFlightIcon(slice.segments[firstSegment].flight.marketingCarrier);
            flightCardModelReady.flightData.departureDateTime = slice.isCancel && slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.departureDateTime : slice.departureDateTime;
            flightCardModelReady.flightData.departureTime = getTime(slice.isCancel && slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.departureDateTime : slice.departureDateTime);
            flightCardModelReady.flightData.arrivalTime = getTime(slice.isCancel && slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.arrivalDateTime : slice.arrivalDateTime);
            flightCardModelReady.flightData.arrivalDateTime = slice.isCancel && slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.arrivalDateTime : slice.arrivalDateTime;
            flightCardModelReady.flightData.departureDate = getDate(slice.isCancel && slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.departureDateTime : slice.departureDateTime);
            flightCardModelReady.flightData.arrivalDate = getDate(slice.isCancel && slice.originalDisruptionSliceInformation ? slice.originalDisruptionSliceInformation.arrivalDateTime : slice.arrivalDateTime);
            if (slice.originalDisruptionSliceInformation) {
                flightCardModelReady.flightData.departureChangeDate = getDate(slice.originalDisruptionSliceInformation.departureDateTime);
                flightCardModelReady.flightData.arrivalChangeDate = getDate(slice.originalDisruptionSliceInformation.arrivalDateTime);
                flightCardModelReady.flightData.departureChangeTime = getTime(slice.originalDisruptionSliceInformation.departureDateTime);
                flightCardModelReady.flightData.arrivalChangeTime = getTime(slice.originalDisruptionSliceInformation.arrivalDateTime);
            }
            flightCardModelReady.flightData.flightScales = getFlightScales(slice);
            flightCardModelReady.flightData.flightScalesNumber = slice.isCancel && originalStops ? originalStops : slice.stopsNumber;
            flightCardModelReady.flightData.flightDuration = getDuration(slice.isCancel && originalDuration ? originalDuration : slice.duration);
            flightCardModelReady.flightData.departureCity = getParsedCity(slice.segments[firstSegment].departure).name;
            flightCardModelReady.flightData.arrivalCity = getParsedCity(slice.segments[lastSegment].arrival).name;
            flightCardModelReady.flightData.departureAPort = getParsedCity(slice.segments[firstSegment].departure).code;
            flightCardModelReady.flightData.arrivalAPort = getParsedCity(slice.segments[lastSegment].arrival).code;
            flightCardModelReady.flightData.departureCountry = slice.segments[lastSegment].arrivalCity.countryCode;
            flightCardModelReady.flightData.arrivalCountry = slice.segments[lastSegment].arrivalCity.countryCode;
            flightCardModelReady.flightData.technicalStops = getTechnicalStops(slice.segments);

            flightCardModelReady.activationFlags = {};
            flightCardModelReady.activationFlags.previousDate = false;
            flightCardModelReady.activationFlags.moreDetailsArea = true;
            flightCardModelReady.activationFlags.nodeDetails = true;
            flightCardModelReady.activationFlags.fareDetails = true;

            flightCardModelReady.fareData = {};
            flightCardModelReady.fareData.cabinName = '';
            flightCardModelReady.fareData.handBag = '';
            flightCardModelReady.fareData.checkBag = '';
            flightCardModelReady.fareData.seatSelection = '';

            flightCardModelReady.hasMissconnection = hasMissconnection;

            return flightCardModelReady;
        }

        /**
         * Transform the slice given into a flightCardModel, including the segments
         * hanging on the slice
         * @param {Object} slice The slice to transform
         * @returns {Object} Complete flight card model with all the segments parsed too
         */
        function transformSliceWithSegments(slice, invalidSegments) {
            var flightNodeModelReady, index, size, modelData, warningModel, missconnection = false, waningIndex;
            const downgradeCodes = localStorageService.get('downgradeCodes');

            warningModel = {};
            size = slice.segments.length;
            flightNodeModelReady = {};
            flightNodeModelReady.flightNodes = [];
            for (index = 0; index < size; index++) {
                modelData = {};
                modelData.nodeData = {};
                modelData.nodeData.icon = getFlightIcon(slice.segments[index].flight.operationalCarrier);
                modelData.nodeData.departureDateTime = slice.segments[index].departureDateTime;
                modelData.nodeData.arrivalDateTime = slice.segments[index].arrivalDateTime;
                modelData.nodeData.departureTime = getTime(slice.segments[index].departureDateTime);
                modelData.nodeData.arrivalTime = getTime(slice.segments[index].arrivalDateTime);
                modelData.nodeData.departureCity = getParsedCity(slice.segments[index].departure).name;
                modelData.nodeData.arrivalCity = getParsedCity(slice.segments[index].arrival).name;
                modelData.nodeData.departureAPort = getParsedCity(slice.segments[index].departure).code;
                modelData.nodeData.arrivalAPort = getParsedCity(slice.segments[index].arrival).code;
                modelData.nodeData.flightNumber = getFlightNumber(slice.segments[index]);
                modelData.nodeData.flightPlane = getFlightPlane(slice.segments[index]);
                modelData.nodeData.flightOperator = getFlightOperator(slice.segments[index]);
                modelData.nodeData.flightDuration = getDuration(slice.segments[index].duration);
                modelData.nodeData.waitingTime = getDuration(slice.segments[index].waitingTime);
                modelData.showNode = true;
                if(downgradeCodes.length > 0) {
                    modelData.showNode = getShowNode(slice.segments[index], invalidSegments);
                }
                modelData.activationFlags = {};
                getWarnings(slice.segments[index], modelData.activationFlags);
                if (modelData.activationFlags.warningMissConection) {
                    warningModel = localStorageService.get('missconnectionWarningMessage');
                    for (waningIndex = 0; waningIndex < warningModel.length; waningIndex++) {
                        if (warningModel[waningIndex].segmentID === slice.segments[index].id) {
                            modelData.nodeData.missconnectionWarningMsg = warningModel[waningIndex].warningMsg;
                            missconnection = true;
                        }
                    }
                }
                if (slice.segments[index].stop) {
                    modelData.nodeData.technicalStop = slice.segments[index].stop;
                    modelData.nodeData.technicalStop.duration = getDuration(slice.segments[index].stop.duration);
                }
                modelData.labels = {};
                modelData.labels.LABEL_OPERATED_BY = 'FLIGHT_CONFIRMATION_DETAILS_OPERATED_BY';
                flightNodeModelReady.flightNodes.push(modelData);
            }
            angular.extend(flightNodeModelReady, transformSlice(slice, missconnection));
            return flightNodeModelReady;
        }

        function getOriginalAndNewCabins (slice, model) {

            let isDowngrade;
            const downgradeCodes = localStorageService.get('downgradeCodes');
            const thereIsUN = slice.segments.find(segment => segment.status.code === 'UN');

            slice.segments.map((segment, segmentIndex) => {
                if (segment.warnings) {
                    isDowngrade = segment.warnings.find((warning, warningIndex) => warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME || warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME || warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK);
                }
                if (isDowngrade) {
                    model.downgradeCode = isDowngrade.code;
                }

                if (isDowngrade && segment.status.code === 'TK' && !thereIsUN) {
                    model.newCabin = slice.segments[segmentIndex].cabin.bookingClass;
                } else if (isDowngrade && segment.status.code === 'TK' && model.downgradeCode === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME && !downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME) && !downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK)) {
                    model.newCabin = slice.segments[segmentIndex].cabin.bookingClass;
                } else if (segment.status.code === 'UN') {
                    model.originalCabin = slice.segments[segmentIndex].cabin.bookingClass;
                }

                $translate.onReady().then(() => {
                    if (model.originalCabin) {
                        model.originalCabinMsg = $filter('translate')('MMB_DISRUPTION_DOWNGRADE_ORIGINAL_CABIN', { originalCabin: model.originalCabin });
                    }
                    if (model.newCabin) {
                        model.newCabinMsg = $filter('translate')('MMB_DISRUPTION_DOWNGRADE_NEW_CABIN', { newCabin: model.newCabin });
                    }
                }
                );

            });
        }

        function getShowNode (segment, invalidSegmentsStatus) {
            let isDowngradeSegment;
            const downgradeCodes = localStorageService.get('downgradeCodes');
            const caseA = downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME) && !downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME) && !downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK);
            const caseB = downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME) && !downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK);
            const caseC = downgradeCodes.includes(DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK);
            let showNode = true;

            //Check if the segment is an invalid segment
            const isInvalidSegment = invalidSegmentsStatus?.some(status => segment.status.code === status.code);

            if (isInvalidSegment) {

                //Check if the invalid segment is the downgrade segment
                if (segment.warnings) {
                    isDowngradeSegment = segment.warnings.find(warning => warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME || warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME || warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK);
                }
                // Case B
                if(caseB && isDowngradeSegment) {
                    // For Case B we only hide the TK that has the downgrade warning
                    if (segment.status.code === 'TK') {
                        showNode = false;
                    }
                }
                // For Case A we hide every segment that is an invalid segment
                if(caseA) {
                    showNode = false;
                }

                // Case C
                if(caseC) {
                    if (segment.status.code === 'TK') {
                        showNode = false;
                    }
                }
            }
            return showNode;
        }

        /**
         * Sets the Icon url for each segment
         * @param {Array} segments The segments in the disrupted slice
         */
        function setIconsURL(segments) {
            var segmentSize, segmentIndex;
            segmentSize = segments.length;
            for (segmentIndex = 0; segmentIndex < segmentSize; segmentIndex++) {
                segments[segmentIndex].flight.marketingCarrier.companyUrl = getIconUrl(segments[segmentIndex].flight.marketingCarrier.code);
                segments[segmentIndex].flight.operationalCarrier.companyUrl = getIconUrl(segments[segmentIndex].flight.operationalCarrier.code);
            }

            /**
             * Returns the Url Icon for the carrier
             * @param {String} carrierCode
             */
            function getIconUrl(carrierCode) {
                return MmBUtilService.getCompanyURL(carrierCode);
            }
        }


        /**
         * Transforms the slices not disrupted to a model ready form
         * @param {Object} slices Slices of the order
         * @param {Object} sliceDisrupted The slice disrupted
         * @param {Object} model Model to transform into
         */
        function transformFlightsPending(slice) {
            var modelData;
            modelData = transformSliceWithSegments(slice);
            modelData.activationFlags.previousDate = false;
            modelData.activationFlags.moreDetailsArea = false;
            modelData.activationFlags.nodeDetails = false;
            modelData.activationFlags.fareDetails = false;
            return modelData;
        }
        /**
         * Transforms the CallCenter phone
         * @param {Object} order
         * @param {Object} model
         */
        function transformPhoneCallCenter(order, model) {
            model.contactPhone = getPhoneCallCenter(order);
        }

        /**
         * Transforms the FareFamily
         * @param {Object} fareFamily The fare family to transform
         * @param {Array} model The model
         */
        function transformFareDetails(fareFamily, model, segments) {
            var index, condIndex;
            index = 0;
            model.fareData = [];
            for (index = 0; index < fareFamily.length; index++) {
                if (fareFamily[index] && fareFamily[index].commercialCode === segments[0].cabin.fareFamily) {
                    model.cabinName = fareFamily[index].commercialName;
                    for (condIndex = 0; condIndex < fareFamily[index].conditions.length; condIndex++) {
                        setFareCondition(fareFamily[index].conditions[condIndex], model.fareData);
                    }
                }
            }
        }

        /**
         * Transform the order retrived from the order into a valid dashboardModel
         * @param {Object} bookingOrder The order source of this transformation
         * @param {Object} dashboardModel The destination of the transformation
         */
        function transformOrderData(bookingInfo, bookingOrder, disruptionModel, disruptionType) {
            var sliceInfoIndex, transformedOrder, infoObj, auxObj, lastNumber, showAlternative = false;
            const tagsInfo = {
                link: {
                    tag: 'a',
                    href: 'https://www.iberia.com/es/derechos-pasajero/',
                    target: '_blank',
                    title: '',
                    class: ''
                }
            };
            sliceInfoIndex = 0;
            transformedOrder = {};
            lastNumber = 1;
            infoObj = DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].ORDERED_SLICES;
            disruptionModel.passengersInfo = bookingInfo.passengers;
            disruptionModel.tickets = bookingInfo.tickets;
            disruptionModel.orderItems = MmBUtilService.getElementsByProperty(bookingOrder.orderItems, 'type', true);
            disruptionModel.rawSlicesInfo = bookingOrder.slices;
            disruptionModel.pricesInfo = bookingInfo.order.price;
            while (sliceInfoIndex < infoObj.length) {
                auxObj = disruptionModel[infoObj[sliceInfoIndex].model_name];
                if (auxObj.numberEnabled && auxObj.list.length > 0 && !showAlternative) {
                    auxObj.number = lastNumber;
                    lastNumber++;
                    showAlternative = true;
                }
                sliceInfoIndex++;
            }

            const evaluation = DisruptionUtilService.evaluateRule(bookingInfo.orderFlags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ALLOWED_ACCEPT_CHANGES);
            const generalTitleDescription = evaluation ? DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].LABEL.GENERAL_TITLE_DESCRIPTION : '';
            const showChangeFlightSection = DisruptionUtilService.evaluateRule(bookingInfo.orderFlags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ANY_INVOLUNTARY_CHANGE_FLIGHT_EVAL);
            const reshopConditionShowFligthSection = disruptionModel.reshopConditions?.involuntaryChanges?.enabled ? true : false;
            //Always show the change flight module
            showAlternative = (!disruptionModel.notIberiaTicket || disruptionModel.hasTickets) && showChangeFlightSection && reshopConditionShowFligthSection;
            //Changes
            const showBetterOptions = (!disruptionModel.notIberiaTicket && disruptionModel.hasTickets) && disruptionModel.bottomCard.list && disruptionModel.bottomCard.list.length > 0;
            disruptionModel.dateSelectorNumber = showBetterOptions ? lastNumber + 1 : lastNumber;
            disruptionModel.bottomCard.number = lastNumber;
            lastNumber++;
            if (disruptionModel.showRefundBoxEvaluator) {
                disruptionModel.refundNumber = showChangeFlightSection && showBetterOptions ? lastNumber + 1 : lastNumber;
            }
            $translate.onReady().then(() => {
                disruptionModel.common.title = $filter('translate')(DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].LABEL.TITLE);
                disruptionModel.common.showAlternative = showAlternative;
                // disruptionModel.common.generalTitleDescription = $filter('translate')(DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].LABEL.GENERAL_TITLE_DESCRIPTION);
                //generalTitleDescription will depend on ALLOWED_ACCEPT_CHANGES flag
                disruptionModel.common.generalTitleDescription = $filter('translate')(generalTitleDescription);
                disruptionModel.common.subTitle = $filter('translate')(DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].LABEL.SUBTITLE);

                if (disruptionModel.warningDowngradeSameFlightAndTime) {
                    tagsInfo.link.class = 'ib-link--subtitle';
                    disruptionModel.common.generalTitleDescription = $filter('literalFormatter')($filter('translate')('MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC_DOWNGRADE'), tagsInfo);
                }
                if (disruptionModel.warningDowngradeDiffFlightOrTime) {
                    tagsInfo.link.class = 'ib-link';
                    disruptionModel.bottomCard.desc = $filter('literalFormatter')($filter('translate')('MMB_DISRUPTION_ALTERNATIVE_DESCRIPTION_DOWNGRADE'), tagsInfo);
                }
                disruptionModel.common.titleDesc = DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].LABEL.TITLE_DESC;
                disruptionModel.common.flagContactCenter = DisruptionDashboardConstants.CONFIGURATION_TYPE[disruptionType].FLAG.CALLCENTER;
            });

            angular.extend(disruptionModel, transform(transformedOrder, bookingOrder));

            function transform(transformedOrder, bookingOrder) {
                transformedOrder.contactPhone = getPhoneCallCenter(bookingOrder);
                transformedOrder.flagPassengerRights = true;
                return transformedOrder;
            }
        }

        function setFareCondition(condition, fareDetail) {
            var genericValue, index, tempObj;
            genericValue = condition.extendedInfo.title;
            tempObj = {};
            for (index = 0; index < DisruptionDashboardConstants.FARE_CONDITION_CODES.length; index++) {
                if (DisruptionDashboardConstants.FARE_CONDITION_CODES[index].code === condition.code) {
                    tempObj.textValue = genericValue;
                    tempObj.classApp = DisruptionDashboardConstants.FARE_CONDITION_CODES[index].class;
                    fareDetail.push(tempObj);
                }
            }
        }

        /**
         * Transforms the CallCenter number
         * @return {String} CallCenter number
         */
        function getPhoneCallCenter(orderData) {
            var phonesList, phoneNumber;
            phonesList = orderData.phonesList;
            if (phonesList && phonesList.RESERVAS) {
                phoneNumber = phonesList.RESERVAS.prefix + ' ' + phonesList.RESERVAS.telephone;
            }
            return phoneNumber;
        }

        /**
         * Checks if the flight has scales and returns the literal to use
         * @param {Object} sliceAffected The slice with the disruption
         * @returns {String} The literal that applies
         */
        function getFlightScales(sliceAffected) {
            var flightType;
            if (sliceAffected.stopsNumber > 0) {
                flightType = DisruptionDashboardConstants.FLIGHTS_TYPES.INDIRECT;
            }
            if (sliceAffected.stopsNumber === 0) {
                flightType = DisruptionDashboardConstants.FLIGHTS_TYPES.DIRECT;
            }
            return flightType;
        }

        /**
         * It gets the Url Icon of the carrier given
         * @param {Object} carrier The carrier
         */
        function getFlightIcon(carrier) {
            return carrier.companyUrl;
        }
        /**
         * Obtains the operational carrier
         * @param {Object} segment The segmente sorce
         * @returns {String} Carrier transformed
         */
        function getFlightOperator(segment) {
            return transformCarrier(segment.flight.operationalCarrier);
        }

        /**
         * Transform the carrier given
         * @param {Object} carrier The carrier
         * @returns {String} Carrier transformed
         */
        function transformCarrier(carrier) {
            return carrier.name;
        }

        /**
         * Obtains the flight plane
         * @param {Object} segment The segment
         * @returns the planes flight
         */
        function getFlightPlane(segment) {
            return segment.flight.aircraft ? segment.flight.aircraft.description : '';
        }

        /**
         * Obtains the flight number of a segment
         * @param {Object} segment The segment with the flight number
         * @returns The flight number parsed
         */
        function getFlightNumber(segment) {
            var parsedFlightNumber = '';
            parsedFlightNumber = segment.flight.operationalCarrier.name + ' ' + segment.flight.marketingFlightNumber;
            return parsedFlightNumber;
        }

        /**
         * Parses the city into a model compatible object
         * @param {Object} city The city
         * @returns The parsed
         */
        function getParsedCity(city) {
            var parsedCity = {};
            parsedCity.code = city.code;
            parsedCity.name = city.city.description;
            return parsedCity;
        }

        /**
         * Parses the duration given
         * @param {Integer} duration The duration to parse
         */
        function getDuration(duration) {
            return $filter('DurationFormatFilter')(duration);
        }

        /**
         * Returns the departure parsed date
         * @param {Object} segment The segment with departure date
         * @returns {String} The parsed date
         */
        function getDate(dateTime) {
            return parseDate(dateTime).formatedDate;
        }

        /**
         * Returns the departure parsed date
         * @param {Object} segment The segment with departure date
         * @returns {String} The parsed date
         */
        function getTime(dateTime) {
            return parseDate(dateTime).dateTime;
        }

        /**
         * Parse the date
         * @param {date} date The date to parse
         * @returns {String} The parsed String
         */
        function parseDate(date) {
            return $filter('DateFormatFilter')(date);
        }

        /**
         * Gets all the warnings associated to the segment
         * @param {segment} segment The segment to check
         */
        function getWarnings(segment, model) {
            var index;
            if (segment.warnings) {
                for (index = 0; index < segment.warnings.length; index++) {
                    generateWarning(model, segment.warnings[index], segment.status.code);
                }
            }
        }

        /**
         * Generates a simple basic warning
         * @param {Object} model
         * @param {Object} warning simple object with the parsed text
         */
        function generateWarning(model, warning, statusCode) {
            model.warningMissConection = false;
            const bookingInfo = localStorageService.get('bookingInfo');
            if (warning.code === DisruptionDashboardConstants.FLIGHTS_WARNINGS.AIRPORT_CHANGE) {
                model.warningAirport = true;
                model.warningAirportMsg = warning.description;
            }
            if (warning.code === DisruptionDashboardConstants.FLIGHTS_WARNINGS.TERMINAL_CHANGE) {
                model.warningTerminal = true;
                model.warningTerminalMsg = warning.description;
            }
            if (warning.code === DisruptionDashboardConstants.FLIGHTS_WARNINGS.FLIGHT_STOP) {
                model.warningFlightStop = true;
            }
            if (warning.code === DisruptionDashboardConstants.FLIGHTS_WARNINGS.CONECTION_LOST) {
                model.warningMissConection = true;
            }
            if (warning.code === DisruptionDashboardConstants.FLIGHTS_WARNINGS.OVERNIGHT_FLIGHT) {
                model.warningOvernight = true;
            }
            if (warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME && (bookingInfo.order.status === DisruptionDashboardConstants.ORDER_STATUS_VALUES.INVOLUNTARY_FLAG || bookingInfo.order.status === DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_MIXED_CHANGE)) {
                localStorageService.set('warningDowngradeSameFlightAndTime', true);
            }
            if ((warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.DIFF_FLIGHT_OR_TIME || warning.code === DisruptionDashboardConstants.SEGMENT_WARNINGS.SAME_FLIGHT_SAME_TIME_UNTK) && (bookingInfo.order.status === DisruptionDashboardConstants.ORDER_STATUS_VALUES.INVOLUNTARY_FLAG || bookingInfo.order.status === DisruptionDashboardConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_MIXED_CHANGE)) {
                localStorageService.set('warningDowngradeDiffFlightOrTime', true);
            }
        }

        /**
         * Generate changes custom
         * @param {*} originalBooking
         * @param {*} modelDisruption
         * @param {*} type
         */
        function transformCustomChangeByFlows(originalBooking, disruptionModel, type) {
            //TKs multiple
            if (type === DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_SCHEDULE_TIME && disruptionModel.headerCard && disruptionModel.headerCard.list && disruptionModel.headerCard.list.length >= 2) {
                disruptionModel.common.title = 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE_MULTIPLE';
            }
        }

        /**
         * The function is used to process Sister Cities service response and map the results with the current flights list. The main purpose
         * is to show the user a list of Sister Cities which can be selected before calling availavility service to rebook the initial booking offer.
         * @param {*} rawModel  Sister cities service response (not processed)
         * @param {*} flightsList List of disrupted flights used to compare sister cities
         */
       /* function transformSisterCitiesModel(rawModel, flightsList) {
            var cityData, filteredOrderOriginCities, filteredOrderDestinationCities, filteredOriginSisterCities,
                filteredDestinationSisterCities, isOrigin, isDestination, transformedSisterCitiesModel = {
                    'originHasSisterCities': false,
                    'originSisterCitiesNum': 0,
                    'destinationHasSisterCities': false,
                    'destinationSisterCitiesNum': 0,
                    'origin': {
                        'originOrderCities': [],
                        'originSisterCities': []
                    },
                    'destination': {
                        'destinationOrderCities': [],
                        'destinationSisterCities': []
                    }
                };

            angular.forEach(flightsList.flights, function (flight) {
                isOrigin = false, isDestination = false;
                angular.forEach(rawModel.cities, function (city) {
                    isOrigin = false, isDestination = false, cityData = {
                        'code': '',
                        'description': ''
                    }

                    if (flightsList.flightsNumber === 1) {
                        switch (city.code) {
                            case flight.departureCity.city.code:
                                isOrigin = true;
                                buildSisterCitiesData(city, isOrigin, isDestination);
                                break;
                            case flight.arrivalCity.city.code:
                                isDestination = true;
                                buildSisterCitiesData(city, isOrigin, isDestination);
                                break;
                            default:
                                break;
                        }
                    }
                    if (flightsList.flightsNumber > 1) {
                        if (flight.index === 0 && flight.departureCity.city.code === city.code) {
                            isOrigin = true;
                            buildSisterCitiesData(city, isOrigin, isDestination);
                        }
                        if (flight.index === 0 && flight.arrivalCity.city.code === city.code) {
                            isDestination = true;
                            buildSisterCitiesData(city, isOrigin, isDestination);
                        }
                    }
                });
            });

            //Below code filter the lists to delete duplicate elements by using a method created on the utils service.
            filteredOrderOriginCities = MmBUtilsSharedService.removeDuplicates(transformedSisterCitiesModel.origin.originOrderCities);
            transformedSisterCitiesModel.origin.originOrderCities = filteredOrderOriginCities;

            filteredOrderDestinationCities = MmBUtilsSharedService.removeDuplicates(transformedSisterCitiesModel.destination.destinationOrderCities);
            transformedSisterCitiesModel.destination.destinationOrderCities = filteredOrderDestinationCities;

            filteredOriginSisterCities = MmBUtilsSharedService.removeDuplicates(transformedSisterCitiesModel.origin.originSisterCities);
            transformedSisterCitiesModel.origin.originSisterCities = filteredOriginSisterCities;
            transformedSisterCitiesModel.originSisterCitiesNum = '+' + transformedSisterCitiesModel.origin.originSisterCities.length;

            filteredDestinationSisterCities = MmBUtilsSharedService.removeDuplicates(transformedSisterCitiesModel.destination.destinationSisterCities);

            transformedSisterCitiesModel.destination.destinationSisterCities = filteredDestinationSisterCities;
            transformedSisterCitiesModel.destinationSisterCitiesNum = '+' + transformedSisterCitiesModel.destination.destinationSisterCities.length;

            return transformedSisterCitiesModel;
*/
            /**
             *
             * @param {*} city  Current city from sister cities list coming from the service response
             * @param {*} isOrigin  Determines if the city is origin or destination
             * @param {*} isDestination Determines if the city is origin or destination
             */
             /*
            function buildSisterCitiesData(city, isOrigin, isDestination) {
                cityData.code = city.code;
                cityData.description = city.description;

                if (isDestination) {
                    transformedSisterCitiesModel.destination.destinationOrderCities.push(cityData);
                } else {
                    transformedSisterCitiesModel.origin.originOrderCities.push(cityData);
                }

                if (city.sisterCities.length >= 1) {
                    if (isDestination) {
                        transformedSisterCitiesModel.destinationHasSisterCities = true;
                    } else {
                        transformedSisterCitiesModel.originHasSisterCities = true;
                    }

                    angular.forEach(city.sisterCities, function (sisterCity) {
                        sisterCity['isSelected'] = false;
                        if (isDestination) {
                            transformedSisterCitiesModel.destination.destinationSisterCities.push(angular.copy(sisterCity));
                        } else {
                            transformedSisterCitiesModel.origin.originSisterCities.push(angular.copy(sisterCity));
                        }
                    });
                }
            }
            */
      //  }

        function getTechnicalStops(segments) {
            var techStopsNum = 0, i;

            for(i = 0; i < segments.length; i++) {
                if (segments[i].stop) {
                    techStopsNum++;
                }
            }

            return techStopsNum;
        }
    }
})();
