import { ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { AJSRootScope, IbCUserUtilsService, downgradeToAJSComponent, CommonsSessionStorageService, AJSCurrencyService } from 'ib-web-commons/utils';
import { HeaderDataGreyBar, HeaderDataHeaderModel, HeaderDataStepsModel, HeaderDataType, HeaderTypeModel, ShoppingBasketDiscountObjectType } from '@src/app/core/models/ib-booking-availability/header-model';
import { BookingHeaderConstants } from './ib-booking-header-constants';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { IbBasketTransformerService } from './components/ib-booking-header-basket/services/ib-booking-header-basket-transformer.service';
import { IbBookingHeaderService } from './services/ib-booking-header.service';
import { cloneDeep } from 'lodash-es';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { ShoppingBasketViewModelService } from './components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { IbBookingFlowUtilsService } from '../../services/ib-utils/ib-booking-flow-utils.service';
import { BehaviorSubject } from 'rxjs';
import { Discount, OrderData, OriginalPriceClass } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { IbBookingHeaderFacadeService } from './services/ib-booking-header-facade.service';
import { OHImportResponse } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';


@Component({
    selector: './ib-booking-header-component',
    templateUrl: './ib-booking-header.component.html',
    styleUrls: [
        './ib-booking-header.component.scss'
    ],
    providers: []
})


export class IbBookingHeaderComponent implements OnInit {
    public showAdvancedSearch: boolean = false;
    public openCalendar: string = null;
    public model = <HeaderDataType> {};
    public isSoftUser: boolean = false;
    public numberTrips: number = 1;
    public profileIcon: boolean = false;
    public activeSeeker: boolean = false;
    public closeSession: boolean = false;
    public showHeaderMobile: boolean = null;
    public isHMad: boolean;
    public navigationBlocked: boolean = false;

    public observableHeader: BehaviorSubject<HeaderDataType> = new BehaviorSubject<HeaderDataType | null>(null);
    public ancillariesDeletion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loadingBasket: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        @Inject( WINDOW_TOKEN ) private window: Window,
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private IbBasketTransformerService: IbBasketTransformerService,
        private IbBookingHeaderService: IbBookingHeaderService,
        @Inject( AJSBookingModalService ) private BookingModalService: BookingModalServiceType,
        private ShoppingBasketViewModelService: ShoppingBasketViewModelService,
        private IbBookingFlowUtilsService: IbBookingFlowUtilsService,
        private ChangeDetectorRef: ChangeDetectorRef

    ) {
        this.rootScope.$on('openAdvancedSearchAndOpenCalendar', this.toggleAdvancedSearch);
    }
    ngOnInit () {
        this.showAdvancedSearch = false;
        this.model = this.getHeaderModel() || <HeaderDataType> {};
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.NewMainHeaderFacade.setAPIFunctions( {
            initHeader: this.initializeHeader,
            updateSteps:this.updateStepsModel,
            updateTrips: this.updateTripsBasket,
            deleteDiscountFromBasket: this.deleteDiscountBasket,
            updateHeaderModel: this.updateHeaderModel,
            updateStepsModel: this.updateStepsModel,
            setLogin: this.setLogin,
            updateBasketDiscounts: this.updateDiscounts,
            updateDiscounts: this.updateDiscounts,
            updateBasketOthers: this.updateBasketOthers,
            updateTripsFromOrder: this.updateTripsFromOrder,
            showLogin: this.showLogin,
            updateBasketFlexibilization: this.updateBasketFlexibilization,
            initHeaderModel: this.initHeaderModel,
            updateBasketUpgrading: this.updateBasketUpgrading,
            updatePendingPaymentItems: this.updatePendingPaymentItems,
            updateTripsBasketFromDispo: this.updateTripsBasketFromDispo,
            deleteTripsBasketFromDispo: this.deleteTripsBasketFromDispo,
            updateBasketPriority: this.updateBasketPriority,
            deleteDiscountBasket: this.deleteDiscountBasket,
            updateHeaderModelOnHold: this.updateHeaderModelOnHold,
            updateShowBasket: this.updateShowBasket,
            updateStepDescription: this.updateStepDescription,
            checkAdaptativeMobileFlow: this.checkAdaptativeMobileFlow,
            addSimpleDiscount: this.addSimpleDiscount,
            getObservableHeader: this.getObservableHeader,
            setAncillariesDeletion: this.setAncillariesDeletion,
            getAncillariesDeletion: this.getAncillariesDeletion,
            deleteInsuranceFromBasket: this.deleteInsuranceFromBasket,
            deleteAssistCardFromBasket: this.deleteAssistCardFromBasket,
            deleteGlobickTransfersFromBasket: this.deleteGlobickTransfersFromBasket,
            setLoadingBasket: this.setLoadingBasket,
            getLoadingBasket: this.getLoadingBasket,
            setTotalDCC: this.setTotalDCC,
            forceVisualUpdate: this.forceVisualUpdate,
            setHeaderType: this.setHeaderType,
            blockNavigation: this.blockNavigation,
            updateBasketDiscountsNew: this.updateDiscountsNew,
            addDiscountToBasket:this.addDiscountBasket,
            updateHeader: this.updateHeaderModel
            
        } );
        this.calculateModelTripsHeader();
    }


    /**
     * Initialize all the models
     * @param {*} headerModel
     * @param {*} config
     * @param {*} position
     */
    public initializeHeader = ( headerModel: HeaderDataHeaderModel, stepsModel: HeaderDataStepsModel, greyBarModel:HeaderDataGreyBar ) => {
        this.isHMad = this.checkIsHMad();
        const headerModelTemp: any = this.CommonsSessionStorageService.get( 'headerModel' );
        const datesHasChanged = this.checkIfDateHasChanged( headerModel );
        let loggedData: any = this.CommonsSessionStorageService.get( 'customerData' );
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        const isHeaderModel = !headerModelTemp || headerModelTemp?.headerModel?.flightType === 'metasearchFlight'; 

        if ( isHeaderModel || datesHasChanged) {
            this.model = cloneDeep( this.IbBookingHeaderService.initHeader( headerModel, stepsModel, greyBarModel ) );
        }
        if ( this.isSoftUser && loggedData ) {
            loggedData = this.IbBookingHeaderService.updateLoggedData( loggedData );
            this.model.greyBarModel.loggedData = loggedData;
            this.model.greyBarModel.isLogged = loggedData.isLogged;
        }
        this.setShowLogin();
        this.saveHeaderModel();
        this.checkAdaptativeMobileFlow();
        return this.model;
    };
    public checkIfDateHasChanged = ( headerModel ) => {
        let datesHasChanged = false;
        if( headerModel?.originDestination?.dates?.outboundFlight ) {
            if ( headerModel.originDestination.dates.outboundFlight !== headerModel.originDestination.dates.formatedOutboundFlight.slice( 0, 10 ) ) {
                datesHasChanged = true;
            }
        }
        if( headerModel?.originDestination?.dates?.returnFlight ) {
            if ( headerModel.originDestination.dates.returnFlight !== headerModel.originDestination.dates.formatedReturnFlight.slice( 0, 10 ) ) {
                datesHasChanged = true;
            }
        }
        return datesHasChanged;
    };

    /**
     * Initialize headerModel
     * @param {*} headerModel
     */
    public initHeaderModel = ( headerModel ) => {
        const headerModelTemp: HeaderDataType = this.CommonsSessionStorageService.get( 'headerModel' );
        if ( !headerModelTemp.headerModel.shoppingBasket ) {
            this.model.headerModel = cloneDeep( this.IbBookingHeaderService.initHeaderModel( headerModel ) );
            this.saveHeaderModel();
        }else{
            this.model.headerModel.shoppingBasket.showBasket = headerModel.showBasket;
            this.saveHeaderModel();
        }
        this.checkAdaptativeMobileFlow();
        return this.model;
    };

    public updateHeaderModel = ( model ) => {
        this.model = model;
        this.saveHeaderModel();
    };

    public updateHeaderModelOnHold = ( model :HeaderDataHeaderModel) => {
        const headerTemp = cloneDeep( this.IbBookingHeaderService.initHeaderModel( model ) );
        return headerTemp;
    };

    public updateStepsModel = ( page, description?: string, stepsArray?: any ) => {
        const descriptionsMap = {
            'availability': BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OW,
            'flightsRecap': BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OW,
            'ibairp': BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.PASSENGERS,
            'ibcmtv': BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.ANCILLARIES,
            'ibpurc': BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.PAYMENTS
        };
        this.checkSoftUserAndLoggedData();// TODO1: relocate on proper flow check
        if ( stepsArray ) {
            this.model.stepsModel.steps = stepsArray;
        }
        const stepsModel: HeaderDataStepsModel = this.model.stepsModel;

        if ( stepsModel) {
            const currentStep = stepsModel.steps.find( step => step.page === page );
            this.model.stepsModel.currentStep = {...(currentStep ? currentStep : stepsModel.steps[0])};
            currentStep.description = description ?? (descriptionsMap[currentStep.page] || null);
            this.saveHeaderModel();
        }
        this.checkAdaptativeMobileFlow();
    };
    
    // TODO1: relocate on proper flow check
    private checkSoftUserAndLoggedData = (): void => {
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        let loggedData: any = this.CommonsSessionStorageService.get( 'customerData' );
        const hasLoggedData: boolean = this.isSoftUser && loggedData;
        if ( !( hasLoggedData && this.model?.greyBarModel ) ) return;
        loggedData = this.IbBookingHeaderService.updateLoggedData( loggedData );
        this.model.greyBarModel.loggedData = loggedData;
        this.model.greyBarModel.isLogged = loggedData.isLogged;
        
    };

    /**
     * Save header model on localStorage
     */
    public saveHeaderModel = () => {
        this.CommonsSessionStorageService.set( 'headerModel', this.model );
        this.observableHeader.next( this.model );

    };

    public setLogin = ( onLogin, afterLogin, errorLogin, loggedData ) => {
        if ( loggedData ) {
            loggedData = this.IbBookingHeaderService.updateLoggedData( loggedData );
        }
        this.model.greyBarModel.login = {
            onLogin: onLogin,
            afterLogin: afterLogin,
            onError: errorLogin
        };
        this.model.greyBarModel.loggedData = loggedData || this.model.greyBarModel.loggedData;
        this.saveHeaderModel();
    };

    /**
     * Update Basket in Availability
     * @param {*} offerSelected
     * @param {*} model
     */
    public updateTripsBasketFromDispo = ( offerSelected, model ) => {
        const transformedTrips = this.IbBasketTransformerService.transformTripsCartFromDispo( offerSelected, model );
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, { trips: transformedTrips, total: cloneDeep( transformedTrips.total ) } );
        if ( this.model?.headerModel?.shoppingBasket?.discountsModel?.total ) {
            this.model.headerModel.shoppingBasket.total.totalPrice = offerSelected.price.total;
            this.model.headerModel.shoppingBasket.total.formatted = this.CurrencyService.formatPrice( this.model.headerModel.shoppingBasket.currency, this.model.headerModel.shoppingBasket.total.totalPrice, true, null );
        }
        if( transformedTrips?.ticketingFee ) {
            this.updateBasketOthers( 'SUMMARY_OTHER_FEES_ADMINISTRATION', {
                code: 'ticketingFee',
                description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                parsedFee: transformedTrips.ticketingFeeFormatted,
                totalFee: transformedTrips.ticketingFee
            });
        }
        this.ShoppingBasketViewModelService.calculateAllBasket( this.model.headerModel.shoppingBasket );
        this.saveHeaderModel();
    };

    /**
     * Delete Trips and Update Basket in Availability
     */
    public deleteTripsBasketFromDispo = () => {
        const transformedTrips = this.IbBasketTransformerService.deleteTripsCartFromDispo();
        this.model.headerModel.shoppingBasket.othersModel.hasElements = false;
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, { trips: transformedTrips, total: cloneDeep( transformedTrips.total ) } );
        this.saveHeaderModel();
    };

    public updateTripsBasket = ( model, offer ) => {
        const transformedTrips = this.IbBasketTransformerService.transformTripsCart( model, offer );
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, { trips: transformedTrips, total: cloneDeep( transformedTrips.total ) } );
        this.saveHeaderModel();
    };

    public updateTripsFromOrder = ( order:OrderData | OHImportResponse ) => {
        const transformedTrips = this.IbBasketTransformerService.transformTripsFromOrder( order  as OrderData);
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, { trips: transformedTrips, total: cloneDeep( transformedTrips.total ) } );
        this.model.headerModel.shoppingBasket.discountsModel ={
            hasDiscounts: false,
            discounts:{},
            total:0,
            totalFormated:undefined,
            formattedElement:undefined
        };
            
        const discounts = (order as OrderData).order.discountsApplied?.discounts ?? [];
        
        discounts.forEach( discount => {
            this.updateDiscountsNew(discount, (order as OrderData).order.discountsApplied.originalPrice, (order as OrderData).order.discountsApplied.totalDiscount, transformedTrips.total.totalPrice);
        });
        this.saveHeaderModel();
    };

    public updateDiscounts = ( discountType, modelDiscount ) => {
        const modelDiscountUpdated = this.IbBookingHeaderService.updateBasketDiscounts( this.model.headerModel, discountType, modelDiscount );
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, modelDiscountUpdated );
        this.saveHeaderModel();
    };

    /** New method to update discounts in the header, with new discount model
     * @param discountData Discount data to update
     * @param originalPrice Original price before discounts
     * @param totalDiscounts Total amount of discounts applied
     * @param totalPriceWithDiscounts Total price after applying discounts
     */
    public updateDiscountsNew = ( discountData:Discount, originalPrice: OriginalPriceClass, totalDiscounts:number, totalPriceWithDiscounts:number ) => {
        const updatedBasket = this.IbBookingHeaderService.updateBasketDiscountsNew( this.model.headerModel, discountData, originalPrice, totalDiscounts, totalPriceWithDiscounts );
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, updatedBasket, totalPriceWithDiscounts );
        this.saveHeaderModel();
    };

    public deleteDiscountBasket = ( discountType ) => {
        const updatedBasket = this.IbBookingHeaderService.deleteDiscountFromBasket( this.model.headerModel, discountType );
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, updatedBasket );
        this.saveHeaderModel();
    };

    public addDiscountBasket = ( discountData ) => {
        const updatedBasket = this.IbBookingHeaderService.addDiscountToBasket( this.model.headerModel, discountData );
        this.model.headerModel.shoppingBasket = Object.assign( this.model.headerModel.shoppingBasket, updatedBasket );
        this.saveHeaderModel();
    };

    public updateBasketOthers = ( type, feeInfo ) => {
        this.IbBookingHeaderService.updateBasketOthers( this.model.headerModel, type, feeInfo );
        this.saveHeaderModel();
    };

    public updateBasketFlexibilization = ( flexInfo ) => {
        this.IbBookingHeaderService.updateBasketFlexibilization( this.model.headerModel, flexInfo );
        this.saveHeaderModel();
    };

    public updateBasketUpgrading = ( upgrading ) => {
        this.IbBookingHeaderService.updateBasketUpgrading( this.model.headerModel, upgrading );
        this.saveHeaderModel();
    };

    public updatePendingPaymentItems = ( headerInfo ) => {
        let seatsInfo;
        this.model.headerModel.shoppingBasket.showBasket = true;
        let alreadyLoaded: any = this.CommonsSessionStorageService.get( 'alreadyLoaded' );
        if ( this.model.headerModel.shoppingBasket.currency !== undefined ) {
            this.model.headerModel.shoppingBasket.currency = headerInfo.currency;
        }
        if ( headerInfo.basket ) {
            seatsInfo = headerInfo.basket.seats;
        }else {
            seatsInfo = headerInfo.seats;
        }
        if ( !alreadyLoaded ) {
            this.CommonsSessionStorageService.set( 'alreadyLoaded', true );
            alreadyLoaded = this.CommonsSessionStorageService.get( 'alreadyLoaded' );
            this.IbBookingHeaderService.updatePendingPaymentItems( this.model.headerModel, seatsInfo, headerInfo.upgrading );
        }
        this.saveHeaderModel();
    };

    public updateBasketPriority = ( priorityInfo ) => {
        this.IbBookingHeaderService.updateBasketPriority( this.model.headerModel, priorityInfo );
        this.saveHeaderModel();
    };


    public setShowLogin = () => {
        const actualStepFlow = this.CommonsSessionStorageService.get<string>( 'actualStepFlow' );
        const showLoginSet = new Set(BookingAppConstants.HEADER_SHOW_lOGIN);
        const show =  showLoginSet.has(actualStepFlow) || this.model.greyBarModel.loggedData.isLogged === true;
        this.model.greyBarModel.show = show;
    };



    public showLogin = () => {
        this.setShowLogin();
        this.saveHeaderModel();

    };

    public updateLogin = ( data ) => {
        this.model.greyBarModel.loggedData = this.IbBookingHeaderService.dataUserLogin( data );
        this.model.greyBarModel.isLogged = true;
        this.setShowLogin();
        this.saveHeaderModel();
    };
    public toggleAdvancedSearch = ( event, type = null ) => {
        // this.showAdvancedSearch = !!event;
        this.activeSeeker = !this.activeSeeker;
        this.openCalendar = type;
        if ( this.activeSeeker ) {
            document.querySelectorAll( 'body' )[0].classList.add( 'modal-open' );
        } else {
            document.querySelectorAll( 'body' )[0].classList.remove( 'modal-open' );
        }
    };

    public checkPartnersDiscount = () => {
        try {
            const usePartner = this.rootScope.customerData.personalInfo.applyPartersDiscounts;
            return this.rootScope.isLogged === true && this.rootScope.customerData.personalInfo.partnersInfoBKI.length > 0 && usePartner;
        } catch ( e ) {
            return false;
        }
    };

    public validateStepFlow = ( stepFlow ) => {
        return stepFlow === 'availability' || stepFlow === 'ibairp';
    };

    private calculateModelTripsHeader = (): void => {
        const width = this.window.innerWidth;
        if ( width < 768 ) {
            this.numberTrips = BookingHeaderConstants.TRIPS_NUMBER.SMALL;
        } else if ( width >= 768 && width < 1280 ) {
            this.numberTrips = BookingHeaderConstants.TRIPS_NUMBER.MEDIUM;
        } else if ( width >= 1280 ) {
            this.numberTrips = BookingHeaderConstants.TRIPS_NUMBER.LARGE;
        }
        if ( width < 768 ) {
            this.profileIcon = true;
        } else {
            this.profileIcon = false;
        }
    };

    /**
     * Recover header model of localStorage
     */
    public getHeaderModel = (): HeaderDataType => {
        return this.CommonsSessionStorageService.get('headerModel');
    };
    @HostListener( 'window:resize', [ '$event' ] )
    public onResize = () => {
            this.calculateModelTripsHeader();
            this.checkAdaptativeMobileFlow();
        };

    public backToMain = ( goToHome ) => {
        const actualStepFlow = this.CommonsSessionStorageService.get( 'actualStepFlow' );
        const flowApp = this.CommonsSessionStorageService.get( 'flowApp' );
        const onHoldOptions = this.CommonsSessionStorageService.get( 'onHoldOptions' ) || null;
        const dataModal = { idModal: BookingAppConstants.DATALAYER_MODAL_ID.BACK_MAIN_HEADER_MODAL };
        const isFlowBKIOnHold = ( flowApp === 'BBKI' && onHoldOptions ) && ( actualStepFlow === 'ibcmtv' || actualStepFlow === 'ibpurc' );

        if ( this.model.headerModel.showModalBackHome ) {
            if ( isFlowBKIOnHold ) {
                dataModal.idModal = BookingAppConstants.DATALAYER_MODAL_ID.SHOW_ONHOLD_MODAL;
                this.BookingModalService.showOnholdModal( true, 'ib-modal-onhold-header.html', dataModal ).result.then( () => {
                    this.eventBackToMainRoot( goToHome );
                }, () => { } );
            } else {
                this.showModalBackToMain( dataModal, goToHome );
            }

        } else {
            this.eventBackToMainRoot( goToHome );
        }
    };

    public eventBackToMainRoot = ( goToHome ) => {
        if ( this.closeSession ) {
            this.rootScope.$broadcast('backToMainRoot', goToHome, this.closeSession);
        } else {
            this.rootScope.$broadcast('backToMainRoot', goToHome);
        }
    };

    public showModalBackToMain = ( dataModal, goToHome ) => {
        this.BookingModalService.showBackMainModalComponent( dataModal, true ).result.then(
            () => {
                this.eventBackToMainRoot( goToHome );
            }, () => { }
        );
    };

    public backToMultiFlight = ( goToHome) => {
        const dataModal = { idModal: BookingAppConstants.DATALAYER_MODAL_ID.BACK_MAIN_HEADER_MODAL };
        if (!goToHome) {
            this.showModalBackToMain( dataModal, null );
        } else {
            this.eventBackToMainRoot( null );
        }

    };
    public updateShowBasket = ( showBasket: boolean ) => {
        this.model.headerModel.showBasket = showBasket;
        this.model.headerModel.shoppingBasket.showBasket = showBasket;
        this.saveHeaderModel();
    };
    public updateStepDescription = ( description: string ): void => {
        if ( this.model?.stepsModel ) {
            this.model.stepsModel.currentStep = { ...this.model.stepsModel.currentStep, description };
            this.saveHeaderModel();
        }
    };
    public checkAdaptativeMobileFlow = (): boolean => {
        this.showHeaderMobile = this.IbBookingFlowUtilsService.checkAdaptativeMobileView();
        return this.showHeaderMobile;
    };

    public checkSearchOriginStopover = (): boolean => {
        const bookingUrlParams : any = this.CommonsSessionStorageService.get( 'bookingUrlParams' );
        const stopoverList = [
            'HMADVS', 'HMEXPS', 'HMPLRC', 'HMFAQS', 'HMADVS-ANTIGUO'
        ];
        if(!bookingUrlParams) return false;
        return stopoverList.includes(bookingUrlParams.searchOrigin || '') || bookingUrlParams.searchOrigin?.startsWith('HM');
    };
    public checkIsHMad = (): boolean => {
        return this.CommonsSessionStorageService.get( 'isHMAD' ) || this.checkSearchOriginStopover();
    };
    public addSimpleDiscount = ( discountData: ShoppingBasketDiscountObjectType ): void => {
        const updatedBasket = this.IbBookingHeaderService.addSimpleDiscount( this.model.headerModel.shoppingBasket, discountData );
        this.model.headerModel.shoppingBasket = Object.assign( {}, updatedBasket );
        this.saveHeaderModel();
    };
    public getObservableHeader = (): BehaviorSubject<HeaderDataType> => {
        return this.observableHeader;
    };
    public setAncillariesDeletion = ( status: boolean ): void => {
        this.ancillariesDeletion.next( status );
    };
    public getAncillariesDeletion = (): BehaviorSubject<boolean> => {
        return this.ancillariesDeletion;
    };
    public deleteInsuranceFromBasket = (): void => {
        const updatedBasket = this.IbBookingHeaderService.deleteInsuranceFromBasket( this.model.headerModel.shoppingBasket );
        this.model.headerModel.shoppingBasket = Object.assign( {}, updatedBasket );
        this.saveHeaderModel();
    };
    public deleteGlobickTransfersFromBasket = (): void => {
        const updatedBasket = this.IbBookingHeaderService.deleteGlobickTransfersFromBasket( this.model.headerModel.shoppingBasket );
        this.model.headerModel.shoppingBasket = Object.assign( {}, updatedBasket );
        this.saveHeaderModel();
    };
    public deleteAssistCardFromBasket = (): void => {
        const updatedBasket = this.IbBookingHeaderService.deleteAssistCardFromBasket( this.model.headerModel.shoppingBasket );
        this.model.headerModel.shoppingBasket = Object.assign( {}, updatedBasket );
        this.saveHeaderModel();
    };
    public setLoadingBasket = ( status: boolean ): void => {
        this.loadingBasket.next( status );
    };
    public getLoadingBasket = (): BehaviorSubject<boolean> => {
        return this.loadingBasket;
    };
    public setTotalDCC = ( total: string ): void => {
        this.model.headerModel.shoppingBasket.total.totalDcc = total;
        this.saveHeaderModel();
    };
    public forceVisualUpdate = () => {
        this.ChangeDetectorRef.detectChanges();
    };
    public setHeaderType = ( type: HeaderTypeModel ): void => {
        this.model.headerModel =  {...this.model.headerModel, headerType: type };
        this.saveHeaderModel();
    };

    public blockNavigation = ( status: boolean ): void => {
        this.navigationBlocked = status;
        this.ChangeDetectorRef.detectChanges();
    };

}

downgradeToAJSComponent(
    'ibBookingHeaderComponent',
    {
        component: IbBookingHeaderComponent,
        inputs: [],
        outputs: []
    },
    'ib-booking-header-module',
    ['ib-header-seeker-module']
);
