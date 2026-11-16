import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import angular from 'angular';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

@Service(
    'ib-MmB-voluntary-changes-module',
    ['MmBUtilService', 'localStorageService', 'VoluntaryChangesConstants', 'MmBAppConstants', '$filter', 'CurrencyService'],
    [])
export class VoluntaryChangesTransformer {

    constructor(
        private MmBUtilService: MmBUtilService,
        private localStorageService,
        private VoluntaryChangesConstants,
        private MmBAppConstants: MmBAppConstants,
        private $filter,
        private CurrencyService: CurrencyService) {}
    
    modelTransform: any = {};
    segment;
    cabinType;
    slicesOrigin;
    slice;
    originDestination;
    originDestinationsOffer;
    applicableSlices;
    fareFamiliesCurrent;
    infoFareFamily;
    offerDetail = {};
    groupCabins;
    fareFamilyConditionsArray;
    lengthFareFamilyConditions;
    offersArray;
    lengthOffers;
    originDestinationsArray;
    indexFare = null;
    flightsLength;
    auxModeFlight;
    bestOfferOfSlices;
    isUnified;


    /**
     * This function receives the data of the possible voluntary changes of the service,
     * for a one-way date and a return date. Then they are transformed to be used in the
     * business logic of the application.
     * @param {Object} data Input Original information of the service.
     * @returns The service data transformed.
     */
    getDataAvailabilityTransformed = (data, modeFlight) => {

        this.flightsLength = data.flightsLength;
        this.auxModeFlight = modeFlight;
        this.isUnified = this.localStorageService.get('isUnifiedFlow');
        this.originDestinationsArray = data.originDestinations;

        if(modeFlight === 'return' && this.isUnified && this.originDestinationsArray.length > 1) {
            modeFlight = 1;
        } else if (modeFlight === 'outbound' || modeFlight === 'twice' || this.localStorageService.get('isUnifiedFlow')) {
            modeFlight = 0;
        } else {
            modeFlight = 1;
        }

        this.fareFamilyConditionsArray = data.fareFamilyConditions;
        this.lengthFareFamilyConditions = this.fareFamilyConditionsArray.length;
        this.offersArray = data.offers;
        this.lengthOffers = this.offersArray.length;
        this.originDestinationsArray = data.originDestinations;

        this.modelTransform.originDestinations = [];
        this.modelTransform.fareFamilyConditions = data.fareFamilyConditions;
        this.modelTransform.contextMetadata = data.contextMetadata;
        this.modelTransform.relatedContent = data.relatedContent;
        this.modelTransform.flowType=data.flowType;
        this.modelTransform.passengers = data.passengers;
        this.originDestination = this.originDestinationsArray[modeFlight];
        this.slicesOrigin = this.originDestination.slices;
        this.originDestination.slices = [];

        /*This block of code classifies the offers per applicable one-way flight and slice. */

        for (let s = 0; s < this.slicesOrigin.length; s++) {
            this.slice = this.slicesOrigin[s];
            this.slice.offersPerSlice = [];

            for (let o = 0; o < this.lengthOffers; o++) {
                this.originDestinationsOffer = this.offersArray[o].originDestinations;
                for (let oo = 0; oo < this.originDestinationsOffer.length; oo++) {
                    if (this.originDestinationsOffer[oo].originDestinationId === this.originDestination.originDestinationId) {
                        this.applicableSlices = this.originDestinationsOffer[oo].applicableSlices;

                        for (let a = 0; a < this.applicableSlices.length; a++) {
                            if (this.applicableSlices[a].sliceId === this.slice.sliceId && this.originDestination.originDestinationId === this.originDestinationsOffer[oo].originDestinationId) {
                                this.slice.offersPerSlice.push({
                                    detail: this.originDestinationsOffer[oo],
                                    offer: this.offersArray[o]
                                });
                            }
                        }
                    }
                }
            }

            this.groupCabins = this.getGroupCabins(this.slice);
            this.originDestination.slices.push(this.groupCabins);

        }

        /*This block of code adds the type of cabin not available, where no offers have been found. */
        this.bestOfferOfSlices = {
            slice: [],
            cabinType: [],
            bestprice: []
        };
        this.originDestination.slices.forEach((slice, i) => {
            this.modelTransform.fareFamilyConditions.forEach((fareFamily) => {
                if (!slice.cabins[fareFamily.cabinType]) {
                    slice.cabins[fareFamily.cabinType] = {
                        cabinAvailable: false,
                        cabinDescription: fareFamily.cabinDescription
                    };
                } else {
                    if (this.bestOfferOfSlices.slice.length === 0) {
                        this.bestOfferOfSlices.slice.push(i);
                        this.bestOfferOfSlices.cabinType.push(fareFamily.cabinType);
                        this.bestOfferOfSlices.bestprice.push(slice.cabins[fareFamily.cabinType].bestPrice);
                    } else {
                        if (slice.cabins[fareFamily.cabinType].bestPrice < this.bestOfferOfSlices.bestprice[0]) {
                            this.bestOfferOfSlices = {
                                slice: [],
                                cabinType: [],
                                bestprice: []
                            };
                            this.bestOfferOfSlices.slice.push(i);
                            this.bestOfferOfSlices.cabinType.push(fareFamily.cabinType);
                            this.bestOfferOfSlices.bestprice.push(slice.cabins[fareFamily.cabinType].bestPrice);
                        } else if (slice.cabins[fareFamily.cabinType].bestPrice === this.bestOfferOfSlices.bestprice[0]) {
                            this.bestOfferOfSlices.slice.push(i);
                            this.bestOfferOfSlices.cabinType.push(fareFamily.cabinType);
                            this.bestOfferOfSlices.bestprice.push(slice.cabins[fareFamily.cabinType].bestPrice);
                        }
                    }
                }
            });
        });

        for (let j = 0; j < this.bestOfferOfSlices.slice.length; j++) {
            this.originDestination.slices[this.bestOfferOfSlices.slice[j]].cabins[this.bestOfferOfSlices.cabinType[j]].best = true;
        }



        if (modeFlight === 0) {
            if (data.originDestinations.length > 1) {
                this.modelTransform.originDestinations.push(this.originDestination);
                this.modelTransform.originDestinations.push(data.originDestinations[1]);
            } else {
                this.modelTransform.originDestinations.push(this.originDestination);
            }
        } else {
            this.modelTransform.originDestinations.push(data.originDestinations[0]);
            this.modelTransform.originDestinations.push(this.originDestination);
        }

        return this.modelTransform;
    }

