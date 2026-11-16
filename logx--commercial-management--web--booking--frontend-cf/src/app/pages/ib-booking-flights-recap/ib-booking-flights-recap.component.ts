import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { DigitalDataSteps } from '@src/app/core/constants/ib-digital-data-constants';
import { ShoppingBasketDiscountObjectType } from '@src/app/core/models/ib-booking-availability/header-model';
import { FareDataModel, OffersFareDataModel, RelatedContentItem } from '@core/models/generic-models/fare-models';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DigitalDataUtilsService } from '../../shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbBookingCurrencyUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-currency-utils.service';
import { IbBookingRecapPageService } from './services/ib-booking-recap.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
@Component({
    selector: 'ib-booking-flights-recap-page',
    templateUrl: 'ib-booking-flights-recap.component.html',
    styleUrls: ['./ib-booking-flights-recap.component.scss'],
    providers: [IbBookingRecapPageService]
})
export class IbBookingFlightsRecapPageComponent implements OnInit {

    public slicesInfo: AvailabilityTransformerModel.SelectedSlice[];
    public selectedOffer: OffersFareDataModel;
    public footerModel: any;
    public showAdaptativeMobileFlow: boolean = false;
    public totalPriceFormatted: string;
    public termsAndConditions: RelatedContentItem | null;
    public continueButtonText: string = 'TOTAL_PRICE_CONTINUE_FLOW_RECAP';
    public isMobile: boolean = false;
    public passengerAccount: string | null = null;
    public selectedFares: string | null = null;
    private fareData: FareDataModel;
    public fareRecapModel = {
        fareFamilies: [] as AvailabilityTransformerModel.FareFamilyCondition[],
        flightRatio: '' as string
    };

    constructor (
        @Inject( AJSRootScope ) private $rootScope: CommonsRootScope,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject( AJSMonetateUtilsService ) private MonetateUtilsService: MonetateUtilsService,
        @Inject( AJSBookingModalService ) private BookingModalService: BookingModalServiceType,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private IbBookingRecapPageService: IbBookingRecapPageService,
        private IbBookingCurrencyUtilsService: IbBookingCurrencyUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingPageUtilsService: BookingPageUtilsService,
        private TranslateService: TranslateService,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService

        /* 
        private IbCUserUtilsService: IbCUserUtilsService,
        private BookingFareService: BookingFareService,
        private IbSetPartnersSelectionUtilsService: IbSetPartnersSelectionUtilsService*/
    ) { }

    @HostListener( 'window:resize', [ '$event' ] ) onResize = () => this.onResizeAction();

    ngOnInit () {
        this.setStorageData();
        this.setInitialProperties();
        this.getTermsAndConditions();
        this.IbBookingPriceDetailModalService.initPriceModalData();
        this.initHeader();
        this.initFooter();
        this.initFareRecap();
        this.setDigitalDataInfo();
        this.MonetateUtilsService.updateMonetateInfo();
        this.BookingModalService.finishWaiting();
    }

    private initHeader = () => {
        this.updateHeader();
    };

    private initFareRecap = (): void => {
        this.fareRecapModel.fareFamilies = this.fareData.fareFamilyConditions ?? [];
        this.fareRecapModel.flightRatio = this.fareData.offers[0].flightRatio ?? '';
    };

