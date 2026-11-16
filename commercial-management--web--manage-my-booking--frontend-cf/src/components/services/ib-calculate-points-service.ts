import { Inject, Injectable } from "@angular/core";
import { PromiseTimeout } from "../decorators/method-decorators";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { AJSCommonsGenericProxyService, AJSCommonsGenericProxyServiceType, AJSCommonsNewHttpUtilsErrorService, AJSCommonsNewHttpUtilsErrorServiceType } from "./http/commons-proxy-bridge.service";

@Injectable({
    providedIn: 'root',
})
export class ibMmbCalculatePointsService {
    constructor (
        @Inject(AJSCommonsGenericProxyService) private CommonsGenericProxyService: AJSCommonsGenericProxyServiceType,
        @Inject(AJSCommonsNewHttpUtilsErrorService) private CommonsNewHttpUtilsErrorService: AJSCommonsNewHttpUtilsErrorServiceType
    ) {}
    @PromiseTimeout(3000)
    getCalculateFlightsAvios (request: CalculateAncillariesAviosSummaryRequest.AncillarySummaryRequest) {
        return new Promise((resolve, reject) => {
            const endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.AVIOS_FLIGHTS;
            this.CommonsGenericProxyService.postGeneric(endpoint, request).then(
                (response) => {
                    // resolve(mock);
                    resolve(response.data);
                },
                (error) => {
                    // resolve(mock);
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                }
            );
        });
    }
    @PromiseTimeout(3000)
    getCalculateAviosAncillaries (request: CalculateAviosAncillaries.AviosAncillariesRequest): Promise<CalculateAviosAncillariesResponse.AviosAncillariesResponse> {
        return new Promise((resolve, reject) => {
            const endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.AVIOS_ANCILLARIES;
            this.CommonsGenericProxyService.postGeneric(endpoint, request).then(
                (response) => {
                    // resolve(mockAncillaries);
                    resolve(response.data);
                },
                (error) => {
                    // resolve(mockAncillaries);
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                }
            );
        });
    }
    @PromiseTimeout(3000)
    getCalculateAviosSummary (request: CalculateAncillariesAviosSummaryRequest.AncillarySummaryRequest) {
        return new Promise((resolve, reject) => {
            const endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.AVIOS_SUMMARY;
            this.CommonsGenericProxyService.postGeneric(endpoint, request).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                }
            );
        });
    }
}
