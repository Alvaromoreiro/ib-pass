import retrieveGlobalVariables from '../general/ibe_variables';

import { updateDigitalData } from "../manage/ibe_common";
import { getCustomerDataSession, isLogado, logoutIBPlusService, generateLoginEvent} from '../manage/ibe_logged-service';
import { loginExternalPartnerService } from '../general/ibe_login';
import * as SessionStorage from '../manage/SessionStorage';
const { localeg, marketg, wineClubDomain} = retrieveGlobalVariables();
const $button = $('a[data-functionalcode=WINECLUB]');
const storageErrorIBPLUSkey = 'ibplus-login-error';
let url;
/*Push event view */
digital_data.Quadrigam = 'BOWINE';
updateDigitalData('view');
/* Wine club button */
const wineclubButton = (event) => {
  const isLogged = isLogado();
  const acceptedTermsAndConditions = () => {
    $('#inte-wineclubModal').dialog('close');
    dFrontJs.ibe_loading.open('body');
    loginExternalPartnerService('wine_club')
      .done((data) => {
        if (data.params && data.params.length > 0) {
          const form = $('<form>', { method: 'POST', action: data.url, class: 'hidden' });
          form.append($('<input>', { name: 'market', value: marketg.toUpperCase() }))
            .append($('<input>', { name: 'language', value: localeg.toLowerCase() }))
            .append($('<input>', { name: data.params[0].paramName, value: data.params[0].paramValue }));

          $('body').append(form);
          logoutIBPlusService().always(() => {
            form.submit();
          });
        } else {
          logoutIBPlusService().always(() => {
            window.location.href = url;
          });
        }
      })
      .fail(() => {
        logoutIBPlusService().always(() => {
          window.location.href = url;
        });
      });
  };
  event.preventDefault();
  if (isLogged.userLogged && isLogged.userType === 'IBPLUS') {
    dFrontJs.ibe_modal.createModal('#inte-wineclubModal');
    dFrontJs.ibe_modal.showModal('#inte-wineclubModal');
    $('.inte-acceptWineClub').on('click', acceptedTermsAndConditions);
  } else {
    window.location.href = url;
  }
};
if ($button.length > 0) {
  url = $button.attr('href');
  $button.attr('href', '#');
  $button.on('click', wineclubButton);
}

/*Resize images cdv module by resolutions (module through spain)*/

$(window).resize(function(){
  if($('div.ibe-wine-club__card-info--container').length > 0){
    var resize = true;
    imageCardResolutions(resize);
  }
});

if($('div.ibe-wine-club__card-info--container').length > 0){
  var resize = false;
  imageCardResolutions(resize);
}

function imageCardResolutions(resize){
      var bg = $('div.ibe-wine-club__card-info--container').css('background-image');
      var urlinit = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
      var auxInt = urlinit.lastIndexOf(".");
      var bseImagen,extImagen;
      if(!resize){
        bseImagen = urlinit.substring(0, auxInt);
        extImagen = urlinit.substring(auxInt, urlinit.length);
      }else{
        bseImagen = urlinit.substring(0, auxInt);
        extImagen = urlinit.substring(auxInt, urlinit.length);
        var auxInt2 = bseImagen.lastIndexOf("_");
        bseImagen = bseImagen.substring(0, auxInt2);
      }
      
      var url_final = bseImagen+'_1280'+extImagen;
      var windowsize = $(window).width();
        if(windowsize >= 1280){
            url_final = bseImagen+'_1280'+extImagen;
          }else if(windowsize >= 1024){
            url_final = bseImagen+'_1024'+extImagen;
          }else if(windowsize >= 768){
            url_final = bseImagen+'_768'+extImagen;
          }else if(windowsize >= 480){
            url_final = bseImagen+'_480'+extImagen;
          }else if(windowsize >= 320){
            url_final = bseImagen+'_320'+extImagen;
          }

      $('div.ibe-wine-club__card-info--container').css('background-image','url('+url_final+')');
}

