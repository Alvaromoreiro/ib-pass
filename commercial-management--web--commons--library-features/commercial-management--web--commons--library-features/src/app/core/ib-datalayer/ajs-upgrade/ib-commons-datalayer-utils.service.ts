import { Inject, Injectable } from "@angular/core";
import {
  DatalayerUtilsServiceInjection,
  DatalayerUtilsServiceType,
} from "./ib-commons-datalayer-upgraded";
import {
  IbDatalayerErrorEvent,
  IbDatalayerEvent,
  IbDatalayerInitModel,
  IbDatalayerModalInfo,
  IbDatalayerUserInfo,
} from "../model/ib-commons-datalayer.model";
import {
  AJSRootScope,
  CommonsRootScope,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";

@Injectable({
  providedIn: "root",
})
export class IbCDatalayerUtilsService {
  constructor(
    @Inject(DatalayerUtilsServiceInjection)
    private datalayerUpgraded: DatalayerUtilsServiceType,
    @Inject(AJSRootScope) private rootScope: CommonsRootScope,
    private sessionStorage: CommonsSessionStorageService,
  ) {}

  initializeDatalayer(initObject: IbDatalayerInitModel): void {
    this.datalayerUpgraded.initializeDatalayer(
      initObject.language,
      initObject.market,
      initObject.deviceType,
    );
  }

  addAdditionalInfo(
    additionalDatalayerInfo: Record<string, string | boolean | number>,
  ): void {
    /* INIT DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.addDataLayerInfo(additionalDatalayerInfo);
    /* FINISH DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.addDigitalDataInfo(additionalDatalayerInfo);
  }

  updateUserInfo(userInfo: IbDatalayerUserInfo = {}): void {
    /* INIT DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.updateLoggedDatalayer(userInfo);
    /* FINISH DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.updateLoggedDigitalData(userInfo);
  }

  sendInteractionEvent(eventData: IbDatalayerEvent): void {
    /* INIT DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.updateDatalayerActionForAncillaries(
      eventData.eventCategory,
      eventData.eventAction,
      eventData.eventLabel,
    );
    /* FINISH DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.updateDatalayerEvent(
      eventData.eventCategory,
      eventData.eventAction,
      eventData.eventLabel,
      eventData.eventName,
    );
  }

  sendViewEvent(
    quadrigam: string,
    additionalInfo?: Record<string, string | boolean | number>,
  ): void {
    /* INIT DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.updateDatalayerWithQuadrigam(
      quadrigam,
      additionalInfo,
      this.sessionStorage.get("userLogged"),
    );
    /* FINISH DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.updateDigitalDataWithQuadrigam(
      quadrigam,
      additionalInfo,
      this.sessionStorage.get("userLogged"),
    );
    this.datalayerUpgraded.sendDatalayerEvent("view");
    this.rootScope.$broadcast("updateDatalayer");
    this.rootScope.$broadcast("sendUpdateToMonetate");
  }

  sendErrorEvent(errorInformation: IbDatalayerErrorEvent): void {
    /* INIT DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.sendDatalayerErrorEvent(errorInformation);
    /* FINISH DELETE GA4 MIGRATION*/
    this.datalayerUpgraded.sendDigitalDataErrorEvent(errorInformation);
  }

  removeErrorEventInfo(): void {
    this.datalayerUpgraded.removeDatalayerErrorAttrs();
  }

  sendModalEvent(modalInformation: IbDatalayerModalInfo): void {
    this.datalayerUpgraded.sendDatalayerModalEvent(modalInformation);
  }

  removeModalEventInfo(): void {
    this.datalayerUpgraded.removeDatalayerModalAttrs();
  }
}
