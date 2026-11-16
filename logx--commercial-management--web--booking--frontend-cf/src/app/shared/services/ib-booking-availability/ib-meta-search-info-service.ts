import { merge } from 'lodash-es';
import { IbBookingAvailabilityUtilsService } from './ib-booking-availability-utils-service';
import { IbMetaSearchInfoServiceUtils } from './ib-meta-search-info-service-utils';

@Service('ib-booking-availability-module',
    ['IbBookingAvailabilityUtilsService', 'IbMetaSearchInfoServiceUtils', '$filter',
        'BookingAvailabilityConstants', 'BookingUtilService'])
export class IbMetaSearchInfoService {
    constructor (
        private IbBookingAvailabilityUtilsService: IbBookingAvailabilityUtilsService,
        private IbMetaSearchInfoServiceUtils: IbMetaSearchInfoServiceUtils,
        private $filter: ng.IFilterFunction,
        private BookingAvailabilityConstants: any,
        private BookingUtilService: any
    ) {
    }

    createInfoMetaSearch = (
        availabilityData: AvailabilityTransformerModel.GetAvailabilityData
    ): AvailabilityTransformerModel.MetaSearchInfoResponse => {
        const offer: AvailabilityTransformerModel.Offer = this.IbBookingAvailabilityUtilsService.getOfferInfoRecommended(availabilityData.recommendedOfferId, availabilityData.offers);
        const metaSearchInfo: AvailabilityTransformerModel.MetaSearchInfoResponse = {
            originDestination:[],
            slicesInfo:[],
            flightMetaSearch: true
        };
        const slicesInfo: AvailabilityTransformerModel.Slice[] = [];
        const originDestination: AvailabilityTransformerModel.OriginDestination[] = [];

        offer.slices.forEach( (slice, index) =>{
            const allOperatedByAux = [];
            const cabinInfoBySlice: AvailabilityTransformerModel.GenerateInfoCabinResponse = this.IbMetaSearchInfoServiceUtils.generateInfoCabin(
                offer.offerId,
                slice,
                availabilityData.offers,
                availabilityData.fareFamilyConditions as AvailabilityTransformerModel.FareFamilyCondition[],
                availabilityData.contextMetadata.currencies[0],
                index
            );
            const arrivalDateSplit = slice.arrivalDateTime.split(' ');
            const departureDateSplit = slice.departureDateTime.split(' ');
            const arrivalDate = new Date(arrivalDateSplit[0]);
            const departurelDate = new Date(departureDateSplit[0]);
            const recommendedFare = cabinInfoBySlice.cabin[ cabinInfoBySlice.cabinTypeAssigned ].fareFamilies.find( ( fare ) => fare.hasRecommendedOffer );
            const info: AvailabilityTransformerModel.Slice = {
                sliceId: index,
                arrivalDateTime: slice.arrivalDateTime,
                arrivalDateTimeParsed: arrivalDateSplit[1],
                bestPrice: true,
                cabins: cabinInfoBySlice.cabin,
                cabinsLength: Object.keys(cabinInfoBySlice.cabin).length,
                cashAvios: true,
                departureDateTime: slice.departureDateTime,
                departureDateTimeParsed: departureDateSplit[1],
                daysOfTravel: Math.round(( arrivalDate.getTime() - departurelDate.getTime()) / this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS),
                departureDateParsed: this.$filter('DateFormatFilter')(slice.departureDateTime),
                arrivalDateParsed: this.$filter('DateFormatFilter')(slice.arrivalDateTime),
                duration: slice.duration,
                durationParsed: this.$filter('DurationFormatFilter')(slice.duration),
                overnight: slice.overnight,
                showFares: true,
                sliceCurrency: slice.price.currency,
                stopsNumber: slice.stopsNumber,
                maxSlicePrice: slice.price.fare,
                allOperatedBy: [],
                segments: [],
                selectedFareFamily: recommendedFare,
                showedCabin:cabinInfoBySlice.cabinTypeAssigned,
                slicePrice: recommendedFare.farePriceToCalculate
            };
            slice.segments.forEach((segment, index)=>{
                const logoURLS = this.BookingUtilService.getCompanyURL(segment.flight.operationalDisclosure);
                info.segments[index] = segment;
                info.segments[index].durationParsed = this.$filter('DurationFormatFilter')(segment.duration);
                info.segments[index].waitingTimeParsed = this.$filter('DurationFormatFilter')(segment.waitingTime);
                info.segments[index].departureDateTimeParsed = segment.departureDateTime.split(' ')[1];
                info.segments[index].departureDateParsed = this.$filter('DateFormatFilter')(segment.departureDateTime);
                info.segments[index].arrivalDateParsed = this.$filter('DateFormatFilter')(segment.arrivalDateTime);
                info.segments[index].arrivalDateTimeParsed = segment.arrivalDateTime.split(' ')[1];
                info.segments[index].companyURL = logoURLS?.logo;
                info.segments[index].companyURLMin = logoURLS?.logoMin;
                if (index === 0) {
                    info.sliceURL = segment.companyURL;
                    info.sliceURLMin = segment.companyURLMin;
                }
                if (allOperatedByAux.indexOf(segment.flight.operationalCarrier.code) === -1) {
                    allOperatedByAux.push(segment.flight.operationalCarrier.code);
                    info.allOperatedBy.push(segment.flight.operationalCarrier.name);
                }
                const previousSegment = index > 0
                    ?  slice.segments[index-1]
                    : null;
                merge(info.segments[index],
                    this.IbBookingAvailabilityUtilsService.generateSegmentWarningMessage(segment, previousSegment));
            });
            slicesInfo.push(info);
        });
        slicesInfo.forEach((slice, index) =>{
            const value: AvailabilityTransformerModel.OriginDestination = {
                originDestinationId: `OD${index + 1}`,
                currency: slice.sliceCurrency,
                destination: slice.segments[slice.segments.length - 1].arrival.code,
                destinationCity: slice.segments[slice.segments.length - 1].arrival.city,
                isAvailable: true,
                loadingAvailability: false,
                origin: slice.segments[0].departure.code,
                originCity: slice.segments[0].departure.city,
                showOd: true,
                showFaresSelected: true,
                filterOptions: null
            };
            originDestination.push(value);
        });
        metaSearchInfo.slicesInfo= slicesInfo;
        metaSearchInfo.originDestination = originDestination;
        return metaSearchInfo;
    };
}
