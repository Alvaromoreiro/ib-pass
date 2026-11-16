import { CommonsConstants } from "ib-web-commons/constants";
import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";
import {
  CookiesConfig,
  IbStorageUtility,
  RemoveCookiesConfig,
  SetCookiesConfig,
} from "./ib-storage-utils.model";
import { BookingFlightSearchInformation } from "ib-web-commons/models";
import { downgradeToAJSService } from "../ib-commons-angularjs-utils";

@Injectable({
  providedIn: "root",
})
export class CommonsCookiesService implements IbStorageUtility {
  private readonly DEFAULT_EXPIRY_TIME =
    CommonsConstants.COOKIES.DEFAULT_EXPIRY_TIME;
  private readonly DEFAULT_PATH = CommonsConstants.COOKIES.DEFAULT_PATH;
  private readonly DEFAULT_DOMAIN = CommonsConstants.COOKIES.DEFAULT_DOMAIN;

  constructor(protected cookieService: CookieService) {}

  /**
   * @description Iberia utility to get an object from cookies.
   * @param {string} key The key to get the value from.
   * @returns The value found or null if not found.
   * @example
   * storageService.get<number>('key'); // returns the vale found as number or null if not found.
   * @author Iván Peña Huguet
   */
  get<T = unknown>(key: string): T | null {
    const value = this.cookieService.get(key);
    try {
      return JSON.parse(value) as T;
    } catch (err) {
      return value === "" ? null : (value as unknown as T);
    }
  }

  /**
   * @description Iberia utility to set an object to cookies.
   * Cookie's parameters configuration:
   * <pre>
   * expires  Number of miliseconds until the cookies expires or a Date
   * path     Cookie path (default to '/')
   * domain   Cookie domain
   * secure   Secure flag
   * sameSite OWASP samesite token `Lax`, `None`, or `Strict`. Defaults to `Lax`
   * </pre>
   * @param key {string} The key to set the value
   * @param value {unknown} Cookie value to save
   * @param config {SetCookiesConfig} Configuration to set the cookie, expires number in days gets added to actual date
   * @example
   * storageService.set('key', 'value'); // sets the value to key
   * storageService.set('key', 'value', { path: '/asd' }); // sets the value to key
   * @author Iván Peña Huguet
   */
  set(
    key: string,
    value: any, // TODO fix from ts upgrade
    config?: SetCookiesConfig,
  ): void {
    const valueToStore =
      typeof value === "string"
        ? value
        : JSON.stringify(typeof value === "undefined" ? null : value);
    let expiration: Date | undefined;
    if (typeof config?.expires === "number") {
      expiration = new Date(new Date().getTime() + config.expires);
    } else {
      expiration = config?.expires;
    }
    this.cookieService.set(key, valueToStore, {
      ...config,
      path: config?.path ?? this.DEFAULT_PATH,
      expires:
        expiration ?? new Date(new Date().getTime() + this.DEFAULT_EXPIRY_TIME),
    });
  }

  /**
   * @description Iberia utility to remove an object from cookies
   * Cookie's parameters configuration:
   * <pre>
   * path     Cookie path (default to '/')
   * domain   Cookie domain
   * secure   Secure flag
   * sameSite OWASP samesite token `Lax`, `None`, or `Strict`. Defaults to `Lax`
   * </pre>
   * @param {string} key The key to remove the cookie.
   * @param config {RemoveCookiesConfig} Configuration to set the cookie.
   * @example
   * storageService.remove('key');
   * @author Iván Peña Huguet
   */
  remove(key: string, config?: RemoveCookiesConfig): void {
    this.cookieService.delete(
      key,
      config?.path ?? this.DEFAULT_PATH,
      config?.domain,
      config?.secure,
      config?.sameSite,
    );
  }

  /**
   * @description Iberia utility to check if a cookie exists from a determined key
   * @param {string} key The key to check if exists
   * @returns {boolean} True if exists the cookie, false if not
   * @author Iván Peña Huguet
   */
  check(key: string): boolean {
    return this.cookieService.check(key);
  }

  removeAll(config?: RemoveCookiesConfig): void {
    this.cookieService.deleteAll(
      config?.path ?? this.DEFAULT_PATH,
      config?.domain,
      config?.secure,
      config?.sameSite,
    );
  }

  getAll(): Record<string, string> {
    return this.cookieService.getAll();
  }

  /**
   * Sets a new cookie expiration time
   * @param key {string} Cookie key name
   * @param value {unknown} Cookie value to save
   * @param expiration { number | Date } Number in milliseconds to get added
   * @param config {CookiesConfig}
   */
  setCookieTime(
    key: string,
    value: unknown,
    expiration: number | Date,
    config?: CookiesConfig,
  ): void {
    if (typeof expiration === "number") {
      expiration = new Date(new Date().getTime() + expiration);
    }
    this.set(key, value, { ...config, expires: expiration });
  }

  /**
   * @deprecated Use get instead
   * Old method to get a cookie value
   * @param cookie {string} String cookie to save
   */
  getCookie(cookie: string): string | undefined {
    return this.cookieService.get(cookie) || undefined;
  }

  /**
   * @deprecated Use set instead
   * Old method to set a cookie new value
   * @param cookie {string}
   * @param newValue {string}
   * @param expiration {Date}
   * @param cookiePath {string}
   */
  putCookie(
    cookie: string,
    newValue: string,
    expiration?: Date,
    cookiePath?: string,
  ): void {
    // eslint-disable-next-line
    this.cookieService.set(cookie, newValue, {
      expires: expiration,
      path: cookiePath || this.DEFAULT_PATH,
    });
  }

