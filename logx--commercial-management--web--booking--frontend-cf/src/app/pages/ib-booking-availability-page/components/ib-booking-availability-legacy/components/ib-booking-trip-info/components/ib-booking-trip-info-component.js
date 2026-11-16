(function () {
  // Usage: <ib-booking-trip-info ></ib-booking-trip-info>
  //
  // Creates:
  //

  /* istanbul ignore next */
  angular.module("ib-booking-trip-info-module").component("ibBookingTripInfo", {
    controller: "BookingTripInfoController",
    controllerAs: "tripInfoCtrl",
    bindings: {
      tripInfoModel: "<",
      showAdaptativeMobileFlow: "<",
      currencies: "<",
      animationRun: "<",
      selectedSlicesLength: "<",
      currentOriginDestinationIndex: "<",
      redemption: "<",
    },
    templateUrl: [
      "BookingAppConstants",
      "$attrs",
      "$parse",
      function (BookingAppConstants, $attrs, $parse) {
        return (
          BookingAppConstants.templatesRoute +
          (($attrs && $attrs.template) || "ib-booking-trip-info-view.html")
        );
      },
    ],
  });
})();
