/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable } from "@angular/core";
import {
  AJSRootScope,
  CommonsRootScope,
  IbCUserUtilsService,
  getSalesforceUrl,
  IbCTokenUtilsService,
  CommonsSessionStorageService,
  downgradeToAJSService,
} from "ib-web-commons/utils";
import {
  SKIP_AUTH_INTERCEPTOR,
  SKIP_HEADER_INTERCEPTOR,
  SKIP_RETRY_INTERCEPTOR,
  IbCBaseRestService,
  IbHttpResponse,
} from "ib-web-commons/proxies";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import {
  HttpContext,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import {
  IbisTokenResponse,
  IntrospectResponse,
  SalesforceTokenResponse,
} from "./ib-commons-auth.model";
import {
  Observable,
  zip,
  of,
  catchError,
  switchMap,
  tap,
  throwError,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IbCAuthService {
  private readonly globalAuthorizationToken =
    CommonsHttpServicesConstants.globalAuthorizationToken;
  public softUserChange = false;

  constructor(
    @Inject(AJSRootScope) private rootScope: CommonsRootScope,
    private commonsBaseService: IbCBaseRestService,
    private userUtilsService: IbCUserUtilsService,
    private tokenUtilsService: IbCTokenUtilsService,
    private sessionStorageService: CommonsSessionStorageService,
  ) {}

  /**
   * Check as Observable if token needs to be refreshed
   */
  needsTokenRefresh(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      observer.next(this.checkTokenNeeded());
      observer.complete();
    });
  }

  /**
   * Check if the token is needed to be refreshed, comparing the cookies expired for every use case. But if the refresh token
   * is not found, the method will return false to make the service call and logout the user.
   */
  private checkTokenNeeded(): boolean {
    if (this.userUtilsService.isUserLoggedNotONB()) {
      const needSalesforce =
        this.tokenUtilsService.getSFAccessToken() === null &&
        this.tokenUtilsService.getSFRefreshToken() !== null;
      const needIbis = this.tokenUtilsService.getKCAccessToken() === null;
      return needSalesforce || needIbis;
    } else if (this.userUtilsService.isUserLoggedONB()) {
      return (
        this.tokenUtilsService.getONBAccessToken() === null &&
        this.tokenUtilsService.getONBRefreshToken() !== null
      );
    }
    return this.tokenUtilsService.getAnonymousToken() === null;
  }

  /**
   * Generic function to refresh the tokens needed for the user logged or anonymous.
   */
  refreshNecessaryToken(): Observable<HttpEvent<unknown>> {
    if (this.userUtilsService.isUserLoggedNotONB()) {
      return this.refreshLoggedToken();
    } else if (this.userUtilsService.isUserLoggedONB()) {
      return this.refreshIbisToken();
    }
    return this.getAnonymousToken();
  }

  /**
   * Generic function to refresh the tokens needed for the user logged or anonymous.
   */
  revokeNecessaryToken(): Observable<unknown> {
    if (this.userUtilsService.isUserLoggedNotONB()) {
      return zip([
        this.revokeIbisToken().pipe(catchError(() => of(null))),
        this.revokeSalesforceToken().pipe(catchError(() => of(null))),
      ]);
    }
    return of(null);
  }

  /**
   * Refresh the token for Iberia and Iberia Plus Users, only the needed tokens.
   */
  refreshLoggedToken(): Observable<IbHttpResponse<IbisTokenResponse>> {
    const sfToken = this.tokenUtilsService.getSFAccessToken();

    if (sfToken) {
      return this.refreshIbisToken();
    }
    return this.getAnonymousToken().pipe(
      switchMap(() => this.getSalesforceAccessToken()),
      switchMap(() => this.introspectSalesforce()),
      tap(() => {
        if (!this.userUtilsService.isSoftUser() && !this.softUserChange) {
          this.userUtilsService.setSoftUser(true);
          this.softUserChange = true;
        }
      }),
      switchMap(() => this.refreshIbisToken()),
    );
  }

  /**
   * Refresh keycloack (AGL) tokens for the logged users.
   */
  refreshIbisToken() {
    if (this.userUtilsService.isUserLoggedONB()) {
      return this.getLoggedONBToken();
    }
    return this.getAccessIbisToken();
  }

  /**
   * Get a new access token ONB users
   */
  getLoggedONBToken() {
    const onbURI = CommonsHttpServicesConstants.tokenOBServiceURI;
    const refreshToken =
      this.tokenUtilsService.getONBRefreshToken() ?? "not_found";

    return this.commonsBaseService
      .post<IbisTokenResponse>(
        onbURI,
        new HttpParams({
          fromObject: {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
        }),
        {
          headers: {
            Authorization: this.globalAuthorizationToken,
          },
          context: new HttpContext()
            .set(SKIP_AUTH_INTERCEPTOR, true)
            .set(SKIP_RETRY_INTERCEPTOR, true),
        },
      )
      .pipe(
        tap((value) => {
          this.tokenUtilsService.setONBAccessToken(value.body.access_token, {
            expires: this.getTokenExpirationDate(value.body.expires_in),
          });
          this.tokenUtilsService.setONBAccessTokenExpiration(
            this.generateTokenExpirationDateString(value.body.expires_in),
            { expires: this.getTokenExpirationDate(value.body.expires_in) },
          );
          this.tokenUtilsService.setONBRefreshToken(value.body.refresh_token, {
            expires: this.getTokenExpirationDate(value.body.refresh_expires_in),
          });
          this.tokenUtilsService.setONBRefreshTokenExpiration(
            this.generateTokenExpirationDateString(
              value.body.refresh_expires_in,
            ),
            {
              expires: this.getTokenExpirationDate(
                value.body.refresh_expires_in,
              ),
            },
          );
          this.userUtilsService.setUserLoggedONB();
          /** OLD ANGULARJS STATE */
          this.sessionStorageService.set(
            "loggedToken",
            value.body.access_token,
          );
          this.sessionStorageService.set(
            "refreshToken",
            value.body.refresh_token,
          );
        }),
      );
  }

  /**
   * Get a new access token for user (not ONB users).
   */
  getAccessIbisToken() {
    const userUri = CommonsHttpServicesConstants.tokenServiceURI;
    const body: Record<string, string> = {
      grant_type: "password",
      code: this.tokenUtilsService.getSFAccessToken() ?? "not_found",
      login_type: "authorization_code",
    };

    if (this.userUtilsService.isSoftUser()) {
      body.scope = "soft_user";
    }

    return this.commonsBaseService
      .post<IbisTokenResponse>(
        userUri,
        new HttpParams({
          fromObject: body,
        }),
        {
          headers: {
            Authorization: this.globalAuthorizationToken,
          },
          context: new HttpContext()
            .set(SKIP_AUTH_INTERCEPTOR, true)
            .set(SKIP_RETRY_INTERCEPTOR, true),
        },
      )
      .pipe(
        tap((value) => {
          this.tokenUtilsService.setKCAccessToken(value.body.access_token, {
            expires: this.getTokenExpirationDate(value.body.expires_in),
          });
          this.tokenUtilsService.setKCAccessTokenExpiration(
            this.generateTokenExpirationDateString(value.body.expires_in),
            { expires: this.getTokenExpirationDate(value.body.expires_in) },
          );
          this.tokenUtilsService.setKCRefreshToken(value.body.refresh_token, {
            expires: this.getTokenExpirationDate(value.body.refresh_expires_in),
          });
          this.tokenUtilsService.setKCRefreshTokenExpiration(
            this.generateTokenExpirationDateString(
              value.body.refresh_expires_in,
            ),
            {
              expires: this.getTokenExpirationDate(
                value.body.refresh_expires_in,
              ),
            },
          );
          this.userUtilsService.setUserLogged(true);
          const userType = this.tokenUtilsService.getUserTypeFromToken();
          if (userType) {
            this.rootScope.userTypeIberia = userType;
            this.userUtilsService.setUserRole(userType);
          }
          /** OLD ANGULARJS STATE */
          this.sessionStorageService.set(
            "loggedToken",
            value.body.access_token,
          );
          this.sessionStorageService.set(
            "refreshToken",
            value.body.refresh_token,
          );
          this.sessionStorageService.set(
            "FFUser",
          this.tokenUtilsService.getFrequentFlyerFromToken() as string // TODO fix from ts upgrade

          );
        }),
      );
  }

  /**
   * Get salesforce access token, with the refresh token. Use normally to pass to permanent user.
   */
  getSalesforceAccessToken() {
    const sfAccessTokenUri =
      CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI;
    const anonymousToken =
      this.tokenUtilsService.getAnonymousToken() ?? "not_available";

    const body = {
      grant_type: "refresh_token",
      refresh_token: this.tokenUtilsService.getSFRefreshToken() ?? "not_found",
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${anonymousToken}`,
    });

    return this.commonsBaseService
      .post<SalesforceTokenResponse>(
        sfAccessTokenUri,
        new HttpParams({
          fromObject: body,
        }),
        {
          headers,
          context: new HttpContext()
            .set(SKIP_HEADER_INTERCEPTOR, true)
            .set(SKIP_RETRY_INTERCEPTOR, true),
        },
      )
      .pipe(
        tap((value) => {
          this.tokenUtilsService.setSFAccessToken(value.body.access_token);
          this.sessionStorageService.set("loginSF", value.body.access_token);
        }),
      );
  }

  /**
   * Call introspect service to check if token is still valid
   */
  introspectSalesforce() {
    const introspectTokenUri =
      CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI;
    const anonymousToken =
      this.tokenUtilsService.getAnonymousToken() ?? "not_available";

    const body = {
      token: this.tokenUtilsService.getSFAccessToken() ?? "not_found",
      token_type_hint: "access_token",
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${anonymousToken}`,
    });

    return this.commonsBaseService
      .post<IntrospectResponse>(
        introspectTokenUri,
        new HttpParams({
          fromObject: body,
        }),
        {
          headers,
          context: new HttpContext()
            .set(SKIP_HEADER_INTERCEPTOR, true)
            .set(SKIP_RETRY_INTERCEPTOR, true),
        },
      )
      .pipe(
        tap((value) => {
          if (value.body.exp && value.body.iat) {
            const accessToken = this.tokenUtilsService.getSFAccessToken();
            if (accessToken !== null) {
              this.tokenUtilsService.setSFAccessToken(accessToken, {
                expires: this.getTokenExpirationDate(
                  value.body.exp - value.body.iat,
                ),
              });
            }
            this.tokenUtilsService.setSFAccessTokenExpiration(
              this.generateTokenExpirationDateString(
                value.body.exp - value.body.iat,
              ),
              {
                expires: this.getTokenExpirationDate(
                  value.body.exp - value.body.iat,
                ),
              },
            );
          }
          if (
            !value.body.active &&
            !this.userUtilsService.isSoftUser() &&
            !this.softUserChange
          ) {
            this.userUtilsService.setSoftUser(true);
            this.softUserChange = true;
          }
        }),
      );
  }

  /**
   * Get a new anonymous token
   */
  getAnonymousToken() {
    const anonymousTokenUri = CommonsHttpServicesConstants.tokenServiceURI;

    const body = {
      grant_type: "client_credentials",
    };

    return this.commonsBaseService
      .post<IbisTokenResponse>(
        anonymousTokenUri,
        new HttpParams({
          fromObject: body,
        }),
        {
          headers: {
            Authorization: this.globalAuthorizationToken,
          },
          context: new HttpContext()
            .set(SKIP_AUTH_INTERCEPTOR, true)
            .set(SKIP_RETRY_INTERCEPTOR, true),
        },
      )
      .pipe(
        tap((value) => {
          this.tokenUtilsService.setAnonymousToken(value.body.access_token);
        }),
      );
  }

  /**
   * Revokes the authorization for a ibis token
   * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/39845927/Logout+Service
   */
  revokeIbisToken() {
    const revokeTokenURI = CommonsHttpServicesConstants.revokeTokenServiceURI;
    const refreshToken = this.tokenUtilsService.getKCRefreshToken();
    if (!refreshToken) return throwError(() => "TOKEN_ERROR");
    const ibisGlobalAuthToken =
      CommonsHttpServicesConstants.globalAuthorizationToken?.replace(
        "Basic ",
        "",
      ) ?? "Tk9UX0ZPVU5EOk5PVF9GT1VORA==";
    const [client_id, client_secret] = window
      .atob(ibisGlobalAuthToken)
      .split(":");

    const body = {
      refresh_token: refreshToken,
      client_id,
      client_secret,
    };

    return this.commonsBaseService.post<undefined>(
      revokeTokenURI,
      new HttpParams({
        fromObject: body,
      }),
      {
        context: new HttpContext()
          .set(SKIP_AUTH_INTERCEPTOR, true)
          .set(SKIP_RETRY_INTERCEPTOR, true),
      },
    );
  }

  /**
   * Revokes the authorization for salesforce token
   * @see https://help.salesforce.com/s/articleView?id=sf.remoteaccess_revoke_token.htm&type=5
   * @returns The response of the revoke token service
   */
  revokeSalesforceToken() {
    const salesforceRevokeTokenURI =
      getSalesforceUrl() +
      CommonsHttpServicesConstants.SALESFORCE_TOKEN.logoutURI;
    const refreshToken = this.tokenUtilsService.getSFRefreshToken();
    if (!refreshToken) return throwError(() => "TOKEN_ERROR");

    const body = {
      token: refreshToken,
    };

    return this.commonsBaseService.post<undefined>(
      salesforceRevokeTokenURI,
      new HttpParams({
        fromObject: body,
      }),
      {
        context: new HttpContext()
          .set(SKIP_HEADER_INTERCEPTOR, true)
          .set(SKIP_RETRY_INTERCEPTOR, true),
      },
    );
  }

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
}

downgradeToAJSService(
  "IbCAuthService",
  IbCAuthService,
  "ib-commons-http-service-module",
);
