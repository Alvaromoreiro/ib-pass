import retrieveGlobalVariables from '../general/ibe_variables';
import { callService, getAppTokenForServices } from './ibe_anonymous-services';
import { common } from './ibe_common';
import * as SessionStorage from './SessionStorage';
const {
  localeg, marketg, globalAppToken, tokenURL,
} = retrieveGlobalVariables();

/**
  * Function to call voucher services
  * @param {*} action CONDITION - GET - Call Conditions Voucher REST GET service
  *                   SIMULATION or CONFIRMATION or DELETE - POST/PUT/DELETE - Call Merge Voucher REST V1 service
  * @param {*} parameters Parameters of request
  * @returns Promise with of user voucher or reject
  */

const callVoucherService = (action, parameters) => {
  const deferred = $.Deferred();
  let params = parameters;
  let endPoint = $('[data-voucherlookupservice]').length > 0 ? $('[data-voucherlookupservice]').data('voucherlookupservice') : '';
  let type = 'POST';

  const checkVoucherServicePromise = (it) => {
    let round = it;
    const headers = {
      Authorization: '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': `${localeg}-${marketg.toUpperCase()}`,
    };
    round = round || 0;

    if (endPoint.length > 0 && round <= common.MAX_ATTEMPS) {
      getAppTokenForServices(globalAppToken, tokenURL)
        .done((tokenData) => {
          headers.Authorization = `Bearer ${tokenData}`;
          callService(endPoint, headers, params, type)
            .done((data) => {
              deferred.resolve(data);
            })
            .fail((error) => {
              if (error.status === 401) {
                SessionStorage.remove('anonymousTokenForService');
                checkVoucherServicePromise(round + 1);
              } else {
                deferred.reject(error);
              }
            });
        })
        .fail(() => {
          deferred.reject();
        });
    } else {
      deferred.reject();
    }
    return deferred.promise();
  };

  // Call voucher logic
  if (action) {
    if (action === 'SIMULATION' || action === 'CONFIRMATION' || action === 'DELETE') {
      endPoint = $('[data-voucherjoinservice]').length > 0 ? $('[data-voucherjoinservice]').data('voucherjoinservice') : '';
      if (action === 'DELETE') {
        endPoint += '/delete';
      } else if (action === 'CONFIRMATION') {
        type = 'PUT';
      }
    }
    params = JSON.stringify(params);
  }

  return checkVoucherServicePromise();
};
export default callVoucherService;
