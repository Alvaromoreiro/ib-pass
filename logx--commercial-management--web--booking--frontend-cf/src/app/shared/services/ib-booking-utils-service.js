import dayjs from 'dayjs';
import { BkiStorageConstants, BKI_STORAGE_KEYS_TO_REMOVE } from '@src/app/core/constants/ib-booking-storage-constants';
import { BookingAvailabilityConstants } from '@src/app/core/constants/ib-booking-availability-constants';
(function () {


    angular
        .module('ib-booking-services-module')
        .service('BookingUtilService', BookingUtilService);

    BookingUtilService.$inject = ['$rootScope', '$filter', '$window', 'CommonsSessionStorageService', 'BookingAppConstants', 'CurrencyService', 'BookingModalService', '$sce', '$location', 'BookingRedirectionService', 'BookingChangeOnHoldOrderService', 'NewMainHeaderFacade', 'DataLayerService', 'IbCheckPartnersDiscountsService', 'DigitalDataService', 'DatalayerUniqueKeysService', 'DigitalDataViewCounterService', 'UrlUtilsService','DigitalDataUtilsService'];
    function BookingUtilService ($rootScope, $filter, $window, CommonsSessionStorageService, BookingAppConstants, CurrencyService, BookingModalService, $sce, $location, BookingRedirectionService, BookingChangeOnHoldOrderService, NewMainHeaderFacade, DataLayerService, IbCheckPartnersDiscountsService, DigitalDataService, DatalayerUniqueKeysService, DigitalDataViewCounterService, UrlUtilsService, DigitalDataUtilsService) {
        return {
            getOriginDestination: getOriginDestination,
            generateAvailabilityRequestData: generateAvailabilityRequestData,
            generateCalendarRequestData: generateCalendarRequestData,
            generateOBPointsRequestData: generateOBPointsRequestData,
            initStorage: initStorage,
            getURLFirstParameterByName: getURLFirstParameterByName,
            removeParam: removeParam,
            getCompanyURL: getCompanyURL,
            getBackGroundURL: getBackGroundURL,
            getPassengersId: getPassengersId,
            getCommercialsellingDataByMarket: getCommercialsellingDataByMarket,
            getTripsBreakdownInfo: getTripsBreakdownInfo,
            getPassengersBreakdownInfo: getPassengersBreakdownInfo,
            saveEndpoints: saveEndpoints,
            getEndpoint: getEndpoint,
            getMetaTagValueByName: getMetaTagValueByName,
            generateBuildNumberQueryString: generateBuildNumberQueryString,
            getNumberTypePas: getNumberTypePas,
            checkCreditCardExpiryDate: checkCreditCardExpiryDate,
            getCreditCardIcon: getCreditCardIcon,
            getTypeOfPassenger: getTypeOfPassenger,
            isUserLogged: isUserLogged,
            getRelatedContent: getRelatedContent,
            getFormatedDate: getFormatedDate,
            getSliceDetailsById: getSliceDetailsById,
            getStatusResident: getStatusResident,
            fillZipCodeByState: fillZipCodeByState,
            fillMemberIdentifierWithZeros: fillMemberIdentifierWithZeros,
            getNewAvailabilityRequest: getNewAvailabilityRequest,
            backToMain: backToMain,
            trunkateMaxLength: trunkateMaxLength,
            onholdLightBoxAccept: onholdLightBoxAccept,
            setSegmentOfSelectedTrip: setSegmentOfSelectedTrip,
            redirectToFlash: redirectToFlash,
            checkUserMustFlyFromFare: checkUserMustFlyFromFare,
            addPriceParametersInDigitalInfo: addPriceParametersInDigitalInfo,
            addflightHaulInDigitalInfo: addflightHaulInDigitalInfo,
            setSelectedTripInfoinStorage: setSelectedTripInfoinStorage,
            checkExistNewAvailabilitySearch: checkExistNewAvailabilitySearch
        };

        /**
         * Return object with data of  origin and destination flights
         * @param {Object} originDestinations
         */
        function getOriginDestination (originDestinations, passengers) {
            let typeFligth = CommonsSessionStorageService.get('searchFlightType');
            const slices = getSlices(BookingAppConstants.BOOKING_PARAMS_NAMES.SLICE);
            const cities = CommonsSessionStorageService.get('destinationCitiesList');
            const metasearchError = CommonsSessionStorageService.get('metasearchOrderError');
            typeFligth = metasearchError ? BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH : typeFligth;

            const { originCity, destinationCity, urlOriginCode, urlDestCityCode } = resolveCities(originDestinations, cities, slices, typeFligth);
            const passengerData = resolvePassengerCounts(passengers);
            const dates = resolveDates(originDestinations, slices, typeFligth);

            validateCities(urlOriginCode, urlDestCityCode, originCity, destinationCity);

            return {
                originCity,
                destinationCity,
                dates,
                passengers: passengerData.numberPassengers,
                numAdults: passengerData.adult,
                numSeniors: passengerData.senior,
                numYoung: passengerData.young,
                numTeenager: passengerData.teenager,
                numInfant: passengerData.infant,
                numChilds: passengerData.child,
                numberPassengrsWithoutInfant: passengerData.numberPassengrsWithoutInfant
            };
        }

        function resolveCities (originDestinations, cities, slices, typeFligth) {
            const urlOriginCode = originDestinations[0]?.origin || null;
            const urlDestCityCode = getDestinationCityCode(originDestinations, slices, typeFligth);

            let originCity = null, destinationCity = null;
            if (cities && urlDestCityCode) {
                originCity = findCityByCode(cities, urlOriginCode);
                destinationCity = findCityByCode(cities, urlDestCityCode);
            }
            originCity = originCity || getCitybyAirport(urlOriginCode);
            destinationCity = destinationCity || getCitybyAirport(urlDestCityCode);

            return { originCity, destinationCity, urlOriginCode, urlDestCityCode };
        }

        function findCityByCode (cities, code) {
            for (let i = 0; i < cities.length; i++) {
                if (code === cities[i].code) {
                    return cities[i];
                }
            }
            return null;
        }

        function getDestinationCityCode (originDestinations, slices, typeFligth) {
            const mustBeMetasearch = originDestinations.length >= 2 && typeFligth === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH;
            if (mustBeMetasearch) {
                return originDestinations[parseInt(slices[0].length - 1)]?.destination || null;
            }
            return originDestinations[0]?.destination || null;
        }

        function resolvePassengerCounts (passengers) {
            const passengerCounts = initializePassengerCounts();

            if (passengers) {
                passengers.forEach(passenger => updatePassengerCount(passengerCounts, passenger));
            } else {
                populateCountsFromUrlParams(passengerCounts);
            }


            const numberPassengers = calculateTotalPassengers(passengerCounts);
            const numberPassengrsWithoutInfant = calculatePassengersWithoutInfants(passengerCounts);

            return { ...passengerCounts, numberPassengers, numberPassengrsWithoutInfant };
        }

        function initializePassengerCounts () {
            return {
                senior: 0,
                adult: 0,
                young: 0,
                teenager: 0,
                child: 0,
                infant: 0
            };
        }

        function updatePassengerCount (counts, passenger) {
            switch (passenger.passengerType) {
                    case BookingAppConstants.passengerTypes.senior:
                        counts.senior = passenger.count;
                        break;
                    case BookingAppConstants.passengerTypes.adult:
                        counts.adult = passenger.count;
                        break;
                    case BookingAppConstants.passengerTypes.young:
                        counts.young = passenger.count;
                        break;
                    case BookingAppConstants.passengerTypes.teenager:
                        counts.teenager = passenger.count;
                        break;
                    case BookingAppConstants.passengerTypes.child:
                        counts.child = passenger.count;
                        break;
                    case BookingAppConstants.passengerTypes.infant:
                        counts.infant = passenger.count;
                        break;
            }
        }

        function populateCountsFromUrlParams (counts) {
            counts.senior = parseInt(getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.SENIOR) || 0);
            counts.adult = parseInt(getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT) || 0);
            counts.young = parseInt(getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.YOUNG) || 0);
            counts.teenager = parseInt(getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.TEENAGER) || 0);
            counts.child = parseInt(getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.CHILD) || 0);
            counts.infant = parseInt(getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.INFANT) || 0);
        }

        function calculateTotalPassengers (counts) {
            return $rootScope.isRedemptionFlow && $rootScope.isPointsOBFlow
                ? counts.adult + counts.child
                : Object.values(counts).reduce((sum, count) => sum + count, 0);
        }

        function calculatePassengersWithoutInfants (counts) {
            return counts.senior + counts.adult + counts.young + counts.teenager + counts.child;
        }

        function findReturnFlightData (originDestinations, slices, flightType) {
            if (originDestinations.length < 2) {
                return null;
            }

            const isMetasearch = flightType === 'metasearchFlight';
            const isMultiCity = flightType === 'multiCityFlight';

            const isNotOpenJaw = !CommonsSessionStorageService.get('openJaw');
            const hasTwoSlices = slices.length === 2;
            const isMetaSearchReturn = isMetasearch && isNotOpenJaw && hasTwoSlices;
            if (isMetaSearchReturn) {
                const returnIndex = slices[slices.length - 1][0] - 1;
                return originDestinations[returnIndex];
            }

            if (!isMultiCity && !isMetasearch) {
                return originDestinations[1];
            }

            return null;
        }

        function resolveDates (originDestinations, slices, typeFligth) {
            const dates = {
                outboundFlight: originDestinations[0]?.date,
                formatedOutboundFlight: formatDate(originDestinations[0]?.date),
                returnFlight: null,
                formatedReturnFlight: null
            };

            const returnFlight = findReturnFlightData(originDestinations, slices, typeFligth);

            if (returnFlight) {
                setReturnFlightDates(dates, returnFlight);
            }

            return dates;
        }

        function setReturnFlightDates (dates, returnFlight) {
            dates.returnFlight = returnFlight?.date;
            dates.formatedReturnFlight = formatDate(returnFlight?.date);
        }

        function formatDate (date) {
            if (!date) return null;
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
        }

        function validateCities (urlOriginCode, urlDestCityCode, originCity, destinationCity) {
            const isMissingDestinationCity = urlDestCityCode && !destinationCity;
            const isMissingOriginCity = urlOriginCode && !originCity;
            if (isMissingDestinationCity || isMissingOriginCity) {
                BookingModalService.finishWaiting();
                CommonsSessionStorageService.set('availabilityErrror', {});
                $location.path('/ibbkerror');
            }
        }

        function getSlices (slice) {
            let i = 1, slices = [], slicesEnd = false, regex = /(\d+)/g;
            while (!slicesEnd) {
                const param = getURLFirstParameterByName(slice + i);
                slicesEnd = param == null;
                if (!slicesEnd) {
                    slices.push(param.match(regex));
                }
                i++;
            }
            return slices;
        }

        function getCitybyAirport (code) {
            const cities = BookingAppConstants.CITY_AIRPORTS_METASEARCH.cities;
            for (const city of cities) {
                for (const airport of city.airports) {
                    if (code === airport.code) {
                        return {
                            code: city.code,
                            country: city.country,
                            description: city.description,
                            timezone: city.timezone
                        };
                    }
                }
            }
            return null;
        }

        /**
         * Generate the avalaibility request data from url params of searching booking home
         * @returns {Object} - returns an object made from params
         */

        function generateAvailabilityRequestData () {
            const bookingUrlParams = CommonsSessionStorageService.get('bookingUrlParams');
            const selectedPartner = IbCheckPartnersDiscountsService.getSelectedPartner();
            const requestAvailability = new Map();

            const isRedemptionFlow = $rootScope.isRedemptionFlow;
            const isPetFlightFilter = this.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT);
            requestAvailability.set('isPetFlight', isPetFlightFilter === 'true');
            const preferredCabin = getPreferredCabin(bookingUrlParams);
            const passengers = getPassengers(bookingUrlParams, isRedemptionFlow);
            const specialDiscounts = getSpecialDiscounts(bookingUrlParams, isRedemptionFlow);
            const slicesMetaSearch = getSlicesMetaSearch(bookingUrlParams);

            setBasicRequestData({requestAvailability, bookingUrlParams, passengers, preferredCabin, isRedemptionFlow});
            setSpecialDiscounts(requestAvailability, specialDiscounts);
            setSlices(requestAvailability, slicesMetaSearch, bookingUrlParams);
            handleReferralData(requestAvailability, bookingUrlParams);
            handleMembershipData(requestAvailability);
            handlePartnerDiscount(requestAvailability, selectedPartner);
            handleMultiCitySearch(bookingUrlParams);
            handleClosedUserGroup(requestAvailability, bookingUrlParams);

            CommonsSessionStorageService.set('availabilityRequestData', Object.fromEntries(requestAvailability));
            return Object.fromEntries(requestAvailability);
        }

        function getPreferredCabin (bookingUrlParams) {
            const preferredCabinParam = bookingUrlParams.preferredCabin;
            return BookingAvailabilityConstants.AVAILABILITY_FARE_CONSTANTS[preferredCabinParam] ?? BookingAvailabilityConstants.AVAILABILITY_FARE_CONSTANTS.DEFAULT;
        }

        function getPassengers (bookingUrlParams, isRedemptionFlow) {
            const passengers = [];
            const passengerTypes = [
                { type: 'SENIOR', key: 'senior', redemptionCheck: true },
                { type: 'ADULT', key: 'adult', redemptionCheck: false },
                { type: 'YOUTH', key: 'young', redemptionCheck: true },
                { type: 'YOUNG_ADULT', key: 'teenager', redemptionCheck: true },
                { type: 'CHILD', key: 'child', redemptionCheck: false },
                { type: 'INFANT', key: 'infant', redemptionCheck: false }
            ];

            passengerTypes.forEach(({ type, key, redemptionCheck }) => {
                const hasValue = bookingUrlParams[key] && parseInt(bookingUrlParams[key]) > 0;
                const passesRedemptionCheck = !redemptionCheck || !isRedemptionFlow;

                if (hasValue && passesRedemptionCheck) {
                    passengers.push({ passengerType: type, count: bookingUrlParams[key] });
                }
            });

            return passengers;
        }

        function getSpecialDiscounts (bookingUrlParams, isRedemptionFlow) {
            const specialDiscounts = [];

            if (isRedemptionFlow) {
                return specialDiscounts;
            }

            if (bookingUrlParams.resident) {
                specialDiscounts.push({
                    type: 'RES',
                    discountType: BookingAppConstants.RESIDENT_CITIES[bookingUrlParams.resident.toUpperCase()] || ''
                });
            }

            if (bookingUrlParams.largeFamilyType) {
                specialDiscounts.push({
                    type: 'LGF',
                    discountType: BookingAppConstants.FAMILIES_TYPES[bookingUrlParams.largeFamilyType.toUpperCase()] || ''
                });
            }

            return specialDiscounts;
        }

        function getSlicesMetaSearch (bookingUrlParams) {
            const slicesMetaSearch = [];

            if (bookingUrlParams.slices) {
                bookingUrlParams.slices.forEach((slice, i) => {
                    const segments = slice.map((segmentIndex) => {
                        const originDestination = bookingUrlParams.originDestinations[parseInt(segmentIndex) - 1];
                        return {
                            date: originDestination.date,
                            origin: originDestination.origin,
                            destination: originDestination.destination,
                            flightNumber: originDestination.carrier + originDestination.flightNumber,
                            bookingCode: originDestination.bookingCode,
                            cabin: originDestination.cabin?.toUpperCase(),
                            fareBasis: originDestination.fareBasis
                        };
                    });

                    slicesMetaSearch.push({
                        date: segments[0].date,
                        origin: segments[0].origin,
                        destination: segments[segments.length - 1].destination,
                        segments
                    });
                });
            }

            return slicesMetaSearch;
        }

        function setBasicRequestData ({requestAvailability, bookingUrlParams, passengers, preferredCabin, isRedemptionFlow}) {
            requestAvailability.set('slices', bookingUrlParams.originDestinations);
            requestAvailability.set('passengers', passengers);
            requestAvailability.set('marketCode', BookingAppConstants.market);

            const requestCabin = preferredCabin && !isRedemptionFlow ? preferredCabin : '';
            requestAvailability.set('preferredCabin', requestCabin);
        }

        function setSpecialDiscounts (requestAvailability, specialDiscounts) {
            if (specialDiscounts.length > 0) {
                requestAvailability.set('specialDiscounts', specialDiscounts);
            }
        }

        function setSlices (requestAvailability, slicesMetaSearch, bookingUrlParams) {
            if (slicesMetaSearch.length > 0) {
                requestAvailability.set('slices', slicesMetaSearch);
            }

            if (CommonsSessionStorageService.get('metasearchOrderError')) {
                const newRequest = getNewAvailabilityRequest(Object.fromEntries(requestAvailability));
                requestAvailability.clear();
                Object.entries(newRequest).forEach(([key, value]) => requestAvailability.set(key, value));
                CommonsSessionStorageService.remove('metasearchOrderError');
            }
        }

        function handleReferralData (requestAvailability, bookingUrlParams) {
            if (bookingUrlParams.referralId) {
                requestAvailability.set('referralId', bookingUrlParams.referralId);
                requestAvailability.set('displayedPrice', {
                    price: bookingUrlParams.displayedPrice || 0,
                    currency: bookingUrlParams.priceCurrency
                });
            }
        }

        function handleMembershipData (requestAvailability) {
            if ($rootScope.isLogged === BookingAppConstants.LOGIN_ONB) {
                requestAvailability.set(BkiStorageConstants.SPECIFIC_FARE, true);
                CommonsSessionStorageService.set(BkiStorageConstants.ONB_DISCOUNT_TYPE, true);
            }
        }

        function handlePartnerDiscount (requestAvailability, selectedPartner) {
            if (selectedPartner) {
                requestAvailability.set('partnerDiscount', selectedPartner.partnerIdentifier);
            }
        }

        function handleMultiCitySearch (bookingUrlParams) {
            if (bookingUrlParams.numTrips || bookingUrlParams.tripType === 'MultiCity') {
                CommonsSessionStorageService.set('multiCitySearch', true);
            }
        }

        function handleClosedUserGroup (requestAvailability, bookingUrlParams) {
            if (bookingUrlParams.ibGroup) {
                requestAvailability.set('closedUserGroup', {
                    name: bookingUrlParams.ibGroup
                });
            }
        }

        /**
         * Generate the avalaibility request data from url params of searching booking home
         * @param {Int} daysBefore - the days before to current day to send the request
         * @param {Int} daysAfter - the days after to current day to send the request
         * @returns {Object} - returns an object made from params
         */
        function generateCalendarRequestData (daysBeforeRibbon, daysAfterRibbon, daysBeforeCalendar, daysAfterCalendar) {
            let i, transformedGenerateRequestData = CommonsSessionStorageService.get('newAvailabilityRequestData') || CommonsSessionStorageService.get('availabilityRequestData') || generateAvailabilityRequestData();
            for (i = 0; i < transformedGenerateRequestData.slices.length; i++) {
                transformedGenerateRequestData.slices[i].daysAfter = (transformedGenerateRequestData.slices.length === 1 || !daysAfterCalendar) ? daysAfterRibbon : daysAfterCalendar;
                transformedGenerateRequestData.slices[i].daysBefore = (transformedGenerateRequestData.slices.length === 1 || !daysBeforeCalendar) ? daysBeforeRibbon : daysBeforeCalendar;
            }
            return transformedGenerateRequestData;
        }

        /**
        * Generate OBPoints request data
        * @returns {Object} Data for the query request
        */
        function generateOBPointsRequestData (selectedSlices) {
            let i, j, c, requestOBPoints = {}, foundRbd, currentRbd, currentCabinClass, bookingSelected = angular.copy(selectedSlices), bookingSelectedOffer = CommonsSessionStorageService.get(BkiStorageConstants.SELECTED_OFFER);
            requestOBPoints = {
                discountUsed: false,
                currency: bookingSelectedOffer.price.currency,
                segments: [],
                passengers: []
            };

            addPassengersToRequestOBPoints(bookingSelectedOffer, requestOBPoints);
            addSegmentsToRequestOBPoints(bookingSelected, bookingSelectedOffer, requestOBPoints);

            return requestOBPoints;
        }

        function addPassengersToRequestOBPoints (bookingSelectedOffer, requestOBPoints) {
            for (let i = 0; i < bookingSelectedOffer.offerItems.length; i++) {
                for (let j = 0; j < bookingSelectedOffer.offerItems[i].passengerIds.length; j++) {
                    requestOBPoints.passengers.push({
                        passengerType: bookingSelectedOffer.offerItems[i].passengerIds[j].replace(/[0-9_]/g, ''),
                        totalFare: bookingSelectedOffer.offerItems[i].price.fare,
                        taxesFeesAndCharges: bookingSelectedOffer.offerItems[i].price.ticketingFee + bookingSelectedOffer.offerItems[i].price.tax,
                        gasFee: '0'
                    });
                }
            }
        }

        function addSegmentsToRequestOBPoints (bookingSelected, bookingSelectedOffer, requestOBPoints) {
            for (let i = 0; i < bookingSelected.length; i++) {
                for (let j = 0; j < bookingSelected[i].info.segments.length; j++) {
                    const { rbd: currentRbd, cabinClass: currentCabinClass } = getCurrentRbdAndCabin(i, j, bookingSelected, bookingSelectedOffer);
                    requestOBPoints.segments.push({
                        origin: bookingSelected[i].info.segments[j].departure.code,
                        destination: bookingSelected[i].info.segments[j].arrival.code,
                        cabinClass: currentCabinClass,
                        rbd: currentRbd,
                        marketingFlightNumber: String('0000' + bookingSelected[i].info.segments[j].flight.marketingFlightNumber).slice(-4),
                        marketingPartnerCode: bookingSelected[i].info.segments[j].flight.marketingCarrier.code,
                        operationalPartnerCode: bookingSelected[i].info.segments[j].flight.operationalCarrier.code,
                        aircraftOwner: bookingSelected[i].info.segments[j].flight.operationalCarrier.code,
                        bookingDate: dayjs().format('YYYY-MM-DD'),
                        departureDate: dayjs(bookingSelected[i].info.segments[j].departureDateTime).format('YYYY-MM-DD'),
                        arrivalDate: dayjs(bookingSelected[i].info.segments[j].arrivalDateTime).format('YYYY-MM-DD')
                    });
                }
            }
        }

        function getCurrentRbdAndCabin (i, j, bookingSelected, bookingSelectedOffer) {
            const bookingSegments = bookingSelected[i].info.segments;
            const offerSegments = bookingSelectedOffer.originDestinations[i].applicableSlices[0].segments;
            if (bookingSegments.length < offerSegments.length) {
                const foundRbd = false;
                let c = 0;
                while (!foundRbd && c < offerSegments.length) {
                    if (bookingSegments[j].segmentId === offerSegments[c].segmentId) {
                        return {
                            rbd: offerSegments[c].rbd,
                            cabinClass: offerSegments[c].bookingClass
                        };
                    }
                    c++;
                }
            }
            return {
                rbd: offerSegments[j].rbd,
                cabinClass: offerSegments[j].bookingClass
            };
        }

        function setAvailabilityDefaultTimeout () {
            CommonsSessionStorageService.set('ancillariesServiceTimeoutValue', BookingAppConstants.ANCILLARIES_WAIT_TIMEOUT);
        }
        function setFlashOfferFlow () {
            CommonsSessionStorageService.set('isSkipAncillaries', BookingAppConstants.SKIP_ANCILLARIES_SERVICE);
        }
        /**
         * Remove all localstorage variables of the app
         */
        function initStorage () {
            //Clear other apps variables
            CommonsSessionStorageService.clearAll(/(?!(ib-booking-app).*)^(ib-[\w\-]+-app\.[\w\-]+)/i, { withPrefix: false });
            if (!CommonsSessionStorageService.get('calditMode')) {
                CommonsSessionStorageService.remove(BkiStorageConstants.AVAILABILITY_REQUEST);
                CommonsSessionStorageService.remove(BkiStorageConstants.NEW_AVAILABILITY_SEARCH);
            }

            BKI_STORAGE_KEYS_TO_REMOVE.forEach(key => CommonsSessionStorageService.remove(key));
            DigitalDataViewCounterService.restartUnderConditions();

            DatalayerUniqueKeysService.clear();
            setAvailabilityDefaultTimeout();
            setFlashOfferFlow();
        }


        /**
         * Checks if a parameter's name corresponds to a passenger type.
         */
        function isPassengerParam (paramName) {
            const passengerParams = [
                ...BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT,
                ...BookingAppConstants.BOOKING_PARAMS_NAMES.CHILD,
                ...BookingAppConstants.BOOKING_PARAMS_NAMES.INFANT,
                ...BookingAppConstants.BOOKING_PARAMS_NAMES.SENIOR,
                ...BookingAppConstants.BOOKING_PARAMS_NAMES.YOUNG,
                ...BookingAppConstants.BOOKING_PARAMS_NAMES.TEENAGER
            ];
            return passengerParams.includes(paramName);
        }

        /**
         * Returns the value of the first param found
         * @param  {Array<String>} paramsName - An array with the possible names of an URL param
         * @returns {String} - The value of the first param found in the array
         */

        function getURLFirstParameterByName (paramsName) {
            return UrlUtilsService.getURLFirstParameterByName(paramsName);
        }

        function removeParam (parameter) {
            let url=document.location.href;
            const urlparts= url.split('?');

            if (urlparts.length>=2) {
                const urlBase=urlparts.shift();
                const queryString=urlparts.join('?');

                const prefix = encodeURIComponent(parameter)+'=';
                const pars = queryString.split(/[&;]/g);
                for (let i= pars.length; i-->0;)
                    if (pars[i].lastIndexOf(prefix, 0)!==-1)
                        pars.splice(i, 1);
                url = urlBase+'?'+pars.join('&');
            }
            return url;
        }


        /**
         * Return the company logo url in the project.
         * @param {String} companyCode -The company code
         * @returns {String} - the company logo url that matches with its company code in the data on localStorage
         */
        function getCompanyURL (companyCode) {
            const companyURLs = {
                logo: BookingAppConstants.airlinesLogoBaseRoute + BookingAppConstants.defaultAirlineLogo,
                logoMin : BookingAppConstants.airlinesLogoBaseRoute + BookingAppConstants.defaultAirlineMinLogo};
            let airlinesLogo = CommonsSessionStorageService.get('airlinesLogoList') || [], i = 0, found = false, companyURL = '';
            while (!found && i < airlinesLogo.length) {
                if (airlinesLogo[i].iataCompanyCode === companyCode) {
                    found = true;
                    const auxCompanyURL =  airlinesLogo[i].url;
                    const auxCompanyMinURL =  airlinesLogo[i].url_min;
                    if (auxCompanyURL) {
                        companyURLs.logo = BookingAppConstants.airlinesLogoBaseRoute + auxCompanyURL;
                    }
                    if (auxCompanyMinURL) {
                        companyURLs.logoMin = BookingAppConstants.airlinesLogoBaseRoute + auxCompanyMinURL;
                    }


                }
                i++;
            }
            return companyURLs;
        }

        /**
        * Return the background image in the project.
        * @param {String} destinationCityCode -The destination city code
        * @returns {String} - the background image url that matches with its destination city code in the data on localStorage
        */
        function getBackGroundURL (destinationCityCode) {
            let backgroundImages = CommonsSessionStorageService.get('backgroundImagesList') || [], i = 0, found = false, backgroundURL = '';
            const widthScreen = $window.innerWidth > 1024 ? 2000 : ($window.innerWidth > 480 && $window.innerWidth < 1025) ? 768 : $window.innerWidth < 481 ? 320 : 2000;
            while (!found && i < backgroundImages.length) {
                if (backgroundImages[i].code === destinationCityCode) {
                    found = true;
                    backgroundURL = BookingAppConstants.backgroundImagesBaseRoute + backgroundImages[i].url + widthScreen + backgroundImages[i].extension;
                }
                i++;
            }
            if (!found) {
                backgroundURL = BookingAppConstants.backgroundImagesBaseRoute + BookingAppConstants.defaultBackgroundImageWidth + widthScreen + '.jpg';
            }
            return backgroundURL;
        }

        /**
         * Make a concatenated string of passenger id to call rest service.
         * @param {String} passengersList -Passenger List returned by getFare service
         * @returns {String} - Return a concatenated string of passenger id
         */
        function getPassengersId (passengersList) {
            let i;
            const passengers = passengersList || [];
            let passengersId = '';
            for (i = 0; i < passengers.length; i++) {
                passengersId += (passengersId === '' ? '?' : '&') + 'passengerId=' + passengers[i].passengerId;
            }
            return passengersId;
        }

        /**
        * Make an Object with commercial selling data of the market
        * @param {Array} commercialData -commercialData List returned by getCommercialInfo service
        * @returns {Object} - Return an Object with commercial selling data of the market
        */
        function getCommercialsellingDataByMarket (commercialData) {
            let i, j = 0, founded = false;
            let returnCommercialData;
            for (i = 0; i < commercialData.length; i++) {
                while (!founded && j < commercialData.length) {
                    if (commercialData[j].market.code === BookingAppConstants.market) {
                        returnCommercialData = commercialData[j];
                        $rootScope.appMarketDescription = commercialData[j].market.description;
                        CommonsSessionStorageService.set('appMarketDescription', $rootScope.appMarketDescription);
                        founded = true;
                    }
                    j++;
                }
            }
            return returnCommercialData;
        }

        /**
        * Make an Object with trips info data to show in Passengers, Payments & confirmation summary
        * @param {Array} serviceData,currency -data and transformed currency from service
        * @returns {Object} - Return an Object with trip info data to show in Passengers,Payments & confirmation summary
        */

        function getTripsBreakdownInfo (serviceData) {
            if (!serviceData) return [];

            const summaryInfoTrips = serviceData.map((tripData, i) => {
                const trip = {
                    idTrip: tripData.sliceId,
                    stopsNumber: tripData.stopsNumber,
                    fare: getFareForTrip(tripData),
                    segments: getSegmentsForTrip(tripData)
                };
                return trip;
            });

            return summaryInfoTrips;
        }

        function getFareForTrip (tripData) {
            if ($rootScope.isRedemptionFlow) {
                const fares = tripData.segments.map(segment =>
                    createFareDetails(segment.cabin.fareFamily)
                );
                return Object.assign({}, ...fares);
            } else {
                return createFareDetails(tripData.segments[0].cabin.fareFamily);
            }
        }

        function getSegmentsForTrip (tripData) {
            return tripData.segments.map(segment => ({
                idSegment: segment.id,
                departure: segment.departure,
                departureDate: $filter('DateFormatFilter')(segment.departureDateTime),
                arrival: segment.arrival,
                arrivalDate: $filter('DateFormatFilter')(segment.arrivalDateTime),
                flightNumber: segment.flight.operationalFlightNumber != null
                    ? segment.flight.operationalFlightNumber
                    : segment.flight.marketingFlightNumber,
                operatedBy: segment.flight.operationalCarrier.name,
                aircraftType: angular.isUndefined(segment.flight.aircraft) || segment.flight.aircraft === null
                    ? segment.flight.aircraft
                    : segment.flight.aircraft.description,
                duration: $filter('DurationFormatFilter')(segment.duration),
                waitingTime: segment.waitingTime,
                waitingParsedTime: $filter('DurationFormatFilter')(segment.waitingTime),
                cabin: segment.cabin.cabinDescription,
                operationalDisclosure: segment.flight.operationalDisclosure,
                marketingCarrier: segment.flight.marketingCarrier,
                displayMarketingFlightNumber: segment.flight.marketingFlightNumber ?? segment.flight.operationalFlightNumber
            }));
        }

        function createFareDetails (fareFamilyType) {
            const fareFamilyConditions = CommonsSessionStorageService.get('fareData').fareFamilyConditions;
            const fareFamily = fareFamilyConditions.find(f => f.commercialCode === fareFamilyType);
            if (!fareFamily) return { fareDetails: {} };

            const fareInfo = {
                name: fareFamily.commercialName,
                cabin: fareFamily.cabinDescription,
                fareDetails: {}
            };

            fareFamily.conditions.forEach(condition => {
                const isChangeOrRefund =
                    condition.code === BookingAppConstants.CONDITION_TYPES.CHANGE ||
                    condition.code === BookingAppConstants.CONDITION_TYPES.REEMBOLSO;
                fareInfo.fareDetails[condition.code] = createCompleteFareDetails(condition, isChangeOrRefund);
            });

            return fareInfo;
        }

        function createCompleteFareDetails (fareConditions, change) {
            return {
                name: fareConditions.name,
                message: change
                    ? fareConditions.text
                    : (fareConditions.extendedInfo && fareConditions.extendedInfo.title)
                        ? fareConditions.extendedInfo.title
                        : fareConditions.text
            };
        }

        /**
       * Make an Object with passengers info data to show in Passengers, Payments & confirmation summary. With future payments component, it will be only used in passengers page.
       * @param {Ojbect} serviceData data retrieved from fare service
       * @param currency -data and transformed currency from service
       * @returns {Object} - Return an Object with passengers prices, taxes and currencies data
       */
        function getPassengersBreakdownInfo (serviceData, currency) {
            const returnedPassengersInfo = { generalData: {} };
            if (!serviceData || !serviceData.offers[0]) {
                return returnedPassengersInfo;
            }

            const offerItems = serviceData.offers[0].offerItems;
            for (let j = 0; j < offerItems.length; j++) {
                const offerItem = offerItems[j];
                for (let i = 0; i < offerItem.passengerIds.length; i++) {
                    const pasType = getPassengerType(offerItem.passengerIds[i]);
                    const pasInfo = buildPassengerInfo(serviceData, offerItem, j, currency);
                    addOrUpdatePassenger(returnedPassengersInfo, pasType, pasInfo, offerItem);
                    formatPassengerData(returnedPassengersInfo, currency);
                }
            }
            return returnedPassengersInfo;
        }

        function getPassengerType (passengerId) {
            return passengerId.split('_')[0];
        }

        function buildPassengerInfo (serviceData, offerItem, j, currency) {
            const pasInfo = {
                number: 1,
                totalTax: offerItem.price.tax,
                totalTaxWithDiscount: offerItem.price.tax,
                totalTaxWithoutDiscount: offerItem.price.tax,
                currency: getCurrency(offerItem.price.currency, serviceData),
                breakdownTaxes: getFormatedTaxes(offerItem.detailedTaxes, currency)
            };

            if (!$rootScope.isRedemptionFlow) {
                pasInfo.fare = offerItem.price.fare;
                if (serviceData.offers[0].discountsApplied) {
                    const discounts = serviceData.offers[0].discountsApplied.originalOfferItems[j].price;
                    pasInfo.fareWithoutDiscount = discounts.fare;
                    pasInfo.fare = discounts.fare;
                    pasInfo.totalTax = discounts.tax;
                    pasInfo.totalTaxWithDiscount = offerItem.price.tax;
                    pasInfo.totalTaxWithoutDiscount = discounts.tax;
                } else {
                    pasInfo.fareWithoutDiscount = offerItem.price.fare;
                }
                pasInfo.fareWithDiscount = offerItem.price.fare;
            } else {
                const selectedFareRedemptionData = CommonsSessionStorageService.get('selectedFareRedemptionData');
                pasInfo.fare = selectedFareRedemptionData.fareCashPerPassenger;
                pasInfo.totalTax = selectedFareRedemptionData.taxPerPassenger ?? selectedFareRedemptionData.tax;
                pasInfo.totalTaxWithDiscount = selectedFareRedemptionData.taxPerPassenger;
                pasInfo.totalTaxWithoutDiscount = selectedFareRedemptionData.taxPerPassenger;
                pasInfo.fareWithoutDiscount = selectedFareRedemptionData.fareCashPerPassenger;
                pasInfo.fareWithDiscount = selectedFareRedemptionData.fareCashPerPassenger;
                pasInfo.aviosFare = $rootScope.isPointsOBFlow
                    ? selectedFareRedemptionData.farePointsPerPassenger
                    : selectedFareRedemptionData.fareAviosPerPassenger;
                pasInfo.breakdownTaxes = cleanTaxes(pasInfo.breakdownTaxes, selectedFareRedemptionData.redemptionOptionId);
            }
            return pasInfo;
        }

        function addOrUpdatePassenger (
            returnedPassengersInfo,
            pasType,
            pasInfo,
            offerItem
        ) {
            let samePas = false;
            let selectedFareRedemptionData;
            if ($rootScope.isRedemptionFlow) {
                selectedFareRedemptionData = CommonsSessionStorageService.get('selectedFareRedemptionData');
            }
            if (returnedPassengersInfo.generalData[pasType]) {
                for (let k = 0; k < returnedPassengersInfo.generalData[pasType].length; k++) {
                    if (
                        (returnedPassengersInfo.generalData[pasType][k].fare === offerItem.price.fare) ||
                        $rootScope.isRedemptionFlow
                    ) {
                        samePas = true;
                        returnedPassengersInfo.generalData[pasType][k].number++;
                        returnedPassengersInfo.generalData[pasType][k].totalTax += $rootScope.isRedemptionFlow
                            ? selectedFareRedemptionData.taxPerPassenger
                            : offerItem.price.tax;
                    }
                }
                if (!samePas) {
                    returnedPassengersInfo.generalData[pasType].push(pasInfo);
                }
            } else {
                returnedPassengersInfo.generalData[pasType] = [pasInfo];
            }
        }

        function formatPassengerData (returnedPassengersInfo, currency) {
            for (const passengerObj in returnedPassengersInfo.generalData) {
                if (Object.hasOwnProperty.call(returnedPassengersInfo.generalData, passengerObj)) {
                    returnedPassengersInfo.generalData[passengerObj].forEach((passenger) => {
                        if ($rootScope.isRedemptionFlow) {
                            passenger.parsedAviosFare = CurrencyService.formatAvios(currency, passenger.aviosFare);
                        }
                        passenger.parsedFare = CurrencyService.formatPrice(currency, passenger.fare, false, true);
                        passenger.parsedFareWithDiscount = CurrencyService.formatPrice(currency, passenger.fareWithDiscount, false, true);
                        passenger.parsedFareWithoutDiscount = CurrencyService.formatPrice(currency, passenger.fareWithoutDiscount, false, true);
                        passenger.parsedTotalTax = CurrencyService.formatPrice(currency, passenger.totalTax, true);
                        passenger.parsedTotalTaxWithDiscount = CurrencyService.formatPrice(currency, passenger.totalTaxWithDiscount, true);
                        passenger.parsedTotalTaxWithoutDiscount = CurrencyService.formatPrice(currency, passenger.totalTaxWithoutDiscount, true);
                    });
                }
            }
        }

        function getCurrency (currencyCode, serviceData) {
            let currency, currencyIndex;
            for (currencyIndex = 0; currencyIndex < serviceData.contextMetadata.currencies.length; currencyIndex++) {
                if (serviceData.contextMetadata.currencies[currencyIndex].code === currencyCode) {
                    currency = serviceData.contextMetadata.currencies[currencyIndex].symbol;
                }
            }
            return currency;
        }

        function getFormatedTaxes (taxes, currency) {
            const formatedTaxes = [];
            let taxesIndex;
            for (taxesIndex = 0; taxesIndex < taxes.length; taxesIndex++) {
                formatedTaxes[taxesIndex] = angular.copy(taxes[taxesIndex]);
                formatedTaxes[taxesIndex].amount = CurrencyService.formatPrice(currency, formatedTaxes[taxesIndex].amount, true);
            }
            return formatedTaxes;
        }
        function cleanTaxes (taxes, redemptionId) {
            if ((redemptionId === '1') && taxes.some(tax => tax.code === 'XF') && !taxes.some(tax => tax.code.includes('YQ'))) {
                taxes = taxes.filter(item => item.code !== 'XF');
            }
            return taxes;
        }

        /**
        * Returns the value for the html metatag given.
        * @param {string} metaTagName - The metatag name for get the value
        * @returns {string} - The metatag value for the given metaTagName
        */
        function getMetaTagValueByName (metaTagName) {
            let value = '';
            if (metaTagName && angular.isString(metaTagName) && $window.document.getElementsByName(metaTagName).length > 0) {
                value = $window.document.getElementsByName(metaTagName)[0].content;
            }
            return value;
        }

        function saveEndpoints (endpointsData) {
            let endpoints = {}, i;
            for (i = 0; i < endpointsData.length; i++) {
                endpoints[endpointsData[i].key] = endpointsData[i].host + endpointsData[i].basePath;
            }
            CommonsSessionStorageService.set('endpoints', endpoints);
        }

        function getEndpoint (key) {
            return (CommonsSessionStorageService.get('endpoints') || {})[key];
        }

        function generateBuildNumberQueryString () {
            const buildNumber = getMetaTagValueByName('buildNumber');
            return buildNumber && buildNumber !== '' ? ('?buildNumber=' + buildNumber) : '';
        }

        function getNumberTypePas () {
            const pasInfo = CommonsSessionStorageService.get('bookingUrlParams');
            const returnPasInfo = {};
            if (pasInfo) {
                if (pasInfo.adult != null) {
                    returnPasInfo.ADULT = pasInfo.adult;
                }
                if (pasInfo.child != null) {
                    returnPasInfo.CHILD = pasInfo.child;
                }
                if (pasInfo.infant != null) {
                    returnPasInfo.INFANT = pasInfo.infant;
                }
            }
            return returnPasInfo;
        }

        /**
    * Returns if creditcard date is expired
    * @param {string} expirydate - The expiry date to check it
    * @returns {boolean} - If credit card is expired or not
    */
        function checkCreditCardExpiryDate (expiryDate) {
            let expired = false;
            const today = new Date();
            let actualMonth = today.getMonth() + 1;
            const actualYear = today.getFullYear() % 100;
            const expiryMonth = expiryDate.substring(0, 2);
            const expiryYear = expiryDate.substring(2);
            if (actualMonth < 10) {
                actualMonth = '0' + actualMonth;
            }
            if ((parseInt(expiryYear) < parseInt(actualYear)) || (parseInt(expiryYear) === parseInt(actualYear) && parseInt(expiryMonth) < parseInt(actualMonth))) {
                expired = true;
            }
            return expired;
        }

        /**
     * Return the credit card logo url in the project.
     * @param {String} creditCardCode -The credit card code
     * @returns {String} - the credit card logo url that matches with its credit card code in the data on localStorage
     */
        function getCreditCardIcon (creditCardCode, creditCards) {
            let i = 0, found = false, creditCardURL = '';
            while (!found && i < creditCards.length) {
                if (creditCards[i].cardTypeId === creditCardCode) {
                    found = true;
                    creditCardURL = BookingAppConstants.iconsRoute + BookingAppConstants.creditCardLogoBaseRoute
                        + creditCards[i].name;
                }
                i++;
            }
            if (!found) {
                creditCardURL = BookingAppConstants.iconsRoute + BookingAppConstants.creditCardLogoBaseRoute
                    + BookingAppConstants.defaultCreditCardLogo;
            }

            return creditCardURL;
        }



        /**
         *  Get type of passenger depending of birthdate
         * @param {String} birthDate
         */
        function getTypeOfPassenger (birthDate) {
            let agePassenger, type, originDestinationDates = CommonsSessionStorageService.get('originDestination').dates;

            agePassenger = calculateAge(originDestinationDates.outboundFlight ? originDestinationDates.outboundFlight : new Date(), birthDate);

            if (birthDate && agePassenger < 2) {
                type = originDestinationDates.returnFlight && calculateAge(originDestinationDates.returnFlight ? originDestinationDates.returnFlight : new Date(), birthDate) >= 2 ? BookingAppConstants.passengerTypes.child : BookingAppConstants.passengerTypes.infant;
            } else if (agePassenger >= 2 && agePassenger < 12) {
                type = BookingAppConstants.passengerTypes.child;
            } else if (agePassenger >= 65 && !$rootScope.isRedemptionFlow) {
                type = BookingAppConstants.passengerTypes.senior;
            } else {
                type = BookingAppConstants.passengerTypes.adult;
            }
            return type;

            function calculateAge (compareDate, compareBirthDate) {

                return dayjs(compareDate).diff(compareBirthDate, 'year');
            }
        }

        /**
         * check if the current user is logged or not
         * @return true if the user is logged in the app
         */
        function isUserLogged () {
            return CommonsSessionStorageService.get('userLogged');
        }

        function getRelatedContent (relatedContent) {
            let returnRelatedContent = {}, i;
            if (relatedContent) {
                for (i = 0; i < relatedContent.length; i++) {
                    returnRelatedContent[relatedContent[i].key] = $sce.trustAsHtml(relatedContent[i].value);
                }
            }
            return returnRelatedContent;
        }


        function getFormatedDate (date, format) {
            let language = $rootScope.appLang, commercialData = CommonsSessionStorageService.get('commercialData'), formatedDate = null, oldFormattedDate = null;
            let foundedLanguage = false, languageIndex = 0, dateFormatByLanguage = null;
            if (language && commercialData && commercialData.languages) {
                while (!foundedLanguage && languageIndex < commercialData.languages.length) {
                    if (commercialData.languages[languageIndex].code === language.toLowerCase()) {
                        dateFormatByLanguage = commercialData.languages[languageIndex].dateFormat[format];
                        foundedLanguage = true;
                    }
                    languageIndex++;
                }
                oldFormattedDate = foundedLanguage && dateFormatByLanguage ? $filter('date')(date, dateFormatByLanguage) : $filter('date')(date, commercialData.languages[0].dateFormat.short);
                formatedDate = foundedLanguage && dateFormatByLanguage ? $filter('date')(new Date(date), dateFormatByLanguage) : $filter('date')(new Date(date), commercialData.languages[0].dateFormat.short);
            } else {
                formatedDate = $filter('date')(new Date(date));
                oldFormattedDate = $filter('date')(date);
            }
            if (oldFormattedDate !== formatedDate) {
                formatedDate = oldFormattedDate;
            }
            return { formatedDate: formatedDate, dateFormatByLanguage: dateFormatByLanguage };
        }

        function getSliceDetailsById (sliceId, slices) {
            let sliceFounded = false, sliceIndex = 0, sliceInfo = {};
            while (!sliceFounded && sliceIndex < slices.length) {
                if (slices[sliceIndex].sliceId === sliceId) {
                    sliceFounded = true;
                    sliceInfo = {
                        origin: slices[sliceIndex].segments[0].departure,
                        arrival: slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrival
                    };
                }
                sliceIndex++;
            }
            return sliceInfo;
        }

        /**
        *  Return if have param resident in search
         * @returns {boolean} - If have resident param in URL
        */
        function getStatusResident () {
            const bookingUrlParams = CommonsSessionStorageService.get('bookingUrlParams');
            return !!(BookingAppConstants.market === BookingAppConstants.defaultMarket && bookingUrlParams.resident);
        }


        /**
        *  Returns an State provided an zipCode
         * @returns {Object} - state info
        */
        function fillZipCodeByState (state, zipCode) {
            const fillZipCodeByStateInfo = { checker: false, changeZipCode: state && (!zipCode || zipCode && (zipCode === null || zipCode === '')), newZipCode: state.normalizedCode };
            fillZipCodeByStateInfo.checker = zipCode && state && (zipCode.toString().substring(0, state.code.length) === state.code || zipCode.toString().substring(0, state.normalizedCode.length) === state.normalizedCode);
            return fillZipCodeByStateInfo;
        }

        function fillMemberIdentifierWithZeros (memberIdentifier) {
            const desiredLength = 14;
            if (memberIdentifier?.length < desiredLength) {
                memberIdentifier = memberIdentifier.padStart(desiredLength, '0');
            }
            return memberIdentifier;
        }


        /**
        *  Returns a new request for Availability
         * @returns {Object} - requestAvailabilityData
        */

        function getNewAvailabilityRequest (requestData) {
            const newRequestData = new Map(), selectedPartner = IbCheckPartnersDiscountsService.getSelectedPartner(), oBDiscountTypeStored = CommonsSessionStorageService.get('oBDiscountType');
            newRequestData.set('marketCode', requestData.marketCode);
            newRequestData.set('passengers', requestData.passengers);
            newRequestData.set('preferredCabin', requestData.slices[0] && requestData.slices[0].segments ? requestData.slices[0].segments[0].cabin : requestData.preferredCabin);
            newRequestData.set('slices', generateSlicesInfo(requestData.slices));
            if (requestData.specialDiscounts && requestData.specialDiscounts.length > 0) {
                newRequestData.set('specialDiscounts' ,requestData.specialDiscounts);
            }
            if ($rootScope.isLogged === BookingAppConstants.LOGIN_ONB ) {
                newRequestData.set('specificFare', true);
            }
            return Object.fromEntries(newRequestData);

            function generateSlicesInfo (slices) {
                let i;
                const slicesInfo = [];

                for (i = 0; i < slices.length; i++) {
                    slicesInfo[i] = {
                        origin: getCitybyAirport(slices[i].origin) ? getCitybyAirport(slices[i].origin) : slices[i].origin,
                        destination: getCitybyAirport(slices[i].destination) ? getCitybyAirport(slices[i].destination) : slices[i].destination,
                        date: slices[i].date
                    };

                }

                return slicesInfo;

                function getCitybyAirport (code) {
                    let i = 0, j, codeCity = null, foundCity = false;
                    while (!foundCity && i < BookingAppConstants.CITY_AIRPORTS_METASEARCH.cities.length) {
                        for (j = 0; j < BookingAppConstants.CITY_AIRPORTS_METASEARCH.cities[i].airports.length; j++) {
                            if (code === BookingAppConstants.CITY_AIRPORTS_METASEARCH.cities[i].airports[j].code) {
                                codeCity = BookingAppConstants.CITY_AIRPORTS_METASEARCH.cities[i].airports[j].code;
                                foundCity = true;
                                codeCity = BookingAppConstants.CITY_AIRPORTS_METASEARCH.cities[i].code;
                            }
                        }
                        i++;
                    }
                    return codeCity;
                }
            }
        }

        function redirectToCUG  (urlParams) {
            return !!(urlParams && urlParams.backToUrl);
        }

        function backToHome () {
            const bkiURLParams = CommonsSessionStorageService.get('bookingUrlParams') || {};
            if (redirectToCUG(bkiURLParams)) {
                CommonsSessionStorageService.clearAll();
                $window.location.href = $window.location.origin + bkiURLParams.backToUrl;
            } else if (bkiURLParams.fromMarket) { // No need to check for string type and length
                CommonsSessionStorageService.clearAll();
                $window.location.href = $window.location.origin + '/'
                    + bkiURLParams.fromMarket.toLowerCase() + '/'
                    + (bkiURLParams.fromLanguage ? bkiURLParams.fromLanguage.toLowerCase() + '/' : '');
            } else {
                CommonsSessionStorageService.clearAll();
                $window.location.href = $window.location.origin;
            }
        }

        function backToSearchEngines () {
            const bkiURLParams = CommonsSessionStorageService.get('bookingUrlParams');
            if ($rootScope.isRedemptionFlow) {
                const redirectTo = $rootScope.isPointsOBFlow ? $filter('LinksFilter')('IBERIA_NEW_ONB_REDEMPTION_SEARCH_ENGINE') : $filter('LinksFilter')('IBERIA_NEW_REDEMPTION_SEARCH_ENGINE');
                CommonsSessionStorageService.clearAll();
                BookingRedirectionService.externalRedirect(redirectTo);
            } else if (CommonsSessionStorageService.get('multiCitySearch') === true && CommonsSessionStorageService.get('searchFlightType') === 'multiCityFlight') {
                const isHMAD = CommonsSessionStorageService.get('isHMAD') ?? false;
                const redirectTo = $filter('LinksFilter')(isHMAD? 'IBERIA_STOPOVER_MADRID_SEARCH_ENGINE':'IBERIA_MULTIPLE_TRACKS_SEARCH_ENGINE');
                CommonsSessionStorageService.clearAll();
                BookingRedirectionService.externalRedirect(redirectTo);
            } else {
                const redirectTo = redirectToCUG(bkiURLParams) ? $window.location.origin + bkiURLParams.backToUrl : $filter('LinksFilter')('CHANGE_SEARCH_LINK');
                CommonsSessionStorageService.clearAll();
                BookingRedirectionService.externalRedirect(redirectTo);
            }
        }
        /**
         * Redirection to Home
         * @param {Event} backToMain Event that launch the function
         * @param {Boolean} goToHome  Indicate if the redirection is for Home
         * @returns {void}
        */
        function backToMain (goToHome) {
            if (goToHome) {
                backToHome();
            } else {
                backToSearchEngines();
            }
        }

        /**
         * Truncate max length
         * @param {boolean} isResident
         * @param {object} dataPassenger
         * @returns
         */
        function trunkateMaxLength (isResident, dataPassenger) {
            if(isResident) {
                dataPassenger.surname = dataPassenger.surname.substr(0, BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_FIRST_SURNAME);
                if(dataPassenger.lastSurname) {
                    dataPassenger.lastSurname = dataPassenger.lastSurname.substr(0, BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_LAST_SURNAME);
                }
            } else {
                dataPassenger.surname = dataPassenger.surname.substr(0, BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_SURNAME);
            }

            return dataPassenger;
        }

        function onholdLightBoxAccept () {
            const orderId = CommonsSessionStorageService.get('flowId');
            BookingChangeOnHoldOrderService.changeOnHoldOrder(orderId).then(changeOnHoldOrderSuccess, angular.noop);

            function changeOnHoldOrderSuccess (response) {
                NewMainHeaderFacade.deleteDiscountBasket(BookingAppConstants.DISCOUNT_TYPES.VOUCHER);
                const headerModel = CommonsSessionStorageService.get('headerModel') || null;
                const actualStepFlow = CommonsSessionStorageService.get('actualStepFlow');
                const searchFlightType = CommonsSessionStorageService.get('searchFlightType');
                const od = (searchFlightType === 'multiCityFlight' )? CommonsSessionStorageService.get('originDestinationMulticity') : CommonsSessionStorageService.get('originDestination');
                const headerTempModel = {
                    flightType: searchFlightType,
                    redemption: headerModel.headerModel.redemption,
                    showModalBackHome: headerModel.headerModel.showModalBackHome,
                    showBasket: headerModel.headerModel.shoppingBasket.showBasket,
                    originDestination: od,
                    currency: CommonsSessionStorageService.get('currency')
                };
                const model = NewMainHeaderFacade.updateHeaderModelOnHold(headerTempModel);
                model.shoppingBasket.discountsModel = headerModel.headerModel.shoppingBasket.discountsModel;
                const headerModelTemp = resetAllBasket(headerModel, model);

                updatePreviousPageForOnHoldFromPayments();

                CommonsSessionStorageService.set('flowApp', 'BBKIOH');
                CommonsSessionStorageService.set('isOnHoldOrder', true);
                newNavigation(actualStepFlow, headerModelTemp);
            }

            function newNavigation (actualStepFlow, headerModelTemp) {
                NewMainHeaderFacade.updateHeaderModel(headerModelTemp);
                if (actualStepFlow === 'ibpurc') {
                    CommonsSessionStorageService.remove(BkiStorageConstants.PAYMENTS_VIEWTYPE);
                    $window.location.reload();
                } else {
                    NewMainHeaderFacade.updateSteps('ibpurc');
                    $location.path('/ibpurc');
                }
            }
            function resetAllBasket (model, vmModel) {
                let headerTemp;
                vmModel.shoppingBasket.total.original = model.headerModel.shoppingBasket.trips ? model.headerModel.shoppingBasket.trips.total.totalPrice : 0;
                vmModel.shoppingBasket.total.formatted = model.headerModel.shoppingBasket.trips ? model.headerModel.shoppingBasket.trips.total.formatted : 0;
                vmModel.shoppingBasket.segmentsInfo = model.headerModel.shoppingBasket.segmentsInfo ? model.headerModel.shoppingBasket.segmentsInfo : [];
                vmModel.shoppingBasket.trips = model.headerModel.shoppingBasket.trips ? model.headerModel.shoppingBasket.trips : [];
                vmModel.steps = model.headerModel.steps ? model.headerModel.steps : null;
                headerTemp = {
                    greyBarModel: model.greyBarModel,
                    headerModel:  vmModel,
                    stepsModel: model.stepsModel
                };
                return headerTemp;
            }
        }
        function updatePreviousPageForOnHoldFromPayments (actualStepFlow) {
            if (actualStepFlow !== BookingAppConstants.ibpurc) {
                return;
            }

            DigitalDataUtilsService.updatePreviousPageQuadrigam();
        }

        function setSegmentOfSelectedTrip (selectedTrip) {
            const arraySegments = selectedTrip
                .map(trip => normalizeSegmentsForSeatmap(trip?.info?.segments ?? []));
            CommonsSessionStorageService.set('selectedTripSegments', arraySegments);
        }

        // Normalizer to set segmentId when selectedTrip array comes from extended-direct source
        function normalizeSegmentsForSeatmap (segments = []) {
            return segments.map(segment => ({
                ...segment,
                segmentId: segment.segmentId ?? segment.id
            }));
        }
        function redirectToFlash () {
            const url = $window.location.origin + '/'+$rootScope.appMarket.toLowerCase()+'/'+$rootScope.appLang+'/flash-offers/#!/FLASHO' ;
            BookingRedirectionService.externalRedirect(url);
        }

        function addPriceParametersInDigitalInfo (Currency, TotalPrice, TotalPriceWithoutTaxes) {
            DigitalDataService.addDigitalDataInfo(Currency);
            DigitalDataService.addDigitalDataInfo(TotalPrice);
            DigitalDataService.addDigitalDataInfo(TotalPriceWithoutTaxes);
        }

        function addflightHaulInDigitalInfo (flightHaul) {
            DigitalDataService.addDigitalDataInfo(flightHaul);
        }

        /**
         * @function checkUserMustFlyFromFare
         * This function recovers the stored fare data ang check the partner discount userMustFly property and if not, select it from selectedPartner param.
         */
        function checkUserMustFlyFromFare (selectedPartner) {
            const discounts = CommonsSessionStorageService.get('fareData')?.offers[0]?.discountsApplied?.discounts;
            let userMustFlyFromSelectedPartner;
            let userUnableToFly = false;
            if (selectedPartner !== undefined) {
                userMustFlyFromSelectedPartner = selectedPartner?.userMustFly !== null ? selectedPartner.userMustFly : false;
            } else {
                userMustFlyFromSelectedPartner = false;
            }
            if (discounts) {
                discounts.forEach(discount => {
                    if (discount.type === BookingAppConstants.DISCOUNT_TYPES.PARTNER) {
                        discount?.userMustFly !== null ? userUnableToFly = discount.userMustFly : userUnableToFly = userMustFlyFromSelectedPartner;
                    }
                });
            } else {
                userUnableToFly = false;
            }
            return userUnableToFly;
        }
        function setSelectedTripInfoinStorage (selectedSlices) {
            // Deep copy of selectedSlices
            const tripInfo = JSON.parse(JSON.stringify(selectedSlices))?? [];
            // Remove unnecessary properties
            tripInfo.forEach((slice) => {
                if (slice.info) {
                    delete slice.info.$$hashKey;
                    if (slice.info.cabins) {
                        for (const cabinK in slice.info.cabins) {
                            const cabin = slice.info.cabins[cabinK];
                            const ffams = cabin?.fareFamilies ?? [];
                            ffams.forEach((fareFamily) => {
                                delete fareFamily.offers;
                            });
                        }
                    }
                    if (slice.info?.selectedFareFamily?.offers) {
                        delete slice.info.selectedFareFamily.offers;
                    }
                }
            });
            CommonsSessionStorageService.set('selectedTripInfo', tripInfo);
        }

        function checkExistNewAvailabilitySearch () {
            const newAvailabilityRequestData = CommonsSessionStorageService.get('newAvailabilityRequestData');
            const availabilityRequestData = CommonsSessionStorageService.get('availabilityRequestData');
            let urlParams = '', arrParamsUrl = [], beginDate = [], endDate = [], beginDay = null, beginMonth = null, beginYear = null, endDay = null, endMonth = null, endYear = null;
            const availabilitySearch = (newAvailabilityRequestData) ? newAvailabilityRequestData.slices : availabilityRequestData.slices;
            const lastSearch = CommonsSessionStorageService.get('actualStepFlow') === 'ibpurc' && CommonsSessionStorageService.get('paymentLocationSearch') ? CommonsSessionStorageService.get('paymentLocationSearch') : '';
            const urlParamsOrigin = lastSearch || angular.copy($window.location.search);

            beginDate = (availabilitySearch[0] && availabilitySearch[0].date) ? availabilitySearch[0].date.split('-') : [];
            if (beginDate.length === 3) {
                beginDay = beginDate[2];
                beginMonth = beginDate[1];
                beginYear = beginDate[0];
            }

            endDate = (availabilitySearch[1] && availabilitySearch[1].date) ? availabilitySearch[1].date.split('-') : [];
            if (endDate.length === 3) {
                endDay = endDate[2];
                endMonth = endDate[1];
                endYear = endDate[0];
            }

            arrParamsUrl = urlParamsOrigin.split('&');
            for (let i = 0; i < arrParamsUrl.length; i++) {
                const paramUrl = arrParamsUrl[i];
                if (paramUrl.includes(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_DAY[0]) && beginDay !== null) {
                    urlParams += BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_DAY[0] + '=' + beginDay;
                } else if (paramUrl.includes(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH[0]) && beginYear !== null && beginMonth !== null) {
                    urlParams += BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH[0] + '=' + beginYear + beginMonth;
                } else if (paramUrl.includes(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_YEAR[0]) && beginYear !== null) {
                    urlParams += BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_YEAR[0] + '=' + beginYear;
                } else if (paramUrl.includes(BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY[0]) && endDay !== null) {
                    urlParams += BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY[0] + '=' + endDay;
                } else if (paramUrl.includes(BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH[0]) && endYear !== null && endMonth !== null) {
                    urlParams += BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH[0] + '=' + endYear + endMonth;
                } else if (paramUrl.includes(BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR[0]) && endYear !== null) {
                    urlParams += BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR[0] + '=' + endYear;
                } else {
                    urlParams += paramUrl;
                }

                if (i < arrParamsUrl.length - 1) urlParams += '&';
            }
            $window.location.search = urlParams;
            return urlParams;
        }
    }
})();
