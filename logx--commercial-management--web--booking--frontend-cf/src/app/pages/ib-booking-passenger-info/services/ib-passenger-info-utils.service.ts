import { Inject, Injectable } from '@angular/core';
import { downgradeToAJSService, AJSRootScope, CommonsSessionStorageService, AJSCurrencyService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { AncillariesToRemoveOnNewOrder, BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { TranslateService } from '@ngx-translate/core';
import { DatalayerBKIConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { AJSBookingPassengerInfoTransformer, BookingPassengerInfoTransformerType } from '../transformers/ib-booking-passenger-info-transfomer-bridge.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { MonetateConstants } from '@src/app/shared/services/ib-monetate/ib-monetate-constants';
import { AJSBookingPassengerInfoService, BookingPassengerInfoServiceType } from './ib-booking-passenger-info-service-bridge.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbSoftLoginModalComponent } from '@src/app/shared/components/ib-soft-login-modal/ib-soft-login-modal.component';
import { SuggestLoginMapType, SuggestLoginType } from '../ib-booking-passenger-info-controller';
import { HeaderDataType } from '@src/app/core/models/ib-booking-availability/header-model';
import { RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
@Injectable({ providedIn: 'root' })
export class PassengeInfoUtilsService {
    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        @Inject( AJSBookingPassengerInfoTransformer ) private BookingPassengerInfoTransformer: BookingPassengerInfoTransformerType,
        @Inject( AJSDatalayerUtilsService ) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        @Inject( AJSBookingModalService ) private BookingModalService: BookingModalServiceType,
        @Inject( AJSMonetateUtilsService ) private MonetateUtilsService: MonetateUtilsService,
        @Inject( AJSDatalayerBKIService ) private DatalayerBKIService: AJSDatalayerBKIServiceType,
        @Inject( AJSBookingUtilsService ) private BookingUtilService,
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        @Inject( AJSBookingPassengerInfoService ) private BookingPassengerInfoService: BookingPassengerInfoServiceType,
        private TranslateService: TranslateService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingRedirectionService: BookingRedirectionService, 
        private IbCModalService: IbCModalService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private DigitalDataUtilsService: DigitalDataUtilsService
        
    ) { }
    
    public checkRedemptionsAndShuttleFLows = () => {
        if (!this.rootScope.isShuttleFlow) {
            this.rootScope.isShuttleFlow = this.CommonsSessionStorageService.get( BkiStorageConstants.SHUTTLE_FLOW );
        }
        if (!this.rootScope.isRedemptionFlow) {
            this.rootScope.isRedemptionFlow = this.CommonsSessionStorageService.get('isRedemptionFlow');
        }
        if (!this.rootScope.isPointsOBFlow) {
            this.rootScope.isPointsOBFlow = this.CommonsSessionStorageService.get('isPointsOBFlow');
        }
    };
    
    public checkSelectedFlex = (): string => {
        if ( !this.CommonsSessionStorageService.get( 'selectedFlex' ) ) return '';
        const flexAvailable: any = this.CommonsSessionStorageService.get( 'selectedFlex' );
        const subtypeAncOffer = flexAvailable.description;
        const ancOffersTotal = this.TranslateService.instant( 'AVAILABILITY_SUMMARY_TOTAL_PRICE', { option: subtypeAncOffer } );
        this.rootScope.$broadcast( 'isFareSelectedAncOffers', true );
        this.NewMainHeaderFacade.updateBasketFlexibilization('');
        this.NewMainHeaderFacade.updateBasketFlexibilization(flexAvailable);
        this.rootScope.$broadcast( 'changeOffersTotal', ancOffersTotal );
        this.rootScope.$broadcast( 'updatePrice', this.CommonsSessionStorageService.get<any>( BkiStorageConstants.HEADER_MODEL ).headerModel.shoppingBasket.total.formatted );
        return ancOffersTotal;
    };
    
    public checkGoToPayment = ( isBackNavigationActive, orderCreated, skipToPayments, forbiddenNextStep ) => {
        return !isBackNavigationActive && orderCreated && skipToPayments && !forbiddenNextStep;
    };
    
    public generateMetasearchUrl = () => {
        const fligthType = this.CommonsSessionStorageService.get( BkiStorageConstants.SEARCH_FLIGHT_TYPE );
        if ( !( fligthType === BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY || fligthType === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH ) ) return;
        const metaURL = this.BookingPassengerInfoTransformer.generateMetaUrl();
        if ( !metaURL ) return;
        const { recoveryLink } = metaURL;
        this.DatalayerUtilsService.addDigitalDataInfo( { [ DatalayerBKIConstants.RECOVERY_LINK ]: recoveryLink } );
        return metaURL;
    };
    
    public checkLoginOnb = () => this.CommonsSessionStorageService.get( BkiStorageConstants.USER_LOGGED ) === BookingAppConstants.LOGIN_ONB;
    
    public checkNewOfferConditions = ( flow ) => {
        const checkRedemptions = () => !this.rootScope.isPointsOBFlow || this.rootScope.isRedemptionFlow;
        const checkFlowApp = ( flow: string ): boolean => flow === 'BBKI' || flow === 'BBKIOH';
        const checkFlightType = () => {
            const flightType = this.CommonsSessionStorageService.get( BkiStorageConstants.SEARCH_FLIGHT_TYPE );
            switch ( flightType ) {
                    case BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY: return true;
                    case BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION: return true;
                    case BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH: return true;
                    default: return false;
            }
        };
        return checkRedemptions() && checkFlowApp( flow ) && checkFlightType();
    };
    
    public callNotAllowedModal = () => {
        const backOnHold = this.CommonsSessionStorageService.get('backOnHold');
        this.BookingModalService.showGenericModal(true, 'flow-step-modal.html', { idModal: 'ib-modal-not-allowed-flow', title: 'GENERAL_ADVICE_TITLE', body: 'NOT_ALLOWED_FLOW_STEP_TEXT', accept: 'MODAL_GENERAL_BUTTON_CANCEL', cancel: 'MODAL_GENERAL_BUTTON_ACCEPT' }).result.then(() => {
            this.BookingModalService.finishWaiting();
            this.CommonsSessionStorageService.set('isOnHoldOrder', false);
            if (this.rootScope.isShuttleFlow) {
                this.BookingRedirectionService.path('/ibshuttle');
            } else {
                this.BookingRedirectionService.path('/availability');
            }
        }, () => {
            const createOrderData = this.CommonsSessionStorageService.get<OrderData>( BkiStorageConstants.CREATE_ORDER_DATA );
            this.BookingModalService.finishWaiting();
            this.NewMainHeaderFacade.updateTripsFromOrder( createOrderData );
            if ( !!backOnHold ) {
                this.BookingRedirectionService.path( '/ibairp' );
            } else {
                this.BookingRedirectionService.path( ( '/' + this.CommonsSessionStorageService.get( BkiStorageConstants.PREVIOUS_STEP_FLOW ) ) );
            }
        });
    };
    
    public transformPassengersToSave = ( info ) => {
        return this.BookingPassengerInfoTransformer.transformPassengerInfoToSaveInLocalStorage( info );
    };
    
    public checkPartnerDiscountFromFare = ( discount ): boolean => discount.type === BookingAppConstants.DISCOUNT_TYPES.PARTNER || this.isDiscountTypePartnerEquivalent( discount.type );
    
    public isDiscountTypePartnerEquivalent = ( discountType ): boolean => {
        return discountType === BookingHeaderConstants.DISCOUNT_TYPES.DUMBO || discountType === BookingHeaderConstants.DISCOUNT_TYPES.PLUTO;
    };
    
    public loadPassengerDigitalDataAndMonetate = ( data, fareDataAux ) => {
        this.DatalayerUtilsService.updateDiscountData( fareDataAux?.offers?.[ 0 ]?.specialDiscountsApplied ?? [] );
        this.DatalayerBKIService.getDigitalDataEcommerce( this.CommonsSessionStorageService.get( 'selectedTripInfo' ), 'begin_checkout' );
        this.DatalayerBKIService.getDigitalDataEcommerce( this.CommonsSessionStorageService.get( 'selectedTripInfo' ), 'add_shipping_info' );
        const quadrigam = this.selectQuadrigam();
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam( quadrigam, data.securityInfoData.digitalDataObject);
        this.MonetateUtilsService.updateMonetateWithQuadrigam( MonetateConstants.MONETATE_INFO.SETPAGETYPE, quadrigam, null );
        this.DatalayerUtilsService.updateDatalayerViewEvent();
        this.MonetateUtilsService.updateMonetateInfo();
    };
        
    public selectQuadrigam =  () => {
        let quadrigams = {
            PAOB: () => BookingAppConstants.QUADRIGAMS.PA_PASSENGERS,
            PAOBONB: () => BookingAppConstants.QUADRIGAMS.PA_PASSENGERS_ONB,
            PARE: () => BookingAppConstants.QUADRIGAMS.PA_PASSENGERS_REDENTION,
            PAREONB: () => BookingAppConstants.QUADRIGAMS.PA_PASSENGERS_ONB_REDENTION,
            default: () => {
                const isMulticity = !!(this.CommonsSessionStorageService.get('multiCitySearch'));
                const isHMAD = !!(this.CommonsSessionStorageService.get('isHMAD'));
                if (isMulticity && isHMAD) {

                    return BookingAppConstants.QUADRIGAMS.HMAD_PASSENGERS_INFO;
                }else if (isMulticity) {
                    return BookingAppConstants.QUADRIGAMS.MULTI_PASSENGERS_INFO;

                } else if (this.rootScope.isRedemptionFlow) {
                    if (this.rootScope.isPointsOBFlow) {
                        return BookingAppConstants.QUADRIGAMS.ONB_REDEMPTION_PASSENGERS;
                    } else {
                        return BookingAppConstants.QUADRIGAMS.REDEMPTION_PASSENGERS;
                    }
                } else {
                    return BookingAppConstants.QUADRIGAMS.PASSENGERS_INFO;
                }
            }
        };
        let flowApp = this.CommonsSessionStorageService.get<string>('flowApp') ?? 'default';
        let quadrigam = quadrigams[flowApp] || quadrigams.default; // Si no hay una función para el valor de flowApp, usar la función por defecto
        return quadrigam();
    };
    
    public getPassengerInfoError = async ( error ) => {
        const onClose = () => {
            this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            const isShuttleFlow = this.CommonsSessionStorageService.get(BkiStorageConstants.SHUTTLE_FLOW);
            this.BookingRedirectionService.path( isShuttleFlow ? RouterPathsConstants.ibshuttle : RouterPathsConstants.availability );
        };

        this.BookingModalService.finishWaiting();
        try{
            await this.BookingModalService.showGenericError( error, true ).result;
        } finally {
            onClose();
        }
    };
    
    public checkNewOffer = ( flow, fareData ) => {
        if ( !this.checkNewOfferConditions( flow ) ) return;
        const selectedSlicesMntt = this.CommonsSessionStorageService.get( 'selectedTripSegments' ) ?? this.CommonsSessionStorageService.get<any>( BkiStorageConstants.SELECTED_OFFER ).slices?.map( el => [ ...el.segments ] );
        const selectedOfferData = this.CommonsSessionStorageService.get( BkiStorageConstants.SELECTED_OFFER ) ? this.CommonsSessionStorageService.get( BkiStorageConstants.SELECTED_OFFER ) : fareData.offers[ 0 ];
        this.CommonsSessionStorageService.set( BkiStorageConstants.SELECTED_OFFER, selectedOfferData );
        this.MonetateUtilsService.addFlightReviewMonetate( this.CommonsSessionStorageService.get( BkiStorageConstants.BOOKING_URL_PARAMS ), this.CommonsSessionStorageService.get( BkiStorageConstants.ORIGIN_DESTINATIONS ), selectedSlicesMntt, selectedOfferData, this.CommonsSessionStorageService.get( BkiStorageConstants.FF_CONDITIONS_INFO ) );
    };
    
    public checkAndSetFareCurrency = ( fareData ) => {
        if ( !( fareData?.contextMetadata?.currencies?.length > 0 ) ) return;
        return this.CurrencyService.getCurrencyObject( fareData.contextMetadata.currencies[ 0 ] );
    };
    
    public setBasketOthers = ( fareDataAux, fareData ) => {
        if ( !fareDataAux?.offers?.[ 0 ]?.price?.ticketingFee ) return;
        const currencies = this.checkAndSetFareCurrency( fareData );
        this.NewMainHeaderFacade.updateBasketOthers( 'SUMMARY_OTHER_FEES_ADMINISTRATION', {
            code: 'ticketingFee',
            description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
            parsedFee: this.CurrencyService.formatPrice( currencies, fareDataAux.offers[ 0 ].price.ticketingFee, true ),
            totalFee: fareDataAux.offers[ 0 ].price.ticketingFee
        } );
    };
    
    public checkShuttleOnPassengerInfo = ( model ) => {
        if ( !this.rootScope.isShuttleFlow ) return model;
        model.dynamicPricingSeat = this.BookingPassengerInfoService.getDPCookieParameter() ? 1 : 0;
        this.DatalayerUtilsService.addShuttleDigitalData( this.CommonsSessionStorageService.get( BkiStorageConstants.ACTUAL_STEP_FLOW ), model );
        return model;
    };
    
    public checkLoadPassengerHolaMadrid = ( onHoldButton: boolean ): boolean => {
        if ( !this.CommonsSessionStorageService.get( 'isHMAD' ) ) return onHoldButton;
        return BookingAppConstants.LATAM_MARKETS_HMAD.CODES.indexOf( this.rootScope.appMarket ) === -1;
    };
    
    private showSoftLoginModal = () =>{
        const modalOptions = {
            modalBlocked: true,
            windowClass: 'ib-modals bki-dialog'
        };
        const modalRef = this.IbCModalService.showGenericComponentModal( IbSoftLoginModalComponent, modalOptions);
        modalRef.result.then(()=>{}, ()=>{});
        return modalRef;
    };

    public getShowSuggestionMap = ( flag: SuggestLoginType ): SuggestLoginMapType => {
        return {
            showMobile: this.rootScope?.isMobile?.general && flag.mobile,
            showDesktop: !this.rootScope?.isMobile?.general && flag.desktop
        };
    };

    public showIfApplicable = ( showSuggestionMap: SuggestLoginMapType, callback: () => void ) => {
        showSuggestionMap[ 'showMobile' ] && callback();
        showSuggestionMap[ 'showDesktop' ] && callback();
    };

    public checkToShowSoftLoginModal = () => {
        const flag: SuggestLoginType = this.CommonsSessionStorageService.get('softLoginModal');
        if ( !flag || !this.CommonsUserUtilsService.isSoftUser() ) return;
        const showSoftMap = this.getShowSuggestionMap(flag);
        this.showIfApplicable(showSoftMap, this.showSoftLoginModal);
    };
    
    public saveNewsletterSubscription = ( userWantsRegister, model, isUserLogged ) => {
        const { denyNewsLetters } = model.passengersFormData.securityInfo.contactData;
        if ( this.checkNewsletterConditions( isUserLogged, denyNewsLetters, userWantsRegister ) ) {
            const { contactEmail } = model.passengersFormData.securityInfo.contactData;
            const { name, surname } = model.passengersFormData.securityInfo.passengerInfo[0].data;
            const newsletterPersonalDataToSave = {
                email: contactEmail,
                name: name,
                firstSurname: surname
            };
            this.CommonsSessionStorageService.set('newsletterPersonalDataToSave', newsletterPersonalDataToSave);
        } else {
            this.CommonsSessionStorageService.remove('newsletterPersonalDataToSave');
        }
    };
    
    private checkNewsletterConditions = (isUserLogged, denyNewsLetters, userWantsRegister) => {
        const isZero = this.CommonsUserUtilsService.isIbZero();
        const isSoft = this.CommonsUserUtilsService.isSoftUser();

        const shouldSendNewsletter = isZero || isSoft || !isUserLogged;
        return shouldSendNewsletter && !denyNewsLetters && !userWantsRegister;
    };
    
    public restoreHeaderModel = () => {
        const restoreHeader = this.CommonsSessionStorageService.get<HeaderDataType>( BkiStorageConstants.HEADER_MODEL_BACKUP );
        if ( !restoreHeader ) return;
        this.clearAncillariesSessionStorage();
        this.NewMainHeaderFacade.updateHeaderModel( restoreHeader );
        this.CommonsSessionStorageService.remove( BkiStorageConstants.HEADER_MODEL_BACKUP );
    };
    
    public clearAncillariesSessionStorage = () => {
        AncillariesToRemoveOnNewOrder.forEach( key => this.CommonsSessionStorageService.remove( key ) );
    };
    
    public setShowbasketByFlowType = () => {
        const headerStorage = this.CommonsSessionStorageService.get<HeaderDataType>(BkiStorageConstants.HEADER_MODEL);
        
        if (!this.checkFlightByType()) return;
        headerStorage.headerModel.showBasket = true;
        this.NewMainHeaderFacade.updateHeaderModel(headerStorage);
        
    };
    
    private checkFlightByType (): boolean {
        const flightType = this.CommonsSessionStorageService.get(BkiStorageConstants.SEARCH_FLIGHT_TYPE);
        switch ( flightType ) {
                case BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH:
                case BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP:
                    return true;
                default:
                    return false;
        }
    }
    
}
downgradeToAJSService('PassengeInfoUtilsService', PassengeInfoUtilsService, 'ib-booking-passenger-info-module', []);
