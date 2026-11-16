import { Inject, Pipe, PipeTransform } from "@angular/core";
import { CommonsConstants } from "ib-web-commons/constants";
import { AJSRootScope, CommonsRootScope } from "ib-web-commons/utils";

/**
 * @description Performs the formatting of the input to obtain a date according to the language and market.
 */
@Pipe({
  name: "intlDate",
})
export class IbIntlDateFormatPipe implements PipeTransform {
  constructor(@Inject(AJSRootScope) private rootScope: CommonsRootScope) {}

  /**
   * @description This is a pipe which fulfills the function of formatting the date depending on the user's language and market.
   * @param {(Date | number | string)} date The date to be transformed.
   * @param {Intl.DateTimeFormatOptions} [format] The date format configuration object.
   * @return An `string` of formated date depends on market and language
   * @author Alvaro Moreiro
   */
  transform(
    date: Date | number | string | undefined | null,
    format?: Intl.DateTimeFormatOptions,
  ) {
    if (date === undefined || date === null) return "";

    let dateToFormat: Date = date as Date;

    if (format === null || format === undefined) {
      format = { day: "2-digit", month: "2-digit", year: "numeric" };
    }

    if (typeof date === "string" || typeof date === "number") {
      dateToFormat = new Date(date);
    }

    return new Intl.DateTimeFormat(
      [
        `${this.rootScope.appLang}-${this.rootScope.appMarket}`,
        `${CommonsConstants.defaultLang}-${CommonsConstants.defaultMarket}`,
      ],
      format,
    ).format(dateToFormat);
  }
}
