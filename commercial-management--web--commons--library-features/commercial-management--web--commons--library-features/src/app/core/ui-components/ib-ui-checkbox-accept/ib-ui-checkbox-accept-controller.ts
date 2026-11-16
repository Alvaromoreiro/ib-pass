@Component(
  "ib-ui-checkbox-accept-module",
  "ibUiCheckboxAccept",
  {
    bindings: {
      containerForm: "=?",
      conditionsText: "<",
    },
    controllerAs: "ibUiCheckboxAcceptCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-checkbox-accept-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiCheckboxAcceptController implements ng.IController {
  public containerForm: HTMLFormElement;
  public conditionsText: string;
  constructor() {}
  public $onInit() {}
}
