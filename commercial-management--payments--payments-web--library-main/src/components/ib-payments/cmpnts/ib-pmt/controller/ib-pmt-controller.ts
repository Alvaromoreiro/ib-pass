import angular from 'angular';
import { IbPmtFeeHost } from '../models/ib-pmt-update-fee.model';
import { Subscription } from 'rxjs';
import {
    activateImpl,
    updateAviosCalculatedImpl,
    aviosCalculatedErrorImpl,
    $onDestroyImpl,
    checkAssistCardAncillaryImpl,
    updateBasketWithoutACImpl,
    trackInfoToMonetateImpl,
    trackShoppingBasketInMonetateImpl,
    trackPassengersFlightInMonetateImpl,
    trackFlightCabinInMonetateImpl,
    trackTripTypeInMonetateImpl,
    trackFareTypeSelectedInMonetateImpl,
    trackFlightDestinationInMonetateImpl,
    createFeeHostImpl,
    getCcFeeRequestImpl,
    updateFeeImpl,
    submitPaymentImpl,
    getSummaryInfoQuotaImpl,
    getIberiaPayQuotaInfoImpl,
    getIberiaPayQuotaOptionsImpl,
    getSummaryInfoQuotaDeferedMonthImpl,
    openModalInfoQuotaImpl,
    openGeneralModalInfoQuotasImpl,
    cleanAdyenComponentImpl,
    adyenComponentImpl,
    oneSiteIframeImpl,
    externalPayFormImpl,
    generateIframeFormImpl,
    generateExternalButtonFormImpl,
    deletePrivateDataImpl,
    changeIssuerCountryImpl,
    updatePaymentsImpl,
    getSelectedLoggedCardImpl,
    getActivateSelectedTabImpl,
    changeSelectedTabImpl,
    updateSelectedCardFieldsImpl,
    updateUserSelectedCreditCardImpl,
    updatePaymenthMethodsInfoImpl,
    paypalUndefinedImpl,
    confirmationPaypalImpl,
    submitFormImpl,
    updateSubmittedTabsImpl,
    checkFirstFormElementErrorImpl,
    openModalLinksImpl,
    goToConfirmationPageImpl,
    iberiaPayTokenizeSuccesImpl,
    updateIberiaPayLoadingIframeStatusImpl,
    startIberiaPayIframeLoadTimeoutImpl,
    clearIberiaPayIframeLoadTimeoutImpl,
    iberiaPayIframeReadyImpl,
    reloadPageImpl,
    onIbdcScriptLoadErrorImpl,
    showPaymentInitReloadModalImpl,
    hasIberiaPayPaymentMethodImpl,
    canPayIberiaPayWithoutIbdcImpl,
    shouldShowIberiaPayInitReloadModalImpl,
    validateIberiaPayAfterInitImpl,
    iberiaPayErrorsControllImpl,
    removeAviosDisscountsImpl,
    changeSelectedHoldOptionImpl,
    restoreSummaryAncillariesImpl,
    applyStoredDonationImpl,
    updateSummaryDonationImpl,
    updateAvailablePaymenMethodsImpl,
    updatePaymentsWithoutCallImpl,
    disabledQuotasOptionImpl,
    updateDisccountsTotalImpl,
    populateAppliedDiscountsFromCreateOrderDataImpl,
    restoreBasketDiscountsFromCreateOrderDataImpl,
    syncVoucherDiscountInBasketImpl,
    checkBasketImpl,
    generateInfoModelImpl,
    checkBasketCommonHeaderImpl,
    generateInfoModelCommonHeaderImpl,
    updateDatalayerInformationCkiFlowImpl,
    checkDonationImpl,
    updateDatalayerWithQuadrigamImpl,
    updateBasketOnHoldImpl,
    selectQuadrigamImpl,
    setTitlePageImpl,
    noPaymentImpl,
    noPaymentConfirmImpl,
    goToHomeImpl,
    updateTotalFeesImpl,
    openOnholdLightBoxImpl,
    closeOnholdLightBoxImpl,
    loadNemuruComponentImpl,
    loadMercadoPagoComponentImpl,
    updateCalcAviosImpl,
    callWithKeepSessionAliveImpl,
    callFinishWaitingModalImpl,
    checkVoucherMmbvcImpl,
    checkAviosMmbvcImpl,
    getPNRTypeImpl,
    getPNRImpl,
    determinePNRTypeImpl
} from './partials';

