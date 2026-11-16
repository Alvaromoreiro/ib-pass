import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsHttpServicesConstants",
  "CommonsUtilService",
  "CommonsGenericProxy",
])
export class IbCConditionsService {
  constructor(
    private $q: ng.IQService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsUtilService: CommonsUtilService,
    private CommonsGenericProxy: CommonsGenericProxy,
  ) {}

  getPaymentConditions = (orderId: string): angular.IPromise<any> => {
    let defer = this.$q.defer();
    const endpoint =
      this.CommonsUtilService.getEndpoint("pmt-ppm-rs") ||
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
        .paymentMethodsServiceURI;

    const getPaymentConditionsSuccess = (data): void => {
      defer.resolve(data.data);
      defer = null;
    };
    const getPaymentConditionsError = (error): void => {
      defer.reject(error);
      defer = null;
    };

    this.CommonsGenericProxy.getGeneric(
      endpoint + orderId + "/payment-conditions",
    ).then(getPaymentConditionsSuccess, getPaymentConditionsError);

    return defer.promise;
  };
}
