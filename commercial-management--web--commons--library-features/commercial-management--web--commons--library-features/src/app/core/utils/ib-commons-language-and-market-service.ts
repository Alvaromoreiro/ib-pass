import * as angular from "angular";
import { CommonsUtilService } from "./ib-commons-utils-service";
import { CommonsConstantsType } from "../constants/ib-commons-constants";
import { CommonsCookiesService } from "./public_api";

@Service("ib-commons-utils-module", [
  "CommonsCookiesService",
  "$window",
  "CommonsConstants",
  "CommonsUtilService",
])
export class CommonsLanguageAndMarketService {
  constructor(
    private CommonsCookiesService: CommonsCookiesService,
    private $window: ng.IWindowService & {
      navigator: { browserLanguage: any };
    },
    private CommonsConstants: CommonsConstantsType,
    private CommonsUtilService: CommonsUtilService,
  ) {}

  ////////////////
  init = (
    marketParameters: string[] = this.CommonsConstants.nameParameters.market,
    langParameters: string[] = this.CommonsConstants.nameParameters.lang,
  ) => {
    /////////////LANGUAGE AND MARKET///////////
    const langCookie: string =
      this.CommonsCookiesService.get(
        this.CommonsConstants.COOKIES.PERSONALIZATION,
      ) ?? "";
    const langUrl: string =
      this.CommonsUtilService.getURLFirstParameterByName(langParameters) ?? "";
    const langUrlMarket: string =
      this.CommonsUtilService.getURLFirstParameterByName(marketParameters) ??
      "";
    const expiration = new Date();
    let langNav =
      this.$window.navigator.language ??
      this.$window.navigator.browserLanguage ??
      "";
    let lang = this.CommonsConstants.defaultLang;
    let market = this.CommonsConstants.defaultMarket;
    langNav = langNav && langNav.split("-")[0];

    //The first criterion to define the language is by parameter in the URL
    if (langUrl.length > 0) {
      lang = langUrl.toLowerCase();
    } else if (langCookie.length > 0) {
      lang = langCookie.split("|")[2];
    } else if (langNav.length > 0) {
      lang = langNav.toLowerCase();
    }
    //The first criterion to define the market is by parameter in the URL
    if (langUrlMarket.length > 0) {
      market = langUrlMarket.toUpperCase();
    } else if (langCookie.length > 0) {
      market = langCookie.split("|")[1];
    }

    if (this.CommonsConstants.availableLanguages.indexOf(lang) === -1) {
      lang = this.CommonsConstants.defaultLang;
    }
    if (market === "") {
      market = this.CommonsConstants.defaultMarket;
    }

    //update the cookie with the new values of market and language
    const content = market + "|" + market + "|" + lang + "| | |" + market + "|";
    expiration.setTime(
      expiration.getTime() + this.CommonsConstants.COOKIES.DEFAULT_EXPIRY_TIME,
    );
    this.CommonsCookiesService.set(
      this.CommonsConstants.COOKIES.PERSONALIZATION,
      content,
      { expires: expiration, path: this.CommonsConstants.COOKIES.DEFAULT_PATH },
    );
    return { market: market, language: lang };
  };
}
