import * as angular from "angular";
import merge from "lodash-es/merge";
import { CommonsLoginConstantsType } from "../../../constants/ib-commons-login-constants";
import { CommonsUserUtilsService } from "../../../utils/ib-commons-user-utils.service";
import { CommonsHttpServicesConstantsType } from "../../../constants/ib-commons-http-service-constants";
import { IbCAuthNewTokenProxy } from "../proxy/ib-auth-new-token-proxy";
import { CommonsCookiesService } from "../../../utils/storage-utils/ib-commons-cookies.service";
export class IbCAuthNewTokenService {
  private tokenServiceURI = this.CommonsHttpServicesConstants.tokenServiceURI;
  private accessTokenSFServiceURI: string;
  private accessToTokenSFServiceURI: string;
  private tokenOBServiceURI =
    this.CommonsHttpServicesConstants.tokenOBServiceURI;
  private globalAuthorizationToken =
    this.CommonsHttpServicesConstants.globalAuthorizationToken;
  private tokenParams = "grant_type=client_credentials";

  constructor(
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private IbCAuthNewTokenProxy: IbCAuthNewTokenProxy,
    private localStorageService: angular.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
    private $window: ng.IWindowService,
    private CommonsLoginConstants: CommonsLoginConstantsType,
    private $cookies: angular.cookies.ICookiesService,
    private CommonsUserUtilsService: CommonsUserUtilsService,
    private CommonsCookiesService: CommonsCookiesService,
  ) {}

  private processTokenError = (error): CommonsErrorModels.GenericError => {
    const hasReason =
      error.data && error.data.errors && error.data.errors.length > 0;
    return {
      message: hasReason
        ? error.data.error_description
        : "REST_SERVICE_ERROR_GENERAL",
      needsTranslate: !hasReason,
      internalErrorCode: hasReason ? error.data.error : "",
      errorCode: error.errorCode,
      originalError: error,
    };
  };

  private commonLoginUserSuccess = (
    data,
    resolve,
    SF_TOKEN?,
    ONB?: string,
    reject?,
    updateUserInf?: boolean,
  ): void => {
    if (!ONB) {
      merge(data, {
        access_salesforce_token: SF_TOKEN?.access_token,
        access_to_salesforce_token:
          (SF_TOKEN?.access_to_salesforce_token?.exp ?? 0) -
          (SF_TOKEN?.access_to_salesforce_token?.iat ?? 0),
      });
    }
    this.updateRefreshToken(data, true, ONB, updateUserInf);
    this.$rootScope.isLogged = ONB
      ? this.CommonsHttpServicesConstants.LOGIN_ONB
      : true;
    if (updateUserInf) {
      this.localStorageService.set("reloadCustomerComplete", true);
      reject(data);
    } else {
      resolve(data);
    }
  };

