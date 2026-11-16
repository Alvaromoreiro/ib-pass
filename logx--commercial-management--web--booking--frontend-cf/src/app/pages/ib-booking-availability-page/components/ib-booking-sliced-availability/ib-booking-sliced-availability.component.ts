import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CommercialDataMarket } from '@core/models/generic-models/generic-models';
import { IbBookingSlicedAvailabilityService } from './services/ib-booking-sliced-availability.service';
import { debounceTime, firstValueFrom, lastValueFrom, mergeMap, of, ReplaySubject, skip, map, Subject, takeUntil } from 'rxjs';
import { BookingLocalDiscountsService } from '@shared/services/ib-booking-availability/ib-booking-utils-local-discounts.service';
import { cloneDeep } from 'lodash-es';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSMonetateUtilsService } from '@shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { RibbonDataTransformer } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-ribbon-data-transformer.service';
import type { HeaderDataType } from '@core/models/ib-booking-availability/header-model';
import { WINDOW_TOKEN } from '@core/config/ib-booking-app-tokens';
import { DatalayerBKIConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { BookingPageUtilsService } from '@shared/services/ib-utils/ib-booking-page-utils.service';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { BookingUserActivityService } from '@core/services/ib-booking-user-activity.service';
import { DigitalDataUtilsService } from '@shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbBookingFlowDetectionService, ProcessConst } from '@core/services/ib-booking-flow-detection.service';
import { IbBookingItineraryService } from './services/ib-booking-itinerary-service.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { IbAvailabilityRibbonService } from './services/ib-availability-ribbon.service';
import type { BottomFixedConfig } from './ib-booking-sliced-availability.component.model';
import { AJSIbBookingAvailabilityPageService, IbBookingAvailabilityPageServiceType } from '../../services/ib-booking-availability-page-utils-bridge.service';

@Component({
    selector: 'ib-booking-sliced-availability-component',
    templateUrl: 'ib-booking-sliced-availability.component.html',
    styleUrls: ['./ib-booking-sliced-availability.component.scss'],
    providers: [
        IbAvailabilityRibbonService,
        IbBookingSlicedAvailabilityService,
        IbBookingItineraryService //Register service due to SlicedAvailabilityService depens on it
    ]
})
export class IbBookingSlicedAvailabilityComponent implements OnInit, OnDestroy {
    private mnttLog2GTM = this.window['mnttLog2GTM'] ?? (() => { });
    private commercialData: CommercialDataMarket;
    public showLoadingFull: boolean = false;
    public currencies: AvailabilityTransformerModel.CurrenciesObject;
    public currentODIndex: number = 0;
    public availabilityDataSubject: ReplaySubject<AvailabilityTransformerModel.TransformAvailabilityResponse>;
    public selectedSlices: Array<AvailabilityTransformerModel.SelectedSlice> = [];
    public footerModel;
    public selectedOffer: AvailabilityTransformerModel.Offer;
    private viewEventSend = false;
    public loadingLiteral = 'AVAILABILITY_SLICK_CHANGE_LOADING';
    private lastInboundParams: string = null;
    public showSelectedPartner = false;
    public tripType: string = null;
    public slicesSelectionLimit = 2;
    public isLogged: string;
    public isPointsOBFlow: boolean;
    public isOBLogged: string = BookingAppConstants.LOGIN_ONB;
    public selectedOutbound: AvailabilityTransformerModel.SelectedSlice;
    private selectedPartner: partnerDiscountInfoBKI;
    private currentAvailabilityData: AvailabilityTransformerModel.TransformAvailabilityResponse;
    private currentRibbonData: AvailabilityTransformerModel.CalendarInfo;
    public flightRatio: string;

    // Reactive button Listeners
    private slideSelectedSubject: Subject<any>;
    private slideNextSubject: Subject<any>;
    private unsuscribeSubject: Subject<void> = new Subject<void>();
    public sliceAnimationRun = false;
    public isMobile: boolean = false;
    public adaptativeMobileFlow: boolean = true;
    public showAdaptativeMobileFlow: boolean = false;
    private allowedRecapStep: boolean = false;

    //Configuration Objects
    public tripConfig: {
        tripModels: AvailabilityTransformerModel.OriginDestination[],
        relatedContent: Record<string, any>,
    };
    public slicedPriceConfig = {
        totalPrice: [] as string[],
        conditionsText: ''
    };
    public mobileRibbonConfig = {
        show: false,
        calendarData: null as AvailabilityTransformerModel.SlidesDataResponse,
        isInitialized: false
    };
    public localDiscountSelectorConfig = { show: false, originCity: '', destinationCity: '', residentCodeSelected: '', familyCodeSelected: '' };

    public mobileBottomFixedConfig :BottomFixedConfig= {
        priceTitle: 'SLICED_PRICE_COMPONENT_GO_TITLE',
        continueText: 'SLICED_PRICE_COMPONENT_BUTTON'
    };
    public totalPriceDesktopContinueText: string;
    public isPetsFlow = false;


    constructor (
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject(AJSRootScope) private $rootScope: any,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        @Inject(AJSDatalayerBKIService) private DatalayerBKIService: AJSDatalayerBKIServiceType,
        @Inject(AJSMonetateUtilsService) private MonetateUtilsService: MonetateUtilsService,
        @Inject(WINDOW_TOKEN) private window: Window,
        @Inject(AJSIbBookingAvailabilityPageService) private IbBookingAvailabilityPageUtilsService: IbBookingAvailabilityPageServiceType,
        private RibbonDataTransformer: RibbonDataTransformer,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingSlicedAvailabilityService: IbBookingSlicedAvailabilityService,
        private BookingLocalDiscountsService: BookingLocalDiscountsService,
        private BookingPageUtilsService: BookingPageUtilsService,
        private BookingUserActivityService: BookingUserActivityService,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private flowDetectionService: IbBookingFlowDetectionService
    ) {
        this.availabilityDataSubject = new ReplaySubject(1);
        this.slideSelectedSubject = new Subject<any>();
        this.slideNextSubject = new Subject<any>();

        const urlParams = CommonsSessionStorageService.get<any>('bookingUrlParams');
        const chosenResident = urlParams.resident ?? '';
        const chosenFamily = urlParams.largeFamilyType || '';


        this.tripType = urlParams?.tripType;
        this.localDiscountSelectorConfig.residentCodeSelected = chosenResident;
        this.localDiscountSelectorConfig.familyCodeSelected = chosenFamily;
        this.slicesSelectionLimit = (this.tripType === '1' || this.tripType === BookingAppConstants.BOOKING_PARAMS_VALUES.META_ONE_WAY) ? 1 : 2;
        this.CommonsSessionStorageService.set('adaptativeMobileFlow', this.adaptativeMobileFlow);
    }

    @HostListener('selectedSliceEvent', ['$event']) onSelectedSliceEvent =
        (event: CustomEvent) => {
            event.preventDefault(); event.stopPropagation(); this.selectSlice(event);
        };
    @HostListener('slideSelected', ['$event']) onSlideRibbon = (event: CustomEvent) => {
        event.preventDefault(); event.stopPropagation(); this.ribbonChangeDate(event.detail);
    };
    @HostListener('nextSlideDate', ['$event']) onextSlideDate =
        (event: CustomEvent) => { event.preventDefault(); event.stopPropagation(); this.slideNextSubject.next(event?.detail?.isNext); };

    @HostListener('openFareModal', ['$event']) openFareModal =
        (event: CustomEvent) => { event.preventDefault(); event.stopPropagation(); this.openFareComparationModal(event?.detail?.fareInfo); };
    @HostListener('selectedFareFamily', ['$event']) selectedFareFamily =
        (event: CustomEvent) => { event.preventDefault(); event.stopPropagation(); this.onSelectedFareFamily(event?.detail?.fareInfo); };

    @HostListener('window:resize', ['$event']) onResize = () => this.onResizeAction();
    @HostListener('window:newFare', ['$event']) onNewFare = () => this.setNewFare();


    ngOnInit () {
        this.isLogged= this.$rootScope.isLogged;
        const calditRequest = this.CommonsSessionStorageService.get('newAvailabilityRequestData');
        this.commercialData = this.CommonsSessionStorageService.get('commercialData');
        this.CommonsSessionStorageService.set('oBDiscountType', true);
        this.CommonsSessionStorageService.set('availabilityRequestData', calditRequest);
        this.CommonsSessionStorageService.remove('newAvailabilityRequestData');
        this.CommonsSessionStorageService.remove('calditMode');
        this.showAdaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
        this.isMobile = this.$rootScope.isMobile?.general;
        this.initItineraryCall();
        this.allowedRecapStep = this.CommonsSessionStorageService.get<boolean>(BkiStorageConstants.ALLOW_RECAP_STEP) ?? false;
        this.mobileBottomFixedConfig = this.IbBookingSlicedAvailabilityService.getMobileTotalPriceLiterals(0, this.slicesSelectionLimit, this.allowedRecapStep);
        this.totalPriceDesktopContinueText = this.IbBookingSlicedAvailabilityService.getTotalDesktopContinueText(this.allowedRecapStep);
        firstValueFrom(this.availabilityDataSubject).then(this.initComponent, () => { });
        const flowResult = this.flowDetectionService.detectFlow();
        this.isPetsFlow = flowResult.flow === ProcessConst.PETS;

    }

    ngOnDestroy () {
        this.unsuscribeSubject.next();
        this.availabilityDataSubject.complete();
        this.unsuscribeSubject.complete();
    }

    private initItineraryCall = async () => {
        this.selectedPartner = await this.IbBookingSlicedAvailabilityService.checkPartnerDiscountSelection();
        this.loadOutboundGrid();
    };
    private initComponent = () => {
        this.initHeader();
        this.initFooter();
        this.initPartnerCollapsable();
        this.reactiveTripConfigurator();
        this.reactiveLocalDiscountsConfigurator();
        this.BookingModalService.finishWaiting();
        this.datalayerUpdate();
        this.initRibbonCalendarSubcriptions();
    };

    private initRibbonCalendarSubcriptions = ()=> {
        this.slideSelectedSubject.pipe(
            takeUntil(this.unsuscribeSubject),
            map((event) => {
                this.showLoadingFull = true;
                return event;
            }),
            debounceTime(100)
        ).subscribe(this.onSlideSelected);

        this.slideNextSubject.pipe(
            takeUntil(this.unsuscribeSubject),
            debounceTime(250)
        ).subscribe((data) => {
            this.nextSliceDate(data, this.currentODIndex);
        });
    };




    public ribbonChangeDate = (detail) => {
        this.slideSelectedSubject.next(detail);
    };
    private initPartnerCollapsable = () => {
        this.showSelectedPartner = this.selectedPartner?.partnerIdentifier === 'SAN';
    };
    private OnAfterLogin = async () => {
        //Pendiente de implementar la modal de seleccion de partner antes de ejecutar el init
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        this.CommonsSessionStorageService.remove('availabilityRequestData');
        this.initItineraryCall();
        firstValueFrom(this.availabilityDataSubject.pipe(skip(1)))
            .then(
                () => {
                    this.onResetBasket();
                    this.initPartnerCollapsable();
                    this.selectedSlices = [];
                    this.BookingModalService.finishWaiting();
                }, this.BookingModalService.finishWaiting);


    };
    private initFooter = () => {
        this.footerModel = this.BookingPageUtilsService.getFooterModel();
    };

    private initHeader = () => {
        const stepPosition = this.CommonsSessionStorageService.get<string>('actualStepFlow');
        const stepLiteral = this.selectedSlices.length >= 1 ? BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_INBOUND : BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OUTBOUND;
        this.CommonsSessionStorageService.remove('headerModel');
        this.NewMainHeaderFacade.initHeader({
            originDestination: this.CommonsSessionStorageService.get('originDestination'),
            redemption: false,
            flightType: BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY,
            currency: this.CurrencyService.getCurrencyObject(this.commercialData.currency),
            showModalBackHome: true,
            showBasket: true
        },
        { hasSteps: true, steps: 'DEFAULT_STEPS', position: stepPosition },
        {
            afterLogin: this.OnAfterLogin.bind(this),
            userLogged: this.CommonsSessionStorageService.get('userLogged'),
            loggedData: this.CommonsSessionStorageService.get('customerData') || this.CommonsSessionStorageService.get('membershipData') || undefined
        });
        this.NewMainHeaderFacade.updateStepsModel(stepPosition, stepLiteral);
        this.$rootScope.showHeaders = true;

    };

    private onResizeAction = () => {
        if (this.selectedSlices.length !== 0) {
            this.IbBookingAvailabilityPageUtilsService.equalFareHeights();
        }
        this.isMobile = this.$rootScope.isMobile.general;
        this.showAdaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
        this.syncRibbonState();
    };

    private syncRibbonState = () => {
        if (!this.currentAvailabilityData || !this.currentRibbonData) {
            this.mobileRibbonConfig.show = false;
            return;
        }

        const currentOriginDestination = this.currentAvailabilityData.transformedAvailabilityData.originDestinations?.[this.currentODIndex];
        const currencyStr = currentOriginDestination?.currency;

        if (!currentOriginDestination || !currencyStr) {
            this.mobileRibbonConfig.show = false;
            return;
        }

        const ribbonState = this.RibbonDataTransformer.transformSlicedRibbonState(
            this.currentRibbonData,
            this.currentODIndex,
            this.currentAvailabilityData.transformedAvailabilityData.currencies[currencyStr]
        );

        this.currentAvailabilityData.originCalendarInfo = ribbonState.originCalendarInfo;
        currentOriginDestination.calendarSlides = ribbonState.slidesData;
        this.mobileRibbonConfig.calendarData = ribbonState.slidesData;
        this.mobileRibbonConfig.show = this.showAdaptativeMobileFlow;
    };


    private loadOutboundGrid = () => {
        this.showLoadingFull = true;
        this.currentAvailabilityData = null;
        this.currentRibbonData = null;
        this.mobileRibbonConfig.calendarData = null;
        this.loadRibbon();
        lastValueFrom(this.IbBookingSlicedAvailabilityService.getOutboudAvailabilityGrid()).then((data) => {
            this.currentODIndex = 0;
            this.flightRatio = data.transformedAvailabilityData.flightRatio;
            this.IbBookingSlicedAvailabilityService.setStoredReleatedContent(data?.transformedAvailabilityData?.relatedContent);
            this.NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OUTBOUND);
            this.currentAvailabilityData = data;
            this.syncRibbonState();
            this.BookingUserActivityService.initKeepAliveTimer();
            this.availabilityDataSubject.next(data);

            requestAnimationFrame(() => {
                this.showLoadingFull = false;
            });
        }, () => { });
    };

    private loadRibbon = () => {
        this.mobileRibbonConfig.show = false;
        this.IbBookingSlicedAvailabilityService.getRibbonAvailability()
            .pipe(takeUntil(this.unsuscribeSubject))
            .subscribe((data) => {
                this.currentRibbonData = data as AvailabilityTransformerModel.CalendarInfo;
                this.syncRibbonState();
            }, () => { });
    };

    private loadInboundGrid = () => {
        this.showLoadingFull = true;
        this.currentAvailabilityData = null;
        this.mobileRibbonConfig.calendarData = null;
        this.mobileRibbonConfig.show = false;
        let newParams;
        const onSuccess = (returnData) => {
            this.availabilityDataSubject.next(returnData);
            this.currentODIndex = 1;
            this.IbBookingSlicedAvailabilityService.setStoredReleatedContent(returnData?.transformedAvailabilityData?.relatedContent);
            this.lastInboundParams = newParams;
            this.NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_INBOUND);
            this.currentAvailabilityData = returnData;
            this.syncRibbonState();
            requestAnimationFrame(() => {
                this.showLoadingFull = false;
            });
        };
        firstValueFrom(this.availabilityDataSubject).then((data) => {
            const responseId = data.transformedAvailabilityData.responseId;
            const offerId = this.selectedOffer.offerId;
            const sliceId = this.selectedSlices[0].info.sliceId;
            newParams = `${responseId}/${offerId}/${sliceId}`;
            if (newParams === this.lastInboundParams && data?.transformedAvailabilityData?.originDestinations?.length === 2) {
                onSuccess(data);
                return;
            }
            return lastValueFrom(this.IbBookingSlicedAvailabilityService.getInboundAvailabilityGrid(cloneDeep(data), offerId, sliceId))
                .then(onSuccess, () => { });
        }, () => { });
    };
    private loadCompleteAvailability = () => {
        this.showLoadingFull = true;
        this.currentAvailabilityData = null;
        this.currentRibbonData = null;
        this.mobileRibbonConfig.calendarData = null;
        this.loadRibbon();
        lastValueFrom(this.IbBookingSlicedAvailabilityService.getOutboudAvailabilityGrid()
            .pipe(mergeMap((outBoundData) => {
                this.currentODIndex = 0;
                const eqSlices = this.IbBookingSlicedAvailabilityService.getEquivalentSlices(cloneDeep(outBoundData.transformedAvailabilityData), [cloneDeep(this.selectedSlices[0])]);
                // If there is no equivalent new slice
                if (eqSlices == null || eqSlices?.length === 0) {
                    this.BookingModalService.showGenericError({
                        title: 'IBBKERROR_TEXT_SORRY',
                        needsTranslate: true,
                        hideClose: false,
                        hideFooter: false,
                        message: 'MODAL_SELECTEDOFFER_NOT_AVAILABLE'
                    }, true).result.then(() => { }, () => { });
                    return of(outBoundData);
                } else {
                    this.currentODIndex = 1;
                }
                const responseId = outBoundData.transformedAvailabilityData.responseId;
                const offerId = eqSlices[0].info.selectedFareFamily.offers[0].offerId;
                const sliceId = eqSlices[0].info.sliceId;
                this.lastInboundParams = `${responseId}/${offerId}/${sliceId}`;
                return this.IbBookingSlicedAvailabilityService.getInboundAvailabilityGrid(outBoundData, offerId, sliceId);
            })))
            .then((data) => {
                this.availabilityDataSubject.next(data);
                this.IbBookingSlicedAvailabilityService.setStoredReleatedContent(data?.transformedAvailabilityData?.relatedContent);
                this.currentAvailabilityData = data;
                this.syncRibbonState();
                requestAnimationFrame(() => {
                    this.showLoadingFull = false;
                });
            }, () => { });
    };


    private setLocalDiscountConfigData = (data: AvailabilityTransformerModel.AvailabilityResponse) => {
        const origin = data.originDestinations[0].originCity;
        const dest = data.originDestinations[0].destinationCity;
        if ('ES' === origin.country.code && 'ES' === dest.country.code) {
            this.localDiscountSelectorConfig.destinationCity = dest.code;
            this.localDiscountSelectorConfig.originCity = origin.code;
            this.localDiscountSelectorConfig.show = this.BookingLocalDiscountsService.isResidentAvailable(origin.code, dest.code);
        }

    };
    
    private reactiveLocalDiscountsConfigurator = () => {
        firstValueFrom(this.availabilityDataSubject).then(data => this.setLocalDiscountConfigData(data.transformedAvailabilityData), () => { });
    };

    private reactiveTripConfigurator = () => {
        this.availabilityDataSubject.pipe(takeUntil(this.unsuscribeSubject)).subscribe({
            next: (data) => {
                const config = {
                    tripModels: data.transformedAvailabilityData?.originDestinations,
                    relatedContent: data.transformedAvailabilityData?.relatedContent
                };
                this.tripConfig = config;
                this.currencies = data.transformedAvailabilityData.currencies;
            }
        });
    };

    public nextSliceDate = (isNext, index = this.currentODIndex) => {
        firstValueFrom(this.availabilityDataSubject).then((availabilityData) => {
            this.IbBookingSlicedAvailabilityService.nextSliceDate(isNext, availabilityData?.transformedAvailabilityData, index);
        }, () => { });
    };
    public loadCalendarSlidesMobile = (slideDateIndex, isLower) => {
        firstValueFrom(this.availabilityDataSubject).then((availabilityData) => {
            this.IbBookingSlicedAvailabilityService.loadMobileSlideDates(isLower, availabilityData?.transformedAvailabilityData, this.currentODIndex, slideDateIndex);
        }, () => { });
    };

    public onDomesticDiscountChange = (discountData: AvailabilityModels.DomesticDiscountChangeEvent) => {
        this.showLoadingFull = true;
        this.loadingLiteral = 'AVAILABILITY_SLICK_PRICES_LOADING';
        this.localDiscountSelectorConfig.familyCodeSelected = discountData.largeFamilyType;
        this.localDiscountSelectorConfig.residentCodeSelected = discountData.resident;
        this.IbBookingSlicedAvailabilityService.updateParametersWithDiscounts(discountData);
        const loadingAction = [this.loadOutboundGrid, this.loadCompleteAvailability];
        loadingAction[this.currentODIndex].call(this);
        firstValueFrom(this.availabilityDataSubject.pipe(skip(1)))
            .then((data) => {
                if (this.selectedSlices.length > 0) {
                    this.recalculateSelectedSlice(cloneDeep(data));
                }
                this.loadingLiteral = 'AVAILABILITY_SLICK_CHANGE_LOADING';
            }, () => { });
    };

    private selectSlice = (event) => {
        const isNewFareDesign = this.$rootScope.newFare;
        firstValueFrom(this.availabilityDataSubject).then((availabilityData) => {
            const selectedSlice: AvailabilityTransformerModel.SelectedSlice = cloneDeep(event.detail.selectedSlice);
            if (this.selectedSlices[this.currentODIndex]?.info?.sliceId !== selectedSlice?.info?.sliceId) {
                selectedSlice.info.showFares = true;
                this.selectedSlices[this.currentODIndex] = selectedSlice;
                this.selectedSlices[this.currentODIndex].info.selectedFareFamily = !isNewFareDesign ? selectedSlice.info.cabins[selectedSlice.cabin].fareFamilies[0] : null;
                this.selectedSlices[this.currentODIndex].destinationCountry = availabilityData.transformedAvailabilityData.originDestinations[this.currentODIndex].destinationCity.countryCode;
                this.selectedSlices[this.currentODIndex].originCountry = availabilityData.transformedAvailabilityData.originDestinations[this.currentODIndex].originCity.countryCode;
                this.onSelectedFareFamily(this.selectedSlices[this.currentODIndex].info.selectedFareFamily);
                this.IbBookingSlicedAvailabilityService.storeSelectedSliceData(this.selectedSlices);
                if (this.selectedSlices.length === 1) {
                    this.IbBookingSlicedAvailabilityService.checkSelectedSliceTimeLeft(selectedSlice)
                        .then(() => { }, this.onRemoveSelectedSlice);
                }

            }
            this.runSelectedSliceAnimation();
            this.NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FARE);
        }, () => { });

    };
    private recalculateSelectedSlice = (availabilityData: AvailabilityTransformerModel.TransformAvailabilityResponse) => {
        this.selectedSlices = this.IbBookingSlicedAvailabilityService.getEquivalentSlices(availabilityData?.transformedAvailabilityData, this.selectedSlices);
        this.selectedSlices[this.currentODIndex] && this.updateFareSelected(this.selectedSlices[this.currentODIndex]?.info?.selectedFareFamily, availabilityData);
        this.IbBookingSlicedAvailabilityService.storeSelectedSliceData(this.selectedSlices);
        this.IbBookingAvailabilityPageUtilsService.equalFareHeights();
    };
    private updateFareSelected = (fare: AvailabilityTransformerModel.FareFamilyCondition, availability: AvailabilityTransformerModel.TransformAvailabilityResponse) => {
        this.updateSlicedPriceConfig(fare, availability);
        this.updateSelectedSlices(fare);
        this.IbBookingSlicedAvailabilityService.storeSelectedSliceData(this.selectedSlices);
        this.updateDatalayer(fare);
        this.updateSelectedOutbound(fare);
        if (this.selectedSlices.length === this.slicesSelectionLimit) {
            this.onUpdateBasket();
            this.CommonsSessionStorageService.set(BkiStorageConstants.SELECTED_OFFER, this.selectedOffer);
        }
    };

    private updateSlicedPriceConfig = (fare: AvailabilityTransformerModel.FareFamilyCondition, availability: AvailabilityTransformerModel.TransformAvailabilityResponse) => {
        this.slicedPriceConfig.totalPrice[this.currentODIndex] = this.CurrencyService.formatPrice(this.currencies[fare.fareCurrency], fare.farePrice, true);
        this.slicedPriceConfig.conditionsText = availability?.transformedAvailabilityData.relatedContent['TOTAL_PRICE']?.toString() ?? '';
    };

    private updateSelectedSlices = (fare: AvailabilityTransformerModel.FareFamilyCondition) => {
        this.selectedOffer = fare.offers[0];
        if (this.selectedSlices[this.currentODIndex]?.info) {
            this.selectedSlices[this.currentODIndex].info.selectedFareFamily = fare;
            this.selectedSlices[this.currentODIndex].info.selectedCabin = fare.cabinType;
            this.selectedSlices[this.currentODIndex].cabin = fare.cabinType;
        }
    };

    private updateDatalayer = (fare: AvailabilityTransformerModel.FareFamilyCondition) => {
        this.DatalayerUtilsService.updateDiscountData(this.selectedOffer?.discountsApplied?.discounts ?? []);
        this.DatalayerBKIService.getDigitalDataEcommerce([this.selectedSlices[this.currentODIndex]], DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
    };

    private updateSelectedOutbound = (fare: AvailabilityTransformerModel.FareFamilyCondition) => {
        if (this.selectedOutbound && this.slicesSelectionLimit === 2) {
            const modifiedSlice = { ...this.selectedOutbound };
            modifiedSlice.info.selectedFareFamily.farePriceShown = this.CurrencyService.formatPrice(this.currencies[fare.fareCurrency], this.selectedOffer.originDestinations[0].totalPrice.total, false, true);
            this.selectedOutbound = modifiedSlice;
        }
    };

    private openFareComparationModal = (fareDetails: AvailabilityTransformerModel.FareFamilyCondition) => {
        firstValueFrom(this.availabilityDataSubject).then(
            (availabilityData) => {
                this.IbBookingSlicedAvailabilityService.openFareWindowModal(fareDetails, availabilityData.fareFamilyConditions as AvailabilityTransformerModel.FareFamilyCondition[]);
            }, () => { });
    };

    public onRemoveSelectedSlice = () => {
        firstValueFrom(this.availabilityDataSubject).then(
            (data) => {
                this.selectedSlices.pop();
                this.IbBookingSlicedAvailabilityService.storeSelectedSliceData(this.selectedSlices);
                //resend last data to reload grid using observables
                this.availabilityDataSubject.next(data);
                this.currentAvailabilityData = data;
                this.syncRibbonState();
                this.onResetBasket();
                if (this.selectedSlices.length === 1) {
                    this.currentODIndex === 1 && this.NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_INBOUND);
                } else if (this.selectedSlices.length === 0) {
                    this.NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OUTBOUND);
                }
            },
            () => { });

    };

    public onSelectedFareFamily = (fare: AvailabilityTransformerModel.FareFamilyCondition) => {
        if (fare) {
            firstValueFrom(this.availabilityDataSubject).then((data) => {
                this.updateFareSelected(fare, cloneDeep(data));
            }, () => { });
        }
    };

    public onOutboundContinue = () => {
        this.loadInboundGrid();
        this.mobileBottomFixedConfig = this.IbBookingSlicedAvailabilityService.getMobileTotalPriceLiterals(this.selectedSlices.length, this.slicesSelectionLimit, this.allowedRecapStep);
        this.selectedOutbound = cloneDeep(this.selectedSlices[ 0 ]);
        this.window.scrollTo(0, 0);
    };


    public onReselectOutboundFare = () => {
        this.isMobile = this.$rootScope.isMobile?.general;

        if (this.selectedSlices?.length > 1) {
            this.selectedSlices.pop();
        }
        this.currentODIndex = 0;
        this.selectedOffer = this.selectedSlices[this.currentODIndex].info.selectedFareFamily.offers[0];
        this.syncRibbonState();
        this.runSelectedSliceAnimation();
        this.IbBookingAvailabilityPageUtilsService.equalFareHeights();
        this.NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FARE);
        this.mobileBottomFixedConfig = this.IbBookingSlicedAvailabilityService.getMobileTotalPriceLiterals(0, this.slicesSelectionLimit, this.allowedRecapStep);

        this.onResetBasket();
    };

    public onContinueEvent = async (): Promise<void> => {
        try {
            const data = await firstValueFrom(this.availabilityDataSubject);
            const responseId: string = data.transformedAvailabilityData.responseId;
            await this.IbBookingSlicedAvailabilityService.setSlicedRequestFareInfo(
                this.selectedSlices,
                responseId,
                this.allowedRecapStep
            );
        } catch (error) {
            this.showFareErrorModal(error);
        }
    };
    
    private showFareErrorModal = ( error: unknown ): void => {
        this.BookingModalService.showGenericError(error).result.then(this.handleFareErrorModal, this.handleFareErrorModal);
    };

    private handleFareErrorModal = (): void => {
        this.selectedSlices = [];
        this.onResetBasket();
        firstValueFrom(this.availabilityDataSubject.pipe(skip(1)))
            .then(
                () => {
                    this.BookingModalService.finishWaiting();
                }, this.BookingModalService.finishWaiting );
        this.loadOutboundGrid();
    };
    
    public onSlideSelected = (detail) => {
        const loadingAction = [this.loadOutboundGrid, this.loadCompleteAvailability];
        this.IbBookingSlicedAvailabilityService.updateBookingAvailabilityDates(detail?.slide, this.currentODIndex);
        this.IbBookingAvailabilityPageUtilsService.updateHeaderDates(this.currentODIndex, detail.slide.serviceDate);
        loadingAction[this.currentODIndex].call(this);
        firstValueFrom(this.availabilityDataSubject.pipe(skip(1)))
            .then((data) => {
                if (this.selectedSlices.length > 0) {
                    this.recalculateSelectedSlice(cloneDeep(data));
                }
                this.initHeader();
            }, () => { });
    };
    private setNewFare = () => {
        if (!this.$rootScope.newFare) {
            this.mnttLog2GTM('ATQ-9506: Show new design for highlight cards on dispo', 'Variante A');
        }
        this.$rootScope.newFare = true;


    };
    private datalayerUpdate = () => {
        this.availabilityDataSubject.pipe(takeUntil(this.unsuscribeSubject)).subscribe({
            next: (data) => {
                if (!this.viewEventSend) {
                    this.DatalayerUtilsService.removeDigitalDataObjects([...Object.keys(data.digitalDataObject),
                        DatalayerBKIConstants.LARGE_FAMILY, DatalayerBKIConstants.RESIDENT_CODE]);
                    this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(
                        BookingAppConstants.QUADRIGAMS.AVAILABILITY,
                        this.IbBookingSlicedAvailabilityService.filterDigitalDataSliceResults(data.digitalDataObject, this.selectedSlices.length));
                    this.setInitialDatalayer(data);
                    this.viewEventSend = true;
                } else {
                    this.DigitalDataUtilsService.updateDigitalData(
                        this.IbBookingSlicedAvailabilityService.filterDigitalDataSliceResults(data.digitalDataObject, this.selectedSlices.length));
                }
            }
        });
    };


    private setInitialDatalayer = (availabilityResponse: AvailabilityTransformerModel.TransformAvailabilityResponse) => {
        this.DatalayerUtilsService.updateDatalayerViewEvent();
        this.MonetateUtilsService.updateMonetateInfo();
        this.MonetateUtilsService.addFlightSearchMonetate(this.CommonsSessionStorageService.get('bookingUrlParams'), this.CommonsSessionStorageService.get('originDestination'), availabilityResponse.transformedAvailabilityData);
    };
    private resetBasketDiscounts = () => {
        const headerData: HeaderDataType = this.CommonsSessionStorageService.get('headerModel');
        if (headerData?.headerModel?.shoppingBasket?.discountsModel?.hasDiscounts) {
            Object.keys(headerData.headerModel.shoppingBasket.discountsModel.discounts).forEach((discount): void => {
                this.NewMainHeaderFacade.deleteDiscountFromBasket(discount);
            });
        }
    };
    private onResetBasket = (): void => {
        this.resetBasketDiscounts();
        this.NewMainHeaderFacade.deleteTripsBasketFromDispo();
    };
    private onUpdateBasket = (): void => {
        firstValueFrom(this.availabilityDataSubject).then((data) => {
            const avabilabilityModel = {
                availabilityData: cloneDeep(data.transformedAvailabilityData),
                selectedSlices: this.selectedSlices
            };
            this.NewMainHeaderFacade.updateTripsBasketFromDispo(this.selectedOffer, avabilabilityModel);
            this.resetBasketDiscounts();

            this.selectedOffer?.discountsApplied?.discounts?.forEach((discount) => {
                this.NewMainHeaderFacade.updateBasketDiscountsNew(discount, this.selectedOffer.discountsApplied.originalPrice, this.selectedOffer.discountsApplied.totalDiscount, this.selectedOffer.price.total);
            });
        }, () => { });
    };

    public onSelectedUpselling = (fare: AvailabilityTransformerModel.FareFamilyCondition) => {
        this.selectedSlices[this.currentODIndex].info.selectedFareFamily = fare;
        this.onSelectedFareFamily(fare);
    };

    public runSelectedSliceAnimation () {
        this.sliceAnimationRun = true;
        setTimeout(() => {
            this.window.scrollTo(0, 0);
            this.sliceAnimationRun = false;
        });


    }
    public onMobileContinueFlow = (): void => {
        const rtStep1 = this.slicesSelectionLimit === 2 && this.currentODIndex === 0;
        rtStep1 ? this.onOutboundContinue() : this.onContinueEvent();
    };

}