@Controller('ib-pmt-module',
    ['$rootScope',
        '$scope',
        '$filter',
        'localStorageService',
        'PmtModalService',
        'PmtTransformer',
        'PmtService',
        '$location',
        'PmtConstants',
        '$sce',
        '$document',
        '$compile',
        '$timeout',
        '$window',
        'PmtUtilsService',
        'CurrencyService',
        'DatalayerUtilsService',
        'PmtDatalayerConstants',
        'DatalayerEcommerceUtilsService',
        'PmtMethodsTransformer',
        'DataLayerService',
        'PmtUtilsTransformers',
        'MonetateUtilsService',
        'CommonsAncillariesService',
        'PmtBreakDownUtilsService',
        'PmtDatalayerUtilsService',
        'NewMainHeaderFacade',
        'PmtAssFassAncillariesService',
        'pmtConditionsGiftCardsService',
        'MonetateConstants',
        'CommonsUtilService',
        'CommonsUserUtilsService',
        'GetDestinationsService',
        'CommonsKeepAliveUtilsService',
        'DigitalDataService',
        'QuantumService',
        'DatalayerConstants',
        'DatalayerGeneralConstants',
        'ibPmtNemuruService',
        'ibPmtMercadoPagoService',
        'IbUiAviosSummaryService',
        'PMTCheckPartnerDiscountsService',
        'DccService',
        'IbPmtCreditCardFeeService'], [])
export class PmtPageController {
    public showQuotasInfoFlowAppDisallowed;
    public showGeneralSummary;
    public showCkiSummary;
    public showMmbAncillariesSummary;
    public appliedCCFee;
    public aviosToEarn;
    public elitePointsToEarn;
    public numberFreeUpgrade;
    public submittedTabs;
    public totalAviosAmount;
    public nemuruAvailableObserver;
    public mercadoPagoAvailableObserver;
    public isIbZero;
    public isSoftUser;
    public showOnHoldNotice;
    public iframeReadyCount;
    public allowedCashAndAviosWithVoucher;
    public loadingOnlineBankingForm;
    public loadingIframeForm;
    public activeAdyenComponent;
    public flowApp;
    public isShuttleFlow;
    public modelSummaryMmbAnc;
    public deepLinkData;
    public generisONBFlowateIframeForm;
    public ibPayTrace;
    public model;
    public numberCallEvent;
    public LOGIN_ONB;
    public isChecked;
    public isONBFlow;
    public showNoDiscountOBPrice;
    public originalOBPrice;
    public noDiscountOBPrice;
    public showOBPoints;
    public oBPoints;
    public dataRequest;
    public quotaIsLoading;
    public quotaIbPayCall;
    public nemuruIsCalled;
    public mercadoPagoIsCalled;
    public paymentsForm;
    public digital_data;
    public asComponent;
    public adyenCheckout;
    public selectedData;
    public modelLightBox;
    public actualStepFlow;
    public showExternalButton;
    public rolOb:boolean;
    public isCheckVoucherMmbvc:boolean;
    public isCheckAviosMmbvc:boolean;
    public currentDccData: DccModel.CurrentDccData;
    public donationEnabled: boolean;
    public dccDataObersever: Subscription;
    public onHoldFreeSelected: boolean = false;
    public paymentInitReloadModalShown = false;
    public readonly IBERIA_PAY_IFRAME_LOAD_TIMEOUT_MS = 30000;
    public iberiaPayIframeLoadTimeout: angular.IPromise<void> | null = null;
    constructor (
        public $rootScope,
        public $scope,
        public $filter,
        public localStorageService,
        public PmtModalService,
        public PmtTransformer,
        public PmtService,
        public $location,
        public PmtConstants,
        public $sce,
        public $document,
        public $compile,
        public $timeout,
        public $window,
        public PmtUtilsService,
        public CurrencyService,
        public DatalayerUtilsService,
        public PmtDatalayerConstants,
        public DatalayerEcommerceUtilsService,
        public PmtMethodsTransformer,
        public DataLayerService,
        public PmtUtilsTransformers,
        public MonetateUtilsService,
        public CommonsAncillariesService,
        public PmtBreakDownUtilsService,
        public PmtDatalayerUtilsService,
        public NewMainHeaderFacade,
        public PmtAssFassAncillariesService,
        public pmtConditionsGiftCardsService,
        public MonetateConstants,
        public CommonsUtilService,
        public CommonsUserUtilsService,
        public GetDestinationsService,
        public CommonsKeepAliveUtilsService,
        public DigitalDataService,
        public QuantumService,
        public DatalayerConstants,
        public DatalayerGeneralConstants,
        public ibPmtNemuruService,
        public ibPmtMercadoPagoService,
        public IbUiAviosSummaryService,
        public PMTCheckPartnerDiscountsService,
        public DccService,
        public IbPmtCreditCardFeeService

    ) {}
    public createFeeHost (): IbPmtFeeHost {
        return createFeeHostImpl(this);
    }

