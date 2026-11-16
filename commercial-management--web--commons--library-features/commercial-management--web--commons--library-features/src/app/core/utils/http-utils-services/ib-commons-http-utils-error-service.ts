import * as angular from 'angular';
import {CommonsHttpUtilService} from './ib-commons-http-utils-service';
import {CommonsModalService} from '../../ib-modal/services/ib-modal-service';
import {CommonsConstantsType} from '../../constants/ib-commons-constants';
import {CommonsHttpServicesConstantsType} from '../../constants/ib-commons-http-service-constants';
import { CommonsUserUtilsService } from '../ib-commons-user-utils.service';
import { CommonsLoginUtilsService } from '../../ib-login/services/ib-commons-login-access-utils-service';
import { RedirectionService } from '../../utils/ib-commons-redirection.service';

@Service(
    'ib-commons-utils-module',
    ['$timeout', 'CommonsHttpServicesConstants', 'CommonsHttpUtilService', 'CommonsConstants', '$window', '$location', 'CommonsModalService', '$filter', 'localStorageService', 'CommonsUserUtilsService', 'CommonsLoginUtilsService', 'RedirectionService'],
    []
)
export class CommonsHttpUtilsErrorService {
    constructor (
        private $timeout: ng.ITimeoutService,
        private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        private CommonsHttpUtilService: CommonsHttpUtilService,
        private CommonsConstants: CommonsConstantsType,
        private $window: ng.IWindowService,
        private $location: ng.ILocationService,
        private CommonsModalService: CommonsModalService,
        private $filter: angular.IFilterService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private CommonsLoginUtilsService: CommonsLoginUtilsService,
        private RedirectionService: RedirectionService
    ) { }

