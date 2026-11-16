import { DatalayerBKIService } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service';
import { IbBookingAvailabilityUtilsService } from '@shared/services/ib-booking-availability/ib-booking-availability-utils-service';
import { IbOriginDestinationInfoService } from '@src/app/pages/ib-booking-availability-page/components/transformers/ib-origin-destination-info-service';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

@Service('ib-booking-availability-module',
    ['CommonsSessionStorageService', 'CurrencyService',
        'BookingUtilService',
        'DatalayerUtilsService', 'IbBookingAvailabilityUtilsService',
        'IbOriginDestinationInfoService',
        'DatalayerBKIService'
    ])
export class SlicedAvailabilityDataTransformer {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CurrencyService: CurrencyService,
        private BookingUtilService:any,
        private DatalayerUtilsService: DatalayerUtilsService,
        private IbBookingAvailabilityUtilsService: IbBookingAvailabilityUtilsService,
        private IbOriginDestinationInfoService: IbOriginDestinationInfoService,
        private DatalayerBKIService: DatalayerBKIService
    ) {
    }
    /**
     * Transforms the availability data received from the rest service in a model object to use in the view.
     * @param {GetAvailabilityData} getAvailavilityData -The availability data received from the rest service
     * @param {ItineraryRequestData} availabilityRequest - The request data used for the availability search
     * @returns {Object} - returns the input availability data into a well-structured object for the view
     */
    public transformGetAvailabilityData = (
        getAvailavilityData:AvailabilityTransformerModel.GetAvailabilityData,
        availabilityRequest: any
    ): AvailabilityTransformerModel.TransformAvailabilityResponse => {
        const originCalendarInfo: AvailabilityTransformerModel.Cell[] = [];


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
        transformedAvailabilityData.flightRatio = getAvailavilityData.flightRatio;
        transformedAvailabilityData.responseId = getAvailavilityData.responseId;
        transformedAvailabilityData.responseIdArray.push(getAvailavilityData.responseId);
        if (getAvailavilityData.originDestinations && getAvailavilityData.originDestinations.length > 0) {
            getAvailavilityData.originDestinations.forEach((originDestinations, index) => {
                const offers = this.IbOriginDestinationInfoService.generateOfferParams(originDestinations, getAvailavilityData.offers, getAvailavilityData.fareFamilyConditions);
                const config = this.IbOriginDestinationInfoService.generateOptionParams(transformedAvailabilityData.currencies);
                originDestinations = this.IbOriginDestinationInfoService.create(offers, config);
                
                originDestinations.showOd = (index === 0);
                originDestinations.showFaresSelected = false;
            });

            transformedAvailabilityData.originDestinations = getAvailavilityData.originDestinations;
        }

        this.CommonsSessionStorageService.set('availabilityRelatedContent', getAvailavilityData.relatedContent);
        this.CommonsSessionStorageService.set('responseId', getAvailavilityData.responseId);
        transformedAvailabilityData.relatedContent = this.BookingUtilService.getRelatedContent(getAvailavilityData.relatedContent);
        const datalayerObject = this.DatalayerUtilsService.generateDatalayerAvailability(transformedAvailabilityData);
        const digitalDataObject = this.DatalayerBKIService.generateDigitalDataAvailability(transformedAvailabilityData);
        const specialDiscounts: AvailabilityTransformerModel.SpecialDiscounts[] = [];

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
