import * as angular from "angular";
import merge from "lodash-es/merge.js";
import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

export class CommonsNewHttpUtilsErrorService {
  constructor(
    private $timeout: ng.ITimeoutService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsConstants: CommonsConstantsType,
    private $window: ng.IWindowService,
    private $location: ng.ILocationService,
    private CommonsModalService: CommonsModalService,
    private $filter: ng.IFilterService,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  private processNewMarketError = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseMarket => {
    const errorResponse: CommonsErrorsModel.CommonsErrorsResponseMarket = {
      errorCode: error.errorCode,
      message: "",
      needsTranslate: false,
      internalErrorCode: "",
      newMmBMarket: "",
      newBookingMarket: "",
      requestURL: error.requestURL,
    };
    const hasMessage = error.data && error.data.error;
    errorResponse.message = hasMessage
      ? error.data.error.errorDescription
      : "REST_SERVICE_ERROR_GENERAL";
    errorResponse.needsTranslate = !hasMessage;
    errorResponse.internalErrorCode = hasMessage
      ? error.data.error.errorCode
      : "";
    errorResponse.newBookingMarket = error.data
      ? error.data.newBookingMarket
      : null;
    errorResponse.newMmBMarket = error.data ? error.data.newMmBMarket : null;

    return errorResponse;
  };
  private processAvailabilityErrorCKI = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
    const errorResponse: CommonsErrorsModel.CommonsErrorsResponseMarket = {
      errorCode: error.errorCode,
      message: "",
      needsTranslate: false,
      internalErrorCode: "",
      requestURL: error.requestURL,
    };
    const hasMessage =
      error.data &&
      error.data.errors &&
      error.data.errors.length > 0 &&
      error.data.errors[0].reason &&
      error.data.errors[0].reason.length > 0;

    errorResponse.message = hasMessage
      ? error.data.errors[0].reason
      : "REST_SERVICE_ERROR_GENERAL";
    errorResponse.needsTranslate = !hasMessage;
    errorResponse.internalErrorCode =
      hasMessage && error.data.errors[0].code ? error.data.errors[0].code : "";

    return errorResponse;
  };
  private processAvailabilityError = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
    const flowApp = this.localStorageService.get("flowApp");
    const isCKI = flowApp === this.CommonsConstants.APP_TYPES.CHECKIN;
    const isBKI = flowApp === this.CommonsConstants.APP_TYPES.BOOKING;
    const errorResponse =
      !isCKI && !isBKI
        ? this.processNewMarketError(error)
        : this.processAvailabilityErrorCKI(error);
    const isBookingMarketChange =
      errorResponse.errorCode === this.CommonsConstants.CODE412 &&
      errorResponse.internalErrorCode ===
        this.CommonsConstants.INTERNAL_ERROR_CODE.BOOKING_MARKET_CHANGE;
    const isCKIErrorCode412 =
      isCKI &&
      errorResponse.errorCode === this.CommonsConstants.CODE412 &&
      (errorResponse.internalErrorCode ===
        this.CommonsConstants.INTERNAL_ERROR_CODE
          .CKI_RESERVATION_HAS_NO_FEATURE_FLIGHTS ||
        errorResponse.internalErrorCode ===
          this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_NEWSLETTER_10000 ||
        errorResponse.internalErrorCode ===
          this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_NEWSLETTER_10001 ||
        errorResponse.internalErrorCode ===
          this.CommonsConstants.INTERNAL_ERROR_CODE.CKI_PAYMENT_METHODS);
    if (isBookingMarketChange) {
      this.localStorageService.set(
        this.CommonsConstants.LOCAL_STORAGE_KEYS.NEW_MARKET_INFO,
        error,
      );
      this.$location.path(this.CommonsConstants.REDIRECTION.IBREDNM);
    } else if (!isCKIErrorCode412) {
      this.CommonsModalService.showGenericError(error, true, null).result.then(
        angular.noop,
        angular.noop,
      );
    }
    return errorResponse;
  };
  private processGeneralMessageError = (reason: string): string => {
    let message = "";
    switch (reason) {
      case this.CommonsConstants.BOOKINGERRORSSERVICE.JSON_MAPPING_EXCEPTION:
        message =
          this.CommonsConstants.BOOKINGERRORSSERVICE.JSON_MAPPING_EXCEPTION;
        break;
      case this.CommonsConstants.BOOKINGERRORSSERVICE
        .UNEXPECTED_TECHNICAL_EXCEPTION:
        message =
          this.CommonsConstants.BOOKINGERRORSSERVICE
            .UNEXPECTED_TECHNICAL_EXCEPTION;
        break;
      case this.CommonsConstants.BOOKINGERRORSSERVICE.FARE_NOT_FOUND:
        message = this.CommonsConstants.BOOKINGERRORSSERVICE.FARE_NOT_FOUND;
        break;
      case this.CommonsConstants.BOOKINGERRORSSERVICE.PAC_UTILS_E0001:
        message =
          this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR;
        break;
      default:
        message = reason;
    }
    return message;
  };
  private processGeneralErrorWithProperties = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
    let processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
      message: "",
      needsTranslate: false,
      errorCode: error.errorCode,
      internalErrorCode: "",
      requestURL: error.requestURL,
    };
    const hasReason =
      error.data && error.data.errors && error.data.errors.length > 0;
    const ERROR_PATTERN =
      this.CommonsConstants.commonsPatterns.ERROR_PATTERN_WITH_PROPERTIES;
    if (hasReason && error.data.errors.length === 1) {
      if (ERROR_PATTERN.test(error.data.errors[0].reason)) {
        const reasonParameters = error.data.errors[0].reason.split("|");
        processedResponse.message = reasonParameters[1].split(":")[1];
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
            const reasonParameters = error.data.errors[i].reason.split("|");
            processedResponse.messageList.push({
              message: reasonParameters[1].split(":")[1],
              internalErrorCode: error.data.errors[i].code,
            });
          } else {
            processedResponse.messageList.push({
              message: error.data.errors[i].reason,
              internalErrorCode: error.data.errors[i].code,
            });
          }
        }
      } else {
        processedResponse = this.processGeneralError(error);
      }
    }
    return processedResponse;
  };
  private returnProcessedErrorSeparateParameters = (
    responseError: CommonsErrorsModel.CommonsErrorsResponseGeneral,
    reject,
    error?: CommonsErrorsModel.ErrorDataGeneral,
  ) => {
    if (error) {
      merge(responseError, {
        serviceError: error.data,
      });
    }
    reject(responseError);
  };
  private processGeneralError = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
    const processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
      errorCode: error.errorCode,
      message: "",
      needsTranslate: false,
      internalErrorCode: "",
      requestURL: error.requestURL,
    };
    const hasReason =
      error.data && error.data.errors && error.data.errors.length > 0;
    processedResponse.message = hasReason
      ? this.processGeneralMessageError(error.data.errors[0].reason)
      : this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR;
    processedResponse.needsTranslate =
      !hasReason ||
      (hasReason && processedResponse.message !== error.data.errors[0].reason);
    processedResponse.internalErrorCode = hasReason
      ? error.data.errors[0].code
      : error.data?.error?.code
        ? error.data.error.code
        : "";
    return processedResponse;
  };
  controlError = (error: CommonsErrorsModel.ErrorDataGeneral, reject) => {
    switch (error.errorCode) {
      case 400:
        if (error.data?.errors?.length > 1) {
          this.returnProcessedErrorSeparateParameters(
            this.processGeneralErrorWithProperties(error),
            reject,
            error,
          );
        } else {
          this.returnProcessedErrorSeparateParameters(
            this.processGeneralError(error),
            reject,
          );
        }
        break;
      case 412:
        this.returnProcessedErrorSeparateParameters(
          this.processAvailabilityError(error),
          reject,
        );
        break;
      default:
        this.returnProcessedErrorSeparateParameters(
          this.processGeneralError(error),
          reject,
        );
        break;
    }
  };
  mapErrors400 = (error) => {
    const errorResponse = {
      internalErrorCode: "PRLM_MBM_9001",
      message: "REST_SERVICE_ERROR_GENERAL",
      needsTranslate: true,
    };
    const hasMessage =
        error.data &&
        error.data.errors &&
        error.data.errors.length > 0 &&
        error.data.errors[0] &&
        error.data.errors[0].reason.length > 0 &&
        error.data.errors[0].reason.includes(
          this.CommonsHttpServicesConstants.PRLM_MBM_9001.code,
        ),
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
  processPaymentsError = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
    const hasReason =
      (error.data && error.data.errors && error.data.errors.length > 0) ||
      (error.data.error && error.data.error.reason);
    const processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
      errorCode: error.errorCode,
      needsTranslate: !hasReason,
      internalErrorCode: "",
      paymentOptions: "",
      message: this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR,
      requestURL: error.requestURL,
    };
    if (hasReason) {
      processedResponse.message =
        error.data.errors && error.data.errors[0]
          ? error.data.errors[0].reason
          : error.data.error.reason;
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
    if (
      processedError &&
      httpServiceEntity &&
      httpServiceEntity.defer &&
      httpServiceEntity.defer.reject
    ) {
      httpServiceEntity.defer.reject(processedError);
      httpServiceEntity.defer = null;
      httpServiceEntity.NUM_ATTEMPS = 0;
    }
  };
}
CommonsNewHttpUtilsErrorService.$inject = [
  "$timeout",
  "CommonsHttpServicesConstants",
  "CommonsConstants",
  "$window",
  "$location",
  "CommonsModalService",
  "$filter",
  "localStorageService",
];
try {
  const mod = angular.module("ib-commons-utils-module");
  mod.service(
    "CommonsNewHttpUtilsErrorService",
    CommonsNewHttpUtilsErrorService,
  );
} catch (error) {
  const mod = angular.module("ib-commons-utils-module", []);
  mod.service(
    "CommonsNewHttpUtilsErrorService",
    CommonsNewHttpUtilsErrorService,
  );
}
