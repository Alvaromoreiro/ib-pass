@Component(
  "ib-ui-drop-down-list-module",
  "ibUiDropDownList",
  {
    controllerAs: "uiDropDownListCtrl",
    bindings: {
      conditions: "=?",
    },
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-drop-down-list-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiDropDownListComponent implements ng.IController {
  constructor() {}

  active = (): any => {};
  $onInit = this.active();
}
