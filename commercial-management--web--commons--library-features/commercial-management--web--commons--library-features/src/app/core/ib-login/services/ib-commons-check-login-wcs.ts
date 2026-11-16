import * as angular from 'angular';
import { CommonsUtilService } from '../../utils/ib-commons-utils-service';
import { CommonsCookiesService } from '../../utils/storage-utils/ib-commons-cookies.service';
import { CommonsLoginConstantsType } from '../../constants/ib-commons-login-constants';
import { CommonsModalService } from '../../ib-modal/services/ib-modal-service';
import { CommonsLoginUtilsService } from './ib-commons-login-access-utils-service';
import { RedirectionService } from '../../utils/ib-commons-redirection.service';

@Service('ib-commons-login-module', [
    'CommonsLoginConstants',
    'localStorageService',
    'CommonsUtilService',
    'CommonsCookiesService',
    '$window',
    '$location',
    '$filter',
    'CommonsLoginUtilsService',
    'RedirectionService'
    ])
export class CommonsCheckLoginWCSService {
    constructor (
        private CommonsLoginConstants: CommonsLoginConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private CommonsCookiesService: CommonsCookiesService,
        private $window: ng.IWindowService,
        private $location: ng.ILocationService,
        private $filter: ng.IFilterService,
        private CommonsLoginUtilsService: CommonsLoginUtilsService,
        private RedirectionService: RedirectionService
    ) {}

    generateSSOInfo = (isAnonymous?: boolean) => {
        const obLoginInfo = this.generateOBLoginInfo();
        if (obLoginInfo.isLogged) {
            return obLoginInfo;
        } else if (this.checkSFToken().userSFLogged) {
            return this.checkKeyCloakToken(true);
        } else if (isAnonymous) {
            return {
                isLogged: false,
                loggedToken: null,
                refreshToken: null,
                needsRefreshToken: false,
                error: null
            };
        } else {
            this.CommonsLoginUtilsService.updateStateToAnonymous();
            this.RedirectionService.redirectToLoginPage(this.$location.absUrl());
        }
    };

