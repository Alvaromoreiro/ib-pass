import * as SessionStorage from './SessionStorage';
function callService(serviceUrl, headers, params, method) {
  let mthd = method;
  if (!mthd) {
    mthd = 'GET';
  }
  return $.ajax({
    url: serviceUrl,
    xhrFields: {
      withCredentials: true
    },
    type: mthd,
    headers,
    data: params,
  });
}

function callTokenService(serviceUrl, authorizationToken, params) {
  // Default headers
  const headers = {
    Authorization: `Basic ${authorizationToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  return callService(serviceUrl, headers, params, 'POST');
}

function generateAnonymousToken(serviceUrl, authorizationToken) {
  return callTokenService(serviceUrl, authorizationToken, $.param({ grant_type: 'client_credentials' }));
}

function getAppTokenForServices(globalAppToken, tokenURL) {
  const deferred = $.Deferred();
  const anonymousToken = SessionStorage.get('anonymousTokenForService');
  if (!anonymousToken) {
    generateAnonymousToken(tokenURL, globalAppToken).done((tokenResponse) => {
      SessionStorage.set('anonymousTokenForService', tokenResponse.access_token);
	  SessionStorage.set('anonymousToken', tokenResponse.access_token);
      //SessionStorage.remove('accessToken');
      //deleteloggedcookies();
      deferred.resolve(tokenResponse.access_token);
    }).fail(() => {
	  SessionStorage.remove('anonymousToken');
      deferred.reject();
    });
  } else deferred.resolve(anonymousToken);
  return deferred.promise();
}
export {
  getAppTokenForServices,
  callTokenService,
  generateAnonymousToken,
  callService
};
