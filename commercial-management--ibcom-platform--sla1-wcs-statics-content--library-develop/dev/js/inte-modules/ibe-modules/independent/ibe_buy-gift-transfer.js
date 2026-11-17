import { getCustomerDataSession,refreshToken, isLogado, callServiceSSO } from '../manage/ibe_logged-service';
import { showErrorModal, redirectByQuadrigam } from '../general/ibe_inte-util';
import retrieveGlobalVariables from '../general/ibe_variables';
import { common, updateDatalayer, updateDigitalData } from '../manage/ibe_common';
import * as SessionStorage from '../manage/SessionStorage';
import { callService } from '../manage/ibe_anonymous-services';

const { localeg, marketg, globalAppToken } = retrieveGlobalVariables();

/**
 * @name setDatalayer
 * @description  Function that inserts the Quadrigam and
 * the tracking code depending on the code
 * @param {string} code functionality code
 */
const setDatalayer = (code) => {
  switch (code) {
    case 'buy_avios_points':
      datalayer_general.quadrigam = 'IBBCPA';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/IBBCPA`;
      digital_data.Quadrigam = 'IBBCPA';
			digital_data.TrackingCode = `${localeg}/${marketg}/IBBCPA`;
      updateDatalayer('view');
      updateDigitalData('view');
      break;
    case 'buy_avios_ibcards':
      datalayer_general.quadrigam = 'IBBCCA';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/IBBCCA`;
      digital_data.Quadrigam = 'IBBCCA';
			digital_data.TrackingCode = `${localeg}/${marketg}/IBBCCA`;
      updateDatalayer('view');
      updateDigitalData('view');
      break;
    case 'gift_avios_points':
      datalayer_general.quadrigam = 'IBBRPA';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/IBBRPA`;
      digital_data.Quadrigam = 'IBBRPA';
			digital_data.TrackingCode = `${localeg}/${marketg}/IBBRPA`;
      updateDatalayer('view');
      updateDigitalData('view');
      break;
    case 'gift_avios_ibcards':
      datalayer_general.quadrigam = 'IBBRCA';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/IBBRCA`;
      digital_data.Quadrigam = 'IBBRCA';
			digital_data.TrackingCode = `${localeg}/${marketg}/IBBRCA`;
      updateDatalayer('view');
      updateDigitalData('view');
      break;
    case 'transfer_avios':
      datalayer_general.quadrigam = 'IBBTCA';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/IBBTCA`;
      digital_data.Quadrigam = 'IBBTCA';
			digital_data.TrackingCode = `${localeg}/${marketg}/IBBTCA`;
      updateDatalayer('view');
      updateDigitalData('view');
      break;
    default:
      break;
  }
};

/**
 * @description Displays a modal that allows user to select a payment method
 * @param info Param that contains type of action (buy or gift)
 */
const modal = (info) => {
  const type = typeof info === 'object' ? info.data.code : info;
  const modal = $('.inte-buyAvios-modal');
  const title = $('[data-gifttitle]', modal);

  const acceptButtonAction = () => {
    const inputValue = $('input:checked', modal).val();
    if (inputValue) {
      let partnerCode;
      if (inputValue === 'CC') {
        partnerCode = 'IBP6';
      } else if (inputValue === 'IBC') {
        partnerCode = 'IBC';
      }
      $('.inte-modal-closebtn', modal).trigger('click');
      callSSO(type, partnerCode);
    }
  };

  const acceptButton = $('.inte-modal-acceptbtn');
  acceptButton.click(function () { acceptButtonAction() });
 
  if (type === 'buy') {
    title.html(title.data('buytitle'));
  } else {
    title.html(title.data('gifttitle'));
  }
  dFrontJs.ibe_modal.createModal('.inte-buyAvios-modal');
  dFrontJs.ibe_modal.showModal('.inte-buyAvios-modal');
}

const deferred = $.Deferred();

const hasIberiaCard = (round, accountIdentifier) => {
  const roundAux = round || 0;
  const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');

  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: `Bearer ${accessTokenTxt}`
  };
  if (roundAux <= common.MAX_ATTEMPS) {
    const serviceEligibleTransactions = eligibleTransactions.replace('{accountIdentifier}', accountIdentifier);
    callService(serviceEligibleTransactions, headers, undefined, 'GET')
      .done((data) => {
        if (data) {
          let isEligibleForIberiaCard = data.hasIberiaCard;
          if (isEligibleForIberiaCard !== undefined) {
            deferred.resolve(isEligibleForIberiaCard);
          } else {
            deferred.reject(false);
          }
        }
      })
      .fail((error) => {
        if (error.status === 401) {
          refreshToken(globalAppToken, tokenURL).always(() => {
            hasIberiaCard(roundAux + 1);
          });
        } else {
          deferred.reject(false);
        }
      });
  } else {
    deferred.reject(false);
  }
  return deferred.promise();
}


const checkUser = () => {
  const getCusDatSes = getCustomerDataSession();
  const isLogged = isLogado();

  if (getCusDatSes !== null && isLogged.userLogged) {
    let isEligibleForAviosPurchase, isEligibleForAviosTransfer, isEligibleForAviosGift,
      isEligibleForIberiaCard = false, memberDetailSessionV2, accountIdentifier;

    if (SessionStorage.get('retrieveMemberDetailV2')) {
      memberDetailSessionV2 = SessionStorage.get('retrieveMemberDetailV2');
      accountIdentifier = memberDetailSessionV2.memberPersonalDetails.identifier;
    }

    isEligibleForAviosPurchase = memberDetailSessionV2.memberPersonalDetails.otherStatuses.isEligibleForAviosPurchase || false;
    isEligibleForAviosTransfer = memberDetailSessionV2.memberPersonalDetails.otherStatuses.isEligibleForAviosTransfer || false;
    isEligibleForAviosGift = memberDetailSessionV2.memberPersonalDetails.otherStatuses.isEligibleForAviosGift || false;

    if (isEligibleForAviosPurchase || isEligibleForAviosGift) {
      let hasIberiaCardProm = hasIberiaCard(0, accountIdentifier);
      hasIberiaCardProm.always((data) => {
        isEligibleForIberiaCard = data;

        if(isEligibleForAviosPurchase && isEligibleForIberiaCard){
          $('[data-functionalcode=buy_avios]').on('click', { code: `buy` }, modal);
        } else {
          $('[data-functionalcode=buy_avios]').on('click', { code: `buy` }, callSSO);
        }

        if(isEligibleForAviosGift && isEligibleForIberiaCard){
          $('[data-functionalcode=gift_avios]').on('click', { code: `gift` }, modal);
        } else {
          $('[data-functionalcode=gift_avios]').on('click', { code: `gift` }, callSSO);
        }

      });
    }

    if (!isEligibleForAviosPurchase) {
      $('[data-functionalcode=buy_avios]').addClass('hidden');
      $('[data-functionalcode=buy_avios]').closest('.ibe-minibox-icon__container').children('.inte-disclaimer').removeClass('hidden');
    }

    if (!isEligibleForAviosGift) {
      $('[data-functionalcode=gift_avios]').addClass('hidden');
      $('[data-functionalcode=gift_avios]').closest('.ibe-minibox-icon__container').children('.inte-disclaimer').removeClass('hidden');
    }

    if (!isEligibleForAviosTransfer) {
      $('[data-functionalcode=transfer_avios]').addClass('hidden');
      $('[data-functionalcode=transfer_avios]').closest('.ibe-minibox-icon__container').children('.inte-disclaimer').removeClass('hidden');
    } else {
      $('[data-functionalcode=transfer_avios]').on('click', { code: `transfer` }, callSSO);
    }
  }
  dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', false);
  dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', '.ibe-minibox-icon__title');
}

$(document.body).on('segmentationLoaded', checkUser);

const callSSO = (info, clientId) => {
  const type = typeof info === 'object' ? info.data.code : info;
  let partnerIdentifier = clientId || 'IBP6';
  dFrontJs.ibe_loading.open('body');

  const serviceSuccess = (resp) => {
    let sessionId = resp.sessionIdentifier;
    let accountIdentifier;
    let language = localeg;
    let ssoSource = 'IB';
    
    if (SessionStorage.get('retrieveMemberDetailV2')) {
      let memberDetailSessionV2 = SessionStorage.get('retrieveMemberDetailV2');
      accountIdentifier = memberDetailSessionV2.memberPersonalDetails.identifier || "";
    }

    let ssodata = accountIdentifier + "|" + sessionId + "|" + language;

    function sendInfoSSO () {
      let actionURL = clientId === 'IBC' ? $('#loggedUserDefaults').attr('data-buyGiftIbCards-url') : $('#loggedUserDefaults').attr('data-buyGiftTransfer-url');

      const form = $('<form>', { method: 'POST', action: actionURL, class: 'hidden', target: 'frameAvios' });
      form.append($('<input>', { name: 'ssoSource', value: ssoSource }))
        .append($('<input>', { name: 'ssoProduct', value: type }))
        .append($('<input>', { name: 'ssoData', value: ssodata }))
      $('body').append(form);

      $('.ibe-infocheckin').append('<iframe id="aviosIframe" class="col-lg-12 col-xs-12" name="frameAvios" src="" style="min-height: 50em;background-color: white;">Your Browser does not support iframes.</iframe>');
      document.getElementById('aviosIframe').onload = function () {
        $(window).scrollTop(0);
        dFrontJs.ibe_loading.close('body');
      }
      $('.ibe-infocheckin .row').addClass('hidden');
      form.submit();
    }

    if (clientId && clientId === 'IBC') {
      sendInfoSSO();
    } else {
      const encryptServiceSuccess = (data) => {
        ssodata = data.clients[0].dataSet[0].value;
        sendInfoSSO();
      }

      const encryptServiceFailure = () => {
        showErrorModal($('#loggedUserDefaults').attr('data-inte-modalstoresession'), {
          btnclose: true,
          btnaccept: true,
          btncancel: false,
          closereload: false,
          bodyNoClose: true,
        });
        dFrontJs.ibe_loading.close('body');
      }

      let params = {
        transformType: `ENCRYPT`,
        "clients": [{
          "clientId": partnerIdentifier,
          "dataSet": [{
            "key": "token",
            "value": `${ssodata}`
          }]
        }]
      };

      callServiceSSO(encryptionDataService, params).then(encryptServiceSuccess, encryptServiceFailure);
    }

  }

  const serviceFailure = () => {
    showErrorModal($('#loggedUserDefaults').attr('data-inte-modalstoresession'), {
      btnclose: true,
      btnaccept: true,
      btncancel: false,
      closereload: false,
      bodyNoClose: true,
    });
    dFrontJs.ibe_loading.close('body');
  }

  let refreshTokenTxt = Cookies.get('IBERIACOM_SSO_REFRESH');
  let params = {
    refreshToken: `${refreshTokenTxt}`,
    channelIdentifier: `${globalAppToken}`,
    partnerIdentifier: `${partnerIdentifier}`,
  };
  callServiceSSO(storeSessionService, params).then(serviceSuccess, serviceFailure);
}

// Identificate button redirect to login page with referralURL parameter
if ($('[data-functionalcode=identificateButton]').length > 0) {
  const loginRedirect = `/integration/ibplus/login/?referralURL=${encodeURIComponent(document.location.href)}`;
  $('[data-functionalcode=identificateButton]').click(() => {
    window.location.href = loginRedirect;
  });
}
if ($('[data-functionalcode=hazteIberiaPlusIBZeroButton]').length > 0) {
  $('[data-functionalcode=hazteIberiaPlusIBZeroButton]').click(() => {
    redirectByQuadrigam(marketg, localeg, 'IRUPG');
  });
}

if ($('[data-functionalcode=gift_avios]').length > 0) {
  checkUser();
}
