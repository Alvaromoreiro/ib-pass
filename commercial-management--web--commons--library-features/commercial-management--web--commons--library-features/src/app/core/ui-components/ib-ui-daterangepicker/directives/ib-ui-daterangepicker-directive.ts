import * as angular from "angular";
import { CommonsConstantsType } from "../../../constants/ib-commons-constants";

@Directives(
  "ib-ui-daterangepicker-module",
  [
    "$document",
    "$window",
    "$timeout",
    "CommonsComponentUtils",
    "CommonsConstants",
  ],
  [],
)
class uidaterangepicker {
  constructor(
    private $document: ng.IDocumentService,
    private $window: ng.IWindowService,
    private $timeout: ng.ITimeoutService,
    private CommonsComponentUtils: any,
    private CommonsConstants: CommonsConstantsType,
  ) {}
  restrict = "AE";
  compile = (element, attributes) => {
    const ibUiDateParser = (date: string, format: string) => {
      const dateParts = date.split("/");
      if (format === "MM/DD/YYYY") {
        return new Date(
          Number(dateParts[2]),
          Number(dateParts[0]) - 1,
          Number(dateParts[1]),
        );
      }
      return new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0]),
      );
    };
    const insertDate = (
      e: any,
      key: any,
      _this: any,
      scope: UiComponentsModel.DateRangePickerScope,
    ) => {
      const newDate = _this.val();

      let iDate = checkPartialDate(
        newDate,
        scope.ibUiDaterangepickerCtrl.model.textFormat,
      );

      switch (iDate) {
        case true:
          _this.val(newDate);
          break;
        case false:
          if (e.target.selectionStart < _this.val().length) {
            iDate = checkPartialDate(
              _this.val().substr(0, e.target.selectionStart) + key,
              scope.ibUiDaterangepickerCtrl.model.textFormat,
            );
            switch (iDate) {
              case true:
                _this.val(_this.val().substr(0, e.target.selectionStart) + key);
                break;
              case false:
                break;
              default:
                _this.val(iDate);
            }
          }
          break;
        default:
          _this.val(iDate);
      }
    };
    const postCompile = (scope: any, elem: any) => {
      const $input = angular
        .element(elem)
        .parents("[uib-dropdown]")
        .find(".ib-input-range-date__input");
      /**
       *uidaterangepicker keypress event function
       * @param {Event} e
       */
      const keypress = (e) => {
        if (
          !(
            (
              navigator.userAgent.match(
                this.CommonsConstants.commonsPatterns.MAC_DEVICE,
              ) /* No es Ipad */ ||
              this.CommonsConstants.commonsPatterns.INTEGER.test(
                e.key,
              ) /* Allow Number */ ||
              this.CommonsConstants.commonsPatterns.BAR.test(
                e.key,
              ) /* Allow caracter '/' */ ||
              this.CommonsConstants.commonsPatterns.BLANKSPACE.test(
                e.key,
              ) /* Allow Delete */ ||
              this.CommonsConstants.commonsPatterns.DELETE.test(
                e.key,
              ) /* Allow Sup */ ||
              this.CommonsConstants.commonsPatterns.ARROW_LEFT.test(
                e.key,
              ) /* Allow Cursor left */ ||
              this.CommonsConstants.commonsPatterns.ARROW_RIGHT.test(e.key)
            ) /* Allow Cursor right */
          )
        ) {
          scope.ibUiDaterangepickerCtrl.model.keypressClose = false;
          e.preventDefault();
        } else {
          scope.ibUiDaterangepickerCtrl.model.keypressClose = true;
        }
      };
      /**
       *uidaterangepicker keyup event function
       * @param {Event} e
       * @param {Event} scope
       */
      const keyup = (e) => {
        let key = e.key;
        const inputDate = angular.element(e.currentTarget);
        const inputValue: string | string[] = <string | string[]>(
          inputDate.val()
        );
        const datepicker: any = inputDate.parent().find(".hasDatepicker");
        const parent = inputDate.parents(".ib-input-range-date");
        if (key === undefined || key === "Unidentified") {
          key = String.fromCharCode(e.keyCode);
        }

        if (
          key === "Backspace" ||
          key === "Delete" ||
          key === "ArrowLeft" ||
          key === "ArrowRight" ||
          key === "ArrowUp" ||
          key === "ArrowDown"
        ) {
          scope.ibUiDaterangepickerCtrl.model.keypressClose = true;
          scope.ibUiDaterangepickerCtrl.model.isopenDateGone = false;
          scope.ibUiDaterangepickerCtrl.model.isopenDateReturn = false;
        }
        if (!isNaN(key) || key === "/") {
          insertDate(e, key, inputDate, scope);
        }

        if (inputValue.length === 10) {
          if (e.currentTarget.id === "dateGoneid") {
            if (
              angular.isDefined(
                scope.ibUiDaterangepickerCtrl.model.inputDateGone,
              )
            ) {
              scope.ibUiDaterangepickerCtrl.dateGone = ibUiDateParser(
                scope.ibUiDaterangepickerCtrl.model.inputDateGone,
                scope.ibUiDaterangepickerCtrl.model.textFormat,
              );
            }
            if (scope.ibUiDaterangepickerCtrl.validationDates(inputDate)) {
              //RESET DATE WHEN RETURN IS > GONE
              if (
                (scope.ibUiDaterangepickerCtrl.dateReturn &&
                  scope.ibUiDaterangepickerCtrl.dateGone.getTime() >
                    scope.ibUiDaterangepickerCtrl.dateReturn.getTime()) ||
                (scope.ibUiDaterangepickerCtrl.roundtrip === 1 &&
                  scope.ibUiDaterangepickerCtrl.dateReturn !== null)
              ) {
                scope.ibUiDaterangepickerCtrl.dateReturn = null;
                scope.ibUiDaterangepickerCtrl.model.inputDateReturn = "";

                //SELECT MONTH TO DATEGONE SELECTED IN OTHER CALENDAR
                this.$timeout(() => {
                  const element: UiComponentsModel.DatePickerFunction =
                    parent.find(".ib-input-range-date__end .hasDatepicker");
                  element.datepicker(
                    "setDate",
                    datepicker.datepicker("getDate"),
                  );
                });
              }
              //open close dropdown
              scope.ibUiDaterangepickerCtrl.model.isopenDateGone = false;
              if (!scope.ibUiDaterangepickerCtrl.dateReturn) {
                scope.ibUiDaterangepickerCtrl.model.isopenDateReturn =
                  !scope.ibUiDaterangepickerCtrl.model.isopenDateReturn;
                //SELECT MONTH TO DATERETURN SELECTED IN OTHER CALENDAR
                this.$timeout(() => {
                  const element: UiComponentsModel.DatePickerFunction =
                    parent.find(".ib-input-range-date__end .hasDatepicker");
                  element.datepicker(
                    "setDate",
                    datepicker.datepicker("getDate"),
                  );
                });
              }
            }
          } else if (e.currentTarget.id === "dateReturnid") {
            if (
              angular.isDefined(
                scope.ibUiDaterangepickerCtrl.model.inputDateReturn,
              )
            ) {
              scope.ibUiDaterangepickerCtrl.dateReturn = ibUiDateParser(
                scope.ibUiDaterangepickerCtrl.model.inputDateReturn,
                scope.ibUiDaterangepickerCtrl.model.textFormat,
              );
            }

            if (scope.ibUiDaterangepickerCtrl.validationDates(inputDate)) {
              //RESET DATE WHEN RETURN IS > GONE
              if (
                scope.ibUiDaterangepickerCtrl.dateGone &&
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime() <
                  scope.ibUiDaterangepickerCtrl.dateGone.getTime()
              ) {
                scope.ibUiDaterangepickerCtrl.dateGone = null;
                scope.ibUiDaterangepickerCtrl.model.inputDateGone = "";
                this.$timeout(() => {
                  const element: UiComponentsModel.DatePickerFunction =
                    parent.find(".ib-input-range-date__start .hasDatepicker");
                  element.datepicker(
                    "setDate",
                    datepicker.datepicker("getDate"),
                  );
                });
              }

              //open close dropdown
              scope.ibUiDaterangepickerCtrl.model.isopenDateReturn = false;
              if (!scope.ibUiDaterangepickerCtrl.dateGone) {
                scope.ibUiDaterangepickerCtrl.model.isopenDateGone =
                  !scope.ibUiDaterangepickerCtrl.model.isopenDateGone;
                this.$timeout(() => {
                  const element: UiComponentsModel.DatePickerFunction =
                    parent.find(".ib-input-range-date__start .hasDatepicker");
                  element.datepicker(
                    "setDate",
                    datepicker.datepicker("getDate"),
                  );
                });
              }
            }
          }
        }

        if (
          scope.ibUiDaterangepickerCtrl.model.inputDateGone === undefined ||
          scope.ibUiDaterangepickerCtrl.model.inputDateGone === null ||
          scope.ibUiDaterangepickerCtrl.model.inputDateGone === ""
        ) {
          scope.ibUiDaterangepickerCtrl.dateGone = null;
        }
        if (
          scope.ibUiDaterangepickerCtrl.model.inputDateReturn === undefined ||
          scope.ibUiDaterangepickerCtrl.model.inputDateReturn === null ||
          scope.ibUiDaterangepickerCtrl.model.inputDateReturn === ""
        ) {
          scope.ibUiDaterangepickerCtrl.dateReturn = null;
        }
      };
      //ADD EVENT ONE TIME on OPEN
      if (
        angular.element(elem).hasClass("ib-rangepicker--start") &&
        scope.ibUiDaterangepickerCtrl.model.iStart === 0
      ) {
        $input.on("keyup", keyup);
        $input.on("keypress", keypress);
        scope.ibUiDaterangepickerCtrl.model.iStart++;
      }
      if (
        angular.element(elem).hasClass("ib-rangepicker--end") &&
        scope.ibUiDaterangepickerCtrl.model.iEnd === 0
      ) {
        $input.on("keyup", keyup);
        $input.on("keypress", keypress);
        scope.ibUiDaterangepickerCtrl.model.iEnd++;
      }
    };
    const checkPartialDate = (date: string, format: string) => {
      if (
        this.CommonsConstants.commonsPatterns.LETTERS.test(
          date.replace("/", "").toLowerCase(),
        )
      ) {
        return false;
      }

      switch (date.length) {
        case 1:
          if (format === "DD/MM/YYYY") {
            if (parseInt(date) > 3) {
              return "0" + date + "/";
            }

            return date;
          }

          if (parseInt(date.substr(0, 1)) >= 2) {
            return "0" + date.substr(0, 1) + "/";
          }

          return date;
          break;
        case 2:
          if (format === "DD/MM/YYYY") {
            if (/^(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
              return date + "/";
            }

            return false;
          }

          if (/^(0[1-9]|1[0-2])$/.test(date)) {
            return date + "/";
          }

          return false;
          break;
        case 3:
          if (format === "DD/MM/YYYY") {
            if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
              return date;
            }

            return false;
          }

          if (/^(0[1-9]|1[0-2])\/$/.test(date)) {
            return date;
          }

          return false;
          break;
        case 4:
          if (format === "DD/MM/YYYY") {
            if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date.substr(0, 3))) {
              if (parseInt(date.substr(3, 4)) >= 2) {
                return date.substr(0, 3) + "0" + date.substr(3, 4) + "/";
              }

              return date;
            }

            return false;
          }

          if (/^(0[1-9]|1[0-2])\/$/.test(date.substr(0, 3))) {
            if (parseInt(date.substr(3, 4)) > 3) {
              return date.substr(0, 3) + "0" + date.substr(3, 4) + "/";
            }

            return date;
          }

          return false;
          break;
        case 5:
          if (format === "DD/MM/YYYY") {
            if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])$/.test(date)) {
              return date + "/";
            }

            return false;
          }

          if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
            return date + "/";
          }

          return false;
          break;
        case 6:
          if (format === "DD/MM/YYYY") {
            if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/$/.test(date)) {
              return date;
            }

            return false;
          }

          if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
            return date;
          }

          return false;
          break;
        case 7:
          if (format === "DD/MM/YYYY") {
            return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(1|2)$/.test(
              date,
            );
          }

          return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(1|2)$/.test(date);
          break;
        case 8:
          if (format === "DD/MM/YYYY") {
            return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)$/.test(
              date,
            );
          }

          return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)$/.test(
            date,
          );
          break;
        case 9:
          if (format === "DD/MM/YYYY") {
            return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{1}$/.test(
              date,
            );
          }

          return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{1}$/.test(
            date,
          );
          break;
        case 10:
          if (format === "DD/MM/YYYY") {
            return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(
              date,
            );
          }

          return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(
            date,
          );
          break;
        case null:
          return false;
      }
    };
    const printCalendar = (scope: any, elem: any) => {
      const $elem = angular.element(elem);
      const $td = $elem.find("tbody td:not(.ui-datepicker-unselectable)");
      const inputStart = scope.ibUiDaterangepickerCtrl.model.inputDateGone;
      const inputEnd = scope.ibUiDaterangepickerCtrl.model.inputDateReturn;
      const $nextMonthLink = angular
        .element(elem)
        .find(".ui-datepicker-next:not(.ui-state-disabled)");
      const $prevMonthLink = angular
        .element(elem)
        .find(".ui-datepicker-prev:not(.ui-state-disabled)");
      let group = ".ui-datepicker-group";
      if ($elem.find(group).length === 0) {
        group = ".ui-datepicker";
      }
      /**
       *uidaterangepicker clickOtherMonth click event function
       * @param {Event} e
       * @param {Object} scope return this scope
       * @param {Object} elem return calendar opened
       */
      const clickOtherMonth = (e) => {
        e.preventDefault();
        e.stopPropagation();
        printCalendar(scope, elem);
      };
      const preventActions = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      $nextMonthLink.on("click", preventActions).addClass("ui-state-disabled");
      $prevMonthLink.on("click", preventActions).addClass("ui-state-disabled");

      if ($elem.hasClass("ib-rangepicker--start")) {
        angular.forEach(
          angular.element(
            group + " tbody td:not(.ui-datepicker-unselectable)",
            $elem,
          ),
          (e: JQuery<HTMLElement>) => {
            const $thisTD = angular.element(e);
            const dayTD = $thisTD.eq(0).find(".ui-state-default").text();
            const monthTD = $thisTD.eq(0).data("month") + 1;
            const yearTD = $thisTD.eq(0).data("year");
            const simDate = new Date(monthTD + "/" + dayTD + "/" + yearTD);

            if (
              scope.ibUiDaterangepickerCtrl.dateGone &&
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              angular.isDefined(inputStart) &&
              inputStart.length > 0 &&
              angular.isDefined(inputEnd) &&
              inputEnd.length > 0
            ) {
              //ADD class "hightlight" if
              if (
                simDate.getTime() >
                  scope.ibUiDaterangepickerCtrl.dateGone.getTime() &&
                simDate.getTime() <
                  scope.ibUiDaterangepickerCtrl.dateReturn.getTime()
              ) {
                $thisTD.addClass("highlight");
              }
            }

            if (
              !$thisTD.hasClass("ui-datepicker-current-day--start") &&
              $thisTD.hasClass("ui-datepicker-today") &&
              $thisTD.find(".ui-state-default").hasClass("ui-state-active")
            ) {
              // $thisTD.removeClass('ui-datepicker-current-day');
              $thisTD.find(".ui-state-default").removeClass("ui-state-active");
              $thisTD.find(".ui-state-default").removeClass("ui-state-hover");
            }

            if (
              scope.ibUiDaterangepickerCtrl.dateGone &&
              simDate.getTime() ===
                scope.ibUiDaterangepickerCtrl.dateGone.getTime()
            ) {
              $thisTD.addClass("ui-datepicker-current-day--start");
            }

            // ADD CLASS day--end and remove class "hightlight" in inputEnd
            if (
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              simDate.getTime() ===
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime()
            ) {
              $thisTD.removeClass("highlight");
              $thisTD.addClass("ui-datepicker-current-day--end");
            }

            // remove class old "day--end" in inputEnd
            if (
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              simDate.getTime() !==
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime() &&
              $thisTD.hasClass("ui-datepicker-current-day--end")
            ) {
              $thisTD.removeClass("ui-datepicker-current-day--end");
            }
            if (
              scope.ibUiDaterangepickerCtrl.dateGone &&
              simDate.getTime() <
                scope.ibUiDaterangepickerCtrl.dateGone.getTime() &&
              $thisTD.hasClass("highlight")
            ) {
              $thisTD.removeClass("highlight");
            }
            if (
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              simDate.getTime() >
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime() &&
              $thisTD.hasClass("highlight")
            ) {
              $thisTD.removeClass("highlight");
            }
            if (
              scope.ibUiDaterangepickerCtrl.roundtrip === 1 &&
              ($thisTD.hasClass("highlight") ||
                $thisTD.hasClass("ui-datepicker-current-day--end"))
            ) {
              $thisTD.removeClass("highlight");
              $thisTD.removeClass("ui-datepicker-current-day--end");
            }
          },
        );
      } else if ($elem.hasClass("ib-rangepicker--end")) {
        angular.forEach(
          angular.element(
            group + " tbody td:not(.ui-datepicker-unselectable)",
            $elem,
          ),
          (e: JQuery<HTMLElement>) => {
            const $thisTD = angular.element(e);
            const dayTD = $thisTD.eq(0).find(".ui-state-default").text();
            const monthTD = $thisTD.eq(0).data("month") + 1;
            const yearTD = $thisTD.eq(0).data("year");
            const simDate = new Date(monthTD + "/" + dayTD + "/" + yearTD);
            const firstPaint = 0;

            if (
              angular.isDefined(inputEnd) &&
              inputEnd.length > 0 &&
              angular.isDefined(inputStart) &&
              inputStart.length > 0
            ) {
              //ADD class "hightlight" if
              if (
                simDate.getTime() >
                  scope.ibUiDaterangepickerCtrl.dateGone.getTime() &&
                simDate.getTime() <
                  scope.ibUiDaterangepickerCtrl.dateReturn.getTime()
              ) {
                $thisTD.addClass("highlight");
              }
            }

            if (
              !$thisTD.hasClass("ui-datepicker-current-day--end") &&
              $thisTD.hasClass("ui-datepicker-today") &&
              $thisTD.find(".ui-state-default").hasClass("ui-state-active")
            ) {
              // $thisTD.removeClass('ui-datepicker-current-day');
              $thisTD.find(".ui-state-default").removeClass("ui-state-active");
              $thisTD.find(".ui-state-default").removeClass("ui-state-hover");
            }

            // ADD CLASS day--start and remove class "hightlight" in inputStart
            if (
              scope.ibUiDaterangepickerCtrl.dateGone &&
              simDate.getTime() ===
                scope.ibUiDaterangepickerCtrl.dateGone.getTime()
            ) {
              $thisTD.removeClass("highlight");
              $thisTD.addClass("ui-datepicker-current-day--start");
            }
            if (
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              simDate.getTime() ===
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime()
            ) {
              $thisTD.removeClass("highlight");
              $thisTD.addClass("ui-datepicker-current-day--end");
            }
            // remove class old "day--end" in inputEnd
            if (
              scope.ibUiDaterangepickerCtrl.dateGone &&
              simDate.getTime() !==
                scope.ibUiDaterangepickerCtrl.dateGone.getTime() &&
              $thisTD.hasClass("ui-datepicker-current-day--start")
            ) {
              $thisTD.removeClass("ui-datepicker-current-day--start");
            }
            // remove class old "day--end" in inputEnd
            if (
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              simDate.getTime() !==
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime() &&
              $thisTD.hasClass("ui-datepicker-current-day--end")
            ) {
              $thisTD.removeClass("ui-datepicker-current-day--end");
            }
            if (
              scope.ibUiDaterangepickerCtrl.dateGone &&
              simDate.getTime() <
                scope.ibUiDaterangepickerCtrl.dateGone.getTime() &&
              $thisTD.hasClass("highlight")
            ) {
              $thisTD.removeClass("highlight");
            }
            if (
              scope.ibUiDaterangepickerCtrl.dateReturn &&
              simDate.getTime() >
                scope.ibUiDaterangepickerCtrl.dateReturn.getTime() &&
              $thisTD.hasClass("highlight")
            ) {
              $thisTD.removeClass("highlight");
            }
          },
        );
      }

      $nextMonthLink
        .on("click", clickOtherMonth)
        .removeClass("ui-state-disabled");
      $prevMonthLink
        .on("click", clickOtherMonth)
        .removeClass("ui-state-disabled");
    };

    const changeMonthsResponsive = (
      scope: UiComponentsModel.DateRangePickerScope,
    ) => {
      if (
        this.$window.innerWidth < 768 &&
        scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths !== 1
      ) {
        scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths = 1;
        scope.ibUiDaterangepickerCtrl.model.dateOptionsStart.numberOfMonths =
          scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths;
        scope.ibUiDaterangepickerCtrl.model.dateOptionsEnd.numberOfMonths =
          scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths;
      } else if (
        this.$window.innerWidth >= 768 &&
        scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths !== 2
      ) {
        scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths = 2;
        scope.ibUiDaterangepickerCtrl.model.dateOptionsStart.numberOfMonths =
          scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths;
        scope.ibUiDaterangepickerCtrl.model.dateOptionsEnd.numberOfMonths =
          scope.ibUiDaterangepickerCtrl.model.dateOptions.numberOfMonths;
      }
    };

    if (angular.element(element).hasClass("ib-rangepicker--start")) {
      return {
        post: (
          scope: UiComponentsModel.DateRangePickerScope,
          element,
          attributes,
          controller,
          transcludeFn,
        ) => {
          const input = angular
            .element(element)
            .parents("[uib-dropdown]")
            .find(".ib-input-range-date__input");
          let indexStart: number = 0;
          scope.$watch(
            "ibUiDaterangepickerCtrl.model.isopenDateGone",
            (newValues, oldValues, scopeWatch) => {
              //ADD EVENT ONE TIME on CLICK INPUT
              if (indexStart === 0) {
                input.on("click", () => {
                  if (!scope.ibUiDaterangepickerCtrl.model.isopenDateGone) {
                    scope.ibUiDaterangepickerCtrl.model.clickInput = true;
                  }
                  input.on("blur", () => {
                    scope.ibUiDaterangepickerCtrl.model.clickInput = false;
                  });
                });
                indexStart++;
              }
              if (newValues) {
                postCompile(scope, element);
                changeMonthsResponsive(scope);
                this.$timeout(() => {
                  printCalendar(scope, element);
                });
              }

              if (
                !newValues &&
                oldValues &&
                !scope.ibUiDaterangepickerCtrl.model.keypressClose &&
                !scope.ibUiDaterangepickerCtrl.model.clickInput
              ) {
                input[0].blur();
              }
              this.$timeout(() => {
                if (
                  !newValues &&
                  oldValues &&
                  scope.ibUiDaterangepickerCtrl.model.clickInput
                ) {
                  input[0].focus();
                }
              });
              scope.ibUiDaterangepickerCtrl.model.keypressClose = false;
            },
          );
        },
      };
    } else if (angular.element(element).hasClass("ib-rangepicker--end")) {
      return {
        post: (
          scope: UiComponentsModel.DateRangePickerScope,
          element,
          attributes,
          controller,
          transcludeFn,
        ) => {
          scope.$watch(
            "ibUiDaterangepickerCtrl.isopenDateReturn",
            (newValues) => {
              const input = angular
                .element(element)
                .parents("[uib-dropdown]")
                .find(".ib-input-range-date__input");
              let indexEnd = 0;
              scope.$watch(
                "ibUiDaterangepickerCtrl.model.isopenDateReturn",
                (newValues, oldValues, scopeWatch) => {
                  //ADD EVENT ONE TIME on CLICK INPUT
                  if (indexEnd === 0) {
                    input.on("click", () => {
                      if (
                        !scope.ibUiDaterangepickerCtrl.model.isopenDateReturn
                      ) {
                        scope.ibUiDaterangepickerCtrl.model.clickInput = true;
                      }
                      input.on("blur", () => {
                        scope.ibUiDaterangepickerCtrl.model.clickInput = false;
                      });
                    });
                    indexEnd++;
                  }
                  if (newValues) {
                    postCompile(scope, element);
                    changeMonthsResponsive(scope);
                    this.$timeout(() => {
                      printCalendar(scope, element);
                    });
                  }
                  if (
                    !newValues &&
                    oldValues &&
                    !scope.ibUiDaterangepickerCtrl.model.keypressClose &&
                    !scope.ibUiDaterangepickerCtrl.model.clickInput
                  ) {
                    input[0].blur();
                  }
                  this.$timeout(() => {
                    if (
                      !newValues &&
                      oldValues &&
                      scope.ibUiDaterangepickerCtrl.model.clickInput
                    ) {
                      input[0].focus();
                    }
                  });
                  scope.ibUiDaterangepickerCtrl.model.keypressClose = false;
                },
              );
            },
          );
        },
      };
    }
  };
}
