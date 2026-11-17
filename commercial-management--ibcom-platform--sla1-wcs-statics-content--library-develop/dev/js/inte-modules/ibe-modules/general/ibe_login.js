import {
  getQuerystrParams, getQueryParam, getDateByFormat, showErrorModal,
  redirectByQuadrigam, digestSHA256, isPrivateAreaApp,
} from './ibe_inte-util';
import dosegmentation from './ibe_segmentation';
import {
  loggedService, getCustomerDataSession, refreshToken,
  isLogado, logoutIBPlusService, getMemberData, callServiceSSO,
  setCookiesSalesforce, setTokenKeycloack,
  generateLoginEvent,
  getAnonymousTokenPromise,
} from '../manage/ibe_logged-service';

import {
  setNameIBPlus, setRolCIP, setNumberFormat, deleteloggedcookies, common, updateDatalayer, updateDigitalData,
} from '../manage/ibe_common';
// import { universiaIBZero, universiaIBPlusActivo } from '../universia/ibe_universia';
import { generateAnonymousToken, callService, callTokenService } from '../manage/ibe_anonymous-services';

import retrieveGlobalVariables from './ibe_variables';
import * as SessionStorage from '../manage/SessionStorage';
import * as LocalStorage from '../manage/ibe-local-storage';

import { getIdentifierFromToken } from '../manage/ibe_token-utils';
import { attachUpdateUserListener, detachUpdateUserListener, paintLoggedInfo, paintZeroLoggedInfo } from './ibe_user_header';
// eslint-disable-next-line prefer-const
let {
  localeg, marketg, tokenURL, tokenUrlOB, quadrigam,
  globalAppToken, obLoginXML, obLoginSAMLResp,
  obLogoutXML, samlOBURL, salesforceClientId, salesforceURL, loginMicroserviceUrl, salesforceRegistroIBPlus, wineClubDomain, irontecDomain, prestashopDomain, omnichannelDomain,
  storeSessionService, commercialSellingDataService,logoutserviceOB,relaystateOB, formOBLogin, pageONBusiness
} = retrieveGlobalVariables();
const storageErrorIBPLUSkey = 'ibplus-login-error';
const storageIdentityState = 'ib-identity-stateReferral';

/**
 * @description Function to show keep session alive modal and session expired modal
 */
const keepAlive = () => {
  let sessionExpired;
  const isLogged = isLogado();
  const { refreshTokenExpire } = isLogged;

  // Get times
  const expiredTime = getDateByFormat(refreshTokenExpire, 'DD/MM/YYYY hh:mm:ss', true).getTime();
  const currentTime = new Date().getTime();
  const timeModalAlive = (expiredTime - currentTime) > 121000
    ? 121000 : (expiredTime - currentTime);
  const timeKeepAlive = expiredTime - currentTime - 121000;
  /**
   * @description Print count down with format mm:ss
   */
  function countdown() {
    let minutes; let
      seconds;
    let startDate = new Date();
    startDate = startDate.getTime();

    let timeRemaining = parseInt((expiredTime - startDate) / 1000, 10);

    if (timeRemaining >= 0) {
      minutes = parseInt(timeRemaining / 60, 10);
      timeRemaining %= 60;
      seconds = parseInt(timeRemaining, 10);

      $('.inte-modal-clock-min').text((`${minutes}`).slice(-2));
      $('.inte-modal-clock-seg').text((`0${seconds}`).slice(-2));
    }
  }
  // setTimeout using a 32 bit int, the max value allowes is 2147483647
  if (timeKeepAlive < 2147483647) {
    // Session Modals
    setTimeout(() => {
      // Show modal keep alive
      const counter = setInterval(countdown, 1000);
      setTimeout(() => {
        dFrontJs.ibe_modal.createModal('.inte-keepAliveModal');
        dFrontJs.ibe_modal.showModal('.inte-keepAliveModal');
        dFrontJs.ibe_modal.closeModal('#keepsession');
      }, 1000);

      // Show modal session expired
      sessionExpired = setTimeout(() => {
        sessionStorage.setItem('ib-inte.sessionExpired', true);
        deleteloggedcookies();
        window.location.reload();
      }, timeModalAlive);

      // Event click keep alive modal
      $('#keepsession').on('click', () => {
        const tokenUrlService = isLogged.userType === 'OB' ? tokenUrlOB : tokenURL;
        refreshToken(globalAppToken, tokenUrlService).done(() => {
          clearTimeout(sessionExpired);
          clearInterval(counter);
        });
      });
    }, timeKeepAlive);
  }
};
const paintLoggedInfoOB = (data) => {
  if(isLogado().userLogged && !isLogado().isSoftUser || hiddenSoftLogin == "false"){
    if (data) {
      // Remove logged IBPLus
      $('#loggedUser').remove();
      $('#publicUser').addClass('hidden');
      // Hide links onBusiness from menu
      $('[data-target = "#tool_onbusiness"],[data-modal-view = ".fc-dialog-onbusiness"], .inte-linkOB').addClass('hidden');

      const $obUser = $('#loggedOBUser');
      $obUser.removeClass('hidden');
      $('.inte-obUsername', $obUser).find('span').text(setNameIBPlus(data.name, data.surname));
      $('#loggedUserPoints', $obUser).text(setNumberFormat(data.puntos, localeg, marketg));
      const $userModal = $('#OBUserModal');
      $userModal.append(`${data.name} ${data.surname}`).after(`<p class='ibe-header-new__logged-txt'>${data.rolCIP}</p>`);

      $('#OBModalInfo', $obUser).removeClass('hidden').prepend(`<p class='ibe-login__logged-title'>${data.publicis}</p>`);
      $('#OBrolCIP', $obUser).append(setRolCIP(data.rolCIP));
      $('#OBidentifier', $obUser).append(data.userID);
      $('#OBstatus', $obUser).append(data.NivelUsuario);
      $('#OBAmount', $obUser).append(setNumberFormat(data.puntos, localeg, marketg));

      if ($('#avioscheck').length > 0) {
        $('#avioscheck').addClass('hidden');
        $('#pointscheck').removeClass('hidden');
      }

      //Property hide clients points
      if(hiddenClientsPointsOB === "true"){
        $('#OBAmount').addClass('hidden'); 
        $('#sectionPointsOB').addClass('hidden');
      }
      //Property hide links points/voucher
      if(hiddenVoucherPointsLinksOB === "true" || data.rolCode === "I_PART"){
        $('.link-bono').addClass('hidden'); 
        $('.link-puntos').addClass('hidden'); 
      }
      
      if(data.country !== null && data.country !== "ES" && data.country !=="AD" && data.country !== "GI") {
        $("[data-asset-id=1476400808272]").remove();
      }
    }

  } else {
    //Anonymous Header
    $('#publicUser').removeAttr('style').removeClass('hidden');
    $('.isLogged').addClass('hidden');
    $('#loggedOBUser').addClass('hidden');
  }
};


/**
 * Show error modal login
 */
const showIBPLUSLoginError = ({ errorKey } = {errorKey: undefined}) => {
	const loggedProperties = $('#loggedUserDefaults');
	const reportedError = errorKey ?? SessionStorage.get(storageErrorIBPLUSkey);
	if (reportedError) {
		const errorMap = {
			'parental-control': loggedProperties.attr('data-inte-parentalcontrolmsg'),
			general: loggedProperties.attr('data-inte-generalerrormsg'),
			'store-session': loggedProperties.attr('data-inte-modalstoresession')
		};
		const error = errorMap[reportedError] ? errorMap[reportedError] : errorMap.general;
		showErrorModal(error);
		SessionStorage.remove(storageErrorIBPLUSkey);
	}
};

/**
 * @description When the page load this method is executed to load the information of the user (ON Business, IBPlus, Anonymous)
 */
