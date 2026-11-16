import { Component, ChangeDetectorRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, HostListener } from '@angular/core';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSRootScope, CommonsCookiesService, CommonsRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { IbBookingPmtService } from './services/ib-booking-pmt.service';
import { IbBookingPmtFormService } from './services/ib-booking-pmt-form.service';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { BookingPageUtilsService } from '@shared/services/ib-utils/ib-booking-page-utils.service';
import { LoadingOverlay, LoadingOverlayProps, OnHoldInfo, OnHoldInfoProps, OnholdOptions, OnholdOptionsProps, OnHoldOption, Summary, SummaryProps } from 'commercial-management--digital--web-components-design--library';
import { ReactComponentData } from '@src/app/core/models/generic-models/generic-models';
import { VoucherValidatedEvent } from '@src/app/core/models/ib-booking-payments/ib-booking-voucher-models';
import { Order, PassengerPrices, Taxes, VoucherDiscountOrder } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { HeaderDataType, ShoppingBasketItemTotal } from '@src/app/core/models/ib-booking-availability/header-model';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { OnHoldFreeParams } from '@src/app/core/models/on-hold/on-hold-models';
import { FareDataModel, FareOnHoldOptions, RelatedContentItem } from '@src/app/core/models/generic-models/fare-models';
import { ErrorSubscriptionModel, OnErrorEvent, OnErrorEventStatus, OnPaymentSuccessEvent, PaymentsInfoType, PmtPageOnHoldInfo, PmtPageTitleInfo, PmtRedirectionInfo, PmtWebComponentSubs, PriceSubscriptionModel } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { GetContextIdParams, GetContextResponse, GetContextResponseWarningCodes, GetContextResponseWarnings } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { PMTManagedErrors } from '@src/app/core/constants/ib-booking-managed-errors-payment';
import { BkiPmtConstants, defaultPaymentInfo } from '@src/app/core/constants/ib-booking-payments-constants';
import { IbPaymentOnholdOrderService } from '@src/app/shared/http-services/sse-orm/ib-payment-onhold-order.service';
import { DigitalDataConstants } from '@src/app/core/constants/ib-digital-data-constants';
import { IbBookingPmtDigitalDataService } from './services/ib-booking-pmt-digital-data.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingPmtErrorsService } from './services/ib-booking-pmt-errors.service';
import { GetPaymentsIssues } from '@src/app/shared/http-services/sse-orm/ib-payment-issues.service';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { Auth as PmtComponentAuth } from '@core/models/ib-booking-payments/ib-booking-payments-model';
import { IbBookingPmtSuccessEventService } from './services/ib-booking-pmt-success-event.service';
import { NavigationManagerService } from '@src/app/core/services/navigation/ib-booking-navigation-manager.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

@Component({
    selector: 'ib-booking-pmt',
    templateUrl: 'ib-booking-pmt.component.html',
    styleUrls: ['./ib-booking-pmt.component.scss'],
    providers: [IbBookingPmtErrorsService]
})
export class IbBookingPmtComponent implements OnInit, OnDestroy {
    @Input() public paymentInfo;
    @Output() public returnToOld = new EventEmitter();
    public summaryComponent: ReactComponentData<SummaryProps> = {
        component: Summary,
        props: {} as SummaryProps
    };

    public onHoldInfoDiscountComponent: ReactComponentData<OnHoldInfoProps> = {
        component: OnHoldInfo,
        props: {
            type: 'discount'
        } as OnHoldInfoProps
    };

    public onHoldInfoPriceComponent: ReactComponentData<OnHoldInfoProps> = {
        component: OnHoldInfo,
        props: {
            type: 'price',
            lang: BookingAppConstants.lang
        } as OnHoldInfoProps
    };

    public onHoldInfoTimeComponent: ReactComponentData<OnHoldInfoProps> = {
        component: OnHoldInfo,
        props: {
            type: 'time'
        } as OnHoldInfoProps
    };

    public onHoldOptionsComponent: ReactComponentData<OnholdOptionsProps> = {
        component: OnholdOptions,
        props: {} as OnholdOptionsProps
    };

