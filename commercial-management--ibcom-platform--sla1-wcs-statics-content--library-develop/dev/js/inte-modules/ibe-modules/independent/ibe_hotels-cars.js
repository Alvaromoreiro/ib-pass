/**
 * @description Module for SSO in Hoteles and Cars page (AVIMON)
 */
import { isLogado, getCustomerDataSession, refreshToken, callServiceSSO } from '../manage/ibe_logged-service';
import { showErrorModal, redirectByQuadrigam } from '../general/ibe_inte-util';
import retrieveGlobalVariables from '../general/ibe_variables';
import { callService } from '../manage/ibe_anonymous-services';
import { common } from '../manage/ibe_common';
import * as SessionStorage from '../manage/SessionStorage';

const { localeg, marketg, globalAppToken } = retrieveGlobalVariables();

/**
* @description The logged user accepts terms and conditions and once accepted the user is redirected to the external one.
* If the user is not logged in, he is redirected to the intermediate login indicating that we come from "aviosandmoney"
*/
function ssoHotelsCars() {
  const isLogged = isLogado();

  if (isLogged.userLogged && (isLogged.userType !== null && isLogged.userType !== 'IBZERO' && !isLogged.isSoftUser)) {
    const deferred = $.Deferred();

    /**
   * Functions call to external service CommercialSellingData to get Markets' Commercial Selling Data List
   * @param {Number} round Iteration number of access to CommercialSellingData service
   * @returns {promise} resolve: response with the currency code associated with the current market
   * reject: if something has gone wrong it returns EUR by default
   */
    const getCurrency = (round) => {
      const roundAux = round || 0;
      const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');

      let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessTokenTxt}`
      };
      if (roundAux <= common.MAX_ATTEMPS) {
        callService(commercialSellingDataService, headers, undefined, 'GET')
          .done((data) => {
            if (data.length > 0) {
              let object = data.find(element => element.market.code === `${marketg}`);
              if (object !== undefined && object.length > 0) {
                deferred.resolve(object.currency.code);
              } else {
                deferred.reject("EUR");
              }
            }
          })
          .fail((error) => {
            if (error.status === 401) {
              refreshToken(globalAppToken, tokenURL).always(() => {
                getCurrency(roundAux + 1);
              });
            } else {
              deferred.reject('EUR');
            }
          });
      } else {
        deferred.reject('EUR');
      }
      return deferred.promise();
    }

    /**
   * Function that redirect user to third party
   * @param {String} resp Response from StoreSession service with the session identifier
   */
    const serviceSuccess = (resp) => {
      const customerData = getCustomerDataSession();
      const currencyServiceProm = getCurrency();
      let memberDetailSessionV2;

      if (SessionStorage.get('retrieveMemberDetailV2')) {
        memberDetailSessionV2 = SessionStorage.get('retrieveMemberDetailV2');
        const membershipID = memberDetailSessionV2.memberPersonalDetails.identifier;
        
        currencyServiceProm.always((data) => {
          const form = $('<form>', { method: 'POST', action: $('#loggedUserDefaults').attr('data-switchfly-url'), class: 'hidden' });
          form.append($('<input>', { name: 'securityToken', value: resp.sessionIdentifier }))
            .append($('<input>', { name: 'membershipID', value: membershipID }))
            .append($('<input>', { name: 'currencyCode', value: data }))
            .append($('<input>', { name: 'refererURL', value: `${window.location.hostname}/${marketg.toLowerCase()}/${localeg.toLowerCase()}/` }))
            .append($('<input>', { name: 'language', value: customerData.preferredLanguage }))
            .append($('<input>', { name: 'journeyType', value: '' }))
            .append($('<input>', { name: 'channelFeeFlag', value: 'N' }))
            .append($('<input>', { name: 'flagAmendmentFee', value: 'N' }))
            .append($('<input>', { name: 'cancellationFeeFlag', value: 'Y' }));
          $('body').append(form);
          form.submit();
          dFrontJs.ibe_loading.close('body');
        });
      } else {
        showErrorModal($('#loggedUserDefaults').attr('data-inte-modalstoresession'), {
          btnclose: true,
          btnaccept: true,
          btncancel: false,
          closereload: false,
          bodyNoClose: true,
        });
      }
    };

    /**
   * Function that shows a modal with a error message
   */
    const serviceFailure = () => {
      showErrorModal($('#loggedUserDefaults').attr('data-inte-modalstoresession'), {
        btnclose: true,
        btnaccept: true,
        btncancel: false,
        closereload: false,
        bodyNoClose: true,
      });
      dFrontJs.ibe_loading.close('body');
    };

    const refreshTokenTxt = Cookies.get('IBERIACOM_SSO_REFRESH');
    const params = {
      refreshToken: `${refreshTokenTxt}`,
      channelIdentifier: `${globalAppToken}`,
      partnerIdentifier: 'SWF',
    };

    dFrontJs.ibe_loading.open('body');
    callServiceSSO(storeSessionService, params).then(serviceSuccess, serviceFailure);

  } else if(isLogged.isSoftUser && hiddenSoftLogin == "true") {
    window.location.href = '/integration/ibplus/login/?externalpartner=aviosandmoney';
    
  } else if (isLogged.userType !== null && isLogged.userType === 'IBZERO') {
    redirectByQuadrigam(marketg, localeg, 'IRUPG');
  } else {
    window.location.href = '/integration/ibplus/login/?externalpartner=aviosandmoney';
  }
}

// Logic button "Continue"
$('#checkSubmit').click(() => {
  if (dFrontJs.ibe_validate.validateForm('#formCheck')) {
    ssoHotelsCars();
  }
});
const changeTextButton = function () {
  if ($('#checkSubmit').length > 0) {
    const isLogged = isLogado();
    if (isLogged.userLogged && (isLogged.userType !== null && isLogged.userType === 'IBZERO')) {
      const button = $('#checkSubmit');
      button.html(button.attr('data-inte-zero'));
    }
  }
};
$(document).on('loginEventWCS', changeTextButton);
changeTextButton();
