import * as angular from "angular";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";

@Component(
  "ib-ui-box-card-module",
  "ibUiBoxCard",
  {
    controllerAs: "uiBoxCardCtrl",
    bindings: {
      type: "=?",
      state: "=?", // new | premium | next | inactive
      stateText: "=?",
      case: "=?",
      image: "=?",
      icon: "=?",
      titleTxt: "=?",
      since: "=?",
      price: "=?",
      originalPrice: "=?",
      origin: "=?",
      text: "=?",
      active: "=?",
      date: "=?",
      daterange: "=?",
      daterangeReturn: "=?",
      offer: "=?",
      periodText: "=?",
      originText: "=?",
      daterangeDeparture: "=?",
      daterangeDepartureTo: "=?",
      number: "=?",
      availability: "=?",
      modifier: "=?",
      actions: "=",
      buttonModifier: "=?",
    },
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-box-card-view.html`;
      },
    ],
  },
  ["CommonsConstants", "$window"],
  [],
)
class IbUiBoxCard implements ng.IController {
  public image: UiComponentsModel.Image;
  constructor(
    private CommonsConstants: CommonsConstantsType,
    private $window: ng.IWindowService,
  ) {}

  returnBoxCardImage = (card) => {
    const image =
      this.$window.location.origin +
      this.CommonsConstants.CARDS_IMAGES.FLASH_DEFAULT_CARD_URL;
    this.image.url = image;
    angular
      .element(card)
      .parent()
      .css("background-image", 'url("' + image + '")');
    return image;
  };

  active = (): any => {};
  $onInit = this.active();
}
