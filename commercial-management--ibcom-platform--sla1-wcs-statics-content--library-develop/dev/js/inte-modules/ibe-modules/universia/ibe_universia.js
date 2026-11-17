import { isLogado, getMemberIdByToken } from "../manage/ibe_logged-service";
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from '../manage/SessionStorage';

const { localeg, marketg, retrieveMemberDetailV2, quadrigam } = retrieveGlobalVariables();

const zero = document.getElementById("logadoZero");
const nologado = document.getElementById("noLogado");
const IBplusActivo = document.getElementById("logadoPlusActivo");
const IBplusNoActivo = document.getElementById("logadoPlusSinPlan");
const loginURL = document.getElementById("loginUniversia");
const partnerAct = document.getElementById("partnerAct");
const isLogged = isLogado();
const regis_Universia = document.querySelector(".inte-register");

    
if(partnerAct){
  partnerAct.addEventListener('click', async ()=>{
    const authorizationToken = Cookies.get('IBERIACOM_SSO_ACCESS');
    const userId = getMemberIdByToken();
    const serviceRetrieveMemberDetailV2 = retrieveMemberDetailV2 + "partner/" + userId + "?market=" + marketg;
    const configuracion = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': localeg,
        Authorization: `Bearer ${ authorizationToken }`,
      },
      body: JSON.stringify({ productAlias: ['04'] })
    }
    try {
      const response = await fetch(serviceRetrieveMemberDetailV2, configuracion);
      if (!response.ok) {
        throw new Error(`La solicitud falló con código ${response.status}`);
      }
      const data = await response.json();
      SessionStorage.remove('customerData');
      SessionStorage.remove('retrieveMemberDetailV2');
      window.location.href = `/${marketg}/${localeg}/?partner=ZSUN`;
    } catch (error) {
      return console.log("Error en la solicitud: ", error);
    }
  })
}

if(loginURL){
  loginURL.addEventListener('click', ()=>{
    const anchoPantalla = window.innerWidth;
    if(anchoPantalla <= 768){
      const btnLoginRS = document.querySelector(".inte-login-btnModal");
      btnLoginRS.click();
    } else if(anchoPantalla > 768) {
      const btnLogin = document.querySelector('[data-target="#tool_login"]');
      btnLogin.click();
    }
  })
}

$(document).ready(() => {
  modalStyle();
  if(nologado != null){
    if(isLogged.userLogged && isLogged.userType === 'IBPLUS') {
      if(userMenu.partnersInfo.length > 0){
        if(userMenu.partnersInfo[0].partnerIdentifier === 'SUN'){
          zero.classList.add("hidden");
          nologado.classList.add("hidden");
          IBplusActivo.classList.remove("hidden");
          IBplusNoActivo.classList.add("hidden");
        } else {
          IBplusActivo.classList.add("hidden");
          IBplusNoActivo.classList.remove("hidden");
          zero.classList.add("hidden");
          nologado.classList.add("hidden");
        }
      } else {
        IBplusNoActivo.classList.remove("hidden");
        zero.classList.add("hidden");
        nologado.classList.add("hidden");
      }
    } else if (isLogged.userLogged && isLogged.userType === 'IBZERO') {
      if(zero){
        redirectToUniversia();
        zero.classList.remove("hidden");
        nologado.classList.add("hidden");
      }
    } else {
      zero.classList.add("hidden");
      nologado.classList.remove("hidden");
    }
  }
});

function redirectToUniversia(){
  const urlZero = document.getElementById('urlZero');
  let urlHeader = document.getElementById('redirectUniversia');
  const urlText = urlZero.getAttribute('href');
  urlHeader.setAttribute('href', urlText);
}

if(quadrigam === "SUNIVERSIA"){
  regis_Universia.classList.add("hidden");
}

var _buttonCloseClick = function (e) {
  if ($(this).parents('.ibe-dialog').data('reload') !== undefined) {
    document.location.reload(false);
  } else {
    e.stopImmediatePropagation();
    $('body').removeClass('modal-open');
    $('html').css('overflow', '');
    $(this).parents('.ibe-dialog').dialog('close');
    if ($(this).parents('.ibe-dialog').hasClass('defaultModal')) {
      $(this).parents('.defaultModal').find('.ibe-modal').html('');
    }
    $('html').scrollTop($focusin);
  }
};
function modalStyle(){
  const urlPartner = new URLSearchParams(window.location.search);
  var $buttonClose;
  if (urlPartner.has('partner') && urlPartner.get('partner') === 'ZSUN' || urlPartner.get('partner') === 'zsun') {
  
      $.ajax({
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/Universia/modalsDialog',
          idmodalUpgrade:  $('[data-universia]').data('idIdmodalupgrade'),
          idmodalActivated: $('[data-universia]').data('idIdmodalactivated'),
          market: $('#mercado').val(),
          locale: $('#idioma').val(),
          d: '',
        },
        success(data) {
          $('[data-universia]').html(data);
          const buttonUpgrade = document.getElementById('buttonUpgrade');
          buttonUpgrade.click();
          $buttonClose = $('[data-dialog="close"]');
          //Close dialog on Button close
          $buttonClose.off('click', _buttonCloseClick);
          $buttonClose.on('click', _buttonCloseClick);

        }
      });
  } else if (urlPartner.has('partner') && urlPartner.get('partner') === 'SUN' || urlPartner.get('partner') === 'sun') {
    const modalActivated = document.getElementById('modalActivado');

      $.ajax({
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/Universia/modalsDialog',
          idmodalUpgrade:  $('[data-universia]').data('idIdmodalupgrade'),
          idmodalActivated: $('[data-universia]').data('idIdmodalactivated'),
          market: $('#mercado').val(),
          locale: $('#idioma').val(),
          d: '',
        },
        success(data) {
          $('[data-universia]').html(data);
          const buttonActivated = document.getElementById('buttonActivated');
          buttonActivated.click();
          $buttonClose = $('[data-dialog="close"]');
          //Close dialog on Button close
          $buttonClose.off('click', _buttonCloseClick);
          $buttonClose.on('click', _buttonCloseClick);
        }
      });
  }
}


