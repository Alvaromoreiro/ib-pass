@Component(
  "ib-ui-loading-module",
  "ibUiLoading",
  {
    bindings: {
      type: "=",
      identifier: "=?",
      viewTitle: "=?",
      modifier: "=?",
    },
    controllerAs: "uiLoadingCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-loading-view.html`;
      },
    ],
  },
  ["$timeout", "$interval", "$filter"],
  [],
)
class IbUiLoadingController implements ng.IController {
  public type: string;
  public identifier: string;
  public viewTitle: string;
  public modifier: string;
  public titleFormattedString: string;
  constructor(
    private $timeout: ng.ITimeoutService,
    public $interval: ng.IIntervalService,
    private $filter: ng.IFilterService,
  ) {
    this.viewTitle = this.viewTitle;
  }
  $onInit() {
    this.$timeout(() => {
      this.titleFormattedString = this.animateDotStrings(this.viewTitle);
    }, 250);
  }

  animateDotStrings = (viewTitle: string): string => {
    const dot: string = " ...";
    const titleFormatted: string = this.$filter("translate")(viewTitle) + dot;
    return titleFormatted;
  };
}
