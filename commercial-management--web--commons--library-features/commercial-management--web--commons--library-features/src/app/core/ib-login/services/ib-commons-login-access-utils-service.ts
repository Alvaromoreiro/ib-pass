import * as angular from "angular";
import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsUserUtilsService } from "../../utils/ib-commons-user-utils.service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsLoginConstantsType } from "../../constants/ib-commons-login-constants";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";
import type { IbCUserStoreRepositoryService } from "../../services/stores/user-store/ib-commons-user-store-repository.service";

@Service("ib-commons-login-module", [
  "localStorageService",
  "$cookies",
  "CommonsHttpServicesConstants",
  "$rootScope",
  "CommonsLoginConstants",
  "CommonsUserUtilsService",
  "CommonsUtilService",
  "CommonsConstants",
  "IbCUserStoreRepositoryService",
])
export class CommonsLoginUtilsService {
  public COOKIES = this.CommonsHttpServicesConstants.COOKIES;
  constructor(
    private localStorageService: ng.local.storage.ILocalStorageService,
    private $cookies: ng.cookies.ICookiesService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private $rootScope: CommonsRootScope,
    private CommonsLoginConstants: CommonsLoginConstantsType,
    private CommonsUserUtilsService: CommonsUserUtilsService,
    private CommonsUtilService: CommonsUtilService,
    private CommonsConstants: CommonsConstantsType,
    private userStoreService: IbCUserStoreRepositoryService,
  ) {}

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

  setUserLoggedCookies = (
    authResponse: CommonsLoginNamespace.CommonsLoginAuthResponse,
    stateUserLogged: boolean,
  ) => {
    const expiration = new Date();
    this.localStorageService.set("loggedToken", authResponse.access_token);
    this.localStorageService.set("refreshToken", authResponse.refresh_token);

    expiration.setTime(
      expiration.getTime() +
        this.CommonsHttpServicesConstants.COOKIES.DEFAULT_EXPIRY_TIME,
    );

    this.$cookies.putObject(
      "IBERIACOM_SSO_INFO",
      {
        loggedBy: stateUserLogged,
      },
      {
        expires: expiration,
        path: this.CommonsHttpServicesConstants.COOKIES.DEFAULT_PATH,
      },
    );

    this.$cookies.put("IBERIACOM_SSO_ACCESS", authResponse.access_token, {
      expires: expiration,
      path: this.CommonsHttpServicesConstants.COOKIES.DEFAULT_PATH,
    });

    this.$cookies.put(
      "IBERIACOM_SSO_ACCESS_TO",
      this.generateTokenExpirationDateString(authResponse.expires_in),
      {
        expires: expiration,
        path: this.CommonsHttpServicesConstants.COOKIES.DEFAULT_PATH,
      },
    );

    this.$cookies.put("IBERIACOM_SSO_REFRESH", authResponse.refresh_token, {
      expires: expiration,
      path: this.CommonsHttpServicesConstants.COOKIES.DEFAULT_PATH,
    });

    this.$cookies.put(
      "IBERIACOM_SSO_REFRESH_TO",
      this.generateTokenExpirationDateString(authResponse.refresh_expires_in),
      {
        expires: expiration,
        path: this.CommonsHttpServicesConstants.COOKIES.DEFAULT_PATH,
      },
    );
  };

  /**
   * @deprecated Use the IbCUserStoreRepositoryService.logoutUser() instead
   */
  updateStateToAnonymous = (): void => {
    this.userStoreService.logoutUser();
  };

  updateRefreshToken = (
    authResponse: any,
    updateSession?: boolean,
    isONB?: string,
  ) => {
    let expiration: any = null,
      extraCookiesInfo: any = null;
    if (angular.isObject(authResponse)) {
      expiration = new Date();
      expiration.setTime(
        expiration.getTime() +
          this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_EXPIRY_TIME,
      );
      if (updateSession) {
        this.localStorageService.set(
          "loginSF",
          authResponse.access_salesforce_token,
        );
        this.localStorageService.set("userLogged", true);
        this.localStorageService.set("loggedToken", authResponse.access_token);
        this.localStorageService.set(
          "refreshToken",
          authResponse.refresh_token,
        );
        this.CommonsUtilService.getUserTypeByToken();
      }
      extraCookiesInfo = {
        expires: expiration,
        path: this.CommonsLoginConstants.SSO_COOKIES.DEFAULT_PATH,
      };
      this.$cookies.put(
        isONB === this.CommonsHttpServicesConstants.LOGIN_ONB
          ? this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN
          : this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN,
        authResponse.access_token,
        extraCookiesInfo,
      );
      this.$cookies.put(
        isONB === this.CommonsHttpServicesConstants.LOGIN_ONB
          ? this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN_EXPIRATION
          : this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN_EXPIRATION,
        this.generateTokenExpirationDateString(authResponse.expires_in),
        extraCookiesInfo,
      );
      this.$cookies.put(
        isONB === this.CommonsHttpServicesConstants.LOGIN_ONB
          ? this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN
          : this.CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN,
        authResponse.refresh_token,
        extraCookiesInfo,
      );
      this.$cookies.put(
        isONB === this.CommonsHttpServicesConstants.LOGIN_ONB
          ? this.CommonsLoginConstants.SSO_COOKIES
              .ONB_LOGGED_REFRESH_TOKEN_EXPIRATION
          : this.CommonsLoginConstants.SSO_COOKIES
              .LOGGED_REFRESH_TOKEN_EXPIRATION,
        this.generateTokenExpirationDateString(authResponse.refresh_expires_in),
        extraCookiesInfo,
      );
      if (!isONB) {
        this.$cookies.put(
          this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
          authResponse.access_salesforce_token,
          extraCookiesInfo,
        );
        this.$cookies.put(
          this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN_EXPIRATION,
          this.generateTokenExpirationDateString(
            authResponse.access_to_salesforce_token,
          ),
          extraCookiesInfo,
        );
      }
    }
  };
}
