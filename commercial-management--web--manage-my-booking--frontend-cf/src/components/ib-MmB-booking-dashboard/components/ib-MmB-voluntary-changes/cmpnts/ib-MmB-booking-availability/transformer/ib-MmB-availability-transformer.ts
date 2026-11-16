import angular from "angular";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBUtilService } from "@src/components/services/Utils/ib-MmB-utils";
import { MmBUtilsSharedService } from "@src/components/services/Utils/ib-MmB-utils-shared-service";

@Service(
    'ib-MmB-booking-availability-module',
    ['MmBUtilService', '$filter', 'localStorageService', 'MmBAppConstants', 'MmBUtilsSharedService'],
    [])
export class AvailabilityTransformer {

    constructor(
        private MmBUtilService: MmBUtilService,
        private $filter,
        private localStorageService,
        private MmBAppConstants,
        private MmBUtilsSharedService: MmBUtilsSharedService) {}

    availabilityModelTransformer = [];
    datalayerObject = {};

    resetData = (type) => {
        if (type === 'all') {
            this.availabilityModelTransformer = [];
        } else {
            if (this.availabilityModelTransformer[1]) {
                this.availabilityModelTransformer.pop();
            }
        }
    }

    getElementsOfDataLayer = () => {
        var elementsDataLayer = [];
        Object.keys(this.datalayerObject).forEach((element) => {
            if (element.toString() !== 'EstadoUsuario') {
                elementsDataLayer.push(element.toString());
            }
        });
        return elementsDataLayer;
    }

    /**
     * Transforms the model received from the parent component to define the models
     * that will be sent to the child components.
     * @param {Object} model Input model of parent component.
     * @param {Object} index Index of outbound or return flight.
     * @returns {Object} Output model transformed.
     */
    init = (model, index, sorted) => {
        var i;
        var arrModelSlice = [];
        var slices = model.originDestinations[index].slices;
        var unifiedOptinalData = this.localStorageService.get('unifiedOptionalData');
        if(this.localStorageService.get('isUnifiedFlow') && unifiedOptinalData && unifiedOptinalData.enabled ) {
            //slices = model.originDestinations.filter( slice => slice.originDestinationId === model.modelRibbon[0].index)[0].slices;
        }
        var modelSlice;
        var sortedByTime = sorted || false;

        if (model.modeFlight === 'return') {
            this.availabilityModelTransformer[0] = model;
        } else {
            this.availabilityModelTransformer[index] = model;
        }


        for (i = 0; i < slices.length; i++) {
            modelSlice = {};
            modelSlice.opereds = this.getSegments(slices[i].segments, slices[i].departureDateTime).opereds;
            modelSlice.origin = this.getSegments(slices[i].segments, slices[i].departureDateTime).arrFlight.origin;
            modelSlice.destination = this.getSegments(slices[i].segments, slices[i].departureDateTime).arrFlight.destination;
            modelSlice.info = this.getInfo(slices[i], modelSlice.opereds, modelSlice.origin, modelSlice.destination);
            modelSlice.segments = this.getSegments(slices[i].segments, slices[i].departureDateTime).arrSegment;
            modelSlice.cabins = this.getFareList(slices[i].cabins);
            modelSlice.slideId = slices[i].sliceId;
            arrModelSlice.push(modelSlice);
        }

        arrModelSlice.forEach((slice) => {
            if (this.existCabineAvailable(slice.cabins)) {
                slice.visibility = true;
            } else {
                slice.visibility = false;
            }
        });

        if (sortedByTime) {
            arrModelSlice = this.sortSlicesByTime(arrModelSlice);
        }

        return arrModelSlice;
    }

    sortSlicesByTime = (arrModelSlice) => {

        return arrModelSlice.sort((a, b) => {
            let arrayElementsA = a.info.departureTime.split(':');
            let arrayElementsB = b.info.departureTime.split(':');
            let datea: any = new Date();
            let dateb: any = new Date();
            datea.setHours(parseInt(arrayElementsA[0]), parseInt(arrayElementsA[1]));
            dateb.setHours(parseInt(arrayElementsB[0]), parseInt(arrayElementsB[1]));
            return datea - dateb;
        });
    }

