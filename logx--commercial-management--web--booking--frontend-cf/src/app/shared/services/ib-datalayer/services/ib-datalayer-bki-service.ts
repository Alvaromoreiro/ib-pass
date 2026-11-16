import * as angular from 'angular';
import { cloneDeep } from 'lodash-es';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { DigitalDataService } from '@shared/services/ib-datalayer/services/ib-digital-data.service';
import { DatalayerConstants } from '../constants/ib-datalayer-constants';
import { DatalayerBKIConstants } from '../constants/ib-datalayer-bki-constants';
import { DatalayerGeneralConstants } from '../constants/ib-datalayer-general-constants';
import { DigitalDataPropertiesUtilsService } from './ib-digital-data-properties-utils.service';
@Service('ib-datalayer-bki-module',
    ['localStorageService', 'CommonsConstants',
        'CommonsUtilService', '$rootScope',
        'DatalayerUtilsService', 'BookingAppConstants', 'DigitalDataService', 'BookingUtilService',
        'CommonsSessionStorageService', 'DigitalDataPropertiesUtilsService'],
    ['ib-commons-constants-module', 'ib-monetate-bki-module'])
export class DatalayerBKIService {
    public DATALAYER_ERROR_ATTR: string[] = [DatalayerConstants.DATALAYER_INFO.ERROR_CODE, DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION, DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE];
    public DATALAYER_MODAL_ATTR: string[] = [DatalayerConstants.DATALAYER_INFO.MODAL_ID];
    public LANG: string;
    public MARKET: string;
    constructor (
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsConstants: CommonsConstantsType,
        private CommonsUtilService: CommonsUtilService,
        private $rootScope: CommonsRootScope,
        private DatalayerUtilsService: DatalayerUtilsService,
        private BookingAppConstants: BookingAppConstants,
        private DigitalDataService: DigitalDataService,
        private BookingUtilService: any,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DigitalDataPropertiesUtilsService: DigitalDataPropertiesUtilsService
    ) {

    }

    addSlicesResults = (datalayerObject = {}, availabilityData) => {
        const ods = availabilityData?.originDestinations ?? [];
        for (let i=1; i<=ods.length; i++) {
            datalayerObject[`Slice${i}Results`] = (ods[i-1]?.slices?.length ?? 0).toString();
        }
    };

