// @ts-check

import { EVENT_NAMES, USER_TYPE } from '../constants/ibe_idt_constants';
import { getCustomerDataSession, isLogado, loggedService } from '../manage/ibe_logged-service';
import { listenerAvatarEvent, removeAvatarEvent, updateLoginAvatar } from './ibe_logavatar';
import * as SessionStorage from '../manage/SessionStorage';
import * as LocalStorage from '../manage/ibe-local-storage';
import { PARTNERS, QUADRIGAMS } from '../constants/ibe_flow_constants';
import { setNameIBPlus, setNumberFormat, toTitleCase } from '../manage/ibe_common';
import retrieveGlobalVariables from './ibe_variables';
import { digestSHA256 } from './ibe_inte-util';


const getUserPartnerSelected = (userId) => {
  const partnerInfo = LocalStorage.get(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE);
  const partnerLastInfo = SessionStorage.get(PARTNERS.STORAGE_KEYS.SESSION_STORAGE);
  const key = userId
  return partnerInfo?.[key] ?? partnerLastInfo;
  
}
/**
 * LATAM WALLET
 */
function handleLatamWalletVisibility() {
  const $noVincBlock = $('.ibe-la-no-vinc');
  // Si el JSP no imprimió la clase (porque el flag está apagado)
  if ($noVincBlock.length === 0) return;

  const membersV2 = SessionStorage.get('retrieveMemberDetailV2');
  const isLatamWalletLogin = membersV2?.partnerLinkedAccounts?.find(
    (partner) => partner.partnerId === 'LA'
  )?.linkActive ?? false;
  
  if (isLatamWalletLogin) {
    $noVincBlock.addClass('hidden').hide();
  } else {
    $noVincBlock.removeClass('hidden').show();
  }
}
const setUserPartnerSelected = (userId, selectedPartner) => {
  const selectedPartnerId = selectedPartner !== 'no'? selectedPartner: '';
  const partnerInfo = LocalStorage.get(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE)|| {};
  const key = userId;
  const userInfo = {
      dontAskPartner: true,
      selectedPartnerId,
      timeStamp: new Date().getTime()
  }
  if(selectedPartnerId.length > 0){
    if (userId === 'session'){
      SessionStorage.set(PARTNERS.STORAGE_KEYS.SESSION_STORAGE, userInfo);
    } else {
      partnerInfo[key] = userInfo;
      if(partnerInfo && Object.keys(partnerInfo).length > 20){
        let minTimeStamp = Number.MAX_SAFE_INTEGER;
        let olderKey;
        for (const auxKey in partnerInfo) {
          if (partnerInfo[auxKey].timeStamp <= minTimeStamp) {
              minTimeStamp = partnerInfo[auxKey].timeStamp;
              olderKey = auxKey;
          }
        }
        if (olderKey) {
            delete partnerInfo[olderKey];
        }
      }
      LocalStorage.set(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE, partnerInfo);
    }
  } else {
    delete partnerInfo[key];
    SessionStorage.remove(PARTNERS.STORAGE_KEYS.SESSION_STORAGE);
    LocalStorage.set(PARTNERS.STORAGE_KEYS.LOCAL_STORAGE, partnerInfo);
  }
}

/**
 * Update the menu of Iberia Plus user with the user restrictions
 * @param userMenuIbPlus User information
 */
