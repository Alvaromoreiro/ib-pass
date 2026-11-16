import { Inject, Pipe, PipeTransform } from "@angular/core";
import { CommonsConstants } from "ib-web-commons/constants";
import {
  AJSRootScope,
  CommonsRootScope,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";
import { LinkFilterData } from "ib-web-commons/models";

/**
 * @description Returns the link given its key in the input with its market and origin if necessary .
 */
@Pipe({
  name: "link",
})
export class IbCLinkPipe implements PipeTransform {
  constructor(
    private commonsSessionStorageService: CommonsSessionStorageService,
    @Inject(AJSRootScope) private rootScope: CommonsRootScope,
  ) {}

  /**
   * @description Returns the link given its key in the input with its market and origin if necessary.
   * @param {string} text The key of the link in ib-commons.
   * @param {object} config The config to override of the pipe, like market and origin.
   * @return A full link to your market and origin if needed.
   * @author Alvaro Moreiro
   */
  transform(
    text: string,
    config?: { withMarket?: boolean; withOrigin?: boolean },
  ) {
    const market: string = this.rootScope.appMarket
      ? this.rootScope.appMarket.toLowerCase()
      : CommonsConstants.market.toLowerCase();
    const linksList =
      this.commonsSessionStorageService.get<Record<string, LinkFilterData>>(
        "linksList",
      ) ?? {};
    const generalLinksList =
      this.commonsSessionStorageService.get<Record<string, LinkFilterData>>(
        "generalLinksList",
      ) ?? {};
    let link: LinkFilterData = { uri: `/${text}` };
    if (linksList[text]) {
      link = linksList[text];
    } else if (generalLinksList[text]) {
      link = generalLinksList[text];
    }

    let valueOrigin = "";
    let valueMarket = "";
    if (
      (typeof config?.withOrigin === "undefined" && link.needsOrigin) ||
      config?.withOrigin
    ) {
      valueOrigin = window.location.origin;
    }
    if (
      (typeof config?.withMarket === "undefined" && link.needsMarket) ||
      config?.withMarket
    ) {
      valueMarket = `/${market}`;
    }
    return `${valueOrigin}${valueMarket}${link.uri}`;
  }
}
