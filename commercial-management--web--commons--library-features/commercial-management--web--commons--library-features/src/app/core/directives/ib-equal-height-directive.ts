@Directives(
  "ib-commons-directives-module",
  ["$timeout", "$window", "CommonsComponentUtils"],
  [],
)
class equalHeight implements ng.IDirective {
  constructor(
    private $timeout: ng.ITimeoutService,
    private $window: ng.IWindowService,
    private CommonsComponentUtils: any,
  ) {}

  restrict: "AE";
  link = (scope: any, elem: any, attrs: any) => {
    const eWindow = angular.element(this.$window);
    const element = elem[0];

    if (attrs.equalHeightReload) {
      this.CommonsComponentUtils.equalHeight(element, true);
    } else {
      this.CommonsComponentUtils.equalHeight(element);
    }

    scope.equalHeightReload = () => {
      this.$timeout(() => {
        angular.element(this.$window).trigger("resize");
      });
    };

    eWindow.bind("resize", () => {
      if (attrs.equalHeightReload) {
        this.CommonsComponentUtils.equalHeight(element, true);
      } else {
        this.CommonsComponentUtils.equalHeight(element);
      }
    });
  };
}
