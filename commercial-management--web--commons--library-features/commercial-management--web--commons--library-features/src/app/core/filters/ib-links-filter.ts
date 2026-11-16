import { CommonsConstantsType } from "../constants/ib-commons-constants";

function IbCLinksFilter(
  CommonsConstants: CommonsConstantsType,
  $window: ng.IWindowService,
  localStorageService: angular.local.storage.ILocalStorageService,
) {
  return (id: string): string => {
    const linksList = localStorageService.get("linksList") || {};
    const generalLinksList = localStorageService.get("generalLinksList") || {};
    let link: CommonsFilterModels.LinkFilterData = {};
    if (linksList[id]) {
      link = linksList[id];
    } else {
      if (generalLinksList[id]) {
        link = generalLinksList[id];
      } else {
        link = {
          uri: `/${id}`,
        };
      }
    }
    let response = "";
    if (link.needsOrigin && link.needsMarket) {
      response =
        $window.location.origin +
        `/${CommonsConstants.market.toLowerCase()}` +
        `${link.uri}`;
    } else {
      if (link.needsMarket) {
        response = `/${CommonsConstants.market.toLowerCase()}`;
      } else {
        response = `${link.uri}`;
      }
      `${link.needsMarket}/CommonsConstants.market.toLowerCase()`;
    }
    return response;
  };
}
module IbCLinksFilter {
  export const $inject = ["CommonsConstants", "$window", "localStorageService"];
}
@Filters(
  "ib-commons-filters-module",
  ["CommonsConstants", "$window", "localStorageService"],
  [],
  IbCLinksFilter,
  "IbCLinksFilter",
)()
class IbCLinksFilterClass {
  constructor() {}
}
