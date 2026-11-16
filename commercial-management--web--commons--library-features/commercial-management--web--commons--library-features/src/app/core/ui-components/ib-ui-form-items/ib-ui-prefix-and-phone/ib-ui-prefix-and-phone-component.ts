import ng from "angular";
import { IbUiPrefixAndPhoneService } from "./service/ib-ui-prefix-and-phone-services";

@Component(
  "ib-ui-prefix-and-phone-module",
  "ibUiPrefixAndPhone",
  {
    bindings: {
      containerForm: "<",
      phoneSelected: "=",
      editionMode: "<",
    },
    controllerAs: "ibUiPrefixAndPhoneCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-prefix-and-phone-view.html`;
      },
    ],
  },
  ["ibUiPrefixAndPhoneService"],
  [],
)
export class ibUiPrefixAndPhone implements ng.IController {
  public prefixList;
  public phoneSelected;
  constructor(private ibUiPrefixAndPhoneService: IbUiPrefixAndPhoneService) {}

  ////////////////

  $onInit = () => {
    this.ibUiPrefixAndPhoneService.initializePrefixAndPhone().then(
      (response) => {
        if (this.phoneSelected.prefix.id === "")
          this.phoneSelected.prefix = response[0];
        this.prefixList = response;
      },
      () => {},
    );
  };
}