    public loadingDsComponent: ReactComponentData<LoadingOverlayProps> = {
        component: LoadingOverlay,
        props: {} as LoadingOverlayProps
    };

    public readonly PAYMENT_COMP_BLOCK_ID = 'payments-components';
    public pageTitle: string = '';
    public renderPmtComponent: boolean = true;
    public hidePaymentComponent: boolean = false;
    public onHoldFreeConditions: string | null = null;
    public selectedOhIndex: number | null = null;
    public onHoldOrder: boolean = false;
    public onHoldOptions: FareOnHoldOptions[] | null = null;
    public selectedOnHoldOption: FareOnHoldOptions | null = null;
    public totalPrice: ShoppingBasketItemTotal = <ShoppingBasketItemTotal> {};
    public residentWarning: GetContextResponseWarnings | undefined = undefined;
    private pmtDDModelInfo = {
        quadrigams: {
            payments: BookingAppConstants.QUADRIGAMS.BKI_PAYMENTS_NEW,
            confirmation: BookingAppConstants.QUADRIGAMS.BKI_CONFIRMATION_NEW
        }
    };
    private paymentsDDInfo: PaymentsInfoType = <PaymentsInfoType> { ...defaultPaymentInfo };
    /**
    *  Stream subject to get the last update for any of the events provided by payment form.
    *  These streams will inmediately respond with the lastest value emitted through the channel.
    */
    private pmtPriceUpdateStm = new ReplaySubject<PriceSubscriptionModel>(1);
    private pmtPaymentUpdateStm = new ReplaySubject(1);
    private pmtErrorUpdateStm = new ReplaySubject<ErrorSubscriptionModel>(1);
    // Subject to force unsuscribe in order to avoid memory leaks
    private unsuscribeUpdatesStm = new Subject<void>();
    public footerModel: any;
    public currentOrder: Order;
    public currency: Currency;
    public voucherDiscount: VoucherDiscountOrder;
    public showLoadingOverlay: boolean = false;
    private pmtLoadingProps: LoadingOverlayProps = {
        title: this.TranslateService.instant('WAIT_A_MOMENT_PLEASE'),
        subtitles: [ this.TranslateService.instant('WAIT_A_MOMENT_RECALCULATE_BKI'), this.TranslateService.instant('WAIT_A_MOMENT_ALMOST_FINISH_BKI') ],
        isOpen: false,
        textTransition: 8000
    };
    private pmtLoadingPayProps: LoadingOverlayProps = {
        title: this.TranslateService.instant('WAIT_A_MOMENT_PLEASE'),
        subtitles: [ this.TranslateService.instant('WAITING_LOADING_PAYMENTS_CARDS_TITLE')],
        isOpen: false,
        textTransition: 0
    };

    private pmtContext: GetContextResponse;
    public termsAndConditionsCheck: RelatedContentItem['value'] | undefined;
    private fareData: FareDataModel = null;
    private afopPaymentCompleted: boolean =  true; //True if not afop or not incompleted
    public showAdaptativeMobileFlow: boolean = false;
    //Flow id if it's on hold confirmation flow
    public flowId: string;
    public shouldShowCTA: boolean;