    checkSFToken = () => {
        const cookieSFAccessToken = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN
        );
        const cookieSFAccessTokenExpire = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN_EXPIRATION
        );
        const cookieSFRefreshToken = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_REFRESH_TOKEN
        );

        this.localStorageService.set('loginSF', cookieSFAccessToken);
        this.localStorageService.set('refreshSF', cookieSFRefreshToken);

        return {
            userSFLogged: angular.isDefined(cookieSFRefreshToken),
            cookieSFAccessToken: cookieSFAccessToken,
            cookieSFAccessTokenExpire: cookieSFAccessTokenExpire,
            cookieSFRefreshToken: cookieSFRefreshToken
        };
    };

    /**
   * Creates the SSO information, checking the SSO cookies. It decides if the user is logged or not, and saving the token information in
   * local storage.
   * @returns {Object}. The SSO information (if user is logged, the tokens, if there is an SSO error )
   */
    checkKeyCloakToken = (userLoggedSF?: boolean) => {
        const cookiesInformation = this.checkCookiesInformation();
        const errorCode = this.CommonsUtilService.getParameterByName(
            this.CommonsLoginConstants.URL_PARAMETERS.ERROR
        );
        if (!errorCode) {
            this.localStorageService.set(
                'loggedToken',
                cookiesInformation.cookieAccessToken
            );
            this.localStorageService.set(
                'refreshToken',
                cookiesInformation.cookieRefreshToken
            );
            this.setUserInfo();
        }
        this.localStorageService.set('userLogged', cookiesInformation.userLogged);
        return {
            isLogged: userLoggedSF ? userLoggedSF : cookiesInformation.userLogged,
            loggedToken: cookiesInformation.cookieAccessToken,
            refreshToken: cookiesInformation.cookieRefreshToken,
            needsRefreshToken: userLoggedSF
                ? this.isTokenExpired(cookiesInformation.cookieAccessTokenExpire) ||
          !cookiesInformation.cookieAccessToken
                : this.isTokenExpired(cookiesInformation.cookieAccessTokenExpire),
            error: this.generateSSOErrorMessage(errorCode)
        };
    };

    setUserInfo = () => {
        this.localStorageService.set(
            'FFUser',
            this.CommonsUtilService.getMemberIdByToken()
        );
        this.localStorageService.set(
            'tierLevel',
            this.CommonsUtilService.getTierLevelByToken()
        );
    };

    checkCookiesInformation = () => {
        const cookieAccessToken = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN
        );
        const cookieAccessTokenExpire = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN_EXPIRATION
        );
        const cookieRefreshToken = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN
        );
        const cookieRefreshTokenExpire = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.LOGGED_REFRESH_TOKEN_EXPIRATION
        );

        return {
            userLogged:
        angular.isDefined(cookieRefreshToken) &&
        !this.isTokenExpired(cookieRefreshTokenExpire),
            cookieAccessToken: cookieAccessToken,
            cookieAccessTokenExpire: cookieAccessTokenExpire,
            cookieRefreshToken: cookieRefreshToken,
            cookieRefreshTokenExpire: cookieRefreshTokenExpire
        };
    };

    /**
   * checks if the token has expired or not
   * @param {String} tokenExpiration the token expiration date in format DD/MM/YYYY HH:mm
   * @returns {Boolean} true if the tokens has espired, its token expiration date is before current date
   */
    isTokenExpired = (tokenExpiration) => {
        let ok = true;
        let tokenSplit = [];
        if (tokenExpiration) {
            tokenSplit = tokenExpiration.split('/');
            tokenExpiration =
        tokenSplit[1] + '/' + tokenSplit[0] + '/' + tokenSplit[2];
            const tokenDate = Date.parse(tokenExpiration);
            ok = tokenDate <= this.convertDateToUTC(new Date()).getTime();
        }
        return ok;
    };
    convertDateToUTC = (date) => {
        return new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        );
    };
    /**
   * Creates an application message object depending on the received error code
   * @param {String} errorCode the error code received
   * @returns {Object} an error message object.
   */
    generateSSOErrorMessage = (errorCode) => {
        let errorObject = null;
        if (errorCode) {
            errorObject = {
                message:
          this.CommonsLoginConstants.ERROR_MESSAGES[errorCode] ||
          'REST_SERVICE_ERROR_GENERAL',
                internalErrorCode: errorCode,
                errorCode: errorCode,
                needsTranslate: true
            };
        }
        return errorObject;
    };

    /**
   * Creates the On Business login information, checking the SSO ONB cookies. It decides if the user is logged with on business user or not
   * and saving the token information in local storage.
   * @returns {Object}. The SSO information (if user is logged, the tokens, if there is an SSO error )
   */
    generateOBLoginInfo = () => {
        const cookiesInformation = this.checkOnBCookiesInformation();
        const errorCode = this.CommonsUtilService.getParameterByName(
            this.CommonsLoginConstants.URL_PARAMETERS.ERROR
        );
        if (!errorCode && cookiesInformation.userLogged) {
            this.localStorageService.set(
                'loggedToken',
                cookiesInformation.cookieAccessToken
            );
            this.localStorageService.set(
                'refreshToken',
                cookiesInformation.cookieRefreshToken
            );
            this.localStorageService.set(
                'userLogged',
                this.CommonsLoginConstants.LOGIN_ONB
            );
        }
        return {
            isLogged: cookiesInformation.userLogged,
            loggedToken: cookiesInformation.cookieAccessToken,
            refreshToken: cookiesInformation.cookieRefreshToken,
            needsRefreshToken: this.isTokenExpired(
                cookiesInformation.cookieAccessTokenExpire
            ),
            error: this.generateSSOErrorMessage(errorCode)
        };
    };

    /**
   * checks the SSO cookies information and returns its value and if the user is logged or not.
   * @returns {Object} the SSO cookies values and if the user is logged or not
   */
    checkOnBCookiesInformation = () => {
        const cookieAccessToken = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN
        );
        const cookieAccessTokenExpire = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN_EXPIRATION
        );
        const cookieRefreshToken = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN
        );
        const cookieRefreshTokenExpire = this.CommonsCookiesService.getCookie(
            this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_REFRESH_TOKEN_EXPIRATION
        );

        return {
            userLogged:
        angular.isDefined(cookieRefreshToken) &&
        !this.isTokenExpired(cookieRefreshTokenExpire),
            cookieAccessToken: cookieAccessToken,
            cookieAccessTokenExpire: cookieAccessTokenExpire,
            cookieRefreshToken: cookieRefreshToken,
            cookieRefreshTokenExpire: cookieRefreshTokenExpire
        };
    };
}