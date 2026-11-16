@Component(
  "ib-ui-fare-conditions-module",
  "ibUiFareConditions",
  {
    bindings: {
      inputs: "<",
    },
    controllerAs: "ibUiFareConditionsCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-fare-conditions-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiFareConditionsController implements ng.IController {
  public inputs: any;
  constructor() {}
  public $onInit() {}
}
