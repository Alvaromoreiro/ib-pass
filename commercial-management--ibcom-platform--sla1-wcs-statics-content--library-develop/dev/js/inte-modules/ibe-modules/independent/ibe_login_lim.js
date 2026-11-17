import { getQuerystrParams, redirectByQuadrigam } from '../general/ibe_inte-util';
import { logoutIBPlusService, getMemberData, generateLoginEvent } from '../manage/ibe_logged-service';
import { deleteloggedcookies, getDateFormat } from '../manage/ibe_common';
import { callService } from '../manage/ibe_anonymous-services';
import {
    hasWhitelistedPartnersDomain, loginExternalPartnerService, retrieveStateInfo,
    sendHotelCarsInfo, onIberiaPlusOmnichannelPartnerLogin,
    onIberiaPlusWineClubPartnerLogin, onIberiaZeroOmniChannelPartnerLogin,
    onIberiaZeroWineClubPartnerLogin, hasReferralUrlSameDomain,
} from '../general/ibe_login';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from '../manage/SessionStorage';
import * as LocalStorage from '../manage/ibe-local-storage';

let {
    localeg, marketg, keyCloakTokenEndPoint, keyCloakLoginClientId, keyCloakAuthEndPoint, keyCloakRegisterEndPoint
} = retrieveGlobalVariables();
const storageErrorIBPLUSkey = 'ibplus-login-error';
const storageIdentityState = 'ib-identity-stateReferral';
const verifierStorageKey = 'pkce_verifier';
const stateStorageKey = 'state';

const getSessionStorageValue = (storageKey) => {
    try {
        return SessionStorage.get(storageKey);
    } catch {
        return null;
    }
};

const removeSessionStorageValue = (storageKey) => {
    try {
        SessionStorage.remove(storageKey);
    } catch {
        return false;
    }
    return true;
};

const clearLoginErrorState = () => {
    [storageIdentityState, verifierStorageKey, stateStorageKey].forEach((storageKey) => {
        removeSessionStorageValue(storageKey);
    });
};

const setSessionStorageError = (type) => {
    try {
        SessionStorage.set(storageErrorIBPLUSkey, type);
    } catch {
        return false;
    }
    return true;
};

const createSanitizedLoginError = (errorType) => {
    const callbackError = new Error('Se produjo un error durante la autenticación');
    callbackError.responseJSON = { error: errorType };
    return callbackError;
};

const isLogado = () => {
    let accessToken; let accessTokenExpire; let refreshTokenTxt; let refreshTokenExpire; 
    let accessTokenSalesforce; let accessTokenExpireSalesforce; let refreshTokenSalesforce;
    let userLogged = false;
    let userType = null;
    let accesTokenSF; let accessTokenSFExpire; let refreshTokenSF;
    let refreshTokenSFExpire, isSoftUser = false;

    const hasAccessCookie = !!Cookies.get('IBERIACOM_SSO_ACCESS');
    const hasAccessToCookie = !!Cookies.get('IBERIACOM_SSO_ACCESS_TO');
    const hasRefreshCookie = !!Cookies.get('IBERIACOM_SSO_REFRESH');
    const hasRefreshToCookie = !!Cookies.get('IBERIACOM_SSO_REFRESH_TO');

    accessToken = hasAccessCookie ? Cookies.get('IBERIACOM_SSO_ACCESS') : null;
    accessTokenExpire = hasAccessToCookie ? Cookies.get('IBERIACOM_SSO_ACCESS_TO') : null;
    refreshTokenTxt = hasRefreshCookie ? Cookies.get('IBERIACOM_SSO_REFRESH') : null;
    refreshTokenExpire = hasRefreshToCookie ?Cookies.get('IBERIACOM_SSO_REFRESH_TO') : null;
    accesTokenSF = hasAccessCookie ? Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE') : null;

    userType = accessToken ? 'IBPLUS' : null;
    userType = Cookies.get('IBERIACOM_SSO_TYPE') === 'IBZERO' ? 'IBZERO' : userType;
    isSoftUser = false;

    userLogged = (userType === 'IBPLUS' || userType === 'IBZERO') && refreshTokenTxt !== null && refreshTokenTxt !== undefined;

    return {
        userLogged,
        userType,
        accessToken,
        accesTokenSF,
        accessTokenExpire,
        accessTokenSFExpire,
        refreshTokenSF,
        refreshTokenSFExpire,
        refreshTokenTxt,
        refreshTokenExpire,
        accessTokenSalesforce,
        accessTokenExpireSalesforce,
        refreshTokenSalesforce,
        isSoftUser,
    };
};