    /**
     * Indicates if there is a cabin available in the group of cabins of a slice.
     * @param {Object} cabines Group of cabine of slice.
     * @returns {Boolean} True (Exist cabine available) or False (not exist).
     */
    existCabineAvailable = (cabines) => {
        var found = false;
        var numCabines = 0;
        cabines.forEach((cabin) => {
            if (cabin.disabled === false) {
                numCabines++;
            }
        });
        if (numCabines !== 0) {
            found = true;
        }
        return found;
    }

    /**
     * Order a slice collection based on a filter of hours, duration or price / cabin.
     * @param {Object} info type of filter.
     * @param {Object} slices Collection of slice.
     * @returns {Object} Collection of slice ordered.
     */
    getOrderSlices = (info, slices) => {

        var typeCabine = ['E', 'T', 'N', 'B'];
        var foundCabine, i, j, k, found;
        found = false;
        i = 0;

        switch (info.filterType) {
            case 'departureDateTime':
                slices.sort((a, b) => {
                    let arrayElementsA = a.info.departureTime.split(':');
                    let arrayElementsB = b.info.departureTime.split(':');
                    let dateA: any = new Date();
                    let dateB: any = new Date();
                    dateA.setHours(parseInt(arrayElementsA[0]), parseInt(arrayElementsA[1]));
                    dateB.setHours(parseInt(arrayElementsB[0]), parseInt(arrayElementsB[1]));
                    if (dateA.getHours() === dateB.getHours() && dateA.getMinutes() === dateB.getMinutes()) {
                        arrayElementsA = a.info.arrivalTime.split(':');
                        arrayElementsB = b.info.arrivalTime.split(':');
                        dateA = new Date();
                        dateB = new Date();
                        dateA.setHours(parseInt(arrayElementsA[0]), parseInt(arrayElementsA[1]));
                        dateB.setHours(parseInt(arrayElementsB[0]), parseInt(arrayElementsB[1]));
                    }
                    return dateA - dateB;
                });
                if (info.reverse) {
                    slices.reverse();
                }
                break;
            case 'duration':
                slices.sort((a, b) => {
                    return a.info.passedMinutes - b.info.passedMinutes;
                });
                if (info.reverse) {
                    slices.reverse();
                }
                break;
            case 'slicePrice':
                found = false;
                while (found === false && i < typeCabine.length) {
                    for (j = 0; j < slices.length; j++) {
                        for (k = 0; k < slices[j].cabins.length; k++) {
                            if (slices[j].cabins[k].cabinLetter === typeCabine[i]) {
                                foundCabine = typeCabine[i];
                                found = true;
                            }
                            if (found) break;
                        }
                        if (found) break;
                    }
                    if (!found) i++;
                }
                slices.sort((a, b) => {
                    var priceA;
                    var priceB;
                    a.cabins.forEach((element) => {
                        if (element.cabinLetter === foundCabine) {
                            if (element.priceNumber != null) {
                                priceA = element.priceNumber;
                            } else {
                                if (info.reverse) {
                                    priceA = -Number.MAX_VALUE;
                                } else {
                                    priceA = Number.MAX_VALUE;
                                }
                            }
                        }
                    });
                    b.cabins.forEach((element) => {
                        if (element.cabinLetter === foundCabine) {
                            if (element.priceNumber != null) {
                                priceB = element.priceNumber;
                            } else {
                                if (info.reverse) {
                                    priceB = -Number.MAX_VALUE;
                                } else {
                                    priceB = Number.MAX_VALUE;
                                }
                            }
                        }
                    });
                    return priceA - priceB;
                });
                if (info.reverse) {
                    slices.reverse();
                }
                break;
        }
        return slices;
    }

    /**
     * Get the data of the slice that will be shown in the ib-Mmb-flights-info component.
     * @param {Object} slice  the flight slice.
     * @returns {Object} info of a slice of a flight.
     */
    getInfo = (slice, numberOpereds, origin, destination) => {
        var firstSegment = slice.segments[0].flight.operationalDisclosure;
        return ({
            date: slice.departureDateTime.split(' ')[0].split('-').join(''),
            departureDate: slice.departureDateTime.split(' ')[0],
            departureTime: slice.departureDateTime.split(' ')[1],
            arrivalDate: slice.arrivalDateTime.split(' ')[0],
            arrivalTime: slice.arrivalDateTime.split(' ')[1],
            passedTime: slice.duration ? this.getHoursAndMinutes(slice.duration) : '',
            passedMinutes: slice.duration,
            stopsNumber: slice.stopsNumber > 0 ? slice.stopsNumber : '',
            scale: this.getDirectOrScale(slice),
            numberOpereds: numberOpereds,
            iconCompany: this.MmBUtilService.getCompanyLogo(firstSegment),
            origin: origin,
            destination: destination,
            cashAvios: slice.cashAvios
        });
    };