export function paintLoggedInfo (userMenuIbPlus) {
  handleLatamWalletVisibility();
  if(isLogado().userLogged && !isLogado().isSoftUser || hiddenSoftLogin == "false"){
    const { localeg, marketg, quadrigam } = retrieveGlobalVariables();

    let dumboLiteral;
    $('#loggedOBUser').remove();
    const $loggedUser = $('#loggedUser');
    $('#loggedUserName', $loggedUser).html(setNameIBPlus(userMenuIbPlus.name, userMenuIbPlus.surname));
    $('.loggedUserName', $loggedUser).html(`${userMenuIbPlus.name} ${userMenuIbPlus.surname}`);
    $('#loggedUserAvios,#loggedUserAviosMobile,#loggedUserAviosNew', $loggedUser).html(setNumberFormat(userMenuIbPlus.avios, localeg, marketg));
    document.getElementById("publicUser")?.classList.add('hidden');
    document.getElementById("loggedUser-Zero")?.classList.add('hidden');
    document.getElementById("loggedUser")?.classList.remove('hidden');
    $('#IBP_Mobile').addClass('hidden');
    $('#IBP_Mobile_Logged').removeClass('hidden');
    $('.ibe-header-new').addClass('ibe-header-new--logged');

    /* MenuIBPlus */
    /* Class to user logged */
    $('#ibplus-form-module').removeClass('iberia-plus-connect--login')
      .addClass('iberia-plus-connect--logged');
    $('.isLogged').removeClass('hidden');
    $('.isnotlogged').remove();
    $('.inte-goToLogin').addClass('hidden');
    // Avios Donation
    if (quadrigam === QUADRIGAMS.AVIOS_DONATION) { $('.inte-ONGlink').removeClass('hidden'); }
    
    /* IMG card */
    let categoryName = null;
    // const $userdefaults = $('#loggedUserDefaults');
    const imgSrcCard = $('#loggedUserDefaults').attr('data-inte-imgRoot') + $('#loggedUserDefaults').attr(`data-inte-${userMenuIbPlus.category}`);
    if (userMenuIbPlus.category) {
      switch (userMenuIbPlus.category) {
        case 'INFINITAPRIME':
          categoryName = 'Iberia Club Infinita Prime';
          break;
        case 'CLASICA':
          categoryName = 'Iberia Club Clásica';
          break;
        case 'PLATINOPRIME':
          categoryName = 'Iberia Club Platino Prime';
          break;
        case 'PLATINO':
          categoryName = 'Iberia Club Platino';
          break;
        case 'ORO':
          categoryName = 'Iberia Club Oro';
          break;
        case 'PLATA':
          categoryName = 'Iberia Club Plata';
          break;
        case 'INFINITA':
          categoryName = 'Iberia Club Infinita';
          break;
        case 'KIDS':
          categoryName = 'Iberia Club Kids';
          break;
        default:
          categoryName =  `Iberia Club ${userMenuIbPlus.category.toLowerCase()}`
      }
    }

    switch (userMenuIbPlus.category) {
      case 'CLASICA':
        $('.inte-logged-clasica').removeClass('hidden');
        break;
      case 'PLATA':
        $('.inte-logged-plata').removeClass('hidden');
        break;
      case 'ORO':
        $('.inte-logged-oro').removeClass('hidden');
        break;
      case 'PLATINO':
        $('.inte-logged-platino').removeClass('hidden');
        break;
      case 'PLATINOPRIME':
        $('.inte-logged-platino').removeClass('hidden');
        break;
      case 'INFINITA':
        $('.inte-logged-infinita').removeClass('hidden');
        break;
      case 'INFINITAPRIME':
        $('.inte-logged-infinita-prime').removeClass('hidden');
        break;
      default:
        break;
    }

    const imgCard = $('<img>', { id: 'ibplus-card-img', src: imgSrcCard, class: 'ibe-login__img' });
    $('#ibplus-card-fig', $loggedUser).empty();
    $('#ibplus-card-fig', $loggedUser).append(imgCard);

    
    const nameCard = $('<p>', { id: 'loggedCardId-NewFormName', class: 'ibe-login__logged-title' });
    $('#ibplus-card-info', $loggedUser).empty();
    $('#ibplus-card-info', $loggedUser).append(nameCard);
    
    //FF dropdown menu with full login and permanent login
    const isSoftUser = isLogado().isSoftUser;
    const ffParagraph = document.createElement("p");
    ffParagraph.classList.add("ibe-login__logged-text");
    ffParagraph.textContent = `${isSoftUser ? '' : 'IB'}${userMenuIbPlus.id}`;
    
    const menuTitle = document.getElementById("loggedCardId-NewFormName");
    if(menuTitle) {
      menuTitle.insertAdjacentHTML('afterend', ffParagraph.outerHTML);
    }
    //
    
    //Confirm pass User permanent login
    if(isSoftUser && userMenuIbPlus.partnersInfo && userMenuIbPlus.partnersInfo.length > 0){
      //$('#passConfirmSoftUser').removeClass('hidden');
      document.getElementById("redirectToSale")?.setAttribute("href", '/integration/ibplus/login/?referralURL=' + encodeURIComponent(window.location.href));
    }
    //

    /* User data */
    const cardIdNew = $('#loggedCardId-NewFormName', $loggedUser);
    if (categoryName != null) {
      cardIdNew.html(categoryName);
    } else {
      cardIdNew.html(userMenuIbPlus.category);
    }

    $('#loggedUserName-Form,#loggedUserNameMobile').html(`${userMenuIbPlus.name} ${userMenuIbPlus.surname}`);
    const titleAux = `${$('#loggedUserName-Form,#loggedUserNameMobile').attr('title')}: ${userMenuIbPlus.name}`;
    $('#loggedUserName-Form').attr('title', titleAux);
    $('#loggedUserAvios-Form').html(setNumberFormat(userMenuIbPlus.avios, localeg, marketg));

    /* Show and hidden forms */
    $('#ibplus-loginform').addClass('hidden');
    $('#ibplus-logged').removeClass('hidden');

    /* Login form hidden */
    $('#loginFormLayout').addClass('hidden');

    if (userMenuIbPlus.partnersInfo && userMenuIbPlus.partnersInfo.length > 0) {
      var partners_link = $("#loggedUserDefaults").data("partners-link");
      var partners_html = "";
      var partner_tmpl;
      var members = "";
      userMenuIbPlus.partnersInfo.forEach(function(partner, indexPartner){
        if(partner.partnerIdentifier === 'IBC'){
          partner_tmpl = $.parseHTML($("#partnerInfoTmplIBC").html());
        } else {
          partner_tmpl = $.parseHTML($("#partnerInfoTmpl").html());
        }
        // eslint-disable-next-line prefer-template
        if (partner.partnerProduct && partner.partnerProduct.percentDiscount && partner.partnerProduct.productTier) {
          // eslint-disable-next-line prefer-template
          let tier_discount = partner.partnerProduct.productTier;
          dumboLiteral = tier_discount +" -"+ partner.partnerProduct.percentDiscount +"%";
        } else {
          let tier_discount = $(partner_tmpl).find('#partnerHeaderLink').data("get-literal");
          dumboLiteral = tier_discount.replace("{{descuento}}", partner.partnerProduct.percentDiscount);
        }

        if(partners_link.length > 0){
          partners_link.forEach(function(link, index){
            let key = Object.keys(link);
            if(key.length > 0){
              if(key[0].includes(partner.partnerIdentifier)){
                $(partner_tmpl).find('#partnerHeaderLink').attr("href", link[key[0]]);
              }
            }
          });
        }

        $(partner_tmpl).find("img.ibe-login__partner-info-logo-img").attr("src", "/wcs/imagenes/partners/icons/partners-logo_"+ partner.partnerIdentifier +".svg");
        $(partner_tmpl).find('label.ibe_form__radio-text').attr("for", "partner_"+ partner.partnerIdentifier);
        $(partner_tmpl).find('.ibe_form__radio-input').attr("id", "partner_"+ partner.partnerIdentifier);
        $(partner_tmpl).find('.ibe_form__radio-input').attr("value", "partner_"+ partner.partnerIdentifier);
        $(partner_tmpl).find('.ibe-login__partners-data-title').html(partner.partnerProduct.productDescription +": ");
        $(partner_tmpl).find('#partnerHeaderLink').attr("title", partner.partnerProduct.productDescription);
        $(partner_tmpl).find('#partnerHeaderLink').html(dumboLiteral);
        partners_html += $(partner_tmpl).prop("outerHTML");
        members +=  (indexPartner > 0 ? ',': '') + partner.partnerProduct.productName;
      });
      window.datalayer_general.member = members;
      window.digital_data.Member = members;

      $("#partnersHeaderContainer").html(partners_html);
      if (userMenuIbPlus.partnersInfo.length > 1) {
        let partnerConfig =  getUserPartnerSelected((userMenuIbPlus.idComplete.indexOf('*') === -1)? userMenuIbPlus.hashEID ?? '' : 'session' );
        let selectedRadio = $(`#partner_${partnerConfig ?partnerConfig.selectedPartnerId: ''}`);
        if( selectedRadio.length > 0){
          selectedRadio.prop('checked', true);
        } else {
          $('#partner_partner_no').prop('checked', true);
        }
        $("#tool_logged").find('.ibe_form__radio-input').off("change").on("change", function(){
          let identifier = $(this).val();

          if(identifier !== "" && identifier !== undefined) {
            identifier = identifier.split("_");
            if(identifier.length > 1) {
              setUserPartnerSelected((userMenuIbPlus.idComplete.indexOf('*') === -1) ? (userMenuIbPlus.hashEID ?? '') : 'session', identifier[1]);
            }
          }
        });
      } else {
        $('.ibe-login__partners-option:has(#partner_no), .ibe-login__partners__title').addClass('hidden').closest('.ibe-login__group').addClass('u-pt-none').css({'border-top': 'none'});
        $('.ibe-login__partners-option>label').addClass('ibe-login__partners-info-no-radio');
        $('.ibe_form__radio ibe-login__partners-option:visible').addClass('u-mt-none');

      }
    } else {
      $('.ibe-login__group:has(.ibe-login__partners)').addClass('hidden').siblings('.ibe-login__group--no-border-bottom').removeClass('ibe-login__group--no-border-bottom');
    }
    listenerAvatarEvent();
    updateLoginAvatar();

  } else {
    //Anonymous Header
    $('#publicUser').removeAttr('style').removeClass('hidden');
    $('.isLogged').addClass('hidden');
  }
};

