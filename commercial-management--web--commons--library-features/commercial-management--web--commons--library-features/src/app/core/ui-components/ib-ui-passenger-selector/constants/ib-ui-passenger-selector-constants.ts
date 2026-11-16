namespace IbUiPassengerSelectorConstantsNamespace {
  const passengerSelectorConstants = {
    PASSENGER_TYPES: {
      DEFAULT: "DEFAULT",
      SENIOR: "SENIOR",
      ADULT: "ADULT",
      YOUNG: "YOUNG",
      YOUTH: "YOUTH",
      CHILD: "CHILD",
      INFANT: "INFANT",
      SPECIAL_NEEDS: "SPECIAL_NEEDS",
    },
  };

  angular
    .module("ib-ui-city-passenger-constanst-component-module", [])
    .constant("IbUiPassengerSelectorConstants", passengerSelectorConstants);
  export type IbUiPassengerSelectorConstants =
    typeof passengerSelectorConstants;
}