    activate = () => activateImpl(this);

    updateAviosCalculated = () => updateAviosCalculatedImpl(this);

    aviosCalculatedError = () => aviosCalculatedErrorImpl(this);

    $onDestroy = () => $onDestroyImpl(this);

    checkAssistCardAncillary = () => checkAssistCardAncillaryImpl(this);

    updateBasketWithoutAC = () => updateBasketWithoutACImpl(this);

    trackInfoToMonetate = () => trackInfoToMonetateImpl(this);

    trackShoppingBasketInMonetate = (ancillaries) => trackShoppingBasketInMonetateImpl(this, ancillaries);

    trackPassengersFlightInMonetate = (passengersInfo) => trackPassengersFlightInMonetateImpl(this, passengersInfo);

    trackFlightCabinInMonetate = (selectedTripInfo, bookingUrlParams) => trackFlightCabinInMonetateImpl(this, selectedTripInfo, bookingUrlParams);

    trackTripTypeInMonetate = (originDestinationInfo) => trackTripTypeInMonetateImpl(this, originDestinationInfo);

    trackFareTypeSelectedInMonetate = (fareFamilyConditionsInfo) => trackFareTypeSelectedInMonetateImpl(this, fareFamilyConditionsInfo);

    trackFlightDestinationInMonetate = (destinationAreasCitiesList, destinationCountry) => trackFlightDestinationInMonetateImpl(this, destinationAreasCitiesList, destinationCountry);

    getCcFeeRequest = (totalPrice, currency, market, tripInfo) => getCcFeeRequestImpl(this, totalPrice, currency, market, tripInfo);

    /**
     * This function Continue with pay calling service
     * @param {Event} submitedPaymentEvent event to lunch function
     * @param {Boolean} isRecal Parameter that indicates if the payment is 3ds and it is necessary to perform the callback
     * @param {Boolean} tokenizeSucces Parameter that indicates if the payment with Iberia pay has been successful and continues with the payment flow
     * @param {Boolena} onHoldPaymentPcc Parameter that indicates if the user select option onhold when issue return 449 error pcc
     */
    submitPayment = (event?, isRecal?, tokenizeSucces?, onHoldPaymentPcc?) => submitPaymentImpl(this, event, isRecal, tokenizeSucces, onHoldPaymentPcc);

    /**
     * Update the 'fee' information and launch an event to the child component to update information.
     * Controll that card selected in combo correspond with credit card number insert in IFRAME IberiaPay.
     * @param {Event} changeSelectedCreditCard event to launch function
     * @param {Object} selectedCard Is object with all credit card information
     */
    updateSelectedCardFields = (event, selectedCard) => updateSelectedCardFieldsImpl(this, event, selectedCard);

