import { Inject, Injectable } from '@angular/core';
import { AJSIbBookingAvailabilityPageService, IbBookingAvailabilityPageServiceType } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-bridge.service';
import { IbBookingItineraryService, BookingOutboundItineraryResponseType } from './ib-booking-itinerary-service.service';
import { AJSSlicedAvailabilityDataTransformer, AJSSlicedAvailabilityDataTransformerType } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-availability-data-transformer-bridge.service';
import { AJSBookingAvailabilityTransformer } from '@shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSBookingAvailabilityService, AJSBookingAvailabilityServiceType } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-service.bride.service';
import { CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BookingAvailabilityConstants } from '@core/constants/ib-booking-availability-constants';
import { cloneDeep } from 'lodash-es';
import { SlicedCreateFareRequestDataModel } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbSetPartnersSelectionUtilsService } from '@shared/components/ib-booking-partners-modal/ib-set-partners-selection.service';
import { DatalayerBKIConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { BookingHttpErrorModel } from '@src/app/core/models/generic-models/generic-models';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AvailabilityErrorPagePath, RouterPathsConstants, getRedirectionPath } from '@core/constants/ib-booking-router-paths-constants';
import { IbBookingPetsFlowService } from '@shared/services/ib-utils/ib-bookig-pets-flow.service';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';
import { IbAvailabilityRibbonService } from './ib-availability-ribbon.service';
import { FareDataModel, WarningsFare } from '@src/app/core/models/generic-models/fare-models';
import type { BottomFixedConfig } from '../ib-booking-sliced-availability.component.model';
import type { ItineraryResponseDTO } from '@shared/http-services/models/ItineraryServiceDTO';

@Injectable()
export class IbBookingSlicedAvailabilityService {
    public outboundRequest: AvailabilityTransformerModel.ItineraryRequestData;
    public calendarData: AvailabilityTransformerModel.CalendarInfo;

    private static readonly ERROR_PAGE_PATHS = {
        pets: getRedirectionPath(RouterPathsConstants.errpetc),
        generic: getRedirectionPath(RouterPathsConstants.ibbkerror)
    } as const;

    constructor (
        private IbBookingItineraryService: IbBookingItineraryService,
        private BookingRedirectionService: BookingRedirectionService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbCUserUtilsService: IbCUserUtilsService,
        private IbSetPartnersSelectionUtilsService: IbSetPartnersSelectionUtilsService,
        private IbBookingPetsFlowService: IbBookingPetsFlowService,
        private BookingErrorPageStore: BookingErrorPageStore,
        private IbAvailabilityRibbonService: IbAvailabilityRibbonService,
        @Inject(AJSSlicedAvailabilityDataTransformer) private SlicedAvailabilityDataTransformer: AJSSlicedAvailabilityDataTransformerType,
        @Inject(AJSBookingAvailabilityTransformer) private BookingAvailabilityTransformer,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        @Inject(AJSIbBookingAvailabilityPageService) private IbBookingAvailabilityPageUtilsService: IbBookingAvailabilityPageServiceType,
        @Inject(AJSBookingAvailabilityService) private BookingAvailabilityService: AJSBookingAvailabilityServiceType,
        @Inject(AJSDatalayerBKIService) private DatalayerBKIService: AJSDatalayerBKIServiceType

    ) {

    }

    public getRibbonAvailability (): Observable<AvailabilityTransformerModel.CalendarInfo | BookingHttpErrorModel> {
        this.outboundRequest = this.BookingAvailabilityTransformer.createRequestAvailability();
        return this.IbAvailabilityRibbonService.getRibbonAvailability(this.outboundRequest)
            .pipe(map(response =>{
                this.calendarData = response as AvailabilityTransformerModel.CalendarInfo;
                return response;
            }), this.availabilityErrorOperator());
    }

    public getInboundAvailability (responseId: string, offerId: string, sliceId: number ): Observable<BookingOutboundItineraryResponseType> {
        return this.IbBookingItineraryService.getInboundAvailability(responseId, offerId, sliceId)
            .pipe(this.availabilityErrorOperator());
    }

