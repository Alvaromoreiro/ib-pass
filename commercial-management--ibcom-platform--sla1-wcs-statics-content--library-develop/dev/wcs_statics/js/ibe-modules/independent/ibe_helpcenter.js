/******/ (() => { // webpackBootstrap
/*!***********************************************************************!*\
  !*** ./dev/js/inte-modules/ibe-modules/independent/ibe_helpcenter.js ***!
  \***********************************************************************/
const openHashReferencedContainer = () => {
  const hash = decodeURIComponent(window.location.hash);
  if (hash) {
    dFrontJs.ibe_read_more.open("".concat(hash, " > button"));
    $(document).on('loaded-ibe-component-js', (event, data) => {
      if (data.indexOf('ibe-box-more.js') >= 0 && $("".concat(hash, " > button")).length > 0) {
        dFrontJs.ibe_read_more.open("".concat(hash, " > button"));
      }
    });
  }
};
const readMoreForContacts = () => {
  const button = $('[data-target="#collapseotherContacts"]');
  $('#collapseotherContacts').on('hidden.bs.collapse', () => {
    button.html(button.data('collapse-open'));
    button.removeClass('icon-flecha_1_arriba').addClass('icon-flecha_1_abajo');
  });
  $('#collapseotherContacts').on('show.bs.collapse', () => {
    button.closest('.ibe-box-more__content').css('height', '');
    button.html(button.data('collapse-close'));
    button.removeClass('icon-flecha_1_abajo').addClass('icon-flecha_1_arriba');
  });
};
// Execute functions
openHashReferencedContainer();
readMoreForContacts();
/******/ })()
;
//# sourceMappingURL=ibe_helpcenter.js.map