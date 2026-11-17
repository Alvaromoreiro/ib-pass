import retrieveGlobalVariables from '../../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

const $searchCont = $('#SearcherContent');

// Se hace esta llamada obligatoriamente para que la vieja seetee una variable interna suya
function ajaxCheck(host, parameters) {
  $.ajax({
    method: 'GET',
    url: $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-redemptionEndPoint'),
    complete() {
      window.location.href = host + parameters;
    },
  });
}
// Llamada obligatoria para que pase por la vieja y setee correctamente el Mercado e Idioma
function ajaxLanguage(host, parameters) {
  $.ajax({
    method: 'GET',
    url: `/web/obsmenu.do?language=${localeg}&country=${marketg}&menuId=GUIHOM`,
    beforeSend() {
      dFrontJs.ibe_loading.open('body');
    },
    complete() {
      ajaxCheck(host, parameters);
    },
  });
}

export default ajaxLanguage;
