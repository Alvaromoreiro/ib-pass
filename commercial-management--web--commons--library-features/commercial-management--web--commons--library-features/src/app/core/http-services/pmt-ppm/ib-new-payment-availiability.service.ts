import { Inject, Injectable } from "@angular/core";
import {
  IbCPromiseBaseSFService,
  LOGGED_FLOW_BLOCKING,
} from "ib-web-commons/proxies";
import {
  CommonsHttpServicesConstants,
  CommonsConstants,
} from "ib-web-commons/constants";
import { HttpContext } from "@angular/common/http";
import {
  AJSRootScope,
  CommonsRootScope,
  downgradeToAJSService,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";
import {
  NewPaymentAvailiabilityResponse,
  RealmTypesModel,
  RealmTypesItemModel,
  FlowAppEnum,
  RealmType,
  SubrealmType,
} from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbCNewPaymentAvailiabilityService {
  constructor(
    @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
    private basePromiseService: IbCPromiseBaseSFService,
    private commonsSessionStorageService: CommonsSessionStorageService,
  ) {}

  private getRealmTypeFromFlowApp(): RealmTypesItemModel {
    const flowApp =
      this.commonsSessionStorageService.get<FlowAppEnum>("flowApp");
    const realmTypesMap = CommonsConstants.REALM_TYPES as RealmTypesModel;
    if (flowApp && flowApp in realmTypesMap) {
      return realmTypesMap[flowApp]!;
    }
    return { realm: undefined };
  }

  private buildEndPoint(
    realm: RealmType = undefined,
    subrealm: SubrealmType = undefined,
  ): string {
    let endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.NEW_PAYMENT_AVAILABLE;
    const realmType: RealmTypesItemModel = realm
      ? { realm, subrealm }
      : this.getRealmTypeFromFlowApp();
    endpoint = endpoint
      .replace("{marketId}", this.$rootScope.appMarket)
      .replace("{realm}", realmType.realm ?? "");
    if (realmType.subrealm) {
      endpoint += `?subRealm=${realmType.subrealm}`;
    }
    return endpoint;
  }

  /**
   * @description Returns new payment availabilty data as promise interface
   */
  async getNewPaymentAvailiability(
    realm: RealmType = undefined,
    subrealm: SubrealmType = undefined,
  ) {
    return this.basePromiseService.get<NewPaymentAvailiabilityResponse>(
      this.buildEndPoint(realm, subrealm),
      {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      },
    );
  }

  async isNewPaymentAvailiability(
    realm: RealmType = undefined,
    subrealm: SubrealmType = undefined,
  ): Promise<boolean> {
    try {
      const response = await this.getNewPaymentAvailiability(realm, subrealm);
      return response?.data?.available;
    } catch (error) {
      return false;
    }
  }
}

downgradeToAJSService(
  "IbCNewPaymentAvailiabilityService",
  IbCNewPaymentAvailiabilityService,
  "ib-commons-http-service-module",
);
