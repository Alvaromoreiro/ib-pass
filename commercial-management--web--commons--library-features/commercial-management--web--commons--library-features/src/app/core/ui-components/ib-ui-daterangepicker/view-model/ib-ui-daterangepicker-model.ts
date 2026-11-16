import dayjs from "dayjs";
import { CommonsConstantsType } from "../../../constants/ib-commons-constants";

@Service("ib-ui-daterangepicker-module", [
  "$filter",
  "$rootScope",
  "CommonsConstants",
])
export class ibUiDaterangepickerModel {
  constructor(
    private $filter: ng.FilterFactory,
    private $rootScope: CommonsRootScope,
    private CommonsConstants: CommonsConstantsType,
  ) {}

  initializeModel = (
    dateCalendar?: UiComponentsModel.DataRangePickerDateCalendar,
  ): UiComponentsModel.DataRangePickerModel => {
    const language: string = this.$rootScope.appLang
      ? this.$rootScope.appLang
      : "es";
    const textFormat: string = language === "en" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    const newDate = {
      date: new Date(),
      day: (dayjs().date() < 10 ? "0" : "") + dayjs().date(),
      month: (dayjs().month() + 1 < 10 ? "0" : "") + (dayjs().month() + 1),
      year: dayjs().year() as unknown as string,
    };
    const patter =
      language === "en"
        ? this.CommonsConstants.commonsPatterns.DATE_PATTERN_EN
        : this.CommonsConstants.commonsPatterns.DATE_PATTERN_ES;
    let todayDate = "";
    if (textFormat === "MM/DD/YYYY") {
      todayDate = `${newDate.month}/${newDate.day}/${newDate.year}`;
    } else {
      todayDate = `${newDate.day}/${newDate.month}/${newDate.year}`;
    }

    return {
      newDate: newDate,
      iStart: 0,
      iEnd: 0,
      isopenDateGone: false,
      isopenDateReturn: false,
      inputDateGone: "",
      inputDateReturn: "",
      lang: language,
      textFormat: textFormat,
      afterUpdate: false,
      whatTime: false,
      focusedStart: false,
      focusedReturn: false,
      todayDate: todayDate,
      dataHourRestriction: 0,
      dateRestriction: new Date(),
      datePattern: patter,
      keypressClose: false,
      clickInput: false,
      dateOptions: {
        changeYear: false,
        changeMonth: false,
        minDate: dateCalendar ? dateCalendar.minDateRange : 0, // Today
        maxDate: dateCalendar ? dateCalendar.maxDateRange : 360, // Today + x
        numberOfMonths: 2,
        dateFormat: language === "en" ? "mm/dd/yy" : "dd/mm/yy",
        firstDay: 1, // L M X J V S D
        hideIfNoPrevNext: false,
        stepMonths: 1, //Set how many months to move when clicking the previous/next links.
      },
      validation: {
        required: "HEADER_ADVANCED_SEARCH_DATEPICKER_ROUND_TRIP_ERROR",
        pattern: "HEADER_ADVANCED_SEARCH_DATEPICKER_FORMAT_ERROR",
        minValid: "HEADER_ADVANCED_SEARCH_DATEPICKER_MIN_ERROR",
        maxValid: "HEADER_ADVANCED_SEARCH_DATEPICKER_MAX_ERROR",
        restrictionValid: "HEADER_ADVANCED_SEARCH_DATEPICKER_RESTRICTION_ERROR",
      },
    };
  };
}