    /**
     * This function receives a slice (flight schedule) and modifies it by adding the cabin types and
     * fare families.
     * @param {Object} slice Input slice (flight schedule).
     * @returns The modified entry slice.
     */
    getGroupCabins = (slice) => {
        slice.cabins = {};
        slice.offersPerSlice.forEach(this.iteratorOffers);

        /*This code block gets the best cabin per slice, obtaining the best price, description, etc.*/

        Object.keys(slice.cabins).forEach((typeCabine) => {
            let bestForCabine;
            if (this.flightsLength === 2 && (this.auxModeFlight === 'outbound' || this.auxModeFlight === 'return')) {
                bestForCabine = slice.cabins[typeCabine].fareFamilies[0];
                slice.cabins[typeCabine].fareFamilies.forEach((farestype) => {
                    if (farestype.offers[0].originDestinations[0].perPassengerPrice.total + farestype.offers[0].originDestinations[1].perPassengerPrice.total <
                        bestForCabine.offers[0].originDestinations[0]?.perPassengerPrice.total + bestForCabine.offers[0].originDestinations[1].perPassengerPrice.total) {
                        bestForCabine = farestype;
                    }
                });
                slice.cabins[typeCabine].bestPrice = bestForCabine.offers[0].originDestinations[0]?.perPassengerPrice.total + bestForCabine.offers[0].originDestinations[1].perPassengerPrice.total;
            } else {
                bestForCabine = slice.cabins[typeCabine].fareFamilies[0];
                slice.cabins[typeCabine].fareFamilies.forEach((farestype) => {
                    if (farestype.offers[0]?.originDestinations[0].perPassengerPrice.total < bestForCabine.offers[0]?.originDestinations[0].perPassengerPrice.total) {
                        bestForCabine = farestype;
                    }
                });
                slice.cabins[typeCabine].bestPrice = bestForCabine.offers[0]?.originDestinations[0]?.perPassengerPrice.total;
            }
            slice.cabins[typeCabine].bestOffer = bestForCabine.offers[0];
            slice.cabins[typeCabine].cabinDescription = bestForCabine.cabinDescription;
            slice.cabins[typeCabine].cabinAvailable = true;
            slice.cabins[typeCabine].bestPriceShown = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.modelTransform.contextMetadata.currencies[0]), slice.cabins[typeCabine].bestPrice < 0 ? Math.round(slice.cabins[typeCabine].bestPrice) : Math.ceil(slice.cabins[typeCabine].bestPrice), false);
        });

        return slice;
    }

    private iteratorOffers = (currentOffer, index, arr) => {
        let appliSlicesL;
        for (let f = 0; f < this.lengthFareFamilyConditions; f++) {
            appliSlicesL = currentOffer.detail.applicableSlices.length;
            for (let off = 0; off < appliSlicesL; off++) {
                this.iteratorApplicableSlices(currentOffer.detail.applicableSlices[off], this.slice);
            }
        }
    }

    /**
     * This function for each offer of a slice, generates if there is no
     * already in the slice the information of the cabin and fare type.
     * @param {Object} currentApplicableSlices Input ApplicableSlices of urrent offer.
     * @param {Object} slice Input Slice where cabins and fares will be added..
     *
     */
    iteratorApplicableSlices = (currentApplicableSlices, slice) => {
        this.segment = currentApplicableSlices.segments[0];
        this.infoFareFamily = Object.assign({}, this.getInfoFareFamily(this.segment));
        this.cabinType = this.infoFareFamily.cabinType;

        if (!slice.cabins[this.cabinType]) {
            slice.cabins[this.cabinType] = {};
            if (!slice.cabins[this.cabinType].fareFamilies) {
                slice.cabins[this.cabinType].fareFamilies = [];
                slice.cabins[this.cabinType].bestPrice = '';
                slice.cabins[this.cabinType].bestPriceShown = '';
                slice.cabins[this.cabinType].cabinDescription = '';
                slice.cabins[this.cabinType].cabinAvailable = '';
                slice.cabins[this.cabinType].isCabinCompatible = '';
                slice.cabins[this.cabinType].bestCabinsPrice = '';
            }
        }

        if (!this.existFareFamily(slice.cabins[this.cabinType].fareFamilies, this.infoFareFamily.commercialCode)) {
            this.infoFareFamily.offers = this.getOffersBySliceFare(slice.offersPerSlice, this.infoFareFamily.commercialCode);
            if (this.flightsLength === 2 && (this.auxModeFlight === 'outbound' || this.auxModeFlight === 'return')) {
                this.infoFareFamily.offers = this.infoFareFamily.offers.sort((a, b) => {
                    a = a.originDestinations[0].perPassengerPrice.total + a.originDestinations[1].perPassengerPrice.total;
                    b = b.originDestinations[0].perPassengerPrice.total + b.originDestinations[1].perPassengerPrice.total;
                    return a - b;
                });
                this.infoFareFamily.bestPrice = this.infoFareFamily.offers[0].originDestinations[0].perPassengerPrice.total + this.infoFareFamily.offers[0].originDestinations[1].perPassengerPrice.total;
            } else {
                this.infoFareFamily.offers = this.infoFareFamily.offers.sort((a, b) => {
                    a = a.originDestinations[0].perPassengerPrice.total;
                    b = b.originDestinations[0].perPassengerPrice.total;
                    return a - b;
                });
                this.infoFareFamily.bestPrice = this.infoFareFamily.offers[0]?.originDestinations[0].perPassengerPrice.total;
            }

            this.infoFareFamily.remainingSeats = this.segment.remainingSeats;
            this.infoFareFamily.bestPriceShown = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.modelTransform.contextMetadata.currencies[0]), this.infoFareFamily.bestPrice < 0 ? Math.round(this.infoFareFamily.bestPrice) : Math.ceil(this.infoFareFamily.bestPrice), false);
            slice.cabins[this.cabinType].fareFamilies.push(this.infoFareFamily);

        }
    }

    /**
     * This function verifies if a fare type exists in a given fare set.
     * @param {Array{Object}} Fares Input fare set.
     * @param {String} code  Input Fare code to search in the fare set.
     * @returns A Boolean value.
     */
    existFareFamily = (Fares, code) => {
        const flength = Fares.length;
        let ind = 0;
        let found = false;
        while (found === false && ind < flength) {
            if (Fares[ind].commercialCode === code) {
                found = true;
                this.indexFare = ind;
            }
            ind++;
        }
        return found;
    }

    /**
     * This function returns offers that belongs to a fare type of a set
     * of offers for a given slice (flight schedule).
     * @param {Array{Object}} offersPerSlice Input Set of offers for a slice.
     * @param {Object} fareFamily Input Fare type by which to search for offers.
     * @returns A set of offers with the same type of fare family.
     */
    getOffersBySliceFare = (offersPerSlice, fareFamily) => {
        let segment;
        const offers = [];
        for (let o = 0; o < offersPerSlice.length; o++) {
            this.originDestinationsOffer = offersPerSlice[o].detail;
            this.applicableSlices = this.originDestinationsOffer.applicableSlices;
            for (let a = 0; a < this.applicableSlices.length; a++) {
                segment = this.applicableSlices[a].segments[0];
                if (segment.fareFamily === fareFamily) {
                    if (offersPerSlice[o].offer.offerType === 'RESHOP' || offersPerSlice[o].offer.offerType === 'UNIFIED') {
                        offers.push(offersPerSlice[o].offer);
                    }
                }
            }

        }
        return offers;
    }

    /**
     * This function returns a specific fare type from the set of all possible fares.
     * @param {Object} segment Part of the slice that contains the rate family type.
     * @returns A type of fare family.
     */
    getInfoFareFamily = (segment) => {
        let index;
        this.fareFamilyConditionsArray.some((fareFamily, i) => {
            if (fareFamily.commercialCode === segment.fareFamily) {
                index = i;
                return true;
            }
        });
        return this.fareFamilyConditionsArray[index];
    }

    /**
     * This function builds the data model necessary to make the request to the service
     * that searches the list of offers for voluntary flight changes.
     * @param {Object} data Data set of where the flight information is obtained.
     * @returns The object necessary to make the request to the service.
     */
    searchFlights = (data, modeFlight) => {
        let i;
        let flights: any = { slices: [], flowId: this.localStorageService.get('flowId') };
        let date;
        let flightsOrdered = [];
        let slicesId = [];

        if (this.localStorageService.get('bookingInfo') && this.localStorageService.get('bookingInfo').contextMetadata) {
            flights.marketCode = this.localStorageService.get('bookingInfo').contextMetadata.country;
        }

        for (i in data.flights) {
            flightsOrdered.push(data.flights[i]);
            slicesId.push(i);
        }

        switch (modeFlight) {
                case 'twice':
                    flights.slices = this.getFlightsSliceInfo(null, flightsOrdered, slicesId);
                    break;
                case 'outbound':
                    flights.slices = this.getFlightsSliceInfo(0, flightsOrdered, slicesId);
                    break;
                case 'return':
                    flights.slices = this.getFlightsSliceInfo(1, flightsOrdered, slicesId);
                    break;
        }
        this.localStorageService.set('changeFlightsCV', flights.slices);

        return flights;
    }

    private getFlightsSliceInfo = (index, flightsOrdered, slicesId) => {
        let slices = [], date = null, auxIndex = 0, dateCheck;
        if (index === null) {
            flightsOrdered.forEach((element) => {
                date = element.parseNewDateSelected;
                if (date) {
                    dateCheck = this.MmBUtilService.getDateFormatted(date.day, date.month, date.year);
                }
                slices.push({
                    origin: element.departureCity.city.code,
                    destination: element.arrivalCity.city.code,
                    date: dateCheck,
                    originalSliceId: slicesId[auxIndex]
                });
                auxIndex++;
            });
        } else {
            date = flightsOrdered[index].parseNewDateSelected ? flightsOrdered[index].parseNewDateSelected : flightsOrdered[index].parseNewDate;
            slices.push({
                origin: flightsOrdered[index].departureCity.city.code,
                destination: flightsOrdered[index].arrivalCity.city.code,
                date: this.MmBUtilService.getDateFormatted(date.day, date.month, date.year),
                originalSliceId: slicesId[index]
            });
        }
        return slices;
    }

    /**
     * This function builds from a selected offer on the outbound flight offers,
     * the data model necessary to show compatible return flight offers.
     * @param {Object} offer Selected offer on the outbound flight.
     * @returns The data model with offers for return flights.
     */
    getDataAvailabilityTransformedReturns = (offer) => {


        const offersOutbound = [];
        const originDestinationReturn = this.originDestinationsArray[1];
        let existOffer = false;

        /*This block of code obtains the list of offer belonging to the same flight, same slice and same type of rate.*/

        this.offersArray.forEach((off) => {
            off.originDestinations[0].applicableSlices.forEach((sliceoff) => {
                offer.originDestinations[0].applicableSlices.forEach((sliceOffer) => {
                    if (sliceoff.sliceId === sliceOffer.sliceId) {
                        existOffer = false;
                        sliceoff.segments.forEach((segmentoff) => {
                            sliceOffer.segments.forEach((segmentOffer) => {
                                if (segmentoff.fareFamily === segmentOffer.fareFamily && segmentoff.segmentId === segmentOffer.segmentId) {
                                    if ((off.offerType === 'RESHOP' || off.offerType === 'UNIFIED') && !existOffer) {
                                        offersOutbound.push(off);
                                        existOffer = true;
                                    }
                                }
                            });
                        });
                    }
                });
            });
        });

        /*This block of code generates the cabins for each slice of return flights with compatible offers.*/

        originDestinationReturn.slices.forEach((slice) => {
            slice.cabins = {};
            offersOutbound.forEach((offer) => {
                offer.originDestinations[1].applicableSlices.forEach((offerslice) => {
                    if (slice.sliceId === offerslice.sliceId) {
                        this.segment = offerslice.segments[0];
                        this.infoFareFamily = Object.assign({}, this.getInfoFareFamily(this.segment));
                        this.cabinType = this.infoFareFamily.cabinType;

                        if (!slice.cabins[this.cabinType]) {
                            slice.cabins[this.cabinType] = {};
                            if (!slice.cabins[this.cabinType].fareFamilies) {
                                slice.cabins[this.cabinType].fareFamilies = [];
                                slice.cabins[this.cabinType].bestPrice = '';
                                slice.cabins[this.cabinType].bestPriceShown = '';
                                slice.cabins[this.cabinType].cabinDescription = '';
                                slice.cabins[this.cabinType].cabinAvailable = '';
                                slice.cabins[this.cabinType].isCabinCompatible = '';
                                slice.cabins[this.cabinType].bestCabinsPrice = '';
                            }
                        }

                        this.indexFare = null;
                        if (!this.existFareFamily(slice.cabins[this.cabinType].fareFamilies, this.infoFareFamily.commercialCode)) {
                            if (!this.infoFareFamily.offers) {
                                this.infoFareFamily.offers = [];
                            }
                            this.infoFareFamily.offers.push(offer);
                            this.infoFareFamily.offers = this.infoFareFamily.offers.sort((a, b) => {
                                a = a.originDestinations[1].perPassengerPrice.total;
                                b = b.originDestinations[1].perPassengerPrice.total;
                                return a - b;
                            });
                            this.infoFareFamily.remainingSeats = this.segment.remainingSeats;
                            this.infoFareFamily.bestPrice = this.infoFareFamily.offers[0].originDestinations[1].perPassengerPrice.total;
                            this.infoFareFamily.bestPriceShown = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.modelTransform.contextMetadata.currencies[0]), this.infoFareFamily.bestPrice < 0 ? Math.round(this.infoFareFamily.bestPrice) : Math.ceil(this.infoFareFamily.bestPrice), false);
                            slice.cabins[this.cabinType].fareFamilies.push(this.infoFareFamily);
                        } else {
                            slice.cabins[this.cabinType].fareFamilies[this.indexFare].offers.push(offer);
                            slice.cabins[this.cabinType].fareFamilies[this.indexFare].offers = slice.cabins[this.cabinType].fareFamilies[this.indexFare].offers.sort((a, b) => {
                                a = a.originDestinations[1].perPassengerPrice.total;
                                b = b.originDestinations[1].perPassengerPrice.total;
                                return a - b;
                            });
                            slice.cabins[this.cabinType].fareFamilies[this.indexFare].remainingSeats = this.segment.remainingSeats;
                            slice.cabins[this.cabinType].fareFamilies[this.indexFare].bestPrice = slice.cabins[this.cabinType].fareFamilies[this.indexFare].offers[0].originDestinations[1].perPassengerPrice.total;
                            slice.cabins[this.cabinType].fareFamilies[this.indexFare].bestPriceShown = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.modelTransform.contextMetadata.currencies[0]), this.infoFareFamily.bestPrice < 0 ? Math.round(this.infoFareFamily.bestPrice) : Math.ceil(this.infoFareFamily.bestPrice), false);
                        }
                    }
                });
            });

            Object.keys(slice.cabins).forEach((typeCabine) => {
                let bestForCabine = slice.cabins[typeCabine].fareFamilies[0];
                slice.cabins[typeCabine].fareFamilies.forEach((farestype) => {
                    if (farestype.offers[0].originDestinations[1].perPassengerPrice.total < bestForCabine.offers[0].originDestinations[1].perPassengerPrice.total) {
                        bestForCabine = farestype;
                    }
                });
                slice.cabins[typeCabine].bestPrice = bestForCabine.offers[0].originDestinations[1].perPassengerPrice.total;
                slice.cabins[typeCabine].cabinDescription = bestForCabine.cabinDescription;
                slice.cabins[typeCabine].cabinAvailable = true;
                slice.cabins[typeCabine].bestPriceShown = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.modelTransform.contextMetadata.currencies[0]), slice.cabins[typeCabine].bestPrice < 0 ? Math.round(slice.cabins[typeCabine].bestPrice) : Math.ceil(slice.cabins[typeCabine].bestPrice), false);
            });
        });

        /*This block of code adds the type of cabin not available, where no offers have been found. */
        this.bestOfferOfSlices = {
            slice: [],
            cabinType: [],
            bestprice: []
        };
        originDestinationReturn.slices.forEach((slice, i) => {
            this.modelTransform.fareFamilyConditions.forEach((fareFamily) => {
                if (!slice.cabins[fareFamily.cabinType]) {
                    slice.cabins[fareFamily.cabinType] = {
                        cabinAvailable: false,
                        cabinDescription: fareFamily.cabinDescription
                    };
                } else {
                    if (this.bestOfferOfSlices.slice.length === 0) {
                        this.bestOfferOfSlices.slice.push(i);
                        this.bestOfferOfSlices.cabinType.push(fareFamily.cabinType);
                        this.bestOfferOfSlices.bestprice.push(slice.cabins[fareFamily.cabinType].bestPrice);
                    } else {
                        if (slice.cabins[fareFamily.cabinType].bestPrice < this.bestOfferOfSlices.bestprice[0]) {
                            this.bestOfferOfSlices = {
                                slice: [],
                                cabinType: [],
                                bestprice: []
                            };
                            this.bestOfferOfSlices.slice.push(i);
                            this.bestOfferOfSlices.cabinType.push(fareFamily.cabinType);
                            this.bestOfferOfSlices.bestprice.push(slice.cabins[fareFamily.cabinType].bestPrice);
                        } else if (slice.cabins[fareFamily.cabinType].bestPrice === this.bestOfferOfSlices.bestprice[0]) {
                            this.bestOfferOfSlices.slice.push(i);
                            this.bestOfferOfSlices.cabinType.push(fareFamily.cabinType);
                            this.bestOfferOfSlices.bestprice.push(slice.cabins[fareFamily.cabinType].bestPrice);
                        }
                    }
                }
            });
        });


        for (let j = 0; j < this.bestOfferOfSlices.slice.length; j++) {
            originDestinationReturn.slices[this.bestOfferOfSlices.slice[j]].cabins[this.bestOfferOfSlices.cabinType[j]].best = true;
        }
        this.modelTransform.originDestinations.pop();
        this.modelTransform.originDestinations.push(originDestinationReturn);

        return this.modelTransform;
    }

    generateFlightsModelRibbon = (model, flights) => {
        var index, o, oo, j, k, z, l, minDates, maxDates, diffDays, nextDate, dateSelected, ribbonDates, slidesLenght,
            slide: any = {}, daysAvailables = [], calendar: any = {}, allCalendars = [], transformedRibbonDates: any = {}, limitDates = { minDate: null, maxDate: null};
        var newModel = angular.copy(model);
        var flightsOrdered = [];
        var ribbonO = [];
        var ribbonR = [];
        var tmpDate;
        var minIndex = -3;
        var maxIndex = 4;
        var changeFlightsCV = this.localStorageService.get('changeFlightsCV');
        var first = true, firstFlight = null;

        angular.forEach(flights, function (flight) {
            flightsOrdered.push(flight);
        });


        if (flightsOrdered.length > 1) {
            flightsOrdered.sort((a: any, b: any) => {
                const date1: any = new Date(a.changeNewDate);
                const date2: any = new Date(b.changeNewDate);
                return date1 - date2;
            });
            for (l = minIndex; l < maxIndex; l++) {

                tmpDate = new Date(flightsOrdered[0].newDateSelected ? flightsOrdered[0].newDateSelected : flightsOrdered[0].parseNewDate);
                ribbonO.push({ available: true, boundDate: this.$filter('date')(angular.copy(tmpDate).setDate(tmpDate.getDate() + l), 'yyyy-MM-dd') });
                tmpDate = new Date(flightsOrdered[1].newDateSelected ? flightsOrdered[1].newDateSelected : flightsOrdered[1].parseNewDate);
                ribbonR.push({ available: true, boundDate: this.$filter('date')(angular.copy(tmpDate).setDate(tmpDate.getDate() + l), 'yyyy-MM-dd') });
            }
            ribbonDates = [ribbonO, ribbonR];
        } else {
            for (l = minIndex; l < maxIndex; l++) {
                tmpDate = new Date(flightsOrdered[0].newDateSelected ? flightsOrdered[0].newDateSelected : flightsOrdered[0].parseNewDate);
                ribbonO.push({ available: true, boundDate: this.$filter('date')(angular.copy(tmpDate).setDate(tmpDate.getDate() + l), 'yyyy-MM-dd') });
            }
            ribbonDates = [ribbonO];
        }


        for (k = 0; k < ribbonDates.length; k++) {
            for (z = 0; z < ribbonDates[k].length; z++) {
                transformedRibbonDates.date = angular.copy(ribbonDates[k][z].boundDate);
                transformedRibbonDates.available = angular.copy(ribbonDates[k][z].available);
                ribbonDates[k][z] = angular.copy(transformedRibbonDates);
            }
        }

        for (index = 0; index < newModel.length; index++) {

            calendar.arrIndex = index;
            calendar.index = newModel[index].originDestinationId;
            calendar.calendarData = {};

            flightsOrdered.forEach((flight, indexFlight) => {
                if(indexFlight === 0) {
                    first = true;
                    firstFlight = flight;
                } else {
                    first = false;
                }
                if (flight.departureCity.city.code === newModel[index].origin &&
                    flight.arrivalCity.city.code === newModel[index].destination) {

                    for (let i = 0; i < changeFlightsCV.length; i++) {
                        const ckeckflight = changeFlightsCV[i];
                        if(first) {
                            if(flight.segments[0].sliceId === ckeckflight.originalSliceId) {
                                limitDates.minDate = this.$filter('date')(new Date(), 'yyyy-MM-dd');
                            } else {
                                limitDates.maxDate = ckeckflight.date;
                            }
                        } else {
                            if(flight.segments[0].sliceId !== ckeckflight.originalSliceId) {
                                limitDates.minDate = ckeckflight.date;
                            }
                        }
                    }

                    dateSelected = this.generateDateSelected(flight);
                    newModel[index].minDate = (limitDates.minDate === null) ? dayjs(flight.dateOptions.minDate).startOf('day') : dayjs(limitDates.minDate).startOf('day');
                    newModel[index].maxDate = (limitDates.maxDate === null) ? dayjs(flight.dateOptions.maxDate).startOf('day') : dayjs(limitDates.maxDate).startOf('day');
                    calendar.calendarData.minDate = new Date(newModel[index].minDate);
                    calendar.calendarData.maxDate = new Date(newModel[index].maxDate);
                    calendar.checked = flight.checked;
                }
            });

            minDates = angular.copy(newModel[index].minDate);
            maxDates = angular.copy(newModel[index].maxDate);

            if(firstFlight.departureCity.code === newModel[index].origin && firstFlight.arrivalCity.code === newModel[index].destination) {
                diffDays = Math.abs(minDates.diff(maxDates, 'day', true));
            } else {
                diffDays = Math.abs(minDates.diff(dayjs().add(360, 'day'), 'day', true));
            }

            minDates = minDates.add(-3, 'day');

            for (o = 0; o <= diffDays + 7; o++) {
                if (o !== 0) {
                    minDates = minDates.add(1, 'day');
                    nextDate = minDates;
                } else {
                    nextDate = minDates;
                }

                slide.serviceDate = this.MmBUtilService.getDateFormatted(nextDate.date(), nextDate.month() + 1, nextDate.year());
                slide.slidePosition = angular.copy(o);
                slide.date = this.$filter('DateFormatFilter')(slide.serviceDate);
                if (o < 3 || o > diffDays + 3) {
                    slide.state = this.VoluntaryChangesConstants.SLICK_STATUS.DISABLED;
                } else {
                    slide.state = this.VoluntaryChangesConstants.SLICK_STATUS.LOADING;
                }
                daysAvailables.push(angular.copy(slide));
            }

            for (oo = 0; oo < daysAvailables.length; oo++) {
                if (dateSelected === daysAvailables[oo].serviceDate) {
                    calendar.calendarData.selectedSlide = daysAvailables[oo].slidePosition;
                    calendar.calendarData.currentInitialSlide = daysAvailables[oo].slidePosition;
                    calendar.initialSlideIndex = daysAvailables[oo].slidePosition - 3;
                }
            }

            calendar.calendarData.currentSlides = daysAvailables.slice(calendar.initialSlideIndex, calendar.calendarData.selectedSlide + 4);

            if (ribbonDates[index]) {
                for (j = 0; j < ribbonDates[index].length; j++) {
                    if (ribbonDates[index][j].available && calendar.calendarData.currentSlides.length > 0 && calendar.calendarData.currentSlides[j].state !== this.VoluntaryChangesConstants.SLICK_STATUS.DISABLED) {
                        calendar.calendarData.currentSlides[j].state = this.VoluntaryChangesConstants.SLICK_STATUS.AVAILABLE;
                    } else if (calendar.calendarData.currentSlides.length > 0 && calendar.calendarData.currentSlides[j].state !== this.VoluntaryChangesConstants.SLICK_STATUS.DISABLED) {
                        calendar.calendarData.currentSlides[j].state = this.VoluntaryChangesConstants.SLICK_STATUS.NOT_AVAILABLE;
                    } else if (calendar.calendarData.currentSlides.length > 0) {
                        calendar.calendarData.currentSlides[j].state = this.VoluntaryChangesConstants.SLICK_STATUS.DISABLED;
                    }
                }
            }

            calendar.calendarData.slides = daysAvailables;
            daysAvailables = [];
            slidesLenght = calendar.calendarData.slides.length - 1;
            calendar.calendarData.slides[0].firstItem = true;
            calendar.calendarData.slides[slidesLenght].lastItem = true;
            if (calendar.checked) {
                allCalendars.push(calendar);
            }
            calendar = {};
        }

        return allCalendars;

    }

    generateDateSelected = (flight) => {
        var dateFormated, newDateAux = new Date();
        if (flight.daysToGo <= 0) {
            dateFormated = this.MmBUtilService.getDateFormatted(newDateAux.getDate(), newDateAux.getMonth() + 1, newDateAux.getFullYear());
        } else if (flight.parseNewDateSelected) {
            dateFormated = this.MmBUtilService.getDateFormatted(flight.parseNewDateSelected.day, flight.parseNewDateSelected.month, flight.parseNewDateSelected.year);
        } else {
            dateFormated = this.MmBUtilService.getDateFormatted(flight.departureDateParsed.day, flight.departureDateParsed.monthNumber, flight.departureDateParsed.year);
        }
        return dateFormated;
    }

    /**
     * Generate the ribbon data that service needed to build the ribbon calendar
     * @param {Object} model all fligths model
     * @param {Object} passengers current passenger model
     * @returns {Object} parsed data to call ribbon service
     */
    generateRibbonData = (model, passengers, date) => {
        const data: any = {};
        data.marketCode = this.MmBAppConstants.market;
        data.passengers = this.passengersTranformer(passengers);
        data.slices = this.slicesSelected(model, date);

        return data;
    }

    slicesSelected = (flights, date) => {
        let slices = [], id;
        for (id in flights) {
            if (flights[id].checked) {
                slices.push({
                    date: date ? date : this.generateDateSelected(flights[id]),
                    daysAfter: this.VoluntaryChangesConstants.daysAfter,
                    daysBefore: this.VoluntaryChangesConstants.daysBefore,
                    destination: flights[id].arrivalCity.code,
                    origin: flights[id].departureCity.code
                });
            }
        }
        return slices;
    }

    passengersTranformer = (passengersModel) => {
        let passengers = [], index;
        for (index = 0; index < passengersModel.length; index++) {
            passengers.push({
                passengerType: passengersModel[index].passengerType,
                count: passengersModel.length
            });
        }
        return passengers;
    }

    generateRibbonCalendarData = (calendarData) => {
        let transformedData = [], i, j, aux1: any = [], aux2: any = {};
        const data = [calendarData.calendarRibbon.outBoundRow, calendarData.calendarRibbon.inBoundRow];

        for (i = 0; i < data.length; i++) {
            if (data[i]) {
                for (j = 0; j < data[i].cells.length; j++) {
                    aux2.date = data[i].cells[j].boundDate;
                    aux2.day = dayjs(data[i].cells[j].boundDate).date();
                    aux2.weekDay = this.VoluntaryChangesConstants.WEEKDAYS[dayjs(data[i].cells[j].boundDate).day()];
                    aux2.available = data[i].cells[j].available;
                    aux2.selected = data[i].cells[j].selectedDate;
                    aux2.limited = true;
                    aux2.month = {
                        month: this.VoluntaryChangesConstants.MONTHS[dayjs(data[i].cells[j].boundDate).month()],
                        shortMonth: new Date(data[i].cells[j].boundDate).toLocaleString(this.MmBAppConstants.lang, { month: 'short' }).toLowerCase().substr(0, 3)
                    };
                    aux1.push(angular.copy(aux2));
                }
                transformedData.push(angular.copy(aux1));
                aux1 = [];
            }
        }
        return transformedData;
    }

    changeFlightsData = (index, selectedSlide, flights, originDestinations, flightMode) => {
        let key, i;
        if(selectedSlide) {
            for (i = 0; i < originDestinations.length; i++) {
                for (key in flights) {
                    if (flights[key].departureCity.city.code === originDestinations[i].origin &&
                        flights[key].arrivalCity.city.code === originDestinations[i].destination) {
                        if (index === originDestinations[i].originDestinationId) {
                            flights[key].parseNewDateSelected = {
                                day: selectedSlide.date.day,
                                month: selectedSlide.date.monthNumber || selectedSlide.date.month,
                                year: selectedSlide.date.year
                            };
                            flights[key].changeNewDate = new Date(selectedSlide.serviceDate);
                        }
                    }
                    //condition added when is voluntary change on return mode to set correctly date when ribbon changes involuntary to voluntary
                    const unifiedOfferType = this.localStorageService.get('unifiedOfferType');
                    if(flightMode === 'return' && this.localStorageService.get('isUnifiedFlow') && unifiedOfferType === 'VOLUNTARY_CHANGE'){
                        flights[key].changeNewDate = new Date(selectedSlide.serviceDate);
                        flights[key].parseNewDateSelected = {
                            day: selectedSlide.date.day,
                            month: selectedSlide.date.monthNumber || selectedSlide.date.month,
                            year: selectedSlide.date.year
                        };
                    }
                }
            }
        }
        return flights;
    }

    getFlightsLength = () => {
        return this.flightsLength;
    }
}