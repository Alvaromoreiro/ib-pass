import { Injectable } from "@angular/core";
import {
  downgradeToAJSService,
  IbCUserUtilsService,
} from "ib-web-commons/utils";
import {
  IbCPromiseBaseRestService,
  ProxyResponse,
} from "ib-web-commons/proxies";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import {
  AddAssociateRequest,
  AddAssociateResponse,
  AssociateResponse,
  AssociatesResponse,
  UpdateAssociateRequest,
  UpdateAssociateResponse,
} from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbCAssociatesService {
  constructor(
    private ibCPromiseBaseRestService: IbCPromiseBaseRestService,
    private ibCUserUtilsService: IbCUserUtilsService,
  ) {}

  async getRetrieveAssociate(): Promise<ProxyResponse<AssociatesResponse>> {
    const frequentFlyer = this.ibCUserUtilsService.getFrequentFlyer();
    const endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.RETRIEVE_IB_PLUS_ASSOCIATES.replace(
        "{{memberIdentifier}}",
        frequentFlyer,
      );

    return this.ibCPromiseBaseRestService.get(endpoint);
  }

  async getRetrieveAssociateDetail(
    identifier: string,
  ): Promise<ProxyResponse<AssociateResponse>> {
    const frequentFlyer = this.ibCUserUtilsService.getFrequentFlyer();
    const endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.RETRIEVE_IB_PLUS_ASSOCIATE.replace(
        "{{memberIdentifier}}",
        frequentFlyer,
      )
        .replace("{{associate-identifier}}", identifier)
        .replace("{{programme-identifier}}", "IBP");

    return this.ibCPromiseBaseRestService.get(endpoint);
  }

  async addAssociate(
    body: AddAssociateRequest,
  ): Promise<ProxyResponse<AddAssociateResponse>> {
    const frequentFlyer = this.ibCUserUtilsService.getFrequentFlyer();
    const endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ADD_IB_PLUS_ASSOCIATE.replace(
        "{{memberIdentifier}}",
        frequentFlyer,
      );

    return this.ibCPromiseBaseRestService.post(endpoint, body);
  }

  async updateAssociate(
    body: UpdateAssociateRequest,
    identifier: string,
  ): Promise<ProxyResponse<UpdateAssociateResponse>> {
    const frequentFlyer = this.ibCUserUtilsService.getFrequentFlyer();
    const endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.UPDATE_IB_PLUS_ASSOCIATE.replace(
        "{{memberIdentifier}}",
        frequentFlyer,
      ).replace("{{associate-identifier}}", identifier);

    return this.ibCPromiseBaseRestService.put(endpoint, body);
  }

  async deleteAssociate(identifier: string): Promise<ProxyResponse> {
    const frequentFlyer = this.ibCUserUtilsService.getFrequentFlyer();
    const endpoint =
      CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.DELETE_IB_PLUS_ASSOCIATES.replace(
        "{{memberIdentifier}}",
        frequentFlyer,
      )
        .replace("{{programme-identifier}}", "IBP")
        .replace("{{associate-identifier}}", identifier);

    return this.ibCPromiseBaseRestService.delete(endpoint);
  }
}

type IBCAssociatesService = IbCAssociatesService;
export type { IBCAssociatesService };
downgradeToAJSService(
  "IBCAssociatesService",
  IbCAssociatesService,
  "ib-commons-http-service-module",
);