    /**
     * Update the 'fee' information when select an user credit card
     * @param {*} event
     * @param {Object} selectedCard Is object with all credit card information
     */
    updateUserSelectedCreditCard = (event, selectedCard) => updateUserSelectedCreditCardImpl(this, event, selectedCard);

    /**
     * Update the 'fee' information
     * @param {*} selectedCard
     */
    updateFee (selectedCard) {
        return updateFeeImpl(this, selectedCard);
    }

    /**
     * Get all information about selected quota when service additionalField return variable 'showButtonQuotas' and save in the model
     * @param {*} event Event to activate function
     * @param {*} quotaSelected value quota selected
     */
    getSummaryInfoQuota = (event, quotaSelected) => getSummaryInfoQuotaImpl(this, event, quotaSelected);

    /**
     * If all param needed from the form call tokenizeCreditCard to save iframe number and cvv
     * @param {*} event Event to activate function
     * @param {*} quotaSelected value quota selected
     */
    getIberiaPayQuotaInfo = (event, quotaSelected) => getIberiaPayQuotaInfoImpl(this, event, quotaSelected);

    /**
     * When iframe respond with success call this function to obtain available grace months for iberia pay quotas flow
     */
    getIberiaPayQuotaOptions () {
        return getIberiaPayQuotaOptionsImpl(this);
    }

    getSummaryInfoQuotaDeferedMonth = (event, deferedMonthSelected, quotaSelected) => getSummaryInfoQuotaDeferedMonthImpl(this, event, deferedMonthSelected, quotaSelected);

    /**
     * Open modal summary-info-quotas with all details about selected quota
     * @param {event} openModalInfoQuota Event to activate function
     */
    openModalInfoQuota = (event) => openModalInfoQuotaImpl(this, event);

    /**
     * Open Modal general-info-quotas with general information about quotas
     * @param {Event} showGeneralModalInfoQuota Event to activate function
     */
    openGeneralModalInfoQuotas = (event) => openGeneralModalInfoQuotasImpl(this, event);

    cleanAdyenComponent () {
        return cleanAdyenComponentImpl(this);
    }

    adyenComponent = (event, serviceData) => adyenComponentImpl(this, event, serviceData);

    oneSiteIframe = (event, formData) => oneSiteIframeImpl(this, event, formData);

    /**
     * Manage the 3DS Event to generate form and redirect to external page
     * @param {Even} generate3DSFORM Event to lunch function
     * @param {Object} formData All information necesary to generate form , this info is  return by service issue when code error is 451
     */
    externalPayForm = (event, formData) => externalPayFormImpl(this, event, formData);

    /**
     * Generate form into modal to pay in LATAM markets
     * @param {Even} generate3DSIFRAME Event to lunch function
     * @param {Object} formData All information necesary to generate external form , this info is  return by service issue when code error is 451
     */
    generateIframeForm = (event, formData) => generateIframeFormImpl(this, event, formData);

    /**
     *Generates a forms when the payment method is 'button'. The form is generated, depending on the type of provider.
     * @param {Event} generateExtenalButtonForm event to lunch function
     * @param {Object} formData All information necesary to generate external form , this info is  return by service issue when code error is 451
     */
    generateExternalButtonForm = (event, formData) => generateExternalButtonFormImpl(this, event, formData);

    /**
     * Delete data on model
     * @param {BOOL} isComplete If pay is complete, clean loggedCard.
     */
    deletePrivateData = (isComplete?) => deletePrivateDataImpl(this, isComplete);

    /**
     * Change the country for the selected card and update the payment methods
     * @param {Event} event
     * @param {Object} issuerCountry object with all information about country
     * @param {Object} selectedCard object with all information selected if user is logged
     * @param {Object} creditCardFormModel is the model credit card
     */
    changeIssuerCountry = (event, issuerCountry, selectedCard, creditCardFormModel) => changeIssuerCountryImpl(this, {
        event,
        issuerCountry,
        selectedCard,
        creditCardFormModel
    });

