@Service(
    'ib-pmt-services-http-module',
    [
        '$rootScope',
        'PmtConstants',
        'PmtModalService',
        'CommonsHttpUtilsErrorService',
        '$location',
        '$timeout',
        'RedirectionService',
        '$window',
        '$route',
        'localStorageService',
        'DatalayerConstants',
        'DatalayerUtilsService',
        'DigitalDataService',
        'CommonsUtilService'
    ],
    []
)
class PmtHttpErrorManagement {
    constructor (
        private $rootScope: CommonsRootScope,
        private PmtConstants: PmtConstants,
        private PmtModalService: any, //change when migrate
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private RedirectionService: RedirectionService,
        private $window: ng.IWindowService,
        private $route: angular.route.IRouteService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private DatalayerConstants: DatalayerConstantsType,
        private DatalayerUtilsService: DatalayerUtilsService,
        private DigitalDataService: any,
        private CommonsUtilService: CommonsUtilService
    ) {}
    /**
     * Generate a block modal using the message and return home
     * @param {Object} errorObject the response message to the service
     */
    blockAndReturnError = (errorObject: httpErrorManagment.errorObject): void => {
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        let newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        if (
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.ONHOLD &&
            errorObject.errorCode === 409 &&
            errorObject.internalErrorCode === 'PMT_PPM_8009'
        ) {
            newPaymentsOptionInfo.title = 'REJECTED_PAYMENT_MODAL_TITLE';
        }
        newPaymentsOptionInfo = {
            ...newPaymentsOptionInfo,
            idModal: quadrigam,
            subtitle: 'ERROR_PAYMENT_MODAL_SUBTITLE',
            showbuttons: {
                accept: {
                    status: true,
                    text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_2',
                    accessibleText: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_2'
                }
            }
        };
        this.logicBlockAndReturn(errorObject, newPaymentsOptionInfo);
    };

    blockAndReturnErrorUpgrading = (errorObject: httpErrorManagment.errorObject): void => {
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        let newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        newPaymentsOptionInfo = {
            ...newPaymentsOptionInfo,
            idModal: quadrigam,
            title: 'MMB_ERROR_UPGRADING_AVIOS_TITLE',
            message: 'MMB_ERROR_UPGRADING_AVIOS_MESSAGE',
            showbuttons: {
                accept: {
                    status: true,
                    text: 'MODAL_ACCEPT',
                    accessibleText: 'MODAL_ACCEPT'
                }
            }
        };
        this.logicBlockAndReturn(errorObject, newPaymentsOptionInfo);
    };

