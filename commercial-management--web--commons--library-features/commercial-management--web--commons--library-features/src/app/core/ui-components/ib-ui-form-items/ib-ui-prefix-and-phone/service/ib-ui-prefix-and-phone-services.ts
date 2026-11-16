import { GetPhoneCodesService } from "ib-web-commons/http-services";
import * as angular from "angular";
import { downgradeInjectable } from "@angular/upgrade/static";
import { Injectable } from "@angular/core";
import { IbUiPrefixAndPhoneTransformer } from "../transformer/ib-ui-prefix-and-phone-transformer";
import { Prefix, PrefixResponse } from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbUiPrefixAndPhoneService {
  constructor(
    private getPhoneCodesService: GetPhoneCodesService,
    private ibUiPrefixAndPhoneTransformer: IbUiPrefixAndPhoneTransformer,
  ) {}

  initializePrefixAndPhone = (): Promise<Prefix[]> => {
    return new Promise((resolve, reject) => {
      const initializePrefixAndPhoneError = (error: unknown): void => {
        reject(error);
      };

      const initializePrefixAndPhoneSuccess = (
        phoneCodes: PrefixResponse[],
      ): void => {
        resolve(
          this.ibUiPrefixAndPhoneTransformer.transformPrefixAndPhone(
            phoneCodes,
          ),
        );
      };

      this.getPhoneCodesService
        .getPhoneCodesList()
        .then(initializePrefixAndPhoneSuccess, initializePrefixAndPhoneError);
    });
  };
}

try {
  angular
    .module("ib-ui-prefix-and-phone-module")
    .service(
      "ibUiPrefixAndPhoneService",
      downgradeInjectable(IbUiPrefixAndPhoneService),
    );
} catch {
  angular
    .module("ib-ui-prefix-and-phone-module", [])
    .service(
      "ibUiPrefixAndPhoneService",
      downgradeInjectable(IbUiPrefixAndPhoneService),
    );
}