    timeOutError = (actualAttemps: number, callBackFunction: (n: any) => any, response: CommonsErrorsModel.ErrorDataGeneral,
        promise?: any) => {
        if (actualAttemps < this.CommonsHttpServicesConstants.numAttemps) {
            this.$timeout(callBackFunction(promise), this.CommonsHttpServicesConstants.timeWait);
        } else {
            return this.processGeneralError(response);
        }
    };
    unauthorizedError = (actualAttemps: number, callBackFunction: (n: any) => any, response: CommonsErrorsModel.ErrorDataGeneral,
        promise?: any, isLoggedflow?: boolean) => {
        const modalObject = {
            message: this.$filter('translate')('REST_SERVICE_ERROR_GENERAL'),
            needsTranslate: false,
            title: this.$filter('translate')('MODAL_ERROR_TITLE')
        };
        const success = () => {
            callBackFunction(promise);
        };
        if (actualAttemps < this.CommonsHttpServicesConstants.numAttemps) {
            this.CommonsHttpUtilService.refreshToken().then(success, success);
        } else if (isLoggedflow) {
            this.CommonsLoginUtilsService.updateStateToAnonymous();
            this.RedirectionService.redirectToLoginPage(this.$location.absUrl());
        } else {
            return this.processGeneralError(response);
        }
    };
    /**
     * Function that filter message error sending new literals for determinate messages
     * @param {string} reason
     * @returns {string} message error filtered
     */
    processGeneralMessageError = (reason: string): string => {
        let message = '';
        switch (reason) {
                case this.CommonsConstants.BOOKINGERRORSSERVICE.JSON_MAPPING_EXCEPTION:
                    message = this.CommonsConstants.BOOKINGERRORSSERVICE.JSON_MAPPING_EXCEPTION;
                    break;
                case this.CommonsConstants.BOOKINGERRORSSERVICE.UNEXPECTED_TECHNICAL_EXCEPTION:
                    message = this.CommonsConstants.BOOKINGERRORSSERVICE.UNEXPECTED_TECHNICAL_EXCEPTION;
                    break;
                case this.CommonsConstants.BOOKINGERRORSSERVICE.FARE_NOT_FOUND:
                    message = this.CommonsConstants.BOOKINGERRORSSERVICE.FARE_NOT_FOUND;
                    break;
                case this.CommonsConstants.BOOKINGERRORSSERVICE.PAC_UTILS_E0001:
                    message = this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR;
                    break;
                default:
                    message = reason;
        }
        return message;
    };
    processGeneralError = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        const processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
            errorCode: error.errorCode,
            message: '',
            needsTranslate: false,
            internalErrorCode: '',
            requestURL: error.requestURL
        };
        const hasReason = error.data && error.data.errors && error.data.errors.length > 0;
        processedResponse.message = hasReason ?
            this.processGeneralMessageError(error.data.errors[0].reason) : this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR;
        processedResponse.needsTranslate = !hasReason ||
            (hasReason && processedResponse.message !== error.data.errors[0].reason);
        processedResponse.internalErrorCode = hasReason ? error.data.errors[0].code : '';
        processedResponse.data = error.data ?? error.data;
        return processedResponse;
    };
    processGeneralErrorWithProperties = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        let processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
            message: '',
            needsTranslate: false,
            errorCode: error.errorCode,
            internalErrorCode: '',
            requestURL: error.requestURL
        };
        const hasReason = error.data && error.data.errors && error.data.errors.length > 0;
        const ERROR_PATTERN = this.CommonsConstants.commonsPatterns.ERROR_PATTERN_WITH_PROPERTIES;
        if (hasReason && error.data.errors.length === 1) {
            if (ERROR_PATTERN.test(error.data.errors[0].reason)) {
                const reasonParameters = error.data.errors[0].reason.split('|');
                processedResponse.message = reasonParameters[1].split(':')[1];
                processedResponse.internalErrorCode = error.data.errors[0].code;
            } else {
                processedResponse = this.processGeneralError(error);
            }
        } else {
            if (hasReason) {
                processedResponse.messageList = [];
                processedResponse.internalErrorCode = error.data.errors[0].code;
                for (let i = 0; i < error.data.errors.length; i++) {
                    if (ERROR_PATTERN.test(error.data.errors[i].reason)) {
                        const reasonParameters = error.data.errors[i].reason.split('|');
                        processedResponse.messageList.push({
                            message: reasonParameters[1].split(':')[1],
                            internalErrorCode: error.data.errors[i].code
                        });
                    } else {
                        processedResponse.messageList.push({
                            message: error.data.errors[i].reason,
                            internalErrorCode: error.data.errors[i].code
                        });
                    }
                }
            } else {
                processedResponse = this.processGeneralError(error);
            }
        }
        return processedResponse;
    };
    processNewMarketError = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseMarket => {
        const errorResponse: CommonsErrorsModel.CommonsErrorsResponseMarket = {
            errorCode: error.errorCode,
            message: '',
            needsTranslate: false,
            internalErrorCode: '',
            newMmBMarket: '',
            newBookingMarket: '',
            requestURL: error.requestURL
        };
        const hasMessage = error.data && error.data.error;
        errorResponse.message = hasMessage ? (error.data.error.errorDescription? error.data.error.errorDescription : error.data.error.reason ) :'REST_SERVICE_ERROR_GENERAL';
        errorResponse.needsTranslate = !hasMessage;
        errorResponse.internalErrorCode = hasMessage ? (error.data.error.errorCode ? error.data.error.errorCode : error.data.error.code) : '';
        errorResponse.newBookingMarket = error.data ? error.data.newBookingMarket : null;
        errorResponse.newMmBMarket = error.data ? error.data.newMmBMarket : null;

        return errorResponse;
    };
    processAvailabilityError = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        const flowApp = this.localStorageService.get('flowApp');
        const biometricAssociation = this.localStorageService.get('biometricBoardingAssociation');
        const isCKI = (flowApp === this.CommonsConstants.APP_TYPES.CHECKIN);
        const isBKI = (flowApp === this.CommonsConstants.APP_TYPES.BOOKING);
        const isCKIbio = isCKI && biometricAssociation;
        const errorResponse = (!isCKI && !isBKI) ? this.processNewMarketError(error): this.processAvailabilityErrorCKI(error);
        const isBookingMarketChange = (errorResponse.errorCode === this.CommonsConstants.CODE412 && errorResponse.internalErrorCode === this.CommonsConstants.INTERNAL_ERROR_CODE.BOOKING_MARKET_CHANGE);
        const CKI_ERROR_INTERNAL_ERROR_CODES = [
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_RESERVATION_HAS_NO_FEATURE_FLIGHTS,
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_NEWSLETTER_10000,
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_NEWSLETTER_10001,
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_PAYMENT_METHODS,
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_NOT_RETRIEVE_RESERVATION
        ];
        const CKI_BIO_ERROR_CODES = [
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_FLIGHT_INFO_PASSENGER_NOT_FOUND,
            this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_FLIGHT_INFO_EXPIRED_DOC,
            this.CommonsConstants.AENA_BIOMETRICS_ERROR_CODE.EXPIRED_DOCUMENT,
            this.CommonsConstants.AENA_BIOMETRICS_ERROR_CODE.DOCUMENT_NOT_MATCH
        ];
        const isCKIErrorCode412 = isCKI && errorResponse.errorCode === this.CommonsConstants.CODE412 && CKI_ERROR_INTERNAL_ERROR_CODES.includes(errorResponse.internalErrorCode);
        if (isBookingMarketChange) {
            this.localStorageService.set(this.CommonsConstants.LOCAL_STORAGE_KEYS.NEW_MARKET_INFO, error);
            this.$location.path(this.CommonsConstants.REDIRECTION.IBREDNM);
        } else if (!isCKIErrorCode412 && errorResponse.internalErrorCode !== 'SSE_ORM_7500') {
            if(!isCKIbio && CKI_BIO_ERROR_CODES.includes(errorResponse.internalErrorCode)) {
                this.CommonsModalService.showGenericError(error, true, null).result.then(() => {}, () => {});
            }
        } else if(isCKIErrorCode412 && errorResponse.internalErrorCode === this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_NOT_RETRIEVE_RESERVATION) {
            this.CommonsModalService.showGenericError(errorResponse, true, null).result.then(() => {}, () => {});
        }
        return errorResponse;
    };
    processAvailabilityErrorCKI = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        const errorResponse: CommonsErrorsModel.CommonsErrorsResponseMarket = {
            errorCode: error.errorCode,
            message: '',
            needsTranslate: false,
            internalErrorCode: '',
            requestURL: error.requestURL
        };
        const hasMessage = error.data && error.data.errors && error.data.errors.length > 0 && error.data.errors[0].reason && error.data.errors[0].reason.length > 0;

        errorResponse.message = hasMessage ? error.data.errors[0].reason : 'REST_SERVICE_ERROR_GENERAL';
        errorResponse.needsTranslate = !hasMessage;
        errorResponse.internalErrorCode = (hasMessage && error.data.errors[0].code) ? error.data.errors[0].code : '';

        return errorResponse;
    };
    processIssueInfoError = (error: CommonsErrorsModel.CommonsErrorsDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        const errorResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
            errorCode: error.errorCode,
            message: '',
            needsTranslate: true,
            paymentStatus: false
        };
        errorResponse.message = error.paymentStatus ? this.CommonsConstants.PAYMENT_STATUS_CODE.STATUS_PAYMENT_ISSUE_OK :
            this.CommonsConstants.PAYMENT_STATUS_CODE.STATUS_PAYMENT_ISSUE_KO;
        errorResponse.paymentStatus = error.paymentStatus;
        return errorResponse;
    };
    processUnavailabilityError = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        let errorResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
            errorCode: error.errorCode,
            message: '',
            needsTranslate: false,
            internalErrorCode: '',
            requestURL: error.requestURL
        };
        const hasReason = error.data && error.data.errors && error.data.errors.length > 0;
        if (hasReason && error.data.errors.length === 1 && error.data.errors[0].code === 'SSE_ORM_9007') {
            errorResponse.message = 'REST_SERVICE_ERROR_OFFER';
            errorResponse.internalErrorCode = error.data.errors[0].code;
        } else {
            errorResponse = this.processGeneralError(error);
        }
        errorResponse.needsTranslate = true;
        return errorResponse;
    };
    processPaymentsError = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        const hasReason = (error.data && error.data.errors && error.data.errors.length > 0) || (error.data.error && error.data.error.reason);
        const processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
            errorCode: error.errorCode,
            needsTranslate: !hasReason,
            internalErrorCode: '',
            paymentOptions: '',
            message: this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR
        };
        if (hasReason) {
            processedResponse.message = error.data.errors && error.data.errors[0] ?
                error.data.errors[0].reason :
                error.data.error.reason;
        }
        if (error.data && error.data.errors) {
            processedResponse.internalErrorCode = error.data.errors[0].code;
        } else if (error.data && error.data.error && error.data.error.code) {
            processedResponse.internalErrorCode = error.data.error.code;
        }
        if (error.data && error.data.paymentOptions) {
            processedResponse.paymentOptions = error.data.paymentOptions;
        }
        if (error.data) {
            processedResponse.data = error.data;
        }
        return processedResponse;
    };
    returnProcessedError = (processedError: any, httpServiceEntity: any) => {
        if (processedError && httpServiceEntity && httpServiceEntity.defer && httpServiceEntity.defer.reject) {
            httpServiceEntity.defer.reject(processedError);
            httpServiceEntity.defer = null;
            httpServiceEntity.NUM_ATTEMPS = 0;
        }
    };
    returnProcessedErrorSeparateParameters = (responseError: CommonsErrorsModel.CommonsErrorsResponseGeneral, attemps?: number,
        defer?: angular.IDeferred<unknown>, error?:CommonsErrorsModel.ErrorDataGeneral) => {
        if (error) {
            angular.extend(responseError, { serviceError: error.data });
        }
        if (responseError) {
            defer.reject(responseError);
            attemps = 0;
        }
        return attemps;
    };
    mapErrors400 = (error) => {
        const errorResponse = {
            internalErrorCode: 'PRLM_MBM_9001',
            message: 'REST_SERVICE_ERROR_GENERAL',
            needsTranslate: true,
            requestURL: error.requestURL
        };
        const hasMessage = error.data && error.data.errors && error.data.errors.length > 0 && error.data.errors[0] && error.data.errors[0].reason.length > 0 && error.data.errors[0].reason.includes(this.CommonsHttpServicesConstants.PRLM_MBM_9001.code),
            typeErrors = this.CommonsHttpServicesConstants.PRLM_MBM_9001.childError;
        let reason = {};
        if (hasMessage) {
            reason = error.data.errors[0].reason;
            angular.forEach(typeErrors, (_error) => {
                if (reason.toString().indexOf(_error)) {
                    errorResponse.message = _error;
                }
            });
        }
        return errorResponse;
    };
    controlError = (error: CommonsErrorsModel.ErrorDataGeneral, attemps: number, callback: (promise?: any) => void, defer: angular.IDeferred<unknown>, isLoggedflow?: boolean) => {
        switch (error.errorCode) {
                case 408: return this.returnProcessedErrorSeparateParameters(this.timeOutError(attemps, callback, error), attemps, defer); break;
                case 401: return this.returnProcessedErrorSeparateParameters(this.unauthorizedError(attemps, callback, error, defer, isLoggedflow), attemps, defer); break;
                case 400: return (error.data?.errors?.length > 1) ? this.returnProcessedErrorSeparateParameters(this.processGeneralErrorWithProperties(error), attemps, defer, error):
                    this.returnProcessedErrorSeparateParameters(this.processGeneralError(error), attemps, defer); break;
                case 409: return this.returnProcessedErrorSeparateParameters(this.validateFrequentFlyerError(error), attemps, defer); break;    
                case 412: return this.returnProcessedErrorSeparateParameters(this.processAvailabilityError(error), attemps, defer); break;
                default: return this.returnProcessedErrorSeparateParameters(this.processGeneralError(error), attemps, defer);
        }
    };

    processRedemptionAvailabilityError = () => {
        this.CommonsModalService.finishWaiting();
        this.$location.path('/ibAviosAlert');
    };

    validateFrequentFlyerError = (error): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        const error409: boolean = error?.errorCode === 409;
        const errorFF = Array.isArray(error?.data) ? error?.data : [];
        const errorCheckFF: CommonsErrorsModel.ErrorCheckFF = {status: false, passengerIDs: []};
        const getError = (el) => {
            el.errors?.forEach(error => {
                if(error.code === 'CHECK_FREQUENT_FLYER') {
                    errorCheckFF.status = true;
                    errorCheckFF.internalErrorCode = error.code;
                    errorCheckFF.message = error?.description ?? '';
                    errorCheckFF.passengerIDs.push(el.id);
                }
            });
        };
        errorFF.forEach(getError);

        return (error409 && errorCheckFF.status) ? {
            errorCode: error.errorCode,
            message: errorCheckFF.message,
            needsTranslate: false,
            internalErrorCode:  errorCheckFF.internalErrorCode,
            requestURL: error.requestURL,
            ids: errorCheckFF.passengerIDs
        } : this.processGeneralError(error);
    };
}
@Service(
    'ib-commons-utils-module',
    ['CommonsHttpUtilsErrorService']
)
export class IbControlErrorExtendsCheckBonus extends CommonsHttpUtilsErrorService {

