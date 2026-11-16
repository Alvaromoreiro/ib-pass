@Component(
  "ib-notice-module",
  "ibUiNotice",
  {
    bindings: {
      type: "=?",
      icon: "=?",
      model: "=?",
    },
    controllerAs: "noticeCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-notice-view.html`;
      },
    ],
  },
  ["$rootScope", "$scope"],
  [],
)
class IbUiNoticeController implements ng.IController {
  public type: string;
  public icon: string;
  public showLightbox: boolean = false;
  public viewNoticeHidden: boolean = false;

    constructor (
        private $rootScope:CommonsRootScope
    ) {
    }

  ////////////////
  $onInit() {}

  /**
   * Close lightbox and send event to BKI
   */
  toggleGenericLightBox = (launcher): void => {
    this.viewNoticeHidden = !this.viewNoticeHidden;
    if (launcher && launcher.length > 0) {
      this.$rootScope.$broadcast(launcher);
    }
  };
  action = (launcher): void => {
    if (launcher && launcher.length > 0) {
      this.$rootScope.$broadcast(launcher);
    }
  };
  close = (): void => {
    this.$rootScope.$broadcast("closeOnholdLightBox", false);
  };
  acceptBuyOnhold = (): void => {
    this.$rootScope.$broadcast("acceptBuyOnhold", true);
    this.close();
  };
}
