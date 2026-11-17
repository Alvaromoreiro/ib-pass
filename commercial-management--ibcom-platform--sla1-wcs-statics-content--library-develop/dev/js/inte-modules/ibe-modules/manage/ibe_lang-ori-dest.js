import { common } from './ibe_common';
import { refreshToken } from './ibe_logged-service';
import { getAppTokenForServices } from './ibe_anonymous-services';

function callLanguagesList(serviceUrl, authorizationToken) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authorizationToken}`,
  };
  return $.ajax({
    url: serviceUrl,
    type: 'GET',
    headers,
  });
}

function callCitiesList(serviceUrl, authorizationToken, language) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': language,
    Authorization: `Bearer ${authorizationToken}`,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  };
  return $.ajax({
    url: serviceUrl,
    type: 'GET',
    headers,
  });
}
function getDestinationCitiesListService(serviceUrl, authorizationToken, language) {
  const deferred = $.Deferred();
  callCitiesList(serviceUrl, authorizationToken, language).done((data) => {
    deferred.resolve(data);
  }).fail((error) => {
    deferred.reject({ status: error.status, data: error.responseJSON });
  });
  return deferred.promise();
}

function getOriginCitiesListService(serviceUrl, authorizationToken, language) {
  const deferred = $.Deferred();
  callCitiesList(serviceUrl, authorizationToken, language).done((data) => {
    deferred.resolve(data);
  }).fail((error) => {
    deferred.reject({ status: error.status, data: error.responseJSON });
  });
  return deferred.promise();
}


function getLanguagesListService(serviceUrl, authorizationToken) {
  const deferred = $.Deferred();
  callLanguagesList(serviceUrl, authorizationToken).done((data) => {
    deferred.resolve(data);
  }).fail((error) => {
    deferred.reject({ status: error.status, data: error.responseJSON });
  });
  return deferred.promise();
}
function getLanguagesListInside(deferred, currentAttemps,
  languagesURL, globalAppToken, tokenURL, authoritationToken) {
  const getLanguagesListPromise = getLanguagesListService(languagesURL, authoritationToken);
  const curr = currentAttemps || 0;
  // If service was OK
  getLanguagesListPromise.done((response) => {
    $('#mailLanguage')[0].selectize.clear();
    $('#mailLanguage')[0].selectize.clearOptions();
    $.each(response, function eah() {
      $('#mailLanguage')[0].selectize.addOption({
        value: $(this).attr('code'),
        text: $(this).attr('description'),
      });
    });
    $('#mailLanguage')[0].selectize.refreshOptions(false);
    deferred.resolve();
  });
  // When service fails
  getLanguagesListPromise.fail((error) => {
    if (error.status === 401) {
      // Refresh the token
      if (curr < common.MAX_ATTEMPS) {
        refreshToken(globalAppToken, tokenURL).done(() => {
          getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
            getLanguagesListInside(deferred, curr + 1, languagesURL, globalAppToken,
              tokenURL, tokenData);
          });
        });
      } else {
        deferred.reject();
      }
    } else {
      deferred.reject();
    }
  });
  return deferred.promise();
}
function getLanguagesList(languagesURL, globalAppToken, tokenURL, authoritationToken) {
  const deferred = $.Deferred();
  const currentAttemps = 0;
  // Get Languages List from service
  return getLanguagesListInside(deferred, currentAttemps,
    languagesURL, globalAppToken, tokenURL, authoritationToken);
}
function getOriginCitiesList(originCitiesURL, language,
  globalAppToken, tokenURL, authoritationToken) {
  const deferred = $.Deferred();
  let currentAttemps = 0;
  // Get Origin Cities List from service
  return getOriginCitiesListInside(originCitiesURL, language,
    globalAppToken, tokenURL, authoritationToken);

  function getOriginCitiesListInside(originCitiesURL, language, globalAppToken, tokenURL, authoritationToken) {
    const getOriginCitiesListPromise = getOriginCitiesListService(originCitiesURL, authoritationToken, language);
    // If service was OK
    getOriginCitiesListPromise.done((response) => {
      if (document.getElementById('originCity') != null) {
        $.each(response, function eah() {
          $('#originCity')[0].selectize.addOption({
            value: $(this).attr('code'),
            text: $(this).attr('description'),
          });
        });
        $('#originCity')[0].selectize.refreshOptions(false);
        deferred.resolve();
      }
    });
    // When service fails
    getOriginCitiesListPromise.fail((error) => {
      if (error.status === 401) {
        // Refresh the token
        if (currentAttemps < common.MAX_ATTEMPS) {
          currentAttemps += 1;
          refreshToken(globalAppToken, tokenURL).done(() => {
            getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
              getOriginCitiesListInside(originCitiesURL, language, globalAppToken, tokenURL, tokenData);
            });
          });
        } else {
          deferred.reject();
        }
      } else {
        deferred.reject();
      }
    });
    return deferred.promise();
  }
}

function getDestinationCitiesList(destinationCitiesURL, language,
  globalAppToken, tokenURL, authoritationToken) {
  const deferred = $.Deferred();
  let currentAttemps = 0;
  // Get Destination Cities List from service
  return getDestinationCitiesListInside(destinationCitiesURL, language,
    globalAppToken, tokenURL, authoritationToken);

  function getDestinationCitiesListInside(destinationCitiesURL, language,
    globalAppToken, tokenURL, authoritationToken) {
    const getDestinationCitiesListPromise = getDestinationCitiesListService(destinationCitiesURL,
      authoritationToken, language);
    // If service was OK
    getDestinationCitiesListPromise.done((response) => {
      $.each(response, function eah() {
        $('#firstDestinationCity')[0].selectize.addOption({
          value: $(this).attr('code'),
          text: $(this).attr('description'),
        });
        $('#secondDestinationCity')[0].selectize.addOption({
          value: $(this).attr('code'),
          text: $(this).attr('description'),
        });
      });
      $('#firstDestinationCity')[0].selectize.refreshOptions(false);
      $('#secondDestinationCity')[0].selectize.refreshOptions(false);
      deferred.resolve();
    });
    // When service fails
    getDestinationCitiesListPromise.fail((error) => {
      if (error.status === 401) {
        // Refresh the token
        if (currentAttemps < common.MAX_ATTEMPS) {
          currentAttemps += 1;
          refreshToken(globalAppToken, tokenURL).done(() => {
            getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
              getDestinationCitiesListInside(destinationCitiesURL, language, globalAppToken, tokenURL, tokenData);
            });
          });
        } else {
          deferred.reject();
        }
      } else {
        deferred.reject();
      }
    });
    return deferred.promise();
  }
}
export {
  getLanguagesList,
  getOriginCitiesList,
  getDestinationCitiesList,
};