    /**
     * Get the data of a flight and we create an object with the necessary information to
     * paint the components ib-Mmb-flights-info and ib-Mmb-flights-details.
     * @param {Object} dataFlight flight data.
     * @returns {Object, Object} data of a slice of a flight, opered names.
     */
    getSegments = (segments, date) => {
        let op: number;
        var i, arrSegment = [],
            lengthOpereds = '+',
            opereds = [],
            currentName,
            arrFlight = {
                'origin': '',
                'destination': ''
            };

        for (i = 0; i < segments.length; i += 1) {
            arrSegment.push(this.getInfoSegment(segments[i], date));
            if (i === 0) {
                arrFlight.origin = segments[i].departure.code;
            }
            if (i + 1 === segments.length) {
                arrFlight.destination = segments[i].arrival.code;
            }
            currentName = arrSegment[i].opered;
            if (opereds.indexOf(currentName) === -1) {
                opereds.push(currentName);
            }
        }
        op = opereds.length - 1;
        opereds.length - 1 === 0 ? lengthOpereds = '' : lengthOpereds = lengthOpereds.concat(op.toString());
        return {
            arrSegment: arrSegment,
            opereds: lengthOpereds,
            arrFlight: arrFlight
        };
    }


    /**
     * Get the data of the segments that will be shown in the ib-Mmb-flights-details component.
     * @param {Object} segment the flight segment.
     */
    getInfoSegment = (segment, date) => {
        return ({
            departureDate: segment.departureDateTime.split(' ')[0],
            departureTime: segment.departureDateTime.split(' ')[1],
            arrivalDate: segment.arrivalDateTime.split(' ')[0],
            arrivalTime: segment.arrivalDateTime.split(' ')[1],
            passedTime: segment.duration,
            waitingTime: segment.waitingTime ? this.getDuration(segment.waitingTime) : null,
            departurePlace: segment.departure.city.description + ' ( ' + segment.departure.code + ' )',
            departurePlaceName: segment.departure.city.description,
            arrivalPlace: segment.arrival.city.description + ' ( ' + segment.arrival.code + ' )',
            arrivalPlaceName: segment.arrival.city.description,
            line: segment.flight.marketingCarrier.code + segment.flight.marketingFlightNumber,
            airplane: segment.flight.aircraft.description,
            opered: segment.flight.operationalCarrier.name,
            iconCompany: this.MmBUtilService.getCompanyLogo(segment.flight.operationalDisclosure),
            stop: {
                'isStop': segment.stop,
                'place': segment.stop ? segment.stop.city.description : '',
                'time': segment.stop ? this.getHoursAndMinutes(segment.stop.duration) : ''
            },
            dateDeparture: date.split(' ')[0]
        });
    }

    /**
     * Transform the total minutes of the flight in hours and minutes.
     * @param {*string} minutes total minutes of the flight.
     * @returns {*string} hours and minutes of the flight.
     */
    getHoursAndMinutes = (minutes) => {
        var timeString;
        var Allminutes = minutes;
        var horas = 0;
        while (Allminutes >= 60) {
            Allminutes -= 60;
            horas += 1;
        }
        if (!horas) {
            timeString = minutes + 'min';
        } else if (Allminutes === 0) {
            timeString = horas + 'h';
        } else {
            timeString = horas + 'h ' + Allminutes + 'min';
        }
        return timeString;
    }

    /**
     * Transform the total minutes of the flight in hours and minutes.
     * @param {*string} minutes total minutes of the flight.
     * @returns {*string} hours and minutes of the flight.
     */
    getDirectOrScale = (data) => {
        var timeString;
        if (data.stopsNumber === 0) {
            timeString = 'MMB_VC_YOUR_FLIGHTS_DIRECT_TEXT';
        } else if (data.stopsNumber === 1) {
            timeString = 'MMB_VC_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT';
        } else {
            timeString = 'MMB_VC_YOUR_FLIGHTS_SCALE_PLURAL_TEXT';
        }
        return timeString;
    }

