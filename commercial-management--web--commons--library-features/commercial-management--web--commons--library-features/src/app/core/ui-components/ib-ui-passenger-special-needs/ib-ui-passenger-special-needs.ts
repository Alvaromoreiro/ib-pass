@Component(
  "ib-ui-passenger-special-needs-module",
  "ibUiSpecialNeeds",
  {
    bindings: {
      passengersFormData: "=",
      relatedContent: "<",
      index: "<",
      containerForm: "<",
    },
    controllerAs: "pasSpeNeedsCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-passenger-special-needs.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiPassengerSpecialNeeds implements ng.IController {
  passengersFormData: any;
  constructor() {}

  ////////////////

  $onInit() {}

  private uncheckSpecialNeedsRadioButtons() {
    if (
      angular.isUndefined(this.passengersFormData.specialNeeds.specialVision)
    ) {
      this.passengersFormData.specialNeeds.specialVision = false;
      this.passengersFormData.specialNeeds.specialVisionValue = "";
    }
    if (
      angular.isUndefined(this.passengersFormData.specialNeeds.specialHearing)
    ) {
      this.passengersFormData.specialNeeds.specialHearing = false;
      this.passengersFormData.specialNeeds.specialHearingValue = "";
    }
    if (
      angular.isUndefined(
        this.passengersFormData.specialNeeds.specialWheelchair,
      )
    ) {
      this.passengersFormData.specialNeeds.specialWheelchair = false;
    }
  }

  specialWheelchairSelected = (): void => {
    if (
      this.passengersFormData.initSpecialWheelchair !==
      this.passengersFormData.specialWheelchair
    ) {
      this.passengersFormData.wheelChair.selected =
        this.passengersFormData.wheelChair[0].id;
    } else if (!this.passengersFormData.initSpecialWheelchair) {
      this.passengersFormData.wheelChair.selected = "00";
    }
  };

  /**
   * Checks if the special Needs check is correctly filled and returns
   * false or true based on the current state
   * @returns (boolean) If the special needs is correctly fullfiled
   */
  isSpecNeedsCorrect() {
    let valid = true;
    if (
      this.passengersFormData.specialNeeds.isEnable &&
      !this.passengersFormData.specialNeeds.blind &&
      !this.passengersFormData.specialNeeds.deaf &&
      !this.passengersFormData.specialNeeds.svan &&
      !this.passengersFormData.specialNeeds.wheelChair
    )
      valid = false;
    return valid;
  }
}
