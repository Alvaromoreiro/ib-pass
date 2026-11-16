import { CommonsBrowserStorageService } from './storage-utils/ib-commons-browser-storage.service';
import { downgradeToAJSService } from './ib-commons-angularjs-utils';
import { Inject, Injectable } from '@angular/core';
import { CommonsSessionStorageService } from './storage-utils/ib-commons-session-storage.service';
import { CommonsHttpServicesConstants, CommonsLoginConstants, CommonsConstants } from 'ib-web-commons/constants';
import { CommonsCookiesService } from './storage-utils/ib-commons-cookies.service';
import { AJSRootScope, CommonsRootScope } from './ajs-upgrade/ib-commons-root-scope-bridge';
import { IbCardRole, JWTAccessTokenInformation } from 'ib-web-commons/models';
import { JwtPayload, SetCookiesConfig } from './storage-utils/ib-storage-utils.model';

@Injectable({
    providedIn: 'root'
})
export class IbCTokenUtilsService {

    private readonly SESSION_STORAGE_LOGGED_KEY = 'userLogged';

    constructor (
        protected sessionStorageService: CommonsSessionStorageService,
        protected browserStorageService: CommonsBrowserStorageService,
        protected commonsCookiesService: CommonsCookiesService,
        @Inject(AJSRootScope) protected rootScope: CommonsRootScope
    ) {}

    getAuthToken (): string | null {
        const userLogged = this.sessionStorageService.get(this.SESSION_STORAGE_LOGGED_KEY);
        if (userLogged === true) {
            return this.getKCAccessToken();
        } else if (userLogged === CommonsHttpServicesConstants.LOGIN_ONB) {
            return this.getONBAccessToken();
        }
        return this.getAnonymousToken();
    }

    getAuthRefreshToken (): string | null {
        const userLogged = this.sessionStorageService.get(this.SESSION_STORAGE_LOGGED_KEY);
        if (userLogged === true) {
            return this.getKCRefreshToken();
        } else if (userLogged === CommonsHttpServicesConstants.LOGIN_ONB) {
            return this.getONBRefreshToken();
        }
        return null;
    }

    getSFAccessToken (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN);
    }

    setSFAccessToken (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN, value, config);
    }

    getSFAccessTokenExpiration (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN_EXPIRATION);
    }

    setSFAccessTokenExpiration (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN_EXPIRATION, value, config);
    }

    getSFRefreshToken (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_TOKEN);
    }

    setSFRefreshToken (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_TOKEN, value, config);
    }

    getKCAccessToken (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN);
    }

    getKCAccessTokenExpiration (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN_EXPIRATION);
    }

    setKCAccessToken (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN, value, config);
    }

    setKCAccessTokenExpiration (value: string, config?: SetCookiesConfig): void {
        return this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN_EXPIRATION, value, config);
    }

    getKCRefreshToken (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN);
    }

    getKCRefreshTokenExpiration (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN_EXPIRATION);
    }

    setKCRefreshToken (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN, value, config);
    }

    setKCRefreshTokenExpiration (value: string, config?: SetCookiesConfig): void {
        return this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN_EXPIRATION, value, config);
    }

    getONBAccessToken (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN);
    }

    getONBAccessTokenExpiration (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN_EXPIRATION);
    }

    setONBAccessToken (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN, value, config);
    }

    setONBAccessTokenExpiration (value: string, config?: SetCookiesConfig): void {
        return this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN_EXPIRATION, value, config);
    }

    getONBRefreshToken (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN);
    }

    getONBRefreshTokenExpiration (): string | null {
        return this.commonsCookiesService.get(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN_EXPIRATION);
    }

    setONBRefreshToken (value: string, config?: SetCookiesConfig): void {
        this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN, value, config);
    }

    setONBRefreshTokenExpiration (value: string, config?: SetCookiesConfig): void {
        return this.commonsCookiesService.set(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN_EXPIRATION, value, config);
    }

    getAnonymousToken (): string | null {
        return this.sessionStorageService.get('anonymousToken');
    }

    setAnonymousToken (token: string): void {
        this.sessionStorageService.set('anonymousToken', token);
    }

    public isAnonymousTokenExpired (): boolean | undefined {
        const token = this.getAnonymousToken();
        const key = 'exp';

        if (!token) return;

        const parts = token.split('.');
        if (parts.length !== 3) return;

        const payload = JSON.parse(atob(parts[1])) as JwtPayload;

        const expiration = payload[key];
        if (typeof expiration !== 'number') return;

        const currentTimestamp = Math.floor(Date.now() / 1000);

        return currentTimestamp > expiration;
    }


    deleteLoggedTokens (): void {
        /** Salesforce tokens */
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN_EXPIRATION);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_TOKEN);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_EXPIRATION);

        /** Iberia tokens */
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN_EXPIRATION);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN_EXPIRATION);

        /** ONB tokens */
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN_EXPIRATION);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN);
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN_EXPIRATION);
    }

    getTokenInformation = <T = Record<string, unknown>>(token?: string | null): T | null => {
        const base64Url = token?.split('.')[1];
        if (!base64Url) {
            return null;
        }
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('')
            .map((char) => {
                return `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`;
            })
            .join(''));
        return JSON.parse(jsonPayload) as T;
    };

    getAccessTokenInformation = () : JWTAccessTokenInformation | null => {
        const cookieLoggedToken = this.commonsCookiesService.get<string>(CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN)
            ?? this.sessionStorageService.get('loggedToken')
            ?? this.sessionStorageService.get('accessToken', { withPrefix: false });
        return cookieLoggedToken ? this.getTokenInformation<JWTAccessTokenInformation>(cookieLoggedToken) : null;
    };

    getRefreshTokenInformation = () : JWTAccessTokenInformation | null => {
        const cookieLoggedToken = this.commonsCookiesService.get<string>(CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN)
            ?? this.sessionStorageService.get('refreshToken');
        return cookieLoggedToken ? this.getTokenInformation<JWTAccessTokenInformation>(cookieLoggedToken) : null;
    };

    /**
     * The sub field is the Frequent Flyer for Iberia Plus or the account identifier for IB0.
     */
    getFrequentFlyerFromToken = () : string | null => {
        return this.getAccessTokenInformation()?.sub ?? this.getRefreshTokenInformation()?.sub ?? null;
    };

    getUserTypeFromToken (): string | null {
        const roles = this.getAccessTokenInformation()?.realm_access.roles;
        let userType = null;
        if (roles?.includes(CommonsConstants.ROLE_IBERIA)) {
            userType = CommonsConstants.ROLE_IBERIA;
        } else if (roles?.includes(CommonsConstants.ROLE_IBERIA_PLUS)) {
            userType = CommonsConstants.ROLE_IBERIA_PLUS;
        }
        return userType;
    }

    getTierLevelFromToken (): IbCardRole | null {
        const roles = this.getAccessTokenInformation()?.realm_access.roles;
        const tierLevel = roles?.find((el) => el.startsWith(CommonsConstants.ROLE_CARD_PAT));
        return tierLevel?.split(CommonsConstants.ROLE_CARD_PAT)[1] as IbCardRole ?? null;
    }
}

downgradeToAJSService('IbCTokenUtilsService', IbCTokenUtilsService, 'ib-commons-utils-module');