/*Clic seccion: ¿Como funciona? -> Accede al club*/
$('.ibe-wine-club__how-it-works--step__description--link').on('click', function(){
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'como funciona: accede al club',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: ¿Y por qué un club del vino Iberia?*/
$('div.ibe-wine-club__card-link--card-link > a').on('click', function(){
  var subseccion = $(this).parent().parent().find('.ibe-wine-club__card-link--card-title > a > span').html();
  subseccion = subseccion.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'').toLowerCase();
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'club del vino iberia: ' + subseccion.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: Encuentra tu vino perfecto*/
$('.ibe-wine-club__icon-banner--icon-col-button').on('click', function(){
  var subseccion = $(this).parent().find('.ibe-wine-club__icon-banner--icon-col-title');
  var textsubseccion = '';
  $.each($(subseccion), function () {
    textsubseccion += $(this).html();
  });
  textsubseccion = textsubseccion.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'').toLowerCase();
  
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'encuentra tu vino perfecto: ' + textsubseccion.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: España a través del paladar… -> Experiencias Gourmet con maridaje estelar.*/
$('div.ibe-wine-club__card-info--text-title > a').on('click', function(){
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'españa a traves del paladar: experiencias gourmet',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: España a través del paladar… -> Ver todas las experiencias*/
$('div.ibe-wine-club__card-info > a').on('click', function(){
   const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'españa a traves del paladar: ver todas',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: Enamórate de España -> Ver experiencias */
$('.ver-experiencia-fall-in-love').on('click', function(){
  var subseccion = $(this).parent().parent().find('.title').html();
  subseccion = subseccion.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'').toLowerCase();

  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'enamorate de españa: ' + subseccion.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }
 
  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: Enamórate de España -> Ver todas las experiencias */
$('.ibe-wine-club__fall-in-love--button').on('click', function(){
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'enamorate de españa: ver todas',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*Clic seccion: Botón Banner -> Accede al club del vino */
$('.ibe-wine-club__banner--img-btn').on('click', function(){
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'wine club',
    eventAction: 'clic',
    eventLabel: 'banner: accede al club vino',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

  if(isLogado().userType ==='IBPLUS' || isLogado().userType ==='IBZERO'){
    redirectPartnerWineClubUserlogged($(this));
    return false;
  }
});

/*When user is logged in Iberia (IBplus/Ibzero) and click on any button
 redirect to the partner cdv with the required information*/
function redirectPartnerWineClubUserlogged(elemento){
  let referral = wineClubDomain + elemento.attr('href').split('.com')[1];
  var pattern = /^((http|https|ftp):\/\/)/;
  if(!pattern.test(referral)) {
      referral = "https://" + referral;
  }
  if(isLogado().userType ==='IBPLUS' && !isLogado().isSoftUser){
    onIberiaPlusWineClubPartnerLogin({ referralURL: referral });
  }else if(isLogado().userType ==='IBZERO' && !isLogado().isSoftUser) { 
    onIberiaZeroWineClubPartnerLogin({ referralURL: referral });
  }else if(isLogado().isSoftUser){
    if(hiddenSoftLogin == "false"){
      const urlRedirectLoginIB = '/integration/ibplus/login/?externalpartner=ib_dig_wineclub&referralURL='+referral+'&market='+`${marketg}${localeg}`;
      window.location.href = urlRedirectLoginIB;
    } else {
      window.location.href = elemento.attr('href');
    }
  } 
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
  onWineClubPartnerLogin({ referralURL, userInformation})
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
  onWineClubPartnerLogin({ referralURL, userInformation })
}

/**
 * When login is from an external Wine Club partner, redirect to the partner with the required information.
 */
function onWineClubPartnerLogin ({ referralURL, userInformation }) {
  
  const { accessToken, refreshTokenTxt } = isLogado();
  
  var $form = $("<form>").attr("method", "POST").attr("action", referralURL).attr("target","_blank").css("display", "none");
  var $hiddenField1 = $("<input type='hidden' >").attr("name", 'accessToken').val(accessToken);
  var $hiddenField2 = $("<input type='hidden' >").attr("name", 'refreshToken').val(refreshTokenTxt);
  var $hiddenField3 = $("<input type='hidden' >").attr("name", 'userInformation').val(window.btoa(JSON.stringify(userInformation)));
  $form.append( $hiddenField1 );
  $form.append( $hiddenField2 );
  $form.append( $hiddenField3 );
  $('body').append( $form );
  $form.submit();
}