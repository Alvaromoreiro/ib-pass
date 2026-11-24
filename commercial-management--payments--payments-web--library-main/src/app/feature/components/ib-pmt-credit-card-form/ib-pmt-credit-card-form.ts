import * as angular from 'angular';
import {
    bindCreditCardFormDependencies,
    findSelectedCardTypeFromBin,
    isProhibitedChileDebit,
    resolveBinCcFee,
    resolveCreditCardChangeAction,
    resolveTypeCardLoadingState,
    shouldClearSelectedCardOnShorten,
    shouldFetchGuestDccData,
    shouldRemoveIframeError
} from './ib-pmt-credit-card-form.helpers';

angular.module('ib-pmt-credit-card-form', [
]);
@Component('ib-pmt-credit-card-form', 'ibPmtCreditCardForm', {
    controllerAs: 'PmtCreditCardFormCtrl',
    controller: 'IbPmtCreditCardFormController',
    bindings: {
        containerForm: '=',
        creditCardFormModel: '=',
        contactData: '=',
        selectedData: '=',
        statesList: '<',
        loggedInfo: '<',
        customerCreditCards: '<',
        requiredAdditionalFields: '<',
        summaryInfoQuota: '<',
        issuerCountry: '=',
        countriesList: '<',
        submittedTab: '='
    },
    templateUrl: ['$rootScope', function ($rootScope: CommonsRootScope) {
        return $rootScope.routes.templates + 'ib-pmt-credit-card-form.html';
    }]
}, ['$window', 'PmtConstants', 'PmtUtilsService', '$scope', '$route', 'PmtModalService', 'NewMainHeaderFacade', '$document', 'localStorageService', 'CommonsUserUtilsService', 'CurrencyService', '$rootScope', 'DccService'], [])

export class IbPmtCreditCardFormController implements angular.IController {
    public zipCodeValidators: Record<string, any>;
    public errorCardNumberIbPay: number | null;
    public errorCvvIbPay: number | null;
    public typeCardLoading: boolean;
    public issuerCountry: creditCardModel.Country;
    public containerForm: any;
    public submittedTab: boolean | undefined;
    public creditCardFormModel: any;
    public contactData: any;
    public selectedData: creditCardModel.SelectedData;
    public statesList: Array<any>;
    public loggedInfo: string;
    public customerCreditCards: Array<any>;
    public requiredAdditionalFields: any;
    public summaryInfoQuota: any;
    public isSoftUser: boolean;
    public editionMode: boolean;
    public foundCard: boolean;
    public disabledCvv: boolean;
    public $window: angular.IWindowService;
    public PmtConstants: PmtConstants;
    public PmtUtilsService: any;
    public $scope: angular.IScope;
    public $route: angular.route.IRouteService;
    public PmtModalService: any;
    public NewMainHeaderFacade: any;
    public $document: angular.IDocumentService;
    public localStorageService: angular.local.storage.ILocalStorageService;
    public CommonsUserUtilsService: CommonsUserUtilsService;
    public CurrencyService: any;
    public $rootScope: CommonsRootScope;
    public DccService: any;
    private lengthNumberCard: number;
    private statusNumberCard: boolean | null;
    private statusCvv: boolean | null;
    private timeOutLoading: ReturnType<typeof setTimeout>;
    private IBDC: creditCardModel.ObjetIBDC;
    private genericErrorCardNumber: number = 999;
    private prohibitedCardNumber: number = 6666;
    private genericErrorCvv: number = 88;
    private emptyErrorCode: number = 1;
    private isProhibitedCard: boolean = false;
    private isDccAvailable: boolean;
    private isQuotesDisabled: boolean;
    private creditCardType?: string;

