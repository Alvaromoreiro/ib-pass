import * as angular from "angular";
import { CommonsLoginUtilsService } from "../../../ib-login/services/ib-commons-login-access-utils-service";
import { IbCAuthTokenProxy } from "../proxy/ib-auth-token-proxy";
import { CommonsHttpServicesConstantsType } from "../../../constants/ib-commons-http-service-constants";
import { CommonsUserUtilsService } from "src/app/core/utils/ib-commons-user-utils.service";
import { CommonsCookiesService } from "../../../utils/storage-utils/ib-commons-cookies.service";
import { CommonsLoginConstantsType } from "../../../constants/ib-commons-login-constants";
import { RedirectionService } from "../../../utils/ib-commons-redirection.service";
import { filter, firstValueFrom, take, timeout } from "rxjs";
import type { IbCUserStoreRepositoryService } from "./../../../services/stores/user-store/ib-commons-user-store-repository.service";

@Service("ib-commons-utils-module", [
  "$q",
  "CommonsHttpServicesConstants",
  "IbCAuthTokenProxy",
  "localStorageService",
  "$rootScope",
  "CommonsLoginUtilsService",
  "$window",
  "CommonsUserUtilsService",
  "$cookies",
  "$location",
  "CommonsCookiesService",
  "CommonsLoginConstants",
  "IbCUserStoreRepositoryService",
  "RedirectionService",
])
export class IbCAuthTokenService {
  public COOKIES = this.CommonsHttpServicesConstants.COOKIES;
  constructor(
    private $q: ng.IQService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private IbCAuthTokenProxy: IbCAuthTokenProxy,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
    private CommonsLoginUtilsService: CommonsLoginUtilsService,
    private $window: ng.IWindowService,
    private CommonsUserUtilsService: CommonsUserUtilsService,
    private $cookies: angular.cookies.ICookiesService,
    private $location: ng.ILocationService,
    private CommonsCookiesService: CommonsCookiesService,
    private CommonsLoginConstants: CommonsLoginConstantsType,
    private userStoreService: IbCUserStoreRepositoryService,
    private RedirectionService: RedirectionService,
  ) {}

  private tokenServiceURI = this.CommonsHttpServicesConstants.tokenServiceURI;
  private accessTokenSFServiceURI: string;
  private accessToTokenSFServiceURI: string;
  private tokenOBServiceURI =
    this.CommonsHttpServicesConstants.tokenOBServiceURI;
  private globalAuthorizationToken =
    this.CommonsHttpServicesConstants.globalAuthorizationToken;
  private tokenParams = "grant_type=client_credentials";

  private updateStateToAnonymousRedirection = () => {
    this.userStoreService.logoutUser();
    return this.userStoreService.getUserState().pipe(
      filter((res) => !res.isLoading),
      take(1),
    );
  };

  /**
   * Returns the value for the html metatag given.
   * @param {string} metaTagName - The metatag name for get the value
   * @returns {string} - The metatag value for the given metaTagName
   */
  private getMetaTagValueByName = (metaTagName: string) => {
    let value = "";
    if (
      metaTagName &&
      typeof metaTagName === "string" &&
      this.$window.document.getElementsByName(metaTagName).length > 0
    ) {
      value = (<HTMLMetaElement>(
        this.$window.document.getElementsByName(metaTagName)[0]
      )).content;
    }
    return value;
  };