    /**
     * Update all information about model payments.
     * @param {Object} issuerCountry Country for make request to service
     * @param {Array<Object>} customerCards Customer cards of user returned of service
     * @param {Object} selectedCard Information credit card selected if user logged, if the user not select creditcard, asign general form
     * @param {Object} creditCardFormModel all information credit card  form
     */
    updatePayments = (issuerCountry, customerCards, selectedCard, creditCardFormModel) => updatePaymentsImpl(this, {
        issuerCountry,
        customerCards,
        selectedCard,
        creditCardFormModel
    });

    /**
     * Return a Object with all information about credit card selected by user, to update model info
     * @param {Object} selectedLoggedCard Object with all credit card information
     * @param {Array<Object>} customerCreditCards Array with all customer credit card info user
     * @param {Object} issuerCountry Object with information about issuer country
     */
    getSelectedLoggedCard = (selectedLoggedCard, customerCreditCards, issuerCountry, creditCardFormModel) => getSelectedLoggedCardImpl(this, {
        selectedLoggedCard,
        customerCreditCards,
        issuerCountry,
        creditCardFormModel
    });

    /**
     *
     * @param {*} previousSelectedPaymentMethod
     * @param {*} actualPaymentMehods
     */
    getActivateSelectedTab = (previousSelectedPaymentMethod, actualPaymentMehods) => getActivateSelectedTabImpl(this, previousSelectedPaymentMethod, actualPaymentMehods);

    /**
     * Update tab if the user change payment method
     * @param {*} event
     * @param {*} indexTab index tab
     */
    changeSelectedTab = (event, indexTab, previousActiveTab) => changeSelectedTabImpl(this, event, indexTab, previousActiveTab);

    /**
     *  Update payment methods when user check voucher or change countryIssue
     * @param {Event} updatePaymenthMethodsInfo Event to lunch function
     */
    updatePaymenthMethodsInfo = (event) => updatePaymenthMethodsInfoImpl(this, event);

    /**
     * show regular button if paypal variable is undefined
     * @param {Event} paypalUndefinedEvent Event to lunch function
     */
    paypalUndefined = (event) => paypalUndefinedImpl(this, event);

    /**
     * Save paypal token , when user pay with paypal and checkOutService is called
     * @param {Event} payWithPaypal payWithPaypal event to lunch function
     * @param {String} token token to confirm payment in PayPal
     */
    confirmationPaypal = (event, token) => confirmationPaypalImpl(this, event, token);

    /**
     * Update param $submitted in paymentForm Object if user click in button paypal
     * @param {Event} submitFormEvent event to launch function
     */
    submitForm = (event) => submitFormImpl(this, event);

    updateSubmittedTabs = () => updateSubmittedTabsImpl(this);

    checkFirstFormElementError = () => checkFirstFormElementErrorImpl(this);

    /**
     *  Open the modal with all the information
     * @param {Event} event  Event to lunch function
     * @param {String} modalTemplate The html file of the modal
     * @param {Object} model All the necessary information to show the modal
     */
    openModalLinks = (event, modalTemplate, model) => openModalLinksImpl(this, event, modalTemplate, model);

    /**
     * Redirection to confirmation page when pay is done
     * @param {Event} paypalPaymentSuccessEvent event to lunch function
     */
    goToConfirmationPage = (event?) => goToConfirmationPageImpl(this, event);

    /**
     * Process the payment with iberia pay.
     * When you receive the iframe event that the tokenization went well, execute the payment function
     * @param {Event} success event to launch the function, this event is sent by the iframe of iberia pay
     */
    iberiaPayTokenizeSucces = (event) => iberiaPayTokenizeSuccesImpl(this, event);

    updateIberiaPayLoadingIframeStatus = (event, status) => updateIberiaPayLoadingIframeStatusImpl(this, event, status);

    startIberiaPayIframeLoadTimeout = () => startIberiaPayIframeLoadTimeoutImpl(this);

    clearIberiaPayIframeLoadTimeout = () => clearIberiaPayIframeLoadTimeoutImpl(this);