const getCustomerDataSession = () => {
    const isLogged = isLogado();
    if (isLogged.userLogged) {
        if (isLogged.userType === 'OB') return SessionStorage.get('customerDataOB');
        if (isLogged.userType === 'IBZERO') return SessionStorage.get('customerDataZero');
        return SessionStorage.get('customerData');
    }
    return null;
};

const setLoginParams = (payload) => {
    const deferred = $.Deferred();
    const isLogged = isLogado();
    const isObject = payload !== null && typeof payload === 'object';
    const validPayload = isObject
                        && Object.hasOwn(payload, 'access_token') && typeof payload.access_token === 'string'
                        && Object.hasOwn(payload, 'expires_in') && typeof payload.expires_in === 'number'
                        && Object.hasOwn(payload, 'refresh_expires_in') && typeof payload.refresh_expires_in === 'number'
                        && Object.hasOwn(payload, 'refresh_token') && typeof payload.refresh_token === 'string';

    if (!validPayload) {
        deferred.reject(new Error('Payload inválido'));
        return deferred.promise();
    }

    $.ajax({ method: 'GET', url: '/cs/Satellite', data: { pagename: 'IB_SE/CacheControl0s/Integration/logOut' }}); // TODO: es necesario

    const isHttps = window.location.protocol === 'https:';
    const now = Date.now();
    const accessExpireAt = now + (payload.expires_in > 0 ? payload.expires_in * 1000 : 3600 * 1000);
    const refreshExpireAt = now + (payload.refresh_expires_in > 0 ? payload.refresh_expires_in * 1000 : 86400000);

    const buildCookie = (name, value, expiresAt) => {
        const securePart = isHttps ? '; Secure' : '';
        return `${name}=${value}; path=/; expires=${new Date(expiresAt).toGMTString()}; SameSite=Lax${securePart}`;
    };

    document.cookie = buildCookie('IBERIACOM_SSO_ACCESS', payload.access_token, accessExpireAt);
    document.cookie = buildCookie('IBERIACOM_SSO_ACCESS_TO', getDateFormat(accessExpireAt, true), accessExpireAt);
    document.cookie = buildCookie('IBERIACOM_SSO_REFRESH', payload.refresh_token, refreshExpireAt);
    document.cookie = buildCookie('IBERIACOM_SSO_REFRESH_TO', getDateFormat(refreshExpireAt, true), refreshExpireAt);
    document.cookie = buildCookie('IBERIACOM_SSO_ACCESS_SALESFORCE', payload?.['x-salesforce-token'], refreshExpireAt);
    document.cookie = buildCookie('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', getDateFormat(refreshExpireAt, true), refreshExpireAt);
    SessionStorage.set('accessTokenSalesforce', payload?.['x-salesforce-token']);
    try {
        const tokenPart = payload.access_token.split('.')[1];
        if (tokenPart) {
            const token = JSON.parse(atob(tokenPart));
            const roles = token?.realm_access?.roles;
            if (Array.isArray(roles) && roles.length > 0) {
                const ssoType = roles.includes('ROLE_IBERIA_ZERO') ? 'IBZERO' : 'IBPLUS';
                document.cookie = buildCookie('IBERIACOM_SSO_TYPE', ssoType, refreshExpireAt); // TODO: antes se usaba refreshSF
            }
        }
    } catch (error) {
        console.warn('No se pudo decodificar el access_token', error);
    }

    if (isLogged?.isSoftUser) {
        LocalStorage.set('IB_PERMANENT_LOGIN', 'true');
        SessionStorage.remove('retrieveMemberDetailV2');
    }
    SessionStorage.set('accessToken', payload.access_token);
    SessionStorage.remove('anonymousToken');
    console.log('cookies seteadas')
    deferred.resolve();
    return deferred.promise();
};

