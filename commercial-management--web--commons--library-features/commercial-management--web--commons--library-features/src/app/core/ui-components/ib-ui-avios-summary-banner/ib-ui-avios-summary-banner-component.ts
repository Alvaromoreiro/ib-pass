@Component(
  "ib-ui-avios-summary-banner-module",
  "ibUiAviosSummaryBanner",
  {
    bindings: {},
    controllerAs: "ibUiAviosSummaryBannerCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-avios-summary-banner-view.html`;
      },
    ],
  },
  ["localStorageService", "$window"],
  [],
)
class ibUiAviosSummaryBannerController implements ng.IController {
  public logged: boolean;

  constructor(
    private localStorageService: angular.local.storage.ILocalStorageService,
    private $window: ng.IWindowService,
  ) {}

  $onInit(): void {
    this.logged = this.localStorageService.get("userLogged");
  }

  /**
   *
   * @param url recibe una url y abre popUp en segundo plano si el usuario permite ventanas emergentes
   */
  linkPopup(url: string) {
    this.$window.open(url, "_blank", 'fullscreen="yes"');
  }
}