    public getOutboudAvailabilityGrid () {
        this.outboundRequest = this.BookingAvailabilityTransformer.createRequestAvailability();
        return this.IbBookingItineraryService.getOutboundAvailability(this.outboundRequest).pipe(map(response => {
            return this.SlicedAvailabilityDataTransformer.transformGetAvailabilityData(this.toGetAvailabilityData(response), this.outboundRequest);
        }), this.availabilityErrorOperator());
    }
    public getInboundAvailabilityGrid (outboundData: AvailabilityTransformerModel.TransformAvailabilityResponse, offerId: string, sliceId: number) {
        return this.getInboundAvailability(outboundData.transformedAvailabilityData.responseId, offerId, sliceId)
            .pipe(map(response => {
                return this.SlicedAvailabilityDataTransformer.transformGetAvailabilityData(this.toGetAvailabilityData(response.availability), this.outboundRequest);
            }), map((transformedResp) => {
                transformedResp.originCalendarInfo = outboundData.originCalendarInfo;
                transformedResp.transformedAvailabilityData.originDestinations[0] = outboundData.transformedAvailabilityData.originDestinations[0];
                transformedResp.transformedAvailabilityData.originDestinations[0].showOd = false;
                transformedResp.transformedAvailabilityData.originDestinations[1].showOd = true;
                transformedResp.datalayerObject['resultadosIda'] = outboundData.datalayerObject['resultadosIda'];
                transformedResp.digitalDataObject['Slice1Results'] = outboundData.digitalDataObject['Slice1Results'];
                transformedResp.transformedAvailabilityData.fareFamilyConditions =
                    this.mergeFares(outboundData.transformedAvailabilityData.fareFamilyConditions as AvailabilityTransformerModel.FareFamilyCondition[],
                        transformedResp.transformedAvailabilityData.fareFamilyConditions as AvailabilityTransformerModel.FareFamilyCondition[]);
                transformedResp.allAvailableOffers = this.mergeOffers(outboundData.allAvailableOffers, transformedResp.allAvailableOffers);
                return transformedResp;
            }));
    }

    private toGetAvailabilityData (response: ItineraryResponseDTO): AvailabilityTransformerModel.GetAvailabilityData {
        return {
            offers: response.offers as unknown as AvailabilityTransformerModel.Offer[],
            originDestinations: response.originDestinations as unknown as AvailabilityTransformerModel.OriginDestination[],
            passengers: response.passengers as unknown as AvailabilityTransformerModel.Passenger[],
            responseId: response.responseId,
            fareFamilyConditions: response.fareFamilyConditions as unknown as AvailabilityTransformerModel.FareFamilyOptions,
            contextMetadata: response.contextMetadata as unknown as AvailabilityTransformerModel.ContextMetadata,
            uniqueProductSuproductPairs: response.uniqueProductSuproductPairs,
            relatedContent: response.relatedContent as unknown as AvailabilityTransformerModel.RelatedContent[],
            brandedFares: response.brandedFares,
            freeBaggageAllowances: response.freeBaggageAllowances,
            warnings: Array.isArray(response.warnings) ? response.warnings as unknown as AvailabilityTransformerModel.Warning[] : [],
            tax: response.offers?.[0]?.price?.tax ?? 0,
            selectedSlices: [],
            flightRatio: response.flightRatio
        };
    }

