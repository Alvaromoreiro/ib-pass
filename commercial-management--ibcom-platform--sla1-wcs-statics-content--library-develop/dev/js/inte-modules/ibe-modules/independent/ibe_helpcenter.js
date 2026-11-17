const openHashReferencedContainer = () => {
  const hash  = decodeURIComponent(window.location.hash);
  if (hash) {
    dFrontJs.ibe_read_more.open(`${hash} > button`);
    $(document).on('loaded-ibe-component-js', (event, data) => {
      if (data.indexOf('ibe-box-more.js') >= 0 && $(`${hash} > button`).length > 0) {
        dFrontJs.ibe_read_more.open(`${hash} > button`);
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
