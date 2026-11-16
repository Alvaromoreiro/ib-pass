import * as angular from "angular";
import { IbUiAviosSummaryService } from "./services/ib-ui-avios-summary-services";

export class IbUiAviosSummaryController {
  public request;
  public isUserLogged: boolean;
  public serviceError: boolean = false;
  public isLoading: boolean = true;
  public modelSummary;
  public flowApp: string;
  public actualStep: string;
  public service_error: string;
  public show: boolean = false;

  constructor(
    private IbUiAviosSummaryService: IbUiAviosSummaryService,
    private localStorageService: angular.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
    private $scope: angular.IScope,
    private $filter: ng.IFilterService,
  ) {
    const flightConfirmationEvent = this.$rootScope.$on(
      "flightAviosInfo",
      this.getCalculateAviosSummary,
    );
    $scope.$on("$destroy", flightConfirmationEvent);
    this.$rootScope.$on("updateAvios", this.updatedAvios);
  }

  $onInit(): void {
    this.isUserLogged = this.localStorageService.get("userLogged");
    this.request = this.localStorageService.get("flightAviosInfo");
    if (this.request !== null) {
      this.getCalculateAviosSummary();
    } else {
      this.isLoading = false;
      this.serviceError = true;
    }
    this.flowApp = this.localStorageService.get("flowApp");
    this.getMessageServiceError();
  }

  getMessageServiceError = (): void => {
    this.actualStep = this.localStorageService.get("actualStepFlow");
    switch (this.flowApp) {
      case "BBKI":
        if (this.actualStep === "ibcmtv") {
          this.service_error = this.$filter("translate")(
            "SBE_SERVICE_ERROR_TEXT",
          );
        } else if (this.actualStep === "confirmation" && this.isUserLogged) {
          this.service_error = this.$filter("translate")(
            "SBE_SERVICE_ERROR_CONFIRMATION_LOGGED",
          );
        } else {
          this.service_error = this.$filter("translate")(
            "SBE_SERVICE_ERROR_CONFIRMATION_NOT_LOGGED",
          );
        }
        break;
      default:
        this.service_error = this.$filter("translate")(
          "SBE_SERVICE_ERROR_TEXT",
        );
    }
  };

  getCalculateAviosSummary = (): void => {
    this.isLoading = true;
    this.request = this.localStorageService.get("flightAviosInfo");
    this.IbUiAviosSummaryService.getCalculateAviosSummary(this.request).then(
      (response) => {
        this.modelSummary = response;
        this.serviceError = false;
        this.isLoading = false;
      },
      (error) => {
        this.serviceError = true;
        this.isLoading = false;
      },
    );
  };

  updatedAvios = () => {
    const calculatedPoints: any =
      this.localStorageService.get("CalculatedPoints");
    this.show = calculatedPoints.Avios !== 0;
  };
}

const selector = "ibUiAviosSummary";
const options = {
  bindings: {},
  controller: IbUiAviosSummaryController,
  controllerAs: "IbUiAviosSummaryCtrl",
  templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
      return `${$rootScope.routes.templates}ib-ui-avios-summary-view.html`;
    },
  ],
};
const inject = [
  "IbUiAviosSummaryService",
  "localStorageService",
  "$rootScope",
  "$scope",
  "$filter",
];
try {
  const mod = angular.module("ib-ui-avios-summary-module");
  IbUiAviosSummaryController.$inject = inject;
  mod.component(selector, options);
} catch (error) {
  const mod = angular.module("ib-ui-avios-summary-module", []);
  IbUiAviosSummaryController.$inject = inject;
  mod.component(selector, options);
}
