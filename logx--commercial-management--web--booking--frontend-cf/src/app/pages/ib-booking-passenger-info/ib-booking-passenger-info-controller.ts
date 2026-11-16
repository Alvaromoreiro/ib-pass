import angular from 'angular';
import { filter, Subscription } from 'rxjs';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { BookingPageUtilsService } from '@shared/services/ib-utils/ib-booking-page-utils.service';
import { BookingPassengerInfoErrorManager } from '@src/app/pages/ib-booking-passenger-info/services/ib-booking-passenger-info-error-management-service';
import { DatalayerBKIService } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service';
import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { MonetateUtilsService } from '@shared/services/ib-monetate/services/ib-monetate-utils';
import { CommonsRootScope, CommonsBrowserStorageService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { BookingPassengerInfoService } from './services/ib-booking-passenger-info-service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { DatalayerGeneralConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-general-constants';
import { IbSuggestLoginModalComponent } from '@src/app/shared/components/ib-suggest-login-modal/ib-suggest-login-modal.component';
import { IbShortRegisterService } from '@src/app/shared/http-services/pzmm-mbm/ib-register.service';
import { IbBookingRegisterTransformerService } from './components/ib-booking-register-form/services/ib-booking-register-transformer.service';
import { IbBookingRegisterFormDataService } from './components/ib-booking-register-form/services/ib-booking-register-form-data.service';
import { LoyaltyProgramEarnModel } from '@src/app/core/models/generic-models/generic-models';
import { ContactData } from '@core/models/ib-booking-passenger-info/components/ib-booking-contact-form-model';
import { IbBookingContactFormDataService } from './components/ib-booking-contact-form/services/ib-booking-contact-form-data.service';
import { BookingUserActivityService } from '@core/services/ib-booking-user-activity.service';
import { FormGroup } from '@angular/forms';
import { HeaderDataType, ShoppingBasketDiscountType } from '@src/app/core/models/ib-booking-availability/header-model';
import { FareDataModel } from '@src/app/core/models/generic-models/fare-models';
import { PassengeInfoUtilsService } from './services/ib-passenger-info-utils.service';
import { StepsNavigationService } from '@src/app/shared/services/ib-utils/ib-booking-steps-navigation.service';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { PassengersFormData } from '@src/app/core/models/ib-booking-pasenger-form/ib-booking-passenger-form.model';
import type { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

export interface SuggestLoginType {
    mobile: boolean;
    desktop: boolean;
}

export interface SuggestLoginMapType {
    showMobile: boolean;
    showDesktop: boolean;
}

@Component('ib-booking-passenger-info-module', 'ibBookingPassengersInfoComponent', {
    controllerAs: 'bookingPassengersInfoCtrl',
    bindings: {},
    templateUrl: ['BookingAppConstants', ( bkiConstants: BookingAppConstants ): string =>
        bkiConstants.templatesRoute + 'ib-booking-passenger-info-view.html'
    ]
}, ['$scope', '$timeout', 'BookingModalService', 'BookingPassengerInfoService',
    'BookingPassengerInfoConstants', '$location', 'DatalayerUtilsService', 'BookingUtilService', 'BookingAppConstants', '$window',
    'CommonsSessionStorageService', '$filter', '$rootScope', 'MonetateUtilsService',
    'NewMainHeaderFacade', 'CommonsUtilService', 'CurrencyService', 'CommonsBrowserStorageService',
    '$document', 'CommonsUserUtilsService', 'IbCheckPartnersDiscountsService',
    'DatalayerBKIService', 'BookingPassengerInfoErrorManager', 'BookingPageUtilsService',
    'IbBookingPassengerInfoUtilsService', 'IbCModalService', 'IbShortRegisterService', 'IbBookingRegisterTransformerService',
    'IbBookingRegisterFormDataService', 'IbBookingContactFormDataService', 'BookingUserActivityService',
    'PassengeInfoUtilsService', 'StepsNavigationService', 'IbBookingPriceDetailModalService'],
[])
export class BookingPassengersInfoController implements ng.IController {
    public model:{
        passengersFormData: PassengersFormData;
    };
    public LOGIN_ONB;
    public oBDiscountType;
    public pointsChecked;
    public lastEmailConsentRequest = '';
    public ancOffersTotal = '';
    public flowApp;
    public isUserLogged = false;
    public checkSavePassengersData = false;
    public userWantsRegister = false;
    public showLostShoppingCartLightbox:boolean;
    public metaURL;
    public farePartner;
    public showPartnerFreeOnHold = false;
    public userSuitableForPartnerDiscount = false;
    public showIbPlusUserDataWarning:boolean;
    public lostShoppingCartLightbox;
    public adaptativeMobileFlow;
    public multiCitySearch;
    public isSoftUser;
    public isIbPlus;
    public showOnHoldButton: boolean;
    public oBPoints;
    public showOBPoints:string;
    public noDiscountOBPrice;
    public showNoDiscountOBPrice;
    public iTravelChecked: boolean;
    public passInfoForm;
    public showLoginForm: boolean;
    public registerFormValid:boolean = true;
    public contactFormValid:boolean = true;
    public passengerFormValid:boolean = true;
    public loyaltyEarnInfo: LoyaltyProgramEarnModel;
    public contactDataSubs: Subscription = new Subscription();
    public birthDateFormsValidity: { [index: number]: boolean } = {};
    public passengerFormsValidity: { [index: number]: boolean } = {};
    public birthDateFormValid: boolean = false;
    public setPassengersDataToLocalStorage: boolean = false;
    public fillResidentChecked: boolean = false;
    public fillLargeFamilyChecked: boolean = false;
    public infoAvios = {};
    public fareData;
    public partnerDiscountFromFare;

    constructor (
        private $scope: angular.IScope,
        private $timeout: ng.ITimeoutService,
        private BookingModalService:any,
        private BookingPassengerInfoService: BookingPassengerInfoService,
        private BookingPassengerInfoConstants,
        private $location: ng.ILocationService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private BookingUtilService:any,
        private BookingAppConstants: BookingAppConstants,
        private $window: ng.IWindowService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private $filter: angular.IFilterService,
        private $rootScope: CommonsRootScope,
        private MonetateUtilsService: MonetateUtilsService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private CommonsUtilService: CommonsUtilService,
        private CurrencyService: CurrencyService,
        private CommonsBrowserStorageService: CommonsBrowserStorageService,
        private $document: ng.IDocumentService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService,
        private DatalayerBKIService: DatalayerBKIService,
        private BookingPassengerInfoErrorManager: BookingPassengerInfoErrorManager,
        private BookingPageUtilsService: BookingPageUtilsService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        private IbCModalService: IbCModalService,
        private IbShortRegisterService: IbShortRegisterService,
        private IbBookingRegisterTransformerService: IbBookingRegisterTransformerService,
        private IbBookingRegisterFormDataService: IbBookingRegisterFormDataService,
        private IbBookingContactFormDataService: IbBookingContactFormDataService,
        private BookingUserActivityService: BookingUserActivityService,
        private PassengeInfoUtilsService: PassengeInfoUtilsService,
        private StepsNavigationService: StepsNavigationService,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService
    ) {
        this.model = {
            passengersFormData: null
        };
        this.LOGIN_ONB = this.BookingAppConstants.LOGIN_ONB;
        this.oBDiscountType = this.CommonsSessionStorageService.get('oBDiscountType');
        this.pointsChecked = this.CommonsSessionStorageService.get('pointsChecked');
        this.CommonsSessionStorageService.remove('isRegisterSuccesfull');
        this.CommonsSessionStorageService.remove('isRegister');
        this.lastEmailConsentRequest = '';
        this.ancOffersTotal = '';
        this.$scope.$on('openSummaryModal', this.openModalLinks);
        this.$scope.$on('continueEvent', this.checkChanges);
        this.$scope.$on('showWaitingModal', this.showWaitingModalLoginAccess);
        this.$scope.$on('passengerPageUpdate', this.activate);
        this.$scope.$on('updateResidentErrors', this.updateResidentErrors);
        this.$rootScope.$on('holdOrderEvent', this.checkChanges);
        this.$window.addEventListener( 'nextStepFlowLegacy', this.checkChanges );
        angular.element( this.$window ).on( 'resize', this.onResize );
        this.$scope.$on('$destroy', () => {
            this.$window.removeEventListener( 'nextStepFlowLegacy', this.checkChanges );
            angular.element( this.$window ).on( 'resize', this.onResize );
            this.contactDataSubs.unsubscribe();
        });
        this.flowApp;
        this.isUserLogged = false;
        this.checkSavePassengersData = false;
        this.userWantsRegister = false;
        this.showLostShoppingCartLightbox = false;
        this.metaURL = '';
        this.farePartner;
        this.showPartnerFreeOnHold = false;
        this.userSuitableForPartnerDiscount = false;
        this.showIbPlusUserDataWarning = false;
        this.lostShoppingCartLightbox = {
            type: 'generic-lightbox',
            title: 'NOTICE_CONSENT_TITLE',
            text: 'NOTICE_CONSENT_TEXT',
            action: {
                text: 'NOTICE_CONSENT_ACCEPT_BUTTON_TEXT',
                title: 'NOTICE_CONSENT_ACCEPT_BUTTON_TEXT',
                callback: 'acceptEmailConsent'
            },
            closeAction: 'closeEmailConsentLightbox',
            actionButtonDisabled : false,
            outAction: {
                text: 'PRIVACY_POLICY_TITLE_TEXT',
                title: 'PRIVACY_POLICY_TITLE_TEXT',
                target: this.BookingAppConstants.LINK_TARGETS.BLANK,
                url: this.$filter<any>('LinksFilter')('DATA_PROTECTION_POLICY_LINK'),
                icon: 'icon-nota'
            }
        };
        this.adaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
    }

    activate = () => {
        this.IbBookingPriceDetailModalService.initPriceModalData();
        this.multiCitySearch = this.CommonsSessionStorageService.get( BkiStorageConstants.MULTICITY ) ? this.CommonsSessionStorageService.get( BkiStorageConstants.MULTICITY ) : false;
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.isIbPlus =this.CommonsUserUtilsService.isIbPlus();
        this.BookingPageUtilsService.setPageTitle('BKI_TITLE_PAGE_PASSENGERS');
        this.isUserLogged = this.BookingUtilService.isUserLogged();
        this.fareData = this.CommonsSessionStorageService.get( BkiStorageConstants.FARE );
        this.flowApp = this.CommonsSessionStorageService.get( BkiStorageConstants.FLOW_APP );
        this.showLostShoppingCartLightbox = false;
        this.PassengeInfoUtilsService.checkRedemptionsAndShuttleFLows();
        this.PassengeInfoUtilsService.setShowbasketByFlowType();
        this.showOnHoldButton = true;
        this.controlStepFlow();
        this.showIbPlusUserWarning();
        this.onResize();
        this.$timeout( () => {
            this.ancOffersTotal = this.PassengeInfoUtilsService.checkSelectedFlex();
        }, 3000);
    };
    
    private controlStepFlow = () => {
        const orderCreated: any = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        const skipToPayments:any  = this.CommonsSessionStorageService.get('skipPassengerToPayments');
        const forbiddenNextStep = this.CommonsSessionStorageService.get( BkiStorageConstants.FORBIDDEN_NEXT_STEP );
        const backNavigation = this.StepsNavigationService.checkButtonsActivation();

        if (this.PassengeInfoUtilsService.checkGoToPayment(backNavigation, orderCreated, skipToPayments, forbiddenNextStep ) ) {
            this.showWaitingModal();
            this.goToPay(skipToPayments?.isOnHold ?? false);
        } else {
            this.checkStepAndFareData(forbiddenNextStep);
            this.checkLoginStatus();
            this.NewMainHeaderFacade.updateTrips(this.fareData, this.infoAvios);
            const points:any = this.CommonsSessionStorageService.get(BkiStorageConstants.CALCULATED_POINTS) || { Avios: 0, Elite: 0 };
            this.updateLoyaltyEarnedPoints( points.Avios, points.Elite );
            this.metaURL = this.PassengeInfoUtilsService.generateMetasearchUrl();
        }
    };
    
    private checkStepAndFareData = ( forbiddenNextStep ) => {
        const loadPassengerFormData = () => this.BookingPassengerInfoService.getPassengerInfo().then(this.getPassengerInfoSuccess, this.PassengeInfoUtilsService.getPassengerInfoError);
        if ( !forbiddenNextStep ) {
            this.BookingPassengerInfoService.checkFareUpdated().then( loadPassengerFormData, loadPassengerFormData );
            return;
        } 
        this.showWaitingModal();
        const stepsControlActivation = this.StepsNavigationService.checkButtonsActivation();
        if ( !stepsControlActivation ) {
            this.PassengeInfoUtilsService.callNotAllowedModal();
        } else {
            this.PassengeInfoUtilsService.restoreHeaderModel();
            this.BookingPassengerInfoService.checkFareUpdated().then( loadPassengerFormData, loadPassengerFormData );
        }
    };
    
    private checkLoginStatus = () => {
        if ( this.PassengeInfoUtilsService.checkLoginOnb() ) {
            if (this.CommonsSessionStorageService.get('pointsChecked')) {
                this.oBPoints = this.CommonsSessionStorageService.get('oBPoints');
                this.showOBPoints = 'SHOW';
                if (this.CommonsSessionStorageService.get('discountsAndPoints')) {
                    this.noDiscountOBPrice = this.CommonsSessionStorageService.get('noDiscountOBPrice');
                    this.showNoDiscountOBPrice = this.CommonsSessionStorageService.get('showNoDiscountOBPrice');
                }
            } else {
                this.noDiscountOBPrice = this.CommonsSessionStorageService.get('noDiscountOBPrice');
                this.showNoDiscountOBPrice = this.CommonsSessionStorageService.get('showNoDiscountOBPrice');
            }
        } else if (this.CommonsSessionStorageService.get('userLogged')) {
            this.iTravelChecked = true;
        } else {
            this.iTravelChecked = false;
        }
    };
    
    private setBasketDiscountsFromFareData = ( fareDataAux ) => {
        if ( !(fareDataAux?.offers?.[ 0 ]?.discountsApplied?.discounts?.length > 0) ) return;
        fareDataAux.offers[ 0 ].discountsApplied.discounts.forEach( ( discount ) => {
            this.NewMainHeaderFacade.updateBasketDiscountsNew( discount, fareDataAux.offers[ 0 ].discountsApplied.originalPrice, fareDataAux.offers[ 0 ].discountsApplied.totalDiscount, fareDataAux.offers[ 0 ].price.total );
            if ( this.PassengeInfoUtilsService.checkPartnerDiscountFromFare( discount ) ) {
                this.partnerDiscountFromFare = discount;
            }
        } );
    };
    
    private getPassengerInfoSuccess = ( data: any ) => {
        let discountsTemp = [];
        const showBasket = this.CommonsSessionStorageService.get<HeaderDataType>( BkiStorageConstants.HEADER_MODEL );
        const fareDataAux = this.CommonsSessionStorageService.get<FareDataModel>( BkiStorageConstants.FARE );
        this.$rootScope.showHeaders = true;
        this.infoAvios = data.securityInfoData.transformedSecurityInfoPassengerData;
        showBasket.headerModel.shoppingBasket.showBasket = true;
        showBasket.greyBarModel.show = true;
        this.NewMainHeaderFacade.updateHeaderModel( showBasket );
        this.NewMainHeaderFacade.updateSteps( this.CommonsSessionStorageService.get( BkiStorageConstants.ACTUAL_STEP_FLOW ) );
        this.NewMainHeaderFacade.showLogin();
        this.showLoginForm = !this.isUserLogged || this.isSoftUser;
        this.setHeaderLoginAction();
        this.PassengeInfoUtilsService.checkNewOffer( this.flowApp, this.fareData );
        this.NewMainHeaderFacade.updateTrips( fareDataAux, this.infoAvios );
        this.PassengeInfoUtilsService.setBasketOthers( fareDataAux, this.fareData );
        showBasket.headerModel.shoppingBasket.discountsModel.discounts = {} as ShoppingBasketDiscountType;
        showBasket.headerModel.shoppingBasket.discountsModel.total = 0;
        showBasket.headerModel.shoppingBasket.discountsModel.hasDiscounts = false;
        this.NewMainHeaderFacade.updateHeaderModel( showBasket );
        this.setBasketDiscountsFromFareData( fareDataAux );
        this.model.passengersFormData = {
            securityInfo: data.securityInfoData.transformedSecurityInfoPassengerData,
            prefixesList: data.securityInfoData.transformedPrefixes,
            phonePrefixFallback: data.securityInfoData.phonePrefixFallback,
            companiesList: data.companiesList,
            businessCodeType: data.businessCodeType,
            countriesList: data.countriesList,
            frequentlyPassengers: data.securityInfoData.transformedSecurityInfoPassengerData.passengerInfoLogged.userInfo ? this.$filter( 'filter' )( data.securityInfoData.transformedSecurityInfoPassengerData.frequentlyPassengers, {
                login: data.securityInfoData.transformedSecurityInfoPassengerData.passengerInfoLogged.userInfo.login
            }, ( obj, test ) => {
                return obj !== test;
            } ) : data.securityInfoData.transformedSecurityInfoPassengerData.frequentlyPassengers
        };
        this.model.passengersFormData.securityInfo.discounts = discountsTemp;
        this.checkLoadPassengerIsLogged();
        this.showOnHoldButton = this.PassengeInfoUtilsService.checkLoadPassengerHolaMadrid( this.showOnHoldButton );
        this.model = this.PassengeInfoUtilsService.checkShuttleOnPassengerInfo( this.model );
        this.checkshowPartnerFreeOnHold( this.partnerDiscountFromFare );
        this.$scope.$broadcast( 'scrollBar', true );
        this.PassengeInfoUtilsService.loadPassengerDigitalDataAndMonetate( data, fareDataAux );
        this.BookingModalService.finishWaiting();
        this.checkToShowSuggestLoginModal();
        this.PassengeInfoUtilsService.checkToShowSoftLoginModal();
        this.setContactDataObs();
    };
    
    private checkLoadPassengerIsLogged = () => {
        setTimeout( () => {
            this.checkIfExistsPassengersDataToLocalStorage();
        } );

        if ( !this.BookingUtilService.isUserLogged() ) {
            setTimeout( () => {
                if ( this.model.passengersFormData?.securityInfo?.passengerInfoLogged?.contactEmail ) {
                    this.checkEmailsConsent( this.model.passengersFormData.securityInfo.passengerInfoLogged.contactEmail, null );
                }
            } );
        }
    };
    
    setHeaderLoginAction = () => {
        if(this.isUserLogged) {
            this.NewMainHeaderFacade.setLogin(
                () => {
                    this.showWaitingModal();
                }, this.afterLoginPageUpdate,
                () => {
                    this.BookingModalService.finishWaiting();
                }, this.CommonsSessionStorageService.get('customerData'));
        } else {
            this.NewMainHeaderFacade.setLogin(
                () => {
                    this.showWaitingModal();
                }, this.afterLoginPageUpdate,
                () => {
                    this.BookingModalService.finishWaiting();
                });
        }
    };

    afterLoginPageUpdate = () => {
        const fareData = this.CommonsSessionStorageService.get('fareData');
        this.showWaitingModal();
        this.BookingPassengerInfoService.getCalculatedPoints(fareData).then(() => {
            this.model.passengersFormData = null;
            this.activate();
        }, (error) => {
            if (error) {
                this.model.passengersFormData = null;
                this.activate();
            }
        });
        this.$rootScope.$broadcast('loginAccessPassengerInfo');
    };


    openModalLinks = (event, modalTemplate, model) => {
        model = model || {};
        angular.extend(model, {
            idModal: modalTemplate
        });
        this.BookingModalService.showGenericModal(false, modalTemplate, model).result.then(angular.noop, angular.noop);
    };

    passengersCompleted = (onHold)=> {
        const areWarningMessagesValid = !this.getWarningMessagesStatus(this.model.passengersFormData.securityInfo.warningMessages.checkAdvises);
        let mainHeaderModel;
        let bookingInfo;
        let areFormsValid;
        const digitalDataObject = {};
        this.CommonsSessionStorageService.set('loadingNextFlow', 3);
        this.userWantsRegister = (this.IbBookingRegisterFormDataService.getPassword() && this.IbBookingRegisterFormDataService.getCheck());
        this.CommonsSessionStorageService.remove('passengersFlowInit');
        this.passInfoForm.$submitted = true;
        areFormsValid = this.passengerFormValid && this.registerFormValid && this.contactFormValid && this.birthDateFormValid;
        this.checkScrollToError();
        if (areFormsValid && areWarningMessagesValid) {
            this.showLostShoppingCartLightbox = false;
            this.showWaitingModal();

            if(!Boolean(this.model.passengersFormData.securityInfo?.contactData?.contactPrefix?.countryCode)) {
                this.model.passengersFormData.securityInfo.contactData.contactPrefix.countryCode = this.BookingPassengerInfoService.checkCodePrefix(this.model.passengersFormData.securityInfo.contactData.contactPrefix, this.model.passengersFormData.prefixesList);
            }
            this.savePassengersData(this.checkSavePassengersData);
            this.BookingPassengerInfoService.createBookingOrder(this.model.passengersFormData.securityInfo, onHold).then((createOrderData: OrderData) => {
                this.BookingUserActivityService.initKeepAliveTimer();
                this.BookingUserActivityService.setOrderTimeoutTimer();
              
                digitalDataObject[DatalayerGeneralConstants.PASSENGER_EMAIL] = createOrderData.order.primaryContactInfo.hashEID;
                if(!this.isUserLogged) {
                    if(this.userWantsRegister) {this.registerUser(this.passInfoForm);}
                }
                this.DatalayerUtilsService.addDigitalDataInfo(digitalDataObject);
                bookingInfo = this.BookingPassengerInfoService.generateBookingInfoModel(createOrderData);
                const bkiReferences = bookingInfo?.order?.bookingReferences ?? [];
                bkiReferences.forEach((bookingReference, index) => {
                    if(bkiReferences.length > 1) {
                        if(bookingReference.provider === 'IB') {
                            this.DatalayerUtilsService.updatePnr(bookingReference);
                        }
                    }else{
                        this.DatalayerUtilsService.updatePnr(bookingReference);
                    }
                });
                mainHeaderModel = this.CommonsSessionStorageService.get('headerModel');
                mainHeaderModel.headerModel.shoppingBasket.segmentsInfo = this.CommonsUtilService.getSegmentsInfo();
                this.NewMainHeaderFacade.updateHeaderModel(mainHeaderModel);
                if (mainHeaderModel.headerModel.shoppingBasket.total.totalPrice !== bookingInfo.order.price.total) {
                    this.NewMainHeaderFacade.updateTripsFromOrder(bookingInfo);
                }
                this.NewMainHeaderFacade.updateTripsFromOrder(createOrderData);
                this.IbBookingPassengerInfoUtilsService.createTemporalPNRKey(createOrderData);
                this.formCompletedSuccess(createOrderData, onHold, this.userWantsRegister);
                if ((!this.$rootScope.isPointsOBFlow || this.$rootScope.isRedemptionFlow) && (this.CommonsSessionStorageService.get('flowApp') === 'BBKI') && (this.CommonsSessionStorageService.get('searchFlightType') === 'availabilityFlight' || this.CommonsSessionStorageService.get('searchFlightType') === 'redemptionFlight' || this.CommonsSessionStorageService.get('searchFlightType') === 'metasearchFlight')) {
                    const selectedSlicesMntt = this.CommonsSessionStorageService.get('selectedTripSegments') ?? this.CommonsSessionStorageService.get<any>(BkiStorageConstants.SELECTED_OFFER).slices?.map(el=>[...el.segments]);
                    this.MonetateUtilsService.addFlightReviewMonetate(this.CommonsSessionStorageService.get('bookingUrlParams'), this.CommonsSessionStorageService.get('originDestination'), selectedSlicesMntt, this.CommonsSessionStorageService.get(BkiStorageConstants.SELECTED_OFFER), this.CommonsSessionStorageService.get('fareFamilyConditionsInfo'));
                }
            }, this.formCompletedError);
        }
    };

    registerUser = (formData) => {
        this.CommonsSessionStorageService.set('isRegister', true);
        const success = (res) => {
                this.CommonsSessionStorageService.set('isRegisterSuccesfull', true);
                const eventData = {
                    eventName: 'interaccion',
                    eventCategory: 'registro',
                    eventAction: 'aterrizaje',
                    eventLabel: 'iberia:registro correcto'
                };
                this.DatalayerUtilsService.updateDatalayerEvent(
                    eventData.eventCategory,
                    eventData.eventAction,
                    eventData.eventLabel,
                    eventData.eventName
                );
            },
            failure = (err) => {
                this.CommonsSessionStorageService.set('isRegisterSuccesfull', false);
            };
        this.IbShortRegisterService.enrolMember(this.IbBookingRegisterTransformerService.transformFormRegister()).then(success, failure);
    };

    getWarningMessagesStatus = (warningMessages) => {
        let errors = false;
        angular.forEach(warningMessages, (info) => {
            info.showCheckBoxError = info.checkBox && !info.checkBoxConditions;
            if (info.showCheckBoxError) {
                errors = true;
            }
        });
        return errors;
    };

    warningManager = async (warnings, onHold) => {
        let warning = warnings.find(element => (element.code === 'SSE_AWS_9110'));
        const dynamicPriceWarningCheck =  async () => {
            let dynResult;
            const warningDyn = warnings.find(element => (element.code === 'SSE_Athis_20010' || element.code === 'SSE_AWS_9113'));
            if (warningDyn) {
                warningDyn.title = 'MODAL_HEADING_ATTENTION_TEXT';
                warningDyn.message = warningDyn.description;
                dynResult = await this.BookingModalService.showGenericModal(true, 'generic-info-modal.html', warningDyn).result;
            }
            return dynResult;
        };
        if (warning) {
            warning.title = 'MODAL_HEADING_ATTENTION_TEXT';
            warning.body = warning.description;
            warning.accept = 'MODAL_ITRAVEL_WARNING_CTA';
            warning.cancel = 'OTHER_PRICES_NEW_SEARCH_LINK';
            warning.hideCloseAction = true;
            this.BookingModalService.showGenericModal(true, 'generic-complete-modal.html', JSON.parse(JSON.stringify(warning))).result.then(async () => {
                await dynamicPriceWarningCheck();
                this.goToPay(onHold);
            }, async () => {
                this.$location.path('/availability');
            });
        } else {
            await dynamicPriceWarningCheck();
            this.goToPay(onHold);
        }
    };
    formCompletedSuccess (createOrderData, onHold, userWantsRegister) {
        if (onHold) {
            this.CommonsSessionStorageService.set('flowApp', 'BBKIOH');
        } else {
            this.CommonsSessionStorageService.set('flowApp', 'BBKI');
        }
        this.PassengeInfoUtilsService.saveNewsletterSubscription( userWantsRegister, this.model, this.isUserLogged );
        if (createOrderData.warnings && createOrderData.warnings.length > 0) {
            this.warningManager(createOrderData.warnings, onHold);
        } else {
            this.goToPay(onHold);
        }
    }

    goToPay = (onHold) => {
        const flashOffer = this.BookingUtilService.getURLFirstParameterByName('flashOffer');
        const isSkipAncillaries = this.CommonsSessionStorageService.get('isSkipAncillaries')|| null;
        this.CommonsSessionStorageService.set('loginAccessPassengerInfo', false);
        this.CommonsSessionStorageService.set('skipPassengerToPayments', {isOnHold: onHold});
        this.$window.scrollTo(0, 0);
        if (onHold) {
            this.BookingPassengerInfoService.updateCalculatedPoints().then(() => {
                this.$location.path('/ibpurc');
            }, (error) => {
                if (error) {
                    this.$location.path('/ibpurc');
                }
            });
        } else if (this.$rootScope.isPointsOBFlow) {
            this.$location.path('/ibpurc');
        } else if (this.$rootScope.isShuttleFlow) {
            this.DatalayerUtilsService.setAncillariesAction(null);
            this.BookingPassengerInfoService.updateCalculatedPoints().then(() => {
                this.$location.path('/ibpurc');
            }, (error) => {
                if (error) {
                    this.$location.path('/ibpurc');
                }
            });
        } else if (flashOffer && isSkipAncillaries) {
            this.BookingPassengerInfoService.updateCalculatedPoints().then(() => {
                this.$location.path('/ibpurc');
            }, (error) => {
                if (error) {
                    this.$location.path('/ibpurc');
                }
            });
        } else {
            this.BookingPassengerInfoService.checkAncillaries().then((ancillariesData) => {
                if (ancillariesData) {
                    this.$location.path('/ibcmtv');
                } else {
                    this.DatalayerUtilsService.setAncillariesAction(null);
                    this.BookingPassengerInfoService.updateCalculatedPoints().then(() => {
                        this.$location.path('/ibpurc');
                    }, (error) => {
                        if (error) {
                            this.$location.path('/ibpurc');
                        }
                    });
                }
            }, () => {
                this.DatalayerUtilsService.setAncillariesAction(null);
                if (!this.$rootScope.isRedemptionFlow) {
                    this.BookingPassengerInfoService.updateCalculatedPoints().then(() => {
                        this.$location.path('/ibpurc');
                    }, (error) => {
                        if (error) {
                            this.$location.path('/ibpurc');
                        }
                    });
                } else {
                    this.$location.path('/ibpurc');
                }
            });
        }
    };

    updateResidentErrors = (event, errorData) => {
        let idPassenger, typeError, errorMessage, index, passengerIndex;
        const errorResident = {
            haveError: false,
            errorMessage: ''
        };
        const listPassengersId:any = [];
        const errorTitle = this.BookingPassengerInfoConstants.MODAL_TITLE_ERROR;
        this.BookingPassengerInfoService.cleanErrorResidents(this.model.passengersFormData.securityInfo.passengerInfo);
        angular.forEach(errorData.serviceError.errors, (message, errorIndex) => {
            if (this.BookingAppConstants.bookingPatterns.ERROR_RESIDENT_PATTERN.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_CONGRESSMAN_PATTERN.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_FIRST_SURNAME.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_FREQ_FLYER.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_LARGE_FAMILY_DISCOUNT_PATTERN.test(message.reason)) {
                index = message.reason.indexOf('[');
                idPassenger = message.reason.substring(index + 1, index + 2);
                if (errorIndex === 1) {
                    for (passengerIndex = 0; passengerIndex < this.model.passengersFormData.securityInfo.passengerInfo.length; passengerIndex++) {
                        this.model.passengersFormData.securityInfo.passengerInfo[passengerIndex].serviceErrors = [];
                    }
                }
                listPassengersId.push(idPassenger);
                errorMessage = message.reason.split('|')[1].split(':')[1];
                typeError = this.validateMessageReasonServiceErrors(message.reason);
                this.model.passengersFormData.securityInfo.passengerInfo[idPassenger].isValidForm = false;
                this.model.passengersFormData.securityInfo.passengerInfo[idPassenger].serviceErrors.push({
                    errorMessage: errorMessage,
                    type: this.BookingAppConstants.bookingPatterns.ERROR_FIRST_SURNAME.test(message.reason) ? 'fistSurname' : 'generic',
                    typeError: typeError
                });
                if (this.BookingAppConstants.bookingPatterns.ERROR_RESIDENT_PATTERN.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_CONGRESSMAN_PATTERN.test(message.reason)) {
                    this.model.passengersFormData.securityInfo.passengerInfo[idPassenger].options.resident = this.BookingAppConstants.bookingPatterns.ERROR_RESIDENT_PATTERN.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_CONGRESSMAN_PATTERN.test(message.reason) || this.BookingAppConstants.bookingPatterns.ERROR_LARGE_FAMILY_DISCOUNT_PATTERN.test(message.reason);
                    errorResident.haveError = true;
                    errorResident.errorMessage = errorMessage;
                }
            }
        });
        this.BookingModalService.showGenericError({
            message: errorData.serviceError.errors.length > 1 ? errorData.messageList[errorData.messageList.length - 1].message : errorData.serviceError.errors[0].reason,
            title: errorTitle
        }).result.then(angular.noop, angular.noop);
    };
    validateMessageReasonServiceErrors = (messageReason) => {
        let typeError;
        if(messageReason.includes('largeFamily')){
            typeError = 'largeFamilyError';
        }else if(messageReason.includes('idInfo')){
            typeError = 'idInfoError';
        }
        return typeError;
    };

    formCompletedError = (errorData) => {
        this.$scope.$applyAsync(() => {
            this.BookingModalService.finishWaiting();
        });
        if (errorData.errorCode === this.BookingPassengerInfoConstants.BIRTH_DATE_ERROR_CODE) {
            this.BookingModalService.showGenericError(errorData, true).result.then(() => {
                this.scrollBirthDate(errorData.passengersInvalid[0].passengerIndex);
            }, () => {
                this.scrollBirthDate(errorData.passengersInvalid[0].passengerIndex);
            });
        } else {
            this.BookingPassengerInfoErrorManager.processError(errorData);
        }


    };

    scrollBirthDate = (passengerIndex) => {
        this.$scope.$broadcast('scrollBirthDate', passengerIndex);
    };

    showWaitingModalLoginAccess = () => {
        this.CommonsSessionStorageService.set('loginAccessPassengerInfo', true);
        this.showWaitingModal();
    };


    /**
     * Sets iTravelStatus to true or false, used to call certain funcions or not
     */
    checkItravelStatus = (iTravel) => {
        this.iTravelChecked = iTravel;
        this.model.passengersFormData.securityInfo.iTravel = iTravel;
        this.DatalayerBKIService.updateITravelDigitalData(iTravel);
        this.setPartnerItravel(iTravel);
        this.setContactInfoFields(iTravel);
    };

    setPartnerItravel = (iTravel)=> {
        if ( !this.userSuitableForPartnerDiscount) return;
        let fareData, currency;
        const userMustFly = this.BookingUtilService.checkUserMustFlyFromFare(this.farePartner);
        fareData = this.CommonsSessionStorageService.get('fareData');
        currency = this.CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]);
        // Avoid removing Partner discount if user it's not required to fly
        if (!iTravel && userMustFly) {
            if(fareData.offers[0].discountsApplied)
                for(let discount of fareData.offers[0].discountsApplied.discounts ?? []){
                    discount.discount = this.CurrencyService.formatPrice(currency, discount.totalDiscount, true);
                    if (discount.type === this.BookingAppConstants.DISCOUNT_TYPES.PARTNER || this.CommonsUtilService.isDiscountTypePartnerEquivalent(discount.type)) {
                        this.deletePartnerDiscount(discount, currency);
                        this.setHeaderLoginAction();
                    }
                }
            const datalayerDiscounts = (fareData?.offers?.[0]?.specialDiscountsApplied??[]).filter((discount) => discount.type !== this.BookingAppConstants.DISCOUNT_TYPES.PARTNER && !this.CommonsUtilService.isDiscountTypePartnerEquivalent(discount.type));
            this.DatalayerUtilsService.updateDiscountData(datalayerDiscounts);
        } else {
            for (let discount of fareData.offers[0].discountsApplied.discounts ?? []){
                if (discount.type === this.BookingAppConstants.DISCOUNT_TYPES.PARTNER  || this.CommonsUtilService.isDiscountTypePartnerEquivalent(discount.type)) {
                    this.addPartnerDiscount(discount, currency);
                    this.setHeaderLoginAction();
                    break;
                }
            }
            this.DatalayerUtilsService.updateDiscountData(fareData?.offers?.[0]?.specialDiscountsApplied??[]);
        }
    };



    setContactInfoFields = (iTravel: boolean =  false) => {
        const prefixesList = this.model.passengersFormData.prefixesList;
        const contactDetails = this.CommonsSessionStorageService.get<any>('contactDetails');
        const defaultPrefix = prefixesList.find((prefix) => prefix.countryCode === this.$rootScope.appMarket) ?? prefixesList[0];

        if(iTravel && contactDetails){
            this.IbBookingContactFormDataService.setEmail(contactDetails?.email ?? '');
            this.IbBookingContactFormDataService.setPhone(contactDetails?.phone?.number ?? '');
            const prefix = prefixesList.find((prefix) => prefix.countryCode === contactDetails?.phone?.countryCode) ?? defaultPrefix;
            this.IbBookingContactFormDataService.setPrefix(prefix);
            return;

        } 
        this.IbBookingContactFormDataService.setEmail('');
        this.IbBookingContactFormDataService.setPhone('');
        this.IbBookingContactFormDataService.setPrefix(defaultPrefix);

    };
  

    showWaitingModal = () => {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
    };

    /**
     * Checks if the user is logged and has the alert identified with number 11 (special discount) to show/hide OnHold
     */
    checkshowPartnerFreeOnHold = (discount) => {
        let customerData, partnerUser, isFlightOfTheHouse;
        this.showPartnerFreeOnHold = false;
        this.userSuitableForPartnerDiscount = false;
        partnerUser = this.IbCheckPartnersDiscountsService.checkPartnersDiscount();
        if (this.CommonsSessionStorageService.get('userLogged')) {
            customerData = this.CommonsSessionStorageService.get('customerData');
            if (customerData) {
                if (partnerUser) {
                    isFlightOfTheHouse = this.CommonsSessionStorageService.get('flightOfTheHouse');
                    if (isFlightOfTheHouse) {
                        this.userSuitableForPartnerDiscount = true;
                        this.farePartner = this.IbCheckPartnersDiscountsService.getSelectedPartner();
                        this.model.passengersFormData.securityInfo.onHold.moreTimePrice !== 0 ? this.showPartnerFreeOnHold = true : angular.noop;
                    }
                } else if (discount && (discount.type === this.BookingAppConstants.DISCOUNT_TYPES.PARTNER || this.CommonsUtilService.isDiscountTypePartnerEquivalent(discount.type))) {
                    isFlightOfTheHouse = this.CommonsSessionStorageService.get('flightOfTheHouse');
                    if (isFlightOfTheHouse) {
                        this.farePartner = this.IbCheckPartnersDiscountsService.createPartnerDiscountFromDiscountResponse(discount);
                        this.userSuitableForPartnerDiscount = true;
                        this.model.passengersFormData.securityInfo.onHold.moreTimePrice !== 0 ? this.showPartnerFreeOnHold = true : angular.noop;
                    }
                }
            }
        }
    };

    deletePartnerDiscount = (discount, currency) => {
        const fareData = this.CommonsSessionStorageService.get<FareDataModel>('fareData');
        const datalayerEligibleVoucher = { EligibleVoucher: 'NO' };
        this.DatalayerUtilsService.addDigitalDataInfo(datalayerEligibleVoucher);
        this.NewMainHeaderFacade.deleteDiscountFromBasket(this.BookingAppConstants.DISCOUNT_TYPES.PARTNER);

        let price = fareData.offers[0].price.total + discount.totalDiscount;
        this.model.passengersFormData.securityInfo.totalPrice = this.CurrencyService.formatPrice(currency, price, true);
    };

    addPartnerDiscount = (discount, currency) => {
        let discountModel:any = {}, datalayerElegibleBono = { elegibleBono: 'SI' };
        discountModel.discount = discount.discount ? discount.discount : this.CurrencyService.formatPrice(currency, discount.totalDiscount, true);
        discountModel.originalDiscount = discount.totalDiscount;
        discountModel.totalDiscount = discount.totalDiscount;
        discountModel.type = this.BookingAppConstants.DISCOUNT_TYPES.PARTNER;
        discountModel.voucherId = discount.voucherId;
        discountModel.description = discount.description;
        this.DatalayerUtilsService.addDataLayerInfo(datalayerElegibleBono);
        this.NewMainHeaderFacade.addDiscountToBasket(discountModel);
        this.model.passengersFormData.securityInfo.totalPrice = this.model.passengersFormData.securityInfo.totalPriceWithDiscount;
    };

    savePassengersData = (persist: boolean) => {
        let passengerData = this.PassengeInfoUtilsService.transformPassengersToSave(this.model.passengersFormData.securityInfo);
        if (!this.isUserLogged && persist) {
            this.CommonsBrowserStorageService.set('passengersDataByCheck', passengerData);
            return;
        }
        this.CommonsSessionStorageService.set(BkiStorageConstants.PASSENGERS_FORM_DATA, passengerData);
        this.CommonsBrowserStorageService.remove('passengersDataByCheck');

    };

    checkIfExistsPassengersDataToLocalStorage = () => {
        let isResident = false, previousPassengersData:any;
        const browserStorageData = this.CommonsBrowserStorageService.get('passengersDataByCheck');
        const sessionStorageData = this.CommonsSessionStorageService.get(BkiStorageConstants.PASSENGERS_FORM_DATA);

        if (this.isUserLogged && !sessionStorageData) {
            return;
        }
        previousPassengersData = browserStorageData ??  sessionStorageData ?? {};

        if (Object.keys(previousPassengersData).length !== 0) {
            this.checkSavePassengersData = browserStorageData !== null;
            this.model.passengersFormData.securityInfo.contactData = previousPassengersData.contactData;
            this.setContactInfo(this.model.passengersFormData.securityInfo.contactData);
            isResident = this.model.passengersFormData.securityInfo.isResident;
            if(previousPassengersData?.contactData?.contactEmail) {
                this.checkEmailsConsent(previousPassengersData.contactData.contactEmail, previousPassengersData);
            }
            this.checkPassengersStorage(previousPassengersData, isResident);
            this.setPassengersDataToLocalStorage = true;
        }
    };

    setMandatoryDocsStorage = (existMandatoryDoc, oldDataPassenger, newDataPassenger) => {
        if (existMandatoryDoc && oldDataPassenger.mandatoryDocs.length > 0) {
            for (let i = 0; i < newDataPassenger.mandatoryDocs.length; i++) {
                const mandatoryDoc = newDataPassenger.mandatoryDocs[i];
                if (mandatoryDoc.code === oldDataPassenger.data.mandatoryDoc.code) {
                    newDataPassenger.data.mandatoryDoc = oldDataPassenger.data.mandatoryDoc;
                    mandatoryDoc.code === 'MR' && (newDataPassenger.data.birthDate = oldDataPassenger.data.birthDate);
                    
                }
            }
        }
    };

    setMunicipalityCodeStorage = (oldDataPassenger, newDataPassenger) => {
        if (newDataPassenger.requiredFields.hasOwnProperty('MUNICIPALITY_CODE') && oldDataPassenger.requiredFields.hasOwnProperty('MUNICIPALITY_CODE')) {
            for (let i = 0; i < newDataPassenger.requiredFields.MUNICIPALITY_CODE.values.length; i++) {
                const municipality = newDataPassenger.requiredFields.MUNICIPALITY_CODE.values[i];
                if (municipality.code === oldDataPassenger.data.residentDiscountInfo.municipalityCode) {
                    newDataPassenger.data.residentDiscountInfo = oldDataPassenger.data.residentDiscountInfo;
                    break;
                }
            }
        }
    };

    setLargeFamilyDiscountStorage = (oldDataPassenger, newDataPassenger) => {
        let largeFamilyDiscountCommunityCode = '', largeFamilyCommunityPattern = '';
        const hasLargeFamilyNumber = newDataPassenger.requiredFields.hasOwnProperty('LARGE_FAMILY_NUMBER') && oldDataPassenger.requiredFields.hasOwnProperty('LARGE_FAMILY_NUMBER');
        const hasCommunityCode = newDataPassenger.requiredFields.hasOwnProperty('COMMUNITY_CODE') && oldDataPassenger.requiredFields.hasOwnProperty('COMMUNITY_CODE');
        if ( hasLargeFamilyNumber && hasCommunityCode) {
            for (let i = 0; i < newDataPassenger.requiredFields.COMMUNITY_CODE.values.length; i++) {
                const comunity = newDataPassenger.requiredFields.COMMUNITY_CODE.values[i];
                if (comunity.code === oldDataPassenger.data.largeFamilyDiscountInfo.communityCode.code) {
                    largeFamilyDiscountCommunityCode = oldDataPassenger.data.largeFamilyDiscountInfo.communityCode;
                    largeFamilyCommunityPattern = oldDataPassenger.data.largeFamilyDiscountInfo.communityCodePattern;
                    break;
                }
            }
            newDataPassenger.data.largeFamilyDiscountInfo = {
                largeFamilyCertificateNumber: oldDataPassenger.data.largeFamilyDiscountInfo.largeFamilyCertificateNumber,
                communityCode: largeFamilyDiscountCommunityCode,
                communityCodePattern: largeFamilyCommunityPattern
            };
        }
    };

    setSurnameStorage = (oldDataPassenger, newDataPassenger, isResident) => {
        const existLastsurname = !!((oldDataPassenger.data.lastSurname?.length > 0 && oldDataPassenger.data.lastSurname !== ' '));
        const surname = oldDataPassenger.data.surname ?? '';
        const lastSurname = oldDataPassenger.data.lastSurname ?? '';

        if (isResident) {
            newDataPassenger.data.surname = surname;
            if (existLastsurname) {
                newDataPassenger.data.lastSurname = lastSurname;
            }
        } else {
            newDataPassenger.data.surname = existLastsurname ? `${surname} ${lastSurname}` : surname;
        }
    };

    setGenderAndObNumberStorage = (oldDataPassenger, newDataPassenger) => {
        const showGender = this.BookingPassengerInfoService.showGender( newDataPassenger.requiredFields) && this.BookingPassengerInfoService.showGender(oldDataPassenger.requiredFields);
        if (oldDataPassenger.data?.OBNumberSelected) {
            newDataPassenger.data.OBNumberSelected = oldDataPassenger.data.OBNumberSelected;
            newDataPassenger.data.OBNumberInfo = oldDataPassenger.data.OBNumberInfo;
        }
        if ( showGender && oldDataPassenger.data.hasOwnProperty('gender')) {
            newDataPassenger.data.gender = oldDataPassenger.data.gender;
        }
    };

    setBirthDateStorage = (oldDataPassenger, newDataPassenger) => {
        if (newDataPassenger.requiredFields.hasOwnProperty('BIRTH_DATE') && oldDataPassenger.data.hasOwnProperty('birthDate')) {
            newDataPassenger.data.birthDate = oldDataPassenger.data.birthDate;
        }
    };

    setFrequentFlyerStorage = (oldDataPassenger, newDataPassenger) => {
        newDataPassenger.data.freqFlyerInfo = oldDataPassenger.data.freqFlyerInfo ?? {};
        newDataPassenger.data.freqFlyerSelected = oldDataPassenger.data.freqFlyerSelected ?? false;
    };

    updatePassengerDataStorage = ({oldDataPassenger, newDataPassenger, isResident, objAdults, objInfant}) => {
        let existMandatoryDoc = newDataPassenger?.mandatoryDocs?.length !== 0;
        const optionalDocsList = Object.values(newDataPassenger?.optionalDocs || {});
        let existOptionalDoc = optionalDocsList.length > 0;
        if (newDataPassenger.data !== oldDataPassenger.data) {
            newDataPassenger.data.name = oldDataPassenger.data.name;
            newDataPassenger.data.personInCharge = oldDataPassenger.data.personInCharge;
            this.setFrequentFlyerStorage(oldDataPassenger, newDataPassenger);
            this.setSurnameStorage(oldDataPassenger, newDataPassenger, isResident);
            newDataPassenger.data = this.BookingUtilService.trunkateMaxLength(isResident, newDataPassenger.data);
            this.setBirthDateStorage(oldDataPassenger, newDataPassenger);
            this.setMunicipalityCodeStorage(oldDataPassenger, newDataPassenger);
            this.setLargeFamilyDiscountStorage(oldDataPassenger, newDataPassenger);
            this.setMandatoryDocsStorage(existMandatoryDoc, oldDataPassenger, newDataPassenger);
            this.IbBookingPassengerInfoUtilsService.setOptionalDocumentsStorage(existOptionalDoc, oldDataPassenger, newDataPassenger);
            this.setGenderAndObNumberStorage(oldDataPassenger, newDataPassenger);
            this.updatePasengerTypeStorage(oldDataPassenger, newDataPassenger, objAdults, objInfant);
        } else {
            newDataPassenger.data = oldDataPassenger.data;
        }
    };

    checkPassengersStorage = (previousPassengersData, isResident) => {
        let passengerInfoExisting:any = [],
            oldDataPassenger:any = null,
            newDataPassenger:any = null,
            objAdults = {},
            objInfant = {};
        for (let i = 0; i < this.model.passengersFormData.securityInfo.passengerInfo.length; i++) {
            passengerInfoExisting.push(previousPassengersData.passengers.find((passenger) => {
                return passenger.id === this.model.passengersFormData.securityInfo.passengerInfo[i].id;
            }));
            if (passengerInfoExisting[i] !== undefined) {
                if (this.model.passengersFormData.securityInfo.passengerInfo[i].id === passengerInfoExisting[i].id) {
                    newDataPassenger = angular.copy(this.model.passengersFormData.securityInfo.passengerInfo[i]);
                    oldDataPassenger = angular.copy(passengerInfoExisting[i]);
                    newDataPassenger.specialNeeds = oldDataPassenger.specialNeeds;
                    newDataPassenger.isSelected = oldDataPassenger.isSelected;
                    newDataPassenger.selectedFrequentlyPassenger = oldDataPassenger.selectedFrequentlyPassenger;
                    this.updatePassengerDataStorage({oldDataPassenger, newDataPassenger, isResident, objAdults, objInfant});

                    this.model.passengersFormData.securityInfo.passengerInfo[i] = newDataPassenger;
                }
            }
        }
    };

    updatePasengerTypeStorage = (oldDataPassenger, newDataPassenger, objAdults, objInfant) => {
        // Infant: person In Charge
        switch (newDataPassenger.type) {
                case this.BookingAppConstants.passengerTypes.senior:
                case this.BookingAppConstants.passengerTypes.adult:
                case this.BookingAppConstants.passengerTypes.young:
                case this.BookingAppConstants.passengerTypes.young_adult:
                    objAdults[newDataPassenger.id] = newDataPassenger;
                    break;
                case this.BookingAppConstants.passengerTypes.infant:
                    objInfant[newDataPassenger.id] = oldDataPassenger;
                    break;

                default:
                    break;
        }
    };

    newSpecialNeeds = (specialNeeds) => {
        const attri = ['specialGuideDog', 'specialHearing', 'specialVision', 'specialWheelchairValue', 'specialWheelchair'], auxSpecialNeeds:any = this.CommonsSessionStorageService.get('specialNeeds');
        if (!specialNeeds.isEnable) {
            specialNeeds.specialGuideDog = false;
            specialNeeds.specialHearing = false;
            specialNeeds.specialVision = false;
            specialNeeds.specialWheelchair = false;
        }
        for (const el of attri) {
            if (specialNeeds[el] !== auxSpecialNeeds[el]) {
                return true;
            }
        }
        return false;
    };


    newGenderSelected  = (gender) => {
        const exitCondition = !(this.iTravelChecked && this.BookingPassengerInfoService.showGender(this.model.passengersFormData.securityInfo.passengerInfo[0].requiredFields));
        if(exitCondition){ 
            return false;
        }
        const auxCustomerData:any = this.CommonsSessionStorageService.get('customerData');
        const oldGenderData = auxCustomerData.personalInfo.gender?.toUpperCase();
        if(gender !== oldGenderData){
            return true;
        }
        return false;
    };

    /**
     * Check if the user data must be saved and show a modal to ask the user before saving the data if the user agrees
     * @returns Reject promise if user doesn't want to save data, otherwise resolve promise
     */
    saveLoggedUserData = () => {
        const taskProm = {
            promSpeciaNeeds: this.newSpecialNeeds(this.model.passengersFormData.securityInfo.passengerInfo[0].specialNeeds),
            promPersonalData: this.newGenderSelected(this.model.passengersFormData.securityInfo.passengerInfo[0].data.gender)
        };

        return new Promise<void>((resolve, reject) => {
            const promises:Promise<any>[] = [];
            if ( taskProm.promSpeciaNeeds || taskProm.promPersonalData) {
                const saveLiterals = this.CommonsUserUtilsService.isIbPlus() ? this.BookingPassengerInfoConstants.SAVE_MODAL_LITERALS : this.BookingPassengerInfoConstants.SAVE_MODAL_LITERALS_IBZERO;
                this.BookingModalService.showGenericModal(false, 'generic-complete-modal.html', saveLiterals, null).result.then(
                    () => {
                        this.DatalayerUtilsService.updateDatalayerEvents(DatalayerConstants.SURE_MODAL.EVENT_CATEGORY, DatalayerConstants.SURE_MODAL.EVENT_ACTION, DatalayerConstants.SURE_MODAL.EVENT_LABEL_SAVE);
                        taskProm.promSpeciaNeeds ? promises.push(this.BookingPassengerInfoService.updateTravPreferences(this.model.passengersFormData.securityInfo.passengerInfo[0].specialNeeds)) : angular.noop;
                        taskProm.promPersonalData ? promises.push(this.BookingPassengerInfoService.updatePersonalData(this.model.passengersFormData.securityInfo.passengerInfo[0].data.gender)) : angular.noop;
                        Promise.all(promises).then(() => {
                            this.DatalayerUtilsService.updateDatalayerEvents(DatalayerConstants.SURE_MODAL.EVENT_CATEGORY, DatalayerConstants.SAVE_ACCEPT_LITERALS.EVENT_ACTION, DatalayerConstants.SAVE_ACCEPT_LITERALS.EVENT_LABEL_OK);
                        }, () => {
                            this.DatalayerUtilsService.updateDatalayerEvents(DatalayerConstants.SURE_MODAL.EVENT_CATEGORY, DatalayerConstants.SAVE_ACCEPT_LITERALS.EVENT_ACTION, DatalayerConstants.SAVE_ACCEPT_LITERALS.EVENT_LABEL_KO);
                            this.CommonsSessionStorageService.set('savePassengerPreferencesResponse',
                                {title: this.$filter('translate')( this.CommonsUserUtilsService.isIbPlus()? this.BookingPassengerInfoConstants.SAVE_ERROR_LITERALS_IBP.title:  this.BookingPassengerInfoConstants.SAVE_ERROR_LITERALS_ZERO.title),
                                    body: this.$filter('translate')(this.CommonsUserUtilsService.isIbPlus()? this.BookingPassengerInfoConstants.SAVE_ERROR_LITERALS_IBP.message: this.BookingPassengerInfoConstants.SAVE_ERROR_LITERALS_ZERO.message)});
                        });
                        resolve();
                    }, () => {
                        this.DatalayerUtilsService.updateDatalayerEvents(DatalayerConstants.SURE_MODAL.EVENT_CATEGORY, DatalayerConstants.SURE_MODAL.EVENT_ACTION, DatalayerConstants.SURE_MODAL.EVENT_LABEL_DONT_SAVE);
                        reject();
                    }
                );
            } else {
                reject();
            }
        });
    };



    checkChanges = (event, onHold = false) => {
        const isUserLoggedFull = this.isUserLogged === true && this.isIbPlus && !this.isSoftUser;
        if (isUserLoggedFull) {
            this.saveLoggedUserData().finally(() => { this.passengersCompleted(onHold); });
        }else{
            this.passengersCompleted(onHold);
        }
    };

    checkEmailsConsent = (emailData, previousPassengersData) => {
        const emailConsentRequest:any = {};
        const flowId = this.CommonsSessionStorageService.get<any>('fareData').responseId;
        const offerId = this.CommonsSessionStorageService.get<any>('fareData').offers[0].offerItems[0].offerItemId;
        let hasPreviousData = false;
        if (!this.metaURL) return;
        emailConsentRequest.offerId = offerId;
        emailConsentRequest.shoppingId = flowId;
        emailConsentRequest.email = emailData;
        emailConsentRequest.url = this.metaURL.recoveryLink;
        if(previousPassengersData && previousPassengersData.passengers[0] && !this.isUserLogged && this.checkSavePassengersData) {
            hasPreviousData = true;
        }else{
            hasPreviousData = false;
        }
        emailConsentRequest.name = hasPreviousData ? previousPassengersData.passengers[0].data.name : this.model.passengersFormData.securityInfo.passengerInfo[0].data.name || '';
        emailConsentRequest.surname = hasPreviousData ? previousPassengersData.passengers[0].data.surname : this.model.passengersFormData.securityInfo.passengerInfo[0].data.surname || '';
        if(hasPreviousData) {
            if(emailConsentRequest.surname && previousPassengersData.passengers[0].data.lastSurname) {
                emailConsentRequest.surname = previousPassengersData.passengers[0].data.surname + ' ' + previousPassengersData.passengers[0].data.lastSurname;
            }else if(previousPassengersData.passengers[0].data.lastSurname) {
                emailConsentRequest.surname = previousPassengersData.passengers[0].data.lastSurname;
            }
        }else{
            if(emailConsentRequest.surname && this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname) {
                emailConsentRequest.surname = this.model.passengersFormData.securityInfo.passengerInfo[0].data.surname + ' ' + this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname;
            }else if(this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname) {
                emailConsentRequest.surname = this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname;
            }
        }
        emailConsentRequest.phone = this.model.passengersFormData.securityInfo.contactData.contactPhone || '';
        if(emailData === this.lastEmailConsentRequest) {
            return;
        }
        this.disableLightboxConsentButton(true);
        this.BookingPassengerInfoService.checkEmailConsent(emailConsentRequest).then((response) => {
            if(response) {
                this.lastEmailConsentRequest = emailData;
                this.showLostShoppingCartLightbox = false;
            }
        }, (error) => {
            if(error && error.errorCode && error.errorCode === 404) {
                this.lastEmailConsentRequest = emailData;
                this.showConsentLightbox();
            }
        });
    };

    showConsentLightbox = () => {
        this.disableLightboxConsentButton(false);
        this.showLostShoppingCartLightbox = true;
    };

    acceptEmailConsent = () => {
        this.showLostShoppingCartLightbox = false;
        this.insertEmailsConsent();
    };

    closeEmailConsentLightbox = () => {
        this.showLostShoppingCartLightbox = false;
    };

    insertEmailsConsent = () => {
        const insertEmailConsentRequest:any = {};
        const flowId = this.CommonsSessionStorageService.get<any>('fareData').responseId;
        const offerId = this.CommonsSessionStorageService.get<any>('fareData').offers[0].offerItems[0].offerItemId;
        insertEmailConsentRequest.offerId = offerId;
        insertEmailConsentRequest.shoppingId = flowId;
        insertEmailConsentRequest.url = this.metaURL.recoveryLink;
        insertEmailConsentRequest.email = this.model.passengersFormData.securityInfo.contactData.contactEmail;
        insertEmailConsentRequest.name = this.model.passengersFormData.securityInfo.passengerInfo[0].data.name || '';
        insertEmailConsentRequest.surname = this.model.passengersFormData.securityInfo.passengerInfo[0].data.surname || '';
        if(insertEmailConsentRequest.surname && this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname) {
            insertEmailConsentRequest.surname = this.model.passengersFormData.securityInfo.passengerInfo[0].data.surname + ' ' + this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname;
        }else if(this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname) {
            insertEmailConsentRequest.surname = this.model.passengersFormData.securityInfo.passengerInfo[0].data.lastSurname;
        }
        insertEmailConsentRequest.phone = this.model.passengersFormData.securityInfo.contactData.contactPhone || '';
        if(insertEmailConsentRequest.email && insertEmailConsentRequest.url && insertEmailConsentRequest.offerId && insertEmailConsentRequest.shoppingId) {
            this.BookingPassengerInfoService.insertEmailConsent(insertEmailConsentRequest).then((response) => {
                if(response) {
                    this.showLostShoppingCartLightbox = false;
                }
            }, this.insertEmailConsentFailed);
        }else{
            return;
        }
    };

    insertEmailConsentFailed = () => {
        this.showLostShoppingCartLightbox = false;
    };

    emailsAreInvalid = (event) => {
        this.showLostShoppingCartLightbox = false;
        this.lastEmailConsentRequest = '';
    };

    disableLightboxConsentButton = (disable) => {
        this.$timeout(() => {
            this.lostShoppingCartLightbox.actionButtonDisabled = disable;
        });
    };

    checkScrollToError = () => {
        let firstInvalid, firstFormInvalid, referenceElement, errorPassengersWarningMessage;
        firstInvalid = angular.element(this.$document).find('.ng-invalid').first();
        firstFormInvalid = angular.element<any>(document.querySelector('div.col-xs-12 form[name=\'bookingPassengersInfoCtrl.passInfoForm\']')).find('.ng-invalid').first();
        referenceElement = firstInvalid[0] && firstInvalid[0].tagName !== 'FORM' ? firstInvalid : firstFormInvalid;
        errorPassengersWarningMessage = angular.element('body').find('#warning_check_alert');
        if(errorPassengersWarningMessage && errorPassengersWarningMessage[0] && !errorPassengersWarningMessage[0].checked) {
            referenceElement = errorPassengersWarningMessage;
        }
        if (referenceElement.length > 0) {
            this.$timeout(() => {
                angular.element('html, body').animate({ scrollTop: referenceElement.offset().top - (this.adaptativeMobileFlow ? 20 : document.querySelector<any>('.ib-header--basket-group').offsetHeight + 20) });
            });
        }
    };

    showIbPlusUserWarning = () => {
        const isRedemption = this.CommonsSessionStorageService.get('searchFlightType') === 'redemptionFlight' || this.CommonsSessionStorageService.get('isRedemptionFlow');
        const isONB = this.CommonsSessionStorageService.get('userLogged') === 'ONB';
        if (this.isUserLogged && this.isIbPlus && !this.isSoftUser && (isONB || isRedemption))
            this.showIbPlusUserDataWarning = true;
    };
    onResize = () => {
        this.adaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
    };

    $onInit = this.activate;

    private showSuggestLoginModal = ( ) => {
        const modalOptions = {
            modalBlocked: true,
            windowClass: 'ib-modals bki-dialog'
        };
        const modalRef = this.IbCModalService.showGenericComponentModal( IbSuggestLoginModalComponent, modalOptions);
        modalRef.result.catch(() => { this.showLoginForm = false;});
        return modalRef;
    };

    public checkToShowSuggestLoginModal = () => {
        const flag: SuggestLoginType = this.CommonsSessionStorageService.get( 'suggestLogin' );
        if ( !flag || this.isUserLogged ) return;
        const showSuggestionMap = this.PassengeInfoUtilsService.getShowSuggestionMap(flag);
        this.PassengeInfoUtilsService.showIfApplicable(showSuggestionMap, this.showSuggestLoginModal);
    };

    setRegisterFormValid = (isValid: boolean) =>{
        this.registerFormValid = isValid;
    };

    setContactFormValid = (isValid: boolean) => {
        this.contactFormValid = isValid;
    };

    setPassengerFormValid = (event) => {
        let {isValid, passForm, index} = event;
        this.passengerFormsValidity[index] = isValid;

        const totalPassengers = this.model.passengersFormData?.securityInfo?.passengerInfo?.length || 0;
        const validPassengersCount = Object.keys(this.passengerFormsValidity).length;
        const allPassengersValid = Object.values(this.passengerFormsValidity).every(Boolean);

        this.passengerFormValid = totalPassengers > 0 && validPassengersCount === totalPassengers && allPassengersValid;
        this.setPassFormData(passForm, index);
    };

    handleBirthDateFormValidChanged = (data: { isValid: boolean, index: number }) => {
        this.birthDateFormsValidity[data.index] = data.isValid;

        const totalPassengers = this.model.passengersFormData?.securityInfo?.passengerInfo?.length || 0;
        const validBirthDatesCount = Object.keys(this.birthDateFormsValidity).length;
        const allBirthDatesValid = Object.values(this.birthDateFormsValidity).every(Boolean);

        this.birthDateFormValid =
        totalPassengers > 0 &&
        validBirthDatesCount === totalPassengers &&
        allBirthDatesValid;
    };

    handleEventLightBox = (event:string) =>{
        if(event === this.lostShoppingCartLightbox.action.callback){
            this.acceptEmailConsent();
        } else if(event === this.lostShoppingCartLightbox.closeAction){
            this.closeEmailConsentLightbox();
        }
    };

    updateLoyaltyEarnedPoints = (avios: number, elitePoints:number) => {
        if ( avios!== 0 || elitePoints !== 0) {
            this.loyaltyEarnInfo = { avios, elitePoints, programName : this.CommonsUserUtilsService.isIbZero() ? 'IBZERO' : 'IBPLUS' };
        } else {
            this.loyaltyEarnInfo = null;
        }
    };

    setContactDataObs = () =>{
        this.setContactInfo(this.model.passengersFormData.securityInfo.contactData);
        this.contactDataSubs.add(
            this.IbBookingContactFormDataService.email$.subscribe(email=>{
                this.model.passengersFormData.securityInfo.contactData.contactEmail = email;
            })
        );
        this.contactDataSubs.add(
            this.IbBookingContactFormDataService.prefix$
                .pipe(filter(prefix => prefix != null))
                .subscribe(prefix => this.updateContactPrefix(prefix))
        );
        this.contactDataSubs.add(
            this.IbBookingContactFormDataService.phone$.subscribe(phone=>{
                this.model.passengersFormData.securityInfo.contactData.contactPhone = phone;
            })
        );
        this.contactDataSubs.add(
            this.IbBookingContactFormDataService.denyNews$.subscribe(denyNews=>{
                this.model.passengersFormData.securityInfo.contactData.denyNewsLetters = denyNews;
            })
        );
    };

    updateContactPrefix (prefix: any): void {
        this.model.passengersFormData.securityInfo.contactData.contactPrefix = prefix;
    }

    setContactInfo = (contactData:ContactData) => {
        this.IbBookingContactFormDataService.setEmail(contactData?.contactEmail ?? '');
        this.IbBookingContactFormDataService.setPrefix(contactData?.contactPrefix ?? null);
        this.IbBookingContactFormDataService.setPhone(contactData?.contactPhone ?? '');
        this.IbBookingContactFormDataService.setDenyNews(contactData?.denyNewsLetters ?? false);
    };

    resetPersonInCharge = (index) =>{
        this.model.passengersFormData.securityInfo.passengerInfo[index].data.personInCharge = null;
        this.model.passengersFormData = Object.assign({}, this.model.passengersFormData);
    };

    setPassFormData = (passForm: FormGroup, index: number) => {
        this.model.passengersFormData.securityInfo.passengerInfo[index].data = {
            ...this.model.passengersFormData.securityInfo.passengerInfo[index].data,
            name: passForm.get(`name_${index}`).value,
            surname: passForm.get(`first_surname_${index}`).value,
            lastSurname: passForm.get(`last_surname_${index}`).value,
            mandatoryDoc: this.IbBookingPassengerInfoUtilsService.setMandatoryDocData(passForm, index),
            optionalDoc: this.IbBookingPassengerInfoUtilsService.setOptionalDocumentsData(passForm, index),
            residentDiscountInfo: passForm.get(`municipalityCode_${index}`).value !== '' ? {
                municipalityCode : passForm.get(`municipalityCode_${index}`).value?.code
            }: null,
            largeFamilyDiscountInfo: this.IbBookingPassengerInfoUtilsService.setLargeFamilyDiscountData(passForm, index),
            gender: passForm.get(`gender_${index}`).value,
            freqFlyerInfo: this.IbBookingPassengerInfoUtilsService.setFrequentFlyerData(passForm, index),
            freqFlyerSelected: passForm.get(`check_ff_${index}`).value,
            OBNumberSelected: passForm.get(`check_obn_${index}`).value,
            OBNumberInfo: passForm.get(`businessCodeType_${index}`)?.get('code')?.value !== '' && passForm.get(`ob_number_card_${index}`).value ? {
                businessCodeType: passForm.get(`businessCodeType_${index}`).value,
                number: passForm.get(`ob_number_card_${index}`).value
            }: null,
            personInCharge: passForm.get(`personInCharge_${index}`).value !== '' ? passForm.get(`personInCharge_${index}`).value : null
        };
    };

    handleFillResidentCheck = (checkInfo) =>{
        this.fillResidentChecked = checkInfo;
    };

    handleFillLargeFamilyCheck = (checkInfo) =>{
        this.fillLargeFamilyChecked = checkInfo;
    };

    showLargeFamilyText = () =>{
        const largeFamilyType = this.model.passengersFormData?.securityInfo?.passengerInfo[0]?.data?.largeFamilyType;
        if(largeFamilyType === 'LARGE_FAMILY_GENERAL_TYPE')
            return 'HEADER_ADVANCED_SEARCH_FAMILY_GENERAL';
        else if (largeFamilyType === 'LARGE_FAMILY_SPECIAL_TYPE'){
            return 'HEADER_ADVANCED_SEARCH_FAMILY_SPECIAL';
        }
        return;
    };

}
