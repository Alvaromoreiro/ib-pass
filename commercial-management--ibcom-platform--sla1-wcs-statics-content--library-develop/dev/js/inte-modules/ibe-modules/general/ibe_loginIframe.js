import retrieveGlobalVariables from './ibe_variables';
import { dologin, showIBPLUSLoginError } from './ibe_login';
import {deleteloggedcookies} from "../manage/ibe_common";
let {
  localeg, localemasterg, marketg, salesforceClientId, salesforceURL,
} = retrieveGlobalVariables();

if(localemasterg!=""){
  localeg = localemasterg;
}

const urlLoginSalesforce = `${salesforceURL}authorize/expid_2${marketg.toUpperCase()}${localeg.toLowerCase()}`;
const clientIberiaSalesforce = salesforceClientId;
let desktopCollapsable, desktopContainer, responsiveContainer, responsiveModalClose, loginResponsive ,isLoadedIframeCollapsable = false, isLoadedIframeResponsive= false;




const openCollapsable = ()=>{
  let iframe;
  if(!isLoadedIframeCollapsable) {
    dFrontJs.ibe_loading.open('[data-modal-login="desktop"]');
    isLoadedIframeCollapsable = true;
    iframe = generateIframe();
    desktopContainer.append(iframe);
  }
};

const openResponsiveModal = (e) => {
  let iframe;
  if (!isLoadedIframeResponsive) {
    dFrontJs.ibe_loading.open('[data-modal-login="mobile"]');
    //isLoadedIframeResponsive = true;
    iframe = generateIframe();
    responsiveContainer.append(iframe);
  }

}

const messageIframe = (message) => {
  const iframe = $('.inte_loginIframe:visible');
  const isResponsive = iframe.closest('[data-modal-login="mobile"]').length > 0;
  if ((typeof(message.data) === 'string') && message.data.indexOf('ibLoginHeader')>=0) {
    let splitData = message.data.split('_');
    if(splitData[0] === 'ibLoginHeaderIframeHeight'){
        iframe.css({height: splitData[1] });
        if(!isResponsive){
          dFrontJs.ibe_loading.close('[data-modal-login="desktop"]');
        } else {
          dFrontJs.ibe_loading.close('[data-modal-login="mobile"]');
        }
    }
  }
}
const onLoginPage = () => {
  const iframe = $('.inte_loginIframe:visible');
  const isResponsive = iframe.closest('[data-modal-login="mobile"]').length > 0;
  if(!isResponsive){
    desktopCollapsable.collapse('hide');
  }else {
    loginResponsive.addClass('hidden');
  }
  dFrontJs.ibe_loading.open('body');
}

const afterLogin = (evt) => {
  loginResponsive.removeClass('hidden');
  /*if (loginResponsive.dialog('instance')) {
    loginResponsive.dialog('close');
  }*/
  dFrontJs.ibe_modal.nativeCloseModal(evt, true);
  dologin.init();
};

const afterFailureLogin = (evt) => {
  loginResponsive.removeClass('hidden');
  /*if (loginResponsive.dialog('instance')) {
    loginResponsive.dialog('close');
  }*/
  dFrontJs.ibe_modal.nativeCloseModal(evt, true);
  showIBPLUSLoginError({ errorKey: evt?.detail?.payload ?? 'general' });
  resetIframe();
  deleteloggedcookies();
  dologin.init();
};

const resetIframe = () => {
  dFrontJs.ibe_loading.close('[data-modal-login="desktop"]');
  dFrontJs.ibe_loading.close('[data-modal-login="mobile"]');
  const iframe = document.querySelector('.inte_loginIframe');
  iframe.src = iframe.src;
};

const generateIframe  = ()=>{
  const iframe = $('<iframe\>', {
    src :  `${urlLoginSalesforce}?client_id=${clientIberiaSalesforce}&redirect_uri=${window.location.origin}/integration/ibplus/login/&prompt=login&response_type=code`,
    'data-cy':'login-home',
    class:'inte_loginIframe',
  });

  window.removeEventListener('message', messageIframe);
  window.addEventListener('message', messageIframe);
  window.removeEventListener('IDENTITY_LOGIN_ONPAGE', onLoginPage);
  window.addEventListener('IDENTITY_LOGIN_ONPAGE', onLoginPage);
  window.removeEventListener('IDENTITY_LOGIN_SUCCESS', afterLogin);
  window.removeEventListener('IDENTITY_LOGIN_FAILURE', afterFailureLogin);
  window.addEventListener('IDENTITY_LOGIN_SUCCESS', afterLogin);
  window.addEventListener('IDENTITY_LOGIN_FAILURE', afterFailureLogin);
  iframe.on('error', function onerror (){
    const iframe = $('.inte_loginIframe:visible');
    const isResponsive = iframe.closest('[data-modal-login="mobile"]').length > 0;
    if(!isResponsive) {
      desktopCollapsable.collapse('hide');
    } else {
      if (loginResponsive.dialog('instance')) {
        loginResponsive.dialog('close');
      }
    }
    isLoadedIframeCollapsable = false;
    isLoadedIframeResponsive = false;
    $(this).remove();
  });

  return iframe;
}

const init = () => {
  desktopContainer = $('[data-modal-login="desktop"]');
  responsiveContainer = $('[data-modal-login="mobile"]');
  responsiveModalClose = $('.fc-dialog-login [data-dialog="close"]');
  desktopCollapsable = $('#tool_login');
  loginResponsive = $('.fc-dialog-login');
  isLoadedIframeCollapsable = false;
  isLoadedIframeResponsive = false;
  desktopCollapsable.off('show.bs.collapse', openCollapsable);
  desktopCollapsable.on('show.bs.collapse', openCollapsable);
  
  $("[data-modal-id]").off("click");
  $("[data-modal-id]").on("click", dFrontJs.ibe_modal.nativeShowModal);
  loginResponsive.off('dialogopen', openResponsiveModal);
  loginResponsive.on('dialogopen', openResponsiveModal);
  
  window.onresize = dFrontJs.ibe_modal.nativeCloseModal;
}

export { init }
