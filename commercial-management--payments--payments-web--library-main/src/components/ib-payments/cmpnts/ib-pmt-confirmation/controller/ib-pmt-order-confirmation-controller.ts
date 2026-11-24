import angular from 'angular';
import { IbPmtConfirmationCarbonFootprintModel } from '../cmpnts/ib-pmt-confirmation-carbon-footprint/ib-pmt-confirmation-carbon-footprint-model';
import { CommonsBrowserStorageService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { injectIbPmtStylesHost } from '../../../../../styles/ib-pmt-styles-host';

import {
    bindDependencies,
    initFieldsBeforeActivate,
    initConfirmationState
} from './partials/ib-pmt-order-confirmation-controller.init';
import {
    isWidgetMountFlow,
    isWidgetCityAllowed,
    isEuroPayment,
    isWidgetLanguage
} from './partials/ib-pmt-order-confirmation-controller.widget';
import {
    checkPayMethodAndVouchers,
    checkAviosUsed,
    canAddVoluntaryOrderInfo
} from './partials/ib-pmt-order-confirmation-controller.pay-datalayer';
import {
    calculateFrequencyDisplay,
    isFrequentFlyer
} from './partials/ib-pmt-order-confirmation-controller.frequent-flyer';
import {
    initConfirmationModel,
    readConfirmationStorage,
    syncShuttleFlowFlag,
    syncRedemptionFlowFlag,
    syncPointsObFlowFlag,
    broadcastBidsConfirmation,
    setInsuranceBanner,
    rememberConfirmationStep
} from './partials/ib-pmt-order-confirmation-controller.activate-state';
import {
    applyHeaderVisibility,
    openConfirmationWaiting,
    saveNewsletterForAnonymousBooking,
    resetOnholdHeaderCurrency
} from './partials/ib-pmt-order-confirmation-controller.activate-header';
import {
    loadConfirmationByFlow,
    addVoluntaryChangeOrderInfo
} from './partials/ib-pmt-order-confirmation-controller.activate-flow';
import { collectFlightSummary } from './partials/ib-pmt-order-confirmation-controller.closing';
import {
    applyHolaMadridFlow,
    readAllianzContract,
    addDigitalDataUnlessOnHold
} from './partials/ib-pmt-order-confirmation-controller.hola-madrid';
@Controller('ib-pmt-order-confirmation-module',
    ['$rootScope', '$scope', 'PmtModalService', '$window', '$filter', 'PmtOrderConfirmationService', 'DatalayerUtilsService', 'DatalayerEcommerceUtilsService', 'PmtDatalayerConstants', 'PmtUtilsService', 'PmtConstants', 'localStorageService', '$timeout', 'MonetateUtilsService', 'PmtDatalayerUtilsService', 'NewMainHeaderFacade', 'DatalayerEcommerceConstants', 'CommonsUtilService', '$interval', 'DigitalDataService', 'DatalayerMMBConstants', '$compile', '$sce', '$document', 'DatalayerGeneralConstants', 'CommonsConstants', 'DatalayerConstants', 'CommonsSessionStorageService', 'DatalayerBKIConstants', 'CommonsBrowserStorageService', 'CommonsUserUtilsService', 'CommonsAncillariesService'], [])
export class PmtConfirmationController {
    public model: any;
    public ibPayTrace: any;
    public flowApp: any;
    public MODAL_WARN_ABOUT_LEAVING = 'ib-modal-important-announcement.html';
    public aviosToEarn = null;
    public elitePointsToEarn = null;
    public urlCki = '';
    public LOGIN_ONB;
    public APP_TYPES;
    public isRegister;
    public isRegisterSuccesfull;
    public isVoluntaryChangeView;
    public isVoluntaryChange:boolean = false;
    public isShuttleFlow;
    public insuranceLink;
    public showInsuranceBanner;
    public reactWitgetModel;
    public transferWitgetModel;
    public listLocationWitget: string[];
    public tokenWidget;
    public warning;
    public flags;
    public flightList = [];
    public numPax = 0;
    public isErrorDeleteAll: boolean;
    public isAviosBidAvailable: boolean;
    public flightAviosInfo;
    public recoglobickActivitiesBki: boolean = false;
    public recoglobickTransferBki: boolean;
    public isPaymentWithAvios: boolean;
    public CalculatedPoints;
    public isEmptyBasket;
    public attendanceVouchers;
    public showWineClubBanner = false;
    public showCarbonFootprintBanner = false;
    public holaMadridFlow: boolean = false;
    public co2InfoBannerModel: IbPmtConfirmationCarbonFootprintModel;
    public upgradingBidsInfo: any;
    public showAvis: boolean;
    public paymentViewType: string = null;
    public newPaymentViewType: boolean = false;
    public isIbZero: boolean;
    public appLang:string;
    public appMarket:string;
    public urlUpgrade:string;
    allianzFusionContractNumber:string = '';
    isGlobickActivities: any;
    $rootScope: any;
    $scope: any;
    PmtModalService: any;
    $window: any;
    $filter: any;
    PmtOrderConfirmationService: any;
    DatalayerUtilsService: any;
    DatalayerEcommerceUtilsService: any;
    PmtDatalayerConstants: any;
    PmtUtilsService: any;
    PmtConstants: any;
    localStorageService: any;
    $timeout: any;
    MonetateUtilsService: any;
    PmtDatalayerUtilsService: any;
    NewMainHeaderFacade: any;
    DatalayerEcommerceConstants: any;
    CommonsUtilService: any;
    $interval: any;
    DigitalDataService: any;
    DatalayerMMBConstants: any;
    $compile: any;
    $sce: any;
    $document: any;
    DatalayerGeneralConstants: DatalayerGeneralConstantsType;
    CommonsConstants: CommonsConstantsType;
    DatalayerConstants: DatalayerConstantsType;
    CommonsSessionStorageService: CommonsSessionStorageService;
    DatalayerBKIConstants: any;
    CommonsBrowserStorageService: CommonsBrowserStorageService;
    CommonsUserUtilsService: CommonsUserUtilsService;
    CommonsAncillariesService: any;
    isBKIApp: boolean = false;
    public isMMBBID_AVIOS: boolean;
    public isPetPurchased: boolean = false;
    public isCheckinAndDSTFlow: boolean = false;
    public isUMFlight: boolean = false;
    public travelRequirementsUrl: string = '';
    public manageMyBookingUrl: string = '';
    public $onInit: any;
    constructor (...injected: unknown[]) {
        bindDependencies(this, injected);
        initFieldsBeforeActivate(this);
        this.$onInit = this.activate();
        initConfirmationState(this);
    }

    expiredTokenCallbackTransfer = () => {
        this.initTransferWidget();
    };
    checkIsPro = () => {
        let env: string = '';
        const widgetProMonetate = this.localStorageService.get('widgetProMonetate');
        const envCopy: any = {};
        (<any>Object).assign(envCopy, (<any>window).env);
        if(envCopy.production || widgetProMonetate) {
            env = 'prod';
        }else {
            env = 'test';
        }

        return env;
    };

    generateTransferWitgetModel = () => {
        let transferWitgetModel: any = {};
        const summaryInfo = this.localStorageService.get('summaryInfo');

        if(summaryInfo?.context) {
            this.localStorageService.set('clientBookingId', this.model.confirmationInfo.pnr + '-' + summaryInfo.context.bookingDate.split(' ')[0].replaceAll('-', ''));
        }

        const generate = () => {
            return this.CommonsUtilService.sha256(this.localStorageService.get('clientBookingId')).then((hash) => {
                transferWitgetModel = {
                    env: this.checkIsPro(),
                    token: this.tokenWidget,
                    clientBookingId: hash,
                    pickupLocation: this.model.confirmationInfo.slices[0].segments[this.model.confirmationInfo.slices[0].segments.length - 1].arrival.code, //es obligatorio y se debe de poner un aeropuerto y es el codigo del aeropuerto de destino
                    outboundTripDateTime: this.model.confirmationInfo.slices[0].segments[this.model.confirmationInfo.slices[0].segments.length - 1].arrivalDate.formatedDate.replaceAll(' ', 'T'),
                    airline: this.model.confirmationInfo.slices[0].segments[this.model.confirmationInfo.slices[0].segments.length - 1].marketingCarrier.code,
                    flightNumber: this.model.confirmationInfo.slices[0].segments[this.model.confirmationInfo.slices[0].segments.length - 1].flightNumber,
                    returnTripDateTime: null,
                    returnAirline: null,
                    returnFlightNumber: null,
                    language: this.generateLanguage(),
                    currency: this.getCurrency(),
                    currencyExchange: null,
                    travellers: this.generateTravellers(),
                    getTransferSearchCallback: null,
                    postOrderCallback: null,
                    confirmOrderCallback: this.PmtOrderConfirmationService.confirmTransferOrderCallback,
                    mountLocation: this.generateMountLocation()
                };
                if(this.model.confirmationInfo.slices[1]) {
                    transferWitgetModel.returnTripDateTime = this.model.confirmationInfo.slices[1].segments[this.model.confirmationInfo.slices[1].segments.length - 1].departureDate.formatedDate.replaceAll(' ', 'T');
                    transferWitgetModel.returnAirline = this.model.confirmationInfo.slices[1].segments[this.model.confirmationInfo.slices[1].segments.length - 1].marketingCarrier.code;
                    transferWitgetModel.returnFlightNumber = this.model.confirmationInfo.slices[1].segments[this.model.confirmationInfo.slices[1].segments.length - 1].flightNumber;
                }
                this.localStorageService.set('clientBookingIdTransfer', hash);
                return transferWitgetModel;

            });
        };

        return generate().then((transferWitgetModel) => {
            return transferWitgetModel;
        });
    };

    initTransferWidget = () => {
        if(this.checkShowWidget(true) && this.recoglobickTransferBki) {
            this.recoglobickTransferBki = true;
        } else {
            this.recoglobickTransferBki = false;
        }
    };

    generateListWidget = () => {
        let list = this.PmtConstants.allowCitiesWinget;
        return list;
    };

    getTokenWidget = () => {
        this.PmtOrderConfirmationService.getTokenWidget(true).then((response) => {
            this.tokenWidget = response.data.access_token;
            this.generateReactWidgetModel().then((widgetModel) => {
                this.$window.RecoglobickActivitiesWidget.unmount();
                this.DatalayerUtilsService.updateDatalayerEvents('confirmationWidgetActivitiesBKI', 'view', this.model.confirmationInfo.pnr + '_' + widgetModel.clientBookingId);
                this.$window.RecoglobickActivitiesWidget.mount(widgetModel);
                this.recoglobickActivitiesBki = true;
            });
        });
    };
    postOrderCallback () {}
    getRecommendationCallback = () => {};

    checkNumberOfPassenger = () => {
        let numberOfPassenger = 0;
        Object.keys(this.model.confirmationInfo.summaryInfo.passengers.generalData).forEach(key => {
            numberOfPassenger = numberOfPassenger + this.model.confirmationInfo.summaryInfo.passengers.generalData[key][0].number;
        });
        return numberOfPassenger;
    };

    checkWithChildren = () => {
        let withChildren = false;
        Object.keys(this.model.confirmationInfo.summaryInfo.passengers.generalData).forEach(key => {
            if (key === 'CHILD' || key === 'INFANT') {
                withChildren = true;
            }
        });
        return withChildren;
    };

    generateLanguage = () => {
        let confirmationDatalayerInfo = this.localStorageService.get('confirmationDigitalInfo');
        let languageAndMarket;
        if(confirmationDatalayerInfo.Language === 'es' ) {
            languageAndMarket = confirmationDatalayerInfo.Language + '-' + 'ES';
        }else if(confirmationDatalayerInfo.Language === 'en' ) {
            languageAndMarket = confirmationDatalayerInfo.Language + '-' + 'US';
        }else if(confirmationDatalayerInfo.Language === 'zh' ) {
            languageAndMarket = confirmationDatalayerInfo.Language + '-' + 'CN';
        }
        return languageAndMarket;
    };

    generateMountLocation = () => {
        const flowName = this.$rootScope.flowName;
        if (isWidgetMountFlow(this, flowName)) {
            return flowName;
        }
        return '';
    };

    getCurrency = () => {
        let paymentsInfo = this.localStorageService.get('paymentsInfo');
        let currency = paymentsInfo.currency.code;
        return currency;
    };

    checkBusinessTrip = () => {
        let UserLogged = this.localStorageService.get('userLogged');
        let isBusinessTrip = false;
        if(UserLogged === 'ONB') {
            isBusinessTrip = true;
        }
        return isBusinessTrip;
    };

    generateTravellers = () => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        let listTravellers = [];
        let travellerTemp = {};
        Object.keys(bookingInfo.passengers).forEach(key => {
            travellerTemp = {};

            travellerTemp = {
                name: bookingInfo.passengers[key].personalInfo.name,
                surname:  bookingInfo.passengers[key].personalInfo.surname,
                email:  '',
                dob:  bookingInfo.passengers[key].personalInfo.birthDate,
                address: '',
                country: '',
                countryPhoneCode: '',
                phone: '',
                countryMobileCode: '',
                mobile: '',
                language: '',
                nationality: '',
                passport: '',
                expenditureDate: '',
                expirationDate: '',
                zipCode: '',
                pickupLocation: ''
            };
            listTravellers.push(travellerTemp);
        });
        return listTravellers;
    };

    expiredTokenCallback = () => {
        this.getTokenWidget();
    };

    generateReactWidgetModel = () => {
        let widgetModel: any = {};
        const summaryInfo = this.localStorageService.get('summaryInfo');
        if(summaryInfo?.context) {
            this.localStorageService.set('clientBookingId', this.model.confirmationInfo.pnr + '-' + summaryInfo.context.bookingDate.split(' ')[0].replaceAll('-', ''));
        }
        const generate = () => {
            return this.CommonsUtilService.sha256(this.localStorageService.get('clientBookingId')).then((hash) => {
                widgetModel = {
                    env: this.checkIsPro(),
                    token: 'Bearer' + ' ' + this.tokenWidget,
                    clientBookingId: hash,
                    startDate: this.model.confirmationInfo.slices[0].segments[0].departureDate.formatedDate.split(' ')[0],
                    endDate: null,
                    location: this.PmtOrderConfirmationService.locationForWidget(this.model.confirmationInfo.slices[0].segments[this.model.confirmationInfo.slices[0].segments.length - 1].arrival.code),
                    totalTickets: this.checkNumberOfPassenger(),
                    businessTrip:  this.checkBusinessTrip(),
                    withChildren: this.checkWithChildren(),
                    ages: null,
                    language: this.generateLanguage(),
                    currency: this.getCurrency(),
                    currencyExchange: null,
                    gaTrackingCode: 'test',
                    travellers: this.generateTravellers(),
                    postOrderCallback: this.postOrderCallback,
                    getRecommendationCallback: this.getRecommendationCallback,
                    confirmOrderCallback: this.PmtOrderConfirmationService.confirmOrderCallback
                };

                if(this.model.confirmationInfo.slices.length === 2){
                    widgetModel.endDate =  this.model.confirmationInfo.slices[1].segments[0].arrivalDate.formatedDate.split(' ')[0];
                }
                this.localStorageService.set('clientBookingIdActivities', hash);
                return widgetModel;

            });
        };
        return generate().then((widgetModel) => {
            return widgetModel;
        });
    };

    checkShowWidget = (showExperiences: boolean) => {
        const confirmationDatalayerInfo = this.localStorageService.get('confirmationDatalayerInfo');
        const language = confirmationDatalayerInfo.idioma;
        if (this.flowApp !== 'BBKI') {
            return false;
        }
        if (!(this.model.confirmationInfo.slices.length < 3)) {
            return false;
        }
        if (!isWidgetCityAllowed(this)) {
            return false;
        }
        if (!isEuroPayment(this)) {
            return false;
        }
        if (!isWidgetLanguage(this, language)) {
            return false;
        }
        return !!showExperiences;
    };

    initRecommendAppWidget = () => {
        if(this.isGlobickActivities) {
            this.recoglobickActivitiesBki = true;
        }
    };

    registerGlobickClick (): void {
        this.CommonsAncillariesService.registerClickGlobickProduct('EXP');
        this.redirectToMMB();
    }

    /**
     * Redirect to MMB
     */
    redirectToMMB = () => {
        let bookingInfo = this.localStorageService.get('bookingInfo');
        if (this.checkIfHasActivitie) {
            sessionStorage.setItem('globickActivitieBuyed', 'true');
        }
        this.resetHeaderModel();
        let url = `${this.$window.location.pathname}?pnr=${this.model.confirmationInfo.pnr}&surname=${bookingInfo?.passengers[0].personalInfo.surname}#!/ohmtdt`;
        this.$window.open(url, '_self');
    };

    resetHeaderModel = () => {
        this.localStorageService.remove('headerModel');
    };

    checkIfHasActivitie = () => {
        let haveActivitie: boolean = false;
        const headerModel:any = this.CommonsSessionStorageService.get('headerModel');
        if (headerModel.headerModel.shoppingBasket.globickActivities.hasActivitiesGlobick) {
            haveActivitie = true;
        }
        return haveActivitie;
    };

    /**
     * Open window to print confirmation document  info
     */
    printSummary = () => {
        this.$window.print();
    };

    /**
    * Open the modal with all the information of the flight rates
    * @param {Event} openSummaryModalTaxesEvent Event to lunch function
    * @param {String} modalTemplate The html file of the modal
    * @param {Object} model All the necessary information to show the modal
    */
    openSummaryModalTaxes = (event, modalTemplate, model) => {
        model = model || {};
        if(this.$rootScope.isRedemptionFlow){
            const redemptionOptionId = this.localStorageService.get('selectedFareRedemptionData')?.redemptionOptionId;
            model = this.PmtOrderConfirmationService.cleanTaxes(model, redemptionOptionId);
        }
        angular.extend(model, { 'idModal': modalTemplate });
        this.PmtModalService.showGenericModal(false, modalTemplate, model).result.then(angular.noop, angular.noop);
    };

    /**
     *  Open the modal with all the information
     * @param {Event} openSummaryModalLinksEvent Event to lunch function
     * @param {*} modalTemplate The html file of the modal
     * @param {*} model All the necessary information to show the modal
     */
    openSummaryModalLinks = (event, modalTemplate, model) => {
        model = model || {};
        angular.extend(model, { 'idModal': modalTemplate });
        this.PmtModalService.showGenericModal(false, modalTemplate, model).result.then(angular.noop, angular.noop);
    };

    redirectToCheckIn = ($event) => {
        $event.stopPropagation();
        $event.preventDefault();
        this.$window.open(this.urlCki, '_blank');
    };

    public updateDatalayerInformation = () => {
        checkPayMethodAndVouchers(this);
        checkAviosUsed(this);
        this.DatalayerUtilsService.generateConfirmationDigitalDataObject();
        this.localStorageService.set('confirmationDigitalDataCallBack', this.$window.digital_data);
        /* INIT DELETE GA4 MIGRATION*/
        this.DatalayerUtilsService.generateConfirmationDatalayerObject();
        this.localStorageService.set('confirmationDatalayerCallBack', this.$window.datalayer_general);
        /* FINISH DELETE GA4 MIGRATION*/
    };
    
    
    
    
    

    getPaymentMethodCode = (paymentMethod: string): string => {
        const paymentType = this.getPaymentType(paymentMethod);
        return this.PmtConstants.PAYMENTS_METHODS_CODE_BY_PROVIDER[paymentType] ?? paymentType;
    };

    getPaymentType = (paymentMethod:string):string =>{
        const paymentTypes = {
            FULL_PAY_AVIOS : this.PmtConstants.PAYMENTS_METHODS_CODE.FULL_AVIOS,
            VOUCHER: this.PmtConstants.PAYMENTS_METHODS_CODE.VOUCHER
        };
        return paymentTypes[this.localStorageService.get('paymentType')] || paymentMethod;
    };

    openBagOnBoardUrl = (urlbob) => {
        this.$window.open(urlbob, '_blank');
    };

    openHolaMadridActivities = () => {
        const url = window.location.href;
        const baseUrl = url.substring(0, url.indexOf('/', url.indexOf('/') +2));
        this.$window.open(baseUrl + '/' + this.$rootScope.appMarket + '/' +  this.$rootScope.appLang + '/stopover-in-madrid/experiencias/', '_blank');
    };

    setOrderInfoDatalayer = () => {
        var flowApp = this.flowApp;
        var bookingInfo = this.localStorageService.get('bookingInfo');
        var infoDataLayer = this.localStorageService.get('confirmationDatalayerCallBack');
        var orderInfo = { 'OrderId': bookingInfo.order.orderId };
        var content;
        if (canAddVoluntaryOrderInfo(this, orderInfo, flowApp)) {
            this.DatalayerUtilsService.addDataLayerInfo(orderInfo);
            Object.keys(infoDataLayer).forEach( (element) => {
                content = {};
                content[element] = infoDataLayer[element];
                if (this.notExistOnDataLayer(element)) {
                    this.DatalayerUtilsService.addDataLayerInfo(content);
                }
            });
        }
        this.DatalayerUtilsService.sendDatalayerEvent(this.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
    };

    notExistOnDataLayer = (element) => {
        const alreadyOnDataLayer = [
            this.PmtDatalayerConstants.DATALAYER_INFO.LANGUAGE,
            this.PmtDatalayerConstants.DATALAYER_INFO.MARKET,
            this.PmtDatalayerConstants.DATALAYER_INFO.WEB_VERSION,
            this.PmtDatalayerConstants.DATALAYER_INFO.WEB_MODE,
            this.PmtDatalayerConstants.DATALAYER_INFO.QUADRIGAM,
            this.PmtDatalayerConstants.DATALAYER_INFO.CODE,
            this.PmtDatalayerConstants.DATALAYER_INFO.USER_STATE,
            this.DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE_WITHOUT_TAX,
            this.DatalayerEcommerceConstants.DATALAYER_ECOMMERCE.TOTAL_PRICE
        ];
        return alreadyOnDataLayer.indexOf(element) === -1;
    };

    /**
     * Warns the user when browser back button is pressed and gives him/her the option of staying in the page or leaving to the homepage.
     */
    warnUserOnBackPressed = () => {
        const cvFlowInitialized = this.localStorageService.get('cvFlowInitialized');
        this.$window.scrollTo(0, 0);
        history.pushState(null, null, location.href);
        this.$window.onpopstate =  () => {
            if(angular.isDefined(cvFlowInitialized) && cvFlowInitialized) {
                this.$rootScope.$broadcast('cvConfimationBackButtonPressed');
            } else if (this.flowApp === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                this.PmtModalService.finishWaiting();
                this.localStorageService.get('actualStepFlow') === 'confirmation' && !this.localStorageService.get('payFromTransfer') ? this.PmtModalService.showGenericModal(true, this.MODAL_WARN_ABOUT_LEAVING).result.then(history.pushState(null, null, location.href), angular.noop) : angular.noop;
                this.localStorageService.remove('payFromTransfer');
            } else {
                //
                this.PmtModalService.closeAllCurrentModals();
                this.localStorageService.get('actualStepFlow') === 'confirmation' && !this.localStorageService.get('payFromTransfer') ? this.PmtModalService.showGenericModal(true, this.MODAL_WARN_ABOUT_LEAVING).result.then(history.pushState(null, null, location.href), angular.noop) : angular.noop;
                this.localStorageService.remove('payFromTransfer');
            }
        };
    };

    setTitlePage = () => {
        switch (this.flowApp) {
                case this.PmtConstants.APP_TYPES.ONHOLD:
                    this.CommonsUtilService.setTitlePage('BKI_TITLE_PAGE_CONFIRMATION_PAGE_ONHOLD');
                    break;
                case this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS:
                    this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_BID_CONFIRMATION');
                    break;
                case this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                case this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED:
                    this.CommonsUtilService.setTitlePage('MMB_TITTLE_PAGE_CONFIRMATION_VC');
                    break;
                case this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                    this.CommonsUtilService.setTitlePage('BKI_TITLE_ON_HOLD_CONF_CONFIRMATION');
                    break;
                case this.PmtConstants.APP_TYPES.BOOKING:
                    this.CommonsUtilService.setTitlePage(this.getBKITitlePage());
                    break;
                default:
                    this.CommonsUtilService.setTitlePage('GENERAL_TITLE_CONFIRMATION_PAGE');
                    break;
        }
    };

    private getBKITitlePage = () =>{
        const isMulticity = this.localStorageService.get('multiCitySearch');
        if(this.isShuttleFlow) return 'BKI_SHUTTLE_TITLE_CONFIRMATION_PAGE';
        if(isMulticity) return 'BKI_MULTI_TITLE_CONFIRMATION_PAGE';
        return 'GENERAL_TITLE_CONFIRMATION_PAGE';
    };

    getEnvUrlToGetWidgetCode = () => {
        let env: string = '';
        const envCopy: any = {};
        (<any>Object).assign(envCopy, (<any>window).env);
        return envCopy.urlEnvironment;
    };

    areInvoiceWarnings = (warningInfo) => {
        const warningCodes = [
            this.PmtConstants.INVOICE_WARNINGS.INVOICES_FAIL,
            this.PmtConstants.INVOICE_WARNINGS.INVOICES_PARTIAL_FAIL,
            this.PmtConstants.INVOICE_WARNINGS.NO_TICKET_NUMBER,
            this.PmtConstants.INVOICE_WARNINGS.WARNING_INVOICE_NOT_ISSUED,
            this.PmtConstants.INVOICE_WARNINGS.WARNING_MEMBERSHIP_INFORMATION_INCOMPLETE,
            this.PmtConstants.INVOICE_WARNINGS.WARNING_MEMBERSHIP_NOT_OBTAINED,
            this.PmtConstants.INVOICE_WARNINGS.WARNING_MEMBERSHIP_PROBLEM,
            this.PmtConstants.INVOICE_WARNINGS.WARNING_ORDER_INFORMATION_INCOMPLETE,
            this.PmtConstants.INVOICE_WARNINGS.NO_MARKET_FOUND
        ];
        return warningCodes.indexOf(warningInfo.code) !== -1;
    };

    loadWidgetsScripts = () => {
        let scriptActivitiesVendor, scriptActivitiesMain, scriptActivitiesRunTime, cssActivitiesVendor, cssActivitiesMain, urlActivities, baseUrl, widgetActivitiesVersion, widgetTransfersVersion;
        let scriptTransferVendor, scriptTransferMain, scriptTransferRunTime, cssTransfersMain, urlTransfers;

        widgetActivitiesVersion = '2.2.4';
        widgetTransfersVersion = '2.1.3';
        baseUrl = this.getEnvUrlToGetWidgetCode();
        urlActivities = baseUrl + 'iberia-web-content/build-recoglobick-activities/' + widgetActivitiesVersion;
        urlTransfers = baseUrl + 'iberia-web-content/build-recoglobick-transfers/' + widgetTransfersVersion;

        //activities
        scriptActivitiesVendor = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/js/2.vendor.chunk.js') + '"</script>';
        scriptActivitiesMain = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/js/main.chunk.js') + '"</script>';
        scriptActivitiesRunTime = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/js/runtime-main.js') + '"</script>';
        cssActivitiesVendor = '<link rel="stylesheet" href="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/css/2.vendor.chunk.css') + '">';
        cssActivitiesMain = '<link rel="stylesheet" href="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/css/main.chunk.css') + '">';
        angular.element(this.$document).find('body').prepend(this.$compile(scriptActivitiesVendor)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptActivitiesMain)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptActivitiesRunTime)(this.$scope));

        angular.element(this.$document).find('body').prepend(this.$compile(cssActivitiesVendor)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(cssActivitiesMain)(this.$scope));

        //transfers
        scriptTransferVendor = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/js/2.vendor.chunk.js') + '"</script>';
        scriptTransferMain = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/js/main.chunk.js') + '"</script>';
        scriptTransferRunTime = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/js/runtime-main.js') + '"</script>';
        cssTransfersMain = '<link rel="stylesheet" href="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/css/main.chunk.css') + '">';
        angular.element(this.$document).find('body').prepend(this.$compile(scriptTransferVendor)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptTransferMain)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptTransferRunTime)(this.$scope));

        angular.element(this.$document).find('body').prepend(this.$compile(cssTransfersMain)(this.$scope));
    };

    displayWineClubBanner = () => {
        const wineClub = this.model?.confirmationInfo?.wineClub;
        if (!wineClub) {
            this.showWineClubBanner = wineClub;
            return;
        }
        if (!calculateFrequencyDisplay(this)) {
            this.showWineClubBanner = false;
            return;
        }
        this.showWineClubBanner = isFrequentFlyer(this);
    };

    displayCarbonFootprintBanner = () => {
        this.co2InfoBannerModel = {
            name: this.extractFirstPassengerName(),
            kilosCo2eFormatted:  this.model.confirmationInfo.co2Info?.kilosCo2eFormatted,
            priceFormatted: this.model.confirmationInfo.co2Info?.price,
            flight: {
                numPax: this.numPax,
                segments: this.flightList
            }
        };
        this.showCarbonFootprintBanner =
            Boolean(!this.model.confirmationInfo.summaryInfo?.ancillaries?.carbonFootprint && this.model.confirmationInfo.co2Info?.hasCarbonFootprint);
    };

    extractFirstPassengerName = () => {
        const fullName = this.model.confirmationInfo.summaryInfo.passengers.personalData[0].name;
        const surname = this.model.confirmationInfo.summaryInfo.passengers.personalData[0].surname;
        return fullName.replace(surname, '').trim();
    };

    completeTransferFlow = (): void => {
        const widgetVersion = '2.2.3';
        const baseUrl = this.getEnvUrlToGetWidgetCode();
        const urlTransfers = baseUrl + 'iberia-web-content/build-recoglobick-transfers/' + widgetVersion;
        const scriptTransferVendor = urlTransfers + '/static/js/2.vendor.chunk.js';
        const scriptTransferMain = urlTransfers + '/static/js/main.chunk.js';
        const scriptTransferRunTime = urlTransfers + '/static/js/runtime-main.js';
        const cssTransfersMain = urlTransfers + '/static/css/main.chunk.css';
        angular.element('script[src="' + scriptTransferVendor + '"]').remove();
        angular.element('script[src="' + scriptTransferMain + '"]').remove();
        angular.element('script[src="' + scriptTransferRunTime + '"]').remove();
        angular.element('link[href="' + cssTransfersMain + '"]').remove();
        this.$window.RecoglobickTransfersWidget.unmount();
    };

    checkShowAvis = () => {
        const ancillariesInfo = this.localStorageService.get('ancillariesInfo');
        if(!ancillariesInfo) return false;

        const ancillaries = ancillariesInfo.ancillaries;
        return ancillaries.some(ancillary => ancillary?.status?.code === 'AVAILABLE' && ancillary?.type === 'VEHICLE_RENTAL');
    };

    activate = () => {
        injectIbPmtStylesHost();
        let fareData, bookingInfo, pointsData;
        this.$timeout( () => {
            this.setTitlePage();
        }, 1600);
        initConfirmationModel(this);
        bookingInfo = readConfirmationStorage(this);
        syncShuttleFlowFlag(this);
        syncRedemptionFlowFlag(this);
        syncPointsObFlowFlag(this);
        broadcastBidsConfirmation(this);
        setInsuranceBanner(this);
        rememberConfirmationStep(this);
        applyHeaderVisibility(this);
        openConfirmationWaiting(this);
        saveNewsletterForAnonymousBooking(this);
        resetOnholdHeaderCurrency(this);
        loadConfirmationByFlow(this, bookingInfo);
        addVoluntaryChangeOrderInfo(this);
        fareData = this.localStorageService.get('fareData');
        collectFlightSummary(this, bookingInfo);
        pointsData = this.localStorageService.get('CalculatedPoints');
        this.aviosToEarn = pointsData ? pointsData.Avios : 0;
        this.elitePointsToEarn = pointsData ? pointsData.Elite : 0;
        this.warnUserOnBackPressed();
        this.listLocationWitget = this.generateListWidget();
        const bkiInfo = this.localStorageService.get('bookingInfo');
        this.isCheckinAndDSTFlow = this.getIsCheckinAndDSTFlow(bkiInfo);
        applyHolaMadridFlow(this, bkiInfo);
        readAllianzContract(this);
        addDigitalDataUnlessOnHold(this);
    };

    private checkCheckedInTickets (tickets: any[]): boolean {
        const now = Date.now();

        return tickets.some(ticket =>
            ticket.coupons?.some(coupon =>
                ['CHECKED', 'CHECKED IN'].includes(coupon.status) &&
                Date.parse(coupon.departureDate) >= now
            )
        );
    }

    private getIsCheckinAndDSTFlow (bookingInfo: any): boolean {
        if (!this.$rootScope.isDisruptionFlow) return false;
        return this.checkCheckedInTickets(bookingInfo?.tickets || []);
    }

    getProcessByPaymentViewType (): string {
    
        return this.newPaymentViewType
            ? this.CommonsConstants.PROCESS.BOOKING_SLICED
            : this.CommonsConstants.PROCESS.ON_HOLD;
    }
    
    setDigitalDataInfo = () => {
        const points = this.localStorageService.get('CalculatedPoints') || { Avios: '0', Elite: '0' };
        const dataLayer = {
            AviosEarned: parseInt(points.Avios)
        };
        this.DatalayerUtilsService.addDigitalDataInfo(dataLayer);
    };
    public onClickUpgrade (){
        const digitalData = {
            'eventName': 'interaccion',
            'eventCategory': 'registro',
            'eventAction': 'clic',
            'eventLabel': 'compra:upgrade registro'
        };
        window.dataLayer.push(digitalData, {'event':'interaction'});
    }

    public deleteTemporalPNR () {
        this.CommonsBrowserStorageService.remove('temporalPNR');
        this.DigitalDataService.emitEvent('remove_temporalPNR');
    }

    public updateDatalayerInfoPurchase () {
        const previousStepFlow = this.localStorageService.get('previousStepFlow');

        if(previousStepFlow !== this.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE) {
            return;
        }
        this.DatalayerEcommerceUtilsService.setAddPurchase();
    }
}