/**
*  Function calls to salesforce to get information about token expiration and calls to
*   keycloack to get token
* reject: User weren't logged in
*/
const loginIBPlusLimService = () => {
    function base64UrlEncode(value) {
        const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
        let binary = '';
        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    function generateCodeVerifier() {
        const randomBytes = new Uint8Array(32);
        window.crypto.getRandomValues(randomBytes);
        return base64UrlEncode(randomBytes);
    }

    function generateState() {
        const randomBytes = new Uint8Array(32);
        window.crypto.getRandomValues(randomBytes);
        return base64UrlEncode(randomBytes);
    }

    async function generateCodeChallenge(verifier) {
        const verifierBytes = new TextEncoder().encode(verifier);
        const hash = await window.crypto.subtle.digest(
            'SHA-256',
            verifierBytes,
        );
        return base64UrlEncode(hash);
    }

    async function initKeycloakForm(url, layout) {
        try {
            const verifier = generateCodeVerifier();
            const state = generateState();
            const challenge = await generateCodeChallenge(verifier);
            SessionStorage.set(verifierStorageKey, verifier);
            SessionStorage.set(stateStorageKey, state);
            const authorizationUrl = new URL(url);
            authorizationUrl.searchParams.set('client_id', keyCloakLoginClientId);
            authorizationUrl.searchParams.set('response_type', 'code');
            authorizationUrl.searchParams.set('scope', 'openid');
            authorizationUrl.searchParams.set('redirect_uri', window.location.origin + window.location.pathname);
            authorizationUrl.searchParams.set('code_challenge', challenge);
            authorizationUrl.searchParams.set('code_challenge_method', 'S256');
            authorizationUrl.searchParams.set('state', state);
            authorizationUrl.searchParams.set('kc_locale', localeg);
            authorizationUrl.searchParams.set('lim_market', marketg);
            if (layout) {
                authorizationUrl.searchParams.set('lim_layout', layout);
            }

            window.location.replace(authorizationUrl.toString());
        } catch {
            throw createSanitizedLoginError('pkce_init_error');
        }
    }

    const isValidCallbackState = (callbackState, storedState) => (
        typeof callbackState === 'string'
        && callbackState.length > 0
        && typeof storedState === 'string'
        && storedState.length > 0
        && callbackState === storedState
);

    const deferred = $.Deferred();
    const urlParams = getQuerystrParams();

    if (typeof (urlParams.language) === 'string' && urlParams.language.length > 0) {
        // TODO:urlRegisterSalesforce = urlRegisterSalesforce+'?language='+`${urlParams.language}`;
    }
    if ((typeof (urlParams.error) === 'string' && urlParams.error.length > 0)
            || (typeof (urlParams.error_description) === 'string' && urlParams.error_description.length > 0)) {
        deferred.reject(createSanitizedLoginError('callback_error'));
    } else if (typeof (urlParams.step) === 'string' && urlParams.step === 'initLogin') {
        const layout = urlParams.layout || undefined;
        initKeycloakForm(keyCloakAuthEndPoint, layout).catch((error) => {
            deferred.reject(error);
        });
    } else if (typeof (urlParams.step) === 'string' && urlParams.step === 'initRegister') {
        initKeycloakForm(keyCloakRegisterEndPoint).catch((error) => {
            deferred.reject(error);
        });
    } else if (typeof (urlParams.code) === 'string' && urlParams.code.length > 0) {
        const verifier = getSessionStorageValue(verifierStorageKey);
        const storedState = getSessionStorageValue(stateStorageKey);
        if (!verifier || typeof verifier !== 'string'
            || !isValidCallbackState(urlParams.state, storedState)) {
            deferred.reject(createSanitizedLoginError('security_error'));
        } else {
            const headers = {
                'Content-type': 'application/x-www-form-urlencoded',
            };
            const params = {
                grant_type: 'authorization_code',
                code: decodeURIComponent(urlParams.code),
                redirect_uri: window.location.origin + window.location.pathname,
                client_id: keyCloakLoginClientId,
                code_verifier: verifier,
            };
            callService(keyCloakTokenEndPoint, headers, params, 'POST')
                .then(setLoginParams)
                .then(() => deferred.resolve())
                .catch(() => deferred.reject(createSanitizedLoginError('token_exchange_error')))
                .always(() => {
                    removeSessionStorageValue(verifierStorageKey);
                    removeSessionStorageValue(stateStorageKey);
                });
        }
    } else if (typeof (urlParams.externalpartner) === 'string' && urlParams.externalpartner.length > 0) {
        if (urlParams.referralURL && !hasWhitelistedPartnersDomain(decodeURIComponent(urlParams.referralURL))) {
            window.location.href = '/';
        } else {
            SessionStorage.set(storageIdentityState, {
                externalObj: {
                    externalPartner: urlParams.externalpartner,
                    sessionId: urlParams.sessionId,
                    referralURL: (urlParams.referralURL)? decodeURIComponent(urlParams.referralURL): undefined,
                },
            });

            if (urlParams.externalpartner === 'ib_register_wineclub') {
                // TODO:window.location.href = `${urlRegisterSalesforce}`;
            } else if (urlParams.externalpartner === 'ibplustore') {
                // TODO:window.location.href = `${urlLoginSalesforce}01?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
            } else {
                // TODO:window.location.href = `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
            }
        }
    } else {
        const referralURL = (typeof (urlParams.referralURL) === 'string') ? decodeURIComponent(urlParams.referralURL) : '';
        const sameDomain = hasReferralUrlSameDomain(referralURL);

        if (!sameDomain) {
            window.location.href = '/';
        } else {
            SessionStorage.set(storageIdentityState, {referralURL});
        // TODO:window.location.href = `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
        }
    }
    return deferred.promise();
};

/**
 * Main method to do login in Iberia after salesforce sucessful login
 * @return {*}
 */
function loginIBPlusLim() {
    const deferred = $.Deferred();
    const isLogged = isLogado();
    const urlParams = getQuerystrParams();

    const loginSuccess = () => {
        let form;
        let externalURL;
        const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
        const refreshCookie = Cookies.get('IBERIACOM_SSO_REFRESH');
        // Tracking login success
        const eventData = {
            eventName: 'interaccion',
            eventCategory: 'intento de login',
            eventAction: 'clic',
            eventLabel: 'login ok',
        };
        if (typeof (window.DigitalChange) !== 'undefined') {
            window.DigitalChange('interaction', eventData);
        }
        if (typeof (window.dataLayer) !== 'undefined') {
            window.dataLayer.push(eventData, { event: 'interaction' });
        }

        getMemberData(accessCookie, `${localeg}-${marketg}`, isLogado().userType)
            .done(() => {
                const customerData = getCustomerDataSession();
                const state = retrieveStateInfo(urlParams.state);
                const expDate = new Date(decodeURIComponent(isLogged.accessTokenExpire));
                const jsonSessionlogged = {
                    first_name: customerData.name,
                    last_name: customerData.surname,
                };

                const jsonStringSession = JSON.stringify(jsonSessionlogged);
                const splitted = window.location.hostname.split('.');

                Cookies.set('IBERIACOM_SSO_SESION', btoa(jsonStringSession), {
                    domain: `.${splitted.slice(splitted.length - 2).join('.')}`,
                    path: '/',
                    expires: expDate,
                    sameSite: 'strict',
                });

                // redireccion RRSS login params SalesForce
                const stateSF = state.referralURL;
                let paramsSF = {};

                try {
                    const url = new URL(stateSF);
                    paramsSF = Object.fromEntries(new URLSearchParams(url.search));
                } catch {
                    paramsSF = Object.fromEntries(new URLSearchParams(stateSF));
                }

                const {rrss} = paramsSF;
                /** @type {'1' | '2' | '3' | '4' | null } */
                const {typerrss} = paramsSF;
                const registerByTyperrss = {
                    1: 'zero',
                    2: 'plus',
                };
                /** @type {'plus' | 'zero' | null } */
                const registerParamState = paramsSF.register ?? registerByTyperrss[typerrss];

                // locale-market del registro
                marketg = paramsSF.market ?? marketg;
                localeg = paramsSF.language ?? localeg;

                const universia = paramsSF.partner;
                const { invitationCode } = paramsSF;
                const upgradeKO = paramsSF.UpgradeKO;
                const upgradeOK = paramsSF.UpgradeOK;
                const {registroClub} = paramsSF;

                let referral = state.referralURL;

                if (rrss != null && rrss === 'true') {
                    referral = localStorage.getItem('returnURL') ?? state.referralURL;
                }

                // leemos y borramos session returnURL
                localStorage.removeItem('returnURL');

                if (isLogado().userType === 'IBPLUS') {
                    if (customerData.parentalControl) {
                        if (state) {
                            const params = getQuerystrParams(referral);
                            if (Object.keys(params).length === 3
                  && params.invitationID && params.memberID && params.type) {
                                SessionStorage.set('ib-plus-app.nomination', params);
                                const referralURLClean = decodeURIComponent(referral).split('?')[0];
                                window.location = referralURLClean;
                            } else if (state.externalPartner && state.externalPartner.length > 0) {
                                // eslint-disable-next-line prefer-destructuring
                                const externalPartner = state.externalPartner;
                                switch (externalPartner) {
                                        case 'ibplustore':
                                            externalURL = $('[data-ibplustore-url]').data('ibplustore-url');
                                            // Send token to iberiaplustore
                                            form = $('<form>', { method: 'POST', action: `${externalURL}auth/ib`, class: 'hidden' });
                                            form.append($('<input>', { name: 'tokenIB', value: accessCookie }));
                                            deleteloggedcookies();
                                            $('body').append(form);
                                            form.submit();
                                            break;
                                        case 'ib_omnichannel_eva':
                                            onIberiaPlusOmnichannelPartnerLogin({ referralURL: referral });
                                            break;
                                        case 'ib_dig_wineclub':
                                            onIberiaPlusWineClubPartnerLogin({ referralURL: referral });
                                            break;
                                        case 'ib_register_wineclub':
                                            onIberiaPlusWineClubPartnerLogin({ referralURL: referral });
                                            break;
                                        case 'aviosandmoney':
                                            // dFrontJs.ibe_loading.open('body');
                                            sendHotelCarsInfo();
                                            break;
                                        case 'pgt':
                                            externalURL = $('[data-ptg-url]').data('ptg-url');
                                            const prmPTG = $.param({ partner: 'ib', sessionId: state.sessionId });
                                            form = $('<form>', { method: 'POST', action: `${externalURL}?${prmPTG}`, class: 'hidden' });
                                            form.append($('<input>', { name: 'accessToken', value: accessCookie }))
                                                .append($('<input>', { name: 'refreshToken', value: refreshCookie }));
                                            $('body').append(form);
                                            form.submit();
                                            break;
                                        case 'eci':

                                            externalURL = $('[data-eci-url]').data('eci-url');
                                            // Send token to iberiaplustore
                                            form = $('<form>', { method: 'POST', action: `${externalURL}`, class: 'hidden' });
                                            form.append($('<input>', { name: 'access_token', value: accessCookie }));
                                            form.append($('<input>', { name: 'refresh_token', value: refreshCookie }));
                                            form.append($('<input>', { name: 'externalpartner', value: 'ibp' }));
                                            deleteloggedcookies();
                                            $('body').append(form);
                                            form.submit();
                                            break;
                                        default:
                                            // Login externo
                                            loginExternalPartnerService(externalPartner)
                                                .done((datas) => {
                                                    if (datas.params && datas.params.length > 0) {
                                                        form = $('<form>', { method: 'POST', action: datas.url, class: 'hidden' });
                                                        form.append($('<input>', { name: 'market', value: marketg.toUpperCase() }))
                                                            .append($('<input>', { name: 'language', value: localeg.toLowerCase() }))
                                                            .append($('<input>', { name: datas.params[0].paramName, value: datas.params[0].paramValue }));
                                                    }
                                                })
                                                .fail(() => {
                                                    generateLoginEvent(false);
                                                    logoutIBPlusService();
                                                    SessionStorage.set(storageErrorIBPLUSkey, 'general');
                                                    window.location.href = '/';
                                                    deferred.reject();
                                                });
                                            break;
                                }
                            } else {
                                // Redireccionamiento registro SF landing Universia
                                // eslint-disable-next-line no-lonely-if
                                if (universia === 'LSUN') {
                                    // Redirecciona a la landing de la Iberia con partner de Universia
                                    window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/?partner=ZSUN`;
                                }
                                // Redireccionamiento inicio de sesion para la invitacion
                                else if (invitationCode) {
                                    window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/IBMIBP?tab=your-benefits&tier-nomination=upgrade`;
                                }
                                else if (registroClub) {
                                    window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/IBMIBP?registratedUser=true`;
                                }
                                // redireccion SalesForce RRSS IB PLUS
                                else if (rrss != null && typerrss != null && rrss === 'true') {
                                    if (typerrss === 0) {
                                        window.location.href = referral;
                                    } else {
                                        const params = new URLSearchParams({
                                            rrss,
                                            typerrss,
                                        });
                                        if (registerParamState) params.set('register', registerParamState);
                                        const target = `?${params.toString()}`;
                                        redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
                                    }
                                }
                                // SF NO RRSS
                                else if (rrss != null && typerrss != null && rrss === 'false') {
                                    if (typerrss === 0) {
                                        const params = new URLSearchParams();
                                        if (upgradeOK) {
                                            window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/profile`;
                                        }
                                        else if (registerParamState) params.set('register', registerParamState);
                                        alert('normal referral');
                                        const target =  params.size > 0 ? `?${params.toString()}` : '';
                                        redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
                                    }
                                }
                                else if (referral && referral.length > 0) {
                                    generateLoginEvent(true);
                                    if (window.top === window.self) {
                                        window.location.href = referral;
                                    }
                                } else {
                                    generateLoginEvent(true);
                                    if (window.top === window.self) {
                                        window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
                                    }
                                }
                            }
                        }
                        // fin state
                        else {
                            generateLoginEvent(true);
                            if (window.top === window.self) {
                                window.location.href = '/';
                            }
                        }
                    }
                    // error parental control
                    else {
                        logoutIBPlusService().always(() => {
                            // dFrontJs.ibe_loading.close('body');
                            // errormsg = loggedProperties.attr('data-inte-parentalcontrolmsg');
                            // showErrorModal(errormsg);
                            generateLoginEvent(false, {
                                type: 'error',
                                payload: 'parental-control'
                            });
                            if (window.top === window.self) {
                                SessionStorage.set(storageErrorIBPLUSkey, 'parental-control');
                                window.location.href = '/';
                            }
                            deferred.reject();
                        });
                    }
                }//FIN IBPLUS
                else if (isLogado().userType === 'IBZERO') {
                    if (state?.externalPartner?.length > 0) {
                        const { externalPartner } = state;
                        // eslint-disable-next-line default-case
                        switch (externalPartner) {
                                case 'ib_omnichannel_eva':
                                    onIberiaZeroOmniChannelPartnerLogin({ referralURL: referral });
                                    break;
                                case 'ib_dig_wineclub':
                                    onIberiaZeroWineClubPartnerLogin({ referralURL: referral });
                                    break;
                                case 'ib_register_wineclub':
                                    onIberiaZeroWineClubPartnerLogin({ referralURL: referral });
                                    break;
                        }
                        // redireccion SalesForce RRSS IB ZERO
                    } else {
                        // eslint-disable-next-line no-lonely-if
                        if (rrss != null && typerrss != null) {
                            /* Normal login */
                            if (typerrss === 0 && !registerParamState) {
                                window.location.href = referral;
                                /* Iberia Zero Registration Form */
                            } else if (typerrss === 0 && registerParamState) {
                                if (upgradeKO) {
                                    window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/IBMIBP?registerPopUp=true`;
                                }
                                const params = new URLSearchParams({
                                    register: registerParamState
                                });
                                const target = `?${params.toString()}`;
                                redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
                                /* Iberia Zero Registration Social Network */
                            } else {
                                const params = new URLSearchParams({
                                    rrss,
                                    typerrss,
                                });
                                if (registerParamState) params.set('register', registerParamState);
                                const target = `?${params.toString()}`;
                                redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
                            }
                        } else if (referral && referral.length > 0) {
                            generateLoginEvent(true);
                            if (window.top === window.self) {
                                window.location.href = referral;
                            }
                        } else {
                            generateLoginEvent(true);
                            if (window.top === window.self) {
                                window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
                            }
                        }
                    }
                }
                else {
                    generateLoginEvent(true);
                    if (referral && referral.length > 0) {
                        if (window.top === window.self) {
                            window.location.href = referral;
                        }
                    } else {
                        generateLoginEvent(true);
                        if (window.top === window.self) {
                            window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
                        }
                    }
                }
            })
            .fail(() => {
                // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
                // showErrorModal(errormsg);
                logoutIBPlusService().always(() => {
                    // dFrontJs.ibe_loading.close('body');
                    SessionStorage.remove(storageIdentityState);
                    generateLoginEvent(false);
                    if (window.top === window.self) {
                        SessionStorage.set(storageErrorIBPLUSkey, 'general');
                        window.location.href = '/';
                    }
                    deferred.reject();
                });
            });
    };

    const loginFailure = (err) => {
        let error = err;
        error = error || { status: 0, responseJSON: null };
        const errorcode = error.responseJSON ? error.responseJSON.error : undefined;
        // Tracking login fail
        const eventData = {
            eventName: 'interaccion',
            eventCategory: 'intento de login',
            eventAction: 'clic', 
            eventLabel:  'login ko',
        };
        if (typeof (window.DigitalChange) !== 'undefined') {
            window.DigitalChange('interaction', eventData);
        }
        if (typeof (window.dataLayer) !== 'undefined') {
            window.dataLayer.push(eventData, { event: 'interaction' });
        }
        clearLoginErrorState();
        // Error cases
        // Suposing that comes from service
        if (errorcode === 'pkce_init_error'
         || errorcode === 'callback_error'
         || errorcode === 'security_error'
         || errorcode === 'token_exchange_error') {
            generateLoginEvent(false, {
                type: 'error',
                payload: 'general',
                step: errorcode,
            });
            deleteloggedcookies();
            if (window.top === window.self) {
                setSessionStorageError('general');
                window.location.href = '/';
            }
        } else if (errorcode === 'invalid_grant') {
            // errormsg = (error.responseJSON.loggedBy !== 'email') ? loggedProperties.attr('data-inte-invalidcredentialsmsg') : loggedProperties.attr('data-inte-invalidcredentialsemail');
            // dFrontJs.ibe_loading.close('body');
            // showErrorModal(errormsg);
            generateLoginEvent(false);
            if (window.top === window.self) {
                setSessionStorageError('general');
                window.location.href = '/';
            }
        } else if (errorcode === 'invalid_grant_mail') {
            // errormsg = loggedProperties.attr('data-inte-repeatedmailmsg');
            // dFrontJs.ibe_loading.close('body');
            // showErrorModal(errormsg);
            generateLoginEvent(false);
            if (window.top === window.self) {
                setSessionStorageError('general');
                window.location.href = '/';
            }
            // Temporal and permanent blocked users
        } else if (errorcode === 'invalid_grant_BT') {
            redirectByQuadrigam(marketg, localeg, 'IBBLUT');
        } else if (errorcode === 'invalid_grant_BP') {
            redirectByQuadrigam(marketg, localeg, 'IBBLUS');
            // User logged with an expired pin
        } else if (errorcode === 'invalid_grant_PE') {
            SessionStorage.set('ib-plus-app.passwordExpired', true);
            redirectByQuadrigam(marketg, localeg, 'IBOLPS');
        } else {
            // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
            // dFrontJs.ibe_loading.close('body');
            // showErrorModal(errormsg);
            generateLoginEvent(false);
            deleteloggedcookies();
            if (window.top === window.self) {
                setSessionStorageError('general');
                window.location.href = '/';
            }
        }
	  deferred.reject();
    };

    if (!isLogged.userLogged || (isLogged.userLogged && isLogged.isSoftUser)) {
        loginIBPlusLimService().then(loginSuccess, loginFailure);
    } else if (isLogged.userLogged) {
        if (urlParams.externalpartner && urlParams.externalpartner.length > 0 ) {
            logoutIBPlusService().always(()=> {
                loginIBPlusLim();
            })
        } else if (urlParams.referralURL && urlParams.referralURL.length > 0 ){
            window.location.href =  decodeURIComponent(urlParams.referralURL);
        } else {
            window.location.href = '/';
        }
        deferred.resolve();
    } else {
        window.location.href = '/';
        deferred.reject();
    }

    return deferred.promise();
}

const event = new CustomEvent('IDENTITY_LOGIN_ONPAGE');
window.parent.dispatchEvent(event);
dFrontJs.ibe_loading.open();
loginIBPlusLim.call({ callerID: 'WCS' });