    private mergeFares (outboundFares: AvailabilityTransformerModel.FareFamilyCondition[], inboundFares: AvailabilityTransformerModel.FareFamilyCondition[]) : AvailabilityTransformerModel.FareFamilyCondition[]{
        const resultFares: AvailabilityTransformerModel.FareFamilyCondition[] = inboundFares;
        for (let outboundFare of outboundFares) {
            const match = inboundFares.some((tfare) => tfare.commercialCode === outboundFare.commercialCode);
            if (!match) {
                resultFares.push(outboundFare);
            }
        }
        return resultFares;
    }
    private mergeOffers (outboundOffers: AvailabilityTransformerModel.Offer[], inboundOffers: AvailabilityTransformerModel.Offer[]): AvailabilityTransformerModel.Offer[] {
        const offers: AvailabilityTransformerModel.Offer[] = inboundOffers;
        for (let outBoundOffer of outboundOffers) {
            const match = (inboundOffers).some((toffer) => toffer.offerId === outBoundOffer.offerId);
            if (!match) {
                offers.push(outBoundOffer);
            }
        }
        return offers;

    }


    private getErrorPagePath (error: BookingHttpErrorModel): AvailabilityErrorPagePath {
        if (error?.errorCode === 404 && this.IbBookingPetsFlowService.isPetsFlow) {
            return IbBookingSlicedAvailabilityService.ERROR_PAGE_PATHS.pets;
        }
        return IbBookingSlicedAvailabilityService.ERROR_PAGE_PATHS.generic;
    }

    private availabilityErrorOperator<T = BookingOutboundItineraryResponseType>(): (source:Observable<T>) => Observable<T> {
        return (source) => source.pipe<T>(catchError((error) => {
            this.BookingErrorPageStore.setError(ErrorType.AVAILABILITY, error);
            if (!this.IbBookingPetsFlowService.isPetsFlow && error?.errorCode === 404 && error?.internalErrorCode === 'SSE_AVM_12001') {
                this.BookingRedirectionService.path('/caldit');

            } else {
                this.BookingModalService.finishWaiting();
                this.CommonsSessionStorageService.set('availabilityErrror', error);
                this.BookingRedirectionService.path(this.getErrorPagePath(error));
            }
            return throwError(()=> error);
        }));
    }
    public updateParametersWithDiscounts = (selectedDiscounts: {largeFamilyType?: string, resident?: string}) => {
        const bookingUrlParams: any = this.CommonsSessionStorageService.get('bookingUrlParams');
        bookingUrlParams.largeFamilyType = selectedDiscounts.largeFamilyType;
        bookingUrlParams.resident = selectedDiscounts.resident;
        this.CommonsSessionStorageService.set('bookingUrlParams', bookingUrlParams);
        this.CommonsSessionStorageService.remove('availabilityRequestData');
    };
    public updateBookingAvailabilityDates = (selectedSlideInfo, index) => {
        let currentAvailabilityRequest: any = this.CommonsSessionStorageService.get('availabilityRequestData');
        const bookingUrlParams: any = this.CommonsSessionStorageService.get('bookingUrlParams');
        currentAvailabilityRequest.slices[index].date = selectedSlideInfo.serviceDate;
        bookingUrlParams.originDestinations[index].date = selectedSlideInfo.serviceDate;
        this.CommonsSessionStorageService.set('availabilityRequestData', currentAvailabilityRequest);
        this.CommonsSessionStorageService.set('bookingUrlParams', bookingUrlParams);
    };


    public nextSliceDate (isNext:boolean, availabilityData: AvailabilityTransformerModel.AvailabilityResponse, index: number) {
        const currentOrigin = availabilityData?.originDestinations[index];
        currentOrigin.calendarSlides.currentInitialSlide += isNext ? 1 : -1;
        this.IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides(currentOrigin, isNext, null, false, index);//Duda parámetros entrad
    }

