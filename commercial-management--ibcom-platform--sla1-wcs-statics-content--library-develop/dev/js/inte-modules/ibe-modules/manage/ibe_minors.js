import { common } from './ibe_common';
import { getAppToken } from './ibe_logged-service';
import { callService, getAppTokenForServices } from './ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';

const {
  localeg, marketg, tokenURL,globalAppToken,
} = retrieveGlobalVariables();

function unaccompaniedMinorService(params) {
  const serviceURL = $('#serviceUnaccompainedMinor').attr('data-inte-propertiesMinorsAlone');
  const deferred = $.Deferred();
  const method = 'POST';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };

  function unaccompaniedMinorServicePromise(currentAttemps) {
    const curr = currentAttemps || 0;
    if (curr <= common.MAX_ATTEMPS) {
      getAppToken(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const unaccompaniedMinorPromise = callService(serviceURL, headers,
          JSON.stringify(params), method);
        unaccompaniedMinorPromise.done((data) => {
          deferred.resolve(data);
        });
        unaccompaniedMinorPromise.fail((error) => {
          if (error.status === 401) {
            SessionStorage.remove('anonymousToken');
            unaccompaniedMinorServicePromise(curr + 1);
          } else {
            deferred.reject(error);
          }
        });
      });
    } else {
      deferred.reject();
    }
    return deferred.promise();
  }
  return unaccompaniedMinorServicePromise();
}
function prefixService() {
  const deferred = $.Deferred();
  const serviceURL = $('#serviceUnaccompainedMinor').attr('data-inte-propertiesPrefix');
  const method = 'GET';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };

  function prefixServicePromise(currentAttemps) {
    const curr = currentAttemps || 0;
    if (curr <= common.MAX_ATTEMPS) {
      getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const prefixPromise = callService(serviceURL, headers, undefined, method);
        prefixPromise.done((data) => {
          deferred.resolve(data);
        });
        prefixPromise.fail((error) => {
          if (error.status === 401) {
            // Refresh the token
            if (curr < common.MAX_ATTEMPS) {
              SessionStorage.remove('anonymousTokenForService');
              prefixServicePromise(curr + 1);
            } else {
              deferred.reject();
            }
          } else {
            deferred.reject();
          }
        });
      });
    } else {
      deferred.reject();
    }
    return deferred.promise();
  }
  return prefixServicePromise();
}
export {
  unaccompaniedMinorService,
  prefixService,
};