    constructor (
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject( AJSMonetateUtilsService ) private MonetateUtilsService: MonetateUtilsService,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private CommonsCookiesService: CommonsCookiesService,
        private IbBookingPmtService: IbBookingPmtService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingPageUtilsService: BookingPageUtilsService,
        private IbBookingPmtFormService: IbBookingPmtFormService,
        private BookingRedirectionService: BookingRedirectionService,
        private IbPaymentOnholdOrderService: IbPaymentOnholdOrderService,
        private IbBookingPmtDigitalDataService: IbBookingPmtDigitalDataService,
        private TranslateService: TranslateService,
        private IbBookingPmtErrorsService: IbBookingPmtErrorsService,
        private ChangeDetectorRef: ChangeDetectorRef,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService,
        private IbCUserUtilsService: IbCUserUtilsService,
        private IbBookingPmtSuccessEventService: IbBookingPmtSuccessEventService,
        private NavigationManagerService: NavigationManagerService
    ) {
        const createOrderData = this.CommonsSessionStorageService.get<any>( BkiStorageConstants.CREATE_ORDER_DATA );
        this.onHoldOrder = this.CommonsSessionStorageService.get<boolean>( BkiStorageConstants.ONHOLD_ORDER ) ?? false;
        this.fareData = this.CommonsSessionStorageService.get<FareDataModel>( BkiStorageConstants.FARE );
        this.onHoldOptions = this.fareData?.offers[0]?.onHoldOptions ?? [];
        this.currentOrder = createOrderData?.order;
        this.flowId = createOrderData?.flowId ?? this.currentOrder.orderId;
        this.currency = createOrderData?.contextMetadata.currencies[0];
        this.voucherDiscount = createOrderData?.order?.voucherDiscount;
    }

    @HostListener('window:resize', ['$event']) onResize = () => this.onResizeAction();

    ngOnDestroy (): void {
        this.unsuscribeUpdatesStm.next();
        this.unsuscribeUpdatesStm.complete();
        this.pmtErrorUpdateStm.complete();
        this.pmtPaymentUpdateStm.complete();
        this.pmtPriceUpdateStm.complete();
    }

    async ngOnInit (): Promise<void> {
        this.clearUnpaidItemsForConfirmation();
        this.loadingDsComponent.props = { ...this.pmtLoadingProps };
        this.onHoldInfoPriceComponent.props.lang = BookingAppConstants.lang;
        //Show header
        this.$rootScope.showHeaders = true;
        this.showAdaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
        this.toggleLoadingOverlay( true );
        this.initFooter();
        this.IbBookingPmtService.setLoadingBasketState( true );
        const { titleInfo } = this.checkAndInitOhInfo();
        this.pageTitle = this.IbBookingPmtService.checkOnHoldForTitle( titleInfo );
        this.shouldShowCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA();
        this.summaryComponent.props = this.getInitialSummary();
        this.IbBookingPmtService.updateStepsStorage();
        this.initPaymentSubjects();
        this.intHeader();
        this.initPaymentForm();
    }
    private initPaymentSubjects = () => {
        this.pmtPaymentUpdateStm.pipe( takeUntil( this.unsuscribeUpdatesStm ) ).subscribe( ( data ) => {this.checkPaymentUpdate(data);} );
        this.pmtPriceUpdateStm.pipe( takeUntil( this.unsuscribeUpdatesStm ) ).subscribe( ( data ) => this.checkPriceUpdate( data ) );
        this.pmtErrorUpdateStm.pipe( takeUntil( this.unsuscribeUpdatesStm ) ).subscribe( ( data ) => { this.onPaymentError(data);} );
    };

    private intHeader = () => {
        this.NewMainHeaderFacade.showLogin();
        this.NewMainHeaderFacade.getObservableHeader().pipe( takeUntil( this.unsuscribeUpdatesStm ) ).subscribe( this.manageObservableHeader );
        this.NewMainHeaderFacade.getAncillariesDeletion().pipe( takeUntil( this.unsuscribeUpdatesStm ) ).subscribe( this.manageDeleteAncillarie );
    };



    private manageObservableHeader = ( data: HeaderDataType | null ): void => {
        this.summaryComponent.props = { ...this.getInitialSummary() };
        this.ChangeDetectorRef.detectChanges();
    };

    private manageDeleteAncillarie = async ( data: boolean ): Promise<void> => {
        if ( !data ) return;
        await this.initPaymentForm();
    };

    private getInitialSummary = (): SummaryProps => {
        if ( this.selectedOnHoldOption !== null ) {
            const onHoldSummary: SummaryProps = this.IbBookingPmtService.getSummaryInfo( { 
                showPassegenerTaxesModal: this.showPassegenerTaxesModal, 
                selectedOnHold: this.selectedOnHoldOption,
                priceModalClick: this.shouldShowCTA ? this.openPriceDetailModal : null
            } );
            return onHoldSummary;
        }

        if(this.shouldShowCTA) {
            const summary: SummaryProps = this.IbBookingPmtService.getSummaryInfo( { showPassegenerTaxesModal: this.showPassegenerTaxesModal, priceModalClick: this.openPriceDetailModal } );
            return summary;
        }

        const summary: SummaryProps = this.IbBookingPmtService.getSummaryInfo( { showPassegenerTaxesModal: this.showPassegenerTaxesModal} );
        return summary;
    };