    public loadMobileSlideDates (isNext:boolean, availabilityData: AvailabilityTransformerModel.AvailabilityResponse, odIndex: number, initialLoadingSlide: number) {
        const currentOrigin = availabilityData?.originDestinations[odIndex];
        currentOrigin.calendarSlides.currentInitialSlide = initialLoadingSlide;
        this.IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides(currentOrigin, isNext, null, false, odIndex);
    }
    private isSameFlight (element: AvailabilityTransformerModel.Slice, reference: AvailabilityTransformerModel.SelectedSlice) {
        try {
            const valueA = JSON.stringify(reference?.info?.segments, (key, val) => ((key === '$$hashKey') ? undefined : val));
            const valueB = JSON.stringify(element?.segments, (key, val) => ((key === '$$hashKey') ? undefined : val));
            return valueA === valueB;

        } catch (error) {
            return false;
        }
    }
    public getEquivalentSlices (availabilityData: AvailabilityTransformerModel.AvailabilityResponse, selectedSlices: AvailabilityTransformerModel.SelectedSlice[] = []): AvailabilityTransformerModel.SelectedSlice[] {
        const ods = availabilityData?.originDestinations ?? [];
        const output: AvailabilityTransformerModel.SelectedSlice[] = [];
        const selectedSlicesCopy = cloneDeep(selectedSlices);
        selectedSlicesCopy.forEach((selectedRef, index, origArray) => {
            const outSlice: AvailabilityTransformerModel.SelectedSlice = cloneDeep(selectedRef);
            const slices = ods[index]?.slices;
            let eqSlice = slices.find((newSlice) => this.isSameFlight(newSlice, outSlice));
            if (eqSlice != null) {
                outSlice.info = eqSlice;
                outSlice.info.showedCabin = selectedRef.info.showedCabin;
                outSlice.info.showFares = true;
                outSlice.info.selectedFareFamily =
                    outSlice.info.cabins[selectedRef.info.showedCabin].fareFamilies.find(fare => fare.commercialCode === selectedRef.info.selectedFareFamily.commercialCode)
                    ?? outSlice.info.cabins[selectedRef.info.showedCabin].fareFamilies[0];
                output.push(outSlice);

            }

        });
        return output;
    }

    public openFareWindowModal (selectedFareInfo: AvailabilityTransformerModel.FareFamilyCondition, fareFamilyConditions: AvailabilityTransformerModel.FareFamilyCondition[]) {
        Object.assign(selectedFareInfo ?? {}, { idModal: 'ib-compare-fares-modal' });
        const fareFamilyConditionsWithIcons = this.BookingAvailabilityTransformer.getDetailedFaresInfo(fareFamilyConditions);

        for (let conditionK in fareFamilyConditionsWithIcons.conditions) {
            const condition = fareFamilyConditionsWithIcons.conditions[conditionK];
            condition.info.icon = BookingAvailabilityConstants.FARE_FAMILY_ICON_PROPERTY_CODE[condition.info.code];
        }
        this.BookingModalService.showFaresModal(false, 'ib-compare-fares-modal.html', { fareFamilyConditions: fareFamilyConditionsWithIcons, selectedFareInfo: selectedFareInfo }, 'ib-modals--lg').result.then(()=>{}, ()=>{});
    }


    public setSegmentOfSelectedTrip (selectedTrip: AvailabilityTransformerModel.SelectedSlice[]) {
        const arraySegments = [];
        selectedTrip.forEach((trip) =>{
            if(trip.info.segments.length > 0) {
                arraySegments.push(trip.info.segments);
            }
        });
        this.CommonsSessionStorageService.set('selectedTripSegments', arraySegments);
    }
    public storeSelectedSliceData (selectedSlices :AvailabilityTransformerModel.SelectedSlice[]) {
        this.CommonsSessionStorageService.set('selectedTripInfo', selectedSlices);
        this.setSegmentOfSelectedTrip(selectedSlices);
    }

    public setStoredReleatedContent (relatedContent: Record<string, any>): AvailabilityTransformerModel.RelatedContent[]{
        const relatedContentArray: AvailabilityTransformerModel.RelatedContent[] = [];
        for (let rcItem in relatedContent) {
            const arrItem: AvailabilityTransformerModel.RelatedContent = {
                key: rcItem,
                value: relatedContent[rcItem].toString()
            };
            relatedContentArray.push(arrItem);
        }
        return relatedContentArray;
    }

