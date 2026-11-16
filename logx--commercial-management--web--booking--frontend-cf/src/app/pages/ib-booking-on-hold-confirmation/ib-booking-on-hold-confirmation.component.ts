import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IbOnHoldConfirmationService } from './services/ib-booking-on-hold-confirmation.service';
import { CancelOnHoldOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-on-hold-cancelation.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiPmtConstants } from '@core/constants/ib-booking-payments-constants';
import { BookingAvailabilityConstants } from '@core/constants/ib-booking-availability-constants';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { AJSCommonsGetLoginInfoService, CommonsGetLoginInfoServiceType } from '@src/app/shared/services/ib-login/ib-booking-get-login-info-bridge.service';
import { AJSIbCPermanentUserService, IbCPermanentUserServiceType } from '@src/app/shared/services/ib-utils/ib-booking-permanent-user-bridge.service';
import { CallAncillariesService } from '@src/app/shared/http-services/ass-fass/ib-call-ancillaries.service';
import { OHImportResponse, OnHoldComponentRequirements, OnHoldModel, RelatedContent } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { BookingCommercialSellingDataService } from '@src/app/shared/http-services/rdu-loc/ib-booking-commercial-selling-data.service';
import { DigitalDataProcess, DigitalDataSteps } from '@src/app/core/constants/ib-digital-data-constants';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbOnHoldConfirmationUtilsService } from './services/ib-booking-on-hold-confirmation-utils.service';
import { IbBookingCalculatePointsService } from '@src/app/shared/http-services/prlm-pc/ib-booking-calculate-points.service';
import { CalculatePointsTransformer } from './services/ib-booking-on-hold-calculate-points-transformer.service';
import { IbBookingAirlinesLogoService } from '@src/app/shared/services/ib-booking-airlines-logo.service';
import { BookingUserActivityService } from '@core/services/ib-booking-user-activity.service';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
@Component({
    selector: 'ib-booking-on-hold-page',
    templateUrl: 'ib-booking-on-hold-confirmation.component.html',
    styleUrls: ['./ib-booking-on-hold-confirmation.component.scss']
})
export class IbBookingOnHoldConfirmationPageComponent implements OnInit {
    showAncillariesButton = false;
    defaultBackgroundImageUrl:string;
    model: OnHoldModel;
    isUserLogged:boolean = false;
    footerModel;
    importOrderData: OHImportResponse;

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject(AJSCommonsGetLoginInfoService) private CommonsGetLoginInfoService: CommonsGetLoginInfoServiceType,
        @Inject(AJSIbCPermanentUserService) private IbCPermanentUserService: IbCPermanentUserServiceType,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        @Inject(WINDOW_TOKEN) private $window: Window,
        private IbOnHoldConfirmationService: IbOnHoldConfirmationService,
        private IbOnHoldConfirmationUtilsService: IbOnHoldConfirmationUtilsService,
        private CancelOnHoldOrderService: CancelOnHoldOrderService,
        private IbBookingCalculatePointsService: IbBookingCalculatePointsService,
        private BookingPageUtilsService: BookingPageUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbCUserUtilsService: IbCUserUtilsService,
        private BookingRedirectionService: BookingRedirectionService,
        private CallAncillariesService: CallAncillariesService,
        private BookingCommercialSellingDataService: BookingCommercialSellingDataService,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private CalculatePointsTransformer: CalculatePointsTransformer,
        private IbBookingAirlinesLogoService: IbBookingAirlinesLogoService,
        private ActivatedRoute: ActivatedRoute,
        private BookingUserActivityService: BookingUserActivityService,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService
    ) {}

    ngOnInit (): void {
        this.initPage();
    }
    private retrieveRouteData = () => {
        const routeData = this.ActivatedRoute.snapshot.data[0] as OnHoldComponentRequirements;
        this.importOrderData = routeData.importOrderData;  
    };

    private initPage = ():void => {
        this.IbBookingPriceDetailModalService.initPriceModalData();
        this.BookingUserActivityService.stopKeepAliveTimer();
        this.retrieveRouteData();
        this.BookingPageUtilsService.setPageTitle('BKI_TITLE_PAGE_CONF_ONHOLD_RECOVERY');
        this.$rootScope.showMainHeader = false;
        this.$rootScope.showHeaders = true;
        this.callInitialServices()
            .then(this.initModel)
            .catch(this.goToErrorPage);
    };
    private callInitialServices = async () =>{
        try{
            await this.CommonsGetLoginInfoService.checkCustomerStatus(true);
            await Promise.all([
                this.BookingCommercialSellingDataService.getCommercialInfo(),
                this.callSecondaryServices()
            ]);
            this.initDigitalData();
            this.CommonsSessionStorageService.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.ONHOLD_CONF);
        } catch(error){
            this.goToErrorPage(error);
        }
    };

    private goToErrorPage = (error) =>{
        this.CommonsSessionStorageService.set('availabilityErrror', error);
        this.BookingRedirectionService.path('/ibbkerror');
        this.BookingModalService.finishWaiting();
    };

    private callSecondaryServices = () => {
        const requestAviosInfo = this.CalculatePointsTransformer.genCalAviosSummary(this.importOrderData, null, null, true);

        const calculatePointsPromise = this.IbBookingCalculatePointsService.getCalculateFlightsAvios(requestAviosInfo)
            .then(pointsWithoutFormatting => {
                const points = this.CalculatePointsTransformer.transCalcPointsData(pointsWithoutFormatting);
                this.CommonsSessionStorageService.set(BkiStorageConstants.CALCULATED_POINTS, points);
                return points;
            });

        const airlinesPromise = this.IbBookingAirlinesLogoService.getAirlinesLogos();

        return Promise.allSettled([
            calculatePointsPromise,
            airlinesPromise
        ]);
    };

    private initModel = () =>{
        this.IbOnHoldConfirmationService.getBookingInfo().then(this.getBookingInfoSuccess, this.getBookingInfoSuccess);
    };

    private getBookingInfoSuccess = (bookingInfo: OnHoldModel):void => {
        this.model = bookingInfo;
        this.defaultBackgroundImageUrl = this.model.generalInfo?.destination && this.BookingPageUtilsService.getOHBackgroundURL(this.model.generalInfo.destination.city.code);
        this.CommonsSessionStorageService.set('actualStepFlow', BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF.toLowerCase());
        this.initDigitalData(this.model);

        if (this.IbCPermanentUserService.isAfterLoginPermanentUser()) {
            this.BookingModalService.finishWaiting();
            this.confirmOnHoldOrder();
        } else {
            this.CallAncillariesService.getAllianzFussionInsurance(this.importOrderData.contextMetadata.country).then((data:any)=>this.setAncillariesInfo(data), 
                ()=>{});
            this.initHeader(bookingInfo);
            this.initFooter();
            this.BookingModalService.finishWaiting();
        }
    };

    private initHeader = (bookingInfo:OnHoldModel):void => {
        this.$rootScope.$emit('initializeHeader');
        this.NewMainHeaderFacade.initHeader(
            {
                originDestination: this.IbOnHoldConfirmationService.getOriginDestination(bookingInfo),
                redemption: '',
                flightType: bookingInfo.generalInfo.flightType,
                currency: this.CurrencyService.getCurrencyObject(this.importOrderData.contextMetadata.currencies[0]),
                showBasket: true,
                showModalBackHome: true,
                isMultiflight: true,
                isOnHold: true,
                showAdvancedSearch: false,
                hideFlightSearch: false
            },
            { hasSteps: true, steps: 'ON_HOLD_RECOVERY_STEPS', position: 0 },
            {
                onLogin: () => {
                    this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true, null);
                }, onError: () => {
                    this.BookingModalService.finishWaiting();
                }, afterLogin: this.afterLogin,
                userLogged: this.CommonsSessionStorageService.get('userLogged'),
                loggedData: this.CommonsSessionStorageService.get('customerData') || this.CommonsSessionStorageService.get('membershipData') || undefined
            }
        );
        this.NewMainHeaderFacade.showLogin();
        this.NewMainHeaderFacade.deleteTripsBasketFromDispo();
        this.NewMainHeaderFacade.updateTripsFromOrder(this.importOrderData);
        if(bookingInfo.generalInfo.paidDeposit){
            this.NewMainHeaderFacade.updateBasketOthers(BkiPmtConstants.PAYMENT_TYPES.ONHOLD, {total: -this.model.generalInfo.paidDeposit.price});
        }
        if ( this.model.generalInfo.voucherDiscount ) {
            const voucherDiscount = {originalDiscount: this.model.generalInfo.voucherDiscount.amount, description: this.model.generalInfo.voucherDiscount.description};
            this.NewMainHeaderFacade.updateDiscounts(this.model.generalInfo.voucherDiscount.type, voucherDiscount);
        }
    };

    private afterLogin = () => {
        this.isUserLogged = this.CommonsSessionStorageService.get('userLogged');
        this.initPage();
    };

    private initFooter = ():void => {
        this.footerModel = this.BookingPageUtilsService.getFooterModel();
    };


    private initDigitalData = (model?:OnHoldModel) =>{
        if(model){
            //Complete digital_data with on hold conf model
            this.IbOnHoldConfirmationUtilsService.generateOnHoldConfirmationDigitalData(model);
            this.DigitalDataUtilsService.emitViewEvent();
            !this.model.generalInfo.notConfirmable && this.IbOnHoldConfirmationUtilsService.createAddToCartforPurchaseEvent(this.model.generalInfo);
            this.$rootScope.$broadcast('updatePageType');
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        } else{
            //Init process,step and quadrigam in digital_data
            this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF, {});
            this.DigitalDataUtilsService.setProcessAndStep(DigitalDataProcess.ONHOLD_CONFIRMATION, DigitalDataSteps.ONHOLD_CONF_RECOVERY, BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF);
        }
    };

    private setAncillariesInfo = (data:any) =>{
        let relatedContent:RelatedContent[];
        this.CommonsSessionStorageService.set('ancillariesInfo', data);
        const isAncillariesAvailable = data?.ancillaries[0]?.status?.code === 'AVAILABLE';
        const isSameMarket = BookingAppConstants.market === this.importOrderData.contextMetadata.country;
        this.showAncillariesButton = isAncillariesAvailable && isSameMarket;
        relatedContent = this.importOrderData.relatedContent.map(item =>
            item.key === BookingAvailabilityConstants.RELATED_CONTENT.CONFIRM_ONHOLD_CONDITIONS ?
                { ...item, key: BookingAvailabilityConstants.RELATED_CONTENT.TOTAL_PRICE }
                : item
        );
        this.CommonsSessionStorageService.set(BkiStorageConstants.AVAILABILITY_RELATED_CONTENT, relatedContent);
    };

    confirmOnHoldOrder = (route:string = '/ibpurc' ):void =>{
        this.IbCPermanentUserService.checkPermanentUserFlow()
            .then(() => {
                const warnings = this.model?.warnings;
                const onHoldLoggedWarning = warnings?.find(warning => warning.code === BookingAppConstants.WARNING_MESSAGES.ONHOLD_PARTNER_MUST_LOGGED);
                if (!this.IbCUserUtilsService.isUserLogged() && onHoldLoggedWarning != null) {
                    this.BookingModalService.showGenericModal(true, 'generic-complete-modal.html', {
                        title: 'OH_LOGIN_ADVICE_MODAL_SUBTITLE',
                        body: onHoldLoggedWarning.description,
                        accept: 'LOGIN_FORM_BUTTON_TEXT',
                        cancel: 'PAYMENTS_DISCOUNTS_VOUCHER_DELETE_BUTTON_TEXT',
                        idModal: BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF_LOGIN + `_${BookingAppConstants.WARNING_MESSAGES.ONHOLD_PARTNER_MUST_LOGGED}`,
                        showCloseButton: false
                    }, null).result.then(() => {
                        this.CommonsSessionStorageService.set('recoverUserFlow', `${ this.$window.location.pathname }${ this.$window.location.search }#!/${ BookingAppConstants.QUADRIGAMS.PAYMENTS.toLowerCase()}`);
                        this.BookingRedirectionService.redirectToLoginPage(`${this.$window.location.pathname}${this.$window.location.search}#!/loading`);
                    }, () => {
                        this.NewMainHeaderFacade.updateDiscounts(BookingAppConstants.DISCOUNT_TYPES.PARTNER, null);
                        this.BookingRedirectionService.path(route);
                    });
                } else {
                    this.BookingRedirectionService.path(route);
                }
            })
            .catch(() => { });
    };

    cancelOnHoldOrder = ():void =>{
        this.BookingModalService.showGenericModal(true, 'generic-complete-modal.html', { title: 'ON_HOLD_CONF_CANCEL_ORDER_MODAL_TITLE', body: 'ON_HOLD_CONF_CANCEL_ORDER_MODAL_BODY', accept: 'ON_HOLD_CONF_CANCEL_ORDER_MODAL_ACCEPT', cancel: 'ON_HOLD_CONF_CANCEL_ORDER_MODAL_CANCEL', idModal: BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF_CANCEL_ORDER_MODAL }, null).result.then(() => {
            let eventTarget = event?.target as HTMLTextAreaElement;
            if (eventTarget.attributes['data-ng-click']?.value.indexOf('close') < 0) {
                this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                this.CancelOnHoldOrderService.cancelOnHoldOrder().then(this.cancelOrderSuccess, this.showModalError);
            }
        }, () =>{});
    };

    cancelOrderSuccess = ():void => {
        this.IbBookingPassengerInfoUtilsService.deleteTemporalPNR();
        this.BookingRedirectionService.path('/cnclit');
        this.BookingModalService.finishWaiting();
    };

    showModalError = (error):void => {
        this.BookingModalService.finishWaiting();
        this.BookingModalService.showGenericError(error, false, null).result.then(() =>{}, () =>{});
    };

    redirectToAncillaries = ():void =>{
        this.confirmOnHoldOrder('/ibcmtv');
    };

}
