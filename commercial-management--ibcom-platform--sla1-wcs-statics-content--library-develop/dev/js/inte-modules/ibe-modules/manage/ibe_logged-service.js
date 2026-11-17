import {
  common, toTitleCase, getDateFormat, deleteloggedcookies,
} from './ibe_common';
import { callModalwcs, getDateByFormat, digestSHA256 } from '../general/ibe_inte-util';
import { generateAnonymousToken, callTokenService, callService } from './ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';
import * as LocalStorage from './ibe-local-storage';
import { removeAvatarEvent } from '../general/ibe_logavatar';

const {
  localeg, marketg, tokenURL, tokenUrlOB,
  customerDataServiceOB, globalAppToken, salesforceURL, loginMicroserviceUrl,
  retrieveMemberDetailV2, customerZeroPersonal, customerZeroContact,
} = retrieveGlobalVariables();

const SSO_COOKIE_DEFAULT_EXP = 315569520000 + new Date().getTime();
const isTokenExpired = (expiration) => {
  // Expiration format from cookie is: dd/MM/yyyy HH:mm
  let ok = true;
  let tokenDate;
  if (expiration) {
    tokenDate = getDateByFormat(expiration, 'DD/MM/YYYY hh:mm:ss', true);
    ok = tokenDate.getTime() <= (new Date()).getTime();
  }
  return ok;
};

const sendLoginInfo = () => {
  const loggedInfo = isLogado();
  try {
    if (window.BroadcastChannel) {
      const broadcastChannel = new window.BroadcastChannel('ib-idt-channel');
      if (loggedInfo.userType === 'IBPLUS') {
        broadcastChannel.postMessage({
          type: 'IBPLUS_LOGIN',
          payload: {
            members: SessionStorage.get('retrieveMemberDetailV2')
          }
        });
      } else if (loggedInfo.userType === 'IBZERO') {
        const [ personalData, contactDetails ] = SessionStorage.get('retrieveMemberDetailZero');
        broadcastChannel.postMessage({
          type: 'IBZERO_LOGIN',
          payload: {
            personalData: personalData,
            contactDetails: contactDetails
          }
        });
      }
      broadcastChannel.close();
    }
  } catch (e) {}
};

const generateLoginEvent = (isSuccess = true, data) => {
  if (isSuccess) {
    sendLoginInfo();
  }
  const event = new CustomEvent(isSuccess ? 'IDENTITY_LOGIN_SUCCESS' : 'IDENTITY_LOGIN_FAILURE', { detail: data });
  window.parent.dispatchEvent(event);
};

