import * as angular from "angular";

@Service(
  "ib-datalayer-module",
  ["$window", "localStorageService"],
  ["ib-commons-constants-module", "ib-monetate-module"],
)
export class DataLayerService {
  public datalayer_general: object;
  public datalayer_ecommerce: object;
  constructor(
    private $window: ng.IWindowService,
    private localStorageService: angular.local.storage.ILocalStorageService,
  ) {}

  /**
   * Initializes the datalayer_general and datalayer_ecommerce objects associating it to page window object.
   * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
   * @param {Object} initialEcommerceObject the initial object of datalayer_ecommerce. if no object received, datalayer_ecommerce will be initialized with empty object
   */
  initDatalayer = (
    initialGeneralObject: object = {},
    initialEcommerceObject: object = {},
  ): void => {
    const confirmationDatalayerInfo =
      this.localStorageService.get("confirmationDatalayerInfo") ?? {};
    this.datalayer_general = this.$window.datalayer_general =
      this.$window.datalayer_general ?? confirmationDatalayerInfo;
    this.datalayer_ecommerce = this.$window.datalayer_ecommerce =
      this.$window.datalayer_ecommerce ?? {};
    Object.assign(this.datalayer_general, initialGeneralObject);
    Object.assign(this.datalayer_ecommerce, initialEcommerceObject);
  };

  /**
   * Returns if datalayer has been initialized
   */
  isDatalayerInit = (): boolean => {
    return (
      angular.isObject(this.datalayer_general) &&
      angular.isObject(this.datalayer_ecommerce)
    );
  };

  /**
   * Extends the current datalayer general information with the extendObj object. If an attribute exists in the current
   * datalayer_general object, changes its value.
   * @param {Object} extendObj the object to extend the current datalayer_general object
   */
  addDataLayerGeneralInfo = (extendObj: object): void => {
    extendObj = extendObj || {};
    this.localStorageService.set(
      "confirmationDatalayerInfo",
      angular.extend(this.datalayer_general, extendObj),
    );
  };

  /**
   * Extends the current datalayer ecommerce information with the extendObj object. If an attribute exists in the current
   * datalayer_ecommerce object, changes its value.
   * @param {Object} extendObj the object to extend the current datalayer_ecommerce object
   */
  addDataLayerEcommerceInfo = (extendObj: object): void => {
    extendObj = extendObj || {};
    angular.extend(this.datalayer_ecommerce, extendObj);
  };

  /**
   * removes a set of attributes from datalayer_general object. If the input parameter is not an array, no modification will be done
   * @param {Array<String>} attributesArray an array with the String name of the attributes to be removed from datalager_general
   */
  removeDatalayerGeneralInfo = (attributesArray: object): void => {
    let i: number = 0;
    if (angular.isArray(attributesArray)) {
      for (i = 0; i < attributesArray.length; i++) {
        if (
          angular.isString(attributesArray[i]) &&
          this.datalayer_general[attributesArray[i]]
        ) {
          delete this.datalayer_general[attributesArray[i]];
        }
      }
    }
  };
  /**
   * Removes all datalayer objects info by initializing it to empty object
   */
  removeAllDatalayerInfo = (): void => {
    this.datalayer_general = this.$window.datalayer_general = {};
    this.datalayer_ecommerce = this.$window.datalayer_ecommerce = {};
  };

  /**
   * Sends to Google Tag Manager an event with the current datalayer_general and datalayer_ecommerce info
   * @param {String} type the event type for Google Tag Manager (Ej: 'view', 'link')
   */
  callUpdateTagManager = (type: string) => {
    if (this.$window.DigitalChange) {
      if (Object.keys(this.datalayer_ecommerce).length > 0) {
        this.localStorageService.set("sendDatalayerEcommerce", false);
      } else {
        this.localStorageService.set("sendDatalayerEcommerce", true);
      }
      this.$window.DigitalChange(
        type,
        this.datalayer_general,
        this.datalayer_ecommerce,
      );
    }
  };

  /**
   * returns the current datalayer general
   */
  getDatalayerGeneral = (): object => {
    return this.datalayer_general;
  };

  /**
   * returns the current ecommerce datalayer
   */
  getEcommerceDatalayer = (): object => {
    return this.datalayer_ecommerce;
  };
}
