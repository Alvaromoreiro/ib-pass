import { refreshToken } from './ibe_logged-service';
import { getAppTokenForServices }  from './ibe_anonymous-services';
import  retrieveGlobalVariables   from '../general/ibe_variables';
import { updateDatalayer, updateDigitalData } from './ibe_common';

const {
  localeg, marketg,
} = retrieveGlobalVariables();

function callPutNewsletter(serviceUrl, authorizationToken, language, requestData) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': language,
    Authorization: `Bearer ${authorizationToken}`,
  };
  return $.ajax({
    url: serviceUrl,
    type: 'PUT',
    headers,
    data: JSON.stringify(requestData),
  });
}
function pushNewsletterService(serviceUrl, authorizationToken, language, requestData) {
  const deferred = $.Deferred();
  callPutNewsletter(serviceUrl, authorizationToken, language, requestData).done((data) => {
    deferred.resolve(data);
  }).fail((error) => {
    deferred.reject({ status: error.status, data: error.responseJSON });
  });
  return deferred.promise();
}
function pushNewsletter(newsletterURL, language, newsLetterRequest,
  globalAppToken, tokenURL, authoritationToken) {
  const deferred = $.Deferred();
  // Push Newsletters calling its service
  const pushNewsletterPromise = pushNewsletterService(newsletterURL, authoritationToken,
    language, newsLetterRequest);
  // If service was OK
  pushNewsletterPromise.done(() => {
    $('#suscription_400').hide();
    $('#emailExito').html($('#email')[0].value);
    const currentDate = new Date();
    const limitDate = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * 5));
    $('#diaLimiteSus').html(limitDate.getDate());
    $('#mesLimiteSus').html(limitDate.getMonth() + 1);
    $('#anoLimiteSus').html(limitDate.getFullYear());
    // Show message success
    $('#suscription_OK').removeClass('hide');
    // Hide form
    $('#subscription').find('fieldset').addClass('hide');
    window.scrollTo(0, document.getElementById('emailExito').offsetTop);
    datalayer_general.quadrigam = 'IBDEPR';
    datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/IBDEPR`;
    digital_data.Quadrigam = 'IBDEPR';
		digital_data.TrackingCode = `${localeg}/${marketg}/IBDEPR`;
    updateDatalayer('view');
    updateDigitalData('view');
    deferred.resolve();
  });
  // When service fails
  pushNewsletterPromise.fail((jqXHR) => {
    if (jqXHR.status === 401) {
      // Refresh the token
      refreshToken(globalAppToken, tokenURL).done(() => {
        getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
          pushNewsletter(newsletterURL, language, newsLetterRequest, globalAppToken,
            tokenURL, tokenData);
        });
      });
    } else if (jqXHR.status === 400) {
      // Bad parameters
      $('#suscription_400').removeClass('hide');
      window.scrollTo(0, document.getElementById('suscription_400').offsetTop);
      deferred.resolve();
    } else if (jqXHR.status === 412) {
      if (jqXHR.data.errors[0].code === 'NWL_10001') {
        // NWL_10001: Email is already on subscriptions
        $('#emailNewsletter').html($('#email')[0].value);
        $('#emailNewsletter_form').attr('href', `http://www.iberia.com/web/newsletter.do?method=remember&sinTransicion=true&email=${$('#email')[0].value}&newsquad=&loginButton=${$('#emailNewsletter_form').text()}`);
        $('#subscription').find('fieldset').addClass('hide');
        $('#suscription_NWL_10001').removeClass('hide');
        window.scrollTo(0, document.getElementById('suscription_NWL_10001').offsetTop);
      } else if (jqXHR.data.errors[0].code === 'NWL_10002') {
        // NWL_10002: Email is already on pending subscriptions
        $('#subscription').find('fieldset').addClass('hide');
        $('#suscription_NWL_10002').removeClass('hide');
        window.scrollTo(0, document.getElementById('suscription_NWL_10002').offsetTop);
      } else {
        // NWL_10000: Email used allows to a registered user.
        $('#subscription').find('fieldset').addClass('hide');
        $('#suscription_NWL_10000').removeClass('hide');
        window.scrollTo(0, document.getElementById('suscription_NWL_10000').offsetTop);
      }
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise();
}
export default pushNewsletter;