const isLogado = () => {
  let accessToken; let accessTokenExpire; let refreshTokenTxt; let refreshTokenExpire; let accessTokenSalesforce; let accessTokenExpireSalesforce; let refreshTokenSalesforce;
  let userLogged = false;
  let userType = null;
  let accesTokenSF; let accessTokenSFExpire; let refreshTokenSF; let refreshTokenSFExpire, isSoftUser = false;
  const permanentStorage = LocalStorage.get('IB_PERMANENT_LOGIN');

  if (Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE')) {
    accesTokenSF = Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
    accessToken = Cookies.get('IBERIACOM_SSO_ACCESS');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_ACCESS')) {
    accessToken = Cookies.get('IBERIACOM_SSO_ONB_ACCESS');
  } else {
    accesTokenSF = null;
    accessToken = null;
  }

  if (Cookies.get('IBERIACOM_SSO_ACCESS_TO_SALESFORCE')) {
    accessTokenExpire = Cookies.get('IBERIACOM_SSO_ACCESS_TO');
    accessTokenSFExpire = Cookies.get('IBERIACOM_SSO_ACCESS_TO_SALESFORCE');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_ACCESS_TO')) {
    accessTokenExpire = Cookies.get('IBERIACOM_SSO_ONB_ACCESS_TO');
  } else {
    accessTokenExpire = null;
    accessTokenSFExpire = null;
  }

  if (Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE')) {
    refreshTokenTxt = Cookies.get('IBERIACOM_SSO_REFRESH');
    refreshTokenSF = Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_REFRESH')) {
    refreshTokenTxt = Cookies.get('IBERIACOM_SSO_ONB_REFRESH');
  } else {
    refreshTokenTxt = null;
  }
  if (Cookies.get('IBERIACOM_SSO_REFRESH_TO_SALESFORCE')) {
    refreshTokenSFExpire = Cookies.get('IBERIACOM_SSO_REFRESH_TO_SALESFORCE');
  } else {
    refreshTokenSFExpire = null;
  }

  if (Cookies.get('IBERIACOM_SSO_REFRESH_TO')) {
    refreshTokenExpire = Cookies.get('IBERIACOM_SSO_REFRESH_TO');
  } else if (Cookies.get('IBERIACOM_SSO_ONB_REFRESH_TO')) {
    refreshTokenExpire = Cookies.get('IBERIACOM_SSO_ONB_REFRESH_TO');
  } else {
    refreshTokenExpire = null;
  }

  if (Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE')) {
    userType = 'IBPLUS';
  } else if (Cookies.get('IBERIACOM_SSO_ONB_REFRESH_TO')) {
    userType = 'OB';
  } else {
    userType = null;
  }

  if (Cookies.get('IBERIACOM_SSO_TYPE') === 'IBZERO') {
    userType = 'IBZERO';
  }
  if (userType === 'IBPLUS' || userType === 'IBZERO' ) {
    isSoftUser = (permanentStorage) || (refreshTokenSF !== null && refreshTokenSF !== undefined
        && (accesTokenSF === null || accessTokenSFExpire === null || (accessTokenSFExpire!== null && isTokenExpired(accessTokenSFExpire))) );

    if(isSoftUser){
      const splitted = window.location.hostname.split('.');
      Cookies.remove('IBERIACOM_SSO_SESION',{path: '/', domain:`.${splitted.slice(splitted.length - 2).join('.')}`})
      LocalStorage.set('IB_PERMANENT_LOGIN', 'true');
      SessionStorage.remove('retrieveMemberDetailV2');
    }
  }
  userLogged = ((userType === 'OB' && refreshTokenTxt && refreshTokenExpire && !isTokenExpired(refreshTokenExpire))
                || ((userType === 'IBPLUS' || userType === 'IBZERO') && refreshTokenSF !== null && refreshTokenSF !== undefined ));

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

const getAppToken = (globalAppToken, tokenURL) => {
  // [JLR] I´m not sure if this functions is really needed and could be absorbed for other.
  // It is like redundant.
  const deferred = $.Deferred();
  const isLogged = isLogado();
  const cookieAccessToken = isLogged.userLogged ? isLogged.accessToken : null;
  const cookieRefreshToken = isLogged.userLogged ? isLogged.refreshTokenTxt : null;
  const cookieRefreshTokenExpire = isLogged.userLogged ? isLogged.refreshTokenExpire : null;

  let anonymousToken;
  if (!cookieRefreshToken || isTokenExpired(cookieRefreshTokenExpire)) {
    anonymousToken = SessionStorage.get('anonymousToken');
    if (!anonymousToken) {
      generateAnonymousToken(tokenURL, globalAppToken).done((tokenResponse) => {
        SessionStorage.set('anonymousToken', tokenResponse.access_token);

        /**/
        SessionStorage.remove('accessToken');
        SessionStorage.remove('accessTokenOB');
        deleteloggedcookies();
        /**/

        deferred.resolve(tokenResponse.access_token);
      }).fail(() => {
		    deferred.reject();
      });
    } else {
      deferred.resolve(anonymousToken);
    }
  } else {
    deferred.resolve(cookieAccessToken);
  }

  return deferred.promise();
};

const refreshLoggedToken = (serviceUrl, authorizationToken, refreshTokn) => {
  const params = $.param({ grant_type: 'refresh_token', refresh_token: refreshTokn });
  return callTokenService(serviceUrl, authorizationToken, params);
};


/**
 * Calls introspect service after getting the access token of salesforce to know the validation time if it is still active
 * @param data Access token service response
 * @return {*}
 */
const setCookiesSalesforce = (data) => {
  return new Promise((resolve, reject) => {
    if (data.access_token && data.access_token.length > 0 && data.refresh_token && data.refresh_token.length > 0) {
      const introspectEndpoint = `${loginMicroserviceUrl}rs/v1/token/salesforce-introspect`;
      const paramsAccess = {
        token: data.access_token && data.access_token.length > 0 ? data.access_token : '',
        token_type_hint: 'access_token'
      };
      const paramsRefresh = {
        token: data.refresh_token && data.refresh_token.length > 0 ? data.refresh_token : '',
        token_type_hint: 'refresh_token'
      };

      const headers = {
        Authorization: `Bearer ${SessionStorage.get('anonymousToken')}`
      }

      const serviceSuccess = (resp) => {
        const dataAccess = resp[1];
        const dataRefresh = resp[0];
        const expirationAccess = new Date(dataAccess.exp * 1000);
        const expirationRefresh = dataRefresh.exp ? new Date(dataRefresh.exp * 1000): new Date (SSO_COOKIE_DEFAULT_EXP);
        const scheme = window.location.protocol === 'https:';
        document.cookie = `IBERIACOM_SSO_ACCESS_SALESFORCE=${data.access_token};path=/;expires=${expirationAccess.toGMTString()};secure=${scheme};`;
        document.cookie = `IBERIACOM_SSO_ACCESS_TO_SALESFORCE=${getDateFormat(expirationAccess, true)};path=/;expires=${expirationAccess.toGMTString()};secure=${scheme};`;
        document.cookie = `IBERIACOM_SSO_REFRESH_SALESFORCE=${data.refresh_token};path=/;expires=${expirationRefresh.toGMTString()};secure=${scheme};`;
        document.cookie = `IBERIACOM_SSO_REFRESH_TO_SALESFORCE=${getDateFormat(expirationRefresh, true)};path=/;expires=${expirationRefresh.toGMTString()};secure=${scheme};`;
        SessionStorage.set('accessTokenSalesforce', data.access_token);
        resolve();
      };
      const serviceFailure = () => {
        //generateLoginEvent(false)
        reject();
      };
      Promise.all([
        fetch(introspectEndpoint, { body: new URLSearchParams(paramsRefresh), method: 'POST', headers }).then(res => res.json()),
        fetch(introspectEndpoint, { body: new URLSearchParams(paramsAccess), method: 'POST', headers }).then(res => res.json())
      ])
        .then(serviceSuccess)
        .catch(serviceFailure);
    } else {
      reject();
    }
  });
};

const setTokenKeycloack = (scope, salesforceAccessToken) => {
  const isLogged = isLogado();
  return new Promise((resolve, reject) => {
    $.ajax({ method: 'GET', url: '/cs/Satellite', data: { pagename: 'IB_SE/CacheControl0s/Integration/logOut' } });
    const headers = {
      Authorization: `Basic ${globalAppToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const tokSF = salesforceAccessToken ?? Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');   
    const params = {
      'code': tokSF,
      'grant_type': 'password',
      'login_type': 'authorization_code',
    };
    if (typeof (scope) === 'string' && scope.length > 0) {
      params.scope = scope;
    }
    const serviceSuccess = (resp) => {
      const scheme = window.location.protocol === 'https:';
      const date = new Date();
      const exAcc = date.getTime() + (resp.expires_in > 0 ? resp.expires_in * 1000 : 3600 * 1000);
      const exRefsh = date.getTime() + (resp.refresh_expires_in > 0
        ? resp.refresh_expires_in * 1000 : 86400000);
      document.cookie = `IBERIACOM_SSO_ACCESS=${resp.access_token};path=/;expires=${new Date(exAcc).toGMTString()};secure=${scheme};`;
      document.cookie = `IBERIACOM_SSO_ACCESS_TO=${getDateFormat(exAcc, true)};path=/;expires=${new Date(exAcc).toGMTString()};secure=${scheme};`;
      document.cookie = `IBERIACOM_SSO_REFRESH=${resp.refresh_token};path=/;expires=${new Date(exRefsh).toGMTString()};secure=${scheme};`;
      document.cookie = `IBERIACOM_SSO_REFRESH_TO=${getDateFormat(exRefsh, true)};path=/;expires=${new Date(exRefsh).toGMTString()};secure=${scheme};`;
      if (resp.access_token) {
        const token = JSON.parse(atob(resp.access_token.split('.')[1]));
        if(token !== undefined && token.realm_access !== undefined && token.realm_access.roles.length > 0) {
          if (token.realm_access.roles.filter((el) => {return el === 'ROLE_IBERIA_ZERO'}).length > 0) {
            document.cookie = `IBERIACOM_SSO_TYPE=IBZERO;path=/;expires=${new Date(isLogged.refreshTokenSFExpire).toGMTString()};secure=${scheme};`;
          } else {
            document.cookie = `IBERIACOM_SSO_TYPE=IBPLUS;path=/;expires=${new Date(isLogged.refreshTokenSFExpire).toGMTString()};secure=${scheme};`;
          }
        }
      }
      if(isLogged.isSoftUser) {
        LocalStorage.set('IB_PERMANENT_LOGIN', 'true');
        SessionStorage.remove('retrieveMemberDetailV2');
      }
      SessionStorage.set('accessToken', resp.access_token);
      SessionStorage.remove('anonymousToken');
      resolve(resp);
    };
    const serviceFailure = (resp) => {
      reject(resp);
    };
    callService(tokenURL, headers, params, 'POST').then(serviceSuccess, serviceFailure);
  });
};

/**
 * Get a new anonymous token for the user, as a promise.
 */
function getAnonymousTokenPromise() {
  return new Promise((resolve, reject) => {
    generateAnonymousToken(tokenURL, globalAppToken)
      .done((res) => {
        SessionStorage.set('anonymousToken', res.access_token);
        resolve(res);
      })
      .fail((err) => {
        reject(err);
      })
  })
}

const refreshToken = (globalAppToken, tokenURLService) => {
  const deferred = $.Deferred();
  const isLogged = isLogado();
  const refreshTokenTxt = isLogged.userLogged ? isLogged.refreshTokenTxt : null;
  const refreshTokenExpiration = isLogged.userLogged ? isLogged.refreshTokenExpire : null;



  // Call to refresh token keycloack service
  const getRefreshToken = () => {
    const refreshTokenPromise = refreshLoggedToken(tokenURLService, globalAppToken, refreshTokenTxt);
    refreshTokenPromise.done((tokenData) => {
      // update cookies with new values
      const date = new Date();
      const exAcc = date.getTime() + (tokenData.expires_in > 0
        ? tokenData.expires_in * 1000 : 3600 * 1000);
      const exRefsh = date.getTime() + (tokenData.refresh_expires_in > 0
        ? tokenData.refresh_expires_in * 1000 : 86400000);
      // A day. If It do not come in the service.

      const cookieAccess = (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') ? 'IBERIACOM_SSO_ACCESS' : 'IBERIACOM_SSO_ONB_ACCESS';
      const cookieAccessTo = (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') ? 'IBERIACOM_SSO_ACCESS_TO' : 'IBERIACOM_SSO_ONB_ACCESS_TO';
      const cookieRefresh = (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') ? 'IBERIACOM_SSO_REFRESH' : 'IBERIACOM_SSO_ONB_REFRESH';
      const cookieRefreshTo = (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') ? 'IBERIACOM_SSO_REFRESH_TO' : 'IBERIACOM_SSO_ONB_REFRESH_TO';
      const scheme = window.location.protocol === 'https:';

      Cookies.set(cookieAccess, tokenData.access_token, {
        path: '/', expires: new Date(exAcc), secure: scheme, sameSite: 'strict',
      });
      Cookies.set(cookieAccessTo, getDateFormat(exAcc, true), {
        path: '/', expires: new Date(exAcc), secure: scheme, sameSite: 'strict',
      });
      Cookies.set(cookieRefresh, tokenData.refresh_token, {
        path: '/', expires: new Date(exRefsh), secure: scheme, sameSite: 'strict',
      });
      Cookies.set(cookieRefreshTo, getDateFormat(exRefsh, true), {
        path: '/', expires: new Date(exRefsh), secure: scheme, sameSite: 'strict',
      });
      if (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') {
        SessionStorage.set('accessToken', tokenData.access_token);
      } else {
        SessionStorage.set('accessTokenOB', tokenData.access_token);
      }
      SessionStorage.remove('anonymousToken');
      deferred.resolve();
    });
    refreshTokenPromise.fail(() => {
      generateAnonymousToken(tokenURL, globalAppToken).done((tokenResponse) => {
        deleteloggedcookies();
        SessionStorage.remove('accessToken');
        SessionStorage.remove('accessTokenOB');
        SessionStorage.set('anonymousToken', tokenResponse.access_token);
        deferred.resolve();
      });
    });
  };

  if (isLogged.userType === 'IBPLUS' || isLogged.userType === 'IBZERO') {
    const refreshTokenSalesforceTxt = isLogged.userLogged ? isLogged.refreshTokenSF : null;
    // Siempre que haya caducado un token tanto de Keycloack como Salesforce se refrescan TODOS los tokens
    if (isLogged.userLogged) {
      // Si se cumple el usuario pasa a ser  Soft (largo término)
      if(isLogged.isSoftUser) {
        getAnonymousTokenPromise()
        .then(() => refreshAccessTokenSaleforce())
        .then((data) => {
          const response = data;
          response.refresh_token = refreshTokenSalesforceTxt;
          setCookiesSalesforce(response).then(() => {
            setTokenKeycloack('soft_user').then(() => {
              deferred.resolve();
            }).catch(() => {
              generateAnonymousToken(tokenURL, globalAppToken).done((tokenResponse) => {
                deleteloggedcookies();
                SessionStorage.remove('accessToken');
                SessionStorage.remove('accessTokenOB');
                SessionStorage.set('anonymousToken', tokenResponse.access_token);
                deferred.resolve();
              }).fail(() => {
                deferred.resolve();
              });;
            });
          }).catch(() => { deferred.resolve(); });
          // Se setean las cookies de Keycloack para acabar de refrecar todos los tokens
        }).catch(() => {
          // TODO IDENTITY Generar token anónimo?
          generateAnonymousToken(tokenURL, globalAppToken).done((tokenResponse) => {
            deleteloggedcookies();
            SessionStorage.remove('accessToken');
            SessionStorage.remove('accessTokenOB');
            SessionStorage.set('anonymousToken', tokenResponse.access_token);
            deferred.resolve();
          });
        });
      } else {
        setTokenKeycloack()
          .then(() => {
            deferred.resolve();
          })
          .catch(() => {
            // Refresco de token de saleforce
            getAnonymousTokenPromise()
              .then(() => refreshAccessTokenSaleforce())
              .then((resp) => ({
                ...resp,
                refresh_token: refreshTokenSalesforceTxt,
              }))
              .then((data) => setCookiesSalesforce(data))
              .then(() =>
                setTokenKeycloack(isLogged.isSoftUser ? "soft_user" : undefined)
              )
              .then(() => {
                deferred.resolve();
              })
              .catch(() =>
                generateAnonymousToken(tokenURL, globalAppToken)
                  .done((tokenResponse) => {
                    deleteloggedcookies();
                    SessionStorage.remove("accessToken");
                    SessionStorage.remove("accessTokenOB");
                    SessionStorage.set(
                      "anonymousToken",
                      tokenResponse.access_token
                    );
                    deferred.resolve();
                  })
                  .fail(() => {
                    deferred.resolve();
                  })
              );
          });
      }
    }
  } else if (refreshTokenTxt && !isTokenExpired(refreshTokenExpiration)) {
    getRefreshToken();
  } else {
    generateAnonymousToken(tokenURL, globalAppToken).done((tokenResponse) => {
      deleteloggedcookies();
      SessionStorage.remove('accessToken');
      SessionStorage.remove('accessTokenOB');
      SessionStorage.set('anonymousToken', tokenResponse.access_token);
      deferred.resolve();
    });
  }

  return deferred.promise();
};

/**
 * @description Refresh access token saleforce
 * @see https://transform.atlassian.net/browse/CPA-291
 * @returns {Promise} 
 */

function refreshAccessTokenSaleforce() {
  const isLogged = isLogado();
  const refreshTokenSalesforceTxt = isLogged.userLogged ? isLogged.refreshTokenSF : null;
  const ibplusRefreshTokenURL = `${loginMicroserviceUrl}rs/v1/token/salesforce-token`;
  const params = {
    refresh_token: refreshTokenSalesforceTxt,
    grant_type: "refresh_token"
  };

  const headers = {
    Authorization: `Bearer ${SessionStorage.get('anonymousToken')}`
  }

  return fetch(ibplusRefreshTokenURL, {
    body: new URLSearchParams(params),
    method: "POST",
    headers
  })
    .then((res) => res.json())
    .catch((err) => Promise.reject(err));
}

// Control errors with promise service call
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function refreshTokenPromise() {
  return new Promise((resolve, reject) => {
    refreshToken(globalAppToken, tokenURL)
      .then((resp) => resolve(resp))
      .catch((err) => {
        reject(err);
      });
  });
}

function serviceCallWithRefresh(
  operation,
  delay = 1000,
  retries = common.MAX_ATTEMPS
) {
  return new Promise((resolve, reject) => {
    operation()
      .then((resp) => resolve(resp))
      .catch((reason) => {
        if (retries > 0) {
          if (reason.status === 401) {
            refreshTokenPromise()
              .then(
                serviceCallWithRefresh.bind(null, operation, delay, retries - 1)
              )
              .then((resp) => resolve(resp))
              .catch((err) => {
                reject(err);
              });
          }
          if (reason.status === 408) {
            wait(delay)
              .then(retryOperation.bind(null, operation, delay, retries - 1))
              .then(resolve)
              .catch(reject);
          }
          reject(reason);
        }
        reject(reason);
      });
  });
}
//



const getCustomerDataSession = () => {
  const isLogged = isLogado();
  if (isLogged.userLogged) {
    if (isLogged.userType === 'OB') return SessionStorage.get('customerDataOB');
    if (isLogged.userType === 'IBZERO') return SessionStorage.get('customerDataZero');
    return SessionStorage.get('customerData');
  }
  return null;
};

const callGetCustomerData = (serviceUrl, authorizationToken, language) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': language,
    Authorization: `Bearer ${authorizationToken}`,
  };
  return $.ajax({
    url: serviceUrl,
    xhrFields: {
      withCredentials: true,
    },
    type: 'GET',
    headers,
  });
};
const getCustomerDataService = (serviceUrl, authorizationToken, language) => {
  const deferred = $.Deferred();
  if (serviceUrl.indexOf('{memberId}') >= 0) {
    deferred.reject({ status: 401 });
  } else {
    callGetCustomerData(serviceUrl, authorizationToken, language).done((data) => {
      deferred.resolve(data);
    }).fail((error) => {
      deferred.reject({ status: error.status, data: error.responseJSON });
    });
  }
  return deferred.promise();
};

const getCustomerDataServiceRetries = (serviceUrl, authorizationToken, language, currentAttemps) => {
  const deferred = $.Deferred();

  if (serviceUrl.indexOf('{memberId}') >= 0) {
    deferred.reject({ status: 401 });
  } else {
    callServiceRetries(serviceUrl, authorizationToken, language, currentAttemps);
  }

  function callServiceRetries(serviceUrl, authorizationToken, language, currentAttemps){
    callGetCustomerData(serviceUrl, authorizationToken, language)
      .done((data) => {
        deferred.resolve(data);
      }).fail((error) => {
        // error 503 y code PRLM_MBM_1007 - reintentos
        if(error.status == 503 && error.responseJSON.errors[0].code == 'PRLM_MBM_1007' && currentAttemps < common.MAX_ATTEMPS ){
          callServiceRetries(serviceUrl, authorizationToken, language, currentAttemps + 1);
        } else {
          deferred.reject({ status: error.status, data: error.responseJSON });
        }
    });
  }

  return deferred.promise();
};

const getCustomerDataZero = (token, salesforceTK, language) =>  {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': language,
    Authorization: `Bearer ${token}`,
    'X-Salesforce-Token': salesforceTK,
  };
  return Promise.all([
    callService(customerZeroPersonal, headers),
    callService(customerZeroContact, headers),
  ])
};

const sendLogoutInfo = () => {
  try {
    if (window.BroadcastChannel) {
      const broadcastChannel = new window.BroadcastChannel('ib-idt-channel');
      broadcastChannel.postMessage({
        type: 'LOGOUT',
        payload: {
          anonymousToken: SessionStorage.get('anonymousTokenForService') ?? SessionStorage.get('anonymousToken') ?? null
        }
      });
      broadcastChannel.close();
    }
  } catch (e) {}
};

/* Logout IBPlus */
const logoutIBPlusService = () => {
  const deferred = $.Deferred();
  // Legacy mode  (Old platform) if boolean true, IBIS if false
  function removeLoggedInfo() {
    deleteloggedcookies();
    removeAvatarEvent();
    SessionStorage.remove('accessToken');
    SessionStorage.remove('customerData');
    SessionStorage.remove('retrieveMemberDetailV2');
    SessionStorage.remove('ib-check-in-app.customerData');
    SessionStorage.remove('ib-check-in-app.loggedInfo');
    SessionStorage.remove('ib-check-in-app.userLoggedBookingInfo');
    SessionStorage.remove('ib-MmB-app.bookingsList');
    SessionStorage.remove('ib-MmB-app.customerData');
    SessionStorage.remove('ib-booking-app.customerData');
    SessionStorage.remove('ib-avios-calculator-app.customerData');
    SessionStorage.remove('ib-avios-calculator-app.loggedToken');
    SessionStorage.remove('ib-avios-calculator-app.refreshToken');
    SessionStorage.remove('ib-avios-calculator-app.userLogged');
    SessionStorage.remove('ib-plus-app.customerData');
    SessionStorage.remove('ib-plus-app.loggedToken');
    SessionStorage.remove('ib-plus-app.refreshToken');
    SessionStorage.remove('ib-plus-app.userLogged');
    SessionStorage.remove('ib-plus-app.username');
    SessionStorage.remove('ib-plus-app.typeOfCard');
    SessionStorage.remove('ib-plus-app.linksList');
    SessionStorage.remove('urlUpgradeRedirect');
  }

  function callSalesForceLogout() {
    const sfTokenRefresh = Cookies.get('IBERIACOM_SSO_REFRESH_SALESFORCE');
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded'};
    const url = `${salesforceURL}revoke`;
    const params = { token: sfTokenRefresh }; // NOTA -> parece que no es necesario el client_id o client_secret
    return new Promise((resolve, reject) => {
      if (!sfTokenRefresh) {
        reject();
      } else {
        callService(url, headers, params, 'POST')
          .always((response) => { resolve(response); });
      }
    });
  }

  function callLogoutService() {
    const rToken = Cookies.get('IBERIACOM_SSO_REFRESH') || '';
    const aToken = Cookies.get('IBERIACOM_SSO_ACCESS') || '';
    if (rToken.length > 0) {
      const key = atob(globalAppToken).split(':');
      const params = $.param({ refresh_token: rToken, client_id: key[0], client_secret: key[1] });
      const ibplusLogoutURL = $('#loggedUserDefaults').attr('data-inte-ibpluslogoutURL');

      const headers = { Authorization: `Bearer ${aToken}`, 'Content-Type': 'application/x-www-form-urlencoded' };

      callSalesForceLogout()
        .then(() => {
          callService(ibplusLogoutURL, headers, params, 'POST')
            .always(() => {
              sendLogoutInfo();
              removeLoggedInfo();
              deferred.resolve();
            });
        })
        .catch(() => {
          sendLogoutInfo();
          removeLoggedInfo();
          deferred.resolve();
        });
    } else {
      // If refresh token is already expired - User is not logged
      removeLoggedInfo();
      deferred.reject();
    }
  }
  callLogoutService();
  return deferred.promise();
};

  /**
   * Return FF of user - Decode token access to retrieve information
   */
 const getMemberIdByToken = () => {
  let infoToken; let idUser = '{memberId}';
  let { accessToken } = isLogado();
  if (accessToken !== null && accessToken !== undefined && accessToken !== "") {
    // eslint-disable-next-line prefer-destructuring
    accessToken = accessToken.split('.')[1];
    infoToken = decodeURIComponent(escape(window.atob(accessToken)));
    infoToken = JSON.parse(infoToken);
    idUser = infoToken.preferred_username;
  }
  return idUser;
};

const getMemberData = (authorizationToken, language, userType) => {

  const deferred = $.Deferred();
  let userInfo;
  let currentAttemps = 0;
  let segment = 0; let preferredLanguage; let surNames; let email;
  const dumboInfo = { tier: '', bonusCode: '', bonusDiscount: '' };

  /**
   * Function to return unique promise (Case service failed and retried attempt)
   * @param {*} authorizationToken Token refreshed
   * @param {*} language
   * @param {*} userType IBPLUS or OB
   */
  function getMemberDataInside(authorizationToken, language, userType) {

    /**
   * Set customerData variable of SessionStorage with information of IBPlus customer
   * @param {*} dataMDv2 Response of Retrieve Member Detail Service V2
   * unified:
   *  dataMD - Response of Retrieve Member Detail Service (personal info)
   *  dataLA - Response of List Account Service (balance of avios)
   *  dataLS - Response of List Schemes With Tiers Service (category info)
   *  dataPD - Response of Partners Programme Dumbo Service (list of partners associated for a member)
   */
    function setMemberIBPlusInfoV2(dataMDv2) {
      let documentId; let address; let number; let numberExtra; let postalCode; let category = 'CLASICA'; let aviosBalance;

      //preferredLanguage
      if ((dataMDv2.memberPersonalDetails.person.locale) != null) {
        preferredLanguage = dataMDv2.memberPersonalDetails.person.locale.toUpperCase();
      }
      const lastName = dataMDv2.memberPersonalDetails.person.personName.familyName != null ? toTitleCase(dataMDv2.memberPersonalDetails.person.personName.familyName) : '';
      surNames = lastName;

      if ((dataMDv2.memberPersonalDetails.person.personName.secondFamilyName) != null) {
        surNames += ` ${toTitleCase(dataMDv2.memberPersonalDetails.person.personName.secondFamilyName)}`;
      }
      if ((dataMDv2.memberPersonalDetails.person.emailAddress.email) != null) {
        email = dataMDv2.memberPersonalDetails.person.emailAddress.email;
      }
      //registeredIdentifiers
      if ((dataMDv2.memberPersonalDetails.person.registeredIdentifiers) != null) {
        const documentDNI = dataMDv2.memberPersonalDetails.person.registeredIdentifiers.find((document) => document.type.toUpperCase() === 'NATIONALITY ID');
        if (documentDNI != null) {
          documentId = documentDNI.token;
        } else {
          const documentPassport = dataMDv2.memberPersonalDetails.person.registeredIdentifiers.find((document) => document.type.toUpperCase() === 'PASSPORT');
          if (documentPassport != null) {
            documentId = documentPassport.token;
          }
        }
      }
      //postalAddresses
      if ((dataMDv2.memberPersonalDetails.person.postalAddresses) != null) {
        const addressPreference = dataMDv2.memberPersonalDetails.person.postalAddresses.find((postal) => postal.preferenceIndicator === true);
        if (addressPreference != null && addressPreference.addressLines != null) {
          address = addressPreference.addressLines[0] != null ? addressPreference.addressLines[0] : '';
          number = addressPreference.addressLines[1] != null ? addressPreference.addressLines[1] : '';
          numberExtra = addressPreference.addressLines[2] != null ? addressPreference.addressLines[2] : '';
          postalCode = addressPreference.postCode ? addressPreference.postCode : '';
        }
      }

      const schemeBasic = dataMDv2.memberPersonalDetails.schemes.find((scheme) => scheme.schemeIdentifier.toUpperCase() === 'BASIC');
      if (schemeBasic != null) {
        category = schemeBasic.recognitionLevel.recognitionLevelIdentifier;
      }

      if (dataMDv2.accounts.length > 0) {
        const aviosReward = dataMDv2.accounts.find((account) => account.type.toUpperCase() === 'REWARD');
        const aviosTotalReward = dataMDv2.accounts.find((account) => account.type.toUpperCase() === 'TOTAL_REWARD');
        const aviosLoan = dataMDv2.accounts.find((account) => account.type.toUpperCase() === 'LOAN');

        let reward = aviosReward.balance.amount;
        let total_Reward = aviosTotalReward.balance.amount;
        let loan = aviosLoan.balance.amount;
        let loanOutstanding = false;

        if(aviosLoan && aviosLoan.outstandingLoan && aviosLoan.outstandingLoan.amount && aviosLoan.outstandingLoan.amount > 0){
          loan = -aviosLoan.outstandingLoan.amount;
          loanOutstanding = true;
        }

        aviosBalance = total_Reward;
        if (aviosReward && aviosReward.balance.amount === 0 && loanOutstanding) {
          aviosBalance = loan;
        }
      }

      switch (category) {
        case 'CLASICA':
          segment = 2;
          break;
        case 'PLATA':
          segment = 4;
          break;
        case 'ORO':
          segment = 1;
          break;
        case 'PLATINO':
          segment = 3;
          break;
        case 'INFINITA':
          segment = 3;
          break;
        case 'INFINITA PRIME':
          segment = 3;
          break;
        default: segment = 2;
      }
      // FF CPA-140
      const identifier = dataMDv2.memberPersonalDetails.identifier;

      userInfo = {
        segment,
        category: category.replace(/\s/g, ''),
        id: identifier != null ? identifier.replace(/^0+/, "").replace(/^[*]{6}/, "") : '',
        idComplete: identifier != null ? identifier : '',
        name: dataMDv2.memberPersonalDetails.person.personName.firstName != null ? toTitleCase(dataMDv2.memberPersonalDetails.person.personName.firstName) : '',
        surname: lastName,
        surnames: surNames,
        documentId,
        email,
        avios: aviosBalance,
        preferredLanguage,
        address,
        number,
        numberExtra,
        postalCode,
        //completeProfile
        completeProfile: dataMDv2.memberPersonalDetails.profileStatus === 'FULL', // PARTIAL or FULL
        parentalControl: dataMDv2.memberPersonalDetails.otherStatuses.isRedemptionEnabled != null ? dataMDv2.memberPersonalDetails.otherStatuses.isRedemptionEnabled : '',
        termsAndConditions: !!dataMDv2.memberPersonalDetails.termsAndConditions,
        dataMarket: marketg,
        dataLanguage: localeg,
        partnersInfo: dataMDv2.partners,
        hashEID : dataMDv2?.memberPersonalDetails?.person?.emailAddress?.hashEID ?? null,
      };
     
      SessionStorage.set('customerData', userInfo);
      SessionStorage.set('accessToken', Cookies.get('IBERIACOM_SSO_ACCESS'));
    }

    /**
     * Set customerDataOB variable of SessionStorage with information of OnBusiness customer
     * @param {*} data Response of service customer OB
     */
    function setMemberOBInfo(data) {
      const lastName = toTitleCase(data.userInfo.lastName);
      let companyName; let CIF; let companyCountry;
      if ((data.userInfo.lastName) != null) {
        surNames = lastName;
        if ((data.userInfo.secondLastName) != null) {
          surNames += ` ${toTitleCase(data.userInfo.secondLastName)}`;
        }
      }
      if ((data.userInfo.email) != null) {
        email = toTitleCase(data.userInfo.email);
      }
      if ((data.userInfo.preferredLanguage) != null) {
        switch (data.userInfo.preferredLanguage) {
          case 'SPA':
            preferredLanguage = 'ES';
            break;
          case 'ENG':
            preferredLanguage = 'EN';
            break;
          case 'CAT':
            preferredLanguage = 'CA';
            break;
          default:
            preferredLanguage = '';
            break;
        }
      }
      if ((data.companyInfo.companyName) != null) {
        companyName = toTitleCase(data.companyInfo.companyName);
      }

      if ((data.companyInfo.address) != null) {
        companyCountry = (data.companyInfo.address.country).toUpperCase();
      }

      if ((data.companyInfo.companyId) != null) {
        CIF = toTitleCase(data.companyInfo.companyId);
      }
      switch (data.tierStatus.status) {
        case 'On2':
          segment = 12;
          break;
        case 'On3':
          segment = 13;
          break;
        default: segment = 11;
      }

      //SHOW/HIDE "EQUIPO" SECTION ON USER MENU
      if(data.userInfo.role.code == "I_COMP_ADM" || data.userInfo.role.code == "I_COMP_AUT"){
        $("#tool_loggedOB .link__regular.link-equipo").removeClass("hidden");
      }

      userInfo = {
        segmento: segment,
        rolCode: data.userInfo.role.code,
        rolCIP: data.userInfo.role.description,
        userID: data.clid,
        name: toTitleCase(data.userInfo.firstName),
        surname: lastName,
        surnames: surNames,
        email,
        preferredLanguage,
        puntos: data.memberBalance,
        publicis: companyName,
        country: companyCountry,
        CIF,
        EstadoUsuario: 'logado_pyme',
        NivelUsuario: data.tierStatus.status,
        dataLanguage: localeg,
      };
      SessionStorage.set('customerDataOB', userInfo);
      SessionStorage.set('accessTokenOB', Cookies.get('IBERIACOM_SSO_ONB_ACCESS'));
    }
    function setMemberZeroInfo (data) {
      const personal = data[0];
      const contact = data [1];
      const userData = {
        name: personal.name != null ? toTitleCase(personal.name) : '',
        surnames: personal.lastName != null ? toTitleCase(personal.lastName) : '',
        email: contact.email,
        hashEID: contact.hashEID,
        userType:'IBZERO'
      }
      SessionStorage.set('customerDataZero', userData);
      SessionStorage.set('accessToken', Cookies.get('IBERIACOM_SSO_ACCESS'));
    }

    /**
     * Retry request to service (until 3 twices)
     * @param {*} error Response of service
     * @param {*} userType Type of user failed
     * @param {*} tokenURL URL token service failed
     */
    function failRetrieveMember(error, userType, tokenURL) {
      $('#publicUser').removeClass('hidden');
      if (SessionStorage.isWritable() === true) {
        if (error.status === 401) {
          if (currentAttemps < common.MAX_ATTEMPS) {
            currentAttemps += 1;
            // Refresh the token
            refreshToken(globalAppToken, tokenURL).done(() => {
              if (SessionStorage.get('anonymousToken') == null) {
                getAppToken(globalAppToken, tokenURL).done((tokenData) => {
                  getMemberDataInside(tokenData, language, userType);
                });
              } else {
                SessionStorage.remove('retrieveMemberDetailV2');
                SessionStorage.remove('accessToken');
                SessionStorage.remove('accessTokenOB');
                deleteloggedcookies();
                Cookies.set('JSESSIONID', '', { path: '/', sameSite: 'strict' });
                deferred.reject();
              }
            });
          } else {
            deferred.reject();
          }
        } else {
          deferred.reject();
        }
      } else {
        callModalwcs(localeg, marketg, 'CustomLink_C', $('header.ibe-header').attr('data-msg-service-error'), '', '', '#', false);
        deferred.reject();
      }
    }

    if (userType === 'OB') {
      /** Call Get Onbusiness Membership service */
      const getCustomerDataPromise = getCustomerDataService(customerDataServiceOB, authorizationToken, language);
      getCustomerDataPromise.done((data) => {
        setMemberOBInfo(data);
        deferred.resolve();
      });
      getCustomerDataPromise.fail((error) => {
        failRetrieveMember(error, 'OB', tokenUrlOB);
      });
    } else if (userType === 'IBZERO') {
         const sfToken =  Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
        getCustomerDataZero(authorizationToken, sfToken ,language)
        .then((data) => {
          SessionStorage.set('retrieveMemberDetailZero', data);
          if(data[1].email){
            digestSHA256(data[1].email).then((hashEID)=> {
              data[1].hashEID = hashEID;
              setMemberZeroInfo(data);
              deferred.resolve();
            }, ()=> {
              setMemberZeroInfo(data);
              deferred.resolve();
            })
          } else {
            setMemberZeroInfo(data);
            deferred.resolve();
          }
        }).catch((error)=> {
          failRetrieveMember(error, 'IBZERO', tokenUrlOB);
        });
    } else if (userType === 'IBPLUS' && SessionStorage.get('retrieveMemberDetailV2')) {
      const memberDetailSessionV2 = SessionStorage.get('retrieveMemberDetailV2');
      const mail = memberDetailSessionV2?.memberPersonalDetails?.person?.emailAddress?.email ?? '';
      if (mail.length>0){
        digestSHA256(mail).then((hashEID)=> {
          memberDetailSessionV2.memberPersonalDetails.person.emailAddress.hashEID = hashEID;
          setMemberIBPlusInfoV2(memberDetailSessionV2);
          deferred.resolve();
        }, ()=> {
          setMemberIBPlusInfoV2(memberDetailSessionV2);
          deferred.resolve();
        })
      } else {
        setMemberIBPlusInfoV2(memberDetailSessionV2);
        deferred.resolve();
      }
    } else if (userType === 'IBPLUS') {
      /** Call diferents services to retrieve member info */
      const userId = getMemberIdByToken();

      /** Retrieve Member Detail Service V2 */
      const serviceRetrieveMemberDetailV2 = retrieveMemberDetailV2 + userId;
      // 3 reintentos para retrieveMemberDetailV2 IBPLUS
      const retrieveMemberDetailV2Prom = getCustomerDataServiceRetries(serviceRetrieveMemberDetailV2, authorizationToken, language, 0);

      retrieveMemberDetailV2Prom.then(
        (dataMDv2) => {
          SessionStorage.set('retrieveMemberDetailV2', dataMDv2);
          const mail = dataMDv2?.memberPersonalDetails?.person?.emailAddress?.email ?? '';
          if (mail.length>0){
            digestSHA256(mail).then((hashEID)=> {
              dataMDv2.memberPersonalDetails.person.emailAddress.hashEID = hashEID;
              setMemberIBPlusInfoV2(dataMDv2);
              deferred.resolve();
            }, ()=> {
              setMemberIBPlusInfoV2(dataMDv2);
              deferred.resolve();
            })
          } else {
            setMemberIBPlusInfoV2(dataMDv2);
            deferred.resolve();
          }
        },
        (error) => {
          failRetrieveMember(error, 'IBPLUS', tokenURL);
        },
      );
    }
    else {
      failRetrieveMember({}, 'IBPLUS', tokenURL);
    }
    return deferred.promise();
  }
  return getMemberDataInside(authorizationToken, language, userType);
};

/**
* @description Functions call to external service store session
* @param {urlService} Url of service to call
* @param {parameters} Params
* @returns {promise} resolve: response with the store session id
* reject: if something has gone wrong it returns the error
*/
const callServiceSSO = (urlService, parameters) => {
  const deferred = $.Deferred();

  const checkSSOPromise = (round) => {
    const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS') ? Cookies.get('IBERIACOM_SSO_ACCESS') : '';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessTokenTxt}`,
    };

    const roundAux = round || 0;

    if (roundAux <= common.MAX_ATTEMPS) {
      callService(urlService, headers, JSON.stringify(parameters), 'POST').done((data) => {
        deferred.resolve(data);
      }).fail((error) => {
        if (error.status === 401) {
          refreshToken(globalAppToken, tokenURL).always(() => {
            checkSSOPromise(roundAux + 1);
          });
        } else {
          deferred.reject();
        }
      });
    } else {
      deferred.reject();
    }
    return deferred.promise();
  };
  return urlService.length > 0 && parameters !== undefined && checkSSOPromise();
};




/*
 * Logic to check if the user is logged and return an object with the user information
 */

const loggedService = () => {
  const deferred = $.Deferred();
  const isLogged = isLogado();
  let getCusDatSes; let acccookie; let accSS; let tkURL; let accSalesforceSS; let accSalesforceCookie;
  function loggedServiceInside() {
    getCusDatSes = getCustomerDataSession();
    const removeUserInfo = () => {
      SessionStorage.remove('customerData');
      SessionStorage.remove('retrieveMemberDetailV2');
      SessionStorage.remove('accessToken');
      SessionStorage.remove('customerDataOB');
      SessionStorage.remove('accessTokenOB');
    };
    if (isLogged.userType === 'OB') {
      acccookie = Cookies.get('IBERIACOM_SSO_ONB_ACCESS');
      accSS = SessionStorage.get('accessTokenOB');
      tkURL = tokenUrlOB;
      if (getCusDatSes && getCusDatSes.dataLanguage !== localeg) {
        getCusDatSes = null;
      }
    } else {
      if (getCusDatSes && (getCusDatSes.dataMarket !== marketg || getCusDatSes.dataLanguage !== localeg) && isLogged.userType === 'IBPLUS') {
        getCusDatSes = null;
        SessionStorage.remove('retrieveMemberDetailV2');
      }
      acccookie = Cookies.get('IBERIACOM_SSO_ACCESS');
      accSS = SessionStorage.get('accessToken');
      accSalesforceCookie = Cookies.get('IBERIACOM_SSO_ACCESS_SALESFORCE');
      accSalesforceSS = SessionStorage.get('accessTokenSalesforce');
      tkURL = tokenURL;
    }

    if (isLogged.userLogged && getCusDatSes == null && acccookie !== undefined) {
      getMemberData(acccookie, `${localeg}-${marketg}`, isLogado().userType).done(() => {
        getCusDatSes = getCustomerDataSession();
        if (getCusDatSes == null) {
          deleteloggedcookies();
          deferred.reject();
        } else {
          if (digital_data.Quadrigam === 'IBCAPS') {
            window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
          }
          deferred.resolve();
        }
      }).fail(() => {
        SessionStorage.remove('customerData');
        SessionStorage.remove('retrieveMemberDetailV2');
        SessionStorage.remove('accessToken');
        SessionStorage.remove('customerDataOB');
        SessionStorage.remove('accessTokenOB');
        deleteloggedcookies();
        deferred.reject();
      });
    } else if (isLogged.userLogged && getCusDatSes !== null
          && accSS === acccookie && accSalesforceSS === accSalesforceCookie) {
      if (digital_data.Quadrigam === 'IBCAPS' && !(LocalStorage.get('IB_PERMANENT_LOGIN') === 'true')) {
        window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
      }
      deferred.resolve();
    } else if (isLogged.userLogged && (getCusDatSes !== null && (accSS !== acccookie || accSalesforceSS !== accSalesforceCookie) || getCusDatSes == null)) {
      // Refresh Salesforce and Keycloack Token
      removeUserInfo();
      refreshToken(globalAppToken, tkURL)
        .done(() => {
          if (SessionStorage.get('anonymousToken') == null) {
            getAppToken(globalAppToken, tokenURL).done((tokenData) => {
              getMemberData(tokenData, `${localeg}-${marketg}`, isLogado().userType).done(() => {
                getCusDatSes = getCustomerDataSession();
                if (getCusDatSes == null) {
                  deleteloggedcookies();
                  deferred.reject();
                } else {
                  if (digital_data.Quadrigam === 'IBCAPS') {
                    window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
                  }
                  deferred.resolve();
                }
              }).fail(() => {
                deleteloggedcookies();
                deferred.reject();
              });
            }).fail(() => {
              deleteloggedcookies();
              deferred.reject();
            });
          } else {
            removeUserInfo();
            deleteloggedcookies();
            Cookies.set('JSESSIONID', '', { path: '/', sameSite: 'strict' });
            deferred.reject();
          }
        }).fail(() => {
          deleteloggedcookies();
          deferred.reject();
        });
    } else {
      deleteloggedcookies();
      SessionStorage.remove('customerData');
      SessionStorage.remove('retrieveMemberDetailV2');
      SessionStorage.remove('accessToken');
      SessionStorage.remove('customerDataOB');
      SessionStorage.remove('accessTokenOB');
      deferred.reject();
    }
    return deferred.promise();
  }
  return loggedServiceInside();
};


export {
  loggedService,
  isLogado,
  isTokenExpired,
  getCustomerDataSession,
  refreshToken,
  logoutIBPlusService,
  getAppToken,
  getMemberData,
  callServiceSSO,
  setCookiesSalesforce,
  setTokenKeycloack,
  generateLoginEvent,
  serviceCallWithRefresh,
  getAnonymousTokenPromise,
  getCustomerDataServiceRetries,
  getMemberIdByToken
};