    /**
     * Transform the input model into a new model that will use the
     * fare-item component.
     * @param {Object} fareFamilies Input model.
     * @returns {Object} Output model transformed.
     */
    getModelListFareFamilies = (fareFamilies) => {
        var modelreturn = [];
        var objModel: any = {};

        fareFamilies.forEach((key, index, array) => {
            objModel = {};
            objModel.id = key.commercialCode + index;
            objModel.name = key.commercialName;
            objModel.seats = key.remainingSeats;
            objModel.price = key.bestPrice;
            objModel.priceShown = key.bestPriceShown;
            objModel.fareFamilyConditions = key.conditions;
            objModel.originalData = angular.copy(key);
            objModel.offers = key.offers;
            // if(objModel.seats > 0) {
            //     modelreturn.push(objModel);
            // }
            modelreturn.push(objModel);
        });

        modelreturn = modelreturn.sort((a, b) => {
            a = a.price;
            b = b.price;
            return a - b;
        });

        return modelreturn;
    }

    /**
     * Transform the input model into a new model that will use the
     * list-fare-item component.
     * @param {Object} cabins Input model.
     * @returns {Object} Output model transformed.
     */
    getFareList = (cabins) => {

        var model = {
            'cabinLetter': '',
            'valueOrder': '',
            'showitem': '',
            'title': '',
            'text': '',
            'price': '',
            'priceold': '',
            'type': '',
            'number': '',
            'disabled': '',
            'long': '',
            'bold': '',
            'fareFamilies': ''
        };

        var typeCabine = {
            'E': '1',
            'T': '2',
            'N': '2',
            'B': '3',
        };

        var IndexTypeCabine = {
            E: 0,
            T: 1,
            N: 2,
            B: 3,
        };

        var orderNumber = ['first', 'second', 'third', 'four'];

        var modelreturn = [];

        Object.keys(cabins).forEach((key, index, array) => {

            modelreturn[index] = angular.copy(model);
            if (angular.isDefined(cabins[key].best)) {
                modelreturn[index].best = true;
            } else {
                modelreturn[index].best = false;
            }
            modelreturn[index].cabinLetter = key;
            modelreturn[index].valueOrder = IndexTypeCabine[key];
            modelreturn[index].showitem = 'rate-' + typeCabine[key];
            modelreturn[index].title = cabins[key].cabinDescription;
            modelreturn[index].fareFamilies = cabins[key].fareFamilies ? this.getModelListFareFamilies(cabins[key].fareFamilies) : '';
            modelreturn[index].type = typeCabine[key];
            modelreturn[index].number = orderNumber[index];
            if (cabins[key].cabinAvailable === false) {
                modelreturn[index].disabled = true;
                modelreturn[index].text = this.$filter('lowercase')(this.$filter('translate')('MMB_VC_SPECIAL_NEED_STATUS_UN'));
                modelreturn[index].priceNumber = null;
            } else {
                modelreturn[index].disabled = false;
                modelreturn[index].text = this.$filter('lowercase')(this.$filter('translate')('MMB_VC_CUSTOMIZE_FLIGHTS_SINCE'));
                modelreturn[index].price = cabins[key].bestPriceShown;
                modelreturn[index].priceNumber = cabins[key].bestPrice;
            }
            modelreturn[index].long = modelreturn[index].price.length >= 10;
        });

        modelreturn = modelreturn.sort((x, y) => {
            return x.valueOrder - y.valueOrder;
        });

        modelreturn.forEach((element, index) => {
            element.number = orderNumber[index];
        });

        return modelreturn;
    }

    /**
     * This function generates the data model necessary for the total price component.
     * @param {Object} model Data from service.
     * @returns Transformed data model.
     */
    getTotalPrice = (model) => {

        var data;

        if (model['relatedContent']) {
            data = {
                'contextMetadata': model['contextMetadata'],
                'relatedContent': model['relatedContent']
            };
        } else {
            data = {
                'contextMetadata': model['contextMetadata'],
            };
        }

        return data;
    }

