import { callService } from './ibe_anonymous-services';
import { getAppToken } from './ibe_logged-service';
import { common } from './ibe_common';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';

const {
  localeg, marketg, tokenURL, globalAppToken,
} = retrieveGlobalVariables();

/*
Function in charge of invoking the service that validates the PNR for theBest guaranteed price page.
*/
function sendPNRValidate(params) {
  const serviceURL = $('#servicePNRValidate').attr('data-inte-propertiesvalidate') + params;
  const deferred = $.Deferred();
  const method = 'GET';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };

  function PNRValidateServicePromise(currentAttemps) {
    const curr = currentAttemps || 0;
    if (curr <= common.MAX_ATTEMPS) {
      getAppToken(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const PNRValidatePromise = callService(serviceURL, headers, params, method);
        PNRValidatePromise.done((data) => {
          deferred.resolve(data);
        });
        PNRValidatePromise.fail((error) => {
          if (error.status === 401) {
            SessionStorage.remove('anonymousToken');
            PNRValidateServicePromise(curr + 1);
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
  return PNRValidateServicePromise();
}

function sendRequestBestPrice(params) {
  const serviceURL = $('#serviceFormValidate').attr('data-inte-propertiesValiForm');
  const deferred = $.Deferred();
  const method = 'POST';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };

  function BestPriceServicepromise(currentAttemps) {
    const curr = currentAttemps || 0;

    if (curr <= common.MAX_ATTEMPS) {
      getAppToken(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const bestPricePromise = callService(serviceURL, headers, JSON.stringify(params), method);
        bestPricePromise.done((data) => {
          deferred.resolve(data);
        });
        bestPricePromise.fail((error) => {
          if (error.status === 401) {
            SessionStorage.remove('anonymousToken');
            BestPriceServicepromise(curr + 1);
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
  return BestPriceServicepromise();
}
export {
  sendPNRValidate,
  sendRequestBestPrice,
};
