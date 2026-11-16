
import dayjs from 'dayjs';

@Service('ib-flash-offer-service-module', [
    'BookingAvailabilityConstants', 'CommonsConstants', 'BookingUtilService',
    '$filter', 'BookingAppConstants', 'localStorageService'
])
export class IbFlashOfferUtilsService {

    constructor (
        private BookingAvailabilityConstants: any,
        private CommonsConstants: CommonsConstantsType,
        private BookingUtilService: any,
        private $filter: angular.IFilterService,
        private BookingAppConstants: BookingAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    createRequestDirectFare  = () => {
        const flashOfferId = this.BookingUtilService.getURLFirstParameterByName('flashOfferId');
        const request = {
            flashOfferId: flashOfferId,
            passengers: [],
            specialDiscounts: this.getSpecialDiscounts()
        };
        const passengerCount = {
            passengers:0,
            numAdults:0,
            numSeniors:0,
            numYoung:0,
            numTeenager:0,
            numInfant:0,
            numChilds:0,
            numberPassengrsWithoutInfant:0
        };
        const detectPassenger = (identifier) => {
            switch (identifier) {
                    case this.BookingAvailabilityConstants.PASSENGER_ID.ADT:
                        request.passengers.push({
                            passengerType: this.CommonsConstants.PASSENGER_TYPES.ADULT,
                            count: parseInt(ADT)
                        });
                        break;
                    case this.BookingAvailabilityConstants.PASSENGER_ID.CHD:
                        request.passengers.push({
                            passengerType: this.CommonsConstants.PASSENGER_TYPES.CHILD,
                            count: parseInt(CHD)
                        });
                        break;
                    case this.BookingAvailabilityConstants.PASSENGER_ID.INF:
                        request.passengers.push({
                            passengerType: this.CommonsConstants.PASSENGER_TYPES.INFANT,
                            count: parseInt(INF)
                        });
                        break;
                    case this.BookingAvailabilityConstants.PASSENGER_ID.BNN:
                        request.passengers.push({
                            passengerType: this.CommonsConstants.PASSENGER_TYPES.YOUTH,
                            count: parseInt(BNN)
                        });
                        break;
                    case this.BookingAvailabilityConstants.PASSENGER_ID.YTH:
                        request.passengers.push({
                            passengerType: this.CommonsConstants.PASSENGER_TYPES.YOUNG,
                            count: parseInt(YTH)
                        });
                        break;
            }
        };
        const ADT = this.BookingUtilService.getURLFirstParameterByName('ADT');
        const CHD = this.BookingUtilService.getURLFirstParameterByName('CHD');
        const INF = this.BookingUtilService.getURLFirstParameterByName('INF');
        const BNN = this.BookingUtilService.getURLFirstParameterByName('BNN');
        const YTH = this.BookingUtilService.getURLFirstParameterByName('YTH');

        if(ADT && parseInt(ADT) > 0) {
            detectPassenger(this.BookingAvailabilityConstants.PASSENGER_ID.ADT);
            passengerCount.passengers += parseInt(ADT);
            passengerCount.numAdults += parseInt(ADT);
            passengerCount.numberPassengrsWithoutInfant += parseInt(ADT);
        }
        if(CHD && parseInt(CHD) > 0) {
            detectPassenger(this.BookingAvailabilityConstants.PASSENGER_ID.CHD);
            passengerCount.passengers += parseInt(CHD);
            passengerCount.numChilds += parseInt(CHD);
            passengerCount.numberPassengrsWithoutInfant += parseInt(CHD);
        }
        if(INF && parseInt(INF) > 0) {
            detectPassenger(this.BookingAvailabilityConstants.PASSENGER_ID.INF);
            passengerCount.passengers += parseInt(INF);
            passengerCount.numInfant += parseInt(INF);
        }
        if(BNN && parseInt(BNN) > 0) {
            detectPassenger(this.BookingAvailabilityConstants.PASSENGER_ID.BNN);
            passengerCount.passengers += parseInt(BNN);
            passengerCount.numTeenager += parseInt(BNN);
            passengerCount.numberPassengrsWithoutInfant += parseInt(BNN);
        }
        if(YTH && parseInt(YTH) > 0) {
            detectPassenger(this.BookingAvailabilityConstants.PASSENGER_ID.YTH);
            passengerCount.passengers += parseInt(YTH);
            passengerCount.numYoung += parseInt(YTH);
            passengerCount.numberPassengrsWithoutInfant += parseInt(YTH);
        }

        return {
            request,
            passengerCount
        };
    };

    getSpecialDiscounts = () => {
        const specialDiscounts = [];
        const residentCode = this.BookingUtilService.getURLFirstParameterByName('residentCode');
        const familianumerosa = this.BookingUtilService.getURLFirstParameterByName('familianumerosa');
        if(residentCode) {
            let discountType = '';
            switch(residentCode) {
                    case this.CommonsConstants.RESIDENT_CODE.CANARIAS: discountType = this.CommonsConstants.RESIDENT_DISCOUNT_TYPE.CANARIAS; break;
                    case this.CommonsConstants.RESIDENT_CODE.BALEARES: discountType = this.CommonsConstants.RESIDENT_DISCOUNT_TYPE.BALEARES; break;
                    case this.CommonsConstants.RESIDENT_CODE.MELILLA: discountType = this.CommonsConstants.RESIDENT_DISCOUNT_TYPE.MELILLA; break;
                    case this.CommonsConstants.RESIDENT_CODE.CEUTA: discountType = this.CommonsConstants.RESIDENT_DISCOUNT_TYPE.CEUTA; break;
            }
            specialDiscounts.push({type: this.CommonsConstants.DISCOUNT_TYPE.RESIDENT, discountType: discountType});
        }
        if(familianumerosa) {
            let discountType = '';
            switch(familianumerosa) {
                    case this.CommonsConstants.LARGE_FAMILY_CODE.GENERAL: discountType = this.CommonsConstants.LARGE_FAMILY_TYPE.GENERAL; break;
                    case this.CommonsConstants.LARGE_FAMILY_CODE.SPECIAL: discountType = this.CommonsConstants.LARGE_FAMILY_TYPE.SPECIAL; break;
            }
            specialDiscounts.push({type: this.CommonsConstants.DISCOUNT_TYPE.LARGE_FAMILY, discountType: discountType});
        }
        return specialDiscounts;
    };

    createNewHeaderData = (offers) => {
        const sliceEndLenght = offers[0].slices.length;
        const segmentEndLenght = offers[0].slices[0].segments.length;
        const dates: FlashOfferModels.Dates = {
            outboundFlight:offers[0].slices[0].segments[0].departureDateTime,
            formatedOutboundFlight:
                this.$filter<any>('CommonsMomentFormatDateByLanguage')(offers[0].slices[0].segments[0].departureDateTime, 'large')
        };

        const originCity ={
            code: offers[0].slices[0].segments[0].departure.city.code,
            description: offers[0].slices[0].segments[0].departure.city.description,
            timezone: '',
            country: offers[0].slices[0].segments[0].departure.city.country
        };
        const destinationCity = {
            code: offers[0].slices[0].segments[segmentEndLenght-1].arrival.city.code,
            description: offers[0].slices[0].segments[segmentEndLenght-1].arrival.city.description,
            timezone: '',
            country: offers[0].slices[0].segments[segmentEndLenght-1].arrival.city.country
        };

        if(sliceEndLenght > 1){
            dates.returnFlight = offers[0].slices[sliceEndLenght -1].segments[0].departureDateTime;
            dates.formatedReturnFlight = this.$filter<any>('CommonsMomentFormatDateByLanguage')(offers[0].slices[sliceEndLenght - 1].segments[0].departureDateTime, 'large');
        }

        return {
            dates,
            originCity,
            destinationCity
        };
    };

    createModelToHeader = (slices) => {
        const model = {
            availabilityData:{
                originDestinations: []
            },
            selectedSlices:[]
        };
        slices.forEach((slice) => {
            const segmentEndLenght = slice.segments.length;
            const origin ={
                code: slice.segments[0].departure.city.code,
                description: slice.segments[0].departure.city.description,
                timezone: '',
                country: slice.segments[0].departure.city.country
            };
            const destination = {
                code: slice.segments[segmentEndLenght-1].arrival.city.code,
                description: slice.segments[segmentEndLenght-1].arrival.city.description,
                timezone: '',
                country: slice.segments[segmentEndLenght-1].arrival.city.country
            };
            const date = this.$filter<any>('CommonsMomentFormatDateByLanguage')(slice.segments[0].departureDateTime, 'large');
            model.availabilityData.originDestinations.push({
                origin,
                destination,
                date,
                destinationCity: destination,
                originCity: origin
            });
            model.selectedSlices.push({
                info:{
                    departureDateTime: slice.segments[0].departureDateTime,
                    segments: slice.segments
                },
                destination: slice.segments[0].arrival.city.code
            });

        });
        return model;
    };

    generateNewrequestDataDirectFare = (passengers, originDestination) => {
        const request = {
            marketCode: this.BookingAppConstants.market,
            passengers,
            slices: []
        };
        originDestination.forEach( (slice) => {
            const date = dayjs(slice.date, 'DD-MM-YYYY');
            request.slices.push({
                date: date.format('YYYY-MM-DD'),
                destination: slice.destination.code,
                origin: slice.origin.code
            });
        });
        this.localStorageService.set('availabilityRequestData', request);
    };

    createModelToSelectedTripInfo = (slices, fareFamilies) => {
        let model:any = [];

        slices.forEach((slice, index) => {
            model.push({
                origin: slice.segments[0].departure.city.code,
                destination: slice.segments[0].arrival.city.code,
                info:{
                    segments: slice.segments,
                    slicePrice: slice.price.total,
                    selectedFareFamily:{
                        cabinDescription : fareFamilies[0].cabinDescription,
                        commercialCode : fareFamilies[0].commercialCode
                    },
                    cabins:{
                        [fareFamilies[0].cabinType]: {
                            fareFamilies:[
                                ...fareFamilies
                            ]
                        }
                    }
                },
                cabin: fareFamilies[0].cabinType
            });
            model[index].info.cabins[fareFamilies[0].cabinType].fareFamilies[0].farePriceToCalculate = slice.price.total;
        });
        return model;
    };
}
