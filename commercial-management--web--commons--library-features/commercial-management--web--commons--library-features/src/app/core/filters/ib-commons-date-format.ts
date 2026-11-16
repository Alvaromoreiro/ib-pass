function CommonsDateFormat(CommonsUtilService) {
  const months = [
    "MONTH_JANUARY",
    "MONTH_FEBRUARY",
    "MONTH_MARCH",
    "MONTH_APRIL",
    "MONTH_MAY",
    "MONTH_JUNE",
    "MONTH_JULY",
    "MONTH_AUGUST",
    "MONTH_SEPTEMBER",
    "MONTH_OCTOBER",
    "MONTH_NOVEMBER",
    "MONTH_DECEMBER",
  ];
  const weekDays = [
    "WEEKDAY_SUNDAY",
    "WEEKDAY_MONDAY",
    "WEEKDAY_TUESDAY",
    "WEEKDAY_WEDNESDAY",
    "WEEKDAY_THURSDAY",
    "WEEKDAY_FRYDAY",
    "WEEKDAY_SATURDAY",
  ];
  return (inputDate, format) => {
    let utilsDate = null;
    if (inputDate) {
      const auxInputDate =
        inputDate.indexOf(" ") === -1
          ? inputDate
          : inputDate.slice(0, inputDate.indexOf(" "));
      const dateTime =
        inputDate.indexOf(" ") === -1 ? "" : inputDate.split(" ")[1];
      const date = new Date(auxInputDate);
      const numWeekDay = date.getUTCDay();
      const month = date.getUTCMonth();
      utilsDate = {
        dateTime: dateTime,
        weekDay: weekDays[numWeekDay],
        hour: date.getHours(),
        minutes: date.getMinutes(),
        day: date.getUTCDate(),
        monthNumber: month + 1,
        month: months[month],
        year: date.getUTCFullYear(),
        formatedDate: null,
      };
      utilsDate.formatedDate = CommonsUtilService.getFormatedDate(
        inputDate,
        format,
      )
        ? CommonsUtilService.getFormatedDate(inputDate, format).formatedDate
        : null;
    }
    return utilsDate;
  };
}
module CommonsDateFormat {
  export const $inject = ["CommonsUtilService"];
}
@Filters(
  "ib-commons-filters-module",
  ["CommonsUtilService"],
  [],
  CommonsDateFormat,
  "CommonsDateFormat",
)()
class IbCommonsDateFormat {
  constructor() {}
}
