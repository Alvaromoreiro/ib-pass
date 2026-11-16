import * as angular from "angular";
import dayjs from "dayjs";
import { CommonsConstantsType } from "../constants/ib-commons-constants";

function CommonsMomentFormatDateByLanguage(
  CommonsConstants: CommonsConstantsType,
) {
  return (momentDate, type: string): string => {
    let dateFormatByLanguage = "DD/MM/YY";
    if (momentDate) {
      momentDate = dayjs(momentDate);
    }
    if (type === CommonsConstants.LARGE) {
      dateFormatByLanguage = "DD/MM/YYYY";
    }
    return angular.isDefined(momentDate) &&
      angular.isFunction(momentDate.format)
      ? momentDate.format(dateFormatByLanguage)
      : "";
  };
}
module CommonsMomentFormatDateByLanguage {
  export const $inject = ["CommonsConstants"];
}
@Filters(
  "ib-commons-filters-module",
  ["CommonsConstants"],
  [],
  CommonsMomentFormatDateByLanguage,
  "CommonsMomentFormatDateByLanguage",
)()
class IbCommonsFormatMomentDateByLanguageFilter {
  constructor() {}
}
