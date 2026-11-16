import { Inject, Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { OHImportResponse, OnHoldModel, Segment, Slice } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { FlightInfo, GeneralInfo, Passenger } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';
import { DatalayerBKIConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { DatalayerGeneralConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-general-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { DatalayerConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbIntlDateFormatPipe } from 'ib-web-commons/pipes';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';


@Injectable({providedIn: 'root'})

export class IbOnHoldConfirmationUtilsService {
    constructor (
        @Inject(AJSDatalayerBKIService) private DatalayerBKIService: AJSDatalayerBKIServiceType,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DigitalDataService: DigitalDataService,
        private IbIntlDateFormatPipe: IbIntlDateFormatPipe
    ) {}

    createAddToCartforPurchaseEvent = (transformedModel: GeneralInfo) => {
        const bookingInfo = this.CommonsSessionStorageService.get<OHImportResponse>('bookingInfo');
        const slices = bookingInfo.order.slices;
        const transformData = (selectedSlices) => {
            let digital_data_ecommerce: DatalayerBKIModel.ViewItemList = { items: []};
            if(selectedSlices) {
                const numSelectedSlices: number = selectedSlices.length;
                selectedSlices.forEach((selectedSlice, index) => {
                    const outboundRoute: string = this.getOutboundRouteOH(transformedModel);
                    const id: string = this.getIdItemOH('all', transformedModel);
                    const brand: string = this.DatalayerBKIService.getBrand(selectedSlice.segments);
                    let item : DatalayerBKIModel.Item = {
                        item_name: BookingAppConstants.ECOMMERCE.FLIGHT,
                        item_id: id,
                        price: transformedModel.price.original,
                        item_brand: brand.toLowerCase(),
                        item_category: DatalayerConstants.DATALAYER_ECOMMERCE.OH_CONFIRMATION,
                        item_category2: outboundRoute,
                        item_category3: this.getItemCategory3OH(outboundRoute, id, slices),
                        item_variant: this.getItemVariantOH(transformedModel, numSelectedSlices),
                        quantity: Number(transformedModel.passengersNumber)
                    };
                    if (index === selectedSlices.length - 1) {
                        digital_data_ecommerce.items.push(item);
                    }
                });
            }
            return digital_data_ecommerce;
        };
        let dataEcomerce = transformData(slices);
        this.DigitalDataService.setAddInfoAddToCart(dataEcomerce);
    };

    private getOutboundRouteOH = (routeModel:GeneralInfo): string => {
        let outboundRoute = '';
        let firstItem = true;
        const isMulticity = routeModel?.flightType === BookingAppConstants.OH_FLIGHT_TYPES.MULTITRIP;
        if(isMulticity){
            outboundRoute = `${routeModel.origin.code}-${routeModel.destination.code}`;
        } else {
            for (const idFlight in routeModel.flightInfo) {
                if(firstItem){
                    (routeModel.tripType === 1 ) ? outboundRoute = `${routeModel?.flightInfo[idFlight].departureCity.code}-${routeModel?.flightInfo[idFlight].arrivalCity.code}` :
                        outboundRoute = `${routeModel?.flightInfo[idFlight].arrivalCity.code}-${routeModel?.flightInfo[idFlight].departureCity.code}`;
                    firstItem = false;
                }
            }
        }
        return outboundRoute;
    };

    private getIdItemOH = (type:string, model:GeneralInfo): string => {
        let idItem: string = '';
        const flightInfo = model.flightInfo;
        const isMulticity = model?.flightType === BookingAppConstants.OH_FLIGHT_TYPES.MULTITRIP;
        if (type === 'all' && isMulticity) {
            idItem = this.getIdItemOHMulti(flightInfo);
        } else  {
            if(model.tripType === 1 ){
                idItem = model.origin.code + '-' + model.destination.code;
            } else {
                const reverseFlightInfo = Object.keys(flightInfo).sort().reverse().map(key=> ({ ...flightInfo[key], key }) );
                idItem = `${reverseFlightInfo[0].departureCity.code}-${reverseFlightInfo[0].arrivalCity.code}|${reverseFlightInfo[1].departureCity.code}-${reverseFlightInfo[1].arrivalCity.code}`;
            }
        }
        return idItem;
    };
    private getIdItemOHMulti = (flightInfo:FlightInfo) =>{
        let idItem: string = '';
        for (const idFlight in flightInfo) {
            if (idItem !== '') {
                idItem += '|';
            }
            idItem += `${flightInfo[idFlight].departureCity.code}-${flightInfo[idFlight].arrivalCity.code}`;
        }
        return idItem;
    };

    private getItemCategory3OH = (outboundRoute: string, id: string, slices:Slice[]): string => {
        let result: string = 'all';
        result = this.findOutbountResults(outboundRoute, slices);

        if (result === 'all' && id) {
            const arrId = id.split('|');
            arrId.forEach((element, i) => {
                if(outboundRoute === element) {
                    result = (i+1).toString();
                }
            });
            this.updateResultOne(arrId, outboundRoute, result);
        }

        return result;
    };

    private findOutbountResults = (outboundRoute: string, slices): string => {
        let result: string = 'all';

        slices.forEach((element, i) => {
            element?.segments.forEach( segment => {
                if(outboundRoute === `${segment?.departure?.code}-${segment?.arrival?.code}`) {
                    result = (i+1).toString();
                }
            });
        });

        return result;
    };

    private updateResultOne = (arrId: string[], outboundRoute:string, result:string) => {
        if(arrId.length === 1){
            if(outboundRoute !== 'all' && result === 'all') {
                result = '1';
            }
        }
    };

    private getItemVariantOH = ( model:GeneralInfo, numSelectedSlices: number): string => {
        const isMulticity = model.flightType === BookingAppConstants.OH_FLIGHT_TYPES.MULTITRIP;
        if(isMulticity) return 'mt';
        return numSelectedSlices > 1 ? 'rt' : 'ow';
    };

    generateOnHoldConfirmationDigitalData = (model:OnHoldModel): void => {
        const confirmationDigitalInfo: object = this.CommonsSessionStorageService.get('confirmationDigitalInfo') || {};
        const bookingInfo:OHImportResponse = this.CommonsSessionStorageService.get('bookingInfo');
        const sliceDates: Array<string> = bookingInfo?.order?.slices?.map(el => el?.departureDateTime ?? '') ?? [];
        this.removeDigitalDataInfo(confirmationDigitalInfo);
        this.createDigitalDataSlices(confirmationDigitalInfo, model, sliceDates);
        this.createDigitalDataPassengers(confirmationDigitalInfo, model.passengers);
        this.setOHDigitalDataParams(confirmationDigitalInfo, model, sliceDates);
        this.DigitalDataService.addDigitalDataInfo(confirmationDigitalInfo);
        this.CommonsSessionStorageService.set('confirmationDigitalInfo', confirmationDigitalInfo);
    };

    private setOHDigitalDataParams = (confirmationDigitalInfo, model:OnHoldModel, sliceDates:string[]) =>{
        const paymentsInfo: any = this.CommonsSessionStorageService.get('paymentsInfo');
        const bookingInfo:OHImportResponse = this.CommonsSessionStorageService.get('bookingInfo');
        this.setFlightParams(confirmationDigitalInfo, model, bookingInfo);
        this.setPricesParams(confirmationDigitalInfo, model);
        confirmationDigitalInfo[DatalayerGeneralConstants.CURRENCY] = bookingInfo?.order?.price?.currency ?? null;
        confirmationDigitalInfo[DatalayerGeneralConstants.REFERENCE] = bookingInfo.order.bookingReferences[0].reference;
        confirmationDigitalInfo[DatalayerGeneralConstants.ORIGIN_DESTINATIONS] = `${model?.generalInfo?.origin?.code}-${model?.generalInfo?.destination?.code}`;
        confirmationDigitalInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] = `${model?.generalInfo?.origin?.city.countryCode}-${model?.generalInfo?.destination?.city.countryCode}`;
        confirmationDigitalInfo[DatalayerBKIConstants.SEARCH_ORIGIN] = this.getSearchOrigin(model, bookingInfo.order.slices);
        confirmationDigitalInfo[DatalayerBKIConstants.ORDER_ID] = bookingInfo.order.orderId;
        confirmationDigitalInfo[DatalayerGeneralConstants.CASH_AVIOS_USED] = this.DatalayerUtilsService.getCodeFromCashAviosUsed(paymentsInfo);
        confirmationDigitalInfo[DatalayerGeneralConstants.VOUCHER_USED] = this.getVoucherUsed(paymentsInfo?.appliedDiscounts?.types?.VOUCHER);
        confirmationDigitalInfo[DatalayerBKIConstants.SPECIAL_MEAL] = this.getMeal();
        confirmationDigitalInfo[DatalayerBKIConstants.AVIOS_EARNED] = this.getAviosEarned();
        confirmationDigitalInfo[DatalayerBKIConstants.ADVANCE_PURCHASE] = (this.getDifferenceInDays(new Date(sliceDates[0]), new Date())).toString();
        confirmationDigitalInfo[DatalayerBKIConstants.IBPLUS_HOLDER] = this.CommonsSessionStorageService.get('userLogged') ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
    };

    private getVoucherUsed = (isVoucher):string =>{
        return isVoucher ? 'si' : 'no';
    };

    private setFlightParams = (confirmationDigitalInfo, model:OnHoldModel, bookingInfo:OHImportResponse) =>{
        confirmationDigitalInfo[DatalayerBKIConstants.FLIGHT_TYPE] = this.getFlightType(model?.generalInfo?.tripType);
        confirmationDigitalInfo[DatalayerBKIConstants.FLIGHT_STATUS] = bookingInfo?.order?.status;
        confirmationDigitalInfo[DatalayerBKIConstants.FLIGHT_HAUL] = bookingInfo?.order?.flightRatio;
    };

    private getFlightType = (tripType:number):string => {
        return tripType === 2 ? DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP: DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
    };

    private setPricesParams = (confirmationDigitalInfo, model:OnHoldModel) =>{
        const total = model.generalInfo.orderPrice.total;
        const taxes = model.generalInfo.orderPrice.tax;
        confirmationDigitalInfo[DatalayerBKIConstants.TOTAL_PRICE] = total;
        confirmationDigitalInfo[DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = total - taxes;
        confirmationDigitalInfo[DatalayerBKIConstants.TOTAL_TAXES] = taxes;
    };

    private removeDigitalDataInfo = (confirmationDigitalInfo) =>{
        this.DigitalDataService.removeDigitalDataInfo([DatalayerBKIConstants.CASH_AVIOS_OFFER, DatalayerGeneralConstants.VOUCHER_SHOWN]);
        delete confirmationDigitalInfo[DatalayerBKIConstants.CASH_AVIOS_OFFER];
        delete confirmationDigitalInfo[DatalayerGeneralConstants.VOUCHER_SHOWN];
    };

    private getAviosEarned = () =>{
        const calculatedPoints: any = this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS);
        return calculatedPoints?.Avios ? calculatedPoints.Avios : null;
    };

    private getDifferenceInDays = (firstDate:Date, secondDate:Date):number => {
        return Math.round((firstDate.getTime() - secondDate.getTime()) / (1000 * 60 * 60 * 24));
    };
    private getMeal = ():boolean => {
        const meal: any = this.CommonsSessionStorageService.get('specialMealsCopy');
        const hasMeal = meal && meal.length >0 ? true : false;
        return hasMeal;
    };

    private getSearchOrigin = (model: OnHoldModel, slices:Slice[]) : string  => {
        let searchOrigin : string = '';
        if (model.generalInfo.flightType === BookingAppConstants.OH_FLIGHT_TYPES.MULTITRIP) {
            for (let i = 0; i < slices.length; i++) {
                searchOrigin += `${searchOrigin.length > 0 ? '-' : ''}${slices[i].segments[0].departureCity.code}`;
            }
        } else {
            searchOrigin += `${model?.generalInfo?.origin?.city.code}`;
        }
        return searchOrigin;
    };

    private createDigitalDataPassengers = (confirmationDigitalInfo, passengers:Passenger[]) =>{
        confirmationDigitalInfo[DatalayerBKIConstants.PAX_TOTAL] = passengers.length;
        confirmationDigitalInfo[DatalayerBKIConstants.PAX_ADULT] = 0;
        confirmationDigitalInfo[DatalayerBKIConstants.PAX_SENIOR] = 0;
        confirmationDigitalInfo[DatalayerBKIConstants.PAX_YOUNG] = 0;
        confirmationDigitalInfo[DatalayerBKIConstants.PAX_CHILD] = 0;
        confirmationDigitalInfo[DatalayerBKIConstants.PAX_INFANT] = 0;
        passengers.forEach((passenger) => {
            switch (passenger.passengerType) {
                    case 'ADULT':
                        confirmationDigitalInfo[DatalayerBKIConstants.PAX_ADULT]++;
                        break;
                    case 'SENIOR':
                        confirmationDigitalInfo[DatalayerBKIConstants.PAX_SENIOR]++;
                        break;
                    case 'YOUTH':
                        confirmationDigitalInfo[DatalayerBKIConstants.PAX_YOUNG]++;
                        break;
                    case 'CHILD':
                        confirmationDigitalInfo[DatalayerBKIConstants.PAX_CHILD]++;
                        break;
                    case 'INFANT':
                        confirmationDigitalInfo[DatalayerBKIConstants.PAX_INFANT]++;
                        break;
            }
        });
    };
    private createDigitalDataSlices = (confirmationDigitalInfo, model:OnHoldModel, dates:string[]) =>{
        const bookingInfo:OHImportResponse = this.CommonsSessionStorageService.get('bookingInfo');
        const slices = bookingInfo.order.slices;
        const cabins: string[] = [];
        this.setOriginalDateAndLengthStay(confirmationDigitalInfo, dates);
        slices.forEach((slice, i)=>{
            if (slice.segments.length > 0) {
                if (!confirmationDigitalInfo[`Slice${i+1}Flights`]) {
                    confirmationDigitalInfo[`Slice${i+1}Flights`] = '';
                } else {
                    confirmationDigitalInfo[`Slice${i+1}Flights`] = '';
                }
                if (!confirmationDigitalInfo[`Slice${i+1}Operator`]) {
                    confirmationDigitalInfo[`Slice${i+1}Operator`] = '';
                } else {
                    confirmationDigitalInfo[`Slice${i+1}Operator`] = '';
                }
                this.setOperatorAndFlights(confirmationDigitalInfo, slice, i, cabins);
            }
            confirmationDigitalInfo[`Slice${i+1}Cabin`] = cabins[i];
            this.setSearchAndRoute(slice, i, confirmationDigitalInfo, model);
            this.setSliceFareFamily(slice, i, confirmationDigitalInfo);
        });

        // confirmationDigitalInfo[DatalayerBKIConstants.SEARCH_DEST] = searchDest;
        // confirmationDigitalInfo[DatalayerBKIConstants.SEARCH_OD] = searchOD;
    };

    private setOperatorAndFlights = (confirmationDigitalInfo, slice:Slice, i:number, cabins:string[]) =>{
        let cabinClass = '';
        slice.segments.forEach(segment=>{
            cabins[i] = cabins[i] || '';
            cabins[i] += (cabins[i].length > 0 ? '-' : '') + (segment.cabin.bookingClass || DatalayerConstants.DATALAYER_VALUES.CABIN_FAMILY_STANDARD);
            this.setSliceOperatorAndFlights(confirmationDigitalInfo, segment, i);
            if (segment.cabin && typeof slice.segments[0].cabin.bookingClass === 'string') {
                cabinClass = cabinClass === '' || DatalayerConstants.SEGMENT_CABIN_PRIORITY[cabinClass] > DatalayerConstants.SEGMENT_CABIN_PRIORITY[segment.cabin.bookingClass.charAt(0)]
                    ? segment.cabin.bookingClass.charAt(0) : cabinClass;
            }
        });
    };

    private setSliceOperatorAndFlights = (confirmationDigitalInfo, segment:Segment, i:number) =>{
        confirmationDigitalInfo[`Slice${i+1}Flights`] +=
            (confirmationDigitalInfo[`Slice${i+1}Flights`].length > 0 ? '-' : '') +
            segment.flight.operationalDisclosure + (segment.flight.operationalFlightNumber || segment.flight.marketingFlightNumber);
        confirmationDigitalInfo[`Slice${i+1}Operator`] +=
            (confirmationDigitalInfo[`Slice${i+1}Operator`].length > 0 ? '-' : '') +
            segment.flight.operationalDisclosure;
    };

    private setSliceFareFamily = (slice:Slice, index:number, confirmationDigitalInfo) =>{
        let fareFamily = '';
        slice.segments.forEach(segments => {
            this.CommonsSessionStorageService.get<any>('fareFamilyConditionsInfo').forEach((fare) => {
                if(fare.commercialCode === segments.cabin.fareFamily) {
                    fareFamily+= (fareFamily==='' ? '' : '-') + fare.commercialNameES;
                }
            });
        });
        confirmationDigitalInfo[`Slice${index+1}FareFamily`] = fareFamily;
    };

    private setSearchAndRoute = (slice:Slice, index:number, confirmationDigitalInfo, model:OnHoldModel) =>{
        const bookingInfo:OHImportResponse = this.CommonsSessionStorageService.get('bookingInfo');
        const slices = bookingInfo.order.slices;
        let searchDest:string = '', searchOD:string = '',
            isMultiCity: boolean = this.isMultiCityTrip(slices);
        let sliceRoute = slice.segments[0].departure.city.code + '-' + slice.segments[0].arrival.city.code;

        if(isMultiCity){
            sliceRoute = slice.segments.length>1 ? slice.segments[0].departure.city.code + '-' + slice.segments[slice.segments.length-1].arrival.city.code : sliceRoute;
            searchDest += `${searchDest.length > 0 ? '-':''}${slice.segments[slice.segments.length - 1].arrivalCity?.code}`;
            searchOD += `${searchOD.length > 0 ? '/' : ''}${slice.segments[0].departure.city?.code + '-' + slice.segments[slice.segments.length-1].arrival.city?.code}`;

        } else {
            for(let j = 1; j < slice.segments.length; j++){
                sliceRoute = sliceRoute + '-' + slice.segments[j].arrival.city.code;
            }
            searchDest = `${model?.generalInfo?.destination?.city.code}`;
            searchOD = `${model?.generalInfo?.origin?.city.code}-${model?.generalInfo?.destination?.city.code}`;

        }
        confirmationDigitalInfo[`Slice${index+1}Routing`] = sliceRoute;
        confirmationDigitalInfo[DatalayerBKIConstants.SEARCH_DEST] = searchDest;
        confirmationDigitalInfo[DatalayerBKIConstants.SEARCH_OD] = searchOD;
    };

    private setOriginalDateAndLengthStay = (confirmationDigitalInfo, dates: string[]) =>{
        let originalDate = '', departureDate:Date, returnDate:Date;
        dates.forEach((date, index) => {
            confirmationDigitalInfo[`Slice${index}OriginalDate`] = this.IbIntlDateFormatPipe.transform(date);
            originalDate += (index > 0 ? '-': '') + confirmationDigitalInfo[`Slice${index}OriginalDate`];
            if(index === 0) {
                departureDate = new Date(date);
                returnDate = departureDate;
            } else returnDate = new Date(date);
        });
        confirmationDigitalInfo[DatalayerBKIConstants.ORIGINAL_DATE] = originalDate;
        confirmationDigitalInfo[DatalayerBKIConstants.LENGTH_STAY] = departureDate !== returnDate ? this.getDifferenceInDays(returnDate, departureDate) : 0;
    };

    public isMultiCityTrip = (slices:Slice[]): boolean => {
        let isMultiCity: boolean = false;
        if(slices?.length < 2 ){
            isMultiCity = false;
        } else if (slices.length >= 3) {
            isMultiCity = true;
        } else {
            let firstSliceLastSegment = slices[0].segments[slices[0].segments.length - 1];
            let lastSliceFirstSegment = slices[slices.length - 1].segments[0];
            isMultiCity = firstSliceLastSegment.departure.city?.code !== lastSliceFirstSegment?.arrival?.code;
        }
        
        this.CommonsSessionStorageService.set('multiCitySearch', isMultiCity);

        return isMultiCity;
    };

}
