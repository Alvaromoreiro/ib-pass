@Component(
  "ib-ui-titles-module",
  "ibUiTitles",
  {
    bindings: {
      type: "=?",
      modifier: "=?",
      icon: "=?",
      titleText: "=",
      subtitle: "=?",
      iconImage: "=?",
      iconImageAlt: "=?",
    },
    controllerAs: "uiTitlesCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-titles-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiTitlesController implements ng.IController {
  public type: string;
  public modifier: string;
  public icon: string;
  public titleText: string;
  public subtitle: string;
  public iconImage: string;
  public iconImageAlt: string;
  constructor() {
    this.iconImageAlt = this.iconImageAlt || "";
  }
}