/**
 * Update the header and menu information for Iberia Zero users
 * @param {*} userInfo User information for the user
 */
export function paintZeroLoggedInfo (userInfo) {
  if(isLogado().userLogged && !isLogado().isSoftUser || hiddenSoftLogin == "false"){
    $('.inte-loggedUsernameZero').html((typeof (userInfo.name) === 'string' && userInfo.name.length > 0)? `${userInfo.name} ${userInfo.surnames}` : userInfo.email);
    document.getElementById("publicUser")?.classList.add('hidden');
    document.getElementById("loggedUser")?.classList.add('hidden');
    document.getElementById("loggedUser-Zero")?.classList.remove('hidden');
    listenerAvatarEvent();
    updateLoginAvatar();
  } else {
    //Anonymous Header
    $('#publicUser').removeAttr('style').removeClass('hidden');
    $('.isLogged').addClass('hidden');
  }
}

export function paintAnonymousLoggedInfo () {
  $('#publicUser').removeAttr('style').removeClass('hidden'); /* TopHeader */
  /* MenuIBPlus */
  $('.isLogged').addClass('hidden');
}

/**
 *
 * @returns {Promise<any>} Return the user information
 */
function userInfoProviderWrapper() {
    return new Promise((resolve, reject) => {
        const service = loggedService();
        service.done(() => {
            const customerData = getCustomerDataSession();
            const loggedInfo = isLogado();
            resolve({ loggedInfo, customerData });
        });
        service.fail(() => {
            reject();
        });
    });
}

