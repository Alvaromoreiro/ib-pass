import angular from "angular";
import { CommonsNewHttpUtilsErrorService } from "src/app/core/utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

export class CommonsCustomerCreditCardService {
  constructor(
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: angular.local.storage.ILocalStorageService,
  ) {}

  /**
   * @function getCustomerCreditCards
   *
   * Gets complete customer information from its rest service.
   *
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  getCustomerCreditCards = (
    onlyCompleteCards?: boolean,
  ): angular.IPromise<any> => {
    return new Promise((resolve, reject) => {
      const endpoint = onlyCompleteCards
        ? this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
            .GET_CREDIT_CARD + "?onlyComplete=true"
        : this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
            .GET_CREDIT_CARD;
      this.CommonsGenericSFProxy.getGeneric(endpoint).then(
        (response) => {
          if (onlyCompleteCards) {
            response.data = this.addedInfoProvider(response.data);
            this.localStorageService.set(
              "customerCreditCardsData",
              response.data,
            );
            resolve(response.data);
          } else {
            resolve(response);
          }
        },
        (error) => {
          if (onlyCompleteCards) {
            resolve([]);
          } else {
            this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
          }
        },
      );
    });
  };

  /**
   * @function deleteCustomerCreditCard
   *
   * Delete a payment card using the profileCardID passed by parameter
   *
   * @param  {String} profileCardID
   * @return {Object} Return the promise with the response data
   */
  deleteCustomerCreditCard = (profileCardID) => {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
          .UPDATE_OR_DELETE_CREDIT_CARD;
      this.CommonsGenericSFProxy.deleteGeneric(endpoint + profileCardID).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  };

  /**
   * @function addCustomerCreditCard
   *
   * Call the proxy to add a new credit card.
   *
   * @param  {Object} creditCardData Object with the credit card data to add it.
   * @return {Object.<Promise>} When the promise rejects, it returns an object with the error data to show in the view.
   */
  addCustomerCreditCardComplete = (creditCardData) => {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.SAVE_IBERIAPAY_CARD;

      this.CommonsGenericSFProxy.postGeneric(endpoint, creditCardData).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  };
  /**
   * @function addCustomerCreditCardAfterPayment
   *
   * Call the proxy to add a new credit card.
   *
   * @param  {Object} creditCardData Object with the credit card data to add it.
   * @return {Object.<Promise>} When the promise rejects, it returns an object with the error data to show in the view.
   */
  addCustomerCreditCardAfterPayment = (creditCardData) => {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
          .UPDATE_OR_DELETE_CREDIT_CARD;

      this.CommonsGenericSFProxy.postGeneric(endpoint, creditCardData).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  };

  /**
   * @function updateCreditCardComplete
   *
   * Call the proxy to update a credit card.
   *
   * @param  {Object} creditCardData Object with the credit card data to add it.
   * @return {Object.<Promise>} When the promise rejects, it returns an object with the error data to show in the view.
   */
  updateCreditCardComplete = (creditCardData, profileCardID) => {
    return new Promise((resolve, reject) => {
      const endpoint =
        this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
          .UPDATE_OR_DELETE_CREDIT_CARD;

      this.CommonsGenericSFProxy.putGeneric(
        endpoint + profileCardID,
        creditCardData,
      ).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  };
  private addedInfoProvider(creditCardInfo) {
    for (let i: number = 0; i < creditCardInfo.length; i++) {
      creditCardInfo[i].profileAddressInfo = creditCardInfo[i].addressInfo;
      delete creditCardInfo[i].addressInfo;
      if (this.localStorageService.get("flowApp") === "BBKIOH") {
        creditCardInfo[i].provider = {
          ONHOLD_CREDITCARD: true,
          ONHOLD_IBERIA_PAY: true,
        };
      } else {
        creditCardInfo[i].provider = {
          CREDITCARD: true,
          IBERIA_PAY: true,
        };
      }
      creditCardInfo[i].cardNumber =
        creditCardInfo[i].creditCardInfo[0].type === "IBERIAPAY"
          ? creditCardInfo[i].creditCardInfo[0].mask
          : creditCardInfo[i].creditCardInfo[0].cardNumber;
    }
    return creditCardInfo;
  }
}

CommonsCustomerCreditCardService.$inject = [
  "CommonsGenericProxy",
  "CommonsGenericSFProxy",
  "CommonsNewHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "localStorageService",
];

try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service(
    "CommonsCustomerCreditCardService",
    CommonsCustomerCreditCardService,
  );
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service(
    "CommonsCustomerCreditCardService",
    CommonsCustomerCreditCardService,
  );
}
