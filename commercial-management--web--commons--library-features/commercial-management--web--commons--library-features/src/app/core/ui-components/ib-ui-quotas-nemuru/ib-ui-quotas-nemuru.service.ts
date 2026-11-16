/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@angular/core";
import {
  CustomWindowNemuru,
  AvailableConditionsResponse,
  CalculateConditionsResponse,
  Currency,
} from "./ib-ui-quotas-nemuru-models";
import quotasNemuruConstants from "./ib-ui-quotas-nemuru-constans";
import {
  AJSRootScope,
  CommonsRootScope,
  downgradeToAJSService,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";

@Injectable({
  providedIn: "root",
})
export class IbUiQuotasNemuruService {
  private $window: CustomWindowNemuru;
  private currency: Currency;
  private isProd = false;
  private amount = 0;
  private defaultCurrency = {
    code: "EUR",
    description: "Euro",
    symbol: "€",
    alignment: "R",
    groupingSeparator: ".",
    decimalSeparator: ",",
    decimals: 2,
    recommendedDisplay: "symbol",
  };

  constructor(
    @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
    private commonsSessionStorageService: CommonsSessionStorageService,
  ) {
    this.$window = window;
    this.currency =
      this.commonsSessionStorageService.get<{ currency: Currency }>(
        "commercialData",
      )?.currency ?? this.defaultCurrency;
    this.isProd = !!this.$rootScope?.production || false;
  }

  public getQuotasData = async (amount: number): Promise<unknown> => {
    if (!amount) {
      return [];
    }
    this.amount = amount;
    if (!this.$window.Nemuru) {
      try {
        return (await this.getScript()) as [];
      } catch (error) {
        return [];
      }
    }
    return this.calculateConditions();
  };

  private getScript = async (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const $script = document.createElement("script");
      const srcScript: string =
        (this.isProd
          ? quotasNemuruConstants?.scriptsUrl?.pro
          : quotasNemuruConstants?.scriptsUrl?.dev) || "";
      $script.setAttribute("src", srcScript);
      $script.onload = async () => {
        try {
          resolve((await this.initScript()) as []);
        } catch (error) {
          reject();
        }
      };
      $script.onerror = () => {
        reject();
      };
      document.head.appendChild($script);
    });
  };

  private initScript = async () => {
    try {
      await this.$window.Nemuru?.init({
        clientId: this.getClientId(),
        configuration: {
          currency: this.currency.code,
          decimalSeparator: this.currency.decimalSeparator,
          thousandSeparator: this.currency.groupingSeparator,
          locale: this.getLang(),
        },
      });
      return this.calculateConditions() as [];
    } catch (error) {
      return [];
    }
  };

  private calculateConditions = () => {
    const availableConditions: AvailableConditionsResponse[] | [] =
      this.$window?.Nemuru?.availableConditions({ amount: this.amount }) ?? [];
    if (availableConditions?.length > 0) {
      const calculatedConditions: CalculateConditionsResponse[] | [] =
        this.$window?.Nemuru?.calculateConditions({
          conditions: {
            amount: this.amount,
            product: quotasNemuruConstants.product,
          },
        }) ?? [];
      return calculatedConditions as [];
    }
    return [];
  };

  private getClientId = (): string => {
    const clientId = this.$rootScope.production
      ? quotasNemuruConstants.clientId.prod
      : quotasNemuruConstants.clientId.dev;
    return clientId;
  };

  private getLang = (): string => {
    let nemuruLang = "en-US";
    for (const codeLang of quotasNemuruConstants.codesLang) {
      if (this.$rootScope.appLang === codeLang.lang) {
        nemuruLang = codeLang.nemuruLang;
        break;
      }
    }
    return nemuruLang;
  };
}

downgradeToAJSService(
  "ibUiQuotasNemuruService",
  IbUiQuotasNemuruService,
  "ib-commons-ui-components-module",
);