    constructor (...injected: unknown[]) {
        bindCreditCardFormDependencies(this, injected);
        this.$scope.$on('iberiaPayError', this.iberiaPayError);
        this.$scope.$on('iberiaPayCreditCardError', this.iberiaPayCreditCardChange);
        this.$scope.$on('updateCreditCardError', this.updateCreditCardError);
        this.$scope.$on('dateSelected', this.dateChanged);
        const creditCardBinHandler = (event) => {
            this.handleProhibitedCard(event);
            this.handleDisabledQuotasOption(event);
            this.typeCreditCardSelected(event);
        };
        this.$scope.$on('$destroy', () => {
            document.removeEventListener('typecard', this.typeCreditCardSelectedEdition);
            document.removeEventListener('creditCardBin', creditCardBinHandler);
            document.removeEventListener('cvvstatus', this.cvvCreditCardEdition);
        });

        document.addEventListener('typecard', (this.typeCreditCardSelectedEdition) as EventListener);
        document.addEventListener('creditCardBin', creditCardBinHandler);
        document.addEventListener('dccData', (event: CustomEvent<DccModel.DccResponseEvent>) => {
            if(event.detail?.result) this.handleDcc(event.detail.result);
        });

        document.addEventListener('cvvstatus', (this.cvvCreditCardEdition) as EventListener);
    }
    $onInit = (): void => {
        this.IBDC = this.$window?.IBDC;
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.editionMode = true;
        this.errorCardNumberIbPay = null;
        this.errorCvvIbPay = null;
        this.foundCard = false;
        this.statusNumberCard = null;
        this.statusCvv = null;
        this.disabledCvv = false;
        this.lengthNumberCard = 0;
        if (this.issuerCountry && this.issuerCountry.code === 'ES') {
            this.zipCodeValidators = {
                maxLength: this.PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.MAX_LENGTH,
                minLength: this.PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.MIN_LENGTH,
                cleaner: this.PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.CLEANER,
                pattern: this.PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.PATTERN
            };
        } else {
            this.zipCodeValidators = {
                maxLength: this.PmtConstants.PATTERNS.MAX_LENGTH_ZIP_CODE,
                minLength: this.PmtConstants.PATTERNS.MIN_LENGTH_ZIP_CODE,
                cleaner: this.PmtConstants.PATTERNS.DOCS_CLEANER,
                pattern: this.PmtConstants.PATTERNS.DOCS_PATTERN
            };
        }
        if (this.submittedTab){
            this.updateCreditCardError();
        }
    };
    public IBDCExist = (): boolean => {
        return !!this.IBDC;
    };
    public checkNameOrSurname = (value: string): void => {
        let nameOrSurname: string, contactData: any;
        if (value === 'name') {
            nameOrSurname = this.contactData.ownerName;
            contactData = this.containerForm.name;
        } else if (value === 'surnames') {
            nameOrSurname = this.contactData.surnames;
            contactData = this.containerForm.surnames;
        }
        const check : boolean = this.PmtConstants.PATTERNS.NAME_SURNAME_PATTERN.test(nameOrSurname ? nameOrSurname.replace(/[\`\´]/g, '\'') : '');
        if (contactData) {
            contactData.$setValidity(value === 'name' ? 'nameInvalid' : 'surnameInvalid', check);
        }
    };
    public detectStateByZipCode = (zipCode: string): void => {
        let validate: boolean = false;
        if (this.issuerCountry.code === 'ES' && !isNaN(parseInt(zipCode))) {
            const detectStateByZipCodeInfo = this.PmtUtilsService.detectStateByZipCode(zipCode, this.statesList);
            this.selectedData.state = detectStateByZipCodeInfo.state;
            validate = (detectStateByZipCodeInfo.checker && (zipCode.length === this.PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.LENGTH));
            this.containerForm.zip_code.$setValidity('zipCodeInvalid', validate);
        }
    };
    public fillZipCodeByState = (state: any): void => {
        let validate: boolean = false;
        if (this.issuerCountry.code === 'ES') {
            const fillZipCodeByStateInfo = this.PmtUtilsService.fillZipCodeByState(state, this.selectedData.zipCode);
            if (fillZipCodeByStateInfo.changeZipCode || fillZipCodeByStateInfo.newZipCode) {
                this.selectedData.zipCode = fillZipCodeByStateInfo.newZipCode;
            }
            validate = (fillZipCodeByStateInfo.checker && (fillZipCodeByStateInfo.newZipCode.length === this.PmtConstants.PATTERNS.ZIP_CODE_MARKET.ES.LENGTH));
            this.containerForm.zip_code.$setValidity('zipCodeInvalid', !!validate);
        }
    };
    public changeIssuerCountry = (issuerCountry: string) => {
        this.$scope.$emit('changeIssuerCountryEvent', issuerCountry, this.selectedData.selectedCard, this.creditCardFormModel);
    };
    private iberiaPayError = (event: any, errorCode: number): void => {
        if (!this.submittedTab){ return; }
        if (errorCode === 12) {
            this.errorCvvIbPay = errorCode;
            return;
        }
        if (errorCode === 13) {
            this.applyIberiaPayCardAndCvvError(errorCode);
            return;
        }
        if (errorCode === 0) {
            this.clearIberiaPayFieldErrors(errorCode);
            return;
        }
        this.handleIberiaPayDefaultError(errorCode);
    };
    private applyIberiaPayCardAndCvvError = (errorCode: number): void => {
        this.errorCardNumberIbPay = errorCode;
        this.errorCvvIbPay = errorCode;
        this.$window?.IBDC?.addError(true, true);
    };
    private clearIberiaPayFieldErrors = (errorCode: number): void => {
        this.errorCardNumberIbPay = !this.foundCard ? this.genericErrorCardNumber : errorCode;
        this.containerForm.fieldCCIbPayInvalid = false;
        this.containerForm.fieldCVVIbPayInvalid = false;
        this.$window?.IBDC?.addError(true, false);
    };
    private handleIberiaPayDefaultError = (errorCode: number): void => {
        if (errorCode >= 400) {
            this.showIberiaPayReloadModal();
            return;
        }
        this.errorCardNumberIbPay = errorCode;
        this.containerForm.fieldCCIbPayInvalid = true;
        this.containerForm.fieldCVVIbPayInvalid = true;
        this.$window?.IBDC?.addError(true, true);
    };
    private showIberiaPayReloadModal = (): void => {
        const modalInfo = {
            title: 'MODAL_ERROR_TITLE',
            subtitle: 'ERROR_PAYMENT_MODAL_SUBTITLE',
            message: 'IBERIA_PAY_SERVICE_ERROR_UNEXPECTED',
            showbuttons: {
                accept: {
                    status: true,
                    text: 'IBERIA_PAY_SERVICE_ERROR_UNEXPECTED_ACCEPT',
                    accessibleText: 'IBERIA_PAY_SERVICE_ERROR_UNEXPECTED_ACCEPT'
                }
            }
        };
        this.PmtModalService.showGenericError(modalInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(() => {
            this.PmtModalService.closeAllCurrentModals();
            this.$route.reload();
        }, () => {
            this.PmtModalService.closeAllCurrentModals();
            this.$route.reload();
        });
    };
    private iberiaPayCreditCardChange = (event: any, isError: boolean): void => {
        const action = resolveCreditCardChangeAction({
            isProhibitedCard: this.isProhibitedCard,
            lengthNumberCard: this.lengthNumberCard,
            submittedTab: this.submittedTab,
            isError,
            genericErrorCardNumber: this.genericErrorCardNumber,
            prohibitedCardNumber: this.prohibitedCardNumber
        });
        if (action.type === 'prohibited-short') {
            this.errorCardNumberIbPay = action.errorCardNumberIbPay;
            this.isProhibitedCard = false;
            return;
        }
        if (action.type === 'prohibited-long') {
            this.errorCardNumberIbPay = action.errorCardNumberIbPay;
            this.containerForm.fieldCCIbPayInvalid = true;
            return;
        }
        if (action.type === 'invalid') {
            this.errorCardNumberIbPay = action.errorCardNumberIbPay;
            this.containerForm.fieldCCIbPayInvalid = true;
            return;
        }
        this.errorCardNumberIbPay = 0;
        this.containerForm.fieldCCIbPayInvalid = false;
        this.containerForm.fieldCVVIbPayInvalid = false;
    };
    private cvvCreditCardEdition = (event: CustomEvent<creditCardModel.CvvStatusEvent>): void => {
        const codeCvv = event?.detail?.code;
        this.statusCvv = codeCvv === 'OK';
        this.removeIframeError(false, true);
        if (!this.statusCvv && this.submittedTab) {
            this.errorCvvIbPay = codeCvv === 'EMPTY' ? this.emptyErrorCode : this.genericErrorCvv;
            this.containerForm.fieldCVVIbPayInvalid = true;
        } else {
            this.errorCvvIbPay = 0;
            this.containerForm.fieldCVVIbPayInvalid = false;
        }
    };
    private dateChanged = (): void => {
        this.$scope.$broadcast('unCheckQuotas');
    };

    private shouldQuotesBeDisabled = (event: CustomEvent<creditCardModel.CreditCardBinResponseEvent>) => {
        const countriesCodeList = ['BR', 'MX'];
        const isEligibleCountry =  countriesCodeList.includes(this.issuerCountry.code.toUpperCase());
        const isDebitCard = event.detail.cardType.toUpperCase() === 'DEBIT';
        const isCorporateCreditCard =
            event.detail.cardType.toUpperCase() === 'CREDIT'
            && event.detail.creditCardSubtype.toUpperCase() === 'BUSINESS';
        if (isEligibleCountry && isDebitCard) {
            return true;
        }
        return isEligibleCountry && isCorporateCreditCard;
    };

    private handleDisabledQuotasOption = (event: CustomEvent<creditCardModel.CreditCardBinResponseEvent>): void => {
        this.isQuotesDisabled = this.shouldQuotesBeDisabled(event);
        this.isQuotesDisabled
            ? this.$scope.$broadcast('disabledQutasOption', true)
            : this.$scope.$broadcast('disabledQutasOption', false);
        return;
    };

    private handleProhibitedCard = (event: CustomEvent<creditCardModel.CreditCardBinResponseEvent>): void => {
        this.isProhibitedCard = isProhibitedChileDebit(this.issuerCountry.code, event.detail.cardType);
    };

    private handleDcc = (result: DccModel.DccResult): void => {
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const dccData = {
            id: result.id,
            rate: result.rate,
            marginPercentage: result.marginPercentage,
            sourceTimestamp: result.sourceTimestamp,
            DCCPrice: {
                value: result.dccPrice.value,
                currencyCode: result.dccPrice.currencyCode
            },
            basePrice: {
                currency: paymentsInfo.currency
            },
            creditCardType: this.creditCardType
        };
        this.handleDccEmitter(dccData);
    };
    private typeCreditCardSelected = (event: CustomEvent<creditCardModel.CreditCardBinResponseEvent>): void => {
        this.handleDccEmitter();
        this.creditCardType = event.detail?.creditCardType;
        const foundType = this.resolveFoundCardType(event);
        const ccFee = resolveBinCcFee(
            event.detail?.ccFee,
            this.localStorageService.get('flowApp'),
            (flowApp) => this.isFlowAppWithFee(flowApp)
        );
        if (foundType) {
            this.localStorageService.set('binCardCountry', event.detail.issueCountry);
        } else {
            this.localStorageService.remove('binCardCountry');
        }
        this.updateCardSelected(foundType, ccFee);
        this.typeCardLoading = false;
        this.iberiaPayCreditCardChange(null, undefined);
        this.fetchGuestDccIfNeeded();
    };

    private resolveFoundCardType = (
        event: CustomEvent<creditCardModel.CreditCardBinResponseEvent>
    ): creditCardModel.SelectedCard | undefined => {
        if (this.isProhibitedCard) {
            return undefined;
        }
        return findSelectedCardTypeFromBin(
            this.creditCardFormModel.creditCardTypes,
            event.detail.creditCardType,
            event.detail.errorCode,
            this.localStorageService.get('typeCardIberiaPay')
        );
    };

    private fetchGuestDccIfNeeded = (): void => {
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const shouldFetch = shouldFetchGuestDccData({
            userLogged: this.localStorageService.get('userLogged'),
            dccAvailable: paymentsInfo.paymentMethods[0].dccAvailable,
            flowApp: this.localStorageService.get('flowApp'),
            onholdAppType: this.PmtConstants.APP_TYPES.ONHOLD,
            originalDccAvailable: paymentsInfo.originalPaymentMethods[0].dccAvailable
        });
        if (shouldFetch) {
            this.IBDC.getDccDataCreditCard();
        }
    };

    private handleDccEmitter = (dccData?) => {
        this.isDccAvailable = dccData? true : false;
        this.DccService.setDccData(dccData);
    };

    private isFlowAppWithFee (flowApp) {
        const flowsPermited = [
            'BBKI',
            'MMBOH',
            'MMBVC',
            'MMBUNIF',
            'PAOB',
            'PAOBONB',
            'PARE',
            'PAREONB'
        ];
        return flowsPermited.includes(flowApp);
    }
    private typeCreditCardSelectedEdition = (event: CustomEvent<creditCardModel.TypecardResponseEvent>): void =>{
        this.handleTypeCardLengthForDccAndQuotes(event.detail.length);
        if (event.detail.eventHandler === 'blur') {
            this.hideCardLoading();
            this.removeIframeError(true, false);
            return;
        }
        this.applyTypeCardEditionState(event);
    };

    private handleTypeCardLengthForDccAndQuotes = (length: number): void => {
        if (length === 8 && !this.isDccAvailable) {
            this.handleDccEmitter();
        }
        if (length < 8) {
            if (this.isDccAvailable){
                this.handleDccEmitter();
            }
            if (!this.isQuotesDisabled){
                this.$scope.$broadcast('disabledQutasOption', true);
            }
        }
    };

    private applyTypeCardEditionState = (event: CustomEvent<creditCardModel.TypecardResponseEvent>): void => {
        if (shouldClearSelectedCardOnShorten(
            this.lengthNumberCard,
            event.detail.length,
            this.selectedData?.selectedCard?.cardTypeCode
        )) {
            this.updateCardSelected(undefined);
        }
        this.typeCardLoading = resolveTypeCardLoadingState(event.detail.length, this.foundCard);
        this.statusNumberCard = !(event.detail.length < 8 || event.detail.resultCode !== 7);
        this.lengthNumberCard = event.detail.length;
        this.disabledCvv = !event.detail?.enabledCvv;
        this.localStorageService.set('typeCardIberiaPay', event.detail.code || null);
        this.iberiaPayCreditCardChange(null, !this.statusNumberCard);
    };
    private updateCardSelected = (selectedCard, fee = 0): void => {
        if (!selectedCard) {
            this.foundCard = false;
            delete this.selectedData.selectedCard;
            this.NewMainHeaderFacade.updateBasketOthers('CARD');
            this.$scope.$broadcast('unCheckQuotas');
            this.$scope.$emit('changeSelectedCreditCard', null);
            return;
        }
        this.foundCard = !!selectedCard;
        const typeFind = selectedCard;
        const paymentsInfo: { currency: CommonsCurrencyModel.CurrencyResponse } = this.localStorageService.get('paymentsInfo');
        typeFind.totalFee = fee;
        typeFind.fee = this.CurrencyService.formatPrice(paymentsInfo.currency, fee, true);
        typeFind.parsedFee = typeFind.fee;
        typeFind.totalToPay = this.creditCardFormModel.total + fee;
        this.selectedData.selectedCard = typeFind;
        this.NewMainHeaderFacade.updateBasketOthers('CARD', this.selectedData.selectedCard);
        this.$scope.$broadcast('unCheckQuotas');
        this.$scope.$emit('changeSelectedCreditCard', this.selectedData.selectedCard);
    };

    private getCreditCardError = (): number => {
        if (this.isProhibitedCard && this.lengthNumberCard !== 0) {
            this.containerForm.fieldCCIbPayInvalid = true;
            return this.prohibitedCardNumber;
        }
        if (this.lengthNumberCard === 0) {
            return this.emptyErrorCode;
        }
        return !this.statusNumberCard || this.statusNumberCard === null  ? this.genericErrorCardNumber : this.errorCardNumberIbPay;
    };
    private updateCreditCardError = (): void => {
        this.errorCardNumberIbPay = this.getCreditCardError();
        const errorRegisteredCvv = !this.statusCvv ? this.genericErrorCvv : this.errorCvvIbPay;
        this.errorCvvIbPay = this.statusCvv === null ? this.emptyErrorCode : errorRegisteredCvv;
    };
    private removeIframeError = (errorCreditCard, errorCvv): void => {
        if (shouldRemoveIframeError({
            statusNumberCard: this.statusNumberCard,
            errorCardNumberIbPay: this.errorCardNumberIbPay,
            errorCreditCard,
            statusCvv: this.statusCvv,
            errorCvvIbPay: this.errorCvvIbPay,
            errorCvv
        })) {
            this.$window?.IBDC?.removeError(errorCreditCard, errorCvv);
        }
    };
    private hideCardLoading = (): void => {
        clearTimeout(this.timeOutLoading);
        this.timeOutLoading = setTimeout(() => {
            this.typeCardLoading = false;
        }, 1000);
    };
}