    /**
     * Blocks the payment view during init when essential credit-card data services fail.
     * Uses the same reload modal as Iberia Pay / IBDC init failures.
     */
    blockPaymentInitDataError = (errorObject: httpErrorManagment.errorObject): void => {
        console.error('[PMT] Payment init data error (reload modal)', {
            url: errorObject?.url,
            errorCode: errorObject?.errorCode,
            internalErrorCode: errorObject?.internalErrorCode,
            message: errorObject?.message,
            actualAttemps: errorObject?.actualAttemps,
            flowApp: this.localStorageService.get('flowApp')
        });
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        const newPaymentsOptionInfo = {
            title: 'IBERIA_PAY_ERROR_GENERAL_TITLE',
            message: 'IBERIA_PAY_ERROR_GENERAL',
            needsTranslate: true,
            idModal: quadrigam,
            showbuttons: {
                accept: {
                    status: true,
                    text: 'IBERIA_PAY_ERROR_GENERAL_BUTTON',
                    accessibleText: 'IBERIA_PAY_ERROR_GENERAL_BUTTON'
                }
            }
        };
        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();
        this.localStorageService.remove('errorModalId');
        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
            () => {
                this.$window.location.reload();
            },
            () => {
                this.$window.location.reload();
            }
        );
    };

    private redirectToInitReloadIfNotPaymentIssue = (errorObject: httpErrorManagment.errorObject): boolean => {
        if (!this.localStorageService.get('errorIssueService')) {
            this.blockPaymentInitDataError(errorObject);
            return true;
        }
        return false;
    };

    private logicBlockAndReturn = (errorObject: httpErrorManagment.errorObject, newPaymentsOptionInfo: any, forceReloadPage = false): void => {
        let reloadedPage = forceReloadPage;
        let noDisplayModal = false;
        const reloadPage = (): void => {
            if (reloadedPage) {
                this.PmtModalService.closeAllCurrentModals();
                this.localStorageService.remove('putWithoutOfferBin');
                this.$route.reload();
            }
        };
        if (errorObject.errorCode === 204) {
            this.localStorageService.remove('redirectionPaymentCallback');
        }
        if (
            ((errorObject.errorCode === 412 && errorObject.internalErrorCode !== 'PMT_PPM_8005') || errorObject.errorCode === 410) &&
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.CHECKIN
        ) {
            noDisplayModal = true;
            this.$location.path('/ibecbp');
        } else if (
            (errorObject.errorCode === 412 || errorObject.errorCode === 410) &&
            errorObject.internalErrorCode === 'PMT_PPM_9009' &&
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES
        ) {
            noDisplayModal = true;
            this.localStorageService.remove('passengerBaggagesTrips');
            this.localStorageService.remove('seatsQuanty');
            this.$location.path('/ibdash');
        }
        if (
            (errorObject.errorCode === 500 || !errorObject.errorCode || errorObject.errorCode === -1 || this.localStorageService.get('putWithoutOfferBin')) &&
            errorObject.internalErrorCode !== 'PMT_PPM_FRAUD_1001' &&
            errorObject.internalErrorCode !== 'PMT_PPM_FRAUD_1002' &&
            errorObject.internalErrorCode !== 'PMT_PPM_FRAUD_1003'
        ) {
            reloadedPage = true;
        }
        if (this.CommonsUtilService?.checkWarningCheckOut?.()) {
            newPaymentsOptionInfo.submessage = 'DISINVOICING_MODAL_MESSAGE';
        }
        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();
        this.localStorageService.remove('errorModalId');
        if (!noDisplayModal) {
            this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
                reloadPage,
                reloadPage
            );
        }
    };

    voucherError = (errorObject: httpErrorManagment.errorObject): void => {
        if (errorObject && errorObject.message) {
            this.$rootScope.$broadcast('errorOnVoucherService', errorObject.message);
        } else {
            this.$rootScope.$broadcast('errorOnVoucherService');
            this.PmtModalService.showGenericError(errorObject).result.then(angular.noop, angular.noop);
        }
    };

    /**
     * Generate a block modal using the message and return payment flow
     * @param {Object} errorObject the response message to the service
     */
    blockCancelAndReturnHomeError = (errorObject: httpErrorManagment.errorObject): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;

        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();

        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'MODAL_CANCEL_BUTTON',
            accessibleText: 'MODAL_CANCEL_BUTTON'
        };

        if (this.CommonsUtilService?.checkWarningCheckOut?.()) {
            newPaymentsOptionInfo.submessage = 'DISINVOICING_MODAL_MESSAGE';
        }

        newPaymentsOptionInfo.subtitle = 'ERROR_PAYMENT_MODAL_SUBTITLE';
        newPaymentsOptionInfo.idModal = quadrigam;

        if (errorObject.errorCode === 412 && errorObject.internalErrorCode === 'PMT_PPM_FRAUD_1004') {
            newPaymentsOptionInfo.subtitle = 'MMB_DISRUPTION_REBOOK_ERROR_SUB_TITLE_1007';
            newPaymentsOptionInfo.showbuttons.accept.text = 'MMB_FRAUD_ERROR_MODAL_BUTTON_TEXT';
            newPaymentsOptionInfo.showbuttons.accept.accessibleText = 'MMB_FRAUD_ERROR_MODAL_BUTTON_TEXT';
        }
        this.localStorageService.remove('errorModalId');
        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(() => {
            this.RedirectionService.externalRedirect(this.$window.location.origin);
        });
    };

    /**
     * Generate a block modal using the message and return payment flow
     * @param {Object} errorObject the response message to the service
     */
    blockAndReturnHomeError = (errorObject: httpErrorManagment.errorObject): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        const flowApp: string = this.localStorageService.get('flowApp');

        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();

        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: flowApp === 'BBKI' ? 'MODAL_ACCEPT_BUTTON' : 'MODAL_CANCEL_BUTTON',
            accessibleText: flowApp === 'BBKI' ? 'MODAL_ACCEPT_BUTTON' : 'MODAL_CANCEL_BUTTON'
        };

        if (this.CommonsUtilService?.checkWarningCheckOut?.()) {
            newPaymentsOptionInfo.submessage = 'DISINVOICING_MODAL_MESSAGE';
        }

        newPaymentsOptionInfo.title = 'MODAL_ERROR_TITLE';

        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(() => {
            if (flowApp === 'MMBOH' || flowApp === 'BBKI') {
                this.$location.path('/chktrp');
            } else this.$location.path('/ibbkerror');
        });
    };

    /**
     * Create a Modal Error for a Rejected Credit Card
     * @param {Object} errorObject
     */
    rejectedCreditCardError = (errorObject: httpErrorManagment.errorObject): void => {
        if (this.redirectToInitReloadIfNotPaymentIssue(errorObject)) {
            return;
        }
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url),
            errorIssueService: any = this.localStorageService.get('errorIssueService');

        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();

        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3',
            accessibleText: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3'
        };
        newPaymentsOptionInfo.title = 'REJECTED_PAYMENT_MODAL_TITLE';
        newPaymentsOptionInfo.subtitle = 'ERROR_PAYMENT_MODAL_SUBTITLE';

        if (this.CommonsUtilService?.checkWarningCheckOut?.()) {
            newPaymentsOptionInfo.submessage = 'DISINVOICING_MODAL_MESSAGE';
        }

        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
            (type) => {
                this.localStorageService.set('flowApp', 'BBKIOH');
                this.$rootScope.$emit('paymentOnHoldOption', false, false, true);
            },
            (): void => {
                if (this.localStorageService.get('putWithoutOfferBin')) {
                    this.localStorageService.remove('putWithoutOfferBin');
                    this.localStorageService.remove('errorIssueService');
                    this.$route.reload();
                } else {
                    errorIssueService.otherPayment = true;
                    this.localStorageService.set('errorIssueService', errorIssueService);
                    this.$route.reload();
                }
            }
        );
    };

    /**
     *  Recive the form data necessary to generate all the redirection and launch a event to pmt-controller
     * @param {Object} formData All information necesary to generate external form , this info is  return by service issue when code error is 451
     */
    externalPayForm = (formData: httpErrorManagment.formData): void => {
        if (
            formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS_IBERIA_PAY_INSURANCE &&
            formData.baseVersion === '3DS2' &&
            formData.provider === 'ONESAIT'
        ) {
            this.$rootScope.$broadcast('generate3ds2OneSiteIframe', formData);
        } else if (
            (formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS ||
                formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS_IBERIA_PAY ||
                formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS_IBERIA_PAY_INSURANCE) &&
            formData.target !== 'IFRAME'
        ) {
            this.$rootScope.$broadcast('generate3DSRedirectForm', formData);
        } else if (formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS && formData.target === 'IFRAME') {
            this.$rootScope.$broadcast('generate3DSModalForm', formData);
        } else if (formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_EXTERNAL_FORMS) {
            this.$rootScope.$broadcast('generateExtenalButtonForm', formData);
        } else if (
            formData?.component?.url &&
            formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS2_REDIRECT &&
            formData.provider === 'ONESAIT'
        ) {
            if (formData.baseVersion === '3DS2') {
                this.$rootScope.$broadcast('generate3ds2OneSiteIframe', formData);
            } else {
                this.$rootScope.$broadcast('generate3DSRedirectForm', formData);
            }
        } else if (formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_3DS2_REDIRECT) {
            this.$rootScope.$broadcast('generate3ds2AdyenComponent', formData);
        } else if (formData.type === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_REDIRECT_AFOP) {
            formData.redirectURL = formData.redirectUrl;
            switch (formData.provider) {
                    case 'PAYPAL':
                        this.$rootScope.$broadcast('generateAfopPaypal', formData);
                        break;
                    case 'NEMURU':
                        this.$rootScope.$broadcast('generateAfopNemuru', formData);
                        break;
                    case 'MERCADO_PAGO':
                    case 'MERCADOPAGO':
                        this.$rootScope.$broadcast('generateAfopMercadoPago', formData);
                        break;
                    default:
                        this.$rootScope.$broadcast('generateAfopRedirect', formData);
                        break;
            }
        }
    };

    /**
     * Redirect to general error page
     */
    lostComunication = (): void => {
        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();
        if (
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE ||
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED
        ) {
            this.$rootScope.$broadcast('changeStep', this.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, this.PmtConstants.COMPONENT_PAGE.COMMUNICATION_LOST);
        } else {
            this.$location.path('/ibbker');
        }
    };

    /**
     * Runs HTTP-408 Error Handling
     * @param {Object} errorObject - the error object with the actual attemps callBack function or the response message returned for the service
     */
    timeOutError = (errorObject: httpErrorManagment.errorObject): void => {
        if (errorObject.actualAttemps < this.PmtConstants.numAttemps) {
            this.$timeout(errorObject.paymentMethodCallback, this.PmtConstants.timeWait);
        } else {
            this.blockAndReturnHomeError(errorObject);
        }
    };

    /**
     * Runs HTTP-401 Error Handling
     * @param {Object} errorObject - the error object with the actual attemps callBack function or the response message returned for the service
     */
    unauthorizedError = (errorObject: httpErrorManagment.errorObject): void => {
        if (errorObject.actualAttemps >= this.PmtConstants.numAttemps) {
            this.blockAndReturnHomeError(errorObject);
        } else {
            this.CommonsHttpUtilsErrorService.unauthorizedError(errorObject.actualAttemps, errorObject.paymentMethodCallback, {
                errorCode: errorObject.errorCode,
                data: {}
            });
        }
    };

    /**
     * Retry a payment with PCC error
     * @param {*} errorObject the response message returned for the service
     */
    retryPCC = (errorObject: httpErrorManagment.errorObject): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;

        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();
        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_1',
            accessibleText: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_1'
        };

        if (this.CommonsUtilService?.checkWarningCheckOut?.()) {
            newPaymentsOptionInfo.submessage = 'DISINVOICING_MODAL_MESSAGE';
        }

        newPaymentsOptionInfo.subtitle = 'PCC_CARD_ERROR_MODAL_SUBTITLE';
        newPaymentsOptionInfo.idModal = quadrigam;
        this.localStorageService.remove('errorModalId');
        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(() => {
            this.localStorageService.remove('errorIssueService');
            this.$rootScope.$emit('submitedPaymentPCCEvent', true, false, false);
        });
    };

    /**
     * Retry a payment with PCC error or create a On Hold Booking
     * @param {*} errorObject the response message returned for the service
     */
    retryPCCOrOnHold = (errorObject: httpErrorManagment.errorObject): void => {
        if (this.redirectToInitReloadIfNotPaymentIssue(errorObject)) {
            return;
        }
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url),
            errorIssueService: any = this.localStorageService.get('errorIssueService');
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;

        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();

        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_1',
            accessibleText: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_1'
        };
        
        newPaymentsOptionInfo.showbuttons.cancel = {
            status: true,
            text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_2',
            accessibleText: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_2'
        };
        newPaymentsOptionInfo.showbuttons.onHold = {
            status: true,
            text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3',
            accessibleText: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3'
        };

        if (this.CommonsUtilService?.checkWarningCheckOut?.()) {
            newPaymentsOptionInfo.submessage = 'DISINVOICING_MODAL_MESSAGE';
        }

        newPaymentsOptionInfo.subtitle = 'PCC_CARD_ERROR_MODAL_SUBTITLE';
        newPaymentsOptionInfo.idModal = quadrigam;
        this.localStorageService.remove('errorModalId');
        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
            (type: string) => {
                if (type) {
                    this.localStorageService.set('flowApp', 'BBKIOH');
                    this.$rootScope.$emit('paymentOnHoldOption', false, false, true);
                } else {
                    this.$rootScope.$emit('submitedPaymentPCCEvent', true, false, false);
                }
            },
            () => {
                if (this.localStorageService.get('putWithoutOfferBin')) {
                    this.localStorageService.remove('putWithoutOfferBin');
                    this.localStorageService.remove('errorIssueService');
                    this.$route.reload();
                } else {
                    errorIssueService.otherPayment = true;
                    this.localStorageService.set('errorIssueService', errorIssueService);
                    this.$route.reload();
                }
            }
        );
    };

    /**
     * Generate modal to keep onhold when issue service return error 449 and internalError code PMT_PPM_
     * @param {Object} errorObject the response message returned for the service
     */
    keepOnHold = (errorObject: httpErrorManagment.errorObject): void => {
        if (this.redirectToInitReloadIfNotPaymentIssue(errorObject)) {
            return;
        }
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url),
            errorIssueService: any = this.localStorageService.get('errorIssueService');
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        newPaymentsOptionInfo.title = 'REJECTED_PAYMENT_MODAL_TITLE';
        newPaymentsOptionInfo.subtitle = 'ERROR_PAYMENT_MODAL_SUBTITLE';
        newPaymentsOptionInfo.showbuttons.onHold = { status: true, text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3' };
        if (errorObject.internalErrorCode === 'PMT_PPM_8009') {
            newPaymentsOptionInfo.showbuttons.cancel = { status: true, text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_2' };
        }
        newPaymentsOptionInfo.idModal = quadrigam;
        this.localStorageService.remove('errorModalId');
        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();
        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
            (): void => {
                this.localStorageService.set('flowApp', 'BBKIOH');
                this.$rootScope.$emit('paymentOnHoldOption', false, false, true);
            },
            (): void => {
                if (this.localStorageService.get('putWithoutOfferBin')) {
                    this.localStorageService.remove('putWithoutOfferBin');
                    this.localStorageService.remove('errorIssueService');
                    this.$route.reload();
                } else {
                    errorIssueService.otherPayment = true;
                    this.localStorageService.set('errorIssueService', errorIssueService);
                    this.$route.reload();
                }
            }
        );
    };

    /**
     * Create a object for the Generic Modal Error
     * @param {String} message
     */
    getNewPaymentOptionsInfo = (message?: string, errorCode?: number, internalErrorCode?: string, url?: string): httpErrorManagment.newPaymentOptionsInfo => {
        const newPaymentOptionsInfo = {
            title: 'PCC_CARD_ERROR_MODAL_TITLE',
            subtitle: '',
            message: message ? message : 'REST_SERVICE_ERROR_UNEXPECTED',
            submessage: '',
            showbuttons: {},
            errorCode: errorCode,
            internalErrorCode: internalErrorCode,
            urlError: url
        };
        return newPaymentOptionsInfo;
    };

    noPaymentGoConfirmation = (errorObject: httpErrorManagment.errorObject): void => {
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get('errorModalId')
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        const actionNoPaymentGoConfirmation = () => {
            this.$rootScope.$broadcast('noPaymentGoConfirmation', errorObject);
        };
        if (
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE ||
            this.localStorageService.get('flowApp') === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED
        ) {
            if (
                errorObject.internalErrorCode === 'PMT_PPM_FRAUD_1001' ||
                errorObject.internalErrorCode === 'PMT_PPM_FRAUD_1002' ||
                errorObject.internalErrorCode === 'PMT_PPM_FRAUD_1003'
            ) {
                newPaymentsOptionInfo.showbuttons.accept = {
                    status: true,
                    text: 'RETRY',
                    accessibleText: 'RETRY'
                };

                newPaymentsOptionInfo.idModal = quadrigam;
                newPaymentsOptionInfo.title = 'MMB_ALERT_IMPORTANT';
                newPaymentsOptionInfo.subtitle = 'MMB_DISRUPTION_REBOOK_ERROR_SUB_TITLE_1007';

                this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
                    actionNoPaymentGoConfirmation,
                    actionNoPaymentGoConfirmation
                );
            } else {
                actionNoPaymentGoConfirmation();
            }
        } else {
            this.blockAndReturnError(errorObject);
        }
    };

    binControlError = (errorObject: httpErrorManagment.errorObject): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url),
            errorIssueService = this.localStorageService.get('errorIssueService'),
            quadrigam: string = this.localStorageService.get('errorModalId')
                ? this.localStorageService.get('errorModalId')
                : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        newPaymentsOptionInfo.title = 'OFFER_BIN_ERROR_MODAL_TITLE';
        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'OFFER_BIN_ERROR_MODAL_BUTTON_TEXT_1',
            accessibleText: 'OFFER_BIN_ERROR_MODAL_BUTTON_TEXT_1'
        };
        newPaymentsOptionInfo.showbuttons.cancel = {
            status: true,
            text: 'OFFER_BIN_ERROR_MODAL_BUTTON_TEXT_2',
            accessibleText: 'OFFER_BIN_ERROR_MODAL_BUTTON_TEXT_2'
        };
        newPaymentsOptionInfo.idModal = quadrigam;
        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();
        this.localStorageService.remove('errorModalId');
        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
            (): void => {
                /* INIT DELETE GA4 MIGRATION*/
                const elegibleBono = { elegibleBono: 'NO' };
                this.DatalayerUtilsService.addDataLayerInfo(elegibleBono);
                /* FINISH DELETE GA4 MIGRATION*/
                const eligibleVoucher = { EligibleVoucher: 'NO' };
                this.DatalayerUtilsService.addDigitalDataInfo(eligibleVoucher);
                this.localStorageService.set('putWithoutOfferBin', true);
                /* INIT DELETE GA4 MIGRATION */
                this.DatalayerUtilsService.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION */
                this.deleteVoucherFromStorage();
                this.DigitalDataService.emitViewEvent();
                this.$rootScope.$emit('submitedPaymentPCCEvent', 'offerBin', false, false);
            },
            (): void => {
                const voucherDeleteInfo = this.localStorageService.get('voucherDeleteInfo');
                if (voucherDeleteInfo) {
                    this.localStorageService.remove('errorIssueService');
                    if (voucherDeleteInfo) {
                        this.$rootScope.$broadcast('binSlectAnotherPayment', voucherDeleteInfo, false);
                    } else {
                        this.$route.reload();
                    }
                } else {
                    this.localStorageService.remove('errorIssueService');
                    this.$route.reload();
                }
            }
        );
    };

    /**
     * Deletes Voucher From Session Storage in binControlErrorManagement
     */
    private deleteVoucherFromStorage = (): void => {
        const paymentsInfo = this.localStorageService.get('paymentsInfo');
        const discounts = paymentsInfo?.appliedDiscounts?.types;
        const voucher = discounts?.VOUCHER;
        const isOnlyVoucher = Object.keys(discounts ?? {}).length === 1 && voucher;

        if (voucher) {
            delete paymentsInfo.appliedDiscounts.types.VOUCHER;
        }

        if(isOnlyVoucher) {
            paymentsInfo.appliedDiscounts = { status: false };
        }

        this.localStorageService.set('paymentsInfo', paymentsInfo);
    };

    /**
     * This function return user at dashboard view when paymentMethods return a error 412 and not have any paymentMethods or
     * the user dont have any for payment in voluntary change flow and change order service's return a error.
     *
     *  */
    blockAndReturnDashboard = (): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(),
            nothingToPay = this.localStorageService.get('noPaymentVCFlow') || false;
        const backToDash = () => {
            if (nothingToPay) {
                this.localStorageService.remove('noPaymentVCFlow');
                this.PmtModalService.closeAllCurrentModals();
                this.$rootScope.$emit('changeTabEvent', { name: 'management', isSubtab: false });
                this.$rootScope.$emit('reloadImportOrder');
            } else {
                this.$location.path('/ibdash');
            }
        };
        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();

        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'MODAL_CANCEL_BUTTON',
            accessibleText: 'MODAL_CANCEL_BUTTON'
        };

        newPaymentsOptionInfo.title = 'MODAL_ERROR_TITLE';

        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
            backToDash,
            backToDash
        );
    };

    blockAndSearchNewOrSameFlight = (errorObject: httpErrorManagment.errorObject): void => {
        const flowApp = this.localStorageService.get('flowApp');
        this.PmtModalService.finishWaiting();

        if (flowApp === 'BBKI') {
            this.PmtModalService.showNewOrSameFlightModal(
                {
                    title: 'IBBKERROR_TEXT_SORRY',
                    body: errorObject.message,
                    leftButton: 'MODAL_BUTTON_SAME_SEARCH',
                    rightButton: 'MODAL_BUTTON_NEW_SEARCH'
                },
                true,
                'ib-modal-cancelled-flight'
            ).result.then((response: any): void => {
                response ? this.RedirectionService.externalRedirect(this.$window.location.origin) : this.$location.path('/chktrp');
            });
        }
    };

    fullAviosError = (errorObject: httpErrorManagment.errorObject): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        const quadrigam: string = this.localStorageService.get('errorModalId')
                ? this.localStorageService.get('errorModalId')
                : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE,
            reloadedPage = false,
            noDisplayModal = false;
        const reloadPage = () => {
            if (reloadedPage) {
                this.PmtModalService.closeAllCurrentModals();
                this.$route.reload();
            }

            this.$window.scrollTo(0, 0);
        };
        this.PmtModalService.finishWaiting();
        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'FULL_PAY_AVIOS_ERROR_BUTTON',
            accessibleText: 'FULL_PAY_AVIOS_ERROR_BUTTON'
        };
        newPaymentsOptionInfo.title = 'FULL_PAY_AVIOS_ERROR_TITLE';
        newPaymentsOptionInfo.message = 'FULL_PAY_AVIOS_ERROR_MESSAGE';
        newPaymentsOptionInfo.idModal = quadrigam;
        this.localStorageService.remove('errorModalId');
        if (!noDisplayModal) {
            this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
                reloadPage,
                reloadPage
            );
            this.$rootScope.$broadcast('errorFullAvios', errorObject);
        }
    };
    /**
     * Generate modal to control SARA errors
     * @param {Object} errorObject the response message returned for the service
     */
    controlSaraErrors = ( error: httpErrorManagment.errorObject, data: any ): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo( error.message, error.errorCode, error.internalErrorCode, error.url ),
            errorIssueService: any = this.localStorageService.get( 'errorIssueService' ) || { data: data, otherPayment: false };
        const quadrigam: string = this.localStorageService.get('errorModalId')
            ? this.localStorageService.get( 'errorModalId' )
            : this.DatalayerConstants.DATALAYER_MODAL_ID.STATE.BLANKSPACE;
        const calcelAndGoToOrigin = (): void => {
            if ( this.localStorageService.get( 'putWithoutOfferBin' ) ) {
                this.localStorageService.remove( 'putWithoutOfferBin' );
                this.localStorageService.remove( 'errorIssueService' );
            } else {
                errorIssueService.otherPayment = true;
                this.localStorageService.set( 'errorIssueService', errorIssueService );
            }
            this.RedirectionService.externalRedirect( this.$window.location.origin );
        };
        newPaymentsOptionInfo.title = 'REJECTED_PAYMENT_MODAL_TITLE';
        newPaymentsOptionInfo.subtitle = 'ERROR_PAYMENT_MODAL_SUBTITLE';
        newPaymentsOptionInfo.idModal = quadrigam;
        this.localStorageService.remove( 'errorModalId' );
        this.$rootScope.$broadcast( 'endPaymentEventCard', false );
        this.PmtModalService.finishWaiting();
        if ( error.internalErrorCode === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_RESIDENT_NOT_AVAILABLE_GO_ON_HOLD ) {
            const paymentsInfo: any = this.localStorageService.get( 'paymentsInfo' );
            newPaymentsOptionInfo.showbuttons.accept = { status: true, text: 'PCC_CARD_ERROR_MODAL_BUTTON_TEXT_3' };
            newPaymentsOptionInfo.showbuttons.cancel = { status: true, text: 'IBBKERROR_TEXT_BUTTON' };
            paymentsInfo.paymentMethods = data.paymentOptions.paymentMethods;
            this.localStorageService.set( 'paymentsInfo', data.paymentOptions );
            this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
                (): void => {
                    this.localStorageService.set('flowApp', 'BBKIOH');
                    this.$rootScope.$emit('paymentOnHoldOption', false, false, true);
                },
                calcelAndGoToOrigin );
        }
        if ( error.internalErrorCode === this.PmtConstants.PAYMENT_ERRORS.INTERNAL_ERROR_DATA_CODE_RESIDENT_NOT_AVAILABLE ) {
            newPaymentsOptionInfo.showbuttons.accept = { status: true, text: 'IBBKERROR_TEXT_BUTTON' };
            this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
                calcelAndGoToOrigin, (): void => {} );
        }
    };

    blockAndReturnIbCose = (errorObject: httpErrorManagment.errorObject): void => {
        const newPaymentsOptionInfo = this.getNewPaymentOptionsInfo(errorObject.message, errorObject.errorCode, errorObject.internalErrorCode, errorObject.url);
        const flowApp: string = this.localStorageService.get('flowApp');

        this.$rootScope.$broadcast('endPaymentEventCard', false);
        this.PmtModalService.finishWaiting();

        newPaymentsOptionInfo.showbuttons.accept = {
            status: true,
            text: 'MODAL_ACCEPT_BUTTON',
            accessibleText: 'MODAL_ACCEPT_BUTTON'
        };

        newPaymentsOptionInfo.title = 'MODAL_ERROR_PAYMENT_UPG_TITLE';
        newPaymentsOptionInfo.message = 'MODAL_ERROR_PAYMENT_UPG_TEXT';

        this.PmtModalService.showGenericError(newPaymentsOptionInfo, true, this.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(() => {
            this.$location.path('/ibcose');
        });
    };
}
