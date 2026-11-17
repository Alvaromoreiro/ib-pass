import { common } from './ibe_common';
import { getAppToken } from './ibe_logged-service';
import { callService } from './ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';

const {
  localeg, marketg, tokenURL, globalAppToken,
} = retrieveGlobalVariables();

function sendRequestAviosDonation(params) {
  const serviceURL = $('#serviceAviosDonation').attr('data-urlservice');
  // var serviceURL = "https://5a0b54d8-0b6c-4ead-934a-15b33f9c10c6.mock.pstmn.io/api/cmlm-avd/rs/v1/avios/donation";
  const deferred = $.Deferred();
  const method = 'POST';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };

  function AviosDonationpromise(currentAttemps) {
    const curr = currentAttemps || 0;
    if (curr <= common.MAX_ATTEMPS) {
      getAppToken(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const AviosDonationPromise = callService(serviceURL, headers,
          JSON.stringify(params), method);
        AviosDonationPromise
          .done((data) => {
            deferred.resolve(data);
          })
          .fail((error) => {
            if (error.status === 401) {
              SessionStorage.remove('anonymousToken');
              AviosDonationpromise(curr + 1);
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
  return AviosDonationpromise();
}
export default sendRequestAviosDonation;
