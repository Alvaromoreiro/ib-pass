import { Injectable } from "@angular/core";
import {
  IbCBaseSFService,
  IbCPromiseBaseSFService,
  LOGGED_FLOW_BLOCKING,
} from "ib-web-commons/proxies";
import { IbCHttpErrorHandlerService } from "../errors/ib-commons-http-error-handler.service";
import { map } from "rxjs";
import { downgradeToAJSService } from "ib-web-commons/utils";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import { HttpContext } from "@angular/common/http";
import {
  ContactDetailsZeroRequest,
  ContactDetailsZeroResponse,
} from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbCContactDetailsZeroService {
  constructor(
    private baseService: IbCBaseSFService,
    private basePromiseService: IbCPromiseBaseSFService,
    private errorHandler: IbCHttpErrorHandlerService,
  ) {}

  /**
   * @description Returns the contact details from Iberia User as Promise interface.
   */
  async getContactDetailsData() {
    const endpoint =
      CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.IB_ZERO_CONTACT_DETAILS;

    return this.basePromiseService
      .get<ContactDetailsZeroResponse>(endpoint, {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      })
      .catch(async (error) => Promise.reject(error));
  }

  /**
   * @description Update the contact details from Iberia User as Promise interface.
   */
  async updateContactDetailsData(bodyData: ContactDetailsZeroRequest) {
    const endpoint =
      CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.IB_ZERO_CONTACT_DETAILS;

    return this.basePromiseService
      .put<undefined>(endpoint, bodyData, {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      })
      .catch(async (error) => Promise.reject(error));
  }

  /**
   * @description Returns the contact details from Iberia User as Observable interface.
   */
  getContactDetails() {
    const endpoint =
      CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.IB_ZERO_CONTACT_DETAILS;

    return this.baseService
      .get<ContactDetailsZeroResponse>(endpoint, {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      })
      .pipe(
        map((res) => res.body),
        this.errorHandler.handleErrorOperator(),
      );
  }

  /**
   * @description Update the contact details from Iberia User as Observable interface.
   */
  updateContactDetails(body: ContactDetailsZeroRequest) {
    const endpoint =
      CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.IB_ZERO_CONTACT_DETAILS;

    return this.baseService
      .put<undefined>(endpoint, body, {
        context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true),
      })
      .pipe(
        map((res) => res.body),
        this.errorHandler.handleErrorOperator(),
      );
  }
}
type IBCContactDetailsZeroService = IbCContactDetailsZeroService;
export type { IBCContactDetailsZeroService };
downgradeToAJSService(
  "IBCContactDetailsZeroService",
  IbCContactDetailsZeroService,
  "ib-commons-http-service-module",
);
