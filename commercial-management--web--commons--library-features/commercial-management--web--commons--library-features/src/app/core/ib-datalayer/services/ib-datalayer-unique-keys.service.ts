/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/** INCORRECTLY DETECTED AS UNSAFE ASSIGNMENT **/
import { Injectable } from "@angular/core";
import {
  CommonsSessionStorageService,
  downgradeToAJSService,
} from "ib-web-commons/utils";

/**
 * @description Service to store and retrieve values from the unique keys value from Session Storage. Only two levels of nesting is available.
 * @example Example of what would be stored in the SessionStorage in the 'datalayerUniqueKeys' key. Being 'ANCILLARIES' the key, 'CO2_FOOTPRINT' the subkey, and 'moduleClick' the value to be stored.
 {
    "USER": [
        "userLogged",
        "userPurchased"
    ],
    "ANCILLARIES": {
        "CO2_FOOTPRINT": [
            "moduleClick",
            "modalOpen"
        ],
        "BOB": [
            "moduleClick",
            "modalOpen"
        ]
    }
  }
 */
@Injectable({
  providedIn: "root",
})
export class DatalayerUniqueKeysService {
  private readonly KEY_NAME = "datalayerUniqueKeys";

  constructor(private sessionStorageService: CommonsSessionStorageService) {}

  /**
   * @description Finds the object saved in session storage: `KEY_NAME`, by the key and the subkey (optional)
   * @param {string} key Primary key
   * @param {string} subkey Subkey
   * @example
   * getValue("key", "subkey")
   */
  private getValue(key: string, subkey?: string): string[] | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const value: any = this.sessionStorageService.get<any>(this.KEY_NAME);

    if (!value) {
      return null;
    }

    if (value[key]) {
      if (subkey) {
        return value[key][subkey] as string[];
      }
      if (Array.isArray(value[key])) {
        return value[key] as string[];
      }
      return null;
    }

    return null;
  }

  /**
   * @description Returns true if the unique keys storage contains the {@link value} passed, identified by the {@link key} and {@link subkey}. Returns false if it doesn't exist.
   * @param {string} key Value to be checked
   * @param {string} key Primary key
   * @param {string} subkey Subkey
   * @example
   * // Example with key and subkey:
   * exists("MODULE_OPEN", "ANCILLARIES", "CO2_FOOTPRINT"), this will check if there exists a structure like: {"ANCILLARIES": {"CO2_FOOTPRINT": ["MODULE_OPEN"]}}
   *
   * // Example with only key:
   * exists("MODULE_OPEN", "ANCILLARIES"), this will check if there exists a structure like: {"ANCILLARIES": ["MODULE_OPEN"]}
   */
  exists(value: string, key: string, subkey?: string): boolean {
    const foundValue = this.getValue(key, subkey);

    if (!foundValue) {
      return false;
    }

    return foundValue.includes(value);
  }

  /**
   * @description Stores the  {@link value} passed, identified by the {@link key} and {@link subkey}.
   * If only the key is passed, the leaf is the key itself, resulting in the structure: { key: [value] }.
   * If both the key and subkey are passed, the subkey will become the leaf, resulting in a structure like: { key: { subkey: [value] } }.
   *
   * @param {string} key Value to be stored
   * @param {string} key Primary key
   * @param {string} subkey Subkey
   * @example
   * // Example with key and subkey:
   * setValue("MODULE_OPEN", "ANCILLARIES", "CO2_FOOTPRINT"), this will store the value in a structure like: {"ANCILLARIES": {"CO2_FOOTPRINT": ["MODULE_OPEN"]}}
   *
   * // Example with only key:
   * setValue("MODULE_OPEN", "ANCILLARIES"), this will store the value in a structure like: {"ANCILLARIES": ["MODULE_OPEN"]}
   */
  setValue(value: string, key: string, subkey?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const existingValueKey: any = this.sessionStorageService.get(this.KEY_NAME);

    let valueToInsert = {};

    if (existingValueKey) {
      if (subkey) {
        if (!existingValueKey[key]) {
          existingValueKey[key] = {};
        }

        if (!existingValueKey[key][subkey]) {
          existingValueKey[key][subkey] = [];
        }

        if (!existingValueKey[key][subkey].includes(value)) {
          existingValueKey[key][subkey].push(value);
        }
      } else {
        if (!existingValueKey[key]) {
          existingValueKey[key] = [];
        }

        if (!existingValueKey[key].includes(value)) {
          existingValueKey[key].push(value);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      valueToInsert = existingValueKey;
    } else {
      valueToInsert = subkey
        ? { [key]: { [subkey]: [value] } }
        : { [key]: [value] };
    }

    this.sessionStorageService.set(this.KEY_NAME, valueToInsert);
  }

  /**
   * @description Empties the unique keys storage from the session storage
   * @example
   * clear()
   */
  clear() {
    this.sessionStorageService.remove(this.KEY_NAME);
  }
}

downgradeToAJSService(
  "DatalayerUniqueKeysService",
  DatalayerUniqueKeysService,
  "ib-commons-utils-module",
);
