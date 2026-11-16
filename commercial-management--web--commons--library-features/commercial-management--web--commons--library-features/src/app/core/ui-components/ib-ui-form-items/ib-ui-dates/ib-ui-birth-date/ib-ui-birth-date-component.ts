/* eslint-disable no-nested-ternary */
import dayjs from "dayjs";
import { IOnInit } from "angular";
import { CommonsConstantsType } from "../../../../constants/ib-commons-constants";
import { IbUiBirthdateIdentifierGeneratorService } from "./ib-ui-birth-date-identifier-generator-service";

@Component(
  "ib-ui-birth-date-module",
  "ibUiBirthDate",
  {
    bindings: {
      fieldTitle: "=?",
      fieldSubtitle: "=?",
      day: "=?", //two-way binding
      month: "=?",
      year: "=?",
      yearsFrom: "<",
      yearsTo: "<",
      containerForm: "=?", //two-way binding
      index: "=?",
      haveBirthDate: "=?",
      checkUnderAgeError: "=?",
      isDisabled: "=?",
      notRequiredField: "<",
      inputId: "<?",
    },
    controllerAs: "uiBirthDateCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-birth-date-view.html`;
      },
    ],
  },
  ["CommonsConstants", "$scope", "IbUiBirthdateIdentifierGeneratorService"],
  [],
)
class ibUiBirthDateController implements ng.IController, IOnInit {
  public actualDate: Date;
  public actualMonth: number;
  public availableDays: string[];
  public availableMonths: string[];
  public availableYears: number[];
  public yearsFrom: number;
  public yearsTo: number;
  public day;
  public month;
  public year;
  public containerForm;
  public index: string;
  public checkUnderAgeError: boolean;
  public underTwoError: boolean;
  public underEighteenError: boolean;
  private inputId?: string;
  public id?: string;

  constructor(
    private CommonsConstants: CommonsConstantsType,
    private $scope: ng.IScope,
    private IbUiBirthdateIdentifierGeneratorService: IbUiBirthdateIdentifierGeneratorService,
  ) {
    this.underTwoError = false;
    this.underEighteenError = false;
  }

  /**
   * Initialize component availableYears depending on input component binding maximumYears
   * @param {int} maximumYears - the number of years since today's year to start the availableYears array
   * @returns {Array<String>} - the availableYears to select in the view
   */
  initializeYears = (
    numberYearsfrom: number,
    numberYearsTo: number,
  ): number[] => {
    let index: number, currentYear: number;
    const yearsArray: number[] = [];
    numberYearsfrom =
      numberYearsfrom || this.CommonsConstants.DEFAULT_FROM_YEARS;
    numberYearsTo = numberYearsTo || this.CommonsConstants.DEFAULT_TO_YEARS;
    const maxYears: number = numberYearsTo - numberYearsfrom;

    currentYear = new Date().getFullYear() - numberYearsfrom;
    for (index = 0; index <= maxYears; index++) {
      yearsArray.push(currentYear);
      currentYear--;
    }
    return yearsArray;
  };

  /**
   * Throws an event to parent controller. The event will be an object with the day, month and year properties. If under age error is controlled, the object will also contain a boolean checking under age errors and will set input validity.
   */
  throwSelectedDateEvent = () => {
    let passengerAge: number = 0;
    const dateOject = {
      day: this.day,
      month: this.month,
      year: this.year,
      underTwoError: false,
      underEighteenError: false,
    };
    if (this.checkUnderAgeError && this.day && this.month && this.year) {
      passengerAge = dayjs().diff(
        this.year + "-" + this.month + "-" + this.day,
        "year",
      );
      dateOject.underTwoError = passengerAge < 2;
      this.underTwoError = dateOject.underTwoError;
      dateOject.underEighteenError = passengerAge < 18;
      this.underEighteenError = dateOject.underEighteenError;
      if (this.containerForm) {
        this.containerForm["birthDateYear_" + this.index].$setValidity(
          "underAgeError",
          !dateOject.underEighteenError,
        );
      }
    }
    this.$scope.$emit("dateSelected", dateOject);
  };

  /**
   * returns the array of days from input year and input month
   * @param {int} month - the month which we want to get the days
   * @param {int} year - the month which we want to get the days
   * @returns {Array<String>} - returns the array of days from input year and input month
   */
  getDaysOfMonth = (month, year): string[] => {
    const date = new Date();
    date.setFullYear(year, month, 0);
    //Copy array of days and return only the days of month
    return this.CommonsConstants.DAYS_ARRAY.slice().splice(
      0,
      date.getUTCDate(),
    );
  };

  daysSelected = () => {
    this.generateAvailableDate();
    this.throwSelectedDateEvent();
  };