    /**
     * Transform the input model into a new model that will use the
     * flight-filter component.
     * @param {Object} data Input model.
     * @returns {Object} Output model transformed.
     */
    getModelfilter = (data) => {

        var i, j, k, model;
        var cabinTitles = [];
        var farePrices = [];
        var stopsNumbers = [];
        var arrivalTimes = [];
        var departureTimes = [];
        data.forEach((element) => {
            element.cabins.forEach((cabin) => {
                if (cabinTitles.indexOf(cabin.title) === -1) {
                    cabinTitles.push(cabin.title);
                }
                for (i in cabin.fareFamilies) {
                    farePrices.push(cabin.fareFamilies[i].price);
                }
            });
            stopsNumbers.push(element.info.stopsNumber);
            departureTimes.push(parseInt(element.info.departureTime.split(':')[0]));
            arrivalTimes.push(parseInt(element.info.arrivalTime.split(':')[0]));
        });


        farePrices = farePrices.sort((a, b) => {
            return a - b;
        });
        stopsNumbers = stopsNumbers.sort((a, b) => {
            return a - b;
        });
        arrivalTimes = arrivalTimes.sort((a, b) => {
            return a - b;
        });
        departureTimes = departureTimes.sort((a, b) => {
            return a - b;
        });

        model = {};
        model.scale = [];
        model.fare = [];

        model.indexFormApis = 0;
        for (j = 0; j < cabinTitles.length; j++) {
            model.fare.push({
                id: j + 1,
                name: cabinTitles[j]
            });
        }
        model.fare.unshift({
            id: 0,
            name: this.$filter('translate')('MMB_VC_ALL_CABINS')
        });

        model.fareSelected = model.fare[0];

        for (k = 0; k <= stopsNumbers[(stopsNumbers.length) - 1]; k++) {
            model.scale.push({
                numScale: k,
                checked: false
            });
        }

        model.rangePrice = {
            min: Math.floor(farePrices[0]),
            max: Math.round(farePrices[(farePrices.length) - 1]),
            options: {
                hideLimitLabels: true,
                floor: Math.floor(farePrices[0]),
                ceil: Math.round(farePrices[(farePrices.length) - 1]),
                step: 1,
                translate: (value) => {
                    return Math.round(value) + '€';
                }
            }
        };
        model.rangeHoursDeparture = {
            min: departureTimes[0],
            max: departureTimes[(departureTimes.length) - 1] + 1,
            options: {
                hideLimitLabels: true,
                floor: departureTimes[0],
                ceil: departureTimes[(departureTimes.length) - 1] + 1,
                step: 1,
                translate: (value) => {
                    if (value < 10) {
                        return '0' + value + ':00';
                    }

                    return value + ':00';
                }
            }
        };
        model.rangeHoursArrival = {
            min: arrivalTimes[0],
            max: arrivalTimes[(arrivalTimes.length) - 1] + 1,
            options: {
                hideLimitLabels: true,
                floor: arrivalTimes[0],
                ceil: arrivalTimes[(arrivalTimes.length) - 1] + 1,
                step: 1,
                translate: (value) => {
                    if (value < 10) {
                        return '0' + value + ':00';
                    }

                    return value + ':00';
                }
            }
        };

        model.company = false;

        return [{
            isOpenModal: false,
            configModal: {},
            name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME',
            filterName: 'departureDateTime',
            title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME_TITLE',
            classParent: 'ib-table-flight-filters__item hidden-sm hidden-xs',
            class: 'ib-table-flight-filters__text'
        }, {
            isOpenModal: false,
            configModal: {},
            name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION',
            filterName: 'duration',
            title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION_TITLE',
            classParent: 'ib-table-flight-filters__item hidden-sm hidden-xs',
            class: 'ib-table-flight-filters__text'
        }, {
            isOpenModal: false,
            configModal: {},
            name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE',
            filterName: 'slicePrice',
            title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE_TITLE',
            classParent: 'ib-table-flight-filters__item hidden-sm hidden-xs',
            class: 'ib-table-flight-filters__text'
        }, {
            isOpenModal: true,
            configModal: {
                template: 'ib-modal-cv-filter.html',
                class: 'ib-modals ib-modals--right fade',
                model: model
            },
            name: 'MMB_VC_AVAILABILITY_TRIP_INFO_BODY_A_DESC_5',
            filterName: 'filter',
            title: 'MMB_VC_AVAILABILITY_TRIP_INFO_BODY_A_DESC_5_TITLE',
            classParent: 'ib-table-flight-filters__item',
            class: 'ib-table-flight-filters__text ib-table-flight-filters__text--underline'
        }];
    }

    setAvailabilityModelTransformer = (data) => {
        this.availabilityModelTransformer = data;
    }