  /**
   * @deprecated Use setCookieTime instead
   * @param cookie {string}
   * @param content {string}
   * @param expiryTime {number}
   * @param path {path}
   */
  updateCookie(
    cookie: string,
    content: string,
    expiryTime: number,
    path: string,
  ): void {
    const expiration = new Date();
    if (content) {
      expiration.setTime(expiration.getTime() + expiryTime);
      this.putCookie(cookie, content, expiration, path);
    }
  }

  /**
   * @deprecated Don't use, bad type definition, not clear use case
   * Gets entry params from selected cookie
   * @returns {string | null} - returns an string with value params.
   */
  getCookieParams(
    cookie: string,
    params: string,
    deleteMode: boolean,
  ): string | null {
    let valueParams = "";
    const cookieValue = this.get<string>(cookie);
    const cookieParams = cookieValue ? cookieValue.split("|") : null;

    if (cookieParams) {
      for (
        let cookieIndex = 0;
        cookieIndex < cookieParams.length;
        cookieIndex++
      ) {
        valueParams = valueParams || "";
        if (params.includes(cookie[cookieIndex])) {
          if (deleteMode) {
            valueParams = valueParams !== "" ? `${valueParams}|` : "";
          } else {
            valueParams =
              valueParams !== ""
                ? `${valueParams}|${cookieParams[cookieIndex]}`
                : cookieParams[cookieIndex];
          }
        } else if (deleteMode) {
          valueParams =
            valueParams !== ""
              ? `${valueParams}|${cookieParams[cookieIndex]}`
              : cookieParams[cookieIndex];
        }
      }
    }
    return valueParams ? `${valueParams}|` : null;
  }

  /**
   * Update the Search Cookies based on the advanced search model
   * @param {BookingFlightSearchInformation} searchModel - the model of availability search
   */
  updateAvailabilitySearchCookies(
    searchModel: BookingFlightSearchInformation,
  ): void {
    const cookieParams = this.get<string>("IBERIACOM_LAST_SEARCH");
    const expiration = new Date();
    if (cookieParams) {
      const cookieData = cookieParams.split("|");
      cookieData[0] = searchModel.cityOrigin.code;
      cookieData[1] = searchModel.cityDestiny.code;
      if (searchModel.selectedOutbondDate) {
        cookieData[2] = this.zeroInDate(
          searchModel.selectedOutbondDate.getDate(),
        );
        cookieData[3] = this.zeroInDate(
          searchModel.selectedOutbondDate.getMonth() + 1,
        );
        cookieData[4] = searchModel.selectedOutbondDate
          .getFullYear()
          .toString();
      }
      if (
        searchModel.selectedReturnDate &&
        searchModel.tripOptionSelected?.code !== 1
      ) {
        cookieData[5] = this.zeroInDate(
          searchModel.selectedReturnDate.getDate(),
        );
        cookieData[6] = this.zeroInDate(
          searchModel.selectedReturnDate.getMonth() + 1,
        );
        cookieData[7] = searchModel.selectedReturnDate.getFullYear().toString();
      } else {
        cookieData[5] = "";
        cookieData[6] = "";
        cookieData[7] = "";
      }
      cookieData[9] = searchModel.passengersSelected[0]
        ? searchModel.passengersSelected[0].count.toString()
        : "0";
      cookieData[10] = searchModel.passengersSelected[1]
        ? searchModel.passengersSelected[1].count.toString()
        : "0";
      cookieData[12] = searchModel.passengersSelected[2]
        ? searchModel.passengersSelected[2].count.toString()
        : "0";
      cookieData[13] = "0";
      cookieData[14] = "0";
      cookieData[15] = searchModel.cabinSelected.code;
      cookieData[16] = searchModel.discountResident.value;
      cookieData[17] = searchModel.discountFamily.value;
      cookieData[22] = (
        searchModel.payWithAvios || searchModel.payWithPoints
      ).toString();

      const newCookieValue = `${cookieData.join("|")}|`;
      expiration.setTime(expiration.getTime() + this.DEFAULT_EXPIRY_TIME);
      this.putCookie(
        CommonsConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME,
        newCookieValue,
        expiration,
        this.DEFAULT_PATH,
      );
    }
  }

  /**
   * Transform a date into string with a zero to format result
   * @param {Date} n - a date to be transformed into string whit zero added
   * @returns {String} - returns an string with date tranformed on string adding zero.
   */
  private zeroInDate(n: number): string {
    return String(`00${n}`).slice(-2);
  }

  /**
   * Update a cookie with the new value on specific position inside all definitions
   * @param {String} cookie - name of the cookie to be update
   * @param {any} newCookieIndex - the position index of the value to be modified
   * @param {any} newCookieValue - the new value for the previos position on cookie
   * @param {String} path - path of the cookie
   * @param {Date} expirationDate - a future date when the cookie will expire
   */
  updateCookieValue(
    cookie: string,
    newCookieIndex: number,
    newCookieValue: string,
    path: string,
    expirationDate: Date,
  ): void {
    const expiration: Date = expirationDate ? expirationDate : new Date();
    const cookieValue = this.get<string>(cookie);
    if (cookieValue !== null && cookieValue !== undefined) {
      expiration.setTime(expiration.getTime() + this.DEFAULT_EXPIRY_TIME);
      const cookieValueArray = cookieValue.split("|");
      cookieValueArray[newCookieIndex] =
        cookieValueArray[newCookieIndex] !== newCookieValue
          ? newCookieValue
          : cookieValueArray[newCookieIndex];
      const newCookieResult = `${cookieValueArray.join("|")}|`;
      this.putCookie(
        cookie,
        newCookieResult,
        expiration,
        path ? path : this.DEFAULT_PATH,
      );
    }
  }
}
downgradeToAJSService(
  "CommonsCookiesService",
  CommonsCookiesService,
  "ib-commons-utils-module",
);
