import { getCustomerDataSession, callServiceSSO } from '../manage/ibe_logged-service';
import { showErrorModal } from '../general/ibe_inte-util';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from '../manage/SessionStorage';

const { localeg, marketg, globalAppToken} = retrieveGlobalVariables();

let isEligibleForCMA, memberDetailSessionV2;

/**
 * @description Logic to show combine avios button or message info
 */
window.showCombineAction = () => {
  const getCusDatSes = getCustomerDataSession();
  if (getCusDatSes !== null) {
    
    if (SessionStorage.get('retrieveMemberDetailV2')) {
      memberDetailSessionV2 = SessionStorage.get('retrieveMemberDetailV2');
      isEligibleForCMA = memberDetailSessionV2.memberPersonalDetails.otherStatuses.isEligibleForCMA;
    }

    if (isEligibleForCMA) {
      $('[data-inte-identify]').addClass('hidden');
      $('[data-functionalcode=combine-avios]').removeClass('hidden').on('click', callServiceStoreSession);
      validParamUrl();
    } else {
      $('[data-inte-identify]').addClass('hidden');
      $('[data-inte-message-info]').removeClass('hidden');
    }
  } else if ($('[data-inte-identify]').length > 0) {
    const loginRedirect = `/integration/ibplus/login/?referralURL=${encodeURIComponent(document.location.href)}`;
    $('[data-inte-identify]').attr('href', loginRedirect);
  }
};
showCombineAction();
$(document.body).on('segmentationLoaded', window.showCombineAction);

// Function LYT-3527 remove screen combine avios
function validParamUrl(){
  const nameParam = new URLSearchParams(window.location.search);
  const parameter = nameParam.get("CombineAvios");
  if(parameter !== null){
    $('.ibe-infocheckin .row').addClass('hidden');
    callServiceStoreSession();
  }
}
// ---------------------------

/**
* Functions call to external service store session
* @param {Number} round Iteration number of access to StoreSession service
*/
function callServiceStoreSession() {
  const getCusDatSes = getCustomerDataSession();
  dFrontJs.ibe_loading.open('body');

  const serviceSuccess = (resp) => {
    //Mandatory
    let sessionId = resp.sessionIdentifier;
    let bttLaunchTime = new Date().toISOString(); 
    let language = localeg;

    //Optionals
    let accountIdentifier = memberDetailSessionV2.memberPersonalDetails.identifier || "";
    let accountType = "INDIVIDUAL";
    let balance = getCusDatSes.avios || "";
    let segment = getCusDatSes.segment || "";

    let account = "";
    if (SessionStorage.get('retrieveMemberDetailV2')) {
      const retrieveMemberDetailV2 = SessionStorage.get('retrieveMemberDetailV2');
      account = retrieveMemberDetailV2.accounts.find(element => element.type === `TOTAL_REWARD`);
    }

    let lastActivityDate = account.lastActivityDate + "T00:00:00.000+00:00" || "";

    let title = memberDetailSessionV2.memberPersonalDetails.person.personName.title || "";
    let firstName = getCusDatSes.name || "";
    let middleName = getCusDatSes.surname || "";
    let lastNames = getCusDatSes.surnames || "";
    let address = getCusDatSes.address || "";
    let postcode = getCusDatSes.postalCode || "";
    let dateOfBirth = memberDetailSessionV2.memberPersonalDetails.person.dateOfBirth || "";
    let emailAddress = getCusDatSes.email || "";

    let accountData = bttLaunchTime + "|" + accountIdentifier + "|" + accountType + "|" + balance + "|" + segment + "|"
      + lastActivityDate + "|" + title + "|" + firstName + "|" + middleName + "|" + lastNames + "|" + postcode + "|"
      + address + "|" + dateOfBirth + "|" + emailAddress + "|" + language;

    const encryptServiceSuccess = (data) => {
      if (data.clients.length > 0) {
        let accountDataEncrypt = data.clients[0].dataSet[0].value;
    
        const form = $('<form>', { method: 'POST', action: $('#loggedUserDefaults').attr('data-combinemyavios-url'), class: 'hidden', target: 'idCombinar' });
        form.append($('<input>', { name: 'programme', value: `IBP` })) 
          .append($('<input>', { name: 'token', value: sessionId }))
          .append($('<input>', { name: 'accountData', value: accountDataEncrypt }))

        $('body').append(form);
        $('.ibe-infocheckin').append('<iframe id="combineIframe" class="col-lg-12 col-xs-12" name="idCombinar" src="" style="min-height: 460px;">Your Browser does not support iframes.</iframe>');
        document.getElementById('combineIframe').onload = function () {
          $(window).scrollTop(0);
          dFrontJs.ibe_loading.close('body');
        }
        $('.ibe-infocheckin .row').addClass('hidden');
        form.submit();
      } else {
        encryptServiceFailure();
      }
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
        "clientId": "CMA",
        "dataSet": [{
          "key": "accountData",
          "value": `${accountData}`
        }]
      }
      ]
    };

    callServiceSSO(encryptionDataService, params).then(encryptServiceSuccess, encryptServiceFailure);
    // dFrontJs.ibe_loading.close('body');
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
    partnerIdentifier: `CMA`
  };
    callServiceSSO(storeSessionService, params).then(serviceSuccess, serviceFailure);
}