    private updateHeader = ( ) => {
        const updateTicketingFee =  ()=> {
            const ticketingFee = this.fareData.offers[0].price.ticketingFee;
            if (ticketingFee) {
                this.NewMainHeaderFacade.updateBasketOthers('SUMMARY_OTHER_FEES_ADMINISTRATION', {
                    code: 'ticketingFee',
                    description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                    parsedFee: this.IbBookingCurrencyUtilsService.getPriceFormatted(ticketingFee, true),
                    totalFee: this.fareData.offers[0].price.ticketingFee
                });
            }
        };
        const updateDiscounts = () => {
            const discountData = this.fareData.offers[0].discountsApplied?.discounts ?? [];
           
            discountData.forEach( (discount) => {
                const { type, description, totalDiscount } = discount;
                const discountItem = <ShoppingBasketDiscountObjectType> {
                    type,
                    description,
                    discount: totalDiscount,
                    totalDiscount: totalDiscount,
                    discountFormatted:  this.IbBookingCurrencyUtilsService.getPriceFormatted( totalDiscount )
                };
                this.NewMainHeaderFacade.addSimpleDiscount( discountItem );
            } );
                
        };

        const stepPosition = RouterPathsConstants.availability;
        const stepLiteral = BookingHeaderConstants.DEFAULT_STEPS[0].text;
        this.$rootScope.showHeaders = true;
        this.NewMainHeaderFacade.updateShowBasket( true );
        this.NewMainHeaderFacade.showLogin();
        this.NewMainHeaderFacade.updateStepsModel( stepPosition, stepLiteral );
        this.NewMainHeaderFacade.updateTrips(this.fareData);
        updateTicketingFee();
        updateDiscounts();
        


    };

    private setStorageData = (): void => {
        this.selectedOffer = this.CommonsSessionStorageService.get<OffersFareDataModel>( BkiStorageConstants.SELECTED_OFFER );
        this.slicesInfo = this.CommonsSessionStorageService.get<AvailabilityTransformerModel.SelectedSlice[]>( BkiStorageConstants.SELECTED_TRIP_INFO );
        this.fareData = this.CommonsSessionStorageService.get<FareDataModel>( BkiStorageConstants.FARE );
    };

    private getTermsAndConditions = (): void => {
        const relatedContent: RelatedContentItem[] = this.CommonsSessionStorageService.get<RelatedContentItem[]>( BkiStorageConstants.AVAILABILITY_RELATED_CONTENT ) ?? null;
        this.termsAndConditions = relatedContent?.find( ( content ) => content.key === 'TOTAL_PRICE' ) ?? null;
    };

    private setInitialProperties = (): void => {
        this.isMobile = this.$rootScope.isMobile.general;
        this.showAdaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
        this.totalPriceFormatted = this.IbBookingCurrencyUtilsService.getPriceFormatted( this.fareData.offers[0].price.total );
        this.BookingPageUtilsService.setPageTitle('RECAP_STEP_TITLE');
        this.passengerAccount = this.getPassengersAccountText();
        this.selectedFares = this.getSelectedFares();
    };

    private getSelectedFares = (): string => {
        const fares: string[] = [];
        this.slicesInfo.forEach(slice => {
            fares.push( slice.info.selectedFareFamily.commercialName );
        });
        return `${fares.join('/')}`;
    };

    private getPassengersAccountText = (): string => {
        const paxTotal: number = this.CommonsSessionStorageService.get<AvailabilityModels.OriginDestinationSearchModel>( BkiStorageConstants.ORIGIN_DESTINATIONS ).passengers;
        const paxSingular = this.TranslateService.instant( 'GENERAL_LABEL_PASSENGER' );
        const paxPlural= this.TranslateService.instant( 'GENERAL_LABEL_PASSENGERS' );
        return  paxTotal > 1 ? `${paxTotal} ${paxPlural}` : `${paxTotal} ${paxSingular}`;
    };

    private initFooter = (): void => {
        this.footerModel = this.BookingPageUtilsService.getFooterModel();
    };


    public onResizeAction = () => {
        this.isMobile = this.$rootScope.isMobile.general;
        this.showAdaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
    };

    private setDigitalDataInfo = (): void => {
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam( BookingAppConstants.QUADRIGAMS.RECAP, {} );
        this.DigitalDataUtilsService.setProcessAndStep( this.DigitalDataUtilsService.getProcess(), DigitalDataSteps.RECAP, BookingAppConstants.QUADRIGAMS.RECAP );
        this.DatalayerUtilsService.updateDiscountData(this.fareData.offers[0].discountsApplied?.discounts ?? []);
        this.DigitalDataUtilsService.emitViewEvent();
    };

    public onContinueFlow = () => {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        this.IbBookingRecapPageService.redirectToNextStep();

    };

}
