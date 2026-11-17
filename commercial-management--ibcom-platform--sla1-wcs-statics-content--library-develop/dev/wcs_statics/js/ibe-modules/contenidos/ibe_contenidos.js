/******/ (() => { // webpackBootstrap
/*!**********************************************************************!*\
  !*** ./dev/js/inte-modules/ibe-modules/contenidos/ibe_contenidos.js ***!
  \**********************************************************************/
const bannerACC = document.querySelectorAll('[data-contenidosHeroBanner]');
const tarjetasACC = document.querySelectorAll('[data-contenidosTarjetas]');
function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
function checkCookieAndReload() {
  let lastCookieValue = localStorage.getItem('lastCookieValue');
  const currentCookieValue = getCookie('IBERIACOM_SSO_TYPE');
  if (currentCookieValue !== null) {
    if (currentCookieValue !== lastCookieValue) {
      localStorage.setItem('lastCookieValue', currentCookieValue);
      if (!localStorage.getItem('reloaded')) {
        localStorage.setItem('reloaded', 'true');
        location.reload();
      }
    }
  }
}
if (bannerACC || tarjetasACC) {
  if (!localStorage.getItem('reloaded')) {
    setInterval(checkCookieAndReload, 1000);
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      localStorage.removeItem('reloaded');
    }, 5000);
  });
}
/******/ })()
;
//# sourceMappingURL=ibe_contenidos.js.map