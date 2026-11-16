@Component(
  "ib-ui-travel-info-module",
  "ibUiTravelInfo",
  {
    bindings: {
      travelInfo: "=?",
      isMultiCity: "=?",
      isPaOpen: "=",
      showPassengers: "=?",
      showClaim: "=?",
      modifier: "=?",
    },
    controllerAs: "uiTravelInfoCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-travel-info-view.html`;
      },
    ],
  },
  [],
  [],
)
class ibUiTravelInfoController implements ng.IController {
  public travelInfo: any;
  public isMultiCity: boolean;
  public isPaOpen: boolean;
  public showPassengers: boolean;
  public showClaim: boolean;
  public modifier: string;
  constructor() {}
}
