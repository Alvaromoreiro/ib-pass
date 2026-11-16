@Component(
  "ib-ui-passenger-selector-module",
  "ibUiPassengerSelector",
  {
    controllerAs: "uiPassengerCtrl",
    bindings: {
      iconUp: "=",
      iconDown: "=",
      passengersTypes: "=",
      payWithAvios: "<",
      containerForm: "=",
      resetToggleCounter: "=",
      passengersConditions: "<",
      specialPassengerHasError: "=",
      isLoading: "<",
      modifier: "=?",
      numPassengerHasError: "=?",
      noInputLabel: "<?",
    },
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-passenger-selector-view.html`;
      },
    ],
  },
  [
    "localStorageService",
    "IbUiPassengerSelectorConstants",
    "$scope",
    "$window",
  ],
  ["ib-ui-city-passenger-constanst-component-module"],
)
class IbUiPassengerSelectorComponent implements ng.IController {
  model: IbUiPassengerSelectorComponentModel.Model;
  passengersConditions: IbUiPassengerSelectorComponentModel.PassengerCondition;
  filterActive = 0;
  filterMobileActive = 0;
  specialPassengerHasError = false;
  isOpen = false;
  isCollapsed = true;
  ariaText = "";
  toggleCounter = 0;
  onlyTeenager = false;
  passengersTypes = [];
  resetToggleCounter = false;
  modifier: string;
  numPassengerHasError: boolean = false;
  noInputLabel: boolean = false;

  constructor(
    private localStorageService: angular.local.storage.ILocalStorageService,
    private IbUiPassengerSelectorConstants: IbUiPassengerSelectorConstantsNamespace.IbUiPassengerSelectorConstants,
    private $scope: ng.IScope,
    private $window: ng.IWindowService,
  ) {}

  updateAdvSearchPassengersModel = () => {
    this.localStorageService.set(
      "AdvancedSearchPassengersModel",
      this.passengersTypes,
    );
  };

  toggle = () => {
    this.isOpen = !this.isOpen;
    this.isCollapsed = !this.isCollapsed;
    if (this.isOpen) {
      this.specialPassengerHasError = false;
      this.numPassengerHasError = false;
      this.updateAdvSearchPassengersModel();
      if (this.resetToggleCounter) {
        this.toggleCounter = 0;
      }
      this.toggleCounter++;
      if (this.toggleCounter > 1) {
        for (let i = 0; i < this.passengersTypes.length; i++) {
          if (this.passengersTypes[i].showMessage) {
            this.passengersTypes[i].isHidden = true;
            this.passengersTypes[i].showMessage = false;
          }
        }
      }
      this.resetToggleCounter = false;
    }
  };

  accesibility = () => {
    this.isOpen
      ? (this.ariaText = "HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED")
      : (this.ariaText = "HEADER_ADVANCED_SEARCH_PASSENGERS_CLOSED");
  };

  controlCollapse = (event: IbUiPassengerSelectorComponentModel.KeyCode) => {
    if (event.keyCode === 27) {
      this.isOpen = false;
      this.accesibility();
    }
  };

  addPassengers = (passenger) => {
    this.onlyTeenager = false;
    if (
      passenger.passengerType !==
        this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT &&
      passenger.passengerType !==
        this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD
    ) {
      this.passengersConditions.totalAdults++;
      this.passengersConditions.maxChilds += 2;
    }

    if (
      passenger.passengerType !==
      this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT
    ) {
      this.passengersConditions.passengersCount++;
    }

    passenger.count++;
    for (let i = 0; i < this.passengersTypes.length; i++) {
      if (
        passenger.passengerType !==
          this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT &&
        passenger.passengerType !==
          this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD &&
        this.passengersConditions.totalAdults > 1
      ) {
        this.passengersTypes[i].minPassenger = 0;
      }
      if (this.passengersTypes[i].passengerType === passenger.passengerType) {
        this.passengersTypes[i].count = passenger.count;
      }
    }
    if (
      this.passengersTypes[3].count === 1 &&
      this.passengersTypes[1].count < 1
    ) {
      this.onlyTeenager = true;
    }
    this.passengersConditions.passengersWithInfants++;
    this.$scope.$emit("updateSelectedPassengers", this.passengersTypes);
    this.updateAdvSearchPassengersModel();
  };

  removePassengers = (passenger) => {
    passenger.count--;
    this.passengersConditions.passengersWithInfants--;
    this.onlyTeenager = false;
    if (
      passenger.passengerType !==
      this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT
    )
      this.passengersConditions.passengersCount--;
    if (
      passenger.passengerType !==
        this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT &&
      passenger.passengerType !==
        this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD
    ) {
      this.passengersConditions.totalAdults--;
      this.passengersConditions.maxChilds -= 2;
      for (let i = 0; i < this.passengersTypes.length; i++) {
        if (
          this.passengersTypes[i].passengerType !==
            this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT &&
          this.passengersTypes[i].passengerType !==
            this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD
        ) {
          if (
            this.passengersConditions.totalAdults === 1 &&
            this.passengersTypes[i].count === 1
          ) {
            this.passengersTypes[i].minPassenger = 1;
          }
          if (
            this.passengersTypes[i].passengerType === passenger.passengerType
          ) {
            this.passengersTypes[i].count = passenger.count;
          }
        }
        if (
          this.passengersTypes[i].passengerType ===
            this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT &&
          passenger.count <= this.passengersTypes[i].count &&
          this.passengersTypes[i].count > 0 &&
          this.passengersConditions.totalAdults < this.passengersTypes[i].count
        ) {
          this.passengersTypes[i].count--;
          this.passengersConditions.passengersWithInfants--;
        }
        if (
          this.passengersTypes[i].passengerType ===
          this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD
        ) {
          while (
            this.passengersConditions.maxChilds < this.passengersTypes[i].count
          ) {
            this.passengersTypes[i].count--;
            this.passengersConditions.passengersWithInfants--;
            this.passengersConditions.passengersCount--;
          }
        }
      }
      if (
        this.passengersTypes[3].count === 1 &&
        this.passengersTypes[1].count < 1
      ) {
        this.onlyTeenager = true;
      }
    }
    this.$scope.$emit("updateSelectedPassengers", this.passengersTypes);
    this.updateAdvSearchPassengersModel();
  };

  triggerCollapse = () => {
    let clickedElement, clickedParent;
    this.toggle();
    this.accesibility();
    if (this.isOpen) {
      this.$window.onclick = (event) => {
        clickedElement = event.target;
        clickedParent = clickedElement.closest(".ib-passenger--selector");
        if (clickedParent === null) {
          this.isOpen = false;
          this.isCollapsed = true;
        }
      };
    } else {
      this.isOpen = false;
      this.isCollapsed = true;
      this.$window.onclick = null;
    }
  };

  active = (): any => {
    this.model = {
      maxPassengers: 9,
    };
    this.accesibility();
  };

  $onInit = this.active();
}
