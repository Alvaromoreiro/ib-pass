import { DatalayerBKIService } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service';
import { IbBookingAvailabilityUtilsService } from '@shared/services/ib-booking-availability/ib-booking-availability-utils-service';
import { IbMetaSearchInfoService } from '@shared/services/ib-booking-availability/ib-meta-search-info-service';
import { IbOriginDestinationInfoService } from '@src/app/pages/ib-booking-availability-page/components/transformers/ib-origin-destination-info-service';
import { IbMetaSearchInfoServiceUtils } from '@shared/services/ib-booking-availability/ib-meta-search-info-service-utils';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';

@Service('ib-booking-availability-module',
    ['localStorageService', 'CurrencyService',
        '$filter', 'BookingUtilService',
        'DatalayerUtilsService', 'IbBookingAvailabilityUtilsService',
        'IbOriginDestinationInfoService', 'IbMetaSearchInfoService',
        'DatalayerBKIService', 'IbMetaSearchInfoServiceUtils'
    ])
export class AvailabilityDataTransformer {
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CurrencyService: CurrencyService,
        private $filter: ng.FilterFactory,
        private BookingUtilService:any,
        private DatalayerUtilsService: DatalayerUtilsService,
        private IbBookingAvailabilityUtilsService: IbBookingAvailabilityUtilsService,
        private IbOriginDestinationInfoService: IbOriginDestinationInfoService,
        private IbMetaSearchInfoService: IbMetaSearchInfoService,
        private DatalayerBKIService: DatalayerBKIService,
        private IbMetaSearchInfoServiceUtils: IbMetaSearchInfoServiceUtils
    ) {
    }
    /**
     * Transforms the availability data received from the rest service in a model object to use in the view.
     * @param {GetAvailabilityData} getAvailavilityData -The availability data received from the rest service
     * @param {CalendarInfo} calendarInfo -The calendar data received from the rest service
     * @returns {Object} - returns the input availability data into a well-structured object for the view
     */
    transformGetAvailabilityData = (
        getAvailavilityData:AvailabilityTransformerModel.GetAvailabilityData,
        calendarInfo :AvailabilityTransformerModel.CalendarInfo,
        availabilityRequest: any
    ): AvailabilityTransformerModel.TransformAvailabilityResponse => {

        const multiCitySearch= this.localStorageService.get('multiCitySearch');
        const transformedAvailabilityData: AvailabilityTransformerModel.AvailabilityResponse = {
            originDestinations: [],
            currencies: this.CurrencyService.getCurrenciesAsMap(getAvailavilityData.contextMetadata.currencies),
            totalPrice: '',
            fareFamilyConditions: this.IbBookingAvailabilityUtilsService.returnObservationsWithhtml(getAvailavilityData.fareFamilyConditions),
            multiCity: false,
            responseId:'',
            responseIdArray:[],
            redemption:false,
            metaSearchInfo: false,
            changePassengers: false,
            relatedContent: {},
            typeSearch: availabilityRequest.preferredCabin,
            flightRatio: ''
        };
        transformedAvailabilityData.flightRatio = this.localStorageService.get('searchFlightType') === 'metasearchFlight' ? getAvailavilityData.offers[0].flightRatio : getAvailavilityData.flightRatio;
        const limitDates = this.IbBookingAvailabilityUtilsService.getOriginDestinationLimitDates(0);
        let cells = null;
        if(calendarInfo && calendarInfo.calendarRibbon &&
            calendarInfo.calendarRibbon.outBoundRow && calendarInfo.calendarRibbon.outBoundRow.cells) {
            cells = calendarInfo.calendarRibbon.outBoundRow.cells;
        }
        const originCalendarInfo: AvailabilityTransformerModel.Cell[] = [];
        const calendarData = {
            originCalendarData: cells,
            minDate: limitDates.minDate,
            maxDate: limitDates.maxDate,
            originDestinationIndex: 0
        };
        if (multiCitySearch) {
            transformedAvailabilityData.multiCity = true;
        }
        transformedAvailabilityData.responseId = getAvailavilityData.responseId;
        transformedAvailabilityData.responseIdArray.push(getAvailavilityData.responseId);
        if (getAvailavilityData.originDestinations && getAvailavilityData.originDestinations.length > 0) {
            getAvailavilityData.originDestinations.forEach((originDestinations, index) => {
                const offers = this.IbOriginDestinationInfoService.generateOfferParams(originDestinations, getAvailavilityData.offers, getAvailavilityData.fareFamilyConditions);
                const config = this.IbOriginDestinationInfoService.generateOptionParams(transformedAvailabilityData.currencies, calendarData);
                originDestinations = this.IbOriginDestinationInfoService.create(offers, config);
                originDestinations.showOd = (index === 0);
                originDestinations.showFaresSelected = false;
            });

            transformedAvailabilityData.originDestinations = getAvailavilityData.originDestinations;
        }else{
            const offerInfoRecommended = this.IbBookingAvailabilityUtilsService.getOfferInfoRecommended(
                getAvailavilityData.recommendedOfferId,
                getAvailavilityData.offers
            );
            //getAvailavilityData.offers = [offerInfoRecommended];
            const currency = this.CurrencyService.getCurrencyObject(getAvailavilityData.contextMetadata.currencies[0]);
            this.localStorageService.set('fareData', getAvailavilityData);
            //this.localStorageService.set('orderItemsId', [offerInfoRecommended.offerItems[0].offerItemId]);
            const infoMetaSearch: AvailabilityTransformerModel.MetaSearchInfoResponse = this.IbMetaSearchInfoService.createInfoMetaSearch({...getAvailavilityData});
            const slicesInfo: AvailabilityTransformerModel.Slice[] = infoMetaSearch.slicesInfo;
            transformedAvailabilityData.originDestinations = infoMetaSearch.originDestination;
            transformedAvailabilityData.metaSearchInfo = true;
            transformedAvailabilityData.recommendedOfferId = getAvailavilityData.recommendedOfferId;
            transformedAvailabilityData.warnings = getAvailavilityData.warnings && getAvailavilityData.warnings.length > 0 ? getAvailavilityData.warnings : null;
            transformedAvailabilityData.tax = offerInfoRecommended.price.tax;
            transformedAvailabilityData.selectedSlices = [];
            transformedAvailabilityData.totalPrice = this.CurrencyService.formatPrice(
                currency,
                offerInfoRecommended.price.total,
                true,
                false
            );
            slicesInfo.forEach((slice, index) => {
                const auxSlice = {...slice };
                if (index !== 0) {
                    auxSlice.cabins = this.IbMetaSearchInfoServiceUtils.getCompatibleCabinsWithFare(slicesInfo[0].selectedFareFamily, slice.cabins, 1);
                    /*auxSlice.selectedFareFamily = auxSlice.cabins[Object.keys(auxSlice.cabins)[0]].fareFamilies[0];*/
                }
                const value = {
                    selectedSliceIndex: index,
                    selectedSlicesLength: index,
                    cabin: transformedAvailabilityData.fareFamilyConditions[0].cabinType,
                    originDestinationId: transformedAvailabilityData.originDestinations[index].originDestinationId,
                    origin: transformedAvailabilityData.originDestinations[index].origin,
                    destination: transformedAvailabilityData.originDestinations[index].destination,
                    info: auxSlice,
                    articleOffset: index === 0 ? 103 : 601,
                    transformOffset: index === 0 ? 0 : 450,
                    heightHeadingFlight: index === 0 ? 0 : 450,
                    available: true,
                    originCountry: transformedAvailabilityData.originDestinations[index].originCity.countryCode,
                    destinationCountry: transformedAvailabilityData.originDestinations[index].destinationCity.countryCode
                };
                transformedAvailabilityData.selectedSlices.push(value);
                transformedAvailabilityData.originDestinations[index].slices =  [slice];
            });
        }

        if (calendarInfo && calendarInfo.calendarRibbon.outBoundRow && calendarInfo.calendarRibbon.outBoundRow.cells) {
            originCalendarInfo.push(calendarInfo.calendarRibbon.outBoundRow.cells);
        }
        if (calendarInfo && calendarInfo.calendarRibbon.inBoundRow && calendarInfo.calendarRibbon.inBoundRow.cells) {
            originCalendarInfo.push(calendarInfo.calendarRibbon.inBoundRow.cells);
        }
        this.localStorageService.set('availabilityRelatedContent', getAvailavilityData.relatedContent);
        this.localStorageService.set('responseId', getAvailavilityData.responseId);
        transformedAvailabilityData.relatedContent = this.BookingUtilService.getRelatedContent(getAvailavilityData.relatedContent);
        const datalayerObject = this.DatalayerUtilsService.generateDatalayerAvailability(transformedAvailabilityData);
        const digitalDataObject = this.DatalayerBKIService.generateDigitalDataAvailability(transformedAvailabilityData);
        const specialDiscounts: AvailabilityTransformerModel.SpecialDiscounts[] = [];
        let discounts: AvailabilityTransformerModel.SpecialDiscountsOptionDiscuount[] = [
            {
                name: this.$filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION')
            }
        ];
        if (getAvailavilityData.specialDiscountsPossibilities) {
            getAvailavilityData.specialDiscountsPossibilities.forEach((special, index ) =>{

                if (index < getAvailavilityData.specialDiscountsPossibilities.length - 1
                    && special.type === getAvailavilityData.specialDiscountsPossibilities[index + 1].type) {
                    discounts.push(
                        {
                            name: this.$filter('translate')('AVAILABILITY_METASEARCH_DISCOUNT_OPTION_' + special.discountType),
                            code: special.discountType
                        }
                    );
                } else {
                    discounts.push(
                        {
                            name: this.$filter('translate')('AVAILABILITY_METASEARCH_DISCOUNT_OPTION_' + special.discountType),
                            code: special.discountType
                        }
                    );
                    specialDiscounts.push({
                        value: this.$filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION'),
                        type: special.type,
                        option: discounts
                    });
                    discounts = [
                        {
                            name: this.$filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION')
                        }
                    ];
                }
            });
        }
        return {
            transformedAvailabilityData: transformedAvailabilityData,
            fareFamilyConditions: getAvailavilityData.fareFamilyConditions,
            allAvailableOffers: getAvailavilityData.offers,
            originCalendarInfo: originCalendarInfo,
            datalayerObject: datalayerObject,
            specialDiscounts: specialDiscounts,
            digitalDataObject: digitalDataObject
        };
    };
}
