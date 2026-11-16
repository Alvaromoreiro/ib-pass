@Directives(
  "ib-commons-directives-module",
  ["$timeout", "$window", "CommonsComponentUtils"],
  [],
)
class calculatePosition implements ng.IDirective {
  constructor(
    private $timeout: ng.ITimeoutService,
    private $window: ng.IWindowService,
    private CommonsComponentUtils: any,
    private showAndPosition: any,
  ) {}

    restrict: 'AE';
    link = (scope: any, elem: any, attrs: any) => {
        const eWindow = angular.element(this.$window);
        const element = elem[0];
        const container = angular.element('.container');
        let positionRight;
        let positionTop;
        const header = angular.element('#ib-header-component');

    scope.calculatePosition = () => {
      this.$timeout(() => {
        eWindow.trigger("resize");
      });
    };

    this.showAndPosition = () => {
      positionTop = header.height() + 24;
      angular.element(element).css("top", positionTop);
      if (this.$window.outerWidth >= 1024) {
        positionRight = (eWindow.width() - container.width() + 32) / 2;
      } else {
        positionRight =
          eWindow.width() > 600
            ? (eWindow.width() - container.width() + 16) / 2
            : 16;
      }
      if (this.$window.outerWidth <= 320) {
        angular.element(element).css("top", header.height() + 4);
      }
      angular.element(element).attr("data-rightpos", positionRight);
      angular.element(element).css("right", positionRight);
    };
    this.showAndPosition();

    eWindow.bind("resize", () => {
      this.showAndPosition();
    });
  };
}
