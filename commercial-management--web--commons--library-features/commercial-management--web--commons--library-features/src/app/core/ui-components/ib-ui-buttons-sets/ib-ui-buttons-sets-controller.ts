@Component(
  "ib-ui-buttons-sets-module",
  "ibUiButtonsSets",
  {
    bindings: {
      type: "=?",
      modifier: "=?",
      items: "=?",
      editionMode: "=?",
    },
    controllerAs: "uiBtnSetsCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-buttons-sets-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiBtnSetsController implements ng.IController {
  public type: string;
  public modifier: string;
  public editionMode: boolean;
  public items: ButtonSetModel.buttonSetItem[];
  constructor() {}

  internalCallback = (event, index: number, actionId: string) => {
    this.items[index].callback(event, actionId);
  };
}
