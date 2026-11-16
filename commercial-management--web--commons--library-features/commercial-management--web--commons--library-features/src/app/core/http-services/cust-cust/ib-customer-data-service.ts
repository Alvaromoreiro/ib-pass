import * as angular from "angular";
import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";
import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { CommonsUserUtilsService } from "../../utils/ib-commons-user-utils.service";
import { CurrencyService } from "../../utils/ib-commons-currency-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";

export class IbCCustomerDataService {
  constructor(
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: angular.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
    private CommonsUtilService: CommonsUtilService,
    private CurrencyService: CurrencyService,
    private DatalayerUtilsService: DatalayerUtilsService,
    private CommonsUserUtilsService: CommonsUserUtilsService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsConstants: CommonsConstantsType,
  ) {}

  /**
   * Gets complete customer information from its rest service.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  getCustomerData = (
    promise?: angular.IDeferred<any>,
  ): angular.IPromise<any> => {
    const isIbZero = this.CommonsUserUtilsService.isIbZero();
    const memberId = this.CommonsUtilService.getMemberId();
    const tierLevel = this.CommonsUtilService.getTierLevelByToken();
    const isReload: boolean =
      this.localStorageService.get("reloadCustomerComplete") ?? false;
    this.localStorageService.set("tierLevel", tierLevel);
    let promises: Promise<any>[] = [];
    let wcsStoredData: any;

    if (isIbZero) {
      wcsStoredData = this.getWCSStoredData("IBZERO");
      let promiseOne = new Promise((resolve, reject) => {
        if (!isReload && wcsStoredData) {
          resolve({ code: 200, data: wcsStoredData[0] });
        } else {
          this.CommonsGenericSFProxy.getGeneric(
            this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
              .PERSONAL_DATA_SERVER,
          ).then(
            (data) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            },
          );
        }
      });
      let promiseTwo = new Promise((resolve, reject) => {
        if (!isReload && wcsStoredData) {
          resolve({ code: 200, data: wcsStoredData[1] });
        } else {
          this.CommonsGenericSFProxy.getGeneric(
            this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
              .IB_ZERO_CONTACT_DETAILS,
          ).then(
            (data) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            },
          );
        }
      });
      promises = [promiseOne, promiseTwo];
    } else {
      wcsStoredData = this.getWCSStoredData("IBPLUS");
      const promiseOne = new Promise((resolve, reject) => {
        if (!isReload && wcsStoredData) {
          resolve({ code: 200, data: wcsStoredData });
        } else {
          this.CommonsGenericSFProxy.getGeneric(
            this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.retrieveMembers.replace(
              "{{id}}",
              memberId,
            ),
          ).then(
            (data) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            },
          );
        }
      });
      promises = [promiseOne];
    }

    const getCustomerDataSuccess = (data): CustomerDataCommons => {
      this.localStorageService.set("memeberDetails", data);
      const cleanData = [];
      for (let i = 0; i < data.length; i++) {
        cleanData.push(data[i].data);
      }
      const customerData: CustomerDataCommons = isIbZero
        ? this.CommonsUtilService.getModelIbCustomerData(cleanData)
        : this.CommonsUtilService.getModelCustomerData(cleanData);

      if (!isIbZero) {
        const commercialData: commercialData =
          this.localStorageService.get("commercialData");
        const aviosSeparator =
          commercialData?.currency?.groupingSeparator ??
          this.CommonsConstants.DEFAULT_SEPARATOR;
        customerData.generalInfo.aviosTransformed =
          this.CurrencyService.formatAvios(
            aviosSeparator,
            customerData.generalInfo.avios,
          );
        this.updateWCSStoredData("IBPLUS", cleanData[0]);
      } else {
        this.updateWCSStoredData("IBZERO", cleanData);
      }
      this.$rootScope.customerData = customerData;
      this.localStorageService.set("customerData", customerData);
      this.DatalayerUtilsService.initializeDatalayer(
        this.$rootScope.appLang,
        this.$rootScope.appMarket,
        this.CommonsUtilService.getDeviceType(),
      );
      /* INIT DELETE GA4 MIGRATION*/
      this.DatalayerUtilsService.updateLoggedDatalayer(
        customerData.generalInfo,
      );
      /* FINISH DELETE GA4 MIGRATION*/
      this.DatalayerUtilsService.updateLoggedDigitalData(
        customerData.generalInfo,
      );

      if (
        angular.isDefined(customerData.personalInfo.contactEmail) &&
        angular.isString(customerData.personalInfo.contactEmail)
      ) {
        this.CommonsUtilService.sha256(
          customerData.personalInfo.contactEmail,
        ).then((hash) => {
          customerData.generalInfo.hashEID = hash;
          this.localStorageService.set("customerData", customerData);
          /* INIT DELETE GA4 MIGRATION*/
          this.DatalayerUtilsService.updateLoggedDatalayer(
            customerData.generalInfo,
          );
          /* FINISH DELETE GA4 MIGRATION*/
          this.DatalayerUtilsService.updateLoggedDigitalData(
            customerData.generalInfo,
          );
        });
      }

      if (customerData !== null) {
        this.$rootScope.$broadcast("customerDataModalWaiting", customerData);
      }
      this.localStorageService.remove("reloadCustomerComplete");
      return customerData;
    };

    const getCustomerDataError = (error): void => {
      this.localStorageService.remove("reloadCustomerComplete");
      this.CommonsNewHttpUtilsErrorService.controlError(error, Promise.reject);
    };

    return Promise.all(promises).then(
      getCustomerDataSuccess,
      getCustomerDataError,
    );
  };

  private getWCSStoredData = (userType: string): any => {
    const wcsStoredKey = this.CommonsConstants.WCS_CUSTOMERDATA_STORAGES;
    let result: string;
    if (wcsStoredKey) {
      result = sessionStorage.getItem(wcsStoredKey[userType]);
    }
    try {
      return JSON.parse(result);
    } catch (e) {
      return null;
    }
  };
  private updateWCSStoredData = (userType: string, data: any): void => {
    const wcsStoredKey = this.CommonsConstants.WCS_CUSTOMERDATA_STORAGES;
    if (wcsStoredKey && data) {
      sessionStorage.setItem(wcsStoredKey[userType], JSON.stringify(data));
    }
  };
}

IbCCustomerDataService.$inject = [
  "CommonsHttpServicesConstants",
  "localStorageService",
  "$rootScope",
  "CommonsNewHttpUtilsErrorService",
  "CommonsUtilService",
  "CurrencyService",
  "DatalayerUtilsService",
  "CommonsUserUtilsService",
  "CommonsGenericSFProxy",
  "CommonsConstants",
];

try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service("IbCCustomerDataService", IbCCustomerDataService);
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service("IbCCustomerDataService", IbCCustomerDataService);
}
