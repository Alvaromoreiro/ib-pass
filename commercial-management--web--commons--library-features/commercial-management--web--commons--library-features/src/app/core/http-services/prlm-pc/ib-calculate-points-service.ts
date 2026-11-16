import * as angular from "angular";

import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsHttpUtilService } from "../../utils/http-utils-services/ib-commons-http-utils-service";
import { PromiseTimeout } from "../../utils/method-decorators";

export class ibCCalculatePointsService {
  constructor(
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
    private CommonsHttpServicesConstantsType: CommonsHttpServicesConstantsType,
    private CommonsHttpUtilService: CommonsHttpUtilService,
  ) {}
  @PromiseTimeout(3000)
  getCalculateFlightsAvios(
    request: CalculateAncillariesAviosSummaryRequest.AncillarySummaryRequest,
  ) {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstantsType.DEFAULT_ENDPOINTS.AVIOS_FLIGHTS;
      this.CommonsGenericProxy.postGeneric(endpoint, request).then(
        (response) => {
          // resolve(mock);
          resolve(response.data);
        },
        (error) => {
          // resolve(mock);
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  }
  @PromiseTimeout(3000)
  getCalculateAviosAncillaries(
    request: CalculateAviosAncillaries.AviosAncillariesRequest,
  ): Promise<CalculateAviosAncillariesResponse.AviosAncillariesResponse> {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstantsType.DEFAULT_ENDPOINTS
          .AVIOS_ANCILLARIES;
      this.CommonsGenericProxy.postGeneric(endpoint, request).then(
        (response) => {
          // resolve(mockAncillaries);
          resolve(response.data);
        },
        (error) => {
          // resolve(mockAncillaries);
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  }
  @PromiseTimeout(3000)
  getCalculateAviosSummary(
    request: CalculateAncillariesAviosSummaryRequest.AncillarySummaryRequest,
  ) {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstantsType.DEFAULT_ENDPOINTS.AVIOS_SUMMARY;
      this.CommonsGenericProxy.postGeneric(endpoint, request).then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  }
}
ibCCalculatePointsService.$inject = [
  "CommonsGenericProxy",
  "CommonsNewHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "CommonsHttpUtilService",
];
try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service("ibCCalculatePointsService", ibCCalculatePointsService);
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service("ibCCalculatePointsService", ibCCalculatePointsService);
}
