import { callService } from './ibe_anonymous-services';
import { getAppToken } from './ibe_logged-service';
import { common } from './ibe_common';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';

const {
  localeg, marketg, tokenURL, globalAppToken,
} = retrieveGlobalVariables();

/*
Function in charge of invoking the respective services for the landing of Petition of Invoices:
-Request Iberia Invoice Issue REST POST
-Request Iberia Invoice Reissue REST PUT
-Request Iberia Invoice Duplicate REST GET
-Request BAH Invoice REST POST
-Request Iberia Invoice Search REST GET
*/
function sendInvoice(params, invType) {
  const selectID = $('#servicesInvoice');
  const deferred = $.Deferred();
  let serviceURL;
  let method = 'GET';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };
  if (params.restURLParams !== undefined && invType == 'search') {
    const search = $('#ticketsInvoiceService').attr('data-inte-propertiesSearch');
    serviceURL = search + params.restURLParams;
    params.restURLParams = undefined;
  } else if (invType === 'bah') {
    const requestBAH = $('#journeysInvoiceService').attr('data-inte-propertiesRequestBAH');
    serviceURL = requestBAH;
    method = 'POST';
  } else if (invType === 'issue') {
    const issue = selectID.attr('data-inte-propertiesIssue');
    serviceURL = issue;
    method = 'POST';
    params = JSON.stringify(params);
  } else if (invType === 'reissue') {
    const reIssue = selectID.attr('data-inte-propertiesReIssue');
    serviceURL = reIssue;
    method = 'PUT';
    params = JSON.stringify(params);
  } else if (params.restURLParams && invType === 'duplicate') {
    const duplicate = selectID.attr('data-inte-propertiesDuplicate');
    serviceURL = duplicate + params.restURLParams;
    params.restURLParams = undefined;
  }

  function invoiceServicePromise(currentAttemp) {
    const curr = currentAttemp || 0;
    if (curr <= common.MAX_ATTEMPS) {
      getAppToken(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const invoicePromise = callService(serviceURL, headers, params, method);
        invoicePromise.done((data) => {
          deferred.resolve(data);
        });
        invoicePromise.fail((error) => {
          if (error.status === 401) {
            SessionStorage.remove('anonymousToken');
            invoiceServicePromise(curr + 1);
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
  return invoiceServicePromise();
}
function sendProvinces(params) {
  let serviceURL = $('#servicesInvoice').attr('data-inte-propertiesProvince');
  const method = 'GET';
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': `${localeg}-${marketg}`,
  };
  if (params.restURLParams !== undefined) {
    serviceURL += params.restURLParams;
    params.restURLParams = undefined;
  }

  function communitiesServicePromise(currentAttemp) {
    const curr = currentAttemp || 0;
    const deferred = $.Deferred();
    if (curr <= common.MAX_ATTEMPS) {
      getAppToken(globalAppToken, tokenURL).done((tokenData) => {
        headers.Authorization = `Bearer ${tokenData}`;
        const communitiesPromise = callService(serviceURL, headers, params, method);
        communitiesPromise.done((data) => {
          deferred.resolve(data);
        });
        communitiesPromise.fail((error) => {
          if (error.status === 401) {
            SessionStorage.remove('anonymousToken');
            communitiesServicePromise(curr + 1);
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
  return communitiesServicePromise();
}
export {
  sendProvinces,
  sendInvoice,
};