    generateDigitalDataAvailability = (availabilityData): object => {
        const datalayerObject = {};
        let isMultipleTrip:boolean =  this.localStorageService.get('multiCitySearch') ?? false;
        datalayerObject[DatalayerBKIConstants.SEARCH_CITY] = '';
        datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN] = '';
        datalayerObject[DatalayerBKIConstants.SEARCH_DEST] = '';
        datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRY] = '';
        datalayerObject[DatalayerBKIConstants.ADVANCE_PURCHASE] = '';
        datalayerObject[DatalayerBKIConstants.SEARCH_OD] = '';
        datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRIES] = '';
        this.setDigitalDataAvailabilityParams(datalayerObject, availabilityData);
        if (isMultipleTrip) {
            this.setMultiTripAvailabityDigitalData(datalayerObject, availabilityData);
        } else {
            this.setAvailabilityDigitalData(datalayerObject, availabilityData);
        }
        this.setSearchCountriesODDigitalData(datalayerObject, availabilityData, isMultipleTrip);
        this.setStopoverLegDigitalData(datalayerObject);
        this.setPaxDigitalData(datalayerObject);
        this.localStorageService.set('confirmationDigitalInfo', datalayerObject);
        return datalayerObject;
    };

    private setDigitalDataAvailabilityParams = (datalayerObject, availabilityData) => {
        const generalInfo: CommonsDatalayerServiceTypes.GeneralInfoDatalayer = this.localStorageService.get('bookingUrlParams');
        const largeFamilyValue = this.DatalayerUtilsService.changeLargeFamilyValue(generalInfo.largeFamilyType);
        let typeSearch: string = this.DatalayerUtilsService.getTypeSearch(true);
        typeSearch?.length > 0 && (datalayerObject[DatalayerBKIConstants.SEARCH_TYPE] = typeSearch);
        datalayerObject[DatalayerBKIConstants.FLIGHT_HAUL] = availabilityData.flightRatio ? availabilityData.flightRatio : '';
        datalayerObject[DatalayerGeneralConstants.PROCESS] = this.DigitalDataPropertiesUtilsService.setProcess();
        datalayerObject[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.DISPO;
        largeFamilyValue && (datalayerObject[DatalayerBKIConstants.LARGE_FAMILY] = largeFamilyValue);
        generalInfo.resident && (datalayerObject[DatalayerBKIConstants.RESIDENT_CODE] = generalInfo.resident);
        datalayerObject[DatalayerBKIConstants.PROCESS_START] =
        `${this.DatalayerUtilsService.LANG}/${this.DatalayerUtilsService.MARKET}/${generalInfo.searchOrigin ? generalInfo.searchOrigin :  this.BookingAppConstants.QUADRIGAMS.MULTI_ORIGIN}`;
        if (generalInfo.codeTracking) {
            datalayerObject[DatalayerGeneralConstants.CODE_TRACKING] = generalInfo.codeTracking;
            datalayerObject[DatalayerGeneralConstants.USER_SEGMENT] = DatalayerConstants.DATALAYER_USER_LEVELS.COLECTIVO;
        }
        if (generalInfo.travelAgent) {
            datalayerObject[DatalayerGeneralConstants.CODE_TRACKING] =
                `${DatalayerConstants.DATALAYER_PREFIX.AGENTS}${generalInfo.travelAgent}`;
            datalayerObject[DatalayerGeneralConstants.USER_SEGMENT] = DatalayerConstants.DATALAYER_USER_LEVELS.PSEUDOAGENCIA;
        }
    };

    private setMultiTripAvailabityDigitalData = (datalayerObject, availabilityData) => {
        const bookingInfoMulti:CommonsDatalayerServiceTypes.OriginDestinationMulticityDatalayer[] = this.localStorageService.get('originDestinationMulticity');
        datalayerObject[DatalayerBKIConstants.SEARCH_DEST_NAME] = '';
        datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = '';
        for (let i = 0; i < bookingInfoMulti.length; i++) {
            datalayerObject[DatalayerBKIConstants.PAX_TOTAL] = bookingInfoMulti[i].numberPassengrsWithoutInfant.toString();
            datalayerObject[DatalayerBKIConstants.SEARCH_CITY] +=
                `${datalayerObject[DatalayerBKIConstants.SEARCH_CITY].length > 0 ? '-' : ''}${bookingInfoMulti[i].destinationCity.code}`;
            datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN] +=
                `${datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN].length > 0 ? '-' : ''}${bookingInfoMulti[i].originCity.code}`;
            datalayerObject[DatalayerBKIConstants.SEARCH_DEST] +=
                `${datalayerObject[DatalayerBKIConstants.SEARCH_DEST].length > 0 ? '-' : ''}${bookingInfoMulti[i].destinationCity.code}`;
            datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRY] +=
                `${datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRY].length > 0 ? '-' : ''}${bookingInfoMulti[i].originCity.country.code}`;
            datalayerObject[DatalayerBKIConstants.ADVANCE_PURCHASE] +=
                    `${datalayerObject[DatalayerBKIConstants.ADVANCE_PURCHASE].length > 0 ? '-' : ''}${this.getAdvancePurchaseValue(bookingInfoMulti[i].dates.formatedOutboundFlight)}`;
        }
        datalayerObject[DatalayerBKIConstants.SEARCH_DEST_NAME] = bookingInfoMulti[bookingInfoMulti.length-1].originCity.description;
        datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = bookingInfoMulti[0].originCity.description;
        datalayerObject[DatalayerBKIConstants.LENGTH_STAY] = '0';
        datalayerObject[DatalayerBKIConstants.FLIGHT_TYPE] = DatalayerConstants.DATALAYER_VALUES.MULTIPLE_TRIP;
        this.addSlicesResults(datalayerObject, availabilityData);
    };

    private setAvailabilityDigitalData = (datalayerObject, availabilityData) => {
        const bookingInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        if (bookingInfo.originCity && bookingInfo.destinationCity) {
            datalayerObject[DatalayerBKIConstants.PAX_TOTAL] = bookingInfo.numberPassengrsWithoutInfant.toString();
            datalayerObject[DatalayerBKIConstants.SEARCH_CITY] = bookingInfo.destinationCity.code;
            datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN] = bookingInfo.originCity.code;
            datalayerObject[DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = bookingInfo.originCity.description;
            datalayerObject[DatalayerBKIConstants.SEARCH_DEST] = bookingInfo.destinationCity.code;
            datalayerObject[DatalayerBKIConstants.SEARCH_DEST_NAME] = bookingInfo.destinationCity.description;
            datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRY] = bookingInfo.originCity.country.code;
        }
        datalayerObject[DatalayerBKIConstants.LENGTH_STAY] =
                bookingInfo.dates.formatedReturnFlight && bookingInfo.dates.formatedOutboundFlight ?
                    Math.round(((new Date(bookingInfo.dates.formatedReturnFlight).getTime() - new Date(bookingInfo.dates.formatedOutboundFlight).getTime()) / (1000 * 60 * 60 * 24))).toString() :
                    '0';
        datalayerObject[DatalayerBKIConstants.ADVANCE_PURCHASE] = this.getAdvancePurchaseValue(bookingInfo.dates.formatedOutboundFlight).toString();
        datalayerObject[DatalayerBKIConstants.FLIGHT_TYPE] = this.DatalayerUtilsService.getTripType(availabilityData);
        if (!this.$rootScope.isRedemptionFlow) {
            this.addSlicesResults(datalayerObject, availabilityData);
        }
    };

    private setSearchCountriesODDigitalData = (datalayerObject, availabilityData, isMultipleTrip:boolean ) => {
        availabilityData.originDestinations.forEach(originDestination => {
            this.setSearchODDigitalData(datalayerObject, availabilityData, originDestination, isMultipleTrip);
            datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
            (datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') +
            originDestination.originCity.countryCode;
            datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
            availabilityData.originDestinations.length > 1 ? '' : ((datalayerObject[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + originDestination.destinationCity.countryCode);
        });
    };
    
    private setSearchODDigitalData = (datalayerObject, availabilityData, originDestination, isMultipleTrip) => {
        const separator = isMultipleTrip ? '/' : ',';
        datalayerObject[DatalayerBKIConstants.SEARCH_OD] +=
                    (datalayerObject[DatalayerBKIConstants.SEARCH_OD].length > 0 ? separator : '') +
                    originDestination.origin;
        isMultipleTrip ? 
            datalayerObject[DatalayerBKIConstants.SEARCH_OD] +=
                    availabilityData.originDestinations.length > 1 ? ((datalayerObject[DatalayerBKIConstants.SEARCH_OD].length > 0 ? '-' : '') + originDestination.destination):'':
            datalayerObject[DatalayerBKIConstants.SEARCH_OD] +=
                    availabilityData.originDestinations.length > 1 ? '' : ((datalayerObject[DatalayerBKIConstants.SEARCH_OD].length > 0 ? separator : '') + originDestination.destination);
    };

    private setStopoverLegDigitalData = (datalayerObject) => {
        let isHMAD : boolean = this.localStorageService.get('isHMAD');
        if(isHMAD) {
            const stopoverLeg = this.BookingAppConstants.BOOKING_PARAMS_NAMES.STOPOVER_LEG;
            let StopLegValue = this.BookingUtilService.getURLFirstParameterByName(stopoverLeg);
            if(!StopLegValue) {
                const lastSearch : any[] = this.localStorageService.get('lastSearchsSO');
                const stopOverIda = lastSearch?.length > 0 ? lastSearch[0].stopOverIda : false;
                const lastSearchValue = stopOverIda ? 'ida' : 'vuelta';
                StopLegValue = lastSearchValue;
            }
            datalayerObject[DatalayerBKIConstants.STOPOVER_LEG] = StopLegValue;
        }
    };

    private setPaxDigitalData = (datalayerObject) => {
        const bookingInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        bookingInfo.numAdults && (datalayerObject[DatalayerBKIConstants.PAX_ADULT] = bookingInfo.numAdults.toString());
        bookingInfo.numChilds && (datalayerObject[DatalayerBKIConstants.PAX_CHILD] = bookingInfo.numChilds.toString());
        bookingInfo.numInfant && (datalayerObject[DatalayerBKIConstants.PAX_INFANT] = bookingInfo.numInfant.toString());
        bookingInfo.numSeniors && (datalayerObject[DatalayerBKIConstants.PAX_SENIOR] = bookingInfo.numSeniors.toString());
        bookingInfo.numYoung && (datalayerObject[DatalayerBKIConstants.PAX_YOUNG] = bookingInfo.numYoung.toString());
        bookingInfo.numTeenager && (datalayerObject[DatalayerConstants.DATALAYER_INFO.NUM_TENNEAGER] = bookingInfo.numTeenager.toString());
    };

    generateDigitalDataPassengers = (slices, priceInfo, currency, haul): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        const discountType: boolean = this.localStorageService.get('oBDiscountType');
        let cabinClass = '',
            isMultipleTrip: boolean = false;
        
        isMultipleTrip = this.localStorageService.get('multiCitySearch');
        datalayerObject[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.PASSENGERS;

        if (slices?.length > 0) {
            datalayerObject[DatalayerGeneralConstants.ORIGIN_DESTINATIONS] = '';
            this.setAirportSeg(slices, datalayerObject, isMultipleTrip);
            cabinClass = this.setSliceOperators(slices, datalayerObject, cabinClass, isMultipleTrip);
        }
        datalayerObject[DatalayerBKIConstants.IBPLUS_HOLDER] = this.localStorageService.get('userLogged') ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[DatalayerGeneralConstants.BOOKING_CLASS] = cabinClass;
        datalayerObject[DatalayerGeneralConstants.CURRENCY] = currency;
        this.setTotalPrice(priceInfo, datalayerObject);
        if (this.$rootScope.membershipData) {
            datalayerObject[DatalayerBKIConstants.PURCHASE_TYPE] = discountType ? 'puntos': 'descuento';
        }
        this.localStorageService.set('confirmationDigitalInfo', datalayerObject);
        return datalayerObject;
    };

    private setAirportSeg = (slices, datalayerObject, isMultipleTrip:boolean) => {
        if(isMultipleTrip){
            slices.forEach(slice => {
                let originDestination = '';
                originDestination = slice.segments.length>1 ? slice.segments[0].departure.code + '-' + slice.segments[1].arrival.code : slice.segments[0].departure.code + '-' + slice.segments[0].arrival.code;
                datalayerObject[DatalayerGeneralConstants.ORIGIN_DESTINATIONS] +=
                    (datalayerObject[DatalayerGeneralConstants.ORIGIN_DESTINATIONS].length > 0 ? ',' : '') +
                    originDestination;
            });
        } else {
            datalayerObject[DatalayerGeneralConstants.ORIGIN_DESTINATIONS] +=
                (datalayerObject[DatalayerGeneralConstants.ORIGIN_DESTINATIONS].length > 0 ? '-' : '') +
                    this.$rootScope.isRedemptionFlow ? slices[0].segments[0].departure.city.code + '-' + slices[0].segments[slices[0].segments.length - 1].arrival.city.code :
                    slices[0].segments[0].departure.code + '-' + slices[0].segments[slices[0].segments.length - 1].arrival.code;
        }
    };

    private setTotalPrice = (priceInfo, datalayerObject) => {
        let tax = priceInfo?.tax;
        if (this.$rootScope.isRedemptionFlow) {
            const tempTotalPrice = this.getTempTotalPrice(priceInfo);
            this.setRedemptionTotalPrice(datalayerObject, tempTotalPrice, tax, priceInfo);
        } else {
            datalayerObject[DatalayerBKIConstants.TOTAL_PRICE] = priceInfo?.total ?? 0;
            datalayerObject[DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = priceInfo?.fare ?? 0;
        }
        datalayerObject[DatalayerBKIConstants.TOTAL_TAXES] = tax ?? 0;
    };

    private getTempTotalPrice = (priceInfo) => priceInfo?.price?.totalCash?.toString()?.replace(',', '.') ?? '0';
    
    private setRedemptionTotalPrice = (datalayerObject, tempTotalPrice, tax, priceInfo) => {
        datalayerObject[DatalayerBKIConstants.TOTAL_PRICE] = tempTotalPrice.substr(0, tempTotalPrice.length - 1);
        datalayerObject[DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = tempTotalPrice && tax ? parseFloat((tempTotalPrice.substr(0, tempTotalPrice.length - 1) - tax).toString()).toFixed(2) : 0;
        datalayerObject[DatalayerGeneralConstants.TOTAL_PRICE_AVIOS] = priceInfo?.price?.totalAvios?.toString()?.replace('.', '')?.replace(',', '') ?? 0;
    };
    private setSliceOperators = (slices, datalayerObject, cabinClass, isMultipleTrip) => {
        const fareFamilies: string[] = [], cabins: string[] = [];
        let fareFamily = '';
        slices.forEach((slice, i) => {
            if (slice.segments.length > 0) {  
                datalayerObject[`Slice${i + 1}Flights`] = '';
                datalayerObject[`Slice${i + 1}Operator`] = '';
                this.setSliceDate(datalayerObject, slice.departureDateTime, i);
                this.setSliceRouting(slice, i, datalayerObject, isMultipleTrip);
                fareFamily = '';
                slice.segments.forEach(segment => {
                    fareFamilies[i] = fareFamilies[i] || '';
                    cabins[i] = cabins[i] || '';
                    fareFamilies[i] += (fareFamilies[i].length > 0 ? ',' : '') + (segment.cabin.fareFamily || DatalayerConstants.DATALAYER_VALUES.FARE_FAMILY_STANDARD);
                    cabins[i] += (cabins[i].length > 0 ? '-' : '') + (segment.cabin.bookingClass || DatalayerConstants.DATALAYER_VALUES.CABIN_FAMILY_STANDARD);
                    this.setSliceFlightsOperator(datalayerObject, segment, i);
                    cabinClass = this.getCabinClass(cabinClass, segment.cabin, slice.segments[0].cabin.bookingClass);
                    fareFamily = this.getFareFamily(fareFamily, segment.cabin.fareFamily);
                });
                datalayerObject[`Slice${i+1}Cabin`] = cabins[i];
                datalayerObject[`Slice${i+1}FareFamily`] = fareFamily;
            }
        });
        return cabinClass;
    };

    private setSliceRouting = (slice, i, datalayerObject, isMultipleTrip) => {
        let sliceRoute = slice.segments[0].departure.city.code + '-' + slice.segments[0].arrival.city.code;
        if(isMultipleTrip){
            sliceRoute = slice.segments.length>1 ? slice.segments[0].departure.city.code + '-' + slice.segments[slice.segments.length-1].arrival.city.code : sliceRoute;
        } else {
            for(let j = 1; j < slice.segments.length; j++){
                sliceRoute = sliceRoute + '-' + slice.segments[j].arrival.city.code;
            }
        }
        datalayerObject[`Slice${i+1}Routing`] = sliceRoute;
        
    };

    private setSliceDate = (datalayerObject, departureDateTime, i) => {
        if(departureDateTime){
            let departureYear = departureDateTime.substring(0, 4);
            let departureMonth = departureDateTime.substring(5, 7);
            let departureDay = departureDateTime.substring(8, 10);
            datalayerObject[`Slice${i+1}Date`] = departureDay + '/' + departureMonth + '/' + departureYear;
        }
    };

    private setSliceFlightsOperator = (datalayerObject, segment, i) => {
        datalayerObject[`Slice${i+1}Flights`] +=
                    (datalayerObject[`Slice${i+1}Flights`].length > 0 ? '-' : '') +
                    segment.flight.operationalDisclosure + (segment.flight.operationalFlightNumber || segment.flight.marketingFlightNumber);
        datalayerObject[`Slice${i+1}Operator`] +=
                    (datalayerObject[`Slice${i+1}Operator`].length > 0 ? '-' : '') +
                    segment.flight.operationalDisclosure;
    };

    private getCabinClass = (cabinClass, cabin, bookingClass) => {
        if (cabin && angular.isString(bookingClass)) {
            cabinClass = cabinClass === '' || DatalayerConstants.SEGMENT_CABIN_PRIORITY[cabinClass] > DatalayerConstants.SEGMENT_CABIN_PRIORITY[cabin.bookingClass.charAt(0)]
                ? cabin.bookingClass.charAt(0) : cabinClass;
        }
        return cabinClass;
    };

    private getFareFamily = (fareFamily, fareFamilyCabin) => {
        this.CommonsSessionStorageService.get<AvailabilityModels.FareFamilyContions[]>('fareFamilyConditionsInfo').forEach((fare) => {
            if(fare.commercialCode === fareFamilyCabin) {
                fareFamily+= (fareFamily==='' ? '' : '-') + fare.commercialNameES;
            }
        });
        return fareFamily;
    };

    generateDigitalDataAncillaries = (): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        datalayerObject[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.ANCILLARIES;
        this.DatalayerUtilsService.addDigitalDataInfo(datalayerObject);
        this.localStorageService.set('confirmationDigitalInfo', datalayerObject);
        return datalayerObject;
    };

    getDigitalDataEcommerce = (selectedSlices, event: string): void => {
        let dataEcomerce = this.transformEcommerceData(selectedSlices, event);
        this.DigitalDataService.addDigitalDataEcommerceEvent(dataEcomerce, event);
        if (event === 'add_to_cart') {
            // Set in cart flight info in just one object
            dataEcomerce = this.transformEcommerceData(selectedSlices, 'add_to_cart_payments');
            this.DigitalDataService.setAddInfoAddToCart(dataEcomerce);
        }
    };

    private transformEcommerceData = (selectedSlices, event) => {
        let digital_data_ecommerce: DatalayerBKIModel.ViewItemList = { items: []};
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo');
        const mergeFlights: boolean = ![DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, DatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST, DatalayerConstants.EVENTS_ECOMMERCE.BEGIN_CHECKOUT, DatalayerConstants.EVENTS_ECOMMERCE.ADD_SHIPPING_INFO, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART_PAYMENTS].includes(event);
        let totalPrice = 0;
        selectedSlices?.forEach((selectedSlice, index) => {
            const sliceInfo = selectedSlice?.info;
            const existFareFamily: boolean = sliceInfo.cabins?.[selectedSlice.cabin]?.fareFamilies;
            // Is shuttle slice
            if (sliceInfo?.type === 'SHUTTLE') {
                this.setItemEcommerceShuttle({digital_data_ecommerce, mergeFlights, totalPrice, selectedSlice, selectedSlices, confirmationDatalayerInfo, index, event});
            } else if(existFareFamily) {
                this.setItemEcommerce({digital_data_ecommerce, mergeFlights, totalPrice, selectedSlice, selectedSlices, confirmationDatalayerInfo, index, event});
            }
        });
        
        return digital_data_ecommerce;
    };

    private setItemEcommerceShuttle = ({digital_data_ecommerce, mergeFlights, totalPrice, selectedSlice, selectedSlices, confirmationDatalayerInfo, index, event}) => {
        const outboundRoute: string = this.getOutboundRoute(selectedSlice);
        const id: string = this.getIdItem('all');
        const brand: string = this.getBrand(selectedSlice.info.segments);
        const numSelectedSlices: number = selectedSlices.length;
        if (mergeFlights) {
            totalPrice += this.getPrice(selectedSlice.info.price.total);
        } else {
            totalPrice = this.getPrice(selectedSlice.info.price.total);
        }
        let item: DatalayerBKIModel.Item = {
            item_name: this.BookingAppConstants.ECOMMERCE.FLIGHT,
            item_id: id,
            price: totalPrice,
            item_brand: brand.toLowerCase(),
            item_category: this.getItemCategory(),
            item_category2: outboundRoute,
            item_category3: this.DatalayerUtilsService.getItemCategory3(event, outboundRoute, id),
            item_variant: this.getItemVariantShuttle(numSelectedSlices, mergeFlights, selectedSlice),
            quantity: Number(confirmationDatalayerInfo?.numeroPax)
        };
        if (!mergeFlights||index === selectedSlices.length - 1) {
            digital_data_ecommerce.items.push(item);
        }
    };

    private setItemEcommerce = ({digital_data_ecommerce, mergeFlights, totalPrice, selectedSlice, selectedSlices, confirmationDatalayerInfo, index, event}) => {
        const outboundRoute: string = this.getOutboundRoute(selectedSlice);
        const id: string = this.getIdItem('all');
        const brand: string = this.getBrand(selectedSlice.info.segments);
        const sliceInfo = selectedSlice?.info;
        const selectedFareFamily = sliceInfo?.selectedFareFamily;
        let isSameFareFamily:boolean = false;
        let fareFamilies: Array<any> = [];
        fareFamilies = selectedSlice.info.cabins[selectedSlice.cabin].fareFamilies;
        mergeFlights && (totalPrice += this.getPrice(selectedFareFamily.farePriceToCalculate ?? sliceInfo.slicePrice));
        
        fareFamilies.forEach(fareFamily => {
            let item: DatalayerBKIModel.Item = {
                item_name: this.BookingAppConstants.ECOMMERCE.FLIGHT,
                item_id: id,
                price: this.getPrice(fareFamily.farePriceToCalculate),
                item_brand: brand.toLowerCase(),
                item_category: this.getItemCategory(),
                item_category2: outboundRoute,
                item_category3: this.DatalayerUtilsService.getItemCategory3(event, outboundRoute, id),
                item_variant: this.getItemVariant(fareFamily),
                quantity: Number(confirmationDatalayerInfo?.numeroPax)
            };
            isSameFareFamily = fareFamily.cabinDescription === selectedFareFamily?.cabinDescription && fareFamily.commercialCode === selectedFareFamily?.commercialCode;
            this.pushEcommerceItems({digital_data_ecommerce, mergeFlights, totalPrice, selectedSlices, index, event, item, isSameFareFamily});
        });
    };
    
    private pushEcommerceItems = ({digital_data_ecommerce, mergeFlights, totalPrice, selectedSlices, index, event, item, isSameFareFamily}) => {
        if(event === DatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST || isSameFareFamily) {
            if (mergeFlights && index === selectedSlices.length - 1) {
                item.price = totalPrice;
                digital_data_ecommerce.items.push(item);
            }else if(!mergeFlights) {
                digital_data_ecommerce.items.push(item);
            }
        }  
    };

    public getIdItem = (type): string => {
        let idItem: string = '';

        const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
        const originDestinationMulticity: any = this.localStorageService.get('originDestinationMulticity');
        const flightsInfo: any = this.localStorageService.get('flightsInfo');
        if (type === 'all' && originDestinationMulticity) {
            idItem = this.setIdItemMulticity(originDestinationMulticity, idItem);
            
        } else if (availabilityRequestData) {
            idItem = availabilityRequestData?.slices.length === 1 || originDestinationMulticity ? availabilityRequestData.slices[0].origin + '-' + availabilityRequestData.slices[0].destination : availabilityRequestData.slices[0].origin + '-' + availabilityRequestData.slices[0].destination + '|' + availabilityRequestData.slices[0].destination + '-' + availabilityRequestData.slices[0].origin;
        } else if (flightsInfo) {
            idItem = this.setIdItemFlightsInfo(flightsInfo, idItem);
        }
        return idItem;

    };

    private setIdItemMulticity = (originDestinationMulticity, idItem:string):string => {
        originDestinationMulticity.forEach(slice => {
            if (idItem !== '') {
                idItem += '|';
            }
            idItem += slice.originCity.code + '-' + slice.destinationCity.code;
        });
        return idItem;
    };
    
    private setIdItemFlightsInfo = (flightsInfo, idItem:string):string => {
        flightsInfo.forEach(slice => {
            if (idItem !== '') {
                idItem += '|';
            }
            idItem += slice.departure.city.code + '-' + slice.arrival.city.code;
        });
        return idItem;
    };

    private getItemCategory = (): string => {
        const isHMAD = this.localStorageService.get('isHMAD');
        const isMultipleTrip = this.localStorageService.get('multiCitySearch');
        const isMetasearch = this.localStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH;
        if(isMetasearch) return this.BookingAppConstants.ECOMMERCE.METASEARCH;
        if(isHMAD) return this.BookingAppConstants.ECOMMERCE.STOPOVER_HMAD;
        if(isMultipleTrip) return this.BookingAppConstants.ECOMMERCE.MULTIPLE_JOURNEYS;
        return this.BookingAppConstants.ECOMMERCE.DIRECT_PURCHASE;
    };

    getBrand = (segments: any[]): string => {
        let brand: string = '';
        if(segments) {
            segments.forEach(segment => {
                brand += brand === '' ? segment.flight.operationalCarrier.name : '-' + segment.flight.operationalCarrier.name;
            });
        }
        return brand;
    };

    private getOutboundRoute = (selectedSlice): string => {
        return selectedSlice.origin + '-' + selectedSlice.destination;
    };

    private getItemVariant = (fareFamily: any): string => {
        return (fareFamily.cabinType.toLowerCase() + '_' + fareFamily.commercialNameES.toLowerCase()).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    private getItemVariantShuttle = (numSelectedSlices:number, mergeFlights:boolean, selectedSlice: any) =>{
        const cabinDesc = selectedSlice.info.cabinType.toLowerCase()+ '_' + selectedSlice.info.cabinFullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return (mergeFlights)? (numSelectedSlices > 1)? 'rt': 'ow' : cabinDesc;
    };

    emitEvent = (eventType: string) => {
        const extendedDigitalDataInfo = this.localStorageService.get('confirmationDigitalInfo');
        this.DigitalDataService.emitEvent(eventType, extendedDigitalDataInfo);
    };

    private getPrice (farePriceToCalculate: any){
        const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');
        if(bookingUrlParams.payWithAvios){
            return 0;
        } else {
            return farePriceToCalculate;
        }
    }

    getLengthStayMultipleTrip (slices){
        const datalayerObject = {};
        const isMultipleTrip:boolean = this.localStorageService.get('multiCitySearch') ? this.localStorageService.get('multiCitySearch') : false;
        if(isMultipleTrip){
            const lengthStay: number = Math.round(((new Date(slices[slices.length-1].arrivalDateTime).getTime() - new Date(slices[0].departureDateTime).getTime()) / (1000 * 60 * 60 * 24)));
            datalayerObject[DatalayerBKIConstants.LENGTH_STAY] = lengthStay;
            this.localStorageService.set('confirmationDigitalInfo', datalayerObject);
            this.DatalayerUtilsService.addDigitalDataInfo(datalayerObject);
        }

    }

    updateDigitalDataDynamicPricing = (offers) => {
        const dynamicPricing = {};
        if (offers) {
            offers.forEach(offer => {
                if (dynamicPricing && dynamicPricing[DatalayerBKIConstants.DYNAMIC_PRICING] === undefined && offer.specialDiscountsApplied && offer.specialDiscountsApplied.length > 0 && offer.specialDiscountsApplied[0].description !== undefined && offer.specialDiscountsApplied[0].type === DatalayerConstants.DISCOUNT_TYPES.DYNAMIC_PRICING) {
                    dynamicPricing[DatalayerBKIConstants.DYNAMIC_PRICING] = this.BookingAppConstants.DYNAMIC_PRICING_DESCRIPTIONS.SPECIAL_DISCOUNT;
                }
            });
        }
        this.DatalayerUtilsService.addDigitalDataInfo(dynamicPricing);
    };

    updateDatalayerObject = (selectedSlices) => {
        const confirmationDigitalInfo: unknown = this.localStorageService.get('confirmationDigitalInfo') || {};
        const fareData:any = this.localStorageService.get('fareData') || {};
        const cheapestFare = this.getCheapestFare(selectedSlices);
        this.setPaxPrice(fareData, confirmationDigitalInfo, confirmationDigitalInfo);
        confirmationDigitalInfo[DatalayerBKIConstants.CHEAPEST_FARE] = cheapestFare;
        this.updateDigitalDataSpecialDiscount(confirmationDigitalInfo, fareData);
        this.DatalayerUtilsService.addDigitalDataInfo(confirmationDigitalInfo);
        this.getDigitalDataEcommerce(selectedSlices, 'add_to_cart');
    };

    private getCheapestFare = (selectedSlices) =>{
        let bestPriceSelected = true;
        for (let i = 0; i < selectedSlices.length; i++) {
            bestPriceSelected = bestPriceSelected && selectedSlices[i].info.bestPrice
                && selectedSlices[i].info.slicePrice === selectedSlices[i].info.selectedFareFamily.farePriceToCalculate;
        }
        return bestPriceSelected ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
    };

    private setPaxPrice = (fareData, confirmationDatalayerInfo, confirmationDigitalInfo) => {
        if (fareData?.offers?.[0].offerItems) {
            confirmationDigitalInfo[DatalayerBKIConstants.PAX_PRICE] = '';
            for (let i = 0; i < fareData.offers[0].offerItems.length; i++) {
                for (let j = 0; j < fareData.offers[0].offerItems[i].passengerIds.length; j++) {
                    confirmationDigitalInfo[DatalayerBKIConstants.PAX_PRICE] +=
                            (confirmationDigitalInfo[DatalayerBKIConstants.PAX_PRICE].length > 0 ? ' : ' : '') +
                            fareData.offers[0].offerItems[i].price.total;
                }
            }
        }
    };

    updateDigitalDataSpecialDiscount = (confirmationDigitalInfo, fareData) => {
        if (fareData.offers && fareData.offers.length > 0 && fareData.offers[0].discountsApplied !== undefined) {
            confirmationDigitalInfo[DatalayerConstants.DATALAYER_INFO.ORIGINAL_TOTAL_PRICE] = fareData.offers[0].discountsApplied.originalPrice.total; //TODO
            if (fareData.offers[0].discountsApplied.discounts && fareData.offers[0].discountsApplied.discounts.length > 0) {
                fareData.offers[0].discountsApplied.discounts.forEach(discount => {
                    if (discount.type === DatalayerBKIConstants.DYNAMIC_PRICING) {
                        confirmationDigitalInfo[DatalayerConstants.DATALAYER_INFO.PERCENT_DISCOUNT] = fareData.offers[0].discountsApplied.discounts[0].percentDiscount; //TODO
                        confirmationDigitalInfo[DatalayerConstants.DATALAYER_INFO.TOTAL_DISCOUNT] = fareData.offers[0].discountsApplied.discounts[0].totalDiscount; //TODO
                        confirmationDigitalInfo[DatalayerBKIConstants.DYNAMIC_PRICING] = this.BookingAppConstants.DYNAMIC_PRICING_DESCRIPTIONS.SPECIAL_DISCOUNT;
                    }
                });
            }
        }
    };

    addflightRatio = (flightRatioData) => {
        const flightHaul = { FlightHaul: flightRatioData };
        this.BookingUtilService.addflightHaulInDigitalInfo(flightHaul);
    };

    addDestinationInfo = (originDestination, model) => {
        this.DatalayerUtilsService.addDestinationInfoDigitalData(originDestination, model);
        this.DatalayerUtilsService.updateDatalayerViewEvent();
    };

    getSpeqsVariant = (type: string): string => {
        switch (type) {
                case this.CommonsConstants.SPEQS_SUBTYPE.SKI_SNOW: return 'ski';
                case this.CommonsConstants.SPEQS_SUBTYPE.BICYCLE: return 'bike';
                case this.CommonsConstants.SPEQS_SUBTYPE.GOLF_EQUIPMENT: return 'golf';
                default: return '';
        }
    };

    getSliceById = ( id: string ): object => {
        let sliceById: object;
        const ancillariesInfo: any = this.CommonsSessionStorageService.get( 'ancillariesInfo' );
        ancillariesInfo?.slices.forEach( slice => {
            slice?.segmentIds.forEach( segmentId => {
                if ( segmentId === id ) {
                    sliceById = slice;
                }
            });
        });
        return sliceById;
    };

    setPayloadForGenerateDigitalData = () => {
        const availabilityRequestDataObject = this.localStorageService.get('availabilityRequestData'), originDestinationObject:any = this.localStorageService.get('originDestination'), bookingUrlParamsObject:any = this.localStorageService.get('bookingUrlParams'), originDestinationsArr = [], isMulticity = this.localStorageService.get('multiCitySearch');
        const hasOriginDestinations = availabilityRequestDataObject && bookingUrlParamsObject?.originDestinations[0];
        const originDestinationMulticity = this.localStorageService.get('originDestinationMulticity');
        let setDigitalDataPayload;
        if (!hasOriginDestinations) return [];
        if(isMulticity && originDestinationMulticity) {
            bookingUrlParamsObject.originDestinations.forEach((trip, index) => {
                const auxAvailabilityRequest = cloneDeep(availabilityRequestDataObject);
                setDigitalDataPayload = Object.assign(auxAvailabilityRequest, originDestinationMulticity[index], trip);
                setDigitalDataPayload.originCity.countryCode = originDestinationObject.originCity.country.code;
                setDigitalDataPayload.destinationCity.countryCode = originDestinationObject.destinationCity.country.code;
                originDestinationsArr.push(setDigitalDataPayload);
            });
        } else {
            bookingUrlParamsObject.originDestinations.forEach((trip, index) => {
                const auxAvailabilityRequest = cloneDeep(availabilityRequestDataObject);
                if(index > 0){
                    setDigitalDataPayload = Object.assign(auxAvailabilityRequest, {...originDestinationObject, originCity:originDestinationObject.destinationCity, destinationCity:originDestinationObject.originCity}, trip);
                    setDigitalDataPayload.originCity.countryCode = originDestinationObject.destinationCity.country.code;
                    setDigitalDataPayload.destinationCity.countryCode = originDestinationObject.originCity.country.code;
                } else{
                    setDigitalDataPayload = Object.assign(auxAvailabilityRequest, originDestinationObject, trip);
                    setDigitalDataPayload.originCity.countryCode = originDestinationObject.originCity.country.code;
                    setDigitalDataPayload.destinationCity.countryCode = originDestinationObject.destinationCity.country.code;
                }
                originDestinationsArr.push(setDigitalDataPayload);
            });
        }
        return originDestinationsArr;
    };

    generateDigitalDataShuttleError = () =>{
        const extendedDatalayerInfo = {};
        const bookingUrlParams: any= this.localStorageService.get('bookingUrlParams');
        const fareShuttleRequest: any= this.localStorageService.get('fareShuttleRequest');
        const largeFamilyInfo = this.DatalayerUtilsService.changeLargeFamilyValue(bookingUrlParams.largeFamilyType);

        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_CITY] = bookingUrlParams.originDestinations[0].destination;
        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_DEST] = bookingUrlParams.originDestinations[0].destination;
        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRY] = bookingUrlParams.market;
        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_ORIGIN] = bookingUrlParams.arrival;
        extendedDatalayerInfo[DatalayerBKIConstants.ADVANCE_PURCHASE] = DatalayerConstants.SHUTTLE_OPEN;
        extendedDatalayerInfo[DatalayerBKIConstants.LENGTH_STAY] = DatalayerConstants.SHUTTLE_OPEN;
        extendedDatalayerInfo[DatalayerBKIConstants.FLIGHT_TYPE] = bookingUrlParams.tripType === '2' ? DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
        extendedDatalayerInfo[DatalayerBKIConstants.FLIGHT_HAUL] = DatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_TYPE] = this.DatalayerUtilsService.getTypeSearch(true);
        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD] = '';
        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] = '';
        extendedDatalayerInfo[DatalayerGeneralConstants.USER_SEGMENT] = bookingUrlParams.tripType;
        extendedDatalayerInfo[DatalayerBKIConstants.PAX_ADULT] = bookingUrlParams.adult.toString();
        extendedDatalayerInfo[DatalayerBKIConstants.PAX_TOTAL] = bookingUrlParams.adult + bookingUrlParams.child +
                        bookingUrlParams.senior + bookingUrlParams.teenager + bookingUrlParams.young;
        largeFamilyInfo && (extendedDatalayerInfo[DatalayerBKIConstants.LARGE_FAMILY] = largeFamilyInfo);
        bookingUrlParams.resident && (extendedDatalayerInfo[DatalayerBKIConstants.RESIDENT_CODE] = bookingUrlParams.resident);
        extendedDatalayerInfo[DatalayerBKIConstants.PROCESS_START] =
         `${this.DatalayerUtilsService.LANG}/${this.DatalayerUtilsService.MARKET}/${bookingUrlParams.searchOrigin ? bookingUrlParams.searchOrigin :  this.BookingAppConstants.QUADRIGAMS.MULTI_ORIGIN}`;
        for (let oIndex = 0; oIndex < fareShuttleRequest.slices.length; oIndex++) {
            extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD] +=
                    (extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') + fareShuttleRequest.slices[oIndex].origin;
            extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD] +=
                    fareShuttleRequest.slices.length > 1 ? '' : ((extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') + fareShuttleRequest.slices[oIndex].destination);
            extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                    (extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + 'ES';
            extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                    fareShuttleRequest.slices.length > 1 ? '' : ((extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + 'ES');
        }
        return extendedDatalayerInfo;
    };

    updateITravelDigitalData = (checkItravel:boolean):void =>{
        const digitalDataObject: object = this.localStorageService.get('confirmationDigitalInfo') ?? {};
        if(checkItravel){
            digitalDataObject[DatalayerBKIConstants.IBPLUS_HOLDER] = DatalayerConstants.DATALAYER_VALUES.YES;
        } else {
            digitalDataObject[DatalayerBKIConstants.IBPLUS_HOLDER] = DatalayerConstants.DATALAYER_VALUES.NO;
        }
        this.DatalayerUtilsService.addDigitalDataInfo(digitalDataObject);
    };
    
    public getAdvancePurchaseValue =  (outBoundDate: string | Date)=> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const auxDate = new Date(outBoundDate);
        auxDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(auxDate.getTime() - today.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
}
