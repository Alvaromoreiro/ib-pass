import { Injectable } from "@angular/core";
import { downgradeToAJSService } from "ib-web-commons/utils";
import { IbCPromiseProxyService } from "./ib-commons-promise-proxy.service";
import { IbCBaseSFService } from "./ib-commons-base-sf.service";

@Injectable({
  providedIn: "root",
})
export class IbCPromiseBaseSFService extends IbCPromiseProxyService {
  constructor(protected override genericProxyService: IbCBaseSFService) {
    super(genericProxyService);
  }
}

downgradeToAJSService(
  "IbCPromiseBaseSFService",
  IbCPromiseBaseSFService,
  "ib-commons-proxies-module",
);
