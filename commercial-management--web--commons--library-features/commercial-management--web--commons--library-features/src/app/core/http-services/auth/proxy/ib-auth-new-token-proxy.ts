import * as angular from "angular";

export class IbCAuthNewTokenProxy {
  constructor() {}

  ////////////////
  /**
   * Calls HTTP POST method on the get authorization token rest service with app global autorization token and the token params
   * @param injector
   * @param {string} uri - the http url of authorization token rest service
   * @param {string} authorizationToken - the global app autorization token using "basic" autorization type
   * @param {string} tokenParams - the requested type of authorization token, depending if you want an anonymous token, logged access token or refresh a logged token
   * The current posible values are:
   * <ul>
   *      <li>"grant_type=client_credentials" - This is used for anonymous token</li>
   *      <li>"grant_type=password;login_type=iberia_plus_standard;username=<Nº IB plus>;password=<IB plus pin>;scope=offline_access" - This is for iberia plus logged access</li>
   *      <li>"grant_type=refresh_token;refresh_token=<The current refresh token>" - this is used for refresh the iberia plus logged access when it is expired</li>
   * </ul>
   * @param newConfig
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */

  getToken = (
    injector,
    uri: string,
    authorizationToken: string,
    tokenParams: string,
    newConfig?: boolean,
  ): Promise<unknown> => {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Authorization: authorizationToken,
      },
    };
    const configSF = {
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        newConfig: newConfig,
      },
    };

    return new Promise((resolve, reject) => {
      injector
        .get("$http")
        .post(uri, tokenParams, newConfig ? configSF : config)
        .then((response: CommonsServiceTypes.CommonsProxyResponse) => {
          resolve(response.data);
        })
        .catch((response: CommonsServiceTypes.CommonsErrorProxyResponse) => {
          reject({ data: response.data, errorCode: response.status });
        });
    });
  };
}

IbCAuthNewTokenProxy.$inject = [];

const mod = angular.module("ib-commons-http-new-service-module", []);
mod.service("IbCAuthNewTokenProxy", IbCAuthNewTokenProxy);
