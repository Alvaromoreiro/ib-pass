@Component(
  "ib-ui-box-information-module",
  "ibUiBoxInformation",
  {
    bindings: {
      title: "<",
      titleText: "<",
      content: "<",
      icon: "<",
      serviceText: "<",
    },
    controllerAs: "ibUiBoxInformationCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-box-information-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiBoxInformationController implements ng.IController {
  public title: string;
  public titleText: string;
  public content: string;
  public icon: string;
  public serviceText: string;
  constructor() {}
  public $onInit() {}
}
