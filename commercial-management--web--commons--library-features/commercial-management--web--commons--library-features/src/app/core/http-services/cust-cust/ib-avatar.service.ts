import { Injectable } from "@angular/core";
import { IbCBaseSFService, LOGGED_FLOW_BLOCKING } from "ib-web-commons/proxies";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import { map, Observable } from "rxjs";
import { HttpContext } from "@angular/common/http";
import { downgradeToAJSService } from "ib-web-commons/utils";
import { AvatarResponse } from "ib-web-commons/models";
import { IbCHttpErrorHandlerService } from "../errors/ib-commons-http-error-handler.service";

@Injectable({
  providedIn: "root",
})
export class IbAvatarService {
  constructor(
    private baseSFService: IbCBaseSFService,
    private errorHandler: IbCHttpErrorHandlerService,
  ) {}

  /**
   * @description [CPA-184] Post the image selected by the user
   */
  postAvatarImg = (data: FormData): Observable<undefined> => {
    const endpoint =
      CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.GET_AVATAR;
    return this.baseSFService
      .post<undefined>(endpoint, data, {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      })
      .pipe(
        map((res) => res.body),
        this.errorHandler.handleErrorOperator(),
      );
  };

  /**
   * @description [CPA-184] Get the image uploaded by the user (User Avatar)
   */
  getAvatarImg = (): Observable<AvatarResponse> => {
    const endpoint =
      CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.GET_AVATAR;
    return this.baseSFService.get(endpoint, { responseType: "blob" }).pipe(
      this.errorHandler.handleErrorOperator(),
      map((res) => ({
        image: res.body,
        status: res.status,
      })),
    );
  };
}
downgradeToAJSService(
  "IbAvatarService",
  IbAvatarService,
  "ib-http-services-module",
);