    /**
     * generate styles to label's iberia pay scripts (cvv and number credit card), calling this.$window.IBDC.setStyles function
     * @param {Event} ready event to launch the function, this event is sent by the iframe of iberia pay when iframes is loaded
     */
    iberiaPayIframeReady = (event) => iberiaPayIframeReadyImpl(this, event);

    reloadPage = () => reloadPageImpl(this);

    onIbdcScriptLoadError = () => onIbdcScriptLoadErrorImpl(this);

    showPaymentInitReloadModal = () => showPaymentInitReloadModalImpl(this);

    hasIberiaPayPaymentMethod = () => hasIberiaPayPaymentMethodImpl(this);

    canPayIberiaPayWithoutIbdc = () => canPayIberiaPayWithoutIbdcImpl(this);

    shouldShowIberiaPayInitReloadModal = (): boolean => shouldShowIberiaPayInitReloadModalImpl(this);

    validateIberiaPayAfterInit = () => validateIberiaPayAfterInitImpl(this);

    /**
     * This function added error message to field CREDITCARD_NUMBER or CVV according error code.
     * @param {event} Error Event to launch the function , Is a event send by iFrame IberiaPay if detected any error in  in fields CREDITCARD_NUMBER or CVV
     */
    iberiaPayErrorsControll = (event) => iberiaPayErrorsControllImpl(this, event);

    /**
     * Remove the information from the avios discount information model, if the user has selected avios and changes to voucher
     * @param {Event} removeAviosDisscounts event to lunch function
     */
    removeAviosDisscounts = (event) => removeAviosDisscountsImpl(this, event);

    /**
     *
     * @param {*} event
     * @param {*} info
     * @param {*} index
     */
    changeSelectedHoldOption = (event, info, index) => changeSelectedHoldOptionImpl(this, event, info, index);

    restoreSummaryAncillaries = () => restoreSummaryAncillariesImpl(this);

    applyStoredDonation = (donationData, status = true) => applyStoredDonationImpl(this, donationData, status);

    updateSummaryDonation = () => updateSummaryDonationImpl(this);

    /**
     * Update available paymentMethods through getScripts
     * @param {boolean} restoreCreateOrderDiscounts Restore basket discounts from createOrderData after refresh
     */
    updateAvailablePaymenMethods (restoreCreateOrderDiscounts = false) {
        return updateAvailablePaymenMethodsImpl(this, restoreCreateOrderDiscounts);
    }

    /**
     * Update paymentMethods when user select 'other payment method' in modal PCC option after 449 error code service uri
     * @param {Object} paymentData All information neccesary to update payment methods
     */
    updatePaymentsWithoutCall (paymentData) {
        return updatePaymentsWithoutCallImpl(this, paymentData);
    }

    /**
     *  Launch an event to the child component, to disable or enabled the quota option in the BR market,
     * if the user selects a discount or delete disscount with avios.
     * @param {Object} typeDisscount type disscount selected by user
     * @param {Event} disscountAviosSelected to lunch function
     * @param {Boolean}status define if a discount is selected
     */
    disabledQuotasOption = (event, status) => disabledQuotasOptionImpl(this, event, status);

    /**
     * When change something in the basket we generate the payment model with the changes
     */
    checkBasket = (evt) => checkBasketImpl(this, evt);

    generateInfoModel (issuerCountry) {
        return generateInfoModelImpl(this, issuerCountry);
    }

    /**
     * When change something in the basket we generate the payment model with the changes
     * this function was create to eliminate modal plane view when remove items from basket
     */
    checkBasketCommonHeader = (evt) => checkBasketCommonHeaderImpl(this, evt);

    generateInfoModelCommonHeader (issuerCountry) {
        return generateInfoModelCommonHeaderImpl(this, issuerCountry);
    }

    /**
     * Update layer information  when payment finish
     */
    updateDatalayerInformationCkiFlow () {
        return updateDatalayerInformationCkiFlowImpl(this);
    }