  ////////////////
  /**
   * Gets Anonymous token and stores it in Session Storage. If there was and error in the http call,
   * this method treats these http error code and returns the object to show an error in the view.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  getAnonymousToken = (injector) => {
    return new Promise((resolve, reject) => {
      this.IbCAuthNewTokenProxy.getToken(
        injector,
        this.tokenServiceURI,
        this.globalAuthorizationToken,
        this.tokenParams,
      ).then(
        (data: any) => {
          this.localStorageService.set("anonymousToken", data.access_token);
          resolve(data);
        },
        (error) => {
          reject(this.processTokenError(error));
        },
      );
    });
  };

  /**
   * Gets a new user logged token  and stores the new logged token, the new refresh token and a flag to know if the current user is logged in Session Storage.
   *  If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  refreshUserLoggedToken = (injector): angular.IPromise<any> => {
    const loginSF = this.getSFAccessToken();
    const refreshSF = this.CommonsCookiesService.get(
      this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_TOKEN,
    );
    const refreshToken = this.CommonsCookiesService.get(
      this.CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN,
    );
    this.accessTokenSFServiceURI =
      this.CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI;
    this.accessToTokenSFServiceURI =
      this.CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI;

    const refreshTokenSFParams = $.param({
      grant_type: "refresh_token",
      refresh_token: refreshSF,
    });
    let accessToSFParams = $.param({
      token: loginSF,
      token_type_hint: "access_token",
    });
    let tokenParams = $.param({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    return new Promise((resolve, reject) => {
      const updateToPermanentUser = () => {
        this.getAnonymousToken(injector)
          .then(() => {
            const anonymousAuthorizationToken: string =
              this.localStorageService.get("anonymousToken");
            return this.IbCAuthNewTokenProxy.getToken(
              injector,
              this.accessTokenSFServiceURI,
              anonymousAuthorizationToken,
              refreshTokenSFParams,
              true,
            );
          })
          .then(
            (SF_REFRESH_TOKEN: CommonsServiceTypes.CommonsProxyResponse) => {
              accessToSFParams = $.param({
                token: SF_REFRESH_TOKEN.access_token,
                token_type_hint: "access_token",
              });
              const anonymousAuthorizationToken: string =
                this.localStorageService.get("anonymousToken");
              this.IbCAuthNewTokenProxy.getToken(
                injector,
                this.accessToTokenSFServiceURI,
                anonymousAuthorizationToken,
                accessToSFParams,
                true,
              ).then(
                (
                  SF_ACCESS_TO_TOKEN: CommonsServiceTypes.CommonsProxyResponse,
                ) => {
                  merge(SF_REFRESH_TOKEN, {
                    access_to_salesforce_token: SF_ACCESS_TO_TOKEN,
                  });
                  tokenParams = $.param({
                    grant_type: "password",
                    code: SF_REFRESH_TOKEN.access_token,
                    login_type: "authorization_code",
                    scope: "soft_user",
                  });
                  this.IbCAuthNewTokenProxy.getToken(
                    injector,
                    this.tokenServiceURI,
                    this.globalAuthorizationToken,
                    tokenParams,
                  ).then(
                    (data) => {
                      this.CommonsUserUtilsService.setSoftUser(true);
                      this.commonLoginUserSuccess(
                        data,
                        resolve,
                        SF_REFRESH_TOKEN,
                        null,
                        reject,
                        true,
                      );
                    },
                    (error) => {
                      reject(this.processTokenError(error));
                    },
                  );
                },
                (error) => {
                  reject(this.processTokenError(error));
                },
              );
            },
            (error) => {
              reject(this.processTokenError(error));
            },
          );
      };

      if (
        this.localStorageService.get("userLogged") ===
        this.CommonsHttpServicesConstants.LOGIN_ONB
      ) {
        this.IbCAuthNewTokenProxy.getToken(
          injector,
          this.tokenOBServiceURI,
          this.globalAuthorizationToken,
          $.param({
            grant_type: "refresh_token",
            refresh_token: this.CommonsCookiesService.get(
              this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN,
            ),
          }),
        ).then(
          (data) => {
            this.commonLoginUserSuccess(
              data,
              resolve,
              null,
              this.CommonsHttpServicesConstants.LOGIN_ONB,
              reject,
            );
          },
          (error) => {
            reject(this.processTokenError(error));
          },
        );
      } else {
        //Primero comprobamos que el token de acceso de SF sea valido
        accessToSFParams = $.param({
          token: this.getSFAccessToken(),
          token_type_hint: "access_token",
        });
        this.getAnonymousToken(injector)
          .then(() => {
            const anonymousAuthorizationToken: string =
              this.localStorageService.get("anonymousToken");
            return this.IbCAuthNewTokenProxy.getToken(
              injector,
              this.accessToTokenSFServiceURI,
              anonymousAuthorizationToken,
              accessToSFParams,
              true,
            );
          })
          .then(
            (SF_ACCESS_TO_TOKEN: CommonsServiceTypes.CommonsProxyResponse) => {
              //Si lo es llamamos a keycloak
              if (SF_ACCESS_TO_TOKEN.active) {
                if (this.CommonsUserUtilsService.isSoftUser()) {
                  tokenParams = $.param({
                    grant_type: "password",
                    code: this.getSFAccessToken(),
                    login_type: "authorization_code",
                    scope: "soft_user",
                  });
                } else {
                  tokenParams = $.param({
                    grant_type: "password",
                    code: this.getSFAccessToken(),
                    login_type: "authorization_code",
                  });
                }
                this.IbCAuthNewTokenProxy.getToken(
                  injector,
                  this.tokenServiceURI,
                  this.globalAuthorizationToken,
                  tokenParams,
                ).then(
                  (data) => {
                    merge(SF_ACCESS_TO_TOKEN, {
                      access_to_salesforce_token: SF_ACCESS_TO_TOKEN,
                      access_token: this.getSFAccessToken(),
                    });
                    this.commonLoginUserSuccess(
                      data,
                      resolve,
                      SF_ACCESS_TO_TOKEN,
                      null,
                      reject,
                    );
                  },
                  (error) => {
                    reject(this.processTokenError(error));
                  },
                );
              } else {
                //Si NO lo es refrescamos SF y pasamos a usuario permanente
                updateToPermanentUser();
              }
            },
            () => {
              //Si no lo es refrescamos todos
              updateToPermanentUser();
            },
          );
      }
    });
  };

  /**
   * Gets a new on business user logged token and stores the new logged token, the new refresh token and a flag to know if the current on business user
   * is logged in Session Storage. If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */

