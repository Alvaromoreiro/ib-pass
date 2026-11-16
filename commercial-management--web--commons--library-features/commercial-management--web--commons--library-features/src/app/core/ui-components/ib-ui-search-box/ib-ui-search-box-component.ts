import { CommonsConstantsType } from "../../constants/ib-commons-constants";

@Component(
  "ib-ui-search-module",
  "ibUiSearchBox",
  {
    controllerAs: "uiSearchBoxCtrl",
    bindings: {
      type: "=?",
      icon: "=?",
      title: "=?",
      text: "=?",
      range: "=?",
      more: "=?",
      containerForm: "=?",
      originData: "=?",
      destinationData: "=?",
      model: "=?",
      researchOrigin: "=?",
      researchDestination: "=?",
      dateCalendar: "=?",
    },
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-search-box-view.html`;
      },
    ],
  },
  ["CommonsConstants", "$scope", "$timeout"],
  [],
)
class IbUiSearchBoxComponent implements ng.IController {
  private filter_price: any;
  private amountEvent: IbUiSearchBoxComponentModel.amountEvent;
  private PRICE_INTEGER: RegExp;
  private PHONE_CLEANER: string;
  private MAX_LENGTH: number;
  private model: any;
  private isRoundTrip: boolean;
  private selectedDateModel: any;
  private originData: any;
  private price: number;
  private researchOrigin: any;
  private day = 60 * 60 * 24 * 1000;
  private date = new Date(Date.now()).setHours(0, 0, 0, 0);
  private selectedOutbondDate = new Date(this.date);
  private selectedReturnDate = new Date(this.date + this.day);
  private flexDates = true;
  private tripOptionSelected = {
    description: "HEADER_ADVANCED_SEARCH_ROUND_TRIP",
    code: 2,
  };
  private allDates: boolean;
  private dateCalendar: IbUiSearchBoxComponentModel.DateCalendar;
  constructor(
    private CommonsConstants: CommonsConstantsType,
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService,
  ) {
    this.PRICE_INTEGER = this.CommonsConstants.commonsPatterns.PRICE_INTEGER;
    this.PHONE_CLEANER = this.CommonsConstants.commonsPatterns.PHONE_CLEANER;
    this.MAX_LENGTH = 4;
    this.amountEvent = {
      onblur: false,
      dynamicPrice: null,
      keydown: false,
      focused: false,
      customPrice: null,
      dynamicError: false,
      importError: false,
    };
  }
  active = (): any => {
    this.filter_price = {
      minValue: 20,
      maxValue: 250,
      value: 250,
      options: {
        disabled: false,
        hideLimitLabels: false,
        floor: 20,
        ceil: 500,
        step: 1,
        ticksArray: [20, 250, 500],
        showTicksValues: true,
        showSelectionBar: true,
        translate: (value) => {
          return value + " €";
        },
      },
    };
    this.allDates = true;
    this.$timeout(() => {
      this.dateCalendar?.outboundDate
        ? (this.selectedOutbondDate = this.dateCalendar.outboundDate)
        : "";
      this.dateCalendar?.returnDate
        ? (this.selectedReturnDate = this.dateCalendar.returnDate)
        : "";
      this.$scope.$broadcast("updateCalendarInputDates", {
        selectedOutbondDate: this.selectedOutbondDate,
        selectedReturnDate: this.selectedReturnDate,
      });
    });
  };
  selectedOrigin = (origin): void => {};
  submit = (model: IbUiSearchBoxComponentModel.Model): any => {
    this.model.filters.origin = !this.model.origin
      ? "ALL_DESCRIPTION"
      : this.model.origin.description;
    this.model.filters.destination = !this.model.destination
      ? "ALL_DESCRIPTION"
      : this.model.destination.description;
    this.model.filters.price = !this.amountEvent.dynamicPrice
      ? null
      : this.amountEvent.dynamicPrice;
    this.model.filters.dateGoneId = this.selectedOutbondDate;
    this.model.filters.dateReturnid = this.selectedReturnDate;
    this.model.filters.allDates = this.allDates;
  };
  $onInit = this.active();
}
