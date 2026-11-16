@Service("ib-commons-http-service-module", ["$http", "$q"])
export class IbCAuthTokenProxy {
  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService,
  ) {}

  ////////////////
  /**
   * Calls HTTP POST method on the get authorization token rest service with app global autorization token and the token params
   * @param {string} uri - the http url of authorization token rest service
   * @param {string} authorizationToken - the global app autorization token using "basic" autorization type
   * @param {string} tokenParams - the requested type of authorization token, depending if you want an anonymous token, logged access token or refresh a logged token
   * The current posible values are:
   * <ul>
   *      <li>"grant_type=client_credentials" - This is used for anonymous token</li>
   *      <li>"grant_type=password;login_type=iberia_plus_standard;username=<Nº IB plus>;password=<IB plus pin>;scope=offline_access" - This is for iberia plus logged access</li>
   *      <li>"grant_type=refresh_token;refresh_token=<The current refresh token>" - this is used for refresh the iberia plus logged access when it is expired</li>
   * </ul>
   * @returns {Object.<Promise>} - returns the $http promise. When the promise resolves, it returns an object with the response data and the response status.
   *  When the promise rejects, it returns an object with the response error data and the response error code.
   */

  getToken = (
    uri: string,
    authorizationToken: string,
    tokenParams: string,
    newConfig?: boolean,
  ): angular.IPromise<
    | CommonsServiceTypes.CommonsProxyResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    const defer = this.$q.defer();
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

    const getTokenComplete = (
      response: CommonsServiceTypes.CommonsProxyResponse,
    ): void => {
      return defer.resolve(response.data);
    };

    const getTokenFailed = (
      response: CommonsServiceTypes.CommonsErrorProxyResponse,
    ): void => {
      return defer.reject({ data: response.data, errorCode: response.status });
    };
    this.$http
      .post(uri, tokenParams, newConfig ? configSF : config)
      .then(getTokenComplete)
      .catch(getTokenFailed);

    return defer.promise;
  };
}
