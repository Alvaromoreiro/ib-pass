import * as angular from "angular";
import { CommonsCookiesService } from "../utils/storage-utils/ib-commons-cookies.service";
import { CommonsLoginConstantsType } from "../constants/ib-commons-login-constants";

@Service("ib-commons-proxies-module", [
  "$http",
  "$q",
  "localStorageService",
  "CommonsCookiesService",
  "CommonsLoginConstants",
])
export class CommonsGenericSFProxy {
  private SF_Headers: { headers: Record<string, any> };
  private IMG_Config: object;
  private IMG_POST_CONFIG: object;
  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private CommonsCookiesService: CommonsCookiesService,
    private CommonsLoginConstants: CommonsLoginConstantsType,
  ) {}

  private retrieveHeaders = () => {
    this.SF_Headers = {
      headers: {
        "X-Salesforce-Token":
          this.CommonsCookiesService.get(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          ) ||
          this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          ),
      },
    };
    this.IMG_Config = {
      headers: {
        "X-Salesforce-Token":
          this.CommonsCookiesService.get(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          ) ||
          this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          ),
      },
      responseType: "arraybuffer",
      cache: "true",
    };
    this.IMG_POST_CONFIG = {
      headers: {
        "X-Salesforce-Token":
          this.CommonsCookiesService.get(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          ) ||
          this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          ),
        "Content-Type": "POST_IMG",
      },
      transformRequest: angular.identity,
    };
  };

  ////////////////
  /**
   * Calls HTTP GET method
   * @param {string} url - the http url of ignore order rest service
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */
  getGeneric = (
    url: string,
    config?: string,
  ): ng.IPromise<
    | CommonsServiceTypes.CommonsProxyResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    this.retrieveHeaders();
    const defer = this.$q.defer();
    const getComplete = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.resolve({ data: response.data, code: response.status });
    };
    const getFailed = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.reject({ data: response.data, errorCode: response.status });
    };
    this.$http
      .get(url, config ? this[config] : this.SF_Headers)
      .then(getComplete)
      .catch(getFailed);
    return defer.promise;
  };

  ////////////////
  /**
   * Calls HTTP POTS method
   * @param {string} url - the http url of ignore order rest service
   * @param {data} data - data to send to rest service
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */

  postGeneric = (
    url: string,
    data?: any,
    config?: string,
  ): ng.IPromise<
    | CommonsServiceTypes.CommonsProxyResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    this.retrieveHeaders();
    const defer = this.$q.defer();
    const postComplete = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.resolve({ data: response.data, code: response.status });
    };
    const postFailed = (
      response: CommonsServiceTypes.CommonsErrorProxyResponse,
    ): void => {
      return defer.reject({ data: response.data, errorCode: response.status });
    };
    this.$http
      .post(
        url,
        config === "IMG_POST_CONFIG" || data === null
          ? data
          : angular.toJson(data),
        config ? this[config] : this.SF_Headers,
      )
      .then(postComplete)
      .catch(postFailed);
    return defer.promise;
  };
  ////////////////
  /**
   * Calls HTTP DELETE method to ignore order rest service
   * @param {string} url - the http url of ignore order rest service
   * @param {data} data - data to send to rest service
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */

  putGeneric = (
    url: string,
    data: any,
  ): ng.IPromise<
    | CommonsServiceTypes.CommonsProxyResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    this.retrieveHeaders();
    const defer = this.$q.defer();
    const putComplete = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.resolve({ data: response.data, code: response.status });
    };

    const putFailed = (
      response: CommonsServiceTypes.CommonsErrorProxyResponse,
    ): void => {
      return defer.reject({ data: response.data, errorCode: response.status });
    };
    this.$http
      .put(url, angular.toJson(data), this.SF_Headers)
      .then(putComplete)
      .catch(putFailed);
    return defer.promise;
  };

  ////////////////
  /**
   * Calls HTTP DELETE method to ignore order rest service
   * @param {string} url - the http url of ignore order rest service
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */

  deleteGeneric = (
    url: string,
  ): angular.IPromise<
    | CommonsServiceTypes.CommonsProxyResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    this.retrieveHeaders();
    const defer = this.$q.defer();
    const deleteComplete = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.resolve({ data: response.data, code: response.status });
    };
    const deleteFailed = (
      response: CommonsServiceTypes.CommonsErrorProxyResponse,
    ): void => {
      return defer.reject({ data: response.data, errorCode: response.status });
    };
    this.$http
      .delete(url, this.SF_Headers)
      .then(deleteComplete)
      .catch(deleteFailed);
    return defer.promise;
  };

  ////////////////
  /**
   * Calls HTTP PATCH method
   * @param {string} url - the http url of ignore order rest service
   * @param {data} data - data to send to rest service
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */

  patchGeneric = (
    url: string,
    data: any,
  ): angular.IPromise<
    | CommonsServiceTypes.CommonsProxyResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    this.retrieveHeaders();
    const defer = this.$q.defer();
    const patchComplete = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.resolve({ data: response.data, code: response.status });
    };

    const patchFailed = (
      response: CommonsServiceTypes.CommonsErrorProxyResponse,
    ): void => {
      return defer.reject({ data: response.data, errorCode: response.status });
    };
    this.$http
      .patch(url, angular.toJson(data), this.SF_Headers)
      .then(patchComplete)
      .catch(patchFailed);
    return defer.promise;
  };
}