/**
 * Update WCS cached data
 */
async function updateCachedData (information) {
  if (!information) {
    SessionStorage.remove('customerData');
    SessionStorage.remove('retrieveMemberDetailV2');
    SessionStorage.remove('customerDataZero');
    SessionStorage.remove('retrieveMemberDetailZero');
    return;
  }
  const { email, name, surname, tierLevel, avios } = information;
  const customerData = getCustomerDataSession();
  const hashEID = await email && digestSHA256(email);
  const { userType } = isLogado();
  if (!customerData || !userType) return;

  customerData.email =  email ?? customerData.email;
  customerData.hashEID = hashEID ?? customerData.hashEID;
  customerData.name = name ? toTitleCase(name) : customerData.name;

  if ( userType === USER_TYPE.IBERIA_PLUS ) {

    customerData.surnames = surname ? customerData.surnames.replace(customerData.surname, surname) : customerData.surnames;
    customerData.surname = surname ? toTitleCase(surname) : customerData.surname;
    customerData.category = tierLevel?.replace(' ', '') ?? customerData.category;
    customerData.avios = avios ?? customerData.avios;
    SessionStorage.set('customerData', customerData);

  } else if ( userType === USER_TYPE.IBERIA_ZERO ) {
    
    customerData.surnames = !surname || surname.includes('@') ? customerData.surnames : toTitleCase(surname);
    SessionStorage.set('customerDataZero', customerData);  
  }
}

/**
 * Update header main function for event listeners, change header information
 * @param {Event} Event information of event
 */
export function onUpdateUserHeader({ detail }) {
    updateCachedData(detail)
      .then(() => userInfoProviderWrapper())
      .then((res) => {
              removeAvatarEvent();
              if (res.loggedInfo.userType === USER_TYPE.IBERIA_PLUS) {
                  paintLoggedInfo(res.customerData);
              } else if (res.loggedInfo.userType === USER_TYPE.IBERIA_ZERO) {
                  paintZeroLoggedInfo(res.customerData);
              } else if (res.loggedInfo.userType === USER_TYPE.ON_BUSINESS) {
                // Filler to do ONB update header
              } else {
                paintAnonymousLoggedInfo();
              }
          })
      .catch(() => {});
}

/**
 * Attach an event listener to update the header with the user info manually when needed.
 */
export function attachUpdateUserListener() {
    window.addEventListener(EVENT_NAMES.UPDATE_USER_HEADER, onUpdateUserHeader);
}

/**
 * Detach the event listener to update the header with the user info manually when needed.
 */
export function detachUpdateUserListener() {
    window.removeEventListener(EVENT_NAMES.UPDATE_USER_HEADER, onUpdateUserHeader);
}
