import { Injectable } from "@angular/core";
import { IbCBaseSFService, LOGGED_FLOW_BLOCKING } from "ib-web-commons/proxies";
import { IbCHttpErrorHandlerService } from "../errors/ib-commons-http-error-handler.service";
import { map, Observable } from "rxjs";
import {
  downgradeToAJSService,
  IbCTokenUtilsService,
} from "ib-web-commons/utils";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import { HttpContext } from "@angular/common/http";
import { MemberPlusResponse } from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbCMembersDataPlusService {
  constructor(
    private baseService: IbCBaseSFService,
    private errorHandler: IbCHttpErrorHandlerService,
    private tokenUtilsService: IbCTokenUtilsService,
  ) {}

  /**
   * @description Get all the personal information for iberia plus users with the members service.
   */
  getPersonalData(): Observable<MemberPlusResponse> {
    const frequentFlyer =
      this.tokenUtilsService.getFrequentFlyerFromToken() ?? "NOT_FOUND";
    const endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.retrieveMembers.replace(
        "{{id}}",
        frequentFlyer,
      );

    return this.baseService
      .get<MemberPlusResponse>(endpoint, {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      })
      .pipe(
        map((res) => res.body),
        this.errorHandler.handleErrorOperator(),
      );
  }
}

downgradeToAJSService(
  "IbCMembersDataPlusService",
  IbCMembersDataPlusService,
  "ib-commons-http-service-module",
);