    public setSlicedRequestFareInfo = async (selectedSlices: AvailabilityTransformerModel.SelectedSlice[], responseId: string, allowedRecapStep = false): Promise<void> => {
        const createFareDataInfo: SlicedCreateFareRequestDataModel = {
            availabilityData: {
                responseId: responseId
            },
            selectedSlices: selectedSlices
        };
        const requestFareInfo = this.BookingAvailabilityTransformer.createGetFareRequest(createFareDataInfo);
        this.CommonsSessionStorageService.set('requestFareInfo', requestFareInfo);
        this.CommonsSessionStorageService.set('loadingNextFlow', 2);
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        const fare = await this.BookingAvailabilityService.selectAvailability();
        this.onFareRequestSuccess(fare, selectedSlices, allowedRecapStep);
    };

    private onFareRequestSuccess = ( fareResponse: FareDataModel, selectedSlices: AvailabilityTransformerModel.SelectedSlice[], allowedRecapStep:boolean): void => {
        if ( BookingAppConstants.DYNAMIC_PRICING_WARN_FARE_ENABLE && Array.isArray(fareResponse?.warnings)) {
            const warnPriceChange = fareResponse.warnings.find(( warning: WarningsFare ) => warning.code === 'SSE_AVM_20010' || warning.code === 'SSE_AWS_9113');
            if (warnPriceChange) {
                warnPriceChange.title = 'MODAL_HEADING_ATTENTION_TEXT';
                warnPriceChange.message = warnPriceChange.description;
                this.BookingModalService.showGenericModal(true, 'generic-info-modal.html', warnPriceChange).result.then(() => { }, () => { });
            }
        }
        this.DatalayerBKIService.updateDatalayerObject(selectedSlices);
        if (allowedRecapStep) {
            this.BookingRedirectionService.path(getRedirectionPath(RouterPathsConstants.flightsRecap));
            return;
        }
        this.BookingRedirectionService.path(getRedirectionPath(RouterPathsConstants.ibpbah));
    };
    
    public checkSelectedSliceTimeLeft (selectedSlices : AvailabilityTransformerModel.SelectedSlice) : Promise<unknown>{
        const timeLeft =  this.BookingAvailabilityService.getSliceTimeLeft(selectedSlices);
        if (timeLeft?.totalMins <= BookingAvailabilityConstants.LASTMINUTE_FLIGHT_MODAL_MINS) {
            return this.BookingModalService.showBKISliceTimeLeftModal(timeLeft).result;
        }


        return Promise.resolve();
    }

    /**
     * @description Check if partner  discount is available lauch partner selection modal and return selected partner
     * @returns null or string that belongs to selected partner
     */
    public checkPartnerDiscountSelection = async (): Promise<partnerDiscountInfoBKI> => {

        if (!this.IbCUserUtilsService.isIbPlus() ) { return null; }
        return await this.IbSetPartnersSelectionUtilsService.checkPartnerDiscountSelection();
    };

    public filterDigitalDataSliceResults = (digitalData, selectedSlicesSize: number) => {
        if (selectedSlicesSize === 0 && digitalData?.[DatalayerBKIConstants.SLICE_2_RESULTS]) delete digitalData[DatalayerBKIConstants.SLICE_2_RESULTS];
        return digitalData;
    };

    public getMobileTotalPriceLiterals = ( selectedSliceIndex: number, slicesMax: number, recapStepAllowed = false): {priceTitle: string, continueText: string} =>  {
        const result = { priceTitle: 'TOTAL_PRICE_COMPONENT_TITLE', continueText: 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY' };

        if (selectedSliceIndex < (slicesMax - 1)) {
            result.priceTitle = 'SLICED_PRICE_COMPONENT_GO_TITLE';
            result.continueText = 'SLICED_PRICE_COMPONENT_BUTTON';
        } else {
            result.continueText = recapStepAllowed ? 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY_TO_RECAP' : 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY';
        }
        return result;
    };

    public getTotalDesktopContinueText = ( recapStepAllowed = false): string => {
        return recapStepAllowed ? 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY_TO_RECAP' : BookingAppConstants.TOTALPRICE_STEPS_MAP.availability.text;
    };

}
