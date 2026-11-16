import { Injectable } from "@angular/core";
import { downgradeInjectable } from "@angular/upgrade/static";
import { TranslateService } from "@ngx-translate/core";
import * as angular from "angular";

@Injectable({
  providedIn: "root",
})
export class TranslateFactoryService {
  constructor(public translateService: TranslateService) {}

  setLanguage = (language: string): void => {
    this.translateService.use(language);
  };
}

try {
  angular
    .module("ib-commons-utils-module")
    .service(
      "TranslateFactoryService",
      downgradeInjectable(TranslateFactoryService),
    );
} catch {
  angular
    .module("ib-commons-utils-module", [])
    .service(
      "TranslateFactoryService",
      downgradeInjectable(TranslateFactoryService),
    );
}
