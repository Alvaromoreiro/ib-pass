import {
  CommonsHttpServicesConstants,
  CommonsConstants,
} from "ib-web-commons/constants";
import * as angular from "angular";
import { downgradeInjectable } from "@angular/upgrade/static";
import { Injectable } from "@angular/core";
import { IbCHttpErrorHandlerService } from "../errors/ib-commons-http-error-handler.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import {
  IbCPromiseBaseRestService,
  ProxyResponse,
} from "ib-web-commons/proxies";
import {
  IbCDatalayerUtilsService,
  IbDatalayerErrorEvent,
} from "ib-web-commons/ib-datalayer";
import { PrefixResponse } from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class GetPhoneCodesService {
  constructor(
    private CommonsGenericProxy: IbCPromiseBaseRestService,
    private CommonsNewHttpUtilsErrorService: IbCHttpErrorHandlerService,
    private localStorageService: CommonsSessionStorageService,
    private DatalayerUtilsService: IbCDatalayerUtilsService,
  ) {}

  getPhoneCodesList = (): Promise<PrefixResponse[]> => {
    return new Promise((resolve, reject) => {
      const phoneCodeList =
        this.localStorageService.get<PrefixResponse[]>("phoneCodeList");
      const flowApp = this.localStorageService.get("flowApp");

      const getPhoneCodesListSuccess = (
        phoneCodeList: ProxyResponse<PrefixResponse[]>,
      ): void => {
        this.localStorageService.set("phoneCodeList", phoneCodeList.data);
        resolve(phoneCodeList.data);
      };
      const getPhoneCodesListError = (error: unknown): void => {
        if (flowApp === CommonsConstants.APP_TYPES.CHECKIN) {
          this.DatalayerUtilsService.sendErrorEvent(
            <IbDatalayerErrorEvent>error,
          );
        }
        this.CommonsNewHttpUtilsErrorService.handlePromiseError(error, reject);
      };

      if (phoneCodeList === null) {
        const endpoint =
          CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.phoneCodesURI;
        const config: any = {
          headers: {
            "Cache-Control": "private, max-age=600",
          },
        };
        this.CommonsGenericProxy.get<PrefixResponse[]>(endpoint, config).then(
          getPhoneCodesListSuccess,
          getPhoneCodesListError,
        );
      } else {
        resolve(phoneCodeList);
      }
    });
  };
}

try {
  angular
    .module("ib-commons-http-service-module")
    .service("GetPhoneCodesService", downgradeInjectable(GetPhoneCodesService));
} catch {
  angular
    .module("ib-commons-http-service-module", [])
    .service("GetPhoneCodesService", downgradeInjectable(GetPhoneCodesService));
}
