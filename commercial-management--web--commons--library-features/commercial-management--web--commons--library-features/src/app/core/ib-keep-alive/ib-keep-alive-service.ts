@Service(
  "ib-commons-keep-alive-module",
  [
    "CommonsConstants",
    "CommonsGenericProxy",
    "localStorageService",
    "CommonsNewHttpUtilsErrorService",
  ],
  [],
)
class CommonsKeepAliveService {
  public counterAttemps: number;

  constructor(
    private CommonsConstants: any,
    private CommonsGenericProxy: any,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private CommonsNewHttpUtilsErrorService: any,
  ) {
    this.counterAttemps = 0;
  }

  keepAlive = (flowId: string): angular.IPromise<any> => {
    return new Promise((resolve, reject) => {
      const flowApp = this.localStorageService.get("flowApp");
      let endpoint;
      switch (flowApp) {
        case this.CommonsConstants.APP.GIFTCARD.NAME:
          endpoint =
            this.CommonsConstants.DEFAULT_ENDPOINTS.keepAliveGiftCardsServiceURICloud.replace(
              "{flowId}",
              flowId,
            );
          break;
        case this.CommonsConstants.APP.SUBSCRIPTIONMODELS.NAME:
          endpoint =
            this.CommonsConstants.DEFAULT_ENDPOINTS.keepAliveSubscriptionModelsServiceURI.replace(
              "{flowId}",
              flowId,
            );
          break;
        case this.CommonsConstants.APP_TYPES.BOOKING:
        case this.CommonsConstants.APP_TYPES.ONHOLD:
        case this.CommonsConstants.APP_TYPES.SHUTTLE_OPEN:
        case this.CommonsConstants.APP_TYPES.SHUTTLE_OPEN_ONB:
        case this.CommonsConstants.APP_TYPES.SHUTTLE_REDEMPTION:
        case this.CommonsConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB:
          endpoint = `${this.CommonsConstants.DEFAULT_ENDPOINTS.keepAliveOrmServiceURI}${flowId}`;
          break;
        default:
          endpoint =
            this.CommonsConstants.DEFAULT_ENDPOINTS.keepAliveServiceURI.replace(
              "{flowId}",
              flowId,
            );
          break;
      }
      if (
        flowApp === this.CommonsConstants.APP.GIFTCARD.NAME ||
        flowApp === this.CommonsConstants.APP.SUBSCRIPTIONMODELS.NAME
      ) {
        this.CommonsGenericProxy.postGeneric(endpoint, {}).then(
          (data) => {
            resolve(data);
          },
          (error) => {
            this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
          },
        );
      } else {
        this.CommonsGenericProxy.getGeneric(endpoint).then(
          (data) => {
            resolve(data);
          },
          (error) => {
            this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
          },
        );
      }
    });
  };

  closeSession = (flowId: string, sync?: boolean): any => {
    const token: string = this.localStorageService.get("userLogged")
      ? this.localStorageService.get("loggedToken")
      : this.localStorageService.get("anonymousToken");
    const isSync = angular.isUndefined(sync) ? false : sync;
    const closeSessionSync = (
      url: string,
      language: string,
      market: string,
      authorizationToken: string,
    ): any => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language + "-" + market,
          Authorization: "Bearer " + authorizationToken,
        },
      };
      let response;
      $.ajax({
        type: "DELETE",
        url: url,
        headers: config.headers,
        async: false,
        success: function (data) {
          response = data;
        },
      });
      return response;
    };

    return isSync
      ? closeSessionSync(
          this.CommonsConstants.DEFAULT_ENDPOINTS.closeSessionURI +
            "/" +
            flowId,
          this.CommonsConstants.lang,
          this.CommonsConstants.market,
          token,
        )
      : this.CommonsGenericProxy.deleteGeneric(
          this.CommonsConstants.DEFAULT_ENDPOINTS.closeSessionURI +
            "/" +
            flowId,
        );
  };
}