    private showPassegenerTaxesModal = ( passegener: string ) => {
        const createOrder: any = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        const order: Order | null = createOrder?.order || null;
        if ( order == null ) return;
        const { passengerPrices } = order.orderItems[ 0 ];
        const passInfo: PassengerPrices | undefined = passengerPrices.find( ( pass: PassengerPrices ) => pass.passengerId.includes( passegener ) );
        if ( passInfo == null ) return;
        const { taxes } = passInfo;
        const mapTaxes: Taxes[] = taxes.map( ( tax: Taxes ) => {
            return {
                description: tax.description,
                amount: this.IbBookingPmtService.getPriceFormatted(tax.amount)
            };
        } );
        this.IbBookingPmtService.showTaxesModal( mapTaxes );
    };

    public openPriceDetailModal = (): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal();
    };



    private checkPriceUpdate = ( data: PriceSubscriptionModel ) => {
        if ( this.onHoldOrder && this.onHoldOptions.length > 0 ) {
            this.NewMainHeaderFacade.updateBasketOthers( BkiPmtConstants.PAYMENT_TYPES.ONHOLD, { description: 'PRICE_BREAKDOWN_ON_HOLD', total: -data.total, totalFormatted: this.IbBookingPmtService.getPriceFormatted( -data.total ) } );
        }

        const voucherAppliedValue  = this.voucherDiscount?.amount ?? 0;
        this.totalPrice.total = this.onHoldOrder ? this.currentOrder.price.total : data.total;
        this.totalPrice.totalFormatted = this.IbBookingPmtService.getPriceFormatted( data.total );
        this.hidePaymentComponent = !!voucherAppliedValue && this.totalPrice.total === 0;
        const digital_data = {};
        digital_data[ DigitalDataConstants.TOTAL_PRICE ] = this.totalPrice.total + voucherAppliedValue;
        digital_data[ DigitalDataConstants.TOTAL_PRICE_WITHOUT_TAXES] = this.totalPrice.total + voucherAppliedValue - this.currentOrder.price.tax;
        this.IbBookingPmtDigitalDataService.addDigitalDataInfo( digital_data );
        this.IbBookingPmtService.setSummaryDCCInfo(data.currencyConversion, data.currency.format);
        this.modifyChargesAndDiscounts( data );
        this.closeAllSpinners();
    };

    private checkPaymentUpdate = (data) => {
        const {status} = data;
        this.toggleLoadingOverlay(true, 'PAY');
        if('REDIRECTION' === status) {
            this.IbBookingPmtService.redirectedPaymentTypeAction( this.pmtContext );
        } else if('ERROR'=== status){
            this.toggleLoadingOverlay(false);
        }
        
    };

    private modifyChargesAndDiscounts = ( data: PriceSubscriptionModel ) => {
        this.IbBookingPmtService.setSummaryOthers( data );
        this.NewMainHeaderFacade.forceVisualUpdate();
        this.IbBookingPmtDigitalDataService.manageDigitalDataVoucher( this.voucherDiscount );
        this.DatalayerUtilsService.updateDiscountData( this.currentOrder.discountsApplied?.discounts ?? [] );
    };

    private initFooter = () => {
        this.footerModel = this.BookingPageUtilsService.getFooterModel();
    };

    private checkAfopRedirection = () => {
        const redirectionPmtInfo = this.CommonsSessionStorageService.get<PmtRedirectionInfo>(BkiStorageConstants.PMT_REDIRECTION_CONTEXT);
        const redirectionPmtContext = redirectionPmtInfo?.contextResponse ?? null;
        this.afopPaymentCompleted = redirectionPmtInfo?.paymentCompleted ??  true; // Change value only if its afop and payment is not completed
        return redirectionPmtContext;
    };
    private checkContextCall = async (): Promise<GetContextResponse> | null => {
        this.renderPmtComponent = false;
        if ( this.onHoldOrder && ( this.selectedOnHoldOption.price.total === 0 ) ) {
            this.toggleLoadingOverlay( false );
            this.BookingModalService.finishWaiting();
            const relatedContent: RelatedContentItem[] = this.CommonsSessionStorageService.get<RelatedContentItem[]>( BkiStorageConstants.AVAILABILITY_RELATED_CONTENT ) ?? null;
            const conditions = relatedContent?.find( ( content ) => content.key === 'TOTAL_PRICE' );
            this.onHoldFreeConditions = conditions?.value ?? null;
            return null;
        }
        this.toggleLoadingOverlay( true );
        const redirectionPmtContext = this.checkAfopRedirection();
        this.CommonsSessionStorageService.remove(BkiStorageConstants.PMT_REDIRECTION_CONTEXT);
        const getContextParams: GetContextIdParams = this.selectedOnHoldOption?.onHoldOptionId ? { flowId: this.flowId, onHoldId: this.selectedOnHoldOption.onHoldOptionId } : { flowId: this.flowId };
        const context = redirectionPmtContext ?? await this.IbBookingPmtFormService.getPaymentContext( getContextParams );
        this.renderPmtComponent = true;
        this.checkPaymentWarning(context);

        if (redirectionPmtContext) {
            this.toggleLoadingOverlay( true, 'PAY');
        }
        return context;
    };

    private checkPaymentWarning = (contextResponse: GetContextResponse)=> {
        this.residentWarning = contextResponse.warnings.find( ( warning ) => warning.code === GetContextResponseWarningCodes.PMT_CTX_RESIDENT_NOT_VERIFIED );
        if ( this.residentWarning ) this.CommonsSessionStorageService.set( BkiStorageConstants.CONTEXT_RESIDENT_WARNING, this.residentWarning );
    };

    private initAuthPaymentForm = () => {
        const authPmt : PmtComponentAuth = {
            token: '',
            additionalTokens: []
        };
        const accessIbisToken = this.CommonsSessionStorageService.get<string>( BkiStorageConstants.LOGGED_TOKEN ) ?? this.CommonsSessionStorageService.get<string>( BkiStorageConstants.ANONYMOUS_TOKEN );
        const salesforceToken = this.CommonsCookiesService.get<string>('IBERIACOM_SSO_ACCESS_SALESFORCE');
        const isSoftUser = this.IbCUserUtilsService.isSoftUser();
        const mustAddSalesforceToken = salesforceToken && !isSoftUser;
        authPmt.token = accessIbisToken;
        if ( mustAddSalesforceToken ) {
            authPmt.additionalTokens.push({
                key: 'X-Salesforce-Token',
                value: salesforceToken
            });
        }
        return authPmt;
    };

    private initPaymentForm = async ( ) => {
        try {
            this.pmtContext = await this.checkContextCall();
            if (this.pmtContext === null ) return;
            
            const PaymentWebComponent = await this.IbBookingPmtFormService.getNewPaymentComponent();
            await PaymentWebComponent.init({
                target: `#${this.PAYMENT_COMP_BLOCK_ID}`,
                contextId: this.pmtContext.contextId,
                onPaymentSuccess: this.onPaymentSuccess,
                onError: this.onPaymentFailure,
                auth: this.initAuthPaymentForm()
            });
            PaymentWebComponent.subscribe( PmtWebComponentSubs.PRICE, ( priceUpdate ) => { this.pmtPriceUpdateStm.next( priceUpdate ); } );
            PaymentWebComponent.subscribe( PmtWebComponentSubs.PAYMENT, ( paymentUpdate ) => { this.pmtPaymentUpdateStm.next( paymentUpdate ); } );
            PaymentWebComponent.subscribe( PmtWebComponentSubs.ERROR, ( errorUpdate ) => { this.pmtErrorUpdateStm.next( errorUpdate ); }, PMTManagedErrors );
            this.initAnalytics();

            this.BookingModalService.finishWaiting();
            if(!this.afopPaymentCompleted){
                this.closeAllSpinners();
            }

        } catch ( exception ) {
            this.closeAllSpinners();
            this.onContextError(exception);
        }
    };

    private initAnalytics  = () => {
        const { isOnHold } = this.checkAndInitOhInfo();

        if (isOnHold) {
            this.IbBookingPmtDigitalDataService.setOnHoldDigitalData();
            return;
        }
        this.IbBookingPmtDigitalDataService.setPaymentsDigitalData();
        this.IbBookingPmtDigitalDataService.emitViewEvent();
        this.IbBookingPmtDigitalDataService.addEcommerceEvent();
        this.MonetateUtilsService.updateMonetateInfo();
    };


    private confirmationRedirect = () => {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        this.BookingRedirectionService.path( '/confirmation' );
        this.CommonsSessionStorageService.remove( BkiStorageConstants.PMT_REDIRECTION_CONTEXT );
    };

    private onPaymentFailure = async (event: OnErrorEvent) => {
        const {status} = event;
        this.toggleLoadingOverlay(false);
        switch (status) {
                case OnErrorEventStatus.UNAUTHORIZED : await this.initPaymentForm(); break;
                case OnErrorEventStatus.UNKNOWN: this.redirectToOld(); break;
                case OnErrorEventStatus.DENIED_FRAUD:  this.$rootScope.$broadcast('backToMainRoot', true); break;
                default: this.IbBookingPmtErrorsService.displayGenericError();
        }
    };
    private persistUnpaidItemsForConfirmation = (unpaidItemList: any): void => {
        const unpaidItems = this.normalizeUnpaidItems(unpaidItemList);

        if (!unpaidItems.length) return;

        this.CommonsSessionStorageService.set(BkiStorageConstants.PMT_UNPAID_ITEM_LIST, unpaidItems);
    };

    private normalizeUnpaidItems = (unpaidItemList: any): any[] => {
        if (Array.isArray(unpaidItemList)) {
            return unpaidItemList;
        }

        return unpaidItemList ? [unpaidItemList] : [];
    };

    private clearUnpaidItemsForConfirmation = (): void => {
        this.CommonsSessionStorageService.remove( BkiStorageConstants.PMT_UNPAID_ITEM_LIST);
    };


    private onPaymentSuccess = async ( event: OnPaymentSuccessEvent ) => {
        const { methodType, details, unpaidItemList } = event;
        this.persistUnpaidItemsForConfirmation(unpaidItemList);
        this.NavigationManagerService.disableNavigation (false);
        this.NewMainHeaderFacade.blockNavigation(false);
        const methodsInfo: OnPaymentSuccessEvent = <OnPaymentSuccessEvent> { methodType, details };
        this.checkAndSetIssueInfo();
        this.IbBookingPmtDigitalDataService.setDigitalDataPmtType( methodsInfo );
        this.IbBookingPmtService.deleteUnpaidItemsFromBasket( <OnPaymentSuccessEvent> { unpaidItemList } );
        this.IbBookingPmtDigitalDataService.setConfirmationInfo();
        await this.IbBookingPmtSuccessEventService.processPaymentSuccessStatus( this.pmtContext.contextId, this.flowId );

        this.confirmationRedirect();
    };

    public onFreeOnHoldContinue = async () => {
        this.toggleLoadingOverlay(true, 'PAY');
        const onHoldRequestData: OnHoldFreeParams = <OnHoldFreeParams> {
            orderItemsId: this.currentOrder.orderItems.map(ot=> ot.orderItemId),
            orderId: this.flowId
        };
        if (this.selectedOnHoldOption?.onHoldOptionId) {
            onHoldRequestData.onHoldOptionId = this.selectedOnHoldOption.onHoldOptionId;
        }
        this.IbPaymentOnholdOrderService.freeOnHoldOrder( onHoldRequestData ).then( ( data ) => {
            this.toggleLoadingOverlay( false );
            this.checkAndSetIssueInfo( data.data.selectedOnHoldOption );
            this.confirmationRedirect();
        }, (  ) => {
            this.toggleLoadingOverlay( false );
            this.IbBookingPmtErrorsService.displayGenericError();
        });
    };

    private updateCreateOrderData = (order: Order) => {
        this.currentOrder = order;
        const createOrderData = this.CommonsSessionStorageService.get<any>( BkiStorageConstants.CREATE_ORDER_DATA );
        createOrderData.order = this.currentOrder;
        this.voucherDiscount = createOrderData?.order?.voucherDiscount ?? null;
        this.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, createOrderData );
    };

    public onVoucherValidated = async ( data: VoucherValidatedEvent ) => {
        this.toggleLoadingOverlay( true );
        this.updateCreateOrderData(data.order);
        await this.initPaymentForm();
        return;
    };


    private checkAndInitOhInfo = ( selected?: FareOnHoldOptions ): PmtPageOnHoldInfo => {
        if ( !this.onHoldOrder || !(this.onHoldOptions.length > 0)) return { titleInfo: undefined, isOnHold: false };
        this.selectedOnHoldOption = selected ?? this.onHoldOptions[ 0 ];
        this.onHoldOptions.length > 1 ? this.initSelectOnHoldOptionsMode() : this.initSingleOnHoldOptionMode();
        const isFree = this.selectedOnHoldOption.price.total === 0 ? true : false;
        const titleInfo: PmtPageTitleInfo = {
            isFree,
            hours: this.selectedOnHoldOption.hours
        };
        if (isFree) {
            this.totalPrice.total = 0;
            this.totalPrice.totalFormatted = this.TranslateService.instant('GENERAL_FREE_LABEL');
        }
        this.termsAndConditionsCheck = this.configFreeOHTermsAndBasket( isFree );
        this.IbBookingPmtService.setLoadingBasketState( false );
        window.scrollTo( 0, 0 );
        return {
            titleInfo,
            isOnHold: true
        };
    };



    private configFreeOHTermsAndBasket = ( isFree: boolean ): string => {
        if ( !isFree ) return;
        this.NewMainHeaderFacade.updateBasketOthers( BkiPmtConstants.PAYMENT_TYPES.ONHOLD, { description: 'PRICE_BREAKDOWN_ON_HOLD', total: -this.selectedOnHoldOption.price.total, totalFormatted: this.IbBookingPmtService.getPriceFormatted( -this.selectedOnHoldOption.price.total ) } );
        return this.fareData?.relatedContent.find( ( rel ) => rel.key === 'FREE_ON_HOLD_TERMS_AND_CONDITIONS' )?.value;
    };

    private initSingleOnHoldOptionMode = (): void => {
        const discountProps: OnHoldInfoProps = <OnHoldInfoProps> {
            total: this.selectedOnHoldOption?.price?.total ?? 0
        };
        const onHoldTimeProps = this.IbBookingPmtService.setTimeOnHoldProps( this.selectedOnHoldOption );
        this.onHoldInfoDiscountComponent.props = { ...this.onHoldInfoDiscountComponent.props, ...discountProps, lang: BookingAppConstants.lang };
        this.onHoldInfoTimeComponent.props = { ...this.onHoldInfoTimeComponent.props, ...onHoldTimeProps, lang: BookingAppConstants.lang };
    };

    private initSelectOnHoldOptionsMode = (): void => {
        const options: OnHoldOption[] = this.IbBookingPmtService.getMultipleOnHoldOptions( this.onHoldOptions );
        const props: OnholdOptionsProps = <OnholdOptionsProps> {
            onChange: this.changeSelectedOnHoldOption,
            options,
            value: this.selectedOnHoldOption.onHoldOptionId,
            lang: BookingAppConstants.lang
        };
        this.onHoldOptionsComponent.props = { ...props };
    };

    private changeSelectedOnHoldOption = ( id: string ): void => {
        this.toggleLoadingOverlay( true );
        const selected = this.onHoldOptions.find( ( option ) => option.onHoldOptionId === id );
        this.selectedOnHoldOption = { ...selected };
        const { titleInfo } = this.checkAndInitOhInfo( this.selectedOnHoldOption );
        this.pageTitle = this.IbBookingPmtService.checkOnHoldForTitle( titleInfo );
        this.initPaymentForm();
    };

    private redirectToOld =  (): void => {
        this.returnToOld.emit();
    };

    private onPaymentError = (error: ErrorSubscriptionModel) => {
        this.toggleLoadingOverlay(true);
        const mainErrorItem = error.errorItemList[0];
        const pmtIssueRequest:GetPaymentsIssues = {
            contextId: this.pmtContext.contextId,
            flowId: this.flowId,
            status: error.status,
            error: mainErrorItem.code
        };
        const pmtErrorDescription = mainErrorItem.description ?? null;
        const pccContinue = mainErrorItem.continuePayment;
        const continueCallback =  () => {
            this.toggleLoadingOverlay(false);
        };
        
        const onholdFreeCallback = this.onFreeOnHoldContinue.bind(this);
        this.IbBookingPmtErrorsService.handleCustomPaymentsErrors({pmtIssueRequest, pmtErrorDescription, continueCallback, onholdFreeCallback, pccContinue});
    };

    private onContextError = (errorMessage) => {
        const continueCallback =  this.redirectToOld.bind(this);
        const onholdFreeCallback = this.onFreeOnHoldContinue.bind(this);
        this.IbBookingPmtErrorsService.handleContextError({errorMessage, continueCallback, onholdFreeCallback});
    };

    private setConfirmationQuadrigam = () => {

        const confirmDigitalData = this.CommonsSessionStorageService.get(BkiStorageConstants.CONFIRM_DIGITALDATA_INFO) || {};
        const process = confirmDigitalData?.[DigitalDataConstants.PROCESS];

        this.pmtDDModelInfo.quadrigams.confirmation= this.IbBookingPmtService.getConfirmationPageQuadrigam(this.onHoldOrder, process);
    };

    private checkAndSetIssueInfo = ( onHoldData: FareOnHoldOptions = null ) => {
        const createOrder: any = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        const issueOrder = { data: null };
        if ( onHoldData != null ) {
            this.selectedOnHoldOption = onHoldData;
            this.onHoldOrder = true;
            this.CommonsSessionStorageService.set( BkiStorageConstants.ONHOLD_ORDER, this.onHoldOrder );
        }
        if ( this.onHoldOrder ){ 
            createOrder.selectedOnHoldOption = this.selectedOnHoldOption;
            this.CommonsSessionStorageService.set( BkiStorageConstants.FLOW_APP, 'BBKIOH' );

        }
        this.setConfirmationQuadrigam();
        this.residentWarning && createOrder.warnings.push( this.residentWarning );
        issueOrder.data = this.IbBookingPmtService.checkAndUpdateOrderTotalPrice( createOrder, this.totalPrice );
        this.CommonsSessionStorageService.set( BkiStorageConstants.PMT_MODEL_INFO, this.pmtDDModelInfo );
        this.CommonsSessionStorageService.set( BkiStorageConstants.PAYMENTS_INFO, this.paymentsDDInfo );
        this.IbBookingPmtService.setIssueOrderInfo( issueOrder );
    };


    private toggleLoadingOverlay = ( isOpen: boolean, type?: 'DEFAULT'|'PAY'   ) => {
        let model: LoadingOverlayProps;
        this.NavigationManagerService.disableNavigation (isOpen);
        this.NewMainHeaderFacade.blockNavigation(isOpen);
        switch(type){
                case 'PAY': model = this.pmtLoadingPayProps; break;
                default: model = this.pmtLoadingProps;
        }
        this.loadingDsComponent.props = { ...model, isOpen };
        this.ChangeDetectorRef.detectChanges();
        isOpen && window.scrollTo(0, 0);
    };

    private closeAllSpinners () {
        this.toggleLoadingOverlay( false );
        this.IbBookingPmtService.setLoadingBasketState( false );
    }

    public onResizeAction = () => {
        this.showAdaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
    };
}