    controlError = (error: CommonsErrorsModel.ErrorDataGeneral, attemps: number, callback: ()=>void, defer: angular.IDeferred<unknown>)=> {
        switch (error.errorCode) {
                case 408: return this.returnProcessedErrorSeparateParameters(this.timeOutError(attemps, callback, error), attemps, defer); break;
                case 401: return this.returnProcessedErrorSeparateParameters(this.unauthorizedError(attemps, callback, error, null, true), attemps, defer); break;
                case 400: return this.returnProcessedErrorSeparateParameters(this.processGeneralError(error), attemps, defer); break;
                case 409: return this.returnProcessedErrorSeparateParameters(this.processBonusError(error), attemps, defer); break;
                case 404: return this.returnProcessedErrorSeparateParameters(this.processBonusError(error), attemps, defer); break;
                default: return this.returnProcessedErrorSeparateParameters(this.processGeneralError(error), attemps, defer);
        }
    };
    processBonusError = (error: CommonsErrorsModel.ErrorDataGeneral): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        let text = 'MY_BONUS_CHECK_BONUS_ERROR_404';
        if (error.errorCode === 409) {
            text = 'MY_BONUS_CHECK_BONUS_ERROR_409';
        }
        return {
            errorCode: error.errorCode,
            message:text,
            needsTranslate: true,
            internalErrorCode:  '',
            requestURL: error.requestURL
        };

    };
}