const dologin = (function dologin() {
  const urlParams = getQuerystrParams();
  const referral = decodeURIComponent(urlParams.referralURL);
  const params = getQuerystrParams(referral);
  if (params.invitationID && params.memberID && params.type) {
    SessionStorage.set('ib-plus-app.nomination', params);
    window.history.replaceState(null, null, `${document.location.href.split('?')[0]}?referralURL=${referral.split('?')[0]}`);
  }

  const pointsCheckifApply = () => {
    const custDt = getCustomerDataSession();
    if (custDt !== null) {
      if (custDt !== undefined && custDt.EstadoUsuario === 'logado_pyme' && $('.inte-avioscheck').length > 0) {
        $('.inte-avioscheck').addClass('hidden');
        if(hiddenCheckPayPointsOB == "false"){
          $('.inte-pointscheck').removeClass('hidden');
        }
      }
    }
  };
  const init = () => {
    const codeTracking = $('#loggedUserDefaultsCugs').attr('data-inte-cugs-codeTracking');
    const baseCodS = `${localeg}/${marketg}/`;
    let userMenu = null;
    let isLogged = null;

    // const loggedServicePromise = loggedService();
    const IB_GROUP = $('#SearcherContent').attr('data-ibgroup');
    const travelAgent = getQueryParam('travelAgent');
    let userState;
    function homeQuadrigam() {
      if(quadrigam === "IBHMPA" || quadrigam === "IBHMPI"){
        if (isLogado().userLogged) {
          // Usuario logado: debe ser IBHMPI
          if (digital_data.Quadrigam === 'IBHMPA' || !digital_data.Quadrigam) {
            digital_data.Quadrigam = 'IBHMPI';
            datalayer_general.quadrigam = 'IBHMPI';
          if (datalayer_general.codigoSeguimiento) {
            datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBHMPA', 'IBHMPI');
          }
          if (digital_data.TrackingCode) {
            digital_data.TrackingCode = digital_data.TrackingCode.replace('IBHMPA', 'IBHMPI');
          }
          }
        } else {
          // Usuario NO logado: debe ser IBHMPA
          digital_data.Quadrigam = 'IBHMPA';
          datalayer_general.quadrigam = 'IBHMPA';
        }
      }
    }
    function loggedUser() {
      const loggedServicePromise = loggedService();
      const zero = document.getElementById("logadoZero");
      const nologado = document.getElementById("noLogado");
      const IBplusActivo = document.getElementById("logadoPlusActivo");
      const IBplusNoActivo = document.getElementById("logadoPlusSinPlan");
      const userZero = document.getElementById("IBZERORegister");
      const userUpgrade = document.getElementById("UPGRADEIBplus");

      loggedServicePromise.done(() => {
        // CUGs
        userMenu = getCustomerDataSession();
        isLogged = isLogado();
        // Attach listener to update header on demand
        detachUpdateUserListener();
        attachUpdateUserListener();
        dFrontJs.ibe_loading.close('body');
        if (userMenu.EstadoUsuario === 'logado_pyme') {
          datalayer_general.segmento = userMenu.segmento;
          datalayer_general.userID = userMenu.userID;
          datalayer_general.EstadoUsuario = 'logado_pyme';
          datalayer_general.NivelUsuario = userMenu.NivelUsuario;
          datalayer_general.rolCIP = userMenu.rolCIP;
          datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/${quadrigam}`;
          datalayer_general.avios = userMenu.puntos;
          digital_data.UserSegment = userMenu.segmento;
          digital_data.UserID = userMenu.userID;
          digital_data.UserStatus = userMenu.EstadoUsuario;
          digital_data.UserLevel = userMenu.NivelUsuario;
          digital_data.RolCIP = userMenu.rolCIP;
          digital_data.TrackingCode = `${localeg}/${marketg}/${quadrigam}`;
          digital_data.Avios = userMenu.puntos;

          paintLoggedInfoOB(userMenu);
          // To show on business image, it was not being triggered when opened.
          $('#tool_loggedOB').on('shown.bs.collapse', () => {
            dFrontJs.app.emitInView();
            $('#tool_loggedOB').off('shown.bs.collapse');
          });
          // Hide link redemption search engine
          $('.inte-login-redemption').addClass('hidden');
          homeQuadrigam();
          // Show points check
          //updateDatalayer('view'); Remove for 2 view
          //updateDigitalData('view');
          pointsCheckifApply();
          keepAlive();
          SessionStorage.remove('urlUpgradeRedirect');
        } else if (userMenu != null && isLogado().userType === 'IBPLUS') {
          // Function Simulador Avios class
          if(userUpgrade != null){
            userZero.classList.add('hidden');
            userUpgrade.classList.add('hidden');
          }
          //
          SessionStorage.remove('urlUpgradeRedirect');
          // Function Universia
          // universiaIBPlusActivo(userMenu);
          if(nologado != null){
            if(userMenu.partnersInfo.length > 0){
              if(userMenu.partnersInfo[0].partnerIdentifier === 'SUN'){
                zero.classList.add("hidden");
                nologado.classList.add("hidden");
                IBplusActivo.classList.remove("hidden");
              } else {
                IBplusNoActivo.classList.remove("hidden");
                zero.classList.add("hidden");
                nologado.classList.add("hidden");
              }
            } else {
              IBplusNoActivo.classList.remove("hidden");
              zero.classList.add("hidden");
              nologado.classList.add("hidden");
            }
          }
          //
          if (userMenu.termsAndConditions) {
            userState = isLogged.isSoftUser ? 'logado_ff_soft' : 'logado_ff_hard' ;
            if (quadrigam === 'IBBLUT' || quadrigam === 'IBBLUS') {
              window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`;
            }
            // NOT CUGs
            if ($('.ibe-cub').find('.ibe-search-flights--cug').length <= 0) {
              datalayer_general.segmento = userMenu.segment;
              digital_data.UserSegment = userMenu.segment;
            }
            if (digital_data.Quadrigam === 'IBHMPA') {
              datalayer_general.quadrigam = 'IBHMPI';
              datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBHMPA', 'IBHMPI');
              digital_data.Quadrigam = 'IBHMPI';
              digital_data.TrackingCode = digital_data.TrackingCode.replace('IBHMPA', 'IBHMPI');
            }
            const userIdentifier = getIdentifierFromToken() ?? '';
            datalayer_general.EstadoUsuario = userState;
            if('INFINITAPRIME'== userMenu.category){
              datalayer_general.NivelUsuario = 'INFINITA PRIME';
            }
            else if('IBERIASINGULAR' == userMenu.category){
              datalayer_general.NivelUsuario = 'IBERIA SINGULAR';
            }
            else{
              datalayer_general.NivelUsuario = userMenu.category;
            }
            datalayer_general.userID = userIdentifier;
            datalayer_general.avios = userMenu.avios;
            digital_data.UserID = userIdentifier;
            digital_data.UserStatus = userState;
            if('INFINITAPRIME'== userMenu.category){
              digital_data.UserLevel = 'INFINITA PRIME';
            }
            else if('PLATINOPRIME'== userMenu.category){
              digital_data.UserLevel = 'PLATINO PRIME';
            }
            else if('IBERIASINGULAR' == userMenu.category){
              digital_data.UserLevel = 'IBERIA SINGULAR';
            }
            else{
              digital_data.UserLevel = userMenu.category;
            }
            digital_data.Avios = userMenu.avios;
            paintLoggedInfo(userMenu);
            $('[data-url-private]').each(function eah() {
              if ($(this).attr('data-url-private').length) {
                $(this).attr('href', $(this).attr('data-url-private'));
              }
              $(this).removeAttr('data-url-private');
            });
            // IBPLUS don't need keep alive becasuse refresh dont expire
            //keepAlive();

            const isPrivateLogin = $('[data-login-private]').length > 0 && !$('[data-login-private]').hasClass('hidden') && $('[data-private-content]').length > 0;
            if (isPrivateLogin) {
              const quadrigamLogin = $('[data-login-private]').attr('data-login-private');
              datalayer_general.quadrigam = quadrigamLogin;
              datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${quadrigamLogin}`;
              digital_data.Quadrigam = quadrigamLogin;
              digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${quadrigamLogin}`;
            }

            datalayer_general.hashEID = userMenu.hashEID ?? '';
            digital_data.HashEID = userMenu.hashEID ?? '';
            homeQuadrigam();
            //updateDatalayer('view');
            //updateDigitalData('view');
            if (isPrivateLogin) {
              $('[data-login-private]').addClass('hidden');
              $('[data-private-content]').removeAttr('style');
              datalayer_general.quadrigam = quadrigam;
              datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${quadrigam}`;
              digital_data.Quadrigam = quadrigam;
              digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${quadrigam}`;
            }

            $(document.body).trigger('loginIBPLUSCompleted');
            /** Send event to load angular application * */
            $(document.body).trigger('loginEventWCS');
            // if (quadrigam === 'IBLBTT') {
            //   window.showCombineAction !== undefined && showCombineAction();
            // }
            dFrontJs.ibe_loading.close('body');
          } else if (quadrigam !== 'CGPIBP' && quadrigam !== 'PRIVAC') {
            const showModalTermsConditions = () => {
              dFrontJs.ibe_validate.init();
              dFrontJs.ibe_modal.createModal('.inte-errormodal-terms');
              dFrontJs.ibe_modal.showModal('.inte-errormodal-terms');
              $('#checkAcceptTerms').on('click', () => {
                if (dFrontJs.ibe_validate.validateForm('#formCheck')) {
                  const serviceSuccess = () => {
                    SessionStorage.remove('customerData');
                    SessionStorage.remove('retrieveMemberDetailV2');
                    $('.inte-errormodal-terms').dialog().dialog('close');
                    init();
                    dFrontJs.ibe_loading.close('.inte-loading-modal');
                  };

                  const serviceFailure = () => {
                    $('.inte-termsCondition-error').removeClass('hidden');
                    dFrontJs.ibe_loading.close('.inte-loading-modal');
                    $('#continueLogout').on('click', () => {
                      $('.inte-errormodal-terms').dialog().dialog('close');
                      logoutIBPlusService();
                    });
                  };

                  const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');
                  const headers = {
                    Authorization: `Bearer ${accessTokenTxt}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  };
                  const params = {
                    termsAndConditions: {
                      acceptedDate: new Date().toISOString().substring(0, 10),
                      version: '1.1',
                    },
                  };
                  dFrontJs.ibe_loading.open('.inte-loading-modal');
                  const memberDetailsV2 = SessionStorage.get('retrieveMemberDetailV2');
                  const urlService = $('.inte-errormodal-terms').attr('inte-update-member-service') + memberDetailsV2.memberPersonalDetails.identifier;
                  callService(urlService, headers, JSON.stringify(params), 'PUT').then(serviceSuccess, serviceFailure);
                }
              });
            };
            if (!($('.inte-errormodal-terms').length > 0)) {
              $.ajax({
                method: 'GET',
                url: '/cs/Satellite',
                data: {
                  pagename: 'IB_SE/CacheControl6h/BrowserCache3600/TermsConditionErrorModal',
                  market: marketg,
                  locale: localeg,
                  d: 'Desktop',
                },
              }).done((data) => {
                $('body').append(data);
                showModalTermsConditions();
              });
            } else {
              $('.inte-termsCondition-error').addClass('hidden');
              dFrontJs.ibe_modal.showModal('.inte-errormodal-terms');
            }
          }
        } else if(isLogado().userType==='IBZERO') {
          // Function Simulador Avios class
          if(userZero != null){
            userZero.classList.add('hidden');
            userUpgrade.classList.remove('hidden');
            //Metricas
            document.querySelector('.ibe-avios-simulator-banner__background').addEventListener('click', function() {
              const eventBannerZero = {
                eventName: 'interaccion',
                eventCategory: 'simulador avios',
                eventAction: 'registro ib+',
                eventLabel: ' botón visible usuario iberia zero',
              };
              if (typeof (window.DigitalChange) !== 'undefined') {
                window.DigitalChange('interaction', eventBannerZero);
              }
              if (typeof (window.dataLayer) !== 'undefined') {
                window.dataLayer.push(eventBannerZero, { event: 'interaction' });
              }
            });
          }
          //EJEMPLO
          $('.isLogged').addClass('hidden');
          $('.isLogged-IBZERO').removeClass('hidden');
          $('.isnotlogged ').addClass('hidden');
          //universiaIBZero();
          if(nologado != null){
            zero.classList.remove("hidden");
            nologado.classList.add("hidden");
          }
          userState = isLogged.isSoftUser ? 'logado_ib_soft' : 'logado_ib_hard' ;

          const userIdentifier = getIdentifierFromToken() ?? '';
          datalayer_general.userID = userIdentifier;
          digital_data.UserID = userIdentifier;
          
          datalayer_general.EstadoUsuario = userState;
          digital_data.UserStatus = userState;
          datalayer_general.hashEID = userMenu.hashEID ?? '';
          digital_data.HashEID = userMenu.hashEID ?? '';
          if (digital_data.Quadrigam === 'IBHMPA') {
            datalayer_general.quadrigam = 'IBHMPI';
            datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBHMPA', 'IBHMPI');
            digital_data.Quadrigam = 'IBHMPI';
            digital_data.TrackingCode = digital_data.TrackingCode.replace('IBHMPA', 'IBHMPI');
          }
          // Lógica para mostrar los  enlaces, llamar a la función que pinta la cabecera etc
          $(document.body).trigger('loginIBPLUSCompleted');
            /** Send event to load angular application * */
          $(document.body).trigger('loginEventWCS');

          // set session - url redirect upgrade
          setUrlUpgrade();
          paintZeroLoggedInfo(userMenu);
          homeQuadrigam();
          //updateDatalayer('view');
          //updateDigitalData('view');
        } else {
          SessionStorage.remove('urlUpgradeRedirect');
          datalayer_general.EstadoUsuario = 'no_logado';
          digital_data.UserStatus = 'no_logado';
          $('#publicUser').removeAttr('style').removeClass('hidden'); /* TopHeader */
          /* MenuIBPlus */
          $('.isLogged').addClass('hidden');
          // Show modal session expired
          if (sessionStorage.getItem('ib-inte.sessionExpired')) {
            $(window).on('load', () => {
              showErrorModal($('#loggedUserDefaults').attr('data-inte-modalbody2session'), {
                btnclose: true,
                btnaccept: true,
                btncancel: false,
                closereload: false,
                bodyNoClose: true,
              }, $('#loggedUserDefaults').attr('data-inte-modaltitlesession'), $('#loggedUserDefaults').attr('data-inte-modalbody1session'));
            });
            sessionStorage.removeItem('ib-inte.sessionExpired');
          }
        }
      });
      loggedServicePromise.fail(() => {
        dFrontJs.ibe_loading.close('body');
        datalayer_general.EstadoUsuario = 'no_logado';
        digital_data.UserStatus = 'no_logado';
        $('#publicUser').removeAttr('style').removeClass('hidden'); /* TopHeader */
        /* MenuIBPlus */
        $('.isLogged').addClass('hidden');
        // Show modal session expired
        if (sessionStorage.getItem('ib-inte.sessionExpired')) {
          $(window).on('load', () => {
            showErrorModal($('#loggedUserDefaults').attr('data-inte-modalbody2session'), {
              btnclose: true,
              btnaccept: true,
              btncancel: false,
              closereload: false,
              bodyNoClose: true,
            }, $('#loggedUserDefaults').attr('data-inte-modaltitlesession'), $('#loggedUserDefaults').attr('data-inte-modalbody1session'));
          });
          sessionStorage.removeItem('ib-inte.sessionExpired');
        }
      });
      loggedServicePromise.always(() => {
        dosegmentation();
      });
      homeQuadrigam();
    }

    if ($('.ibe-cub').find('.ibe-search-flights--cug').length > 0) {
      if (travelAgent !== false) {
        datalayer_general.segmento = IB_GROUP;
        datalayer_general.usuarioColectivo = `agencias_${travelAgent}`;
        datalayer_general.codigoSeguimiento = baseCodS + quadrigam;
        digital_data.UserSegment = IB_GROUP;
        digital_data.UserCUG = `agencias_${travelAgent}`;
        digital_data.TrackingCode = baseCodS + quadrigam;
      } else {
        datalayer_general.segmento = 'Colectivo';
        datalayer_general.usuarioColectivo = codeTracking;
        datalayer_general.codigoSeguimiento = `${baseCodS}Colectivos/${codeTracking}`;
        digital_data.UserSegment = 'Colectivo';
        digital_data.UserCUG = codeTracking;
        digital_data.TrackingCode = `${baseCodS}Colectivos/${codeTracking}`;
      }
      //updateDatalayer('view');
      //updateDigitalData('view');
    }
    if (Cookies.get('IBERIACOM_SSO_ONB_KEEPSESSION') !== undefined && !isLogado().userLogged) {
      loginOBService();
    } else {
      // Remove SSO_ONB_KEEPSESSION at any case
      Cookies.remove('IBERIACOM_SSO_ONB_KEEPSESSION');
      // Display error if needed
      showIBPLUSLoginError();
      loggedUser();
    }
  };
  return {
    init,
    pointsCheckifApply,
  };
}());
/** Set Login Info
 * Promise returns true or false indicatig if the params are set or not
*/
const setOnBusinesLoginParams = () => {
  const deferred = $.Deferred();
  if (tokenUrlOB !== 'null') {
    if (typeof (obLogInfo) === 'undefined') {
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/Presentation/Login/GetOnBusinessLogInfo',
          hostname: window.location.hostname,
          d: '',
        },
      }).done((data) => {
        $('head').append(data);
        deferred.resolve(true);
      }).fail(() => {
        $('.inte-linkOB').removeClass('inte-linkOB');
        deferred.reject(false);
      });
    } else {
      deferred.resolve(true);// is actually set
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise();
};
const callServiceXML = (serviceUrl, authorizationToken, params, language) => {
  const headers = {
    Authorization: `Bearer ${authorizationToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': language,
  };
  return $.ajax({
    url: serviceUrl,
    xhrFields: {
      withCredentials: true,
    },
    type: 'POST',
    headers,
    data: JSON.stringify(params),
  });
};
const generateXML = (serviceUrl, authorizationToken, params) => callServiceXML(
  serviceUrl, authorizationToken, params,
);
/* Logout OnBusiness */
const logoutOBService = (curr) => {
  const currAux = curr || 0;
  setOnBusinesLoginParams().done((res) => {
    if (res) {
      if (currAux <= common.MAX_ATTEMPS) {
        const isLogged = isLogado();
        const accessToken = isLogged.userLogged ? isLogged.accessToken : null;
        if (isLogged.userLogged) {
          const params = window.obLogInfo.issuer ? { issuer: window.obLogInfo.issuer } : '';
          const XMLPromise = generateXML(obLogoutXML, accessToken, params);
          let form; let inputXML; let inputRelayState; let
            inputLanguage;

          XMLPromise.done((data) => {
            SessionStorage.remove('customerDataOB');
            SessionStorage.remove('accessTokenOB');
            form = $(document.createElement('form'));
            $(form).attr('action', samlOBURL);
            $(form).attr('method', 'POST');
            inputXML = $('<input>')
              .attr('type', 'hidden')
              .attr('name', 'SAMLRequest')
              .val(data.xml);
            inputRelayState = $('<input>')
              .attr('type', 'hidden')
              .attr('name', 'RelayState')
              .val(`/${marketg.toLowerCase()}/${localeg}/`);
            inputLanguage = $('<input>')
              .attr('type', 'hidden')
              .attr('name', 'language')
              .val(localeg);
            $(form).append($(inputXML));
            $(form).append($(inputRelayState));
            $(form).append($(inputLanguage));
            form.appendTo(document.body);

            $(form).submit();
          });
          XMLPromise.fail((error) => {
            if (error.status === 401) {
              refreshToken(globalAppToken, tokenUrlOB).done(() => {
                logoutOBService(currAux + 1);
              });
            }
          });
        } else {
          // Press button but not logged in
          deleteloggedcookies();
          SessionStorage.remove('customerDataOB');
          SessionStorage.remove('accessTokenOB');
          if (pageONBusiness) {
            window.location.href = pageONBusiness;
          } else {
            window.location.reload();
          }
        }
      }
    }
  }).fail(() => {
    // eslint-disable-next-line no-console
    console.error("On Business - Couldn't get logout params");
  });
};

const loginOBError = () => {
  dFrontJs.ibe_loading.close('body');

  var isMobile = window.innerWidth <= 768;
  if(!isMobile){
    setTimeout(function(){
      $("[data-target='#tool_onbusiness']").attr('data-toggle', 'collapse');
			if(!$("#tool_onbusiness").hasClass("in")){
				$("[data-target='#tool_onbusiness']").trigger("click");
			}
			$("[data-target='#tool_onbusiness']").removeAttr('data-toggle');
      $("[data-ibis-error]").removeClass("hidden");
      $("[data-ibis-error]").closest(".ibe_form__group").addClass("ibe_form__group--error");
    }, 500);
  }
};

const loginOBService = (aux, error) => {
  const currAux = aux || "";
  let anonToken = SessionStorage.get('anonymousTokenOB');
  var dataOb = {};
  if(activateOldLoginOB != "true"){
    dataOb = {
      "username": $(formOBLogin).closest(".ibe_form").find(".user-login-OB").val(),
      "password": $(formOBLogin).closest(".ibe_form").find(".passw-login-OB").val()
    };
  }
  dataOb.logoutURL = undefined;
  function loginAction() {
    let navMarket;
    let navLanguage;
    const cookieSplit = Cookies.get('IBERIACOM_PERSONALIZATION') ? Cookies.get('IBERIACOM_PERSONALIZATION').split('|') : [];
    if (cookieSplit.length >= 3) {
      if (cookieSplit[1] && cookieSplit[1].length > 0
        && cookieSplit[2]
        && cookieSplit[2].length > 0) {
        // eslint-disable-next-line prefer-destructuring
        navMarket = cookieSplit[1];
        // eslint-disable-next-line prefer-destructuring
        navLanguage = cookieSplit[2];
      } else {
        navMarket = 'ES';
        navLanguage = 'es';
      }
    } else {
      navMarket = 'ES';
      navLanguage = 'es';
    }
    
    const homeURL = `/${navMarket.toLowerCase()}/${navLanguage.toLowerCase()}/`;

    let samlServiceURL = obLoginSAMLResp;
    if(activateOldLoginOB == "true"){
      samlServiceURL = obLoginXML;
    } else {
      dataOb = {
        "username": $(formOBLogin).closest(".ibe_form").find(".user-login-OB").val(),
        "password": $(formOBLogin).closest(".ibe_form").find(".passw-login-OB").val()
      };
    }

    callServiceXML(samlServiceURL, anonToken, dataOb)
    .done((data, textStatus, jqXHR) => {
      deleteloggedcookies();

      if(activateOldLoginOB == "true"){
        const { xml } = data;
        const $ibgroup = $('#SearcherContent').attr('data-ibgroup');
        const form = $('<form>', { id: 'oBForm', method: 'POST', action: samlOBURL });
        form.append($('<input>', { name: 'SAMLRequest', class: 'hidden', value: xml }))
          .append($('<input>', { name: 'language', class: 'hidden', value: navLanguage.toLowerCase() }));

        if (($ibgroup !== undefined && $ibgroup.length > 0) || (window.location.pathname !== '/integration/obsso/login/' && Cookies.get('IBERIACOM_SSO_ONB_KEEPSESSION') !== undefined && !isLogado().userLogged)) {
          form.append($('<input>', { name: 'RelayState', class: 'hidden', value: window.location.pathname }));
        } else {
          form.append($('<input>', { name: 'RelayState', class: 'hidden', value: homeURL }));
        }
        
        $('head').append(form);
        $('#oBForm').trigger('submit');

      } else {
        let now = Date.now();
        let date_access_to = new Date(now + (data.expires_in * 1000));
        date_access_to = date_access_to.getDate() +"/"+ (date_access_to.getMonth()+1) +"/"+ date_access_to.getFullYear() +" "+ date_access_to.getHours() +":"+ date_access_to.getMinutes() +":"+ date_access_to.getSeconds();

        let date_refresh_to = new Date(now + (data.refresh_expires_in * 1000));
        date_refresh_to = date_refresh_to.getDate() +"/"+ (date_refresh_to.getMonth()+1) +"/"+ date_refresh_to.getFullYear() +" "+ date_refresh_to.getHours() +":"+ date_refresh_to.getMinutes() +":"+ date_refresh_to.getSeconds();

        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS='+ data.access_token +';path=/;samesite=strict;max-age='+ (data.expires_in * 6);
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS_TO='+ date_access_to +';path=/;samesite=strict;max-age='+ (data.expires_in * 6);
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH='+ data.refresh_token +';path=/;samesite=strict;max-age='+ (data.refresh_expires_in * 6);
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH_TO='+ date_refresh_to +';path=/;samesite=strict;max-age='+ (data.refresh_expires_in * 6);
      
        //location.reload();
        location.href = location.protocol + "//" + location.hostname + urlRedirectOB;

        /*onBusinessTmpl(dataOb.username, data.xml);
        if(jqXHR.status != 200){
          loginOBError();
        }*/
      }
      Cookies.remove('IBERIACOM_SSO_ONB_KEEPSESSION');
      
    }).fail((errorfl) => {
      loginOBError();
      loginOBService(currAux + 1, errorfl.status);
    });
  }

  if(activateOldLoginOB == "true" || dFrontJs.ibe_validate.validateLoginFormOB(dataOb)){
    var isMobile = window.innerWidth <= 768;
    if(!isMobile){
      $('.ibe-header-new__menu-button').trigger('click');   
    } 
    setOnBusinesLoginParams().done((res) => {
      if (res) {
        if (currAux <= common.MAX_ATTEMPS) {
          dataOb = { issuer: window.obLogInfo.issuer, consumerUrlService: window.obLogInfo.loginURL };
          dFrontJs.ibe_loading.open('body');
          if (!anonToken || error === 401) {
            generateAnonymousToken(tokenUrlOB, globalAppToken).done((tokenResponse) => {
              SessionStorage.set('anonymousTokenOB', tokenResponse.access_token);
              anonToken = tokenResponse.access_token;
              loginAction();
            });
          } else {
            loginAction();
          }
        } else {
          dFrontJs.ibe_loading.close('body');
        }
      } else {
        dFrontJs.ibe_loading.close('body');
      }
    }).fail(() => {
      // eslint-disable-next-line no-console
      console.error("On Business - Couldn't get login params");
    });
  }
};
const onBusinessTmpl = (user, saml) => {  
  $.ajax({ 
    method: 'POST',
    url: '/integration/obsso/login/', 
    data: { 
      user: user ,
      SAMLResponse: saml
    } 
  }).done((data) => {
    try{
      data = JSON.parse(data);    
      if(data != undefined && data.IBERIACOM_SSO_ONB_ACCESS != undefined){
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS='+ data.IBERIACOM_SSO_ONB_ACCESS +';path=/;samesite=strict;max-age='+ data.IBERIACOM_SSO_ONB_ACCESS_MAX;
        document.cookie = 'IBERIACOM_SSO_ONB_ACCESS_TO='+ data.IBERIACOM_SSO_ONB_ACCESS_TO +';path=/;samesite=strict;max-age='+ data.IBERIACOM_SSO_ONB_ACCESS_MAX;
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH='+ data.IBERIACOM_SSO_ONB_REFRESH +';path=/;samesite=strict;max-age='+ data.IBERIACOM_SSO_ONB_REFRESH_MAX;
        document.cookie = 'IBERIACOM_SSO_ONB_REFRESH_TO='+ data.IBERIACOM_SSO_ONB_REFRESH_TO +';path=/;samesite=strict;max-age='+ data.IBERIACOM_SSO_ONB_REFRESH_MAX;
      
        //location.reload();
        location.href = location.protocol + "//" + location.hostname + urlRedirectOB;
      } else {
        loginOBError();
      }
    } catch(e) {
      loginOBError();
    }
  }).fail((errorfl) => {
    loginOBError();
  });
}
/*LogOutOBKeycloak */
const logoutOBKeycloak = () => {  
  const isLogged = isLogado();
  if(isLogged.refreshTokenTxt){
    callTokenService(logoutserviceOB, globalAppToken, $.param({ refresh_token: isLogged.refreshTokenTxt}))
    .then((data, textStatus, codeStatus) => {
      if(codeStatus.status === 204){
        console.log("204");
        deleteloggedcookies();
        window.location.href = relaystateOB;
      } else {
        window.location.href = relaystateOB;
      }
    }).catch(() => {
      window.location.href = relaystateOB;
    });
  }
};
/**
 * Validates the referralURL to be the same domain (or subdomain) of the current page to avoid
 * phishing attacks
 * @param { string } url
 */
function hasReferralUrlSameDomain(url) {
  /** If no url it redirects to same domain */
  if (!url) return true;
  /** If relative path it redirects to same domain */
  if (url.startsWith('/')) return true;  
  
  const completeUrl = !url.startsWith('https') ? `https://${url}` : url;
  const actualHost = window.location.host;
  try {
    const urlObj = new URL(completeUrl);
    const host = urlObj.host;
    return host === actualHost || host.endsWith(`.${actualHost.replace('www.','')}`);
  } catch {
    return false;
  }  
}

/**
 * Validates the referralURL to be the same domain (or subdomain) of the current page or any of the whitelisted partners to avoid
 * phising attacks
 * @param { string } url
 */
function hasWhitelistedPartnersDomain(url) {
  const { wineClubDomain , irontecDomain , prestashopDomain, omnichannelDomain} = retrieveGlobalVariables();
  const partnersDomains = [ wineClubDomain , irontecDomain , prestashopDomain, omnichannelDomain];  

  const sameDomain = hasReferralUrlSameDomain(url);
  if (sameDomain) return sameDomain;

  try {
    const { host } = new URL(url);
    return partnersDomains.includes(host);
  } catch {
    return false;
  }    
}

/**
*  Function calls to salesforce to get information about token expiration and calls to
*   keycloack to get token
* reject: User weren't logged in
*/
const loginIBPlusService = () => {
  const deferred = $.Deferred();
  const urlParams = getQuerystrParams();
  const urlTokenSalesforce = `${loginMicroserviceUrl}rs/v1/token/salesforce-token`;
  const urlLoginSalesforce = `${salesforceURL}authorize/expid_1${marketg.toUpperCase()}${localeg.toLowerCase()}`;
  let urlRegisterSalesforce = `${salesforceRegistroIBPlus}`;
  const clientIberiaSalesforce = salesforceClientId;
  // let userAux;
  // let passwordAux;
  if(typeof (urlParams.language) === 'string' && urlParams.language.length > 0){
    urlRegisterSalesforce = urlRegisterSalesforce+'?language='+`${urlParams.language}`;
  }
  if (typeof (urlParams.code) === 'string' && urlParams.code.length > 0) {  

    getAnonymousTokenPromise()
      .then(() => {
        const params = {
          code: decodeURIComponent(urlParams.code),
          redirect_uri: window.location.origin + window.location.pathname,
          grant_type: 'authorization_code',
          format: 'json'
        };
        const headers = {
          'Content-type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Bearer ${SessionStorage.get('anonymousToken')}`
        };
        return callService(urlTokenSalesforce, headers, params, 'POST')
      })
      .then((data) => {
      // Set salesforce and keycloack cookies
      deleteloggedcookies();
      $.ajax({ method: 'GET', url: '/cs/Satellite', data: { pagename: 'IB_SE/CacheControl0s/Integration/logOut' } });
      Promise.all([
        setCookiesSalesforce(data),setTokenKeycloack(null, data.access_token)
      ]).then((resp) => {
            const respTokenKeycloack = resp[1];
            const isLogged = isLogado();
            if (respTokenKeycloack.access_token) {
              const token = JSON.parse(atob(respTokenKeycloack.access_token.split('.')[1]));
              if(token !== undefined && token.realm_access !== undefined && token.realm_access.roles.length > 0) {
                if (token.realm_access.roles.filter((el) => {return el === 'ROLE_IBERIA_ZERO'}).length > 0) {
                  document.cookie = `IBERIACOM_SSO_TYPE=IBZERO;path=/;expires=${new Date(isLogged.refreshTokenSFExpire).toGMTString()};secure=true;`;
                } else {
                  document.cookie = `IBERIACOM_SSO_TYPE=IBPLUS;path=/;expires=${new Date(isLogged.refreshTokenSFExpire).toGMTString()};secure=true;`;
                }
              }
            }          
            deferred.resolve();
          }
        )
        .catch(() => {
          deferred.reject();
        });
    }).catch(() => {
      deferred.reject();
    });

    /**
     * Check if the user is going to external partner, in that case we redirect to login salesforce
     */
  } else if (typeof (urlParams.externalpartner) === 'string' && urlParams.externalpartner.length > 0) {

    if (urlParams.referralURL && !hasWhitelistedPartnersDomain(decodeURIComponent(urlParams.referralURL))) {
      window.location.href = '/';
    } else {
      SessionStorage.set(storageIdentityState, {
        externalObj: {
          externalPartner: urlParams.externalpartner,
          sessionId: urlParams.sessionId,
          referralURL: (urlParams.referralURL)? decodeURIComponent(urlParams.referralURL): undefined
        }
      });
      
      if(urlParams.externalpartner  === 'ib_register_wineclub'){
        window.location.href = `${urlRegisterSalesforce}`;
      }else if(urlParams.externalpartner  === 'ibplustore'){
        window.location.href = `${urlLoginSalesforce}01?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
      }else{
        window.location.href = `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
      }
    }    
  } else {
      const referralURL = (typeof (urlParams.referralURL) === 'string') ? decodeURIComponent(urlParams.referralURL) : '';
      
      const sameDomain = hasReferralUrlSameDomain(referralURL);

      if (!sameDomain) {
        window.location.href = '/';
      } else {
        SessionStorage.set(storageIdentityState, {referralURL});
        window.location.href = `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin + window.location.pathname}&prompt=login&response_type=code`;
      }
  }
  return deferred.promise();
};
/**
* Functions call to external-ancillaries sso service
* @param {String} code Code of external partner. This code must be part of service url
* @returns {promise}
*/
const loginExternalPartnerService = (code) => {
  const deferred = $.Deferred();
  let url = $('[data-loginext-serviceurl]').data('loginext-serviceurl');
  function callServiceloginExternal(round) {
    const accessTokenTxt = Cookies.get('IBERIACOM_SSO_ACCESS');
    const headers = {
      Authorization: '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const roundAux = round || 0;

    if (roundAux < common.MAX_ATTEMPS) {
      headers.Authorization = `Bearer ${accessTokenTxt}`;
      callService(url, headers, undefined, 'GET')
        .done((data) => {
          deferred.resolve(data);
        })
        .fail((error) => {
          if (error.status === 401) {
            refreshToken(globalAppToken, tokenURL).always(() => {
              callServiceloginExternal(roundAux + 1);
            });
          } else {
            deferred.reject();
          }
        });
    } else {
      deferred.reject();
    }
  }
  if (typeof (code) === 'string' && code.length > 0 && url && url.length > 0) {
    url = `${url + code}/url/`;
    callServiceloginExternal();
  } else {
    deferred.reject();
  }
  return deferred.promise();
};

// const dInteJs = () => {
window.dInteJs = {};

const retrieveStateInfo = (state) => {
  const stStored = SessionStorage.get(storageIdentityState);
  SessionStorage.remove(storageIdentityState);
  let st = state;
  st ??= '/';

  if (stStored && stStored.externalObj) {
    return stStored.externalObj;
  } else if (stStored && stStored.referralURL) {
    return stStored;
  } else {
    return { referralURL: decodeURIComponent(st) };
  }
}

/**
 * Functions call to external service store session
 */
function sendHotelCarsInfo() {
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

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessTokenTxt}`,
    };
    if (roundAux <= common.MAX_ATTEMPS) {
      callService(commercialSellingDataService, headers, undefined, 'GET')
        .done((data) => {
          if (data.length > 0) {
            const object = data.find((element) => element.market.code === `${marketg}`);
            if (object !== undefined && object.length > 0) {
              deferred.resolve(object.currency.code);
            } else {
              deferred.reject('EUR');
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
  };

  /**
   * Function that redirect user to third party
   * @param {String} resp Response from StoreSession service with the session identifier
   */
  const serviceSuccess = (resp) => {
    const customerData = getCustomerDataSession();
    const currencyServiceProm = getCurrency();

    if (SessionStorage.get('retrieveMemberDetailV2')) {
      const memberDetailSessionV2 = SessionStorage.get('retrieveMemberDetailV2');
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

      });
    } else {
      SessionStorage.set(storageErrorIBPLUSkey, 'store-session');
      window.location.href = '/';
    }
  };

  /**
   * Function that shows a modal with a error message
   */
  const serviceFailure = () => {

    SessionStorage.set(storageErrorIBPLUSkey, 'store-session');
    window.location.href = '/';
    /* showErrorModal($('#loggedUserDefaults').attr('data-inte-modalstoresession'), {
      btnclose: true,
      btnaccept: true,
      btncancel: false,
      closereload: false,
      bodyNoClose: true,
    });*/
    // dFrontJs.ibe_loading.close('body');
  };

  const refreshTokenTxt = Cookies.get('IBERIACOM_SSO_REFRESH');

  const params = {
    refreshToken: `${refreshTokenTxt}`,
    channelIdentifier: `${globalAppToken}`,
    partnerIdentifier: 'SWF',
  };

  callServiceSSO(storeSessionService, params).then(serviceSuccess, serviceFailure);
}


/**
 * When Iberia Plus login is from an external Omnichannel partner, redirect to the partner with the required information.
 */
function onIberiaPlusOmnichannelPartnerLogin ({ referralURL }) {
  const { userType } = isLogado();
  const membersV2 = SessionStorage.get('retrieveMemberDetailV2');
  const customerData = getCustomerDataSession();

  if (!membersV2 || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    SessionStorage.set(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }

  const scheme = membersV2.memberPersonalDetails.schemes.find((scheme) => {
    const recognition = scheme.recognitionLevel.recognitionLevelIdentifier;
    return recognition !== 'IBERIA SINGULAR';
  });

  const completeAddress = membersV2.memberPersonalDetails.postalAddresses?.find((address) => {
    return address.type === 'Home';
  });

  const userInformation = { 
    generalInfo: { 
      userType: userType, // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: membersV2.memberPersonalDetails.identifier, // Only iberia plus 14 digits, null otherwise 
      identifier: null, // For Iberia Zero User, null otherwise (NEW) 
      category: scheme?.recognitionLevel.recognitionLevelIdentifier, // Only iberia plus, null otherwise 
      avios: customerData.avios // Only iberia plus, null otherwise 
    },
    personalInfo: { 
      name: membersV2.memberPersonalDetails.person.personName.firstName,  // Can be null or string 
      surname1: membersV2.memberPersonalDetails.person.personName.familyName,  // Can be null or string 
      surname2: membersV2.memberPersonalDetails.person.personName.secondfamilyName || null,  // Can be null or string 
      contactPhone: null,  // Can be null or string 
      contactEmail: membersV2.memberPersonalDetails.person.emailAddress.email, // String 
      residence: { 
        address: completeAddress?.addressLines?.[0] || null, // Can be null or string 
        streetNumber: completeAddress?.addressLines?.[1] || null, // Can be null or string (NEW) 
        apartment: completeAddress?.addressLines?.[2] || null, // Can be null or string (NEW) 
        town: completeAddress?.city || null, // Can be null or string 
        country: completeAddress?.country || null, // Can be null or string 
        state: completeAddress?.state || null, // Can be null or string,
        postalCode: completeAddress?.postCode || null // Can be null or string, (NEW) 
      }
    }
  }

  const createInput = ({ name, value }) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    return input;
  }

  const form = document.createElement('form');
  form.style.display = 'none';
  const { accessToken, refreshTokenTxt } = isLogado();
  
  form.append(createInput({ name: 'accessToken', value: accessToken}));
  form.append(createInput({ name: 'refreshToken', value: refreshTokenTxt}));  
  form.append(createInput({ name: 'userInformation', value: window.btoa(JSON.stringify(userInformation)) }));
  form.method = 'POST';

  form.action = referralURL;
  document.body.append(form)
  form.submit();
}

/**
 * When Iberia Plus login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onIberiaPlusWineClubPartnerLogin ({ referralURL }) {

  const { userType } = isLogado();
  const membersV2 = SessionStorage.get('retrieveMemberDetailV2');
  const customerData = getCustomerDataSession();

  if (!membersV2 || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    SessionStorage.set(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }

  const scheme = membersV2.memberPersonalDetails.schemes.find((scheme) => {
    const recognition = scheme.recognitionLevel.recognitionLevelIdentifier;
    return recognition !== 'IBERIA SINGULAR';
  });

  const completeAddress = membersV2.memberPersonalDetails.postalAddresses?.find((address) => {
    return address.type === 'Home';
  });

  const userInformation = { 
    generalInfo: { 
      userType: userType, // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: membersV2.memberPersonalDetails.identifier, // Only iberia plus 14 digits, null otherwise 
      identifier: null, // For Iberia Zero User, null otherwise (NEW) 
      category: scheme?.recognitionLevel.recognitionLevelIdentifier, // Only iberia plus, null otherwise 
      avios: customerData.avios // Only iberia plus, null otherwise 
    },
    personalInfo: { 
      name: membersV2.memberPersonalDetails.person.personName.firstName,  // Can be null or string 
      surname1: membersV2.memberPersonalDetails.person.personName.familyName,  // Can be null or string 
      surname2: membersV2.memberPersonalDetails.person.personName.secondfamilyName || null,  // Can be null or string 
      contactPhone: null,  // Can be null or string 
      contactEmail: membersV2.memberPersonalDetails.person.emailAddress.email, // String 
      residence: { 
        address: completeAddress?.addressLines?.[0] || null, // Can be null or string 
        streetNumber: completeAddress?.addressLines?.[1] || null, // Can be null or string (NEW) 
        apartment: completeAddress?.addressLines?.[2] || null, // Can be null or string (NEW) 
        town: completeAddress?.city || null, // Can be null or string 
        country: completeAddress?.country || null, // Can be null or string 
        state: completeAddress?.state || null, // Can be null or string,
        postalCode: completeAddress?.postCode || null // Can be null or string, (NEW) 
      }
    }
  }

  onWineClubPartnerLogin({ referralURL, userInformation});
}

/**
 * When Iberia Plus login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onIberiaZeroOmniChannelPartnerLogin ({ referralURL }) {

  const { userType } = isLogado();
  const members = SessionStorage.get('retrieveMemberDetailZero');
  const customerData = getCustomerDataSession();

  if (!members || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    SessionStorage.set(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }

  const [ personalData, contactDetails ] = members;

  const zeroIdentifier = getIdentifierFromToken();

  const userInformation = { 
    generalInfo: { 
      userType: userType, // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: null,
      identifier: zeroIdentifier, // For Iberia Zero User, null otherwise (NEW) 
      category: null,
      avios: null
    },
    personalInfo: { 
      name: personalData.name || null,  // Can be null or string 
      surname1: (!personalData.lastName || personalData.lastName.includes('@')) ? null : personalData.lastName,  // Can be null or string 
      surname2: null,  // Can be null or string 
      contactPhone: contactDetails.phone.number || null,  // Can be null or string 
      contactEmail: contactDetails.email, // String 
      residence: { 
        address: contactDetails.addresss?.street || null, // Can be null or string 
        streetNumber: contactDetails.addresss?.streetNumber || null, // Can be null or string (NEW) 
        apartment: contactDetails.addresss?.apartment || null, // Can be null or string (NEW) 
        town: contactDetails.city || null, // Can be null or string 
        country: contactDetails.countryCode || null, // Can be null or string
        state: contactDetails.province || null, // Can be null or string,
        postalCode: contactDetails.postalCode || null // Can be null or string, (NEW) 
      }
    }
  }

  const createInput = ({ name, value }) => {
      const input = document.createElement('input');
      input.name = name;
      input.value = value;
      return input;
    }

    const form = document.createElement('form');
    form.style.display = 'none';
    const { accessToken, refreshTokenTxt } = isLogado();
    
    form.append(createInput({ name: 'accessToken', value: accessToken}));
    form.append(createInput({ name: 'refreshToken', value: refreshTokenTxt}));  
    form.append(createInput({ name: 'userInformation', value: window.btoa(JSON.stringify(userInformation)) }));
    form.method = 'POST';

    form.action = referralURL;
    document.body.append(form)
    form.submit();
}

/**
 * When Iberia Plus login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onIberiaZeroWineClubPartnerLogin ({ referralURL }) {

  const { userType } = isLogado();
  const members = SessionStorage.get('retrieveMemberDetailZero');
  const customerData = getCustomerDataSession();

  if (!members || !customerData) {
    generateLoginEvent(false);
    logoutIBPlusService();
    SessionStorage.set(storageErrorIBPLUSkey, 'general');
    window.location.href = '/';
  }

  const [ personalData, contactDetails ] = members;

  const zeroIdentifier = getIdentifierFromToken();

  const userInformation = { 
    generalInfo: { 
      userType: userType, // Two values IBZERO or IBPLUS (NEW) 
      ibPlusNumber: null,
      identifier: zeroIdentifier, // For Iberia Zero User, null otherwise (NEW) 
      category: null,
      avios: null
    },
    personalInfo: { 
      name: personalData.name || null,  // Can be null or string 
      surname1: (!personalData.lastName || personalData.lastName.includes('@')) ? null : personalData.lastName,  // Can be null or string 
      surname2: null,  // Can be null or string 
      contactPhone: contactDetails.phone.number || null,  // Can be null or string 
      contactEmail: contactDetails.email, // String 
      residence: { 
        address: contactDetails.addresss?.street || null, // Can be null or string 
        streetNumber: contactDetails.addresss?.streetNumber || null, // Can be null or string (NEW) 
        apartment: contactDetails.addresss?.apartment || null, // Can be null or string (NEW) 
        town: contactDetails.city || null, // Can be null or string 
        country: contactDetails.countryCode || null, // Can be null or string
        state: contactDetails.province || null, // Can be null or string,
        postalCode: contactDetails.postalCode || null // Can be null or string, (NEW) 
      }
    }
  }

  onWineClubPartnerLogin({ referralURL, userInformation});
}

/**
 * When login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onWineClubPartnerLogin ({ referralURL, userInformation}) {
  
  const createInput = ({ name, value }) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    return input;
  }

  const form = document.createElement('form');
  form.style.display = 'none';
  const { accessToken, refreshTokenTxt } = isLogado();
  
  form.append(createInput({ name: 'accessToken', value: accessToken}));
  form.append(createInput({ name: 'refreshToken', value: refreshTokenTxt}));  
  form.append(createInput({ name: 'userInformation', value: window.btoa(JSON.stringify(userInformation)) }));
  form.method = 'POST';

  form.action = referralURL;
  document.body.append(form)
  form.submit();
}

/**
 * Main method to do login in Iberia after salesforce sucessful login
 * @return {*}
 */
function loginIBPlus() {
  const deferred = $.Deferred();
  const isLogged = isLogado();
  const urlParams = getQuerystrParams();

  const loginSuccess = () => {
    let form;
    let externalURL;
    const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
    const refreshCookie = Cookies.get('IBERIACOM_SSO_REFRESH');
    // Tracking login success
    const eventData = {
      eventName: 'interaccion',
      eventCategory: 'intento de login',
      eventAction: 'clic', 
      eventLabel:  'login ok',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }

    getMemberData(accessCookie, `${localeg}-${marketg}`, isLogado().userType)
      .done(() => {
        const customerData = getCustomerDataSession();
        const state = retrieveStateInfo(urlParams.state);
        const expDate = new Date(decodeURIComponent(isLogged.accessTokenExpire))
        const jsonSessionlogged = {
            'first_name': customerData.name,
            'last_name': customerData.surname
        }

        const jsonStringSession = JSON.stringify(jsonSessionlogged);
        const splitted = window.location.hostname.split('.');

        Cookies.set("IBERIACOM_SSO_SESION", btoa(jsonStringSession), {
          domain: `.${splitted.slice(splitted.length - 2).join('.')}`,
          path: "/",
          expires: expDate,
          sameSite: "strict",
        });
        
        ////redireccion RRSS login params SalesForce
        const stateSF = state.referralURL;
        let paramsSF = {};

        try {
          const url = new URL(stateSF);
          paramsSF = Object.fromEntries(new URLSearchParams(url.search));
        } catch {
          paramsSF = Object.fromEntries(new URLSearchParams(stateSF));
        }

        const rrss = paramsSF['rrss'];
        /** @type {'1' | '2' | '3' | '4' | null } */
        const typerrss = paramsSF['typerrss'];
        const registerByTyperrss = {
          '1': 'zero',
          '2': 'plus'
        }
        /** @type {'plus' | 'zero' | null } */
        const registerParamState = paramsSF['register'] ?? registerByTyperrss[typerrss];
        
        //locale-market del registro
        marketg = paramsSF['market'] ?? marketg;
        localeg = paramsSF['language'] ?? localeg;

        const universia = paramsSF['partner'];
        const invitationCode = paramsSF['invitationCode'];
        const upgradeKO = paramsSF['UpgradeKO'];
        const upgradeOK = paramsSF['UpgradeOK'];
        const registroClub = paramsSF['registroClub'];

        let referral = state.referralURL;

        if(rrss != null && rrss === 'true'){
          referral = localStorage.getItem('returnURL') ?? state.referralURL;
        }
       

        //leemos y borramos session returnURL
        localStorage.removeItem('returnURL');

        if(isLogado().userType ==='IBPLUS'){
          if (customerData.parentalControl) {
            if (state) {
              const params = getQuerystrParams(referral);
              if (Object.keys(params).length === 3
                  && params.invitationID && params.memberID && params.type) {
                SessionStorage.set('ib-plus-app.nomination', params);
                const referralURLClean = decodeURIComponent(referral).split('?')[0];
                window.location = referralURLClean;
              } else if (state.externalPartner && state.externalPartner.length > 0) {
                // eslint-disable-next-line prefer-destructuring
                const externalPartner = state.externalPartner;
                switch (externalPartner) {
                  case 'ibplustore':
                    externalURL = $('[data-ibplustore-url]').data('ibplustore-url');
                    // Send token to iberiaplustore
                    form = $('<form>', { method: 'POST', action: `${externalURL}auth/ib`, class: 'hidden' });
                    form.append($('<input>', { name: 'tokenIB', value: accessCookie }));
                    deleteloggedcookies();
                    $('body').append(form);
                    form.submit();
                    break;
                  case 'ib_omnichannel_eva':
                     onIberiaPlusOmnichannelPartnerLogin({ referralURL: referral });
                    break;
                  case 'ib_dig_wineclub':
                    onIberiaPlusWineClubPartnerLogin({ referralURL: referral });
                    break;
                  case 'ib_register_wineclub':
                    onIberiaPlusWineClubPartnerLogin({ referralURL: referral });
                    break;  
                  case 'aviosandmoney':
                    // dFrontJs.ibe_loading.open('body');
                    sendHotelCarsInfo();
                    break;
                  case 'pgt':
                    externalURL= $('[data-ptg-url]').data('ptg-url');
                    const prmPTG = $.param({partner:'ib', sessionId: state.sessionId})
                    form = $('<form>', { method: 'POST', action: `${externalURL}?${prmPTG}`, class: 'hidden' });
                    form.append($('<input>', { name: 'accessToken', value: accessCookie}))
                        .append($('<input>', { name: 'refreshToken', value: refreshCookie}));
                    $('body').append(form);
                    form.submit();
                    break;
                  case 'eci':

                    externalURL = $('[data-eci-url]').data('eci-url');
                    // Send token to iberiaplustore
                    form = $('<form>', { method: 'POST', action: `${externalURL}`, class: 'hidden' });
                    form.append($('<input>', { name: 'access_token', value: accessCookie }));
                    form.append($('<input>', { name: 'refresh_token', value: refreshCookie }));
                    form.append($('<input>', { name: 'externalpartner', value: 'ibp' }));
                    deleteloggedcookies();
                    $('body').append(form);
                    form.submit();
                    break;
                  default:
                    // Login externo
                    loginExternalPartnerService(externalPartner)
                      .done((datas) => {
                        if (datas.params && datas.params.length > 0) {
                          form = $('<form>', { method: 'POST', action: datas.url, class: 'hidden' });
                          form.append($('<input>', { name: 'market', value: marketg.toUpperCase() }))
                            .append($('<input>', { name: 'language', value: localeg.toLowerCase() }))
                            .append($('<input>', { name: datas.params[0].paramName, value: datas.params[0].paramValue }));
                          /* if (typeof (urlParams.referralURL) === 'string' && urlParams.referralURL.length > 0) {
                            urlParams.referralURL = decodeURIComponent(urlParams.referralURL);
                            form.append($('<input>', { name: 'referralURL', value: urlParams.referralURL }));
                          } */
                        }
                      })
                      .fail(() => {
                        // dFrontJs.ibe_loading.close('body');
                        // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
                        // showErrorModal(errormsg);
                        generateLoginEvent(false);
                        logoutIBPlusService();
                        SessionStorage.set(storageErrorIBPLUSkey, 'general');
                        window.location.href = '/';
                        deferred.reject();
                        // formbtn.prop('disabled',false);
                      });
                    break;
                }
              } else {
                // Redireccionamiento registro SF landing Universia
                if(universia === 'LSUN'){
                  //Redirecciona a la landing de la Iberia con partner de Universia
                  window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/?partner=ZSUN`;                
                }
                // Redireccionamiento inicio de sesion para la invitacion
                else if(invitationCode){
                  window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/IBMIBP?tab=your-benefits&tier-nomination=upgrade`;
                }
                else if(registroClub){
                  window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/IBMIBP?registratedUser=true`;
                }
                //redireccion SalesForce RRSS IB PLUS
                else if(rrss != null && typerrss != null && rrss === 'true'){
                  if(typerrss == 0){
                    window.location.href = referral
                  }
                  else {                    
                    const params = new URLSearchParams({
                      rrss: rrss,
                      typerrss: typerrss
                    });
                    if (registerParamState) params.set('register', registerParamState);
                    const target = '?' + params.toString();
                    redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
                  }
                }
                //SF NO RRSS
                else if (rrss != null && typerrss != null && rrss === 'false') {
                  if(typerrss == 0){
                    const params = new URLSearchParams();
                    if(upgradeOK){
                      window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/profile`;
                    }
                    else if (registerParamState) params.set('register', registerParamState);
                    alert('normal referral');
                    const target =  params.size > 0 ? '?' + params.toString() : '';
                    redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
                  }
                }
                
                else if (referral && referral.length > 0) {
                  generateLoginEvent(true);
                  if (window.top === window.self){
                    window.location.href = referral
                  }
                } else {
                  generateLoginEvent(true);
                  if (window.top === window.self){
                    window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`
                  }
                }
              }
            }
            //fin state
            else {
              generateLoginEvent(true);
              if (window.top === window.self){
                window.location.href = '/';
              }
            }
          }
          //error parental control
          else {
            logoutIBPlusService().always(() => {
              // dFrontJs.ibe_loading.close('body');
              // errormsg = loggedProperties.attr('data-inte-parentalcontrolmsg');
              // showErrorModal(errormsg);
              generateLoginEvent(false, {
                type: 'error',
                payload: 'parental-control'
              });
              if (window.top === window.self){
                SessionStorage.set(storageErrorIBPLUSkey, 'parental-control');
                window.location.href = '/';
              }
              deferred.reject();
            });
          }
        }//FIN IBPLUS
        else if(isLogado().userType ==='IBZERO') {       
          if (state?.externalPartner?.length > 0) {
            const externalPartner = state.externalPartner;
            switch (externalPartner) {     
              case 'ib_omnichannel_eva':
                onIberiaZeroOmniChannelPartnerLogin({ referralURL: referral });
                break;         
              case 'ib_dig_wineclub':
                onIberiaZeroWineClubPartnerLogin({ referralURL: referral });
                break;
              case 'ib_register_wineclub':
                onIberiaZeroWineClubPartnerLogin({ referralURL: referral });
                break;
            }
            //redireccion SalesForce RRSS IB ZERO
          }else{
            if (rrss != null && typerrss != null) {
              /* Normal login */
              if (typerrss == 0 && !registerParamState) {
                window.location.href = referral;
              /* Iberia Zero Registration Form */
              } else if (typerrss == 0 && registerParamState) {
                if(upgradeKO){
                  window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/mi-iberia/#/IBMIBP?registerPopUp=true`;
                }
                const params = new URLSearchParams({
                  register: registerParamState
                });
                const target = '?' + params.toString();
                redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
              /* Iberia Zero Registration Social Network */
              } else {
                const params = new URLSearchParams({
                  rrss: rrss,
                  typerrss: typerrss
                });
                if (registerParamState) params.set('register', registerParamState);
                const target = '?' + params.toString();
                redirectByQuadrigam(marketg, localeg, 'IBPHOM', 'Page', target);
              }
            } else if (referral && referral.length > 0) {
              generateLoginEvent(true);
              if (window.top === window.self){
                window.location.href = referral
              }
            } else {
              generateLoginEvent(true);
              if (window.top === window.self){
                window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`
              }
            }
          }
        }
        else {
          generateLoginEvent(true);
          if (referral && referral.length > 0) {
            if (window.top === window.self){
              window.location.href = referral
            }
          } else {
            generateLoginEvent(true);
            if (window.top === window.self){
              window.location.href = `/${marketg.toLowerCase()}/${localeg.toLowerCase()}/`
            }
          }
        }
      })
      .fail(() => {
        // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
        // showErrorModal(errormsg);
        logoutIBPlusService().always(() => {
          // dFrontJs.ibe_loading.close('body');
          SessionStorage.remove(storageIdentityState);
          generateLoginEvent(false);
          if (window.top === window.self){
            SessionStorage.set(storageErrorIBPLUSkey, 'general');
            window.location.href = '/';
          }
          deferred.reject();
        });
      });
  };

  const loginFailure = (err) => {
    let error = err;
    error = error || { status: 0, responseJSON: null };
    const errorcode = error.responseJSON ? error.responseJSON.error : undefined;
    SessionStorage.remove(storageIdentityState);
    // Tracking login fail
    const eventData = {
      eventName: 'interaccion',
      eventCategory: 'intento de login',
      eventAction: 'clic', 
      eventLabel:  'login ko',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
    // Error cases
    // Suposing that comes from service
    if (errorcode === 'invalid_grant') {
      // errormsg = (error.responseJSON.loggedBy !== 'email') ? loggedProperties.attr('data-inte-invalidcredentialsmsg') : loggedProperties.attr('data-inte-invalidcredentialsemail');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      if (window.top === window.self){
        SessionStorage.set(storageErrorIBPLUSkey, 'general');
        window.location.href = '/';
      }
    } else if (errorcode === 'invalid_grant_mail') {
      // errormsg = loggedProperties.attr('data-inte-repeatedmailmsg');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      if (window.top === window.self) {
        SessionStorage.set(storageErrorIBPLUSkey, 'general');
        window.location.href = '/';
      }
      // Temporal and permanent blocked users
    } else if (errorcode === 'invalid_grant_BT') {
      redirectByQuadrigam(marketg, localeg, 'IBBLUT');
    } else if (errorcode === 'invalid_grant_BP') {
      redirectByQuadrigam(marketg, localeg, 'IBBLUS');
      // User logged with an expired pin
    } else if (errorcode === 'invalid_grant_PE') {
      SessionStorage.set('ib-plus-app.passwordExpired', true);
      redirectByQuadrigam(marketg, localeg, 'IBOLPS');
    } else {
      // errormsg = loggedProperties.attr('data-inte-generalerrormsg');
      // dFrontJs.ibe_loading.close('body');
      // showErrorModal(errormsg);
      generateLoginEvent(false);
      deleteloggedcookies();
      if (window.top === window.self) {
        SessionStorage.set(storageErrorIBPLUSkey, 'general');
        window.location.href = '/';
      }
    }
	  deferred.reject();
  };


  if (!isLogged.userLogged || (isLogged.userLogged && isLogged.isSoftUser)) {
    loginIBPlusService().then(loginSuccess, loginFailure);
  } else if (isLogged.userLogged) {
      if (urlParams.externalpartner && urlParams.externalpartner.length > 0 ) {
        logoutIBPlusService().always(()=> {
          loginIBPlus();
        })
      } else if(urlParams.referralURL && urlParams.referralURL.length > 0 ){
        window.location.href =  decodeURIComponent(urlParams.referralURL);
      } else {
        window.location.href = '/';
      }
    deferred.resolve();
  } else {
    window.location.href = '/';
    deferred.reject();
  }

  return deferred.promise();
};
/**
* Logout function
* @returns Promise: Resolve if call logout service was ok
* Reject if call logout service was ko
*/
window.dInteJs.logoutIBPlus = () => logoutIBPlusService();


// OnBuisness login function
const onBusinessLogin = () => {
  //Modal Onbusiness
	//Desktop
	$.ajax({
		method: 'GET',
		url: '/cs/Satellite',
    async:false,
		data: {
			pagename: 'IB_SE/Onbusiness/Login',
			market: $('#mercado').val(),
			locale: $('#idioma').val(),
			mobile: 'false',
			activateob: $("[data-onbusiness='onbusiness']").data('activateob'),
			listid: $("[data-onbusiness='onbusiness']").data('listid'),
			d: '',
		},
		success(data) {
			$("[data-onbusiness='onbusiness']").html(data);
		}
	});
	//Mobile
	$.ajax({
		method: 'GET',
		url: '/cs/Satellite',
    async:false,
		data: {
			pagename: 'IB_SE/Onbusiness/Login',
			market: $('#mercado').val(),
			locale: $('#idioma').val(),
			mobile: 'true',
			activateob: $("[data-onbusiness='onbusiness']").data('activateob'),
			listid: $("[data-onbusiness='onbusiness']").data('listid'),
			d: '',
		},
		success(data) {
			$("#dialog-onbusiness-modal").html(data);
			if ($('.modal-dialog').find('.ibe-accordion')) {
				dFrontJs.ibe_bootstrap_collapse.modalAccordion($('.modal-dialog'));
			}
			dFrontJs.ibe_modal.closeModal();
		}
	});
  // OnBuisness login function
  const onBusinessLoginAction = (click) => {
    if (tokenUrlOB !== 'null') { // OB Compatibility
      click.preventDefault();
      formOBLogin = click.currentTarget;
      loginOBService();
    }
  };
  const logoutOnbusinessListener = (e) => {
    // LogOut On Business. When success it reload the current page.
    e.preventDefault();
    deleteloggedcookies();
    if (pageONBusiness) {
      window.location.href = pageONBusiness;
    } else {
      window.location.reload();
    }
    /*$.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl0s/Integration/logOut',
      },
      success() {
        // OB Compatibility IBPLUS
        if (obLogoutXML !== 'null') {
          logoutOBService();
        } else {
          const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 18 Dec 1990 12:00:00 UTC; path=/`;
          };
          deleteCookie('IBERIACOM_SSO_CIP');
          window.location.reload();
        }
      },
    });*/
  };
  // Login OnBusiness
  $('.inte-linkOB').on('click', onBusinessLoginAction);
  $('.logOutOB').on('click', logoutOnbusinessListener);
};
/* fill Logged Data
This function fills all imputs that contains the
attribute data-lgfill. This attribute must have a value that
matchs to an object's key of IBPlus / On Business user's info
*/
const fillLoggedData = () => {
  const $inputs = $('[data-lgfill]');
  const data = getCustomerDataSession();
  let $el = '';
  const form = $inputs.closest('form');
  if (data && $inputs.length > 0) {
    $inputs.each(function eah() {
      $el = $(this);
      $el.val(data[$el.data('lgfill')]);
      $el.focus();
      $el.removeAttr('data-lgfill');
      if ($el.hasClass('inte-lgfillblock')) {
        $el.attr('disabled', 'disabled');
        $el.addClass('ibe_form__group--disabled');
      }
    });
    $(form.find(':input').get(0)).focus();
  }
};

window.updateWCSHeaderAvios = () => {
  SessionStorage.remove('retrieveMemberDetailV2');
  const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
  getMemberData(accessCookie, `${localeg}-${marketg}`, 'IBPLUS')
    .then(() => {
      const customerData = getCustomerDataSession();
      const $loggedUser = $('#loggedUser');
      $('#loggedUserAvios,#loggedUserAviosMobile,#loggedUserAviosNew', $loggedUser).html(setNumberFormat(customerData.avios, localeg, marketg));
      $('#loggedUserAvios-Form').html(setNumberFormat(userMenuIbPlus.avios, localeg, marketg));
    })
    .catch(() => {});
}

// set session storage - url redirect upgrade
const setUrlUpgrade = () => {
  const url = window.location.href;  
  if(!isPrivateAreaApp()){
    SessionStorage.set('urlUpgradeRedirect', window.location.href);
  } else if(!url.includes('IRUPG')) {
    SessionStorage.remove('urlUpgradeRedirect');
  }
}

// Exposed functions as window context functions
window.loginOBService = loginOBService;
if (window.location.hostname.match(/^pre\D+/g)) {
  window.reloadLoginVariables = () => {
    (
      {
        localeg, marketg, tokenURL, tokenUrlOB, quadrigam,
        globalAppToken, obLoginXML, obLoginSAMLResp, obLogoutXML, samlOBURL,
      } = retrieveGlobalVariables('reload'));
  };
}

export {
  fillLoggedData,
  dologin,
  loginExternalPartnerService,
  onBusinessLogin,
  loginIBPlus,
	showIBPLUSLoginError,
  logoutOBKeycloak,
  hasReferralUrlSameDomain,
  hasWhitelistedPartnersDomain,
  retrieveStateInfo,
  sendHotelCarsInfo,
  onIberiaPlusOmnichannelPartnerLogin,
  onIberiaPlusWineClubPartnerLogin,
  onIberiaZeroOmniChannelPartnerLogin,
  onIberiaZeroWineClubPartnerLogin
};
