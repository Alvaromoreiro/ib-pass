import * as angular from "angular";
import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";

@Component(
  "ib-ui-summary-fare-module",
  "ibUiSummaryFare",
  {
    bindings: {
      fares: "<",
      name: "<",
    },
    controllerAs: "uiSummaryFareCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-summary-fare.html`;
      },
    ],
  },
  ["CommonsUtilService", "CommonsModalService"],
  [],
)
export class IbUiSummaryFareController implements ng.IController {
  public fares: UiComponentsModel.SummaryFareTrip[];
  public name: string;

  constructor(
    private CommonsUtilService: CommonsUtilService,
    private CommonsModalService: CommonsModalService,
  ) {}

  getFareIcon = (type: string): string => {
    return this.CommonsUtilService.getFareIcon(type);
  };

  modalSelector = (model: object) => {
    this.CommonsModalService.showGenericModal(
      false,
      "ib-fare-modal-summary.html",
      model,
      null,
    ).result.then(angular.noop, angular.noop);
  };
}
