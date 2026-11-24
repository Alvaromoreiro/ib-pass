(function () {
    'use strict';

    angular
        .module('ib-pmt-datalayer-module')
        .factory('PmtDatalayerUtilsService', PmtDatalayerUtilsService);

    PmtDatalayerUtilsService.$inject = ['DataLayerService', 'PmtDatalayerConstants', '$rootScope', '$timeout', 'localStorageService', 'DatalayerEcommerceConstants', 'DatalayerUtilsService', 'DatalayerMMBConstants'];
    function PmtDatalayerUtilsService(DataLayerService, PmtDatalayerConstants, $rootScope, $timeout, localStorageService, DatalayerEcommerceConstants, DatalayerUtilsService, DatalayerMMBConstants) {


        var DATALAYER_ERROR_ATTR = [PmtDatalayerConstants.DATALAYER_INFO.ERROR_CODE, PmtDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION];
        var DATALAYER_MODAL_ATTR = [PmtDatalayerConstants.DATALAYER_INFO.MODAL_ID];
        var LANG, MARKET;

        return {
            initializeDatalayer: initializeDatalayer,
            updateDatalayerWithQuadrigam: updateDatalayerWithQuadrigam,
            sendDatalayerEvent: sendDatalayerEvent,
            updateLoggedDatalayer: updateLoggedDatalayer,
            generateDatalayerDOM: generateDatalayerDOM,
            removeDatalayerObjects: removeDatalayerObjects,
            updateTripDetailsDatalayerObject: updateTripDetailsDatalayerObject,
            sendDatalayerErrorEvent: sendDatalayerErrorEvent,
            removeDatalayerErrorAttrs: removeDatalayerErrorAttrs,
            sendDatalayerModalEvent: sendDatalayerModalEvent,
            removeDatalayerModalAttrs: removeDatalayerModalAttrs,
            addDataLayerInfo: addDataLayerInfo,
            updateDatalayerInitType: updateDatalayerInitType,
            updateDatalayerForUpgrade: updateDatalayerForUpgrade,
            updateDatalayerForAncillaries: updateDatalayerForAncillaries,
            resetDatalayer: resetDatalayer,
            updateDigitalDataWithQuadrigam: updateDigitalDataWithQuadrigam
        };

        ////////////////

        /**
         * Initialize the datalayer object
         */
        function initializeDatalayer(language, market, deviceType) {
            var initialDatalayer = {};
            LANG = language;
            MARKET = market
            initialDatalayer[PmtDatalayerConstants.DATALAYER_INFO.LANGUAGE] = language;
            initialDatalayer[PmtDatalayerConstants.DATALAYER_INFO.MARKET] = market;
            initialDatalayer[PmtDatalayerConstants.DATALAYER_INFO.WEB_VERSION] = PmtDatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
            initialDatalayer[PmtDatalayerConstants.DATALAYER_INFO.WEB_MODE] = deviceType;
            DataLayerService.initDatalayer(initialDatalayer);
        };

        /**
         * Extends datalayer object with the quadrigam info and the extended info given
         * @param {String} quadrigam the String with the quadrigam to be set
         * @param {Object} extendedObject the extended object to be added to datalayer
         */
        /* INIT DELETE GA4 MIGRATION */
        function updateDatalayerWithQuadrigam(quadrigam, extendedObject, isUserLogged) {
            var extendDatalayer = {};
            var urlParams = localStorageService.get('bookingUrlParams');
            if (angular.isString(quadrigam) && urlParams) {
                extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigam;
                urlParams.codeTracking ? angular.noop : extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.CODE] = LANG + '/' + MARKET + '/' + quadrigam;
            }
            extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.USER_STATE] = isUserLogged ? PmtDatalayerConstants.DATALAYER_USER_STATES.LOGGED : PmtDatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
            if (angular.isObject(extendedObject)) {
                angular.extend(extendDatalayer, extendedObject);
            }
            addDataLayerInfo(extendDatalayer);
        };
        /* FINISH DELETE GA4 MIGRATION */
        function updateDigitalDataWithQuadrigam(quadrigam, extendedObject, isUserLogged) {
            var extendDatalayer = {};
            var urlParams = localStorageService.get('bookingUrlParams');
            if (angular.isString(quadrigam) && urlParams) {
                extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigam;
                urlParams.codeTracking ? angular.noop : extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.CODE] = LANG + '/' + MARKET + '/' + quadrigam;
            }
            extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.USER_STATE] = isUserLogged ? PmtDatalayerConstants.DATALAYER_USER_STATES.LOGGED : PmtDatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
            if (angular.isObject(extendedObject)) {
                angular.extend(extendDatalayer, extendedObject);
            }
            addDigitalDataInfo(extendDatalayer);
        };

        /**
         * Sends a datalayer event to the server
         * @param {String} type the event type. If it is not a String, no event will be sent
         */
        function sendDatalayerEvent(type) {
            if (angular.isString(type)) {
                $timeout(function () {
                    $rootScope.$broadcast('updateDatalayer');
                });
                DataLayerService.callUpdateTagManager(type);
            }
        };

        /**
         * updates datalayer with the user logged info 
         * @param {Object} customerData the user logged generalInfo information
         */
        function updateLoggedDatalayer(customerData) {
            var extendDatalayer = {}, userLevel;
            if (customerData) {
                userLevel = customerData.category || '';
                extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.USER_LEVEL] = userLevel;
                extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.USER_ID] = customerData.ibPlusNumber;
                extendDatalayer[PmtDatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = PmtDatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;
                addDataLayerInfo(extendDatalayer);
            }
        };

        /**
         * Generates a datalayer String for Teleaf analytics
         * @return a String with the whole current datalayer info in a well formed structure for teleaf
         */
        function generateDatalayerDOM() {
            var datalayerDOM = '<script type="text/javascript">';
            var currentNode, datalayer_general = DataLayerService.getDatalayerGeneral();
            for (currentNode in datalayer_general) {
                datalayerDOM += ('datalayer_general[\'' + currentNode + '\']=\'' + datalayer_general[currentNode] + '\';');
            }
            datalayerDOM += '</script>';
            return datalayerDOM;
        };

        /**
         * removes a set of attributes from datalayer.
         * @param {Array<String>} datalayerAttributtes an array with the String name of the attributes to be removed from datalager
         */
        function removeDatalayerObjects(datalayerAttributtes) {
            DataLayerService.removeDatalayerGeneralInfo(datalayerAttributtes);
        };

        /**
         * Adds to datalayer the information required by the booking
         * @param {Object} bookingInfo the booking information recovery from retrieve order service
         */
        function updateTripDetailsDatalayerObject(bookingInfo) {
            var i, j, datalayerObject = {}, passengersTypes = '', passengerCount = 0, segmentsAirports = '', segmentsDates = '', segmentsOperators = '';
            for (i = 0; i < bookingInfo.passengers.length; i++) {
                passengersTypes += (passengersTypes.length === 0 ? '' : '-') + PmtDatalayerConstants.DATALAYER_PASSENGER_TYPES[bookingInfo.passengers[i].passengerType];
                if (bookingInfo.passengers[i].passengerType !== PmtDatalayerConstants.PASSENGERS_TYPES.INFANT) {
                    passengerCount++;
                }
            }
            for (i = 0; i < bookingInfo.order.slices.length; i++) {
                for (j = 0; j < bookingInfo.order.slices[i].segments.length; j++) {
                    segmentsAirports += (segmentsAirports.length === 0 ? '' : '-') + bookingInfo.order.slices[i].segments[j].departure.code + '-' + bookingInfo.order.slices[i].segments[j].arrival.code;
                    segmentsDates += (segmentsDates.length === 0 ? '' : '-');
                    if (bookingInfo.order.slices[i].segments[j].type !== PmtDatalayerConstants.SEGMENT_TYPES.OPEN) {
                        if (bookingInfo.order.slices[i].segments[j].departureDateTime && bookingInfo.order.slices[i].segments[j].arrivalDateTime) {
                            segmentsDates += bookingInfo.order.slices[i].segments[j].departureDateTime.split(' ')[0] + '-' + bookingInfo.order.slices[i].segments[j].arrivalDateTime.split(' ')[0];
                        }
                        segmentsOperators += (segmentsOperators.length === 0 ? '' : '-') + bookingInfo.order.slices[i].segments[j].flight.operationalDisclosure;
                    } else {
                        segmentsDates += PmtDatalayerConstants.DATALAYER_VALUES.SEGMENT_OPEN;
                    }
                }
            }
            datalayerObject[PmtDatalayerConstants.DATALAYER_INFO.PASSENGER_TYPES] = passengersTypes;
            datalayerObject[PmtDatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = passengerCount;
            datalayerObject[PmtDatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = segmentsAirports;
            datalayerObject[PmtDatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = segmentsDates;
            datalayerObject[PmtDatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS] = segmentsOperators;
            addDataLayerInfo(datalayerObject);
        };

        /**
         * sends datalayer event with the current datalayer info and the datalayer error info
         * @param {Object} errorObject the object with the 'message', 'errorCode' y 'internalErrorCode' attributes
         */
        function sendDatalayerErrorEvent(errorObject) {
            var extendedDatalayerInfo = {};
            if (angular.isObject(errorObject)) {
                extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.ERROR_CODE] = errorObject.errorCode + '-' + errorObject.internalErrorCode;
                extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] = errorObject.message;
                addDataLayerInfo(extendedDatalayerInfo);
                /* INIT DELETE GA4 MIGRATION*/
                sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDatalayerViewEvent();
            }
        };

        /**
         * removes the datalayer error attributes from datalayer object
         */
        function removeDatalayerErrorAttrs() {
            removeDatalayerObjects(DATALAYER_ERROR_ATTR);
        };

        /**
         * sends datalayer event with the current datalayer info and the datalayer modal info
         * @param {Object} modalObject the modal object with its attributes ('idModal') 
         */
        function sendDatalayerModalEvent(modalObject) {
            var extendedDatalayerInfo = {};
            if (angular.isObject(modalObject)) {
                extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal;
                addDataLayerInfo(extendedDatalayerInfo);
                /* INIT DELETE GA4 MIGRATION*/
                sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDatalayerViewEvent();
            }
        };

        /**
         * removes the datalayer modal attributes from datalayer object
         */
        function removeDatalayerModalAttrs() {
            removeDatalayerObjects(DATALAYER_MODAL_ATTR);
        };

        /**
         * Extends the current datalayer information with the received info
         * @param {Object} datalayerInfo the information to extend current datalayer info
         */
        function addDataLayerInfo(datalayerInfo) {
            DataLayerService.addDataLayerGeneralInfo(datalayerInfo);
        };

        /**
         * updates the datalayer info with the flow init type
         * @param {String} initType the init type flow (locator or ibplus)
         */
        function updateDatalayerInitType(initType) {
            var extendedObject = {}
            extendedObject[PmtDatalayerConstants.DATALAYER_INFO.INIT_TYPE] = initType;
            addDataLayerInfo(extendedObject);
        }

        /**
         * Updates datalayer info with the nedded upgrade information
         * @param {Boolean} isOfferSelected true if the user has selected an offer
         * @param {Boolean} isUpgradeFree true if the upgrade shown is free
         * @param {Array<Object>} selectedOffer the selected offer data
         * @param {Boolean} upgradingAccepted true if the users accepted the upgrade
         * @param {String} currencySymbol the currency symbol (Ej: '€' )
         */
        function updateDatalayerForUpgrade(isOfferSelected, isUpgradeFree, selectedOffer, upgradingAccepted, currencySymbol) {
            var i, actualSegmentBookingType, extendedDatalayerInfo = {}, upgradeAmount = 0;
            var dataLayerBookingType = '';
            extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.UPGRADE_SHOWN] = isUpgradeFree ?
                PmtDatalayerConstants.DATALAYER_VALUES.FREE : PmtDatalayerConstants.DATALAYER_VALUES.PAYMENT;
            extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.UPGRADE_SENT] = upgradingAccepted && isOfferSelected
                ? PmtDatalayerConstants.DATALAYER_VALUES.YES : PmtDatalayerConstants.DATALAYER_VALUES.NO;
            if (isOfferSelected) {
                for (i = 0; i < selectedOffer.length; i++) {
                    if (selectedOffer[i] && selectedOffer[i].offerSegmentClasses[0] && selectedOffer[i].offerSegmentClasses[0].cabinClass
                        && selectedOffer[i].offerSegmentClasses[0].cabinClass.type) {
                        actualSegmentBookingType = selectedOffer[i].offerSegmentClasses[0].cabinClass.type.charAt(0);
                        dataLayerBookingType = dataLayerBookingType === '' || PmtDatalayerConstants.SEGMENT_CABIN_PRIORITY[dataLayerBookingType] > PmtDatalayerConstants.SEGMENT_CABIN_PRIORITY[actualSegmentBookingType]
                            ? actualSegmentBookingType : dataLayerBookingType;
                    }
                    upgradeAmount += selectedOffer[i].totalAmount;
                }
                extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = dataLayerBookingType;
            }
            extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.UPGRADE_TOTAL] = upgradeAmount + currencySymbol;
            addDataLayerInfo(extendedDatalayerInfo);
        };

        /**
         * Updates datalayer info with the nedded ancillaries information
         * @param {Integer} baggagesPrice the total baggage price
         * @param {Integer} seatsPrice the total seat price
         * @param {Integer} assurancesPrice the total assurancePrice
         */
        function updateDatalayerForAncillaries(baggagesPrice, seatsPrice, assurancesPrice) {
            var extendedDatalayerInfo = {};
            var baggageDataLayerInfo = PmtDatalayerConstants.DATALAYER_VALUES.BAGGAGES + ': ' + (baggagesPrice > 0 ? PmtDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + baggagesPrice : PmtDatalayerConstants.DATALAYER_VALUES.NO);
            var seatDataLayerInfo = PmtDatalayerConstants.DATALAYER_VALUES.SEATS + ': ' + (seatsPrice > 0 ? PmtDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + seatsPrice : PmtDatalayerConstants.DATALAYER_VALUES.NO);
            var assuranceDataLayerInfo = PmtDatalayerConstants.DATALAYER_VALUES.ASSURANCES + ': ' + (assurancesPrice > 0 ? PmtDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + assurancesPrice : PmtDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[PmtDatalayerConstants.DATALAYER_INFO.ANCILLARIES_BOUGHT] = seatDataLayerInfo + ' - ' + baggageDataLayerInfo + ' - ' + assuranceDataLayerInfo;
            addDataLayerInfo(extendedDatalayerInfo);
        }

        /**
        * reset Datalayer
        */
        function resetDatalayer() {
            var elementsDataLayer = [];
            var dataLayerModelVC = localStorageService.get('cvDatalayer');

            Object.keys(dataLayerModelVC).forEach(function (element) {
                if (element.toString() !== PmtDatalayerConstants.DATALAYER_INFO.USER_STATE && element.toString() !== DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE_WITHOUT_TAX && element.toString() !== DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE) {
                    elementsDataLayer.push(element.toString());
                }
            })
            removeDatalayerObjects(elementsDataLayer);
        }
    }
})();