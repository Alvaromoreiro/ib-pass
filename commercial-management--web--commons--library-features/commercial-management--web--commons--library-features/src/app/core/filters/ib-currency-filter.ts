import * as angular from "angular";
import { CommonsConstantsType } from "../constants/ib-commons-constants";

function currency(
  $filter: ng.IFilterFunction,
  $locale: CommonsCurrencyModel.CommonsCurrencyLocation,
  CommonsConstants: CommonsConstantsType,
) {
  return (
    amount: number,
    currencySymbol: string,
    fractionSize: number,
    suffixSymbol: string,
    customFormat: CommonsCurrencyModel.CurrencyCustomFormat,
  ): string => {
    const numberFilter = $filter("number");
    const formats = $locale.NUMBER_FORMATS;
    const pattern = formats.PATTERNS[1];
    formats.DEFAULT_PRECISION = angular.isUndefined(formats.DEFAULT_PRECISION)
      ? 2
      : formats.DEFAULT_PRECISION;

    const isBoolean = (obj: boolean | string): boolean => {
      return (
        obj === true ||
        obj === false ||
        Object.prototype.toString.call(obj) === "[object Boolean]"
      );
    };

    const getNewCurrency = (
      amount: number,
      currencySymbol: string,
      fractionSize: number,
      suffixSymbol: boolean | string,
      customFormat: CommonsCurrencyModel.CurrencyCustomFormat,
    ) => {
      const isNegative: boolean = amount < 0,
        parts = [];
      let groupSep = null,
        decimalSep = null,
        number = null,
        formattedNumber = null;
      if (!angular.isNumber(amount)) {
        amount = 0;
      }

      if (
        angular.isUndefined(currencySymbol) ||
        angular.isObject(currencySymbol)
      ) {
        currencySymbol = formats.CURRENCY_SYM;
      }

      fractionSize = angular.isUndefined(fractionSize)
        ? formats.DEFAULT_PRECISION
        : fractionSize;
      amount = Math.abs(amount);
      groupSep =
        customFormat && angular.isString(customFormat.GROUP_SEP)
          ? customFormat.GROUP_SEP
          : formats.GROUP_SEP;

      decimalSep =
        customFormat && angular.isString(customFormat.DECIMAL_SEP)
          ? customFormat.DECIMAL_SEP
          : formats.DECIMAL_SEP;

      number = numberFilter(amount, fractionSize);
      formattedNumber = [];

      for (let i = 0; i < number.length; i++) {
        if (number[i] === formats.GROUP_SEP) {
          formattedNumber.push(groupSep);
        } else {
          if (number[i] === formats.DECIMAL_SEP) {
            formattedNumber.push(decimalSep);
          } else {
            formattedNumber.push(number[i]);
          }
        }
      }

      formattedNumber = formattedNumber.join("");
      parts.push(isNegative ? pattern.negPre : pattern.posPre);

      if (angular.isString(suffixSymbol)) {
        parts.push(currencySymbol);
        parts.push(formattedNumber);
        parts.push(suffixSymbol);
      } else {
        parts.push(!suffixSymbol ? currencySymbol : formattedNumber);
        parts.push(suffixSymbol ? currencySymbol : formattedNumber);
      }

      parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
      return parts
        .join("")
        .replace(
          CommonsConstants.commonsPatterns.CURRENCY_GET_NEW_CURRENCY,
          "",
        );
    };

    return getNewCurrency(
      amount,
      currencySymbol,
      fractionSize,
      suffixSymbol,
      customFormat,
    );
  };
}
module currency {
  export const $inject = ["$filter", "$locale", "CommonsConstants"];
}
@Filters(
  "ib-commons-filters-module",
  ["$filter", "$locale", "CommonsConstants"],
  [],
  currency,
  "currency",
)()
class currencyClass {
  constructor() {}
}
