import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

// Set language in old platform
$('[data-functionalcode=eStore]').click((event) => {
  const { href } = event.target;
  event.preventDefault();
  $.ajax({
    method: 'GET',
    url: `/web/obsmenu.do?language=${localeg}&country=${marketg}&menuId=GUIHOM`,
    beforeSend() {
      dFrontJs.ibe_loading.open('body');
    },
  }).always(() => {
    dFrontJs.ibe_loading.close('body');
    window.open(href, '_blank');
  });
});