  refreshOnBUserLoggedToken = (injector) => {
    const refreshToken = this.CommonsCookiesService.get(
      this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN,
    );
    const tokenParams = $.param({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    return new Promise((resolve, reject) => {
      this.IbCAuthNewTokenProxy.getToken(
        injector,
        this.tokenOBServiceURI,
        this.globalAuthorizationToken,
        tokenParams,
      ).then(
        (data: any) => {
          this.localStorageService.set("loggedToken", data.access_token);
          this.localStorageService.set("refreshToken", data.refresh_token);
          this.localStorageService.set(
            "userLogged",
            this.CommonsHttpServicesConstants.LOGIN_ONB,
          );
          this.commonLoginUserSuccess(
            data,
            resolve,
            null,
            this.CommonsHttpServicesConstants.LOGIN_ONB,
            reject,
          );
        },
        (error) => {
          reject(this.processTokenError(error));
        },
      );
    });
  };

  private generateTokenExpirationDateString(
    tokenExpirationSeconds: number,
  ): string {
    const expiryDate = this.getTokenExpirationDate(tokenExpirationSeconds);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    })
      .format(expiryDate)
      .replace(",", "");
  }

  private getTokenExpirationDate(expirationSeconds: number) {
    return new Date(new Date().getTime() + expirationSeconds * 1000);
  }

  updateRefreshToken = (
    authResponse: any,
    updateSession?: boolean,
    isONB?: string,
    updateUserInfo?: boolean,
  ) => {
    if (typeof authResponse === "object") {
      if (updateSession) {
        this.localStorageService.set(
          "loginSF",
          authResponse.access_salesforce_token,
        );
        this.localStorageService.set(
          "userLogged",
          isONB ? this.CommonsHttpServicesConstants.LOGIN_ONB : true,
        );
        this.localStorageService.set("loggedToken", authResponse.access_token);
        this.localStorageService.set(
          "refreshToken",
          authResponse.refresh_token,
        );
      }
      switch (isONB) {
        case this.CommonsHttpServicesConstants.LOGIN_ONB:
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN,
            authResponse.access_token,
            {
              expires: this.getTokenExpirationDate(authResponse.expires_in),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN_EXPIRATION,
            this.generateTokenExpirationDateString(authResponse.expires_in),
            {
              expires: this.getTokenExpirationDate(authResponse.expires_in),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN,
            authResponse.refresh_token,
            {
              expires: this.getTokenExpirationDate(
                authResponse.refresh_expires_in,
              ),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES
              .ONB_LOGGED_REFRESH_TOKEN_EXPIRATION,
            this.generateTokenExpirationDateString(
              authResponse.refresh_expires_in,
            ),
            {
              expires: this.getTokenExpirationDate(
                authResponse.refresh_expires_in,
              ),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          break;
        default:
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN,
            authResponse.access_token,
            {
              expires: this.getTokenExpirationDate(authResponse.expires_in),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN_EXPIRATION,
            this.generateTokenExpirationDateString(authResponse.expires_in),
            {
              expires: this.getTokenExpirationDate(authResponse.expires_in),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN,
            authResponse.refresh_token,
            {
              expires: this.getTokenExpirationDate(
                authResponse.refresh_expires_in,
              ),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          this.$cookies.put(
            this.CommonsLoginConstants.SSO_COOKIES
              .LOGGED_REFRESH_TOKEN_EXPIRATION,
            this.generateTokenExpirationDateString(
              authResponse.refresh_expires_in,
            ),
            {
              expires: this.getTokenExpirationDate(
                authResponse.refresh_expires_in,
              ),
              path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
            },
          );
          if (updateUserInfo) {
            this.$cookies.put(
              this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
              authResponse.access_salesforce_token,
              {
                expires: this.getTokenExpirationDate(
                  authResponse.access_to_salesforce_token,
                ),
                path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
              },
            );
            this.$cookies.put(
              this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN_EXPIRATION,
              this.generateTokenExpirationDateString(
                authResponse.access_to_salesforce_token,
              ),
              {
                expires: this.getTokenExpirationDate(
                  authResponse.access_to_salesforce_token,
                ),
                path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
              },
            );
          }
      }
    }
  };

  private getSFAccessToken = (): string => {
    return this.CommonsCookiesService.get(
      this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
    );
  };
}
IbCAuthNewTokenService.$inject = [
  "CommonsHttpServicesConstants",
  "IbCAuthNewTokenProxy",
  "localStorageService",
  "$rootScope",
  "$window",
  "CommonsLoginConstants",
  "$cookies",
  "CommonsUserUtilsService",
  "CommonsCookiesService",
];

try {
  const mod = angular.module("ib-commons-utils-module");
  mod.service("IbCAuthNewTokenService", IbCAuthNewTokenService);
} catch (error) {
  const mod = angular.module("ib-commons-utils-module", [
    "ib-commons-http-new-service-module",
  ]);
  mod.service("IbCAuthNewTokenService", IbCAuthNewTokenService);
}
