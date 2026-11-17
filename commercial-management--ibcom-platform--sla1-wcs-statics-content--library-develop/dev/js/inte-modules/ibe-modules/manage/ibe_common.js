import * as SessionStorage from './SessionStorage';
import * as LocalStorage from './ibe-local-storage';
const common = {
  MAX_ATTEMPS: 2,
  MAX_ATTEMPSCLAIMS: 2,
};
function changeformatdate(date, formatIn, formatOut) {
  const formatInUp = formatIn.toUpperCase();
  const formatOutUp = formatOut.toUpperCase();
  const currDate = date.substring(formatInUp.indexOf('D'), formatInUp.indexOf('D') + 2);
  const currMonth = date.substring(formatInUp.indexOf('M'), formatInUp.indexOf('M') + 2);
  const currYear = date.substring(formatInUp.indexOf('Y'), formatInUp.indexOf('Y') + 4);
  const dateOut = formatOutUp.replace('DD', currDate).replace('MM', currMonth).replace('YYYY', currYear);
  return dateOut;
}
function getDateFormat(date, inUTC) {
  const dateOut = new Date(date);
  let day = (!inUTC) ? dateOut.getDate() : dateOut.getUTCDate();
  let month = (!inUTC) ? (dateOut.getMonth() + 1) : (dateOut.getUTCMonth() + 1);
  let hour = (!inUTC) ? dateOut.getHours() : dateOut.getUTCHours();
  const year = (!inUTC) ? dateOut.getFullYear() : dateOut.getUTCFullYear();
  let minutes = (!inUTC) ? dateOut.getMinutes() : dateOut.getUTCMinutes();
  let seconds = (!inUTC) ? dateOut.getSeconds() : dateOut.getUTCSeconds();

  day = day <= 9 ? `0${day}` : `${day}`;
  month = month <= 9 ? `0${month}` : `${month}`;
  hour = hour <= 9 ? `0${hour}` : `${hour}`;
  minutes = minutes <= 9 ? `0${minutes}` : `${minutes}`;
  seconds = seconds <= 9 ? `0${seconds}` : `${seconds}`;
  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
}

function calculateDelimiterMiles(locale, market) {
  let delimiter = '';
  if (locale === 'en' || locale === 'ja' || locale === 'zh') {
    delimiter = ',';
  } else if (locale === 'fr') {
    delimiter = ' ';
    if (market === 'CH') {
      delimiter = "'";
    } else if (market === 'BE') {
      delimiter = '.';
    }
  } else if (locale === 'ru') {
    delimiter = ' ';
  } else {
    delimiter = '.';
    if (locale === 'es') {
      delimiter = '.';
      if (market === 'MX' || market === 'PA' || market === 'PR' || market === 'DO' || market === 'GT' || market === 'US') {
        delimiter = ',';
      }
    } else if (locale === 'de') {
      if (market === 'CH') {
        delimiter = "'";
      }
    }
  }
  return delimiter;
}

function setNumberFormat(input, locale, market) {
  const delim = calculateDelimiterMiles(locale, market);
  const num = ((input.toString()).split('')).reverse();
  let numFormat = '';
  let i = 0;
  for (i = num.length; i > 0; i--) {
    if (i % 3 === 0 && i !== num.length) {
      numFormat = numFormat + delim + num[i - 1];
    } else {
      numFormat += num[i - 1];
    }
  }
  return numFormat;
}

function toTitleCase(str) {
  return str.replace(/[A-zÀ-ú]\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function setRolCIP(rolCIP) {
    let rol = rolCIP;
    if (rol.length > 20) {
        rol = `${rol.substring(0, 16)}...`;
    }
    return rol;
}
function setNameIBPlus(name, surname) {
  let nameFormat = `${name} ${surname}`;
  if (nameFormat.length > 20) {
    nameFormat = `${nameFormat.substring(0, 16)}...`;
  }
  return nameFormat;
}
function deleteloggedcookies() {
  const expires = new Date('01 Jan 1970 00:00:00 UTC');
  const splitted = window.location.hostname.split('.');
  Cookies.set('IBERIACOM_SSO_ACCESS_SALESFORCE', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ACCESS_TO_SALESFORCE', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_REFRESH_SALESFORCE', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ACCESS', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ACCESS_TO', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_REFRESH', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_REFRESH_TO', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ONB_ACCESS', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ONB_ACCESS_TO', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ONB_REFRESH', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_ONB_REFRESH_TO', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_INFO', '', { path: '/', expires, sameSite: 'strict' });
  Cookies.set('IBERIACOM_SSO_TYPE', '', { path: '/', expires, sameSite: 'strict' });
  // Cookie Session IBPLUS
  Cookies.remove('IBERIACOM_SSO_SESION',{path: '/', domain:`.${splitted.slice(splitted.length - 2).join('.')}`})



  //Delete cookie contenidos
  LocalStorage.remove('reloaded');
  LocalStorage.remove('lastCookieValue');
  // Delete also Session storage info
  LocalStorage.remove('IB_PERMANENT_LOGIN');
  LocalStorage.remove('ib-avatar-cache');
  SessionStorage.remove('customerData');
  SessionStorage.remove('customerDataOB');
  SessionStorage.remove('accessTokenOB');
  SessionStorage.remove('customerDataZero');
  SessionStorage.remove('ib-booking-partnerPreferences');
  // SessionStorage.remove('ib-identity-stateReferral');
  
  /* OB-Compatibility IBPLUS */
  if ($('#loggedUserDefaults').attr('data-inte-integrationHost') !== 'null' && $('#loggedUserDefaults').attr('data-inte-ibplusLogoutURL') !== 'null') { // OB Compatibility IBPLUS
    Cookies.set('IBERIACOM_IDENTIFICATION', '', { path: '/', expires, sameSite: 'strict' });
  }
  if (window.obLogoutXML !== 'null') { // OB Compatibility
    Cookies.set('IBERIACOM_SSO_CIP', '', { path: '/', expires, sameSite: 'strict' });
  }
}

function pushToMonetate() {
  const variables = [];
  if (window.monetateQ) {
      setTimeout(() => {
          $.each(datalayer_general, (key, value) => {
              variables.push({ name: `dt_g_${key}`, value });
          });
          $.each(digital_data, (key, value) => {
              variables.push({ name: `dd_${key}`, value });
          });
          window.monetateQ.push(['setPageType', datalayer_general.quadrigam]);
          window.monetateQ.push(['setCustomVariables', variables]);
          window.monetateQ.push(['trackData']);
      }, 250);
  }
}
function updateDatalayer(type) {
  if (typeof (window.DigitalChange) === 'function') {
    window.DigitalChange(type, datalayer_general, datalayer_ecommerce);
  }
  pushToMonetate();
}

function updateDigitalData(type){
  if (window.dataLayer && typeof (window.dataLayer.push) === 'function') {
    window.dataLayer.push(digital_data,{'event':type});
  }
}

export {
  common,
  changeformatdate,
  getDateFormat,
  deleteloggedcookies,
  setNameIBPlus,
  setRolCIP,
  toTitleCase,
  setNumberFormat,
  updateDatalayer,
  updateDigitalData,
  pushToMonetate,
};
