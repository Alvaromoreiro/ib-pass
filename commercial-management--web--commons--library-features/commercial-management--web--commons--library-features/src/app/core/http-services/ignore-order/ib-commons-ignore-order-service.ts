import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";

Service(
  "ib-commons-http-service-module",
  [
    "$q",
    "CommonsGenericProxy",
    "CommonsConstants",
    "CommonsUtilService",
    "CommonsHttpUtilsErrorService",
  ],
  [],
);
export class CommonsIgnoreOrderService {
  public numberAttemps: number;
  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsConstants: CommonsConstantsType,
    private CommonsUtilService: CommonsUtilService,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
  ) {}

  ignoreOrder = (orderId: string) => {
    let endpoint = this.CommonsUtilService.getEndpoint("sse-orm-rs");
    const defer = this.$q.defer();
    endpoint = endpoint
      ? endpoint + this.CommonsConstants.ignoreOrderServiceURI
      : this.CommonsConstants.DEFAULT_ENDPOINTS.ignoreOrderServiceURI;
    const ignoreOrderCallback = () => {
      this.numberAttemps++;
      this.ignoreOrder(orderId);
    };

    const returnProcessedError = (
      responseError: CommonsServiceTypes.CommonsErrorProxyResponse,
    ) => {
      if (responseError) {
        this.numberAttemps = 0;
        defer.reject(responseError);
      }
    };
    const BookingIgnoreOrderError = (error: any) => {
      switch (error.errorCode) {
        case 408:
          returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.numberAttemps,
              ignoreOrderCallback,
              error,
            ),
          );

          break;
        case 401:
          returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.numberAttemps,
              ignoreOrderCallback,
              error,
            ),
          );

          break;
        case null:
          returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
          );
      }
    };
    const BookingIgnoreOrderSuccess = (
      data: CommonsServiceTypes.CommonsProxyResponse,
    ) => {
      defer.resolve(data);
    };
    this.CommonsGenericProxy.deleteGeneric(endpoint + "/" + orderId).then(
      BookingIgnoreOrderSuccess,
      BookingIgnoreOrderError,
    );
    return defer.promise;
  };
}