    generateDataLayerAvailability = () => {
        const categoryUser = (this.localStorageService.get('customerData')) ? (this.localStorageService.get('customerData')).generalInfo.category : null;
        let serviceDate: any = {};
        this.datalayerObject = {};
        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.USER_STATE] = this.MmBUtilService.isUserLogged() ? 'logado' : 'no_logado';



        if (this.availabilityModelTransformer[0] && this.availabilityModelTransformer[0].originDestinations[0]) {
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEARCH_CITY] = this.availabilityModelTransformer[0].originDestinations[0].originCity.code;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY] = this.availabilityModelTransformer[0].originDestinations[0].originCity.countryCode;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] = this.availabilityModelTransformer[0].originDestinations[0].originCity.countryCode + ',' + this.availabilityModelTransformer[0].originDestinations[0].destinationCity.countryCode;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] = this.availabilityModelTransformer[0].originDestinations[0].origin + ',' + this.availabilityModelTransformer[0].originDestinations[0].destination;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEARCH_DEST] = this.availabilityModelTransformer[0].originDestinations[0].destinationCity.code;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] = this.availabilityModelTransformer[0].originDestinations[0].originCity.countryCode;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.ENTRY_POINT] = this.availabilityModelTransformer[0].contextMetadata.language + '/' + this.availabilityModelTransformer[0].contextMetadata.country + '/' + this.MmBAppConstants.QUADRIGAM.MANAGE_RESERV;
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = (this.getTotalPax().totalPassengers).toString();
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.NUM_CHILDS] = (this.getTotalPax().totalChilds).toString();
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.NUM_INFANTS] = (this.getTotalPax().totalBaby).toString();
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.NUM_ADDULTS] = (this.getTotalPax().totalAdults).toString();
        }

        if (categoryUser) {
            this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.USER_LEVEL] = categoryUser;
        }

        if (this.availabilityModelTransformer[0] && this.availabilityModelTransformer[0].modeFlight) {
            if(this.availabilityModelTransformer[0].selectedSlice[0] && this.availabilityModelTransformer[0].selectedSlice[0].date && this.availabilityModelTransformer[0].selectedSlice[0].date.serviceDate) {
                serviceDate.selectedSlice0 = this.availabilityModelTransformer[0].selectedSlice[0].date.serviceDate;
            }
            if(this.availabilityModelTransformer[0].selectedSlice[1] && this.availabilityModelTransformer[0].selectedSlice[1].date && this.availabilityModelTransformer[0].selectedSlice[1].date.serviceDate) {
                serviceDate.selectedSlice1 = this.availabilityModelTransformer[0].selectedSlice[1].date.serviceDate;
            }
            switch (this.availabilityModelTransformer[0].modeFlight) {
                case 'outbound':
                    this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.FLIGHT_TYPE] = 'OW';
                    if (this.availabilityModelTransformer[0] && this.availabilityModelTransformer[0].selectedSlice[0] && serviceDate.selectedSlice0) {
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = (this.MmBUtilsSharedService.getDifferenceInDays(new Date(serviceDate.selectedSlice0), new Date())).toString();
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = (this.$filter('DateFormatFilter')(serviceDate.selectedSlice0)).formatedDate;
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.OUTBOUND_RESULTS] = (this.getOffersResults('outbound').outboundCount).toString();
                    }
                    break;
                case 'twice':
                    this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.FLIGHT_TYPE] = 'RT';
                    if (this.availabilityModelTransformer[0] && this.availabilityModelTransformer[0].selectedSlice[0] && serviceDate.selectedSlice0 && serviceDate.selectedSlice1) {
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = (this.$filter('DateFormatFilter')(serviceDate.selectedSlice0)).formatedDate + '-' + (this.$filter('DateFormatFilter')(serviceDate.selectedSlice1)).formatedDate;
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = (this.MmBUtilsSharedService.getDifferenceInDays(new Date(serviceDate.selectedSlice0), new Date())).toString();
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.NEW_DESTINATION_STAY] = (this.MmBUtilsSharedService.getDifferenceInDays(new Date(serviceDate.selectedSlice1), new Date(serviceDate.selectedSlice0))).toString();
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.OUTBOUND_RESULTS] = (this.getOffersResults('twice').outboundCount).toString();
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.INBOUND_RESULTS] = (this.getOffersResults('twice').returnCount).toString();
                    }
                    break;
                case 'return':
                    this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.FLIGHT_TYPE] = '';
                    if(this.localStorageService.get('isUnifiedFlow') && serviceDate.selectedSlice1) {
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = (this.$filter('DateFormatFilter')(serviceDate.selectedSlice1)).formatedDate;
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = (this.MmBUtilsSharedService.getDifferenceInDays(new Date(serviceDate.selectedSlice1), new Date())).toString();
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.INBOUND_RESULTS] = (this.getOffersResults('return').returnCount).toString();
                    }
                    else if (this.availabilityModelTransformer[0] && this.availabilityModelTransformer[0].selectedSlice[0] && serviceDate.selectedSlice0) {
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = (this.$filter('DateFormatFilter')(serviceDate.selectedSlice0)).formatedDate;
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = (this.MmBUtilsSharedService.getDifferenceInDays(new Date(serviceDate.selectedSlice0), new Date())).toString();
                        this.datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.INBOUND_RESULTS] = (this.getOffersResults('return').returnCount).toString();
                    }
                    break;
            }
        }

        this.localStorageService.set('cvDatalayer', this.datalayerObject);
        return this.datalayerObject;
    };

    getOffersResults = (type) => {
        var outBoundResult = 0;
        var returnResult = 0;
        var sliceAvailable = false;
        switch (type) {
            case 'outbound':
                this.availabilityModelTransformer[0].originDestinations[0].slices.forEach((slice) => {
                    Object.keys(slice.cabins).forEach((cabine) => {
                        if (slice.cabins[cabine].cabinAvailable && sliceAvailable !== true) {
                            sliceAvailable = true;
                        }
                    });
                    if (sliceAvailable) {
                        outBoundResult++;
                        sliceAvailable = false;
                    }
                });
                break;
            case 'twice':
                this.availabilityModelTransformer[0].originDestinations[0].slices.forEach((slice) => {
                    Object.keys(slice.cabins).forEach((cabine) => {
                        if (slice.cabins[cabine].cabinAvailable && sliceAvailable !== true) {
                            sliceAvailable = true;
                        }
                    });
                    if (sliceAvailable) {
                        outBoundResult++;
                        sliceAvailable = false;
                    }
                });

                if (this.availabilityModelTransformer[1]) {
                    this.availabilityModelTransformer[1].originDestinations[1].slices.forEach((slice) => {
                        Object.keys(slice.cabins).forEach((cabine) => {
                            if (slice.cabins[cabine].cabinAvailable && sliceAvailable !== true) {
                                sliceAvailable = true;
                            }
                        });
                        if (sliceAvailable) {
                            returnResult++;
                            sliceAvailable = false;
                        }
                    });
                } else {
                    returnResult = this.availabilityModelTransformer[0].originDestinations[1].slices.length;
                }
                break;
            case 'return':
                var index = 1;
                if (this.localStorageService.get('isUnifiedFlow') && this.localStorageService.get('unifiedOptionalData') && this.localStorageService.get('unifiedOfferType') === 'INVOLUNTARY_CHANGE') {
                    index = 0;
                }
                this.availabilityModelTransformer[0].originDestinations[index].slices.forEach((slice) => {
                    Object.keys(slice.cabins).forEach((cabine) => {
                        if (slice.cabins[cabine].cabinAvailable && sliceAvailable !== true) {
                            sliceAvailable = true;
                        }
                    });
                    if (sliceAvailable) {
                        returnResult++;
                        sliceAvailable = false;
                    }
                });
                break;
        }

        return {
            outboundCount: outBoundResult,
            returnCount: returnResult
        };
    }

    getTotalPax = () => {
        var adults = 0;
        var childs = 0;
        var baby = 0;
        var totalPassengers = 0;

        this.availabilityModelTransformer[0].passengers.forEach((data) => {
            // total without infants
            if (data.passengerType !== 'INFANT') {
                totalPassengers++;
            }
            if (data.passengerType === 'ADULT') {
                adults++;
            }
            if (data.passengerType === 'CHILD') {
                childs++;
            }
            if (data.passengerType === 'INFANT') {
                baby++;
            }
        });

        return {
            totalPassengers: totalPassengers,
            totalAdults: adults,
            totalChilds: childs,
            totalBaby: baby
        };
    }

    /**
     * Parses the duration given
     * @param {Integer} duration The duration to parse
     */
    getDuration = (duration) => {
        return this.$filter('DurationFormatFilter')(duration);
    }

}
