import { Injectable } from "@angular/core";
import { downgradeToAJSService } from "ib-web-commons/utils";
import { IbCBaseRestService } from "./ib-commons-base-rest.service";
import { IbCPromiseProxyService } from "./ib-commons-promise-proxy.service";

@Injectable({
  providedIn: "root",
})
export class IbCPromiseBaseRestService extends IbCPromiseProxyService {
  constructor(protected override genericProxyService: IbCBaseRestService) {
    super(genericProxyService);
  }
}

downgradeToAJSService(
  "IbCPromiseBaseRestService",
  IbCPromiseBaseRestService,
  "ib-commons-proxies-module",
);
