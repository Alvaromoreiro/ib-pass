/* eslint-disable  @typescript-eslint/prefer-nullish-coalescing */
import { Injectable } from "@angular/core";
import { GetEventValues, IbStorageUtility } from "./ib-storage-utils.model";
import { downgradeToAJSService } from "../ib-commons-angularjs-utils";
import { filter, fromEvent, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonsBrowserStorageService implements IbStorageUtility {
  /**
   * @description Iberia utility to get an object from [<b>local storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/localStorage}.
   * @param {string} key The key to get the value from.
   * @returns The value found or null if not found.
   * @example
   * storageService.get<number>('key'); // returns the vale found as number or null if not found.
   * @author Iván Peña Huguet
   */
  get<T = unknown>(key: string): T | null {
    const value = localStorage.getItem(key);
    return this.transformStringifiedValue<T>(value);
  }

  /**
   * @description Iberia internal function to transform the stored stringified value to an object.
   * @param value
   * @private
   */
  private transformStringifiedValue<T>(value: string | null): T | null {
    try {
      return JSON.parse(value ?? "null") as T | null;
    } catch (err) {
      return value === "" ? null : (value as unknown as T);
    }
  }

  /**
   * @description Iberia utility to set an object to [<b>local storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/localStorage}.
   * Do not pass undefined or null values. If an undefined value is passed,
   * it will be converted to null to avoid errors when recovering the value and make it more consistent.
   * @param {string} key The key to set the value to.
   * @param {unknown} value Any value to store, non-null or undefined. It will be serialized.
   * @example
   * storageService.set('key', value);
   * @author Iván Peña Huguet
   */
  set(key: string, value: NonNullable<unknown>): void {
    const valueToStore =
      typeof value === "string"
        ? value
        : JSON.stringify(typeof value === "undefined" ? null : value);
    localStorage.setItem(key, valueToStore);
  }

  /**
   * @description Iberia utility to remove an object from [<b>local storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/localStorage}.
   * @param {string} key The key to remove the value.
   * @example
   * storageService.remove('key');
   * @author Iván Peña Huguet
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * @description Iberia utility to subscribe to localStorage event and get the values of a wanted key when they
   * change. This event only triggers when the localStorage changes in another tab or window, not in the same.
   * @param key {string} key The key to listen to changes in storage.
   * @author Iván Peña Huguet
   */
  getAsObservable<T = unknown>(key: string): Observable<GetEventValues<T>> {
    return fromEvent(window, "storage").pipe(
      filter((data) => (data as StorageEvent).storageArea === localStorage),
      filter((data) => (data as StorageEvent).key === key),
      map((data) => {
        const { newValue, oldValue } = data as StorageEvent;
        return {
          newValue: this.transformStringifiedValue(newValue),
          oldValue: this.transformStringifiedValue(oldValue),
        };
      }),
    );
  }

  /**
   * @deprecated Use get method instead, it works with any type more consistently
   * Get object local storage
   * @param {string} key
   * @returns {any}
   */
  getObject(key: string): object {
    return JSON.parse(localStorage.getItem(key) || "{}") as unknown as object;
  }

  /**
   * @deprecated Use set method instead, it works with any type more consistently
   * Set object local storage
   * @param {string} key
   * @param {any} value
   */
  setObject(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @deprecated User clearAll instead
   * @description Clear all item local storage
   */
  clear(): void {
    localStorage.clear();
  }
  /**
   * @description Iberia utility to clear all variables that matches with a patter from [<b>local storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/localStorage}.
   * @param {string | RegExp} pattern Optional value that provides a pattern (RegExp) or string in order to remove pairs which key matches the pattern
   *                                   If not provided this function will delete all keys.
   * @example
   * storageService.clearAll(); //Remove all pairs which keys starts with configured prefix unless this prefix is undefine when will remove all pairs
   * storageService.clearAll('\[a-z]') //Remove all pairs which keys match the pattern (provided as string)
   * storageService.clearAll(/[a-z]/) //Remove all pairs which keys match the pattern (provided as RegExp)
   * @author Iván Peña Huguet
   */
  clearAll(pattern: string | RegExp = /(?:)/): void {
    const patternAux = pattern ? new RegExp(pattern) : new RegExp(/(?:)/);
    for (const key in window.localStorage) {
      if (patternAux.test(key)) {
        window.localStorage.removeItem(key);
      }
    }
  }
}

downgradeToAJSService(
  "CommonsBrowserStorageService",
  CommonsBrowserStorageService,
  "ib-commons-utils-module",
);