    /**
     * This method update payment methods, summary an total price info when user interactue with donation component
     *
     * @param {*} event
     * @param {*} status donation check is select
     * @param {*} option object with donation option selected
     * @param {*} donationInfo donation info from service
     * @param {*} newsletter old control for form check
     * @param {*} donationForm object with form information, (newslatter check and option selected)
     */
    checkDonation = (event, status, option, donationInfo, newsletter, donationForm) => checkDonationImpl(this, {
        event,
        status,
        option,
        donationInfo,
        newsletter,
        donationForm
    });

    /**
     * This functions is executed after pmt error when user dont have nothing for pay and generate model to show pmt-view.
     * In this case if we want show pmt-view is neccesary remove the linea code 'this.submitPayment()', because this produce that flow continue
     * and dont stop in ptm view.
     * */
    noPayment = (event, paymentData) => noPaymentImpl(this, event, paymentData);

    /**
     * This functions is launched when in the function this.submitPayment() detected that user dont have nothing for pay.
     * This will execute the call to orderChange for flow CV.
     *  */
    noPaymentConfirm () {
        return noPaymentConfirmImpl(this);
    }

    goToHome () {
        return goToHomeImpl(this);
    }

    updateTotalFees () {
        return updateTotalFeesImpl(this);
    }

    updateDisccountsTotal = (event, appliedDiscountTypes, refreshPaymentMethods = true) => updateDisccountsTotalImpl(this, event, appliedDiscountTypes, refreshPaymentMethods);

    public populateAppliedDiscountsFromCreateOrderData (createOrderData): void {
        populateAppliedDiscountsFromCreateOrderDataImpl(this, createOrderData);
    }

    public restoreBasketDiscountsFromCreateOrderData (createOrderData, refreshPaymentMethods = false): void {
        restoreBasketDiscountsFromCreateOrderDataImpl(this, createOrderData, refreshPaymentMethods);
    }

    public syncVoucherDiscountInBasket (): void {
        syncVoucherDiscountInBasketImpl(this);
    }

    selectQuadrigam () {
        return selectQuadrigamImpl(this);
    }

    openOnholdLightBox = (event) => openOnholdLightBoxImpl(this, event);

    closeOnholdLightBox = (event, show) => closeOnholdLightBoxImpl(this, event, show);

    /**
     * Select a page title according to the defined flow.
     */
    setTitlePage () {
        return setTitlePageImpl(this);
    }

    updateDatalayerWithQuadrigam (quadrigam, extendedObject, isUserLogged) {
        return updateDatalayerWithQuadrigamImpl(this, quadrigam, extendedObject, isUserLogged);
    }

    updateBasketOnHold (onHoldInfo, appliedDiscountTypes) {
        return updateBasketOnHoldImpl(this, onHoldInfo, appliedDiscountTypes);
    }

    loadNemuruComponent = (event, formData) => loadNemuruComponentImpl(this, event, formData);

    loadMercadoPagoComponent = (event, formData) => loadMercadoPagoComponentImpl(this, event, formData);

    updateCalcAvios = (evt, flightAviosInfo) => updateCalcAviosImpl(this, evt, flightAviosInfo);

    callWithKeepSessionAlive (paymentMethod) {
        return callWithKeepSessionAliveImpl(this, paymentMethod);
    }

    /**
     * Calls finishWaiting function if flows are CKI, MMB, GiftCards and Subscription Models
     * @param {string} flowApp string with information of application flow
     * @returns {void}
     */
    callFinishWaitingModal = (flowApp: string) => callFinishWaitingModalImpl(this, flowApp);

    public checkVoucherMmbvc = ():boolean => checkVoucherMmbvcImpl(this);

    public checkAviosMmbvc = ():boolean => checkAviosMmbvcImpl(this);

    public getPNRType = (): string => getPNRTypeImpl(this);

    public getPNR = (): string => getPNRImpl(this);

    public determinePNRType (isDisrupted: boolean, isFlexible: boolean): string {
        return determinePNRTypeImpl(this, isDisrupted, isFlexible);
    }

    $onInit = this.activate();
}
