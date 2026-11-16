import * as angular from 'angular';
import { DEFAULT_DISRUPTION_TYPE_MODEL, DisruptionTypeModel } from './models/disruption-type.model';
import { MmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';
import { MMBDatalayerConstants } from '../ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';

@Service(
    'ib-MmB-services-module',
    ['CommonsSessionStorageService', 'MmBAppConstants', '$filter', '$sce', '$rootScope', 
        'MmBDatalayerUtilsService', '$location', 'CommonsUtilService'],
    []
)
export class MmBUtilsSharedService {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private MmBAppConstants,
        private $filter: ng.FilterFactory,
        private $sce: ng.ISCEService,
        private $rootScope: any,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private $location: angular.ILocationService,
        private CommonsUtilService: CommonsUtilService) {}

    
    getInfoHeader = (segments, passengers) => {
        const cityInfo = (flight) => {
            return {
                'code': flight.airportCode,
                'description': flight.airportCode,
                'timezone': '',
                'country': {
                    'code': '',
                    'description': ''
                }
            };
        };
        const dateFlightInfo = (departure) => {
            return {
                'outboundFlight': this.getMiddleDashDate(departure.date),
                'formatedOutboundFlight': this.getMiddleDashDate(departure.date) + 'T00:00:00.000Z',
                'returnFlight': '',
                'formatedReturnFlight': ''
            };
        };

        let modelHeader = [],
            segmentInfo: any = {};
        this.getSegmentsInfo(segments);

        segments.forEach((segment) => {
            segmentInfo = {
                'originCity': {},
                'destinationCity': {},
                'dates': {},
                'passengers': 0,
                'numAdults': 0,
                'numSeniors': 0,
                'numYoung': 0,
                'numTeenager': 0,
                'numInfant': 0,
                'numChilds': 0,
                'numberPassengrsWithoutInfant': 0
            };
            segmentInfo.originCity = cityInfo(segment.departure);
            segmentInfo.destinationCity = cityInfo(segment.arrival);
            segmentInfo.dates = dateFlightInfo(segment.departure);
            passengers.forEach((passenger) => {
                switch (passenger.type) {
                        case this.MmBAppConstants.PASSENGER_TYPE.SENIOR:
                            segmentInfo.numSeniors += 1;
                            break;
                        case this.MmBAppConstants.PASSENGER_TYPE.ADULT:
                            segmentInfo.numAdults += 1;
                            break;
                        case this.MmBAppConstants.PASSENGER_TYPE.CHILD:
                            segmentInfo.numChilds += 1;
                            break;
                        case this.MmBAppConstants.PASSENGER_TYPE.INFANT:
                            segmentInfo.numInfant += 1;
                            break;
                        case this.MmBAppConstants.PASSENGER_TYPE.YOUTH:
                            segmentInfo.numYoung += 1;
                            break;
                }
                if (passenger.infant === null) {
                    segmentInfo.numberPassengrsWithoutInfant += 1;
                }
            });
            segmentInfo.passengers = passengers.length;
            modelHeader.push(segmentInfo);
        });
        return modelHeader;
    };

    private getMiddleDashDate = (date) => {
        let dateSlice = '';
        if (date) {
            dateSlice = date.year + '-' + (date.monthNumber < 10 ? '0' + date.monthNumber : date.monthNumber) + '-' + (date.monthDay < 10 ? '0' + date.monthDay : date.monthDay);
        }
        return dateSlice;
    };

    private getSegmentsInfo = (segments, mode = 'service') => {
        if (mode === 'service') {
            return this._mapSegmentsInfo(
                segments,
                (seg) => ({
                    id: seg.segmentId,
                    origin: {
                        description: seg.departure.city.description,
                        code: seg.departure.city.code
                    },
                    destination: {
                        description: seg.arrival.city.description,
                        code: seg.arrival.city.code
                    }
                })
            );
        } else if (mode === 'model') {
            return this._mapSegmentsInfo(
                segments,
                (seg) => ({
                    id: seg.segmentId,
                    origin: {
                        description: seg.departureCity.city.description,
                        code: seg.departureCity.city.code
                    },
                    destination: {
                        description: seg.arrivalCity.city.description,
                        code: seg.arrivalCity.city.code
                    }
                })
            );
        };
        return [];
    };

    private _mapSegmentsInfo = (inputArray, extractor) => {
        return inputArray.map(extractor);
    };

    generateSegmentsInfo = (fligthsInfo) => {
        return this.getSegmentsInfo(fligthsInfo, 'model');
    };

    removeDuplicates = (citiesList) => {
        let initialListIndex, uniqueListIndex, filteredList = [], uniqueObject = {}, objCode;
        for (initialListIndex = 0; initialListIndex < citiesList.length; initialListIndex++) {
            objCode = null;
            objCode = citiesList[initialListIndex]['code'];
            uniqueObject[objCode] = citiesList[initialListIndex];
        }
        for (uniqueListIndex in uniqueObject) {
            filteredList.push(uniqueObject[uniqueListIndex]);
        }
        return filteredList;
    };

    newTransformSisterCitiesModel = (rawModel, isFlex, slicesInfo, flightsInfo) => {
        let newTransformedSisterCitiesModel: any = {};
        newTransformedSisterCitiesModel.disruptedSlices = [];
        newTransformedSisterCitiesModel.switchSisterCities = false;
        newTransformedSisterCitiesModel.sisterCitiesOptionChecked = false;

        slicesInfo.forEach(slice => {
            newTransformedSisterCitiesModel.disruptedSlices.push(slice.sliceId);
            this._buildSisterCitiesSlice(newTransformedSisterCitiesModel, rawModel, slice);
        });

        if (!flightsInfo) flightsInfo = [];
        Object.keys(flightsInfo).forEach((flight) => {
            newTransformedSisterCitiesModel[flight].index = flightsInfo[flight].index;
        });

        this._setReferenceSliceId(newTransformedSisterCitiesModel, slicesInfo, flightsInfo, isFlex);

        return newTransformedSisterCitiesModel;
    };

    private _buildSisterCitiesSlice = (model, rawModel, slice) => {
        let sisterCitiesOrigin, sisterCitiesDestination;
        if (slice.originalDisruptionSliceInformation) {
            sisterCitiesOrigin = this.getSisterCities(rawModel, slice.originalDisruptionSliceInformation.departure.city.code);
            sisterCitiesDestination = this.getSisterCities(rawModel, slice.originalDisruptionSliceInformation.arrival.city.code);
            model[slice.sliceId] = {
                'origin': {
                    'originOrderCities': {
                        'code': slice.originalDisruptionSliceInformation.departure.city.code,
                        'description': slice.originalDisruptionSliceInformation.departure.city.description
                    },
                    'originSisterCities': sisterCitiesOrigin ? sisterCitiesOrigin : []
                },
                'destination': {
                    'destinationOrderCities': {
                        'code': slice.originalDisruptionSliceInformation.arrival.city.code,
                        'description': slice.originalDisruptionSliceInformation.arrival.city.description
                    },
                    'destinationSisterCities': sisterCitiesDestination ? sisterCitiesDestination : []
                }
            };
        } else {
            const numSegments = slice.segments.length;
            sisterCitiesOrigin = this.getSisterCities(rawModel, slice.segments[0].departure.city.code);
            sisterCitiesDestination = this.getSisterCities(rawModel, slice.segments[numSegments - 1].arrival.city.code);
            model[slice.sliceId] = {
                'origin': {
                    'originOrderCities': {
                        'code': slice.segments[0].departure.city.code,
                        'description': slice.segments[0].departure.city.description
                    },
                    'originSisterCities': sisterCitiesOrigin ? sisterCitiesOrigin : []
                },
                destination: {
                    'destinationOrderCities': {
                        'code': slice.segments[numSegments - 1].arrival.city.code,
                        'description': slice.segments[numSegments - 1].arrival.city.description
                    },
                    'destinationSisterCities': sisterCitiesDestination ? sisterCitiesDestination : []
                }
            };
        };
        model[slice.sliceId]['originHasSisterCities'] = this.isSisterCitiesTrueOrFalse(sisterCitiesOrigin);
        model[slice.sliceId]['originSisterCitiesNum'] = sisterCitiesOrigin.length > 0 ? '+' + sisterCitiesOrigin.length : null;
        model[slice.sliceId]['destinationHasSisterCities'] = this.isSisterCitiesTrueOrFalse(sisterCitiesDestination);
        model[slice.sliceId]['destinationSisterCitiesNum'] = this.isSisterCitiesDestination(sisterCitiesDestination);
        model[slice.sliceId]['index'] = this.isSisterCitiesDestination(sisterCitiesDestination);
    };

    private isSisterCitiesTrueOrFalse = (sisterCities) => {
        return (sisterCities.length > 0 ? true : false);
    };

    private isSisterCitiesDestination = (sisterCitiesDestination) => {
        return (sisterCitiesDestination.length > 0 ? '+' + sisterCitiesDestination.length : null);
    };

    private _setReferenceSliceId = (model, slicesInfo, flightsInfo, isFlex) => {
        if (isFlex) {
            model.referenceSliceId = slicesInfo[0].sliceId;
        } else if (this.isDisruptedSlices(flightsInfo, model, 0) && !this.isDisruptedSlices(flightsInfo, model, 1)) {
            model.referenceSliceId = model.disruptedSlices[0];
            model.switchSisterCities = true;
        } else if (this.isDisruptedSlices(flightsInfo, model, 1) && !this.isDisruptedSlices(flightsInfo, model, 0)) {
            model.referenceSliceId = model.disruptedSlices[1];
            model.switchSisterCities = true;
        } else {
            model.referenceSliceId = slicesInfo[0].sliceId;
        };
    };

    private isDisruptedSlices = (flightsInfo, model, i) => {
        return (flightsInfo[model.disruptedSlices[i]]?.disrupted);
    };

    private getSisterCities = (rawModel, cityCode) => {
        const sisterCities = rawModel.cities.find(e => e.code === cityCode);
        if(sisterCities) {
            return sisterCities.sisterCities;
        } else {
            return [];
        };
    };

    updateSisterCitiesModel = (sisterCitiesModel) => {
        const calculateCitiesSelected = (cityList) => {
            var cont = 0;
            angular.forEach(cityList, (city) => {
                if (city.isSelected) {
                    cont++;
                }
            });

            if(cont === 0) {
                return null;
            }
            return '+' + cont;
        };

        sisterCitiesModel[sisterCitiesModel.referenceSliceId].originSisterCitiesNum = calculateCitiesSelected(sisterCitiesModel[sisterCitiesModel.referenceSliceId].origin.originSisterCities);
        sisterCitiesModel[sisterCitiesModel.referenceSliceId].destinationSisterCitiesNum = calculateCitiesSelected(sisterCitiesModel[sisterCitiesModel.referenceSliceId].destination.destinationSisterCities);
    };

    /**
    * This functions return request to get all data about availability flexibles flights
    * @param {Object} flights All information about flights
    * @param {String} flowId flowId
    * @returns {Object} 'availabilityFlexRequest' with all information neccesary to call service.
    *  */
    generateRequestFlexibilization = (flights, flowId, sisterCityModel) => {
        let availabilityFlexRequest: any = {}, slicesInfo = [];
        availabilityFlexRequest.flowId = flowId ? flowId : this.CommonsSessionStorageService.get('flowId') ? this.CommonsSessionStorageService.get('flowId') : null;

        if (sisterCityModel) {
            slicesInfo = this.addSliceInfoSisterCityModel(flights, sisterCityModel);
        } else {
            slicesInfo = this.addSliceInfo(flights, sisterCityModel);
        };
        availabilityFlexRequest.slices = slicesInfo;
        return availabilityFlexRequest;
    };

    private addSliceInfoSisterCityModel = (flights, sisterCityModel) => {
        let slicesInfo = [], counter = 0;
        angular.forEach(sisterCityModel.disruptedSlices, (sliceId) => {
            if (sisterCityModel.referenceSliceId === sliceId) {
                //counter = 0 means 'origin'
                counter = 0;
            } else {
                //counter = 1 means 'destiny'
                counter = 1;
            };

            if (flights.hasOwnProperty(sliceId)) {
                if (this.isDisruptedAndChecked(flights,sliceId)) {
                    slicesInfo.push(this.buildSliceRequest(flights[sliceId], sliceId, sisterCityModel, counter));
                }
            };
        });
        return slicesInfo;
    };

    private addSliceInfo = (flights, sisterCityModel) => {
        let slicesInfo = [], sliceId, counter = 0;
        for (sliceId in flights) {
            if (flights.hasOwnProperty(sliceId)) {
                if (this.isDisruptedAndChecked(flights,sliceId)) {
                    slicesInfo.push(this.buildSliceRequest(flights[sliceId], sliceId, sisterCityModel, counter));
                }
            }
            counter++;
        };
        return slicesInfo;
    };

    private buildSliceRequest = (sliceItem, sliceId, sisterCityModel, counter) => {
        let result: any = {};
        result.sliceId = sliceId;
        if(this.CommonsSessionStorageService.get('isUnifiedFlow') && this.CommonsSessionStorageService.get('isSearchFromButton')) {
            sliceItem.parseNewDateSelected = this.transformerDateSelected(sliceItem.newDateSelected);
        }
        result.date = this.getDateFormatted(sliceItem.parseNewDateSelected.day, sliceItem.parseNewDateSelected.month, sliceItem.parseNewDateSelected.year);
        if (sisterCityModel) {
            result.origins = [];
            result.destinations = [];
            result = this.addResultOriginSisterCities(result, counter, sisterCityModel);
            angular.forEach(sisterCityModel[sisterCityModel.referenceSliceId].destination.destinationSisterCities, (city) => {
                if (city.isSelected) {
                    if (counter >= 1) {
                        result.origins.push(city.code);
                    } else {
                        result.destinations.push(city.code);
                    };
                };
            });
        };

        return result;
    };

    private getDateFormatted = (day, month, year) => {
        const parsedDay = day < 10 ? '0' + day : day;
        const parsedMonth = month < 10 ? '0' + month : month;
        return year + '-' + parsedMonth + '-' + parsedDay;
    };

    private addResultOriginSisterCities = (result, counter, sisterCityModel) => {
        angular.forEach(sisterCityModel[sisterCityModel.referenceSliceId].origin.originSisterCities, (city) => {
            if (city.isSelected) {
                if (counter === 1) {
                    result.destinations.push(city.code);
                } else {
                    result.origins.push(city.code);
                };
            };
        });
        return result;
    };

    private transformerDateSelected = (date) => {
        const parseDate = {
            'day': date.getDate(),
            'month': date.getMonth() + 1,
            'year': date.getFullYear(),
            'weekDay': date.getDay()
        };
        return parseDate;
    };

    private isDisruptedAndChecked = (flights,sliceId) => {
        return (flights[sliceId].disrupted || flights[sliceId].optionalEnabled || flights[sliceId].checked);
    };

    /**
     * Obtains the flag value from a container list of flags
     * @param {Object} containerObj The flags container
     * @param {String} attribName Name of the atribute which holds the flag name
     * @param {String} attribValue Name of the property which holds the flag value
     * @param {String} flagName Value of the flag to evaluate
     */
    getFlagValue = (containerObj, attribName, attribValue, flagName) => {
        let flagIndex = 0;
        let found = false;
        let value = false;
        if (containerObj) {
            while (flagIndex < containerObj.length && !found) {
                if (containerObj[flagIndex][attribName] === flagName) {
                    found = true;
                    value = containerObj[flagIndex][attribValue];
                };
                flagIndex++;
            };
        };
        return value;
    };

    /**
    * Genera la información de datalayer para vuelos flexibles y/o interrumpidos.
    * Refactorizada para mayor claridad y evitar el warning "Bumpy Road Ahead".
    */
    generateFlexAndDisruptedFlightsDatalayerInfo = (isDisrupted, model) => {
        const context = this._initDatalayerContext();
        this._setPnrType(model, isDisrupted, context);
        context.flightStatus = this._getFlightStatus(model, isDisrupted, context);

        if (isDisrupted) {
            this._fillDisruptedFlightInfo(model, context);
        } else {
            this._fillFlexFlightInfo(model, context);
        }
        this._fillDatalayerPricesInfo(model, context);

        if (model.voucherPriceInfo && model.voucherPriceInfo.percentagePrice) {
            context.voucherDiscount = model.voucherPriceInfo.percentagePrice;
        }

        const paramsDigitalData = {
            model,
            flightStatus: context.flightStatus,
            anticipationDays: context.anticipationDays,
            originalFlightDate: context.originalFlightDate,
            daysInDestination: context.daysInDestination,
            pnrType: context.pnrType,
            originalIssueDateFormatted: context.originalIssueDateFormatted,
            originalDepartureDate: context.originalDepartureDate,
            originalReturnDate: context.originalReturnDate,
            voucherDiscount: context.voucherDiscount,
            aviosDiscount: context.aviosDiscount,
            passengersInfo: context.passengersInfo,
            pricesInfo: context.pricesInfo,
            flightType: context.flightType,
            isDisrupted
        };

        this.MmBDatalayerUtilsService.updateDigitalDataForFlexFlights(
            this.generateObjectDigitalDataForFlexFlights(paramsDigitalData)
        );
        this.MmBDatalayerUtilsService.updateSlicesDatalayerForFlexFlights(
            this.CommonsSessionStorageService.get('bookingInfo'),
            this.CommonsSessionStorageService.get('breakdownInfo')
        );
    };

     private isFlagShowFlexibilization = (model) => {
        return (model.flags && model.flags.showFlexibilizationChangeSection && model.orderCapabilities);
    };

    getUniqueElementByProperty = (array, property) => {
        let keys = array.map((value) => { return value[property]; });
        return array.filter((value, index) => { return keys.indexOf(value[property]) === index; });
    };

    generateRedirectionFormCancel = (formData) => {
        let i, form = '<form action="' + this.$sce.trustAsResourceUrl(formData.url) + '" method="post">';
        for (i = 0; i < formData.params.length; i++) {
            form += '<input type="hidden" name="' + formData.params[i].name + '" value="' + formData.params[i].value + '" />';
        }
        form += '<input type="submit" id="submit_hidden_form" class="u-hide" /></form>';
        return form;
    };

    /**
    * Return preconditions to call sister cities endpoint returning if is specific or generic or none
    * @param {Object} bookingInfo Object with date values
    * @returns {DisruptionTypeModel} 'preconditions sister cities enum' with information to make sister cities request.
    */
    getDisruptionType (bookingInfo) : DisruptionTypeModel {
        let disruptionParams: DisruptionTypeModel = DEFAULT_DISRUPTION_TYPE_MODEL;
        if (this.isFlexCapabilitiesInfo(bookingInfo)) {
                disruptionParams.disruptionType = 'SPECIFIC';
                disruptionParams.disruptionId = bookingInfo?.flexibilizationCapabilitiesInformation.id;
        } else if(!bookingInfo?.flexibilizationCapabilitiesInformation && bookingInfo?.genericDisruptionCapabilitiesInformation) {
                disruptionParams.disruptionType = 'GENERIC';
                disruptionParams.disruptionId = bookingInfo?.genericDisruptionCapabilitiesInformation.id;
        } else {
            disruptionParams.disruptionType = 'NONE';
            disruptionParams.disruptionId = null;
        };
        return disruptionParams;
    };

    private isFlexCapabilitiesInfo = (bookingInfo) => {
        return (bookingInfo?.flexibilizationCapabilitiesInformation && !bookingInfo?.genericDisruptionCapabilitiesInformation);
    };

    private generateObjectDigitalDataForFlexFlights = (paramsDigitalData) => {
        let {model, flightStatus, anticipationDays, originalFlightDate, daysInDestination,  pnrType, originalIssueDateFormatted, originalDepartureDate, originalReturnDate, voucherDiscount, aviosDiscount, passengersInfo, pricesInfo, flightType, isDisrupted} = paramsDigitalData;
        const objectDigitalDataForFlexFlights:datalayerServiceTypes.TypeDigitalDataForFlexFlights = {} as datalayerServiceTypes.TypeDigitalDataForFlexFlights;
        const customerDataOB = JSON.parse(sessionStorage.getItem('customerDataOB'));
        objectDigitalDataForFlexFlights.aviosEarned = this.getAvios();
        objectDigitalDataForFlexFlights.changeAcceptance = this.getChangeAcceptance(model, isDisrupted);
        objectDigitalDataForFlexFlights.changeType = this.getChangeType();
        objectDigitalDataForFlexFlights.flightStatus = flightStatus;
        objectDigitalDataForFlexFlights.originalAdvancePurchase = anticipationDays;
        objectDigitalDataForFlexFlights.originalDate = originalFlightDate;
        objectDigitalDataForFlexFlights.originalLengthStay = daysInDestination;
        objectDigitalDataForFlexFlights.lengthStay = daysInDestination;
        objectDigitalDataForFlexFlights.pnrType = pnrType;
        objectDigitalDataForFlexFlights.purchaseDate = originalIssueDateFormatted;
        objectDigitalDataForFlexFlights.purchaseType = this.getpurchaseType(customerDataOB);
        objectDigitalDataForFlexFlights.slice1OriginalDate = originalDepartureDate;
        objectDigitalDataForFlexFlights.slice2OriginalDate = originalReturnDate;
        objectDigitalDataForFlexFlights.slice3OriginalDate = this.getSlice3OriginalDate( model.rawSlicesInfo );
        objectDigitalDataForFlexFlights.slice4OriginalDate = this.getSlice4OriginalDate( model.rawSlicesInfo );
        objectDigitalDataForFlexFlights.specialMeal = this.getMeal();
        objectDigitalDataForFlexFlights.voucherDiscount = voucherDiscount;
        objectDigitalDataForFlexFlights.aviosRedeemed = aviosDiscount;
        objectDigitalDataForFlexFlights.passengersInfo = passengersInfo;
        objectDigitalDataForFlexFlights.pricesInfo = pricesInfo;
        objectDigitalDataForFlexFlights.flightType = flightType;
        objectDigitalDataForFlexFlights.rolCip = this.getRolCIP(customerDataOB);
        objectDigitalDataForFlexFlights.currency = this.getCurrency();
        objectDigitalDataForFlexFlights.reference = this.getPRN();
        objectDigitalDataForFlexFlights.bookingClass = this.getBookingClass(model);
        objectDigitalDataForFlexFlights.airportSeg = this.getAirportSeg(model);
        return objectDigitalDataForFlexFlights;
    };

    private getAvios = () => {
        const calculatedPoints: any = this.CommonsSessionStorageService.get('CalculatedPoints');
        return calculatedPoints && calculatedPoints.Avios ? calculatedPoints.Avios : null;
    };

    private getChangeAcceptance = (model, isDisrupted) => {
        return isDisrupted ? this.isTotal(model) : null ;

    };

    private isTotal = (model) =>{
        let isTotal = true;
        model.rawSlicesInfo.forEach((sliceid) => {
            sliceid.segments.forEach((segment) => {
                if(segment.status.code == 'HK') isTotal= false;
            });
        });
        return isTotal;
    };

    private getChangeType = () => {
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        return bookingInfo.order.status;
    };

    private getpurchaseType = (customerDataOB) => {
        const purchaseType = (customerDataOB && customerDataOB.puntos) ? customerDataOB.puntos : (customerDataOB && customerDataOB.descuento) ? customerDataOB.descuento : null;
        return purchaseType;
    };

    private getSlice3OriginalDate = (flightsModel) =>{
        if(flightsModel.length === 3){
            const date = flightsModel[2].arrivalDateTime;
            const slice3OriginalDate = this.$filter('DateFormatFilter')(date).formatedDate;
            return slice3OriginalDate;
        } else return null;
    };

    private getSlice4OriginalDate = (flightsModel) =>{
        if(flightsModel.length === 4){
            const date = flightsModel[3].arrivalDateTime;
            const slice4OriginalDate = this.$filter('DateFormatFilter')(date).formatedDate;
            return slice4OriginalDate;
        } else return null;
    };

    private getMeal = () => {
        const meal: any = this.CommonsSessionStorageService.get('specialMealsCopy');
        const hasMeal = meal && meal.length >0 ? true : false;
        return hasMeal;
    };

    private getRolCIP = (customerDataOB) => {
        if(customerDataOB && customerDataOB.rolCIP){
            return customerDataOB.rolCIP;
        }
    };

    private getCurrency = () => {
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        return (bookingInfo?.order?.price?.currency) ? bookingInfo.order.price.currency : null;
    };

    private getPRN = () => {
        const PNR: any = this.CommonsSessionStorageService.get('PNR');
        return PNR ? PNR : null;
    };

    private getBookingClass = (model) => {
        let cabinClass: string = '';
        model.rawSlicesInfo.forEach((slice) => {
            slice.segments.forEach((segment) => {
                if (segment.cabin && angular.isString(segment.cabin.bookingClass)) {
                    cabinClass = cabinClass === '' || MMBDatalayerConstants.SEGMENT_CABIN_PRIORITY[cabinClass] > MMBDatalayerConstants.SEGMENT_CABIN_PRIORITY[segment.cabin.bookingClass.charAt(0)]
                        ? segment.cabin.bookingClass.charAt(0) : cabinClass;
                }
            });
        });
        return cabinClass;
    };

    private getAirportSeg = (model) => {
        const isMultipleTrip = this.CommonsSessionStorageService.get('multiCitySearch');
        let airportSeg;
        if(isMultipleTrip){
            model.forEach(slice => {
                let originDestination = '';
                originDestination = slice.segments.length>1 ? slice.segments[0].departure.code + '-' + slice.segments[1].arrival.code : slice.segments[0].departure.code + '-' + slice.segments[0].arrival.code;
                airportSeg +=
                    (airportSeg.length > 0 ? ',' : '') +
                    originDestination;
            });
        } else {
            airportSeg = model.rawSlicesInfo[0].segments[0].departure.code + '-' + model.rawSlicesInfo[0].segments[0].arrival.code;
        };
        return airportSeg;
    };

    /**
    * Gets the difference in days between 2 dates given.
    */
    private getDaysDifference = (maxDate, minDate) => {
        var splittedmaxDate, splittedminDate, formattedmaxDate, formattedminDate, difference, daysDiff;
        splittedmaxDate = maxDate.split('/');
        splittedminDate = minDate.split('/');
        formattedmaxDate = Date.UTC(splittedmaxDate[2], splittedmaxDate[1] - 1, splittedmaxDate[0]);
        formattedminDate = Date.UTC(splittedminDate[2], splittedminDate[1] - 1, splittedminDate[0]);
        difference = formattedmaxDate - formattedminDate;
        daysDiff = Math.floor(difference / (1000 * 60 * 60 * 24));

        return daysDiff;
    };

    /**
     * Get info prefix from app market
     * @returns {Object} code and countryCode info
     */
    getPrefixFromMarket = () => {
        return this.CommonsUtilService.getPrefixFromMarket();
    };


    /**
     * This functions generate and update QUADRIGAM page.
     *  */
    updateQuadrigam = (quadrigam, process?:string, step?:string) => {
        let newProcess = process || MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam];
        let newStep = step || MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam];

        if(this.$rootScope.isDisruptionFlow){
            this.$location.search('quadrigam', quadrigam);
        };

        this.MmBDatalayerUtilsService.updateDatalayerInfo(newProcess, newStep, quadrigam);
    };

    /**
     * This functions returns the process depending on the quadrigam and on the order status
     * @returns {String} process.
     *  */
    getProcessByStatus = (quadrigam, orderStatus) : string => {
        var process = null;

        if(this.MmBAppConstants.UN_UNTK_QUADRIGAMS.includes(quadrigam)) {
            switch (orderStatus) {
            case this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_FLAG:
                process = MMBDatalayerConstants.MMB_UN_UNTK_PROCESSES.UN;
                break;
            case this.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_REACOM_FLAG:
                process = MMBDatalayerConstants.MMB_UN_UNTK_PROCESSES.UNTK;
                break;
            };
        };
        return process;
    };

    getDifferenceInDays = (departureDate:Date, currentDate:Date):number => {
        return Math.round((departureDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    };

    private _initDatalayerContext() {
        return {
            pnrType: null,
            flightStatus: null,
            anticipationDays: null,
            originalFlightDate: null,
            daysInDestination: null,
            originalIssueDateFormatted: null,
            originalDepartureDate: null,
            originalReturnDate: null,
            voucherDiscount: null,
            aviosDiscount: null,
            passengersInfo: {
                totalAmount: 0,
                adults: 0,
                youngAdults: 0,
                teenagers: 0,
                seniors: 0,
                babies: 0,
                kids: 0,
                young: 0
            },
            pricesInfo: {
                totalTax: 0,
                noTax: 0
            },
            flightType: null
        };
    };

    private _setPnrType(model: any, isDisrupted: boolean, context: any) {
        if (this.isFlagShowFlexibilization(model)) {
            context.pnrType = MMBDatalayerConstants.DATALAYER_VALUES.FLEXIBLE;
        } else {
            if (isDisrupted) {
                context.pnrType = MMBDatalayerConstants.DATALAYER_VALUES.DISRUPTED;
            } else {
                context.pnrType = MMBDatalayerConstants.DATALAYER_VALUES.NON_FLEXIBLE;
            };
        };
    };

    private _getFlightStatus(model: any, isDisrupted: boolean, context: any) {
        let status = null;
        if (isDisrupted) {
            const result = this._analyzeFlightSegments(model.rawSlicesInfo, true);
            if (result.hasUN) {
                status = 'UN';
            } else if (result.hasUNTK) {
                status = 'UNTK';
            } else if (result.hasTK) {
                status = 'TK';
            } else {
                status = 'HK';
            }
        } else {
            // const result = this._analyzeFlightSegments(model.rawSlicesInfo, false);
            status = 'HK';
        }
        return status;
    };

    private _analyzeFlightSegments(rawSlicesInfo: any[], isDisrupted: boolean) {
        let sliceIndex = 0, firstFlightSelected = false, secondFlightSelected = false, hasUN = false, hasUNTK = false, hasTK = false;
        let cabinClasses = '', stopsPerSlice = '', carrier = '', identifierList = '';

        if (isDisrupted) {
            angular.forEach(rawSlicesInfo, (slice) => {
                let paramsDisruptedSlice = { slice, sliceIndex, slicesLength: rawSlicesInfo.length, firstFlightSelected, secondFlightSelected, stopsPerSlice };
                const sliceResult = this._processDisruptedSlice(paramsDisruptedSlice);
                hasUN = hasUN || sliceResult.hasUN;
                hasUNTK = hasUNTK || sliceResult.hasUNTK;
                hasTK = hasTK || sliceResult.hasTK;
                stopsPerSlice = sliceResult.stopsPerSlice;
                firstFlightSelected = sliceResult.firstFlightSelected;
                secondFlightSelected = sliceResult.secondFlightSelected;
                cabinClasses = sliceResult.cabinClassesAccum !== undefined ? sliceResult.cabinClassesAccum : cabinClasses;
                carrier += sliceResult.carrierPart;
                identifierList += sliceResult.identifierPart;
                sliceIndex++;
            });
        } else {
            angular.forEach(rawSlicesInfo, (slice) => {
                let paramsNormalSlice = { slice, sliceIndex, slicesLength: rawSlicesInfo.length, firstFlightSelected, secondFlightSelected, cabinClasses };
                const sliceResult = this._processNormalSlice(paramsNormalSlice);
                firstFlightSelected = sliceResult.firstFlightSelected;
                secondFlightSelected = sliceResult.secondFlightSelected;
                cabinClasses = sliceResult.cabinClassesAccum;
                carrier += sliceResult.carrierPart;
                identifierList += sliceResult.identifierPart;
                sliceIndex++;
            });
        };
        return { hasUN, hasUNTK, hasTK, cabinClasses, stopsPerSlice, carrier, identifierList };
    };

    private _processDisruptedSlice(params) {
        let { slice, sliceIndex, slicesLength, firstFlightSelected, secondFlightSelected, stopsPerSlice } = params;
        const segmentResult = this._accumulateDisruptedSegmentResults(slice, sliceIndex, slicesLength);

        let updatedStopsPerSlice = stopsPerSlice;
        let updatedFirstFlightSelected = firstFlightSelected;
        let updatedSecondFlightSelected = secondFlightSelected;
        if (sliceIndex === 1 && !firstFlightSelected) {
            updatedStopsPerSlice = 'IDA:' + slice.stopsNumber;
            updatedFirstFlightSelected = true;
        } else if (!secondFlightSelected) {
            updatedStopsPerSlice += '-VUELTA:' + slice.stopsNumber;
            updatedSecondFlightSelected = true;
        };

        let cabinClassesAccum = '';
        let cabinClsTitle = sliceIndex === 1 ? 'IDA:' : 'VUELTA:';
        if (sliceIndex === 1) {
            cabinClassesAccum = cabinClsTitle + segmentResult.sliceCabinClasses + ',';
        } else {
            cabinClassesAccum += cabinClsTitle + segmentResult.sliceCabinClasses;
        };
        return {
            hasUN: segmentResult.hasUN,
            hasUNTK: segmentResult.hasUNTK,
            hasTK: segmentResult.hasTK,
            stopsPerSlice: updatedStopsPerSlice,
            firstFlightSelected: updatedFirstFlightSelected,
            secondFlightSelected: updatedSecondFlightSelected,
            cabinClassesAccum,
            carrierPart: segmentResult.carrierPart,
            identifierPart: segmentResult.identifierPart
        };
    };

    private _accumulateDisruptedSegmentResults(slice, sliceIndex, slicesLength) {
        return slice.segments.reduce(
            (acc, segment, index, arr) => {
                const paramsDisruptedSegment = { segment, sliceIndex, slicesLength, index, listLength: arr.length };
                const segResult = this._processDisruptedSegment(paramsDisruptedSegment);
                return {
                    hasUN: acc.hasUN || segResult.hasUN,
                    hasUNTK: acc.hasUNTK || segResult.hasUNTK,
                    hasTK: acc.hasTK || segResult.hasTK,
                    identifierPart: acc.identifierPart + segResult.identifierPart,
                    carrierPart: acc.carrierPart + segResult.carrierPart,
                    sliceCabinClasses: acc.sliceCabinClasses + segResult.cabinClassPart
                };
            },
            { hasUN: false, hasUNTK: false, hasTK: false, identifierPart: '', carrierPart: '', sliceCabinClasses: '' }
        );
    };

    private _processDisruptedSegment(params) {
        let { segment, sliceIndex, slicesLength, index, listLength } = params;
        const segStatus = this._processSegmentStatus(segment);
        const identifierPart = this._getIdentifierPart(segment, sliceIndex, slicesLength);
        const carrierPart = this._getCarrierPart(segment, sliceIndex, slicesLength);
        const cabinClassPart = this._getCabinClassPart(segment, index, listLength);
        return {
            hasUN: segStatus.hasUN,
            hasUNTK: segStatus.hasUNTK,
            hasTK: segStatus.hasTK,
            identifierPart,
            carrierPart,
            cabinClassPart
        };
    };

    private _processNormalSlice(params) {
        let { slice, sliceIndex, slicesLength, firstFlightSelected, secondFlightSelected, cabinClasses } = params;
        let cabinClassesAccum = cabinClasses, carrierPart = '', identifierPart = '';
        angular.forEach(slice.segments, (segment) => {
            if (sliceIndex === 1 && !firstFlightSelected) {
                cabinClassesAccum = 'IDA:';
                firstFlightSelected = true;
            } else if (sliceIndex > 1 && !secondFlightSelected) {
                cabinClassesAccum += 'VUELTA:';
                secondFlightSelected = true;
            }
            identifierPart += this._getIdentifierPart(segment, sliceIndex, slicesLength);
            carrierPart += this._getCarrierPart(segment, sliceIndex, slicesLength);
            cabinClassesAccum += (segment.cabin.bookingClass ? segment.cabin.bookingClass : 'ND') + ',';
        });
        return { firstFlightSelected, secondFlightSelected, cabinClassesAccum, carrierPart, identifierPart };
    };

    private _processSegmentStatus(segment) {
        return {
            hasUN: segment.status.code === 'UN',
            hasUNTK: segment.status.code === 'UNTK',
            hasTK: segment.status.code === 'TK'
        };
    }

    private _getIdentifierPart(segment, sliceIndex, slicesLength) {
        if (!segment.id) return '';
        return (sliceIndex === slicesLength - 1) ? segment.id : segment.id + '-';
    }

    private _getCarrierPart(segment, sliceIndex, slicesLength) {
        if (!segment.flight.operationalCarrier) return '';
        return (sliceIndex === slicesLength - 1) ? segment.flight.operationalCarrier.code : segment.flight.operationalCarrier.code + '-';
    }

    private _getCabinClassPart(segment, index, listLength) {
        if (index === listLength - 1) {
            return segment.cabin.bookingClass ? segment.cabin.bookingClass : 'ND';
        } else {
            return (segment.cabin.bookingClass ? segment.cabin.bookingClass : 'ND') + ',';
        };
    };

    private _fillDisruptedFlightInfo(model: any, context: any) {
        if (model.selectorFlights && model.selectorFlights.flights) {
            this._getFlightTypeAndOriginalDatesForContext(model.selectorFlights, context);
            if (model.tickets) {
                this._getOriginalIssueDateAndAnticipationDaysForContext(model.tickets, context);
            };
        };
        if (model.orderItems) {
            this._generateOrderItemsInfoForContext(model.orderItems, context);
        };
        if (model.passengersInfo) {
            this._generatePassengersInfoForContext(model.passengersInfo, context);
        };
    };

    private _fillFlexFlightInfo(model: any, context: any) {
        if (model.yourFlightsModel && model.yourFlightsModel.flights) {
            this._getFlightTypeAndOriginalDatesForContext(model.yourFlightsModel, context);
        };
        if (model.managementModel) {
            this._isManagementModel(model, context);
        };
        if (model.bookingGeneralInfo) {
            if (model.bookingGeneralInfo.tickets) {
                this._getOriginalIssueDateAndAnticipationDaysForContext(model.bookingGeneralInfo.tickets, context);
            };
        };
        if (model.passengersModel) {
            this._generatePassengersInfoForContext(model.passengersModel.passengers, context);
        };
    };

    private _isManagementModel(model, context) {
        if (model.managementModel.orderItems) {
            this._generateOrderItemsInfoForContext(model.managementModel.orderItems, context);
        }
        if (model.managementModel.aviosRedeemed) {
            context.aviosDiscount = model.managementModel.aviosRedeemedAmount;
        }
    };

    private _fillDatalayerPricesInfo(model: any, context: any) {
        context.pricesInfo.totalTax = this._getTotalTaxFromPricesInfo(model.pricesInfo);
        context.pricesInfo.noTax = this._getNoTaxFromPricesInfo(model.pricesInfo);
    };

    private _getTotalTaxFromPricesInfo(pricesInfo: any): number {
        if (pricesInfo?.total && Number(pricesInfo.total)) {
            return pricesInfo.total;
        }
        if (pricesInfo?.totalPaid && Number(pricesInfo.totalPaid)) {
            return pricesInfo.totalPaid;
        };
        return 0;
    };

    private _getNoTaxFromPricesInfo(pricesInfo: any): number {
        if (pricesInfo?.fare && Number(pricesInfo.fare)) {
            return pricesInfo.total;
        };
        return 0;
    };

    private _getFlightTypeAndOriginalDatesForContext(flightsModel: any, context: any) {
        let slicesIds: string[] = [];
        let flightsCount = 0;
        let paramsDatesForContext = {};
        for (let sliceId in flightsModel.flights) {
            flightsCount++;
            slicesIds.push(sliceId);
        };
        const firstFlight = slicesIds[0];
        context.originDestination = flightsModel.flights[firstFlight].departureCity.code + '-' + flightsModel.flights[firstFlight].arrivalCity.code;
        context.countries = flightsModel.flights[firstFlight].departureCountry + '-' + flightsModel.flights[firstFlight].arrivalCountry;
        if (flightsCount >= 2) {
            const secondFlight = slicesIds[1];
            if (flightsModel.flights[firstFlight].arrivalCity.code !== flightsModel.flights[secondFlight].departureCity.code) {
                context.flightType = MMBDatalayerConstants.DATALAYER_VALUES.MULTIPLE_TRIP;
            } else {
                context.flightType = MMBDatalayerConstants.DATALAYER_VALUES.RETURN_TRIP;
            };
            if (flightsModel.flights[firstFlight].departureCountry !== flightsModel.flights[secondFlight].departureCountry &&
                flightsModel.flights[firstFlight].departureCountry !== flightsModel.flights[firstFlight].arrivalCountry) {
                context.countries = context.countries + '-' + flightsModel.flights[secondFlight].departureCountry;
            };
            paramsDatesForContext = {tripType: MMBDatalayerConstants.DATALAYER_VALUES.RETURN_TRIP, flightsModel, firstFlight, secondFlight, context};
            this._getOriginalFlightDatesForContext(paramsDatesForContext);
        } else {
            context.flightType = MMBDatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
            paramsDatesForContext = {tripType: MMBDatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP, flightsModel, firstFlight, secondFlight: null, context};
            this._getOriginalFlightDatesForContext(paramsDatesForContext);
        };
    };

    private _getOriginalFlightDatesForContext(params) {
        let {tripType, flightsModel, firstFlight, secondFlight, context} = params;
        switch (tripType) {
            case MMBDatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP:
                context.originalDepartureDate = flightsModel.flights[firstFlight].departureDateParsed.formatedDate;
                break;
            case MMBDatalayerConstants.DATALAYER_VALUES.RETURN_TRIP:
                context.originalDepartureDate = flightsModel.flights[firstFlight].departureDateParsed.formatedDate;
                context.originalReturnDate = flightsModel.flights[secondFlight].departureDateParsed.formatedDate;
                break;
        }
        if (!context.originalReturnDate) {
            context.originalFlightDate = context.originalDepartureDate;
        } else {
            context.originalFlightDate = context.originalDepartureDate + '-' + context.originalReturnDate;
            context.daysInDestination = this.getDaysDifference(context.originalReturnDate, context.originalDepartureDate);
        }
    }

    private _getOriginalIssueDateAndAnticipationDaysForContext(ticketsList: any[], context: any) {
        let originalIssueDate = null;
        let originalIssueDateFormatted = null;
        angular.forEach(ticketsList, (ticket) => {
            if (ticket.issueDateTime) {
                originalIssueDate = ticket.issueDateTime;
                originalIssueDateFormatted = this.$filter('DateFormatFilter')(originalIssueDate).formatedDate;
            };
        });
        context.originalIssueDateFormatted = originalIssueDateFormatted;
        context.anticipationDays = this.getDaysDifference(context.originalDepartureDate, originalIssueDateFormatted);
    };

    private _generateOrderItemsInfoForContext(orderItemsList: any, context: any) {
        for (let orderItemId in orderItemsList) {
            switch (orderItemId) {
                case 'seat':
                    context.hasSeats = true;
                    context.seatsPrice = this.getPrices(orderItemsList[orderItemId]);
                    break;
                case 'baggage':
                    context.hasBaggages = true;
                    context.baggagesPrice = this.getPrices(orderItemsList[orderItemId]);
                    break;
                case 'specialNeed':
                    context.hasSpecialNeeds = true;
                    break;
                case 'insurance':
                    context.hasInsurance = true;
                    context.insurancePrice = this.getPrices(orderItemsList[orderItemId]);
                    break;
                case 'specialMeal':
                    context.hasSpecialNeeds = true;
                    break;
            };
        };
    };
    private getPrices = (itemList) => {
        let totalPrice = 0;
        for (let index = 0; index < itemList.length; index++) {
            totalPrice += itemList[index].price ? itemList[index].price.total : 0;
        };
        return totalPrice;
    };

    private _generatePassengersInfoForContext(passengersModel: any[], context: any) {
        context.passengersInfo.totalAmount = passengersModel.length;
        angular.forEach(passengersModel, (passenger) => {
            switch (passenger.passengerType) {
                case 'ADULT':
                    context.passengersInfo.adults++;
                    break;
                case 'SENIOR':
                    context.passengersInfo.seniors++;
                    break;
                case 'YOUTH':
                    context.passengersInfo.young++;
                    break;
                case 'YOUNG':
                    context.passengersInfo.teenagers++;
                    break;
                case 'YOUNG_ADULT':
                    context.passengersInfo.youngAdults++;
                    break;
                case 'CHILD':
                    context.passengersInfo.kids++;
                    break;
                case 'INFANT':
                    context.passengersInfo.babies++;
                    break;
            };
        });
    };
};
