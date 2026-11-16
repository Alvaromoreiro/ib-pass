@Directives("ib-commons-modal-service-module", [
  "$rootScope",
  "$timeout",
  "$interval",
])
class ibLoadingPlaneOverlay implements ng.IDirective {
  constructor(
    private $rootScope: CommonsRootScope,
    private $timeout: ng.ITimeoutService,
    public $interval: ng.IIntervalService,
  ) {}

  restrict = "AE";
  controller = "ibLoadingPlaneController";
  link = (scope: any, elem: any): void => {
    let time = 1000;
    if (!this.$rootScope.isAvailability) {
      time = 0;
    }
    //- Init Overlay
    this.$timeout(() => {
      elem.addClass("ib-background--overlay");
    }, time);
    //- Show each items Loading Circle - Interval 1 sec
    this.$timeout(() => {
      const hideElems = angular.element(elem).find(".hidden");
      let counter = 0;
      const intervalPromise = this.$interval(() => {
        angular.element(hideElems[counter]).removeClass("hidden");
        counter++;
        if (counter === hideElems.length) {
          this.$interval.cancel(intervalPromise);
        }
      }, time);
    }, time);
  };
}
