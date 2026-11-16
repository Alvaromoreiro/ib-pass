import { InjectionToken } from "@angular/core";
import { upgradeAJSServiceProvider } from "../ib-commons-angularjs-utils";
export const AJSCurrencyService = new InjectionToken("CurrencyService");
export const AJSCurrencyServiceProvider = upgradeAJSServiceProvider(
  "CurrencyService",
  AJSCurrencyService,
);