  /**
   * returns the array of months from input year and input month
   * @returns {Array<String>} - returns the array of days from input year and input month
   */
  getMonthsofYear = (): string[] => {
    const date: Date = new Date();
    return this.CommonsConstants.MONTH_ARRAY.slice().splice(
      date.getMonth(),
      this.CommonsConstants.MONTH_ARRAY.length - 1,
    );
  };

  monthsSelected = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate(),
      monthDays = this.month
        ? this.getDaysOfMonth(
            parseInt(this.month),
            parseInt(this.year ? this.year : this.availableYears[0]),
          )
        : this.CommonsConstants.DAYS_ARRAY.slice();
    this.throwSelectedDateEvent();
    this.generateAvailableDate();
    if (
      this.month === this.availableMonths[this.availableMonths.length - 1] &&
      this.year === this.availableYears[0]
    ) {
      this.availableDays = monthDays.splice(0, currentDay);
      if (parseInt(this.day) > currentDay) {
        this.day = this.availableDays[this.availableDays.length - 1];
      }
    } else if (
      this.month === this.availableMonths[0] &&
      this.year === this.availableYears[this.availableYears.length - 1]
    ) {
      this.availableDays = monthDays.splice(currentDay, monthDays.length - 1);
      this.day =
        parseInt(this.day) < currentDay
          ? this.availableDays[0]
          : parseInt(this.day) >
              parseInt(this.availableDays[this.availableDays.length - 1])
            ? this.availableDays[this.availableDays.length - 1]
            : this.day;
    } else {
      this.availableDays = monthDays;
      if (
        parseInt(this.day) >
        parseInt(this.availableDays[this.availableDays.length - 1])
      ) {
        this.day = this.availableDays[this.availableDays.length - 1];
      }
    }
    this.daysSelected();
  };

  yearsSelected = (): void => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1,
      currentDay = currentDate.getDate(),
      currentMonthDays = this.getDaysOfMonth(currentMonth, parseInt(this.year)),
      isLastDay =
        currentMonthDays.splice(currentDay - 1, currentMonthDays.length - 1)
          .length === 0;
    if (this.year === this.availableYears[0]) {
      this.availableMonths = this.CommonsConstants.MONTH_ARRAY.slice().splice(
        0,
        currentMonth,
      );
      if (parseInt(this.month) > currentMonth) {
        this.month = this.availableMonths[this.availableMonths.length - 1];
      }
    } else if (
      this.year === this.availableYears[this.availableYears.length - 1]
    ) {
      this.availableMonths = this.CommonsConstants.MONTH_ARRAY.slice().splice(
        currentMonth - 1,
        this.CommonsConstants.MONTH_ARRAY.length - 1,
      );
      if (parseInt(this.month) < currentMonth) {
        this.month = this.availableMonths[0];
      }
    } else {
      this.availableMonths = this.CommonsConstants.MONTH_ARRAY.slice();
    }
    this.monthsSelected();
  };

  generateAvailableDate = (): any => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1,
      currentDay = currentDate.getDate(),
      monthDays = this.month
        ? this.getDaysOfMonth(
            parseInt(this.month),
            parseInt(this.year ? this.year : this.availableYears[0]),
          )
        : this.CommonsConstants.DAYS_ARRAY.slice();
    if (this.year === this.availableYears[0].toString()) {
      this.availableMonths = this.CommonsConstants.MONTH_ARRAY.slice().splice(
        0,
        currentMonth,
      );
      if (parseInt(this.month) > currentMonth) {
        this.month = this.availableMonths[this.availableMonths.length - 1];
      }
    } else if (
      this.year ===
      this.availableYears[this.availableYears.length - 1].toString()
    ) {
      this.availableMonths = this.CommonsConstants.MONTH_ARRAY.slice().splice(
        currentMonth - 1,
        this.CommonsConstants.MONTH_ARRAY.length - 1,
      );
      if (parseInt(this.month) < currentMonth) {
        this.month = this.availableMonths[0];
      }
    }
    if (
      this.year === this.availableYears[0].toString() &&
      this.month ===
        this.availableMonths[this.availableMonths.length - 1].toString()
    ) {
      this.availableDays = monthDays.splice(0, currentDay - 1);
      if (parseInt(this.day) > currentDay) {
        this.day = this.availableDays[this.availableDays.length - 1];
      }
    }
  };

  $onInit(): void {
    this.id =
      this.inputId ?? this.IbUiBirthdateIdentifierGeneratorService.generateId();
    this.availableYears = this.initializeYears(this.yearsFrom, this.yearsTo);
    this.availableDays = this.CommonsConstants.DAYS_ARRAY.slice();
    this.availableMonths = this.CommonsConstants.MONTH_ARRAY.slice();
    if (
      (this.month || this.year || this.day) &&
      this.containerForm["birthDateYear_" + this.index]
    ) {
      this.yearsSelected();
    }
  }
}
