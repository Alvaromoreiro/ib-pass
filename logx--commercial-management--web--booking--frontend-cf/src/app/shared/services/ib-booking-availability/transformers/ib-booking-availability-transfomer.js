import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
dayjs.extend(duration);
(function () {


    angular
        .module('ib-booking-availability-module')
        .factory('BookingAvailabilityTransformer', BookingAvailabilityTransformer);

    BookingAvailabilityTransformer.$inject = ['localStorageService', 'CurrencyService', '$filter', 'BookingUtilService', 'BookingAvailabilityConstants', 'DatalayerUtilsService', '$sce', 'BookingAppConstants', '$rootScope', '$window', 'IbBookingAvailabilityUtilsService', 'IbOriginDestinationInfoService', 'IbOriginDestinationInfoUtilsService', 'IbCheckPartnersDiscountsService', 'DatalayerBKIService'];
    function BookingAvailabilityTransformer (localStorageService, CurrencyService, $filter, BookingUtilService, BookingAvailabilityConstants, DatalayerUtilsService, $sce, BookingAppConstants, $rootScope, $window,IbBookingAvailabilityUtilsService, IbOriginDestinationInfoService, IbOriginDestinationInfoUtilsService, IbCheckPartnersDiscountsService, DatalayerBKIService) {
        return {
            transformGetAvailabilityData: transformGetAvailabilityData,
            transformGetRedemptionAvailabilityData: transformGetRedemptionAvailabilityData,
            transformGetOBRedemptionAvailabilityData: transformGetOBRedemptionAvailabilityData,
            createRequestAvailability: createRequestAvailability,
            createOriginDestinationInfo: createOriginDestinationInfo,
            createRedemptionOriginDestinationInfo: createRedemptionOriginDestinationInfo,
            createGetFareRequest: createGetFareRequest,
            createOBPointsRequest: createOBPointsRequest,
            generateCalendarRequest: generateCalendarRequest,
            generateInitialCalendarRequest: generateInitialCalendarRequest,
            getNextDate: getNextDate,
            transformSlidesData: transformSlidesData,
            transformRedemptionFare: transformRedemptionFare,
            transformOBRedemptionFare: transformOBRedemptionFare,
            getOriginDestinationLimitDates: getOriginDestinationLimitDates,
            generateSelectedSliceInfo: generateSelectedSliceInfo,
            updateLimitsCalendarData: updateLimitsCalendarData,
            getSelectedOffer: getSelectedOffer,
            getDetailedFaresInfo: getDetailedFaresInfo,
            createInfoMetaSearch: createInfoMetaSearch,
            getTotalPriceMetaSearch: getTotalPriceMetaSearch,
            generateSegmentWarningMessage: generateSegmentWarningMessage,
            createFlightSearchMonetate: createFlightSearchMonetate,
            checkCabinDescription: checkCabinDescription,
            isFareCompatible: isFareCompatible,
            genCalcAviosFlightReq: genCalcAviosFlightReq,
            TransCalcPointsData: TransCalcPointsData,
            moreThan2Hours: moreThan2Hours,
            updateFlightAviosInfoWithFF:updateFlightAviosInfoWithFF
        };

        ////////////////
        /**
         * Transforms the availability data received from the rest service in a model object to use in the view.
         * @param {Object} getAvailavilityData -The availability data received from the rest service
         * @returns {Object} - returns the input availability data into a well-structured object for the view
         */
        function transformGetAvailabilityData (getAvailavilityData, calendarInfo) {
            const transformedAvailabilityData = {
                originDestinations: [],
                currencies: CurrencyService.getCurrenciesAsMap(getAvailavilityData.contextMetadata.currencies),
                totalPrice: 0,
                relatedContent: {},
                fareFamilyConditions: IbBookingAvailabilityUtilsService.returnObservationsWithhtml(getAvailavilityData.fareFamilyConditions)

            };
            let i, j, slicesInfo = [], infoMetaSearch = null, responseId = null, offerInfoRecommended = null,  discounts = [{ name: $filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION') }];
            const originCalendarInfo = [];
            const specialDiscounts = [];
            const limitDates = IbBookingAvailabilityUtilsService.getOriginDestinationLimitDates(0);
            const calendarData = {
                originCalendarData: calendarInfo && calendarInfo.calendarRibbon.outBoundRow && calendarInfo.calendarRibbon.outBoundRow.cells,
                minDate: limitDates.minDate,
                maxDate: limitDates.maxDate,
                originDestinationIndex: 0
            };
            if (localStorageService.get('multiCitySearch')) {
                transformedAvailabilityData.multiCity = true;
                responseId = [];
                responseId[0] = getAvailavilityData.responseId;
            } else {
                transformedAvailabilityData.multiCity = false;
                responseId = getAvailavilityData.responseId;
            }
            transformedAvailabilityData.responseId = responseId;
            transformedAvailabilityData.redemption = false;
            if (getAvailavilityData.originDestinations && getAvailavilityData.originDestinations.length > 0) {
                for (i = 0; i < getAvailavilityData.originDestinations.length; i++) {
                    getAvailavilityData.originDestinations[i].showOd = (i === 0);
                    getAvailavilityData.originDestinations[i].showFaresSelected = false;
                }
                getAvailavilityData.originDestinations[0] =
                    createOriginDestinationInfo(getAvailavilityData.originDestinations[0], getAvailavilityData.offers, getAvailavilityData.fareFamilyConditions,
                        transformedAvailabilityData.currencies, calendarData);
                transformedAvailabilityData.originDestinations = getAvailavilityData.originDestinations;
                transformedAvailabilityData.metaSearchInfo = false;
            } else {
                offerInfoRecommended = getOfferInfoRecommended(getAvailavilityData.recommendedOfferId);
                getAvailavilityData.offers = [offerInfoRecommended];
                localStorageService.set('fareData', getAvailavilityData);
                localStorageService.set('orderItemsId', [offerInfoRecommended.offerItems[0].offerItemId]);
                infoMetaSearch = createInfoMetaSearch(getAvailavilityData);
                transformedAvailabilityData.originDestinations = infoMetaSearch.originDestination;
                transformedAvailabilityData.metaSearchInfo = true;
                transformedAvailabilityData.recommendedOfferId = getAvailavilityData.recommendedOfferId;
                transformedAvailabilityData.warnings = getAvailavilityData.warnings && getAvailavilityData.warnings.length > 0 ? getAvailavilityData.warnings : null;
                slicesInfo = infoMetaSearch.slicesInfo;
                transformedAvailabilityData.tax = offerInfoRecommended.price.tax;
                transformedAvailabilityData.selectedSlices = [];
                transformedAvailabilityData.totalPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(getAvailavilityData.contextMetadata.currencies[0]), offerInfoRecommended.price.total, true, false);
                for (j = 0; j < slicesInfo.length; j++) {
                    transformedAvailabilityData.selectedSlices[j] = {
                        selectedSliceIndex: j,
                        selectedSlicesLength: j,
                        cabin: transformedAvailabilityData.fareFamilyConditions[0].cabinType,
                        originDestinationId: transformedAvailabilityData.originDestinations[j].originDestinationId,
                        origin: transformedAvailabilityData.originDestinations[j].origin,
                        destination: transformedAvailabilityData.originDestinations[j].destination,
                        info: slicesInfo[j],
                        articleOffset: j === 0 ? 103 : 601,
                        transformOffset: j === 0 ? 0 : 450,
                        heightHeadingFlight: j === 0 ? 0 : 450,
                        available: true,
                        originCountry: transformedAvailabilityData.originDestinations[j].originCity.countryCode,
                        destinationCountry: transformedAvailabilityData.originDestinations[j].destinationCity.countryCode
                    };
                    transformedAvailabilityData.originDestinations[j].slices = [];
                    transformedAvailabilityData.originDestinations[j].slices[0] = slicesInfo[j];
                }
            }
            if (calendarInfo && calendarInfo.calendarRibbon.outBoundRow && calendarInfo.calendarRibbon.outBoundRow.cells) {
                originCalendarInfo.push(calendarInfo.calendarRibbon.outBoundRow.cells);
            }
            if (calendarInfo && calendarInfo.calendarRibbon.inBoundRow && calendarInfo.calendarRibbon.inBoundRow.cells) {
                originCalendarInfo.push(calendarInfo.calendarRibbon.inBoundRow.cells);
            }
            transformedAvailabilityData.changePassengers = false;
            transformedAvailabilityData.relatedContent = BookingUtilService.getRelatedContent(getAvailavilityData.relatedContent);
            localStorageService.set('availabilityRelatedContent', getAvailavilityData.relatedContent);
            localStorageService.set('responseId', getAvailavilityData.responseId);

            if (getAvailavilityData.specialDiscountsPossibilities) {
                for (i = 0; i < getAvailavilityData.specialDiscountsPossibilities.length; ++i) {
                    if (i < getAvailavilityData.specialDiscountsPossibilities.length - 1 && getAvailavilityData.specialDiscountsPossibilities[i].type === getAvailavilityData.specialDiscountsPossibilities[i + 1].type) {
                        discounts.push({ name: $filter('translate')('AVAILABILITY_METASEARCH_DISCOUNT_OPTION_' + getAvailavilityData.specialDiscountsPossibilities[i].discountType), code: getAvailavilityData.specialDiscountsPossibilities[i].discountType });
                    } else {
                        discounts.push({ name: $filter('translate')('AVAILABILITY_METASEARCH_DISCOUNT_OPTION_' + getAvailavilityData.specialDiscountsPossibilities[i].discountType), code: getAvailavilityData.specialDiscountsPossibilities[i].discountType });
                        specialDiscounts.push({
                            value: $filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION'),
                            type: getAvailavilityData.specialDiscountsPossibilities[i].type,
                            option: discounts
                        });
                        discounts = [{ name: $filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION') }];
                    }
                }
            }

            return {
                transformedAvailabilityData: transformedAvailabilityData,
                fareFamilyConditions: getAvailavilityData.fareFamilyConditions,
                allAvailableOffers: getAvailavilityData.offers,
                originCalendarInfo: originCalendarInfo,
                datalayerObject: DatalayerUtilsService.generateDatalayerAvailability(transformedAvailabilityData, getAvailavilityData.passengers, getAvailavilityData.responseId),
                specialDiscounts: specialDiscounts,
                digitalDataObject: DatalayerBKIService.generateDigitalDataAvailability(transformedAvailabilityData, getAvailavilityData.passengers, getAvailavilityData.responseId)
            };

            function getOfferInfoRecommended (offerId) {
                let i = 0, offerInfo = null;
                while (i < getAvailavilityData.offers.length && !offerInfo) {
                    if (getAvailavilityData.offers[i].offerId === offerId) {
                        offerInfo = getAvailavilityData.offers[i];
                    }
                    i++;
                }
                return offerInfo;
            }
        }

        /**
         * Transforms the availability data received from the rest service in a model object to use in the view.
         * @param {Object} getAvailavilityData -The redemption availability data received from the rest service
         * @param calendarInfo
         * @returns {Object} - returns the input availability data into a well-structured object for the view
         */
        function transformGetRedemptionAvailabilityData (getAvailavilityData, calendarInfo) {
            const transformedAvailabilityData = {
                originDestinations: [],
                incompatibleCabinClasses: getAvailavilityData.incompatibleCabinClasses,
                currencies: CurrencyService.getCurrencyObject(localStorageService.get('commercialData').currency),
                responseId: getAvailavilityData.responseId,
                totalPrice: 0,
                relatedContent: {},
                fareFamilyConditions: returnObservationsWithhtml(getAvailavilityData.fareFamilyConditions),
                flightRatio: ''
            };
            let i;
            const originCalendarInfo = [];
            const limitDates = IbBookingAvailabilityUtilsService.getOriginDestinationLimitDates(0);
            const calendarData = {
                originCalendarData: calendarInfo && calendarInfo.outbound && calendarInfo.outbound.availabilityCalendar,
                minDate: limitDates.minDate,
                maxDate: limitDates.maxDate,
                originDestinationIndex: 0
            };
            transformedAvailabilityData.redemption = true;
            if (getAvailavilityData.originDestinations && getAvailavilityData.originDestinations.length > 0) {
                for (i = 0; i < getAvailavilityData.originDestinations.length; i++) {
                    getAvailavilityData.originDestinations[i].showOd = (i === 0);
                    getAvailavilityData.originDestinations[i].showFaresSelected = false;
                }
                getAvailavilityData.originDestinations[0] =
                    createRedemptionOriginDestinationInfo(getAvailavilityData.originDestinations[0], getAvailavilityData.fareFamilyConditions, calendarData, getAvailavilityData.incompatibleCabinClasses);
                transformedAvailabilityData.originDestinations = getAvailavilityData.originDestinations;
                transformedAvailabilityData.metaSearchInfo = false;
                transformedAvailabilityData.multiCity = false;
                transformedAvailabilityData.availabilityProvider = getAvailavilityData.provider;

            }
            if (calendarInfo && calendarInfo.outbound && calendarInfo.outbound.availabilityCalendar) {
                originCalendarInfo.push(calendarInfo.outbound.availabilityCalendar);
            }
            if (calendarInfo && calendarInfo.inbound && calendarInfo.inbound.availabilityCalendar) {
                originCalendarInfo.push(calendarInfo.inbound.availabilityCalendar);
            }
            transformedAvailabilityData.changePassengers = false;
            transformedAvailabilityData.relatedContent = BookingUtilService.getRelatedContent(getAvailavilityData.relatedContent);
            transformedAvailabilityData.flightRatio = getAvailavilityData.flightRatio ? getAvailavilityData.flightRatio : '';
            localStorageService.set('availabilityRelatedContent', getAvailavilityData.relatedContent);
            localStorageService.set('responseId', getAvailavilityData.responseId);

            return {
                transformedAvailabilityData: transformedAvailabilityData,
                fareFamilyConditions: getAvailavilityData.fareFamilyConditions,
                originCalendarInfo: originCalendarInfo,
                datalayerObject: DatalayerUtilsService.generateDatalayerAvailability(transformedAvailabilityData, getAvailavilityData.passengers, getAvailavilityData.responseId),
                digitalDataObject: DatalayerBKIService.generateDigitalDataAvailability(transformedAvailabilityData, getAvailavilityData.passengers, getAvailavilityData.responseId)
            };
        }

        /**
         * Transforms the availability data received from the rest service in a model object to use in the view.
         * @param {Object} getAvailavilityData -The on business redemption availability data received from the rest service
         * @returns {Object} - returns the input availability data into a well-structured object for the view
         */
        function transformGetOBRedemptionAvailabilityData (getAvailavilityData, calendarInfo) {
            const transformedAvailabilityData = {
                originDestinations: [],
                incompatibleCabinClasses: getAvailavilityData.incompatibleCabinClasses,
                currencies: CurrencyService.getCurrencyObject(localStorageService.get('commercialData').currency),
                responseId: getAvailavilityData.responseId,
                totalPrice: 0,
                relatedContent: {},
                fareFamilyConditions: returnObservationsWithhtml(getAvailavilityData.fareFamilyConditions),
                flightRatio: ''
            };
            let i, j;
            const originCalendarInfo = [];
            const limitDates = getOriginDestinationLimitDates(0);
            const calendarData = {
                originCalendarData: calendarInfo && calendarInfo.outbound && calendarInfo.outbound.availabilityCalendar,
                minDate: limitDates.minDate,
                maxDate: limitDates.maxDate,
                originDestinationIndex: 0
            };
            transformedAvailabilityData.redemption = true;
            if (getAvailavilityData.originDestinations && getAvailavilityData.originDestinations.length > 0) {
                for (i = 0; i < getAvailavilityData.originDestinations.length; i++) {
                    getAvailavilityData.originDestinations[i].showOd = (i === 0);
                    getAvailavilityData.originDestinations[i].showFaresSelected = false;
                }
                getAvailavilityData.originDestinations[0] =
                    createRedemptionOriginDestinationInfo(getAvailavilityData.originDestinations[0], getAvailavilityData.fareFamilyConditions, calendarData, getAvailavilityData.incompatibleCabinClasses);
                transformedAvailabilityData.originDestinations = getAvailavilityData.originDestinations;
                transformedAvailabilityData.metaSearchInfo = false;
                transformedAvailabilityData.multiCity = false;
                transformedAvailabilityData.availabilityProvider = getAvailavilityData.provider;

            }
            if (calendarInfo && calendarInfo.outbound && calendarInfo.outbound.availabilityCalendar) {
                originCalendarInfo.push(calendarInfo.outbound.availabilityCalendar);
            }
            if (calendarInfo && calendarInfo.inbound && calendarInfo.inbound.availabilityCalendar) {
                originCalendarInfo.push(calendarInfo.inbound.availabilityCalendar);
            }
            transformedAvailabilityData.changePassengers = false;
            transformedAvailabilityData.relatedContent = BookingUtilService.getRelatedContent(getAvailavilityData.relatedContent);
            transformedAvailabilityData.flightRatio = getAvailavilityData.flightRatio ? getAvailavilityData.flightRatio : '';
            localStorageService.set('availabilityRelatedContent', getAvailavilityData.relatedContent);
            localStorageService.set('responseId', getAvailavilityData.responseId);

            return {
                transformedAvailabilityData: transformedAvailabilityData,
                fareFamilyConditions: getAvailavilityData.fareFamilyConditions,
                originCalendarInfo: originCalendarInfo,
                datalayerObject: DatalayerUtilsService.generateDatalayerAvailability(transformedAvailabilityData, getAvailavilityData.passengers, getAvailavilityData.responseId),
                digitalDataObject: DatalayerBKIService.generateDigitalDataAvailability(transformedAvailabilityData, getAvailavilityData.passengers, getAvailavilityData.responseId)
            };
        }

        /*
            CREATEMETASEARCHINFO
        */
        function createInfoMetaSearch (getAvailavilityData) {
            let infoFlights = {};
            infoFlights = getInfoSlicesMetaSearch(getAvailavilityData.recommendedOfferId, getAvailavilityData.offers, getAvailavilityData.fareFamilyConditions, getAvailavilityData.contextMetadata.currencies[0]);
            infoFlights.flightMetaSearch = true;

            return infoFlights;

            function getInfoSlicesMetaSearch (idOffer, offers, fareFamily, currencies) {
                let i, j,  allOperatedByAux = [], offer = {}, cabinInfoBySlice = null;
                const slicesInfo = [], infoMetaSearch = {}, originDestination = [];
                for (i = 0; i < offers.length; i++) {
                    if (offers[i].offerId === idOffer) {
                        offer = offers[i];
                    }
                }
                for (i = 0; i < offer.slices.length; i++) {
                    cabinInfoBySlice = generateInfoCabin(i, idOffer, offer, offers, fareFamily, currencies);
                    allOperatedByAux = [];
                    slicesInfo[i] = {
                        sliceId: i,
                        arrivalDateTime: offer.slices[i].arrivalDateTime,
                        arrivalDateTimeParsed: offer.slices[i].arrivalDateTime.split(' ')[1],
                        bestPrice: true,
                        cabins: cabinInfoBySlice.cabin,
                        cabinsLength: 1,
                        cashAvios: true,
                        departureDateTime: offer.slices[i].departureDateTime,
                        departureDateTimeParsed: offer.slices[i].departureDateTime.split(' ')[1],
                        daysOfTravel: Math.round((new Date(offer.slices[i].arrivalDateTime.split(' ')[0]) - new Date(offer.slices[i].departureDateTime.split(' ')[0])) / BookingAvailabilityConstants.ONE_DAY_MILISECONDS),
                        departureDateParsed: $filter('DateFormatFilter')(offer.slices[i].departureDateTime),
                        arrivalDateParsed: $filter('DateFormatFilter')(offer.slices[i].arrivalDateTime),
                        duration: offer.slices[i].duration,
                        durationParsed: $filter('DurationFormatFilter')(offer.slices[i].duration),
                        overnight: offer.slices[i].overnight,
                        showFares: true,
                        sliceCurrency: offer.slices[i].price.currency,
                        stopsNumber: offer.slices[i].stopsNumber,
                        maxSlicePrice: offer.slices[i].price.fare,
                        allOperatedBy: [],
                        segments: []
                    };
                    slicesInfo[i].selectedFareFamily = slicesInfo[i].cabins[cabinInfoBySlice.cabinTypeAssigned].fareFamilies;
                    slicesInfo[i].showedCabin = cabinInfoBySlice.cabinTypeAssigned;
                    slicesInfo[i].slicePrice = slicesInfo[i].selectedFareFamily[0].farePriceToCalculate;
                    for (j = 0; j < offer.slices[i].segments.length; j++) {
                        const logoURLS = BookingUtilService.getCompanyURL(offer.slices[i].segments[j].flight.operationalDisclosure);
                        slicesInfo[i].segments[j] = offer.slices[i].segments[j];
                        slicesInfo[i].segments[j].durationParsed = $filter('DurationFormatFilter')(offer.slices[i].segments[j].duration);
                        slicesInfo[i].segments[j].waitingTimeParsed = $filter('DurationFormatFilter')(offer.slices[i].segments[j].waitingTime);
                        slicesInfo[i].segments[j].departureDateTimeParsed = offer.slices[i].segments[j].departureDateTime.split(' ')[1]; 7;
                        slicesInfo[i].segments[j].arrivalDateParsed = $filter('DateFormatFilter')(offer.slices[i].segments[j].arrivalDateTime);
                        slicesInfo[i].segments[j].arrivalDateTimeParsed = offer.slices[i].segments[j].arrivalDateTime.split(' ')[1];
                        slicesInfo[i].segments[j].companyURL = logoURLS?.logo;
                        slicesInfo[i].segments[j].companyURLMin= logoURLS?.logoMin;
                        if (j === 0) {
                            slicesInfo[i].sliceURL = offer.slices[i].segments[j].companyURL;
                            slicesInfo[i].sliceMin = offer.slices[i].segments[j].companyURLMin;
                        }
                        if (allOperatedByAux.indexOf(offer.slices[i].segments[j].flight.operationalCarrier.code) === -1) {
                            allOperatedByAux.push(offer.slices[i].segments[j].flight.operationalCarrier.code);
                            slicesInfo[i].allOperatedBy.push(offer.slices[i].segments[j].flight.operationalCarrier.name);
                        }
                        angular.extend(offer.slices[i].segments[j], generateSegmentWarningMessage(offer.slices[i].segments[j], j > 0 ? offer.slices[i].segments[j - 1] : null));
                    }

                }
                for (i = 0; i < slicesInfo.length; i++) {
                    originDestination[i] = {
                        originDestinationId: 'OD' + (i + 1),
                        currency: currencies.code,
                        destination: offer.slices[i].segments[offer.slices[i].segments.length - 1].arrival.code,
                        destinationCity: offer.slices[i].segments[offer.slices[i].segments.length - 1].arrival.city,
                        isAvailable: true,
                        loadingAvailability: false,
                        origin: offer.slices[i].segments[0].departure.code,
                        originCity: offer.slices[i].segments[0].departure.city,
                        showOd: true,
                        showFaresSelected: true,
                        filterOptions: null
                    };
                }
                infoMetaSearch.originDestination = originDestination;
                infoMetaSearch.slicesInfo = slicesInfo;
                return infoMetaSearch;

                function generateInfoCabin (index, offerId, offer, offers, fareFamily, currency) {
                    let i, slice = {}, fareFamiliAux = [];
                    const cabin = {};
                    slice = offer.slices[index];
                    fareFamiliAux = selectFareOfferId(offerId, offers, fareFamily, index);
                    fareFamily = angular.copy(fareFamiliAux);
                    for (i = 0; i < fareFamily.length; i++) {
                        fareFamily[i].fareCurrency = currency.code;
                        fareFamily[i].fareDiscountPriceShown = null;
                        fareFamily[i].fareDiscountPriceToCalculate = null;
                        fareFamily[i].farePrice = offer.price.total;
                        fareFamily[i].farePriceShown = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), slice.price.total, false, true);
                        fareFamily[i].farePriceToCalculate = slice.price.total;
                        fareFamily[i].isCompatibleFare = true;
                        fareFamily[i].remainingSeats = slice.segments[0].cabin.remainingSeats;
                        fareFamily[i].offers = offers;
                        cabin[fareFamily[i].cabinType] = {
                            bestCabinsPrice: true,
                            bestPrice: fareFamily[i].farePriceToCalculate,
                            bestPriceShown: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), fareFamily[i].farePriceToCalculate, false, true),
                            cabinAvailable: true,
                            cabinDescription: fareFamily[i].cabinDescription,
                            isCabinCompatible: true,
                            fareFamilies: fareFamily
                        };
                    }

                    return { cabin: cabin, cabinTypeAssigned: fareFamily[0].cabinType };

                    function selectFareOfferId (offerId, offers, fareFamilies, index) {
                        let i, j;
                        const fareFamilySelect = [];
                        for (i = 0; i < offers.length; i++) {
                            if (offerId === offers[i].offerId) {
                                for (j = 0; j < fareFamilies.length; j++) {
                                    if (offers[i].slices[index].segments[0].cabin.fareFamily === fareFamilies[j].commercialCode) {
                                        fareFamilySelect.push(fareFamilies[j]);
                                        if (fareFamilies[j].conditions) {
                                            angular.forEach(fareFamilies[j].conditions, (condition) => {
                                                condition.previewStatus = fareFamilies[j].conditionsPriority.indexOf(condition.code) !== -1;
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        return fareFamilySelect;
                    }
                }
            }
        }


        ////////////////

        /**
         * Transforms the url params received from the web search Fligths to create the request for availability rest service.
         * @returns {Object} - returns the object to call the availability rest service
         */
        function createRequestAvailability () {
            if (localStorageService.get('searchFlightType') === 'multiCityFlight')
                localStorageService.set('multiCitySearch', true);
            return localStorageService.get('calditMode') ? localStorageService.get('newAvailabilityRequestData') : (localStorageService.get('availabilityRequestData') || BookingUtilService.generateAvailabilityRequestData());
        }
        /*

         */
        function returnObservationsWithhtml (fareFamily) {
            let i, j;
            for (i = 0; i < fareFamily.length; i++) {
                for (j = 0; j < fareFamily[i].observations.length; j++) {
                    fareFamily[i].observations[j].observationText = $sce.trustAsHtml(fareFamily[i].observations[j].observationText);
                }
            }
            return fareFamily;
        }

        /**
         * Creates the originDestinations object to show in the view. Builds an array de slices with the possible offers for the slice.
         * @param {Array<Object>} originDestination -The current originDestination
         * @param {Array<Object>} offers -The possible offers in the current availability state
         * @param {Arrat<Object>} fareFamilyConditions -The fare fammilies available
         * @param {Object} currencies - the currencies list available
         * @param {Object} calendarInfo - the calendar info for slick component
         * @param {Array<Object>} currentSelectedOffers - The Offers to check the compatibility
         * @returns {Object} - returns the originDestination object with its associated slices and offers
         */
        function createOriginDestinationInfo (originDestination, offers, fareFamilyConditions, currencies, calendarInfo, currentSelectedOffers) {
            let  originCurrencyCode = null, maxSlicePrice;
            const showOd = originDestination.showOd;
            const originDestinationModel = originDestination;
            let i = 0, j = 0, sliceOffers = [], bestPrice = 0, isAvailable = false;
            const slicePrices = [], slicePricesByCabin = {}, cabins = {};
            for (i = 0; i < originDestinationModel.slices.length; i++) {
                maxSlicePrice = 0;
                const allOperatedByCodes = [];
                originDestinationModel.slices[i].bestPrice = false;
                sliceOffers = getSliceOffers(originDestinationModel.originDestinationId, originDestinationModel.slices[i], offers);
                const sliceOffersByFareFamilies = getSliceOffersByFareFamilies(originDestinationModel.originDestinationId, originDestinationModel.slices[i].sliceId, sliceOffers, fareFamilyConditions, currentSelectedOffers);
                const fareFamilies = sliceOffersByFareFamilies.fareFamilies;
                originCurrencyCode = originCurrencyCode || fareFamilies.sliceCurrency;
                isAvailable = isAvailable || fareFamilies.slicePrice !== 0;
                originDestinationModel.slices[i].cabins = sliceOffersByFareFamilies.cabins;
                originDestinationModel.slices[i].cabinsLength = sliceOffersByFareFamilies.cabinsLength;
                originDestinationModel.slices[i].showFares = false;
                originDestinationModel.slices[i].slicePrice = fareFamilies.slicePrice;
                originDestinationModel.slices[i].sliceCurrency = fareFamilies.sliceCurrency;
                originDestinationModel.slices[i].durationParsed = $filter('DurationFormatFilter')(originDestinationModel.slices[i].duration);
                originDestinationModel.slices[i].departureDateTimeParsed = originDestinationModel.slices[i].departureDateTime.split(' ')[1];
                originDestinationModel.slices[i].departureDateParsed = $filter('DateFormatFilter')(originDestinationModel.slices[i].departureDateTime);
                originDestinationModel.slices[i].arrivalDateTimeParsed = originDestinationModel.slices[i].arrivalDateTime.split(' ')[1];
                originDestinationModel.slices[i].daysOfTravel = Math.round((new Date(originDestinationModel.slices[i].arrivalDateTime.split(' ')[0]) - new Date(originDestinationModel.slices[i].departureDateTime.split(' ')[0])) / BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                originDestinationModel.slices[i].allOperatedBy = [];
                originDestinationModel.slices[i].technicalStop = 0;
                for (j = 0; j < originDestinationModel.slices[i].segments.length; j++) {
                    const logoURLS = BookingUtilService.getCompanyURL(originDestinationModel.slices[i].segments[j].flight.operationalDisclosure);
                    originDestinationModel.slices[i].segments[j].durationParsed = $filter('DurationFormatFilter')(originDestinationModel.slices[i].segments[j].duration);
                    originDestinationModel.slices[i].segments[j].isMoreThan2h = moreThan2Hours(originDestinationModel.slices[i].segments[j].waitingTime);
                    originDestinationModel.slices[i].segments[j].waitingTimeParsed = $filter('DurationFormatFilter')(originDestinationModel.slices[i].segments[j].waitingTime);
                    originDestinationModel.slices[i].segments[j].departureDateTimeParsed = originDestinationModel.slices[i].segments[j].departureDateTime.split(' ')[1]; 7;
                    originDestinationModel.slices[i].segments[j].departureDateParsed = $filter('DateFormatFilter')(originDestinationModel.slices[i].segments[j].departureDateTime);
                    originDestinationModel.slices[i].segments[j].arrivalDateTimeParsed = originDestinationModel.slices[i].segments[j].arrivalDateTime.split(' ')[1];
                    originDestinationModel.slices[i].segments[j].companyURL = logoURLS?.logo;
                    originDestinationModel.slices[i].segments[j].companyURLMin = logoURLS?.logoMin;
                    originDestinationModel.slices[i].segments[j].delayInformation = originDestinationModel.slices[i].segments[j].delayInformation && originDestinationModel.slices[i].segments[j].delayInformation.flightNumber ? getDelayInformation(originDestinationModel.slices[i].segments[j].delayInformation) : originDestinationModel.slices[i].segments[j].delayInformation;
                    originDestinationModel.slices[i].segments[j].stop = originDestinationModel.slices[i].segments[j].stop ? getStopInformation(originDestinationModel.slices[i].segments[j], originDestinationModel.slices[i]) : originDestinationModel.slices[i].segments[j].stop;
                    if (j === 0) {
                        originDestinationModel.slices[i].sliceURL = originDestinationModel.slices[i].segments[j].companyURL;
                        originDestinationModel.slices[i].sliceURLMin = originDestinationModel.slices[i].segments[j].companyURLMin;
                    }
                    if (allOperatedByCodes.indexOf(originDestinationModel.slices[i].segments[j].flight.operationalCarrier.code) === -1) {
                        allOperatedByCodes.push(originDestinationModel.slices[i].segments[j].flight.operationalCarrier.code);
                        originDestinationModel.slices[i].allOperatedBy.push(originDestinationModel.slices[i].segments[j].flight.operationalCarrier.name);
                    }
                    angular.extend(originDestinationModel.slices[i].segments[j],
                        generateSegmentWarningMessage(originDestinationModel.slices[i].segments[j], j > 0 ? originDestinationModel.slices[i].segments[j - 1] : null));

                }
                angular.forEach(getSlicePriceByCabin(sliceOffersByFareFamilies), (info, cabinType) => {
                    slicePricesByCabin[cabinType] = slicePricesByCabin[cabinType] || [];
                    slicePricesByCabin[cabinType].push(info);
                    maxSlicePrice = maxSlicePrice > 0 ? Math.max(maxSlicePrice, info) : info;
                });
                slicePrices.push(originDestinationModel.slices[i].slicePrice);
                angular.extend(cabins, originDestinationModel.slices[i].cabins);
                bestPrice = bestPrice > 0 ? Math.min(bestPrice, fareFamilies.slicePrice) : fareFamilies.slicePrice;
                originDestinationModel.slices[i].maxSlicePrice = maxSlicePrice;
            }
            originDestinationModel.slices = checkBestPriceandAvailabilitySlice(originDestinationModel.slices, bestPrice);
            originDestinationModel.filterOptions = getFilterOptions(slicePrices, angular.copy(cabins), currencies[originCurrencyCode], slicePricesByCabin);
            originDestinationModel.initialFilterOptions = angular.copy(originDestinationModel.filterOptions);
            originDestinationModel.selectedFilters = null;
            originDestinationModel.calendarSlides = getSlidesData(calendarInfo, currencies[originCurrencyCode]);
            originDestinationModel.loadingAvailability = false;
            originDestinationModel.currency = originCurrencyCode;
            originDestinationModel.calendarSlides.currency = currencies[originCurrencyCode];
            originDestinationModel.isAvailable = isAvailable;
            originDestinationModel.showOd = showOd;
            return originDestinationModel;

            function getSlicePriceByCabin (pricesByCabin) {
                const prices = {};
                angular.forEach(pricesByCabin.cabins, (info, cabinType) => {
                    prices[cabinType] = info.bestPrice;
                });
                return prices;
            }

            function getSliceOffers (originDestinationId, slice, currentOffers) {
                let  ofIndex = 0, orIndex, orFound, sIndex = false, sFound;
                const selectedOffers = [];
                if (originDestinationId) {
                    for (ofIndex = 0; ofIndex < currentOffers.length; ofIndex++) {
                        orFound = false; orIndex = 0;
                        while (!orFound && orIndex < currentOffers[ofIndex].originDestinations.length) {
                            if (currentOffers[ofIndex].originDestinations[orIndex].originDestinationId === originDestinationId) {
                                orFound = true; sFound = false; sIndex = 0;
                                while (!sFound && sIndex < currentOffers[ofIndex].originDestinations[orIndex].applicableSlices.length) {
                                    sFound = slice.sliceId === currentOffers[ofIndex].originDestinations[orIndex].applicableSlices[sIndex].sliceId;
                                    sIndex++;
                                }
                            }
                            orIndex++;
                        }
                        if (sFound) {
                            selectedOffers.push(currentOffers[ofIndex]);
                        }
                    }
                } else {
                    if (currentOffers.length === 1) {
                        selectedOffers.push(currentOffers[ofIndex]);
                    }
                }
                return selectedOffers;
            }

            function getSliceOffersByFareFamilies (originDestinationId, sliceId, currentOffers, fareFamilies, selectedOffersToCheck) {
                let fIndex, selectedCabins = {};
                const selectedFareFamilies = { fareFamilies: {}, slicePrice: 0, sliceCurrency: null };
                for (fIndex = 0; fIndex < fareFamilies.length; fIndex++) {
                    const singleFareFamily = IbOriginDestinationInfoService.getFareFamilyOffers(
                        originDestinationId, sliceId, currentOffers, fareFamilies[fIndex], selectedOffersToCheck, currencies);
                    if (singleFareFamily !== null) {
                        selectedFareFamilies.slicePrice = selectedFareFamilies.slicePrice > 0
                            ? Math.min(selectedFareFamilies.slicePrice, singleFareFamily.farePriceToCalculate) : singleFareFamily.farePriceToCalculate;
                        selectedFareFamilies.sliceCurrency = singleFareFamily.fareCurrency;
                        selectedFareFamilies.fareFamilies[fareFamilies[fIndex].commercialCode] = singleFareFamily;
                    }
                }
                selectedCabins = getSelectedCabins(selectedFareFamilies.fareFamilies, selectedFareFamilies.sliceCurrency, currencies);
                return { fareFamilies: selectedFareFamilies, cabins: selectedCabins, cabinsLength: Object.keys(selectedCabins).length };

            }

            function checkBestPriceandAvailabilitySlice (slices, price) {
                let sIndex, maxCabinsIndex;
                const slicesChecked = slices, maxCabins = [];
                for (sIndex = 0; sIndex < slicesChecked.length; sIndex++) {
                    slicesChecked[sIndex].bestPrice = slicesChecked[sIndex].slicePrice === price;
                    angular.forEach(slicesChecked[sIndex].cabins, (info, cabinType) => {
                        maxCabins.push({ cabinType: cabinType, cabinDescription: info.cabinDescription });
                        slicesChecked[sIndex].cabins[cabinType].bestCabinsPrice = slicesChecked[sIndex].cabins[cabinType].bestPrice === price;
                    });
                }
                for (sIndex = 0; sIndex < slicesChecked.length; sIndex++) {
                    const availabiliTycabins = {};
                    for (maxCabinsIndex = 0; maxCabinsIndex < maxCabins.length; maxCabinsIndex++) {
                        if (!slicesChecked[sIndex].cabins[maxCabins[maxCabinsIndex].cabinType]) {
                            slicesChecked[sIndex].cabins[maxCabins[maxCabinsIndex].cabinType] = { cabinAvailable: false, cabinDescription: maxCabins[maxCabinsIndex].cabinDescription };
                        }
                    }
                    if (slicesChecked[sIndex].cabins.E) {
                        availabiliTycabins.E = slicesChecked[sIndex].cabins.E;
                    }
                    if (slicesChecked[sIndex].cabins.N) {
                        availabiliTycabins.N = slicesChecked[sIndex].cabins.N;
                    }
                    if (slicesChecked[sIndex].cabins.T) {
                        availabiliTycabins.T = slicesChecked[sIndex].cabins.T;
                    }
                    if (slicesChecked[sIndex].cabins.B) {
                        availabiliTycabins.B = slicesChecked[sIndex].cabins.B;
                    }
                    slicesChecked[sIndex].cabins = availabiliTycabins;
                    slicesChecked[sIndex].cabinsLength = Object.keys(slicesChecked[sIndex].cabins).length;
                }
                return slicesChecked;
            }

            function getFilterOptions (prices, cabins, symbol, pricesCabin) {
                let minPrice = 0;
                let maxPrice = 0;
                let valueDifference, step;
                const cabinsList = {};
                const hourFilter = {
                    minValue: 0,
                    maxValue: 1440,
                    options: {
                        hideLimitLabels: true,
                        floor: 0,
                        ceil: 1440,
                        step: 30,
                        translate: function (value) {
                            return (value / 60) < 10
                                ? ('0' + Math.floor(value / 60) + (((value / 60) % 1 === 0) ? ':00' : ':30'))
                                : (Math.floor(value / 60) + (((value / 60) % 1 === 0) ? ':00' : ':30'));
                        }
                    }
                };
                const pricesByCabin = {};
                angular.forEach(cabins, (info) => {
                    delete info.fareFamilies;
                });
                angular.forEach(pricesCabin, (info, cabinType) => {
                    const minValueCabin = CurrencyService.getPriceByRoundingPolicy($filter('orderBy')(info)[0]);
                    const maxValueCabin = CurrencyService.getPriceByRoundingPolicy($filter('orderBy')(info)[info.length - 1]);
                    const differenceByCabin = maxValueCabin - minValueCabin;
                    let stepByCabin = 5;
                    if(differenceByCabin) {
                        if(differenceByCabin <= 500) {
                            stepByCabin = 5;
                        }else if(differenceByCabin <= 5000) {
                            stepByCabin = 10;
                        }else if(differenceByCabin <= 10000) {
                            stepByCabin = 50;
                        }else if(differenceByCabin <= 100000) {
                            stepByCabin = 100;
                        }else {
                            stepByCabin = 1000;
                        }
                    }
                    pricesByCabin[cabinType] = {
                        minValue: minValueCabin,
                        maxValue: maxValueCabin
                    };
                    pricesByCabin[cabinType].options = {
                        hideLimitLabels: true,
                        enforceStep: false,
                        floor: minValueCabin,
                        ceil: maxValueCabin,
                        step: stepByCabin,
                        translate: function (value) {
                            return value + symbol.currencySymbol;
                        }
                    };
                    minPrice = minPrice > 0 ? Math.min(minPrice, minValueCabin) : minValueCabin;
                    maxPrice = maxPrice > 0 ? Math.max(maxPrice, maxValueCabin) : maxValueCabin;
                    valueDifference = maxPrice - minPrice;
                    step = 5;
                    if(valueDifference) {
                        if(valueDifference <= 500) {
                            step = 5;
                        }else if(valueDifference <= 5000) {
                            step = 10;
                        }else if(valueDifference <= 10000) {
                            step = 50;
                        }else if(valueDifference <= 100000) {
                            step = 100;
                        }else {
                            step = 1000;
                        }
                    }
                });
                cabinsList.anyCabin = { cabinDescription: 'AVAILABILITY_MODAL_FILTERS_ALL_CABINS', cabinAvailable: false, type: 'anyCabin' };
                angular.extend(cabinsList, angular.copy(cabins));
                return {
                    cabinType: cabinsList,
                    price: {
                        minValue: minPrice,
                        maxValue: maxPrice,
                        options: {
                            hideLimitLabels: true,
                            enforceStep: false,
                            floor: minPrice,
                            ceil: maxPrice,
                            step: step,
                            translate: function (value) {
                                return value + symbol.currencySymbol;
                            }
                        }
                    },
                    cabin: cabinsList.anyCabin,
                    pricesByCabin: pricesByCabin,
                    departureHours: angular.copy(hourFilter),
                    arrivalHours: angular.copy(hourFilter),
                    stopsNumber1: { enable: false },
                    stopsNumber2: { enable: false },
                    stopsNumber3: { enable: false },
                    avios: false
                };
            }


            function getDelayInformation (delayInformation) {
                const delayInfo = {
                    code: delayInformation.companyCode + delayInformation.flightNumber,
                    timeInformation: delayInformation.lastLoad,
                    delayed30: delayInformation.percent30,
                    delayed60: delayInformation.percent60,
                    percentCancelled: delayInformation.percentCancelled
                };
                return delayInfo;
            }

            function getStopInformation (segmentInfo, sliceInfo) {
                const stopInfo = {
                    city: segmentInfo.stop.city,
                    durationParsed: $filter('DurationFormatFilter')(segmentInfo.stop.duration),
                    duration: segmentInfo.stop.duration
                };
                sliceInfo.technicalStop++;

                return stopInfo;
            }
        }

        function getSlidesData (calendarData, currencyObject) {
            let slides = [],  selectedSlide = 0,  slickModelEnds = false,  slidePosition = 0;
            const slickModel = [];
            const isRedemption = localStorageService.get('searchFlightType') === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
            if (calendarData && calendarData.originCalendarData) {
                slides = IbBookingAvailabilityUtilsService.slidesInfo(calendarData.originCalendarData);
                const currentDate = cloneDeep(calendarData.minDate);
                while (!slickModelEnds) {
                    const checkedSlides = isInSlides(slides, generateSlidesInfo(currentDate, BookingAvailabilityConstants.SLICK_STATUS.LOADING, slidePosition), calendarData.originDestinationIndex);
                    if (checkedSlides.isRequestSlide) selectedSlide = slickModel.length;
                    angular.extend(checkedSlides.slide, {
                        formattedPrice: isRedemption ? CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, checkedSlides.slide.price) : CurrencyService.formatPrice(currencyObject, checkedSlides.slide.price, false, true)
                    });
                    slickModel.push(checkedSlides.slide);
                    currentDate.setTime(currentDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);//adds one day to currentDate
                    slickModelEnds = currentDate.getTime() > calendarData.maxDate.getTime();
                    slidePosition++;
                }
                selectedSlide = completeSlickModel(slickModel, selectedSlide);
                angular.extend(slickModel[0], { firstItem: true });
                angular.extend(slickModel[slickModel.length - 1], { lastItem: true });
            }
            return {
                slides: slickModel,
                currentInitialSlide: selectedSlide,
                selectedSlide: selectedSlide,
                maxDate: calendarData.maxDate,
                minDate: calendarData.minDate,
                currentSlides: []
            };

            function completeSlickModel (slickInfo, activeSlide) {//Completes slick until 7 days
                const daysOffset = Math.floor((BookingAvailabilityConstants.DAYS_AFTER + BookingAvailabilityConstants.DAYS_BEFORE + 1) / 2);
                let i, generatedDate = new Date(slickInfo[0].serviceDate);
                activeSlide += daysOffset;
                for (i = 0; i < slickModel.length; i++) {
                    slickModel[i].slidePosition += daysOffset;
                }
                generatedDate.setTime(generatedDate.getTime() - BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                for (i = daysOffset - 1; i >= 0; i--) {
                    slickInfo.unshift(generateSlidesInfo(generatedDate, BookingAvailabilityConstants.SLICK_STATUS.DISABLED, i));
                    generatedDate.setTime(generatedDate.getTime() - BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                }
                const slickLength = slickInfo.length;
                generatedDate = new Date(slickInfo[slickLength - 1].serviceDate);
                generatedDate.setTime(generatedDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                for (i = slickLength; i < slickLength + daysOffset; i++) {
                    slickInfo.push(generateSlidesInfo(generatedDate, BookingAvailabilityConstants.SLICK_STATUS.DISABLED, i));
                    generatedDate.setTime(generatedDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                }
                return activeSlide;
            }

            function isInSlides (serviceSlides, slideDate, originDestinationIndex) {
                const availabilityData = localStorageService.get('newAvailabilityRequestData') || localStorageService.get('availabilityRequestData');
                let sIndex = 0, sFound = false;
                const returnedSlide = {
                    slide: slideDate,
                    isRequestSlide: false
                };
                while (!sFound && sIndex < serviceSlides.length) {
                    if (slideDate.serviceDate === serviceSlides[sIndex].serviceDate) {
                        sFound = true;
                        angular.extend(returnedSlide.slide, serviceSlides[sIndex]);
                        returnedSlide.isRequestSlide = availabilityData.slices[originDestinationIndex].date === serviceSlides[sIndex].serviceDate;
                    }
                    sIndex++;
                }
                return returnedSlide;
            }
        }


        /**
         * Creates the originDestination object to show in the view.
         * @param {*} originDestination
         * @param {*} fareFamilyConditions
         * @param {*} calendarInfo
         * @param {*} incompatibleCabinClasses
         */
        function createRedemptionOriginDestinationInfo (originDestination, fareFamilyConditions, calendarInfo, incompatibleCabinClasses) {
            const originDestinationModel = cloneDeep(originDestination);
            let isAvailable = false, allSegmentsCabins = {};
            const allCabins = {};
            const mnFilterLimitTimes = { arrivalTime: { min: '23:59', max: '00:00' }, departureTime: { min: '23:59', max: '00:00' } };
            const awsFilterLimitTimes = { arrivalTime: { min: '23:59', max: '00:00' }, departureTime: { min: '23:59', max: '00:00' } };
            const awsStopsNumbers = [];
            if ($rootScope.isPointsOBFlow) {
                originDestinationModel.slices = originDestinationModel.slices.filter((slice) => {
                    return slice.provider === 'AWS';
                });
            }

            for (let i = 0; i < originDestinationModel.slices.length; i++) {
                const allOperatedByCodes = [];
                originDestinationModel.slices[i].bestPrice = false;
                isAvailable = true;
                originDestinationModel.slices[i].showFares = false;
                originDestinationModel.slices[i].durationParsed = $filter('DurationFormatFilter')(originDestinationModel.slices[i].duration);
                originDestinationModel.slices[i].departureDateTimeParsed = originDestinationModel.slices[i].departureDateTime.split(' ')[1];
                originDestinationModel.slices[i].departureDateParsed = $filter('DateFormatFilter')(originDestinationModel.slices[i].departureDateTime);
                originDestinationModel.slices[i].arrivalDateParsed = $filter('DateFormatFilter')(originDestinationModel.slices[i].arrivalDateTime);
                originDestinationModel.slices[i].arrivalDateTimeParsed = originDestinationModel.slices[i].arrivalDateTime.split(' ')[1];
                originDestinationModel.slices[i].daysOfTravel = Math.round((new Date(originDestinationModel.slices[i].arrivalDateTime.split(' ')[0]) - new Date(originDestinationModel.slices[i].departureDateTime.split(' ')[0])) / BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                originDestinationModel.slices[i].allOperatedBy = [];
                originDestinationModel.slices[i].originCity = originDestinationModel.originCity;
                originDestinationModel.slices[i].destinationCity = originDestinationModel.destinationCity;
                originDestinationModel.slices[i].stopOverCities = [];
                for (let j = 0; j < originDestinationModel.slices[i].segments.length; j++) {
                    const segmentOffersByCabin = getSegmentOffersByCabin(originDestinationModel.slices[i].segments[j].offers, fareFamilyConditions, originDestinationModel.slices[i].sliceId, originDestinationModel.originDestinationId, originDestinationModel.slices[i].segments[j].segmentId, incompatibleCabinClasses);
                    const logoURLS = BookingUtilService.getCompanyURL(originDestinationModel.slices[i].segments[j].flight.operationalDisclosure);
                    originDestinationModel.slices[i].segments[j].showFares = false;
                    originDestinationModel.slices[i].segments[j].durationParsed = $filter('DurationFormatFilter')(originDestinationModel.slices[i].segments[j].duration);
                    originDestinationModel.slices[i].segments[j].isMoreThan2h = moreThan2Hours(originDestinationModel.slices[i].segments[j].waitingTime);
                    originDestinationModel.slices[i].segments[j].waitingTimeParsed = $filter('DurationFormatFilter')(originDestinationModel.slices[i].segments[j].waitingTime);
                    originDestinationModel.slices[i].segments[j].departureDateTimeParsed = originDestinationModel.slices[i].segments[j].departureDateTime.split(' ')[1]; 7;
                    originDestinationModel.slices[i].segments[j].departureDateParsed = $filter('DateFormatFilter')(originDestinationModel.slices[i].segments[j].departureDateTime);
                    originDestinationModel.slices[i].segments[j].arrivalDateParsed = $filter('DateFormatFilter')(originDestinationModel.slices[i].segments[j].arrivalDateTime);
                    originDestinationModel.slices[i].segments[j].arrivalDateTimeParsed = originDestinationModel.slices[i].segments[j].arrivalDateTime.split(' ')[1];
                    originDestinationModel.slices[i].segments[j].companyURL = logoURLS?.logo;
                    originDestinationModel.slices[i].segments[j].companyURLMin = logoURLS?.logoMin;
                    originDestinationModel.slices[i].segments[j].cabins = cloneDeep(segmentOffersByCabin);
                    originDestinationModel.slices[i].segments[j].cabinsLength = Object.keys(segmentOffersByCabin).length;
                    originDestinationModel.slices[i].segments[j].arrival.code ??= originDestinationModel.slices[i].segments[j].arrival.airport.code;
                    originDestinationModel.slices[i].segments[j].arrival.name ??= originDestinationModel.slices[i].segments[j].arrival.airport.description;
                    originDestinationModel.slices[i].segments[j].departure.code ??= originDestinationModel.slices[i].segments[j].departure.airport.code;
                    originDestinationModel.slices[i].segments[j].departure.name ??= originDestinationModel.slices[i].segments[j].departure.airport.description;
                    if (j === 0) {
                        originDestinationModel.slices[i].sliceURL = originDestinationModel.slices[i].segments[j].companyURL;
                        originDestinationModel.slices[i].sliceURLMin = originDestinationModel.slices[i].segments[j].companyURLMin;
                        allSegmentsCabins = cloneDeep(originDestinationModel.slices[i].segments[j].cabins);
                        originDestinationModel.slices[i].sliceSelectedSegments = 0;
                    } else {
                        originDestinationModel.slices[i].stopOverCities.push(originDestinationModel.slices[i].segments[j].departure.city);
                        angular.forEach(allSegmentsCabins, (cabin) => {
                            if (!originDestinationModel.slices[i].segments[j].cabins[cabin.cabinType].cabinAvailable) allSegmentsCabins[cabin.cabinType].cabinAvailable = false;
                        });
                    }
                    if (allOperatedByCodes.indexOf(originDestinationModel.slices[i].segments[j].flight.operationalCarrier.code) === -1) {
                        allOperatedByCodes.push(originDestinationModel.slices[i].segments[j].flight.operationalCarrier.code);
                        originDestinationModel.slices[i].allOperatedBy.push(originDestinationModel.slices[i].segments[j].flight.operationalCarrier.name);
                    }
                    angular.extend(originDestinationModel.slices[i].segments[j],
                        generateSegmentWarningMessage(originDestinationModel.slices[i].segments[j], j > 0 ? originDestinationModel.slices[i].segments[j - 1] : null));

                }
                if (originDestinationModel.slices[i].segments.length === 1) {
                    originDestinationModel.slices[i].cabins = cloneDeep(originDestinationModel.slices[i].segments[0].cabins);
                    originDestinationModel.slices[i].cabinsLength = cloneDeep(originDestinationModel.slices[i].segments[0].cabinsLength);
                } else {
                    originDestinationModel.slices[i].cabins = cloneDeep(allSegmentsCabins);
                }
                if (originDestinationModel.slices[i].provider === 'MN') {
                    mnFilterLimitTimes.arrivalTime.min = originDestinationModel.slices[i].arrivalDateTimeParsed < mnFilterLimitTimes.arrivalTime.min ? originDestinationModel.slices[i].arrivalDateTimeParsed : mnFilterLimitTimes.arrivalTime.min;
                    mnFilterLimitTimes.arrivalTime.max = originDestinationModel.slices[i].arrivalDateTimeParsed > mnFilterLimitTimes.arrivalTime.max ? originDestinationModel.slices[i].arrivalDateTimeParsed : mnFilterLimitTimes.arrivalTime.max;
                    mnFilterLimitTimes.departureTime.min = originDestinationModel.slices[i].departureDateTimeParsed < mnFilterLimitTimes.departureTime.min ? originDestinationModel.slices[i].departureDateTimeParsed : mnFilterLimitTimes.departureTime.min;
                    mnFilterLimitTimes.departureTime.max = originDestinationModel.slices[i].departureDateTimeParsed > mnFilterLimitTimes.departureTime.max ? originDestinationModel.slices[i].departureDateTimeParsed : mnFilterLimitTimes.departureTime.max;
                } else if (originDestinationModel.slices[i].provider === 'AWS') {
                    awsFilterLimitTimes.arrivalTime.min = originDestinationModel.slices[i].arrivalDateTimeParsed < awsFilterLimitTimes.arrivalTime.min ? originDestinationModel.slices[i].arrivalDateTimeParsed : awsFilterLimitTimes.arrivalTime.min;
                    awsFilterLimitTimes.arrivalTime.max = originDestinationModel.slices[i].arrivalDateTimeParsed > awsFilterLimitTimes.arrivalTime.max ? originDestinationModel.slices[i].arrivalDateTimeParsed : awsFilterLimitTimes.arrivalTime.max;
                    awsFilterLimitTimes.departureTime.min = originDestinationModel.slices[i].departureDateTimeParsed < awsFilterLimitTimes.departureTime.min ? originDestinationModel.slices[i].departureDateTimeParsed : awsFilterLimitTimes.departureTime.min;
                    awsFilterLimitTimes.departureTime.max = originDestinationModel.slices[i].departureDateTimeParsed > awsFilterLimitTimes.departureTime.max ? originDestinationModel.slices[i].departureDateTimeParsed : awsFilterLimitTimes.departureTime.max;
                    if (!awsStopsNumbers[originDestinationModel.slices[i].stopsNumber]) awsStopsNumbers[originDestinationModel.slices[i].stopsNumber] = true;
                }
            }
            angular.forEach(fareFamilyConditions, (fareFamily) => {
                allCabins[fareFamily.cabinType] = allCabins[fareFamily.cabinType] || { cabinType: fareFamily.cabinType, cabinDescription: fareFamily.cabinDescription, cabinAvailable: true };
            });
            originDestinationModel.selectedFilters = null;
            originDestinationModel.filterOptions = { MN: getRedemptionFilterOptions(cloneDeep(allCabins), mnFilterLimitTimes), AWS: getRedemptionFilterOptions(cloneDeep(allCabins), awsFilterLimitTimes, awsStopsNumbers) };
            originDestinationModel.initialFilterOptions = cloneDeep(originDestinationModel.filterOptions);
            originDestinationModel.loadingAvailability = false;
            originDestinationModel.currency = $filter('translate')('IBPURC_PAYMENTS_DISCOUNTS_AVIOS');
            originDestinationModel.isAvailable = isAvailable;
            originDestinationModel.calendarSlides = IbOriginDestinationInfoUtilsService.getSlidesData(calendarInfo, $filter('translate')('IBPURC_PAYMENTS_DISCOUNTS_AVIOS'));
            //getSlidesData(calendarInfo, $filter('translate')('IBPURC_PAYMENTS_DISCOUNTS_AVIOS'));
            originDestinationModel.calendarSlides.currency = localStorageService.get('commercialData').currency;
            if (calendarInfo.originDestinationIndex === 1) originDestinationModel.showOd = true;
            return originDestinationModel;

            function getSegmentOffersByCabin (segmentOffers, fareFamilyConditions, sliceId, originDestinationId, segmentId, incompatibleCabinClasses) {
                let  isFounded, isFareFounded, i, k;
                const offersByCabin = {};
                angular.forEach(fareFamilyConditions, (fareFamily) => {
                    offersByCabin[fareFamily.cabinType] = offersByCabin[fareFamily.cabinType] || { fareFamilies: [], cabinType: fareFamily.cabinType, cabinDescription: fareFamily.cabinDescription, cabinAvailable: false, bestPrice: {} };
                });
                angular.forEach(segmentOffers, (offerInfo) => {
                    i = 0, isFareFounded = false, k = 0; isFounded = false;
                    if (offersByCabin[offerInfo.bookingCode]) {
                        if (offerInfo.adultPrice) {
                            angular.extend(offerInfo.adultPrice, { formatPrice: CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, offerInfo.adultPrice.fare) });
                            if(angular.isUndefined(offersByCabin[offerInfo.bookingCode].bestPrice.fare)) {
                                offersByCabin[offerInfo.bookingCode].bestPrice =angular.copy(offerInfo.adultPrice);
                            }else {
                                if(offerInfo.adultPrice.fare === Math.min(offersByCabin[offerInfo.bookingCode].bestPrice.fare, offerInfo.adultPrice.fare)) {
                                    offersByCabin[offerInfo.bookingCode].bestPrice = angular.copy(offerInfo.adultPrice);
                                }else {
                                    offersByCabin[offerInfo.bookingCode].bestPrice = angular.copy(offersByCabin[offerInfo.bookingCode].bestPrice);
                                }
                            }
                        }
                        while (!isFareFounded && i < offersByCabin[offerInfo.bookingCode].fareFamilies.length) {
                            if (offersByCabin[offerInfo.bookingCode].fareFamilies[i].commercialCode === offerInfo.fareFamily) {
                                offersByCabin[offerInfo.bookingCode].fareFamilies[i].offers.push(offerInfo);
                                if (offerInfo.adultPrice) offersByCabin[offerInfo.bookingCode].fareFamilies[i].farePrice = offerInfo.adultPrice.fare;
                                isFareFounded = true;
                            }
                            i++;
                        }
                        if (!isFareFounded) {
                            while (!isFounded && k < fareFamilyConditions.length) {
                                if (fareFamilyConditions[k].cabinType === offerInfo.bookingCode && fareFamilyConditions[k].commercialCode === offerInfo.fareFamily) {
                                    offersByCabin[offerInfo.bookingCode].fareFamilies.push(fareFamilyConditions[k]);
                                    offersByCabin[offerInfo.bookingCode].fareFamilies[offersByCabin[offerInfo.bookingCode].fareFamilies.length - 1].offers = [offerInfo];
                                    offersByCabin[offerInfo.bookingCode].fareFamilies[offersByCabin[offerInfo.bookingCode].fareFamilies.length - 1].remainingSeats = offerInfo.remainingSeats;
                                    offersByCabin[offerInfo.bookingCode].cabinAvailable = true;
                                    offersByCabin[offerInfo.bookingCode].notAvailableCabins = redemptionCompatibleCabin(sliceId, originDestinationId, segmentId, offerInfo.offerId, incompatibleCabinClasses);
                                    offersByCabin[offerInfo.bookingCode].isCabinCompatible = true;
                                    isFounded = true;
                                }
                                k++;
                            }
                        }
                    }
                });
                return offersByCabin;

                function redemptionCompatibleCabin (sliceId, originDestinationId, segmentId, offerId, incompatibleCabinClasses) {
                    let segmentIncompatibleCabinClasses=null, hasIncompatibilities = false, i = 0;
                    if (incompatibleCabinClasses && incompatibleCabinClasses.length) {
                        while (!hasIncompatibilities && i < incompatibleCabinClasses.length) {
                            if (incompatibleCabinClasses[i].cabinClassWithIncompatibilities.sliceId === sliceId && incompatibleCabinClasses[i].cabinClassWithIncompatibilities.originDestinationId === originDestinationId &&
                                incompatibleCabinClasses[i].cabinClassWithIncompatibilities.segmentId === segmentId && incompatibleCabinClasses[i].cabinClassWithIncompatibilities.offerId === offerId) {
                                segmentIncompatibleCabinClasses = incompatibleCabinClasses[i].incompatibleCabinClasses;
                                hasIncompatibilities = true;
                            } else {
                                i++;
                            }
                        }
                    }
                    return segmentIncompatibleCabinClasses;
                }
            }

            function getRedemptionFilterOptions (cabins, limitFilterTimes, stopsNumbers) {
                let filterOptions = {};
                const cabinsList = {};
                const departureHourFilter = {
                    minValue: (dayjs.duration(limitFilterTimes.departureTime.min).hours() * 60) + (Math.floor((dayjs.duration(limitFilterTimes.departureTime.min).minutes()) / 30) * 30),
                    maxValue: (dayjs.duration(limitFilterTimes.departureTime.max).hours() * 60) + (Math.ceil((dayjs.duration(limitFilterTimes.departureTime.max).minutes()) / 30) * 30),
                    options: {
                        hideLimitLabels: true,
                        floor: (dayjs.duration(limitFilterTimes.departureTime.min).hours() * 60) + (Math.floor((dayjs.duration(limitFilterTimes.departureTime.min).minutes()) / 30) * 30),
                        ceil: (dayjs.duration(limitFilterTimes.departureTime.max).hours() * 60) + (Math.ceil((dayjs.duration(limitFilterTimes.departureTime.max).minutes()) / 30) * 30),
                        step: 30,
                        translate: function (value) {
                            return (value / 60) < 10 ? ('0' + Math.floor(value / 60) + (((value / 60) % 1 === 0) ? ':00' : ':30')) : (Math.floor(value / 60) + (((value / 60) % 1 === 0) ? ':00' : ':30'));
                        }
                    }
                };
                const arrivalHourFilter = {
                    minValue: (dayjs.duration(limitFilterTimes.arrivalTime.min).hours() * 60) + (Math.floor((dayjs.duration(limitFilterTimes.arrivalTime.min).minutes()) / 30) * 30),
                    maxValue: (dayjs.duration(limitFilterTimes.arrivalTime.max).hours() * 60) + (Math.ceil((dayjs.duration(limitFilterTimes.arrivalTime.max).minutes()) / 30) * 30),
                    options: {
                        hideLimitLabels: true,
                        floor: (dayjs.duration(limitFilterTimes.arrivalTime.min).hours() * 60) + (Math.floor((dayjs.duration(limitFilterTimes.arrivalTime.min).minutes()) / 30) * 30),
                        ceil: (dayjs.duration(limitFilterTimes.arrivalTime.max).hours() * 60) + (Math.ceil((dayjs.duration(limitFilterTimes.arrivalTime.max).minutes()) / 30) * 30),
                        step: 30,
                        translate: function (value) {
                            return (value / 60) < 10 ? ('0' + Math.floor(value / 60) + (((value / 60) % 1 === 0) ? ':00' : ':30')) : (Math.floor(value / 60) + (((value / 60) % 1 === 0) ? ':00' : ':30'));
                        }
                    }
                };
                angular.forEach(cabins, (info) => {
                    delete info.fareFamilies;
                });
                cabinsList.anyCabin = { cabinDescription: 'AVAILABILITY_MODAL_FILTERS_ALL_CABINS', cabinAvailable: false, type: 'anyCabin' };
                angular.extend(cabinsList, angular.copy(cabins));
                filterOptions = {
                    cabinType: cabinsList,
                    cabin: cabinsList.anyCabin,
                    departureHours: angular.copy(departureHourFilter),
                    arrivalHours: angular.copy(arrivalHourFilter)
                };
                if (stopsNumbers) {
                    if (stopsNumbers[0]) filterOptions.stopsNumber1 = { enable: false };
                    if (stopsNumbers[1]) filterOptions.stopsNumber2 = { enable: false };
                    if (stopsNumbers[2]) filterOptions.stopsNumber3 = { enable: false };
                }
                return filterOptions;
            }
        }

        function transformRedemptionFare (fareData) {
            let  i = 0,  showAviosMoney = false, firstElegible = false, count = 0, totalPassengers = 0;
            const totalPrice = {};
            const fareRate = [];
            const bookingUrlParams = localStorageService.get('bookingUrlParams');
            const commercialData = localStorageService.get('commercialData');
            const coupons = fareData.offers[0].limitedUseCoupon ? buildCoupons(fareData.offers[0].limitedUseCoupon) : null;
            if (bookingUrlParams.adult) totalPassengers += parseInt(bookingUrlParams.adult);
            if (bookingUrlParams.child) totalPassengers += parseInt(bookingUrlParams.child);
            if (bookingUrlParams.infant) totalPassengers += parseInt(bookingUrlParams.infant);
            if (fareData.offers[0].redemptionOptions) {
                for (i = 0; i < fareData.offers[0].redemptionOptions.length; i++) {
                    if (fareData.offers[0].redemptionOptions[i].eligible) {
                        showAviosMoney = true;
                        if (!firstElegible && count === 0) {
                            firstElegible = true;
                        }
                    }
                    fareRate.push({
                        avios: fareData.offers[0].redemptionOptions[i].totalPoints,
                        cash: fareData.offers[0].redemptionOptions[i].totalCash,
                        tax: fareData.offers[0].redemptionOptions[i].taxes.price.tax,
                        taxPerPassenger: fareData.offers[0].redemptionOptions[i].taxes.price.tax / totalPassengers,
                        aviosWithoutDiscount: fareData.offers[0].redemptionOptions[i].totalPoints,
                        cashWithoutDiscount: fareData.offers[0].redemptionOptions[i].totalCash,
                        fareCashPerPassenger: fareData.offers[0].redemptionOptions[i].totalCash.fare / totalPassengers,
                        fareAviosPerPassenger: fareData.offers[0].redemptionOptions[i].totalPoints.fare / totalPassengers,
                        formatPrice: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].redemptionOptions[i].totalCash.fare + fareData.offers[0].redemptionOptions[i].taxes.price.tax, true),
                        formatAvios: CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].redemptionOptions[i].totalPoints.fare),
                        formatOldPrice: '',
                        formatOldAvios: '',
                        eligible: fareData.offers[0].redemptionOptions[i].eligible,
                        selected: firstElegible,
                        redemptionOptionId: fareData.offers[0].redemptionOptions[i].optionId
                    });
                    if (firstElegible || (fareData.offers[0].redemptionOptions.length === 1)) {
                        totalPrice.fareCashPerPassenger = fareRate[fareRate.length - 1].fareCashPerPassenger;
                        totalPrice.fareAviosPerPassenger = fareRate[fareRate.length - 1].fareAviosPerPassenger;
                        totalPrice.tax = fareData.offers[0].redemptionOptions[i].taxes.price.tax;
                        totalPrice.taxPerPassenger = fareRate[fareRate.length - 1].taxPerPassenger;
                        totalPrice.redemptionOptionId = fareRate[fareRate.length - 1].redemptionOptionId;
                        totalPrice.price = {};
                        totalPrice.price.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cash.fare + fareData.offers[0].redemptionOptions[i].taxes.price.tax, true);
                        totalPrice.price.totalAvios = CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].avios.fare);
                        /*totalPrice.oldPriceWithoutDiscount = {};
                        totalPrice.oldPriceWithoutDiscount.totalCash = null
                        totalPrice.oldPriceWithoutDiscount.totalAvios = null*/
                        totalPrice.promotionApplied = false;
                        totalPrice.couponApplied = false;
                        firstElegible = false;
                        count++;
                    }
                }
            } else if (fareData.offers[0].promotion && fareData.offers[0].promotion.discountedRedemptionOptions) {
                for (i = 0; i < fareData.offers[0].promotion.discountedRedemptionOptions.length; i++) {
                    if (fareData.offers[0].promotion.discountedRedemptionOptions[i].eligible) {
                        showAviosMoney = true;
                        if (!firstElegible && count === 0) {
                            firstElegible = true;
                        }
                    }
                    fareRate.push({
                        avios: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalPoints,
                        cash: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalCash,
                        tax: fareData.offers[0].price.tax,
                        taxPerPassenger: fareData.offers[0].price.tax / totalPassengers,
                        aviosWithoutDiscount: fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalPoints,
                        cashWithoutDiscount: fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalCash,
                        fareCashPerPassenger: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalCash.fare / totalPassengers,
                        fareAviosPerPassenger: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalPoints.fare / totalPassengers,
                        formatPrice: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalCash.fare + fareData.offers[0].price.tax, true),
                        formatAvios: CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalPoints.fare),
                        formatOldPrice: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalCash.fare + fareData.offers[0].price.tax, true),
                        formatOldAvios: CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalPoints.fare),
                        eligible: fareData.offers[0].promotion.discountedRedemptionOptions[i].eligible,
                        selected: firstElegible,
                        redemptionOptionId: fareData.offers[0].promotion.discountedRedemptionOptions[i].optionId
                    });
                    if (firstElegible || (fareData.offers[0].promotion.length === 1)) {
                        totalPrice.fareCashPerPassenger = fareRate[fareRate.length - 1].fareCashPerPassenger;
                        totalPrice.fareAviosPerPassenger = fareRate[fareRate.length - 1].fareAviosPerPassenger;
                        totalPrice.tax = fareData.offers[0].price.tax;
                        totalPrice.taxPerPassenger = fareRate[fareRate.length - 1].taxPerPassenger;
                        totalPrice.redemptionOptionId = fareRate[fareRate.length - 1].redemptionOptionId;
                        totalPrice.price = {};
                        totalPrice.price.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cash.fare + fareData.offers[0].price.tax, true);
                        totalPrice.price.totalAvios = CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].avios.fare);
                        totalPrice.oldPriceWithoutDiscount = {};
                        totalPrice.oldPriceWithoutDiscount.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cashWithoutDiscount.fare + fareData.offers[0].price.tax, true);
                        totalPrice.oldPriceWithoutDiscount.totalAvios = CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].aviosWithoutDiscount.fare);
                        totalPrice.promotionApplied = true;
                        totalPrice.couponApplied = false;
                        firstElegible = false;
                        count++;
                    }
                }
            }

            return { fareRate: fareRate, totalPrice: totalPrice, withoutAviosMoney: (!showAviosMoney), coupons: coupons };
        }

        function transformOBRedemptionFare (fareData) {
            let i = 0,  showAviosMoney = false, firstElegible = false, count = 0;
            let  totalPassengers = 0;
            const totalPrice = {};
            const bookingUrlParams = localStorageService.get('bookingUrlParams');
            const commercialData = localStorageService.get('commercialData');
            const fareRate = [];
            const coupons = fareData.offers[0].limitedUseCoupon ? buildCoupons(fareData.offers[0].limitedUseCoupon) : null;
            if (bookingUrlParams.adult) totalPassengers += parseInt(bookingUrlParams.adult);
            if (bookingUrlParams.child) totalPassengers += parseInt(bookingUrlParams.child);
            if (fareData.offers[0].redemptionOptions) {
                for (i = 0; i < fareData.offers[0].redemptionOptions.length; i++) {
                    if (fareData.offers[0].redemptionOptions[i].eligible) {
                        showAviosMoney = true;
                        if (!firstElegible && count === 0) {
                            firstElegible = true;
                        }
                    }
                    fareRate.push({
                        points: fareData.offers[0].redemptionOptions[i].totalPoints,
                        cash: fareData.offers[0].redemptionOptions[i].totalCash,
                        fareCashPerPassenger: fareData.offers[0].redemptionOptions[i].totalCash.fare / totalPassengers,
                        farePointsPerPassenger: fareData.offers[0].redemptionOptions[i].totalPoints.fare / totalPassengers,
                        formatPrice: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].redemptionOptions[i].totalCash.fare, true),
                        formatAvios: CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].redemptionOptions[i].totalPoints.fare),
                        eligible: fareData.offers[0].redemptionOptions[i].eligible,
                        selected: firstElegible,
                        redemptionOptionId: fareData.offers[0].redemptionOptions[i].optionId
                    });
                    if (firstElegible || (fareData.offers[0].redemptionOptions.length === 1)) {
                        totalPrice.fareCashPerPassenger = fareRate[fareRate.length - 1].fareCashPerPassenger;
                        totalPrice.farePointsPerPassenger = fareRate[fareRate.length - 1].farePointsPerPassenger;
                        totalPrice.tax = fareData.offers[0].price.tax;
                        totalPrice.taxPerPassenger = fareRate[fareRate.length - 1].taxPerPassenger;
                        totalPrice.redemptionOptionId = fareRate[fareRate.length - 1].redemptionOptionId;
                        totalPrice.price = {};
                        totalPrice.price.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cash.fare + fareData.offers[0].price.tax, true);
                        totalPrice.price.totalPoints = CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].points.fare);
                        totalPrice.totalPoints = fareRate[fareRate.length - 1].points.fare;
                        firstElegible = false;
                        count++;
                    }
                    localStorageService.set('totalPrice', totalPrice);
                }
            }
            return { fareRate: fareRate, totalPrice: totalPrice, withoutAviosMoney: (!showAviosMoney), coupons: coupons };
        }

        function getSelectedCabins (selectedFares, currency, currencies) {
            const cabinsReturned = {};
            angular.forEach(selectedFares, (info) => {
                cabinsReturned[info.cabinType] = cabinsReturned[info.cabinType] || {};
                if (cabinsReturned[info.cabinType].bestPrice > 0) {
                    cabinsReturned[info.cabinType].bestPrice = Math.min(cabinsReturned[info.cabinType].bestPrice, info.farePriceToCalculate);
                    cabinsReturned[info.cabinType].bestPriceDiscount = cabinsReturned[info.cabinType].bestPrice === info.farePriceToCalculate ? info.fareDiscountPriceToCalculate : cabinsReturned[info.cabinType].bestPriceDiscount;
                } else {
                    cabinsReturned[info.cabinType].bestPrice = info.farePriceToCalculate;
                    cabinsReturned[info.cabinType].bestPriceDiscount = info.fareDiscountPriceToCalculate ? info.fareDiscountPriceToCalculate : null;
                }
                cabinsReturned[info.cabinType].bestPriceDiscountShown = cabinsReturned[info.cabinType].bestPriceDiscount ? CurrencyService.formatPrice(currencies[currency], cabinsReturned[info.cabinType].bestPriceDiscount, false, true) : null;
                cabinsReturned[info.cabinType].bestPriceShown = CurrencyService.formatPrice(currencies[currency], cabinsReturned[info.cabinType].bestPrice, false, true);
                cabinsReturned[info.cabinType].cabinDescription = info.cabinDescription;
                cabinsReturned[info.cabinType].cabinAvailable = true;
                if(!angular.isDefined(cabinsReturned[info.cabinType].isCabinCompatible) && !cabinsReturned[info.cabinType].isCabinCompatible) {
                    cabinsReturned[info.cabinType].isCabinCompatible = info.isCompatibleFare;
                }
                cabinsReturned[info.cabinType].fareFamilies = cabinsReturned[info.cabinType].fareFamilies || [];
                cabinsReturned[info.cabinType].fareFamilies.push(getFareFamilyInfo(info));
            });
            return cabinsReturned;

            function getFareFamilyInfo (info) {
                const fareFamilyInfo = angular.copy(info);
                let conditionsCont = 0;
                if (fareFamilyInfo.conditions && fareFamilyInfo.conditionsPriority) {
                    angular.forEach(fareFamilyInfo.conditions, (condition) => {
                        condition.key = fareFamilyInfo.conditionsPriority.indexOf(condition.code) !== -1 ? fareFamilyInfo.conditionsPriority.indexOf(condition.code) : fareFamilyInfo.conditionsPriority.length + conditionsCont;
                        condition.previewStatus = fareFamilyInfo.conditionsPriority.indexOf(condition.code) !== -1; 7;
                        conditionsCont++;
                    });
                }
                fareFamilyInfo.conditions.sort((a, b) => {
                    return a.key - b.key;
                });
                return fareFamilyInfo;
            }
        }
        /**
         * Creates the get fare service request based on current availability model state
         * @param {Object} availabilityModel -The current availability model state
         * @returns {Object} - returns the request to send to get fare rezst service
         */
        function createGetFareRequest (availabilityModel) {
            let  requestFare = {}, flightOfTheHouse = true, i = 0, selectedOffer = {}, originDestination = {};
            const isRedemption = localStorageService.get('searchFlightType') === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
            const offerItemIds = [];
            const originDestinations = [];
            const selectedPartnerDiscount = IbCheckPartnersDiscountsService.getSelectedPartner();
            if (availabilityModel.availabilityData.metaSearchInfo) {
                for (i = 0; i < availabilityModel.selectedSlices.length; i++) {
                    originDestination = {
                        originDestinationId: availabilityModel.selectedSlices[i].originDestinationId,
                        selectedSliceId: availabilityModel.selectedSlices[i].info.sliceId.toString()
                    };
                    originDestinations.push(originDestination);
                }
                requestFare = {
                    responseId: availabilityModel.availabilityData.responseId,
                    offerItemIds: localStorageService.get('orderItemsId'),
                    originDestinations: originDestinations,
                    offerId: availabilityModel.availabilityData.recommendedOfferId,
                    specialNeedQualifierCods: [BookingAvailabilityConstants.SPECIAL_NEEDS_REQUEST]
                };
            } else if (localStorageService.get('multiCitySearch')) {
                requestFare = {
                    responseId: availabilityModel.availabilityData.responseIdArray[availabilityModel.availabilityData.responseIdArray?.length - 1],
                    offerId: availabilityModel.selectedSlices[availabilityModel.selectedSlices.length - 1].info.selectedFareFamily.offers[0].offerId,
                    specialNeedQualifierCods: [BookingAvailabilityConstants.SPECIAL_NEEDS_REQUEST]
                };
            } else {
                for (i = 0; i < availabilityModel.selectedSlices.length; i++) {
                    if (!availabilityModel.selectedSlices[i].info.flightOfTheHouse) {
                        flightOfTheHouse = false;
                        const eligibleVoucher = { EligibleVoucher: 'NO' };
                        DatalayerUtilsService.addDigitalDataInfo(eligibleVoucher);
                    }
                    originDestination = {
                        originDestinationId: availabilityModel.selectedSlices[i].originDestinationId,
                        selectedSliceId: availabilityModel.selectedSlices[i].info.sliceId
                    };
                    if (localStorageService.get('isRedemptionShuttleFlow')) {
                        originDestination.isRedemptionShuttle = true;
                    }
                    localStorageService.set('flightOfTheHouse', flightOfTheHouse);
                    if (isRedemption) {
                        angular.extend(originDestination, getSelectedRedemptionOffer(availabilityModel.selectedSlices[i]));
                    }
                    originDestinations.push(originDestination);
                }
                requestFare = {
                    responseId: availabilityModel.availabilityData.responseId,
                    originDestinations: originDestinations,
                    specialNeedQualifierCods: [BookingAvailabilityConstants.SPECIAL_NEEDS_REQUEST]
                };
                localStorageService.set('flightOfTheHouse', flightOfTheHouse);
                if (!isRedemption) {
                    const availabilityType = localStorageService.get('availabilityType');
                    const avSelectedOffer = localStorageService.get(BkiStorageConstants.SELECTED_OFFER);
                    if ( !avSelectedOffer && !availabilityType === 'SLICE_BY_SLICE' ) {
                        selectedOffer = getSelectedOffer(availabilityModel.selectedSlices);
                    } else {
                        selectedOffer = avSelectedOffer;
                    }
                    for (i = 0; i < selectedOffer?.offerItems?.length; i++) {
                        offerItemIds.push(selectedOffer.offerItems[i].offerItemId);
                    }
                    localStorageService.set('orderItemsId', offerItemIds);
                    angular.extend(requestFare, { offerItemIds: offerItemIds });
                }
            }
            if(selectedPartnerDiscount !== null) {
                requestFare.partnerDiscount = selectedPartnerDiscount?.partnerIdentifier;
            }
            return requestFare;
        }

        /**
         * Transforms the url params received from the web search Fligths to create the request for OBPoints rest service.
         * @returns {Object} - returns the object to call the OBPoints rest service
         */
        function createOBPointsRequest (selectedSlices) {
            return BookingUtilService.generateOBPointsRequestData(selectedSlices);
        }

        /**
         * Returns the selected offer for the current model state
         * @param {Array<Object>} selectedSlices the selected slices by the user
         */
        function getSelectedOffer (selectedSlices) {
            let offerSelected = {}, possibleOffers = [], sIndex, pIndex, oIndex, oFound;
            if (selectedSlices && selectedSlices.length > 0) {
                if (selectedSlices[0].info.selectedFareFamily !== null) {
                    possibleOffers = angular.copy(selectedSlices[0].info.selectedFareFamily.offers) || [];
                    for (sIndex = 1; sIndex < selectedSlices.length; sIndex++) {
                        for (pIndex = 0; pIndex < possibleOffers.length; pIndex++) {
                            oIndex = 0; oFound = false;
                            while (!oFound && oIndex < selectedSlices[sIndex].info.selectedFareFamily.offers.length) {
                                oFound = selectedSlices[sIndex].info.selectedFareFamily.offers[oIndex].offerId === possibleOffers[pIndex].offerId;
                                oIndex++;
                            }
                            if (!oFound) {
                                possibleOffers.splice(pIndex, 1);
                                pIndex--;
                            }
                        }
                    }
                    offerSelected = possibleOffers[0];
                    localStorageService.set(BkiStorageConstants.SELECTED_OFFER, offerSelected);
                }else {
                    offerSelected = '';
                }
            }
            return offerSelected;
        }

        function getSelectedRedemptionOffer (selectedSlices) {
            const offers = { selectedOffers: [] };
            if (selectedSlices.info.stopsNumber) {
                for (let j = 0; j < selectedSlices.info.segments.length; j++) {
                    offers.selectedOffers.push({
                        segmentId: selectedSlices.info.segments[j].segmentId,
                        offerId: selectedSlices.info.segments[j].selectedFareFamily.offers[0].offerId
                    });
                }
            } else {
                offers.selectedOffers.push({
                    segmentId: selectedSlices.info.segments[0].segmentId,
                    offerId: selectedSlices.info.selectedFareFamily.offers[0].offerId
                });
            }
            return offers;
        }

        /**
         * generates the calendar rest service request for a specific origin destination
         * @param {String} selectedDate String with the selectedDate to make the request
         * @param {Integer} originDestinationIndex the origin destination index to be requested
         * @return {Object} the calendar request for rest service
         */
        function generateCalendarRequest (selectedDate, originDestinationIndex) {
            const transformedGenerateRequestData = BookingUtilService.generateCalendarRequestData(BookingAvailabilityConstants.DAYS_BEFORE, BookingAvailabilityConstants.DAYS_AFTER);
            if (selectedDate !== null) {
                transformedGenerateRequestData.slices[originDestinationIndex].date = selectedDate;
            }
            return transformedGenerateRequestData;
        }

        /**
         * generates the calendar initial rest service request for all origin destinations
         */
        function generateInitialCalendarRequest () {
            return BookingUtilService.generateCalendarRequestData(BookingAvailabilityConstants.DAYS_BEFORE, BookingAvailabilityConstants.DAYS_AFTER);
        }

        /**
         * returns the nextDate to make calendar request
         * @param {Object} slickModel the current slick component model
         * @param {Boolean} nextSelected - true if the user is going to futures dates of current selected date
         * @returns {Object} the next date string to make calendar request and the initial index to  be updated
         */
        function getNextDate (slickModel, nextSelected) {
            let i = slickModel.currentInitialSlide, found = false, nextDate = null;
            const currentDate = new Date();
            while (!found && i >= 0 && i < slickModel.slides.length) {
                if (slickModel.slides[i].state === BookingAvailabilityConstants.SLICK_STATUS.LOADING) {
                    nextDate = new Date(slickModel.slides[i].serviceDate);
                    found = true;
                }
                if (!found) i += nextSelected ? 1 : -1;
            }
            if (nextDate) {
                if (nextSelected === null) {
                    nextDate = currentDate;
                } else {
                    const daysBefore = (nextDate.getTime() - (BookingAvailabilityConstants.DAYS_BEFORE * 24 * 60 * 60 * 1000)) >= slickModel.minDate.getTime() ? BookingAvailabilityConstants.DAYS_BEFORE * 24 * 60 * 60 * 1000 : (nextDate.getTime() - slickModel.minDate.getTime());
                    const daysAfter = (nextDate.getTime() + (BookingAvailabilityConstants.DAYS_AFTER * 24 * 60 * 60 * 1000)) <= slickModel.maxDate.getTime() ? BookingAvailabilityConstants.DAYS_BEFORE * 24 * 60 * 60 * 1000 : (nextDate.getTime() - slickModel.maxDate.getTime());
                    nextDate.setTime(nextDate.getTime() + (nextSelected ? daysAfter : -daysBefore));
                    if (nextDate.getTime() < currentDate.getTime()) {
                        nextDate = currentDate;
                    }
                }
                nextDate = {
                    date: $filter('date')(nextDate, 'yyyy-MM-dd'),
                    startIndex: i
                };
            }
            return nextDate;
        }

        /**
         * Updates the current slick state changing the service slides state
         * @param {Object} slickModel the current slick component model
         * @param {Object} calendarData - the service calendar info
         * @param {Boolean} nextSelected - true if the user is going to futures dates of current selected date
         * @param {Integer} startIndex - the initial index to be updated
         */
        function transformSlidesData (slickModel, calendarData, nextSelected, startIndex) {
            let slides = slidesInfo(calendarData || initializeSlidesNotAvailable(slickModel.slides[startIndex].serviceDate)),
                initialIndex, i;
            if (nextSelected) {
                initialIndex = startIndex;
                if (slickModel.slides.length - initialIndex < slides.length) {
                    slides = slides.slice(0, slickModel.slides.length - initialIndex);
                }
            } else {
                initialIndex = startIndex - (nextSelected === null ? BookingAvailabilityConstants.DAYS_BEFORE : (slides.length - 1));
                if (initialIndex < 0) {
                    slides = slides.slice(Math.abs(initialIndex), slides.length);
                    initialIndex = 0;
                }
            }

            for (i = 0; i < slides.length; i++) {
                slickModel.slides[initialIndex + i].price = slides[i].price;
                slickModel.slides[initialIndex + i].formattedPrice = $rootScope.isRedemptionFlow ? CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, slides[i].price) : CurrencyService.formatPrice(slickModel.currency, slides[i].price, false, true);
                if (slickModel.slides[initialIndex + i].state !== BookingAvailabilityConstants.SLICK_STATUS.DISABLED
                    && slickModel.slides[initialIndex + i].state !== BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_WARN
                    && slickModel.slides[initialIndex + i].state !== BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_WARN
                    && slickModel.slides[initialIndex + i].state !== BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_DISABLED
                    && slickModel.slides[initialIndex + i].state !== BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_DISABLED
                ) {
                    slickModel.slides[initialIndex + i].state = slides[i].state;
                }
            }

            return slickModel;

            function initializeSlidesNotAvailable (serviceDate) {
                let slideIndex;
                const cells = [];
                const indexLength = BookingAvailabilityConstants.DAYS_BEFORE + BookingAvailabilityConstants.DAYS_AFTER + 1;
                const currentDate = new Date(serviceDate);
                currentDate.setTime(currentDate.getTime() - (BookingAvailabilityConstants.DAYS_BEFORE * BookingAvailabilityConstants.ONE_DAY_MILISECONDS));
                for (slideIndex = 0; slideIndex < indexLength; slideIndex++) {
                    cells.push({
                        boundDate: $filter('date')(currentDate, 'yyyy-MM-dd'),
                        available: false
                    });
                    currentDate.setTime(currentDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                }
                return cells;
            }
        }


        /**
         * transforms the service cells in an object well formed or the slick component
         */
        function slidesInfo (cells) {
            const slidesInfo = [], isRedemption = localStorageService.get('searchFlightType') === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
            for (let i = 0; i < cells.length; i++) {
                let price = 0;
                if (isRedemption) {
                    price = cells[i].avios;
                }else{
                    if(cells[i].adultPrice) {
                        price = cells[i].adultPrice.total;
                    }
                }
                let state = '';
                if(isRedemption) {
                    state = BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE;
                }else {
                    if(cells[i].available ) {
                        state = BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE;
                    }else{
                        state = BookingAvailabilityConstants.SLICK_STATUS.NOT_AVAILABLE;
                    }
                }
                slidesInfo.push({
                    date: $filter('DateFormatFilter')(isRedemption ? cells[i].date : cells[i].boundDate),
                    serviceDate: isRedemption ? cells[i].date : cells[i].boundDate,
                    price: price,
                    state: state
                });
            }
            return slidesInfo;
        }

        /**
         * Generates the limits slick carousel dates min and max
         * @param {Integer} originDestinationIndex - the origin destination index to be parsed
         */
        function getOriginDestinationLimitDates (originDestinationIndex) {
            const currentDate = new Date();
            const limitDates = { minDate: new Date($filter('date')(currentDate, 'yyyy-MM-dd')), maxDate: new Date($filter('date')(currentDate, 'yyyy-MM-dd')) };
            const commercialInfo = localStorageService.get('commercialData');
            const availabilityRequestData = localStorageService.get('availabilityRequestData');
            // min Date is previous date or current date plus service min search time hours
            limitDates.minDate = (availabilityRequestData.slices[originDestinationIndex - 1] && new Date(availabilityRequestData.slices[originDestinationIndex - 1].date))
                || new Date(limitDates.minDate.getTime() + (commercialInfo.minSearchTime * 60 * 60 * 1000)); //adds minSearchTime hours to min date
            // max Date is next date or current date plus service max search time days
            limitDates.maxDate = (availabilityRequestData.slices[originDestinationIndex + 1] && new Date(availabilityRequestData.slices[originDestinationIndex + 1].date))
                || new Date(limitDates.maxDate.getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000)); //adds maxSearchTime days to max date

            return limitDates;
        }

        /**
         * Finds and slice which matchs with the departure an arrival date and returns it and its index
         * @param {String} departureDate the departure date to find
         * @param {String} arrivalDate the arrival date to find
         * @param {Array<Object>} slices the slices to search a match
         */
        function generateSelectedSliceInfo (departureDate, arrivalDate, slices) {
            const currentSlices = slices || [];
            let sliceFound = null;
            let i = 0, found = false;
            while (!found && i < currentSlices.length) {
                if (getDateTime(departureDate) === getDateTime(currentSlices[i].departureDateTime) && getDateTime(arrivalDate) === getDateTime(currentSlices[i].arrivalDateTime)) {
                    found = true;
                    sliceFound = {
                        slice: slices[i],
                        sliceIndex: i
                    };
                }
                i++;
            }
            return sliceFound;

            function getDateTime (date) {
                return new Date(date.replace(new RegExp('-', 'g'), '/')).getTime();
            }

        }

        /**
         * Check if the current calendar info data of origin destinations needs to be updated because of limits modification
         * @param {Object} model the current availability model state
         * @param {Object} eventInfo the event information when change availability is requested
         * @return the model updated with the new calendar info
         */
        function updateLimitsCalendarData (model, eventInfo) {
            const nextOrigin = model.availabilityData.originDestinations[model.currentOriginDestinationIndex + 1];
            const prevOrigin = model.availabilityData.originDestinations[model.currentOriginDestinationIndex - 1];
            if (nextOrigin && nextOrigin.calendarSlides && nextOrigin.calendarSlides.slides && nextOrigin.calendarSlides.slides.length > 0) {
                changeBottomLimit(nextOrigin.calendarSlides, eventInfo.serviceDate);
                model.availabilityData.originDestinations[model.currentOriginDestinationIndex + 1] = nextOrigin;
            }
            if (prevOrigin && prevOrigin.calendarSlides && prevOrigin.calendarSlides.slides && prevOrigin.calendarSlides.slides.length > 0) {
                changeUpperLimit(prevOrigin.calendarSlides, eventInfo.serviceDate);
                model.availabilityData.originDestinations[model.currentOriginDestinationIndex - 1] = prevOrigin;
            }
            return model;

            function changeBottomLimit (calendarSlides, newLimitDate) {
                let index, slidePosition, offsetPosition = 0;
                const minDate = new Date(newLimitDate);
                const removedSlides = calendarSlides.slides.splice(0, calendarSlides.selectedSlide);
                for (index = 0; index < BookingAvailabilityConstants.DAYS_AFTER; index++) {
                    removedSlides.shift();
                }
                const currentDate = new Date(calendarSlides.slides[0].serviceDate);
                currentDate.setTime(currentDate.getTime() - BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                index = removedSlides.length - 1;
                while (currentDate.getTime() >= minDate.getTime() && index >= 0) {
                    calendarSlides.slides.unshift(removedSlides[index]);
                    currentDate.setTime(currentDate.getTime() - BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                    index--;
                }
                slidePosition = calendarSlides.slides[0].slidePosition;
                while (currentDate.getTime() >= minDate.getTime()) {
                    slidePosition--;
                    calendarSlides.slides.unshift(generateSlidesInfo(currentDate, BookingAvailabilityConstants.SLICK_STATUS.LOADING, slidePosition));
                    currentDate.setTime(currentDate.getTime() - BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                }
                for (index = 0; index < BookingAvailabilityConstants.DAYS_AFTER; index++) {
                    slidePosition--;
                    calendarSlides.slides.unshift(generateSlidesInfo(currentDate, BookingAvailabilityConstants.SLICK_STATUS.DISABLED, slidePosition));
                    currentDate.setTime(currentDate.getTime() - BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                }
                offsetPosition = calendarSlides.slides[0].slidePosition;
                for (index = 0; index < calendarSlides.slides.length; index++) {
                    calendarSlides.slides[index].slidePosition -= offsetPosition;
                }
                calendarSlides.selectedSlide -= offsetPosition;
                calendarSlides.currentInitialSlide = calendarSlides.selectedSlide;
                calendarSlides.slides[0].firstItem = true;
            }

            function changeUpperLimit (calendarSlides, newLimitDate) {
                let index, slidesLength = calendarSlides.slides.length;
                const removedSlides = calendarSlides.slides.splice(calendarSlides.selectedSlide + 1, slidesLength);
                for (index = 0; index < BookingAvailabilityConstants.DAYS_AFTER; index++) {
                    removedSlides.pop();
                }
                slidesLength = calendarSlides.slides.length;
                const maxDate = new Date(newLimitDate);
                const currentDate = new Date(calendarSlides.slides[slidesLength - 1].serviceDate);
                currentDate.setTime(currentDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                index = 0;
                while (currentDate.getTime() <= maxDate.getTime() && index < removedSlides.length) {
                    calendarSlides.slides.push(removedSlides[index]);
                    currentDate.setTime(currentDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                    index++;
                    slidesLength++;
                }
                while (currentDate.getTime() <= maxDate.getTime()) {
                    calendarSlides.slides.push(generateSlidesInfo(currentDate, BookingAvailabilityConstants.SLICK_STATUS.LOADING, slidesLength));
                    currentDate.setTime(currentDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                    slidesLength++;
                }
                for (index = 0; index < BookingAvailabilityConstants.DAYS_AFTER; index++) {
                    calendarSlides.slides.push(generateSlidesInfo(currentDate, BookingAvailabilityConstants.SLICK_STATUS.DISABLED, slidesLength));
                    currentDate.setTime(currentDate.getTime() + BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
                    slidesLength++;
                }
                calendarSlides.currentInitialSlide = calendarSlides.selectedSlide;
                calendarSlides.slides[slidesLength - 1].lastItem = true;
            }
        }

        /**
         * Creates an slide object for the slick carousel
         * @param {Date} dateObject the slide date object
         * @param {String} status the status for the new slide
         * @return {Object} the slide object with the necessary information for slick carousel
         */
        function generateSlidesInfo (dateObject, status, slidePosition) {
            const dateString = $filter('date')(dateObject, 'yyyy-MM-dd');
            return {
                date: $filter('DateFormatFilter')(dateString),
                serviceDate: dateString,
                price: 0,
                state: status,
                slidePosition: slidePosition
            };
        }

        /**
         * Checks if an slice from origin destination is compatible with a fare families offers
         * @param {Array<Object>} fareFamilyOffers the fare families offers where to look
         * @param {Array<Object>} selectedOffers the selected offers to be compare
         * @return {Boolean} true if there is a fare offer with the shame id in selectedOffers
         */
        function isFareCompatible (fareFamilyOffers, selectedOffers) {
            let isCompatible = false, fIndex, oIndex = 0;
            selectedOffers = selectedOffers || [];
            while (!isCompatible && oIndex < selectedOffers.length) {
                fIndex = 0;
                while (!isCompatible && fIndex < fareFamilyOffers.length) {
                    isCompatible = selectedOffers[oIndex].offerId === fareFamilyOffers[fIndex].offerId;
                    fIndex++;
                }
                oIndex++;
            }
            return isCompatible;
        }

        function upgradeFarePrice (odId, fareFamily, selectedOffers) {
            let offerFound = false, odFound = false, fIndex, oIndex = 0, odIndex = 0;
            selectedOffers = selectedOffers || [];
            while (!offerFound && oIndex < selectedOffers.length) {
                fIndex = 0;
                while (!offerFound && fIndex < fareFamily.offers.length) {
                    if (selectedOffers[oIndex].offerId === fareFamily.offers[fIndex].offerId) {
                        offerFound = true, odFound = false, odIndex = 0;
                        while (!odFound && odIndex < fareFamily.offers[fIndex].originDestinations.length) {
                            if (fareFamily.offers[fIndex].originDestinations[odIndex].originDestinationId === odId) {
                                odFound = true;
                                fareFamily.farePrice = fareFamily.offers[fIndex].originDestinations[odIndex].adultPrice.total;
                            }
                            odIndex++;
                        }
                    }
                    fIndex++;
                }
                oIndex++;
            }
        }

        function getDetailedFaresInfo (faresInfo) {
            let transformedInfo = { faresInfo: faresInfo, conditions: {} }, faresInfoIndex, conditionsIndex, relatedContent = null;
            relatedContent = getInfoContentFareCondition(localStorageService.get('availabilityRelatedContent'));
            for (faresInfoIndex = 0; faresInfoIndex < faresInfo.length; faresInfoIndex++) {
                for (conditionsIndex = 0; conditionsIndex < faresInfo[faresInfoIndex].conditions.length; conditionsIndex++) {
                    transformedInfo.conditions[faresInfo[faresInfoIndex].conditions[conditionsIndex].code] = transformedInfo.conditions[faresInfo[faresInfoIndex].conditions[conditionsIndex].code] || {
                        info: faresInfo[faresInfoIndex].conditions[conditionsIndex],
                        items: {}
                    };
                    transformedInfo.conditions[faresInfo[faresInfoIndex].conditions[conditionsIndex].code].items[faresInfo[faresInfoIndex].commercialCode] = faresInfo[faresInfoIndex].conditions[conditionsIndex];
                }
            }
            if (relatedContent) {
                transformedInfo.relatedContent = relatedContent;
            }
            transformedInfo = addFareFamilyObjectAtCondition();
            return transformedInfo;

            function getInfoContentFareCondition (relatedContent) {
                let i = 0, found = false, fareCondition = null;
                if (relatedContent !== null) {
                    while (i < relatedContent.length && !found) {
                        if (relatedContent[i].key === BookingAvailabilityConstants.RELATED_CONTENT.FARE_CONDITIONS) {
                            found = true;
                            fareCondition = relatedContent[i];
                        }
                        i++;
                    }
                }
                return fareCondition ? $sce.trustAsHtml(fareCondition.value) : null;
            }

            /**
             * This function search in all conditios that all fareFamily have information about condition.
             * This is neccesary because fareFamily often send fareFamily without any condition and not show modal correctly.
             * @param transformedInfo Is the model object with all information to show modal "ib-compare-fares-modal.html"
             * @returns  Return the transformedInfo with modification in any condition.
             */
            function addFareFamilyObjectAtCondition () {
                const conditions = BookingAvailabilityConstants.FAREFAMILY_CONDITIONS, conditionsAdded = [], orderFares = [];
                for (let i = 0; i < conditions.length; i++) {
                    for (let j = 0; j < faresInfo.length; j++) {
                        orderFares.push(faresInfo[j].commercialCode);
                        if (transformedInfo.conditions[conditions[i]] && !transformedInfo.conditions[conditions[i]].items[faresInfo[j].commercialCode]) {
                            transformedInfo.conditions[conditions[i]].items[faresInfo[j].commercialCode] = {
                                code: '-',
                                name: '-',
                                text: '-',
                                units: null,
                                extendedInfo: {}
                            };
                            conditionsAdded.push(conditions[i]);
                        }
                    }
                }

                if (conditionsAdded.length > 0) {
                    for (let i = 0; i < conditionsAdded.length; i++) {
                        transformedInfo.conditions[conditionsAdded[i]].items = orderByFareFamily(transformedInfo.conditions[conditionsAdded[i]].items, orderFares);
                    }
                }

                return transformedInfo;

                function orderByFareFamily (items, orderFares) {
                    const orderItems = {};
                    for (let i = 0; i < orderFares.length; i++) {
                        orderItems[orderFares[i]] = items[orderFares[i]];
                    }
                    return orderItems;
                }

            }

        }

        function getTotalPriceMetaSearch (sliceSelected, tax) {
            let i, totalPrice = tax;
            const currency = localStorageService.get('commercialData').currency;
            for (i = 0; i < sliceSelected.length; i++) {
                totalPrice = totalPrice + sliceSelected[i].info.selectedFareFamily.farePriceToCalculate;
            }
            return CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), totalPrice, true, false);
        }

        function generateSegmentWarningMessage (segmentInfo, previousSegment) {
            const returnedWarnings = {
                terminalChange: { show: false },
                airportChange: { show: false },
                scaleWaitingTime: { show: false },
                nightFlight: { isOverNight: false }
            };
            let wIndex;
            const WARNING_MESSAGES = {
                OVERNIGHT_WARNING: 'SSE_AVM_20003',
                TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
                AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
                LONG_WAITING_WARNING: 'SSE_AVM_20004'
            };
            const IMPORTANT_WARNING_CODES = [WARNING_MESSAGES.AIRPORT_CHANGE_WARNING, WARNING_MESSAGES.TERMINAL_CHANGE_WARNING];
            segmentInfo.warnings = segmentInfo.warnings || [];
            for (wIndex = 0; wIndex < segmentInfo.warnings.length; wIndex++) {
                switch (segmentInfo.warnings[wIndex].code) {
                        case WARNING_MESSAGES.OVERNIGHT_WARNING: returnedWarnings.nightFlight = getOverNightInfo(segmentInfo.warnings[wIndex]); break;
                        case WARNING_MESSAGES.TERMINAL_CHANGE_WARNING:
                            if (previousSegment !== null) returnedWarnings.terminalChange = getTerminalInfo(segmentInfo.warnings[wIndex], previousSegment.arrival.terminal, segmentInfo.departure.terminal);
                            break;
                        case WARNING_MESSAGES.AIRPORT_CHANGE_WARNING:
                            if (previousSegment !== null) returnedWarnings.airportChange = getAirportInfo(segmentInfo.warnings[wIndex], segmentInfo.departure, previousSegment.arrival);
                            break;
                        case WARNING_MESSAGES.LONG_WAITING_WARNING:
                            if (previousSegment !== null) returnedWarnings.scaleWaitingTime = getScaleTimeInfo(segmentInfo.warnings[wIndex], true);
                            break;
                }
            }
            if (!returnedWarnings.scaleWaitingTime.show && previousSegment !== null) {
                returnedWarnings.scaleWaitingTime = getScaleTimeInfo({}, false);
            }
            return returnedWarnings;

            function getDefaultInfo (warning) {
                return {
                    isImportant: IMPORTANT_WARNING_CODES.indexOf(warning.code) !== -1,
                    code: warning.code,
                    message: warning.description,
                    show: true
                };
            }

            function getTerminalInfo (warning, arrival, departure) {
                const info = getDefaultInfo(warning);
                if (arrival !== null && departure !== null) {
                    angular.extend(info, { hasTerminal: true, arrival: arrival, departure: departure });
                }
                return info;
            }

            function getAirportInfo (warning, departure, arrival) {
                const info = getDefaultInfo(warning);
                angular.extend(info, { arrival: arrival.name + ' (' + arrival.code + ')', departure: departure.name + ' (' + departure.code + ')' });
                return info;
            }

            function getScaleTimeInfo (warning, isLong) {
                const info = getDefaultInfo(warning);
                angular.extend(info, { isLong: isLong });
                return info;
            }

            function getOverNightInfo (warning) {
                return { isOverNight: true, code: warning.code, message: warning.description };
            }
        }

        /**
         * Create array/object to call addFlightSearch Monetate API method
         *
         * @param {*} data booking Url parameters data
         * @param {*} passengers data about passengers and total passengers
         * @param {*} availability data of availability results
         * @returns List of needed data to call Monetate method
         */
        function createFlightSearchMonetate (data, passengers, availability) {
            const flightSearch = ['addFlightSearch'];
            const cabinTypes = [];
            const infoObject = {
                depDate: [dateFormatted(data.originDestinations[0].date)],
                destination: [data.originDestinations[0].destination],
                origin: [data.originDestinations[0].origin],
                travelers: [passengers.passengers]
            };

            availability.fareFamilyConditions.forEach((fare) => {
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

            function dateFormatted (date) {
                return date.replace(/-/g, '');
            }

            flightSearch.push(infoObject);
            return flightSearch;
        }

        /**
         * Check if cabin descriptions has returned by availability service.
         *
         * @param {Array} fareFamilies fareFamiliesConditions returned by availability service
         * @returns {Array} return original or transformed fareFamiliesConditions if original data hasn't cabin description
         */
        function checkCabinDescription (fareFamilies) {
            fareFamilies.forEach((fare) => {
                if (!fare.cabinDescription) {
                    fare.conditions.forEach((condition) => {
                        if (condition.code === 'CABINA') {
                            fare.cabinDescription = condition.text;
                        } else {
                            fare.cabinDescription = fare.commercialName;
                        }
                    });
                }
            });
            return fareFamilies;
        }
        function buildCoupons (coupons) {
            const transCoupons = [];
            coupons.forEach((coupon) => {
                if (coupon.couponDetails.length > 1) {
                    coupon.couponDetails.forEach((element) => {
                        element.discount = calcDiscount(coupon.discountedRedemptionOptions[0]);
                        element.offerList = coupon.discountedRedemptionOptions;
                        transCoupons.push(element);
                    });
                } else {
                    coupon.couponDetails[0].discount = calcDiscount(coupon.discountedRedemptionOptions[0]);
                    coupon.couponDetails[0].offerList = coupon.discountedRedemptionOptions;
                    transCoupons.push(coupon.couponDetails[0]);
                }
            });
            return transCoupons;
            function calcDiscount (discountOption) {
                const discount = ((discountOption.basePrice.totalPoints.fare - discountOption.discountedPrice.totalPoints.fare) / (discountOption.basePrice.totalPoints.fare)) * 100;
                return Math.ceil(discount);
            }
        }
        function genCalcAviosFlightReq (fareData) {
            try {
                const defaultDate = new Date().toISOString().split('T')[0];
                const discounts = fareData.offers[0].specialDiscountsApplied.filter(el => BookingAppConstants.AVAILABLE_AVIOS_DISCOUNTS.includes(el.type));
                return {
                    currency: { code: fareData.offers[0].price.currency},
                    passengers: fareData.passengers.map(passenger => ({
                        id: passenger.passengerId,
                        memberIdentifier: null,
                        flight: {
                            slices: fareData.offers[0].slices.map(slice => ({
                                id: slice.sliceId,
                                fare: slice.detailedPrices.find(el => el.passengerIds.includes(passenger.passengerId))?.fare || 0,
                                totalFare: slice.priceSpecialDiscount?.total || slice.price?.fare || 0
                            }))
                        }
                    })),
                    flight: {
                        discounts: discounts.map(discount => ({
                            type: discount.type,
                            percentDiscount: discount.percentDiscount,
                            totalDiscount: discount.totalDiscount
                        })) || [],
                        yq: fareData.offers[0].offerItems[0].detailedTaxes?.filter(tax => tax.code === 'YQ')[0]?.amount ?? 0,
                        slices: fareData.offers[0].slices.map((slice, index) => ({
                            id: slice.sliceId,
                            segments: slice.segments.map(seg  =>  ({
                                id: seg.id,
                                commercialCode: BookingAppConstants.AVAILABLE_COMMERCIAL_CODES.includes(seg.cabin?.fareFamily) ? seg.cabin?.fareFamily : null,
                                operatingCarrier: {
                                    code: seg.flight.operationalCarrier.code
                                },
                                marketingCarrier: {
                                    code: seg.flight.marketingCarrier.code
                                },
                                schedule: {
                                    departureAirportCode: seg.departure.code ? seg.departure.code : seg.departure.airport.code,
                                    arrivalAirportCode: seg.arrival.code ? seg.arrival.code : seg.arrival.airport.code,
                                    departureDate: seg?.departureDateTime?.split(' ')[0] || defaultDate
                                },
                                bookingClass: {
                                    code: seg.cabin.rbd
                                },
                                bookingCabin: {
                                    code: seg.cabin.bookingCode || seg.cabin.rbd
                                },
                                fareProduct:
                                    fareData.fareFamilyConditions[index]?.commercialNameES || fareData.fareFamilyConditions[0]?.commercialNameES,
                            }))
                        }))
                    }
                };
            } catch (error) {
                return null;
            }
        }

        function updateFlightAviosInfoWithFF (order, flightAviosInfo) {
            return flightAviosInfo?.passengers?.map((p)=>{
                return {
                    ...p,
                    memberIdentifier: order.passengers.find(el => el.passengerId === p.id)?.frequentFlyerInfo?.number || null
                };
            });
        }

        function TransCalcPointsData (data) {
            const trans_points = { Avios: 0, Elite: 0 };
            data?.totalMonetaryAmount?.forEach(item => {
                if (item.currency.code === 'AVIOS') {
                    trans_points.Avios = item.amount;
                } if (item.currency.code === 'TIER_POINTS') {
                    trans_points.Elite = item.amount;
                }
            });
            return trans_points;
        }

        function moreThan2Hours (duration) {
            let isMoreThan2h = false;
            let hours = 0, minutes = 0;

            if (duration > 0) {
                hours = Math.floor(duration / 60);
                minutes = duration % 60;
                isMoreThan2h = (hours === 2 && minutes >= 0) || (hours > 2 && minutes >= 0);
            }
            return isMoreThan2h;
        }
    }
})();
