@Service('ib-pmt-services-http-module', ['PmtHttpErrorManagement', 'PmtConstants', '$filter', 'localStorageService'], [])
export class PmtHttpErrorFilter {
    private errorHandlerList = {
        400: { apply: this.PmtHttpErrorManagement.rejectedCreditCardError },
        '400PMT_PPM_FRAUD_1002': { apply: this.PmtHttpErrorManagement.noPaymentGoConfirmation },
        401: { apply: this.PmtHttpErrorManagement.unauthorizedError },
        '412PMT_PPM_8005': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        '400SSE_ORM_900517': 'PCC',
        '400SSE_ORM_900519': 'PCC',
        '400SSE_ORM_7401': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        '400SSE_ORM_7406': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        404: { apply: this.PmtHttpErrorManagement.blockAndReturnHomeError },
        '404VCH_VCH_11001': { apply: this.PmtHttpErrorManagement.voucherError },
        '404PMT_PPM_FRAUD_1001': { apply: this.PmtHttpErrorManagement.noPaymentGoConfirmation },
        '404SSE_ORM_7402': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        '409VCH_VCH_11000': { apply: this.PmtHttpErrorManagement.voucherError },
        '409ASS_FASS_9042': { apply: this.PmtHttpErrorManagement.voucherError },
        408: { apply: this.PmtHttpErrorManagement.timeOutError },
        '409PMT_PPM_9010': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        '409SSE_ORM_7403': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        '410SSE_ORM_9999': { apply: this.PmtHttpErrorManagement.blockAndReturnHomeError },
        '410PMT_PPM_8013': { apply: this.PmtHttpErrorManagement.blockAndReturnHomeError },
        '412PMT_PPM_8014': { apply: this.PmtHttpErrorManagement.retryPCC },
        '412PMT_PPM_9004': 'PCC',
        '412PMT_PPM_FRAUD_1004': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        '412PMT_PPM_8036': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        '412PMT_PPM_9010': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        '412SSE_ORM_900552': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        '412SSE_ORM_9004': { apply: this.PmtHttpErrorManagement.blockAndReturnError },
        '412SSE_ORM_900555': { apply: this.PmtHttpErrorManagement.blockAndReturnHomeError },
        '412PMT_PPM_9009': { apply: this.PmtHttpErrorManagement.noPaymentGoConfirmation },
        '412SSE_ORM_7404': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        '412SSE_ORM_7405': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        417: { apply: this.PmtHttpErrorManagement.lostComunication },
        '428SSE_ORM_900605': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        449: { apply: this.PmtHttpErrorManagement.rejectedCreditCardError },
        '449PMT_PPM_8014': { apply: this.PmtHttpErrorManagement.retryPCCOrOnHold },
        '449PMT_PPM_8015': { apply: this.PmtHttpErrorManagement.keepOnHold },
        '449PMT_PPM_8036': { apply: this.PmtHttpErrorManagement.keepOnHold },
        '449PMT_PPM_8009': { apply: this.PmtHttpErrorManagement.keepOnHold },
        451: { apply: this.PmtHttpErrorManagement.externalPayForm },
        500: { apply: this.PmtHttpErrorManagement.blockAndReturnError },
        '500PMT_PPM_8001': { apply: this.PmtHttpErrorManagement.blockCancelAndReturnHomeError },
        '500PMT_PPM_FRAUD_1003': { apply: this.PmtHttpErrorManagement.noPaymentGoConfirmation },
        '412PMT_PPM_8031': { apply: this.PmtHttpErrorManagement.binControlError },
        '412PMT_PPM_8032': { apply: this.PmtHttpErrorManagement.binControlError },
        '449PMT_PPM_8033': { apply: this.PmtHttpErrorManagement.keepOnHold },
        '409ASS_FASS_9039': { apply: this.PmtHttpErrorManagement.voucherError },
        '412SSE_ORM_9143': { apply: this.PmtHttpErrorManagement.blockAndReturnHomeError },
        '412SSE_ORM_9144': { apply: this.PmtHttpErrorManagement.blockAndSearchNewOrSameFlight },
        'NOTHING_TO_PAY_VC': { apply: this.PmtHttpErrorManagement.blockAndReturnDashboard },
        '449SSE_ORM_900606': { apply: this.PmtHttpErrorManagement.controlSaraErrors },
        '428SSE_ORM_900617': { apply: this.PmtHttpErrorManagement.controlSaraErrors },
        '409ASS_FASS_9208': { apply: this.PmtHttpErrorManagement.blockAndReturnIbCose }
    };
    constructor (
        private PmtHttpErrorManagement: PmtHttpErrorManagement,
        private PmtConstants: PmtConstants,
        private $filter: angular.IFilterService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    errorHandlerFactory = (httpError: number, errorObject, isUpgrading?: boolean): boolean => {
        const procesedError = this.processGeneralPmtError(errorObject.response, errorObject.actualAttemps, errorObject.paymentMethodCallback, errorObject.url),
            flowApp: string = this.localStorageService.get('flowApp'),
            allowErrors = [401, 408];
        let handler: { apply: any; };
        const handlerKey = httpError + procesedError.internalErrorCode;
        const requestUrl: string = errorObject.url || '';

        if (this.isAdditionalFieldsRequest(requestUrl) && errorObject.requestMethod === 'POST') {
            this.PmtHttpErrorManagement.blockAndReturnError(procesedError);
            return !(httpError === 408 || httpError === 401);
        }

        if (this.shouldUsePaymentInitDataErrorHandler(httpError, requestUrl, procesedError.internalErrorCode)) {
            this.PmtHttpErrorManagement.blockPaymentInitDataError(procesedError);
            return !(httpError === 408 || httpError === 401);
        }

        handler = this.errorHandlerList[ handlerKey ] || {
            apply: isUpgrading ? this.PmtHttpErrorManagement.blockAndReturnErrorUpgrading : this.PmtHttpErrorManagement.blockAndReturnError
        };
        if (allowErrors.indexOf(httpError) === -1) {
            this.localStorageService.remove('redirectionPaymentCallback');
        }
        if (
            (flowApp === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) &&
            this.localStorageService.get('noPaymentVCFlow') &&
            httpError !== 417 &&
            httpError !== 412 &&
            procesedError.internalErrorCode !== 'PMT_PPM_8015' &&
            procesedError.internalErrorCode !== 'PMT_PPM_FRAUD_1001' &&
            procesedError.internalErrorCode !== 'PMT_PPM_FRAUD_1002' &&
            procesedError.internalErrorCode !== 'PMT_PPM_FRAUD_1003'
        ) {
            handler = this.errorHandlerList.NOTHING_TO_PAY_VC;
        }
        if ( handlerKey === '449SSE_ORM_900606' || handlerKey === '428SSE_ORM_900617' ) {
            handler.apply( procesedError, errorObject.response.data );
            return !(httpError === 408 || httpError === 401);
        }
        if (httpError !== 451) {
            if (errorObject.paymentMethodCallback && errorObject.paymentMethodCallback.name === 'aviosErrorCallback') {
                handler = { apply: this.PmtHttpErrorManagement.fullAviosError };
            }
            handler.apply(procesedError);
        } else {
            handler.apply(errorObject.response.data);
        }
        return !(httpError === 408 || httpError === 401);
    };

    handlePaymentInitDataError = (httpError: number, errorObject): boolean => {
        if (httpError === 408 || httpError === 401) {
            return this.errorHandlerFactory(httpError, errorObject);
        }
        const requestUrl: string = errorObject.url || '';
        if (!this.isEssentialInitDataRequest(requestUrl)
            || this.localStorageService.get('errorIssueService')
            || this.localStorageService.get('modelPaymentData')) {
            return this.errorHandlerFactory(httpError, errorObject);
        }
        const processedError = this.processGeneralPmtError(
            errorObject.response,
            errorObject.actualAttemps,
            errorObject.paymentMethodCallback,
            errorObject.url
        );
        if (this.shouldUsePaymentInitDataErrorHandler(httpError, requestUrl, processedError.internalErrorCode)) {
            this.PmtHttpErrorManagement.blockPaymentInitDataError(processedError);
            return true;
        }
        return this.errorHandlerFactory(httpError, errorObject);
    };

    private shouldUsePaymentInitDataErrorHandler = (httpError: number, requestUrl: string, internalErrorCode?: string): boolean => {
        if (!requestUrl || httpError === 408 || httpError === 401) {
            return false;
        }
        const isPaymentInitPhase = !this.localStorageService.get('errorIssueService')
            && !this.localStorageService.get('modelPaymentData');
        if (!isPaymentInitPhase) {
            return false;
        }
        if (!this.isEssentialInitDataRequest(requestUrl)) {
            return false;
        }
        if (this.isPaymentMethodsRequest(requestUrl) && this.hasTypedErrorHandler(httpError, internalErrorCode)) {
            return false;
        }
        return true;
    };

    private hasTypedErrorHandler = (httpError: number, internalErrorCode?: string): boolean => {
        if (!internalErrorCode) {
            return false;
        }
        return !!this.errorHandlerList[httpError + internalErrorCode];
    };

    isEssentialInitDataRequest = (requestUrl: string): boolean => {
        if (!requestUrl) {
            return false;
        }
        return this.isCountriesListRequest(requestUrl)
            || this.isStatesListRequest(requestUrl)
            || this.isAdditionalFieldsRequest(requestUrl)
            || this.isPaymentMethodsRequest(requestUrl);
    };

    private isCountriesListRequest = (url: string): boolean => {
        return url.indexOf('/location/country') !== -1
            || url.indexOf(this.PmtConstants.ENDPOINTS.DEFAULT.countriesListURI) !== -1;
    };

    private isStatesListRequest = (url: string): boolean => {
        return url.indexOf('/states') !== -1 && url.indexOf('/location/') !== -1;
    };

    private isAdditionalFieldsRequest = (url: string): boolean => {
        return url.indexOf('/additional-fields/') !== -1;
    };

    private isPaymentMethodsRequest = (url: string): boolean => {
        return url.indexOf('/payment-methods') !== -1;
    };

    /**
     * Creates a Object with all data neccesary to manage the error
     * @param {Object} error
     * @param {number} numberAttemps
     * @param {function} paymentMethodCallback
     */
    processGeneralPmtError = (
        error: CommonsErrorsModel.ErrorDataGeneral,
        numberAttemps: number,
        paymentMethodCallback: (n: any) => any,
        url: string
    ): httpErrorManagment.errorObject => {
        const processedResponse: httpErrorManagment.errorObject = {
            errorCode: error.errorCode,
            actualAttemps: numberAttemps,
            paymentMethodCallback: paymentMethodCallback,
            message: '',
            needsTranslate: false,
            internalErrorCode: ''
        };
        const hasReason = error.data && error.data.errors && error.data.errors.length > 0,
            messageternaryKo =
                error.data && error.data.error ? error.data.error.reason : this.$filter('translate')(this.PmtConstants.GENERAL_ERRORS.SERVICE_GENERAL_ERROR),
            internalErrorCodeTernaryKo = error.data && error.data.error && error.data.error.code ? error.data.error.code : '';
        processedResponse.message = hasReason ? error.data.errors[0].reason : messageternaryKo;
        processedResponse.needsTranslate = !hasReason;
        processedResponse.internalErrorCode = hasReason && error.data.errors[0].code ? error.data.errors[0].code : internalErrorCodeTernaryKo;
        processedResponse.url = url ? url : null;
        return processedResponse;
    };
}