  ////////////////
  /**
   * Gets Anonymous token and stores it in Session Storage. If there was and error in the http call,
   * this method treats these http error code and returns the object to show an error in the view.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  getAnonymousToken = (): angular.IPromise<any> => {
    const defer = this.$q.defer();
    const getAnonymousTokenSuccess = (data): void => {
      this.localStorageService.set("anonymousToken", data.access_token);
      defer.resolve(data);
    };

    const getAnonymousTokenError = (error): void => {
      defer.reject(this.processTokenError(error));
    };

    this.IbCAuthTokenProxy.getToken(
      this.tokenServiceURI,
      this.globalAuthorizationToken,
      this.tokenParams,
    ).then(getAnonymousTokenSuccess, getAnonymousTokenError);

    return defer.promise;
  };

  /**
   * Gets the user logged token and stores the logged token, the refresh token and a flag to know if the current user is logged in Session Storage.
   *  If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
   * @param {string} username - The Iberia plus number
   * @param {string} password - The user´s Iberia plus pin
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  loginUser = (username: string, password: string): angular.IPromise<any> => {
    const defer = this.$q.defer();
    const tokenParams = $.param({
      grant_type: "password",
      username: username,
      password: password,
      login_type: "iberia_plus_standard",
    });

    const loginUserError = (error): void => {
      defer.reject(this.processTokenError(error));
    };

    this.IbCAuthTokenProxy.getToken(
      this.tokenServiceURI,
      this.globalAuthorizationToken,
      tokenParams,
    ).then((data) => {
      this.commonLoginUserSuccess(data, defer);
    }, loginUserError);

    return defer.promise;
  };

  /**
   * Gets a new user logged token  and stores the new logged token, the new refresh token and a flag to know if the current user is logged in Session Storage.
   *  If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  refreshUserLoggedToken = (): angular.IPromise<any> => {
    const defer = this.$q.defer();

    let refreshTokenSFParams = null,
      accessToSFParams = null,
      tokenParams = null;
    this.accessTokenSFServiceURI =
      this.CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI;
    this.accessToTokenSFServiceURI =
      this.CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI;

    refreshTokenSFParams = $.param({
      grant_type: "refresh_token",
      refresh_token: this.CommonsCookiesService.get(
        this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_TOKEN,
      ),
    });

    const updateToPermanentUser = () => {
      this.getAnonymousToken()
        .then(() => {
          const anonymousAuthorizationToken: string =
            this.localStorageService.get("anonymousToken");
          return this.IbCAuthTokenProxy.getToken(
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
            this.IbCAuthTokenProxy.getToken(
              this.accessToTokenSFServiceURI,
              anonymousAuthorizationToken,
              accessToSFParams,
              true,
            ).then(
              (
                SF_ACCESS_TO_TOKEN: CommonsServiceTypes.CommonsProxyResponse,
              ) => {
                angular.extend(SF_REFRESH_TOKEN, {
                  access_to_salesforce_token: SF_ACCESS_TO_TOKEN,
                });
                tokenParams = $.param({
                  grant_type: "password",
                  code: SF_REFRESH_TOKEN.access_token,
                  login_type: "authorization_code",
                  scope: "soft_user",
                });
                this.IbCAuthTokenProxy.getToken(
                  this.tokenServiceURI,
                  this.globalAuthorizationToken,
                  tokenParams,
                ).then(
                  (data) => {
                    this.CommonsUserUtilsService.setSoftUser(true);
                    this.commonLoginUserSuccess(
                      SF_REFRESH_TOKEN,
                      data,
                      defer,
                      true,
                    );
                  },
                  (error) => {
                    this.commonRefreshUserError(error, defer);
                  },
                );
              },
              (error) => {
                this.commonRefreshUserError(error, defer);
              },
            );
          },
          (error) => {
            this.commonRefreshUserError(error, defer);
          },
        );
    };

    if (
      this.localStorageService.get("userLogged") ===
      this.CommonsHttpServicesConstants.LOGIN_ONB
    ) {
      this.IbCAuthTokenProxy.getToken(
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
          this.CommonsLoginUtilsService.updateRefreshToken(
            data,
            true,
            this.CommonsHttpServicesConstants.LOGIN_ONB,
          );
          this.$rootScope.isLogged =
            this.CommonsHttpServicesConstants.LOGIN_ONB;
          defer.resolve(data);
        },
        (error) => {
          this.commonRefreshUserError(error, defer);
        },
      );
    } else {
      //Primero comprobamos que el token de acceso de SF sea valido
      accessToSFParams = $.param({
        token: this.CommonsCookiesService.get(
          this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
        ),
        token_type_hint: "access_token",
      });

      //Llamada introspect
      this.getAnonymousToken()
        .then(() => {
          const anonymousAuthorizationToken: string =
            this.localStorageService.get("anonymousToken");
          return this.IbCAuthTokenProxy.getToken(
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
                  code: this.CommonsCookiesService.get(
                    this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
                  ),
                  login_type: "authorization_code",
                  scope: "soft_user",
                });
              } else {
                tokenParams = $.param({
                  grant_type: "password",
                  code: this.CommonsCookiesService.get(
                    this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
                  ),
                  login_type: "authorization_code",
                });
              }
              this.IbCAuthTokenProxy.getToken(
                this.tokenServiceURI,
                this.globalAuthorizationToken,
                tokenParams,
              ).then(
                (data) => {
                  angular.extend(SF_ACCESS_TO_TOKEN, {
                    access_to_salesforce_token: SF_ACCESS_TO_TOKEN,
                    access_token: this.CommonsCookiesService.get(
                      this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
                    ),
                  });
                  this.commonLoginUserSuccess(SF_ACCESS_TO_TOKEN, data, defer);
                },
                (error) => {
                  this.commonRefreshUserError(error, defer);
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

    return defer.promise;
  };

  commonLoginUserSuccess = (
    SF_TOKEN,
    data,
    promise?,
    updateUserInf?: boolean,
  ): void => {
    angular.extend(data, {
      access_salesforce_token: SF_TOKEN.access_token,
      access_to_salesforce_token: SF_TOKEN.access_to_salesforce_token.exp,
    });
    this.CommonsLoginUtilsService.updateRefreshToken(data, true);
    this.$rootScope.isLogged = true;
    if (updateUserInf) {
      this.localStorageService.set("reloadCustomerComplete", true);
      if (this.getMetaTagValueByName("fAppD") === "IB_PLUS") {
        this.updateStateToAnonymousRedirection().subscribe({
          complete: () => {
            this.RedirectionService.redirectToLoginPage(
              this.$location.absUrl(),
            );
          },
        });
      }
    }
    promise.resolve(data);
  };

  commonRefreshUserError = (error, promise): void => {
    promise.reject(this.processTokenError(error));
  };

  processTokenError = (error): CommonsErrorModels.GenericError => {
    const hasReason =
      error.data && error.data.errors && error.data.errors.length > 0;
    const processedError: CommonsErrorModels.GenericError = {
      message: hasReason
        ? error.data.error_description
        : "REST_SERVICE_ERROR_GENERAL",
      needsTranslate: !hasReason,
      internalErrorCode: hasReason ? error.data.error : "",
      errorCode: error.errorCode,
      originalError: error,
    };
    return processedError;
  };

  /**
   * Gets a new on business user logged token and stores the new logged token, the new refresh token and a flag to know if the current on business user
   * is logged in Session Storage. If there was and error in the http call, this method treats these http error code and returns the object to show an error in the view.
   * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
   *  When the promise rejects, it returns an object with the error data to show in the view
   */
  refreshOnBUserLoggedToken = () => {
    const defer = this.$q.defer();
    const tokenParams = $.param({
      grant_type: "refresh_token",
      refresh_token: this.CommonsCookiesService.get(
        this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN,
      ),
    });

    const loginOBUserSuccess = (data, promise) => {
      this.localStorageService.set("loggedToken", data.access_token);
      this.localStorageService.set("refreshToken", data.refresh_token);
      this.localStorageService.set(
        "userLogged",
        this.CommonsHttpServicesConstants.LOGIN_ONB,
      );
      this.CommonsLoginUtilsService.updateRefreshToken(
        data,
        true,
        this.CommonsHttpServicesConstants.LOGIN_ONB,
      );
      promise.resolve(data);
    };
    const refreshOBUserError = (error) => {
      defer.reject(this.processTokenError(error));
    };

    this.IbCAuthTokenProxy.getToken(
      this.tokenOBServiceURI,
      this.globalAuthorizationToken,
      tokenParams,
    ).then((data) => {
      loginOBUserSuccess(data, defer);
    }, refreshOBUserError);
    return defer.promise;
  };
}
