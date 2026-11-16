@Directives("ib-commons-directives-module", ["$rootScope", "$timeout"])
class ibLoadingTargetPosition implements ng.IDirective {
  constructor(
    private $rootScope: CommonsRootScope,
    private $timeout: ng.ITimeoutService,
  ) {}

  restrict = "A";
  controller = "ibUiLoadingController";
  link = (scope: any, elem: any, attrs: any): void => {
    const targetHeight = angular
      .element(attrs.ibLoadingTargetPosition)
      .outerHeight();
    angular.element(elem).css("top", targetHeight);
  };
}
