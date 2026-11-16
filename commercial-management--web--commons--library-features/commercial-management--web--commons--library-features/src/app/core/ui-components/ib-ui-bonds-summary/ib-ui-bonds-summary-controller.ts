import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";

@Component(
  "ib-ui-bonds-summary-module",
  "ibUiBondsSummary",
  {
    bindings: {
      bondsInfo: "<",
      showExtraInfo: "<",
    },
    controllerAs: "ibUiBondsSummaryCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-bonds-summary-view.html`;
      },
    ],
  },
  ["CommonsModalService"],
  [],
)
class IbUiBondsSummaryController implements ng.IController {
  public bondsInfo: object;
  public showExtraInfo: boolean;
  constructor(private CommonsModalService: CommonsModalService) {}

  public openModalTermsConditions() {
    this.CommonsModalService.showGenericModal(
      false,
      "ib-modal-voucher-terms-and-conditions.html",
      {},
      "ib-modals ib-modals--md",
    ).result.then(
      () => {},
      () => {},
    );
  }
}
